// Thennagam Finance LMS — navigation: routing + dashboard + applications list (go, renderDash, sc, renderApps)
// (split from index.html; functions are global by design — called from inline onclick handlers)

function go(page){
  S.page=page;
  document.querySelectorAll('.ni').forEach(function(el){el.classList.remove('on');});
  var n=$('n-'+page); if(n) n.classList.add('on');
  $('tbtitle').textContent=TITLES[page]||page;
  $('succ-screen').style.display='none';
  var c=$('pg');
  if(page==='dash')  c.innerHTML=renderDash();
  else if(page==='apps') c.innerHTML=renderApps();
  else if(page==='new')  {c.innerHTML=renderForm(); S.step=1; S.group='A'; updateSteps();}
  else if(page==='rpt')  c.innerHTML=renderRpt();
  else if(page==='cfg')  c.innerHTML=renderCfg();
}

// ── DASHBOARD ──────────────────────────────────────────────────
function renderDash(){
  var a=S.apps;
  var nw=a.filter(function(x){return cleanSt(x.status)==='NEW';}).length;
 // var ap=a.filter(function(x){return x.status==='APPROVED';}).length;
  var ap=a.filter(function(x){return cleanSt(x.status)==='APPROVED';}).length;
 // var dis=a.filter(function(x){return x.status==='DISBURSED';}).length;
  var dis=a.filter(function(x){return  cleanSt(x.status)==='DISBURSED';}).length;
  var gA=a.filter(function(x){return x.group==='A';}).length;
  var gB=a.filter(function(x){return x.group==='B';}).length;

  var rows=a.slice(0,10).map(function(x,i){
    return '<tr>'+
      '<td><strong style="color:var(--navy)">'+esc(x.app_id)+'</strong></td>'+
      '<td>'+esc(x.name)+'</td><td>'+esc(x.mobile)+'</td>'+
      '<td><span class="badge gr-'+esc(x.group)+'">'+esc(x.group)+'</span></td>'+
      '<td>₹'+fmtN(x.loan_amount)+'</td>'+
      '<td><span class="badge '+stBadge(cleanSt(x.status))+'">'+cleanSt(x.status)+'</span></td>'+
      '<td>'+esc(x.submitted_at)+'</td>'+
      '<td><button class="btn btn-sm btn-o" onclick="viewAppIdx('+i+')">View</button></td>'+
    '</tr>';
  }).join('');

  return '<div class="sgrid">'+
    sc('📋','#e3f2fd',a.length,'Total Applications')+
    sc('🔔','#fff3e0',nw,'New / Pending')+
    sc('✅','#e8f5e9',ap,'Approved')+
    sc('💸','#f3e5f5',dis,'Disbursed')+
    sc('A','#e8f5e9',gA,'Group A')+
    sc('B','#e3f2fd',gB,'Group B')+
  '</div>'+
  '<div class="card">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'+
      '<div class="ctitle" style="margin:0;border:none;padding:0">Recent Applications</div>'+
      '<button class="btn btn-sm btn-o" onclick="loadApps()">🔄 Refresh from Sheet</button>'+
    '</div>'+
    (a.length===0
      ? '<div style="text-align:center;padding:32px;color:var(--muted)">No applications yet. <a href="#" onclick="go(\'new\')" style="color:var(--navy)">Add first →</a></div>'
      : '<div class="tw"><table><tr><th>App ID</th><th>Name</th><th>Mobile</th><th>Group</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr>'+rows+'</table></div>'
    )+
  '</div>';
}

function sc(ico,bg,num,lbl){
  return '<div class="scard"><div class="sico" style="background:'+bg+'">'+ico+'</div>'+
    '<div><div class="snum">'+num+'</div><div class="slbl">'+lbl+'</div></div></div>';
}

// ── ALL APPLICATIONS ───────────────────────────────────────────
function renderApps(){
  var a=S.apps;
  var rows=a.map(function(x,i){
    return '<tr>'+
      '<td><strong style="color:var(--navy)">'+esc(x.app_id)+'</strong></td>'+
      '<td>'+esc(x.name)+'</td><td>'+esc(x.mobile)+'</td>'+
      '<td><span class="badge gr-'+esc(x.group)+'">'+esc(x.group)+'</span></td>'+
      '<td>₹'+fmtN(x.loan_amount)+'</td>'+
      '<td>'+esc(x.purpose)+'</td>'+
      '<td><span class="badge '+stBadge(cleanSt(x.status))+'">'+cleanSt(x.status)+'</span></td>'+
      '<td>'+esc(x.submitted_at)+'</td>'+
      '<td style="display:flex;gap:4px">'+
        '<button class="btn btn-sm btn-o" onclick="viewAppIdx('+i+')">View</button>'+
        '<button class="btn btn-sm btn-gold" onclick="quickPDFIdx('+i+')">PDF</button>'+
      '</td>'+
    '</tr>';
  }).join('');

  return '<div class="card">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'+
      '<div class="ctitle" style="margin:0;border:none;padding:0">All Applications ('+a.length+')</div>'+
      '<button class="btn btn-sm btn-p" onclick="loadApps()">🔄 Refresh</button>'+
    '</div>'+
    (a.length===0
      ? '<div style="text-align:center;padding:32px;color:var(--muted)">No applications yet.<br><a href="#" onclick="go(\'new\')" style="color:var(--navy)">Add first →</a></div>'
      : '<div class="tw"><table><tr><th>App ID</th><th>Name</th><th>Mobile</th><th>Group</th><th>Amount</th><th>Purpose</th><th>Status</th><th>Date</th><th>Actions</th></tr>'+rows+'</table></div>'
    )+
  '</div>';
}

// ── VIEW APPLICATION ───────────────────────────────────────────
