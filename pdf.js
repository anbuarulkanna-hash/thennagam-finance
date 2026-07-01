// Thennagam Finance LMS — pdf: document generation
// Uses docgen.js (DOCS registry: Group A now; B & C add builders there later).
// All existing PDF buttons route through genPDFForApp -> Application Form.

function _pdfDoc(){
  if(!window.jspdf || !window.jspdf.jsPDF){ toast('PDF engine not loaded — check your connection.','err',5000); return null; }
  return new window.jspdf.jsPDF({unit:'mm', format:'a4'});
}
function _builders(g){ return (typeof DOCS!=='undefined' && DOCS && DOCS[g]) ? DOCS[g] : null; }

// ── APPLICATION FORM ──────────────────────────────────────────
async function genPDFForApp(d){
  var b=_builders(d.group);
  if(!b || !b.application){ toast('Application template for Group '+(d.group||'?')+' is coming soon.','info',4000); return; }
  toast('Generating Application Form…','info',2500);
  try{
    var doc=_pdfDoc(); if(!doc) return;
    b.application(doc, d);
    doc.save((d.app_id||'application')+'_Group'+(d.group||'')+'_Application.pdf');
    toast('✅ Application Form downloaded','ok');
  }catch(e){ toast('PDF error: '+e.message,'err',6000); console.error(e); }
}

// ── AGREEMENT PACK ────────────────────────────────────────────
async function genAgreementForApp(d){
  var b=_builders(d.group);
  if(!b || !b.agreement){ toast('Agreement pack for Group '+(d.group||'?')+' is coming soon.','info',4000); return; }
  toast('Generating Agreement Pack…','info',2500);
  try{
    var doc=_pdfDoc(); if(!doc) return;
    b.agreement(doc, d);
    doc.save((d.app_id||'agreement')+'_Group'+(d.group||'')+'_AgreementPack.pdf');
    toast('✅ Agreement Pack downloaded','ok');
  }catch(e){ toast('PDF error: '+e.message,'err',6000); console.error(e); }
}

// ── UI wrappers (called from inline onclick) ──────────────────
function genPDF(){        var a=S.apps.find(function(x){return x.app_id===S.viewId;}); if(a) genPDFForApp(a); }
function genPDFFromLast(){ if(S.lastData) genPDFForApp(S.lastData); }
function quickPDF(id){    var a=S.apps.find(function(x){return x.app_id===id;}); if(a) genPDFForApp(a); }

function genAgreement(){         var a=S.apps.find(function(x){return x.app_id===S.viewId;}); if(a) genAgreementForApp(a); }
function genAgreementFromLast(){ if(S.lastData) genAgreementForApp(S.lastData); }
