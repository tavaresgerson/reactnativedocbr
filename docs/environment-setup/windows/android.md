### Instalando dependências

Você precisará do Node, da interface de linha de comando React Native, de um JDK e do Android Studio.

Embora você possa usar qualquer editor de sua escolha para desenvolver seu aplicativo, você precisará instalar o Android Studio para configurar as ferramentas necessárias para criar seu aplicativo React Native para Android.

#### Node, JDK
Recomendamos instalar o Node via [Chocolatey](https://chocolatey.org/install), um popular gerenciador de pacotes para Windows.

Recomenda-se usar uma versão LTS do Node. Se você quiser alternar entre versões diferentes, você pode instalar o Node via [nvm-windows](https://github.com/coreybutler/nvm-windows), um gerenciador de versões do Node para Windows.

React Native também requer [Java SE Development Kit (JDK)](https://openjdk.java.net/projects/jdk/17/), que também pode ser instalado usando Chocolatey.

Abra um prompt de comando do administrador (clique com o botão direito em prompt de comando e selecione "Executar como administrador") e execute o seguinte comando:

```bash
choco install -y nodejs-lts microsoft-openjdk17
```

Se você já instalou o Node em seu sistema, certifique-se de que seja o Node 18 ou mais recente. Se você já possui um JDK em seu sistema, recomendamos o JDK17. Você pode encontrar problemas ao usar versões superiores do JDK.

> Você pode encontrar opções de instalação adicionais na página de [downloads do Node](https://nodejs.org/en/download/)https://nodejs.org/en/download/.

> Se estiver usando a versão mais recente do Java Development Kit, você precisará alterar a versão Gradle do seu projeto para que ele possa reconhecer o JDK. Você pode fazer isso acessando `{pasta raiz do projeto}\android\gradle\wrapper\gradle-wrapper.properties` e alterando o valor `DistributionUrl` para atualizar a versão Gradle. Você pode conferir [aqui](https://gradle.org/releases/) os últimos lançamentos do Gradle.

#### Ambiente de desenvolvimento Android
Configurar seu ambiente de desenvolvimento pode ser um tanto entediante se você for novo no desenvolvimento Android. Se você já estiver familiarizado com o desenvolvimento Android, talvez seja necessário configurar algumas coisas. Em ambos os casos, certifique-se de seguir cuidadosamente as próximas etapas.

1. Instale o Android Studio
Baixe e instale o Android Studio. No assistente de instalação do Android Studio, certifique-se de que as caixas ao lado de todos os itens a seguir estejam marcadas:

* `SDK Android`
* `Plataforma Android SDK`
* `Dispositivo Virtual Android`
* Se você ainda não estiver usando Hyper-V: `Performance (Intel ® HAXM)` (Veja aqui para [AMD ou Hyper-V](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html))

Em seguida, clique em “Next” para instalar todos esses componentes.

> Se as caixas de seleção estiverem esmaecidas, você terá a chance de instalar esses componentes mais tarde.

Depois que a configuração for finalizada e a tela de boas-vindas for exibida, prossiga para a próxima etapa.

##### 2. Instale o Android SDK
O Android Studio instala o Android SDK mais recente por padrão. Construir um aplicativo React Native com código nativo, no entanto, requer o SDK do `Android 13 (Tiramisu)` em particular. SDKs Android adicionais podem ser instalados por meio do SDK Manager no Android Studio.

Para fazer isso, abra o Android Studio, clique no botão "More Actions" e selecione "SDK Manager". 

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/33a7f3de-c80c-47db-b195-35cf25023b27)

> O SDK Manager também pode ser encontrado na caixa de diálogo "Settings" do Android Studio, em **Languages & Frameworks → Android SDK**.

Selecione a guia "SDK Platforms" no SDK Manager e marque a caixa ao lado de "Show Package Details" no canto inferior direito. Procure e expanda a entrada `Android 13 (Tiramisu)` e certifique-se de que os seguintes itens estejam marcados:

* `Plataforma Android SDK 33`
* `Intel x86 Atom_64 System Image` ou `Google APIs Intel x86 Atom System Image`

Em seguida, selecione a guia "SDK Tools" e marque a caixa ao lado de "Show Package Details" aqui também. Procure e expanda a entrada `Android SDK Build-Tools` e certifique-se de que `33.0.0` esteja selecionado.

Por fim, clique em "Apply" para baixar e instalar o Android SDK e ferramentas de construção relacionadas.

3. Configure a variável de ambiente `ANDROID_HOME`
As ferramentas React Native requerem a configuração de algumas variáveis de ambiente para construir aplicativos com código nativo.

1. Abra o **Painel de Controle do Windows**.
2. Clique em **Contas de usuário** e clique em **Contas de usuário** novamente
3. Clique em **Alterar minhas variáveis de ambiente**
4. Clique em **Novo...** para criar uma nova variável de usuário `ANDROID_HOME` que aponta para o caminho para seu Android SDK:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/2b29397f-f3d1-41cb-a25c-84aff19487bf)

O SDK é instalado, por padrão, no seguinte local:

```
%LOCALAPPDATA%\Android\Sdk
```

Você pode encontrar a localização real do SDK na caixa de diálogo "Settings" do Android Studio, em **Languages & Frameworks → Android SDK**.

Abra uma nova janela do prompt de comando para garantir que a nova variável de ambiente seja carregada antes de prosseguir para a próxima etapa.

1. Abra o PowerShell
2. Copie e cole **Get-ChildItem -Path Env:\** no PowerShell
3. Verifique se `ANDROID_HOME` foi adicionado
4. Adicione ferramentas de plataforma ao Path

  1. Abra o **Painel de Controle do Windows**.
  2. Clique em **Contas de usuário** e clique em **Contas de usuário** novamente
  3. Clique em **Alterar minhas variáveis de ambiente**
  4. Selecione a variável **Caminho**.
  5. Clique em **Editar**.
  6. Clique em **Novo** e adicione o caminho para ferramentas de plataforma à lista.

O local padrão para esta pasta é:

```
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

##### Interface de linha de comando nativa do React
React Native possui uma interface de linha de comando integrada. Em vez de instalar e gerenciar uma versão específica da CLI globalmente, recomendamos que você acesse a versão atual em tempo de execução usando `npx`, que acompanha o Node.js. Com `npx react-native <command>`, a versão estável atual da CLI será baixada e executada no momento em que o comando for executado.

#### Criando um novo aplicativo

> Se você instalou anteriormente o pacote global `react-native-cli`, remova-o, pois pode causar problemas inesperados:
> ```
> npm desinstalar -g react-native-cli @react-native-community/cli
> ```

React Native possui uma interface de linha de comando integrada, que você pode usar para gerar um novo projeto. Você pode acessá-lo sem instalar nada globalmente usando o `npx`, que acompanha o Node.js. Vamos criar um novo projeto React Native chamado "AwesomeProject":

```
npx react-native@latest init AwesomeProject
```

Isso não é necessário se você estiver integrando o React Native em um aplicativo existente, se você "expulsou" da Expo ou se estiver adicionando suporte Android a um projeto React Native existente (consulte [Integração com aplicativos existentes](/docs/integration-with-existing-apps.md)). Você também pode usar uma CLI de terceiros para iniciar seu aplicativo React Native, como [Ignite CLI](https://github.com/infinitered/ignite).

##### [Opcional] Usando uma versão ou modelo específico
Se quiser iniciar um novo projeto com uma versão específica do React Native, você pode usar o argumento `--version`:

```
npx react-native@X.XX.X init AwesomeProject --versão X.XX.X
```

Você também pode iniciar um projeto com um modelo React Native personalizado com o argumento `--template`.

#### Preparando o dispositivo Android
Você precisará de um dispositivo Android para executar seu aplicativo React Native para Android. Pode ser um dispositivo Android físico ou, mais comumente, você pode usar um dispositivo virtual Android que permite emular um dispositivo Android em seu computador.

De qualquer forma, você precisará preparar o dispositivo para executar aplicativos Android para desenvolvimento.

##### Usando um dispositivo físico
Se você tiver um dispositivo Android físico, poderá usá-lo para desenvolvimento no lugar de um AVD, conectando-o ao computador usando um cabo USB e seguindo as instruções aqui.

##### Usando um dispositivo virtual
Se você usar o Android Studio para abrir `./AwesomeProject/android`, poderá ver a lista de dispositivos virtuais Android (AVDs) disponíveis abrindo o "AVD Manager" no Android Studio. Procure um ícone parecido com este:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/dfa97c11-dc18-4fe6-8fcd-e064267725c8)

Se você instalou recentemente o Android Studio, provavelmente precisará criar um novo AVD. Selecione "[Create Virtual Device...](https://developer.android.com/studio/run/managing-avds.html)", escolha qualquer telefone da lista e clique em "Next" e selecione a imagem `Tiramisu` API nível 33.

> Se você não possui o HAXM instalado, clique em "Install HAXM" ou siga [estas instruções](https://github.com/intel/haxm/wiki/Installation-Instructions-on-Windows) para configurá-lo e volte para o AVD Manager.

Clique em “Next” e depois em “Finish” para criar seu AVD. Neste ponto, você poderá clicar no botão de triângulo verde próximo ao seu AVD para iniciá-lo e, em seguida, prosseguir para a próxima etapa.

#### Executando seu aplicativo React Native

##### Etapa 1: iniciar o Metro
[Metro](https://facebook.github.io/metro/) é a ferramenta de construção JavaScript para React Native. Para iniciar o servidor de desenvolvimento Metro, execute o seguinte na pasta do projeto:

```bash
npm start
# ou
yarn start
```

> **OBSERVAÇÃO**
> Se você estiver familiarizado com desenvolvimento web, o Metro é semelhante a empacotadores como Vite e webpack, mas foi projetado de ponta a ponta para React Native. Por exemplo, Metro usa [Babel](https://babel.dev/) para transformar sintaxe como JSX em JavaScript executável.

##### Etapa 2: inicie seu aplicativo
Deixe o Metro Bundler rodar em seu próprio terminal. Abra um novo terminal dentro da pasta do projeto React Native. Execute o seguinte:

```bash
npm run android
# ou
yarn android
```

Se tudo estiver configurado corretamente, você deverá ver seu novo aplicativo em execução no emulador do Android em breve.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/71da2fbe-ea92-48ae-b243-edf07876a7db)

Essa é uma maneira de executar seu aplicativo: você também pode executá-lo diretamente no Android Studio.

> Se você não conseguir fazer isso funcionar, consulte a página [Solução de problemas](https://reactnative.dev/docs/troubleshooting).

#### Modificando seu aplicativo
Agora que você executou o aplicativo com sucesso, vamos modificá-lo.

* Abra `App.tsx` no editor de texto de sua preferência e edite algumas linhas.
* Pressione a tecla `R` duas vezes ou selecione "Reload" no menu Dev (`Ctrl` + `M`) para ver suas alterações!

#### É isso!
Parabéns! Você executou e modificou com sucesso seu primeiro aplicativo React Native.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/306aeeea-b146-4bf0-8a74-d9af3bfb2958)

#### E agora?

* Se você deseja adicionar este novo código React Native a um aplicativo existente, consulte o [guia de integração](/docs/integration-with-existing-apps.md).

Se você estiver curioso para saber mais sobre o React Native, confira a [Introdução ao React Native](/docs/getting-started.md).


