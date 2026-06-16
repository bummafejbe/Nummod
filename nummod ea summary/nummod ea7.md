# Numerikus módszerek — 7. előadás: A Newton-módszer és társai

> **Mit fed le ez a PDF?** A teljes kurzus „Nemlineáris egyenletek megoldása" témaköréből a **Newton-módszert** (levezetés, két konvergenciatétel, hibaviselkedés), a **húrmódszert** és a **szelőmódszert**, valamint ezek **többváltozós általánosítását** (Jacobi-mátrixos Newton-módszer). Az intervallumfelezést és a fixpont-iterációt csak *előfeltételként* említi (a Banach-fixponttételre hivatkozik), részletesen nem tárgyalja — ezek külön előadás anyagai.
>
> A hangsúly végig **a konvergencia feltételein és rendjén** van: ki melyik feltétel mellett, milyen gyorsan és mikor *nem* konvergál. Pont ezek a klasszikus A/B/C/D csapdák.

---

## 0. A megoldandó feladat (CORE — gyors alap)

Adott egy $f:\mathbb{R}\to\mathbb{R}$ nemlineáris függvény, és keressük a **gyökét** (zérushelyét):

$$f(x^*) = 0, \qquad x^* = ?$$

Három dolgot kérdezhetünk: **létezik-e** gyök, **hány** van, és **hol**. Az itt tárgyalt módszerek mind **iterációk**: egy $x_0$ kezdőpontból (a szelőnél kettőből) generálnak egy $(x_k)$ sorozatot, amely jó esetben a gyökhöz tart. A különbség a módszerek között az, **hogyan számolják ki a következő közelítést**, és **milyen feltételek mellett, milyen gyorsan konvergálnak**.

---

## 1. A Newton-módszer (CORE)

### Az ötlet — kétféle levezetés, ugyanaz az eredmény

**Geometriai kép (ezt érdemes fejben tartani):** Vegyük az $f$ függvény érintőjét az aktuális $x_k$ pontban. Az érintő egy egyenes, annak a zérushelyét (ahol metszi az $x$-tengelyt) könnyű kiszámolni — *ez* lesz a következő közelítés, $x_{k+1}$. Vagyis a görbe gyökét a görbe **érintőjének** gyökével közelítjük.

Az $x_k$-beli érintő egyenlete $y - f(x_k) = f'(x_k)(x - x_k)$. Ahol $y=0$:

$$\boxed{\,x_{k+1} = x_k - \dfrac{f(x_k)}{f'(x_k)}\,}\qquad (k=0,1,2,\dots)$$

**Analitikus kép (ugyanez Taylor-ral):** Az $f$ gyökét az $x_k$ körüli **elsőfokú Taylor-polinom** gyökével közelítjük:
$$0 = f(x) \approx f(x_k) + f'(x_k)(x - x_k)\ \Rightarrow\ x = x_k - \frac{f(x_k)}{f'(x_k)}.$$
A két megközelítés **ugyanazt a képletet** adja — ez nem véletlen, az érintő épp az elsőfokú Taylor-polinom grafikonja. Vizsgán szeretik kérdezni, hogy „mit közelítünk Newton-módszernél" — a válasz: a függvényt az **elsőfokú** (lineáris) Taylor-polinomjával / az érintőjével.

### A konvergencia rendje

A Newton-módszer **általában másodrendben (kvadratikusan) konvergens**. Ez a módszer fő erénye: a helyes számjegyek száma lépésenként nagyjából **megduplázódik**. Ez a „másodrendű" a kulcsszó — lásd a két tételt lent, ahol pontosan kiderül, mikor és miért.

---

### 1/a. Tétel — Monoton konvergencia (CORE)

Ez a tétel **globálisabb**: nem azt mondja, hogy „elég közelről induljunk", hanem geometriai feltételeket ad, amelyek mellett **garantáltan, ráadásul monoton módon** odatalálunk.

> **Feltételek.** Ha $f \in C^2[a;b]$ (kétszer folytonosan deriválható), és
> 1. $\exists\, x^*\in[a;b]:\ f(x^*)=0$ — **van gyök** az intervallumon,
> 2. $f'$ **és** $f''$ **állandó előjelű** $[a;b]$-n (a függvény szig. monoton **és** végig konvex vagy végig konkáv),
> 3. a kezdőpontra $f(x_0)\cdot f''(x_0) > 0$,
>
> **akkor** az $x_0$-ból indított Newton-sorozat **monoton konvergál** $x^*$-hoz.

**Mit jelent a 3. feltétel intuitívan?** Ez választja ki, **melyik végéről** induljunk. Azt az oldalt kell választani, ahol a függvényérték és a görbület „egy irányba mutat" (előjelük egyezik). Innen indulva az érintő mindig a gyök *ugyanazon* oldalán marad, így a sorozat **nem ugorhat át** a gyökön, hanem szépen, monoton közeledik. A rossz végéről indulva az első lépés átdobhat minket — onnantól a konvergencia nem garantált a tétel által.

**A 4 eset.** A $f'>0/f'<0$ és $f''>0/f''<0$ kombinációkból négy geometriai kép adódik (növő-konvex, növő-konkáv, fogyó-konvex, fogyó-konkáv); a bizonyítást a jegyzet csak az $f'>0,\,f''>0$ esetre írja le, a többi „hasonló".

**A bizonyítás logikája (érdemes érteni, nem magolni):**
1. A 3. feltételből $f(x_0)>0$. Taylor másodfokú maradéktaggal megmutatja, hogy **minden** $k$-ra $f(x_k)>0$ (mert a maradéktag $\frac{f''(\xi_k)}{2}(x_{k+1}-x_k)^2 > 0$, a lineáris rész pedig a Newton-definíció miatt 0).
2. A sorozat **monoton fogyó** ($x_{k+1}=x_k - \underbrace{f(x_k)/f'(x_k)}_{>0} < x_k$) és **alulról korlátos** ($x^* < x_k$, mert $f$ szig. nő és $f(x_k)>0=f(x^*)$). Monoton + korlátos $\Rightarrow$ **konvergens**, legyen $\hat x$ a határérték.
3. Megmutatja, hogy $f(\hat x)=0$, és mivel $f$ szig. monoton, csak egy gyök van, így $\hat x = x^*$.

---

### 1/b. Tétel — Lokális konvergencia (CORE — ez adja a másodrendet és a hibabecslést)

Ez a tétel **gyengébb feltételeket** kér ($f''$-re nem ír elő előjelet), cserébe azt kívánja, hogy **elég közelről** induljunk. Ez adja a híres másodrendű hibabecslést.

> **Feltételek.** Ha $f \in C^2[a;b]$, és
> 1. $\exists\, x^*\in[a;b]:\ f(x^*)=0$,
> 2. $f'$ **állandó előjelű** (csak $f'$, $f''$-t itt nem kötjük meg!),
> 3. $m_1 = \min_{x\in[a;b]} |f'(x)| > 0$ — a derivált **elszakad a nullától** (alulról korlátos),
> 4. $M_2 = \max_{x\in[a;b]} |f''(x)| < +\infty$, ebből $M := \dfrac{M_2}{2 m_1}$,
> 5. a kezdőpont **elég közel** van: $|x_0 - x^*| < r := \min\Big\{ \tfrac{1}{M},\ |x^*-a|,\ |x^*-b| \Big\}$,
>
> **akkor** a Newton-módszer **másodrendben** konvergál a gyökhöz, és érvényes a
> $$\boxed{\,|x_{k+1} - x^*| \le M\cdot |x_k - x^*|^2\,}$$
> **hibabecslés.**

**Röviden:** *„Ha elég közelről indulunk, akkor gyorsan odatalálunk."* A hibabecslés azt mondja: az új hiba a régi hiba **négyzetével** arányos — ezért duplázódik a pontosság.

**A bizonyítás kulcslépése:** Taylor-formula $x_k$ középponttal, az $x^*$ helyen kiértékelve, másodfokú maradéktaggal:
$$0 = f(x^*) = f(x_k) + f'(x_k)(x^*-x_k) + \tfrac{f''(\xi_k)}{2}(x^*-x_k)^2.$$
Elosztva $f'(x_k)$-val és átrendezve épp megjelenik a $x_{k+1}-x^* = \frac{f''(\xi_k)}{2f'(x_k)}(x^*-x_k)^2$ összefüggés, ahonnan az abszolútértékekre $|x_{k+1}-x^*|\le \frac{M_2}{2m_1}|x_k-x^*|^2 = M|x_k-x^*|^2$.

**Miért pontosan másodrendű (nem csak „legalább")?** A hányadosok határértéke
$$\lim_{k\to\infty} \frac{|x_{k+1}-x^*|}{|x_k-x^*|^2} = \frac{|f''(x^*)|}{2|f'(x^*)|} \ne 0,$$
ha $f''(x^*)\ne 0$ — tehát a sorozat **pontosan** másodrendű. (Ha történetesen $f''(x^*)=0$ is, akkor még magasabb rendű is lehet.)

**Két tétel viszonya (gyakori csapda!):**
- A **monoton** tétel **mindkét** deriváltra ($f'$ és $f''$) előjelfeltételt kér, és a kezdőpontot a $f\cdot f''>0$ szabály választja ki — cserébe nem kell „elég közel" lenni, az egész $[a;b]$-ről indulhatunk.
- A **lokális** tétel **csak $f'$**-re ír elő előjelet (+ a deriváltak korlátai), viszont **közeli** kezdőpontot követel.
- **Mindkettő másodrendű konvergenciát ad.** A monoton tétel feltételei mellett is másodrendű lesz a vége, „hiszen előbb-utóbb elég közel kerülünk a gyökhöz".

> ### Vizsgára fontos (Newton, alaprész)
> 1. **Képlet és értelmezés:** $x_{k+1}=x_k - f(x_k)/f'(x_k)$ = az **érintő** (= elsőfokú Taylor-polinom) zérushelye.
> 2. **Rend:** általában **másodrendű** (kvadratikus), a hibabecslés $|x_{k+1}-x^*|\le M|x_k-x^*|^2$.
> 3. **Monoton tétel:** $f',f''$ állandó előjelű + $f(x_0)f''(x_0)>0$ $\Rightarrow$ monoton, globális konvergencia.
> 4. **Lokális tétel:** csak $f'$ állandó előjelű + $m_1>0$, $M_2<\infty$ + elég közeli $x_0$ $\Rightarrow$ másodrendű. **A két tétel feltételeit ne keverd össze!**

---

### 1/c. A Newton-módszer buktatói és finomságai (NUANCE — ez a csapdamező)

Ez a rész szinte teljes egészében „igaz/hamis, kivéve…" típusú vizsgakérdés-bánya. Egyenként:

- **$f'(x_k)=0$ esetén $x_{k+1}$ nincs értelmezve** (0-val osztanánk). Geometriailag: vízszintes érintőnek nincs metszéspontja az $x$-tengellyel (vagy a végtelenben van).

- **Többszörös gyöknél romlik a konvergencia.** Ha $x^*$ **többszörös** gyök, akkor $f'(x^*)=0$, és a gyök közelében a Newton-lépés $\frac{f(x_k)}{f'(x_k)}$ **$\frac{0}{0}$ alakú** osztássá fajul. Ekkor a konvergencia **csak elsőrendű** (lineáris), vagy akár instabillá válik. Vagyis a **másodrendűség előfeltétele az egyszeres gyök** ($f'(x^*)\ne 0$).

- **Javítások többszörös gyökre** (két klasszikus):
  - Alkalmazzuk a Newton-módszert a $g(x):=\dfrac{f(x)}{f'(x)}$ függvényre — ennek $x^*$ **egyszeres** gyöke, így visszakapjuk a másodrendet.
  - Ha tudjuk, hogy $x^*$ **$r$-szeres** gyök, használjuk a módosított iterációt $x_{k+1}:=x_k - r\cdot\dfrac{f(x_k)}{f'(x_k)}$ — ez is **másodrendű**.

- **Magasabb rend.** Bizonyos esetekben a Newton akár **harmadrendű** is lehet (vö. magasabbrendű konvergencia tétel). Ha a lokális tételt a $\varphi(x):=x-\frac{f(x)}{f'(x)}$ fixpont-leképezésre a magasabbrendű konvergencia tételen át bizonyítanánk, **$f\in C^3[a;b]$**-t kellene feltennünk (eggyel erősebb simaság, mint a $C^2$).

- **Más nevek:** a módszert **Newton–Raphson**-, illetve **Newton–Fourier**-módszernek is hívják.

- **Nincs garancia konvergenciára!** A Newton-módszer **nem feltétlenül konvergál**:
  - rossz helyről indítva **divergálhat**,
  - pontos számolás mellett **ciklusba** is eshet (két érték között oszcillál),
  - a gyökök „vonzásterületein" kívül **kaotikus / fraktálszerű** viselkedés jelenik meg.
  Ezért a Newton-módszer **lokális** módszer: gyors, de nem „bolondbiztos". Ezzel áll szemben pl. az intervallumfelezés, amely lassú, de bracketelés miatt mindig konvergál.

> ### Vizsgára fontos (Newton, finomságok)
> 1. **$f'(x_k)=0$** $\Rightarrow$ a lépés nincs értelmezve.
> 2. **Többszörös gyök** $\Rightarrow$ $f'(x^*)=0$, a konvergencia **csak elsőrendű** / instabil; javítható $f/f'$-re alkalmazva vagy $r\cdot f/f'$ szorzóval.
> 3. A Newton **nem garantáltan** konvergál: divergencia, ciklus, kaotikus jelenségek lehetségesek.
> 4. Másodrendűség $\Leftrightarrow$ **egyszeres** gyök ($f'(x^*)\ne 0$).

---

## 2. Húrmódszer (regula falsi) (CORE + NUANCE)

### Az alapötlet — egyenes két ponton át

A Newton érintőt használ (egy pont + derivált). A húr- és szelőmódszer **szelőt** (két ponton átmenő egyenest) használ, **deriváltszámítás nélkül** — ez a fő gyakorlati előny, ha $f'$ drága vagy nem ismert.

Emlékeztető: a $(a, f(a))$ és $(b, f(b))$ pontokon átmenő egyenes meredeksége $\frac{f(a)-f(b)}{a-b}$, zérushelye pedig
$$x = a - \frac{f(a)\,(a-b)}{f(a)-f(b)}.$$
Ez a „két ponton átmenő egyenes zérushelye" képlet adja az iterációt.

### Definíció

> Az $f\in C[a;b]$ függvényre, ha **$f(a)\cdot f(b) < 0$** (a két végpontban ellenkező előjelű — tehát biztosan van köztük gyök), a húrmódszer:
> $$x_0 := a,\quad x_1 := b,\qquad x_{k+1} = x_k - \frac{f(x_k)\,(x_k - x_s)}{f(x_k) - f(x_s)},$$
> ahol $s$ a **legnagyobb olyan index, amelyre $f(x_k)\cdot f(x_s) < 0$**.

**A kulcs az $s$ index.** A húrmódszer mindig **megtartja az ellenkező előjelű pontot**. Ez azt jelenti, hogy a gyököt **mindvégig közrefogja** (bracketeli) — ez egy **megbízható** (mindig konvergáló) módszer. Tipikus, hogy az egyik végpont „beragad" (sok lépésen át ugyanaz marad), mert az csak azt az oldalt képviseli — ezért a konvergencia lassú.

### Tétel — a húrmódszer konvergenciája

> Ha $f\in C^2[a;b]$, és
> 1. $f(a)\cdot f(b) < 0$,
> 2. $M\cdot(b-a) < 1$,
>
> akkor a húrmódszer **elsőrendben** konvergál az $x^*$ gyökhöz, és
> $$|x_k - x^*| \le \frac{1}{M}\,\big(M\cdot|x_0 - x^*|\big)^{k},$$
> ahol $M = \frac{M_2}{2 m_1}$ ugyanúgy, mint a Newton-tételeknél. *(A bizonyítás a jegyzetben nincs.)*

A hibabecslés geometriai sorral csökken (`(M|x_0-x*|)^k`), ami a **lineáris (elsőrendű)** konvergencia ismertetőjele — szemben a Newton négyzetes csökkenésével.

> ### Vizsgára fontos (húrmódszer)
> 1. **Bracketing-módszer:** kell $f(a)f(b)<0$, és **megtartja** az ellenkező előjelű pontot $\Rightarrow$ mindig közrefogja a gyököt, megbízhatóan konvergál.
> 2. **Rend: elsőrendű (lineáris)** — lassú, de stabil. Nem kell derivált.
> 3. Konvergenciafeltétel: $f\in C^2$, $f(a)f(b)<0$, $M(b-a)<1$.

---

## 3. Szelőmódszer (secant) (CORE + NUANCE)

### Definíció

> Az $f\in C[a;b]$ függvényre, két kezdőpontból $x_0, x_1\in[a;b]$:
> $$x_{k+1} = x_k - \frac{f(x_k)\,(x_k - x_{k-1})}{f(x_k) - f(x_{k-1})}\qquad (k=1,2,\dots).$$

A képlet **majdnem ugyanaz**, mint a húrmódszeré, de a döntő különbség: a szelőmódszer **mindig az utolsó két pontot** ($x_k$ és $x_{k-1}$) használja, **nem** törődve az előjelekkel. Tehát **nem garantálja** a bracketinget — emiatt **divergálhat**, viszont ha konvergál, akkor gyorsabb.

### Tétel — a szelőmódszer konvergenciája

> Ha $f\in C^2[a;b]$, és
> 1. $\exists\, x^*\in[a;b]:\ f(x^*)=0$,
> 2. $f'$ **állandó előjelű**,
> 3. $x_0, x_1\in[a;b]$ mindkettő elég közeli: $|x_0-x^*|,\,|x_1-x^*| < r := \min\{\tfrac1M, |x^*-a|, |x^*-b|\}$,
>
> akkor a szelőmódszer
> $$p = \frac{1+\sqrt 5}{2} \approx 1{,}618$$
> **rendben** (az aranymetszés arányában) konvergál az $x^*$ gyökhöz. *(Bizonyítás nincs.)*

Ez **szuperlineáris** rend: gyorsabb az elsőrendűnél (húr, fixpont), de lassabb a Newton másodrendűnél. Az $f'$ állandó előjele lényegében az egyszeres gyököt biztosítja, mint a Newtonnál.

> ### Vizsgára fontos (szelőmódszer)
> 1. **Nem bracketel:** mindig az **utolsó két pontot** használja $\Rightarrow$ nem garantáltan közrefogja a gyököt, **divergálhat**.
> 2. **Rend:** $p=\frac{1+\sqrt5}{2}\approx 1{,}618$ (**szuperlineáris**, aranymetszés). Derivált **nem** kell.
> 3. A húrral majdnem azonos képlet — a különbség az, **melyik két pontot** veszi: szelő = utolsó kettő, húr = aktuális + utolsó ellenkező előjelű.

---

## 4. A három egyváltozós módszer összehasonlítása (a fő A/B/C/D csapda)

| Tulajdonság | **Newton** | **Húrmódszer (regula falsi)** | **Szelőmódszer** |
|---|---|---|---|
| Geometria | érintő (1 pont + derivált) | szelő, megtartott ellenkező előjelű ponttal | szelő, utolsó két ponton át |
| Kell-e $f'$? | **igen** | nem | nem |
| Hány kezdőérték? | 1 ($x_0$) | 2 (a két végpont, $a,b$) | 2 ($x_0, x_1$) |
| Bracketing (közrefogás)? | nincs | **van** (mindig megtartja az ellenkező előjelű pontot) | nincs |
| Konvergencia rendje | **másodrendű** ($p=2$) | **elsőrendű** ($p=1$) | **szuperlineáris** $p=\frac{1+\sqrt5}{2}\approx1{,}618$ |
| Megbízhatóság | gyors, de divergálhat/ciklizálhat | **lassú, de stabil** (mindig konvergál) | gyors, de divergálhat |
| Fő feltétel | $C^2$, egyszeres gyök, elég közeli $x_0$ (vagy a monoton-tétel feltételei) | $C^2$, $f(a)f(b)<0$, $M(b-a)<1$ | $C^2$, $f'$ állandó előjelű, elég közeli $x_0,x_1$ |
| Tipikus elbukás | $f'(x_k)=0$; többszörös gyök $\to$ elsőrendű | csak lassú; egyik végpont „beragad" | bracketing elvesztése $\to$ divergencia |

**A rendek emlékezetes sorrendje (lassútól gyorsig):** intervallumfelezés / fixpont / húr (elsőrendű, $p=1$) $<$ szelő ($p\approx1{,}618$) $<$ Newton ($p=2$). Ezt a sorrendet a vizsga imádja kérdezni.

**Apró, de gyakran kihasznált különbség Newton vs. szelő:** a Newton minden lépésben **két** kiértékelést igényel ($f$ **és** $f'$), a szelő csak **egyet** ($f$, az előzőt újrahasználja). Ezért „kiértékelésenkénti hatékonyságban" a szelő néha versenyképes a Newtonnal, holott a rendje kisebb.

---

## 5. Általánosítás többváltozós esetre (CORE)

### A feladat

$$F:\mathbb{R}^n\to\mathbb{R}^n,\qquad F(x)=0,\qquad x\in\mathbb{R}^n.$$
A legtöbb fenti módszer általánosítható. Az **egyszerű iteráció** $F(x)=0 \Leftrightarrow x=\Phi(x)$ alakban, a **Banach-féle fixponttétel** alapján működik (a kontrakció feltétele mellett). A leghasznosabb a többváltozós Newton.

### Többváltozós Newton-módszer

Az ötlet ugyanaz: közelítsük $F$-et az **elsőfokú Taylor-polinomjával** $x^{(k)}$ körül:
$$F(x) \approx F(x^{(k)}) + F'(x^{(k)})\cdot (x - x^{(k)}),$$
ahol $F'$ a **Jacobi-mátrix** (a parciális deriváltak mátrixa):
$$F'(x^{(k)}) = \left(\frac{\partial f_i(x^{(k)})}{\partial x_j}\right)_{i,j=1}^{n} \in \mathbb{R}^{n\times n}.$$

Ezen lineáris közelítés zérushelye lesz $x^{(k+1)}$. A gyakorlatban **nem invertálunk**, hanem egy **lineáris egyenletrendszert (LER) oldunk meg** a $s^{(k)}$ lépésvektorra:
$$F'(x^{(k)})\cdot \underbrace{(x^{(k+1)} - x^{(k)})}_{s^{(k)}} = -F(x^{(k)}),\qquad\text{majd}\qquad x^{(k+1)} = x^{(k)} + s^{(k)}.$$

Formálisan (de számolásnál kerülendő alakban):
$$\boxed{\,x^{(k+1)} = x^{(k)} - \big(F'(x^{(k)})\big)^{-1}\cdot F(x^{(k)})\,}$$

A skaláris $\frac{1}{f'(x_k)}$ szerepét itt a **Jacobi-mátrix inverze** veszi át — innen látszik, hogy az egyváltozós eset ennek $n=1$ speciális esete.

**Finomságok:**
- A módszer **javítható**, hogy ne kelljen minden lépésben deriválni és invertálni $\rightsquigarrow$ **Broyden-módszer** (kvázi-Newton): lépésenként olcsóbb, de **lassabban** konvergál.
- **Nem értelmezett** ott, ahol $\det\big(F'(x^{(k)})\big)=0$ — ez a skaláris $f'(x_k)=0$ eset többváltozós megfelelője (szinguláris Jacobi-mátrix, a LER nem oldható meg egyértelműen).
- A többváltozós Newton is **divergálhat**: pl. a rosszul választott kezdőpontból a koordinátasorozatok rossz határértékhez tarthatnak.

> ### Vizsgára fontos (többváltozós eset)
> 1. A skaláris $f'$ helyét a **Jacobi-mátrix** $F'$ veszi át; az $1/f'$-t a **mátrix inverze**.
> 2. Gyakorlatban **LER-t oldunk meg** ($F'\,s=-F$), nem invertálunk.
> 3. **$\det(F')=0$** $\Rightarrow$ nem értelmezett (a skaláris $f'=0$ analógja).
> 4. **Broyden-módszer:** elkerüli a lépésenkénti deriválást/invertálást, cserébe lassabb (kvázi-Newton).

---

## Önellenőrző kérdések (nehéz, A/B/C/D — a finomságokra hegyezve)

**1.** Melyik állítás **igaz** a Newton-módszer másodrendű konvergenciájáról?
- A) Minden folytonos $f$-re teljesül, ha van gyök.
- B) Akkor is másodrendű, ha $x^*$ kétszeres gyök.
- C) Csak akkor másodrendű, ha $f'(x^*)\ne 0$, azaz a gyök egyszeres.
- D) A másodrendűséghez $f''(x^*)=0$ szükséges.

<details><summary>Válasz</summary>

**C.** A másodrendűség előfeltétele az **egyszeres gyök** ($f'(x^*)\ne 0$); többszörös gyöknél $0/0$ adódik és a rend elsőrendűre romlik. (D fordítva van: $f''(x^*)=0$ inkább *magasabb* rendet hozhatna.)
</details>

**2.** Mi a **lényegi** különbség a húr- és a szelőmódszer között?
- A) A húr deriváltat használ, a szelő nem.
- B) A húr mindig megtartja az ellenkező előjelű (bracketelő) pontot, a szelő mindig az utolsó két pontot használja.
- C) A szelő mindig konvergál, a húr divergálhat.
- D) A két módszer iterációs képlete teljesen különböző.

<details><summary>Válasz</summary>

**B.** A képletük majdnem azonos; a különbség az, **melyik két pontot** veszik. A húr az ellenkező előjelű pontot tartja meg (bracketel $\Rightarrow$ stabil, de lassú, elsőrendű), a szelő mindig az utolsó kettőt (nem bracketel $\Rightarrow$ divergálhat, de szuperlineáris). C épp fordítva igaz; egyik sem használ deriváltat (A hamis).
</details>

**3.** A **monoton** konvergencia tétel feltételei közül melyik **nem** szerepel a **lokális** konvergencia tételben?
- A) $f\in C^2[a;b]$.
- B) Létezik gyök az intervallumon.
- C) $f''$ állandó előjelű.
- D) $f'$ állandó előjelű.

<details><summary>Válasz</summary>

**C.** A lokális tétel **csak $f'$**-re ír elő állandó előjelet (D igen), $f''$-re nem — csak korlátosságot ($M_2<\infty$) kér. A monoton tétel viszont **$f''$ állandó előjelét is** megköveteli, plusz a $f(x_0)f''(x_0)>0$ kezdőfeltételt.
</details>

**4.** Konvergenciarend szerint **növekvő** sorrendben melyik a helyes?
- A) Newton $<$ szelő $<$ húr
- B) húr $<$ szelő $<$ Newton
- C) szelő $<$ húr $<$ Newton
- D) húr $<$ Newton $<$ szelő

