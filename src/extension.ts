import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "gemini-chat" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand("gemini-chat.tada", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Tada from gemini-chat!");
  });
  context.subscriptions.push(disposable);

  let webview = vscode.commands.registerCommand("gemini-chat.webview", () => {
    let panel = vscode.window.createWebviewPanel(
      "webview",
      "Web view",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    // web is for my react root directory, rename for yours

    let scriptSrc = panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, "dist", "bundle.js")
    );

    let cssSrc =
      "" ??
      panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "web", "dist", "index.css")
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
  });

  context.subscriptions.push(webview);
}

// This method is called when your extension is deactivated
export function deactivate() {}
