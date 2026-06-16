# Numerikus módszerek C — 9. előadás: Interpoláció polinomokkal
### Vizsgafelkészítő tananyag (elméleti, A/B/C/D fókusszal)

> A matematikai jelölés LaTeX-ben van (`$...$`). Ha a megnyitód nem rendereli (pl. sima szövegszerkesztő), használj Obsidiant, Typorát vagy VS Code-ot Markdown+Math kiegészítővel.

---

## Mit fed le ez a PDF?

Ez a diasor a kurzus **Interpoláció** témakörét tárgyalja, teljes mélységben: az alapfeladattól (létezés + egyértelműség) a két szabványos előállításon (**Lagrange-alak**, **Newton-alak**) át a **hibaformulákig**. Érintőlegesen, kontrasztként vagy alkalmazásként előkerül még négy másik kurzustéma: az **approximáció / legkisebb négyzetek** (mint az interpoláció ellenpárja), a **numerikus integrálás** (mint alkalmazás), a **Horner-algoritmus** (mint kiértékelő eszköz), és a **kondíciószám / érzékenység** téma (a Vandermonde-mátrix rossz kondicionáltságán keresztül). Ezeket a kapcsolódásokat jelölöm, mert pont az ilyen "két téma határán" lévő állítások a kedvenc A/B/C/D csapdák.

**Tier-jelölés a tananyagban:**
- **[MAG]** — a központi gondolat, amit biztosan tudni kell.
- **[FINOMSÁG]** — valószínű csapdaanyag: finom megkülönböztetések, feltételek, "igaz, kivéve…" típusú tények.
- **[ÁTUGORHATÓ]** — diatöltelék, történeti adat, részletes levezetés. Megemlítem, de nem kell magolni.

A **(kiegészítés)** címkével ellátott részek nincsenek benne a diákban — ezek standard tankönyvi tudás, amit hozzáteszek, mert nélkülük a kép hiányos lenne, és a vizsga pont ezekre kérdez rá.

---

## 0. téma — Interpoláció vs. approximáció (Függvények közelítése)

### [MAG] Miért közelítünk egyáltalán?
A motiváció: egy **költségesen kiértékelhető** (vagy csak pontokban ismert) függvény helyett egy **egyszerű** függvénnyel dolgozunk. Az egyszerű függvény tipikusan **polinom**, mert azt a **Horner-algoritmussal** gyorsan és kevés művelettel ki tudjuk értékelni. Tehát a polinom nem önmagáért érdekes, hanem mert *olcsón számolható* helyettesítő.

### [MAG] A két feladat éles szétválasztása
Ez a dia legfontosabb fogalmi tartalma. Két, **egymástól különböző** célt szolgáló feladat van:

| | **Interpoláció** | **Approximáció** (pl. legkisebb négyzetek) |
|---|---|---|
| Cél | A görbe **pontosan átmegy** minden adott ponton: $p(x_i)=y_i$ | A görbe **közel van** az adatokhoz, de **nem megy át** rajtuk |
| Adat jellege | Pontos (pl. egy ismert $f$ helyettesítési értékei) | Hibás / zajos (mérési eredmény) |
| Miért nem akarunk pontos illeszkedést? | — | Mert a **mérési hiba miatt** a pontos illeszkedés *a zajra* illesztene |
| Pontok és fokszám viszonya | $n+1$ pont → legfeljebb $n$-edfokú polinom | Általában **kevés** paraméter sok adatra (pl. egyenes sok pontra) |

### [FINOMSÁG] A klasszikus csapda itt
"Az interpoláció mindig jobb, mint az approximáció" → **HAMIS**. Ha az adat zajos, az interpoláció a zajt is végigköveti (pontosan átmegy minden hibás ponton), ezért **rosszabb** közelítést ad, mint egy approximáció, ami átlagol a hiba felett. A választás az **adat természetétől** függ: pontos adatra interpoláció, zajos adatra approximáció.

