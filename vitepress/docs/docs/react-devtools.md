# Ferramentas de desenvolvedor React

Você pode usar a [versão autônoma do React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools) para depurar a hierarquia de componentes do React. Para usá-lo, instale o pacote react-devtools globalmente:

::: code-group
```bash [npm]
npm install -g react-devtools
```
```bash [yarn]
yarn global add react-devtools
```
:::

Agora execute `react-devtools` no terminal para iniciar o aplicativo DevTools independente. Ele deve se conectar ao seu simulador em alguns segundos.

```bash
react-devtools
```

![image](/docs/assets/309739868-01361acc-6dcc-4519-a990-1e00dd02c666.png)

::: info Informações
Se preferir evitar instalações globais, você pode adicionar `react-devtools` como uma dependência do projeto. Adicione o pacote `react-devtools` ao seu projeto usando `npm install --save-dev react-devtools` e, em seguida, adicione `"react-devtools": "react-devtools"` à seção de scripts em seu `package.json` e execute `npm run react-devtools` da pasta do seu projeto para abrir o DevTools.
:::

## Integração com React Native Inspector

Abra o menu Dev e escolha "Toggle Inspector". Isso abrirá uma sobreposição que permite tocar em qualquer elemento da interface do usuário e ver informações sobre ele:

![image](/docs/assets/309740243-cc8fe788-5dbb-40ee-aceb-aa74e4ed643b.png)

No entanto, quando o `react-devtools` estiver em execução, o Inspector entrará em um modo recolhido e, em vez disso, usará o DevTools como UI principal. Neste modo, clicar em algo no simulador exibirá os componentes relevantes no DevTools:

<div class="one-image">
    <img src="/docs/assets/ReactDevToolsInspector-fed7286dac8ef8a793245cdd9d3d0f9c.gif" />
</div>

Você pode escolher "Toggle Inspector" no mesmo menu para sair deste modo.

## Depurando o estado do aplicativo

[Reactotron](https://github.com/infinitered/reactotron) é um aplicativo de desktop de código aberto que permite inspecionar o estado do aplicativo Redux ou MobX-State-Tree, bem como visualizar logs personalizados, executar comandos personalizados, como redefinir estado, armazenar e restaurar instantâneos de estado e outros recursos úteis de depuração para React Aplicativos nativos.

Você pode ver as [instruções de instalação no README](https://github.com/infinitered/reactotron). Se você estiver usando o Expo, aqui está um artigo detalhando como [instalar no Expo](https://shift.infinite.red/start-using-reactotron-in-your-expo-project-today-in-3-easy-steps-a03d11032a7a).

## Solução de problemas

::: tip **Dica**
Depois de executar o React DevTools, siga as instruções. Se seu aplicativo estava em execução antes de abrir o React DevTools, pode ser necessário abrir o [menu do desenvolvedor](https://reactnative.dev/docs/debugging#accessing-the-dev-menu) para conectá-los.

![image](/docs/assets/ReactDevToolsConnection-2fcfc362befab4699fd8afceefa5903e.gif)
:::

::: info **INFORMAÇÕES**
Se a conexão com o emulador for problemática (especialmente Android 12), tente executar `adb reverse tcp:8097 tcp:8097` em um novo terminal.
:::
