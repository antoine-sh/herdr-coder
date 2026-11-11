// Everything that talks to the `coder` CLI. No UI here.
import { exec } from "herdr";

const TRANSITIONAL = ["starting", "stopping", "pending", "canceling"];

export const keyOf = (w) => `${w.owner}/${w.name}`;
export const isTransitional = (w) => TRANSITIONAL.includes(w.status);

export async function listWorkspaces() {
  const r = await exec("coder", ["list", "-o", "json"], { timeout: 20000 });
  return JSON.parse(r.stdout || "[]").map((w) => ({
    name: w.name,
    owner: w.owner_name,
    template: w.template_display_name || w.template_name,
    status: w.latest_build?.status ?? "unknown",
    healthy: w.health?.healthy !== false,
  }));
}

// Stops a running workspace, starts any other. Returns the verb used.
export async function toggleWorkspace(w) {
  const verb = w.status === "running" ? "stop" : "start";
  await exec("coder", [verb, "-y", keyOf(w)], { timeout: 600000 });
  return verb;
}