### [ÁTUGORHATÓ] Alkalmazási listák
A diák hosszan sorolják az alkalmazásokat. Két dolgot érdemes fejben tartani, a többi töltelék:
- **Interpoláció** → a **numerikus integrálás** és a többlépéses (ODE-)módszerek *konstrukciós alapja*. (Ez vizsgán visszaköszönhet: "min alapul a numerikus integrálás?" → interpoláció.)
- **Approximáció** → **legkisebb négyzetek** (Gauss/Legendre, Ceres-pálya), regresszió, Taylor- és Fourier-sorok. A névadás Legendre-től (1805) ered.

### Vizsgára fontos
1. **Interpoláció = pontos illeszkedés; approximáció = legjobb (nem pontos) illeszkedés.** Ez a leggyakoribb definíciós kérdés.
2. Zajos adatnál az approximáció a helyes választás, mert az interpoláció **a zajt is interpolálja**.
3. Az interpoláció a **numerikus integrálás** elméleti alapja — ez a két téma közti tipikus összekötő kérdés.

---

## 1. téma — Az interpoláció alapfeladata, létezés és egyértelműség

### [MAG] A feladat pontos kimondása
Adottak **különböző** $x_0,\dots,x_n \in [a;b]$ **alappontok** és $y_0,\dots,y_n \in \mathbb{R}$ **függvényértékek**. Keresünk egy $p_n \in P_n$ polinomot (azaz **legfeljebb** $n$-edfokút), melyre
$$p_n(x_i) = y_i, \qquad i = 0,1,\dots,n.$$
Ha egy $f$ függvényt közelítünk, akkor $y_i = f(x_i)$.

### [MAG] A létezés és egyértelműség tétele
$$\exists!\, p_n \in P_n : \quad p_n(x_i) = y_i \quad (i=0,1,\dots,n).$$
Azaz **pontosan egy** ilyen polinom van. A bizonyítás vázlata (a dia szerint táblán, határozatlan együtthatókkal): írjuk fel $p_n(x)=a_0+a_1x+\dots+a_nx^n$ alakban. Az $n+1$ feltétel egy $n+1$ ismeretlenes **lineáris egyenletrendszert** (LER) ad, melynek mátrixa a **Vandermonde-mátrix**. Ennek determinánsa $\prod_{i<j}(x_j-x_i)$, ami **pontosan akkor nem nulla, ha az alappontok különbözők** — így a megoldás egyértelműen létezik. *(kiegészítés: a determináns képlete és a "különbözőség" feltétel kapcsolata a kulcs.)*

### [FINOMSÁG] Amit ebből félreértenek
- **"Legfeljebb $n$-edfokú", nem "pontosan $n$-edfokú".** A megoldás fokszáma lehet kisebb is. Pl. három **kollineáris** pontra az interpolációs polinom egy **egyenes** (1-edfokú), nem parabola — pedig $n=2$. A $P_n$ halmaz a **legfeljebb** $n$-edfokú polinomoké.
- **A "különböző alappontok" feltétel elengedhetetlen.** Két egybeeső $x_i$ esetén a feladat ebben a formában nem oldható meg (ekkor a *Hermite-interpoláció* lép be, ahol deriváltakat is előírunk — *kiegészítés*).
- **Egyértelműség → minden alak ugyanaz a polinom.** Ez a legfontosabb következmény: a Lagrange-alak, a Newton-alak és a hatványbázisú alak **mind UGYANAZT az egyetlen polinomot** állítják elő, csak **másik bázisban** felírva. Nem három különböző polinom! Klasszikus csapda: *"A Lagrange- és a Newton-alak más-más interpolációs polinomot ad"* → **HAMIS**.

### [FINOMSÁG] Miért nem így számolunk a gyakorlatban? (kapcsolat az érzékenység-témához)
A megoldás *létezik és egyértelmű*, de a Vandermonde-rendszer **rosszul kondicionált** — a hatványbázis $(1, x, x^2, \dots, x^n)$ "majdnem lineárisan összefüggő" magas fokszámnál, így a LER numerikusan instabil. Ezért a gyakorlatban **sosem** a Vandermonde-LER-t oldjuk meg, hanem **jobb bázist** választunk (Lagrange vagy Newton). Itt válik szét a **feladat jólkondicionáltsága** (egyértelmű megoldás van) a **módszer stabilitásától** (a naiv hatványbázisos út numerikusan rossz). Ez a két fogalom keverése tipikus vizsgacsapda.

### Vizsgára fontos
1. **$n+1$ különböző alappont → pontosan egy, legfeljebb $n$-edfokú interpolációs polinom.** Mindhárom szó számít: "különböző", "pontosan egy", "legfeljebb".
2. Az **egyértelműség** miatt a Lagrange-, Newton- és hatványbázisú alak **ugyanaz a polinom**, eltérő reprezentációban.
3. A Vandermonde-mátrix **rosszul kondicionált** → ezért nem a hatványbázist használjuk. A "van egyértelmű megoldás" ≠ "a naiv módszer numerikusan jó".

---

## 2. téma — Előállítás Lagrange-alakkal

### [MAG] Az ötlet: "kapcsolók" összege
Olyan **alappolinomokat** építünk, amelyek mindegyike a **saját alappontjában 1, az összes többiben 0**. Ezek a **Lagrange-alappolinomok**:
$$\ell_k(x) = \prod_{\substack{j=0\\ j\neq k}}^{n} \frac{x-x_j}{x_k-x_j}, \qquad k=0,1,\dots,n.$$
Mindegyik $\ell_k$ **pontosan $n$-edfokú** (a számlálóban $n$ darab elsőfokú tényező van).

### [MAG] A kulcstulajdonság (Kronecker-delta)
$$\ell_k(x_i) = \delta_{ki} = \begin{cases} 1, & k=i \\ 0, & k\neq i.\end{cases}$$
Ezért, ha a függvényértékekkel súlyozva összegezzük őket, megkapjuk az interpolációs polinom **Lagrange-alakját**:
$$L_n(x) = \sum_{k=0}^{n} y_k\,\ell_k(x) \;\equiv\; p_n(x).$$
**Miért működik?** Az $x_i$ pontban minden tag eltűnik, kivéve a $k=i$-ediket, ahol $\ell_i(x_i)=1$, így $L_n(x_i)=y_i$. Pontosan ezt akartuk. A bizonyítás a diákon "Trivi." — ez tényleg azonnal jön a $\delta_{ki}$ tulajdonságból.

### [FINOMSÁG] A másik felírás és $\omega_n$
Bevezetjük a **csomópont-polinomot**: $\omega_n(x) = \prod_{j=0}^{n}(x-x_j)$. Ezzel
$$\ell_k(x) = \frac{\omega_n(x)}{(x-x_k)\,\omega_n'(x_k)}.$$
Ez ugyanaz az $\ell_k$, csak tömörebben — és a $\omega_n$ visszaköszön a hibaformulában is, úgyhogy érdemes megjegyezni a definícióját.

### [FINOMSÁG] Egységfelbontás (kiegészítés)
$$\sum_{k=0}^{n} \ell_k(x) = 1 \quad \text{minden } x\text{-re.}$$
Indok: ha a konstans $1$ függvényt interpoláljuk ($y_k=1$), az eredmény azonosan $1$ (egyértelműség miatt). Ez kedvelt "igaz/hamis" kérdés.

### [FINOMSÁG] Előny és hátrány — a Newton-nal való összevetés magja
- **Előny:** az alak **explicit**, közvetlenül az adatból felírható, nincs egyenletrendszer.
- **Hátrány:** ha **új alappontot** veszünk fel, **minden** $\ell_k$ megváltozik (mindegyik nevezőjében/szorzatában ott az új pont), tehát az **egész előállítást újra kell kezdeni**. Itt fog a Newton-alak nyerni.

### Vizsgára fontos
1. $\ell_k(x_i)=\delta_{ki}$ — ez **a** Lagrange-tulajdonság; minden $\ell_k$ **$n$-edfokú**.
2. $L_n(x)=\sum y_k \ell_k(x)$, és ez **ugyanaz** a polinom, mint a Newton-alak.
3. $\sum_k \ell_k(x)=1$ (egységfelbontás).
4. **Hátrány új pontnál:** mindent újra kell számolni — szemben a Newton-alakkal.

---

## 3. téma — Előállítás Newton-alakkal

### [MAG] Osztott differenciák
A Newton-alak építőkövei az **osztott differenciák**. Rekurzívan:
- **0-adrendű:** $f[x_i] := f(x_i)$.
- **1-edrendű:** $f[x_i,x_{i+1}] = \dfrac{f(x_{i+1})-f(x_i)}{x_{i+1}-x_i}$ (ez egy különbségi hányados).
- **$k$-adrendű:** $f[x_i,\dots,x_{i+k}] = \dfrac{f[x_{i+1},\dots,x_{i+k}] - f[x_i,\dots,x_{i+k-1}]}{x_{i+k}-x_i}.$

Ezeket egy **háromszög-táblázatba** rendezzük; minden oszlop a balra lévőből, két szomszédos elem különbségéből számolódik.

### [MAG] A Newton-féle bázis és az alak
A hatványbázis helyett a **Newton-bázist** használjuk:
$$1,\; (x-x_0),\; (x-x_0)(x-x_1),\; \dots,\; \prod_{i=0}^{n-1}(x-x_i).$$
Az interpolációs polinom **Newton-alakja**:
$$N_n(x) = f(x_0) + \sum_{k=1}^{n} f[x_0,\dots,x_k]\cdot \omega_{k-1}(x) \;\equiv\; L_n(x),$$
ahol $\omega_{k-1}(x)=\prod_{i=0}^{k-1}(x-x_i)$. Kibontva:
$$N_n(x) = f(x_0) + f[x_0,x_1](x-x_0) + f[x_0,x_1,x_2](x-x_0)(x-x_1) + \dots$$
Vagyis a **Newton-alak együtthatói éppen az osztott differenciák** (a táblázat felső átlója).

### [MAG] A rekurzív (inkrementális) tulajdonság — ez az egész lényege
Új $x_{n+1}$ alappont felvételekor:
$$N_{n+1}(x) = N_n(x) + f[x_0,\dots,x_{n+1}]\cdot \omega_n(x).$$
Tehát **a régi alakhoz csak EGY új tagot adunk** — a korábbi együtthatók **nem változnak**. Ez a Newton-alak nagy fegyvere a Lagrange-alakkal szemben.

### [FINOMSÁG] Az osztott differenciák szimmetriája
$$f[x_{\sigma(0)},\dots,x_{\sigma(k)}] = f[x_0,\dots,x_k]$$
**bármely** $\sigma$ permutációra. Vagyis az osztott differencia **független az alappontok sorrendjétől** — pl. $f[x_0,x_1,x_2]=f[x_2,x_0,x_1]$. (Következik az $f[x_0,\dots,x_k]=\sum_{j} \frac{f(x_j)}{\omega_k'(x_j)}$ zárt alakból, ami szimmetrikus az indexekben.) Csapda: *"az osztott differencia értéke változik, ha átsorrendezzük a pontokat"* → **HAMIS**.

### [FINOMSÁG] Kapcsolat a deriválttal (kiegészítés)
Sima $f$ esetén $f[x_0,\dots,x_k]=\dfrac{f^{(k)}(\xi)}{k!}$ valamely $\xi$-re az alappontok intervallumában. Tehát az osztott differencia a **$k$-adik derivált $k!$-sal osztva** — ez köti össze a Newton-alakot a Taylor-polinommal és a hibaformulával. Speciálisan a **legmagasabb rendű** osztott differencia, $f[x_0,\dots,x_n]$, éppen az interpolációs polinom **főegyütthatója**.

### [ÁTUGORHATÓ] A levezetés (diák 40–49)
A diák oldalakon át vezetik le, hogy az inkrementális együttható $c_k = f[x_0,\dots,x_k]$, abból kiindulva, hogy $L_k-L_{k-1}$ egy $k$-adfokú polinom $k$ db ismert gyökkel. **A levezetés lépéseit nem kell tudni** — a *végeredményt* (a Newton-alak képletét és a rekurziót) igen.

### Lagrange vs. Newton — oldalpár (klasszikus A/B/C/D anyag)

| Szempont | **Lagrange-alak** | **Newton-alak** |
|---|---|---|
| Együtthatók | $y_k$ (közvetlen függvényértékek) | osztott differenciák $f[x_0,\dots,x_k]$ |
| Bázis | $\ell_k(x)$ alappolinomok ($n$-edfokúak) | $1,(x-x_0),(x-x_0)(x-x_1),\dots$ |
| Felírás munkája | gyors, explicit, nincs LER | osztott differencia táblázat kell |
| **Új alappont** | **mindent újra kell számolni** | **csak egy új tag** (rekurzió) |
| Eredmény | **ugyanaz** a $p_n$ polinom | **ugyanaz** a $p_n$ polinom |

> A két alak **azonos polinomot** ad ($N_n\equiv L_n\equiv p_n$). A különbség csak a **felírás módjában és költségében** van — nem az eredményben.

### Vizsgára fontos
1. **A Newton-alak együtthatói az osztott differenciák.** A legmagasabb rendű = főegyüttható.
2. **Inkrementális:** új pont = +1 tag, a régiek maradnak. Ez a fő előny a Lagrange-hoz képest.
3. Az osztott differenciák **szimmetrikusak** (sorrendfüggetlenek).
4. $N_n \equiv L_n \equiv p_n$ — ugyanaz a polinom, más bázisban.

---

## 4. téma — Hibaformulák

### [MAG] A hibaformula (Lagrange-féle maradéktag)
Tegyük fel, hogy $f \in C^{n+1}[a;b]$ (azaz $f$-nek van **$n+1$ folytonos deriváltja**), és $[a;b]$ az $x_0,\dots,x_n$ és $x$ által kifeszített intervallum. Ekkor van olyan $\xi_x \in [a;b]$, hogy
$$f(x) - p_n(x) = \frac{f^{(n+1)}(\xi_x)}{(n+1)!}\cdot \omega_n(x), \qquad \omega_n(x)=\prod_{j=0}^{n}(x-x_j).$$
A hibának tehát **két tényezője** van:
- $\dfrac{f^{(n+1)}(\xi_x)}{(n+1)!}$ — a függvény simaságától/görbületétől függ, **nem tudjuk pontosan** ($\xi_x$ ismeretlen).
- $\omega_n(x)$ — a **csomópont-polinom**, ami **csak az alappontoktól és $x$-től** függ. Ezt mi **befolyásolhatjuk** az alappontok elhelyezésével.

### [MAG] A hibabecslés (felső korlát)
Mivel $\xi_x$-et nem ismerjük, a deriváltat felülről becsüljük:
$$|f(x)-p_n(x)| \le \frac{M_{n+1}}{(n+1)!}\cdot |\omega_n(x)|, \qquad M_{n+1} = \max_{\xi\in[a;b]} |f^{(n+1)}(\xi)| = \|f^{(n+1)}\|_\infty.$$

### [FINOMSÁG] Mit jelent (és mit nem) $\xi_x$
- $\xi_x$ **az $x$ helytől függ** — nem egyetlen rögzített pont az egész intervallumra. Csapda: *"$\xi$ egy konstans, ami minden $x$-re ugyanaz"* → **HAMIS**.
- Az **alappontokban** ($x=x_i$) a hiba **nulla**, mert ott $\omega_n(x_i)=0$ — pontosan ez az interpoláció lényege.
- A formula **csak $f\in C^{n+1}$ mellett érvényes.** Ha $f$ nem elég sima, a maradéktag ebben az alakban nem alkalmazható.

### [MAG] Hibaformula a Newton-alakra (és a kapcsolat)
A Newton-alak ad egy **másik**, $\xi$-mentes hibakifejezést ($x\neq x_i$ esetén):
$$f(x) - N_n(x) = f[x,x_0,x_1,\dots,x_n]\cdot \omega_n(x).$$
**Miért igaz?** Vegyük az $x, x_0,\dots,x_n$ pontokra felírt $N_{n+1}$ Newton-alakot. Mivel ez $x$-ben is interpolál, $N_{n+1}(x)=f(x)$. A rekurzióból
$$f(x)-N_n(x) = N_{n+1}(x)-N_n(x) = f[x,x_0,\dots,x_n]\cdot \omega_n(x).$$
A két hibaalakot összevetve adódik a **következmény**:
$$f[x,x_0,\dots,x_n] = \frac{f^{(n+1)}(\xi_x)}{(n+1)!}.$$
Vagyis az osztott differencia és a derivált pontosan a hibaformulán keresztül kapcsolódik.

### [FINOMSÁG] A két hibaformula viszonya
- A **Lagrange-féle** ($f^{(n+1)}(\xi_x)/(n+1)!$): elméleti, **ismeretlen** $\xi_x$, de felső becslésre alkalmas, ha ismerjük a derivált korlátját.
- A **Newton-féle** ($f[x,x_0,\dots,x_n]$): **egzakt**, nincs benne ismeretlen $\xi$, viszont tartalmazza $f$ értékét $x$-ben (amit pont nem ismerünk) — gyakorlatban *további* alappont becsléséhez hasznos.
- **$n=0$ speciális eset:** $f[x,x_0]=\dfrac{f(x_0)-f(x)}{x_0-x}=f'(\xi_x)$ — ez maga a **Lagrange-középérték-tétel**. Vagyis a hibaformula a középérték-tétel általánosítása. (Szép összekötő kérdés.)

### [FINOMSÁG] Csomópont-választás és Runge-jelenség (kiegészítés)
Mivel a hibában a $|\omega_n(x)|$ tényezőt **mi** szabályozzuk:
- **Csebisev-alappontok**: úgy helyezzük el a pontokat, hogy $\max|\omega_n(x)|$ a lehető legkisebb legyen → jóval kisebb maximális hiba, mint egyenközű pontoknál.
- **Runge-jelenség**: **egyenközű** alappontoknál, **magas** fokszámmal a hiba a intervallum szélein **elszállhat** — pedig a képletben ott a $(n+1)!$ a nevezőben. A magyarázat: a $f^{(n+1)}$ és a $|\omega_n|$ a széleken gyorsabban nőhet, mint ahogy $(n+1)!$ csökkent. **Tanulság (klasszikus csapda):** *"több alappont / magasabb fokszám mindig pontosabb"* → **HAMIS**. Nem mindegy, **hová** tesszük a pontokat.

### Vizsgára fontos
1. **Feltétel:** $f\in C^{n+1}[a;b]$. A hiba két tényezője: $\frac{f^{(n+1)}(\xi_x)}{(n+1)!}$ és $\omega_n(x)$.
2. **$\xi_x$ az $x$-től függ**, nem konstans; az alappontokban a hiba nulla.
3. **Newton-féle hiba** ($f[x,x_0,\dots,x_n]\omega_n(x)$) egzakt; a kettő kapcsolata: $f[x,x_0,\dots,x_n]=\frac{f^{(n+1)}(\xi_x)}{(n+1)!}$; $n=0$ → középérték-tétel.
4. A $|\omega_n|$ befolyásolható: **Csebisev-pontok** csökkentik a hibát, **egyenközű + magas fok** → **Runge-jelenség**. A magasabb fok nem garancia a pontosságra.

---

## Önellenőrző kérdések (nehéz, A/B/C/D — a finomságokra hegyezve)

**1. kérdés.** Hét különböző alapponton ($n=6$) felírjuk ugyanazon adatok interpolációs polinomját Lagrange-alakban és Newton-alakban. Mit mondhatunk?
- A) A két alak két különböző, de azonos fokszámú polinomot ad.
- B) A két alak ugyanazt a polinomot adja, csak más bázisban felírva.
- C) A Newton-alak alacsonyabb fokú polinomot ad, mert rekurzív.
- D) Csak akkor azonosak, ha az alappontok egyenközűek.

