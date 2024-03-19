# Componentes de IU nativos do Android

> **INFORMAÇÕES**
> Módulo Nativo e Componentes Nativos são nossas tecnologias estáveis usadas pela arquitetura legada. Eles serão descontinuados no futuro, quando a Nova Arquitetura estiver estável. A nova arquitetura usa [Turbo Native Module](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md) e [Fabric Native Components](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md) para obter resultados semelhantes.

Existem muitos widgets de UI nativos prontos para serem usados nos aplicativos mais recentes - alguns deles fazem parte da plataforma, outros estão disponíveis como bibliotecas de terceiros e ainda mais podem estar em uso em seu próprio portfólio. React Native tem vários dos componentes de plataforma mais críticos já empacotados, como `ScrollView` e `TextInput`, mas não todos eles, e certamente não aqueles que você mesmo possa ter escrito para um aplicativo anterior. Felizmente, podemos agrupar esses componentes existentes para uma integração perfeita com seu aplicativo React Native.

Assim como o guia do módulo nativo, este também é um guia mais avançado que pressupõe que você esteja familiarizado com a programação do Android SDK. Este guia mostrará como construir um componente de UI nativo, orientando você na implementação de um subconjunto do componente `ImageView` existente disponível na biblioteca principal do React Native.

## Exemplo de ImageView
Neste exemplo, examinaremos os requisitos de implementação para permitir o uso de `ImageViews` em JavaScript.

As visualizações nativas são criadas e manipuladas estendendo o `ViewManager` ou, mais comumente, o `SimpleViewManager`. Um `SimpleViewManager` é conveniente nesse caso porque aplica propriedades comuns, como cor de fundo, opacidade e layout Flexbox.

Essas subclasses são essencialmente singletons – apenas uma instância de cada é criada pela ponte. Eles enviam visualizações nativas para o `NativeViewHierarchyManager`, que delega de volta a eles a definição e atualização das propriedades das visualizações conforme necessário. Os `ViewManagers` também são normalmente os delegados das visualizações, enviando eventos de volta ao JavaScript por meio da ponte.

Para enviar uma view:

1. Crie a subclasse `ViewManager`.
2. Implemente o método `createViewInstance`
3. Expor configuradores de propriedades de visualização usando a anotação `@ReactProp` (ou `@ReactPropGroup`)
4. Cadastre o gerenciador em `createViewManagers` do pacote de aplicações.
5. Implementar o módulo JavaScript

### 1. Crie a subclasse `ViewManager`
Neste exemplo, criamos a classe gerenciadora de visualizações `ReactImageManager` que estende `SimpleViewManager` do tipo `ReactImageView`. `ReactImageView` é o tipo de objeto controlado pelo gerenciador, esta será a visualização nativa customizada. O nome retornado por `getName` é usado para fazer referência ao tipo de visualização nativa do JavaScript.

```java
// Java

public class ReactImageManager extends SimpleViewManager<ReactImageView> {

  public static final String REACT_CLASS = "RCTImageView";
  ReactApplicationContext mCallerContext;

  public ReactImageManager(ReactApplicationContext reactContext) {
    mCallerContext = reactContext;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }
}
```

```kt
// Kotlin

class ReactImageManager(
    private val callerContext: ReactApplicationContext
) : SimpleViewManager<ReactImageView>() {

  override fun getName() = REACT_CLASS

  companion object {
    const val REACT_CLASS = "RCTImageView"
  }
}
```

### 2. Implementar o método `createViewInstance`
As visualizações são criadas no método `createViewInstance`, a visualização deve ser inicializada em seu estado padrão, quaisquer propriedades serão definidas por meio de uma chamada de acompanhamento para `updateView`.

```java
// Java
@Override
  public ReactImageView createViewInstance(ThemedReactContext context) {
    return new ReactImageView(context, Fresco.newDraweeControllerBuilder(), null, mCallerContext);
  }
```

```kt
// Kotlin
  override fun createViewInstance(context: ThemedReactContext) =
      ReactImageView(context, Fresco.newDraweeControllerBuilder(), null, callerContext)
```

