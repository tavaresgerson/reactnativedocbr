# Comunicação entre nativo e React Native

Em [Guia de integração com aplicativos existentes](integração com aplicativos existentes) e [Guia de componentes de UI nativos](/docs/native-components-ios.md) aprendemos como incorporar o React Native em um componente nativo e vice-versa. Quando misturamos componentes nativos e React Native, eventualmente encontraremos a necessidade de comunicação entre esses dois mundos. Algumas maneiras de conseguir isso já foram mencionadas em outros guias. Este artigo resume as técnicas disponíveis.

## Introdução

O React Native é inspirado no React, então a ideia básica do fluxo de informações é semelhante. O fluxo no React é unidirecional. Mantemos uma hierarquia de componentes, na qual cada componente depende apenas de seu pai e de seu próprio estado interno. Fazemos isso com propriedades: os dados são passados ​​de um pai para seus filhos de cima para baixo. Se um componente ancestral depende do estado de seu descendente, deve-se transmitir um retorno de chamada a ser usado pelo descendente para atualizar o ancestral.

O mesmo conceito se aplica ao React Native. Contanto que estejamos construindo nosso aplicativo exclusivamente dentro da estrutura, podemos direcioná-lo com propriedades e retornos de chamada. Mas, quando misturamos componentes React Native e nativos, precisamos de alguns mecanismos específicos entre linguagens que nos permitam passar informações entre eles.

## Propriedades

As propriedades são a forma mais direta de comunicação entre componentes. Portanto, precisamos de uma maneira de passar propriedades tanto de nativo para React Native quanto de React Native para nativo.

### Passando propriedades de Native para React Native

Para incorporar uma visualização React Native em um componente nativo, usamos `RCTRootView`. `RCTRootView` é um `UIView` que contém um aplicativo React Native. Ele também fornece uma interface entre o lado nativo e o aplicativo hospedado.

`RCTRootView` possui um inicializador que permite passar propriedades arbitrárias para o aplicativo React Native. O parâmetro `initialProperties` deve ser uma instância de `NSDictionary`. O dicionário é convertido internamente em um objeto JSON que o componente JS de nível superior pode referenciar.

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ffffff/000000.png",
                       @"https://dummyimage.com/600x400/000000/ffffff.png"];

NSDictionary *props = @{@"images" : imageList};

RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                 moduleName:@"ImageBrowserApp"
                                          initialProperties:props];
```

```tsx
import React from 'react';
import {View, Image} from 'react-native';

export default class ImageBrowserApp extends React.Component {
  renderImage(imgURI) {
    return <Image source={{uri: imgURI}} />;
  }
  render() {
    return <View>{this.props.images.map(this.renderImage)}</View>;
  }
}
```

`RCTRootView` também fornece uma propriedade de leitura e gravação `appProperties`. Depois que `appProperties` for definido, o aplicativo React Native será renderizado novamente com novas propriedades. A atualização só é realizada quando as novas propriedades atualizadas diferem das anteriores.

```objectivec
NSArray *imageList = @[@"https://dummyimage.com/600x400/ff0000/000000.png",
                       @"https://dummyimage.com/600x400/ffffff/ff0000.png"];

