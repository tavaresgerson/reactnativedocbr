# Comunicação entre nativo e React Native

Em [Guia de integração com aplicativos existentes](/docs/integration-with-existing-apps.md) e [Guia de componentes de UI nativos](/docs/native-components-android.md) aprendemos como incorporar o React Native em um componente nativo e vice-versa. Quando misturamos componentes nativos e React Native, eventualmente encontraremos a necessidade de comunicação entre esses dois mundos. Algumas maneiras de conseguir isso já foram mencionadas em outros guias. Este artigo resume as técnicas disponíveis.

## Introdução

O React Native é inspirado no React, então a ideia básica do fluxo de informações é semelhante. O fluxo no React é unidirecional. Mantemos uma hierarquia de componentes, na qual cada componente depende apenas de seu pai e de seu próprio estado interno. Fazemos isso com propriedades: os dados são passados ​​de um pai para seus filhos de cima para baixo. Se um componente ancestral depende do estado de seu descendente, deve-se transmitir um retorno de chamada a ser usado pelo descendente para atualizar o ancestral.

O mesmo conceito se aplica ao React Native. Contanto que estejamos construindo nosso aplicativo exclusivamente dentro da estrutura, podemos direcioná-lo com propriedades e retornos de chamada. Mas, quando misturamos componentes React Native e nativos, precisamos de alguns mecanismos específicos entre linguagens que nos permitam passar informações entre eles.

## Propriedades

As propriedades são a forma mais direta de comunicação entre componentes. Portanto, precisamos de uma maneira de passar propriedades tanto de nativo para React Native quanto de React Native para nativo.

### Passando propriedades de Native para React Native

Você pode passar propriedades para o aplicativo React Native fornecendo uma implementação personalizada de `ReactActivityDelegate` em sua atividade principal. Esta implementação deve substituir `getLaunchOptions` para retornar um `Bundle` com as propriedades desejadas.

::: code-group
```java [Java]
public class MainActivity extends ReactActivity {
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected Bundle getLaunchOptions() {
        Bundle initialProperties = new Bundle();
        ArrayList<String> imageList = new ArrayList<String>(Arrays.asList(
                "https://dummyimage.com/600x400/ffffff/000000.png",
                "https://dummyimage.com/600x400/000000/ffffff.png"
        ));
        initialProperties.putStringArrayList("images", imageList);
        return initialProperties;
      }
    };
  }
}
```

```kotlin [Kotlin]
class MainActivity : ReactActivity() {
    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun getLaunchOptions(): Bundle {
                val imageList = arrayListOf("https://dummyimage.com/600x400/ffffff/000000.png", "https://dummyimage.com/600x400/000000/ffffff.png")
                val initialProperties = Bundle().apply { putStringArrayList("images", imageList) }
                return initialProperties
            }
        }
    }
}
```
:::

```tsx
import React from 'react';
import {View, Image} from 'react-native';

export default class ImageBrowserApp extends React.Component {
  renderImage(imgURI) {
    return <Image source={{uri: imgURI}} />;
  }
  render() {
    return <View>{this.props.images.map(this.renderImage)}</View>;
  }
}
```

`ReactRootView` fornece uma propriedade de leitura e gravação `appProperties`. Depois que `appProperties` for definido, o aplicativo React Native será renderizado novamente com novas propriedades. A atualização só é realizada quando as novas propriedades atualizadas diferem das anteriores.

::: code-group
```java [Java]
Bundle updatedProps = mReactRootView.getAppProperties();
ArrayList<String> imageList = new ArrayList<String>(Arrays.asList(
        "https://dummyimage.com/600x400/ff0000/000000.png",
        "https://dummyimage.com/600x400/ffffff/ff0000.png"
));
updatedProps.putStringArrayList("images", imageList);

mReactRootView.setAppProperties(updatedProps);
```

```kotlin [Kotlin]
var updatedProps: Bundle = reactRootView.getAppProperties()
var imageList = arrayListOf("https://dummyimage.com/600x400/ff0000/000000.png", "https://dummyimage.com/600x400/ffffff/ff0000.png")
```
:::

