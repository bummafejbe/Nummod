# Numerikus módszerek C — 3. előadás vizsgafelkészítő
## A Gauss-elimináció alkalmazásai és az LU-felbontás

---

### Mit fed le ez a PDF?

Ez a tananyag **kizárólag a kurzus 2. témakörébe** tartozik: *lineáris egyenletrendszerek (LER) direkt megoldási módszerei*, ezen belül a **Gauss-elimináció (GE) alkalmazásai** (determináns, inverz, több jobb oldal), a **műveletigény**, a **háromszögmátrixok** elmélete, és ennek csúcspontjaként az **LU-felbontás**. Érinti még a **főelemkiválasztást** (ez a stabilitás/numerikus pontosság témához kapcsolódik). **Nem** tartalmaz mátrixnorma-, kondíciószám-, nemlineáris egyenlet-, interpolációs vagy integrálási anyagot — azok más előadások.

A vizsgád elméleti és fogalmi, ezért a hangsúly végig azon van, hogy **mit állít egy tétel, milyen feltétel mellett, és mi a finom különbség** a hasonló dolgok között — nem a számoláson.

---

## 1. téma — A Gauss-elimináció alkalmazásai

### 🟩 CORE — a központi gondolatok

A GE-t eredetileg LER megoldására tanultad, de a *felső háromszög alakra hozás* önmagában is sok mindenre jó. A trükk mindenhol ugyanaz: **egyetlen eliminációval** egyszerre több feladatot is elintézünk.

**(a) Determináns.** A GE elimináló lépése — „egy sor konstansszorosát hozzáadom egy másik sorhoz" — **determináns-tartó**. Ezért amikor `A`-t felső háromszög alakra (`Δ`-alak) hozzuk, a determináns nem változik, a háromszögmátrix determinánsa pedig az átló szorzata:

$$\det(A) = \det(\Delta\text{-alak}) = \prod_{k=1}^{n} a_{kk}^{(k-1)},$$

ahol az $a_{kk}^{(k-1)}$ értékek a **főelemek (pivotok)**, vagyis az elimináció során az átlóra kerülő számok. Ez a megfogalmazás kulcsfontosságú: a determináns *a pivotok szorzata*.

> **Miért tartó az elimináló lépés?** Az „add hozzá az egyik sor konstansszorosát egy másikhoz" elemi műveletet egy olyan elemi mátrixszal való szorzás írja le, amelynek determinánsa pontosan 1. Ezért a determináns értéke nem mozdul. *(Saját kiegészítés a háttér megértéséhez — a dia ezt nem mondja ki.)*

**(b) Inverz.** Az inverz keresése az $A\cdot X = I$ **mátrixegyenlet** megoldása. Oszloponként szétbontva ez `n` darab egyenletrendszer:

$$A x_1 = e_1,\quad A x_2 = e_2,\quad \dots,\quad A x_n = e_n,$$

ahol $e_j$ a `j`-edik egységvektor. Mivel a bal oldali mátrix mindegyiknél ugyanaz az `A`, kibővítjük az `A`-t az egységmátrixszal, és **egyszerre** dolgozunk:

$$[\,A \mid I\,] \;\xrightarrow{\text{GE + visszahelyettesítés}}\; [\,I \mid A^{-1}\,].$$

A jobb oldalon a végén megjelenik az inverz. **A lényeg, hogy a teljes inverz egyetlen elimináció árán előáll**, nem kell `n`-szer külön számolni.

**(c) Több jobb oldal.** Ugyanez a gondolat: ha sok `b`-re kell megoldani $Ax=b$-t ugyanazzal az `A`-val, akkor `[A | b₁ | b₂ | b₃]` formában együtt visszük át a GE-n, és csak egyszer eliminálunk. Ez vezet majd át természetesen az LU-felbontás motivációjához (5. téma).

### 🟧 NUANCE — vizsgacsapdák

