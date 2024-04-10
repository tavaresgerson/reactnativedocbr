# Executando no Simulador

## Iniciando o simulador

Depois de inicializar seu projeto React Native, você pode executar o seguinte comando dentro do diretório do projeto recém-criado.

```shell
npm run ios
```

```shell
yarn ios
```

Se tudo estiver configurado corretamente, você deverá ver seu novo aplicativo em execução no Simulador iOS em breve.

## Especificando um dispositivo

Você pode especificar o dispositivo que o simulador deve executar com o sinalizador `--simulator`, seguido pelo nome do dispositivo como uma string. O padrão é `"iPhone 14"`. Se desejar executar seu aplicativo em um iPhone SE (3ª geração), execute o seguinte comando:

```shell
npm run ios -- --simulator="iPhone SE (3rd generation)"
```

```shell
yarn ios --simulator "iPhone SE (3rd generation)"
```

Os nomes dos dispositivos correspondem à lista de dispositivos disponíveis no Xcode. Você pode verificar seus dispositivos disponíveis executando `xcrun simctl list devices` no console.

### Especificando uma versão do dispositivo

Se você tiver várias versões do iOS instaladas, também precisará especificar a versão apropriada. Por exemplo. Para executar seu aplicativo em um iPhone 14 Pro (16.0), execute o seguinte comando:

```shell
npm run ios -- --simulator="iPhone 14 Pro (16.0)"
```

```shell
yarn ios --simulator "iPhone 14 Pro (16.0)"
```

## Especificando um UDID

Você pode especificar o UDID do dispositivo retornado do comando `xcrun simctl list devices`. Por exemplo. Para executar seu aplicativo com UDID `AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA` execute o seguinte comando:

```shell
npm run ios -- --udid="AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
```

```shell
yarn ios --udid "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
```
