import * as vscode from "vscode";

export const createEditorWebviewPanel = (context: vscode.ExtensionContext) => {
  const panel = vscode.window.createWebviewPanel(
    "webview",
    "gemmy",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  const scriptSrc = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "dist", "bundle.js")
  );

  const cssSrc = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "dist", "assets/index.css")
  );

  panel.webview.html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <link rel="stylesheet" href="${cssSrc}" />
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root"></div>
      <script src="${scriptSrc}"></script>
    </body>
  </html>
  `;

  panel.webview.postMessage({
    type: "initializeConfiguration",
    value: vscode.workspace.getConfiguration("gemmy.settings"),
  });

  panel.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    "media",
    "windmill.svg"
  );
};
