'use strict';
/* ============================================================================
   MATHS FEYNMAN TECHNIQUES — script.js
   Grade 10 | Sindh Board | Chapter 01: Sets
   Vanilla JS. No build step. No backend. All progress lives in localStorage.
   ============================================================================ */

/* ---------------------------------------------------------------------------
   STORAGE
--------------------------------------------------------------------------- */
const STORAGE_KEY = 'mft_state_v1';
const THEME_KEY = 'mft_theme';

function defaultState(){
  return {
    completedTopics: [],
    lastTopicId: null,
    mcqAnswers: {},
    mcqSubmitted: false,
    mcqResult: null,
    descriptiveAnswers: {},
    descriptiveChecks: {},
    descriptiveSubmitted: false
  };
}

let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  }catch(e){ return defaultState(); }
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}

/* ---------------------------------------------------------------------------
   ICONS — inline SVG (stroke style, 24×24). No fonts, no network: they always
   render, work offline, and take the colour of the surrounding text.
--------------------------------------------------------------------------- */
const ICONS = {
  'home': '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9"/>',
  'moon': '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
  'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
  'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  'graduation': '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 9v6"/>',
  'sigma': '<path d="M18 7V5H6l6.5 7L6 19h12v-2"/>',
  'venn': '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
  'clipboard-check': '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  'pen': '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  'file-text': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  'flag': '<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>',
  'trophy': '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4.1 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  'thumbs-up': '<path d="M7 10v11"/><path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.5l-1.6 6.4a2 2 0 0 1-1.9 1.5H7V10l4.3-7a1.9 1.9 0 0 1 3.7 1z"/><path d="M3 10h4v11H3z"/>',
  'trending-up': '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  'book-open': '<path d="M2 5.5A1.5 1.5 0 0 1 3.5 4H9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5h-6A1.5 1.5 0 0 1 2 16z"/><path d="M22 5.5A1.5 1.5 0 0 0 20.5 4H15a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5h6a1.5 1.5 0 0 0 1.5-1.5z"/>',
  'alert-triangle': '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  'lightbulb': '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3h6c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/>',
  'message': '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6A8 8 0 1 1 21 12z"/>',
  'calculator': '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/>',
  'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z"/>',
  'list-ordered': '<path d="M10 6h11M10 12h11M10 18h11"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
  'help-circle': '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4M12 17h.01"/>',
  'sparkles': '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/>',
  'star': '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1z"/>',
  'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  'external-link': '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  'zap': '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  'play': '<path d="m7 4 13 8-13 8z"/>',
  'bookmark': '<path d="M6 3h12v18l-6-4-6 4z"/>',
  'tag': '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1"/>',
  'list-checks': '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8M13 12h8M13 18h8"/>',
  'list': '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
  'download': '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  'edit': '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'
};
function ic(name, cls){
  return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
}
function hydrateIcons(root){
  (root || document).querySelectorAll('[data-ic]').forEach(function(n){
    n.innerHTML = ic(n.getAttribute('data-ic'));
  });
}

/* ---------------------------------------------------------------------------
   THEME
--------------------------------------------------------------------------- */
function loadTheme(){ try{ return localStorage.getItem(THEME_KEY) || 'dark'; }catch(e){ return 'dark'; } }
function applyTheme(theme){
  document.body.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('theme-icon');
  if(themeIcon) themeIcon.innerHTML = ic(theme === 'dark' ? 'moon' : 'sun');
  const metaTheme = document.getElementById('meta-theme-color');
  if(metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#070c18' : '#eef3fa');
  try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
}
function toggleTheme(){
  const current = document.body.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ---------------------------------------------------------------------------
   TOAST
--------------------------------------------------------------------------- */
let toastTimer = null;
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.innerHTML = ic('check-circle') + '<span>' + esc(msg) + '</span>';
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('is-show'); }, 1500);
}

/* ---------------------------------------------------------------------------
   NAVIGATION
--------------------------------------------------------------------------- */
const SCREENS = ['home','chapterStart','topicList','topicLearning','formulaSheet','visualLearning','quickNotes','mcqTest','mcqResults','mistakeAnalysis','descriptive','descriptiveResults','chapterComplete'];

const SCREEN_ID = {
  home:'screen-home', chapterStart:'screen-chapter-start', topicList:'screen-topic-list',
  topicLearning:'screen-topic-learning', formulaSheet:'screen-formula-sheet', visualLearning:'screen-visual-learning',
  quickNotes:'screen-quick-notes', mcqTest:'screen-mcq-test', mcqResults:'screen-mcq-results',
  mistakeAnalysis:'screen-mistake-analysis', descriptive:'screen-descriptive', descriptiveResults:'screen-descriptive-results',
  chapterComplete:'screen-chapter-complete'
};

const SCREEN_TITLE = {
  home:['Maths Feynman','Chapter 01 · Sets'], chapterStart:['Chapter 01','Sets'], topicList:['Topic List','27 Topics'],
  topicLearning:['Topic','Chapter 01 · Sets'], formulaSheet:['Formula Sheet','Chapter 01 · Sets'], visualLearning:['Visual Learning','Chapter 01 · Sets'],
  quickNotes:['Quick Notes','Chapter 01 · Sets'], mcqTest:['Chapter Quiz','162 MCQs'], mcqResults:['Result','Chapter 01 · Sets'],
  mistakeAnalysis:['Mistake Analysis','Chapter 01 · Sets'], descriptive:['Descriptive Qs','Chapter 01 · Sets'], descriptiveResults:['Final Evaluation','Chapter 01 · Sets'],
  chapterComplete:['Chapter Complete','Chapter 01 · Sets']
};

const PARENT_MAP = {
  home:null, chapterStart:'home', topicList:'chapterStart', topicLearning:'topicList',
  formulaSheet:'home', visualLearning:'home', quickNotes:'home', mcqTest:'chapterStart',
  mcqResults:'mcqTest', mistakeAnalysis:'mcqResults', descriptive:'mcqResults', descriptiveResults:'descriptive',
  chapterComplete:'topicLearning'
};

let currentScreen = 'home';
let navHistory = [];
let currentTopicId = null;
let currentMcqPart = 0;
let currentMcqIndexInPart = 0;

function navigateTo(screen, opts){
  opts = opts || {};
  if(currentScreen && currentScreen !== screen){ navHistory.push(currentScreen); }
  currentScreen = screen;
  showScreenDOM(screen);
  renderScreen(screen, opts);
  window.scrollTo(0,0);
}

function goBack(){
  let target = navHistory.pop();
  if(!target) target = PARENT_MAP[currentScreen] || 'home';
  currentScreen = target;
  showScreenDOM(target);
  renderScreen(target, {});
  window.scrollTo(0,0);
}

function goHome(){
  navHistory = [];
  currentScreen = 'home';
  showScreenDOM('home');
  renderScreen('home', {});
  window.scrollTo(0,0);
}

function showScreenDOM(screen){
  SCREENS.forEach(function(s){
    const el = document.getElementById(SCREEN_ID[s]);
    if(el) el.classList.toggle('is-active', s === screen);
  });
  const titlePair = SCREEN_TITLE[screen] || ['Maths Feynman','Chapter 01 · Sets'];
  const titleEl = document.getElementById('topbar-title');
  const subEl = document.getElementById('topbar-subtitle');
  if(titleEl) titleEl.textContent = titlePair[0];
  if(subEl) subEl.textContent = titlePair[1];
  const backBtn = document.getElementById('btn-back');
  if(backBtn) backBtn.classList.toggle('is-hidden', screen === 'home');
  const logo = document.getElementById('logo-mark');
  if(logo) logo.classList.toggle('is-hidden', screen !== 'home');
  document.querySelectorAll('.nav-item').forEach(function(n){
    const on = n.getAttribute('data-tab') === TAB_OF[screen];
    n.classList.toggle('is-active', on);
    if(on) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current');
  });
}
const TAB_OF = { home:'home', chapterStart:'home', topicList:'learn', topicLearning:'learn', chapterComplete:'learn',
  formulaSheet:'formula', quickNotes:'formula', visualLearning:'visual',
  mcqTest:'quiz', mcqResults:'quiz', mistakeAnalysis:'quiz', descriptive:'quiz', descriptiveResults:'quiz' };

function renderScreen(screen, opts){
  opts = opts || {};
  if(screen === 'home') renderHome();
  else if(screen === 'chapterStart') renderChapterStart();
  else if(screen === 'topicList') renderTopicList('');
  else if(screen === 'topicLearning') renderTopicLearning(opts.topicId || currentTopicId || firstIncompleteTopicId());
  else if(screen === 'formulaSheet') renderFormulaSheet();
  else if(screen === 'visualLearning') renderVisualLearning();
  else if(screen === 'quickNotes') renderQuickNotes();
  else if(screen === 'mcqTest') renderMCQTest(opts.part, opts.qIndex);
  else if(screen === 'mcqResults') renderMCQResults();
  else if(screen === 'mistakeAnalysis') renderMistakeAnalysis();
  else if(screen === 'descriptive') renderDescriptive();
  else if(screen === 'descriptiveResults') renderDescriptiveResults();
}

/* ---------------------------------------------------------------------------
   SMALL HELPERS
--------------------------------------------------------------------------- */
function esc(str){
  return String(str).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function el(id){ return document.getElementById(id); }
function setHTML(id, html){ const node = el(id); if(node) node.innerHTML = html; }

/* ---------------------------------------------------------------------------
   SVG DIAGRAM GENERATORS
   All inline (no <img>, nothing to ever fail to load), theme-aware via CSS
   custom properties, so they repaint automatically on dark/light toggle.
--------------------------------------------------------------------------- */
let _svgUid = 0;
function nextSvgId(prefix){ _svgUid += 1; return prefix + _svgUid; }
function svgWrap(inner, viewBox){
  viewBox = viewBox || '0 0 320 200';
  return '<svg viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;display:block;">' + inner + '</svg>';
}

/* Two-circle Venn diagram base. shade: none | union | intersection | aOnly | bOnly */
function svgVenn2(opts){
  opts = opts || {};
  const shade = opts.shade || 'none';
  const labelA = opts.labelA || 'A';
  const labelB = opts.labelB || 'B';
  const showU = opts.showU !== false;
  const idM = nextSvgId('mask');
  const idC = nextSvgId('clip');
  const cx1 = 120, cx2 = 198, cy = 106, r = 64;
  const rectX = 14, rectY = 16, rectW = 292, rectH = 172;

  let defs = '<defs>';
  let shade1 = '';
  if(shade === 'union'){
    shade1 += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="var(--accent)" fill-opacity="0.36"></circle>';
    shade1 += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="var(--accent)" fill-opacity="0.36"></circle>';
  } else if(shade === 'intersection'){
    defs += '<clipPath id="'+idC+'"><circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'"></circle></clipPath>';
    shade1 += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="var(--accent)" fill-opacity="0.55" clip-path="url(#'+idC+')"></circle>';
  } else if(shade === 'aOnly'){
    defs += '<mask id="'+idM+'"><rect x="0" y="0" width="320" height="200" fill="white"></rect><circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="black"></circle></mask>';
    shade1 += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="var(--accent)" fill-opacity="0.5" mask="url(#'+idM+')"></circle>';
  } else if(shade === 'bOnly'){
    defs += '<mask id="'+idM+'"><rect x="0" y="0" width="320" height="200" fill="white"></rect><circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="black"></circle></mask>';
    shade1 += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="var(--accent-2)" fill-opacity="0.5" mask="url(#'+idM+')"></circle>';
  }
  defs += '</defs>';

  let out = defs;
  if(showU){
    out += '<rect x="'+rectX+'" y="'+rectY+'" width="'+rectW+'" height="'+rectH+'" rx="12" fill="none" stroke="var(--border-strong)" stroke-width="2"></rect>';
    out += '<text x="'+(rectX+10)+'" y="'+(rectY+20)+'" font-size="13" font-weight="800" fill="var(--text-3)">U</text>';
  }
  out += shade1;
  out += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--accent)" stroke-width="2.5"></circle>';
  out += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--accent-2)" stroke-width="2.5"></circle>';
  out += '<text x="'+(cx1-52)+'" y="'+(cy-42)+'" font-size="15" font-weight="800" fill="var(--accent)">'+esc(labelA)+'</text>';
  out += '<text x="'+(cx2+40)+'" y="'+(cy-42)+'" font-size="15" font-weight="800" fill="var(--accent-2)">'+esc(labelB)+'</text>';
  return svgWrap(out);
}

/* Single set as a labelled blob inside U, with a few sample elements plotted */
function svgSetBasic(opts){
  opts = opts || {};
  const elements = opts.elements || ['2','4','6','8'];
  const label = opts.label || 'A';
  const cx = 160, cy = 112, r = 58;
  let dots = '';
  const n = elements.length;
  elements.forEach(function(item, i){
    const angle = (Math.PI * 2 / n) * i - Math.PI/2;
    const ex = cx + Math.cos(angle) * 32;
    const ey = cy + Math.sin(angle) * 26;
    dots += '<circle cx="'+ex+'" cy="'+ey+'" r="3.4" fill="var(--text-1)"></circle>';
    dots += '<text x="'+(ex+7)+'" y="'+(ey+4)+'" font-size="12" font-weight="700" fill="var(--text-1)">'+esc(item)+'</text>';
  });
  let out = '<rect x="14" y="16" width="292" height="172" rx="12" fill="none" stroke="var(--border-strong)" stroke-width="2"></rect>';
  out += '<text x="24" y="36" font-size="13" font-weight="800" fill="var(--text-3)">U</text>';
  out += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="var(--accent)" fill-opacity="0.14" stroke="var(--accent)" stroke-width="2.5"></circle>';
  out += '<text x="'+(cx-8)+'" y="'+(cy-r-10)+'" font-size="15" font-weight="800" fill="var(--accent)">'+esc(label)+'</text>';
  out += dots;
  return svgWrap(out);
}

/* Nested circles for subset A ⊆ B */
function svgSubset(opts){
  opts = opts || {};
  const labelA = opts.labelA || 'A';
  const labelB = opts.labelB || 'B';
  const cx = 160, cy = 108;
  let out = '<rect x="14" y="16" width="292" height="172" rx="12" fill="none" stroke="var(--border-strong)" stroke-width="2"></rect>';
  out += '<text x="24" y="36" font-size="13" font-weight="800" fill="var(--text-3)">U</text>';
  out += '<circle cx="'+cx+'" cy="'+cy+'" r="72" fill="var(--accent-2)" fill-opacity="0.10" stroke="var(--accent-2)" stroke-width="2.5"></circle>';
  out += '<circle cx="'+cx+'" cy="'+(cy+8)+'" r="36" fill="var(--accent)" fill-opacity="0.32" stroke="var(--accent)" stroke-width="2.5"></circle>';
  out += '<text x="'+(cx-6)+'" y="'+(cy+13)+'" font-size="15" font-weight="800" fill="var(--accent)">'+esc(labelA)+'</text>';
  out += '<text x="'+(cx-64)+'" y="'+(cy-52)+'" font-size="15" font-weight="800" fill="var(--accent-2)">'+esc(labelB)+'</text>';
  return svgWrap(out);
}

/* Complement: rectangle U shaded except inside circle A */
function svgComplement(opts){
  opts = opts || {};
  const label = opts.label || 'A';
  const idM = nextSvgId('mask');
  const cx = 160, cy = 108, r = 58;
  const rectX = 14, rectY = 16, rectW = 292, rectH = 172;
  let out = '<defs><mask id="'+idM+'"><rect x="0" y="0" width="320" height="200" fill="white"></rect><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="black"></circle></mask></defs>';
  out += '<rect x="'+rectX+'" y="'+rectY+'" width="'+rectW+'" height="'+rectH+'" rx="12" fill="var(--accent)" fill-opacity="0.30" mask="url(#'+idM+')"></rect>';
  out += '<rect x="'+rectX+'" y="'+rectY+'" width="'+rectW+'" height="'+rectH+'" rx="12" fill="none" stroke="var(--border-strong)" stroke-width="2"></rect>';
  out += '<text x="'+(rectX+10)+'" y="'+(rectY+20)+'" font-size="13" font-weight="800" fill="var(--text-3)">U</text>';
  out += '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--accent-2)" stroke-width="2.5"></circle>';
  out += '<text x="'+(cx-8)+'" y="'+(cy+5)+'" font-size="15" font-weight="800" fill="var(--accent-2)">'+esc(label)+'</text>';
  out += '<text x="'+(rectX+205)+'" y="'+(rectY+30)+'" font-size="12" font-weight="700" fill="var(--accent)">'+esc(label)+"'</text>";
  return svgWrap(out);
}

/* De Morgan's — two small side-by-side Venn pairs. Both panels of a pair
   render the SAME shaded region via two different constructions — that
   shared shape IS the proof that the two sides of the law are equal. */
function svgDeMorgan(opts){
  opts = opts || {};
  const which = opts.which || 'union'; // union -> (A∪B)'=A'∩B'   |  intersection -> (A∩B)'=A'∪B'
  function mini(mode, title, x0){
    const idM = nextSvgId('mask'), idC = nextSvgId('clip');
    const cx1 = x0+34, cx2 = x0+70, cy = 84, r = 30;
    const bx = x0-14, by = 14, bw = 150, bh = 130;
    let defs = '<defs>';
    let shape = '';
    if(mode === 'outsideBoth'){
      /* visible = box minus circle1 minus circle2  →  outside both circles */
      defs += '<mask id="'+idM+'"><rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" fill="white"></rect><circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="black"></circle><circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="black"></circle></mask>';
      shape += '<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="10" fill="var(--accent)" fill-opacity="0.34" mask="url(#'+idM+')"></rect>';
    } else if(mode === 'exceptLens'){
      /* visible = box minus (circle1 ∩ circle2)  →  everywhere except the overlap lens */
      defs += '<clipPath id="'+idC+'"><circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'"></circle></clipPath>';
      defs += '<mask id="'+idM+'"><rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" fill="white"></rect><circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="black" clip-path="url(#'+idC+')"></circle></mask>';
      shape += '<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="10" fill="var(--accent)" fill-opacity="0.34" mask="url(#'+idM+')"></rect>';
    }
    defs += '</defs>';
    let out = defs;
    out += '<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="10" fill="none" stroke="var(--border-strong)" stroke-width="1.5"></rect>';
    out += shape;
    out += '<circle cx="'+cx1+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--accent)" stroke-width="2"></circle>';
    out += '<circle cx="'+cx2+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--accent-2)" stroke-width="2"></circle>';
    out += '<text x="'+(x0-6)+'" y="160" font-size="12" font-weight="700" fill="var(--text-2)" text-anchor="middle">'+title+'</text>';
    return out;
  }
  const mode = which === 'union' ? 'outsideBoth' : 'exceptLens';
  const leftTitle = which === 'union' ? "(A ∪ B)'" : "(A ∩ B)'";
  const rightTitle = which === 'union' ? "A' ∩ B'" : "A' ∪ B'";
  let out = mini(mode, leftTitle, 20);
  out += '<text x="160" y="90" font-size="20" font-weight="800" fill="var(--text-2)" text-anchor="middle">=</text>';
  out += mini(mode, rightTitle, 176);
  return svgWrap(out, '0 0 320 180');
}

