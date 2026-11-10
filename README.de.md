# Asset Path Auto-Repair für Foundry VTT (V12–V14)

> 🇬🇧 **[Read the English Documentation here (README.md)](./README.md)**

![Foundry VTT Kompatibilität](https://img.shields.io/badge/Foundry_VTT-v12--v14-orange)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Lizenz](https://img.shields.io/badge/Lizenz-MIT-green)

**Asset Path Auto-Repair** (`asset-path-repair`) ist ein spezialisiertes Administrations- und Reparatur-Werkzeug für **Foundry Virtual Tabletop (V12, V13 und V14, abwärtskompatibel mit V11)**. Das Modul durchsucht ausgewählte Verzeichnisse im Foundry-`Data/`-Speicher rekursiv, erkennt verwaiste Dateipfade in der **LevelDB**-Weltdatenbank nach Ordner-Umstrukturierungen und repariert diese sicher über einen geführten **4-Schritte-Assistenten**.

---

## Hintergrund: Die LevelDB-Architektur und verwaiste Asset-Pfade

Seit Foundry VTT v11 werden sämtliche Weltdaten (Szenen, Akteure, Items, Journale, Playlists, Tabellen und Karten) nicht mehr in einfachen `.db`-Textdateien, sondern in einer binären **LevelDB-Datenbank** gespeichert. Ein einfaches „Suchen & Ersetzen" mit einem Texteditor auf Dateiebene ist dadurch nicht mehr möglich.

Wenn Spielleiter ihre Medienordner auf dem Host-System, NAS, Docker-Container oder Cloud-Server neu strukturieren (z. B. lose Dateien in saubere Unterordner wie `assets/maps/`, `assets/tokens/` oder `assets/handouts/` verschieben), zeigen die in LevelDB gespeicherten Pfade ins Leere. Das manuelle Neuzuweisen hunderter Szenen-Hintergründe, Token-Texturen, Akteur-Portraits und eingebetteter Handout-Bilder im HTML-Code kostet Stunden.

**Asset Path Auto-Repair** automatisiert diesen gesamten Prozess:
1. Das Modul liest über die native Foundry `FilePicker`-API alle Dateien in den gewählten `Data/`-Ordnern ein.
2. Es prüft für jeden in der Welt gespeicherten Pfad, ob die Datei noch am bisherigen Ort existiert.
3. Existiert die Datei dort nicht mehr, sucht das Modul den Dateinamen im neuen Index, fängt Mehrdeutigkeiten (**Kollisionen**) sicher ab und aktualisiert die Dokumente direkt über die offiziellen Foundry Document-APIs.

---

## Funktionsübersicht (Feature-Matrix)

| Funktion | Beschreibung |
| :--- | :--- |
| **Interaktiver 4-Schritte-Assistent** | Geführter Workflow: **1. Ordnerauswahl** → **2. Dry-Run Vorschau & Kollisionsauflösung** → **3. Updates bestätigen & schreiben** → **4. Abschlussbericht**. |
| **Schutz für Systemordner** | Geschützte Verzeichnisse (`systems`, `modules`, `worlds`, `icons`, `ui`) sind standardmäßig abgewählt. Beim Aktivieren erscheint sofort ein Warnhinweis vor möglichen Icon-Kollisionen und längeren Ladezeiten. |
| **Vollständige Foundry V14 Abdeckung** | Prüft Szenen, Kacheln (Tiles), platzierte Tokens (inkl. V12/V14 Dynamic Token Ring `ring.subject.texture`), Ambient Sounds, Kartennotizen, Akteure, Prototyp-Tokens, besessene Items, Active Effects, Welt-Items, Journale, Playlists, Zufallstabellen, Kartenstapel und Makros. |
| **HTML-Parser für Handouts & Biografien** | Durchsucht HTML-Textfelder in Journalseiten (`page.text.content`), Akteur-Biografien und Item-Beschreibungen nach `<img>`-, `<video>`-, `<audio>`- und `<source>`-Tags und ersetzt verwaiste Pfade direkt im HTML-Code unter Erhalt der Formatierung. |
| **Interaktive Kollisionsauflösung** | Kommt ein Dateiname mehrfach in verschiedenen Unterordnern vor, wird er niemals blind überschrieben. Über ein Dropdown-Menü kann der GM pro Kollision gezielt den gewünschten Zielpfad auswählen oder den Eintrag überspringen. |
| **Fehlertolerante Batch-Updates** | Jede Datenbank-Operation ist in eigene `try/catch`-Blöcke gekapselt, sodass einzelne Fehler niemals den Gesamtdurchlauf abbrechen. Wurde die aktive Szene aktualisiert, erfolgt automatisch ein `canvas.draw()`. |
| **Zweisprachige Oberfläche (DE / EN)** | Vollständige deutsche und englische Lokalisierung inklusive **direktem `DE | EN`-Sprachumschalter** in der Kopfleiste des Modul-Fensters. |
| **JSON-Prüfbericht Export** | Exportiere nach Abschluss einen vollständigen JSON-Bericht aller geänderten Dokumente, offenen Kollisionen und fehlenden Dateien. |

---

## Unterstützte Foundry V14 Datenmodelle im Detail

1. **Szenen (`game.scenes`)**
   - `background.src` (Update mit `{ diff: false }` und automatischem `canvas.draw()` bei aktiver Szene)
   - `foreground` / `foreground.src`
   - `thumb` (benutzerdefinierte Vorschaubilder)
   - Eingebettete **Tiles** (`scene.tiles`): `texture.src`
   - Eingebettete **Tokens** (`scene.tokens`): `texture.src`, `ring.subject.texture`
   - Eingebettete **Ambient Sounds** (`scene.sounds`): `path`
   - Eingebettete **Kartennotizen** (`scene.notes`): `texture.src`
2. **Akteure (`game.actors`)**
   - `img`
   - `prototypeToken.texture.src` & `prototypeToken.ring.subject.texture`
   - HTML-Biografien und Beschreibungsfelder innerhalb von `actor.system` (`<img>`, `<video>`, `<audio>`, `<source>`)
   - Eingebettete **Active Effects** (`actor.effects`): `img` / `icon`
   - Eingebettete **Items im Besitz des Akteurs** (`actor.items`): `img`, HTML-Beschreibungen sowie Item-Effekte (`item.effects`)
3. **Welt-Items (`game.items`)**
   - `img`, HTML-Beschreibungsfelder (`item.system`) und eingebettete **Active Effects** (`item.effects`)
4. **Journale & Handouts (`game.journal`)**
   - Eingebettete **Journalseiten** (`journal.pages`):
     - Medienseiten (`image`, `video`, `pdf`, `audio`): `src`
     - Text-/HTML-Seiten (`text`): In-Place-Ersetzung von `<img src="...">`, `<video src="..." poster="...">`, `<audio src="...">` und `<source src="...">` in `text.content`
5. **Playlists (`game.playlists`)**
   - Eingebettete **PlaylistSounds** (`playlist.sounds`): `path`
6. **Zufallstabellen (`game.tables`)**
   - `img` sowie eingebettete **Tabellenergebnisse** (`table.results`): `img` / `icon`
7. **Kartenstapel (`game.cards`)**
   - `img`, `back.img` sowie eingebettete **Einzelkarten** (`stack.cards`): `back.img` und `faces[].img`
8. **Makros (`game.macros`)**
   - `img`

---

## Installation

### Methode 1: Installation über Manifest-URL (Empfohlen)
1. Öffne das Foundry VTT Hauptmenü (Setup) und wechsle zum Reiter **Add-on Modules**.
2. Klicke unten auf **Install Module**.
3. Füge folgende **Manifest-URL** in das Eingabefeld unten ein und klicke auf **Install**:
   ```text
   https://github.com/Enfalion/Foundry-asset-path-repair-Module/releases/latest/download/module.json
   ```

### Methode 2: Manuelle Installation
1. Lade `module.zip` von der [aktuellen GitHub Release-Seite](https://github.com/Enfalion/Foundry-asset-path-repair-Module/releases/latest) herunter.
2. Entpacke das Archiv in dein Verzeichnis `Data/modules/asset-path-repair/`.
3. Starte Foundry VTT neu und aktiviere **Asset Path Auto-Repair** in deiner Welt unter **Module verwalten**.

---

## Schritt-für-Schritt-Anleitung für Spielleiter (GMs)

> **Empfehlung:** Erstelle vor umfangreichen Datenbank-Migrationen immer ein kurzes Backup deiner Welt im Foundry-Setup.

1. **Werkzeug öffnen**:
   - Melde dich als **Spielleiter (GM)** in deiner Welt an.
   - Öffne rechts in der Seitenleiste die **Spieleinstellungen** (Zahnrad-Symbol) und klicke auf den Button **Asset Path Auto-Repair** (Schraubenschlüssel-Icon). Alternativ findest du den Button auch unter *Einstellungen konfigurieren → Moduleinstellungen*.
2. **Schritt 1 — Zu scannende Ordner auswählen**:
   - Das Modul liest automatisch alle Hauptordner im `Data/`-Verzeichnis aus.
   - Eigene Medienordner (z. B. `assets/`, `maps/`, `tokens/`, `audio/`) sind standardmäßig ausgewählt.
   - Geschützte Ordner (`systems/`, `modules/`, `worlds/`, `icons/`, `ui/`) sind standardmäßig deaktiviert, um ungewollte Kollisionen mit System-Icons zu verhindern.
   - Klicke auf **Ausgewählte Ordner scannen (Dry-Run Vorschau)**.
3. **Schritt 2 — Vorschau prüfen & Kollisionen auflösen (Dry-Run)**:
   - Prüfe die Ergebnisse in den drei übersichtlichen Reitern:
     - **Bereit zum Update**: Eindeutig wiedergefundene Dateien mit altem und neuem Pfad. Einzelne Einträge können per Checkbox an- oder abgewählt werden.
     - **Kollisionen**: Dateien, deren Dateiname mehrfach in verschiedenen Ordnern existiert. Wähle über das Dropdown-Menü den gewünschten Zielpfad aus oder belasse den Eintrag auf *Überspringen*.
     - **Fehlend**: Pfade, zu denen in den gescannten Ordnern keine Datei gefunden wurde.
4. **Schritt 3 — Bestätigen & Updates anwenden**:
   - Klicke auf **Bestätigen & Pfad-Updates anwenden**. Alle ausgewählten Änderungen werden nun in die LevelDB geschrieben und die aktive Szene bei Bedarf sofort neu gezeichnet.
5. **Schritt 4 — Abschlussbericht & JSON-Export**:
   - Überprüfe die Zusammenfassung aller aktualisierten Szenen, Akteure, Tokens, Items, Journale und Playlists. Über **JSON-Bericht herunterladen** kannst du das vollständige Änderungsprotokoll lokal speichern.

---

## Lizenz

Veröffentlicht unter der [MIT-Lizenz](./LICENSE) von [Enfalion](https://github.com/Enfalion).
