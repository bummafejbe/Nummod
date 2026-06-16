# Numerikus módszerek – vizsgakérdések, megoldások és magyarázatok

A kérdések teljes, eredeti szöveggel szerepelnek; **vastagon** a kérdés lényege van kiemelve.
Ahol a lapon bekarikázott válasz tévesnek tűnt, ott a matematikailag helyes választ adtam meg, és jeleztem a tipikus hibát.

---

# 1. VIZSGA (1–15. kérdés)

> Pontozás (a lap fejléce szerint): minden kérdés 1 pontot ér, pontosan egy helyes válasz van. 0–7 elégtelen (1), 8–11 elégséges (2), 12–15 közepes (3). Ha az írásbeli legalább elégséges, a hallgató jelentkezhet a szóbelire.

## 1. kérdés
Egy hőmérővel reggel $a = A + \Delta a$, este pedig $b = B + \Delta b$ hőmérsékletet mérünk. Mindkét esetben ugyanazt a hőmérőt használjuk, **ezért $\Delta a = \Delta b$. Mi a kapcsolat a mérések relatív hibája között?**

- a) Az $a$ mérés relatív hibája kisebb.
- b) A $b$ mérés relatív hibája kisebb.
- c) Mindkét mérés relatív hibája azonos.
- d) Nem dönthető el.

**Helyes válasz: b)**

A relatív hiba $\frac{\Delta a}{|a|}$, illetve $\frac{\Delta b}{|b|}$. Mivel az abszolút hiba azonos, a nagyobb mért értékhez tartozik a kisebb relatív hiba. Az ábra szerint $b$ a nagyobb érték.
- a) rossz: a kisebb értéknél nagyobb a relatív hiba.
- c) csak $|a| = |b|$ esetén lenne igaz.
- d) eldönthető az értékek nagyságviszonyából.

## 2. kérdés
Az $A \in \mathbb{R}^{n\times n}$ mátrixból a Gauss-elimináció $(n-1)$-ik lépése után az alábbi felső háromszögmátrixot kapjuk:

```
        ⎛ a₁₁⁽⁰⁾  a₁₂⁽⁰⁾  …   a₁ₙ⁽⁰⁾  ⎞
        ⎜   0     a₂₂⁽¹⁾  …   a₂ₙ⁽¹⁾  ⎟
A⁽ⁿ⁻¹⁾ =⎜   ⋮       ⋮     ⋱     ⋮      ⎟
        ⎝   0       0     …   aₙₙ⁽ⁿ⁻¹⁾ ⎠
```

**Melyik állítás igaz az alábbiak közül?**

- a) Az $A$ mátrix sajátértékei: $\lambda_i = a_{ii}^{(i-1)}$ ($i=1,\dots,n$).
- b) $\det(A) = a_{11}^{(0)} \cdot a_{22}^{(1)} \cdots a_{nn}^{(n-1)}$.
- c) Ha $a_{ii}^{(i-1)} > 0$ ($i=1,\dots,n$), akkor $A$ pozitív definit.
- d) Egyik sem.

**Helyes válasz: b)**

A sorcserék nélküli Gauss-elimináció nem változtatja a determinánst, a felső háromszögmátrix determinánsa pedig a főelemek szorzata.
- a) rossz: az elimináció nem hasonlósági transzformáció.
- c) rossz: pozitív főelemek csak szimmetrikus mátrixnál garantálnak pozitív definitséget.
- d) rossz, mert b) igaz.

## 3. kérdés
Legyen $A \in \mathbb{R}^{n\times n}$ mátrix olyan, hogy nem minden alsóháromszögmátrixbeli eleme 0. Tegyük fel továbbá, hogy $A$-nak létezik $A = LU$ felbontása. **Az alábbi állítások közül az $L$ és $U$ mátrixokra vonatkozóan melyik hamis?**

- a) $p > q \Rightarrow \ell_{pq} = 0$
- b) $p < q \Rightarrow u_{qp} = 0$
- c) $p = q \Rightarrow \ell_{qp} = 1$
- d) $p \ne q \Rightarrow \ell_{pq} u_{pq} = 0$

**Helyes válasz (hamis): a)**

$L$ alsó háromszögmátrix, tehát az átló alatti ($p>q$) elemek éppen a (nem nulla) elemek; az a) hamisan állítja, hogy nullák.
- b) igaz: $U$ átlója alatti elem 0.
- c) igaz: Doolittle-féle $LU$-ban $L$ átlója csupa 1.
- d) igaz: ha $p<q$ akkor $\ell_{pq}=0$, ha $p>q$ akkor $u_{pq}=0$.

