// ------------- 100 COLECIONÁVEIS -------------
// [nome, ícone, categoria, história]
const ITEM_RAW = {
 brasil:[
  ['Berimbau de Mestre','🏹','Instrumento','Arco musical com cabaça que comanda o ritmo e a velocidade do jogo na roda de capoeira.'],
  ['Atabaque do Terreiro','🥁','Instrumento','Tambor de couro tocado com as mãos, presente no samba de roda, na capoeira e em celebrações afro-brasileiras.'],
  ['Abadá de Formatura','👕','Roupa','Uniforme branco da capoeira. Esta tem a assinatura de todos os colegas de roda de Luana.'],
  ['Turbante de Baiana','🧣','Roupa','As baianas de acarajé foram reconhecidas como patrimônio imaterial pelo Iphan em 2004, junto com o seu ofício.'],
  ['Tabuleiro de Acarajé','🍤','Receita','Bolinho de feijão-fradinho frito no azeite de dendê, com origem na culinária iorubá.'],
  ['Surdo de Bloco Afro','🪘','Instrumento','O tambor grave que marca o passo dos blocos afro de Salvador, como Ilê Aiyê e Olodum.'],
  ['Página de "Quarto de Despejo"','📖','Livro','Carolina Maria de Jesus escreveu seu diário em cadernos achados no lixo. O livro virou best-seller em 1960.'],
  ['Pena de Machado','🪶','Objeto histórico','Uma pena simbólica em homenagem a Machado de Assis, fundador da Academia Brasileira de Letras.'],
  ['Fita do Bonfim','🎗️','Símbolo','Amarrada no pulso com três nós, cada um para um desejo. Só pode ser tirada quando se rompe sozinha.'],
  ['Mapa do Quilombo','🗺️','Objeto histórico','Os quilombos eram comunidades livres. Palmares, na Serra da Barriga, resistiu por quase um século.'],
  ['Foto do Desfile','📷','Fotografia','Foto fictícia da mãe de Kayo desfilando no bloco da Vila Baobá, restaurada pelo Livro Sankofa.'],
  ['Tablet Holográfico de André','📲','Instrumento científico','O tablet onde André Cruz guarda o backup do acervo da Biblioteca Viva. A Névoa não apaga o que tem backup.']],
 ocidental:[
  ['Manuscrito de Tombuctu','📜','Livro','Tombuctu guardou dezenas de milhares de manuscritos sobre astronomia, medicina, matemática e direito.'],
  ['Tecido Kente','🧵','Roupa','Tecido tradicional de Gana, feito em faixas estreitas costuradas. Cada padrão e cor tem nome e significado.'],
  ['Kora de 21 Cordas','🎸','Instrumento','Harpa-alaúde dos griots do Mali, Senegal, Gâmbia e Guiné. Soa como chuva de notas.'],
  ['Djembê','🥁','Instrumento','Tambor em forma de cálice da África Ocidental. Dizem que tem três vozes: grave, tom e estalo.'],
  ['Símbolo Sankofa','🐦','Símbolo','Símbolo adinkra dos povos akan: um pássaro que olha para trás. Volte e busque o que ficou.'],
  ['Carimbo Adinkra','🔶','Artefato cultural','Carimbo esculpido em cabaça usado para estampar símbolos adinkra em tecidos.'],
  ['Moeda de Cauri','🐚','Artefato cultural','Conchas de cauri foram usadas como moeda em várias regiões da África por séculos.'],
  ['Mapa de Mansa Musa','🧭','Objeto histórico','O imperador do Mali ficou famoso pela peregrinação a Meca em 1324, com tanta riqueza que marcou a história.'],
  ['Mesquita de Djenné (miniatura)','🕌','Obra de arte','A maior construção de adobe do mundo. A comunidade reboca as paredes todo ano numa grande festa.'],
  ['Vinil de Afrobeat','💿','Música','Fela Kuti criou o afrobeat na Nigéria misturando highlife, jazz e funk com letras políticas.'],
  ['Jollof da Disputa','🍛','Receita','Arroz com tomate e pimenta. Gana e Nigéria discutem com carinho qual país faz o melhor.'],
  ['Máscara de Bronze do Benin','🗿','Obra de arte','Os bronzes do Reino do Benin são obras-primas de fundição. Vários estão sendo devolvidos à Nigéria.']],
 caribe:[
  ['Steel Pan','🥘','Instrumento','Criado em Trinidad e Tobago a partir de barris de petróleo, é um dos instrumentos acústicos mais novos do século XX.'],
  ['Caixa de Sound System','🔊','Música','Os sound systems jamaicanos das ruas de Kingston foram a base do reggae, do dub e da cultura DJ.'],
  ['Soup Joumou','🍲','Receita','Sopa de abóbora que os haitianos tomam todo 1º de janeiro para celebrar a independência de 1804.'],
  ['Bandeira de 1804','🚩','Objeto histórico','O Haiti foi a primeira república negra independente das Américas.'],
  ['Clave Cubana','🎵','Instrumento','Duas varetas de madeira que marcam o padrão rítmico no coração da música afro-cubana.'],
  ['Saia de Rumba','👗','Roupa','A rumba cubana nasceu em comunidades afro-cubanas e é patrimônio imaterial da UNESCO desde 2016.'],
  ['Câmera de Imani','📸','Fotografia','Câmera analógica com um filme cheio de festas de rua de Kingston.'],
  ['Pintura Naïf Haitiana','🖼️','Obra de arte','A pintura haitiana ficou famosa por cores vivas, mercados, florestas e cenas do cotidiano.'],
  ['Tambor Garifuna','🪘','Instrumento','Os garifunas, afro-indígenas da costa caribenha da América Central, têm música reconhecida pela UNESCO.'],
  ['Coco com Canudo','🥥','Objeto','Nada histórico. Só delicioso. Até heróis precisam de uma pausa.'],
  ['Máscara de Carnaval de Trinidad','🎭','Artefato cultural','O carnaval de Trinidad mistura calipso, soca e fantasias gigantescas.'],
  ['Disco de Ska','💿','Música','O ska surgiu na Jamaica nos anos 1950/60 e abriu caminho para o rocksteady e o reggae.']],
 eua:[
  ['Trompete de Nova Orleans','🎺','Instrumento','O jazz nasceu em Nova Orleans no começo do século XX, misturando blues, ragtime e ritmos afro-caribenhos.'],
  ['Violão de Blues','🎸','Instrumento','O blues nasceu no sul dos EUA e é a base de quase toda a música popular moderna.'],
  ['Toca-discos do Bronx','🎛️','Música','O hip-hop nasceu no Bronx nos anos 1970, em festas de bairro onde DJs estendiam as batidas dos discos.'],
  ['Spray de Grafite','🎨','Obra de arte','Um dos quatro elementos do hip-hop, ao lado do DJ, do MC e da dança break.'],
  ['Semáforo de Garrett Morgan','🚦','Instrumento científico','Garrett Morgan patenteou em 1923 um sinal de trânsito com posição de alerta.'],
  ['Pote de Madam C.J. Walker','🧴','Objeto histórico','Criou uma linha de produtos para cabelo e é citada como a primeira mulher a se tornar milionária por conta própria nos EUA.'],
  ['Cálculos de Katherine Johnson','📐','Instrumento científico','A matemática da NASA calculou trajetórias para missões espaciais históricas.'],
  ['Luva Mecânica de Marcus','🦾','Instrumento científico','Protótipo montado com peças de carro de Detroit. Funciona. Às vezes.'],
  ['Disco de Soul de Detroit','💿','Música','Detroit foi berço de uma gravadora lendária que levou a soul para o mundo nos anos 1960.'],
  ['Colcha de Retalhos','🧶','Artefato cultural','As colchas de Gee\'s Bend, no Alabama, feitas por mulheres negras, hoje estão em museus de arte.'],
  ['Microfone de Rima','🎤','Música','O MC comanda a festa. Rimar é contar histórias em cima do ritmo.'],
  ['Tênis de Break','👟','Roupa','O breaking nasceu nas festas de hip-hop e estreou como esporte olímpico em Paris 2024.']],
 austral:[
  ['Pedra do Grande Zimbábue','🪨','Objeto histórico','As muralhas foram erguidas sem argamassa, entre os séculos XI e XV.'],
  ['Pássaro de Pedra-sabão','🦅','Obra de arte','Esculturas de pássaros achadas no Grande Zimbábue. Uma delas está na bandeira do país.'],
  ['Rinoceronte de Ouro','🦏','Artefato cultural','Pequena escultura de ouro de Mapungubwe, reino que floresceu antes do Grande Zimbábue.'],
  ['Log Drum de Amapiano','🥁','Música','O amapiano, nascido na África do Sul nos anos 2010, tem um grave percussivo inconfundível.'],
  ['Bastões de Luta','🥢','Artefato cultural','A luta com bastões é tradição nguni de habilidade, disciplina e respeito.'],
  ['Colar de Contas Zulu','📿','Joia','No trabalho de contas zulu, cores e padrões podem transmitir mensagens.'],
  ['Caderno de Campo de Thabo','📓','Livro','Cada pedra desenhada antes de ser tocada. Primeira regra da arqueologia de Thabo.'],
  ['Placa "Ubuntu"','🤝','Símbolo','Filosofia de língua banta: uma pessoa é pessoa por meio das outras pessoas.'],
  ['Cédula Comemorativa','💵','Objeto histórico','Nelson Mandela tornou-se o primeiro presidente eleito democraticamente da África do Sul em 1994.'],
  ['Cerâmica Ndebele','🏺','Obra de arte','O povo ndebele é famoso por pinturas geométricas vibrantes em casas e objetos.'],
  ['Bunny Chow','🍞','Receita','Pão oco recheado com curry, criado em Durban. Come-se com as mãos.'],
  ['Mbira','🎹','Instrumento','"Piano de polegar" do povo shona do Zimbábue, com lâminas metálicas sobre madeira.']],
 latina:[
  ['Tambor Alegre','🥁','Instrumento','Tambor da música de Palenque e do litoral caribenho da Colômbia.'],
  ['Trança-Mapa','💇🏾‍♀️','Símbolo','Relatos orais contam que tranças guardavam caminhos e sementes durante fugas para a liberdade.'],
  ['Estátua de Benkos Biohó','🗽','Objeto histórico','Líder que fundou San Basilio de Palenque, o primeiro povoado livre das Américas.'],
  ['Marimba de Chonta','🎼','Instrumento','A música de marimba do Pacífico colombiano e equatoriano é patrimônio da UNESCO.'],
  ['Dicionário Palenquero','📘','Livro','A língua palenquera mistura espanhol com línguas bantas e ainda é falada em Palenque.'],
  ['Vinil de Cumbia','💿','Música','A cumbia colombiana tem raízes africanas, indígenas e europeias.'],
  ['Chuteira de Valentina','👟','Roupa','Gasta de tanto treino na areia do Rio Atrato.'],
  ['Cocada Palenquera','🍬','Receita','As doceiras de Palenque vendem doces tradicionais nas ruas de Cartagena.'],
  ['Máscara de Congo','🎭','Artefato cultural','O Congo de Portobelo, no Panamá, é uma tradição afro-panamenha de teatro, dança e memória.'],
  ['Cajón Peruano','📦','Instrumento','Caixa de madeira criada por afroperuanos. Hoje é tocada no mundo todo.'],
  ['Foto da Praça de Palenque','📷','Fotografia','Crianças brincando ao redor da estátua. A cena que a Névoa quase apagou.'],
  ['Currulao','🎶','Música','Ritmo do Pacífico colombiano, com marimba, cununos e cantos em resposta.']],
 oriental:[
  ['Miniatura do Obelisco de Aksum','🗼','Objeto histórico','Aksum ergueu obeliscos enormes. Um deles, levado para Roma, voltou à Etiópia em 2005.'],
  ['Moeda de Aksum','🪙','Objeto histórico','O Reino de Aksum foi um dos primeiros da África a cunhar moedas próprias.'],
  ['Cruz de Lalibela','✝️','Obra de arte','Em Lalibela, igrejas foram esculpidas em uma única rocha, de cima para baixo.'],
  ['Cerimônia do Café','☕','Receita','Na Etiópia, o café é torrado, moído e servido em três rodadas, com calma e conversa.'],
  ['Pergaminho em Ge\'ez','📜','Livro','Ge\'ez é a antiga língua da Etiópia, com escrita própria usada até hoje em textos religiosos.'],
  ['Kanga Estampada','🧣','Roupa','Tecido da costa suaíli que costuma trazer um provérbio impresso.'],
  ['Muda do Cinturão Verde','🌱','Símbolo','Wangari Maathai, do Quênia, liderou o plantio de milhões de árvores e ganhou o Nobel da Paz em 2004.'],
  ['Tênis de Maratona','👟','Roupa','Corredores do Quênia e da Etiópia dominam as maratonas mundiais há décadas.'],
  ['Mural de Matatu','🚌','Obra de arte','Os matatus de Nairóbi são micro-ônibus decorados com grafite, luz e som.'],
  ['Krar','🪕','Instrumento','Lira de cinco ou seis cordas tocada na Etiópia e na Eritreia.'],
  ['Porta Entalhada de Zanzibar','🚪','Artefato cultural','As portas de madeira entalhada de Stone Town misturam influências africanas, árabes e indianas.'],
  ['Dicionário Suaíli','📗','Livro','O suaíli é uma das línguas mais faladas da África. "Hakuna matata" quer dizer "sem problemas".']],
 futuro:[
  ['Tecido de Grafeno Kente','🧬','Roupa','Tecido inteligente de Neo-Axé que muda de padrão conforme a música.'],
  ['Holograma da Universidade','🏛️','Objeto','A Universidade de Neo-Axé homenageia Sankoré, de Tombuctu, com um arquivo aberto.'],
  ['Capacete de Ayana','🪖','Instrumento científico','Viseira que mostra constelações usadas por povos antigos para navegar.'],
  ['Drone Jardineiro','🛸','Instrumento científico','Planta árvores nos telhados. Inspirado no Cinturão Verde.'],
  ['Sintetizador Afrofuturo','🎹','Música','Mistura samples de kora, surdo e steel pan com sons eletrônicos.'],
  ['Cristal de Memória','💎','Artefato cultural','Guarda uma história contada por uma avó. Nunca apaga.'],
  ['Moto Magnética','🏍️','Objeto','Veículo de Neo-Axé com padrões geométricos pintados à mão.'],
  ['Máscara Holográfica','🎭','Obra de arte','Arte digital inspirada em máscaras tradicionais, criada com a permissão das comunidades.'],
  ['Mapa Estelar Dogon','🌌','Objeto histórico','Os dogons, do Mali, têm uma rica tradição de conhecimento sobre o céu, ainda debatida por pesquisadores.'],
  ['Chip de Backup Pan-africano','💾','Instrumento científico','Backup do arquivo em cinco continentes. A lição da APAGÃO.'],
  ['Colar Neon','📿','Joia','Contas que acendem conforme o batimento de quem usa.'],
  ['Placa da Estação Orbital','🛰️','Objeto','Primeira estação de Neo-Axé. Nome escolhido por votação das escolas.']],
 legado:[
  ['Livro Sankofa','📕','Artefato cultural','O livro que abre portais para as memórias do mundo. Guardado pela avó de Kayo.'],
  ['Folha do Baobá','🍃','Símbolo','O baobá pode viver por séculos. Na Vila, é onde todos se reúnem.'],
  ['Coroa de Kayo','👑','Joia','Não é de realeza. É o símbolo da Vila: cada pessoa é importante.'],
  ['Página Restaurada','📄','Livro','A última página do livro. Está em branco de propósito: é sua para escrever.']]
};
const ITEMS=[]; for(const r in ITEM_RAW) ITEM_RAW[r].forEach((it,i)=>ITEMS.push({id:r+'_'+i, region:r, name:it[0], ic:it[1], cat:it[2], story:it[3]}));
const IT = Object.fromEntries(ITEMS.map(i=>[i.id,i]));

