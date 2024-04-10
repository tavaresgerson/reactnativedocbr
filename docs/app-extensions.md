# Extensões de aplicativos

As extensões de aplicativo permitem fornecer funcionalidade e conteúdo personalizados fora do aplicativo principal. Existem diferentes tipos de extensões de aplicativos no iOS, e todas elas são abordadas no [Guia de programação de extensões de aplicativos](https://developer.apple.com/library/content/documentation/General/Conceptual/ExtensibilityPG/index.html# //apple_ref/doc/uid/TP40014214-CH20-SW1). Neste guia, abordaremos brevemente como você pode aproveitar as vantagens das extensões de aplicativos no iOS.

## Uso de memória em extensões

Como essas extensões são carregadas fora da sandbox normal do aplicativo, é altamente provável que várias dessas extensões de aplicativo sejam carregadas simultaneamente. Como seria de esperar, essas extensões têm pequenos limites de uso de memória. Tenha isso em mente ao desenvolver suas extensões de aplicativo. É sempre altamente recomendável testar seu aplicativo em um dispositivo real, ainda mais ao desenvolver extensões de aplicativo: com muita frequência, os desenvolvedores descobrem que sua extensão funciona bem no simulador iOS, apenas para receber relatórios de usuários de que sua extensão não está carregando em dispositivos reais.

É altamente recomendável que você assista à palestra de Conrad Kramer sobre [Uso de memória em extensões](https://www.youtube.com/watch?v=GqXMqn6MXrM) para saber mais sobre esse tópico.

### Widget Today

O limite de memória de um widget Hoje é de 16 MB. Acontece que as implementações do widget Today usando React Native podem não funcionar de maneira confiável porque o uso de memória tende a ser muito alto. Você pode saber se o widget Today está excedendo o limite de memória se exibir a mensagem 'Não é possível carregar':

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/f3da10aa-01c1-413a-b65f-d3fe8b3a127c)

Sempre teste suas extensões de aplicativo em um dispositivo real, mas esteja ciente de que isso pode não ser suficiente, especialmente ao lidar com o widget Today. As compilações configuradas para depuração têm maior probabilidade de exceder os limites de memória, enquanto as compilações configuradas para versão não falham imediatamente. É altamente recomendável que você use [Instrumentos do Xcode](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/InstrumentsUserGuide/index.html) para analisar seu uso de memória no mundo real, pois é muito provável que sua compilação configurada para lançamento está muito próxima do limite de 16 MB. Em situações como essas, você pode ultrapassar rapidamente o limite de 16 MB executando operações comuns, como buscar dados de uma API.

Para experimentar os limites das implementações do widget React Native Today, tente estender o projeto de exemplo em [react-native-today-widget](https://github.com/matejkriz/react-native-today-widget/).

### Outras extensões de aplicativos

Outros tipos de extensões de aplicativo têm limites de memória maiores que o widget Today. Por exemplo, as extensões de teclado personalizado são limitadas a 48 MB e as extensões de compartilhamento são limitadas a 120 MB. Implementar essas extensões de aplicativo com React Native é mais viável. Um exemplo de prova de conceito é [react-native-ios-share-extension](https://github.com/andrewsardone/react-native-ios-share-extension).
