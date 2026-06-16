# Numerikus módszerek C — 5. előadás tananyaga
## Mátrixnormák és a lineáris egyenletrendszerek (LER) érzékenysége

> **Mit fed le ez a PDF?** A teljes kurzusból egyetlen témakört dolgoz fel mélyen: **„Mátrixnormák. A lineáris egyenletrendszerek érzékenysége."** Felépíti a mátrixnormák fogalmát (köztük a Frobenius- és az indukált normákat), bevezeti a **kondíciószámot**, és ezzel jellemzi, mennyire érzékeny egy LER megoldása a jobb oldal és a mátrix kis hibáira (perturbációira). A végén a **felbontások** (LU/QR/Cholesky) kondicionáltságra gyakorolt hatását és a **relatív maradékot** (reziduum) tárgyalja. Áttételesen kapcsolódik a direkt módszerekhez (Gauss/LU) és — a Vandermonde- és Hilbert-mátrixokon keresztül — az interpolációhoz és a legkisebb négyzetekhez.

---

## A nagy kép (ezt értsd meg először — ez köti össze az egészet)

Az egész előadás egyetlen kérdés köré szerveződik: **ha kicsit elrontjuk a bemenetet, mennyire romlik el a megoldás?** Ezt két, élesen különböző dolgot kell szétválasztani — a vizsga kedvenc csapdája épp ez a szétválasztás:

- **A feladat érzékenysége** (kondicionáltság): mennyire kényes maga az $Ax=b$ probléma. Ezt a **kondíciószám**, $\text{cond}(A)$ méri. Ez a mátrix tulajdonsága, **független attól, milyen algoritmussal oldod meg.**
- **Az algoritmus stabilitása**: mennyire pontosan dolgozik a konkrét megoldó módszer. Ezt a **maradékvektorral / relatív maradékkal** ($\eta$) jellemezzük.

A kettőt összekötő ökölszabály (ezt tartsd a fejedben): **előrehiba $\lesssim$ kondíciószám $\times$ visszafelé-hiba.** Vagyis egy módszer adhat *icipici maradékot* (stabil), és a megoldás **mégis pontatlan** lehet, ha a feladat rosszul kondicionált. A mátrixnormák pedig csak az „infrastruktúra": ezekkel tudjuk egyáltalán számszerűsíteni a „mennyire nagy egy mátrix / egy hiba" kérdést.

---

## 1. Mátrixnormák — az alapfogalom

### CORE

A **mátrixnorma** egy $\|\cdot\|:\mathbb{R}^{n\times n}\to\mathbb{R}$ leképezés, amely teljesíti az alábbi öt axiómát:

1. $\|A\|\ge 0$ (nemnegativitás),
2. $\|A\|=0 \iff A=0$ (definitség),
3. $\|\lambda A\|=|\lambda|\cdot\|A\|$ (abszolút homogenitás),
4. $\|A+B\|\le\|A\|+\|B\|$ (háromszög-egyenlőtlenség),
5. $\|A\cdot B\|\le\|A\|\cdot\|B\|$ (**szubmultiplikativitás**).

Az első négy **pontosan ugyanaz, mint a vektornormáknál.** Az ötödik, a **szubmultiplikativitás az új, megkülönböztető axióma** — ez a vektornormáknál nincs (ott nincs is mit szorozni). Ez teszi a mátrixnormát mátrixnormává. Intuíció: a szorzat „mérete" nem nőhet túl a tényezők méreteinek szorzatán — épp ez teszi a mátrixnormát használhatóvá a hibabecslésekben (a teljes előadás végig erre az egy egyenlőtlenségre épít).

**Frobenius-norma.** A legtermészetesebb „naiv" választás: tekintsd a mátrixot $n^2$ elemű vektornak, és vedd az euklideszi (2-es) hosszát:
$$\|A\|_F=\left(\sum_{i=1}^n\sum_{j=1}^n |a_{ij}|^2\right)^{1/2}.$$
Ez **valódi mátrixnorma.** Az 1–4. axióma a vektor 2-norma tulajdonságaiból azonnal adódik; az 5. (szubmultiplikativitás) a **Cauchy–Bunyakovszkij–Schwarz**-egyenlőtlenséggel látható be. (A konkrét számpélda — $\|A\|_F$ kiszámolása egy $2\times2$ mátrixra — csak gyakorlás; a lényeg a *fogalom*: elemenkénti euklideszi méret.)

