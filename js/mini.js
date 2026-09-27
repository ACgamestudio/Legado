// ===================== DESAFIOS RÁPIDOS =====================
function miniReward(score,max,label){
  const pct=Math.max(0,Math.min(1,score/max));const c=Math.round(40+pct*160);const locked=CHARS.filter(x=>!S.unlocked.includes(x.id));
  S.cauris+=c;st('minis');let frag='';
  if(pct>=.6&&locked.length){const ch=pick(locked);const un=addFrag(ch.id,1);frag=`<p>${portrait(ch.id,'mini')} ${un?'Desbloqueado!':'+1 fragmento de '+short(ch.id)}</p>`}
  gainXP(Math.round(20+pct*40));save();checkAch();sfx('win');
  const m=modal(`<div class="res"><small>${label}</small><h2>${pct>=.8?'Mandou muito bem!':pct>=.5?'Boa!':'Continue treinando!'}</h2><div class="rgrid"><div><span>🐚</span><b>+${c}</b><small>Cauris</small></div></div>${frag}<div class="rbtns"><button class="btn" data-go="challenges">Voltar</button><button class="btn gold" id="again">Jogar de novo</button></div></div>`,()=>show('challenges'));
  m.querySelector('#again').onclick=()=>{m.remove();show(CUR)};
}

// ---------- RODA DE RITMO ----------
SCREENS.rhythm=()=>topbar('Roda de Ritmo','challenges')+`<div class="mg"><canvas id="rc" width="900" height="640"></canvas><div class="mgside panel"><h3>Como jogar</h3><p>As notas caem no ritmo do samba. Aperte <kbd>D</kbd> <kbd>F</kbd> <kbd>J</kbd> <kbd>K</kbd> ou toque na coluna quando a nota chegar à linha dourada.</p><p id="rs">Pontos: 0</p><p id="ra">Precisão: -</p><button class="btn gold" id="rgo">Começar</button></div></div>`;
AFTER.rhythm=()=>{
  const cv=document.getElementById('rc'),x=cv.getContext('2d');const lanes=4,LW=900/lanes,HY=560;const cols=['#ff4d8d','#f5c542','#2fbf71','#5ec8ff'],icons=['🥁','🪘','🎵','🔔'];
  let notes=[],t0=0,run=false,score=0,hits=0,total=0,flash=[0,0,0,0],fb='',fbT=0,raf;
  const drawIdle=()=>{x.fillStyle='#120a08';x.fillRect(0,0,900,640);for(let i=0;i<lanes;i++){x.fillStyle=i%2?'#1c120c':'#221610';x.fillRect(i*LW,0,LW,640)}x.fillStyle='#f5b82e';x.fillRect(0,HY,900,4);x.font='40px serif';x.textAlign='center';icons.forEach((ic,i)=>x.fillText(ic,i*LW+LW/2,620))};
  drawIdle();
  const start=()=>{Audio.genre=null;Audio.play('samba');const sd=Audio.stepDur();t0=Audio.startTime;notes=[];
    for(let s=8;s<45/sd;s+=2){ if(Math.random()<.62)notes.push({t:t0+s*sd,l:ri(0,3),hit:false,miss:false}) }
    total=notes.length;score=0;hits=0;run=true;loop()};
  const judge=l=>{if(!run)return;const now=Audio.ctx.currentTime;let best=null,bd=1;notes.forEach(n=>{if(n.l===l&&!n.hit&&!n.miss){const d=Math.abs(n.t-now);if(d<bd){bd=d;best=n}}});
    flash[l]=1;if(best&&bd<.16){best.hit=true;hits++;const pf=bd<.06;score+=pf?100:60;fb=pf?'Perfeito!':'Bom!';sfx(pf?'perfect':'good')}else{fb='Fora do tempo';sfx('miss')}fbT=now;
    document.getElementById('rs').textContent='Pontos: '+score};
  const loop=()=>{if(CUR!=='rhythm'){run=false;return}const now=Audio.ctx.currentTime;drawIdle();
    flash.forEach((f,i)=>{if(f>0){x.fillStyle=cols[i]+'55';x.fillRect(i*LW,0,LW,640);flash[i]=Math.max(0,f-.08)}});
    notes.forEach(n=>{const y=HY-(n.t-now)*420;if(!n.hit&&!n.miss&&now-n.t>.16){n.miss=true}if(n.hit||y<-40||y>680)return;x.fillStyle=n.miss?'#555':cols[n.l];x.beginPath();x.arc(n.l*LW+LW/2,y,30,0,7);x.fill();x.fillStyle='#000a';x.beginPath();x.arc(n.l*LW+LW/2,y,12,0,7);x.fill()});
    if(now-fbT<.5){x.fillStyle='#fff';x.font='bold 44px "Saira Condensed",sans-serif';x.fillText(fb,450,300)}
    const done=notes.filter(n=>n.hit||n.miss).length;document.getElementById('ra').textContent=`Precisão: ${done?Math.round(hits/done*100):0}%`;
    if(notes.length&&now>notes[notes.length-1].t+.6){run=false;const acc=Math.round(hits/total*100);stMax('rhythmBest',acc);Audio.play('menu');miniReward(acc,100,`Ritmo: ${acc}% de precisão · ${score} pontos`);return}
    raf=requestAnimationFrame(loop)};
  document.getElementById('rgo').onclick=e=>{e.target.disabled=true;start()};
  cv.onpointerdown=e=>{const r=cv.getBoundingClientRect();judge(Math.floor((e.clientX-r.left)/r.width*lanes))};
  document.onkeydown=e=>{if(CUR!=='rhythm')return;const l='dfjk'.indexOf(e.key.toLowerCase());if(l>=0)judge(l)};
};

