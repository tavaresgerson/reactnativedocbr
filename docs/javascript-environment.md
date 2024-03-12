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



<table>
  <tr>
    <td>TRANSFORMAÇÃO</td>
    <td>CÓDIGO</td>
  </tr>
  <tr>
    <td colspan="2">ECMAScript 5</td>
  </tr>
  <tr>
    <td>Palavras reservadas</td>
    <td><code>promise.catch(function() {...});</code></td>
  </tr>
  <tr>
    <td colspan="2">ECMAScript 2015 (ES6)</td>
  </tr>
  <tr>
    <td> <a href="http://babeljs.io/docs/learn-es2015/#arrows">Arrow functions</a></td>
    <td>
      <code><C onPress={() => this.setState({pressed: true})} /></code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/learn-es2015/#let-const">Block scoping</a>
    </td>
    <td>
      <code>`let greeting = 'hi';`</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="http://babeljs.io/docs/learn-es2015/#default-rest-spread">Call spread</a>
    </td>
    <td>
      <code>`Math.max(...array);`</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="http://babeljs.io/docs/learn-es2015/#classes">Classes</a>
    </td>
    <td>
      <code>class C extends React.Component {render() { return <View />; }}</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="http://babeljs.io/docs/learn-es2015/#enhanced-object-literals">Computed Properties</a>
    </td>
    <td>
      <code>const key = 'abc'; const obj = {[key]: 10};</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/learn-es2015/#let-const">Constants</a>
    </td>
    <td>
      <code>const answer = 42;</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="http://babeljs.io/docs/learn-es2015/#destructuring">Destructuring</a>
    </td>
    <td>
      <code>const {isActive, style} = this.props;</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of">for…of</a>
    </td>
    <td>
      <code>for (var num of [1, 2, 3]) {...};</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-function-name">Function Name</a>
    </td>
    <td>
      <code>let number = x => x;</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-literals">Literals</a>
    </td>
    <td>
      <code>const b = 0b11; const o = 0o7; const u = 'Hello\u{000A}\u{0009}!';</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="http://babeljs.io/docs/learn-es2015/#modules">Modules</a>
    </td>
    <td>
      <code>import React, {Component} from 'react';</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="http://babeljs.io/docs/learn-es2015/#enhanced-object-literals">Object Concise Method</a>
    </td>
    <td>
      <code>const obj = {method() { return 10; }};</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="http://babeljs.io/docs/learn-es2015/#enhanced-object-literals">Object Short Notation</a>
    </td>
    <td>
      <code>const name = 'vjeux'; const obj = {name};</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-parameters">Parameters</a>
    </td>
    <td>
      <code>function test(x = 'hello', {a, b}, ...args) {}</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://github.com/sebmarkbage/ecmascript-rest-spread">Rest Params</a>
    </td>
    <td>
      <code>function(type, ...args) {};</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-shorthand-properties">Shorthand Properties</a>
    </td>
    <td>
      <code>const o = {a, b, c};</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-sticky-regex">Sticky Regex</a>
    </td>
    <td>
      <code>const a = /o+/y;</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://babeljs.io/docs/learn-es2015/#template-strings">Template Literals</a>
    </td>
    <td>
      <code>const who = 'world'; const str = `Hello ${who}`;</code>
    </td>
  </tr>
  <tr>
    <td>  
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-unicode-regex">Unicode Regex</a>
    </td>
    <td>
      <code>const string = 'foo💩bar'; const match = string.match(/foo(.)bar/u);</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">ECMAScript 2016 (ES7)</td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-exponentiation-operator">Exponentiation Operator</a>
    </td>
    <td>
      <code>let x = 10 ** 2;</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">ECMAScript 2017 (ES8)</td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/tc39/ecmascript-asyncawait">Async Functions</a>
    </td>
    <td>
      <code>async function doStuffAsync() {const foo = await doOtherStuffAsync();};</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jeffmo/es-trailing-function-commas">Function Trailing Comma</a>
    </td>
    <td>
      <code>function f(a, b, c,) {};</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">ECMAScript 2018 (ES9)</td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/tc39/proposal-object-rest-spread">Object Spread</a>
    </td>
    <td>
      <code>const extended = {...obj, a: 10};</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">ECMAScript 2019 (ES10)</td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-proposal-optional-catch-binding">Optional Catch Binding</a>
    </td>
    <td>
      <code>try {throw 0; } catch { doSomethingWhichDoesNotCareAboutTheValueThrown();}</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      ECMAScript 2020 (ES11)
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import">Dynamic Imports</a>
    </td>
    <td>
      <code>const package = await import('package'); package.function()</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator">Nullish Coalescing Operator</a>
    </td>
    <td>
      <code>const foo = object.foo ?? 'default';</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/tc39/proposal-optional-chaining">Optional Chaining</a>
    </td>
    <td>
     <code>const name = obj.user?.name;</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">ECMAScript 2022 (ES13)</td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-proposal-class-properties">Class Fields</a>
    </td>
    <td>
      <code>class Bork {static a = 'foo'; static b; x = 'bar'; y;}</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Proposta da etapa 1</td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from">Export Default From</a>
    </td>
    <td>
      <code>export v from 'mod';</code>
    </td>
  </tr>
  <tr>
    <td colspan="2">Diversos</td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-template">Babel Template</a>
    </td>
    <td>
      <code>template(`const %%importName%% = require(%%source%%);`);</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://flowtype.org/">Flow</a>
    </td>
    <td>
      <code>function foo(x: ?number): string {};</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs">ESM to CJS</a>
    </td>
    <td>
      <code>export default 42;</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://reactjs.org/docs/jsx-in-depth">JSX</a>
    </td>
    <td>
      <code><View style={{color: 'red'}} /></code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-object-assign">Object Assign</a>
    </td>
    <td>
      <code>Object.assign(a, b);</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://babeljs.io/docs/en/babel-plugin-transform-react-display-name">React Display Name</a>
    </td>
    <td>
      <code>const bar = createReactClass({});</code>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.typescriptlang.org/">TypeScript</a>
    </td>
    <td>
      <code>function foo(x: {hello: true, target: 'react native!'}): string {};</code>
    </td>
  </tr>
</table>

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
