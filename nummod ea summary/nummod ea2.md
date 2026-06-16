# Numerikus módszerek C — 2. előadás
## Hibaszámítás, Lineáris egyenletrendszerek, Gauss-elimináció
### Vizsgafelkészítő jegyzet (Krebsz Anna előadása alapján)

---

## Mit fed le ez az anyag?

Ez a PDF a kurzus **első két fő témáját** érinti: (1) **hibaszámítás** (hibafogalmak, a hibák terjedése az alapműveleteknél és függvényértéknél, a **kondíciószám**), valamint (2) a **lineáris egyenletrendszerek** elmélete és az első direkt megoldó módszer, a **Gauss-elimináció**. A *gépi számábrázolás / gépi epszilon* csak érintőlegesen jelenik meg (egy-egy véges aritmetikás példán keresztül), a *mátrixnormák* és a *lineáris rendszerek érzékenysége (mátrix-kondíciószám)* pedig **nem** szerepel — itt csak **függvény** kondíciószámáról van szó. Az *LU-felbontást* az anyag csak megemlíti, nem tárgyalja.

> **Csapdaszintű figyelmeztetés előre:** ezen a fólián a `c(f,a)` a **függvény** kondíciószáma. Ez NEM ugyanaz, mint a később jövő `cond(A)` **mátrix**-kondíciószám. Ha a vizsgakérdés „a lineáris rendszer érzékenységéről" szól, az másik anyag — ne keverd ide a `c(f,a)`-t.

---

# 1. Hibaszámítás

## 1.1 A hibák mérőszámai — `CORE`

Legyen `A` a **pontos** érték, `a` a **közelítő** értéke. Öt fogalmat kell tisztán szétválasztanod, mert a vizsga pont az összekeverésükre játszik:

| Fogalom | Jelölés | Definíció | Mire jó |
|---|---|---|---|
| (pontos) hiba | $\Delta a$ | $\Delta a := A - a$ | **Előjeles**. A valódi eltérés. |
| abszolút hiba | $\lvert\Delta a\rvert$ | $\lvert A - a\rvert$ | A hiba nagysága, előjel nélkül. |
| abszolút hibakorlát | $\Delta_a$ | bármely szám, amire $\Delta_a \ge \lvert\Delta a\rvert$ | **Felső becslés** az abszolút hibára. |
| relatív hiba | $\delta a$ | $\delta a := \dfrac{\Delta a}{A} \approx \dfrac{\Delta a}{a}$ | A hiba a nagyságrendhez viszonyítva. |
| relatív hibakorlát | $\delta_a$ | $\delta_a \ge \lvert\delta a\rvert$ | Felső becslés a relatív hibára. |

**A teljes lényeg, amit a fólia nem mond ki, de tudni kell:**

- A **hiba** ($\Delta a$) **előjeles** és általában **ismeretlen** (ha tudnánk, ismernénk a pontos értéket). A **hibakorlát** ($\Delta_a$) egy *ismert, garantált felső becslés* — ezzel dolgozunk a gyakorlatban.
- A jelölés szándékosan alattomos: **$\Delta a$ (a hiba) ≠ $\Delta_a$ (a korlát)**. A kettő közti reláció: $\Delta_a \ge \lvert\Delta a\rvert$. Ugyanígy $\delta a$ vs. $\delta_a$.
- A relatív hibánál azért írható $\Delta a / A \approx \Delta a / a$, mert ha a hiba kicsi, akkor $A \approx a$, így a pontos értékkel való osztás helyettesíthető a közelítővel (a pontosat úgyse ismerjük).

**A $\pi \approx 3{,}14$ példa logikája:** $A=\pi=3{,}14159\ldots$, $a=3{,}14$. Ekkor $\Delta a = \pi - 3{,}14 \approx +0{,}00159$ (előjeles!), $\lvert\Delta a\rvert \approx 0{,}00159$, egy használható abszolút hibakorlát pl. $\Delta_a = 0{,}002$, a relatív hiba pedig $\delta a \approx 0{,}00159/3{,}14 \approx 0{,}0005$.

