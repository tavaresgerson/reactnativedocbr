# iOS (Objective-C)

## Conceitos chave

Os segredos para integrar componentes React Native em seu aplicativo iOS são:

1. Configure as dependências e a estrutura de diretórios do React Native.
2. Entenda quais componentes do React Native você usará em seu aplicativo.
3. Adicione esses componentes como dependências usando CocoaPods.
4.Desenvolva seus componentes React Native em JavaScript.
5. Adicione um `RTRRootView` ao seu aplicativo iOS. Esta visualização servirá como contêiner para seu componente React Native.
6. Inicie o servidor React Native e execute seu aplicativo nativo.
7. Verifique se o aspecto React Native do seu aplicativo funciona conforme o esperado.

## Pré-requisitos

Siga o início rápido do React Native CLI no [guia de configuração do ambiente](/docs/environment-setup.md) para configurar seu ambiente de desenvolvimento para construir aplicativos React Native para iOS.

### 1. Configure a estrutura de diretórios
Para garantir uma experiência tranquila, crie uma nova pasta para seu projeto React Native integrado e copie seu projeto iOS existente para uma subpasta `/ios`.

### 2. Instale dependências JavaScript
Vá para o diretório raiz do seu projeto e crie um novo arquivo `package.json` com o seguinte conteúdo:

```json
{
  "name": "MyReactNativeApp",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "yarn react-native start"
  }
}
```

