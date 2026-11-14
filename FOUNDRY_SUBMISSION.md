# Official Foundry VTT Package Submission Reference (`v1.0.2`)

Use the exact copy-paste values below when submitting **Asset Path Auto-Repair** at **[https://foundryvtt.com/creators/submit/](https://foundryvtt.com/creators/submit/)** and when registering the initial **`1.0.2`** release in the Foundry VTT Package Administration interface.

---

## Part 1: Package Submission Form (`foundryvtt.com/creators/submit/`)

### 1. Package Type
```text
Add-on Module
```

### 2. Package Title
```text
Asset Path Auto-Repair
```

### 3. Package Name / ID
```text
asset-path-repair
```

### 4. Short Description / Summary (1–2 Sentences)
```text
Scans local Data directories and automatically repairs broken or orphaned asset file paths across Scenes, Handouts/Journals (including embedded HTML media), Actors, Tokens, Items, Playlists, Rollable Tables, Cards, and Macros. Features a 4-step dry-run wizard, interactive filename collision resolution, protected folder safeguards, and a live EN/DE UI switcher.
```

### 5. Full Package Description (Markdown)
```markdown
**Asset Path Auto-Repair** (`asset-path-repair`) is an administrative migration and repair utility for Foundry VTT (V12–V14) designed to fix broken LevelDB asset references after reorganizing files and folders inside your `Data/` directory.

### Key Features
- **4-Step Interactive Wizard**:
  1. **Dynamic Folder Selection**: Automatically discovers all top-level directories in `Data/` via `FilePicker.browse`.
  2. **Protected Directory Safeguards**: Core and system folders (`systems`, `modules`, `worlds`, `icons`, `ui`) are unchecked by default and display an immediate inline warning when selected to prevent unwanted icon collisions.
  3. **Pre-Update Dry-Run Preview & Interactive Collision Resolution**: Categorizes all detected broken paths into *Ready to Update*, *Collisions* (with a per-entry dropdown selector to pick the exact target path or skip when duplicate filenames exist across folders), and *Missing*.
  4. **Resilient Batch Execution & Final Audit Report**: Applies updates safely in isolated `try/catch` blocks, refreshes the active Canvas automatically (`canvas.draw()`), and generates a complete audit summary with one-click JSON report export.
- **Comprehensive Foundry V14 Data Model Coverage**:
  - **Scenes**: `background.src`, `foreground` / `foreground.src`, `thumb`, embedded `Tile` (`texture.src`), `Token` (`texture.src` and Dynamic Token Ring `ring.subject.texture`), `AmbientSound` (`path`), and `Note` (`texture.src`).
  - **Actors & Items**: `img`, `prototypeToken.texture.src`, `prototypeToken.ring.subject.texture`, embedded `ActiveEffect` (`img`/`icon`), owned `Item` documents, and system HTML biography/description fields.
  - **Journal Entries & Handouts**: Image/Video/PDF/Audio pages (`src`) plus regex HTML parsing inside `text.content` for `<img>`, `<video>`, `<audio>`, and `<source>` tags without altering surrounding markup.
  - **Playlists, Rollable Tables, Card Stacks (`back.img` & `faces[].img`), and Macros**.
- **Bilingual Interface (EN / DE)**: Full English and German localization with an instant `DE | EN` language toggle right inside the application header.
```

### 6. Package URL (Repository URL)
```text
https://github.com/Enfalion/Fouundry-asset-path-repair-Module
```
*(Canonical GitHub URL also supported: `https://github.com/Enfalion/Foundry-asset-path-repair-Module`)*

### 7. License
- **License Name**: `MIT`
- **License URL**:
```text
https://raw.githubusercontent.com/Enfalion/Fouundry-asset-path-repair-Module/main/LICENSE
```

### 8. Readme URL
```text
https://raw.githubusercontent.com/Enfalion/Fouundry-asset-path-repair-Module/main/README.md
```

### 9. Bugs / Issues URL
```text
https://github.com/Enfalion/Fouundry-asset-path-repair-Module/issues
```

### 10. Changelog URL
```text
https://raw.githubusercontent.com/Enfalion/Fouundry-asset-path-repair-Module/main/CHANGELOG.md
```

### 11. Suggested Categories / Tags
- `Tools & Controls`
- `GM Tools`
- `Utility`

---

## Part 2: Initial Release Version Form (`v1.0.2`)

- **Version**:
```text
1.0.2
```

- **Manifest URL (Version-Specific for Foundry Admin Portal)**:
```text
https://github.com/Enfalion/Fouundry-asset-path-repair-Module/releases/download/v1.0.2/module.json
```

- **Manifest URL (Latest / Universal)**:
```text
https://github.com/Enfalion/Fouundry-asset-path-repair-Module/releases/latest/download/module.json
```

- **Download URL (Version-Specific Archive)**:
```text
https://github.com/Enfalion/Fouundry-asset-path-repair-Module/releases/download/v1.0.2/module.zip
```

- **Minimum Core Version**:
```text
12
```

- **Verified Core Version**:
```text
14
```

---

## Part 3: Notes for Foundry VTT Staff Reviewer (Submission Reason / Verification Note)

Copy and paste the following note into the **"Notes for Reviewer / Submission Description"** box:

```text
Hello Foundry VTT Review Team,

"Asset Path Auto-Repair" (id: asset-path-repair) is a Game Master utility module for Foundry VTT V12–V14 that helps GMs repair broken asset file paths in LevelDB documents after reorganizing folders inside their local Data directory.

Technical & Compliance Summary:
1. Native API Usage Only: The module is written in pure ES6+ Vanilla JavaScript using Foundry's ApplicationV2 (HandlebarsApplicationMixin), FilePicker.browse("data", ...), and standard Document update / updateEmbeddedDocuments APIs. It has zero external runtime or NPM dependencies.
2. Safe Dry-Run & Collision Handling: It never modifies files on disk and never performs blind overwrites. System/protected directories (systems, modules, worlds, icons, ui) are excluded by default, and any duplicate filenames are surfaced in a Dry-Run preview with user-selectable dropdown resolution before any database updates occur.
3. Packaging & Automated Releases: The repository includes an MIT LICENSE, bilingual CHANGELOG.md and README files, and a GitHub Actions release workflow (.github/workflows/release.yml) that packages module.zip and publishes versioned release assets (module.json and module.zip).

Thank you very much for your time and review!
Best regards,
Enfalion
```
