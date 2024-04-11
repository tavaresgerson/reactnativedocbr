# Android (Kotlin)

## Conceitos chave
Os segredos para integrar componentes React Native em seu aplicativo Android são:

1. Configure as dependências e a estrutura de diretórios do React Native.
2. Desenvolva seus componentes React Native em JavaScript.
3. Adicione um `ReactRootView` ao seu aplicativo Android. Esta visualização servirá como contêiner para seu componente React Native.
4. Inicie o servidor React Native e execute seu aplicativo nativo.
5. Verifique se o aspecto do seu aplicativo React Native funciona conforme o esperado.

## Pré-requisitos
Siga o início rápido do React Native CLI no guia de [configuração do ambiente](/docs/environment-setup.md) para configurar seu ambiente de desenvolvimento para construir aplicativos React Native para Android.

1. Configure a estrutura de diretórios
Para garantir uma experiência tranquila, crie uma nova pasta para seu projeto React Native integrado e copie seu projeto Android existente para uma subpasta `/android`.

2. Instale as dependências do JavaScript
Vá para o diretório raiz do seu projeto e crie um novo arquivo `package.json` com o seguinte conteúdo:

```json
{
  "name": "MyReactNativeApp",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "yarn react-native start"
  }
}
```

Em seguida, instale os pacotes `react` e `react-native`. Abra um terminal ou prompt de comando, navegue até o diretório com seu arquivo `package.json` e execute:

::: code-group
```bash [npm]
npm install react-native
```
```bash [yarn]
yarn add react-native
```
:::

Isso imprimirá uma mensagem semelhante à seguinte (role para cima na saída do fio para vê-la):

::: warning Atenção
O pacote `"react-native@0.70.5"` tem dependência de peer não atendida de `"react@18.1.0"`
:::

Tudo bem, significa que também precisamos instalar o React:

::: code-group
```bash [npm]
npm install react@version_printed_above
```

```bash [yarn]
yarn add react@version_printed_above
```
:::

Yarn/npm criou uma nova pasta `/node_modules`. Esta pasta armazena todas as dependências JavaScript necessárias para construir seu projeto.

Adicione `node_modules/` ao seu arquivo `.gitignore`.

## Adicionando React Native ao seu aplicativo

### Configurando o Gradle
React Native usa o plugin `React Native Gradle` para configurar suas dependências e configuração do projeto.

Primeiro, vamos editar seu arquivo `settings.gradle` adicionando esta linha:

```
includeBuild('../node_modules/@react-native/gradle-plugin')
```

Então você precisa abrir seu `build.gradle` de nível superior e incluir esta linha:

```
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:7.3.1")
        classpath("com.facebook.react:react-native-gradle-plugin") // [!code focus]
    }
}
```

Isso garante que o plugin React Native Gradle esteja disponível em seu projeto. Por fim, adicione essas linhas ao arquivo `build.gradle` do seu aplicativo (é um arquivo `build.gradle` diferente dentro da pasta do seu aplicativo):

```
apply plugin: "com.android.application"
apply plugin: "com.facebook.react" // [!code focus]

repositories {
    mavenCentral()
}

dependencies {
    // Outras dependências aqui
    implementation "com.facebook.react:react-android" // [!code focus]
    implementation "com.facebook.react:hermes-android" // [!code focus]
}
```

Essas dependências estão disponíveis em `mavenCentral()`, portanto, certifique-se de tê-las definidas no `repositories {}`.

::: tip **INFORMAÇÕES**
Intencionalmente não especificamos a versão para essas dependências de `implementation`, pois o React Native Gradle Plugin cuidará disso. Se você não usar o plugin React Native Gradle, terá que especificar a versão manualmente.
:::

## Habilitar autolinking de módulos nativos
Para usar o poder do [autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md), temos que aplicá-lo em alguns lugares. Primeiro adicione a seguinte entrada em `settings.gradle`:

```
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)
```

Em seguida, adicione a seguinte entrada na parte inferior do `app/build.gradle`:

```
apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)
```

## Configurando permissões
Em seguida, certifique-se de ter permissão de Internet em seu `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Se você precisar acessar `DevSettingsActivity`, adicione ao seu AndroidManifest.xml:

```xml
<activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
```

Isso só é usado no modo de desenvolvimento ao recarregar o JavaScript do servidor de desenvolvimento, portanto, você pode removê-lo nas compilações de lançamento, se necessário.

## Tráfego de texto simples (nível de API 28+)

::: tip Dica
A partir do Android 9 (API de nível 28), o tráfego de texto não criptografado é desativado por padrão; isso evita que seu aplicativo se conecte ao empacotador [Metro](https://facebook.github.io/metro/). As alterações abaixo permitem tráfego de texto não criptografado em compilações de depuração.
:::

1. Aplique a opção `usesCleartextTraffic` ao seu Debug `AndroidManifest.xml`

```xml
<!-- ... -->
<application
  android:usesCleartextTraffic="true" tools:targetApi="28" >
  <!-- ... -->
