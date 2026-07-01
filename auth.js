// Thennagam Finance LMS — auth: login / logout
// (split from index.html; functions are global by design — called from inline onclick handlers)

function login(){
  var e=gv('l-email'), p=gv('l-pass'), u=null;
  for(var i=0;i<STAFF.length;i++){if(STAFF[i].email===e&&STAFF[i].pass===p){u=STAFF[i];break;}}
  if(!u){$('l-err').style.display='block';return;}
  S.user=u;
  $('login-page').style.display='none';
  $('app').style.display='block';
  $('su-name').textContent=u.name;
  $('su-role').textContent=u.role;
  $('tbdate').textContent=new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
  // Load apps from sheet every time
  loadApps();
}

function logout(){
  S.user=null;
  S.apps=[];  // clear memory — no persistence
  $('app').style.display='none';
  $('login-page').style.display='flex';
  $('login-page').style.alignItems='center';
  $('login-page').style.justifyContent='center';
}

// ── LOAD FROM GOOGLE SHEET via JSONP ──────────────────────────
