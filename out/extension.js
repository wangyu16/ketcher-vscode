"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const editorProvider_1 = require("./editorProvider");
function activate(context) {
    console.log('Ketcher Chemical Editor is active');
    context.subscriptions.push(editorProvider_1.KetcherEditorProvider.register(context));
    context.subscriptions.push(vscode.commands.registerCommand('ketcher.viewSource', (uri) => {
        // If called from the menu, uri is provided.
        let targetUri = uri;
        // Fallback: Try to find active tab with custom editor
        if (!targetUri) {
            const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
            if (activeTab && activeTab.input instanceof vscode.TabInputCustom) {
                targetUri = activeTab.input.uri;
            }
        }
        if (targetUri) {
            vscode.commands.executeCommand('vscode.openWith', targetUri, 'default');
        }
        else {
            vscode.window.showErrorMessage('No active file to switch view for.');
        }
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map