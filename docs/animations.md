# Animações
As animações são muito importantes para criar uma ótima experiência do usuário. Objetos estacionários devem superar a inércia à medida que começam a se mover. Objetos em movimento têm impulso e raramente param imediatamente. As animações permitem transmitir movimentos fisicamente verossímeis em sua interface.

React Native fornece dois sistemas de animação complementares: **`Animated`** para controle granular e interativo de valores específicos e **`LayoutAnimation`** para transações de layout global animadas.

## `Animated` API
A API `Animated` foi projetada para expressar de forma concisa uma ampla variedade de padrões interessantes de animação e interação com muito desempenho. `Animated` concentra-se em relacionamentos declarativos entre entradas e saídas, com transformações configuráveis entre elas e métodos de `start`/`stop` para controlar a execução da animação baseada em tempo.

`Animated` exporta seis tipos de componentes animáveis: `View`, `Text`, `Image`, `ScrollView`, `FlatList` e `SectionList`, mas você também pode criar o seu próprio usando `Animated.createAnimatedComponent()`.

Por exemplo, uma visualização de contêiner que aparece gradualmente quando é montada pode ter esta aparência:

```tsx
import React, {useRef, useEffect} from 'react';
import {Animated, Text, View} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {ViewStyle} from 'react-native';

type FadeInViewProps = PropsWithChildren<{style: ViewStyle}>;

const FadeInView: React.FC<FadeInViewProps> = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valor inicial para opacidade: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View // View especial animável
      style={{
        ...props.style,
        opacity: fadeAnim, // Vincular opacidade ao valor animado
      }}>
      {props.children}
    </Animated.View>
  );
};

// Você pode então usar seu `FadeInView` no lugar de um `View` em seus componentes:
export default () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FadeInView
        style={{
          width: 250,
          height: 50,
          backgroundColor: 'powderblue',
        }}>
        <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>
          Fading in
        </Text>
      </FadeInView>
    </View>
  );
};
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/0a53d571-a6d4-4d9c-8473-e1a497cb4771)

Vamos analisar o que está acontecendo aqui. No construtor `FadeInView`, um novo `Animated.Value` chamado `fadeAnim` é inicializado como parte do estado. A propriedade de opacidade na `View` é mapeada para esse valor animado. Nos bastidores, o valor numérico é extraído e usado para definir a opacidade.

Quando o componente é montado, a opacidade é definida como 0. Em seguida, uma animação de atenuação é iniciada no valor animado `fadeAnim`, que atualizará todos os seus mapeamentos dependentes (neste caso, apenas a opacidade) em cada quadro à medida que o valor for animado para o valor final de 1.

Isso é feito de maneira otimizada e mais rápida do que chamar `setState` e renderizar novamente. Como toda a configuração é declarativa, poderemos implementar otimizações adicionais que serializam a configuração e executam a animação em um thread de alta prioridade.

### Configurando animações
As animações são altamente configuráveis. Funções de atenuação personalizadas e predefinidas, atrasos, durações, fatores de decaimento, constantes de mola e muito mais podem ser ajustados dependendo do tipo de animação.

`Animated` fornece vários tipos de animação, sendo o mais comumente usado `Animated.timing()`. Ele suporta a animação de um valor ao longo do tempo usando uma das várias funções de atenuação predefinidas, ou você pode usar a sua própria. As funções de atenuação são normalmente usadas em animação para transmitir aceleração e desaceleração graduais de objetos.

Por padrão, o tempo usará uma curva `easyInOut` que transmite aceleração gradual até a velocidade máxima e termina desacelerando gradualmente até parar. Você pode especificar uma função de atenuação diferente passando um parâmetro de `easing. A `duration` personalizada ou mesmo um `delay` antes do início da animação também é suportada.

Por exemplo, se quisermos criar uma animação de 2 segundos de um objeto que recua ligeiramente antes de se mover para sua posição final:

```js
Animated.timing(this.state.xPosition, {
  toValue: 100,
  easing: Easing.back(),
  duration: 2000,
  useNativeDriver: true,
}).start();
```

Dê uma olhada na seção [**Configurando animações** da referência da API](/docs/animated.md) animada para saber mais sobre todos os parâmetros de configuração suportados pelas animações integradas.

