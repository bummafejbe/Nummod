# Numerikus módszerek C — 6. előadás
## Nemlineáris egyenletek numerikus megoldása — vizsgafelkészítő lecke

> **Mit fed le ez a PDF?** Egyetlen, jól körülhatárolt témát: egy $f(x)=0$ nemlineáris egyenlet gyökének közelítését **intervallumfelezéssel** és **fixpont-iterációval**, a hozzájuk tartozó tételekkel (Bolzano, Brouwer, Banach, lokális fixponttétel), majd a **konvergencia rend** fogalmával. A végén Matlab-illusztrációk (kontrakciós együttható, $\sqrt 2$ közelítése különböző rendű iterációkkal, logisztikus leképezés).
>
> **Amit ez a PDF NEM tartalmaz** (de a tárgy témalistáján szerepel, és valószínűleg a 7. előadás anyaga): a **Newton-módszer**, a **szelőmódszer** és a **húrmódszer** önálló, részletes tárgyalása. Ezek itt csak utalásként bukkannak fel (a Newton a $\sqrt2$-példában mint $p=2$ rendű iteráció, a szelőmódszer a $p=\frac{1+\sqrt5}{2}$ konvergencia rend megjegyzésénél). A teljes kép kedvéért az összehasonlító táblázatokban beírom őket, és **[saját kiegészítés]** jelzéssel látom el azt, ami nem a diákról jön.

---

## 0. A feladat és az alapötlet (CORE)

A kiindulás: keressük egy $f:\mathbb{R}\to\mathbb{R}$ **nemlineáris** függvény gyökét (zérushelyét), azaz olyan $x^*$ pontot, amelyre

$$f(x^*)=0.$$

A „nemlineáris" itt a lényeg: lineáris egyenletekre/egyenletrendszerekre direkt módszerek vannak (Gauss, LU), de egy általános nemlineáris egyenletre **nincs véges lépéses zárt megoldóképlet**. Ezért **iterálunk**: egy közelítő sorozatot gyártunk, amely a gyökhöz tart. Három alapkérdés végigkíséri az egészet: **létezik-e** gyök, **egyértelmű-e**, és **hány** van.

Az előadás kulcsötlete az **átfogalmazás fixpont-feladattá**. A gyökkereső feladat majdnem mindig átírható úgy, hogy

$$f(x)=0 \quad\Longleftrightarrow\quad x=\varphi(x),$$

ahol $x^*$ most már a $\varphi$ függvény **fixpontja** ($x^*=\varphi(x^*)$). Ez azért hasznos, mert a fixpontot egy egyszerű **iterációval** kereshetjük:

$$x_{k+1}=\varphi(x_k).$$

> **Az analógia, amit a dia csak felvillant:** lineáris egyenletrendszereknél ugyanezt csináltuk — $Ax=b \Leftrightarrow x=Bx+c$, és innen $x^{(k+1)}=B x^{(k)}+c$. A nemlineáris eset ennek az általánosítása: a $B$ mátrixszal való szorzás helyét egy tetszőleges $\varphi$ leképezés veszi át. Az iteráció konvergenciáját ott a $B$ normája szabta meg; itt majd a $\varphi$ „összehúzó" képessége (kontrakció) fogja.

Egy adott $f=0$ egyenlethez **többféle** $\varphi$ is felírható, és **nem mindegyik használható** — lesz, amelyikkel az iteráció konvergál, lesz, amelyikkel divergál. Ez később kulcsfontosságú lesz.

**Vizsgára fontos (0):**
- A nemlineáris gyökkeresés iteratív, mert nincs általános zárt képlet.
- Az $f(x)=0 \Leftrightarrow x=\varphi(x)$ átfogalmazás teszi lehetővé a fixpont-iterációt; ugyanahhoz az $f$-hez **több** $\varphi$ tartozhat, és ezek konvergencia szempontból nem egyenértékűek.

---

## 1. Bolzano-tétel és intervallumfelezés

### 1.1 Bolzano-tétel (CORE)

> **Tétel (Bolzano).** Ha $f\in C[a;b]$ és $f(a)\cdot f(b)<0$, akkor $\exists\, x^*\in(a;b):\ f(x^*)=0.$

Bontsuk szét a feltételeket, mert minden szó számít:
- $a,b\in\mathbb{R}$, $a<b$, az $[a;b]$ **zárt** intervallum.
- $C[a;b]$: az $[a;b]$-n **folytonos** függvények halmaza. A folytonosság elengedhetetlen — szakadás esetén a függvény „átugorhat" a nullán előjelváltás nélkül vagy fordítva.
- $f(a)\cdot f(b)<0$ azt jelenti, hogy $f(a)$ és $f(b)$ **különböző előjelűek** (az egyik végpontban negatív, a másikban pozitív).
- Következmény: van gyök az **(a;b) nyílt** intervallumban.

**A tétel intuíciója:** ha egy folytonos görbe az egyik végpontnál a vízszintes tengely alatt, a másiknál fölötte van, akkor valahol át kell metszenie a tengelyt. Ez nyilvánvalónak tűnik, de a folytonosságon múlik.

