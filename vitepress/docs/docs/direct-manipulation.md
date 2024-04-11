# Manipulação Direta

Às vezes é necessário fazer alterações diretamente em um componente sem usar `state/props` para acionar uma nova renderização de toda a subárvore. Ao usar React no navegador, por exemplo, às vezes você precisa modificar diretamente um nó DOM, e o mesmo se aplica a visualizações em aplicativos móveis. `setNativeProps` é o equivalente React Native para definir propriedades diretamente em um nó DOM.

::: warning ATENÇÃO
Use `setNativeProps` quando a nova renderização frequentemente criar um gargalo de desempenho!

A manipulação direta não será uma ferramenta que você utiliza com frequência. Normalmente, você o usará apenas para criar animações contínuas para evitar a sobrecarga de renderizar a hierarquia de componentes e reconciliar muitas visualizações.

`setNativeProps` é imperativo e armazena o estado na camada nativa (DOM, UIView, etc.) e não nos componentes do React, o que torna seu código mais difícil de compreender.

Antes de usá-lo, tente resolver seu problema com `setState` e [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action).
:::

## setNativeProps com TouchableOpacity

[TouchableOpacity](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/Touchable/TouchableOpacity.js) usa `setNativeProps` internamente para atualizar a opacidade de seu filho componente:

```tsx
const viewRef = useRef<View>();
const setOpacityTo = useCallback(value => {
  // Redigido: código relacionado à animação
  viewRef.current.setNativeProps({
    opacity: value,
  });
}, []);
```

Isso nos permite escrever o código a seguir e saber que a criança terá sua opacidade atualizada em resposta aos toques, sem que a criança tenha conhecimento desse fato ou exija quaisquer alterações em sua implementação:

```tsx
<TouchableOpacity onPress={handlePress}>
  <View>
    <Text>Press me!</Text>
  </View>
</TouchableOpacity>
```

Vamos imaginar que `setNativeProps` não estava disponível. Uma maneira de implementá-lo com essa restrição é armazenar o valor de opacidade no estado e, em seguida, atualizar esse valor sempre que `onPress` for acionado:

```tsx
const [buttonOpacity, setButtonOpacity] = useState(1);
return (
  <TouchableOpacity
    onPressIn={() => setButtonOpacity(0.5)}
    onPressOut={() => setButtonOpacity(1)}>
    <View style={{opacity: buttonOpacity}}>
      <Text>Press me!</Text>
    </View>
  </TouchableOpacity>
);
```

Isso é computacionalmente intensivo em comparação com o exemplo original - o React precisa renderizar novamente a hierarquia de componentes cada vez que a opacidade muda, mesmo que outras propriedades da visualização e de seus filhos não tenham mudado. Normalmente, essa sobrecarga não é uma preocupação, mas ao executar animações contínuas e responder a gestos, otimizar criteriosamente seus componentes pode melhorar a fidelidade de suas animações.

