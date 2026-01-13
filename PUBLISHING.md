# Publishing the Extension

## Prerequisites
1.  **Install vsce**: The Visual Studio Code Extension Manager.
    ```bash
    npm install -g @vscode/vsce
    ```
2.  **Azure DevOps Account**: You need a Personal Access Token (PAT) to publish.
    - Go to [dev.azure.com](https://dev.azure.com)
    - Create a PAT with `Marketplace > Manage` scope.
3.  **Publisher Account**:
    - Go to [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage) and create a publisher.

## Configuration
1.  Open `package.json`.
2.  Update the `"publisher"` field to match your Marketplace publisher ID:
    ```json
    "publisher": "your-publisher-ID",
    ```
3.  Update `"author"`, `"repository"`, and `"homepage"` fields if desired.

## Packaging (Local)
To create a `.vsix` file for manual sharing or testing:

```bash
npx @vscode/vsce package
```
This will create `chemical-editor-0.0.1.vsix` in the current directory.
You can install this manually in VS Code via "Extensions" -> "..." -> "Install from VSIX...".

## Publishing (Marketplace)
To publish directly to the store:

```bash
npx @vscode/vsce publish
```
You will be prompted for your PAT.

## Publishing (Open VSX)
To publish to Open VSX (for VSCodium, etc.):
1.  Create an account at [open-vsx.org](https://open-vsx.org).
2.  Install `ovsx`: `npm install -g ovsx`.
3.  Run: `ovsx publish`.