### Compondo animações
As animações podem ser combinadas e reproduzidas em sequência ou em paralelo. As animações sequenciais podem ser reproduzidas imediatamente após o término da animação anterior ou podem começar após um atraso especificado. A API `Animated` fornece vários métodos, como `sequence()` e `delay()`, cada um dos quais usa uma matriz de animações para ser executado e chama automaticamente `start()`/`stop()` conforme necessário.

Por exemplo, a animação a seguir para e depois retorna enquanto gira em paralelo:

```jsx
Animated.sequence([
  // decair, então o spring começa e gira
  Animated.decay(position, {
    // desce até parar
    velocity: {x: gestureState.vx, y: gestureState.vy}, // velocidade da liberação do gesto
    deceleration: 0.997,
    useNativeDriver: true,
  }),
  Animated.parallel([
    // após a decadência, em paralelo:
    Animated.spring(position, {
      toValue: {x: 0, y: 0}, // voltar para começar
      useNativeDriver: true,
    }),
    Animated.timing(twirl, {
      // e girar
      toValue: 360,
      useNativeDriver: true,
    }),
  ]),
]).start(); // iniciar o grupo de sequência
```

Se uma animação for parada ou interrompida, todas as outras animações do grupo também serão interrompidas. `Animated.parallel` tem uma opção `stopTogether` que pode ser definida como `false` para desabilitar isso.

Você pode encontrar uma lista completa de métodos de composição na seção [Compondo animações da referência da API `Animated`](/docs/animated.md).

### Combinando valores animados
Você pode combinar [dois valores animados](/docs/animated.md) por meio de adição, multiplicação, divisão ou módulo para criar um novo valor animado.

Existem alguns casos em que um valor animado precisa inverter outro valor animado para cálculo. Um exemplo é inverter uma escala (2x -> 0,5x):

```jsx
const a = new Animated.Value(1);
const b = Animated.divide(1, a);

Animated.spring(a, {
  toValue: 2,
  useNativeDriver: true,
}).start();
```

### Interpolação
Cada propriedade pode ser executada primeiro por meio de uma interpolação. Uma interpolação mapeia intervalos de entrada para intervalos de saída, normalmente usando uma interpolação linear, mas também oferece suporte a funções de atenuação. Por padrão, ele extrapolará a curva além dos intervalos fornecidos, mas você também poderá limitar o valor de saída.

Um mapeamento básico para converter um intervalo de 0-1 em um intervalo de 0-100 seria:

```js
value.interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
});
```

Por exemplo, você pode querer pensar em seu `Animated.Value` como indo de 0 a 1, mas anime a posição de `150px` para `0px` e a opacidade de 0 a 1. Isso pode ser feito modificando o `style` do exemplo acima, assim:

```jsx
  style={{
    opacity: this.state.fadeAnim, // Vincula diretamente
    transform: [{
      translateY: this.state.fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0]  // 0 : 150, 0.5 : 75, 1 : 0
      }),
    }],
  }}
```

`interpolate()` também suporta vários segmentos de intervalo, o que é útil para definir zonas mortas e outros truques úteis. Por exemplo, para obter um relacionamento de negação em -300 que vai para 0 em -100, depois volta para 1 em 0 e depois volta para zero em 100 seguido por uma zona morta que permanece em 0 para tudo além disso, você poderia fazer:

```js
value.interpolate({
  inputRange: [-300, -100, 0, 100, 101],
  outputRange: [300, 0, 1, 0, 0],
});
```

O que seria mapeado assim:

```
Input | Output
------|-------
  -400|    450
  -300|    300
  -200|    150
  -100|      0
   -50|    0.5
     0|      1
    50|    0.5
   100|      0
   101|      0
   200|      0
```

`interpolate()` também suporta mapeamento para strings, permitindo animar cores e também valores com unidades. Por exemplo, se você quiser animar uma rotação você poderia fazer:

```js
value.interpolate({
  inputRange: [0, 360],
  outputRange: ['0deg', '360deg'],
});
```

`interpolate()` também suporta funções de atenuação arbitrárias, muitas das quais já estão implementadas no módulo [Easing](/docs/easing.md). `interpolate()` também possui comportamento configurável para extrapolar o `outputRange`. Você pode definir a extrapolação definindo as opções `extrapolate`, `extrapolateLeft` ou `extrapolateRight`. O valor padrão é `extend`, mas você pode usar `clamp` para evitar que o valor de saída exceda `outputRange`.

