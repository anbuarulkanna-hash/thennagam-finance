/* ══════════════════════════════════════════════════════════════════════
   Thennagam Finance — Document Generator (jsPDF)
   Builds filled Application Form + Agreement Pack from a form-data object `d`.
   Group-driven: DOCS[group] = { application, agreement }.  A now; B/C later.
   Pure builders take (doc, d) and use jsPDF + jspdf-autotable (doc.autoTable).
   ════════════════════════════════════════════════════════════════════════ */

/* ---- company constants ---- */
var CO = {
  name: 'THENNAGAM FINANCE PRIVATE LIMITED',
  cin:  'CIN: U64990TN2025PTC179499  |  A private limited company lending from its own funds (not a Reserve Bank of India-registered NBFC)',
  mle:  'Registered as a Money Lending Entity under the Tamil Nadu Money Lending Entities (Prevention of Coercive Actions) Act, 2025 — Registration No.: ___________________',
  addr: '26/1, Thanjai Main Road, Vangarampettai, Uthamadhanapuram, Thanjavur, Papanasam, Tamil Nadu - 614205'
};

/* ---- the four permitted charge heads (Section 9(2), TN Act 40 of 2025) ----
   Centralised here so a rate change only needs editing in one place. */
var ROI_PA = 12;                          // interest, reducing balance, % per annum
var PROCESSING_CHARGE_LABEL = 'Nil — not charged';
var INSURANCE_LABEL = 'Not Applicable';
var PENAL_RATE_LABEL = '0.1% per day on the overdue instalment amount only';

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
  doc.setFillColor.apply(doc, NAVY); doc.rect(0, 0, PW, 30, 'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(12.5);
  doc.text(CO.name, PW/2, 8, {align:'center'});
  doc.setFont('helvetica','normal'); doc.setFontSize(6.2);
  doc.text(doc.splitTextToSize(CO.cin, CW), PW/2, 12.5, {align:'center'});
  doc.setFont('helvetica','bold'); doc.setFontSize(6.2);
  doc.text(doc.splitTextToSize(CO.mle, CW), PW/2, 17.5, {align:'center'});
  doc.setFont('helvetica','normal'); doc.setFontSize(6.0);
  doc.text(doc.splitTextToSize(CO.addr, CW), PW/2, 22.5, {align:'center'});
  doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(1.1); doc.line(0, 30, PW, 30);
  var y = 37;
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

function signatures(doc, y, names, opts){
  names = names || {}; opts = opts || {};
  var compact = !!opts.compact;
  var borrowerOnly = !!opts.borrowerOnly;
  var rowH = compact ? 24 : 42;
  var headH = compact ? 8 : 11;
  y = pagebreak(doc, y, rowH + headH + 3) + (compact ? 1.5 : 3);

  var allRows = [
    { title:'Borrower Signature', name:'Name: ' + fill(names.borrower,14) },
    { title:'Nominee Signature', name:'Name: ' + fill(names.nominee,14) },
    { title:'Authorised Signatory (Lender)', name:'Name: ______________' }
  ];
  var sigRows = borrowerOnly ? [allRows[0]] : allRows;
  var nCols = sigRows.length;
  var colW = CW / nCols;
  var columnStyles = {};
  for(var ci=0; ci<nCols; ci++) columnStyles[ci] = {cellWidth: colW};

  doc.autoTable({
    startY:y,
    theme:'grid',
    margin:{left:ML,right:MR},

    styles:{
      fontSize: compact ? 7.2 : 7.8,
      cellPadding: compact ? 1.4 : 2,
      lineColor:[208,203,193],
      lineWidth:0.2,
      minCellHeight:rowH,
      valign:'top',
      textColor:INK
    },

    head:[ sigRows.map(function(r){ return r.title; }) ],

    headStyles:{
      fillColor:LBL,
      textColor:NAVY,
      fontStyle:'bold',
      halign:'center',
      fontSize: compact ? 7.2 : 7.8,
      minCellHeight:headH
    },

    columnStyles: columnStyles,

    body:[ sigRows.map(function(){ return ''; }) ],

    didDrawCell:function(data){
      if(data.section !== 'body') return;

      var i = data.column.index;
      var x = data.cell.x + 3;
      var y0 = data.cell.y + (compact ? 5 : 7);
      var lineGap = compact ? 9 : 19;

      doc.setFontSize(compact ? 7.4 : 8);
      doc.setTextColor(20);
      doc.setFont(undefined,'normal');

      doc.text(sigRows[i].name, x, y0);

      doc.text('Date:   ______________', x, y0 + lineGap);
      doc.text('Place:  _____________', x, y0 + lineGap + (compact ? 6 : 10));
    }
  });

  return doc.lastAutoTable.finalY;
}

  function borrowerSignatureFullWidth(doc, y, d) {
  const x = 14;
  const w = 182;
  const h = 48;
  const headerH = 10;

  const blue = [26, 35, 126];
  const light = [245, 242, 235];
  const border = [190, 190, 190];

  // Outer box
  doc.setDrawColor(...border);
  doc.setLineWidth(0.2);
  doc.rect(x, y, w, h);

  // Header background
  doc.setFillColor(...light);
  doc.rect(x, y, w, headerH, "F");

  // Header border
  doc.setDrawColor(...border);
  doc.rect(x, y, w, headerH);

  // Header text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...blue);
  doc.text("Borrower Signature", x + w / 2, y + 6.5, {
    align: "center",
  });

  // Body content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);

  let ty = y + headerH + 12;

  // Name
  doc.setFont("helvetica", "normal");
  doc.text("Name:", x + 8, ty);

  doc.setFont("helvetica", "bold");
  doc.text(String(d.name || "").toUpperCase(), x + 23, ty);

  // Blank space for signature
  ty += 18;

  // Date and Place in same row
  doc.setFont("helvetica", "normal");
  doc.text("Date:", x + 8, ty);
  doc.line(x + 23, ty + 1, x + 58, ty + 1);

  doc.text("Place:", x + 95, ty);
  doc.line(x + 112, ty + 1, x + 150, ty + 1);

  return y + h + 4;
}


function applicantPhotoBorrowerSignature(doc, y, d) {
  const x = ML;
  const w = CW;
  const h = 64; // increased height so Date & Place stay inside outer box

  const photoW = 70;
  const signW = w - photoW;

  const headerH = 11;
  const bodyH = h - headerH;

  const blue = [26, 35, 126];
  const light = [245, 242, 235];
  const border = [190, 190, 190];

  y = pagebreak(doc, y, h + 8);

  // Outer border
  doc.setDrawColor(...border);
  doc.setLineWidth(0.2);
  doc.rect(x, y, w, h);

  // Vertical separator
  doc.line(x + photoW, y, x + photoW, y + h);

  // Header backgrounds
  doc.setFillColor(...light);
  doc.rect(x, y, photoW, headerH, "F");
  doc.rect(x + photoW, y, signW, headerH, "F");

  // Header borders
  doc.setDrawColor(...border);
  doc.rect(x, y, photoW, headerH);
  doc.rect(x + photoW, y, signW, headerH);

  // Header text
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...blue);
  doc.setFontSize(9);

  doc.text("Applicant Photo", x + photoW / 2, y + 7, {
    align: "center",
  });

  doc.text("Borrower Signature", x + photoW + signW / 2, y + 7, {
    align: "center",
  });

  // Photo placeholder box
  const phW = photoW - 20;
  const phH = 38;
  const phX = x + 10;
  const phY = y + headerH + ((bodyH - phH) / 2);

  doc.setDrawColor(150, 150, 150);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(phX, phY, phW, phH);
  doc.setLineDashPattern([], 0);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.text("Paste Applicant", phX + phW / 2, phY + phH / 2 - 3, {
    align: "center",
  });
  doc.text("Photo Here", phX + phW / 2, phY + phH / 2 + 4, {
    align: "center",
  });

  // Borrower signature side
  const sx = x + photoW + 10;
  const sw = signW - 20;

  // Signature box
  const sigY = y + headerH + 8;
  const sigH = 17;

  doc.setDrawColor(170, 170, 170);
  doc.rect(sx, sigY, sw, sigH);

  // Name row
  const nameY = sigY + sigH + 10;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text("Name:", sx, nameY);

  doc.setFont("helvetica", "bold");
  doc.text(String(d.name || "").toUpperCase(), sx + 17, nameY, {
    maxWidth: sw - 17,
  });

  // Date and Place same row - inside outer box
  // const rowY = y + h - 8;

  // doc.setFont("helvetica", "normal");
  // doc.setFontSize(8);
  // doc.setTextColor(0, 0, 0);

  // // Date
  // doc.text("Date:", sx, rowY);
  // doc.setDrawColor(170, 170, 170);
  // doc.line(sx + 17, rowY + 1, sx + 58, rowY + 1);

  // // Place
  // const placeX = sx + 70;
  // doc.text("Place:", placeX, rowY);
  // doc.line(placeX + 18, rowY + 1, x + w - 10, rowY + 1);

  // Date and Place same row - inside outer box
  const rowY = y + h - 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(170, 170, 170);

  const gap = 8;
  const colW = (sw - gap) / 2;

  const dateX = sx;
  const placeX = sx + colW + gap;

  doc.text("Date:", dateX, rowY);
  doc.line(dateX + 17, rowY + 1, dateX + colW, rowY + 1);

  doc.text("Place:", placeX, rowY);
  doc.line(placeX + 18, rowY + 1, placeX + colW, rowY + 1);

  return y + h + 4;
}


