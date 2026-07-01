// Thennagam Finance LMS — helpers: DOM/util ($ gv esc fmtN cleanSt formatDOB stBadge toast load)
// (split from index.html; functions are global by design — called from inline onclick handlers)


// ── Helpers ────────────────────────────────────────────────────
function $(id){ return document.getElementById(id); }
function gv(id){ var el=$(id); return el?el.value.trim():''; }
function esc(s){ var s2=String(s||''); s2=s2.replace(/&/g,'&amp;'); s2=s2.replace(/\x3C/g,'&lt;'); s2=s2.replace(/\x3E/g,'&gt;'); s2=s2.replace(/"/g,'&quot;'); return s2; }
function fmtN(n){ return Number(n||0).toLocaleString('en-IN'); }
function cleanSt(s){ return (s||'').replace(/\x3C[^\x3E]*\x3E/g,'').trim()||'NEW'; }
function formatDOB(s){
  if(!s||s==='—') return '—';
  // Already formatted like 15/01/1990 or 1990-01-15
  if(/^\d{2}\/\d{2}\/\d{4}$/.test(s)||/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Ugly JS Date string — parse and reformat
  try{
    var d=new Date(s);
    if(isNaN(d.getTime())) return s;
    return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();
  }catch(e){ return s; }
}
function stBadge(s){
  var m={NEW:'st-NEW','UNDER REVIEW':'st-REVIEW',APPROVED:'st-APPROVED',REJECTED:'st-REJECTED',DISBURSED:'st-DISBURSED'};
  return m[cleanSt(s)]||'st-NEW';
}
function toast(msg,type,dur){
  var t=$('toast'); t.textContent=msg; t.className='on '+(type||'');
  clearTimeout(t._t); t._t=setTimeout(function(){t.className='';},dur||3000);
}
function showLoad(title,step,pct){
  $('loading').classList.add('on');
  $('ld-title').textContent=title||'Please wait…';
  $('ld-step').textContent=step||'';
  $('ld-fill').style.width=(pct||0)+'%';
}
function hideLoad(){ $('loading').classList.remove('on'); }

// ── LOGIN ──────────────────────────────────────────────────────
