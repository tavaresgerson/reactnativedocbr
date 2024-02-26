# Noções básicas de depuração

## Acessando o menu de desenvolvimento
React Native fornece um menu de desenvolvedor no aplicativo que oferece várias opções de depuração. Você pode acessar o Menu Dev agitando seu dispositivo ou por meio de atalhos de teclado:

* Simulador iOS: Cmd ⌘ + D (ou Dispositivo > Agitar)
* Emuladores Android: Cmd ⌘ + M (macOS) ou Ctrl + M (Windows e Linux)

Alternativamente, para dispositivos e emuladores Android, você pode executar `adb shell input keyevent 82` em seu terminal.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/c4514d57-633d-48d7-acd8-85b15c785dee)

> **OBSERVAÇÃO**
> O menu Dev está desabilitado em compilações de lançamento (produção).

## LogBox
Erros e avisos em builds de desenvolvimento são exibidos no LogBox dentro do seu aplicativo.

> **OBSERVAÇÃO**
> LogBox está desabilitado em compilações de lançamento (produção).

### Erros e avisos do console
Os erros e avisos do console são exibidos como notificações na tela com um emblema vermelho ou amarelo e o número de erros ou avisos no console, respectivamente. Para visualizar um erro ou avisos do console, toque na notificação para visualizar as informações em tela cheia sobre o log e para paginar todos os logs no console.

Essas notificações podem ser ocultadas usando `LogBox.ignoreAllLogs()`. Isso é útil ao fazer demonstrações de produtos, por exemplo. Além disso, as notificações podem ser ocultadas por log por meio de `LogBox.ignoreLogs()`. Isto é útil quando há um aviso frequente que não pode ser corrigido, como aqueles em uma dependência de terceiros.

> **INFORMAÇÕES**
> Ignore os logs como último recurso e crie uma tarefa para corrigir quaisquer logs que sejam ignorados.

```jsx
import {LogBox} from 'react-native';

// Ignorar notificação de log por mensagem:
LogBox.ignoreLogs(['Warning: ...']);

// Ignore todas as notificações de log:
LogBox.ignoreAllLogs();
```

### Erros não tratados
Erros de JavaScript não tratados, marcado como `undefined is not a function`, abrirão automaticamente um erro LogBox em tela inteira com a origem do erro. Esses erros são dispensáveis e minimizáveis para que você possa ver o estado do seu aplicativo quando esses erros ocorrem, mas sempre devem ser resolvidos.

### Erros de sintaxe
Quando ocorre um erro de sintaxe, o erro LogBox em tela cheia será aberto automaticamente com o rastreamento de pilha e a localização do erro de sintaxe. Este erro não pode ser descartado porque representa uma execução inválida de JavaScript que deve ser corrigida antes de continuar com seu aplicativo. Para descartar esses erros, corrija o erro de sintaxe e salve para descartar automaticamente (com Atualização Rápida habilitada) ou Cmd ⌘/Ctrl + R para recarregar (com Atualização Rápida desabilitada).

## Ferramentas para desenvolvedores do Chrome
Para depurar o código JavaScript no Chrome, selecione "Open Debugger" no menu Dev. Isso abrirá uma nova guia em `http://localhost:8081/debugger-ui`.