### Vizsgára fontos
- A mátrixnorma = a vektornorma 4 axiómája **+ szubmultiplikativitás**. Ha egy „norma" nem szubmultiplikatív, akkor nem mátrixnorma az itteni értelemben.
- A Frobenius-norma valódi mátrixnorma, és „elemenkénti euklideszi hossz". A szubmultiplikativitása CBS-ből jön.

---

## 2. Indukált (természetes) normák és a három nevezetes mátrixnorma

### CORE

Adott egy $\|\cdot\|_v$ **vektornorma.** Az általa **indukált mátrixnorma**:
$$\|A\|:=\sup_{x\ne 0}\frac{\|Ax\|_v}{\|x\|_v}.$$
Egy mátrixnormát **természetesnek** nevezünk, ha **van olyan vektornorma, amely indukálja.** Tétel: az indukált normák valóban kielégítik mind az öt axiómát (a szubmultiplikativitás bizonyítása a trükkös rész, a $y:=Bx$ helyettesítéssel).

**Intuíció:** $\|A\|$ a legnagyobb nyújtási arány, amit $A$ egy vektoron okozhat. Átfogalmazva (ezeket érdemes ismerni):
$$\|A\|=\sup_{\|y\|_v=1}\|Ay\|_v,\qquad \text{(a sup helyett max is írható).}$$
Továbbá minden $x$-re $\|Ax\|_v\le\|A\|\cdot\|x\|_v$, **és $\|A\|$ a *legkisebb* ilyen $C$ konstans.** (Ez a tulajdonság fogja össze az egész hibaelméletet.)

**Illeszkedő (kompatibilis) normák.** Egy mátrix- és egy vektornorma **illeszkedő**, ha
$$\|Ax\|_v\le\|A\|\cdot\|x\|_v\quad(\forall x, A).$$
Állítás: **a természetes mátrixnormák illeszkednek az őket indukáló vektornormához** (lényegében konstrukció szerint). Ez a tulajdonság teszi lehetővé, hogy a normát „átvigyük" a mátrix és a vektor között a becslésekben.

**A három nevezetes indukált norma** (ezt KÖTELEZŐ fejből tudni — klasszikus A/B/C/D csapda):

| Vektornorma indukálja | Mátrixnorma | Képlet | Magyar név |
|---|---|---|---|
| $\lVert\cdot\rVert_1$ | $\lVert A\rVert_1$ | $\displaystyle\max_{j}\sum_{i}\lvert a_{ij}\rvert$ | **oszlopnorma** (max. oszlopösszeg) |
| $\lVert\cdot\rVert_\infty$ | $\lVert A\rVert_\infty$ | $\displaystyle\max_{i}\sum_{j}\lvert a_{ij}\rvert$ | **sornorma** (max. sorösszeg) |
| $\lVert\cdot\rVert_2$ | $\lVert A\rVert_2$ | $\displaystyle\big(\max_i\lambda_i(A^\top A)\big)^{1/2}$ | **spektrálnorma** |

### NUANCE — itt buknak el sokan
- **A „kereszteződés" a csapda:** az **1-norma OSZLOP**összegen maximalizál, az **$\infty$-norma SOR**összegen. Pont fordítva, mint amit elsőre gondolnál. Tanuld meg: *„1 → oszlop, ∞ → sor."*
- A spektrálnorma **nem** a sajátértékekből számol közvetlenül, hanem **$A^\top A$ sajátértékeinek** maximumából (gyök alatt). Ezek azért nemnegatívak, mert $A^\top A$ szimmetrikus **pozitív szemidefinit** ($\lambda=\|Ay\|_2^2/\|y\|_2^2\ge 0$). A $\|A\|_2$ tehát a legnagyobb **szinguláris érték.**

### Vizsgára fontos
- Az indukált norma a **maximális nyújtási arány**, és egyben a **legkisebb** illeszkedő felső korlát konstansa.
- $\|A\|_1$ = max oszlopösszeg, $\|A\|_\infty$ = max sorösszeg, $\|A\|_2=\sqrt{\max\lambda_i(A^\top A)}$.
- A természetes normák illeszkednek az őket indukáló vektornormához — emiatt használhatók a perturbációs becslésekben.

