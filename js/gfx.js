// ===================== ARTE VETORIAL =====================
function kentePattern(id,c1,c2){return `<pattern id="${id}" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="${c1}"/><rect y="20" width="60" height="8" fill="${c2}"/><rect x="20" width="8" height="60" fill="${c2}" opacity=".7"/><path d="M0 44l8-8 8 8-8 8z M36 0l8 8-8 8-8-8z" fill="#000" opacity=".25"/></pattern>`}
function sceneSVG(id){
  const r=RG[id]||{sky:['#2a1030','#12081c','#05030a'],c1:'#333',c2:'#f5b82e'};
  const [a,b,c]=r.sky;
  let g='';
  const hills=(y,col,amp=60)=>`<path d="M0 ${y} Q200 ${y-amp} 400 ${y-10} T800 ${y} T1200 ${y-20} T1600 ${y} V900 H0z" fill="${col}"/>`;
  const palm=(x,y,s=1,col='#0c1a10')=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${col}"><path d="M-6 0 Q0 -140 10 -260 L18 -258 Q10 -140 8 0z"/>${[-60,-20,20,60,100].map(k=>`<path d="M14 -258 q${k} -30 ${k*1.8} 30 q${-k*.8} -40 ${-k*1.8} -30z"/>`).join('')}</g>`;
  const baobab=(x,y,s=1,col='#1b0f08')=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${col}"><path d="M-40 0 Q-30 -120 -36 -200 L36 -200 Q30 -120 40 0z"/><path d="M-36 -196 q-60 -20 -110 -60 M-20 -200 q-20 -60 -60 -90 M0 -200 q0 -60 10 -100 M20 -200 q30 -50 70 -80 M36 -196 q60 -10 110 -50" stroke="${col}" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="-150" cy="-262" rx="40" ry="14"/><ellipse cx="-80" cy="-296" rx="36" ry="14"/><ellipse cx="12" cy="-306" rx="40" ry="16"/><ellipse cx="90" cy="-286" rx="40" ry="14"/><ellipse cx="148" cy="-250" rx="38" ry="14"/></g>`;
  const acacia=(x,y,s=1,col='#20120a')=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${col}"><path d="M-5 0 L-3 -110 L-40 -150 M-3 -110 L40 -150" stroke="${col}" stroke-width="10" fill="none"/><ellipse cx="0" cy="-160" rx="130" ry="24"/></g>`;
  let body='';
  switch(r.scene||id){
   case 'brasil':{
    const cols=['#ff5d8f','#ffd23f','#3ec1d3','#ff8c42','#8bd450','#b388eb','#ff5d5d','#4ecdc4'];
    let houses='';for(let i=0;i<16;i++){const x=i*105-20,h=160+((i*37)%90);houses+=`<rect x="${x}" y="${720-h}" width="100" height="${h}" fill="${cols[i%8]}" opacity=".9"/><rect x="${x+20}" y="${760-h}" width="22" height="34" fill="#2a1a3a" opacity=".6"/><rect x="${x+58}" y="${760-h}" width="22" height="34" fill="#2a1a3a" opacity=".6"/><path d="M${x-6} ${722-h} L${x+50} ${690-h} L${x+106} ${722-h}z" fill="#8a2f2f"/>`}
    body=hills(560,'#3b2a5c',90)+`<path d="M1180 470 L1200 330 L1220 470z M1150 360 h100 v10 h-100z" fill="#2a1d44"/>`+houses+`<rect y="720" width="1600" height="180" fill="#3a2410"/>`+palm(90,760,1.1)+palm(1500,760,1.2);break}
   case 'ocidental':{
    body=hills(620,'#a3561c',50)+`<g fill="#b8743a"><path d="M560 700 V460 h40 v-60 h30 v60 h120 v-90 h30 v90 h120 v-60 h30 v60 h40 V700z"/>${Array.from({length:18},(_,i)=>`<rect x="${570+i*28}" y="${480+(i%3)*50}" width="22" height="5" fill="#6b3b17"/>`).join('')}</g>`+baobab(260,720,1.3)+baobab(1350,720,1.1)+`<rect y="700" width="1600" height="200" fill="#6b3413"/>`;break}
   case 'caribe':{
    let hs='';const cols=['#ff5e5b','#ffed66','#00cecb','#ff9f1c','#9b5de5'];for(let i=0;i<8;i++)hs+=`<rect x="${700+i*110}" y="${600-(i%3)*20}" width="90" height="${120+(i%3)*20}" fill="${cols[i%5]}"/><path d="M${692+i*110} ${602-(i%3)*20} l53 -40 l53 40z" fill="#fff" opacity=".8"/>`;
    body=`<rect y="560" width="1600" height="200" fill="#1a8fb5"/><path d="M0 600 Q400 580 800 600 T1600 600 V620 H0z" fill="#fff" opacity=".2"/>`+hs+`<rect y="720" width="1600" height="180" fill="#e9c78b"/>`+palm(200,760,1.2)+palm(380,780,.9)+palm(1480,770,1.1);break}
   case 'eua':{
    let sk='';for(let i=0;i<22;i++){const h=180+((i*53)%260),x=i*75;sk+=`<rect x="${x}" y="${700-h}" width="70" height="${h}" fill="#1b1640"/>`;for(let w=0;w<h/40-1;w++)sk+=`<rect x="${x+12}" y="${720-h+w*40}" width="12" height="16" fill="#ffd166" opacity="${(i+w)%3?.15:.8}"/><rect x="${x+44}" y="${720-h+w*40}" width="12" height="16" fill="#ffd166" opacity="${(i*w)%4?.15:.7}"/>`}
    body=sk+`<rect y="700" width="1600" height="200" fill="#2a1a2e"/><g stroke="#111" stroke-width="10"><line x1="300" y1="700" x2="300" y2="480"/><line x1="1300" y1="700" x2="1300" y2="480"/></g><circle cx="300" cy="470" r="22" fill="#ffe29a"/><circle cx="1300" cy="470" r="22" fill="#ffe29a"/>`;break}
   case 'austral':{
    body=hills(600,'#7a4a24',120)+`<g fill="#8b6a4a"><path d="M300 720 Q800 520 1300 720z"/></g>${Array.from({length:14},(_,i)=>`<path d="M${360+i*68} ${720-Math.sin(i/13*Math.PI)*170} h60" stroke="#5e4630" stroke-width="3"/>`).join('')}`+acacia(160,730,1.2)+acacia(1450,730,1)+`<rect y="720" width="1600" height="180" fill="#5a3418"/>`;break}
   case 'latina':{
    body=hills(520,'#1f5e33',70)+hills(620,'#164a27',80)+`<path d="M0 720 Q400 680 800 720 T1600 700 V760 H0z" fill="#2e7aa0"/>`+palm(120,760,1.3,'#0a2412')+palm(300,770,1,'#0a2412')+palm(1350,760,1.2,'#0a2412')+palm(1520,780,.9,'#0a2412')+`<rect y="750" width="1600" height="150" fill="#3a2a14"/><g transform="translate(800 740)"><rect x="-10" y="-120" width="20" height="120" fill="#6b5a3a"/><circle cy="-140" r="22" fill="#6b5a3a"/></g>`;break}
   case 'oriental':{
    body=hills(560,'#8a3a3a',140)+`<g fill="#b58a5c">${[[500,260],[640,330],[760,220]].map(([x,h])=>`<path d="M${x-22} 720 V${720-h} L${x} ${690-h} L${x+22} ${720-h} V720z"/>${Array.from({length:Math.floor(h/60)},(_,k)=>`<rect x="${x-14}" y="${720-h+20+k*60}" width="28" height="18" fill="#7a5a3a"/>`).join('')}`).join('')}</g><g transform="translate(1150 720)" fill="#9c6b44"><path d="M-110 0 V-60 H-40 V-120 H40 V-60 H110 V0z"/><path d="M-12 -120 V-160 H12 V-120 z M-30 -150 H30 V-138 H-30z"/></g>`+acacia(200,730,1.1)+`<rect y="720" width="1600" height="180" fill="#5a2a1e"/>`;break}
   case 'futuro':{
    let t='';for(let i=0;i<12;i++){const x=40+i*135,h=260+((i*71)%300),w=70+(i%3)*20;t+=`<path d="M${x} 720 V${720-h} L${x+w/2} ${690-h} L${x+w} ${720-h} V720z" fill="#170a33" stroke="${i%2?'#00e5ff':'#ff2bd6'}" stroke-width="2"/>`;for(let k=0;k<h/50;k++)t+=`<path d="M${x+8} ${740-h+k*50} l${w/2-8} 14 l${w/2-8} -14" stroke="${k%2?'#00e5ff':'#f5c542'}" stroke-width="2" fill="none" opacity=".7"/>`}
    body=`<circle cx="1200" cy="220" r="110" fill="#ff2bd6" opacity=".25"/><circle cx="1200" cy="220" r="70" fill="#ffb3f0" opacity=".3"/>`+t+`<rect y="720" width="1600" height="180" fill="#0a0418"/><g stroke="#00e5ff" opacity=".5">${Array.from({length:17},(_,i)=>`<line x1="${800}" y1="720" x2="${i*100}" y2="900"/>`).join('')}<line x1="0" y1="780" x2="1600" y2="780"/><line x1="0" y1="840" x2="1600" y2="840"/></g><ellipse cx="400" cy="300" rx="60" ry="10" fill="#00e5ff" opacity=".7"/><ellipse cx="900" cy="200" rx="40" ry="7" fill="#f5c542" opacity=".7"/>`;break}
   default:{
    body=`<rect y="0" width="1600" height="900" fill="#0d0716"/>`+hills(700,'#150c20',60)+baobab(800,760,2.2,'#05030a')+`<g fill="#6a5a8a" opacity=".25">${Array.from({length:10},(_,i)=>`<ellipse cx="${i*170}" cy="${700+(i%3)*30}" rx="200" ry="40"/>`).join('')}</g>`;
   }
  }
  return `<svg class="scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sky${id})"/><circle cx="1300" cy="200" r="70" fill="#fff6d0" opacity="${r.scene==='futuro'||!r.scene?0:.5}"/>${body}</svg>`;
}

