# Numerikus módszerek C — 4. előadás
## Az LU-felbontás, megmaradási tételek, progonka, vektornormák

> **Mit fed le ez a PDF (gyors térkép):**
> Ez a 4. előadás. Tartalma: az **LU-felbontás közvetlen kiszámítása** (létezési feltétel, képletek, „jó sorrend"), a **műveletigény**, a **megmaradási tételek + Schur-komplementer** (mely tulajdonságok öröklődnek a GE/Schur-lépés során), a **rövidített GE = progonka** (tridiagonális rendszerek), végül a **vektornormák**.
> A tananyag-listából ez a **2. téma** (LER direkt módszerei: Gauss-elimináció, LU) lényegi része, plusz a **3. téma** (mátrixnormák, érzékenység) **alapozása**: itt még csak *vektor*normák szerepelnek. **Figyelem:** a *mátrixnorma*, a *kondíciószám* és az *érzékenység* maga **NINCS** ebben a diasorban — az a következő előadás. Ne keverd össze: itt a vektornorma az utolsó téma, és az önmagában még nem a kondicionáltság.

---

# 1. Az LU-felbontás közvetlen kiszámítása

## 1.1 CORE — mi ez és miért jó?

**Definíció.** Az $A$ mátrix **LU-felbontása** az $A = LU$ szorzat, ahol
$L \in \mathcal{L}_1$ (**alsó egység-háromszögmátrix**: a főátlóban csupa 1) és $U \in \mathcal{U}$ (**felső háromszögmátrix**).

Ez az ún. **Doolittle-féle** normálás. **Kritikus, gyakran tesztelt pont:** az **1-esek az $L$ főátlójában** vannak, az „érdemi" átló pedig az $U$-ban. (Ha valaki ezt megcseréli, az a Crout-felbontás — nem ez a kurzus konvenciója.)

**Miért érdemes felbontani?** A cél az $Ax = b$ megoldása. Ha megvan $A = LU$, akkor
$$
Ax = L\underbrace{Ux}_{y} = b
$$
helyett **két háromszög-rendszert** oldunk meg egymás után:

1. $Ly = b$ — alsó háromszögű → **előrehelyettesítés**,
2. $Ux = y$ — felső háromszögű → **visszahelyettesítés**.

Az intuíció: a háromszög-rendszerek „ingyen" megoldhatók (egymás után behelyettesítve), a nehéz munka maga a **felbontás**. A fizetség itt jön be: a felbontás $\frac{2}{3}n^3 + O(n^2)$, de **egyszer kell**; utána minden új $b$-re már csak $2n^2$ a megoldás. **Ezért előnyös, ha sokszor ugyanaz az $A$, csak a jobb oldal változik.**

## 1.2 CORE — hogyan számoljuk ki közvetlenül?

Nem ismerjük $L$-t és $U$-t, de a **szorzatukat igen** ($LU = A$). Felírva az $A$ egyes elemeit a mátrixszorzás szabálya szerint, egyenleteket kapunk $l_{ij}$-re és $u_{ij}$-re. Ha **jó sorrendben** írjuk fel őket, minden lépésnél pontosan **egy** új ismeretlen jön ki.

A levezetésből adódó **képletek** (a Tétel a diában):
$$
i \le j:\quad u_{ij} = a_{ij} - \sum_{k=1}^{i-1} l_{ik}u_{kj} \qquad(\text{$U$ eleme})
$$
$$
i > j:\quad l_{ij} = \frac{1}{u_{jj}}\left(a_{ij} - \sum_{k=1}^{j-1} l_{ik}u_{kj}\right)\qquad(\text{$L$ eleme})
$$

Mire figyelj az értelmezésnél:

- $U$ **1. sora azonos $A$ 1. sorával** (a GE az 1. sort nem bántja). $L$ **1. oszlopát** úgy kapjuk, hogy $A$ 1. oszlopát leosztjuk $a_{11}$-gyel.
- A **„jó sorrend"** (sorfolytonosan / oszlopfolytonosan / parkettaszerűen) csak az indexbejárás rendje — biztosítja, hogy minden képlet jobb oldala már ismert. **Nem befolyásolja az eredményt**, csak azt, hogy egylépésenként ki tudjuk-e fejezni az új ismeretlent.
- Az $l_{ij}$ képletében **osztunk $u_{jj}$-vel** → kell, hogy $u_{jj} \neq 0$. Ez ugyanaz a feltétel, mint a GE-nál a pivot ≠ 0.

## 1.3 NUANCE (csapdaanyag) — mikor LÉTEZIK az LU-felbontás?

Ez a tipikus „igaz, kivéve…" kérdés. **Az LU-felbontás (sorcsere nélkül) nem mindig létezik.**

A diában a **(b) példa** pont ezt mutatja: a $B$ mátrixra a vezető $2\times2$-es aldetermináns $D_2 = \det(B_2) = 0$, emiatt $u_{22} = 0$ adódik, és a következő egyenlet **ellentmondásos** lesz → az LU-felbontás **nem készíthető el**. GE-vel ugyanitt $a^{(1)}_{22} = 0$ pivot jönne ki, ezért **sort kellene cserélni**.

**A pontos létezési feltétel (tankönyvi kiegészítés, a dia nem mondja ki explicit tételként):**
> Az $A \in \mathbb{R}^{n\times n}$ mátrixnak akkor (és pontosan akkor) létezik **egyértelmű** $L\in\mathcal{L}_1$, $U\in\mathcal{U}$ felbontása **sorcsere nélkül**, ha **minden vezető főminor** $D_1, D_2, \dots, D_{n-1} \neq 0$.

Hasznos azonosság (szintén kiegészítés): $u_{kk} = \dfrac{D_k}{D_{k-1}}$, így $u_{kk} \neq 0 \iff D_k \neq 0$. Ezért bukik el a (b) példa $D_2 = 0$ miatt.

**A legklasszikusabb csapda:** $\det(A) \neq 0$ (az $A$ reguláris) **NEM elég** az LU létezéséhez sorcsere nélkül! A regularitás csak a *teljes* determinánsról szól, a felbontáshoz a *vezető* minoroknak kell nem-nulláknak lenniük. Ha valamelyik vezető minor 0, **pivotálni** (sort cserélni) kell → ekkor $PA = LU$ adódik (permutációs mátrixszal). A sima $A=LU$ nem áll elő.

> **Vizsgára fontos (1. téma):**
> 1. $A = LU$, ahol **$L$ egység-alsó** (1-esek az átlóban), **$U$ felső** háromszög. Az 1-esek az $L$-ben vannak.
> 2. Haszna: a nehéz munka (felbontás, $\frac{2}{3}n^3$) **egyszer** kell; utána minden új $b$ csak két háromszög-megoldás ($2n^2$).
> 3. **Létezés ≠ regularitás.** Sorcsere nélküli LU akkor van, ha a **vezető főminorok** ($D_1,\dots,D_{n-1}$) nem nullák. $\det A \neq 0$ önmagában nem elég.
> 4. A számolásnál $u_{jj} \neq 0$ kell (osztás) — ez a pivot-feltétel.

---

# 2. Műveletigény

## 2.1 CORE — a számok és a jelentésük

| Feladat | Műveletigény | Megjegyzés |
|---|---|---|
| **LU-felbontás** előállítása | $\frac{2}{3}n^3 + O(n^2)$ | Domináns lépés. **Ugyanannyi, mint a GE** — mert lényegében *az* a GE. |
| $Ly = b$ (alsó háromszög) | $n^2 + O(n)$ | előrehelyettesítés |
| $Ux = y$ (felső háromszög) | $n^2 + O(n)$ | visszahelyettesítés |
| Egy mátrix–vektor szorzás | $2n^2 + O(n)$ | összehasonlításul |

A bizonyítás magja: a $u_{ij}$-hez $2(i-1)$, az $l_{ij}$-hez $2j-1$ művelet kell; ezeket összegezve $\frac{2}{3}n^3 + O(n^2)$. A háromszög-megoldásnál soronként $2(i-1)$ művelet → $n^2 + O(n)$.

## 2.2 NUANCE — mi a tanulság, ami csapda lehet?

- **Egyszeri** $Ax=b$ megoldás LU-val: $\frac{2}{3}n^3 + 2n^2 \approx$ ugyanannyi, mint a sima GE. Tehát **egyetlen** rendszerre az LU önmagában **nem gyorsabb**, mint a GE. Csapda: „az LU mindig gyorsabb, mint a GE" → **hamis**.
- A nyereség **több jobb oldalnál** ($Ax = b_1, b_2, \dots$) jelentkezik: a $\frac{2}{3}n^3$-t **egyszer** fizetjük ki, minden további $b$ csak $2n^2$. Ezért éri meg, ha „sokszor ugyanaz az $A$".
- **Soha ne számolj $A^{-1}$-et** a megoldáshoz: az inverz + szorzás drágább és pontatlanabb, mint a háromszög-megoldás. (Tankönyvi kiegészítés, de tipikus elvi kérdés.)

> **Vizsgára fontos (2. téma):**
> 1. LU $= \frac{2}{3}n^3$, háromszög-megoldás $= n^2$ (mindkettő). A **felbontás dominál** ($n^3$ vs. $n^2$).
> 2. LU vs. GE műveletigénye **azonos** egyetlen rendszerre; az LU előnye **több jobb oldalnál** mutatkozik meg.

---

# 3. Megmaradási tételek és a Schur-komplementer

Ez a rész elvileg „száraz", de **vizsgán szeret felbukkanni**, mert ezek a tételek magyarázzák, **mely mátrixokon működik a GE/LU sorcsere nélkül**.

## 3.1 CORE — a szereplő mátrixtulajdonságok

**Szimmetrikus:** $A = A^\top$.

**Pozitív definit** ($A$ **szimmetrikus**, és teljesül az alábbiak **bármelyike** — mind ekvivalens):
1. $\langle Ax, x\rangle = x^\top A x > 0$ minden $0 \neq x \in \mathbb{R}^n$ esetén;
2. **minden vezető főminor** pozitív: $D_k = \det(A_k) > 0$ (**Sylvester-kritérium**);
3. **minden sajátérték pozitív**.

**Szigorúan diagonálisan domináns (szig. diag. dom.):**
- *soraira*: $|a_{ii}| > \sum_{j \neq i} |a_{ij}|$ minden $i$-re;
- *oszlopaira*: $|a_{ii}| > \sum_{j \neq i} |a_{ji}|$ minden $i$-re.

**Fél sávszélesség $s$:** $|i-j| > s \Rightarrow a_{ij} = 0$ (a sávon kívül csupa 0), és van olyan elem, ahol $|k-l| = s$ és $a_{kl} \neq 0$ (azaz $s$ a *legszűkebb* ilyen szám). Tridiagonális mátrix: $s = 1$.

**Profil:** soronként/oszloponként az **első nem-nulla elemig** lévő nullák száma. (Finomabb, „sávszerű" leíró, ami nem feltétlen szimmetrikus.)

## 3.2 CORE — Schur-komplementer

Particionáljuk az $Ax=b$-t a $k$. sor után, $A_{11}\in\mathbb{R}^{k\times k}$ invertálható:
$$
\begin{bmatrix} A_{11} & A_{12}\\ A_{21} & A_{22}\end{bmatrix}
\begin{bmatrix} x_1\\ x_2\end{bmatrix} =
\begin{bmatrix} b_1\\ b_2\end{bmatrix}.
$$
Egy **blokkos GE-lépés** (a 2. blokksor mínusz $A_{21}A_{11}^{-1}\cdot$ az 1. blokksor) után:
$$
(\underbrace{A_{22} - A_{21}A_{11}^{-1}A_{12}}_{=:\,[A\,|\,A_{11}]})\,x_2 = b_2 - A_{21}A_{11}^{-1}b_1.
$$

**Definíció.** Az $[A\,|\,A_{11}] := A_{22} - A_{21}A_{11}^{-1}A_{12}$ az $A$ **Schur-komplementere** $A_{11}$-re nézve, mérete $(n-k)\times(n-k)$.

**Mit jelent intuitívan?** A Schur-komplementer **az a mátrix, amin az eliminációt folytatni kell**, miután az első $k$ változót kiküszöböltük. $k=1$ esetén (és $a_{11}\neq 0$) ez épp az **egyetlen GE-lépés** maradék mátrixa. A Schur-komplementer tehát „a GE egy lépésének" tömör algebrai megfogalmazása.

## 3.3 CORE — Megmaradási tételek

> **Tétel.** A GE során (egy lépés ↔ áttérés a Schur-komplementerre) a következő tulajdonságok **öröklődnek** $A$-ról $[A\,|\,A_{11}]$-re:
> 1. $\det(A) \neq 0 \Rightarrow \det([A\,|\,A_{11}]) \neq 0$ (regularitás);
> 2. $A$ szimmetrikus $\Rightarrow [A\,|\,A_{11}]$ szimmetrikus;
> 3. $A$ pozitív definit $\Rightarrow [A\,|\,A_{11}]$ pozitív definit;
> 4. $A$ szig. diag. dom. $\Rightarrow [A\,|\,A_{11}]$ szig. diag. dom.;
> 5. $[A\,|\,A_{11}]$ fél sávszélessége **$\le$** $A$ fél sávszélessége;
> 6. a **profil** nullái (soronként/oszloponként az első nem-nulla elemig) megmaradnak.

A bizonyítások logikája (érdemes érteni, nem magolni):
- **Regularitás:** $\det(A^{(1)}) = \det(A_{11})\cdot\det([A\,|\,A_{11}])$, és $\det(A_{11})\neq 0$, így a Schur-komplementer determinánsa is ≠ 0.
- **Szimmetria:** közvetlen transzponálás, kihasználva $A_{21}^\top = A_{12}$.
- **Pozitív definitség:** tetszőleges $x_2 \neq 0$-hoz választható olyan $x_1 = -A_{11}^{-1}A_{12}x_2$, hogy $\langle [A\,|\,A_{11}]x_2, x_2\rangle = \langle Ax, x\rangle > 0$.
- **Szig. diag. dom.:** a GE képleteit behelyettesítve és becsléssel.

## 3.4 NUANCE — miért érdekel ez minket egyáltalán? (a vizsga lényege)

A diák ezt **kimondatlanul hagyják**, ezért kiegészítem. A megmaradási tételek **következménye**:

- Ha $A$ **szigorúan diagonálisan domináns**, akkor a GE/LU során **a pivotok soha nem nullák**, ezért **sorcsere (pivotálás) nélkül** elvégezhető → a sima $A=LU$ létezik.
- Ha $A$ **szimmetrikus pozitív definit**, ugyanez igaz: GE/LU **pivotálás nélkül** stabilan megy (és itt jön majd a **Cholesky-felbontás** $A=LL^\top$).

A logika: a tulajdonság **lépésenként megmarad**, tehát minden részmátrixban garantált a nem-nulla pivot → nem akadunk el. Ezért **ezeknél a mátrixosztályoknál nem kell pivotálni**.

**Csapdák, amikre figyelj:**
- **Sávszélesség: „$\le$", nem „$=$"** — a GE a sávot megőrzi vagy **szűkíti**, de nem szélesíti. (Ezért nincs „kitöltődés" a sávon kívül — ez a progonka alapja.)
- **Pozitív definit ⇒ szimmetrikus** ezen a kurzuson (a definíció része). „Pozitív definit, de nem szimmetrikus" megfogalmazás itt értelmezetlen/hibás.
- **Sylvester:** **minden** vezető minor > 0 kell. **$\det(A) > 0$ önmagában NEM elég** (pl. két negatív sajátérték szorzata is pozitív determinánst ad). Ez kedvenc csapda.
- **Szig. diag. dom.:** szigorú ($>$), nem $\ge$; és a **sorokra** és **oszlopokra** vonatkozó dominancia **két külön feltétel**.

> **Vizsgára fontos (3. téma):**
> 1. A **Schur-komplementer** = az a részmátrix, amin a GE-t folytatni kell egy (blokk)lépés után: $[A\,|\,A_{11}] = A_{22}-A_{21}A_{11}^{-1}A_{12}$.
> 2. A GE megőrzi: regularitás, szimmetria, pozitív definitség, szig. diag. dominancia, (nem-növekvő) sávszélesség, profil-nullák.
> 3. **A poén:** szig. diag. dom. **vagy** szimm. pozitív definit mátrixnál **nem kell pivotálni** — a pivotok sosem nullák.
> 4. Sylvester: minden vezető minor > 0. $\det A>0$ nem elég a pozitív definitséghez.

---

# 4. Rövidített GE — a progonka (Thomas-) módszer

## 4.1 CORE — mit old meg és miért gyors?

**Probléma:** **tridiagonális** (háromátlós) LER, $A = \mathrm{tridiag}(\beta_{i-1}, \alpha_i, \gamma_i)$ — a gyakorlatban nagyon gyakori (pl. differenciálegyenletek diszkretizációja).

Mivel **a GE megtartja a sávszélességet** (3.3/5. pont!), a tridiagonális szerkezet **végig megmarad**: a három átlón kívül mindig 0 marad, és a $U$ is csak két átlót tartalmaz. Ezt kihasználva sokkal olcsóbb algoritmus készíthető.

| | Általános (teljes) GE/LU | Progonka (tridiagonális) |
|---|---|---|
| **Tárolás** | $n^2$ | $3n-2$ (három átló) |
| **Műveletigény** | $\frac{2}{3}n^3 + O(n^2)$ | $8n + O(1)$ ($=8n-7$) |
| Nagyságrend | $O(n^3)$ | **$O(n)$ — lineáris!** |

Ez a tananyag egyik leglátványosabb **nagyságrendi** különbsége: $O(n^3) \to O(n)$.

## 4.2 CORE — hogyan működik (a rekurzió)

A visszahelyettesítés $i$. egyenletéből $x_i$ kifejezhető $x_i = f_i x_{i+1} + g_i$ alakban.

**1. lépés (előre — $f_i, g_i$ számítása):**
$$
f_1 = -\frac{\gamma_1}{\alpha_1},\qquad g_1 = \frac{b_1}{\alpha_1},
$$
$$
i = 2,\dots,n-1:\quad f_i = -\frac{\gamma_i}{\alpha_i + \beta_{i-1}f_{i-1}},\qquad g_i = \frac{b_i - \beta_{i-1}g_{i-1}}{\alpha_i + \beta_{i-1}f_{i-1}},
$$
$$
g_n = \frac{b_n - \beta_{n-1}g_{n-1}}{\alpha_n + \beta_{n-1}f_{n-1}}.
$$

**2. lépés (vissza — $x_i$ számítása):**
$$
x_n = g_n,\qquad i = n-1, \dots, 1:\quad x_i = f_i x_{i+1} + g_i.
$$

(Megjegyzés a diából: ha $f_n$-t is kiszámoljuk és $x_{n+1}:=0$-val indítunk, az algoritmus egységesebb, csak 3 művelettel több.)

**Műveletigény részletei:** $f_1,g_1$: 2; a ciklus $6(n-2)$; $g_n$: 5; visszafelé $2(n-1)$ → összesen $8n-7 = 8n + O(1)$.

## 4.3 NUANCE — finom pontok

- A progonka **továbbra is direkt (egzakt) módszer** — nem iteratív, nem közelítő. Csak a tridiagonális szerkezetre szabott, hatékony GE.
- A nevezőkben ($\alpha_i + \beta_{i-1}f_{i-1}$) **nem szabad nullának lennie** — ez ugyanaz a „pivot ≠ 0" feltétel, mint a GE-nál. **Garantáltan teljesül**, ha $A$ pl. szigorúan diagonálisan domináns (vissza a 3. témára!).
- A gyorsaság **nem trükk**: a sávszélesség-megmaradási tételből következik, hogy nincs kitöltődés. **Ez köti össze a 3. és a 4. témát.**

> **Vizsgára fontos (4. téma):**
> 1. Progonka = **tridiagonális** rendszerre szabott GE. Tárolás $3n-2$, műveletigény $8n+O(1) = O(n)$ — szemben az $O(n^3)$-nal.
> 2. Azért működik, mert **a GE megőrzi a sávszélességet** (nincs kitöltődés).
> 3. **Direkt módszer**, nem iteratív. A nevezők ≠ 0 feltétel a pivot-feltétel; diag. dominancia garantálja.

---

# 5. Vektornormák

## 5.1 CORE — a norma fogalma és axiómái

A vektornorma a „hossz", „nagyság" **általánosítása**. Egy $\|\cdot\|: \mathbb{R}^n \to \mathbb{R}$ leképezés **vektornorma**, ha minden $x,y\in\mathbb{R}^n$, $\lambda\in\mathbb{R}$ esetén:

1. $\|x\| \ge 0$ (**nemnegativitás**),
2. $\|x\| = 0 \iff x = 0$ (**definitség** — ez erősebb, mint az 1.: csak a nullvektor normája 0),
3. $\|\lambda x\| = |\lambda|\cdot\|x\|$ (**abszolút homogenitás**),
4. $\|x + y\| \le \|x\| + \|y\|$ (**háromszög-egyenlőtlenség**).

## 5.2 CORE — a három nevezetes norma

| Norma | Képlet | Név | Szemléletes |
|---|---|---|---|
| $\lVert x\rVert_1$ | $\sum_{i=1}^n\lvert x_i\rvert$ | **Manhattan** (taxi) | komponensek abszolútértékének összege |
| $\lVert x\rVert_2$ | $\left(\sum_{i=1}^n x_i^2\right)^{1/2}$ | **Euklideszi** | a „hagyományos hossz" |
| $\lVert x\rVert_\infty$ | $\max_{i}\lvert x_i\rvert$ | **Csebisev** (maximum) | a legnagyobb abszolútértékű komponens |

A 2-norma a **skaláris szorzatból** származik: $\|x\|_2 = \sqrt{\langle x,x\rangle}$. Általában: minden skaláris szorzat generál egy normát, $\|x\| = \sqrt{\langle x,x\rangle}$.

Hozzátartozik a **Cauchy–Bunyakovszkij–Schwarz-egyenlőtlenség (CBS):**
$$
|\langle x, y\rangle| \le \|x\|_2 \cdot \|y\|_2.
$$
(Bizonyítás: $0 \le \|x - \alpha y\|_2^2$ kvadratikus $\alpha$-ban, diszkriminánsa nempozitív.)

## 5.3 CORE — p-normák

$$
\|x\|_p := \left(\sum_{i=1}^n |x_i|^p\right)^{1/p},\qquad 1 \le p < \infty.
$$
A háromszög-egyenlőtlenség itt a **Minkowski-egyenlőtlenség**. Speciális esetek: $p=1 \to \|x\|_1$, $p=2 \to \|x\|_2$, és **$\lim_{p\to\infty}\|x\|_p = \|x\|_\infty$**.

## 5.4 NUANCE — a klasszikus csapdák (ezekre vadásznak)

**(a) Mikor NEM norma a p-„norma"?**
$0 \le p < 1$ esetén a $\left(\sum|x_i|^p\right)^{1/p}$ kifejezés **NEM norma** (a háromszög-egyenlőtlenség elromlik). Csak $p \ge 1$ ad normát. → „minden $p>0$-ra norma" = **hamis**.

**(b) Monotonitás $p$-ben — vigyázz az iránnyal!**
$$
p_1 \le p_2 \ \Longrightarrow\ \|x\|_{p_1} \ge \|x\|_{p_2}.
$$
Tehát **nagyobb $p$ → kisebb (vagy egyenlő) norma**. Ebből adódik a sorrend:
$$
\boxed{\ \|x\|_\infty \le \|x\|_2 \le \|x\|_1\ }.
$$
Csapda: sokan fordítva jegyzik meg. A maximum-norma a **legkisebb**, az 1-norma a **legnagyobb**.

**(c) Normák közötti becslések (a konstansok $n$-től függnek):**
$$
\|x\|_\infty \le \|x\|_1 \le n\,\|x\|_\infty,\qquad
\|x\|_\infty \le \|x\|_2 \le \sqrt{n}\,\|x\|_\infty,\qquad
\|x\|_2 \le \|x\|_1 \le \sqrt{n}\,\|x\|_2.
$$
A felső becslésekben **$n$ ill. $\sqrt{n}$** szerepel — a dimenziótól függő konstans. (A „$\le$" lánc alsó fele konstans nélkül igaz, a felső fele dimenziófüggő.)

**(d) Csak a 2-norma jön skaláris szorzatból (tankönyvi kiegészítés).**
Az 1- és az ∞-norma **nem** származtatható skaláris szorzatból (nem teljesítik a paralelogramma-azonosságot). Ezért a „szögfogalom" és a CBS természetesen a 2-normához kötődik.

## 5.5 CORE — normák ekvivalenciája és konvergencia

**Definíció (ekvivalens normák):** $\|\cdot\|_a$ és $\|\cdot\|_b$ ekvivalens, ha létezik $c_1, c_2 > 0$, hogy
$$
c_1\|x\|_b \le \|x\|_a \le c_2\|x\|_b\quad (\forall x).
$$

**Tétel:** **Véges dimenzióban minden norma ekvivalens** (mind ekvivalens az Euklideszivel).

**Konvergencia normában:** $(x_k) \subset \mathbb{R}^n$ konvergens, ha van $x^*$, hogy $\lim_{k\to\infty}\|x_k - x^*\| = 0$.

**Kulcskövetkezmény (és tipikus kérdés):** mivel $\mathbb{R}^n$-en minden norma ekvivalens, **ha egy sorozat az egyik normában konvergens, akkor mindegyikben** — ugyanahhoz a határértékhez. A konvergencia tehát **normafüggetlen** $\mathbb{R}^n$-ben.

**Csapda / kiegészítés:** ez **a végesdimenziósság miatt** igaz. **Végtelen dimenzióban (függvénytereken) NEM minden norma ekvivalens**, és a konvergencia normafüggő lehet. Ha egy állítás „minden normatérben" mondja ki az ekvivalenciát, az hamis — csak véges dimenzióban.

> **Vizsgára fontos (5. téma):**
> 1. A 4 axióma; a definitség ($\|x\|=0\iff x=0$) erősebb a puszta nemnegativitásnál.
> 2. Három norma: 1 (összeg/Manhattan), 2 (Euklideszi, skaláris szorzatból + CBS), ∞ (maximum/Csebisev).
> 3. **$p\ge 1$ kell** a normasághoz; $\lim_{p\to\infty}\|x\|_p=\|x\|_\infty$; **$\|x\|_\infty \le \|x\|_2 \le \|x\|_1$**.
> 4. **Véges dimenzióban minden norma ekvivalens** → a konvergencia normafüggetlen. (Végtelen dimenzióban nem!)

---

# 6. Önellenőrző kérdések (nehéz, A/B/C/D)

**1.** Egy $A\in\mathbb{R}^{n\times n}$ mátrixról tudjuk, hogy $\det(A)\neq 0$. Mi következik biztosan az LU-felbontásra (sorcsere nélkül, $L\in\mathcal{L}_1$)?
- A) Mindig létezik és egyértelmű.
- B) Mindig létezik, de nem feltétlen egyértelmű.
- C) Nem feltétlen létezik; ehhez a vezető főminorok $D_1,\dots,D_{n-1}$ nem-nullasága kell.
- D) Pontosan akkor létezik, ha $A$ szimmetrikus.

