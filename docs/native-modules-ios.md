# Módulos nativos iOS

> **INFORMAÇÕES**
> Módulo Nativo e Componentes Nativos são nossas tecnologias estáveis usadas pela arquitetura legada. Eles serão descontinuados no futuro, quando a Nova Arquitetura estiver estável. A nova arquitetura usa [Turbo Native Module](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md) e [Fabric Native Components](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md) para obter resultados semelhantes.

Bem-vindo aos Módulos Nativos para iOS. Comece lendo a [introdução aos módulos nativos](https://reactnative.dev/docs/native-modules-intro) para obter uma introdução ao que são os módulos nativos.

## Crie um módulo nativo de calendário
No guia a seguir você criará um módulo nativo, `CalendarModule`, que permitirá acessar APIs de calendário da Apple a partir de JavaScript. No final você poderá chamar `CalendarModule.createCalendarEvent('Dinner Party', 'My House');` do JavaScript, invocando um método nativo que cria um evento de calendário.

### Configurar
Para começar, abra o projeto iOS em seu aplicativo React Native no Xcode. Você pode encontrar seu projeto iOS aqui em um aplicativo React Native:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/a79717d3-36f2-41a5-b120-dd2bc51232eb)
_Imagem de onde você pode encontrar seu projeto iOS_

Recomendamos usar o Xcode para escrever seu código nativo. O Xcode foi desenvolvido para desenvolvimento em iOS e usá-lo ajudará você a resolver rapidamente erros menores, como sintaxe de código.

### Crie arquivos de módulo nativos personalizados
A primeira etapa é criar nosso principal cabeçalho de módulo nativo personalizado e arquivos de implementação. Crie um novo arquivo chamado `RCTCalendarModule.h`

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/f06738b3-4be6-4734-8bea-1f87556a0df3)
_Imagem da criação de um arquivo de módulo nativo personalizado na mesma pasta do AppDelegate_

e adicione o seguinte a ele:

```h
//  RCTCalendarModule.h
#import <React/RCTBridgeModule.h>
@interface RCTCalendarModule : NSObject <RCTBridgeModule>
@end
```

Você pode usar qualquer nome que corresponda ao módulo nativo que você está construindo. Nomeie a classe `RCTCalendarModule`, pois você está criando um módulo nativo de calendário. Como ObjC não tem suporte em nível de linguagem para namespaces como Java ou C++, a convenção é acrescentar uma substring ao nome da classe. Pode ser uma abreviatura do nome do seu aplicativo ou do seu infranome. RCT, neste exemplo, refere-se ao React.

Como você pode ver abaixo, a classe `CalendarModule` implementa o protocolo `RCTBridgeModule`. Um módulo nativo é uma classe Objective-C que implementa o protocolo `RCTBridgeModule`.

A seguir, vamos começar a implementar o módulo nativo. Crie o arquivo de implementação correspondente, `RCTCalendarModule.m`, na mesma pasta e inclua o seguinte conteúdo:

```m
// RCTCalendarModule.m
#import "RCTCalendarModule.h"

@implementation RCTCalendarModule

// Para exportar um módulo denominado RCTCalendarModule
RCT_EXPORT_MODULE();

@end
```

### Nome do módulo
Por enquanto, seu módulo nativo `RCTCalendarModule.m` inclui apenas um macro `RCT_EXPORT_MODULE`, que exporta e registra a classe do módulo nativo com React Native. O macro `RCT_EXPORT_MODULE` também usa um argumento opcional que especifica o nome pelo qual o módulo estará acessível em seu código JavaScript.

Este argumento não é uma string literal. No exemplo abaixo `RCT_EXPORT_MODULE(CalendarModuleFoo)` é passado, não `RCT_EXPORT_MODULE("CalendarModuleFoo")`.

```
// Para exportar um módulo chamado CalendarModuleFoo
RCT_EXPORT_MODULE(CalendarModuleFoo);
```

O módulo nativo pode então ser acessado em JS assim:

```js
const {CalendarModuleFoo} = ReactNative.NativeModules;
```

Se você não especificar um nome, o nome do módulo JavaScript corresponderá ao nome da classe Objective-C, com quaisquer prefixos "RCT" ou "RK" removidos.

Vamos seguir o exemplo abaixo e chamar `RCT_EXPORT_MODULE` sem nenhum argumento. Como resultado, o módulo será exposto ao React Native usando o nome `CalendarModule`, já que esse é o nome da classe Objective-C, com RCT removido.

```
// Sem passar um nome, isso exportará o nome do módulo nativo como o nome da classe Objective-C com “RCT” removido
RCT_EXPORT_MODULE();
```

O módulo nativo pode então ser acessado em JS assim:

```js
const {CalendarModule} = ReactNative.NativeModules;
```