### 3. Exponha os configuradores de propriedades de visualização usando a anotação `@ReactProp` (ou `@ReactPropGroup`)
As propriedades que devem ser refletidas em JavaScript precisam ser expostas como método setter anotado com `@ReactProp` (ou `@ReactPropGroup`). O método setter deve considerar a visão atualizada (do tipo de visão atual) como primeiro argumento e o valor da propriedade como segundo argumento. O setter deve ser público e não retornar um valor (ou seja, o tipo de retorno deve ser void em Java ou Unit em Kotlin). O tipo de propriedade enviado para JS é determinado automaticamente com base no tipo de argumento de valor do setter. Os seguintes tipos de valores são atualmente suportados (em Java): `boolean`, `int`, `float`, `double`, `String`, `Boolean`, `Integer`, `ReadableArray`, `ReadableMap`. Os tipos correspondentes em Kotlin são `Boolean, `Int`, `Float`, `Double`, `String`, `ReadableArray`, `ReadableMap`.

A anotação `@ReactProp` possui um nome de argumento obrigatório do tipo String. O nome atribuído à anotação `@ReactProp` vinculada ao método setter é usado para referenciar a propriedade no lado JS.

Exceto pelo nome, a anotação `@ReactProp` pode receber os seguintes argumentos opcionais: `defaultBoolean`, `defaultInt,` `defaultFloat`. Esses argumentos devem ser do tipo correspondente (respectivamente `boolean`, `int`, `float` em Java e `Boolean`, `Int`, `Float` em Kotlin) e o valor fornecido será passado para o método setter caso a propriedade que o setter está referenciando tenha sido removida do componente. Observe que os valores "padrão" são fornecidos apenas para tipos primitivos; caso o setter seja de algum tipo complexo, `null` será fornecido como valor padrão caso a propriedade correspondente seja removida.

Os requisitos de declaração do setter para métodos anotados com `@ReactPropGroup` são diferentes dos de `@ReactProp`. Consulte os documentos da classe de anotação `@ReactPropGroup` para obter mais informações sobre isso. IMPORTANTE! no ReactJS, atualizar o valor da propriedade resultará na chamada do método setter. Observe que uma das maneiras de atualizar o componente é removendo as propriedades que foram definidas anteriormente. Nesse caso, o método setter também será chamado para notificar o gerenciador de visualização de que a propriedade foi alterada. Nesse caso, o valor "default" será fornecido (para tipos primitivos, o valor "default" pode ser especificado usando argumentos `defaultBoolean`, `defaultFloat`, etc. da anotação `@ReactProp`, para tipos complexos, o setter será chamado com o valor definido como nulo).

```java
// Java
  @ReactProp(name = "src")
  public void setSrc(ReactImageView view, @Nullable ReadableArray sources) {
    view.setSource(sources);
  }

  @ReactProp(name = "borderRadius", defaultFloat = 0f)
  public void setBorderRadius(ReactImageView view, float borderRadius) {
    view.setBorderRadius(borderRadius);
  }

  @ReactProp(name = ViewProps.RESIZE_MODE)
  public void setResizeMode(ReactImageView view, @Nullable String resizeMode) {
    view.setScaleType(ImageResizeMode.toScaleType(resizeMode));
  }
```

```kt
// Kotlin
  @ReactProp(name = "src")
  fun setSrc(view: ReactImageView, sources: ReadableArray?) {
    view.setSource(sources)
  }

  @ReactProp(name = "borderRadius", defaultFloat = 0f)
  override fun setBorderRadius(view: ReactImageView, borderRadius: Float) {
    view.setBorderRadius(borderRadius)
  }

  @ReactProp(name = ViewProps.RESIZE_MODE)
  fun setResizeMode(view: ReactImageView, resizeMode: String?) {
    view.setScaleType(ImageResizeMode.toScaleType(resizeMode))
  }
