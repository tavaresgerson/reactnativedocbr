import{_ as a,c as e,o,a4 as s}from"./chunks/framework.nQaBHiNx.js";const r="/assets/PerfUtil-38a2ddbf1777887d70563a644c72aa64.Bzv4J9fN.png",g=JSON.parse('{"title":"Visão geral do desempenho","description":"","frontmatter":{},"headers":[],"relativePath":"docs/performance.md","filePath":"docs/performance.md"}'),i={name:"docs/performance.md"},d=s('<h1 id="visao-geral-do-desempenho" tabindex="-1">Visão geral do desempenho <a class="header-anchor" href="#visao-geral-do-desempenho" aria-label="Permalink to &quot;Visão geral do desempenho&quot;">​</a></h1><p>Um motivo convincente para usar React Native em vez de ferramentas baseadas em WebView é atingir 60 quadros por segundo e uma aparência nativa para seus aplicativos. Sempre que possível, gostaríamos que o React Native fizesse a coisa certa e ajudasse você a se concentrar no seu aplicativo em vez da otimização do desempenho, mas há áreas onde ainda não chegamos lá e outras onde o React Native (semelhante a escrever nativo código diretamente) não pode determinar a melhor maneira de otimizar para você e, portanto, será necessária uma intervenção manual. Tentamos o nosso melhor para oferecer um desempenho de interface de usuário suave por padrão, mas às vezes isso não é possível.</p><p>Este guia tem como objetivo ensinar alguns princípios básicos para ajudá-lo a <a href="/docs/profiling.html">solucionar problemas de desempenho</a>, bem como discutir fontes comuns de problemas e suas soluções sugeridas nesta seção.</p><h2 id="o-que-voce-precisa-saber-sobre-frames" tabindex="-1">O que você precisa saber sobre frames <a class="header-anchor" href="#o-que-voce-precisa-saber-sobre-frames" aria-label="Permalink to &quot;O que você precisa saber sobre frames&quot;">​</a></h2><p>A geração dos seus avós chamava os filmes de <a href="https://www.youtube.com/watch?v=F1i40rnpOsA" target="_blank" rel="noreferrer">“imagens em movimento”</a> por uma razão: o movimento realista no vídeo é uma ilusão criada pela rápida mudança de imagens estáticas a uma velocidade consistente. Referimo-nos a cada uma dessas imagens como quadros. O número de quadros exibidos a cada segundo tem um impacto direto na aparência suave e realista de um vídeo (ou interface do usuário). Os dispositivos iOS exibem 60 quadros por segundo, o que dá a você e ao sistema de UI cerca de 16,67 ms para realizar todo o trabalho necessário para gerar a imagem estática (quadro) que o usuário verá na tela nesse intervalo. Se você não conseguir fazer o trabalho necessário para gerar esse quadro dentro dos 16,67 ms alocados, você &quot;descartará um quadro&quot; e a IU parecerá sem resposta.</p><p>Agora, para confundir um pouco o assunto, abra o <a href="/docs/debugging.html">menu Dev</a> em seu aplicativo e alterne <code>Show Perf Monitor</code>. Você notará que existem duas taxas de quadros diferentes.</p><div class="one-image"><img src="'+r+`"></div><h2 id="taxa-de-quadros-js-thread-javascript" tabindex="-1">Taxa de quadros JS (thread JavaScript) <a class="header-anchor" href="#taxa-de-quadros-js-thread-javascript" aria-label="Permalink to &quot;Taxa de quadros JS (thread JavaScript)&quot;">​</a></h2><p>Para a maioria dos aplicativos React Native, sua lógica de negócios será executada no thread JavaScript. É aqui que reside o seu aplicativo React, as chamadas de API são feitas, os eventos de toque são processados, etc... As atualizações para visualizações com suporte nativo são agrupadas e enviadas para o lado nativo no final de cada iteração do loop de eventos, antes do prazo do quadro (se tudo correr bem). Se o thread JavaScript não responder a um quadro, ele será considerado um quadro descartado. Por exemplo, se você chamar <code>this.setState</code> no componente raiz de um aplicativo complexo e isso resultar na nova renderização de subárvores de componentes computacionalmente caras, é concebível que isso possa levar 200 ms e resultar na eliminação de 12 quadros. Quaisquer animações controladas por JavaScript pareceriam congelar durante esse período. Se algo demorar mais de 100 ms, o usuário sentirá.</p><p>Isso geralmente acontece durante as transições do <code>Navigator</code>: quando você envia uma nova rota, o thread JavaScript precisa renderizar todos os componentes necessários para a cena para enviar os comandos apropriados ao lado nativo para criar as visualizações de apoio. É comum que o trabalho feito aqui ocupe alguns quadros e cause instabilidade porque a transição é controlada pelo thread JavaScript. Às vezes, os componentes farão trabalho adicional no componentDidMount, o que pode resultar em uma segunda falha na transição.</p><p>Outro exemplo é responder a toques: se você estiver trabalhando em vários quadros no thread JavaScript, poderá notar um atraso na resposta a TouchableOpacity, por exemplo. Isso ocorre porque a thread JavaScript está ocupada e não pode processar os eventos de toque brutos enviados da thread principal. Como resultado, TouchableOpacity não pode reagir aos eventos de toque e comandar a visualização nativa para ajustar sua opacidade.</p><h2 id="taxa-de-quadros-da-ui-thread-principal" tabindex="-1">Taxa de quadros da UI (thread principal) <a class="header-anchor" href="#taxa-de-quadros-da-ui-thread-principal" aria-label="Permalink to &quot;Taxa de quadros da UI (thread principal)&quot;">​</a></h2><p>Muitas pessoas notaram que o desempenho do NavigatorIOS é melhor do que o Navigator. A razão para isso é que as animações das transições são feitas inteiramente no thread principal e, portanto, não são interrompidas por quedas de quadros no thread JavaScript.</p><p>Da mesma forma, você pode rolar para cima e para baixo em um <code>ScrollView</code> quando o thread JavaScript está bloqueado porque o <code>ScrollView</code> reside no thread principal. Os eventos de rolagem são despachados para o thread JS, mas seu recebimento não é necessário para que a rolagem ocorra.</p><h2 id="fontes-comuns-de-problemas-de-desempenho" tabindex="-1">Fontes comuns de problemas de desempenho <a class="header-anchor" href="#fontes-comuns-de-problemas-de-desempenho" aria-label="Permalink to &quot;Fontes comuns de problemas de desempenho&quot;">​</a></h2><h3 id="executando-em-modo-de-desenvolvimento-dev-true" tabindex="-1">Executando em modo de desenvolvimento (<code>dev=true</code>) <a class="header-anchor" href="#executando-em-modo-de-desenvolvimento-dev-true" aria-label="Permalink to &quot;Executando em modo de desenvolvimento (\`dev=true\`)&quot;">​</a></h3><p>O desempenho do thread JavaScript sofre muito quando executado no modo de desenvolvimento. Isso é inevitável: muito mais trabalho precisa ser feito em tempo de execução para fornecer bons avisos e mensagens de erro, como validação de <code>propTypes</code> e várias outras asserções. Sempre certifique-se de testar o desempenho nas <a href="/docs/running-on-device.html">compilações de lançamento</a>.</p><h3 id="usando-instrucoes-console-log" tabindex="-1">Usando instruções <code>console.log</code> <a class="header-anchor" href="#usando-instrucoes-console-log" aria-label="Permalink to &quot;Usando instruções \`console.log\`&quot;">​</a></h3><p>Ao executar um aplicativo compilado, essas instruções podem causar um grande gargalo na thread JavaScript. Isso inclui chamadas de bibliotecas de depuração, como <a href="https://github.com/evgenyrodionov/redux-logger" target="_blank" rel="noreferrer">redux-logger</a>, portanto, certifique-se de removê-las antes de compilar. Você também pode usar este <a href="https://babeljs.io/docs/plugins/transform-remove-console/" target="_blank" rel="noreferrer">plugin babel</a> que remove todas as chamadas <code>console.*</code>. Você precisa instalá-lo primeiro com <code>npm i babel-plugin-transform-remove-console --save-dev</code> e, em seguida, editar o arquivo <code>.babelrc</code> no diretório do projeto assim:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;env&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;production&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;plugins&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;transform-remove-console&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>Isso removerá automaticamente todas as chamadas <code>console.*</code> nas versões de lançamento (produção) do seu projeto.</p><p>É recomendado usar o plugin mesmo que nenhuma chamada <code>console.*</code> seja feita em seu projeto. Uma biblioteca terceirizada também poderia ligar para eles.</p><h3 id="a-renderizacao-inicial-do-listview-e-muito-lenta-ou-o-desempenho-da-rolagem-e-ruim-para-listas-grandes" tabindex="-1">A renderização inicial do <code>ListView</code> é muito lenta ou o desempenho da rolagem é ruim para listas grandes <a class="header-anchor" href="#a-renderizacao-inicial-do-listview-e-muito-lenta-ou-o-desempenho-da-rolagem-e-ruim-para-listas-grandes" aria-label="Permalink to &quot;A renderização inicial do \`ListView\` é muito lenta ou o desempenho da rolagem é ruim para listas grandes&quot;">​</a></h3><p>Use o novo componente <a href="/docs/flatlist.html">FlatList</a> ou <a href="/docs/sectionlist.html">SectionList</a>. Além de simplificar a API, os novos componentes da lista também apresentam melhorias significativas de desempenho, sendo a principal delas o uso quase constante de memória para qualquer número de linhas.</p><p>Se sua <a href="/docs/flatlist.html">FlatList</a> estiver com renderização lenta, certifique-se de ter implementado <a href="/docs/flatlist.html#getitemlayout">getItemLayout</a> para otimizar a velocidade de renderização, ignorando a medição dos itens renderizados.</p><h3 id="js-fps-despenca-ao-renderizar-novamente-uma-visualizacao-que-quase-nao-muda" tabindex="-1">JS FPS despenca ao renderizar novamente uma visualização que quase não muda <a class="header-anchor" href="#js-fps-despenca-ao-renderizar-novamente-uma-visualizacao-que-quase-nao-muda" aria-label="Permalink to &quot;JS FPS despenca ao renderizar novamente uma visualização que quase não muda&quot;">​</a></h3><p>Se você estiver usando um <code>ListView</code>, deverá fornecer uma função <code>rowHasChanged</code> que pode reduzir muito trabalho, determinando rapidamente se uma linha precisa ou não ser renderizada novamente. Se você estiver usando estruturas de dados imutáveis, isso só precisará ser uma verificação de igualdade de referência.</p><p>Da mesma forma, você pode implementar <code>shouldComponentUpdate</code> e indicar as condições exatas sob as quais gostaria que o componente fosse renderizado novamente. Se você escrever componentes puros (onde o valor de retorno da função de renderização depende inteiramente de adereços e estado), poderá aproveitar o PureComponent para fazer isso para você. Mais uma vez, estruturas de dados imutáveis são úteis para manter isso rápido - se você tiver que fazer uma comparação profunda de uma grande lista de objetos, pode ser que a re-renderização de todo o seu componente seja mais rápida e certamente exigiria menos código.</p><h3 id="descartando-o-fps-do-thread-js-por-causa-de-muito-trabalho-no-thread-javascript-ao-mesmo-tempo" tabindex="-1">Descartando o FPS do thread JS por causa de muito trabalho no thread JavaScript ao mesmo tempo <a class="header-anchor" href="#descartando-o-fps-do-thread-js-por-causa-de-muito-trabalho-no-thread-javascript-ao-mesmo-tempo" aria-label="Permalink to &quot;Descartando o FPS do thread JS por causa de muito trabalho no thread JavaScript ao mesmo tempo&quot;">​</a></h3><p>As “transições lentas do Navigator” são a manifestação mais comum disso, mas há outras ocasiões em que isso pode acontecer. Usar o <code>InteractionManager</code> pode ser uma boa abordagem, mas se o custo da experiência do usuário for muito alto para atrasar o trabalho durante uma animação, você pode considerar o <code>LayoutAnimation</code>.</p><p>A API Animated atualmente calcula cada quadro-chave sob demanda no thread JavaScript, a menos que você defina <a href="https://reactnative.dev/blog/2017/02/14/using-native-driver-for-animated#how-do-i-use-this-in-my-app" target="_blank" rel="noreferrer">useNativeDriver: true</a>, enquanto <code>LayoutAnimation</code> aproveita o <code>Core Animation</code> e não é afetado por thread JS e quedas de quadro de thread principal.</p><p>Um caso em que usei isso foi para animar em um modal (deslizando de cima para baixo e desaparecendo em uma sobreposição translúcida) enquanto inicializo e talvez receba respostas para várias solicitações de rede, renderizando o conteúdo do modal e atualizando a visualização onde o modal foi aberto. Consulte o guia Animações para obter mais informações sobre como usar o <code>LayoutAnimation</code>.</p><p>Ressalvas:</p><ul><li>LayoutAnimation funciona apenas para animações do tipo &quot;dispare e esqueça&quot; (animações &quot;estáticas&quot;) - se for interrompível, você precisará usar o Animated.</li></ul><h3 id="mover-uma-visualizacao-na-tela-rolar-traduzir-girar-elimina-o-fps-do-thread-da-ui" tabindex="-1">Mover uma visualização na tela (rolar, traduzir, girar) elimina o FPS do thread da UI <a class="header-anchor" href="#mover-uma-visualizacao-na-tela-rolar-traduzir-girar-elimina-o-fps-do-thread-da-ui" aria-label="Permalink to &quot;Mover uma visualização na tela (rolar, traduzir, girar) elimina o FPS do thread da UI&quot;">​</a></h3><p>Isso é especialmente verdadeiro quando você tem texto com fundo transparente posicionado no topo de uma imagem ou qualquer outra situação em que a composição alfa seja necessária para redesenhar a visualização em cada quadro. Você descobrirá que ativar o <code>shouldRasterizeIOS</code> ou o <code>renderToHardwareTextureAndroid</code> pode ajudar significativamente nisso.</p><p>Tenha cuidado para não abusar disso ou o uso de memória pode disparar. Analise seu desempenho e uso de memória ao usar esses acessórios. Se você não planeja mais mover uma visualização, desative essa propriedade.</p><h3 id="animar-o-tamanho-de-uma-imagem-reduz-o-fps-do-thread-da-interface-do-usuario" tabindex="-1">Animar o tamanho de uma imagem reduz o FPS do thread da interface do usuário <a class="header-anchor" href="#animar-o-tamanho-de-uma-imagem-reduz-o-fps-do-thread-da-interface-do-usuario" aria-label="Permalink to &quot;Animar o tamanho de uma imagem reduz o FPS do thread da interface do usuário&quot;">​</a></h3><p>No iOS, cada vez que você ajusta a largura ou a altura de um componente de imagem, ele é recortado e dimensionado a partir da imagem original. Isto pode ser muito caro, especialmente para imagens grandes. Em vez disso, use a propriedade de estilo <code>transform: [{scale}]</code> para animar o tamanho. Um exemplo de quando você pode fazer isso é tocar em uma imagem e aumentá-la para tela inteira.</p><h3 id="minha-visualizacao-touchablex-nao-responde-muito-bem" tabindex="-1">Minha visualização TouchableX não responde muito bem <a class="header-anchor" href="#minha-visualizacao-touchablex-nao-responde-muito-bem" aria-label="Permalink to &quot;Minha visualização TouchableX não responde muito bem&quot;">​</a></h3><p>Às vezes, se fizermos uma ação no mesmo quadro em que estamos ajustando a opacidade ou realce de um componente que está respondendo a um toque, não veremos esse efeito até que a função <code>onPress</code> retorne. Se <code>onPress</code> fizer um <code>setState</code> que resulte em muito trabalho e alguns quadros perdidos, isso poderá ocorrer. Uma solução para isso é agrupar qualquer ação dentro do seu manipulador <code>onPress</code> em <code>requestAnimationFrame</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">handleOnPress</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  requestAnimationFrame</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">doExpensiveAction</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="transicoes-lentas-do-navegador" tabindex="-1">Transições lentas do navegador <a class="header-anchor" href="#transicoes-lentas-do-navegador" aria-label="Permalink to &quot;Transições lentas do navegador&quot;">​</a></h3><p>Conforme mencionado acima, as animações do <code>Navigator</code> são controladas pelo thread JavaScript. Imagine a transição de cena &quot;empurrar da direita&quot;: a cada quadro, a nova cena é movida da direita para a esquerda, começando fora da tela (digamos em um deslocamento x de 320) e finalmente se estabelecendo quando a cena fica em um deslocamento x de 0. Cada quadro durante esta transição, o thread JavaScript precisa enviar um novo deslocamento x para o thread principal. Se o thread JavaScript estiver bloqueado, ele não poderá fazer isso e, portanto, nenhuma atualização ocorrerá naquele quadro e a animação falhará.</p><p>Uma solução para isso é permitir que animações baseadas em JavaScript sejam descarregadas para o thread principal. Se fizéssemos a mesma coisa que no exemplo acima com esta abordagem, poderíamos calcular uma lista de todos os deslocamentos x para a nova cena quando iniciamos a transição e enviá-los para o thread principal para executar de forma otimizada . Agora que o thread JavaScript está livre dessa responsabilidade, não será um grande problema se ele perder alguns quadros durante a renderização da cena - você provavelmente nem notará porque ficará muito distraído com a bela transição.</p><p>Resolver isso é um dos principais objetivos da nova biblioteca React Navigation. As visualizações no <a href="/docs/navigation.html">React Navigation</a> usam componentes nativos e a biblioteca <a href="/docs/animated.html">Animated</a> para fornecer animações de 60 FPS que são executadas no thread nativo.</p>`,46),n=[d];function t(m,c,u,p,l,h){return o(),e("div",null,n)}const q=a(i,[["render",t]]);export{g as __pageData,q as default};