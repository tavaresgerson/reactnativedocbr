# Simbolizando um rastreamento de pilha

Se um aplicativo React Native lançar uma exceção não tratada em uma compilação de lançamento, a saída poderá ficar ofuscada e difícil de ler:

```bash
07-15 10:58:25.820 18979 18998 E AndroidRuntime: FATAL EXCEPTION: mqt_native_modules
07-15 10:58:25.820 18979 18998 E AndroidRuntime: Process: com.awesomeproject, PID: 18979 07-15 10:58:25.820 18979 18998 E AndroidRuntime: com.facebook.react.common.JavascriptException: Failed, js engine: hermes, stack:
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132161
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132084
07-15 10:58:25.820 18979 18998 E AndroidRuntime: f@1:131854
07-15 10:58:25.820 18979 18998 E AndroidRuntime: anonymous@1:131119
```

As seções como `p@1:132161` são nomes de funções reduzidos e deslocamentos de bytecode. Para depurar o problema, você deve traduzi-lo em nome de arquivo, linha e função: `AwesomeProject/App.js:54:initializeMap`. Isso é conhecido como simbolização. Você pode simbolizar nomes de funções minificados e bytecode como acima, passando `metro-symbolicate` um mapa de origem gerado e o rastreamento de pilha.

::: info INFORMAÇÃO
O pacote `metro-symbolicate` é instalado por padrão no projeto de modelo React Native ao [configurar seu ambiente de desenvolvimento](/docs/environment-setup.md).
:::

De um arquivo contendo o stacktrace:

```bash
npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map < stacktrace.txt
```

Diretamente do `adb logcat`:

```bash
adb logcat -d | npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map
```

Isso transformará cada nome de função minificado e deslocamento como `p@1:132161` no nome real do arquivo e da função `AwesomeProject/App.js:54:initializeMap`.

## Notas sobre mapas de origem

* Vários mapas de origem podem ser gerados pelo processo de construção. Certifique-se de usar aquele no local mostrado nos exemplos.
* Certifique-se de que o mapa de origem usado corresponda ao commit exato do aplicativo com falha. Pequenas alterações no código-fonte podem causar grandes diferenças nos deslocamentos.
* Se o `metro-symbolicate` sair imediatamente com sucesso, certifique-se de que a entrada venha de um pipe ou redirecionamento e não de um terminal.
