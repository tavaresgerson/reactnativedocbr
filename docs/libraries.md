# Usando bibliotecas
React Native fornece um conjunto de [componentes principais e APIs integrados](/docs/components-and-apis.md), prontos para uso em seu aplicativo. Você não está limitado aos componentes e APIs incluídos no React Native. React Native tem uma comunidade de milhares de desenvolvedores. Se os componentes principais e as APIs não tiverem o que você procura, você poderá encontrar e instalar uma biblioteca da comunidade para adicionar a funcionalidade ao seu aplicativo.

## Selecionando um gerenciador de pacotes
As bibliotecas React Native são normalmente instaladas a partir do [npm](https://www.npmjs.com/) usando um gerenciador de pacotes Node.js, como [npm CLI](https://docs.npmjs.com/cli/npm) ou [Yarn Classic](https://classic.yarnpkg.com/en/).

Se você tiver o Node.js instalado em seu computador, então você já tem a CLI npm instalada. Alguns desenvolvedores preferem usar o Yarn Classic para tempos de instalação um pouco mais rápidos e recursos avançados adicionais, como Workspaces. Ambas as ferramentas funcionam muito bem com React Native. Assumiremos o npm no restante deste guia para simplificar a explicação.

> 💡 Os termos “biblioteca” e “pacote” são usados indistintamente na comunidade JavaScript.

### Instalando uma biblioteca
Para instalar uma biblioteca em seu projeto, navegue até o diretório do projeto em seu terminal e execute o comando de instalação. Vamos tentar isso com `react-native-webview`:

```
npm install react-native-webview
# ou
yarn add react-native-webview
```

A biblioteca que instalamos inclui código nativo e precisamos vincular ao nosso aplicativo antes de usá-lo.

## Vinculando código nativo no iOS
React Native usa CocoaPods para gerenciar dependências de projetos iOS e a maioria das bibliotecas React Native seguem esta mesma convenção. Se uma biblioteca que você está usando não tiver, consulte o README para obter instruções adicionais. Na maioria dos casos, as instruções a seguir serão aplicadas.

Execute `pod install` em nosso diretório `ios` para vinculá-lo ao nosso projeto iOS nativo. Um atalho para fazer isso sem mudar para o diretório `ios` é executar `npx pod-install`.

```
npx pod-install
```

Quando isso estiver concluído, reconstrua o binário do aplicativo para começar a usar sua nova biblioteca:

```
npm run ios
# ou
yarn ios
```

## Vinculando código nativo no Android
React Native usa Gradle para gerenciar dependências de projetos Android. Depois de instalar uma biblioteca com dependências nativas, você precisará reconstruir o binário do aplicativo para usar sua nova biblioteca:

```
npm run android
# ou
yarn android
```

## Encontrando Bibliotecas
[React Native Directory](https://reactnative.directory/) é um banco de dados pesquisável de bibliotecas construídas especificamente para React Native. Este é o primeiro lugar para procurar uma biblioteca para seu aplicativo React Native.

Muitas das bibliotecas que você encontrará no diretório são da [React Native Community](https://github.com/react-native-community/) ou [Expo](https://docs.expo.dev/versions/latest/).

As bibliotecas construídas pela comunidade React Native são dirigidas por voluntários e indivíduos em empresas que dependem do React Native. Eles geralmente oferecem suporte a iOS, tvOS, Android, Windows, mas isso varia entre os projetos. Muitas das bibliotecas nesta organização já foram componentes principais e APIs do React Native.

As bibliotecas criadas pela Expo são todas escritas em TypeScript e suportam iOS, Android e `react-native-web` sempre que possível.

Depois do React Native Directory, o [registro npm](https://www.npmjs.com/) é o próximo melhor lugar se você não conseguir encontrar uma biblioteca específica para React Native. O registro npm é a fonte definitiva para bibliotecas JavaScript, mas as bibliotecas listadas podem não ser todas compatíveis com React Native. React Native é um dos muitos ambientes de programação JavaScript, incluindo Node.js, navegadores da web, Electron e muito mais, e o npm inclui bibliotecas que funcionam para todos esses ambientes.

## Determinando a compatibilidade da biblioteca

### Funciona com React Native?
Normalmente, bibliotecas construídas especificamente para outras plataformas não funcionarão com React Native. Os exemplos incluem `react-select`, que é desenvolvido para a web e tem como alvo específico o `react-dom`, e `rimraf`, que é desenvolvido para Node.js e interage com o sistema de arquivos do seu computador. Outras bibliotecas como a `lodash` usam apenas recursos da linguagem JavaScript e funcionam em qualquer ambiente. Você entenderá isso com o tempo, mas até então a maneira mais fácil de descobrir é tentar você mesmo. Você pode remover pacotes usando `npm uninstall` se descobrir que ele não funciona no React Native.

### Funciona nas plataformas suportadas pelo meu aplicativo?
[React Native Directory](https://reactnative.directory/) permite filtrar por compatibilidade de plataforma, como iOS, Android, Web e Windows. Se a biblioteca que você gostaria de usar não estiver listada lá, consulte o README da biblioteca para saber mais.

### Funciona com a versão do meu aplicativo React Native?
A versão mais recente de uma biblioteca normalmente é compatível com a versão mais recente do React Native. Se você estiver usando uma versão mais antiga, consulte o README para saber qual versão da biblioteca deve instalar. Você pode instalar uma versão específica da biblioteca executando `npm install <library-name>@<version-number>`, por exemplo: `npm install @react-native-community/netinfo@^2.0.0`.