// ------------- QUIZ CULTURAL -------------
const QUIZ = [
 ['O que significa "Sankofa", símbolo dos povos akan?',['Volte e busque o que ficou para trás','Siga sempre em frente','A força do trovão','Casa grande'],0],
 ['Em que cidade africana ficavam milhares de manuscritos antigos de ciência e direito?',['Tombuctu','Cairo','Luanda','Dacar'],0],
 ['Qual país foi a primeira república negra independente das Américas, em 1804?',['Haiti','Jamaica','Cuba','Brasil'],0],
 ['O afrobeat foi criado por Fela Kuti em qual país?',['Nigéria','Gana','Senegal','Quênia'],0],
 ['Onde nasceu o jazz?',['Nova Orleans','Chicago','Paris','Detroit'],0],
 ['O hip-hop surgiu nos anos 1970 em qual bairro de Nova York?',['Bronx','Manhattan','Queens','Staten Island'],0],
 ['Em que ano a roda de capoeira foi reconhecida como patrimônio da humanidade pela UNESCO?',['2014','1988','2001','2020'],0],
 ['Qual instrumento comanda o ritmo da roda de capoeira?',['Berimbau','Cavaquinho','Kora','Steel pan'],0],
 ['O steel pan foi criado em qual país?',['Trinidad e Tobago','Barbados','Haiti','Porto Rico'],0],
 ['Wangari Maathai, que ganhou o Nobel da Paz em 2004, era de qual país?',['Quênia','Etiópia','Uganda','Tanzânia'],0],
 ['Quem foi o primeiro presidente eleito democraticamente da África do Sul?',['Nelson Mandela','Desmond Tutu','Thabo Mbeki','Steve Biko'],0],
 ['Quem fundou a Academia Brasileira de Letras e foi seu primeiro presidente?',['Machado de Assis','Lima Barreto','Castro Alves','Cruz e Sousa'],0],
 ['"Quarto de Despejo" foi escrito por...',['Carolina Maria de Jesus','Conceição Evaristo','Cecília Meireles','Clarice Lispector'],0],
 ['Qual desses reinos ficou famoso pelo imperador Mansa Musa?',['Império do Mali','Reino de Aksum','Reino do Congo','Grande Zimbábue'],0],
 ['As muralhas do Grande Zimbábue foram construídas...',['Sem argamassa','Com concreto','Com tijolos de barro cozido','Com madeira'],0],
 ['Em Lalibela, na Etiópia, as igrejas foram...',['Esculpidas em uma única rocha','Feitas de bambu','Construídas flutuando num lago','Pintadas de ouro'],0],
 ['San Basilio de Palenque, na Colômbia, é considerado...',['O primeiro povoado livre das Américas','A maior cidade da Colômbia','Uma ilha vulcânica','Um templo antigo'],0],
 ['Qual filosofia banta diz "eu sou porque nós somos"?',['Ubuntu','Sankofa','Hakuna matata','Axé'],0],
 ['O tecido kente é tradicional de qual país?',['Gana','Marrocos','Angola','Moçambique'],0],
 ['Qual país africano tem mais pirâmides antigas que o Egito?',['Sudão','Etiópia','Mali','Nigéria'],0],
 ['Mae Jemison entrou para a história em 1992 por ser...',['A primeira mulher negra no espaço','A primeira presidente dos EUA','Campeã olímpica de natação','Fundadora de uma gravadora'],0],
 ['O Dia Nacional de Zumbi e da Consciência Negra no Brasil é em...',['20 de novembro','13 de maio','7 de setembro','25 de julho'],0],
 ['O amapiano é um gênero musical nascido em qual país?',['África do Sul','Nigéria','Brasil','Jamaica'],0],
 ['A kora, harpa dos griots, tem quantas cordas tradicionalmente?',['21','6','4','12'],0],
 ['A jogadora Marta foi eleita melhor do mundo pela FIFA quantas vezes?',['6','2','10','4'],0],
 ['O reggae nasceu em qual país?',['Jamaica','Cuba','Trinidad e Tobago','Bahamas'],0]
];

