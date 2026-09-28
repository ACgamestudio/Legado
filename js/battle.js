// ===================== COMBATE =====================
let B=null;
const HPOS=[[150,140],[400,290],[150,450]], EPOS=[[1150,140],[1340,290],[1150,450]], EPOS_B=[[1395,150],[1395,420]];
const statMods=()=>({atk:0,def:0,spd:0,hp:0,crit:0,shield:0,drop:0,heal:0,regen:0,ult:0,coin:0,stun:0,energy:0,startEnergy:0,lifesteal:0});
function teamMods(ids,extra){
  const m=statMods(),g=globalMods();
  m.atk+=g.atk+g.all;m.def+=g.def+g.all;m.hp+=g.hp+g.all;m.spd+=g.all;m.coin+=g.coin;m.startEnergy+=g.startEnergy;
  ids.forEach(id=>{const p=CH[id].pas;({teamSpd:()=>m.spd+=p.v,teamAtk:()=>m.atk+=p.v,teamAll:()=>{m.atk+=p.v;m.def+=p.v;m.hp+=p.v;m.spd+=p.v},energyGain:()=>m.energy+=p.v,regen:()=>m.regen+=p.v,coin:()=>m.coin+=p.v,drop:()=>m.drop+=p.v}[p.t]||(()=>{}))()});
  SYNERGIES.forEach(s=>{if(ids.includes(s.a)&&ids.includes(s.b))for(const k in s.mod)m[k]=(m[k]||0)+s.mod[k]});
  if(extra)for(const k in extra)m[k]=(m[k]||0)+extra[k];
  return m;
}
function mkHero(id,side,m,lvlOverride){
  const c=CH[id],L=lvlOverride||clv(id),g=1+.07*(L-1),p=c.pas;
  const u={id,key:id,name:charName(id),side,isChar:true,type:c.type,lvl:L,
    maxhp:Math.round(c.hp*g*(1+m.hp)*1.15), atk:c.atk*g*(1+m.atk), def:c.def*g*(1+m.def)*(p.t==='def'?1+p.v:1), spd:c.spd*(1+m.spd),
    crit:.05+m.crit+(p.t==='crit'?p.v:0), dodge:p.t==='dodge'?p.v:0, counter:p.t==='counter'?p.v:0, thorns:p.t==='thorns'?p.v:0,
    lifesteal:(p.t==='lifesteal'?p.v:0)+(m.lifesteal||0), healB:(p.t==='healBonus'?p.v:0)+m.heal, aoeB:p.t==='aoeBonus'?p.v:0, ultB:(p.t==='ultBonus'?p.v:0)+m.ult,
    debuffDur:p.t==='debuffDur'?1:0, critEnergy:id==='inventor', energyMul:1+m.energy, regen:m.regen, shieldMul:1+m.shield, stunB:m.stun,
    energy:Math.min(90,m.startEnergy), cd:0, buffs:[], shield:0, stun:false, taunt:0, alive:true};
  u.hp=u.maxhp; return u;
}
function mkEnemy(key,lvl,boss,idx){
  const E=boss?BOSSES[key]:ENEMIES[key],g=1+.1*(lvl-1);
  const u={id:key+'_'+idx,key,name:E.name,side:'e',isChar:false,boss:!!boss,type:E.type,lvl,
    maxhp:Math.round(E.hp*g*(boss?.9:1)),atk:E.atk*g,def:E.def*g,spd:E.spd,crit:.05,dodge:E.dodge||0,img:E.img,style:E.style,counter:0,thorns:0,lifesteal:0,healB:0,aoeB:0,ultB:0,debuffDur:0,energyMul:1,regen:0,shieldMul:1,stunB:0,
    energy:0,cd:0,buffs:[],shield:0,stun:false,taunt:0,alive:true,turns:0,color:TYPES[E.type].c,shape:E.shape};
  u.hp=u.maxhp; return u;
}
const bsum=(u,s)=>u.buffs.filter(b=>b.s===s).reduce((a,b)=>a+(b.neg?-b.v:b.v),0);
const eff=(u,s)=>Math.max(.2,u[s]*(1+bsum(u,s)));
const allies=u=>B.units.filter(x=>x.side===u.side&&x.alive);
const foes=u=>B.units.filter(x=>x.side!==u.side&&x.alive);
const debuffed=u=>u.buffs.some(b=>b.neg);

