# Numerikus módszerek C — 8. előadás
## Polinomok: gyökök elhelyezkedésének becslése és a Horner-algoritmus

---

### Mit fed le ez a PDF (térkép)

Ez az anyag a tananyagból **két** témakört érint: (1) **polinomok gyökeinek becslése** — pontosabban a gyökök *abszolút értékére* (a komplex számsíkon az origótól mért távolságukra) adott alsó és felső korlát egy tételen keresztül; és (2) a **Horner-algoritmus**, amely a polinom és deriváltjai helyettesítési értékét számolja hatékonyan, és kapcsolódik a Taylor-polinomhoz. A záró Matlab-rész csak szemléltetés, vizsgaszempontból elhanyagolható.

> **Fontos keret:** a tétel **nem** mondja meg, hol vannak pontosan a gyökök — csak azt, hogy egy **origó középpontú nyílt körgyűrűben** helyezkednek el. A Horner pedig nem gyökkereső módszer, hanem **kiértékelő** eljárás. A kettő együtt logikus: előbb behatároljuk, hol keressük a gyököket, majd egy gyors kiértékelővel dolgozunk velük (pl. egy Newton-iterációban).

---

## 1. Becslés polinom gyökeinek elhelyezkedésére

### 1.1 CORE — a központi gondolat

Tekintsük az

