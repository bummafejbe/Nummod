/* ===== Numerikus módszerek — tanulómotor (offline, keret nélkül) ===== */
(function(){
"use strict";
var APP="nummod";

/* ---------- KaTeX render ---------- */
function renderMath(root){
  if(typeof renderMathInElement!=="function") return;
  try{
    renderMathInElement(root,{
      delimiters:[
        {left:"$$",right:"$$",display:true},
        {left:"$",right:"$",display:false},
        {left:"\\(",right:"\\)",display:false},
        {left:"\\[",right:"\\]",display:true}
      ],
      throwOnError:false,
      macros:{"\\R":"\\mathbb{R}","\\norm":"\\lVert#1\\rVert","\\abs":"\\lvert#1\\rvert"}
    });
  }catch(e){}
}

/* ---------- hash → stabil qid ---------- */
function qhash(s){ // FNV-1a, 36-os
  var h=0x811c9dc5>>>0;
  for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,0x01000193)>>>0; }
  return h.toString(36);
}

/* ---------- Store ---------- */
var Store={
  userKey:null, displayName:null,
  data:{guesses:{},marks:{},lessons:{}},
  emptyData:function(name){return{displayName:name||"",updated:Date.now(),guesses:{},marks:{},lessons:{}};},
  key:function(){return APP+":progress:"+this.userKey;},
  loadLocal:function(){
    try{var raw=localStorage.getItem(this.key());if(raw){this.data=JSON.parse(raw);}}
    catch(e){}
    this.data.guesses=this.data.guesses||{};this.data.marks=this.data.marks||{};this.data.lessons=this.data.lessons||{};
  },
  saveLocal:function(){try{localStorage.setItem(this.key(),JSON.stringify(this.data));}catch(e){}},
  set:function(kind,id,val){
    var bag=this.data[kind]; if(!bag){bag=this.data[kind]={};}
    if(val===null){delete bag[id];}else{bag[id]=val;}
    this.data.updated=Date.now();
    this.saveLocal();
  },
  get:function(kind,id){var b=this.data[kind];return b?b[id]:undefined;}
};

/* ---------- normUserKey ---------- */
function normUserKey(name){
  return (name||"").trim().toLowerCase().replace(/[^a-z0-9áéíóöőúüű]+/g,"_").replace(/^_+|_+$/g,"")||"tanulo";
}

/* ---------- segéd ---------- */
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function esc(s){return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

/* ---------- {{id|label}} koncepció-token feloldása ---------- */
function expandConcepts(html){
  return html.replace(/\{\{([a-z0-9_]+)(\|([^}]+))?\}\}/gi,function(_,id,__,label){
    var c=C[id];var txt=label||(c?c.t:id);
    return '<span class="clink" data-c="'+id+'">'+txt+'</span>';
  });
}

/* ============================================================
   KÉRDÉSEK — fülek, témakörök, kártyák
   ============================================================ */
function buildQuestionTabs(){
  TAB_DEFS.forEach(function(tab){
    var sec=document.getElementById(tab.id);
    if(!sec) return;
    var wrap=el("div","wrap");
    wrap.appendChild(el("h2","htop",tab.htop||tab.label));
    if(tab.lead) wrap.appendChild(el("p","lead",tab.lead));
    (function(){var pr=el("button","btn rst","↺ Oldal összes válaszának törlése");
      pr.addEventListener("click",function(){var p=pr.closest("section.part");if(p)p.querySelectorAll(".topic").forEach(resetTopic);});
      wrap.appendChild(pr);})();
    tab.topics.forEach(function(tid){
      var td=TOPIC_DEFS[tid];
      var topic=el("section","topic");topic.id="t_"+tid;
      var th=el("div","th");
      th.appendChild(el("h3",null,td.t));
      var prog=el("span","prog");prog.id="prog_"+tid;
      th.appendChild(prog);
      (function(tp){var rst=el("button","btn rst","↺ Törlés");rst.title="Válaszok törlése";
        rst.addEventListener("click",function(){resetTopic(tp);});th.appendChild(rst);})(topic);
      topic.appendChild(th);
      var bar=el("div","bar");bar.innerHTML='<i id="bar_'+tid+'"></i>';topic.appendChild(bar);
      // cbar
      if(td.c&&td.c.length){
        var cbar=el("div","cbar");cbar.setAttribute("data-c",td.c.join(","));
        topic.appendChild(cbar);
      }
      // kérdések
      QUESTIONS.filter(function(q){return q.topic===tid;}).forEach(function(q){
        topic.appendChild(buildQuestionCard(q,tab.id));
      });
      wrap.appendChild(topic);
    });
    sec.appendChild(wrap);
  });
}