---

## 3. Spektrálsugár és a normák további tulajdonságai

### CORE

**Spektrálsugár:** $\varrho(A):=\max_i|\lambda_i(A)|$ (a sajátértékek abszolútértékének maximuma).

- A spektrálnorma így is felírható: $\|A\|_2=\sqrt{\varrho(A^\top A)}$.
- **Ha $A$ szimmetrikus (önadjungált): $\|A\|_2=\varrho(A)$.** (Mert ekkor $\lambda_i(A^\top A)=\lambda_i(A)^2$, így a gyök alól a $\max|\lambda_i(A)|$ jön ki.)
- Általánosabban: **ha $A$ normális** ($A^*A=AA^*$), akkor is **$\|A\|_2=\varrho(A)$.** (Az önadjungált mátrix speciális normális mátrix.)

**A Frobenius-norma NEM természetes (nem indukált) norma.** Bizonyítás egy mondatban: *minden* indukált normára $\|I\|=\sup_x\frac{\|Ix\|}{\|x\|}=1$, viszont $\|I\|_F=\sqrt n$. Tehát $n>1$ esetén egyetlen vektornorma sem indukálhatja. **Ez nagyon kedvelt csapda:** a Frobenius valódi mátrixnorma, de **nem** természetes.

**Spektrálsugár $\le$ bármely norma:** $\varrho(A)\le\|A\|$ minden mátrixnormára. Vagyis $\varrho(A)$ **alsó korlát** minden normára. Fontos: **$\varrho$ maga nem norma** (pl. egy nem nulla nilpotens mátrixra $\varrho=0$, de a mátrix nem nulla — sérül a definitség).

**Ortogonális (unitér) invariancia** ($Q$ ortogonális esetén):
- $\|Qx\|_2=\|x\|_2$ (megőrzi az euklideszi hosszt),
- $\|Q\|_2=1$,
- $\|QA\|_2=\|AQ\|_2=\|A\|_2$ **és** $\|QA\|_F=\|AQ\|_F=\|A\|_F$.

Hasznos azonosságok: $\|A\|_F^2=\mathrm{tr}(A^\top A)=\sum_i\lambda_i(A^\top A)$ (a szinguláris értékek négyzetösszege), továbbá $\|\cdot\|_F$ és $\|\cdot\|_2$ **ekvivalens** normák, és a Frobenius **illeszkedik a 2-es vektornormához.**

