# HANDOFF — Interaktív, egyfájlos tanulóoldal építése

Ez a dokumentum összefoglal **mindent, ami egy ilyen vizsgafelkészítő/tanulóoldal nulláról
felépítéséhez kell**: az architektúrát, a haladás-szinkron felépítését (Firebase),
a publikálást (GitHub Pages), és — a legfontosabb — **hogyan rendezd az anyagot úgy, hogy
tényleg meg lehessen tanulni belőle**.

> Nincs benne egyetlen API-kulcs, repó-URL vagy projektspecifikus azonosító sem.
> Csak a *szerkezet* — bárhova átültethető. A konkrét projekt házirendje a `CLAUDE.md`-ben,
> a rövid módszertan a `SKILL.md`-ben van; ez a fájl a kettő közti „mérnöki” réteg.

---

## 0. Filozófia — mire optimalizálunk

1. **Tanítás, nem magolás.** Minden válaszhoz tartozik egy rövid „miért”. A cél, hogy a
   tanuló a vizsgán *ne csak felismerje*, hanem *le tudja vezetni* a választ.
2. **Egyetlen, önálló HTML-fájl.** Nincs build-lépés, nincs npm, nincs külső JS-függőség
   (a Firebase-t leszámítva, ami CDN-ről jön és hiba esetén kecsesen kiesik). Offline is fut.
3. **Egy forrás → több megjelenés.** A fogalmak egyetlen adatobjektumban élnek; ebből
   generálódik a Fogalomtár ÉS a kérdéseknél felugró koncepció-ablak. Nincs duplikálás.
4. **Hűség + látható helyesbítés.** Ha a forrás-kulcs hibás, NE némán írd felül — jelöld
   (⚠ doboz), és add meg a helyes elméletet. A tanuló tudja, mit fog látni a vizsgán.
5. **Haladás-megőrzés szent.** A tanuló munkája (tippek, „értem” jelölések) nem veszhet el
   tartalom-szerkesztéskor — lásd a qid-stabilitást (3.3).

---

## 1. Fájlszerkezet

```
projekt/
├─ munkapeldany.html      # itt szerkesztesz; önálló, offline fut
├─ index.html             # a munkapéldány MÁSOLATA — ezt szolgálja ki a Pages
├─ CLAUDE.md              # projekt-házirend (konvenciók, ismert kulcshibák)
├─ SKILL.md               # „hogyan építsünk ilyet” rövid módszertan
├─ HANDOFF.md             # ez a fájl
└─ forrasok/              # PDF-ek, jegyzetek — NEM kerülnek a repóba (.gitignore)
```

A munkapéldány és az `index.html` **mindig ugyanaz a tartalom**. Deploykor szinkronizáld őket.
(Lehetne szimlink vagy build is, de a „másold át” a legegyszerűbb és legrobusztusabb.)

---

## 2. Az egyetlen HTML belső felépítése

Egy fájl, három blokk: `<style>` (CSS-változókkal), `<body>` (a tartalom), `<script>`
(az interakció és az adat). Sorrend a `<body>`-n belül:

### 2.1 Fülek (tabek)
`section.part` szekciók, JS-sel váltva (`section.part.active`). Tipikus felosztás:

| Fül | Tartalom |
|---|---|
| **Tananyag** | Statikus, egymásra épülő leckék (a „tankönyv”). |
| **Áttekintés** | Vizsgaszerkezet + összesítő haladás-dashboard. |
| **1·… / 2·… / 3·…** | Egy fül **vizsgarészenként** (a tényleges kérdésbank). |
| **Fogalomtár** | A fogalom-objektumból generált, rétegezett szótár. |

### 2.2 Kártyatípusok (a tartalom építőkövei)

| Osztály | Szerep | Kulcs-attribútum |
|---|---|---|
| `.tf` | Igaz/Hamis állítás | `data-answer="I\|H"`, belül `.stmt` + `.ans` |
| `.qa` | Kérdés–válasz | belül `.q` (kérdés) + a válasz |
| `.def` | Kifejtős / definíció | belül `.h` (fejléc) + törzs |
| `.callout` / `.note` | Kiemelt doboz (pl. ⚠ helyesbítés) | — |
| `table.grid` | Összehasonlító táblázat | `.tablewrap`-be csomagolva (mobil-görgetés) |
| `.lesson` | Tananyag-lecke | `data-lid="l1…"`, belül `.lno` + `h3` |
| `.topic` | Témakör-fejléc (haladás-sáv tartója) | `id` (golink-horgony) |
| `.cbar` | Koncepció-csip sáv egy témakör fölött | `data-c="id1,id2,…"` |

