/**
 * Asset Path Auto-Repair — Core Engine (Foundry VTT V12–V14, backwards-compatible with V11)
 * Recursively indexes Data directories, detects orphaned LevelDB asset references across all
 * Foundry VTT document types and embedded collections (including V14 Scene Levels and wildcard paths),
 * handles filename collisions safely, parses HTML media tags, and executes verified database updates.
 */

export const MODULE_ID = "asset-path-repair";

export const PROTECTED_DIRS = new Set(["systems", "modules", "worlds", "icons", "ui"]);

export const MEDIA_EXTENSIONS = new Set([
  "webp", "png", "jpg", "jpeg", "gif", "svg", "avif", "bmp", "tif", "tiff", "ico",
  "webm", "mp4", "m4v", "ogv", "mov",
  "ogg", "mp3", "wav", "flac", "m4a", "aac", "opus",
  "pdf"
]);

/**
 * Built-in bilingual dictionary for instant in-UI language switching (DE / EN)
 * independent of the global Foundry client language setting.
 */
export const TRANSLATIONS = {
  en: {
    "APR.Title": "Asset Path Auto-Repair",
    "APR.Subtitle": "LevelDB Asset Path Scanner & Automated Migration Engine (Foundry VTT V12–V14)",
    "APR.SettingsButton": "Asset Path Auto-Repair",
    "APR.SettingsName": "Asset Path Auto-Repair Tool",
    "APR.SettingsHint": "Open the interactive Asset Path Auto-Repair wizard to scan your Data directory and repair broken asset paths.",
    "APR.LangSwitchLabel": "UI Language",
    "APR.LangEN": "EN",
    "APR.LangDE": "DE",
    "APR.Step1Badge": "1. Select Folders",
    "APR.Step2Badge": "2. Preview & Resolve",
    "APR.Step3Badge": "3. Apply Updates",
    "APR.Step4Badge": "4. Final Summary",
    "APR.Step1Title": "Step 1: Select Data Directories to Index",
    "APR.Step1Desc": "Choose which top-level directories inside your Foundry VTT Data storage should be recursively indexed for relocated asset files.",
    "APR.RootFilesOption": "Include files located directly in the Data/ root folder",
    "APR.RootFilesBadge": "Root Files",
    "APR.UserFolderBadge": "User Folder",
    "APR.ProtectedFolderBadge": "System / Protected",
    "APR.ProtectedWarningTitle": "Warning: Protected System / Module / World Directory Selected",
    "APR.ProtectedWarningText": "Scanning protected directories (systems, modules, worlds, icons, ui) is strongly discouraged unless you intentionally migrated assets into or out of them. Indexing tens of thousands of system/module icons can significantly increase scan duration and cause filename collisions with generic icon names (e.g., sword.svg, mystery-man.svg).",
    "APR.SelectSafeBtn": "Select User Folders Only",
    "APR.SelectAllBtn": "Select All",
    "APR.DeselectAllBtn": "Deselect All",
    "APR.RefreshDirsBtn": "Refresh Directories",
    "APR.SubpathFilterLabel": "Optional Subdirectory Filter (relative to Data/):",
    "APR.SubpathFilterPlaceholder": "Leave empty to scan all selected top-level folders, or enter e.g. assets/maps",
    "APR.StartScanBtn": "Scan Selected Folders (Dry-Run Preview)",
    "APR.ScanningProgress": "Indexing filesystem & analyzing LevelDB documents...",
    "APR.Step2Title": "Step 2: Scan Analysis & Pre-Update Preview (Dry-Run)",
    "APR.Step2Desc": "Review all detected broken paths below. No changes have been written to the database yet. Resolve any filename collisions using the dropdown selectors before applying updates.",
    "APR.StatIndexedFiles": "Indexed Files",
    "APR.StatIntactPaths": "Intact Paths",
    "APR.StatReadyToUpdate": "Ready to Update",
    "APR.StatCollisions": "Collisions",
    "APR.StatMissing": "Missing Files",
    "APR.TabReady": "Ready to Update",
    "APR.TabCollisions": "Collisions (Action Needed)",
    "APR.TabMissing": "Missing (Not Found)",
    "APR.FilterPlaceholder": "Filter by document name, type, or path...",
    "APR.ColInclude": "Apply",
    "APR.ColDocType": "Document Type",
    "APR.ColDocName": "Document / Context",
    "APR.ColField": "Property / Field",
    "APR.ColOldPath": "Broken Path (Current)",
    "APR.ColNewPath": "New Target Path",
    "APR.ColFilename": "Filename",
    "APR.ColResolution": "Select Target Path",
    "APR.CollisionSkipOption": "— Skip (Do Not Update) —",
    "APR.CollisionResolveInfo": "Multiple files with the same filename exist across your scanned folders. Select the desired target path for each entry you wish to update, or leave on 'Skip'.",
    "APR.MissingInfo": "These asset paths do not exist at their current location and no matching filename was found in the selected folders.",
    "APR.EmptyReady": "No unambiguous broken paths ready for automatic repair were found.",
    "APR.EmptyCollisions": "No filename collisions detected.",
    "APR.EmptyMissing": "No missing unresolvable files detected.",
    "APR.BackToStep1Btn": "Back to Folder Selection",
    "APR.ReScanBtn": "Re-Scan",
    "APR.ConfirmApplyBtn": "Confirm & Apply Path Updates",
    "APR.ApplyingUpdates": "Applying database updates across world documents...",
    "APR.Step4Title": "Step 4: Final Execution Summary",
    "APR.Step4Desc": "All selected asset path updates have been processed. Below is the complete audit log of modified LevelDB documents.",
    "APR.SummaryTotalUpdated": "Total Paths Updated",
    "APR.SummaryScenes": "Scenes",
    "APR.SummaryActors": "Actors",
    "APR.SummaryTokens": "Tokens",
    "APR.SummaryItems": "Items",
    "APR.SummaryJournals": "Journals / Handouts",
    "APR.SummaryPlaylists": "Playlists",
    "APR.SummaryOther": "Tables / Cards / Macros",
    "APR.SummaryErrors": "Failed / Errors",
    "APR.ColStatus": "Status",
    "APR.StatusSuccess": "Updated",
    "APR.StatusError": "Failed",
    "APR.ExportJsonBtn": "Download JSON Report",
    "APR.NewScanBtn": "Start New Scan",
    "APR.CloseBtn": "Close",
    "APR.NotifyGMOnly": "Asset Path Auto-Repair can only be executed by a Game Master.",
    "APR.NotifyNoFoldersSelected": "Please select at least one directory (or root files) to scan.",
    "APR.NotifyCollisionsDetected": "Asset Path Auto-Repair detected {count} filename collision(s). Please review and select target paths in the Collisions tab.",
    "APR.NotifyScanComplete": "Scan complete: {ready} ready to update, {collisions} collision(s), {missing} missing.",
    "APR.NotifyUpdateComplete": "Asset Path Auto-Repair completed: {updated} path(s) updated successfully ({errors} failed).",
    "APR.NotifyNoUpdatesSelected": "No path updates are currently selected to apply.",
    "APR.DocType.Scene": "Scene",
    "APR.DocType.Tile": "Scene Tile",
    "APR.DocType.Token": "Scene Token",
    "APR.DocType.AmbientSound": "Ambient Sound",
    "APR.DocType.Note": "Map Note",
    "APR.DocType.Actor": "Actor",
    "APR.DocType.PrototypeToken": "Prototype Token",
    "APR.DocType.ActorItem": "Actor Owned Item",
    "APR.DocType.ActorEffect": "Actor Active Effect",
    "APR.DocType.ActorItemEffect": "Owned Item Effect",
    "APR.DocType.Item": "World Item",
    "APR.DocType.ItemEffect": "Item Active Effect",
    "APR.DocType.JournalImage": "Journal Page (Media)",
    "APR.DocType.JournalHTML": "Journal Page (HTML)",
    "APR.DocType.PlaylistSound": "Playlist Sound",
    "APR.DocType.RollTable": "Rollable Table",
    "APR.DocType.TableResult": "Table Result",
    "APR.DocType.Cards": "Card Stack",
    "APR.DocType.Card": "Card",
    "APR.DocType.Macro": "Macro"
  },
  de: {
    "APR.Title": "Asset Path Auto-Repair",
    "APR.Subtitle": "LevelDB-Pfadscanner & Automatische Pfadreparatur (Foundry VTT V12–V14)",
    "APR.SettingsButton": "Asset Path Auto-Repair",
    "APR.SettingsName": "Asset Path Auto-Repair Werkzeug",
    "APR.SettingsHint": "Öffnet den interaktiven Asset Path Auto-Repair Assistenten zum Scannen des Data-Verzeichnisses und zur Reparatur verwaister Dateipfade.",
    "APR.LangSwitchLabel": "Sprache",
    "APR.LangEN": "EN",
    "APR.LangDE": "DE",
    "APR.Step1Badge": "1. Ordnerauswahl",
    "APR.Step2Badge": "2. Vorschau & Kollisionen",
    "APR.Step3Badge": "3. Pfade anwenden",
    "APR.Step4Badge": "4. Abschlussbericht",
    "APR.Step1Title": "Schritt 1: Zu scannende Data-Verzeichnisse auswählen",
    "APR.Step1Desc": "Wähle aus, welche Hauptordner im Foundry VTT Data-Speicher rekursiv nach verschobenen Mediendateien durchsucht und indexiert werden sollen.",
    "APR.RootFilesOption": "Dateien direkt im Data/-Hauptverzeichnis einbeziehen",
    "APR.RootFilesBadge": "Hauptverzeichnis",
    "APR.UserFolderBadge": "Benutzerordner",
    "APR.ProtectedFolderBadge": "System / Geschützt",
    "APR.ProtectedWarningTitle": "Warnung: Geschützter System- / Modul- / Welt-Ordner ausgewählt",
    "APR.ProtectedWarningText": "Das Scannen geschützter Verzeichnisse (systems, modules, worlds, icons, ui) wird dringend abgeraten, sofern nicht gezielt eigene Assets dorthin verschoben wurden. Das Indexieren tausender System-/Modul-Icons verlangsamt den Scan erheblich und führt zu Dateinamen-Kollisionen bei generischen Namen (z. B. sword.svg, mystery-man.svg).",
    "APR.SelectSafeBtn": "Nur Benutzerordner wählen",
    "APR.SelectAllBtn": "Alle auswählen",
    "APR.DeselectAllBtn": "Alle abwählen",
    "APR.RefreshDirsBtn": "Ordner neu laden",
    "APR.SubpathFilterLabel": "Optionaler Unterordner-Filter (relativ zu Data/):",
    "APR.SubpathFilterPlaceholder": "Leer lassen für ausgewählte Hauptordner oder z. B. assets/maps eingeben",
    "APR.StartScanBtn": "Ausgewählte Ordner scannen (Dry-Run Vorschau)",
    "APR.ScanningProgress": "Dateisystem wird indexiert & LevelDB-Dokumente werden analysiert...",
    "APR.Step2Title": "Schritt 2: Scan-Analyse & Änderungsvorschau (Dry-Run)",
    "APR.Step2Desc": "Überprüfe alle erkannten verwaisten Pfade. Es wurden noch keine Datenbankänderungen geschrieben. Löse eventuelle Dateinamen-Kollisionen über die Dropdown-Auswahl auf, bevor du die Updates anwendest.",
    "APR.StatIndexedFiles": "Indexierte Dateien",
    "APR.StatIntactPaths": "Intakte Pfade",
    "APR.StatReadyToUpdate": "Bereit zum Update",
    "APR.StatCollisions": "Kollisionen",
    "APR.StatMissing": "Nicht gefunden",
    "APR.TabReady": "Bereit zum Update",
    "APR.TabCollisions": "Kollisionen (Auswahl nötig)",
    "APR.TabMissing": "Fehlend (Nicht gefunden)",
    "APR.FilterPlaceholder": "Nach Dokumentname, Typ oder Pfad filtern...",
    "APR.ColInclude": "Aktiv",
    "APR.ColDocType": "Dokumenttyp",
    "APR.ColDocName": "Dokument / Kontext",
    "APR.ColField": "Eigenschaft / Feld",
    "APR.ColOldPath": "Verwaister Pfad (Aktuell)",
    "APR.ColNewPath": "Neuer Zielpfad",
    "APR.ColFilename": "Dateiname",
    "APR.ColResolution": "Zielpfad auswählen",
    "APR.CollisionSkipOption": "— Überspringen (Nicht ändern) —",
    "APR.CollisionResolveInfo": "Mehrere Dateien mit identischem Dateinamen wurden in den gescannten Ordnern gefunden. Wähle den gewünschten neuen Zielpfad im Dropdown-Menü aus oder belasse den Eintrag auf 'Überspringen'.",
    "APR.MissingInfo": "Diese Dateipfade existieren nicht mehr am bisherigen Speicherort und konnten in keinem der gescannten Ordner gefunden werden.",
    "APR.EmptyReady": "Keine eindeutigen verwaisten Pfade zur automatischen Reparatur gefunden.",
    "APR.EmptyCollisions": "Keine Dateinamen-Kollisionen festgestellt.",
    "APR.EmptyMissing": "Keine fehlenden unauflösbaren Dateien festgestellt.",
    "APR.BackToStep1Btn": "Zurück zur Ordnerauswahl",
    "APR.ReScanBtn": "Erneut scannen",
    "APR.ConfirmApplyBtn": "Bestätigen & Pfad-Updates anwenden",
    "APR.ApplyingUpdates": "Datenbank-Updates werden in LevelDB geschrieben...",
    "APR.Step4Title": "Schritt 4: Zusammenfassung der durchgeführten Updates",
    "APR.Step4Desc": "Alle ausgewählten Pfad-Reparaturen wurden abgearbeitet. Nachfolgend findest du das vollständige Protokoll aller geänderten Dokumente.",
    "APR.SummaryTotalUpdated": "Aktualisierte Pfade gesamt",
    "APR.SummaryScenes": "Szenen",
    "APR.SummaryActors": "Akteure",
    "APR.SummaryTokens": "Tokens",
    "APR.SummaryItems": "Items",
    "APR.SummaryJournals": "Journale / Handouts",
    "APR.SummaryPlaylists": "Playlists",
    "APR.SummaryOther": "Tabellen / Karten / Makros",
    "APR.SummaryErrors": "Fehler",
    "APR.ColStatus": "Status",
    "APR.StatusSuccess": "Aktualisiert",
    "APR.StatusError": "Fehler",
    "APR.ExportJsonBtn": "JSON-Bericht herunterladen",
    "APR.NewScanBtn": "Neuen Scan starten",
    "APR.CloseBtn": "Schließen",
    "APR.NotifyGMOnly": "Asset Path Auto-Repair kann nur von einem Spielleiter (GM) ausgeführt werden.",
    "APR.NotifyNoFoldersSelected": "Bitte wähle mindestens ein Verzeichnis (oder Hauptverzeichnis-Dateien) für den Scan aus.",
    "APR.NotifyCollisionsDetected": "Asset Path Auto-Repair hat {count} Dateinamen-Kollision(en) erkannt. Bitte prüfe und wähle die gewünschten Zielpfade im Reiter 'Kollisionen'.",
    "APR.NotifyScanComplete": "Scan abgeschlossen: {ready} bereit zum Update, {collisions} Kollision(en), {missing} fehlend.",
    "APR.NotifyUpdateComplete": "Asset Path Auto-Repair abgeschlossen: {updated} Pfad(e) erfolgreich aktualisiert ({errors} Fehler).",
    "APR.NotifyNoUpdatesSelected": "Aktuell sind keine Pfad-Updates zur Ausführung ausgewählt.",
    "APR.DocType.Scene": "Szene",
    "APR.DocType.Tile": "Szenen-Kachel (Tile)",
    "APR.DocType.Token": "Szenen-Token",
    "APR.DocType.AmbientSound": "Umgebungsgeräusch",
    "APR.DocType.Note": "Kartennotiz",
    "APR.DocType.Actor": "Akteur",
    "APR.DocType.PrototypeToken": "Prototyp-Token",
    "APR.DocType.ActorItem": "Akteur-Item (Besitz)",
    "APR.DocType.ActorEffect": "Akteur-Effekt",
    "APR.DocType.ActorItemEffect": "Item-Effekt (Akteur)",
    "APR.DocType.Item": "Welt-Item",
    "APR.DocType.ItemEffect": "Welt-Item-Effekt",
    "APR.DocType.JournalImage": "Journalseite (Medien)",
    "APR.DocType.JournalHTML": "Journalseite (HTML)",
    "APR.DocType.PlaylistSound": "Playlist-Track",
    "APR.DocType.RollTable": "Zufallstabelle",
    "APR.DocType.TableResult": "Tabellenergebnis",
    "APR.DocType.Cards": "Kartenstapel",
    "APR.DocType.Card": "Einzelkarte",
    "APR.DocType.Macro": "Makro"
  }
};

/**
 * Translate a key using the given language code ("en" or "de") with optional placeholder interpolation.
 * @param {string} lang
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 * @returns {string}
 */
export function translate(lang, key, params = {}) {
  const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  let str = dict[key] ?? TRANSLATIONS.en[key] ?? (game?.i18n?.localize ? game.i18n.localize(key) : key);
  for (const [k, v] of Object.entries(params)) {
    str = str.replaceAll(`{${k}}`, String(v));
  }
  return str;
}

/**
 * Resolve the Foundry FilePicker implementation across Foundry V11, V12, V13, and V14.
 */
export function getFilePicker() {
  return (
    foundry?.applications?.apps?.FilePicker?.implementation ??
    foundry?.applications?.apps?.FilePicker ??
    globalThis.FilePicker
  );
}

/**
 * Normalize a file path by URL-decoding, unifying slashes, stripping leading slashes,
 * and removing query/hash suffixes.
 * @param {string} rawPath
 * @returns {string}
 */
export function normalizePath(rawPath) {
  if (!rawPath || typeof rawPath !== "string") return "";
  let cleaned = rawPath.trim();
  const qIdx = cleaned.indexOf("?");
  if (qIdx !== -1) {
    // Only strip '?' if it looks like a query parameter (e.g. ?v=1) rather than a single-char filename wildcard
    const afterQ = cleaned.slice(qIdx + 1);
    if (afterQ.includes("=") || !afterQ.includes(".")) {
      cleaned = cleaned.slice(0, qIdx);
    }
  }
  const hIdx = cleaned.indexOf("#");
  if (hIdx !== -1) cleaned = cleaned.slice(0, hIdx);
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (_err) {
    // Ignore malformed percent sequences
  }
  cleaned = cleaned.replace(/\\/g, "/").replace(/^\/+/, "");
  return cleaned;
}

/**
 * Encode a normalized path for Foundry VTT's FilePathField and PIXI loader:
 * encodes each path segment via `encodeURIComponent` (turning spaces into `%20`, etc.)
 * while keeping path separators (`/`) and wildcard characters (`*`, `?`) intact.
 * @param {string} pathStr
 * @returns {string}
 */
export function encodeFoundryPath(pathStr) {
  if (!pathStr || typeof pathStr !== "string") return "";
  const norm = normalizePath(pathStr);
  if (!norm) return "";
  return norm
    .split("/")
    .map((seg) =>
      encodeURIComponent(seg)
        .replace(/%2A/gi, "*")
        .replace(/%3F/gi, "?")
    )
    .join("/");
}

