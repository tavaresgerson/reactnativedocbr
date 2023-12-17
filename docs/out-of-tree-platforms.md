# Plataformas fora da árvore
React Native não é apenas para dispositivos Android e iOS - nossos parceiros e a comunidade mantêm projetos que levam o React Native para outras plataformas, como:

#### De parceiros

* [React Native macOS](https://github.com/microsoft/react-native-macos) - React Native para macOS e Cocoa.
* [React Native Windows](https://github.com/microsoft/react-native-windows) - React Native para a Plataforma Universal Windows (UWP) da Microsoft.

#### Da comunidade

* [React Native tvOS](https://github.com/react-native-tvos/react-native-tvos) - React Native para dispositivos Apple TV e Android TV.
* [React Native Web](https://github.com/necolas/react-native-web) - React Native na web usando React DOM.
* [React Native Skia](https://github.com/react-native-skia/react-native-skia) - React Native usando [Skia](https://skia.org/) como renderizador. Atualmente oferece suporte a Linux e macOS.


## Criando sua própria plataforma React Native
No momento, o processo de criação de uma plataforma React Native do zero não está muito bem documentado - um dos objetivos da próxima re-arquitetura ([Fabric](https://reactnative.dev/blog/2018/06/14/state-of-react-native-2018)) é facilitar a manutenção de uma plataforma.

### Bundling
A partir do React Native 0.57, agora você pode registrar sua plataforma React Native com o empacotador JavaScript do React Native, [Metro](https://facebook.github.io/metro/). Isso significa que você pode passar o `--platform example` para o pacote `npx react-native` e ele procurará arquivos JavaScript com o sufixo `.example.js`.

Para cadastrar sua plataforma no RNPM, o nome do seu módulo deve corresponder a um destes padrões:

* `react-native-example` - Ele irá pesquisar todos os módulos de nível superior que começam com `react-native-`
* `@org/react-native-example` - Procurará módulos que começam com `react-native-` em qualquer escopo
* `@react-native-example/module` - Ele pesquisará em todos os módulos sob escopos com nomes começando com `@react-native-`

Você também deve ter uma entrada em seu `package.json` assim:

```json
{
  "rnpm": {
    "haste": {
      "providesModuleNodeModules": ["react-native-example"],
      "platforms": ["example"]
    }
  }
}
```

`"providesModuleNodeModules"` é uma matriz de módulos que serão adicionados ao caminho de pesquisa do módulo Haste, e `"platforms"` é uma matriz de sufixos de plataforma que serão adicionados como plataformas válidas.
