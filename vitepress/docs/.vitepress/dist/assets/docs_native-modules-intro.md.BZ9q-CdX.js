import{_ as a,c as e,o,a4 as t}from"./chunks/framework.nQaBHiNx.js";const h=JSON.parse('{"title":"Introdução aos módulos nativos","description":"","frontmatter":{},"headers":[],"relativePath":"docs/native-modules-intro.md","filePath":"docs/native-modules-intro.md"}'),i={name:"docs/native-modules-intro.md"},s=t('<h1 id="introducao-aos-modulos-nativos" tabindex="-1">Introdução aos módulos nativos <a class="header-anchor" href="#introducao-aos-modulos-nativos" aria-label="Permalink to &quot;Introdução aos módulos nativos&quot;">​</a></h1><div class="info custom-block"><p class="custom-block-title"><strong>INFORMAÇÕES</strong></p><p>Módulo Nativo e Componentes Nativos são nossas tecnologias estáveis usadas pela arquitetura legada. Eles serão descontinuados no futuro, quando a Nova Arquitetura estiver estável. A nova arquitetura usa <a href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md" target="_blank" rel="noreferrer">Turbo Native Module</a> e <a href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md" target="_blank" rel="noreferrer">Fabric Native Components</a> para obter resultados semelhantes.</p></div><p>Às vezes, um aplicativo React Native precisa acessar uma API de plataforma nativa que não está disponível por padrão em JavaScript, por exemplo, as APIs nativas para acessar Apple ou Google Pay. Talvez você queira reutilizar algumas bibliotecas existentes de Objective-C, Swift, Java ou C++ sem ter que reimplementá-las em JavaScript ou escrever algum código multithread de alto desempenho para coisas como processamento de imagens.</p><p>O sistema NativeModule expõe instâncias de classes Java/Objective-C/C++ (nativas) para JavaScript (JS) como objetos JS, permitindo assim que você execute código nativo arbitrário de dentro de JS. Embora não esperemos que esse recurso faça parte do processo normal de desenvolvimento, é essencial que ele exista. Se o React Native não exportar uma API nativa que seu aplicativo JS precisa, você mesmo poderá exportá-la!</p><h2 id="configuracao-do-modulo-nativo" tabindex="-1">Configuração do módulo nativo <a class="header-anchor" href="#configuracao-do-modulo-nativo" aria-label="Permalink to &quot;Configuração do módulo nativo&quot;">​</a></h2><p>Existem duas maneiras de escrever um módulo nativo para seu aplicativo React Native:</p><ol><li>Diretamente nos projetos iOS/Android do seu aplicativo React Native</li><li>Como um pacote NPM que pode ser instalado como uma dependência por seus/outros aplicativos React Native</li></ol><p>Este guia primeiro orientará você na implementação de um módulo nativo diretamente em um aplicativo React Native. No entanto, o módulo nativo que você constrói no guia a seguir pode ser distribuído como um pacote NPM. Confira o guia <a href="/docs/native-modules-setup.html">Configurando um Módulo Nativo como um Pacote NPM</a> se você estiver interessado em fazê-lo.</p><h2 id="comecando" tabindex="-1">Começando <a class="header-anchor" href="#comecando" aria-label="Permalink to &quot;Começando&quot;">​</a></h2><p>Nas seções a seguir, orientaremos você em guias sobre como construir um módulo nativo diretamente em um aplicativo React Native. Como pré-requisito, você precisará de um aplicativo React Native para trabalhar. Você pode seguir as etapas aqui para configurar um aplicativo React Native se ainda não tiver um.</p><p>Imagine que você deseja acessar as APIs de calendário nativas do iOS/Android a partir do JavaScript em um aplicativo React Native para criar eventos de calendário. React Native não expõe uma API JavaScript para se comunicar com as bibliotecas de calendário nativas. No entanto, por meio de módulos nativos, você pode escrever código nativo que se comunique com APIs de calendário nativas. Então você pode invocar esse código nativo por meio de JavaScript em seu aplicativo React Native.</p><p>Nas seções a seguir, você criará um módulo nativo do Calendário para <a href="/docs/native-modules-android.html">Android</a> e <a href="/docs/native-modules-ios.html">iOS</a>.</p>',12),r=[s];function n(c,d,u,m,l,v){return o(),e("div",null,r)}const g=a(i,[["render",n]]);export{h as __pageData,g as default};