### 2.3 Tananyag-leckék
Statikus HTML, `data-lid`-del, egymásra épülve. A leckékben **golink**-ek mutatnak a
kérdés-témakörökre (`.topic` elemek `id`-jére). A lecke-TOC JS-ből generálódik (`#ltoc`),
és jelöli a kész leckéket.

---

## 3. A haladás-réteg (state)

Ez teszi „komollyá” az oldalt: a tanuló jelölget, és a haladása megmarad eszközök közt is.

### 3.1 Az adatmodell
Felhasználónként egy objektum:
```js
{
  displayName: "Név",
  updated: 1700000000000,   // ms timestamp — a merge ezt használja
  guesses: { "<qid>": "ok"|"bad" },   // I/H tippek találata
  marks:   { "<qid>": "ok"|"part"|"bad" }, // önértékelés: tudtam/részben/nem
  lessons: { "<lid>": true }          // elvégzett leckék
}
```

### 3.2 A `Store` objektum
Egy egyszerű singleton kezeli az állapotot:
- `loadLocal()` / `saveLocal()` — localStorage (`<app>:progress:<userKey>` kulcs).
- `set(kind, id, val)` — beír egy értéket, menti lokálba, és **debounce-olt** távoli mentést
  ütemez (`queueRemoteSave`). `null` érték = törlés.
- `emptyData(name)` — üres váz.

### 3.3 ⚠ qid-stabilitás (a legfontosabb csapda)
Minden értékelhető kártya betöltéskor kap egy `data-qid`-t a **megjelenített szöveg hashéből**
(`assignQids` → `qhash`). A qid = `<szekció-id>-<a .stmt/.q/.h szövegének hashe>`.

**Következmény:** ha megváltoztatod egy kártya kérdés-/állítás-szövegét, megváltozik a qid,
és az ahhoz a kártyához tartozó mentett haladás **elvész**. Elírás-javításnál ez vállalt;
tömeges átfogalmazás előtt gondold át. (Stabilabb alternatíva: kézi `data-qid` minden kártyán —
de akkor neked kell garantálnod az egyediséget.)

A hash egy egyszerű FNV-1a, 36-os számrendszerben — semmi kriptográfia, csak rövid, stabil
azonosító ugyanahhoz a szöveghez.

### 3.4 Belépés (jelszó nélkül)
A tanuló beír egy nevet → `normUserKey()` normalizálja (kisbetű, tiltott karakterek `_`-ra),
ez lesz a `userKey`. Eltárolva `<app>:user` alatt, így legközelebb automatikusan belép.
**Nincs jelszó, nincs auth** — a nevek nyilvánosak, bárki bárki nevével beléphet. Ez tudatos
egyszerűsítés egy alacsony tétű tanulóeszközhöz; ne tárolj így érzékeny adatot.

---

## 4. Firebase-kapcsolat (STRUKTÚRA, kulcsok nélkül)

A cél: a haladás kövesse a tanulót eszközök közt. Realtime Database (RTDB) elég hozzá.

### 4.1 Mit kell beállítani a Firebase-oldalon
1. Hozz létre egy projektet a Firebase konzolon, és benne egy **Realtime Database**-t.
2. A web-app regisztrációkor kapsz egy **`firebaseConfig` objektumot** (apiKey, authDomain,
   databaseURL, projectId, …). Ez kerül a `<script>`-be. *(Ezek a webes RTDB-nél nem titkok
   a hagyományos értelemben — a böngészőbe amúgy is kimennek; a védelmet a szabályok adják.)*
3. Állítsd be a **Database Rules**-t. Egy egyszerű, név-alapú modellhez:
   ```json
   {
     "rules": {
       "progress": {
         "$userKey": { ".read": true, ".write": true }
       }
     }
   }
   ```
   Ez **nyilvános olvasás/írás** a `progress` ág alatt — megfelel a jelszó nélküli,
   alacsony tétű használatnak. Ha komolyabb kell, vezess be Firebase Auth-ot és kösd a
   szabályt `auth.uid`-hez.

### 4.2 Az adat alakja az RTDB-ben
```
progress/
  <userKey>/        # a normalizált név
    displayName, updated, guesses{}, marks{}, lessons{}   # = a 3.1 adatmodell
```
Egy felhasználó = egy gyerek a `progress` alatt. Más fát NE érints.