> ⚠️ **NUANCE — két klasszikus csapda:**
> 1. **A Bolzano-feltétel elégséges, de NEM szükséges.** Egy függvénynek lehet gyöke előjelváltás nélkül is (pl. érintőlegesen, mint $x^2$ az origóban: $x^2$ pozitív mindkét oldalon, mégis van gyök az origóban). Tehát ha $f(a)\cdot f(b)>0$, abból **nem következik**, hogy nincs gyök — csak az, hogy a Bolzano-tétel nem alkalmazható.
> 2. **A Bolzano-tétel csak LÉTEZÉST ad, NEM egyértelműséget.** Páratlan számú gyök is okozhat előjelváltást; a tétel nem mondja meg, hány gyök van, csak azt, hogy legalább egy van.

### 1.2 Az intervallumfelezés módszere (CORE)

A Bolzano-tétel bizonyítása egyben **konstruktív algoritmus** is — ez maga az intervallumfelezés (bisekció):

1. Legyen $x_0:=a,\ y_0:=b$ (az induló intervallum a teljes $[a;b]$).
2. Ismételjük:
   - Számoljuk ki a felezőpontot: $s_k:=\tfrac12(x_k+y_k)$.
   - Ha $f(x_k)\cdot f(s_k)<0$ (előjelváltás a bal felében van), akkor $x_{k+1}:=x_k,\ y_{k+1}:=s_k$ (a bal felet tartjuk meg).
   - Ha $f(x_k)\cdot f(s_k)>0$ (előjelváltás a jobb felében van), akkor $x_{k+1}:=s_k,\ y_{k+1}:=y_k$ (a jobb felet tartjuk meg).
3. Megállunk, ha
   - egyenlőség teljesül ($f(s_k)=0$), ekkor $x^*=s_k$ pontosan, **vagy**
   - elértük a kívánt pontosságot; ekkor $x^*\in(x_k,y_k)$, és az intervallumhossz minden lépésben feleződik: $y_k-x_k=\dfrac{y_{k-1}-x_{k-1}}{2}$.

A lényeg, hogy minden lépésben **megőrizzük az előjelváltást tartalmazó felet** — így a Bolzano-feltétel végig fennáll, a gyök benne marad a zsugorodó intervallumban.

**Hibabecslések** (ezek vizsgakedvencek):

$$|x_k-x^*|<\frac{b-a}{2^k},\qquad |y_k-x^*|<\frac{b-a}{2^k},\qquad |s_k-x^*|<\frac{b-a}{2^{k+1}}.$$

A felezőpont $s_k$ a legjobb tipp, ezért az ő hibája feleakkora korlátú, mint a végpontoké.

> **Megjegyzés a diáról:** a gyakorlatban „általában nem tapasztalunk egyenlőséget" (lebegőpontos számokkal $f(s_k)$ pontosan 0 ritkán lesz), ezért a leállás szinte mindig a pontossági feltétel miatt történik. Az $(x_k)$ és $(y_k)$ sorozatok konvergenciájának részletes elemzése az Analízis tárgyhoz tartozik.

**Példa (csak a tanulság miatt):** a $P(x)=x^3+3x-2$ polinom egy gyökét keressük $0.1$ pontossággal a $[0;1]$-en. Itt $P(0)=-2<0$, $P(1)=2>0$, tehát Bolzano szerint van gyök. A hibakorlát $\frac{1}{2^k}<\frac{1}{10}\Leftrightarrow k>3$, vagyis **legalább 4 lépés** kell. A dia kommentárja: „**Lassú**". Ez a módszer fő üzenete — biztos, de lassú.

> 💡 **A bisekció karaktere (CORE):** Ez a **legrobusztusabb** módszer. Egyetlen feltétel kell hozzá: folytonosság + előjelváltás. Cserébe **lineárisan**, $\tfrac12$ aránnyal konvergál: minden lépés egy bit pontosságot ad, kb. **3,3 lépés / tizedesjegy**. Nem használ deriváltat, nem tud „elszállni", de a gyorsabb módszerekhez (Newton: kvadratikus) képest lassú.

### 1.3 A gyök egyértelműsége (CORE)

A Bolzano önmagában nem ad egyértelműséget. Ehhez egy plusz feltétel kell:

> **Tétel (a gyök egyértelmű létezéséről).** Ha
> 1. $f\in C[a;b]$ és $f(a)\cdot f(b)<0$, **valamint**
> 2. $f\in D(a;b)$ (deriválható) és $f'>0$ (vagy $f'<0$ végig),
>
> akkor $\exists!\, x^*\in(a;b):\ f(x^*)=0.$

**Bizonyítás-vázlat:** a Bolzano-tétel adja a létezést; a $f'$ állandó előjele miatt $f$ **szigorúan monoton**, márpedig szigorúan monoton függvény legfeljebb egyszer metszheti a tengelyt — innen az egyértelműség.

> ⚠️ **NUANCE:** a **monotonitás** (állandó előjelű derivált) az, ami a több gyököt kizárja. A Bolzano = létezés; Bolzano + szigorú monotonitás = pontosan egy gyök. Vizsgán szeretik ezt a kettőt összekeverni.

