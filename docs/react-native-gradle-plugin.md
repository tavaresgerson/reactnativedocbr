# Plug-in React Native Gradle

Este guia descreve como configurar o **Plugin React Native Gradle** (geralmente chamado de RNGP) ao criar seu aplicativo React Native para Android.

## Usando o plugin

O plugin React Native Gradle é distribuído como um pacote NPM separado que é instalado automaticamente com `react-native`.

O plugin **já está configurado** para novos projetos criados usando `npx react-native init`. Você não precisa realizar nenhuma etapa extra para instalá-lo se tiver criado seu aplicativo com este comando.

Se você estiver integrando o React Native em um projeto existente, consulte [a página correspondente](https://reactnative.dev/docs/next/integration-with-existing-apps#configuring-gradle): ela contém instruções específicas sobre como instalar o plugin.

## Configurando o plugin

Por padrão, o plugin funcionará **pronto para uso** com padrões razoáveis. Você deve consultar este guia e personalizar o comportamento somente se precisar.

Para configurar o plugin você pode modificar o bloco `react`, dentro do seu `android/app/build.gradle`:

```groovy
apply plugin: "com.facebook.react"

/**
 * Este é o bloco de configuração para personalizar seu aplicativo React Native Android.
 * Por padrão você não precisa aplicar nenhuma configuração, apenas descomente as linhas necessárias.
 */
react {
  // A configuração personalizada vai aqui.
}
```

Cada chave de configuração é descrita abaixo:

### `root`

Esta é a pasta raiz do seu projeto React Native, ou seja, onde reside o arquivo `package.json`. O padrão é `..`. Você pode personalizá-lo da seguinte maneira:

```groovy
root = file("../")
```

### `reactNativeDir`

Esta é a pasta onde reside o pacote `react-native`. O padrão é `../node_modules/react-native`.
Se você estiver em um monorepo ou usando um gerenciador de pacotes diferente, você pode usar o ajuste `reactNativeDir` para sua configuração.

Você pode personalizá-lo da seguinte maneira:

```groovy
reactNativeDir = file("../node_modules/react-native")
```

### `codegenDir`

Esta é a pasta onde reside o pacote `react-native-codegen`. O padrão é `../node_modules/react-native-codegen`.
Se você estiver em um monorepo ou usando um gerenciador de pacotes diferente, você pode ajustar `codegenDir` à sua configuração.

Você pode personalizá-lo da seguinte maneira:

```groovy
codegenDir = file("../node_modules/@react-native/codegen")
```

### `cliFile`

Este é o arquivo de ponto de entrada para o React Native CLI. O padrão é `../node_modules/react-native/cli.js`.
O arquivo do ponto de entrada é necessário porque o plug-in precisa invocar a CLI para agrupar e criar seu aplicativo.

Se você estiver em um monorepo ou usando um gerenciador de pacotes diferente, você pode ajustar o `cliFile` à sua configuração.
Você pode personalizá-lo da seguinte maneira:

```groovy
cliFile = file("../node_modules/react-native/cli.js")
```

### `debuggableVariants`

Esta é a lista de variantes que podem ser depuradas (consulte a seção _usando variantes_ disponível aqui para obter mais contexto sobre variantes).

Por padrão o plugin considera como `debuggableVariants` apenas `debug`, enquanto `release` não é. Se você tiver outra
variantes (como `staging`, `lite`, etc.), você precisará ajustar isso de acordo.

As variantes listadas como `debuggableVariants` não virão com um pacote, então você precisará do Metro para executá-las.

Você pode personalizá-lo da seguinte maneira:

```groovy
debuggableVariants = ["liteDebug", "prodDebug"]
```

### `nodeExecutableAndArgs`

Esta é a lista de comandos e argumentos do nó que devem ser invocados para todos os scripts. Por padrão é `[node]` mas pode ser personalizado para adicionar sinalizadores extras como segue:

```groovy
nodeExecutableAndArgs = ["node"]
```

### `bundleCommand`

Este é o nome do comando `bundle` a ser invocado ao criar o pacote para seu aplicativo. Isso é útil se você estiver usando [pacotes de RAM](/docs/ram-bundles-inline-requires). Por padrão é `bundle` mas pode ser personalizado para adicionar sinalizadores extras como segue:

```groovy
bundleCommand = "ram-bundle"
```

### `bundleConfig`

Este é o caminho para um arquivo de configuração que será passado para `bundle --config <file>` se fornecido. O padrão é vazio (nenhum arquivo de configuração será proibido). Mais informações sobre o agrupamento de arquivos de configuração podem ser encontradas [na documentação da CLI](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle). Pode ser personalizado da seguinte forma:

```groovy
bundleConfig = file(../rn-cli.config.js)
```

### `bundleAssetName`

Este é o nome do arquivo do pacote que deve ser gerado. O padrão é `index.android.bundle`. Pode ser personalizado da seguinte forma:

```groovy
bundleAssetName = "MyApplication.android.bundle"
```

### `entryFile`

O arquivo de entrada usado para geração de pacote configurável. O padrão é procurar por `index.android.js` ou `index.js`. Pode ser personalizado da seguinte forma:

```groovy
entryFile = file("../js/MyApplication.android.js")
```

### `extraPackagerArgs`

Uma lista de sinalizadores extras que serão passados ​​para o comando `bundle`. A lista de sinalizadores disponíveis está na [documentação da CLI](https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle). O padrão está vazio. Pode ser personalizado da seguinte forma:

```groovy
extraPackagerArgs = []
```

### `hermesCommand`

O caminho para o comando `hermesc` (o compilador Hermes). O React Native vem com uma versão do compilador Hermes, então geralmente você não precisará personalizá-lo. O plugin usará o compilador correto para o seu sistema por padrão.

### `hermesFlags`

A lista de sinalizadores a serem passados ​​para `hermesc`. Por padrão é `["-O", "-output-source-map"]`. Você pode personalizá-lo da seguinte maneira

```groovy
hermesFlags = ["-O", "-output-source-map"]
```

## Usando sabores e variantes de construção

Ao criar aplicativos Android, talvez você queira usar [variações personalizadas](https://developer.android.com/studio/build/build-variants#product-flavors) para ter versões diferentes do seu aplicativo a partir do mesmo projeto.

Consulte o [guia oficial do Android](https://developer.android.com/studio/build/build-variants) para configurar tipos de compilação personalizados (como `staging`) ou versões personalizadas (como `full`, `lite `, etc.).

Por padrão, novos aplicativos são criados com dois tipos de compilação (`debug` e `release`) e sem variações personalizadas.

A combinação de todos os tipos de compilação e todas as variações gera um conjunto de **variantes de compilação**. Por exemplo, para os tipos de compilação `debug`/`staging`/`release` e ​​`full`/`lite` você terá 6 variantes de compilação: `fullDebug`, `fullStaging`, `fullRelease` e ​​assim por diante.

Se você estiver usando variantes personalizadas além de `debug` e `release`, você precisa instruir o plugin React Native Gradle especificando quais de suas variantes são **depuráveis** usando a configuração [`debuggableVariants`](#debuggablevariants) da seguinte forma :

```diff
apply plugin: "com.facebook.react"

react {
+ debuggableVariants = ["fullStaging", "fullDebug"]
}
```

Isso é necessário porque o plugin irá ignorar o empacotamento JS para todos os `debuggableVariants`: você precisará do Metro para executá-los. Por exemplo, se você listar `fullStaging` em `debuggableVariants`, não será possível publicá-lo em uma loja, pois faltará o pacote.

## O que o plugin está fazendo nos bastidores?

O plugin React Native Gradle é responsável por configurar a construção do seu aplicativo para enviar aplicativos React Native para produção.
O plugin também é usado em bibliotecas de terceiros, para executar o [Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md) usado para a Nova Arquitetura.

Aqui está um resumo das responsabilidades do plugin:

- Adiciona uma tarefa `createBundle<Variant>JsAndAssets` para cada variante não depurável, que é responsável por invocar os comandos `bundle`, `hermesc` e `compose-source-map`.
- Configura a versão adequada da dependência `com.facebook.react:react-android` e `com.facebook.react:hermes-android`, lendo a versão React Native do `package.json` de `react-native `.
- Configura os repositórios Maven adequados (Maven Central, Google Maven Repo, repositório Maven local JSC, etc.) necessários para consumir todas as dependências Maven necessárias.
- Configura o NDK para permitir a criação de aplicativos que usam a Nova Arquitetura.
- Configura o `buildConfigFields` para que você possa saber em tempo de execução se o Hermes ou a Nova Arquitetura estão habilitados.
- Configura a porta Metro DevServer como um recurso Android para que o aplicativo saiba em qual porta se conectar.
- Invoca o [React Native Codegen](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/codegen.md) se uma biblioteca ou aplicativo estiver usando o Codegen para a nova arquitetura.
