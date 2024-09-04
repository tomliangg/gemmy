import { GenerateContentResult } from "@google/generative-ai";
import { vscode as vscodeType } from "./global";

let vscode: vscodeType;

// modified from: https://stackoverflow.com/a/51332115
export function retry(
  fn: () => Promise<GenerateContentResult>,
  retries = 3,
  err?: Error
): Promise<string> {
  if (retries < 0) {
    return Promise.reject(err);
  }
  return fn()
    .then((result) => {
      // for genAI.getGenerativeModel() api call, we can't tell if it gets "RECITATION" error until we parse the text
      return result.response.text();
    })
    .catch((err) => {
      console.warn("failed! Remaining retries:", retries);
      console.error("Error is:", err);
      return retry(fn, retries - 1, err);
    });
}

// ref: https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
export const getPreferredScheme = () =>
  window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches
    ? "dark"
    : "light";

export const getVscode = () => {
  if (import.meta.env.PROD) {
    if (!vscode) {
      // https://code.visualstudio.com/api/extension-guides/webview
      // This function can only be invoked once per session. You must hang onto the instance of the VS Code API returned by this method, and hand it out to any other functions that need to use it.
      vscode = acquireVsCodeApi();
    }
  }
  return vscode;
};

export const getVscodeState = () => {
  const vscode = getVscode();
  return vscode.getState();
};

export const setVscodeState = (newState: Object) => {
  const previousState = getVscodeState();
  vscode.setState({ ...previousState, ...newState });
};
