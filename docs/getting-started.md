# Introdução

> Bem-vindo ao início de sua jornada React Native! Se você estiver procurando instruções de configuração do ambiente, elas [foram movidas para sua própria seção](/docs/environment-setup.md). Continue lendo para obter uma introdução à documentação, componentes nativos, React e muito mais!

Muitos tipos diferentes de pessoas usam React Native: desde desenvolvedores iOS avançados até iniciantes em React, até pessoas que estão começando a programar pela primeira vez em suas carreiras. Esses documentos foram escritos para todos os alunos, independentemente do nível de experiência ou formação.

## Como usar esses documentos
Você pode começar aqui e ler esses documentos linearmente como um livro; ou você pode ler as seções específicas de que precisa. Já conhece o React? Você pode pular para [essa seção](/docs/intro-react.md) - ou lê-la para uma atualização leve.

## Pré-requisitos
Para trabalhar com React Native, você precisará entender os fundamentos do JavaScript. Se você é novo em JavaScript ou precisa de uma atualização, você pode [mergulhar](https://developer.mozilla.org/en-US/docs/Web/JavaScript) ou se [atualizar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) na Mozilla Developer Network.

## Exemplos interativos
Esta introdução permite que você comece imediatamente em seu navegador com exemplos interativos como este:

```js
// Hello World
import React from 'react';
import {Text, View} from 'react-native';

const YourApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Try editing me! 🎉</Text>
    </View>
  );
};

export default YourApp;
```

> Opcionalmente, se desejar [configurar um ambiente de desenvolvimento local](/docs/environment-setup.md), você pode seguir nosso guia para configurar seu ambiente em sua máquina local e colar os exemplos de código em seu arquivo `App.js`. (Se você é um desenvolvedor web, talvez já tenha um ambiente local configurado para testes de navegadores móveis!)

## Notas do desenvolvedor
Pessoas de diversas origens de desenvolvimento estão aprendendo React Native. Você pode ter experiência com uma variedade de tecnologias, desde web até Android, iOS e muito mais. Tentamos escrever para desenvolvedores de todas as origens.

## Formatação
Os caminhos dos menus são escritos em negrito e usam sinais de intercalação para navegar nos submenus. Exemplo:** Android Studio > Preference**

Agora que você sabe como funciona este guia, é hora de conhecer a base do React Native: [Native Components](/docs/intro-react-native-components.md).
