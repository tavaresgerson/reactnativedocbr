# Linux (Android)

## 1. Habilite a depuração via USB

A maioria dos dispositivos Android só pode instalar e executar aplicativos baixados do Google Play, por padrão. Você precisará habilitar a depuração USB em seu dispositivo para instalar seu aplicativo durante o desenvolvimento.

Para ativar a depuração USB no seu dispositivo, primeiro você precisa ativar o menu "Opções do desenvolvedor" acessando **Settings → About phone → Software information** e tocando na linha `Build number` na parte inferior sete vezes. Você pode então voltar para **Settings → Developer options** para ativar a "**USB debugging**".

## 2. Conecte seu dispositivo via USB

Vamos agora configurar um dispositivo Android para executar nossos projetos React Native. Vá em frente e conecte seu dispositivo via USB à sua máquina de desenvolvimento.

Em seguida, verifique o código do fabricante usando `lsusb` (no Mac, você deve primeiro [instalar o `lsusb`](https://github.com/jlhonora/lsusb)). `lsusb` deve gerar algo assim:

```bash
$ lsusb
Bus 002 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 003: ID 22b8:2e76 Motorola PCS
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

Estas linhas representam os dispositivos USB atualmente conectados à sua máquina.

Você quer a linha que representa o seu telefone. Em caso de dúvida, tente desconectar o telefone e executar o comando novamente:

```bash
$ lsusb
Bus 002 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 002 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

Você verá que após retirar o telefone, a linha que contém o modelo do telefone (“Motorola PCS” neste caso) desapareceu da lista. Esta é a linha com a qual nos preocupamos.

```bash
Bus 001 Device 003: ID 22b8:2e76 Motorola PCS
```

Na linha acima, você deve obter os primeiros quatro dígitos do ID do dispositivo:

```bash
22b8:2e76
```
Neste caso, é `22b8`. Esse é o identificador da Motorola.

Você precisará inserir isso nas regras do udev para começar a trabalhar:

```bash
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="22b8", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android-usb.rules
```

Certifique-se de substituir `22b8` pelo identificador obtido no comando acima.

Agora verifique se o seu dispositivo está conectado corretamente ao ADB, o Android Debug Bridge, executando `adb devices`.

```bash
$ adb devices
List of devices attached
emulator-5554 offline   # Google emulator
14ed2fcc device         # Dispositivo físico
```

Ver o `device` na coluna da direita significa que o dispositivo está conectado. Você deve ter apenas um dispositivo conectado por vez.

## 3. Execute seu aplicativo

Na raiz do seu projeto, digite o seguinte no prompt de comando para instalar e iniciar seu aplicativo no dispositivo:

::: code-group
```bash [npm]
npm run android
```
```bash [yarn]
yarn android
```
:::

::: tip DICA
Você também pode usar o `React Native CLI` para gerar e executar uma `release` (por exemplo, da raiz do seu projeto: `yarn android --mode release`).
:::

## Conectando-se ao servidor de desenvolvimento
Você também pode iterar rapidamente em um dispositivo conectando-se ao servidor de desenvolvimento em execução na sua máquina de desenvolvimento. Existem várias maneiras de fazer isso, dependendo se você tem acesso a um cabo USB ou a uma rede Wi-Fi.

### Método 1: usando adb reverse (recomendado)

Você pode usar este método se o seu dispositivo estiver executando o Android 5.0 (Lollipop) ou mais recente, tiver a depuração USB ativada e estiver conectado via USB à sua máquina de desenvolvimento.

Execute o seguinte em um prompt de comando:

```bash
adb -s <device name> reverse tcp:8081 tcp:8081
```

Para encontrar o nome do dispositivo, execute o seguinte comando adb:

```bash
adb devices
```

Agora você pode ativar o recarregamento ao vivo no [Dev Menu](/docs/debugging.md). Seu aplicativo será recarregado sempre que seu código JavaScript for alterado.

### Método 2: conectar via Wi-Fi

Você também pode se conectar ao servidor de desenvolvimento por Wi-Fi. Primeiro, você precisará instalar o aplicativo em seu dispositivo usando um cabo USB, mas depois de fazer isso, você poderá depurar sem fio seguindo estas instruções. Você precisará do endereço IP atual da sua máquina de desenvolvimento antes de continuar.

Abra um terminal e digite `/sbin/ifconfig` para encontrar o endereço IP da sua máquina.

1. Certifique-se de que seu laptop e telefone estejam na mesma rede Wi-Fi.
2. Abra seu aplicativo React Native em seu dispositivo.
3. Você verá uma [tela vermelha com um erro](/docs/debugging.md). Tudo bem. As etapas a seguir corrigirão isso.
4. Abra o menu de [desenvolvimento do aplicativo](/docs/debugging.md).
5. Vá para **Dev Settings → Debug server host & port for device**.
6. Digite o endereço IP da sua máquina e a porta do servidor de desenvolvimento local (por exemplo, `10.0.1.1:8081`).
6. Volte ao **Dev Menu** e selecione **Reload JS**.

Agora você pode ativar o recarregamento ao vivo no [Dev Menu](/docs/debugging.md). Seu aplicativo será recarregado sempre que seu código JavaScript for alterado.

## Construindo seu aplicativo para produção

Você construiu um ótimo aplicativo usando React Native e agora está ansioso para lançá-lo na Play Store. O processo é igual ao de qualquer outro aplicativo Android nativo, com algumas considerações adicionais a serem levadas em consideração. Siga o [guia para gerar um APK assinado](/docs/signed-apk-android.md) para saber mais.
