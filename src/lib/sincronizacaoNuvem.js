import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue } from 'firebase/database'

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

export function publicarNuvem(canal, estado) {
  const db = obterBanco()
  if (!db || !canal) return
  let texto
  try {
    texto = JSON.stringify(estado ?? null)
  } catch {
    return
  }
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
