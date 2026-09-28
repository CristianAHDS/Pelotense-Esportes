import { useEffect } from 'react';
import { importarMataMataSuperPlacar } from '../services/superPlacarService';
import { sincronizarDoSuperPlacar } from '../store/mataMataStore';

/* Atualização automática do mata-mata direto do SuperPlacar, usada nos
   overlays de /mata-mata e /fases-finais. O cache do serviço (3 min) segura
   o tráfego, então a cada 30s só é hit a rede de verdade quando o cache vence. */
const INTERVALO_MS = 30 * 1000;

export function useMataMataSuperPlacar({ ativo = true } = {}) {
  useEffect(() => {
    if (!ativo) return undefined;

    let vivo = true;

    const atualizar = async () => {
      try {
        const dados = await importarMataMataSuperPlacar();
        if (!vivo) return;
        sincronizarDoSuperPlacar(dados);
      } catch (e) {
        console.warn('Mata-Mata: falha ao atualizar do SuperPlacar.', e);
      }
    };

    atualizar();
    const timer = setInterval(atualizar, INTERVALO_MS);

    return () => {
      vivo = false;
      clearInterval(timer);
    };
  }, [ativo]);
}