**Helyes: C.** A teljes determináns nem-nullasága (regularitás) nem garantálja a sorcsere nélküli LU-t; a *vezető* minoroknak kell ≠ 0-nak lenniük (lásd a $D_2=0$-s ellenpéldát).

---

**2.** Melyik állítás **HAMIS** a pozitív definitségről (szimmetrikus $A$)?
- A) Ekvivalens azzal, hogy minden sajátérték pozitív.
- B) Ekvivalens azzal, hogy minden vezető főminor pozitív.
- C) $\det(A) > 0$ önmagában biztosítja a pozitív definitséget.
- D) Ekvivalens azzal, hogy $x^\top A x > 0$ minden $x\neq 0$ esetén.

**Helyes: C (ez a hamis).** Egyetlen pozitív (teljes) determináns még nem elég — pl. páros sok negatív sajátérték is pozitív determinánst ad. **Minden** vezető minor pozitivitása kell (Sylvester).

---

**3.** Egy tetszőleges $x\in\mathbb{R}^n$-re melyik egyenlőtlenséglánc igaz **mindig**?
- A) $\|x\|_1 \le \|x\|_2 \le \|x\|_\infty$
- B) $\|x\|_\infty \le \|x\|_2 \le \|x\|_1$
- C) $\|x\|_2 \le \|x\|_\infty \le \|x\|_1$
- D) $\|x\|_1 \le \|x\|_\infty \le \|x\|_2$

