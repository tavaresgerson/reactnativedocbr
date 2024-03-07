# Visão geral do desempenho
Um motivo convincente para usar React Native em vez de ferramentas baseadas em WebView é atingir 60 quadros por segundo e uma aparência nativa para seus aplicativos. Sempre que possível, gostaríamos que o React Native fizesse a coisa certa e ajudasse você a se concentrar no seu aplicativo em vez da otimização do desempenho, mas há áreas onde ainda não chegamos lá e outras onde o React Native (semelhante a escrever nativo código diretamente) não pode determinar a melhor maneira de otimizar para você e, portanto, será necessária uma intervenção manual. Tentamos o nosso melhor para oferecer um desempenho de interface de usuário suave por padrão, mas às vezes isso não é possível.

Este guia tem como objetivo ensinar alguns princípios básicos para ajudá-lo a [solucionar problemas de desempenho](/docs/profiling.md), bem como discutir fontes comuns de problemas e suas soluções sugeridas nesta seção.

## O que você precisa saber sobre frames
A geração dos seus avós chamava os filmes de [“imagens em movimento”](https://www.youtube.com/watch?v=F1i40rnpOsA) por uma razão: o movimento realista no vídeo é uma ilusão criada pela rápida mudança de imagens estáticas a uma velocidade consistente. Referimo-nos a cada uma dessas imagens como quadros. O número de quadros exibidos a cada segundo tem um impacto direto na aparência suave e realista de um vídeo (ou interface do usuário). Os dispositivos iOS exibem 60 quadros por segundo, o que dá a você e ao sistema de UI cerca de 16,67 ms para realizar todo o trabalho necessário para gerar a imagem estática (quadro) que o usuário verá na tela nesse intervalo. Se você não conseguir fazer o trabalho necessário para gerar esse quadro dentro dos 16,67 ms alocados, você "descartará um quadro" e a IU parecerá sem resposta.

Agora, para confundir um pouco o assunto, abra o [menu Dev](/docs/debugging.md) em seu aplicativo e alterne `Show Perf Monitor`. Você notará que existem duas taxas de quadros diferentes.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/5223d8ad-b60a-4a87-b5bc-4eb42d9f8b4d)

### Taxa de quadros JS (thread JavaScript)
Para a maioria dos aplicativos React Native, sua lógica de negócios será executada no thread JavaScript. É aqui que reside o seu aplicativo React, as chamadas de API são feitas, os eventos de toque são processados, etc... As atualizações para visualizações com suporte nativo são agrupadas e enviadas para o lado nativo no final de cada iteração do loop de eventos, antes do prazo do quadro (se tudo correr bem). Se o thread JavaScript não responder a um quadro, ele será considerado um quadro descartado. Por exemplo, se você chamar `this.setState` no componente raiz de um aplicativo complexo e isso resultar na nova renderização de subárvores de componentes computacionalmente caras, é concebível que isso possa levar 200 ms e resultar na eliminação de 12 quadros. Quaisquer animações controladas por JavaScript pareceriam congelar durante esse período. Se algo demorar mais de 100 ms, o usuário sentirá.

Isso geralmente acontece durante as transições do `Navigator`: quando você envia uma nova rota, o thread JavaScript precisa renderizar todos os componentes necessários para a cena para enviar os comandos apropriados ao lado nativo para criar as visualizações de apoio. É comum que o trabalho feito aqui ocupe alguns quadros e cause instabilidade porque a transição é controlada pelo thread JavaScript. Às vezes, os componentes farão trabalho adicional no componentDidMount, o que pode resultar em uma segunda falha na transição.

Outro exemplo é responder a toques: se você estiver trabalhando em vários quadros no thread JavaScript, poderá notar um atraso na resposta a TouchableOpacity, por exemplo. Isso ocorre porque a thread JavaScript está ocupada e não pode processar os eventos de toque brutos enviados da thread principal. Como resultado, TouchableOpacity não pode reagir aos eventos de toque e comandar a visualização nativa para ajustar sua opacidade.

### Taxa de quadros da UI (thread principal)
Muitas pessoas notaram que o desempenho do NavigatorIOS é melhor do que o Navigator. A razão para isso é que as animações das transições são feitas inteiramente no thread principal e, portanto, não são interrompidas por quedas de quadros no thread JavaScript.

Da mesma forma, você pode rolar para cima e para baixo em um `ScrollView` quando o thread JavaScript está bloqueado porque o `ScrollView` reside no thread principal. Os eventos de rolagem são despachados para o thread JS, mas seu recebimento não é necessário para que a rolagem ocorra.

## Fontes comuns de problemas de desempenho

### Executando em modo de desenvolvimento (`dev=true`)
O desempenho do thread JavaScript sofre muito quando executado no modo de desenvolvimento. Isso é inevitável: muito mais trabalho precisa ser feito em tempo de execução para fornecer bons avisos e mensagens de erro, como validação de `propTypes` e várias outras asserções. Sempre certifique-se de testar o desempenho nas [compilações de lançamento](/docs/running-on-device.md).

### Usando instruções `console.log`
Ao executar um aplicativo compilado, essas instruções podem causar um grande gargalo na thread JavaScript. Isso inclui chamadas de bibliotecas de depuração, como [redux-logger](https://github.com/evgenyrodionov/redux-logger), portanto, certifique-se de removê-las antes de compilar. Você também pode usar este [plugin babel](https://babeljs.io/docs/plugins/transform-remove-console/) que remove todas as chamadas `console.*`. Você precisa instalá-lo primeiro com `npm i babel-plugin-transform-remove-console --save-dev` e, em seguida, editar o arquivo `.babelrc` no diretório do projeto assim:

```json
{
  "env": {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
```

Isso removerá automaticamente todas as chamadas `console.*` nas versões de lançamento (produção) do seu projeto.

É recomendado usar o plugin mesmo que nenhuma chamada `console.*` seja feita em seu projeto. Uma biblioteca terceirizada também poderia ligar para eles.

### A renderização inicial do `ListView` é muito lenta ou o desempenho da rolagem é ruim para listas grandes
Use o novo componente [FlatList](/docs/flatlist.md) ou [SectionList](/docs/sectionlist.md). Além de simplificar a API, os novos componentes da lista também apresentam melhorias significativas de desempenho, sendo a principal delas o uso quase constante de memória para qualquer número de linhas.

Se sua [FlatList](/docs/flatlist.md) estiver com renderização lenta, certifique-se de ter implementado [getItemLayout](/docs/flatlist.md#getitemlayout) para otimizar a velocidade de renderização, ignorando a medição dos itens renderizados.

### JS FPS despenca ao renderizar novamente uma visualização que quase não muda
Se você estiver usando um `ListView`, deverá fornecer uma função `rowHasChanged` que pode reduzir muito trabalho, determinando rapidamente se uma linha precisa ou não ser renderizada novamente. Se você estiver usando estruturas de dados imutáveis, isso só precisará ser uma verificação de igualdade de referência.

Da mesma forma, você pode implementar `shouldComponentUpdate` e indicar as condições exatas sob as quais gostaria que o componente fosse renderizado novamente. Se você escrever componentes puros (onde o valor de retorno da função de renderização depende inteiramente de adereços e estado), poderá aproveitar o PureComponent para fazer isso para você. Mais uma vez, estruturas de dados imutáveis são úteis para manter isso rápido - se você tiver que fazer uma comparação profunda de uma grande lista de objetos, pode ser que a re-renderização de todo o seu componente seja mais rápida e certamente exigiria menos código.

### Descartando o FPS do thread JS por causa de muito trabalho no thread JavaScript ao mesmo tempo
As “transições lentas do Navigator” são a manifestação mais comum disso, mas há outras ocasiões em que isso pode acontecer. Usar o `InteractionManager` pode ser uma boa abordagem, mas se o custo da experiência do usuário for muito alto para atrasar o trabalho durante uma animação, você pode considerar o `LayoutAnimation`.

A API Animated atualmente calcula cada quadro-chave sob demanda no thread JavaScript, a menos que você defina [useNativeDriver: true](https://reactnative.dev/blog/2017/02/14/using-native-driver-for-animated#how-do-i-use-this-in-my-app), enquanto `LayoutAnimation` aproveita o `Core Animation` e não é afetado por thread JS e quedas de quadro de thread principal.

Um caso em que usei isso foi para animar em um modal (deslizando de cima para baixo e desaparecendo em uma sobreposição translúcida) enquanto inicializo e talvez receba respostas para várias solicitações de rede, renderizando o conteúdo do modal e atualizando a visualização onde o modal foi aberto. Consulte o guia Animações para obter mais informações sobre como usar o `LayoutAnimation`.

Ressalvas:
* LayoutAnimation funciona apenas para animações do tipo "dispare e esqueça" (animações "estáticas") - se for interrompível, você precisará usar o Animated.

### Mover uma visualização na tela (rolar, traduzir, girar) elimina o FPS do thread da UI
Isso é especialmente verdadeiro quando você tem texto com fundo transparente posicionado no topo de uma imagem ou qualquer outra situação em que a composição alfa seja necessária para redesenhar a visualização em cada quadro. Você descobrirá que ativar o `shouldRasterizeIOS` ou o `renderToHardwareTextureAndroid` pode ajudar significativamente nisso.

Tenha cuidado para não abusar disso ou o uso de memória pode disparar. Analise seu desempenho e uso de memória ao usar esses acessórios. Se você não planeja mais mover uma visualização, desative essa propriedade.

#### Animar o tamanho de uma imagem reduz o FPS do thread da interface do usuário
No iOS, cada vez que você ajusta a largura ou a altura de um componente de imagem, ele é recortado e dimensionado a partir da imagem original. Isto pode ser muito caro, especialmente para imagens grandes. Em vez disso, use a propriedade de estilo `transform: [{scale}]` para animar o tamanho. Um exemplo de quando você pode fazer isso é tocar em uma imagem e aumentá-la para tela inteira.

#### Minha visualização TouchableX não responde muito bem
Às vezes, se fizermos uma ação no mesmo quadro em que estamos ajustando a opacidade ou realce de um componente que está respondendo a um toque, não veremos esse efeito até que a função `onPress` retorne. Se `onPress` fizer um `setState` que resulte em muito trabalho e alguns quadros perdidos, isso poderá ocorrer. Uma solução para isso é agrupar qualquer ação dentro do seu manipulador `onPress` em `requestAnimationFrame`:

```js
handleOnPress() {
  requestAnimationFrame(() => {
    this.doExpensiveAction();
  });
}
```

### Transições lentas do navegador
Conforme mencionado acima, as animações do `Navigator` são controladas pelo thread JavaScript. Imagine a transição de cena "empurrar da direita": a cada quadro, a nova cena é movida da direita para a esquerda, começando fora da tela (digamos em um deslocamento x de 320) e finalmente se estabelecendo quando a cena fica em um deslocamento x de 0. Cada quadro durante esta transição, o thread JavaScript precisa enviar um novo deslocamento x para o thread principal. Se o thread JavaScript estiver bloqueado, ele não poderá fazer isso e, portanto, nenhuma atualização ocorrerá naquele quadro e a animação falhará.

Uma solução para isso é permitir que animações baseadas em JavaScript sejam descarregadas para o thread principal. Se fizéssemos a mesma coisa que no exemplo acima com esta abordagem, poderíamos calcular uma lista de todos os deslocamentos x para a nova cena quando iniciamos a transição e enviá-los para o thread principal para executar de forma otimizada . Agora que o thread JavaScript está livre dessa responsabilidade, não será um grande problema se ele perder alguns quadros durante a renderização da cena - você provavelmente nem notará porque ficará muito distraído com a bela transição.

Resolver isso é um dos principais objetivos da nova biblioteca React Navigation. As visualizações no [React Navigation](/docs/navigation.md) usam componentes nativos e a biblioteca [Animated](/docs/animated.md) para fornecer animações de 60 FPS que são executadas no thread nativo.
