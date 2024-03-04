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

## Unit Tests
