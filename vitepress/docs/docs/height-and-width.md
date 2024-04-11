# Altura e Largura

A altura e a largura de um componente determinam seu tamanho na tela.

## Dimensões fixas

A maneira geral de definir as dimensões de um componente é adicionando uma `width` (largura) e uma `height` (altura) fixas ao estilo. Todas as dimensões no React Native não têm unidade e representam pixels independentes de densidade.

```jsx
import React from 'react';
import {View} from 'react-native';

const FixedDimensionsBasics = () => {
  return (
    <View>
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'powderblue',
        }}
      />
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'skyblue',
        }}
      />
      <View
        style={{
          width: 150,
          height: 150,
          backgroundColor: 'steelblue',
        }}
      />
    </View>
  );
};

export default FixedDimensionsBasics;
```

![image](/docs/assets/292772852-0deb095f-2dad-4820-a016-80af6859988f.png)

Definir dimensões desta forma é comum para componentes cujo tamanho deve sempre ser fixado em um número de pontos e não calculado com base no tamanho da tela.

::: warning **CUIDADO**
Não existe um mapeamento universal de pontos para unidades físicas de medida. Isso significa que um componente com dimensões fixas pode não ter o mesmo tamanho físico em diferentes dispositivos e tamanhos de tela. No entanto, essa diferença é imperceptível na maioria dos casos de uso.
:::

## Dimensões flexíveis

Use `flex` no estilo de um componente para que o componente se expanda e diminua dinamicamente com base no espaço disponível. Normalmente você usará `flex: 1`, que diz a um componente para preencher todo o espaço disponível, compartilhado igualmente entre outros componentes com o mesmo pai. Quanto maior for a flexibilidade fornecida, maior será a proporção de espaço que um componente ocupará em comparação com seus irmãos.

::: info **INFORMAÇÕES**
Um componente só pode se expandir para preencher o espaço disponível se seu pai tiver dimensões maiores que `0`. Se um pai não tiver `width` e `height` fixas ou `flex`, o pai terá dimensões de `0` e os filhos flexíveis não serão visíveis.
:::

```jsx
import React from 'react';
import {View} from 'react-native';

const FlexDimensionsBasics = () => {
  return (
    //Tente remover o `flex: 1` na visualização pai.
    // O pai não terá dimensões, portanto os filhos não poderão expandir.
    // E se você adicionar `height: 300` em vez de `flex: 1`?
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'powderblue'}} />
      <View style={{flex: 2, backgroundColor: 'skyblue'}} />
      <View style={{flex: 3, backgroundColor: 'steelblue'}} />
    </View>
  );
};

export default FlexDimensionsBasics;
```

![image](/docs/assets/292773053-a4122196-ebac-4823-a5d2-ad40bbaa0c04.png)

Depois de controlar o tamanho de um componente, a próxima etapa é aprender como organizá-lo na tela.

## Dimensões percentuais

Se quiser preencher uma determinada parte da tela, mas não quiser usar o layout flexível, você pode usar valores percentuais no estilo do componente. Semelhante às dimensões flexíveis, as dimensões percentuais exigem um pai com um tamanho definido.

```jsx
import React from 'react';
import {View} from 'react-native';

const PercentageDimensionsBasics = () => {
  // Tente remover `height: '100%'` na visualização pai.
  // O pai não terá dimensões, portanto os filhos não poderão expandir.
  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          height: '15%',
          backgroundColor: 'powderblue',
        }}
      />
      <View
        style={{
          width: '66%',
          height: '35%',
          backgroundColor: 'skyblue',
        }}
      />
      <View
        style={{
          width: '33%',
          height: '50%',
          backgroundColor: 'steelblue',
        }}
      />
    </View>
  );
};

export default PercentageDimensionsBasics;
```

![image](/docs/assets/292773120-12b6a5d4-c776-4d9e-bc8b-8d1a820703ec.png)