// function applicantPhotoBorrowerSignature(doc, y, d) {
//   const x = 14;
//   const w = 182;
//   const h = 64;

//   const photoW = 70;
//   const signW = w - photoW;

//   const headerH = 11;
//   const bodyH = h - headerH;

//   const blue = [26, 35, 126];
//   const light = [245, 242, 235];
//   const border = [190, 190, 190];

//   // Outer border
//   doc.setDrawColor(...border);
//   doc.setLineWidth(0.2);
//   doc.rect(x, y, w, h);

//   // Vertical separator
//   doc.line(x + photoW, y, x + photoW, y + h);

//   // Header backgrounds
//   doc.setFillColor(...light);
//   doc.rect(x, y, photoW, headerH, "F");
//   doc.rect(x + photoW, y, signW, headerH, "F");

//   // Header borders
//   doc.setDrawColor(...border);
//   doc.rect(x, y, photoW, headerH);
//   doc.rect(x + photoW, y, signW, headerH);

//   // Header text
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(...blue);
//   doc.setFontSize(9);

//   doc.text("Applicant Photo", x + photoW / 2, y + 7, { align: "center" });
//   doc.text("Borrower Signature", x + photoW + signW / 2, y + 7, { align: "center" });

//   // Photo placeholder box
//   const phX = x + 10;
//   const phY = y + headerH + 7;
//   const phW = photoW - 20;
//   const phH = bodyH - 14;

//   doc.setDrawColor(150, 150, 150);
//   doc.setLineDashPattern([2, 2], 0);
//   doc.rect(phX, phY, phW, phH);
//   doc.setLineDashPattern([], 0);

//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(120, 120, 120);
//   doc.setFontSize(8);
//   doc.text("Paste Applicant", phX + phW / 2, phY + phH / 2 - 2, { align: "center" });
//   doc.text("Photo Here", phX + phW / 2, phY + phH / 2 + 4, { align: "center" });

//   // Signature box
//   const sx = x + photoW + 10;
//   const sy = y + headerH + 7;
//   const sw = signW - 20;
//   const sh = 17;

//   doc.setDrawColor(170, 170, 170);
//   doc.rect(sx, sy, sw, sh);

//   // Borrower details
//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(8);

//   let ty = sy + sh + 9;

//   doc.text("Name:", sx, ty);
//   doc.setFont("helvetica", "bold");
//   doc.text(String(d.name || "").toUpperCase(), sx + 18, ty);

