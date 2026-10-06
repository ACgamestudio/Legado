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
js/fx.js            cenários vivos: poeira brilhante, troca de luz e zoom lento
js/ui.js            telas e menus
js/battle.js        combate, recompensas, expedição, tutorial
js/mini.js          desafios rápidos (ritmo, memória, quiz, corrida)
js/main.js          inicialização
assets/             artes do menu, cidades, personagens, vilões e fundos
media/              vídeo da produtora, abertura, música tema e músicas dos capítulos
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

## Músicas dos capítulos

Cada capítulo tem sua própria música em `media/capitulos/cap1.mp3` a `cap9.mp3`. Ela toca na cutscene do capítulo, na tela da região, na montagem de equipe e nas batalhas daquela região (o capítulo 9 toca na batalha final). Para trocar uma música, basta substituir o arquivo mantendo o nome. Se um arquivo faltar, o jogo usa a trilha procedural da região. Menus continuam com `media/musica.mp3`, e os minigames (Ritmo, Corrida) mantêm a trilha própria.

## Vídeos das Supremas

Os especiais ficam em `media/especiais/<id>.mp4` (3:4, 720x960, ~4 s). Ao usar a Suprema, o vídeo aparece em uma moldura grande inclinada, com o nome da Suprema, o personagem, o tipo, uma fala e uma barra de progresso, sobre um fundo desfocado na cor do tipo. A música do capítulo abaixa enquanto o vídeo toca. Falta `lider.mp4`.

## Cenários vivos

Todos os fundos parados (regiões, capítulos, cutscenes, batalhas, Vila Baobá, menu e tela inicial) ganham poeira brilhante, troca lenta de iluminação (luz quente e sombra fria se alternando) e zoom lento. O menu principal não tem zoom para não desalinhar os botões desenhados na arte. Tudo desliga com "Animações" desmarcado nas Configurações ou com "reduzir movimento" ativado no aparelho.

## Quiz

Cada pergunta pertence a uma região (`r` em `js/data2.js`) e tem uma explicação (`why`). A resposta certa é sempre a primeira opção da lista; o jogo embaralha. O Desafio Cultural de cada região pergunta só sobre aquela região. No Quiz Cultural o jogador escolhe a região (ou "Volta ao mundo") e o fundo muda para o lugar de cada pergunta. Depois de responder, aparece a resposta certa e o porquê.

## Especial sem som

O vídeo `media/especiais/engenheiro.mp4` (André Cruz) não tem mais faixa de áudio, e o jogo também toca esse especial sempre mudo (lista `SPV_MUDO` em `js/battle.js`). Para silenciar outro especial, acrescente o id do personagem nessa lista.
