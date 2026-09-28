// ===================== NÚCLEO =====================
const SAVE_KEY='raizes_legado_v1';
const today=()=>new Date().toISOString().slice(0,10);
const weekNo=()=>Math.floor((Date.now()/864e5+3)/7);
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('pt-BR');

function newState(){return{
  v:1, name:'Kayo', lvl:1, xp:0, cauris:300, sementes:20,
  unlocked:['protagonista','engenheiro','capoeirista','dj','historiadora'], frags:{}, clv:{}, cxp:{},
  team:['protagonista','capoeirista','dj'], items:{}, ach:{}, build:{}, chapter:1, chDone:[],
  region:{}, stats:{}, daily:null, accent:'ouro', accents:['ouro'], avatar:'protagonista', title:'Aprendiz da Biblioteca',
  settings:{music:.45,sfx:.7,motion:true,fs:true}, tutorialDone:false, chv:2, started:false, lastLogin:null
}}
let S;
function load(){let raw=null;try{raw=localStorage.getItem(SAVE_KEY);S=raw?Object.assign(newState(),JSON.parse(raw)):newState()}catch(e){S=newState();raw=null}
  if(!S.unlocked.includes('engenheiro'))S.unlocked.push('engenheiro');
  // saves antigos tinham 8 capítulos (Caribe junto com a África Ocidental): renumera para 9
  let old=false;try{old=raw&&!JSON.parse(raw).chv}catch(e){}
  if(old){const m=n=>n<=2?n:n+1;const d=S.chDone.map(m);if(S.chDone.includes(2))d.push(3);S.chDone=[...new Set(d)].sort((a,b)=>a-b);S.chapter=S.chapter<=2?S.chapter:S.chapter+1;if(S.chDone.includes(3))S.chapter=Math.max(S.chapter,4);S.chv=2}
}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S))}catch(e){}}
function st(k,v=1){S.stats[k]=(S.stats[k]||0)+v}
function stMax(k,v){S.stats[k]=Math.max(S.stats[k]||0,v)}
const clv=id=>S.clv[id]||1;
const accent=()=>(ACCENTS.find(a=>a.id===S.accent)||ACCENTS[0]).c;
const xpNeed=l=>Math.round(100*l*1.25);
const cxpNeed=l=>60*l;
const bld=id=>S.build[id]||0;
const P=()=>S.name||'Kayo';
function short(id){if(id==='protagonista')return P();const n=CH[id].name.replace(/"[^"]*"\s*/,'').split(' ');return /^(Dra?\.|Tenente|Cmdte\.|Chef)$/.test(n[0])?n[0]+' '+n[1]:n[0]}
function charName(id){return id==='protagonista'?P():CH[id].name}

function gainXP(n){
  n=Math.round(n*(1+.05*bld('biblioteca')));
  S.xp+=n; let up=0;
  while(S.xp>=xpNeed(S.lvl)&&S.lvl<50){S.xp-=xpNeed(S.lvl);S.lvl++;up++;S.sementes+=5}
  return {n,up};
}
function gainCXP(id,n){
  S.cxp[id]=(S.cxp[id]||0)+n; let up=0;
  while(S.cxp[id]>=cxpNeed(clv(id))&&clv(id)<Math.min(40,S.lvl+2)){S.cxp[id]-=cxpNeed(clv(id));S.clv[id]=clv(id)+1;up++}
  return up;
}
function addFrag(id,n){
  if(S.unlocked.includes(id))return false;
  S.frags[id]=(S.frags[id]||0)+n;
  if(S.frags[id]>=fragNeed(id)){unlockChar(id);return true}
  return false;
}
const fragNeed=id=>({Comum:6,Rara:8,'Épica':12,'Lendária':16,'Mítica':20})[CH[id].rar];
function unlockChar(id){if(!S.unlocked.includes(id)){S.unlocked.push(id);delete S.frags[id];toast(`Novo personagem: ${charName(id)}!`,'✦');}}
function addItem(id){if(S.items[id])return false;S.items[id]=Date.now();st('items');return true}

// ---------- modificadores globais ----------
function globalMods(){
  const m={atk:.04*bld('quadra'),def:.04*bld('oficina'),hp:.04*bld('cozinha'),all:.03*bld('baoba'),coin:.06*bld('mercado'),startEnergy:4*bld('estudio')};
  return m;
}
function currentEvent(){return EVENTS[weekNo()%EVENTS.length]}

// ---------- missões diárias ----------
function ensureDaily(){
  const d=today();
  if(!S.daily||S.daily.date!==d){
    const ms=shuffle(MISSION_POOL).slice(0,3+Math.min(1,bld('centro')));
    S.daily={date:d, missions:ms.map(m=>m.id), base:Object.assign({},S.stats), claimed:[], reward:false, chest:false};
    save();
  }
}
function missionProg(mid){const m=MISSION_POOL.find(x=>x.id===mid);return Math.min(m.n,(S.stats[m.stat]||0)-(S.daily.base[m.stat]||0))}

// ---------- CONQUISTAS (50) ----------
const chDone=n=>S.chDone.includes(n);
const has=ids=>ids.every(i=>S.unlocked.includes(i));
const itemCount=()=>Object.keys(S.items).length;
const bossesDone=()=>REGIONS.filter(r=>(S.region[r.id]||0)>=4).length;
const sumB=()=>BUILDINGS.reduce((a,b)=>a+bld(b.id),0);
const s_=k=>S.stats[k]||0;
const ACHS=[
 ['primeiras_raizes','Primeiras Raízes','Conclua o Capítulo 1.','🌱',()=>chDone(1)],
 ['alem_oceano','Além do Oceano','Conclua os Capítulos 2 e 3.','🌊',()=>chDone(2)&&chDone(3)],
 ['vozes','Vozes','Conclua o Capítulo 4.','🎺',()=>chDone(4)],
 ['inventores','Mentes Inventivas','Conclua o Capítulo 5.','⚙️',()=>chDone(5)],
 ['resistencia','Caminhos Livres','Conclua o Capítulo 6.','✊🏾',()=>chDone(6)],
 ['conquistas','Grandes Conquistas','Conclua o Capítulo 7.','🏛️',()=>chDone(7)],
 ['lenda_futuro','Lenda do Futuro','Conclua o Capítulo 8.','🚀',()=>chDone(8)],
 ['guardiao_legado','Guardião do Legado','Conclua o Capítulo Final.','👑',()=>chDone(9)],
 ['primeira_vitoria','Primeira Vitória','Vença uma batalha.','⚔️',()=>s_('wins')>=1],
 ['veterano','Veterano','Vença 50 batalhas.','🛡️',()=>s_('wins')>=50],
 ['lenda_arena','Lenda da Arena','Vença 200 batalhas.','🏆',()=>s_('wins')>=200],
 ['conhecimento_poder','Conhecimento é Poder','Acerte 25 perguntas no Quiz.','📚',()=>s_('quizRight')>=25],
 ['sabio','Sábio da Vila','Acerte 100 perguntas no Quiz.','🦉',()=>s_('quizRight')>=100],
 ['colecionador','Colecionador','Encontre 10 colecionáveis.','🧺',()=>itemCount()>=10],
 ['curador','Curador','Encontre 50 colecionáveis.','🖼️',()=>itemCount()>=50],
 ['memoria_viva','Memória Viva','Encontre os 100 colecionáveis.','💎',()=>itemCount()>=100],
 ['explorador','Explorador','Vença batalhas em 4 regiões.','🧭',()=>REGIONS.filter(r=>(S.region[r.id]||0)>=1).length>=4],
 ['cidadao_mundo','Cidadão do Mundo','Derrote os 8 chefes regionais.','🌍',()=>bossesDone()>=8],
 ['voz_cultura','Voz da Cultura','Desbloqueie todos os personagens de Ritmo.','🎶',()=>has(['dj','musico','dancarina','cantora'])],
 ['mestre_arte','Mestre da Arte','Desbloqueie Zuri e Imani.','🎨',()=>has(['artista','fotografa'])],
 ['inventor','Inventor','Desbloqueie todos os personagens de Tech.','🔧',()=>has(['engenheiro','inventor','astronauta','cientista'])],
 ['mestre_comunidade','Mestre da Comunidade','Construa todos os prédios da Vila.','🏘️',()=>BUILDINGS.every(b=>bld(b.id)>=1)],
 ['arquiteto','Arquiteto do Amanhã','Some 20 níveis de construção.','🏗️',()=>sumB()>=20],
 ['baoba_ancestral','Sombra do Baobá','Leve o Baobá Ancestral ao nível máximo.','🌳',()=>bld('baoba')>=5],
 ['equipe_completa','Muitas Vozes','Desbloqueie 10 personagens.','👥',()=>S.unlocked.length>=10],
 ['todos_juntos','Eu Sou Porque Nós Somos','Desbloqueie todos os personagens.','🤝',()=>S.unlocked.length>=CHARS.length],
 ['sinergia','Sinergia','Faça seu primeiro combo.','✨',()=>s_('combos')>=1],
 ['mestre_combos','Mestre dos Combos','Faça 50 combos.','💫',()=>s_('combos')>=50],
 ['especialista','Especialista','Use 100 habilidades especiais.','🔷',()=>s_('specials')>=100],
 ['supremo','Supremo','Use 25 supremas.','🌟',()=>s_('ults')>=25],
 ['critico','Olho Clínico','Acerte 50 golpes críticos.','🎯',()=>s_('crits')>=50],
 ['golpe_mestre','Golpe de Mestre','Cause 300 de dano em um único golpe.','💥',()=>s_('maxHit')>=300],
 ['curandeiro','Mãos que Curam','Cure 5.000 de vida no total.','💚',()=>s_('heals')>=5000],
 ['sem_arranhoes','Sem Arranhões','Vença uma batalha sem perder nenhum personagem.','🩹',()=>s_('flawless')>=1],
 ['ritmo_perfeito','Ritmo Perfeito','Faça 80% de precisão na Roda de Ritmo.','🥁',()=>s_('rhythmBest')>=80],
 ['memoria_elefante','Memória de Elefante','Complete a Memória em até 12 jogadas.','🐘',()=>s_('memoryBest')>0&&s_('memoryBest')<=12],
 ['corredor','Maratonista','Corra 1.000 metros na Corrida do Baobá.','🏃🏾',()=>s_('runBest')>=1000],
 ['quiz_perfeito','Nota Dez','Acerte 8 de 8 no Quiz.','💯',()=>s_('quizPerfect')>=1],
 ['expedicionario','Expedicionário','Conclua uma Expedição Sankofa.','🐦',()=>s_('expDone')>=1],
 ['fundo_memoria','Fundo da Memória','Conclua 3 Expedições Sankofa.','🌀',()=>s_('expDone')>=3],
 ['duelista','Duelista Amistoso','Jogue um Duelo Local.','🤜🏾',()=>s_('duels')>=1],
 ['nivel10','Crescendo','Chegue ao nível 10.','📈',()=>S.lvl>=10],
 ['nivel25','Referência','Chegue ao nível 25.','🏅',()=>S.lvl>=25],
 ['treinador','Treinador','Treine personagens 10 vezes.','🏋🏾',()=>s_('trains')>=10],
 ['poupanca','Cofre da Cooperativa','Tenha 5.000 Cauris.','🐚',()=>S.cauris>=5000],
 ['fiel','Presença Diária','Resgate a recompensa diária 7 vezes.','📅',()=>s_('dailyClaims')>=7],
 ['missionario','Mão na Massa','Conclua 20 missões diárias.','✅',()=>s_('missionsDone')>=20],
 ['estilo','Estilo Próprio','Personalize seu perfil.','🪮',()=>s_('custom')>=1],
 ['lenda_viva','Lenda Viva','Leve um personagem ao nível 20.','⭐',()=>Object.values(S.clv).some(l=>l>=20)],
 ['diversidade','Diferentes Origens','Vença com 3 personagens de tipos diferentes.','🌈',()=>s_('diverseWin')>=1]
];
function checkAch(){
  let any=false;
  for(const a of ACHS){ if(!S.ach[a[0]]&&a[4]()){S.ach[a[0]]=Date.now();S.sementes+=10;toast(`Conquista: ${a[1]} (+10 Sementes)`,a[3]);any=true;sfx('ach')} }
  if(any)save();
}

// ===================== ÁUDIO (trilha procedural original) =====================
const Audio={ctx:null, master:null, mus:null, fx:null, timer:null, step:0, next:0, genre:null, startTime:0, seed:1,
  init(){ if(this.ctx)return; try{this.ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return}
    this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);
    this.mus=this.ctx.createGain();this.mus.connect(this.master);this.fx=this.ctx.createGain();this.fx.connect(this.master);
    const n=this.ctx.createBuffer(1,this.ctx.sampleRate,this.ctx.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;this.noise=n;
    this.vol();
  },
  vol(){Theme.vol();if(!this.ctx)return;this.mus.gain.value=S.settings.music*.5;this.fx.gain.value=S.settings.sfx*.6},
  resume(){this.init();if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume()},
  play(g){ if(Theme.on)return; this.init(); if(!this.ctx)return; if(this.genre===g)return; this.stop(); this.genre=g; const G=GENRES[g]; if(!G)return;
    this.step=0; this.startTime=this.next=this.ctx.currentTime+.08; this.seed=[...g].reduce((a,c)=>a+c.charCodeAt(0),7);
    this.timer=setInterval(()=>this.tick(),25);
  },
  stop(){clearInterval(this.timer);this.timer=null;this.genre=null},
  stepDur(){const G=GENRES[this.genre];return 60/G.bpm/(G.steps===12?3:4)},
  rand(){this.seed=(this.seed*9301+49297)%233280;return this.seed/233280},
  tick(){ const G=GENRES[this.genre]; if(!G)return; const sd=this.stepDur();
    while(this.next<this.ctx.currentTime+.12){ this.sched(G,this.step,this.next); this.next+=sd*((G.swing&&this.step%2===0)?1+G.swing:(G.swing?1-G.swing:1)); this.step++; }
  },
  sched(G,s,t){ const n=G.steps||16, i=s%n, bar=Math.floor(s/n), ch=G.prog[bar%G.prog.length];
    const at=(p)=>p&&p[i%p.length]==='x';
    if(at(G.kick))this.kick(t,G.kickF||1);
    if(at(G.snare))this.snare(t);
    if(at(G.hat))this.hat(t,G.hatLen||.03);
    if(at(G.perc))this.perc(t,G.percF||600);
    if(at(G.bass)){const deg=G.bassDeg?G.bassDeg[(i+bar)%G.bassDeg.length]:0;this.tone(t,this.freq(G,ch+deg,-2),G.bassLen||.25,G.bassWave||'triangle',.28,G.log)}
    if(at(G.chord)){[0,2,4].forEach(d=>this.tone(t,this.freq(G,ch+d,0),.12,'square',.035))}
    if(G.pad&&i===0){[0,2,4].forEach(d=>this.tone(t,this.freq(G,ch+d,0),60/G.bpm*4,'sawtooth',.03,false,true))}
    if(at(G.lead)&&this.rand()<(G.leadP||.6)){this.li=(this.li||0)+Math.floor(this.rand()*5)-2;this.li=Math.max(-2,Math.min(9,this.li));this.tone(t,this.freq(G,ch+this.li,1),G.leadLen||.18,G.leadWave||'triangle',.07)}
  },
  freq(G,deg,oct){const sc=G.scale,L=sc.length;const o=Math.floor(deg/L);const d=((deg%L)+L)%L;return 220*Math.pow(2,(G.root+sc[d])/12+o+oct)},
  env(g,t,a,dur,v){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+dur)},
  kick(t,f){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.frequency.setValueAtTime(130*f,t);o.frequency.exponentialRampToValueAtTime(42*f,t+.12);this.env(g,t,.005,.3,.9);o.connect(g);g.connect(this.mus);o.start(t);o.stop(t+.32)},
  noiseHit(t,type,f,dur,v,out){const s=this.ctx.createBufferSource();s.buffer=this.noise;const fl=this.ctx.createBiquadFilter();fl.type=type;fl.frequency.value=f;const g=this.ctx.createGain();this.env(g,t,.002,dur,v);s.connect(fl);fl.connect(g);g.connect(out||this.mus);s.start(t,Math.random()*.5);s.stop(t+dur+.02)},
  snare(t){this.noiseHit(t,'bandpass',1800,.14,.35)},
  hat(t,l){this.noiseHit(t,'highpass',7000,l,.12)},
  perc(t,f){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.7,t+.08);this.env(g,t,.003,.1,.18);o.connect(g);g.connect(this.mus);o.start(t);o.stop(t+.12)},
  tone(t,f,dur,wave,v,slide,soft){const o=this.ctx.createOscillator(),g=this.ctx.createGain(),fl=this.ctx.createBiquadFilter();o.type=wave;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(f*.5,t+dur);fl.type='lowpass';fl.frequency.value=soft?1400:3200;this.env(g,t,soft?.4:.01,dur,v);o.connect(fl);fl.connect(g);g.connect(this.mus);o.start(t);o.stop(t+dur+.05)},
};
const GENRES={
 menu:{bpm:98,root:-3,scale:[0,2,3,5,7,9,10],prog:[0,3,4,3],kick:'x.....x...x.....',hat:'..x...x...x...x.',perc:'x.x.xx.x.x.xx.x.',percF:900,bass:'x..x..x...x.x...',bassDeg:[0,0,4,2,0,4],lead:'x.x...x.x.x...x.',leadP:.45,pad:true},
 samba:{bpm:100,root:0,scale:[0,2,4,5,7,9,11],prog:[0,3,4,0],kick:'....x.......x...',kickF:.8,snare:'x..x..x..x..x.x.',hat:'xxxxxxxxxxxxxxxx',hatLen:.02,perc:'x.xx.x.x.x.xx.x.',percF:1100,bass:'x...x.x.x...x.x.',bassDeg:[0,4,0,4],lead:'x.xx.x..x.x.x..x',leadP:.55,chord:'..x...x...x..x..'},
 afrobeat:{bpm:110,root:2,scale:[0,2,3,5,7,9,10],prog:[0,0,3,0],kick:'x...x..x..x.x...',snare:'....x.......x...',hat:'..x...x...x...x.',hatLen:.07,perc:'x.x.xx.x.x.xx.x.',percF:1500,bass:'x.xx..x.x.x..x..',bassDeg:[0,0,2,4,3,0],chord:'.x.x.x.x.x.x.x.x',lead:'x...x.x...x.x...',leadP:.5},
 reggae:{bpm:76,root:-2,scale:[0,2,3,5,7,8,10],prog:[0,3,0,4],kick:'........x.......',snare:'........x.......',hat:'x.x.x.x.x.x.x.x.',chord:'....x.......x...',bass:'x..x..x.....x.x.',bassDeg:[0,0,2,4,0],bassWave:'sine',lead:'x.....x...x.....',leadP:.4},
 jazz:{bpm:130,root:-4,scale:[0,3,5,6,7,10],prog:[0,2,0,3],swing:.18,kick:'x.......x.......',snare:'......x.......x.',hat:'x..xx..xx..xx..x',hatLen:.05,bass:'x...x...x...x...',bassDeg:[0,2,3,4,5,4,3,2],lead:'x.xx.x.xx.x..xx.',leadP:.6,leadWave:'square'},
 amapiano:{bpm:112,root:-5,scale:[0,2,3,5,7,8,10],prog:[0,5,3,4],kick:'x...x...x...x...',hat:'xxxxxxxxxxxxxxxx',hatLen:.015,perc:'...x..x....x..x.',percF:700,bass:'..x...x.x..x....',bassDeg:[0,0,3,4],bassWave:'sine',bassLen:.35,log:true,pad:true,lead:'x.......x...x...',leadP:.5},
 cumbia:{bpm:95,root:-1,scale:[0,2,4,5,7,9,10],prog:[0,4,0,4],kick:'x...x...x...x...',snare:'..x...x...x...x.',hat:'x.xxx.xxx.xxx.xx',hatLen:.02,bass:'x.....x.x.....x.',bassDeg:[0,4],lead:'x.xx..x.x.xx..x.',leadP:.6,leadWave:'square'},
 ethio:{bpm:105,root:1,steps:12,scale:[0,2,3,7,8],prog:[0,0,3,0],kick:'x.....x.....',snare:'...x.....x..',hat:'x.xx.xx.xx.x',perc:'x..x..x.x.x.',percF:800,bass:'x..x..x..x..',bassDeg:[0,0,3,2],lead:'x.x.xx.x.x.x',leadP:.55},
 afrofuturo:{bpm:118,root:3,scale:[0,2,3,7,9],prog:[0,3,1,4],kick:'x...x...x...x...',snare:'....x.......x...',hat:'..x...x...x...x.',hatLen:.08,perc:'x.xx.x.xx.x.x.xx',percF:1800,bass:'xx.x.xx.xx.x.xx.',bassDeg:[0,0,2,0],bassWave:'sawtooth',bassLen:.12,pad:true,lead:'xxxxxxxxxxxxxxxx',leadP:.35,leadLen:.1,leadWave:'sawtooth'},
 final:{bpm:92,root:-3,scale:[0,2,3,5,7,8,10],prog:[0,5,3,4],kick:'x.....x...x.....',snare:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',perc:'x.x.xx.x.x.xx.x.',percF:600,bass:'x..x..x...x.x...',bassDeg:[0,0,4,2],pad:true,lead:'x...x...x.x.x...',leadP:.5}
};
function sfx(k){ if(!Audio.ctx)return; const t=Audio.ctx.currentTime, A=Audio;
  const tone=(f,d,w,v,dl=0,slide)=>{const o=A.ctx.createOscillator(),g=A.ctx.createGain();o.type=w;o.frequency.setValueAtTime(f,t+dl);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dl+d);A.env(g,t+dl,.005,d,v);o.connect(g);g.connect(A.fx);o.start(t+dl);o.stop(t+dl+d+.05)};
  ({click:()=>tone(900,.05,'square',.08),hit:()=>{A.noiseHit(t,'lowpass',900,.12,.5,A.fx);tone(160,.1,'sine',.3,0,60)},
   crit:()=>{A.noiseHit(t,'lowpass',1400,.2,.6,A.fx);tone(300,.18,'sawtooth',.2,0,80)},
   heal:()=>[523,659,784].forEach((f,i)=>tone(f,.2,'sine',.12,i*.07)),
   buff:()=>[392,494,587].forEach((f,i)=>tone(f,.15,'triangle',.12,i*.05)),
   special:()=>{tone(220,.3,'sawtooth',.12,0,880);A.noiseHit(t+.1,'bandpass',2000,.2,.3,A.fx)},
   ult:()=>{[262,330,392,523,659].forEach((f,i)=>tone(f,.4,'sawtooth',.1,i*.06));A.noiseHit(t+.3,'lowpass',600,.6,.6,A.fx)},
   win:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.3,'triangle',.15,i*.12)),
   lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.35,'triangle',.12,i*.15)),
   coin:()=>{tone(1318,.08,'square',.06);tone(1760,.12,'square',.06,.06)},
   ach:()=>[784,988,1175,1568].forEach((f,i)=>tone(f,.25,'triangle',.12,i*.08)),
   miss:()=>tone(140,.12,'square',.08),
   perfect:()=>tone(1568,.07,'triangle',.12),good:()=>tone(1046,.07,'triangle',.1)
  }[k]||(()=>{}))();
}