### NUANCE
- **Mindkettő** (spektrál és Frobenius) ortogonálisan invariáns, és **mindkettő** illeszkedik a 2-es vektornormához — **de csak a spektrálnormát indukálja a 2-norma.** A Frobenius nem indukált. (Tipikus „melyik igaz?" csapda.)
- Mivel $\|A\|_2=\sqrt{\max\lambda_i(A^\top A)}$ és $\|A\|_F=\sqrt{\sum\lambda_i(A^\top A)}$, mindig **$\|A\|_2\le\|A\|_F$.**
- $\|A\|_2=\varrho(A)$ csak normális (pl. szimmetrikus) mátrixra igaz — **általános** mátrixra **nem** (csak a $\varrho(A)\le\|A\|_2$ egyenlőtlenség áll).

### Vizsgára fontos
- $\varrho(A)\le\|A\|$ minden normára; de $\varrho$ nem norma, és $\|A\|_2=\varrho(A)$ **csak** normális/szimmetrikus mátrixra.
- A Frobenius valódi mátrixnorma, de **nem indukált**, mert $\|I\|_F=\sqrt n\ne 1$.
- A 2-es és a Frobenius-norma ortogonálisan invariáns — ezért alkalmasak ortogonális (QR) módszerek elemzésére.

---

## 4. A mátrixok kondíciószáma

### CORE

Invertálható $A$ és egy $\|\cdot\|$ mátrixnorma esetén:
$$\text{cond}(A):=\|A\|\cdot\|A^{-1}\|\qquad(\text{jelölés néha }\kappa(A)).$$
Megjegyzések: **csak invertálható mátrixra** értelmes, és **az értéke függ a norma választásától** ($\text{cond}_1, \text{cond}_2,\dots$).

**Jelentése:** a kondíciószám azt méri, mennyire **erősíti fel** a feladat a bemeneti relatív hibákat. Kicsi (1 közeli) érték = **jól kondicionált**; nagy érték = **rosszul kondicionált** (érzékeny) feladat.

**Tulajdonságok — 1. rész:**

- **(a)** Indukált normára $\text{cond}(A)\ge 1$. *(Biz.: $1=\|I\|=\|AA^{-1}\|\le\|A\|\|A^{-1}\|$; itt használjuk, hogy indukált normára $\|I\|=1$, és a szubmultiplikativitást.)*
- **(b)** $\text{cond}(cA)=\text{cond}(A)$ minden $c\ne 0$-ra (skálázásfüggetlen).
- **(c)** Ha $Q$ ortogonális, akkor $\text{cond}_2(Q)=1$ (a lehető legjobb kondicionáltság).

**Tulajdonságok — 2. rész:**

- **(d)** $A$ szimmetrikus: $\text{cond}_2(A)=\dfrac{\max|\lambda_i(A)|}{\min|\lambda_i(A)|}$.
- **(e)** $A$ szimmetrikus **pozitív definit**: $\text{cond}_2(A)=\dfrac{\max\lambda_i(A)}{\min\lambda_i(A)}$ (nem kell abszolútérték, mert a sajátértékek pozitívak).
- **(f)** $A$ tetszőleges invertálható: $\text{cond}(A)\ge\dfrac{\max|\lambda_i(A)|}{\min|\lambda_i(A)|}$ — a sajátérték-arány **alsó korlátja** a kondíciószámnak bármely normában.

### NUANCE
- A **(d)/(e) képlet (sajátérték-arány = kondíciószám) csak szimmetrikus (ill. pozitív definit) mátrixra** ad **egyenlőséget** a 2-normában. Általános mátrixra ugyanez csak **alsó becslés** (f), és a *szinguláris értékek* arányát kell venni, nem a sajátértékekét.
- $\text{cond}(A)\ge 1$ az **indukált** normára garantált (a $\|I\|=1$ kell hozzá). Ez a Frobeniusra emiatt nem feltétlen az „1 az alsó határ" formában igaz.
- Az **ortogonális mátrix tökéletesen kondicionált** ($\text{cond}_2=1$) — ez fogja megalapozni a QR-módszerek stabilitását.

### Vizsgára fontos
- $\text{cond}(A)=\|A\|\|A^{-1}\|\ge 1$ (indukált norma), skálázásfüggetlen, normától függ.
- Szimmetrikus mátrixra a 2-es kondíciószám = (max abszolút sajátérték)/(min abszolút sajátérték).
- A kondíciószám a **FELADAT** érzékenységét méri, **nem** az algoritmusét.

---

## 5. A LER érzékenysége — a jobb oldal (b) perturbációjára

### CORE

Kiindulás: $Ax=b$. Perturbáljuk a jobb oldalt: $A(x+\Delta x)=b+\Delta b$. Kérdés: a relatív bemeneti hiba $\delta b=\dfrac{\|\Delta b\|}{\|b\|}$ mekkora relatív megoldáshibát $\delta x=\dfrac{\|\Delta x\|}{\|x\|}$ okoz?

**Tétel (jobb oldal érzékenysége).** Ha $A$ invertálható, $b\ne 0$, **illeszkedő** normákban:
$$\frac{1}{\text{cond}(A)}\cdot\delta b\;\le\;\delta x\;\le\;\text{cond}(A)\cdot\delta b.$$

**Olvasata:** a relatív megoldáshiba a kondíciószámmal **felfelé** korlátozott (legrosszabb eset $\text{cond}(A)\cdot\delta b$), de $1/\text{cond}(A)$-val **lefelé** is — vagyis a hiba nem is „tűnhet el". Nagy $\text{cond}(A)$ esetén egy parányi $\delta b$ is hatalmas $\delta x$-szé robbanhat fel.

**Bizonyítás gondolatmenete (a „négyféle alak"):** $A(x+\Delta x)=b+\Delta b$-ből kivonva $Ax=b$-t $\Rightarrow A\Delta x=\Delta b$. Innen a négy reláció: $b=Ax,\ x=A^{-1}b,\ \Delta b=A\Delta x,\ \Delta x=A^{-1}\Delta b$. Mindegyiknél vesszük a normát (itt kell az **illeszkedés**), és összerakjuk az alsó/felső becslést.

### NUANCE
- A becsléshez **elég az illeszkedő norma** — itt **nem** kell indukált norma (szemben a következő, mátrix-perturbációs tétellel!).
- A becslés **kétoldali** — a vizsgán szeretik elhallgatni az alsó korlátot, és csak a felsőt megadni.

### Vizsgára fontos
- A jobb oldal perturbációjára: $\frac{1}{\text{cond}(A)}\delta b\le\delta x\le\text{cond}(A)\,\delta b$ (illeszkedő normában).
- A felerősítés mértékét a **kondíciószám** szabja meg; nagy cond → érzékeny LER.

---

## 6. A LER érzékenysége — a mátrix (A) perturbációjára

### CORE

Most a bal oldalt perturbáljuk: $(A+\Delta A)(x+\Delta x)=b$.

**Tétel (mátrix érzékenysége).** Ha $A$ invertálható, $b\ne 0$ **és** $\|\Delta A\|\cdot\|A^{-1}\|<1$, akkor **indukált** mátrixnormában:
$$\frac{\|\Delta x\|}{\|x\|}\;\le\;\frac{\text{cond}(A)}{\,1-\text{cond}(A)\cdot\frac{\|\Delta A\|}{\|A\|}\,}\cdot\frac{\|\Delta A\|}{\|A\|}.$$

Kis $\Delta A$ esetén a nevező $\approx 1$, tehát vezető rendben **újra $\text{cond}(A)\cdot\delta A$** a felerősítés — ugyanaz a szereplő, mint a jobb oldalnál. A különbség a korrekciós nevező, amely a perturbáció növelésével **felrobban.**

**A kulcsszerszám — Neumann-féle lemma.** Ha $\|M\|<1$ (**indukált** normában), akkor $(I+M)$ invertálható, és
$$\|(I+M)^{-1}\|\le\frac{1}{1-\|M\|}.$$
*(Biz. vázlat: $\varrho(M)\le\|M\|<1$ → $I+M$ sajátértékei $1+\lambda_i(M)\ne 0$ → invertálható; majd $(I+M)^{-1}=I-M(I+M)^{-1}$-ből normát véve adódik a becslés.)* **A megjegyzés kiemeli: a lemmához kell az indukált mátrixnorma.**

A tétel bizonyítása ezt a lemmát alkalmazza az $(I+A^{-1}\Delta A)$ mátrixra: a feltétel $\|A^{-1}\Delta A\|\le\|A^{-1}\|\|\Delta A\|<1$ épp azt garantálja, hogy ez invertálható.

### NUANCE — ezek a tipikus „melyik feltétel kell?" csapdák
- **Két extra feltétel kell** (a jobb oldali tételhez képest): (1) **$\|\Delta A\|\cdot\|A^{-1}\|<1$** — a perturbáció legyen elég kicsi, hogy $A+\Delta A$ invertálható maradjon; (2) **indukált** mátrixnorma (a Neumann-lemma miatt), nem elég pusztán az illeszkedés.
- A felső korlát **nem szimmetrikus** a jobb oldali esettel: itt a nevezőben megjelenik a perturbáció — a becslés **csak kis perturbációra** értelmes, és érzéketlen, ha $\text{cond}(A)\cdot\delta A\to 1$.

### Vizsgára fontos
- Mátrix-perturbáció: a becslés **indukált** normát **és** a $\|\Delta A\|\|A^{-1}\|<1$ feltételt igényli.
- A Neumann-lemma ($\|M\|<1\Rightarrow \|(I+M)^{-1}\|\le\frac{1}{1-\|M\|}$) a bizonyítás motorja, és **indukált** normát kíván.
- Vezető rendben a felerősítés itt is $\approx\text{cond}(A)\cdot\delta A$.

---

## 7. Egyesített tétel és a felbontások hatása

### CORE

**Egyesített tétel** (mind $A$, mind $b$ perturbálódik), $(A+\Delta A)(x+\Delta x)=b+\Delta b$:
$$\frac{\|\Delta x\|}{\|x\|}\le\frac{\text{cond}(A)}{\,1-\text{cond}(A)\frac{\|\Delta A\|}{\|A\|}\,}\left(\frac{\|\Delta A\|}{\|A\|}+\frac{\|\Delta b\|}{\|b\|}\right).$$
Vagyis a két relatív hiba **összeadódik**, és ugyanaz a cond-alapú tényező erősíti.

**A felbontások hatása a kondicionáltságra** — ez a fejezet legfontosabb összehasonlítása:

| Felbontás | Hatás a kondíciószámra | Következmény |
|---|---|---|
| **LU (Gauss)** | $\text{cond}(A)\le\text{cond}(L)\cdot\text{cond}(U)$, **de** $\text{cond}(L),\text{cond}(U)$ **lehet $\gg\text{cond}(A)$** | A felbontás **nem javít**, sőt egyes mátrixokra **ronthat** → a Gauss-elimináció nagyon pontatlan is lehet (ez motiválja a pivotálást) |
| **QR** | $\text{cond}_2$ **nem változik** ($Q$ ortogonális, $\text{cond}_2(Q)=1$, így $\text{cond}_2(A)=\text{cond}_2(R)$) | **Stabil** |
| **Cholesky** | $\text{cond}_2$ **nem változik** | **Stabil** |

*(LU-levezetés: $A=LU\Rightarrow\|A\|\le\|L\|\|U\|$ és $A^{-1}=U^{-1}L^{-1}\Rightarrow\|A^{-1}\|\le\|L^{-1}\|\|U^{-1}\|$, ezeket összeszorozva $\text{cond}(A)\le\text{cond}(L)\text{cond}(U)$. A QR esetén az ortogonális invariancia miatt nincs felrobbanás.)*

### NUANCE
- **A vizsga kedvenc szembeállítása:** az **LU rosszabbá teheti** a kondicionáltságot ($\text{cond}(L)\text{cond}(U)\gg\text{cond}(A)$), míg a **QR és Cholesky megőrzi** ($\text{cond}_2$ változatlan). Ne keverd: a felbontás **soha nem javít**, az LU **ronthat**, a QR/Cholesky **megtart**.
- A $\text{cond}(A)\le\text{cond}(L)\text{cond}(U)$ csak **egyenlőtlenség** — nem azt mondja, hogy egyenlő, és nem azt, hogy javul.

### Vizsgára fontos
- Egyesített tétel: a mátrix- és jobboldal-hiba **összeadódik**, közös cond-tényezővel.
- **LU nem javít, ronthat** (→ pivotálás indoka); **QR/Cholesky megőrzi** a 2-es kondíciószámot (→ stabilitásuk forrása).

---

## 8. Relatív maradék (reziduum) — az ALGORITMUS jellemzése

### CORE

Itt fordul a perspektíva: a kondíciószám a **feladat** érzékenységét méri, **nem a megoldó algoritmusét.** Az algoritmust a **maradékvektorral** jellemezzük.

**Reziduum- / maradékvektor.** Ha $\tilde x$ az $Ax=b$ egy közelítő megoldása:
$$r:=b-A\tilde x.$$
Könnyen számolható, direkt és iterációs módszereknél is használható; iterációnál **leállási feltétel** építhető rá.

**Relatív maradék:** $\displaystyle\eta:=\frac{\|r\|}{\|A\|\cdot\|\tilde x\|}$.

A relatív maradék **visszafelé-hiba (backward error)** értelmezése: a módszer **stabil**, ha a $\tilde x$-hez tartozó $(A+\Delta A)\tilde x=b$ rendszer csak kicsit perturbált, azaz $\frac{\|\Delta A\|}{\|A\|}$ kicsi. A $\Delta A$-t nem ismerjük — célunk **$\Delta A$ ismerete nélkül** becsülni a $\frac{\|\Delta A\|}{\|A\|}$ mennyiséget a könnyen számolható $\eta$-val.

**Tétel (becslés illeszkedő normában):** $A$ invertálható esetén $\displaystyle\eta\le\frac{\|\Delta A\|}{\|A\|}$. Azaz **ha $\eta$ nagy, akkor $\frac{\|\Delta A\|}{\|A\|}$ is nagy** (a módszer nem volt stabil). *(Biz.: $r=b-A\tilde x=\Delta A\,\tilde x$, innen $\|r\|\le\|\Delta A\|\|\tilde x\|$.)*

**Tétel (2-es normában EGYENLŐSÉG):** $\displaystyle\eta_2=\frac{\|\Delta A\|_2}{\|A\|_2}$. *(Biz.: a $\Delta A=\frac{r\tilde x^\top}{\tilde x^\top\tilde x}$ perturbáció pontosan visszaadja $\tilde x$-et mint a perturbált rendszer megoldását, és $\|r\tilde x^\top\|_2=\|r\|_2\|\tilde x\|_2$.)*

### NUANCE — ezt nagyon szeretik kérdezni
- **Általános illeszkedő normában csak EGYENLŐTLENSÉG** ($\eta\le\frac{\|\Delta A\|}{\|A\|}$), **de a 2-normában EGYENLŐSÉG** ($\eta_2=\frac{\|\Delta A\|_2}{\|A\|_2}$). A 2-norma adja a *pontos* visszafelé-hibát.
- **Kis maradék $\ne$ kis hiba.** A maradék a **visszafelé-hibát** méri, nem az **előrehibát** ($\|x-\tilde x\|$). Rosszul kondicionált feladatnál a maradék lehet picike, miközben a megoldás messze jár az igazitól — itt jön be a `előrehiba ≲ cond × visszafelé-hiba` ökölszabály.
- Ha $\eta_2<\varepsilon_1$ (kb. a gépi epszilon szintje), akkor az **adott aritmetikában pontosabb megoldás nem adható** — elérted a számábrázolás határát.

### Vizsgára fontos
- $r=b-A\tilde x$; a relatív maradék $\eta=\frac{\|r\|}{\|A\|\|\tilde x\|}$ a **visszafelé-hibát** méri (az algoritmus stabilitása), nem a feladat érzékenységét.
- $\eta\le\frac{\|\Delta A\|}{\|A\|}$ illeszkedő normában; **a 2-normában egyenlőség.**
- Kicsi maradék mellett is lehet pontatlan a megoldás, ha $\text{cond}(A)$ nagy.

---

## 9. Matlab-példák — a kondíciószám növekedése (COMPRESS)

A számszerű ábrák lényege egyetlen tanulság: **a kondicionáltság erősen függ a mátrix szerkezetétől.** Amit érdemes megjegyezni:

| Mátrixcsalád | $\text{cond}_2$ növekedése a mérettel | Jelleg |
|---|---|---|
| **Hilbert** $H_n$ | $\approx e^{3.1n}\approx 22^n$ | exponenciális — **híresen rosszul kondicionált** |
| **Vandermonde** $V_n$ | $\approx e^{1.85n}\approx 6.4^n$ | exponenciális — fontos az **interpolációnál** |
| **tridiag$(-1,2,-1)$** | $\approx\big(\tfrac{2(n+1)}{\pi}\big)^2\sim n^2$ | polinomiális (enyhe) — diszkrét Laplace |
| **véletlen (randn)** | jellemzően kicsi | tipikusan jól viselkedik |

**Miért érdekes ez a kurzus többi témájához?** A **Vandermonde**-mátrix az interpoláció együtthatómátrixa — exponenciális kondíciószáma magyarázza, miért rossz ötlet nagy fokú polinominterpoláció a standard bázisban. A **Hilbert**-mátrix a legkisebb négyzetek normálegyenleteinél bukkan fel — szintén intő példa.

### Vizsgára fontos
- A Hilbert- és Vandermonde-mátrixok a **rosszul kondicionált** mátrixok iskolapéldái (exponenciális növekedés); a tridiagonális Laplace enyhe ($\sim n^2$).
- A kondicionáltság **a mátrix szerkezetétől függ**, nem pusztán a mérettől.

---

## Önellenőrző kérdések (nehéz, A/B/C/D — a vizsga stílusában)

**1.** Melyik állítás **HAMIS**?
- A) Minden indukált mátrixnorma egyben mátrixnorma.
- B) A Frobenius-norma mátrixnorma, de nem indukált (természetes) norma.
- C) Minden indukált normára $\|I\|=1$.
- D) A Frobenius-norma a 2-es vektornorma által indukált mátrixnorma.

