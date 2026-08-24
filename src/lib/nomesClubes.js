/* Nomes canônicos dos clubes: qualquer variação que entra no sistema
   (FGF, digitação no controle, estado salvo antigo, sync remoto) é
   convertida para o nome padrão exibido nos overlays. */

const CLUBES_CANONICOS = [
  {
    nome: 'Brasil',
    variantes: [
      'Brasil - SAF',
      'Brasil SAF',
      'Brasil-SAF',
      'Brasil de Pelotas',
      'Brasil-PE',
      'Brasil Pelotas',
    ],
  },
  {
    nome: 'Guarani - VA',
    variantes: ['Guarani - VA', 'Guarani VA', 'Guarani-VA', 'Guarani-RS', 'Guarani'],
  },
  {
    nome: 'Esportivo',
    variantes: ['Esportivo', 'Esportivo-RS'],
  },
  {
    nome: 'Santa Cruz',
    variantes: ['Santa Cruz', 'Santa Cruz-RS'],
  },
]

function chave(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

const MAPA_VARIANTES = new Map()
for (const clube of CLUBES_CANONICOS) {
  for (const v of new Set([...clube.variantes, clube.nome])) {
    MAPA_VARIANTES.set(chave(v), clube.nome)
  }
}

export function nomeCanonico(nome) {
  return MAPA_VARIANTES.get(chave(nome)) || String(nome || '')
}

/* Todas as grafias conhecidas de um clube (já normalizadas), incluindo a
   informada — usado para casar slugs/nomes da FGF com o clube certo. */
export function variantesNome(nome) {
  const bruto = chave(nome)
  const canonico = MAPA_VARIANTES.get(bruto)
  if (!canonico) return bruto ? [bruto] : []
  const todas = [...MAPA_VARIANTES.entries()]
    .filter(([, n]) => n === canonico)
    .map(([k]) => k)
  return [...new Set([bruto, ...todas])]
}

export function aplicarNomesCanonicos(times) {
  if (!Array.isArray(times)) return times
  return times.map((t) => (t?.nome ? { ...t, nome: nomeCanonico(t.nome) } : t))
}
