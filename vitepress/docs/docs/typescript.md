# Usando TypeScript

TypeScript é uma linguagem que estende JavaScript adicionando definições de tipo. Novos projetos React Native são direcionados ao TypeScript por padrão, mas também oferecem suporte a JavaScript e Flow.

## Introdução ao TypeScript

Novos projetos criados pela [CLI React Native](/docs/environment-setup.md) ou modelos populares como [Ignite](https://github.com/infinitered/ignite) usarão TypeScript por padrão.

O TypeScript também pode ser usado com o [Expo](https://expo.io/), que mantém modelos TypeScript, ou solicitará que você instale e configure automaticamente o TypeScript quando um arquivo `.ts` ou `.tsx` for adicionado ao seu projeto.

```bash
npx create-expo-app --template
```

## Adicionando TypeScript a um projeto existente

1. Adicione plug-ins TypeScript, tipos e ESLint ao seu projeto.

::: code-group
```bash [npm]
npm install -D @tsconfig/react-native @types/jest @types/react @types/react-test-renderer typescript
```
```bash [yarn]
yarn add --dev @tsconfig/react-native @types/jest @types/react @types/react-test-renderer typescript
```
:::

::: info **OBSERVAÇÃO**
Este comando adiciona a versão mais recente de cada dependência. As versões podem precisar ser alteradas para corresponder aos pacotes existentes usados pelo seu projeto. Você pode usar uma ferramenta como [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) para ver as versões fornecidas pelo React Native.
:::

2. Adicione um arquivo de configuração TypeScript. Crie um `tsconfig.json` na raiz do seu projeto:

```json
{
  "extends": "@tsconfig/react-native/tsconfig.json"
}
```

3. Renomeie um arquivo JavaScript para *.tsx

::: warning ATENÇÃO
Você deve deixar o arquivo de ponto de entrada `./index.js` como está, caso contrário, poderá ter problemas ao agrupar uma construção de produção.
:::

4. Execute o `yarn tsc` para verificar o tipo de seus novos arquivos TypeScript.

## Usando JavaScript em vez de TypeScript

O React Native padroniza novos aplicativos para TypeScript, mas JavaScript ainda pode ser usado. Arquivos com extensão `.jsx` são tratados como JavaScript em vez de TypeScript e não serão verificados. Módulos JavaScript ainda podem ser importados por módulos TypeScript, junto com o inverso.

## Como funcionam o TypeScript e o React Native

Pronto para uso, os códigos TypeScript são transformados pelo [Babel](/docs/javascript-environment.md) durante o empacotamento. Recomendamos que você use o compilador TypeScript apenas para verificação de tipo. Este é o comportamento padrão do `tsc` para aplicativos recém-criados. Se você tiver código TypeScript existente sendo portado para React Native, há [uma ou duas advertências](https://babeljs.io/docs/en/next/babel-plugin-transform-typescript) ao usar Babel em vez de TypeScript.

## Qual é a aparência do React Native + TypeScript

Você pode fornecer uma interface para [Props](/docs/props.md) e [State](/docs/state.md) de um componente React via `React.Component<Props, State>` que fornecerá verificação de tipo e preenchimento automático do editor ao trabalhar com esse componente em JSX.

```tsx
// components/Hello.tsx

import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

const Hello: React.FC<Props> = ({
  name,
  baseEnthusiasmLevel = 0,
}) => {
  const [enthusiasmLevel, setEnthusiasmLevel] = React.useState(
    baseEnthusiasmLevel,
  );

  const onIncrement = () =>
    setEnthusiasmLevel(enthusiasmLevel + 1);
  const onDecrement = () =>
    setEnthusiasmLevel(
      enthusiasmLevel > 0 ? enthusiasmLevel - 1 : 0,
    );

  const getExclamationMarks = (numChars: number) =>
    numChars > 0 ? Array(numChars + 1).join('!') : '';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hello {name}
        {getExclamationMarks(enthusiasmLevel)}
      </Text>
      <View>
        <Button
          title="Increase enthusiasm"
          accessibilityLabel="increment"
          onPress={onIncrement}
          color="blue"
        />
        <Button
          title="Decrease enthusiasm"
          accessibilityLabel="decrement"
          onPress={onDecrement}
          color="red"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
  },
});

export default Hello;
```

Você pode explorar mais a sintaxe no [playground TypeScript](https://www.typescriptlang.org/play?strictNullChecks=false&jsx=3#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wG4BYAKFEljgG8AhAVxhggDsAaOAZRgCeAGyS8AFkiQweAFSQAPaXABqwJAHcAvnGy4CRdDAC0HFDGAA3JGSpUFteILBI4ABRxgAznAC8DKnBwpiBIAFxwnjBQwBwA5hSUgQBGKJ5IAKIcMGLMnsCpIAAySFZCAPzhHMwgSUhQCZq2lGickXAAEkhCQhDhyIYAdABiAMIAPO4QXgB8vnAAFPRBKCE8KWmZ2bn5nkUlXXMADHCaAJS+s-QBcC0cbQDaSFk5eQXFpTxpMJsvO3ulAF05v0MANcqIYGYkPN1hlnts3vshKcEtdbm1OABJDhoIghLJzebnHyzL4-BG7d5deZPLavSlIuAAajgAEYUWjWvBOAARJC4pD4+B+IkXCJScn0-7U2m-RGlOCzY5lOCyinSoRwIxsuDhQ4cyicu7wWIS+RoIQrMzATgAWRQUAA1t4RVUQCMxA7PJVqrUoMTZm6PV7FXBlXAAIJQKAoATzIOeqDeFnsgYAKwgMXm+AAhPhzuF8DZDYk4EQYMwoBwFtdAmNVBoIoIRD56JFhEhPANbpCYnVNNNa4E4GM5Iomx3W+2RF3YkQpDFYgOh8OOl0evR8ARGqXV4F6MEkDu98P6KbvubLSBrXaHc6afCpVTkce92MAPRjmCD3fD+tqdQfxPOsWDYTgVz3cwYBbAAibEBVSFw1SlGCINXdA0E7PIkmAIRgEEQoUFqIQfBgmIBSFVDfxPTh3Cw1ssRxPFaVfYCbggHooFIpIhGYJAqLY98gOAsZQPYDg0OHKDYL5BC0lVR8-gEti4AwrDgBwvCCKIrpSIAE35ZismUtjaKITxPAYjhZKMmBWOAlpONIog9JMvchIgj8G0AocvIA4SDU0VFmi5CcZzmfgO3ESQYG7AwYGhK5Sx7FA+ygcIktXTARHkcJWS4IcUDw2IOExBKQG9OAYMwrI6hggrfzTXJzEwAQRk4BKsnCaraTq65NAawI5xixcMqHTAOt4YAAC8wjgAAmQ5BuHCasgAdSQYBYjEGBCySDi9PwZbAmvKBYhiPKADZloGqgzmC+xoHgAzMBQZghHgTpuggBIgA).

## Onde encontrar conselhos úteis

* [Manual TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)
* [Documentação do React no TypeScript](https://reactjs.org/docs/static-type-checking.html#typescript)
* [React + TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#reacttypescript-cheatsheets) tem uma boa visão geral sobre como usar React com TypeScript

## Usando aliases de caminho personalizados com TypeScript

Para usar aliases de caminho personalizados com TypeScript, você precisa definir os aliases de caminho para funcionarem tanto no Babel quanto no TypeScript. Veja como:

1. Edite seu `tsconfig.json` para ter seus [mapeamentos de caminho personalizados](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping). Defina qualquer coisa na raiz de `src` para estar disponível sem nenhuma referência de caminho anterior e permita que qualquer arquivo de teste seja acessado usando `tests/File.tsx`:

```
{
  "extends": "@tsconfig/react-native/tsconfig.json" // [!code --]
  "extends": "@tsconfig/react-native/tsconfig.json", // [!code ++]
  "compilerOptions": { // [!code ++]
    "baseUrl": ".", // [!code ++]
    "paths": { // [!code ++]
      "*": ["src/*"], // [!code ++]
      "tests": ["tests/*"], // [!code ++]
      "@components/*": ["src/components/*"], // [!code ++]
    }, // [!code ++]
  } // [!code ++]
}
```

Adicione [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver) como um pacote de desenvolvimento ao seu projeto:

::: code-group
```bash [npm]
npm install --save-dev babel-plugin-module-resolver
```
```bash [yarn]
yarn add --dev babel-plugin-module-resolver
```
:::

Por fim, configure seu `babel.config.js` (observe que a sintaxe do seu `babel.config.js` é diferente do seu `tsconfig.json`):

```json
{
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [ // [!code ++]
    [ // [!code ++]
        'module-resolver', // [!code ++]
        { // [!code ++]
          root: ['./src'], // [!code ++]
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'], // [!code ++]
          alias: { // [!code ++]
          tests: ['./tests/'], // [!code ++]
          "@components": "./src/components", // [!code ++]
        } // [!code ++]
      } // [!code ++]
    ] // [!code ++]
  ] // [!code ++]
}
```
