import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App — roteamento (smoke test)', () => {
  const original = window.location.href;

  beforeAll(() => {
    window.history.replaceState(null, '', '/hub');
  });

  afterAll(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renderiza o Hub em /hub', async () => {
    render(<App />);
    expect(
      await screen.findByRole('heading', { name: /pelotense esportes/i }),
    ).toBeInTheDocument();
  });
});