- **Sor- vagy oszlopcsere megváltoztatja a determinánst!** Az elimináló lépés tartó, de **minden sorcsere `(−1)`-szeresére változtatja a determinánst** (oszlopcsere ugyanígy). Tehát ha főelemkiválasztással dolgozol, a végén a pivotok szorzatát meg kell szorozni `(−1)`-nel a cserék számának megfelelő hatványra. Klasszikus „igaz, kivéve ha…" csapda: *„a GE megőrzi a determinánst" — igaz az elimináló lépésekre, de nem a cserékre.*
- **Inverz és cserék:** a dia kifejezetten kiemeli — **sorcsere esetén a kapott inverz nem változik** (ugyanazt a permutációt alkalmazod mindkét oldalon, ezért „helyrejön"), **oszlopcsere esetén viszont változik** (lényegében egy permutált mátrix inverzét kapod, vissza kell rendezni). Könnyű összekeverni a kettő hatását.
- A determináns képletében a felső index `(k−1)` nem véletlen: ez azt jelöli, hogy az `a_{kk}` értéket a `k−1`-edik elimináló lépés *után* nézzük, nem az eredeti mátrixból. A pivot a már részben eliminált mátrix átlóeleme.

### ✅ Vizsgára fontos
1. `det(A)` = **a pivotok (átlóra kerülő főelemek) szorzata**, mert az elimináló lépések determináns-tartók.
2. **Sor-/oszlopcsere `(−1)`-gyel szorozza** a determinánst — erre külön figyelni kell.
3. Inverz: `[A | I] → [I | A⁻¹]`; **sorcsere nem rontja el az inverzt, oszlopcsere igen**.
4. Az inverz és a több jobb oldal ugyanannak a gondolatnak két arca: *egy elimináció, sok megoldás.*

---

## 2. téma — Műveletigény

### 🟩 CORE

A vizsga szempontjából itt **két szám és egy fogalom** számít.

**A Gauss-elimináció műveletigénye:**

$$\frac{2}{3} n^3 + \mathcal{O}(n^2).$$

Ez a **köbös** ($n^3$) nagyságrend a legfontosabb üzenet: a GE drága, és a költség gyakorlatilag teljes egészében az **eliminációból** (a háromszög alakra hozásból) jön.

**A visszahelyettesítés (felső háromszögmátrixú LER megoldása) műveletigénye:**

$$n^2 + \mathcal{O}(n).$$

Ez **négyzetes**. Vagyis miután már megvan a háromszög alak, a megoldás kiolvasása nagyságrendekkel olcsóbb, mint maga az elimináció volt. Ez a megfigyelés az LU-felbontás egész hasznának az alapja (lásd 5. téma): ha a drága köbös munkát egyszer elvégezzük, utána minden további megoldás már „csak" négyzetes.

**Az $\mathcal{O}(n^2)$ definíciója.** Egy `f(n)` függvény $\mathcal{O}(n^2)$ nagyságrendű, ha az $\dfrac{f(n)}{n^2}$ hányados **korlátos** minden `n`-re. Szemléletesen: `f` legfeljebb konstansszor `n²` ütemben nő.

### 🟧 NUANCE

- Ne keverd: **GE → köbös, visszahelyettesítés → négyzetes.** A tipikus csapda az, hogy mindkettőt $n^3$-nek vagy mindkettőt $n^2$-nek mondják.
- A vezető együttható is számíthat: a GE-é `2/3`, a visszahelyettesítésé `1` (azaz $n^2$). Egy mátrix-vektor szorzás ezzel szemben $2n^2 + \mathcal{O}(n)$ — vagyis egyetlen szorzás már önmagában nagyságrendileg annyiba kerül, mint egy teljes visszahelyettesítés.
- Az $\mathcal{O}$-jelölés *felső* korlát nagyságrendre. A „korlátos hányados" definíciót érdemes pontosan tudni, mert szó szerinti formában is megkérdezhető.

### 🟨 SKIP/COMPRESS
A dia részletes összegzéssel ($\sum (n-k)(2(n-k)+3)$ kibontása) vezeti le a `2/3 n³`-öt. **A levezetést nem kell fejből tudni** — az eredmény (a `2/3 n³` és az `n²`) és a *köbös vs. négyzetes* viszony a lényeg.

### ✅ Vizsgára fontos
1. **GE: $\frac{2}{3}n^3 + \mathcal{O}(n^2)$ (köbös).**
2. **Visszahelyettesítés: $n^2 + \mathcal{O}(n)$ (négyzetes).**
3. $\mathcal{O}(n^2)$ pontos definíciója: $f(n)/n^2$ korlátos.

---

## 3. téma — A GE mátrixos alakja (alsó háromszögmátrixok)

Ez a téma adja meg az **elméleti nyelvet**, amin az LU-felbontást ki lehet mondani. Érdemes alaposan érteni, mert sok finom állítás épül rá.

### 🟩 CORE

**Balról szorzás = sorművelet.** Ha `A`-t **balról** szorozzuk egy speciális alsó háromszögmátrixszal, az pontosan egy elimináló lépést hajt végre. Például az a mátrix, amelynek az átlójában csupa `1` áll, és a `(2,1)` pozícióban egy `2`, az „**az 1. sor kétszeresét hozzáadja a 2. sorhoz**". Ha a teljes első oszlopba beírjuk a megfelelő szorzókat, megkapjuk a GE teljes első lépését egyetlen szorzással.

**Az $L_k$ mátrix (a GE `k`-adik lépése).** Definiáljuk:

$$L_k = I - \ell_k e_k^\top, \qquad \ell_k = (0,\dots,0,\, l_{k+1,k},\dots,l_{n,k})^\top,$$

ahol a **szorzók** (a GE-s hányadosok):

$$l_{ik} = \frac{a_{ik}^{(k-1)}}{a_{kk}^{(k-1)}} \quad (i = k+1,\dots,n).$$

Az $\ell_k$ vektor első `k` eleme nulla, alatta állnak a `k`-adik oszlop szorzói. Ezzel $L_k \cdot A^{(k-1)} = A^{(k)}$, azaz **az $L_k$-val balról szorzás éppen a GE `k`-adik lépése**.

**$L_k$ inverze — egyszerű előjelváltás.**

$$L_k^{-1} = I + \ell_k e_k^\top.$$

Vagyis az inverzet úgy kapod, hogy az átló alatti szorzók **előjelét megfordítod**. Ez azért igaz, mert a szorzatban a „keresztezett" tag tartalmazza az $e_k^\top \ell_k$ szorzatot, ami **nulla** ($\ell_k$-nak a `k`-adik komponense 0, márpedig $e_k^\top$ pont azt emelné ki). *Intuíció: ha egy lépésben „levontam a 2. sorból az 1. sor kétszeresét", akkor a visszacsinálás egyszerűen „hozzáadom" — ezért csak az előjel fordul.*

**Az $L_k^{-1}$-ek szorzata — szuperpozíció.**

$$L_1^{-1} L_2^{-1} \cdots L_{n-1}^{-1} = I + \ell_1 e_1^\top + \ell_2 e_2^\top + \dots + \ell_{n-1} e_{n-1}^\top.$$

Ez a téma **legfontosabb gyakorlati következménye**: a vegyes (kereszt-) tagok mind kiesnek, mert $e_i^\top \ell_j = 0$, valahányszor $i \le j$. Emiatt a szorzatmátrixot **nem kell ténylegesen kiszorozni** — egyszerűen az egységmátrix oszlopaiba, az egyesek alá beírjuk a megfelelő $\ell_k$ szorzóvektorokat. Ez lesz majd az `L` mátrix az LU-felbontásban, és **a GE-n felül nulla többletmunkába kerül**.

### 🟧 NUANCE — vizsgacsapdák

- **A sorrend számít!** A szépen összeálló szuperpozíció csak a *helyes* sorrendben ($L_1^{-1} L_2^{-1} \cdots$, ahogy az $A = L_1^{-1}\cdots L_{n-1}^{-1} U$ képletből adódik) működik. Fordított sorrendben a keresztezett tagok **már nem esnek ki** — a dián látható példában éppen ezért bukkan fel a „7"-es a bal alsó sarokban. Tipikus csapda: *„két ilyen mátrix bármilyen sorrendben szépen szorzódik" — HAMIS.*
- Az inverz „csak előjelváltás" szabály **az egyetlen $L_k$-ra** igaz. Ne keverd össze az $L_k^{-1}$-ek szorzatára vonatkozó szabállyal (ott a szorzók a megfelelő oszlopokba kerülnek, szintén előjelfordítás nélkül a végösszegben — mert ott már az inverzek vektorai vannak).
- Az $\ell_k$ vektorban az első `k` komponens **nulla** — ez a feltétel ($(\ell_k)_i = 0$, ha $i \le k$) garantálja az összes szép tulajdonságot.

### ✅ Vizsgára fontos
1. **A GE `k`-adik lépése = balról szorzás $L_k = I - \ell_k e_k^\top$-val.**
2. **$L_k^{-1} = I + \ell_k e_k^\top$** — csak az átló alatti szorzók előjele fordul.
3. **$\prod L_k^{-1} = I + \sum \ell_k e_k^\top$** — a kereszttagok kiesnek, ezért `L`-et szorzás nélkül, a szorzók beírásával kapjuk.
4. **A sorrend lényeges**: csak a helyes sorrendben áll össze szépen a szorzat.

---

## 4. téma — Háromszögmátrixokról

### 🟩 CORE — definíciók

- **Alsó háromszögmátrix** ($L$): a **főátló felett** csupa nulla, azaz $l_{ij} = 0$, ha $i < j$.
- **Felső háromszögmátrix** ($U$): a **főátló alatt** csupa nulla, azaz $u_{ij} = 0$, ha $i > j$.
- **Egységháromszög (unit) mátrixok**: $\mathcal{L}_1$ és $\mathcal{U}_1$ azok, amelyeknek a **főátlójában csupa `1`** áll.

Jelölés: $\mathcal{L}, \mathcal{U}$ az alsó/felső háromszögmátrixok halmaza, $\mathcal{L}_1, \mathcal{U}_1$ az egységátlójúaké.

**Zártsági (closure) tulajdonságok** — ezek a tipikus igaz/hamis kérdések alanyai:

| Állítás | Igaz? | Miért |
|---|---|---|
| Két alsó háromszög szorzata alsó háromszög | ✔ | A szerkezet megmarad szorzásnál |
| Két felső háromszög szorzata felső háromszög | ✔ | ugyanígy |
| Két **egység**-alsó szorzata **egység**-alsó | ✔ | az átlón `1·1 = 1` |
| Két **egység**-felső szorzata **egység**-felső | ✔ | ugyanígy |
| Invertálható alsó háromszög inverze alsó háromszög | ✔ | a szerkezet öröklődik |
| Invertálható felső háromszög inverze felső háromszög | ✔ | ugyanígy |
| **Egység**-alsó háromszögnek **mindig** van inverze, és az is egység-alsó | ✔ | $\det = 1 \ne 0$ |
| **Egység**-felső háromszögnek **mindig** van inverze, és az is egység-felső | ✔ | $\det = 1 \ne 0$ |

### 🟧 NUANCE — vizsgacsapdák

- **Mikor invertálható egy háromszögmátrix?** Pontosan akkor, ha az **átlójában nincs nulla** (mert a determináns az átló szorzata). Az *egység* háromszögmátrix tehát **mindig** invertálható (átlója csupa 1), de egy *általános* háromszögmátrix nem feltétlenül. Klasszikus csapda: *„minden háromszögmátrix invertálható" — HAMIS; csak ha az átlóban nincs nulla.*
- Figyeld a definíció irányát: **alsó** = nulla a főátló **felett** ($i<j$); **felső** = nulla a főátló **alatt** ($i>j$). Könnyű felcserélni.
- Az inverzre vonatkozó állítások közül az **egységháromszög**re szól a legerősebb: ott a *létezést is állítjuk* (nem kell feltenni), míg általános háromszögnél a létezést fel kell tételezni.

### ✅ Vizsgára fontos
1. **Alsó:** nulla a főátló felett ($i<j$); **felső:** nulla a főátló alatt ($i>j$).
2. A háromszögmátrixok **zártak** szorzásra és (invertálható esetben) inverzképzésre — a típus öröklődik.
3. **Egységháromszög mindig invertálható**, és inverze ugyanolyan típusú; általános háromszög csak akkor, ha az átlóban nincs nulla.

---

## 5. téma — LU-felbontás (a központi téma)

### 🟩 CORE — mi az, és honnan jön

**Definíció.** Az `A` mátrix **LU-felbontása** az $A = L\cdot U$ szorzat, ahol

$$L \in \mathcal{L}_1 \;(\text{egység-alsó háromszög}), \qquad U \in \mathcal{U} \;(\text{felső háromszög}).$$

Vagyis `L` átlójában csupa `1` áll (ezt rögzítjük konvencióként), `U` pedig hordozza a pivotokat. *(Megjegyzés saját kiegészítésként: ez a Doolittle-konvenció. Létezik olyan változat is, ahol `U` az egységátlójú — ekkor más a felosztás. A vizsgán a fenti, `L`-egységátlójú konvenciót használjátok.)*

**Honnan jön?** Pontosan a 3. témából. A GE-t felírva $L_{n-1}\cdots L_2 L_1 A = U$, majd az inverzekkel átszorozva:

$$A = \underbrace{L_1^{-1} L_2^{-1} \cdots L_{n-1}^{-1}}_{=\,L}\, U = LU.$$

És mivel az $L_k^{-1}$-ek szorzata éppen a szorzók beírásával áll elő (3. téma), **az `L` mátrixot ingyen, a GE melléktermékeként** megkapjuk: az átló alatti `(i,j)` helyre a $l_{ij}$ GE-s hányados kerül, az átlóra `1`. A „tömör írásmód" pont ezt csinálja: az eliminált (nullává tett) pozíciókon **tároljuk** a szorzókat — éppen annyi hely van, ahány nullát csináltunk.

Összefoglaló képletek:

$$L \in \mathcal{L}_1,\quad l_{ij} = \frac{a_{ij}^{(j-1)}}{a_{jj}^{(j-1)}}\ (i>j); \qquad U \in \mathcal{U},\quad u_{ij} = a_{ij}^{(i-1)}\ (i \le j).$$

Speciálisan **`U` átlója = a pivotok**: $u_{kk} = a_{kk}^{(k-1)}$.

### 🟩 CORE — létezés és egyértelműség

**Létezési tétel (pivotokkal).** Ha a GE **sor- és oszlopcsere nélkül** végrehajtható, azaz

$$a_{kk}^{(k-1)} \ne 0 \quad (k = 1, \dots, n-1),$$

akkor `A`-nak **létezik** LU-felbontása. *(Az indoklás: ekkor minden $L_k$ felírható, és `L`, `U` előáll.)*

**Létezés + egyértelműség (főminorokkal).** A **főminorok** (vezető főminorok) a bal felső `k×k` részmátrixok determinánsai:

$$D_k = \det\!\begin{pmatrix} a_{11} & \cdots & a_{1k}\\ \vdots & & \vdots\\ a_{k1} & \cdots & a_{kk}\end{pmatrix}.$$

- Ha $D_k \ne 0$ minden $k = 1, \dots, n-1$-re, akkor **létezik** az LU-felbontás, és $u_{kk} \ne 0$ ($k=1,\dots,n-1$).
- Ha ráadásul $\det(A) \ne 0$, akkor a felbontás **egyértelmű**.

A kulcsösszefüggés: $D_k = a_{11}\cdot a_{22}^{(1)} \cdots a_{kk}^{(k-1)}$, vagyis **a `k`-adik főminor = az első `k` pivot szorzata**. Ezért egyenértékű a „$D_k \ne 0$" és az „$a_{kk}^{(k-1)} \ne 0$" feltétel.

**Az egyértelműség bizonyításának ötlete** (érdemes érteni a logikáját): tegyük fel, hogy $A = L_1 U_1 = L_2 U_2$ két felbontás. Átrendezve $U_1 U_2^{-1} = L_1^{-1} L_2$. A bal oldal **felső** háromszög, a jobb oldal **egységátlójú alsó** háromszög. Egy mátrix csak akkor lehet egyszerre mindkettő, ha az **egységmátrix**. Tehát $U_1 = U_2$ és $L_1 = L_2$ — vagyis a felbontás egyértelmű.

### 🟩 CORE — miért jó az LU-felbontás?

Ez a „minek az egész?" kérdés, és gyakran kérdezik. Tegyük fel, hogy megvan $A = LU$. Akkor az $Ax = b$ megoldása így megy:

1. **Oldd meg $Ly = b$-t** (alsó háromszögű rendszer, *előrehelyettesítés*) — költség: $n^2 + \mathcal{O}(n)$.
2. **Oldd meg $Ux = y$-t** (felső háromszögű rendszer, *visszahelyettesítés*) — költség: $n^2 + \mathcal{O}(n)$.

Mindkét lépés **csak négyzetes**. Maga a felbontás előállítása ugyan a teljes köbös munka, $\frac{2}{3}n^3 + \mathcal{O}(n^2)$, **de azt csak egyszer kell elvégezni**. Utána minden új `b`-re a megoldás már csak $\mathcal{O}(n^2)$.

**Ezért előnyös, ha ugyanazzal az `A`-val sokszor kell megoldani** különböző jobb oldalakra. (Összevetésül: egyetlen mátrix-vektor szorzás is $2n^2 + \mathcal{O}(n)$, tehát a két háromszög-megoldás együtt nagyjából egy mátrixszorzásnyiba kerül.)

### 🟧 NUANCE — a legkomolyabb vizsgacsapdák itt vannak

- **Hány feltétel kell az LU létezéséhez? `n−1`, NEM `n`!** Csak $a_{kk}^{(k-1)} \ne 0$ a $k = 1,\dots,n-1$ indexekre kell (ekvivalensen $D_1,\dots,D_{n-1} \ne 0$). **Az utolsó pivot ($a_{nn}^{(n-1)}$), illetve $D_n = \det(A)$ NEM kell az LU-felbontás létezéséhez** — csak a LER egyértelmű megoldhatóságához. Ez a legklasszikusabb csapda: összekeverni a felbontás létezésének feltételét a rendszer megoldhatóságának feltételével.
- **Az utolsó pivot a determinánssal kapcsolatos:** $a_{nn}^{(n-1)} \ne 0 \iff \det(A) = D_n \ne 0$. Ha tehát a GE végrehajtható, de történetesen $a_{nn}^{(n-1)} = 0$, akkor **az LU-felbontás létezik**, viszont $\det(A) = \det(U) = 0$ (mert $\det(L) = 1$, és `U` átlójában van egy nulla, az $u_{nn}$). Ebben az esetben a LER **vagy nem oldható meg, vagy nem egyértelműen**.
- **Egyértelműséghez `det(A) ≠ 0` kell.** Szinguláris mátrixnak lehet LU-felbontása, de nem feltétlenül egyértelmű. A „létezik" és az „egyértelmű" két külön feltétel — ne mosd össze.
- **Melyik tényező az egységátlójú?** A konvenció szerint **`L`** az egységátlójú ($\in \mathcal{L}_1$), `U` hordozza a pivotokat. Ha valaki azt állítja, hogy „U átlójában csupa 1 van", az ebben a konvencióban **hamis**.
- **Az LU NEM gyorsít egyetlen megoldáson.** Egyetlen $Ax=b$-re az LU (felbontás + két háromszög-megoldás) összköltsége nagyságrendileg ugyanaz, mint a sima GE — mindkettő köbös. A nyereség **csak akkor jelentkezik, ha ugyanazt az `A`-t újra meg újra használod** más `b`-kkel. Csapda: *„az LU mindig gyorsabb, mint a GE" — pontatlan.*
- **`U` átlója = a pivotok**, és $D_k$ = az első `k` pivot szorzata — ezt a két azonosságot sokféle köntösben kérdezhetik.

### 🟨 SKIP/COMPRESS
A konkrét `3×3`-as példa ($A = \begin{psmallmatrix}2&0&3\\-4&5&-2\\6&-5&4\end{psmallmatrix}$) számolós levezetése, a Matlab-os futásidő-mérések, és az induktív bizonyítás lépésről lépésre **nem önállóan vizsgaanyag** — csak annyiban, amennyiben a fenti fogalmakat illusztrálják. A példából azt érdemes elvinni, hogy `L`-be a GE-s szorzók kerülnek (a példában `−2, 3, −1`), `U`-ba pedig a pivotok (`2, 5, −1`).

### ✅ Vizsgára fontos
1. **$A = LU$**, ahol **`L` egységátlójú alsó**, **`U` felső** háromszög; `U` átlója = a **pivotok**.
2. **Létezés: $a_{kk}^{(k-1)} \ne 0$ csak `k=1..n−1`-re** (ekvivalensen $D_1,\dots,D_{n-1}\ne 0$). Az utolsó pivot / `det(A)` **nem** kell a létezéshez.
3. **Egyértelműség: $\det(A) \ne 0$.** Az utolsó pivot $\iff \det(A)$ kapcsolat: $a_{nn}^{(n-1)}\ne 0 \iff \det(A)\ne 0$.
4. **Haszna: sok jobb oldal, ugyanaz az `A`** — a köbös felbontást egyszer fizeted, utána minden megoldás csak $\mathcal{O}(n^2)$.

---

## Kiegészítő téma — Főelemkiválasztás (pivotálás)

A dia több helyen is felbukkan vele (11–14. fólia), és a *numerikus stabilitás* témához kapcsolódik, ezért külön kezelem.

### 🟩 CORE

**Miért van rá szükség?** Két baj léphet fel:
1. **Nulla pivot:** ha az átlóra `0` kerülne, nem tudunk vele osztani — a GE elakad. Dia-példa: $\begin{psmallmatrix}0&1\\1&0\end{psmallmatrix} x = \begin{psmallmatrix}2\\3\end{psmallmatrix}$, itt az `(1,1)` elem `0`, csere nélkül nem megy.
2. **Kicsi pivot:** ha a pivot nem nulla, de nagyon kicsi, a vele való osztás **felnagyítja a kerekítési hibákat** → numerikus instabilitás.

A megoldás mindkettőre a **főelemkiválasztás**: cserékkel a lehető legnagyobb abszolútértékű elemet hozzuk pivotpozícióba. A dia szavaival: *„Biztos és stabil megoldás a főelemkiválasztás."*

**Részleges főelemkiválasztás.** A `k`-adik lépésben a `k`-adik **oszlopon belül** (a `k`-adik és az alatti sorokban) keressük a legnagyobb $|a_{mk}^{(k-1)}|$ elemet, és a `k`-adik sort kicseréljük az `m`-edikkel. **Csak sorcsere.**

**Teljes főelemkiválasztás.** A `k`-adik lépésben a teljes **megmaradt részmátrixban** keressük a legnagyobb abszolútértékű $|a_{m_1 m_2}^{(k-1)}|$ elemet, és **sort ÉS oszlopot is** cserélünk. Stabilabb, de drágább, és az oszlopcsere miatt a megoldás komponenseit vissza kell rendezni.

**Elvégezhetőségi tétel.** A GE sor- és oszlopcsere nélkül elvégezhető $\iff a_{kk}^{(k-1)} \ne 0$ minden $k=1,\dots,n-1$-re. *(Ez közvetlenül a rekurzióból adódik: ha minden pivot nemnulla, mindig tudunk osztani.)* És láttuk: ez ekvivalens a $D_k \ne 0$ ($k=1,\dots,n-1$) főminor-feltétellel.

### 🟧 NUANCE

- **Sorcsere vs. oszlopcsere a megoldásra:**
  - **Sorcsere → a megoldás NEM változik** (csak az egyenletek sorrendjét cseréled).
  - **Oszlopcsere → a megoldás komponensei a cserének megfelelően átrendeződnek** (mert az ismeretlenek sorrendjét cseréled) — vissza kell „fejteni".
- **Sor-/oszlopcsere vs. determináns:** ahogy az 1. témánál — minden csere `(−1)`-szerező hatású a determinánsra, akkor is, ha a megoldásra nincs (sorcsere) vagy átrendező (oszlopcsere) hatása. Tehát a *megoldásra* és a *determinánsra* gyakorolt hatás külön kérdés!
- **Részleges ⊂ teljes stabilitás, de fordított a költség:** a teljes pivotálás stabilabb, de jóval költségesebb (a teljes részmátrixban keres maximumot minden lépésben). A gyakorlatban általában a részleges főelemkiválasztás a sztenderd.
- A főelemkiválasztás **numerikus** okból ajánlott akkor is, ha a pivot nem pont nulla — a kisebb szorzók pontosabb hányadosokat adnak. Ez nem a megoldhatóságról, hanem a *pontosságról* szól.

### ✅ Vizsgára fontos
1. **Részleges** = legnagyobb elem az **oszlopban**, csak **sorcsere**; **teljes** = legnagyobb a **részmátrixban**, **sor- és oszlopcsere**.
2. **Sorcsere nem változtatja a megoldást; oszlopcsere átrendezi a komponenseit.** (De mindkettő `(−1)`-szerezi a determinánst.)
3. GE csere nélkül elvégezhető $\iff$ minden pivot ($k=1..n-1$) nemnulla $\iff D_1,\dots,D_{n-1}\ne 0$.
4. A pivotálás **stabilitási/pontossági** eszköz (kicsi pivot = felnagyított hiba).

---

## 🎯 Önellenőrző kérdések (vizsgastílus, A/B/C/D)

> A finom megkülönböztetésekre lőttem be őket — pont az ilyenek a csapdák.

**1.** Egy `A` mátrixon Gauss-eliminációt végzünk, és közben **két sorcserét** alkalmazunk főelemkiválasztáshoz. A háromszög alak átlóelemeinek (pivotok) szorzata `P`. Mennyi `det(A)`?

- A) `P`
- B) `−P`
- C) `P`, mert a GE minden lépése determináns-tartó
- D) `0`, mert a sorcsere tönkreteszi a determinánst

<details><summary>Megoldás</summary>

**A).** Két sorcsere hatása $(-1)^2 = +1$, tehát `det(A) = (−1)² · P = P`. A C) azért rossz, mert *nem* minden lépés tartó — a sorcsere nem az; itt csak véletlenül (páros számú csere miatt) jön ki ugyanaz az érték. A B) páratlan számú cserére lenne igaz.
</details>

---

**2.** Melyik feltétel **elegendő** ahhoz, hogy az `A ∈ ℝⁿˣⁿ` mátrixnak **létezzen** LU-felbontása (`L` egységátlójú)?

- A) $\det(A) \ne 0$
- B) $D_k \ne 0$ minden $k = 1, \dots, n$-re
- C) $D_k \ne 0$ minden $k = 1, \dots, n-1$-re
- D) `A` szimmetrikus

<details><summary>Megoldás</summary>

**C).** Az LU létezéséhez csak az **első `n−1`** vezető főminor nemnullasága kell (ekvivalensen az első `n−1` pivot). Az A) és B) az utolsó főminort / determinánst is megköveteli, ami a *megoldhatósághoz* és az *egyértelműséghez* kell, nem a puszta létezéshez. (Sőt: szinguláris mátrixnak is lehet LU-felbontása.) A D) irreleváns.
</details>

