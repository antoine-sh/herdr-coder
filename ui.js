// Pure view pieces: no state, no host calls beyond theme.
import { div, svg } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { theme } from "herdr";
import { keyOf, isTransitional } from "./coder.js";

const statusColor = (t, w) =>
  w.status === "running" ? t.working : w.status === "failed" ? t.blocked
  : isTransitional(w) ? t.done : t.dim;

const note = (text) => div().px(14).text_size(12).text_color(theme().dim).child(text);

export function workspaceRow(w, { busy, onToggle }) {
  const t = theme();
  const key = keyOf(w);
  const unhealthy = w.status === "running" && !w.healthy;
  return h_flex().id(`cw-${w.owner}-${w.name}`).px(8).py(4).gap(8).items_center().rounded(4)
    .child(v_flex().flex_1().min_w(0)
      .child(div().text_size(13).truncate().text_color(t.foreground).child(w.name))
      .child(div().text_size(11).truncate().text_color(t.dim)
        .child(`${w.template} · ${w.status}${unhealthy ? " · unhealthy" : ""}`)))
    .child(div().id(`cw-btn-${key}`).p(4).rounded(4).flex_none()
      .when(!busy, (el) => el.hover((s) => s.bg(t.hover)).on_click(onToggle))
      .child(svg("mods/coder/power.svg").size(15).text_color(statusColor(t, w))));
}

export function panel({ collapsed, error, rows, onCollapse, onRefresh }) {
  const t = theme();
  return v_flex().size_full().bg(t.chrome)
    .child(h_flex().id("coder-head").h(31).flex_none().pl(16).pr(10).items_center().text_size(11.5).text_color(t.dim)
      .on_click(onCollapse)
      .child(div().flex_1().child(`${collapsed ? "▸" : "▾"} Coder Workspaces`))
      .child(div().id("coder-refresh").px(6).py(2).rounded(4).hover((s) => s.bg(t.hover))
        .on_click((_e, cx) => { cx.stop_propagation(); onRefresh(cx); }).child("↻")))
    .when(!collapsed, (el) => el.child(error ? note(error)
      : !rows.length ? note("No workspaces")
      : v_flex().flex_1().overflow_y_scrollbar().px(6).gap(1).children(rows)));
}
