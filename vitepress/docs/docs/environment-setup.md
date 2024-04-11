# Configurando o ambiente de desenvolvimento

Esta página te ajudará a instalar e construir seu primeiro aplicativo React Native.

**Se você é novo no desenvolvimento móvel**, a maneira mais fácil de começar é com o Expo Go. Expo é um conjunto de ferramentas e serviços construídos em torno do React Native e, embora tenha [muitos recursos](https://docs.expo.dev/), o recurso mais relevante para nós no momento é que você pode escrever um aplicativo React Native em minutos. Você só precisará de uma versão recente do Node.js e de um telefone ou emulador. Se quiser experimentar o React Native diretamente em seu navegador antes de instalar qualquer ferramenta, você pode experimentar o [Snack](https://snack.expo.dev/).

**Se você já está familiarizado com o desenvolvimento móvel**, você pode querer usar o React Native CLI. Requer Xcode ou Android Studio para começar. Se você já tiver uma dessas ferramentas instalada, poderá colocá-la em funcionamento em alguns minutos. Se eles não estiverem instalados, você deverá gastar cerca de uma hora instalando-os e configurando-os.

## Expo Go Início Rápido

Execute o seguinte comando para criar um novo projeto React Native chamado "AwesomeProject":

::: code-group
```bash [npm]
npx create-expo-app AwesomeProject

cd AwesomeProject
npx expo start
```

```bash [yarn]
yarn create expo-app AwesomeProject

cd AwesomeProject
yarn expo start
```
:::

Isso iniciará um servidor de desenvolvimento para você.

### Executando seu aplicativo React Native
Instale o aplicativo [Expo Go](https://expo.dev/client) em seu telefone iOS ou Android e conecte-se à mesma rede sem fio do seu computador. No Android, use o aplicativo Expo Go para escanear o código QR do seu terminal para abrir seu projeto. No iOS, use o leitor de código QR integrado do aplicativo iOS Camera padrão.

## React Native CLI Início Rápido
Siga estas instruções se precisar criar código nativo em seu projeto. Por exemplo, se você estiver integrando o React Native em um aplicativo existente ou se executou o "prebuild" do Expo para gerar o código nativo do seu projeto, você precisará desta seção.

As instruções são um pouco diferentes dependendo do seu sistema operacional de desenvolvimento e se você deseja começar a desenvolver para iOS ou Android. Se você deseja desenvolver para Android e iOS, tudo bem - você pode escolher um para começar, já que a configuração é um pouco diferente.

### macOS

* [Android](/docs/environment-setup/mac-os/android.md)
* [iOS](/docs/environment-setup/mac-os/ios.md)

### Windows
* [Android](/docs/environment-setup/windows/android.md)
* iOS _(Não compatível)_

### Linux
* [Android](/docs/environment-setup/linux/android.md)
* iOS _(Não compatível)_