### ⭐ Vizsgára fontos (1.1)
1. A **hiba előjeles, a hibakorlát egy felső becslés** — a $\Delta a$ vs. $\Delta_a$ különbség tipikus „igaz, kivéve…" csapda.
2. A relatív hiba a hibát a **nagyságrendhez** viszonyítja; ezért lehet egy nagy szám nagy abszolút hibája mellett is kicsi a relatív hibája (és fordítva).

---

## 1.2 Hibák terjedése: az alapműveletek — `CORE` + `NUANCE`

Ha két közelítő számmal műveletet végzünk, a hibák **felhalmozódnak**. A tétel megadja, hogyan adódnak össze a hibakorlátok:

| Művelet | Abszolút hibakorlát | Relatív hibakorlát |
|---|---|---|
| összeadás / kivonás | $\Delta_{a\pm b} = \Delta_a + \Delta_b$ | $\delta_{a\pm b} = \dfrac{\lvert a\rvert\,\delta_a + \lvert b\rvert\,\delta_b}{\lvert a\pm b\rvert}$ |
| szorzás | $\Delta_{a\cdot b} = \lvert b\rvert\,\Delta_a + \lvert a\rvert\,\Delta_b$ | $\delta_{a\cdot b} = \delta_a + \delta_b$ |
| osztás | $\Delta_{a/b} = \dfrac{\lvert b\rvert\,\Delta_a + \lvert a\rvert\,\Delta_b}{b^2}$ | $\delta_{a/b} = \delta_a + \delta_b$ |

**Hogyan érdemes ezt érteni (nem magolni):**

