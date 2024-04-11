# Publicação na Google Play Store

O Android exige que todos os aplicativos sejam assinados digitalmente com um certificado antes de serem instalados. Para distribuir seu aplicativo Android pela [Google Play Store](https://play.google.com/store), ele precisa ser assinado com uma chave de versão que deverá ser usada em todas as atualizações futuras. Desde 2017, o Google Play pode gerenciar versões de assinatura automaticamente graças à funcionalidade [App Signing by Google Play](https://developer.android.com/studio/publish/app-signing#app-signing-google-play) . No entanto, antes de o binário do seu aplicativo ser carregado no Google Play, ele precisa ser assinado com uma chave de upload. A página [Assinando seus aplicativos](https://developer.android.com/tools/publishing/app-signing.html) na documentação para desenvolvedores Android descreve o tópico em detalhes. Este guia aborda resumidamente o processo, bem como lista as etapas necessárias para empacotar o pacote JavaScript.

::: info INFORMAÇÃO
Se você estiver usando a Expo, leia o guia da Expo para [Implantação nas App Stores](https://docs.expo.dev/distribution/app-stores/) para criar e enviar seu aplicativo para a Google Play Store. Este guia funciona com qualquer aplicativo React Native para automatizar o processo de implantação.
:::

## Gerando uma chave de upload

Você pode gerar uma chave de assinatura privada usando `keytool`.

### Windows

No Windows `keytool` deve ser executado em `C:\Program Files\Java\jdkx.x.x_x\bin`, como administrador.

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Este comando solicita senhas para o keystore e a chave para os campos "Distinguished Name" da sua chave. Em seguida, ele gera o keystore como um arquivo chamado `my-upload-key.keystore`.

O keystore contém uma única chave, válida por 10.000 dias. O alias é um nome que você usará posteriormente ao assinar seu aplicativo, portanto, lembre-se de anotar o alias.

### Mac OS

No macOS, se você não tiver certeza de onde está a pasta bin do JDK, execute o seguinte comando para localizá-la:

```bash
/usr/libexec/java_home
```

Ele gerará o diretório do JDK, que será parecido com isto:

```bash
/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home
```

Navegue até esse diretório usando o comando `cd /your/jdk/path` e use o comando keytool com permissão sudo conforme mostrado abaixo.

```bash
sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

::: warning ATENÇÃO
Lembre-se de manter o arquivo keystore privado. Caso você tenha perdido a chave de upload ou ela tenha sido comprometida, [siga estas instruções](https://support.google.com/googleplay/android-developer/answer/7384423#reset).
:::

## Configurando variáveis ​​Gradle

1. Coloque o arquivo `my-upload-key.keystore` no diretório `android/app` na pasta do seu projeto.
2. Edite o arquivo `~/.gradle/gradle.properties` ou `android/gradle.properties` e adicione o seguinte (substitua `*****` pela senha correta do keystore, alias e senha da chave),

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

Essas serão variáveis ​​globais do Gradle, que poderemos usar posteriormente em nossa configuração do Gradle para assinar nosso aplicativo.

::: info Nota sobre o uso do git
Salvar as variáveis ​​Gradle acima em `~/.gradle/gradle.properties` em vez de `android/gradle.properties` impede que elas sejam registradas no git. Talvez seja necessário criar o arquivo `~/.gradle/gradle.properties` no diretório inicial do usuário antes de adicionar as variáveis.
:::

::: info Nota sobre segurança
Se você não deseja armazenar suas senhas em texto simples e estiver executando o macOS, você também pode [armazenar suas credenciais no aplicativo Keychain Access](https://pilloxa.gitlab.io/posts/safer-passwords-in- grau/). Então você pode pular as duas últimas linhas em `~/.gradle/gradle.properties`.
:::

## Adicionando configuração de assinatura à configuração Gradle do seu aplicativo

A última etapa de configuração que precisa ser feita é configurar as compilações de versão para serem assinadas usando a chave de upload. Edite o arquivo `android/app/build.gradle` na pasta do seu projeto e adicione a configuração de assinatura,

```
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```

## Gerando uma release AAB

Execute o seguinte comando em um terminal:

```bash
npx react-native build-android --mode=release
```

Este comando usa o `bundleRelease` do Gradle que agrupa todo o JavaScript necessário para executar seu aplicativo no AAB ([Android App Bundle](https://developer.android.com/guide/app-bundle)). Se você precisar alterar a forma como o pacote JavaScript e/ou os recursos drawable são agrupados (por exemplo, se você alterou os nomes de arquivos/pastas padrão ou a estrutura geral do projeto), dê uma olhada em `android/app/build.gradle` para ver como você pode atualizá-lo para refletir essas alterações.

::: info INFORMAÇÃO
Certifique-se de que `gradle.properties` não inclua `org.gradle.configureondemand=true`, pois isso fará com que a compilação de lançamento ignore o agrupamento de JS e ativos no binário do aplicativo.
:::

O AAB gerado pode ser encontrado em `android/app/build/outputs/bundle/release/app-release.aab` e está pronto para ser carregado no Google Play.

Para que o Google Play aceite o formato AAB, a assinatura de aplicativos do Google Play precisa ser configurada para seu aplicativo no Google Play Console. Se você estiver atualizando um aplicativo existente que não usa a assinatura de aplicativos do Google Play, consulte a _seção de migração_ para aprender como realizar essa alteração na configuração.

## Testando a versão de lançamento do seu aplicativo

Antes de enviar a versão de lançamento para a Play Store, teste-a completamente. Primeiro desinstale qualquer versão anterior do aplicativo que você já instalou. Instale-o no dispositivo usando o seguinte comando na raiz do projeto:

::: code-group
```bash [npm]
npm run android -- --mode="release"
```

```bash [yarn]
yarn android --mode release
```
:::

Observe que `--mode release` só está disponível se você configurou a assinatura conforme descrito acima.

Você pode encerrar qualquer instância do bundler em execução, já que toda a estrutura e o código JavaScript estão agrupados nos ativos do APK.

## Publicação em outras lojas

Por padrão, o APK gerado possui o código nativo para as arquiteturas de CPU `x86`, `x86_64`, `ARMv7a` e `ARM64-v8a`. Isso facilita o compartilhamento de APKs executados em quase todos os dispositivos Android. No entanto, isso tem a desvantagem de que haverá algum código nativo não utilizado em qualquer dispositivo, levando a APKs desnecessariamente maiores.

Você pode criar um APK para cada CPU adicionando a seguinte linha em seu arquivo `android/app/build.gradle`:

```
android {

    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
        }
    }

}
```

Faça upload desses arquivos para mercados que oferecem suporte à segmentação por dispositivo, como [Amazon AppStore](https://developer.amazon.com/docs/app-submission/device-filtering-and-compatibility.html) ou [F-Droid]( https://f-droid.org/en/), e os usuários obterão automaticamente o APK apropriado. Se você quiser fazer upload para outros mercados, como [APKFiles](https://www.apkfiles.com/), que não suportam vários APKs para um único aplicativo, altere a linha `universalApk false` para `true` para crie o APK universal padrão com binários para ambas as CPUs.

Observe que você também terá que configurar códigos de versão distintos, conforme [sugerido nesta página](https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions) do site oficial da Documentação do Android.

## Habilitando o Proguard para reduzir o tamanho do APK (opcional)

Proguard é uma ferramenta que pode reduzir ligeiramente o tamanho do APK. Isso é feito removendo partes do bytecode React Native Java (e suas dependências) que seu aplicativo não está usando.

::: warning Importante
Certifique-se de testar completamente seu aplicativo se você ativou o Proguard. O Proguard geralmente requer configuração específica para cada biblioteca nativa que você está usando. Consulte `app/proguard-rules.pro`.
:::

Para ativar o Proguard, edite `android/app/build.gradle`:

```
/**
 * Execute o Proguard para reduzir o bytecode Java em compilações de lançamento.
 */
def enableProguardInReleaseBuilds = true
```

## Migrando aplicativos antigos do Android React Native para usar o App Signing do Google Play

Se você estiver migrando da versão anterior do React Native, é provável que seu aplicativo não use o recurso App Signing by Google Play. Recomendamos que você habilite isso para aproveitar recursos como a divisão automática de aplicativos. Para migrar da forma antiga de assinatura, você precisa começar [gerando nova chave de upload](#generating-an-upload-key) e, em seguida, substituindo a configuração de assinatura de lançamento em `android/app/build.gradle` para usar o chave de upload em vez da de lançamento (consulte a seção sobre [adicionando configuração de assinatura ao gradle](#adding-signing-config-to-your-apps-gradle-config)). Feito isso, siga as [instruções do site de ajuda do Google Play](https://support.google.com/googleplay/android-developer/answer/7384423) para enviar sua chave de versão original ao Google Play.

## Permissões padrão

Por padrão, a permissão `INTERNET` é adicionada ao seu aplicativo Android, pois praticamente todos os aplicativos a utilizam. A permissão `SYSTEM_ALERT_WINDOW` é adicionada ao seu APK Android no modo de depuração, mas será removida na produção.
