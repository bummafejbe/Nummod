# Numerikus módszerek C — 10. előadás
## Csebisev-polinomok és a polinominterpoláció elmélete

> **Mit fed le ténylegesen ez a PDF?** A kurzus **Interpoláció** témaköréhez tartozik, annak elméleti „mélyvíz" része. Négy blokk: (1) **Csebisev-polinomok** és az általuk adott *optimális alappontválasztás*; (2) **az interpolációs polinomsorozat konvergenciája** (mikor tart $L_n \to f$); (3) a **Lagrange-interpoláció öröklött (adat)hibája** (Lebesgue-állandó); (4) **inverz interpoláció** mint gyökkereső eszköz. A polinomok gyökeinek/Horner-algoritmusnak ehhez nincs köze, és nincs benne sem gépi számábrázolás, sem lineáris egyenletrendszer.
>
> Ez a vizsgád szempontjából **kvalitatív, csapdás** anyag: alig kell számolni, viszont nagyon könnyű összekeverni a kvantorokat (∀/∃), a feltételeket, és hogy egy tulajdonság *az alappontoktól* vagy *a függvénytől* függ-e.

---

# 1. Csebisev-polinomok

## 1. TIER — CORE

**A definíció trükkje.** A Csebisev-polinomot először nem polinomként látjuk:
$$T_n(x) := \cos\big(n\cdot \arccos(x)\big), \qquad x\in[-1;1].$$
Ez elsőre egy *trigonometrikus* kifejezés — a meglepő állítás épp az, hogy **mégis polinom**. Az intuíció: vezessük be az $\alpha=\arccos(x)$ helyettesítést (vagyis $x=\cos\alpha$). Ekkor $T_n=\cos(n\alpha)$, és a $\cos(n\alpha)$ a koszinusz többszörös-szög azonosságai miatt kifejezhető $\cos\alpha=x$ hatványaival. Tehát a $\cos$-os alak csak „álca".

**A rekurzió — ez bizonyítja, hogy polinom (1. tétel).**
$$T_0(x)=1,\quad T_1(x)=x,\quad T_{n+1}(x)=2x\,T_n(x)-T_{n-1}(x).$$
A bizonyítás a $2\cos\alpha\cos(n\alpha)$ szorzat szögfüggvényes szétbontása. **Miért fontos ez?** Mert
- a rekurzió jobb oldalán *polinomokból* polinom keletkezik → indukcióval $T_n$ valóban polinom;
- a $\cos$-os definíció a $[-1;1]$-en érvényes, de a **rekurzió** $[-1;1]$-en kívül is kiszámítja a $T_n$ értékét (ott már $|T_n|>1$ lehet). A $\cos$-alak és a rekurzió ugyanazt a polinomot adja, csak az érvényességi tartomány más.

**Fokszám és főegyüttható (2. tétel).** $T_n\in P_n$ (pontosan $n$-edfokú), és a **főegyütthatója $2^{n-1}$** (ha $n\ge 1$). Ez közvetlenül a rekurzióból jön: minden lépésben a $2x\cdot$ szorzás duplázza a vezető együtthatót.

**A normált (1 főegyütthatós) változat.**
$$\widetilde{T}_n(x):=\frac{1}{2^{n-1}}\,T_n(x)\ \in\ P_n^{(1)},$$
ahol $P_n^{(1)}$ az **1 főegyütthatós (monikus)** $n$-edfokú polinomok halmaza. Ez a változat azért kell, mert az interpolációhibában szereplő $\omega_n$ szorzat is monikus — almát almával hasonlítunk össze. Mivel $\|T_n\|_\infty=1$ (koszinusz!), azonnal adódik $\|\widetilde{T}_n\|_\infty=\dfrac{1}{2^{n-1}}$.