Não há problema em atualizar propriedades a qualquer momento. No entanto, as atualizações devem ser realizadas no thread principal. Você usa o getter em qualquer thread.

Não há como atualizar apenas algumas propriedades por vez. Sugerimos que você o crie em seu próprio wrapper.

::: info Nota
Atualmente, a função JS `componentWillUpdateProps` do componente RN de nível superior não será chamada após uma atualização de prop. No entanto, você pode acessar os novos adereços na função `componentDidMount`.
:::

### Passando propriedades do React Native para Native

O problema de exposição de propriedades de componentes nativos é abordado em detalhes [neste artigo](/docs/native-components-android.md). Resumindo, as propriedades que devem ser refletidas em JavaScript precisam ser expostas como um método setter anotado com `@ReactProp` e, em seguida, usá-las no React Native como se o componente fosse um componente React Native comum.

### Limites de propriedades

A principal desvantagem das propriedades entre linguagens é que elas não suportam retornos de chamada, o que nos permitiria lidar com ligações de dados de baixo para cima. Imagine que você tem uma pequena visualização RN que deseja remover da visualização pai nativa como resultado de uma ação JS. Não há como fazer isso com adereços, pois as informações precisariam ir de baixo para cima.

Embora tenhamos uma variedade de retornos de chamada entre linguagens ([descritos aqui](/docs/native-modules-android.md)), esses retornos de chamada nem sempre são o que precisamos. O principal problema é que eles não devem ser passados ​​como propriedades. Em vez disso, esse mecanismo nos permite acionar uma ação nativa de JS e manipular o resultado dessa ação em JS.

## Outras formas de interação entre idiomas (eventos e módulos nativos)

Conforme declarado no capítulo anterior, o uso de propriedades apresenta algumas limitações. Às vezes, as propriedades não são suficientes para conduzir a lógica do nosso aplicativo e precisamos de uma solução que dê mais flexibilidade. Este capítulo cobre outras técnicas de comunicação disponíveis no React Native. Eles podem ser usados ​​para comunicação interna (entre JS e camadas nativas no RN), bem como para comunicação externa (entre RN e a parte 'nativa pura' do seu aplicativo).

React Native permite que você execute chamadas de função em vários idiomas. Você pode executar código nativo personalizado de JS e vice-versa. Infelizmente, dependendo do lado em que trabalhamos, alcançamos o mesmo objetivo de maneiras diferentes. Para nativo - usamos mecanismo de eventos para agendar a execução de uma função manipuladora em JS, enquanto para React Native chamamos diretamente métodos exportados por módulos nativos.

### Chamando funções React Native a partir de nativos (eventos)

Os eventos são descritos em detalhes [neste artigo](/docs/native-components-android.md). Observe que o uso de eventos não nos dá garantias sobre o tempo de execução, pois o evento é tratado em um thread separado.

Os eventos são poderosos porque nos permitem alterar os componentes do React Native sem precisar de uma referência a eles. No entanto, existem algumas armadilhas nas quais você pode cair ao usá-los:

- Como os eventos podem ser enviados de qualquer lugar, eles podem introduzir dependências do tipo espaguete em seu projeto.
- Os eventos compartilham namespace, o que significa que você pode encontrar algumas colisões de nomes. As colisões não serão detectadas estaticamente, o que as torna difíceis de depurar.
- Se você usar várias instâncias do mesmo componente React Native e quiser distingui-las da perspectiva do seu evento, provavelmente precisará introduzir identificadores e passá-los junto com os eventos (você pode usar o `reactTag` da visualização nativa como um identificador).

### Chamando funções nativas do React Native (módulos nativos)

Módulos nativos são classes Java/Kotlin disponíveis em JS. Normalmente, uma instância de cada módulo é criada por ponte JS. Eles podem exportar funções e constantes arbitrárias para React Native. Eles foram abordados em detalhes [neste artigo](/docs/native-modules-android.md).

::: warning Aviso
Todos os módulos nativos compartilham o mesmo namespace. Cuidado com colisões de nomes ao criar novos.
:::
