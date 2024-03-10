# Pacotes de RAM e requisitos inline
Se você tiver um aplicativo grande, considere o formato do pacote Random Access Modules (RAM) e o uso de requisitos in-line. Isso é útil para aplicativos que possuem um grande número de telas que talvez nunca sejam abertas durante o uso normal do aplicativo. Geralmente é útil para aplicativos que possuem grandes quantidades de código que não são necessários por um tempo após a inicialização. Por exemplo, o aplicativo inclui telas de perfil complicadas ou recursos menos usados, mas a maioria das sessões envolve apenas a visita à tela principal do aplicativo para atualizações. Podemos otimizar o carregamento do pacote usando o formato RAM e exigindo esses recursos e telas inline (quando são realmente usados).

## Carregando JavaScript
Antes que o react-native possa executar o código JS, esse código deve ser carregado na memória e analisado. Com um pacote padrão, se você carregar um pacote de 50 MB, todos os 50 MB deverão ser carregados e analisados antes que qualquer um deles possa ser executado. A otimização por trás dos pacotes de RAM é que você pode carregar apenas a parte dos 50 MB que realmente precisa na inicialização e carregar progressivamente mais do pacote conforme essas seções forem necessárias.

## Requer Inline
Inline exige atrasar a solicitação de um módulo ou arquivo até que esse arquivo seja realmente necessário. Um exemplo básico seria assim:

```jsx
// VeryExpensive.tsx

import React, {Component} from 'react';
import {Text} from 'react-native';
// ... importe alguns módulos muito grande

// Você pode querer registrar no nível do arquivo para verificar quando isso está acontecendo
console.log('VeryExpensive component loaded');

export default class VeryExpensive extends Component {
  // muito e muito código
  render() {
    return <Text>Very Expensive Component</Text>;
  }
}
```


```jsx
// Optimized.tsx

import React, {Component} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

let VeryExpensive = null;

export default class Optimized extends Component {
  state = {needsExpensive: false};

  didPress = () => {
    if (VeryExpensive == null) {
      VeryExpensive = require('./VeryExpensive').default;
    }

    this.setState(() => ({
      needsExpensive: true,
    }));
  };

  render() {
    return (
      <View style={{marginTop: 20}}>
        <TouchableOpacity onPress={this.didPress}>
          <Text>Load</Text>
        </TouchableOpacity>
        {this.state.needsExpensive ? <VeryExpensive /> : null}
      </View>
    );
  }
}
```

Mesmo sem o formato RAM, as solicitações in-line podem levar a melhorias no tempo de inicialização, porque o código dentro do VeryExpensive.js só será executado quando for necessário pela primeira vez.

### Habilite o formato RAM
No iOS, usar o formato RAM criará um único arquivo indexado que reagirá nativamente e carregará um módulo por vez. No Android, por padrão, será criado um conjunto de arquivos para cada módulo. Você pode forçar o Android a criar um único arquivo, como o iOS, mas usar vários arquivos pode ter melhor desempenho e requer menos memória.

Habilite o formato RAM no Xcode editando a fase de construção "Bundle React Native code and images". Antes de `../node_modules/react-native/scripts/react-native-xcode.sh` adicione `export BUNDLE_COMMAND="ram-bundle"`:

```sh
export BUNDLE_COMMAND="ram-bundle"
export NODE_BINARY=node
../node_modules/react-native/scripts/react-native-xcode.sh
```

No Android, habilite o formato RAM editando seu arquivo `android/app/build.gradle`. Antes da linha `apply from: "../../node_modules/react-native/react.gradle"` adicione ou altere o bloco `project.ext.react`:

```
project.ext.react = [
  bundleCommand: "ram-bundle",
]
```

Use as seguintes linhas no Android se quiser usar um único arquivo indexado:

```
projeto.ext.react = [
   bundleCommand: "ram-bundle",
   extraPackagerArgs: ["--indexed-ram-bundle"]
]
```