//   doc.setFont("helvetica", "normal");
//   ty += 9;
//   doc.text("Date:", sx, ty);
//   doc.line(sx + 18, ty + 1, sx + 55, ty + 1);

//   ty += 9;
//   doc.text("Place:", sx, ty);
//   doc.line(sx + 18, ty + 1, sx + 55, ty + 1);

//   return y + h + 3;
// }

// function revenueStampBorrowerSignature(doc, y, d) {
//   const x = 14;
//   const w = 182;
//   const h = 46;

//   const stampW = 48;
//   const signW = w - stampW;
//   const headerH = 9;

//   const blue = [26, 35, 126];
//   const light = [245, 242, 235];
//   const border = [190, 190, 190];

//   doc.setDrawColor(...border);
//   doc.setLineWidth(0.2);
//   doc.rect(x, y, w, h);

//   doc.setFillColor(...light);
//   doc.rect(x, y, w, headerH, "F");
//   doc.rect(x, y, w, headerH);

//   doc.line(x + stampW, y + headerH, x + stampW, y + h);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(8);
//   doc.setTextColor(...blue);
//   doc.text("Demand Promissory Note Execution", x + w / 2, y + 6, {
//     align: "center",
//   });

//   // Revenue stamp box
//   const stampX = x + 9;
//   const stampY = y + headerH + 7;
//   const stampBoxW = 30;
//   const stampBoxH = 22;

//   doc.setDrawColor(150, 150, 150);
//   doc.setLineDashPattern([2, 2], 0);
//   doc.rect(stampX, stampY, stampBoxW, stampBoxH);
//   doc.setLineDashPattern([], 0);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(7);
//   doc.setTextColor(90, 90, 90);
//   doc.text("Revenue", stampX + stampBoxW / 2, stampY + 10, { align: "center" });
//   doc.text("Stamp", stampX + stampBoxW / 2, stampY + 16, { align: "center" });

//   // Borrower side
//   const sx = x + stampW + 8;
//   const sy = y + headerH + 6;
//   const sw = signW - 16;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(7.8);
//   doc.setTextColor(...blue);
//   doc.text("Borrower Signature", sx + sw / 2, sy, { align: "center" });

//   doc.setDrawColor(170, 170, 170);
//   doc.rect(sx, sy + 3, sw, 13);

//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(7.8);

//   let ty = sy + 23;

//   doc.text("Name:", sx, ty);
//   doc.setFont("helvetica", "bold");
//   doc.text(String(d.name || "").toUpperCase(), sx + 16, ty);

//   doc.setFont("helvetica", "normal");

//   ty += 7;
//   doc.text("Date:", sx, ty);
//   doc.line(sx + 16, ty + 1, sx + 52, ty + 1);

//   ty += 7;
//   doc.text("Place:", sx, ty);
//   doc.line(sx + 16, ty + 1, sx + 52, ty + 1);

//   return y + h + 4;
// }

// function revenueStampBorrowerSignature(doc, y, d) {
//   const x = 14;
//   const w = 182;
//   const h = 52;

//   const stampW = 48;
//   const signW = w - stampW;
//   const headerH = 9;

//   const blue = [26, 35, 126];
//   const light = [245, 242, 235];
//   const border = [190, 190, 190];

//   // Outer box
//   doc.setDrawColor(...border);
//   doc.setLineWidth(0.2);
//   doc.rect(x, y, w, h);

//   // Header
//   doc.setFillColor(...light);
//   doc.rect(x, y, w, headerH, "F");
//   doc.setDrawColor(...border);
//   doc.rect(x, y, w, headerH);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(8);
//   doc.setTextColor(...blue);
//   doc.text("Demand Promissory Note Execution", x + w / 2, y + 6, {
//     align: "center",
//   });

//   // Vertical line between stamp and signature
//   doc.setDrawColor(...border);
//   doc.line(x + stampW, y + headerH, x + stampW, y + h);

//   // Revenue stamp box
//   const stampX = x + 10;
//   const stampY = y + headerH + 9;
//   const stampBoxW = 30;
//   const stampBoxH = 24;

//   doc.setDrawColor(150, 150, 150);
//   doc.setLineDashPattern([2, 2], 0);
//   doc.rect(stampX, stampY, stampBoxW, stampBoxH);
//   doc.setLineDashPattern([], 0);

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(7);
//   doc.setTextColor(90, 90, 90);
//   doc.text("Revenue", stampX + stampBoxW / 2, stampY + 11, {
//     align: "center",
//   });
//   doc.text("Stamp", stampX + stampBoxW / 2, stampY + 17, {
//     align: "center",
//   });

//   // Borrower signature side
//   const sx = x + stampW + 10;
//   const sy = y + headerH + 7;
//   const sw = signW - 20;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(8);
//   doc.setTextColor(...blue);
//   doc.text("Borrower Signature", sx + sw / 2, sy, {
//     align: "center",
//   });

//   // Signature empty box
//   doc.setDrawColor(170, 170, 170);
//   doc.rect(sx, sy + 4, sw, 15);

//   // Name row
//   let ty = sy + 28;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(8);
//   doc.setTextColor(0, 0, 0);
//   doc.text("Name:", sx, ty);

//   doc.setFont("helvetica", "bold");
//   doc.text(String(d.name || "").toUpperCase(), sx + 17, ty);

//   // Date and Place same row
//   ty += 10;

//   doc.setFont("helvetica", "normal");
//   doc.text("Date:", sx, ty);
//   doc.line(sx + 17, ty + 1, sx + 55, ty + 1);

//   doc.text("Place:", sx + 70, ty);
//   doc.line(sx + 88, ty + 1, sx + 128, ty + 1);

//   return y + h + 4;
// }

