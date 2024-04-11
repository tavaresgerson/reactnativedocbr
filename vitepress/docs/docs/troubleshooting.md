# Solução de problemas
Estes são alguns problemas comuns que você pode encontrar ao configurar o React Native. Se você encontrar algo que não esteja listado aqui, tente pesquisar o [problema no GitHub](https://github.com/facebook/react-native/issues/).

## Porta já em uso (Port already in use)
O empacotador Metro é executado na porta 8081. Se outro processo já estiver usando essa porta, você poderá encerrar esse processo ou alterar a porta que o empacotador usa.

### Encerrando um processo na porta 8081
Execute o seguinte comando para encontrar o ID do processo que está escutando na porta 8081:

```bash
sudo lsof -i :8081
```

Em seguida, execute o seguinte para encerrar o processo:

```bash
kill -9 <PID>
```

No Windows você pode encontrar o processo usando a porta 8081 usando o Monitor de Recursos e interrompê-lo usando o Gerenciador de Tarefas.

### Usando uma porta diferente de 8081
Você pode configurar o bundler para usar uma porta diferente de 8081 usando o parâmetro port, na raiz da execução do seu projeto:

::: code-group

```bash [npm]
npm start -- --port=8088
```

```bash [yarn]
yarn start --port 8088
```
::: 

Você também precisará atualizar seus aplicativos para carregar o pacote JavaScript da nova porta. Se estiver executando no dispositivo do Xcode, você pode fazer isso atualizando as ocorrências de 8081 para a porta escolhida no arquivo `ios/__App_Name__.xcodeproj/project.pbxproj`.

## Erro de bloqueio NPM
Se você encontrar um erro como `npm WARN locking Error: EACCES` ao usar o React Native CLI, tente executar o seguinte:

```bash
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
```

## Bibliotecas ausentes para React
Se você adicionou React Native manualmente ao seu projeto, certifique-se de ter incluído todas as dependências relevantes que está usando, como `RCTText.xcodeproj`, `RCTImage.xcodeproj`. Em seguida, os binários criados por essas dependências devem ser vinculados ao binário do seu aplicativo. Use a seção `Linked Frameworks and Binaries` nas configurações do projeto Xcode. Etapas mais detalhadas estão aqui: [Vinculando Bibliotecas](/docs/linking-libraries-ios).

Se você estiver usando CocoaPods, verifique se adicionou React junto com as subespecificações ao `Podfile`. Por exemplo, se você estivesse usando as APIs `<Text />`, `<Image />` e `fetch()`, você precisaria adicioná-las em seu `Podfile`:

```
pod 'React', :path => '../node_modules/react-native', :subspecs => [
  'RCTText',
  'RCTImage',
  'RCTNetwork',
  'RCTWebSocket',
]
```

Em seguida, certifique-se de ter executado `pod install` e de que um diretório `Pods/` tenha sido criado em seu projeto com o React instalado. CocoaPods irá instruí-lo a usar o arquivo `.xcworkspace` gerado daqui em diante para poder usar essas dependências instaladas.

### React Native não compila ao ser usado como CocoaPod
Existe um plugin CocoaPods chamado `cocoapods-fix-react-native` que lida com qualquer possível pós-correção do código-fonte devido a diferenças ao usar um gerenciador de dependências.

### Lista de argumentos muito longa: falha na expansão do cabeçalho recursivo
Nas configurações de construção do projeto, `User Search Header Paths` e `Header Search Paths` são duas configurações que especificam onde o Xcode deve procurar os arquivos de cabeçalho `#import` especificados no código. Para pods, CocoaPods usa uma matriz padrão de pastas específicas para procurar. Verifique se essa configuração específica não foi substituída e se nenhuma das pastas configuradas é muito grande. Se uma das pastas for grande, o Xcode tentará pesquisar recursivamente o diretório inteiro e gerará o erro acima em algum momento.

Para reverter as configurações de compilação dos User Search Header Paths` e `Header Search Paths` para seus padrões definidos pelo CocoaPods - selecione a entrada no painel _Build Settings_ e clique em excluir. Isso removerá a substituição personalizada e retornará aos padrões do CocoaPod.

## Não há transportes disponíveis
React Native implementa um polyfill para WebSockets. Esses [polyfills](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Core/InitializeCore.js) são inicializados como parte do módulo react-native que você inclui em seu aplicativo por meio do `import React from 'react'`. Se você carregar outro módulo que requer WebSockets, como Firebase, certifique-se de carregá-lo/solicitá-lo após o React Native:

```jsx
import React from 'react';
import Firebase from 'firebase';
```

## Exceção sem resposta do comando Shell
Se você encontrar uma exceção `ShellCommandUnresponsiveException` como:

```
Execution failed for task ':app:installDebug'.
  com.android.builder.testing.api.DeviceException: com.android.ddmlib.ShellCommandUnresponsiveException
```
Tente fazer o downgrade da sua versão do [Gradle para 1.2.3](https://github.com/facebook/react-native/issues/2720) em `android/build.gradle`.

## inicialização travada do react-native
Se você tiver problemas em que a execução do `npx react-native init` trava em seu sistema, tente executá-lo novamente no modo detalhado e consulte [#2797](https://github.com/facebook/react-native/issues/2797) para causas comuns:

```bash
npx react-native init --verbose
```

Quando você está depurando um processo ou precisa saber um pouco mais sobre o erro que está sendo gerado, você pode querer usar a opção detalhada para gerar mais logs e informações para resolver seu problema.

Execute o seguinte comando no diretório raiz do seu projeto.

##### npm

```bash
npm run android -- --verbose
```

##### yarn

```bash
yarn android --verbose
```

## Não é possível iniciar o gerenciador de pacotes react-native (no Linux)

### Caso 1: Erro "código":"ENOSPC","errno":"ENOSPC"
Problema causado pelo número de diretórios que o [`inotify`](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers) (usado pelo watchman no Linux) pode monitorar. Para resolver isso, execute este comando na janela do seu terminal:

```bash
echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

### Error: spawnSync ./gradlew EACCES
Se você tiver um problema em que a execução do `npm run android` ou `yarn android` no macOS gera o erro acima, tente executar o comando `sudo chmod +x android/gradlew` para tornar os arquivos gradlew em executáveis.
