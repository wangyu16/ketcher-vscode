# Ketcher for VS Code

**Ketcher for VS Code** allows you to design and edit chemical structures directly within your favorite code editor. It integrates the robust [Ketcher](https://lifescience.opensource.epam.com/ketcher/) web-based molecularer editor into Visual Studio Code.

## Features

- **Embedded Editor**: Opens `*.ketcher.svg` files in a fully functional local instance of Ketcher.
- **Polyglot SVGs**: Files are saved as standard SVGs that render in any browser or image viewer.
    - Chemical structure data (KetJSON) is embedded invisibly within the SVG metadata, allowing you to re-open and edit the structure at any time without data loss.
- **Native Integration**:
    - Uses standard VS Code **Save** (`Cmd+S` / `Ctrl+S`) and **Open** commands.
    - Supports standard file operations (Rename, Delete, Move) within the Explorer.
    - Offline capable (bundles the editor locally).

## Usage

1.  **Create a File**: Create a new file with the extension `.ketcher.svg` (e.g., `reaction.ketcher.svg`).
2.  **Edit**: Click the file to open the Ketcher interface. Use the toolbar to draw molecules, reactions, and mechanisms.
3.  **Save**: Press `Cmd+S` (macOS) or `Ctrl+S` (Windows/Linux). The extension will generate the SVG representation and save it to disk.
4.  **View**: Open the file in any web browser or SVG viewer to see your drawing.

## Credits & License

This extension bundles and integrates **Ketcher**.

**Ketcher** is developed by **EPAM Systems**.
*   **Website**: [lifescience.opensource.epam.com/ketcher](https://lifescience.opensource.epam.com/ketcher/)
*   **Repository**: [github.com/epam/ketcher](https://github.com/epam/ketcher)
*   **License**: Licensed under the **Apache License, Version 2.0**.

### Ketcher Copyright Notice
```text
Copyright 2021 EPAM Systems

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