function revenueStampBorrowerSignature(doc, y, d) {
  const x = ML;
  const w = CW;
  const h = 64; // increased height so Date & Place stay inside outer box

  const stampW = 48;
  const signW = w - stampW;
  const headerH = 9;

  const blue = [26, 35, 126];
  const light = [245, 242, 235];
  const border = [190, 190, 190];

  y = pagebreak(doc, y, h + 8);

  // Outer box
  doc.setDrawColor(...border);
  doc.setLineWidth(0.2);
  doc.rect(x, y, w, h);

  // Header background
  doc.setFillColor(...light);
  doc.rect(x, y, w, headerH, "F");

  // Header border
  doc.setDrawColor(...border);
  doc.rect(x, y, w, headerH);

  // Header title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...blue);
  doc.text("Demand Promissory Note Execution", x + w / 2, y + 6, {
    align: "center",
  });

  // Vertical line between revenue stamp and borrower signature area
  doc.setDrawColor(...border);
  doc.line(x + stampW, y + headerH, x + stampW, y + h);

  // Revenue stamp dashed box
  const stampBoxW = 30;
  const stampBoxH = 28;
  const stampX = x + (stampW - stampBoxW) / 2;
  const stampY = y + headerH + ((h - headerH - stampBoxH) / 2);

  doc.setDrawColor(150, 150, 150);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(stampX, stampY, stampBoxW, stampBoxH);
  doc.setLineDashPattern([], 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(90, 90, 90);
  doc.text("Revenue", stampX + stampBoxW / 2, stampY + 12, {
    align: "center",
  });
  doc.text("Stamp", stampX + stampBoxW / 2, stampY + 19, {
    align: "center",
  });

  // Borrower signature side
  const sx = x + stampW + 10;
  const sw = signW - 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...blue);
  doc.text("Borrower Signature", sx + sw / 2, y + headerH + 8, {
    align: "center",
  });

  // Signature empty box
  const sigY = y + headerH + 13;
  const sigH = 16;

  doc.setDrawColor(170, 170, 170);
  doc.rect(sx, sigY, sw, sigH);

  // Name row
  const nameY = sigY + sigH + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Name:", sx, nameY);

  doc.setFont("helvetica", "bold");
  doc.text(String(d.name || "").toUpperCase(), sx + 17, nameY, {
    maxWidth: sw - 17,
  });

  // Date and Place same row - inside outer box
  const rowY = y + h - 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);

  // Date
  doc.text("Date:", sx, rowY);
  doc.setDrawColor(170, 170, 170);
  doc.line(sx + 17, rowY + 1, sx + 58, rowY + 1);

  // Place
  const placeX = sx + 70;
  doc.text("Place:", placeX, rowY);
  doc.line(placeX + 18, rowY + 1, x + w - 10, rowY + 1);

  return y + h + 4;
}