```

### 4. Cadastre o `ViewManager`
A etapa final é registrar o `ViewManager` na aplicação, isso acontece de forma semelhante aos [Módulos Nativos](/docs/native-modules-android.md), por meio da função membro do pacote de aplicações `createViewManagers`.

```java
// Java
  @Override
  public List<ViewManager> createViewManagers(
                            ReactApplicationContext reactContext) {
    return Arrays.<ViewManager>asList(
      new ReactImageManager(reactContext)
    );
  }
```

```kt
// Kotlin
  override fun createViewManagers(
      reactContext: ReactApplicationContext
  ) = listOf(ReactImageManager(reactContext))
```

### 5. Implemente o módulo JavaScript
A etapa final é criar o módulo JavaScript que define a camada de interface entre Java/Kotlin e JavaScript para os usuários de sua nova visualização. É recomendado que você documente a interface do componente neste módulo (por exemplo, usando TypeScript, Flow ou comentários antigos).

``` tsx
// ImageView.tsx

import {requireNativeComponent} from 'react-native';

/**
 * Composes `View`.
 *
 * - src: string
 * - borderRadius: number
 * - resizeMode: 'cover' | 'contain' | 'stretch'
 */
module.exports = requireNativeComponent('RCTImageView');
```

A função `requireNativeComponent` leva o nome da visualização nativa. Observe que se o seu componente precisar fazer algo mais sofisticado (por exemplo, manipulação de eventos personalizados), você deverá agrupar o componente nativo em outro componente React. Isso é ilustrado no exemplo `MyCustomView` abaixo.

## Eventos
Agora sabemos como expor componentes de visualização nativa que podemos controlar livremente a partir de JS, mas como lidamos com eventos do usuário, como pinçar zoom ou panorâmica? Quando ocorre um evento nativo, o código nativo deve emitir um evento para a representação JavaScript da View, e as duas visualizações são vinculadas ao valor retornado do método `getId()`.

```java
// Java

class MyCustomView extends View {
   ...
   public void onReceiveNativeEvent() {
      WritableMap event = Arguments.createMap();
      event.putString("message", "MyMessage");
      ReactContext reactContext = (ReactContext)getContext();
      reactContext
          .getJSModule(RCTEventEmitter.class)
          .receiveEvent(getId(), "topChange", event);
    }
}
```

```kt
// Kotlin

class MyCustomView(context: Context) : View(context) {
  ...
  fun onReceiveNativeEvent() {
    val event = Arguments.createMap().apply {
      putString("message", "MyMessage")
    }
    val reactContext = context as ReactContext
    reactContext
        .getJSModule(RCTEventEmitter::class.java)
        .receiveEvent(id, "topChange", event)
  }
}
```

Para mapear o nome do evento `topChange` para a propriedade de retorno de chamada `onChange` em JavaScript, registre-o substituindo o método `getExportedCustomBubblingEventTypeConstants` em seu `ViewManager`:

```java
// Java

public class ReactImageManager extends SimpleViewManager<MyCustomView> {
    ...
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder().put(
            "topChange",
            MapBuilder.of(
                "phasedRegistrationNames",
                MapBuilder.of("bubbled", "onChange")
            )
        ).build();
    }
}
```

```kt
// Kotlin

class ReactImageManager : SimpleViewManager<MyCustomView>() {
  ...
  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> {
    return mapOf(
      "topChange" to mapOf(
        "phasedRegistrationNames" to mapOf(
          "bubbled" to "onChange"
        )
      )
    )
  }
}
```

Esse retorno de chamada é invocado com o evento bruto, que normalmente processamos no componente wrapper para criar uma API mais simples:

```tsx
// MyCustomView.tsx

class MyCustomView extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }
  _onChange(event) {
    if (!this.props.onChangeMessage) {
      return;
    }
    this.props.onChangeMessage(event.nativeEvent.message);
  }
  render() {
    return <RCTMyCustomView {...this.props} onChange={this._onChange} />;
  }
}
MyCustomView.propTypes = {
  /**
   * Retorno de chamada que é chamado continuamente quando o usuário arrasta o mapa.
   */
  onChangeMessage: PropTypes.func,
  ...
};

const RCTMyCustomView = requireNativeComponent(`RCTMyCustomView`);
```

## Integration with an Android Fragment example
