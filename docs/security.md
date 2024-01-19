# Segurança
A segurança é frequentemente negligenciada ao criar aplicativos. É verdade que é impossível construir software que seja completamente impenetrável – ainda temos que inventar uma fechadura completamente impenetrável (afinal, os cofres dos bancos ainda são arrombados). No entanto, a probabilidade de ser vítima de um ataque malicioso ou de ser exposto a uma vulnerabilidade de segurança é inversamente proporcional ao esforço que você está disposto a fazer para proteger seu aplicativo contra tal eventualidade. Embora um cadeado comum possa ser arrombado, ainda é muito mais difícil de passar do que um gancho de armário!
 
Neste guia, você aprenderá sobre as práticas recomendadas para armazenamento de informações confidenciais, autenticação, segurança de rede e ferramentas que ajudarão você a proteger seu aplicativo. Esta não é uma lista de verificação prévia – é um catálogo de opções, cada uma das quais ajudará a proteger ainda mais seu aplicativo e seus usuários.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/29c3667d-d096-475d-aa20-83a09884f40e)
_probabilidade de violação x esforço investido em segurança_

## Armazenando informações confidenciais
Nunca armazene chaves de API confidenciais no código do seu aplicativo. Qualquer coisa incluída no seu código pode ser acessada em texto simples por qualquer pessoa que inspecione o pacote de aplicativos. Ferramentas como [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) e [react-native-config](https://github.com/luggit/react-native-config/) são ótimas para adicionar variáveis específicas do ambiente, como endpoints de API, mas não devem ser confundidas com variáveis de ambiente do lado do servidor, que muitas vezes podem conter segredos e chaves de API.

Se você precisar de uma chave de API ou um segredo para acessar algum recurso do seu aplicativo, a maneira mais segura de lidar com isso seria construir uma camada de orquestração entre o seu aplicativo e o recurso. Esta poderia ser uma função sem servidor (por exemplo, usando AWS Lambda ou Google Cloud Functions) que pode encaminhar a solicitação com a chave ou segredo de API necessário. Os segredos no código do lado do servidor não podem ser acessados pelos consumidores da API da mesma forma que os segredos no código do seu aplicativo.

Para dados persistentes do usuário, escolha o tipo certo de armazenamento com base em sua sensibilidade. À medida que seu aplicativo é usado, muitas vezes você encontrará a necessidade de salvar dados no dispositivo, seja para oferecer suporte ao uso off-line do seu aplicativo, reduzir solicitações de rede ou salvar o token de acesso do usuário entre sessões para que eles não precisem voltar. -autenticar cada vez que usarem o aplicativo.

> **Persistente versus não persistente** – os dados persistentes são gravados no disco do dispositivo, o que permite que os dados sejam lidos pelo seu aplicativo durante a inicialização do aplicativo, sem a necessidade de fazer outra solicitação de rede para buscá-los ou solicitar ao usuário que os insira novamente. Mas isso também pode tornar esses dados mais vulneráveis ao acesso de invasores. Os dados não persistentes nunca são gravados no disco — portanto, não há dados para acessar!

### Armazenamento assíncrono
[Async Storage](https://github.com/react-native-async-storage/async-storage) é um módulo mantido pela comunidade para React Native que fornece um armazenamento de chave-valor assíncrono e não criptografado. O armazenamento assíncrono não é compartilhado entre aplicativos: cada aplicativo possui seu próprio ambiente sandbox e não tem acesso aos dados de outros aplicativos.

| USE ARMAZENAMENTO ASSYNC QUANDO...                                   | NÃO USE ARMAZENAMENTO ASSINCRONO PARA...                    |
|----------------------------------------------------------------------|-------------------------------------------------------------|
| Persistência de dados não confidenciais em execuções de aplicativos  | Armazenamento de tokens                                     |
| Estado Redux persistente                                             | Segredos                                                    |
| Estado GraphQL persistente                                           |                                                             |
| Armazenando variáveis globais em todo o aplicativo                   |                                                             |

#### Notas do desenvolvedor

> Async Storage é o equivalente React Native do armazenamento local da web

### Armazenamento seguro
O React Native não vem com nenhuma forma de armazenar dados confidenciais. No entanto, existem soluções pré-existentes para plataformas Android e iOS.

#### iOS - Serviços de chaveiro
O [Keychain Services](https://developer.apple.com/documentation/security/keychain_services) permite armazenar com segurança pequenos pedaços de informações confidenciais para o usuário. Este é o local ideal para armazenar certificados, tokens, senhas e qualquer outra informação confidencial que não pertença ao armazenamento assíncrono.

#### Android - Preferências compartilhadas seguras
[Shared Preferences](https://developer.android.com/reference/android/content/SharedPreferences) são o equivalente Android para um armazenamento de dados de valor-chave persistente. Os dados em Preferências compartilhadas não são criptografados por padrão, mas [Encrypted Shared Preferences](https://developer.android.com/topic/security/data) agrupam a classe Shared Preferences para Android e criptografam automaticamente chaves e valores.

#### Android - armazenamento de chaves
O sistema [Android Keystore](https://developer.android.com/training/articles/keystore) permite armazenar chaves criptográficas em um contêiner para dificultar a extração do dispositivo.

Para usar os serviços iOS Keychain ou Android Secure Shared Preferences, você mesmo pode escrever uma ponte ou usar uma biblioteca que os agrupa para você e fornece uma API unificada por sua conta e risco. Algumas bibliotecas a serem consideradas:

* [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)
* [react-native-encrypted-storage](https://github.com/emeraldsanto/react-native-encrypted-storage) - usa Keychain no iOS e EncryptedSharedPreferences no Android.
* [react-native-keychain](https://github.com/oblador/react-native-keychain)
* [react-native-sensitive-info](https://github.com/mCodex/react-native-sensitive-info) - seguro para iOS, mas usa Android Shared Preferences para Android (que não é seguro por padrão). No entanto, existe uma [ramificação](https://github.com/mCodex/react-native-sensitive-info/tree/keystore) que usa o Android Keystore.
  * [redux-persist-sensitive-storage](https://github.com/CodingZeal/redux-persist-sensitive-storage) - envolve react-native-sensitive-info para Redux.
 
> Esteja atento ao armazenamento ou exposição involuntária de informações confidenciais. Isso pode acontecer acidentalmente, por exemplo, salvando dados de formulário confidenciais em estado redux e persistindo toda a árvore de estado no armazenamento assíncrono. Ou enviar tokens de usuários e informações pessoais para um serviço de monitoramento de aplicativos como Sentry ou Crashlytics.

## Autenticação e links diretos

Os aplicativos móveis têm uma vulnerabilidade única que não existe na web: links diretos. Deep linking é uma forma de enviar dados diretamente para um aplicativo nativo de uma fonte externa. Um link direto se parece com `app://` onde app é o esquema do seu aplicativo e qualquer coisa após `//` pode ser usada internamente para lidar com a solicitação.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/4f76a68c-6e80-479f-b7cb-006e97a0c6b2)

Por exemplo, se você estivesse criando um aplicativo de comércio eletrônico, poderia usar `app://products/1` para criar um link direto para seu aplicativo e abrir a página de detalhes do produto com ID 1. Você pode pensar nesses tipos de URLs em na web, mas com uma distinção crucial:

Links diretos não são seguros e você nunca deve enviar informações confidenciais neles.

A razão pela qual os links diretos não são seguros é porque não existe um método centralizado de registro de esquemas de URL. Como desenvolvedor de aplicativos, você pode usar praticamente qualquer esquema de URL de sua escolha, [configurando-o no Xcode](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/defining_a_custom_url_scheme_for_your_app) para iOS ou adicionando uma [intenção no Android](https://developer.android.com/training/app-links/deep-linking).

Não há nada que impeça um aplicativo malicioso de sequestrar seu link direto, registrando-se também no mesmo esquema e obtendo acesso aos dados que seu link contém. Enviar algo como `app://products/1` não é prejudicial, mas enviar tokens é uma preocupação de segurança.

Quando o sistema operacional tiver dois ou mais aplicativos para escolher ao abrir um link, o Android mostrará ao usuário uma caixa de [diálogo de desambiguação](https://developer.android.com/training/basics/intents/sending#disambiguation-dialog) e solicitará que ele escolha qual aplicativo usar para abrir o link. No entanto, no iOS, o sistema operacional fará a escolha por você, então o usuário ficará felizmente inconsciente. A Apple tomou medidas para resolver esse problema em versões posteriores do iOS (iOS 11), onde instituiu o princípio de ordem de chegada, embora essa vulnerabilidade ainda possa ser explorada de diferentes maneiras, sobre as quais você pode ler [mais aqui](https://thehackernews.com/2019/07/ios-custom-url-scheme.html). O uso de [links universais](https://developer.apple.com/ios/universal-links/) permitirá vincular o conteúdo do seu aplicativo com segurança no iOS.

## OAuth2 e redirecionamentos
O protocolo de autenticação OAuth2 é incrivelmente popular hoje em dia, considerado o protocolo mais completo e seguro que existe. O protocolo OpenID Connect também se baseia nisso. No OAuth2, o usuário é solicitado a se autenticar por meio de terceiros. Após a conclusão bem-sucedida, esse terceiro redireciona de volta para o aplicativo solicitante com um código de verificação que pode ser trocado por um JWT – um [JSON Web Token](https://jwt.io/introduction/). JWT é um padrão aberto para transmissão segura de informações entre partes na web.

Na web, essa etapa de redirecionamento é segura, porque os URLs na web são garantidos como exclusivos. Isso não é verdade para aplicativos porque, como mencionado anteriormente, não existe um método centralizado de registro de esquemas de URL! Para resolver esta questão de segurança, uma verificação adicional deve ser adicionada na forma de PKCE.

[PKCE](https://oauth.net/2/pkce/), pronunciado “Pixy”, significa _Proof of Key Code Exchange_ e é uma extensão da especificação OAuth 2. Isso envolve adicionar uma camada adicional de segurança que verifica se as solicitações de autenticação e troca de tokens vêm do mesmo cliente. [PKCE](https://www.movable-type.co.uk/scripts/sha256.html) usa o algoritmo de hash criptográfico SHA 256. SHA 256 cria uma “assinatura” exclusiva para um texto ou arquivo de qualquer tamanho, mas é:

* Sempre o mesmo comprimento, independentemente do arquivo de entrada
* Garantido para produzir sempre o mesmo resultado para a mesma entrada
* Uma maneira (ou seja, você não pode fazer engenharia reversa para revelar a entrada original)

Agora você tem dois valores:

* **code_verifier** - uma grande string aleatória gerada pelo cliente
* **code_challenge** - o SHA 256 do _code_verifier_

Durante a solicitação inicial `/authorize`, o cliente também envia o `code_challenge` para o `code_verifier` que mantém na memória. Após a solicitação de autorização retornar corretamente, o cliente também envia o `code_verifier` que foi usado para gerar o `code_challenge`. O IDP calculará então o `code_challenge`, verificará se ele corresponde ao que foi definido na primeira solicitação `/authorize` e enviará o token de acesso apenas se os valores corresponderem.

Isso garante que apenas o aplicativo que acionou o fluxo de autorização inicial poderá trocar com êxito o código de verificação por um JWT. Portanto, mesmo que um aplicativo malicioso obtenha acesso ao código de verificação, ele será inútil por si só. Para ver isso em ação, confira este [exemplo](https://aaronparecki.com/oauth-2-simplified/#mobile-apps).

Uma biblioteca a ser considerada para OAuth nativo é [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth). React-native-app-auth é um SDK para comunicação com provedores OAuth2. Ele agrupa as bibliotecas nativas [AppAuth-iOS](https://github.com/openid/AppAuth-iOS) e [AppAuth-Android](https://github.com/openid/AppAuth-Android) e pode oferecer suporte a PKCE.

> React-native-app-auth pode oferecer suporte a PKCE somente se seu provedor de identidade oferecer suporte.

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/2dd8fd0b-c69c-41c3-a787-87e4f7ffe95c)

## Segurança de rede
Suas APIs devem sempre usar [criptografia SSL](https://www.ssl.com/faqs/faq-what-is-ssl/). A criptografia SSL protege contra a leitura dos dados solicitados em texto simples entre o momento em que saem do servidor e antes de chegarem ao cliente. Você saberá que o endpoint é seguro porque começa com `https://` em vez de `http://`.

### SSL Pinning
O uso de endpoints https ainda pode deixar seus dados vulneráveis à interceptação. Com https, o cliente só confiará no servidor se puder fornecer um certificado válido assinado por uma autoridade de certificação confiável pré-instalada no cliente. Um invasor pode tirar vantagem disso instalando um certificado CA raiz malicioso no dispositivo do usuário, para que o cliente confie em todos os certificados assinados pelo invasor. Portanto, confiar apenas em certificados ainda pode deixá-lo vulnerável a um [ataque man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

A SSL Pinning é uma técnica que pode ser usada no lado do cliente para evitar esse ataque. Ele funciona incorporando (ou fixando) uma lista de certificados confiáveis ao cliente durante o desenvolvimento, de modo que apenas as solicitações assinadas com um dos certificados confiáveis serão aceitas e quaisquer certificados autoassinados não serão aceitos.

> Ao usar o SSL Pinnig, você deve estar atento à expiração do certificado. Os certificados expiram a cada 1-2 anos e, quando isso acontecer, precisarão ser atualizados no aplicativo e também no servidor. Assim que o certificado no servidor for atualizado, todos os aplicativos com o certificado antigo incorporado deixarão de funcionar.

## Resumo
Não existe uma maneira infalível de lidar com a segurança, mas com esforço consciente e diligência, é possível reduzir significativamente a probabilidade de uma violação de segurança em seu aplicativo. Invista em segurança proporcional à sensibilidade dos dados armazenados em sua aplicação, ao número de usuários e aos danos que um hacker pode causar ao obter acesso à sua conta. E lembre-se: é significativamente mais difícil acessar informações que nunca foram solicitadas.