**Helyes: B.** — Az egyértelműségi tétel miatt csak **egy** legfeljebb $n$-edfokú interpolációs polinom van; a Lagrange- és Newton-alak ennek két reprezentációja, nem két polinom.

---

**2. kérdés.** Egy interpolációs feladatot megoldottunk $n+1$ ponton. Most felveszünk **egy új** alappontot. Melyik állítás igaz?
- A) A Newton-alaknál csak egy új tagot kell hozzáadni, a Lagrange-alaknál minden alappolinomot újra kell számolni.
- B) Mindkét alaknál csak egy új tag kell.
- C) A Lagrange-alak rekurzív, ezért ott olcsóbb az új pont.
- D) Egyik alaknál sem kell újraszámolni semmit.

**Helyes: A.** — A Newton-alak inkrementális ($N_{n+1}=N_n+f[x_0,\dots,x_{n+1}]\omega_n$); a Lagrange-alapполinomok viszont mind tartalmazzák az új pontot, így mindet újra kell képezni.

---

**3. kérdés.** Az interpolációs hibaformuláról, $f(x)-p_n(x)=\frac{f^{(n+1)}(\xi_x)}{(n+1)!}\omega_n(x)$, melyik **HAMIS**?
- A) Feltétele, hogy $f\in C^{n+1}[a;b]$.
- B) A $\xi_x$ pont általában függ attól, hogy melyik $x$-ben nézzük a hibát.
- C) Mivel a nevezőben $(n+1)!$ áll, több (egyenközű) alapponttal a maximális hiba mindig csökken.
- D) Az alappontokban a hiba nulla, mert ott $\omega_n$ eltűnik.