/* ---------------------------------------------------------------------------
   DATA: TOPICS  (Chapter 01 — Sets, all 27 topics)
--------------------------------------------------------------------------- */
const topics = [
{
  id: 1,
  title: "Sets",
  definition: "A set is a well-defined collection of distinct objects, called the elements or members of the set.",
  feynman: `Simple words mein, set ka matlab hai aisi collection jisme objects clearly decide kiye ja sakte hain — koi confusion nahi honi chahiye ke koi cheez andar hai ya nahi. Jaise "1, 2, 3, 4, 5 ke numbers" ek set hai kyunke har number clearly pata hai. Lekin "class ke lambe students" set NAHI hai, kyunke "lamba" kis se zyada hai — yeh clear nahi hai. Set banane ke liye rule bilkul saaf hona chahiye.`,
  mathExample: `A = {1, 2, 3, 4, 5} — yeh ek set hai jiske 5 elements hain. Hum likhte hain 3 ∈ A (3, A ka member hai) aur 7 ∉ A (7, A ka member nahi hai).`,
  realLife: "Cricket team ke 11 players ka group ek set hai — har player clearly decide hai kaun team mein hai. Ek grocery list bhi set jaisi hoti hai jab har item clearly likha ho.",
  steps: [
    "Pehle dekho objects kya hain jinhe group karna hai.",
    "Check karo condition well-defined hai ya nahi (koi confusion to nahi).",
    "Elements ko { } braces ke andar likho.",
    "Set ko ek capital letter (A, B, C...) se naam do."
  ],
  mistakes: [
    "\"Achay students\" ya \"lambay log\" jaisi vague cheezon ko set samajhna — yeh well-defined nahi hain.",
    "Set mein element ko baar baar likhna, jaise {1,1,2} — sets mein repetition allowed nahi.",
    "Order ko important samajhna — {1,2,3} aur {3,1,2} same set hain."
  ],
  memoryTrick: "SET yaad rakho: Specific, Exact, Together — cheezein specific aur exact honi chahiye, tab hi set banega.",
  selfCheck: "Kya \"Pakistan ke best cricketers\" ek set hai? Wajah batao.",
  selfCheckAnswer: "Nahi, yeh set nahi hai — \"best\" ka matlab har insaan ke liye alag ho sakta hai, isliye yeh well-defined nahi hai."
},
{
  id: 2,
  title: "Representation of Sets",
  definition: "Representation of a set refers to the ways in which the elements of a set can be written or described.",
  feynman: `Ek set ko batane ke do main tareeqe hain: ya to elements ko seedha list kar do, ya phir ek rule/condition bata do jisse elements decide hote hain. Jaise agar dost ko batana ho ke tumhare paas kaunse fruits hain, to ya to naam le lo (apple, banana, mango), ya bol do "jo bhi fruits fridge mein hain".`,
  mathExample: `A = {2, 4, 6, 8} (Roster form) — yehi set is tarah bhi likha ja sakta hai: A = {x | x is an even number, 2 ≤ x ≤ 8} (Set-Builder form). Dono ek hi set ko represent karte hain.`,
  realLife: "Recipe ki ingredient list ek Roster form jaisi hai (sab kuch naam se likha). \"Kitchen ke saare spices\" ek Set-Builder form jaisi baat hai (rule based).",
  steps: [
    "Dekho elements finite aur countable hain ya nahi.",
    "Agar list chhoti hai, Roster form use karo.",
    "Agar pattern ya rule follow ho raha hai (ya infinite hai), Set-Builder form use karo.",
    "Dono tareeqon ko ek sath mix mat karo."
  ],
  mistakes: [
    "Roster aur Set-Builder notation ko ek hi set mein mix kar dena.",
    "Braces { } likhna bhool jana.",
    "Set-Builder mein condition clearly na likhna."
  ],
  memoryTrick: "\"List it, OR Describe it\" — ya to gin kar batao, ya rule bata do.",
  selfCheck: "6 se chhote natural numbers ko Roster aur Set-Builder dono forms mein likho.",
  selfCheckAnswer: "Roster: {1,2,3,4,5}. Set-Builder: {x | x ∈ N, x < 6}."
},
{
  id: 3,
  title: "Roster / Tabular Form",
  definition: "In roster or tabular form, all the elements of a set are listed inside curly brackets and separated by commas.",
  feynman: `Roster form matlab ek guest list banana — sab naam comma laga kar seedha likh dena. Koi rule nahi batana, bas jo bhi elements hain unhe ek ek karke likh do braces { } ke andar.`,
  mathExample: `B = {a, e, i, o, u} — English ke vowels roster form mein. Ya C = {2, 3, 5, 7} — 10 se chhote prime numbers.`,
  realLife: "Class ka attendance register jisme har student ka naam seedha likha hota hai — yeh Roster form jaisa hai.",
  steps: [
    "Har element ko identify karo.",
    "Braces { } khol lo.",
    "Elements ko comma se separate karke likho.",
    "Koi element repeat mat karo."
  ],
  mistakes: [
    "Ek element ko do baar likhna, jaise {1, 1, 2, 3} — galat, sahi hai {1,2,3}.",
    "Commas lagana bhool jana.",
    "Order ko lekar pareshan hona — order matter nahi karta."
  ],
  memoryTrick: "Roster = Roll call — har naam sirf ek baar pukaro.",
  selfCheck: "Hafte ke un dinon ka set Roster form mein likho jo \"S\" se shuru hote hain.",
  selfCheckAnswer: "{Sunday, Saturday}"
},
{
  id: 4,
  title: "Set-Builder Form",
  definition: "In set-builder form, a set is described by stating a property or rule that all its elements must satisfy, written as {x | condition on x}.",
  feynman: `Jab list bohot lambi ho ya infinite ho, to har element likhna mushkil hota hai — is liye hum ek RULE bata dete hain, aur woh rule follow karne wali har cheez us set ka member ban jati hai. "x aisa hona chahiye ke..." — yehi Set-Builder ka idea hai.`,
  mathExample: `D = {x | x ∈ N, x < 10} — matlab "wo saare x jo Natural numbers hain aur 10 se chhote hain" = {1,2,3,4,5,6,7,8,9}.`,
  realLife: "\"Class ke woh students jinke marks 90% se zyada hain\" — yeh ek rule hai, list nahi. Har naya student jo is rule pe fit baithe, set mein aa jayega.",
  steps: [
    "Ek variable choose karo, jaise x.",
    "Bata do x kis universe se hai (N, Z, W, etc).",
    "Condition/rule likho jo x ko follow karna hai.",
    "{x | condition} ki shape mein likh do."
  ],
  mistakes: [
    "Yeh batana bhool jana ke x kahan se belong karta hai (N, Z, etc).",
    "Condition ko unclear ya ambiguous rakhna.",
    "| aur : dono use ho sakte hain, bas ek hi style consistent rakho."
  ],
  memoryTrick: "Builder = Rule Book, naam ki list nahi.",
  selfCheck: "{2, 4, 6, 8, 10} ko Set-Builder form mein convert karo.",
  selfCheckAnswer: "{x | x is an even number, 2 ≤ x ≤ 10}"
},
{
  id: 5,
  title: "Types of Sets",
  definition: "Sets are classified into different types based on the number of elements they contain and their relationship with other sets.",
  feynman: `Jaise cheezon ko categories mein baant-te hain, waise hi sets ko bhi types mein baanta jata hai — kuch khaali hote hain, kuch mein sirf ek cheez, kuch countable, kuch kabhi khatam na hone wale. Yeh classification isliye zaroori hai kyunke har type ke apne rules hote hain.`,
  mathExample: `{} → Empty Set, {5} → Singleton Set, {1,2,3} → Finite Set, N = {1,2,3,...} → Infinite Set.`,
  realLife: "Jaise gaadiyon ko bikes, cars aur trucks mein classify karte hain taake sahi tareeqe se use ho sakein — waise hi sets classify karne se sahi rule apply karna aasan ho jata hai.",
  steps: [
    "Pehle elements ki ginti karo.",
    "0 elements → Empty Set. 1 element → Singleton Set.",
    "Countable/limited elements → Finite Set. Kabhi na khatam ho → Infinite Set.",
    "Phir dekho set kisi doosray set ke andar fit hota hai (Subset) ya sab kuch cover karta hai (Universal)."
  ],
  mistakes: [
    "Yeh sochna ke saare sets finite hote hain.",
    "Khaali set {} ko {0} (jisme ek element '0' hai) samajh lena."
  ],
  memoryTrick: "Pehle GINO, phir NAAM do.",
  selfCheck: "{}, {5}, {1,2,3}, aur N — inhe unke types se match karo.",
  selfCheckAnswer: "{} = Empty, {5} = Singleton, {1,2,3} = Finite, N = Infinite."
},
{
  id: 6,
  title: "Empty / Null Set",
  definition: "An empty (or null) set is a set that has no elements at all. It is denoted by { } or the symbol ∅.",
  feynman: `Socho ek khaali dabba — dabba (set) to exist karta hai, lekin uske andar kuch bhi nahi hai. Yehi Empty Set hai: ek set jisme zero elements hon.`,
  mathExample: `E = {x | x is an odd number divisible by 2} = { } — kyunke koi bhi odd number 2 se divisible nahi hota, is liye yeh set khaali hai.`,
  realLife: "\"Class ke woh students jinki height 10 feet hai\" — aisa koi student nahi hoga, is liye yeh set khaali (empty) hai.",
  steps: [
    "Condition ko dhyan se dekho.",
    "Check karo koi element us condition ko satisfy karta hai ya nahi.",
    "Agar KOI bhi element satisfy nahi karta, to yeh Empty Set hai.",
    "Likho { } ya ∅ se."
  ],
  mistakes: [
    "{∅} ko empty set samajhna — yeh GALAT hai! {∅} ek Singleton Set hai jiska ek element khud ∅ symbol hai.",
    "{0} ko empty set samajhna — {0} mein ek element '0' hai, is liye yeh bhi singleton hai, empty nahi."
  ],
  memoryTrick: "Empty ≠ Zero. Zero ek number hai, Empty ka matlab hai koi bhi number nahi.",
  selfCheck: "Kya {0} ek empty set hai?",
  selfCheckAnswer: "Nahi. {0} mein ek element hai (number 0), is liye yeh singleton set hai, empty nahi."
},
{
  id: 7,
  title: "Singleton Set",
  definition: "A singleton set is a set that contains exactly one element.",
  feynman: `Jaise koi dost party mein akela aaya ho — waise hi Singleton Set mein sirf EK element hota hai, na zyada na kam.`,
  mathExample: `A = {5} ek singleton set hai. B = {x | x is the capital of Pakistan} = {Islamabad} bhi singleton hai.`,
  realLife: "\"Class ka sabse lamba student\" — sirf ek hi jawab hoga, is liye yeh ek singleton set banata hai.",
  steps: [
    "Elements ginno.",
    "Agar exactly 1 element hai, to yeh Singleton Set hai.",
    "Braces ke andar sirf woh ek element likho."
  ],
  mistakes: [
    "{5} (jisme element 5 hai) ko sirf 5 (number) samajh lena — yeh dono cheezein different hain.",
    "{0} ko empty samajhna — yeh singleton hai, kyunke ismein ek element '0' hai."
  ],
  memoryTrick: "Singleton = Single One.",
  selfCheck: "Even prime numbers ka set likho.",
  selfCheckAnswer: "{2} — kyunke 2 hi wo aikla even number hai jo prime bhi hai."
},
{
  id: 8,
  title: "Finite Set",
  definition: "A finite set is a set whose elements can be completely counted, i.e., it has a limited, fixed number of elements.",
  feynman: `Jin cheezon ko ginte ginte end tak pahunch sakte ho, woh Finite Set hai — jaise class ke students, unki ginti kabhi na kabhi khatam ho jayegi.`,
  mathExample: `A = {1, 2, 3, 4, 5} — is set mein n(A) = 5 elements hain, aur ginti khatam ho jati hai.`,
  realLife: "Hafte ke dinon ka set {Monday, ..., Sunday} finite hai — sirf 7 din hain.",
  steps: [
    "Elements ginne ki koshish karo.",
    "Agar ginti kisi point par khatam ho jaye, set finite hai.",
    "Yaad rakho: bahut bada number bhi finite ho sakta hai, jab tak woh ek fixed number hai."
  ],
  mistakes: [
    "Empty set {} ko finite nahi samajhna — Empty set BHI finite hai, jiska count 0 hai.",
    "Bahut badi (lekin fixed) ginti ko infinite samajh lena, jaise Pakistan ki population."
  ],
  memoryTrick: "Finite = Finish-able — ginti finish ho sakti hai.",
  selfCheck: "Kya tumhari Math ki kitab ke saare pages ka set finite hai ya infinite?",
  selfCheckAnswer: "Finite — kitab mein fixed number of pages hote hain, jitne bhi hon."
},
{
  id: 9,
  title: "Infinite Set",
  definition: "An infinite set is a set whose elements cannot be completely counted because they continue without end.",
  feynman: `Jo cheez gin-te gin-te kabhi khatam hi nahi hoti, woh Infinite Set hai — jaise Natural Numbers 1, 2, 3, 4... yeh kabhi rukte nahi.`,
  mathExample: `N = {1, 2, 3, 4, ...} — yeh natural numbers ka set hai jo hamesha aage badhta rehta hai, isliye infinite hai.`,
  realLife: "Ek seedhi line pe points ka set infinite hota hai — chahe kitni bhi choti line ho, us par infinite points fit ho sakte hain.",
  steps: [
    "Ginne ki koshish karo.",
    "Agar ginti kabhi na khatam ho, ya \"...\" pattern nazar aaye, to yeh Infinite Set hai.",
    "Set-builder form ya \"...\" se represent karo."
  ],
  mistakes: [
    "\"Bohot bada\" number hamesha infinite nahi hota — ek bada fixed number bhi finite hi hota hai.",
    "Yeh sochna ke infinite sets likhe nahi ja sakte — inhe \"...\" ya set-builder se represent kiya ja sakta hai."
  ],
  memoryTrick: "Infinite = In-finish-able.",
  selfCheck: "5 ke multiples ka set finite hai ya infinite?",
  selfCheckAnswer: "Infinite — {5, 10, 15, 20, ...} hamesha aage badhta rehta hai."
},
{
  id: 10,
  title: "Subset",
  definition: "A set A is called a subset of set B if every element of A is also an element of B. It is written as A ⊆ B.",
  feynman: `Socho ek chhota group jo bade group ke andar poori tarah fit ho jaye — chhote group ka har member pehle se bade group mein bhi maujood hai. Yehi Subset hai.`,
  mathExample: `A = {1, 2}, B = {1, 2, 3, 4} → A ⊆ B, kyunke A ke dono elements (1 aur 2) B mein bhi hain.`,
  realLife: "\"Cricket khelne waale students\" pooray class ka Subset hain, kyunke woh sab class mein bhi shamil hain.",
  steps: [
    "A ka har element check karo.",
    "Dekho kya woh B mein bhi maujood hai.",
    "Agar A ke SAARE elements B mein hain, to A ⊆ B."
  ],
  mistakes: [
    "Yeh sochna ke Subset ka matlab hamesha \"chhota\" hona hai — A ⊆ A bhi sahi hai (set khud ka bhi subset hota hai).",
    "Bhool jana ke Empty Set { } har set ka subset hota hai."
  ],
  memoryTrick: "⊆ = 'fits inside or matches' — chhota dabba bade dabbe ke andar fit ho jata hai (ya barabar hota hai).",
  selfCheck: "Kya {1,2,3} ⊆ {1,2,3}? Kya {} ⊆ {5,6}?",
  selfCheckAnswer: "Dono \"haan\" hain — har set khud ka subset hai, aur Empty Set har set ka subset hota hai."
},
{
  id: 11,
  title: "Proper Subset",
  definition: "A is called a proper subset of B if A ⊆ B and A ≠ B — that is, B contains at least one element which is not in A. It is written as A ⊂ B.",
  feynman: `Yeh subset jaisa hi hai, lekin ek extra condition ke saath: bada group mein kam se kam ek aisi cheez honi chahiye jo chhotay group mein NA ho — matlab poora match nahi hona chahiye.`,
  mathExample: `A = {1, 2}, B = {1, 2, 3} → A ⊂ B, kyunke B mein '3' hai jo A mein nahi hai. Lekin agar A = B, to A ⊂ B GALAT hoga.`,
  realLife: "Agar class mein kam se kam ek student aisa hai jo cricket nahi khelta, tabhi \"cricket players\" pooray class ka Proper Subset kehlayega.",
  steps: [
    "Pehle check karo A ⊆ B hai ya nahi.",
    "Phir check karo A aur B barabar to nahi.",
    "Agar dono conditions sahi hain, to A ⊂ B (Proper Subset)."
  ],
  mistakes: [
    "⊂ aur ⊆ ko bina soche interchange kar dena.",
    "A ⊂ A likhna — yeh galat hai, koi set khud ka Proper Subset nahi ho sakta."
  ],
  memoryTrick: "Proper = strictly chhota, kuch to missing hai.",
  selfCheck: "Kya {1,2} apna proper subset hai, agar B = {1,2}?",
  selfCheckAnswer: "Nahi — jab A = B ho, to A proper subset nahi ban sakta, kyunke koi element missing nahi hai."
},
{
  id: 12,
  title: "Improper Subset",
  definition: "An improper subset of a set is the subset that is exactly equal to the set itself — i.e., A is an improper subset of B when A = B.",
  feynman: `Jab chhota group aur bada group EXACTLY same ho jayein — koi farak na ho — to usay Improper Subset kehte hain. Yeh koi galti nahi hai, bas ek special case hai jab dono sets barabar hon.`,
  mathExample: `A = {1, 2, 3}, B = {1, 2, 3} → A, B ka Improper Subset hai, kyunke A = B.`,
  realLife: "Agar CLASS ke SAARE students ne homework submit kiya ho — to \"homework submit karne walon\" ka group aur \"pooray class\" ka group EXACTLY same ho jate hain.",
  steps: [
    "Check karo A aur B exactly equal hain ya nahi.",
    "Agar A = B, to yeh relationship Improper Subset kehlata hai."
  ],
  mistakes: [
    "\"Improper\" ko \"galat/invalid\" samajh lena — yeh sirf ek naming term hai jab A = B ho.",
    "Proper aur Improper Subset ko confuse kar dena — yeh dono opposite conditions hain."
  ],
  memoryTrick: "Improper = 'main hi poora set hoon' (A = B).",
  selfCheck: "Har set apne aap ka ______ subset hota hai (blank fill karo).",
  selfCheckAnswer: "Improper — har set khud ka improper subset hota hai, kyunke A hamesha A ke barabar hota hai."
},
{
  id: 13,
  title: "Universal Set",
  definition: "The universal set is the set that contains all the elements under consideration for a particular discussion. It is usually denoted by U.",
  feynman: `Socho ek bada frame ya background jiske andar baaki saare sets exist karte hain — sab kuch usi ke andar hota hai. Yeh Universal Set hai — us particular problem ka \"poora world\".`,
  mathExample: `Agar hum 1 se 10 tak numbers discuss kar rahe hain, to U = {1,2,...,10}, aur is discussion ke baaki saare sets U ke subsets honge.`,
  realLife: "Agar U = \"school ke saare students\", to \"Class 10 ke students\" is U ka ek subset honge.",
  steps: [
    "Pehle problem ka context samjho.",
    "Woh saari cheezein jo relevant hain, unhe U mein define karo.",
    "Baaki saare sets ko U ke subsets ki tarah treat karo."
  ],
  mistakes: [
    "Yeh bhool jana ke U har problem ke sath badal sakta hai — koi fixed universal set nahi hota.",
    "Yeh bhool jana ke U khud bhi apna subset hai (U ⊆ U)."
  ],
  memoryTrick: "Universal = is problem ki POORI duniya.",
  selfCheck: "Agar U = saare fruits, aur A = citrus fruits, to kya A ⊆ U hai?",
  selfCheckAnswer: "Haan, A ⊆ U — citrus fruits, fruits ki bigger category ke andar aate hain."
},
{
  id: 14,
  title: "Venn Diagrams",
  definition: "A Venn diagram is a visual way of representing sets using a rectangle for the universal set and circles inside it for individual sets.",
  feynman: `Socho ek classroom Universal Set hai. Us classroom ke andar ek circle un students ko represent karta hai jo cricket khelte hain, aur doosra circle un students ko jo football khelte hain. Jo students DONO khelte hain, woh dono circles ke overlap (common) area mein aayenge. Jo koi bhi sport nahi khelte, woh rectangle ke andar hain lekin kisi bhi circle se bahar.`,
  mathExample: `U = {1,...,10}, A = {2,4,6,8,10}, B = {1,2,3,4,5}. Do overlapping circles banao — overlap region mein {2,4} aayenge, kyunke yeh dono sets mein common hain.`,
  realLife: "Classroom mein do circles banao — ek \"Cricket\" aur ek \"Football\" ke liye. Jo dono khelte hain woh beech mein (overlap) aayenge, jo kuch nahi khelte woh rectangle mein circles se bahar honge.",
  steps: [
    "Pehle rectangle banao — yeh Universal Set (U) hai.",
    "Har set ke liye ek circle banao rectangle ke andar.",
    "Elements ko unki sahi jagah par rakho — common elements overlap mein.",
    "Jo kisi set mein nahi, woh rectangle mein circles se bahar."
  ],
  mistakes: [
    "Bahar wala rectangle (Universal Set) banana bhool jana.",
    "Un elements ko circle ke bahar rakh dena jo actually us set ka hissa hain.",
    "Overlap wale elements ko sirf ek circle mein dikhana, jab woh dono mein hone chahiye."
  ],
  memoryTrick: "Rectangle = Room, Circles = Groups, Overlap = Dono groups mein shamil log.",
  selfCheck: "Do overlapping circles hain \"Math pasand\" aur \"Science pasand\". Jo student dono pasand karta hai, woh kahan aayega?",
  selfCheckAnswer: "Dono circles ke overlap (beech waale) region mein."
},
{
  id: 15,
  title: "Union of Sets",
  definition: "The union of two sets A and B is the set of all elements that are in A, or in B, or in both. It is written as A ∪ B.",
  feynman: `Dono sets ko MILA do aur ek bada set bana lo — bas common cheezon ko sirf ek hi baar likhna, dobara nahi.`,
  mathExample: `A = {1,2,3}, B = {3,4,5} → A ∪ B = {1,2,3,4,5}. Dekho, '3' dono mein tha lekin sirf ek baar likha gaya.`,
  realLife: "Do doston ki guest lists ko mila kar ek joint party list banana — sab naam ek list mein, koi naam do baar nahi.",
  steps: [
    "A ke saare elements likho.",
    "B ke woh elements add karo jo A mein pehle se nahi hain.",
    "Sab ko ek set mein combine kar do."
  ],
  mistakes: [
    "Common elements ko do baar likhna — sets mein repetition allowed nahi.",
    "Kisi ek set ke elements chhod dena."
  ],
  memoryTrick: "Union ka symbol ∪ ek cup jaisa hai jo sab kuch collect karta hai.",
  selfCheck: "A = {2,4,6}, B = {1,2,3}. A ∪ B kya hoga?",
  selfCheckAnswer: "{1,2,3,4,6}"
},
{
  id: 16,
  title: "Intersection of Sets",
  definition: "The intersection of two sets A and B is the set of elements that are common to both A and B. It is written as A ∩ B.",
  feynman: `Sirf woh cheezein lo jo DONO sets mein maujood hain — jo common hai sirf wahi liya jata hai, baaki sab chhod diya jata hai.`,
  mathExample: `A = {1,2,3}, B = {2,3,4} → A ∩ B = {2,3}, kyunke sirf 2 aur 3 dono sets mein hain.`,
  realLife: "Woh students jo CRICKET aur FOOTBALL dono khelte hain — sirf yehi Intersection mein aayenge.",
  steps: [
    "A aur B ke elements compare karo.",
    "Sirf woh elements rakho jo DONO mein maujood hain.",
    "Baaki sab elements chhod do."
  ],
  mistakes: [
    "Aise elements shamil kar lena jo sirf ek set mein hain.",
    "Intersection (∩, sirf common) ko Union (∪, sab kuch) se confuse karna."
  ],
  memoryTrick: "Intersection ∩ ek ulta cup jaisa hai — sirf wohi rakhta hai jo dono mein share hota hai.",
  selfCheck: "A = {a,b,c}, B = {b,c,d}. A ∩ B kya hoga?",
  selfCheckAnswer: "{b,c}"
},
{
  id: 17,
  title: "Difference of Sets",
  definition: "The difference of set A and set B, written A − B, is the set of elements that are in A but not in B.",
  feynman: `Sirf woh cheezein lo jo SIRF A mein hain, B mein bilkul nahi hain — jo B mein bhi hai, usay A se hata do.`,
  mathExample: `A = {1,2,3,4}, B = {3,4,5} → A − B = {1,2}. Dhyan do: B − A = {5}, jo A − B se bilkul different hai!`,
  realLife: "Woh students jo sirf CRICKET khelte hain, FOOTBALL nahi — yeh \"Cricket set − Football set\" hai.",
  steps: [
    "A ke saare elements le lo.",
    "Jo bhi element B mein bhi ho, usay hata do.",
    "Jo bacha, wahi A − B hai."
  ],
  mistakes: [
    "Yeh sochna ke A − B, B − A ke barabar hota hai — GALAT, order bohot matter karta hai.",
    "Saare common elements hataana bhool jana."
  ],
  memoryTrick: "A − B matlab 'jo A ke paas hai, B ke paas nahi' — jo shared hai woh hata do.",
  selfCheck: "A = {1,2,3}, B = {2,3,4}. A − B aur B − A dono nikalo — kya yeh barabar hain?",
  selfCheckAnswer: "A − B = {1}, B − A = {4}. Yeh barabar NAHI hain — Difference commutative nahi hoti."
},
{
  id: 18,
  title: "Complement of a Set",
  definition: "The complement of a set A, written A' or A^c, is the set of all elements in the universal set U that are not in A.",
  feynman: `Jo bhi U mein hai lekin A mein bilkul nahi hai — A ke bahar ki har cheez (lekin U ke andar). Yeh basically U − A hi hai, bas ek special naam ke saath.`,
  mathExample: `U = {1,...,10}, A = {1,2,3,4,5} → A' = {6,7,8,9,10}.`,
  realLife: "Agar U = class ke saare students, aur A = cricket khelne waale, to A' = woh students jo cricket NAHI khelte.",
  steps: [
    "Pehle U ko identify karo.",
    "Phir A ko identify karo.",
    "A' = U ke woh saare elements jo A mein nahi hain."
  ],
  mistakes: [
    "Yeh bhool jana ke Complement hamesha U par depend karta hai — U change ho to A' bhi change ho jayega.",
    "A' ko A − B se confuse karna — Complement khaas taur par U − A hota hai."
  ],
  memoryTrick: "Complement = 'baaki sab jo U mein hai' — jo A ki party mein invite nahi huay (lekin U mein hain).",
  selfCheck: "U = {1,2,3,4,5}, A = {1,3,5}. A' kya hoga?",
  selfCheckAnswer: "{2,4}"
},
{
  id: 19,
  title: "Properties / Laws of Set Operations",
  definition: "The laws of set operations are fixed rules that describe how union, intersection, and complement behave — similar to the rules of arithmetic.",
  feynman: `Jaise Maths mein addition/multiplication ke fixed rules hote hain (2+3 = 3+2), waise hi Sets ke operations (∪, ∩) ke bhi fixed rules hote hain jo HAMESHA sahi rehte hain — chahe koi bhi sets ho.`,
  mathExample: `Aage aane wale laws: Commutative, Associative, Distributive, Identity, Domination, Idempotent, Complement, aur De Morgan's Laws.`,
  realLife: "Jaise traffic rules fixed hote hain, chahe koi bhi gaadi ho — waise hi set laws bhi fixed hote hain, chahe koi bhi sets ho.",
  steps: [
    "Har law ka pattern samjho.",
    "Chhoti examples se verify karo.",
    "Phir bade problems mein apply karo taake calculation aasan ho."
  ],
  mistakes: [
    "Bina samjhe sirf ratta lagana — exam mein confusion ho sakti hai.",
    "Yeh bhool jana ke kaunsa law ∪ ke liye hai aur kaunsa ∩ ke liye."
  ],
  memoryTrick: "Numbers jaise hi rules, bas sets ke liye: swap karo (Commutative), group badlo (Associative), distribute karo (Distributive).",
  selfCheck: "Number operations se, 3 laws socho jo shayad sets pe bhi apply hote hon.",
  selfCheckAnswer: "Commutative, Associative, aur Distributive — yeh teenon numbers mein bhi hoti hain aur sets mein bhi."
},
{
  id: 20,
  title: "Commutative Law",
  definition: "The commutative law states that changing the order of two sets in union or intersection does not change the result: A ∪ B = B ∪ A and A ∩ B = B ∩ A.",
  feynman: `Jaise 3 + 5 = 5 + 3, waise hi A ∪ B = B ∪ A — order se koi farak nahi padta, result same rehta hai.`,
  mathExample: `A = {1,2}, B = {2,3} → A ∪ B = {1,2,3}, aur B ∪ A = {1,2,3} — dono barabar!`,
  realLife: "Red paint ko blue mein milao, ya blue ko red mein — result (purple) hamesha same rahega.",
  steps: [
    "A ∪ B calculate karo.",
    "B ∪ A calculate karo.",
    "Compare karo — dono same aane chahiye (yehi ∩ ke liye bhi try karo)."
  ],
  mistakes: [
    "Yeh sochna ke Difference (A − B) bhi commutative hai — GALAT, A − B ≠ B − A.",
    "Sirf Union check karke Intersection ke liye bhi assume kar lena, bina verify kiye."
  ],
  memoryTrick: "Commute = seat swap karo, destination wahi rehta hai.",
  selfCheck: "Kya A − B = B − A hota hai?",
  selfCheckAnswer: "Nahi — Difference commutative NAHI hoti, sirf Union aur Intersection commutative hote hain."
},
{
  id: 21,
  title: "Associative Law",
  definition: "The associative law states that when combining three sets with union or intersection, the grouping does not affect the result: (A∪B)∪C = A∪(B∪C) and (A∩B)∩C = A∩(B∩C).",
  feynman: `Jaise (2+3)+4 = 2+(3+4), waise hi grouping (brackets) change karne se set ka final answer nahi badalta.`,
  mathExample: `A={1}, B={2}, C={3} → (A∪B)∪C = {1,2,3}, aur A∪(B∪C) = {1,2,3} — dono same!`,
  realLife: "Teen dosti groups ko party ke liye milana — chahe pehle A+B phir C milao, ya B+C phir A milao, final guest list hamesha same rahegi.",
  steps: [
    "Ek grouping se calculate karo.",
    "Doosri grouping se calculate karo.",
    "Compare karo — match hona chahiye."
  ],
  mistakes: [
    "Mixed operations pe associative law apply karna, jaise (A∪B)∩C ko A∪(B∩C) ke barabar samajh lena — yeh sahi NAHI hai, yeh alag concept hai (Distributive Law).",
    "Brackets ginte waqt galti karna."
  ],
  memoryTrick: "Grouping (brackets) idhar udhar move ho sakti hai, sets ko farak nahi padta kaun pehle paired hua.",
  selfCheck: "Kya (A∩B)∩C, A∩(B∩C) ke barabar hota hai? Aur (A∪B)∩C ka A∪(B∩C) se?",
  selfCheckAnswer: "(A∩B)∩C = A∩(B∩C) — haan, yeh Associative Law hai. Lekin (A∪B)∩C ≠ A∪(B∩C) generally — yeh alag baat hai."
},
{
  id: 22,
  title: "Distributive Law",
  definition: "The distributive law shows how union distributes over intersection, and intersection distributes over union: A∪(B∩C) = (A∪B)∩(A∪C) and A∩(B∪C) = (A∩B)∪(A∩C).",
  feynman: `Jaise numbers mein 2×(3+4) = 2×3 + 2×4 hota hai, waise hi sets mein bhi ek operation doosre operation ke andar \"distribute\" ho sakta hai — aur khaas baat yeh hai ke yeh BOTH directions mein kaam karta hai.`,
  mathExample: `A={1,2}, B={2,3}, C={3,4}. B∩C={3}, to A∪(B∩C)={1,2,3}. Ab (A∪B)={1,2,3}, (A∪C)={1,2,3,4}, inka intersection={1,2,3}. Match ho gaya!`,
  realLife: "Ek discount jo (shirts AND pants) dono pe apply ho, woh shirts pe alag aur pants pe alag apply karne jaisa hi result deta hai jab common outcome nikalo.",
  steps: [
    "LHS (left-hand side) solve karo.",
    "RHS (right-hand side) solve karo.",
    "Dono equal aane chahiye."
  ],
  mistakes: [
    "Yeh bhool jana ke yeh law dono directions mein kaam karta hai — normal number arithmetic mein sirf × (+) ke upar distribute hota hai, lekin sets mein ∪ aur ∩ dono ek doosre ke upar distribute hotay hain.",
    "Brackets ki galat placement se answer badal jana."
  ],
  memoryTrick: "∪ distributes over ∩, AUR ∩ distributes over ∪ — dono taraf kaam karta hai.",
  selfCheck: "A={1,2,3}, B={2,3}, C={3,4}. Verify karo: A∩(B∪C) = (A∩B)∪(A∩C).",
  selfCheckAnswer: "B∪C={2,3,4}, A∩(B∪C)={2,3}. (A∩B)={2,3}, (A∩C)={3}, unka union={2,3}. Dono taraf {2,3} — match!"
},
{
  id: 23,
  title: "Identity Law",
  definition: "The identity law states that the union of a set with the empty set gives the set itself, and the intersection of a set with the universal set gives the set itself: A∪∅=A and A∩U=A.",
  feynman: `Jaise number mein 0 add karne se number same rehta hai (5+0=5), waise hi khaali set ko A mein milaane se A same rehta hai. Aur U ke saath intersect karne se bhi A same hi rehta hai, kyunke U mein to A ka har element pehle se maujood hai.`,
  mathExample: `A = {1,2,3}. A∪∅ = {1,2,3} = A. Aur agar U = {1,2,3,4,5}, to A∩U = {1,2,3} = A.`,
  realLife: "Apne basket mein KUCH add na karna, basket same rehta hai (∪∅). \"Mere basket mein se woh dikhao jo pooray shop mein bhi hai\" — poora basket hi wapas milega (∩U).",
  steps: [
    "Operation dekho — ∪ ya ∩.",
    "Dekho ∅ ya U involve hai.",
    "Seedha A likh do (simplify ho jayega)."
  ],
  mistakes: [
    "∅ aur U ko ulta kar dena — ∅, ∪ ke liye identity hai, U, ∩ ke liye identity hai.",
    "A∩∅ ko A samajh lena — GALAT, A∩∅ hamesha ∅ hota hai (yeh Domination Law hai)."
  ],
  memoryTrick: "∪ + ∅ = koi farak nahi (jaise +0). ∩ + U = koi farak nahi (jaise ×1).",
  selfCheck: "A∪∅ aur A∩U ko simplify karo.",
  selfCheckAnswer: "A∪∅ = A, aur A∩U = A."
},
{
  id: 24,
  title: "Domination Law",
  definition: "The domination law states that the union of any set with the universal set gives the universal set, and the intersection of any set with the empty set gives the empty set: A∪U=U and A∩∅=∅.",
  feynman: `U itna bada hai ke A ke saath union karne pe bhi result U hi rehta hai — U \"dominate\" kar leta hai. Aur khaali set ke saath intersect karne pe kuch bhi common nahi milega, is liye answer khaali (∅) hi hoga.`,
  mathExample: `A = {1,2}, U = {1,2,3,4,5}. A∪U = {1,2,3,4,5} = U. Aur A∩∅ = ∅.`,
  realLife: "Chand students ko \"duniya ke saare logon\" mein add karo — result phir bhi \"duniya ke saare log\" hi rahega (U dominate karta hai). \"Mere group AND ek khaali kamre\" mein kaun common hai — koi nahi.",
  steps: [
    "Operation dekho.",
    "U ya ∅ involve hai to check karo.",
    "U dominate karta hai ∪ mein, ∅ dominate karta hai ∩ mein."
  ],
  mistakes: [
    "Domination Law ko Identity Law se confuse kar dena — yeh dikhne mein similar lagti hain lekin U aur ∅ ka opposite role hai.",
    "Yeh sochna ke A∪U, U se chhota ho sakta hai — nahi, hamesha U hi hoga."
  ],
  memoryTrick: "U DOMINATES union (A∪U=U). Empty DOMINATES intersection (A∩∅=∅).",
  selfCheck: "Kisi bhi set A ke liye, A∪U aur A∩∅ kya honge?",
  selfCheckAnswer: "A∪U = U, aur A∩∅ = ∅ — hamesha, chahe A kuch bhi ho."
},
{
  id: 25,
  title: "Idempotent Law",
  definition: "The idempotent law states that the union or intersection of a set with itself gives back the same set: A∪A=A and A∩A=A.",
  feynman: `Agar ek hi set ko khud ke saath combine karo — chahe union ho ya intersection — kuch naya nahi milta, wahi set wapas mil jata hai. Kyunke sets mein repetition allowed nahi, is liye \"double\" karna kuch change nahi karta.`,
  mathExample: `A = {1,2,3}. A∪A = {1,2,3}, aur A∩A = {1,2,3} — dono A ke barabar.`,
  realLife: "Apne fruit basket ko uski EXACT copy ke saath milao — phir bhi wahi fruits milenge, kuch naya nahi aayega.",
  steps: [
    "Dekho set khud ke saath operate ho raha hai.",
    "Result = wahi original set, kyunke kuch naya add nahi ho raha."
  ],
  mistakes: [
    "Yeh sochna ke A∪A ka matlab elements double ho jayenge — GALAT, sets mein repetition nahi hoti.",
    "Is simple case ko overcomplicate kar dena."
  ],
  memoryTrick: "Idempotent = 'Same + Same = Same' (sets mein repetition allowed nahi).",
  selfCheck: "A = {x,y,z}. A∪A aur A∩A kya honge?",
  selfCheckAnswer: "Dono {x,y,z} hi honge — A ke barabar."
},
{
  id: 26,
  title: "Complement Laws",
  definition: "The complement laws state that a set with its own complement gives the universal set under union, and the empty set under intersection: A∪A'=U and A∩A'=∅. Also, the complement of the complement returns the original set: (A')'=A.",
  feynman: `A aur uska complement A' milkar POORA U ban jaate hain, kyunke A' ka matlab hi hai \"jo A mein nahi hai\". Aur A aur A' mein kabhi kuch common nahi ho sakta, isi liye unka intersection khaali hota hai. Aur agar do baar complement lo, to wapas original set mil jata hai — jaise English mein double negative: \"not not happy\" matlab \"happy\".`,
  mathExample: `U = {1,...,5}, A = {1,2}. A' = {3,4,5}. A∪A' = {1,2,3,4,5} = U. A∩A' = ∅. Aur (A')' = A = {1,2}.`,
  realLife: "\"Chai pasand karne walay\" aur \"chai pasand na karne walay\" milkar sab ban jaate hain (U). Koi bhi dono groups mein nahi ho sakta (∅). Aur \"chai na-pasand NAHI karna\" matlab chai pasand karna hi hai ((A')'=A).",
  steps: [
    "A ka complement A' nikalo.",
    "A aur A' ko union karo — U milna chahiye.",
    "A aur A' ko intersect karo — ∅ milna chahiye.",
    "A' ka complement dobara lo — A wapas milna chahiye."
  ],
  mistakes: [
    "Yeh bhool jana ke Complement hamesha U par depend karta hai — U badlay to A' bhi badal jayega.",
    "Yeh sochna ke (A')' kuch naya deta hai — nahi, yeh hamesha A hi wapas deta hai."
  ],
  memoryTrick: "A + A' = poora U. A aur A' kabhi overlap nahi karte. Double complement = wapas shuruat pe (jaise double negative).",
  selfCheck: "U = {1,2,3,4,5,6}, A = {2,4,6}. A' nikalo, phir verify karo A∪A'=U aur A∩A'=∅.",
  selfCheckAnswer: "A' = {1,3,5}. A∪A' = {1,2,3,4,5,6} = U (match). A∩A' = ∅ (match)."
},
{
  id: 27,
  title: "De Morgan's Laws",
  definition: "De Morgan's Laws state that the complement of the union of two sets equals the intersection of their complements, and the complement of the intersection equals the union of their complements: (A∪B)'=A'∩B' and (A∩B)'=A'∪B'.",
  feynman: `Jab do sets ko pehle milao (∪) phir bahar nikaalo (complement), woh SAME hota hai jaise pehle dono ko ALAG ALAG bahar nikaalo (complement) phir unko common (∩) nikaalo — bas bracket khulte hi ∪ aur ∩ AAPAS mein SWITCH ho jaate hain. Yeh chapter ka sabse important trick hai!`,
  mathExample: `U={1,...,6}, A={1,2,3}, B={3,4,5}. A∪B={1,2,3,4,5}, (A∪B)'={6}. A'={4,5,6}, B'={1,2,6}, A'∩B'={6}. Dono taraf {6} — match!`,
  realLife: "\"Cricket YA Football, dono mein se koi bhi NAHI khelta\" — yeh bilkul wahi baat hai jaise \"Cricket bhi NAHI khelta AUR Football bhi NAHI khelta\".",
  steps: [
    "A∪B (ya A∩B) nikalo.",
    "Uska complement lo.",
    "Alag se A' aur B' nikalo.",
    "Unhein SWITCHED operation se combine karo (∪↔∩) aur compare karo — match hona chahiye."
  ],
  mistakes: [
    "Sabse common galti: bracket todte waqt ∪ ko ∩ mein (aur ∩ ko ∪ mein) switch karna BHOOL jana — exams mein yeh sabse zyada hoti hai!",
    "A' aur B' ko U ke against galat nikalna."
  ],
  memoryTrick: "De Morgan = 'Bracket todo, SYMBOL flip karo' — complement andar jaate hi ∪ ban jata hai ∩, aur ∩ ban jata hai ∪.",
  selfCheck: "U={1,...,8}, A={1,2,3,4}, B={3,4,5,6}. Verify karo: (A∩B)'=A'∪B'.",
  selfCheckAnswer: "A∩B={3,4}, (A∩B)'={1,2,5,6,7,8}. A'={5,6,7,8}, B'={1,2,7,8}, A'∪B'={1,2,5,6,7,8}. Dono match karte hain!",
  isLast: true
}
];

