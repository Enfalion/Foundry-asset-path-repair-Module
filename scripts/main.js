/**
 * Asset Path Auto-Repair — Main Module Entry Point & Interactive Multi-Step UI
 * Built for Foundry VTT V14 (ApplicationV2) with seamless fallback for V11–V13.
 */

import {
  MODULE_ID,
  TRANSLATIONS,
  translate,
  normalizePath,
  encodeFoundryPath,
  isWildcardPath,
  wildcardToRegExp,
  AssetPathRepairEngine
} from "./repair.js";

export {
  MODULE_ID,
  normalizePath,
  encodeFoundryPath,
  isWildcardPath,
  wildcardToRegExp,
  AssetPathRepairEngine
};

const TEMPLATE_PATH = `modules/${MODULE_ID}/templates/repair-app.hbs`;

/**
 * Shared controller logic for the 4-Step Asset Path Auto-Repair UI.
 * Used by both the Foundry V12–V14 ApplicationV2 class and V11 Application fallback.
 */
class RepairUIStateController {
  /**
   * @param {any} appInstance
   */
  constructor(appInstance) {
    this.app = appInstance;
    this.engine = new AssetPathRepairEngine();
    this.lang = this._detectInitialLanguage();
    this.step = 1; // 1 = Select Folders, 2 = Preview & Resolve + Confirm, 4 = Summary
    this.isBusy = false;
    this.busyKey = "APR.ScanningProgress";

    // Step 1 state
    this.dirsLoaded = false;
    this.dirs = [];
    this.rootFileCount = 0;
    this.includeRootFiles = true;
    this.subpathFilter = "";

    // Step 2/3 state
    this.activeTab = "ready"; // "ready" | "collisions" | "missing"
    this.searchQuery = "";
    this.findings = {
      indexedCount: 0,
      intactCount: 0,
      ready: [],
      collisions: [],
      missing: []
    };

    // Step 4 state
    this.summary = null;
  }

  _detectInitialLanguage() {
    try {
      const saved = game?.settings?.get(MODULE_ID, "uiLanguage");
      if (saved === "de" || saved === "en") return saved;
    } catch (_err) {
      // Setting not yet registered
    }
    return game?.i18n?.lang === "de" ? "de" : "en";
  }

  /**
   * Localize a key in the currently selected UI language ("de" or "en").
   * @param {string} key
   * @param {Record<string, string|number>} [params]
   */
  t(key, params = {}) {
    return translate(this.lang, key, params);
  }

  /**
   * Build the complete localized dictionary object for `templates/repair-app.hbs`.
   */
  _buildI18nBundle() {
    const dict = TRANSLATIONS[this.lang] ?? TRANSLATIONS.en;
    const bundle = {};
    for (const [fullKey, val] of Object.entries(dict)) {
      if (fullKey.startsWith("APR.") && !fullKey.startsWith("APR.DocType.")) {
        const shortKey = fullKey.slice(4);
        bundle[shortKey] = val;
      }
    }
    return bundle;
  }

  async ensureDirsLoaded(force = false) {
    if (this.dirsLoaded && !force) return;
    try {
      const result = await AssetPathRepairEngine.listRootDirectories();
      this.dirs = result.dirs;
      this.rootFileCount = result.rootFileCount;
      this.dirsLoaded = true;
    } catch (err) {
      console.error(`${MODULE_ID} | Failed to browse Data root directory:`, err);
      this.dirs = [];
      this.rootFileCount = 0;
      this.dirsLoaded = true;
    }
  }

