## Conceitos chave
Os segredos para integrar componentes React Native em seu aplicativo Android são:

1. Configure as dependências e a estrutura de diretórios do React Native.
2. Desenvolva seus componentes React Native em JavaScript.
3. Adicione um `ReactRootView` ao seu aplicativo Android. Esta visualização servirá como contêiner para seu componente React Native.
4. Inicie o servidor React Native e execute seu aplicativo nativo.
5. Verifique se o aspecto do React Native no seu aplicativo funciona conforme o esperado.

### Pré-requisitos
Siga o início rápido do [React Native CLI](/docs/environment-setup.md) no guia de configuração do ambiente para configurar seu ambiente de desenvolvimento para construir aplicativos React Native para Android.

1. Configure a estrutura de diretórios
Para garantir uma experiência tranquila, crie uma nova pasta para seu projeto React Native integrado e copie seu projeto Android existente para uma subpasta `/android`.

2. Instale dependências JavaScript
Vá para o diretório raiz do seu projeto e crie um novo arquivo `package.json` com o seguinte conteúdo:
```
{
  "name": "MyReactNativeApp",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "react-native start"
  }
}
```

Em seguida, instale os pacotes `react` e `react-native`. Abra um terminal ou prompt de comando, navegue até o diretório com seu arquivo `package.json` e execute:

```bash
npm install react-native
# Ou
yarn add react-native
```

Isso imprimirá uma mensagem semelhante à seguinte (role para cima na saída do yarn para vê-la):

> ```bash
> warning "react-native@0.70.5" has unmet peer dependency "react@18.1.0"
> ``` 
Tudo bem, significa que também precisamos instalar o React:
