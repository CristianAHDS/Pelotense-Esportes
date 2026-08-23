import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { salaAtual } from '../lib/sincronizacaoNuvem'

const Caixa = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Rotulo = styled.label`
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.cores.textoSuave};
  white-space: nowrap;
`

const Entrada = styled.input`
  width: 120px;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.fundo};
  color: ${({ theme }) => theme.cores.texto};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 1px;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: rgba(165, 239, 28, 0.45);
  }
`

const Botao = styled.button`
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.cores.borda};
  background: ${({ theme }) => theme.cores.superficie};
  color: ${({ theme }) => theme.cores.textoSuave};
  font-family: ${({ theme }) => theme.fontes.titulo};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.cores.primaria};
    border-color: rgba(165, 239, 28, 0.45);
    background: rgba(165, 239, 28, 0.08);
  }

  @media (max-width: 900px) {
    display: none;
  }
`

function sanitizar(valor) {
  return String(valor || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 32)
}

function montarUrl(novaSala) {
  const params = new URLSearchParams(window.location.search)
  params.delete('sala')
  const busca = params.toString()
  const sufixo = novaSala && novaSala !== 'padrao' ? `?sala=${novaSala}` : busca ? `?${busca}` : ''
  return `${window.location.origin}${window.location.pathname}${sufixo}`
}

export function CampoSala() {
  const location = useLocation()
  const [valor, setValor] = useState(() => salaAtual())
  const [feedback, setFeedback] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    setValor(salaAtual())
  }, [location])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function avisar(texto) {
    setFeedback(texto)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setFeedback(''), 1600)
  }

  function aplicar() {
    const limpa = sanitizar(valor)
    if ((limpa || 'padrao') === salaAtual()) {
      setValor(salaAtual())
      return
    }
    window.location.assign(montarUrl(limpa))
  }

  async function copiar() {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      avisar('Copiado!')
    } catch {
      try {
        const area = document.createElement('textarea')
        area.value = url
        document.body.appendChild(area)
        area.select()
        document.execCommand('copy')
        document.body.removeChild(area)
        avisar('Copiado!')
      } catch {
        avisar('Erro ao copiar')
      }
    }
  }

  return (
    <Caixa title="Dispositivos com a mesma sala compartilham o estado em tempo real">
      <Rotulo>Sala</Rotulo>
      <Entrada
        value={valor}
        placeholder="padrao"
        onChange={(e) => setValor(e.target.value)}
        onBlur={aplicar}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
        }}
      />
      <Botao type="button" onClick={copiar}>
        {feedback || 'Copiar link'}
      </Botao>
    </Caixa>
  )
}
