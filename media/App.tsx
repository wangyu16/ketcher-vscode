import * as React from 'react';
import { Editor } from 'ketcher-react';
import { StandaloneStructServiceProvider } from 'ketcher-standalone';

declare global {
    interface Window {
        ketcher?: any;
        vscode?: any;
        isRemoteUpdate?: boolean;
    }
}

const structServiceProvider = new StandaloneStructServiceProvider();

export const App = () => {
    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <Editor
                staticResourcesUrl=""
                structServiceProvider={structServiceProvider}
                errorHandler={(message: string) => console.error(message)}
                onInit={(ketcher: any) => {
                    window.ketcher = ketcher;

                    // Intercept keyboard shortcuts
                    window.addEventListener('keydown', (e) => {
                        const isCmd = e.ctrlKey || e.metaKey;
                        const isSave = e.code === 'KeyS' || e.key.toLowerCase() === 's';
                        const isOpen = e.code === 'KeyO' || e.key.toLowerCase() === 'o';

                        if (isCmd && (isSave || isOpen)) {
                            e.preventDefault();
                            e.stopImmediatePropagation();

                            if (window.vscode) {
                                window.vscode.postMessage({
                                    type: 'dispatch-command',
                                    data: { command: isSave ? 'save' : 'open' }
                                });
                            } else {
                                console.error('VS Code API not available for shortcut');
                            }
                        }
                    }, true); // Use capture phase to catch it before Ketcher

                    // Subscribe to changes
                    ketcher.editor.subscribe('change', async () => {
                        if (window.isRemoteUpdate) {
                            return;
                        }

                        try {
                            const ketData = await ketcher.getKet();
                            let svgData: any = await ketcher.generateImage(ketData, { outputFormat: 'svg' });

                            if (svgData instanceof Blob) {
                                svgData = await svgData.text();
                            } else if (typeof svgData !== 'string') {
                                svgData = String(svgData);
                            }

                            if (window.vscode) {
                                window.vscode.postMessage({
                                    type: 'save',
                                    data: { ket: ketData, svg: svgData }
                                });
                            }
                        } catch (e) {
                            if (window.vscode) {
                                window.vscode.postMessage({ type: 'error', message: 'Save Failed: ' + e });
                            }
                        }
                    });

                    // Signal to VS Code that we are ready
                    window.postMessage({ type: 'ketcher-ready' }, '*');
                }}
            />
        </div>
    );
};
