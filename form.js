// Thennagam Finance LMS — form: multi-step new-application form (render, validate, collect, submit, preview)
// (split from index.html; functions are global by design — called from inline onclick handlers)

function renderForm(){
  return '<div class="card">'+
  '<div class="psteps">'+
'<div class="pstep on" id="ps1">1<br>Borrower</div>'+
'<div class="pstep" id="ps2">2<br>Employment</div>'+
'<div class="pstep" id="ps3">3<br>Loan</div>'+
'<div class="pstep" id="ps4">4<br>Nominee</div>'+
'<div class="pstep" id="ps5">5<br>References</div>'+
'<div class="pstep" id="ps6">6<br>Verification</div>'+
'<div class="pstep" id="ps7">7<br>Review</div>'+
'<div class="pstep" id="ps8">8<br>Submit</div>'+
  '</div>'+

  // STEP 1
  '<div class="step-content on" id="sc1">'+
    '<div class="divider">Loan Group</div>'+
    '<div class="gtabs">'+
      '<div class="gtab on" onclick="selGrp(\'A\',this)"><div class="gl">Group A</div><div class="gr">Up to ₹50,000</div></div>'+
      '<div class="gtab" onclick="selGrp(\'B\',this)"><div class="gl">Group B</div><div class="gr">₹50K–₹3L</div></div>'+
      '<div class="gtab" onclick="selGrp(\'C\',this)"><div class="gl">Group C</div><div class="gr">Above ₹3L</div></div>'+
    '</div>'+
    '<div class="gbadge" id="gbadge">'+GINFO.A.desc+'</div>'+
    '<div class="divider">Personal Information</div>'+
    '<div class="fgrid f1"><div class="fg"><label>Full Name (as per Aadhaar)<span class="req">*</span></label><input type="text" id="fn" placeholder="Full name"><div class="ferr" id="e-fn">Required</div></div></div>'+
'<div class="fgrid">'+
  '<div class="fg"><label>Mobile<span class="req">*</span></label><input type="tel" id="fm" maxlength="10" placeholder="10-digit"><div class="ferr" id="e-fm">Valid 10-digit number required</div></div>'+
  '<div class="fg"><label>Alternate Mobile</label><input type="tel" id="faltmob" maxlength="10" placeholder="Optional"></div>'+
'</div>'+

'<div class="fgrid f1">'+
  '<div class="fg"><label>Email</label><input type="email" id="fe" placeholder="Optional"></div>'+
'</div>'+
    '<div class="fgrid">'+
      '<div class="fg"><label>Date of Birth<span class="req">*</span></label><input type="date" id="fdob"><div class="ferr" id="e-fdob">Required</div></div>'+
      '<div class="fg"><label>Gender<span class="req">*</span></label><select id="fgend"><option value="">Select</option><option>Female</option><option>Male</option><option>Transgender</option></select><div class="ferr" id="e-fgend">Required</div></div>'+
    '</div>'+
    '<div class="fgrid f1"><div class="fg"><label>Father / Husband Name</label><input type="text" id="ffn"></div></div>'+
    '<div class="divider">Address</div>'+
    '<div class="fgrid f1"><div class="fg"><label>Door No & Street<span class="req">*</span></label><input type="text" id="fadr" placeholder="e.g. 12/A Gandhi Street"><div class="ferr" id="e-fadr">Required</div></div></div>'+
    '<div class="fgrid f3">'+
      '<div class="fg"><label>City/Village<span class="req">*</span></label><input type="text" id="fcity"><div class="ferr" id="e-fcity">Required</div></div>'+
      '<div class="fg"><label>District</label><select id="fdist"><option value="">Select</option><option>Madurai</option><option>Chennai</option><option>Coimbatore</option><option>Tiruchirappalli</option><option>Salem</option><option>Tirunelveli</option><option>Erode</option><option>Vellore</option><option>Thoothukudi</option><option>Dindigul</option><option>Thanjavur</option><option>Kanyakumari</option><option>Other</option></select></div>'+
      '<div class="fg"><label>Pincode</label><input type="text" id="fpin" maxlength="6"></div>'+
    '</div>'+
    '<div class="fgrid">'+
  '<div class="fg"><label>State</label><input type="text" id="fstate" value="Tamil Nadu"></div>'+
  '<div class="fg"><label>Residence Type</label><select id="fresidence"><option value="">Select</option><option>Own</option><option>Rented</option><option>Family</option></select></div>'+
'</div>'+
    '<div class="divider">Identity</div>'+
    '<div class="fgrid">'+
      '<div class="fg"><label>Aadhaar Number<span class="req">*</span></label><input type="text" id="faad" maxlength="14" placeholder="XXXX XXXX XXXX"><div class="ferr" id="e-faad">Valid 12-digit Aadhaar required</div></div>'+
      '<div class="fg"><label>PAN Number</label><input type="text" id="fpan" maxlength="10" placeholder="ABCDE1234F" oninput="this.value=this.value.toUpperCase()"></div>'+
    '</div>'+
    '<div class="nav-row"><button class="btn btn-p" onclick="nextStep(1)" style="margin-left:auto">Next →</button></div>'+
  '</div>'+


// STEP 2
'<div class="step-content" id="sc2">'+
  '<div class="divider">Employment Details</div>'+

  '<div class="fgrid">'+
    '<div class="fg"><label>Occupation<span class="req">*</span></label>'+
    '<select id="focc">'+
    '<option value="">Select</option>'+
    '<option>Petty Business</option>'+
    '<option>Agriculture/Farming</option>'+
    '<option>Salaried - Private</option>'+
    '<option>Salaried - Government</option>'+
    '<option>Daily Wages</option>'+
    '<option>Self Employed</option>'+
    '<option>Auto/Taxi Driver</option>'+
    '<option>Tailor/Weaver</option>'+
    '<option>Domestic Worker</option>'+
    '<option>Others</option>'+
    '</select>'+
    '<div class="ferr" id="e-focc">Required</div></div>'+

    '<div class="fg"><label>Monthly Income (₹)<span class="req">*</span></label>'+
    '<input type="number" id="finc">'+
    '<div class="ferr" id="e-finc">Required</div></div>'+
  '</div>'+

  '<div class="fgrid">'+
    '<div class="fg"><label>Employer / Business Name</label>'+
    '<input type="text" id="femp"></div>'+

    '<div class="fg"><label>Work Experience (Years)</label>'+
    '<input type="number" id="fexp"></div>'+
  '</div>'+

  '<div class="fgrid">'+
    '<div class="fg"><label>Business Address / Office Address</label>'+
    '<textarea id="fworkaddr"></textarea></div>'+
  '</div>'+

  '<div class="divider">Bank Details</div>'+

  '<div class="fgrid">'+
    '<div class="fg"><label>Bank Name</label>'+
    '<input type="text" id="fbnk"></div>'+

    '<div class="fg"><label>Account Number</label>'+
    '<input type="text" id="facc"></div>'+
  '</div>'+

  '<div class="fgrid">'+
    '<div class="fg"><label>IFSC Code</label>'+
    '<input type="text" id="fifc" oninput="this.value=this.value.toUpperCase()"></div>'+

    '<div class="fg"><label>Branch</label>'+
    '<input type="text" id="fbrn"></div>'+
  '</div>'+

  '<div class="fgrid">'+
    '<div class="fg"><label>Account Type</label>'+
    '<select id="factype">'+
    '<option value="">Select</option>'+
    '<option>Savings</option>'+
    '<option>Current</option>'+
    '</select></div>'+

    '<div class="fg"><label>Banking Since (Year)</label>'+
    '<input type="number" id="fbankyrs"></div>'+
  '</div>'+

  '<div class="nav-row">'+
    '<button class="btn btn-o" onclick="prevStep(2)">← Back</button>'+
    '<button class="btn btn-p" onclick="nextStep(2)" style="flex:2">Next →</button>'+
  '</div>'+
'</div>'+


// STEP 3
'<div class="step-content" id="sc3">'+
  '<div class="divider">Loan Requirement</div>'+

  '<div class="fgrid">'+

    '<div class="fg">'+
      '<label>Loan Amount (₹)<span class="req">*</span></label>'+
      '<input type="number" id="fla" placeholder="Amount required">'+
      '<div class="ferr" id="e-fla">Required</div>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Tenure<span class="req">*</span></label>'+
      '<select id="ften">'+
        '<option value="">Select</option>'+
        '<option value="6">6 Months</option>'+
        '<option value="12">12 Months</option>'+
        '<option value="18">18 Months</option>'+
        '<option value="24">24 Months</option>'+
        '<option value="36">36 Months</option>'+
        '<option value="48">48 Months</option>'+
        '<option value="60">60 Months</option>'+
      '</select>'+
      '<div class="ferr" id="e-ften">Required</div>'+
    '</div>'+

  '</div>'+

  '<div class="fgrid f1">'+
    '<div class="fg">'+
      '<label>Purpose of Loan<span class="req">*</span></label>'+
      '<select id="fpurp">'+
        '<option value="">Select</option>'+
        '<option>Business Working Capital</option>'+
        '<option>Agriculture/Farming</option>'+
        '<option>Medical Emergency</option>'+
        '<option>Education</option>'+
        '<option>Housing Repair/Construction</option>'+
        '<option>Purchase of Vehicle</option>'+
        '<option>Marriage / Family Function</option>'+
        '<option>Personal / Family Needs</option>'+
        '<option>Others</option>'+
      '</select>'+
      '<div class="ferr" id="e-fpurp">Required</div>'+
    '</div>'+
  '</div>'+

  '<div class="fgrid">'+
    '<div class="fg">'+
      '<label>Preferred EMI Date</label>'+
      '<select id="femidate">'+
        '<option value="">Select</option>'+
        '<option>5</option>'+
        '<option>10</option>'+
        '<option>15</option>'+
        '<option>20</option>'+
        '<option>25</option>'+
      '</select>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Existing EMI Amount</label>'+
      '<input type="number" id="fexistingemi">'+
    '</div>'+
  '</div>'+

  '<div class="nav-row">'+
    '<button class="btn btn-o" onclick="prevStep(3)">← Back</button>'+
    '<button class="btn btn-p" onclick="nextStep(3)" style="flex:2">Next →</button>'+
  '</div>'+
  '</div>'+

  // STEP 4
  // STEP 4
'<div class="step-content" id="sc4">'+

  '<div class="divider">Nominee Details</div>'+

  '<div class="fgrid f1">'+
    '<div class="fg">'+
      '<label>Nominee Name<span class="req">*</span></label>'+
      '<input type="text" id="fnn">'+
      '<div class="ferr" id="e-fnn">Required</div>'+
    '</div>'+
  '</div>'+

  '<div class="fgrid">'+

    '<div class="fg">'+
      '<label>Relationship<span class="req">*</span></label>'+
      '<select id="fnrel">'+
        '<option value="">Select</option>'+
        '<option>Spouse</option>'+
        '<option>Father</option>'+
        '<option>Mother</option>'+
        '<option>Son</option>'+
        '<option>Daughter</option>'+
        '<option>Brother</option>'+
        '<option>Sister</option>'+
        '<option>Other</option>'+
      '</select>'+
      '<div class="ferr" id="e-fnrel">Required</div>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Nominee Age</label>'+
      '<input type="number" id="fnage">'+
    '</div>'+

  '</div>'+

  '<div class="fgrid">'+

    '<div class="fg">'+
      '<label>Nominee Mobile<span class="req">*</span></label>'+
      '<input type="tel" id="fnmob" maxlength="10">'+
      '<div class="ferr" id="e-fnmob">Valid 10-digit number required</div>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Nominee Aadhaar</label>'+
      '<input type="text" id="fnaad" maxlength="14" placeholder="XXXX XXXX XXXX">'+
    '</div>'+

  '</div>'+

  '<div class="fgrid f1">'+
    '<div class="fg">'+
      '<label>Nominee Address</label>'+
      '<textarea id="fnaddr"></textarea>'+
    '</div>'+
  '</div>'+

  '<div class="nav-row">'+
    '<button class="btn btn-o" onclick="prevStep(4)">← Back</button>'+
    '<button class="btn btn-p" onclick="nextStep(4)" style="flex:2">Next →</button>'+
  '</div>'+
'</div>'+

// STEP 5
'<div class="step-content" id="sc5">'+
  '<div class="divider">Reference 1</div>'+

  '<div class="fgrid">'+
    '<div class="fg">'+
      '<label>Reference Name<span class="req">*</span></label>'+
      '<input type="text" id="fr1name">'+
      '<div class="ferr" id="e-fr1name">Required</div>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Mobile Number<span class="req">*</span></label>'+
      '<input type="tel" id="fr1mob" maxlength="10">'+
      '<div class="ferr" id="e-fr1mob">Valid 10-digit number required</div>'+
    '</div>'+
  '</div>'+

  '<div class="fgrid">'+
    '<div class="fg">'+
      '<label>Relationship<span class="req">*</span></label>'+
      '<select id="fr1rel">'+
        '<option value="">Select</option>'+
        '<option>Father</option>'+
        '<option>Mother</option>'+
        '<option>Brother</option>'+
        '<option>Sister</option>'+
        '<option>Relative</option>'+
        '<option>Friend</option>'+
        '<option>Neighbour</option>'+
        '<option>Employer</option>'+
        '<option>Business Associate</option>'+
        '<option>Village Leader</option>'+
        '<option>Other</option>'+
      '</select>'+
      '<div class="ferr" id="e-fr1rel">Required</div>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Occupation</label>'+
      '<input type="text" id="fr1occ">'+
    '</div>'+
  '</div>'+

  '<div class="fgrid f1">'+
    '<div class="fg">'+
      '<label>Address</label>'+
      '<textarea id="fr1addr"></textarea>'+
    '</div>'+
  '</div>'+

  '<div class="divider">Reference 2</div>'+

  '<div class="fgrid">'+
    '<div class="fg">'+
      '<label>Reference Name<span class="req">*</span></label>'+
      '<input type="text" id="fr2name">'+
      '<div class="ferr" id="e-fr2name">Required</div>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Mobile Number<span class="req">*</span></label>'+
      '<input type="tel" id="fr2mob" maxlength="10">'+
      '<div class="ferr" id="e-fr2mob">Valid 10-digit number required</div>'+
    '</div>'+
  '</div>'+

  '<div class="fgrid">'+
    '<div class="fg">'+
      '<label>Relationship<span class="req">*</span></label>'+
      '<select id="fr2rel">'+
        '<option value="">Select</option>'+
        '<option>Father</option>'+
        '<option>Mother</option>'+
        '<option>Brother</option>'+
        '<option>Sister</option>'+
        '<option>Relative</option>'+
        '<option>Friend</option>'+
        '<option>Neighbour</option>'+
        '<option>Employer</option>'+
        '<option>Business Associate</option>'+
        '<option>Village Leader</option>'+
        '<option>Other</option>'+
      '</select>'+
      '<div class="ferr" id="e-fr2rel">Required</div>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Occupation</label>'+
      '<input type="text" id="fr2occ">'+
    '</div>'+
  '</div>'+

  '<div class="fgrid f1">'+
    '<div class="fg">'+
      '<label>Address</label>'+
      '<textarea id="fr2addr"></textarea>'+
    '</div>'+
  '</div>'+

  '<div class="nav-row">'+
    '<button class="btn btn-o" onclick="prevStep(5)">← Back</button>'+
    '<button class="btn btn-p" onclick="nextStep(5)" style="flex:2">Next →</button>'+
  '</div>'+
'</div>'+

// STEP 6 - FIELD VERIFICATION
'<div class="step-content" id="sc6">'+

  '<div class="divider">Field Verification</div>'+
  '<div class="fgrid">'+

    '<div class="fg">'+
      '<label>Verification Officer</label>'+
      '<input type="text" id="fvofficer" placeholder="Officer Name">'+
    '</div>'+

    '<div class="fg">'+
      '<label>Designation</label>'+
      '<input type="text" id="fvdesg" placeholder="Field Officer">'+
    '</div>'+

  '</div>'+

  '<div class="fgrid">'+

    '<div class="fg">'+
      '<label>Date of Visit</label>'+
      '<input type="date" id="fvdate">'+
    '</div>'+

    '<div class="fg">'+
      '<label>Time of Visit</label>'+
      '<input type="time" id="fvtime">'+
    '</div>'+

  '</div>'+

  '<div class="fgrid">'+

    '<div class="fg">'+
      '<label>Residence Verification</label>'+
      '<select id="fvres">'+
        '<option value="">Select</option>'+
        '<option>Verified</option>'+
        '<option>Not Verified</option>'+
        '<option>Applicant Not Available</option>'+
        '<option>Address Mismatch</option>'+
      '</select>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Business Verification</label>'+
      '<select id="fvbiz">'+
        '<option value="">Select</option>'+
        '<option>Verified</option>'+
        '<option>Not Verified</option>'+
        '<option>Business Closed</option>'+
        '<option>Business Shifted</option>'+
      '</select>'+
    '</div>'+

  '</div>'+

  '<div class="fgrid">'+

    '<div class="fg">'+
      '<label>House Type</label>'+
      '<select id="fvhouse">'+
        '<option value="">Select</option>'+
        '<option>Own House</option>'+
        '<option>Rental House</option>'+
        '<option>Family House</option>'+
      '</select>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Neighbour Feedback</label>'+
      '<select id="fvneighbour">'+
        '<option value="">Select</option>'+
        '<option>Positive</option>'+
        '<option>Average</option>'+
        '<option>Negative</option>'+
      '</select>'+
    '</div>'+

  '</div>'+

  '<div class="fgrid f1">'+

    '<div class="fg">'+
      '<label>Verification Remarks</label>'+
      '<textarea id="fvremarks" placeholder="Officer observations"></textarea>'+
    '</div>'+

  '</div>'+

  '<div class="fgrid">'+

    '<div class="fg">'+
      '<label>Recommendation</label>'+
      '<select id="fvrecommend">'+
        '<option value="">Select</option>'+
        '<option>Recommended</option>'+
        '<option>Recommended with Conditions</option>'+
        '<option>Not Recommended</option>'+
      '</select>'+
      '<div class="ferr" id="e-fvrecommend">Required</div>'+
    '</div>'+

    '<div class="fg">'+
      '<label>Supervisor Approval</label>'+
      '<select id="fvsuper">'+
        '<option value="">Select</option>'+
        '<option>Approved</option>'+
        '<option>Rejected</option>'+
        '<option>Pending</option>'+
      '</select>'+
    '</div>'+

  '</div>'+

  '<div class="nav-row">'+
    '<button class="btn btn-o" onclick="prevStep(6)">← Back</button>'+
    '<button class="btn btn-p" onclick="nextStep(6)" style="flex:2">Next →</button>'+
  '</div>'+

'</div>'+

// STEP 7 - REVIEW
'<div class="step-content" id="sc7">'+

  '<div class="divider">Review Application</div>'+

  '<div class="card">'+

    '<div id="reviewBox">'+
      '<div style="text-align:center;padding:30px;color:#666">'+
      'Click Refresh Review to load application summary'+
      '</div>'+
    '</div>'+

  '</div>'+

  '<div class="nav-row">'+
    '<button class="btn btn-o" onclick="prevStep(7)">← Back</button>'+

    '<button class="btn btn-gold" onclick="loadReview()">'+
    'Refresh Review'+
    '</button>'+

    '<button class="btn btn-p" onclick="nextStep(7)" style="flex:2">'+
    'Next →'+
    '</button>'+
  '</div>'+

'</div>'+

// STEP 8 - DECLARATION
'<div class="step-content" id="sc8">'+

  '<div class="divider">Declaration</div>'+

  '<div class="card">'+

    '<label style="display:flex;gap:10px;align-items:flex-start">'+

      '<input type="checkbox" id="fdecl">'+

      '<span>'+
      'I hereby declare that all information provided in this application is true and correct to the best of my knowledge. I agree to the terms and conditions of Thennagam Finance.'+
      '</span>'+

    '</label>'+

  '</div>'+

  '<div class="divider">Application Actions</div>'+

  '<div class="fgrid">'+

    '<button class="btn btn-o" onclick="prevStep(8)">'+
    '← Back'+
    '</button>'+

    '<button class="btn btn-gold" onclick="quickPreview()">'+
    'Preview PDF'+
    '</button>'+

    '<button class="btn btn-p" onclick="finalSubmit()" style="flex:2">'+
    'Submit Application'+
    '</button>'+

  '</div>'+

'</div>';
}

