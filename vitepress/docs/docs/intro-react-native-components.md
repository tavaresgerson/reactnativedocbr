# Componentes principais e componentes nativos

React Native é uma estrutura de código aberto para construir aplicativos Android e iOS usando React e os recursos nativos da plataforma de aplicativos. Com o React Native, você usa JavaScript para acessar as APIs da sua plataforma, bem como para descrever a aparência e o comportamento da sua UI usando componentes do React: pacotes de código reutilizável e aninhado. Você pode aprender mais sobre React na próxima seção. Mas primeiro, vamos abordar como os componentes funcionam no React Native.

## Visualizações e desenvolvimento móvel
No desenvolvimento Android e iOS, uma visualização é o bloco de construção básico da UI: um pequeno elemento retangular na tela que pode ser usado para exibir texto, imagens ou responder à entrada do usuário. Mesmo os menores elementos visuais de um aplicativo, como uma linha de texto ou um botão, são tipos de visualizações. Alguns tipos de visualizações podem conter outras visualizações. São visualizações até o fim!

<div class="one-image">
  <img src="/docs/assets/diagram_ios-android-views.svg" />
  <figcaption>
    Apenas uma amostra das muitas visualizações usadas em aplicativos Android e iOS.
  </figcaption>
</div>


## Componentes nativos
No desenvolvimento Android, você escreve visualizações em Kotlin ou Java; no desenvolvimento iOS, você usa Swift ou Objective-C. Com React Native, você pode invocar essas visualizações com JavaScript usando componentes React. Em tempo de execução, o React Native cria as visualizações Android e iOS correspondentes para esses componentes. Como os componentes React Native são apoiados pelas mesmas visualizações do Android e iOS, os aplicativos React Native têm aparência, comportamento e desempenho como qualquer outro aplicativo. Chamamos esses componentes apoiados pela plataforma de **Componentes Nativos**.

React Native vem com um conjunto de componentes nativos essenciais e prontos para uso que você pode usar para começar a construir seu aplicativo hoje mesmo. Estes são os **componentes principais** do React Native.

React Native também permite que você crie seus próprios componentes nativos para [Android](/docs/native-components-android.md) e [iOS](/docs/native-components-ios.md) para atender às necessidades exclusivas do seu aplicativo. Também temos um ecossistema próspero desses componentes contribuídos pela comunidade. Confira o [Native Directory](https://reactnative.directory/) para descobrir o que a comunidade está criando.

## Core Componentes
React Native possui muitos componentes principais para tudo, desde controles até indicadores de atividade. Você pode encontrá-los todos [documentados na seção API](/docs/components-and-apis.md). Você trabalhará principalmente com os seguintes componentes principais:

| REACT NATIVE UI COMPONENT	| ANDROID VIEW   | IOS VIEW         | WEB ANÁLOGO            | DESCRIÇÃO  |
|---------------------------|----------------|------------------|------------------------|--------------|
| `<View>`                  | `<ViewGroup>`  | `<UIView>`       |	Um `<div>` sem rolagem | Um contêiner que suporta layout com flexbox, estilo, algum manuseio de toque e controles de acessibilidade |
| `<Text>`                  | `<TextView>`   | `<UITextView>`   | `<p>`                  | Exibe, estiliza e aninha sequências de texto e até mesmo manipula eventos de toque |
| `<Image>`                 | `<ImageView>`  | `<UIImageView>`  | `<img>`                | Exibe diferentes tipos de imagens |
| `<ScrollView>`            | `<ScrollView>` | `<UIScrollView>` |	`<div>`                | Um contêiner de rolagem genérico que pode conter vários componentes e visualizações |
| `<TextInput>`             | `<EditText>`   | `<UITextField>`  | `<input type="text">`  | Permite que o usuário insira texto |

Na próxima seção, você começará a combinar esses componentes principais para aprender como o React funciona:

```js
import React from 'react';
import {View, Text, Image, ScrollView, TextInput} from 'react-native';

const App = () => {
  return (
    <ScrollView>
      <Text>Some text</Text>
      <View>
        <Text>Some more text</Text>
        <Image
          source={{
            uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
          }}
          style={{width: 200, height: 200}}
        />
      </View>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
        defaultValue="You can type in me"
      />
    </ScrollView>
  );
};

export default App;
```

Como o React Native usa a mesma estrutura de API dos componentes do React, você precisará entender as APIs dos componentes do React para começar. A próxima seção faz uma rápida introdução ou atualização sobre o tópico. No entanto, se você já estiver familiarizado com o React, sinta-se à vontade para avançar.

<div class="one-image">
  <img src="/docs/assets/diagram_react-native-components.svg" />
</div>
