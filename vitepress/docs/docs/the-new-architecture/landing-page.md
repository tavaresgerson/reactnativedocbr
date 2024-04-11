# Sobre a Nova Arquitetura

::: info Informações
Se você está procurando os guias da Nova Arquitetura, eles foram transferidos para o [grupo de trabalho](https://github.com/reactwg/react-native-new-architecture#guides).
:::

Desde 2018, a equipe do React Native vem redesenhando os principais componentes internos do React Native para permitir que os desenvolvedores criem experiências de maior qualidade. Em 2024, esta versão do React Native foi comprovada em escala e potencializa aplicativos de produção da Meta.

O termo _Nova Arquitetura_ refere-se tanto à nova arquitetura de framework quanto ao trabalho para trazê-la para o código aberto.

A nova arquitetura está disponível para aceitação experimental a partir do [React Native 0.68](/blog/2022/03/30/version-068#opting-in-to-the-new-architecture) com melhorias contínuas em cada liberação. A equipe agora está trabalhando para tornar esta a experiência padrão para o ecossistema de código aberto React Native.

## Por que uma nova arquitetura?

Depois de muitos anos construindo com React Native, a equipe identificou um conjunto de limitações que impediam os desenvolvedores de criar certas experiências com alto nível de polimento. Essas limitações foram fundamentais para o design existente do framework, então a Nova Arquitetura começou como um investimento no futuro do React Native.

A Nova Arquitetura desbloqueia capacidades e melhorias que eram impossíveis na arquitetura legada.

### Layout e efeitos síncronos

Construir experiências de UI adaptáveis ​​geralmente requer medir o tamanho e a posição de suas visualizações e ajustar o layout.

Hoje, você usaria o evento [`onLayout`](/docs/view#onlayout) para obter as informações de layout de uma visualização e fazer quaisquer ajustes. No entanto, as atualizações de estado dentro do retorno de chamada `onLayout` podem ser aplicadas após pintar a renderização anterior. Isso significa que os usuários podem ver estados intermediários ou saltos visuais entre a renderização do layout inicial e a resposta às medições do layout.

Com a Nova Arquitetura, podemos evitar totalmente esse problema com acesso síncrono às informações de layout e atualizações devidamente programadas, de modo que nenhum estado intermediário fique visível para os usuários.

## Exemplo: renderizando uma dica de ferramenta

Medir e colocar uma dica de ferramenta acima de uma visualização nos permite mostrar o que a renderização síncrona desbloqueia. A dica de ferramenta precisa saber a posição de sua visualização de destino para determinar onde ela deve ser renderizada.

Na arquitetura atual, usamos `onLayout` para obter as medidas da visualização e então atualizar o posicionamento da dica de ferramenta com base em onde a visualização está.

```jsx
function ViewWithTooltip() {
  // ...
  // Pegamos as informações do layout e passamos para o ToolTip se posicionar
  const onLayout = React.useCallback(event => {
    targetRef.current?.measureInWindow((x, y, width, height) => {
      // Não é garantido que esta atualização de estado seja executada no mesmo commit
      // Isso resulta em um "salto" visual conforme a dica de ferramenta se reposiciona
      setTargetRect({x, y, width, height});
    });
  }, []);

  return (
    <>
      <View ref={targetRef} onLayout={onLayout}>
        <Text>Some content that renders a tooltip above</Text>
      </View>
      <Tooltip targetRect={targetRect} />
    </>
  );
}
```

Com a Nova Arquitetura, podemos usar [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect) para medir e aplicar atualizações de layout de forma síncrona em um único commit, evitando o "salto" visual.

```jsx
function ViewWithTooltip() {
  // ...

  useLayoutEffect(() => {
    // A medição e atualização de estado para `targetRect` acontece em um único commit
    // permitindo que o ToolTip se posicione sem pinturas intermediárias
    targetRef.current?.measureInWindow((x, y, width, height) => {
      setTargetRect({x, y, width, height});
    });
  }, [setTargetRect]);

  return (
    <>
      <View ref={targetRef}>
        <Text>Some content that renders a tooltip above</Text>
      </View>
      <Tooltip targetRect={targetRect} />
    </>
  );
}
```

<div className="two-images">
  <figure>
    <img
      src="/docs/assets/async-on-layout.gif"
      class="rounded-shadow"
      alt="Uma visualização que se move para os cantos da viewport e para o centro com uma dica de ferramenta renderizada acima ou abaixo dela. A dica de ferramenta é renderizada após um pequeno atraso após a visualização se mover"
      />
    <figcaption>
      Medição e renderização assíncrona da dica de ferramenta.
    </figcaption>
  </figure>
  <figure>
    <img
      src="/docs/assets/sync-use-layout-effect.gif"
      class="rounded-shadow"
      alt="Uma visualização que está se movendo para os cantos da janela de visualização e centralizada com uma dica de ferramenta renderizada acima ou abaixo dela. A visualização e a dica se movem em uníssono."
    />
    <figcaption>
      Medição síncrona e renderização da dica de ferramenta.
    </figcaption>
  </figure>
</div>

### Suporte para renderização e recursos simultâneos

A nova arquitetura suporta renderização simultânea e recursos fornecidos no [React 18](https://react.dev/blog/2022/03/29/react-v18) e além. Agora você pode usar recursos como Suspense para busca de dados, Transições e outras novas APIs React em seu código React Native, adaptando ainda mais as bases de código e os conceitos entre o desenvolvimento web e React nativo.

O renderizador simultâneo também traz melhorias prontas para uso, como lote automático, que reduz novas renderizações no React.

Com a nova arquitetura, você obterá lotes automáticos com o renderizador React 18.

Neste exemplo, um controle deslizante especifica quantos blocos serão renderizados. Arrastar o controle deslizante de 0 a 1000 iniciará uma rápida sucessão de atualizações de estado e novas renderizações.

Ao comparar os renderizadores para o [mesmo código](https://gist.github.com/lunaleaps/79bb6f263404b12ba57db78e5f6f28b2), você pode notar visualmente que o renderizador fornece uma UI mais suave, com menos atualizações intermediárias da UI. As atualizações de estado de manipuladores de eventos nativos, como este componente Slider nativo, agora são agrupadas em lote.

<div className="two-images">
  <figure>
    <img
      src="/docs/assets/legacy-renderer.gif"
      class="rounded-shadow"
      alt="Uma visualização que se move para os cantos da viewport e para o centro com uma dica de ferramenta renderizada acima ou abaixo dela. A dica de ferramenta é renderizada após um pequeno atraso após a visualização se mover"
      />
    <figcaption>
      Renderizando atualizações de estado frequentes com renderizador legado.
    </figcaption>
  </figure>
  <figure>
    <img
      src="/docs/assets/react18-renderer.gif"
      class="rounded-shadow"
      alt="Uma visualização que está se movendo para os cantos da janela de visualização e centralizada com uma dica de ferramenta renderizada acima ou abaixo dela. A visualização e a dica se movem em uníssono."
    />
    <figcaption>
      Renderizando atualizações de estado frequentes com o renderizador React 18.
    </figcaption>
  </figure>
</div>


Novos recursos simultâneos, como [Transições](https://react.dev/reference/react/useTransition), permitem expressar a prioridade das atualizações da IU. Marcar uma atualização como de prioridade mais baixa informa ao React que ele pode "interromper" a renderização da atualização para lidar com atualizações de prioridade mais alta para garantir uma experiência de usuário responsiva onde for importante.

## Exemplo: Usando `startTransition`

Podemos aproveitar o exemplo anterior para mostrar como as transições podem interromper a renderização em andamento para lidar com uma atualização de estado mais recente.

Envolvemos a atualização do estado do número do bloco com `startTransition` para indicar que a renderização dos blocos pode ser interrompida. `startTransition` também fornece um sinalizador `isPending` para nos informar quando a transição for concluída.

```jsx
function TileSlider({value, onValueChange}) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <View>
        <Text>
          Render {value} Tiles
        </Text>
        <ActivityIndicator animating={isPending} />
      </View>
      <Slider
        value={1}
        minimumValue={1}
        maximumValue={1000}
        step={1}
        onValueChange={newValue => {
          startTransition(() => {
            onValueChange(newValue);
          });
        }}
      />
    </>
  );
}

function ManyTiles() {
  const [value, setValue] = useState(1);
  const tiles = generateTileViews(value);
  return (
      <TileSlider onValueChange={setValue} value={value} />
      <View>
        {tiles}
      </View>
  )
}
```

Você notará que com as atualizações frequentes em uma transição, o React renderiza menos estados intermediários porque ele deixa de renderizar o estado assim que ele se torna obsoleto. Em comparação, sem transições, mais estados intermediários são renderizados. Ambos os exemplos ainda usam lote automático. Ainda assim, as transições dão ainda mais poder aos desenvolvedores para agrupar renderizações em andamento.

<div className="two-images">
  <figure>
    <img
      src="/docs/assets/with-transitions.gif"
      class="rounded-shadow"
      />
    <figcaption>
      Renderização de blocos com transições para interromper renderizações em andamento de estado obsoleto.
    </figcaption>
  </figure>
  <figure>
    <img
      src="/docs/assets/without-transitions.gif"
      class="rounded-shadow"
    />
    <figcaption>
      Renderizar blocos sem marcá-los como transição.
    </figcaption>
  </figure>
</div>

### JavaScript rápido/interface nativa

A Nova Arquitetura remove a [ponte assíncrona](https://reactnative.dev/blog/2018/06/14/state-of-react-native-2018#architecture) entre JavaScript e nativo e a substitui pela Interface JavaScript (JSI). JSI é uma interface que permite ao JavaScript manter uma referência a um objeto C++ e vice-versa. Com uma referência de memória, você pode invocar métodos diretamente sem custos de serialização.

JSI permite que [VisionCamera](https://github.com/mrousavy/react-native-vision-camera), uma biblioteca de câmeras popular para React Native, processe quadros em tempo real. Os buffers de quadros típicos têm 10 MB, o que equivale a aproximadamente 1 GB de dados por segundo, dependendo da taxa de quadros. Em comparação com os custos de serialização da ponte, o JSI lida com essa quantidade de dados de interface com facilidade. JSI pode expor outros tipos complexos baseados em instâncias, como bancos de dados, imagens, amostras de áudio, etc.

A adoção de JSI na Nova Arquitetura remove essa classe de trabalho de serialização de toda interoperabilidade JavaScript nativa. Isso inclui inicializar e renderizar novamente os componentes principais nativos, como `View` e `Text`. Você pode ler mais sobre nossa [investigação em desempenho de renderização](https://github.com/reactwg/react-native-new-architecture/discussions/123) na Nova Arquitetura e nos benchmarks aprimorados que medimos.

### Saber mais

Para conseguir isso, a Nova Arquitetura teve que refatorar várias partes da infraestrutura React Native. Para saber mais sobre o refatorador e outros benefícios que ele traz, confira a [documentação](https://github.com/reactwg/react-native-new-architecture) no grupo de trabalho Nova Arquitetura.

## O que posso esperar ao ativar a Nova Arquitetura?

Embora a Nova Arquitetura habilite esses recursos e melhorias, habilitar a Nova Arquitetura para seu aplicativo ou biblioteca pode não melhorar imediatamente o desempenho ou a experiência do usuário.

Por exemplo, seu código pode precisar de refatoração para aproveitar novos recursos, como efeitos de layout síncronos ou recursos simultâneos. Embora o JSI minimize a sobrecarga entre o JavaScript e a memória nativa, a serialização de dados pode não ter sido um gargalo para o desempenho do seu aplicativo.

Habilitar a Nova Arquitetura em seu aplicativo ou biblioteca é optar pelo futuro do React Native.

A equipe está pesquisando e desenvolvendo ativamente novos recursos que a Nova Arquitetura desbloqueia. Por exemplo, o alinhamento da web é uma área ativa de exploração na Meta que será enviada para o ecossistema de código aberto React Native.

- [Atualizações no modelo de loop de eventos](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0744-well-defined-event-loop.md)
- [APIs de nós e layout](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0607-dom-traversal-and-layout-apis.md)
- [Conformidade de estilo e layout](https://github.com/facebook/yoga/releases/tag/v2.0.0)

Você pode acompanhar e contribuir em nosso repositório dedicado [discussões e propostas](https://github.com/react-native-community/discussions-and-proposals/discussions/651).

## Devo usar a Nova Arquitetura hoje?

Hoje, a Nova Arquitetura é considerada experimental e continuamos a refinar a compatibilidade com versões anteriores para uma melhor experiência de adoção.

A equipe planeja habilitar a Nova Arquitetura por padrão em uma próxima versão do React Native até o final de 2024.

Nossa orientação é a seguinte

- Para a maioria dos aplicativos de produção, _não_ recomendamos ativar a Nova Arquitetura hoje. Esperar pelo lançamento oficial oferecerá a melhor experiência.
- Se você mantém uma biblioteca React Native, recomendamos habilitá-la e verificar se seus casos de uso estão cobertos. Você pode encontrar as [instruções aqui](https://github.com/reactwg/react-native-new-architecture#guides).

### Habilite a nova arquitetura

Se você estiver interessado em usar a experiência da Nova Arquitetura como dogfood, você pode encontrar [instruções](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/enable-apps.md) em nosso grupo de trabalho dedicado. O [grupo de trabalho da Nova Arquitetura](https://github.com/reactwg/react-native-new-architecture) é um espaço dedicado para suporte e coordenação para a adoção da Nova Arquitetura e onde a equipe publica atualizações regulares.
