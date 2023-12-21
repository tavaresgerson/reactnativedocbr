# Atualização rápida
Fast Refresh é um recurso do React Native que permite obter feedback quase instantâneo sobre alterações em seus componentes React. A atualização rápida está habilitada por padrão e você pode alternar "Enable Fast Refresh" no [menu React Native Dev](/docs/debugging.md). Com a Atualização rápida ativada, a maioria das edições deve ficar visível em um ou dois segundos.

## Como funciona
* Se você editar um módulo que exporta apenas componentes React, o Fast Refresh atualizará o código apenas para esse módulo e renderizará novamente seu componente. Você pode editar qualquer coisa nesse arquivo, incluindo estilos, lógica de renderização, manipuladores de eventos ou efeitos.
* Se você editar um módulo com exportações que não sejam componentes do React, o Fast Refresh executará novamente esse módulo e os outros módulos que o importam. Portanto, se `Button.js` e `Modal.js` importarem `Theme.js`, a edição de `Theme.js` atualizará ambos os componentes.
* Finalmente, se você editar um arquivo importado por módulos fora da árvore React, o Fast Refresh voltará a fazer uma recarga completa. Você pode ter um arquivo que renderiza um componente React, mas também exporta um valor que é importado por um componente não React. Por exemplo, talvez seu componente também exporte uma constante e um módulo utilitário não React a importe. Nesse caso, considere migrar a constante para um arquivo separado e importá-la para ambos os arquivos. Isso reativará o funcionamento do Fast Refresh. Outros casos geralmente podem ser resolvidos de maneira semelhante.

## Resiliência a erros
Se você cometer um erro de sintaxe durante uma sessão de atualização rápida, poderá corrigi-lo e salvar o arquivo novamente. A caixa vermelha desaparecerá. Módulos com erros de sintaxe são impedidos de serem executados, portanto você não precisará recarregar o aplicativo.

Se você cometer um erro de tempo de execução durante a inicialização do módulo (por exemplo, digitando `Style.create` em vez de `StyleSheet.create`), a sessão de atualização rápida continuará depois que o erro for corrigido. A caixa vermelha desaparecerá e o módulo será atualizado.

Se você cometer um erro que leve a um erro de tempo de execução dentro do seu componente, a sessão de atualização rápida também continuará após a correção do erro. Nesse caso, o React remontará seu aplicativo usando o código atualizado.

Se você tiver [limites de erro](https://reactjs.org/docs/error-boundaries.html) em seu aplicativo (o que é uma boa ideia para falhas normais na produção), eles tentarão renderizar novamente na próxima edição após uma caixa vermelha. Nesse sentido, ter um limite de erro pode impedir que você seja sempre expulso da tela raiz do aplicativo. No entanto, lembre-se de que os limites de erro não devem ser muito granulares. Eles são usados pelo React em produção e devem sempre ser projetados intencionalmente.

## Limitações
O Fast Refresh tenta preservar o estado React local no componente que você está editando, mas somente se for seguro fazê-lo. Aqui estão alguns motivos pelos quais você pode ver o estado local sendo redefinido a cada edição de um arquivo:

* O estado local não é preservado para componentes de classe (apenas componentes de função e Hooks preservam o estado).
* O módulo que você está editando pode ter outras exportações além de um componente React.
* Às vezes, um módulo exportaria o resultado da chamada de um componente de ordem superior como `createNavigationContainer(MyScreen)`. Se o componente retornado for uma classe, o estado será redefinido.

No longo prazo, à medida que mais da sua base de código se move para componentes de função e ganchos, você pode esperar que o estado seja preservado em mais casos.

## Dicas
* A atualização rápida preserva o estado local do React nos componentes de função (e hooks) por padrão.
* Às vezes, você pode querer forçar a redefinição do estado e a remontagem de um componente. Por exemplo, isso pode ser útil se você estiver ajustando uma animação que só acontece na montagem. Para fazer isso, você pode adicionar `// @refresh reset` em qualquer lugar do arquivo que está editando. Esta diretiva é local para o arquivo e instrui o Fast Refresh a remontar os componentes definidos nesse arquivo em cada edição.

## Atualização rápida e ganchos
Quando possível, a Atualização Rápida tenta preservar o estado do seu componente entre as edições. Em particular, useState e useRef preservam seus valores anteriores, desde que você não altere seus argumentos ou a ordem das chamadas do Hook.

Ganchos com dependências — como `useEffect`, `useMemo` e `useCallback` — sempre serão atualizados durante o Fast Refresh. Sua lista de dependências será ignorada enquanto a atualização rápida estiver acontecendo.

Por exemplo, quando você edita `useMemo(() => x * 2, [x])` para `useMemo(() => x * 10, [x])`, ele será executado novamente mesmo que `x` (a dependência) não tenha mudado. Se o React não fizesse isso, sua edição não seria refletida na tela!

Às vezes, isso pode levar a resultados inesperados. Por exemplo, mesmo um `useEffect` com uma matriz vazia de dependências ainda seria executado novamente uma vez durante a Atualização Rápida. No entanto, escrever código resiliente a uma nova execução ocasional de `useEffect` é uma boa prática, mesmo sem o Fast Refresh. Isso torna mais fácil para você introduzir posteriormente novas dependências nele.
