/* ===== Tananyag-leckék — bővített, kidolgozott példákkal ===== */
var R = String.raw;

var LESSON_LEAD = "Ez a tíz lecke logikus sorrendben, egymásra épülve viszi végig a teljes vizsgaanyagot. Mindegyikben megtalálod a szükséges KÉPLETEKET és KIDOLGOZOTT PÉLDÁKAT is, hogy a hozzá tartozó kérdéseket ténylegesen meg tudd oldani. Olvasd el a leckét, dolgozd át a példát, majd a „→” gombbal ugorj a kérdésekhez. Jelöld késznek, ha érted.";

var LESSONS = [

/* ============ 1 ============ */
{id:"l1", no:1, title:"Gépi számábrázolás és hibafogalmak", est:"~50 perc",
 html:R`<p>A gép véges sok számot tud ábrázolni. Ennek a halmaznak a szerkezetét és a belőle adódó hibákat kell pontosan ismerned — a kérdések jó része konkrét számolás egy $M(t,k^-,k^+)$ halmazon.</p>
<div class="callout"><div class="h">Jelölések ebben a leckében</div><ul>
<li>$A$ = pontos érték, $a$ = közelítő érték; $\Delta a=A-a$ = (előjeles) hiba, $\Delta_a$ = (felső) hibakorlát, $\delta a$ = relatív hiba, $\delta_a$ = relatív hibakorlát.</li>
<li>$M(t,k^-,k^+)$ = gépi számhalmaz; $t$ = mantisszahossz (bitek száma), $k$ = kitevő (karakterisztika), $k^-,k^+$ = a kitevő alsó/felső korlátja.</li>
<li>$m$ = mantissza, $m_1$ = vezető bit ($=1$); $[m_1\dots m_t\,|\,k]$ = a gépi szám tömör jelölése.</li>
<li>$\varepsilon_0$ = legkisebb pozitív gépi szám, $\varepsilon_1$ = gépi epszilon, $M_\infty$ = legnagyobb gépi szám, $|M|$ = a halmaz elemszáma (számossága).</li>
<li>$\mathrm{fl}(x)$ = az $x$-hez legközelebbi gépi szám (input/kerekítő függvény); <i>binád</i> = azonos kitevőjű szakasz.</li>
</ul></div>

<h3>1. Hibafogalmak</h3>
<p>Pontos érték $A$, közelítő $a$. A {{abshiba|hiba}} $\Delta a=A-a$ <b>előjeles</b> és általában ismeretlen; az abszolút hiba $|\Delta a|$; a {{hibakorlat|hibakorlát}} $\Delta_a\ge|\Delta a|$ egy ismert felső becslés. A relatív hiba $\delta a=\frac{\Delta a}{A}\approx\frac{\Delta a}{a}$, a relatív hibakorlát $\delta_a$.</p>

<h3>2. A gépi szám alakja</h3>
<p>Egy {{gepiszam|normalizált gépi szám}}: $a=\pm m\cdot 2^{k}$, ahol $m=\sum_{i=1}^{t}m_i 2^{-i}$, a vezető bit $m_1=1$ ({{normalizalas|normalizálás}} → egyértelműség, ezért $\tfrac12\le m<1$). Jelölés: $a=\pm[m_1m_2\dots m_t\,|\,k]=\pm 0.m_1m_2\dots m_t{}_{(2)}\cdot 2^{k}$, és $k^-\le k\le k^+$. A halmaz: $M(t,k^-,k^+)$, plusz külön a $0$.</p>

<div class="callout"><div class="h">Képletek — ezeket tudni KELL</div>
<div class="tablewrap"><table class="grid">
<tr><th>Mennyiség</th><th>Képlet</th><th>Jelentés</th></tr>
<tr><td>$\varepsilon_0$ — legkisebb pozitív</td><td>$2^{\,k^- -1}$</td><td>alulcsordulási küszöb</td></tr>
<tr><td>$\varepsilon_1$ — gépi epszilon</td><td>$2^{\,1-t}$</td><td>az 1 és a rákövetkező gépi szám rése</td></tr>
<tr><td>$M_\infty$ — legnagyobb</td><td>$(1-2^{-t})\cdot 2^{\,k^+}$</td><td>efölött túlcsordulás</td></tr>
<tr><td>$|M|$ — számosság</td><td>$2\cdot 2^{\,t-1}\cdot(k^+-k^-+1)+1$</td><td>±előjel · mantisszák · kitevők, +1 a nulla</td></tr>
<tr><td>relatív input hiba</td><td>$\le \tfrac12\varepsilon_1=2^{-t}$</td><td><b>csak $t$-től függ</b></td></tr>
<tr><td>szomszédos gépi számok távolsága</td><td>$2^{\,k-t}$ (egy binádon belül)</td><td>a kitevővel duplázódik</td></tr>
</table></div></div>

<div class="callout"><div class="h">Kidolgozott példa — $M(3,-1,2)$</div>
<p>Itt $t=3$, $k^-=-1$, $k^+=2$. Az elemek alakja $\pm 0.1m_2m_3{}_{(2)}\cdot 2^{k}$ ($m_1=1$ rögzített).</p>
<ul>
<li>$\varepsilon_0=2^{k^- -1}=2^{-2}=\tfrac14$</li>
<li>$\varepsilon_1=2^{1-t}=2^{-2}=\tfrac14$ &nbsp;(itt véletlenül egyenlő $\varepsilon_0$-lal — általában NEM az!)</li>
<li>$M_\infty=(1-2^{-3})\cdot 2^{2}=\tfrac78\cdot 4=3{,}5$</li>
<li>$|M|=2\cdot 2^{2}\cdot(2-(-1)+1)+1=2\cdot4\cdot4+1=33$</li>
</ul>
<p>A mantisszák ($m_1=1$): $0.100,0.101,0.110,0.111=\tfrac12,\tfrac58,\tfrac34,\tfrac78$ — ez $2^{t-1}=4$ darab, ezt szorozzuk a kitevők számával és $2$-vel (előjel).</p></div>

<div class="callout"><div class="h">Kidolgozott példa — $M(t,-4,4)$ (a 2. vizsga 2. kérdése)</div>
<ul>
<li>Legkisebb pozitív: $\varepsilon_0=2^{-4-1}=2^{-5}=\tfrac1{32}$ &nbsp;(NEM $\tfrac1{16}$!)</li>
<li>Rés az 1-nél: $\varepsilon_1=2^{1-t}$ ✔ (ez a helyes válasz)</li>
<li>Legnagyobb: $M_\infty=(1-2^{-t})2^{4}\approx 2^4$ nagyságrend (NEM $2^{5-t}$)</li>
<li>Számosság: $|M|=2\cdot2^{t-1}\cdot 9+1=9\cdot2^{t}+1\approx 9\cdot2^{t}$ (NEM $2^{4+t}$)</li>
</ul></div>

<div class="callout"><div class="h">Hogyan olvasd: $-[11011\,|\,3]$ melyik halmazban van?</div>
<p>A mantissza $5$ bites ($11011$) → kell $t\ge 5$. A kitevő $3$ → kell $k^-\le 3\le k^+$. Mivel $m_1=1$, valódi normalizált szám. Pl. az $M(5,-1,4)$ tartalmazza ($t=5$, $k^+=4\ge3$). Értéke: $0.11011_{(2)}\cdot2^3=(\tfrac12+\tfrac14+\tfrac1{16}+\tfrac1{32})\cdot8=0{,}84375\cdot8=6{,}75$.</p></div>

<div class="callout"><div class="h">fl(x) és az input hiba</div>
<p>A {{flfun|fl(x)}} a legközelebbi gépi szám. A relatív hiba $\frac{|x-\mathrm{fl}(x)|}{|x|}\le 2^{-t}$ — független a nagyságrendtől. <b>Vigyázz:</b> a <i>karakterisztika</i> (kitevő) NEM relatív hibakorlát; a korlát mindig $2^{-t}$ (és minden ennél nagyobb szám is korlát, pl. $2^{-t+1}$). Két halmaz relatív hibájának aránya csak a $t$-k különbségén múlik: $M_1(t_1,\dots)$ vs. $M_2(t_2,\dots)$ → arány $2^{-t_1}/2^{-t_2}=2^{t_2-t_1}$.</p></div>

<div class="warn"><div class="h">⚠ Csapdák</div>$\varepsilon_0$ ($k^-$-tól) ≠ $\varepsilon_1$ ($t$-től) — csak véletlenül eshetnek egybe. Az abszolút input hiba $\propto|x|$ (nem állandó!), a relatív állandó.</div>
<div class="callout"><div class="h">További a kérdésbankhoz — kerekítési hibakorlát</div>
<p>Két szomszédos gépi szám távolsága a $k$ kitevőjű binádon $2^{k-t}$, ezért a kerekítés abszolút hibája legfeljebb a fele:
$$|x-\mathrm{fl}(x)|\le \tfrac12\cdot 2^{k-t}=2^{\,k-t-1}.$$
Pl. ha $\mathrm{fl}(x)=[1\dots1\,|\,7]\in M(4,-8,8)$ ($t=4,\ k=7$): a korlát $2^{7-4-1}=2^2=4$. Egy szám relatív hibakorlátja $2^{-t}$ és minden ennél NAGYOBB érték; egy kisebb (pl. $2^{-t-1}$) NEM garantált korlát.</p>
<p><b>$M(t,t,t)$ trükk:</b> ha $k^-=k^+=t$, akkor $|M|=2^{t}+1$ és $M_\infty=2^{t}-1$, így $|M|-M_\infty=2$ (mindig). $\varepsilon_0=\varepsilon_1$ pontosan akkor, ha $k^-+t=2$.</p></div>
<a class="golink" data-go="lebego">Lebegőpont-kérdések</a>`},

/* ============ 2 ============ */
{id:"l2", no:2, title:"Hibaterjedés és a kondíciószám", est:"~45 perc",
 html:R`<p>Műveletek közben a hibák felhalmozódnak. Két dolgot kell tudnod számolni: a hibakorlátok terjedését, és a függvény kondíciószámát.</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$\Delta_a,\delta_a$ = abszolút/relatív hibakorlát; $\Delta_{a\pm b},\Delta_{ab},\delta_{ab}$ = a művelet eredményének hibakorlátja. <i>(A $\Delta,\delta$ alapfogalmak az 1. leckéből.)</i></li>
<li>$c(f,a)$ = a függvény kondíciószáma az $a$ helyen (hányszorosára nagyítja a relatív hibát).</li>
<li>$f'$ = első derivált; $M_1=\max|f'|$ és $M_2=\max|f''|$ a deriváltak maximuma a szakaszon.</li>
<li>Eszközök: <i>Lagrange-középértéktétel</i> (1. rendű becslés), <i>Taylor-formula</i> (2. rendű).</li>
</ul></div>

<div class="callout"><div class="h">Képletek — hibaterjedés</div>
<div class="tablewrap"><table class="grid">
<tr><th>Művelet</th><th>Abszolút hibakorlát</th><th>Relatív hibakorlát</th></tr>
<tr><td>$a\pm b$</td><td>$\Delta_a+\Delta_b$</td><td>$\dfrac{|a|\delta_a+|b|\delta_b}{|a\pm b|}$</td></tr>
<tr><td>$a\cdot b$</td><td>$|b|\Delta_a+|a|\Delta_b$</td><td>$\delta_a+\delta_b$</td></tr>
<tr><td>$a/b$</td><td>$\dfrac{|b|\Delta_a+|a|\Delta_b}{b^2}$</td><td>$\delta_a+\delta_b$</td></tr>
</table></div>
<p><b>Megjegyezhető:</b> szorzás/osztás → a <i>relatív</i> hibák adódnak; összeadás/kivonás → az <i>abszolút</i> korlátok adódnak. Két veszélyes eset: {{kiejtes|közeli számok kivonása}} (a $\delta_{a\pm b}$ nevezője kicsi → robban) és {{elnyelodes|kicsi számmal osztás}} ($b^2$ kicsi).</p></div>

<div class="callout"><div class="h">Kidolgozott példa — mely állítás hamis?</div>
<p>$\delta_{x\cdot y}=\delta_x+\delta_y$ ✔, $\delta_{x/y}=\delta_x+\delta_y$ ✔, $\Delta_{x+y}=\Delta_x+\Delta_y$ ✔, de $\Delta_{x-y}=\Delta_x{-}\Delta_y$ <b>HAMIS</b> — kivonásnál is <i>összeadódnak</i> az abszolút korlátok ($\Delta_x+\Delta_y$), mert a legrosszabb esetben egy irányba mutatnak.</p></div>

<h3>Függvény kondíciószáma</h3>
<div class="callout"><div class="h">Képlet + jelentés</div>
<p>$$c(f,a)=\frac{|a|\,|f'(a)|}{|f(a)|},\qquad \delta_{f(a)}\approx c(f,a)\cdot\delta_a.$$
A {{kondfv|kondíciószám}} megmondja, hányszorosára nagyítja $f$ a relatív hibát. Az abszolút hibára: $\Delta_{f(a)}=|f'(a)|\,\Delta_a$ (elsőrendű, Lagrange-tételből), pontosabban $\Delta_{f(a)}=|f'(a)|\Delta_a+\tfrac{M_2}{2}\Delta_a^2$ (Taylor).</p></div>

<div class="callout"><div class="h">Kidolgozott példa — hibakorlát $\cos a$-ra ($a=\pi$)</div>
<p>$f=\cos$, $f'=-\sin$. Az abszolút hibakorlát: $\Delta_{\cos a}=|{-}\sin a|\cdot\Delta_a=|\sin\pi|\,\Delta_a=0\cdot\Delta_a$… elsőrendben $0$, de a másodrendű tag miatt a használható korlát $\Delta_{\cos a}=\tfrac{M_2}{2}\Delta_a^2=\tfrac{\Delta_a^2}{2}$ (mert $|\cos''|=|\cos|\le1$). Tehát a $\Delta_{\cos a}=\frac{\Delta_a^2}{2}$ az alkalmas.</p>
<p>Másik: $c(\exp,a)=\big|a\cdot e^a/e^a\big|=|a|$ → $\exp$-nél $a=\pi$-re $\approx3{,}14$-szeres nagyítás; $c(\ln,a)=\frac{1}{|\ln a|}$ → $\ln$ tompít (gyök közelében nagy a $c$).</p></div>

<div class="callout"><div class="h">Két mérés relatív hibája (1. vizsga 1.)</div>
<p>Azonos abszolút hiba ($\Delta a=\Delta b$) mellett a relatív hiba $\frac{\Delta a}{|a|}$ ill. $\frac{\Delta a}{|b|}$. A NAGYOBB mért értékhez tartozik a KISEBB relatív hiba.</p></div>

<div class="warn"><div class="h">⚠ Mikor rosszul kondicionált?</div>Ha $|f(a)|$ kicsi (gyök közelében) vagy $|f'(a)|$ nagy. A kiejtés ennek speciális esete: az $f(x)=x-c$ a gyökénél rosszul kondicionált. A {{stabilitas|stabilitás}} ezzel szemben az algoritmusé, nem a feladaté.</div>
<div class="callout"><div class="h">További a kérdésbankhoz — abszolút hiba a teljes szakaszon</div>
<p>A függvényérték abszolút hibakorlátja a deriváltat az EGÉSZ $[a-\Delta_a,\,a+\Delta_a]$ szakaszon maximalizálja (1. tétel):
$$\Delta_{f(a)}=M_1\cdot\Delta_a,\qquad M_1=\max_{\xi\in[a-\Delta_a,\,a+\Delta_a]}|f'(\xi)|.$$
<b>Példa:</b> $a=2$, $\Delta_a=1$, $f(x)=x^2+1$. A szakasz $[1,3]$, $f'(x)=2x$, $M_1=\max|2x|=6$ (a $3$-ban), tehát $\Delta_{f(a)}=6\cdot1=6$ — NEM $|f'(2)|\cdot1=4$!</p>
<p>Hatványfüggvény kondíciószáma: $f(x)=C x^{n}\Rightarrow c(f,a)=n$ minden $a$-ra. Szimmetrikus mátrixra a sajátértékekből $\mathrm{cond}_2(A)=\frac{\max|\lambda|}{\min|\lambda|}$ (pl. $\lambda=-2,3,4,6$ → $\mathrm{cond}_2=3$); szinguláris mátrixra ($\det=0$) a kondíciószám nincs értelmezve.</p></div>
<a class="golink" data-go="hiba">Hibaszámítás-kérdések</a>`},

/* ============ 3 ============ */
{id:"l3", no:3, title:"Lineáris egyenletrendszerek: Gauss, LU, progonka", est:"~75 perc",
 html:R`<p>Cél: $Ax=b$ megoldása direkt módszerrel. A kérdések determinánsra, az LU létezésére, a műveletigényre és a sávmátrixokra kérdeznek.</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$Ax=b$ = lineáris egyenletrendszer (LER); $\det(A)$ = determináns, $\operatorname{rang}(A)$ = rang, $A^{-1}$ = inverz.</li>
<li>$a_{kk}^{(k-1)}$ = pivot (főelem) = a $k\!-\!1$. lépés UTÁNI átlóelem; $m_{ik}$ = (a $k$. lépés) szorzója.</li>
<li>$L$ = egységalsó háromszög (1-esek az átlón), $U$ = felső háromszög; $\mathcal{L}_1$ = az egységalsó háromszögmátrixok halmaza.</li>
<li>$D_k$ = a $k$-adik vezető főminor (a bal felső $k\times k$ részmátrix determinánsa).</li>
<li>$[A\,|\,A_{11}]$ = Schur-komplementer (amin a GE-t folytatni kell); $w$ = fél-sávszélesség; SPD = szimmetrikus pozitív definit; szig. diag. dom. = szigorúan diagonálisan domináns.</li>
</ul></div>

<h3>Megoldhatóság</h3>
<p>A {{ler|LER}} egyértelműen megoldható $\iff\det(A)\ne0\iff\mathrm{rang}(A)=n\iff$ az oszlopok lin. függetlenek $\iff A$ invertálható. Ha $\det(A)=0$: nincs egyértelmű megoldás (vagy 0, vagy ∞ sok).</p>

<h3>Gauss-elimináció</h3>
<p>A $k$. lépés szorzója $m_{ik}=\dfrac{a_{ik}^{(k-1)}}{a_{kk}^{(k-1)}}$, és $a_{ij}^{(k)}=a_{ij}^{(k-1)}-m_{ik}\,a_{kj}^{(k-1)}$. Kell, hogy a {{pivot|pivot}} $a_{kk}^{(k-1)}\ne0$ legyen; ha $0$ → {{foelem|sorcsere}}.</p>

<div class="callout"><div class="h">Képletek — műveletigény és determináns</div>
<ul>
<li>Gauss-elimináció: $\tfrac23 n^3+O(n^2)$ — <b>köbös</b>.</li>
<li>Visszahelyettesítés (háromszög-LER): $n^2+O(n)$ — <b>négyzetes</b>.</li>
<li>$\det(A)=\prod_{k}a_{kk}^{(k-1)}$ = a pivotok szorzata. Minden sor-/oszlopcsere $\times(-1)$. (2 csere → $(-1)^2=+1$.)</li>
<li>Egy $2n\times2n$ rendszer $\approx 2^3=8$-szor annyi művelet ($O(n^3)$ miatt).</li>
</ul></div>

<h3>LU-felbontás</h3>
<p>$A=LU$, ahol $L$ <b>egységalsó</b> (1-esek az átlóban, alatta a $m_{ik}$ szorzók), $U$ <b>felső</b> (átlóján a pivotok). Megoldás: $Ly=b$ (előrehelyettesítés), majd $Ux=y$ (visszahelyettesítés) — mindkettő $n^2$.</p>

<div class="callout"><div class="h">Kidolgozott példa — 2×2 LU</div>
<p>$A=\begin{pmatrix}2&4\\3&1\end{pmatrix}$. Szorzó: $m_{21}=\tfrac{3}{2}$. A 2. sorból kivonjuk az 1. sor $\tfrac32$-szeresét: $a_{22}^{(1)}=1-\tfrac32\cdot4=1-6=-5$. Tehát
$$L=\begin{pmatrix}1&0\\ \tfrac32&1\end{pmatrix},\quad U=\begin{pmatrix}2&4\\0&-5\end{pmatrix}.$$
Ellenőrzés: $\det A=2\cdot(-5)=-10=u_{11}u_{22}$. A pivotok $2$ és $-5$.</p></div>

<div class="warn"><div class="h">⚠ Létezés ≠ regularitás</div>A sorcsere nélküli {{lu|LU}} létezik $\iff$ a vezető főminorok $D_1,\dots,D_{n-1}\ne0$ (csak $n{-}1$ feltétel; az utolsó pivot / $\det A$ NEM kell a létezéshez). Egyértelmű, ha $\det(A)\ne0$. $\det(A)\ne0$ önmagában <b>nem elég</b> a felbontáshoz! Az átló alatti elemek az $L$ tagjai → a „$p>q\Rightarrow\ell_{pq}=0$” HAMIS.</div>

<h3>Megmaradás és sávmátrixok</h3>
<p>A GE megőrzi: regularitás, szimmetria, {{spd|pozitív definitség}}, {{diagdom|szig. diag. dominancia}}, (nem növő) {{savszel|sávszélesség}}, profil — a {{schur|Schur-komplementeren}} keresztül. Következmény: SPD vagy diag. dom. mátrixnál <b>nem kell pivotálni</b>.</p>
<p>A {{progonka|progonka}} (Thomas) tridiagonális rendszert old meg: tárolás $3n-2$, művelet $8n+O(1)=O(n)$ — szemben $O(n^3)$-nal. Ezért egy $2n$-es tridiagonális rendszer csak $\approx 2$-szer annyi (lineáris!), nem 8-szor. Ugyanez kezeli a bidiagonális/profil sávmátrixokat is.</p>
<a class="golink" data-go="direkt">Gauss/LU-kérdések</a>`},

/* ============ 4 ============ */
{id:"l4", no:4, title:"Vektor- és mátrixnormák, kondíciószám", est:"~60 perc",
 html:R`<p>A hibák méréséhez kell a „nagyság”. A kérdések normaláncokra, a $\|A\|_1$ vs. $\|A\|_\infty$ képletre és a kondíciószámra kérdeznek.</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$\|x\|_1,\|x\|_2,\|x\|_\infty$ = vektornormák (összeg / euklideszi / maximum); $\|A\|_1,\|A\|_\infty,\|A\|_2$ = mátrixnormák, $\|A\|_F$ = Frobenius-norma.</li>
<li>$\lambda_i$ = sajátérték; $\varrho(A)$ = spektrálsugár ($=\max_i|\lambda_i|$); szinguláris érték $=\sqrt{\lambda_i(A^\top A)}$; $A^\top$ = transzponált.</li>
<li>$\operatorname{cond}(A)=\kappa(A)$ = kondíciószám ($=\|A\|\,\|A^{-1}\|$).</li>
<li>$\Delta b,\Delta x$ = perturbációk; $\delta b=\frac{\|\Delta b\|}{\|b\|}$, $\delta x=\frac{\|\Delta x\|}{\|x\|}$ = relatív hibák.</li>
<li>$r=b-A\tilde x$ = reziduum (maradékvektor), $\eta$ = relatív maradék; $B$ = az iterációs módszer átmenetmátrixa.</li>
</ul></div>

<div class="callout"><div class="h">Képletek — vektornormák</div>
<p>$\|x\|_1=\sum|x_i|$, &nbsp; $\|x\|_2=\sqrt{\sum x_i^2}$, &nbsp; $\|x\|_\infty=\max_i|x_i|$.</p>
<p>Sorrend (mindig): $\boxed{\|x\|_\infty\le\|x\|_2\le\|x\|_1}$ (nagyobb $p$ → kisebb norma). {{pnorma|p-norma}} csak $p\ge1$-re norma. Véges dimenzióban minden norma ekvivalens.</p></div>

<div class="callout"><div class="h">Képletek — mátrixnormák</div>
<div class="tablewrap"><table class="grid">
<tr><th>Norma</th><th>Képlet</th><th>Szabály</th></tr>
<tr><td>$\|A\|_1$</td><td>$\max_j\sum_i|a_{ij}|$</td><td>max <b>oszlop</b>összeg</td></tr>
<tr><td>$\|A\|_\infty$</td><td>$\max_i\sum_j|a_{ij}|$</td><td>max <b>sor</b>összeg</td></tr>
<tr><td>$\|A\|_2$ (spektrál)</td><td>$\sqrt{\max_i\lambda_i(A^\top A)}$</td><td>legnagyobb szinguláris érték</td></tr>
<tr><td>$\|A\|_F$ (Frobenius)</td><td>$\sqrt{\sum_{i,j}a_{ij}^2}=\sqrt{\mathrm{tr}(A^\top A)}$</td><td><b>nem</b> indukált ($\|I\|_F=\sqrt n$)</td></tr>
</table></div>
<p>A {{mxnorma|mátrixnorma}} = 4 vektoraxióma + szubmultiplikativitás $\|AB\|\le\|A\|\|B\|$. Indukáltra $\|I\|=1$. $\varrho(A)\le\|A\|$ mindig; szimmetrikus/normális $A$-ra $\|A\|_2=\varrho(A)$. Transzponálás: $\|A^\top\|_1=\|A\|_\infty$.</p></div>

<div class="callout"><div class="h">Kidolgozott példa — $A=\begin{pmatrix}1&-2\\3&1\end{pmatrix}$</div>
<ul>
<li>$\|A\|_1$: oszlopösszegek $|1|+|3|=4$ és $|{-}2|+|1|=3$ → $\max=4$.</li>
<li>$\|A\|_\infty$: sorösszegek $|1|+|{-}2|=3$ és $|3|+|1|=4$ → $\max=4$.</li>
<li>$\|A\|_F=\sqrt{1+4+9+1}=\sqrt{15}\approx3{,}87$.</li>
</ul>
<p>Vektorpélda $x=(1,1)$: $\|x\|_\infty=1\le\|x\|_2=\sqrt2\le\|x\|_1=2$ ✓ — ezért rossz pl. a „$\|x\|_2\le\|x\|_\infty$” állítás.</p></div>

<h3>Kondíciószám és érzékenység</h3>
<div class="callout"><div class="h">Képletek</div>
<p>$\mathrm{cond}(A)=\|A\|\,\|A^{-1}\|\ge1$ ({{conda}}). Szimmetrikusra $\mathrm{cond}_2(A)=\frac{\max|\lambda_i|}{\min|\lambda_i|}$. Ortogonálisra $\mathrm{cond}_2=1$.</p>
<p>{{erzekenyseg|Érzékenység}} (jobb oldal): $\dfrac{1}{\mathrm{cond}(A)}\dfrac{\|\Delta b\|}{\|b\|}\le\dfrac{\|\Delta x\|}{\|x\|}\le\mathrm{cond}(A)\dfrac{\|\Delta b\|}{\|b\|}$. Átrendezve: $\dfrac{\|\Delta x\|}{\|x\|}\cdot\dfrac{\|b\|}{\|\Delta b\|}\le\mathrm{cond}(A)$.</p></div>

<div class="note"><b>Reziduum:</b> $r=b-A\tilde x$, relatív maradék $\eta=\frac{\|r\|}{\|A\|\|\tilde x\|}$ a {{reziduum|visszafelé-hibát}} méri. Kicsi maradék mellett is lehet pontatlan a megoldás, ha $\mathrm{cond}(A)$ nagy. <b>Felbontások:</b> LU ronthatja a kondíciót, QR/Cholesky megőrzi $\mathrm{cond}_2$-t.</div>
<div class="callout"><div class="h">További a kérdésbankhoz — norma-egyenlőtlenségek</div>
<ul>
<li>$\displaystyle\max_{i,j}|a_{ij}|\le\|A\|_2\le\|A\|_F\le\sqrt{n}\,\|A\|_2$, &nbsp;és&nbsp; $\|A\|_2\le\sqrt{\|A\|_1\,\|A\|_\infty}$.</li>
<li>Ortogonális $Q$: $\|Q\|_2=1$, de $\|Q\|_F=\sqrt n$ (nem 1!). $Q$ ortogonális $\iff Q^\top Q=I$.</li>
<li>A legkisebb nyújtás: $\displaystyle\min_{x\ne0}\frac{\|Ax\|_2}{\|x\|_2}=\sqrt{\min_i\lambda_i(A^\top A)}$ (legkisebb szinguláris érték); a minimumot $\lambda_{\min}(A^\top A)$ sajátvektora adja.</li>
<li>Szimmetrikus $A$-ra sem mindig igaz $\|A\|_\infty\le\|A\|_2$ — a vektor-normalánc nem viszi át automatikusan a mátrixnormákra.</li>
</ul></div>
<div class="callout"><div class="h">Iteratív megoldás (Jacobi, Gauss–Seidel)</div>
<p>Az $x_{k+1}=Bx_k+c$ alakú iteráció (Jacobi, Gauss–Seidel, Richardson) MINDEN $x_0$-ból az $Ax=b$ megoldásához tart $\iff \varrho(B)<1$; ELÉGSÉGES: $\|B\|<1$ valamely illeszkedő mátrixnormában. Csillapított Jacobi: $B_J(\omega)=(1-\omega)I+\omega B_J$ (a sajátvektorok közösek, sajátérték $1-\omega+\omega\lambda$). Ha a Jacobi konvergál, tridiagonális $A$-ra a Gauss–Seidel kétszer gyorsabb.</p></div>
<a class="golink" data-go="norma">Norma- és kondíció-kérdések</a>`},

/* ============ 5 ============ */
{id:"l5", no:5, title:"Nemlineáris egyenletek: felezés, fixpont, Newton, húr, szelő", est:"~70 perc",
 html:R`<p>Egy $f(x)=0$ {{gyok|gyökét}} keressük iterációval. A kérdések a Newton-lépés felírására, a fixpont-konvergencia eldöntésére ($|g'|<1$) és a módszerek alkalmazhatóságára kérdeznek.</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$x^*$ = gyök (ahol $f=0$) / fixpont (ahol $\varphi(x^*)=x^*$); $\varphi$ (vagy $g$) = az iterációs függvény, $x_{k+1}=\varphi(x_k)$.</li>
<li>$q$ = kontrakciós együttható ($|\varphi(x)-\varphi(y)|\le q|x-y|$, $q<1$); $|\varphi'|$ = a derivált abszolút értéke.</li>
<li>$p$ = konvergencia rend; $c$ = aszimptotikus hibaállandó.</li>
<li>$m_1=\min|f'|$, $M_2=\max|f''|$, $M=\frac{M_2}{2m_1}$ (a Newton-hibabecslésben).</li>
<li>$F:\mathbb R^n\to\mathbb R^n$ = vektorfüggvény; $F'$ = Jacobi-mátrix (a parciális deriváltaké). <i>(Tételek: Bolzano, Brouwer, Banach.)</i></li>
</ul></div>

<h3>Felezés (intervallumfelezés)</h3>
<p>{{bolzano|Bolzano}}: ha $f\in C[a,b]$ és $f(a)f(b)<0$ → van gyök (elégséges, NEM szükséges; csak létezés). A felezés hibája $\frac{b-a}{2^k}$ → $0{,}1$ pontossághoz $\frac{1}{2^k}<\frac1{10}\Rightarrow k\ge4$ lépés. Legrobusztusabb, de lineáris (lassú).</p>

<h3>Fixpont-iteráció</h3>
<p><b>Az ötlet.</b> Az $f(x)=0$ egyenletet átrendezzük úgy, hogy az $x$ az egyik oldalon MAGÁBAN álljon: $f(x)=0\iff x=\varphi(x)$. Az így kapott $\varphi$-vel egy egyszerű <b>iterációt</b> indítunk: kiindulunk egy $x_0$-ból, és mindig behelyettesítjük a kapott értéket: $x_1=\varphi(x_0)$, $x_2=\varphi(x_1)$, …, $x_{k+1}=\varphi(x_k)$. Ha ez a sorozat egy $x^*$-hoz tart, akkor (folytonos $\varphi$ mellett) $x^*=\varphi(x^*)$, azaz $x^*$ <b>fixpont</b> — és épp ez az eredeti egyenlet gyöke.</p>

<div class="callout"><div class="h">Miért dönt a $|\varphi'(x^*)|$? (a mechanizmus)</div>
<p>Nézzük a <b>hibát</b>: $e_k:=x_k-x^*$. Mivel $x^*=\varphi(x^*)$, a következő lépés hibája
$$e_{k+1}=x_{k+1}-x^*=\varphi(x_k)-\varphi(x^*)\approx \varphi'(x^*)\,(x_k-x^*)=\varphi'(x^*)\,e_k$$
(a Lagrange-középértéktétel / Taylor szerint). Tehát minden lépésben a hiba kb. $\varphi'(x^*)$-gal szorzódik:</p>
<ul>
<li>ha $|\varphi'(x^*)|<1$ → a hiba lépésenként ZSUGORODIK ($|e_k|\to0$), az iteráció a fixponthoz tart → <b>vonzó</b> fixpont, <b>konvergál</b>;</li>
<li>ha $|\varphi'(x^*)|>1$ → a hiba NŐ, az iteráció elszökik → <b>taszító</b> fixpont, <b>divergál</b>;</li>
<li>a derivált ELŐJELE: $\varphi'(x^*)>0$ → a sorozat egy oldalról, monoton közelít; $\varphi'(x^*)<0$ → felváltva két oldalról (oszcillálva) közelít.</li>
</ul>
<p>Pontos tétel — {{banach|Banach}}: ha $\varphi$ {{kontrakcio|kontrakció}} az egész intervallumon ($|\varphi'(x)|\le q<1$ ott mindenhol), akkor PONTOSAN EGY fixpont van, az iteráció MINDEN $x_0$-ból konvergál, és $|x_k-x^*|\le q^k|x_0-x^*|$. {{bolzano2|Brouwer}} ennél kevesebbet kér (csak önmagába képezés + folytonosság), de csak a fixpont LÉTEZÉSÉT adja — konvergenciát nem.</p></div>

<div class="callout"><div class="h">Kidolgozott példa — melyik iteráció konvergál? ($x^3=2x+1$)</div>
<p><b>Az intervallum.</b> Az $[1{,}5;\,2]$-t a feladat adja, de ellenőrizhető Bolzanóval: $f(x)=x^3-2x-1$, $f(1{,}5)=-0{,}625<0$ és $f(2)=3>0$ → előjelváltás → van köztük gyök.</p>
<p><b>A gyök kiszámítása.</b> Keressünk egy „kézenfekvő” gyököt: $f(-1)=-1+2-1=0$, tehát $(x+1)$ kiemelhető: $x^3-2x-1=(x+1)(x^2-x-1)$. A másodfokú részt a megoldóképlet adja: $x^2-x-1=0\Rightarrow x=\frac{1\pm\sqrt5}{2}$, azaz $\approx1{,}618$ és $\approx-0{,}618$. A három gyök $-1,\,-0{,}618,\,1{,}618$ közül csak az $x^*=\frac{1+\sqrt5}{2}\approx1{,}618$ esik az $[1{,}5;2]$-be (ez az aranymetszés). <i>(A vizsgán nem kötelező pontosan kiszámolni — elég tudni, hogy ott van, és ott elvégezni a $|\varphi'|<1$ tesztet.)</i></p>
<p>Ugyanazt az egyenletet TÖBBFÉLEKÉPP rendezhetjük át $x=\varphi(x)$ alakra — és nem mind működik. A teszt: számold ki $|\varphi'(x^*)|$-ot (hasznos: $x^*{}^2\approx2{,}618$, $x^*{}^2-2\approx0{,}618$).</p>
<p><b>(a)</b> $2x+1=x^3$-ból $2x=x^3-1$, tehát $\varphi(x)=\dfrac{x^3-1}{2}$. &nbsp;Deriváltja $\varphi'(x)=\dfrac{3x^2}{2}$, behelyettesítve $\varphi'(x^*)=\dfrac{3\cdot2{,}618}{2}\approx3{,}93>1$ → a hiba ~3,9-szereződik lépésenként → <b>divergál</b>.</p>
<p><b>(b)</b> $x^3-2x=1$-ből $x(x^2-2)=1$, tehát $\varphi(x)=\dfrac{1}{x^2-2}$. &nbsp;$\varphi'(x)=\dfrac{-2x}{(x^2-2)^2}$, így $|\varphi'(x^*)|=\dfrac{2\cdot1{,}618}{(0{,}618)^2}\approx\dfrac{3{,}236}{0{,}382}\approx8{,}5>1$ → <b>divergál</b> (oszcillálva, mert negatív).</p>
<p><b>(c)</b> Osszuk el $x^3=2x+1$-et $x$-szel: $x^2=2+\frac1x$, tehát $\varphi(x)=\sqrt{2+\dfrac1x}$. &nbsp;$\varphi'(x)=\dfrac{-1/x^2}{2\sqrt{2+1/x}}$; mivel $\sqrt{2+1/x^*}=x^*$, ez $\varphi'(x^*)=\dfrac{-1/x^*{}^2}{2x^*}=\dfrac{-1/2{,}618}{2\cdot1{,}618}\approx\dfrac{-0{,}382}{3{,}236}\approx-0{,}12$, és $|{-}0{,}12|<1$ → <b>konvergál</b> ✔ (gyorsan, mert $0{,}12$ kicsi).</p>
<div class="note"><b>Hogyan deriváltunk törtet/gyököt?</b>
<p><b>Hányadosszabály:</b> $\left(\dfrac{u}{v}\right)'=\dfrac{u'\,v-u\,v'}{v^2}$ (számláló deriváltja szorozva a nevezővel, MÍNUSZ a számláló szorozva a nevező deriváltjával, az egész a nevező négyzetén). A (b) esetnél $u=1$, $v=x^2-2$, ezért $u'=0$, $v'=2x$, és
$$\varphi'(x)=\frac{0\cdot(x^2-2)-1\cdot 2x}{(x^2-2)^2}=\frac{-2x}{(x^2-2)^2}.$$
(Ugyanez a reciprok-szabállyal: $\big(\tfrac1v\big)'=-\dfrac{v'}{v^2}$.)</p>
<p><b>Láncszabály (gyökre):</b> $\big(\sqrt{u}\,\big)'=\dfrac{u'}{2\sqrt{u}}$. A (c) esetnél $u=2+\tfrac1x$, $u'=-\tfrac1{x^2}$, ezért $\varphi'(x)=\dfrac{-1/x^2}{2\sqrt{2+1/x}}$.</p>
<p><b>Az (a)-nál nincs tört:</b> $\varphi=\tfrac12(x^3-1)$ csak egy konstans-szoros, ezért egyszerűen $\varphi'=\tfrac12\cdot 3x^2=\tfrac{3x^2}{2}$.</p></div>
<p><b>Tanulság:</b> ugyanahhoz az $f(x)=0$-hoz több $\varphi$ tartozik; nem a „szebb” alak nyer, hanem amelyikre $|\varphi'(x^*)|<1$. Minél kisebb ez az érték, annál gyorsabb a konvergencia.</p></div>

<h3>Newton-módszer</h3>
<div class="callout"><div class="h">Képlet + a lépés felírása</div>
<p>$$x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}\quad(\text{az érintő} = \text{1. fokú Taylor zérushelye}).$$
<b>Recept:</b> írd fel $f$-et, deriváld, helyettesíts.</p></div>

<div class="callout"><div class="h">Kidolgozott példa — $f(x)=x(\sqrt x-1)$ (2. vizsga 3.)</div>
<p>$f(x)=x^{3/2}-x$, &nbsp; $f'(x)=\tfrac32 x^{1/2}-1=\tfrac32\sqrt x-1$. Tehát
$$x_{k+1}=x_k-\frac{x_k(\sqrt{x_k}-1)}{\tfrac32\sqrt{x_k}-1}.$$
A hibás opciók mind elrontják a deriváltat (pl. $\tfrac13\sqrt x$ vagy $\tfrac32(x-2)$).</p></div>

<div class="callout"><div class="h">Newton — rend és alkalmazhatóság</div>
<p>Általában <b>másodrendű</b>: $|x_{k+1}-x^*|\le M|x_k-x^*|^2$ (a pontos jegyek száma duplázódik), <b>csak egyszeres gyökre</b> ($f'(x^*)\ne0$). Többszörös gyöknél $\tfrac00$ → csak elsőrendű. $f'(x_k)=0$-nál nincs értelmezve, rossz helyről divergálhat/ciklizálhat.<br>
Pl. $f(x)=e^x-|x|$, $x_0=0$: a Newton NEM megy ($|x|$ a 0-ban nem deriválható), de a húr $x_0=-2,x_1=2$-ből igen (van előjelváltás).</p></div>

<div class="callout"><div class="h">Húr vs. szelő vs. Newton</div>
<div class="tablewrap"><table class="grid">
<tr><th>Módszer</th><th>Képlet</th><th>Rend</th><th>Bracketel?</th><th>Derivált?</th></tr>
<tr><td>{{newtonmod|Newton}}</td><td>$x_k-\frac{f(x_k)}{f'(x_k)}$</td><td>2</td><td>nem</td><td>kell</td></tr>
<tr><td>{{szelomod|Szelő}}</td><td>$x_k-\frac{f(x_k)(x_k-x_{k-1})}{f(x_k)-f(x_{k-1})}$</td><td>$\frac{1+\sqrt5}{2}\approx1{,}618$</td><td>nem (divergálhat)</td><td>nem</td></tr>
<tr><td>{{hurmod|Húr}}</td><td>mint a szelő, de a megtartott ellenkező előjelű ponttal</td><td>1</td><td><b>igen</b> (biztos)</td><td>nem</td></tr>
</table></div>
<p>{{konvrend|Rend}} sorrend: felezés/húr/fixpont (1) < szelő (1.618) < Newton (2).</p></div>

<p><b>Többváltozós eset.</b> $F:\mathbb R^n\to\mathbb R^n$ esetén a {{newtontobb|Newton}} a {{jacobim|Jacobi-mátrixot}} használja: az $F'(x^{(k)})s=-F(x^{(k)})$ {{ler|LER}}-t oldjuk meg (nem invertálunk). A {{broyden|Broyden-módszer}} elkerüli a lépésenkénti deriválást, cserébe lassabb.</p>
<div class="callout"><div class="h">További a kérdésbankhoz — Newton-tételek feltételei</div>
<p><b>Monoton konvergencia tétel:</b> ha $f\in C^2[a,b]$, van gyök, $f'$ ÉS $f''$ <b>állandó előjelű</b> $[a,b]$-n, és a kezdőpontra $f(x_0)\,f''(x_0)>0$, akkor a Newton-sorozat MONOTON konvergál. (Az $f(x_0)f''(x_0)>0$ választja ki, melyik végéről indulj: pl. szig. növő + konvex esetben a jobb végéről.) Ha $f'(a)f'(b)<0$ ($f'$ előjelet vált), a tétel NEM alkalmazható.</p>
<p><b>Lokális konvergencia tétel:</b> ha $f\in C^2$, $f'$ állandó előjelű, $m_1=\min|f'|>0$, $M_2=\max|f''|<\infty$, és $x_0$ elég közel ($|x_0-x^*|<r$), akkor MÁSODRENDŰ: $|x_{k+1}-x^*|\le M|x_k-x^*|^2$, $M=\frac{M_2}{2m_1}$, és $|x_k-x^*|<r$ minden $k$-ra. (Az $|f'|$ FELSŐ korlátja nem kell — az ALSÓ $m_1>0$ igen.) A bizonyítás $f$-et az elsőfokú $x_k$ körüli Taylor-polinommal közelíti.</p></div>
<div class="callout"><div class="h">Fixpont keresése, vonzó/taszító, és a rend</div>
<p><b>Fixpont</b> = ahol $f(x)=x$ (nem ahol $f=0$!). Brouwer: ha $\varphi:[a,b]\to[a,b]$ folytonos, van fixpont az intervallumban — pl. $f(x)=x^2-2x+1$ fixpontja ($x^2-3x+1=0$, $x\approx0.38$) a $[0,1]$-ben van. A fixpont <b>vonzó</b>, ha $|\varphi'(x^*)|<1$, <b>taszító</b>, ha $>1$; az iteráció a vonzóhoz tart. Pl. $\varphi=\sqrt x$ a $[0,1]$-en: $x^*=1$ vonzó ($\varphi'(1)=\tfrac12$) → oda tart; $\varphi=x^3/9$: $x^*=3$ taszító ($\varphi'(3)=3$) → $x_0=4$-ből divergál.</p>
<p><b>Rend deriváltakból:</b> ha $\varphi'(x^*)=\dots=\varphi^{(p-1)}(x^*)=0$, de $\varphi^{(p)}(x^*)\ne0$, a rend $p$. Pl. $\varphi=x-\sin x$, $x^*=0$: $\varphi'=1-\cos x$ ($=0$), $\varphi''=\sin x$ ($=0$), $\varphi'''=\cos x$ ($\ne0$) → <b>harmadrendű</b>. Lineáris esetben kisebb $q$ = gyorsabb: ha $q_1=q_2^{\,k}$ (pl. $\tfrac18=(\tfrac12)^3$), akkor $\varphi_1$ kb. $k$-szor gyorsabb (1.8=2², 1/8=2³ → 2×, 3×).</p></div>
<a class="golink" data-go="gyok">Gyökkeresés-kérdések</a>`},

/* ============ 6 ============ */
{id:"l6", no:6, title:"Polinomok: gyökkorlát és Horner-séma", est:"~45 perc",
 html:R`<p>A Horner-táblás kérdések nagyon gyakoriak, és könnyű pontot szerezni rajtuk, ha begyakorlod a sémát.</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$P(x)$ = polinom, $a_n,\dots,a_0$ = együtthatói, $\xi$ = a kiértékelés helye.</li>
<li>$a_k^{(1)}$ = a Horner-sor (1. szint) elemei; $P_1(x)$ = a $(x-\xi)$-vel való osztás hányadospolinomja.</li>
<li>$a_j^{(j+1)}=\frac{P^{(j)}(\xi)}{j!}$ = a $\xi$ körüli Taylor-EGYÜTTHATÓ ($P^{(j)}$ = $j$-edik derivált).</li>
<li>$R$ = a gyökök külső sugara, $r$ = belső sugara (origó körüli nyílt körgyűrű); reciprokpolinom = a fordított együtthatójú polinom.</li>
</ul></div>

<h3>Horner-algoritmus</h3>
<div class="callout"><div class="h">A séma</div>
<p>$P(x)=a_nx^n+\dots+a_0$ kiértékelése $\xi$-ben: $a_n^{(1)}=a_n$, majd $a_k^{(1)}=a_k+\xi\,a_{k+1}^{(1)}$. Az utolsó: $P(\xi)=a_0^{(1)}$. Műveletigény $O(n)$. Ez a $(x-\xi)$-vel való <b>szintetikus osztás</b>: $P(x)=P(\xi)+(x-\xi)P_1(x)$.</p>
<p>Ha a táblázatot tovább folytatod (újra Horner a hányadoson), az <b>átló</b> a Taylor-EGYÜTTHATÓkat adja: $a_j^{(j+1)}=\dfrac{P^{(j)}(\xi)}{j!}$. A derivált értékéhez $\times j!$.</p></div>

<div class="callout"><div class="h">Kidolgozott példa — Horner-tábla ($a:1,-9,23,-15$, $\xi=1$)</div>
<p>Minden sor: lehozzuk az elsőt, majd „$\times1$ és hozzáadjuk a következőhöz”.</p>
<div class="tablewrap"><table class="grid">
<tr><th>szint</th><th></th><th></th><th></th><th></th><th>jelentés</th></tr>
<tr><td>$a_i$</td><td>1</td><td>−9</td><td>23</td><td>−15</td><td>együtthatók</td></tr>
<tr><td>$a^{(1)}$</td><td>1</td><td>−8</td><td>15</td><td><b>0</b></td><td>$P(1)=0$</td></tr>
<tr><td>$a^{(2)}$</td><td>1</td><td>−7</td><td><b>8</b></td><td></td><td>$P'(1)=8$</td></tr>
<tr><td>$a^{(3)}$</td><td>1</td><td><b>−6</b></td><td></td><td></td><td>$\frac{P''(1)}{2!}=-6\Rightarrow P''(1)=-12$</td></tr>
</table></div>
<p>Levezetés: $a^{(1)}$: $1;\;-9+1=-8;\;23+(-8)=15;\;-15+15=0$. $a^{(2)}$: $1;\;-8+1=-7;\;15+(-7)=8$. $a^{(3)}$: $1;\;-7+1=-6$.</p>
<p>Innen bármi kiszámolható:</p>
<ul>
<li>$P(1)=0$, &nbsp; $P'(1)=8$, &nbsp; $P''(1)=2!\cdot(-6)=-12$.</li>
<li>$P(1)+P''(1)=0+(-12)=-12$.</li>
<li>$P'(1)+P''(1)=8+(-12)=-4$.</li>
</ul>
<p><b>Figyelem:</b> a $-6$ az átlón a Taylor-együttható; $P''(1)$ ennek $2!$-szerese!</p></div>

<h3>Gyökök korlátja</h3>
<div class="callout"><div class="h">Képletek</div>
<p>$P$ minden (valós és komplex) gyökére $r<|x_k|<R$, ahol
$$R=1+\frac{\max_{0\le i\le n-1}|a_i|}{|a_n|},\qquad r=\frac{1}{1+\dfrac{\max_{1\le i\le n}|a_i|}{|a_0|}}.$$
Origó körüli <b>nyílt körgyűrű</b>, csak az abszolút értékre. ($a_0\ne0$, $a_n\ne0$ kell.) Az $r$-et a {{recippoly|reciprokpolinomra}} alkalmazott felső korlát adja.</p></div>

<div class="callout"><div class="h">Kidolgozott példa — $P(x)=2x^3-3x^2+x+4$</div>
<p>$a_3=2,a_2=-3,a_1=1,a_0=4$. &nbsp; $R=1+\frac{\max(|4|,|1|,|{-}3|)}{|2|}=1+\frac{4}{2}=3$. &nbsp; $r=\frac{1}{1+\frac{\max(|{-}3|,|1|,|2|)}{|4|}}=\frac{1}{1+\frac34}=\frac47\approx0{,}57$. Tehát minden gyökre $0{,}57<|x_k|<3$.</p></div>
<div class="callout"><div class="h">További a kérdésbankhoz</div>
<p>A szintetikus osztásból $P(x)=P(\xi)+(x-\xi)Q(x)$, ahol $Q$ épp a Horner-hányados; ebből $x=\xi$-ben deriválva $P'(\xi)=Q(\xi)$. A TELJES táblázat (összes derivált) $\frac{n(n+1)}{2}$ összeadást igényel ($O(n^2)$), míg egyetlen $P(\xi)$ csak $n$-et ($O(n)$). A táblázat átlója a Taylor-együtthatókat adja, így $P', P''$ stb. is kiszámolható ($\cdot j!$).</p></div>
<a class="golink" data-go="horner">Horner-kérdések</a>`},

/* ============ 7 ============ */
{id:"l7", no:7, title:"Interpoláció, Csebisev, Runge", est:"~60 perc",
 html:R`<p>Egy függvényt polinommal helyettesítünk, ami pontosan átmegy az adatokon. A kérdések konkrét polinom felírására, osztott differenciákra és Csebisev-tulajdonságokra kérdeznek.</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$x_i$ = alappont, $y_i$ = (függvény)érték; $p_n\in P_n$ = legfeljebb $n$-edfokú polinom ($P_n$ = ezek halmaza).</li>
<li>$\ell_k$ = Lagrange-alappolinom, $\delta_{ki}$ = Kronecker-delta ($1$ ha $k=i$, különben $0$); $L_n$ = Lagrange-alak, $N_n$ = Newton-alak.</li>
<li>$f[x_i,\dots,x_{i+k}]$ = $k$-adrendű osztott differencia; $\omega_n(x)=\prod_{j}(x-x_j)$ = csomópont-polinom; $\xi_x$ = az $x$-től függő közbülső pont a hibaformulában.</li>
<li>$T_n$ = $n$-edik (elsőfajú) Csebisev-polinom, $\widetilde T_n$ = normált (1-főegyütthatós, „monikus”) változat; $w(x)$ = súlyfüggvény.</li>
</ul></div>

<h3>Alapfeladat</h3>
<p>{{interp|Interpoláció}}: $n+1$ KÜLÖNBÖZŐ alappontra pontosan egy, LEGFELJEBB $n$-edfokú polinom ($p(x_i)=y_i$). A {{lagrange|Lagrange}}- és {{newtonalak|Newton}}-alak ugyanazt a polinomot adja.</p>

<div class="callout"><div class="h">Kidolgozott példa — polinom 3 ponton át (1. vizsga 5.)</div>
<p>$x:0,1,2$, &nbsp; $y:1,1,0$. Keressük $p(x)=ax^2+bx+c$-t a feltételekből:</p>
<ul>
<li>$p(0)=c=1$.</li>
<li>$p(1)=a+b+c=1\Rightarrow a+b=0$.</li>
<li>$p(2)=4a+2b+c=0\Rightarrow 4a+2b=-1$.</li>
</ul>
<p>$b=-a$-t behelyettesítve: $4a-2a=-1\Rightarrow 2a=-1\Rightarrow a=-\tfrac12,\;b=\tfrac12$. Tehát $p(x)=-\tfrac12x^2+\tfrac12x+1$.</p></div>

<h3>Newton-alak és osztott differenciák</h3>
<div class="callout"><div class="h">Képlet + példa</div>
<p>$f[x_i]=f(x_i)$, &nbsp; $f[x_i,x_{i+1}]=\frac{f(x_{i+1})-f(x_i)}{x_{i+1}-x_i}$, &nbsp; magasabb rend: $f[x_i,\dots,x_{i+k}]=\frac{f[x_{i+1},\dots]-f[x_i,\dots]}{x_{i+k}-x_i}$. Sorrendfüggetlen (permutációinvariáns). Az alak: $N_n(x)=f[x_0]+f[x_0,x_1](x-x_0)+\dots$; új pont = +1 tag.</p>
<p><b>Példa (2. vizsga típusú):</b> ha $f[x_0,x_1]=3$, $f[x_1,x_2]=9$, és $x_0=-1,x_1=1,x_2=2$, akkor
$$f[x_0,x_1,x_2]=\frac{f[x_1,x_2]-f[x_0,x_1]}{x_2-x_0}=\frac{9-3}{2-(-1)}=\frac{6}{3}=2.$$</p></div>

<h3>Hibaformula</h3>
<p>$f(x)-p_n(x)=\frac{f^{(n+1)}(\xi_x)}{(n+1)!}\omega_n(x)$, ahol $\omega_n(x)=\prod(x-x_j)$, $f\in C^{n+1}$. A $\xi_x$ az $x$-től függ; az alappontokban a hiba $0$.</p>

<h3>Csebisev-polinomok</h3>
<div class="callout"><div class="h">Képletek — ezeket fejből</div>
<ul>
<li>$T_0=1,\;T_1=x,\;T_{n+1}=2x\,T_n-T_{n-1}$ &nbsp;(<b>mínusz</b>!).</li>
<li>$T_n(\cos\theta)=\cos(n\theta)$, &nbsp; főegyüttható $2^{n-1}$.</li>
<li>Gyökök: $x_k=\cos\frac{(2k-1)\pi}{2n}$ — <b>$n$ darab</b>, a $[-1,1]$ széleire sűrűsödve.</li>
<li>Szélsőértékek: $\xi_k=\cos\frac{k\pi}{n}$ — <b>$n+1$ darab</b>, felváltva $\pm1$.</li>
<li>Ortogonális a $w(x)=\frac{1}{\sqrt{1-x^2}}$ súlyra.</li>
<li>Minimax: a normált $\widetilde T_n$ maximumnormája $\frac{1}{2^{n-1}}$ a legkisebb a monikus $n$-edfokúak közt.</li>
</ul></div>

<div class="callout"><div class="h">Kidolgozott példa — $T_4$ gyökeinek nagysága</div>
<p>$T_4=8x^4-8x^2+1$. Gyökök $x_k=\cos\frac{(2k-1)\pi}{8}$, $k=1..4$: $\cos\frac\pi8\approx0{,}924$, $\cos\frac{3\pi}8\approx0{,}383$, és ezek $\pm$ párjai. Tehát $|x_k|\in\{0{,}383;\,0{,}924\}\subset[\tfrac12,2]$ (durva becslés: a Csebisev-gyökök mind $(0,1)$-ben, a 0-ra szimmetrikusan).</p></div>

<div class="warn"><div class="h">⚠ Runge-jelenség</div>{{runge|Egyenközű}} alapponton magas fokszámmal a hiba a SZÉLEKEN elszáll — még a $C^\infty$ Runge-függvényre ($\frac{1}{1+25x^2}$) is. „Több pont = jobb” HAMIS; az alappontok elhelyezése dönt → {{csebisev|Csebisev-pontok}} a jók.</div>
<p><b>Inverz interpoláció:</b> ha $f$ invertálható a gyök közelében, az {{invinterp|f⁻¹-et interpoláljuk}}, és a gyök $x_{k+1}=Q_n(0)$ — egyetlen behelyettesítés.</p>
<div class="callout"><div class="h">További a kérdésbankhoz — Lagrange-alappolinom és pontos esetek</div>
<p>A $k$-adik alappolinom explicit alakja: $\displaystyle\ell_k(x)=\prod_{j\ne k}\frac{x-x_j}{x_k-x_j}$ (a szorzatban minden alappont KIVÉVE $x_k$; a nevező a behelyettesített számláló). Pl. $x_0=0,x_1=1,x_2=2$: $\ell_2(x)=\frac{(x-0)(x-1)}{(2-0)(2-1)}=\frac{x(x-1)}{2}$, és mivel $\ell_0+\ell_1+\ell_2=1$, ezért $\ell_0+\ell_1=1-\frac{x(x-1)}{2}$.</p>
<p><b>Pontos eset:</b> ha $f$ maga LEGFELJEBB $n$-edfokú polinom, akkor $n+1$ alapponton az interpoláció HIBÁJA 0 ($f^{(n+1)}\equiv0$), és $L_n=f$. Pl. $f=x^4+3x^2+1$-et $N=5$ ponttal pontosan visszakapjuk; az $x^n$-et $n+1$ ponton hiba nélkül. „Hány $\le m$-edfokú polinom megy át $r$ ponton?": ha $r>m+1$ és nem illeszthető (pl. 3 nem kollineáris pont egyenesre) → egy sem; ha pont illeszthető → egy. ($n+1$ pont → a $k$-adrendű osztott differenciák száma $n+1-k$.)</p></div>
<a class="golink" data-go="interp">Interpoláció-kérdések</a> <a class="golink" data-go="cseb">Csebisev-kérdések</a>`},

/* ============ 8 ============ */
{id:"l8", no:8, title:"Legkisebb négyzetek (approximáció)", est:"~40 perc",
 html:R`<p>Zajos adatra nem akarunk pontosan illeszkedni — a hibanégyzetek összegét minimalizáljuk.</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$N$ = adatpontok száma, $n$ = a közelítő polinom foka ($N>n+1$); $A$ = Vandermonde-mátrix, $a$ = együtthatóvektor, $y$ = értékvektor.</li>
<li>$A^\top A\,a=A^\top y$ = (Gauss-féle) normálegyenlet; $A^+$ = általánosított (pszeudo)inverz; $A^\top$ = transzponált.</li>
<li>$(\bar x,\bar y)$ = az adatok átlagpontja; $\langle x,y\rangle=x^\top y$ = skaláris szorzat. <i>(A $\|\cdot\|_2$, cond az 1./4. leckéből.)</i></li>
</ul></div>

<div class="callout"><div class="h">Képletek</div>
<p>Túlhatározott $Aa=y$ ($N>n+1$, $A$ Vandermonde). Megoldás a {{normalegy|Gauss-féle normálegyenletből}}:
$$A^\top A\,a=A^\top y,\qquad a^+=(A^\top A)^{-1}A^\top y.$$
Geometriailag $Aa^+$ az $y$ merőleges vetülete az oszloptérre ({{pszeudoinv}}); a maradék merőleges: $A^\top(y-Aa^+)=0$.</p>
<p><b>Pszeudoinverz:</b> túlhatározott (teljes oszloprang): $A^+=(A^\top A)^{-1}A^\top$ (bal inverz). Alulhatározott (teljes sorrang): $A^+=A^\top(AA^\top)^{-1}$ (jobb inverz).</p></div>

<div class="callout"><div class="h">Egyenesillesztés ($n=1$) — a normálegyenlet kiírva</div>
<p>$$\begin{pmatrix}N&\sum x_i\\ \sum x_i&\sum x_i^2\end{pmatrix}\begin{pmatrix}a_0\\a_1\end{pmatrix}=\begin{pmatrix}\sum y_i\\ \sum x_i y_i\end{pmatrix}.$$
Az illesztett egyenes <b>mindig átmegy</b> az $(\bar x,\bar y)$ átlagponton (az 1. sorból $N$-nel osztva: $a_0+a_1\bar x=\bar y$).</p>
<p><b>Centrált eset ($\sum x_i=0$):</b> a rendszer diagonális → $a_0=\frac1N\sum y_i$, &nbsp; $a_1=\frac{\sum x_i y_i}{\sum x_i^2}=\frac{\langle x,y\rangle}{\|x\|^2}$.</p></div>

<div class="callout"><div class="h">Kidolgozott példa — mikor konstans? (1. vizsga 15.)</div>
<p>$\sum x_i=0$ esetén a meredekség $a_1=\frac{\langle x,y\rangle}{\|x\|^2}$. A megoldás akkor konstans, ha $a_1=0$, azaz $\langle x,y\rangle=0$ → <b>$x\perp y$</b> (merőlegesek). (A $\sum y_i=0$ csak a konstans tagot érinti, a párhuzamosság $a_1\ne0$.)</p></div>

<div class="note"><b>Finomságok:</b> $A^\top A$ <b>mindig</b> szimmetrikus, de csak teljes oszloprangnál invertálható/pozitív definit. A maradék általában nem 0 ($N=n+1$ esetén igen, akkor = interpoláció). $\mathrm{cond}(A^\top A)=\mathrm{cond}(A)^2$ → numerikusan a {{qr|QR}}/SVD jobb.</div>
<div class="note"><b>További a kérdésbankhoz:</b> az illesztés a <b>függőleges</b> (az $y$-tengellyel párhuzamos), NEM a merőleges eltérések négyzetösszegét minimalizálja. Másodfokú (vagy magasabb) polinomillesztésnél is: páronként KÜLÖNBÖZŐ alappontok esetén a normálegyenlet megoldása egyértelműen létezik (a Vandermonde teljes oszloprangú).</div>
<a class="golink" data-go="lnm">Legkisebb négyzetek kérdések</a>`},

/* ============ 9 ============ */
{id:"l9", no:9, title:"Numerikus integrálás (kvadratúra)", est:"~60 perc",
 html:R`<p>$\int_a^b f$ közelítése: $f$-et polinomra cseréljük, azt integráljuk. A kérdések a pontossági fokra, a konkrét formulákra és a hibára kérdeznek.</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$\int_a^b f$ = a közelítendő integrál; $A_k$ = kvadratúra-súly, $\ell_k$ = Lagrange-alappolinom, $\omega_n$ = csomópont-polinom.</li>
<li>$E(f)$ = érintő- (középponti) formula, $T(f)$ = trapéz, $S(f)$ = Simpson; $T_m,S_m$ = összetett formulák, $m$ = a felosztások száma, $h=\frac{b-a}{m}$ = lépésköz.</li>
<li>$M_2=\max|f''|$, $M_4=\max|f^{(4)}|$ = derivált-korlátok; $Z(n)/Ny(n)$ = zárt/nyílt Newton–Cotes; $B_k$ = dimenziótlan súlyok ($A_k=(b-a)B_k$).</li>
</ul></div>

<div class="callout"><div class="h">A három alapformula + pontossági fok</div>
<div class="tablewrap"><table class="grid">
<tr><th>Formula</th><th>Képlet</th><th>Pontos eddig</th><th>Hiba</th></tr>
<tr><td>{{erinto|Érintő}} (közép)</td><td>$(b-a)f\!\left(\frac{a+b}2\right)$</td><td><b>1. fok</b></td><td>$+\frac{(b-a)^3}{24}f''$</td></tr>
<tr><td>{{trapez|Trapéz}}</td><td>$\frac{b-a}{2}\big(f(a)+f(b)\big)$</td><td>1. fok</td><td>$-\frac{(b-a)^3}{12}f''$</td></tr>
<tr><td>{{simpson|Simpson}}</td><td>$\frac{b-a}{6}\big(f(a)+4f(\frac{a+b}2)+f(b)\big)$</td><td><b>3. fok!</b></td><td>$-\frac{(b-a)^5}{2880}f^{(4)}$</td></tr>
</table></div>
<p><b>Páros $n$ szuperkonvergencia:</b> a Simpson parabolával közelít, mégis KÖBÖSRE is pontos. Az érintőhiba fele a trapézének, ellenkező előjellel → $S=\frac{2E+T}{3}$. A súlyok $f$-től függetlenek; $\sum A_k=b-a$.</p></div>

<div class="callout"><div class="h">Kidolgozott példa — $\int_2^8 (x^2+2)\,dx$ (2. vizsga 5.)</div>
<p>A pontos érték: $\left[\frac{x^3}{3}+2x\right]_2^8=\frac{512}{3}+16-\frac83-4=\frac{504}{3}+12=168+12=180$.</p>
<ul>
<li><b>Simpson</b> (fok 3, másodfokúra pontos): $\frac{8-2}{6}\big(f(2)+4f(5)+f(8)\big)=1\cdot(6+4\cdot27+66)=6+108+66=180$ ✔ pontos.</li>
<li><b>Trapéz</b> (fok 1): $\frac{6}{2}(6+66)=3\cdot72=216$ — nem pontos.</li>
<li><b>Érintő</b> (fok 1): $6\cdot f(5)=6\cdot27=162$ — nem pontos.</li>
</ul>
<p>Csak a Simpson adja biztosan a pontos értéket.</p></div>

<div class="callout"><div class="h">Összetett formulák és hiba</div>
<p>Felosztás $m$ részre (nem a fokot növeljük). {{trapez|Trapéz}} összetett: súlyok $1,2,\dots,2,1$, hiba $-\frac{(b-a)^3}{12m^2}f''$ → $O(h^2)$. {{simpson|Simpson}} összetett ($m$ páros): súlyok $1,4,2,\dots,4,1$, hiba $-\frac{(b-a)^5}{180m^4}f^{(4)}$ → $O(h^4)$. $m$ duplázása: trapézhiba $/4$, Simpsoné $/16$. <b>Az egyetlen valódi felső korlát</b> az $f\in C^4$ kérdésben: $|\int f-T_m|\le\frac{(b-a)^3}{24m^2}M_2$ (pozitív, $M_2$, $1/m^2$).</p></div>

<div class="callout"><div class="h">Kvadratúra-együtthatók és Richardson</div>
<p>Interpolációs együttható: $A_k=\int_a^b L_k(x)\,dx=c\int_a^b\frac{\omega_n(x)}{x-x_k}dx$ (a $\frac{1}{\omega_n'(x_k)}$ a $c$ konstans). {{richardson|Richardson}}: $\frac13(4T_{2m}-T_m)=S_m$ ($O(h^2)\to O(h^4)$), $\frac1{15}(16S_{2m}-S_m)$ ($\to O(h^6)$) — csak sima $f$-re; szingularitásnál Gauss-kvadratúra. {{newtoncotes|Newton–Cotes}}: ekvidisztáns (zárt = végpontok is; nyílt = nem). Gauss: $n+1$ ponttal $2n+1$ fok.</p></div>
<div class="callout"><div class="h">További a kérdésbankhoz — momentum-feltételek</div>
<p>Egy interpolációs kvadratúra ($A_k=\int_a^b\ell_k$) pontos az $1,x,x^2,\dots$ hatványokra, innen a feltételek (ezekkel kiszámolható egy hiányzó súly):
$$\sum_k A_k=\int_a^b 1=b-a,\qquad \sum_k A_k x_k=\int_a^b x=\frac{b^2-a^2}{2},\qquad \sum_k A_k x_k^2=\frac{b^3-a^3}{3}.$$
FIGYELEM: $\sum A_k=b-a$ (NEM mindig 1 — pl. $[-1,1]$-en 2). A dimenziótlan $B_k$-k ($A_k=(b-a)B_k$) összege 1.</p>
<p><b>Pontos eset:</b> ha az integrandus foka $\le$ a formula pontossági foka, a HIBA 0. Páros $n$-es Newton–Cotes pontos $n+1$ fokig: pl. $x^{11}$-et az $n=10$-es nyílt NC, $x^3-x+1$-et a Simpson pontosan integrálja (hiba 0). Hasznos korlát ($f\in C^2$): $|T(f)-E(f)|\le\frac{(b-a)^3}{8}M_2$ (mert a trapéz- és érintőhiba különbsége $\frac1{12}+\frac1{24}=\frac18$).</p></div>
<a class="golink" data-go="integ">Integrálás-kérdések</a>`},

/* ============ 10 ============ */
{id:"l10", no:10, title:"Ortogonális felbontások: QR, Householder, Cholesky", est:"~35 perc",
 html:R`<p>A gyakorlóbank több kérdése ezekre épül (a két eredeti vizsgában nem szerepelnek, de a kurzus anyaga).</p>
<div class="callout"><div class="h">Jelölések</div><ul>
<li>$Q$ = ortogonális mátrix ($Q^\top Q=I$), $R$ = felső háromszögmátrix; $A=QR$ = QR-felbontás.</li>
<li>$H(v)=I-\frac{2vv^\top}{v^\top v}$ = Householder-mátrix (tükrözés); $vv^\top$ = diadikus (külső) szorzat, $v^\top v=\|v\|_2^2$.</li>
<li>$A=LL^\top$ = Cholesky-felbontás (SPD mátrixra); $\langle\cdot,\cdot\rangle$ = skaláris szorzat. <i>(SPD, $\mathrm{cond}_2$, $\|\cdot\|_2$ a 3./4. leckéből.)</i></li>
</ul></div>

<div class="callout"><div class="h">QR-felbontás</div>
<p>{{qr|$A=QR$}}, $Q$ ortogonális (oszlopai ortonormáltak, $Q^\top Q=I$), $R$ felső háromszög. Mivel ortogonális mátrixra $\mathrm{cond}_2=1$, ezért $\mathrm{cond}_2(A)=\mathrm{cond}_2(R)$ — a QR <b>stabil</b>. A {{normalegy|legkisebb négyzeteknél}} jobb, mint a normálegyenlet (nem négyzeteli a kondíciót). Ortogonális mátrix megőrzi a 2-normát: $\|Qx\|_2=\|x\|_2$.</p></div>

<div class="callout"><div class="h">Két előállítás</div>
<p>{{gramschmidt|Gram–Schmidt}}: az oszlopokat ortonormálja (klasszikus = kevésbé stabil, módosított/MGS = jobb). {{householder|Householder-tükrözés}}: $H=I-\frac{2vv^\top}{v^\top v}$ — egyszerre szimmetrikus ÉS ortogonális ($H=H^\top=H^{-1}$), $\det H=-1$, $\|Hx\|_2=\|x\|_2$; oszloponként egy tükrözéssel nulláz az átló alatt → numerikusan stabilabb QR.</p></div>

<div class="callout"><div class="h">Cholesky-felbontás</div>
<p>{{cholesky|$A=LL^\top$}} szimmetrikus pozitív definit ({{spd|SPD}}) mátrixra ($L$ alsó háromszög, pozitív átló). Kb. feleannyi művelet, mint az {{lu|LU}} ($\sim\frac{n^3}{3}$), pivotálás nélkül stabil, megőrzi $\mathrm{cond}_2$-t.</p></div>

<div class="warn"><div class="h">⚠ Csapda</div>A felbontások közül az LU <b>ronthatja</b> a kondíciót (ezért kell pivotálás), a QR és a Cholesky <b>megőrzi</b> a $\mathrm{cond}_2$-t. Az ortogonális mátrix tökéletesen kondicionált ($\mathrm{cond}_2=1$).</div>
<div class="callout"><div class="h">További a kérdésbankhoz — Cholesky, Householder, ortogonalitás</div>
<p><b>Cholesky elemenként:</b> $i>j$ esetén $a_{ij}=\sum_{k=1}^{j}\ell_{ik}\ell_{jk}$ (ebből rendre kiszámolható $L$). Az $L^\top$ az LU-felbontásból is megkapható: az $U$ sorait elosztjuk a sorbeli átlóelem négyzetgyökével. Ha $A$ SPD ($z^\top Az>0$ és $A=A^\top$), a Cholesky EGYÉRTELMŰEN létezik.</p>
<p><b>Householder-tükrözés iránya:</b> $H(v)=I-\frac{2vv^\top}{v^\top v}$ a $v$-re MERŐLEGES hipersíkra tükröz: a $v$-vel párhuzamos komponenst megfordítja, a merőlegeset békén hagyja. Ezért $H(v)v=-v$ (NEM $v$!), és ha $x=a+b$ ($a\perp v$, $b\parallel v$), akkor $H(v)x=a-b$. Ha $\|a\|_2=\|b\|_2$, a $v=a-b$ választással $H(v)a=b$ (ezzel nulláznak az oszlopok a QR-ben). Gram–Schmidtnél a kapott $q$-k ortogonálisak: $\langle a_1,q_2\rangle=0$.</p>
<p><b>Ortogonalitás ellenőrzése:</b> $Q$ ortogonális $\iff Q^\top Q=I$ (oszlopai ortonormáltak). Pl. $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ ortogonális (forgatás), de $\begin{pmatrix}1&0\\0&2\end{pmatrix}$ nem.</p></div>
<a class="golink" data-go="direkt">Direkt módszerek kérdései</a>`}

];
