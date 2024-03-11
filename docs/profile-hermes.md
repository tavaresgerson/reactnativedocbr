# Perfil com Hermes
Você pode visualizar o desempenho do JavaScript em um aplicativo React Native usando [Hermes](https://github.com/facebook/hermes). Hermes é um mecanismo JavaScript pequeno e leve otimizado para executar React Native (você pode ler mais sobre [como usá-lo com React Native aqui](/docs/hermes.md)). Hermes ajuda a melhorar o desempenho do aplicativo e também expõe maneiras de analisar o desempenho do JavaScript que ele executa.

Nesta seção, você aprenderá como criar o perfil de seu aplicativo React Native em execução no Hermes e como visualizar o perfil usando a guia [Desempenho no Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference)

> **CUIDADO**
> Certifique-se de [ativar o Hermes](/docs/hermes.md) em seu aplicativo antes de começar!

Siga as instruções abaixo para começar a criar o perfil:

* Grave um perfil de amostragem Hermes
* Execute o comando da CLI
* Abra o perfil baixado no Chrome DevTools

## Grave um perfil de amostragem Hermes
Para gravar um perfil de amostragem no menu Dev:

1. Navegue até o terminal do servidor Metro em execução.
2. Pressione `d` para abrir o **menu Dev**.
3. Selecione **Enable Sampling Profiler**.
4. Execute seu JavaScript em seu aplicativo (pressione botões, etc.)
5. Abra o **menu Dev** pressionando `d` novamente.
6. Selecione **Disable Sampling Profiler** para interromper a gravação e salvar o sampler profiler.

Um toast mostrará o local onde o criador de perfil de amostragem foi salvo, geralmente em `/data/user/0/com.appName/cache/*.cpuprofile`

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/0228b86b-8078-47ff-be37-4341b87bc35b)

## Execute o comando da CLI
Você pode usar a CLI do React Native para converter o perfil de rastreamento Hermes em perfil de rastreamento do Chrome e, em seguida, enviá-lo para sua máquina local usando:

```
npx react-native profile-hermes [diretorioDestino]
```

### Habilitando mapa de origem

> **INFORMAÇÕES**
> Você pode ler sobre [mapas de origem](/docs/sourcemaps.md) na página de mapas de origem.

### Erros comuns

`adb: no devices/emulators found` ou `adb: device offline`

* **Por que isso acontece:** A CLI não pode acessar o dispositivo ou emulador (por meio do adb) que você está usando para executar o aplicativo.
* **Como corrigir:** Certifique-se de que seu dispositivo/emulador Android esteja conectado e funcionando. O comando só funciona quando pode acessar o adb.

`There is no file in the cache/ directory`
* **Por que isso acontece:** A CLI não consegue encontrar nenhum arquivo `.cpuprofile` no diretório `cache/` do seu aplicativo. Você pode ter esquecido de gravar um perfil do dispositivo.
* **Como corrigir:** Siga as instruções para ativar/desativar o criador de perfil do dispositivo.

`Erro: your_profile_name.cpuprofile é um arquivo vazio`

* **Por que isso acontece:** O perfil está vazio, pode ser porque o Hermes não está funcionando corretamente.
* **Como corrigir:** Certifique-se de que seu aplicativo esteja rodando na versão mais recente do Hermes.

## Abra o perfil baixado no Chrome DevTools
Para abrir o perfil no Chrome DevTools:

1. Abra o Chrome DevTools.
2. Selecione a guia **Performance**.
3. Clique com o botão direito e escolha **Carregar perfil...**

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/cbc1a9ed-d094-49fb-9e4e-98ccf0043b35)

## Como funciona o transformador de perfil Hermes?
O Hermes Sample Profile tem o formato de `objeto JSON`, enquanto o formato suportado pelo DevTools do Google é `JSON Array Format`. (Mais informações sobre os formatos podem ser encontradas no documento [Trace Event Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview))

```js
export interface HermesCPUProfile {
  traceEvents: SharedEventProperties[];
  samples: HermesSample[];
  stackFrames: {[key in string]: HermesStackFrame};
}
```

O perfil Hermes tem a maior parte de suas informações codificadas nas amostras (samples) e nas propriedades stackFrames. Cada amostra é um instantâneo da pilha de chamadas de função naquele carimbo de data/hora específico, pois cada amostra possui uma propriedade `sf` que corresponde a uma chamada de função.

```js
export interface HermesSample {
  cpu: string;
  name: string;
  ts: string;
  pid: number;
  tid: string;
  weight: string;
  /**
   * Irá se referir a um elemento no objeto stackFrames do Perfil Hermes
   */
  sf: number;
  stackFrameData?: HermesStackFrame;
}
```

As informações sobre uma chamada de função podem ser encontradas em `stackFrames` que contém pares chave-objeto, onde a chave é o número `sf` e o objeto correspondente nos fornece todas as informações relevantes sobre a função, incluindo o número `sf` de sua função pai. Esse relacionamento pai-filho pode ser rastreado para cima para encontrar as informações de todas as funções em execução em um carimbo de data/hora específico.

```js
export interface HermesStackFrame {
  line: string;
  column: string;
  funcLine: string;
  funcColumn: string;
  name: string;
  category: string;
  /**
   * Uma função pai pode ou não existir
   */
  parent?: number;
}
```

Neste ponto, você deve definir mais alguns termos, a saber:

1. Nós: os objetos correspondentes aos números `sf` em `stackFrames`
2. Nós ativos: os nós que estão atualmente em execução em um carimbo de data/hora específico. Um nó é classificado como em execução se seu número `sf` estiver na pilha de chamadas de função. Esta pilha de chamadas pode ser obtida a partir do número `sf` da amostra e rastreada para cima até que os `sf`s pai estejam disponíveis

As amostras e os `stackFrames` em conjunto podem então ser usados para gerar todos os eventos de início e término nos carimbos de data/hora correspondentes, em que:

1. Nós/Eventos iniciais: nós ausentes na pilha de chamadas de função da amostra anterior, mas presentes na amostra atual.
2. Nós finais/eventos: nós presentes na pilha de chamadas de função da amostra anterior, mas ausentes na amostra atual.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/f2cb7952-3230-4efc-9956-6fc4ea615536)

Agora você pode construir um `flamechart` de chamadas de função, pois possui todas as informações da função, incluindo seus carimbos de data e hora de início e término.

O hermes-profile-transformer pode converter qualquer perfil gerado usando Hermes em um formato que pode ser exibido diretamente no Chrome DevTools. Mais informações sobre isso podem ser encontradas em [@react-native-community/hermes-profile-transformer](https://github.com/react-native-community/hermes-profile-transformer).
