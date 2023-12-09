#### Instalando dependências
Você precisará do Node, da interface de linha de comando React Native, de um JDK e do Android Studio.

Embora você possa usar qualquer editor de sua escolha para desenvolver seu aplicativo, você precisará instalar o Android Studio para configurar as ferramentas necessárias para construir seu aplicativo React Native para Android.

#### Node
Siga as instruções de instalação da sua distribuição Linux para instalar o Node 18 ou mais recente.

#### kit de desenvolvimento do Java
Atualmente, o React Native recomenda a versão 17 do Java SE Development Kit (JDK). Você pode encontrar problemas ao usar versões superiores do JDK. Você pode baixar e instalar o [OpenJDK](https://openjdk.java.net/) do [AdoptOpenJDK](https://adoptopenjdk.net/) ou do seu empacotador de sistema.

##### Ambiente de desenvolvimento Android
Configurar seu ambiente de desenvolvimento pode ser um tanto entediante se você for novo no desenvolvimento Android. Se você já estiver familiarizado com o desenvolvimento Android, talvez seja necessário configurar algumas coisas. Em ambos os casos, certifique-se de seguir cuidadosamente as próximas etapas.

1. Instale o Android Studio
[Baixe e instale o Android Studio](https://developer.android.com/studio/index.html). No assistente de instalação do Android Studio, certifique-se de que as caixas ao lado de todos os itens a seguir estejam marcadas:

* `SDK Android`
* `Android SDK Platform`
* `Android Virtual Device`

Em seguida, clique em “Next” para instalar todos esses componentes.

> Se as caixas de seleção estiverem esmaecidas, você terá a chance de instalar esses componentes mais tarde.

Depois que a configuração for finalizada e a tela de boas-vindas for exibida, prossiga para a próxima etapa.

2. Instale o Android SDK
O Android Studio instala o Android SDK mais recente por padrão. Construir um aplicativo React Native com código nativo, no entanto, requer o SDK do `Android 13 (Tiramisu)` em particular. SDKs Android adicionais podem ser instalados por meio do SDK Manager no Android Studio.

Para fazer isso, abra o Android Studio, clique no botão "Configure" e selecione "SDK Manager".

> O SDK Manager também pode ser encontrado na caixa de diálogo "Settings" do Android Studio, em Languages & Frameworks → Android SDK.

Selecione a guia "SDK Platforms" no SDK Manager e marque a caixa ao lado de "Show Package Details" no canto inferior direito. Procure e expanda a entrada `Android 13 (Tiramisu)` e certifique-se de que os seguintes itens estejam marcados:

* `Android SDK Platform 33`
* `Intel x86 Atom_64 System Image` ou `Google APIs Intel x86 Atom System Image`

Em seguida, selecione a guia "SDK Tools" e marque a caixa ao lado de "Show Package Details" aqui também. Procure e expanda a entrada "Android SDK Build-Tools" e certifique-se de que `33.0.0` esteja selecionado.

Por fim, clique em “Apply” para baixar e instalar o Android SDK e ferramentas de construção relacionadas.

3. Configure a variável de ambiente `ANDROID_HOME`
As ferramentas React Native requerem a configuração de algumas variáveis de ambiente para construir aplicativos com código nativo.

Adicione as seguintes linhas ao seu arquivo de configuração `$HOME/.bash_profile` ou `$HOME/.bashrc` (se você estiver usando `zsh`, então `~/.zprofile` ou `~/.zshrc`):

```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

> `.bash_profile` é específico do `bash`. Se estiver usando outro shell, você precisará editar o arquivo de configuração específico do shell apropriado.

Digite `source $HOME/.bash_profile` para bash ou `source $HOME/.zprofile` para carregar a configuração em seu shell atual. Verifique se `ANDROID_HOME` foi configurado executando `echo $ANDROID_HOME` e os diretórios apropriados foram adicionados ao seu caminho executando `echo $PATH`.

> Certifique-se de usar o caminho correto do Android SDK. Você pode encontrar a localização real do SDK na caixa de diálogo "Settings" do Android Studio, em Languages & Frameworks → Android SDK.


#### Watchman