rootView.appProperties = @{@"images" : imageList};
```

Não há problema em atualizar propriedades a qualquer momento. No entanto, as atualizações devem ser realizadas no thread principal. Você usa o getter em qualquer thread.

:::note Observação
Atualmente, há um problema conhecido em que, ao definir appProperties durante a inicialização da ponte, a alteração pode ser perdida. Consulte [https://github.com/facebook/react-native/issues/20115](https://github.com/facebook/react-native/issues/20115) para obter mais informações.
:::

Não há como atualizar apenas algumas propriedades por vez. Sugerimos que você o crie em seu próprio wrapper.

### Passando propriedades do React Native para Native

O problema de exposição de propriedades de componentes nativos é abordado em detalhes [neste artigo](native-components-ios#properties). Resumindo, exporte propriedades com a macro `RCT_CUSTOM_VIEW_PROPERTY` em seu componente nativo personalizado e, em seguida, use-as no React Native como se o componente fosse um componente React Native comum.

### Limites de propriedades

A principal desvantagem das propriedades entre linguagens é que elas não suportam retornos de chamada, o que nos permitiria lidar com ligações de dados de baixo para cima. Imagine que você tem uma pequena visualização RN que deseja remover da visualização pai nativa como resultado de uma ação JS. Não há como fazer isso com adereços, pois as informações precisariam ir de baixo para cima.

Embora tenhamos uma variedade de retornos de chamada entre idiomas ([descritos aqui](native-modules-ios#callbacks)), esses retornos de chamada nem sempre são o que precisamos. O principal problema é que eles não devem ser passados ​​como propriedades. Em vez disso, esse mecanismo nos permite acionar uma ação nativa de JS e manipular o resultado dessa ação em JS.

## Outras formas de interação entre linguagens (eventos e módulos nativos)

Conforme declarado no capítulo anterior, o uso de propriedades apresenta algumas limitações. Às vezes, as propriedades não são suficientes para conduzir a lógica do nosso aplicativo e precisamos de uma solução que dê mais flexibilidade. Este capítulo cobre outras técnicas de comunicação disponíveis no React Native. Eles podem ser usados ​​para comunicação interna (entre JS e camadas nativas no RN), bem como para comunicação externa (entre RN e a parte 'nativa pura' do seu aplicativo).

React Native permite que você execute chamadas de função em vários idiomas. Você pode executar código nativo personalizado de JS e vice-versa. Infelizmente, dependendo do lado em que trabalhamos, alcançamos o mesmo objetivo de maneiras diferentes. Para nativo - usamos mecanismo de eventos para agendar a execução de uma função manipuladora em JS, enquanto para React Native chamamos diretamente métodos exportados por módulos nativos.

### Chamando funções React Native a partir de nativos (eventos)

Os eventos são descritos detalhadamente [neste artigo](/docs/native-components-ios.md). Observe que o uso de eventos não nos dá garantias sobre o tempo de execução, pois o evento é tratado em um thread separado.

Os eventos são poderosos porque nos permitem alterar os componentes do React Native sem precisar de uma referência a eles. No entanto, existem algumas armadilhas nas quais você pode cair ao usá-los:

- Como os eventos podem ser enviados de qualquer lugar, eles podem introduzir dependências do tipo espaguete em seu projeto.
- Os eventos compartilham namespace, o que significa que você pode encontrar algumas colisões de nomes. As colisões não serão detectadas estaticamente, o que as torna difíceis de depurar.
- Se você usar várias instâncias do mesmo componente React Native e quiser distingui-las da perspectiva do seu evento, provavelmente precisará introduzir identificadores e passá-los junto com os eventos (você pode usar o `reactTag` da visualização nativa como um identificador).

O padrão comum que usamos ao incorporar nativo no React Native é tornar o RCTViewManager do componente nativo um delegado para as visualizações, enviando eventos de volta ao JavaScript por meio da ponte. Isso mantém as chamadas de eventos relacionadas em um só lugar.

### Chamando funções nativas do React Native (módulos nativos)

Módulos nativos são classes Objective-C disponíveis em JS. Normalmente, uma instância de cada módulo é criada por ponte JS. Eles podem exportar funções e constantes arbitrárias para React Native. Eles foram abordados em detalhes [neste artigo](/docs/native-modules-ios.md).

O fato de os módulos nativos serem singletons limita o mecanismo no contexto de incorporação. Digamos que temos um componente React Native incorporado em uma visualização nativa e queremos atualizar a visualização pai nativa. Usando o mecanismo de módulo nativo, exportaríamos uma função que não apenas recebe os argumentos esperados, mas também um identificador da visão nativa pai. O identificador seria usado para recuperar uma referência à visualização pai a ser atualizada. Dito isto, precisaríamos manter um mapeamento dos identificadores para as visualizações nativas no módulo.

Embora esta solução seja complexa, ela é usada em `RCTUIManager`, que é uma classe interna do React Native que gerencia todas as visualizações do React Native.

Módulos nativos também podem ser usados ​​para expor bibliotecas nativas existentes ao JS. A [biblioteca de geolocalização](https://github.com/michalchudziak/react-native-geolocation) é um exemplo vivo da ideia.

:::warning Cuidado
Todos os módulos nativos compartilham o mesmo namespace. Cuidado com colisões de nomes ao criar novos.
:::

## Fluxo de cálculo de layout

Ao integrar o nativo e o React Native, também precisamos de uma maneira de consolidar dois sistemas de layout diferentes. Esta seção aborda problemas comuns de layout e fornece uma breve descrição dos mecanismos para resolvê-los.

### Layout de um componente nativo incorporado no React Native

Este caso é abordado [neste artigo](/docs/native-components-ios.md). Para resumir, como todas as nossas visualizações de react nativas são subclasses de `UIView`, a maioria dos atributos de estilo e tamanho funcionarão como você esperaria imediatamente.

### Layout de um componente React Native incorporado no nativo

#### React Native com tamanho fixo

O cenário geral é quando temos um aplicativo React Native com tamanho fixo, que é conhecido pelo lado nativo. Em particular, uma visualização React Native em tela inteira se enquadra neste caso. Se quisermos uma visualização raiz menor, podemos definir explicitamente o quadro do RTRRootView.

Por exemplo, para criar um aplicativo RN com 200 pixels (lógicos) de altura e largura da visualização de hospedagem ampla, poderíamos fazer:

```objectivec title='SomeViewController.m'
- (void)viewDidLoad
{
  [...]
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:appName
                                            initialProperties:props];
  rootView.frame = CGRectMake(0, 0, self.view.width, 200);
  [self.view addSubview:rootView];
}
```

Quando temos uma visualização raiz de tamanho fixo, precisamos respeitar seus limites no lado JS. Em outras palavras, precisamos garantir que o conteúdo do React Native possa estar contido na visualização raiz de tamanho fixo. A maneira mais fácil de garantir isso é usar o layout Flexbox. Se você usar posicionamento absoluto e os componentes do React estiverem visíveis fora dos limites da visualização raiz, você obterá sobreposição com visualizações nativas, fazendo com que alguns recursos se comportem de forma inesperada. Por exemplo, 'TouchableHighlight' não destacará seus toques fora dos limites da visualização raiz.

Não há problema em atualizar dinamicamente o tamanho da visualização raiz, redefinindo sua propriedade de quadro. React Native cuidará do layout do conteúdo.

#### React Native com tamanho flexível

Em alguns casos, gostaríamos de renderizar conteúdo de tamanho inicialmente desconhecido. Digamos que o tamanho será definido dinamicamente em JS. Temos duas soluções para este problema.

1. Você pode agrupar sua visualização React Native em um componente `ScrollView`. Isso garante que seu conteúdo estará sempre disponível e não se sobreporá às visualizações nativas.
2. React Native permite determinar, em JS, o tamanho do aplicativo RN e fornecê-lo ao proprietário da hospedagem `RCTRootView`. O proprietário é então responsável por reorganizar as subvisualizações e manter a IU consistente. Conseguimos isso com os modos de flexibilidade do `RCTRootView`.

`RCTRootView` suporta 4 modos de flexibilidade de tamanhos diferentes:

```objectivec title='RCTRootView.h'
typedef NS_ENUM(NSInteger, RCTRootViewSizeFlexibility) {
  RCTRootViewSizeFlexibilityNone = 0,
  RCTRootViewSizeFlexibilityWidth,
  RCTRootViewSizeFlexibilityHeight,
  RCTRootViewSizeFlexibilityWidthAndHeight,
};
```

`RCTRootViewSizeFlexibilityNone` é o valor padrão, o que torna fixo o tamanho da visualização raiz (mas ainda pode ser atualizado com `setFrame:`). Os outros três modos nos permitem rastrear as atualizações de tamanho do conteúdo do React Native. Por exemplo, definir o modo como `RCTRootViewSizeFlexibilityHeight` fará com que o React Native meça a altura do conteúdo e passe essa informação de volta ao delegado de `RCTRootView`. Uma ação arbitrária pode ser executada dentro do delegado, incluindo a configuração do quadro da visualização raiz, para que o conteúdo se ajuste. O delegado é chamado somente quando o tamanho do conteúdo é alterado.

::: warning Cuidado
Tornar uma dimensão flexível em JS e nativo leva a um comportamento indefinido. Por exemplo - não torne flexível a largura de um componente React de nível superior (com `flexbox`) enquanto estiver usando `RCTRootViewSizeFlexibilityWidth` na hospedagem `RCTRootView`.
:::

Vejamos um exemplo.

```objectivec title='FlexibleSizeExampleView.m'
- (instancetype)initWithFrame:(CGRect)frame
{
  [...]

  _rootView = [[RCTRootView alloc] initWithBridge:bridge
  moduleName:@"FlexibilityExampleApp"
  initialProperties:@{}];

  _rootView.delegate = self;
  _rootView.sizeFlexibility = RCTRootViewSizeFlexibilityHeight;
  _rootView.frame = CGRectMake(0, 0, self.frame.size.width, 0);
}