<details><summary>Válasz</summary>

**B.** Húr (elsőrendű, $p=1$) $<$ szelő ($p=\frac{1+\sqrt5}{2}\approx1{,}618$) $<$ Newton (másodrendű, $p=2$).
</details>

**5.** A többváltozós Newton-módszerről melyik **hamis**?
- A) A skaláris derivált helyét a Jacobi-mátrix veszi át.
- B) Gyakorlatban célszerű minden lépésben kiszámolni $F'$ inverzét.
- C) Ahol $\det(F')=0$, ott a lépés nem értelmezett.
- D) A Broyden-módszer elkerüli a lépésenkénti deriválást, de lassabb.

<details><summary>Válasz</summary>

**B (ez a hamis).** Pont **nem** invertálunk: a $F'(x^{(k)})\,s^{(k)} = -F(x^{(k)})$ **lineáris egyenletrendszert** oldjuk meg, mert az invertálás drága és numerikusan rosszabb. A többi állítás igaz.
</details>

**6.** Melyik állítás **igaz** a Newton-módszer megbízhatóságáról?
- A) Ha $f\in C^2$ és van gyök, a módszer mindig konvergál.
- B) Pontos számolás mellett is kerülhet ciklusba, és divergálhat is.
- C) Az intervallumfelezésnél mindig megbízhatóbb.
- D) Ha $f'(x_k)=0$, akkor egyszerűen a következő ponttal folytatja.

<details><summary>Válasz</summary>

**B.** A Newton **lokális** módszer: rossz kezdőpontból divergálhat, **ciklizálhat**, sőt a vonzásterületeken kívül kaotikusan viselkedhet — nincs globális garancia (A hamis). Az intervallumfelezés *bracketing* miatt mindig konvergál, így megbízhatóság szempontjából gyakran *jobb*, bár lassabb (C hamis). Ha $f'(x_k)=0$, a lépés **nincs értelmezve** (D hamis).
</details>

---

### Min menjünk mélyebbre?

Szólj, melyik részt vegyük át alaposabban — pár tipp, hol szokott elcsúszni a vizsga:

- **a két Newton-tétel feltételeinek pontos szétválasztása** (mi kell a monotonhoz, mi a lokálishoz, és miért);
- **a másodrendűség levezetése** Taylor-maradéktagból (a $|x_{k+1}-x^*|\le M|x_k-x^*|^2$ becslés lépésről lépésre);
- **húr vs. szelő vs. Newton** apró megkülönböztető kérdései (bracketing, derivált, kezdőértékek száma, rend);
- **a konvergenciarendek** közötti különbség (mit jelent pontosan az „elsőrendű / szuperlineáris / másodrendű", és hogy néz ki a hibabecslés mindegyiknél);
- **a többváltozós eset** (Jacobi-mátrix, LER-megoldás, $\det=0$, Broyden);
- vagy gyártsak **több gyakorló A/B/C/D kérdést** valamelyik altémára.
