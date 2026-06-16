# Numerikus módszerek C — 12. előadás: Numerikus integrálás
### Vizsgafelkészítő jegyzet (elméleti, feleletválasztós vizsgára hangolva)

---

## Mit fed le ez a PDF?

A teljes tárgy nyolc témaköréből ez az anyag **kizárólag az utolsót**: a **numerikus integrálást (kvadratúra)** tárgyalja. Konkrétan: az interpolációs kvadratúra általános elmélete → a Newton–Cotes-formulák (érintő-, trapéz-, Simpson-formula) → ezek **hibaformulái és pontossági rendje** → az **összetett formulák** → végül a **Richardson-extrapoláció** (és érintőlegesen a Romberg-integrálás). A súlyfüggvényes (`w(x)`) általános keret és a Gauss-kvadratúra csak **említés szintjén** szerepel. A többi tárgyi témakör (gépi számábrázolás, LER-ek, mátrixnormák, nemlineáris egyenletek, Horner, interpoláció, legkisebb négyzetek) **nincs** ebben a PDF-ben.

---

## 1. Az alapötlet: az interpolációs kvadratúra

### 🟢 CORE — amit muszáj érteni

**A feladat.** Közelítsük az $\int_a^b f(x)\,dx$ (vagy súlyfüggvénnyel: $\int_a^b f(x)w(x)\,dx$, ahol $w(x)\ge 0$ és $\int_a^b w < \infty$) Riemann-integrál **értékét**.

**Miért nem a definícióval számolunk?** A Riemann-féle (alsó/felső) közelítő összegekkel elvileg számolhatnánk, de a pontossághoz **rengeteg** osztáspontra (sok függvényértékre) lenne szükség. Ez **nem gazdaságos**. Kell egy okosabb stratégia.

**Az ötlet (ezt értsd meg igazán):** ha $f$-et nem tudjuk integrálni, akkor **cseréljük ki egy polinomra**, amit *mindig* tudunk pontosan integrálni. Vegyük az $a \le x_0 < x_1 < \dots < x_n \le b$ alappontokat, és közelítsük $f$-et az ezekre illesztett **Lagrange-interpolációs polinommal**, $L_n(x)$-szel. Ekkor

$$\int_a^b f(x)w(x)\,dx \;\approx\; \int_a^b L_n(x)w(x)\,dx = \sum_{k=0}^n f(x_k)\underbrace{\int_a^b \ell_k(x)w(x)\,dx}_{=:A_k} = \sum_{k=0}^n A_k f(x_k).$$

Itt $\ell_k$ a Lagrange-alappolinomok. A végeredmény tehát a **függvényértékek súlyozott összege**: a $\sum A_k f(x_k)$ alakot nevezzük **kvadratúra formulának**, az $A_k$-kat pedig **súlyoknak** (együtthatóknak).

**A legfontosabb észrevétel.** Az $A_k = \int_a^b \ell_k(x)w(x)\,dx$ súlyok **csak az alappontoktól és a súlyfüggvénytől függenek — magától $f$-től NEM!** Ez kulcsfontosságú: a súlyokat *egyszer* kiszámoljuk, utána a formula *bármilyen* $f$-re használható, csak be kell helyettesíteni a függvényértékeket. (A súlyfüggvénynek főleg szingularitással bíró függvényeknél lesz igazi szerepe — erre még visszatérünk.)

**Definíciók.**
- A $\sum_{k=0}^n A_k f(x_k)$ formula egy **kvadratúra formula**.
- **Interpolációs típusú** a formula, ha a súlyok éppen $A_k = \int_a^b \ell_k(x)w(x)\,dx$.

**Pontossági tétel (ez a fejezet gerince).**
$$\Big(\forall f\in P_n:\ \int_a^b f w = \sum_{k=0}^n A_k f(x_k)\Big) \iff A_k = \int_a^b \ell_k(x)w(x)\,dx\quad(k=0,\dots,n).$$
Magyarul: **egy $n{+}1$ alappontú kvadratúra formula pontosan akkor interpolációs típusú, ha pontos minden legfeljebb $n$-edfokú polinomra.** Ez a két fogalom — „interpolációs típusú” és „$P_n$-en pontos” — *ekvivalens*. Innen jön az egész elmélet pontossági fogalma: a formula **pontossági fokszáma** az a legnagyobb $d$, amelyre minden $P_d$-beli polinomra pontos.

**Következmények (gyors fejszámolás-ellenőrzők).**
- $f\equiv 1$-re a formula pontos: $\displaystyle\sum_{k=0}^n A_k = \int_a^b w(x)\,dx =: \mu_0$ (a súlyfüggvény $0$-adik momentuma).
- Ha $w(x)\equiv 1$: $\displaystyle\sum_{k=0}^n A_k = b-a$. (Ezt sokszor használjuk a súlyok kikövetkeztetésére szimmetria mellett.)

