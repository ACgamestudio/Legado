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
// As perguntas são da região escolhida e o fundo mostra o lugar de cada pergunta.
// Depois de responder, aparece a resposta certa e o porquê.
const QZ_MUNDO='mundo';
function quizPool(r){return r&&r!==QZ_MUNDO?QUIZ.filter(q=>q.r===r):QUIZ}
function quizOpts(q){return shuffle(q.o.map((o,k)=>({o,ok:k===0})))}
function quizPlace(q){const r=RG[q.r];return r?`📍 ${esc(r.name)} · ${esc(r.sub)}`:'📍 Mundo'}
function quizOptsHTML(opts){return `<div class="qopts">${opts.map((o,k)=>`<button class="btn qo" data-k="${k}"><i>${'ABCD'[k]}</i>${esc(o.o)}</button>`).join('')}</div>`}
// Marca as opções, mostra a resposta certa + explicação e um botão para seguir
function quizReveal(box,q,opts,k,btnTxt,next){
  const ok=k>=0&&opts[k].ok;
  box.querySelectorAll('.qo').forEach((b,j)=>{b.disabled=true;b.classList.add(opts[j].ok?'right':(j===k?'wrong':'dim'))});
  const fb=document.createElement('div');fb.className='qfb '+(ok?'ok':'bad');
  fb.innerHTML=`<div class="qfb-h"><b>${ok?'✔ Acertou!':k<0?'⏰ Tempo esgotado':'✘ Não foi dessa vez'}</b><span>Resposta certa: <strong>${esc(q.o[0])}</strong></span></div><p><em>Por quê?</em> ${esc(q.why)}</p><button class="btn gold qnext">${btnTxt}</button>`;
  box.appendChild(fb);
  const nb=fb.querySelector('.qnext');nb.onclick=e=>{e.stopPropagation();sfx('click');next()};setTimeout(()=>{try{nb.focus({preventScroll:true})}catch(e){}},60);
  return ok}

SCREENS.quiz=()=>`<div class="scene-wrap" id="qbg"></div>`+topbar('Quiz Cultural','challenges')+`<div class="quiz panel" id="qz"></div>`;
AFTER.quiz=()=>{const box=document.getElementById('qz'),bg=document.getElementById('qbg');let bgId=null,timer;
  const setBG=r=>{r=RG[r]?r:'brasil';if(r===bgId)return;bgId=r;bg.innerHTML=sceneBG(r)};
  const pickRegion=()=>{clearInterval(timer);box.classList.add('pick');setBG(window.QZ_LAST&&RG[window.QZ_LAST]?window.QZ_LAST:'brasil');
    box.innerHTML=`<h2>Onde vai ser o quiz?</h2><p class="note">As perguntas falam da história e da cultura do lugar escolhido. Depois de cada resposta você vê a resposta certa e o porquê.</p>
    <div class="qregs">${REGIONS.map(r=>`<button class="qreg${window.QZ_LAST===r.id?' last':''}" data-r="${r.id}" style="--c1:${r.c1};--c2:${r.c2}"><b>${esc(r.name)}</b><small>${esc(r.sub)}</small><em>${quizPool(r.id).length} perguntas</em></button>`).join('')}
    <button class="qreg mundo${window.QZ_LAST===QZ_MUNDO?' last':''}" data-r="${QZ_MUNDO}"><b>🌍 Volta ao mundo</b><small>Todas as regiões misturadas</small><em>${QUIZ.length} perguntas</em></button></div>`;
    box.querySelectorAll('.qreg').forEach(b=>{const r=b.dataset.r;b.onmouseenter=()=>{if(RG[r])setBG(r)};b.onclick=()=>{sfx('click');window.QZ_LAST=r;play(r)}})};
  const play=reg=>{box.classList.remove('pick');const qs=shuffle(quizPool(reg)).slice(0,8),N=qs.length;let i=0,right=0,tl;
    const where=RG[reg]?RG[reg].name:'Volta ao mundo';
    const ask=()=>{clearInterval(timer);if(i>=N){if(right===8)st('quizPerfect');miniReward(right,N,`Quiz ${where}: ${right}/${N} acertos`);return}
      const q=qs[i],opts=quizOpts(q);tl=20;setBG(q.r);let done=false;
      box.innerHTML=`<div class="qh"><small>Pergunta ${i+1} de ${N}</small><div class="qt"><i id="qbar"></i></div><b id="qright">${right} acerto${right===1?'':'s'}</b></div><div class="qplace" style="--c1:${RG[q.r]?RG[q.r].c1:'#555'}">${quizPlace(q)}</div><h2>${esc(q.q)}</h2>${quizOptsHTML(opts)}`;
      const answer=k=>{if(done)return;done=true;clearInterval(timer);
        const ok=quizReveal(box,q,opts,k,i+1<N?'Próxima pergunta ▶':'Ver resultado ▶',()=>{i++;ask()});
        if(ok){right++;st('quizRight');sfx('good')}else sfx('miss');const rb=document.getElementById('qright');if(rb)rb.textContent=right+(right===1?' acerto':' acertos')};
      box.querySelectorAll('.qo').forEach(b=>b.onclick=()=>answer(+b.dataset.k));
      timer=setInterval(()=>{if(CUR!=='quiz'){clearInterval(timer);return}tl-=.1;const qb=document.getElementById('qbar');if(qb)qb.style.width=(tl/20*100)+'%';if(tl<=0)answer(-1)},100)};
    ask()};
  pickRegion()};

