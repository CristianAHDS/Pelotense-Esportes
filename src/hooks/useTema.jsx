import { createContext, useContext, useState, useCallback } from 'react'
import { theme, lightTheme } from '../theme'

const STORAGE_KEY = 'pelotense-tema'
const TemaCtx = createContext()

export function TemaProvider({ children }) {
  const [escuro, setEscuro] = useState(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    return salvo ? salvo === 'escuro' : true
  })

  const alternarTema = useCallback(() => {
    setEscuro(ant => {
      const novo = !ant
      localStorage.setItem(STORAGE_KEY, novo ? 'escuro' : 'claro')
      return novo
    })
  }, [])

  const valor = escuro ? theme : lightTheme

  return (
    <TemaCtx.Provider value={{ tema: valor, escuro, alternarTema }}>
      {children}
    </TemaCtx.Provider>
  )
}

export function useTema() {
  return useContext(TemaCtx)
}
