// ===================== VOZES DAS CUTSCENES =====================
// Cada fala toca o arquivo gravado em media/vozes/:
//   falas de abertura do capítulo:  cap<capítulo>_<número>.mp3      (ex.: cap1_01.mp3, cap1_02.mp3...)
//   falas do fim do capítulo:       cap<capítulo>_fim_<número>.mp3  (ex.: cap1_fim_01.mp3)
// Se o arquivo não existir, usa a voz automática do navegador (pode desligar nas Configurações).
// A lista completa das falas e dos nomes de arquivo está em media/vozes/ROTEIRO.md.
const VOZ_FEM=['atleta','historiadora','artista','capoeirista','empreendedora','medica','dancarina','fotografa','astronauta','cantora','esportista','reicinza','furacao'];
const Voice={
  el:null,faltando:{},token:0,ducked:false,prevMus:null,
  vol(){const v=S.settings.voice;return v==null?.9:v},
  file(n,part,i){const p=String(i).padStart(2,'0');return 'media/vozes/cap'+n+(part==='end'?'_fim_':'_')+p+'.mp3'},
  // Toca a fala; onEnd é chamado quando a voz termina (gravada ou automática)
  say(src,text,sp,onEnd){
    this.stop();if(this.vol()<=0)return;
    const tk=++this.token;const done=()=>{if(tk!==this.token)return;this.duck(false);this.mark(false);onEnd&&onEnd()};
    const tts=()=>{if(tk!==this.token)return;if(S.settings.tts===false){done();return}this.speak(text,sp,done,tk)};
    if(this.faltando[src]){tts();return}
    const a=this.el||(this.el=new window.Audio());a.preload='auto';
    a.onended=done;
    a.onerror=()=>{if(tk!==this.token)return;this.faltando[src]=true;tts()};
    a.src=src;a.volume=Math.min(1,this.vol());this.duck(true);this.mark(true);
    const p=a.play();if(p&&p.catch)p.catch(e=>{if(tk!==this.token)return;if(e&&e.name==='NotAllowedError'){this.duck(false);this.mark(false)}});
  },
  // Pré-carrega a próxima fala para não ter atraso
  preload(src){if(!src||this.faltando[src])return;const a=new window.Audio();a.preload='auto';a.onerror=()=>{this.faltando[src]=true};a.src=src},
  // ---- voz automática (Web Speech) ----
  voices(){const all=(window.speechSynthesis&&speechSynthesis.getVoices())||[];const pt=all.filter(v=>/^pt/i.test(v.lang));const br=pt.filter(v=>/BR/i.test(v.lang));return br.length?br:pt},
  pickVoice(fem){const vs=this.voices();if(!vs.length)return null;
    const F=/luciana|francisca|maria|vit[oó]ria|let[ií]cia|camila|thalita|helo[ií]sa|fernanda|female|feminin|joana|catarina/i,M=/daniel|ant[oô]nio|felipe|ricardo|duarte|male|masculin|j[uú]lio|donato|fabio|humberto/i;
    return vs.find(v=>(fem?F:M).test(v.name))||vs[0]},
  speak(text,sp,done,tk){
    if(!('speechSynthesis' in window)||!window.SpeechSynthesisUtterance){done();return}
    const u=new SpeechSynthesisUtterance(text.replace(/["“”]/g,''));u.lang='pt-BR';
    const boss=typeof BOSSES!=='undefined'&&BOSSES[sp],fem=VOZ_FEM.includes(sp);
    const v=this.pickVoice(fem);if(v)u.voice=v;
    u.rate=sp==='narr'?.95:sp==='dj'||sp==='dancarina'?1.12:1.04;
    u.pitch=sp==='narr'?.95:boss?(fem?.85:.55):fem?1.2:.85;
    u.volume=Math.min(1,this.vol());
    u.onend=u.onerror=()=>{if(tk===this.token)done()};
    this.duck(true);this.mark(true);
    try{speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){done()}
  },
  stop(){this.token++;if(this.el){this.el.onended=this.el.onerror=null;try{this.el.pause()}catch(e){}}
    try{if(window.speechSynthesis)speechSynthesis.cancel()}catch(e){}this.duck(false);this.mark(false)},
  // Abaixa a música enquanto alguém fala
  duck(on){if(on===this.ducked)return;this.ducked=on;
    try{ChMusic.setDuck(on)}catch(e){}
    try{if(Audio.mus){if(on){this.prevMus=Audio.mus.gain.value;Audio.mus.gain.value=this.prevMus*.3}else if(this.prevMus!=null){Audio.mus.gain.value=this.prevMus;this.prevMus=null}}}catch(e){}},
  mark(on){const d=document.getElementById('dlg');if(d)d.classList.toggle('speaking',on)}
};
// Algumas plataformas só carregam a lista de vozes depois
if(window.speechSynthesis&&speechSynthesis.addEventListener)speechSynthesis.addEventListener('voiceschanged',()=>{});
