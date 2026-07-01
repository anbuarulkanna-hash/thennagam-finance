// Thennagam Finance LMS — reports & settings (renderRpt, renderCfg, saveUrl, testConnection)
// (split from index.html; functions are global by design — called from inline onclick handlers)

function renderRpt(){
  var a=S.apps;
  var sum=function(arr){return arr.reduce(function(s,x){return s+Number(x.loan_amount||0);},0);};
  return '<div class="card"><div class="ctitle">📈 Portfolio Summary</div>'+
    '<div class="sgrid">'+['A','B','C'].map(function(g){
      var f=a.filter(function(x){return x.group===g;});
      var bg=g==='A'?'#e8f5e9':g==='B'?'#e3f2fd':'#fff3e0';
      return sc(g,bg,f.length,'Group '+g+' — ₹'+(sum(f)/100000).toFixed(1)+'L');
    }).join('')+'</div>'+
    '<div class="tw"><table><tr><th>Status</th><th>Count</th><th>Total Amount</th></tr>'+
    ['NEW','UNDER REVIEW','APPROVED','DISBURSED','REJECTED'].map(function(st){
     var f=a.filter(function(x){
   return cleanSt(x.status)===st;
});
      return '<tr><td><span class="badge '+stBadge(st)+'">'+st+'</span></td>'+
        '<td>'+f.length+'</td><td>₹'+fmtN(sum(f))+'</td></tr>';
    }).join('')+'</table></div></div>';
}

// ── SETTINGS ───────────────────────────────────────────────────
function renderCfg(){
  return '<div class="card"><div class="ctitle">⚙️ Apps Script URL</div>'+
    '<div class="fg" style="margin-bottom:14px">'+
      '<label>Current URL</label>'+
      '<input type="text" id="cfg-url" value="'+esc(SCRIPT_URL)+'" style="font-size:.78rem;font-family:monospace">'+
      '<div style="font-size:.73rem;color:var(--muted);margin-top:4px">Deploy as Web App → Execute as Me → Anyone. Paste new URL here after redeployment.</div>'+
    '</div>'+
    '<button class="btn btn-p" onclick="saveUrl()">💾 Save URL</button>'+
    '<button class="btn btn-o" onclick="testConnection()" style="margin-left:8px">🔍 Test Connection</button>'+
    '<div id="test-result" style="margin-top:12px;font-size:.83rem;min-height:20px"></div>'+
  '</div>'+
  '<div class="card"><div class="ctitle">📊 Google Sheet</div>'+
    '<a href="https://docs.google.com/spreadsheets/d/1RcndhHjrS2fs1pnc5xHT-5nMSBxA7OyPRfRpYDkb8Yg" target="_blank" class="btn btn-o btn-sm" style="text-decoration:none">📊 Open Google Sheet</a>'+
  '</div>';
}

function saveUrl(){
  var url=gv('cfg-url');
  if(!url||url.indexOf('script.google.com')===-1){toast('Enter valid Apps Script URL','err');return;}
  SCRIPT_URL=url; toast('✅ URL saved','ok');
}

function testConnection(){
  var res=$('test-result');
  res.textContent='Testing via JSONP…';
  var cbName='_tfTest_'+Date.now();
  var script=document.createElement('script');
  var timer=setTimeout(function(){
    try{delete window[cbName];script.remove();}catch(e){}
    res.innerHTML='<span style="color:var(--red)">❌ Timeout — not deployed or URL wrong</span>';
  },8000);
  window[cbName]=function(r){
    clearTimeout(timer);
    try{delete window[cbName];script.remove();}catch(e){}
    if(r.ok||r.success){
      res.innerHTML='<span style="color:var(--green)">✅ Connected! v'+(r.version||'?')+' — Working!</span>';
    } else {
      res.innerHTML='<span style="color:var(--red)">⚠️ Connected but error: '+(r.message||'unknown')+'</span>';
    }
  };
  script.onerror=function(){
    clearTimeout(timer);
    res.innerHTML='<span style="color:var(--red)">❌ Script load failed — check URL</span>';
  };
  script.src=gv('cfg-url')+'?action=ping&callback='+cbName+'&t='+Date.now();
  document.head.appendChild(script);
}

// ── PDF ────────────────────────────────────────────────────────
