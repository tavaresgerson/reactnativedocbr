# Usando um ScrollView

O ScrollView é um contêiner de rolagem genérico que pode conter vários componentes e visualizações. Os itens roláveis podem ser heterogêneos e você pode rolar vertical e horizontalmente (definindo a propriedade horizontal).

Este exemplo cria um ScrollView vertical com imagens e texto misturados.

```jsx
import React from 'react';
import {Image, ScrollView, Text} from 'react-native';

const logo = {
  uri: 'https://reactnative.dev/img/tiny_logo.png',
  width: 64,
  height: 64,
};

const App = () => (
  <ScrollView>
    <Text style={{fontSize: 96}}>Scroll me plz</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>If you like</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>Scrolling down</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>What's the best</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 96}}>Framework around?</Text>
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Image source={logo} />
    <Text style={{fontSize: 80}}>React Native</Text>
  </ScrollView>
);

export default App;
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/9a572128-d25f-40e3-a92a-882e144351b6)

ScrollViews pode ser configurado para permitir a paginação através de visualizações usando gestos de deslizar com os props `pagingEnabled`. Deslizar horizontalmente entre visualizações também pode ser implementado no Android usando o componente [`ViewPager`](https://github.com/react-native-community/react-native-viewpager).

No iOS, um `ScrollView` com um único item pode ser usado para permitir ao usuário ampliar o conteúdo. Configure os props `maximumZoomScale` e `minimumZoomScale` e seu usuário poderá usar gestos de pinçar e expandir para aumentar e diminuir o zoom.

O `ScrollView` funciona melhor para apresentar um pequeno número de coisas de tamanho limitado. Todos os elementos e visualizações de um `ScrollView` são renderizados, mesmo que não sejam mostrados na tela no momento. Se você tiver uma longa lista de itens que não cabem na tela, você deve usar uma `FlatList`. Então, vamos aprender sobre as [visualizações de lista](/docs/using-a-listview.md) a seguir.