Em seguida, certifique-se de ter [instalado o gerenciador de pacotes Yarn](https://yarnpkg.com/lang/en/docs/install/).

Instale os pacotes `react` e `react-native`. Abra um terminal ou prompt de comando, navegue até o diretório com seu arquivo `package.json` e execute:

::: code-group
```bash [npm]
npm install react-native
```
```bash [yarn]
yarn add react-native
```
:::

Isso imprimirá uma mensagem semelhante à seguinte (role para cima na saída do fio para vê-la):

```
warning "react-native@0.52.2" has unmet peer dependency "react@16.2.0".
```

Tudo bem, significa que também precisamos instalar o React:

::: code-group
```bash [npm]
npm install react@version_printed_above
```
```bash [yarn]
yarn add react@version_printed_above
```
:::

O processo de instalação criou uma nova pasta `/node_modules`. Esta pasta armazena todas as dependências JavaScript necessárias para construir seu projeto.

Adicione `node_modules/` ao seu arquivo `.gitignore`.

### 3. Instale CocoaPods
[CocoaPods](https://cocoapods.org/) é uma ferramenta de gerenciamento de pacotes para desenvolvimento iOS e macOS. Nós o usamos para adicionar o código da estrutura React Native localmente ao seu projeto atual.

Recomendamos instalar CocoaPods usando [Homebrew](https://brew.sh/).

```
brew install cocoapods
```

::: info Nota
É tecnicamente possível não usar CocoaPods, mas isso exigiria adições manuais de biblioteca e vinculador que complicariam excessivamente esse processo.
:::

## Adicionando React Native ao seu aplicativo

Suponha que o aplicativo para integração seja [um jogo de 2048](https://github.com/JoelMarcey/iOS-2048). Esta é a aparência do menu principal do aplicativo nativo sem o React Native.

![image](/docs/assets/290205035-be5d7e97-b86c-4a0f-94d3-673886cc49a3.png)

## Ferramentas de linha de comando para Xcode

Instale as ferramentas de linha de comando. Escolha **Settings...** (ou **Preferences...**) no menu do Xcode. Vá para o painel Locais e instale as ferramentas selecionando a versão mais recente no menu suspenso Ferramentas de linha de comando.

![image](/docs/assets/290205319-78f78d6b-73ef-4e46-8ab7-ce74064bd2dc.png)

## Configurando dependências do CocoaPods

Antes de integrar o React Native ao seu aplicativo, você desejará decidir quais partes da estrutura React Native você gostaria de integrar. Usaremos CocoaPods para especificar de quais dessas "subespecificações" seu aplicativo dependerá.

A lista de subespecificações suportadas está disponível em [`/node_modules/react-native/React.podspec`](https://github.com/facebook/react-native/blob/main/packages/react-native/React.podspec). Eles geralmente são nomeados por funcionalidade. Por exemplo, geralmente você sempre desejará a subespecificação `Core`. Isso lhe dará o `AppRegistry`, `StyleSheet`, `View` e outras bibliotecas principais do React Native. Se você deseja adicionar a biblioteca React Native `Text` (por exemplo, para elementos `<Text>` ), você precisará da subespecificação `RCTText`. Se você quiser a biblioteca de imagens (por exemplo, para elementos `<Image>` ), precisará da subespecificação `RCTImage`.

Você pode especificar de quais subespecificações seu aplicativo dependerá em um arquivo `Podfile`. A maneira mais fácil de criar um `Podfile` é executando o comando `init` do CocoaPods na subpasta `/ios` do seu projeto: 

```bash
pod init
```

O `Podfile` conterá uma configuração padrão que você ajustará para fins de integração.

::: info **Nota**
A versão do 'Podfile` muda dependendo da sua versão do `react-native`. Consulte [https://react-native-community.github.io/upgrade-helper/](https://react-native-community.github.io/upgrade-helper/) para a versão específica do `Podfile` que você deve usar.
:::

No final das contas, seu `Podfile` deve ser semelhante a isto:

```
# The target name is most likely the name of your project.
target 'NumberTileGame' do

  # Your 'node_modules' directory is probably in the root of your project,
  # but if not, adjust the `:path` accordingly
  pod 'FBLazyVector', :path => "../node_modules/react-native/Libraries/FBLazyVector"
  pod 'FBReactNativeSpec', :path => "../node_modules/react-native/Libraries/FBReactNativeSpec"
  pod 'RCTRequired', :path => "../node_modules/react-native/Libraries/RCTRequired"
  pod 'RCTTypeSafety', :path => "../node_modules/react-native/Libraries/TypeSafety"
  pod 'React', :path => '../node_modules/react-native/'
  pod 'React-Core', :path => '../node_modules/react-native/'
  pod 'React-CoreModules', :path => '../node_modules/react-native/React/CoreModules'
  pod 'React-Core/DevSupport', :path => '../node_modules/react-native/'
  pod 'React-RCTActionSheet', :path => '../node_modules/react-native/Libraries/ActionSheetIOS'
  pod 'React-RCTAnimation', :path => '../node_modules/react-native/Libraries/NativeAnimation'
  pod 'React-RCTBlob', :path => '../node_modules/react-native/Libraries/Blob'
  pod 'React-RCTImage', :path => '../node_modules/react-native/Libraries/Image'
  pod 'React-RCTLinking', :path => '../node_modules/react-native/Libraries/LinkingIOS'
  pod 'React-RCTNetwork', :path => '../node_modules/react-native/Libraries/Network'
  pod 'React-RCTSettings', :path => '../node_modules/react-native/Libraries/Settings'
  pod 'React-RCTText', :path => '../node_modules/react-native/Libraries/Text'
  pod 'React-RCTVibration', :path => '../node_modules/react-native/Libraries/Vibration'
  pod 'React-Core/RCTWebSocket', :path => '../node_modules/react-native/'

  pod 'React-cxxreact', :path => '../node_modules/react-native/ReactCommon/cxxreact'
  pod 'React-jsi', :path => '../node_modules/react-native/ReactCommon/jsi'
  pod 'React-jsiexecutor', :path => '../node_modules/react-native/ReactCommon/jsiexecutor'
  pod 'React-jsinspector', :path => '../node_modules/react-native/ReactCommon/jsinspector'
  pod 'ReactCommon/callinvoker', :path => "../node_modules/react-native/ReactCommon"
  pod 'ReactCommon/turbomodule/core', :path => "../node_modules/react-native/ReactCommon"
  pod 'Yoga', :path => '../node_modules/react-native/ReactCommon/yoga'

  pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
  pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec'
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'

end
```

Depois de criar seu `Podfile`, você estará pronto para instalar o pod React Native.

```bash
pod install
```

Você deverá ver resultados como:

```
Analyzing dependencies
Fetching podspec for `React` from `../node_modules/react-native`
Downloading dependencies
Installing React (0.62.0)
Generating Pods project
Integrating client project
Sending stats
Pod installation complete! There are 3 dependencies from the Podfile and 1 total pod installed.
```

::: tip Dica
Se isso falhar com erros mencionando o xcrun, certifique-se de que no Xcode em **Settings...** (or **Preferences...**) > **Locations** as Ferramentas de Linha de Comando estejam atribuídas.
:::

## Integração de código

Agora iremos modificar o aplicativo iOS nativo para integrar o React Native. Para nosso aplicativo de amostra 2048, adicionaremos uma tela "High Score" no React Native.

### O componente React Native
O primeiro código que escreveremos é o código React Native real para a nova tela "High Score" que será integrada em nosso aplicativo.

### 1. Crie um arquivo `index.js`
Primeiro, crie um arquivo `index.js` vazio na raiz do seu projeto React Native.

`index.js` é o ponto de partida para aplicativos React Native e é sempre necessário. Pode ser um arquivo pequeno que requer outro arquivo que faça parte do seu componente ou aplicativo React Native, ou pode conter todo o código necessário para ele. No nosso caso, colocaremos tudo em `index.js`.

### 2. Adicione seu código React Native
No seu `index.js`, crie seu componente. Em nosso exemplo aqui, adicionaremos um componente `<Text>` dentro de um estilo `<View>`

```jsx
import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';

const RNHighScores = ({scores}) => {
  const contents = scores.map(score => (
    <Text key={score.name}>
      {score.name}:{score.value}
      {'\n'}
    </Text>
  ));
  return (
    <View style={styles.container}>
      <Text style={styles.highScoresTitle}>
        2048 High Scores!
      </Text>
      <Text style={styles.scores}>{contents}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  highScoresTitle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  scores: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

// Nome do módulo
AppRegistry.registerComponent('RNHighScores', () => RNHighScores);
```

::: info Nota
`RNHighScores` é o nome do seu módulo que será usado quando você adicionar uma visualização ao React Native de dentro do seu aplicativo iOS.
:::

## A mágica: `RCTRootView`

Agora que seu componente React Native foi criado por meio de `index.js`, você precisa adicionar esse componente a um `ViewController` novo ou existente. O caminho mais fácil é criar opcionalmente um caminho de evento para seu componente e, em seguida, adicionar esse componente a um `ViewController` existente.

Amarraremos nosso componente React Native a uma nova visualização nativa no `ViewController` que na verdade o conterá uma chamada a `RCTRootView` .

### 1. Crie um caminho de evento
Você pode adicionar um novo link no menu principal do jogo para ir para a página “High Score” do React Native.

![image](/docs/assets/290218954-e41f72f9-dabc-4735-a4df-ab3260c30f3f.png)

### 2. Manipulador de eventos
Agora adicionaremos um manipulador de eventos no link do menu. Um método será adicionado ao `ViewController` principal da sua aplicação. É aqui que o `RTRRootView` entra em ação.

Ao construir um aplicativo React Native, você usa o empacotador Metro para criar um `index.bundle` que será servido pelo servidor React Native. Dentro de `index.bundle` estará nosso módulo `RNHighScore`. Portanto, precisamos apontar nosso `RTRRootView` para o local do recurso `index.bundle` (via `NSURL`) e vinculá-lo ao módulo.

Iremos, para fins de depuração, registrar que o manipulador de eventos foi invocado. Em seguida, criaremos uma string com a localização do nosso código React Native que existe dentro do `index.bundle`. Por fim, criaremos o `RTRRootView` principal. Observe como fornecemos `RNHighScores` como `moduleName` que criamos acima ao escrever o código para nosso componente React Native.

Primeiro `import` o cabeçalho `RTRRootView`.

```objective-c
#import <React/RCTRootView.h>
```

::: info Nota
As `initialProperties` (propriedades iniciais) estão aqui para fins ilustrativos, por isso temos alguns dados para nossa tela de pontuação mais alta. Em nosso componente React Native, usaremos `this.props` para obter acesso a esses dados.
:::

```objective-c
- (IBAction)highScoreButtonPressed:(id)sender {
    NSLog(@"High Score Button Pressed");
    NSURL *jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios"];

    RCTRootView *rootView =
      [[RCTRootView alloc] initWithBundleURL: jsCodeLocation
                                  moduleName: @"RNHighScores"
                           initialProperties:
                             @{
                               @"scores" : @[
                                 @{
                                   @"name" : @"Alex",
                                   @"value": @"42"
                                  },
                                 @{
                                   @"name" : @"Joel",
                                   @"value": @"10"
                                 }
                               ]
                             }
                               launchOptions: nil];
    UIViewController *vc = [[UIViewController alloc] init];
    vc.view = rootView;
    [self presentViewController:vc animated:YES completion:nil];
}
```

::: info Nota
Observe que o `RTRRootView initWithURL` inicia uma nova VM JSC. Para economizar recursos e simplificar a comunicação entre visualizações RN em diferentes partes do seu aplicativo nativo, você pode ter várias visualizações desenvolvidas pelo React Native associadas a um único tempo de execução JS. Para fazer isso, em vez de usar `[RCTRootView alloc] initWithURL`, use [`RCTBridge initWithBundleURL`](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTBridge.h#L94) para criar uma ponte e, em seguida, use `RCTRootView initWithBridge`.
:::

::: tip Dica
Ao mover seu aplicativo para produção, o `NSURL` pode apontar para um arquivo pré-empacotado no disco por meio de algo como `[[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];`. Você pode usar o script `react-native-xcode.sh` em `node_modules/react-native/scripts/` para gerar esse arquivo pré-empacotado.
:::

### 3. Conecte

Conecte o novo link no menu principal ao método manipulador de eventos recém-adicionado.

![image](/docs/assets/290220401-8f9b33a4-3f00-4caf-9be3-2d06a10584a5.png)

::: tip Dica
Uma das maneiras mais fáceis de fazer isso é abrir a visualização no storyboard e clicar com o botão direito no novo link. Selecione algo como o evento `Touch Up Inside`, arraste-o para o storyboard e selecione o método criado na lista fornecida.
:::

## Teste sua integração

Agora você executou todas as etapas básicas para integrar o React Native ao seu aplicativo atual. Agora iniciaremos o [empacotador Metro](https://facebook.github.io/metro/) para construir o pacote `index.bundle` e o servidor rodando em localhost para servi-lo.

### 1. Adicionar exceção de segurança de transporte de aplicativos

A Apple bloqueou o carregamento implícito de recursos HTTP em texto não criptografado. Portanto, precisamos adicionar o seguinte arquivo `Info.plist` (ou equivalente) do nosso projeto.

```
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>localhost</key>
        <dict>
            <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

::: tip Dica
O App Transport Security é bom para seus usuários. Certifique-se de reativá-lo antes de lançar seu aplicativo para produção.
:::

### 2. Execute o empacotador

Para executar seu aplicativo, primeiro você precisa iniciar o servidor de desenvolvimento. Para fazer isso, execute o seguinte comando no diretório raiz do seu projeto React Native:

::: code-group
```bash [npm]
npm start
```
```bash [yarn]
yarn start
```
:::

### 3. Execute o aplicativo

Se você estiver usando o Xcode ou seu editor favorito, crie e execute seu aplicativo iOS nativo normalmente. Alternativamente, você pode executar o aplicativo na linha de comando usando:

::: code-group
```bash [npm]
npm run ios
```
```bash [yarn]
yarn ios
```
:::

Em nosso aplicativo de exemplo, você deverá ver o link para "High Scores" e, ao clicar nele, verá a renderização do seu componente React Native.

Aqui está a tela inicial do aplicativo nativo:

![image](/docs/assets/290225173-8c00a858-3507-4de4-84e0-536c094532f8.png)

Aqui está a tela de pontuação mais alta do React Native:

![image](/docs/assets/290225251-23ad63ff-3ee2-4767-a7c0-438cc2c20ece.png)

::: info Nota
Se você estiver tendo problemas de resolução de módulo ao executar seu aplicativo, consulte [este problema do GitHub](https://github.com/facebook/react-native/issues/4968) para obter informações e possível resolução. [Este comentário parecia](https://github.com/facebook/react-native/issues/4968#issuecomment-220941717) ser a última resolução possível.
:::

## E agora?

Neste ponto, você pode continuar desenvolvendo seu aplicativo normalmente. Consulte nossos documentos de [depuração](/docs/debugging.md) e [implantação](/docs/running-on-device.md) para saber mais sobre como trabalhar com React Native.