function enemySVG(shape,col,boss){
  const eye=(x,y,r=9)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x}" cy="${y}" r="${r*.45}" fill="${col}"/>`;
  const fog=`<filter id="blur"><feGaussianBlur stdDeviation="3"/></filter>`;
  let s='';
  switch(shape){
   case 'eco':s=`<g><circle cx="100" cy="100" r="70" fill="none" stroke="${col}" stroke-width="6" opacity=".35"/><circle cx="100" cy="100" r="52" fill="none" stroke="${col}" stroke-width="6" opacity=".6"/><circle cx="100" cy="100" r="36" fill="#1a1426"/>${eye(86,96)}${eye(114,96)}</g>`;break;
   case 'sombra':s=`<path d="M100 20 C150 40 160 110 150 180 L130 160 L115 185 L100 160 L85 185 L70 160 L50 180 C40 110 50 40 100 20z" fill="#140f22" stroke="${col}" stroke-width="4"/>${eye(84,80,8)}${eye(116,80,8)}<path d="M80 120 q20 10 40 0" stroke="${col}" stroke-width="4" fill="none"/>`;break;
   case 'nevoa':s=`<g filter="url(#blur)"><ellipse cx="70" cy="120" rx="50" ry="36" fill="#3b3450"/><ellipse cx="130" cy="115" rx="55" ry="40" fill="#453d5c"/><ellipse cx="100" cy="85" rx="50" ry="40" fill="#4d4466"/></g>${eye(85,100,8)}${eye(118,100,8)}`;break;
   case 'guardiao':s=`<rect x="50" y="40" width="100" height="140" rx="10" fill="#4a4050" stroke="${col}" stroke-width="4"/><path d="M60 60 l30 50 l-10 40 M140 70 l-25 40 l15 50" stroke="#1a1420" stroke-width="4" fill="none"/><rect x="70" y="70" width="60" height="16" fill="#1a1420"/>${eye(85,78,6)}${eye(115,78,6)}`;break;
   case 'drone':s=`<ellipse cx="100" cy="100" rx="80" ry="30" fill="#221640" stroke="${col}" stroke-width="4"/><circle cx="100" cy="92" r="28" fill="#0b0618" stroke="${col}" stroke-width="3"/><circle cx="100" cy="92" r="11" fill="${col}"/><path d="M30 100 h-20 M170 100 h20" stroke="${col}" stroke-width="4"/>`;break;
  }
  if(boss){
   const B=BOSSES[boss],c=B.color;
   const face=`<ellipse cx="200" cy="170" rx="70" ry="80" fill="#0e0a18" stroke="${col}" stroke-width="5"/>${eye(172,160,14)}${eye(228,160,14)}<path d="M170 215 q30 18 60 0" stroke="${col}" stroke-width="5" fill="none"/>`;
   let deco='';
   ({reicinza:()=>deco=`<path d="M130 110 l20 -60 l25 40 l25 -60 l25 60 l25 -40 l20 60z" fill="#9a9a9a" stroke="${col}" stroke-width="4"/><path d="M90 330 Q200 230 310 330z" fill="${c}"/>`,
     ladrao:()=>deco=Array.from({length:10},(_,i)=>`<rect x="${60+i*28}" y="${250+(i%3)*20}" width="40" height="54" fill="#efe6d0" transform="rotate(${i*9-40} ${80+i*28} 270)" stroke="#6b4a2a" stroke-width="2"/>`).join(''),
     furacao:()=>deco=`<path d="M200 170 m-150 0 a150 150 0 1 1 300 0 a120 120 0 1 1 -240 0 a90 90 0 1 1 180 0" fill="none" stroke="${c}" stroke-width="18" opacity=".7"/>`,
     disco:()=>deco=`<circle cx="200" cy="200" r="175" fill="#111" stroke="${col}" stroke-width="5"/>${[150,125,100].map(r=>`<circle cx="200" cy="200" r="${r}" fill="none" stroke="#333" stroke-width="3"/>`).join('')}<path d="M60 120 L340 290" stroke="#fff" stroke-width="4" opacity=".6"/>`,
     muralha:()=>deco=Array.from({length:18},(_,i)=>`<rect x="${40+(i%6)*55}" y="${60+Math.floor(i/6)*95}" width="52" height="30" fill="${c}" stroke="#4a3620" stroke-width="3"/>`).join(''),
     serpente:()=>deco=`<path d="M40 340 C120 220 60 140 180 110 C300 80 330 200 260 250" fill="none" stroke="${c}" stroke-width="40" stroke-linecap="round"/>`,
     colosso:()=>deco=`<path d="M80 360 L130 90 L270 90 L320 360z" fill="${c}" opacity=".9"/><path d="M60 360 q140 -60 280 0" fill="#a07a4c"/>`,
     apagao:()=>deco=`<rect x="60" y="50" width="280" height="280" rx="30" fill="#140833" stroke="${col}" stroke-width="5"/>${Array.from({length:8},(_,i)=>`<path d="M${60+i*35} 330 v30 M60 ${60+i*35} h-30 M340 ${60+i*35} h30" stroke="${col}" stroke-width="4"/>`).join('')}`,
     esquecimento:()=>deco=`<circle cx="200" cy="200" r="190" fill="#0a0612" stroke="#7a6aa0" stroke-width="3" stroke-dasharray="6 10"/>${Array.from({length:14},(_,i)=>`<rect x="${200+Math.cos(i)*150}" y="${200+Math.sin(i)*150}" width="26" height="34" fill="#efe6d0" opacity=".7" transform="rotate(${i*25} ${200+Math.cos(i)*150} ${200+Math.sin(i)*150})"/>`).join('')}`,
     ecoVazio:()=>deco=`${[180,150,120].map((r,i)=>`<circle cx="200" cy="200" r="${r}" fill="none" stroke="${col}" stroke-width="8" opacity="${.2+i*.2}"/>`).join('')}`
   }[boss]||(()=>{}))();
   return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" class="en-svg"><defs>${fog}</defs>${deco}${face}</svg>`;
  }
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="en-svg"><defs>${fog}</defs>${s}</svg>`;
}
const LOGO=(size=1)=>`<div class="logo" style="--ls:${size}"><span class="l1">RAÍZES:</span><span class="l2">LEGADO</span></div>`;
