# Módulos nativos do Android

> **INFORMAÇÕES**
> Módulo Nativo e Componentes Nativos são nossas tecnologias estáveis usadas pela arquitetura legada. Eles serão descontinuados no futuro, quando a Nova Arquitetura estiver estável. A nova arquitetura usa [Turbo Native Module](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md) e [Fabric Native Components](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md) para obter resultados semelhantes.

Bem-vindo aos Módulos Nativos para Android. Comece lendo a introdução aos módulos nativos para obter uma introdução ao que são os módulos nativos.

## Crie um módulo nativo de calendário
No guia a seguir você criará um módulo nativo, CalendarModule, que permitirá acessar APIs de calendário do Android a partir de JavaScript. Ao final, você poderá chamar `CalendarModule.createCalendarEvent('Dinner Party', 'My House');` do JavaScript, invocando um método Java/Kotlin que cria um evento de calendário.

### Configurar
Para começar, abra o projeto Android em seu aplicativo React Native no Android Studio. Você pode encontrar seu projeto Android aqui em um aplicativo React Native:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/1a5c12f5-6368-4675-af20-051a7cb2598b)
_Imagem de onde você pode encontrar seu projeto Android_

Recomendamos usar o Android Studio para escrever seu código nativo. Android Studio é um IDE desenvolvido para desenvolvimento Android e usá-lo ajudará você a resolver pequenos problemas, como erros de sintaxe de código, rapidamente.

Também recomendamos ativar o [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) para acelerar as compilações conforme você itera no código Java/Kotlin.

### Crie um arquivo de módulo nativo personalizado
A primeira etapa é criar o arquivo Java/Kotlin (`CalendarModule.java` ou `CalendarModule.kt`) dentro da pasta `android/app/src/main/java/com/your-app-name/` (a pasta é a mesma para Kotlin e Java). Este arquivo Java/Kotlin conterá sua classe Java/Kotlin do módulo nativo.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/f05df190-b27f-4511-8554-ee5dc86efcb2)
_Imagem de como adicionar o CalendarModuleClass_

Em seguida, adicione o seguinte conteúdo:

#### Em java:
```java
package com.your-apps-package-name; // substitua o com.your-apps-package-name pelo nome do pacote do seu aplicativo
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class CalendarModule extends ReactContextBaseJavaModule {
   CalendarModule(ReactApplicationContext context) {
       super(context);
   }
}
```

#### Em kotlin:

```kt
package com.your-apps-package-name; // substitua o com.your-apps-package-name pelo nome do pacote do seu aplicativo
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {...}
```

Como você pode ver, sua classe `CalendarModule` estende a classe `ReactContextBaseJavaModule`. Para Android, os módulos nativos Java/Kotlin são escritos como classes que estendem `ReactContextBaseJavaModule` e implementam a funcionalidade exigida pelo JavaScript.

> É importante notar que tecnicamente as classes Java/Kotlin só precisam estender a classe `BaseJavaModule` ou implementar a interface NativeModule para serem consideradas um Módulo Nativo pelo React Native.

> No entanto, recomendamos que você use `ReactContextBaseJavaModule`, conforme mostrado acima. `ReactContextBaseJavaModule` dá acesso ao `ReactApplicationContext` (RAC), que é útil para módulos nativos que precisam se conectar a métodos de ciclo de vida de atividade. Usar `ReactContextBaseJavaModule` também tornará mais fácil tornar seu módulo nativo seguro para tipos no futuro. Para segurança de tipo de módulo nativo, que será lançada em versões futuras, o React Native analisa as especificações JavaScript de cada módulo nativo e gera uma classe base abstrata que estende `ReactContextBaseJavaModule`.

### Nome do módulo
Todos os módulos nativos Java/Kotlin no Android precisam implementar o método `getName()`. Este método retorna uma string, que representa o nome do módulo nativo. O módulo nativo pode então ser acessado em JavaScript usando seu nome. Por exemplo, no trecho de código abaixo, `getName()` retorna "CalendarModule".

```java
// adicionar ao CalendarModule.java
@Override
public String getName() {
   return "CalendarModule";
}
```

```kt
// adicionar ao CalendarModule.kt
override fun getName() = "CalendarModule"
```

O módulo nativo pode então ser acessado em JS assim:

```js
const {CalendarModule} = ReactNative.NativeModules;
```

