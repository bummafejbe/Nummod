# Numerikus módszerek — vizsgafelkészítő tanulóoldal

Egyetlen, **önálló, offline** HTML-oldal (`index.html`) a *Numerikus módszerek* tárgy vizsgájához. Nincs build-lépés a használathoz: nyisd meg az `index.html`-t bármelyik böngészőben.

## Mit tartalmaz

- **Tananyag** — 10 egymásra épülő lecke (1 napos terv), képletekkel és **kidolgozott példákkal**, hogy a kérdések ténylegesen megoldhatók legyenek belőle. Minden lecke tetején „Jelölések” referencia.
- **Áttekintés** — a vizsga felépítése, pontozás, 1 napos beosztás, élő haladás-dashboard.
- **3 kérdés-fül** — a két hivatalos vizsga **30 kérdése** témakör szerint, teljes magyarázattal (amber „Eredeti vizsga” keret).
- **Gyakorlóbank** — **224 további kérdés** (a nyilvános nummodkviz gyakorlóoldalról), témakörbe sorolva, türkiz kerettel, csak a helyes válasszal.
- **Vizsga-szimuláció** — 15 véletlen feleletválasztós kérdés, opcionális időzítővel, kiértékelés a hivatalos pontskálán + témakör-bontás.
- **Fogalomtár** — ~60 fogalom 7 rétegben, előfeltétel-linkekkel és kereszthivatkozásokkal.

Funkciók: helyi (név-alapú) haladás-mentés a böngészőben, Tanulós mód, „Csak amit nem tudok” szűrő, témakörönkénti törlés, keresés, koncepció-csipek, beágyazott **KaTeX** (matematikai jelölés, internet nélkül is).

## Használat

Töltsd le a repót, és nyisd meg az **`index.html`**-t. Nem kell szerver, nem kell internet — minden (a KaTeX is) be van ágyazva.

## Újraépítés (ha szerkeszted a forrást)

A forrásdarabok a `_src/` mappában vannak; a kész `index.html`-t a build-szkript fűzi össze:

```sh
python _src/build.py
```

- `_src/app.css` — stílus
- `_src/body.html` — a váz
- `_src/content.js` — fogalmak, témakörök, a 30 eredeti kérdés
- `_src/content2.js` — a 224 gyakorlókérdés
- `_src/lessons.js` — a tananyag-leckék
- `_src/engine.js` — az interakció, haladás-tárolás, KaTeX-renderelés
- `_katex/` — beágyazott KaTeX (offline futáshoz)

## Megjegyzés

A repó csak a működő oldalt és a build-pipeline-t tartalmazza. A tananyag-források
(`HANDOFF.md`, a vizsgakérdések és az előadás-összefoglalók) lokálisan, a repón
kívül készültek.