**A gyökök és szélsőértékek (3.–4. tétel).**
- $T_n$-nek **$n$ db különböző valós gyöke** van $[-1;1]$-ben:
$$x_k=\cos\!\left(\frac{2k+1}{2n}\pi\right),\quad k=0,\dots,n-1.$$
- A gyökök a **0-ra szimmetrikusak**, és **a tartomány szélei felé sűrűsödnek** (a koszinusz miatt — egyenletesen elhelyezett szögek vetülete, lásd a fél-kör ábrát a fóliákon). Ez a sűrűsödés a *kulcs*: pont ez fékezi meg a Runge-jelenséget (lásd 2. fejezet).
- Paritás: $n$ páros → $T_n$ **páros** függvény; $n$ páratlan → **páratlan**.
- $T_n$-nek **$n+1$ db szélsőértékhelye** van $[-1;1]$-en, $\xi_k=\cos\!\big(\tfrac{k\pi}{n}\big)$, és ezekben az értékek **felváltva $+1$ és $-1$** (ez az ún. *equioszcilláció*). A $\pm1$-es maximumok és a szétszórt gyökök adják a „fésű" alakot a 8-adfokú ábrán.

**Ortogonalitás (5. tétel).** A $(T_n)$ rendszer **ortogonális** $[-1;1]$-en a
$$w(x)=\frac{1}{\sqrt{1-x^2}}$$
súlyfüggvény mellett: $\langle T_n,T_k\rangle_w=\int_{-1}^{1}\frac{T_n T_k}{\sqrt{1-x^2}}\,dx=0$, ha $n\ne k$. *(Bizonyítás: $y=\arccos x$ helyettesítéssel az integrál $\int_0^\pi \cos(ny)\cos(ky)\,dy$ alakra hozható, ami a koszinuszok ortogonalitása.)* A súlyfüggvény nem véletlen: pont a $\frac{1}{\sqrt{1-x^2}}$ az, ami a $\cos$-szubsztitúció Jacobiját „kiegyenesíti".

## A csúcspont: a Csebisev-tétel (minimax / extremális tulajdonság)

**6. tétel (Csebisev-tétel).** Az összes **monikus** $n$-edfokú polinom közül a normált Csebisev-polinomnak van a **legkisebb maximumnormája** $[-1;1]$-en:
$$\min_{\widetilde{Q}\in P_n^{(1)}}\ \|\widetilde{Q}\|_\infty \;=\; \|\widetilde{T}_n\|_\infty \;=\; \frac{1}{2^{\,n-1}}.$$

Ezt érdemes **„minimax-tulajdonságnak"** hívni: a sok egyenlő magasságú, váltakozó előjelű csúcs (equioszcilláció) miatt nem lehet egyetlen monikus polinommal sem „laposabbra" nyomni a maximumot. *Ez az egész fejezet veleje* — minden interpolációs következmény innen ered.

**Következmény — optimális alappontválasztás.** Az interpoláció hibaformulájában
$$f(x)-L_n(x)=\frac{f^{(n+1)}(\eta)}{(n+1)!}\,\omega_n(x),\qquad \omega_n(x)=\prod_{j=0}^{n}(x-x_j),$$
az $\omega_n$ **monikus, $(n+1)$-edfokú** polinom — és az alappontok ($x_j$) pont az $\omega_n$ gyökei! Tehát az alappontokat *megválaszthatjuk úgy*, hogy $\omega_n$ a lehető legkisebb maximumnormájú legyen. A Csebisev-tétel szerint az optimum: **legyen $\omega_n\equiv \widetilde{T}_{n+1}$**, azaz az **alappontok az $(n+1)$-edfokú Csebisev-polinom gyökei**.

**7. tétel — a minimalizált hibakorlát.**
- $[-1;1]$-en, $f\in C^{(n+1)}[-1;1]$, $M_{n+1}=\|f^{(n+1)}\|_\infty$ esetén Csebisev-alappontokkal:
$$\|f-L_n\|_\infty \le \frac{M_{n+1}}{(n+1)!}\cdot\|\widetilde{T}_{n+1}\|_\infty=\frac{M_{n+1}}{(n+1)!}\cdot\frac{1}{2^{\,n}}.$$
- Tetszőleges $[a;b]$-n a $\varphi(x)=\frac{b-a}{2}x+\frac{a+b}{2}$ lineáris transzformáció miatt egy extra $\big(\frac{b-a}{2}\big)^{n+1}$ szorzó jön be:
$$\|f-L_n\|_\infty \le \frac{M_{n+1}}{(n+1)!}\cdot\frac{1}{2^{\,n}}\cdot\Big(\frac{b-a}{2}\Big)^{n+1}.$$