/* ---------------------------------------------------------------------------
   DATA: FORMULA & LAWS SHEET
--------------------------------------------------------------------------- */
const formulaGroups = [
  {
    title: "Basic Notation",
    items: [
      { law: "x ∈ A", hint: "x, set A ka member hai." },
      { law: "x ∉ A", hint: "x, set A ka member nahi hai." },
      { law: "A ⊆ B", hint: "A, B ka subset hai (fits inside or equals)." },
      { law: "A ⊂ B", hint: "A, B ka proper subset hai (A ≠ B)." },
      { law: "U", hint: "Universal Set — is problem ki poori duniya." },
      { law: "∅ or { }", hint: "Empty / Null Set — zero elements." }
    ]
  },
  {
    title: "Operations",
    items: [
      { law: "A ∪ B", hint: "Union — A ya B ya dono ke saare elements." },
      { law: "A ∩ B", hint: "Intersection — sirf woh jo dono mein common hain." },
      { law: "A − B", hint: "Difference — A mein hai, B mein nahi." },
      { law: "A' or Aᶜ", hint: "Complement — U mein hai, A mein nahi (U − A)." }
    ]
  },
  {
    title: "Identity Laws",
    items: [
      { law: "A ∪ ∅ = A", hint: "Khaali set milane se koi farak nahi." },
      { law: "A ∩ U = A", hint: "Universal set se intersect karne se A wahi rehta hai." }
    ]
  },
  {
    title: "Domination Laws",
    items: [
      { law: "A ∪ U = U", hint: "U hamesha dominate karta hai union mein." },
      { law: "A ∩ ∅ = ∅", hint: "Khaali set hamesha dominate karta hai intersection mein." }
    ]
  },
  {
    title: "Idempotent Laws",
    items: [
      { law: "A ∪ A = A", hint: "Khud ke saath union karne se kuch naya nahi milta." },
      { law: "A ∩ A = A", hint: "Khud ke saath intersection karne se bhi wahi set milta hai." }
    ]
  },
  {
    title: "Complement Laws",
    items: [
      { law: "A ∪ A' = U", hint: "Set aur uska complement milkar poora U banate hain." },
      { law: "A ∩ A' = ∅", hint: "Set aur uska complement kabhi overlap nahi karte." },
      { law: "(A')' = A", hint: "Double complement wapas original set deta hai." }
    ]
  },
  {
    title: "Commutative Laws",
    items: [
      { law: "A ∪ B = B ∪ A", hint: "Order se farak nahi padta." },
      { law: "A ∩ B = B ∩ A", hint: "Order se farak nahi padta." }
    ]
  },
  {
    title: "Associative Laws",
    items: [
      { law: "(A ∪ B) ∪ C = A ∪ (B ∪ C)", hint: "Grouping se farak nahi padta." },
      { law: "(A ∩ B) ∩ C = A ∩ (B ∩ C)", hint: "Grouping se farak nahi padta." }
    ]
  },
  {
    title: "Distributive Laws",
    items: [
      { law: "A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)", hint: "Union, intersection ke upar distribute hota hai." },
      { law: "A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)", hint: "Intersection, union ke upar distribute hota hai." }
    ]
  },
  {
    title: "De Morgan's Laws",
    items: [
      { law: "(A ∪ B)' = A' ∩ B'", hint: "Bracket todo, ∪ ban jata hai ∩." },
      { law: "(A ∩ B)' = A' ∪ B'", hint: "Bracket todo, ∩ ban jata hai ∪." }
    ]
  }
];

