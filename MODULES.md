# Thennagam Finance LMS — module layout

The single `index.html` was split into HTML + CSS + 10 JS modules.
No behaviour changed. All functions stay **global** (loaded as classic
`<script src>` files) so the existing inline `onclick` handlers keep working.

```
index.html          HTML skeleton only — links css + loads js modules in order
css/styles.css      all styling (was the <style> block)
js/
  config.js         SCRIPT_URL, STAFF, COLS, state object S, GINFO, TITLES
  helpers.js        $ gv esc fmtN cleanSt formatDOB stBadge toast showLoad hideLoad
  auth.js           login, logout
  data.js           Google Sheet I/O: loadApps, setStatus, deleteApp, saveEdit
  navigation.js     go (router), renderDash, sc, renderApps
  view.js           viewApp, row, view modal, openEditModal/closeEditModal
  form.js           multi-step new-application form: render/validate/collect/submit/preview
  reports.js        renderRpt, renderCfg, saveUrl, testConnection
  docgen.js         document templates — letterhead/section/table/signature helpers
                    + Group A builders (Application Form + Agreement Pack).
                    DOCS registry: add Group B & C builders here later.
  pdf.js            thin router — genPDFForApp (Application) / genAgreementForApp
                    (Pack); dispatches by group via DOCS; saves the file
  app.js            window.onload bootstrap (no-op — data still loads on login)
```

Load order in index.html is fixed: **config first, app.js last.**

## Notes
- Removed one block of dead code: the old commented-out `buildPDF(d,appId)`.
- Chose classic scripts over ES modules on purpose — ES `import/export` would
  break every inline `onclick`. If you later want true ES modules, each handler
  must become `window.fn = fn` or an addEventListener binding.
- Deploy: commit the whole folder (index.html + css/ + js/). GitHub Pages serves
  the subfolders fine. Local testing via file:// also works (classic scripts).

## Document generation (Groups A, B & C)
Filling the form and clicking **Application PDF** or **Agreement Pack** renders a
filled PDF from the form data, matching the Word templates.

- Everything the form captures is auto-filled (name, father/spouse, address,
  contact, Aadhaar/PAN, bank details, loan amount, tenure, instalment date,
  nominee, references, app ID, application date).
- Sanction/disbursement-stage fields that don't exist yet at application time
  (ROI, processing fee, instalment amount, number of instalments, APR, disbursal
  amount, disbursement date, repayment-schedule rows) are left as underscore
  blanks — exactly as the templates present them, to be completed at approval.

**All three groups are live.** The builders are group-aware: `buildApplication(doc,d,g)`
and `buildAgreement(doc,d,g)` read `GROUPS[g]` for the label/loan-category and add the
group-specific bits — B adds Document Registration (Section 4 field, an Agreement Section K
clause, and a Schedule B row); C adds Property/Security + Title + MOD Status fields, two
Agreement Section K clauses (MOD + registration), and a Schedule B row. Those extra fields
aren't captured by the form yet, so they render as fill-in blanks like the sanction-stage
fields. `DOCS = { A, B, C }` at the bottom of docgen.js wires them to the buttons.
