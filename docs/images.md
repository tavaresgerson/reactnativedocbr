# Imagens

## Recursos de imagem estática
React Native fornece uma maneira unificada de gerenciar imagens e outros ativos de mídia em seus aplicativos Android e iOS. Para adicionar uma imagem estática ao seu aplicativo, coloque-a em algum lugar da árvore do código-fonte e referencie-a assim:

```jsx
<Image source={require('./my-icon.png')} />
```

O nome da imagem é resolvido da mesma forma que os módulos JS são resolvidos. No exemplo acima, o bundler procurará `my-icon.png` na mesma pasta do componente que o requer.

Você pode usar os sufixos `@2x` e `@3x` para fornecer imagens para diferentes densidades de tela. Se você tiver a seguinte estrutura de arquivos:

```
.
├── button.js
└── img
    ├── check.png
    ├── check@2x.png
    └── check@3x.png
```

...e o código `button.js` contém:

```jsx
<Image source={require('./img/check.png')} />
```

...o empacotador agrupará e exibirá a imagem correspondente à densidade da tela do dispositivo. Por exemplo, `check@2x.png` será usado em um iPhone 7, enquanto `check@3x.png` será usado em um iPhone 7 Plus ou Nexus 5. Se não houver imagem que corresponda à densidade da tela, a melhor opção mais próxima será ser selecionado.

No Windows, talvez seja necessário reiniciar o empacotador se você adicionar novas imagens ao seu projeto.

Aqui estão alguns benefícios que você obtém:

1. Mesmo sistema em Android e iOS.
2. As imagens ficam na mesma pasta do seu código JavaScript. Os componentes são independentes.
3. Nenhum namespace global, ou seja, você não precisa se preocupar com colisões de nomes.
4. Somente as imagens realmente usadas serão empacotadas em seu aplicativo.
5. Adicionar e alterar imagens não requer recompilação do aplicativo, você pode atualizar o simulador normalmente.
6. O empacotador conhece as dimensões da imagem, não há necessidade de duplicá-la no código.
7. As imagens podem ser distribuídas por meio de pacotes [npm](https://www.npmjs.com/).

Para que isso funcione, o nome da imagem em `require` deve ser conhecido estaticamente.

```
// BOM
<Image source={require('./my-icon.png')} />;

// RUIM
const icon = this.props.active
  ? 'my-icon-active'
  : 'my-icon-inactive';
<Image source={require('./' + icon + '.png')} />;

// BOM
const icon = this.props.active
  ? require('./my-icon-active.png')
  : require('./my-icon-inactive.png');
<Image source={icon} />;
```

Observe que as fontes de imagem exigidas desta forma incluem informações de tamanho (largura, altura) da imagem. Se você precisar dimensionar a imagem dinamicamente (ou seja, via flex), pode ser necessário definir manualmente `{width: undefined, height: undefined}` no atributo de estilo.

## Recursos estáticos sem imagem
A sintaxe `require` descrita acima também pode ser usada para incluir estaticamente arquivos de áudio, vídeo ou documentos em seu projeto. Os tipos de arquivo mais comuns são suportados, incluindo `.mp3`, `.wav`, `.mp4`, `.mov`, `.html` e `.pdf`. Consulte os [padrões do bundler](https://github.com/facebook/metro/blob/master/packages/metro-config/src/defaults/defaults.js#L14-L44) para obter a lista completa.

Você pode adicionar suporte para outros tipos adicionando uma [opção de resolvedor assetsExts](https://metrobundler.dev/docs/configuration#resolver-options) em sua configuração Metro.

Uma ressalva é que os vídeos devem usar posicionamento absoluto em vez de `flexGrow`, uma vez que as informações de tamanho não são transmitidas atualmente para ativos que não sejam de imagem. Essa limitação não ocorre para vídeos vinculados diretamente ao Xcode ou à pasta Assets para Android.

## Imagens dos recursos do aplicativo híbrido
Se você estiver construindo um aplicativo híbrido (algumas UIs no React Native, algumas UIs no código da plataforma), você ainda poderá usar imagens que já estão incluídas no aplicativo.

Para imagens incluídas nos catálogos de ativos do Xcode ou na pasta drawable do Android, use o nome da imagem sem a extensão:

```jsx
<Image
  source={{uri: 'app_icon'}}
  style={{width: 40, height: 40}}
/>
```

Para imagens na pasta de ativos do Android, use o esquema `assets:/`:

```jsx
<Image
  source={{uri: 'asset:/app_icon.png'}}
  style={{width: 40, height: 40}}
/>
```

Essas abordagens não fornecem verificações de segurança. Cabe a você garantir que essas imagens estejam disponíveis no aplicativo. Além disso, você deve especificar as dimensões da imagem manualmente.

## Imagens de rede
Muitas das imagens que você exibirá em seu aplicativo não estarão disponíveis em tempo de compilação ou você desejará carregar algumas dinamicamente para manter o tamanho binário baixo. Ao contrário dos recursos estáticos, você precisará especificar manualmente as dimensões da sua imagem. É altamente recomendável que você use https também para atender aos [requisitos de segurança de transporte de aplicativos no iOS](/docs/publishing-to-app-store.md).

```jsx
// BOM
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />

// RUIM
<Image source={{uri: 'https://reactjs.org/logo-og.png'}} />
```

## Solicitações de rede para imagens
Se você quiser definir coisas como HTTP-Verb, Headers ou Body junto com a solicitação de imagem, você pode fazer isso definindo estas propriedades no objeto de origem:

```jsx
<Image
  source={{
    uri: 'https://reactjs.org/logo-og.png',
    method: 'POST',
    headers: {
      Pragma: 'no-cache',
    },
    body: 'Your Body goes here',
  }}
  style={{width: 400, height: 400}}
/>
```

## URI com dados
Às vezes, você pode obter dados de imagem codificados de uma chamada da API REST. Você pode usar o esquema uri `'data:'` para usar essas imagens. Da mesma forma que para os recursos de rede, você precisará especificar manualmente as dimensões da sua imagem.

> **INFORMAÇÕES**
> Isso é recomendado apenas para imagens muito pequenas e dinâmicas, como ícones em uma lista de um banco de dados.

```jsx
// inclua pelo menos largura e altura!
<Image
  style={{
    width: 51,
    height: 51,
    resizeMode: 'contain',
  }}
  source={{
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
  }}
/>
```

### Controle de cache (somente iOS)
Em alguns casos, você pode querer exibir uma imagem apenas se ela já estiver no cache local, ou seja, um espaço reservado de baixa resolução até que uma resolução mais alta esteja disponível. Em outros casos, você não se importa se a imagem está desatualizada e está disposto a exibi-la para economizar largura de banda. A propriedade de origem do cache fornece controle sobre como a camada de rede interage com o cache.

* `default`: use a estratégia padrão das plataformas nativas.
* `reload`: os dados do URL serão carregados da fonte de origem. Nenhum dado de cache existente deve ser usado para atender a uma solicitação de carregamento de URL.
* `force-cache`: Os dados existentes em cache serão usados para atender à solicitação, independentemente de sua idade ou data de expiração. Se não houver dados existentes no cache correspondente à solicitação, os dados serão carregados da fonte de origem.
* `only-if-cached`: os dados de cache existentes serão usados para atender a uma solicitação, independentemente de sua idade ou data de expiração. Se não houver dados existentes no cache correspondentes a uma solicitação de carregamento de URL, nenhuma tentativa será feita para carregar os dados da fonte de origem e o carregamento será considerado como tendo falhado.

```jsx
<Image
  source={{
    uri: 'https://reactjs.org/logo-og.png',
    cache: 'only-if-cached',
  }}
  style={{width: 400, height: 400}}
/>
```

## Imagens do sistema de arquivos local
Consulte [CameraRoll](https://github.com/react-native-community/react-native-cameraroll) para obter um exemplo de uso de recursos locais que estão fora de `Images.xcassets`.

### Melhor imagem do rolo da câmera
O iOS salva vários tamanhos para a mesma imagem no rolo da câmera. É muito importante escolher aquele que seja o mais próximo possível por motivos de desempenho. Você não gostaria de usar a imagem de 3264x2448 com qualidade total como fonte ao exibir uma miniatura de 200x200. Se houver uma correspondência exata, o React Native irá escolhê-la, caso contrário, usará a primeira que for pelo menos 50% maior para evitar desfoque ao redimensionar de um tamanho próximo. Tudo isso é feito por padrão, então você não precisa se preocupar em escrever o código tedioso (e sujeito a erros) para fazer isso sozinho.

## Por que não dimensionar tudo automaticamente?
No navegador, se você não fornecer um tamanho para uma imagem, o navegador renderizará um elemento 0x0, fará o download da imagem e, em seguida, renderizará a imagem com base no tamanho correto. O grande problema com esse comportamento é que sua IU vai pular conforme as imagens são carregadas, o que torna a experiência do usuário muito ruim. Isso é chamado de [mudança cumulativa de layou](https://web.dev/cls/)t.

No React Native esse comportamento não é implementado intencionalmente. É mais trabalhoso para o desenvolvedor saber antecipadamente as dimensões (ou proporção) da imagem remota, mas acreditamos que isso leva a uma melhor experiência do usuário. Imagens estáticas carregadas do pacote de aplicativos por meio da sintaxe `require('./my-icon.png')` podem ser dimensionadas automaticamente porque suas dimensões estão disponíveis imediatamente no momento da montagem.

Por exemplo, o resultado de `require('./my-icon.png')` pode ser:

```jsx
{"__packager_asset":true,"uri":"my-icon.png","width":591,"height":573}
```

## Fonte como um objeto
No React Native, uma decisão interessante é que o atributo `src` é denominado `source` e não aceita uma string, mas um objeto com um atributo `uri`.

```jsx
<Image source={{uri: 'something.jpg'}} />
```

Do lado da infraestrutura, a razão é que nos permite anexar metadados a este objeto. Por exemplo, se você estiver usando `require('./my-icon.png')`, adicionamos informações sobre sua localização e tamanho reais (não confie neste fato, pois pode mudar no futuro!). Isso também é uma prova futura, por exemplo, podemos querer oferecer suporte a sprites em algum momento, em vez de gerar `{uri: ...}`, podemos gerar `{uri: ..., crop: {left: 10, top: 50, width: 20, height: 40}}` e suporta sprites de forma transparente em todos os sites de chamada existentes.

Do lado do usuário, isso permite anotar o objeto com atributos úteis, como a dimensão da imagem, para calcular o tamanho em que ela será exibida. Sinta-se à vontade para usá-lo como sua estrutura de dados para armazenar mais informações sobre sua imagem .

## Imagem de fundo via aninhamento
Uma solicitação de recurso comum de desenvolvedores familiarizados com a web é a imagem de fundo. Para lidar com esse caso de uso, você pode usar o componente `<ImageBackground>`, que possui os mesmos adereços de `<Image>`, e adicionar quaisquer filhos que você gostaria de colocar em camadas sobre ele.

Talvez você não queira usar `<ImageBackground>` em alguns casos, pois a implementação é básica. Consulte a [documentação do `<ImageBackground>`](/docs/imagebackground.md) para obter mais informações e crie seu próprio componente personalizado quando necessário.

```jsx
return (
  <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
    <Text>Inside</Text>
  </ImageBackground>
);
```

Observe que você deve especificar alguns atributos de estilo de largura e altura.

## Estilo arredondado do iOS
Observe que as seguintes propriedades de estilo de raio de borda específicas de canto podem ser ignoradas pelo componente de imagem do iOS:

* `borderTopLeftRadius`
* `borderTopRightRadius`
* `borderBottomLeftRadius`
* `borderBottomRightRadius`

## Decodificação fora do thread
A decodificação de imagens pode levar mais do que um quadro. Esta é uma das principais fontes de queda de quadros na web porque a decodificação é feita na thread principal. No React Native, a decodificação da imagem é feita em uma thread diferente. Na prática, você já precisa cuidar do caso quando a imagem ainda não foi baixada, portanto, exibir o espaço reservado para mais alguns quadros enquanto ela é decodificada não requer nenhuma alteração de código.

## Configurando limites de cache de imagens do iOS
No iOS, expomos uma API para substituir os limites de cache de imagem padrão do React Native. Isso deve ser chamado de dentro do seu código AppDelegate nativo (por exemplo, dentro de `didFinishLaunchingWithOptions`).

```
RCTSetImageCacheLimits(4*1024*1024, 200*1024*1024);
```

**Parâmetros**

| NOME            | TIPO              | OBRIGATÓRIO    | DESCRIÇÃO                              |
|-----------------|-------------------|----------------|----------------------------------------|
| `imageSizeLimit`| `number`          | Sim            | Limite de tamanho do cache de imagem.  |
| `totalCostLimit`| `number`          | Sim            | Limite total de custo do cache.        |

No exemplo de código acima, o limite de tamanho da imagem é definido como 4 MB e o limite de custo total é definido como 200 MB.
