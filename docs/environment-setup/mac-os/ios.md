### iOS

#### Instalando dependências
Você precisará de Node, Watchman, interface de linha de comando React Native, Xcode e CocoaPods.

Embora você possa usar qualquer editor de sua escolha para desenvolver seu aplicativo, você precisará instalar o Xcode para configurar as ferramentas necessárias para construir seu aplicativo React Native para iOS.

#### Node e Watchman
Recomendamos instalar o Node e o Watchman usando o Homebrew. Execute os seguintes comandos em um Terminal após instalar o Homebrew:

```
brew install node
brew install watchman
```

Se você já instalou o Node em seu sistema, certifique-se de que seja o Node 18 ou mais recente.

[Watchman](https://facebook.github.io/watchman) é uma ferramenta do Facebook para observar mudanças no sistema de arquivos. É altamente recomendável instalá-lo para melhor desempenho.

##### Xcode
A maneira mais fácil de instalar o Xcode é através da [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12). A instalação do Xcode também instalará o Simulador iOS e todas as ferramentas necessárias para construir seu aplicativo iOS.

Se você já instalou o Xcode em seu sistema, certifique-se de que seja a versão 10 ou mais recente.

##### Ferramentas de linha de comando
Você também precisará instalar as ferramentas de linha de comando do Xcode. Abra o Xcode e escolha **Settings...** (ou **Preferences...**)  no menu Xcode. Vá para o painel Locais e instale as ferramentas selecionando a versão mais recente no menu suspenso Ferramentas de linha de comando.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/79daecf4-41df-45e4-bdfd-34120ecb2d9b)

##### Instalando um simulador iOS no Xcode
Para instalar um simulador, abra **Xcode > Settings...** (ou **Preferences...**) e selecione a aba **Platforms** (ou **Components**). Selecione um simulador com a versão correspondente do iOS que você deseja usar.

Se você estiver usando o Xcode versão 14.0 ou superior para instalar um simulador, abra **Xcode > Settings > Platforms**, clique no ícone "**+**" e selecione a opção **iOS…**.