// ---------- MEMÓRIA ----------
SCREENS.memory=()=>topbar('Memória dos Tesouros','challenges')+`<div class="mg"><div class="mem" id="mem"></div><div class="mgside panel"><h3>Encontre os pares</h3><p>Cada par revela um colecionável real da cultura negra pelo mundo.</p><p id="mm">Jogadas: 0</p><div id="mfact" class="note"></div></div></div>`;
AFTER.memory=()=>{const pool=shuffle(ITEMS.filter(i=>i.region!=='legado')).slice(0,8);const cards=shuffle([...pool,...pool].map((it,k)=>({it,k})));
  let open=[],moves=0,found=0,lock=false;const el=document.getElementById('mem');
  el.innerHTML=cards.map((c,i)=>`<button class="mc" data-i="${i}"><span class="f">✦</span><span class="b">${c.it.ic}<small>${esc(c.it.name)}</small></span></button>`).join('');
  el.querySelectorAll('.mc').forEach(b=>b.onclick=()=>{if(lock||b.classList.contains('open'))return;b.classList.add('open');sfx('click');open.push(b);
    if(open.length===2){moves++;document.getElementById('mm').textContent='Jogadas: '+moves;const [a,c]=open.map(o=>cards[+o.dataset.i].it);
      if(a.id===c.id){found++;sfx('good');document.getElementById('mfact').innerHTML=`<b>${a.ic} ${esc(a.name)}</b><br>${esc(a.story)}`;open.forEach(o=>o.classList.add('got'));open=[];
        if(found===8){stMax('memoryBest',0);if(!s_('memoryBest')||moves<s_('memoryBest'))S.stats.memoryBest=moves;setTimeout(()=>miniReward(Math.max(0,24-moves),16,`Memória: ${moves} jogadas`),900)}}
      else{lock=true;setTimeout(()=>{open.forEach(o=>o.classList.remove('open'));open=[];lock=false},800)}}})};

// ---------- QUIZ ----------
SCREENS.quiz=()=>topbar('Quiz Cultural','challenges')+`<div class="quiz panel" id="qz"></div>`;
AFTER.quiz=()=>{const qs=shuffle(QUIZ).slice(0,8);let i=0,right=0,timer,tl;const box=document.getElementById('qz');
  const ask=()=>{if(i>=qs.length){clearInterval(timer);if(right===8)st('quizPerfect');miniReward(right,8,`Quiz: ${right}/8 acertos`);return}
    const q=qs[i],opts=shuffle(q[1].map((o,k)=>({o,ok:k===q[2]})));tl=15;
    box.innerHTML=`<div class="qh"><small>Pergunta ${i+1} de 8</small><div class="qt"><i id="qbar"></i></div><b>${right} acertos</b></div><h2>${q[0]}</h2><div class="qopts">${opts.map((o,k)=>`<button class="btn qo" data-k="${k}">${o.o}</button>`).join('')}</div>`;
    const answer=k=>{clearInterval(timer);const ok=k>=0&&opts[k].ok;box.querySelectorAll('.qo').forEach((b,j)=>{b.disabled=true;b.classList.add(opts[j].ok?'right':(j===k?'wrong':''))});if(ok){right++;st('quizRight');sfx('good')}else sfx('miss');i++;setTimeout(ask,1300)};
    box.querySelectorAll('.qo').forEach(b=>b.onclick=()=>answer(+b.dataset.k));
    clearInterval(timer);timer=setInterval(()=>{if(CUR!=='quiz'){clearInterval(timer);return}tl-=.1;const qb=document.getElementById('qbar');if(qb)qb.style.width=(tl/15*100)+'%';if(tl<=0)answer(-1)},100)};
  ask()};