/* ---------------------------------------------------------------------------
   DATA: VISUAL LEARNING  (custom inline SVGs — always render, never broken)
--------------------------------------------------------------------------- */
function buildVisuals(){
  return [
    {
      title: "Sets",
      svg: svgSetBasic({elements:['2','4','6','8'], label:'A'}),
      caption: "Ek set U (rectangle) ke andar A (circle) hota hai, aur uske elements (dots) circle ke andar plot hote hain. Har dot ek member hai.",
      link: "https://www.mathsisfun.com/sets/"
    },
    {
      title: "Subsets",
      svg: svgSubset({labelA:'A', labelB:'B'}),
      caption: "A ⊆ B — A ka har element B ke andar bhi hai, isliye chhota circle (A) bade circle (B) ke andar poori tarah fit hai.",
      link: "https://www.mathsisfun.com/sets/"
    },
    {
      title: "Venn Diagrams",
      svg: svgVenn2({shade:'none'}),
      caption: "Rectangle = Universal Set U. Har circle ek set hai. Jahan circles overlap karte hain, wahan common elements hote hain.",
      link: "https://www.mathsisfun.com/sets/"
    },
    {
      title: "Union (A ∪ B)",
      svg: svgVenn2({shade:'union'}),
      caption: "Poora shaded area (dono circles + overlap) = A ∪ B. Yaani A ya B ya dono mein jo bhi ho.",
      link: "https://www.mathsisfun.com/sets/venn-diagrams.html"
    },
    {
      title: "Intersection (A ∩ B)",
      svg: svgVenn2({shade:'intersection'}),
      caption: "Sirf beech ka overlap (lens shape) shaded hai = A ∩ B. Sirf woh jo DONO sets mein common hain.",
      link: "https://www.mathsisfun.com/sets/venn-diagrams.html"
    },
    {
      title: "Difference (A − B)",
      svg: svgVenn2({shade:'aOnly'}),
      caption: "Sirf A ka woh hissa shaded hai jo B se overlap NAHI karta = A − B. B wala hissa nikaal diya gaya hai.",
      link: "https://www.mathsisfun.com/sets/"
    },
    {
      title: "Complement (A')",
      svg: svgComplement({label:'A'}),
      caption: "Rectangle (U) ka poora area shaded hai SIWAYE circle A ke andar — yehi A' hai, jo U mein hai lekin A mein nahi.",
      link: "https://www.mathsisfun.com/sets/"
    },
    {
      title: "De Morgan's Laws",
      svg: svgDeMorgan({which:'union'}),
      caption: "Dono mini-diagrams EXACT same shape dikhate hain — yehi visually proof hai ke (A∪B)' aur A'∩B' hamesha barabar hote hain.",
      link: "https://www.mathsisfun.com/sets/"
    }
  ];
}

/* ---------------------------------------------------------------------------
   DATA: QUICK NOTES (fast revision points)
--------------------------------------------------------------------------- */
const quickNotes = [
  { title: "SETS", body: "A set is a well-defined collection of distinct objects." },
  { title: "ROSTER FORM", body: "Elements listed inside braces: {1,2,3}." },
  { title: "SET-BUILDER FORM", body: "A rule describes the elements: {x | x < 5}." },
  { title: "EMPTY SET", body: "{ } or ∅ — zero elements. {∅} and {0} are NOT empty, they're singletons!" },
  { title: "SINGLETON SET", body: "Exactly one element, e.g. {7}." },
  { title: "FINITE / INFINITE", body: "Finite = counting ends. Infinite = never ends (e.g. N)." },
  { title: "SUBSET", body: "A ⊆ B: every element of A is in B." },
  { title: "PROPER SUBSET", body: "A ⊂ B: A ⊆ B and A ≠ B." },
  { title: "IMPROPER SUBSET", body: "A ⊆ B where A = B exactly." },
  { title: "UNIVERSAL SET", body: "U — the complete set for this problem's context." },
  { title: "UNION", body: "A ∪ B — everything in A, B, or both." },
  { title: "INTERSECTION", body: "A ∩ B — only what's common to both." },
  { title: "DIFFERENCE", body: "A − B — in A but not B. Not commutative!" },
  { title: "COMPLEMENT", body: "A' — everything in U that's not in A." },
  { title: "COMMUTATIVE", body: "A∪B=B∪A, A∩B=B∩A (order doesn't matter)." },
  { title: "ASSOCIATIVE", body: "(A∪B)∪C = A∪(B∪C) (grouping doesn't matter)." },
  { title: "DISTRIBUTIVE", body: "A∪(B∩C)=(A∪B)∩(A∪C), and the reverse too." },
  { title: "IDENTITY", body: "A∪∅=A, A∩U=A." },
  { title: "DOMINATION", body: "A∪U=U, A∩∅=∅." },
  { title: "IDEMPOTENT", body: "A∪A=A, A∩A=A." },
  { title: "COMPLEMENT LAWS", body: "A∪A'=U, A∩A'=∅, (A')'=A." },
  { title: "DE MORGAN'S", body: "(A∪B)'=A'∩B' and (A∩B)'=A'∪B' — flip the symbol when the bracket breaks!" }
];

/* ---------------------------------------------------------------------------
   DATA: DESCRIPTIVE QUESTIONS + RUBRIC (self-assessment, since this is a
   static, backend-free app — see rubric_box in the UI)
--------------------------------------------------------------------------- */
const descriptiveQuestions = [
  {
    id: 1,
    question: "Define a set and explain two methods of representing a set, with examples.",
    maxMarks: 10,
    modelPoints: [
      "Definition: a set is a well-defined collection of distinct objects (elements).",
      "Roster/Tabular form: elements listed directly inside braces, e.g. {2,4,6,8}.",
      "Set-Builder form: a rule/property describes the elements, e.g. {x | x is even, 2≤x≤8}.",
      "Both examples should represent the same set to show they're equivalent ways of writing it."
    ],
    rubric: [
      { label: "Correct, well-defined definition of a set", marks: 3 },
      { label: "Roster form explained with a correct example", marks: 3 },
      { label: "Set-builder form explained with a correct example", marks: 3 },
      { label: "Clear presentation, correct notation ({ }, |)", marks: 1 }
    ]
  },
  {
    id: 2,
    question: "Explain union and intersection of two sets using Venn diagrams.",
    maxMarks: 10,
    modelPoints: [
      "Union (A∪B): all elements in A, B, or both — shown as the entire shaded area of both circles.",
      "Intersection (A∩B): only elements common to both — shown as just the overlapping lens.",
      "A worked numeric example for each, e.g. A={1,2,3}, B={2,3,4} → A∪B={1,2,3,4}, A∩B={2,3}.",
      "A rough sketch of two overlapping circles inside a rectangle (U), labelled clearly."
    ],
    rubric: [
      { label: "Union defined correctly with correct Venn shading described", marks: 3 },
      { label: "Intersection defined correctly with correct Venn shading described", marks: 3 },
      { label: "Correct worked numeric example for both", marks: 3 },
      { label: "Diagram/description is clear and correctly labelled", marks: 1 }
    ]
  },
  {
    id: 3,
    question: "Explain subset, proper subset, and improper subset with examples.",
    maxMarks: 10,
    modelPoints: [
      "Subset (A⊆B): every element of A is also in B.",
      "Proper subset (A⊂B): A⊆B and A≠B — B has at least one extra element.",
      "Improper subset: the case where A⊆B and A=B exactly.",
      "Example: A={1,2}, B={1,2,3} → A is a proper subset of B. If B={1,2}, A is an improper subset of B."
    ],
    rubric: [
      { label: "Subset defined correctly with example", marks: 3 },
      { label: "Proper subset defined correctly with example", marks: 3 },
      { label: "Improper subset defined correctly with example", marks: 3 },
      { label: "Clearly distinguishes all three from each other", marks: 1 }
    ]
  },
  {
    id: 4,
    question: "Explain the important laws of set operations (any four laws, with examples).",
    maxMarks: 10,
    modelPoints: [
      "Choose any four: Commutative, Associative, Distributive, Identity, Domination, Idempotent, Complement, De Morgan's.",
      "State each law's equation correctly (e.g. A∪B=B∪A for Commutative).",
      "Give a short numeric example verifying each chosen law.",
      "Briefly explain what each law means in plain words."
    ],
    rubric: [
      { label: "Four distinct, correctly-named laws chosen", marks: 2 },
      { label: "Each law's equation stated correctly", marks: 4 },
      { label: "Correct numeric example verifying each law", marks: 3 },
      { label: "Clear plain-language explanation alongside each", marks: 1 }
    ]
  },
  {
    id: 5,
    question: "State and explain De Morgan's Laws using Venn diagrams.",
    maxMarks: 10,
    modelPoints: [
      "(A∪B)' = A'∩B' — complement of the union equals the intersection of the complements.",
      "(A∩B)' = A'∪B' — complement of the intersection equals the union of the complements.",
      "Venn explanation: shading 'outside both circles' directly matches shading 'the overlap of A' and B' separately' — same final region either way.",
      "A worked numeric example with a stated universal set U verifying at least one of the two laws."
    ],
    rubric: [
      { label: "Both laws stated with correct notation", marks: 3 },
      { label: "Venn diagram reasoning correctly explained for at least one law", marks: 3 },
      { label: "Correct worked numeric example with a stated U", marks: 3 },
      { label: "Explains why the bracket 'flips' the operation", marks: 1 }
    ]
  }
];