### 4.3 A kliens-logika (a HTML `<script>`-jében)
1. **Betöltés CDN-ről**, compat build (egyszerűbb, nem kell bundler):
   ```html
   <script src=".../firebase-app-compat.js"></script>
   <script src=".../firebase-database-compat.js"></script>
   ```
2. **Inicializálás védve** — ha nincs net / blokkolt a CDN, az oldal MŰKÖDJÖN tovább lokálisan:
   ```js
   let db=null;
   try{ if(typeof firebase!=='undefined'){ firebase.initializeApp(cfg); db=firebase.database(); } }
   catch(e){ db=null; }
   ```
3. **Belépéskor `remoteLoad()`**: `db.ref('progress/'+userKey).get()` → merge a lokálissal →
   `applyState()`. Ha nincs `db`, csak a lokális állapot él (sync-jelző „err”).
4. **Mentés debounce-szal (`queueRemoteSave`)**: minden `Store.set` után 2 mp-es timer,
   ami `db.ref('progress/'+userKey).set(data)`. Így a sok gyors kattintás egy írásba olvad.
5. **`visibilitychange` → azonnali flush**: amikor az oldal háttérbe kerül/bezárul, töröld a
   timert és írj azonnal, hogy ne vesszen el az utolsó pár jelölés.
6. **Sync-jelző** (`#syncdot`): `on` (zöld, szinkronban) / `''` (kapcsolódás) / `err`
   (csak lokális). Vizuális visszajelzés a tanulónak.

### 4.4 Merge-stratégia (offline-first)
Mivel két eszköz is írhat, kell egy egyszerű konfliktus-feloldás:
- Ha a **lokális üres** → fogadd el a távolit.
- Egyébként az **újabb `updated`** nyer mezőszinten: a két oldal `guesses`/`marks`/`lessons`
  szótárait összeolvasztod (`Object.assign(older, newer)`), `updated = max(...)`.

Ez „last-write-wins kulcsonként”, nem teljes CRDT — egy tanulóeszközhöz bőven elég. A
veszteség legrosszabb esetben egy-egy kattintás, ha ugyanazt a kártyát két eszközön
egyszerre, offline jelölöd meg ellentétesen.

---

## 5. Publikálás — GitHub Pages (struktúra)

Nincs build-lépés, ezért a deploy triviális:

1. A repó **gyökerében** legyen egy `index.html` (a munkapéldány másolata).
2. A repó beállításainál kapcsold be a **Pages**-t: forrás = a fő branch, mappa = `/ (root)`.
3. Pár perc múlva a `https://<felhasználó>.github.io/<repó>/` címen él.

Frissítés (mivel nincs CI/build):
```
# szerkeszd a munkapéldányt, majd:
git clone <repó> tmp && cd tmp
cp ../munkapeldany.html index.html      # szinkronizálás
git add index.html && git commit -m "..." && git push
```

> A `forrasok/` (PDF-ek) maradjon lokális — `.gitignore`-ral kizárva. A repóba csak a
> kész `index.html` (+ esetleg a doksik) kerül.

Akár hagyhatsz egy GitHub Actiont is, ami push-kor másolja a munkapéldányt `index.html`-re,
de a kézi másolás kevesebb hibalehetőség.

---

## 6. A fogalom-réteg (ettől „tanít” az oldal)

Ez a kód magja. Egyetlen adatszerkezetből generálódik a Fogalomtár ÉS a kérdés-popupok.

### 6.1 Az adat
Két objektum a `<script>`-ben:

```js
const LAYERS=[ {n:1,t:"Alapfogalmak",d:"…"}, {n:2,t:"Nyelvműveletek",d:"…"}, … ];

const C={
  abc:{ t:"Ábécé (Σ)", layer:1, pre:[],          short:"Szimbólumok véges halmaza",
        body:`…ebből épülnek a {{szo|szavak}}.` },
  szo:{ t:"Szó",        layer:1, pre:["abc","eps"], short:"Betűk véges sorozata",
        body:`Az {{abc|ábécé}} betűiből álló véges sorozat…` },
  …
};
```
Egy fogalom = `{ t: cím, layer: rétegszám, pre: [előfeltétel-id-k], short: egysoros, body: HTML }`.

### 6.2 A `{{…}}` kereszthivatkozás-token
A `body`-ban `{{id}}` vagy `{{id|látható címke}}` → a JS kattintható linkké (`.clink`)
alakítja, ami a Fogalomtárhoz ugrik és kiemeli a cél-kártyát. Így a fogalmak hálót alkotnak,
nem szigetek.