  /**
   * Build the template rendering context for `repair-app.hbs`.
   */
  async buildContext() {
    if (this.step === 1 && !this.dirsLoaded) {
      await this.ensureDirsLoaded();
    }

    const i18n = this._buildI18nBundle();
    const selectedProtected = this.dirs.filter((d) => d.isProtected && d.checked).map((d) => d.name);

    const query = this.searchQuery.trim().toLowerCase();
    const matchesSearch = (item) => {
      if (!query) return true;
      const docTypeLabel = this.t(item.docTypeKey).toLowerCase();
      return (
        docTypeLabel.includes(query) ||
        (item.docName ?? "").toLowerCase().includes(query) ||
        (item.fieldPath ?? "").toLowerCase().includes(query) ||
        (item.oldPath ?? "").toLowerCase().includes(query) ||
        (item.newPath ?? "").toLowerCase().includes(query) ||
        (item.fileName ?? "").toLowerCase().includes(query)
      );
    };

    const readyRows = (this.findings.ready ?? [])
      .filter(matchesSearch)
      .map((r) => ({
        ...r,
        docTypeLabel: this.t(r.docTypeKey)
      }));

    const collisionRows = (this.findings.collisions ?? [])
      .filter(matchesSearch)
      .map((c) => ({
        ...c,
        docTypeLabel: this.t(c.docTypeKey),
        isResolved: Boolean(c.selectedPath && c.selectedPath !== "skip"),
        candidateOptions: (c.candidates ?? []).map((p) => ({
          path: p,
          selected: c.selectedPath === p
        }))
      }));

    const missingRows = (this.findings.missing ?? [])
      .filter(matchesSearch)
      .map((m) => ({
        ...m,
        docTypeLabel: this.t(m.docTypeKey)
      }));

    const includedReadyCount = (this.findings.ready ?? []).filter((r) => r.included !== false).length;
    const resolvedCollisionCount = (this.findings.collisions ?? []).filter(
      (c) => c.selectedPath && c.selectedPath !== "skip"
    ).length;
    const selectedUpdateCount = includedReadyCount + resolvedCollisionCount;
    const allReadyIncluded =
      (this.findings.ready ?? []).length > 0 &&
      (this.findings.ready ?? []).every((r) => r.included !== false);

    const summaryRows = (this.summary?.records ?? []).map((rec) => ({
      ...rec,
      docTypeLabel: this.t(rec.docTypeKey)
    }));

    return {
      lang: this.lang,
      isLangDE: this.lang === "de",
      isLangEN: this.lang === "en",
      i18n,
      isBusy: this.isBusy,
      busyMessage: this.t(this.busyKey),
      isStep1: this.step === 1,
      isStep2: this.step === 2,
      isStep4: this.step === 4,
      step1Done: this.step > 1,
      step2Done: this.step > 2,
      step3Done: this.step === 4,
      dirs: this.dirs,
      rootFileCount: this.rootFileCount,
      includeRootFiles: this.includeRootFiles,
      subpathFilter: this.subpathFilter,
      hasProtectedSelected: selectedProtected.length > 0,
      selectedProtectedList: selectedProtected.join(", "),
      stats: {
        indexedCount: this.findings.indexedCount ?? 0,
        intactCount: this.findings.intactCount ?? 0,
        readyCount: (this.findings.ready ?? []).length,
        collisionCount: (this.findings.collisions ?? []).length,
        missingCount: (this.findings.missing ?? []).length
      },
      isTabReady: this.activeTab === "ready",
      isTabCollisions: this.activeTab === "collisions",
      isTabMissing: this.activeTab === "missing",
      searchQuery: this.searchQuery,
      readyRows,
      collisionRows,
      missingRows,
      allReadyIncluded,
      selectedUpdateCount,
      canApplyUpdates: !this.isBusy && selectedUpdateCount > 0,
      summary: this.summary,
      summaryRows
    };
  }