##### CocoaPods
[CocoaPods](https://cocoapods.org/) é um dos sistemas de gerenciamento de dependências disponíveis para iOS. CocoaPods é uma [gem](https://en.wikipedia.org/wiki/RubyGems) Ruby. Você pode instalar CocoaPods usando a versão do Ruby fornecida com a versão mais recente do macOS.

Para obter mais informações, visite o guia de [primeiros passos do CocoaPods](https://guides.cocoapods.org/using/getting-started.html).

#### Interface de linha de comando nativa do React
React Native possui uma interface de linha de comando integrada. Em vez de instalar e gerenciar uma versão específica da CLI globalmente, recomendamos que você acesse a versão atual em tempo de execução usando `npx`, que acompanha o Node.js. Com `npx react-native <command>`, a versão estável atual da CLI será baixada e executada no momento em que o comando for executado.

### Criando um novo aplicativo

> Se você instalou anteriormente o pacote global `react-native-cli`, remova-o, pois pode causar problemas inesperados:
> ```bash
> npm uninstall -g react-native-cli @react-native-community/cli
> ```

Você pode usar a interface de linha de comando integrada do React Native para gerar um novo projeto. Vamos criar um novo projeto React Native chamado "AwesomeProject":

```bash
npx react-native@latest init AwesomeProject
```

Isso não é necessário se você estiver integrando o React Native em um aplicativo existente, se você "expulsou" da Expo ou se estiver adicionando suporte a iOS ao projeto React Native existente (consulte [Integração com aplicativos existentes](/docs/integration-with-existing-apps.md)). Você também pode usar uma CLI de terceiros para iniciar seu aplicativo React Native, como [Ignite CLI](https://github.com/infinitered/ignite).

> **INFORMAÇÕES**
> Se você estiver tendo problemas com o iOS, tente reinstalar as dependências executando:
> 
> `cd ios` para navegar até a pasta ios.
> `bundle install` para instalar o [Bundler](https://bundler.io/)
> `bundle exec pod install` para instalar as dependências do iOS gerenciadas pelo CocoaPods.

#### [Opcional] Usando uma versão ou modelo específico
Se quiser iniciar um novo projeto com uma versão específica do React Native, você pode usar o argumento `--version`:

```bash
npx react-native@X.XX.X init AwesomeProject --version X.XX.X
```

Você também pode iniciar um projeto com um modelo React Native personalizado com o argumento `--template`.

> **Nota** Se o comando acima estiver falhando, você pode ter uma versão antiga do `react-native` ou `react-native-cli` instalada globalmente no seu PC. Tente desinstalar o cli e execute-o usando `npx`.

#### [Opcional] Configurando seu ambiente
A partir do React Native versão 0.69, é possível configurar o ambiente Xcode usando o arquivo `.xcode.env` fornecido pelo template.

O arquivo `.xcode.env` contém uma variável de ambiente para exportar o caminho para o executável do node na variável `NODE_BINARY`. Esta é a abordagem sugerida para dissociar a infraestrutura de construção da versão do sistema do `node`. Você deve customizar esta variável com seu próprio caminho ou seu próprio gerenciador de versão de `node`, se for diferente do padrão.

Além disso, é possível adicionar qualquer outra variável de ambiente e originar o arquivo `.xcode.env` nas fases do script de construção. Caso você precise executar um script que requeira algum ambiente específico, esta é a abordagem sugerida: permite desacoplar as fases de construção de um ambiente específico.

> **INFORMAÇÕES**
> Se você já estiver usando [NVM](https://nvm.sh/) (um comando que ajuda a instalar e alternar entre versões do Node.js) e [zsh](https://ohmyz.sh/), você pode querer mover o código que inicializa o NVM de seu `~/.zshrc` para um arquivo `~/.zshenv` para ajudar o Xcode a encontre seu executável Node:
> 
> ```bash
> export NVM_DIR="$HOME/.nvm"
> [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Isso carrega o nvm
> ```
>
> Você também pode querer garantir que toda a "fase de construção do script de shell" do seu projeto Xcode esteja usando `/bin/zsh` como seu shell.

#### Executando seu aplicativo React Native

##### Etapa 1: iniciar o Metro
[Metro](https://facebook.github.io/metro/) é a ferramenta de construção JavaScript para React Native. Para iniciar o servidor de desenvolvimento Metro, execute o seguinte na pasta do projeto:

```
npm start
# ou
yarn start
```

> **OBSERVAÇÃO**
> Se você estiver familiarizado com desenvolvimento web, o Metro é semelhante a empacotadores como Vite e webpack, mas foi projetado de ponta a ponta para React Native. Por exemplo, Metro usa [Babel](https://babel.dev/) para transformar sintaxe como JSX em JavaScript executável.

##### Etapa 2: inicie seu aplicativo
Deixe o Metro Bundler rodar em seu próprio terminal. Abra um novo terminal dentro da pasta do projeto React Native. Execute o seguinte:

```
npm run ios
# ou
yarn ios
```

Você deverá ver seu novo aplicativo em execução no iOS Simulator em breve.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/8042a459-ead2-4b1a-ba59-41b673d9b7d8)

Esta é uma maneira de executar seu aplicativo. Você também pode executá-lo diretamente no Xcode.

> Se você não conseguir fazer isso funcionar, consulte a página [Solução de problemas](/docs/troubleshooting.md).

##### Executando em um dispositivo
O comando acima executará automaticamente seu aplicativo no iOS Simulator por padrão. Se você deseja executar o aplicativo em um dispositivo iOS físico real, siga as instruções [aqui](/docs/running-on-device.md).

#### Modificando seu aplicativo
Agora que você executou o aplicativo com sucesso, vamos modificá-lo.

* Abra `App.tsx` no editor de texto de sua preferência e edite algumas linhas.
* Pressione `Cmd ⌘` + `R` no seu simulador iOS para recarregar o aplicativo e ver suas alterações!

#### É isso!
Parabéns! Você executou e modificou com sucesso seu primeiro aplicativo React Native.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/bc864112-bd55-43b6-8369-9d78e896376e)

#### E agora?

* Se você deseja adicionar este novo código React Native a um aplicativo existente, consulte o [guia de integração](/docs/integration-with-existing-apps.md).

Se você estiver curioso para saber mais sobre o React Native, confira a [Introdução ao React Native](https://reactnative.dev/docs/getting-started.md).
