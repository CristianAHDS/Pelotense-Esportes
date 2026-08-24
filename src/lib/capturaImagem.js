import html2canvas from 'html2canvas';

export function slugArquivo(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function salvarImagemElemento(alvo, nomeArquivo) {
  const canvas = await html2canvas(alvo, {
    backgroundColor: null,
    useCORS: true,
    scale: Math.max(2, window.devicePixelRatio || 1),
    onclone: (doc) => {
      const estilo = doc.createElement('style');
      estilo.textContent =
        '*, *::before, *::after { animation: none !important; transition: none !important; }';
      doc.head.appendChild(estilo);
    },
  });
  const link = document.createElement('a');
  link.download = `${nomeArquivo}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
