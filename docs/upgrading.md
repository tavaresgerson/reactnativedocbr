# Atualizando para novas versões
A atualização para novas versões do React Native lhe dará acesso a mais APIs, visualizações, ferramentas de desenvolvedor e outras vantagens. A atualização requer um pouco de esforço, mas tentamos torná-la simples para você.

## Projetos de expo
Atualizar seu projeto Expo para uma nova versão do React Native requer a atualização das versões dos pacotes `react-native`, `react` e `expo` em seu arquivo `package.json`. Expo fornece um comando de atualização para lidar com a atualização dessas e de quaisquer outras dependências conhecidas para você. Consulte o [passo a passo de atualização do Expo SDK](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/) para obter informações atualizadas sobre como atualizar seu projeto.

## Projetos React Native
Como os projetos típicos do React Native são essencialmente compostos de um projeto Android, um projeto iOS e um projeto JavaScript, a atualização pode ser bastante complicada. Atualmente, existem duas maneiras de atualizar seu projeto React Native: usando [React Native CLI](https://github.com/react-native-community/cli) ou manualmente com [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/).

### Reagir CLI nativo
O [React Native CLI](https://github.com/react-native-community/cli) vem com o comando upgrade que fornece uma operação de uma etapa para atualizar os arquivos de origem com um mínimo de conflitos. Ele usa internamente o projeto [rn-diff-purge](https://github.com/react-native-community/rn-diff-purge) para descobrir quais arquivos precisam ser criados, removidos ou modificados.

1. Execute o comando `upgrade`

> O comando `upgrade` funciona em cima do Git usando `git apply` com mesclagem de 3 vias, portanto é necessário usar o Git para que isso funcione, se você não usa o Git, mas ainda deseja usar esta solução, você pode verificar como fazer isso na seção Solução de problemas nesta página.

Execute o seguinte comando para iniciar o processo de atualização para a versão mais recente:

```
npx react-native upgrade
```

Você pode especificar uma versão do React Native passando um argumento, por exemplo. para atualizar para `0.61.0-rc.0` execute:

```
npx react-native upgrade 0.61.0-rc.0
```

O projeto é atualizado usando `git apply` com mesclagem de 3 vias, pode acontecer que você precise resolver alguns conflitos após terminar.

2. Resolva os conflitos
Os arquivos em conflito incluem delimitadores que deixam bem claro de onde vêm as alterações. Por exemplo:

```
13B07F951A680F5B00A75B9A /* Release */ = {
  isa = XCBuildConfiguration;
  buildSettings = {
    ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
<<<<<<< ours
    CODE_SIGN_IDENTITY = "iPhone Developer";
    FRAMEWORK_SEARCH_PATHS = (
      "$(inherited)",
      "$(PROJECT_DIR)/HockeySDK.embeddedframework",
      "$(PROJECT_DIR)/HockeySDK-iOS/HockeySDK.embeddedframework",
    );
=======
    CURRENT_PROJECT_VERSION = 1;
>>>>>>> theirs
    HEADER_SEARCH_PATHS = (
      "$(inherited)",
      /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include,
      "$(SRCROOT)/../node_modules/react-native/React/**",
      "$(SRCROOT)/../node_modules/react-native-code-push/ios/CodePush/**",
    );
```

Você pode pensar em “nosso” como “sua equipe” e “deles” como “a equipe de desenvolvimento do React Native”.

### Ajudante de atualização
O [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) é uma ferramenta da web para ajudá-lo na atualização de seus aplicativos, fornecendo o conjunto completo de alterações que ocorrem entre duas versões. Ele também mostra comentários sobre arquivos específicos para ajudar a entender por que essa alteração é necessária.

#### 1. Selecione as versões
Primeiro você precisa selecionar para qual versão deseja atualizar; por padrão, as versões principais mais recentes são selecionadas. Após selecionar você pode clicar no botão "Mostre-me como atualizar".

💡 As principais atualizações mostrarão uma seção de "_useful content_" (conteúdo útil) na parte superior com links para ajudá-lo durante a atualização.

#### 2. Atualizar dependências
O primeiro arquivo que aparece é o `package.json`, é bom atualizar as dependências que estão aparecendo nele. Por exemplo, se `react-native` e `react` aparecerem como alterações, você poderá instalá-lo em seu projeto executando `yarn add`:

```
# {{VERSION}} and {{REACT_VERSION}} are the release versions showing in the diff
yarn add react-native@{{VERSION}}
yarn add react@{{REACT_VERSION}}
```

#### 3. Atualize seus arquivos de projeto
A nova versão pode conter atualizações para outros arquivos que são gerados quando você executa o `npx react-native init`. Esses arquivos são listados após `package.json` na página do Upgrade Helper. Se não houver outras alterações, você só precisará reconstruir o projeto para continuar o desenvolvimento.

Caso haja alterações, você pode atualizá-las manualmente, copiando e colando as alterações na página ou pode fazer isso com o comando de atualização React Native CLI executando:

```
npx react-native upgrade
```

Isso verificará seus arquivos em relação ao modelo mais recente e executará o seguinte:

* Se houver um novo arquivo no modelo, ele será criado.
* Se um arquivo no modelo for idêntico ao seu arquivo, ele será ignorado.
* Se um arquivo em seu projeto for diferente do modelo, você será avisado; você tem opções para manter seu arquivo ou substituí-lo pela versão do modelo.

> Algumas atualizações não serão feitas automaticamente com o React Native CLI e requerem trabalho manual, por exemplo. `0.28` a `0.29` ou `0.56` a `0.57`. Certifique-se de verificar as notas de versão ao atualizar para poder identificar quaisquer alterações manuais que seu projeto específico possa exigir.

### Solução de problemas

#### Quero atualizar com React Native CLI, mas não uso Git
Embora seu projeto não precise ser gerenciado pelo sistema de versionamento Git - você pode usar Mercurial, SVN ou nada - você ainda precisará instalar o [Git](https://git-scm.com/downloads) em seu sistema para usar o `npx react-native upgrade`. O Git também precisará estar disponível no `PATH`. Se o seu projeto não usa Git, inicialize-o e faça o commit:

```
git init # Inicialize um repositório Git
git add . # Prepare todos os arquivos atuais
git commit -m "Upgrade react-native" # Salva os arquivos atuais em um commit
```

Depois de terminar a atualização, você pode remover o diretório `.git`.

#### Fiz todas as alterações, mas meu aplicativo ainda usa uma versão antiga
Esses tipos de erros geralmente estão relacionados ao cache, é recomendado instalar o [`react-native-clean-project`](https://github.com/pmadruga/react-native-clean-project) para limpar todo o cache do seu projeto e então você pode executá-lo novamente.
