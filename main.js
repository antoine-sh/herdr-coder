// Coder workspaces panel: state and wiring. CLI in coder.js, views in ui.js.
import { View } from "gpui-kit";
import { notify, run } from "herdr";
import { listWorkspaces, toggleWorkspace, keyOf, isTransitional } from "./coder.js";
import { panel, workspaceRow } from "./ui.js";

export default class Coder extends View {
  init(_props, cx) {
    this.list = [];
    this.error = null;
    this.busy = new Set();
    try { this.collapsed = localStorage.getItem("collapsed") === "1"; } catch { this.collapsed = false; }
    this.applySize();
    cx.timer.every(10000, (cx) => this.refresh(cx));
    this.refresh(cx);
  }

  refresh(cx) {
    cx.spawn(async (cx) => {
      try {
        this.list = await listWorkspaces();
        this.error = null;
      } catch (e) {
        this.error = String(e.message ?? e).split("\n")[0];
      } finally {
        cx.notify();
      }
    });
  }

  // The section is a layout block: collapsing resizes it to just the header.
  applySize() {
    run("layout.resize", this.collapsed ? { id: "coder", px: 31 } : { id: "coder", weight: 0.6 });
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    try { localStorage.setItem("collapsed", this.collapsed ? "1" : "0"); } catch {}
    this.applySize();
  }

  toggle(w, cx) {
    const key = keyOf(w);
    if (this.busy.has(key)) return;
    this.busy.add(key);
    cx.notify();
    cx.spawn(async (cx) => {
      try {
        await toggleWorkspace(w);
      } catch (e) {
        notify({ title: `coder ${w.name} failed`, body: String(e.message ?? e).split("\n")[0], level: "error" });
      } finally {
        this.busy.delete(key);
        this.refresh(cx);
      }
    });
  }

  render() {
    return panel({
      collapsed: this.collapsed,
      error: this.error,
      rows: this.list.map((w) => workspaceRow(w, {
        busy: this.busy.has(keyOf(w)) || isTransitional(w),
        onToggle: (_e, cx) => this.toggle(w, cx),
      })),
      onCollapse: (_e, cx) => { this.toggleCollapsed(); cx.notify(); },
      onRefresh: (cx) => this.refresh(cx),
    });
  }
}