### Exportar um método nativo para JavaScript
Em seguida, você precisará adicionar um método ao seu módulo nativo que criará eventos de calendário e poderá ser invocado em JavaScript. Todos os métodos de módulo nativos destinados a serem invocados a partir de JavaScript devem ser anotados com `@ReactMethod`.

Configure um método `createCalendarEvent()` para `CalendarModule` que pode ser invocado em JS por meio de `CalendarModule.createCalendarEvent()`. Por enquanto, o método receberá um nome e um local como strings. As opções de tipo de argumento serão abordadas em breve.

```java
// Java
@ReactMethod
public void createCalendarEvent(String name, String location) {
}
```

```kt
// Koltin
@ReactMethod fun createCalendarEvent(name: String, location: String) {}
```

Adicione um log de depuração ao método para confirmar que ele foi invocado quando você o chama do seu aplicativo. Abaixo está um exemplo de como você pode importar e usar a classe Log do pacote de utilitários do Android:

```java
// Java
import android.util.Log;

@ReactMethod
public void createCalendarEvent(String name, String location) {
   Log.d("CalendarModule", "Create event called with name: " + name
   + " and location: " + location);
}
```

```kt
// Kotlin
import android.util.Log

@ReactMethod
fun createCalendarEvent(name: String, location: String) {
    Log.d("CalendarModule", "Create event called with name: $name and location: $location")
}
```

Depois de concluir a implementação do módulo nativo e conectá-lo em JavaScript, você pode seguir [estas etapas](https://developer.android.com/studio/debug/am-logcat.html) para visualizar os logs do seu aplicativo.

### Métodos Síncronos
Você pode passar `isBlockingSynchronousMethod = true` para um método nativo para marcá-lo como um método síncrono.

```java
// Java
@ReactMethod(isBlockingSynchronousMethod = true)
```

```kt
// Kotlin
@ReactMethod(isBlockingSynchronousMethod = true)
```

No momento, não recomendamos isso, pois chamar métodos de forma síncrona pode ter fortes penalidades de desempenho e introduzir bugs relacionados a threading em seus módulos nativos. Além disso, observe que se você optar por ativar `isBlockingSynchronousMethod`, seu aplicativo não poderá mais usar o depurador do Google Chrome. Isso ocorre porque os métodos síncronos exigem que a VM JS compartilhe memória com o aplicativo. Para o depurador do Google Chrome, o React Native é executado dentro da VM JS no Google Chrome e se comunica de forma assíncrona com os dispositivos móveis por meio de WebSockets.

## Registre o módulo (específico para Android)
Depois que um módulo nativo é escrito, ele precisa ser registrado no React Native. Para fazer isso, você precisa adicionar seu módulo nativo a um ReactPackage e registrar o ReactPackage com React Native. Durante a inicialização, o React Native fará um loop em todos os pacotes e, para cada ReactPackage, registrará cada módulo nativo dentro dele.

React Native invoca o método `createNativeModules()` em um `ReactPackage` para obter a lista de módulos nativos para registrar. Para Android, se um módulo não for instanciado e retornado em `createNativeModules`, ele não estará disponível em JavaScript.

Para adicionar seu módulo nativo ao `ReactPackage`, primeiro crie uma nova classe Java/Kotlin chamada (`MyAppPackage.java` ou `MyAppPackage.kt`) que implementa ReactPackage dentro da pasta `android/app/src/main/java/com/your-app-name/`:

Em seguida, adicione o seguinte conteúdo:

```java
// Em Java

package com.your-app-name; // substitua o com.your-app-name pelo nome do seu aplicativo

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyAppPackage implements ReactPackage {

   @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
       return Collections.emptyList();
   }

   @Override
   public List<NativeModule> createNativeModules(
           ReactApplicationContext reactContext) {
       List<NativeModule> modules = new ArrayList<>();

       modules.add(new CalendarModule(reactContext));

       return modules;
   }

}
```

```kt
package com.your-app-name // substitua o com.your-app-name pelo nome do seu aplicativo

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class MyAppPackage : ReactPackage {

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> = listOf(CalendarModule(reactContext)).toMutableList()
}
```

Este arquivo importa o módulo nativo que você criou, `CalendarModule`. Em seguida, ele instancia `CalendarModule` dentro da função `createNativeModules()` e o retorna como uma lista de `NativeModules` para registrar. Se você adicionar mais módulos nativos posteriormente, também poderá instanciá-los e adicioná-los à lista retornada aqui.

> É importante notar que esta forma de registrar módulos nativos inicializa avidamente todos os módulos nativos quando o aplicativo é iniciado, o que aumenta o tempo de inicialização de um aplicativo. Você pode usar o [TurboReactPackage](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/TurboReactPackage.java) como alternativa. Em vez de `createNativeModules`, que retorna uma lista de objetos de módulo nativos instanciados, TurboReactPackage implementa um método `getModule(String name, ReactApplicationContext rac)` que cria o objeto de módulo nativo, quando necessário. TurboReactPackage é um pouco mais complicado de implementar no momento. Além de implementar um método `getModule()`, você deve implementar um método getReactModuleInfoProvider(), que retorna uma lista de todos os módulos nativos que o pacote pode instanciar junto com uma função que os instancia, exemplo [aqui](https://github.com/facebook/react-native/blob/8ac467c51b94c82d81930b4802b2978c85539925/ReactAndroid/src/main/java/com/facebook/react/CoreModulesPackage.java#L86-L165). Novamente, usar o TurboReactPackage permitirá que seu aplicativo tenha um tempo de inicialização mais rápido, mas atualmente é um pouco complicado de escrever. Portanto, proceda com cuidado se você optar por usar TurboReactPackages.

Para registrar o pacote `CalendarModule`, você deve adicionar `MyAppPackage` à lista de pacotes retornados no método `getPackages()` do ReactNativeHost. Abra seu arquivo `MainApplication.java` ou `MainApplication.kt`, que pode ser encontrado no seguinte caminho: `android/app/src/main/java/com/your-app-name/`.

Localize o método `getPackages()` do ReactNativeHost e adicione seu pacote à lista de pacotes que `getPackages()` retorna:

```java
// Em java

@Override
  protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // abaixo MyAppPackage é adicionado à lista de pacotes retornados
    packages.add(new MyAppPackage());
    return packages;
  }
```

```kt
override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        // Pacotes que ainda não podem ser vinculados automaticamente podem ser adicionados manualmente aqui, por exemplo:
        // packages.add(new MyReactNativePackage());
        add(MyAppPackage())
    }
```

Agora você registrou com sucesso seu módulo nativo para Android!

### Teste o que você construiu
Neste ponto, você configurou a estrutura básica para seu módulo nativo no Android. Teste isso acessando o módulo nativo e invocando seu método exportado em JavaScript.

Encontre um local em seu aplicativo onde você gostaria de adicionar uma chamada ao método `createCalendarEvent()` do módulo nativo. Abaixo está um exemplo de componente, `NewModuleButton`, que você pode adicionar ao seu aplicativo. Você pode invocar o módulo nativo dentro da função `onPress()` do `NewModuleButton`.

```jsx
import React from 'react';
import {NativeModules, Button} from 'react-native';

const NewModuleButton = () => {
  const onPress = () => {
    console.log('We will invoke the native module here!');
  };

  return (
    <Button
      title="Click to invoke your native module!"
      color="#841584"
      onPress={onPress}
    />
  );
};

export default NewModuleButton;
```

Para acessar seu módulo nativo a partir de JavaScript, você precisa primeiro importar `NativeModules` do React Native:

```jsx
import {NativeModules} from 'react-native';
```

Você pode então acessar o módulo nativo `CalendarModule` fora de `NativeModules`.

```jsx
const {CalendarModule} = NativeModules;
```

Agora que você tem o módulo nativo `CalendarModule` disponível, você pode invocar seu método nativo `createCalendarEvent()`. Abaixo é adicionado ao método `onPress()` em `NewModuleButton`:

```jsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

A etapa final é reconstruir o aplicativo React Native para que você possa ter o código nativo mais recente (com seu novo módulo nativo!) Disponível. Na linha de comando, onde o aplicativo react nativo está localizado, execute o seguinte:

```
npm run android
// ou
yarn android
```

### Construindo enquanto você itera
À medida que você trabalha nesses guias e itera em seu módulo nativo, você precisará fazer uma reconstrução nativa de seu aplicativo para acessar as alterações mais recentes do JavaScript. Isso ocorre porque o código que você está escrevendo fica na parte nativa do seu aplicativo. Embora o empacotador metro do React Native possa observar mudanças no JavaScript e reconstruir instantaneamente para você, ele não fará isso para o código nativo. Portanto, se você quiser testar suas alterações nativas mais recentes, precisará reconstruí-las usando o comando acima.

### Recapitulação✨
Agora você deve ser capaz de invocar seu método `createCalendarEvent()` em seu módulo nativo no aplicativo. No nosso exemplo isso ocorre pressionando o `NewModuleButton`. Você pode confirmar isso visualizando o log configurado no método `createCalendarEvent()`. Você pode seguir [estas etapas](https://developer.android.com/studio/debug/am-logcat.html) para visualizar os logs do `ADB` em seu aplicativo. Você deverá então ser capaz de pesquisar sua mensagem Log.d (em nosso exemplo “Criar evento chamado com nome: testName e local: testLocation”) e ver sua mensagem registrada sempre que invocar seu método de módulo nativo.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/578b6da9-b01c-4b00-a7fb-9bd4be45b912)
_Imagem dos logs do ADB no Android Studio_

Neste ponto, você criou um módulo nativo Android e invocou seu método nativo a partir de JavaScript em seu aplicativo React Native. Você pode continuar lendo para aprender mais sobre coisas como tipos de argumentos disponíveis para um método de módulo nativo e como configurar retornos de chamada e promessas.

## Além de um módulo nativo de calendário

### Melhor exportação de módulo nativo
Importar seu módulo nativo retirando-o de `NativeModules` como acima é um pouco complicado.

Para evitar que os consumidores do seu módulo nativo precisem fazer isso sempre que quiserem acessar seu módulo nativo, você pode criar um wrapper JavaScript para o módulo. Crie um novo arquivo JavaScript chamado `CalendarModule.js` com o seguinte conteúdo:

```js
/**
* Isso expõe o módulo nativo CalendarModule como um módulo JS. Isto tem um
* função 'createCalendarEvent' que leva os seguintes parâmetros:

* 1. String name: Uma string que representa o nome do evento
* 2. String location: Uma string que representa a localização do evento
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

Este arquivo JavaScript também se torna um bom local para você adicionar qualquer funcionalidade secundária do JavaScript. Por exemplo, se você usar um sistema de tipos como TypeScript, poderá adicionar anotações de tipo para seu módulo nativo aqui. Embora o React Native ainda não ofereça suporte à segurança de tipo, todo o seu código JS será de tipo seguro. Isso também tornará mais fácil mudar para módulos nativos com segurança de tipo no futuro. Abaixo está um exemplo de adição de segurança de tipo ao `CalendarModule`:

```tsx
/**
 * Isso expõe o módulo nativo CalendarModule como um módulo JS. Isto tem um
 * função 'createCalendarEvent' que leva os seguintes parâmetros:
 *
 * 1. String name: Uma string que representa o nome do evento
 * 2. String location: Uma string que representa a localização do evento
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;

interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}

export default CalendarModule as CalendarInterface;
```

Nos seus outros arquivos JavaScript você pode acessar o módulo nativo e invocar seu método assim:

```tsx
import CalendarModule from './CalendarModule';
CalendarModule.createCalendarEvent('foo', 'bar');
```

> Isso pressupõe que o local que você está importando `CalendarModule` esteja na mesma hierarquia que `CalendarModule.js`. Atualize a importação relativa conforme necessário.

### Tipos de argumento
Quando um método de módulo nativo é invocado em JavaScript, o React Native converte os argumentos dos objetos JS em seus objetos análogos Java/Kotlin. Então, por exemplo, se o seu método Java Native Module aceita um double, em JS você precisa chamar o método com um número. React Native cuidará da conversão para você. Abaixo está uma lista dos tipos de argumentos suportados pelos métodos de módulo nativos e os equivalentes JavaScript para os quais eles mapeiam.


| JAVA           | KOTLIN            | JAVASCRIPT      |
|----------------|-------------------|-----------------|
| Boolean        | Boolean           | ?boolean        |
| boolean        |                   | boolean         |
| Double         | Double            | ?number         |
| double         |                   | number          |
| String         | String            | string          |
| Callback       | Callback          | Function        |
| Promise        | Promise           | Promise         |
| ReadableMap    | ReadableMap       | Object          |
| ReadableArray	 | ReadableArray     | Array           |

> Os seguintes tipos são atualmente suportados, mas não serão suportados em TurboModules. Evite usá-los:
> 
> Integer Java/Kotlin -> ?number
> Float Java/Kotlin -> ?number
> int Java -> number
> float Java -> number

Para tipos de argumentos não listados acima, você mesmo precisará lidar com a conversão. Por exemplo, no Android, a conversão de data não é compatível imediatamente. Você mesmo pode lidar com a conversão para o tipo `Date` dentro do método nativo da seguinte forma:

```java
// Em java

String dateFormat = "yyyy-MM-dd";
SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
Calendar eStartDate = Calendar.getInstance();
try {
    eStartDate.setTime(sdf.parse(startDate));
}
```

```kt
// Em kotlin

val dateFormat = "yyyy-MM-dd"
val sdf = SimpleDateFormat(dateFormat, Locale.US)
val eStartDate = Calendar.getInstance()
try {
    sdf.parse(startDate)?.let {
        eStartDate.time = it
    }
}
```

### Exportando Constantes
Um módulo nativo pode exportar constantes implementando o método nativo `getConstants()`, que está disponível em JS. Abaixo você implementará `getConstants()` e retornará um Map que contém uma constante `DEFAULT_EVENT_NAME` que você pode acessar em JavaScript:

```java
// Em java

@Override
public Map<String, Object> getConstants() {
   final Map<String, Object> constants = new HashMap<>();
   constants.put("DEFAULT_EVENT_NAME", "New Event");
   return constants;
}
```

```kt
// Em kotlin
override fun getConstants(): MutableMap<String, Any> =
    hashMapOf("DEFAULT_EVENT_NAME" to "New Event")
```

A constante pode então ser acessada invocando `getConstants` no módulo nativo em JS:

```java
// Em java
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

```kt
// Em koltin
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

Tecnicamente, é possível acessar constantes exportadas em `getConstants()` diretamente do objeto do módulo nativo. Isso não será mais compatível com TurboModules, por isso encorajamos a comunidade a mudar para a abordagem acima para evitar a migração necessária no futuro.

> Atualmente, as constantes são exportadas apenas no momento da inicialização, portanto, se você alterar os valores `getConstants` em tempo de execução, isso não afetará o ambiente JavaScript. Isso mudará com Turbomodules. Com Turbomodules, `getConstants()` se tornará um método de módulo nativo regular e cada invocação atingirá o lado nativo.

### Callbacks
Os módulos nativos também suportam um tipo único de argumento: um retorno de chamada. Retornos de chamada são usados para passar dados de Java/Kotlin para JavaScript para métodos assíncronos. Eles também podem ser usados para executar JavaScript de forma assíncrona do lado nativo.

Para criar um método de módulo nativo com retorno de chamada, primeiro importe a interface `Callback` e, em seguida, adicione um novo parâmetro ao método de módulo nativo do tipo Callback. Existem algumas nuances nos argumentos de retorno de chamada que em breve serão eliminadas com TurboModules. Primeiro, você só pode ter dois retornos de chamada nos argumentos de sua função – um successCallback e um failedCallback. Além disso, o último argumento para uma chamada de método de módulo nativo, se for uma função, é tratado como sucessCallback, e o penúltimo argumento para uma chamada de método de módulo nativo, se for uma função, é tratado como retorno de chamada de falha.

```java
// Java
import com.facebook.react.bridge.Callback;

@ReactMethod
public void createCalendarEvent(String name, String location, Callback callBack) {
}
```

```kt
import com.facebook.react.bridge.Callback

@ReactMethod fun createCalendarEvent(name: String, location: String, callback: Callback) {}
```

Você pode invocar o retorno de chamada em seu método Java/Kotlin, fornecendo quaisquer dados que deseja passar para JavaScript. Observe que você só pode passar dados serializáveis de código nativo para JavaScript. Se você precisar retornar um objeto nativo, você pode usar `WriteableMaps`, se precisar usar uma coleção, use `WritableArrays`. Também é importante destacar que o retorno de chamada não é invocado imediatamente após a conclusão da função nativa. Abaixo do ID de um evento criado em uma chamada anterior é passado para o retorno de chamada.

```java
// Java

@ReactMethod
public void createCalendarEvent(String name, String location, Callback callBack) {
     Integer eventId = ...
     callBack.invoke(eventId);
}
```

```kt
// Kotlin

@ReactMethod
fun createCalendarEvent(name: String, location: String, callback: Callback) {
    val eventId = ...
    callback.invoke(eventId)
}
```

Este método pode então ser acessado em JavaScript usando:

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'Party',
    'My House',
    eventId => {
      console.log(`Created a new event with id ${eventId}`);
    },
  );
};
```

Outro detalhe importante a ser observado é que um método de módulo nativo só pode invocar um retorno de chamada uma vez. Isso significa que você pode chamar um retorno de chamada com sucesso ou um retorno de chamada com falha, mas não ambos, e cada retorno de chamada só pode ser invocado no máximo uma vez. Um módulo nativo pode, entretanto, armazenar o retorno de chamada e invocá-lo posteriormente.

Existem duas abordagens para tratamento de erros com retornos de chamada. A primeira é seguir a convenção do Node e tratar o primeiro argumento passado para o retorno de chamada como um objeto de erro.

```java
// Java

@ReactMethod
 public void createCalendarEvent(String name, String location, Callback callBack) {
     Integer eventId = ...
     callBack.invoke(null, eventId);
 }
```

```kt
// Kotlin

@ReactMethod
fun createCalendarEvent(name: String, location: String, callback: Callback) {
    val eventId = ...
    callback.invoke(null, eventId)
}
```

Em JavaScript, você pode verificar o primeiro argumento para ver se um erro foi transmitido:

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'testName',
    'testLocation',
    (error, eventId) => {
      if (error) {
        console.error(`Error found! ${error}`);
      }
      console.log(`event id ${eventId} returned`);
    },
  );
};
```

Outra opção é usar um retorno de chamada `onSuccess` e `onFailure`:

```java
// Java

@ReactMethod
public void createCalendarEvent(String name, String location, Callback myFailureCallback, Callback mySuccessCallback) {
}
```

```kt
// Kotlin

@ReactMethod
  fun createCalendarEvent(
      name: String,
      location: String,
      myFailureCallback: Callback,
      mySuccessCallback: Callback
  ) {}
```

Então, em JavaScript, você pode adicionar um retorno de chamada separado para respostas de erro e sucesso:

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'testName',
    'testLocation',
    error => {
      console.error(`Error found! ${error}`);
    },
    eventId => {
      console.log(`event id ${eventId} returned`);
    },
  );
};
```

## Promises
Módulos nativos também podem cumprir uma [promessa](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), o que pode simplificar seu JavaScript, especialmente ao usar a sintaxe [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) do ES2016. Quando o último parâmetro de um método Java/Kotlin de módulo nativo é uma Promise, seu método JS correspondente retornará um objeto JS Promise.

Refatorar o código acima para usar uma promessa em vez de retornos de chamada é assim:

```java
// Java

import com.facebook.react.bridge.Promise;

@ReactMethod
public void createCalendarEvent(String name, String location, Promise promise) {
    try {
        Integer eventId = ...
        promise.resolve(eventId);
    } catch(Exception e) {
        promise.reject("Create Event Error", e);
    }
}
```

```kt
// Kotlin

import com.facebook.react.bridge.Promise

@ReactMethod
fun createCalendarEvent(name: String, location: String, promise: Promise) {
    try {
        val eventId = ...
        promise.resolve(eventId)
    } catch (e: Throwable) {
        promise.reject("Create Event Error", e)
    }
}
```

> Semelhante aos retornos de chamada, um método de módulo nativo pode rejeitar ou resolver uma promessa (mas não ambos) e pode fazer isso no máximo uma vez. Isso significa que você pode chamar um retorno de chamada com sucesso ou um retorno de chamada com falha, mas não ambos, e cada retorno de chamada só pode ser invocado no máximo uma vez. Um módulo nativo pode, entretanto, armazenar o retorno de chamada e invocá-lo posteriormente.

A contraparte JavaScript deste método retorna uma promessa. Isso significa que você pode usar a palavra-chave await dentro de uma função assíncrona para chamá-la e aguardar seu resultado:

```tsx
const onSubmit = async () => {
  try {
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'My House',
    );
    console.log(`Created a new event with id ${eventId}`);
  } catch (e) {
    console.error(e);
  }
};
```

O método rejeitar utiliza diferentes combinações dos seguintes argumentos:

```java
// Java

String code, String message, WritableMap userInfo, Throwable throwable
```

```kt
// Kotlin

code: String, message: String, userInfo: WritableMap, throwable: Throwable
```

Para mais detalhes, você pode encontrar a interface `Promise.java` [aqui](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/bridge/Promise.java). Se `userInfo` não for fornecido, ReactNative irá defini-lo como nulo. Para o restante dos parâmetros, o React Native usará um valor padrão. O argumento `message` fornece a mensagem de erro mostrada no topo de uma pilha de chamadas de erro. Abaixo está um exemplo da `mensagem` de erro mostrada em JavaScript da seguinte chamada rejeitada em Java/Kotlin.

Chamada rejeitada de Java/Kotlin:

```java
// Java
promise.reject("Create Event error", "Error parsing date", e);
```

```kt
// Kotlin
promise.reject("Create Event error", "Error parsing date", e)
```

Mensagem de erro no aplicativo React Native quando a promessa é rejeitada:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/99069c93-a869-4b6e-bb50-b101c0c029ad)
_Imagem da mensagem de erro_

### Enviando eventos para JavaScript
Módulos nativos podem sinalizar eventos para JavaScript sem serem invocados diretamente. Por exemplo, você pode sinalizar para o JavaScript um lembrete de que um evento de calendário do aplicativo de calendário nativo do Android ocorrerá em breve. A maneira mais fácil de fazer isso é usar o `RCTDeviceEventEmitter` que pode ser obtido no `ReactContext` como no trecho de código abaixo.

```java
// Java
...
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
...
private void sendEvent(ReactContext reactContext,
                      String eventName,
                      @Nullable WritableMap params) {
 reactContext
     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
     .emit(eventName, params);
}

private int listenerCount = 0;

@ReactMethod
public void addListener(String eventName) {
  if (listenerCount == 0) {
    // Configure quaisquer ouvintes upstream ou tarefas em segundo plano conforme necessário
  }

  listenerCount += 1;
}

@ReactMethod
public void removeListeners(Integer count) {
  listenerCount -= count;
  if (listenerCount == 0) {
    // Remova ouvintes upstream, interrompa tarefas desnecessárias em segundo plano
  }
}
...
WritableMap params = Arguments.createMap();
params.putString("eventProperty", "someValue");
...
sendEvent(reactContext, "EventReminder", params);
```

```kt
// Kotlin
...
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
...

private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
}

private var listenerCount = 0

@ReactMethod
fun addListener(eventName: String) {
  if (listenerCount == 0) {
    // Configure quaisquer ouvintes upstream ou tarefas em segundo plano conforme necessário
  }

  listenerCount += 1
}

@ReactMethod
fun removeListeners(count: Int) {
  listenerCount -= count
  if (listenerCount == 0) {
    // Remova ouvintes upstream, interrompa tarefas desnecessárias em segundo plano
  }
}
...
val params = Arguments.createMap().apply {
    putString("eventProperty", "someValue")
}
...
sendEvent(reactContext, "EventReminder", params)
```

Os módulos JavaScript podem então se registrar para receber eventos por `addListener` na classe [NativeEventEmitter](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/EventEmitter/NativeEventEmitter.js).

```tsx
import {NativeEventEmitter, NativeModules} from 'react-native';
...
useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('EventReminder', event => {
      console.log(event.eventProperty) // "algumValor"
    });

    // Remove o ouvinte depois de desmontado
    return () => {
      eventListener.remove();
    };
  }, []);
```

## Obtendo o resultado da atividade de `startActivityForResult`
Você precisará ouvir `onActivityResult` se quiser obter resultados de uma atividade iniciada com `startActivityForResult`. Para fazer isso, você deve estender `BaseActivityEventListener` ou implementar `ActivityEventListener`. O primeiro é preferido porque é mais resiliente às alterações da API. Então, você precisa registrar o ouvinte no construtor do módulo assim:

```java
reactContext.addActivityEventListener(mActivityResultListener);
```

Agora você pode ouvir `onActivityResult` implementando o seguinte método:

```java
// Java
@Override
public void onActivityResult(
 final Activity activity,
 final int requestCode,
 final int resultCode,
 final Intent intent) {
 // Sua lógica aqui
}
```

```kt
override fun onActivityResult(
    activity: Activity?,
    requestCode: Int,
    resultCode: Int,
    intent: Intent?
) {
    // Sua lógica aqui
}
```

Vamos implementar um seletor de imagens básico para demonstrar isso. O seletor de imagens irá expor o método `pickImage` no JavaScript, que retornará o caminho da imagem quando chamado.

```java
// Java

public class ImagePickerModule extends ReactContextBaseJavaModule {

  private static final int IMAGE_PICKER_REQUEST = 1;
  private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
  private static final String E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
  private static final String E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER";
  private static final String E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND";

  private Promise mPickerPromise;

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
      if (requestCode == IMAGE_PICKER_REQUEST) {
        if (mPickerPromise != null) {
          if (resultCode == Activity.RESULT_CANCELED) {
            mPickerPromise.reject(E_PICKER_CANCELLED, "Image picker was cancelled");
          } else if (resultCode == Activity.RESULT_OK) {
            Uri uri = intent.getData();

            if (uri == null) {
              mPickerPromise.reject(E_NO_IMAGE_DATA_FOUND, "No image data found");
            } else {
              mPickerPromise.resolve(uri.toString());
            }
          }

          mPickerPromise = null;
        }
      }
    }
  };

  ImagePickerModule(ReactApplicationContext reactContext) {
    super(reactContext);

    // Adicione o ouvinte para `onActivityResult`
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  public String getName() {
    return "ImagePickerModule";
  }

  @ReactMethod
  public void pickImage(final Promise promise) {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
      return;
    }

    // Armazene a promessa de resolver/rejeitar quando o seletor retornar dados
    mPickerPromise = promise;

    try {
      final Intent galleryIntent = new Intent(Intent.ACTION_PICK);

      galleryIntent.setType("image/*");

      final Intent chooserIntent = Intent.createChooser(galleryIntent, "Pick an image");

      currentActivity.startActivityForResult(chooserIntent, IMAGE_PICKER_REQUEST);
    } catch (Exception e) {
      mPickerPromise.reject(E_FAILED_TO_SHOW_PICKER, e);
      mPickerPromise = null;
    }
  }
}
```

```kt
// Kotlin

class ImagePickerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var pickerPromise: Promise? = null

    private val activityEventListener =
        object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity: Activity?,
                requestCode: Int,
                resultCode: Int,
                intent: Intent?
            ) {
                if (requestCode == IMAGE_PICKER_REQUEST) {
                    pickerPromise?.let { promise ->
                        when (resultCode) {
                            Activity.RESULT_CANCELED ->
                                promise.reject(E_PICKER_CANCELLED, "Image picker was cancelled")
                            Activity.RESULT_OK -> {
                                val uri = intent?.data

                                uri?.let { promise.resolve(uri.toString())}
                                    ?: promise.reject(E_NO_IMAGE_DATA_FOUND, "No image data found")
                            }
                        }

                        pickerPromise = null
                    }
                }
            }
        }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }

    override fun getName() = "ImagePickerModule"

    @ReactMethod
    fun pickImage(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist")
            return
        }

        pickerPromise = promise

        try {
            val galleryIntent = Intent(Intent.ACTION_PICK).apply { type = "image\/*" }

            val chooserIntent = Intent.createChooser(galleryIntent, "Pick an image")

            activity.startActivityForResult(chooserIntent, IMAGE_PICKER_REQUEST)
        } catch (t: Throwable) {
            pickerPromise?.reject(E_FAILED_TO_SHOW_PICKER, t)
            pickerPromise = null
        }
    }

    companion object {
        const val IMAGE_PICKER_REQUEST = 1
        const val E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST"
        const val E_PICKER_CANCELLED = "E_PICKER_CANCELLED"
        const val E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER"
        const val E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND"
    }
}
```

## Ouvindo eventos do ciclo de vida
Ouvir os eventos LifeCycle da atividade, como `onResume`, `onPause` etc., é muito semelhante a como `ActivityEventListener` foi implementado. O módulo deve implementar `LifecycleEventListener`. Então, você precisa registrar um ouvinte no construtor do módulo como:

```java
// Java
reactContext.addLifecycleEventListener(this);
```

```kt
// Kotlin
reactContext.addLifecycleEventListener(this)
```

Agora você pode ouvir os eventos LifeCycle da atividade implementando os seguintes métodos:

```java
// Java

@Override
public void onHostResume() {
   // Activity `onResume`
}
@Override
public void onHostPause() {
   // Activity `onPause`
}
@Override
public void onHostDestroy() {
   // Activity `onDestroy`
}
```

```kt
// Kotlin

override fun onHostResume() {
    // Activity `onResume`
}

override fun onHostPause() {
    // Activity `onPause`
}

override fun onHostDestroy() {
    // Activity `onDestroy`
}

## Threading
Até o momento, no Android, todos os métodos assíncronos do módulo nativo são executados em um thread. Os módulos nativos não devem ter nenhuma suposição sobre em qual thread estão sendo chamados, pois a atribuição atual está sujeita a alterações no futuro. Se uma chamada de bloqueio for necessária, o trabalho pesado deverá ser despachado para um thread de trabalho gerenciado internamente e quaisquer retornos de chamada distribuídos a partir daí.
```