$$P(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0$$

polinomot, ahol **$a_0 \neq 0$ és $a_n \neq 0$**. Ekkor a **Tétel** azt állítja, hogy $P$ **bármely** $x_k$ gyökére

$$r < |x_k| < R,$$

ahol

$$R = 1 + \frac{\displaystyle\max_{0 \le i \le n-1} |a_i|}{|a_n|}, \qquad r = \frac{1}{1 + \dfrac{\displaystyle\max_{1 \le i \le n} |a_i|}{|a_0|}}.$$

**Mit jelent ez szemléletesen?** A komplex számsíkon kijelölünk egy **origó középpontú nyílt körgyűrűt** (annulus): a gyökök se túl közel, se túl távol nem lehetnek az origóhoz képest. A belső sugár $r$, a külső $R$. Minden gyök — a valós és a **komplex** gyökök egyaránt — ebbe a gyűrűbe esik.

**Miért pont ez a $R$ képlet? (a felső korlát intuíciója)** A bizonyítás abból indul, hogy ha $|x|$ elég nagy, akkor a **vezető tag**, $a_n x^n$, „elnyomja” az összes többi tagot, így $P(x)$ nem lehet nulla. Formálisan a fordított háromszög-egyenlőtlenséggel alulról becsüljük $|P(x)|$-et:

$$|P(x)| \ge |a_n x^n| - \big| a_{n-1}x^{n-1} + \dots + a_0 \big|.$$

A kivonandó részt felülről becsüljük (minden együtthatót a legnagyobbal, $\max|a_i|$-vel helyettesítve, majd mértani sorral), és megmutatjuk, hogy $|x| \ge R$ esetén a teljes kifejezés pozitív marad. Tehát $|x| \ge R \Rightarrow |P(x)| > 0 \Rightarrow x$ **nem gyök** — vagyis minden gyökre $|x_k| < R$. Ez a tétel első fele.

**Honnan jön az alsó korlát $r$? (a reciprok-polinom trükk)** Itt a kulcsötlet, amit a vizsga szeret: bevezetjük az $y := \tfrac{1}{x}$ helyettesítést, és felírjuk a $P$ **reciprok-polinomját**:

$$Q(y) = a_n + a_{n-1} y + \dots + a_1 y^{n-1} + a_0 y^n.$$

$Q$ együtthatói tehát $P$ együtthatói **fordított sorrendben**. Belátható, hogy $Q$ gyökei éppen $P$ gyökeinek **reciprokai** ($P(x_k)=0 \iff Q(1/x_k)=0$). Most a már bizonyított **felső** korlátot alkalmazzuk $Q$-ra: ez $Q$ gyökeire ad egy „túl nagy nem lehet” korlátot, ami $1/x_k$-ra vonatkozik, és visszaalakítva éppen az „$x_k$ túl kicsi nem lehet” alsó korlátot, $|x_k| > r$, adja. Ezért szimmetrikus a két képlet: a felsőben $a_n$-nel osztunk és $a_0 \dots a_{n-1}$ maximumát vesszük, az alsóban $a_0$-val osztunk és $a_1 \dots a_n$ maximumát vesszük.

*(Saját kiegészítés a megértéshez: ez lényegében a klasszikus **Cauchy-féle gyökkorlát** egy formája. A slide-ok ezt nem nevezik néven, de hasznos tudni, hogy nem egyedi „házi” képletről van szó.)*

### 1.2 NUANCE — csapdaanyag

- **A két feltétel szerepe különböző.** Ha $a_0 = 0$, akkor $x=0$ **gyök**, és a tétel alsó korlátja értelmét veszti (nullával nem oszthatunk; a 0 gyök „kilóg” a gyűrűből). Ilyenkor $x$-szel leoszthatunk, és egy alacsonyabb fokú polinomot vizsgálunk. Ha $a_n = 0$, akkor a polinom **nem $n$-edfokú** — rosszul azonosítottuk a fokszámot. Tehát a két feltétel nem „díszítés”, hanem a tétel alkalmazhatóságának előfeltétele.
- **Nyílt körgyűrű — szigorú egyenlőtlenségek.** $r < |x_k| < R$, nem $\le$. A gyök *nem* eshet pontosan a határkörökre. Egy „a gyökök a zárt körgyűrűben vannak” típusú állítás **hamis** ehhez a tételhez képest.
- **Csak az abszolút értékről szól.** A tétel a $|x_k|$-t (az origótól mért távolságot) korlátozza, az **argumentumot/irányt nem**. Nem mondja meg, hol van a gyök a gyűrűn belül, és nem ad információt a gyökök számáról vagy multiplicitásáról.
- **Komplex együtthatókra is működik.** A bizonyítás menetén nem változtat, ha $a_i \in \mathbb{C}$. A gyökök is lehetnek komplexek — a gyűrű a teljes komplex síkon értendő.
- **A maximumok indexhatárai a klasszikus csapda.** $R$-ben a maximum $i=0$-tól $n-1$-ig fut (azaz **kihagyja** a vezető $a_n$-t, ami a nevezőben van). $r$-ben a maximum $i=1$-től $n$-ig fut (azaz **kihagyja** a konstans $a_0$-t, ami a nevezőben van). Ha az egyik végén elcsúszik az index, rossz a válasz.
- **A korlát durva, nem éles.** Tipikusan jóval bővebb gyűrűt ad, mint amiben a gyökök ténylegesen vannak. Garancia, nem pontos lokalizáció.

### Vizsgára fontos (Téma 1)

1. **Mit ad a tétel?** Origó középpontú **nyílt körgyűrűt** ($r < |x_k| < R$) a komplex síkon, minden gyökre, abszolút értékben — nem pontos helyet.
2. **Feltételek:** $a_0 \neq 0$ ÉS $a_n \neq 0$. $a_0=0 \Rightarrow$ 0 gyök, leosztás; $a_n=0 \Rightarrow$ nem $n$-edfokú.
3. **Indexhatárok:** $R$ maximuma $a_0\dots a_{n-1}$-en, osztva $|a_n|$-nel; $r$ maximuma $a_1\dots a_n$-en, osztva $|a_0|$-val. A szimmetria a reciprok-polinom trükkből ered.
4. **Az alsó korlát módszertana:** ugyanazt a (felső) becslést alkalmazzuk a reciprok-polinomra — ne keverd össze, ez nem új tétel, hanem ugyanannak az ügyes átírása.

---

## 2. Horner-algoritmus

### 2.1 CORE — helyettesítési érték hatékony számítása

A cél a $P(\xi)$ kiszámítása adott $\xi$ helyen. Az ötlet az **átzárójelezés** (más néven Horner-módszer, Horner-elrendezés):

$$P(x) = \big(\dots\big((a_n x + a_{n-1})x + a_{n-2}\big)x + \dots\big)x + a_0.$$

Ebből az **algoritmus**:

$$a^{(1)}_n := a_n, \qquad a^{(1)}_k := a_k + \xi \cdot a^{(1)}_{k+1} \quad (k = n-1, \dots, 1, 0),$$

és ekkor $P(\xi) = a^{(1)}_0$.

**Műveletigény: $n$ szorzás + $n$ összeadás, azaz $\mathcal{O}(n)$.** Ez a lényeg, amiért a módszer létezik. A naiv kiértékelés, amely minden $a_k x^k$ tagot külön számol ki (a hatványokat ismételten felépítve), $\mathcal{O}(n^2)$ szorzást igényelne. A Horner ráadásul **minimális** számú szorzással értékel ki általános polinomot — nem lehet lényegesen jobbat csinálni.

**Kapcsolat a maradékos osztással (saját kiegészítés — a slide implicit használja).** A Horner valójában a $(x-\xi)$-vel való **szintetikus osztás**:

$$P(x) = a^{(1)}_0 + (x-\xi)\cdot P_1(x), \qquad P_1(x) = a^{(1)}_1 + a^{(1)}_2 x + \dots + a^{(1)}_n x^{n-1}.$$

Itt a maradék $a^{(1)}_0 = P(\xi)$ (ez a **maradéktétel**: a $(x-\xi)$-vel osztás maradéka épp $P(\xi)$), a hányados együtthatói pedig a többi $a^{(1)}_k$. Ezért „esik ki” a táblázat alsó sorából egyszerre az érték és a hányados.

### 2.2 CORE — deriváltak és a Taylor-polinom

A fenti felbontásból deriválva (szorzatszabály):

$$P'(x) = 1\cdot P_1(x) + (x-\xi)\cdot P_1'(x) \;\Rightarrow\; P'(\xi) = P_1(\xi).$$

Vagyis a derivált $\xi$-beli értéke $P_1$ $\xi$-beli értéke — és $P_1(\xi)$-t **ugyanúgy Hornerrel** számoljuk, immár $P_1$ együtthatóin. Ezt jelöli a második sorszint: $P'(\xi) = a^{(2)}_1$.

Ha a táblázatot **tovább folytatjuk** (újra és újra Hornert futtatva), végül $P$-t a $(x-\xi)$ hatványai szerint írjuk fel:

$$P(x) = a^{(1)}_0 + a^{(2)}_1 (x-\xi) + a^{(3)}_2 (x-\xi)^2 + \dots + a^{(n+1)}_n (x-\xi)^n.$$

Ez **pontosan a $\xi$ körüli Taylor-polinom**, és az átlóban megjelenő értékekre:

$$\boxed{\;\frac{P^{(j)}(\xi)}{j!} = a^{(j+1)}_j\;}$$

### 2.3 NUANCE — csapdaanyag

- **A LEGFONTOSABB CSAPDA: az átló a Taylor-EGYÜTTHATÓKAT adja, nem a deriváltakat.** $a^{(j+1)}_j = \dfrac{P^{(j)}(\xi)}{j!}$, tehát a **derivált értékéhez** $j!$-sal **vissza kell szorozni**. Példa az anyagból ($P(x)=x^4-2x^3+3x^2-x+1$, $\xi=1$): az átló $2, 3, 3, 2, 1$.
  - $a^{(1)}_0 = 2 = P(1)$ (itt $0!=1$, egyezik)
  - $a^{(2)}_1 = 3 = P'(1)$ (itt $1!=1$, egyezik)
  - $a^{(3)}_2 = 3 = \dfrac{P''(1)}{2!}$, **tehát $P''(1) = 6$**, nem 3!
  - $a^{(4)}_3 = 2 = \dfrac{P'''(1)}{3!}$, **tehát $P'''(1) = 12$**, nem 2!
  - Csak $j=0$ és $j=1$ esetén esik egybe a Taylor-együttható és a derivált értéke.
- **Egy érték vs. minden derivált — eltérő költség.** Egyetlen $P(\xi)$: $\mathcal{O}(n)$. A teljes Taylor-kifejtés (összes derivált) a teljes háromszög-táblázattal: $\mathcal{O}(n^2)$.
- **$P'(\xi) = P_1(\xi)$, nem $P_1'(\xi)$.** A derivált értékét úgy kapjuk, hogy a *hányadospolinomot* értékeljük ki $\xi$-ben — nem $P_1$ deriváltját. Könnyű elgépelni.
- **A módszer kiértékel, nem gyököt keres.** A Horner önmagában nem ad gyököt; viszont kiváló „motor” gyökkereső iterációkhoz (pl. Newton, ahol $P(\xi)$ és $P'(\xi)$ is kell — mindkettő egyetlen kibővített Horner-futással adódik).
- **A felbontás bázist vált.** A Taylor-alak $P$ átírása a $\{(x-\xi)^k\}$ bázisban; az együtthatók egyértelműek, és a Horner determinisztikusan adja őket.

### Vizsgára fontos (Téma 2)

1. **Műveletigény:** $\mathcal{O}(n)$ ($n$ szorzás, $n$ összeadás) egy kiértékelésre — a naiv $\mathcal{O}(n^2)$ helyett; szorzásszámban optimális.
2. **Maradéktétel-kapcsolat:** $P(x) = P(\xi) + (x-\xi)P_1(x)$, a maradék $= P(\xi)$, a Horner = szintetikus osztás $(x-\xi)$-vel.
3. **Taylor-együttható ≠ derivált:** $a^{(j+1)}_j = P^{(j)}(\xi)/j!$. A derivált értékéhez $\cdot\, j!$. (A klasszikus „true except…” csapda.)
4. **Két szint:** $a^{(1)}_0 = P(\xi)$, $a^{(2)}_1 = P'(\xi)$; a teljes táblázat átlója a $\xi$ körüli Taylor-polinom együtthatói.

---

## Összehasonlító táblázatok (A/B/C/D-csapdák ellen)

### Kiértékelés: naiv vs. Horner

| Szempont | Naiv (tagonként) | Horner |
|---|---|---|
| Szorzások száma | $\sim \mathcal{O}(n^2)$ (hatványok újraszámolása) | **$n$** |
| Összeadások száma | $n$ | $n$ |
| Aszimptotika | $\mathcal{O}(n^2)$ | **$\mathcal{O}(n)$** |
| Optimalitás | nem | szorzásszámban **minimális** |
| Numerikus viselkedés | rosszabb | jó (backward stabil) |

### Horner két használata

| | $P(\xi)$ értékre | Teljes Taylor / összes derivált |
|---|---|---|
| Mit ad | egyetlen helyettesítési érték | $P, P', \dots, P^{(n)}$ a $\xi$-ben |
| Hány Horner-szint | 1 | $n+1$ (háromszög-táblázat) |
| Költség | $\mathcal{O}(n)$ | $\mathcal{O}(n^2)$ |
| Eredmény értelmezése | $a^{(1)}_0 = P(\xi)$ közvetlenül | $a^{(j+1)}_j = P^{(j)}(\xi)/j!$ — **$j!$-sal szorozni!** |

### A gyökkorlát két oldala

| | Felső korlát $R$ | Alsó korlát $r$ |
|---|---|---|
| Képlet | $1 + \dfrac{\max_{0\le i\le n-1}|a_i|}{|a_n|}$ | $\dfrac{1}{\,1 + \frac{\max_{1\le i\le n}|a_i|}{|a_0|}\,}$ |
| Max. fut | $a_0 \dots a_{n-1}$ (kihagyja $a_n$-t) | $a_1 \dots a_n$ (kihagyja $a_0$-t) |
| Osztó | $|a_n|$ | $|a_0|$ |
| Bizonyítás | háromszög-egyenlőtlenség + mértani sor | **reciprok-polinomra** alkalmazott felső korlát |
| Feltétel | $a_n \neq 0$ | $a_0 \neq 0$ |

---

## Önellenőrző kérdések (A/B/C/D)

**1.** A gyökbecslő tétel pontosan mit állít $P$ gyökeiről?
- A) A valós gyökök a $[r, R]$ zárt intervallumban vannak.
- B) Minden gyök (valós és komplex) az origó középpontú **nyílt** körgyűrűben van: $r < |x_k| < R$.
- C) A gyökök a $R$ sugarú zárt körlapon belül vannak, az alsó korlát nélkül.
- D) A tétel megadja minden gyök pontos helyét a komplex síkon.