## 2. TIER — NUANCE (csapdaanyag)

- **„A Csebisev-pontok minimalizálják a hibát" — pontosan mit?** Nem a teljes hibát, hanem **csak az $\omega_n$ faktor maximumát** (a hibaformula *alapponttól* függő részét). Az $\frac{f^{(n+1)}(\eta)}{(n+1)!}$ rész a függvénytől függ, azt nem kontrollálják. Tehát „a hibakorlát alappontoktól függő tényezője minimális" a pontos állítás.
- **Főegyüttható $2^{n-1}$ vs. norma $1/2^{n-1}$.** Könnyű felcserélni: a *sima* $T_n$ főegyütthatója $2^{n-1}$ és normája $1$; a *normált* $\widetilde T_n$ főegyütthatója $1$ és normája $1/2^{n-1}$.
- **Gyökök száma $n$, szélsőértékek száma $n+1$.** Klasszikus „elszámolós" csapda. A szélsőértékek a két végpontot is tartalmazzák.
- **A gyökök a szélek felé sűrűsödnek, nem egyenletesek.** Ha valaki azt állítja, hogy a Csebisev-gyökök egyenletesen oszlanak el — hamis. Épp az egyenletes (ekvidisztáns) felosztás a rossz.
- **Ortogonalitás súllyal.** A Csebisev-rendszer **nem** a sima $\int_{-1}^1 T_nT_k\,dx$ skaláris szorzatra ortogonális, hanem a $w(x)=1/\sqrt{1-x^2}$ **súlyozottra**. Súly nélkül nem ortogonális.

### Vizsgára fontos — Csebisev-polinomok
1. **Minimax:** a monikus $\widetilde{T}_n$ az összes monikus $n$-edfokú polinom közül a legkisebb maximumnormájú $[-1;1]$-en, és ez a norma $1/2^{n-1}$.
2. **Optimális alappont:** ha választhatjuk az alappontokat, legyenek a **Csebisev-gyökök** — ekkor az interpolációhiba alapponttól függő tényezője minimális.
3. **Számok fejből:** $n$ gyök, $n+1$ (equioszcilláló) szélsőérték, súly $1/\sqrt{1-x^2}$, főegyüttható $2^{n-1}$.
4. **Sűrűsödés a széleken** → ezért működik ott, ahol az egyenletes felosztás elromlik.

---

# 2. Az interpolációs polinomok konvergenciája

## 1. TIER — CORE

**A keretrendszer.** Egy *háromszög-alappontrendszerhez* (minden $n$-re saját alappontkészlet) tartozik egy **interpolációs polinomsorozat** $(L_n)$. A nagy kérdés:
$$\lim_{n\to\infty}\|f-L_n\|_\infty=0\ ?$$
Vagyis: **egyre több alapponttal egyre pontosabb lesz-e az interpoláció — egyenletesen?** A fólia három alkérdést tesz fel: (1) konvergál-e, (2) milyen $f$-re, (3) milyen alappontrendszerre. A válasz mindháromtól együtt függ — és a naiv „több pont = jobb" **hamis**.

**A figyelmeztető példák (egyenletes felosztáson divergencia):**
1. $f(x)=|x|$ — csak **folytonos** ($C[-1;1]$), a 0-ban nem differenciálható.
2. **Runge-példa:** $f(x)=\dfrac{1}{1+25x^2}$ — ez **$C^\infty$**, sőt a valós tengelyen analitikus!

