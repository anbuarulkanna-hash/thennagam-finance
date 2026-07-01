/* ══════════════════════════════════════════════════════════════════════
   Thennagam Finance — Document Generator (jsPDF)
   Builds filled Application Form + Agreement Pack from a form-data object `d`.
   Group-driven: DOCS[group] = { application, agreement }.  A now; B/C later.
   Pure builders take (doc, d) and use jsPDF + jspdf-autotable (doc.autoTable).
   ════════════════════════════════════════════════════════════════════════ */

/* ---- company constants ---- */
var CO = {
  name: 'THENNAGAM FINANCE PRIVATE LIMITED',
  cin:  'CIN: U64990TN2025PTC179499  |  Certificate of Registration No. B-14.00700 (RBI)',
  addr: '26/1, Thanjai Main Road, Vangarampettai, Uthamadhanapuram, Thanjavur, Papanasam, Tamil Nadu - 614205'
};
var NAVY = [26, 35, 126], GOLD = [201, 168, 76], LBL = [244, 242, 235], INK = [28, 25, 20];
var PW = 210, PH = 297, ML = 14, MR = 14, CW = PW - ML - MR;

/* ---- tiny value helpers ---- */
function V(v){ return (v === 0 || v) ? String(v).trim() : ''; }
function BLANK(n){ var s=''; for(var i=0;i<(n||24);i++) s+='_'; return s; }
function fill(v, n){ v = V(v); return v ? v : BLANK(n||20); }               // form value OR underscores
function rs(v){ v = V(v); return v ? 'Rs. ' + Number(String(v).replace(/[^\d.]/g,'')||0).toLocaleString('en-IN') : 'Rs. ' + BLANK(11); }
function fdate(s){
  s = V(s); if(!s) return '';
  if(/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
  var d = new Date(s); if(isNaN(d.getTime())) return s;
  return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();
}

/* ---- per-group labels & loan-category strings ---- */
var GROUPS = {
  A: { label: 'GROUP A LOAN', cat: 'Small Loan — Up to Rs. 50,000' },
  B: { label: 'GROUP B LOAN', cat: 'Medium Loan — Rs. 50,001 to Rs. 3,00,000' },
  C: { label: 'GROUP C LOAN', cat: 'Large Loan — Above Rs. 3,00,001' }
};
var _G = 'A';  // current group — set at the top of each builder; read by letterhead()

/* ---- letterhead: draws company block + group + doc title, returns y below it ---- */
function letterhead(doc, docTitle){
  doc.setFillColor.apply(doc, NAVY); doc.rect(0, 0, PW, 26, 'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(12.5);
  doc.text(CO.name, PW/2, 9, {align:'center'});
  doc.setFont('helvetica','normal'); doc.setFontSize(6.6);
  doc.text(CO.cin, PW/2, 14, {align:'center'});
  doc.setFontSize(6.2);
  doc.text(doc.splitTextToSize(CO.addr, CW), PW/2, 18, {align:'center'});
  doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(1.1); doc.line(0, 26, PW, 26);
  var y = 33;
  doc.setTextColor.apply(doc, GOLD); doc.setFont('helvetica','bold'); doc.setFontSize(9.5);
  doc.text(GROUPS[_G].label, PW/2, y, {align:'center'});
  y += 6.5;
  doc.setTextColor.apply(doc, NAVY); doc.setFontSize(13);
  doc.text(docTitle, PW/2, y, {align:'center'});
  doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(0.5);
  var tw = doc.getTextWidth(docTitle);
  doc.line(PW/2 - tw/2, y+1.5, PW/2 + tw/2, y+1.5);
  return y + 8;
}

/* ---- navy section bar ---- */
function section(doc, title, y){
  y = pagebreak(doc, y, 12);
  doc.setFillColor.apply(doc, NAVY); doc.rect(ML, y, CW, 6.6, 'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(8.6);
  doc.text(title, ML+2.5, y+4.5);
  doc.setTextColor.apply(doc, INK);
  return y + 6.6;
}

/* ---- page break: add plain page if <h mm left; returns (possibly reset) y ---- */
function pagebreak(doc, y, h){
  if(y + (h||8) > PH - 12){ doc.addPage(); return 16; }
  return y;
}

/* ---- label/value grid (4 logical cols). rows = arrays of cells (string | {content,colSpan}) ---- */
function grid(doc, y, rows){
  doc.autoTable({
    startY: y, theme: 'grid', body: rows, margin: {left: ML, right: MR},
    styles: {fontSize: 8.3, cellPadding: 2, lineColor: [208,203,193], lineWidth: 0.2, valign: 'middle', textColor: INK, overflow: 'linebreak'},
    columnStyles: {
      0: {cellWidth: 40, fontStyle: 'bold', fillColor: LBL},
      1: {cellWidth: 55},
      2: {cellWidth: 40, fontStyle: 'bold', fillColor: LBL},
      3: {cellWidth: 'auto'}
    },
    didParseCell: function(h){ if(h.cell.raw && h.cell.raw.label){ h.cell.styles.fontStyle='bold'; h.cell.styles.fillColor=LBL; } }
  });
  return doc.lastAutoTable.finalY;
}
function L(t){ return {content: t, label: true}; }                 // force-label cell
function FULL(v){ return {content: V(v), colSpan: 3}; }            // value spanning 3 cols

/* ---- wrapped paragraph / bullet ---- */
function para(doc, text, y, o){
  o = o || {};
  doc.setFont('helvetica', o.bold ? 'bold' : (o.italic ? 'italic' : 'normal'));
  doc.setFontSize(o.size || 8.4); doc.setTextColor.apply(doc, o.color || INK);
  var indent = o.indent || 0, w = CW - indent;
  var lines = doc.splitTextToSize(text, w);
  for(var i=0;i<lines.length;i++){
    y = pagebreak(doc, y, 5);
    doc.text(lines[i], ML + indent, y);
    y += (o.lh || 4.3);
  }
  return y + (o.gap || 0);
}
function bullet(doc, text, y, o){
  o = o || {}; y = pagebreak(doc, y, 5);
  doc.setFont('helvetica','normal'); doc.setFontSize(o.size||8.4); doc.setTextColor.apply(doc, INK);
  doc.text('•', ML+2, y);
  return para(doc, text, y, {size:o.size||8.4, indent:6, lh:o.lh||4.3, gap:o.gap||1});
}
function heading(doc, text, y){
  y = pagebreak(doc, y, 9) + 2;
  doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor.apply(doc, NAVY);
  doc.text(text, ML, y); doc.setTextColor.apply(doc, INK);
  return y + 4.5;
}

/* ---- three-column signature block (Borrower / Nominee / Lender) ---- */
function signatures(doc, y, names){
  names = names || {};
  y = pagebreak(doc, y, 30) + 3;
  doc.autoTable({
    startY: y, theme: 'grid', margin:{left:ML,right:MR},
    styles:{fontSize:7.8, cellPadding:2, lineColor:[208,203,193], lineWidth:0.2, minCellHeight:13, valign:'top', textColor:INK},
    head:[[ 'Borrower Signature', 'Nominee Signature', 'Authorised Signatory (Lender)' ]],
    headStyles:{fillColor:LBL, textColor:NAVY, fontStyle:'bold', halign:'center', fontSize:7.8},
    columnStyles:{0:{cellWidth:CW/3},1:{cellWidth:CW/3},2:{cellWidth:CW/3}},
    body:[[
      'Name: '+fill(names.borrower,14)+'\nDate: ______________\nPlace: _____________',
      'Name: '+fill(names.nominee,14)+'\nDate: ______________\nPlace: _____________',
      'Name: ______________\nDate: ______________\nPlace: _____________'
    ]]
  });
  return doc.lastAutoTable.finalY;
}

/* ══════════════════════════════════════════════════════════════════════
   GROUP A — APPLICATION FORM
   ════════════════════════════════════════════════════════════════════════ */
function buildApplication(doc, d, g){
  _G = g;
  var y = letterhead(doc, 'LOAN APPLICATION FORM');
  doc.setFont('helvetica','bold'); doc.setFontSize(8);
  doc.setTextColor(150,120,30);
  doc.text('Loan Category: '+GROUPS[g].cat, PW/2, y-1, {align:'center'}); y += 3;
  doc.setTextColor.apply(doc, INK);

  y = grid(doc, y, [[ L('Application Serial No.'), V(d.app_id), L('Application Date'), fdate(d.submitted_at) ]]);

  y = section(doc, 'SECTION 1 — BORROWER DETAILS', y);
  y = grid(doc, y, [
    [ L('Full Name (as per Aadhaar)'), FULL(d.name) ],
    [ L('Date of Birth'), fdate(d.dob), L('Gender'), V(d.gender) ],
    [ L("Father's / Spouse's Name"), FULL(d.father_name) ],
    [ L('Aadhaar Number'), V(d.aadhar_no), L('PAN Number'), V(d.pan_no) ],
    [ L('Mobile Number'), V(d.mobile), L('Alternate Mobile'), V(d.alt_mobile) ],
    [ L('Email Address'), FULL(d.email) ],
    [ L('Residential Address'), FULL(d.address) ],
    [ L('City'), V(d.city), L('District'), V(d.district) ],
    [ L('Pin Code'), V(d.pincode), L('State'), V(d.state) ],
    [ L('Residence'), FULL(d.residence_type) ]
  ]);

  y = section(doc, 'SECTION 2 — EMPLOYMENT & INCOME DETAILS', y);
  y = grid(doc, y, [
    [ L('Occupation Type'), V(d.occupation), L('Employer / Business Name'), V(d.employer_name) ],
    [ L('Monthly Net Income'), rs(d.income), L('Other Monthly Income'), (V(d.other_income)?rs(d.other_income):'') ],
    [ L('Employer / Business Address'), FULL(d.work_address) ],
    [ L('Total Work Experience'), V(d.work_experience), L('Years w/ Current Employer'), V(d.current_employer_years) ]
  ]);

  y = section(doc, 'SECTION 3 — BANK ACCOUNT DETAILS (FOR DISBURSEMENT)', y);
  y = grid(doc, y, [
    [ L('Bank Name'), V(d.bank_name), L('Branch Name'), V(d.branch) ],
    [ L('Account Number'), V(d.account_number), L('Account Type'), V(d.account_type) ],
    [ L('IFSC Code'), V(d.ifsc_code), L('Existing Loan EMI'), (V(d.existing_emi)?rs(d.existing_emi):'') ]
  ]);

  y = section(doc, 'SECTION 4 — LOAN REQUEST DETAILS', y);
  var s4 = [
    [ L('Loan Amount Requested'), rs(d.loan_amount), L('Purpose of Loan'), V(d.purpose) ],
    [ L('Preferred Tenure'), V(d.tenure), L('Preferred Instalment Date'), V(d.emi_date) ]
  ];
  if(g==='B') s4.push([ L('Document Registration No.'), V(d.doc_reg_no), L('Registration Date'), fdate(d.reg_date) ]);
  if(g==='C'){
    s4.push([ L('Property / Security Details'), FULL(d.property_details) ]);
    s4.push([ L('Title Document Reference'), V(d.title_doc_ref), L('MOD Status'), V(d.mod_status) ]);
  }
  y = grid(doc, y, s4);

  y = section(doc, 'SECTION 5 — NOMINEE DETAILS', y);
  y = grid(doc, y, [
    [ L('Nominee Full Name'), V(d.nominee_name), L('Relationship'), V(d.nominee_rel) ],
    [ L('Nominee Aadhaar Number'), V(d.nominee_aadhar), L('Nominee Mobile'), V(d.nominee_mobile) ],
    [ L('Nominee Residential Address'), FULL(d.nominee_address) ]
  ]);
  y = pagebreak(doc, y + 2, 34);
  y = para(doc, 'Nominee Consent & Declaration:', y, {bold:true, size:8.4, gap:1});
  y = para(doc, 'I, '+fill(d.nominee_name,22)+' (Nominee), hereby consent to being appointed as Nominee for this Loan Account. I acknowledge: (a) I shall be informed by the Lender in the event of default, death, or incapacity of the Borrower; (b) I shall facilitate settlement of the outstanding loan in the event of the Borrower\'s death; (c) I do not assume personal liability for the Loan unless I have separately executed a guarantee; (d) I shall cooperate with the Lender\'s representatives in default proceedings. The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein.', y, {size:7.9, lh:4, gap:2});

  /* ---- continues (page 2 of the printed form) ---- */
  y += 4;

  y = section(doc, 'SECTION 6 — REFERENCES', y);
  doc.autoTable({
    startY: y, theme:'grid', margin:{left:ML,right:MR},
    styles:{fontSize:7.8, cellPadding:2, lineColor:[208,203,193], lineWidth:0.2, textColor:INK, valign:'middle'},
    head:[[ 'Ref.', 'Full Name', 'Relationship', 'Mobile No.', 'Residential Address' ]],
    headStyles:{fillColor:NAVY, textColor:255, fontStyle:'bold', fontSize:7.8},
    columnStyles:{0:{cellWidth:10,halign:'center'},1:{cellWidth:38},2:{cellWidth:30},3:{cellWidth:28},4:{cellWidth:'auto'}},
    body:[
      ['1', V(d.ref1_name), V(d.ref1_relationship), V(d.ref1_mobile), V(d.ref1_address)],
      ['2', V(d.ref2_name), V(d.ref2_relationship), V(d.ref2_mobile), V(d.ref2_address)]
    ]
  });
  y = doc.lastAutoTable.finalY;

  y = section(doc, "SECTION 7 — FIELD VISIT & VERIFICATION  (Completed by Lender's Officer)", y);
  y = grid(doc, y, [
    [ L('Verification Officer Name'), V(d.verification_officer), L('Designation'), V(d.verification_designation) ],
    [ L('Date of Visit'), fdate(d.visit_date), L('Time of Visit'), V(d.visit_time) ],
    [ L('Residence Verification'), V(d.residence_verification), L('Business Verification'), V(d.business_verification) ],
    [ L('House Type'), V(d.house_type), L('Neighbour Feedback'), V(d.neighbour_feedback) ],
    [ L('Observations / Remarks'), FULL(d.verification_remarks) ],
    [ L('Recommendation'), V(d.recommendation), L('Supervisor Approval'), V(d.supervisor_approval) ]
  ]);

  y = section(doc, 'SECTION 8 — BORROWER DECLARATION', y);
  y = para(doc, 'I/We hereby declare and confirm the following:', y, {size:8, gap:1});
  [
    'All information provided in this Application Form is true, correct, and complete to the best of my/our knowledge.',
    'I/We authorise THENNAGAM FINANCE PRIVATE LIMITED to verify the information provided, contact my employer and references, and conduct field verification.',
    'I/We authorise the Lender to access my credit information from any credit bureau registered under the Credit Information Companies (Regulation) Act, 2005.',
    'I/We understand that loan approval is at the sole discretion of the Lender and submission of this Application does not guarantee sanction.',
    'The applicable rate of interest may differ based on various factors including the borrower\'s credit score, repayment history, income level, loan tenure, financial strength, and risk assessment carried out by the Lender.',
    'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein.',
    'I/We understand that providing false information is an offence under the Bharatiya Nyaya Sanhita, 2023.'
  ].forEach(function(t){ y = bullet(doc, t, y, {size:7.9, gap:1}); });

  y = signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});

  y = section(doc, 'FOR OFFICE USE ONLY', y);
  y = grid(doc, y, [
    [ L('Received By'), '', L('Branch / Area'), '' ],
    [ L('Verification Status'), '', L('Credit Decision'), '' ]
  ]);
  footer(doc);
  return doc;
}

/* ══════════════════════════════════════════════════════════════════════
   GROUP A — AGREEMENT PACK  (Sanction Letter → Agreement → DPN → Continuity → Schedule B)
   ════════════════════════════════════════════════════════════════════════ */
function buildAgreement(doc, d, g){
  _G = g;
  var addrFull = [V(d.address), V(d.city), V(d.district), V(d.state)].filter(Boolean).join(', ');

  // group-specific additions (RBI/registration/MOD) — appended where the templates place them
  var kExtra =
    g==='C' ? [
      'The Borrower shall create a Memorandum of Deposit of Title Deeds (MOD) as per the Transfer of Property Act, 1882, and the Tamil Nadu Registration Act, 1908, depositing all original title documents of the property offered as security with the Lender. No further encumbrance shall be created on the said property without prior written consent of the Lender.',
      'Where required by law or the Lender, the Borrower shall execute and register all relevant loan documents as per the Registration Act, 1908, the Indian Stamp Act, 1899, and the Tamil Nadu Stamp Act, 2018, and shall bear all costs thereof.'
    ] :
    g==='B' ? [
      'Where required by law or the Lender, the Borrower shall execute and register all relevant loan documents as per the Registration Act, 1908, the Indian Stamp Act, 1899, and the Tamil Nadu Stamp Act, 2018, and shall bear all costs thereof.'
    ] : [];
  var schedExtra =
    g==='C' ? [ ['12','MOD / Property Details', 'Property offered as security: '+fill(d.property_details,20)] ] :
    g==='B' ? [ ['12','Document Registration (if applicable)', 'Registration No.: '+fill(d.doc_reg_no,20)+' / Not Applicable'] ] : [];

  /* ---------- 1. LOAN SANCTION LETTER (Schedule A) ---------- */
  var y = letterhead(doc, 'LOAN SANCTION LETTER');
  doc.setFont('helvetica','bold'); doc.setFontSize(8.6); doc.setTextColor.apply(doc, NAVY);
  doc.text('SCHEDULE "A"', ML, y); doc.setTextColor.apply(doc, INK); y += 6;
  y = para(doc, 'To,', y, {size:8.4, gap:0.5});
  y = para(doc, 'Mr./Ms. '+fill(d.name,26), y, {size:8.4});
  y = para(doc, 'S/o | D/o | W/o: '+fill(d.father_name,24), y);
  y = para(doc, 'Application No.: '+fill(d.app_id,18)+'      Reference No.: '+BLANK(18), y);
  y = para(doc, 'Address: '+fill(addrFull,40)+',  Pin: '+fill(d.pincode,7), y);
  y = para(doc, 'Email: '+fill(d.email,22)+'      Mobile: '+fill(d.mobile,14), y, {gap:2});
  y = para(doc, 'Dear Borrower,', y, {gap:1});
  y = para(doc, 'This Loan Sanction Letter is issued in reference to your Loan Application dated '+fill(fdate(d.submitted_at),12)+'. The sanction is based on the information provided by you in your application. We are pleased to inform you that your loan application has been approved subject to the following terms and conditions:', y, {size:8.2, gap:2});

  doc.autoTable({
    startY: y, theme:'grid', margin:{left:ML,right:MR},
    styles:{fontSize:7.6, cellPadding:1.2, lineColor:[208,203,193], lineWidth:0.2, textColor:INK, valign:'middle'},
    head:[[ 'Sl. No.', 'Particulars', 'Terms / Details' ]],
    headStyles:{fillColor:NAVY, textColor:255, fontStyle:'bold', fontSize:8},
    columnStyles:{0:{cellWidth:14,halign:'center'},1:{cellWidth:70,fontStyle:'bold'},2:{cellWidth:'auto'}},
    body:[
      ['1','Loan Group', GROUPS[g].label],
      ['2','Loan Sanctioned Amount', rs(d.loan_amount)],
      ['3','Loan Date', BLANK(11)],
      ['4','Rate of Interest (ROI)', BLANK(4)+'% per annum (flat)'],
      ['5','Loan Tenure', fill(d.tenure,10)],
      ['6','Processing Fee + GST (18%)', rs('')],
      ['7','Instalment Amount', rs('')],
      ['8','Number of Instalments', BLANK(9)],
      ['9','Instalment Due Date', fill(d.emi_date,9)],
      ['10','Instalment Frequency','Daily / Monthly'],
      ['11','Disbursal Amount (after deductions)', rs('')],
      ['12','Repayment Schedule','As prescribed in the Loan Agreement'],
      ['13','Penal Charges','0.1% per day on principal outstanding'],
      ['14','Bounce / Dishonour Charge','Rs. 590/- (GST Inclusive)'],
      ['15','Annual Percentage Rate (APR)', BLANK(10)+'%']
    ]
  });
  doc.addPage(); y = 16;
  y = para(doc, 'Terms & Conditions:', y, {bold:true, gap:1});
  [
    'Loan disbursement will be made to the bank account provided in the Loan Agreement.',
    'Processing fees (including GST at 18% under the Central Goods and Services Tax Act, 2017) will be deducted from the Loan Amount before disbursal.',
    'This sanction may be revoked or cancelled at the sole discretion of the Company at any time before disbursal.',
    'The repayment schedule shall depend upon the actual date of disbursement of the Loan.',
    'Penal charges @0.1% per day on principal outstanding shall be levied in case of repayment overdue, calculated from the date of default under the Indian Contract Act, 1872.',
    'The Borrower may make pre-payment or foreclose the Loan without any penalty by giving 30 days\' prior written notice to the Lender.',
    'Applicable stamp duty and all statutory charges under the Indian Stamp Act, 1899, and the Tamil Nadu Stamp Act, 2018, shall be borne by the Borrower.',
    'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein.',
    'Once the disbursement is made to the Borrower\'s bank account, the Loan cannot be withdrawn or reversed.'
  ].forEach(function(t){ y = bullet(doc, t, y, {size:7.3, lh:3.85, gap:0.6}); });
  y += 1;
  y = para(doc, 'Yours faithfully,   For THENNAGAM FINANCE PRIVATE LIMITED', y, {bold:true, size:8, gap:3});
  y = para(doc, '__________________________   Authorised Signatory', y, {size:8, gap:1});
  signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});

  /* ---------- 2. LOAN AGREEMENT ---------- */
  doc.addPage(); y = letterhead(doc, 'LOAN AGREEMENT');
  doc.setTextColor(150,120,30); doc.setFont('helvetica','bold'); doc.setFontSize(8);
  doc.text('Loan Category: '+GROUPS[g].cat, PW/2, y-1, {align:'center'}); y+=3;
  doc.setTextColor.apply(doc, INK);
  y = para(doc, 'This Loan Agreement is made and executed at Thanjavur on the date mentioned in Schedule "A" by THENNAGAM FINANCE PRIVATE LIMITED (hereinafter the "Lender"), a Non-Banking Financial Company registered under the Reserve Bank of India Act, 1934, bearing CIN U64990TN2025PTC179499, Certificate of Registration No. B-14.00700, having its Registered Office at 26/1, Thanjai Main Road, Vangarampettai, Uthamadhanapuram, Thanjavur, Papanasam, Tamil Nadu - 614205; and', y, {size:8.1, gap:1.5});
  y = para(doc, 'Mr./Ms. '+fill(d.name,24)+' (hereinafter the "Borrower"), whose details are mentioned in Schedule "A" and "B" of this Agreement.', y, {size:8.1, gap:1.5});
  y = para(doc, 'The Lender and the Borrower are hereinafter collectively referred to as the "Parties", which expressions shall include their respective heirs, executors, administrators, legal representatives, successors, and permitted assigns.', y, {size:8.1, gap:1.5});
  y = para(doc, 'WHEREAS, the Lender is an RBI-approved Non-Banking Financial Company engaged in the business of providing loans under the Reserve Bank of India (Non-Banking Financial Company) Directions, 2016; and WHEREAS, the Borrower has applied for a loan facility and the Lender, after due diligence, KYC verification, and credit assessment, has agreed to provide the Loan subject to the terms and conditions of this Agreement; NOW, THEREFORE, the Parties agree as follows:', y, {size:8.1, gap:2});

  var AG = [
    ['A. DEFINITIONS AND INTERPRETATION', [
      '"Applicable Law" means any statute, regulation, notification, circular, ordinance, court order, decree, or direction having the force of law in India, including the Reserve Bank of India Act, 1934; Indian Contract Act, 1872; Transfer of Property Act, 1882; Limitation Act, 1963; SARFAESI Act, 2002; Information Technology Act, 2000; Payment and Settlement Systems Act, 2007; and all applicable Tamil Nadu State enactments.',
      '"Automated Fund Transfer" means transfer of funds through ECS, NACH, UPI, or any other permissible digital payment mode.',
      '"Due Date" means the date on or before which the Instalment(s) become due and repayable as specified in the Loan Documents.',
      '"Effective Date" means the date on which the Borrower consents to obtain the Loan from the Lender.',
      '"Loan Documents" means this Agreement, the Loan Application, the Sanction Letter, the Demand Promissory Note, the Letter of Continuity, the Repayment Schedule, and all other documents executed in connection with the Loan.',
      '"Outstanding Balance" means the total amount outstanding, including principal, interest, fees, costs, and charges payable by the Borrower to the Lender.'
    ]],
    ['B. LOAN AMOUNT', [
      'The Lender shall provide the Loan strictly in accordance with the terms of this Agreement and other Loan Documents. The Loan amount shall be as stated in the Sanction Letter.',
      'The Lender may disburse the Loan in one lump sum or in such instalments as decided at its sole discretion.',
      'The Lender reserves the right to recall the entire Loan and all monies due if any information supplied by the Borrower is found to be incorrect or false, or if the Borrower commits any default.',
      'The Borrower has confirmed the following Bank Account details for receipt of Loan disbursement:  Bank Name: '+fill(d.bank_name,20)+' ;  Account Number: '+fill(d.account_number,18)+' ;  IFSC Code: '+fill(d.ifsc_code,14)+' .'
    ]],
    ['C. RATE OF INTEREST', [
      'The applicable rate of interest may differ based on various factors including the borrower\'s credit score, repayment history, income level, loan tenure, financial strength, and risk assessment carried out by the Lender.',
      'The Interest Amount shall be calculated on a flat rate basis and shall remain fixed during the Loan tenure as stated in the Loan Documents.',
      'Interest shall accrue from the Effective Date until full repayment of all amounts due and shall be computed on a daily, monthly, or yearly basis as applicable.'
    ]],
    ['D. LOAN REPAYMENT', [
      'The Borrower undertakes to repay the Loan together with the Interest Amount in the number of Instalments specified in the Loan Documents, not later than the respective Due Dates.',
      'The Lender is entitled to present NACH/e-Mandate for collection of Loan/EMI amounts without prior intimation. The Borrower shall continue to pay Instalments on the respective Due Dates regardless of any dispute.',
      'The Borrower shall maintain sufficient balance in the linked bank account and shall neither close the account nor stop payments without prior written consent of the Lender. Bounce/dishonour and late payment charges shall be borne by the Borrower.',
      'NACH/ECS Mandate shall not be withdrawn without at least 30 days\' prior written notice and shall remain valid until complete repayment.',
      'Any amount paid shall be adjusted first towards penalties and charges, then overdue instalments, then interest, and finally the principal outstanding. Payments shall only be made to the Lender\'s official accounts.'
    ]],
    ['E. FEES AND CHARGES', [
      'The Borrower shall pay Processing Fee, Documentation Fee, Credit Assessment Fee, or any other applicable charges as specified in the Loan Documents, on time and without default.',
      'Late Payment Charges, Direct Debit Bounce Fee, and other charges shall be borne by the Borrower. The Lender reserves the right to revise such charges from time to time by notifying the Borrower on its official website.'
    ]],
    ['F. PRE-PAYMENT OF LOAN', [
      'The Borrower shall give at least 30 days\' prior written notice before making any pre-payment of the Loan.',
      'Pre-payment shall include all due instalments, applicable penalties, charges, and the outstanding principal balance as on the date of pre-payment.',
      'The Loan is repayable on demand made by the Lender, including upon any regulatory or court order.'
    ]],
    ['G. DEMAND PROMISSORY NOTE', [
      'Where the Borrower has executed a Demand Promissory Note (DPN), the Lender shall be entitled to negotiate the DPN under the Negotiable Instruments Act, 1881.',
      'The Borrower waives presentment and notice of dishonour of the Demand Promissory Note.'
    ]],
    ['H. MODE OF COMMUNICATIONS', [
      'All communications through telephone, email, SMS, WhatsApp, mobile applications, or online portal shall be valid and binding as per the Information Technology Act, 2000.',
      'The Borrower irrevocably consents to the Lender recording all electronic communications, which may be used as evidence under the Bharatiya Sakshya Adhiniyam, 2023.',
      'Only the Borrower shall communicate instructions to the Lender. Instructions from any other person shall not be binding.'
    ]],
    ['I. ASSIGNMENT AND TRANSFER', [
      'The Lender may sell, transfer, assign, or securitise any of its rights and obligations to any person without the consent of the Borrower, under the SARFAESI Act, 2002.',
      'The Borrower shall not assign or transfer any rights or obligations without prior written consent of the Lender.',
      'The Lender may share all information relating to the Borrower and the Loan with any transferee or assignee.'
    ]],
    ['J. EVENTS OF DEFAULT', [
      'Misrepresentation or provision of false information; utilisation of the Loan for any illegal, anti-social, or speculative purpose; failure to comply with any covenant; commencement of insolvency proceedings under the IBC, 2016; prosecution for any criminal offence; failure to pay any instalment, interest, or penal charge on the Due Date; or any event that in the Lender\'s opinion jeopardises its interests.'
    ]],
    ['K. REMEDIES IN CASE OF DEFAULT', [
      'The Lender may demand penal charges on delayed payment, recall the entire Outstanding Balance, exercise a paramount lien and right of set-off, require salary deduction by the employer, and initiate proceedings before an arbitrator or courts under the Arbitration and Conciliation Act, 1996.',
      'The Borrower shall reimburse all costs of legal proceedings. In default, the Lender and/or RBI may disclose the Borrower\'s information to banks, financial institutions, and credit information companies under the CIC (Regulation) Act, 2005.'
    ].concat(kExtra)],
    ['L. NOTICE & COOLING-OFF', [
      'Any notice by the Lender is deemed served if delivered personally (immediately), by post/courier (two days), or by email/WhatsApp/SMS (immediately). Notice by the Borrower is deemed delivered only when actually received by the Lender.',
      'Cooling-Off / Look-Up Period: one (1) day for loan tenor of 7 days or less; three (3) days for tenor of more than 7 days. No penalty for repayment of principal and proportionate interest during the cooling-off period.'
    ]],
    ['M. USE OF LOAN', [
      'No part of the Loan shall be used for any illegal, immoral, gambling, lottery, or speculative activity. Any dispute relating to goods purchased with the Loan shall not entitle the Borrower to withhold payment to the Lender.'
    ]],
    ['N. NOMINEE — ROLE, RESPONSIBILITIES AND CONSENT', [
      'The Nominee shall be informed by the Lender in the event of default, death, or incapacity of the Borrower, and shall facilitate settlement of the outstanding loan from the Borrower\'s estate or insurance proceeds.',
      'The Nominee does not assume personal liability unless a separate guarantee has been executed, and shall cooperate with the Lender\'s representatives in any default proceedings.',
      'Nominee Consent: I, '+fill(d.nominee_name,22)+' (Nominee), having read and understood the above, hereby consent to being nominated as Nominee for this Loan and acknowledge the responsibilities stated herein.'
    ]],
    ['O. DECLARATIONS BY THE BORROWER', [
      'All information and documents provided are true, genuine, and correct; the Borrower does not violate any existing agreement by availing this Loan; and shall not terminate this Agreement until the entire outstanding balance is repaid.',
      'The Borrower consents to communication by phone, SMS, WhatsApp, or email (not governed by TRAI DND) between 07:00 AM and 07:00 PM, Monday to Sunday, and shall inform the Lender within 7 days of any change in address, employment, or contact details.'
    ]],
    ['P. OTHER CONDITIONS', [
      'If any provision becomes unenforceable, the remaining provisions remain valid. The Lender may amend this Agreement with prospective effect by notifying the Borrower. In case of discrepancy, this Agreement prevails, and the English version shall be final and binding.'
    ]],
    ['Q. DISPUTE RESOLUTION AND JURISDICTION', [
      'Any dispute shall be referred to a sole arbitrator appointed by the Lender under the Arbitration and Conciliation Act, 1996, conducted in English at Thanjavur, Tamil Nadu. This Agreement is governed by the laws of India, subject to the exclusive jurisdiction of the courts at Thanjavur, Tamil Nadu.'
    ]],
    ['R. ACCEPTANCE', [
      'The Borrower confirms having read, understood, and agreed to this entire Agreement, including all loan details, instalment calculation methods, and applicable charges. The terms were translated and interpreted to the Borrower in the native language, and the Borrower has fully internalised the rights and liabilities mentioned herein.'
    ]]
  ];
  AG.forEach(function(sec){
    y = heading(doc, sec[0], y);
    sec[1].forEach(function(t){ y = bullet(doc, t, y, {size:7.8}); });
    y += 1;
  });
  y = signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});

  /* ---------- 3. DEMAND PROMISSORY NOTE ---------- */
  doc.addPage(); y = letterhead(doc, 'DEMAND PROMISSORY NOTE');
  y = para(doc, 'On demand, I/We, '+fill(d.name,22)+', S/o | D/o | W/o: '+fill(d.father_name,20)+', residing at '+fill(addrFull+(V(d.pincode)?' - '+d.pincode:''),40)+', (hereinafter the "Borrower") unconditionally promise to pay M/s THENNAGAM FINANCE PRIVATE LIMITED (hereinafter the "Lender"), having its Registered Office at 26/1, Thanjai Main Road, Vangarampettai, Uthamadhanapuram, Thanjavur, Papanasam, Tamil Nadu - 614205, the sum of '+rs(d.loan_amount)+'/- (Rupees '+BLANK(26)+' Only), for value received, together with interest thereon at the rate agreed upon under the Loan Disbursement Letter, together with overdue charges, costs, and all expenses due and payable by the Borrower to the Lender.', y, {size:8.2, lh:4.4, gap:2});
  y = para(doc, 'This Demand Promissory Note is executed pursuant to the Negotiable Instruments Act, 1881, and is enforceable under the laws of India.', y, {size:8.2, gap:1.5});
  y = para(doc, 'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein.', y, {italic:true, size:8, gap:2});
  y = para(doc, 'Loan Application Number: '+fill(d.app_id,18), y);
  y = para(doc, 'Date: '+BLANK(16)+'   Place: Thanjavur', y, {gap:2});
  y = signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});
  y = para(doc, 'Revenue Stamp affixed and signed across by the Borrower as required under the Indian Stamp Act, 1899.', y+2, {italic:true, size:7.6});

  /* ---------- 4. LETTER OF CONTINUITY ---------- */
  doc.addPage(); y = letterhead(doc, 'LETTER OF CONTINUITY');
  y = para(doc, 'To,', y, {gap:0.5});
  y = para(doc, 'THENNAGAM FINANCE PRIVATE LIMITED', y, {bold:true});
  y = para(doc, '26/1, Thanjai Main Road, Vangarampettai, Uthamadhanapuram, Thanjavur, Papanasam, Tamil Nadu - 614205', y, {size:8, gap:2});
  y = para(doc, 'Dear Sir/Madam,', y, {gap:1});
  y = para(doc, 'I, '+fill(d.name,22)+', enclose herewith a duly executed Demand Promissory Note dated '+BLANK(11)+' for '+rs(d.loan_amount)+'/- (Rupees '+BLANK(24)+' Only) executed by me, which is given to you as continuing security for the repayment of the Loan presently outstanding in my name, and also for the repayment of any further amounts of penalty, interest, and any re-loan facility that I may avail hereafter from you.', y, {size:8.2, lh:4.4, gap:1.5});
  y = para(doc, 'The said Demand Promissory Note shall serve as continuing security for the repayment of the ultimate balance and all amounts remaining unpaid on the Loan, now or hereafter, including all interest to become payable, together with overdue charges, costs, expenses, and other charges due and payable by me to THENNAGAM FINANCE PRIVATE LIMITED. I shall remain liable on the said Demand Promissory Note notwithstanding any payments made from time to time.', y, {size:8.2, lh:4.4, gap:2});
  y = para(doc, 'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein.', y, {italic:true, size:8, gap:2});
  y = para(doc, 'Loan Application Number: '+fill(d.app_id,18), y);
  y = para(doc, 'Date: '+BLANK(16)+'   Place: '+BLANK(16), y, {gap:2});
  y = signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});

  /* ---------- 5. DISBURSEMENT & REPAYMENT SCHEDULE (Schedule B) ---------- */
  doc.addPage(); y = letterhead(doc, 'LOAN DISBURSEMENT & REPAYMENT SCHEDULE');
  doc.setFont('helvetica','bold'); doc.setFontSize(8.6); doc.setTextColor.apply(doc, NAVY);
  doc.text('Schedule "B"', ML, y); doc.setTextColor.apply(doc, INK); y += 6;
  y = para(doc, 'Loan Reference No.: '+BLANK(18)+'   Loan Application No.: '+fill(d.app_id,18), y);
  y = para(doc, 'To,  Mr./Ms. '+fill(d.name,24), y);
  y = para(doc, 'Address: '+fill(addrFull,40)+',  Pin: '+fill(d.pincode,7), y);
  y = para(doc, 'Email: '+fill(d.email,22)+'   Mobile: '+fill(d.mobile,14), y, {gap:2});
  y = para(doc, 'Dear Borrower, this Loan Disbursement & Repayment Schedule is issued in reference to your Loan Application. We are pleased to inform you that your Loan has been approved and the amount is being remitted to your account as per the following details:', y, {size:8.2, gap:2});
  doc.autoTable({
    startY:y, theme:'grid', margin:{left:ML,right:MR},
    styles:{fontSize:7.9, cellPadding:1.8, lineColor:[208,203,193], lineWidth:0.2, textColor:INK, valign:'middle'},
    head:[[ 'Sl. No.', 'Particulars', 'Terms of Loan' ]],
    headStyles:{fillColor:NAVY, textColor:255, fontStyle:'bold', fontSize:7.9},
    columnStyles:{0:{cellWidth:14,halign:'center'},1:{cellWidth:60,fontStyle:'bold'},2:{cellWidth:'auto'}},
    body:[
      ['1','Rate of Interest (ROI)', BLANK(4)+'% per annum (flat)'],
      ['2','Penal Charges','0.1% per day on principal outstanding, from Due Date until date of payment'],
      ['3','Processing Fee', rs('')],
      ['4','Statutory Deductions / Taxes','As applicable under the CGST Act, 2017, and other statutes'],
      ['5','Instalment Amount', rs('')],
      ['6','Number of Instalments', BLANK(9)],
      ['7','Instalment Frequency','Daily / Monthly'],
      ['8','Loan Disbursement Amount', rs('')],
      ['9','Disbursement Date', BLANK(16)],
      ['10','Disbursement Bank Account','Bank: '+fill(d.bank_name,16)+'  A/c No.: '+fill(d.account_number,14)+'  IFSC: '+fill(d.ifsc_code,12)],
      ['11','Loan Repayment Schedule','As per repayment table below']
    ].concat(schedExtra)
  });
  y = doc.lastAutoTable.finalY + 3;
  y = para(doc, 'Repayment Schedule:', y, {bold:true, gap:1});
  var rep=[]; for(var i=1;i<=6;i++) rep.push([String(i),'','','','','']);
  doc.autoTable({
    startY:y, theme:'grid', margin:{left:ML,right:MR},
    styles:{fontSize:7.8, cellPadding:2.2, lineColor:[208,203,193], lineWidth:0.2, textColor:INK, halign:'center', minCellHeight:7},
    head:[[ 'Inst. No.','Due Date','Principal (Rs.)','Interest (Rs.)','Total Amount (Rs.)','Balance Outstanding (Rs.)' ]],
    headStyles:{fillColor:NAVY, textColor:255, fontStyle:'bold', fontSize:7.4},
    body:rep
  });
  y = doc.lastAutoTable.finalY + 3;
  y = para(doc, 'I/We have read, understood, and agreed to the above Loan Disbursement and Repayment Schedule.', y, {size:8, gap:1});
  y = para(doc, 'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein.', y, {italic:true, size:7.8, gap:1});
  signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});

  footer(doc);
  return doc;
}

/* ---- page footer w/ numbers (call once at end) ---- */
function footer(doc){
  var n = doc.getNumberOfPages();
  for(var i=1;i<=n;i++){
    doc.setPage(i);
    doc.setFont('helvetica','normal'); doc.setFontSize(6.4); doc.setTextColor(140,135,125);
    doc.text(CO.name+'  —  Confidential', ML, PH-6);
    doc.text('Page '+i+' of '+n, PW-MR, PH-6, {align:'right'});
  }
}

/* ---- group registry (A, B, C share the group-aware builders) ---- */
function _app(g){ return function(doc,d){ return buildApplication(doc, d, g); }; }
function _agr(g){ return function(doc,d){ return buildAgreement(doc, d, g); }; }
var DOCS = {
  A: { application: _app('A'), agreement: _agr('A') },
  B: { application: _app('B'), agreement: _agr('B') },
  C: { application: _app('C'), agreement: _agr('C') }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DOCS: DOCS, buildApplication: buildApplication, buildAgreement: buildAgreement };
}
