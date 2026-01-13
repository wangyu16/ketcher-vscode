### **Project Architecture Overview**

* **Extension ID:** `chemical-editor`
* **Target File:** `*.ketcher.svg`
* **Tech Stack:** TypeScript, React (for Ketcher UI), VS Code Webview API.
* **Core Logic:** The "Polyglot" File.
* *Read:* Parse SVG → Extract `<metadata>` (KetJSON) → Load into Ketcher.
* *Write:* Ketcher export (SVG) + Ketcher State (KetJSON) → Merge → Write to disk.



---

### **Phase 1: The "Polyglot" File Logic (Pure Node.js)**

*Goal: Create the logic to hide/read chemical data inside an SVG file without breaking the image.*

**Context for AI:** You need a robust utility to handle the file format before touching VS Code.

**Prompt for your AI Agent:**

> "I need a TypeScript utility class for a VS Code extension. It needs to handle 'Polyglot SVGs' for a chemical editor.
> 1. Create a function `embedDataInSvg(svgContent: string, chemicalData: object): string`. It should take a standard SVG string and a JSON object (the chemical data). It must insert the JSON object into a `<metadata id='ketcher-data'>` tag inside the SVG. It must NOT break the visual rendering of the SVG.
> 2. Create a function `extractDataFromSvg(svgContent: string): object | null`. It should parse the SVG and return the hidden JSON object.
> 
> 
> Use `xml2js` or a similar lightweight XML parser if needed, or robust Regex if safer. Write a simple Jest test case to prove it works."

---

### **Phase 2: The Extension Scaffold & Custom Editor**

*Goal: Register the `.ketcher.svg` extension and make VS Code open a blank UI when clicked.*

**Context for AI:** Setting up the `CustomTextEditorProvider` is the standard way to make custom editors in VS Code.

**Prompt for your AI Agent:**

> "Scaffold a new VS Code extension.
> 1. In `package.json`, register a `customEditors` contribution point.
> * **ViewType:** `ketcher.editor`
> * **Filename Pattern:** `*.ketcher.svg`
> * **DisplayName:** 'Ketcher Chemical Editor'
> 
> 
> 2. Create a class `KetcherEditorProvider` that implements `vscode.CustomTextEditorProvider`.
> 3. In the `resolveCustomTextEditor` method, create a simple Webview that displays '<h1>Ketcher Loading...</h1>'.
> 4. Register this provider in `extension.ts`.
> 
> 
> Verify that I can double-click a `.ketcher.svg` file and see the extension open."

---

### **Phase 3: Integrating Ketcher (The Webview)**

*Goal: Get the Ketcher React component running inside the VS Code Webview.*

**Context for AI:** This is the hardest part. Ketcher is a React application. You need to bundle a mini React app inside your extension.

**Prompt for your AI Agent:**

> "I need to integrate the 'ketcher-react' and 'ketcher-core' packages into the Webview.
> 1. Set up a minimal React build script (using Webpack or Vite) inside a `./media` folder in the extension.
> 2. Create a standard `Editor` component that renders the `<Editor />` component from `ketcher-react`.
> 3. Configure the build to output a single `.js` and `.css` file.
> 4. Update the `KetcherEditorProvider` (from Phase 2) to load these compiled script/css files into the Webview HTML.
> 
> 
> **Constraint:** Ensure `structServiceProvider` (the backend connection) is mocked or disabled, as we are running standalone."

---

### **Phase 4: The Data Sync Loop (Read/Write)**

*Goal: Connect the Phase 1 logic with the Phase 3 UI.*

**Context for AI:** Now you connect the pipes. When the webview loads, send it the data. When the user saves, get the data back.

**Prompt for your AI Agent:**

> "Now let's connect the logic.
> 1. **On Load:** In `KetcherEditorProvider`, read the file from disk. Use the extraction logic (Phase 1) to get the JSON. specific message `postMessage({ type: 'INIT', data: jsonData })` to the Webview.
> 2. **Webview Handling:** In the React app, listen for 'INIT'. When received, use `ketcher.setMolecule(data)` to load the structure.
> 3. **On Save:** Implement a mechanism where, if the user presses Ctrl+S (or an autosave trigger), the Webview generates the SVG (via `ketcher.generateImage`) AND the Graph State (via `ketcher.getKet`).
> 4. **Write to Disk:** Send both back to the Extension Host. The Extension Host uses the embedding logic (Phase 1) to merge them and `document.save()`."
> 
> 

---

### **Summary of Files You Will Need**

| File | Purpose |
| --- | --- |
| `package.json` | Defines the `*.ketcher.svg` association. |
| `src/extension.ts` | Activates the extension. |
| `src/editorProvider.ts` | Handles the communication between VS Code and the UI. |
| `src/utils/svgHandler.ts` | The "Polyglot" logic (Phase 1). |
| `media/App.tsx` | The React entry point for the Ketcher UI. |
| `webpack.config.js` | To bundle the React code for the Webview. |

