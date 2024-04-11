# Rede
Muitos aplicativos móveis precisam carregar recursos de uma URL remota. Você pode querer fazer uma solicitação POST para uma API REST ou pode precisar buscar um pedaço de conteúdo estático de outro servidor.

## Usando o Fetch
React Native fornece a [API Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) para suas necessidades de rede. Fetch parecerá familiar se você já usou `XMLHttpRequest` ou outras APIs de rede antes. Você pode consultar o guia do MDN sobre `como usar o Fetch` para obter informações adicionais.

### Fazendo requisições
Para buscar conteúdo de um URL arbitrário, você pode passar o URL a ser buscado:

```js
fetch('https://mywebsite.com/mydata.json');
```

Fetch também usa um segundo argumento opcional que permite personalizar a solicitação HTTP. Você pode especificar cabeçalhos adicionais ou fazer uma solicitação POST:

```js
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  }),
});
```

Dê uma olhada na [documentação do Fetch Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) para obter uma lista completa de propriedades.

### Lidando com a resposta
Os exemplos acima mostram como você pode fazer uma solicitação. Em muitos casos, você desejará fazer algo com a resposta.

A rede é uma operação inerentemente assíncrona. O método Fetch retornará uma [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) que simplifica a escrita de código que funciona de maneira assíncrona:

```js
const getMoviesFromApi = () => {
  return fetch('https://reactnative.dev/movies.json')
    .then(response => response.json())
    .then(json => {
      return json.movies;
    })
    .catch(error => {
      console.error(error);
    });
};
```

Você também pode usar a sintaxe `async/await` em um aplicativo React Native:

```js
const getMoviesFromApiAsync = async () => {
  try {
    const response = await fetch(
      'https://reactnative.dev/movies.json',
    );
    const json = await response.json();
    return json.movies;
  } catch (error) {
    console.error(error);
  }
};
```

Não se esqueça de capturar quaisquer erros que possam ser lançados pela busca, caso contrário eles serão descartados silenciosamente.

```js
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

type Movie = {
  id: string;
  title: string;
  releaseYear: string;
};

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Movie[]>([]);

  const getMovies = async () => {
    try {
      const response = await fetch('https://reactnative.dev/movies.json');
      const json = await response.json();
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <View style={{flex: 1, padding: 24}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({id}) => id}
          renderItem={({item}) => (
            <Text>
              {item.title}, {item.releaseYear}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default App;
```

Resposta:

```
Star Wars, 1977
Back to the Future, 1985
The Matrix, 1999
Inception, 2010
Interstellar, 2014
```

> Por padrão, o iOS 9.0 ou posterior aplica o App Transport Secruity (ATS). O ATS requer qualquer conexão HTTP para usar HTTPS. Se você precisar buscar em um URL de texto simples (que comece com http), primeiro você precisará adicionar uma [exceção ATS](/docs/integration-with-existing-apps.md). Se você souber antecipadamente a quais domínios precisará acessar, será mais seguro adicionar exceções apenas para esses domínios; se os domínios não forem conhecidos até o tempo de execução, você poderá [desativar o ATS completamente](/docs/publishing-to-app-store.md). Observe, entretanto, que a partir de janeiro de 2017, a [revisão da App Store da Apple exigirá uma justificativa](https://forums.developer.apple.com/thread/48979) razoável para desativar o ATS. Consulte a [documentação da Apple](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33) para obter mais informações.

> No Android, a partir do nível 28 da API, o tráfego de texto simples também é bloqueado por padrão. Esse comportamento pode ser substituído definindo `android:usesCleartextTraffic` no arquivo de manifesto do aplicativo.

## Usando outras bibliotecas de rede
A [`API XMLHttpRequest`](https://github.com/niftylettuce/frisbee) está integrada ao React Native. Isso significa que você pode usar bibliotecas de terceiros, como [frisbee](https://github.com/niftylettuce/frisbee) ou [axios](https://github.com/axios/axios), que dependem dele, ou pode usar a API XMLHttpRequest diretamente, se preferir.

```js
const request = new XMLHttpRequest();
request.onreadystatechange = e => {
  if (request.readyState !== 4) {
    return;
  }

  if (request.status === 200) {
    console.log('success', request.responseText);
  } else {
    console.warn('error');
  }
};

request.open('GET', 'https://mywebsite.com/endpoint/');
request.send();
```

> O modelo de segurança para XMLHttpRequest é diferente do modelo da web, pois não há conceito de [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) em aplicativos nativos.

## Suporte WebSocket
React Native também oferece suporte a WebSockets, um protocolo que fornece canais de comunicação full-duplex em uma única conexão TCP.

```js
const ws = new WebSocket('ws://host.com/path');

ws.onopen = () => {
  // conexão aberta
  ws.send('something'); // envia uma mensagem
};

ws.onmessage = e => {
  // uma mensagem foi recebida
  console.log(e.data);
};

ws.onerror = e => {
  // um erro aconteceu
  console.log(e.message);
};

ws.onclose = e => {
  // conexão fechada
  console.log(e.code, e.reason);
};
```

## Problemas conhecidos com autenticação baseada em busca e cookie
As opções a seguir não estão funcionando atualmente com busca

* `redirect:manual`
* `credentials:omit`
* Ter cabeçalhos com o mesmo nome no Android resultará na presença apenas do mais recente. Uma solução temporária pode ser encontrada aqui: [https://github.com/facebook/react-native/issues/18837#issuecomment-398779994](https://github.com/facebook/react-native/issues/18837#issuecomment-398779994).
* A autenticação baseada em cookies é atualmente instável. Você pode ver algumas das questões levantadas aqui: [https://github.com/facebook/react-native/issues/23185](https://github.com/facebook/react-native/issues/23185)
* No mínimo no iOS, quando redirecionado através de um `302`, se um cabeçalho `Set-Cookie` estiver presente, o cookie não será definido corretamente. Como o redirecionamento não pode ser tratado manualmente, isso pode causar um cenário em que ocorrem solicitações infinitas se o redirecionamento for o resultado de uma sessão expirada.

## Configurando NSURLSession no iOS
Para alguns aplicativos, pode ser apropriado fornecer um `NSURLSessionConfiguration` personalizado para o `NSURLSession` subjacente que é usado para solicitações de rede em um aplicativo React Native em execução no iOS. Por exemplo, pode ser necessário definir uma `string` de agente de usuário personalizada para todas as solicitações de rede provenientes do aplicativo ou fornecer `NSURLSession` com um `NSURLSessionConfiguration` efêmero. A função `RCTSetCustomNSURLSessionConfigurationProvider` permite tal customização. Lembre-se de adicionar a seguinte importação ao arquivo no qual `RCTSetCustomNSURLSessionConfigurationProvider` será chamado:

```swift
#import <React/RCTHTTPRequestHandler.h>
```

`RCTSetCustomNSURLSessionConfigurationProvider` deve ser chamado no início do ciclo de vida do aplicativo para que esteja prontamente disponível quando necessário pelo React, por exemplo:

```
-(void)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  // set RCTSetCustomNSURLSessionConfigurationProvider
  RCTSetCustomNSURLSessionConfigurationProvider(^NSURLSessionConfiguration *{
     NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
     // configure the session
     return configuration;
  });

  // set up React
  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
```
