# Otimizando a configuração da Flatlist

## Termos

* **VirtualizedList**: O componente por trás do `FlatList` (implementação do conceito de [Lista Virtual](https://bvaughn.github.io/react-virtualized/#/components/List) do React Native).
* **Consumo de memória**: quanta informação sobre sua lista está armazenada na memória, o que pode causar falha no aplicativo.
* **Capacidade de resposta**: capacidade do aplicativo de responder às interações. A baixa capacidade de resposta, por exemplo, ocorre quando você toca em um componente e ele espera um pouco para responder, em vez de responder imediatamente conforme o esperado.
* **Áreas em branco**: quando `VirtualizedList` não consegue renderizar seus itens com rapidez suficiente, você pode inserir uma parte de sua lista com componentes não renderizados que aparecem como espaço em branco.
* **Viewport**: a área visível do conteúdo que é renderizada em pixels.
* **Window**: A área na qual os itens devem ser montados, que geralmente é muito maior que a janela de visualização.

## Props
Aqui está uma lista de acessórios que podem ajudar a melhorar o desempenho do `FlatList`:

### removeClippedSubviews

| TIPO     | PADRÃO    |
|----------|-----------|
| Boolean  | False     |

Se for `true`, as visualizações que estão fora da viewport serão desanexadas da hierarquia de visualizações nativas.

**Prós**: Isso reduz o tempo gasto no thread principal e, portanto, reduz o risco de perda de quadros, excluindo visualizações fora da janela de visualização da renderização nativa e das travessias de desenho.

**Contras**: Esteja ciente de que esta implementação pode ter bugs, como conteúdo ausente (observado principalmente no iOS), especialmente se você estiver fazendo coisas complexas com transformações e/ou posicionamento absoluto. Observe também que isso não economiza memória significativa porque as visualizações não são desalocadas, apenas desanexadas.

### maxToRenderPerBatch

| TIPO     | PADRÃO    |
|----------|-----------|
| Number   | 10        |

É um suporte `VirtualizedList` que pode ser passado por `FlatList`. Isso controla a quantidade de itens renderizados por lote, que é o próximo pedaço de itens renderizados em cada pergaminho.

**Prós**: Definir um número maior significa menos áreas em branco visuais durante a rolagem (aumenta a taxa de preenchimento).

**Contras**: mais itens por lote significam períodos mais longos de execução de JavaScript, potencialmente bloqueando o processamento de outros eventos, como clicks, prejudicando a capacidade de resposta.

### updateCellsBatchingPeriod

| TIPO     | PADRÃO    |
|----------|-----------|
| Number   | 50        |

Enquanto `maxToRenderPerBatch` informa a quantidade de itens renderizados por lote, a configuração `updateCellsBatchingPeriod` informa ao `VirtualizedList` o atraso em milissegundos entre as renderizações em lote (com que frequência seu componente renderizará os itens em janela).

**Prós**: combinar esta propriedade com `maxToRenderPerBatch` dá a você o poder de, por exemplo, renderizar mais itens em um lote menos frequente ou menos itens em um lote mais frequente.

**Contras**: Lotes menos frequentes podem causar áreas em branco. Lotes mais frequentes podem causar problemas de capacidade de resposta.

### initialNumToRender

| TIPO     | PADRÃO    |
|----------|-----------|
| Number   | 10        |

A quantidade inicial de itens a serem renderizados.

**Prós**: Defina o número preciso de itens que cobririam a tela de cada dispositivo. Isso pode ser um grande aumento de desempenho para a renderização inicial.

**Contras**: Definir um `initialNumToRender` baixo pode causar áreas em branco, especialmente se for muito pequeno para cobrir a janela de visualização na renderização inicial.

### windowSize

| TIPO     | PADRÃO    |
|----------|-----------|
| Number   | 21        |

O número passado aqui é uma unidade de medida onde 1 é equivalente à altura da sua janela de visualização. O valor padrão é 21 (10 viewports acima, 10 abaixo e uma intermediária).

**Prós**: `windowSize` maior resultará em menos chance de ver espaços em branco durante a rolagem. Por outro lado, `windowSize` menor resultará em menos itens montados simultaneamente, economizando memória.

**Contras**: Para um tamanho de janela maior, você terá mais consumo de memória. Para um tamanho de janela menor, você terá uma chance maior de ver áreas em branco.

## Lista de itens
Abaixo estão algumas dicas sobre os componentes dos itens da lista. Eles são o núcleo da sua lista, por isso precisam ser rápidos.

### Use componentes básicos
Quanto mais complexos forem seus componentes, mais lento eles serão renderizados. Tente evitar muita lógica e aninhamento nos itens da sua lista. Se você reutiliza muito esse componente de item de lista em seu aplicativo, crie um componente apenas para suas listas grandes e faça-as com o mínimo de lógica e aninhamento possível.

### Use componentes leves
Quanto mais pesados forem seus componentes, mais lento eles serão renderizados. Evite imagens pesadas (use uma versão recortada ou miniatura para os itens da lista, o menor possível). Converse com sua equipe de design, use o mínimo possível de efeitos, interações e informações em sua lista. Mostre-os nos detalhes do seu item.

### Usar shouldComponentUpdate
Implemente a verificação de atualização em seus componentes. O `PureComponent` do React implementa um [shouldComponentUpdate](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) com comparação superficial. Isso é caro aqui porque precisa verificar todos os seus props. Se você deseja um bom desempenho em nível de bits, crie as regras mais rígidas para os componentes dos itens da lista, verificando apenas os props que podem mudar. Se sua lista for básica o suficiente, você pode até usar

```js
shouldComponentUpdate() {
  return false
}
```

### Use imagens otimizadas em cache
Você pode usar os pacotes da comunidade (como [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image) de [@DylanVann](https://github.com/DylanVann)) para obter imagens com melhor desempenho. Cada imagem na sua lista é uma nova instância de `Image()`. Quanto mais rápido ele atingir o gancho carregado, mais rápido seu thread JavaScript ficará livre novamente.

### Use getItemLayout
Se todos os componentes do item da sua lista tiverem a mesma altura (ou largura, para uma lista horizontal), fornecer a propriedade [`getItemLayout`](/docs/flatlist.md#getitemlayout) elimina a necessidade de sua FlatList gerenciar cálculos de layout assíncronos. Esta é uma técnica de otimização muito desejável.

Se seus componentes têm tamanho dinâmico e você realmente precisa de desempenho, pergunte à sua equipe de design se eles podem pensar em um redesenho para ter um melhor desempenho.

### Use keyExtractor ou key
Você pode definir o [keyExtractor](/docs/flatlist.md#keyextractor) para o seu componente `FlatList`. Este suporte é usado para armazenamento em cache e como chave React para rastrear a reordenação de itens.

Você também pode usar um prop `key` em seu componente de item.

### Evite função anônima em renderItem
Para componentes funcionais, mova a função `renderItem` para fora do JSX retornado. Além disso, certifique-se de que ele esteja encapsulado em um gancho `useCallback` para evitar que seja recriado a cada renderização.

Para componentes de classe, mova a função `renderItem` para fora da função de renderização, para que ela não se recrie cada vez que a função de renderização for chamada.

```jsx
const renderItem = useCallback(({item}) => (
   <View key={item.key}>
      <Text>{item.title}</Text>
   </View>
 ), []);

return (
  // ...

  <FlatList data={items} renderItem={renderItem} />;
  // ...
);
```
