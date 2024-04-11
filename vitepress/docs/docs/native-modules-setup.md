# Configuração do pacote NPM de módulos nativos

::: info **INFORMAÇÕES**
Módulo Nativo e Componentes Nativos são nossas tecnologias estáveis usadas pela arquitetura legada. Eles serão descontinuados no futuro, quando a Nova Arquitetura estiver estável. A nova arquitetura usa [Turbo Native Module](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md) e [Fabric Native Components](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md) para obter resultados semelhantes.
:::

Módulos nativos são geralmente distribuídos como pacotes npm, exceto que além do JavaScript usual eles incluirão algum código nativo por plataforma. Para entender mais sobre os pacotes npm, [este guia](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) pode ser útil.

Para configurar a estrutura básica do projeto para um módulo nativo, usaremos a ferramenta da comunidade chamada [create-react-native-library](https://github.com/callstack/react-native-builder-bob). Você pode ir mais longe e se aprofundar em como essa biblioteca funciona, mas para nossas necessidades executaremos apenas o script básico:

```bash
npx create-react-native-library@latest react-native-awesome-module
```

Onde `react-native-awesome-module` é o nome que você gostaria para o novo módulo. Depois de fazer isso, você navegará até a pasta `react-native-awesome-module` e inicializará o projeto de exemplo executando:

```bash
yarn
```

Quando o bootstrap estiver concluído, você poderá iniciar o aplicativo de exemplo executando um dos seguintes comandos:

::: code-group
```bash [Android/Yarn]
yarn example android
```
```bash [iOS/Yarn]
yarn example ios
```
:::

Quando todas as etapas acima forem concluídas, você poderá continuar com os guias de [módulos nativos do Android](/docs/native-modules-android.md) ou [módulos nativos do iOS](/docs/native-modules-ios.md) para adicionar algum código.

::: info INFORMAÇÕES
Para uma configuração menos opinativa, dê uma olhada na ferramenta de terceiros [create-react-native-module](https://github.com/brodybits/create-react-native-module).
:::
