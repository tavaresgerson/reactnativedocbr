# Construção para dispositivos de TV

O suporte a dispositivos de TV foi implementado com a intenção de fazer com que os aplicativos React Native existentes funcionem na Apple TV e Android TV, com poucas ou nenhuma alteração necessária no código JavaScript dos aplicativos.

## Android TV

### Mudanças de compilação

* _Camada nativa_: para executar o projeto React Native na Android TV, certifique-se de fazer as seguintes alterações em `AndroidManifest.xml`:

```xml
  <!-- Adicione uma imagem de banner personalizada para exibir como ícone do iniciador do Android TV -->
 <application
  ...
  android:banner="@drawable/tv_banner"
  >
    ...
    <intent-filter>
      ...
      <!-- Necessário para criar corretamente uma intenção de lançamento ao executar no Android TV -->
      <category android:name="android.intent.category.LEANBACK_LAUNCHER"/>
    </intent-filter>
    ...
  </application>
```

* _Camada JavaScript_: suporte para Android TV foi adicionado a `Platform.android.js`. Você pode verificar se o código está sendo executado na Android TV fazendo:

```jsx
const Platform = require('Platform');
const running_on_android_tv = Platform.isTV;
```

### Mudanças de código
* _Acesso a controles touchs_: ao executar no Android TV, a estrutura do Android aplicará automaticamente um esquema de navegação direcional com base na posição relativa dos elementos focáveis em suas visualizações. O mixin `Touchable` tem código adicionado para detectar mudanças de foco e usar métodos existentes para estilizar os componentes corretamente e iniciar as ações adequadas quando a visualização é selecionada usando o controle remoto da TV, então `TouchableWithoutFeedback`, `TouchableHighlight`, `TouchableOpacity` e `TouchableNativeFeedback` funcionarão conforme esperado. Em particular:
  * `onFocus` será executado quando a visualização tocável entrar em foco
  * onBlur será executado quando a visualização tocável ficar fora de foco
  * onPress será executado quando a visualização tocável for realmente selecionada pressionando o botão "selecionar" no controle remoto da TV.

* _Entrada de controle remoto/teclado de TV_: uma nova classe nativa, `ReactAndroidTVRootViewHelper`, configura manipuladores de eventos importantes para eventos remotos de TV. Quando ocorrem eventos remotos de TV, esta classe dispara um evento JS. Este evento será captado por instâncias do objeto JavaScript TVEventHandler. O código do aplicativo que precisa implementar o tratamento personalizado de eventos remotos de TV pode criar uma instância de `TVEventHandler` e escutar esses eventos, como no código a seguir:

```js
const TVEventHandler = require('TVEventHandler');

class Game2048 extends React.Component {
  _tvEventHandler: any;

  _enableTVEventHandler() {
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, function (cmp, evt) {
      if (evt && evt.eventType === 'right') {
        cmp.setState({board: cmp.state.board.move(2)});
      } else if (evt && evt.eventType === 'up') {
        cmp.setState({board: cmp.state.board.move(1)});
      } else if (evt && evt.eventType === 'left') {
        cmp.setState({board: cmp.state.board.move(0)});
      } else if (evt && evt.eventType === 'down') {
        cmp.setState({board: cmp.state.board.move(3)});
      } else if (evt && evt.eventType === 'playPause') {
        cmp.restartGame();
      }
    });
  }

  _disableTVEventHandler() {
    if (this._tvEventHandler) {
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  }

  componentDidMount() {
    this._enableTVEventHandler();
  }

  componentWillUnmount() {
    this._disableTVEventHandler();
  }
}
```

* _Suporte ao Dev Menu_: No emulador, `cmd-M` abrirá o Dev Menu, semelhante ao Android. Para acessá-lo em um dispositivo Android TV real, pressione o botão de menu ou pressione longamente o botão de avanço rápido no controle remoto. (Por favor, não agite o dispositivo Android TV, isso não funcionará :))

