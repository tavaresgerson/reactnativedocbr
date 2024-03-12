# Usando o Hermes

[Hermes](https://hermesengine.dev/) é um mecanismo JavaScript de código aberto otimizado para React Native. Para muitos aplicativos, o uso do Hermes resultará em melhor tempo de inicialização, menor uso de memória e tamanho menor do aplicativo quando comparado ao JavaScriptCore. Hermes é usado por padrão pelo React Native e nenhuma configuração adicional é necessária para habilitá-lo.

## Pacote Hermes
React Native vem com uma versão integrada do Hermes. Estaremos construindo uma versão do Hermes para você sempre que lançarmos uma nova versão do React Native. Isso garantirá que você esteja consumindo uma versão do Hermes totalmente compatível com a versão do React Native que você está usando.

Historicamente, tivemos problemas ao combinar versões do Hermes com versões do React Native. Isso elimina totalmente esse problema e oferece aos usuários um mecanismo JS compatível com a versão específica do React Native.

Esta mudança é totalmente transparente para os usuários do React Native. Você ainda pode desativar o Hermes usando o comando descrito nesta página. Você pode ler mais sobre a [implementação técnica nesta página](/architecture/bundled-hermes.md).

## Confirmando que Hermes está em uso
Se você criou recentemente um novo aplicativo do zero, deverá ver se o Hermes está ativado na visualização de boas-vindas:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/388b181e-16bd-4444-a586-8efcfe5e5da4)

Uma variável global `HermesInternal` estará disponível em JavaScript que pode ser usada para verificar se o Hermes está em uso:

```js
const isHermes = () => !!global.HermesInternal;
```

> **CUIDADO**
> Se você estiver usando uma forma não padrão de carregar o pacote JS, é possível que a variável `HermesInternal` esteja disponível, mas você não esteja usando o bytecode pré-compilado altamente otimizado. Confirme se você está usando o arquivo `.hbc` e também compare o antes/depois conforme detalhado abaixo.

Para ver os benefícios do Hermes, tente fazer uma versão build/implantação do seu aplicativo para comparar. Por exemplo; da raiz do seu projeto:

### Android/iOS

```
// Android
npm run android -- --mode="release"
// ou
yarn android --mode release

//iOS
npm run ios -- --mode="Release"
// ou
yarn ios --mode Release
```

Isso compilará o JavaScript em bytecode durante o tempo de construção, o que melhorará a velocidade de inicialização do seu aplicativo no dispositivo.

####  Depurando JS no Hermes usando DevTools do Google Chrome
Hermes oferece suporte ao depurador do Chrome implementando o protocolo do inspetor do Chrome. Isso significa que as ferramentas do Chrome podem ser usadas para depurar diretamente o JavaScript em execução no Hermes, em um emulador ou em um dispositivo físico real.

> **INFORMAÇÕES**
> Observe que isso é muito diferente da "Depuração remota de JS" do menu de desenvolvimento no aplicativo documentado na seção [Depuração](/docs/debugging.md), que na verdade executa o código JS no V8 do Chrome em sua máquina de desenvolvimento (laptop ou desktop).

O Chrome se conecta ao Hermes em execução no dispositivo via Metro, então você precisa saber onde o Metro está ouvindo. Normalmente, isso estará em `localhost:8081`, mas é configurável. Ao executar o `yarn start`, o endereço é gravado em `stdout` na inicialização.

Depois de saber onde o servidor Metro está escutando, você pode conectar-se ao Chrome seguindo as seguintes etapas:
1. Navegue para `chrome://inspect` em uma instância do navegador Chrome.
2. Use o botão `Configure...` para adicionar o endereço do servidor Metro (normalmente `localhost:8081` conforme descrito acima).

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/2e3ad0ad-158e-44f9-9380-766c60734ef3)

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/6526427d-5ece-4ed1-b980-a84cfb4b2ff1)