// ---------- CORRIDA DO BAOBÁ ----------
SCREENS.runner=()=>topbar('Corrida do Baobá','challenges')+`<div class="mg"><canvas id="rn" width="1100" height="560"></canvas><div class="mgside panel"><h3>Corra, ${esc(P())}!</h3><p>Toque na tela ou aperte <kbd>espaço</kbd> para pular. Pulo duplo permitido. Colete 🐚 e desvie dos tambores da Névoa.</p><p id="rd">0 m</p><button class="btn gold" id="rgo2">Começar</button></div></div>`;
AFTER.runner=()=>{const cv=document.getElementById('rn'),x=cv.getContext('2d');const img=new Image();img.src=IMG[S.avatar];
  let p,obs,coins,sp,dist,run=false,got,raf,frame;
  const reset=()=>{p={y:420,vy:0,j:0};obs=[];coins=[];sp=7;dist=0;got=0;frame=0};
  const jump=()=>{if(!run)return;if(p.j<2){p.vy=-15;p.j++;sfx('click')}};
  const loop=()=>{if(CUR!=='runner'){run=false;return}frame++;
    x.fillStyle='#ff9f5a';x.fillRect(0,0,1100,560);const g=x.createLinearGradient(0,0,0,480);g.addColorStop(0,'#3a1c5c');g.addColorStop(1,'#ff7a4d');x.fillStyle=g;x.fillRect(0,0,1100,480);
    x.fillStyle='#2a140a';for(let i=0;i<6;i++){const bx=((i*260-dist*1.5)%1560+1560)%1560-200;x.fillRect(bx,300,40,180);x.beginPath();x.ellipse(bx+20,300,90,30,0,0,7);x.fill()}
    x.fillStyle='#4a2410';x.fillRect(0,480,1100,80);
    p.vy+=.8;p.y+=p.vy;if(p.y>=420){p.y=420;p.vy=0;p.j=0}
    x.save();x.beginPath();x.arc(140,p.y+30,34,0,7);x.closePath();x.fillStyle='#f5b82e';x.fill();x.clip();if(img.complete)x.drawImage(img,106,p.y-4,68,68*img.height/img.width);x.restore();x.strokeStyle='#f5b82e';x.lineWidth=4;x.beginPath();x.arc(140,p.y+30,34,0,7);x.stroke();
    if(frame%Math.max(40,Math.round(95-sp*3))===0&&Math.random()<.8)obs.push({x:1120,w:44,h:ri(44,70)});
    if(frame%50===0)coins.push({x:1120,y:ri(250,420)});
    obs.forEach(o=>{o.x-=sp;x.fillStyle='#3b3450';x.fillRect(o.x,480-o.h,o.w,o.h);x.fillStyle='#ff4d8d';x.fillRect(o.x,480-o.h,o.w,8)});
    coins.forEach(c=>{c.x-=sp;if(!c.got){x.font='34px serif';x.fillText('🐚',c.x,c.y);if(Math.abs(c.x-130)<40&&Math.abs(c.y-(p.y+30))<45){c.got=true;got++;sfx('coin')}}});
    obs=obs.filter(o=>o.x>-60);coins=coins.filter(c=>c.x>-60);
    const hitO=obs.some(o=>o.x<168&&o.x+o.w>112&&p.y+60>480-o.h);
    dist+=sp/10;sp+=.004;document.getElementById('rd').textContent=`${Math.floor(dist)} m · 🐚 ${got}`;
    x.fillStyle='#fff';x.font='bold 30px "Saira Condensed",sans-serif';x.fillText(Math.floor(dist)+' m',960,50);
    if(hitO){run=false;sfx('lose');const d=Math.floor(dist);stMax('runBest',d);Audio.play('menu');miniReward(d/10+got*4,160,`Corrida: ${d} m e ${got} cauris`);return}
    raf=requestAnimationFrame(loop)};
  reset();x.fillStyle='#3a1c5c';x.fillRect(0,0,1100,560);x.fillStyle='#f5b82e';x.font='40px "Permanent Marker",cursive';x.textAlign='left';x.fillText('Pronto para correr?',360,280);
  document.getElementById('rgo2').onclick=e=>{e.target.disabled=true;reset();run=true;Audio.genre=null;Audio.play('afrobeat');loop()};
  cv.onpointerdown=jump;document.onkeydown=e=>{if(CUR==='runner'&&(e.code==='Space'||e.key==='ArrowUp')){e.preventDefault();jump()}}};
