import * as vscode from 'vscode';
import { KetcherEditorProvider } from './editorProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Ketcher Chemical Editor is active');

    context.subscriptions.push(KetcherEditorProvider.register(context));

    context.subscriptions.push(vscode.commands.registerCommand('ketcher.viewSource', (uri: vscode.Uri) => {
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
        } else {
            vscode.window.showErrorMessage('No active file to switch view for.');
        }
    }));
}

export function deactivate() { }
