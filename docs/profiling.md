# Perfil
Use o criador de perfil integrado para obter informações detalhadas sobre o trabalho realizado no thread JavaScript e no thread principal lado a lado. Acesse-o selecionando "Perf Monitor" no menu Debug.

Para iOS, Instruments é uma ferramenta inestimável, e no Android você deve aprender a usar o `systrace`.

Mas primeiro, certifique-se de que o [Modo de Desenvolvimento esteja DESLIGADO!](/docs/performance.md) Você deverá ver `__DEV__ === false`, o aviso em nível de desenvolvimento está DESATIVADO e as otimizações de desempenho estão ATIVADAS nos logs do seu aplicativo.

Outra maneira de criar o perfil do JavaScript é usar o criador de perfil do Chrome durante a depuração. Isso não fornecerá resultados precisos, pois o código está sendo executado no Chrome, mas fornecerá uma ideia geral de onde podem estar os gargalos. Execute o criador de perfil na guia `Desempenho` do Chrome. Um gráfico em degradê aparecerá em `User Timing`. Para ver mais detalhes em formato tabular, clique na guia `Bottom Up` abaixo e selecione `DedicatedWorker Thread` no menu superior esquerdo.

## Criação de perfil de desempenho da interface do Android com `systrace`
O Android suporta mais de 10 mil telefones diferentes e é generalizado para suportar renderização de software: a arquitetura da estrutura e a necessidade de generalizar para muitos alvos de hardware, infelizmente significam que você recebe menos de graça, em relação ao iOS. Mas às vezes há coisas que você pode melhorar - e muitas vezes não é culpa do código nativo!

O primeiro passo para depurar essa instabilidade é responder à questão fundamental de onde seu tempo está sendo gasto durante cada quadro de 16 ms. Para isso, usaremos uma ferramenta padrão de criação de perfil do Android chamada `systrace`.

`systrace` é uma ferramenta de criação de perfil padrão baseada em marcadores do Android (e é instalada quando você instala o pacote de ferramentas da plataforma Android). Os blocos de código perfilados são cercados por marcadores de início/fim que são visualizados em um formato de gráfico colorido. Tanto o Android SDK quanto a estrutura React Native fornecem marcadores padrão que você pode visualizar.

### 1. Coletando um rastro
Primeiro, conecte um dispositivo que exiba as telas que você deseja investigar ao seu computador via USB e leve-o ao ponto logo antes da navegação/animação que você deseja criar o perfil. Execute o systrace da seguinte maneira:

```
$ <path_to_android_sdk>/platform-tools/systrace/systrace.py --time=10 -o trace.html sched gfx view -a <your_package_name>
```

Uma análise rápida deste comando:

* `time` é o período de tempo que o rastreamento será coletado em segundos
* `sched`, `gfx` e `view` são as tags Android SDK (coleções de marcadores) com as quais nos preocupamos: `sched` fornece informações sobre o que está sendo executado em cada núcleo do seu telefone, `gfx` fornece informações gráficas, como limites de quadros, e `view` fornece informações sobre medir, fazer o layout e desenhar passes
* `-a <your_package_name>` habilita marcadores específicos do aplicativo, especificamente aqueles integrados à estrutura React Native. `your_package_name` pode ser encontrado no `AndroidManifest.xml` do seu aplicativo e se parece com `com.example.app`

Assim que o rastreamento começar a ser coletado, execute a animação ou interação de seu interesse. No final do rastreamento, o systrace fornecerá um link para o rastreamento que você pode abrir em seu navegador.

### 2. Lendo o rastreamento
Depois de abrir o rastreamento em seu navegador (de preferência Chrome), você deverá ver algo assim:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/c59779f3-75ba-44fc-8ed5-fa8792f7aefd)

> **DICA**
> Use as teclas WASD para guiar e ampliar.

Se o arquivo `.html` de rastreamento não estiver abrindo corretamente, verifique o seguinte no console do navegador:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/dde28dd2-2315-43b5-8443-ca0a94978153)

Como `Object.observe` foi descontinuado em navegadores recentes, pode ser necessário abrir o arquivo na ferramenta de rastreamento do Google Chrome. Você pode fazer isso:

* Aba de abertura no chrome `chrome://tracing`
* Selecionando _load_
* Selecionando o arquivo html gerado a partir do comando anterior.

> **ATIVAR HIGHLIGHT VSYNC**
> Marque esta caixa de seleção no canto superior direito da tela para destacar os limites do quadro de 16ms:
> ![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/53bd7a9c-5ebb-4aca-b743-e19695e634a4)
> 
> Você deverá ver listras de zebra como na imagem acima. Caso contrário, tente criar um perfil em um dispositivo diferente: sabe-se que a Samsung tem problemas para exibir vsyncs, enquanto a série Nexus é geralmente bastante confiável.

### 3. Encontre o seu processo
Role até ver (parte do) nome do seu pacote. Nesse caso, eu estava criando o perfil de `com.facebook.adsmanager`, que aparece como `book.adsmanager` por causa de limites bobos de nomes de threads no kernel.

No lado esquerdo, você verá um conjunto de tópicos que correspondem às linhas da linha do tempo à direita. Existem alguns threads com os quais nos preocupamos para nossos propósitos: o thread de UI (que tem o nome do seu pacote ou o nome Thread de UI), `mqt_js` e `mqt_native_modules`. Se você estiver executando o Android 5+, também nos preocupamos com o Render Thread.