A partir daqui, selecione `More Tools → Developer Tools` no menu do Chrome para abrir o [Chrome DevTools](https://developer.chrome.com/devtools). Alternativamente, você pode usar o atalho ⌥ Option + Cmd ⌘ + I (macOS) / Ctrl + Shift + I (Windows e Linux).

* Se você é novo no Chrome DevTools, recomendamos aprender sobre as guias [Console](https://developer.chrome.com/docs/devtools/#console) e [Fontes](https://developer.chrome.com/docs/devtools/#sources) nos documentos.
* Você pode querer habilitar [Pause on Caught Exceptions](https://developer.chrome.com/docs/devtools/javascript/breakpoints/#exceptions) para uma melhor experiência de depuração.

> **INFORMAÇÕES**
> A extensão React Developer Tools Chrome não funciona com React Native, mas você pode usar sua versão independente. Leia [esta seção](/docs/react-devtools.md) para saber como.

> **OBSERVAÇÃO**
> No Android, se os tempos entre o depurador e o dispositivo variarem, coisas como animações e comportamento de eventos poderão não funcionar corretamente. Isso pode ser corrigido executando `adb shell "date `date +%m%d%H%M%Y.%S%3N`"`. O acesso root é necessário se estiver usando um dispositivo físico.

### Depuração em um dispositivo físico

> **INFORMAÇÕES**
> Se você estiver usando Expo CLI, isso já está configurado para você.

## Android

Em dispositivos Android 5.0+ conectados via USB, você pode usar a ferramenta de linha de comando adb para configurar o encaminhamento de porta do dispositivo para o seu computador:

```
adb reverse tcp:8081 tcp:8081
```

Como alternativa, selecione “Configurações” no menu Dev e atualize a configuração “Host do servidor de depuração para dispositivo” para corresponder ao endereço IP do seu computador.

## iOS
Em dispositivos iOS, abra o arquivo [RCTWebSocketExecutor.mm](https://github.com/facebook/react-native/blob/master/packages/react-native/React/CoreModules/RCTWebSocketExecutor.mm) e altere "localhost" para o endereço IP do seu computador e selecione "Debug JS Remotely" no menu Dev.

> **OBSERVAÇÃO**
> Se você tiver algum problema, pode ser que uma de suas extensões do Chrome esteja interagindo de maneira inesperada com o depurador. Tente desabilitar todas as suas extensões e reativá-las uma por uma até encontrar a extensão problemática.

> **Avançado: depuração usando um depurador JavaScript personalizado**
> Para usar um depurador JavaScript personalizado no lugar das Ferramentas de desenvolvedor do Chrome, defina a variável de ambiente `REACT_DEBUGGER` como um comando que iniciará seu depurador personalizado. Você pode então selecionar "Open Debugger" no menu Dev para iniciar a depuração.
>
> O depurador receberá uma lista de todas as raízes do projeto, separadas por um espaço. Por exemplo, se você definir `REACT_DEBUGGER="node /path/to/launchDebugger.js --port 2345 --type ReactNative"`, então o comando `node /path/to/launchDebugger.js --port 2345 --type ReactNative /path/to/reactNative/app` será usado para iniciar seu depurador.

> > **OBSERVAÇÃO**
> > Os comandos do depurador personalizado executados dessa maneira devem ser processos de curta duração e não devem produzir mais de 200 kilobytes de saída.

### Ferramentas para desenvolvedores Safari
Você pode usar o Safari para depurar a versão iOS do seu aplicativo sem precisar ativar "Depurar JS remotamente".

* Em um dispositivo físico, vá para: `Settings → Safari → Advanced → Make sure "Web Inspector" is turned on` (esta etapa não é necessária no Simulador)
* No seu Mac, ative o menu Desenvolver no Safari: `Settings... (or Preferences...) → Advanced → Select "Show Develop menu in menu bar"`
* Selecione o JSContext do seu aplicativo: `Develop → Simulator (or other device) → JSContext`
* O Web Inspector do Safari deve abrir, contendo um console e um depurador

Embora os mapas de origem possam não estar habilitados por padrão, você pode seguir [este guia](http://blog.nparashuram.com/2019/10/debugging-react-native-ios-apps-with.html) ou [vídeo](https://www.youtube.com/watch?v=GrGqIIz51k4) para habilitá-los e definir pontos de interrupção nos locais certos no código-fonte.

No entanto, sempre que o aplicativo é recarregado (usando recarregamento ao vivo ou recarregando manualmente), um novo JSContext é criado. Escolher "Mostrar automaticamente inspetores da Web para JSContexts" evita que você tenha que selecionar manualmente o JSContext mais recente.

### Monitor de desempenho
Você pode ativar uma sobreposição de desempenho para ajudá-lo a depurar problemas de desempenho selecionando "Perf Monitor" no menu Dev.