function borrowerSignaturePlainRight(doc, y, d) {
  const x = 125;          // right side starting point
  const lineW = 55;       // signature line width

  doc.setTextColor(0, 0, 0);

  // Name first
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Name  :", x, y);

  doc.setFont("helvetica", "bold");
  doc.text(String(d.name || "").toUpperCase(), x + 17, y);

  // Signature line
  y += 16;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(x, y, x + lineW, y);

  // Borrower Signature label
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.text("Borrower Signature", x + lineW / 2, y, {
    align: "center",
  });

  // Date
  y += 9;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Date  :", x, y);
  doc.line(x + 17, y + 1, x + lineW, y + 1);

  // Place
  y += 8;
  doc.text("Place :", x, y);
  doc.line(x + 17, y + 1, x + lineW, y + 1);

  return y + 6;
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
    'I/We authorise the Lender to access and share my/our credit-relevant information through any lawful credit information mechanism the Lender is eligible to use.',
    'I/We understand that loan approval is at the sole discretion of the Lender and submission of this Application does not guarantee sanction.',
    'The applicable rate of interest may differ based on various factors including the borrower\'s credit score, repayment history, income level, loan tenure, financial strength, and risk assessment carried out by the Lender.',
    'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein.',
    'I/We understand that providing false information is an offence under the Bharatiya Nyaya Sanhita, 2023.'
  ].forEach(function(t){ y = bullet(doc, t, y, {size:7.9, gap:1}); });

  //y = signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});
  y = applicantPhotoBorrowerSignature(doc, y, d);
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

  /* ---------- 1. LOAN SANCTION LETTER (Schedule A) — kept to a single page ---------- */
  var y = letterhead(doc, 'LOAN SANCTION LETTER');
  doc.setFont('helvetica','bold'); doc.setFontSize(8.6); doc.setTextColor.apply(doc, NAVY);
  doc.text('SCHEDULE "A"', ML, y); doc.setTextColor.apply(doc, INK); y += 5.5;
  y = para(doc, 'To, Mr./Ms. '+fill(d.name,26)+',  S/o | D/o | W/o: '+fill(d.father_name,20), y, {size:8, lh:3.9, gap:0.5});
  y = para(doc, 'Application No.: '+fill(d.app_id,16)+'   Address: '+fill(addrFull,32)+', Pin: '+fill(d.pincode,7), y, {size:8, lh:3.9, gap:0.5});
  y = para(doc, 'Email: '+fill(d.email,20)+'   Mobile: '+fill(d.mobile,14), y, {size:8, lh:3.9, gap:1.5});
  y = para(doc, 'Dear Borrower, this Loan Sanction Letter is issued with reference to your Loan Application dated '+fill(fdate(d.submitted_at),12)+'. We are pleased to inform you that your loan application has been approved subject to the terms below.', y, {size:7.8, lh:3.8, gap:1.5});

  y = heading(doc, 'A. LENDER\'S REGULATORY STATUS', y);
  y = para(doc, 'Thennagam Finance Private Limited lends its own funds and is NOT a bank and NOT a Non-Banking Financial Company registered with the Reserve Bank of India. This loan is governed by the Tamil Nadu Money Lending Entities (Prevention of Coercive Actions) Act, 2025 and general contract law, not by RBI regulations.', y, {size:7.4, lh:3.5, gap:1.5});

  y = heading(doc, 'B. CORE TERMS AND CHARGES — ONLY 4 CHARGE HEADS APPLY (Section 9(2), TN Act 40/2025)', y);
  doc.autoTable({
    startY: y, theme:'grid', margin:{left:ML,right:MR},
    styles:{fontSize:7.0, cellPadding:1.0, lineColor:[208,203,193], lineWidth:0.2, textColor:INK, valign:'middle'},
    head:[[ 'Sl.', 'Particulars', 'Terms / Details' ]],
    headStyles:{fillColor:NAVY, textColor:255, fontStyle:'bold', fontSize:7.4},
    columnStyles:{0:{cellWidth:9,halign:'center'},1:{cellWidth:70,fontStyle:'bold'},2:{cellWidth:'auto'}},
    body:[
      ['1','Loan Group', GROUPS[g].label],
      ['2','Loan Sanctioned Amount', rs(d.loan_amount)],
      ['3','Loan Date / Tenure', BLANK(9)+' / '+fill(d.tenure,8)],
      ['4','Instalment Amount / Count', rs('')+' / '+BLANK(6)],
      ['5','Instalment Due Date / Frequency', fill(d.emi_date,8)+' / Daily/Monthly'],
      ['6','Disbursal Amount (after deductions)', rs('')],
      ['7','Rate of Interest (reducing balance, p.a.)', ROI_PA+'% p.a.'],
      ['8','Processing Charge', PROCESSING_CHARGE_LABEL],
      ['9','Insurance Premium', INSURANCE_LABEL],
      ['10','Delayed Payment / Penal Charge', PENAL_RATE_LABEL],
    ]
  });
  y = doc.lastAutoTable.finalY + 5;

  y = para(doc, 'Terms & Conditions:', y, {bold:true, size:7.6, gap:1.8});
  [
    'Disbursement is made only to the bank account in the Loan Agreement; no charge other than the four heads above applies, by whatever name.',
    'This sanction may be revoked at the Company\'s discretion any time before disbursal; the Loan cannot be withdrawn once disbursed.',
    'The Delayed Payment Charge applies only to the overdue instalment, not the full principal, and is not capitalised or compounded (Indian Contract Act, 1872).',
    'The Borrower may prepay or foreclose without penalty on 30 days\' prior written notice.',
    'A Loan Statement is furnished one day before disbursal, and a Loan Card is issued and updated at every repayment (Sections 9(4), 9(6), TN Act 40/2025).',
    'This Letter, the Loan Agreement, and the Loan Card are available in Tamil on request (Section 9(9), TN Act 40/2025).',
    'Stamp duty and statutory charges under the Indian Stamp Act, 1899 and Tamil Nadu Stamp Act, 2018 are borne by the Borrower; terms were translated and interpreted in the Borrower\'s native language.'
  ].forEach(function(t){ y = bullet(doc, t, y, {size:6.9, lh:3.3, gap:1.1}); });
  y += 3;
  // y = para(doc, 'Yours faithfully,   For THENNAGAM FINANCE PRIVATE LIMITED', y, {bold:true, size:7.8, gap:2.5});
  // signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});

  //y = para(doc, 'Yours faithfully,   For THENNAGAM FINANCE PRIVATE LIMITED', y, {bold:true, size:7.8, gap:2.5});
  y = borrowerSignaturePlainRight(doc, y, d);

  /* ---------- 2. LOAN AGREEMENT ---------- */
  doc.addPage(); y = letterhead(doc, 'LOAN AGREEMENT');
  doc.setTextColor(150,120,30); doc.setFont('helvetica','bold'); doc.setFontSize(8);
  doc.text('Loan Category: '+GROUPS[g].cat, PW/2, y-1, {align:'center'}); y+=3;
  doc.setTextColor.apply(doc, INK);
  y = para(doc, 'This Loan Agreement is made and executed at Thanjavur on the date mentioned in Schedule "A" by THENNAGAM FINANCE PRIVATE LIMITED (hereinafter the "Lender"), a private limited company incorporated under the Companies Act, 2013, bearing CIN U64990TN2025PTC179499, having its Registered Office at 26/1, Thanjai Main Road, Vangarampettai, Uthamadhanapuram, Thanjavur, Papanasam, Tamil Nadu - 614205, and registered as a Money Lending Entity under the Tamil Nadu Money Lending Entities (Prevention of Coercive Actions) Act, 2025 vide Registration No. ___________________; and', y, {size:8.1, gap:1.5});
  y = para(doc, 'Mr./Ms. '+fill(d.name,24)+' (hereinafter the "Borrower"), whose details are mentioned in Schedule "A" and "B" of this Agreement.', y, {size:8.1, gap:1.5});
  y = para(doc, 'The Lender and the Borrower are hereinafter collectively referred to as the "Parties", which expressions shall include their respective heirs, executors, administrators, legal representatives, successors, and permitted assigns.', y, {size:8.1, gap:1.5});
  y = para(doc, 'The Lender confirms that it lends from its own funds, does not accept public deposits, and is not a Non-Banking Financial Company registered with the Reserve Bank of India. This Agreement is not governed by RBI regulations applicable to banks or NBFCs; it is governed by the Indian Contract Act, 1872, the Tamil Nadu Money Lending Entities (Prevention of Coercive Actions) Act, 2025, and other applicable Tamil Nadu State law. WHEREAS the Borrower has applied for a loan facility and the Lender, after due diligence, KYC verification, and credit assessment, has agreed to provide the Loan subject to the terms and conditions of this Agreement; NOW, THEREFORE, the Parties agree as follows:', y, {size:8.1, gap:2});

  var AG = [
    ['A. DEFINITIONS AND INTERPRETATION', [
      '"Applicable Law" means the Indian Contract Act, 1872; the Tamil Nadu Money Lending Entities (Prevention of Coercive Actions) Act, 2025; the Tamil Nadu Money-Lenders Act, 1957 (to the extent applicable); the Information Technology Act, 2000; the Limitation Act, 1963; the Indian Stamp Act, 1899; the Tamil Nadu Stamp Act, 2018; and other applicable Tamil Nadu State enactments.',
      '"Automated Fund Transfer" means transfer of funds through ECS, NACH, UPI, or any other permissible digital payment mode.',
      '"Due Date" means the date on or before which the Instalment(s) become due and repayable as specified in the Loan Documents.',
      '"Effective Date" means the date on which the Borrower consents to obtain the Loan from the Lender.',
      '"Loan Documents" means this Agreement, the Loan Application, the Sanction Letter, the Loan Card, the Demand Promissory Note, the Letter of Continuity, the Repayment Schedule, and all other documents executed in connection with the Loan.',
      '"Outstanding Balance" means the total amount outstanding, including principal, interest, and the permitted charges under Clause E, payable by the Borrower to the Lender.',
      '"Overdue Amount" means, on any date, the instalment(s) that have fallen due and remain unpaid on that date — this is the only amount on which a Delayed Payment Charge under Clause E may be calculated.'
    ]],
    ['B. LOAN AMOUNT', [
      'The Lender shall provide the Loan strictly in accordance with the terms of this Agreement and other Loan Documents. The Loan amount shall be as stated in the Sanction Letter.',
      'The Lender may disburse the Loan in one lump sum or in such instalments as decided at its sole discretion.',
      'The Lender reserves the right to recall the entire Loan and all monies due if any information supplied by the Borrower is found to be incorrect or false, or if the Borrower commits any default, subject to Clause K1 (Fair Recovery) below.',
      'The Borrower has confirmed the following Bank Account details for receipt of Loan disbursement:  Bank Name: '+fill(d.bank_name,20)+' ;  Account Number: '+fill(d.account_number,18)+' ;  IFSC Code: '+fill(d.ifsc_code,14)+' .'
    ]],
    ['C. RATE OF INTEREST', [
      'Interest is charged on a reducing-balance basis at '+ROI_PA+'% (twelve percent) per annum, as stated in the Sanction Letter, within the ceiling notified for unsecured loans under Section 7 of the Tamil Nadu Money-Lenders Act, 1957 (G.O.Ms.No.406, Cooperation Department, dated 5 July 1979 — to be reconfirmed as the currently applicable notification).',
      'The rate shall be disclosed transparently and shall not be revised upward after disbursement without the Borrower\'s written consent.',
      'Interest shall accrue from the Effective Date until full repayment of all amounts due.'
    ]],
    ['D. LOAN REPAYMENT', [
      'The Borrower undertakes to repay the Loan together with the Interest Amount in the number of Instalments specified in the Loan Documents, not later than the respective Due Dates.',
      'Where repayment is by NACH/e-Mandate, the mandate shall not be invoked in a manner inconsistent with Clause K1 (Fair Recovery).',
      'The Borrower shall maintain sufficient balance in the linked bank account and shall neither close the account nor stop payments without prior written consent of the Lender.',
      'NACH/ECS Mandate shall not be withdrawn without at least 30 days\' prior written notice and shall remain valid until complete repayment.',
      'Any amount paid shall be adjusted first towards overdue Delayed Payment Charges, then overdue interest, then overdue principal, then current dues. Payments shall only be made to the Lender\'s official accounts.'
    ]],
    ['E. FEES AND CHARGES — CLOSED LIST', [
      'The Lender shall charge the Borrower only the following, and no other fee or charge by any name, under Section 9(2) of the Tamil Nadu Money Lending Entities (Prevention of Coercive Actions) Act, 2025: (1) Rate of Interest — '+ROI_PA+'% p.a., as above; (2) Processing Charge — '+PROCESSING_CHARGE_LABEL+' on this loan; (3) Insurance Premium — '+INSURANCE_LABEL+', unless an actual policy is procured on the Borrower\'s life/asset, passed through at actuals with supporting proof; (4) Delayed Payment/Penal Charge, as described below.',
      'Delayed Payment/Penal Charge shall be levied only on the Overdue Amount (not the full outstanding principal), at '+PENAL_RATE_LABEL+', shall not be capitalised or added to principal for further interest computation, and shall be applied from the Due Date until the date of actual payment.',
      'The Lender shall not introduce any new charge, or increase an existing one, during the currency of the loan without the Borrower\'s prior written consent.'
    ]],
    ['F. PRE-PAYMENT OF LOAN', [
      'The Borrower shall give at least 30 days\' prior written notice before making any pre-payment of the Loan.',
      'Pre-payment shall include all due instalments, applicable Delayed Payment Charges, and the outstanding principal balance as on the date of pre-payment, without any pre-payment penalty.'
    ]],
    ['G. DEMAND PROMISSORY NOTE', [
      'Where the Borrower has executed a Demand Promissory Note (DPN), the Lender shall be entitled to negotiate the DPN under the Negotiable Instruments Act, 1881. This is a standard commercial-paper right available to any lender under general law and does not depend on any RBI registration.'
    ]],
    ['H. MODE OF COMMUNICATIONS', [
      'Communications by phone, email, SMS, WhatsApp, or online portal shall be valid and binding as per the Information Technology Act, 2000, provided they are also made available in Tamil on request.',
      'The Borrower irrevocably consents to the Lender recording all electronic communications, which may be used as evidence under the Bharatiya Sakshya Adhiniyam, 2023.',
      'Only the Borrower shall communicate instructions to the Lender. Instructions from any other person shall not be binding.'
    ]],
    ['I. LOAN CARD, LOAN STATEMENT AND RECEIPTS', [
      'The Lender shall furnish a Loan Statement to the Borrower at least one day before disbursal, showing principal, applicable charges under Clause E, and effective cost of credit, under Section 9(4) of the 2025 Act.',
      'The Lender shall issue and maintain a Loan Card recording the interest rate, all charges, and every repayment, and shall provide a signed receipt for every payment received, under Sections 9(6) and 9(7) of the 2025 Act.'
    ]],
    ['J. LANGUAGE', [
      'This Agreement, the Sanction Letter, and the Loan Card shall be made available to the Borrower in Tamil in addition to English, as required under Section 9(9) of the 2025 Act. For consumer-protection purposes, the version the Borrower confirms in writing as understood by them shall prevail in case of conflict; for all other purposes the English version is the reference text.'
    ]],
    ['K. EVENTS OF DEFAULT', [
      'Misrepresentation of material information; utilisation of the Loan for any illegal purpose; failure to comply with a material covenant after written notice; or failure to pay an instalment by its Due Date after notice and a reasonable cure period.'
    ]],
    ['K1. FAIR RECOVERY — NO COERCIVE ACTION (Section 20, TN Act 40 of 2025)', [
      'The Lender shall not use, and shall not permit any employee or recovery agent to use, coercive action against the Borrower or the Borrower\'s family, including: threats or intimidation; harassment at the Borrower\'s workplace or residence; contacting the Borrower or family outside 7:00 AM–7:00 PM; public shaming; seizing identity documents; or using force to take possession of any asset without due legal process.',
      'The Lender shall not require or request any third party, including an employer, to deduct or withhold the Borrower\'s salary or dues as a means of recovery.',
      'Recovery of overdue amounts shall be pursued only through written notice, permitted communication channels, and, if necessary, legal process before a court or the Ombudsperson/dispute-resolution mechanism under the 2025 Act.'
    ]],
    ['L. REMEDIES ON DEFAULT', [
      'On default, the Lender may, after written notice and subject to Clause K1 (Fair Recovery): levy the Delayed Payment Charge on the Overdue Amount; recall the Outstanding Balance; and pursue recovery through civil suit or arbitration as set out in Clause Q.',
      'The Borrower shall bear reasonable, actual, and documented legal costs of recovery proceedings that the Lender is required to initiate due to the Borrower\'s default.'
    ].concat(kExtra)],
    ['M. NOTICE & COOLING-OFF', [
      'Any notice by the Lender is deemed served if delivered personally (immediately), by post/courier (two days), or by email/WhatsApp/SMS (immediately). Notice by the Borrower is deemed delivered only when actually received by the Lender.',
      'Cooling-Off / Look-Up Period: one (1) day for loan tenor of 7 days or less; three (3) days for tenor of more than 7 days. No penalty for repayment of principal and proportionate interest during the cooling-off period.'
    ]],
    ['N. USE OF LOAN', [
      'No part of the Loan shall be used for any illegal, immoral, gambling, lottery, or speculative activity. Any dispute relating to goods purchased with the Loan shall not entitle the Borrower to withhold payment to the Lender.'
    ]],
    ['O. NOMINEE', [
      'The Nominee is an emergency contact only, to be informed by the Lender in the event of the Borrower\'s default, death, or incapacity, and does not assume personal liability for the Loan unless a separate guarantee is executed.',
      'Nominee Consent: I, '+fill(d.nominee_name,22)+' (Nominee), having read and understood the above, hereby consent to being nominated as Nominee for this Loan and acknowledge the responsibilities stated herein.'
    ]],
    ['P. DECLARATIONS BY THE BORROWER', [
      'All information and documents provided are true, genuine, and correct, and the Borrower does not violate any existing agreement by availing this Loan.',
      'The Borrower consents to communication by phone, SMS, WhatsApp, or email between 07:00 AM and 07:00 PM, Monday to Sunday, and shall inform the Lender within 7 days of any change in address, employment, or contact details.'
    ]],
    ['Q. OTHER CONDITIONS', [
      'If any provision becomes unenforceable, the remaining provisions remain valid.',
      'The Lender may amend this Agreement only with the Borrower\'s prior written consent, and not unilaterally.',
      'In case of discrepancy between the English and Tamil versions, Clause J (Language) governs which version prevails.'
    ]],
    ['R. DISPUTE RESOLUTION AND JURISDICTION', [
      'Any dispute shall first be referred to the Ombudsperson/grievance mechanism under the Tamil Nadu Money Lending Entities (Prevention of Coercive Actions) Act, 2025, if available and applicable.',
      'Failing resolution, disputes shall be referred to a sole arbitrator appointed by mutual written consent of both Parties within 30 days of a dispute arising; if the Parties cannot agree, the arbitrator shall be appointed by the jurisdictional court under Section 11 of the Arbitration and Conciliation Act, 1996. The Lender shall not unilaterally appoint the arbitrator.',
      'This Agreement is governed by the laws of India and the State of Tamil Nadu, subject to the exclusive jurisdiction of the courts at Thanjavur, Tamil Nadu.'
    ]],
    ['S. ACCEPTANCE', [
      'The Borrower confirms having read, understood, and agreed to this entire Agreement, including all loan details, instalment calculation methods, and the four applicable charge heads, in a language the Borrower understands.'
    ]]
  ];
  AG.forEach(function(sec){
    y = heading(doc, sec[0], y);
    sec[1].forEach(function(t){ y = bullet(doc, t, y, {size:7.8}); });
    y += 1;
  });
  //y = signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});
  y = borrowerSignaturePlainRight(doc, y, d);

  /* ---------- 3. DEMAND PROMISSORY NOTE ---------- */
  doc.addPage(); y = letterhead(doc, 'DEMAND PROMISSORY NOTE');
  y = para(doc, 'On demand, I/We, '+fill(d.name,22)+', S/o | D/o | W/o: '+fill(d.father_name,20)+', residing at '+fill(addrFull+(V(d.pincode)?' - '+d.pincode:''),40)+', (hereinafter the "Borrower") unconditionally promise to pay M/s THENNAGAM FINANCE PRIVATE LIMITED (hereinafter the "Lender"), having its Registered Office at 26/1, Thanjai Main Road, Vangarampettai, Uthamadhanapuram, Thanjavur, Papanasam, Tamil Nadu - 614205, the sum of '+rs(d.loan_amount)+'/- (Rupees '+BLANK(26)+' Only), together with interest thereon at '+ROI_PA+'% (twelve percent) per annum from the date hereof until payment, for value received.', y, {size:8.2, lh:4.4, gap:2});
  y = para(doc, 'This Note is complete and certain on its face and does not depend on any other document for the sum payable. It is executed pursuant to the Negotiable Instruments Act, 1881, and is enforceable under the laws of India, including by way of summary suit under Order 37 of the Code of Civil Procedure, 1908. Delayed Payment Charges arising on default are dealt with separately under the Loan Agreement and do not form part of the sum promised in this Note.', y, {size:8.2, lh:4.4, gap:1.5});
  y = para(doc, 'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein. This document is available to the Borrower in Tamil on request.', y, {italic:true, size:8, gap:2});
  y = para(doc, 'Loan Application Number: '+fill(d.app_id,18), y);
  y = para(doc, 'Date: '+BLANK(16)+'   Place: Thanjavur', y, {gap:2});
 // y = signatures(doc, y, {borrower: d.name}, {borrowerOnly:true});
