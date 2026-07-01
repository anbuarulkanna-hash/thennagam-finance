// Thennagam Finance LMS — config: SCRIPT_URL, STAFF, COLS, state (S), GINFO, TITLES
// (split from index.html; functions are global by design — called from inline onclick handlers)

// ══════════════════════════════════════════════════════════════
//  CONFIG
// ══════════════════════════════════════════════════════════════
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPXkITDJ26difEnmchhyAlwk7Ezb7-k2uSHh918bXQqAH36rkEfObXcUwULGWdZMIS/exec';

var STAFF = [
  {email:'admin@thennagam.com',     pass:'admin123', name:'Admin', role:'Administrator'},
  {email:'staff@thennagam.com',     pass:'staff123', name:'Staff', role:'Staff'},
  {email:'anbuarulkanna@gmail.com', pass:'admin123', name:'Anbu',  role:'Administrator'},
];

// COLS must match Code.gs COLS exactly
var COLS = [
  'app_id','group','name','mobile','email','dob','gender','alt_mobile','state','residence_type',
  'father_name','address','city','district','pincode',
  'aadhar_no','pan_no','occupation','income',
  'loan_amount','tenure','purpose',
  'nominee_name','nominee_rel','nominee_mobile',
  'status','submitted_at',
  'employer_name',
'work_experience',
'work_address',
'bank_name',
'account_number',
'ifsc_code',
'branch',
'account_type',
'banking_since',
'verification_officer',
'verification_designation',
'visit_date',
'visit_time',
'residence_verification',
'business_verification',
'house_type',
'neighbour_feedback',
'verification_remarks',
'recommendation',
'supervisor_approval',
'nominee_age',
'ref1_name',
'ref1_mobile',
'ref1_relationship',
'ref1_occupation',
'ref1_address',

'ref2_name',
'ref2_mobile',
'ref2_relationship',
'ref2_occupation',
'ref2_address',
'emi_date',
'existing_emi',
'other_income',
'current_employer_years',
'nominee_aadhar',
'nominee_address',
];

// ── State — NO localStorage, everything from sheet ─────────────
var S = {
  user:     null,
  page:     'dash',
  apps:     [],       // always loaded fresh from Google Sheet
  group:    'A',
  step:     1,
  lastData: null,
  lastId:   null,
  viewId:   null,
};

var GINFO = {
  A:{desc:'Group A — Small loan up to ₹50,000'},
  B:{desc:'Group B — Medium loan ₹50,001 – ₹3,00,000'},
  C:{desc:'Group C — Large loan above ₹3,00,001'},
};
var TITLES={dash:'Dashboard',apps:'All Applications',new:'New Application',rpt:'Summary Report',cfg:'Settings'};
