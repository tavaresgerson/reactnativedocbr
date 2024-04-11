export default [
    {
        text: 'Básico',
        collapsed: false,
        items: [
            { text: 'Introdução', link: '/docs/getting-started' },
            { text: 'Core Componentes e Componentes Nativos', link: '/docs/intro-react-native-components' },
            { text: 'Fundamentos do React', link: '/docs/intro-react.md' },
            { text: 'Tratamento de entrada de texto', link: '/docs/handling-text-input' },
            { text: 'Usando um ScrollView', link: '/docs/using-a-scrollview' },
            { text: 'Usando List Views', link: '/docs/using-a-listview' },
            { text: 'Solução de problemas', link: '/docs/troubleshooting' },
            { text: 'Código específico da plataforma', link: 'docs/platform-specific-code' },
            { text: 'Mais recursos', link: '/docs/more-resources' }
        ]
    },
    {
        text: 'Configuração do ambiente',
        collapsed: false,
        items: [
            { text: 'Configurando o ambiente de desenvolvimento', link: '/docs/environment-setup.md' },
            { text: 'Integração com aplicativos existentes', link: '/docs/integration-with-existing-apps.md' },
            { text: 'Integração com um fragmento Android', link: '/docs/integration-with-android-fragment.md' },
            { text: 'Construindo para TV', link: '/docs/building-for-tv.md' },
            { text: 'Plataformas fora da árvore', link: '/docs/out-of-tree-platforms.md' }
        ]
    },
    {
        text: 'Workflow',
        collapsed: false,
        items: [
            { text: 'Executando no dispositivo', link: '/docs/running-on-device' },
            { text: 'Atualização rápida', link: '/docs/fast-refresh' },
            { text: 'Metro', link: '/docs/metro' },
            { text: 'Simbolizando um rastreamento de pilha', link: '/docs/symbolication' },
            { text: 'Mapas de origem', link: '/docs/sourcemaps' },
            { text: 'Usando bibliotecas', link: '/docs/libraries' },
            { text: 'Usando TypeScript', link: '/docs/typescript' },
            { text: 'Atualizando para novas versões', link: '/docs/upgrading' },
        ]
    },
    {
        text: 'UI & Interação',
        collapsed: false,
        items: [
            { text: 'Estilo', link: '/docs/style' },
            { text: 'Altura e largura', link: '/docs/height-and-width' },
            { text: 'Layout com Flexbox', link: '/docs/flexbox' },
            { text: 'Imagens', link: '/docs/images' },
            { text: 'Referência de Cores', link: '/docs/colors' },
            {
                text: 'Interação',
                collapsed: true,
                items: [
                    { text: 'Lidando com toques', link: '/docs/handling-touches' },
                    { text: 'Navegando entre telas', link: '/docs/navigation' },
                    { text: 'Animações', link: '/docs/animations' },
                    { text: 'Sistema de resposta por gestos', link: '/docs/gesture-responder-system' },
                ]
            },
            {
                text: 'Conectividade',
                collapsed: true,
                items: [
                    { text: 'Rede', link: '/docs/network' },
                    { text: 'Segurança', link: '/docs/security' },
                ]
            },
            {
                text: 'Inclusão',
                collapsed: true,
                items: [
                    { text: 'Acessibilidade', link: '/docs/accessibility' },
                ]
            }
        ]
    },
    {
        text: 'Debugging',
        collapsed: false,
        items: [
            { text: 'Noções básicas de depuração', link: '/docs/debugging' },
            { text: 'Ferramentas de desenvolvedor React', link: '/docs/react-devtools' },
            { text: 'Debug Nativo', link: '/docs/native-debugging' },
        ]
    },
    {
        text: 'Testando',
        collapsed: false,
        items: [
            { text: 'Testando', link: '/docs/testing-overview' },
        ]
    },
    {
        text: 'Performance',
        collapsed: false,
        items: [
            { text: 'Visão geral do desempenho', link: '/docs/performance' },
            { text: 'Acelerando sua fase de construção', link: '/docs/build-speed' },
            { text: 'Acelerando as compilações de CI', link: '/docs/speeding-ci-builds' },
            { text: 'Otimizando a configuração da Flatlist', link: '/docs/optimizing-flatlist-configuration' },
            { text: 'Pacotes de RAM e require inline', link: '/docs/ram-bundles-inline-requires' },
            { text: 'Perfil', link: '/docs/profiling' },
            { text: 'Perfis com Hermes', link: '/docs/profile-hermes' },
        ]
    },
    {
        text: 'JavaScript Runtime',
        collapsed: false,
        items: [
            { text: 'Ambiente JavaScript', link: '/docs/javascript-environment' },
            { text: 'Timers', link: '/docs/timers' },
            { text: 'Usando o Hermes', link: '/docs/using-hermes' },
        ]
    },
    {
        text: 'Módulos Nativos',
        collapsed: false,
        items: [
            { text: 'Introdução aos módulos nativos', link: '/docs/native-modules-intro' },
            { text: 'Módulos nativos do Android', link: '/docs/native-modules-android' },
            { text: 'Módulos nativos iOS', link: '/docs/native-modules-ios' },
            { text: 'Configuração do pacote NPM de módulos nativos', link: '/docs/native-modules-setup' },
        ]
    },
    {
        text: 'Componentes Nativos',
        collapsed: false,
        items: [
            { text: 'Componentes de IU nativos do Android', link: '/docs/native-components-android' },
            { text: 'Componentes de UI nativos do iOS', link: '/docs/native-components-ios' },
            { text: 'Manipulação Direta', link: '/docs/direct-manipulation' },
        ]
    },
    {
        text: 'Guias Android e iOS',
        collapsed: false,
        items: [
            {
                text: 'Android',
                collapsed: true,
                items: [
                    { text: 'Headless JS', link: '/docs/headless-js-android' },
                    { text: 'Publicação na Google Play Store', link: '/docs/signed-apk-android' },
                    { text: 'Comunicação entre nativo e React Native', link: '/docs/communication-android' },
                    { text: 'Plug-in React Native Gradle', link: '/docs/react-native-gradle-plugin' },
                ]
            },
            {
                text: 'iOS',
                collapsed: true,
                items: [
                    { text: 'Vinculando Bibliotecas', link: '/docs/linking-libraries-ios' },
                    { text: 'Executando no Simulador', link: '/docs/running-on-simulator-ios' },
                    { text: 'Comunicação entre nativo e React Native', link: '/docs/communication-ios' },
                    { text: 'Extensões de aplicativos', link: '/docs/app-extensions' },
                    { text: 'Publicação na Apple App Store', link: '/docs/publishing-to-app-store' },
                ]
            }

        ]
    },
    {
        text: 'Experimental',
        collapsed: false,
        items: [
            { text: 'Sobre a Nova Arquitetura', link: '/docs/the-new-architecture/landing-page' },
        ]
    }
]
