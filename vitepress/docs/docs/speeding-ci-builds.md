# Acelerando as compilações de CI
Você ou sua empresa podem ter configurado um ambiente de Integração Contínua (CI) para testar seu aplicativo React Native.

Um serviço de CI rápido é importante por 2 motivos:

* Quanto mais tempo as máquinas de CI ficam em execução, mais elas custam.
* Quanto mais tempo os trabalhos de CI levarem para serem executados, maior será o ciclo de desenvolvimento.

Portanto, é importante tentar minimizar o tempo que o ambiente de CI gasta construindo o React Native.

## Desative o Flipper para iOS
[Flipper](https://github.com/facebook/flipper) é uma ferramenta de depuração fornecida por padrão com React Native, para ajudar os desenvolvedores a depurar e criar o perfil de seus aplicativos React Native. No entanto, o Flipper não é necessário no CI: é muito improvável que você ou um de seus colegas precise depurar o aplicativo criado no ambiente de CI.

Para aplicativos iOS, o Flipper é construído toda vez que a estrutura React Native é construída e pode levar algum tempo para ser construída, e esse é o tempo que você pode economizar.

A partir do React Native 0.71, introduzimos um novo sinalizador no Podfile do modelo: o [sinalizador NO_FLIPPER](https://github.com/facebook/react-native/blob/main/packages/react-native/template/ios/Podfile#L20).

Por padrão, o sinalizador `NO_FLIPPER` não está definido, portanto o Flipper será incluído por padrão em seu aplicativo.

Você pode especificar `NO_FLIPPER=1` ao instalar seus pods iOS, para instruir o React Native a não instalar o Flipper. Normalmente, o comando ficaria assim:

```
# da pasta raiz do projeto react native
NO_FLIPPER=1 bundle exec pod install --project-directory=ios
```

Adicione este comando em seu ambiente de CI para ignorar a instalação das dependências do Flipper e, assim, economizar tempo e dinheiro.

### Lidar com dependências transitivas
Seu aplicativo pode estar usando algumas bibliotecas que dependem dos pods do Flipper. Se for esse o seu caso, desabilitar o flipper com o sinalizador `NO_FLIPPER` pode não ser suficiente: seu aplicativo pode falhar na construção neste caso.

A maneira correta de lidar com esse caso é adicionar uma configuração personalizada para react native, instruindo o aplicativo a instalar corretamente a dependência transitiva. Para conseguir isso:

* Se ainda não o fez, crie um novo arquivo chamado `react-native.config.js`.
* Exclua explicitamente a dependência transitiva das dependências quando o sinalizador estiver ativado.

Por exemplo, a biblioteca `react-native-flipper` é uma biblioteca adicional que depende do Flipper. Se o seu aplicativo usa isso, você precisa excluí-lo das dependências. Seu `react-native.config.js` ficaria assim:

```js
// react-native.config.js

module.exports = {
  // outros campos
  dependencies: {
    ...(process.env.NO_FLIPPER
      ? {'react-native-flipper': {platforms: {ios: null}}}
      : {}),
  },
};
```
