# Numerikus módszerek C — 11. előadás
## Az általánosított inverz és approximációs tulajdonsága (Legkisebb négyzetek módszere)

---

## Mit fed le ez a PDF? (gyors térkép)

Ez a diasor a kurzus **„Legkisebb négyzetek módszere (approximáció)"** témáját tárgyalja, egyetlen összefüggő blokként. A központi gondolat: egy **túlhatározott** lineáris egyenletrendszert oldunk meg **általánosított értelemben** (pszeudoinverzzel), és belátjuk, hogy ennek megoldása éppen a **négyzetesen legjobban közelítő polinom** együtthatóit adja. Mellékesen támaszkodik a lineáris egyenletrendszerek (LER) és a **mátrix 2-norma** fogalmára, és bevezeti az **általánosított (Moore–Penrose) inverzet**.

Ami **nincs** benne (de a kurzusban máshol van): gépi számábrázolás, Gauss-elimináció/LU mint direkt módszer, nemlineáris gyökkeresés, Horner, interpoláció, numerikus integrálás. A módszert kifejezetten az interpolációval szemben érdemes pozícionálni — erre külön kitérünk.

---

# 1. TÉMA: Legkisebb négyzetek módszere (LNM)

## 1.1 A nagy kép — milyen problémát old meg?

Adott egy **adatfelhő**: $N$ darab $(x_i, y_i)$ pont, ahol az $y_i$ értékek **mérési eredmények** vagy függvényértékek, jellemzően **zajjal terhelve**. Olyan **alacsony fokszámú** polinomot keresünk, amely „átlagosan a legjobban" követi az adatok trendjét.

A kulcsmondat, amit a diák implicit hagynak: itt **nem akarunk minden ponton áthaladni**. Sőt, nem is tudnánk: ha $N \gg n$, akkor egy $n$-edfokú polinomnak nincs annyi szabadsági foka, hogy minden ponton átmenjen. Helyette egy **kompromisszumos** görbét keresünk, amely a hibák **négyzetösszegét** minimalizálja.

## 1.2 CORE — Az alapfeladat (definíció)

Adottak az $x_1, \dots, x_N \in [a;b]$ **különböző** alappontok és az $y_1, \dots, y_N \in \mathbb{R}$ értékek. Olyan $p_n \in P_n$ (legfeljebb $n$-edfokú) polinomot keresünk — ahol $n+1 \le N$, általában $N \gg n$ —, amelyre

$$\sum_{i=1}^{N}\bigl(y_i - p_n(x_i)\bigr)^2 \quad \text{minimális.}$$

Ezt a $p_n$-t **négyzetesen legjobban közelítő polinomnak** nevezzük. A $y_i - p_n(x_i)$ mennyiségek a **maradékok (reziduumok)**: az illesztett görbe függőleges eltérése az adatponttól.

**Miért éppen a négyzetek összege?** (saját kiegészítés — a diák nem indokolják)
- A négyzetösszeg **mindenütt differenciálható** sima függvény, így deriválással kezelhető. Az abszolútértékek összege ($\sum |y_i - p_n(x_i)|$) nem deriválható a töréspontokon.
- A négyzetre emelés **lineáris** egyenletrendszerre (normálegyenletek) vezet, amit könnyű megoldani.
- **Statisztikai** indok: független, azonos szórású Gauss-zaj esetén a legkisebb négyzetes becslés a maximum-likelihood becslés.
- A nagy eltéréseket **erősen bünteti** (négyzetesen), ezért érzékeny a kiugró adatokra (lásd a NUANCE részt: az 1-norma robusztusabb).

## 1.3 CORE — Interpoláció vs. approximáció (a legfontosabb megkülönböztetés)

Ezt érdemes fejből tudni, mert klasszikus A/B/C/D csapda:

| Szempont | **Interpoláció** | **Approximáció (LNM)** |
|---|---|---|
| Cél | a görbe **pontosan átmegy** minden ponton: $p(x_i)=y_i$ | a görbe **a legjobban közelít**, a hibanégyzeteket minimalizálja |
| Pontok és fokszám | $N$ pont → $N-1$ fokú polinom kell | $N$ pont, de **kis** $n$ fok ($n+1 \le N$) |
| Adatzaj | a zajt is „lemásolja" → hajlamos oszcillálni | a zajt **kisimítja** |
| Maradék | nulla minden ponton | általában nem nulla |
| Egyenletrendszer | négyzetes, egyértelmű megoldás | **túlhatározott**, általánosított megoldás kell |

Fontos határeset: ha **$N = n+1$** (és az alappontok különbözőek), akkor a két fogalom **egybeesik** — ekkor a rendszer négyzetes, pontosan megoldható, a reziduum nulla, az LNM-megoldás maga az interpolációs polinom. Az **igazi** approximáció a $N > n+1$ eset.

## 1.4 CORE — Mátrixalak és a túlhatározott rendszer

Írjuk fel azt az „ábrándos" egyenletrendszert, amelyben minden pont teljesülne: $p_n(x_i)=y_i$, ahol $p_n(x)=a_n x^n + \dots + a_1 x + a_0$. Mátrixalakban $A\,a = y$, ahol

$$
A=\begin{bmatrix}
1 & x_1 & \cdots & x_1^n\cr 
1 & x_2 & \cdots & x_2^n\cr 
\vdots & \vdots & & \vdots\cr 
1 & x_N & \cdots & x_N^n
\end{bmatrix}_{N\times(n+1)},\quad
a=\begin{bmatrix}a_0\cr a_1\cr \vdots\cr a_n\end{bmatrix}_{(n+1)\times 1},\quad
y=\begin{bmatrix}y_1\cr y_2\cr \vdots\cr y_N\end{bmatrix}_{N\times 1}.
$$

Az $A$ egy **Vandermonde-típusú** mátrix. Két kulcsmegfigyelés:

1. **Túlhatározott.** Ha $N > n+1$, több egyenletünk van, mint ismeretlenünk → **klasszikus értelemben általában nincs megoldás** (az $y$ vektor általában nem áll elő $A$ oszlopainak lineáris kombinációjaként, azaz nincs benne $A$ oszopterében).
2. **Teljes rangú.** Mivel az alappontok különbözőek, $\operatorname{rang}(A)=n+1$ — **teljes oszloprangú**. (A különböző csomópontokból adódó Vandermonde-oszlopok lineárisan függetlenek.) Ez teszi lehetővé, hogy **általánosított értelemben** megoldjuk.

## 1.5 CORE — Az általánosított inverz (pszeudoinverz) és a normálegyenletek

Az általánosított inverz a négyzetes mátrix inverzének **kiterjesztése** nem négyzetes / nem invertálható mátrixokra. A mi (túlhatározott, teljes oszloprangú) esetünkben:

$$
A^{+} = (A^{T}A)^{-1}A^{T},
\qquad
a^{+} = A^{+}y = (A^{T}A)^{-1}A^{T}y.
$$

Ez ekvivalens a **Gauss-féle normálegyenletekkel**:

$$
A^{T}A\,a^{+} = A^{T}y.
$$

Az $A^{T}A$ mátrix elemei a hatványösszegek (a $(j,k)$ elem $\sum_i x_i^{j+k}$), a jobb oldalé $\sum_i x_i^k y_i$. Kiírva (szimmetrikus rendszer):

$$
\begin{bmatrix}
N & \sum x_i & \cdots & \sum x_i^n\cr 
\sum x_i & \sum x_i^2 & \cdots & \sum x_i^{n+1}\cr 
\vdots & & & \vdots\cr 
\sum x_i^n & \sum x_i^{n+1} & \cdots & \sum x_i^{2n}
\end{bmatrix}
\begin{bmatrix}a_0\cr a_1\cr \vdots\cr a_n\end{bmatrix}
=
\begin{bmatrix}\sum y_i\cr \sum x_i y_i\cr \vdots\cr \sum x_i^n y_i\end{bmatrix}.
$$

