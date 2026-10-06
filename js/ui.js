// ===================== INTERFACE =====================
const stage=()=>document.getElementById('stage');
let CUR='menu';
function fit(){const vv=window.visualViewport,w=vv?vv.width:innerWidth,h=vv?vv.height:innerHeight;const s=Math.min(w/1600,h/900);const el=document.getElementById('stage');el.style.transform=`translate(${(w-1600*s)/2}px,${(h-900*s)/2}px) scale(${s})`;document.getElementById('rot').style.display=(h>w*1.15)?'flex':'none'}
function show(name,...a){CUR=name;if(typeof Voice!=='undefined')Voice.stop();Audio.resume();Theme.route(name,a);const f=SCREENS[name];stage().innerHTML=`<div class="screen scr-${name}">${f(...a)}</div>`;document.documentElement.style.setProperty('--acc',accent());bindAll();if(AFTER[name])AFTER[name](...a);}
function bindAll(){stage().querySelectorAll('[data-go]').forEach(b=>b.onclick=e=>{e.stopPropagation();sfx('click');const [n,...args]=b.dataset.go.split('|');show(n,...args)})}
const AFTER={};
// Fundo de cada região = imagem do capítulo dela (assets/capitulos); se não houver, usa assets/fundos; senão, o desenho
const REGION_CH={brasil:1,ocidental:2,caribe:3,eua:4,austral:5,latina:6,oriental:7,futuro:8,final:9};
// Todo fundo ganha a camada viva (poeira brilhante + troca de luz); o zoom lento vem do CSS em .scene
function sceneBG(id){const src=IMG['ch_'+REGION_CH[id]]||IMG['bg_'+id];return (src?`<div class="scene photo" style="background-image:url(${src})"></div>`:sceneSVG(id))+LiveFX.layer()}
function portrait(id,cls=''){return `<img class="pt ${cls}" src="${IMG[id]}" alt="${esc(charName(id))}" draggable="false">`}
function typeTag(t){const T=TYPES[t];return `<span class="tt" style="--tc:${T.c}">${T.ic} ${t}</span>`}
function rarTag(r){return `<span class="rt" style="--rc:${RAR[r].c}">${'◆'.repeat(RAR[r].n)} ${r}</span>`}
function wallet(){return `<div class="wallet"><button class="chip me" data-go="customize">${portrait(S.avatar,'av')}<span><b>${esc(P())}</b><small>Nv. ${S.lvl}</small><i class="xpb"><i style="width:${S.xp/xpNeed(S.lvl)*100}%"></i></i></span></button><span class="chip cur" title="Cauris: moeda do jogo, ganha em batalhas e missões">🐚 ${fmt(S.cauris)}</span><span class="chip cur" title="Sementes: ganhas em conquistas, chefes e missões">🌱 ${fmt(S.sementes)}</span><button class="chip gear" data-go="settings" aria-label="Configurações">⚙</button></div>`}
function topbar(title,back='hub'){return `<header class="top"><button class="back" data-go="${back}" aria-label="Voltar">◀</button><h1>${title}</h1>${wallet()}</header>`}
function modal(html,onClose){const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="mbox">${html}<button class="mclose" aria-label="Fechar">✕</button></div>`;stage().appendChild(m);const close=()=>{m.remove();onClose&&onClose()};m.querySelector('.mclose').onclick=close;m.onclick=e=>{if(e.target===m)close()};m.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{m.remove();sfx('click');const [n,...args]=b.dataset.go.split('|');show(n,...args)});return m}

const SCREENS={
// ---------------------------- MENU (arte do cliente) ----------------------------
menu(){
  const ev=currentEvent();
  return `<div class="menu-bg" style="background-image:url(${IMG.menu})"></div>${LiveFX.layer()}
  <nav class="menu-hot" aria-label="Menu principal">
    <button class="hot" style="left:19px;top:362px;width:416px;height:60px" data-act="play" aria-label="Jogar"></button>
    <button class="hot" style="left:48px;top:435px;width:344px;height:58px" data-go="story" aria-label="Modo história"></button>
    <button class="hot" style="left:48px;top:502px;width:344px;height:58px" data-go="multi" aria-label="Multiplayer"></button>
    <button class="hot" style="left:48px;top:569px;width:344px;height:58px" data-go="chars" aria-label="Personagens"></button>
    <button class="hot" style="left:48px;top:636px;width:344px;height:58px" data-go="collection" aria-label="Coleção"></button>
    <button class="hot" style="left:48px;top:703px;width:344px;height:60px" data-go="settings" aria-label="Configurações"></button>
    <button class="hot" style="left:48px;top:772px;width:344px;height:59px" data-go="exit" aria-label="Sair"></button>
    <button class="hot evhot" style="left:1115px;top:667px;width:456px;height:118px" data-go="events" aria-label="Evento especial"></button>
  </nav>
  <div class="menu-tip">Evento da semana: <b>${ev.ic} ${ev.name}</b></div>
  <button class="intro-again" data-act="replay" aria-label="Rever a abertura">▶ Rever abertura</button>`},

// ---------------------------- TELA INICIAR ----------------------------
start(){return `<div class="start">
  <div class="kb kb1" style="background-image:url(${IMG.cidade1})"></div><div class="kb kb2" style="background-image:url(${IMG.cidade2})"></div>${LiveFX.layer()}
  <div class="start-shade"></div>
  <div class="start-in">${LOGO(1.25)}<p class="slogan">Nossa história é o nosso maior poder.</p>
  <button class="btn gold iniciar" id="iniciar">▶ INICIAR</button><small class="start-hint">Toque para entrar em tela cheia</small></div>
  <div class="start-foot">AC GAMES apresenta</div></div>`},

// ---------------------------- VÍDEOS ----------------------------
video(){return `<div class="vid"><video id="vp" playsinline preload="auto"></video><button class="btn small vskip" id="vskip">Pular ⏭</button></div>`},

// ---------------------------- PRIMEIRO ACESSO ----------------------------
intro(){return `<div class="scene-wrap">${sceneBG('brasil')}</div><div class="intro">${LOGO(1.1)}<p class="slogan">Nossa história é o nosso maior poder.</p>
  <div class="panel introbox"><div class="introrow">${portrait('protagonista','big')}<div><h2>Como você quer ser chamado?</h2><p>Você é quem o Livro Sankofa escolheu. Seu nome aparece na história e no perfil.</p>
  <input id="nm" maxlength="14" value="${esc(S.name)}" aria-label="Nome do protagonista"><button class="btn gold" id="go1">Começar a jornada</button></div></div></div></div>`},

// ---------------------------- HUB ----------------------------
hub(){ Audio.play('menu'); ensureDaily();
  const ch=CHAPTERS.find(c=>c.n===S.chapter)||CHAPTERS[8], done=S.chDone.includes(9);
  const ev=currentEvent();
  const miss=S.daily.missions.map(id=>{const m=MISSION_POOL.find(x=>x.id===id);const p=missionProg(id);return `<li class="${p>=m.n?'ok':''}"><span>${m.text}</span><b>${p}/${m.n}</b></li>`}).join('');
  const tiles=[['map','🗺️','Mapa-mundi','8 regiões para explorar'],['expedition','🐦','Expedição Sankofa','Roguelite: 6 salas, bênçãos aleatórias'],['challenges','⏱️','Desafios rápidos','Ritmo, memória, quiz e corrida'],['community','🏘️','Comunidade','Construa a Vila Baobá'],['missions','✅','Missões e recompensas','Diárias, baú gratuito'],['achievements','🏆','Conquistas',`${Object.keys(S.ach).length}/50`],['chars','👥','Personagens',`${S.unlocked.length}/${CHARS.length}`],['collection','📚','Coleção',`${itemCount()}/100 itens`],['events','🎉','Eventos',ev.name],['customize','🪮','Personalização','Nome, avatar, cores']];
  return topbar('Vila Baobá','menu')+`<div class="hub">
   <button class="hero-card" data-act="continue">${sceneBG(ch.region==='final'?'final':ch.region)}<div class="hc-in"><small>${done?'Jornada concluída: continue explorando':'Continuar história'}</small><h2>${done?'Nosso Legado':`Capítulo ${ch.n}: ${ch.title}`}</h2><p>${done?'Volte a qualquer região, complete coleções e encare a Expedição Sankofa.':(RG[ch.region]?RG[ch.region].desc:'O confronto final na Vila Baobá.')}</p><span class="btn gold">▶ Jogar</span></div><div class="hc-team">${S.team.map(id=>portrait(id)).join('')}</div></button>
   <div class="tiles">${tiles.map(t=>`<button class="tile" data-go="${t[0]}"><span class="ti">${t[1]}</span><b>${t[2]}</b><small>${esc(t[3])}</small></button>`).join('')}</div>
   <aside class="side panel"><h3>Missões de hoje</h3><ul class="mlist">${miss}</ul><button class="btn small" data-go="missions">Ver recompensas</button><div class="evbox"><span>${ev.ic}</span><div><b>${ev.name}</b><small>${ev.desc}</small></div></div></aside>
  </div>`},

// ---------------------------- MAPA ----------------------------
map(){ Audio.play('menu');
  const pos={brasil:[520,560],ocidental:[800,380],caribe:[380,380],eua:[300,220],austral:[930,640],latina:[430,520],oriental:[1040,420],futuro:[1250,200]};
  const nodes=REGIONS.map(r=>{const open=r.ch<=S.chapter||S.chDone.includes(r.ch);const prog=S.region[r.id]||0;const [x,y]=pos[r.id];
    return `<button class="mnode ${open?'':'locked'} ${prog>=4?'done':''}" style="left:${x}px;top:${y}px;--c1:${r.c1};--c2:${r.c2}" ${open?`data-go="region|${r.id}"`:''}><span class="mdot">${prog>=4?'★':open?prog+'/4':'🔒'}</span><b>${r.name}</b><small>${open?`Nv. recomendado ${r.lvl}`:`Capítulo ${r.ch}`}</small></button>`}).join('');
  return topbar('Mapa-mundi')+`<div class="worldmap"><svg class="wm" viewBox="0 0 1600 780"><defs><pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2" fill="#f5b82e" opacity=".18"/></pattern></defs>
   <path d="M150 120 Q250 60 420 110 L470 220 Q400 300 440 360 Q520 380 600 460 Q620 560 560 660 Q520 720 480 700 Q420 600 430 520 Q360 460 330 400 Q260 330 200 250z" fill="url(#dots)" stroke="#f5b82e33" stroke-width="2"/>
   <path d="M720 260 Q820 200 960 240 Q1060 260 1100 340 Q1120 420 1060 470 Q1020 560 980 640 Q940 700 900 690 Q860 600 860 520 Q800 480 740 420 Q700 340 720 260z" fill="url(#dots)" stroke="#f5b82e33" stroke-width="2"/>
   <path d="M1180 120 Q1300 80 1420 140 Q1440 240 1320 280 Q1220 260 1180 120z" fill="#00e5ff10" stroke="#00e5ff66" stroke-width="2" stroke-dasharray="6 8"/>
   <path d="M560 560 Q650 470 820 400 M820 400 Q640 330 400 400 M400 400 Q350 320 320 240 M560 580 Q750 700 940 660 M940 660 Q1000 540 1060 440 M1060 440 Q1150 300 1260 220" stroke="#f5b82e" stroke-width="3" stroke-dasharray="4 10" fill="none" opacity=".6"/>
   <text x="760" y="740" fill="#f5b82e55" font-size="22" font-family="Saira Condensed">Oceano Atlântico: as histórias viajaram junto com as pessoas</text></svg>${nodes}</div>`},

region(id){ const r=RG[id]; Audio.play(r.genre); const prog=S.region[id]||0;
  const owned=ITEMS.filter(i=>i.region===id&&S.items[i.id]).length;
  const nodes=['Patrulha','Desafio Cultural','Guardiões','Chefe: '+BOSSES[r.boss].name].map((n,i)=>{const open=i<=prog;return `<button class="rnode ${i<prog?'clear':''} ${open?'':'locked'} ${i===3?'boss':''}" ${open?`data-act="node" data-i="${i}"`:''}><span>${i<prog?'✔':i===3?'☠':i+1}</span><b>${n}</b><small>${i===1?'Quiz + batalha':i===3?'Recompensa: '+charName(r.unlock):'Batalha'}</small></button>`}).join('<i class="rline"></i>');
  return `<div class="scene-wrap">${sceneBG(id)}</div>`+topbar(r.name,'map')+`<div class="region">
   <div class="panel rinfo"><small>${r.sub}</small><h2>${r.name}</h2><p>${r.desc}</p>
    <div class="rrow"><span>Nível recomendado <b>${r.lvl}</b></span><span>Colecionáveis <b>${owned}/12</b></span><span>Trilha <b>${({samba:'Samba',afrobeat:'Afrobeat',reggae:'Reggae e dub',jazz:'Jazz e blues',amapiano:'Amapiano',cumbia:'Cumbia e currulao',ethio:'Ethio-jazz',afrofuturo:'Eletrônica afrofuturista'})[r.genre]}</b></span></div>
    <h4>Personagens daqui</h4><div class="rchars">${r.chars.map(c=>`<div class="rc ${S.unlocked.includes(c)?'':'lk'}">${portrait(c)}<small>${S.unlocked.includes(c)?short(c):`${S.frags[c]||0}/${fragNeed(c)} frag.`}</small></div>`).join('')}</div>
    <p class="drop">Chance de fragmento por vitória: 45% (de um personagem bloqueado daqui). Chance de colecionável: 35%+.</p></div>
   <div class="rpath">${nodes}${prog>=4?`<button class="btn gold" data-act="node" data-i="9">⟳ Patrulha livre (farm)</button>`:''}</div></div>`},

// ---------------------------- EQUIPE ----------------------------
team(ctx){ // ctx: JSON-ish string stored in window.PENDING
  const sel=S.team.slice();
  return topbar('Monte sua equipe',window.PENDING&&window.PENDING.back||'hub')+`<div class="teamsel">
   <div class="tslots" id="tslots"></div><div class="syn panel" id="syn"></div>
   <div class="tgrid">${S.unlocked.map(id=>{const c=CH[id];return `<button class="tcard" data-id="${id}" style="--rc:${RAR[c.rar].c}">${portrait(id)}<b>${short(id)}</b><small>${TYPES[c.type].ic} Nv.${clv(id)}</small></button>`}).join('')}</div>
   <button class="btn gold go" id="startb">⚔ Começar batalha</button></div>`},

// ---------------------------- HISTÓRIA ----------------------------
story(){ Audio.play('menu');
  return topbar('Modo história','menu')+`<div class="chapters">${CHAPTERS.map(c=>{const done=S.chDone.includes(c.n),open=c.n<=S.chapter;const bg=c.region==='final'?'final':c.region;return `<button class="chap ${done?'done':''} ${open?'':'locked'}" ${open?`data-act="chap" data-n="${c.n}"`:''}>${IMG['ch_'+c.n]?`<div class="scene photo chph" style="background-image:url(${IMG['ch_'+c.n]})"></div>${LiveFX.layer()}`:sceneBG(bg)}<div><small>${c.n===9?'Capítulo final':'Capítulo '+c.n}</small><b>${c.title}</b><em class="cplace">📍 ${c.place}</em><p class="cfact">${c.fact}</p><span>${done?'✔ Concluído':open?'▶ Jogar':'🔒 Bloqueado'}</span></div></button>`}).join('')}</div>`},
cutscene(n,part){return `<div class="scene-wrap">${sceneBG((CHAPTERS[n-1].region==='final')?'final':CHAPTERS[n-1].region)}</div><div class="cut"><div class="cut-title"><small>${n===9?'Capítulo final':'Capítulo '+n}</small><h2>${CHAPTERS[n-1].title}</h2><em class="cplace">📍 ${CHAPTERS[n-1].place}</em></div><div class="cut-actors" id="actors"></div><div class="dlg panel" id="dlg"><b id="dn"></b><p id="dt"></p><span class="dnext">Toque para continuar ▸</span></div><button class="btn small skip" id="skip">Pular ⏭</button></div>`},

// ---------------------------- PERSONAGENS ----------------------------
chars(){ Audio.play('menu');
  return topbar('Personagens','menu')+`<div class="cgrid">${CHARS.map(c=>{const u=S.unlocked.includes(c.id);return `<button class="ccard ${u?'':'lk'}" data-act="char" data-id="${c.id}" style="--rc:${RAR[c.rar].c};--tc:${TYPES[c.type].c}">${portrait(c.id)}<div class="cc-in"><b>${charName(c.id)}</b><small>${c.title}</small><span>${u?`${TYPES[c.type].ic} Nv. ${clv(c.id)}`:`🔒 ${S.frags[c.id]||0}/${fragNeed(c.id)}`}</span></div></button>`}).join('')}</div>`},

// ---------------------------- COLEÇÃO ----------------------------
collection(tab='cards'){ Audio.play('menu');
  const tabs=`<div class="tabs"><button class="${tab==='cards'?'on':''}" data-go="collection|cards">Cartas (${S.unlocked.length}/${CHARS.length})</button><button class="${tab==='items'?'on':''}" data-go="collection|items">Colecionáveis (${itemCount()}/100)</button><button class="${tab==='vil'?'on':''}" data-go="collection|vil">Vilões (${VILS().filter(v=>(S.defeated||{})[v.key]).length}/${VILS().length})</button></div>`;
  let body;
  if(tab==='vil') body=`<div class="vils">${VILS().map(v=>{const d=(S.defeated||{})[v.key];return `<div class="vcard ${d?'':'lk'}" style="--tc:${TYPES[v.type].c}"><img class="pt" src="${IMG[v.img]}" alt="${esc(v.name)}"><div class="vc-in">${v.boss?'<em>CHEFE</em>':''}<b>${esc(v.name)}</b><small>${esc(v.power)} · ${TYPES[v.type].ic} ${v.type}</small><p>${esc(v.desc)}</p><span>${d?`Derrotado ${d}x`:'Ainda não derrotado'}</span></div></div>`}).join('')}</div>`;
  else if(tab==='cards') body=`<div class="cards">${CHARS.map(c=>cardHTML(c.id)).join('')}</div>`;
  else body=Object.keys(ITEM_RAW).map(r=>`<h3 class="ih">${r==='legado'?'Vila Baobá (Legado)':RG[r].name} <small>${ITEMS.filter(i=>i.region===r&&S.items[i.id]).length}/${ITEM_RAW[r].length}</small></h3><div class="items">${ITEMS.filter(i=>i.region===r).map(i=>S.items[i.id]?`<button class="item" data-act="item" data-id="${i.id}"><span>${i.ic}</span><small>${esc(i.name)}</small></button>`:`<div class="item lk"><span>?</span><small>${i.cat}</small></div>`).join('')}</div>`).join('');
  return topbar('Coleção','menu')+`<div class="coll">${tabs}<div class="scroll">${body}</div></div>`},

// ---------------------------- COMUNIDADE ----------------------------
community(){ Audio.play('menu');
  return `<div class="scene-wrap">${sceneBG('brasil')}</div>`+topbar('Comunidade: Vila Baobá')+`<div class="comm"><p class="lead panel">Tudo que você conquista volta para a Vila. Cada construção dá um bônus permanente à sua equipe. Os custos são fixos e transparentes.</p><div class="blds">${BUILDINGS.map(b=>{const l=bld(b.id),max=l>=b.max,cost=b.cost[l];return `<div class="bld panel"><span class="bi">${b.ic}</span><div><b>${b.name}</b><small>${b.desc}</small><em>${b.bonus}</em><div class="lv">${Array.from({length:b.max},(_,i)=>`<i class="${i<l?'on':''}"></i>`).join('')}</div></div><button class="btn small ${max?'':'gold'}" ${max?'disabled':`data-act="build" data-id="${b.id}"`}>${max?'Máximo':(l?'Melhorar':'Construir')+` 🐚 ${fmt(cost)}`}</button></div>`}).join('')}</div>
   <div class="panel legado"><h3>Modo Legado: a Grande Cidade Cultural</h3><p>No multiplayer online, grupos de jogadores contribuem juntos para uma cidade cultural compartilhada. Nesta versão, sua Vila Baobá é o seu pedaço dessa cidade: total de níveis construídos <b>${sumB()}/38</b>.</p></div></div>`},

// ---------------------------- DESAFIOS ----------------------------
challenges(){ Audio.play('menu');
  const g=[['rhythm','🥁','Roda de Ritmo','Acerte as notas no tempo do samba. 45 s.',`Recorde: ${s_('rhythmBest')}%`],['memory','🧠','Memória dos Tesouros','Encontre os pares de colecionáveis e descubra suas histórias.',`Melhor: ${s_('memoryBest')||'-'} jogadas`],['quiz','❓','Quiz Cultural','8 perguntas, 15 s cada. Aprenda enquanto joga.',`Acertos totais: ${s_('quizRight')}`],['runner','🏃🏾','Corrida do Baobá','Pule obstáculos e colete cauris. Toque ou espaço.',`Recorde: ${s_('runBest')} m`]];
  return topbar('Desafios rápidos')+`<div class="games">${g.map(x=>`<button class="game panel" data-go="${x[0]}"><span class="gi">${x[1]}</span><b>${x[2]}</b><p>${x[3]}</p><small>${x[4]}</small><span class="btn gold small">Jogar</span></button>`).join('')}</div>`},

// ---------------------------- MISSÕES ----------------------------
missions(){ ensureDaily(); Audio.play('menu');
  const d=S.daily;
  const ms=d.missions.map(id=>{const m=MISSION_POOL.find(x=>x.id===id);const p=missionProg(id),done=p>=m.n,cl=d.claimed.includes(id);const rw=[m.r.cauris?`🐚 ${m.r.cauris}`:'',m.r.sementes?`🌱 ${m.r.sementes}`:''].join(' ');return `<div class="mis panel ${done?'ok':''}"><b>${m.text}</b><div class="bar"><i style="width:${p/m.n*100}%"></i></div><small>${p}/${m.n}</small><span class="rw">${rw}</span><button class="btn small ${done&&!cl?'gold':''}" ${done&&!cl?`data-act="claim" data-id="${id}"`:'disabled'}>${cl?'Resgatado':done?'Resgatar':'Em andamento'}</button></div>`}).join('');
  return topbar('Missões e recompensas')+`<div class="misw"><div class="daily panel"><h3>Recompensa diária</h3><p>Entre todo dia e ganhe 🐚 150 + 🌱 5. Sem sorteio: você sabe exatamente o que vai ganhar.</p><button class="btn ${d.reward?'':'gold'}" ${d.reward?'disabled':'data-act="dailyr"'}>${d.reward?'Volte amanhã':'Resgatar'}</button>
   <h3>Baú gratuito do dia</h3><p>Conteúdo fixo mostrado antes: 🐚 100 e 2 fragmentos de um personagem bloqueado que você escolhe.</p><button class="btn ${d.chest?'':'gold'}" ${d.chest?'disabled':'data-act="chest"'}>${d.chest?'Aberto hoje':'Abrir baú'}</button></div><div class="mcol"><h3>Missões diárias</h3>${ms}<p class="note">As missões renovam todo dia à meia-noite (horário UTC).</p></div></div>`},

// ---------------------------- EVENTOS ----------------------------
events(){ Audio.play('menu'); const ev=currentEvent();
  const cal=[['Janeiro','Soup Joumou: celebração da independência do Haiti (1º de jan.)'],['Fev/Mar','Carnaval: blocos afro, samba e calipso'],['Maio','Mês da África: 25 de maio, Dia da África'],['Julho','25 de julho: Dia de Tereza de Benguela e da Mulher Negra'],['Agosto','Festival de Tambores do Mundo'],['Novembro','20 de novembro: Dia da Consciência Negra'],['Dezembro','Festival de Luzes de Neo-Axé']];
  return topbar('Eventos','menu')+`<div class="evw"><div class="panel evnow"><span class="big">${ev.ic}</span><div><small>Evento desta semana</small><h2>${ev.name}</h2><p>${ev.desc} Ativo automaticamente em todas as batalhas.</p></div></div>
  <div class="panel"><h3>Rotação semanal</h3><div class="evrot">${EVENTS.map(e=>`<div class="${e===ev?'on':''}"><span>${e.ic}</span><b>${e.name}</b><small>${e.desc}</small></div>`).join('')}</div></div>
  <div class="panel"><h3>Calendário de eventos sazonais (planejado)</h3><ul class="cal">${cal.map(c=>`<li><b>${c[0]}</b><span>${c[1]}</span></li>`).join('')}</ul></div></div>`},

// ---------------------------- CONQUISTAS ----------------------------
achievements(){ Audio.play('menu');
  return topbar(`Conquistas ${Object.keys(S.ach).length}/50`)+`<div class="achs scroll">${ACHS.map(a=>`<div class="ach ${S.ach[a[0]]?'on':''}"><span>${a[3]}</span><div><b>${a[1]}</b><small>${a[2]}</small></div><em>${S.ach[a[0]]?'✔':'🌱10'}</em></div>`).join('')}</div>`},

// ---------------------------- PERSONALIZAÇÃO ----------------------------
customize(){ Audio.play('menu');
  const titles=['Aprendiz da Biblioteca',...ACHS.filter(a=>S.ach[a[0]]).map(a=>a[1])];
  return topbar('Personalização','menu')+`<div class="cust"><div class="panel cprev">${portrait(S.avatar,'big')}<h2>${esc(P())}</h2><small>${esc(S.title)}</small></div>
   <div class="panel cform"><label>Nome<input id="cn" maxlength="14" value="${esc(S.name)}"></label>
   <label>Título (desbloqueie com conquistas)<select id="ct">${titles.map(t=>`<option ${t===S.title?'selected':''}>${esc(t)}</option>`).join('')}</select></label>
   <h4>Avatar do perfil</h4><div class="avs">${S.unlocked.map(id=>`<button class="av2 ${id===S.avatar?'on':''}" data-av="${id}">${portrait(id)}</button>`).join('')}</div>
   <h4>Cor de destaque da interface</h4><div class="accs">${ACCENTS.map(a=>{const own=S.accents.includes(a.id);return `<button class="acc ${a.id===S.accent?'on':''}" data-acc="${a.id}" style="--c:${a.c}"><i></i>${a.name}${own?'':` 🌱${a.cost}`}</button>`}).join('')}</div>
   <p class="note">Na versão completa: editor de tom de pele, rosto, cabelos (tranças, dreadlocks, black power, cortes), corpos, alturas, roupas urbanas, tradicionais e futuristas.</p><button class="btn gold" id="csave">Salvar</button></div></div>`},

// ---------------------------- CONFIGURAÇÕES ----------------------------
settings(){ return topbar('Configurações','menu')+`<div class="panel sets"><label>Música <input type="range" id="sm" min="0" max="1" step=".05" value="${S.settings.music}"></label><label>Efeitos sonoros <input type="range" id="ss" min="0" max="1" step=".05" value="${S.settings.sfx}"></label><label>Vozes <input type="range" id="sv" min="0" max="1" step=".05" value="${S.settings.voice==null?.9:S.settings.voice}"></label><label class="ck"><input type="checkbox" id="stts" ${S.settings.tts!==false?'checked':''}> Voz automática nas falas que ainda não foram gravadas</label><label class="ck"><input type="checkbox" id="smo" ${S.settings.motion?'checked':''}> Animações de tela (tremor e flashes)</label><label class="ck"><input type="checkbox" id="sfs" ${S.settings.fs!==false?'checked':''}> Sempre em tela cheia e na horizontal</label>
  <h4>Controles</h4><p>Batalha: teclas 1 a 4 escolhem ação; clique no inimigo para atacar. Ritmo: D F J K. Corrida: espaço ou toque.</p>
  <h4>Progresso</h4><p>Seu progresso fica salvo neste navegador.</p><button class="btn danger" id="reset">Apagar progresso</button>
  <h4>Classificação indicativa sugerida</h4><p>Livre a 10 anos: fantasia sem sangue, temas históricos tratados com cuidado.</p></div>`},

// ---------------------------- MULTIPLAYER ----------------------------
multi(){ Audio.play('menu'); return topbar('Multiplayer','menu')+`<div class="multi"><button class="panel mcard" data-act="duel"><span>🤜🏾🤛🏿</span><b>Duelo local</b><p>Dois jogadores no mesmo aparelho. Cada um monta uma equipe de 3 e joga por turnos.</p><span class="btn gold">Jogar agora</span></button>
  <div class="panel mcard soon"><span>🌐</span><b>Online (planejado)</b><p>Cooperativo para 2 a 4 jogadores, batalhas amistosas, guildas, ranking opcional, troca de itens permitidos e o Modo Legado de cidade compartilhada. Precisa de servidores e fica para a versão de lançamento.</p></div></div>`},

// ---------------------------- EXPEDIÇÃO ----------------------------
expedition(){ Audio.play('final'); return topbar('Expedição Sankofa')+`<div class="exp panel"><h2>Mergulhe fundo na memória</h2><p>6 salas seguidas. A vida da equipe não recupera entre lutas. Depois de cada vitória, escolha 1 de 3 bênçãos aleatórias. Na sala 3 há uma fogueira de descanso. Na sala 6, a vilã Eclipse espera.</p><p>Se a equipe cair, você mantém as recompensas das salas vencidas.</p><p>Expedições concluídas: <b>${s_('expDone')}</b>. Recorde de salas: <b>${s_('expBest')}</b>.</p><button class="btn gold" data-act="expstart">Montar equipe e entrar</button></div>`},

exit(){ Audio.stop(); return `<div class="exitw">${LOGO(1)}<p>Até a próxima! A Vila Baobá guarda seu progresso.</p><button class="btn gold" data-go="menu">Voltar ao menu</button></div>`}
};

function VILS(){return [...Object.entries(BOSSES).map(([k,v])=>Object.assign({key:k,boss:true},v)),...Object.entries(ENEMIES).map(([k,v])=>Object.assign({key:k,boss:false},v))]}
function cardHTML(id){const c=CH[id],u=S.unlocked.includes(id);return `<div class="card ${u?'':'lk'}" style="--rc:${RAR[c.rar].c};--tc:${TYPES[c.type].c}"><div class="cardart">${portrait(id)}<span class="crar">${'◆'.repeat(RAR[c.rar].n)}</span><span class="ctype">${TYPES[c.type].ic}</span></div><b>${u?charName(id):'???'}</b><small>${c.rar} · ${c.origin.split(',').pop().trim()}</small>${u?`<div class="cstat"><span>❤ ${c.hp}</span><span>⚔ ${c.atk}</span><span>🛡 ${c.def}</span><span>⚡ ${c.spd}</span></div><p>${c.sp.name}</p>`:`<p>${S.frags[id]||0}/${fragNeed(id)} fragmentos</p>`}</div>`}

// ---------------------------- LIGAÇÕES DE TELA ----------------------------
AFTER.menu=()=>{stage().querySelector('[data-act=play]').onclick=()=>{sfx('click');if(!S.started)show('intro');else show('hub')};stage().querySelector('[data-act=replay]').onclick=()=>{sfx('click');playIntroVideos()}};
AFTER.start=()=>{document.getElementById('iniciar').onclick=()=>{goFullscreen();Theme.unlock();playIntroVideos()}};
function goFullscreen(){const el=document.documentElement;try{if(!(document.fullscreenElement||document.webkitFullscreenElement)){const r=(el.requestFullscreen||el.webkitRequestFullscreen||el.msRequestFullscreen);if(r){const p=r.call(el,{navigationUI:'hide'});if(p&&p.then)p.then(lockLandscape).catch(()=>{});else lockLandscape()}}else lockLandscape()}catch(e){}setTimeout(fit,300)}
function lockLandscape(){try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}
// Mantém o jogo em tela cheia: se sair (tecla Esc, gesto do sistema), o próximo toque volta para tela cheia
document.addEventListener('pointerdown',()=>{if(S&&S.settings.fs!==false&&CUR!=='start'&&!(document.fullscreenElement||document.webkitFullscreenElement))goFullscreen()},true);
document.addEventListener('fullscreenchange',()=>setTimeout(fit,100));
function playIntroVideos(){
  show('video');
  const v=document.getElementById('vp');
  const seq=[{src:MEDIA.produtora,music:false},{src:MEDIA.abertura,music:true}];let i=0;
  const next=()=>{ if(i>=seq.length){v.pause();show('menu');return}
    const it=seq[i++];v.src=it.src;v.currentTime=0;
    if(it.music)Theme.play(true);
    const p=v.play();if(p&&p.catch)p.catch(()=>{v.muted=true;v.play().catch(()=>{})});
  };
  v.onended=next;v.onerror=next;
  document.getElementById('vskip').onclick=e=>{e.stopPropagation();next()};
  next();
}
AFTER.intro=()=>{document.getElementById('go1').onclick=()=>{S.name=(document.getElementById('nm').value.trim()||'Kayo').slice(0,14);S.started=true;save();playChapter(1)}};
AFTER.hub=()=>{stage().querySelector('[data-act=continue]').onclick=()=>{sfx('click');if(S.chDone.includes(9))show('map');else playChapter(S.chapter)}};
AFTER.region=id=>{stage().querySelectorAll('[data-act=node]').forEach(b=>b.onclick=()=>{sfx('click');const i=+b.dataset.i;startNode(id,i)})};
AFTER.story=()=>{stage().querySelectorAll('[data-act=chap]').forEach(b=>b.onclick=()=>{sfx('click');playChapter(+b.dataset.n)})};
AFTER.chars=()=>{stage().querySelectorAll('[data-act=char]').forEach(b=>b.onclick=()=>{sfx('click');charModal(b.dataset.id)})};
AFTER.collection=()=>{stage().querySelectorAll('[data-act=item]').forEach(b=>b.onclick=()=>{const i=IT[b.dataset.id];modal(`<div class="itemm"><span class="big">${i.ic}</span><small>${i.cat} · ${i.region==='legado'?'Vila Baobá':RG[i.region].name}</small><h2>${esc(i.name)}</h2><p>${esc(i.story)}</p><p class="note">Ficou curioso? Pesquise mais sobre isso: a história real é ainda maior.</p></div>`)})};
AFTER.community=()=>{stage().querySelectorAll('[data-act=build]').forEach(b=>b.onclick=()=>{const B=BUILDINGS.find(x=>x.id===b.dataset.id),l=bld(B.id),c=B.cost[l];if(S.cauris<c){toast('Cauris insuficientes. Vença batalhas e missões.','🐚');return}S.cauris-=c;S.build[B.id]=l+1;sfx('buff');toast(`${B.name} nível ${l+1}!`,B.ic);save();checkAch();show('community')})};
AFTER.missions=()=>{
  stage().querySelectorAll('[data-act=claim]').forEach(b=>b.onclick=()=>{const m=MISSION_POOL.find(x=>x.id===b.dataset.id);S.cauris+=m.r.cauris||0;S.sementes+=(m.r.sementes||0)+bld('centro');S.daily.claimed.push(m.id);st('missionsDone');sfx('coin');save();checkAch();show('missions')});
  const dr=stage().querySelector('[data-act=dailyr]');if(dr)dr.onclick=()=>{S.cauris+=150;S.sementes+=5;S.daily.reward=true;st('dailyClaims');sfx('coin');toast('+150 Cauris e +5 Sementes','🎁');save();checkAch();show('missions')};
  const ch=stage().querySelector('[data-act=chest]');if(ch)ch.onclick=()=>{const locked=CHARS.filter(c=>!S.unlocked.includes(c.id));
    const m=modal(`<h2>Baú gratuito</h2><p>🐚 100 garantidos. Escolha quem recebe 2 fragmentos:</p><div class="avs">${locked.map(c=>`<button class="av2" data-f="${c.id}">${portrait(c.id,'dim')}<small>${S.frags[c.id]||0}/${fragNeed(c.id)}</small></button>`).join('')||'<p>Todos desbloqueados! Você recebe 🌱 10 no lugar.</p>'}</div>${locked.length?'':'<button class="btn gold" data-f="none">Resgatar</button>'}`);
    m.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{S.cauris+=100;if(b.dataset.f==='none')S.sementes+=10;else addFrag(b.dataset.f,2);S.daily.chest=true;sfx('coin');save();checkAch();m.remove();show('missions')})};
};
AFTER.customize=()=>{let av=S.avatar,acc=S.accent;
  stage().querySelectorAll('[data-av]').forEach(b=>b.onclick=()=>{av=b.dataset.av;stage().querySelectorAll('[data-av]').forEach(x=>x.classList.toggle('on',x===b));stage().querySelector('.cprev .pt').src=IMG[av]});
  stage().querySelectorAll('[data-acc]').forEach(b=>b.onclick=()=>{const A=ACCENTS.find(a=>a.id===b.dataset.acc);if(!S.accents.includes(A.id)){if(S.sementes<A.cost){toast('Sementes insuficientes','🌱');return}S.sementes-=A.cost;S.accents.push(A.id);toast(`Cor ${A.name} desbloqueada`,'🎨')}acc=A.id;document.documentElement.style.setProperty('--acc',A.c);stage().querySelectorAll('[data-acc]').forEach(x=>x.classList.toggle('on',x===b));save()});
  document.getElementById('csave').onclick=()=>{S.name=(document.getElementById('cn').value.trim()||'Kayo').slice(0,14);S.title=document.getElementById('ct').value;S.avatar=av;S.accent=acc;st('custom');save();checkAch();toast('Perfil salvo','✔');show('customize')};
};
AFTER.settings=()=>{const u=()=>{S.settings.music=+document.getElementById('sm').value;S.settings.sfx=+document.getElementById('ss').value;S.settings.motion=document.getElementById('smo').checked;S.settings.fs=document.getElementById('sfs').checked;S.settings.voice=+document.getElementById('sv').value;S.settings.tts=document.getElementById('stts').checked;LiveFX.apply();Audio.vol();save();if(S.settings.fs)goFullscreen();else if(document.fullscreenElement)document.exitFullscreen().catch(()=>{})};['sm','ss','sv','stts','smo','sfs'].forEach(i=>document.getElementById(i).oninput=u);
  document.getElementById('reset').onclick=()=>{const m=modal(`<h2>Apagar todo o progresso?</h2><p>Isso não pode ser desfeito.</p><button class="btn danger" id="rs2">Apagar</button>`);m.querySelector('#rs2').onclick=()=>{localStorage.removeItem(SAVE_KEY);load();m.remove();show('menu')}}};
AFTER.multi=()=>{stage().querySelector('[data-act=duel]').onclick=()=>{sfx('click');duelSetup()}};
AFTER.expedition=()=>{stage().querySelector('[data-act=expstart]').onclick=()=>{sfx('click');window.PENDING={mode:'expedition',back:'expedition'};show('team')}};

function charModal(id){const c=CH[id],u=S.unlocked.includes(id),l=clv(id);
  const syn=SYNERGIES.filter(s=>s.a===id||s.b===id).map(s=>`<li><b>${s.name}</b> com ${charName(s.a===id?s.b:s.a)}: ${s.desc}</li>`).join('');
  const cost=100*l;
  const m=modal(`<div class="cm" style="--rc:${RAR[c.rar].c}"><div class="cm-l">${portrait(id,'big')}<div class="cm-tags">${rarTag(c.rar)}${typeTag(c.type)}</div>${u?`<p>Nível <b>${l}</b> <small>(${S.cxp[id]||0}/${cxpNeed(l)} XP)</small></p><button class="btn small gold" id="train" ${l>=Math.min(40,S.lvl+2)?'disabled':''}>Treinar +1 nível 🐚 ${cost}</button><small class="note">Limite: seu nível + 2</small>`:`<p>🔒 ${S.frags[id]||0}/${fragNeed(id)} fragmentos</p><small class="note">Consiga fragmentos vencendo batalhas na região de origem, no baú diário ou nos desafios.</small>`}</div>
   <div class="cm-r"><small>${c.title} · ${c.age} anos · ${c.origin}</small><h2>${charName(id)}</h2><p><b>Aparência:</b> ${c.look}</p><p><b>Personalidade:</b> ${c.pers}</p><p>${c.story.replace('{P}',esc(P()))}</p>
   <div class="stats4"><span>❤ ${c.hp}</span><span>⚔ ${c.atk}</span><span>🛡 ${c.def}</span><span>⚡ ${c.spd}</span><span>🎭 ${c.role}</span></div>
   <ul class="skl"><li><b>Ataque básico:</b> ${c.basic}</li><li><b>Especial: ${c.sp.name}</b> (recarga ${c.sp.cd}) ${c.sp.desc}</li><li><b>Suprema: ${c.ult.name}</b> ${c.ult.desc}</li><li><b>Passiva:</b> ${c.pas.desc}</li><li><b>Vantagem:</b> ${TYPES[c.type].beats?`forte contra ${TYPES[c.type].beats}`:'neutro contra todos'}. <b>Fraqueza:</b> ${Object.keys(TYPES).filter(t=>TYPES[t].beats===c.type).join(', ')||'nenhuma'}</li><li><b>Animação exclusiva:</b> ${c.anim}</li></ul>
   ${syn?`<h4>Sinergias</h4><ul class="skl">${syn}</ul>`:''}<p class="quote">"${c.lines[0]}"</p></div></div>`);
  const t=m.querySelector('#train');if(t)t.onclick=()=>{if(S.cauris<cost){toast('Cauris insuficientes','🐚');return}S.cauris-=cost;S.clv[id]=l+1;st('trains');sfx('buff');save();checkAch();m.remove();charModal(id)};
}

// ---------------------------- CUTSCENES ----------------------------
function playChapter(n,part='scenes',after){
  const ch=CHAPTERS[n-1];
  show('cutscene',n,part);
  Audio.play(ch.region==='final'?'final':RG[ch.region].genre);
  const lines=ch[part];let i=0;
  const actors=document.getElementById('actors');
  const step=()=>{ if(i>=lines.length){finish();return}
    const [sp,tx]=lines[i++];
    const nm=sp==='narr'?'Narração':BOSSES[sp]?BOSSES[sp].name:charName(sp);
    document.getElementById('dn').textContent=nm;
    const t=tx.replace(/\{P\}/g,P());const dt=document.getElementById('dt');dt.textContent='';let k=0;clearInterval(window._tw);window._tw=setInterval(()=>{dt.textContent=t.slice(0,k+=2);if(k>=t.length)clearInterval(window._tw)},14);
    if(sp!=='narr'){ if(!actors.querySelector(`[data-a="${sp}"]`)){const d=document.createElement('div');d.className='actor';d.dataset.a=sp;d.innerHTML=BOSSES[sp]?(IMG[BOSSES[sp].img]?`<img class="pt" src="${IMG[BOSSES[sp].img]}" alt="">`:enemySVG(null,'#ff3d5a',sp)):portrait(sp);actors.appendChild(d);if(actors.children.length>3)actors.firstChild.remove()}
      actors.querySelectorAll('.actor').forEach(a=>a.classList.toggle('talk',a.dataset.a===sp)); }
    sfx('click');
    // Voz da fala (arquivo gravado em media/vozes/ ou voz automática)
    Voice.say(Voice.file(n,part,i),t,sp);if(i<lines.length)Voice.preload(Voice.file(n,part,i+1));
  };
  const finish=()=>{clearInterval(window._tw);Voice.stop();if(part==='scenes'){ if(ch.region==='final'){startBattle({mode:'story',region:'final',node:3,chapter:9})} else if(!S.tutorialDone){startTutorial()} else {show('region',ch.region)} } else { after?after():show('hub') }};
  document.getElementById('dlg').onclick=step;
  document.getElementById('skip').onclick=e=>{e.stopPropagation();finish()};
  step();
}
function startTutorial(){window.PENDING={mode:'story',region:'brasil',node:0,tutorial:true,back:'hub'};S.team=['protagonista','capoeirista','dj'];startBattle(window.PENDING)}

// ---------------------------- INÍCIO DE NÓS ----------------------------
function startNode(rid,i){
  const r=RG[rid];
  const go=()=>{window.PENDING={mode:'story',region:rid,node:i,back:'region|'+rid};show('team')};
  if(i===1&&(S.region[rid]||0)<=1){ quizGate(go,rid) } else go();
}
// Desafio Cultural: pergunta sobre a região onde o jogador está; depois mostra a resposta certa e o porquê
function quizGate(cb,rid){
  const seen=window.QG_SEEN||(window.QG_SEEN=[]);let pool=quizPool(RG[rid]?rid:QZ_MUNDO);
  const fresh=pool.filter(q=>!seen.includes(q.q));if(fresh.length)pool=fresh;
  const q=pick(pool);seen.push(q.q);if(seen.length>40)seen.shift();
  const opts=quizOpts(q);let answered=false;
  const m=modal(`<div class="qg" style="--c1:${RG[q.r]?RG[q.r].c1:'#555'}"><small>Desafio cultural</small><div class="qplace">${quizPlace(q)}</div><h2>${esc(q.q)}</h2>${quizOptsHTML(opts)}<p class="note">Acertar dá um colecionável extra. Errar não bloqueia: você aprende e segue.</p></div>`,()=>{if(answered)cb()});
  const box=m.querySelector('.qg');
  m.querySelectorAll('.qo').forEach(b=>b.onclick=()=>{if(answered)return;answered=true;const n=box.querySelector('.note');if(n)n.remove();
    const ok=quizReveal(box,q,opts,+b.dataset.k,'Continuar ▶',()=>{m.remove();cb()});
    if(ok){st('quizRight');sfx('win');window.QUIZ_BONUS=true}else sfx('miss')})}

// ---------------------------- SELEÇÃO DE EQUIPE ----------------------------
AFTER.team=()=>{
  const ctx=window.PENDING||{}; let sel=(ctx.sel||S.team).filter(id=>S.unlocked.includes(id)).slice(0,3);
  const draw=()=>{
    document.getElementById('tslots').innerHTML=[0,1,2].map(i=>sel[i]?`<div class="slot" style="--rc:${RAR[CH[sel[i]].rar].c}">${portrait(sel[i])}<b>${short(sel[i])}</b>${typeTag(CH[sel[i]].type)}</div>`:`<div class="slot empty">Vaga ${i+1}</div>`).join('');
    const act=SYNERGIES.filter(s=>sel.includes(s.a)&&sel.includes(s.b));
    const types=new Set(sel.map(i=>CH[i].type));
    document.getElementById('syn').innerHTML=`<h4>Sinergias ativas</h4>${act.length?act.map(s=>`<p class="son">✨ <b>${s.name}</b>: ${s.desc}</p>`).join(''):'<p class="note">Nenhuma. Experimente pares como DJ + Dançarina ou Atleta + Capoeirista.</p>'}${ctx.duel?`<p><b>${ctx.duel===1?'Jogador 1':'Jogador 2'}</b>: escolha sua equipe.</p>`:''}<p class="note">Tipos: ${[...types].map(t=>TYPES[t].ic+' '+t).join(', ')}. Ciclo de vantagem: ♪ Ritmo › ◈ Mente › ⚙ Tech › ✊ Corpo › ♪ Ritmo.</p>`;
    stage().querySelectorAll('.tcard').forEach(b=>b.classList.toggle('on',sel.includes(b.dataset.id)));
    document.getElementById('startb').disabled=sel.length<1;
  };
  stage().querySelectorAll('.tcard').forEach(b=>b.onclick=()=>{sfx('click');const id=b.dataset.id;if(sel.includes(id))sel=sel.filter(x=>x!==id);else if(sel.length<3)sel.push(id);else{sel.shift();sel.push(id)}draw()});
  document.getElementById('startb').onclick=()=>{if(!sel.length)return;sfx('click');
    if(ctx.duel===1){window.PENDING={mode:'duel',duel:2,p1:sel.slice(),back:'multi'};show('team');return}
    if(ctx.duel===2){startBattle({mode:'duel',p1:ctx.p1,p2:sel.slice()});return}
    S.team=sel.slice();save();
    if(ctx.mode==='expedition')startExpedition();else startBattle(ctx)};
  draw();
};
function duelSetup(){window.PENDING={mode:'duel',duel:1,back:'multi',sel:S.team};show('team')}