## 4. kérdés
Tekintsük az $Ax = b$ és a $By = c$ LER-eket. Feltételezve, hogy a jobboldalak relatív hibája azonos, **akkor várhatóan melyik LER megoldásának lesz nagyobb a relatív hibája, ha $1 \approx \mathrm{cond}(A) \ll \mathrm{cond}(B)$?**

- a) Az 1. LER megoldásának relatív hibája lesz nagyobb.
- b) A 2. LER megoldásának relatív hibája lesz nagyobb.
- c) Mindkét LER megoldásának relatív hibája azonos.
- d) A kondíciószám nem befolyásolja a végeredményt.

**Helyes válasz: b)**

$\frac{\|\delta x\|}{\|x\|} \lesssim \mathrm{cond}(A)\cdot\frac{\|\delta b\|}{\|b\|}$; $B$ rosszul kondicionált, így a 2. rendszerben nagyobb a hiba.
- a) rossz: az 1. (jól kondicionált) rendszerben kicsi a hiba.
- c) rossz: a két kondíciószám nagyon eltérő.
- d) rossz: a kondíciószám a meghatározó.

## 5. kérdés
Legyenek $x_0=0,\ x_1=1,\ x_2=2$ az interpoláció alappontjai, $y_0=1,\ y_1=1,\ y_2=0$ a hozzá tartozó függvényértékek. **Melyik az adott pontrendszerre illeszkedő interpolációs polinom?**

- a) $L_2(x) = -x^2 + x + 1$
- b) $L_2(x) = x^2 + x + 1$
- c) $L_2(x) = \frac12 x^2 - \frac12 x + 1$
- d) $L_2(x) = -\frac12 x^2 + \frac12 x + 1$

**Helyes válasz: d)**

$p(0)=1\Rightarrow c=1$; $p(1)=1\Rightarrow a+b=0$; $p(2)=0\Rightarrow 4a+2b=-1$. Innen $a=-\frac12,\ b=\frac12$.
- a), b), c) legalább egy ponton elbuknak (pl. c)-nél $p(2)=2$).

## 6. kérdés
**Melyik összefüggés igaz az összetett kvadratúraformulák hibájára, ha $f \in C^4[a,b]$?**

- a) $\left|\int_a^b f - T_m(f)\right| \le \frac{(b-a)^3}{24m^2}\,M_2$
- b) $\left|\int_a^b f - T_m(f)\right| \le |T_m(f)+T_{2m}(f)|$
- c) $\left|\int_a^b f - S_m(f)\right| \le -\frac{(b-a)^5}{180m^4}\,M_4$
- d) $\left|\int_a^b f - S_m(f)\right| \le |S_m(f)-S_{2m}(f)|$

**Helyes válasz: a)**

Az egyetlen valódi felső korlát: pozitív együttható, a második derivált korlátja ($M_2$), $\sim 1/m^2$ csökkenés.
- b) rossz: a hiba nem becsülhető az értékek összegével.
- c) rossz: a jobb oldal negatív (abszolútérték nem lehet negatívnál kisebb); az $M_4$ a Simpsonhoz tartozik.
- d) rossz: csak heurisztikus (Runge) becslés, nem szigorú korlát.

## 7. kérdés
**Igaz-e, hogy $\mathbb{R}^3$-ban tetszőleges $\|\cdot\|_a$ és $\|\cdot\|_b$ vektornorma ekvivalens?** Azaz, léteznek-e olyan $0 < c_1, c_2$ konstansok, melyre $c_1\|x\|_a \le \|x\|_b \le c_2\|x\|_a$ teljesül minden $x \in \mathbb{R}^3$ esetén?

- a) Létezik, de csak $c_1\|x\|_a \le \|x\|_b$ teljesül.
- b) Létezik, de csak $\|x\|_b \le c_2\|x\|_a$ teljesül.
- c) Létezik ilyen $c_1$ és $c_2$.
- d) Nem létezik ilyen $c_1$ és $c_2$.

**Helyes válasz: c)**

Véges dimenziós térben minden norma ekvivalens, így mindkét konstans létezik egyszerre.
- a), b) rossz: nemcsak az egyik egyenlőtlenség teljesül.
- d) rossz: véges dimenzióban léteznek a konstansok.

## 8. kérdés
**Melyik állítás igaz a $T_5$ Csebisev-polinomra?**

- a) $T_5$ egy (1) főegyütthatós polinom.
- b) $T_5(x) = 2x\,T_4(x) + T_3(x)$
- c) A polinom gyökei: $x_k = \cos\!\left(\frac{2k-1}{2n}\pi\right)$ ($k=1,\dots,5$).
- d) A polinom szélsőérték-helyei: $\xi_k = \sin\!\left(\frac{k\pi}{n}\right)$ ($k=0,\dots,5$).

**Helyes válasz: c)**

$T_n$ gyökei $x_k=\cos\frac{(2k-1)\pi}{2n}$.
- a) rossz: $T_5$ főegyütthatója $2^4=16$, nem 1.
- b) rossz: a rekurzió $T_5=2x\,T_4 - T_3$ (mínusz).
- d) rossz: a szélsőértékhelyek $\xi_k=\cos\frac{k\pi}{n}$ ($\cos$, nem $\sin$).

## 9. kérdés
**A lebegőpontos számábrázolás definíciójában miért van szükség a normalizálásra?**

- a) Pontosabb számábrázolást tesz lehetővé.
- b) Több számot tudunk így ábrázolni.
- c) Egyértelművé teszi a gépi számok megadását.
- d) Ez egy konvenció, nincs különösebb haszna.

**Helyes válasz: c)**

Normalizálás nélkül ugyanaz a szám többféleképp lenne felírható; a normalizálás egyértelművé teszi minden gépi szám alakját.
- a), b), d) rossz: nem a pontosságról/darabszámról szól, és van haszna.

## 10. kérdés
Egy $n\times n$-es $A$ mátrixon elvégezzük a Gauss-eliminációt. **Hozzávetőlegesen mennyi művelet szükséges egy $2n\times 2n$-es $B$ mátrix Gauss-eliminációjához?**

- a) 8-szor annyi
- b) 4-szer annyi
- c) 2-szer annyi
- d) ugyanannyi

**Helyes válasz: a)**

A műveletigény $\sim \frac{n^3}{3}$, azaz $O(n^3)$. $(2n)^3 = 8n^3$, tehát kb. 8-szor annyi.

## 11. kérdés
Keressük az $f(x) = e^x - |x|$ függvény gyökét. **Az alábbi gyökkereső algoritmusok közül melyik alkalmazható ebben az esetben?**

- a) A húrmódszer az $x_0 = -2$ és $x_1 = 2$-ből indítva.
- b) A Newton-módszer az $x_0 = 0$-ból indítva.
- c) Mindkettő.
- d) Egyik sem.

**Helyes válasz: a)**

$f(-2)<0$, $f(2)>0$, van előjelváltás, így a húrmódszer működik. A Newton $x_0=0$-ból nem alkalmazható, mert $|x|$ az $x=0$-ban nem differenciálható, $f'(0)$ nem létezik.
- c) rossz: a Newton 0-ból elbukik.
- d) rossz: a húrmódszer működik.

## 12. kérdés
**Mindig létezik-e olyan $x$ vektor, ami az $\frac{\|Ax\|_\infty}{\|x\|_\infty}$ hányadost maximalizálja?**

- a) Igen, $\lambda_{\max}(A)$ sajátértékhez egy sajátvektora mindig ilyen.
- b) Igen, azok a csupa nulla vektorok, melyek $i.$ koordinátája 1, épp ilyenek.
- c) Igen, azok a vektorok, melyek $i.$ koordinátája $x_i = \pm1$ ($i=1,\dots,n$), épp ilyenek.
- d) Nem mindig létezik maximum, csak a sup létezése garantált.

**Helyes válasz: c)**

$\|A\|_\infty=\max_i\sum_j|a_{ij}|$ (legnagyobb abszolút sorösszeg), amit a megfelelő sor előjeleihez igazodó $\pm1$ koordinátájú vektor ad.
- a) rossz: ez nem a sajátvektorral függ össze.
- b) rossz: az egységvektorok általában nem maximalizálnak.
- d) rossz: véges dimenzióban a maximum létezik (kompakt egységgömb).

## 13. kérdés
**Az alábbi, $P$ értékeire vonatkozó Horner-algoritmusból adódó táblázat alapján mi lesz $Q(2)\cdot(P''(3)-2)$ értéke, ahol $P(x) = Q(x)\cdot(x-3)$?**

```
aᵢ    | 1 | -9 | 23  | -15
ξᵢ    | 3 |  3 | -18 |  15
aᵢ⁽¹⁾ | 1 | -6 |  5  |  0
ξᵢ    | 3 |  3 | -9
aᵢ⁽²⁾ | 1 | -3 | -4
ξᵢ    | 3 |  3
aᵢ⁽³⁾ | 1 |  0
```

- a) 6
- b) $-6$
- c) 0
- d) 5

**Helyes válasz: a) 6**

$Q(x)=x^2-6x+5$, így $Q(2)=-3$. $P''(x)=6x-18$, $P''(3)=0$. Tehát $(-3)\cdot(0-2)=6$.
A $-6$ tipikus előjelhibából jön ($Q(2)$-t tévesen $+3$-nak véve).

## 14. kérdés
**Melyik a helyes összefüggés egy $\sum_{k=0}^n A_k f(x_k)$ interpolációs kvadratúra formula együtthatóira vonatkozóan?**

- a) $A_k = \int_a^b \frac{\omega_n(x)}{x-x_k}\,dx$
- b) $A_k = \int_a^b \frac{\omega_n(x)}{x_k-x_n}\,dx$
- c) $A_k = c\cdot\int_a^b \frac{\omega_n(x)}{x-x_k}\,dx$, ahol $c\ne0$ konstans
- d) $A_k = c\cdot\int_a^b \omega_n(x)\,dx$, ahol $c\ne0$ konstans

**Helyes válasz: c)**

$A_k=\int_a^b L_k(x)\,dx$, ahol $L_k(x)=\frac{\omega_n(x)}{(x-x_k)\,\omega_n'(x_k)}$, és $\frac{1}{\omega_n'(x_k)}$ konstans.
- a) rossz: hiányzik a konstans szorzó.
- b) rossz: a nevezőben $(x-x_k)$ kell.
- d) rossz: az $(x-x_k)$-val való osztás nem hagyható el.

## 15. kérdés
Legyen $x, y \in \mathbb{R}^n$ vektor, továbbá $\sum_{i=1}^n x_i = 0$. Tegyük fel, hogy $x$ és $y$ vektorok komponenseiből alkotott $(x_i, y_i)$ pontokra egyenest szeretnénk illeszteni a tanult legkisebb négyzetek módszere segítségével. **Mikor lesz a feladat megoldása konstans függvény?**

- a) Akkor, ha $\sum_{i=1}^n y_i = 0$.
- b) Akkor, ha az $x$ és $y$ vektorok párhuzamosak egymással.
- c) Akkor, ha az $x$ és $y$ vektorok merőlegesek egymásra.
- d) Soha, a megoldás mindig pontosan elsőfokú polinom.

**Helyes válasz: c)**

A megoldás akkor konstans, ha a meredekség 0. Mivel $\bar x=0$, $m=\frac{\langle x,y\rangle}{\|x\|^2}$, így $m=0 \iff x\perp y$.
- a) rossz: $\sum y_i=0$ csak a konstans tagot érinti.
- b) rossz: párhuzamosság esetén $m\ne0$.
- d) rossz: merőleges esetben éppen konstans.

---

# 2. VIZSGA (1–15. kérdés)

> A lap fejléce ugyanazt a pontozást írja le, mint az 1. vizsgán (15 kérdés, kérdésenként 1 pont, egy helyes válasz).

## 1. kérdés
Jelöljön $(x_0,y_0),(x_1,y_1),\dots,(x_n,y_n)$ összesen $n+1$ adatpontot, melyekre $x_i \ne x_j$ ($i\ne j$). **Mi lesz az (egyértelmű) interpolációs polinom fokszáma?**

- a) $n+1$
- b) $n+1$ vagy kevesebb
- c) $n$
- d) $n$ vagy kevesebb

**Helyes válasz: d)**

$n+1$ pontra pontosan egy, legfeljebb $n$-edfokú polinom illeszkedik. A fokszám legfeljebb $n$ – „$n$ vagy kevesebb", mert ha a pontok pl. egy egyenesen vannak, a fok kisebb is lehet.
- a) rossz: az $n+1$ a pontok száma, nem a fok.
- b) rossz: $n+1$ túl magas.
- c) rossz: nem feltétlenül pontosan $n$.

## 2. kérdés
Tekintsük az $M(t,-4,4)$ gépi számhalmazt. **Melyik állítás igaz?**

- a) A legkisebb pozitív $M$-beli gépi szám értéke $\frac{1}{16}$.
- b) $M$ számossága $2^{4+t}$.
- c) A különbség 1 és a rákövetkező gépi szám között $2^{1-t}$.
- d) A legnagyobb gépi szám $M$-ben $2^{5-t}$.

**Helyes válasz: c)**

Az 1-et $0.1\underbrace{0\dots0}{}\cdot 2^1$ alakban ábrázoljuk; a rákövetkező szám $1+2^{1-t}$, tehát a rés $2^{1-t}$ (konvenciótól függetlenül igaz).
- a) rossz: a legkisebb pozitív szám $\frac12\cdot2^{-4}=2^{-5}=\frac1{32}$.
- b) rossz: a számosság $\approx 9\cdot 2^t$, nem $2^{4+t}$.
- d) rossz: a legnagyobb $\approx 2^4$ nagyságrendű.

## 3. kérdés
Legyen $f(x)=x(\sqrt{x}-1)$. Newton-módszer segítségével szeretnénk meghatározni az $x=1{,}0$-hoz közel eső zérust. **Az alábbi formulák közül melyik írja le helyesen a Newton-módszer következő lépését?**

- a) $x_{n+1}=x_n-\frac{(\sqrt{x_n}+1)}{\frac13\sqrt{x_n}+1}$
- b) $x_{n+1}=x_n-\frac{x_n(\sqrt{x_n}-1)}{\frac32\sqrt{x_n}-1}$
- c) $x_{n+1}=x_n-\frac{x_n(\sqrt{x_n}+1)}{\frac32(x_n-2)}$
- d) $x_{n+1}=x_n-\frac{\sqrt{x_n}-1}{\frac12\sqrt{x_n}+2}$

**Helyes válasz: b)**

$f(x)=x^{3/2}-x$, $f'(x)=\frac32\sqrt{x}-1$, így a Newton-lépés $x_{n+1}=x_n-\frac{x_n(\sqrt{x_n}-1)}{\frac32\sqrt{x_n}-1}$ – pontosan a b).
- a), c), d) rossz: hibás derivált, illetve hibás átalakítás.

## 4. kérdés
Legyen $LU$ az $A$ reguláris négyzetes mátrix $LU$ felbontása. **Melyik formula írja le helyesen $A$ determinánsát?**

- a) $\det(A)=-\left(\prod_{i=1}^n \ell_{ii}\right)\cdot\left(\prod_{i=1}^n u_{ii}\right)$
- b) $\det(A)=\left(\prod_{i=1}^n \ell_{ii}\right)\cdot\left(\prod_{i=1}^n u_{ii}\right)$
- c) $\det(A)=\left(\prod_{i=1}^n \ell_{ii}\right)-\left(\prod_{i=1}^n u_{ii}\right)$
- d) Az $LU$ felbontás alapján semmit nem mondhatunk $\det(A)$-ról.

**Helyes válasz: b)**

$\det(A)=\det(L)\det(U)$, és háromszögmátrix determinánsa az átlóelemek szorzata.
- a) rossz: a mínusz előjel hibás.
- c) rossz: szorzat kell, nem különbség.
- d) rossz: éppen meghatározható.

## 5. kérdés
**Melyik kvadratúra formula adja meg biztosan az alábbi integrál pontos értékét?**

$$\int_2^8 (x^2+2)\,dx$$

- a) az érintő (középponti) formula
- b) a trapéz formula
- c) a Simpson formula
- d) mindhárom

**Helyes válasz: c)**

Az integrandus másodfokú. A Simpson-formula pontossági foka 3, így másodfokú polinomra pontos (itt $180$). Az érintő- és a trapézformula pontossági foka csak 1, ezért másodfokúra nem pontos ($162$, illetve $216$).

## 6. kérdés
Legyen $x \in \mathbb{R}^n$. **Az alábbi normákra vonatkozó egyenlőtlenségek közül melyik teljesül minden $x$-re?**

- a) $\|x\|_2 \le \|x\|_\infty \le \|x\|_1$
- b) $\|x\|_\infty \le \|x\|_2 \le \|x\|_1^{\,2}$
- c) $\|x\|_\infty \le \|x\|_1 \le \|x\|_2$
- d) $\|x\|_\infty \le \|x\|_2 \le \|x\|_1$

**Helyes válasz: d)**

A standard normalánc: $\|x\|_\infty \le \|x\|_2 \le \|x\|_1$.
- a) rossz: $\|x\|_2\le\|x\|_\infty$ nem igaz (pl. $x=(1,1)$).
- b) rossz: a végén négyzet áll ($\|x\|_1^2$), ami kis vektorra elbukik (pl. $x=(0{,}1,0)$).
- c) rossz: $\|x\|_1\le\|x\|_2$ nem igaz (pl. $x=(1,1)$).

## 7. kérdés
Tekintsük az $x^3 = 2x + 1$ nemlineáris egyenletet, amelynek létezik megoldása az $[1{,}5;\,2{,}0]$ intervallumon. **Az alábbi fixpont iterációk közül melyik tart ehhez a megoldáshoz?**

