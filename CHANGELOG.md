# Changelog — Asset Path Auto-Repair (`asset-path-repair`)

All notable changes to the **Asset Path Auto-Repair** module for Foundry Virtual Tabletop (V12–V14) are documented in this file.

---

## [1.0.1] — 2026-11-10

### 🇬🇧 English — Official Foundry VTT Package Listing Compliance
- **Manifest & Metadata Compliance (`module.json`)**:
  - Updated package metadata to version `1.0.1` for official Foundry VTT Package Directory submission.
  - Added explicit `changelog`, raw `license`, and `readme` URLs alongside version-specific release download links (`releases/download/v1.0.1/module.zip`).
  - Added author `flags: {}` schema object and verified `compatibility` (`minimum: "12"`, `verified: "14"`).
- **Release Packaging (`.github/workflows/release.yml`)**:
  - Included `LICENSE` and `CHANGELOG.md` inside the packaged `module.zip` release archive.
- **Documentation**:
  - Added `CHANGELOG.md` (Bilingual EN/DE) and `FOUNDRY_SUBMISSION.md` reference guide for the Foundry VTT Creator Portal.

### 🇩🇪 Deutsch — Vorbereitung für das offizielle Foundry VTT Modul-Verzeichnis
- **Manifest- & Metadaten-Konformität (`module.json`)**:
  - Aktualisierung auf Version `1.0.1` gemäß den offiziellen Richtlinien für die Foundry VTT Package-Einreichung.
  - Ergänzung der expliziten URLs für `changelog`, `license` und `readme` sowie des versionsspezifischen Release-Download-Links (`releases/download/v1.0.1/module.zip`).
  - Ergänzung des `flags: {}`-Objekts im Autoren-Eintrag und Festlegung der Kompatibilität (`minimum: "12"`, `verified: "14"`).
- **Release-Paketierung (`.github/workflows/release.yml`)**:
  - Aufnahme von `LICENSE` und `CHANGELOG.md` in das `module.zip` Release-Archiv.
- **Dokumentation**:
  - Erstellung dieser zweisprachigen `CHANGELOG.md` sowie der Einreichungs-Referenz `FOUNDRY_SUBMISSION.md`.

---

## [1.0.0] — 2026-11-10

### 🇬🇧 English — Initial Release
- **4-Step Interactive Repair Wizard**:
  - **Step 1 (Dynamic Folder Selection)**: Automatically reads top-level `Data/` folders via `FilePicker.browse`. System/protected folders (`systems`, `modules`, `worlds`, `icons`, `ui`) are unchecked by default and trigger an inline safety warning if enabled.
  - **Step 2 (Pre-Update Dry-Run Preview & Collision Resolution)**: Scans world documents and categorizes broken paths into *Ready to Update*, *Collisions* (with interactive dropdown path selectors), and *Missing*.
  - **Step 3 (Resilient Database Updates)**: Applies confirmed updates in isolated `try/catch` blocks, updates Scene backgrounds with `{ diff: false }`, and automatically refreshes the active Canvas (`canvas.draw()`).
  - **Step 4 (Final Execution Summary & Audit Export)**: Displays category counters, a full audit table of updated documents, and a JSON report download option.
- **Full Foundry V14 Data Model Coverage**:
  - Scans Scenes, Tiles, Placed Tokens (including V12/V14 Dynamic Token Ring `ring.subject.texture`), Ambient Sounds, Map Notes, Actors, Prototype Tokens, Owned Items, Active Effects, World Items, Journal Pages (media `src` and embedded HTML `<img>`, `<video>`, `<audio>`, `<source>` tags inside `text.content`), Playlists, Rollable Tables, Card Stacks (`faces[].img`), and Macros.
- **Bilingual UI (EN / DE)**:
  - Complete English and German localization (`lang/en.json`, `lang/de.json`) plus a live `DE | EN` language switcher directly in the window header.

### 🇩🇪 Deutsch — Erstveröffentlichung
- **Interaktiver 4-Schritte-Reparatur-Assistent**:
  - **Schritt 1 (Dynamische Ordnerauswahl)**: Liest alle Hauptordner im `Data/`-Speicher dynamisch aus. Geschützte Ordner (`systems`, `modules`, `worlds`, `icons`, `ui`) sind standardmäßig abgewählt und zeigen bei Auswahl eine Inline-Warnung an.
  - **Schritt 2 (Dry-Run Vorschau & Kollisionsauflösung)**: Analysiert alle Weltdokumente und gruppiert verwaiste Pfade in *Bereit zum Update*, *Kollisionen* (mit Dropdown-Auswahl pro Datei) und *Fehlend*.
  - **Schritt 3 (Fehlertolerante Datenbank-Updates)**: Schreibt alle bestätigten Pfad-Updates per `try/catch` abgesichert in die LevelDB, nutzt `{ diff: false }` für Szenen-Hintergründe und zeichnet die aktive Szene automatisch neu (`canvas.draw()`).
  - **Schritt 4 (Abschlussbericht & JSON-Export)**: Übersichtliche Zähler nach Dokumenttyp, vollständiges Änderungsprotokoll und JSON-Bericht-Download.
- **Vollständige Foundry V14 Datenmodell-Abdeckung**:
  - Unterstützt Szenen, Tiles, platzierte Tokens (inkl. Dynamic Token Ring `ring.subject.texture`), Ambient Sounds, Kartennotizen, Akteure, Prototyp-Tokens, Besitz- und Welt-Items, Active Effects, Journalseiten (Medien-`src` sowie HTML-Parser für `<img>`, `<video>`, `<audio>`, `<source>` in `text.content`), Playlists, Zufallstabellen, Kartenstapel (`faces[].img`) und Makros.
- **Zweisprachige Oberfläche (DE / EN)**:
  - Vollständige deutsche und englische Sprachdateien (`lang/de.json`, `lang/en.json`) sowie direkter `DE | EN`-Sprachumschalter im Fensterkopf.
