// ===================== CENÁRIOS VIVOS =====================
// Deixa os fundos parados com vida: zoom lento (CSS), troca de iluminação (CSS)
// e poeira brilhante (canvas). Desliga sozinho com "Animações" desativado nas
// Configurações ou com "reduzir movimento" no aparelho.
const LiveFX={
  // Camada colocada por cima de qualquer fundo. Usa <span> para não herdar estilos de "div".
  layer(){return '<span class="lfx" aria-hidden="true"><i class="lfx-warm"></i><i class="lfx-cool"></i><i class="lfx-ray"></i><canvas class="lfx-dust"></canvas></span>'},
  list:[],raf:0,last:0,sprite:null,
  off(){return (typeof S!=='undefined'&&S.settings&&S.settings.motion===false)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)},
  // Brilho pré-desenhado (mais leve que shadowBlur a cada quadro)
  makeSprite(){const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');
    const g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba(255,240,200,.95)');g.addColorStop(.45,'rgba(255,200,110,.35)');g.addColorStop(1,'rgba(255,180,80,0)');
    x.fillStyle=g;x.fillRect(0,0,32,32);return c},
  init(cv){
    cv.dataset.on='1';
    const w=Math.max(80,cv.clientWidth),h=Math.max(60,cv.clientHeight);
    const q=w>900?.5:.75; // fundos grandes em meia resolução: leve no celular
    cv.width=Math.round(w*q);cv.height=Math.round(h*q);
    const n=Math.max(10,Math.min(70,Math.round(w*h/20000)));
    const P=[];for(let i=0;i<n;i++)P.push(this.spawn(cv,true));
    this.list.push({cv,ctx:cv.getContext('2d'),P,q});
  },
  spawn(cv,anywhere){const W=cv.width,H=cv.height,big=Math.random()<.18;
    return {x:Math.random()*W,y:anywhere?Math.random()*H:H+10,
      r:(big?2.6+Math.random()*2.2:.8+Math.random()*1.6),
      vx:(Math.random()-.5)*.12,vy:-(.04+Math.random()*.16),
      sw:Math.random()*Math.PI*2,sws:.004+Math.random()*.01,
      ph:Math.random()*Math.PI*2,sp:.8+Math.random()*2.2,big}},
  scan(){
    if(this.off())return;
    document.querySelectorAll('canvas.lfx-dust:not([data-on])').forEach(cv=>{if(cv.isConnected&&cv.clientWidth)this.init(cv)});
    if(this.list.length&&!this.raf){this.last=performance.now();this.raf=requestAnimationFrame(t=>this.tick(t))}
  },
  tick(t){
    this.list=this.list.filter(o=>o.cv.isConnected);
    if(!this.list.length||this.off()){this.raf=0;this.list.forEach(o=>o.ctx.clearRect(0,0,o.cv.width,o.cv.height));return}
    const dt=Math.min(3,(t-this.last)/16.7);this.last=t;const s=t/1000;
    if(!this.sprite)this.sprite=this.makeSprite();
    for(const o of this.list){const {ctx,cv,P,q}=o,W=cv.width,H=cv.height;
      ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
      for(let i=0;i<P.length;i++){const p=P[i];
        p.sw+=p.sws*dt;p.x+=(p.vx+Math.sin(p.sw)*.08)*dt*q*2;p.y+=p.vy*dt*q*2;
        if(p.y<-12||p.x<-12||p.x>W+12){P[i]=this.spawn(cv,false);continue}
        const tw=.5+.5*Math.sin(s*p.sp+p.ph),a=(p.big?.35:.25)+tw*tw*(p.big?.65:.55);
        const R=p.r*q*2*(.8+tw*.4)*3.2;
        ctx.globalAlpha=a;ctx.drawImage(this.sprite,p.x-R,p.y-R,R*2,R*2);
        // Cintilar em cruz nas partículas maiores
        if(p.big&&tw>.82){const L=R*(.55+.9*(tw-.82)/.18);ctx.globalAlpha=a*.7;ctx.strokeStyle='#fff3cf';ctx.lineWidth=Math.max(.6,q);
          ctx.beginPath();ctx.moveTo(p.x-L,p.y);ctx.lineTo(p.x+L,p.y);ctx.moveTo(p.x,p.y-L);ctx.lineTo(p.x,p.y+L);ctx.stroke()}
      }
      ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    }
    this.raf=requestAnimationFrame(t2=>this.tick(t2));
  },
  apply(){document.documentElement.classList.toggle('nomotion',this.off());if(this.off()){this.list=[];document.querySelectorAll('canvas.lfx-dust').forEach(c=>{c.removeAttribute('data-on');const x=c.getContext('2d');x&&x.clearRect(0,0,c.width,c.height)})}else this.scan()},
  start(){
    const st=document.getElementById('stage');if(!st)return;
    let pend=false;new MutationObserver(()=>{if(pend)return;pend=true;requestAnimationFrame(()=>{pend=false;this.scan()})}).observe(st,{childList:true,subtree:true});
    this.apply();
  }
};