- a) $x_{n+1} = \frac{x_n^3 - 1}{2}$
- b) $x_{n+1} = \frac{1}{x_n^2 - 2}$
- c) $x_{n+1} = \sqrt{\frac{2x_n + 1}{x_n}}$
- d) Egyik sem.

**Helyes válasz: c)**

A gyök $x^*=\frac{1+\sqrt5}{2}\approx1{,}618$; konvergenciához $|g'(x^*)|<1$ kell.
- c) $g(x)=\sqrt{2+\frac1x}$, $g'(x^*)\approx-0{,}12$ → konvergál.
- a) $g'(x^*)\approx3{,}9>1$ → divergál.
- b) $g'(x^*)\approx-8{,}5$ → divergál.

## 8. kérdés
**Az alábbi állítások közül melyik teljesül a mátrix normákra?**

- a) $\|A^\top\|_1 = \|A\|_\infty$
- b) $\|A\|_\infty$ megegyezik $A$ legnagyobb abszolút értékű szinguláris értékével.
- c) $\|A^{-1}\|_1 = \|A\|_\infty$
- d) $\|A\|_1$ megegyezik a legnagyobb $A$ oszlopvektoraira számolt Euklideszi normával.

**Helyes válasz: a)**

$\|A\|_1$ = legnagyobb abszolút oszlopösszeg, $\|A\|_\infty$ = legnagyobb abszolút sorösszeg; transzponáláskor felcserélődnek.
- b) rossz: a legnagyobb szinguláris érték a $\|A\|_2$.
- c) rossz: nincs ilyen kapcsolat.
- d) rossz: $\|A\|_1$ az abszolút értékek összege oszloponként, nem euklideszi norma.

## 9. kérdés
Tekintsük a $P(x) = (x-2)^2\cdot Q(x)$ polinomot és a hozzá tartozó Horner táblázatot. **Mennyi $Q(2) + \frac12\cdot P''(2)$?**

```
aᵢ    | 1 | -1 | -8  | 12
ξᵢ    | 1 |  2 |  2  | -12
aᵢ⁽¹⁾ | 1 |  1 | -6  |  0
ξᵢ    | 1 |  2 |  6
aᵢ⁽²⁾ | 1 |  3 |  0
ξᵢ    | 1 |  2
aᵢ⁽³⁾ | 1 |  5
```

- a) $-1$
- b) 5
- c) 10
- d) $-12$

**Helyes válasz: c) 10**

A táblázatból $Q(x)=x+3$, így $Q(2)=5$. A harmadik osztás maradéka $5=\frac{P''(2)}{2!}$, tehát $P''(2)=10$. Így $5+\frac12\cdot10=10$.
Az 5-ös válasz hibás: kimaradt a $\frac12 P''(2)=5$ tag.

## 10. kérdés
Tekintsük az $A(x + \Delta x) = b + \Delta b$ lineáris egyenletrendszert. **Mire ad felső becslést az $A$ mátrix kondíciószáma?**

- a) $\frac{\|\Delta x\|}{\|x\|}\cdot\frac{\|b\|}{\|\Delta b\|}$
- b) $\frac{\|\Delta x\|}{\|x\|}\big/\frac{\|b\|}{\|\Delta b\|}$
- c) $\frac{\|b\|}{\|\Delta b\|}$
- d) $\frac{\|\Delta x\|}{\|x\|}$

**Helyes válasz: a)**

$\frac{\|\Delta x\|}{\|x\|}\le \mathrm{cond}(A)\cdot\frac{\|\Delta b\|}{\|b\|}$, átrendezve $\frac{\|\Delta x\|}{\|x\|}\cdot\frac{\|b\|}{\|\Delta b\|}\le\mathrm{cond}(A)$.
- d) rossz: magára a megoldás relatív hibájára csak akkor korlát, ha a bemeneti relatív hiba $\le 1$.
- b), c) rossz: nem a helyes hibafelnagyítási arány.

## 11. kérdés
Jelölje $T_n(x)$ az $n$-ik elsőfajú Csebisev-polinomot, melyre a $[-1,1]$ intervallumon teljesül a $T_0(x)=1$, $T_1(x)=x$, $T_{n+1}(x)=2x\,T_n(x)-T_{n-1}(x)$ rekurzió. **Az alábbi állítások közül melyik hamis?**

- a) $T_n(\cos\theta)=\cos(n\theta)$ bármely valós $\theta$-ra.
- b) A $T_n(x)$ zérusai pontosan $x_k=\cos\!\left(\frac{(2k-1)\pi}{2n}\right)$, $k=1,2,\dots,n$.
- c) A $[-1,1]$ intervallumon a $T_n(x)$ polinom minimális 0-tól való eltérése a legnagyobb az összes egy főegyütthatós $n$-ed fokú polinom közül.
- d) A $T_n(x)$ ortogonális rendszert alkotnak a $w(x)=\frac{1}{\sqrt{1-x^2}}$ súlyfüggvényre nézve $[-1,1]$-en.