// ── STEP CONTROLS ──────────────────────────────────────────────
function updateSteps(){
  for(var i=1;i<=8;i++){
    var ps=$('ps'+i),
        sc=$('sc'+i);

    if(!ps || !sc) continue;

    ps.className='pstep'+
      (i===S.step ? ' on' :
       i<S.step ? ' done' : '');

    sc.className='step-content'+
      (i===S.step ? ' on' : '');
  }

  window.scrollTo({top:0,behavior:'smooth'});
}

function selGrp(g,btn){
  S.group=g;
  document.querySelectorAll('.gtab').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  var gb=$('gbadge'); if(gb) gb.textContent=GINFO[g].desc;
}

function nextStep(n){

  if(!validateStep(n)) return;

  if(S.step < 8){
      S.step++;
      updateSteps();

      if(S.step===7)
          setTimeout(loadReview,300);
  }
}
function prevStep(from){ S.step=from-1; updateSteps(); }

// ── VALIDATION ─────────────────────────────────────────────────
function showE(id,msg){ var el=$(id); if(el){el.textContent=msg; el.classList.add('on');} }
function clearE(id){ var el=$(id); if(el) el.classList.remove('on'); }
function req(fid,eid,msg){ var v=gv(fid); if(!v){showE(eid,msg);return false;} clearE(eid);return true; }

