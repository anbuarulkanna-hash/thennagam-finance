// Thennagam Finance LMS — view: application view + edit modals (viewApp, row, edit modal)
// (split from index.html; functions are global by design — called from inline onclick handlers)

function viewAppIdx(idx){
  // View by array index — works even with duplicate app IDs
  var a = S.apps[idx];
  if(!a){toast('Not found — click Refresh','err');return;}
  viewApp(a.app_id, a);
}
function quickPDFIdx(idx){
  var a=S.apps[idx]; if(a) genPDFForApp(a);
}
function viewApp(id, appObj){
  // Find by app_id — use passed object if available (avoids duplicate issue)
  var a = appObj || S.apps.find(function(x){return x.app_id===id;});
  if(!a){toast('Not found — click Refresh and try again','err');return;}
  S.viewId=id;
  S._viewApp=a; // store full object
  function r(l,v){
    return '<tr>'+
      '<td style="font-weight:600;color:var(--navy);padding:7px 10px;border-bottom:1px solid var(--border);white-space:nowrap;width:35%">'+l+'</td>'+
      '<td style="padding:7px 10px;border-bottom:1px solid var(--border)">'+esc(v||'—')+'</td>'+
    '</tr>';
  }
  // Clean status — strip any HTML tags (in case old data has HTML)
  var cleanStatus = (a.status||'NEW').replace(/\x3C[^\x3E]*\x3E/g,'').trim()||'NEW';
  a.status = cleanStatus;
$('vmod-title').textContent='📋 '+a.app_id+' — '+a.name;

function row(label,value){
  return '<tr>'+
    '<td style="font-weight:600;color:var(--navy);width:35%">'+label+'</td>'+
    '<td>'+(value || '—')+'</td>'+
  '</tr>';
}

$('vmod-body').innerHTML =

'<div class="card">'+
'<div class="ctitle">Borrower Details</div>'+
'<table class="table">'+
row('Application ID',a.app_id)+
row('Group',a.group)+
row('Name',a.name)+
row('Mobile',a.mobile)+
row('Alternate Mobile',a.alt_mobile)+
row('Email',a.email)+
row('DOB',formatDOB(a.dob))+
row('Gender',a.gender)+
row('Father/Husband',a.father_name)+
row('Address',a.address)+
row('City',a.city)+
row('District',a.district)+
row('State',a.state)+
row('Pincode',a.pincode)+
row('Residence Type',a.residence_type)+
row('Aadhaar',a.aadhar_no)+
row('PAN',a.pan_no)+
'</table></div>'+

'<div class="card">'+
'<div class="ctitle">Employment & Income</div>'+
'<table class="table">'+
row('Occupation',a.occupation)+
row('Monthly Income','₹'+fmtN(a.income))+
row('Employer',a.employer_name)+
row('Experience',a.work_experience)+
row('Work Address',a.work_address)+
'</table></div>'+

'<div class="card">'+
'<div class="ctitle">Bank Details</div>'+
'<table class="table">'+
row('Bank',a.bank_name)+
row('Account No',a.account_number)+
row('IFSC',a.ifsc_code)+
row('Branch',a.branch)+
row('Account Type',a.account_type)+
row('Banking Since',a.banking_since)+
'</table></div>'+

'<div class="card">'+
'<div class="ctitle">Loan Details</div>'+
'<table class="table">'+
row('Loan Amount','₹'+fmtN(a.loan_amount))+
row('Tenure',a.tenure)+
row('Purpose',a.purpose)+
row('EMI Date',a.emi_date)+
row('Existing EMI',a.existing_emi)+
'</table></div>'+

'<div class="card">'+
'<div class="ctitle">Nominee Details</div>'+
'<table class="table">'+
row('Nominee',a.nominee_name)+
row('Relationship',a.nominee_rel)+
row('Age',a.nominee_age)+
row('Mobile',a.nominee_mobile)+
row('Aadhaar',a.nominee_aadhar)+
row('Address',a.nominee_address)+
'</table></div>'+

'<div class="card">'+
'<div class="ctitle">Reference 1</div>'+
'<table class="table">'+
row('Name',a.ref1_name)+
row('Relationship',a.ref1_relationship)+
row('Mobile',a.ref1_mobile)+
row('Occupation',a.ref1_occupation)+
row('Address',a.ref1_address)+
'</table></div>'+

'<div class="card">'+
'<div class="ctitle">Reference 2</div>'+
'<table class="table">'+
row('Name',a.ref2_name)+
row('Relationship',a.ref2_relationship)+
row('Mobile',a.ref2_mobile)+
row('Occupation',a.ref2_occupation)+
row('Address',a.ref2_address)+
'</table></div>'+

'<div class="card">'+
'<div class="ctitle">Field Verification</div>'+
'<table class="table">'+
row('Officer',a.verification_officer)+
row('Designation',a.verification_designation)+
row('Visit Date',a.visit_date)+
row('Visit Time',a.visit_time)+
row('Residence Verification',a.residence_verification)+
row('Business Verification',a.business_verification)+
row('House Type',a.house_type)+
row('Neighbour Feedback',a.neighbour_feedback)+
row('Remarks',a.verification_remarks)+
row('Recommendation',a.recommendation)+
row('Supervisor Approval',a.supervisor_approval)+
row('Status',a.status)+
'</table>'+

'<div style="margin-top:15px">'+
'<div style="font-weight:600;color:var(--navy);margin-bottom:8px">Change Status</div>'+

'<div class="status-btns" style="display:flex;gap:8px;flex-wrap:wrap">'+

['NEW','UNDER REVIEW','APPROVED','DISBURSED','REJECTED'].map(function(st){

   var active = a.status===st;

   return '<button class="btn btn-sm" '+
          'style="background:'+(active?'var(--navy)':'var(--cream-d)')+';'+
          'color:'+(active?'var(--gold-l)':'var(--text)')+'" '+
          'onclick="setStatus(\''+a.app_id+'\',\''+st+'\')">'+
          st+
          '</button>';

}).join('')+

'</div>'+
'</div>'+

'</div>';
$('vmod').classList.add('on');
}

