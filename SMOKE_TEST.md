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