/**
 * Check whether a path string contains wildcard characters (`*` or `?`).
 * @param {string} pathStr
 * @returns {boolean}
 */
export function isWildcardPath(pathStr) {
  if (!pathStr || typeof pathStr !== "string") return false;
  return /[*?]/.test(normalizePath(pathStr));
}

/**
 * Convert a wildcard filename pattern (e.g. `*.png` or `Kobold*.png`) into a case-insensitive RegExp.
 * @param {string} pattern
 * @returns {RegExp}
 */
export function wildcardToRegExp(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const regexStr = "^" + escaped.replace(/\*/g, ".*").replace(/\?/g, ".") + "$";
  return new RegExp(regexStr, "i");
}

/**
 * Extract the filename (`file.ext`) from a normalized path.
 * @param {string} normalizedPath
 * @returns {string}
 */
export function extractFilename(normalizedPath) {
  if (!normalizedPath) return "";
  const idx = normalizedPath.lastIndexOf("/");
  return idx === -1 ? normalizedPath : normalizedPath.slice(idx + 1);
}

/**
 * Extract the parent directory (`dir/subdir`) from a normalized path.
 * @param {string} normalizedPath
 * @returns {string}
 */
export function extractParentDir(normalizedPath) {
  if (!normalizedPath) return "";
  const idx = normalizedPath.lastIndexOf("/");
  return idx === -1 ? "" : normalizedPath.slice(0, idx);
}

/**
 * Check if a string looks like a local media file path by checking its extension.
 * @param {string} candidate
 * @returns {boolean}
 */
export function looksLikeMediaPath(candidate) {
  if (!candidate || typeof candidate !== "string") return false;
  if (candidate.length > 500 || candidate.includes("\n") || candidate.includes("<")) return false;
  const norm = normalizePath(candidate);
  if (!norm || !norm.includes(".")) return false;
  const ext = norm.slice(norm.lastIndexOf(".") + 1).toLowerCase();
  return MEDIA_EXTENSIONS.has(ext);
}

/**
 * Safely extract all Level entries from a Foundry V14 `scene.levels` collection or `_source.levels` array.
 * @param {any} scene
 * @returns {any[]}
 */
export function getSceneLevelsList(scene) {
  if (!scene) return [];
  const levels = scene.levels;
  if (!levels) {
    return Array.isArray(scene._source?.levels) ? scene._source.levels : [];
  }
  if (Array.isArray(levels)) return levels;
  if (typeof levels.values === "function") return Array.from(levels.values());
  if (typeof levels[Symbol.iterator] === "function") return Array.from(levels);
  if (typeof levels === "object") return Object.values(levels);
  return [];
}

/**
 * Core Engine for indexing Data folders, scanning Foundry V14 documents, and applying updates.
 */
export class AssetPathRepairEngine {
  constructor() {
    /** @type {Set<string>} */
    this.allKnownPaths = new Set();
    /** @type {Map<string, string>} lowercase full path -> canonical path */
    this.allKnownPathsLower = new Map();
    /** @type {Map<string, string[]>} exact filename -> array of relative paths */
    this.fileMap = new Map();
    /** @type {Map<string, string[]>} lowercase filename -> array of relative paths */
    this.fileMapLower = new Map();
    /** @type {Map<string, string[]>} normalized parent directory -> array of filenames inside that directory */
    this.dirFilesMap = new Map();
    /** @type {Map<string, Set<string>>} cached directory browse lookups for non-indexed folders */
    this.unindexedDirCache = new Map();
    /** @type {Set<string>} active protected prefixes allowed by user */
    this.allowedProtectedPrefixes = new Set();
  }

