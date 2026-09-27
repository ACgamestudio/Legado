# RAÍZES: LEGADO

> Nossa história é o nosso maior poder.

RPG de aventura, estratégia e coleção de personagens que celebra a cultura, a ancestralidade e as conquistas da população negra na África e na diáspora. Feito com HTML, CSS e JavaScript puro, sem dependências.

## Jogar localmente

Abra a pasta no VS Code e use a extensão **Live Server** (clique direito em `index.html` → *Open with Live Server*). Abrir o `index.html` direto no navegador também funciona.

## Estrutura

```
index.html          página principal
css/style.css       visual do jogo
js/assets.js        caminhos das imagens
js/data.js          personagens, regiões, inimigos, chefes, história
js/data2.js         colecionáveis, quiz, construções, missões, eventos
js/core.js          salvamento, progressão, conquistas, trilha sonora procedural
js/gfx.js           cenários e inimigos em SVG
js/ui.js            telas e menus
js/battle.js        combate, recompensas, expedição, tutorial
js/mini.js          desafios rápidos (ritmo, memória, quiz, corrida)
js/main.js          inicialização
assets/             artes do menu, cidades, personagens, vilões e fundos
media/              vídeo da produtora, abertura e música tema
```

## Controles

- Batalha: teclas 1 a 4 ou clique; clique no inimigo para mudar o alvo.
- Roda de Ritmo: D F J K ou toque.
- Corrida: espaço ou toque.

O progresso fica salvo no `localStorage` do navegador.

## Fundos reais e vídeos de especiais

- Fundos das regiões: coloque imagens em `assets/fundos/` com os nomes `brasil.jpg`, `ocidental.jpg`, `caribe.jpg`, `eua.jpg`, `austral.jpg`, `latina.jpg`, `oriental.jpg`, `futuro.jpg` e `final.jpg`.
- Vídeos de especiais: coloque vídeos em `media/especiais/` com o id do personagem, por exemplo `engenheiro.mp4` (André Cruz). O vídeo toca na Suprema.
- Os vilões ficam em `assets/viloes/`.

## Tela cheia

O jogo entra em tela cheia e na horizontal ao tocar em INICIAR e volta para tela cheia no próximo toque se o jogador sair. Instalado como app (menu do navegador → "Adicionar à tela inicial"), ele já abre em tela cheia na horizontal.
