# Código específico da plataforma

Ao criar um aplicativo multiplataforma, você desejará reutilizar o máximo de código possível. Podem surgir cenários em que faça sentido que o código seja diferente, por exemplo, você pode querer implementar componentes visuais separados para Android e iOS.

React Native oferece duas maneiras de organizar seu código e separá-lo por plataforma:

1. Usando o módulo Platform.
2. Usando extensões de arquivo específicas da plataforma.

Certos componentes podem ter propriedades que funcionam apenas em uma plataforma. Todos esses props são anotados com `@platform` e possuem um pequeno emblema próximo a eles no site.

## Módulo de plataforma
React Native fornece um módulo que detecta a plataforma na qual o aplicativo está sendo executado. Você pode usar a lógica de detecção para implementar código específico da plataforma. Use esta opção quando apenas pequenas partes de um componente forem específicas da plataforma.

```jsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```

`Platform.OS` será ios quando executado em iOS e Android quando executado em Android.

Há também um método `Platform.select` disponível, que fornece um objeto onde as chaves podem ser `'ios' | 'android' | 'native' | 'default'`, retorna o valor mais adequado para a plataforma em que você está executando atualmente. Ou seja, se você estiver rodando em um celular, as teclas iOS e Android terão preferência. Se não forem especificadas, a chave nativa será usada e depois a chave padrão.

```jsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red',
      },
      android: {
        backgroundColor: 'green',
      },
      default: {
        // outras plataformas, web por exemplo
        backgroundColor: 'blue',
      },
    }),
  },
});
```

Isso resultará em um contêiner com `flex: 1` em todas as plataformas, uma cor de fundo vermelha no iOS, uma cor de fundo verde no Android e uma cor de fundo azul em outras plataformas.

Como aceita qualquer valor, você também pode usá-lo para retornar componentes específicos da plataforma, como abaixo:

```jsx
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid'),
})();

<Component />;
```

```jsx
const Component = Platform.select({
  native: () => require('ComponentForNative'),
  default: () => require('ComponentForWeb'),
})();

<Component />;
```

### Detectando a versão do Android
No Android, o módulo `Platform` também pode ser usado para detectar a versão da plataforma Android na qual o aplicativo está sendo executado:

```jsx
import {Platform} from 'react-native';

if (Platform.Version === 25) {
  console.log('Running on Nougat!');
}
```

::: info **Observação**
A `Version` é definida como a versão da API do Android e não como a versão do sistema operacional Android. Para encontrar um mapeamento, consulte o [Histórico de versões do Android](https://en.wikipedia.org/wiki/Android_version_history#Overview).
:::

## Detectando a versão do iOS
No iOS, a `Version` é resultado de `-[UIDevice systemVersion]`, que é uma string com a versão atual do sistema operacional. Um exemplo de versão do sistema é `"10.3"`. Por exemplo, para detectar o número da versão principal no iOS:

```jsx
import {Platform} from 'react-native';

const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
  console.log('Work around a change in behavior');
}
```

## Extensões específicas da plataforma
Quando o código específico da plataforma for mais complexo, considere dividir o código em arquivos separados. O React Native detectará quando um arquivo tiver uma extensão `.ios.` ou `.android.` e carregará o arquivo de plataforma relevante quando necessário de outros componentes.

Por exemplo, digamos que você tenha os seguintes arquivos em seu projeto:

```
BigButton.ios.js
BigButton.android.js
```

Você pode então importar o componente da seguinte maneira:

```jsx
import BigButton from './BigButton';
```

O React Native selecionará automaticamente o arquivo correto com base na plataforma em execução.

## Extensões específicas nativas (ou seja, compartilhamento de código com NodeJS e Web)
Você também pode usar a extensão `.native.js` quando um módulo precisa ser compartilhado entre NodeJS/Web e React Native, mas não tem diferenças Android/iOS. Isso é especialmente útil para projetos que possuem código comum compartilhado entre React Native e ReactJS.

Por exemplo, digamos que você tenha os seguintes arquivos em seu projeto:

```
Container.js # obtido por webpack, Rollup ou qualquer outro empacotador da Web
Container.native.js # obtido pelo empacotador React Native para Android e iOS (Metro)
```

Você ainda pode importá-lo sem a extensão `.native`, da seguinte maneira:

```jsx
import Container from './Container';
```

::: tip **Dica profissional**
Configure seu web bundler para ignorar extensões `.native.js` para evitar código não utilizado em seu pacote de produção, reduzindo assim o tamanho final do pacote.
:::