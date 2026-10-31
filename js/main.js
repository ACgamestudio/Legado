// ===================== INICIALIZAÇÃO =====================
load();
window.addEventListener('resize',fit);if(window.visualViewport)visualViewport.addEventListener('resize',fit);
document.addEventListener('pointerdown',()=>Audio.resume(),{once:false});
// Versão GitHub: detecta fundos reais e vídeos de especiais dos heróis e vilões.
if(window.REPO){
  ['brasil','ocidental','caribe','eua','austral','latina','oriental','futuro','final','hub'].forEach(id=>{if(IMG['bg_'+id])return;const i=new Image();i.onload=()=>{IMG['bg_'+id]=i.src};i.src='assets/fundos/'+id+'.jpg'});
  CHARS.forEach(c=>{if(MEDIA['esp_'+c.id])return;const v=document.createElement('video');v.preload='metadata';v.onloadedmetadata=()=>{MEDIA['esp_'+c.id]=v.src};v.src='media/especiais/'+c.id+'.mp4'});
  // Vilões: media/especiais-viloes/<nome em minúsculo>.mp4 (ex.: zara.mp4, lucifer.mp4, areias.mp4). Ver vilSlugs() em battle.js
  [...Object.values(ENEMIES),...Object.values(BOSSES)].forEach(E=>vilSlugs(E).forEach(sl=>{if(MEDIA['espv_'+sl])return;const v=document.createElement('video');v.preload='metadata';v.onloadedmetadata=()=>{MEDIA['espv_'+sl]=v.src};v.onerror=()=>{};v.src='media/especiais-viloes/'+sl+'.mp4'}));
}
fit();ensureDaily();LiveFX.start();show('start');checkAch();