**Helyes: D.** A Frobenius illeszkedik a 2-es vektornormához, de nem indukálja az: $\|I\|_F=\sqrt n\ne 1$, miközben minden indukált normára $\|I\|=1$.

---

**2.** $A\in\mathbb{R}^{n\times n}$ tetszőleges (nem feltétlen szimmetrikus). Melyik **mindig** igaz?
- A) $\|A\|_2=\varrho(A)$.
- B) $\varrho(A)\le\|A\|$ bármely mátrixnormában.
- C) $\varrho(A)$ maga is mátrixnorma.
- D) $\|A\|_1$ a maximális sorösszeg.

**Helyes: B.** A spektrálsugár minden norma alsó korlátja. A) csak normális/szimmetrikus mátrixra; C) hamis (nilpotens mátrixra $\varrho=0\ne$ nulla mátrix); D) a max **oszlop**összeg az 1-norma.

---

**3.** A mátrix-perturbációs tétel ($\,(A+\Delta A)(x+\Delta x)=b\,$) érvényességéhez melyik feltétel(ek) kell(enek), ami a *jobb oldali* perturbációs tételhez **nem**?
- A) Csak az, hogy $A$ invertálható.
- B) $\|\Delta A\|\cdot\|A^{-1}\|<1$ **és** indukált mátrixnorma.
- C) Csak $b\ne 0$.
- D) Hogy $A$ szimmetrikus legyen.

