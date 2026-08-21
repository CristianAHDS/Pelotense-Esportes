import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100vh;
  }

  body {
    background: ${({ theme }) => theme.cores.fundo};
    color: ${({ theme }) => theme.cores.texto};
    font-family: ${({ theme }) => theme.fontes.corpo};
    -webkit-font-smoothing: antialiased;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input {
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.cores.fundo};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.cores.borda};
    border-radius: 6px;
  }
`