> **INFORMAÇÕES**
> Se você estiver usando o [Hermes JS Engine](https://github.com/facebook/hermes), não deverá ter o recurso de pacotes de RAM ativado. No Hermes, ao carregar o bytecode, o `mmap` garante que o arquivo inteiro não seja carregado. Usar Hermes com pacotes de RAM pode causar problemas, porque esses mecanismos não são compatíveis entre si.

## Configurar pré-carregamento e requisitos embutidos
Agora que temos um pacote de RAM, há sobrecarga para chamar `require`. `require` agora precisa enviar uma mensagem pela ponte quando encontrar um módulo que ainda não foi carregado. Isso terá maior impacto na inicialização, porque é onde o maior número de chamadas require provavelmente ocorrerá enquanto o aplicativo carrega o módulo inicial. Felizmente podemos configurar uma parte dos módulos para serem pré-carregados. Para fazer isso, você precisará implementar alguma forma de importação in-line.

## Investigando os Módulos Carregados
No seu arquivo raiz (index.(ios|android).js) você pode adicionar o seguinte após as importações iniciais:

```js
const modules = require.getModules();
const moduleIds = Object.keys(modules);
const loadedModuleNames = moduleIds
  .filter(moduleId => modules[moduleId].isInitialized)
  .map(moduleId => modules[moduleId].verboseName);
const waitingModuleNames = moduleIds
  .filter(moduleId => !modules[moduleId].isInitialized)
  .map(moduleId => modules[moduleId].verboseName);

// certifique-se de que os módulos que você espera estarem aguardando, estão realmente esperando
console.log(
  'loaded:',
  loadedModuleNames.length,
  'waiting:',
  waitingModuleNames.length,
);

// pegue este blob de texto e coloque-o em um arquivo chamado packager/modulePaths.js
console.log(
  `module.exports = ${JSON.stringify(
    loadedModuleNames.sort(),
    null,
    2,
  )};`,
);
```

Ao executar seu aplicativo, você pode olhar no console e ver quantos módulos foram carregados e quantos estão aguardando. Você pode querer ler os `moduleNames` e ver se há alguma surpresa. Observe que os requisitos inline são invocados na primeira vez que as importações são referenciadas. Talvez seja necessário investigar e refatorar para garantir que apenas os módulos desejados sejam carregados na inicialização. Observe que você pode alterar o objeto `Systrace` em `require` para ajudar a depurar requisitos problemáticos.

```js
require.Systrace.beginEvent = message => {
  if (message.includes(problematicModule)) {
    throw new Error();
  }
};
```

Cada aplicativo é diferente, mas pode fazer sentido carregar apenas os módulos necessários para a primeira tela. Quando estiver satisfeito, coloque a saída de loadModuleNames em um arquivo chamado `packager/modulePaths.js`.

## Atualizando metro.config.js
Agora precisamos atualizar metro.config.js na raiz do projeto para usar nosso arquivo `modulePaths.js` recém-gerado:

```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const fs = require('fs');
const path = require('path');
const modulePaths = require('./packager/modulePaths');

const config = {
  transformer: {
    getTransformOptions: () => {
      const moduleMap = {};
      modulePaths.forEach(modulePath => {
        if (fs.existsSync(modulePath)) {
          moduleMap[path.resolve(modulePath)] = true;
        }
      });
      return {
        preloadedModules: moduleMap,
        transform: {inlineRequires: {blockList: moduleMap}},
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

Consulte também [Configurando o Metro](/docs/metro.md).

A entrada `preloadedModules` na configuração indica quais módulos devem ser marcados como pré-carregados ao construir um pacote de RAM. Quando o pacote é carregado, esses módulos são carregados imediatamente, antes mesmo de qualquer requerimento ser executado. A entrada `blockList` indica que esses módulos não devem ser necessários em linha. Como eles são pré-carregados, não há benefício de desempenho no uso de um require in-line. Na verdade, o JavaScript gerado gasta mais tempo resolvendo a necessidade inline toda vez que as importações são referenciadas.

## Teste e meça melhorias
Agora você deve estar pronto para criar seu aplicativo usando o formato RAM e os requisitos embutidos. Certifique-se de medir os tempos de inicialização antes e depois.