Se você observar a implementação de `setNativeProps` em [NativeMethodsMixin](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod.js), você notará que é um wrapper em torno de `RCTUIManager.updateView` - esta é exatamente a mesma chamada de função que resulta da nova renderização - consulte [receiveComponent in ReactNativeBaseComponent](https://github.com/facebook/react-native /blob/fb2ec1ea47c53c2e7b873acb1cb46192ac74274e/Libraries/Renderer/oss/ReactNativeRenderer-prod.js#L5793-L5813).

## Componentes compostos e setNativeProps

Os componentes compostos não são apoiados por uma visualização nativa, portanto você não pode chamar `setNativeProps` neles. Considere este exemplo:

```jsx [setNativeProps%20with%20Composite%20Components]
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = props => (
  <View style={{marginTop: 50}}>
    <Text>{props.label}</Text>
  </View>
);

const App = () => (
  <TouchableOpacity>
    <MyButton label="Press me!" />
  </TouchableOpacity>
);

export default App;
```

```tsx [setNativeProps%20with%20Composite%20Components]
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = (props: {label: string}) => (
  <View style={{marginTop: 50}}>
    <Text>{props.label}</Text>
  </View>
);

const App = () => (
  <TouchableOpacity>
    <MyButton label="Press me!" />
  </TouchableOpacity>
);

export default App;
```

Se você executar isso, verá imediatamente este erro: "`Touchable child must either be native or forward setNativeProps to a native component`" (_O filho tocável deve ser nativo ou encaminhar setNativeProps para um componente nativo_. Isso ocorre porque `MyButton` não é apoiado diretamente por uma visualização nativa cuja opacidade deve ser definida. Você pode pensar assim: se você definir um componente com `createReactClass` você não esperaria ser capaz de definir um suporte de estilo nele e fazer isso funcionar - você precisaria passar o suporte de estilo para um filho, a menos que você esteja agrupando um componente nativo. Da mesma forma, encaminharemos `setNativeProps` para um componente filho com suporte nativo.

#### Encaminha setNativeProps para um filho

Como o método `setNativeProps` existe em qualquer referência a um componente `View`, é suficiente encaminhar uma referência em seu componente personalizado para um dos componentes `<View />` que ele renderiza. Isso significa que uma chamada para `setNativeProps` no componente personalizado terá o mesmo efeito como se você chamasse `setNativeProps` no próprio componente `View` encapsulado.

```js [Forwarding%20setNativeProps]
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = React.forwardRef((props, ref) => (
  <View {...props} ref={ref} style={{marginTop: 50}}>
    <Text>{props.label}</Text>
  </View>
));

const App = () => (
  <TouchableOpacity>
    <MyButton label="Press me!" />
  </TouchableOpacity>
);

export default App;
```

```tsx [Forwarding%20setNativeProps]
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = React.forwardRef<View, {label: string}>((props, ref) => (
  <View {...props} ref={ref} style={{marginTop: 50}}>
    <Text>{props.label}</Text>
  </View>
));

const App = () => (
  <TouchableOpacity>
    <MyButton label="Press me!" />
  </TouchableOpacity>
);

export default App;
```

Agora você pode usar `MyButton` dentro de `TouchableOpacity`!

Você deve ter notado que passamos todos os adereços para a visualização filha usando `{...props}`. A razão para isso é que `TouchableOpacity` é na verdade um componente composto e, portanto, além de depender de `setNativeProps` em seu filho, também requer que o filho execute o tratamento de toque. Para fazer isso, ele passa [vários adereços](/docs/view.md#onmoveshouldsetresponder) que chamam de volta para o componente `TouchableOpacity`. `TouchableHighlight`, por outro lado, é apoiado por uma visão nativa e requer apenas que implementemos `setNativeProps`.

## setNativeProps para editar o valor TextInput

Outro caso de uso muito comum de `setNativeProps` é editar o valor do TextInput. A propriedade `controlled` do TextInput às vezes pode descartar caracteres quando o `bufferDelay` está baixo e o usuário digita muito rapidamente. Alguns desenvolvedores preferem ignorar totalmente esta propriedade e, em vez disso, usar `setNativeProps` para manipular diretamente o valor TextInput quando necessário. Por exemplo, o código a seguir demonstra a edição da entrada quando você toca em um botão:

```jsx [Clear%20text]
import React from 'react';
import {useCallback, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  const inputRef = useRef(null);
  const editText = useCallback(() => {
    inputRef.current.setNativeProps({text: 'Edited Text'});
  }, []);

  return (
    <View style={styles.container}>
      <TextInput ref={inputRef} style={styles.input} />
      <TouchableOpacity onPress={editText}>
        <Text>Edit text</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    width: 200,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default App;
```

```tsx [Clear%20text]
import React from 'react';
import {useCallback, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  const inputRef = useRef<TextInput>(null);
  const editText = useCallback(() => {
    inputRef.current?.setNativeProps({text: 'Edited Text'});
  }, []);

  return (
    <View style={styles.container}>
      <TextInput ref={inputRef} style={styles.input} />
      <TouchableOpacity onPress={editText}>
        <Text>Edit text</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    width: 200,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default App;
```

Você pode usar o método [`clear`](/docs/textinput#clear) para limpar o `TextInput` que limpa o texto de entrada atual usando a mesma abordagem.

## Evitando conflitos com a função render

Se você atualizar uma propriedade que também é gerenciada pela função de renderização, poderá acabar com alguns bugs imprevisíveis e confusos porque sempre que o componente for renderizado novamente e essa propriedade mudar, qualquer valor que tenha sido definido anteriormente em `setNativeProps` será completamente ignorado e substituído.

## setNativeProps e shouldComponentUpdate

Ao [aplicar de forma inteligente `shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#avoid-reconciliation), você pode evitar a sobrecarga desnecessária envolvida na reconciliação de subárvores de componentes inalteradas a ponto de ter um desempenho suficiente, basta usar `setState` em vez de `setNativeProps`.

## Outros métodos nativos

Os métodos descritos aqui estão disponíveis na maioria dos componentes padrão fornecidos pelo React Native. Observe, entretanto, que eles _não_ estão disponíveis em componentes compostos que não sejam diretamente apoiados por uma visualização nativa. Geralmente, isso incluirá a maioria dos componentes definidos em seu próprio aplicativo.

### measure(callback)

Determina a localização na tela, largura e altura na janela de visualização da view fornecida e retorna os valores por meio de um retorno de chamada assíncrono. Se for bem-sucedido, o retorno de chamada será chamado com os seguintes argumentos:

- x
- y
- width
- height
- pageX
- pageY

Observe que essas medidas não estarão disponíveis até que a renderização seja concluída no modo nativo. Se você precisar das medidas o mais rápido possível e não precisar de `pageX` e `pageY`, considere usar a propriedade [`onLayout`](/docs/view.md#onlayout).

Além disso, a largura e a altura retornadas por `measure()` são a largura e a altura do componente na janela de visualização. Se você precisar do tamanho real do componente, considere usar a propriedade [`onLayout`](/docs/view.md#onlayout).

### measureInWindow(callback)

Determina a localização da visualização fornecida na janela e retorna os valores por meio de um retorno de chamada assíncrono. Se a visualização raiz do React estiver incorporada em outra visualização nativa, isso fornecerá as coordenadas absolutas. Se for bem-sucedido, o retorno de chamada será chamado com os seguintes argumentos:

- x
- y
- width
- height

### measureLayout(relativeToNativeComponentRef, onSuccess, onFail)

Como `measure()`, mas mede a visualização relativa a um ancestral, especificado com a referência `relativeToNativeComponentRef`. Isso significa que as coordenadas retornadas são relativas à origem `x`, `y` da visão ancestral.

::: info Observação
Este método também pode ser chamado com um manipulador `relativeToNativeNode` (em vez de referência), mas esta variante está obsoleta.
:::

```jsx [measureLayout%20example&supportedPlatforms=android,ios]
import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';

const App = () => {
  const textContainerRef = useRef(null);
  const textRef = useRef(null);
  const [measure, setMeasure] = useState(null);

  useEffect(() => {
    if (textRef.current && textContainerRef.current) {
      textRef.current.measureLayout(
        textContainerRef.current,
        (left, top, width, height) => {
          setMeasure({left, top, width, height});
        },
      );
    }
  }, [measure]);

  return (
    <View style={styles.container}>
      <View ref={textContainerRef} style={styles.textContainer}>
        <Text ref={textRef}>Where am I? (relative to the text container)</Text>
      </View>
      <Text style={styles.measure}>{JSON.stringify(measure)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: '#61dafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  measure: {
    textAlign: 'center',
    padding: 12,
  },
});

export default App;
```

```tsx [measureLayout%20example]
import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';

type Measurements = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const App = () => {
  const textContainerRef = useRef<View>(null);
  const textRef = useRef<Text>(null);
  const [measure, setMeasure] = useState<Measurements | null>(null);

  useEffect(() => {
    if (textRef.current && textContainerRef.current) {
      textRef.current?.measureLayout(
        textContainerRef.current,
        (left, top, width, height) => {
          setMeasure({left, top, width, height});
        },
        () => {
          console.error('measurement failed');
        },
      );
    }
  }, [measure]);

  return (
    <View style={styles.container}>
      <View ref={textContainerRef} style={styles.textContainer}>
        <Text ref={textRef}>Where am I? (relative to the text container)</Text>
      </View>
      <Text style={styles.measure}>{JSON.stringify(measure)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: '#61dafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  measure: {
    textAlign: 'center',
    padding: 12,
  },
});

export default App;
```

### focus()

Solicita foco para a entrada ou visualização fornecida. O comportamento exato acionado dependerá da plataforma e do tipo de visualização.

### blur()

Remove o foco de uma entrada ou visualização. Este é o oposto de `focus()`.
