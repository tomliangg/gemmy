import * as vscode from "vscode";
import { SidebarAppViewProvider } from "./SidebarAppViewProvider";
import { createEditorWebviewPanel } from "./createEditorWebviewPanel";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "gemini-chat" is now active!');

  // Editor UI when use CMD + SHIFT + P to execute "Open gemini-chat in editor"
  const editorView = vscode.commands.registerCommand(
    "gemini-chat.editorView",
    () => {
      createEditorWebviewPanel(context);
    }
  );
  context.subscriptions.push(editorView);

  // Sidebar UI when click on the icon at activity bar
  const provider = new SidebarAppViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sidebarApp", provider)
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
