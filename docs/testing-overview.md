# Teste
À medida que sua base de código se expande, pequenos erros e casos extremos que você não espera podem se transformar em falhas maiores. Bugs levam a uma experiência ruim do usuário e, em última análise, a perdas de negócios. Uma maneira de evitar uma programação frágil é testar seu código antes de liberá-lo.

Neste guia, abordaremos diferentes maneiras automatizadas de garantir que seu aplicativo funcione conforme o esperado, desde análises estáticas até testes completos.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/89c2d513-bdb7-4127-a783-99ec175a79df)

## Por que testar
Somos humanos e os humanos cometem erros. O teste é importante porque ajuda a descobrir esses erros e verifica se seu código está funcionando. Talvez ainda mais importante, o teste garante que seu código continue funcionando no futuro à medida que você adiciona novos recursos, refatora os existentes ou atualiza dependências importantes do seu projeto.

Há mais valor em testar do que você imagina. Uma das melhores maneiras de corrigir um bug em seu código é escrever um teste com falha que o exponha. Então, quando você corrige o bug e executa novamente o teste, se ele passar, significa que o bug foi corrigido, nunca reintroduzido na base de código.

Os testes também podem servir como documentação para novas pessoas ingressando na sua equipe. Para pessoas que nunca viram uma base de código antes, a leitura de testes pode ajudá-las a entender como funciona o código existente.

Por último, mas não menos importante, testes mais automatizados significam menos tempo gasto com controle de qualidade manual, liberando um tempo valioso.

## Análise Estática
O primeiro passo para melhorar a qualidade do seu código é começar a usar ferramentas de análise estática. A análise estática verifica se há erros em seu código enquanto você o escreve, mas sem executar nenhum código.

* Os linters analisam o código para detectar erros comuns, como código não utilizado, e para ajudar a evitar armadilhas, para sinalizar proibições do guia de estilo, como usar tabulações em vez de espaços (ou vice-versa, dependendo da sua configuração).
* A verificação de tipo garante que a construção que você está passando para uma função corresponde ao que a função foi projetada para aceitar, evitando passar uma string para uma função de contagem que espera um número, por exemplo.

