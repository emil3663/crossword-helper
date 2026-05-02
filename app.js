/* ===== Crossword Helper — app.js ===== */

/* ── Tab switching ── */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ── Utility ── */
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function spinner() {
  return '<div class="spinner-wrap"><div class="spinner"></div><span>Searching…</span></div>';
}

/* ======================================
   1. PATTERN SEARCH  (Datamuse API)
   ====================================== */

document.getElementById('patternSearch').addEventListener('click', runPatternSearch);
document.getElementById('patternInput').addEventListener('keydown', e => { if (e.key === 'Enter') runPatternSearch(); });

async function runPatternSearch() {
  const raw    = document.getElementById('patternInput').value.trim();
  const len    = parseInt(document.getElementById('patternLen').value) || null;
  const out    = document.getElementById('patternResults');

  if (!raw) { out.innerHTML = '<p class="no-results">Enter a pattern first.</p>'; return; }

  // Convert ?/_ to single wildcard char, * to multi
  // Datamuse uses ? for single and * for multi
  const pattern = raw.replace(/_/g, '?');
  out.innerHTML = spinner();

  try {
    // sp= for spelling pattern
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(pattern)}&max=100`;
    const res  = await fetch(url);
    const data = await res.json();

    let words = data.map(d => d.word);
    if (len) words = words.filter(w => w.length === len);

    if (words.length === 0) {
      out.innerHTML = '<p class="no-results">No words found for that pattern. Try a different pattern.</p>';
      return;
    }

    out.innerHTML = `
      <p class="result-header">${words.length} word${words.length !== 1 ? 's' : ''} found for pattern <code>${escHtml(raw)}</code>${len ? ` (${len} letters)` : ''}:</p>
      <div class="word-grid">${words.map(w =>
        `<span class="word-chip" onclick="lookupWord('${escHtml(w)}')">${escHtml(w)}</span>`
      ).join('')}</div>`;
  } catch {
    out.innerHTML = '<p class="no-results">Search failed — check your internet connection.</p>';
  }
}

window.lookupWord = word => {
  document.querySelector('[data-tab="define"]').click();
  document.getElementById('defineInput').value = word;
  runDefine();
};

/* ======================================
   2. CRYPTIC CLUE ANALYSER
   ====================================== */

document.getElementById('crypticAnalyse').addEventListener('click', analyseCryptic);

// Cryptic clue type indicators
const CRYPTIC_INDICATORS = {
  anagram: [
    'mixed','confused','scrambled','muddled','broken','odd','strange','unusual','wild',
    'upset','disordered','in a mess','badly','wrongly','corrupt','out','shuffled',
    'changed','rearranged','spinning','drunk','excited','different','new form'
  ],
  reversal: [
    'back','backward','reverse','turned','returned','going back','heading back',
    'about','retreating','recalled','over','reflected','uprising','capsize'
  ],
  hidden: [
    'part of','inside','within','in','some','contained','held','lurking','hiding',
    'buried','found in','concealed','discovered in','central','middle'
  ],
  double: [
    'two meanings','double','dual'
  ],
  homophone: [
    'sounds like','heard','aloud','spoken','say','pronounced','reportedly','verbally',
    'audibly','to the ear','we hear','by the sound of it','it sounds'
  ],
  charade: [
    'followed by','and then','after','before','then','leads to','joins','plus',
    'with','next to'
  ],
  container: [
    'around','about','outside','surrounding','contains','holding','in','inside',
    'between','among','within','wrapped','around'
  ],
  deletion: [
    'without','losing','drops','removed','loses','cut','head off','beheaded',
    'tailless','endless','curtailed','trim','shortened'
  ]
};

function analyseCryptic() {
  const clue    = document.getElementById('crypticClue').value.trim();
  const pattern = document.getElementById('crypticPattern').value.trim();
  const len     = parseInt(document.getElementById('crypticLen').value) || null;
  const out     = document.getElementById('crypticResults');

  if (!clue) { out.innerHTML = '<p class="no-results">Enter a clue first.</p>'; return; }

  const words   = clue.toLowerCase().split(/\s+/);
  const found   = {};

  // Check each indicator list
  Object.entries(CRYPTIC_INDICATORS).forEach(([type, indicators]) => {
    const matches = indicators.filter(ind => {
      // Multi-word indicators
      if (ind.includes(' ')) return clue.toLowerCase().includes(ind);
      return words.includes(ind);
    });
    if (matches.length) found[type] = matches;
  });

  // Build output
  let html = '';

  if (Object.keys(found).length === 0) {
    html += `<div class="cryptic-card">
      <h3>🤔 Clue type unclear</h3>
      <p>No definitive indicator words detected. This could be a &amp;lit (all-in-one) clue or a straightforward definition clue.</p>
      <p style="margin-top:10px;">Tips: Look for the definition at the start or end of the clue. The rest is the wordplay component.</p>
    </div>`;
  } else {
    Object.entries(found).forEach(([type, matches]) => {
      html += buildCrypticCard(type, matches, clue, len);
    });
  }

  // If pattern/length given, also fetch word suggestions
  if (pattern || len) {
    out.innerHTML = html + '<div id="crypticWordResults">' + spinner() + '</div>';
    fetchPatternWords(pattern || (len ? '?'.repeat(len) : ''), len, 'crypticWordResults');
  } else {
    out.innerHTML = html;
  }
}

const CRYPTIC_TIPS = {
  anagram: 'The indicator word signals that letters need rearranging. Find all the letters to jumble (usually directly before or after the indicator).',
  reversal: 'A word (or phrase) is written backwards. Identify the reversal indicator, then the word to reverse.',
  hidden: 'The answer is hidden inside consecutive letters of the clue. Read across word boundaries.',
  double: 'Two separate definitions both clue the same answer — no wordplay, just two meanings.',
  homophone: 'The answer sounds like another word defined in the clue. Say the clue aloud.',
  charade: 'The answer is built up piece by piece (like a word sum). Break the clue into parts.',
  container: 'One element is placed inside another. Look for what goes "around" or "inside" what.',
  deletion: 'Remove one or more letters (head, tail, or interior) from a longer word to get the answer.'
};

function buildCrypticCard(type, matches, clue, len) {
  const labels = { anagram:'Anagram', reversal:'Reversal', hidden:'Hidden Word', double:'Double Definition', homophone:'Homophone', charade:'Charade', container:'Container', deletion:'Deletion' };
  return `
    <div class="cryptic-card">
      <h3>${crypticIcon(type)} ${labels[type] || type}</h3>
      <p><strong>Indicator word(s) detected:</strong> ${matches.map(m => `<span class="tag">${escHtml(m)}</span>`).join('')}</p>
      <p style="margin-top:10px;">${CRYPTIC_TIPS[type]}</p>
    </div>`;
}

function crypticIcon(type) {
  const icons = { anagram:'🔀', reversal:'↩️', hidden:'🔍', double:'📖', homophone:'🔊', charade:'🧩', container:'📦', deletion:'✂️' };
  return icons[type] || '❓';
}

async function fetchPatternWords(pattern, len, targetId) {
  try {
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(pattern || '*')}&max=50`;
    const res  = await fetch(url);
    const data = await res.json();
    let words = data.map(d => d.word);
    if (len) words = words.filter(w => w.length === len);
    if (words.length === 0) {
      document.getElementById(targetId).innerHTML = '<p class="no-results" style="margin-top:14px;">No matching words found for the pattern.</p>';
      return;
    }
    document.getElementById(targetId).innerHTML = `
      <div class="cryptic-card" style="margin-top:14px;">
        <h3>💡 Possible answers (${words.length})</h3>
        <div class="word-grid">${words.map(w => `<span class="word-chip" onclick="lookupWord('${escHtml(w)}')">${escHtml(w)}</span>`).join('')}</div>
      </div>`;
  } catch {
    document.getElementById(targetId).innerHTML = '<p class="no-results" style="margin-top:14px;">Could not fetch word suggestions.</p>';
  }
}

