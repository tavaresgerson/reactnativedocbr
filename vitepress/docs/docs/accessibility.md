# Acessibilidade

Tanto o Android quanto o iOS fornecem APIs para integração de aplicativos com tecnologias assistivas, como os leitores de tela incluídos VoiceOver (iOS) e TalkBack (Android). React Native possui APIs complementares que permitem que seu aplicativo acomode todos os usuários.

> **INFORMAÇÕES**
> Android e iOS diferem ligeiramente em suas abordagens e, portanto, as implementações do React Native podem variar de acordo com a plataforma.

## Propriedades de acessibilidade

### accessible
Quando verdadeiro, indica que a visualização é um elemento de acessibilidade. Quando uma visualização é um elemento de acessibilidade, ela agrupa seus filhos em um único componente selecionável. Por padrão, todos os elementos tocáveis estão acessíveis.

No Android, a propriedade `access={true}` para uma visualização react-native será traduzida em `focusable={true}` nativo.

```tsx
<View accessible={true}>
  <Text>texto um</Text>
  <Text>texto dois</Text>
</View>
```

No exemplo acima, o foco de acessibilidade está disponível apenas na visualização pai com a propriedade acessível, e não individualmente para 'texto um' e 'texto dois'.

### accessibilityLabel
Quando uma visualização é marcada como acessível, é uma boa prática definir um `accessibilityLabel` na visualização, para que as pessoas que usam o VoiceOver ou o TalkBack saibam qual elemento selecionaram. Um leitor de tela verbalizará esta string quando o elemento associado for selecionado.

Para usar, defina a propriedade `accessibilityLabel` como uma string personalizada em sua `View`, `Text` ou `Touchable`:

```tsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Tap me!"
  onPress={onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>Press me!</Text>
  </View>
</TouchableOpacity>
```

No exemplo acima, o `accessLabel` no elemento `TouchableOpacity` seria padronizado como `"Press me!"`. O rótulo é construído concatenando todos os filhos do nó `Text` separados por espaços.

### accessibilityLabelledBy [Android]

Uma referência a outro elemento [nativeID](/docs/view.md) usado para criar formulários complexos. O valor de `acessibilidadeLabelledBy` deve corresponder ao nativeID do elemento relacionado:

```jsx
<View>
  <Text nativeID="formLabel">Label for Input Field</Text>
  <TextInput
    accessibilityLabel="input"
    accessibilityLabelledBy="formLabel"
  />
</View>
```

No exemplo acima, o leitor de tela anuncia `Input, Edit Box for Label for Input Field` ao focar no TextInput.

### accessibilityHint

Uma dica de acessibilidade pode ser usada para fornecer contexto adicional ao usuário sobre o resultado da ação quando isso não estiver claro apenas no rótulo de acessibilidade.

Forneça à propriedade `acessibilidadeHint` uma string personalizada em sua View, Text ou Touchable:

```jsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Go back"
  accessibilityHint="Navigates to the previous screen"
  onPress={onPress}>
  <View style={styles.button}>
    <Text style={styles.buttonText}>Back</Text>
  </View>
</TouchableOpacity>
```