  /**
   * Read top-level directories in `data` storage for Step 1 folder selection.
   * @returns {Promise<{ dirs: Array<{ name: string, path: string, isProtected: boolean, checked: boolean }>, rootFileCount: number }>}
   */
  static async listRootDirectories() {
    const FP = getFilePicker();
    const res = await FP.browse("data", "");
    const dirs = [];
    for (const rawDir of res.dirs ?? []) {
      const norm = normalizePath(rawDir).replace(/\/+$/, "");
      if (!norm) continue;
      const topName = norm.split("/")[0];
      const isProtected = PROTECTED_DIRS.has(topName.toLowerCase());
      dirs.push({
        name: topName,
        path: norm,
        isProtected,
        checked: !isProtected
      });
    }
    dirs.sort((a, b) => {
      if (a.isProtected !== b.isProtected) return a.isProtected ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
    const rootFileCount = (res.files ?? []).length;
    return { dirs, rootFileCount };
  }

  /**
   * Reset all internal index structures before a new scan.
   */
  resetIndex() {
    this.allKnownPaths.clear();
    this.allKnownPathsLower.clear();
    this.fileMap.clear();
    this.fileMapLower.clear();
    this.dirFilesMap.clear();
    this.unindexedDirCache.clear();
    this.allowedProtectedPrefixes.clear();
  }

  /**
   * Register a discovered file in the lookup maps.
   * @param {string} rawFilePath
   */
  _indexFile(rawFilePath) {
    const cleanPath = normalizePath(rawFilePath);
    if (!cleanPath) return;
    if (this.allKnownPaths.has(cleanPath)) return;

    this.allKnownPaths.add(cleanPath);
    this.allKnownPathsLower.set(cleanPath.toLowerCase(), cleanPath);

    const fileName = extractFilename(cleanPath);
    if (!fileName) return;

    const parentDir = extractParentDir(cleanPath);
    if (!this.dirFilesMap.has(parentDir)) {
      this.dirFilesMap.set(parentDir, []);
    }
    this.dirFilesMap.get(parentDir).push(fileName);

    if (!this.fileMap.has(fileName)) {
      this.fileMap.set(fileName, []);
    }
    this.fileMap.get(fileName).push(cleanPath);

    const lowerName = fileName.toLowerCase();
    if (!this.fileMapLower.has(lowerName)) {
      this.fileMapLower.set(lowerName, []);
    }
    this.fileMapLower.get(lowerName).push(cleanPath);
  }

  /**
   * Recursively crawl selected directories inside `data`.
   * @param {object} options
   * @param {string[]} options.selectedDirs - Top-level directory paths selected by the user
   * @param {boolean} options.includeRootFiles - Whether to index files directly in `data/` root
   * @param {string} [options.subpathFilter] - Optional specific subfolder to crawl
   * @returns {Promise<number>} Total number of indexed files
   */
  async buildFileIndex({ selectedDirs = [], includeRootFiles = true, subpathFilter = "" } = {}) {
    this.resetIndex();
    const FP = getFilePicker();

    for (const dir of selectedDirs) {
      const top = normalizePath(dir).split("/")[0]?.toLowerCase();
      if (PROTECTED_DIRS.has(top)) {
        this.allowedProtectedPrefixes.add(top);
      }
    }

    const cleanSubpath = normalizePath(subpathFilter).replace(/\/+$/, "");
    if (cleanSubpath) {
      const top = cleanSubpath.split("/")[0]?.toLowerCase();
      if (PROTECTED_DIRS.has(top)) {
        this.allowedProtectedPrefixes.add(top);
      }
      await this._crawlDirectoryRecursive(FP, cleanSubpath);
      return this.allKnownPaths.size;
    }

    if (includeRootFiles) {
      try {
        const rootRes = await FP.browse("data", "");
        for (const f of rootRes.files ?? []) {
          this._indexFile(f);
        }
      } catch (err) {
        console.warn(`${MODULE_ID} | Could not browse data root files:`, err);
      }
    }

    for (const dir of selectedDirs) {
      const normDir = normalizePath(dir).replace(/\/+$/, "");
      if (!normDir) continue;
      await this._crawlDirectoryRecursive(FP, normDir);
    }

    return this.allKnownPaths.size;
  }

  /**
   * Internal recursive directory crawler.
   * @param {any} FP
   * @param {string} targetPath
   */
  async _crawlDirectoryRecursive(FP, targetPath) {
    let result;
    try {
      result = await FP.browse("data", targetPath);
    } catch (err) {
      console.warn(`${MODULE_ID} | Skipping inaccessible folder "${targetPath}":`, err);
      return;
    }

    for (const file of result.files ?? []) {
      this._indexFile(file);
    }

    for (const subDir of result.dirs ?? []) {
      const normSub = normalizePath(subDir).replace(/\/+$/, "");
      if (!normSub || normSub === targetPath) continue;
      const topSegment = normSub.split("/")[0]?.toLowerCase();
      if (PROTECTED_DIRS.has(topSegment) && !this.allowedProtectedPrefixes.has(topSegment)) {
        continue;
      }
      await this._crawlDirectoryRecursive(FP, normSub);
    }
  }

  /**
   * Check whether a path should be completely ignored (external link, data URI, or unselected protected folder).
   * @param {string} rawPath
   * @returns {boolean}
   */
  shouldIgnorePath(rawPath) {
    if (!rawPath || typeof rawPath !== "string") return true;
    const trimmed = rawPath.trim();
    if (!trimmed) return true;
    const lower = trimmed.toLowerCase();
    if (
      lower.startsWith("http://") ||
      lower.startsWith("https://") ||
      lower.startsWith("data:") ||
      lower.startsWith("blob:") ||
      lower.startsWith("s3:") ||
      lower.startsWith("foundry://")
    ) {
      return true;
    }

    const clean = normalizePath(trimmed);
    if (!clean) return true;
    const topSegment = clean.split("/")[0]?.toLowerCase();
    if (PROTECTED_DIRS.has(topSegment) && !this.allowedProtectedPrefixes.has(topSegment)) {
      return true;
    }
    return false;
  }

  /**
   * Retrieve the set of normalized file paths inside `parentDir` on disk (cached).
   * @param {string} parentDir
   * @returns {Promise<Set<string>>}
   */
  async _getParentDirFilesOnDisk(parentDir) {
    if (!this.unindexedDirCache.has(parentDir)) {
      const filesInParent = new Set();
      try {
        const FP = getFilePicker();
        const res = await FP.browse("data", parentDir);
        for (const f of res.files ?? []) {
          filesInParent.add(normalizePath(f));
        }
      } catch (_err) {
        // Directory does not exist on disk
      }
      this.unindexedDirCache.set(parentDir, filesInParent);
    }
    return this.unindexedDirCache.get(parentDir);
  }

  /**
   * Check if a normalized path (or wildcard pattern) currently exists at its stored location on disk.
   * @param {string} cleanPath
   * @returns {Promise<boolean>}
   */
  async pathExistsAtCurrentLocation(cleanPath) {
    if (isWildcardPath(cleanPath)) {
      const parentDir = extractParentDir(cleanPath);
      const fileNamePattern = extractFilename(cleanPath);
      const regex = wildcardToRegExp(fileNamePattern);

      const indexedNames = this.dirFilesMap.get(parentDir);
      if (indexedNames && indexedNames.some((name) => regex.test(name))) {
        return true;
      }

      const diskFiles = await this._getParentDirFilesOnDisk(parentDir);
      for (const f of diskFiles) {
        if (regex.test(extractFilename(f))) return true;
      }
      return false;
    }

    if (this.allKnownPaths.has(cleanPath)) return true;
    const parentDir = extractParentDir(cleanPath);
    const diskFiles = await this._getParentDirFilesOnDisk(parentDir);
    return diskFiles.has(cleanPath);
  }

  /**
   * Evaluate a wildcard path (e.g. `NPC-Bilder/monster/goblins/*.png` or `.../Kobold*.png`)
   * against all indexed directories and files.
   * @param {string} cleanOldPath
   */
  async evaluateWildcardPath(cleanOldPath) {
    if (await this.pathExistsAtCurrentLocation(cleanOldPath)) {
      return { status: "intact", cleanOldPath };
    }

    const oldParentDir = extractParentDir(cleanOldPath);
    const fileNamePattern = extractFilename(cleanOldPath);
    if (!fileNamePattern) return { status: "ignored" };

    const regex = wildcardToRegExp(fileNamePattern);
    const oldSegments = oldParentDir
      ? oldParentDir.split("/").filter(Boolean).map((s) => s.toLowerCase())
      : [];

    // Find all indexed directories containing at least one file matching the wildcard pattern
    const matchingDirs = [];
    for (const [dirPath, fileNames] of this.dirFilesMap.entries()) {
      if (!fileNames.some((fn) => regex.test(fn))) continue;

      const candSegments = dirPath
        ? dirPath.split("/").filter(Boolean).map((s) => s.toLowerCase())
        : [];

      // Count how many trailing directory segments match (from leaf folder upwards)
      let trailingScore = 0;
      let i = oldSegments.length - 1;
      let j = candSegments.length - 1;
      while (i >= 0 && j >= 0 && oldSegments[i] === candSegments[j]) {
        trailingScore++;
        i--;
        j--;
      }

      matchingDirs.push({
        dirPath,
        trailingScore
      });
    }

    if (matchingDirs.length === 0) {
      return {
        status: "missing",
        cleanOldPath,
        fileName: fileNamePattern
      };
    }

    let bestDirs = matchingDirs;
    if (oldSegments.length > 0) {
      const maxScore = Math.max(...matchingDirs.map((d) => d.trailingScore));
      if (maxScore > 0) {
        bestDirs = matchingDirs.filter((d) => d.trailingScore === maxScore);
      } else {
        // No folder segment matched; only allow matching solely by pattern if the pattern has a specific filename stem (e.g. `Kobold*.png`)
        const stemWithoutWildcards = fileNamePattern.replace(/\.[^.]+$/, "").replace(/[*?]/g, "").trim();
        if (stemWithoutWildcards.length === 0) {
          return {
            status: "missing",
            cleanOldPath,
            fileName: fileNamePattern
          };
        }
      }
    }

    const candidatePaths = bestDirs.map((d) =>
      encodeFoundryPath(d.dirPath ? `${d.dirPath}/${fileNamePattern}` : fileNamePattern)
    );

    if (candidatePaths.length === 1) {
      return {
        status: "ready",
        cleanOldPath,
        fileName: fileNamePattern,
        newPath: candidatePaths[0]
      };
    }

    return {
      status: "collision",
      cleanOldPath,
      fileName: fileNamePattern,
      candidates: candidatePaths
    };
  }

  /**
   * Evaluate a single stored path against the crawled file index.
   * @param {string} rawPath
   * @returns {Promise<{ status: "ignored"|"intact"|"ready"|"collision"|"missing", cleanOldPath?: string, fileName?: string, newPath?: string, candidates?: string[] }>}
   */
  async evaluatePath(rawPath) {
    if (this.shouldIgnorePath(rawPath)) {
      return { status: "ignored" };
    }

    const cleanOldPath = normalizePath(rawPath);
    if (!cleanOldPath) return { status: "ignored" };

    // Handle wildcard token/asset paths (e.g. `*.png`, `Kobold*.png`)
    if (isWildcardPath(cleanOldPath)) {
      return this.evaluateWildcardPath(cleanOldPath);
    }

    // 1. Check if the path still exists at its current location
    if (await this.pathExistsAtCurrentLocation(cleanOldPath)) {
      return { status: "intact", cleanOldPath };
    }

    // 2. Check if only case sensitivity changed at the exact same relative path
    const exactLowerMatch = this.allKnownPathsLower.get(cleanOldPath.toLowerCase());
    if (exactLowerMatch && exactLowerMatch !== cleanOldPath) {
      return {
        status: "ready",
        cleanOldPath,
        fileName: extractFilename(cleanOldPath),
        newPath: encodeFoundryPath(exactLowerMatch)
      };
    }

    // 3. Look up by filename in the crawled index (prefer exact case, fallback to case-insensitive)
    const fileName = extractFilename(cleanOldPath);
    if (!fileName) return { status: "ignored" };

    let matches = this.fileMap.get(fileName);
    if (!matches || matches.length === 0) {
      matches = this.fileMapLower.get(fileName.toLowerCase()) ?? [];
    }

    if (matches.length === 0) {
      return {
        status: "missing",
        cleanOldPath,
        fileName
      };
    }

    if (matches.length === 1) {
      return {
        status: "ready",
        cleanOldPath,
        fileName,
        newPath: encodeFoundryPath(matches[0])
      };
    }

    return {
      status: "collision",
      cleanOldPath,
      fileName,
      candidates: matches.map((m) => encodeFoundryPath(m))
    };
  }

  /**
   * Extract all media paths referenced inside an HTML string (`<img>`, `<video>`, `<audio>`, `<source>`, `poster=`).
   * @param {string} htmlContent
   * @returns {string[]} Unique raw paths found in HTML media attributes
   */
  extractHtmlMediaPaths(htmlContent) {
    if (!htmlContent || typeof htmlContent !== "string") return [];
    const found = new Set();
    const tagAttrRegex = /<(?:img|video|audio|source)\b[^>]*?\b(?:src|poster)\s*=\s*["']([^"']+)["']/gi;
    let match;
    while ((match = tagAttrRegex.exec(htmlContent)) !== null) {
      if (match[1]) found.add(match[1]);
    }
    return Array.from(found);
  }

  /**
   * Recursively inspect an object (such as `actor.system` or `item.system`) for HTML strings or direct media paths.
   * @param {any} obj
   * @param {string} prefix
   * @param {number} depth
   * @returns {Array<{ fieldPath: string, value: string, isHtml: boolean }>}
   */
  collectSystemStringFields(obj, prefix = "system", depth = 0) {
    const results = [];
    if (!obj || typeof obj !== "object" || depth > 5) return results;

    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith("_")) continue;
      const currentPath = `${prefix}.${key}`;
      if (typeof val === "string" && val.trim().length > 0) {
        if (/<(?:img|video|audio|source)\b/i.test(val)) {
          results.push({ fieldPath: currentPath, value: val, isHtml: true });
        } else if (looksLikeMediaPath(val)) {
          results.push({ fieldPath: currentPath, value: val, isHtml: false });
        }
      } else if (val && typeof val === "object" && !Array.isArray(val)) {
        results.push(...this.collectSystemStringFields(val, currentPath, depth + 1));
      }
    }
    return results;
  }