### 6.3 Két megjelenés egy forrásból
- **Fogalomtár** (`#glossary`): a `C`-ből rétegekbe (`LAYERS`) rendezve generálva, minden
  kártyán „Ehhez kell:” előfeltétel-linkekkel (a `pre[]` alapján). Az alapfogalmaktól a
  tételekig — *látható, hogy mi mire épül*.
- **Kérdés-popupok**: minden témakör fölött egy `<div class="cbar" data-c="id1,id2,…">`.
  A JS ezt csipekké alakítja; kattintásra **inline panel** nyílik a fogalom `short`/`body`
  szövegével. A tanuló nem hagyja el a kérdést, mégis ott a fogalom.

### 6.4 Miért jó ez tanulásra
A „mit kell tudni ehhez a kérdéshez” explicit (csipek), a „mi épül mire” explicit
(rétegek + előfeltételek), és minden fogalom egy helyen karbantartott. Új kérdésnél csak
felsorolod a releváns fogalom-id-ket a `cbar`-ban — a tartalom már létezik.

---

## 7. Interakciós réteg (UI-viselkedés)

- **`.tf` kártyák:** Igaz/Hamis tippgombok (`.gbtn`) → azonnali visszajelzés
  (helyes/„a helyes válasz: …”). A tipp találata `guesses`-be megy.
- **`.qa` és kifejtős `.def`:** „Mutasd a választ” gomb + **önértékelés** (`.mbtn`:
  Tudtam / Részben / Nem tudtam) → `marks`.
- **Haladás-megjelenítés:** minden `.topic` fejlécen sáv (`x/y értem`), az Áttekintésen
  összesítő `#dash` (részenként + tipp-találati arány + lecke-haladás).
- **Fejléc-kapcsolók:**
  - **Tanulós mód** (`body.study`): minden válasz eleve látszik (átnézéshez). Alapból
    teszt-mód (válaszok rejtve, önteszthez).
  - **„Csak amit nem értek”** szűrő (`body.filterbad`): elrejti a `mark="ok"` kártyákat.
  - **Keresés** (`#search`): szövegre szűri a kártyákat.

Mind CSS-osztály-kapcsoló a `<body>`-n + pár sor JS — nincs framework.

---

## 8. Dizájn-konvenciók

- **Sötét téma, CSS-változókból** (`:root`). Egy akcentus-szín végigviszi a hangsúlyokat.
- **Egyedi, de olvasható tipográfia** — kerüld a generikus Arial/Inter/Roboto hármast.
  Külön betűcsalád címnek, törzsnek és a „kódnak”/jelölésnek (monospace).
- **Olvashatóság:** a magyarázat-szöveg kapjon külön, *világosabb* színt (`--read`), hogy
  jól olvasható legyen; a kiemelések (félkövér = fehér, `.m` = akcentus-kód, jelvények)
  továbbra is kiugranak.
- **Matematikai jelölés:** `<span class="m">` (inline) / `<p class="m blk">` (blokk),
  **Unicode** jelekkel (ε, Σ, δ, ⇒, ⊆, ⁺ …). **Nincs MathJax** — offline-first. Csak akkor
  vess be MathML/MathJax-et, ha tényleg elkerülhetetlen.
- **Reszponzív:** tördelődő fülek, külön sorba kerülő kereső, `.tablewrap`-ben görgethető
  táblázatok, mobilon tördelődő hosszú képletek. Teszteld ~390px szélességen.

---

## 9. Hogyan építsd fel az ANYAGOT, hogy jól tanulható legyen

Ez a tartalmi rész — a technikánál fontosabb. A sorrend számít.

### 9.1 Dolgozd fel a forrást, ne találj ki anyagot
- Olvasd el **az összes** forrást (a Read tool PDF-et is olvas). A kapott anyag a kánon.
- Azonosítsd a **vizsgaszerkezetet** (hány rész, pontozás, kérdéstípusok) — gyakran külön
  „minta” fájlból. Az oldal fül-szerkezete EZT tükrözze.
- Szedd ki a **kérdésbankot** és a **válaszkulcsot**.

### 9.2 Rendezd: rész → témakör → tétel
- Csoportosítsd a kérdéseket vizsgarész, azon belül témakör szerint.
- **Deduplikálj** — a kérdésbankok tele vannak ismétléssel. Egy fogalom egyszer.
- Minden tételhez: **kérdés → válasz → rövid „miért”**. A „miért” nélkül magolás lesz.

