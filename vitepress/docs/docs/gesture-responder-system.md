# Sistema de resposta por gestos
O sistema de resposta por gestos gerencia o ciclo de vida dos gestos no seu aplicativo. Um toque pode passar por diversas fases enquanto o app determina qual é a intenção do usuário. Por exemplo, o aplicativo precisa determinar se o toque está rolando, deslizando em um widget ou tocando. Isso pode até mudar durante um toque. Também pode haver vários toques simultâneos.

O sistema de resposta ao toque é necessário para permitir que os componentes negociem essas interações por toque sem qualquer conhecimento adicional sobre seus componentes pai ou filho.

## Melhores Práticas
Para que seu aplicativo seja ótimo, cada ação deve ter os seguintes atributos:

* Feedback/destaque – mostre ao usuário o que está acontecendo com seu toque e o que acontecerá quando ele liberar o gesto
* Capacidade de cancelamento - ao realizar uma ação, o usuário deve ser capaz de abortá-la no meio do toque, arrastando o dedo para longe

Esses recursos deixam os usuários mais confortáveis ao usar um aplicativo, pois permitem que as pessoas experimentem e interajam sem medo de cometer erros.

## TouchableHighlight and Touchable*
O sistema de resposta pode ser complicado de usar. Portanto, fornecemos uma implementação abstrata `Touchable` para coisas que deveriam ser "tocáveis". Isso usa o sistema de resposta e permite configurar interações de toque de forma declarativa. Use `TouchableHighlight` em qualquer lugar onde você usaria um botão ou link na web.

## Ciclo de vida do Respondente
Uma visualização pode se tornar a resposta ao toque, implementando os métodos de negociação corretos. Existem dois métodos para perguntar à visualização se ela deseja se tornar respondente:

* `View.props.onStartShouldSetResponder: evt => true,` - Esta visualização deseja se tornar respondente no início de um toque?
* `View.props.onMoveShouldSetResponder: evt => true,` - Chamado para cada movimento de toque na Visualização quando não é o respondedor: esta visualização deseja "reivindicar" capacidade de resposta ao toque?

Se a View retornar `true` e tentar se tornar o respondente, uma das seguintes situações acontecerá:

* `View.props.onResponderGrant: evt => {}` - A visualização agora está respondendo a eventos de toque. Este é o momento de destacar e mostrar ao usuário o que está acontecendo
* `View.props.onResponderReject: evt => {}` - Outra coisa está respondendo agora e não irá liberá-la

Se a visualização estiver respondendo, os seguintes manipuladores poderão ser chamados:

* `View.props.onResponderMove: evt => {}` - O usuário está movendo o dedo
* `View.props.onResponderRelease: evt => {}` - Disparado no final do toque, ou seja, "touchUp"
* `View.props.onResponderTerminationRequest: evt => true` - Outra coisa deseja se tornar respondedor. Essa visão deve liberar o respondedor? Retornar verdadeiro permite a liberação
* `View.props.onResponderTerminate: evt => {}` - O respondente foi retirado da Visualização. Pode ser obtido por outras visualizações após uma chamada para `onResponderTerminationRequest` ou pode ser obtido pelo sistema operacional sem perguntar (acontece com o centro de controle/centro de notificação no iOS)

`evt` é um evento de toque sintético com o seguinte formato:

* `nativeEvent`
  * `changeTouches` - Matriz de todos os eventos de toque que foram alterados desde o último evento
  * `identifier` - O ID do toque
  * `locationX` - A posição X do toque, em relação ao elemento
  * `locationY` - A posição Y do toque, em relação ao elemento
  * `pageX` - A posição X do toque, em relação ao elemento raiz
  * `pageY` - A posição Y do toque, em relação ao elemento raiz
  * `target` - O ID do nó do elemento que recebe o evento de toque
  * `timestamp` - Um identificador de tempo para o toque, útil para cálculo de velocidade
  * `touches` - Matriz de todos os toques atuais na tela

### Capturar manipuladores ShouldSet
`onStartShouldSetResponder` e `onMoveShouldSetResponder` são chamados com um padrão de bolha, onde o nó mais profundo é chamado primeiro. Isso significa que o componente mais profundo se tornará respondedor quando múltiplas Views retornarem `true` para manipuladores `*ShouldSetResponder`. Isso é desejável na maioria dos casos, porque garante que todos os controles e botões possam ser usados.

No entanto, às vezes um pai vai querer ter certeza de que ele responderá. Isso pode ser resolvido usando a fase de captura. Antes que o sistema de resposta surja do componente mais profundo, ele fará uma fase de captura, disparando em `*ShouldSetResponderCapture`. Portanto, se uma visualização pai quiser evitar que o filho se torne respondedor em uma inicialização por toque, ela deverá ter um manipulador `onStartShouldSetResponderCapture` que retorne verdadeiro.

* `View.props.onStartShouldSetResponderCapture: evt => true`,
* `View.props.onMoveShouldSetResponderCapture: evt => true`,

## PanResponder
Para interpretação de gestos de nível superior, confira [PanResponder](/docs/panresponder.md).