### Rastreando valores dinâmicos
Os valores animados também podem rastrear outros valores definindo `toValue` de uma animação como outro valor animado em vez de um número simples. Por exemplo, uma animação "Chat Heads" como a usada pelo Messenger no Android poderia ser implementada com um `spring()` fixado em outro valor animado, ou com `timing()` e uma `duration` de 0 para rastreamento rígido. Também podem ser compostos com interpolações:

```jsx
Animated.spring(follower, {toValue: leader}).start();
Animated.timing(opacity, {
  toValue: pan.x.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
    useNativeDriver: true,
  }),
}).start();
```

Os valores animados do `leader` e do `follower` seriam implementados usando `Animated.ValueXY()`. `ValueXY` é uma maneira prática de lidar com interações 2D, como panorâmica ou arrastamento. É um wrapper básico que contém duas instâncias de `Animated.Value` e algumas funções auxiliares que as chamam, tornando `ValueXY` um substituto imediato para `Value` em muitos casos. Isso nos permite rastrear os valores de x e y no exemplo acima.

### Gestos de rastreamento
Gestos, como movimento panorâmico ou rolagem, e outros eventos podem ser mapeados diretamente para valores animados usando [`Animated.event`](/docs/animated.md). Isto é feito com uma sintaxe de mapa estruturada para que os valores possam ser extraídos de objetos de eventos complexos. O primeiro nível é uma matriz para permitir o mapeamento entre vários argumentos, e essa matriz contém objetos aninhados.

Por exemplo, ao trabalhar com gestos de rolagem horizontal, você faria o seguinte para mapear `event.nativeEvent.contentOffset.x` para `scrollX` (um `Animated.Value`):

```jsx
 onScroll={Animated.event(
   // scrollX = e.nativeEvent.contentOffset.x
   [{nativeEvent: {
        contentOffset: {
          x: scrollX
        }
      }
    }]
 )}
```

O exemplo a seguir implementa um carrossel de rolagem horizontal onde os indicadores de posição de rolagem são animados usando o `Animated.event` usado no `ScrollView`

#### ScrollView com exemplo de evento animado

```jsx
import React, {useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Animated,
  useWindowDimensions,
} from 'react-native';

const images = new Array(6).fill(
  'https://images.unsplash.com/photo-1556740749-887f6717d7e4',
);

const App = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const {width: windowWidth} = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContainer}>
        <ScrollView
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ])}
          scrollEventThrottle={1}>
          {images.map((image, imageIndex) => {
            return (
              <View style={{width: windowWidth, height: 250}} key={imageIndex}>
                <ImageBackground source={{uri: image}} style={styles.card}>
                  <View style={styles.textContainer}>
                    <Text style={styles.infoText}>
                      {'Image - ' + imageIndex}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.indicatorContainer}>
          {images.map((image, imageIndex) => {
            const width = scrollX.interpolate({
              inputRange: [
                windowWidth * (imageIndex - 1),
                windowWidth * imageIndex,
                windowWidth * (imageIndex + 1),
              ],
              outputRange: [8, 16, 8],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={imageIndex}
                style={[styles.normalDot, {width}]}
              />
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0, 0.7)',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 5,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/c38ee8dd-d990-491b-ac01-5940b5237aeb)

Ao usar o `PanResponder`, você pode usar o código a seguir para extrair as posições x e y de `gestureState.dx` e `gestureState.dy`. Usamos um `null` na primeira posição do array, pois estamos interessados apenas no segundo argumento passado para o manipulador `PanResponder`, que é o `gestureState`.

```jsx
onPanResponderMove={Animated.event(
  [null, // ignora o evento nativo
  // extraia dx e dy do gestureState
  // como 'pan.x = gestureState.dx, pan.y = gestureState.dy'
  {dx: pan.x, dy: pan.y}
])}
```

#### PanResponder com exemplo de evento animado

```jsx
import React, {useRef} from 'react';
import {Animated, View, StyleSheet, PanResponder, Text} from 'react-native';

const App = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Drag & Release this box!</Text>
      <Animated.View
        style={{
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        }}
        {...panResponder.panHandlers}>
        <View style={styles.box} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default App;
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/2c01dacd-b0e9-4160-8f63-01d73c758f9b)

