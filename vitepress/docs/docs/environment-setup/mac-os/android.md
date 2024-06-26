# Android

## Instalando dependências
Você precisará do Node, do Watchman, da interface de linha de comando React Native, de um JDK e do Android Studio.

Embora você possa usar qualquer editor de sua escolha para desenvolver seu aplicativo, você precisará instalar o Android Studio para configurar as ferramentas necessárias para criar seu aplicativo React Native para Android.

## Node & Watchman
Recomendamos instalar o Node e o Watchman usando o [Homebrew](https://brew.sh/). Execute os seguintes comandos em um Terminal após instalar o Homebrew:

```bash
brew install node
brew install watchman
```

Se você já instalou o Node em seu sistema, certifique-se de que seja o Node 18 ou mais recente.

[Watchman](https://facebook.github.io/watchman) é uma ferramenta do Facebook para observar mudanças no sistema de arquivos. É altamente recomendável instalá-lo para melhor desempenho.

## kit de desenvolvimento do Java
Recomendamos instalar a distribuição OpenJDK chamada Azul **Zulu** usando [Homebrew](https://brew.sh/). Execute os seguintes comandos em um Terminal após instalar o Homebrew:

```bash
brew tap homebrew/cask-versions
brew install --cask zulu17

# Obtenha o caminho para onde o cask foi instalado para clicar duas vezes no instalador
brew info --cask zulu17
```

Depois de instalar o JDK, atualize sua variável de ambiente `JAVA_HOME`. Se você usou as etapas acima, o JDK provavelmente estará em `/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`

A distribuição Zulu OpenJDK oferece JDKs para Macs Intel e M1. Isso garantirá que suas compilações sejam mais rápidas em Macs M1 em comparação com o uso de um JDK baseado em Intel.

Se você já instalou o JDK em seu sistema, recomendamos o JDK 17. Você pode encontrar problemas ao usar versões superiores do JDK.

### 1. Instale o Android Studio
[Baixe e instale o Android Studio](https://developer.android.com/studio/index.html). No assistente de instalação do Android Studio, certifique-se de que as caixas ao lado de todos os itens a seguir estejam marcadas:

`SDK Android`
`Plataforma Android SDK`
`Dispositivo virtual Android`

Em seguida, clique em "Next" para instalar todos esses componentes.

::: info Nota
Se as caixas de seleção estiverem esmaecidas, você terá a chance de instalar esses componentes mais tarde.
:::

Depois que a configuração for finalizada e a tela de boas-vindas for exibida, prossiga para a próxima etapa.

### 2. Instale o Android SDK
O Android Studio instala o Android SDK mais recente por padrão. Construir um aplicativo React Native com código nativo, no entanto, requer o SDK do `Android 13 (Tiramisu)` em particular. SDKs Android adicionais podem ser instalados por meio do SDK Manager no Android Studio.

Para fazer isso, abra o Android Studio, clique no botão "More Actions" e selecione "SDK Manager".

![image](/docs/assets/288755758-175ae9d7-3e6d-42ba-9b12-a1e89bf0df53.png)

::: info Nota
O SDK Manager também pode ser encontrado na caixa de diálogo "Settings" do Android Studio, em **Languages & Frameworks → Android SDK**.
:::

Selecione a guia "Plataformas SDK" no SDK Manager e marque a caixa ao lado de "Mostrar detalhes do pacote" no canto inferior direito. Procure e expanda a entrada `Android 13 (Tiramisu)` e certifique-se de que os seguintes itens estejam marcados:

* `Plataforma Android SDK 33`
* Imagem do sistema `Intel x86 Atom_64` ou `Google APIs Intel x86 Atom System Image` ou (para Apple M1 Silicon) `Google APIs ARM 64 v8a System Image`

Em seguida, selecione a guia "SDK Tools" e marque a caixa ao lado de "Show Package Details" aqui também. Procure e expanda a entrada "Android SDK Build-Tools" e certifique-se de que `33.0.0` esteja selecionado.

Por fim, clique em “Apply” para baixar e instalar o Android SDK e ferramentas de construção relacionadas.

3. Configure a variável de ambiente `ANDROID_HOME`
As ferramentas React Native requerem a configuração de algumas variáveis de ambiente para construir aplicativos com código nativo.

Adicione as seguintes linhas ao seu arquivo de configuração `~/.zprofile` ou `~/.zshrc` (se você estiver usando bash, então `~/.bash_profile` ou `~/.bashrc`):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Execute `source ~/.zprofile` (ou `source ~/.bash_profile` para bash) para carregar a configuração em seu shell atual. Verifique se `ANDROID_HOME` foi configurado executando `echo $ANDROID_HOME` e os diretórios apropriados foram adicionados ao seu caminho executando `echo $PATH.`

::: warning Atenção
Certifique-se de usar o caminho correto do Android SDK. Você pode encontrar a localização real do SDK na caixa de diálogo "**Settings**" do **Languages & Frameworks → Android SDK**.
:::

## Interface de linha de comando nativa do React
React Native possui uma interface de linha de comando integrada. Em vez de instalar e gerenciar uma versão específica da CLI globalmente, recomendamos que você acesse a versão atual em tempo de execução usando `npx`, que acompanha o Node.js. Com `npx react-native <command>`, a versão estável atual da CLI será baixada e executada no momento em que o comando for executado.

## Criando um novo aplicativo

::: warning Atenção
Se você instalou anteriormente um pacote global `react-native-cli`, remova-o, pois pode causar problemas inesperados:
 
```bash
npm uninstall -g react-native-cli @react-native-community/cli
```
:::

React Native possui uma interface de linha de comando integrada, que você pode usar para gerar um novo projeto. Você pode acessá-lo sem instalar nada globalmente usando o `npx`, que acompanha o Node.js. Vamos criar um novo projeto React Native chamado "AwesomeProject":

```bash
npx react-native@latest init AwesomeProject
```

Isso não é necessário se você estiver integrando o React Native em um aplicativo existente, se você "expulsou" da Expo ou se estiver adicionando suporte Android a um projeto React Native existente (consulte [Integração com aplicativos existentes](/docs/integration-with-existing-apps.md)). Você também pode usar uma CLI de terceiros para iniciar seu aplicativo React Native, como [Ignite CLI](https://github.com/infinitered/ignite).

## [Opcional] Usando uma versão ou modelo específico
Se quiser iniciar um novo projeto com uma versão específica do React Native, você pode usar o argumento `--version`:

```bash
npx react-native@X.XX.X init AwesomeProject --version X.XX.X
```

Você também pode iniciar um projeto com um modelo React Native personalizado com o argumento `--template`.

## Preparando o dispositivo Android
Você precisará de um dispositivo Android para executar seu aplicativo React Native para Android. Pode ser um dispositivo Android físico ou, mais comumente, você pode usar um dispositivo virtual Android que permite emular um dispositivo Android em seu computador.

De qualquer forma, você precisará preparar o dispositivo para executar aplicativos Android para desenvolvimento.

### Usando um dispositivo físico
Se você tiver um dispositivo Android físico, poderá usá-lo para desenvolvimento no lugar de um AVD, conectando-o ao computador usando um cabo USB e seguindo as instruções [aqui](/docs/running-on-device.md).

### Usando um dispositivo virtual
Se você usar o Android Studio para abrir `./AwesomeProject/android`, poderá ver a lista de dispositivos virtuais Android (AVDs) disponíveis abrindo o "AVD Manager" no Android Studio. Procure um ícone parecido com este:

![image](/docs/assets/download.png)

Se você instalou recentemente o Android Studio, provavelmente precisará [criar um novo AVD](https://developer.android.com/studio/run/managing-avds.html). Selecione "Create Virtual Device...", escolha qualquer telefone da lista e clique em "Next" e selecione a imagem **Tiramisu** API nível 33.

Clique em “Next” e depois em “Finish” para criar seu AVD. Neste ponto, você poderá clicar no botão de triângulo verde próximo ao seu AVD para iniciá-lo e, em seguida, prosseguir para a próxima etapa.

## Executando seu aplicativo React Native

### Etapa 1: iniciar o Metro
[Metro](https://facebook.github.io/metro/) é a ferramenta de construção JavaScript para React Native. Para iniciar o servidor de desenvolvimento Metro, execute o seguinte na pasta do projeto:

::: code-group

```bash [npm]
npm start
```

```bash [yarn]
yarn start
```
:::

::: info **OBSERVAÇÃO**
Se você estiver familiarizado com desenvolvimento web, o Metro é semelhante a empacotadores como Vite e webpack, mas foi projetado de ponta a ponta para React Native. Por exemplo, Metro usa [Babel](https://babel.dev/) para transformar sintaxe como JSX em JavaScript executável.
:::

### Step 2: Inicie sua aplicação

::: code-group
```bash [npm]
npm run android
```

```bash [yarn]
yarn android
```
:::

Se tudo estiver configurado corretamente, você deverá ver seu novo aplicativo em execução no emulador do Android em breve.

![image](/docs/assets/288759376-65fb76bd-40b8-4301-b292-a776ea55f17e.png)

Essa é uma maneira de executar seu aplicativo: você também pode executá-lo diretamente no Android Studio.

::: info Nota
Se você não conseguir fazer isso funcionar, consulte a página [Solução de problemas](/docs/troubleshooting.md).
:::

### Modificando seu aplicativo

Agora que você executou o aplicativo com sucesso, vamos modificá-lo.

* Abra `App.tsx` no editor de texto de sua preferência e edite algumas linhas.
* Pressione a tecla `R` duas vezes ou selecione `Reload` no menu Dev (`Cmd ⌘` + `M`) para ver suas alterações!

## É isso!
Parabéns! Você executou e modificou com sucesso seu primeiro aplicativo React Native.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/c6b24c43-2e07-4845-9c2e-133189349b1c)

#### E agora?

* Se você deseja adicionar este novo código React Native a um aplicativo existente, consulte o [guia de integração](/docs/integration-with-existing-apps.md).

Se você estiver curioso para saber mais sobre o React Native, confira a [Introdução ao React Native](/docs/getting-started.md).