</application>
<!-- ... -->
```

Isso não é necessário para compilações de versão.

Para saber mais sobre a configuração de segurança de rede e a política de tráfego de texto não criptografado, consulte este [link](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted).

## Integração de código

Agora vamos modificar o aplicativo Android nativo para integrar o React Native.

### O componente React Native

O primeiro código que escreveremos é o código React Native real para a nova tela "High Score" que será integrada em nosso aplicativo.

#### 1. Crie um arquivo `index.js`

Primeiro, crie um arquivo `index.js` vazio na raiz do seu projeto React Native.

`index.js` é o ponto de partida para aplicativos React Native e é sempre necessário. Pode ser um arquivo pequeno que `require` outro arquivo que faça parte do seu componente ou aplicativo React Native, ou pode conter todo o código necessário para ele. No nosso caso, colocaremos tudo em `index.js`.

#### 2. Adicione seu código React Native

No seu `index.js`, crie seu componente. Em nosso exemplo aqui, adicionaremos um componente `<Text>` dentro de um `<View>` estilizado:

```jsx
import React from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';

const HelloWorld = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Hello, World</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent(
  'MyReactNativeApp',
  () => HelloWorld,
);
```

#### 3. Configure permissões para sobreposição de erros de desenvolvimento

Se o seu aplicativo for direcionado à API Android de nível 23 ou superior, verifique se você tem a permissão `android.permission.SYSTEM_ALERT_WINDOW` ativada para a compilação de desenvolvimento. Você pode verificar isso com `Settings.canDrawOverlays(this)`. Isso é necessário em compilações de desenvolvimento porque os erros de desenvolvimento do React Native devem ser exibidos acima de todas as outras janelas. Devido ao novo sistema de permissões introduzido na API nível 23 (Android M), o usuário precisa aprová-lo. Isso pode ser conseguido adicionando o seguinte código ao método `onCreate()` da sua Activity.

```
companion object {
    const val OVERLAY_PERMISSION_REQ_CODE = 1  // Escolha qualquer valor
}

...

if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
    if(!Settings.canDrawOverlays(this)) {
        val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                    Uri.parse("package: $packageName"))
        startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
    }
}
```

Finalmente, o método `onActivityResult()` (conforme mostrado no código abaixo) deve ser substituído para lidar com os casos de permissão aceita ou negada para um UX consistente. Além disso, para integrar módulos nativos que usam `startActivityForResult`, precisamos passar o resultado para o método `onActivityResult` de nossa instância `ReactInstanceManager`.

```kotlin
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                // SYSTEM_ALERT_WINDOW permission not granted
            }
        }
    }
    reactInstanceManager?.onActivityResult(this, requestCode, resultCode, data)
}
```

### A mágica: ReactRootView
Vamos adicionar algum código nativo para iniciar o runtime do React Native e solicitar que ele renderize nosso componente JS. Para fazer isso, vamos criar uma `Activity` que cria um `ReactRootView`, inicia um aplicativo React dentro dele e o define como a visualização de conteúdo principal.

Se você estiver direcionando a versão Android <5, use a classe `AppCompatActivity` do pacote `com.android.support:appcompat` em vez de `Activity`.

```kotlin
class MyReactActivity : Activity(), DefaultHardwareBackBtnHandler {
    private lateinit var reactRootView: ReactRootView
    private lateinit var reactInstanceManager: ReactInstanceManager
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        SoLoader.init(this, false)
        reactRootView = ReactRootView(this)
        val packages: List<ReactPackage> = PackageList(application).packages

        // Pacotes que ainda não podem ser vinculados automaticamente podem ser adicionados manualmente aqui, por exemplo:
        // packages.add(MyReactNativePackage())
        // Lembre-se de incluí-los em `settings.gradle` e `app/build.gradle` também.
        reactInstanceManager = ReactInstanceManager.builder()
            .setApplication(application)
            .setCurrentActivity(this)
            .setBundleAssetName("index.android.bundle")
            .setJSMainModulePath("index")
            .addPackages(packages)
            .setUseDeveloperSupport(BuildConfig.DEBUG)
            .setInitialLifecycleState(LifecycleState.RESUMED)
            .build()

        // A string aqui (por exemplo, "MyReactNativeApp") deve corresponder
        // a string em AppRegistry.registerComponent() em index.js
        reactRootView?.startReactApplication(reactInstanceManager, "MyReactNativeApp", null)
        setContentView(reactRootView)
    }

    override fun invokeDefaultOnBackPressed() {
        super.onBackPressed()
    }
}
```

Se você estiver usando um kit inicial para React Native, substitua a string `"HelloWorld"` pela do seu arquivo `index.js` (é o primeiro argumento para o método `AppRegistry.registerComponent()`).

Execute uma operação “Sync Project files with Gradle”.

Se você estiver usando o Android Studio, use `Alt + Enter` para adicionar todas as importações ausentes em sua classe `MyReactActivity`. Tenha cuidado ao usar o `BuildConfig` do seu pacote e não o do pacote `facebook`.

Precisamos definir o tema de `MyReactActivity` como `Theme.AppCompat.Light.NoActionBar` porque alguns componentes da UI do React Native dependem deste tema.

```
<activity
  android:name=".MyReactActivity"
  android:label="@string/app_name"
  android:theme="@style/Theme.AppCompat.Light.NoActionBar">