Mindkettő esetén **ekvidisztáns (egyenletes) alappontokon** a $(L_n)$ sorozat **divergál**, és a divergencia az **intervallum szélein** robban (a közepén még közelíthet). Ez a **Runge-jelenség**: nagy oszcillációk a végpontok közelében.

> **Ez a fejezet legfontosabb tanulsága:** a divergencia oka **nem** a függvény simasága hiánya (a Runge-függvény végtelenszer deriválható!), hanem **az alappontok rossz, egyenletes elhelyezése**. *(Saját kiegészítés: a mélyebb ok az, hogy a Runge-függvénynek komplex pólusai vannak $\pm i/5$-ben, ami korlátozza azt a komplex tartományt, ahol a polinomközelítés konvergálhat — ekvidisztáns pontokon ez a tartomány nem fedi le a teljes $[-1;1]$-et.)*

**A megoldás.** **Csebisev-alapponton mindkét függvényre fennáll az egyenletes konvergencia.** A széleken sűrűsödő pontok lefojtják az oszcillációt.

**Elégséges feltétel a függvényre (konvergencia BÁRMELY alapponton).** Ha
1. $f\in C^\infty[a;b]$, **és**
2. $\exists M>0:\ \|f^{(n)}\|_\infty\le M^n\quad(\forall n\in\mathbb N)$,

akkor **minden** $(x_k^{(n)})$ alappontrendszerre $\lim_{n\to\infty}\|f-L_n\|_\infty=0$. *(Bizonyítás: a hibaformulából — a $M_{n+1}/(n+1)!$ tag $\to 0$, mert $(n+1)!$ gyorsabban nő, mint $M^{n+1}$.)* Ilyen „jó" függvények pl. $\sin,\cos,\exp$ — ezeknél tehát az egyenletes felosztás sem ront el.

**A két nagy elvi tétel (kvantorcsapda — ezt feszegetik!):**

| Tétel | Kvantor-szerkezet | Mit mond |
|---|---|---|
| **Marcinkiewicz** | $\forall f\in C[a;b]\ \exists$ alapponrendszer | Minden folytonos függvényhez **van** *olyan* alappontrendszer, amellyel $L_n\to f$ egyenletesen. (A jó pontok a függvénytől függhetnek.) |
| **Faber** | $\forall$ alapponrendszer $\exists f\in C[a;b]$ | Minden rögzített alappontrendszerhez **van** *olyan* folytonos $f$, amelyre $L_n\not\to f$. (Nincs univerzálisan jó alappontrendszer.) |

A kettő együtt: **nem létezik olyan alappontrendszer, amely MINDEN folytonos függvényt egyenletesen interpolálna.** De minden adott $f$-hez külön-külön található jó pontrendszer.

## 2. TIER — NUANCE

- **A Runge-függvény $C^\infty$.** A leggyakoribb csapda: „a Runge-példa azért divergál, mert nem elég sima" — **hamis**. Végtelenszer differenciálható. A baj az ekvidisztáns pontokban van.
- **Hol divergál?** A **széleken** (nem a közepén). „A teljes intervallumon egyenletesen divergál" — pontatlan.
- **Marcinkiewicz ≠ Faber.** A kvantorok sorrendje fordított. Marcinkiewicz: *adott $f$-hez* van jó pont. Faber: *adott ponthoz* van rossz $f$. Tipikus hamis összevonás: „van olyan alappontrendszer, amely minden folytonos függvényre konvergens" — ezt **Faber cáfolja**.
- **Az elégséges feltétel két részből áll.** Önmagában a $C^\infty$ **nem elég** (a Runge-függvény is $C^\infty$ a valós tengelyen, korlátos tartományon $C^\infty$). Kell a **derivált-növekedési korlát** $\|f^{(n)}\|\le M^n$ is.
- **„Folytonosság elég a konvergenciához"** — **hamis** (Faber). Még $C^\infty$ sem elég önmagában tetszőleges alapponton.
- *(Saját kiegészítés — összekötő gondolat):* az általános becslés $\|f-L_n\|_\infty\le(1+\Lambda_n)\,E_n(f)$, ahol $\Lambda_n$ a **Lebesgue-állandó** (3. fejezet), $E_n(f)$ pedig a legjobb $n$-edfokú egyenletes közelítés hibája. Csebisev-pontokon $\Lambda_n\sim\ln n$ csak logaritmikusan nő, ezért még a „nehéz" $|x|$ is konvergál ($E_n(|x|)\sim 1/n$, és $\frac{\ln n}{n}\to 0$). Ez köti össze a 2. és 3. fejezetet.