// ------------- COMUNIDADE (construções) -------------
const BUILDINGS = [
 {id:'biblioteca', name:'Biblioteca Viva', ic:'📚', desc:'Guarda as memórias recuperadas.', bonus:'+5% de XP por nível', max:5, cost:[300,700,1400,2600,4500]},
 {id:'estudio', name:'Estúdio de Música', ic:'🎧', desc:'Onde Kwame e Eli ensaiam.', bonus:'+4% de energia inicial por nível', max:5, cost:[400,900,1700,3000,5000]},
 {id:'oficina', name:'Oficina Maker', ic:'🔧', desc:'Marcus e André criam e programam aqui.', bonus:'+4% de defesa da equipe por nível', max:5, cost:[400,900,1700,3000,5000]},
 {id:'quadra', name:'Quadra Comunitária', ic:'🏀', desc:'Treinos de Nia e Valentina.', bonus:'+4% de ataque da equipe por nível', max:5, cost:[400,900,1700,3000,5000]},
 {id:'mercado', name:'Mercado da Vila', ic:'🧺', desc:'Cooperativa organizada por Amara.', bonus:'+6% de Cauris por nível', max:5, cost:[350,800,1500,2800,4800]},
 {id:'cozinha', name:'Cozinha Coletiva', ic:'🍲', desc:'Chef Émile alimenta todo mundo.', bonus:'+4% de vida da equipe por nível', max:5, cost:[350,800,1500,2800,4800]},
 {id:'centro', name:'Centro Cultural', ic:'🎭', desc:'Festivais, rodas e exposições.', bonus:'+1 recompensa de missão diária por nível (Sementes)', max:3, cost:[1200,3000,6000]},
 {id:'baoba', name:'Baobá Ancestral', ic:'🌳', desc:'O coração da Vila. Cresce com o legado.', bonus:'+3% em todos os atributos por nível', max:5, cost:[1000,2500,5000,9000,15000]}
];

