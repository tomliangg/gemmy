import * as vscode from "vscode";

export class SidebarAppViewProvider implements vscode.WebviewViewProvider {
  private context: vscode.ExtensionContext; // Declare the context property
  private _view?: vscode.WebviewView;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this._view = undefined;
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    this.loadContent();

    this._view.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case "setApiKey": {
          await vscode.workspace
            .getConfiguration("gemmy.settings")
            .update("apiKey", message.value, true);
          this.loadContent();
          break;
        }
      }
    });
  }

  loadContent() {
    if (this._view) {
      this._view.webview.html = this.getWebviewContent();

      this._view.webview.postMessage({
        type: "initializeConfiguration",
        value: vscode.workspace.getConfiguration("gemmy.settings"),
      });
    }
  }

  getWebviewContent() {
    const scriptSrc = this._view?.webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "dist", "bundle.js")
    );

    const cssSrc = this._view?.webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "dist", "assets/index.css")
    );

    return `
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
  }
}