function startBattle(ctx){
  window.PENDING=ctx; const units=[];
  let genre='final', scene='final', lvl;
  if(ctx.mode==='duel'){
    ctx.p1.forEach(id=>units.push(mkHero(id,'h',teamMods(ctx.p1),Math.max(10,clv(id)))));
    ctx.p2.forEach(id=>units.push(mkHero(id,'e',teamMods(ctx.p2),Math.max(10,clv(id)))));
    genre='afrobeat';scene='ocidental';
  } else {
    const ids=S.team, extra=ctx.exp?ctx.exp.mods:null;
    const m=teamMods(ids,extra);
    ids.forEach(id=>{const u=mkHero(id,'h',m);if(ctx.exp&&ctx.exp.hp[id]!=null){u.hp=Math.max(0,Math.round(ctx.exp.hp[id]*u.maxhp));u.alive=u.hp>0}units.push(u)});
    if(ctx.region==='final'){lvl=25;units.push(mkEnemy('esquecimento',lvl,true,0));units.push(mkEnemy('lucifer',lvl-3,false,1));units.push(mkEnemy('brasa',lvl-3,false,2))}
    else if(ctx.mode==='expedition'){lvl=Math.max(3,S.lvl-1)+ctx.exp.room+s_('expDone')*2;
      if(ctx.exp.room===6){units.push(mkEnemy('ecoVazio',lvl,true,0));units.push(mkEnemy('sombraviva',lvl-2,false,1))}
      else{const pool=Object.keys(ENEMIES);const n=ctx.exp.room<3?2:3;for(let i=0;i<n;i++)units.push(mkEnemy(pick(pool),lvl,false,i))}
      genre='final';scene='final';}
    else{const r=RG[ctx.region];genre=r.genre;scene=r.id;
      lvl=ctx.node===9?Math.max(r.lvl+2,S.lvl):r.lvl+ctx.node;
      if(ctx.tutorial){units.push(mkEnemy('sombraviva',1,false,0));units.push(mkEnemy('necro',1,false,1));units.slice(-2).forEach(u=>{u.maxhp=u.hp=Math.round(u.hp*.6);u.atk*=.6})}
      else if(ctx.node===3){units.push(mkEnemy(r.boss,lvl,true,0));if(r.lvl>=7)units.push(mkEnemy(pick(r.enemies),lvl-2,false,1))}
      else{const n=ctx.node===2?3:2;for(let i=0;i<n;i++)units.push(mkEnemy(r.enemies[(i+ctx.node)%3],lvl,false,i))}}
  }
  B={ctx,units,round:0,queue:[],cur:null,target:{h:null,e:null},log:[],busy:false,over:false,coinBoost:0,lootBoost:false,ev:currentEvent(),ui:true,tut:ctx.tutorial?0:-1,stats:{dmg:0}};
  units.forEach(u=>{if(u.side==='h'&&!u.alive)u.hp=0});
  show('battle',scene);
  Audio.genre=null;Audio.play(genre);
  if(B.units.some(u=>u.boss)){const bo=B.units.find(u=>u.boss);setTimeout(()=>bossIntro(bo),300)}else setTimeout(nextTurn,500);
}
SCREENS.battle=scene=>`<div class="scene-wrap">${sceneBG(scene)}</div><div class="bt">
  <div class="btop"><button class="back" id="flee" aria-label="Sair da batalha">◀</button><div class="order" id="order"></div><div class="evb" title="${B.ev.desc}">${B.ev.ic} ${B.ev.name}</div></div>
  <div id="field"></div>
  <div class="bpanel"><div class="actor-info" id="ainfo"></div><div class="acts" id="acts"></div><div class="blog" id="blog"></div></div>
  <div id="cutin"></div><div id="tut"></div></div>`;
AFTER.battle=()=>{
  const f=document.getElementById('field');
  let hi=0,ei=0;
  f.innerHTML=B.units.map(u=>{let x,y;const hasBoss=B.units.some(z=>z.boss);if(u.side==='h'){[x,y]=HPOS[hi++]}else{[x,y]=u.boss?[1010,100]:(hasBoss?EPOS_B:EPOS)[ei++]}
    const art=u.isChar?portrait(u.key):u.img&&IMG[u.img]?`<img class="pt" src="${IMG[u.img]}" alt="${esc(u.name)}" draggable="false">`:enemySVG(u.shape,u.color,u.boss?u.key:null);
    return `<div class="unit ${u.side} ${u.boss?'boss':''} ${u.isChar?'char':''} ${u.img?'vil':''}" id="u_${u.id}" data-id="${u.id}" style="left:${x}px;top:${y}px;--tc:${TYPES[u.type].c}"><div class="uart">${art}</div><div class="uname">${u.isChar?`${TYPES[u.type].ic} `:''}${esc(u.isChar?short(u.key):u.name)} <small>Nv.${u.lvl}</small></div><div class="hpb"><i class="hp"></i><i class="sh"></i><span></span></div>${u.isChar?'<div class="enb"><i></i></div>':''}<div class="stt"></div><div class="tgt">▼</div></div>`}).join('');
  f.querySelectorAll('.unit').forEach(el=>el.onclick=()=>{const u=B.units.find(x=>x.id===el.dataset.id);if(!u.alive||!B.cur)return;if(u.side!==B.cur.side){B.target[B.cur.side]=u;sfx('click');draw()}});
  document.getElementById('flee').onclick=()=>{const m=modal(`<h2>Sair da batalha?</h2><p>Você não recebe recompensas desta luta.</p><button class="btn danger" id="fl">Sair</button>`);m.querySelector('#fl').onclick=()=>{B.over=true;m.remove();show(B.ctx.mode==='duel'?'multi':B.ctx.back||'hub')}};
  document.onkeydown=e=>{if(CUR!=='battle'||!B||B.busy||!B.cur||B.cur.ai===true)return;const k={'1':'basic','2':'defend','3':'special','4':'ult'}[e.key];if(k)playerAct(k)};
  draw();
};
function bossIntro(u){const c=document.getElementById('cutin');if(!c)return;c.innerHTML=`<div class="bossin">${u.img?`<img class="bossimg" src="${IMG[u.img]}" alt="">`:''}<small>Chefe · ${esc(BOSSES[u.key].power||'')}</small><h2>${u.name}</h2><p>"${BOSSES[u.key].intro}"</p></div>`;c.classList.add('on');setTimeout(()=>{c.classList.remove('on');nextTurn()},2600)}