#### iOS
No exemplo acima, o VoiceOver lerá a dica após o rótulo, se o usuário tiver as dicas habilitadas nas configurações do VoiceOver do dispositivo. Leia mais sobre as diretrizes para `acessibilidadeHint` nos [documentos do desenvolvedor iOS](https://developer.apple.com/documentation/objectivec/nsobject/1615093-accessibilityhint)

#### Android
No exemplo acima, o TalkBack lerá a dica após o rótulo. No momento, as dicas não podem ser desativadas no Android.

### accessibilityLanguage [iOS]

Ao usar a propriedade `accessibilityLanguage`, o leitor de tela entenderá qual idioma usar ao ler o `label`, o `value` e o `hint`. O valor da string fornecido deve seguir a [especificação BCP 47](https://www.rfc-editor.org/info/bcp47).

```tsx
<View
  accessible={true}
  accessibilityLabel="Pizza"
  accessibilityLanguage="it-IT">
  <Text>🍕</Text>
</View>
```

### acessibilidadeIgnoresInvertColors [iOS]
A inversão das cores da tela é um recurso de acessibilidade disponível no iOS e iPadOS para pessoas com daltonismo, baixa visão ou deficiência visual. Se houver uma visualização que você não deseja inverter quando esta configuração estiver ativada, possivelmente uma foto, defina esta propriedade como verdadeira.

### accessibilityLiveRegion [Android]
Quando os componentes mudam dinamicamente, queremos que o TalkBack alerte o usuário final. Isso é possível graças à propriedade `accessibilityLiveRegion`. Pode ser definido como `none`, `polite` e `assertive`:

* `none` Os serviços de acessibilidade não devem anunciar alterações nesta visão.
* `polite` serviços de acessibilidade educados devem anunciar mudanças nesta visão.
* `assertive` Os serviços de acessibilidade devem interromper o discurso em curso para anunciar imediatamente alterações nesta visão.

```tsx
<TouchableWithoutFeedback onPress={addOne}>
  <View style={styles.embedded}>
    <Text>Click me</Text>
  </View>
</TouchableWithoutFeedback>
<Text accessibilityLiveRegion="polite">
  Clicked {count} times
</Text>
```

No exemplo acima, o método `addOne` altera a contagem (`count`} da variável de estado. Quando `TouchableWithoutFeedback` é acionado, o TalkBack lê o texto na visualização Texto devido à sua propriedade `accessibilityLiveRegion="polite"`.

### accessibilityRole
`accessibilityRole` comunica a finalidade de um componente ao usuário de tecnologia assistiva.

`accessibilityRole` pode ser um dos seguintes:

* **adjustable** Usado quando um elemento pode ser "ajustado" (por exemplo, um controle deslizante).
* **alert** Usado quando um elemento contém texto importante a ser apresentado ao usuário.
* **button** Usado quando o elemento deve ser tratado como um botão.
* **checkbox** Usado quando um elemento representa uma caixa de seleção que pode ser marcada, desmarcada ou ter um estado misto de marcado.
* **combobox** Usado quando um elemento representa uma caixa de combinação, que permite ao usuário selecionar entre diversas opções.
* **header** Usado quando um elemento atua como cabeçalho para uma seção de conteúdo (por exemplo, o título de uma barra de navegação).
* **image** Usado quando o elemento deve ser tratado como uma imagem. Pode ser combinado com um botão ou link.
* **imagebutton** Utilizado quando o elemento deve ser tratado como um botão e também é uma imagem.
* **keyboardkey** Usado quando o elemento atua como uma tecla do teclado.
* **link** Usado quando o elemento deve ser tratado como um link.
* **menu** Usado quando o componente é um menu de opções.
* **menubar** Usada quando um componente é um contêiner de vários menus.
* **menuitem** Usado para representar um item dentro de um menu.
* **none** Usado quando o elemento não tem função.
* **progressbar** Usado para representar um componente que indica o progresso de uma tarefa.
* **radio** Usado para representar um botão de opção.
* **radiogroup** Usado para representar um grupo de botões de opção.
* **scrollbar** Usada para representar uma barra de rolagem.
* **search** Usado quando um elemento de campo de texto também deve ser tratado como um campo de pesquisa.
* **spinbutton** Usado para representar um botão que abre uma lista de opções.
* **summary** Usado quando um elemento pode ser usado para fornecer um resumo rápido das condições atuais no aplicativo quando ele é iniciado pela primeira vez.
* **switch** Usado para representar um switch que pode ser ligado e desligado.
* **tab** Usado para representar uma guia.
* **tablist** Usado para representar uma lista de guias.
* **text** Usado quando o elemento deve ser tratado como texto estático que não pode ser alterado.
* **timer** Usado para representar um timer.
* **togglebutton** Usado para representar um botão de alternância. Deve ser usado com acessibilidadeState marcado para indicar se o botão está ativado ou desativado.
* **toolbar** Usada para representar uma barra de ferramentas (um contêiner de botões de ação ou componentes).
* **grid** Usado com ScrollView, VirtualizedList, FlatList ou SectionList para representar uma grade. Adiciona anúncios de entrada/saída da grade ao GridView do Android.

### accessibilityState
Descreve o estado atual de um componente para o usuário de tecnologia assistiva.

acessibilidadeState é um objeto. Ele contém os seguintes campos:

| NOME        | DESCRIÇÃO          | TIPO                      | OBRIGATÓRIO    |
|-------------|--------------------|---------------------------|----------------|
| disabled    | Indica se o elemento está desabilitado ou não.  | `boolean` | Não |
| selected    | Indica se um elemento selecionável está selecionado ou não.  | `boolean` | Não |
| checked     | Indica o estado de um elemento verificável. Este campo pode receber uma string booleana ou "mista" para representar caixas de seleção mistas.  | `boolean` ou 'mixed' | Não |
| busy        | Indica se um elemento está ocupado ou não.  | `boolean` |  Não |
| expanded    | Indica se um elemento expansível está atualmente expandido ou recolhido.  | `boolean` | Não |

Para usar, defina `accessibilityState` como um objeto com uma definição específica.

### accessibilityValue
Representa o valor atual de um componente. Pode ser uma descrição textual do valor de um componente ou, para componentes baseados em intervalo, como controles deslizantes e barras de progresso, contém informações de intervalo (mínimo, atual e máximo).

`accessibilityValue` é um objeto. Ele contém os seguintes campos:

| NOME   | DESCRIÇÃO                                      | TIPO              | NECESSÁRIO  |
|--------|------------------------------------------------|-------------------|-------------|
| min    | O valor mínimo do intervalo deste componente.  | `integer`         | Obrigatório se `now` estiver definido.  |
| max    | O valor máximo do intervalo deste componente.  | `integer`         | Obrigatório se `now` estiver definido.  |
| now    | O valor atual do intervalo deste componente.   | `integer`         | Não |
| text   | Uma descrição textual do valor deste componente. Substituirá `min`, `now` e `max` se definido. | `integer` | Não |

### accessibilityViewIsModal [iOS]
Um valor booleano que indica se o VoiceOver deve ignorar os elementos nas visualizações que são irmãos do receptor.

Por exemplo, em uma janela que contém visualizações irmãs `A` e `B`, definir `accessibilityViewIsModal` como `true` na visualização `B` faz com que o VoiceOver ignore os elementos na visualização `A`. Por outro lado, se a visualização `B` contiver uma visualização filha `C` e você definir `accessibilityViewIsModal` como `true` na visualização `C`, o VoiceOver não ignora os elementos da visualização `A`.

### accessibilityElementsHidden [iOS]
Um valor booleano que indica se os elementos de acessibilidade contidos neste elemento de acessibilidade estão ocultos.

Por exemplo, em uma janela que contém visualizações irmãs `A` e `B`, definir `accessibilityElementsHidden` como verdadeiro na visualização `B` faz com que o VoiceOver ignore os elementos na visualização B. Isso é semelhante à propriedade Android `importantForAccessibility="no-hide-descendants"`.

### aria-valuemax
Representa o valor máximo para componentes baseados em intervalo, como controles deslizantes e barras de progresso.

### aria-valuemin
Representa o valor mínimo para componentes baseados em intervalo, como controles deslizantes e barras de progresso.

### aria-valuenow
Representa o valor atual para componentes baseados em intervalo, como controles deslizantes e barras de progresso.

### aria-valuetext
Representa a descrição textual do componente.

### aria-busy
Indica que um elemento está sendo modificado e que as tecnologias assistivas podem querer esperar até que as alterações sejam concluídas antes de informar o usuário sobre a atualização.

| TIPO     |	PADRÃO |
|----------|---------|
| boolean	 | `false` |


### aria-checked
Indica o estado de um elemento verificável. Este campo pode receber uma string booleana ou "mista" para representar caixas de seleção mistas.

| TIPO             | PADRÃO   |
|------------------|----------|
| boolean, 'mixed' |	`false` |

### aria-disabled
Indica que o elemento é perceptível, mas desabilitado, portanto não é editável ou operável de outra forma.

| TIPO     |	PADRÃO |
|----------|---------|
| boolean	 | `false` |

### aria-expanded
Indica se um elemento expansível está atualmente expandido ou recolhido.

| TIPO     |	PADRÃO |
|----------|---------|
| boolean	 | `false` |

### aria-hidden
Indica se os elementos de acessibilidade contidos neste elemento de acessibilidade estão ocultos.

Por exemplo, numa janela que contém vistas irmãs `A` e `B`, definir aria-hidden como verdadeiro na vista `B` faz com que o VoiceOver ignore os elementos na vista `B`.

| TIPO     |	PADRÃO |
|----------|---------|
| boolean	 | `false` |

### aria-label
Define um valor de string que rotula um elemento interativo.

| TIPO     |
|----------|
| string	 |

### aria-labelledby [Android]
Identifica o elemento que rotula o elemento ao qual é aplicado. O valor de aria-labelledby deve corresponder ao [nativeID](/docs/view#nativeid) do elemento relacionado:

```jsx
<View>
  <Text nativeID="formLabel">Label for Input Field</Text>
  <TextInput aria-label="input" aria-labelledby="formLabel" />
</View>
```
| TIPO     |
|----------|
| string	 |

### aria-live [Android]
Indica que um elemento será atualizado e descreve os tipos de atualizações que os agentes de usuário, as tecnologias assistivas e o usuário podem esperar da região ativa.

* **off** Os serviços de acessibilidade não devem anunciar alterações nesta visualização.
* **polite** Os serviços de acessibilidade devem anunciar alterações nesta visão.
* **assertive** Os serviços de acessibilidade devem interromper o discurso em curso para anunciar imediatamente alterações nesta visão.

| TIPO                                   |	PADRÃO |
|----------------------------------------|---------|
| `enum('assertive', 'off', 'polite')`	 | `'off'` |

### aria-modal [iOS]
Valor booleano que indica se o VoiceOver deve ignorar os elementos nas visualizações que são irmãos do receptor.

| TIPO     |	PADRÃO |
|----------|---------|
| boolean	 | `false` |

### aria-selected
Indica se um elemento selecionável está selecionado ou não.

| TIPO     |
|----------|
| boolean	 |

### importantForAccessibility [Android]
No caso de dois componentes de UI sobrepostos com o mesmo pai, o foco de acessibilidade padrão pode ter um comportamento imprevisível. A propriedade `importantForAccessibility` resolverá isso controlando se uma visualização dispara eventos de acessibilidade e se é reportada aos serviços de acessibilidade. Pode ser definido como `auto`, `yes`, `no` e `no-hide-descendants` (o último valor forçará os serviços de acessibilidade a ignorar o componente e todos os seus filhos).

```jsx
<View style={styles.container}>
  <View
    style={[styles.layout, {backgroundColor: 'green'}]}
    importantForAccessibility="yes">
    <Text>First layout</Text>
  </View>
  <View
    style={[styles.layout, {backgroundColor: 'yellow'}]}
    importantForAccessibility="no-hide-descendants">
    <Text>Second layout</Text>
  </View>
</View>
```

No exemplo acima, o layout `yellow` e seus descendentes são completamente invisíveis para o TalkBack e todos os outros serviços de acessibilidade. Assim, podemos usar visualizações sobrepostas com o mesmo pai sem confundir o TalkBack.

### onAccessibilityEscape [iOS]
Atribua esta propriedade a uma função personalizada que será chamada quando alguém realizar o gesto de "escape", que é um gesto em forma de Z com dois dedos. Uma função de escape deve voltar hierarquicamente na interface do usuário. Isso pode significar subir ou voltar em uma hierarquia de navegação ou descartar uma interface de usuário modal. Se o elemento selecionado não tiver uma função `onAccessibilityEscape`, o sistema tentará percorrer a hierarquia de visualizações até encontrar uma visualização que tenha ou piscar para indicar que não foi possível encontrar uma.

### onAccessibilityTap
Use esta propriedade para atribuir uma função personalizada a ser chamada quando alguém ativar um elemento acessível tocando duas vezes nele enquanto estiver selecionado.

### onMagicTap [iOS]
Atribua esta propriedade a uma função personalizada que será chamada quando alguém realizar o gesto de "toque mágico", que é um toque duplo com dois dedos. Uma função de toque mágico deve executar a ação mais relevante que um usuário pode realizar em um componente. No aplicativo Telefone do iPhone, um toque mágico atende uma chamada ou encerra a atual. Se o elemento selecionado não tiver uma função onMagicTap, o sistema percorrerá a hierarquia de visualizações até encontrar uma visualização que tenha.

### role
`role` comunica a finalidade de um componente e tem precedência sobre a propriedade [accessRole](#accessibilityrole).

a função pode ser uma das seguintes:

* **alert** Usado quando um elemento contém texto importante a ser apresentado ao usuário.
* **button** Usado quando o elemento deve ser tratado como um botão.
* **checkbox** Usado quando um elemento representa uma caixa de seleção que pode ser marcada, desmarcada ou ter um estado misto de marcado.
* **combobox** Usado quando um elemento representa uma caixa de combinação, que permite ao usuário selecionar entre diversas opções.
* **grid** Usado com `ScrollView`, `VirtualizedList`, `FlatList` ou `SectionList` para representar uma grade. Adiciona os anúncios de entrada/saída da grade ao `GridView` do Android.
*  **heading** Usado quando um elemento atua como cabeçalho para uma seção de conteúdo (por exemplo, o título de uma barra de navegação).
* **img** Usado quando o elemento deve ser tratado como uma imagem. Pode ser combinado com um botão ou link, por exemplo.
* **link** Usado quando o elemento deve ser tratado como um link.
* **list** Usado para identificar uma lista de itens.
* **menu** Usado quando o componente é um menu de opções.
* **menubar** Usada quando um componente é um contêiner de vários menus.
* **menuitem** Usado para representar um item dentro de um menu.
* **none** Usado quando o elemento não tem função.
* **presentation** Usado quando o elemento não tem função.
* **progressbar** Usado para representar um componente que indica o progresso de uma tarefa.
* **radio** Usado para representar um botão de opção.
* **radiogroup** Usado para representar um grupo de botões de opção.
* **scrollbar** Usada para representar uma barra de rolagem.
* **searchbox** Usado quando o elemento do campo de texto também deve ser tratado como um campo de pesquisa.
* **slider** Usado quando um elemento pode ser "ajustado" (por exemplo, um controle deslizante).
* **spinbutton** Usado para representar um botão que abre uma lista de opções.
* **summary** Usado quando um elemento pode ser usado para fornecer um resumo rápido das condições atuais no aplicativo quando ele é iniciado pela primeira vez.
* **switch** Usado para representar um switch que pode ser ligado e desligado.
* **tab** Usado para representar uma guia.
* **tablist** Usado para representar uma lista de guias.
* **timer** Usado para representar um timer.
* **toolbar** Usada para representar uma barra de ferramentas (um contêiner de botões de ação ou componentes).

## Ações de acessibilidade

As ações de acessibilidade permitem que a tecnologia assistiva invoque programaticamente a(s) ação(ões) de um componente. Para apoiar ações de acessibilidade, um componente deve fazer duas coisas:

* Defina a lista de ações suportadas por meio da propriedade `accessibilityActions`.
* Implemente uma função `onAccessibilityAction` para lidar com solicitações de ação.

A propriedade `accessibilityActions` deve conter uma lista de objetos de ação. Cada objeto de ação deve conter os seguintes campos:


| NOME     |	TIPO   | OBRIGATÓRIO  |
|----------|---------|--------------|
| name	   | `string`| Sim          |
| label    | `string`| Não          |

As ações representam ações padrão, como clicar em um botão ou ajustar um controle deslizante, ou ações personalizadas específicas de um determinado componente, como excluir uma mensagem de email. O campo `name` é obrigatório para ações padrão e personalizadas, mas o `label` é opcional para ações padrão.

Ao adicionar suporte para ações padrão, o `name` deve ser um dos seguintes:

* `'magicTap'` - apenas iOS - Enquanto o foco do VoiceOver está no componente ou dentro dele, o usuário toca duas vezes com dois dedos.
* `'escape'` - apenas iOS - Enquanto o foco do VoiceOver está no componente ou dentro dele, o usuário executou um gesto de esfregar com dois dedos (esquerda, direita, esquerda).
* `'activate'` - Ativa o componente. Este deve realizar a mesma ação com ou sem tecnologia assistiva. Ativado quando um usuário de leitor de tela toca duas vezes no componente.
* `'increment'` - Incrementa um componente ajustável. No iOS, o VoiceOver gera essa ação quando o componente tem a função de ‘ajustável’ e o usuário coloca o foco nele e desliza para cima. No Android, o TalkBack gera essa ação quando o usuário coloca o foco de acessibilidade no componente e pressiona o botão de aumentar volume.
* `'decrement'` - Diminui um componente ajustável. No iOS, o VoiceOver gera essa ação quando o componente tem a função de ‘ajustável’ e o usuário coloca o foco nele e desliza para baixo. No Android, o TalkBack gera essa ação quando o usuário coloca o foco de acessibilidade no componente e pressiona o botão de diminuir volume.
* `'longpress'` - somente Android - Esta ação é gerada quando o usuário coloca o foco de acessibilidade no componente, depois dá um toque duplo e mantém um dedo na tela. Este deve realizar a mesma ação com ou sem tecnologia assistiva.

O campo `label` é opcional para ações padrão e muitas vezes não é utilizado por tecnologias assistivas. Para ações customizadas, é uma string localizada contendo uma descrição da ação a ser apresentada ao usuário.

Para lidar com solicitações de ação, um componente deve implementar uma função `onAccessibilityAction`. O único argumento para esta função é um evento contendo o nome da ação a ser executada. O exemplo abaixo do RNTester mostra como criar um componente que define e trata diversas ações customizadas.

```jsx
<View
  accessible={true}
  accessibilityActions={[
    {name: 'cut', label: 'cut'},
    {name: 'copy', label: 'copy'},
    {name: 'paste', label: 'paste'},
  ]}
  onAccessibilityAction={event => {
    switch (event.nativeEvent.actionName) {
      case 'cut':
        Alert.alert('Alert', 'cut action success');
        break;
      case 'copy':
        Alert.alert('Alert', 'copy action success');
        break;
      case 'paste':
        Alert.alert('Alert', 'paste action success');
        break;
    }
  }}
/>
```

## Verificando se um leitor de tela está ativado
A API `AccessibilityInfo` permite determinar se um leitor de tela está ativo ou não. Consulte a documentação do [`AccessibilityInfo`](https://reactnative.dev/docs/0.72/accessibilityinfo) para obter detalhes.

## Envio de eventos de acessibilidade Android [Android]
Às vezes é útil acionar um evento de acessibilidade em um componente de UI (ou seja, quando uma visualização personalizada aparece em uma tela ou define o foco de acessibilidade para uma visualização). O módulo UIManager nativo expõe um método 'sendAccessibilityEvent' para esta finalidade. São necessários dois argumentos: uma tag de visualização e um tipo de evento. Os tipos de eventos suportados são `typeWindowStateChanged`, `typeViewFocused` e `typeViewClicked`.

```jsx
import {Platform, UIManager, findNodeHandle} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.sendAccessibilityEvent(
    findNodeHandle(this),
    UIManager.AccessibilityEventTypes.typeViewFocused,
  );
}
```

## Testando o suporte do TalkBack [Android]
Para ativar o TalkBack, acesse o aplicativo Configurações em seu dispositivo ou emulador Android. Toque em Acessibilidade e depois em TalkBack. Alterne a opção "Usar serviço" para ativá-lo ou desativá-lo.

Os emuladores Android não têm o TalkBack instalado por padrão. Você pode instalar o TalkBack no seu emulador através da Google Play Store. Certifique-se de escolher um emulador com a Google Play Store instalada. Eles estão disponíveis no Android Studio.

Você pode usar o atalho da tecla de volume para alternar o TalkBack. Para ativar o atalho da tecla de volume, vá para o aplicativo Configurações e, em seguida, Acessibilidade. Na parte superior, ative o atalho da tecla de volume.

Para usar o atalho da tecla de volume, pressione ambas as teclas de volume por 3 segundos para iniciar uma ferramenta de acessibilidade.

Além disso, se preferir, você pode alternar o TalkBack por meio da linha de comando com:

```
# desabilitado
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService

# habilitado
adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
```

## Testando o suporte do VoiceOver [iOS]
Para ativar o VoiceOver em seu dispositivo iOS ou iPadOS, acesse o aplicativo Ajustes, toque em Geral e em Acessibilidade. Lá você encontrará muitas ferramentas disponíveis para as pessoas permitirem que seus dispositivos sejam mais utilizáveis, incluindo VoiceOver. Para ativar o VoiceOver, toque em VoiceOver em “Visão” e alterne o botão que aparece na parte superior.

Na parte inferior das configurações de acessibilidade, há um “Atalho de acessibilidade”. Você pode usar isso para alternar o VoiceOver clicando três vezes no botão Início.

O VoiceOver não está disponível por meio do simulador, mas você pode usar o Accessibility Inspector do Xcode para usar o macOS VoiceOver por meio de um aplicativo. Observe que é sempre melhor testar com um dispositivo, pois o VoiceOver do macOS pode resultar em experiências variadas.

## Recursos adicionais
* [Tornando aplicativos React Native acessíveis](https://engineering.fb.com/ios/making-react-native-apps-accessible/)