</activity>
```

::: tip Nota
Um `ReactInstanceManager` pode ser compartilhado por múltiplas atividades e/ou fragmentos. Você desejará criar seu próprio `ReactFragment` ou `ReactActivity` e ter um suporte singleton que contenha um `ReactInstanceManager`. Quando você precisar do `ReactInstanceManager` (por exemplo, para conectar o `ReactInstanceManager` ao ciclo de vida dessas atividades ou fragmentos), use aquele fornecido pelo singleton.
:::

Em seguida, precisamos passar alguns retornos de chamada do ciclo de vida da atividade para `ReactInstanceManager` e `ReactRootView`:

```kotlin
override fun onPause() {
    super.onPause()
    reactInstanceManager.onHostPause(this)
}

override fun onResume() {
    super.onResume()
    reactInstanceManager.onHostResume(this, this)
}

override fun onDestroy() {
    super.onDestroy()
    reactInstanceManager.onHostDestroy(this)
    reactRootView.unmountReactApplication()
}
```

Também precisamos passar de volta os eventos do botão para o React Native:

```kotlin
override fun onBackPressed() {
    reactInstanceManager.onBackPressed()
    super.onBackPressed()
}
```

Isso permite que o JavaScript controle o que acontece quando o usuário pressiona o botão Voltar do hardware (por exemplo, para implementar a navegação). Quando o JavaScript não controla o pressionamento do botão Voltar, seu método `invocaDefaultOnBackPressed` será chamado. Por padrão, isso encerra sua `Activity`.

Finalmente, precisamos conectar o menu de desenvolvimento. Por padrão, isso é ativado agitando (intensamente) o dispositivo, mas isso não é muito útil em emuladores. Então, mostramos isso quando você pressiona o botão do menu de hardware (use `Ctrl` + `M` se estiver usando o emulador do Android Studio):

```kt
override fun onKeyUp(keyCode: Int, event: KeyEvent?): Boolean {
    if (keyCode == KeyEvent.KEYCODE_MENU && reactInstanceManager != null) {
        reactInstanceManager.showDevOptionsDialog()
        return true
    }
    return super.onKeyUp(keyCode, event)
}
```

Agora sua atividade está pronta para executar algum código JavaScript.

## Teste sua integração
Agora você executou todas as etapas básicas para integrar o React Native ao seu aplicativo atual. Agora iniciaremos o empacotador [Metro](https://facebook.github.io/metro/) para construir o pacote `index.bundle` e o servidor rodando em localhost para servi-lo.

### 1. Execute o empacotador
Para executar seu aplicativo, primeiro você precisa iniciar o servidor de desenvolvimento. Para fazer isso, execute o seguinte comando no diretório raiz do seu projeto React Native:

::: code-group
```bash [npm]
npm start
```
```bash [yarn]
yarn start
```
:::

### 2. Execute o aplicativo
Agora crie e execute seu aplicativo Android normalmente.

Assim que você atingir sua atividade com React dentro do aplicativo, ele deverá carregar o código JavaScript do servidor de desenvolvimento e exibir:

![image](/docs/assets/289311225-21b28d91-4031-4e02-bbcd-0232c1c24a16.png)

## Criando uma versão de lançamento no Android Studio
Você também pode usar o Android Studio para criar suas versões de lançamento! É tão rápido quanto criar versões de lançamento do seu aplicativo Android nativo já existente.

Se você usar o plugin React Native Gradle conforme descrito acima, tudo deverá funcionar ao executar o aplicativo do Android Studio.

Se você não estiver usando o plugin React Native Gradle, há uma etapa adicional que você terá que executar antes de cada versão. Você precisa executar o seguinte para criar um pacote React Native, que será incluído em seu aplicativo Android nativo:

```bash
$ npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/com/your-company-name/app-package-name/src/main/assets/index.android.bundle --assets-dest android/com/your-company-name/app-package-name/src/main/res/
```

::: tip Nota
Não se esqueça de substituir os caminhos pelos corretos e criar a pasta de ativos caso ela não exista.
:::

Agora, crie uma versão de lançamento do seu aplicativo nativo no Android Studio, como de costume, e você estará pronto para prosseguir!

## E agora?
Neste ponto, você pode continuar desenvolvendo seu aplicativo normalmente. Consulte nossos documentos de [depuração](/docs/debugging.md) e [implantação](/docs/running-on-device.md) para saber mais sobre como trabalhar com React Native.
