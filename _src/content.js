/* ===== Numerikus módszerek — tartalom (fogalmak, leckék, kérdések) ===== */
var R = String.raw;

/* ---------------- Fogalom-rétegek ---------------- */
var LAYERS = [
  {n:1, t:"Hiba és gépi számábrázolás", d:"A legalapvetőbb fogalmak: mit jelent a hiba, és hogyan élnek a számok a gépben."},
  {n:2, t:"Hibajelenségek és stabilitás", d:"Hogyan terjednek és robbannak fel a hibák, és mitől „stabil” egy algoritmus."},
  {n:3, t:"Lineáris egyenletrendszerek — direkt módszerek", d:"Gauss-elimináció, LU-felbontás, sávmátrixok és a megmaradási tételek."},
  {n:4, t:"Normák és érzékenység", d:"Vektor- és mátrixnormák, kondíciószám, a LER érzékenysége és a maradék."},
  {n:5, t:"Közelítés: interpoláció és legkisebb négyzetek", d:"Pontos illesztés vs. legjobb közelítés, hibaformulák, Csebisev."},
  {n:6, t:"Nemlineáris egyenletek és polinomok", d:"Gyökkeresés iterációkkal, konvergencia, Horner-séma."},
  {n:7, t:"Numerikus integrálás", d:"Kvadratúra-formulák, pontossági fok, összetett formulák, Richardson."}
];