  /**
   * Attach DOM event listeners to the rendered element.
   * @param {HTMLElement} root
   */
  bindEvents(root) {
    if (!root) return;

    // 1. Language Switcher (DE / EN)
    for (const btn of root.querySelectorAll('[data-action="switch-lang"]')) {
      btn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        const targetLang = btn.dataset.lang;
        if (targetLang === "de" || targetLang === "en") {
          this.lang = targetLang;
          try {
            await game.settings.set(MODULE_ID, "uiLanguage", targetLang);
          } catch (_err) {
            // Ignore if setting not registered
          }
          this.app.render();
        }
      });
    }

    // 2. Step 1 Folder Selection Controls
    const rootCheckbox = root.querySelector('[data-action="toggle-root-files"]');
    if (rootCheckbox) {
      rootCheckbox.addEventListener("change", (ev) => {
        this.includeRootFiles = Boolean(ev.currentTarget.checked);
        this.app.render();
      });
    }

    for (const cb of root.querySelectorAll(".apr-dir-checkbox")) {
      cb.addEventListener("change", (ev) => {
        const dirPath = ev.currentTarget.dataset.dirPath;
        const entry = this.dirs.find((d) => d.path === dirPath);
        if (entry) {
          entry.checked = Boolean(ev.currentTarget.checked);
          this.app.render();
        }
      });
    }

    const subpathInput = root.querySelector('[data-action="subpath-input"]');
    if (subpathInput) {
      subpathInput.addEventListener("input", (ev) => {
        this.subpathFilter = ev.currentTarget.value;
      });
    }

    const bindClick = (action, handler) => {
      for (const el of root.querySelectorAll(`[data-action="${action}"]`)) {
        el.addEventListener("click", handler);
      }
    };

    bindClick("select-safe", (ev) => {
      ev.preventDefault();
      this.includeRootFiles = true;
      for (const d of this.dirs) d.checked = !d.isProtected;
      this.app.render();
    });

    bindClick("select-all", (ev) => {
      ev.preventDefault();
      this.includeRootFiles = true;
      for (const d of this.dirs) d.checked = true;
      this.app.render();
    });

    bindClick("deselect-all", (ev) => {
      ev.preventDefault();
      this.includeRootFiles = false;
      for (const d of this.dirs) d.checked = false;
      this.app.render();
    });

    bindClick("refresh-dirs", async (ev) => {
      ev.preventDefault();
      await this.ensureDirsLoaded(true);
      this.app.render();
    });

    // 3. Start Scan (Step 1 -> Step 2)
    bindClick("start-scan", async (ev) => {
      ev.preventDefault();
      await this.executeScan();
    });

    // 4. Step 2 Tabs & Filtering
    for (const tabBtn of root.querySelectorAll('[data-action="switch-tab"]')) {
      tabBtn.addEventListener("click", (ev) => {
        ev.preventDefault();
        this.activeTab = tabBtn.dataset.tab || "ready";
        this.app.render();
      });
    }

    const filterInput = root.querySelector('[data-action="filter-input"]');
    if (filterInput) {
      filterInput.addEventListener("input", (ev) => {
        const cursorPos = ev.currentTarget.selectionStart ?? ev.currentTarget.value.length;
        this.searchQuery = ev.currentTarget.value;
        this.app.render();
        requestAnimationFrame(() => {
          const newInput = this.app.element?.querySelector?.('[data-action="filter-input"]')
            ?? this.app.element?.[0]?.querySelector?.('[data-action="filter-input"]');
          if (newInput) {
            newInput.focus();
            try {
              newInput.setSelectionRange(cursorPos, cursorPos);
            } catch (_e) {
              // Ignore
            }
          }
        });
      });
    }

    // Toggle all Ready rows
    const toggleAllReady = root.querySelector('[data-action="toggle-all-ready"]');
    if (toggleAllReady) {
      toggleAllReady.addEventListener("change", (ev) => {
        const checked = Boolean(ev.currentTarget.checked);
        for (const r of this.findings.ready ?? []) {
          r.included = checked;
        }
        this.app.render();
      });
    }

    // Individual Ready checkboxes
    for (const cb of root.querySelectorAll(".apr-ready-checkbox")) {
      cb.addEventListener("change", (ev) => {
        const id = ev.currentTarget.dataset.findingId;
        const target = (this.findings.ready ?? []).find((r) => r.id === id);
        if (target) {
          target.included = Boolean(ev.currentTarget.checked);
          this.app.render();
        }
      });
    }

    // Collision resolution dropdowns
    for (const sel of root.querySelectorAll(".apr-collision-select")) {
      sel.addEventListener("change", (ev) => {
        const id = ev.currentTarget.dataset.collisionId;
        const target = (this.findings.collisions ?? []).find((c) => c.id === id);
        if (target) {
          target.selectedPath = ev.currentTarget.value;
          this.app.render();
        }
      });
    }

    // Navigation & Execution buttons
    bindClick("back-step1", (ev) => {
      ev.preventDefault();
      this.step = 1;
      this.searchQuery = "";
      this.app.render();
    });

    bindClick("apply-updates", async (ev) => {
      ev.preventDefault();
      await this.executeUpdates();
    });

    bindClick("export-json", (ev) => {
      ev.preventDefault();
      this.exportJsonReport();
    });

    bindClick("close-app", (ev) => {
      ev.preventDefault();
      this.app.close();
    });
  }

  /**
   * Run Step 2 Deep Scan & Analysis (Dry-Run Preview).
   */
  async executeScan() {
    if (this.isBusy) return;
    const selectedDirs = this.dirs.filter((d) => d.checked).map((d) => d.path);
    const hasSubpath = this.subpathFilter.trim().length > 0;

    if (!hasSubpath && selectedDirs.length === 0 && !this.includeRootFiles) {
      ui.notifications?.warn(this.t("APR.NotifyNoFoldersSelected"));
      return;
    }

    this.isBusy = true;
    this.busyKey = "APR.ScanningProgress";
    this.app.render();

    try {
      await this.engine.buildFileIndex({
        selectedDirs,
        includeRootFiles: this.includeRootFiles,
        subpathFilter: this.subpathFilter
      });

      this.findings = await this.engine.scanWorldDocuments();

      // Automatically switch to the most relevant tab
      if (this.findings.ready.length > 0) {
        this.activeTab = "ready";
      } else if (this.findings.collisions.length > 0) {
        this.activeTab = "collisions";
      } else {
        this.activeTab = "missing";
      }

      this.step = 2;

      if (this.findings.collisions.length > 0) {
        ui.notifications?.warn(
          this.t("APR.NotifyCollisionsDetected", { count: this.findings.collisions.length }),
          { permanent: true }
        );
      } else {
        ui.notifications?.info(
          this.t("APR.NotifyScanComplete", {
            ready: this.findings.ready.length,
            collisions: this.findings.collisions.length,
            missing: this.findings.missing.length
          })
        );
      }
    } catch (err) {
      console.error(`${MODULE_ID} | Error during scan:`, err);
      ui.notifications?.error(`${this.t("APR.Title")}: ${err.message || err}`);
    } finally {
      this.isBusy = false;
      this.app.render();
    }
  }

  /**
   * Run Step 3 Confirmation & Database Updates -> Transition to Step 4 Final Summary.
   */
  async executeUpdates() {
    if (this.isBusy) return;

    this.isBusy = true;
    this.busyKey = "APR.ApplyingUpdates";
    this.app.render();

    try {
      this.summary = await this.engine.applyUpdates(this.findings);
      this.step = 4;
      ui.notifications?.info(
        this.t("APR.NotifyUpdateComplete", {
          updated: this.summary.totalUpdated,
          errors: this.summary.errors
        })
      );
    } catch (err) {
      console.error(`${MODULE_ID} | Error applying updates:`, err);
      ui.notifications?.error(`${this.t("APR.Title")}: ${err.message || err}`);
    } finally {
      this.isBusy = false;
      this.app.render();
    }
  }

  /**
   * Download the scan & update audit report as a JSON file.
   */
  exportJsonReport() {
    const payload = {
      module: MODULE_ID,
      timestamp: new Date().toISOString(),
      world: game.world?.id ?? "unknown",
      summary: this.summary,
      unresolvedCollisions: (this.findings.collisions ?? []).filter(
        (c) => !c.selectedPath || c.selectedPath === "skip"
      ),
      missingFiles: this.findings.missing ?? []
    };
    const jsonString = JSON.stringify(payload, null, 2);
    const fileName = `asset-path-repair-report-${Date.now()}.json`;
    if (typeof saveDataToFile === "function") {
      saveDataToFile(jsonString, "application/json", fileName);
    } else if (foundry?.utils?.saveDataToFile) {
      foundry.utils.saveDataToFile(jsonString, "application/json", fileName);
    } else {
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}

/**
 * Create the Application class dynamically using Foundry V12–V14 `ApplicationV2`
 * (`HandlebarsApplicationMixin(ApplicationV2)`) with automatic fallback to `Application` V1.
 */
function createRepairAppClass() {
  const api = foundry?.applications?.api;
  if (api?.ApplicationV2 && api?.HandlebarsApplicationMixin) {
    const BaseAppV2 = api.HandlebarsApplicationMixin(api.ApplicationV2);
    return class AssetPathRepairAppV2 extends BaseAppV2 {
      static DEFAULT_OPTIONS = {
        id: "asset-path-repair-app",
        tag: "div",
        window: {
          title: "Asset Path Auto-Repair",
          icon: "fas fa-wrench",
          resizable: true
        },
        position: {
          width: 920,
          height: 720
        },
        classes: ["asset-path-repair-window"]
      };

      static PARTS = {
        main: {
          template: TEMPLATE_PATH,
          scrollable: [".apr-scroll-container"]
        }
      };

      constructor(options = {}) {
        super(options);
        this.controller = new RepairUIStateController(this);
      }

      async _prepareContext(_options) {
        return this.controller.buildContext();
      }

      _onRender(_context, _options) {
        this.controller.bindEvents(this.element);
      }
    };
  }

  // Fallback for Foundry V11 Application V1
  return class AssetPathRepairAppV1 extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "asset-path-repair-app",
        title: "Asset Path Auto-Repair",
        template: TEMPLATE_PATH,
        width: 920,
        height: 720,
        resizable: true,
        classes: ["asset-path-repair-window"]
      });
    }

    constructor(options = {}) {
      super(options);
      this.controller = new RepairUIStateController(this);
    }

    async getData(_options = {}) {
      return this.controller.buildContext();
    }

    activateListeners(html) {
      super.activateListeners(html);
      const root = html instanceof HTMLElement ? html : html[0];
      this.controller.bindEvents(root);
    }
  };
}