function closeModal(){ $('vmod').classList.remove('on'); }

// Update status — saves to Google Sheet directly
function openEditModal(){
  var id = S.viewId;
  var a  = S.apps.find(function(x){return x.app_id===id;});
  if(!a){ toast('Not found','err'); return; }

  $('emod-title').textContent = 'Edit \u2014 '+a.app_id+' ('+a.name+')';

  var IST='padding:8px 11px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:.87rem;width:100%';
  var LBL='font-size:.78rem;font-weight:600;color:var(--navy)';

  function fi(label,key,type,full){
    type=type||'text';
    return '<div class="fg"'+(full?' style="grid-column:1/-1"':'')+'>'+
      '<label style="'+LBL+'">'+label+'</label>'+
      '<input type="'+type+'" id="ef_'+key+'" value="'+esc(a[key]||'')+'" style="'+IST+'"></div>';
  }
  function fa(label,key,full){
    return '<div class="fg"'+(full?' style="grid-column:1/-1"':'')+'>'+
      '<label style="'+LBL+'">'+label+'</label>'+
      '<textarea id="ef_'+key+'" rows="2" style="'+IST+';resize:vertical">'+esc(a[key]||'')+'</textarea></div>';
  }
  function fs(label,key,opts,full){
    var cur=a[key]||'';
    var list=opts.slice();
    if(cur && list.indexOf(cur)===-1) list.unshift(cur);   // keep existing value even if not in preset list
    var options=list.map(function(o){
      return '<option value="'+esc(o)+'"'+(cur===o?' selected':'')+'>'+esc(o)+'</option>';
    }).join('');
    return '<div class="fg"'+(full?' style="grid-column:1/-1"':'')+'>'+
      '<label style="'+LBL+'">'+label+'</label>'+
      '<select id="ef_'+key+'" style="'+IST+'"><option value="">Select</option>'+options+'</select></div>';
  }
  function sec(t){
    return '<div style="grid-column:1/-1;margin:12px 0 2px;font-weight:700;color:var(--navy);'+
      'border-bottom:2px solid var(--gold);padding-bottom:4px;font-size:.92rem">'+t+'</div>';
  }

  var DIST=['Madurai','Chennai','Coimbatore','Tiruchirappalli','Salem','Tirunelveli','Erode','Vellore','Thoothukudi','Dindigul','Thanjavur','Kanyakumari','Other'];
  var OCC=['Petty Business','Agriculture/Farming','Salaried \u2014 Private','Salaried \u2014 Government','Daily Wages','Self Employed','Auto/Taxi Driver','Tailor/Weaver','Domestic Worker','Others'];
  var PURP=['Business Working Capital','Agriculture/Farming','Medical Emergency','Education','Housing Repair/Construction','Purchase of Equipment/Vehicle','Marriage/Family Function','Personal/Family Needs','Others'];

  $('emod-body').innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 16px">'+

      sec('Borrower Details')+
      fi('Full Name (as per Aadhaar)','name',null,true)+
      fi('Mobile','mobile','tel')+ fi('Alternate Mobile','alt_mobile','tel')+
      fi('Email','email','email',true)+
      fi('Date of Birth','dob','date')+ fs('Gender','gender',['Female','Male','Transgender'])+
      fi('Father / Husband Name','father_name',null,true)+
      fa('Address','address',true)+
      fi('City','city')+ fs('District','district',DIST)+
      fi('State','state')+ fi('Pincode','pincode')+
      fs('Residence Type','residence_type',['Own','Rented','Family'])+ fi('Aadhaar No','aadhar_no')+
      fi('PAN No','pan_no')+

      sec('Employment & Income')+
      fs('Occupation','occupation',OCC)+ fi('Monthly Income','income','number')+
      fi('Employer / Business','employer_name')+ fi('Work Experience','work_experience')+
      fa('Work Address','work_address',true)+

      sec('Bank Details')+
      fi('Bank Name','bank_name')+ fi('Branch','branch')+
      fi('Account Number','account_number')+ fs('Account Type','account_type',['Savings','Current'])+
      fi('IFSC Code','ifsc_code')+ fi('Banking Since (Year)','banking_since','number')+

      sec('Loan Details')+
      fi('Loan Amount','loan_amount','number')+ fs('Tenure (months)','tenure',['6','12','18','24','36','48','60'])+
      fs('Purpose','purpose',PURP)+ fi('Preferred EMI Date','emi_date')+
      fi('Existing EMI','existing_emi','number')+ fs('Status','status',['NEW','UNDER REVIEW','APPROVED','DISBURSED','REJECTED'])+

      sec('Nominee Details')+
      fi('Nominee Name','nominee_name')+ fs('Relationship','nominee_rel',['Spouse','Father','Mother','Son','Daughter','Brother','Sister','Other'])+
      fi('Nominee Age','nominee_age','number')+ fi('Nominee Mobile','nominee_mobile','tel')+
      fi('Nominee Aadhaar','nominee_aadhar')+
      fa('Nominee Address','nominee_address',true)+

      sec('Reference 1')+
      fi('Name','ref1_name')+ fi('Relationship','ref1_relationship')+
      fi('Mobile','ref1_mobile','tel')+ fi('Occupation','ref1_occupation')+
      fa('Address','ref1_address',true)+

      sec('Reference 2')+
      fi('Name','ref2_name')+ fi('Relationship','ref2_relationship')+
      fi('Mobile','ref2_mobile','tel')+ fi('Occupation','ref2_occupation')+
      fa('Address','ref2_address',true)+

      sec('Field Verification')+
      fi('Officer','verification_officer')+ fi('Designation','verification_designation')+
      fi('Visit Date','visit_date')+ fi('Visit Time','visit_time')+
      fs('Residence Verification','residence_verification',['Verified','Not Verified','Applicant Not Available','Address Mismatch'])+
      fs('Business Verification','business_verification',['Verified','Not Verified','Business Closed','Business Shifted'])+
      fs('House Type','house_type',['Own House','Rental House','Family House'])+
      fi('Neighbour Feedback','neighbour_feedback')+
      fa('Remarks','verification_remarks',true)+
      fs('Recommendation','recommendation',['Recommended','Recommended with Conditions','Not Recommended'])+
      fs('Supervisor Approval','supervisor_approval',['Approved','Rejected','Pending'])+

    '</div>';

  closeModal();
  $('emod').classList.add('on');
}

function closeEditModal(){ $('emod').classList.remove('on'); }

// ── SAVE EDIT ──────────────────────────────────────────────────
