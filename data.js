// Thennagam Finance LMS — data: Google Sheet I/O (loadApps, setStatus, deleteApp, saveEdit)
// (split from index.html; functions are global by design — called from inline onclick handlers)

function loadApps(){
  showLoad('Loading from Google Sheet…','Fetching all applications…',20);
  var cbName = '_tfLoad_' + Date.now();
  var script = document.createElement('script');

  var timer = setTimeout(function(){
    cleanup();
    hideLoad();
    S.apps = [];
    toast('❌ Timeout — check URL in Settings','err',5000);
    go(S.page==='dash'?'dash':'apps');
  }, 15000);

  window[cbName] = function(result){
    cleanup();
    hideLoad();
    if(result && result.ok){
      S.apps = result.rows || [];
      toast('✅ '+S.apps.length+' records loaded from Sheet','ok');
    } else {
      S.apps = [];
      toast('❌ '+(result&&result.message||'Sheet error'),'err',5000);
    }
    go(S.page==='dash'?'dash':'apps');
  };

  function cleanup(){
    clearTimeout(timer);
    try{ delete window[cbName]; script.remove(); }catch(e){}
  }

  script.onerror = function(){
    cleanup(); hideLoad(); S.apps = [];
    toast('❌ Cannot reach Apps Script','err',5000);
    go(S.page==='dash'?'dash':'apps');
  };

  script.src = SCRIPT_URL + '?action=getAll&callback=' + cbName + '&t=' + Date.now();
  document.head.appendChild(script);
}

// ── NAVIGATION ─────────────────────────────────────────────────
async function setStatus(id, status){
  // Update locally immediately for instant UI feedback
  var a = S.apps.find(function(x){return x.app_id===id;});
  if(a) a.status = status;

  // Re-render the status buttons inside modal immediately
  var btnContainer = document.querySelector('#vmod-body .status-btns');
  if(btnContainer){
    btnContainer.innerHTML = ['NEW','UNDER REVIEW','APPROVED','DISBURSED','REJECTED'].map(function(st){
      var on = status===st;
      return '<button class="btn btn-sm" style="background:'+(on?'var(--navy)':'var(--cream-d)')+';color:'+(on?'var(--gold-l)':'var(--text)')+'" onclick="setStatus(\''+id+'\',\''+st+'\')">'+st+'</button>';
    }).join('');
  }

  toast('Saving status…','info',2000);

  // Save to sheet
  try {
    await fetch(SCRIPT_URL,{
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'text/plain'},
      body:JSON.stringify({action:'update', app_id:id, status:status})
    });
    toast('✅ Status updated to '+status,'ok');
    // Reload in background to sync sheet
    setTimeout(function(){ loadApps(); }, 3000);
  } catch(e){
    toast('❌ Update failed: '+e.message,'err');
  }
}

// ── NEW APPLICATION FORM ───────────────────────────────────────
async function deleteApp(){
  var id = S.viewId;
  if(!id){ toast('No application selected','err'); return; }
  var a = S.apps.find(function(x){return x.app_id===id;});
  if(!confirm('Delete application '+id+' ('+( a?a.name:'')+')?\nThis cannot be undone.')) return;
  closeModal();
  showLoad('Deleting…','Removing from Google Sheet…',50);
  try {
    await fetch(SCRIPT_URL,{
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'text/plain'},
      body:JSON.stringify({action:'delete', app_id:id})
    });
    showLoad('Deleted!','Reloading data…',80);
    await new Promise(function(r){setTimeout(r,3000);});
    hideLoad();
    toast('✅ Application deleted','ok');
    loadApps();
  } catch(e){
    hideLoad();
    toast('❌ Delete failed: '+e.message,'err');
  }
}

// ── EDIT APPLICATION ───────────────────────────────────────────
async function saveEdit(){
  var id = S.viewId;
  var a  = S.apps.find(function(x){return x.app_id===id;});
  if(!a){ toast('Not found','err'); return; }

  // Collect all edited values
  var fields = ['name','mobile','alt_mobile','email','dob','gender','father_name','address','city','district','state','pincode','residence_type','aadhar_no','pan_no','occupation','income','employer_name','work_experience','work_address','bank_name','account_number','ifsc_code','branch','account_type','banking_since','loan_amount','tenure','purpose','emi_date','existing_emi','status','nominee_name','nominee_rel','nominee_age','nominee_mobile','nominee_aadhar','nominee_address','ref1_name','ref1_relationship','ref1_mobile','ref1_occupation','ref1_address','ref2_name','ref2_relationship','ref2_mobile','ref2_occupation','ref2_address','verification_officer','verification_designation','visit_date','visit_time','residence_verification','business_verification','house_type','neighbour_feedback','verification_remarks','recommendation','supervisor_approval'];

  var updated = {action:'editSave', app_id:id};
  fields.forEach(function(f){
    var el = $('ef_'+f);
    if(el) updated[f] = el.value.trim();
  });

  closeEditModal();
  showLoad('Saving changes…','Updating Google Sheet…',50);

  try {
    await fetch(SCRIPT_URL,{
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'text/plain'},
      body:JSON.stringify(updated)
    });
    showLoad('Saved!','Reloading data…',85);
    await new Promise(function(r){setTimeout(r,4000);});
    hideLoad();
    toast('✅ Application updated successfully','ok');

setTimeout(function(){
   loadApps();
},1000);
  } catch(e){
    hideLoad();
    toast('❌ Save failed: '+e.message,'err');
  }
}