/* ---------------- Fogalmak ---------------- */
var C = {
/* — réteg 1 — */
abshiba:{t:"Abszolút / relatív hiba", layer:1, pre:[], short:"A közelítés eltérése a pontos értéktől.",
  body:R`Ha $A$ a pontos, $a$ a közelítő érték, a (pontos) hiba $\Delta a = A-a$ (előjeles!), az abszolút hiba $|\Delta a|$, a relatív hiba $\delta a=\frac{\Delta a}{A}\approx\frac{\Delta a}{a}$. A relatív hiba a nagyságrendhez viszonyít: nagy szám nagy abszolút hibája is lehet kis relatív hibájú.`},
hibakorlat:{t:"Hibakorlát", layer:1, pre:["abshiba"], short:"Ismert felső becslés a hibára.",
  body:R`A hiba $\Delta a$ általában ismeretlen és előjeles; a hibakorlát $\Delta_a$ egy ismert, garantált felső becslés: $\Delta_a\ge|\Delta a|$. Csapda: $\Delta a$ (a hiba) $\ne \Delta_a$ (a korlát).`},
gepiszam:{t:"Lebegőpontos gépi szám", layer:1, pre:[], short:"±m·2ᵏ alakú, véges mantisszával.",
  body:R`Normalizált alak: $a=\pm m\cdot 2^{k}$, ahol $m=\sum_{i=1}^{t} m_i 2^{-i}$, $m_1=1$, és $k^-\le k\le k^+$. A gépi számok halmaza $M(t,k^-,k^+)$, a 0-t külön hozzávéve. A {{normalizalas}} adja az egyértelműséget.`},
normalizalas:{t:"Normalizálás (m₁=1)", layer:1, pre:["gepiszam"], short:"A vezető bit mindig 1 — egyértelműség.",
  body:R`A $m_1=1$ kikötés miatt minden gépi számnak egyetlen alakja van, és $\tfrac12\le m<1$. Ezért kell a 0-t külön hozzávenni (magából a képletből nem jön ki).`},
eps0:{t:"ε₀ — legkisebb pozitív gépi szám", layer:1, pre:["gepiszam"], short:"Alulcsordulási küszöb; k⁻-tól függ.",
  body:R`$\varepsilon_0=2^{k^- -1}$. Ami ennél kisebb abszolút értékű, az 0-ra kerekül (alulcsordulás). Ne keverd az {{eps1}}-gyel!`},
eps1:{t:"ε₁ — gépi epszilon", layer:1, pre:["gepiszam"], short:"Relatív felbontás 1 körül; t-től függ.",
  body:R`$\varepsilon_1=2^{1-t}$ = az 1 utáni gépi szám és az 1 különbsége. A mantisszahossztól ($t$) függ, a kitevőtől nem. A relatív input hiba korlátja $\tfrac12\varepsilon_1=2^{-t}$.`},
flfun:{t:"fl — input (kerekítési) függvény", layer:1, pre:["eps0","eps1"], short:"Valós szám → legközelebbi gépi szám.",
  body:R`$\mathrm{fl}(x)$ a legközelebbi gépi szám. A relatív input hiba $\frac{|x-\mathrm{fl}(x)|}{|x|}\le 2^{-t}$ — csak $t$-től függ, a nagyságrendtől nem. Az abszolút hiba ∝ $|x|$, mert a gépi számok logaritmikusan sűrűsödnek.`},

/* — réteg 2 — */
kiejtes:{t:"Jegyvesztés (kiejtés, cancellation)", layer:2, pre:["abshiba"], short:"Közel egyenlő számok kivonása.",
  body:R`Két közel egyenlő szám kivonásakor a vezető jegyek kiesnek, az eredmény relatív hibája felrobban. Nem új hibát szül, csak láthatóvá teszi a bemenetekben lévőt. Kezelés: algebrai átírás, pl. $\sqrt{a}-\sqrt{b}=\frac{a-b}{\sqrt a+\sqrt b}$.`},
elnyelodes:{t:"Elnyelődés / összegzési sorrend", layer:2, pre:["gepiszam"], short:"Kis tag nagy összeghez adva elveszhet.",
  body:R`Nagy futó összeghez kis tagot adva a kis tag (részben) elveszhet. Ezért az összeadás kommutatív, de NEM asszociatív gépen: $(a+b)-b\ne a+(b-b)$. Sok kis tagot növekvő sorrendben érdemes összegezni.`},
kondfv:{t:"Függvény kondíciószáma c(f,a)", layer:2, pre:["abshiba","kiejtes"], short:"Mennyire nagyítja f a relatív hibát.",
  body:R`$c(f,a)=\frac{|a|\,|f'(a)|}{|f(a)|}$, és $\delta_{f(a)}\approx c(f,a)\cdot\delta_a$. Rosszul kondicionált, ahol $|f(a)|$ kicsi (gyök közelében) vagy $|f'(a)|$ nagy. Ez NEM a mátrix {{conda}}.`},
stabilitas:{t:"Algoritmus stabilitása", layer:2, pre:[], short:"A kimenet Lipschitz-folytonosan függ a bemenettől.",
  body:R`Stabil, ha $\exists C>0:\ \|K_1-K_2\|\le C\|B_1-B_2\|$. Az instabilitás tipikus oka: lépésenként $|\text{szorzó}|>1$ hibaerősítés. A stabilitás az algoritmus tulajdonsága, nem a feladaté (azt a {{conda}} méri).`},

/* — réteg 3 — */
ler:{t:"Lineáris egyenletrendszer (LER)", layer:3, pre:[], short:"Ax=b, A négyzetes.",
  body:R`Egyértelműen megoldható $\iff \det(A)\ne0 \iff \mathrm{rang}(A)=n \iff$ az oszlopok lin. függetlenek $\iff A$ invertálható. $\det(A)=0$ csak az egyértelműséget zárja ki (lehet 0 vagy ∞ sok megoldás).`},
gauss:{t:"Gauss-elimináció", layer:3, pre:["ler"], short:"Felső háromszög alak + visszahelyettesítés.",
  body:R`A szorzó $m_{ik}=\frac{a_{ik}^{(k-1)}}{a_{kk}^{(k-1)}}$, kell hogy a {{pivot}} nemnulla legyen. Műveletigény $\tfrac23 n^3$ (köbös), a visszahelyettesítés $n^2$ (négyzetes). Direkt módszer: véges lépés, de a kerekítésre nem önkorrigál.`},
pivot:{t:"Pivot (főelem)", layer:3, pre:["gauss"], short:"Az átlóra kerülő elem, amivel osztunk.",
  body:R`Nulla pivot → a GE elakad, {{foelem}} kell. Kicsi pivot → nagy szorzó → instabilitás. A $\det(A)$ a pivotok szorzata (cserék nélkül).`},
foelem:{t:"Főelemkiválasztás (pivotálás)", layer:3, pre:["pivot"], short:"Legnagyobb |elem| a pivot helyére.",
  body:R`Részleges: legnagyobb az oszlopban, csak sorcsere. Teljes: legnagyobb a részmátrixban, sor- ÉS oszlopcsere. Sorcsere nem változtatja a megoldást; oszlopcsere átrendezi. Minden csere $(-1)$-szerezi a $\det$-et.`},
haromszog:{t:"Háromszögmátrix", layer:3, pre:[], short:"Alsó: nulla az átló fölött; felső: alatta.",
  body:R`Szorzásra és (invertálható esetben) inverzre zártak. Egységháromszög (csupa 1 az átlón) MINDIG invertálható; általános csak ha az átlóban nincs 0.`},
lu:{t:"LU-felbontás", layer:3, pre:["gauss","haromszog"], short:"A=LU, L egységalsó, U felső.",
  body:R`Doolittle: $L\in\mathcal L_1$ (1-esek az átlóban), $U$ hordozza a pivotokat. Létezik (sorcsere nélkül) $\iff$ a vezető főminorok $D_1,\dots,D_{n-1}\ne0$ — $\det(A)\ne0$ önmagában NEM elég. Egyértelmű, ha $\det(A)\ne0$. Haszna: sok jobb oldalnál a köbös munkát egyszer fizeted.`},
det_lu:{t:"Determináns LU-ból", layer:3, pre:["lu"], short:"det(A)=∏uᵢᵢ (a pivotok szorzata).",
  body:R`$\det(A)=\det(L)\det(U)=\prod u_{kk}$, mert $\det(L)=1$. A $k$-adik vezető főminor $D_k$ = az első $k$ pivot szorzata, így $u_{kk}=D_k/D_{k-1}$.`},
schur:{t:"Schur-komplementer", layer:3, pre:["gauss"], short:"Amin a GE-t folytatni kell egy lépés után.",
  body:R`$[A\,|\,A_{11}]=A_{22}-A_{21}A_{11}^{-1}A_{12}$. Egy (blokk)GE-lépés maradék mátrixa. A {{megmaradas}} tételei erre épülnek.`},
megmaradas:{t:"Megmaradási tételek", layer:3, pre:["schur","spd","diagdom"], short:"Mely tulajdonságok öröklődnek a GE során.",
  body:R`A GE megőrzi: regularitás, szimmetria, pozitív definitség, szig. diag. dominancia, (nem növő) sávszélesség, profil. Következmény: {{spd}} vagy {{diagdom}} mátrixnál NEM kell pivotálni (a pivotok sosem nullák).`},
spd:{t:"Szimmetrikus pozitív definit (SPD)", layer:3, pre:[], short:"A=Aᵀ és xᵀAx>0.",
  body:R`Ekvivalens: minden sajátérték > 0; minden vezető főminor > 0 (Sylvester). $\det(A)>0$ önmagában NEM elég! SPD mátrixnál pivotálás nélkül megy a GE (és van Cholesky $A=LL^\top$).`},
diagdom:{t:"Szigorúan diagonálisan domináns", layer:3, pre:[], short:"|aᵢᵢ| > a sor többi elemének összege.",
  body:R`$|a_{ii}|>\sum_{j\ne i}|a_{ij}|$ minden sorra (vagy oszlopra). Garantálja, hogy a GE/{{progonka}} pivotálás nélkül, stabilan fut.`},
savszel:{t:"Sávszélesség", layer:3, pre:[], short:"A sávon kívül minden elem 0.",
  body:R`Fél-sávszélesség $s$: $|i-j|>s\Rightarrow a_{ij}=0$. A GE megőrzi (nem növeli) a sávot — nincs „kitöltődés”. Ez teszi a {{progonka}}-t lineárissá.`},
progonka:{t:"Progonka (Thomas-módszer)", layer:3, pre:["gauss","savszel"], short:"Tridiagonális LER O(n) megoldása.",
  body:R`Tridiagonális rendszerre szabott GE. Tárolás $3n-2$, műveletigény $8n+O(1)=O(n)$ — szemben az $O(n^3)$-nal. Direkt (egzakt) módszer; a nevezők ≠ 0 a pivot-feltétel.`},

/* — réteg 4 — */
vnorma:{t:"Vektornorma", layer:4, pre:[], short:"A „hossz” általánosítása.",
  body:R`Axiómák: nemnegativitás, definitség ($\|x\|=0\iff x=0$), homogenitás, háromszög-egyenlőtlenség. A három nevezetes: $\|x\|_1=\sum|x_i|$, $\|x\|_2=\sqrt{\sum x_i^2}$, $\|x\|_\infty=\max|x_i|$. Sorrend: $\|x\|_\infty\le\|x\|_2\le\|x\|_1$.`},
pnorma:{t:"p-norma", layer:4, pre:["vnorma"], short:"(Σ|xᵢ|ᵖ)^(1/p), csak p≥1-re norma.",
  body:R`$\|x\|_p=(\sum|x_i|^p)^{1/p}$. Csak $p\ge1$ esetén norma (a háromszög-egyenlőtlenség $0\le p<1$-re elromlik). $\lim_{p\to\infty}\|x\|_p=\|x\|_\infty$, és nagyobb $p$ → kisebb norma. Véges dimenzióban minden norma ekvivalens.`},
mxnorma:{t:"Mátrixnorma", layer:4, pre:["vnorma"], short:"Vektornorma 4 axiómája + szubmultiplikativitás.",
  body:R`A megkülönböztető 5. axióma: $\|AB\|\le\|A\|\|B\|$. A {{frob}} valódi mátrixnorma, de nem indukált.`},
indnorma:{t:"Indukált (természetes) norma", layer:4, pre:["mxnorma"], short:"sup ‖Ax‖/‖x‖ — maximális nyújtás.",
  body:R`$\|A\|=\sup_{x\ne0}\frac{\|Ax\|}{\|x\|}$. $\|A\|_1$ = max OSZLOPösszeg, $\|A\|_\infty$ = max SORösszeg (figyelj a keresztre!), $\|A\|_2=\sqrt{\max\lambda(A^\top A)}$ (spektrálnorma). Minden indukált normára $\|I\|=1$.`},
frob:{t:"Frobenius-norma", layer:4, pre:["mxnorma"], short:"Elemenkénti euklideszi hossz.",
  body:R`$\|A\|_F=\sqrt{\sum_{i,j}|a_{ij}|^2}$. Valódi mátrixnorma, de NEM indukált: $\|I\|_F=\sqrt n\ne1$. Ortogonálisan invariáns, illeszkedik a 2-es vektornormához, és $\|A\|_2\le\|A\|_F$.`},
spektralnorma:{t:"Spektrálnorma ‖A‖₂", layer:4, pre:["indnorma"], short:"√(max sajátérték(AᵀA)).",
  body:R`$\|A\|_2=\sqrt{\max_i\lambda_i(A^\top A)}$ = a legnagyobb szinguláris érték. Szimmetrikus/normális mátrixra $\|A\|_2=\varrho(A)$ ({{spektralsugar}}).`},
spektralsugar:{t:"Spektrálsugár ϱ(A)", layer:4, pre:[], short:"A sajátértékek abszolút értékének maximuma.",
  body:R`$\varrho(A)=\max_i|\lambda_i(A)|$. Minden normára $\varrho(A)\le\|A\|$ (alsó korlát). De $\varrho$ maga NEM norma (nilpotensre $\varrho=0\ne$ nullmátrix).`},
conda:{t:"Mátrix kondíciószáma cond(A)", layer:4, pre:["indnorma","spektralnorma"], short:"‖A‖·‖A⁻¹‖ — a feladat érzékenysége.",
  body:R`$\mathrm{cond}(A)=\|A\|\|A^{-1}\|\ge1$ (indukált normában), skálázásfüggetlen. Szimmetrikusra $\mathrm{cond}_2=\frac{\max|\lambda|}{\min|\lambda|}$. A FELADAT érzékenységét méri, nem az algoritmusét. Ortogonálisra $\mathrm{cond}_2=1$.`},
erzekenyseg:{t:"LER érzékenysége", layer:4, pre:["conda"], short:"előrehiba ≲ cond(A) · bemeneti hiba.",
  body:R`Jobb oldal: $\frac{1}{\mathrm{cond}(A)}\delta b\le\delta x\le\mathrm{cond}(A)\,\delta b$. Mátrix-perturbációhoz indukált norma + $\|\Delta A\|\|A^{-1}\|<1$ kell (Neumann-lemma). LU ronthatja a kondíciót, QR/Cholesky megőrzi $\mathrm{cond}_2$-t.`},
reziduum:{t:"Reziduum (maradék)", layer:4, pre:["conda"], short:"r=b−Ax̃; a visszafelé-hibát méri.",
  body:R`Relatív maradék $\eta=\frac{\|r\|}{\|A\|\|\tilde x\|}\le\frac{\|\Delta A\|}{\|A\|}$ (2-normában egyenlőség). A visszafelé-hibát méri, NEM az előrehibát: kicsi maradék mellett is lehet pontatlan a megoldás, ha {{conda}} nagy.`},

/* — réteg 5 — */
interp:{t:"Interpoláció", layer:5, pre:[], short:"A polinom pontosan átmegy minden adatponton.",
  body:R`$n+1$ KÜLÖNBÖZŐ alappontra pontosan egy, LEGFELJEBB $n$-edfokú polinom illeszkedik ($p(x_i)=y_i$). A {{lagrange}} és {{newtonalak}} ugyanazt a polinomot adja, más bázisban. A Vandermonde-mátrix rosszul kondicionált → nem a hatványbázist használjuk.`},
lagrange:{t:"Lagrange-alak", layer:5, pre:["interp"], short:"Σ yₖℓₖ(x), ℓₖ a kapcsolók.",
  body:R`$\ell_k(x_i)=\delta_{ki}$, minden $\ell_k$ $n$-edfokú, $\sum_k\ell_k\equiv1$. Hátrány: új alappontnál mindent újra kell számolni (ellentétben a {{newtonalak}}-kal).`},
newtonalak:{t:"Newton-alak", layer:5, pre:["interp","osztottdiff"], short:"Osztott differenciák, inkrementális.",
  body:R`Együtthatói az {{osztottdiff}}-ek; új alappontnál CSAK egy új tagot adunk hozzá. A legmagasabb rendű osztott differencia = a főegyüttható.`},
osztottdiff:{t:"Osztott differencia", layer:5, pre:[], short:"f[x₀,…,xₖ] — sorrendfüggetlen.",
  body:R`Rekurzív különbségi hányados; permutációinvariáns. Kapcsolat: $f[x_0,\dots,x_k]=\frac{f^{(k)}(\xi)}{k!}$.`},
hibaformula:{t:"Interpolációs hibaformula", layer:5, pre:["interp"], short:"f−pₙ = f^(n+1)(ξ)/(n+1)! · ωₙ(x).",
  body:R`Feltétel $f\in C^{n+1}$. A $\xi_x$ az $x$-től függ (nem konstans!), az alappontokban a hiba 0 ($\omega_n=0$). A $\omega_n$ az alappontoktól függ → {{csebisev}}-pontokkal minimalizálható.`},
csebisev:{t:"Csebisev-polinom / -alappont", layer:5, pre:["hibaformula"], short:"Minimax: legkisebb maximumnorma.",
  body:R`$T_n(x)=\cos(n\arccos x)$, $T_{n+1}=2xT_n-T_{n-1}$, főegyüttható $2^{n-1}$, $n$ gyök ($x_k=\cos\frac{(2k-1)\pi}{2n}$), $n+1$ szélsőérték, súly $\frac{1}{\sqrt{1-x^2}}$. A normált $\widetilde T_n$ minimalizálja a maximumnormát ($1/2^{n-1}$). Csebisev-alappontok minimalizálják a hibakorlát $\omega_n$-tagját, és kivédik a {{runge}}-jelenséget.`},
runge:{t:"Runge-jelenség", layer:5, pre:["hibaformula"], short:"Egyenközű alapponton magas fokon a hiba elszáll.",
  body:R`Egyenletes (ekvidisztáns) alappontoknál magas fokszámmal a hiba a SZÉLEKEN robban — még a $C^\infty$ Runge-függvényre ($\frac{1}{1+25x^2}$) is. Az ok az alappontok elhelyezése, nem a simaság hiánya. „Több pont = jobb” HAMIS.`},
lebesgue:{t:"Lebesgue-állandó Λₙ", layer:5, pre:["lagrange"], short:"Az adathiba felerősítési tényezője.",
  body:R`$\Lambda_n=\max_x\sum_k|\ell_k(x)|$, csak az alappontoktól függ. $|L_n-\tilde L_n|\le\varepsilon\Lambda_n$. Legalább logaritmikusan nő ($\Lambda_n\to\infty$): több pont = érzékenyebb az adathibára.`},
approx:{t:"Approximáció (legkisebb négyzetek)", layer:5, pre:["interp"], short:"Legjobb közelítés, nem pontos illesztés.",
  body:R`Zajos adatra a {{normalegy}}-tel illesztett kis fokú polinom a jó (kisimít); az interpoláció a zajt is végigkövetné. Az LNM a maradék 2-normáját (hibanégyzet-összeget) minimalizálja.`},
normalegy:{t:"Gauss-féle normálegyenlet", layer:5, pre:["approx"], short:"AᵀA a = Aᵀy.",
  body:R`A túlhatározott $Aa=y$ legkisebb négyzetes megoldása. $A^\top A$ MINDIG szimmetrikus, de csak teljes oszloprangnál invertálható/pozitív definit. $\mathrm{cond}(A^\top A)=\mathrm{cond}(A)^2$ → numerikusan QR/SVD jobb. Az illesztett egyenes átmegy az $(\bar x,\bar y)$ átlagponton.`},
pszeudoinv:{t:"Általánosított (pszeudo)inverz", layer:5, pre:["normalegy"], short:"A⁺=(AᵀA)⁻¹Aᵀ — bal inverz.",
  body:R`Túlhatározott, teljes oszloprangú esetben $a^+=A^+y=(A^\top A)^{-1}A^\top y$. Geometriailag $Aa^+$ az $y$ merőleges vetülete az oszloptérre; a maradék merőleges → ez maga a {{normalegy}}.`},

/* — réteg 6 — */
gyok:{t:"Gyök (zérushely)", layer:6, pre:[], short:"f(x*)=0 — iterációval keressük.",
  body:R`Nemlineáris egyenletre nincs általános véges képlet → iterálunk. Átírható {{fixpont}}-feladattá: $f(x)=0\iff x=\varphi(x)$.`},
bolzano:{t:"Bolzano-tétel + felezés", layer:6, pre:["gyok"], short:"Előjelváltás → van gyök.",
  body:R`$f\in C[a,b]$ és $f(a)f(b)<0\Rightarrow\exists x^*$. Elégséges, de NEM szükséges, és csak LÉTEZÉST ad. Az intervallumfelezés ($\frac{b-a}{2^k}$ hiba) a legrobusztusabb, de lineáris (lassú).`},
fixpont:{t:"Fixpont és kontrakció", layer:6, pre:["gyok"], short:"x*=φ(x*); |φ′|<1 → összehúzás.",
  body:R`{{kontrakcio}}: $|\varphi(x)-\varphi(y)|\le q|x-y|$, $q<1$. Ellenőrzés: $|\varphi'(x)|<1$ az intervallumon (elégséges, nem szükséges; intervallumfüggő). A fixpont vonzó, ha $|\varphi'(x^*)|<1$, taszító, ha $>1$.`},
kontrakcio:{t:"Kontrakció", layer:6, pre:["fixpont"], short:"Távolságot q<1 faktorral csökkent.",
  body:R`A {{banach}}-tétel motorja. $q=\max|\varphi'|$. Csak megfelelő $\varphi$-vel konvergál az iteráció — ugyanahhoz az $f$-hez tartozó rossz $\varphi$ divergál.`},
bolzano2:{t:"Brouwer-féle fixponttétel", layer:6, pre:["fixpont"], short:"Önmagába képez + folytonos → van fixpont.",
  body:R`$\varphi:[a,b]\to[a,b]$ folytonos $\Rightarrow$ van fixpont. Csak LÉTEZÉS — sem egyértelműség, sem konvergencia. Kontrakció NEM kell hozzá.`},
banach:{t:"Banach-féle fixponttétel", layer:6, pre:["kontrakcio"], short:"Kontrakció → egyetlen fixpont + konvergencia.",
  body:R`Kontrakció $\Rightarrow$ egyetlen fixpont, az iteráció minden $x_0$-ból konvergál, hibabecsléssel ($|x_k-x^*|\le q^k|x_0-x^*|$). Csak LEGALÁBB elsőrendet garantál.`},
newtonmod:{t:"Newton-módszer", layer:6, pre:["fixpont","konvrend"], short:"Érintő zérushelye; kvadratikus.",
  body:R`$x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}$ = az érintő (1. fokú Taylor) gyöke. Általában MÁSODRENDŰ ($|x_{k+1}-x^*|\le M|x_k-x^*|^2$), feltéve egyszeres gyök ($f'(x^*)\ne0$). $f'(x_k)=0$-nál nincs értelmezve; rossz helyről divergálhat/ciklizálhat.`},
hurmod:{t:"Húrmódszer (regula falsi)", layer:6, pre:["gyok"], short:"Bracketel; elsőrendű, biztos.",
  body:R`Megtartja az ellenkező előjelű pontot → mindig közrefogja a gyököt, megbízhatóan konvergál, de LASSÚ (elsőrendű). Nem kell derivált.`},
szelomod:{t:"Szelőmódszer", layer:6, pre:["konvrend"], short:"Utolsó két pont; p≈1.618.",
  body:R`Mindig az utolsó két pontot használja (nem bracketel) → divergálhat, de ha konvergál, gyors: $p=\frac{1+\sqrt5}{2}\approx1{.}618$ (szuperlineáris). Derivált nem kell.`},
konvrend:{t:"Konvergencia rend", layer:6, pre:[], short:"|eₖ₊₁| ≈ c·|eₖ|ᵖ.",
  body:R`$\lim\frac{|x_{k+1}-x^*|}{|x_k-x^*|^p}=c\in(0,\infty)$. $p\ge1$, nem feltétlen egész. Sorrend: felezés/húr/fixpont ($p=1$) < szelő ($1{.}618$) < Newton ($p=2$). $p$ derivált eltűnése $\varphi'(x^*)=\dots=\varphi^{(p-1)}(x^*)=0$ → $p$-edrend.`},
horner:{t:"Horner-algoritmus", layer:6, pre:[], short:"Polinom kiértékelése O(n)-ben.",
  body:R`Átzárójelezés: $a_k^{(1)}=a_k+\xi a_{k+1}^{(1)}$, és $P(\xi)=a_0^{(1)}$. $O(n)$ a naiv $O(n^2)$ helyett. A $(x-\xi)$-vel való szintetikus osztás; a táblázat átlója a Taylor-EGYÜTTHATÓkat adja: $a_j^{(j+1)}=\frac{P^{(j)}(\xi)}{j!}$ — a derivált értékéhez $j!$-sal szorozz!`},
gyokkorlat:{t:"Gyökök korlátja", layer:6, pre:["horner"], short:"r < |xₖ| < R körgyűrű.",
  body:R`$R=1+\frac{\max_{0\le i\le n-1}|a_i|}{|a_n|}$, $r=\frac{1}{1+\max_{1\le i\le n}|a_i|/|a_0|}$. Minden gyök (valós és komplex) az origó körüli NYÍLT körgyűrűben. Csak az abszolút értékre ad korlátot, nem a helyre.`},

/* — réteg 7 — */
kvadratura:{t:"Kvadratúra (numerikus integrálás)", layer:7, pre:["interp"], short:"∫f ≈ Σ Aₖ f(xₖ).",
  body:R`$f$-et polinommal cseréljük, azt integráljuk. A súlyok $A_k=\int\ell_k\,w\,dx$ csak az alappontoktól és $w$-től függenek, $f$-től NEM. „Interpolációs típusú” $\iff$ pontos $P_n$-en. $\sum A_k=b-a$ (ha $w\equiv1$).`},
newtoncotes:{t:"Newton–Cotes-formulák", layer:7, pre:["kvadratura"], short:"Ekvidisztáns alappontok.",
  body:R`Egyenletes alappontok, $w\equiv1$. Zárt: a végpontok is alappontok; nyílt: nem. (Csebisev-típus: egyenlő SÚLYok; Gauss: súlyok ÉS pontok optimalizálva → $n+1$ ponttal $2n+1$ fok.)`},
erinto:{t:"Érintő (középponti) formula", layer:7, pre:["newtoncotes"], short:"(b−a)·f((a+b)/2); pontos 1. fokig.",
  body:R`Nyílt, 1 alappont. Hiba $+\frac{(b-a)^3}{24}f''$ — pontos a lineárisra. Az érintőhiba FELE a trapézhibának, ellenkező előjellel.`},
trapez:{t:"Trapéz-formula", layer:7, pre:["newtoncotes"], short:"(b−a)/2·(f(a)+f(b)); pontos 1. fokig.",
  body:R`Zárt, 2 alappont. Hiba $-\frac{(b-a)^3}{12}f''$. Összetett: $O(h^2)$, súlyok $1,2,\dots,2,1$; $m$ duplázása → hiba/4.`},
simpson:{t:"Simpson-formula", layer:7, pre:["newtoncotes"], short:"1:4:1 súlyozás; pontos 3. fokig!",
  body:R`Zárt, 3 alappont, $\frac{b-a}{6}(f(a)+4f(\frac{a+b}{2})+f(b))$. Parabolával közelít, de KÖBÖSRE is pontos (páros $n$ szuperkonvergencia). Hiba $-\frac{(b-a)^5}{2880}f^{(4)}$ ($C^4$ kell). Összetett: $O(h^4)$, $m$ páros; $S=\frac{2E+T}{3}$.`},
pontfok:{t:"Pontossági fok", layer:7, pre:["kvadratura"], short:"A legnagyobb fok, amire pontos.",
  body:R`Nem azonos az interpoláló polinom fokával! Érintő → 1, trapéz → 1, Simpson → 3. Páros $n$ esetén eggyel magasabb, mint amit várnánk (szuperkonvergencia).`},
osszetett:{t:"Összetett formula", layer:7, pre:["trapez","simpson"], short:"Felosztás m részre + lokális formula.",
  body:R`Nem a fokszámot, hanem $m$-et növeljük. Trapéz $O(h^2)$, Simpson $O(h^4)$. A hibakonstansok mások, mint az egyszerűeké ($\frac{1}{12m^2}$, $\frac{1}{180m^4}$).`},
richardson:{t:"Richardson-extrapoláció", layer:7, pre:["osszetett"], short:"Két becslésből kioltjuk a vezető hibát.",
  body:R`$\frac13(4T_{2m}-T_m)=S_m$ ($O(h^2)\to O(h^4)$); $\frac1{15}(16S_{2m}-S_m)$ ($\to O(h^6)$). Csak SIMA $f$-re működik — szingularitásnál (pl. $x^{1/3}$ a 0-ban) nem, ott Gauss-kvadratúra kell. A rekurzió = Romberg-integrálás.`},

/* — kiegészítések: ortogonális felbontások (réteg 3) — */
cholesky:{t:"Cholesky-felbontás", layer:3, pre:["spd","lu"], short:"A=LLᵀ szimmetrikus pozitív definitre.",
  body:R`{{spd|SPD}} mátrixra $A=LL^\top$ ($L$ alsó háromszög, pozitív átlóval). Kb. feleannyi művelet, mint az {{lu|LU}} ($\sim n^3/3$), pivotálás nélkül stabil, és megőrzi a {{conda|cond₂}}-t.`},
qr:{t:"QR-felbontás", layer:3, pre:["haromszog"], short:"A=QR, Q ortogonális, R felső háromszög.",
  body:R`$Q$ oszlopai ortonormáltak, $R$ felső háromszög. Mivel $\mathrm{cond}_2(Q)=1$, $\mathrm{cond}_2(A)=\mathrm{cond}_2(R)$ → stabil. Előállítás: {{gramschmidt}} vagy {{householder}}. A {{normalegy|legkisebb négyzeteknél}} az $A^\top A$ helyett használjuk (nem négyzeteli a kondíciót).`},
gramschmidt:{t:"Gram–Schmidt ortogonalizáció", layer:3, pre:["qr","vnorma"], short:"Az oszlopok ortonormálása → QR.",
  body:R`Az $A$ oszlopaiból ortonormált rendszert ($Q$) épít; a vetületi együtthatók adják $R$-t. A klasszikus változat numerikusan kevésbé stabil, a módosított (MGS) jobb.`},
householder:{t:"Householder-mátrix (tükrözés)", layer:3, pre:["qr"], short:"H=I−2vvᵀ/(vᵀv): ortogonális tükrözés.",
  body:R`$H=I-\frac{2vv^\top}{v^\top v}$ egyszerre szimmetrikus ÉS ortogonális ($H=H^\top=H^{-1}$), $\det H=-1$, és $\|Hx\|_2=\|x\|_2$. Oszloponként egy tükrözéssel nullázza az átló alattiakat → numerikusan stabil {{qr|QR}}.`},

/* — kiegészítések: közelítés (réteg 5) — */
invinterp:{t:"Inverz interpoláció", layer:5, pre:["interp","gyok"], short:"f⁻¹-et interpoláljuk a gyök közelítéséhez.",
  body:R`$f(x)=0$ gyökéhez: ha $f$ invertálható a gyök közelében (monoton), az $f^{-1}$-et interpoláljuk — szerepcsere: $y_i=f(x_i)$ az alappont, $x_i$ a függvényérték —, és $x_{k+1}=Q_n(0)$, ami csak EGY behelyettesítés (nincs polinom-gyökkeresés).`},

/* — kiegészítések: nemlineáris / polinom (réteg 6) — */
newtontobb:{t:"Többváltozós Newton-módszer", layer:6, pre:["newtonmod","ler"], short:"F(x)=0 vektorra, Jacobi-mátrixszal.",
  body:R`$F:\mathbb R^n\to\mathbb R^n$. A skaláris $f'$ helyét a {{jacobim|Jacobi-mátrix}} $F'$ veszi át. Gyakorlatban NEM invertálunk: az $F'(x^{(k)})\,s^{(k)}=-F(x^{(k)})$ {{ler|LER}}-t oldjuk meg, majd $x^{(k+1)}=x^{(k)}+s^{(k)}$. $\det(F')=0$-nál nincs értelmezve.`},
jacobim:{t:"Jacobi-mátrix", layer:6, pre:[], short:"A parciális deriváltak mátrixa, F′.",
  body:R`$F'(x)=\left(\frac{\partial f_i}{\partial x_j}\right)$. A {{newtontobb|többváltozós Newton}} ezzel linearizál; a $\det(F')=0$ a skaláris $f'=0$ megfelelője (szinguláris Jacobi). Ez NEM a Jacobi-iteráció!`},
broyden:{t:"Broyden-módszer (kvázi-Newton)", layer:6, pre:["newtontobb"], short:"Nem deriválunk minden lépésben.",
  body:R`A {{jacobim|Jacobi-mátrixot}} lépésenként frissíti/közelíti (nem számolja újra és nem invertál) → lépésenként olcsóbb, de lassabban (szuperlineárisan) konvergál, mint a {{newtontobb|Newton}}.`},
recippoly:{t:"Reciprokpolinom", layer:6, pre:["gyokkorlat"], short:"Az együtthatók fordított sorrendje.",
  body:R`$Q(y)$ együtthatói $P$ együtthatói fordított sorrendben; $Q$ gyökei $P$ gyökeinek reciprokai. Ezzel vezethető le a {{gyokkorlat|gyökök}} alsó korlátja ($r$) a felsőből.`}
};

