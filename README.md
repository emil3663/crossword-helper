# Crossword Helper

Primary access URL (recommended):

- <https://emil3663.github.io/crossword-helper/>

A small static web app for solving crosswords with four tools:

- Pattern search
- Cryptic clue analysis
- Anagram solving
- Dictionary lookup

## Best way to use on phone

1. Open <https://emil3663.github.io/crossword-helper/>
2. Tap **Install App** (or browser menu -> Add to Home Screen)
3. Launch from the new phone icon

This works even when the development laptop is turned off.

## Run locally

This project has no build step and no package manager setup. It is a plain HTML/CSS/JavaScript app.

### Option 1: Open directly

Open `index.html` in a browser.

### Option 2: Serve it over HTTP

From the project folder:

```powershell
py -m http.server 8000 --bind 0.0.0.0
```

Then open:

- Local machine: `http://127.0.0.1:8000`
- Same Wi-Fi/LAN from your phone: `http://192.168.1.17:8000`

## Run from VS Code

A workspace task is included in `.vscode/tasks.json`:

- `serve: crossword-helper`

If VS Code does not pick the task up immediately, reload the window once and run it again.

## Phone access

To use the app on a phone:

1. Start the local HTTP server on this PC.
2. Keep the PC and phone on the same Wi-Fi network.
3. Open `http://192.168.1.17:8000` on the phone.
4. If Windows Firewall prompts for Python network access, allow it on your private network.

Local access is only for testing. Use the GitHub Pages URL above for normal daily use.

## Project files

- `index.html` contains the UI structure.
- `app.js` contains all client-side logic.
- `style.css` contains the styling.
- `TEST_PLAN.md` contains the manual test matrix and roadmap.
- `SMOKE_TEST.md` contains the latest manual smoke-test results.

## API dependencies

The app depends on public APIs:

- Datamuse for pattern search and word suggestions
- Free Dictionary API for definitions

Without internet access, lookups will fail.