/* ======================================
   3. ANAGRAM SOLVER
   ====================================== */

document.getElementById('anagramSolve').addEventListener('click', solveAnagram);
document.getElementById('anagramInput').addEventListener('keydown', e => { if (e.key === 'Enter') solveAnagram(); });

async function solveAnagram() {
  const letters = document.getElementById('anagramInput').value.trim().toLowerCase().replace(/[^a-z]/g,'');
  const out     = document.getElementById('anagramResults');
  if (!letters) { out.innerHTML = '<p class="no-results">Enter letters to solve.</p>'; return; }
  if (letters.length > 15) { out.innerHTML = '<p class="no-results">Max 15 letters supported.</p>'; return; }

  out.innerHTML = spinner();
  try {
    // Datamuse anagram endpoint
    const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(letters)}&max=200`;
    const res  = await fetch(url);
    const data = await res.json();

    // Filter to true anagrams of sorted letters
    const sorted = letters.split('').sort().join('');
    const anagrams = data
      .map(d => d.word.toLowerCase().replace(/[^a-z]/g,''))
      .filter(w => w.split('').sort().join('') === sorted);

    // Also get sub-anagrams (words using subset of letters)
    const subWords = data
      .map(d => d.word.toLowerCase().replace(/[^a-z]/g,''))
      .filter(w => {
        if (w.split('').sort().join('') === sorted) return false; // already counted
        const pool = letters.split('');
        return w.split('').every(c => {
          const idx = pool.indexOf(c);
          if (idx === -1) return false;
          pool.splice(idx,1);
          return true;
        });
      });

    let html = '';
    if (anagrams.length) {
      html += `<div class="cryptic-card">
        <h3>✅ Full Anagrams (${anagrams.length})</h3>
        <div class="word-grid">${anagrams.map(w => `<span class="word-chip" onclick="lookupWord('${escHtml(w)}')">${escHtml(w)}</span>`).join('')}</div>
      </div>`;
    }
    if (subWords.length) {
      html += `<div class="cryptic-card" style="margin-top:14px;">
        <h3>🔡 Sub-Anagrams using these letters (${Math.min(subWords.length,80)})</h3>
        <div class="word-grid">${subWords.slice(0,80).map(w => `<span class="word-chip" onclick="lookupWord('${escHtml(w)}')">${escHtml(w)}</span>`).join('')}</div>
      </div>`;
    }
    if (!html) html = '<p class="no-results">No anagrams found for those letters.</p>';
    out.innerHTML = html;
  } catch {
    out.innerHTML = '<p class="no-results">Anagram search failed — check your internet connection.</p>';
  }
}

/* ======================================
   4. DICTIONARY LOOKUP  (Free Dictionary API)
   ====================================== */

document.getElementById('defineSearch').addEventListener('click', runDefine);
document.getElementById('defineInput').addEventListener('keydown', e => { if (e.key === 'Enter') runDefine(); });

async function runDefine() {
  const word = document.getElementById('defineInput').value.trim();
  const out  = document.getElementById('defineResults');
  if (!word) { out.innerHTML = '<p class="no-results">Enter a word to define.</p>'; return; }
  out.innerHTML = spinner();

  try {
    const res  = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (!res.ok) throw new Error('not_found');
    const data = await res.json();
    out.innerHTML = renderDefinitions(data);
  } catch (err) {
    if (err.message === 'not_found') {
      out.innerHTML = `<p class="no-results">No definition found for "<strong>${escHtml(word)}</strong>". Check spelling.</p>`;
    } else {
      out.innerHTML = '<p class="no-results">Lookup failed — check your internet connection.</p>';
    }
  }
}

function renderDefinitions(entries) {
  let html = '';
  entries.forEach(entry => {
    const phonetic = entry.phonetic || (entry.phonetics && entry.phonetics.find(p => p.text)?.text) || '';
    html += `<div class="def-card">
      <div class="def-word">${escHtml(entry.word)}</div>
      ${phonetic ? `<div class="def-phonetic">${escHtml(phonetic)}</div>` : ''}`;

    entry.meanings.forEach((m, mi) => {
      if (mi) html += '<hr class="def-sep">';
      html += `<span class="def-pos">${escHtml(m.partOfSpeech)}</span>`;
      m.definitions.slice(0,4).forEach(d => {
        html += `<p class="def-meaning">• ${escHtml(d.definition)}</p>`;
        if (d.example) html += `<p class="def-example">"${escHtml(d.example)}"</p>`;
      });
      if (m.synonyms && m.synonyms.length) {
        html += `<p style="color:#8a7a40;font-size:0.82rem;margin-top:8px;">Synonyms: ${m.synonyms.slice(0,8).map(s => `<span class="word-chip" style="font-size:0.78rem;padding:2px 8px;" onclick="lookupWord('${escHtml(s)}')">${escHtml(s)}</span>`).join(' ')}</p>`;
      }
    });
    html += '</div>';
  });
  return html;
}