3. Agora você deve ver um alvo "Hermes React Native" com um link "inspecionar" que pode ser usado para abrir o depurador. Se você não vir o link “inspect”, certifique-se de que o servidor Metro esteja em execução.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/2ed9b518-98c0-4a67-85f2-5524997c72d9)

4. Agora você pode usar as ferramentas de depuração do Chrome. Por exemplo, para fazer um ponto de interrupção na próxima vez que algum JavaScript for executado, clique no botão de pausa e acione uma ação em seu aplicativo que faria com que o JavaScript fosse executado.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/8e11055e-5ac9-4da6-a9da-cd4d854a3779)

## Habilitando Hermes em versões mais antigas do React Native
Hermes é o mecanismo padrão no React Native 0.70. Esta seção explica como habilitar o Hermes em versões mais antigas do React Native. Primeiro, certifique-se de usar pelo menos a versão 0.60.4 do React Native para habilitar o Hermes no Android ou 0.64 do React Native para habilitar o Hermes no iOS.

Se você já possui um aplicativo baseado em uma versão anterior do React Native, você terá que atualizá-lo primeiro. Consulte [Atualizando para novas versões do React Native](/docs/upgrading.md) para saber como fazer isso. Depois de atualizar o aplicativo, certifique-se de que tudo funciona antes de tentar mudar para o Hermes.

> **NOTA PARA COMPATIBILIDADE REACT NATIVA**
> Cada lançamento da Hermes é direcionado a uma versão RN específica. A regra é sempre seguir rigorosamente os [lançamentos do Hermes](https://github.com/facebook/hermes/releases). A incompatibilidade de versão pode resultar na falha instantânea de seus aplicativos na pior das hipóteses.

> NOTA PARA USUÁRIOS DO WINDOWS
> Hermes requer [Microsoft Visual C++ 2015 Redistributable](https://www.microsoft.com/en-us/download/details.aspx?id=48145).

### Android
Edite seu arquivo `android/gradle.properties` e certifique-se de que `hermesEnabled` seja verdadeiro:

```
# Use esta propriedade para ativar ou desativar o mecanismo Hermes JS.
# Se definido como falso, você usará JSC.
hermesEnabled=true
```

> **OBSERVAÇÃO**
> Esta propriedade foi adicionada no React Native 0.71. Se você não conseguir encontrá-lo em seu arquivo `gradle.properties`, consulte a documentação da versão correspondente do React Native que você está usando.

Além disso, se estiver usando o ProGuard, você precisará adicionar estas regras em `proguard-rules.pro`:
```
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
```

A seguir, se você já criou seu aplicativo pelo menos uma vez, limpe a compilação:

```
$ cd android && ./gradlew clean
```

É isso! Agora você deve conseguir desenvolver e implantar seu aplicativo normalmente:

```
npm run android
// ou
yarn android
```

### iOS
Desde o React Native 0.64, o Hermes também roda em iOS. Para habilitar o Hermes para iOS, edite seu arquivo `ios/Podfile` e faça a alteração ilustrada abaixo:

```
   use_react_native!(
     :path => config[:reactNativePath],
     # to enable hermes on iOS, change `false` to `true` and then install pods
     # By default, Hermes is disabled on Old Architecture, and enabled on New Architecture.
     # You can enable/disable it manually by replacing `flags[:hermes_enabled]` with `true` or `false`.
-    :hermes_enabled => flags[:hermes_enabled],
+    :hermes_enabled => true
   )
```

Por padrão, você usará Hermes se estiver na Nova Arquitetura. Ao especificar um valor como `true` ou `false`, você pode ativar/desativar o Hermes como desejar.

Depois de configurá-lo, você pode instalar os pods Hermes com:

```
$ cd ios && pod install
```

É isso! Agora você deve conseguir desenvolver e implantar seu aplicativo normalmente:

```
npm run ios
// ou
yarn ios
```

## Voltando para JavaScriptCore
React Native também oferece suporte ao uso de JavaScriptCore como mecanismo JavaScript. Siga estas instruções para cancelar o Hermes.

Android
Edite seu arquivo android/gradle.properties e mude hermesEnabled de volta para false:
