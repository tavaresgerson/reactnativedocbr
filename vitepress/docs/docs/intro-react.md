---
id: intro-react
title: Fundamentos do React
description: Para entender totalmente o React Native, você precisa de uma base sólida em React. Esta breve introdução ao React pode ajudá-lo a começar ou se atualizar.
---

# Fundamentos do React

React Native é executado em [React](https://react.dev/), uma popular biblioteca de código aberto para construção de interfaces de usuário com JavaScript. Para aproveitar ao máximo o React Native, é útil entender o próprio React. Esta seção pode ajudá-lo a começar ou servir como um curso de atualização.

Vamos cobrir os principais conceitos por trás do React:

- componentes
- JSX
- adereços
- estado

Se você quiser se aprofundar, recomendamos que você verifique a [documentação oficial do React](https://react.dev/learn).

## Seu primeiro componente

O restante desta introdução ao React usa gatos em seus exemplos: criaturas amigáveis ​​e acessíveis que precisam de nomes e de um café para trabalhar. Aqui está seu primeiro componente Cat:

```jsx [Your Cat]
import React from 'react';
import {Text} from 'react-native';

const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

Veja como fazer isso: Para definir seu componente `Cat`, primeiro use o [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) do JavaScript para importar o componente principal [`Text`](/docs/next/text) do React e React Native:

```tsx
import React from 'react';
import {Text} from 'react-native';
```

Seu componente começa como uma função:

```tsx
const Cat = () => {};
```

Você pode pensar nos componentes como projetos. Tudo o que um componente de função retorna é renderizado como um **elemento React.** Os elementos React permitem descrever o que você deseja ver na tela.

Aqui o componente `Cat` irá renderizar um elemento `<Text>`:

```tsx
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};
```

Você pode exportar seu componente de função com [`export default`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) do JavaScript para uso em todo o seu aplicativo da seguinte forma:

```tsx
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

> Esta é uma das muitas maneiras de exportar seu componente. Este tipo de exportação funciona bem com o Snack Player. No entanto, dependendo da estrutura de arquivos do seu aplicativo, pode ser necessário usar uma convenção diferente. Este [post de dicas sobre importações e exportações de JavaScript](https://medium.com/dailyjs/javascript-module-cheatsheet-7bd474f1d829) pode ajudar.

Agora dê uma olhada mais de perto na declaração `return`. `<Text>Olá, sou seu gato!</Text>` está usando um tipo de sintaxe JavaScript que torna a escrita de elementos conveniente: JSX.

## JSX

React e React Native usam **JSX**, uma sintaxe que permite escrever elementos dentro do JavaScript como: `<Text>Olá, sou seu gato!</Text>`. A documentação do React tem [um guia completo para JSX](https://react.dev/learn/writing-markup-with-jsx) que você pode consultar para saber ainda mais. Como JSX é JavaScript, você pode usar variáveis ​​dentro dele. Aqui você está declarando um nome para o gato, `name`, e incorporando-o com chaves dentro de `<Text>`.

```jsx [Curly Braces]
import React from 'react';
import {Text} from 'react-native';

const Cat = () => {
  const name = 'Maru';
  return <Text>Hello, I am {name}!</Text>;
};

export default Cat;
```

Qualquer expressão JavaScript funcionará entre chaves, incluindo chamadas de função como `{getFullName("Rum", "Tum", "Tugger")}`:

::: code-group
```jsx [Curly Braces]
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

```tsx [Curly Braces]
import React from 'react';
import {Text} from 'react-native';

const getFullName = (
  firstName: string,
  secondName: string,
  thirdName: string,
) => {
  return firstName + ' ' + secondName + ' ' + thirdName;
};

const Cat = () => {
  return <Text>Hello, I am {getFullName('Rum', 'Tum', 'Tugger')}!</Text>;
};

export default Cat;
```
:::

Você pode pensar nas chaves como a criação de um portal para a funcionalidade JS em seu JSX!

> Como JSX está incluído na biblioteca React, ele não funcionará se você não tiver `import React from 'react'` no topo do seu arquivo!

## Componentes personalizados

Você já conheceu [Componentes principais do React Native](/docs/intro-react-native-components). O React permite aninhar esses componentes uns dentro dos outros para criar novos componentes. Esses componentes aninhados e reutilizáveis ​​estão no centro do paradigma React.

Por exemplo, você pode aninhar [`Text`](/docs/text) e [`TextInput`](docs/textinput) dentro de um [`View`](/docs/view) abaixo, e o React Native irá renderizá-los juntos:

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

#### Notas do desenvolvedor

> **Web**
> Se você está familiarizado com desenvolvimento web, `<View>` e `<Text>` podem lembrá-lo de HTML! Você pode pensar nelas como as tags `<div>` e `<p>` de desenvolvimento de aplicativos.

> **Android**
> No Android, você normalmente coloca suas visualizações dentro de `LinearLayout`, `FrameLayout`, `RelativeLayout`, etc. para definir como os filhos da visualização serão organizados na tela. No React Native, `View` usa Flexbox para o layout de seus filhos. Você pode aprender mais em [nosso guia de layout com Flexbox](flexbox).

Você pode renderizar este componente várias vezes e em vários lugares sem repetir seu código usando `<Cat>`:

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

Qualquer componente que renderize outros componentes é um **componente pai.** Aqui, `Cafe` é o componente pai e cada `Cat` é um **componente filho.**

Você pode colocar quantos gatos quiser em seu café. Cada `<Cat>` renderiza um elemento único – que você pode personalizar com adereços.

## Adereços

**Props** é a abreviação de "propriedades". Os adereços permitem personalizar os componentes do React. Por exemplo, aqui você passa para cada `<Cat>` um `nome` diferente para `Cat` renderizar:

::: code-group

```jsx [Multiple Props]
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

```tsx [Multiple Props]
import React from 'react';
import {Text, View} from 'react-native';

type CatProps = {
  name: string;
};

const Cat = (props: CatProps) => {
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
::: 

A maioria dos componentes principais do React Native também pode ser personalizada com acessórios. Por exemplo, ao usar [`Image`](/docs/image), você passa um prop chamado [`source`](/docs/image#source) para definir qual imagem ele mostra:

```jsx [JSX Props]
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

`Image` tem [muitos adereços diferentes](/docs/image#props), incluindo [`style`](/docs/image#style), que aceita um objeto JS de pares de propriedade-valor relacionados a design e layout.

::: tip Nota
Observe as chaves duplas <span v-pre>`{{ }}`</span> ao redor da largura e altura do `style`. Em JSX, os valores JavaScript são referenciados com `{}`. Isso é útil se você estiver passando algo diferente de uma string como adereços, como um array ou número: `<Cat food={["fish", "kibble"]} age={2} />`. No entanto, objetos JS são **_também_** denotados com chaves: `{width: 200, height: 200}`. Portanto, para passar um objeto JS em JSX, você deve envolver o objeto em **outro par** de chaves: <span v-pre>`{{ width: 200, height: 200 }}`</span>
:::

Você pode construir muitas coisas com adereços e os componentes principais [`Text`](texto), [`Image`](imagem) e [`View`](view)! Mas para construir algo interativo, você precisará de estado.

## Estado

Embora você possa pensar em props como argumentos usados ​​para configurar como os componentes são renderizados, **state** é como o armazenamento de dados pessoais de um componente. O estado é útil para lidar com dados que mudam ao longo do tempo ou provenientes da interação do usuário. O estado dá memória aos seus componentes!

> Como regra geral, use props para configurar um componente quando ele for renderizado. Use o estado para acompanhar todos os dados do componente que você espera alterar ao longo do tempo.

O exemplo a seguir ocorre em um café para gatos, onde dois gatos famintos estão esperando para serem alimentados. A sua fome, que esperamos que mude com o tempo (ao contrário dos seus nomes), é armazenada como estado. Para alimentar os gatos, pressione seus botões – o que atualizará seu estado.

Você pode adicionar estado a um componente chamando o [gancho `useState` do React](https://react.dev/learn/state-a-components-memory). Um Hook é um tipo de função que permite “conectar-se” aos recursos do React. Por exemplo, `useState` é um gancho que permite adicionar estado aos componentes da função. Você pode aprender mais sobre [outros tipos de Hooks na documentação do React.](https://react.dev/reference/react)

::: code-group
```jsx [JSX State]
import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';

const Cat = props => {
  const [isHungry, setIsHungry] = useState(true);

  return (
    <View>
      <Text>
        I am {props.name}, and I am {isHungry ? 'hungry' : 'full'}!
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={isHungry ? 'Give me some food, please!' : 'Thank you!'}
      />
    </View>
  );
};

const Cafe = () => {
  return (
    <>
      <Cat name="Munkustrap" />
      <Cat name="Spot" />
    </>
  );
};

export default Cafe;
```

```tsx [TSX State]
import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';

type CatProps = {
  name: string;
};

const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);

  return (
    <View>
      <Text>
        I am {props.name}, and I am {isHungry ? 'hungry' : 'full'}!
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={isHungry ? 'Give me some food, please!' : 'Thank you!'}
      />
    </View>
  );
};

const Cafe = () => {
  return (
    <>
      <Cat name="Munkustrap" />
      <Cat name="Spot" />
    </>
  );
};

export default Cafe;
```
:::

Primeiro, você desejará importar `useState` do React assim:

```tsx
import React, {useState} from 'react';
```

Então você declara o estado do componente chamando `useState` dentro de sua função. Neste exemplo, `useState` cria uma variável de estado `isHungry`:

```tsx
const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);
  // ...
};
```

> Você pode usar `useState` para rastrear qualquer tipo de dados: strings, números, booleanos, arrays, objetos. Por exemplo, você pode monitorar o número de vezes que um gato foi acariciado com `const [timesPetted, setTimesPetted] = useState(0)`!

Chamar `useState` faz duas coisas:

- cria uma “variável de estado” com um valor inicial – neste caso a variável de estado é `isHungry` e seu valor inicial é `true`
- cria uma função para definir o valor dessa variável de estado  `setIsHungry`

Não importa quais nomes você usa. Mas pode ser útil pensar no padrão como `[<getter>, <setter>] = useState(<initialValue>)`.

Em seguida, você adiciona o componente principal [`Button`](button) e atribui a ele uma propriedade `onPress`:

```tsx
<Button
  onPress={() => {
    setIsHungry(false);
  }}
  //..
/>
```

Agora, quando alguém pressiona o botão, `onPress` será acionado, chamando `setIsHungry(false)`. Isso define a variável de estado `isHungry` como `false`. Quando `isHungry` é falso, a propriedade `disabled` do `Button` é definida como `true` e seu `title` também muda:

```tsx
<Button
  //..
  disabled={!isHungry}
  title={isHungry ? 'Give me some food, please!' : 'Thank you!'}
/>
```

> Você deve ter notado que embora `isHungry` seja um [const](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const), ele é aparentemente reatribuível! O que está acontecendo é que quando uma função de configuração de estado como `setIsHungry` é chamada, seu componente será renderizado novamente. Neste caso, a função `Cat` será executada novamente - e desta vez, `useState` nos dará o próximo valor de `isHungry`.

Finalmente, coloque seus gatos dentro de um componente `Cafe`:

```tsx
const Cafe = () => {
  return (
    <>
      <Cat name="Munkustrap" />
      <Cat name="Spot" />
    </>
  );
};
```

> Veja `<>` e `</>` acima? Esses bits de JSX são [fragmentos](https://react.dev/reference/react/Fragment). Os elementos JSX adjacentes devem ser agrupados em uma tag envolvente. Os fragmentos permitem fazer isso sem aninhar um elemento de encapsulamento extra e desnecessário, como `View`.

Agora que você cobriu os componentes principais do React e do React Native, vamos nos aprofundar em alguns desses componentes principais examinando [handling `<TextInput>`](handling-text-input).