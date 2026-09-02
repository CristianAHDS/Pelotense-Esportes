import { afterEach, beforeEach, vi } from 'vitest';

/* ---------- BroadcastChannel polyfill (jsdom não implementa) ---------- */

globalThis.BroadcastChannel = class BroadcastChannelMock {
  constructor(name) {
    this.name = name;
    BroadcastChannelMock._instances.push(this);
    this.onmessage = null;
    this.onmessageerror = null;
  }
  postMessage(data) {
    const evento = { data, type: 'message' };
    BroadcastChannelMock._log.push({ channel: this.name, data });
    for (const inst of BroadcastChannelMock._instances.slice()) {
      if (inst === this || inst.name !== this.name) continue;
      if (inst.onmessage) inst.onmessage(evento);
      else if (inst.onmessageerror) inst.onmessageerror(evento);
    }
  }
  close() {
    const i = BroadcastChannelMock._instances.indexOf(this);
    if (i !== -1) BroadcastChannelMock._instances.splice(i, 1);
  }
  static _instances = [];
  static _log = [];
};

const BroadcastChannelMock = globalThis.BroadcastChannel;
globalThis.__broadcastMock = () => ({
  instances: BroadcastChannelMock._instances,
  log: BroadcastChannelMock._log,
});

/* ---------- matchMedia (usado por componentes/temas) ---------- */

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

window.scrollTo = () => {};
Element.prototype.scrollTo = () => {};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.search = '';
  BroadcastChannelMock._instances.length = 0;
  BroadcastChannelMock._log.length = 0;
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});