/* ---------------------------------------------------------------------------
   DATA: MCQs — 6 per topic × 27 topics = 162 questions.
   answer is a 0-based index into options (0=A, 1=B, 2=C, 3=D).
--------------------------------------------------------------------------- */
const mcqTopicBlocks = [
{ topicId:1, questions:[
  { q:"What is a set?", options:["Any random collection of things","A well-defined collection of distinct objects","A list that can repeat elements","Only a collection of numbers"], answer:1, difficulty:"easy" },
  { q:"Which of the following is a well-defined set?", options:["Tall students in a class","Beautiful paintings in a museum","Prime numbers less than 10","Good movies of 2020"], answer:2, difficulty:"medium" },
  { q:"If A = {2,4,6,8}, which statement is correct?", options:["5 ∈ A","4 ∈ A","4 ∉ A","A ∈ 4"], answer:1, difficulty:"easy" },
  { q:"Which of these is NOT a valid (well-defined) set?", options:["{1,2,3}","{red, blue, green}","{intelligent students}","{a,e,i,o,u}"], answer:2, difficulty:"conceptual" },
  { q:"In the set {3,3,5,7}, how many distinct elements are there?", options:["4","3","2","5"], answer:1, difficulty:"application" },
  { q:"Are {1,2,3} and {3,1,2} the same set?", options:["No, order matters in sets","Yes, order doesn't matter in sets","Only if written in Roster form","Only if elements are numbers"], answer:1, difficulty:"conceptual" }
]},
{ topicId:2, questions:[
  { q:"How many main ways are there to represent a set?", options:["1","2","3","4"], answer:1, difficulty:"easy" },
  { q:"Roster form for a set means:", options:["Describing elements using a rule","Listing all elements inside braces","Drawing a Venn diagram","Writing only the first element"], answer:1, difficulty:"easy" },
  { q:"Set-builder form for a set means:", options:["Listing every single element","Describing elements using a property/rule","Only used for infinite sets","Cannot include variables"], answer:1, difficulty:"medium" },
  { q:"Which of these is written in set-builder form?", options:["{1,2,3,4}","{x | x is a natural number less than 5}","{a,b,c}","{Monday, Tuesday}"], answer:1, difficulty:"easy" },
  { q:"A = {x | x is a day of the week starting with 'T'}. Which roster form is correct?", options:["{Tuesday, Thursday}","{Monday, Tuesday}","{Tuesday, Wednesday}","{Thursday, Friday}"], answer:0, difficulty:"application" },
  { q:"Can a set have both a roster form and a set-builder form?", options:["No, only one form is allowed per set","Yes, both forms can represent the same set","Only infinite sets can have both","Only finite sets can have both"], answer:1, difficulty:"conceptual" }
]},
{ topicId:3, questions:[
  { q:"In roster form, elements are separated by:", options:["Semicolons","Commas","Colons","Spaces only"], answer:1, difficulty:"easy" },
  { q:"Roster form of the vowels in English is:", options:["{a,e,i,o,u}","{a,b,c,d,e}","{vowels}","{x | x is a vowel}"], answer:0, difficulty:"easy" },
  { q:"Which roster form is written correctly?", options:["{1,1,2,3}","{1,2,3}","(1,2,3)","[1,2,3]"], answer:1, difficulty:"medium" },
  { q:"Roster form of the days of the week starting with 'S':", options:["{Sunday, Monday}","{Sunday, Saturday}","{Saturday, Friday}","{Sunday}"], answer:1, difficulty:"application" },
  { q:"Why is {2,2,4} not correctly written in roster form?", options:["Numbers can't be in braces","Elements should not repeat in a set","It needs a rule instead","It's missing a comma"], answer:1, difficulty:"conceptual" },
  { q:"The roster form of prime numbers less than 10 is:", options:["{2,3,5,7}","{1,2,3,5,7}","{2,4,6,8}","{3,5,7,9}"], answer:0, difficulty:"application" }
]},
{ topicId:4, questions:[
  { q:"The set-builder notation {x | condition} is read as:", options:["\"the set of all x such that condition holds\"","\"x equals condition\"","\"x is greater than condition\"","\"condition is a set\""], answer:0, difficulty:"medium" },
  { q:"Which is the correct set-builder form for {2,4,6,8,10}?", options:["{x | x ∈ N, x is even, 2 ≤ x ≤ 10}","{x | x ∈ N, x < 2}","{x | x is odd}","{x | x > 10}"], answer:0, difficulty:"application" },
  { q:"In set-builder notation, what does \"x ∈ N\" typically indicate?", options:["x is an even number","x belongs to the set of natural numbers","x is negative","x is a real number only"], answer:1, difficulty:"easy" },
  { q:"Convert {5,10,15,20} into set-builder form.", options:["{x | x is a multiple of 5, 5 ≤ x ≤ 20}","{x | x is a multiple of 2}","{x | x < 5}","{x | x is odd}"], answer:0, difficulty:"application" },
  { q:"Set-builder form is mainly useful when:", options:["The set has only one element","The list is very long or infinite","The set is empty","Roster form is always better, so never"], answer:1, difficulty:"conceptual" },
  { q:"Which symbol is commonly used to mean \"such that\" in set-builder notation?", options:["∪","∩","| or :","⊆"], answer:2, difficulty:"easy" }
]},
{ topicId:5, questions:[
  { q:"Sets are mainly classified based on:", options:["Their color","The number of elements and their relation to other sets","The alphabet used","Who wrote them"], answer:1, difficulty:"easy" },
  { q:"Which of these is an example of a finite set?", options:["N = {1,2,3,...}","{1,2,3,4,5}","Set of points on a line","Set of all integers"], answer:1, difficulty:"easy" },
  { q:"{ } is an example of which type of set?", options:["Singleton set","Empty set","Infinite set","Universal set"], answer:1, difficulty:"easy" },
  { q:"Which type of set contains exactly one element?", options:["Empty set","Singleton set","Finite set","Subset"], answer:1, difficulty:"medium" },
  { q:"Is {0} a finite set or an empty set?", options:["Empty set, because 0 means nothing","Finite set, because it has exactly 1 element","Infinite set","Neither"], answer:1, difficulty:"conceptual" },
  { q:"Every set with a fixed, countable number of elements is called:", options:["Infinite","Finite","Universal","Complement"], answer:1, difficulty:"medium" }
]},
{ topicId:6, questions:[
  { q:"The empty set is denoted by:", options:["{0}","{ } or ∅","U","N"], answer:1, difficulty:"easy" },
  { q:"How many elements does an empty set have?", options:["1","Infinite","0","Depends on context"], answer:2, difficulty:"easy" },
  { q:"Which of these represents an empty set?", options:["{x | x is an odd number divisible by 2}","{0}","{∅}","{1}"], answer:0, difficulty:"application" },
  { q:"Is {∅} an empty set?", options:["Yes, because it contains the empty symbol","No, it is a singleton set containing one element, ∅","Yes, because ∅ means nothing","No, it's an infinite set"], answer:1, difficulty:"conceptual" },
  { q:"The set of \"students in your class who are 10 feet tall\" is:", options:["A singleton set","An empty set","A finite set with many elements","An infinite set"], answer:1, difficulty:"application" },
  { q:"Which statement about the empty set is TRUE?", options:["It cannot be a subset of any set","It is a subset of every set","It has exactly one element","It is the same as {0}"], answer:1, difficulty:"conceptual" }
]},
{ topicId:7, questions:[
  { q:"A singleton set contains:", options:["No elements","Exactly one element","Exactly two elements","Infinite elements"], answer:1, difficulty:"easy" },
  { q:"Which of these is a singleton set?", options:["{1,2}","{ }","{7}","{1,2,3,...}"], answer:2, difficulty:"easy" },
  { q:"The set of even prime numbers is:", options:["{2,4,6}","{2}","{ }","{1,2,3}"], answer:1, difficulty:"conceptual" },
  { q:"\"The tallest student in a class\" describes which type of set?", options:["Empty set","Singleton set","Infinite set","Universal set"], answer:1, difficulty:"application" },
  { q:"Is {0} a singleton set?", options:["No, it's empty","Yes, it contains exactly one element, 0","No, it's infinite","It depends on U"], answer:1, difficulty:"conceptual" },
  { q:"How is the number 5 different from the set {5}?", options:["They are exactly the same thing","5 is a number, {5} is a set containing that number","{5} is bigger than 5","There is no difference in set theory"], answer:1, difficulty:"medium" }
]},
{ topicId:8, questions:[
  { q:"A finite set is one where:", options:["Elements cannot be counted","Elements can be completely counted","There are no elements","Elements repeat infinitely"], answer:1, difficulty:"easy" },
  { q:"Which of the following is a finite set?", options:["Set of all integers","Set of natural numbers","Days of the week","Points on a line"], answer:2, difficulty:"easy" },
  { q:"Is the empty set finite or infinite?", options:["Infinite","Finite, with 0 elements","Neither","Depends on U"], answer:1, difficulty:"conceptual" },
  { q:"The set of pages in a 200-page book is:", options:["Infinite","Finite","Empty","A singleton"], answer:1, difficulty:"application" },
  { q:"A \"very large\" set (like Pakistan's population) is:", options:["Always infinite","Finite, as long as it's a fixed, countable number","Neither finite nor infinite","Always a singleton"], answer:1, difficulty:"conceptual" },
  { q:"n(A) = 5 tells us that:", options:["A is infinite","A has exactly 5 elements","A is empty","A has at least 5 elements"], answer:1, difficulty:"medium" }
]},
{ topicId:9, questions:[
  { q:"An infinite set is one where:", options:["Elements can be completely counted","Elements go on without end","There are exactly 0 elements","There is exactly 1 element"], answer:1, difficulty:"easy" },
  { q:"Which of these is an infinite set?", options:["{1,2,3}","Days of the week","N = {1,2,3,4,...}","{ }"], answer:2, difficulty:"easy" },
  { q:"The set of multiples of 5 is:", options:["Finite","Infinite","Empty","A singleton"], answer:1, difficulty:"medium" },
  { q:"A very large finite number, like 10 billion, makes a set:", options:["Automatically infinite","Still finite, since it's a fixed count","Empty","A singleton"], answer:1, difficulty:"conceptual" },
  { q:"Which symbol is commonly used to hint that a set is infinite in roster form?", options:["∅","...","U","∈"], answer:1, difficulty:"easy" },
  { q:"Points on a straight line segment form:", options:["A finite set","An infinite set","An empty set","A singleton set"], answer:1, difficulty:"application" }
]}
];
mcqTopicBlocks.push(
{ topicId:10, questions:[
  { q:"A ⊆ B means:", options:["A and B have no common elements","Every element of A is also in B","A has more elements than B","A and B are unequal"], answer:1, difficulty:"easy" },
  { q:"If A = {1,2}, B = {1,2,3,4}, then:", options:["A ⊆ B is true","A ⊆ B is false","B ⊆ A is true","Neither is true"], answer:0, difficulty:"application" },
  { q:"Is a set always a subset of itself?", options:["No, never","Yes, always (A ⊆ A)","Only if A is empty","Only if A is infinite"], answer:1, difficulty:"conceptual" },
  { q:"Which set is a subset of every set?", options:["Universal set","Empty set","Singleton set","Infinite set"], answer:1, difficulty:"medium" },
  { q:"If A = { }, B = {5,6}, is A ⊆ B?", options:["No, empty set isn't a subset of anything","Yes, empty set is a subset of every set","Only if B is also empty","Cannot be determined"], answer:1, difficulty:"conceptual" },
  { q:"A ⊆ B allows for the possibility that:", options:["A = B","A has more elements than B","A and B share no elements","B is empty while A is not"], answer:0, difficulty:"medium" }
]},
{ topicId:11, questions:[
  { q:"A ⊂ B (proper subset) requires:", options:["A ⊆ B only","A ⊆ B and A ≠ B","A = B","A ∩ B = ∅"], answer:1, difficulty:"easy" },
  { q:"If A = {1,2}, B = {1,2,3}, then:", options:["A ⊂ B is true","A ⊂ B is false","B ⊂ A is true","A = B"], answer:0, difficulty:"application" },
  { q:"Can a set be a proper subset of itself?", options:["Yes, always","No, never (A ⊂ A is always false)","Only if A is infinite","Only if A is empty"], answer:1, difficulty:"conceptual" },
  { q:"If A = {1,2,3} and B = {1,2,3}, is A ⊂ B?", options:["Yes","No, because A = B","Cannot be determined","Yes, but only sometimes"], answer:1, difficulty:"medium" },
  { q:"For A ⊂ B to be true, B must have:", options:["Fewer elements than A","At least one element not in A","Exactly the same elements as A","No elements at all"], answer:1, difficulty:"medium" },
  { q:"Which pair shows a proper subset relationship?", options:["{1,2} and {1,2}","{1,2} and {1,2,3}","{1,2,3} and {1,2}","{1,2} and {3,4}"], answer:1, difficulty:"application" }
]},
{ topicId:12, questions:[
  { q:"An improper subset of B is a subset A where:", options:["A ⊆ B and A ≠ B","A ⊆ B and A = B","A ∩ B = ∅","A has fewer elements than B"], answer:1, difficulty:"easy" },
  { q:"Every set is a/an ______ subset of itself.", options:["Proper","Improper","Neither","Empty"], answer:1, difficulty:"easy" },
  { q:"If A = {1,2,3} and B = {1,2,3}, A is called:", options:["A proper subset of B","An improper subset of B","Not a subset of B","The complement of B"], answer:1, difficulty:"application" },
  { q:"Does \"improper\" mean the subset relationship is invalid?", options:["Yes, it's a mistake","No, it's just the name for the case when A = B","Yes, it means A is not well-defined","No, it means A is empty"], answer:1, difficulty:"conceptual" },
  { q:"How many improper subsets does a set B have?", options:["Exactly 1 (B itself)","0","Infinitely many","Depends on B's size"], answer:0, difficulty:"conceptual" },
  { q:"Proper and improper subsets together cover:", options:["Only some subsets of B","All possible subsets of B","Only B itself","Only the empty set"], answer:1, difficulty:"medium" }
]},
{ topicId:13, questions:[
  { q:"The universal set U represents:", options:["Only even numbers","All elements under consideration in a given context","Only the empty set","A set with exactly 10 elements"], answer:1, difficulty:"easy" },
  { q:"Every set discussed within a context is a ______ of the universal set.", options:["Complement","Subset","Superset","Difference"], answer:1, difficulty:"medium" },
  { q:"Does the universal set U stay the same across all different problems?", options:["Yes, it's always {1,2,3,...}","No, U depends on the context of each problem","Yes, it's always empty","No, U is always infinite"], answer:1, difficulty:"conceptual" },
  { q:"Is U a subset of itself?", options:["No, never","Yes, U ⊆ U always","Only sometimes","Cannot be determined"], answer:1, difficulty:"medium" },
  { q:"If U = {all students in a school} and A = {students in Class 10}, then:", options:["A ⊆ U","U ⊆ A","A ∩ U = ∅","A and U are unrelated"], answer:0, difficulty:"application" },
  { q:"In most Venn diagrams, the universal set is represented by:", options:["A circle","A triangle","A rectangle","A dot"], answer:2, difficulty:"easy" }
]},
{ topicId:14, questions:[
  { q:"In a Venn diagram, the rectangle represents:", options:["A subset","The universal set","The empty set","The complement only"], answer:1, difficulty:"easy" },
  { q:"In a Venn diagram, circles represent:", options:["The universal set","Individual sets","Elements only","Nothing important"], answer:1, difficulty:"easy" },
  { q:"The overlapping region of two circles in a Venn diagram represents:", options:["Elements unique to one set","Elements common to both sets","Elements in neither set","The universal set"], answer:1, difficulty:"medium" },
  { q:"In a Venn diagram with \"Cricket\" and \"Football\" circles, a student who plays both would appear:", options:["Outside both circles","In the Cricket circle only","In the overlapping region","In the Football circle only"], answer:2, difficulty:"application" },
  { q:"A region inside the rectangle but outside all circles represents:", options:["Elements in the universal set but in none of the shown sets","Elements in every set","An error in the diagram","The complement of the universal set"], answer:0, difficulty:"conceptual" },
  { q:"Is it necessary to draw the outer rectangle (U) in a Venn diagram?", options:["No, it's optional decoration","Yes, it represents the universal set and gives context","No, circles alone are always enough","Only for empty sets"], answer:1, difficulty:"conceptual" }
]},
{ topicId:15, questions:[
  { q:"A ∪ B is the set of elements that are:", options:["In A and B both, only","In A, or B, or both","In A but not B","Outside A and B"], answer:1, difficulty:"easy" },
  { q:"If A = {1,2,3}, B = {3,4,5}, then A ∪ B = ?", options:["{1,2,3,4,5}","{3}","{1,2,4,5}","{1,2,3,3,4,5}"], answer:0, difficulty:"easy" },
  { q:"In A ∪ B, should common elements be written twice?", options:["Yes, once for each set","No, each element appears only once","Only if the sets are infinite","Only in set-builder form"], answer:1, difficulty:"conceptual" },
  { q:"A = {2,4,6}, B = {1,2,3}. A ∪ B = ?", options:["{1,2,3,4,6}","{2}","{1,3,4,6}","{1,2,2,3,4,6}"], answer:0, difficulty:"application" },
  { q:"The symbol ∪ is best remembered as looking like:", options:["An upside-down cup that holds only shared items","A cup that collects everything","A rectangle","A dot"], answer:1, difficulty:"easy" },
  { q:"If A = {1,2} and B = { }, then A ∪ B = ?", options:["{ }","{1,2}","Cannot be determined","U"], answer:1, difficulty:"medium" }
]},
{ topicId:16, questions:[
  { q:"A ∩ B is the set of elements that are:", options:["In A, or B, or both","Common to both A and B only","In A but not B","In neither A nor B"], answer:1, difficulty:"easy" },
  { q:"If A = {1,2,3}, B = {2,3,4}, then A ∩ B = ?", options:["{1,2,3,4}","{2,3}","{1,4}","{ }"], answer:1, difficulty:"easy" },
  { q:"A = {a,b,c}, B = {b,c,d}. A ∩ B = ?", options:["{a,b,c,d}","{b,c}","{a,d}","{ }"], answer:1, difficulty:"application" },
  { q:"If two sets have no elements in common, A ∩ B equals:", options:["U","{ }","A","B"], answer:1, difficulty:"medium" },
  { q:"Students who play BOTH cricket and football belong to which set operation?", options:["Union","Intersection","Complement","Difference"], answer:1, difficulty:"application" },
  { q:"If A = {1,2} and B = {1,2}, then A ∩ B = ?", options:["{ }","{1,2}","{1}","U"], answer:1, difficulty:"medium" }
]},
{ topicId:17, questions:[
  { q:"A − B is the set of elements that are:", options:["In both A and B","In A but not in B","In B but not in A","In neither A nor B"], answer:1, difficulty:"easy" },
  { q:"If A = {1,2,3,4}, B = {3,4,5}, then A − B = ?", options:["{1,2}","{5}","{3,4}","{1,2,3,4,5}"], answer:0, difficulty:"easy" },
  { q:"Is A − B always equal to B − A?", options:["Yes, always, since subtraction is symmetric","No — order matters, they are generally different","Yes, but only for finite sets","Yes, but only for infinite sets"], answer:1, difficulty:"conceptual" },
  { q:"A = {1,2,3}, B = {2,3,4}. Find B − A.", options:["{1}","{4}","{2,3}","{1,4}"], answer:1, difficulty:"application" },
  { q:"If B ⊆ A, then A − B represents:", options:["Elements in A that are not in B","All elements of U","Elements in B only","The empty set always"], answer:0, difficulty:"medium" },
  { q:"If A and B have no elements in common, A − B equals:", options:["{ }","A","B","U"], answer:1, difficulty:"conceptual" }
]},
{ topicId:18, questions:[
  { q:"The complement of A, written A', is defined as:", options:["A ∩ B","U − A","A − U","A ∪ U"], answer:1, difficulty:"easy" },
  { q:"If U = {1,...,10}, A = {1,2,3,4,5}, then A' = ?", options:["{6,7,8,9,10}","{1,2,3,4,5}","{ }","U"], answer:0, difficulty:"easy" },
  { q:"Does the complement of A depend on the universal set U?", options:["No, A' is always the same regardless of U","Yes, changing U changes A'","No, complement is only defined for infinite sets","Yes, but only when A is empty"], answer:1, difficulty:"conceptual" },
  { q:"If U = {1,2,3,4,5}, A = {1,3,5}, then A' = ?", options:["{2,4}","{1,3,5}","{ }","U"], answer:0, difficulty:"application" },
  { q:"If U = students in class, A = students who play cricket, then A' represents:", options:["Students who play cricket","Students who do NOT play cricket","All students in the school","Students who play both cricket and football"], answer:1, difficulty:"application" },
  { q:"A' is a special case of which set operation?", options:["A ∩ B","U − A (a type of difference)","A ∪ B","A × B"], answer:1, difficulty:"conceptual" }
]}
);
mcqTopicBlocks.push(
{ topicId:19, questions:[
  { q:"The laws of set operations describe:", options:["Random, changing behavior of sets","Fixed rules that set operations always follow","Only rules for empty sets","Rules that apply only in Venn diagrams"], answer:1, difficulty:"easy" },
  { q:"Set operation laws are similar in spirit to:", options:["Rules of grammar","Rules of arithmetic (like commutative addition)","Rules of chemistry","There is no similarity"], answer:1, difficulty:"medium" },
  { q:"Which of these is NOT one of the standard laws of set operations covered in this chapter?", options:["Commutative Law","Associative Law","Multiplication Law","Distributive Law"], answer:2, difficulty:"easy" },
  { q:"Why are these laws useful?", options:["They make sets harder to understand","They help simplify and solve set expressions correctly","They only apply to numbers, not sets","They have no practical use"], answer:1, difficulty:"conceptual" },
  { q:"De Morgan's Laws involve which operation together with union and intersection?", options:["Complement","Subset","Universal set only","Roster form"], answer:0, difficulty:"medium" },
  { q:"Do all these laws apply to both union and intersection?", options:["No, laws are always specific to just one operation","Most laws have a version for both ∪ and ∩","Only Commutative Law applies to both","Laws only apply to finite sets"], answer:1, difficulty:"conceptual" }
]},
{ topicId:20, questions:[
  { q:"The Commutative Law for union states:", options:["A ∪ B = B ∪ A","A ∪ B = A ∩ B","A ∪ ∅ = A","A ∪ U = U"], answer:0, difficulty:"easy" },
  { q:"If A = {1,2}, B = {2,3}, is A ∪ B = B ∪ A?", options:["Yes, both equal {1,2,3}","No, they are different","Only true for intersection","Cannot be determined"], answer:0, difficulty:"application" },
  { q:"Does the Commutative Law apply to set difference (A − B)?", options:["Yes, always","No, A − B ≠ B − A generally","Only when A = B","Yes, but only for finite sets"], answer:1, difficulty:"conceptual" },
  { q:"The Commutative Law for intersection states:", options:["A ∩ B = B ∩ A","A ∩ B = A ∪ B","A ∩ U = A","A ∩ ∅ = ∅"], answer:0, difficulty:"easy" },
  { q:"A = {x,y}, B = {y,z}. Does A ∩ B = B ∩ A?", options:["Yes, both equal {y}","No","Only for union","Cannot say"], answer:0, difficulty:"application" },
  { q:"Commutative Law is best summarized as:", options:["Grouping doesn't matter","Order doesn't matter","Only empty sets matter","Complement doesn't matter"], answer:1, difficulty:"medium" }
]},
{ topicId:21, questions:[
  { q:"The Associative Law for union states:", options:["(A ∪ B) ∪ C = A ∪ (B ∪ C)","A ∪ B = B ∪ A","A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)","A ∪ ∅ = A"], answer:0, difficulty:"easy" },
  { q:"Associative Law is mainly about:", options:["Changing the order of elements","Changing the grouping (brackets) of three or more sets","Taking complements","Comparing subsets"], answer:1, difficulty:"medium" },
  { q:"A={1}, B={2}, C={3}. Is (A∪B)∪C = A∪(B∪C)?", options:["Yes, both equal {1,2,3}","No, they differ","Only for intersection","Cannot say"], answer:0, difficulty:"application" },
  { q:"Is (A∪B)∩C generally equal to A∪(B∩C)?", options:["Yes, by Associative Law","No — that mixes operations, it's not simple associativity","Yes, always","Only when C is empty"], answer:1, difficulty:"conceptual" },
  { q:"The Associative Law for intersection states:", options:["(A ∩ B) ∩ C = A ∩ (B ∩ C)","A ∩ B = B ∩ A","A ∩ U = A","A ∩ ∅ = ∅"], answer:0, difficulty:"easy" },
  { q:"Associative Law lets us:", options:["Regroup three sets under the same operation without changing the result","Swap operations freely","Ignore brackets always, even across different operations","Combine union and intersection without rules"], answer:0, difficulty:"medium" }
]},
{ topicId:22, questions:[
  { q:"One form of the Distributive Law is:", options:["A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)","A ∪ B = B ∪ A","(A ∪ B) ∪ C = A ∪ (B ∪ C)","A ∪ A = A"], answer:0, difficulty:"easy" },
  { q:"The other form of the Distributive Law is:", options:["A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)","A ∩ B = B ∩ A","A ∩ U = A","A ∩ ∅ = ∅"], answer:0, difficulty:"easy" },
  { q:"In ordinary arithmetic, multiplication distributes over addition. In sets, which operations distribute over each other?", options:["Only union distributes over intersection","Only intersection distributes over union","Both union over intersection AND intersection over union","Neither operation distributes"], answer:2, difficulty:"conceptual" },
  { q:"A={1,2}, B={2,3}, C={3,4}. Find B∩C, then A∪(B∩C).", options:["B∩C={3}, A∪(B∩C)={1,2,3}","B∩C={2,3,4}, A∪(B∩C)={1,2,3,4}","B∩C={ }, A∪(B∩C)={1,2}","B∩C={2}, A∪(B∩C)={1,2}"], answer:0, difficulty:"application" },
  { q:"For the same A, B, C above, does (A∪B)∩(A∪C) also equal {1,2,3}?", options:["Yes, confirming the Distributive Law","No, it gives a different answer","Cannot be checked","Only true for Associative Law"], answer:0, difficulty:"application" },
  { q:"Distributive Law in sets is different from ordinary arithmetic because:", options:["It doesn't exist in sets","In sets it works both ways (∪ over ∩ and ∩ over ∪), unlike plain +/× arithmetic","It only works for empty sets","It only works for infinite sets"], answer:1, difficulty:"conceptual" }
]},
{ topicId:23, questions:[
  { q:"The Identity Law for union states:", options:["A ∪ ∅ = A","A ∪ U = U","A ∪ A = A","A ∪ A' = U"], answer:0, difficulty:"easy" },
  { q:"The Identity Law for intersection states:", options:["A ∩ U = A","A ∩ ∅ = ∅","A ∩ A = A","A ∩ A' = ∅"], answer:0, difficulty:"easy" },
  { q:"If A = {1,2,3}, what is A ∪ ∅?", options:["{1,2,3}","{ }","U","Cannot be determined"], answer:0, difficulty:"application" },
  { q:"If A = {1,2,3} and U = {1,2,3,4,5}, what is A ∩ U?", options:["{1,2,3}","{4,5}","U","{ }"], answer:0, difficulty:"application" },
  { q:"Which set acts like \"0\" (no change) for union, and which acts like a \"do-nothing\" for intersection?", options:["∅ for union, U for intersection","U for union, ∅ for intersection","∅ for both","U for both"], answer:0, difficulty:"conceptual" },
  { q:"The Identity Law is best compared to which arithmetic fact?", options:["5 + 0 = 5 and 5 × 1 = 5","5 × 0 = 0","5 − 5 = 0","5 ÷ 5 = 1"], answer:0, difficulty:"medium" }
]},
{ topicId:24, questions:[
  { q:"The Domination Law for union states:", options:["A ∪ U = U","A ∪ ∅ = A","A ∪ A = A","A ∪ A' = U"], answer:0, difficulty:"easy" },
  { q:"The Domination Law for intersection states:", options:["A ∩ ∅ = ∅","A ∩ U = A","A ∩ A = A","A ∩ A' = ∅"], answer:0, difficulty:"easy" },
  { q:"Domination Law is often confused with which other law?", options:["Idempotent Law","Identity Law","Commutative Law","Associative Law"], answer:1, difficulty:"conceptual" },
  { q:"If A = {1,2}, U = {1,2,3,4,5}, what is A ∪ U?", options:["{1,2,3,4,5}","{1,2}","{ }","{3,4,5}"], answer:0, difficulty:"application" },
  { q:"What is A ∩ ∅ for any set A?", options:["A","∅","U","A'"], answer:1, difficulty:"medium" },
  { q:"In Domination Law, which set \"wins\" (dominates) in a union operation?", options:["A","U","∅","A'"], answer:1, difficulty:"medium" }
]},
{ topicId:25, questions:[
  { q:"The Idempotent Law states:", options:["A ∪ A = A and A ∩ A = A","A ∪ ∅ = A","A ∪ U = U","A ∪ A' = U"], answer:0, difficulty:"easy" },
  { q:"Does A ∪ A double the number of elements in A?", options:["Yes, elements are counted twice","No, sets don't repeat elements, so A ∪ A = A","Only for infinite sets","Only for empty sets"], answer:1, difficulty:"conceptual" },
  { q:"If A = {x,y,z}, what is A ∩ A?", options:["{x,y,z}","{ }","{x,y,z,x,y,z}","U"], answer:0, difficulty:"application" },
  { q:"Idempotent Law applies to which operations?", options:["Union and intersection only","Complement only","Difference only","Subset only"], answer:0, difficulty:"medium" },
  { q:"\"Idempotent\" roughly means:", options:["Doing an operation with itself changes nothing new","The result is always empty","The result is always the universal set","The operation cannot be repeated"], answer:0, difficulty:"conceptual" },
  { q:"A = {2,4,6}. What is A ∪ A?", options:["{2,4,6}","{2,2,4,4,6,6}","{ }","U"], answer:0, difficulty:"application" }
]},
{ topicId:26, questions:[
  { q:"Which is a correct Complement Law?", options:["A ∪ A' = U","A ∪ A' = ∅","A ∩ A' = A","A ∩ A' = U"], answer:0, difficulty:"easy" },
  { q:"The other Complement Law states:", options:["A ∩ A' = ∅","A ∩ A' = U","A ∪ A' = ∅","A ∪ A' = A"], answer:0, difficulty:"easy" },
  { q:"What does (A')' equal?", options:["A","U","∅","A'"], answer:0, difficulty:"medium" },
  { q:"U = {1,2,3,4,5}, A = {1,2}. Find A' and then A ∪ A'.", options:["A'={3,4,5}, A∪A'={1,2,3,4,5}","A'={1,2}, A∪A'={1,2}","A'={ }, A∪A'={1,2}","A'=U, A∪A'=U"], answer:0, difficulty:"application" },
  { q:"Can A and A' ever share a common element?", options:["Yes, sometimes","No, never — their intersection is always empty","Yes, if A is infinite","Yes, if U is empty"], answer:1, difficulty:"conceptual" },
  { q:"(A')' = A is best compared to which everyday idea?", options:["A double negative in English, like \"not not happy\" = \"happy\"","Adding zero to a number","Multiplying by one","Squaring a number"], answer:0, difficulty:"medium" }
]},
{ topicId:27, questions:[
  { q:"De Morgan's first law states:", options:["(A ∪ B)' = A' ∩ B'","(A ∪ B)' = A' ∪ B'","(A ∩ B)' = A' ∩ B'","A ∪ B = B ∪ A"], answer:0, difficulty:"easy" },
  { q:"De Morgan's second law states:", options:["(A ∩ B)' = A' ∪ B'","(A ∩ B)' = A ∩ B","(A ∩ B)' = A' ∩ B'","(A ∩ B)' = U"], answer:0, difficulty:"easy" },
  { q:"When you break open a complement bracket over ∪ or ∩, De Morgan's Law says you should:", options:["Keep the same symbol (∪ stays ∪)","Switch the symbol (∪ becomes ∩, and ∩ becomes ∪)","Remove the operation entirely","Always get the empty set"], answer:1, difficulty:"conceptual" },
  { q:"U={1,...,6}, A={1,2,3}, B={3,4,5}. Find (A∪B)' and A'∩B' — are they equal?", options:["Both equal {6} — confirming De Morgan's Law","(A∪B)'={6}, A'∩B'={1,2,4,5} — not equal","Both equal {1,2,4,5,6}","Both equal { }"], answer:0, difficulty:"application" },
  { q:"What is the single most common mistake students make with De Morgan's Laws?", options:["Forgetting to switch ∪ and ∩ when the bracket breaks open","Forgetting the universal set exists","Writing sets in the wrong color","Using roster form instead of set-builder form"], answer:0, difficulty:"conceptual" },
  { q:"U={1,...,8}, A={1,2,3,4}, B={3,4,5,6}. Find (A∩B)' and A'∪B'.", options:["(A∩B)'={1,2,5,6,7,8}, A'∪B'={1,2,5,6,7,8} — equal","(A∩B)'={3,4}, A'∪B'={1,2,5,6,7,8} — not equal","(A∩B)'={1,2,5,6,7,8}, A'∪B'={3,4} — not equal","Both are empty"], answer:0, difficulty:"application" }
]}
);

