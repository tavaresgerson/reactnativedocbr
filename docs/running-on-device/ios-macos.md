## 1. Conecte seu dispositivo via USB
Conecte seu dispositivo iOS ao Mac usando um cabo USB para Lightning. Navegue até a pasta `ios` em seu projeto e abra o arquivo `.xcodeproj` ou, se estiver usando CocoaPods, abra `.xcworkspace`, dentro dele usando o Xcode.

Se esta for a primeira vez que você executa um aplicativo em seu dispositivo iOS, talvez seja necessário registrar seu dispositivo para desenvolvimento. Abra o menu **Product** na barra de menu do Xcode e vá para **Destination**. Procure e selecione seu dispositivo na lista. O Xcode registrará seu dispositivo para desenvolvimento.

## 2. Configure a assinatura de código
Registre-se para obter uma [conta de desenvolvedor Apple](https://developer.apple.com/), caso ainda não tenha uma.

Selecione seu projeto no Xcode Project Navigator e, em seguida, selecione seu destino principal (deve ter o mesmo nome do seu projeto). Procure a aba “General”. Vá para "Signing" e certifique-se de que sua conta ou equipe de desenvolvedor Apple esteja selecionada no menu suspenso Equipe. Faça o mesmo para o alvo de testes (termina com Tests e está abaixo do seu alvo principal).

Repita esta etapa para o destino Testes em seu projeto.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/273dca85-faa0-47ae-91df-cadf50a8d93c)

## 3. Crie e execute seu aplicativo
Se tudo estiver configurado corretamente, seu dispositivo será listado como destino de compilação na barra de ferramentas do Xcode e também aparecerá no painel Dispositivos (`Shift ⇧` + `Cmd ⌘` + `2`). Agora você pode pressionar o botão **Build and run** (`Cmd ⌘` + `R`) ou selecionar **Run** no menu **Product**. Seu aplicativo será iniciado em seu dispositivo em breve.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/749ebf4e-e79c-40ba-aba4-d53d68980d2e)

> Se você tiver algum problema, consulte os documentos da [Apple Como iniciar seu aplicativo em um dispositivo](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4).

## Conectando-se ao servidor de desenvolvimento
Você também pode iterar rapidamente em um dispositivo usando o servidor de desenvolvimento. Você só precisa estar na mesma rede Wi-Fi do seu computador. Agite seu dispositivo para abrir o [Dev Menu](/docs/debugging.md) e ative o Live Reload. Seu aplicativo será recarregado sempre que seu código JavaScript for alterado.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/29d54dfe-1e52-4825-a725-72ef104637f6)

### Solução de problemas

> Se você tiver algum problema, certifique-se de que seu Mac e seu dispositivo estejam na mesma rede e possam se comunicar. Muitas redes sem fio abertas com portais cativos são configuradas para impedir que dispositivos alcancem outros dispositivos na rede. Você pode usar o recurso Personal Hotspot do seu dispositivo neste caso. Você também pode compartilhar sua conexão de Internet (Wi-Fi/Ethernet) do seu Mac para o seu dispositivo via USB e conectar-se ao empacotador através deste túnel para velocidades de transferência muito altas.

Ao tentar se conectar ao servidor de desenvolvimento, você poderá receber uma [tela vermelha com um erro](/docs/debugging.md) dizendo:

> A conexão com `http://localhost:8081/debugger-proxy?role=client` expirou. Você está executando o proxy do nó? Se você estiver executando no dispositivo, verifique se possui o endereço IP correto em `RCTWebSocketExecutor.m`.

Para resolver este problema verifique os seguintes pontos.

#### 1. Rede Wi-Fi.
Certifique-se de que seu laptop e telefone estejam na mesma rede Wi-Fi.

#### 2. Endereço IP
Certifique-se de que o script de construção detectou o endereço IP da sua máquina corretamente (por exemplo, `10.0.1.123`).

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/2a8a10d3-4846-4c5a-8596-b4fcd74b8557)

Abra a aba Report Navigator, selecione o último Build e pesquise IP= seguido de um endereço IP. O endereço IP incorporado no aplicativo deve corresponder ao endereço IP da sua máquina.

## Construindo seu aplicativo para produção
Você construiu um ótimo aplicativo usando React Native e agora está ansioso para lançá-lo na App Store. O processo é igual ao de qualquer outro aplicativo iOS nativo, com algumas considerações adicionais a serem levadas em consideração. Siga o guia de publicação na [Apple App Store](/docs/publishing-to-app-store.md) para saber mais.

