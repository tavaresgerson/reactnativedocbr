# Acelerando sua fase de construção
Construir seu aplicativo React Native pode ser caro e levar vários minutos do tempo dos desenvolvedores. Isso pode ser problemático à medida que seu projeto cresce e geralmente em organizações maiores com vários desenvolvedores React Native.

Para mitigar esse impacto no desempenho, esta página compartilha algumas sugestões sobre como melhorar o tempo de construção.

> **INFORMAÇÕES**
> Se você notar um tempo de construção mais lento com a nova arquitetura no Android, recomendamos atualizar para o React Native 0.71

## Crie apenas uma ABI durante o desenvolvimento (somente Android)
Ao construir seu aplicativo Android localmente, por padrão você constrói todas as [4 interfaces binárias de aplicativo](https://developer.android.com/ndk/guides/abis) (ABIs): `armeabi-v7a`, `arm64-v8a`, `x86` e `x86_64`.

No entanto, você provavelmente não precisará compilar todos eles se estiver compilando localmente e testando seu emulador ou em um dispositivo físico.

Isso deve reduzir o tempo de construção nativo em um fator de aproximadamente 75%.

Se estiver usando o React Native CLI, você pode adicionar o sinalizador `--active-arch-only` ao comando run-Android. Este sinalizador garantirá que a ABI correta seja obtida no emulador em execução ou no telefone conectado. Para confirmar se essa abordagem está funcionando bem, você verá uma mensagem como `info Detected Architectures arm64-v8a` no console.

```
$ yarn react-native run-android --active-arch-only

[ ... ]
info Running jetifier to migrate libraries to AndroidX. You can disable it using "--no-jetifier" flag.
Jetifier found 1037 file(s) to forward-jetify. Using 32 workers...
info JS server already running.
info Detected architectures arm64-v8a
info Installing the app...
```

Este mecanismo depende da propriedade `reactNativeArchitectures` do Gradle.

Portanto, se você estiver compilando diretamente com o Gradle na linha de comando e sem a CLI, poderá especificar a ABI que deseja compilar da seguinte maneira:

```
$ ./gradlew :app:assembleDebug -PreactNativeArchitectures=x86,x86_64
```

Isso pode ser útil se você deseja construir seu aplicativo Android em um CI e usar uma matriz para paralelizar a construção das diferentes arquiteturas.

Se desejar, você também pode substituir esse valor localmente, usando o arquivo `gradle.properties` que você possui na pasta de nível superior do seu projeto:

```
# Use esta propriedade para especificar qual arquitetura você deseja construir.
# Você também pode substituí-lo na CLI usando
# ./gradlew <task> -PreactNativeArchitectures=x86_64
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

Depois de criar uma versão de lançamento do seu aplicativo, não se esqueça de remover esses sinalizadores, pois deseja criar um pacote apk/app que funcione para todas as ABIs e não apenas para aquela que você está usando em seu fluxo de trabalho de desenvolvimento diário.

## Use um cache do compilador
Se você estiver executando compilações nativas frequentes (C++ ou Objective-C), poderá se beneficiar do uso de um cache do compilador.

Especificamente, você pode usar dois tipos de caches: caches de compilador local e caches de compilador distribuídos.

### Caches locais

> **INFORMAÇÕES**
> As instruções a seguir funcionarão para Android e iOS. Se você estiver criando apenas aplicativos Android, você deve estar pronto. Se você também estiver criando aplicativos iOS, siga as instruções na seção Configuração específica do XCode abaixo.

Sugerimos usar o [ccache](https://ccache.dev/) para armazenar em cache a compilação de suas compilações nativas. O **Ccache** funciona agrupando os compiladores C++, armazenando os resultados da compilação e ignorando a compilação se um resultado intermediário da compilação tiver sido originalmente armazenado.

Para instalá-lo, você pode seguir as [instruções oficiais de instalação](https://github.com/ccache/ccache/blob/master/doc/INSTALL.md).

No macOS, podemos instalar o **ccache** com `brew install ccache`. Depois de instalado, você pode configurá-lo da seguinte maneira para armazenar em cache os resultados da compilação do NDK:

```
ln -s $(which ccache) /usr/local/bin/gcc
ln -s $(which ccache) /usr/local/bin/g++
ln -s $(which ccache) /usr/local/bin/cc
ln -s $(which ccache) /usr/local/bin/c++
ln -s $(which ccache) /usr/local/bin/clang
ln -s $(which ccache) /usr/local/bin/clang++
```

Isso criará links simbólicos para o `ccache` dentro do `/usr/local/bin/` que são chamados de `gcc`, `g++` e assim por diante.

Isso funciona desde que `/usr/local/bin/` venha primeiro que `/usr/bin/` dentro de sua variável `$PATH`, que é o padrão.

Você pode verificar se funciona usando o comando `which`:

```
$ which gcc
/usr/local/bin/gcc
```

Se o resultado for `/usr/local/bin/gcc`, então você está efetivamente chamando o `ccache`, que agrupará as chamadas do `gcc`.

> **CUIDADO**
> Observe que esta configuração do `ccache` afetará todas as compilações que você está executando em sua máquina, não apenas aquelas relacionadas ao React Native. Use-o por sua conta e risco. Se você não conseguir instalar/compilar outro software, esse pode ser o motivo. Se for esse o caso, você pode remover o link simbólico criado com:
>
> ```
> unlink /usr/local/bin/gcc
> unlink /usr/local/bin/g++
> unlink /usr/local/bin/cc
> unlink /usr/local/bin/c++
> unlink /usr/local/bin/clang
> unlink /usr/local/bin/clang++
> ```
> para reverter sua máquina ao status original e usar os compiladores padrão.

Você pode então fazer duas compilações limpas (por exemplo, no Android você pode primeiro executar o `yarn react-native run-android`, excluir a pasta `android/app/build` e executar o primeiro comando mais uma vez). Você notará que a segunda compilação foi muito mais rápida que a primeira (deve levar segundos em vez de minutos). Durante a construção, você pode verificar se o `ccache` funciona corretamente e verificar a taxa de acertos/erros do cache `ccache -s`

```
$ ccache -s
Summary:
  Hits:             196 /  3068 (6.39 %)
    Direct:           0 /  3068 (0.00 %)
    Preprocessed:   196 /  3068 (6.39 %)
  Misses:          2872
    Direct:        3068
    Preprocessed:  2872
  Uncacheable:        1
Primary storage:
  Hits:             196 /  6136 (3.19 %)
  Misses:          5940
  Cache size (GB): 0.60 / 20.00 (3.00 %)
```

Observe que o `ccache` agrega as estatísticas de todas as compilações. Você pode usar `ccache --zero-stats` para redefini-los antes de uma compilação para verificar a taxa de acertos do cache.

Se precisar limpar seu cache, você pode fazer isso com `ccache --clear`

#### Configuração específica do XCode
Para garantir que o `ccache` funcione corretamente com iOS e XCode, você precisa seguir algumas etapas extras:

1. Você deve alterar a forma como o Xcode e o `xcodebuild` chamam o comando do compilador. Por padrão eles usam caminhos totalmente especificados para os binários do compilador, portanto os links simbólicos instalados em `/usr/local/bin` não serão usados. Você pode configurar o Xcode para usar nomes relativos para os compiladores usando qualquer uma destas duas opções:
  * Variáveis de ambiente prefixadas na linha de comando se você usar uma linha de comando direta: `CLANG=clang CLANGPLUSPLUS=clang++ LD=clang LDPLUSPLUS=clang++ xcodebuild <resto da linha de comando do xcodebuild>`
  * Uma seção `post_install` em seu `ios/Podfile` que altera o compilador em seu espaço de trabalho Xcode durante a etapa de instalação do pod:

```
  post_install do |installer|
    react_native_post_install(installer)

    # ...possibly other post_install items here

    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        # Using the un-qualified names means you can swap in different implementations, for example ccache
        config.build_settings["CC"] = "clang"
        config.build_settings["LD"] = "clang"
        config.build_settings["CXX"] = "clang++"
        config.build_settings["LDPLUSPLUS"] = "clang++"
      end
    end

    __apply_Xcode_12_5_M1_post_install_workaround(installer)
  end
```

2. Você precisa de uma configuração de `ccache` que permita um certo nível de negligência e comportamento de cache, de modo que o `ccache` registre ocorrências de cache durante as compilações do Xcode. As variáveis de configuração do `ccache` que são diferentes do padrão são as seguintes se configuradas pela variável de ambiente:

```
export CCACHE_SLOPPINESS=clang_index_store,file_stat_matches,include_file_ctime,include_file_mtime,ivfsoverlay,pch_defines,modules,system_headers,time_macros
export CCACHE_FILECLONE=true
export CCACHE_DEPEND=true
export CCACHE_INODECACHE=true
```

O mesmo pode ser configurado em um arquivo `ccache.conf` ou qualquer outro mecanismo fornecido pelo `ccache`. Mais sobre isso pode ser encontrado no manual oficial do [`ccache`](https://ccache.dev/manual/4.3.html).

#### Usando esta abordagem em um IC
Ccache usa a pasta `/Users/$USER/Library/Caches/ccache` no macOS para armazenar o cache. Portanto, você pode salvar e restaurar a pasta correspondente também no CI para acelerar suas compilações.

No entanto, há algumas coisas que você deve estar ciente:

1. No CI, recomendamos fazer uma compilação totalmente limpa, para evitar problemas de cache envenenado. Se você seguir a abordagem mencionada no parágrafo anterior, poderá paralelizar a construção nativa em 4 ABIs diferentes e provavelmente não precisará do ccache no CI.

2. O `ccache` depende de carimbos de data/hora para calcular uma ocorrência no cache. Isso não funciona bem no CI, pois os arquivos são baixados novamente a cada execução do CI. Para superar isso, você precisará usar a opção de conteúdo `compiler_check`, que depende do [hash do conteúdo do arquivo](https://ccache.dev/manual/4.3.html).

### Caches distribuídos
Semelhante aos caches locais, você pode considerar o uso de um cache distribuído para suas compilações nativas. Isso pode ser especificamente útil em organizações maiores que fazem compilações nativas frequentes.

Recomendamos usar [sccache](https://github.com/mozilla/sccache) para conseguir isso. [Seguimos o início rápido da compilação distribuída do sccache](https://github.com/mozilla/sccache/blob/main/docs/DistributedQuickstart.md) para obter instruções sobre como configurar e usar esta ferramenta.