**Vizsgára fontos (1):**
- A Bolzano-feltétel ($C[a;b]$ + előjelváltás) **elégséges, de nem szükséges** a gyök létezéséhez, és **csak létezést** ad, egyértelműséget nem.
- Egyértelműséghez kell még a **szigorú monotonitás** ($f'$ állandó előjelű).
- Az intervallumfelezés mindig konvergál a Bolzano-feltétel mellett; a hibakorlát $\frac{b-a}{2^k}$, a felezőpontnál $\frac{b-a}{2^{k+1}}$ — **lineáris, $\tfrac12$ arányú** (lassú, de biztos).

---

## 2. Fixponttételek és egyszerű iterációk

Itt az $x=\varphi(x)$ átfogalmazás kerül a középpontba, és három tétel mondja meg, mikor **létezik** fixpont, mikor **egyértelmű**, és mikor **konvergál hozzá** az iteráció.

### 2.1 Fixpont és kontrakció (CORE)

> **Definíció (fixpont).** Az $x^*$ pont a $\varphi$ leképezés fixpontja, ha $x^*=\varphi(x^*)$.

> **Definíció (kontrakció).** A $\varphi:[a;b]\to\mathbb{R}$ leképezés **kontrakció** $[a;b]$-n, ha $\exists\, q\in[0,1)$, hogy
> $$|\varphi(x)-\varphi(y)|\le q\cdot|x-y|\qquad \forall x,y\in[a;b].$$

Itt $q$ a **kontrakciós együttható**. A kontrakció szó szerint „összehúzás": $\varphi$ a pontok közti távolságot egy $q<1$ faktorral csökkenti. Ez az iteráció konvergenciájának motorja — ha minden lépésben $q$-szorosára zsugorodik a gyöktől való távolság, akkor az iteráció hozzá tart.

> **Fontos részlet:** $q<1$ szigorú. Ha $q=1$ megengedett lenne, az már nem garantálna összehúzást (a távolság nem feltétlenül csökkenne).

**Hogyan ellenőrizzük gyakorlatban a kontrakciót?** Erre szolgál a következő állítás:

> **Állítás.** Ha
> 1. $\varphi\in C^1[a;b]$ ($\varphi$ egyszer folytonosan deriválható), **és**
> 2. $|\varphi'(x)|<1$ minden $x\in[a;b]$-re,
>
> akkor $\varphi$ kontrakció $[a;b]$-n.

**Bizonyítás (a Lagrange-középértéktétellel):** legyen $q:=\max_{x\in[a;b]}|\varphi'(x)|<1$. Tetszőleges $x<y$-ra $\exists\,\xi\in(x;y)$, hogy
$$|\varphi(x)-\varphi(y)|=|\varphi'(\xi)|\cdot|x-y|\le q\cdot|x-y|.$$

> ⚠️ **NUANCE — a kontrakció INTERVALLUMFÜGGŐ.** Ugyanaz a $\varphi$ az egyik intervallumon kontrakció lehet, a másikon nem (mert $\max|\varphi'|$ más). Soha ne mondd, hogy „$\varphi$ kontrakció" intervallum megadása nélkül.

### 2.2 Brouwer-féle fixponttétel — LÉTEZÉS (CORE)

> **Tétel (Brouwer).** Ha
> 1. $\varphi:[a;b]\to[a;b]$ (önmagába képez), **és**
> 2. $\varphi\in C[a;b]$ (folytonos),
>
> akkor $\exists\, x^*\in[a;b]:\ \varphi(x^*)=x^*.$

**Bizonyítás-vázlat:** vezessük be a $g(x)=x-\varphi(x)$ függvényt, és alkalmazzuk a Bolzano-tételt. Mivel $\varphi(a),\varphi(b)\in[a;b]$, ezért $g(a)=a-\varphi(a)\le0$ és $g(b)=b-\varphi(b)\ge0$, tehát $g(a)\cdot g(b)\le0$. Ha a szorzat $=0$, akkor $a$ vagy $b$ maga fixpont; ha $<0$, akkor Bolzano szerint $g$-nek van gyöke, ami épp a fixpont.

> 💡 **Mit ad és mit NEM ad a Brouwer?** Csak a fixpont **létezését**. Nem mond semmit az egyértelműségről, és **nem garantálja**, hogy az $x_{k+1}=\varphi(x_k)$ iteráció konvergál hozzá! A feltétel mindössze: önmagába képezés + folytonosság. **Nem kell** hozzá kontrakció.

### 2.3 Banach-féle fixponttétel — LÉTEZÉS + EGYÉRTELMŰSÉG + KONVERGENCIA (CORE)

Ez a fejezet csúcstétele.

> **Tétel (Banach, $[a;b]$-re).** Ha a $\varphi:[a;b]\to[a;b]$ függvény **kontrakció** $[a;b]$-n $q$ együtthatóval, akkor
> 1. $\exists!\, x^*\in[a;b]:\ x^*=\varphi(x^*)$ — **egyetlen** fixpont létezik,
> 2. **minden** $x_0\in[a;b]$ esetén az $x_{k+1}=\varphi(x_k)$ sorozat **konvergens**, és $\lim_{k\to\infty}x_k=x^*$,
> 3. teljesülnek a hibabecslések:
> $$|x_k-x^*|\le q^k\cdot|x_0-x^*|\le q^k(b-a)\qquad\text{(a priori, durva korlát)}$$
> $$|x_k-x^*|\le \frac{q^k}{1-q}\cdot|x_1-x_0|\qquad\text{(a posteriori, csak az első lépésből számolható)}.$$

A két hibabecslés különbsége gyakorlati: az elsőhöz ismerni kéne $x^*$-ot (vagy az intervallumhosszt használjuk felső korlátnak), a második viszont **csak az első két iterált különbségéből** ad korlátot — ezt tényleg ki lehet számolni a gyök ismerete nélkül.

> 💡 **A Brouwer ↔ Banach különbség (KLASSZIKUS CSAPDA).** A Brouwer gyengébb feltételből (önmagába képezés + folytonosság) gyengébb állítást ad (csak létezés). A Banach erősebb feltételből (**kontrakció**, ami a folytonosságnál és önmagába képezésnél több) sokkal többet: **egyértelműség + konvergencia bármely kezdőpontból + hibabecslés**. A kontrakció a kulcs, ami a többletet hozza.

### 2.4 Elégséges feltétel az iteráció konvergenciájára (CORE + NUANCE)

A Banach gyakorlati következménye:

> **Következmény.** Ha
> 1. $\varphi:[a;b]\to[a;b]$,
> 2. $\varphi\in C^1[a;b]$, **és**
> 3. $|\varphi'(x)|<1$ minden $x\in[a;b]$-re,
>
> akkor az $x_{k+1}=\varphi(x_k)$ iteráció konvergens **minden** $x_0\in[a;b]$ esetén.

> ⚠️ **NUANCE — ez ELÉGSÉGES, de NEM SZÜKSÉGES feltétel.** A dia kiemeli: „Attól még lehet konvergens a sorozat, ha valahol $|\varphi'|\ge1$." Tehát ha valahol a derivált abszolút értéke eléri vagy meghaladja az 1-et, abból **nem következik**, hogy az iteráció divergál. A $|\varphi'|<1$ csak egy kényelmes garancia, nem feltétel-szükséglet. Ezt vizsgán szeretik „igaz, kivéve…" formában kérdezni.
>
> ⚠️ **NUANCE — az önmagába képezés ($\varphi:[a;b]\to[a;b]$) sem hagyható el.** Ha $\varphi$ kivezet az intervallumból, a tétel nem alkalmazható, és az iteráció „kiszökhet". A két feltétel (önmagába képez + derivált korlát) együtt kell.

### 2.5 Lokális fixponttétel (CORE, alacsonyabb prioritás)

Mi van, ha a globális kontrakció nem teljesül az egész $[a;b]$-n, de a gyök közelében igen? Erre a lokális változat:

> **Tétel (lokális fixponttétel).** Legyen $\varphi:[a;b]\to\mathbb{R}$.
> 1. Ha $\varphi\in C^1[a;b]$, és
> 2. $\exists\,\xi\in[a;b]$ és $\delta>0$, hogy $|\varphi'(x)|\le q<1$ minden $x\in[\xi-\delta;\xi+\delta]\subset[a;b]$-re,
> 3. és $\exists\,r:\ 0<r\le\delta$, hogy $|\varphi(\xi)-\xi|\le(1-q)r$ (azaz $\xi$ **elég jó közelítése** a fixpontnak),
>
> akkor $\varphi$ kontrakció $[\xi-r;\xi+r]$-en, és $\varphi$ ezt az intervallumot **önmagába** képezi.

A 3. feltétel intuíciója: ha az induló tipp $\xi$ már elég közel van a fixponthoz (a „reziduum" $|\varphi(\xi)-\xi|$ kicsi a $q$-hoz és $r$-hez képest), akkor a kontraktivitás biztosítja, hogy az iteráció nem szökik ki a $[\xi-r;\xi+r]$ környezetből.

> **Következmény:** ha a lokális feltételek teljesülnek, akkor **valójában a Banach-tétel feltételei állnak fenn a $[\xi-r;\xi+r]$ intervallumon**, így ott egyetlen fixpont van, az iteráció minden $x_0\in[\xi-r;\xi+r]$-ből konvergál, és ugyanazok a hibabecslések érvényesek.

> 💡 **A tanulság:** a globális (Banach) és a lokális tétel ugyanazt ígéri (egyértelműség + konvergencia + hibabecslés), csak a lokális egy **kisebb, a gyök körüli környezetre** szorítkozik, ahol a kontrakció már fennáll. Ez magyarázza, miért „local convergence" sok módszer (pl. Newton) tulajdonsága: csak elég jó kezdőpontból garantált.

### 2.6 Egyszerű iterációk — szemléltető példák (CORE intuíció)

A dia zsebszámológépes példái nagyon tanulságosak a fixpont-iteráció viselkedésére:

| Egyenlet | Iteráció | Fixpontok | Mi történik? |
|---|---|---|---|
| $x=x^2$ | $x_{k+1}=x_k^2$ | $0$ és $1$ | $0\le x_0<1\Rightarrow \lim x_k=0$; $x_0=1\Rightarrow \lim x_k=1$ |
| $x=\sqrt{x}$ | $x_{k+1}=\sqrt{x_k}$ | $0$ és $1$ | $x_0=0\Rightarrow 0$; $0<x_0\le1\Rightarrow \lim x_k=1$ |
| $x=\cos x$ | $x_{k+1}=\cos x_k$ | egyetlen, $\approx0.739$ | minden $x_0\in[0,1]$-ből konvergál |

> 💡 **A „stabil vs. instabil fixpont" intuíció [saját kiegészítés a két első példa megértéséhez]:** ahol $|\varphi'(x^*)|<1$, ott a fixpont **vonzó** (az iteráció odatart); ahol $|\varphi'(x^*)|>1$, ott **taszító** (az iteráció elszökik tőle). Az $x=x^2$ esetben $\varphi'(x)=2x$: a $0$-ban $\varphi'(0)=0<1$ (vonzó), az $1$-ben $\varphi'(1)=2>1$ (taszító) — ezért fut a $0$-hoz minden belső pontból, és csak a pontos $x_0=1$ marad az $1$-en. A $\sqrt x$-nél pont fordítva. Ezt a diák nem mondják ki, de ez a magyarázat a megfigyelt viselkedésre.

**A $x=\cos x$ teljes elemzése (mintapélda a tételek alkalmazására):** keressük az $x=\cos x$ fixpontját a $[0,1]$-en, $x_{k+1}=\cos x_k$ iterációval.

1. **Önmagába képez?** $\varphi'(x)=-\sin x<0$ a $[0;1]$-en, tehát $\varphi$ szigorúan monoton fogyó, és $\varphi([0;1])=[\cos1,\,1]\subset[0;1]$. Igen, $\varphi:[0;1]\to[0;1]$. ✓
2. **Kontrakció?** A Lagrange-tétellel a kontrakciós együttható $q:=\max_{\xi\in[0;1]}|-\sin\xi|=\sin1\approx0.8415<1$. ✓
3. **Banach feltételei teljesülnek** → létezik egyetlen fixpont, és az iteráció konvergál.
4. **Hibabecslés:** $|x_k-x^*|\le 0.8415^k\cdot|x_0-x^*|\le 0.8415^k.$
5. **Lépésszám $0.1$ pontossághoz:** $0.8415^k<\tfrac1{10}\Leftrightarrow k>\frac{-1}{\lg 0.8415}\approx13.34$, tehát kb. **14 lépés**. A dia kommentárja: „**Nagyon lassú**".

> 💡 **A két lassúság összevetése:** a bisekciónál $q$ effektíve $\tfrac12$, a $\cos$-iterációnál $q\approx0.8415$. Mivel $0.8415$ közelebb van $1$-hez, ez az iteráció **még lassabb**, mint a felezés ebben az esetben. A konvergencia sebességét a $q$ (lineáris esetben) vagy a konvergencia rend (lásd 3. fejezet) szabja meg — minél kisebb $q$, annál gyorsabb.

**Vizsgára fontos (2):**
- **Brouwer** = létezés (önmagába képezés + folytonosság, kontrakció **nem** kell). **Banach** = egyértelműség + konvergencia + hibabecslés (kontrakció **kell**).
- A $|\varphi'(x)|<1$ az egész intervallumon **elégséges, de nem szükséges** feltétele a konvergenciának; az **önmagába képezés** sem hagyható el.
- A kontrakció **intervallumfüggő**; mindig $\max|\varphi'|$ adja a $q$ együtthatót.
- A lokális fixponttétel a Banachot egy gyök körüli kis környezetre alkalmazza, ha globálisan nincs kontrakció.
- A fixpont **vonzó**, ha $|\varphi'(x^*)|<1$, és **taszító**, ha $|\varphi'(x^*)|>1$.

---

## 3. Konvergencia rend

Ez a fejezet a „milyen **gyorsan** konvergál" kérdést teszi pontossá, és ez a vizsga egyik kedvenc témaköre.

### 3.1 A definíció (CORE)

> **Definíció (konvergencia rend).** Az $(x_k)$ konvergens sorozat — határértéke $x^*$ — **$p$-edrendben konvergens**, ha $\exists\, c\in(0;+\infty)$, hogy
> $$\lim_{k\to\infty}\frac{|x_{k+1}-x^*|}{|x_k-x^*|^{\,p}}=c.$$

Itt $c$ az aszimptotikus hibaállandó. A definíció lényege: a $(k+1)$-edik lépés hibája a $k$-adik lépés hibájának **$p$-edik hatványával** arányos. Minél nagyobb $p$, annál drámaibban csökken a hiba.

**Megjegyzések (mind vizsgaanyag):**
- $p$ **egyértelmű**, és $p\ge1$.
- $p$ **nem feltétlenül egész** szám. (A szelőmódszernél például $p=\frac{1+\sqrt5}{2}\approx1.618$, az aranymetszés.)
- $p=1$: **elsőrendű** vagy **lineáris** konvergencia (ekkor szükségképpen $c\le1$, különben nem tartana 0-hoz a hiba).
- $p=2$: **másodrendű** vagy **kvadratikus** konvergencia.
- $p>1$: **szuperlineáris** konvergencia (a lineárisnál gyorsabb).

**A „legalább $p$-edrendű" gyakorlati megfogalmazás** (a határérték helyett egyenlőtlenséggel):
$$\exists\, K\in\mathbb{R}^+:\ \forall k:\ |x_{k+1}-x^*|\le K\cdot|x_k-x^*|^{\,p}.$$

> ⚠️ **NUANCE — a $c$ értéke árulkodó:**
> - Ha a $\lim$ a választott $p$-vel **$c=0$**, akkor a tényleges konvergencia rend **nagyobb**, mint $p$ (alábecsültük).
> - Ha a $\lim$ **$c=\infty$**, akkor a tényleges rend **kisebb**, mint $p$ (túlbecsültük).
> A helyes $p$-t úgy találjuk meg, hogy az a kitevő, amelyre a határérték véges és pozitív.
>
> ⚠️ **NUANCE — a fixponttételek NEM mondanak konvergencia rendet!** A Banach/lokális tétel csak annyit garantál, hogy a konvergencia **legalább elsőrendű** (lineáris). A magasabb rendhez (lásd 3.3) extra feltétel — a deriváltak eltűnése a fixpontban — szükséges.

### 3.2 Mit jelent ez számokban? (CORE intuíció)

A dia a $\sqrt2$ közelítésén illusztrálja (a pontos érték $\approx1.41421356$):
- **$p=1$ (lineáris):** minden lépésben kb. **egy újabb tizedesjegy** lesz pontos. (Pl. $1.4141\to1.4142\to1.41421\dots$)
- **$p=2$ (kvadratikus):** minden lépésben kb. **kétszer annyi** tizedesjegy lesz pontos (a pontos jegyek száma duplázódik). (Pl. $1.41\to1.4142\to1.41421356\dots$)

Ez a különbség gyakorlatban óriási: a kvadratikus módszer néhány lépésben gépi pontosságot ér el, míg a lineáris tucatnyi lépést is igényelhet.

**Egy konkrét rendmeghatározás (a dia kidolgozott példája):** az $x_k=\tfrac{1}{2^k}$ nullsorozatra
- $p=2$-vel: $\lim\frac{1/2^{k+1}}{(1/2^k)^2}=\lim 2^{k-1}=\infty$ → túl nagy $p$, kisebbel kell próbálni.
- $p=1$-gyel: $\lim\frac{1/2^{k+1}}{1/2^k}=\lim\frac12=\frac12$ → véges, pozitív, tehát **elsőrendű** ($c=\tfrac12$).

### 3.3 Magasabbrendben konvergens iterációk (CORE — a legfontosabb tétel itt)

> **Tétel ($p$-edrendben konvergens iterációk).** Ha
> 1. $\varphi\in C^p[a;b]$,
> 2. az $x_{k+1}=\varphi(x_k)$ sorozat konvergens, határértéke $x^*$, **és**
> 3. $\varphi'(x^*)=\varphi''(x^*)=\cdots=\varphi^{(p-1)}(x^*)=0$, de $\varphi^{(p)}(x^*)\ne0$,
>
> akkor a konvergencia **$p$-edrendű**, és a hibabecslés
> $$|x_{k+1}-x^*|\le\frac{M_p}{p!}\,|x_k-x^*|^{\,p},\qquad M_p=\max_{\xi\in[a;b]}|\varphi^{(p)}(\xi)|.$$

**Bizonyítás-ötlet:** írjuk fel $\varphi$ Taylor-polinomját $x^*$ körül a Lagrange-maradéktaggal. Mivel az első $p-1$ derivált eltűnik $x^*$-ban, a Taylor-sor első nem nulla tagja a $p$-edik:
$$\varphi(x_k)=\varphi(x^*)+\frac{\varphi^{(p)}(\xi_k)}{p!}(x_k-x^*)^p.$$
Mivel $\varphi(x_k)=x_{k+1}$ és $\varphi(x^*)=x^*$, átrendezve $x_{k+1}-x^*=\frac{\varphi^{(p)}(\xi_k)}{p!}(x_k-x^*)^p$, ahonnan a hányados határértéke $\frac{\varphi^{(p)}(x^*)}{p!}\ne0$, vagyis $p$-edrendű a konvergencia.

> 💡 **Ez a tétel a kulcs a Newton kvadratikusságához [saját kiegészítés, mert a dia csak utal rá]:** a Newton-módszer iterációs függvénye $\varphi(x)=x-\frac{f(x)}{f'(x)}$. Egyszerű gyök esetén kiszámolható, hogy $\varphi'(x^*)=0$, de $\varphi''(x^*)\ne0$ — tehát épp $p=2$. Ezért **másodrendű** a Newton. A $\sqrt2$-példa $x_{k+1}=\tfrac12(x_k+\tfrac{2}{x_k})$ iterációja épp az $f(x)=x^2-2$-re alkalmazott Newton, ezért $p=2$.

**Következmény (a kontrakcióval összeházasítva):** ha $\varphi:[a;b]\to[a;b]$ kontrakció, $x^*$ a fixpontja, és $\varphi'(x^*)=\cdots=\varphi^{(p-1)}(x^*)=0$, de $\varphi^{(p)}(x^*)\ne0$, akkor a fixpont egyértelmű, az iteráció minden $x_0$-ból konvergál, **és** a konvergencia $p$-edrendű a fenti hibabecsléssel. (Ez a Banach-tétel és a $p$-edrendű tétel egyesítése.)

### 3.4 Egy iteráció kiválasztásának tanulsága

A dia példája: az $x^3-x-1=0$ egyenlethez kétféle átírás:
- (a) $x=x^3-1$,
- (b) $x=\sqrt[3]{x+1}$.

Az egyik konvergens, a másik divergens. **Miért?** [saját kiegészítés a magyarázathoz] A $\varphi_a(x)=x^3-1$ deriváltja $3x^2$, ami a gyök ($\approx1.3247$) körül $\approx5.26>1$ → taszító, **divergens**. A $\varphi_b(x)=\sqrt[3]{x+1}$ deriváltja $\frac{1}{3}(x+1)^{-2/3}$, ami a gyök körül $<1$ → vonzó, **konvergens**. Ez tökéletesen illusztrálja, hogy **ugyanahhoz az egyenlethez tartozó különböző $\varphi$-k közül a $|\varphi'(x^*)|<1$ dönti el, melyik használható**.

**Vizsgára fontos (3):**
- A konvergencia rend $p\ge1$, **egyértelmű**, és **nem feltétlenül egész** (szelő: $\frac{1+\sqrt5}{2}$).
- $c=0$ → a valós rend nagyobb; $c=\infty$ → kisebb a feltételezettnél.
- A **fixponttételek csak legalább elsőrendet** garantálnak; magasabb rendhez a deriváltaknak el kell tűnniük a fixpontban.
- $p$ derivált eltűnése ($\varphi'(x^*)=\cdots=\varphi^{(p-1)}(x^*)=0$, $\varphi^{(p)}(x^*)\ne0$) → pontosan $p$-edrendű konvergencia. Innen érthető a **Newton kvadratikussága** ($\varphi'(x^*)=0$).
- Lineáris: ~1 új jegy / lépés; kvadratikus: a jegyek számának ~megduplázódása / lépés.

---

## 4. Matlab-példák (SKIP/COMPRESS — illusztráció, nem önálló tananyag)

A 4. szakasz főleg szemléltetés; vizsgára a tanulságok számítanak, a konkrét kód nem:
- **Intervallumfelezés** és **$x=\cos x$ iteráció** vizualizálása.
- **Tapasztalati kontrakciós együttható:** a $\cos$-iterációnál az egymást követő lépések arányának mértani közepe $q\approx0.6736$ (ez az aszimptotikus, „valódi" lineáris arány a gyök közelében, ami kisebb a globális $\sin1\approx0.8415$ felső korlátnál — a globális korlát pesszimista).
- **$\sqrt2$ közelítése három különböző rendű iterációval** (ez a 3. fejezet illusztrációja):

| Iteráció | Képlet | Rend |
|---|---|---|
| Lánctört | $x_{k+1}=1+\dfrac{1}{1+x_k}$ | $p=1$ (lineáris) |
| Newton ($f=x^2-2$) | $x_{k+1}=\dfrac12\left(x_k+\dfrac{2}{x_k}\right)$ | $p=2$ (kvadratikus) |
| Másodfokú Taylor | $x_{k+1}=x_k\cdot\dfrac{x_k^2+6}{3x_k^2+2}$ | $p=3$ (köbös) |

- **Logisztikus leképezés** ($x_{n+1}=k\,x_n(1-x_n)$) — érdekességként, a káoszelmélet felé mutató kitekintés. Populációdinamikai modell; $1<k<4$ esetén a megoldás a $(0,1)$-ben marad, $k<1$ esetén kihalás ($x\to0$). A $k$ (vagy $\alpha$) paraméter növelésével: $3.0$-nál a fixpont instabillá válik (oszcilláció indul), $3.45$ perióduskettőződés, $3.57$ a kaotikus tartomány kezdete, $4.0$ a vége. **Megjegyzés:** ez a leképezés **általában nem kontrakció** — itt épp a tételek feltételeinek sérülését látjuk, és azt, mi történik akkor (bifurkáció, káosz).

> **Vizsgára fontos (4):** a $\sqrt2$-példa azt mutatja, hogy ugyanahhoz a gyökhöz **különböző rendű** iterációk építhetők ($p=1,2,3$), és a magasabb rend gyorsabb konvergenciát jelent. A logisztikus leképezés ellenpélda: ha nincs kontrakció, az iteráció oszcillálhat vagy kaotikussá válhat.

---

## Összefoglaló összehasonlító táblázatok

### A három fixponttétel — mit követel, mit ad

| Tétel | Feltételek | Mit garantál? |
|---|---|---|
| **Bolzano** | $f\in C[a;b]$, $f(a)f(b)<0$ | gyök **létezése** (nem egyértelmű!) |
| **Egyértelműségi** | Bolzano + $f$ szig. monoton ($f'$ áll. előjelű) | **pontosan egy** gyök |
| **Brouwer** | $\varphi:[a;b]\to[a;b]$, $\varphi\in C[a;b]$ | fixpont **létezése** (egyértelműség és konvergencia nélkül) |
| **Banach** | $\varphi:[a;b]\to[a;b]$ **kontrakció** | **egyetlen** fixpont + konvergencia bármely $x_0$-ból + hibabecslés |
| **Lokális** | $C^1$ + $|\varphi'|\le q<1$ egy környezetben + jó kezdő $\xi$ | Banach állításai egy **kis környezetben** |

### A két fő módszer egymás mellett

| Szempont | Intervallumfelezés | Fixpont-iteráció |
|---|---|---|
| Feltétel | folytonosság + előjelváltás (Bolzano) | $\varphi:[a;b]\to[a;b]$ + (általában) kontrakció |
| Deriválhatóság kell? | **Nem** | a kontrakció ellenőrzéséhez $C^1$ kényelmes, de nem feltétlen |
| Konvergencia garantált? | **Igen**, ha Bolzano áll | csak megfelelő $\varphi$-vel; rossz $\varphi$ divergál |
| Sebesség | lineáris, $\tfrac12$ arány (~3,3 lépés/jegy) | lineáris (de a rend növelhető, pl. Newton-szerűen) |
| Robusztusság | **nagyon** (nem tud elszállni) | $\varphi$ és $x_0$ megválasztásától függ |
| Jelleg | biztos, de lassú | lehet gyors, de feltételesebb |

### Konvergencia rendek (a tárgy módszerei) — [a Newton/szelő/húr más előadásból, kiegészítésként]

| Módszer | Rend $p$ | Megjegyzés |
|---|---|---|
| Intervallumfelezés | lineáris ($\tfrac12$ arány) | mindig konvergál, deriválttól független |
| Fixpont-iteráció ($\varphi'(x^*)\ne0$) | $p=1$ lineáris | sebesség $\sim|\varphi'(x^*)|$ |
| Newton | $p=2$ kvadratikus | mert $\varphi'(x^*)=0$; csak lokálisan, deriváltat igényel |
| Szelőmódszer | $p=\frac{1+\sqrt5}{2}\approx1.618$ | szuperlineáris, **nem egész** rend, derivált nélkül |
| Húrmódszer (regula falsi) | $p=1$ lineáris | egyik végpont rögzül; biztos, mint a felezés |

> A Newton/szelő/húr sorok az áttekintés kedvéért szerepelnek — **ez a PDF ezeket nem tárgyalja részletesen**, csak utal rájuk.

---

## Önellenőrző kérdések (vizsga-stílusú, a finomságokra élezve)

**1.** Az $f\in C[a;b]$, $f(a)\cdot f(b)<0$ feltételről melyik IGAZ?
- A) Garantálja, hogy pontosan egy gyök van $(a;b)$-ben.
- B) Garantálja, hogy van gyök, de nem feltétlenül egyetlen.
- C) Szükséges feltétele a gyök létezésének.
- D) Csak akkor érvényes, ha $f$ deriválható.

**2.** Mi a fő különbség a Brouwer- és a Banach-féle fixponttétel között?
- A) A Brouwer egyértelmű fixpontot garantál, a Banach csak létezést.
- B) A Banach gyengébb feltételből ad többet.
- C) A Brouwer csak létezést ad (önmagába képezés + folytonosság), a Banach a kontrakció miatt egyértelműséget és konvergenciát is.
- D) Mindkettő megköveteli a kontrakciót.