#pragma mark - RCTRootViewDelegate
- (void)rootViewDidChangeIntrinsicSize:(RCTRootView *)rootView
{
  CGRect newFrame = rootView.frame;
  newFrame.size = rootView.intrinsicContentSize;

  rootView.frame = newFrame;
}
```

No exemplo, temos uma visualização `FlexibleSizeExampleView` que contém uma visualização raiz. Criamos a visualização raiz, inicializamos e definimos o delegado. O delegado cuidará das atualizações de tamanho. Em seguida, definimos a flexibilidade de tamanho da visualização raiz para `RCTRootViewSizeFlexibilityHeight`, o que significa que o método `rootViewDidChangeIntrinsicSize:` será chamado toda vez que o conteúdo do React Native mudar sua altura. Finalmente, definimos a largura e a posição da visualização raiz. Observe que definimos a altura também, mas isso não tem efeito, pois tornamos a altura dependente de RN.

Você pode verificar o código-fonte completo do exemplo [aqui](https://github.com/facebook/react-native/blob/main/packages/rn-tester/RNTester/NativeExampleViews/FlexibleSizeExampleView.mm).

Não há problema em alterar dinamicamente o modo de flexibilidade de tamanho da visualização raiz. Alterar o modo de flexibilidade de uma visualização raiz agendará um recálculo do layout e o método delegado `rootViewDidChangeIntrinsicSize:` será chamado assim que o tamanho do conteúdo for conhecido.

::: note observação
O cálculo do layout do React Native é executado em um thread separado, enquanto as atualizações da visualização da UI nativa são feitas no thread principal.
Isso pode causar inconsistências temporárias na interface do usuário entre o nativo e o React Native. Este é um problema conhecido e nossa equipe está trabalhando na sincronização de atualizações de IU provenientes de diferentes fontes.
:::

::: note observação
O React Native não executa nenhum cálculo de layout até que a visualização raiz se torne uma subvisão de algumas outras visualizações.
Se você deseja ocultar a visualização React Native até que suas dimensões sejam conhecidas, adicione a visualização raiz como uma subvisualização e torne-a inicialmente oculta (use a propriedade `hidden` de `UIView`). Em seguida, altere sua visibilidade no método delegado.
:::
