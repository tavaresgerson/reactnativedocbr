# Mapas de origem

Os mapas de origem permitem mapear um arquivo transformado de volta ao arquivo de origem original. O objetivo principal dos mapas de origem é ajudar na depuração e na investigação de problemas de compilações de lançamento.

Sem os mapas de origem, ao encontrar um erro na compilação da versão, você verá um stacktrace como:

```bash
TypeError: Cannot read property 'data' of undefined
  at anonymous(app:///index.android.bundle:1:4277021)
  at call(native)
  at p(app:///index.android.bundle:1:227785)
```

Com os mapas de origem gerados, um stacktrace incluirá o caminho, o nome do arquivo e o número da linha do arquivo de origem original:

```bash
TypeError: Cannot read property 'data' of undefined
  at anonymous(src/modules/notifications/Permission.js:15:requestNotificationPermission)
  at call(native)
  at p(node_modules/regenerator-runtime/runtime.js:64:Generator)
```

Isso permite que você faça a triagem de problemas de lançamento usando um stacktrace decifrável.

Siga as instruções abaixo para começar a usar os mapas de origem.

## Habilitar mapas de origem no Android

### Hermes

::: info INFORMAÇÕES
Os mapas de origem são criados no modo Release por padrão, a menos que `hermesFlagsRelease` não esteja definido. Nesse caso, os mapas de origem terão que ser habilitados.
:::

Para fazer isso, certifique-se de que o seguinte esteja definido no arquivo `Android/app/build.gradle` do seu aplicativo.

```js
project.ext.react = [
    enableHermes: true,
    hermesFlagsRelease: ["-O", "-output-source-map"], // mais qualquer sinalizador necessário para definir isso fora do padrão
]
```

Se feito corretamente, você deverá ver o local de saída do mapa de origem durante a saída da compilação Metro.

```
Writing bundle output to:, android/app/build/generated/assets/react/release/index.android.bundle
Writing sourcemap output to:, android/app/build/intermediates/sourcemaps/react/release/index.android.bundle.packager.map
```

As compilações de desenvolvimento não produzem um pacote configurável e, portanto, já possuem símbolos, mas se a compilação de desenvolvimento estiver empacotada, você pode usar `hermesFlagsDebug` como acima para habilitar mapas de origem.

## Habilitar mapas de origem no iOS

Os mapas de origem estão desabilitados por padrão. Para habilitá-los é necessário definir uma variável de ambiente `SOURCEMAP_FILE`.

Para fazer isso, dentro do Xcode vá para a fase de construção - "Bundle React Native code and images".

Na parte superior do arquivo, próximo às outras exportações, adicione uma entrada para `SOURCEMAP_FILE` ao local e nome preferidos. Como abaixo:

```
export SOURCEMAP_FILE="$(pwd)/../main.jsbundle.map";

export NODE_BINARY=node
../node_modules/react-native/scripts/react-native-xcode.sh
```

Se feito corretamente, você deverá ver o local de saída do mapa de origem durante a saída da compilação Metro.

```
Writing bundle output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle
Writing sourcemap output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle.map
```

## Simbolização Manual

::: info **INFORMAÇÕES**
Você pode ler sobre a simbolização manual de um rastreamento de pilha na [página de simbolização](/docs/symbolication.md).
:::