A lényeg: egy **$N\times(n+1)$ túlhatározott** rendszer helyett egy **$(n+1)\times(n+1)$** méretű, **szimmetrikus** és (teljes oszloprang mellett) **invertálható** rendszert kapunk, amelyet már klasszikusan meg lehet oldani.

> **$A^{+}$ jelentése „bal inverz".** Teljes oszloprang esetén $A^{+}A = I$. Ez a *bal* inverz, és kifejezetten a **magas/túlhatározott** esetre szól. (Ellenpólus, NUANCE: alulhatározott, teljes sorrang esetén a *jobb* inverz $A^{+}=A^{T}(AA^{T})^{-1}$ lenne. A vizsgán a túlhatározott formula a releváns.)

## 1.6 CORE — Az approximációs tulajdonság és a geometriai jelentés

Ez a fejezet a diasor **címadó gondolata**: miért épp a legjobb közelítést adja $a^{+}$?

**Approximációs tulajdonság:** minden $a \in \mathbb{R}^{n+1}$ vektorra

$$
\lVert A\,a^{+} - y\rVert_2 \;\le\; \lVert A\,a - y\rVert_2.
$$

Mivel $\lVert A a - y\rVert_2^2 = \sum_{i=1}^N (p_n(x_i)-y_i)^2$, a 2-norma négyzetének minimalizálása **pontosan** az LNM célfüggvénye. Tehát $a^{+}$ a négyzetesen legjobban közelítő polinom együtthatóit adja. Jegyezzük meg: $a^{+}$ a maradékot **nem teszi nullává**, csak a lehető **legkisebbre** csökkenti a 2-norma szerint.

**Geometriai kép (saját kiegészítés, a megértés kulcsa).** $A$ oszlopai egy $(n+1)$-dimenziós alteret feszítenek ki $\mathbb{R}^N$-ben (ez az **oszloptér**, $\mathcal{R}(A)$). Az $y$ vektor általában **nem** fekszik ebben az altérben. A legjobb közelítés az $y$ **merőleges (ortogonális) vetülete** az oszloptérre:

- $A\,a^{+}$ = az $y$ vetülete $\mathcal{R}(A)$-ra,
- a maradék $r = y - A a^{+}$ **merőleges** az oszloptérre: $A^{T}r = 0$.

Ez utóbbi átrendezve $A^{T}(y - A a^{+}) = 0 \Rightarrow A^{T}A\,a^{+} = A^{T}y$ — **éppen a normálegyenletek**. Vagyis a normálegyenletek nem egy trükk, hanem a „a maradék legyen merőleges az illesztési térre" feltétel algebrai alakja.

## 1.7 CORE — A két levezetés ugyanoda vezet

A diasor **kétféleképpen** jut el a normálegyenletekhez; jó tudni, hogy a kettő ugyanaz:

**(a) Pszeudoinverz / projekciós út.** $a^{+} = (A^{T}A)^{-1}A^{T}y$, a merőleges vetület feltételéből.

**(b) Szélsőérték (analízis) út.** Tekintsük a többváltozós célfüggvényt
$$
F(a_0,\dots,a_n)=\sum_{i=1}^N\Bigl(y_i-\sum_{j=0}^n a_j x_i^{\,j}\Bigr)^2,
$$
és keressük a minimumot a parciális deriváltak nullázásával, $\partial F/\partial a_k = 0$ ($k=0,\dots,n$). Mivel $\partial p_n/\partial a_k(x_i)=x_i^k$, kapjuk:
$$
\sum_{i=1}^N p_n(x_i)\,x_i^k = \sum_{i=1}^N y_i\,x_i^k
\;\Longrightarrow\;
\sum_{j=0}^n a_j\sum_{i=1}^N x_i^{\,j+k} = \sum_{i=1}^N y_i x_i^k.
$$
Ez **pontosan ugyanaz** a normálegyenlet-rendszer, mint az (a) úton. A részletes átrendezés (a diák 19–21. oldala) mechanikus — vizsgán nem a lépéseket, hanem a **végeredmény azonosságát** kell tudni.

**Minimum, nem maximum/nyeregpont.** A Hesse-mátrix $F'' = 2A^{T}A$, ami teljes oszloprang esetén **pozitív definit** → a kapott pont **szigorú minimum**, ráadásul $F$ konvex kvadratikus, így ez a **globális** minimum, és **egyértelmű**.

## 1.8 CORE — Speciális eset: egyenesillesztés ($n=1$)

A leggyakoribb alkalmazás a regressziós egyenes. A normálegyenlet:

$$
\begin{bmatrix} N & \sum x_i \cr  \sum x_i & \sum x_i^2 \end{bmatrix}
\begin{bmatrix} a_0 \cr  a_1 \end{bmatrix}
=
\begin{bmatrix} \sum y_i \cr  \sum x_i y_i \end{bmatrix}.
$$

Két fontos következmény:

- **Centrált adat ($\sum x_i = 0$):** a rendszer **diagonálissá** válik, és szétesik:
$$
a_0=\frac{1}{N}\sum y_i,\qquad a_1=\frac{\sum x_i y_i}{\sum x_i^2}.
$$
(Innen a statisztika/regressziószámítás kedvelt formulái.)
- **Az illesztett egyenes mindig átmegy az átlagponton** $\bigl(\bar{x},\bar{y}\bigr)=\bigl(\tfrac1N\sum x_i,\ \tfrac1N\sum y_i\bigr)$. Ez a normálegyenletek **első sorából** közvetlenül adódik: $N a_0 + a_1\sum x_i = \sum y_i$, $N$-nel osztva $a_0 + a_1\bar{x} = \bar{y}$, azaz $p_1(\bar{x})=\bar{y}$.

---

## 1.9 NUANCE — csapdaanyag (ezekre figyelj!)

- **„$A^{T}A$ szimmetrikus és invertálható" — bontsd szét.** A **szimmetria mindig** igaz, bármilyen $A$-ra ($(A^{T}A)^{T}=A^{T}A$). Az **invertálhatóság** viszont **csak** teljes oszloprang esetén áll fenn. A vizsgakérdés gyakran azt méri, tudod-e, hogy a szimmetria feltétel nélküli, az invertálhatóság (és a pozitív definitség) nem.
- **Melyik normát minimalizáljuk?** A **2-normát** (euklideszi), azaz a hibanégyzetek összegét. Ha a feladat „1-normát" vagy „maximumnormát" említ, az **más** módszer: az 1-norma (legkisebb abszolút eltérések) **robusztusabb** a kiugró pontokra, de nem deriválható és lineáris programozásra vezet; a $\infty$-norma (Csebisev / minimax) a **legnagyobb** hibát minimalizálja. Az LNM kifejezetten az L2.
- **A maradék nem nulla.** Klasszikus tévesztés azt hinni, hogy $A a^{+}=y$. Nem: $A a^{+}$ csak a **vetület**, a maradék általában pozitív. Pontos egyezés csak akkor van, ha $y$ már eleve az oszloptérben volt (pl. $N=n+1$ eset).
- **Egyértelműség.** A **vetület** $A a^{+}$ mindig egyértelmű (ortogonális vetület). Az **együtthatók** $a^{+}$ csak akkor egyértelműek, ha $A$ teljes oszloprangú (akkor $A^{T}A$ invertálható). Rangcsökkenés esetén végtelen sok együttható adná ugyanazt a vetületet.
- **Kondicionáltság — fontos numerikus csapda (saját kiegészítés).** A normálegyenletek **közvetlen** felírása rontja a numerikus stabilitást, mert
$$
\operatorname{cond}_2(A^{T}A)=\bigl(\operatorname{cond}_2(A)\bigr)^2,
$$
azaz a kondíciószám **négyzetre emelődik**. Magas fokú polinomillesztésnél a Vandermonde-mátrix amúgy is rosszul kondicionált, így $A^{T}A$ már komolyan érzékeny a kerekítési hibákra. Ezért a gyakorlatban gyakran **QR-felbontást** vagy **SVD-t** használnak a normálegyenletek helyett — ezek közvetlenül $A$-val dolgoznak, nem négyzetelik a kondíciószámot. (Ez a kapocs a „mátrixnormák / érzékenység" témához.)
- **Általánosabb, mint a polinom.** Nem csak $1, x, \dots, x^n$ bázissal működik: tetszőleges lineárisan független $\varphi_0,\dots,\varphi_n$ függvényrendszerrel ($A$ oszlopai $\varphi_j(x_i)$) ugyanez a normálegyenlet-séma áll elő (általános lineáris legkisebb négyzetek). A „polinomos" eset csak egy speciális választás.
- **A modell akkor is „lineáris", ha a görbe nem egyenes.** A módszer az **együtthatókban** lineáris ($a_j$-k szerint), nem az $x$-ben. Egy parabola illesztése ($n=2$) is lineáris legkisebb négyzetes feladat.

## 1.10 SKIP / COMPRESS

- A 19–21. dia részletes szumma-átrendezése (a $\partial F/\partial a_k$-tól a normálegyenletekig) **mechanikus** — elég tudni, hogy a deriválás a normálegyenletekre vezet, a lépéseket nem kell reprodukálni.
- A tartalomjegyzék-diák és az illusztráló ábra (pontfelhő + illesztett egyenes) tartalmilag nem vizsgaanyag; az ábra annyit mond, amit az 1.1 már leír.
- A „közgazdászok előszeretettel használják" megjegyzés kontextus, nem tételes anyag.

---

## ✅ Vizsgára fontos (a téma magja négy mondatban)

1. **Az LNM túlhatározott, teljes oszloprangú LER általánosított megoldása.** A megoldás $a^{+}=(A^{T}A)^{-1}A^{T}y$, ami ekvivalens a **Gauss-féle normálegyenletekkel** $A^{T}A\,a^{+}=A^{T}y$.
2. **Az approximációs tulajdonság:** $a^{+}$ a **2-normájú** maradékot (a hibanégyzetek összegét) minimalizálja, geometriailag $A a^{+}$ az $y$ **merőleges vetülete** az oszloptérre; a maradék merőleges az oszloptérre → innen jön a normálegyenlet.
3. **Két út, egy eredmény:** a pszeudoinverz/projekciós levezetés és a szélsőérték (parciális deriváltak nullázása) **ugyanazt** a normálegyenletet adja; a Hesse-mátrix $2A^{T}A$ pozitív definit → egyértelmű globális minimum.
4. **Finom pontok:** $A^{T}A$ **mindig** szimmetrikus, de csak teljes oszloprangnál invertálható/pozitív definit; az illesztett egyenes mindig átmegy az $(\bar x,\bar y)$ átlagponton; a normálegyenletek kondíciószáma $\operatorname{cond}(A)^2$, ezért numerikusan a QR/SVD megbízhatóbb.

---

## 🧪 Önellenőrző kérdések (vizsgastílus, A/B/C/D)

**1.** Mikor esik egybe a legkisebb négyzetes közelítés az interpolációval?
- A) Soha, mert az LNM mindig hagy hibát.
- B) Ha $N = n+1$ és az alappontok különbözőek.
- C) Ha minden $y_i = 0$.
- D) Ha $A^{T}A$ diagonális.