**Helyes: B.** A $p$-norma monoton csökken $p$-ben, így a maximum-norma a legkisebb, az 1-norma a legnagyobb.

---

**4.** Mit mondhatunk a $\big(\sum_i |x_i|^p\big)^{1/p}$ kifejezésről $p = \tfrac{1}{2}$ esetén?
- A) Norma, mert minden $p>0$-ra teljesülnek az axiómák.
- B) Norma, de nem ekvivalens a 2-normával.
- C) **Nem** norma, mert sérül a háromszög-egyenlőtlenség.
- D) Norma véges dimenzióban, de végtelenben nem.

**Helyes: C.** Csak $p\ge 1$ esetén norma; $0\le p<1$ esetén a háromszög-egyenlőtlenség elromlik.

---

**5.** Miért $O(n)$ a progonka módszer műveletigénye az általános GE $O(n^3)$-jával szemben?
- A) Mert a progonka iteratív, és csak közelítő megoldást ad.
- B) Mert a GE megőrzi a sávszélességet, így a tridiagonális szerkezet végig megmarad, nincs kitöltődés.
- C) Mert a tridiagonális mátrix mindig pozitív definit.
- D) Mert a progonka nem igényli a pivotok nem-nullaságát.

**Helyes: B.** A sávszélesség-megmaradási tételből nincs fill-in; ezért lineáris. (A: hamis, a progonka direkt és egzakt; C: nem mindig PD; D: a nevezők ≠ 0 itt is kell.)