// ---------- CORRIDA DO BAOBÁ ----------
SCREENS.runner=()=>topbar('Corrida do Baobá','challenges')+`<div class="mg"><canvas id="rn" width="1100" height="560"></canvas><div class="mgside panel"><h3>Corra, ${esc(P())}!</h3><p>Toque na tela ou aperte <kbd>espaço</kbd> para pular. Pulo duplo permitido. Colete 🐚 e desvie dos tambores da Névoa.</p><p id="rd">0 m</p><button class="btn gold" id="rgo2">Começar</button></div></div>`;
// Corredores recortados dos vídeos de especial (assets/corredor/<id>.webp, fundo transparente).
// frames>1 = tira de animação lado a lado (a esportista corre de verdade). s = ajuste de tamanho.
// Quem não está na lista corre com o corpo desenhado + rosto do avatar (drawRunner).
const RUNNER_SPRITES={
  esportista:{frames:18,s:1.12},atleta:{frames:1},cantora:{frames:1},capoeirista:{frames:1},dancarina:{frames:1},
  engenheiro:{frames:1},guerreiro:{frames:1,s:1.3},lider:{frames:1},protagonista:{frames:1}
};
function runShadow(x,cx,feet){const sc=Math.max(.35,1-(480-feet)/220);x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(cx,482,30*sc,7*sc,0,0,7);x.fill()}
function drawSprite(x,img,spr,cx,feet,ph,air,animT){
  const n=spr.frames||1,fw=img.naturalWidth/n,fh=img.naturalHeight,H=132*(spr.s||1),W=H*fw/fh;
  runShadow(x,cx,feet);
  let f=0,bob=0,lean=.06,sy=1;
  if(n>1){f=air?3:Math.floor(animT)%n;lean=air?.05:.02}
  else if(air){lean=-.1}else{bob=Math.abs(Math.sin(ph))*6;lean=.09+Math.sin(ph*2)*.025;sy=1-Math.abs(Math.cos(ph))*.035}
  const draw=(dx,alpha)=>{x.save();x.globalAlpha=alpha;x.translate(cx+dx,feet-bob);x.rotate(lean);x.scale(1/Math.sqrt(sy),sy);
    if(alpha===1){x.shadowColor='rgba(255,214,150,.75)';x.shadowBlur=10} // brilho de contorno para destacar do fundo
    x.drawImage(img,f*fw,0,fw,fh,-W/2,-H,W,H);x.restore()};
  if(n===1&&!air){draw(-14,.16);draw(-7,.28)} // rastro de velocidade
  draw(0,1)}