function validateStep(step){
  var ok=true;
  if(step===1){
    if(!req('fn','e-fn','Required')) ok=false;
    var mob=gv('fm');
    if(!mob||mob.length!==10||!/^\d+$/.test(mob)){showE('e-fm','Valid 10-digit number required');ok=false;}else clearE('e-fm');
    if(!req('fdob','e-fdob','Required')) ok=false;
    if(!req('fgend','e-fgend','Required')) ok=false;
    if(!req('fadr','e-fadr','Required')) ok=false;
    if(!req('fcity','e-fcity','Required')) ok=false;
    var aad=gv('faad').replace(/\s/g,'');
    if(!aad||aad.length!==12||!/^\d+$/.test(aad)){showE('e-faad','Valid 12-digit Aadhaar required');ok=false;}else clearE('e-faad');
  }
  if(step===2){
    if(!req('focc','e-focc','Required')) ok=false;
    if(!req('finc','e-finc','Required')) ok=false;
  }
if(step===3){
    if(!req('fla','e-fla','Required')) ok=false;
    if(!req('ften','e-ften','Required')) ok=false;
    if(!req('fpurp','e-fpurp','Required')) ok=false;
}

if(step===4){
    if(!req('fnn','e-fnn','Required')) ok=false;
    if(!req('fnrel','e-fnrel','Required')) ok=false;

    var nm=gv('fnmob');
    if(!nm || nm.length!==10 || !/^\d+$/.test(nm)){
        showE('e-fnmob','Valid 10-digit number required');
        ok=false;
    } else clearE('e-fnmob');
}
if(step===5){
  if(!req('fr1name','e-fr1name','Required')) ok=false;
  if(!req('fr1rel','e-fr1rel','Required')) ok=false;

  var r1=gv('fr1mob');
  if(!r1 || r1.length!==10 || !/^\d+$/.test(r1)){
    showE('e-fr1mob','Valid 10-digit number required');
    ok=false;
  } else clearE('e-fr1mob');

  if(!req('fr2name','e-fr2name','Required')) ok=false;
  if(!req('fr2rel','e-fr2rel','Required')) ok=false;

  var r2=gv('fr2mob');
  if(!r2 || r2.length!==10 || !/^\d+$/.test(r2)){
    showE('e-fr2mob','Valid 10-digit number required');
    ok=false;
  } else clearE('e-fr2mob');
}
if(step===6){
  if(!req('fvrecommend','e-fvrecommend','Required'))
      ok=false;
}
if(step===8){

   if(!$('fdecl').checked){

      toast('Accept declaration');
      ok=false;
   }

}
  if(!ok) toast('Please fill all required fields','err');
  return ok;
}

