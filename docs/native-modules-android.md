# Módulos nativos do Android

> **INFORMAÇÕES**
> Módulo Nativo e Componentes Nativos são nossas tecnologias estáveis usadas pela arquitetura legada. Eles serão descontinuados no futuro, quando a Nova Arquitetura estiver estável. A nova arquitetura usa [Turbo Native Module](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md) e [Fabric Native Components](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md) para obter resultados semelhantes.

Bem-vindo aos Módulos Nativos para Android. Comece lendo a introdução aos módulos nativos para obter uma introdução ao que são os módulos nativos.

## Crie um módulo nativo de calendário
No guia a seguir você criará um módulo nativo, CalendarModule, que permitirá acessar APIs de calendário do Android a partir de JavaScript. Ao final, você poderá chamar CalendarModule.createCalendarEvent('Dinner Party', 'My House'); do JavaScript, invocando um método Java/Kotlin que cria um evento de calendário.

### Configurar
Para começar, abra o projeto Android em seu aplicativo React Native no Android Studio. Você pode encontrar seu projeto Android aqui em um aplicativo React Native:
