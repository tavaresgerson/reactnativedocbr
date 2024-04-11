# Metro

React Native usa Metro para construir seu código JavaScript e ativos.

## Configurando Metro
As opções de configuração do Metro podem ser personalizadas no arquivo `metro.config.js` do seu projeto. Isso pode exportar:

* **Um objeto (recomendado)** que será mesclado com os padrões de configuração interna do Metro.
* **Uma função** que será chamada com os padrões de configuração interna do Metro e deverá retornar um objeto de configuração final.

::: tip DICA
Consulte [Configurando o Metro](https://facebook.github.io/metro/docs/configuration) no site do Metro para obter documentação sobre todas as opções de configuração disponíveis.
:::

No React Native, sua configuração Metro deve estender `@react-native/metro-config` ou `@expo/metro-config`. Esses pacotes contêm padrões essenciais necessários para construir e executar aplicativos React Native.

Abaixo está o arquivo `metro.config.js` padrão em um projeto de modelo React Native:

```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

As opções Metro que você deseja personalizar podem ser feitas dentro do objeto de configuração.

### Avançado: usando uma função de configuração
Exportar uma função de configuração é uma opção para você mesmo gerenciar a configuração final – **o Metro não aplicará nenhum padrão interno**. Este padrão pode ser útil quando for necessário ler o objeto de configuração padrão base do Metro ou definir opções dinamicamente.

::: info INFORMAÇÕES
A partir do `@react-native/metro-config` **0.72.1**, não é mais necessário usar uma função de configuração para acessar a configuração padrão completa. Veja a seção de dicas abaixo.
:::

```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

module.exports = function (baseConfig) {
  const defaultConfig = mergeConfig(baseConfig, getDefaultConfig(__dirname));
  const {resolver: {assetExts, sourceExts}} = defaultConfig;

  return mergeConfig(
    defaultConfig,
    {
      resolver: {
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
      },
    },
  );
};
```

::: tip DICA
Usar uma função de configuração é para casos de uso avançados. Um método mais simples do que o acima, por ex. para personalizar sourceExts, seria ler esses padrões em `@react-native/metro-config`.
 
**Alternativa**
```js
const defaultConfig = getDefaultConfig(__dirname);
 
const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

No entanto!, recomendamos copiar e editar ao substituir esses valores de configuração – colocando a fonte da verdade em seu arquivo de configuração.

**✅ Recomendado**
```js
const config = {
  resolver: {
    sourceExts: ['js', 'ts', 'tsx', 'svg'],
  },
};
```
:::