Problemas conhecidos:
* Os componentes `TextInput` não funcionam por enquanto (ou seja, eles não podem receber o foco automaticamente, [veja este comentário](https://github.com/facebook/react-native/pull/16500#issuecomment-629285638)).
  * No entanto, é possível usar um ref para acionar manualmente `inputRef.current.focus()`.
  * Você pode agrupar sua entrada dentro de um componente `TouchableWithoutFeedback` e acionar o foco no evento `onFocus` desse touch. Isto permite abrir o teclado através das teclas de seta.
  * O teclado pode redefinir seu estado após cada pressionamento de tecla (isso só pode acontecer dentro do emulador do Android TV).
* O conteúdo dos componentes `Modal` não pode receber foco, consulte este [comentário](https://github.com/facebook/react-native/issues/24448) para obter detalhes.

## tvOS

> Descontinuada. Em vez disso, use [react-native-tvos](https://github.com/react-native-community/react-native-tvos). Para obter detalhes, verifique a postagem do blog da [versão 0.62](https://reactnative.dev/blog/#moving-apple-tv-to-react-native-tvos).

### Alterações de compilação

* _Camada nativa_: todos os projetos React Native Xcode agora têm alvos de construção da Apple TV, com nomes terminando na string `'-tvOS'`.
* _react-native init_: Novos projetos React Native criados com `react-native init` terão o destino Apple TV criado automaticamente em seus projetos XCode.
* _Camada JavaScript_: suporte para Apple TV foi adicionado a `Platform.ios.js`. Você pode verificar se o código está sendo executado na AppleTV fazendo

```js
const Platform = require('Platform');
const running_on_tv = Platform.isTV;

// Se você quiser ser mais específico e detectar apenas dispositivos rodando tvOS
// (mas sem dispositivos Android TV) você pode usar:
const running_on_apple_tv = Platform.isTVOS;
``` 

### Mudanças de código
* _Suporte geral para tvOS_: alterações específicas da Apple TV no código nativo são todas agrupadas pela definição `TARGET_OS_TV`. Isso inclui alterações para suprimir APIs que não são suportadas no tvOS (por exemplo, visualizações da web, controles deslizantes, interruptores, barra de status, etc.) e alterações para oferecer suporte à entrada do usuário a partir do controle remoto ou teclado da TV.

* _Base de código comum_: como tvOS e iOS compartilham a maior parte do código Objective-C e JavaScript em comum, a maior parte da documentação para iOS se aplica igualmente ao tvOS.

* Acesso a controles touch: Ao executar no Apple TV, a classe de visualização nativa é `RCTTVView`, que possui métodos adicionais para fazer uso do mecanismo de foco tvOS. O mixin `Touchable` tem código adicionado para detectar mudanças de foco e usar métodos existentes para estilizar os componentes corretamente e iniciar as ações adequadas quando a visualização é selecionada usando o controle remoto da TV, então `TouchableWithoutFeedback`, `TouchableHighlight` e `TouchableOpacity` funcionarão conforme esperado. Em particular:
  * onFocus será executado quando a visualização tocável entrar em foco
  * onBlur será executado quando a visualização tocável ficar fora de foco
  * onPress será executado quando a visualização tocável for realmente selecionada pressionando o botão "selecionar" no controle remoto da TV.

* _Entrada de controle remoto/teclado de TV_: uma nova classe nativa, `RCTTVRemoteHandler`, configura reconhecedores de gestos para eventos remotos de TV. Quando ocorrem eventos remotos de TV, esta classe dispara notificações que são captadas por `RCTTVNavigationEventEmitter` (uma subclasse de `RCTEventEmitter`), que dispara um evento JS. Este evento será captado por instâncias do objeto `JavaScript TVEventHandler`. O código do aplicativo que precisa implementar o tratamento personalizado de eventos remotos de TV pode criar uma instância de `TVEventHandler` e escutar esses eventos, como no código a seguir:

```js
const TVEventHandler = require('TVEventHandler');

class Game2048 extends React.Component {
  _tvEventHandler: any;

  _enableTVEventHandler() {
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, function (cmp, evt) {
      if (evt && evt.eventType === 'right') {
        cmp.setState({board: cmp.state.board.move(2)});
      } else if (evt && evt.eventType === 'up') {
        cmp.setState({board: cmp.state.board.move(1)});
      } else if (evt && evt.eventType === 'left') {
        cmp.setState({board: cmp.state.board.move(0)});
      } else if (evt && evt.eventType === 'down') {
        cmp.setState({board: cmp.state.board.move(3)});
      } else if (evt && evt.eventType === 'playPause') {
        cmp.restartGame();
      }
    });
  }

  _disableTVEventHandler() {
    if (this._tvEventHandler) {
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  }

  componentDidMount() {
    this._enableTVEventHandler();
  }

  componentWillUnmount() {
    this._disableTVEventHandler();
  }
}
```

* _Suporte ao Dev Menu_: No simulador, cmd-D abrirá o Dev Menu, semelhante ao iOS. Para acessá-lo em um dispositivo Apple TV real, pressione longamente o botão reproduzir/pausar no controle remoto. (Por favor, não agite o dispositivo Apple TV, isso não funcionará :))

* Animações remotas de TV: o código nativo RCTTVView implementa animações de paralaxe recomendadas pela Apple para ajudar a guiar o olho enquanto o usuário navega pelas visualizações. As animações podem ser desativadas ou ajustadas com novas propriedades de visualização opcionais.

* _Navegação de retorno com o botão de menu do controle remoto da TV_: o componente `BackHandler`, originalmente escrito para oferecer suporte ao botão de retorno do Android, agora também oferece suporte à navegação de retorno na Apple TV usando o botão de menu no controle remoto da TV.

* `Comportamento do TabBarIOS`: o componente `TabBarIOS` envolve a API UITabBar nativa, que funciona de maneira diferente no Apple TV. Para evitar a nova renderização instável da barra de guias no tvOS (consulte esta [issue](https://github.com/facebook/react-native/issues/15081)), o item selecionado da barra de guias só pode ser definido a partir de JavaScript na renderização inicial e é controlado depois disso pelo usuário por meio de código nativo.

* Problemas conhecidos:
  * Rolagem `ListView`. O problema pode ser contornado definindo `removeClippedSubviews` como `false` em `ListView` e componentes semelhantes. Para mais discussão sobre este assunto, consulte [este PR](https://github.com/facebook/react-native/pull/12944).

