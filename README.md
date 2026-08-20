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

The web app itself has no build step — it's plain HTML/CSS/JavaScript living in `www/`.
(`package.json` and `node_modules/` exist only to drive the Capacitor native wrapper
described below.)

### Option 1: Open directly

Open `www/index.html` in a browser.

### Option 2: Serve it over HTTP

From the project folder:

```powershell
py -m http.server 8000 --bind 0.0.0.0 --directory www
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

- `www/index.html` contains the UI structure.
- `www/app.js` contains all client-side logic, including text-to-speech and voice input.
- `www/style.css` contains the styling.
- `www/manifest.json`, `www/sw.js`, `www/icons/` are the PWA manifest, service worker, and app icons.
- `TEST_PLAN.md` contains the manual test matrix and roadmap.
- `SMOKE_TEST.md` contains the latest manual smoke-test results.
- `capacitor.config.json`, `android/` are the native Android app wrapper (via Capacitor). Run
  `npx cap sync android` after changing anything under `www/`, then `npx cap open android` to
  build/run in Android Studio.
- `assets/icon.png` is the 1024x1024 source icon; `generate_icons.py` regenerates it and the
  PWA icons, then `npx capacitor-assets generate --android` regenerates all native icon/splash
  sizes from it.
- iOS is not currently wrapped (this repo has been developed on Windows, where Xcode/iOS builds
  aren't possible). The web app and Android wrapper are otherwise unaffected.

## API dependencies

The app depends on public APIs:

- Datamuse for pattern search and word suggestions
- Free Dictionary API for definitions

Without internet access, lookups will fail.

## Voice features (native app)

The Android app can speak dictionary definitions aloud (muted by default — tap the 🔇/🔊
button in the top bar) and accepts spoken cryptic clues via a 🎤 button on the Cryptic tab.
Voice input requires the native app; the mic button stays hidden when running as a plain
website or installed PWA, since it depends on the native Capacitor speech-recognition plugin
rather than the browser's SpeechRecognition API.
