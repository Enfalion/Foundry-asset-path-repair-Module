# Changelog — Asset Path Auto-Repair (`asset-path-repair`)

All notable changes to the **Asset Path Auto-Repair** module for Foundry Virtual Tabletop (V12–V14) are documented in this file.

---

## [1.0.3] — 2026-11-14

### 🇬🇧 English — Native Foundry V14 `Level#background` & `Level#textures` Implementation
- **Replaced Deprecated `Scene#background` Access with Native Foundry V14 `Level` Scanning & Updating**:
  - When `scene.levels` is present (`game.release.generation >= 14` / `scene.levels.size > 0`), the scanner no longer accesses `scene.background` or `scene.foreground`, completely eliminating Foundry V14 deprecation warnings (`Error: Scene#background is deprecated. Use Level#background and Level#textures instead`).
  - Added `collectLevelAssetFields` to natively inspect `Level#background` (`background.src`), `Level#textures` (recursively discovering any nested texture `.src` / path fields inside `level._source.textures` / `level.textures`), and `Level#foreground` on every embedded `Level` document in `scene.levels`, displaying entries clearly as `${scene.name} [Level: ${level.name || level.id}]`.
- **Native Embedded `Level` Document Updates (`sceneLevel`)**:
  - Updates are applied directly to the embedded `Level` document (`await level.update(...)` / `await scene.updateEmbeddedDocuments("Level", ...)`), preserving URI/space encoding and verifying persistence against `level._source`.
  - Automatically regenerates the Scene thumbnail, re-renders open `SceneConfig` / `Level` sheets, and redraws the active Canvas (`await canvas.draw(scene)`).

### 🇩🇪 Deutsch — Native Foundry V14 `Level#background` & `Level#textures` Implementierung
- **Ersetzung des veralteten `Scene#background`-Zugriffs durch native Foundry V14 `Level`-Dokumente**:
  - Sobald `scene.levels` vorhanden ist (Foundry V14+), greift der Scanner nicht mehr auf `scene.background` oder `scene.foreground` zu, wodurch sämtliche V14-Deprecation-Warnungen (`Scene#background is deprecated. Use Level#background and Level#textures instead`) vollständig eliminiert werden.
  - Neue Funktion `collectLevelAssetFields` zum nativen Auslesen von `Level#background` (`background.src`), `Level#textures` (inkl. rekursiver Erkennung aller Textur-Pfade in `level._source.textures` / `level.textures`) und `Level#foreground` für jedes eingebettete `Level`-Dokument in `scene.levels` (Anzeige als `${scene.name} [Level: ${level.name || level.id}]`).
- **Native Updates auf eingebetteten `Level`-Dokumenten (`sceneLevel`)**:
  - Alle Ebenen-Pfade werden direkt auf dem jeweiligen `Level`-Dokument (`await level.update(...)` bzw. `await scene.updateEmbeddedDocuments("Level", ...)`) aktualisiert und unmittelbar gegen `level._source` verifiziert.
  - Automatische Thumbnail-Neugenerierung, Live-Refresh geöffneter `SceneConfig`-/`Level`-Fenster sowie Canvas-Reload (`await canvas.draw(scene)`).

---

## [1.0.2] — 2026-11-14

### 🇬🇧 English — Scene Background Persistence, V14 Levels & Wildcard Token Support
- **Fixed Scene Background Persistence & V14 Multi-Level Support (`scene.levels` / "Aktuelle Ebene")**:
  - Replaced flat `{ "background.src": newPath }` updates using `{ diff: false }` with properly expanded nested objects (`foundry.utils.expandObject({ "background.src": encodedPath })`) and synchronized updates across Foundry V14 `scene.levels` ("Aktuelle Ebene") embedded documents and arrays.
  - Added automatic Scene thumbnail regeneration (`scene.createThumbnail({ img: encodedPath })`) when a Scene background is updated so the navigation sidebar preview refreshes immediately.
  - Added live re-rendering of open `SceneConfig` and Document sheets (`sheet.render(true)`) and passed the active `Scene` instance to `canvas.draw(scene)`.
- **Consistent URI Path Encoding (`%20` vs. Spaces)**:
  - Added `encodeFoundryPath` so resolved paths preserve RFC 3986 segment encoding (e.g., spaces encoded as `%20`) while keeping `/` separators and wildcard characters (`*`, `?`) intact.
- **Strict Post-Write Verification**:
  - Added post-update verification against `_source` and `scene.levels` with automatic fallback retry; if a document still fails to persist the new path, it is accurately marked as `success: false` in the report rather than a false positive.
- **Wildcard Token Path Support (`*.png`, `Prefix*.webp`)**:
  - Added wildcard pattern detection and directory suffix matching so prototype and placed tokens using wildcard paths (e.g., `NPC-Bilder/monster/goblins/*.png` or `NPC-Bilder/monster/kobold/schurke/Kobold*.png`) resolve to their relocated directories while preserving the wildcard pattern at the end.

### 🇩🇪 Deutsch — Szenen-Hintergrund-Persistenz, V14 Ebenen & Wildcard-Token-Unterstützung
- **Korrektur der Szenen-Hintergrund-Persistenz & Foundry V14 Ebenen (`scene.levels` / „Aktuelle Ebene")**:
  - Ersetzung flacher `{ "background.src": newPath }`-Updates mit `{ diff: false }` durch sauber verschachtelte Update-Objekte (`foundry.utils.expandObject({ "background.src": encodedPath })`) sowie automatische Synchronisierung von Foundry V14 `scene.levels`-Dokumenten („Aktuelle Ebene").
  - Automatische Neugenerierung des Szenen-Vorschaubildes (`scene.createThumbnail({ img: encodedPath })`) nach Hintergrund-Updates.
  - Sofortiges Neuzeichnen geöffneter `SceneConfig`-Fenster (`sheet.render(true)`) sowie vollständiger Canvas-Reload (`canvas.draw(scene)`).
- **Konsistente URI-Pfad-Kodierung (`%20` statt Leerzeichen)**:
  - Neue Funktion `encodeFoundryPath`, die Leerzeichen und Sonderzeichen pro Pfadsegment sauber als `%20` kodiert, während `/` und Wildcard-Zeichen (`*`, `?`) erhalten bleiben.
- **Strikte Post-Update-Verifizierung**:
  - Jedes Update wird unmittelbar gegen `_source` und `scene.levels` gegengeprüft (inkl. Fallback-Retry), sodass nicht übernommene Pfade niemals fälschlich als `success: true` gemeldet werden.
- **Unterstützung für Wildcard-Token-Pfade (`*.png`, `Prefix*.webp`)**:
  - Erkennung und Auflösung von Wildcard-Pfaden (z. B. `NPC-Bilder/monster/goblins/*.png` oder `NPC-Bilder/monster/kobold/schurke/Kobold*.png`) anhand von Datei-Regex und Ordnerstruktur unter Beibehaltung des Wildcard-Musters.

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
