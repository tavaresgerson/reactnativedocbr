# Ambiente JavaScript

## Tempo de execução JavaScript
Ao usar React Native, você executará seu código JavaScript em até três ambientes:

* Na maioria dos casos, o React Native usará o [Hermes](/docs/hermes.md), um mecanismo JavaScript de código aberto otimizado para o React Native.
* Se o Hermes estiver desativado, o React Native usará [JavaScriptCore](http://trac.webkit.org/wiki/JavaScriptCore), o mecanismo JavaScript que alimenta o Safari. Observe que no iOS, JavaScriptCore não usa JIT devido à ausência de memória executável gravável em aplicativos iOS.
* Ao usar a depuração do Chrome, todo o código JavaScript é executado no próprio Chrome, comunicando-se com o código nativo por meio de WebSockets. O Chrome usa [V8](https://v8.dev/) como mecanismo JavaScript.

Embora esses ambientes sejam muito semelhantes, você pode acabar encontrando algumas inconsistências. É melhor evitar depender de especificações de qualquer tempo de execução.

## Transformadores de sintaxe JavaScript
Os transformadores de sintaxe tornam a escrita de código mais agradável, permitindo que você use a nova sintaxe JavaScript sem ter que esperar pelo suporte de todos os interpretadores.

O React Native vem com o compilador [Babel JavaScript](https://babeljs.io/). Verifique a [documentação do Babel](https://babeljs.io/docs/plugins/#transform-plugins) sobre suas transformações suportadas para obter mais detalhes.

Uma lista completa das transformações habilitadas para React Native pode ser encontrada em [@react-native/babel-preset](https://github.com/facebook/react-native/tree/main/packages/react-native-babel-preset).


| TRANSFORMAÇÃO                                                                                         | CÓDIGO                                                                    |
|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| **ECMAScript 5**                                                                                      |                                                                           |
| Palavras reservadas                                                                                   | `promise.catch(function() {...});`                                        |
| [Arrow functions](http://babeljs.io/docs/learn-es2015/#arrows)                                        | `<C onPress={() => this.setState({pressed: true})} />`                    |
| [Block scoping](https://babeljs.io/docs/learn-es2015/#let-const)                                      | `let greeting = 'hi';`                                                    |
| [Call spread](http://babeljs.io/docs/learn-es2015/#default-rest-spread)                               | `Math.max(...array);`                                                     |
| [Classes](http://babeljs.io/docs/learn-es2015/#classes)                                               | `class C extends React.Component { render() { return <View />; } }`       |
| [Computed Properties](http://babeljs.io/docs/learn-es2015/#enhanced-object-literals)                  | `const key = 'abc'; const obj = {[key]: 10};`                             |
| [Constants](https://babeljs.io/docs/learn-es2015/#let-const)                                          | `const answer = 42;`                                                      |
| [Destructuring](http://babeljs.io/docs/learn-es2015/#destructuring)                                   | `const {isActive, style} = this.props;`                                   |
| [for…of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)       | `for (var num of [1, 2, 3]) {...};`                                       |
| [Function Name](https://babeljs.io/docs/en/babel-plugin-transform-function-name)                      | `let number = x => x;`                                                    |
| [Literals](https://babeljs.io/docs/en/babel-plugin-transform-literals)                                | `const b = 0b11; const o = 0o7; const u = 'Hello\u{000A}\u{0009}!';`      |
| [Modules](http://babeljs.io/docs/learn-es2015/#modules)                                               | `import React, {Component} from 'react';`                                 |
| [Object Concise Method](http://babeljs.io/docs/learn-es2015/#enhanced-object-literals)                | `const obj = {method() { return 10; }};`                                  |
| [Object Short Notation](http://babeljs.io/docs/learn-es2015/#enhanced-object-literals)                | `const name = 'vjeux'; const obj = {name};`                               |
| [Parameters](https://babeljs.io/docs/en/babel-plugin-transform-parameters)                            | `function test(x = 'hello', {a, b}, ...args) {}`                          |
| [Rest Params](https://github.com/sebmarkbage/ecmascript-rest-spread)                                  | `function(type, ...args) {};`                                             |
| [Shorthand Properties](https://babeljs.io/docs/en/babel-plugin-transform-shorthand-properties)        | `const o = {a, b, c};`                                                    |
| [Sticky Regex](https://babeljs.io/docs/en/babel-plugin-transform-sticky-regex)                        | `const a = /o+/y;`                                                        |
| [Template Literals](https://babeljs.io/docs/learn-es2015/#template-strings)                           | `const who = 'world'; const str = `Hello ${who}`;`                        |
| [Unicode Regex](https://babeljs.io/docs/en/babel-plugin-transform-unicode-regex)                      | `const string = 'foo💩bar'; const match = string.match(/foo(.)bar/u);`    |
| **ECMAScript 2016 (ES7)**                                                                             |                                                                           |
| [Exponentiation Operator](https://babeljs.io/docs/en/babel-plugin-transform-exponentiation-operator)  | `let x = 10 ** 2;`                                                        |
| **ECMAScript 2017 (ES8)**                                                                             |                                                                           |
| [Async Functions](https://github.com/tc39/ecmascript-asyncawait)                                      | `async function doStuffAsync() {const foo = await doOtherStuffAsync();};` |
| [Function Trailing Comma](https://github.com/jeffmo/es-trailing-function-commas)                      | `function f(a, b, c,) {};`                                                |
| **ECMAScript 2018 (ES9)**                                                                             |                                                                           |
| [Object Spread](https://github.com/tc39/proposal-object-rest-spread)                                  | `const extended = {...obj, a: 10};`                                       |
| **ECMAScript 2019 (ES10)**                                                                            |                                                                           |
| [Optional Catch Binding](https://babeljs.io/docs/en/babel-plugin-proposal-optional-catch-binding)     | `try {throw 0; } catch { doSomethingWhichDoesNotCareAboutTheValueThrown();}` |
| **ECMAScript 2020 (ES11)**                                                                            |                                                                           |
| [Dynamic Imports](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import)                      | `const package = await import('package'); package.function()`             |
| [Nullish Coalescing Operator](https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator) | `const foo = object.foo ?? 'default';`                              |
| [Optional Chaining](https://github.com/tc39/proposal-optional-chaining)                               | `const name = obj.user?.name;`                                            |
| **ECMAScript 2022 (ES13)**                                                                            |                                                                           |
| [Class Fields](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)                     | `class Bork {static a = 'foo'; static b; x = 'bar'; y;}`                  |
| **Proposta da etapa 1**                                                                               |                                                                           |
| [Export Default From](https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from)           | `export v from 'mod';`                                                    |
| **Diversos**                                                                                          |                                                                           |
| [Babel Template](https://babeljs.io/docs/en/babel-template)                                           | `template(`const %%importName%% = require(%%source%%);`);`                |
| [Flow](https://flowtype.org/)                                                                         | `function foo(x: ?number): string {};`                                    |
| [ESM to CJS](https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs)                      | `export default 42;`                                                      |
| [JSX](https://reactjs.org/docs/jsx-in-depth)                                                          | <span v-pre>`<View style={{color: 'red'}} />`</span>                      |
| [Object Assign](https://babeljs.io/docs/en/babel-plugin-transform-object-assign)                      | `Object.assign(a, b);`                                                    |
| [React Display Name](https://babeljs.io/docs/en/babel-plugin-transform-react-display-name)            | `const bar = createReactClass({});`                                       |
| [TypeScript](https://www.typescriptlang.org/)                                                         | `function foo(x: {hello: true, target: 'react native!'}): string {};`     |

## Polifills
Muitas funções padrão também estão disponíveis em todos os tempos de execução JavaScript suportados.

#### Navegador
* [CommonJS require](https://nodejs.org/docs/latest/api/modules.html)
* [`console.{log, warn, error, info, debug, trace, table, group, groupCollapsed, groupEnd}`](https://developer.chrome.com/devtools/docs/console-api)
* [XMLHttpRequest, fetch](/docs/network.md)
* [{set, clear}{Timeout, Interval, Immediate}, {request, cancel}AnimationFrame](https://reactnative.dev/docs/0.72/timers#content)

#### ECMAScript 2015 (ES6)
* [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
* Array.prototype.{ [find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), [findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) }
* [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
* String.prototype.{[startsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith), [endsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith), [repeat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat), [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)}

#### ECMAScript 2016 (ES7)
* Array.prototype.[includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)

#### ECMAScript 2017 (ES8)
* Object.{[entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries), [values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)}

#### Específico
* `__DEV__`
