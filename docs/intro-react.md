# Fundamentos do React
React Native é executado em React, uma popular biblioteca de código aberto para construção de interfaces de usuário com JavaScript. Para aproveitar ao máximo o React Native, é útil entender o próprio React. Esta seção pode ajudá-lo a começar ou servir como um curso de atualização.

Vamos cobrir os principais conceitos por trás do React:

* componentes
* JSX
* props
* estado

Se você quiser se aprofundar, recomendamos que você verifique a [documentação oficial do React](https://react.dev/learn).

## Seu primeiro componente
O restante desta introdução ao React usa "gatos" em seus exemplos: criaturas amigáveis e acessíveis que precisam de nomes e de um café para trabalhar. Aqui está seu primeiro componente Cat:

```js
import React from 'react';
import {Text} from 'react-native';

const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

Veja como fazer isso: Para definir seu componente Cat, primeiro use a importação do JavaScript para importar o componente principal de texto do React e do React Native:

```js
import React from 'react';
import {Text} from 'react-native';
```

Seu componente começa como uma função:

```js
const Cat = () => {};
```

Você pode pensar nos componentes como projetos. Tudo o que um componente de função retorna é renderizado como um elemento React. Os elementos React permitem descrever o que você deseja ver na tela.

Aqui o componente Cat irá renderizar um elemento `<Text>`:

```js
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};
```

Você pode exportar seu componente de função com o `export default` do JavaScript para uso em todo o seu aplicativo, assim:

```js
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

> Esta é uma das muitas maneiras de exportar seu componente. Este tipo de exportação funciona bem aqui. No entanto, dependendo da estrutura de arquivos do seu aplicativo, pode ser necessário usar uma convenção diferente. Esta página pode ser útil sobre [importações e exportações de JavaScript](https://medium.com/dailyjs/javascript-module-cheatsheet-7bd474f1d829).

Agora dê uma olhada mais de perto nessa declaração de retorno. `<Text>Hello, I am your cat!</Text>` está usando um tipo de sintaxe JavaScript que torna a escrita de elementos conveniente: JSX.

## JSX
React e React Native usam JSX, uma sintaxe que permite escrever elementos dentro de JavaScript como: `<Text>Hello, I am your cat!</Text>`. A documentação do React tem um [guia completo sobre JSX](https://react.dev/learn/writing-markup-with-jsx) que você pode consultar para aprender ainda mais. Como JSX é JavaScript, você pode usar variáveis dentro dele. Aqui você está declarando um nome para o gato, `name`, e incorporando-o com chaves dentro de `<Text>`.

```jsx
import React from 'react';
import {Text} from 'react-native';

const Cat = () => {
  const name = 'Maru';
  return <Text>Hello, I am {name}!</Text>;
};

export default Cat;
```

Qualquer expressão JavaScript funcionará entre chaves, incluindo chamadas de função como `{getFullName("Rum", "Tum", "Tugger")}`

```js
import React from 'react';
import {Text} from 'react-native';

const getFullName = (firstName, secondName, thirdName) => {
  return firstName + ' ' + secondName + ' ' + thirdName;
};

const Cat = () => {
  return <Text>Hello, I am {getFullName('Rum', 'Tum', 'Tugger')}!</Text>;
};

export default Cat;
```

Você pode pensar nas chaves como a criação de um portal para a funcionalidade JS em seu JSX!

> Como o JSX está incluído na biblioteca React, ele não funcionará se você não `import React from 'react'` no topo do seu arquivo!

## Componentes personalizados
Você já conheceu os [componentes principais do React Native](/docs/intro-react-native-components.md). O React permite aninhar esses componentes uns dentro dos outros para criar novos componentes. Esses componentes aninhados e reutilizáveis estão no centro do paradigma React.

Por exemplo, você pode aninhar `Text` e `TextInput` dentro de uma `View` abaixo, e o React Native irá renderizá-los juntos:

```jsx
import React from 'react';
import {Text, TextInput, View} from 'react-native';

const Cat = () => {
  return (
    <View>
      <Text>Hello, I am...</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
        defaultValue="Name me!"
      />
    </View>
  );
};

export default Cat;
```
![Captura de tela de 2023-12-05 18-42-15](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/b8a8302f-88d7-4d17-9ef0-7c962e2ef84b)

> #### Notas do desenvolvedor
> 
> ##### Android
> No Android, você normalmente coloca suas visualizações dentro de `LinearLayout`, `FrameLayout`, `RelativeLayout`, etc. para definir como os filhos da visualização serão organizados na tela. No React Native, o View usa Flexbox para o layout de seus filhos. Você pode aprender mais em nosso [guia de layout com Flexbox](/docs/flexbox.md).
> 
> ##### Web
> Se você estiver familiarizado com desenvolvimento web, `<View>` e `<Text>` podem lembrá-lo de HTML! Você pode considerá-las como tags `<div>` e `<p>` no desenvolvimento de aplicativos.

Você pode renderizar esse componente várias vezes e em vários lugares sem repetir seu código usando `<Cat>`:

```jsx
import React from 'react';
import {Text, View} from 'react-native';

const Cat = () => {
  return (
    <View>
      <Text>I am also a cat!</Text>
    </View>
  );
};

const Cafe = () => {
  return (
    <View>
      <Text>Welcome!</Text>
      <Cat />
      <Cat />
      <Cat />
    </View>
  );
};

export default Cafe;
```
![Captura de tela de 2023-12-05 18-46-43](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/dda69460-1a32-4f2c-ae19-b964a6ae9f58)

Qualquer componente que renderize outros componentes é um componente pai. Aqui, `Cafe` é o componente pai e cada `Cat` é um componente filho.

Você pode colocar quantos gatos quiser em seu café. Cada `<Cat>` renderiza um elemento único – que você pode personalizar com adereços (`props`).

## Props
Props é a abreviatura de “propriedades”. Os props permitem personalizar os componentes do React. Por exemplo, aqui você passa para cada `<Cat>` um nome diferente para `Cat` renderizar:

```jsx
import React from 'react';
import {Text, View} from 'react-native';

const Cat = props => {
  return (
    <View>
      <Text>Hello, I am {props.name}!</Text>
    </View>
  );
};

const Cafe = () => {
  return (
    <View>
      <Cat name="Maru" />
      <Cat name="Jellylorum" />
      <Cat name="Spot" />
    </View>
  );
};

export default Cafe;
```

![Captura de tela de 2023-12-05 18-49-52](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/b0a6b998-72e0-4256-862a-c753b64e63eb)

A maioria dos componentes principais do React Native também pode ser personalizada com acessórios. Por exemplo, ao usar `Image`, você passa a ela uma propriedade chamada `source` para definir qual imagem ela mostra:

```jsx
import React from 'react';
import {Text, View, Image} from 'react-native';

const CatApp = () => {
  return (
    <View>
      <Image
        source={{
          uri: 'https://reactnative.dev/docs/assets/p_cat1.png',
        }}
        style={{width: 200, height: 200}}
      />
      <Text>Hello, I am your cat!</Text>
    </View>
  );
};

export default CatApp;
```

![Captura de tela de 2023-12-05 18-51-38](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/99bfe463-ce86-4a13-a5a1-1f6f2c239334)

A imagem tem [muitos props diferentes](/docs/image.md#props), incluindo [estilo](/docs/image.md#style), que aceita um objeto JS de design e pares de valores de propriedade relacionados ao layout.

> Observe as chaves duplas `{{ }}` ao redor da largura e altura do estilo. Em JSX, os valores JavaScript são referenciados com `{}`. Isso é útil se você estiver passando algo diferente de uma string como props, como um array ou número: `<Cat food={["fish", "kibble"]} age={2} />`. No entanto, objetos JS também são indicados com chaves: `{largura: 200, altura: 200}`. Portanto, para passar um objeto JS em JSX, você deve envolver o objeto em outro par de chaves: `{{largura: 200, altura: 200}}`

Você pode construir muitas coisas com props e os componentes principais `Text`, `Image` e `View`! Mas para construir algo interativo, você precisará de estado.