// Corredor de corpo inteiro: rosto do avatar + corpo desenhado com balanço de corrida
function drawRunner(x,img,cx,feet,ph,air,col){
  const bob=air?0:Math.abs(Math.sin(ph))*4,hip=feet-40-bob,sh=hip-34,hy=sh-24;
  const sw=air?0:Math.sin(ph),sw2=air?0:Math.sin(ph+Math.PI);
  x.save();x.lineCap='round';x.lineJoin='round';
  // sombra no chão (diminui quando pula)
  runShadow(x,cx,feet);
  const leg=(a,back)=>{x.strokeStyle=back?'#1d1626':'#2b2233';x.lineWidth=11;
    let kx,ky,fx,fy;
    if(air){kx=cx+(back?-6:14);ky=hip+16;fx=cx+(back?-16:4);fy=hip+(back?32:30)}
    else{kx=cx+a*16;ky=hip+20-Math.max(0,-a)*2;fx=cx+a*24-(a<0?10*Math.max(0,-a):0);fy=feet-Math.max(0,-a)*14}
    x.beginPath();x.moveTo(cx,hip);x.lineTo(kx,ky);x.lineTo(fx,fy);x.stroke();
    x.fillStyle=back?'#d9d4cc':'#fff';x.beginPath();x.ellipse(fx+5,fy+1,10,5,0,0,7);x.fill()};
  const arm=(a,back)=>{const ex=cx-a*14+4,ey=sh+16,hx=cx-a*20+(air?-6:6),hy2=air?sh-14+(back?6:0):sh+22-Math.abs(a)*8;
    x.strokeStyle=back?shade(col,-.35):col;x.lineWidth=10;x.beginPath();x.moveTo(cx,sh+4);x.lineTo(ex,ey);x.stroke();
    x.strokeStyle=back?'#4a2c1c':'#6b4026';x.lineWidth=7;x.beginPath();x.moveTo(ex,ey);x.lineTo(hx,hy2);x.stroke()};
  leg(sw2,true);arm(sw,true);
  // tronco: moletom na cor do tipo do personagem
  x.fillStyle=col;x.beginPath();x.moveTo(cx-15,sh);x.quadraticCurveTo(cx,sh-6,cx+15,sh);x.lineTo(cx+13+(air?2:0),hip+4);x.lineTo(cx-13,hip+4);x.closePath();x.fill();
  x.fillStyle='rgba(255,255,255,.18)';x.fillRect(cx-2,sh+4,4,hip-sh-4);
  leg(sw,false);arm(sw2,false);
  // cabeça: rosto do avatar recortado em círculo
  const r=24;x.save();x.beginPath();x.arc(cx+3,hy,r,0,7);x.closePath();x.fillStyle='#f5b82e';x.fill();x.clip();
  if(img.complete&&img.naturalWidth){const w=img.naturalWidth,sz=w*.86;x.drawImage(img,(w-sz)/2,w*.16,sz,sz,cx+3-r,hy-r,r*2,r*2)}
  x.restore();x.strokeStyle='#f5b82e';x.lineWidth=3;x.beginPath();x.arc(cx+3,hy,r,0,7);x.stroke();
  x.restore()}
