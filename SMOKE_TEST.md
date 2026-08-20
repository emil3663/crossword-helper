# Smoke Test Results

Date: 2026-05-02

## Environment

- Browser-based manual smoke test
- Desktop viewport and basic mobile-width viewport check
- App opened from both `file://` and intended HTTP-server flow

## Passed

- Pattern search works for `c?t` and returns results.
- Dictionary lookup works for `elephant` and returns definitions and phonetics.
- Cryptic clue analyser detects indicator words and shows candidate words.
- Basic mobile-width layout remains usable at approximately 390px width.

## Failed

- Anagram solver does not return real anagrams for `listen`.
  - Expected examples: `silent`, `enlist`, `tinsel`
  - Actual result: only `listen` was returned as a full anagram.
  - Likely cause: the current implementation queries Datamuse with `sp=listen`, which is a spelling-pattern search rather than an anagram search.

- The top-left `Hub` link is broken in this standalone repository.
  - Current target: `../index.html`
  - Result: file-not-found when opened from this repo by itself.

## Notes

- The app is usable as a standalone static site.
- Serving it over HTTP is the best path for phone testing on the same Wi-Fi network.
- No automated tests were added in this pass.

## Native app / voice smoke checks (added — not yet run)

The app now also ships as a Capacitor-wrapped native Android app (`android/`), with
spoken definitions (text-to-speech) and voice input for cryptic clues. These require
a native build to verify — see TEST_PLAN.md §3.5 for the full manual case list. Not
run yet in this environment: this machine has no Android SDK/emulator and no macOS
(iOS is out of scope for now — see README for platform status). Before shipping:

- Run `npx cap open android` on a machine with Android Studio installed, launch on an
  emulator or device, and step through TEST_PLAN.md §3.5 (VS-01 through VS-10).
- Confirm the speech toggle default is OFF on first launch (no autoplay audio).
- Confirm the mic button on the Cryptic tab only appears inside the native app, not
  when the same `www/` build is opened in a regular browser or via GitHub Pages.