**Helyes (a hamis állítás): C.** — Ez a Runge-jelenség csapdája: egyenközű pontoknál magas fokszámon a hiba a széleken **nőhet**, mert $f^{(n+1)}$ és $|\omega_n|$ gyorsabban nő, mint ahogy $(n+1)!$ csökkent.

---

**4. kérdés.** Az osztott differenciákról melyik igaz?
- A) Értékük függ az alappontok sorrendjétől, ezért rendezni kell őket.
- B) $f[x_0,x_1,x_2]=f[x_2,x_1,x_0]$, mert az osztott differencia permutációinvariáns.
- C) Csak egyenközű alappontokra értelmezhetők.
- D) Az elsőrendű osztott differencia mindig egyenlő $f'(x_0)$-lal.

**Helyes: B.** — Az osztott differencia szimmetrikus az alappontjaiban. (A) hamis; (C) hamis (tetszőleges különböző pontokra megy); (D) hamis — az csak egy *átlagos* meredekség, a derivált a középérték-tétel szerint valamely közbülső $\xi$-ben egyezik vele.

---

**5. kérdés.** Miért nem a hatványbázisú ($1,x,\dots,x^n$) felírást használjuk az interpolációs polinom kiszámítására a gyakorlatban?
- A) Mert ekkor nem létezik megoldás.
- B) Mert a megoldás nem egyértelmű.
- C) Mert a megoldandó Vandermonde-rendszer rosszul kondicionált, így numerikusan instabil — bár a megoldás létezik és egyértelmű.
- D) Mert a hatványbázisú polinom magasabb fokú, mint a Lagrange-alakú.