// ------------- EVENTOS SEMANAIS -------------
const EVENTS = [
 {name:'Festival dos Tambores', ic:'🥁', desc:'Personagens de Ritmo causam +25% de dano.', type:'Ritmo'},
 {name:'Feira de Inventores', ic:'⚙️', desc:'Personagens de Tech causam +25% de dano.', type:'Tech'},
 {name:'Campeonato da Vila', ic:'🏆', desc:'Personagens de Corpo causam +25% de dano.', type:'Corpo'},
 {name:'Semana do Conhecimento', ic:'📚', desc:'Personagens de Mente causam +25% de dano.', type:'Mente'},
 {name:'Noite dos Ancestrais', ic:'✨', desc:'Personagens de Espírito causam +25% de dano.', type:'Espírito'}
];

// ------------- MISSÕES DIÁRIAS -------------
const MISSION_POOL = [
 {id:'win3', text:'Vença 3 batalhas', stat:'wins', n:3, r:{cauris:150}},
 {id:'win5', text:'Vença 5 batalhas', stat:'wins', n:5, r:{cauris:250,sementes:5}},
 {id:'sp5', text:'Use 5 habilidades especiais', stat:'specials', n:5, r:{cauris:120}},
 {id:'ult2', text:'Use 2 supremas', stat:'ults', n:2, r:{cauris:150}},
 {id:'combo2', text:'Faça 2 combos de sinergia', stat:'combos', n:2, r:{cauris:180}},
 {id:'mini2', text:'Jogue 2 desafios rápidos', stat:'minis', n:2, r:{cauris:150}},
 {id:'quiz', text:'Acerte 5 perguntas no Quiz', stat:'quizRight', n:5, r:{sementes:5}},
 {id:'item1', text:'Encontre 1 colecionável', stat:'items', n:1, r:{cauris:200}},
 {id:'boss1', text:'Derrote 1 chefe', stat:'bosses', n:1, r:{sementes:10}},
 {id:'exp1', text:'Avance 3 salas na Expedição', stat:'rooms', n:3, r:{cauris:200}}
];

