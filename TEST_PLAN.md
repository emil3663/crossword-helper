# 📝 Crossword Helper — Test Plan

**Version:** 1.0  
**Last updated:** 2026-05-02  
**Status:** In active development

---

## 1. App Overview

Crossword Helper assists puzzle solvers with four tools:
1. **Pattern Search** — find words matching a letter pattern (e.g. `c?t`, `?r??d`)
2. **Cryptic Clue Analyser** — detect clue type and suggest solving strategies
3. **Anagram Solver** — full and partial anagrams of a set of letters
4. **Dictionary** — full definitions, phonetics, and synonyms

All word data is fetched live from free public APIs (Datamuse, Free Dictionary API).

---

## 2. Current Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Pattern search with `?` wildcard | ✅ Done | Via Datamuse `sp=` |
| Pattern search with `*` wildcard | ✅ Done | Datamuse multi-char wildcard |
| Length filter | ✅ Done | Client-side filter on results |
| Click word → auto-define | ✅ Done | Switches to Dictionary tab |
| Cryptic clue type detection | ✅ Done | 8 types: anagram, reversal, hidden, double, homophone, charade, container, deletion |
| Cryptic solving tips per type | ✅ Done | Contextual advice shown |
| Pattern + length → candidate words | ✅ Done | Fetched after analysis |
| Full anagram search | ✅ Done | Sorted letters matched |
| Sub-anagram search | ✅ Done | Subset of letters |
| Word definition lookup | ✅ Done | Free Dictionary API |
| Phonetic transcription | ✅ Done | Shown when available |
| Part-of-speech grouping | ✅ Done | noun, verb, adjective… |
| Synonym chips (click to define) | ✅ Done | |
| Offline / no-internet fallback | ❌ Not done | API-dependent |
| Saved word lists | ❌ Not done | No persistence yet |
| Crossword grid builder | ❌ Not done | Visual grid not implemented |
| Thesaurus integration | ❌ Not done | |
| Clue history | ❌ Not done | |

---

## 3. Test Cases

### 3.1 Pattern Search

| ID | Test | Expected Result | Status |
|----|------|-----------------|--------|
| PS-01 | Search `c?t` | Results include cat, cot, cut | ⬜ |
| PS-02 | Search `?r??d` | Results include bread, greed, tread | ⬜ |
| PS-03 | Search `c*e` | Multi-length results starting with c, ending with e | ⬜ |
| PS-04 | Search with length=5 | Only 5-letter words in results | ⬜ |
| PS-05 | Empty search | "Enter a pattern first" message | ⬜ |
| PS-06 | No results | "No words found" message | ⬜ |
| PS-07 | Click word chip | Switches to Dictionary tab and looks up that word | ⬜ |
| PS-08 | Press Enter | Same result as clicking Search | ⬜ |
| PS-09 | Underscore `_` treated as `?` | Same results as using `?` | ⬜ |
| PS-10 | API offline | "Search failed — check your internet connection" | ⬜ |

### 3.2 Cryptic Clue Analyser

| ID | Test | Expected Result | Status |
|----|------|-----------------|--------|
| CC-01 | Clue with "mixed" | Anagram type detected | ⬜ |
| CC-02 | Clue with "backward" | Reversal type detected | ⬜ |
| CC-03 | Clue with "inside" | Hidden word type detected | ⬜ |
| CC-04 | Clue with "sounds like" | Homophone type detected | ⬜ |
| CC-05 | Clue with "around" | Container type detected | ⬜ |
| CC-06 | Clue with "without" | Deletion type detected | ⬜ |
| CC-07 | Clue with no indicators | "Clue type unclear" message + &lit suggestion | ⬜ |
| CC-08 | Multiple indicators | Multiple type cards shown | ⬜ |
| CC-09 | Pattern + length provided | Candidate words fetched and shown | ⬜ |
| CC-10 | Empty clue | "Enter a clue first" message | ⬜ |

### 3.3 Anagram Solver

| ID | Test | Expected Result | Status |
|----|------|-----------------|--------|
| AG-01 | "listen" | Full anagram: "enlist", "tinsel", "silent" | ⬜ |
| AG-02 | "earth" | Full anagrams: "heart", "hater", "rathe" | ⬜ |
| AG-03 | "aeinrst" | Multiple 7-letter anagrams | ⬜ |
| AG-04 | Sub-anagrams | Shorter words also shown | ⬜ |
| AG-05 | No anagrams | "No anagrams found" message | ⬜ |
| AG-06 | > 15 letters | "Max 15 letters supported" message | ⬜ |
| AG-07 | Non-alpha characters | Stripped before solving | ⬜ |
| AG-08 | Press Enter | Same as clicking Solve | ⬜ |
| AG-09 | API offline | "Anagram search failed" message | ⬜ |

### 3.4 Dictionary

| ID | Test | Expected Result | Status |
|----|------|-----------------|--------|
| DC-01 | Look up "elephant" | Definition, phonetic, part of speech shown | ⬜ |
| DC-02 | Look up "run" | Multiple meanings (noun, verb) all shown | ⬜ |
| DC-03 | Misspelled word | "No definition found" message | ⬜ |
| DC-04 | Word with synonyms | Synonyms shown as clickable chips | ⬜ |
| DC-05 | Click synonym chip | Looks up that word | ⬜ |
| DC-06 | Press Enter | Same as clicking Define | ⬜ |
| DC-07 | API offline | "Lookup failed" message | ⬜ |

---

## 4. Known Limitations & Gaps

1. **API dependency** — All features require internet. No offline fallback.
2. **Datamuse limitations** — Returns up to 1,000 results; very rare words may be absent.
3. **Cryptic detection is keyword-based** — No NLP; complex clue structures may not be recognised.
4. **No grid view** — Users must mentally map words to their crossword grid.
5. **British English support** — Free Dictionary API covers en-US; some British spellings may not resolve.
6. **No clue history** — Previous searches are not saved.

---

## 5. Roadmap / Next Steps

### Sprint 1 (MVP hardening)
- [ ] Automated API-mocked tests for all 4 tabs
- [ ] Add loading skeleton while API is fetching
- [ ] Cache last 20 searches in sessionStorage
- [ ] Keyboard shortcut: Tab switches between tool tabs

### Sprint 2 (Better cryptic solving)
- [ ] NLP-based indicator detection (use a small WASM model)
- [ ] Highlight indicator words inside the clue text
- [ ] Show worked example for each clue type
- [ ] Add "all-in-one (&lit)" clue detection

### Sprint 3 (Grid integration)
- [ ] Interactive crossword grid builder
- [ ] Auto-fill confirmed answers into the grid
- [ ] Save and load grids from localStorage

### Sprint 4 (Community)
- [ ] User-submitted clue bank
- [ ] Rated solution discussion per clue
- [ ] Import .puz files (standard crossword format)

---

## 6. GitHub Project Board Structure

| Column | Description |
|--------|-------------|
| 🧊 Backlog | Ideas and future features |
| 🔍 Needs Investigation | API edge cases / bugs to research |
| 🚧 In Progress | Actively being worked on |
| 👀 In Review | PR open, awaiting review |
| ✅ Done | Merged and released |

### Suggested Labels

| Label | Colour | Use |
|-------|--------|-----|
| `bug` | red | Something isn't working |
| `enhancement` | blue | New feature or request |
| `cryptic` | yellow | Cryptic clue engine |
| `api` | purple | Datamuse / Dictionary API |
| `grid` | teal | Crossword grid builder |
| `good first issue` | light-green | Easy entry point |
| `offline` | orange | Offline / caching features |