### 🟡 NUANCE — buktatók, finom megkülönböztetések

- **„Interpolációs típusú” $\ne$ „interpolációval számolt érték”.** A formula attól interpolációs típusú, hogy a *súlyai* az $\ell_k$-k integráljai. Az ekvivalencia (pontossági tétel) miatt ez ugyanaz, mint a $P_n$-pontosság — de a vizsgán a kettő összekapcsolása a lényeg, nem az, hogy ténylegesen interpolálunk.
- **A súlyok nem mindig pozitívak.** Magasabb fokú Newton–Cotes-formuláknál egyes $A_k$-k **negatívvá** válhatnak (ez okozza a magas fokú NC-formulák instabilitását). Ne keverd: a *súlyok összege* rögzített ($\sum A_k = b-a$), de az egyes súlyok előjele nem garantáltan pozitív.
- **A momentum $\mu_0=\int w$, nem $b-a$ általában.** Csak $w\equiv 1$ esetén lesz $\mu_0 = b-a$.

### ⭐ Vizsgára fontos
1. A kvadratúra = függvényértékek súlyozott összege; a **súlyok $f$-től függetlenek**, csak az alappontoktól és $w$-től függenek.
2. **Pontossági tétel:** $n{+}1$ alappont esetén „interpolációs típusú” $\Leftrightarrow$ „pontos $P_n$-en”.
3. $f\equiv 1$ $\Rightarrow$ $\sum A_k = \int_a^b w = \mu_0$; ha $w\equiv 1$, akkor $\sum A_k = b-a$.

---

## 2. A kvadratúra formula három fő típusa

### 🟢 CORE

Egy $n{+}1$ alappontú formulában **$2(n{+}1)$ szabad paraméter** van: az $n{+}1$ súly ($A_k$) **és** az $n{+}1$ alappont ($x_k$). A puszta $P_n$-pontosság (ami csak az alappontok rögzítésével jár) ezért „kevésnek tűnik” — pontosan ez motiválja a típusokat, hogy a szabadságot okosan használjuk fel:

| Típus | Mit rögzítünk / mit optimalizálunk | Elért max. pontossági fok |
|---|---|---|
| **Newton–Cotes** | $w\equiv 1$, **egyenletes** (ekvidisztáns) alappontok; csak a súlyokat számoljuk | $n$ (páros $n$-nél $n{+}1$ — lásd a 4–5. fejezetet) |
| **Csebisev** | minden súly **egyenlő**: $A_k \equiv A$; az alappontokat ehhez illesztjük | – |
| **Gauss** | **mindkettőt** (súlyok ÉS alappontok) szabadon optimalizáljuk | $2n+1$ (a lehetséges maximum) |

A **Gauss-típus** a „nyertes”: mivel mindkét paraméterhalmazt szabadon választja, eléri az elméleti maximumot, a $2n{+}1$-edfokú pontosságot. Cserébe az alappontjai nem szépek (nem ekvidisztánsak) — egy ortogonális polinom gyökei. A Gauss-formulák kezelik a **súlyfüggvényt és a szingularitásokat** is (lásd a Richardson-fejezet végét).

### 🟡 NUANCE
- **Klasszikus csapda: Newton–Cotes vs. Csebisev.** A Newton–Cotesnál az **alappontok** egyenlő közűek (a súlyok különböznek); a Csebisevnél a **súlyok** egyenlők (az alappontok különböznek). Pont fordítva, mint ahogy elsőre gondolnád.
- A Gauss „$2n{+}1$ pontosság” azért lehetséges, mert $2(n{+}1)$ paramétert szabadon állít — pont annyi feltétel adható meg ($1, x, \dots, x^{2n+1}$ pontossága), amennyi paraméter van.

### ⭐ Vizsgára fontos
1. **Newton–Cotes** = ekvidisztáns alappontok + $w\equiv 1$. **Csebisev** = egyenlő súlyok. **Gauss** = mindkettő optimalizálva.
2. A Gauss-formula $n{+}1$ ponttal **$2n{+}1$-edfokú** pontosságot ér el — ez a maximum, mert $2(n{+}1)$ szabad paramétere van.

---

## 3. Newton–Cotes-formulák: zárt és nyílt

### 🟢 CORE

Itt $w\equiv 1$ és az alappontok ekvidisztánsak: $x_k = x_0 + kh$.

- **Zárt formulák, $Z(n)$:** $a$ **és** $b$ is alappont. Ekkor $x_0=a$, $x_n=b$, $h=\dfrac{b-a}{n}$, $x_k=a+kh$.
- **Nyílt formulák, $Ny(n)$:** $a$ **és** $b$ **nem** alappont. Ekkor $h=\dfrac{b-a}{n+2}$, az alappontok beljebb csúsznak: $x_0=a+h$, $x_n=b-h$.

