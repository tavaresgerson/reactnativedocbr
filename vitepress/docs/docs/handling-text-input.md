# Tratamento de entrada de texto

`TextInput` é um componente principal que permite ao usuário inserir texto. Ele tem uma propriedade `onChangeText` que leva uma função a ser chamada toda vez que o texto é alterado, e uma propriedade `onSubmitEditing` que leva uma função a ser chamada quando o texto é enviado.

Por exemplo, digamos que enquanto o usuário digita, você traduz as palavras dele para um idioma diferente. Neste novo idioma, cada palavra é escrita da mesma maneira: 🍕. Portanto, a frase "Olá, Bob" seria traduzida como "🍕 🍕 🍕".

```jsx
import React, {useState} from 'react';
import {Text, TextInput, View} from 'react-native';

const PizzaTranslator = () => {
  const [text, setText] = useState('');
  return (
    <View style={{padding: 10}}>
      <TextInput
        style={{height: 40}}
        placeholder="Type here to translate!"
        onChangeText={newText => setText(newText)}
        defaultValue={text}
      />
      <Text style={{padding: 10, fontSize: 42}}>
        {text
          .split(' ')
          .map(word => word && '🍕')
          .join(' ')}
      </Text>
    </View>
  );
};

export default PizzaTranslator;
```

Neste exemplo, armazenamos texto no estado, pois ele muda com o tempo.

Há muito mais coisas que você pode querer fazer com uma entrada de texto. Por exemplo, você pode validar o texto interno enquanto o usuário digita. Para exemplos mais detalhados, consulte a documentação do React sobre [componentes controlados](https://reactjs.org/docs/forms.html#controlled-components) ou a documentação de referência para [TextInput](/docs/textinput.md).

A entrada de texto é uma das maneiras pelas quais o usuário interage com o aplicativo. A seguir, vamos examinar outro tipo de entrada e aprender como lidar com toques.