function shade(hex,k){const n=parseInt(hex.slice(1),16),f=c=>Math.max(0,Math.min(255,Math.round(c+(k<0?c*k:(255-c)*k))));return '#'+[f(n>>16),f(n>>8&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join('')}
AFTER.runner=()=>{const cv=document.getElementById('rn'),x=cv.getContext('2d');const img=new Image();img.src=IMG[S.avatar];
  const ch=CHARS.find(c=>c.id===S.avatar),col=ch&&TYPES[ch.type]?TYPES[ch.type].c:'#f5b82e';let dust=[],animT=0;
  const spr=RUNNER_SPRITES[S.avatar],sImg=spr?new Image():null;if(sImg)sImg.src='assets/corredor/'+S.avatar+'.webp';
  const corredor=(feet,ph,air)=>{if(sImg&&sImg.complete&&sImg.naturalWidth)drawSprite(x,sImg,spr,140,feet,ph,air,animT);else drawRunner(x,img,140,feet,ph,air,col)};
  let p,obs,coins,sp,dist,run=false,got,raf,frame;
  const reset=()=>{p={y:420,vy:0,j:0};obs=[];coins=[];sp=7;dist=0;got=0;frame=0;dust=[]};
  const jump=()=>{if(!run)return;if(p.j<2){p.vy=-15;p.j++;sfx('click')}};
  const loop=()=>{if(CUR!=='runner'){run=false;return}frame++;
    x.fillStyle='#ff9f5a';x.fillRect(0,0,1100,560);const g=x.createLinearGradient(0,0,0,480);g.addColorStop(0,'#3a1c5c');g.addColorStop(1,'#ff7a4d');x.fillStyle=g;x.fillRect(0,0,1100,480);
    x.fillStyle='#2a140a';for(let i=0;i<6;i++){const bx=((i*260-dist*1.5)%1560+1560)%1560-200;x.fillRect(bx,300,40,180);x.beginPath();x.ellipse(bx+20,300,90,30,0,0,7);x.fill()}
    x.fillStyle='#4a2410';x.fillRect(0,480,1100,80);
    p.vy+=.8;p.y+=p.vy;if(p.y>=420){p.y=420;p.vy=0;p.j=0}
    // poeira dos passos
    const air=p.y<420;if(!air&&frame%6===0)dust.push({x:128,y:478,r:3+Math.random()*3,a:.5});
    dust.forEach(d=>{d.x-=sp*.6;d.y-=.3;d.r+=.25;d.a-=.02;x.fillStyle=`rgba(255,214,170,${Math.max(0,d.a)})`;x.beginPath();x.arc(d.x,d.y,d.r,0,7);x.fill()});dust=dust.filter(d=>d.a>0);
    animT+=sp*.085;corredor(p.y+60,dist*.55,air);
    if(frame%Math.max(40,Math.round(95-sp*3))===0&&Math.random()<.8)obs.push({x:1120,w:44,h:ri(44,70)});
    if(frame%50===0)coins.push({x:1120,y:ri(250,420)});
    obs.forEach(o=>{o.x-=sp;x.fillStyle='#3b3450';x.fillRect(o.x,480-o.h,o.w,o.h);x.fillStyle='#ff4d8d';x.fillRect(o.x,480-o.h,o.w,8)});
    coins.forEach(c=>{c.x-=sp;if(!c.got){x.font='34px serif';x.fillText('🐚',c.x,c.y);if(Math.abs(c.x-128)<38&&Math.abs(c.y-(p.y-10))<70){c.got=true;got++;sfx('coin')}}});
    obs=obs.filter(o=>o.x>-60);coins=coins.filter(c=>c.x>-60);
    const hitO=obs.some(o=>o.x<168&&o.x+o.w>112&&p.y+60>480-o.h);
    dist+=sp/10;sp+=.004;document.getElementById('rd').textContent=`${Math.floor(dist)} m · 🐚 ${got}`;
    x.fillStyle='#fff';x.font='bold 30px "Saira Condensed",sans-serif';x.fillText(Math.floor(dist)+' m',960,50);
    if(hitO){run=false;sfx('lose');const d=Math.floor(dist);stMax('runBest',d);Audio.play('menu');miniReward(d/10+got*4,160,`Corrida: ${d} m e ${got} cauris`);return}
    raf=requestAnimationFrame(loop)};
  const intro=()=>{reset();x.fillStyle='#3a1c5c';x.fillRect(0,0,1100,560);x.fillStyle='#4a2410';x.fillRect(0,480,1100,80);corredor(480,0,false);x.fillStyle='#f5b82e';x.font='40px "Permanent Marker",cursive';x.textAlign='left';x.fillText('Pronto para correr?',360,280)};
  intro();img.onload=()=>{if(!run)intro()};if(sImg)sImg.onload=()=>{if(!run)intro()};
  document.getElementById('rgo2').onclick=e=>{e.target.disabled=true;reset();run=true;Audio.genre=null;Audio.play('afrobeat');loop()};
  cv.onpointerdown=jump;document.onkeydown=e=>{if(CUR==='runner'&&(e.code==='Space'||e.key==='ArrowUp')){e.preventDefault();jump()}}};