// ------------- BÊNÇÃOS DA EXPEDIÇÃO (roguelite) -------------
const BLESSINGS = [
 {id:'b_atk', name:'Força do Trovão', ic:'⚡', desc:'+15% de ataque na expedição.', mod:{atk:.15}},
 {id:'b_def', name:'Pele de Baobá', ic:'🌳', desc:'+20% de defesa na expedição.', mod:{def:.2}},
 {id:'b_heal', name:'Sopa da Avó', ic:'🍲', desc:'Cura 40% da equipe agora.', heal:.4},
 {id:'b_en', name:'Batida Constante', ic:'🥁', desc:'Começa cada luta com +40 de energia.', mod:{startEnergy:40}},
 {id:'b_crit', name:'Olho de Fotógrafa', ic:'📸', desc:'+15% de crítico.', mod:{crit:.15}},
 {id:'b_spd', name:'Vento do Sahel', ic:'🌬️', desc:'+15% de velocidade.', mod:{spd:.15}},
 {id:'b_life', name:'Ubuntu', ic:'🤝', desc:'+10% de roubo de vida.', mod:{lifesteal:.1}},
 {id:'b_gold', name:'Mercado Cheio', ic:'🐚', desc:'+50% de Cauris ao final.', mod:{coin:.5}},
 {id:'b_regen', name:'Chá de Ervas', ic:'🌿', desc:'Regenera 4% por turno.', mod:{regen:.04}}
];

// ------------- TÍTULOS / CORES -------------
const ACCENTS = [
 {id:'ouro',c:'#f5b82e',name:'Ouro',cost:0},{id:'vermelho',c:'#e8363d',name:'Vermelho Urucum',cost:30},
 {id:'verde',c:'#2fbf71',name:'Verde Floresta',cost:30},{id:'neon',c:'#00e5ff',name:'Ciano Neo-Axé',cost:60},
 {id:'magenta',c:'#ff2bd6',name:'Magenta Futuro',cost:60},{id:'terra',c:'#c8743a',name:'Terra Batida',cost:30}
];