A súlyok kiszámíthatók a $t=\frac{x-a}{h}$ helyettesítéssel az $\ell_k$ integráljából; a végeredmény mindig $A_k = (b-a)\,B_k$ alakú, ahol a $B_k$ **dimenziótlan, $[a,b]$-től független** állandók (csak $n$-től és $k$-tól függenek). Ez praktikus: a $B_k$-kat egyszer kiszámolva tetszőleges intervallumra átskálázhatók.

**A $B_k$ együtthatók két alaptulajdonsága (tétel):**
1. $\displaystyle\sum_{k=0}^n B_k = 1$ — abból, hogy a formula $f\equiv 1$-re pontos.
2. $B_k = B_{n-k}$ — az alappontok **szimmetriájából** (az integrálban $y:=n-t$ helyettesítéssel).

**Alternatív súlyszámítás (a határozatlan együtthatók módszere).** Mivel $P_n$-pontosság = pontosság az $1, x, x^2, \dots, x^n$ hatványokra (az integrál linearitása miatt), felírhatunk egy lineáris egyenletrendszert (LER) az $A_k$-kra:
$$\int_a^b x^j\,dx = \sum_{k=0}^n A_k x_k^{\,j}, \qquad j=0,1,\dots,n.$$
Ennek mátrixa a **Vandermonde-mátrix transzponáltja**, ami rosszul kondicionált — ezért ez a módszer csak **kézi** számolásra praktikus, gépi nagyméretű számolásra nem.

### 🟡 NUANCE
- **Zárt vs. nyílt — a megkülönböztető kérdés:** *használjuk-e a végpontokat alappontként?* Zárt: igen. Nyílt: nem. A nyílt formula akkor hasznos, ha $f$ a végpontban **szinguláris** vagy nincs értelmezve (pl. a középponti/érintő formula sosem hív $f(a)$-t vagy $f(b)$-t).
- A $\sum B_k = 1$ és a $\sum A_k = b-a$ ugyanannak a ténynek a két alakja ($A_k=(b-a)B_k$).
- A szimmetria $B_k=B_{n-k}$ miatt elég a súlyok felét kiszámolni — innen jönnek a „szép” együttható-sorozatok.

### ⭐ Vizsgára fontos
1. **Zárt $Z(n)$:** végpontok alappontok, $h=\frac{b-a}{n}$. **Nyílt $Ny(n)$:** végpontok nem alappontok, $h=\frac{b-a}{n+2}$.
2. A $B_k$ együtthatók **intervallumfüggetlenek**, $\sum B_k = 1$, és **szimmetrikusak**: $B_k=B_{n-k}$.
3. A súlyok LER-rel is megkaphatók (Vandermonde-transzponált) — de ez csak kézi számolásra jó.

---

## 4. A három alapformula: érintő, trapéz, Simpson

Ez a fejezet a vizsgák **legforróbb** pontja. A három formula ugyanazt a feladatot oldja meg, ezért tökéletes A/B/C/D-anyag. Itt a teljes oldalankénti összevetés.

### 🟢 CORE — a formulák

**Érintő- (középponti) formula, $Ny(0)$ — 1 alappont a felezőpontban:**
$$\int_a^b f \approx (b-a)\cdot f\!\left(\tfrac{a+b}{2}\right) =: E(f).$$
Geometriailag egy téglalap, amelynek magassága a felezőponti függvényérték (ez egyben a felezőponti érintő alatti terület is — innen a név). Mivel nyílt, a végpontokat nem használja. ($A_0 = b-a$.)

**Trapéz-formula, $Z(1)$ — 2 alappont ($a$ és $b$):**
$$\int_a^b f \approx \frac{b-a}{2}\big(f(a)+f(b)\big) =: T(f).$$
Geometriailag az $f(a)$ és $f(b)$ pontokat összekötő egyenes (húr) alatti trapéz. ($A_0=A_1=\frac{b-a}{2}$.)

**Simpson-formula, $Z(2)$ — 3 alappont ($a$, felezőpont, $b$):**
$$\int_a^b f \approx \frac{b-a}{6}\left(f(a)+4f\!\left(\tfrac{a+b}{2}\right)+f(b)\right) =: S(f).$$
Geometriailag a három ponton átmenő **parabola** alatti terület. ($A_0=A_2=\frac{1}{6}(b-a)$, $A_1=\frac{4}{6}(b-a)$ — a $1,4,1$ súlyozás.)

### 🟢 CORE — a pontossági fok (a legfontosabb rész!)

A vizsga kedvenc trükkje. Vigyázz, a „hányadfokú polinomot integrál” és a „hányadfokú polinomra pontos” **NEM ugyanaz**:

| Formula | Alappontok száma | Az interpoláló polinom foka | **Pontos eddig a fokig** |
|---|---|---|---|
| Érintő $E$ | 1 | 0 (konstans) | **1** (lineáris!) |
| Trapéz $T$ | 2 | 1 (egyenes) | **1** |
| Simpson $S$ | 3 | 2 (parabola) | **3** (köbös!) |

Az érintő egy *konstanssal* közelít, mégis pontos a *lineáris* függvényekre; a Simpson egy *parabolával* közelít, mégis pontos a *köbös* polinomokra. Ez a **„páros $n$ szuperkonvergencia”** jelensége (lásd a hibaformulákat): páros $n$ esetén a formula eggyel magasabb fokig pontos, mint amit a fokszám alapján várnánk.

### 🟡 NUANCE — a szép összefüggés (kiegészítés, nincs a diákon, de érdemes tudni)

A három formula nem független: **$S = \dfrac{2E + T}{3}$**. Tehát a Simpson a középponti és a trapézformula súlyozott átlaga ($2:1$ arányban). Ennek mély oka van a hibákban (lásd alább): az érintő hibája pozitív, a trapézé negatív és kétszer akkora; a $2{:}1$ kombinációban a vezető hibatag **kioltja egymást**, ezért ugrik a Simpson pontossága $f''$-ről $f^{(4)}$-re. (Ez ugyanaz a gondolat, mint a Richardson-extrapoláció.)

### 🟡 NUANCE — gyakori keverések
- **„Simpson = parabola, tehát csak másodfokúra pontos” — HAMIS.** Simpson köbösre is pontos (3. fok).
- Az **érintő nyílt** ($Ny(0)$), a **trapéz és a Simpson zárt** ($Z(1)$, $Z(2)$). A „zárt/nyílt” itt nem a hibanagyságra utal, hanem arra, hogy a végpontokat használja-e.
- A Simpson súlyozása $1,4,1$ (osztva $6$-tal) — **nem** $1,1,1$.

### ⭐ Vizsgára fontos
1. **Pontossági fokok:** érintő → 1, trapéz → 1, Simpson → **3**. (A Simpson köbösre is pontos!)
2. Érintő = $Ny(0)$ (nyílt, 1 felezőponti pont); trapéz = $Z(1)$ (zárt, 2 pont); Simpson = $Z(2)$ (zárt, 3 pont, $1{:}4{:}1$ súlyok).
3. Páros $n$ szuperkonvergencia: páros alappontszám-indexnél eggyel magasabb fokig pontos.
4. (Kiegészítés) $S=\frac{2E+T}{3}$ — a Simpson az érintő és trapéz $2{:}1$ kombinációja.

---

## 5. Hibaformulák és a pontossági rend

### 🟢 CORE — a segédtétel

**Integrálszámítás középértéktétele (emlékeztető):** ha $f\in C[a,b]$ és $g\ge 0$, akkor $\exists\,\xi\in(a,b)$:
$$\int_a^b fg = f(\xi)\int_a^b g.$$
Ez a „motor” a hibaformulák mögött — az $f^{(k)}$-t kihozza az integrál elé egy közbülső $\eta$ pontban.

### 🟢 CORE — a hibaformulák

| Formula | Simasági feltétel | Hibaformula $\big(\int_a^b f - \text{(közelítés)}\big)$ | Rend $(b-a)$-ban |
|---|---|---|---|
| Érintő $E$ | $f\in C^2$ | $+\dfrac{(b-a)^3}{24}\,f''(\eta)$ | $(b-a)^3$ |
| Trapéz $T$ | $f\in C^2$ | $-\dfrac{(b-a)^3}{12}\,f''(\eta)$ | $(b-a)^3$ |
| Simpson $S$ | $f\in C^4$ | $-\dfrac{(b-a)^5}{2880}\,f^{(4)}(\eta)$ | $(b-a)^5$ |

Olvasd ki ezekből a lényeget:
- Az érintő és a trapéz is **$f''$-től** függ → ezért pontosak a lineárisra ($f''\equiv 0$), és a hibájuk $O((b-a)^3)$.
- **Az érintő hibája feleakkora és ellenkező előjelű, mint a trapézé** ($\frac{1}{24}$ vs. $-\frac{1}{12}$). Ez nem véletlen — ebből épül a Simpson.
- A Simpson **$f^{(4)}$-től** függ → pontos a köbösre ($f^{(4)}\equiv 0$), hibája $O((b-a)^5)$. Cserébe erősebb simaság ($C^4$) kell.

### 🟢 CORE — az általános N–C-hibatétel (innen jön a szuperkonvergencia)