---

**3.** A GE-t mátrixszorzással felírva $L_k = I - \ell_k e_k^\top$. Mi igaz?

- A) $L_k^{-1} = I - \ell_k e_k^\top$ (önmaga inverze)
- B) $L_k^{-1} = I + \ell_k e_k^\top$, és az $L_k^{-1}$-ek **tetszőleges** sorrendben szépen, kereszttagok nélkül szorzódnak
- C) $L_k^{-1} = I + \ell_k e_k^\top$, de a kereszttagok csak a **helyes** ($L_1^{-1} L_2^{-1} \cdots$) sorrendben esnek ki
- D) $L_k$ felső háromszögmátrix

<details><summary>Megoldás</summary>

**C).** Az inverz tényleg csak előjelváltás ($+\ell_k e_k^\top$), de a szuperpozíció (kereszttagok kiesése) **a sorrendtől függ** — fordított sorrendben megjelennek extra tagok. A B) épp ezen a ponton hibázik. Az A) hamis (az inverz az ellentétes előjelű), a D) is ($L_k$ *alsó* háromszög).
</details>

---

**4.** A GE és a visszahelyettesítés műveletigényéről melyik **igaz**?

- A) Mindkettő $\mathcal{O}(n^3)$
- B) GE $\sim \frac{2}{3}n^3$, visszahelyettesítés $\sim n^2$
- C) GE $\sim n^2$, visszahelyettesítés $\sim \frac{2}{3}n^3$
- D) GE $\sim n^3$, visszahelyettesítés $\sim n^3$, ezért az LU sosem éri meg

