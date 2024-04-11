# Debug Nativo

::: info **Projetos com somente código nativo**
A seção a seguir se aplica apenas a projetos com código nativo exposto. Se você estiver usando o fluxo de trabalho gerenciado da Expo, consulte o guia sobre [pré-construção](https://docs.expo.dev/workflow/prebuild/) para usar esta API.
:::

## Acessando logs nativos

Você pode exibir os logs do console de um aplicativo iOS ou Android usando os seguintes comandos em um terminal enquanto o aplicativo está em execução:

::: code-group
```bash [Para Android]
npx react-native log-android
```
```bash [para iOS]
npx react-native log-ios
```
:::

Você também pode acessá-los por meio de **Debug > Open System Log…** no iOS Simulator ou executando `adb logcat "*:S" ReactNative:V ReactNativeJS:V` em um terminal enquanto um aplicativo Android está sendo executado em um dispositivo ou emulador.

::: info **INFORMAÇÕES**
Se você estiver usando o Expo CLI, os logs do console já aparecerão na mesma saída do terminal que o empacotador.
:::

## Depurando código nativo
Ao trabalhar com código nativo, como ao escrever módulos nativos, você pode iniciar o aplicativo no Android Studio ou Xcode e aproveitar as vantagens dos recursos de depuração nativos (configuração de pontos de interrupção etc.), como faria no caso de criar um aplicativo nativo padrão. .

Outra opção é executar seu aplicativo usando a CLI React Native e anexar o depurador nativo do IDE nativo (Android Studio ou Xcode) ao processo.

### Android Studio
No Android Studio você pode fazer isso acessando a opção "Run" na barra de menu, clicando em "Attach to Process..." e selecionando o aplicativo React Native em execução.

### Xcode
No Xcode clique em "Debug" na barra de menu superior, selecione a opção "Attach to process" e selecione o aplicativo na lista de "Likely Targets".