---

**6.** Igaz-e $\mathbb{R}^n$-ben: „ha egy $(x_k)$ sorozat konvergens a 2-normában, akkor konvergens a maximum-normában is, ugyanahhoz a határértékhez"?
- A) Nem, mert a normák különböző topológiát adnak.
- B) Igen, mert véges dimenzióban minden norma ekvivalens.
- C) Csak akkor, ha a sorozat korlátos.
- D) Csak akkor, ha a határérték a nullvektor.

**Helyes: B.** Véges dimenzióban a normák ekvivalensek → a konvergencia normafüggetlen. (Ez végtelen dimenzióban nem igaz, de a kérdés $\mathbb{R}^n$-ről szól.)

---

## Min menjünk mélyebbre?

Mondd meg, melyik(ek)be ássunk bele jobban — pár lehetőség:

1. **LU létezése és egyértelműsége** — pontos tétel + bizonyításvázlat, a $u_{kk}=D_k/D_{k-1}$ azonosság, pivotálás és a $PA=LU$ alak.
2. **Megmaradási tételek bizonyításai** részletesen (különösen a pozitív definit és a diag. dom. eset), és a „nem kell pivotálni" következmény pontos megfogalmazása.
3. **Progonka** lépésről lépésre egy konkrét kis példán, plusz a stabilitási/nevező-feltétel.
4. **Vektornormák** finomságai: paralelogramma-azonosság, miért nem skaláris-szorzat-norma az 1 és ∞, az ekvivalencia-konstansok élessége.
5. **Több A/B/C/D gyakorlókérdés** kifejezetten a fenti csapdákra hegyezve.
