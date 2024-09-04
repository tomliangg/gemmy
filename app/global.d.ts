export interface vscode {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
}

// global.d.ts
declare global {
  function acquireVsCodeApi<T = unknown>(): vscode;
}

export {};
