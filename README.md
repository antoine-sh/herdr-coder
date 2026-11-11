# herdr-coder

A [Herdr](https://herdr.dev) mod that lists your [Coder](https://coder.com) workspaces in a sidebar section and starts or stops them with one click.

---

## 📑 Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [Install](#-install)
- [Opening it](#-opening-it)
- [How it works](#-how-it-works)
- [Files](#-files)
- [License](#-license)

---

## ✨ Features

### 🖥️ Workspaces

| Element | What it shows |
|---|---|
| 📋 **Row** | The workspace name, with its template and status underneath (`template · running`). |
| 🎨 **Power button** | Colored by status: 🟢 running, 🔴 failed, 🟡 starting / stopping / pending / canceling, grey otherwise. |
| ⚠️ **Unhealthy** | A running workspace whose agent is unhealthy shows `· unhealthy`. |

### ⚡ Everyday

- 🔘 **Start / Stop**: the power button stops a running workspace and starts any other. It is disabled while the workspace is changing state.
- 🔁 **Live**: refreshes every 10 seconds, and on demand with `↻`.
- 📉 **Collapsible**: click the header to fold the section down to its title bar. Your choice is remembered.
- 🔔 **Errors**: a failed start or stop raises a toast with the first line of the `coder` error. A failed list shows the error in the panel.

> [!NOTE]
> Start and stop run with `-y`, so there is **no confirmation**.

---

## 📋 Requirements

- Herdr app
- The [`coder`](https://coder.com/docs/install) CLI on `PATH`, already logged in (`coder login`)

---

## 📦 Install

```sh
git clone https://github.com/antoine-sh/herdr-coder ~/.config/herdr-app/mods/coder
herdr-app check ~/.config/herdr-app/mods/coder
```

## 🚀 Opening it

The mod has `"place": "none"`, so it does not appear on its own. Add a block to your layout file. Shipped layouts are read-only, so clone one first (`herdr-app do layout.clone '{"name":"main","as":"my-layout"}'`).

```json
{ "id": "coder", "type": "block", "content": { "mod": "coder" } }
```

> [!IMPORTANT]
> The block **must have the id `coder`**: collapsing resizes it with `layout.resize`. Put it in a sidebar column, for example under the agents list.

---

## ⚙️ How it works

- Lists with `coder list -o json`; toggles with `coder start -y` / `coder stop -y <owner>/<name>`.
- Expanded, the block takes a weight of `0.6`; collapsed, `31` px.
- Limits:

  | Item | Value |
  |---|---|
  | List timeout | 20 s |
  | Start / stop timeout | 10 min |
  | Refresh | every 10 s |

---

## 📁 Files

| File | Purpose |
|---|---|
| `main.js` | the panel's state and actions (refresh, collapse, start / stop) |
| `coder.js` | everything that talks to the `coder` CLI; no UI |
| `ui.js` | the panel and workspace rows |
| `mod.json` | placement (`none`) |
| `power.svg` | power icon |
| `gpui-kit.d.ts`, `jsconfig.json` | editor types, rewritten by Herdr on start (git-ignored) |

---

## 📄 License

Add a license before publishing, for example MIT.