* **UI Thread**. É aqui que acontece a medida/layout/desenho padrão do Android. O nome do tópico à direita será o nome do seu pacote (no meu caso `book.adsmanager`) ou UI Thread. Os eventos que você vê neste tópico devem ser parecidos com isto e têm a ver com `Choreographer`, `traversals` e `DispatchUI`:
![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/c5c57f20-09fb-4304-8a27-2775569d21ab)
* **JS Thread**. É aqui que o JavaScript é executado. O nome do thread será `mqt_js` ou `<...>` dependendo de quão cooperativo o kernel do seu dispositivo está sendo. Para identificá-lo caso não tenha nome, procure coisas como `JSCall`, `Bridge.executeJSCall`, etc:
![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/5d1d1ce4-ed3a-4894-beba-dece57d3d5c0)

* **Native Modules Thread**. É aqui que as chamadas do módulo nativo (por exemplo, o `UIManager`) são executadas. O nome do encadeamento será `mqt_native_modules` ou `<...>`. Para identificá-lo neste último caso, procure coisas como `NativeCall`, `callJavaModuleMethod` e `onBatchComplete`:
![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/9d69035c-4c44-47d1-a99d-ec70156c53bd)

* **Bônus: Thread Render**. Se estiver usando Android L (5.0) e superior, você também terá uma thread de renderização em seu aplicativo. Esta thread gera os comandos OpenGL reais usados para desenhar sua UI. O nome do thread será `RenderThread` ou `<...>`. Para identificá-lo neste último caso, procure coisas como `DrawFrame` e `queueBuffer`:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/49854aec-66d4-4d36-ba0b-98e22e87a1c7)

## Identificando um culpado

Uma animação suave deve ser semelhante a esta:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/3b060561-91b8-4ee2-b650-fdf4d9eb3439)

Cada mudança de cor é um quadro – lembre-se que para exibir um quadro, todo o nosso trabalho de UI precisa ser feito até o final desse período de 16 ms. Observe que nenhuma thread está funcionando próximo ao limite do quadro. Uma renderização de aplicativo como essa é renderizada a 60 FPS.

Se você notou um corte, no entanto, poderá ver algo assim:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/ec22d738-44a8-4e35-9c77-ff76e9761c75)

Observe que o thread JS está em execução quase o tempo todo e além dos limites do quadro! Este aplicativo não está renderizando a 60 FPS. Neste caso, o problema está em JS.

Você também pode ver algo assim:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/132ef545-fe19-47fc-aa63-02ab501bc1fa)

Nesse caso, a interface do usuário e as threads de renderização são os que têm trabalho cruzando os limites do quadro. A UI que estamos tentando renderizar em cada quadro está exigindo muito trabalho. Nesse caso, o problema está na renderização das visualizações nativas.

Neste ponto, você terá algumas informações muito úteis para orientar suas próximas etapas.

## Resolvendo problemas de JavaScript
Se você identificou um problema de JS, procure pistas no JS específico que está executando. No cenário acima, vemos `RCTEventEmitter` sendo chamado várias vezes por quadro. Aqui está um zoom do thread JS do rastreamento acima:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/b631ef2b-c72c-4b27-8547-74caf0daca9b)

Isso não parece certo. Por que está sendo chamado com tanta frequência? São realmente eventos diferentes? As respostas a essas perguntas provavelmente dependerão do código do seu produto. E muitas vezes, você vai querer dar uma olhada em `shouldComponentUpdate`.

## Resolvendo problemas de UI nativa
Se você identificou um problema de UI nativa, geralmente há dois cenários:

* a IU que você está tentando desenhar cada quadro envolve muito trabalho na GPU ou
* Você está construindo uma nova UI durante a animação/interação (por exemplo, carregando um novo conteúdo durante uma rolagem).

### Muito trabalho de GPU
No primeiro cenário, você verá um trace que tem o thread de UI e/ou Thread de Renderização parecido com este:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/a7ee7f32-8d5f-4c6b-8c07-1f3667fd7fff)

Observe a longa quantidade de tempo gasto no `DrawFrame` que ultrapassa os limites do quadro. Este é o tempo gasto esperando que a GPU drene seu buffer de comando do quadro anterior.

Para mitigar isso, você deve:

* investigue usando `renderToHardwareTextureAndroid` para conteúdo estático e complexo que está sendo animado/transformado (por exemplo, animações de slide/alfa do Navigator)
* certifique-se de não usar o `NeedOffscreenAlphaCompositing`, que está desabilitado por padrão, pois aumenta muito a carga por quadro na GPU na maioria dos casos.

### Criando novas visualizações no thread da UI
No segundo cenário, você verá algo mais parecido com isto:

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/5a5de2c9-82f0-4ce2-a603-945d19006da6)

Observe que primeiro o thread JS pensa um pouco, depois você vê algum trabalho realizado no thread de módulos nativos, seguido por uma travessia cara no thread de UI.

Não há uma maneira rápida de atenuar isso, a menos que você consiga adiar a criação de uma nova IU até depois da interação ou simplifique a IU que está criando. A equipe do React Native está trabalhando em uma solução de nível de infraestrutura para isso que permitirá que novas UI sejam criadas e configuradas fora do thread principal, permitindo que a interação continue sem problemas.