/* Flatten into the final mcqs array with sequential global ids */
const mcqs = [];
(function buildMcqs(){
  let idc = 1;
  mcqTopicBlocks.forEach(function(block){
    block.questions.forEach(function(q){
      mcqs.push({ id: idc, topicId: block.topicId, question: q.q, options: q.options, answer: q.answer, difficulty: q.difficulty });
      idc++;
    });
  });
})();

/* MCQ test is split into 6 topic-coherent parts, 27 questions each = 162 total */
const MCQ_PARTS = [
  { title:"Part 1 · Sets Basics", topics:[1,2,3,4,5] },
  { title:"Part 2 · Special Set Types", topics:[6,7,8,9,10] },
  { title:"Part 3 · Subsets, Universal Set & Venn Diagrams", topics:[11,12,13,14] },
  { title:"Part 4 · Set Operations", topics:[15,16,17,18] },
  { title:"Part 5 · Laws of Sets I", topics:[19,20,21,22,23] },
  { title:"Part 6 · Laws of Sets II", topics:[24,25,26,27] }
];
function getMcqsForPart(partIndex){
  const part = MCQ_PARTS[partIndex];
  if(!part) return [];
  return mcqs.filter(function(m){ return part.topics.indexOf(m.topicId) !== -1; });
}
function getPartIndexForMcqId(mcqId){
  const m = mcqs.find(function(x){ return x.id === mcqId; });
  if(!m) return 0;
  for(let i=0;i<MCQ_PARTS.length;i++){ if(MCQ_PARTS[i].topics.indexOf(m.topicId) !== -1) return i; }
  return 0;
}