**Helyes: B.** A Neumann-lemmához indukált norma kell, és $\|\Delta A\|\|A^{-1}\|<1$ biztosítja $A+\Delta A$ invertálhatóságát. A jobb oldali tételhez elég volt az illeszkedés.

---

**4.** A relatív maradékról ($\eta$) melyik állítás **pontos**?
- A) Tetszőleges illeszkedő normában $\eta=\frac{\|\Delta A\|}{\|A\|}$.
- B) A 2-normában $\eta_2\le\frac{\|\Delta A\|_2}{\|A\|_2}$, de általában nem egyenlőség.
- C) Illeszkedő normában $\eta\le\frac{\|\Delta A\|}{\|A\|}$, és a 2-normában egyenlőség áll.
- D) Kicsi $\eta$ garantálja a megoldás kicsi $\|x-\tilde x\|$ előrehibáját.

**Helyes: C.** Általában csak egyenlőtlenség, a 2-normában viszont egyenlőség. D azért hamis, mert a maradék a visszafelé-hibát méri: rosszul kondicionált feladatnál kicsi $\eta$ mellett is nagy lehet az előrehiba.

---

**5.** Melyik állítás igaz a **felbontások** kondicionáltságra gyakorolt hatásáról?
- A) Az LU-felbontás mindig javítja a kondicionáltságot.
- B) A QR-felbontás megőrzi $\text{cond}_2$-t, az LU viszont akár ronthatja is.
- C) A Cholesky-felbontás növeli $\text{cond}_2$-t.
- D) Mindhárom felbontás ugyanúgy hat a kondíciószámra.