  /**
   * Scan all Foundry V14 document collections and embedded collections for broken asset paths.
   * Covers:
   * 1. Scenes (background.src, foreground, thumb, V14 scene.levels, tiles, tokens + ring.subject.texture, sounds, notes)
   * 2. Actors (img, prototypeToken.texture.src, prototypeToken.ring.subject.texture, system HTML, items, effects)
   * 3. World Items (img, system HTML, effects)
   * 4. Journal Entries & Pages (image/video/pdf/audio src, text HTML content)
   * 5. Playlists & PlaylistSounds (path)
   * 6. Rollable Tables & TableResults (img)
   * 7. Card Stacks & Cards (img, back.img, faces[].img)
   * 8. Macros (img)
   */
  async scanWorldDocuments() {
    const findings = {
      indexedCount: this.allKnownPaths.size,
      intactCount: 0,
      ready: [],
      collisions: [],
      missing: []
    };

    let nextFindingId = 1;

    /**
     * Helper to evaluate and record a single path reference.
     */
    const checkReference = async (meta) => {
      const { rawPath } = meta;
      const evalResult = await this.evaluatePath(rawPath);
      if (evalResult.status === "ignored") return;
      if (evalResult.status === "intact") {
        findings.intactCount++;
        return;
      }

      const baseEntry = {
        id: `finding-${nextFindingId++}`,
        docTypeKey: meta.docTypeKey,
        docCategory: meta.docCategory,
        docName: meta.docName,
        fieldPath: meta.fieldPath,
        oldPath: rawPath,
        cleanOldPath: evalResult.cleanOldPath,
        fileName: evalResult.fileName,
        isHtml: Boolean(meta.isHtml),
        updateDescriptor: meta.updateDescriptor
      };

      if (evalResult.status === "ready") {
        findings.ready.push({
          ...baseEntry,
          newPath: evalResult.newPath,
          included: true
        });
      } else if (evalResult.status === "collision") {
        findings.collisions.push({
          ...baseEntry,
          candidates: evalResult.candidates,
          selectedPath: "skip"
        });
      } else if (evalResult.status === "missing") {
        findings.missing.push(baseEntry);
      }
    };

    /**
     * Helper to evaluate all media references inside an HTML field.
     */
    const checkHtmlField = async (meta) => {
      const mediaPaths = this.extractHtmlMediaPaths(meta.htmlContent);
      for (const rawPath of mediaPaths) {
        await checkReference({
          ...meta,
          rawPath,
          isHtml: true
        });
      }
    };

    // =========================================================================
    // 1. SCENES (game.scenes) + FOUNDRY V14 SCENE LEVELS (scene.levels)
    // =========================================================================
    for (const scene of game.scenes ?? []) {
      const sceneName = scene.name || scene.id;
      const rootBgSrc = scene.background?.src ?? scene._source?.background?.src;

      if (rootBgSrc) {
        await checkReference({
          docTypeKey: "APR.DocType.Scene",
          docCategory: "scenes",
          docName: sceneName,
          fieldPath: "background.src",
          rawPath: rootBgSrc,
          updateDescriptor: {
            kind: "sceneRoot",
            sceneId: scene.id,
            fieldPath: "background.src"
          }
        });
      }

      const fgSrc = typeof scene.foreground === "string" ? scene.foreground : scene.foreground?.src;
      const fgField = typeof scene.foreground === "string" ? "foreground" : "foreground.src";
      if (fgSrc) {
        await checkReference({
          docTypeKey: "APR.DocType.Scene",
          docCategory: "scenes",
          docName: sceneName,
          fieldPath: fgField,
          rawPath: fgSrc,
          updateDescriptor: {
            kind: "sceneRoot",
            sceneId: scene.id,
            fieldPath: fgField
          }
        });
      }

      if (scene.thumb && !scene.thumb.startsWith("data:")) {
        await checkReference({
          docTypeKey: "APR.DocType.Scene",
          docCategory: "scenes",
          docName: sceneName,
          fieldPath: "thumb",
          rawPath: scene.thumb,
          updateDescriptor: {
            kind: "sceneRoot",
            sceneId: scene.id,
            fieldPath: "thumb"
          }
        });
      }

      // Foundry V14 Scene Levels ("Aktuelle Ebene" / `scene.levels`)
      const levelsList = getSceneLevelsList(scene);
      for (let lvlIdx = 0; lvlIdx < levelsList.length; lvlIdx++) {
        const level = levelsList[lvlIdx];
        if (!level) continue;
        const levelId = level.id ?? level._id ?? String(lvlIdx);
        const levelName = level.name || level.label || `Level #${lvlIdx + 1}`;
        const levelLabel = `${sceneName} → ${levelName}`;

        const lvlBgSrc = level.background?.src ?? level._source?.background?.src;
        // If rootBgSrc already matched this exact path, sceneRoot's updater will update both scene and matching levels.
        // If rootBgSrc was empty or different, register a dedicated sceneLevel finding.
        if (lvlBgSrc && normalizePath(lvlBgSrc) !== normalizePath(rootBgSrc ?? "")) {
          await checkReference({
            docTypeKey: "APR.DocType.Scene",
            docCategory: "scenes",
            docName: levelLabel,
            fieldPath: "background.src",
            rawPath: lvlBgSrc,
            updateDescriptor: {
              kind: "sceneLevel",
              sceneId: scene.id,
              levelId,
              levelIndex: lvlIdx,
              fieldPath: "background.src"
            }
          });
        }

        const lvlFgSrc =
          typeof level.foreground === "string"
            ? level.foreground
            : (level.foreground?.src ?? level._source?.foreground?.src);
        const lvlFgField = typeof level.foreground === "string" ? "foreground" : "foreground.src";
        if (lvlFgSrc && normalizePath(lvlFgSrc) !== normalizePath(fgSrc ?? "")) {
          await checkReference({
            docTypeKey: "APR.DocType.Scene",
            docCategory: "scenes",
            docName: levelLabel,
            fieldPath: lvlFgField,
            rawPath: lvlFgSrc,
            updateDescriptor: {
              kind: "sceneLevel",
              sceneId: scene.id,
              levelId,
              levelIndex: lvlIdx,
              fieldPath: lvlFgField
            }
          });
        }
      }

      // Embedded Tiles
      for (const tile of scene.tiles ?? []) {
        if (tile.texture?.src) {
          await checkReference({
            docTypeKey: "APR.DocType.Tile",
            docCategory: "scenes",
            docName: `${sceneName} → Tile (${tile.id})`,
            fieldPath: "texture.src",
            rawPath: tile.texture.src,
            updateDescriptor: {
              kind: "sceneEmbedded",
              sceneId: scene.id,
              embeddedName: "Tile",
              docId: tile.id,
              fieldPath: "texture.src"
            }
          });
        }
      }

      // Embedded Tokens (texture.src + V12/V14 ring.subject.texture)
      for (const token of scene.tokens ?? []) {
        const tokenLabel = `${sceneName} → ${token.name || token.id}`;
        if (token.texture?.src) {
          await checkReference({
            docTypeKey: "APR.DocType.Token",
            docCategory: "tokens",
            docName: tokenLabel,
            fieldPath: "texture.src",
            rawPath: token.texture.src,
            updateDescriptor: {
              kind: "sceneEmbedded",
              sceneId: scene.id,
              embeddedName: "Token",
              docId: token.id,
              fieldPath: "texture.src"
            }
          });
        }
        if (token.ring?.subject?.texture) {
          await checkReference({
            docTypeKey: "APR.DocType.Token",
            docCategory: "tokens",
            docName: tokenLabel,
            fieldPath: "ring.subject.texture",
            rawPath: token.ring.subject.texture,
            updateDescriptor: {
              kind: "sceneEmbedded",
              sceneId: scene.id,
              embeddedName: "Token",
              docId: token.id,
              fieldPath: "ring.subject.texture"
            }
          });
        }
      }

      // Embedded AmbientSounds
      for (const sound of scene.sounds ?? []) {
        if (sound.path) {
          await checkReference({
            docTypeKey: "APR.DocType.AmbientSound",
            docCategory: "scenes",
            docName: `${sceneName} → Sound (${sound.id})`,
            fieldPath: "path",
            rawPath: sound.path,
            updateDescriptor: {
              kind: "sceneEmbedded",
              sceneId: scene.id,
              embeddedName: "AmbientSound",
              docId: sound.id,
              fieldPath: "path"
            }
          });
        }
      }

      // Embedded Map Notes
      for (const note of scene.notes ?? []) {
        if (note.texture?.src) {
          await checkReference({
            docTypeKey: "APR.DocType.Note",
            docCategory: "scenes",
            docName: `${sceneName} → Note (${note.label || note.id})`,
            fieldPath: "texture.src",
            rawPath: note.texture.src,
            updateDescriptor: {
              kind: "sceneEmbedded",
              sceneId: scene.id,
              embeddedName: "Note",
              docId: note.id,
              fieldPath: "texture.src"
            }
          });
        }
      }
    }

    // =========================================================================
    // 2. ACTORS (game.actors)
    // =========================================================================
    for (const actor of game.actors ?? []) {
      const actorName = actor.name || actor.id;

      if (actor.img) {
        await checkReference({
          docTypeKey: "APR.DocType.Actor",
          docCategory: "actors",
          docName: actorName,
          fieldPath: "img",
          rawPath: actor.img,
          updateDescriptor: {
            kind: "worldDoc",
            collectionName: "actors",
            docId: actor.id,
            fieldPath: "img"
          }
        });
      }

      if (actor.prototypeToken?.texture?.src) {
        await checkReference({
          docTypeKey: "APR.DocType.PrototypeToken",
          docCategory: "tokens",
          docName: `${actorName} (Prototype Token)`,
          fieldPath: "prototypeToken.texture.src",
          rawPath: actor.prototypeToken.texture.src,
          updateDescriptor: {
            kind: "worldDoc",
            collectionName: "actors",
            docId: actor.id,
            fieldPath: "prototypeToken.texture.src"
          }
        });
      }

      if (actor.prototypeToken?.ring?.subject?.texture) {
        await checkReference({
          docTypeKey: "APR.DocType.PrototypeToken",
          docCategory: "tokens",
          docName: `${actorName} (Prototype Ring)`,
          fieldPath: "prototypeToken.ring.subject.texture",
          rawPath: actor.prototypeToken.ring.subject.texture,
          updateDescriptor: {
            kind: "worldDoc",
            collectionName: "actors",
            docId: actor.id,
            fieldPath: "prototypeToken.ring.subject.texture"
          }
        });
      }

      // Actor system HTML/media fields (biographies, descriptions, custom media fields)
      const actorSysFields = this.collectSystemStringFields(actor.system, "system");
      for (const sf of actorSysFields) {
        if (sf.isHtml) {
          await checkHtmlField({
            docTypeKey: "APR.DocType.Actor",
            docCategory: "actors",
            docName: actorName,
            fieldPath: sf.fieldPath,
            htmlContent: sf.value,
            updateDescriptor: {
              kind: "worldDocHtml",
              collectionName: "actors",
              docId: actor.id,
              fieldPath: sf.fieldPath
            }
          });
        } else {
          await checkReference({
            docTypeKey: "APR.DocType.Actor",
            docCategory: "actors",
            docName: actorName,
            fieldPath: sf.fieldPath,
            rawPath: sf.value,
            updateDescriptor: {
              kind: "worldDoc",
              collectionName: "actors",
              docId: actor.id,
              fieldPath: sf.fieldPath
            }
          });
        }
      }

      // Embedded ActiveEffects on Actor
      for (const effect of actor.effects ?? []) {
        const effectField = "img" in (effect._source ?? effect) ? "img" : "icon";
        const effectImg = effect.img ?? effect.icon;
        if (effectImg) {
          await checkReference({
            docTypeKey: "APR.DocType.ActorEffect",
            docCategory: "actors",
            docName: `${actorName} → Effect: ${effect.name || effect.label || effect.id}`,
            fieldPath: effectField,
            rawPath: effectImg,
            updateDescriptor: {
              kind: "actorEmbedded",
              actorId: actor.id,
              embeddedName: "ActiveEffect",
              docId: effect.id,
              fieldPath: effectField
            }
          });
        }
      }

      // Embedded Owned Items on Actor
      for (const item of actor.items ?? []) {
        const itemLabel = `${actorName} → Item: ${item.name || item.id}`;
        if (item.img) {
          await checkReference({
            docTypeKey: "APR.DocType.ActorItem",
            docCategory: "items",
            docName: itemLabel,
            fieldPath: "img",
            rawPath: item.img,
            updateDescriptor: {
              kind: "actorEmbedded",
              actorId: actor.id,
              embeddedName: "Item",
              docId: item.id,
              fieldPath: "img"
            }
          });
        }

        // Owned Item HTML descriptions
        const itemSysFields = this.collectSystemStringFields(item.system, "system");
        for (const sf of itemSysFields) {
          if (sf.isHtml) {
            await checkHtmlField({
              docTypeKey: "APR.DocType.ActorItem",
              docCategory: "items",
              docName: itemLabel,
              fieldPath: sf.fieldPath,
              htmlContent: sf.value,
              updateDescriptor: {
                kind: "actorItemHtml",
                actorId: actor.id,
                itemId: item.id,
                fieldPath: sf.fieldPath
              }
            });
          } else {
            await checkReference({
              docTypeKey: "APR.DocType.ActorItem",
              docCategory: "items",
              docName: itemLabel,
              fieldPath: sf.fieldPath,
              rawPath: sf.value,
              updateDescriptor: {
                kind: "actorEmbedded",
                actorId: actor.id,
                embeddedName: "Item",
                docId: item.id,
                fieldPath: sf.fieldPath
              }
            });
          }
        }

        // ActiveEffects on Owned Item
        for (const effect of item.effects ?? []) {
          const effectField = "img" in (effect._source ?? effect) ? "img" : "icon";
          const effectImg = effect.img ?? effect.icon;
          if (effectImg) {
            await checkReference({
              docTypeKey: "APR.DocType.ActorItemEffect",
              docCategory: "items",
              docName: `${itemLabel} → Effect: ${effect.name || effect.label || effect.id}`,
              fieldPath: effectField,
              rawPath: effectImg,
              updateDescriptor: {
                kind: "actorItemEffect",
                actorId: actor.id,
                itemId: item.id,
                docId: effect.id,
                fieldPath: effectField
              }
            });
          }
        }
      }
    }

    // =========================================================================
    // 3. WORLD ITEMS (game.items)
    // =========================================================================
    for (const item of game.items ?? []) {
      const itemName = item.name || item.id;
      if (item.img) {
        await checkReference({
          docTypeKey: "APR.DocType.Item",
          docCategory: "items",
          docName: itemName,
          fieldPath: "img",
          rawPath: item.img,
          updateDescriptor: {
            kind: "worldDoc",
            collectionName: "items",
            docId: item.id,
            fieldPath: "img"
          }
        });
      }

      const itemSysFields = this.collectSystemStringFields(item.system, "system");
      for (const sf of itemSysFields) {
        if (sf.isHtml) {
          await checkHtmlField({
            docTypeKey: "APR.DocType.Item",
            docCategory: "items",
            docName: itemName,
            fieldPath: sf.fieldPath,
            htmlContent: sf.value,
            updateDescriptor: {
              kind: "worldDocHtml",
              collectionName: "items",
              docId: item.id,
              fieldPath: sf.fieldPath
            }
          });
        } else {
          await checkReference({
            docTypeKey: "APR.DocType.Item",
            docCategory: "items",
            docName: itemName,
            fieldPath: sf.fieldPath,
            rawPath: sf.value,
            updateDescriptor: {
              kind: "worldDoc",
              collectionName: "items",
              docId: item.id,
              fieldPath: sf.fieldPath
            }
          });
        }
      }

      for (const effect of item.effects ?? []) {
        const effectField = "img" in (effect._source ?? effect) ? "img" : "icon";
        const effectImg = effect.img ?? effect.icon;
        if (effectImg) {
          await checkReference({
            docTypeKey: "APR.DocType.ItemEffect",
            docCategory: "items",
            docName: `${itemName} → Effect: ${effect.name || effect.label || effect.id}`,
            fieldPath: effectField,
            rawPath: effectImg,
            updateDescriptor: {
              kind: "itemEmbedded",
              itemId: item.id,
              embeddedName: "ActiveEffect",
              docId: effect.id,
              fieldPath: effectField
            }
          });
        }
      }
    }

    // =========================================================================
    // 4. JOURNAL ENTRIES & HANDOUTS (game.journal)
    // =========================================================================
    for (const journal of game.journal ?? []) {
      const journalName = journal.name || journal.id;
      for (const page of journal.pages ?? []) {
        const pageLabel = `${journalName} → ${page.name || page.id}`;
        if (page.src) {
          await checkReference({
            docTypeKey: "APR.DocType.JournalImage",
            docCategory: "journals",
            docName: pageLabel,
            fieldPath: "src",
            rawPath: page.src,
            updateDescriptor: {
              kind: "journalPage",
              journalId: journal.id,
              pageId: page.id,
              fieldPath: "src"
            }
          });
        }

        if (page.text?.content) {
          await checkHtmlField({
            docTypeKey: "APR.DocType.JournalHTML",
            docCategory: "journals",
            docName: pageLabel,
            fieldPath: "text.content",
            htmlContent: page.text.content,
            updateDescriptor: {
              kind: "journalPageHtml",
              journalId: journal.id,
              pageId: page.id,
              fieldPath: "text.content"
            }
          });
        }
      }
    }

    // =========================================================================
    // 5. PLAYLISTS (game.playlists)
    // =========================================================================
    for (const playlist of game.playlists ?? []) {
      const playlistName = playlist.name || playlist.id;
      for (const sound of playlist.sounds ?? []) {
        if (sound.path) {
          await checkReference({
            docTypeKey: "APR.DocType.PlaylistSound",
            docCategory: "playlists",
            docName: `${playlistName} → ${sound.name || sound.id}`,
            fieldPath: "path",
            rawPath: sound.path,
            updateDescriptor: {
              kind: "playlistSound",
              playlistId: playlist.id,
              soundId: sound.id,
              fieldPath: "path"
            }
          });
        }
      }
    }

    // =========================================================================
    // 6. ROLLABLE TABLES (game.tables)
    // =========================================================================
    for (const table of game.tables ?? []) {
      const tableName = table.name || table.id;
      if (table.img) {
        await checkReference({
          docTypeKey: "APR.DocType.RollTable",
          docCategory: "other",
          docName: tableName,
          fieldPath: "img",
          rawPath: table.img,
          updateDescriptor: {
            kind: "worldDoc",
            collectionName: "tables",
            docId: table.id,
            fieldPath: "img"
          }
        });
      }

      for (const result of table.results ?? []) {
        const resField = "img" in (result._source ?? result) ? "img" : "icon";
        const resImg = result.img ?? result.icon;
        if (resImg) {
          await checkReference({
            docTypeKey: "APR.DocType.TableResult",
            docCategory: "other",
            docName: `${tableName} → Result (${result.id})`,
            fieldPath: resField,
            rawPath: resImg,
            updateDescriptor: {
              kind: "tableResult",
              tableId: table.id,
              resultId: result.id,
              fieldPath: resField
            }
          });
        }
      }
    }

    // =========================================================================
    // 7. CARDS (game.cards)
    // =========================================================================
    for (const stack of game.cards ?? []) {
      const stackName = stack.name || stack.id;
      if (stack.img) {
        await checkReference({
          docTypeKey: "APR.DocType.Cards",
          docCategory: "other",
          docName: stackName,
          fieldPath: "img",
          rawPath: stack.img,
          updateDescriptor: {
            kind: "worldDoc",
            collectionName: "cards",
            docId: stack.id,
            fieldPath: "img"
          }
        });
      }
      if (stack.back?.img) {
        await checkReference({
          docTypeKey: "APR.DocType.Cards",
          docCategory: "other",
          docName: stackName,
          fieldPath: "back.img",
          rawPath: stack.back.img,
          updateDescriptor: {
            kind: "worldDoc",
            collectionName: "cards",
            docId: stack.id,
            fieldPath: "back.img"
          }
        });
      }

      for (const card of stack.cards ?? []) {
        const cardLabel = `${stackName} → ${card.name || card.id}`;
        if (card.back?.img) {
          await checkReference({
            docTypeKey: "APR.DocType.Card",
            docCategory: "other",
            docName: cardLabel,
            fieldPath: "back.img",
            rawPath: card.back.img,
            updateDescriptor: {
              kind: "cardEmbedded",
              stackId: stack.id,
              cardId: card.id,
              fieldPath: "back.img"
            }
          });
        }

        const faces = Array.isArray(card.faces) ? card.faces : [];
        for (let idx = 0; idx < faces.length; idx++) {
          const face = faces[idx];
          if (face?.img) {
            await checkReference({
              docTypeKey: "APR.DocType.Card",
              docCategory: "other",
              docName: `${cardLabel} (Face #${idx + 1})`,
              fieldPath: `faces[${idx}].img`,
              rawPath: face.img,
              updateDescriptor: {
                kind: "cardFace",
                stackId: stack.id,
                cardId: card.id,
                faceIndex: idx,
                fieldPath: `faces[${idx}].img`
              }
            });
          }
        }
      }
    }

    // =========================================================================
    // 8. MACROS (game.macros)
    // =========================================================================
    for (const macro of game.macros ?? []) {
      if (macro.img) {
        await checkReference({
          docTypeKey: "APR.DocType.Macro",
          docCategory: "other",
          docName: macro.name || macro.id,
          fieldPath: "img",
          rawPath: macro.img,
          updateDescriptor: {
            kind: "worldDoc",
            collectionName: "macros",
            docId: macro.id,
            fieldPath: "img"
          }
        });
      }
    }

    return findings;
  }