y = revenueStampBorrowerSignature(doc, y, d); 
y = para(doc, 'This Note must be stamped BEFORE the Borrower signs it, not afterward — under Section 35 of the Indian Stamp Act, 1899, an instrument stamped after execution is inadmissible in evidence until the deficient duty and a penalty are paid. As a demand promissory note, this instrument attracts the fixed/nominal duty under Article 49(a) of the Indian Stamp Act (as amended for Tamil Nadu) — not the ad valorem duty that applies to notes payable at a future date. Confirm the exact current rupee value with a stamp vendor or Sub-Registrar before execution.', y+8, {italic:true, size:7.4, lh:3.7, gap:2});
y = para(doc, 'Execution Checklist (complete before the Borrower signs): all blank fields filled in — none left blank for later completion; Borrower has initialled next to every filled entry; adhesive stamp of the correct value affixed and cancelled BEFORE the Borrower signs; signature obtained only on the fully completed Note.', y, {size:7.4, lh:3.7, bold:true});

  /* ---------- 4. LETTER OF CONTINUITY ---------- */
  doc.addPage(); y = letterhead(doc, 'LETTER OF CONTINUITY');
  y = para(doc, 'To,', y, {gap:0.5});
  y = para(doc, 'THENNAGAM FINANCE PRIVATE LIMITED', y, {bold:true});
  y = para(doc, '26/1, Thanjai Main Road, Vangarampettai, Uthamadhanapuram, Thanjavur, Papanasam, Tamil Nadu - 614205', y, {size:8, gap:2});
  y = para(doc, 'Dear Sir/Madam,', y, {gap:1});
  y = para(doc, 'I, '+fill(d.name,22)+', enclose herewith a duly executed Demand Promissory Note dated '+BLANK(11)+' for '+rs(d.loan_amount)+'/- (Rupees '+BLANK(24)+' Only) executed by me, which is given to you as continuing security for the repayment of the Loan presently outstanding in my name, and also for the repayment of interest and Delayed Payment Charges calculated as set out in the Loan Agreement, and of any further re-loan facility that I may avail hereafter from you.', y, {size:8.2, lh:4.4, gap:1.5});
  y = para(doc, 'The said Demand Promissory Note shall serve as continuing security for the repayment of the ultimate balance and all amounts remaining unpaid on the Loan, now or hereafter, including interest and Delayed Payment Charges as defined in the Loan Agreement. I shall remain liable on the said Demand Promissory Note notwithstanding any payments made from time to time.', y, {size:8.2, lh:4.4, gap:2});
  y = para(doc, 'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein. This document is available to me in Tamil on request.', y, {italic:true, size:8, gap:2});
  y = para(doc, 'Loan Application Number: '+fill(d.app_id,18), y);
  y = para(doc, 'Date: '+BLANK(16)+'   Place: '+BLANK(16), y, {gap:2});
  //y = signatures(doc, y, {borrower: d.name, nominee: d.nominee_name});
