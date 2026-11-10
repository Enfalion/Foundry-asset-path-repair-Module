# Asset Path Auto-Repair for Foundry VTT (V12–V14)

> 🇩🇪 **[Deutsche Dokumentation hier lesen (README.de.md)](./README.de.md)**

![Foundry VTT Compatibility](https://img.shields.io/badge/Foundry_VTT-v12--v14-orange)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**Asset Path Auto-Repair** (`asset-path-repair`) is a comprehensive, production-grade administrative tool for **Foundry Virtual Tabletop (V12, V13, and V14, with V11 fallback)**. It recursively indexes selected directories inside your Foundry `Data/` storage, detects broken or orphaned media file references across your entire world's **LevelDB** database after filesystem reorganizations, and repairs them through a guided, collision-safe **4-step wizard**.

---

## Why This Module Exists: The LevelDB Path Migration Problem

Since Foundry VTT migrated its world database backend to **LevelDB**, asset paths (maps, tokens, portraits, handouts, audio tracks, and embedded HTML images) are stored inside binary LevelDB tables rather than simple flat `.db` text files.

When Game Masters reorganize their `Data/` folder on a local machine, NAS, Docker container, or dedicated server—such as moving loose files into structured folders like `assets/maps/`, `assets/tokens/`, or `assets/handouts/`—every previously linked path in the world breaks. Fixing hundreds of scenes, prototype tokens, placed tokens, and HTML journal entries by hand is tedious and error-prone.

**Asset Path Auto-Repair** solves this automatically:
1. It crawls your chosen `Data/` directories via Foundry's native `FilePicker` API.
2. It verifies whether each stored path in your world still exists at its current location.
3. For every orphaned path, it locates the moved file by filename, flags any multi-file ambiguities (**Collisions**), and rewrites the updated paths directly through Foundry's official Document update APIs.

---

## Key Features

| Feature | Description |
| :--- | :--- |
| **4-Step Interactive Wizard** | Guided workflow: **1. Select Folders** → **2. Dry-Run Preview & Collision Resolution** → **3. Confirm & Apply Updates** → **4. Final Audit Summary**. |
| **Protected Folder Safeguards** | System folders (`systems`, `modules`, `worlds`, `icons`, `ui`) are unchecked by default. Checking any protected folder displays an immediate inline warning about icon collisions and scan overhead. |
| **Full Foundry V14 Data Coverage** | Scans Scenes, Tiles, Placed Tokens (including V12/V14 Dynamic Token Ring `ring.subject.texture`), Ambient Sounds, Map Notes, Actors, Prototype Tokens, Owned Items, Active Effects, World Items, Journals, Playlists, Rollable Tables, Card Stacks, and Macros. |
| **HTML Handout & Biography Parser** | Parses embedded HTML inside Journal Text Pages (`page.text.content`), Actor biographies, and Item descriptions for `<img>`, `<video>`, `<audio>`, and `<source>` tags, updating broken `src` / `poster` paths in-place while preserving surrounding HTML markup. |
| **Interactive Collision Resolution** | If multiple files share the same filename across different folders, they are never overwritten blindly. Instead, each collision is presented with a dropdown selector so the GM can pick the exact target path or skip it. |
| **Resilient Batch Updates** | Every database write is wrapped in isolated `try/catch` blocks so a single malformed document never aborts the batch. Updates to the active Scene automatically trigger `canvas.draw()`. |
| **Bilingual UI (EN / DE)** | Includes full English and German localization plus a **direct `DE | EN` language switcher** in the window header to toggle languages on the fly regardless of client settings. |
| **JSON Audit Export** | Download a complete JSON report of all updated documents, unresolved collisions, and missing files for your records. |

---

## Comprehensive Foundry V14 Document Coverage

1. **Scenes (`game.scenes`)**
   - `background.src` (updated with `{ diff: false }` and automatic `canvas.draw()` refresh if active)
   - `foreground` / `foreground.src`
   - `thumb` (custom file paths)
   - Embedded **Tiles** (`scene.tiles`): `texture.src`
   - Embedded **Tokens** (`scene.tokens`): `texture.src`, `ring.subject.texture`
   - Embedded **Ambient Sounds** (`scene.sounds`): `path`
   - Embedded **Map Notes** (`scene.notes`): `texture.src`
2. **Actors (`game.actors`)**
   - `img`
   - `prototypeToken.texture.src` & `prototypeToken.ring.subject.texture`
   - System HTML biography/description fields (`actor.system`) containing `<img>`, `<video>`, `<audio>`, or `<source>` tags
   - Embedded **Active Effects** (`actor.effects`): `img` / `icon`
   - Embedded **Owned Items** (`actor.items`): `img`, HTML descriptions, and owned item Active Effects (`item.effects`)
3. **World Items (`game.items`)**
   - `img`, HTML description fields (`item.system`), and embedded **Active Effects** (`item.effects`)
4. **Journal Entries & Handouts (`game.journal`)**
   - Embedded **JournalEntryPages** (`journal.pages`):
     - Media pages (`image`, `video`, `pdf`, `audio`): `src`
     - Text/HTML pages (`text`): in-place replacement of `<img src="...">`, `<video src="..." poster="...">`, `<audio src="...">`, and `<source src="...">` inside `text.content`
5. **Playlists (`game.playlists`)**
   - Embedded **PlaylistSounds** (`playlist.sounds`): `path`
6. **Rollable Tables (`game.tables`)**
   - `img` and embedded **TableResults** (`table.results`): `img` / `icon`
7. **Card Stacks (`game.cards`)**
   - `img`, `back.img`, and embedded **Cards** (`stack.cards`): `back.img` and `faces[].img`
8. **Macros (`game.macros`)**
   - `img`

---

## Installation

### Method 1: Install via Manifest URL (Recommended)
1. Open the Foundry VTT Setup screen and navigate to the **Add-on Modules** tab.
2. Click **Install Module** at the bottom.
3. Paste the following **Manifest URL** into the field at the bottom of the dialog and click **Install**:
   ```text
   https://github.com/Enfalion/Foundry-asset-path-repair-Module/releases/latest/download/module.json
   ```

### Method 2: Manual Installation
1. Download `module.zip` from the [Latest GitHub Release](https://github.com/Enfalion/Foundry-asset-path-repair-Module/releases/latest).
2. Extract the archive into your Foundry `Data/modules/asset-path-repair/` directory.
3. Restart Foundry VTT and enable **Asset Path Auto-Repair** inside your World under **Manage Modules**.

---

## Step-by-Step Guide for Game Masters

> **Best Practice:** Always create a backup of your World before executing bulk database migrations.

1. **Open the Tool**:
   - Log into your World as a **Game Master (GM)**.
   - Navigate to the **Game Settings** tab (gear icon in the right sidebar) and click the **Asset Path Auto-Repair** button (`wrench` icon). Alternatively, open it from *Configure Settings → Module Settings*.
2. **Step 1 — Select Folders to Index**:
   - Review the dynamically discovered top-level folders from your `Data/` directory.
   - User folders (e.g., `assets/`, `maps/`, `tokens/`, `audio/`) are selected by default.
   - Protected folders (`systems/`, `modules/`, `worlds/`, `icons/`, `ui/`) are unchecked by default to prevent accidental icon collisions.
   - Click **Scan Selected Folders (Dry-Run Preview)**.
3. **Step 2 — Preview & Resolve Collisions (Dry-Run)**:
   - Inspect the three categorized tabs:
     - **Ready to Update**: Broken paths where a single unambiguous matching file was found at a new location. You can toggle individual rows on or off.
     - **Collisions**: Broken paths where multiple files share the same filename across different scanned folders. Use the dropdown menu in each row to choose the exact target file or leave it set to *Skip*.
     - **Missing**: Broken paths that could not be found anywhere in the selected folders.
4. **Step 3 — Confirm & Apply Updates**:
   - Click **Confirm & Apply Path Updates**. The engine updates all selected documents in LevelDB and refreshes the active canvas if needed.
5. **Step 4 — Review Final Audit Summary**:
   - Inspect the breakdown of updated Scenes, Actors, Tokens, Items, Journals, Playlists, and Tables/Cards/Macros, and optionally click **Download JSON Report** to save a permanent audit log.

---

## License

Released under the [MIT License](./LICENSE) by [Enfalion](https://github.com/Enfalion).