/* ---------------------------------------------------------------------------
   HELPERS
--------------------------------------------------------------------------- */
function pad2(n){ return n < 10 ? '0' + n : '' + n; }
function firstIncompleteTopicId(){
  for(let i=0;i<topics.length;i++){
    if(state.completedTopics.indexOf(topics[i].id) === -1) return topics[i].id;
  }
  return null;
}
function toggleTopicComplete(topicId){
  const idx = state.completedTopics.indexOf(topicId);
  if(idx === -1){ state.completedTopics.push(topicId); showToast('Topic marked as completed'); }
  else { state.completedTopics.splice(idx,1); showToast('Marked as not completed'); }
  saveState();
  renderTopicLearning(topicId);
}
function levelInfo(p){
  if(p >= 90) return { text:'Excellent', icon:'trophy', tone:'amber' };
  if(p >= 80) return { text:'Very Good', icon:'flame', tone:'rose' };
  if(p >= 70) return { text:'Good', icon:'thumbs-up', tone:'green' };
  if(p >= 60) return { text:'Developing', icon:'trending-up', tone:'blue' };
  return { text:'Needs Improvement', icon:'book-open', tone:'violet' };
}
function levelPill(lv){
  return '<div class="result-hero__level level-pill tone-' + lv.tone + '">' + ic(lv.icon) + '<span>' + esc(lv.text) + '</span></div>';
}
function scoreRing(pct, big, small){
  const r = 54, c = 2 * Math.PI * r;
  const off = c - (c * Math.max(0, Math.min(100, pct)) / 100);
  return '<div class="score-ring"><svg viewBox="0 0 128 128" aria-hidden="true">'
    + '<circle class="ring-track" cx="64" cy="64" r="' + r + '"></circle>'
    + '<circle class="ring-fill" cx="64" cy="64" r="' + r + '" stroke="url(#ringGrad)" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"></circle>'
    + '</svg><div class="score-ring__label"><b>' + esc(big) + '</b><span>' + esc(small) + '</span></div></div>';
}
function emptyState(icon, msg){
  return '<div class="empty-state"><span class="empty-state__icon">' + ic(icon) + '</span><p>' + esc(msg) + '</p></div>';
}

/* ---------------------------------------------------------------------------
   RENDER: HOME
--------------------------------------------------------------------------- */
function renderHome(){
  const doneCount = state.completedTopics.length;
  const pct = Math.round((doneCount/topics.length)*100);
  const ring = el('home-ring-fill');
  if(ring) ring.style.strokeDashoffset = String(264 - (264 * pct / 100));
  const pctLabel = el('home-ring-pct'); if(pctLabel) pctLabel.textContent = pct + '%';
  const doneLabel = el('home-topics-done'); if(doneLabel) doneLabel.textContent = doneCount;
  const totalLabel = el('home-topics-total'); if(totalLabel) totalLabel.textContent = topics.length;

  const nextId = firstIncompleteTopicId();
  const nextTopic = nextId ? topics.find(function(t){ return t.id === nextId; }) : null;
  const cta = el('home-cta-label');
  if(cta) cta.textContent = nextTopic ? (doneCount > 0 ? 'Continue Learning' : 'Start Learning') : 'Take the Chapter Quiz';

  const quizRow = el('home-quiz-row');
  if(quizRow){
    if(state.mcqSubmitted && state.mcqResult){
      quizRow.innerHTML = 'Quiz score: <b>' + state.mcqResult.score + '/' + state.mcqResult.total + '</b> (' + state.mcqResult.percentage + '%)';
    } else {
      const answered = Object.keys(state.mcqAnswers).length;
      quizRow.textContent = answered > 0 ? ('Quiz in progress: ' + answered + '/' + mcqs.length + ' answered') : 'Quiz not attempted yet';
    }
  }
  const lastRow = el('home-last-row');
  const lastTopicLabel = el('home-last-topic');
  if(lastRow && lastTopicLabel){
    const t = state.lastTopicId ? topics.find(function(x){ return x.id === state.lastTopicId; }) : null;
    if(t){ lastRow.style.display = ''; lastTopicLabel.textContent = 'Topic ' + pad2(t.id) + ' — ' + t.title; }
    else { lastRow.style.display = 'none'; }
  }

  const qa = [
    { ic:'graduation', label:'Continue Learning', sub: nextTopic ? ('Topic ' + pad2(nextTopic.id) + ' · ' + nextTopic.title) : 'All topics done', nav:'topicLearning', cont:true, tone:'cyan' },
    { ic:'sigma', label:'Formula Sheet', sub:'Laws & notation', nav:'formulaSheet', tone:'indigo' },
    { ic:'venn', label:'Visual Learning', sub:'8 diagrams', nav:'visualLearning', tone:'teal' },
    { ic:'clipboard-check', label:'Chapter Quiz', sub: mcqs.length + ' MCQs', nav:'mcqTest', tone:'amber' },
    { ic:'pen', label:'Descriptive Qs', sub: descriptiveQuestions.length + ' questions', nav:'descriptive', tone:'rose' },
    { ic:'file-text', label:'Quick Notes', sub:'Fast revision', nav:'quickNotes', tone:'violet' }
  ];
  setHTML('home-qa-grid', qa.map(function(item){
    return '<button class="qa-card tone-' + item.tone + '" data-nav="' + item.nav + '"' + (item.cont ? ' data-continue="1"' : '') + '>'
      + '<span class="badge-ic">' + ic(item.ic) + '</span>'
      + '<span class="qa-card__label">' + esc(item.label) + '</span>'
      + '<span class="qa-card__sub">' + esc(item.sub) + '</span></button>';
  }).join(''));
}

/* ---------------------------------------------------------------------------
   RENDER: CHAPTER START
--------------------------------------------------------------------------- */
function renderChapterStart(){
  const tc = el('cs-topic-count'); if(tc) tc.textContent = topics.length;
  const mc = el('cs-mcq-count'); if(mc) mc.textContent = mcqs.length;
  const fc = el('cs-final-count'); if(fc) fc.textContent = descriptiveQuestions.length;
  const qs = el('cs-quiz-sub'); if(qs) qs.textContent = mcqs.length + ' MCQs · ' + MCQ_PARTS.length + ' parts · one combined result';
}

/* ---------------------------------------------------------------------------
   RENDER: TOPIC LIST (+ search)
--------------------------------------------------------------------------- */
function renderTopicList(query){
  query = (query || '').trim().toLowerCase();
  const filtered = topics.filter(function(t){
    if(!query) return true;
    return t.title.toLowerCase().indexOf(query) !== -1 || t.definition.toLowerCase().indexOf(query) !== -1;
  });
  const doneCount = state.completedTopics.length;
  const donePct = Math.round((doneCount/topics.length)*100);
  const pbarFill = el('tl-pbar-fill'); if(pbarFill) pbarFill.style.width = donePct + '%';
  const pbarText = el('tl-pbar-text'); if(pbarText) pbarText.textContent = doneCount + ' / ' + topics.length + ' completed';
  const pbarPct = el('tl-pbar-pct'); if(pbarPct) pbarPct.textContent = donePct + '%';

  if(filtered.length === 0){
    setHTML('topic-list-container', emptyState('search', 'No topic found. Try another word.'));
    return;
  }
  setHTML('topic-list-container', filtered.map(function(t){
    const isDone = state.completedTopics.indexOf(t.id) !== -1;
    const cls = 'topic-card' + (isDone ? ' is-done' : '') + (t.isLast ? ' is-last' : '');
    let badges = '';
    if(t.isLast) badges += '<span class="badge badge--last">' + ic('flag') + 'Last Topic</span>';
    if(isDone) badges += '<span class="badge badge--done">' + ic('check') + 'Completed</span>';
    else badges += '<span class="badge badge--todo">Start Learning</span>';
    return '<button class="' + cls + '" data-action="open-topic" data-topic-id="' + t.id + '">'
      + '<span class="topic-card__num">' + (isDone ? ic('check') : pad2(t.id)) + '</span>'
      + '<span class="topic-card__body"><span class="topic-card__kicker">Topic ' + pad2(t.id) + '</span>'
      + '<span class="topic-card__title">' + esc(t.title) + '</span>'
      + '<span class="topic-card__meta">' + badges + '</span></span>'
      + '<span class="topic-card__arrow">' + ic('chevron-right') + '</span>'
      + '</button>';
  }).join(''));
}

