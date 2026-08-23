import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue, runTransaction, onDisconnect } from 'firebase/database'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const configurado = Boolean(config.apiKey && config.databaseURL && config.projectId)

let banco = null

function obterBanco() {
  if (!configurado) return null
  if (!banco) {
    try {
      banco = getDatabase(initializeApp(config))
    } catch (e) {
      console.warn('Pelotense: falha ao iniciar sincronização na nuvem.', e)
      return null
    }
  }
  return banco
}

export function salaAtual() {
  try {
    const bruto = new URLSearchParams(window.location.search).get('sala') || ''
    const limpa = bruto.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32)
    return limpa || 'padrao'
  } catch {
    return 'padrao'
  }
}

export function nuvemAtiva() {
  return Boolean(obterBanco())
}

const LIMITE_ECO = 16
const publicacoesRecentes = new Map()

function marcarPublicacao(canal, texto) {
  const lista = publicacoesRecentes.get(canal) || []
  lista.push(texto)
  while (lista.length > LIMITE_ECO) lista.shift()
  publicacoesRecentes.set(canal, lista)
}

function ehEcoProprio(canal, texto) {
  return (publicacoesRecentes.get(canal) || []).includes(texto)
}

const ID_CLIENTE = (() => {
  try {
    const chave = 'pelotense:id-cliente'
    let id = sessionStorage.getItem(chave)
    if (!id) {
      id = Math.random().toString(36).slice(2, 10)
      sessionStorage.setItem(chave, id)
    }
    return id
  } catch {
    return `s${Math.random().toString(36).slice(2, 10)}`
  }
})()

const EXPIRA_DONO_MS = 15000

let statusControle = 'verificando'
const ouvintesStatus = new Set()
const pendentes = new Map()
let timerBatimento = null

function caminhoControle() {
  return `salas/${salaAtual()}/controle`
}

function donoBloqueante(atual) {
  return Boolean(
    atual &&
      typeof atual === 'object' &&
      atual.dono &&
      atual.dono !== ID_CLIENTE &&
      Date.now() - (Number(atual.ts) || 0) < EXPIRA_DONO_MS
  )
}

export function ehControlador() {
  return statusControle === 'ativo'
}

export function inscreverStatusControle(ouvinte) {
  ouvintesStatus.add(ouvinte)
  ouvinte(statusControle)
  const db = obterBanco()
  if (!db) return () => ouvintesStatus.delete(ouvinte)
  const pararEscuta = onValue(
    ref(db, caminhoControle()),
    (snapshot) => {
      const atual = snapshot.val()
      const anterior = statusControle
      if (!atual || typeof atual !== 'object' || !atual.dono) statusControle = 'livre'
      else if (atual.dono === ID_CLIENTE) statusControle = 'ativo'
      else statusControle = donoBloqueante(atual) ? 'bloqueado' : 'livre'
      if (statusControle !== anterior) {
        if (statusControle === 'ativo') iniciarBatimento()
        else pararBatimento()
        if (statusControle === 'ativo') esvaziarPendentes()
        ouvintesStatus.forEach((fn) => fn(statusControle))
      }
    },
    (e) => console.warn('Pelotense: falha ao monitorar controle da sala.', e)
  )
  return () => {
    pararEscuta()
    pararBatimento()
    ouvintesStatus.delete(ouvinte)
  }
}

function iniciarBatimento() {
  const db = obterBanco()
  if (!db || timerBatimento) return
  const referencia = ref(db, caminhoControle())
  try {
    onDisconnect(referencia).remove()
  } catch {}
  const bater = () => {
    set(referencia, { dono: ID_CLIENTE, ts: Date.now() }).catch(() => {})
  }
  bater()
  timerBatimento = setInterval(bater, 8000)
}

function pararBatimento() {
  if (timerBatimento) {
    clearInterval(timerBatimento)
    timerBatimento = null
  }
}

export function reivindicarControle({ forcar = false } = {}) {
  const db = obterBanco()
  if (!db) return Promise.resolve(false)
  const referencia = ref(db, caminhoControle())
  if (forcar) {
    return set(referencia, { dono: ID_CLIENTE, ts: Date.now() })
      .then(() => true)
      .catch(() => false)
  }
  return runTransaction(referencia, (atual) => {
    if (donoBloqueante(atual)) return undefined
    return { dono: ID_CLIENTE, ts: Date.now() }
  })
    .then((resultado) => Boolean(resultado && resultado.committed))
    .catch(() => false)
}

function esvaziarPendentes() {
  const db = obterBanco()
  if (!db || !pendentes.size) return
  for (const [canal, texto] of pendentes.entries()) {
    marcarPublicacao(canal, texto)
    try {
      set(ref(db, `salas/${salaAtual()}/${canal}`), texto).catch(() => {})
    } catch {}
  }
  pendentes.clear()
}

export function publicarNuvem(canal, estado) {
  const db = obterBanco()
  if (!db || !canal) return
  let texto
  try {
    texto = JSON.stringify(estado ?? null)
  } catch {
    return
  }
  if (!ehControlador()) {
    if (statusControle !== 'bloqueado') pendentes.set(canal, texto)
    return
  }
  pendentes.delete(canal)
  marcarPublicacao(canal, texto)
  try {
    set(ref(db, `salas/${salaAtual()}/${canal}`), texto).catch((e) => {
      console.warn(`Pelotense: falha ao publicar "${canal}" na nuvem.`, e)
    })
  } catch (e) {
    console.warn(`Pelotense: falha ao publicar "${canal}" na nuvem.`, e)
  }
}

export function inscreverNuvem(canal, callback) {
  const db = obterBanco()
  if (!db || !canal) return () => {}
  return onValue(
    ref(db, `salas/${salaAtual()}/${canal}`),
    (snapshot) => {
      const texto = snapshot.val()
      if (typeof texto !== 'string') return
      if (ehEcoProprio(canal, texto)) return
      try {
        callback(JSON.parse(texto))
      } catch {
        console.warn(`Pelotense: estado inválido recebido da nuvem ("${canal}").`)
      }
    },
    (e) => console.warn(`Pelotense: falha ao receber "${canal}" da nuvem.`, e)
  )
}