  /**
   * Helper to update a specific level inside `scene.levels` (supports both V14 EmbeddedCollection Level documents
   * and array-based `_source.levels` schemas) and verify the update.
   * @param {any} scene
   * @param {string} levelId
   * @param {number} levelIndex
   * @param {string} fieldPath
   * @param {string} encodedPath
   * @returns {Promise<boolean>}
   */
  async _updateSceneLevel(scene, levelId, levelIndex, fieldPath, encodedPath) {
    const levelsList = getSceneLevelsList(scene);
    const level =
      scene.levels?.get?.(levelId) ??
      levelsList.find((l) => (l?.id ?? l?._id) === levelId) ??
      levelsList[levelIndex];

    const checkLevelChanged = () => {
      const refreshedList = getSceneLevelsList(scene);
      const currentLvl =
        scene.levels?.get?.(levelId) ??
        refreshedList.find((l) => (l?.id ?? l?._id) === levelId) ??
        refreshedList[levelIndex];
      if (!currentLvl) return false;
      const valLive = foundry.utils.getProperty(currentLvl, fieldPath);
      const valSrc = currentLvl._source ? foundry.utils.getProperty(currentLvl._source, fieldPath) : undefined;
      return (
        normalizePath(valLive ?? "") === normalizePath(encodedPath) ||
        normalizePath(valSrc ?? "") === normalizePath(encodedPath)
      );
    };

    const expanded = foundry.utils.expandObject({ [fieldPath]: encodedPath });

    // 1. Try direct Document#update on the Level document
    if (level && typeof level.update === "function") {
      try {
        await level.update(expanded);
        if (checkLevelChanged()) return true;
      } catch (_err) {
        // Fall through to embedded update
      }
    }

    // 2. Try scene.updateEmbeddedDocuments("Level" / level.documentName)
    if (level && typeof scene.updateEmbeddedDocuments === "function") {
      const docName = level.documentName || "Level";
      try {
        await scene.updateEmbeddedDocuments(docName, [
          { _id: level.id ?? level._id ?? levelId, ...expanded }
        ]);
        if (checkLevelChanged()) return true;
      } catch (_err) {
        // Fall through to array update
      }
    }

    // 3. Fallback: if `scene._source.levels` is an array on Scene DataModel
    if (Array.isArray(scene._source?.levels)) {
      try {
        const clonedLevels = foundry.utils.deepClone(scene._source.levels);
        const targetIdx = clonedLevels.findIndex((l, idx) => (l?._id ?? l?.id ?? String(idx)) === levelId);
        const idxToUse = targetIdx !== -1 ? targetIdx : levelIndex;
        if (clonedLevels[idxToUse]) {
          foundry.utils.setProperty(clonedLevels[idxToUse], fieldPath, encodedPath);
          await scene.update({ levels: clonedLevels });
          if (checkLevelChanged()) return true;
        }
      } catch (_err) {
        // Ignore
      }
    }

    return checkLevelChanged();
  }

