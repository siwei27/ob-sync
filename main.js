var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CfSyncPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var CfSyncSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.importTimer = null;
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "CF R2 Sync \u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u4E00\u952E\u5BFC\u5165\u914D\u7F6E JSON").setDesc("\u7C98\u8D34 Web \u63A7\u5236\u53F0\u590D\u5236\u7684 JSON \u914D\u7F6E\uFF0C\u81EA\u52A8\u586B\u5145\u670D\u52A1\u7AEF\u5730\u5740\u4E0E Token \u5E76\u91CD\u8FDE").addText(
      (text) => text.setPlaceholder('{"endpoint":"https://...","token":"..."}').onChange((val) => {
        if (this.importTimer) window.clearTimeout(this.importTimer);
        this.importTimer = window.setTimeout(() => {
          this.importTimer = null;
          void (async () => {
            try {
              const parsed = JSON.parse(val.trim());
              if (parsed.endpoint && parsed.token) {
                this.plugin.settings.endpoint = parsed.endpoint.replace(/\/+$/, "");
                this.plugin.settings.token = parsed.token;
                await this.plugin.saveSettingsAndReconnect();
                new import_obsidian.Notice("\u5DF2\u5BFC\u5165\u914D\u7F6E\u5E76\u91CD\u65B0\u8FDE\u63A5");
                this.display();
              }
            } catch {
            }
          })();
        }, 800);
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u670D\u52A1\u7AEF\u5730\u5740 (Endpoint)").setDesc("Cloudflare Worker \u57DF\u540D\uFF08\u4FEE\u6539\u540E\u8BF7\u70B9\u51FB\u4E0B\u65B9\u300C\u5E94\u7528\u8FDE\u63A5\u5E76\u7ACB\u5373\u540C\u6B65\u300D\uFF09").addText(
      (text) => text.setPlaceholder("https://obsidian-cf-sync.workers.dev").setValue(this.plugin.settings.endpoint).onChange(async (value) => {
        this.plugin.settings.endpoint = value.trim().replace(/\/+$/, "");
        await this.plugin.saveSettingsOnly();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u9274\u6743\u5BC6\u94A5 (SYNC_TOKEN)").setDesc("\u8F93\u5165\u90E8\u7F72\u65F6\u8BBE\u7F6E\u7684 SYNC_TOKEN\uFF08\u4EC5\u4FDD\u5B58\uFF0C\u4E0D\u4F1A\u5728\u6253\u5B57\u65F6\u89E6\u53D1\u91CD\u8FDE\uFF09").addText((text) => {
      text.inputEl.type = "password";
      return text.setPlaceholder("\u8F93\u5165 SYNC_TOKEN").setValue(this.plugin.settings.token).onChange(async (value) => {
        this.plugin.settings.token = value.trim();
        await this.plugin.saveSettingsOnly();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u540C\u6B65 .obsidian \u914D\u7F6E\u76EE\u5F55").setDesc("\u6BCF 60 \u79D2\u626B\u63CF\u4E00\u6B21\u63D2\u4EF6\u4E0E\u4E3B\u9898\u914D\u7F6E\uFF08\u81EA\u52A8\u6392\u9664 workspace*.json\uFF09").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.syncConfigDir).onChange(async (value) => {
        this.plugin.settings.syncConfigDir = value;
        await this.plugin.saveSettingsOnly();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5355\u9644\u4EF6\u6700\u5927\u4F53\u79EF (MB)").setDesc("\u8D85\u8FC7\u6B64\u5927\u5C0F\u7684\u9644\u4EF6\u5C06\u8DF3\u8FC7\u540C\u6B65\uFF08\u6700\u5927 80MB\uFF0C\u79FB\u52A8\u7AEF\u5EFA\u8BAE\u8BBE\u4E3A 20\u201350\uFF09").addText(
      (text) => text.setValue(String(this.plugin.settings.maxAttachmentMB)).onChange(async (value) => {
        const num = Number(value);
        if (!Number.isNaN(num) && num >= 0 && num <= 80) {
          this.plugin.settings.maxAttachmentMB = num;
          await this.plugin.saveSettingsOnly();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u6392\u9664\u8DEF\u5F84\u524D\u7F00").setDesc("\u6BCF\u884C\u4E00\u4E2A\u76EE\u5F55\u6216\u6587\u4EF6\u524D\u7F00\uFF08\u5982 Templates/ \u6216 Archive/\uFF09").addTextArea(
      (area) => area.setPlaceholder(".trash/\nTemplates/").setValue(this.plugin.settings.ignorePrefixes.join("\n")).onChange(async (value) => {
        this.plugin.settings.ignorePrefixes = value.split("\n").map((s) => s.trim()).filter(Boolean);
        await this.plugin.saveSettingsOnly();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5E94\u7528\u8FDE\u63A5\u5E76\u7ACB\u5373\u540C\u6B65").setDesc(`\u5F53\u524D\u672C\u5730\u9AD8\u6C34\u4F4D\u540C\u6B65\u5E8F\u5217\u53F7\uFF1A${this.plugin.state.lastSyncSeq}`).addButton(
      (btn) => btn.setButtonText("\u91CD\u8FDE\u5E76\u6267\u884C\u540C\u6B65").setCta().onClick(async () => {
        await this.plugin.saveSettingsAndReconnect();
        new import_obsidian.Notice("\u5DF2\u91CD\u65B0\u8FDE\u63A5\u5E76\u542F\u52A8\u540C\u6B65\u6821\u51C6");
        this.display();
      })
    );
  }
};

// src/main.ts
var DEFAULT_SETTINGS = {
  endpoint: "",
  token: "",
  syncConfigDir: true,
  maxAttachmentMB: 50,
  ignorePrefixes: [".trash/"]
};
var WORKSPACE_FILE_REGEX = /^\.obsidian\/workspace.*\.json$/i;
var SELF_DATA_PATH = ".obsidian/plugins/obsidian-cf-sync/data.json";
var MAX_CONCURRENCY = 5;
var PING_INTERVAL_MS = 3e4;
var CfSyncPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
    this.state = { lastSyncSeq: 0, syncedFiles: {}, skippedLargeFiles: {} };
    this.ws = null;
    this.isUnloaded = false;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.pingTimer = null;
    this.lastPongAt = 0;
    this.statusBarEl = null;
    this.suppressMap = /* @__PURE__ */ new Map();
    // path -> expectedHash（回声抑制）
    this.debounceTimers = /* @__PURE__ */ new Map();
    // 按路径串行上传队列：同一文件的多次上传排队执行，禁止重叠。
    // 否则后一次上传读到的 baseHash 还是前一次提交前的旧值，服务端严格比对
    // （baseHash !== 远端现 hash）会把“自己和自己”误判为冲突，不断产生
    // .sync-conflict-* 副本。队列保证每次上传执行时读到的都是最新 baseHash。
    this.uploadQueues = /* @__PURE__ */ new Map();
    this.pendingDeletes = /* @__PURE__ */ new Map();
    // path -> baseHash
    this.deleteBatchTimer = null;
    this.lastInputTime = 0;
    this.syncing = false;
    this.configTimer = null;
    this.deferredItems = /* @__PURE__ */ new Map();
    this.deferredTimer = null;
  }
  async onload() {
    this.isUnloaded = false;
    await this.loadPluginData();
    this.addSettingTab(new CfSyncSettingTab(this.app, this));
    this.statusBarEl = this.addStatusBarItem();
    this.updateStatusBar("\u521D\u59CB\u5316");
    this.registerDomEvent(document, "keydown", () => {
      this.lastInputTime = Date.now();
    });
    this.registerEvent(this.app.vault.on("create", (f) => this.scheduleUpload(f)));
    this.registerEvent(this.app.vault.on("modify", (f) => this.scheduleUpload(f)));
    this.registerEvent(this.app.vault.on("delete", (f) => this.queueDelete(f.path)));
    this.registerEvent(this.app.vault.on("rename", (f, oldPath) => this.handleRename(f, oldPath)));
    this.registerDomEvent(document, "visibilitychange", () => {
      if (document.visibilityState === "visible" && this.isConfigured()) {
        void this.pullDelta();
      }
    });
    this.addCommand({
      id: "cf-sync-now",
      name: "\u7ACB\u5373\u6267\u884C\u5168\u91CF\u540C\u6B65\u6821\u51C6",
      callback: () => void this.runFullSync()
    });
    this.app.workspace.onLayoutReady(() => {
      if (this.isConfigured()) {
        this.connectWebSocket();
        void this.runFullSync();
      } else {
        this.updateStatusBar("\u672A\u914D\u7F6E");
      }
    });
    this.configTimer = window.setInterval(() => {
      if (this.isConfigured() && this.settings.syncConfigDir) {
        void this.scanConfigDir();
      }
    }, 6e4);
  }
  onunload() {
    this.isUnloaded = true;
    this.closeWebSocketCleanly();
    if (this.configTimer) window.clearInterval(this.configTimer);
    if (this.deleteBatchTimer) window.clearTimeout(this.deleteBatchTimer);
    if (this.deferredTimer) window.clearTimeout(this.deferredTimer);
    for (const timer of this.debounceTimers.values()) {
      window.clearTimeout(timer);
    }
  }
  isConfigured() {
    return Boolean(this.settings.endpoint && this.settings.token);
  }
  async saveSettingsOnly() {
    await this.savePluginData();
  }
  async saveSettingsAndReconnect() {
    await this.savePluginData();
    this.reconnectAttempts = 0;
    this.closeWebSocketCleanly();
    if (this.isConfigured()) {
      this.connectWebSocket();
      void this.runFullSync();
    } else {
      this.updateStatusBar("\u672A\u914D\u7F6E");
    }
  }
  closeWebSocketCleanly() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.pingTimer) {
      window.clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.onopen = null;
      try {
        this.ws.close();
      } catch {
      }
      this.ws = null;
    }
  }
  updateStatusBar(label) {
    if (this.statusBarEl) {
      this.statusBarEl.setText(`CF Sync: ${label}`);
    }
  }
  async loadPluginData() {
    const raw = await this.loadData();
    if (raw?.settings) this.settings = { ...DEFAULT_SETTINGS, ...raw.settings };
    if (raw?.state) this.state = { ...raw.state, skippedLargeFiles: raw.state.skippedLargeFiles ?? {} };
  }
  async savePluginData() {
    await this.saveData({ settings: this.settings, state: this.state });
  }
  isIgnored(path) {
    if (path === SELF_DATA_PATH || WORKSPACE_FILE_REGEX.test(path)) return true;
    return this.settings.ignorePrefixes.some((prefix) => path.startsWith(prefix));
  }
  connectWebSocket() {
    if (this.isUnloaded || !this.isConfigured()) return;
    this.closeWebSocketCleanly();
    const wsUrl = this.settings.endpoint.replace(/^http/, "ws") + `/ws/sync?token=${encodeURIComponent(this.settings.token)}`;
    const socket = new WebSocket(wsUrl);
    this.ws = socket;
    socket.onopen = () => {
      if (this.isUnloaded || this.ws !== socket) return;
      this.reconnectAttempts = 0;
      this.lastPongAt = Date.now();
      this.updateStatusBar(`\u5DF2\u8FDE\u63A5 (seq:${this.state.lastSyncSeq})`);
      this.pingTimer = window.setInterval(() => {
        if (socket.readyState !== WebSocket.OPEN) return;
        if (Date.now() - this.lastPongAt > 7e4) {
          try {
            socket.close();
          } catch {
          }
          return;
        }
        const ping = { type: "ping", ts: Date.now() };
        socket.send(JSON.stringify(ping));
      }, PING_INTERVAL_MS);
    };
    socket.onmessage = (ev) => {
      if (this.isUnloaded || this.ws !== socket) return;
      const msg = JSON.parse(String(ev.data));
      if (msg.type === "pong") {
        this.lastPongAt = Date.now();
        return;
      }
      if ((msg.type === "poke" || msg.type === "welcome") && msg.latestSeq > this.state.lastSyncSeq) {
        void this.pullDelta();
      }
    };
    socket.onerror = () => {
      try {
        socket.close();
      } catch {
      }
    };
    socket.onclose = () => {
      if (this.isUnloaded || this.ws !== socket) return;
      if (this.pingTimer) {
        window.clearInterval(this.pingTimer);
        this.pingTimer = null;
      }
      this.updateStatusBar("\u79BB\u7EBF\u91CD\u8FDE\u4E2D");
      const delay = Math.min(3e4, 1e3 * Math.pow(2, this.reconnectAttempts++));
      this.reconnectTimer = window.setTimeout(() => {
        this.reconnectTimer = null;
        this.connectWebSocket();
      }, delay);
    };
  }
  async runFullSync() {
    if (!this.isConfigured()) return;
    const limitBytes = this.settings.maxAttachmentMB > 0 ? this.settings.maxAttachmentMB * 1024 * 1024 : Infinity;
    let rewindTo = this.state.lastSyncSeq;
    for (const [path, entry] of Object.entries(this.state.skippedLargeFiles)) {
      if (entry.size <= limitBytes) {
        rewindTo = Math.min(rewindTo, entry.syncSeq - 1);
        delete this.state.skippedLargeFiles[path];
      }
    }
    if (rewindTo < this.state.lastSyncSeq) {
      this.state.lastSyncSeq = rewindTo;
      await this.savePluginData();
    }
    await this.pullDelta();
    await this.reconcileLocalVault();
    if (this.settings.syncConfigDir) {
      await this.scanConfigDir();
    }
  }
  async reconcileLocalVault() {
    const allFiles = this.app.vault.getFiles();
    const currentDiskPaths = /* @__PURE__ */ new Set();
    await runPool(allFiles, MAX_CONCURRENCY, async (file) => {
      if (this.isIgnored(file.path)) return;
      currentDiskPaths.add(file.path);
      const snap = this.state.syncedFiles[file.path];
      if (snap && snap.mtime === file.stat.mtime) return;
      await this.enqueueUpload(
        file.path,
        file.extension === "md" ? "note" : "attachment",
        async () => ({
          buf: await this.app.vault.readBinary(file),
          mtime: file.stat.mtime
        })
      );
    });
    for (const syncedPath of Object.keys(this.state.syncedFiles)) {
      if (syncedPath.startsWith(this.app.vault.configDir + "/")) continue;
      if (!currentDiskPaths.has(syncedPath) && !this.isIgnored(syncedPath)) {
        this.queueDelete(syncedPath);
      }
    }
  }
  scheduleUpload(file) {
    if (!(file instanceof import_obsidian2.TFile) || !this.isConfigured() || this.isIgnored(file.path)) return;
    const prev = this.debounceTimers.get(file.path);
    if (prev) window.clearTimeout(prev);
    const timer = window.setTimeout(() => {
      this.debounceTimers.delete(file.path);
      void this.enqueueUpload(
        file.path,
        file.extension === "md" ? "note" : "attachment",
        async () => ({
          buf: await this.app.vault.readBinary(file),
          mtime: file.stat.mtime
        })
      );
    }, 1500);
    this.debounceTimers.set(file.path, timer);
  }
  queueDelete(path) {
    if (!this.isConfigured() || this.isIgnored(path)) return;
    const baseHash = this.state.syncedFiles[path]?.hash;
    this.pendingDeletes.set(path, baseHash);
    if (this.deleteBatchTimer) window.clearTimeout(this.deleteBatchTimer);
    this.deleteBatchTimer = window.setTimeout(() => {
      this.deleteBatchTimer = null;
      void this.flushDeletes();
    }, 300);
  }
  async flushDeletes() {
    if (this.pendingDeletes.size === 0) return;
    const entries = Array.from(this.pendingDeletes.entries()).map(([path, baseHash]) => ({ path, baseHash }));
    this.pendingDeletes.clear();
    const res = await fetch(`${this.settings.endpoint}/api/files/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.settings.token}`
      },
      body: JSON.stringify({ paths: entries })
    });
    if (res.status === 409) {
      const body = await res.json();
      new import_obsidian2.Notice(body.reason ?? "\u89E6\u53D1\u6279\u91CF\u5220\u9664\u7194\u65AD\u4FDD\u62A4\uFF0C\u8BF7\u5728 Web \u7AEF\u786E\u8BA4");
      return;
    }
    if (res.ok) {
      const body = await res.json();
      const skipped = new Set(body.skippedConflicts ?? []);
      for (const { path } of entries) {
        if (!skipped.has(path)) {
          delete this.state.syncedFiles[path];
        }
      }
      await this.savePluginData();
      if (skipped.size > 0) {
        new import_obsidian2.Notice(`\u6709 ${skipped.size} \u4E2A\u6587\u4EF6\u56E0\u8FDC\u7AEF\u5DF2\u66F4\u65B0\u800C\u53D6\u6D88\u5220\u9664\uFF0C\u6B63\u5728\u62C9\u53D6\u6700\u65B0\u5185\u5BB9`);
        await this.pullDelta();
      }
    }
  }
  async sha256Hex(buf) {
    const digest = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  /**
   * 把一次上传排进该路径的串行队列。`read` 在轮到它执行时才调用，
   * 保证读到的是最新磁盘内容、算出的 baseHash 是上一次上传提交后的新值，
   * 而不是排队前就读好的旧快照。返回的 Promise 在本次上传完成时 resolve，
   * 调用方 await 它即可等到自己这次上传落盘。
   */
  enqueueUpload(path, kind, read) {
    const prev = this.uploadQueues.get(path) ?? Promise.resolve();
    const next = prev.catch(() => {
    }).then(async () => {
      try {
        const { buf, mtime } = await read();
        await this.uploadBinary(path, Promise.resolve(buf), mtime, kind);
      } catch (e) {
        if (e instanceof Error && (e.message.includes("ENOENT") || e.code === "ENOENT")) {
          if (this.state.syncedFiles[path]) await this.queueDelete(path);
          return;
        }
        console.error(`[CF Sync] \u4E0A\u4F20\u5931\u8D25 ${path}`, e);
      }
    });
    this.uploadQueues.set(path, next);
    void next.finally(() => {
      if (this.uploadQueues.get(path) === next) this.uploadQueues.delete(path);
    });
    return next;
  }
  async uploadBinary(path, bufPromise, mtime, kind) {
    const buf = await bufPromise;
    if (kind === "attachment" && this.settings.maxAttachmentMB > 0 && buf.byteLength > this.settings.maxAttachmentMB * 1024 * 1024) {
      return;
    }
    const hash = await this.sha256Hex(buf);
    if (this.suppressMap.get(path) === hash) {
      this.suppressMap.delete(path);
      return;
    }
    if (this.state.syncedFiles[path]?.hash === hash) {
      this.state.syncedFiles[path].mtime = mtime;
      await this.savePluginData();
      return;
    }
    const upsert = async () => {
      const baseHash = this.state.syncedFiles[path]?.hash;
      const res = await fetch(`${this.settings.endpoint}/api/files/upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.settings.token}`
        },
        body: JSON.stringify({ path, hash, size: buf.byteLength, kind, mtime, baseHash })
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const errBody = await res.json();
          msg = errBody.error ?? msg;
        } catch {
        }
        new import_obsidian2.Notice(`\u540C\u6B65\u5931\u8D25 ${path}\uFF1A${msg}`);
        return null;
      }
      return await res.json();
    };
    this.updateStatusBar("\u4E0A\u4F20\u4E2D...");
    let result = await upsert();
    if (!result) {
      this.updateStatusBar(`\u5DF2\u540C\u6B65 (seq:${this.state.lastSyncSeq})`);
      return;
    }
    if (result.status === "need_blob") {
      const putRes = await fetch(`${this.settings.endpoint}/api/blobs/${hash}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${this.settings.token}` },
        body: buf
      });
      if (!putRes.ok) {
        new import_obsidian2.Notice(
          putRes.status === 413 ? `\u6587\u4EF6\u8D85\u8FC7 80MB \u4E0A\u9650\uFF0C\u8DF3\u8FC7\u4E0A\u4F20\uFF1A${path}` : `\u4E0A\u4F20\u6587\u4EF6\u5757\u5931\u8D25\uFF1A${path}`
        );
        this.updateStatusBar(`\u5DF2\u540C\u6B65 (seq:${this.state.lastSyncSeq})`);
        return;
      }
      result = await upsert();
      if (!result) {
        this.updateStatusBar(`\u5DF2\u540C\u6B65 (seq:${this.state.lastSyncSeq})`);
        return;
      }
    }
    if (result.status === "conflict") {
      new import_obsidian2.Notice(`\u540C\u6B65\u51B2\u7A81\uFF1A\u5DF2\u53E6\u5B58\u4E3A ${result.conflictPath}`);
      await this.pullDelta();
    } else if (result.status === "ok") {
      this.recordSynced(path, hash, mtime, result.syncSeq ?? 0);
      await this.savePluginData();
    }
    this.updateStatusBar(`\u5DF2\u540C\u6B65 (seq:${this.state.lastSyncSeq})`);
  }
  async handleRename(file, oldPath) {
    if (!(file instanceof import_obsidian2.TFile) || !this.isConfigured() || this.isIgnored(file.path)) return;
    await this.enqueueUpload(
      file.path,
      file.extension === "md" ? "note" : "attachment",
      async () => ({
        buf: await this.app.vault.readBinary(file),
        mtime: file.stat.mtime
      })
    );
    this.queueDelete(oldPath);
  }
  async scanConfigDir() {
    const adapter = this.app.vault.adapter;
    const configRoot = this.app.vault.configDir;
    const listRecursive = async (dir) => {
      const listed = await adapter.list(dir);
      const files = [...listed.files];
      for (const sub of listed.folders) {
        files.push(...await listRecursive(sub));
      }
      return files;
    };
    const allFiles = await listRecursive(configRoot);
    for (const p of allFiles) {
      if (this.isIgnored(p)) continue;
      const stat = await adapter.stat(p);
      if (!stat || stat.size > 1024 * 1024) continue;
      if (this.state.syncedFiles[p]?.mtime === stat.mtime) continue;
      await this.enqueueUpload(p, "config", async () => ({
        buf: await adapter.readBinary(p),
        mtime: stat.mtime
      }));
    }
  }
  async ensureParentDir(path) {
    const idx = path.lastIndexOf("/");
    if (idx <= 0) return;
    const dir = path.slice(0, idx);
    if (!await this.app.vault.adapter.exists(dir)) {
      await this.app.vault.adapter.mkdir(dir);
    }
  }
  /**
   * 关键修复：高水位线（High-Water Mark）游标推进
   * - 按 syncSeq 升序追踪每条变更的真实落盘状态（settledSeqs）
   * - 任何因 batch-get 缺失、附件下载 !res.ok 或进入 deferredItems 暂缓的项均不标记为 settled
   * - lastSyncSeq 仅推进到从头连续 settled 的最大 syncSeq，遇到第一个未完成项立即停止推进并退出分页循环
   */
  async pullDelta() {
    if (this.syncing || !this.isConfigured()) return;
    this.syncing = true;
    this.updateStatusBar("\u62C9\u53D6\u589E\u91CF...");
    try {
      let hasMore = true;
      let pullFailed = false;
      while (hasMore) {
        const res = await fetch(
          `${this.settings.endpoint}/api/sync/delta?since=${this.state.lastSyncSeq}&limit=500`,
          {
            headers: { Authorization: `Bearer ${this.settings.token}` }
          }
        );
        if (!res.ok) {
          pullFailed = true;
          break;
        }
        const delta = await res.json();
        if (delta.changes.length === 0) break;
        const settledSeqs = /* @__PURE__ */ new Set();
        const textItems = [];
        const binaryItems = [];
        for (const item of delta.changes) {
          if (this.isIgnored(item.path)) {
            settledSeqs.add(item.syncSeq);
            continue;
          }
          const knownSeq = this.state.syncedFiles[item.path]?.seq;
          if (knownSeq !== void 0 && item.syncSeq <= knownSeq) {
            settledSeqs.add(item.syncSeq);
            continue;
          }
          if (item.deleted) {
            try {
              const existing = this.app.vault.getAbstractFileByPath(item.path);
              if (existing instanceof import_obsidian2.TFile) {
                await this.app.vault.trash(existing, true);
              } else if (await this.app.vault.adapter.exists(item.path)) {
                await this.app.vault.adapter.remove(item.path);
              }
              delete this.state.syncedFiles[item.path];
              delete this.state.skippedLargeFiles[item.path];
              settledSeqs.add(item.syncSeq);
            } catch {
            }
            continue;
          }
          if (item.kind === "note" || item.kind === "config") textItems.push(item);
          else binaryItems.push(item);
        }
        for (let i = 0; i < textItems.length; i += 50) {
          const batch = textItems.slice(i, i + 50);
          const batchRes = await fetch(`${this.settings.endpoint}/api/sync/batch-get`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.settings.token}`
            },
            body: JSON.stringify({ hashes: batch.map((b) => b.hash) })
          });
          if (!batchRes.ok) continue;
          const { blobs } = await batchRes.json();
          for (const item of batch) {
            const text = blobs[item.hash];
            if (text === void 0) continue;
            const activeFile = this.app.workspace.getActiveFile();
            if (activeFile?.path === item.path && Date.now() - this.lastInputTime < 3e3) {
              this.deferredItems.set(item.path, { item, text });
              this.scheduleDeferredFlush();
              new import_obsidian2.Notice(`\u8FDC\u7AEF\u6709\u66F4\u65B0\uFF1A${item.path}\uFF0C\u5C06\u5728\u505C\u6B62\u8F93\u5165\u540E\u81EA\u52A8\u5408\u5E76`);
              continue;
            }
            if (activeFile?.path === item.path) {
              const local = this.app.vault.getAbstractFileByPath(item.path);
              if (local instanceof import_obsidian2.TFile) {
                const localHash = await this.sha256Hex(await this.app.vault.readBinary(local));
                const lastSyncedHash = this.state.syncedFiles[item.path]?.hash;
                if (lastSyncedHash && localHash !== lastSyncedHash && localHash !== item.hash) {
                  this.deferredItems.set(item.path, { item, text });
                  this.scheduleDeferredFlush();
                  continue;
                }
              }
            }
            try {
              await this.writeLocalText(item, text);
              settledSeqs.add(item.syncSeq);
            } catch {
            }
          }
        }
        await runPool(binaryItems, MAX_CONCURRENCY, async (item) => {
          if (this.settings.maxAttachmentMB > 0 && item.size > this.settings.maxAttachmentMB * 1024 * 1024) {
            this.state.skippedLargeFiles[item.path] = {
              hash: item.hash,
              size: item.size,
              syncSeq: item.syncSeq
            };
            settledSeqs.add(item.syncSeq);
            return;
          }
          try {
            const blobRes = await fetch(`${this.settings.endpoint}/api/blobs/${item.hash}`, {
              headers: { Authorization: `Bearer ${this.settings.token}` }
            });
            if (!blobRes.ok) return;
            const buf = await blobRes.arrayBuffer();
            await this.writeLocalBinary(item, buf);
            settledSeqs.add(item.syncSeq);
          } catch {
          }
        });
        let advancedSeq = this.state.lastSyncSeq;
        let hitUnsettled = false;
        for (const item of delta.changes) {
          if (settledSeqs.has(item.syncSeq)) {
            advancedSeq = item.syncSeq;
          } else {
            hitUnsettled = true;
            break;
          }
        }
        this.state.lastSyncSeq = advancedSeq;
        await this.savePluginData();
        if (hitUnsettled) {
          hasMore = false;
        } else {
          hasMore = delta.hasMore;
        }
      }
      if (pullFailed) {
        this.updateStatusBar("\u62C9\u53D6\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5");
      } else {
        this.updateStatusBar(`\u5DF2\u540C\u6B65 (seq:${this.state.lastSyncSeq})`);
      }
    } finally {
      this.syncing = false;
    }
  }
  scheduleDeferredFlush() {
    if (this.deferredTimer) window.clearTimeout(this.deferredTimer);
    this.deferredTimer = window.setTimeout(() => {
      void this.flushDeferredItems();
    }, 3500);
  }
  async flushDeferredItems() {
    if (Date.now() - this.lastInputTime < 3e3) {
      this.scheduleDeferredFlush();
      return;
    }
    for (const [path, { item, text }] of this.deferredItems.entries()) {
      this.deferredItems.delete(path);
      const existing = this.app.vault.getAbstractFileByPath(path);
      if (existing instanceof import_obsidian2.TFile) {
        const localBuf = await this.app.vault.readBinary(existing);
        const localHash = await this.sha256Hex(localBuf);
        const lastSyncedHash = this.state.syncedFiles[path]?.hash;
        if (lastSyncedHash && localHash !== lastSyncedHash && localHash !== item.hash) {
          await this.enqueueUpload(path, "note", async () => {
            const f = this.app.vault.getAbstractFileByPath(path);
            if (!(f instanceof import_obsidian2.TFile)) throw new Error(`file gone: ${path}`);
            return { buf: await this.app.vault.readBinary(f), mtime: f.stat.mtime };
          });
          continue;
        }
        if (lastSyncedHash && lastSyncedHash !== item.hash) {
          const stat = await this.app.vault.adapter.stat(path);
          this.recordSynced(path, localHash, stat?.mtime ?? existing.stat.mtime, item.syncSeq);
          await this.savePluginData();
          continue;
        }
      }
      await this.writeLocalText(item, text);
    }
    await this.savePluginData();
    await this.pullDelta();
  }
  /** 记录一次已确认的同步状态：hash/mtime 取实测值，seq 只进不退。 */
  recordSynced(path, hash, mtime, seq) {
    const prev = this.state.syncedFiles[path];
    this.state.syncedFiles[path] = { hash, mtime, seq: Math.max(prev?.seq ?? 0, seq) };
  }
  /**
   * 关键修复：
   * - 对仓库内文件优先调用 app.vault.modify / create，确保打开的编辑器实时刷新内容
   * - 落盘后读取本地真实 stat.mtime 存入 syncedFiles，避免下次启动重算 SHA-256
   */
  async writeLocalText(item, text) {
    const normPath = (0, import_obsidian2.normalizePath)(item.path);
    await this.ensureParentDir(normPath);
    this.suppressMap.set(normPath, item.hash);
    delete this.state.skippedLargeFiles[normPath];
    if (!normPath.startsWith(this.app.vault.configDir + "/")) {
      const existing = this.app.vault.getAbstractFileByPath(normPath);
      if (existing instanceof import_obsidian2.TFile) {
        await this.app.vault.modify(existing, text);
        const stat3 = await this.app.vault.adapter.stat(normPath);
        this.recordSynced(normPath, item.hash, stat3?.mtime ?? existing.stat.mtime, item.syncSeq);
        return;
      }
      const created = await this.app.vault.create(normPath, text);
      const stat2 = await this.app.vault.adapter.stat(normPath);
      this.recordSynced(normPath, item.hash, stat2?.mtime ?? created.stat.mtime, item.syncSeq);
      return;
    }
    await this.app.vault.adapter.write(normPath, text);
    const stat = await this.app.vault.adapter.stat(normPath);
    this.recordSynced(normPath, item.hash, stat?.mtime ?? Date.now(), item.syncSeq);
  }
  async writeLocalBinary(item, buf) {
    const normPath = (0, import_obsidian2.normalizePath)(item.path);
    await this.ensureParentDir(normPath);
    this.suppressMap.set(normPath, item.hash);
    delete this.state.skippedLargeFiles[normPath];
    if (!normPath.startsWith(this.app.vault.configDir + "/")) {
      const existing = this.app.vault.getAbstractFileByPath(normPath);
      if (existing instanceof import_obsidian2.TFile) {
        await this.app.vault.modifyBinary(existing, buf);
        const stat3 = await this.app.vault.adapter.stat(normPath);
        this.recordSynced(normPath, item.hash, stat3?.mtime ?? existing.stat.mtime, item.syncSeq);
        return;
      }
      const created = await this.app.vault.createBinary(normPath, buf);
      const stat2 = await this.app.vault.adapter.stat(normPath);
      this.recordSynced(normPath, item.hash, stat2?.mtime ?? created.stat.mtime, item.syncSeq);
      return;
    }
    await this.app.vault.adapter.writeBinary(normPath, buf);
    const stat = await this.app.vault.adapter.stat(normPath);
    this.recordSynced(normPath, item.hash, stat?.mtime ?? Date.now(), item.syncSeq);
  }
};
async function runPool(items, limit, worker) {
  let idx = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (idx < items.length) {
      const current = items[idx++];
      await worker(current);
    }
  });
  await Promise.all(runners);
}
