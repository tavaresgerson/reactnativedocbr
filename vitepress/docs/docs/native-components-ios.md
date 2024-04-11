# Componentes de UI nativos do iOS

::: info **INFORMAÇÕES**
Módulo Nativo e Componentes Nativos são nossas tecnologias estáveis usadas pela arquitetura legada. Eles serão descontinuados no futuro, quando a Nova Arquitetura estiver estável. A nova arquitetura usa [Turbo Native Module](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md) e [Fabric Native Components](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md) para obter resultados semelhantes.
:::

Existem muitos widgets de UI nativos prontos para serem usados nos aplicativos mais recentes - alguns deles fazem parte da plataforma, outros estão disponíveis como bibliotecas de terceiros e ainda mais podem estar em uso em seu próprio portfólio. React Native tem vários dos componentes de plataforma mais críticos já empacotados, como `ScrollView` e `TextInput`, mas não todos eles, e certamente não aqueles que você mesmo possa ter escrito para um aplicativo anterior. Felizmente, podemos agrupar esses componentes existentes para uma integração perfeita com seu aplicativo React Native.

Assim como o guia do módulo nativo, este também é um guia mais avançado que pressupõe que você esteja familiarizado com a programação iOS. Este guia mostrará como construir um componente de UI nativo, orientando você na implementação de um subconjunto do componente `MapView` existente disponível na biblioteca principal do React Native.

## Exemplo de MapView para iOS

