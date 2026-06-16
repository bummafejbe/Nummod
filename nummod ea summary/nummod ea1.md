# Numerikus módszerek C — 1. előadás: Gépi számábrázolás

> Vizsgafelkészítő összefoglaló
> A magyarázatok az elméleti, konceptuális vizsgára készülnek: a *miértre* és a finom megkülönböztetésekre helyezve a hangsúlyt.

## Mit fed le ez a PDF

Ez a tárgy **1. előadása**: kizárólag a kurzus első témakörét, a **gépi számábrázolást és a hibaszámítás alapjait** tárgyalja. Konkrétan: motiváló „furcsa jelenségek" (a lebegőpontos aritmetika hibái), a normalizált lebegőpontos számok matematikai modellje (`M(t, k⁻, k⁺)`), nevezetes gépi értékek (ε₀, ε₁, M∞), a valós→gépi leképezés (`fl` függvény) és az input hiba becslése, végül az **algoritmus stabilitásának** fogalma. A többi kurzustéma (lineáris rendszerek, gyökkeresés, interpoláció, integrálás) itt **nem** szerepel — viszont az itt tanult hibafogalmak végigkísérik az egész tárgyat, ezért alapozó anyag.

---

## 1. téma: A „furcsa jelenségek" — mit tanítanak valójában

**CORE.** A hat bevezető példa nem önmagáért érdekes; mindegyik egy-egy konkrét hibaforrást illusztrál. Ezt a leképezést érdemes fejben tartani, mert a vizsgán a jelenséget gyakran a *nevén* kérdezik.

- **sin(π) = 1.22·10⁻¹⁶** (nem 0). A π irracionális, gépre vitele után `fl(π) = π + δ`, ahol δ az input (ábrázolási) hiba. Mivel sin(π+δ) ≈ −δ, a végeredmény a bemeneti hiba *továbbterjedése*. Ez **nem** kiejtés — ez tiszta ábrázolási/kerekítési hiba propagációja.
- **Harmonikus sor (Σ 1/k).** Matematikailag divergens (→∞), a gépen mégis egy *véges* értékhez „konvergál" (~18.99 n=10⁸-ra). Oka: ha a részösszeg már nagy, egy kis 1/k tag a kerekítés miatt **elnyelődik** (a számhoz hozzáadva ugyanazt a gépi számot kapjuk). Ráadásul az „oda" és „vissza" összegzés *különböző* eredményt ad → **az összeadás sorrendje számít**. Kis-a-nagyhoz sorrend (visszafelé) pontosabb.
- **√2017 − √2016.** Két közel egyenlő szám kivonása → **jegyvesztés (kiejtés, cancellation)**: a vezető azonos számjegyek kiesnek, a relatív hiba felrobban. Az átírt alak `1/(√2017+√2016)` elkerüli a kivonást, ezért **az a pontos** (≈ 0.011135). A két kijelzett, egymástól erősen eltérő érték épp azt mutatja, hogy két matematikailag azonos képlet gépen mást ad.
- **a = 10⁻²⁰, b = 1 → a+b = 1.** a kisebb, mint b relatív felbontása, ezért elnyelődik. Majd: **(a+b)−b = 0**, de **a+(b−b) = 10⁻²⁰**. Tehát az **összeadás nem asszociatív** a gépen!
- **cosh(20) − sinh(20) = exp(−20).** Direktben cosh(20) és sinh(20) is ≈ exp(20)/2, két óriási közel egyenlő szám kivonása → teljes kiejtés, az eredmény **0**. Az exp(−20) közvetlenül **2.06·10⁻⁹** (a helyes). Megint kiejtés.
- **Tₙ = ∫₀¹ xⁿ/(x+10) dx rekurzióval.** A felfelé futó `Tₙ = 1/n − 10·Tₙ₋₁` **instabil** (a hiba lépésenként ×10), 20 lépés után értelmetlen (7.48·10³). A lefelé futó `Tₙ₋₁ = (1/n − Tₙ)/10` **stabil** (a hiba ÷10), a helyes ~0.0043-at adja.

**Vizsgára fontos**

- A kiejtés (jegyvesztés) **a műveletet** terheli, nem a számokat: közel egyenlő számok **kivonása** veszélyes. Megoldás: a kifejezés átalakítása.
- Az összeadás **kommutatív, de NEM asszociatív** gépen; a disztributivitás sem teljesül.
- Egy *divergens* sor gépen véges értékre állhat be a kis tagok elnyelődése miatt.
- Ugyanaz a rekurzió az egyik irányban stabil, a másikban nem — ez a hibaszorzó tényezőn (|szorzó| <1 vagy >1) múlik.

---

## 2. téma: A lebegőpontos számok modellje

**CORE.** Egy gépi szám normalizált alakja:

> **a = ±m · 2ᵏ**, ahol m = Σᵢ₌₁ᵗ mᵢ·2⁻ⁱ, m₁ = 1, mᵢ ∈ {0,1}.

- **m a mantissza**, hossza **t** bit. A **m₁ = 1** kikötés a *normalizáltság*: a vezető bit mindig 1. Ennek két célja van: (1) **egyértelmű** ábrázolás (egy számnak egy alakja), (2) maximális kihasználtság (nincs „pazarló" vezető 0).
- **k a karakterisztika (kitevő)**, k⁻ ≤ k ≤ k⁺ korlátok között.
- Jelölés: a = ±[m₁…mₜ | k].

A gépi számok halmaza adott (t, k⁻, k⁺) mellett:

> **M(t, k⁻, k⁺) = { ±2ᵏ·Σ mᵢ2⁻ⁱ : k⁻≤k≤k⁺, m₁=1 } ∪ {0}.**

A 0-t külön hozzá kell venni, mert a m₁=1 kikötés miatt önmagában nem áll elő. A gyakorlatban még van ∞, −∞, NaN is.

*Kiegészítés (tankönyvi):* a valós szabványban (IEEE 754) `float ~ M(23, −128, 127)`, `double ~ M(52, −1024, 1023)` — a t = 52 bit mantissza adja a double ~16 tizedesjegyes pontosságát (2⁻⁵² ≈ 2.2·10⁻¹⁶, innen jön a sin(π) példa nagyságrendje).

**Vizsgára fontos**

- A normalizáltság (m₁=1) **az egyértelműséget** biztosítja, és ebből következik, hogy ½ ≤ m < 1.
- A {0} elemet **külön** vesszük hozzá; a m₁=1 miatt magából a képletből nem jön ki.
- A modell három paramétere: t (pontosság/sűrűség), k⁻ (alsó kitevő → legkisebb szám), k⁺ (felső kitevő → legnagyobb szám).

---

## 3. téma: Nevezetes gépi értékek

**CORE.** Ezeket gyakran kérdezik képlettel és értelmezéssel is.

- **½ ≤ m < 1** — a normalizáltság közvetlen következménye (a vezető 1-es bit ½-et ér).
- **M szimmetrikus a 0-ra** (a ± előjel miatt).
- **ε₀ = legkisebb pozitív gépi szám** = [10…0 | k⁻] = ½·2^{k⁻} = **2^{k⁻−1}**. Ez az **alulcsordulási küszöb**: ami ennél kisebb abszolút értékű, az 0-ra kerekül.
- **ε₁ = gépi epszilon** = az 1 utáni gépi szám és az 1 különbsége = **2^{1−t}**. Ez a **relatív felbontás** mértéke az 1 körül.
- **M∞ = legnagyobb gépi szám** = [11…1 | k⁺] = **(1 − 2⁻ᵗ)·2^{k⁺}**. Efölött **túlcsordulás** (Inf).
- **Számosság:** |M| = 2·2^{t−1}·(k⁺ − k⁻ + 1) + 1. (A 2 az előjel, 2^{t−1} a lehetséges mantisszák száma rögzített m₁=1 mellett, (k⁺−k⁻+1) a kitevők száma, +1 a nulla.)

### Példa: M(3, −1, 2)

- Elemek alakja: ± 0.1__ · 2ᵏ, ahol −1 ≤ k ≤ 2.
- k = 0 esetén: 0.100, 0.101, 0.110, 0.111, azaz 1/2, 5/8, 6/8, 7/8.
- ε₀ = 2^{−1−1} = 2⁻² = 1/4 = 0.25
- ε₁ = 2^{1−3} = 2⁻² = 1/4 = 0.25
- M∞ = (1 − 2⁻³)·2² = (7/8)·4 = 3.5
- |M| = 2·2²·(2−(−1)+1) + 1 = 2·4·4 + 1 = 33

**NUANCE — a klasszikus csapda: ε₀ vs ε₁.** Ezt nagyon könnyű összekeverni, és pont ezen buktatnak:

- **ε₀** a *legkisebb pozitív szám* (alulcsordulás), a **k⁻**-tól függ (a kitevő alsó korlátjától).
- **ε₁** a *gép epszilon* (relatív pontosság 1 körül), a **t**-től függ (a mantisszahossztól), a kitevőtől **független**.
- A `M(3,−1,2)` példában történetesen mindkettő ¼ — ez **véletlen egybeesés** (2^{k⁻−1} = 2⁻² és 2^{1−t} = 2⁻²), nem általános szabály! Erre építhetnek megtévesztő kérdést.

**Vizsgára fontos**

- ε₀ → alulcsordulás, k⁻-tól függ; ε₁ → relatív pontosság, t-től függ. Ne keverd!
- A két végszám: ε₀ = 2^{k⁻−1} (legkisebb pozitív), M∞ = (1−2⁻ᵗ)·2^{k⁺} (legnagyobb).
- A számosságképletben a 2^{t−1} a *rögzített vezető 1-es* miatt van (nem 2ᵗ).

---

## 4. téma: Valós szám → gépi szám (az `fl` függvény és az input hiba)

**CORE.** Az ábrázolható tartomány: **R_M = { x ∈ ℝ : |x| ≤ M∞ }**. Az **input (bemeneti) függvény** rendel minden ábrázolható valós számhoz egy gépi számot:

> fl(x) = 0, ha |x| < ε₀ (alulcsordulás);
> fl(x) = x̃ (az x-hez legközelebbi gépi szám, kerekítés), ha ε₀ ≤ |x| ≤ M∞.

Már önmagában az, hogy egy valós számot gépre viszünk, **hibát okoz** — ez az **input hiba** (egyfajta kerekítési hiba). A tétel az **abszolút** hibát korlátozza:

> |x − fl(x)| ≤ ε₀, ha |x| < ε₀;
> |x − fl(x)| ≤ ½·|x|·ε₁, ha ε₀ ≤ |x| ≤ M∞.

A **következmény** a lényegi állítás — a **relatív** hibára:

> |x − fl(x)| / |x| ≤ ½·ε₁ = **2⁻ᵗ**.

**Ez a numerikus matek egyik kulcsmondata:** a relatív ábrázolási hiba **kizárólag t-től** függ (a mantisszahossztól), és **független a szám nagyságrendjétől**. Ezért jó a lebegőpontos rendszer: az *abszolút* hiba ugyan nő nagy számokra, de a *relatív* pontosság egyenletes.

A bizonyítás veleje (érdemes az intuíciót érteni): egy binádon belül két szomszédos gépi szám távolsága **2^{k−t}**. x legfeljebb ennek a felénél van a közelebbitől → |x − fl(x)| ≤ ½·2^{k−t}. Mivel |x| ≥ ½·2ᵏ (a normalizáltság miatt), a kettő hányadosa ≤ 2⁻ᵗ.

**NUANCE — a gépi számok NEM egyenletesen helyezkednek el.** A 2^{k−t} távolság a kitevővel **duplázódik**: a 0 közelében sűrűek, távol ritkák (lásd az M(4,−2,3) ábráját). Ezért beszélünk *relatív* hibáról: a felbontás arányos a szám nagyságával. Tipikus csapda: „az abszolút input hiba minden x-re ugyanannyi" → **hamis**; az abszolút hiba |x|-szel arányosan nő, a relatív állandó.

**Vizsgára fontos**

- `fl(x)` a **legközelebbi** gépi szám; |x|<ε₀ esetén 0 (alulcsordulás), |x|>M∞ esetén túlcsordulás (a tétel csak R_M-en érvényes).
- A **relatív** input hiba korlátja ½·ε₁ = 2⁻ᵗ, **csak t-től függ**.
- Az **abszolút** hiba ∝ |x| (nagy számra nagyobb), a **relatív** egyenletes — mert a gépi számok logaritmikusan, nem egyenletesen sűrűsödnek.

---

## 5. téma: Hibajelenségek mélyebben — jegyvesztés és sorrend

**CORE / NUANCE.** A 4. témáig minden a *bemenet* hibájáról szólt. A *műveletek* külön hibát visznek be, és van egy különösen veszélyes:

- **Jegyvesztés / kiejtés (cancellation):** két közel egyenlő szám kivonásakor a megegyező vezető jegyek kiesnek, és az eredmény relatív hibája drámaian megnő. A kivonás abszolút hibája kicsi marad, de mivel az eredmény is kicsi, a *relatív* hiba felrobban. Fontos: a kivonás maga nem „ront el" semmit — csak **láthatóvá teszi** a bemenetekben már bennlevő apró hibákat. Kezelés: a képlet átírása (gyöktelenítés, exp(−20) közvetlen számítása stb.).
- **Összegzési sorrend és elnyelődés:** nagy futó összeghez kis tagot adva a kis tag (részben) elveszhet. Sok kis tagot **növekvő sorrendben** (kicsitől a nagyig) érdemes összegezni.

*Kiegészítés (a vizsga kedvelt fogalompárja, a slide-ok nem definiálják explicit):* különböztesd meg a **kerekítési hibát** (gépi számábrázolásból és műveletekből — ez a mostani anyag) a **képlethibától / csonkítási hibától** (abból ered, hogy egy végtelen folyamatot, pl. sort vagy integrált, véges képlettel közelítünk). A kettő összege a teljes hiba; gyakran ellentétesen viselkednek (több lépés csökkenti a képlethibát, de növelheti a felhalmozott kerekítési hibát).

**Vizsgára fontos**

- Kiejtés = **közel egyenlő számok kivonása**; nem új hibát szül, hanem a meglévő relatív hibát robbantja fel.
- Kezelés mindig **algebrai átírás**, nem nagyobb pontosság.
- Kerekítési hiba ≠ képlethiba (csonkítási hiba) — gyakori fogalmi kérdés.

---

## 6. téma: Algoritmus stabilitása

**CORE.** Két definíció:

- **Numerikus algoritmus:** aritmetikai és logikai műveletek **véges** sorozata.
- **Stabil algoritmus:** létezik C > 0 konstans, hogy a kétféle B₁, B₂ bemenetből kapott K₁, K₂ kimenetekre **‖K₁ − K₂‖ ≤ C·‖B₁ − B₂‖**. Vagyis a bemenet kis változása csak **korlátosan** (C-szeresen) változtatja a kimenetet; a hiba nem nagyítódik fel kontrollálatlanul.

Az intuíció a Tₙ-példából: a felfelé futó rekurzióban minden lépés ×10-zel szorozza a hibát → 20 lépés után 10²⁰-szoros felnagyítás → **instabil**. Lefelé ÷10-zel csillapít → **stabil**. A példa szerint a **Fibonacci-rekurzió is instabil** (gyakorlati anyag).

**NUANCE.** A stabilitás **az algoritmus tulajdonsága**, nem a feladaté. Ugyanazt a matematikai mennyiséget (T₂₀) kétféle algoritmussal számolva az egyik stabil, a másik nem — pedig a *feladat* ugyanaz. (A feladat saját érzékenységét — a *kondicionáltságot* — majd a lineáris rendszereknél választjuk el élesen az algoritmus stabilitásától; itt még együtt jelennek meg.)

**Vizsgára fontos**

- Stabilitás = a kimenet a bemenettől **Lipschitz-folytonosan** (C konstanssal) függ; a hiba nem nő robbanásszerűen.
- Az instabilitás tipikus oka: lépésenként **|szorzó| > 1** hibaerősítés (felfelé futó Tₙ, Fibonacci).
- Ugyanazt az értéket számoló két algoritmus közül az egyik lehet stabil, a másik nem.

---

## Önellenőrző kérdések (vizsgastílus, a finom pontokra)

**1.** Az `M(t, k⁻, k⁺)` rendszerben a valós számok gépre vitelekor a **relatív** input hiba korlátja:
A) k⁻-tól függ  B) k⁺-tól függ  C) csak t-től függ  D) |x|-től függ

> **Megoldás: C.** A relatív hiba ≤ ½·ε₁ = 2⁻ᵗ, a kitevőtől és a szám nagyságától független.

**2.** Melyik állítás **igaz** a gépi aritmetikára?
A) Az összeadás asszociatív  B) Az összeadás kommutatív, de nem feltétlenül asszociatív  C) A kivonás mindig pontos  D) A disztributivitás teljesül

> **Megoldás: B.** Az (a+b)−b ≠ a+(b−b) példa épp az asszociativitás bukását mutatja; a kommutativitás megmarad.

**3.** A √2017 − √2016 közvetlen kiszámítása azért problémás, mert:
A) túlcsordulás lép fel  B) alulcsordulás lép fel  C) közel egyenlő számok kivonása jegyvesztést okoz  D) a gyökvonás nem ábrázolható

> **Megoldás: C.** Kiejtés; az `1/(√2017+√2016)` átírás kerüli el a kivonást.

**4.** A `Tₙ = 1/n − 10·Tₙ₋₁` felfelé futó rekurzió instabil, mert:
A) T₀ rosszul számolt  B) a hiba lépésenként ~10-szeresére nő  C) az integrál divergens  D) a kerekítés mindig lefelé csonkít

> **Megoldás: B.** A |−10| > 1 szorzó miatt a kezdeti apró hiba 20 lépés alatt ~10²⁰-szorosára nagyítódik.

**5.** Az ε₀ és ε₁ értékekről melyik **hamis**?
A) ε₀ a legkisebb pozitív gépi szám  B) ε₁ az 1 és a rákövetkező gépi szám különbsége  C) ε₀ = 2^{k⁻−1}, ε₁ = 2^{1−t}  D) ε₀ és ε₁ mindig egyenlő

> **Megoldás: D.** Csak speciális (t, k⁻) párnál esnek egybe (pl. M(3,−1,2)); általában különböznek.

**6.** A gépi számok a számegyenesen:
A) egyenletesen helyezkednek el  B) a 0 közelében sűrűbbek, távol ritkábbak  C) a 0 közelében ritkábbak, távol sűrűbbek  D) egyenlő logaritmikus *és* lineáris távolságban vannak

> **Megoldás: B.** A szomszédos gépi számok távolsága 2^{k−t}, ami a kitevővel duplázódik → relatív (nem abszolút) felbontás állandó.