// ── COLLECT FORM DATA ──────────────────────────────────────────
function collectData(){
  return {
      group:S.group,
  name:gv('fn'),
  mobile:gv('fm'),
  alt_mobile:gv('faltmob'),
  email:gv('fe'),
  state:gv('fstate'),
  residence_type:gv('fresidence'),
    dob:gv('fdob'), gender:gv('fgend'), father_name:gv('ffn'),
    address:gv('fadr'), city:gv('fcity'), district:gv('fdist'), pincode:gv('fpin'),
    aadhar_no:gv('faad'), pan_no:gv('fpan'),
    occupation:gv('focc'), income:gv('finc'),
    loan_amount:gv('fla'), tenure:gv('ften'), purpose:gv('fpurp'),
    nominee_name:gv('fnn'), nominee_rel:gv('fnrel'), nominee_mobile:gv('fnmob'),
    employer_name: gv('femp'),
work_experience: gv('fexp'),
work_address: gv('fworkaddr'),
bank_name: gv('fbnk'),
account_number: gv('facc'),
ifsc_code: gv('fifc'),
branch: gv('fbrn'),
account_type: gv('factype'),
banking_since: gv('fbankyrs'),
emi_date: gv('femidate'),
existing_emi: gv('fexistingemi'),

nominee_age: gv('fnage'),

nominee_aadhar: gv('fnaad'),
nominee_address: gv('fnaddr'),
ref1_name: gv('fr1name'),
ref1_mobile: gv('fr1mob'),
ref1_relationship: gv('fr1rel'),
ref1_occupation: gv('fr1occ'),
ref1_address: gv('fr1addr'),

ref2_name: gv('fr2name'),
ref2_mobile: gv('fr2mob'),
ref2_relationship: gv('fr2rel'),
ref2_occupation: gv('fr2occ'),
ref2_address: gv('fr2addr'),
verification_officer: gv('fvofficer'),
verification_designation: gv('fvdesg'),
visit_date: gv('fvdate'),
visit_time: gv('fvtime'),
residence_verification: gv('fvres'),
business_verification: gv('fvbiz'),
house_type: gv('fvhouse'),
neighbour_feedback: gv('fvneighbour'),
verification_remarks: gv('fvremarks'),
recommendation: gv('fvrecommend'),
supervisor_approval: gv('fvsuper'),
  };
}