export let AssetPathRepairApp = null;
let activeAppInstance = null;

/**
 * Open the singleton Asset Path Auto-Repair window (GM only).
 */
export function openAssetPathRepairWindow() {
  if (!game.user?.isGM) {
    const lang = game?.i18n?.lang === "de" ? "de" : "en";
    ui.notifications?.warn(translate(lang, "APR.NotifyGMOnly"));
    return null;
  }
  if (!AssetPathRepairApp) {
    AssetPathRepairApp = createRepairAppClass();
  }
  if (!activeAppInstance) {
    activeAppInstance = new AssetPathRepairApp();
  }
  activeAppInstance.render(true);
  return activeAppInstance;
}

/* ========================================================================= */
/* FOUNDRY VTT LIFECYCLE HOOKS                                               */
/* ========================================================================= */

globalThis.Hooks?.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Asset Path Auto-Repair (Foundry VTT V12–V14)`);

  AssetPathRepairApp = createRepairAppClass();

  // Client setting to persist the in-UI language toggle (DE / EN)
  game.settings.register(MODULE_ID, "uiLanguage", {
    name: "UI Language",
    scope: "client",
    config: false,
    type: String,
    default: ""
  });

  // Also register a settings menu button in Configure Settings -> Module Settings
  game.settings.registerMenu(MODULE_ID, "repairMenu", {
    name: "APR.SettingsName",
    label: "APR.SettingsButton",
    hint: "APR.SettingsHint",
    icon: "fas fa-wrench",
    type: AssetPathRepairApp,
    restricted: true
  });

  const mod = game.modules?.get(MODULE_ID);
  if (mod) {
    mod.api = {
      open: openAssetPathRepairWindow,
      Engine: AssetPathRepairEngine
    };
  }
  globalThis.AssetPathRepair = {
    open: openAssetPathRepairWindow,
    Engine: AssetPathRepairEngine
  };
});

/**
 * Inject the "Asset Path Auto-Repair" button into the Game Settings sidebar (`renderSettings`).
 * Compatible with both Foundry V11/V12 (jQuery) and Foundry V13/V14 (ApplicationV2 native HTMLElement).
 */
globalThis.Hooks?.on("renderSettings", (_app, html) => {
  if (!game.user?.isGM) return;

  const root = html instanceof HTMLElement ? html : (html?.[0] ?? html);
  if (!root || typeof root.querySelector !== "function") return;
  if (root.querySelector(".apr-sidebar-open-btn")) return;

  const lang = game?.i18n?.lang === "de" ? "de" : "en";
  const label = translate(lang, "APR.SettingsButton");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "apr-sidebar-open-btn";
  btn.innerHTML = `<i class="fas fa-wrench"></i> <span>${label}</span>`;
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    openAssetPathRepairWindow();
  });

  const targetContainer =
    root.querySelector("#settings-game") ||
    root.querySelector('[data-section="game"]') ||
    root.querySelector(".settings-game") ||
    root.querySelector("section.settings") ||
    root.querySelector("section") ||
    root;

  targetContainer.appendChild(btn);
});