/* Leckék (LESSON_LEAD + LESSONS) → külön fájl: lessons.js */

/* ---------------- Fülek és témakörök ---------------- */
var TABS = [
  {id:"tananyag",   label:"Tananyag"},
  {id:"attekintes", label:"Áttekintés"},
  {id:"p1",         label:"1· Hibák · LER · lebegőpont"},
  {id:"p2",         label:"2· Normák · interpoláció · közelítés"},
  {id:"p3",         label:"3· Gyökök · Horner · integrál"},
  {id:"gyak",       label:"Gyakorlóbank · 224"},
  {id:"vizsga",     label:"Vizsga-szimuláció"},
  {id:"fogalomtar", label:"Fogalomtár"}
];

/* a Gyakorlóbank témakör-sorrendje (a 224 új kérdéshez) */
var PRACTICE_ORDER = ["hiba","direkt","lebego","norma","interp","cseb","lnm","gyok","horner","integ","egyeb"];

var TOPIC_DEFS = {
  hiba:   {t:"Hibaszámítás és kondicionáltság", c:["abshiba","relhiba_dummy","kondfv","conda","erzekenyseg","reziduum"]},
  direkt: {t:"Direkt módszerek LER-re (Gauss, LU, sávmátrix)", c:["gauss","pivot","lu","det_lu","spd","diagdom","savszel","schur","progonka","cholesky","qr","gramschmidt","householder"]},
  lebego: {t:"Lebegőpontos számábrázolás", c:["gepiszam","normalizalas","eps0","eps1","flfun"]},
  norma:  {t:"Vektor- és mátrixnormák", c:["vnorma","pnorma","mxnorma","indnorma","frob","spektralnorma","spektralsugar"]},
  interp: {t:"Interpoláció", c:["interp","lagrange","newtonalak","osztottdiff","hibaformula","runge","invinterp"]},
  cseb:   {t:"Csebisev- és ortogonális polinomok", c:["csebisev","hibaformula","runge"]},
  lnm:    {t:"Legkisebb négyzetek", c:["approx","normalegy","pszeudoinv"]},
  gyok:   {t:"Gyökkeresés / nemlineáris egyenletek", c:["gyok","bolzano","fixpont","kontrakcio","banach","newtonmod","hurmod","szelomod","konvrend","newtontobb","jacobim","broyden"]},
  horner: {t:"Horner-séma és polinomok", c:["horner","gyokkorlat","recippoly"]},
  integ:  {t:"Numerikus integrálás (kvadratúra)", c:["kvadratura","newtoncotes","erinto","trapez","simpson","pontfok","osszetett","richardson"]},
  egyeb:  {t:"Egyéb / vegyes", c:[]}
};
/* a 'relhiba_dummy' nem létezik a C-ben → kihagyjuk; a cbar csak a meglévőket jeleníti meg */
delete TOPIC_DEFS.hiba.c[1];
TOPIC_DEFS.hiba.c = TOPIC_DEFS.hiba.c.filter(function(x){return !!x;});