React Native vem com duas dessas ferramentas configuradas imediatamente: [ESLint](https://eslint.org/) para linting e [TypeScript](/docs/typescript.md) para verificação de tipo.

## Escrevendo código testável
Para começar com os testes, primeiro você precisa escrever um código que seja testável. Considere um processo de fabricação de aeronave – antes de qualquer modelo decolar para mostrar que todos os seus sistemas complexos funcionam bem juntos, peças individuais são testadas para garantir que são seguras e funcionam corretamente. Por exemplo, as asas são testadas dobrando-as sob carga extrema; as peças do motor são testadas quanto à sua durabilidade; o pára-brisa é testado contra impacto simulado de pássaros.

O software é semelhante. Em vez de escrever seu programa inteiro em um arquivo enorme com muitas linhas de código, você escreve seu código em vários módulos pequenos que podem ser testados mais detalhadamente do que se você testasse o todo montado. Dessa forma, escrever código testável está interligado com escrever código limpo e modular.

Para tornar seu aplicativo mais testável, comece separando a parte de visualização do seu aplicativo – seus componentes React – da lógica de negócios e do estado do aplicativo (independentemente de você usar Redux, MobX ou outras soluções). Dessa forma, você pode manter seus testes de lógica de negócios – que não devem depender de seus componentes React – independentes dos próprios componentes, cujo trabalho é principalmente renderizar a UI do seu aplicativo!

Teoricamente, você poderia ir tão longe a ponto de remover toda a lógica e a busca de dados de seus componentes. Desta forma, seus componentes seriam exclusivamente dedicados à renderização. Seu estado seria totalmente independente de seus componentes. A lógica do seu aplicativo funcionaria sem nenhum componente React!

> Incentivamos você a explorar ainda mais o tópico de código testável em outros recursos de aprendizagem.

## Escrevendo testes
Depois de escrever o código testável, é hora de escrever alguns testes reais! O modelo padrão do React Native vem com a estrutura de teste [Jest](https://jestjs.io/). Ele inclui uma predefinição adaptada a esse ambiente para que você possa ser produtivo sem ajustar a configuração e as simulações imediatamente. Falaremos mais sobre simulações em breve. Você pode usar o Jest para escrever todos os tipos de testes apresentados neste guia.

Se você faz desenvolvimento orientado a testes, na verdade você escreve os testes primeiro! Dessa forma, é dada a testabilidade do seu código.

### Estruturando Testes
Seus testes devem ser curtos e, idealmente, testar apenas uma coisa. Vamos começar com um exemplo de teste de unidade escrito com Jest:

```js
it('given a date in the past, colorForDueDate() returns red', () => {
  expect(colorForDueDate('2000-10-20')).toBe('red');
});
```

O teste é descrito pela string passada para a função [it](https://jestjs.io/docs/en/api#testname-fn-timeout). Tome muito cuidado ao escrever a descrição para que fique claro o que está sendo testado. Faça o seu melhor para cobrir o seguinte:

* **Dado** - alguma pré-condição
* **Quando** - alguma ação executada pela função que você está testando
* **Então** - o resultado esperado

Isso também é conhecido como AAA (organizar, agir, afirmar (tradução de: Arrange, Act, Assert).

Jest oferece uma função de [descrição/describe](https://jestjs.io/docs/en/api#describename-fn) para ajudar a estruturar seus testes. Use `describe` para agrupar todos os testes que pertencem a uma funcionalidade. As descrições podem ser aninhadas, se você precisar. Outras funções que você normalmente usará são [beforeEach](https://jestjs.io/docs/en/api#beforeeachfn-timeout) ou [beforeAll](https://jestjs.io/docs/en/api#beforeallfn-timeout), que você pode usar para configurar os objetos que está testando. Leia mais na [referência da API Jest](https://jestjs.io/docs/en/api).

Se o seu teste tiver muitas etapas ou muitas expectativas, você provavelmente desejará dividi-lo em várias etapas menores. Além disso, certifique-se de que seus testes sejam completamente independentes um do outro. Cada teste em seu conjunto deve ser executável por si só, sem primeiro executar algum outro teste. Por outro lado, se você executar todos os seus testes juntos, o primeiro teste não deverá influenciar o resultado do segundo.

Por último, como desenvolvedores, gostamos quando nosso código funciona bem e não trava. Com os testes, isso geralmente acontece ao contrário. Pense em um teste reprovado como uma coisa boa! Quando um teste falha, muitas vezes significa que algo não está certo. Isso lhe dá a oportunidade de corrigir o problema antes que ele afete os usuários.

## Testes Unitários
Os testes unitários cobrem as menores partes do código, como funções ou classes individuais.

Quando o objeto que está sendo testado tiver alguma dependência, muitas vezes você precisará "mockar" ela, conforme descrito no próximo parágrafo.

A grande vantagem dos testes unitários é que eles são rápidos de escrever e executar. Portanto, à medida que você trabalha, você obtém feedback rápido sobre se seus testes estão sendo aprovados. Jest ainda tem a opção de executar continuamente testes relacionados ao código que você está editando: [modo Watch](https://jestjs.io/docs/en/cli#watch).

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/15064492-1573-408d-ad0a-9c9264fc16e4)

## Mock
Às vezes, quando seus objetos testados têm dependências externas, você vai querer “mockar eles”. “Mocking” é quando você substitui alguma dependência do seu código pela sua própria implementação.

> Geralmente, usar objetos reais em seus testes é melhor do que usar mocks, mas há situações em que isso não é possível. Por exemplo: quando seu teste de unidade JS depende de um módulo nativo escrito em Java ou Objective-C.

Imagine que você está escrevendo um aplicativo que mostra o clima atual em sua cidade e está usando algum serviço externo ou outra dependência que fornece informações meteorológicas. Se o serviço informar que está chovendo, você deseja mostrar uma imagem com uma nuvem chuvosa. Você não quer chamar esse serviço em seus testes porque:

* Poderia tornar os testes lentos e instáveis (devido às solicitações de rede envolvidas)
* O serviço pode retornar dados diferentes toda vez que você executa o teste
* Serviços de terceiros podem ficar offline quando você realmente precisa executar testes!

Portanto, você pode fornecer uma implementação simulada do serviço, substituindo efetivamente milhares de linhas de código e alguns termômetros conectados à Internet!

> Jest vem com [suporte para simulação](https://jestjs.io/docs/en/mock-functions#mocking-modules) desde o nível de função até a simulação em nível de módulo.

## Testes de Integração
Ao escrever sistemas de software maiores, suas partes individuais precisam interagir umas com as outras. Em testes unitários, se sua unidade depender de outra, às vezes você acabará mockando a dependência, substituindo-a por uma falsa.

Nos testes de integração, unidades individuais reais são combinadas (da mesma forma que no seu aplicativo) e testadas em conjunto para garantir que sua cooperação funcione conforme o esperado. Isso não quer dizer que a simulação não aconteça aqui: você ainda precisará de simulações (por exemplo, para simular a comunicação com um serviço meteorológico), mas precisará muito menos delas do que em testes unitários.

> Observe que a terminologia sobre o que significa teste de integração nem sempre é consistente. Além disso, a linha entre o que é um teste de unidade e o que é um teste de integração pode nem sempre ser clara. Para este guia, seu teste se enquadra em "teste de integração" se:
>
> * Combina vários módulos do seu aplicativo conforme descrito acima
> * Usa um sistema externo
> * Faz uma chamada de rede para outro aplicativo (como a API do serviço meteorológico)
> * Qualquer tipo de E/S de arquivo ou banco de dados

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/438f602b-fc2f-46c9-99f0-1ba874002e2b)

## Testes de Componentes
Os componentes React são responsáveis por renderizar seu aplicativo e os usuários interagirão diretamente com sua saída. Mesmo que a lógica de negócios do seu aplicativo tenha alta cobertura de testes e esteja correta, sem testes de componentes você ainda poderá entregar uma UI quebrada aos seus usuários. Os testes de componentes podem se enquadrar nos testes de unidade e de integração, mas como são uma parte essencial do React Native, iremos abordá-los separadamente.

Para testar os componentes do React, há duas coisas que você pode querer testar:

* Interação: para garantir que o componente se comporte corretamente quando interagido por um usuário (por exemplo, quando o usuário pressiona um botão)
* Renderização: para garantir que a saída de renderização do componente usada pelo React esteja correta (por exemplo, a aparência e o posicionamento do botão na UI)

Por exemplo, se você tiver um botão que possui um ouvinte `onPress`, você deseja testar se o botão aparece corretamente e se o toque no botão é manipulado corretamente pelo componente.

Existem várias bibliotecas que podem ajudá-lo a testá-los:

* O [Test Renderer](https://reactjs.org/docs/test-renderer.html) do React, desenvolvido junto com seu núcleo, fornece um renderizador React que pode ser usado para renderizar componentes React em objetos JavaScript puros, sem depender do DOM ou de um ambiente móvel nativo.
* [A biblioteca de testes React Native](https://callstack.github.io/react-native-testing-library/) é baseada no renderizador de teste do React e adiciona `fireEvent` e APIs de consulta descritas no próximo parágrafo.

> Os testes de componentes são apenas testes de JavaScript executados no ambiente Node.js. Eles não levam em consideração nenhum código iOS, Android ou outro código de plataforma que suporte os componentes React Native. Conclui-se que eles não podem lhe dar 100% de confiança de que tudo funciona para o usuário. Se houver um bug no código do iOS ou Android, eles não o encontrarão.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/2741c954-21ce-442c-b9f6-c8bd7046318a)

## Testando interações do usuário
Além de renderizar algumas UI, seus componentes lidam com eventos como `onChangeText` para `TextInput` ou `onPress` para `Button`. Eles também podem conter outras funções e retornos de chamada de eventos. Considere o seguinte exemplo:

```jsx
function GroceryShoppingList() {
  const [groceryItem, setGroceryItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const addNewItemToShoppingList = useCallback(() => {
    setItems([groceryItem, ...items]);
    setGroceryItem('');
  }, [groceryItem, items]);

  return (
    <>
      <TextInput
        value={groceryItem}
        placeholder="Enter grocery item"
        onChangeText={text => setGroceryItem(text)}
      />
      <Button
        title="Add the item to list"
        onPress={addNewItemToShoppingList}
      />
      {items.map(item => (
        <Text key={item}>{item}</Text>
      ))}
    </>
  );
}
```

Ao testar as interações do usuário, teste o componente da perspectiva do usuário – o que há na página? O que muda quando interagido?

Como regra geral, prefira usar coisas que os usuários possam ver ou ouvir:

* faça afirmações usando texto renderizado ou [auxiliares de acessibilidade](/docs/accessibility.md)

Por outro lado, você deve evitar:

* fazendo afirmações sobre adereços de componentes ou estado
* consultas testID

Evite testar detalhes de implementação como adereços ou estado - embora esses testes funcionem, eles não são orientados para como os usuários irão interagir com o componente e tendem a quebrar por refatoração (por exemplo, quando você deseja renomear algumas coisas ou reescrever um componente de classe usando ganchos ).

> Os componentes da classe React são especialmente propensos a testar detalhes de sua implementação, como estado interno, adereços ou manipuladores de eventos. Para evitar testar detalhes de implementação, prefira usar componentes de função com Hooks, o que torna mais difícil confiar nos componentes internos.

Bibliotecas de teste de componentes, como [React Native Testing Library](https://callstack.github.io/react-native-testing-library/), facilitam a escrita de testes centrados no usuário por meio da escolha cuidadosa das APIs fornecidas. O exemplo a seguir usa os métodos `fireEvent`, `changeText` e `press` que simulam um usuário interagindo com o componente e uma função de consulta `getAllByText` que encontra nós `Text` correspondentes na saída renderizada.

```jsx
test('given empty GroceryShoppingList, user can add an item to it', () => {
  const {getByPlaceholderText, getByText, getAllByText} = render(
    <GroceryShoppingList />,
  );

  fireEvent.changeText(
    getByPlaceholderText('Enter grocery item'),
    'banana',
  );
  fireEvent.press(getByText('Add the item to list'));

  const bananaElements = getAllByText('banana');
  expect(bananaElements).toHaveLength(1); // expect 'banana' to be on the list
});
```

Este exemplo não está testando como alguns estados mudam quando você chama uma função. Ele testa o que acontece quando um usuário altera o texto no `TextInput` e pressiona o `Button`!

### Testando saída renderizada
O [teste instantâneo](https://jestjs.io/docs/en/snapshot-testing) é um tipo avançado de teste habilitado pelo Jest. É uma ferramenta muito poderosa e de baixo nível, por isso é aconselhável atenção redobrada ao utilizá-la.

Um "instantâneo de componente" é uma string semelhante a JSX criada por um serializador React personalizado integrado ao Jest. Este serializador permite que Jest traduza árvores de componentes React em strings legíveis por humanos. Dito de outra forma: um snapshot de componente é uma representação textual da saída de renderização do seu componente _gerada_ durante uma execução de teste. Pode ser assim:

```jsx
<Text
  style={
    Object {
      "fontSize": 20,
      "textAlign": "center",
    }
  }>
  Welcome to React Native!
</Text>
```

Com o teste de instantâneo, normalmente você primeiro implementa seu componente e depois executa o teste de instantâneo. O teste de instantâneo cria um instantâneo e o salva em um arquivo em seu repositório como um instantâneo de referência. O arquivo é então confirmado e verificado durante a revisão do código. Quaisquer alterações futuras na saída de renderização do componente alterarão seu instantâneo, o que fará com que o teste falhe. Em seguida, você precisa atualizar o instantâneo de referência armazenado para que o teste seja aprovado. Essa mudança novamente precisa ser comprometida e revisada.

Os instantâneos têm vários pontos fracos:

* Para você, como desenvolvedor ou revisor, pode ser difícil dizer se uma alteração no snapshot é intencional ou se é evidência de um bug. Instantâneos especialmente grandes podem rapidamente tornar-se difíceis de compreender e o seu valor acrescentado torna-se baixo.
* Quando o instantâneo é criado, nesse ponto ele é considerado correto, mesmo no caso em que a saída renderizada esteja realmente errada.
* Quando um instantâneo falha, é tentador atualizá-lo usando a opção `--updateSnapshot` sem tomar o devido cuidado para investigar se a mudança é esperada. Uma certa dose de disciplina do desenvolvedor é, portanto, necessária.

Os instantâneos em si não garantem que a lógica de renderização do seu componente esteja correta, eles são apenas bons para proteger contra mudanças inesperadas e para verificar se os componentes na árvore React em teste recebem os acessórios esperados (estilos e etc.).

Recomendamos que você use apenas snapshots pequenos (consulte a regra de [não usar snapshots grandes](https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-large-snapshots.md)). Se você quiser testar uma mudança entre dois estados de componentes React, use [snapshot-diff](https://github.com/jest-community/snapshot-diff). Em caso de dúvida, prefira expectativas explícitas conforme descrito no parágrafo anterior.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/dc74b3e5-63ba-4a28-9cd1-8a28882d83ef)

## Testes ponta a ponta
Nos testes ponta a ponta (E2E), você verifica se seu aplicativo está funcionando conforme o esperado em um dispositivo (ou simulador/emulador) da perspectiva do usuário.

Isso é feito criando seu aplicativo na configuração de lançamento e executando os testes nele. Nos testes E2E, você não pensa mais em componentes React, APIs React Native, Redux ou qualquer lógica de negócio. Esse não é o propósito dos testes E2E e eles nem sequer estão acessíveis para você durante os testes E2E.

Em vez disso, as bibliotecas de teste E2E permitem que você encontre e controle elementos na tela do seu aplicativo: por exemplo, você pode tocar em botões ou inserir texto em `TextInputs` da mesma forma que um usuário real faria. Depois, você pode fazer afirmações sobre se um determinado elemento existe ou não na tela do aplicativo, se está visível ou não, que texto ele contém e assim por diante.

Os testes E2E oferecem a maior confiança possível de que parte do seu aplicativo está funcionando. As compensações incluem:

* Escrevê-los consome mais tempo em comparação com outros tipos de testes
* Eles são mais lentos para correr
* Eles são mais propensos a instabilidade (um teste "instável" é um teste que passa aleatoriamente e falha sem qualquer alteração no código)

Tente cobrir as partes vitais do seu aplicativo com testes E2E: fluxo de autenticação, funcionalidades principais, pagamentos, etc. Use testes JS mais rápidos para as partes não vitais do seu aplicativo. Quanto mais testes você adicionar, maior será sua confiança, mas também mais tempo você gastará para mantê-los e executá-los. Considere as vantagens e desvantagens e decida o que é melhor para você.

Existem várias ferramentas de teste E2E disponíveis: na comunidade React Native, Detox é uma estrutura popular porque é adaptada para aplicativos React Native. Outra biblioteca popular no espaço de aplicativos iOS e Android é [Appium](http://appium.io/) ou [Maestro](https://maestro.mobile.dev/).

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/45bb6ac2-cb4b-41bb-88dc-5b86249b333b)

## Resumo
Esperamos que você tenha gostado de ler e aprendido algo com este guia. Há muitas maneiras de testar seus aplicativos. Pode ser difícil decidir o que usar no início. No entanto, acreditamos que tudo fará sentido quando você começar a adicionar testes ao seu incrível aplicativo React Native. Então, o que você está esperando? Aumente sua cobertura!

## Links
* [React testing overview](https://reactjs.org/docs/testing.html)
* [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
* [Jest docs](https://jestjs.io/docs/en/tutorial-react-native)
* [Detox](https://github.com/wix/detox/)
* [Appium](http://appium.io/)
* [Maestro](https://maestro.mobile.dev/)