function buildQuestionCard(q,tabid){
  var qtext=q.q;
  var qid=tabid+"-"+qhash(q.topic+"|"+qtext);
  var card=el("div","card orig");card.setAttribute("data-qid",qid);card.setAttribute("data-kind","mcq");
  // tagrow
  var tr=el("div","tagrow");
  tr.appendChild(el("span","badge orig","Eredeti vizsga"));
  tr.appendChild(el("span","badge src",q.ex+". vizsga · "+q.n));
  if(q.tag) tr.appendChild(el("span","badge",q.tag));
  card.appendChild(tr);
  // kérdés
  card.appendChild(el("div","q",expandConcepts(qtext)));
  // opciók
  var opts=el("div","opts");
  q.opts.forEach(function(o){
    var letter=o.k;
    var btn=el("button","opt");btn.setAttribute("data-k",letter);btn.type="button";
    btn.innerHTML='<span class="ol">'+letter+')</span><span>'+expandConcepts(o.t)+'</span>';
    btn.addEventListener("click",function(){onGuess(card,q,letter);});
    opts.appendChild(btn);
  });
  card.appendChild(opts);
  // reveal
  var rev=el("div","reveal");
  var ans=el("div","ans");
  ans.innerHTML='<span class="key">Helyes válasz: '+q.ans+')</span> '+expandConcepts(q.anstext||"");
  rev.appendChild(ans);
  if(q.exp){var why=el("div","why",expandConcepts(q.exp));rev.appendChild(why);}
  card.appendChild(rev);
  // gombok
  var btns=el("div","btns");
  var showBtn=el("button","btn show-btn","Mutasd a választ");
  showBtn.addEventListener("click",function(){card.classList.toggle("show");showBtn.textContent=card.classList.contains("show")?"Elrejt":"Mutasd a választ";});
  btns.appendChild(showBtn);
  var lab=el("span","lab","Önértékelés:");btns.appendChild(lab);
  [["ok","Tudtam"],["part","Részben"],["bad","Nem tudtam"]].forEach(function(p){
    var b=el("button","btn mbtn","");b.setAttribute("data-v",p[0]);b.textContent=p[1];
    b.addEventListener("click",function(){onMark(card,qid,p[0]);});
    btns.appendChild(b);
  });
  card.appendChild(btns);
  // állapot visszatöltése
  var g=Store.get("guesses",qid);
  var mk=Store.get("marks",qid);
  if(g){applyGuess(card,q,g,false);}
  if(mk){markSel(card,mk);card.setAttribute("data-mark",mk);card.classList.add("answered");}
  return card;
}

function onGuess(card,q,letter){
  if(card.getAttribute("data-locked")==="1") return;
  applyGuess(card,q,letter,true);
  Store.set("guesses",card.getAttribute("data-qid"),letter===q.ans?"ok":"bad");
  // guess felfedi a választ is
  card.classList.add("show");
  var sb=card.querySelector(".show-btn");if(sb)sb.textContent="Elrejt";
  updateSection(card.closest(".topic"));updateDash();
}
function applyGuess(card,q,letter,record){
  card.setAttribute("data-locked","1");
  var opts=card.querySelectorAll(".opt");
  opts.forEach(function(o){
    var k=o.getAttribute("data-k");
    o.setAttribute("disabled","");
    if(k===q.ans)o.classList.add("correct");
    if(k===letter&&letter!==q.ans)o.classList.add("wrong");
    if(k!==q.ans&&k!==letter)o.classList.add("dim");
  });
  card.classList.add("answered");
}

function onMark(card,qid,v){
  var cur=Store.get("marks",qid);
  if(cur===v){Store.set("marks",qid,null);card.removeAttribute("data-mark");markSel(card,null);}
  else{Store.set("marks",qid,v);card.setAttribute("data-mark",v);markSel(card,v);card.classList.add("answered");}
  updateSection(card.closest(".topic"));
  updateDash();applyFilter();
}
function markSel(card,v){
  card.querySelectorAll(".mbtn").forEach(function(b){
    b.classList.toggle("sel",v&&b.getAttribute("data-v")===v);
  });
}

/* ---------- témakör haladás-sáv (szakasz-alapú, eredeti ÉS gyakorló) ---------- */
function updateSection(sec){
  if(!sec)return;
  var cards=sec.querySelectorAll(".card");var tot=cards.length,ok=0,ans=0;
  cards.forEach(function(c){var m=c.getAttribute("data-mark");if(m)ans++;if(m==="ok")ok++;});
  var prog=sec.querySelector(".prog");var bar=sec.querySelector(".bar>i");
  if(prog)prog.textContent=ok+"/"+tot+" tudom · "+ans+"/"+tot+" jelölve";
  if(bar)bar.style.width=tot?(100*ok/tot)+"%":"0";
}
function updateAllSections(){document.querySelectorAll("section.part .topic").forEach(updateSection);}
function resetTopic(sec){
  if(!sec)return;
  sec.querySelectorAll(".card").forEach(function(c){
    var qid=c.getAttribute("data-qid");
    Store.set("guesses",qid,null);Store.set("marks",qid,null);
    c.classList.remove("answered","show");c.removeAttribute("data-mark");c.removeAttribute("data-locked");
    markSel(c,null);
    var sb=c.querySelector(".show-btn");if(sb)sb.textContent="Mutasd a választ";
    c.querySelectorAll(".opt").forEach(function(o){o.classList.remove("correct","wrong","dim","pick");o.removeAttribute("disabled");});
  });
  updateSection(sec);updateDash();
}
function topicCardsCombined(tid){
  var out=[];["t_","g_"].forEach(function(p){var s=document.getElementById(p+tid);
    if(s)Array.prototype.push.apply(out,s.querySelectorAll(".card"));});
  return out;
}

/* ============================================================
   GYAKORLÓBANK — 224 új kérdés (külön keret, csak válasz)
   ============================================================ */