function draw(){ if(!B||!B.ui)return;
  B.units.forEach(u=>{const el=document.getElementById('u_'+u.id);if(!el)return;
    el.classList.toggle('dead',!u.alive);el.classList.toggle('active',B.cur===u);
    el.classList.toggle('targeted',B.cur&&B.target[B.cur.side]===u&&u.alive);
    el.querySelector('.hp').style.width=Math.max(0,u.hp/u.maxhp*100)+'%';el.querySelector('.sh').style.width=Math.min(100,u.shield/u.maxhp*100)+'%';
    el.querySelector('.hpb span').textContent=`${Math.max(0,Math.ceil(u.hp))}/${u.maxhp}`;
    const en=el.querySelector('.enb i');if(en){en.style.width=Math.min(100,u.energy)+'%';el.classList.toggle('ready',u.energy>=100)}
    const ic=[];if(u.stun)ic.push('💫');if(u.taunt)ic.push('🛡');if(u.shield>0)ic.push('🔰');
    const agg={};u.buffs.forEach(b=>{agg[b.s]=(agg[b.s]||0)+(b.neg?-b.v:b.v)});for(const s in agg){const n={atk:'⚔',def:'🛡',spd:'⚡',dodge:'💨',vuln:'🎯'}[s];ic.push(`<b class="${agg[s]<0||s==='vuln'?'neg':'pos'}">${n}${agg[s]>0&&s!=='vuln'?'↑':'↓'}</b>`)}
    el.querySelector('.stt').innerHTML=ic.join('');
  });
  const ord=B.queue.slice(B.qi).filter(u=>u.alive).slice(0,8);
  document.getElementById('order').innerHTML=`<span class="rnd">Rodada ${B.round}</span>`+ord.map(u=>`<span class="oq ${u.side}">${u.isChar?portrait(u.key):u.img?`<img class="pt" src="${IMG[u.img]}" alt="">`:`<i style="background:${u.color}">${u.boss?'☠':'◉'}</i>`}</span>`).join('');
  const a=B.cur, human=a&&!a.ai&&a.isChar&&!B.over;
  const ai=document.getElementById('ainfo'),acts=document.getElementById('acts');
  if(human){const c=CH[a.key];
    ai.innerHTML=`${portrait(a.key)}<div><b>${esc(a.name)}</b><small>${B.ctx.mode==='duel'?(a.side==='h'?'Jogador 1':'Jogador 2')+' · ':''}${TYPES[a.type].ic} ${a.type} · energia ${Math.floor(a.energy)}/100</small></div>`;
    const btn=(k,n,ic,sub,dis,key)=>`<button class="act ${k}" data-k="${k}" ${dis?'disabled':''}><kbd>${key}</kbd><span class="ai">${ic}</span><b>${n}</b><small>${sub}</small></button>`;
    acts.innerHTML=btn('basic',c.basic,'⚔','Dano 100%, +25 energia',false,1)+btn('defend','Defender','🛡','+60% defesa, +20 energia',false,2)+btn('special',c.sp.name,'✦',a.cd?`Recarga: ${a.cd}`:c.sp.desc,a.cd>0,3)+btn('ult',c.ult.name,'★',a.energy>=100?c.ult.desc:`Energia ${Math.floor(a.energy)}/100`,a.energy<100,4);
    acts.querySelectorAll('.act').forEach(b=>b.onclick=()=>playerAct(b.dataset.k));
  } else {ai.innerHTML=a?`<div><b>${esc(a.name)}</b><small>agindo...</small></div>`:'';acts.innerHTML=''}
  document.getElementById('blog').innerHTML=B.log.slice(-3).map(l=>`<p>${l}</p>`).join('');
}
function log(t){B.log.push(t);if(B.ui){const bl=document.getElementById('blog');if(bl)bl.innerHTML=B.log.slice(-3).map(l=>`<p>${l}</p>`).join('')}}
function floatTxt(u,txt,cls){if(!B.ui)return;const el=document.getElementById('u_'+u.id);if(!el)return;const d=document.createElement('div');d.className='fl '+cls;d.textContent=txt;d.style.left=(40+Math.random()*80)+'px';el.appendChild(d);setTimeout(()=>d.remove(),1100);if(cls.includes('dmg')&&S.settings.motion){el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit')}}

function nextTurn(){ if(!B||B.over)return;
  if(checkEnd())return;
  if(!B.queue.length||B.qi>=B.queue.length){ B.round++;
    B.units.filter(u=>u.alive&&u.regen>0).forEach(u=>{const h=Math.round(u.maxhp*u.regen);u.hp=Math.min(u.maxhp,u.hp+h);floatTxt(u,'+'+h,'heal')});
    B.queue=B.units.filter(u=>u.alive).sort((a,b)=>eff(b,'spd')-eff(a,'spd')+Math.random()*.5-.25);B.qi=0;}
  const u=B.queue[B.qi++]; if(!u||!u.alive){nextTurn();return}
  B.cur=u; if(!B.target[u.side]||!B.target[u.side].alive)B.target[u.side]=foes(u)[0];
  if(u.stun){u.stun=false;log(`${u.name} está atordoado e perde a vez.`);floatTxt(u,'Atordoado','info');endTurn(u,600);return}
  if(u.taunt>0)u.taunt--;
  u.ai=(u.side==='e'&&B.ctx.mode!=='duel')||B.auto;
  draw();
  if(B.tut>=0&&u.side==='h')tutStep();
  if(u.ai){B.busy=true;setTimeout(()=>{if(!B||B.over)return;u.isChar?heroAI(u):enemyAct(u)},B.ui?650:0)}
  else B.busy=false;
}
function endTurn(u,delay=700){
  u.buffs.forEach(b=>b.d--);u.buffs=u.buffs.filter(b=>b.d>0);
  if(u.cd>0&&u._acted)u.cd--; u._acted=true;
  B.cur=null;draw();
  if(checkEnd())return;
  if(B.ui)setTimeout(nextTurn,delay);else nextTurn();
}
function checkEnd(){if(B.over)return true;
  const h=B.units.some(u=>u.side==='h'&&u.alive),e=B.units.some(u=>u.side==='e'&&u.alive);
  if(!h||!e){B.over=true;B.busy=true;if(B.ui)setTimeout(()=>battleEnd(h&&!e),900);else B.result=h&&!e;return true}
  return false;}

// ---------- ações ----------
function playerAct(k){const u=B.cur;if(!u||B.busy||B.over)return;
  if(k==='special'&&u.cd>0)return;if(k==='ult'&&u.energy<100)return;
  B.busy=true;doAct(u,k);}
function heroAI(u){ let k='basic'; if(u.energy>=100)k='ult';else if(u.cd===0)k='special';
  const fs=foes(u);B.target[u.side]=fs.reduce((a,b)=>a.hp<b.hp?a:b);doAct(u,k)}
function doAct(u,k){const c=CH[u.key];u._acted=true;
  if(k==='basic'){log(`${u.name}: ${c.basic}`);hit(u,B.target[u.side],1);gainEn(u,25);sfx('hit')}
  else if(k==='defend'){u.buffs.push({s:'def',v:.6,d:2});gainEn(u,20);log(`${u.name} se defende.`);floatTxt(u,'Defesa','info');sfx('buff')}
  else if(k==='special'){log(`<b>${u.name}</b> usa <b>${c.sp.name}</b>!`);runFx(u,c.sp.fx,false);u.cd=c.sp.cd+1;gainEn(u,15);if(u.side==='h')st('specials');sfx('special');combos(u)}
  else if(k==='ult'){u.energy=0;if(u.side==='h')st('ults');sfx('ult');
    const go=()=>{log(`<b>${u.name}</b>: SUPREMA <b>${c.ult.name}</b>!`);runFx(u,c.ult.fx,true);endTurn(u,900)};
    if(B.ui&&window.MEDIA&&MEDIA['esp_'+u.key]){specialVideo(MEDIA['esp_'+u.key],go)}else if(B.ui){cutIn(u,c.ult.name);setTimeout(go,1000)}else go();return}
  endTurn(u);
}
function cutIn(u,name){const c=document.getElementById('cutin');c.innerHTML=`<div class="ci" style="--tc:${TYPES[u.type].c}">${portrait(u.key)}<div><small>Suprema</small><h2>${name}</h2><p>"${pick(CH[u.key].lines)}"</p></div></div>`;c.classList.add('on');setTimeout(()=>c.classList.remove('on'),950)}
function combos(u){ if(!u.isChar)return;
  SYNERGIES.filter(s=>s.a===u.key||s.b===u.key).forEach(s=>{const pid=s.a===u.key?s.b:s.a;const p=allies(u).find(x=>x.key===pid);const t=foes(u);if(p&&t.length){
    const tg=B.target[u.side]&&B.target[u.side].alive?B.target[u.side]:t[0];log(`✨ COMBO <b>${s.name}</b>: ${short(p.key)} entra no ritmo!`);hit(p,tg,.6);if(u.side==='h')st('combos');
    if(B.ui){const el=document.getElementById('u_'+p.id);if(el){el.classList.add('combo');setTimeout(()=>el.classList.remove('combo'),700)}}}});
}
function gainEn(u,v){u.energy=Math.min(100,u.energy+v*u.energyMul)}
function tgtList(u,tg){const fs=foes(u),al=allies(u),sel=B.target[u.side]&&B.target[u.side].alive?B.target[u.side]:fs[0];
  return {one:[sel],all:fs,rand:fs.length?[pick(fs)]:[],others:fs.filter(x=>x!==sel),team:al,self:[u],ally:al.length?[al.reduce((a,b)=>a.hp/a.maxhp<b.hp/b.maxhp?a:b)]:[]}[tg]||[]}
function runFx(u,fx,isUlt){
  for(const f of fx){
    const ts=f.tg?tgtList(u,f.tg).filter(Boolean):[];
    switch(f.t){
     case 'dmg':ts.forEach(t=>{if(!t.alive)return;let m=f.m*(isUlt?1+u.ultB:1)*(f.tg==='all'?1+u.aoeB:1);if(f.bonusDebuffed&&debuffed(t))m*=2;hit(u,t,m,f.crit||(f.critDebuffed&&debuffed(t)))});break;
     case 'heal':ts.forEach(t=>heal(t,t.maxhp*f.v*(1+u.healB),u));sfx('heal');break;
     case 'buff':ts.forEach(t=>{t.buffs.push({s:f.s,v:f.v,d:f.d+1});floatTxt(t,{atk:'⚔ Ataque↑',def:'🛡 Defesa↑',spd:'⚡ Velocidade↑',dodge:'💨 Esquiva↑'}[f.s],'buff')});sfx('buff');break;
     case 'debuff':ts.forEach(t=>{t.buffs.push({s:f.s,v:f.v,d:f.d+1+u.debuffDur,neg:true});floatTxt(t,{atk:'⚔↓',def:'🛡↓',spd:'⚡↓',vuln:'🎯 Exposto'}[f.s],'debuff')});break;
     case 'shield':ts.forEach(t=>{t.shield+=t.maxhp*f.v*u.shieldMul;floatTxt(t,'🔰 Escudo','buff')});sfx('buff');break;
     case 'stun':ts.forEach(t=>{if(!t.alive)return;const p=(f.p+u.stunB)*(t.boss?.4:1);if(Math.random()<p){t.stun=true;floatTxt(t,'💫 Atordoado','debuff')}});break;
     case 'energy':ts.forEach(t=>{if(t!==u||f.tg==='self'||f.tg==='team')gainEn(t,f.v)});break;
     case 'cleanse':ts.forEach(t=>{t.buffs=t.buffs.filter(b=>!b.neg);t.stun=false});break;
     case 'taunt':u.taunt=f.d;floatTxt(u,'Provocando!','info');break;
     case 'revive':B.units.filter(x=>x.side===u.side&&!x.alive).forEach(x=>{x.alive=true;x.hp=Math.round(x.maxhp*f.v);x.buffs=[];floatTxt(x,'Revivido!','heal')});break;
     case 'coinBoost':B.coinBoost+=f.v;break;
     case 'lootBoost':B.lootBoost=true;break;
    }
  }
}
function typeMul(a,d){if(TYPES[a].beats===d)return 1.3;if(TYPES[d].beats===a)return .8;return 1}
function hit(a,t,m,forceCrit,noCounter){ if(!t||!t.alive||!a.alive)return 0;
  if(Math.random()<Math.min(.9,t.dodge+bsum(t,'dodge'))){floatTxt(t,'Esquivou!','info');return 0}
  let d=eff(a,'atk')*m*typeMul(a.type,t.type)*(50/(50+eff(t,'def')))*rnd(.92,1.08);
  if(a.isChar&&a.type===B.ev.type)d*=1.25;
  d*=1+Math.max(0,bsum(t,'vuln'));
  const cr=forceCrit||Math.random()<a.crit; if(cr){d*=1.6;if(a.side==='h')st('crits');if(a.critEnergy)gainEn(a,10)}
  d=Math.max(1,Math.round(d));
  if(a.side==='h'){stMax('maxHit',d);B.stats.dmg+=d}
  let rest=d; if(t.shield>0){const ab=Math.min(t.shield,rest);t.shield-=ab;rest-=ab}
  t.hp-=rest; floatTxt(t,(cr?'CRÍTICO ':'')+d,cr?'dmg crit':'dmg');
  if(cr)sfx('crit');
  if(typeMul(a.type,t.type)>1&&B.ui)floatTxt(t,'Vantagem!','info');
  if(t.isChar)gainEn(t,8);
  if(a.lifesteal>0)heal(a,d*a.lifesteal,a,true);
  if(t.thorns>0&&!noCounter){a.hp-=Math.round(d*t.thorns);floatTxt(a,Math.round(d*t.thorns),'dmg');if(a.hp<=0)kill(a)}
  if(t.hp<=0)kill(t);
  else if(t.counter&&!noCounter&&Math.random()<t.counter&&a.alive){floatTxt(t,'Contra-ataque!','info');hit(t,a,.6,false,true)}
  return d;
}
function heal(t,v,src,quiet){if(!t.alive)return;v=Math.round(v);const real=Math.min(v,t.maxhp-t.hp);t.hp+=real;if(src&&src.side==='h')st('heals',real);if(!quiet||real>5)floatTxt(t,'+'+v,'heal')}
function kill(t){t.alive=false;t.hp=0;log(`${t.name} caiu.`);if(!t.isChar&&B.ctx.mode!=='duel'){S.defeated=S.defeated||{};S.defeated[t.key]=(S.defeated[t.key]||0)+1}}

// ---------- IA inimiga ----------
function enemyTarget(u){const fs=foes(u);const tt=fs.filter(x=>x.taunt>0);if(tt.length)return tt[0];if(Math.random()<.35)return fs.reduce((a,b)=>a.hp/a.maxhp<b.hp/b.maxhp?a:b);return pick(fs)}
function enemyAct(u){u.turns++;const fs=foes(u);if(!fs.length){endTurn(u);return}
  const E=u.boss?BOSSES[u.key]:ENEMIES[u.key];
  if(u.boss&&u.hp<u.maxhp*.5&&!u.enraged){u.enraged=true;u.buffs.push({s:'atk',v:.25,d:99});log(`<b>${u.name}</b> fica furioso!`);floatTxt(u,'FÚRIA','debuff')}
  const skill=u.turns%3===0;
  if(u.boss&&skill){log(`<b>${u.name}</b> usa <b>${E.skill}</b>!`);sfx('ult');
    fs.forEach(t=>hit(u,t,1.05));
    const rider={reicinza:()=>fs.forEach(t=>t.buffs.push({s:'atk',v:.2,d:2,neg:true})),ladrao:()=>fs.forEach(t=>t.energy=Math.max(0,t.energy-20)),furacao:()=>fs.forEach(t=>t.buffs.push({s:'spd',v:.3,d:2,neg:true})),
      disco:()=>{const t=pick(foes(u));if(t&&Math.random()<.5){t.stun=true;floatTxt(t,'💫 Preso no loop','debuff')}},muralha:()=>{u.shield=Math.min(u.maxhp*.25,u.shield+u.maxhp*.08);floatTxt(u,'🔰','buff')},serpente:()=>{const t=pick(foes(u));if(t)hit(u,t,.8)},
      colosso:()=>fs.forEach(t=>t.buffs.push({s:'def',v:.25,d:2,neg:true})),apagao:()=>fs.forEach(t=>t.energy=Math.max(0,t.energy-30)),
      esquecimento:()=>fs.forEach(t=>{t.buffs.push({s:'atk',v:.15,d:2,neg:true});t.energy=Math.max(0,t.energy-15)}),ecoVazio:()=>fs.forEach(t=>t.buffs.push({s:'def',v:.2,d:2,neg:true}))}[u.key];
    if(rider)rider();
  } else if(skill){ const t=enemyTarget(u);
    ({debuffAtk:()=>{log(`${u.name} manipula a mente da equipe.`);hit(u,t,.7);foes(u).forEach(x=>x.buffs.push({s:'atk',v:.15,d:2,neg:true}))},
      drain:()=>{log(`${u.name} hipnotiza ${t.name} e drena sua energia.`);hit(u,t,1.1);t.energy=Math.max(0,t.energy-15);floatTxt(t,'-15 energia','debuff')},
      aoe:()=>{log(`${u.name} libera energia negativa em todos.`);foes(u).forEach(x=>hit(u,x,.6))},
      corrode:()=>{log(`${u.name} corrói as defesas da equipe.`);foes(u).forEach(x=>{hit(u,x,.45);x.buffs.push({s:'def',v:.15,d:2,neg:true})})},
      lifesteal:()=>{log(`${u.name} rouba a vitalidade de ${t.name}.`);const d=hit(u,t,1.2);heal(u,d*.6,u)},
      nuke:()=>{log(`${u.name} ataca das sombras!`);hit(u,t,1.6)},
      debuffDef:()=>{log(`${u.name} faz um ritual sombrio.`);hit(u,t,.8);t.buffs.push({s:'def',v:.3,d:2,neg:true});floatTxt(t,'🛡↓','debuff')},
      healAlly:()=>{const al=allies(u);const w=al.reduce((a,b)=>a.hp/a.maxhp<b.hp/b.maxhp?a:b);log(`${u.name} usa domínio espiritual em ${w.name}.`);heal(w,w.maxhp*.25,u);hit(u,t,.6)},
      tank:()=>{log(`${u.name} entra em modo de guerra!`);u.shield=Math.min(u.maxhp*.4,u.shield+u.maxhp*.2);floatTxt(u,'🔰','buff');hit(u,t,1.1)}}[u.style]||(()=>hit(u,t,1)))();
    sfx('special');
  } else {const t=enemyTarget(u);hit(u,t,1);sfx('hit')}
  endTurn(u);
}

// ---------- fim de batalha e recompensas ----------
function battleEnd(win){
  const ctx=B.ctx; document.onkeydown=null;
  if(ctx.mode==='duel'){st('duels');save();checkAch();sfx('win');
    const m=modal(`<div class="res"><h2>${win?'Jogador 1 venceu!':'Jogador 2 venceu!'}</h2><p>Boa partida! Duelos amistosos não alteram o progresso.</p><button class="btn gold" data-go="multi">Voltar</button></div>`,()=>show('multi'));return}
  if(ctx.mode==='expedition')return expeditionAfter(win);
  const lvl=ctx.region==='final'?25:RG[ctx.region].lvl;
  if(!win){st('losses');sfx('lose');save();
    modal(`<div class="res"><h2>A Névoa venceu desta vez</h2><p>Dicas: treine personagens em Personagens, construa na Comunidade, use combos de sinergia e aproveite a vantagem de tipos (♪ › ◈ › ⚙ › ✊ › ♪).</p><div class="rbtns"><button class="btn" data-go="${ctx.region==='final'?'hub':'region|'+ctx.region}">Voltar</button><button class="btn gold" id="retry">Tentar de novo</button></div></div>`).querySelector('#retry').onclick=()=>startBattle(ctx);return}
  sfx('win'); st('wins'); const heroes=B.units.filter(u=>u.side==='h');
  if(heroes.every(u=>u.alive))st('flawless');
  if(new Set(S.team.map(i=>CH[i].type)).size>=3)st('diverseWin');
  const m=teamMods(S.team);
  const boss=ctx.node===3||ctx.region==='final';
  let cauris=Math.round((50+lvl*12)*(boss?3:1)*(1+m.coin+B.coinBoost));
  const xp=Math.round((35+lvl*10)*(boss?2.5:1)*(ctx.tutorial?1.5:1));
  S.cauris+=cauris; const pl=gainXP(xp);
  const lv=S.team.map(id=>({id,up:gainCXP(id,Math.round(xp*.9))}));
  const rewards=[];
  // fragmentos
  if(ctx.region!=='final'){const r=RG[ctx.region];const locked=r.chars.filter(c=>!S.unlocked.includes(c));
    if(locked.length&&(Math.random()<.45||boss)){const c=pick(locked),n=boss?3:ri(1,2);const un=addFrag(c,n);rewards.push(`${portrait(c,'mini')} ${un?'<b>Desbloqueado!</b>':`+${n} fragmento(s) de ${short(c)}`}`)}}
  // colecionável
  const pool=ctx.region==='final'?ITEMS.filter(i=>i.region==='legado'&&!S.items[i.id]):ITEMS.filter(i=>i.region===ctx.region&&!S.items[i.id]);
  let chance=.35+m.drop+(boss?1:0)+(window.QUIZ_BONUS?1:0)+(B.lootBoost?1:0);const drops=[];
  while(pool.length&&Math.random()<chance&&drops.length<(boss?2:1)+(window.QUIZ_BONUS?1:0)){const it=pool.splice(Math.floor(Math.random()*pool.length),1)[0];addItem(it.id);drops.push(it);chance-=1}
  window.QUIZ_BONUS=false;
  drops.forEach(it=>rewards.push(`<span class="ric">${it.ic}</span> ${esc(it.name)}`));
  // progresso
  let chapterDone=null;
  if(ctx.region==='final'){if(!S.chDone.includes(9)){S.chDone.push(9);chapterDone=9;ITEMS.filter(i=>i.region==='legado').forEach(i=>addItem(i.id))}S.sementes+=50;st('bosses')}
  else{const r=RG[ctx.region];const prog=S.region[r.id]||0;
    if(ctx.node<9&&ctx.node>=prog)S.region[r.id]=ctx.node+1;
    if(boss){st('bosses');S.sementes+=20;rewards.push('🌱 +20 Sementes');
      if(!S.unlocked.includes(r.unlock)){unlockChar(r.unlock);rewards.push(`${portrait(r.unlock,'mini')} <b>${charName(r.unlock)} entrou para a equipe!</b>`)}
      const ch=CHAPTERS.find(c=>c.region===r.id);
      const bothDone=true;
      if(ch&&bothDone&&!S.chDone.includes(ch.n)){S.chDone.push(ch.n);S.chapter=Math.max(S.chapter,ch.n+1);chapterDone=ch.n}
    }}
  if(ctx.tutorial){S.tutorialDone=true}
  save(); checkAch();
  const next=chapterDone?()=>playChapter(chapterDone,'end',()=>show('hub')):()=>ctx.region==='final'?show('hub'):show('region',ctx.region);
  const mm=modal(`<div class="res"><small>Vitória</small><h2>${boss?'Chefe derrotado!':'A memória foi preservada!'}</h2>
   <div class="rgrid"><div><span>🐚</span><b>+${fmt(cauris)}</b><small>Cauris</small></div><div><span>✦</span><b>+${pl.n}</b><small>XP ${pl.up?`· <em>Nível ${S.lvl}!</em>`:''}</small></div></div>
   <div class="rteam">${lv.map(l=>`<div>${portrait(l.id,'mini')}<small>Nv.${clv(l.id)}${l.up?' ↑':''}</small></div>`).join('')}</div>
   ${rewards.length?`<div class="rlist">${rewards.map(r=>`<p>${r}</p>`).join('')}</div>`:''}
   ${drops.length?`<p class="note">${esc(drops[0].story)}</p>`:''}
   <button class="btn gold" id="cont">Continuar</button></div>`,next);
  mm.querySelector('#cont').onclick=()=>{mm.remove();next()};
}

// ===================== EXPEDIÇÃO SANKOFA (roguelite) =====================
function startExpedition(){const exp={room:1,mods:{},hp:{},blessings:[],cauris:0};S.team.forEach(id=>exp.hp[id]=1);startBattle({mode:'expedition',exp,back:'expedition'})}
function expeditionAfter(win){const exp=B.ctx.exp;
  B.units.filter(u=>u.side==='h').forEach(u=>exp.hp[u.key]=u.alive?u.hp/u.maxhp:0);
  if(!win){st('rooms',0);S.cauris+=exp.cauris;stMax('expBest',exp.room-1);save();checkAch();sfx('lose');
    modal(`<div class="res"><h2>Expedição encerrada</h2><p>Você chegou à sala ${exp.room}. Recompensas mantidas: 🐚 ${exp.cauris}.</p><button class="btn gold" data-go="expedition">Voltar</button></div>`,()=>show('expedition'));return}
  sfx('win');st('rooms');st('wins');const gain=Math.round((60+exp.room*30)*(1+(exp.mods.coin||0)));exp.cauris+=gain;gainXP(40+exp.room*15);S.team.forEach(id=>gainCXP(id,30+exp.room*10));
  const it=ITEMS.filter(i=>!S.items[i.id]&&i.region!=='legado');
  if(exp.room===6){st('expDone');stMax('expBest',6);S.cauris+=exp.cauris;S.sementes+=25;let tx='';if(it.length){const x=pick(it);addItem(x.id);tx=`<p>${x.ic} ${esc(x.name)}</p>`}
    save();checkAch();modal(`<div class="res"><small>Expedição concluída</small><h2>Eclipse foi derrotada</h2><p>🐚 ${exp.cauris} · 🌱 25</p>${tx}<p class="note">A próxima expedição será mais difícil.</p><button class="btn gold" data-go="expedition">Voltar</button></div>`,()=>show('expedition'));return}
  save();checkAch();
  const three=shuffle(BLESSINGS).slice(0,3);
  const rest=exp.room===2;
  const m=modal(`<div class="res"><small>Sala ${exp.room} de 6 vencida · 🐚 ${exp.cauris} acumulados</small><h2>${rest?'Fogueira: escolha uma bênção (e descanse 30%)':'Escolha uma bênção'}</h2><div class="bless">${three.map((b,i)=>`<button class="bl panel" data-i="${i}"><span>${b.ic}</span><b>${b.name}</b><small>${b.desc}</small></button>`).join('')}</div>
   <div class="rteam">${S.team.map(id=>`<div>${portrait(id,'mini')}<small>${Math.round(exp.hp[id]*100)}%</small></div>`).join('')}</div>${exp.blessings.length?`<p class="note">Bênçãos: ${exp.blessings.map(b=>b.ic+' '+b.name).join(', ')}</p>`:''}</div>`);
  m.querySelector('.mclose').style.display='none';
  m.onclick=null;
  m.querySelectorAll('.bl').forEach(b=>b.onclick=()=>{const bl=three[+b.dataset.i];exp.blessings.push(bl);
    if(bl.heal)S.team.forEach(id=>{if(exp.hp[id]>0)exp.hp[id]=Math.min(1,exp.hp[id]+bl.heal)});
    if(rest)S.team.forEach(id=>{exp.hp[id]=exp.hp[id]>0?Math.min(1,exp.hp[id]+.3):.3});
    if(bl.mod)for(const k in bl.mod)exp.mods[k]=(exp.mods[k]||0)+bl.mod[k];
    exp.room++;m.remove();sfx('buff');startBattle({mode:'expedition',exp,back:'expedition'})});
}

// ===================== TUTORIAL =====================
const TUT=[
 'Tutorial: é a sua vez! Cada personagem age na ordem de velocidade (barra no topo). Toque em um inimigo para escolher o alvo e use ⚔ Ataque básico.',
 'Ataques enchem a barra de energia (amarela). Agora experimente ✦ Especial: cada personagem tem um efeito único e ele precisa recarregar.',
 'Kayo, Luana e Kwame têm tipos diferentes: ♪ Ritmo vence ◈ Mente, que vence ⚙ Tech, que vence ✊ Corpo, que vence ♪ Ritmo. "Vantagem!" = +30% de dano.',
 'Quando a energia chegar a 100, a ★ Suprema fica disponível. Use 🛡 Defender para ganhar energia com segurança.',
 'Dica final: pares de personagens com sinergia fazem COMBOS automáticos quando um deles usa o Especial. Termine a luta!'
];
function tutStep(){const t=document.getElementById('tut');if(!t)return;if(B.tut>=TUT.length){t.innerHTML='';return}
  t.innerHTML=`<div class="tutb panel">${TUT[B.tut]}<button class="btn small">Entendi</button></div>`;t.querySelector('button').onclick=()=>{t.innerHTML=''};B.tut++}

// ===================== VÍDEOS DE ESPECIAIS =====================
// Coloque MEDIA['esp_<id do personagem>'] em js/assets.js e o vídeo toca na Suprema desse personagem.
function specialVideo(src,done){const c=document.getElementById('cutin');c.innerHTML=`<div class="spv"><video id="spv" playsinline></video><button class="btn small vskip">Pular ⏭</button></div>`;c.classList.add('on','vidon');
  const v=c.querySelector('video');const prev=Audio.mus?Audio.mus.gain.value:0;if(Audio.mus)Audio.mus.gain.value=prev*.2;
  let ended=false;const fin=()=>{if(ended)return;ended=true;v.pause();c.classList.remove('on','vidon');c.innerHTML='';if(Audio.mus)Audio.mus.gain.value=prev;done()};
  v.onended=fin;v.onerror=fin;c.querySelector('.vskip').onclick=fin;v.src=src;const p=v.play();if(p&&p.catch)p.catch(fin)}
