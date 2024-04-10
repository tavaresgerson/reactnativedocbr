![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/ed2f583e-0b21-428a-abea-ff98868d9ec4)# Vinculando Bibliotecas

Nem todo aplicativo usa todos os recursos nativos, e incluir o código para suportar todos esses recursos afetaria o tamanho binário... Mas ainda queremos oferecer suporte à adição desses recursos sempre que você precisar deles.

Com isso em mente, expusemos muitos desses recursos como bibliotecas estáticas independentes.

Para a maioria das bibliotecas será tão rápido quanto arrastar dois arquivos, às vezes será necessário um terceiro passo, mas não mais que isso.

::: note Observação
Todas as bibliotecas que enviamos com o React Native ficam na pasta `Libraries` na raiz do repositório. Alguns deles são JavaScript puro e você só precisa usar o `require`.
Outras bibliotecas também dependem de algum código nativo; nesse caso, você terá que adicionar esses arquivos ao seu aplicativo, caso contrário, o aplicativo gerará um erro assim que você tentar usar a biblioteca.
:::

## Aqui estão algumas etapas para vincular suas bibliotecas que contêm código nativo

### Vinculação automática

Instale uma biblioteca com dependências nativas:

```shell
npm install <library-with-native-dependencies> --save
```

::: info Informações
O sinalizador `--save` ou `--save-dev` é muito importante para esta etapa. React Native vinculará suas bibliotecas com base em `dependencies` e `devDependencies` em seu arquivo `package.json`.
:::

É isso! Na próxima vez que você criar seu aplicativo, o código nativo será vinculado graças ao mecanismo [autolinking](https://github.com/react-native-community/cli/blob/main/docs/autolinking.md).

### Vinculação manual

#### Passo 1

Se a biblioteca possuir código nativo, deve haver um arquivo `.xcodeproj` dentro de sua pasta. Arraste este arquivo para o seu projeto no Xcode (geralmente no grupo `Libraries` no Xcode);

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/821ddb0c-400a-4139-8e72-56f6ed73743c)

#### Passo 2

Clique no arquivo principal do seu projeto (aquele que representa o `.xcodeproj`) selecione `Build Phases` e arraste a biblioteca estática da pasta `Products` dentro da biblioteca que você está importando para `Link Binary With Libraries`

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/feda8ef3-32b9-484c-8413-23d09d8d08d3)

#### Etapa 3

Nem toda biblioteca precisará desta etapa, o que você precisa considerar é:

_Preciso conhecer o conteúdo da biblioteca em tempo de compilação?_

Isso significa que você está usando esta biblioteca no lado nativo ou apenas em JavaScript? Se você estiver usando apenas em JavaScript, está pronto para prosseguir!

Se você precisar chamá-lo do nativo, precisaremos saber os cabeçalhos da biblioteca. Para conseguir isso você deve ir ao arquivo do seu projeto, selecionar `Build Settings` e procurar por `Header Search Paths`. Lá você deve incluir o caminho para sua biblioteca. (Esta documentação costumava recomendar o uso de `recursive`, mas isso não é mais recomendado, pois pode causar falhas sutis de compilação, especialmente com CocoaPods.)

![image](https://github.com/tavaresgerson/reactnativedocbr/assets/22455192/b9a3e3bb-5c9b-43a7-9819-f638fbfa64a9)