Jelölje $I(f)$ a Newton–Cotes-formulát, $\omega_n(x)=\prod_{k=0}^n (x-x_k)$ az alappontpolinomot.
- **Ha $n$ páratlan** ($f\in C^{n+1}$): $\displaystyle\int_a^b f - I(f) = \frac{f^{(n+1)}(\xi)}{(n+1)!}\int_a^b \omega_n(x)\,dx.$
- **Ha $n$ páros** ($f\in C^{n+2}$): $\displaystyle\int_a^b f - I(f) = \frac{f^{(n+2)}(\xi)}{(n+2)!}\int_a^b x\,\omega_n(x)\,dx.$

**Ez a páros $n$ szuperkonvergencia formális forrása:** páros $n$ esetén a hiba $f^{(n+2)}$-vel arányos (nem $f^{(n+1)}$-gyel), tehát a formula **eggyel magasabb fokig pontos**, mint amit várnánk. Az érintő ($n=0$, páros) és a Simpson ($n=2$, páros) pont ezt mutatja.

### 🟡 NUANCE
- **Az előjelek és a konstansok számítanak.** Érintő: $+\frac{1}{24}$; trapéz: $-\frac{1}{12}$; Simpson: $-\frac{1}{2880}$. A vizsgán szeretik az „melyik konstans tartozik melyik formulához” típusú kérdést.
- **Simpson egyszerű vs. összetett konstans:** az *egyszerű* Simpson hibakonstansa $\frac{1}{2880}$, az *összetett* Simpsoné $\frac{1}{180\,m^4}$ (lásd a 6. fejezetet). **Ne keverd a kettőt!** A $2880$ és a $180$ azért különbözik, mert az összetettnél $m$ a teljes osztópontok száma, és $2880 = 180\cdot 16$ típusú átskálázás történik.
- A hibaformulák **egzisztencia**-tételek: van *egy* $\eta\in[a,b]$, amivel az egyenlőség pontosan áll — de $\eta$-t nem ismerjük. A gyakorlatban felső becslésre használjuk: $\big|\int f - T(f)\big| \le \frac{(b-a)^3}{12}\max|f''|$.

### ⭐ Vizsgára fontos
1. **Érintő/trapéz: $O((b-a)^3)$, $f''$-függő, $C^2$ kell.** Simpson: $O((b-a)^5)$, $f^{(4)}$-függő, $C^4$ kell.
2. **Előjelek/konstansok:** érintő $+\frac{1}{24}$, trapéz $-\frac{1}{12}$, Simpson $-\frac{1}{2880}$ (egyszerű).
3. Az érintőhiba **fele** a trapézhibának, ellenkező előjellel.
4. Páros $n$ → a hiba $f^{(n+2)}$-vel arányos → **eggyel magasabb pontossági fok** (szuperkonvergencia).

---

## 6. Összetett formulák

### 🟢 CORE — az ötlet

Egyetlen nagy intervallumon egy alacsony fokú formula pontatlan. Megoldás: **osszuk fel $[a,b]$-t $m$ egyenlő részre, és minden részintervallumon alkalmazzuk a lokális formulát**, majd adjuk össze. Ez az **összetett** (kompozit) formula. A finomítás kulcsa: nem a fokszámot növeljük (az instabil), hanem $m$-et.

**Trapéz összetett (trapézszabály):**
$$\int_a^b f \approx \frac{b-a}{2m}\left(f(a)+2\sum_{k=1}^{m-1}f(x_k)+f(b)\right) =: T_m(f).$$
Megjegyzendő súlysorozat: **$1,2,2,\dots,2,2,1$** (a belső pontok duplán, a végpontok egyszer).

**Simpson összetett (Simpson-szabály), $m$ páros:**
$$S_m(f) := \frac{b-a}{3m}\left(f(a)+4\sum_{k=1}^{m/2}f(x_{2k-1})+2\sum_{k=1}^{m/2-1}f(x_{2k})+f(b)\right).$$
Megjegyzendő súlysorozat: **$1,4,2,4,\dots,4,2,4,1$** (páratlan indexű pontok $4$-gyel, páros belsők $2$-vel). Itt $\frac{m}{2}$ darab Simpson-panelt használunk, mindegyik 3 pontot fog össze.

### 🟢 CORE — az összetett hibák és a konvergenciarend

| Összetett formula | Simaság | Hibaformula | Rend $m$-ben / $h$-ban |
|---|---|---|---|
| Trapéz $T_m$ | $f\in C^2$ | $-\dfrac{(b-a)^3}{12\,m^2}\,f''(\eta)$ | $O(1/m^2)=O(h^2)$ |
| Simpson $S_m$ | $f\in C^4$ | $-\dfrac{(b-a)^5}{180\,m^4}\,f^{(4)}(\eta)$ | $O(1/m^4)=O(h^4)$ |

ahol $h=\frac{b-a}{m}$ a lépésköz. **A konvergenciarend a lényeg:** ha $m\to\infty$, akkor $T_m\to\int f$ **$m^2$-rendben**, $S_m\to\int f$ **$m^4$-rendben**. Vagyis ha kétszerezed $m$-et, a trapéz hibája $\approx 4$-szeresére csökken, a Simpsoné $\approx 16$-szorosára.

