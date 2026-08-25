/* Nomes canônicos dos clubes: qualquer variação que entra no sistema
   (FGF, digitação no controle, estado salvo antigo, sync remoto) é
   convertida para o nome padrão exibido nos overlays. */

const CLUBES_CANONICOS = [
  {
    nome: 'Aimoré',
    variantes: [
      'Aimoré',
      'Aimore',
      'Clube Esportivo Aimoré',
      'Clube Esportivo Aimore',
      'EC Aimoré',
      'Esporte Clube Aimoré',
    ],
  },
  {
    nome: 'Apafut',
    variantes: [
      'Apafut',
      'APAFUT',
      'Apa Fut',
      'Associação de Pais e Amigos do Futebol',
      'Associação de Pais e Amigos Futebol',
      'Associação de Pais e Amigos',
      'Assoc. de Pais e Amigos',
    ],
  },
  {
    nome: 'Bagé',
    variantes: [
      'Bagé',
      'Bage',
      'Grêmio Esportivo Bagé',
      'Grêmio Esportivo Bage',
      'GEB',
    ],
  },
  {
    nome: 'Brasil',
    variantes: [
      'Brasil',
      'Brasil - SAF',
      'Brasil SAF',
      'Brasil-SAF',
      'Brasil de Pelotas',
      'Brasil-PE',
      'Brasil Pelotas',
      'Esporte Clube Pelotas',
      'EC Pelotas',
      'Pelotas',
      'Grêmio Esportivo Brasil',
      'Gremio Esportivo Brasil',
      'Grêmio Esportivo Brasilsaf',
      'Gremio Esportivo Bra',
    ],
  },
  {
    nome: 'Brasil - FAR',
    variantes: [
      'Brasil - FAR',
      'Brasil de Farroupilha',
      'Brasil Farroupilha',
      'Brasil-Far',
    ],
  },
  {
    nome: 'Esportivo',
    variantes: [
      'Esportivo',
      'Esportivo-RS',
      'Clube Esportivo Bento Gonçalves',
      'Clube Esportivo Bento Goncalves',
      'Esporte Clube Bento Gonçalves',
      'EC Bento Gonçalves',
    ],
  },
  {
    nome: 'Gaúcho',
    variantes: [
      'Gaúcho',
      'Gaucho',
      'Sport Clube Gaúcho',
      'Sport Clube Gaucho',
      'SC Gaúcho',
      'Sociedade Esportiva Recreativa e Cultural',
      'Sociedade Esportiva Recreativa e Cultural Gaúcho',
      'Sociedade Esportiva Recreativa e Cultural Gaucho',
      'SERC Gaúcho',
    ],
  },
  {
    nome: 'Glória',
    variantes: [
      'Glória',
      'Gloria',
      'Grêmio Esportivo Glória',
      'Grêmio Esportivo Gloria',
      'Grêmio Esportivo Gló',
      'GEG',
    ],
  },
  {
    nome: 'Gramadense',
    variantes: [
      'Gramadense',
      'Centro Esportivo Gramadense',
      'CE Gramadense',
    ],
  },
  {
    nome: 'Guarani - VA',
    variantes: [
      'Guarani - VA',
      'Guarani VA',
      'Guarani-VA',
      'Guarani-RS',
      'Guarani',
      'Esporte Clube Guarani',
      'EC Guarani',
    ],
  },
  {
    nome: 'Lajeadense',
    variantes: [
      'Lajeadense',
      'Clube Esportivo Lajeadense',
      'Clube Esportivo Laje',
      'Esporte Clube Laje',
      'Esporte Clube Lajeadense',
      'EC Laje',
      'Laje',
    ],
  },
  {
    nome: 'Passo Fundo',
    variantes: [
      'Passo Fundo',
      'Esporte Clube Passo Fundo',
      'EC Passo Fundo',
      'ECPF',
    ],
  },
  {
    nome: 'Santa Cruz',
    variantes: [
      'Santa Cruz',
      'Santa Cruz-RS',
      'Futebol Clube Santa Cruz',
      'FC Santa Cruz',
    ],
  },
  {
    nome: 'União Frederiquense',
    variantes: [
      'União Frederiquense',
      'Uniao Frederiquense',
      'União Frederiquense de Futebol',
      'União Frederiquense Clube de Futebol',
      'União',
    ],
  },
  {
    nome: 'Veranópolis',
    variantes: [
      'Veranópolis',
      'Veranopolis',
      'Veranópolis Esporte Clube',
      'Veranópolis Esporte Clube Recreativo',
      'Veranópolis EC',
      'VEC',
    ],
  },
];

function chave(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const MAPA_VARIANTES = new Map();
for (const clube of CLUBES_CANONICOS) {
  for (const v of new Set([...clube.variantes, clube.nome])) {
    MAPA_VARIANTES.set(chave(v), clube.nome);
  }
}

export function nomeCanonico(nome) {
  return MAPA_VARIANTES.get(chave(nome)) || String(nome || '');
}

/* Todas as grafias conhecidas de um clube (já normalizadas), incluindo a
   informada — usado para casar slugs/nomes da FGF com o clube certo. */
export function variantesNome(nome) {
  const bruto = chave(nome);
  const canonico = MAPA_VARIANTES.get(bruto);
  if (!canonico) return bruto ? [bruto] : [];
  const todas = [...MAPA_VARIANTES.entries()]
    .filter(([, n]) => n === canonico)
    .map(([k]) => k);
  return [...new Set([bruto, ...todas])];
}

export function aplicarNomesCanonicos(times) {
  if (!Array.isArray(times)) return times;
  return times.map((t) => (t?.nome ? { ...t, nome: nomeCanonico(t.nome) } : t));
}
