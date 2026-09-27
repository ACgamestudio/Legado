// ===================== INICIALIZAÇÃO =====================
load();
window.addEventListener('resize',fit);if(window.visualViewport)visualViewport.addEventListener('resize',fit);
document.addEventListener('pointerdown',()=>Audio.resume(),{once:false});
fit();ensureDaily();show('start');checkAch();
