# Publicação na Apple App Store

O processo de publicação é igual ao de qualquer outro aplicativo iOS nativo, com algumas considerações adicionais a serem levadas em consideração.

::: info Informações
Se você estiver usando o Expo, leia o guia do Expo para [Implantação nas App Stores](https://docs.expo.dev/distribution/app-stores/) para criar e enviar seu aplicativo para a Apple App Store. Este guia funciona com qualquer aplicativo React Native para automatizar o processo de implantação.
:::

### 1. Configurar esquema de liberação

Construir um aplicativo para distribuição na App Store requer o uso do esquema `Release` no Xcode. Os aplicativos desenvolvidos para `Release` desativarão automaticamente o menu Dev no aplicativo, o que impedirá que seus usuários acessem inadvertidamente o menu em produção. Ele também agrupará o JavaScript localmente, para que você possa colocar o aplicativo em um dispositivo e testá-lo enquanto não estiver conectado ao computador.

Para configurar seu aplicativo para ser construído usando o esquema `Release`, vá para **Product → Scheme → Edit Scheme**. Selecione a guia **Run** na barra lateral e defina o menu suspenso Build Configuration como `Release`.

<div class="one-image">
  <img class="rounded-shadow" src="/docs/assets/321064922-2e21e8bb-a216-416b-9690-09a883198c52.png" />
</div>

### Dicas profissionais

À medida que o tamanho do seu App Bundle aumenta, você pode começar a ver uma tela em branco piscando entre a tela inicial e a exibição da visualização do aplicativo raiz. Se for esse o caso, você pode adicionar o seguinte código a `AppDelegate.m` para manter sua tela inicial exibida durante a transição.

```objective-c
  // Coloque este código depois de "[self.window makeKeyAndVisible]" e antes de "return YES;"
  UIStoryboard *sb = [UIStoryboard storyboardWithName:@"LaunchScreen" bundle:nil];
  UIViewController *vc = [sb instantiateInitialViewController];
  rootView.loadingView = vc.view;
```

O pacote estático é criado sempre que você direciona um dispositivo físico, mesmo na depuração. Se você quiser economizar tempo, desative a geração de pacotes no Debug adicionando o seguinte ao seu script de shell na fase de construção do Xcode `Bundle React Native code and images`:

```bash
 if [ "${CONFIGURATION}" == "Debug" ]; then
  export SKIP_BUNDLING=true
 fi
```

### 2. Construir aplicativo para lançamento

Agora você pode criar seu aplicativo para lançamento tocando em <kbd>Cmd ⌘</kbd> + <kbd>B</kbd> ou selecionando **Produto** → **Construir** na barra de menu. Depois de criado para lançamento, você poderá distribuir o aplicativo para testadores beta e enviá-lo para a App Store.

::: info Informações
Você também pode usar o `React Native CLI` para realizar esta operação usando a opção `--mode` com o valor `Release` (por exemplo, da raiz do seu projeto: `npm run ios -- --mode="Release" ` ou `yarn ios --mode Release`).
:::

Quando terminar os testes e estiver pronto para publicar na App Store, siga este guia.

- Inicie seu terminal, navegue até a pasta iOS do seu aplicativo e digite `open .`.
- Clique duas vezes em YOUR_APP_NAME.xcworkspace. Deve iniciar o XCode.
- Clique em `Produto` → `Arquivo`. Certifique-se de configurar o dispositivo para "Qualquer dispositivo iOS (arm64)".

::: info Observação
Verifique seu identificador de pacote e certifique-se de que seja exatamente igual ao que você criou nos identificadores no Apple Developer Dashboard.
:::

- Após a conclusão do arquivo, na janela de arquivo, clique em `Distribute App`.
- Clique em `App Store Connect` agora (se quiser publicar na App Store).
- Clique em `Upload` → Certifique-se de que todas as caixas de seleção estejam marcadas, clique em `Next`.
- Escolha entre `Automatically manage signing` e `Manually manage signing` com base em suas necessidades.
- Clique em `Upload`.
- Agora você pode encontrá-lo na App Store Connect em TestFlight.

Agora preencha as informações necessárias e na seção Build, selecione a build do aplicativo e clique em `Save` → `Submit For Review`.

### 4. Capturas de tela

A Apple Store exige que você tenha capturas de tela dos dispositivos mais recentes. A referência para tais dispositivos pode ser encontrada [aqui](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/). Observe que as capturas de tela para alguns tamanhos de exibição não serão necessárias se forem fornecidas para outros tamanhos.