**Helyes: B.** Ekkor $A$ négyzetes és (Vandermonde lévén) invertálható, a rendszer pontosan megoldható, a maradék nulla — a közelítés átmegy minden ponton.

**2.** Melyik állítás igaz az $A^{T}A$ mátrixra **minden** $A$-ra, a rangtól függetlenül?
- A) Invertálható.
- B) Pozitív definit.
- C) Szimmetrikus.
- D) Diagonális.

**Helyes: C.** A szimmetria feltétel nélkül fennáll. Az invertálhatóság és a pozitív definitség csak teljes oszloprang mellett igaz.

**3.** Mit garantál az approximációs tulajdonság az $a^{+}=A^{+}y$ megoldásra?
- A) $A a^{+}=y$ pontosan teljesül.
- B) $\lVert A a^{+}-y\rVert_2$ minimális minden $a\in\mathbb{R}^{n+1}$ között.
- C) $a^{+}$ a maradék **1-normáját** minimalizálja.
- D) $a^{+}$ maximalizálja az $y$ és az oszloptér távolságát.

**Helyes: B.** Az $a^{+}$ a **2-normájú** maradékot (négyzetösszeget) minimalizálja, nem teszi nullává, és nem az 1-normát illeti.

**4.** Geometriailag mi az $A a^{+}$ vektor?
- A) Az $y$ tükörképe az oszloptérre.
- B) Az $y$ merőleges vetülete $A$ oszlopterére.
- C) Az $y$ egységvektorra normáltja.
- D) Maga a maradékvektor.

**Helyes: B.** A maradék merőleges az oszloptérre ($A^{T}(y-A a^{+})=0$), ami épp a normálegyenlet; így $A a^{+}$ az $y$ ortogonális vetülete $\mathcal{R}(A)$-ra.

**5.** Miért problémás numerikusan közvetlenül felírni és megoldani a normálegyenleteket ($A^{T}A$)?
- A) Mert $A^{T}A$ sosem szimmetrikus.
- B) Mert $\operatorname{cond}(A^{T}A)=\operatorname{cond}(A)^2$, a kondíciószám négyzetre emelődik.
- C) Mert $A^{T}A$ mindig szinguláris.
- D) Mert a megoldás soha nem egyértelmű.

**Helyes: B.** A kondíciószám négyzetelődik, így a megoldás érzékenyebb a kerekítési hibákra; ezért gyakran QR-felbontást vagy SVD-t használnak helyette.

**6. (bónusz csapda).** A legkisebb négyzetes illesztésű egyenes ($n=1$) melyik ponton megy át **mindig**?
- A) Az origón.
- B) Az $(\bar x,\bar y)$ átlagponton.
- C) Az első és utolsó adatpont felezőpontján.
- D) A legnagyobb $y$-értékű ponton.

**Helyes: B.** A normálegyenletek első sora $N$-nel osztva épp $a_0+a_1\bar x=\bar y$, azaz $p_1(\bar x)=\bar y$.

---

## Mit nézzünk meg mélyebben?

Szólj, melyik irányba menjünk tovább — pár lehetőség, ami vizsgán a leggyakrabban csapda:

- **a) Approximációs tulajdonság bizonyítása** (a merőleges vetület + Pitagorasz-érv, miért épp a normálegyenlet ad minimumot),
- **b) Általánosított inverz részletesebben** (Moore–Penrose feltételek; bal vs. jobb inverz; túlhatározott vs. alulhatározott eset),
- **c) Kondicionáltság / numerikus stabilitás** (miért rossz $A^{T}A$, és hogyan segít a QR/SVD) — ez köti össze a témát a „mátrixnormák, érzékenység" anyaggal,
- **d) Interpoláció vs. approximáció** összevont táblázat és tipikus tévesztések, ha az interpoláció témakör is jön a vizsgán,
- **e) Még több gyakorló A/B/C/D** kifejezetten a finom megkülönböztetésekre.
