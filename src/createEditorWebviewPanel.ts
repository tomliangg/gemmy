import * as vscode from "vscode";

const loadContent = (
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
) => {
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
};

export const createEditorWebviewPanel = (context: vscode.ExtensionContext) => {
  const panel = vscode.window.createWebviewPanel(
    "webview",
    "gemmy",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  loadContent(panel, context);

  panel.webview.onDidReceiveMessage(async (message) => {
    switch (message.type) {
      case "setApiKey": {
        await vscode.workspace
          .getConfiguration("gemmy.settings")
          .update("apiKey", message.value, true);
        loadContent(panel, context);
        break;
      }
    }
  });

  panel.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    "media",
    "panel_view_icon.svg"
  );
};