### Vizsgára fontos — Konvergencia
1. **Több pont nem feltétlenül jobb:** ekvidisztáns alapponton $|x|$ és a $C^\infty$ Runge-függvény is **divergál** (Runge-jelenség, a széleken).
2. **A divergencia oka az alappont, nem a simaság** — a Runge-függvény végtelenszer deriválható.
3. **Csebisev-alappont megmenti** a konvergenciát; az elégséges *függvény-feltétel* a $C^\infty$ **plusz** a $\|f^{(n)}\|\le M^n$ derivált-korlát.
4. **Faber:** nincs univerzális alappontrendszer; **Marcinkiewicz:** de minden $f$-hez van jó. A kvantorsorrend a lényeg.

---

# 3. A Lagrange-interpoláció öröklött hibája

## 1. TIER — CORE

**A kérdés (érzékenység/kondicionáltság).** Eddig azt néztük, mennyire tér el $L_n$ a *valódi* $f$-től. Most más a kérdés: ha a függvényértékeket **csak közelítően** ismerjük (mérési/kerekítési hibával), mennyit hibázik a **hibás adatokból** épített polinom a hibátlanhoz képest? Ez az **öröklött (adat)hiba** — az interpoláció *érzékenysége a bemenő adatokra*.

Jelölés: a pontos $f(x_i)$ értékekből kapjuk $L_n$-t, a hibás $\widetilde f(x_i)$ értékekből $\widetilde L_n$-t, és
$$\varepsilon:=\max_{i=0,\dots,n}\big|f(x_i)-\widetilde f(x_i)\big|$$
a legnagyobb adathiba.

**A Lebesgue-függvény és a Lebesgue-állandó.** A Lagrange-féle alappolinomokból ($\ell_k$):
$$\Lambda_n(x):=\sum_{k=0}^{n}|\ell_k(x)|\quad\text{(Lebesgue-függvény)},\qquad
\Lambda_n:=\max_{x\in[a;b]}\Lambda_n(x)=\|\text{Lebesgue-fv.}\|_\infty\quad\text{(Lebesgue-állandó)}.$$
A Lebesgue-állandó **csak az alappontoktól** függ (a $\ell_k$-k csak a pontokon múlnak), **a függvénytől nem**.

**Az öröklött hiba tétele (a fő eredmény):**
$$\boxed{\ \big|L_n(x)-\widetilde L_n(x)\big|\le \varepsilon\cdot\Lambda_n,\qquad x\in[a;b].\ }$$
Tehát a **$\Lambda_n$ a hiba-felerősítési (erősítési) tényező**: a bemenő adathiba $\varepsilon$-ját a $\Lambda_n$-szeresére nagyíthatja az interpoláció. Lényegében ez az interpolációs operátor **kondíciószáma** a maximumnormában. *(A becslés a $\widetilde L_n-L_n=\sum_k (\widetilde f(x_k)-f(x_k))\ell_k$ azonosságból és a háromszög-egyenlőtlenségből jön.)*

**A növekedési alsó becslés.**
$$\Lambda_n\ \ge\ \frac{2}{\pi}\ln(n+1)+c\quad(c\in\mathbb R\ \text{állandó}).$$
Ez **alsó** korlát: $\Lambda_n$ legalább **logaritmikusan nő**, tehát $\Lambda_n\to\infty$. Következmény: **több alappont → nagyobb erősítés → érzékenyebb az adathibára.** Az interpoláció elvileg sosem tökéletesen stabil, és $n$-nel romlik.

