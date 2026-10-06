// ===================== INICIALIZAÇÃO =====================
load();
window.addEventListener('resize',fit);if(window.visualViewport)visualViewport.addEventListener('resize',fit);
document.addEventListener('pointerdown',()=>Audio.resume(),{once:false});
// Versão GitHub: detecta fundos reais (assets/fundos/<região>.jpg) e vídeos de especiais (media/especiais/<personagem>.mp4)
if(window.REPO){
  ['brasil','ocidental','caribe','eua','austral','latina','oriental','futuro','final','hub'].forEach(id=>{if(IMG['bg_'+id])return;const i=new Image();i.onload=()=>{IMG['bg_'+id]=i.src};i.src='assets/fundos/'+id+'.jpg'});
  CHARS.forEach(c=>{if(MEDIA['esp_'+c.id])return;const v=document.createElement('video');v.preload='metadata';v.onloadedmetadata=()=>{MEDIA['esp_'+c.id]=v.src};v.src='media/especiais/'+c.id+'.mp4'});
}
fit();ensureDaily();LiveFX.start();show('start');checkAch();