**Helyes: B.** $\text{cond}_2$ ortogonálisan invariáns, így QR (és Cholesky) megőrzi; az LU-nál $\text{cond}(L),\text{cond}(U)$ lehet $\gg\text{cond}(A)$, ezért az eredmény nagyon pontatlan is lehet.

---

## Min menjünk mélyebbre?

Mondd meg, melyik irányba ássunk be jobban — pár tipp, amit érdemes lehet:

1. **A három nevezetes norma ($1,2,\infty$) bizonyítási „dallama"** — hogyan jön ki, hogy a sup épp a max oszlop-/sorösszeg, illetve a $\sqrt{\max\lambda(A^\top A)}$.
2. **A Neumann-lemma és a mátrix-perturbációs tétel** részletes levezetése, és hogy pontosan hol kell az indukált norma.
3. **Feladat vs. algoritmus** szétválasztása mélyebben: kondíciószám, előrehiba, visszafelé-hiba, és az `előrehiba ≲ cond × visszafelé-hiba` reláció — sok finom A/B/C/D épül erre.
4. **Felbontások (LU vs. QR vs. Cholesky)** stabilitása, miért motiválja az LU pontatlansága a részleges főelemkiválasztást (pivotálás).
5. Több **„melyik igaz / melyik hamis"** típusú gyakorlókérdés bármelyik fejezetre, kifejezetten a csapdákra hegyezve.