## 2. TIER — NUANCE

- **A Lebesgue-állandó az alappontoktól függ, nem $f$-től.** Ez a leggyakoribb csapda. $\Lambda_n$ tisztán geometriai mennyiség (pontelrendezés).
- **Két különböző hiba.** Ne keverd: az **interpolációs hiba** ($\|f-L_n\|$) az *elméleti* közelítési hiba (a 7. tétel / hibaformula); az **öröklött hiba** ($|L_n-\widetilde L_n|$) az *adathibára való érzékenység* ($\varepsilon\cdot\Lambda_n$). Más a forrásuk.
- **A $\frac{2}{\pi}\ln(n+1)+c$ ALSÓ becslés.** Nem felső! Azt mondja, hogy $\Lambda_n$ *legalább* ekkora — tehát nem korlátos, garantáltan nő.
- **Pontrendszerek minősége (saját kiegészítés):** a növekedés *sebessége* az alappontoktól függ. **Ekvidisztáns** pontokra $\Lambda_n$ **exponenciálisan** robban ($\sim 2^n/(n\ln n)$) → nagyon instabil; **Csebisev-pontokra** csak **logaritmikusan** ($\sim\frac{2}{\pi}\ln n$) → közel optimális. Tehát a Csebisev-pont **kétszeresen** jó: a közelítési hibát is és az adatérzékenységet is kordában tartja.
- **Erősítés, nem garantált hiba.** A $\varepsilon\cdot\Lambda_n$ *felső* korlát a hibára — nem azt mondja, hogy mindig ennyit hibázik, hanem hogy *legfeljebb* ennyit.

### Vizsgára fontos — Öröklött hiba
1. **$\Lambda_n$ = erősítési tényező:** $|L_n-\widetilde L_n|\le\varepsilon\cdot\Lambda_n$; ez az interpoláció kondíciószáma (adathibára való érzékenység).
2. **Csak az alappontoktól függ**, nem a függvénytől.
3. **$\Lambda_n\ge\frac{2}{\pi}\ln(n+1)+c$ — ALSÓ korlát**, tehát $\Lambda_n\to\infty$: több pont = nagyobb érzékenység.
4. **Ne keverd** az öröklött (adat)hibát az interpolációs (közelítési) hibával.

---

# 4. Inverz interpoláció

## 1. TIER — CORE

**A cél.** Az interpoláció **felhasználása $f(x)=0$ egyenlet megoldására**, az $x^*$ gyök közelítésére. Két megközelítés:

**(1) Direkt (egyenes) interpoláció — és miért nem elég.** Felírjuk az $(x_i,f(x_i))$ pontokra az $L_n(x)$ polinomot, majd megoldjuk az
$$L_n(x^*)=0$$
egyenletet, és $x_{k+1}:=x^*$. **Ezt csináltuk a szelőmódszernél ($n=1$, egyenes) és a Newton-módszernél (érintő) is.** A baj: $n>2$-re a **polinom gyökét megtalálni magában is nehéz** numerikus feladat, és **nem általánosítható** szépen magasabb fokra.

**(2) Inverz interpoláció — az ötlet.** Ha $f$ **invertálható** $[a;b]$-n (azaz pl. szigorúan monoton a gyök környékén), akkor
$$f(x^*)=0\ \Longleftrightarrow\ x^*=f^{-1}(0).$$
Tehát **az $f$ helyett az $f^{-1}$ inverzfüggvényt interpoláljuk.** Felcseréljük a szerepeket: most az $y_i=f(x_i)$ értékek az **alappontok**, az $x_i$ értékek a **függvényértékek**, és felírjuk a
$$Q_n(y)\approx f^{-1}(y)$$
polinomot. A gyökközelítés pedig **egyetlen behelyettesítés**:
$$x_{k+1}:=Q_n(0).$$