### Exportar um método nativo para JavaScript
O React Native não exporá nenhum método em um módulo nativo ao JavaScript, a menos que seja explicitamente solicitado. Isso pode ser feito usando o macro `RCT_EXPORT_METHOD`. Os métodos escritos na macro `RCT_EXPORT_METHOD` são assíncronos e o tipo de retorno é, portanto, sempre nulo. Para passar um resultado de um método `RCT_EXPORT_METHOD` para JavaScript você pode usar retornos de chamada ou emitir eventos (abordados abaixo). Vamos configurar um método nativo para nosso módulo nativo `CalendarModule` usando a macro `RCT_EXPORT_METHOD`. Chame-o de `createCalendarEvent()` e, por enquanto, aceite argumentos de nome e localização como strings. As opções de tipo de argumento serão abordadas em breve.

```m
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
}
```

> Observe que o macro `RCT_EXPORT_METHOD` não será necessário com `TurboModules`, a menos que seu método dependa da conversão de argumentos RCT (veja os tipos de argumentos abaixo). Em última análise, o React Native removerá o `RCT_EXPORT_MACRO`, por isso desencorajamos as pessoas a usar o `RCTConvert`. Em vez disso, você pode fazer a conversão do argumento dentro do corpo do método.

Antes de desenvolver a funcionalidade do método `createCalendarEvent()`, adicione um log de console no método para que você possa confirmar se ele foi invocado a partir de JavaScript em seu aplicativo React Native. Use as APIs `RCTLog` do React. Vamos importar esse cabeçalho no topo do seu arquivo e adicionar a chamada de log.

```h
#import <React/RCTLog.h>
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}
```

### Métodos Síncronos
Você pode usar `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD` para criar um método nativo síncrono.

```h
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getName)
{
return [[UIDevice currentDevice] name];
}
```

O tipo de retorno deste método deve ser do tipo objeto (id) e ser serializável para JSON. Isso significa que o gancho só pode retornar valores nulos ou JSON (por exemplo, NSNumber, NSString, NSArray, NSDictionary).

No momento, não recomendamos o uso de métodos síncronos, pois chamar métodos de forma síncrona pode causar fortes penalidades de desempenho e introduzir bugs relacionados a threading em seus módulos nativos. Além disso, observe que se você optar por usar `RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD`, seu aplicativo não poderá mais usar o depurador do Google Chrome. Isso ocorre porque os métodos síncronos exigem que a VM JS compartilhe memória com o aplicativo. Para o depurador do Google Chrome, o React Native é executado dentro da VM JS no Google Chrome e se comunica de forma assíncrona com os dispositivos móveis por meio de WebSockets.

### Teste o que você construiu
Neste ponto, você configurou a estrutura básica para seu módulo nativo no iOS. Teste isso acessando o módulo nativo e invocando seu método exportado em JavaScript.

Encontre um local em seu aplicativo onde você gostaria de adicionar uma chamada ao método `createCalendarEvent()` do módulo nativo. Abaixo está um exemplo de componente, `NewModuleButton`, que você pode adicionar ao seu aplicativo. Você pode invocar o módulo nativo dentro da função `onPress()` do `NewModuleButton`.

```tsx
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

```tsx
import {NativeModules} from 'react-native';
```

Você pode então acessar o módulo nativo `CalendarModule` fora de `NativeModules`.

```tsx
const {CalendarModule} = NativeModules;
```

Agora que você tem o módulo nativo `CalendarModule` disponível, você pode invocar seu método nativo `createCalendarEvent()`. Abaixo é adicionado ao método `onPress()` em `NewModuleButton`:

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

A etapa final é reconstruir o aplicativo React Native para que você possa ter o código nativo mais recente (com seu novo módulo nativo!) Disponível. Na linha de comando, onde o aplicativo react nativo está localizado, execute o seguinte:

```
npm run ios
// ou
yarn ios
```

### Construindo enquanto você itera
À medida que você trabalha nesses guias e itera em seu módulo nativo, você precisará fazer uma reconstrução nativa de seu aplicativo para acessar as alterações mais recentes do JavaScript. Isso ocorre porque o código que você está escrevendo fica na parte nativa do seu aplicativo. Embora o empacotador metro do React Native possa observar mudanças no JavaScript e reconstruir o pacote JS rapidamente para você, ele não fará isso para o código nativo. Portanto, se você quiser testar suas alterações nativas mais recentes, precisará reconstruí-las usando o comando acima.

### Recapitulação✨
Agora você deve conseguir invocar seu método `createCalendarEvent()` em seu módulo nativo em JavaScript. Como você está usando `RCTLog` na função, você pode confirmar se seu método nativo está sendo invocado [ativando o modo de depuração em seu aplicativo](/docs/debugging.md) e observando o console JS no Chrome ou o depurador de aplicativo móvel Flipper. Você deverá ver seu `RCTLogInfo(@"Fingindo criar um evento %@ em %@", nome, local);` mensagem cada vez que você invoca o método do módulo nativo.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/11f8175a-c432-4050-91e5-88b84a5d726b)
_Imagem dos registros do iOS no Flipper_

Neste ponto, você criou um módulo nativo do iOS e invocou um método nele a partir de JavaScript em seu aplicativo React Native. Você pode continuar lendo para aprender mais sobre coisas como quais tipos de argumento seu método de módulo nativo usa e como configurar retornos de chamada e promessas em seu módulo nativo.

## Além de um módulo nativo de calendário

### Melhor exportação de módulo nativo
Importar seu módulo nativo retirando-o de `NativeModules` como acima é um pouco complicado.

Para evitar que os consumidores do seu módulo nativo precisem fazer isso sempre que quiserem acessar seu módulo nativo, você pode criar um wrapper JavaScript para o módulo. Crie um novo arquivo JavaScript chamado `NativeCalendarModule.js` com o seguinte conteúdo:

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

Este arquivo JavaScript também se torna um bom local para você adicionar qualquer funcionalidade secundária do JavaScript. Por exemplo, se você usar um sistema de tipos como TypeScript, poderá adicionar anotações de tipo para seu módulo nativo aqui. Embora o React Native ainda não ofereça suporte à segurança de tipo Native to JS, com essas anotações de tipo, todo o seu código JS será de tipo seguro. Essas anotações também facilitarão a mudança para módulos nativos com segurança de tipo no futuro. Abaixo está um exemplo de adição de segurança de tipo ao Módulo Calendário:

```js
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