var LET="abcdefgh";
function buildPracticeBank(){
  var sec=document.getElementById("gyak");if(!sec||typeof QUESTIONS2==="undefined")return;
  var wrap=el("div","wrap");
  wrap.appendChild(el("h2","htop","Gyakorlóbank — 224 kérdés"));
  wrap.appendChild(el("p","lead","Ezek a kérdések a nyilvános nummodkviz gyakorlóoldalról származnak, témakör szerint csoportosítva. Eltérő (türkiz) keret jelzi, hogy nem a két eredeti vizsgából valók, és csak a helyes választ tartalmazzák (magyarázat nélkül). Feleletválasztós és szabad-válaszos kérdések is vannak; néhány ábrára hivatkozik (a leírás a kérdésben szerepel)."));
  (function(){var pr=el("button","btn rst","↺ Oldal összes válaszának törlése");
    pr.addEventListener("click",function(){var p=pr.closest("section.part");if(p)p.querySelectorAll(".topic").forEach(resetTopic);});
    wrap.appendChild(pr);})();
  var order=(typeof PRACTICE_ORDER!=="undefined")?PRACTICE_ORDER:Object.keys(TOPIC_DEFS);
  order.forEach(function(tid){
    var list=QUESTIONS2.filter(function(q){return q.topic===tid;});
    if(!list.length)return;
    var td=TOPIC_DEFS[tid]||{t:tid};
    var topic=el("section","topic");topic.id="g_"+tid;
    var th=el("div","th");
    th.appendChild(el("h3",null,td.t));
    th.appendChild(el("span","prog"));
    (function(tp){var rst=el("button","btn rst","↺ Törlés");rst.title="Válaszok törlése";
      rst.addEventListener("click",function(){resetTopic(tp);});th.appendChild(rst);})(topic);
    topic.appendChild(th);
    var bar=el("div","bar");bar.innerHTML='<i></i>';topic.appendChild(bar);
    list.forEach(function(q){topic.appendChild(buildPracticeCard(q));});
    wrap.appendChild(topic);
  });
  sec.appendChild(wrap);
}

function buildPracticeCard(q){
  var qid=q.id; // stabil: 'gy'+index
  var card=el("div","card prac");card.setAttribute("data-qid",qid);card.setAttribute("data-kind",q.type==="FREE"?"free":"mcq");
  var tr=el("div","tagrow");
  tr.appendChild(el("span","badge prac","Gyakorló"));
  tr.appendChild(el("span","badge "+(q.type==="FREE"?"free":"mc"),q.type==="FREE"?"Szabad válasz":"Feleletválasztós"));
  card.appendChild(tr);
  var qel=el("div","q");qel.textContent=q.q;card.appendChild(qel);

  if(q.type==="MC"&&q.opts){
    var opts=el("div","opts");
    q.opts.forEach(function(t,ix){
      var letter=LET[ix];
      var btn=el("button","opt");btn.setAttribute("data-k",letter);btn.type="button";
      var ol=el("span","ol",letter+")");var tx=el("span");tx.textContent=t;
      btn.appendChild(ol);btn.appendChild(tx);
      btn.addEventListener("click",function(){onPracGuess(card,q,letter);});
      opts.appendChild(btn);
    });
    card.appendChild(opts);
    var rev=el("div","reveal");
    var corr=el("div","ans");
    corr.innerHTML='<span class="key">Helyes válasz: '+LET[q.ans]+') </span>';
    var ct=document.createElement("span");ct.textContent=q.opts[q.ans];corr.appendChild(ct);
    rev.appendChild(corr);card.appendChild(rev);
  } else {
    // FREE
    var rev2=el("div","reveal");
    var fa=el("div","freeans");
    fa.appendChild(el("div","fl","Helyes válasz"));
    var fat=document.createElement("div");fat.textContent=q.ans;fa.appendChild(fat);
    rev2.appendChild(fa);card.appendChild(rev2);
  }

  // magyarázat (ha van EXP2[qid])
  if(typeof EXP2!=="undefined" && EXP2[qid]){
    var revEl=card.querySelector(".reveal");
    if(revEl){var why=el("div","why");why.innerHTML=expandConcepts(EXP2[qid]);revEl.appendChild(why);}
  }

  var btns=el("div","btns");
  var showBtn=el("button","btn show-btn","Mutasd a választ");
  showBtn.addEventListener("click",function(){card.classList.toggle("show");showBtn.textContent=card.classList.contains("show")?"Elrejt":"Mutasd a választ";});
  btns.appendChild(showBtn);
  btns.appendChild(el("span","lab","Önértékelés:"));
  [["ok","Tudtam"],["part","Részben"],["bad","Nem tudtam"]].forEach(function(p){
    var b=el("button","btn mbtn","");b.setAttribute("data-v",p[0]);b.textContent=p[1];
    b.addEventListener("click",function(){onMark(card,qid,p[0]);});
    btns.appendChild(b);
  });
  card.appendChild(btns);

  var g=Store.get("guesses",qid);var mk=Store.get("marks",qid);
  if(g&&q.type==="MC"){applyPracGuess(card,q,null,g);}
  if(mk){markSel(card,mk);card.setAttribute("data-mark",mk);card.classList.add("answered");}
  return card;
}
function onPracGuess(card,q,letter){
  if(card.getAttribute("data-locked")==="1")return;
  var correctLetter=LET[q.ans];
  applyPracGuess(card,q,letter,letter===correctLetter?"ok":"bad");
  Store.set("guesses",q.id,letter===correctLetter?"ok":"bad");
  card.classList.add("show");
  var sb=card.querySelector(".show-btn");if(sb)sb.textContent="Elrejt";
  updateSection(card.closest(".topic"));updateDash();
}
function applyPracGuess(card,q,letter,res){
  card.setAttribute("data-locked","1");
  var correctLetter=LET[q.ans];
  card.querySelectorAll(".opt").forEach(function(o){
    var k=o.getAttribute("data-k");o.setAttribute("disabled","");
    if(k===correctLetter)o.classList.add("correct");
    if(letter&&k===letter&&letter!==correctLetter)o.classList.add("wrong");
    if(k!==correctLetter&&k!==letter)o.classList.add("dim");
  });
  card.classList.add("answered");
}

/* ============================================================
   VIZSGA-SZIMULÁCIÓ
   ============================================================ */
var EXAM={list:[],answers:{},timerId:null,endTs:0,graded:false,cfg:null};
function examKey(){return APP+":exam:"+Store.userKey;}
function examHistory(){try{return JSON.parse(localStorage.getItem(examKey()))||[];}catch(e){return [];}}
function saveExamResult(rec){var h=examHistory();h.unshift(rec);h=h.slice(0,8);try{localStorage.setItem(examKey(),JSON.stringify(h));}catch(e){}}

function mcPool(src){
  var pool=[];
  if(src!=="prac"){QUESTIONS.forEach(function(q){pool.push({q:q.q,opts:q.opts,ans:q.ans,exp:q.exp,anstext:q.anstext,topic:q.topic,src:"orig",lab:q.ex+". vizsga · "+q.n});});}
  if(src!=="orig"&&typeof QUESTIONS2!=="undefined"){QUESTIONS2.forEach(function(q){if(q.type!=="MC"||!q.opts)return;
    pool.push({q:q.q,opts:q.opts.map(function(t,i){return {k:LET[i],t:t};}),ans:LET[q.ans],topic:q.topic,src:"prac",lab:"Gyakorló"});});}
  return pool;
}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function setItemContent(elm,str,isOrig){ if(isOrig){elm.innerHTML=expandConcepts(str);} else {elm.textContent=str;} }

function buildExam(){
  var sec=document.getElementById("vizsga");if(!sec)return;
  stopTimer();sec.innerHTML="";
  var wrap=el("div","wrap");wrap.id="examwrap";sec.appendChild(wrap);
  renderExamStart(wrap);
}
function renderExamStart(wrap){
  wrap.innerHTML="";
  wrap.appendChild(el("h2","htop","Vizsga-szimuláció"));
  wrap.appendChild(el("p","lead","15 véletlenszerűen kiválasztott feleletválasztós kérdés — mint az éles vizsgán: minden kérdés 1 pont, pontosan egy helyes válasz, beadásig nincs visszajelzés. Pontozás: 0–7 elégtelen (1), 8–11 elégséges (2), 12–15 közepes (3)."));
  var box=el("div","examstart");
  box.innerHTML=
    '<div class="examcfg">'
    +'<fieldset><legend>Kérdések forrása</legend>'
      +'<label><input type="radio" name="exsrc" value="mix" checked> Vegyes (eredeti + gyakorló)</label>'
      +'<label><input type="radio" name="exsrc" value="orig"> Csak a 30 eredeti vizsgakérdés</label>'
      +'<label><input type="radio" name="exsrc" value="prac"> Csak a gyakorlóbank</label>'
    +'</fieldset>'
    +'<fieldset><legend>Időkorlát (opcionális)</legend>'
      +'<label><input type="checkbox" id="extimed"> Időzítő bekapcsolása</label>'
      +'<label>Perc: <input type="number" id="exmin" value="30" min="5" max="120"></label>'
    +'</fieldset>'
    +'</div>'
    +'<button class="bigbtn" id="exstart">Vizsga indítása (15 kérdés)</button>';
  wrap.appendChild(box);
  var h=examHistory();
  if(h.length){
    var hd=el("div","examhist");
    hd.innerHTML='<div style="color:var(--read);font-weight:600;margin-bottom:4px">Korábbi eredmények</div>'+
      h.map(function(r){var d=new Date(r.t);var dd=d.toLocaleDateString("hu-HU")+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);
        return '<div class="hi"><b>'+r.score+'/'+r.total+'</b> — '+r.gradeT+' ('+r.gradeN+') · '+r.srcT+' · '+dd+'</div>';}).join("");
    wrap.appendChild(hd);
  }
  document.getElementById("exstart").onclick=function(){
    var sel=wrap.querySelector('input[name=exsrc]:checked');
    var src=sel?sel.value:"mix";
    var timed=document.getElementById("extimed").checked;
    var min=parseInt(document.getElementById("exmin").value,10)||30;
    startExam({src:src,timed:timed,min:min});
  };
}
function startExam(cfg){
  var pool=mcPool(cfg.src);
  shuffle(pool);
  EXAM.list=pool.slice(0,Math.min(15,pool.length));
  EXAM.answers={};EXAM.graded=false;EXAM.cfg=cfg;
  renderExam();
  if(cfg.timed)startTimer(cfg.min);
}
function renderExam(){
  var wrap=document.getElementById("examwrap");wrap.innerHTML="";
  wrap.appendChild(el("h2","htop","Vizsga folyamatban"));
  var bar=el("div","exambar");bar.id="exambar";
  bar.innerHTML='<span class="ec">Megválaszolva: <b id="exans">0</b>/'+EXAM.list.length+'</span>'
    +'<span class="timer" id="extimer" style="display:none"></span>'
    +'<span class="sp"></span>'
    +'<button class="btn" id="exquit">Megszakítás</button>'
    +'<button class="bigbtn" id="exsubmit" style="padding:8px 16px">Beadás</button>';
  wrap.appendChild(bar);
  EXAM.list.forEach(function(it,qi){
    var card=el("div","examq "+it.src);card.id="exq"+qi;
    card.appendChild(el("div","qn","Kérdés "+(qi+1)+" / "+EXAM.list.length+" · "+it.lab));
    var qel=el("div","q");setItemContent(qel,it.q,it.src==="orig");card.appendChild(qel);
    var opts=el("div","opts");
    it.opts.forEach(function(o){
      var btn=el("button","opt");btn.type="button";btn.setAttribute("data-k",o.k);
      var ol=el("span","ol",o.k+")");var tx=document.createElement("span");setItemContent(tx,o.t,it.src==="orig");
      btn.appendChild(ol);btn.appendChild(tx);
      btn.addEventListener("click",function(){pickOption(qi,o.k);});
      opts.appendChild(btn);
    });
    card.appendChild(opts);
    wrap.appendChild(card);
  });
  var foot=el("div","btns");var sb=el("button","bigbtn","Beadás és kiértékelés");sb.onclick=submitExam;foot.appendChild(sb);
  wrap.appendChild(foot);
  document.getElementById("exsubmit").onclick=submitExam;
  document.getElementById("exquit").onclick=function(){ if(confirm("Megszakítod a vizsgát? Az eddigi válaszok elvesznek.")){stopTimer();buildExam();} };
  renderMath(wrap);bindClinks(wrap);updateExamBar();
}
function pickOption(qi,letter){
  if(EXAM.graded)return;
  EXAM.answers[qi]=letter;
  var card=document.getElementById("exq"+qi);
  card.querySelectorAll(".opt").forEach(function(o){o.classList.toggle("pick",o.getAttribute("data-k")===letter);});
  updateExamBar();
}
function answeredCount(){return Object.keys(EXAM.answers).length;}
function updateExamBar(){var e=document.getElementById("exans");if(e)e.textContent=answeredCount();}
function startTimer(min){EXAM.endTs=Date.now()+min*60000;var t=document.getElementById("extimer");if(t)t.style.display="";tickTimer();EXAM.timerId=setInterval(tickTimer,1000);}
function tickTimer(){var t=document.getElementById("extimer");if(!t)return;
  var rem=Math.max(0,Math.round((EXAM.endTs-Date.now())/1000));var mm=Math.floor(rem/60),ss=rem%60;
  t.textContent="⏱ "+mm+":"+("0"+ss).slice(-2);t.classList.toggle("low",rem<=60);
  if(rem<=0){stopTimer();submitExam();}}
function stopTimer(){if(EXAM.timerId){clearInterval(EXAM.timerId);EXAM.timerId=null;}}
function gradeOf(s){if(s<=7)return{n:1,t:"Elégtelen",c:"g1"};if(s<=11)return{n:2,t:"Elégséges",c:"g2"};return{n:3,t:"Közepes",c:"g3"};}
function submitExam(){
  if(EXAM.graded)return;
  if(answeredCount()<EXAM.list.length){ if(!confirm("Még nem válaszoltál minden kérdésre ("+answeredCount()+"/"+EXAM.list.length+"). Beadod így?"))return; }
  EXAM.graded=true;stopTimer();
  var score=0,perTopic={};
  EXAM.list.forEach(function(it,qi){
    var chosen=EXAM.answers[qi];var ok=chosen===it.ans;if(ok)score++;
    var tp=it.topic;perTopic[tp]=perTopic[tp]||{ok:0,tot:0};perTopic[tp].tot++;if(ok)perTopic[tp].ok++;
    var card=document.getElementById("exq"+qi);card.classList.add("graded");
    card.querySelectorAll(".opt").forEach(function(o){
      var k=o.getAttribute("data-k");o.setAttribute("disabled","");o.classList.remove("pick");
      if(k===it.ans)o.classList.add("correct");
      if(chosen&&k===chosen&&!ok)o.classList.add("wrong");
      if(k!==it.ans&&k!==chosen)o.classList.add("dim");
    });
    var rev=el("div","reveal");rev.style.display="block";
    var head='<span class="key">Helyes válasz: '+it.ans+')</span>'+(chosen?"":' <span style="color:var(--mut)">(nem válaszoltál)</span>');
    var ans=el("div","ans");ans.innerHTML=head+(it.anstext?(" "+expandConcepts(it.anstext)):"");rev.appendChild(ans);
    if(it.exp){var why=el("div","why");why.innerHTML=expandConcepts(it.exp);rev.appendChild(why);}
    card.appendChild(rev);
  });
  renderResult(score,perTopic);
}
function renderResult(score,perTopic){
  var wrap=document.getElementById("examwrap");var tot=EXAM.list.length;var g=gradeOf(score);
  var res=el("div","result");
  var html='<div class="scorebox"><div class="score">'+score+' <small>/ '+tot+' pont</small></div>'
    +'<span class="grade '+g.c+'">'+g.t+' ('+g.n+')</span>'
    +'<div class="sp" style="margin-left:auto"></div>'
    +'<button class="bigbtn" id="exnew" style="padding:9px 16px">Új vizsga</button></div>';
  html+='<h3>Témakör szerinti bontás</h3><div class="dashrow">';
  Object.keys(perTopic).forEach(function(tp){var p=perTopic[tp];var pc=Math.round(100*p.ok/p.tot);
    html+='<div class="dr"><span class="nm">'+esc((TOPIC_DEFS[tp]||{t:tp}).t)+'</span><span class="bar"><i style="width:'+pc+'%"></i></span><span class="pc">'+p.ok+'/'+p.tot+'</span></div>';});
  html+='</div><p class="lead">Görgess le a részletes megoldásokért — zöld a helyes válasz, piros a rossz tipped.</p>';
  res.innerHTML=html;
  var bar=document.getElementById("exambar");
  wrap.insertBefore(res,bar);
  var sub=bar.querySelector("#exsubmit");if(sub)sub.style.display="none";
  var quit=bar.querySelector("#exquit");if(quit){quit.textContent="Vissza a kezdéshez";quit.onclick=buildExam;}
  document.getElementById("exnew").onclick=buildExam;
  var srcT=EXAM.cfg.src==="orig"?"Csak eredeti":EXAM.cfg.src==="prac"?"Csak gyakorló":"Vegyes";
  saveExamResult({t:Date.now(),score:score,total:tot,gradeN:g.n,gradeT:g.t,srcT:srcT});
  renderMath(wrap);bindClinks(wrap);
  res.scrollIntoView({behavior:"smooth",block:"start"});
}

/* ============================================================
   TANANYAG — leckék + TOC
   ============================================================ */
function buildLessons(){
  var sec=document.getElementById("tananyag");if(!sec)return;
  var wrap=el("div","wrap");
  wrap.appendChild(el("h2","htop","Tananyag — 1 napos terv"));
  wrap.appendChild(el("p","lead",LESSON_LEAD||""));
  var toc=el("div");toc.id="ltoc";wrap.appendChild(toc);
  LESSONS.forEach(function(L){
    var lz=el("div","lesson");lz.id="lz_"+L.id;lz.setAttribute("data-lid",L.id);
    var head=el("div","lhead");
    head.appendChild(el("div","lno",String(L.no)));
    head.appendChild(el("h3",null,L.title));
    head.appendChild(el("span","est",L.est||""));
    lz.appendChild(head);
    var body=el("div","lbody",expandConcepts(L.html));
    lz.appendChild(body);
    var done=el("div","ldone");
    var b=el("button","btn","Kész — megtanultam");
    b.addEventListener("click",function(){toggleLesson(L.id);});
    done.appendChild(b);
    lz.appendChild(done);
    wrap.appendChild(lz);
    head.addEventListener("click",function(e){if(e.target.tagName!=="A"){/* fejléc kattintás: ugrás nincs, csak vizuál */}});
    if(Store.get("lessons",L.id)){lz.classList.add("done");b.textContent="✓ Kész (kattints a visszavonáshoz)";}
  });
  sec.appendChild(wrap);
  buildTOC();
  // golink kezelés
  wrap.querySelectorAll("[data-go]").forEach(function(a){
    a.addEventListener("click",function(e){e.preventDefault();gotoTopic(a.getAttribute("data-go"));});
  });
}
function toggleLesson(id){
  var lz=document.getElementById("lz_"+id);
  var on=Store.get("lessons",id);
  if(on){Store.set("lessons",id,null);lz.classList.remove("done");lz.querySelector(".ldone .btn").textContent="Kész — megtanultam";}
  else{Store.set("lessons",id,true);lz.classList.add("done");lz.querySelector(".ldone .btn").textContent="✓ Kész (kattints a visszavonáshoz)";}
  buildTOC();updateDash();
}
function buildTOC(){
  var toc=document.getElementById("ltoc");if(!toc)return;
  var html='<div class="tt">Leckék haladása</div><ol>';
  LESSONS.forEach(function(L){
    var done=Store.get("lessons",L.id);
    html+='<li><a href="#" data-jump="lz_'+L.id+'">'+esc(L.title)+'</a> <span class="est" style="color:var(--mut)">'+(L.est||"")+'</span>'+(done?'<span class="ck">✓</span>':'')+'</li>';
  });
  html+='</ol>';toc.innerHTML=html;
  toc.querySelectorAll("[data-jump]").forEach(function(a){
    a.addEventListener("click",function(e){e.preventDefault();
      var t=document.getElementById(a.getAttribute("data-jump"));
      if(t)t.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
}

/* ============================================================
   FOGALOMTÁR — LAYERS + C
   ============================================================ */
function buildGlossary(){
  var sec=document.getElementById("fogalomtar");if(!sec)return;
  var wrap=el("div","wrap");
  wrap.appendChild(el("h2","htop","Fogalomtár"));
  wrap.appendChild(el("p","lead","Az alapfogalmaktól a tételekig — minden kártyán látszik, mire épül. Kattints a kék hivatkozásokra az ugráshoz."));
  LAYERS.forEach(function(ly){
    var lyDiv=el("div","layer");
    lyDiv.innerHTML='<div class="lh"><span class="n">'+ly.n+'</span> '+esc(ly.t)+'</div><div class="ld">'+esc(ly.d||"")+'</div>';
    var grid=el("div","gcards");
    Object.keys(C).forEach(function(id){
      var c=C[id];if(c.layer!==ly.n)return;
      var gc=el("div","gcard");gc.id="g_"+id;
      var pre="";
      if(c.pre&&c.pre.length){
        pre='<div class="pre"><b>Ehhez kell:</b> '+c.pre.map(function(p){
          return '<span class="clink" data-c="'+p+'">'+(C[p]?C[p].t:p)+'</span>';
        }).join(", ")+'</div>';
      }
      gc.innerHTML='<div class="gt">'+esc(c.t)+'</div><div class="gs">'+expandConcepts(c.short||"")+'</div><div class="gb">'+expandConcepts(c.body||"")+'</div>'+pre;
      grid.appendChild(gc);
    });
    lyDiv.appendChild(grid);
    wrap.appendChild(lyDiv);
  });
  sec.appendChild(wrap);
}

/* ---------- koncepció-csipek (cbar) → inline panel ---------- */
function buildCBars(){
  document.querySelectorAll(".cbar").forEach(function(cbar){
    var ids=(cbar.getAttribute("data-c")||"").split(",").map(function(s){return s.trim();}).filter(Boolean);
    var panel=el("div","cpanel");
    cbar.parentNode.insertBefore(panel,cbar.nextSibling);
    ids.forEach(function(id){
      var c=C[id];if(!c)return;
      var chip=el("span","chip",c.t);
      chip.addEventListener("click",function(){openConcept(panel,id,chip);});
      cbar.appendChild(chip);
    });
  });
}
function openConcept(panel,id,chip){
  var c=C[id];if(!c)return;
  if(panel.getAttribute("data-id")===id&&panel.classList.contains("open")){
    panel.classList.remove("open");panel.setAttribute("data-id","");return;
  }
  panel.setAttribute("data-id",id);
  panel.innerHTML='<div class="ct">'+esc(c.t)+'</div><div class="cs">'+expandConcepts(c.short||"")+'</div><div>'+expandConcepts(c.body||"")+'</div>';
  panel.classList.add("open");
  renderMath(panel);
  bindClinks(panel);
}

/* ---------- .clink → ugrás a fogalomtárhoz + kiemelés ---------- */
function bindClinks(root){
  root.querySelectorAll(".clink").forEach(function(a){
    if(a.getAttribute("data-bound"))return;a.setAttribute("data-bound","1");
    a.addEventListener("click",function(e){e.preventDefault();gotoConcept(a.getAttribute("data-c"));});
  });
}
function gotoConcept(id){
  showTab("fogalomtar");
  var card=document.getElementById("g_"+id);
  if(!card)return;
  document.querySelectorAll(".gcard.hl").forEach(function(x){x.classList.remove("hl");});
  setTimeout(function(){
    card.scrollIntoView({behavior:"smooth",block:"center"});
    card.classList.add("hl");
    setTimeout(function(){card.classList.remove("hl");},2600);
  },60);
}
function gotoTopic(tid){
  // melyik fülön van?
  var tab=null;
  TAB_DEFS.forEach(function(t){if(t.topics.indexOf(tid)>=0)tab=t.id;});
  if(tab)showTab(tab);
  var sec=document.getElementById("t_"+tid);
  if(sec)setTimeout(function(){sec.scrollIntoView({behavior:"smooth",block:"start"});},60);
}

/* ============================================================
   FÜLEK
   ============================================================ */
function showTab(id){
  document.querySelectorAll("section.part").forEach(function(s){s.classList.toggle("active",s.id===id);});
  document.querySelectorAll(".tab").forEach(function(t){t.classList.toggle("active",t.getAttribute("data-tab")===id);});
  window.scrollTo({top:0,behavior:"auto"});
}
function buildTabs(){
  var nav=document.getElementById("tabs");
  TABS.forEach(function(t){
    var b=el("button","tab",t.label);b.setAttribute("data-tab",t.id);
    b.addEventListener("click",function(){showTab(t.id);});
    nav.appendChild(b);
  });
}

/* ============================================================
   ÁTTEKINTÉS / dashboard
   ============================================================ */
function buildDash(){
  var sec=document.getElementById("attekintes");if(!sec)return;
  var wrap=el("div","wrap");
  wrap.innerHTML=OVERVIEW_HTML||"";
  // statok + témakör-sávok konténer
  var dash=el("div");dash.id="dash";
  wrap.appendChild(dash);
  sec.appendChild(wrap);
  renderMath(wrap);bindClinks(wrap);
}
function updateDash(){
  var dash=document.getElementById("dash");if(!dash)return;
  var totQ=QUESTIONS.length+((typeof QUESTIONS2!=="undefined")?QUESTIONS2.length:0);
  var gOk=0,gBad=0,mOk=0,mPart=0,mBad=0,answered=0;
  // a tényleges állapot a Store-ból:
  var gs=Store.data.guesses||{},mk=Store.data.marks||{};
  for(var k in gs){if(gs[k]==="ok")gOk++;else if(gs[k]==="bad")gBad++;}
  for(var k2 in mk){if(mk[k2]==="ok")mOk++;else if(mk[k2]==="part")mPart++;else if(mk[k2]==="bad")mBad++;answered++;}
  var lessonsDone=0;for(var l in (Store.data.lessons||{})){if(Store.data.lessons[l])lessonsDone++;}
  var guessTot=gOk+gBad;
  var html='<div class="dashgrid">'
    +stat(mOk,"tudom (önértékelés)")
    +stat(answered+"/"+totQ,"jelölt kérdés")
    +stat(guessTot?Math.round(100*gOk/guessTot)+"%":"–","tipp-találat ("+gOk+"/"+guessTot+")")
    +stat(lessonsDone+"/"+LESSONS.length,"kész lecke")
    +'</div>';
  html+='<h3>Témakörök szerint (eredeti + gyakorló együtt)</h3><div class="dashrow">';
  for(var tid in TOPIC_DEFS){
    var cards=topicCardsCombined(tid);var tot=cards.length,ok=0,a=0;
    if(!tot)continue;
    cards.forEach(function(c){var m=c.getAttribute("data-mark");if(m)a++;if(m==="ok")ok++;});
    var pc=tot?Math.round(100*ok/tot):0;
    html+='<div class="dr"><span class="nm">'+esc(TOPIC_DEFS[tid].t)+'</span>'
      +'<span class="bar"><i style="width:'+pc+'%"></i></span>'
      +'<span class="pc">'+ok+'/'+tot+'</span></div>';
  }
  html+='</div>';
  html+='<div style="margin-top:14px"><button class="btn" id="resetBtn">Haladás törlése (ezen az eszközön)</button></div>';
  dash.innerHTML=html;
  var rb=document.getElementById("resetBtn");
  if(rb)rb.addEventListener("click",function(){
    if(confirm("Biztosan törlöd az összes haladásodat (tippek, jelölések, kész leckék) ezen az eszközön?")){
      Store.data=Store.emptyData(Store.displayName);Store.saveLocal();location.reload();
    }
  });
}
function stat(v,l){return '<div class="stat"><div class="v">'+v+'</div><div class="l">'+esc(l)+'</div></div>';}

/* ============================================================
   KERESÉS + SZŰRŐK
   ============================================================ */
function applySearch(){
  var q=(document.getElementById("search").value||"").trim().toLowerCase();
  document.querySelectorAll("section.part .card").forEach(function(c){
    if(!q){c.classList.remove("hidden");return;}
    c.classList.toggle("hidden",c.textContent.toLowerCase().indexOf(q)<0);
  });
  // üres témakörök jelzése nem kritikus
}
function applyFilter(){
  // a CSS body.filterbad intézi a mark=ok rejtését
}

/* ============================================================
   BELÉPÉS + indítás
   ============================================================ */
function enter(name){
  Store.displayName=name;
  Store.userKey=normUserKey(name);
  try{localStorage.setItem(APP+":user",JSON.stringify({k:Store.userKey,n:name}));}catch(e){}
  Store.loadLocal();
  if(!Store.data.displayName){Store.data.displayName=name;Store.saveLocal();}
  document.getElementById("gate").classList.add("hidden");
  document.getElementById("who").innerHTML='<b>'+esc(name)+'</b> <span class="sync on" title="helyi mentés aktív"></span>';
  boot();
}
function boot(){
  buildTabs();
  buildLessons();
  buildDash();
  buildQuestionTabs();
  buildPracticeBank();
  buildExam();
  buildGlossary();
  buildCBars();
  // klinkek a teljes dokumentumon
  bindClinks(document.body);
  // matek render
  renderMath(document.body);
  // állapot
  updateAllSections();updateDash();
  showTab("tananyag");
}

function initGate(){
  var saved=null;
  try{saved=JSON.parse(localStorage.getItem(APP+":user"));}catch(e){}
  var input=document.getElementById("name");
  var btn=document.getElementById("enterBtn");
  function go(){var n=(input.value||"").trim();if(!n)return;enter(n);}
  btn.addEventListener("click",go);
  input.addEventListener("keydown",function(e){if(e.key==="Enter")go();});
  if(saved&&saved.n){input.value=saved.n;}
}

/* ---------- fejléc kapcsolók ---------- */
function initHeader(){
  var s=document.getElementById("search");
  if(s)s.addEventListener("input",applySearch);
  var study=document.getElementById("tgStudy");
  if(study)study.addEventListener("click",function(){document.body.classList.toggle("study");study.classList.toggle("on");});
  var fb=document.getElementById("tgFilter");
  if(fb)fb.addEventListener("click",function(){document.body.classList.toggle("filterbad");fb.classList.toggle("on");});
}

document.addEventListener("DOMContentLoaded",function(){
  initGate();initHeader();
  // önteszt mód: #autotest → automatikus belépés + hibagyűjtés (production-ban inaktív)
  if(location.hash.indexOf("autotest")>=0){
    window.__errs=[];
    window.addEventListener("error",function(e){window.__errs.push(String(e.message));});
    var box=document.createElement("div");box.id="__errbox";box.style.display="none";document.body.appendChild(box);
    var mTab=location.hash.match(/tab=([a-z0-9]+)/);
    setTimeout(function(){
      try{ enter("Teszt"); if(mTab){ try{showTab(mTab[1]);}catch(e){} } }catch(e){ window.__errs.push("enter: "+e.message); }
      setTimeout(function(){
        // szimulált interakció: jelöljük az első gyakorló kártyát 'Tudtam'-ra
        var barW="n/a";
        try{
          var pc=document.querySelector(".card.prac");
          if(pc){ var ok=pc.querySelector('.mbtn[data-v="ok"]'); if(ok)ok.click();
            var bi=pc.closest(".topic").querySelector(".bar>i"); barW=bi?bi.style.width:"no-bar"; }
        }catch(e){ window.__errs.push("interact: "+e.message); }
        // vizsga-szimuláció próba: indít, válaszol az elsőre, bead
        var examInfo="n/a";
        try{
          startExam({src:"mix",timed:false,min:30});
          var n=EXAM.list.length;
          for(var qi=0;qi<n;qi++){ pickOption(qi,EXAM.list[qi].opts[0].k); }
          submitExam();
          var sc=document.querySelector("#examwrap .score"); examInfo=n+"q,"+(sc?sc.textContent.replace(/\s+/g," ").trim():"no-score");
        }catch(e){ window.__errs.push("exam: "+e.message); }
        box.textContent=(window.__errs.length?("ERRORS:"+window.__errs.join(" | ")):"NO_ERRORS")
        +" | markBarW="+barW+" | resetBtn="+(!!document.getElementById("resetBtn"))
        +" | exam="+examInfo
        +" | overflow="+document.documentElement.scrollWidth+"/"+window.innerWidth
        +" | cards="+document.querySelectorAll(".card").length
        +" | orig="+document.querySelectorAll(".card.orig").length
        +" | prac="+document.querySelectorAll(".card.prac").length
        +" | katex="+document.querySelectorAll(".katex").length
        +" | lessons="+document.querySelectorAll(".lesson").length
        +" | gcards="+document.querySelectorAll(".gcard").length; },600);
    },60);
  }
});

// expose for inline debug if needed
window.__nm={Store:Store,gotoConcept:gotoConcept};
})();