  /**
   * Update a Scene root field (`background.src`, `foreground.src`, `thumb`), synchronize any matching V14 `scene.levels`
   * entries, verify persistence in `_source`, regenerate the scene thumbnail, and refresh open `SceneConfig` sheets.
   * @param {any} scene
   * @param {string} fieldPath
   * @param {string} oldPath
   * @param {string} encodedPath
   */
  async _updateSceneRootAndLevels(scene, fieldPath, oldPath, encodedPath) {
    const cleanOld = normalizePath(oldPath);
    const cleanNew = normalizePath(encodedPath);

    // 1. Also update any V14 `scene.levels` whose fieldPath matches `oldPath`
    let levelUpdated = false;
    const levelsList = getSceneLevelsList(scene);
    for (let idx = 0; idx < levelsList.length; idx++) {
      const lvl = levelsList[idx];
      if (!lvl) continue;
      const lvlVal =
        foundry.utils.getProperty(lvl, fieldPath) ??
        (lvl._source ? foundry.utils.getProperty(lvl._source, fieldPath) : undefined);
      if (lvlVal && normalizePath(lvlVal) === cleanOld) {
        const lvlId = lvl.id ?? lvl._id ?? String(idx);
        const ok = await this._updateSceneLevel(scene, lvlId, idx, fieldPath, encodedPath);
        if (ok) levelUpdated = true;
      }
    }

    // 2. Update the Scene root using nested object payload `{ background: { src: encodedPath } }`
    const expandedPayload = foundry.utils.expandObject({ [fieldPath]: encodedPath });
    await scene.update(expandedPayload);

    const readSceneField = () => {
      const liveVal = foundry.utils.getProperty(scene, fieldPath);
      const srcVal = scene._source ? foundry.utils.getProperty(scene._source, fieldPath) : undefined;
      return { liveVal, srcVal };
    };

    let { liveVal, srcVal } = readSceneField();
    let verified =
      normalizePath(liveVal ?? "") === cleanNew ||
      normalizePath(srcVal ?? "") === cleanNew ||
      levelUpdated;

    // 3. Fallback retry if `scene._source` still holds `oldPath`
    if (!verified) {
      if (fieldPath === "background.src") {
        const bgClone = foundry.utils.deepClone(scene._source?.background ?? scene.background ?? {});
        bgClone.src = encodedPath;
        await scene.update({ background: bgClone });
      } else {
        await scene.update({ [fieldPath]: encodedPath });
      }
      ({ liveVal, srcVal } = readSceneField());
      verified =
        normalizePath(liveVal ?? "") === cleanNew ||
        normalizePath(srcVal ?? "") === cleanNew ||
        levelUpdated;
    }

    if (!verified) {
      throw new Error(
        `Post-update verification failed for Scene "${scene.name}" (${fieldPath}): value remained "${srcVal ?? liveVal}" instead of "${encodedPath}"`
      );
    }

    // 4. Regenerate thumbnail when background is updated so the sidebar navigation preview updates too
    if (fieldPath === "background.src" && typeof scene.createThumbnail === "function") {
      try {
        const thumbData = await scene.createThumbnail({ img: encodedPath });
        if (thumbData?.thumb) {
          await scene.update({ thumb: thumbData.thumb });
        }
      } catch (thumbErr) {
        console.warn(`${MODULE_ID} | Thumbnail regeneration skipped for "${scene.name}":`, thumbErr);
      }
    }

    // 5. Re-render SceneConfig window if currently open on screen
    if (scene.sheet?.rendered) {
      try {
        scene.sheet.render(true);
      } catch (_sheetErr) {
        // Ignore
      }
    }
  }