**3.** Az $x_{k+1}=\varphi(x_k)$ iteráció konvergenciájáról melyik IGAZ?
- A) Csak akkor konvergál, ha $|\varphi'(x)|<1$ minden $x$-re (szükséges és elégséges).
- B) A $|\varphi'(x)|<1$ az egész intervallumon elégséges, de nem szükséges feltétel.
- C) Ha valahol $|\varphi'|\ge1$, akkor biztosan divergál.
- D) A konvergencia független attól, hogy $\varphi$ önmagába képez-e.

**4.** Egyszerű gyök esetén a Newton-módszer ($\varphi(x)=x-\frac{f(x)}{f'(x)}$) miért másodrendű?
- A) Mert $\varphi(x^*)=0$.
- B) Mert $\varphi'(x^*)=0$, de $\varphi''(x^*)\ne0$.
- C) Mert $|\varphi'|<1$ a gyök körül.
- D) Mert lineáris konvergenciájú.

**5.** A konvergencia rendről ($p$) melyik IGAZ?
- A) $p$ mindig egész szám.
- B) A fixponttételek $p=2$ konvergenciát garantálnak.
- C) Ha $\lim\frac{|x_{k+1}-x^*|}{|x_k-x^*|^p}=0$, akkor a tényleges rend nagyobb $p$-nél.
- D) $p<1$ is lehetséges.

**6.** Az intervallumfelezés és a kontrakción alapuló fixpont-iteráció összevetéséről melyik IGAZ?
- A) Az intervallumfelezés gyorsabb, mert kvadratikus.
- B) Az intervallumfelezés a Bolzano-feltétel mellett garantáltan konvergál, de lassú (lineáris, feleződő hiba), míg a fixpont-iteráció gyorsabb lehet, de megfelelő $\varphi$-t/kontrakciót igényel.
- C) A fixpont-iteráció tetszőleges $\varphi$-re mindig konvergál.
- D) Az intervallumfelezéshez deriválhatóság kell.

---

### Megoldások

| # | Helyes | Egysoros indoklás |
|---|---|---|
| 1 | **B** | Bolzano csak létezést ad, egyértelműséget nem; ráadásul elégséges, nem szükséges feltétel (gyök előjelváltás nélkül is lehet). |
| 2 | **C** | A Brouwer önmagába képezés + folytonosság mellett csak létezést ad; a kontrakció (Banach) hozza az egyértelműséget és a konvergenciát. |
| 3 | **B** | A $|\varphi'|<1$ elégséges, de nem szükséges; az iteráció akkor is konvergálhat, ha valahol $|\varphi'|\ge1$, és az önmagába képezés sem hagyható el. |
| 4 | **B** | A magasabbrendű iterációk tétele szerint az első nem nulla derivált rendje adja $p$-t; Newtonnál $\varphi'(x^*)=0$, $\varphi''(x^*)\ne0\Rightarrow p=2$. |
| 5 | **C** | $c=0$ alulbecslést jelent (a valós rend nagyobb). $p$ nem feltétlenül egész (szelő: 1.618), $p\ge1$, és a fixponttételek csak legalább elsőrendet adnak. |
| 6 | **B** | A felezés a legrobusztusabb, de lineáris ($\tfrac12$); a fixpont-iteráció gyorsabb lehet, de feltételesebb (jó $\varphi$, kontrakció). |

---

## Min menjünk mélyebbre?

Mondd meg, melyik irányba ássunk bele jobban:
1. **Brouwer vs. Banach vs. lokális** tétel finomságai, több „igaz, kivéve…" típusú csapdapélda.
2. **Konvergencia rend** — gyakorló rendmeghatározások adott sorozatokra, és miért lesz a Newton $p=2$, a szelő $p\approx1.618$ (a derivált-eltűnéses tétel részletei).
3. **Az intervallumfelezés vs. fixpont-iteráció** sebesség/robusztusság összehasonlítása, hibabecslések olvasása.
4. **Stabil/instabil fixpontok és a $|\varphi'(x^*)|$ szerepe** (a $x=x^2$, $x=\sqrt x$, $x^3-x-1=0$ példák teljes kibontása).
5. Előretekintés a **Newton-, szelő- és húrmódszerre** (a következő előadás anyaga), hogy a rend-táblázat összeálljon.
