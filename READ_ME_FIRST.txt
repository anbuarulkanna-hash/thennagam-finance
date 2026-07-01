THENNAGAM FINANCE — Loan Management System
==========================================

TWO WAYS TO RUN — pick one:

1) index.standalone.html   ← EASIEST / most robust
   One self-contained file. CSS and all JavaScript are inlined.
   You can double-click it, e-mail it, or open it straight from a zip —
   it always styles and runs correctly. (Needs internet only for the
   PDF engine, which loads from a CDN.)

2) index.html  +  css/  +  js/   ← the modular version (for GitHub Pages / editing)
   IMPORTANT: this version needs its css/ and js/ folders sitting next to
   index.html. If you open index.html *from inside the .zip*, Windows hands
   the browser only that one file (a temp "...zip.c48\..." path) WITHOUT the
   css/ and js/ folders — so it appears unstyled and stuck on "Loading…".
   FIX: right-click the zip → "Extract All" → open index.html from the
   extracted folder. On GitHub Pages this never happens; all files are served.

Both files are identical in behaviour. Use #1 for local/offline/sharing,
#2 for GitHub Pages and when editing the modular source.