  /**
   * Apply all confirmed path updates (including user-selected collision resolutions).
   * Resiliently wraps each update in try/catch and performs post-write verification.
   * @param {object} findings - The findings object from `scanWorldDocuments`
   * @returns {Promise<object>} Final execution summary report
   */
  async applyUpdates(findings) {
    const actionable = [];

    for (const item of findings.ready ?? []) {
      if (item.included !== false && item.newPath) {
        actionable.push({
          ...item,
          targetPath: encodeFoundryPath(item.newPath)
        });
      }
    }

    for (const col of findings.collisions ?? []) {
      if (col.selectedPath && col.selectedPath !== "skip") {
        actionable.push({
          ...col,
          targetPath: encodeFoundryPath(col.selectedPath)
        });
      }
    }

    const summary = {
      totalUpdated: 0,
      scenes: 0,
      actors: 0,
      tokens: 0,
      items: 0,
      journals: 0,
      playlists: 0,
      other: 0,
      errors: 0,
      activeSceneModified: false,
      records: []
    };

    let modifiedActiveScene = null;

    const recordResult = (entry, success, errorMsg = "") => {
      if (success) {
        summary.totalUpdated++;
        if (typeof summary[entry.docCategory] === "number") {
          summary[entry.docCategory]++;
        } else {
          summary.other++;
        }
      } else {
        summary.errors++;
      }
      summary.records.push({
        docTypeKey: entry.docTypeKey,
        docName: entry.docName,
        fieldPath: entry.fieldPath,
        oldPath: entry.oldPath,
        newPath: entry.targetPath,
        success,
        errorMsg
      });
    };

    // Group HTML replacements per target document + fieldPath
    const htmlGroups = new Map();
    // Group Card face array updates per stackId + cardId
    const cardFaceGroups = new Map();
    // Standard single-field updates
    const directEntries = [];

    for (const entry of actionable) {
      const desc = entry.updateDescriptor;
      if (
        desc.kind === "journalPageHtml" ||
        desc.kind === "worldDocHtml" ||
        desc.kind === "actorItemHtml"
      ) {
        const key = JSON.stringify(desc);
        if (!htmlGroups.has(key)) {
          htmlGroups.set(key, { desc, entries: [] });
        }
        htmlGroups.get(key).entries.push(entry);
      } else if (desc.kind === "cardFace") {
        const key = `${desc.stackId}::${desc.cardId}`;
        if (!cardFaceGroups.has(key)) {
          cardFaceGroups.set(key, {
            stackId: desc.stackId,
            cardId: desc.cardId,
            entries: []
          });
        }
        cardFaceGroups.get(key).entries.push(entry);
      } else {
        directEntries.push(entry);
      }
    }

    // 1. Process direct single-field updates
    for (const entry of directEntries) {
      const desc = entry.updateDescriptor;
      const encodedPath = entry.targetPath;
      try {
        if (desc.kind === "sceneRoot") {
          const scene = game.scenes?.get(desc.sceneId);
          if (!scene) throw new Error(`Scene ${desc.sceneId} not found`);
          await this._updateSceneRootAndLevels(scene, desc.fieldPath, entry.oldPath, encodedPath);
          if (scene.id === canvas?.scene?.id) {
            summary.activeSceneModified = true;
            modifiedActiveScene = scene;
          }
          recordResult(entry, true);
        } else if (desc.kind === "sceneLevel") {
          const scene = game.scenes?.get(desc.sceneId);
          if (!scene) throw new Error(`Scene ${desc.sceneId} not found`);
          const ok = await this._updateSceneLevel(
            scene,
            desc.levelId,
            desc.levelIndex,
            desc.fieldPath,
            encodedPath
          );
          if (!ok) {
            throw new Error(
              `Post-update verification failed for Scene Level "${entry.docName}" (${desc.fieldPath})`
            );
          }
          if (desc.fieldPath === "background.src" && typeof scene.createThumbnail === "function") {
            try {
              const thumbData = await scene.createThumbnail({ img: encodedPath });
              if (thumbData?.thumb) await scene.update({ thumb: thumbData.thumb });
            } catch (_e) {
              // Ignore thumbnail errors
            }
          }
          if (scene.sheet?.rendered) {
            try {
              scene.sheet.render(true);
            } catch (_e) {
              // Ignore
            }
          }
          if (scene.id === canvas?.scene?.id) {
            summary.activeSceneModified = true;
            modifiedActiveScene = scene;
          }
          recordResult(entry, true);
        } else if (desc.kind === "sceneEmbedded") {
          const scene = game.scenes?.get(desc.sceneId);
          if (!scene) throw new Error(`Scene ${desc.sceneId} not found`);
          await scene.updateEmbeddedDocuments(desc.embeddedName, [
            { _id: desc.docId, ...foundry.utils.expandObject({ [desc.fieldPath]: encodedPath }) }
          ]);
          if (scene.id === canvas?.scene?.id) {
            summary.activeSceneModified = true;
            modifiedActiveScene = scene;
          }
          recordResult(entry, true);
        } else if (desc.kind === "worldDoc") {
          const collection = game[desc.collectionName];
          const doc = collection?.get(desc.docId);
          if (!doc) throw new Error(`${desc.collectionName} document ${desc.docId} not found`);
          const expandedPayload = foundry.utils.expandObject({ [desc.fieldPath]: encodedPath });
          await doc.update(expandedPayload);

          // Verify persistence on worldDoc
          const afterLive = foundry.utils.getProperty(doc, desc.fieldPath);
          const afterSrc = doc._source ? foundry.utils.getProperty(doc._source, desc.fieldPath) : undefined;
          if (
            afterLive !== undefined &&
            normalizePath(afterLive ?? "") !== normalizePath(encodedPath) &&
            normalizePath(afterSrc ?? "") !== normalizePath(encodedPath)
          ) {
            await doc.update({ [desc.fieldPath]: encodedPath });
          }
          if (doc.sheet?.rendered) {
            try {
              doc.sheet.render(true);
            } catch (_e) {
              // Ignore
            }
          }
          recordResult(entry, true);
        } else if (desc.kind === "actorEmbedded") {
          const actor = game.actors?.get(desc.actorId);
          if (!actor) throw new Error(`Actor ${desc.actorId} not found`);
          await actor.updateEmbeddedDocuments(desc.embeddedName, [
            { _id: desc.docId, [desc.fieldPath]: encodedPath }
          ]);
          recordResult(entry, true);
        } else if (desc.kind === "actorItemEffect") {
          const actor = game.actors?.get(desc.actorId);
          const item = actor?.items?.get(desc.itemId);
          if (!item) throw new Error(`Owned Item ${desc.itemId} on Actor ${desc.actorId} not found`);
          await item.updateEmbeddedDocuments("ActiveEffect", [
            { _id: desc.docId, [desc.fieldPath]: encodedPath }
          ]);
          recordResult(entry, true);
        } else if (desc.kind === "itemEmbedded") {
          const item = game.items?.get(desc.itemId);
          if (!item) throw new Error(`World Item ${desc.itemId} not found`);
          await item.updateEmbeddedDocuments(desc.embeddedName, [
            { _id: desc.docId, [desc.fieldPath]: encodedPath }
          ]);
          recordResult(entry, true);
        } else if (desc.kind === "journalPage") {
          const journal = game.journal?.get(desc.journalId);
          if (!journal) throw new Error(`JournalEntry ${desc.journalId} not found`);
          await journal.updateEmbeddedDocuments("JournalEntryPage", [
            { _id: desc.pageId, [desc.fieldPath]: encodedPath }
          ]);
          recordResult(entry, true);
        } else if (desc.kind === "playlistSound") {
          const playlist = game.playlists?.get(desc.playlistId);
          if (!playlist) throw new Error(`Playlist ${desc.playlistId} not found`);
          await playlist.updateEmbeddedDocuments("PlaylistSound", [
            { _id: desc.soundId, [desc.fieldPath]: encodedPath }
          ]);
          recordResult(entry, true);
        } else if (desc.kind === "tableResult") {
          const table = game.tables?.get(desc.tableId);
          if (!table) throw new Error(`RollTable ${desc.tableId} not found`);
          await table.updateEmbeddedDocuments("TableResult", [
            { _id: desc.resultId, [desc.fieldPath]: encodedPath }
          ]);
          recordResult(entry, true);
        } else if (desc.kind === "cardEmbedded") {
          const stack = game.cards?.get(desc.stackId);
          if (!stack) throw new Error(`Cards stack ${desc.stackId} not found`);
          await stack.updateEmbeddedDocuments("Card", [
            { _id: desc.cardId, [desc.fieldPath]: encodedPath }
          ]);
          recordResult(entry, true);
        }
      } catch (err) {
        console.error(`${MODULE_ID} | Failed to update ${entry.docName} (${entry.fieldPath}):`, err);
        recordResult(entry, false, err?.message ?? String(err));
      }
    }

    // 2. Process grouped HTML updates
    for (const { desc, entries } of htmlGroups.values()) {
      try {
        if (desc.kind === "journalPageHtml") {
          const journal = game.journal?.get(desc.journalId);
          const page = journal?.pages?.get(desc.pageId);
          if (!journal || !page) throw new Error(`Journal page ${desc.pageId} not found`);
          let content = page.text?.content ?? "";
          for (const e of entries) {
            content = content.replaceAll(e.oldPath, e.targetPath);
          }
          await journal.updateEmbeddedDocuments("JournalEntryPage", [
            { _id: desc.pageId, "text.content": content }
          ]);
          for (const e of entries) recordResult(e, true);
        } else if (desc.kind === "worldDocHtml") {
          const doc = game[desc.collectionName]?.get(desc.docId);
          if (!doc) throw new Error(`${desc.collectionName} ${desc.docId} not found`);
          let content = foundry.utils.getProperty(doc, desc.fieldPath) ?? "";
          for (const e of entries) {
            content = content.replaceAll(e.oldPath, e.targetPath);
          }
          await doc.update({ [desc.fieldPath]: content });
          for (const e of entries) recordResult(e, true);
        } else if (desc.kind === "actorItemHtml") {
          const actor = game.actors?.get(desc.actorId);
          const item = actor?.items?.get(desc.itemId);
          if (!actor || !item) throw new Error(`Owned Item ${desc.itemId} not found`);
          let content = foundry.utils.getProperty(item, desc.fieldPath) ?? "";
          for (const e of entries) {
            content = content.replaceAll(e.oldPath, e.targetPath);
          }
          await actor.updateEmbeddedDocuments("Item", [
            { _id: desc.itemId, [desc.fieldPath]: content }
          ]);
          for (const e of entries) recordResult(e, true);
        }
      } catch (err) {
        console.error(`${MODULE_ID} | Failed HTML update for ${desc.fieldPath}:`, err);
        for (const e of entries) recordResult(e, false, err?.message ?? String(err));
      }
    }

    // 3. Process grouped Card face updates
    for (const { stackId, cardId, entries } of cardFaceGroups.values()) {
      try {
        const stack = game.cards?.get(stackId);
        const card = stack?.cards?.get(cardId);
        if (!stack || !card) throw new Error(`Card ${cardId} in stack ${stackId} not found`);
        const rawFaces = card.toObject().faces ?? [];
        for (const e of entries) {
          const idx = e.updateDescriptor.faceIndex;
          if (rawFaces[idx]) {
            rawFaces[idx].img = e.targetPath;
          }
        }
        await stack.updateEmbeddedDocuments("Card", [
          { _id: cardId, faces: rawFaces }
        ]);
        for (const e of entries) recordResult(e, true);
      } catch (err) {
        console.error(`${MODULE_ID} | Failed Card face update for ${cardId}:`, err);
        for (const e of entries) recordResult(e, false, err?.message ?? String(err));
      }
    }

    // 4. Redraw active canvas if the active scene or its embedded documents were modified
    if (summary.activeSceneModified && canvas?.ready) {
      try {
        await canvas.draw(modifiedActiveScene ?? canvas.scene);
      } catch (err) {
        console.warn(`${MODULE_ID} | canvas.draw() warning:`, err);
      }
    }

    return summary;
  }
}
