# Introdução aos módulos nativos

> **INFORMAÇÕES**
> Módulo Nativo e Componentes Nativos são nossas tecnologias estáveis usadas pela arquitetura legada. Eles serão descontinuados no futuro, quando a Nova Arquitetura estiver estável. A nova arquitetura usa [Turbo Native Module](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md) e [Fabric Native Components](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md) para obter resultados semelhantes.

Às vezes, um aplicativo React Native precisa acessar uma API de plataforma nativa que não está disponível por padrão em JavaScript, por exemplo, as APIs nativas para acessar Apple ou Google Pay. Talvez você queira reutilizar algumas bibliotecas existentes de Objective-C, Swift, Java ou C++ sem ter que reimplementá-las em JavaScript ou escrever algum código multithread de alto desempenho para coisas como processamento de imagens.

O sistema NativeModule expõe instâncias de classes Java/Objective-C/C++ (nativas) para JavaScript (JS) como objetos JS, permitindo assim que você execute código nativo arbitrário de dentro de JS. Embora não esperemos que esse recurso faça parte do processo normal de desenvolvimento, é essencial que ele exista. Se o React Native não exportar uma API nativa que seu aplicativo JS precisa, você mesmo poderá exportá-la!

## Configuração do módulo nativo
Existem duas maneiras de escrever um módulo nativo para seu aplicativo React Native:

1. Diretamente nos projetos iOS/Android do seu aplicativo React Native
2. Como um pacote NPM que pode ser instalado como uma dependência por seus/outros aplicativos React Native

Este guia primeiro orientará você na implementação de um módulo nativo diretamente em um aplicativo React Native. No entanto, o módulo nativo que você constrói no guia a seguir pode ser distribuído como um pacote NPM. Confira o guia [Configurando um Módulo Nativo como um Pacote NPM](/docs/native-modules-setup.md) se você estiver interessado em fazê-lo.

## Começando
Nas seções a seguir, orientaremos você em guias sobre como construir um módulo nativo diretamente em um aplicativo React Native. Como pré-requisito, você precisará de um aplicativo React Native para trabalhar. Você pode seguir as etapas aqui para configurar um aplicativo React Native se ainda não tiver um.

Imagine que você deseja acessar as APIs de calendário nativas do iOS/Android a partir do JavaScript em um aplicativo React Native para criar eventos de calendário. React Native não expõe uma API JavaScript para se comunicar com as bibliotecas de calendário nativas. No entanto, por meio de módulos nativos, você pode escrever código nativo que se comunique com APIs de calendário nativas. Então você pode invocar esse código nativo por meio de JavaScript em seu aplicativo React Native.

Nas seções a seguir, você criará um módulo nativo do Calendário para [Android](/docs/native-modules-android.md) e [iOS](/docs/native-modules-ios.md).