### 🟡 NUANCE
- **A Simpson összetetthez $m$-nek párosnak kell lennie** (mert párokba kell fogni a panelokat). A trapéznál nincs ilyen kikötés.
- **Konstanscsapda (ismét):** egyszerű Simpson $\frac{1}{2880}$, összetett Simpson $\frac{1}{180\,m^4}$. Egyszerű trapéz $\frac{1}{12}$, összetett trapéz $\frac{1}{12\,m^2}$.
- Az **érintő (középponti) formulából is** képezhető összetett formula, ugyanígy.
- A **rend ≠ a hiba abszolút nagysága.** $O(h^4)$ azt mondja, milyen *gyorsan* csökken a hiba, nem azt, hogy adott $m$-re melyik a kisebb (bár sima $f$-re a Simpson általában jobb).

### ⭐ Vizsgára fontos
1. **Trapéz összetett: $O(h^2)$ ($m^2$-rend), súlyok $1,2,\dots,2,1$.** Simpson összetett: $O(h^4)$ ($m^4$-rend), súlyok $1,4,2,4,\dots,2,4,1$, **$m$ páros**.
2. $m$ kétszerezése: trapézhiba $/4$, Simpsonhiba $/16$.
3. Az összetett hibakonstansok ($\frac{1}{12m^2}$, $\frac{1}{180m^4}$) **mások**, mint az egyszerűekéi.

---

## 7. Richardson-extrapoláció és Romberg-integrálás

### 🟢 CORE — az ötlet

Ha ismerjük a hiba **rendjét** $m$-ben, akkor **két különböző $m$-mel számolt becslésből kivonással kiolthatjuk a vezető hibatagot** — ingyen pontosabb eredményt kapunk.

**Trapézra.** Írjuk fel a hibát $m$-re és $2m$-re (feltéve, hogy $f''$ elég sima, így $f''(\eta_1)\approx f''(\eta_2)$):
$$\int f - T_m = -\frac{(b-a)^3}{12m^2}f''(\eta_1),\qquad \int f - T_{2m} = -\frac{(b-a)^3}{48m^2}f''(\eta_2).$$
A második egyenlet **$4$-szereséből** kivonva az elsőt, a $f''$-tag kiesik:
$$\boxed{\int_a^b f \approx \frac{1}{3}\big(4T_{2m}(f)-T_m(f)\big) = S_m(f),\qquad \text{hiba: } O(h^4).}$$
**Meglepő, de szép:** a trapéz Richardson-javítása *pontosan a Simpson-formula*! A pontossági rend $O(h^2)\to O(h^4)$-re ugrik.

**Simpsonra.** Ugyanígy, de a Simpson hibája $\frac{1}{m^4}$-rendű, tehát a $2m$-es becslés hibája $\frac{1}{16}$-od → a **$16$-szoros** kombináció oltja ki:
$$\boxed{\int_a^b f \approx \frac{1}{15}\big(16S_{2m}(f)-S_m(f)\big),\qquad \text{hiba: } O(h^6).}$$

A faktorok logikája: a trapéznál $4=2^2$ (mert $O(h^2)$), a Simpsonnál $16=2^4$ (mert $O(h^4)$). Az ebből épített **rekurzió a Romberg-integrálás alapja**.

### 🟢 CORE — gyakorlati hibabecslő tételek

A $\eta$ ismeretlensége miatt a következő, közvetlenül használható becsléseket alkalmazzuk (megállási kritériumnak):
- Ha $f''$ korlátos $[a,b]$-n: $\displaystyle\left|\int_a^b f - T_m(f)\right| \le |T_m(f)-T_{2m}(f)|.$
- Ha $f^{(4)}$ korlátos $[a,b]$-n: $\displaystyle\left|\int_a^b f - S_m(f)\right| \le |S_m(f)-S_{2m}(f)|.$

Azaz a hibát megbecsülhetjük két egymást követő finomítás **különbségével** — kényelmes, mert csak ismert mennyiségeket használ.

### 🟡 NUANCE — a fő korlát (kedvenc vizsgakérdés)

A Richardson-extrapoláció **csak akkor működik, ha $f$ elég sima** — a levezetés feltételezi, hogy a megfelelő derivált létezik és „elég sima” (hogy $f''(\eta_1)\approx f''(\eta_2)$). **Példa:** $\int_0^1 x^{1/3}\,dx$-re a Richardson-extrapoláció **NEM használható**, mert $f(x)=x^{1/3}$ a $0$-ban **nem deriválható** (a derivált robban). Ilyen **szingularitások** kezeléséhez más típusú módszerek kellenek — **Gauss-kvadratúra** (megfelelő súlyfüggvénnyel). Ez köti vissza az 1–2. fejezet $w(x)$ keretét: a súlyfüggvény pont a szingularitások „elnyelésére” való.