```jsx
import NativeCalendarModule from './NativeCalendarModule';
NativeCalendarModule.createCalendarEvent('foo', 'bar');
```

> Observe que isso pressupõe que o local que você está importando `CalendarModule` está na mesma hierarquia que `CalendarModule.js`. Atualize a importação relativa conforme necessário.

### Tipos de argumento
Quando um método de módulo nativo é invocado em JavaScript, o React Native converte os argumentos dos objetos JS em seus análogos de objetos Objective-C/Swift. Por exemplo, se o seu método Objective-C Native Module aceita um NSNumber, em JS você precisa chamar o método com um número. React Native cuidará da conversão para você. Abaixo está uma lista dos tipos de argumentos suportados pelos métodos de módulo nativos e os equivalentes JavaScript para os quais eles mapeiam.

| OBJECTIVE-C            | JAVASCRIPT      |
|------------------------|-----------------|
| N SString              | string, ?string |
| BOOL                   | boolean         |
| double                 | number          |
| NSNumber               | ?number         |
| NSArray                | Array, ?Array   |
| NSDictionary           | Object, ?Object |
| RCTResponseSenderBlock | Function (success) |
| RCTResponseSenderBlock, RCTResponseErrorBlock |	Function (failure) |
| RCTPromiseResolveBlock, RCTPromiseRejectBlock	| Promise |

> Os seguintes tipos são atualmente suportados, mas não serão suportados em TurboModules. Por favor, evite usá-los.
> 
> * Function (failure) -> RCTResponseErrorBlock
> * Number -> NSInteger
> * Number -> CGFloat
> * Number -> float

Para iOS, você também pode escrever métodos de módulo nativos com qualquer tipo de argumento compatível com a classe `RCTConvert` (consulte [RCTConvert](https://github.com/facebook/react-native/blob/main/packages/react-native/React/Base/RCTConvert.h) para obter detalhes sobre o que é compatível). Todas as funções auxiliares RCTConvert aceitam um valor JSON como entrada e o mapeiam para um tipo ou classe Objective-C nativo.

### Exportando Constantes
Um módulo nativo pode exportar constantes substituindo o método nativo `constantsToExport()`. Abaixo de `constantsToExport()` é substituído e retorna um Dicionário que contém uma propriedade de nome de evento padrão que você pode acessar em JavaScript da seguinte forma:

```
- (NSDictionary *)constantsToExport
{
 return @{ @"DEFAULT_EVENT_NAME": @"New Event" };
}
```

A constante pode então ser acessada invocando `getConstants()` no módulo nativo em JS da seguinte forma:

```js
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

Tecnicamente, é possível acessar constantes exportadas em `constantsToExport()` diretamente do objeto `NativeModule`. Isso não será mais compatível com TurboModules, por isso encorajamos a comunidade a mudar para a abordagem acima para evitar a migração necessária no futuro.

> Observe que as constantes são exportadas apenas no momento da inicialização, portanto, se você alterar os valores de `constantsToExport()` no tempo de execução, isso não afetará o ambiente JavaScript.

Para iOS, se você substituir `constantsToExport()` então você também deve implementar `+requireMainQueueSetup` para que o React Native saiba se seu módulo precisa ser inicializado no thread principal, antes da execução de qualquer código JavaScript. Caso contrário, você verá um aviso de que no futuro seu módulo poderá ser inicializado em um thread em segundo plano, a menos que você desative explicitamente com `+requireMainQueueSetup:`. Se o seu módulo não requer acesso ao UIKit, você deve responder a `+requerMainQueueSetup` com NÃO.

## Callback
Os módulos nativos também suportam um tipo único de argumento - um retorno de chamada. Retornos de chamada são usados para passar dados de Objective-C para JavaScript para métodos assíncronos. Eles também podem ser usados para executar JS de forma assíncrona do lado nativo.

Para iOS, os retornos de chamada são implementados usando o tipo `RCTResponseSenderBlock`. Abaixo do parâmetro de retorno de chamada `myCallBack` é adicionado ao `createCalendarEventMethod()`:

```h
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)title
                location:(NSString *)location
                myCallback:(RCTResponseSenderBlock)callback)
```