<details><summary>Megoldás</summary>

**B).** A GE **köbös** ($\frac{2}{3}n^3 + \mathcal{O}(n^2)$), a háromszög-megoldás **négyzetes** ($n^2 + \mathcal{O}(n)$). Pont ez a különbség az LU-felbontás haszna: a drága köbös munkát egyszer végezzük el, utána minden megoldás négyzetes. A D) ezért is rossz.
</details>

---

**5.** A GE az `A` mátrixon csere nélkül végrehajtható, de kiderül, hogy az **utolsó** pivot $a_{nn}^{(n-1)} = 0$. Mi következik?

- A) Az LU-felbontás nem létezik
- B) Létezik LU-felbontás, és `A` invertálható
- C) Létezik LU-felbontás, de $\det(A) = 0$, így a LER vagy megoldhatatlan, vagy nem egyértelmű
- D) A GE nem is lett volna végrehajtható

<details><summary>Megoldás</summary>

**C).** Az LU létezéséhez csak az első `n−1` pivot kell, így a felbontás **létezik** az utolsó pivot nullasága ellenére is. De $\det(A) = \det(U) = \prod u_{kk}$, és $u_{nn} = a_{nn}^{(n-1)} = 0$, ezért $\det(A) = 0$ — `A` szinguláris, a rendszer nem oldható meg egyértelműen. A B) ezt téveszti el, az A) és D) az LU létezését / a GE elvégezhetőségét tagadja tévesen.
</details>

---

**6.** *(Bónusz, finom megkülönböztetés.)* Az $[A \mid I] \to [I \mid A^{-1}]$ eljárás során **oszlopcserét** is végeztünk. Mi igaz a jobb oldalon kapott mátrixra?

- A) Pontosan $A^{-1}$, az oszlopcsere nem számít
- B) Nem $A^{-1}$ közvetlenül — a cseréknek megfelelően vissza kell rendezni
- C) Mindig $0$
- D) Az `A` transzponáltja

<details><summary>Megoldás</summary>

**B).** A dia kifejezetten kiemeli: **sorcsere esetén az inverz nem változik, oszlopcsere esetén igen.** Oszlopcserénél lényegében egy permutált mátrix inverzét kapjuk, ezért vissza kell rendezni a cseréknek megfelelően.
</details>

---

## Min menjünk mélyebbre?

Mondd meg, melyik irányba vigyem tovább — például:

- **Az LU létezés/egyértelműség tételei** köré több „igaz, kivéve…" típusú kérdést gyártsak (ez tűnik a leggazdagabb csapdaforrásnak)?
- A **főminorok és a pivotok** kapcsolatát ($D_k$ = pivotok szorzata) mélyítsük el több példán?
- Az **$L_k$ mátrixos formalizmus** (inverz, szorzat, sorrend) finomságait gyakoroljuk?
- A **műveletigény** és az **LU haszna** (mikor éri meg / mikor nem) köré építsünk több összehasonlító kérdést?
- Vagy egy **teljes, kevert próbakvíz** (10–15 kérdés) az egész előadásból, vegyes nehézséggel?
