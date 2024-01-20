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