**Miért nyerő ez?** Mert a $Q_n(0)$ kiszámítása **triviális** (csak egy helyettesítési érték!), míg a direkt módszernél *gyököt kellett keresni*. Az inverz interpoláció így **megkerüli a polinom-gyökkeresést**, és tetszőleges $n$-re működik — ha az invertálhatóság teljesül.

## 2. TIER — NUANCE

- **A kulcsfeltétel: $f$ invertálható** a gyök környékén (gyakorlatban szigorú monotonitás). Ha $f$-nek lokális szélsőértéke van ott, az inverz nem létezik → a módszer nem alkalmazható.
- **Szerepcsere a táblázatban:** direkt esetben $(x_i \to f(x_i))$, inverz esetben $(f(x_i)\to x_i)$. A „mit interpolálunk mi szerint" felcserélése a lényeg.
- **Newton/szelő mint speciális eset.** A direkt megközelítés $n=1$-re a szelőmódszer; ezek tehát ennek a keretnek a kis fokszámú esetei.
- **Mit kerülünk meg:** a *gyökkeresést* polinomon. Az ár: invertálhatóságot kell feltételezni, és a $Q_n$ az inverzet csak közelíti, így iterálni kell ($x_{k+1}\to x_{k+2}\to\dots$).

### Vizsgára fontos — Inverz interpoláció
1. **Cél:** $f(x)=0$ gyökét közelíteni interpolációval.
2. **Direkt baj:** $L_n(x^*)=0$ gyökkeresést igényel, $n>2$-re nehéz/nem általánosítható.
3. **Inverz ötlet:** az **$f^{-1}$-et** interpoláljuk ($Q_n\approx f^{-1}$), és $x_{k+1}=Q_n(0)$ — csak **egy behelyettesítés**, nincs gyökkeresés.
4. **Feltétel:** $f$ **invertálható** (monoton) a gyök környékén.

---

# Önellenőrző kérdések (nehéz, A/B/C/D — a csapdákra hegyezve)

**1.** Mit állít a Csebisev-tétel (extremális tulajdonság)?
- A) $T_n$-nek a legnagyobb a maximumnormája az $n$-edfokú polinomok között.
- B) Az **1 főegyütthatós** $n$-edfokú polinomok közül $\widetilde T_n$-nek a **legkisebb** a maximumnormája $[-1;1]$-en, értéke $1/2^{n-1}$.
- C) Minden $n$-edfokú polinom közül $T_n$-nek a legkisebb a maximumnormája.
- D) $T_n$ minimalizálja a teljes interpolációs hibát, beleértve a deriválttagot is.

**Helyes: B.** A minimax a *monikus* osztályra szól (A/C rossz osztály vagy rossz irány). D azért hamis, mert csak az *alapponttól függő* $\omega_n$-faktort minimalizálja, a $\frac{f^{(n+1)}}{(n+1)!}$ tagot nem.

---

**2.** Az alábbiak közül melyik **HAMIS**?
- A) Marcinkiewicz: minden $f\in C[a;b]$-hez létezik alappontrendszer, amellyel $L_n\to f$ egyenletesen.
- B) Faber: minden alappontrendszerhez létezik $f\in C[a;b]$, amelyre $L_n\not\to f$.
- C) **Létezik olyan alappontrendszer, amely minden $f\in C[a;b]$-re egyenletesen konvergens interpolációt ad.**
- D) Csak folytonosság nem garantálja a konvergenciát tetszőleges alapponton.

**Helyes (a hamis): C.** Pontosan ezt cáfolja Faber: nincs univerzálisan jó pontrendszer. A és B a két tétel pontos kimondása, D ezek következménye.

---

**3.** Miért divergál ekvidisztáns alapponton a Runge-függvény ($\frac{1}{1+25x^2}$) interpolációja?
- A) Mert a függvény nem folytonos.
- B) Mert a függvény nem differenciálható a 0-ban.
- C) Mert csak véges sokszor differenciálható.
- D) **Nem a simaság a baj** (a függvény $C^\infty$): az **egyenletes alappontelrendezés** okozza, a divergencia a **széleken** jelentkezik.