/* ---------------------------------------------------------------------------
   RENDER: TOPIC LEARNING
--------------------------------------------------------------------------- */
function vcard(tone, icon, label, inner, extra){
  return '<section class="vcard tone-' + tone + (extra ? ' ' + extra : '') + '">'
    + '<header class="vcard__head"><span class="badge-ic badge-ic--sm">' + ic(icon) + '</span><h2 class="vcard__label">' + esc(label) + '</h2></header>'
    + inner + '</section>';
}
function vtext(t){ return '<p class="vcard__text">' + esc(t) + '</p>'; }
function vlist(items, kind){
  return '<ul class="vcard__list vcard__list--' + kind + '">' + items.map(function(i){ return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
}

function renderTopicLearning(topicId){
  if(!topicId) topicId = 1;
  const t = topics.find(function(x){ return x.id === topicId; });
  if(!t){ setHTML('topic-learning-container', emptyState('search', 'Topic not found.')); return; }

  currentTopicId = t.id;
  state.lastTopicId = t.id;
  saveState();

  const isDone = state.completedTopics.indexOf(t.id) !== -1;
  const pos = Math.round((t.id / topics.length) * 100);

  let html = '';
  html += '<div class="lesson-head"><span class="chip chip--mono">Topic ' + pad2(t.id) + ' / ' + topics.length + '</span>'
        + (t.isLast ? '<span class="badge badge--last">' + ic('flag') + 'Last Topic</span>' : '')
        + (isDone ? '<span class="badge badge--done">' + ic('check') + 'Completed</span>' : '') + '</div>';
  html += '<h1 class="page-title">' + esc(t.title) + '</h1>';
  html += '<div class="pbar pbar--thin" aria-hidden="true"><div class="pbar__fill" style="width:' + pos + '%"></div></div>';
  if(t.isLast){
    html += '<div class="last-topic-strip">' + ic('flag') + '<span><b>LAST TOPIC</b> — De Morgan\u2019s Laws closes Chapter 01.</span></div>';
  }
  html += vcard('blue', 'bookmark', 'Definition', vtext(t.definition));
  html += vcard('amber', 'message', 'Feynman Explanation', vtext(t.feynman), 'vcard--feynman');
  html += vcard('cyan', 'calculator', 'Mathematical Example', vtext(t.mathExample));
  html += vcard('green', 'globe', 'Real-Life Example', vtext(t.realLife));
  html += vcard('violet', 'list-ordered', 'Step-by-Step', vlist(t.steps, 'steps'));
  html += vcard('rose', 'alert-triangle', 'Common Mistakes', vlist(t.mistakes, 'dots'));
  html += vcard('amber', 'lightbulb', 'Feynman Memory Trick', vtext(t.memoryTrick));
  html += '<section class="vcard selfcheck tone-violet">'
        + '<header class="vcard__head"><span class="badge-ic badge-ic--sm">' + ic('help-circle') + '</span><h2 class="vcard__label">Quick Self Check</h2></header>'
        + vtext(t.selfCheck)
        + '<details><summary><span>Show answer</span>' + ic('chevron-down') + '</summary><p class="selfcheck__ans">' + esc(t.selfCheckAnswer) + '</p></details></section>';

  html += '<button class="btn btn-block mark-complete' + (isDone ? ' is-done' : ' btn-secondary') + '" data-action="mark-complete" data-topic-id="' + t.id + '">'
        + ic('check-circle') + '<span>' + (isDone ? 'Completed — tap to undo' : 'Mark as Completed') + '</span></button>';
  html += '<div class="lesson-nav">';
  html += t.id > 1
    ? '<button class="btn btn-secondary" data-action="lesson-prev" data-topic-id="' + t.id + '">' + ic('arrow-left') + '<span>Previous</span></button>'
    : '<button class="btn btn-secondary" disabled>' + ic('arrow-left') + '<span>Previous</span></button>';
  html += t.isLast
    ? '<button class="btn btn-warm" data-action="finish-chapter" data-topic-id="' + t.id + '">' + ic('flag') + '<span>Finish Chapter</span></button>'
    : '<button class="btn btn-primary" data-action="lesson-next" data-topic-id="' + t.id + '"><span>Next Topic</span>' + ic('arrow-right') + '</button>';
  html += '</div>';

  setHTML('topic-learning-container', html);
}

/* ---------------------------------------------------------------------------
   RENDER: FORMULA SHEET / VISUALS / QUICK NOTES
--------------------------------------------------------------------------- */
function renderFormulaSheet(){
  setHTML('formula-container', formulaGroups.map(function(group){
    return '<section class="formula-group"><h2 class="formula-group__title"><span class="dot"></span>' + esc(group.title) + '</h2>'
      + group.items.map(function(item){
          return '<div class="formula-card"><div class="formula-card__law">' + esc(item.law) + '</div><div class="formula-card__hint">' + esc(item.hint) + '</div></div>';
        }).join('')
      + '</section>';
  }).join(''));
}

let _visualsCache = null;
function renderVisualLearning(){
  if(!_visualsCache) _visualsCache = buildVisuals();
  setHTML('visual-container', _visualsCache.map(function(v, i){
    return '<article class="card visual-card">'
      + '<div class="visual-card__svgwrap">' + v.svg + '</div>'
      + '<div class="visual-card__row"><span class="visual-card__num">' + pad2(i+1) + '</span><h2 class="visual-card__title">' + esc(v.title) + '</h2></div>'
      + '<p class="visual-card__caption">' + esc(v.caption) + '</p>'
      + '<a class="visual-card__link" href="' + esc(v.link) + '" target="_blank" rel="noopener noreferrer"><span>Explore more online (needs internet)</span>' + ic('external-link') + '</a>'
      + '</article>';
  }).join(''));
}

function renderQuickNotes(){
  setHTML('quicknotes-container', quickNotes.map(function(n, i){
    return '<div class="note-block"><span class="note-block__idx">' + pad2(i+1) + '</span><div>'
      + '<div class="note-block__title">' + esc(n.title) + '</div><div class="note-block__body">' + esc(n.body) + '</div></div></div>';
  }).join(''));
}

/* ---------------------------------------------------------------------------
   MCQ ENGINE
--------------------------------------------------------------------------- */
function selectMcqAnswer(mcqId, optionIndex){
  state.mcqAnswers[mcqId] = optionIndex;
  saveState();
  renderMCQTest(currentMcqPart, currentMcqIndexInPart);
}

function mcqStep(direction){
  const partQs = getMcqsForPart(currentMcqPart);
  let newIndex = currentMcqIndexInPart + direction;
  let newPart = currentMcqPart;
  if(newIndex < 0){
    if(newPart > 0){ newPart -= 1; newIndex = getMcqsForPart(newPart).length - 1; }
    else { newIndex = 0; }
  } else if(newIndex >= partQs.length){
    if(newPart < MCQ_PARTS.length - 1){ newPart += 1; newIndex = 0; }
    else { newIndex = partQs.length - 1; }
  }
  renderMCQTest(newPart, newIndex);
}

function renderMCQTest(partIndex, qIndexInPart){
  const freshEntry = (typeof partIndex !== 'number' && typeof qIndexInPart !== 'number');
  if(freshEntry){
    const firstUnanswered = mcqs.find(function(m){ return !state.mcqAnswers.hasOwnProperty(m.id); });
    if(firstUnanswered){
      partIndex = getPartIndexForMcqId(firstUnanswered.id);
      const pq0 = getMcqsForPart(partIndex);
      qIndexInPart = pq0.findIndex(function(m){ return m.id === firstUnanswered.id; });
    } else {
      partIndex = currentMcqPart; qIndexInPart = currentMcqIndexInPart;
    }
  }
  if(partIndex < 0) partIndex = 0;
  if(partIndex > MCQ_PARTS.length - 1) partIndex = MCQ_PARTS.length - 1;
  const partQs = getMcqsForPart(partIndex);
  if(qIndexInPart < 0) qIndexInPart = 0;
  if(qIndexInPart > partQs.length - 1) qIndexInPart = partQs.length - 1;
  currentMcqPart = partIndex;
  currentMcqIndexInPart = qIndexInPart;

  const q = partQs[qIndexInPart];
  const totalAnswered = Object.keys(state.mcqAnswers).length;
  const overallPct = Math.round((totalAnswered / mcqs.length) * 100);
  const letters = ['A','B','C','D'];
  const isAnswered = state.mcqAnswers.hasOwnProperty(q.id);

  let html = '';
  html += '<div class="mcq-progress"><div class="pbar"><div class="pbar__fill" style="width:' + overallPct + '%"></div></div>'
        + '<span class="mcq-progress__count">' + totalAnswered + '/' + mcqs.length + '</span></div>';

  html += '<div class="chip-scroll">';
  MCQ_PARTS.forEach(function(p, i){
    const pq = getMcqsForPart(i);
    const answeredInPart = pq.filter(function(m){ return state.mcqAnswers.hasOwnProperty(m.id); }).length;
    const cls = 'part-chip' + (i === partIndex ? ' is-current' : '') + (answeredInPart === pq.length ? ' is-complete' : '');
    html += '<button class="' + cls + '" data-action="mcq-goto-part" data-part="' + i + '"><span>Part ' + (i+1) + '</span><small>' + answeredInPart + '/' + pq.length + '</small></button>';
  });
  html += '</div>';

  html += '<section class="card mcq-card">';
  html += '<div class="mcq-meta"><span class="mcq-part-title">' + esc(MCQ_PARTS[partIndex].title) + '</span><span class="mcq-qno">Question ' + (qIndexInPart+1) + ' of ' + partQs.length + '</span></div>';
  html += '<div class="chip-row"><span class="badge badge--id">Q' + q.id + '</span><span class="badge badge--' + q.difficulty + '">' + esc(q.difficulty) + '</span></div>';
  html += '<p class="mcq-q">' + esc(q.question) + '</p>';
  html += '<div class="mcq-opts">';
  q.options.forEach(function(opt, i){
    const selected = state.mcqAnswers[q.id] === i;
    html += '<button class="mcq-opt' + (selected ? ' is-selected' : '') + '" data-action="mcq-select" data-mcq-id="' + q.id + '" data-option="' + i + '" aria-pressed="' + (selected ? 'true' : 'false') + '">'
          + '<span class="mcq-opt__letter">' + letters[i] + '</span><span class="mcq-opt__text">' + esc(opt) + '</span>'
          + '<span class="mcq-opt__check">' + ic('check') + '</span></button>';
  });
  html += '</div>';
  html += '<p class="mcq-hint">' + ic(isAnswered ? 'check-circle' : 'help-circle') + '<span>' + (isAnswered ? 'Answer saved — you can change it anytime.' : 'Choose one option. Your answer saves automatically.') + '</span></p>';
  html += '</section>';

  const isVeryFirst = (partIndex === 0 && qIndexInPart === 0);
  const isVeryLast = (partIndex === MCQ_PARTS.length - 1 && qIndexInPart === partQs.length - 1);
  html += '<div class="mcq-nav">';
  html += isVeryFirst
    ? '<button class="btn btn-secondary" disabled>' + ic('arrow-left') + '<span>Previous</span></button>'
    : '<button class="btn btn-secondary" data-action="mcq-prev">' + ic('arrow-left') + '<span>Previous</span></button>';
  html += isVeryLast
    ? '<button class="btn btn-warm" data-action="mcq-submit-test">' + ic('flag') + '<span>Finish Test</span></button>'
    : '<button class="btn btn-primary" data-action="mcq-next"><span>Next</span>' + ic('arrow-right') + '</button>';
  html += '</div>';

  html += '<div class="mcq-jump-title">Question palette · ' + esc(MCQ_PARTS[partIndex].title) + '</div>';
  html += '<div class="mcq-palette">';
  partQs.forEach(function(pq, i){
    const answered = state.mcqAnswers.hasOwnProperty(pq.id);
    const isCur = i === qIndexInPart;
    html += '<button class="mcq-palette__item' + (answered ? ' is-answered' : '') + (isCur ? ' is-current' : '') + '" data-action="mcq-jump" data-part="' + partIndex + '" data-index="' + i + '" aria-label="Question ' + (i+1) + (answered ? ' answered' : ' unanswered') + '">' + (i+1) + '</button>';
  });
  html += '</div>';

  if(isVeryLast && totalAnswered < mcqs.length){
    html += '<div class="unanswered-alert">' + ic('alert-triangle') + '<span>' + (mcqs.length - totalAnswered) + ' question(s) are still unanswered in the chapter. If you press Finish Test, the first unanswered question will open.</span></div>';
  }

  setHTML('mcq-container', html);
}

function attemptSubmitTest(){
  const totalAnswered = Object.keys(state.mcqAnswers).length;
  if(totalAnswered < mcqs.length){
    const firstUnanswered = mcqs.find(function(m){ return !state.mcqAnswers.hasOwnProperty(m.id); });
    showToast((mcqs.length - totalAnswered) + ' question(s) left');
    if(firstUnanswered){
      const pi = getPartIndexForMcqId(firstUnanswered.id);
      const pq = getMcqsForPart(pi);
      const qi = pq.findIndex(function(m){ return m.id === firstUnanswered.id; });
      renderMCQTest(pi, qi);
    }
    return;
  }
  let correct = 0;
  mcqs.forEach(function(m){ if(state.mcqAnswers[m.id] === m.answer) correct++; });
  const wrong = mcqs.length - correct;
  const percentage = Math.round((correct / mcqs.length) * 10000) / 100;
  state.mcqResult = { score: correct, total: mcqs.length, percentage: percentage, correct: correct, wrong: wrong, level: { text: levelInfo(percentage).text } };
  state.mcqSubmitted = true;
  saveState();
  navigateTo('mcqResults');
}

function renderMCQResults(){
  if(!state.mcqSubmitted || !state.mcqResult){
    setHTML('results-container', emptyState('clipboard-check', 'The test is not complete yet — answer all ' + mcqs.length + ' MCQs first.'));
    return;
  }
  const r = state.mcqResult;
  const lv = levelInfo(r.percentage);
  let html = '<section class="card result-card">';
  html += '<span class="eyebrow eyebrow--icon">' + ic('sparkles') + 'Chapter 01 Complete</span>';
  html += scoreRing(r.percentage, r.percentage + '%', 'percentage');
  html += '<div class="result-hero__score">' + r.score + ' <span>/ ' + r.total + '</span></div>';
  html += levelPill(lv);
  html += '</section>';
  html += '<div class="stat-grid">';
  html += '<div class="stat-box stat-box--ok"><span class="stat-box__ic">' + ic('check-circle') + '</span><div class="stat-box__val">' + r.correct + '</div><div class="stat-box__label">Correct</div></div>';
  html += '<div class="stat-box stat-box--bad"><span class="stat-box__ic">' + ic('x-circle') + '</span><div class="stat-box__val">' + r.wrong + '</div><div class="stat-box__label">Wrong</div></div>';
  html += '<div class="stat-box"><span class="stat-box__ic">' + ic('list-checks') + '</span><div class="stat-box__val">' + r.total + '/' + r.total + '</div><div class="stat-box__label">Attempted</div></div>';
  html += '</div>';
  html += '<div class="pbar" style="margin-top:16px;"><div class="pbar__fill" style="width:' + r.percentage + '%"></div></div>';
  html += '<div class="btn-row btn-row--col">'
        + '<button class="btn btn-primary btn-block" data-action="view-mistakes">' + ic('target') + '<span>Mistake Analysis</span></button>'
        + '<button class="btn btn-secondary btn-block" data-action="go-descriptive">' + ic('pen') + '<span>Continue to Descriptive Questions</span></button></div>';
  setHTML('results-container', html);
}

function renderMistakeAnalysis(){
  if(!state.mcqSubmitted){
    setHTML('mistake-container', emptyState('clipboard-check', 'Complete the chapter quiz first.'));
    return;
  }
  const letters = ['A','B','C','D'];
  const wrongOnes = mcqs.filter(function(m){ return state.mcqAnswers[m.id] !== m.answer; });

  if(wrongOnes.length === 0){
    setHTML('mistake-container', '<div class="perfect-banner tone-amber"><span class="badge-ic badge-ic--lg">' + ic('star') + '</span><h2 class="section-title">Perfect score!</h2><p class="lede">No mistakes found — all ' + mcqs.length + ' answers are correct. Mashallah!</p></div>');
    return;
  }

  const topicMistakeCount = {};
  wrongOnes.forEach(function(m){ topicMistakeCount[m.topicId] = (topicMistakeCount[m.topicId] || 0) + 1; });
  const reviseList = Object.keys(topicMistakeCount).map(function(tid){ return { topicId: +tid, count: topicMistakeCount[tid] }; })
    .sort(function(a,b){ return b.count - a.count; });

  let html = '<p class="lede">' + wrongOnes.length + ' question(s) were incorrect. Check the revision list first, then review each question below.</p>';
  html += '<h2 class="section-title">' + ic('target') + 'Topics You Need to Revise</h2>';
  html += '<div class="revise-list">';
  reviseList.forEach(function(item, i){
    const t = topics.find(function(x){ return x.id === item.topicId; });
    html += '<div class="revise-item"><span class="revise-item__rank">' + (i+1) + '</span>'
          + '<span class="revise-item__name">' + esc(t ? t.title : ('Topic ' + item.topicId)) + '</span>'
          + '<span class="revise-item__count">' + item.count + ' wrong</span></div>';
  });
  html += '</div>';

  html += '<h2 class="section-title">' + ic('x-circle') + 'Wrong Answers</h2>';
  wrongOnes.forEach(function(m){
    const t = topics.find(function(x){ return x.id === m.topicId; });
    const yourAns = state.mcqAnswers.hasOwnProperty(m.id) ? letters[state.mcqAnswers[m.id]] : '—';
    html += '<div class="card mistake-card">'
      + '<div class="mistake-card__head"><span class="mistake-card__q">Q' + m.id + '</span><span class="badge badge--wrong">' + ic('x-circle') + 'Incorrect</span></div>'
      + '<div class="mistake-card__text">' + esc(m.question) + '</div>'
      + '<div class="mistake-card__row">'
      + '<div class="mistake-card__col"><div class="mistake-card__k">Your Answer</div><div class="mistake-card__v wrong">' + yourAns + '</div></div>'
      + '<div class="mistake-card__col"><div class="mistake-card__k">Correct Answer</div><div class="mistake-card__v right">' + letters[m.answer] + '</div></div>'
      + '</div>'
      + '<div class="mistake-card__topic">' + ic('tag') + '<span>Topic: ' + esc(t ? t.title : '') + '</span></div>'
      + '</div>';
  });

  setHTML('mistake-container', html);
}

/* ---------------------------------------------------------------------------
   DESCRIPTIVE QUESTIONS
--------------------------------------------------------------------------- */
function renderDescriptive(){
  let html = '';
  descriptiveQuestions.forEach(function(q){
    const savedAnswer = state.descriptiveAnswers[q.id] || '';
    html += '<div class="card desc-q"><div class="desc-q__top"><span class="desc-q__num">Question ' + q.id + '</span><span class="q-marks-pill">' + q.maxMarks + ' marks</span></div>'
      + '<div class="desc-q__text">' + esc(q.question) + '</div>'
      + '<textarea class="desc-input" data-qid="' + q.id + '" placeholder="Write your answer here..." aria-label="Answer for question ' + q.id + '">' + esc(savedAnswer) + '</textarea>'
      + '</div>';
  });
  html += '<button class="btn btn-primary btn-block" style="margin-top:18px;" data-action="descriptive-submit">' + ic('check-circle') + '<span>Submit Answers</span></button>';
  setHTML('descriptive-container', html);

  document.querySelectorAll('#descriptive-container textarea[data-qid]').forEach(function(ta){
    ta.addEventListener('input', function(){
      state.descriptiveAnswers[ta.getAttribute('data-qid')] = ta.value;
      saveState();
    });
  });
}

function submitDescriptive(){
  state.descriptiveSubmitted = true;
  saveState();
  navigateTo('descriptiveResults');
}

function rubricEarnedMarks(q){
  const checks = state.descriptiveChecks[q.id] || {};
  let sum = 0;
  q.rubric.forEach(function(crit, ci){ if(checks[ci]) sum += crit.marks; });
  return sum;
}
function computeDescriptiveTotals(){
  let earned = 0, max = 0;
  descriptiveQuestions.forEach(function(q){ earned += rubricEarnedMarks(q); max += q.maxMarks; });
  const percentage = max > 0 ? Math.round((earned/max) * 10000) / 100 : 0;
  return { earned: earned, max: max, percentage: percentage };
}

function renderDescriptiveResults(){
  if(!state.descriptiveSubmitted){
    setHTML('descresults-container', emptyState('pen', 'Submit the descriptive questions first.'));
    return;
  }
  let html = '<p class="lede">Your answers are shown below. Compare them with the model answer, then tick every rubric point you covered — marks add up automatically.</p>';

  descriptiveQuestions.forEach(function(q){
    const savedAnswer = state.descriptiveAnswers[q.id] || '(no answer written)';
    html += '<div class="card desc-q"><div class="desc-q__top"><span class="desc-q__num">Question ' + q.id + '</span><span class="q-marks-pill">' + rubricEarnedMarks(q) + ' / ' + q.maxMarks + '</span></div>';
    html += '<div class="desc-q__text">' + esc(q.question) + '</div>';
    html += '<div class="answer-box"><div class="answer-box__label">' + ic('pen') + 'Your Answer</div><div class="answer-box__text">' + esc(savedAnswer) + '</div></div>';
    html += '<div class="model-answer"><details><summary>' + ic('book-open') + '<span>Model answer — key points</span>' + ic('chevron-down') + '</summary><div class="model-answer__body"><ul>'
      + q.modelPoints.map(function(p){ return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div></details></div>';
    html += '<div class="rubric-box"><div class="rubric-box__title">Self-assessment rubric</div>';
    q.rubric.forEach(function(crit, ci){
      const checked = (state.descriptiveChecks[q.id] && state.descriptiveChecks[q.id][ci]) ? 'checked' : '';
      html += '<label class="rubric-item"><input type="checkbox" data-action="rubric-toggle" data-qid="' + q.id + '" data-crit="' + ci + '" ' + checked + '>'
        + '<span><span class="rubric-item__label">' + esc(crit.label) + '</span> <span class="rubric-item__marks">(' + crit.marks + ' marks)</span></span></label>';
    });
    html += '<div class="pbar-row"><span>Marks obtained</span><span><b>' + rubricEarnedMarks(q) + ' / ' + q.maxMarks + '</b></span></div>';
    html += '</div></div>';
  });

  const totals = computeDescriptiveTotals();
  const lv = levelInfo(totals.percentage);
  html += '<section class="card result-card">'
    + '<span class="eyebrow eyebrow--icon">' + ic('sparkles') + 'Total marks</span>'
    + scoreRing(totals.percentage, totals.percentage + '%', 'percentage')
    + '<div class="result-hero__score">' + totals.earned + ' <span>/ ' + totals.max + '</span></div>'
    + levelPill(lv) + '</section>';

  setHTML('descresults-container', html);
}

/* ---------------------------------------------------------------------------
   ACTION DISPATCH
--------------------------------------------------------------------------- */
function handleAction(action, node){
  if(action === 'open-topic'){
    navigateTo('topicLearning', { topicId: parseInt(node.getAttribute('data-topic-id'), 10) });
  } else if(action === 'mark-complete'){
    toggleTopicComplete(parseInt(node.getAttribute('data-topic-id'), 10));
  } else if(action === 'lesson-prev'){
    const id = parseInt(node.getAttribute('data-topic-id'), 10);
    if(id > 1) navigateTo('topicLearning', { topicId: id - 1 });
  } else if(action === 'lesson-next'){
    const id = parseInt(node.getAttribute('data-topic-id'), 10);
    if(id < topics.length) navigateTo('topicLearning', { topicId: id + 1 });
  } else if(action === 'finish-chapter'){
    navigateTo('chapterComplete');
  } else if(action === 'mcq-select'){
    selectMcqAnswer(parseInt(node.getAttribute('data-mcq-id'), 10), parseInt(node.getAttribute('data-option'), 10));
  } else if(action === 'mcq-prev'){
    mcqStep(-1);
  } else if(action === 'mcq-next'){
    mcqStep(1);
  } else if(action === 'mcq-jump'){
    renderMCQTest(parseInt(node.getAttribute('data-part'), 10), parseInt(node.getAttribute('data-index'), 10));
  } else if(action === 'mcq-goto-part'){
    const p = parseInt(node.getAttribute('data-part'), 10);
    const partQs = getMcqsForPart(p);
    let idx = partQs.findIndex(function(m){ return !state.mcqAnswers.hasOwnProperty(m.id); });
    if(idx === -1) idx = 0;
    renderMCQTest(p, idx);
  } else if(action === 'mcq-submit-test'){
    attemptSubmitTest();
  } else if(action === 'view-mistakes'){
    navigateTo('mistakeAnalysis');
  } else if(action === 'go-descriptive'){
    navigateTo('descriptive');
  } else if(action === 'descriptive-submit'){
    submitDescriptive();
  }
}

/* ---------------------------------------------------------------------------
   INIT
--------------------------------------------------------------------------- */
function initApp(){
  hydrateIcons();
  applyTheme(loadTheme());

  const backBtn = document.getElementById('btn-back');
  const themeBtn = document.getElementById('btn-theme');
  if(backBtn) backBtn.addEventListener('click', goBack);
  if(themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const searchInput = document.getElementById('topic-search');
  if(searchInput){
    searchInput.addEventListener('input', function(){ renderTopicList(searchInput.value); });
  }

  document.addEventListener('click', function(e){
    const navEl = e.target.closest('[data-nav]');
    if(navEl){
      const screen = navEl.getAttribute('data-nav');
      if(navEl.hasAttribute('data-continue')){
        const fi = firstIncompleteTopicId();
        if(fi) navigateTo('topicLearning', { topicId: fi });
        else navigateTo('mcqTest');
      } else if(navEl.hasAttribute('data-topic-id')){
        navigateTo(screen, { topicId: parseInt(navEl.getAttribute('data-topic-id'), 10) });
      } else {
        navigateTo(screen);
      }
      return;
    }
    const actionEl = e.target.closest('[data-action]');
    if(actionEl && actionEl.tagName !== 'INPUT'){ handleAction(actionEl.getAttribute('data-action'), actionEl); }
  });

  document.addEventListener('change', function(e){
    const cb = e.target.closest('[data-action="rubric-toggle"]');
    if(cb){
      const qid = cb.getAttribute('data-qid');
      const crit = cb.getAttribute('data-crit');
      if(!state.descriptiveChecks[qid]) state.descriptiveChecks[qid] = {};
      state.descriptiveChecks[qid][crit] = cb.checked;
      saveState();
      renderDescriptiveResults();
    }
  });

  /* Install-app button (only appears when the browser says the app is installable) */
  let deferredInstall = null;
  const installBtn = document.getElementById('install-btn');
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredInstall = e;
    if(installBtn && !isStandalone) installBtn.classList.remove('is-hidden');
  });
  window.addEventListener('appinstalled', function(){
    deferredInstall = null;
    if(installBtn) installBtn.classList.add('is-hidden');
    showToast('App installed');
  });
  if(installBtn){
    installBtn.addEventListener('click', function(){
      if(!deferredInstall) return;
      deferredInstall.prompt();
      deferredInstall.userChoice.then(function(){ deferredInstall = null; installBtn.classList.add('is-hidden'); });
    });
  }

  navigateTo('home');

  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('./service-worker.js').catch(function(){});
    });
  }
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