**Megoldás: B.** Minden gyökre, abszolút értékben, szigorú egyenlőtlenségekkel; csak gyűrűt ad, nem pontos helyet, és a komplexeket is tartalmazza.

---

**2.** Mi történik, ha $a_0 = 0$?
- A) Semmi, a tétel változatlanul alkalmazható.
- B) A polinom nem $n$-edfokú.
- C) $x=0$ gyök lesz, leoszthatunk $x$-szel, és a tétel az alsó korlátra így nem alkalmazható közvetlenül.
- D) A felső korlát $R$ válik értelmezhetetlenné.

**Megoldás: C.** $a_0=0$ esetén a 0 gyök, ami „kilóg” a gyűrűből, és $r$ képletében $|a_0|$ a nevezőben szerepel. ($a_n=0$ lenne az, ami a fokszámot rontja — az a D/B-féle csapda.)

---

**3.** A felső korlát $R = 1 + \dfrac{\max_i |a_i|}{|a_n|}$ képletében a maximum **mely** együtthatókon fut?
- A) Az összes együtthatón, $a_0$-tól $a_n$-ig.
- B) $a_1$-től $a_n$-ig.
- C) $a_0$-tól $a_{n-1}$-ig (a vezető $a_n$ kivételével).
- D) Csak $a_0$-n és $a_{n-1}$-en.

