# Usando List View
React Native fornece um conjunto de componentes para apresentar listas de dados. Geralmente, você desejará usar [`FlatList`](/docs/flatlist.md) ou [`SectionList`](/docs/sectionlist.md).

O componente `FlatList` exibe uma lista de rolagem de dados alterados, mas estruturados de forma semelhante. `FlatList` funciona bem para longas listas de dados, onde o número de itens pode mudar com o tempo. Ao contrário do [`ScrollView`](/docs/using-a-scrollview.md) mais genérico, o `FlatList` renderiza apenas os elementos que estão sendo exibidos na tela no momento, e não todos os elementos de uma vez.

O componente `FlatList` requer dois props: `data` e `renderItem`. data é a fonte de informações da lista. `renderItem` pega um item da fonte e retorna um componente formatado para renderizar.

Este exemplo cria uma `FlatList` básica de dados codificados. Cada item nas propriedades de dados é renderizado como um componente `Text`. O componente `FlatListBasics` renderiza `FlatList` e todos os componentes `Text`.

```jsx
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const FlatListBasics = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
          {key: 'Jackson'},
          {key: 'James'},
          {key: 'Joel'},
          {key: 'John'},
          {key: 'Jillian'},
          {key: 'Jimmy'},
          {key: 'Julie'},
        ]}
        renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
};

export default FlatListBasics;
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/a5434413-b939-4552-bc5b-fe0db5ff8cff)

Se você deseja renderizar um conjunto de dados divididos em seções lógicas, talvez com cabeçalhos de seção, semelhante ao `UITableViews` no iOS, então um [`SectionList`](/docs/sectionlist.md) é o caminho a percorrer.

```jsx
import React from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const SectionListBasics = () => {
  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          {title: 'D', data: ['Devin', 'Dan', 'Dominic']},
          {
            title: 'J',
            data: [
              'Jackson',
              'James',
              'Jillian',
              'Jimmy',
              'Joel',
              'John',
              'Julie',
            ],
          },
        ]}
        renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => `basicListEntry-${item}`}
      />
    </View>
  );
};

export default SectionListBasics;
```

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/4a392724-07df-4abd-a397-c64e1ba693d1)

Um dos usos mais comuns de uma exibição de lista é exibir dados que você busca em um servidor. Para fazer isso, você precisará aprender sobre [redes no React Native](/docs/network.md).