// ===================== TOAST =====================
function toast(msg,ic='★'){const w=document.getElementById('toasts');if(!w)return;const d=document.createElement('div');d.className='toast';d.innerHTML=`<span class="ti">${ic}</span><span>${esc(msg)}</span>`;w.appendChild(d);setTimeout(()=>d.classList.add('out'),3200);setTimeout(()=>d.remove(),3800)}

// ===================== TEMA MUSICAL (musica.mp3) =====================
// Toca por baixo da voz na abertura e continua no menu até o jogo começar.
const Theme={el:null,on:false,duck:false,fade:null,
  get(){if(!this.el){this.el=document.createElement('audio');this.el.src=MEDIA.musica;this.el.loop=true;this.el.preload='auto'}return this.el},
  unlock(){const a=this.get();a.muted=true;const p=a.play();if(p&&p.then)p.then(()=>{a.pause();a.muted=false;a.currentTime=0}).catch(()=>{a.muted=false})},
  target(){return Math.min(1,S.settings.music*(this.duck?.55:1.4))},
  vol(){if(this.el&&this.on){clearInterval(this.fade);this.el.volume=this.target()}},
  play(fromStart){const a=this.get();this.on=true;this.duck=CUR==='video';clearInterval(this.fade);if(fromStart)a.currentTime=0;a.volume=this.target();a.muted=false;const p=a.play();if(p&&p.catch)p.catch(()=>{});Audio.stop()},
  stop(){if(!this.el||!this.on)return;this.on=false;const a=this.el;clearInterval(this.fade);this.fade=setInterval(()=>{a.volume=Math.max(0,a.volume-.05);if(a.volume<=0.01){clearInterval(this.fade);a.pause()}},60)},
  // A música tema toca em todas as telas de menu; só sai na história, batalhas, regiões e minigames com trilha própria
  menus:['menu','intro','exit','hub','chars','collection','community','missions','events','achievements','customize','settings','multi','expedition','story','map','challenges','team','memory','quiz'],
  route(name){ if(name==='start'||name==='video')return;
    if(this.menus.includes(name)){ this.duck=false; Audio.stop(); if(!this.on||this.get().paused)this.play(false);else this.vol(); }
    else this.stop(); }
};
