# Estilo
Com React Native, você estiliza seu aplicativo usando JavaScript. Todos os componentes principais aceitam um estilo chamado prop. Os nomes e valores dos estilos geralmente correspondem ao modo como o CSS funciona na web, exceto que os nomes são escritos em camel case, por exemplo. `backgroundColor` em vez de `background-color`.

A propriedade `style` pode ser um objeto JavaScript simples e antigo. Isso é o que normalmente usamos como código de exemplo. Você também pode passar uma matriz de estilos - o último estilo da matriz tem precedência, portanto você pode usar isso para herdar estilos.

À medida que um componente cresce em complexidade, geralmente é mais fácil usar `StyleSheet.create` para definir vários estilos em um só lugar. Aqui está um exemplo:
```jsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const LotsOfStyles = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.red}>just red</Text>
      <Text style={styles.bigBlue}>just bigBlue</Text>
      <Text style={[styles.bigBlue, styles.red]}>bigBlue, then red</Text>
      <Text style={[styles.red, styles.bigBlue]}>red, then bigBlue</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});

export default LotsOfStyles;
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/1299f9ba-fe48-4cba-8100-529cedfca219)

Um padrão comum é fazer com que seu componente aceite um suporte de `style` que, por sua vez, é usado para estilizar subcomponentes. Você pode usar isso para fazer com que os estilos "casquem" da mesma forma que fazem no CSS.

Existem muito mais maneiras de personalizar o estilo do texto. Confira a referência do [componente Texto](/docs/text.md) para uma lista completa.

Agora você pode deixar seu texto lindo. O próximo passo para se tornar um especialista em estilo é aprender como [controlar o tamanho dos componentes](/docs/height-and-width.md).

## Problemas conhecidos
* [react-native#29308](https://github.com/facebook/react-native/issues/29308#issuecomment-792864162): Em alguns casos, o React Native não corresponde ao modo como o CSS funciona na web, por exemplo, a área de toque nunca ultrapassa os limites da visualização pai e no Android a margem negativa não é suportada.