var TAB_DEFS = [
  {id:"p1", htop:"1· Hibák, lineáris rendszerek, lebegőpont", lead:"Hibaszámítás és kondicionáltság · Gauss/LU/sávmátrix · gépi számábrázolás. Előbb tippelj, csak utána fedd fel!", topics:["hiba","direkt","lebego"]},
  {id:"p2", htop:"2· Normák, interpoláció, közelítés", lead:"Vektor- és mátrixnormák · interpoláció · Csebisev · legkisebb négyzetek.", topics:["norma","interp","cseb","lnm"]},
  {id:"p3", htop:"3· Gyökkeresés, Horner, integrálás", lead:"Nemlineáris egyenletek · Horner-séma · numerikus integrálás.", topics:["gyok","horner","integ"]}
];

/* ---------------- Kérdésbank (2 vizsga, 30 kérdés) ---------------- */
function O(k,t){return {k:k,t:t};}
var QUESTIONS = [
/* ===== Hibaszámítás ===== */
{ex:1,n:1,topic:"hiba",tag:"relatív hiba",
 q:R`Egy hőmérővel reggel $a=A+\Delta a$, este $b=B+\Delta b$ hőmérsékletet mérünk, ugyanazzal a hőmérővel, ezért $\Delta a=\Delta b$. Mi a kapcsolat a mérések relatív hibája között? (Az ábra szerint $b$ a nagyobb érték.)`,
 opts:[O("a","Az $a$ mérés relatív hibája kisebb."),O("b","A $b$ mérés relatív hibája kisebb."),O("c","Mindkét mérés relatív hibája azonos."),O("d","Nem dönthető el.")],
 ans:"b", anstext:"a nagyobb mért értékhez kisebb relatív hiba tartozik.",
 exp:R`A relatív hiba $\frac{\Delta a}{|a|}$ ill. $\frac{\Delta b}{|b|}$. Azonos abszolút hiba mellett a nagyobb értékhez kisebb relatív hiba tartozik; az ábra szerint $b$ a nagyobb. <ul><li><b>a)</b> rossz: a kisebb értéknél nagyobb a relatív hiba. <b>c)</b> csak $|a|=|b|$ esetén. <b>d)</b> az értékek nagyságviszonyából eldönthető.</li></ul>`},

{ex:1,n:4,topic:"hiba",tag:"kondíciószám",
 q:R`Tekintsük az $Ax=b$ és $By=c$ LER-eket; a jobboldalak relatív hibája azonos. Melyik megoldásnak lesz nagyobb a relatív hibája, ha $1\approx\mathrm{cond}(A)\ll\mathrm{cond}(B)$?`,
 opts:[O("a","Az 1. LER megoldásáé."),O("b","A 2. LER megoldásáé."),O("c","Mindkettőé azonos."),O("d","A kondíciószám nem befolyásolja.")],
 ans:"b", anstext:"a rosszul kondicionált 2. rendszerben nagyobb a hiba.",
 exp:R`$\frac{\|\delta x\|}{\|x\|}\lesssim\mathrm{cond}(A)\cdot\frac{\|\delta b\|}{\|b\|}$. $B$ rosszul kondicionált → nagyobb hiba. <ul><li><b>a)</b> az 1. (jól kondicionált) rendszerben kicsi a hiba. <b>d)</b> a kondíciószám a meghatározó.</li></ul>`},

{ex:2,n:10,topic:"hiba",tag:"kondíciószám",
 q:R`Tekintsük az $A(x+\Delta x)=b+\Delta b$ rendszert. Mire ad felső becslést $A$ kondíciószáma?`,
 opts:[O("a","$\\frac{\\|\\Delta x\\|}{\\|x\\|}\\cdot\\frac{\\|b\\|}{\\|\\Delta b\\|}$"),O("b","$\\frac{\\|\\Delta x\\|}{\\|x\\|}\\big/\\frac{\\|b\\|}{\\|\\Delta b\\|}$"),O("c","$\\frac{\\|b\\|}{\\|\\Delta b\\|}$"),O("d","$\\frac{\\|\\Delta x\\|}{\\|x\\|}$")],
 ans:"a", anstext:"a hibafelnagyítási arányra.",
 exp:R`$\frac{\|\Delta x\|}{\|x\|}\le\mathrm{cond}(A)\frac{\|\Delta b\|}{\|b\|}$, átrendezve $\frac{\|\Delta x\|}{\|x\|}\cdot\frac{\|b\|}{\|\Delta b\|}\le\mathrm{cond}(A)$. <ul><li><b>d)</b> magára a relatív hibára csak akkor korlát, ha a bemeneti relatív hiba $\le1$.</li></ul>`},

/* ===== Direkt módszerek ===== */
{ex:1,n:2,topic:"direkt",tag:"Gauss / determináns",
 q:R`A Gauss-elimináció $(n-1)$. lépése után $A^{(n-1)}$ felső háromszögmátrix (átlóelemek $a_{ii}^{(i-1)}$). Melyik állítás igaz?`,
 opts:[O("a","$A$ sajátértékei $\\lambda_i=a_{ii}^{(i-1)}$."),O("b","$\\det(A)=a_{11}^{(0)}a_{22}^{(1)}\\cdots a_{nn}^{(n-1)}$."),O("c","Ha minden $a_{ii}^{(i-1)}>0$, akkor $A$ pozitív definit."),O("d","Egyik sem.")],
 ans:"b", anstext:"a determináns a pivotok szorzata.",
 exp:R`A sorcserék nélküli GE nem változtatja a determinánst, a felső háromszögmátrix determinánsa a főelemek szorzata. <ul><li><b>a)</b> az elimináció nem hasonlósági transzformáció. <b>c)</b> pozitív pivotok csak szimmetrikus mátrixnál garantálnak pozitív definitséget.</li></ul>`},

{ex:1,n:3,topic:"direkt",tag:"LU — hamis állítás",
 q:R`$A$-nak van $A=LU$ felbontása, és nem minden alsóháromszög-eleme 0. Az $L,U$ mátrixokra melyik állítás <b>hamis</b>? ($p,q$ indexek)`,
 opts:[O("a","$p>q\\Rightarrow \\ell_{pq}=0$"),O("b","$p<q\\Rightarrow u_{qp}=0$"),O("c","$p=q\\Rightarrow \\ell_{qp}=1$"),O("d","$p\\ne q\\Rightarrow \\ell_{pq}u_{pq}=0$")],
 ans:"a", anstext:"a) hamis: L átló alatti elemei éppen a nemnulla elemek.",
 exp:R`$L$ alsó háromszög, az átló alatti ($p>q$) elemek a (nem nulla) elemek — az a) hamisan állítja, hogy nullák. <ul><li><b>b,d)</b> igaz: $U$ átlója alatt 0. <b>c)</b> Doolittle: $L$ átlója csupa 1.</li></ul>`},

{ex:1,n:10,topic:"direkt",tag:"műveletigény",
 q:R`Egy $n\times n$-es mátrix Gauss-eliminációjához képest kb. mennyi művelet kell egy $2n\times2n$-es mátrixéhoz?`,
 opts:[O("a","8-szor annyi"),O("b","4-szer annyi"),O("c","2-szer annyi"),O("d","ugyanannyi")],
 ans:"a", anstext:"a köbös műveletigény miatt 8-szor annyi.",
 exp:R`A műveletigény $\sim\frac{n^3}{3}=O(n^3)$. $(2n)^3=8n^3$, tehát kb. 8-szor annyi.`},

{ex:2,n:4,topic:"direkt",tag:"determináns LU-ból",
 q:R`Legyen $A=LU$ egy reguláris négyzetes mátrix LU-felbontása. Melyik formula adja meg helyesen $\det(A)$-t?`,
 opts:[O("a","$-(\\prod \\ell_{ii})(\\prod u_{ii})$"),O("b","$(\\prod \\ell_{ii})(\\prod u_{ii})$"),O("c","$(\\prod \\ell_{ii})-(\\prod u_{ii})$"),O("d","Semmit nem mondhatunk.")],
 ans:"b", anstext:"det(A)=det(L)·det(U), háromszögmátrixé az átló szorzata.",
 exp:R`$\det(A)=\det(L)\det(U)$, és háromszögmátrix determinánsa az átlóelemek szorzata. (Doolittle-nál $\prod\ell_{ii}=1$.) <ul><li><b>a)</b> a mínusz hibás. <b>c)</b> szorzat kell, nem különbség.</li></ul>`},

{ex:2,n:15,topic:"direkt",tag:"SPD / Schur — hamis",
 q:R`$A$ szimmetrikus pozitív definit, fél-sávszélessége $w$, $A=LU$ cserék nélkül előáll. $[A|A_{11}]$ az első lépés Schur-komplemense. Melyik állítás <b>hamis</b>?`,
 opts:[O("a","$A_{11}$ szimmetrikus és pozitív definit."),O("b","$A_{11}$ fél-sávszélessége $\\le w$."),O("c","Az $U$ mátrix megőrzi a szimmetriát."),O("d","A Schur-komplemens felhasználható a GE folytatásához.")],
 ans:"c", anstext:"c) hamis: U felső háromszög, nem szimmetrikus.",
 exp:R`Az $U$ felső háromszögmátrix, ami nem szimmetrikus (SPD esetén $U=DL^\top$). <ul><li><b>a)</b> SPD Schur-komplemense is SPD. <b>b)</b> a sávszélesség nem nő. <b>d)</b> így megy a blokk-elimináció.</li></ul>`},

/* ===== Lebegőpont ===== */
{ex:1,n:9,topic:"lebego",tag:"normalizálás",
 q:R`A lebegőpontos számábrázolás definíciójában miért van szükség a normalizálásra?`,
 opts:[O("a","Pontosabb számábrázolást tesz lehetővé."),O("b","Több számot tudunk ábrázolni."),O("c","Egyértelművé teszi a gépi számok megadását."),O("d","Konvenció, nincs különösebb haszna.")],
 ans:"c", anstext:"egyértelművé teszi minden gépi szám alakját.",
 exp:R`Normalizálás ($m_1=1$) nélkül ugyanaz a szám többféleképp lenne felírható; a normalizálás egyértelművé teszi az alakot. <ul><li><b>a,b,d)</b> nem a pontosságról/darabszámról szól, és van haszna.</li></ul>`},

{ex:2,n:2,topic:"lebego",tag:"gépi számhalmaz",
 q:R`Tekintsük az $M(t,-4,4)$ gépi számhalmazt. Melyik állítás igaz?`,
 opts:[O("a","A legkisebb pozitív gépi szám $\\frac{1}{16}$."),O("b","$M$ számossága $2^{4+t}$."),O("c","Az 1 és a rákövetkező gépi szám különbsége $2^{1-t}$."),O("d","A legnagyobb gépi szám $2^{5-t}$.")],
 ans:"c", anstext:"a rés 1 körül 2^(1−t) = ε₁.",
 exp:R`Az 1-et $0.1\dots0\cdot2^1$ alakban ábrázoljuk; a rákövetkező $1+2^{1-t}$, a rés $2^{1-t}=\varepsilon_1$. <ul><li><b>a)</b> a legkisebb pozitív $2^{-5}=\frac1{32}$. <b>b)</b> a számosság $\approx9\cdot2^t$. <b>d)</b> a legnagyobb $\approx2^4$.</li></ul>`},

/* ===== Normák ===== */
{ex:1,n:7,topic:"norma",tag:"normák ekvivalenciája",
 q:R`Igaz-e, hogy $\mathbb{R}^3$-ban bármely $\|\cdot\|_a$ és $\|\cdot\|_b$ vektornorma ekvivalens, azaz léteznek $0<c_1,c_2$, hogy $c_1\|x\|_a\le\|x\|_b\le c_2\|x\|_a$ minden $x$-re?`,
 opts:[O("a","Létezik, de csak $c_1\\|x\\|_a\\le\\|x\\|_b$."),O("b","Létezik, de csak $\\|x\\|_b\\le c_2\\|x\\|_a$."),O("c","Létezik ilyen $c_1$ és $c_2$."),O("d","Nem létezik ilyen $c_1$ és $c_2$.")],
 ans:"c", anstext:"véges dimenzióban minden norma ekvivalens.",
 exp:R`Véges dimenziós térben minden norma ekvivalens, így mindkét konstans létezik egyszerre. <ul><li><b>a,b)</b> nemcsak az egyik egyenlőtlenség teljesül. <b>d)</b> véges dimenzióban léteznek a konstansok.</li></ul>`},

{ex:1,n:12,topic:"norma",tag:"sornorma maximalizálása",
 q:R`Mindig létezik-e olyan $x$ vektor, ami az $\frac{\|Ax\|_\infty}{\|x\|_\infty}$ hányadost maximalizálja?`,
 opts:[O("a","Igen, $\\lambda_{\\max}(A)$ egy sajátvektora ilyen."),O("b","Igen, a csupa nulla, $i$. koordinátában 1 vektorok."),O("c","Igen, az $x_i=\\pm1$ koordinátájú vektorok ilyenek."),O("d","Nem mindig létezik maximum, csak a sup.")],
 ans:"c", anstext:"a sornorma a megfelelő sor előjeleihez igazodó ±1 vektorral adódik.",
 exp:R`$\|A\|_\infty=\max_i\sum_j|a_{ij}|$ (max abszolút sorösszeg), amit a megfelelő sor előjeleihez igazodó $\pm1$ koordinátájú vektor ad. <ul><li><b>d)</b> véges dimenzióban a kompakt egységgömbön a maximum létezik.</li></ul>`},

{ex:2,n:6,topic:"norma",tag:"normaláncok",
 q:R`Legyen $x\in\mathbb{R}^n$. Melyik egyenlőtlenség teljesül <b>minden</b> $x$-re?`,
 opts:[O("a","$\\|x\\|_2\\le\\|x\\|_\\infty\\le\\|x\\|_1$"),O("b","$\\|x\\|_\\infty\\le\\|x\\|_2\\le\\|x\\|_1^{2}$"),O("c","$\\|x\\|_\\infty\\le\\|x\\|_1\\le\\|x\\|_2$"),O("d","$\\|x\\|_\\infty\\le\\|x\\|_2\\le\\|x\\|_1$")],
 ans:"d", anstext:"a standard normalánc: ∞ ≤ 2 ≤ 1.",
 exp:R`A $p$-norma monoton csökken $p$-ben: $\|x\|_\infty\le\|x\|_2\le\|x\|_1$. <ul><li><b>a)</b> $\|x\|_2\le\|x\|_\infty$ nem igaz (pl. $(1,1)$). <b>b)</b> a végén négyzet áll, ami kis vektorra elbukik. <b>c)</b> $\|x\|_1\le\|x\|_2$ nem igaz.</li></ul>`},

{ex:2,n:8,topic:"norma",tag:"mátrixnorma-azonosság",
 q:R`Melyik állítás teljesül a mátrixnormákra?`,
 opts:[O("a","$\\|A^\\top\\|_1=\\|A\\|_\\infty$"),O("b","$\\|A\\|_\\infty$ a legnagyobb szinguláris érték."),O("c","$\\|A^{-1}\\|_1=\\|A\\|_\\infty$"),O("d","$\\|A\\|_1$ a legnagyobb oszlopvektor euklideszi normája.")],
 ans:"a", anstext:"transzponáláskor az oszlop- és sorösszeg felcserélődik.",
 exp:R`$\|A\|_1$ = max abszolút oszlopösszeg, $\|A\|_\infty$ = max abszolút sorösszeg; transzponáláskor felcserélődnek. <ul><li><b>b)</b> a legnagyobb szinguláris érték a $\|A\|_2$. <b>d)</b> $\|A\|_1$ abszolút értékek összege oszloponként, nem euklideszi norma.</li></ul>`},

/* ===== Interpoláció ===== */
{ex:1,n:5,topic:"interp",tag:"konkrét polinom",
 q:R`Alappontok $x_0=0,x_1=1,x_2=2$, értékek $y_0=1,y_1=1,y_2=0$. Melyik a pontrendszerre illeszkedő interpolációs polinom?`,
 opts:[O("a","$-x^2+x+1$"),O("b","$x^2+x+1$"),O("c","$\\frac12 x^2-\\frac12 x+1$"),O("d","$-\\frac12 x^2+\\frac12 x+1$")],
 ans:"d", anstext:"a=−½, b=½, c=1 a feltételekből.",
 exp:R`$p(0)=1\Rightarrow c=1$; $p(1)=1\Rightarrow a+b=0$; $p(2)=0\Rightarrow 4a+2b=-1$. Innen $a=-\frac12,b=\frac12$. <ul><li>a,b,c legalább egy ponton elbuknak (pl. c)-nél $p(2)=2$).</li></ul>`},

{ex:2,n:1,topic:"interp",tag:"fokszám",
 q:R`Adott $n+1$ adatpont különböző $x_i$-kkel. Mi az (egyértelmű) interpolációs polinom fokszáma?`,
 opts:[O("a","$n+1$"),O("b","$n+1$ vagy kevesebb"),O("c","$n$"),O("d","$n$ vagy kevesebb")],
 ans:"d", anstext:"legfeljebb n-edfokú.",
 exp:R`$n+1$ pontra pontosan egy, legfeljebb $n$-edfokú polinom illeszkedik — „$n$ vagy kevesebb”, mert pl. kollineáris pontokra a fok kisebb is lehet. <ul><li><b>a)</b> $n+1$ a pontok száma. <b>c)</b> nem feltétlenül pontosan $n$.</li></ul>`},

{ex:2,n:14,topic:"interp",tag:"optimális alappont",
 q:R`A folytonos $f$ $[-1,1]$-en interpoláló polinomjánál melyik alappontrendszer minimalizálja a hibabecslést?`,
 opts:[O("a","Egyenletes felosztás."),O("b","Csebisev-alappontok $x_k=\\cos\\frac{2k-1}{2n}\\pi$."),O("c","Egyenletes eloszlású véletlen pontok."),O("d","Csak $-1$ és $1$.")],
 ans:"b", anstext:"a Csebisev-pontok minimalizálják ω_n maximumát.",
 exp:R`A hiba a $\frac{f^{(n)}(\xi)}{n!}\prod(x-x_k)$ tagtól függ; a Csebisev-pontok minimalizálják a $\prod(x-x_k)$ maximumát. <ul><li><b>a)</b> egyenközű → Runge-jelenség. <b>c,d)</b> nem optimálisak / nem elég pont.</li></ul>`},

/* ===== Csebisev ===== */
{ex:1,n:8,topic:"cseb",tag:"T₅ tulajdonságai",
 q:R`Melyik állítás igaz a $T_5$ Csebisev-polinomra?`,
 opts:[O("a","$T_5$ 1-főegyütthatós polinom."),O("b","$T_5=2x\\,T_4+T_3$."),O("c","Gyökei $x_k=\\cos\\frac{2k-1}{2n}\\pi$, $k=1,\\dots,5$."),O("d","Szélsőérték-helyei $\\xi_k=\\sin\\frac{k\\pi}{n}$.")],
 ans:"c", anstext:"a gyökök a koszinuszos képlettel adódnak.",
 exp:R`$T_n$ gyökei $x_k=\cos\frac{(2k-1)\pi}{2n}$. <ul><li><b>a)</b> $T_5$ főegyütthatója $2^4=16$. <b>b)</b> a rekurzió $T_5=2xT_4-T_3$ (mínusz). <b>d)</b> a szélsőértékhelyek $\xi_k=\cos\frac{k\pi}{n}$ (cos).</li></ul>`},

{ex:2,n:11,topic:"cseb",tag:"Csebisev — hamis",
 q:R`$T_n$ az $n$-edik Csebisev-polinom ($T_{n+1}=2xT_n-T_{n-1}$). Melyik állítás <b>hamis</b>?`,
 opts:[O("a","$T_n(\\cos\\theta)=\\cos(n\\theta)$."),O("b","Gyökei $x_k=\\cos\\frac{(2k-1)\\pi}{2n}$."),O("c","A normált $T_n$ 0-tól való eltérése a LEGNAGYOBB a monikus $n$-edfokúak közt."),O("d","Ortogonálisak a $w(x)=\\frac{1}{\\sqrt{1-x^2}}$ súlyra.")],
 ans:"c", anstext:"c) hamis: a normált Csebisev eltérése a LEGKISEBB (minimax).",
 exp:R`A minimax-tétel fordítva szól: a monikus Csebisev-polinom eltérése a <b>legkisebb</b> az összes monikus $n$-edfokú közül. A c) „legnagyobb”-at állít. <ul><li><b>a,b,d)</b> igaz.</li></ul>`},

/* ===== Legkisebb négyzetek ===== */
{ex:1,n:15,topic:"lnm",tag:"mikor konstans",
 q:R`$x,y\in\mathbb{R}^n$, $\sum x_i=0$. Egyenest illesztünk a $(x_i,y_i)$ pontokra legkisebb négyzetekkel. Mikor lesz a megoldás konstans?`,
 opts:[O("a","Ha $\\sum y_i=0$."),O("b","Ha $x$ és $y$ párhuzamosak."),O("c","Ha $x$ és $y$ merőlegesek."),O("d","Soha, mindig pontosan elsőfokú.")],
 ans:"c", anstext:"a meredekség 0, ha x⊥y.",
 exp:R`Konstans, ha a meredekség 0. Mivel $\bar x=0$, $m=\frac{\langle x,y\rangle}{\|x\|^2}$, így $m=0\iff x\perp y$. <ul><li><b>a)</b> $\sum y_i=0$ csak a konstans tagot érinti. <b>b)</b> párhuzamosságnál $m\ne0$.</li></ul>`},

{ex:2,n:13,topic:"lnm",tag:"normálegyenlet",
 q:R`$p_n$ a legkisebb négyzetes közelítő polinom ($N>n+1$), $A$ a Vandermonde-mátrix ($A_{ij}=x_i^{j-1}$). Melyik állítás teljesül az $\mathbf a$ együtthatóvektorra?`,
 opts:[O("a","$A^\\top A$ általában nem szimmetrikus, de invertálható."),O("b","A kapott $p_n$ interpolál az adatokon."),O("c","$\\mathbf a$ megoldja a normálegyenletet $A^\\top A\\mathbf a=A^\\top y$ (teljes rangú $A$)."),O("d","A normálegyenlet csak egyenletes $x_i$-kre írható fel.")],
 ans:"c", anstext:"a normálegyenlet AᵀAa=Aᵀy.",
 exp:R`Különböző $x_i$-k és $N\ge n+1$ miatt $A$ teljes oszloprangú, $A^\top A$ invertálható. <ul><li><b>a)</b> $A^\top A$ <b>mindig</b> szimmetrikus. <b>b)</b> túlhatározott esetben nem interpolál. <b>d)</b> nem kell egyenletes alappont.</li></ul>`},

/* ===== Gyökkeresés ===== */
{ex:1,n:11,topic:"gyok",tag:"alkalmazhatóság",
 q:R`Az $f(x)=e^x-|x|$ gyökét keressük. Melyik módszer alkalmazható?`,
 opts:[O("a","Húrmódszer $x_0=-2$, $x_1=2$-ből."),O("b","Newton-módszer $x_0=0$-ból."),O("c","Mindkettő."),O("d","Egyik sem.")],
 ans:"a", anstext:"van előjelváltás; a Newton x₀=0-nál nem deriválható.",
 exp:R`$f(-2)<0$, $f(2)>0$ → előjelváltás, a húrmódszer működik. A Newton $x_0=0$-ból nem: $|x|$ a 0-ban nem differenciálható, $f'(0)$ nem létezik. <ul><li><b>c)</b> a Newton 0-ból elbukik.</li></ul>`},

{ex:2,n:3,topic:"gyok",tag:"Newton-lépés",
 q:R`$f(x)=x(\sqrt{x}-1)$, az $x=1{,}0$ közeli zérust keressük Newtonnal. Melyik a helyes következő lépés?`,
 opts:[O("a","$x_n-\\frac{\\sqrt{x_n}+1}{\\frac13\\sqrt{x_n}+1}$"),O("b","$x_n-\\frac{x_n(\\sqrt{x_n}-1)}{\\frac32\\sqrt{x_n}-1}$"),O("c","$x_n-\\frac{x_n(\\sqrt{x_n}+1)}{\\frac32(x_n-2)}$"),O("d","$x_n-\\frac{\\sqrt{x_n}-1}{\\frac12\\sqrt{x_n}+2}$")],
 ans:"b", anstext:"f′(x)=3/2·√x − 1.",
 exp:R`$f(x)=x^{3/2}-x$, $f'(x)=\frac32\sqrt{x}-1$, így $x_{n+1}=x_n-\frac{x_n(\sqrt{x_n}-1)}{\frac32\sqrt{x_n}-1}$. <ul><li>a,c,d hibás derivált/átalakítás.</li></ul>`},

{ex:2,n:7,topic:"gyok",tag:"fixpont konvergencia",
 q:R`Az $x^3=2x+1$ egyenletnek van megoldása $[1{,}5;\,2{,}0]$-on ($x^*\approx1{,}618$). Melyik fixpont-iteráció tart ehhez?`,
 opts:[O("a","$x_{n+1}=\\frac{x_n^3-1}{2}$"),O("b","$x_{n+1}=\\frac{1}{x_n^2-2}$"),O("c","$x_{n+1}=\\sqrt{\\frac{2x_n+1}{x_n}}$"),O("d","Egyik sem.")],
 ans:"c", anstext:"csak ennél |g′(x*)|<1.",
 exp:R`Konvergenciához $|g'(x^*)|<1$ kell. <ul><li><b>c)</b> $g(x)=\sqrt{2+\frac1x}$, $g'(x^*)\approx-0{,}12$ → konvergál. <b>a)</b> $g'\approx3{,}9>1$. <b>b)</b> $g'\approx-8{,}5$ → divergál.</li></ul>`},

/* ===== Horner ===== */
{ex:1,n:13,topic:"horner",tag:"Horner-tábla",
 q:R`A Horner-táblázat alapján mennyi $Q(2)\cdot(P''(3)-2)$, ahol $P(x)=Q(x)(x-3)$? (A tábla szerint $Q(x)=x^2-6x+5$, és a 2. szint maradéka $P''(3)/2!$-ből $P''(3)=0$.)`,
 opts:[O("a","6"),O("b","$-6$"),O("c","0"),O("d","5")],
 ans:"a", anstext:"(−3)·(0−2)=6.",
 exp:R`$Q(x)=x^2-6x+5\Rightarrow Q(2)=-3$. $P''(x)=6x-18\Rightarrow P''(3)=0$. Tehát $(-3)(0-2)=6$. A $-6$ tipikus előjelhiba ($Q(2)$-t tévesen $+3$-nak véve).`},

{ex:2,n:9,topic:"horner",tag:"Horner + Taylor",
 q:R`$P(x)=(x-2)^2Q(x)$, a Horner-táblából $Q(x)=x+3$ és a 3. osztás maradéka $5=P''(2)/2!$. Mennyi $Q(2)+\frac12 P''(2)$?`,
 opts:[O("a","$-1$"),O("b","5"),O("c","10"),O("d","$-12$")],
 ans:"c", anstext:"Q(2)=5, P''(2)=10 → 5+5=10.",
 exp:R`$Q(2)=5$. A maradék $5=\frac{P''(2)}{2!}\Rightarrow P''(2)=10$. Így $5+\frac12\cdot10=10$. Az 5-ös válasz hibás: kimaradt a $\frac12 P''(2)=5$ tag.`},

/* ===== Integrálás ===== */
{ex:1,n:6,topic:"integ",tag:"összetett kvadratúra hibája",
 q:R`Melyik összefüggés igaz az összetett kvadratúraformulák hibájára, ha $f\in C^4[a,b]$?`,
 opts:[O("a","$|\\int f-T_m(f)|\\le\\frac{(b-a)^3}{24m^2}M_2$"),O("b","$|\\int f-T_m(f)|\\le|T_m(f)+T_{2m}(f)|$"),O("c","$|\\int f-S_m(f)|\\le-\\frac{(b-a)^5}{180m^4}M_4$"),O("d","$|\\int f-S_m(f)|\\le|S_m(f)-S_{2m}(f)|$")],
 ans:"a", anstext:"az egyetlen valódi felső korlát (pozitív, M₂, 1/m²).",
 exp:R`Pozitív együttható, a második derivált korlátja $M_2$, $\sim1/m^2$ csökkenés. <ul><li><b>b)</b> a hiba nem becsülhető az értékek összegével. <b>c)</b> a jobb oldal negatív, és $M_4$ a Simpsoné. <b>d)</b> csak heurisztikus, nem szigorú korlát.</li></ul>`},

{ex:1,n:14,topic:"integ",tag:"kvadratúra-együtthatók",
 q:R`Melyik a helyes összefüggés egy $\sum A_k f(x_k)$ interpolációs kvadratúra együtthatóira?`,
 opts:[O("a","$A_k=\\int_a^b\\frac{\\omega_n(x)}{x-x_k}dx$"),O("b","$A_k=\\int_a^b\\frac{\\omega_n(x)}{x_k-x_n}dx$"),O("c","$A_k=c\\int_a^b\\frac{\\omega_n(x)}{x-x_k}dx$, $c\\ne0$ konstans"),O("d","$A_k=c\\int_a^b\\omega_n(x)dx$, $c\\ne0$")],
 ans:"c", anstext:"A_k=∫ℓ_k, és 1/ω′(x_k) a konstans.",
 exp:R`$A_k=\int_a^b L_k(x)dx$, ahol $L_k=\frac{\omega_n(x)}{(x-x_k)\omega_n'(x_k)}$, és $\frac{1}{\omega_n'(x_k)}$ konstans. <ul><li><b>a)</b> hiányzik a konstans. <b>b)</b> a nevezőben $(x-x_k)$ kell. <b>d)</b> az osztás nem hagyható el.</li></ul>`},

{ex:2,n:5,topic:"integ",tag:"pontos kvadratúra",
 q:R`Melyik formula adja meg <b>biztosan pontosan</b> a $\int_2^8 (x^2+2)\,dx$ integrált?`,
 opts:[O("a","érintő (középponti)"),O("b","trapéz"),O("c","Simpson"),O("d","mindhárom")],
 ans:"c", anstext:"a Simpson pontossági foka 3, így másodfokúra pontos.",
 exp:R`Az integrandus másodfokú; a Simpson pontossági foka 3, így pontos (180). Az érintő- és trapézformula foka csak 1, ezért másodfokúra nem pontos (162, ill. 216).`},

{ex:2,n:12,topic:"integ",tag:"trapéz részintervallumok",
 q:R`Az összetett trapéz-szabálynál ($n$ részintervallum) melyik teljesül?`,
 opts:[O("a","$n$ csak páros lehet."),O("b","$n$ csak páratlan lehet."),O("c","$n$ bármilyen pozitív egész lehet."),O("d","$n$ csak 4-gyel osztható lehet.")],
 ans:"c", anstext:"a trapéznál nincs paritási megkötés.",
 exp:R`A trapézszabálynál nincs paritási megkötés ($n$ bármilyen pozitív egész). (A Simpson-összetettnél kell páros $m$.) <br><i>Megjegyzés: a feladat „másodfokú polinom”-ot ír, de a trapéz valójában lineáris szakaszokkal közelít — ez pontatlanság a feladatban.</i>`}
];

/* ---------------- Áttekintés (overview) ---------------- */
var OVERVIEW_HTML = R`<h2 class="htop">Áttekintés</h2>
<p class="lead">A vizsga felépítése, az 1 napos terv, és a haladásod összesítője.</p>
<div class="callout"><div class="h">A vizsga felépítése</div>
<p>2 vizsga, mindkettő <b>15 feleletválasztós kérdés</b>, kérdésenként <b>1 pont</b>, pontosan egy helyes válasz. Pontozás (a lap fejléce szerint): <b>0–7</b> elégtelen (1), <b>8–11</b> elégséges (2), <b>12–15</b> közepes (3). Legalább elégséges írásbeli után jelentkezhetsz szóbelire.</p></div>

<div class="callout"><div class="h">Hogyan használd (1 napos terv)</div>
<ol>
<li><b>Délelőtt — alapok:</b> 1–4. lecke (gépi szám, hibák, LER/Gauss/LU, normák). Olvasd, majd a „→” gombbal ugorj a kérdésekhez, és <b>tippelj előbb</b>.</li>
<li><b>Kora délután — közelítés:</b> 5–8. lecke (gyökkeresés, Horner, interpoláció/Csebisev, legkisebb négyzetek).</li>
<li><b>Késő délután — integrálás + átismétlés:</b> 9. lecke, majd kapcsold be a <b>„Csak amit nem tudok”</b> szűrőt, és menj végig a gyenge pontokon.</li>
<li><b>Este — éles próba:</b> kapcsold ki a Tanulós módot, és oldd meg mind a 30 kérdést önállóan; az önértékelés (Tudtam/Részben/Nem) mutatja, hol állsz.</li>
</ol></div>

<div class="tablewrap"><table class="grid">
<tr><th>Témakör</th><th>1. vizsga</th><th>2. vizsga</th></tr>
<tr><td>Hibaszámítás és kondicionáltság</td><td>1, 4</td><td>10</td></tr>
<tr><td>Direkt módszerek (Gauss, LU, sávmátrix)</td><td>2, 3, 10</td><td>4, 15</td></tr>
<tr><td>Vektor- és mátrixnormák</td><td>7, 12</td><td>6, 8</td></tr>
<tr><td>Lebegőpontos számábrázolás</td><td>9</td><td>2</td></tr>
<tr><td>Interpoláció</td><td>5</td><td>1, 14</td></tr>
<tr><td>Ortogonális / Csebisev-polinomok</td><td>8</td><td>11</td></tr>
<tr><td>Numerikus integrálás</td><td>6, 14</td><td>5, 12</td></tr>
<tr><td>Gyökkeresés / nemlineáris</td><td>11</td><td>3, 7</td></tr>
<tr><td>Horner-séma</td><td>13</td><td>9</td></tr>
<tr><td>Legkisebb négyzetek</td><td>15</td><td>13</td></tr>
</table></div>
<p class="lead">A két vizsga szinte párhuzamos: majdnem minden témakör mindkét lapon megjelenik — együtt jó lefedettséget adnak.</p>`;