### Respondendo ao valor atual da animação
Você pode perceber que não há uma maneira clara de ler o valor atual durante a animação. Isso ocorre porque o valor só pode ser conhecido no tempo de execução nativo devido a otimizações. Se você precisar executar JavaScript em resposta ao valor atual, existem duas abordagens:

* `spring.stopAnimation(callback)` interromperá a animação e invocará o retorno de chamada com o valor final. Isto é útil ao fazer transições de gestos.
* `spring.addListener(callback)` invocará o retorno de chamada de forma assíncrona enquanto a animação estiver em execução, fornecendo um valor recente. Isso é útil para acionar mudanças de estado, por exemplo, encaixar um bobble em uma nova opção conforme o usuário o arrasta para mais perto, porque essas mudanças de estado maiores são menos sensíveis a alguns quadros de atraso em comparação com gestos contínuos como o movimento panorâmico, que precisa ser executado a 60 fps.

`Animated` foi projetado para ser totalmente serializável para que as animações possam ser executadas com alto desempenho, independentemente do loop de eventos normal do JavaScript. Isso influencia a API, então tenha isso em mente quando parecer um pouco mais complicado fazer algo em comparação com um sistema totalmente síncrono. Confira `Animated.Value.addListener` como uma forma de contornar algumas dessas limitações, mas use-o com moderação, pois pode ter implicações de desempenho no futuro.