### ⭐ Vizsgára fontos
1. **Trapéz-Richardson:** $\frac{1}{3}(4T_{2m}-T_m) = S_m$, rend $O(h^2)\to O(h^4)$.
2. **Simpson-Richardson:** $\frac{1}{15}(16S_{2m}-S_m)$, rend $O(h^4)\to O(h^6)$. A faktorok: $4=2^2$, $16=2^4$.
3. A rekurzió → **Romberg-integrálás**.
4. **Korlát:** a Richardson sima $f$-et igényel; szingularitás (pl. $x^{1/3}$ a $0$-ban) esetén **nem alkalmazható** → Gauss-kvadratúra kell.
5. Gyakorlati hibabecslés: $|\int f - T_m| \le |T_m - T_{2m}|$ (és ugyanígy Simpsonra).

---

## 📊 Nagy összefoglaló táblázat (mindent egy helyen)

| Tulajdonság | Érintő $E$ | Trapéz $T$ | Simpson $S$ |
|---|---|---|---|
| N–C típus | $Ny(0)$ (nyílt) | $Z(1)$ (zárt) | $Z(2)$ (zárt) |
| Alappontok | 1 (felezőpont) | 2 ($a,b$) | 3 ($a$, felezőpont, $b$) |
| Interpoláló polinom foka | 0 | 1 | 2 |
| **Pontos eddig a fokig** | **1** | **1** | **3** |
| Súlyok | $b-a$ | $\frac{b-a}{2},\frac{b-a}{2}$ | $\frac{1}{6},\frac{4}{6},\frac{1}{6}$ ·$(b-a)$ |
| Simasági feltétel | $C^2$ | $C^2$ | $C^4$ |
| Egyszerű hiba | $+\frac{(b-a)^3}{24}f''$ | $-\frac{(b-a)^3}{12}f''$ | $-\frac{(b-a)^5}{2880}f^{(4)}$ |
| Összetett súlysorozat | – | $1,2,\dots,2,1$ | $1,4,2,\dots,2,4,1$ |
| Összetett hiba | – | $-\frac{(b-a)^3}{12m^2}f''$ | $-\frac{(b-a)^5}{180m^4}f^{(4)}$ |
| Összetett rend | – | $O(h^2)$ | $O(h^4)$ |
| Richardson-javítás | – | $\frac13(4T_{2m}-T_m)=S_m$, $O(h^4)$ | $\frac{1}{15}(16S_{2m}-S_m)$, $O(h^6)$ |

---

## 🎯 Vizsga-szimulációs kérdések (A/B/C/D)

> Próbáld előbb megoldani, csak utána nézd a választ. A nehézség a finom megkülönböztetéseken van.

**1. Hányadfokú polinomokig pontos a (egyszerű) Simpson-formula?**
A) 2 B) 3 C) 4 D) 5

<details><summary>Válasz</summary><b>B) 3.</b> A Simpson parabolával ($2.$ fok) interpolál, de páros $n=2$ miatt szuperkonvergens: köbösre ($3.$ fok) is pontos. (A hibája $f^{(4)}$-függő, ami $\equiv 0$ a $\le 3$ fokú polinomokon.)</details>

**2. Melyik igaz az érintő- ($E$) és a trapézformula ($T$) hibájára?**
A) Mindkettő $O((b-a)^2)$ rendű.
B) A két hiba azonos előjelű és azonos nagyságú.
C) Az érintőhiba abszolút értékben feleakkora, mint a trapézé, és **ellenkező** előjelű.
D) A trapézhiba $f^{(4)}$-től függ, az érintőé $f''$-től.

<details><summary>Válasz</summary><b>C.</b> Érintő: $+\frac{(b-a)^3}{24}f''$; trapéz: $-\frac{(b-a)^3}{12}f''$. Arány $1{:}2$, ellentétes előjel. Mindkettő $O((b-a)^3)$ (nem $O((b-a)^2)$), és mindkettő $f''$-függő — ezért A és D hamis.</details>

**3. A kvadratúra $A_k$ súlyairól melyik állítás IGAZ?**
A) Függenek az integrálandó $f$ függvénytől.
B) Csak az alappontoktól és a súlyfüggvénytől függenek.
C) Newton–Cotes esetén mindig pozitívak.
D) Összegük mindig $1$.

<details><summary>Válasz</summary><b>B.</b> A súlyok $f$-függetlenek. A) hamis. C) hamis: magas fokú NC-nél negatív súlyok is lehetnek. D) hamis: a *dimenziótlan $B_k$-k* összege $1$, de $\sum A_k = \int_a^b w = \mu_0$ (illetve $w\equiv 1$-re $b-a$).</details>