Digamos que queremos adicionar um mapa interativo ao nosso aplicativo - podemos também usar [`MKMapView`](https://developer.apple.com/library/prerelease/mac/documentation/MapKit/Reference/MKMapView_Class/index.html), só precisamos torná-lo utilizável a partir de JavaScript.

As visualizações nativas são criadas e manipuladas por subclasses de `RCTViewManager`. Essas subclasses são semelhantes em função aos controladores de visualização, mas são essencialmente singletons - apenas uma instância de cada é criada pela ponte. Eles expõem visualizações nativas ao `RCTUIManager`, que delega a eles a definição e atualização das propriedades das visualizações conforme necessário. Os `RCTViewManager`s também são normalmente os delegados das visualizações, enviando eventos de volta ao JavaScript por meio da ponte.

Para expor uma visualização, você pode:

* Subclasse `RCTViewManager` para criar um gerenciador para seu componente.
* Adicione a macro do marcador `RCT_EXPORT_MODULE()`.
* Implemente o método `-(UIView *)view`.

```c
// RNTMapManager.m

#import <MapKit/MapKit.h>

#import <React/RCTViewManager.h>

@interface RNTMapManager : RCTViewManager
@end

@implementation RNTMapManager

RCT_EXPORT_MODULE(RNTMap)

- (UIView *)view
{
  return [[MKMapView alloc] init];
}

@end
```

::: info **OBSERVAÇÃO**
Não tente definir as propriedades `frame` ou `backgroundColor` na instância `UIView` que você expõe por meio do método `-view`. O React Native substituirá os valores definidos pela sua classe personalizada para corresponder aos adereços de layout do seu componente JavaScript. Se você precisar dessa granularidade de controle, talvez seja melhor agrupar a instância do `UIView` que você deseja estilizar em outro `UIView` e retornar o `UIView` do wrapper. Consulte a [edição 2948](https://github.com/facebook/react-native/issues/2948) para obter mais contexto.
:::

::: tip **DICA**
No exemplo acima, prefixamos nosso nome de classe com `RNT`. Os prefixos são usados para evitar colisões de nomes com outras estruturas. As estruturas Apple usam prefixos de duas letras e o React Native usa `RCT` como prefixo. Para evitar colisões de nomes, recomendamos usar um prefixo de três letras diferente de `RCT` em suas próprias classes.
:::

Então você precisa de um pouco de JavaScript para tornar este um componente React utilizável:

```tsx
// MapView.tsx

import {requireNativeComponent} from 'react-native';

// requireNativeComponent resolve automaticamente 'RNTMap' para 'RNTMapManager'
module.exports = requireNativeComponent('RNTMap');
```

```tsx
// MyApp.tsx

import MapView from './MapView.tsx';

...

render() {
  return <MapView style={{flex: 1}} />;
}
```

Certifique-se de usar `RNTMap` aqui. Queremos exigir o gerenciador aqui, que irá expor a visão do nosso gerenciador para uso em JavaScript.

::: info **OBSERVAÇÃO**
Ao renderizar, não se esqueça de esticar a visualização, caso contrário você estará olhando para uma tela em branco.
:::

```tsx
  render() {
    return <MapView style={{flex: 1}} />;
  }
```

Este é agora um componente de visualização de mapa nativo totalmente funcional em JavaScript, completo com zoom de pinça e outros suportes a gestos nativos. Ainda não podemos controlá-lo a partir do JavaScript :(

### Propriedades
A primeira coisa que podemos fazer para tornar este componente mais utilizável é conectar algumas propriedades nativas. Digamos que queremos desabilitar o zoom e especificar a região visível. Desativar o zoom é um booleano, então adicionamos esta linha:

```c
// RNTMapManager.m

RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
```

Observe que especificamos explicitamente o tipo como `BOOL` - React Native usa `RCTConvert` nos bastidores para converter todos os tipos de tipos de dados diferentes ao falar pela ponte, e valores incorretos mostrarão erros "RedBox" convenientes para que você saiba que há um problema o mais rápido possível . Quando as coisas são simples assim, toda a implementação é feita por esta macro.

Agora, para realmente desabilitar o zoom, definimos a propriedade em JS:

```tsx
// MyApp.tsx

<MapView zoomEnabled={false} style={{flex: 1}} />
```

Para documentar as propriedades (e quais valores elas aceitam) do nosso componente MapView, adicionaremos um componente wrapper e documentaremos a interface com React `PropTypes`:

```tsx
// MapView.tsx

import PropTypes from 'prop-types';
import React from 'react';
import {requireNativeComponent} from 'react-native';

class MapView extends React.Component {
  render() {
    return <RNTMap {...this.props} />;
  }
}

MapView.propTypes = {
  /**
   * Um valor booleano que determina se o usuário pode usar pinçar
   * gestos para aumentar e diminuir o zoom do mapa.
   */
  zoomEnabled: PropTypes.bool,
};

const RNTMap = requireNativeComponent('RNTMap');

module.exports = MapView;
```

Agora temos um componente wrapper bem documentado para trabalhar.

A seguir, vamos adicionar a propriedade de `region` mais complexa. Começamos adicionando o código nativo:

```c
// RNTMapManager.m

RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, MKMapView)
{
  [view setRegion:json ? [RCTConvert MKCoordinateRegion:json] : defaultView.region animated:YES];
}
```

Ok, isso é mais complicado do que o caso `BOOL` que tivemos antes. Agora temos um tipo `MKCoordenRegion` que precisa de uma função de conversão e temos um código personalizado para que a visualização seja animada quando definirmos a região de JS. Dentro do corpo da função que fornecemos, `json` refere-se ao valor bruto que foi passado de JS. Há também uma variável de visualização que nos dá acesso à instância de visualização do gerenciador e um defaultView que usamos para redefinir a propriedade de volta ao valor padrão se JS nos enviar um sentinela nulo.

Você pode escrever qualquer função de conversão que desejar para sua visualização - aqui está a implementação de `MKCoordenRegion` por meio de uma categoria no `RCTConvert`. Ele usa uma categoria já existente de ReactNative `RCTConvert+CoreLocation`:

```c
// RNTMapManager.m

#import "RCTConvert+Mapkit.h"
```

```c
RCTConvert+Mapkit.h
#import <MapKit/MapKit.h>
#import <React/RCTConvert.h>
#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert+CoreLocation.h>

@interface RCTConvert (Mapkit)

+ (MKCoordinateSpan)MKCoordinateSpan:(id)json;
+ (MKCoordinateRegion)MKCoordinateRegion:(id)json;

@end

@implementation RCTConvert(MapKit)

+ (MKCoordinateSpan)MKCoordinateSpan:(id)json
{
  json = [self NSDictionary:json];
  return (MKCoordinateSpan){
    [self CLLocationDegrees:json[@"latitudeDelta"]],
    [self CLLocationDegrees:json[@"longitudeDelta"]]
  };
}

+ (MKCoordinateRegion)MKCoordinateRegion:(id)json
{
  return (MKCoordinateRegion){
    [self CLLocationCoordinate2D:json],
    [self MKCoordinateSpan:json]
  };
}

@end
```

Essas funções de conversão são projetadas para processar com segurança qualquer JSON que o JS possa lançar neles, exibindo erros "RedBox" e retornando valores de inicialização padrão quando chaves ausentes ou outros erros do desenvolvedor são encontrados.

Para finalizar o suporte para a propriedade `region`, precisamos documentá-la em `propTypes`:

```tsx
// MapView.tsx

MapView.propTypes = {
  /**
   * Um valor booleano que determina se o usuário pode usar o gesto de pinça
   * para aumentar e diminuir o zoom do mapa.
   */
  zoomEnabled: PropTypes.bool,

  /**
   * A região a ser exibida pelo mapa.
   *
   * A região é definida pelas coordenadas do centro e pela extensão do
   * coordenadas a serem exibidas.
   */
  region: PropTypes.shape({
    /**
     * Coordenadas para o centro do mapa.
     */
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,

    /**
     * Distância entre a latitude/longitude mínima e máxima
     * a ser exibida.
     */
    latitudeDelta: PropTypes.number.isRequired,
    longitudeDelta: PropTypes.number.isRequired,
  }),
};
```

```tsx
// MyApp.tsx

render() {
  const region = {
    latitude: 37.48,
    longitude: -122.16,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };
  return (
    <MapView
      region={region}
      zoomEnabled={false}
      style={{flex: 1}}
    />
  );
}
```

Aqui você pode ver que o formato da região está explícito na documentação JS.

## Eventos

Portanto, agora temos um componente de mapa nativo que podemos controlar livremente a partir de JS, mas como lidamos com eventos do usuário, como pinçar zoom ou panorâmica para alterar a região visível?

Até agora, retornamos apenas uma instância `MKMapView` do método `-(UIView *)view` do nosso gerente. Não podemos adicionar novas propriedades ao `MKMapView`, então temos que criar uma nova subclasse do `MKMapView` que usaremos para nossa View. Podemos então adicionar um retorno de chamada `onRegionChange` nesta subclasse:

```c
// RNTMapView.h

#import <MapKit/MapKit.h>

#import <React/RCTComponent.h>

@interface RNTMapView: MKMapView

@property (nonatomic, copy) RCTBubblingEventBlock onRegionChange;

@end
```

```c
// RNTMapView.m

#import "RNTMapView.h"

@implementation RNTMapView

@end
```

Observe que todos os `RCTBubblingEventBlock` devem ser prefixados com `on`. Em seguida, declare uma propriedade de manipulador de eventos em `RNTMapManager`, torne-a um delegado para todas as visualizações que expõe e encaminhe eventos para JS chamando o bloco do manipulador de eventos a partir da visualização nativa.

```c
// RNTMapManager.m

#import <MapKit/MapKit.h>
#import <React/RCTViewManager.h>

#import "RNTMapView.h"
#import "RCTConvert+Mapkit.h"

@interface RNTMapManager : RCTViewManager <MKMapViewDelegate>
@end

@implementation RNTMapManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onRegionChange, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, MKMapView)
{
  [view setRegion:json ? [RCTConvert MKCoordinateRegion:json] : defaultView.region animated:YES];
}

- (UIView *)view
{
  RNTMapView *map = [RNTMapView new];
  map.delegate = self;
  return map;
}

#pragma mark MKMapViewDelegate

- (void)mapView:(RNTMapView *)mapView regionDidChangeAnimated:(BOOL)animated
{
  if (!mapView.onRegionChange) {
    return;
  }

  MKCoordinateRegion region = mapView.region;
  mapView.onRegionChange(@{
    @"region": @{
      @"latitude": @(region.center.latitude),
      @"longitude": @(region.center.longitude),
      @"latitudeDelta": @(region.span.latitudeDelta),
      @"longitudeDelta": @(region.span.longitudeDelta),
    }
  });
}
@end
```

No método delegado `-mapView:regionDidChangeAnimated:` o bloco manipulador de eventos é chamado na visualização correspondente com os dados da região. Chamar o bloco do manipulador de eventos `onRegionChange` resulta na chamada do mesmo suporte de retorno de chamada em JavaScript. Esse retorno de chamada é invocado com o evento bruto, que normalmente processamos no componente wrapper para simplificar a API:

```tsx
MapView.tsx
class MapView extends React.Component {
  _onRegionChange = event => {
    if (!this.props.onRegionChange) {
      return;
    }

    // processar evento bruto...
    this.props.onRegionChange(event.nativeEvent);
  };
  render() {
    return (
      <RNTMap
        {...this.props}
        onRegionChange={this._onRegionChange}
      />
    );
  }
}
MapView.propTypes = {
  /**
   * Retorno de chamada que é chamado continuamente quando o usuário arrasta o mapa.
   */
  onRegionChange: PropTypes.func,
  ...
};
```

```tsx
// MyApp.tsx

class MyApp extends React.Component {
  onRegionChange(event) {
    // Faça coisas com event.region.latitude, etc.
  }

  render() {
    const region = {
      latitude: 37.48,
      longitude: -122.16,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
    return (
      <MapView
        region={region}
        zoomEnabled={false}
        onRegionChange={this.onRegionChange}
      />
    );
  }
}
```

## Lidando com múltiplas visualizações nativas

Uma visualização React Native pode ter mais de uma visualização filha na árvore de visualização, por exemplo.

```tsx
<View>
  <MyNativeView />
  <MyNativeView />
  <Button />
</View>
```

Neste exemplo, a classe `MyNativeView` é um wrapper para 'NativeComponent` e expõe métodos que serão chamados na plataforma iOS. `MyNativeView` é definido em `MyNativeView.ios.js` e contém métodos proxy de `NativeComponent`.

Quando o usuário interage com o componente, como clicar no botão, a `backgroundColor` de `MyNativeView` muda. Nesse caso, o `UIManager` não saberia qual `MyNativeView` deveria ser tratado e qual deveria mudar `backgroundColor`. Abaixo você encontrará uma solução para este problema:

```tsx
<View>
  <MyNativeView ref={this.myNativeReference} />
  <MyNativeView ref={this.myNativeReference2} />
  <Button
    onPress={() => {
      this.myNativeReference.callNativeMethod();
    }}
  />
</View>
```

Agora, o componente acima tem uma referência a um `MyNativeView` específico que nos permite usar uma instância específica de `MyNativeView`. Agora o botão pode controlar qual `MyNativeView` deve alterar sua cor de fundo. Neste exemplo, vamos supor que `callNativeMethod` altere `backgroundColor`.

```tsx
MyNativeView.ios.tsx
class MyNativeView extends React.Component {
  callNativeMethod = () => {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.getViewManagerConfig('RNCMyNativeView').Commands
        .callNativeMethod,
      [],
    );
  };

  render() {
    return <NativeComponent ref={NATIVE_COMPONENT_REF} />;
  }
}
```

`callNativeMethod` é nosso método iOS personalizado que, por exemplo, altera o `backgroundColor` que é exposto por meio de `MyNativeView`. Este método usa 
`UIManager.dispatchViewManagerCommand` que precisa de 3 parâmetros:

* `(nonnull NSNumber \*)reactTag ` -  id da visualização de reação.
* `commandID:(NSInteger)commandID`  -  Id do método nativo que deve ser chamado
* `commandArgs:(NSArray<id> \*)commandArgs`  -  Args do método nativo que podemos passar de JS para nativo.

```c
// RNCMyNativeViewManager.m

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>

RCT_EXPORT_METHOD(callNativeMethod:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        NativeView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[NativeView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
        [view callNativeMethod];
    }];

}
```

Aqui, o `callNativeMethod' é definido no arquivo `RNCMyNativeViewManager.m` e contém apenas um parâmetro que é `(nonnull NSNumber*) reactTag`. Esta função exportada encontrará uma visualização específica usando `addUIBlock` que contém o parâmetro `viewRegistry` e retorna o componente baseado em `reactTag` permitindo chamar o método no componente correto.

## Estilos

Como todas as nossas visualizações de reação nativas são subclasses de `UIView`, a maioria dos atributos de estilo funcionarão como você esperaria imediatamente. Alguns componentes irão querer um estilo padrão, por exemplo `UIDatePicker` que é um tamanho fixo. Esse estilo padrão é importante para que o algoritmo de layout funcione conforme o esperado, mas também queremos poder substituir o estilo padrão ao usar o componente. `DatePickerIOS` faz isso agrupando o componente nativo em uma visualização extra, que possui estilo flexível, e usando um estilo fixo (que é gerado com constantes passadas do nativo) no componente nativo interno:

```tsx
// DatePickerIOS.ios.tsx

import {UIManager} from 'react-native';
const RCTDatePickerIOSConsts = UIManager.RCTDatePicker.Constants;
...
  render: function() {
    return (
      <View style={this.props.style}>
        <RCTDatePickerIOS
          ref={DATEPICKER}
          style={styles.rkDatePickerIOS}
          ...
        />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  rkDatePickerIOS: {
    height: RCTDatePickerIOSConsts.ComponentHeight,
    width: RCTDatePickerIOSConsts.ComponentWidth,
  },
});
```

As constantes `RCTDatePickerIOSConsts` são exportadas do nativo capturando o quadro real do componente nativo da seguinte forma:

```c
// RCTDatePickerManager.m

- (NSDictionary *)constantsToExport
{
  UIDatePicker *dp = [[UIDatePicker alloc] init];
  [dp layoutIfNeeded];

  return @{
    @"ComponentHeight": @(CGRectGetHeight(dp.frame)),
    @"ComponentWidth": @(CGRectGetWidth(dp.frame)),
    @"DatePickerModes": @{
      @"time": @(UIDatePickerModeTime),
      @"date": @(UIDatePickerModeDate),
      @"datetime": @(UIDatePickerModeDateAndTime),
    }
  };
}
```

Este guia abordou muitos dos aspectos da ponte sobre componentes nativos personalizados, mas há ainda mais que você pode precisar considerar, como ganchos personalizados para inserir e organizar subvisualizações. Se quiser se aprofundar ainda mais, confira o [código-fonte](https://github.com/facebook/react-native/tree/main/packages/react-native/React/Views) de alguns dos componentes implementados.