**Helyes: D.** A Runge-függvény végtelenszer deriválható — A/B/C mind a simaságra fognák, ami a klasszikus tévhit. Az ok az alappontok (és a komplex pólusok), nem $f$ regularitása.

---

**4.** A Lebesgue-állandóról ($\Lambda_n$) melyik **igaz**?
- A) $\Lambda_n$ az interpolált függvénytől függ, az alappontoktól nem.
- B) A $\Lambda_n\ge\frac{2}{\pi}\ln(n+1)+c$ becslés **felső** korlát, így $\Lambda_n$ korlátos marad.
- C) **$\Lambda_n$ az adathiba felerősítési tényezője ($|L_n-\widetilde L_n|\le\varepsilon\Lambda_n$), csak az alappontoktól függ, és legalább logaritmikusan nő.**
- D) Csebisev-pontokon $\Lambda_n$ gyorsabban nő, mint ekvidisztáns pontokon.

**Helyes: C.** A az érzékenységet rosszul köti $f$-hez; B összekeveri az alsó/felső becslést ($\Lambda_n\to\infty$); D fordítva van (Csebisev: logaritmikus; ekvidisztáns: exponenciális).

---

**5.** Mi az inverz interpoláció fő előnye a direkt interpolációs gyökkereséssel szemben, és mi a feltétele?
- A) Nincs szükség az $f$ függvényértékeire; cserébe $f$ folytonossága elég.
- B) **Az $f^{-1}$-et interpoláljuk, így a gyök $x_{k+1}=Q_n(0)$ egyetlen behelyettesítés (nincs polinom-gyökkeresés); feltétel, hogy $f$ invertálható (monoton) legyen a gyök környékén.**
- C) Mindig pontosan megadja a gyököt egyetlen lépésben, feltétel nélkül.
- D) A Newton-módszernél magasabb konvergenciarendet garantál minden esetben.

**Helyes: B.** A direkt módszer baja a gyökkeresés ($L_n(x^*)=0$); az inverz ezt egy $Q_n(0)$ helyettesítésre cseréli, **invertálhatóság** árán. C (csak közelít, kell feltétel) és D (nem garantált) túlzók.

---

**6.** *(extra, finom)* Hány gyöke és hány szélsőértékhelye van $T_n$-nek $[-1;1]$-en, és milyen súllyal ortogonális a rendszer?
- A) $n+1$ gyök, $n$ szélsőérték; súly $\sqrt{1-x^2}$.
- B) **$n$ gyök, $n+1$ szélsőértékhely (equioszcilláció a végpontokkal); súly $\dfrac{1}{\sqrt{1-x^2}}$.**
- C) $n$ gyök, $n$ szélsőérték; súly $1$ (közönséges ortogonalitás).
- D) $n-1$ gyök, $n$ szélsőérték; súly $\dfrac{1}{1-x^2}$.

**Helyes: B.** $n$ gyök / $n+1$ szélsőérték a klasszikus „eggyel elszámolós" csapda; a súly a *reciprok* gyök ($1/\sqrt{1-x^2}$), nem maga a gyök, és nem $1$.

---

## Min menjünk mélyebbre?

Mondd meg, melyik irányba ássunk be — pár lehetőség:
- **A minimax (Csebisev-tétel) bizonyítása** equioszcillációval (a „táblán" maradt rész) — ez elvi csapdák forrása.
- **A Runge-jelenség** mélyebb (komplex-analízis) magyarázata és pontosan *hol* divergál.
- **Marcinkiewicz vs. Faber** kvantor-logikája több gyakorlókérdéssel.
- **Lebesgue-állandó** ekvidisztáns vs. Csebisev viselkedése, és a kapcsolata a konvergenciával ($\|f-L_n\|\le(1+\Lambda_n)E_n(f)$).
- **Inverz interpoláció** lépésről lépésre egy konkrét sémán (pl. inverz kvadratikus interpoláció, Brent-módszer háttere).
- Több **A/B/C/D** gyakorlókérdés bármelyik fejezethez.