**Megoldás: C.** A nevezőben lévő $a_n$-t a maximum kihagyja; $a_1\dots a_n$ az **alsó** korlát ($r$) maximuma — ez a tükörcsapda.

---

**4.** Hány művelettel értékel ki a Horner-algoritmus egy $n$-edfokú polinomot egy pontban, és miért éri meg?
- A) $\mathcal{O}(n^2)$ szorzással, mert minden hatványt külön számol.
- B) $n$ szorzással és $n$ összeadással ($\mathcal{O}(n)$), és szorzásszámban optimális.
- C) $\mathcal{O}(\log n)$ művelettel, gyors hatványozással.
- D) $2n$ szorzással, mert a deriváltat is mindig kiszámolja.

**Megoldás: B.** A naiv $\mathcal{O}(n^2)$ az A-beli csapda; a Horner $\mathcal{O}(n)$, és a derivált *opcionális* (külön Horner-szint).

---

**5.** Az $1$ körüli Horner-táblázat átlójában a harmadik elem $a^{(3)}_2 = 3$. Mennyi $P''(1)$?
- A) $3$, mert az átló közvetlenül a deriváltat adja.
- B) $6$, mert $a^{(3)}_2 = P''(1)/2!$, tehát $P''(1) = 2!\cdot 3$.
- C) $1{,}5$, mert el kell osztani $2$-vel.
- D) $9$, mert $3^2$.

**Megoldás: B.** Az átló a Taylor-**együtthatókat** adja: $a^{(j+1)}_j = P^{(j)}(\xi)/j!$. $j=2$-re vissza kell szorozni $2!=2$-vel, így $P''(1)=6$. (A-féle „közvetlenül a derivált” a fő csapda; csak $j=0,1$-re igaz.)

---

**6.** Hogyan nyerjük a tétel **alsó** korlátját ($r$)?
- A) Egy teljesen új, független becsléssel a deriváltra.
- B) A felső korlát bizonyítását alkalmazzuk a $P$ **reciprok-polinomjára** ($Q(y)$, az együtthatók fordított sorrendben), kihasználva, hogy $Q$ gyökei $P$ gyökeinek reciprokai.
- C) A felső korlát $R$ reciprokát vesszük: $r = 1/R$.
- D) A legkisebb együttható és a vezető együttható hányadosából.

**Megoldás: B.** A reciprok-polinom trükk; az $r = 1/R$ (C) elterjedt tévhit, de hamis — a két képlet más maximumokon és más osztón alapul.

---

## Mire menjünk mélyebbre?

Mondd meg, melyik irányt szeretnéd kibontani — tudok pl.:

1. **A felső korlát bizonyítását lépésről lépésre** végigvezetni (a háromszög-egyenlőtlenségek és a mértani sor szerepével), hogy egy „melyik lépés miért igaz” típusú kérdésre is fel legyél készülve.
2. **A reciprok-polinom konstrukcióját** részletezni: miért lesznek $Q$ gyökei pont a reciprokok, és hogyan fordul át a felső korlát alsóvá.
3. **A Horner ↔ Taylor ↔ maradékos osztás** hármast még szorosabban összekötni, több számpéldával a $j!$-os visszaszorzásra (ez a leggyakoribb buktató).
4. **Több, kifejezetten trükkös A/B/C/D kérdést** generálni bármelyik altémából, ha gyakorolni akarsz.
