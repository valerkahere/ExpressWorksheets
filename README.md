# SETUP

Important:
- **This project uses pnpm. If you use npm, it will fail.**
- Setup commands **assume Linux/WSL Ubuntu environment**.

## When you want to sync a file between all branches
If it's a README or a repo script. Make edits on `main`, then use 
```
scripts/auto-sync-file.sh
```

## Quick start (Node and pnpm already installed)

```bash
git clone <repo-url> ExpressWorksheets
cd ExpressWorksheets
pnpm install
pnpm dev
```

That installs dependencies into `node_modules/` and starts the Astro dev server. Prints a local URL:
```
http://localhost:<app-port>
```
`Ctrl+C` stops it.


Nothing installed yet, or this is the first time you're using pnpm instead of npm on this machine? See [Setting up from scratch](#setting-up-from-scratch) below.


## Setting up from scratch

### 1. Get Node 24

**from scratch, using `nvm`.**

```bash
# install nvm: https://github.com/nvm-sh/nvm
nvm install 24
nvm alias default 24
```
**Check:** `node -v` starts with `v24.`. Node 24 is the current Active LTS line (supported into 2028), and it satisfies Astro's minimum of v22.12.0 with headroom, so it's a safe default even though older even-numbered versions technically still work.

**from scratch.** This is the standing personal setup route (WSL, then nvm, then corepack), with one change: Node 24, not the 22 that guide names, because this project pins 24.

```bash
npm install --global corepack@latest
corepack enable pnpm
corepack prepare pnpm@latest --activate
pnpm --version
```

Recent Node releases still bundle Corepack, Node's built-in manager for pnpm/Yarn versions — you just have to turn it on.

**Check:** `pnpm --version` prints `11.x` or higher. If `corepack enable` errors out with "command not found," install Corepack manually first: `npm install -g corepack`, then re-run `corepack enable`.

### 3. Clone and install

```bash
git clone <repo-url> ExpressWorksheets
cd ExpressWorksheets
pnpm install
```

**Heads up — a native build-script prompt is normal here.** Since pnpm 11, installs fail closed by default (`strictDepBuilds`) instead of silently running third-party postinstall scripts. This project's dependency tree pulls in `esbuild` (via Vite), which has one of those scripts to fetch its platform binary. If the install stops with `ERR_PNPM_IGNORED_BUILDS`, run:

```bash
pnpm approve-builds
```

and select `esbuild` (and `sharp`, if it's listed — some Astro image-processing paths pull it in). Re-run `pnpm install` afterward. This is a one-time approval per machine; pnpm remembers it in `pnpm-workspace.yaml`.

### 4. Run it

```bash
pnpm dev
```

