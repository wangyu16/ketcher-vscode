"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KetcherEditorProvider = void 0;
const vscode = require("vscode");
const path = require("path");
const svgHandler_1 = require("./utils/svgHandler");
class KetcherEditorProvider {
    static register(context) {
        const provider = new KetcherEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(KetcherEditorProvider.viewType, provider);
        return providerRegistration;
    }
    constructor(context) {
        this.context = context;
    }
    async resolveCustomTextEditor(document, webviewPanel, _token) {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(this.context.extensionPath, 'media')),
                vscode.Uri.file(path.join(this.context.extensionPath, 'out'))
            ]
        };
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
        // Receive message from webview
        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'ready':
                    this.updateWebview(webviewPanel.webview, document);
                    return;
                case 'save':
                    this.saveDocument(document, e.data);
                    return;
                case 'execute-command':
                    vscode.commands.executeCommand(e.command);
                    return;
                case 'dispatch-command':
                    if (e.data && e.data.command) {
                        if (e.data.command === 'save') {
                            vscode.commands.executeCommand('workbench.action.files.save');
                        }
                        else if (e.data.command === 'open') {
                            vscode.commands.executeCommand('workbench.action.files.openFile');
                        }
                    }
                    return;
                case 'error':
                    vscode.window.showErrorMessage(e.message);
                    return;
                case 'info':
                    vscode.window.showInformationMessage(e.message);
                    return;
            }
        });
        // Update webview when document changes (external changes)
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                // Determine if this change came from us or external
                // For now, simple re-sync if content changed significantly? 
                // Actually, best to rely on standard VS Code undo/redo unless we implement custom logic.
                // But for initial load, we call updateWebview
            }
        });
        // Make sure we get rid of the listener when our editor is closed.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });
        // Initial load happens when webview sends 'ready'
    }
    async updateWebview(webview, document) {
        const text = document.getText();
        const data = await (0, svgHandler_1.extractDataFromSvg)(text);
        if (data) {
            webview.postMessage({
                type: 'INIT',
                data: data
            });
        }
    }
    // Phase 4: Data Sync
    async saveDocument(document, data) {
        if (!data || !data.ket || !data.svg) {
            return;
        }
        // Embed the KetJSON into the SVG
        const newFileContent = await (0, svgHandler_1.embedDataInSvg)(data.svg, data.ket);
        // Apply edit
        const edit = new vscode.WorkspaceEdit();
        // Replace entire document
        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
        edit.replace(document.uri, fullRange, newFileContent);
        await vscode.workspace.applyEdit(edit);
    }
    getHtmlForWebview(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.context.extensionPath, 'media', 'bundle.js')));
        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ketcher</title>
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; img-src ${webview.cspSource} blob: data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval'; worker-src blob: data:; connect-src ${webview.cspSource} https: http:;">
            <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                /* Hide Open and Save buttons in Ketcher Toolbar */
                button[title*="Save"], button[title*="Open"], [data-testid="save"], [data-testid="open"] {
                    display: none !important;
                }
            </style>
        </head>
        <body>
            <div id="root"></div>
            <script nonce="${nonce}">
                try {
                    const vscode = acquireVsCodeApi();
                    window.vscode = vscode;
                } catch(e) {
                    console.error('Error acquiring VS Code API: ', e);
                }

                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message && message.type) {
                        case 'ketcher-ready':
                             // Webview React app is ready, tell extension to send data
                             if (window.vscode) {
                                 window.vscode.postMessage({ type: 'ready' });
                             }
                             break;
                        case 'INIT':
                             if (window.ketcher) {
                                 window.isRemoteUpdate = true;
                                 window.ketcher.setMolecule(message.data).then(() => {
                                     setTimeout(() => { window.isRemoteUpdate = false; }, 100);
                                 });
                             } else {
                                 // Retry logic if needed, or rely on the React app to be ready slightly later
                                 // But usually ketcher-ready is sent AFTER ketcher is initialized
                             }
                            break;
                    }
                });
                
                // Backup listener for INIT if React sends ready before listeners are set up (unlikely with this order)
            </script>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
    }
}
exports.KetcherEditorProvider = KetcherEditorProvider;
KetcherEditorProvider.viewType = 'ketcher.editor';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=editorProvider.js.map