### Usando o driver nativo
A API `Animated` foi projetada para ser serializável. Ao usar o [driver nativo](https://reactnative.dev/blog/2017/02/14/using-native-driver-for-animated), enviamos tudo sobre a animação para o nativo antes de iniciá-la, permitindo que o código nativo execute a animação no thread da UI sem ter que passar pela ponte em cada quadro. Depois que a animação for iniciada, o thread JS poderá ser bloqueado sem afetar a animação.

O uso do driver nativo para animações normais pode ser feito definindo `useNativeDriver: true` na configuração da animação ao iniciá-la. Animações sem uma propriedade `useNativeDriver` serão padronizadas como false por motivos legados, mas emitirão um aviso (e erro de verificação de digitação no TypeScript).

```js
Animated.timing(this.state.animatedValue, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // <-- Seta isso como true
}).start();
```

Os valores animados são compatíveis apenas com um driver, portanto, se você usar o driver nativo ao iniciar uma animação em um valor, certifique-se de que cada animação nesse valor também use o driver nativo.

O driver nativo também funciona com `Animated.event`. Isso é especialmente útil para animações que seguem a posição de rolagem, pois sem o driver nativo, a animação sempre executará um quadro atrás do gesto devido à natureza assíncrona do React Native.

```jsx
<Animated.ScrollView // <-- Use o wrapper ScrollView animado
  scrollEventThrottle={1} // <--Use 1 aqui para garantir que nenhum evento seja perdido
  onScroll={Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {y: this.state.animatedValue},
        },
      },
    ],
    {useNativeDriver: true}, // <-- Seta isso como true
  )}>
  {content}
</Animated.ScrollView>
```

Você pode ver o driver nativo em ação executando o [aplicativo RNTester](https://github.com/facebook/react-native/blob/main/packages/rn-tester/) e carregando o exemplo animado nativo. Você também pode dar uma olhada no [código-fonte](https://github.com/facebook/react-native/blob/master/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js) para saber como esses exemplos foram produzidos.

#### Ressalvas
Nem tudo o que você pode fazer com o `Animated` é atualmente compatível com o driver nativo. A principal limitação é que você só pode animar propriedades que não sejam de layout: coisas como `transformation` e `opacity` funcionarão, mas Flexbox e propriedades de posição não. Ao usar `Animated.event`, ele funcionará apenas com eventos diretos e não com eventos "borbulhantes". Isso significa que ele não funciona com `PanResponder`, mas funciona com coisas como `ScrollView#onScroll`.

Quando uma animação está em execução, ela pode impedir que os componentes `VirtualizedList` renderizem mais linhas. Se você precisar executar uma animação longa ou em loop enquanto o usuário percorre uma lista, você pode usar `isInteraction: false` na configuração da sua animação para evitar esse problema.

### Tenha em mente
Ao usar estilos de transformação, como `rotateY`, `rotateX` e outros, certifique-se de que a perspectiva do estilo de transformação esteja em vigor. No momento, algumas animações podem não ser renderizadas no Android sem ele. Exemplo abaixo.

```jsx
<Animated.View
  style={{
    transform: [
      {scale: this.state.scale},
      {rotateY: this.state.rotateY},
      {perspective: 1000}, // sem esta linha esta animação não será renderizada no Android enquanto funciona bem no iOS
    ],
  }}
/>
```

### Exemplos adicionais
O aplicativo RNTester possui vários exemplos de `Animated` em uso:

* [AnimatedGratuitousApp](https://github.com/facebook/react-native/tree/main/packages/rn-tester/js/examples/AnimatedGratuitousApp)
* [NativeAnimationsExample](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/NativeAnimation/NativeAnimationsExample.js)

## API `LayoutAnimation`
`LayoutAnimation` permite configurar globalmente, criar e atualizar animações que serão usadas para todas as visualizações no próximo ciclo de renderização/layout. Isto é útil para fazer atualizações de layout do Flexbox sem se preocupar em medir ou calcular propriedades específicas para animá-las diretamente, e é especialmente útil quando alterações de layout podem afetar ancestrais, por exemplo, uma expansão "veja mais" que também aumenta o tamanho do pai e empurra para baixo a linha abaixo, o que de outra forma exigiria coordenação explícita entre os componentes para animá-los todos em sincronia.

Observe que, embora o `LayoutAnimation` seja muito poderoso e possa ser bastante útil, ele fornece muito menos controle do que o `Animated` e outras bibliotecas de animação, portanto, talvez seja necessário usar outra abordagem se não conseguir que o `LayoutAnimation` faça o que deseja.

Observe que para que isso funcione no Android, você precisa definir os seguintes sinalizadores via `UIManager`:

```java
UIManager.setLayoutAnimationEnabledExperimental(true);
```

```jsx
import React from 'react';
import {
  NativeModules,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class App extends React.Component {
  state = {
    w: 100,
    h: 100,
  };

  _onPress = () => {
    // Animate the update
    LayoutAnimation.spring();
    this.setState({w: this.state.w + 15, h: this.state.h + 15});
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[styles.box, {width: this.state.w, height: this.state.h}]}
        />
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Press me!</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/ca6367a9-3d9d-46f2-bb61-8683320171dc)

Este exemplo usa um valor predefinido, você pode personalizar as animações conforme necessário, consulte [LayoutAnimation.js](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/LayoutAnimation/LayoutAnimation.js) para obter mais informações.

## Notas Adicionais

### `requestAnimationFrame`
`requestAnimationFrame` é um polyfill do navegador com o qual você deve estar familiarizado. Ele aceita uma função como seu único argumento e chama essa função antes da próxima repintura. É um elemento essencial para animações que sustenta todas as APIs de animação baseadas em JavaScript. Em geral, você não precisa chamar isso sozinho - as APIs de animação gerenciarão as atualizações de quadros para você.

### `setNativeProps`
Conforme mencionado na seção [Manipulação Direta](/docs/direct-manipulation.md), `setNativeProps` nos permite modificar propriedades de componentes com suporte nativo (componentes que são realmente apoiados por visualizações nativas, ao contrário dos componentes compostos) diretamente, sem ter que `setState` renderizar novamente a hierarquia de componentes.

Poderíamos usar isso no exemplo Rebound para atualizar a escala - isso pode ser útil se o componente que estamos atualizando estiver profundamente aninhado e não tiver sido otimizado com `shouldComponentUpdate`.

Se você encontrar suas animações com queda de quadros (desempenho abaixo de 60 quadros por segundo), use `setNativeProps` ou `shouldComponentUpdate` para otimizá-las. Ou você pode executar as animações no thread da UI em vez do thread JavaScript [com a opção `useNativeDriver`](https://reactnative.dev/blog/2017/02/14/using-native-driver-for-animated). Você também pode adiar qualquer trabalho computacional intensivo até que as animações sejam concluídas, usando o [`InteractionManager`](/docs/interactionmanager.md). Você pode monitorar a taxa de quadros usando a ferramenta "FPS Monitor" do menu de desenvolvimento do aplicativo.