- Az **abszolút hibák összeadásnál/kivonásnál egyszerűen összeadódnak** — a háromszög-egyenlőtlenségből: $\lvert\Delta a \pm \Delta b\rvert \le \lvert\Delta a\rvert + \lvert\Delta b\rvert \le \Delta_a + \Delta_b$. Vagyis a korlát akkor is összeadódik, ha kivonunk (a hibák a „legrosszabb esetben" egy irányba mutatnak).
- **Szorzásnál és osztásnál a *relatív* hibák adódnak össze** ($\delta_{a\cdot b}=\delta_{a/b}=\delta_a+\delta_b$) — ez a könnyen megjegyezhető, „szép" szabály.

### A két veszélyes eset (ez a fólia kulcsmondata) — `NUANCE`

A kapott korlátok **két esetben nagyságrendekkel nagyobbak** lehetnek, mint a kiindulási hibák:

1. **$\delta_{a\pm b}$, amikor két közeli számot vonunk ki egymásból.** Ekkor a nevezőben $\lvert a-b\rvert$ **kicsi**, így a relatív hiba „felrobban". Ez a **jegyveszteség / kivonási katasztrófa** (angolul *catastrophic cancellation*).
2. **$\Delta_{a/b}$, amikor kicsi számmal osztunk.** A nevezőben $b^2$ **kicsi**, a hiba felnagyítódik.

Ezeket az eseteket **az algoritmusok megírásakor el kell kerülni** (átalakítással, sorrendcserével stb.).

**A $\sqrt{2020}-\sqrt{2019}$ példa pontosan az 1. eset.** A naiv számítás két közeli számot ($\approx 44{,}94$ és $\approx 44{,}93$) von ki — a vezető jegyek kioltják egymást, és a maradékban a kerekítési hiba dominál. Az átalakítás
$$\sqrt{2020}-\sqrt{2019} = \frac{1}{\sqrt{2020}+\sqrt{2019}}$$
**elkerüli a kivonást** (helyette összeadás és osztás van), ezért pontosabb. A fólián a két eredmény: `0.011126230000002` (naiv) vs. `0.011126231166003` (átalakított) — a két szám korán „szétmegy", mert a naiv változatban elveszett néhány értékes jegy.

> **Saját kiegészítés:** matematikailag a két képlet azonos; a különbség **tisztán numerikus**. Ez a fólia legfontosabb tanulsága az egész hibaszámításból: *ugyanaz a képlet többféleképpen felírva más-más pontosságot adhat véges aritmetikában.*

### ⭐ Vizsgára fontos (1.2)
1. **Szorzás/osztás → relatív hibák összeadódnak** ($\delta_a+\delta_b$); **összeadás/kivonás → abszolút hibakorlátok összeadódnak** ($\Delta_a+\Delta_b$). Ezt szeretik megfordítva kérdezni.
2. **Két veszélyes eset:** (a) **közeli számok kivonása** → relatív hiba robban; (b) **kicsi számmal osztás** → abszolút hiba robban. A kivonási jegyveszteséget tudni kell névről felismerni.
3. A $\sqrt{2020}-\sqrt{2019}$ típusú átalakítás célja a **kivonás kiküszöbölése** — nem a „szebb képlet", hanem a numerikus stabilitás.

---

## 1.3 A függvényérték hibája és a kondíciószám — `CORE`

Ha egy $f$ függvényt egy hibás $a$ helyen értékelünk ki, mekkora lesz $f(a)$ hibája?

**1. Tétel (lineáris becslés, $f \in C^1$):**
$$\Delta_{f(a)} = M_1 \cdot \Delta_a, \qquad M_1 = \max\{\lvert f'(\xi)\rvert : \xi \in [a-\Delta_a,\, a+\Delta_a]\}.$$
**Intuíció:** a Lagrange-féle középértéktétel szerint $\Delta f(a) = f(A)-f(a) = f'(\xi)\,\Delta a$. A derivált a függvény „meredeksége" — minél meredekebb, annál jobban felnagyítja a bemeneti hibát. A korláthoz a deriváltat a maximumával ($M_1$) becsüljük felül.

**2. Tétel (pontosabb, másodrendű becslés, $f \in C^2$):**
$$\Delta_{f(a)} = \lvert f'(a)\rvert\,\Delta_a + \frac{M_2}{2}\,\Delta_a^2, \qquad M_2 = \max\{\lvert f''(\xi)\rvert\}.$$
**Intuíció:** ez a **Taylor-formulából** jön (elsőrendű tag + másodrendű maradéktag). Ha $\Delta_a$ kicsi, a $\Delta_a^2$-es tag elhanyagolható, és visszakapjuk az 1. tétel lényegét, csak most $M_1$ helyett a konkrét $\lvert f'(a)\rvert$ szerepel.

**Következmény (relatív hiba, kis $\Delta_a$ esetén):**
$$\delta_{f(a)} = \frac{\lvert a\rvert\,\lvert f'(a)\rvert}{\lvert f(a)\rvert}\cdot \delta_a.$$

**Definíció — kondíciószám:**
$$\boxed{\,c(f,a) = \frac{\lvert a\rvert\,\lvert f'(a)\rvert}{\lvert f(a)\rvert}\,}$$
Ez a szám mondja meg, hogy a függvény az $a$ helyen **hányszorosára nagyítja a bemenet relatív hibáját**: $\delta_{f(a)} \approx c(f,a)\cdot \delta_a$.

**Mit jelent ez gyakorlatban (ez a vizsga magja):**
- $c \le 1$: a függvény **jól kondicionált** — tompítja vagy nem nagyítja a hibát.
- $c \gg 1$: **rosszul kondicionált** — kis bemeneti hiba nagy kimeneti hibát okoz.
- Mikor nagy $c$? Ha **$\lvert f(a)\rvert$ kicsi** (a függvény gyöke közelében!), vagy ha **$\lvert f'(a)\rvert$ nagy** (nagyon meredek hely).

> **Saját kiegészítés — kapcsolat a kivonási jegyveszteséggel:** a „közeli számok kivonása" valójában egy gyök közelében kiértékelt függvény. Az $f(x)=x-c$ az $x=c$ gyök közelében rosszul kondicionált, mert ott $f(a)\approx 0$, így $c(f,a)$ óriási. A két jelenség (1.2 és 1.3) ugyanannak az éremnek a két oldala.

**Az exp(π) vs. log(π) példa megfejtése** (a fólia felteszi a kérdést, de nem válaszol):
- $f=\exp$: $c(\exp,a)=\big\lvert a\cdot e^a/e^a\big\rvert = \lvert a\rvert$. Az $a=\pi$ helyen $c\approx 3{,}14$ → a relatív hibát kb. $\pi$-szeresére nagyítja.
- $f=\log$ (természetes alapú): $c(\log,a)=\big\lvert a\cdot(1/a)/\ln a\big\rvert = 1/\lvert\ln a\rvert$. Az $a=\pi$ helyen $c\approx 1/1{,}145 \approx 0{,}87$ → a hibát **tompítja**.
- **Tehát a $\log$ tolerálja jobban a hibát**, mert ott a kondíciószám kisebb (1 alatti). A fólián látott számok ezt igazolják: a $\log$ két közelítése csak a 4. tizedesnél tér el, az $\exp$-é már a 2.-nál.

### ⭐ Vizsgára fontos (1.3)
1. A kondíciószám képlete $c(f,a)=\dfrac{\lvert a\rvert\,\lvert f'(a)\rvert}{\lvert f(a)\rvert}$, és azt méri, hogy a függvény **a relatív hibát** hányszorosára nagyítja.
2. **Rosszul kondicionált** a függvény, ahol $\lvert f(a)\rvert$ kicsi (**gyök közelében**) vagy $\lvert f'(a)\rvert$ nagy. Ez a leggyakoribb fogalmi kérdés.
3. Az 1. tétel **Lagrange-tételen**, a 2. tétel **Taylor-formulán** alapul — a bizonyítás eszközét is szeretik kérdezni.
4. A relatív hiba képlete csak **kis $\Delta_a$** esetén érvényes (a $\Delta_a^2$-es tag elhanyagolása).

---

# 2. Lineáris egyenletrendszerek (LER)

## 2.1 Hol bukkannak fel? — `COMPRESS`

A fólia több motiváló példát hoz; a vizsga szempontjából elég a **fogalmi tanulság**: rengeteg gyakorlati feladat vezet lineáris egyenletrendszerre. Röviden:

- **„MATEK" rejtvény** (alsós versenyfeladat): valójában 5 egyenlet, 5 ismeretlen → álcázott LER.
- **Gazdasági (Leontief-féle) modell:** közvetlen ráfordítás mátrix $K$, teljes ráfordítás $T=(I-K)^{-1}$; $y=(I-K)x$ és $x=T y$. (Egyetlen vizsgára való morzsa: a $(I-K)^{-1}$ inverz mátrix egy LER megoldásával egyenértékű.)
- **Mérnöki numerikus feladatok**, **interpolációs spline-ok**, **approximáció** — mind LER-re vezetnek.
- **Hálózatok (Kirchhoff I. törvénye):** minden csomópontban „a befolyó és kifolyó áramok összege nulla" — ez egy lineáris reláció, a csomópontok együtt adják a LER-t.

Ezek **nem** önálló elméleti tételek, csak azt mutatják, miért fontos a LER. Ne tölts rájuk sok időt.

---

## 2.2 Megoldhatóság és egyértelműség — `CORE`

A rendszer alakjai:
$$Ax=b, \qquad A\in\mathbb{R}^{n\times n},\; b,x\in\mathbb{R}^n.$$
Adott $A$ és $b$, keressük $x$-et. **Fontos: $A$ négyzetes** ($n$ egyenlet, $n$ ismeretlen).

**Megoldhatóság:** a LER **akkor és csak akkor megoldható**, ha $b$ felírható $A$ **oszlopvektorainak lineáris kombinációjaként** (azaz $b$ benne van $A$ oszlopterében).

**Egyértelmű megoldhatóság — az ekvivalencialánc (ezt magold be tökéletesen):**
$$\text{egyértelmű megoldás} \iff A \text{ oszlopai lin. függetlenek} \iff \operatorname{rang}(A)=n \iff \det(A)\neq 0 \iff A \text{ invertálható } (x=A^{-1}b).$$

**Megjegyzések, amelyek vizsgakérdéssé válnak:**
- Ha $A$ **speciális alakú** (diagonális vagy háromszög), a megoldás **közvetlenül** kiolvasható/visszahelyettesíthető. **Ez a direkt módszerek alapötlete:** hozzuk a rendszert ilyen „könnyű" alakra.
- A **Cramer-szabályt** csak **legfeljebb $3\times 3$**-ig használjuk — nagyobb méretre a sok determináns miatt reménytelenül lassú (műveletigénye faktoriális/extrém nagy). Ezt szeretik „mikor használjuk Cramert?" kérdésként feltenni.

### ⭐ Vizsgára fontos (2.2)
1. Az **egyértelmű megoldhatóság ekvivalencialánca** ($\det\neq 0 \iff \operatorname{rang}=n \iff$ oszlopok függetlenek $\iff$ invertálható). Tipikus csapda: melyik feltétel **nem** ekvivalens (pl. „$\det(A)=0$ → nincs megoldás" **hamis**: lehet végtelen sok is, csak nem egyértelmű).
2. **Megoldható** = $b$ benne van az oszloptérben; **egyértelműen megoldható** = ráadásul $A$ reguláris. A kettő nem ugyanaz.
3. A **direkt módszer alapötlete**: háromszög/diagonális alakra hozni a rendszert. **Cramer csak max. $3\times3$.**

---

## 2.3 Megoldási módszerek térképe: direkt vs. iteratív — `CORE` / `NUANCE`

A fólia három nagy családot sorol fel:

| | **Direkt módszerek** | **Iterációs módszerek** | **Variációs módszerek** |
|---|---|---|---|
| Alapelv | véges sok lépésben átalakítás | a megoldáshoz **tartó** vektorsorozat | egy célfüggvény **minimalizálása** |
| Lépésszám | **véges**, előre ismert | elvileg **végtelen**, leállási feltételig | iteratív |
| Példák | Gauss-elim., **Progonka**, LU, LDU, $LL^\top$/**Cholesky**, QR (Gram–Schmidt, Householder), ILU | mátrixnormák + **Banach-fixponttétel**, Jacobi, Gauss–Seidel, Richardson, ILU | gradiens-, konjugált gradiens-módszer |

**Ebben a tárgyban a direkt oldalból:** Gauss-elimináció, **Progonka** (tridiagonális rendszerekre szabott speciális GE — *saját kiegészítés: ez a „Thomas-algoritmus"*), **LU-felbontás**.

**A direkt módszerek jellemzői (ezt a hármast tudni kell):**
1. **Pontos számolás esetén pontos megoldás.**
2. **Véges lépésszám.**
3. **Pontatlan (véges) aritmetikában a megoldás az algoritmussal NEM javítható.** — Ez a kulcskülönbség az iteratív módszerekhez képest: a direkt módszer „egyszer lefut és kész", nincs benne önkorrekció.

> **Saját kiegészítés — a valódi szembeállítás:** az iterációs módszer minden lépésben *közelebb kerül* a megoldáshoz, és a kerekítési hibákat menet közben „elnyeli" (önkorrigál), cserébe csak közelítő megoldást ad, és kérdés a konvergencia. A direkt módszer véges lépésben elvileg pontos, de a felgyűlt kerekítési hibát már nem tudja kijavítani. Ez klasszikus A/B/C/D ütköztetés.

### ⭐ Vizsgára fontos (2.3)
1. **Direkt vs. iteratív:** direkt = véges lépés + (elvi) pontosság + **nincs önkorrekció**; iteratív = konvergáló sorozat + közelítő + konvergenciafeltétel kell.
2. Tudd besorolni a neveket: **Gauss, LU, Cholesky, QR, Progonka = direkt**; **Jacobi, Gauss–Seidel, Richardson = iteratív**; **gradiens, konjugált gradiens = variációs**. (A Gauss-**Seidel iteráció** ≠ Gauss-elimináció — ez névcsapda!)
3. A direkt módszer **pontatlan aritmetikában nem javítható** — ez a leggyakrabban tesztelt jellemző.

---

# 3. Gauss-elimináció (GE)

## 3.1 Az alapötlet

A cél: az $Ax=b$ rendszert **felső háromszög alakra** hozni (előre, „balról jobbra"), majd **visszahelyettesítéssel** megoldani (vissza, „jobbról balra"). A tárolási forma a **bővített mátrix** $[A\,|\,b]$, ahol $a_{i,n+1}:=b_i$. A kiindulás $A^{(0)}$.

Miért működik? Mert a háromszög alakú rendszer triviálisan megoldható visszafelé (lásd 2.2: speciális alak → könnyű megoldás), és a megengedett **sorműveletek** (egy sor konstansszorosának kivonása egy másikból, sorcsere, sor szorzása nemnulla számmal) **nem változtatják meg a megoldáshalmazt**.

## 3.2 Az algoritmus (elimináció) — `CORE`

**$k$. lépés:** az 1.,…,$k$. egyenletet változatlanul hagyjuk. **Ha $a_{kk}^{(k-1)}\neq 0$** (ez a **főelem / pivot**), akkor minden alatta lévő $i$. sorból ($i=k+1,\dots,n$) kivonjuk a $k$. sor megfelelő többszörösét, hogy az $a_{ik}$ elem **kinullázódjon**. A **szorzó (multiplikátor):**
$$m_{ik} = \frac{a_{ik}^{(k-1)}}{a_{kk}^{(k-1)}}.$$
Az általános képlet:
$$\boxed{\,a_{ij}^{(k)} = a_{ij}^{(k-1)} - \frac{a_{ik}^{(k-1)}}{a_{kk}^{(k-1)}}\cdot a_{kj}^{(k-1)}\,}\qquad
\begin{aligned}&k=1,\dots,n-1;\\ &i=k+1,\dots,n;\\ &j=k+1,\dots,n,n+1.\end{aligned}$$

$n-1$ lépés után **felső háromszögmátrix** alakú a rendszer.

**Kritikus feltétel:** minden lépésben kell, hogy **$a_{kk}^{(k-1)}\neq 0$** legyen, mert osztunk vele. Ha valamelyik pivot **nulla**, a sima GE **megáll** — ekkor sorcserére van szükség.

## 3.3 Visszahelyettesítés (back substitution)

A felső háromszög alakból alulról felfelé számolunk:
$$x_n = \frac{a_{n,n+1}^{(n-1)}}{a_{nn}^{(n-1)}}, \qquad
x_i = \frac{1}{a_{ii}^{(i-1)}}\left(a_{i,n+1}^{(i-1)} - \sum_{j=i+1}^{n} a_{ij}^{(i-1)}\,x_j\right)\quad (i=n-1,\dots,1).$$

> **Saját kiegészítés — két stílus:** a fólia a *képletben* a klasszikus visszahelyettesítést írja (megtartja a háromszög alakot, és behelyettesít). A *kidolgozott példában* viszont teljesen $[I\,|\,x]$ alakra redukál (a főátló fölött is nulláz, majd a sorokat 1-re normálja) — ez a **Gauss–Jordan**-stílus. Mindkettő ugyanazt az $x$-et adja; a vizsgán a kettő lényegét (előre elimináció + valamilyen visszafelé lépés) kell érteni.

## 3.4 Főelemkiválasztás (pivoting) — `NUANCE` (saját kiegészítés)

A fólia csak annyit mond: kell, hogy $a_{kk}\neq 0$. A teljes kép, ami vizsgán előkerülhet:

- **Ha a pivot pontosan 0:** sorcserével (vagy oszlopcserével) választunk nemnulla főelemet. Ezt **(részleges) főelemkiválasztásnak** hívják. Ha az egész oszlopban csak 0 van a pivot alatt, a mátrix szinguláris.
- **Ha a pivot kicsi (de nem 0):** elvileg működik, de **numerikusan instabil**, mert a $m_{ik}=a_{ik}/a_{kk}$ szorzó **nagy** lesz, és a 1.2-ben látott „kicsi számmal osztás" hibanagyító esete lép fel. Ezért a gyakorlatban **részleges főelemkiválasztással** mindig a legnagyobb abszolútértékű elemet hozzuk pivot pozícióba.

Ez köti össze a két fő témát: **a hibaszámítás indokolja, miért kell a Gauss-eliminációban főelemkiválasztás.**

## 3.5 Műveletigény

A Gauss-elimináció futásideje **$\mathcal{O}(n^3)$** nagyságrendű (a fólia a Matlab-méréssel illusztrálja: $n=10,20,\dots,200$ esetén a futásidő tényleg „$n^3$-szerű"). Ezt érdemes tudni, mert szembeállítható a Cramer-szabály jóval rosszabb költségével.

## 3.6 Kidolgozott példa (csak a tanulság miatt)

A példa
$$\begin{bmatrix}2&0&3\\-4&5&-2\\6&-5&4\end{bmatrix}x=\begin{bmatrix}-1\\3\\-3\end{bmatrix}$$
megoldása $x=[1,\,1,\,-1]^\top$. A lépések logikája: 1) az 1. oszlop kinullázása az 1. sor $(-2)$- és $(+3)$-szorosának kivonásával; 2) a 2. oszlop; 3) visszahelyettesítés. **A konkrét aritmetikát NEM kell tudnod** (a vizsga elméleti) — csak a *folyamat szerkezetét*.

### ⭐ Vizsgára fontos (3)
1. **Az elimináció felső háromszög alakot állít elő, majd visszahelyettesítés következik.** A pivot **$a_{kk}\neq 0$** feltétele kötelező.
2. **Nulla pivot → sorcsere (főelemkiválasztás) kell**, különben az algoritmus megáll. **Kicsi pivot → instabilitás**, ezért választunk nagy főelemet — ezt a hibaszámítás indokolja.
3. A GE **műveletigénye $\mathcal{O}(n^3)$**. Ezért jobb, mint a Cramer-szabály nagy rendszerekre.
4. A módszer **direkt** (véges lépés, elvileg pontos), de **kerekítési hibára nem önkorrigál**.

---

# Önellenőrző kérdések (A/B/C/D)

**1.** Melyik állítás IGAZ a hiba és a hibakorlát viszonyáról?
- A) A $\Delta a$ mindig nemnegatív.
- B) A $\Delta_a$ az abszolút hiba pontos értéke.
- C) A $\Delta_a$ egy felső becslés, amelyre $\Delta_a \ge \lvert\Delta a\rvert$, míg $\Delta a$ előjeles.
- D) A relatív hiba mindig nagyobb az abszolút hibánál.

**2.** Egy program $\sqrt{x+1}-\sqrt{x}$-et számol nagy $x$-re. Miért pontatlan, és mi a megoldás?
- A) Mert nagy számmal szoroz; gyökvonással javítható.
- B) Mert két közeli számot von ki (jegyveszteség); az $1/(\sqrt{x+1}+\sqrt{x})$ alak pontosabb.
- C) Mert kicsi számmal oszt; nagyobb pivot választásával javítható.
- D) A két alak numerikusan azonos, nincs különbség.

**3.** Egy $f$ függvény az $a$ pontban **rosszul** kondicionált. Melyik a legvalószínűbb ok?
- A) $\lvert f(a)\rvert$ nagy.
- B) $f$ konstans az $a$ közelében.
- C) $a$ közel van $f$ egy gyökéhez (azaz $\lvert f(a)\rvert$ kicsi), vagy $\lvert f'(a)\rvert$ nagy.
- D) A kondíciószám definíció szerint mindig 1 alatti.

**4.** Egy $n\times n$-es $A$ mátrixra $\det(A)=0$. Mi következik az $Ax=b$ rendszerről?
- A) Biztosan nincs megoldása.
- B) Biztosan pontosan egy megoldása van.
- C) Nincs *egyértelmű* megoldása: vagy nincs megoldás, vagy végtelen sok van.
- D) A Gauss-elimináció biztosan pontos megoldást ad rá.

**5.** Melyik állítás IGAZ a direkt és iteratív módszerek összevetésében?
- A) A Gauss–Seidel-iteráció a Gauss-elimináció gyorsabb változata.
- B) A direkt módszerek véges lépésben futnak, de a felgyűlt kerekítési hibát az algoritmus már nem javítja; az iteratívok közelítő sorozatot adnak, amely (konvergencia esetén) a megoldáshoz tart.
- C) Az iterációs módszerek mindig pontosabbak, mert végtelen lépést tesznek.
- D) A Cholesky-felbontás iterációs módszer.

**6.** A Gauss-eliminációban a $k$. lépésben $a_{kk}^{(k-1)}=0$. Mi a helyes teendő?
- A) Az algoritmus leáll, a rendszer biztosan megoldhatatlan.
- B) Sorcserével (főelemkiválasztással) nemnulla pivotot hozunk a helyére, ha az oszlopban lejjebb van ilyen.
- C) Elosztjuk a sort nullával, és folytatjuk.
- D) Áttérünk a Cramer-szabályra, mert a GE elvileg sem alkalmazható.

---

### Megoldások
- **1 → C.** A hiba előjeles és általában ismeretlen; a hibakorlát egy ismert felső becslés. (A) hamis (lehet negatív), (B) összekeveri a korlátot a hibával, (D) nincs ilyen általános reláció.
- **2 → B.** Klasszikus kivonási jegyveszteség; a racionalizálás kiküszöböli a kivonást, ezért pontosabb. A két alak matematikailag azonos, numerikusan nem.
- **3 → C.** $c(f,a)=\lvert a\rvert\lvert f'(a)\rvert/\lvert f(a)\rvert$ nagy, ha $\lvert f(a)\rvert$ kicsi (gyök közelében) vagy a derivált nagy. (A) és (D) éppen fordítva igaz.
- **4 → C.** $\det(A)=0$ csak az *egyértelműséget* zárja ki; lehet nulla vagy végtelen sok megoldás. (A)/(B) túl erős állítás, (D) hamis (a GE szinguláris mátrixon elakad).
- **5 → B.** Ez a direkt/iteratív szembeállítás lényege. (A) névcsapda (a Gauss–Seidel iterációs módszer), (C) a konvergencia nem garantált és nem ad „pontosabbat", (D) a Cholesky direkt felbontás.
- **6 → B.** Nulla pivotnál sorcsere kell. (A) hamis (a 0 pivot nem jelent megoldhatatlanságot), (C) értelmetlen, (D) téves (a GE főelemkiválasztással alkalmazható).

---

## Mit mélyítsünk el?

Mondd meg, melyik irányba menjünk tovább — pár lehetőség:

1. **Kondíciószám-gyakorlás:** több konkrét $f$-re kiszámolni $c(f,a)$-t, és eldönteni, jól vagy rosszul kondicionált-e (tipikus vizsgafeladat-típus).
2. **Hibaterjedési szabályok levezetése:** végigvenni, miért adódik össze a relatív hiba szorzásnál és az abszolút korlát összeadásnál (a fólia bizonyításai lépésről lépésre, érthetően).
3. **Direkt vs. iteratív mélyebben:** mi pontosan a Progonka/LU/Cholesky szerepe, és hol jönnek be a mátrixnormák + Banach-fixponttétel (ez átvezet a kurzus következő témáihoz).
4. **Főelemkiválasztás:** részleges vs. teljes pivotálás, és a kapcsolat a numerikus stabilitással — több „igaz, kivéve…" típusú finomság.
5. **Több próbakérdés** ugyanebben a nehézségi szinten, célzottan a téged érdeklő részből.

Írd meg, melyik(ek) érdekelnek, és arra élesítem a következő kört.
