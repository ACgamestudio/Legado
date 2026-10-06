// ===================== SONS DOS GOLPES =====================
// Cada golpe que acerta faz barulho de impacto, com um "tempero" do tipo de quem ataca:
//   Corpo = soco pesado · Ritmo = tambor e palma · Tech = choque elétrico
//   Mente = sino e energia · Espírito = estrondo místico · vilões = golpe sombrio
// Crítico ganha estalo extra; esquiva faz zunido; escudo faz som metálico.
// Tudo é sintetizado na hora (sem arquivos) e segue o volume de "Efeitos sonoros".
const Golpe={
  out:null,nextAt:0,
  ready(){if(typeof Audio==='undefined')return false;Audio.resume();if(!Audio.ctx||!Audio.fx)return false;
    if(!this.out){const c=Audio.ctx,comp=c.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=8;comp.ratio.value=4;comp.attack.value=.002;comp.release.value=.12;
      const g=c.createGain();g.gain.value=1.6;comp.connect(g);g.connect(Audio.fx);this.out=comp}
    return true},
  // Golpes em vários alvos ao mesmo tempo saem um pouquinho espaçados
  slot(){const now=Audio.ctx.currentTime;let t=Math.max(now+.005,this.nextAt);if(t-now>.45)return null;this.nextAt=t+.06;return t},
  osc(t,f,d,type,v,to,dl=0){const c=Audio.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t+dl);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dl+d);
    g.gain.setValueAtTime(.0001,t+dl);g.gain.exponentialRampToValueAtTime(v,t+dl+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dl+d);o.connect(g);g.connect(this.out);o.start(t+dl);o.stop(t+dl+d+.03)},
  noise(t,type,f,d,v,to,dl=0,q=1){const c=Audio.ctx,s=c.createBufferSource();s.buffer=Audio.noise;const fl=c.createBiquadFilter();fl.type=type;fl.Q.value=q;fl.frequency.setValueAtTime(f,t+dl);if(to)fl.frequency.exponentialRampToValueAtTime(to,t+dl+d);
    const g=c.createGain();g.gain.setValueAtTime(.0001,t+dl);g.gain.exponentialRampToValueAtTime(v,t+dl+.003);g.gain.exponentialRampToValueAtTime(.0001,t+dl+d);s.connect(fl);fl.connect(g);g.connect(this.out);s.start(t+dl,Math.random()*.5);s.stop(t+dl+d+.03)},
  // a = quem ataca, t = alvo; cr = crítico; shielded = parte do dano foi no escudo
  impact(a,cr,shielded){if(!B||!B.ui||!this.ready())return;const t=this.slot();if(t==null)return;
    const r=()=>.94+Math.random()*.12; // pequena variação para não soar repetido
    // impacto base: pancada grave + estalo
    this.osc(t,130*r(),.16,'sine',.75,42);this.noise(t,'lowpass',2600,.09,.55,700);
    const kind=a&&a.isChar?a.type:'vilao';
    ({
      Corpo:()=>{this.osc(t,95*r(),.22,'sine',.7,38);this.noise(t,'lowpass',1300,.12,.5,300)},
      Ritmo:()=>{this.osc(t,210*r(),.18,'sine',.45,120);this.noise(t,'bandpass',1900,.12,.45,null,0,1.2);[0,.03,.055].forEach(d=>this.noise(t,'bandpass',1200,.04,.35,null,d+.02,2))},
      Tech:()=>{this.osc(t,1400*r(),.16,'sawtooth',.18,180);this.osc(t,62,.12,'square',.12,null,.01);this.noise(t,'highpass',4000,.08,.25,null,.01)},
      Mente:()=>{this.osc(t,880*r(),.32,'triangle',.18);this.osc(t,1320*r(),.28,'sine',.12,null,.03);this.noise(t,'bandpass',3000,.15,.2,800,0,3)},
      'Espírito':()=>{this.osc(t,330*r(),.35,'sine',.2,660);this.osc(t,70,.4,'sine',.5,35);this.noise(t,'lowpass',500,.3,.35,120)},
      vilao:()=>{this.osc(t,110*r(),.22,'sawtooth',.2,50);this.noise(t,'lowpass',700,.18,.5,150)}
    }[kind]||(()=>{}))();
    if(cr){this.noise(t,'highpass',3200,.07,.6,null,.015);this.osc(t,1600,.18,'square',.08,900,.015);this.osc(t,60,.3,'sine',.6,30,.01)}
    if(shielded){this.osc(t,520,.22,'square',.1,null,.005);this.osc(t,780,.2,'triangle',.12,null,.012);this.noise(t,'bandpass',3200,.1,.25,null,0,4)}
  },
  // Zunido de golpe que passa raspando
  dodge(){if(!B||!B.ui||!this.ready())return;const t=this.slot();if(t==null)return;this.noise(t,'bandpass',700,.18,.45,3200,0,1.5)}
};