**Helyes: C.** — A feladat jól meghatározott (egyértelmű megoldás), de a Vandermonde-mátrix **rossz kondíciójú**, ezért a hatványbázisú út numerikusan rossz. Ezért választunk jobb bázist (Lagrange/Newton). (D) hamis: mind ugyanaz a polinom, ugyanaz a fokszám.

---

**6. kérdés (ráadás).** Melyik állítás a helyes az interpoláció és az approximáció viszonyáról zajos mérési adatokon?
- A) Mindig az interpoláció a jobb, mert pontosan átmegy az adatokon.
- B) Az approximáció lehet jobb, mert a pontos illeszkedés a mérési zajt is "végigköveti".
- C) A kettő ugyanazt adja, ha elég sok pontunk van.
- D) Zajos adatra egyik sem alkalmazható.

**Helyes: B.** — Zajos adatnál a pontos illeszkedés (interpoláció) a hibára illeszt; az approximáció (pl. legkisebb négyzetek) átlagol a zaj felett, ezért gyakran jobb közelítést ad.

---

## Hol mélyítsünk?

Ha szeretnéd, bármelyik részt kibonthatom részletesebben — például:
- a **Lagrange ↔ Newton** átírás és a költségbeli különbség pontos elemzése,
- az **osztott differencia tábla** logikája és a szimmetria bizonyítása,
- a **hibaformula** levezetésének gondolatmenete (Rolle-tétel többszöri alkalmazása),
- a **Csebisev-alappontok** és a **Runge-jelenség** mélyebb tárgyalása,
- vagy a kapcsolódó témák (numerikus integrálás, kondíciószám) felé átvezetés.

Írd meg, melyik irányba menjünk, és csinálok hozzá célzott, vizsgastílusú kérdéssort is.
