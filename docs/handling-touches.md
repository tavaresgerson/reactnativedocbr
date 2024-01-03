# Lidando com toques
Os usuários interagem com aplicativos móveis principalmente por meio do toque. Eles podem usar uma combinação de gestos, como tocar em um botão, rolar uma lista ou ampliar um mapa. O React Native fornece componentes para lidar com todos os [tipos de gestos comuns](/docs/gesture-responder-system.md), bem como um sistema abrangente de resposta a gestos para permitir um reconhecimento de gestos mais avançado, mas o componente no qual você provavelmente estará interessado é o botão básico.

## Exibindo um botão básico
`Button` fornece um componente básico de botão que é bem renderizado em todas as plataformas. O exemplo mínimo para exibir um botão é assim:

```tsx
<Button
  onPress={() => {
    console.log('You tapped the button!');
  }}
  title="Press Me"
/>
```

Isso renderizará um rótulo azul no iOS e um retângulo arredondado azul com texto claro no Android. Pressionar o botão chamará a função "onPress", que neste caso exibe um pop-up de alerta. Se desejar, você pode especificar um adereço "color" para alterar a cor do seu botão.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/589c99ab-cfb1-4274-bdea-e1c6c630adee)

Vá em frente e brinque com o componente `Button` usando o exemplo abaixo. Você pode selecionar em qual plataforma seu aplicativo será visualizado clicando no botão de alternância no canto inferior direito e depois clicando em "Tap to Play" para visualizar o aplicativo.

```jsx
import React, {Component} from 'react';
import {Alert, Button, StyleSheet, View} from 'react-native';

export default class ButtonBasics extends Component {
  _onPressButton() {
    Alert.alert('You tapped the button!');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button onPress={this._onPressButton} title="Press Me" />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressButton}
            title="Press Me"
            color="#841584"
          />
        </View>
        <View style={styles.alternativeLayoutButtonContainer}>
          <Button onPress={this._onPressButton} title="This looks great!" />
          <Button onPress={this._onPressButton} title="OK!" color="#841584" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 20,
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/afc6df54-903b-4821-8e0d-e57a396d126f)

## Tocáveis
Se o botão básico não parecer adequado ao seu aplicativo, você poderá criar seu próprio botão usando qualquer um dos componentes "Tocáveis" fornecidos pelo React Native. Os componentes "Tocáveis" oferecem a capacidade de capturar gestos de toque e podem exibir feedback quando um gesto é reconhecido. Esses componentes não fornecem nenhum estilo padrão, portanto, você precisará trabalhar um pouco para que eles tenham uma boa aparência em seu aplicativo.

O componente "Tocável" que você usará dependerá do tipo de feedback que você deseja fornecer:

* Geralmente, você pode usar [TouchableHighlight](/docs/touchablehighlight.md) em qualquer lugar onde usaria um botão ou link na web. O fundo da visualização ficará escurecido quando o usuário pressionar o botão.
* Você pode considerar usar [TouchableNativeFeedback](/docs/touchablenativefeedback.md) no Android para exibir ondulações de reação na superfície que respondem ao toque do usuário.
* [TouchableOpacity](/docs/touchableopacity.md) pode ser usado para fornecer feedback, reduzindo a opacidade do botão, permitindo que o fundo seja visto enquanto o usuário pressiona.
* Se você precisar manipular um gesto de toque, mas não quiser que nenhum feedback seja exibido, use [TouchableWithoutFeedback](/docs/touchablewithoutfeedback.md).

Em alguns casos, você pode querer detectar quando um usuário pressiona e mantém uma visualização por um determinado período de tempo. Essas pressões longas podem ser tratadas passando uma função para os adereços `onLongPress` de qualquer um dos componentes "Tocáveis".

Vamos ver tudo isso em ação:

```jsx
import React, {Component} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default class Touchables extends Component {
  _onPressButton() {
    Alert.alert('You tapped the button!');
  }

  _onLongPressButton() {
    Alert.alert('You long-pressed the button!');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this._onPressButton} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>TouchableHighlight</Text>
          </View>
        </TouchableHighlight>
        <TouchableOpacity onPress={this._onPressButton}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>TouchableOpacity</Text>
          </View>
        </TouchableOpacity>
        <TouchableNativeFeedback
          onPress={this._onPressButton}
          background={
            Platform.OS === 'android'
              ? TouchableNativeFeedback.SelectableBackground()
              : undefined
          }>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              TouchableNativeFeedback{' '}
              {Platform.OS !== 'android' ? '(Android only)' : ''}
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableWithoutFeedback onPress={this._onPressButton}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>TouchableWithoutFeedback</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableHighlight
          onPress={this._onPressButton}
          onLongPress={this._onLongPressButton}
          underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>Touchable with Long Press</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
});
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/b6bcc0f9-8745-4ead-ac9b-98a7cf92ef38)

## Rolar e deslizar
Os gestos comumente usados em dispositivos com telas tocáveis incluem deslizar e movimentar. Eles permitem que o usuário role por uma lista de itens ou percorra páginas de conteúdo. Para estes, verifique o componente [ScrollView Core](/docs/scrollview.md).

## Problemas conhecidos
* [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162): A área de toque nunca ultrapassa os limites da visualização pai e no Android a margem negativa não é suportada.