function loadReview(){

  var d = collectData();

  var h='';

  Object.keys(d).forEach(function(k){

    h +=
      '<div style="padding:8px;border-bottom:1px solid #eee">'+
      '<b>'+k.replaceAll('_',' ').toUpperCase()+'</b><br>'+
      (d[k] || '-')+
      '</div>';

  });

  $('reviewBox').innerHTML = h;
}

// ── SUBMIT ─────────────────────────────────────────────────────
async function submitForm(){
if(!validateStep(8)) return;
  showLoad('Saving Application…','Sending to Google Sheet…',30);
  try {
    var data    = collectData();
    data.action = 'save';

    // POST to Apps Script — saves directly to Google Sheet
    await fetch(SCRIPT_URL,{
      method:'POST', mode:'no-cors',
      headers:{'Content-Type':'text/plain'},
      body:JSON.stringify(data)
    });

    // Wait 5 seconds for Apps Script to write to sheet
    showLoad('Saving…','Waiting for Google Sheet…',60);
    await new Promise(function(r){ setTimeout(r, 5000); });

    // Read back via JSONP to get real App ID
    showLoad('Confirming…','Loading updated data…',85);
    var savedResult = await new Promise(function(resolve){
      var cb2 = '_tfSave_' + Date.now();
      var s2  = document.createElement('script');
      var t2  = setTimeout(function(){ try{delete window[cb2];s2.remove();}catch(e){} resolve(null); }, 8000);
      window[cb2] = function(res){ clearTimeout(t2); try{delete window[cb2];s2.remove();}catch(e){} resolve(res); };
      s2.onerror = function(){ clearTimeout(t2); resolve(null); };
      s2.src = SCRIPT_URL + '?action=getAll&callback=' + cb2 + '&t=' + Date.now();
      document.head.appendChild(s2);
    });

    if(savedResult && savedResult.ok && savedResult.rows && savedResult.rows.length > 0){
      S.apps    = savedResult.rows;
      var newApp = S.apps[0];
      S.lastId   = newApp.app_id;
      S.lastData = newApp;
    } else {
      S.lastId   = 'TF-' + new Date().getFullYear() + '-' + data.group + '-SAVED';
      S.lastData = data;
    }


    hideLoad();
    showSuccess(S.lastId, data);
  } catch(e){
    hideLoad();
    toast('❌ Error: '+e.message,'err',6000);
    console.error('Submit error:',e);
  }
}

function finalSubmit(){

   if(!$('fdecl').checked){
      toast('Please accept declaration','err');
      return;
   }

   submitForm();
}

function showSuccess(appId, d){
  $('succ-id').textContent = appId;
  $('succ-msg').textContent = 'Application saved to Google Sheet.'+(d.email?' Confirmation sent to '+d.email+'.':'')+' Our team will contact you within 1–2 working days.';
  $('succ-detail').innerHTML =
    sr('Applicant',d.name)+sr('Mobile',d.mobile)+sr('Group',d.group)+
    sr('Loan Amount','₹'+fmtN(d.loan_amount))+sr('Tenure',d.tenure+' months')+
    sr('Purpose',d.purpose)+sr('Status','NEW');
  $('succ-screen').style.display='block';
}
function sr(l,v){ return '<div class="succ-row"><span class="l">'+l+'</span><span class="v">'+esc(v||'')+'</span></div>'; }

// ── REPORTS ────────────────────────────────────────────────────
function quickPreview(){

   try{

      var data = collectData();

      // temporary application id for preview
      data.app_id = 'PREVIEW';

      genPDFForApp(data);

   }catch(e){

      toast('Preview failed : ' + e.message,'err');

   }
}