y = borrowerSignaturePlainRight(doc, y, d);

  /* ---------- 5. DISBURSEMENT & REPAYMENT SCHEDULE (Schedule B) ---------- */
  doc.addPage(); y = letterhead(doc, 'LOAN DISBURSEMENT & REPAYMENT SCHEDULE');
  doc.setFont('helvetica','bold'); doc.setFontSize(8.6); doc.setTextColor.apply(doc, NAVY);
  doc.text('Schedule "B"', ML, y); doc.setTextColor.apply(doc, INK); y += 6;
  y = para(doc, 'Loan Application No.: '+fill(d.app_id,18), y);
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
      ['1','Rate of Interest (reducing balance, per annum)', ROI_PA+'% p.a.'],
      ['2','Processing Charge', PROCESSING_CHARGE_LABEL],
      ['3','Insurance Premium (if any)', INSURANCE_LABEL],
      ['4','Delayed Payment / Penal Charge', PENAL_RATE_LABEL+', from Due Date until date of payment'],
      ['5','Instalment Amount', rs('')],
      ['6','Number of Instalments', BLANK(9)],
      ['7','Instalment Frequency','Daily / Monthly'],
      ['8','Loan Disbursement Amount', rs('')],
      ['9','Disbursement Date', BLANK(16)],
      ['10','Disbursement Bank Account','Bank: '+fill(d.bank_name,16)+'  A/c No.: '+fill(d.account_number,14)+'  IFSC: '+fill(d.ifsc_code,12)],
      ['11','Loan Repayment Schedule','As per the Loan Card issued with this Agreement']
    ].concat(schedExtra)
  });
  y = doc.lastAutoTable.finalY + 3;
  y = para(doc, 'I/We have read, understood, and agreed to the above Loan Disbursement and Repayment Schedule.', y, {size:8, gap:1});
  y = para(doc, 'The terms were translated and interpreted to me in my native language, and I have fully internalised the rights and liabilities mentioned therein. This document is available to me/us in Tamil on request.', y, {italic:true, size:7.8, gap:1});
  y = borrowerSignaturePlainRight(doc, y, d);

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
