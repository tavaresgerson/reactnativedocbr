# Temporizadores
Os temporizadores são uma parte importante de um aplicativo e o React Native implementa os [temporizadores do navegador](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Timeouts_and_intervals).

## Temporizadores
* setTimeout, clearTimeout
* setInterval, clearInterval
* setImmediate, clearImmediate
* requestAnimationFrame, cancelAnimationFrame

`requestAnimationFrame(fn)` não é o mesmo que `setTimeout(fn, 0)` - o primeiro será acionado depois que todos os quadros forem liberados, enquanto o último será acionado o mais rápido possível (mais de 1000x por segundo em um iPhone 5S).

`setImmediate` é executado no final do bloco de execução JavaScript atual, logo antes de enviar a resposta em lote de volta ao nativo. Observe que se você chamar `setImmediate` dentro de um retorno de chamada `setImmediate`, ele será executado imediatamente, não retornará ao nativo no meio.

A implementação do `Promise` usa `setImmediate` como implementação de assincronicidade.

> **OBSERVAÇÃO**
> Ao depurar no Android, se os tempos entre o depurador e o dispositivo variaram; coisas como animação, comportamento de eventos, etc., podem não funcionar corretamente ou os resultados podem não ser precisos. Corrija isso executando `adb shell "date `date +%m%d%H%M%Y.%S%3N`"` em sua máquina depuradora. O acesso root é necessário para uso em dispositivos reais.

## Gerenciador de interação
Uma razão pela qual aplicativos nativos bem construídos parecem tão suaves é que evitam operações caras durante interações e animações. No React Native, atualmente temos uma limitação de que há apenas um único thread de execução JS, mas você pode usar o `InteractionManager` para garantir que o trabalho de longa execução seja programado para começar após a conclusão de quaisquer interações/animações.

Os aplicativos podem agendar tarefas para execução após interações como o seguinte:

```js
InteractionManager.runAfterInteractions(() => {
  // ...tarefa síncrona de longa duração...
});
```

Compare isso com outras alternativas de agendamento:

* `requestAnimationFrame()`: para código que anima uma visualização ao longo do tempo.
* `setImmediate`/`setTimeout`/`setInterval()`: execute o código mais tarde, observe que isso pode atrasar as animações.
* `runAfterInteractions()`: executa o código posteriormente, sem atrasar as animações ativas.

O sistema de tratamento de toque considera um ou mais toques ativos como uma 'interação' e atrasará os retornos de chamada `runAfterInteractions()`  até que todos os toques tenham terminado ou sejam cancelados.

O `InteractionManager` também permite que aplicativos registrem animações criando um 'identificador' de interação no início da animação e limpando-o após a conclusão:

```js
const handle = InteractionManager.createInteractionHandle();
// executar animação... (as tarefas `runAfterInteractions` estão na fila)
// mais tarde, na conclusão da animação:
InteractionManager.clearInteractionHandle(handle);
// tarefas enfileiradas serão executadas se todos os identificadores forem apagados
```