**4. Mi a fő különbség a Newton–Cotes-féle zárt és nyílt formula között?**
A) A zárt formula a végpontokat ($a,b$) is alappontként használja, a nyílt nem.
B) A nyílt formula mindig pontosabb.
C) A zárt formula súlyfüggvényt használ, a nyílt nem.
D) A nyílt formula nem ekvidisztáns alappontokat használ.

<details><summary>Válasz</summary><b>A.</b> A zárt ($Z(n)$) tartalmazza $a$-t és $b$-t ($h=\frac{b-a}{n}$); a nyílt ($Ny(n)$) nem ($h=\frac{b-a}{n+2}$). Mindkettő ekvidisztáns és $w\equiv 1$ — D és C hamis. A pontosság nem általánosan jobb — B hamis.</details>

**5. A Richardson-extrapoláció a trapéz összetett formulára: $\frac{1}{3}\big(4T_{2m}(f)-T_m(f)\big)$ értéke éppen…**
A) $T_{2m}(f)$ B) $S_{2m}(f)$ C) $S_m(f)$ D) $E_m(f)$

<details><summary>Válasz</summary><b>C) $S_m(f)$.</b> A trapéz Richardson-javítása pontosan a Simpson összetett formulát adja, $O(h^4)$ hibával (a $O(h^2)$-ből).</details>

**6. Miért NEM alkalmazható közvetlenül a Richardson-extrapoláció az $\int_0^1 x^{1/3}\,dx$ integrálra?**
A) Mert az integrál divergens.
B) Mert $f(x)=x^{1/3}$ nem deriválható a $0$-ban, így a hibaformula simasági feltétele sérül.
C) Mert a trapézformula erre az $f$-re nem konvergál.
D) Mert $x^{1/3}$ nem integrálható $[0,1]$-en.

<details><summary>Válasz</summary><b>B.</b> Az integrál létezik és véges, a trapéz is konvergál — de a Richardson levezetése feltételezi a megfelelő derivált létezését/simaságát, ami a $0$-beli szingularitás miatt sérül. Ilyenkor Gauss-kvadratúra kell.</details>

**7. Melyik típusú kvadratúra formulánál egyenlők az $A_k$ SÚLYOK (nem az alappontok közei)?**
A) Newton–Cotes B) Csebisev C) Gauss D) Trapéz

<details><summary>Válasz</summary><b>B) Csebisev.</b> Csebisev: $A_k\equiv A$. Newton–Cotesnál az *alappontok* ekvidisztánsak, nem a súlyok egyenlők — klasszikus csere-csapda.</details>

**8. $n{+}1$ alappont esetén egy Gauss-típusú formula legfeljebb hányadfokú polinomig lehet pontos?**
A) $n$ B) $n+1$ C) $2n$ D) $2n+1$

<details><summary>Válasz</summary><b>D) $2n+1$.</b> A Gauss mindkét paraméterhalmazt (súlyok + alappontok, összesen $2(n+1)$ szabad paraméter) optimalizálja, így eléri az elméleti maximumot, $2n+1$-et. A Newton–Cotes (rögzített alappontok) általában csak $n$-ig (páros $n$-nél $n+1$-ig).</details>

**9. Ha az összetett trapézformulánál megduplázzuk az osztások számát ($m \to 2m$), nagyjából hányadrészére csökken a hiba (sima $f$ esetén)?**
A) Felére B) Negyedére C) Nyolcadára D) Tizenhatodára

<details><summary>Válasz</summary><b>B) Negyedére.</b> A trapéz összetett hiba $O(1/m^2)$, így $m\to 2m$ esetén $\frac{1}{2^2}=\frac14$-szeresére csökken. (Simpsonnál $O(1/m^4)$ → tizenhatodára.)</details>

---

## Mit mélyítsünk el?

Megvan a teljes ív; szólj, melyik irányba menjünk részletesebben. Pár lehetőség:

- **A páros $n$ szuperkonvergencia** pontos „miért”-je — az $\int x\,\omega_n(x)\,dx$ szimmetriaérve, hogy lásd, miért nyer a formula egy fokot.
- **A hibaformulák levezetése** (érintő/trapéz/Simpson) az interpolációs hibatételből + középértéktételből — a diákon „táblán” szerepelt, itt pótolhatom.
- **Romberg-integrálás** mint a Richardson rekurziója — a teljes $T$-tábla felépítése.
- **Gauss-kvadratúra** részletesen (ortogonális polinomok gyökei, súlyfüggvény, szingularitás) — a diákok ezt csak érintik.
- **Több gyakorló A/B/C/D** kifejezetten a hibakonstans/előjel és a zárt-nyílt/típus-megkülönböztetés köré.
- Bármelyik fenti fejezet újra, **más nézőpontból** vagy több példával.