### 9.3 Építsd a tudást rétegekben (ettől „tanulható”)
- Készítsd el a **fogalom-rétegeket** (LAYERS): alapfogalmaktól (ábécé, szó, nyelv) a
  műveleteken és gépeken át a tételekig. Minden fogalomnak legyen `pre[]` előfeltétele.
- Írd meg a **Tananyag-leckéket** úgy, hogy **egymásra épüljenek**, és linkeljenek előre a
  kérdés-témakörökre. A lecke a „tankönyv”, a kérdés a „gyakorlat”.
- A kérdéseknél tedd ki a megoldáshoz kellő **fogalom-csipeket** (`cbar`). A tanuló lássa,
  *mit kell tudnia* a válaszhoz — és érje el egy kattintással.

### 9.4 Aktív felidézés, ne passzív olvasás
- Alapból **teszt-mód**: a válasz rejtve, a tanuló előbb **tippel** (I/H) vagy **felidéz**,
  csak utána fedi fel. A tipp-találat és az önértékelés méri a valódi tudást.
- Önértékelés három fokkal (Tudtam / Részben / Nem tudtam) → ebből jön a **„csak amit nem
  értek”** szűrő → célzott ismétlés. Ez a lényeg: a tanuló a gyenge pontjaira fókuszálhat.
- Haladás-sávok adjanak visszajelzést és lendületet.

### 9.5 Helyesbítsd a kulcshibákat — láthatóan
- Ha a forrás-kulcs hibás/ellentmondásos, **NE** írd némán felül. Tedd `.note`/⚠ dobozba a
  helyes elméletet, és **dokumentáld** a projekt-fájlban (`CLAUDE.md` „Ismert kulcshibák”).
  A tanuló tudja meg, mit fog látni a vizsgán ÉS mi a helyes.
- A PDF-ek ábrái/jelölései félreolvashatók — **elméletileg ellenőrizd**, ne csak másold.

---

## 10. Ellenőrzés (mielőtt késznek mondod)

- Nyisd meg böngészőben (`python -m http.server` vagy Playwright) és nézd a **konzolt**
  hibára.
- Próbáld végig: fülváltás · válasz-felfedés · I/H tipp · koncepció-csip nyitása ·
  fogalomtár-link ugrás+kiemelés · keresés/szűrő · **mobil szélesség (~390px)**.
- **Haladás-szinkron:** lépj be névvel, jelölj párat, töltsd újra → megmaradt-e (lokál);
  másik böngészőből ugyanaz a név → átjött-e (Firebase). Kapcsold ki a netet → fut-e tovább
  lokálisan, „err” jelzéssel.
- **qid-stabilitás:** szerkesztés után ne vesszen el indokolatlanul a haladás — ne nyúlj
  a `.stmt`/`.q`/`.h` szövegéhez, ha nem muszáj.

---

## 11. Buktatók — gyűjtemény

- **Munkapéldány ↔ `index.html` szétcsúszik.** Deploykor MINDIG szinkronizáld.
- **qid-elcsúszás.** Az értékelt kártyák szövegének átírása töröl haladást. Lásd 3.3.
- **Firebase nélkül is futnia kell.** Az init védve, a `db===null` ág végig kezelve legyen.
- **Nyilvános rules = bárki írhat.** Tudatos kompromisszum; ne tárolj érzékeny adatot.
  Komolyabb igénynél: Firebase Auth + `auth.uid`-hez kötött szabály.
- **MathJax-csábítás.** Az offline-first miatt maradj Unicode-nál, ahol lehet.
- **Kulcs „visszajavítása”.** A szándékos helyesbítéseket ne told vissza a hibás kulcsra —
  tartsd számon őket a projekt-doksiban.

---

**Összefoglalva a recept:** egy önálló HTML (style+body+script) · kártya-alapú tartalom
vizsgarészenkénti fülekben · egyetlen fogalom-objektum, amiből a Fogalomtár és a kérdés-
popupok is jönnek · szöveghash-alapú qid + `Store` a haladáshoz · localStorage + RTDB
(`progress/<userKey>`, debounce-olt írás, updated-alapú merge, kecses fallback) · GitHub
Pages a gyökér `index.html`-ből · és az anyag rétegekben, aktív felidézésre építve,
látható kulcs-helyesbítésekkel.