**Helyes válasz (hamis): c)**

A minimax-tétel fordítva szól: a normált (1-főegyütthatós) Csebisev-polinom eltérése a **legkisebb** az összes monikus $n$-edfokú polinom közül; a c) „legnagyobb"-at állít.
- a), b), d) igaz.

## 12. kérdés
Az összetett Trapéz-szabály alkalmazása során minden részintervallumon egy másodfokú interpolációs polinom integráljával közelítjük egy határozott integrál értékét. **Az alábbi állítások közül melyik teljesül az összetett Trapéz-szabályra, ha $n$ részintervallumot veszünk figyelembe?**

- a) $n$ csak páros szám lehet.
- b) $n$ csak páratlan szám lehet.
- c) $n$ bármilyen pozitív egész szám lehet.
- d) $n$ csak 4-el osztható szám lehet, hogy biztosítsuk a közelítés szimmetriáját.

**Helyes válasz: c)**

A trapézszabálynál nincs paritási megkötés ($n$ bármilyen pozitív egész lehet).
- a), b), d) rossz: ezek nem szükségesek a trapéznál.

> Megjegyzés: a kérdés szövege „másodfokú interpolációs polinom"-ot ír, de a trapézszabály valójában **lineáris** (elsőfokú) szakaszokkal közelít – ez pontatlanság a feladatban.

## 13. kérdés
Legyen $p_n(x)=a_n x^n+\dots+a_1 x+a_0$ az $\{(x_i,y_i)\}_{i=1}^N$ adatpontokat legkisebb négyzetes értelemben legjobban közelítő polinom, ahol $x_i\ne x_j$ és $N>n+1$. Legyen továbbá $A\in\mathbb{R}^{N\times(n+1)}$ az a Vandermonde mátrix, melyre teljesül, hogy $A_{ij}=x_i^{\,j-1}$. **Az alábbi állítások közül melyik teljesül az $\mathbf a=(a_0,a_1,\dots,a_n)^\top$ együttható vektorra?**

- a) Az $A^\top A$ mátrix általában nem szimmetrikus, de invertálható, ha $N>n+1$.
- b) Ha $\mathbf a$ a legkisebb négyzetes probléma megoldása, akkor a vele felírt $p_n$ polinom interpolál az $(x_i,y_i)$ adatokon.
- c) A legkisebb négyzetes együtthatók $\mathbf a$ vektora megoldja a Gauss-féle normálegyenletet $A^\top A\,\mathbf a=A^\top y$, ahol $A$ egy teljes rangú Vandermonde mátrix.
- d) A normálegyenlet csak abban az esetben írható fel, ha az $x_i$ alappontok egyenletes távolságra vannak egymástól.

**Helyes válasz: c)**

A normálegyenlet $A^\top A\,\mathbf a=A^\top y$; különböző $x_i$-k és $N\ge n+1$ miatt $A$ teljes oszloprangú, $A^\top A$ invertálható.
- a) rossz: $A^\top A$ **mindig** szimmetrikus.
- b) rossz: túlhatározott esetben ($N>n+1$) a legkisebb négyzetes illesztés nem interpolál (nem megy át minden ponton).
- d) rossz: nincs szükség egyenletes alappontokra.

## 14. kérdés
Tekintsük a folytonos $f$ függvénynek a $[-1,1]$ intervallumon interpoláló $n-1$-ed fokú polinomját. **Az alábbi lehetőségek közül melyik alappont rendszer választása minimalizálja az interpoláció hibájára vonatkozó becslést $[-1,1]$-en?**

- a) Egyenletes felosztás: $x_k=-1+\frac{2(k-1)}{n-1}$, ahol $k=1,\dots,n$.
- b) Csebisev alappontok: $x_k=\cos\!\left(\frac{2k-1}{2n}\pi\right)$, $k=1,\dots,n$.
- c) Egyenletes eloszlás szerint választott véletlen alappontok $[-1,1]$-en.
- d) Két alappont választása: $-1$ és 1.

**Helyes válasz: b)**

A hiba a $\frac{f^{(n)}(\xi)}{n!}\prod_k(x-x_k)$ tagtól függ; a Csebisev-alappontok minimalizálják a $\prod_k(x-x_k)$ maximumát $[-1,1]$-en.
- a) rossz: az egyenletes felosztás a Runge-jelenséghez vezet.
- c) rossz: véletlen pontok nem optimálisak.
- d) rossz: két ponttal nem lehet magasabb fokú interpolációt készíteni.

## 15. kérdés
Tekintsük a szimmetrikus pozitív definit $A \in \mathbb{R}^{n\times n}$ mátrixot, melynek fél-sávszélessége $w$, és tegyük fel, hogy az $A = LU$ felbontás sor és oszlopcserék nélkül előállítható. Jelölje $[A|A_{11}]$ az első eliminációs lépés után kapott Schur-komplemenst. **Az alábbi állítások közül melyik hamis?**

- a) Az $A_{11}$ mátrix szimmetrikus és pozitív definit.
- b) $A_{11}$ fél-sávszélessége kisebb vagy egyenlő $w$-nél.
- c) Az $U$ mátrix megőrzi a szimmetria tulajdonságot.
- d) Az $[A|A_{11}]$ Schur-komplemenst felhasználhatjuk a Gauss elimináció folytatásához az $A_{11}$ blokk eliminációját követően.

**Helyes válasz (hamis): c)**

Az $U$ felső háromszögmátrix, ami nem szimmetrikus (SPD esetben $U=DL^\top$).
- a) igaz: SPD mátrix Schur-komplemense is SPD.
- b) igaz: a sávszélesség nem nő (nincs fill-in a sávon kívül).
- d) igaz: így működik a blokk-elimináció.

---

## Gyors megoldókulcs

**1. vizsga:** 1-b · 2-b · 3-a · 4-b · 5-d · 6-a · 7-c · 8-c · 9-c · 10-a · 11-a · 12-c · 13-a · 14-c · 15-c

**2. vizsga:** 1-d · 2-c · 3-b · 4-b · 5-c · 6-d · 7-c · 8-a · 9-c · 10-a · 11-c · 12-c · 13-c · 14-b · 15-c

---

## Témakör-elemzés

A két vizsga azonos felépítésű: 15 feleletválasztós kérdés, kérdésenként 1 pont, pontosan egy helyes válasz. A kérdések a klasszikus numerikus módszerek (bevezető) tananyagát fedik le. A fő témakörök és előfordulásuk a meglévő kérdések alapján:

| Témakör | 1. vizsga | 2. vizsga |
|---|---|---|
| Hibaszámítás és kondicionáltság | 1, 4 | 10 |
| Direkt módszerek LER-re (Gauss, LU, sávmátrix) | 2, 3, 10 | 4, 15 |
| Vektor- és mátrixnormák | 7, 12 | 6, 8 |
| Lebegőpontos számábrázolás | 9 | 2 |
| Interpoláció | 5 | 1, 14 |
| Ortogonális / Csebisev-polinomok | 8 | 11 |
| Numerikus integrálás (kvadratúra) | 6, 14 | 5, 12 |
| Gyökkeresés / nemlineáris egyenletek | 11 | 3, 7 |
| Horner-séma | 13 | 9 |
| Legkisebb négyzetek | 15 | 13 |

Kérdéstípusok:
- **Elméleti, „melyik igaz / melyik hamis" állítás** – ez a többség (kondicionáltság, normák, LU, Csebisev, lebegőpont, Schur-komplemens).
- **Konkrét számolás** – kb. minden ötödik kérdés: interpolációs polinom kiszámítása (1/5), Horner-táblázatból érték (1/13, 2/9).
- **Képlet / összefüggés felismerése** – kvadratúra-együtthatók (1/14), kondíciószám-korlát (2/10), normaláncok (2/6).
- **Algoritmus alkalmazhatóságának eldöntése** – gyökkeresés (1/11), fixpont-iteráció konvergenciája (2/7).

Összegzés: a hangsúly a lineáris algebrai numerikán (LER-megoldás, normák, kondíciószám) és a közelítésen/interpoláción/integráláson van, kiegészítve néhány alapfogalmi kérdéssel (lebegőpont, hiba). A kérdések túlnyomórészt fogalmi-elméleti jellegűek, és kb. 20%-uk igényel konkrét számolást.

Érdemes megfigyelni, hogy a két vizsga **majdnem párhuzamos felépítésű**: szinte minden témakör mindkét vizsgán megjelenik (normák, kondíciószám, Horner, Csebisev, interpoláció, gyökkeresés, LER/LU, legkisebb négyzetek). Gyakorlatilag ugyanazt a tananyagot kérik számon más-más konkrét kérdésekkel – így a két lap együtt jó lefedettséget ad a vizsgára való felkészüléshez.
