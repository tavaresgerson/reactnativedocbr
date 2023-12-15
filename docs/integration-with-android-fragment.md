# Integração com um fragmento Android
O guia para [integração com aplicativos existentes](/docs/integration-with-existing-apps.md) detalha como integrar um aplicativo React Native de tela inteira em um aplicativo Android existente como uma Activity. Usar componentes React Native em Fragments em um aplicativo existente requer alguma configuração adicional. A vantagem disso é que permite que um aplicativo nativo integre componentes React Native junto com fragmentos nativos em uma Activity.

### 1. Adicione React Native ao seu aplicativo
Siga o guia de [integração com aplicativos existentes](/docs/integration-with-existing-apps.md) até a seção Integração de código. Continue seguindo a Etapa 1. Crie um arquivo `index.android.js` e a Etapa 2. Adicione seu código React Native desta seção.

### 2. Integrando seu aplicativo com um fragmento React Native
Você pode renderizar seu componente React Native em um Fragment em vez de uma Activity React Native em tela inteira. O componente pode ser denominado “screen” ou “fragment” e funcionará da mesma maneira que um fragmento do Android, provavelmente contendo componentes filhos. Esses componentes podem ser colocados em uma pasta `/fragments` e os componentes filhos usados para compor o fragmento podem ser colocados em uma pasta `/components`.

Você precisará implementar a interface `ReactApplication` em sua classe principal do aplicativo `Java/Kotlin`. Se você criou um novo projeto no Android Studio com uma Activity padrão, precisará criar uma nova classe (por exemplo, `MyReactApplication.java` ou `MyReactApplication.kt`). Se for uma classe existente, você poderá encontrar esta classe principal em seu arquivo `AndroidManifest.xml`. Sob a tag `<application />` você deverá ver uma propriedade `android:name`, por exemplo. `android:name=".MyReactApplication"`. Este valor é a classe que você deseja implementar e para a qual fornecer os métodos necessários.

Certifique-se de que sua classe principal `Application` implemente `ReactApplication`:

Java
```java
public class MyReactApplication extends Application implements ReactApplication {...}
```

Kotlin
```kt
class MyReactApplication: Application(), ReactApplication {...}
```

Substitua os métodos necessários `getUseDeveloperSupport`, `getPackages` e `getReactNativeHost`:

Java
```java
public class MyReactApplication extends Application implements ReactApplication {
    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);
    }

    private final ReactNativeHost mReactNativeHost = new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        protected List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here
            return packages;
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
```

Kotlin
```kt
class MyReactApplication : Application(), ReactApplication {
    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
    }
    private val reactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getUseDeveloperSupport() = BuildConfig.DEBUG
            override fun getPackages(): List<ReactPackage> {
                val packages = PackageList(this).getPackages().toMutableList()
                // Packages that cannot be autolinked yet can be added manually here
                return packages
            }
        }
    override fun getReactNativeHost(): ReactNativeHost = reactNativeHost
}
```

Se você estiver usando o Android Studio, use `Alt` + `Enter` para adicionar todas as importações ausentes na sua classe. Alternativamente, estas são as importações necessárias para incluir manualmente:

Java
```java
import android.app.Application;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import java.util.List;
```

Koltin
```kt
import android.app.Application

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
```

Execute uma operação "Sync Project files with Gradle".

### Etapa 3. Adicione um FrameLayout para o fragmento React Native
Agora você adicionará seu fragmento React Native a uma Activity. Para um novo projeto, esta Activity será `MainActivity`, mas pode ser qualquer activity e mais fragmentos podem ser adicionados a Activity à medida que você integra mais componentes React Native em seu aplicativo.

Primeiro adicione o React Native Fragment ao layout da sua Activity. Por exemplo `main_activity.xml na pasta `res/layouts`.

Adicione um `<FrameLayout>` com 'id`, largura e altura. Este é o layout no qual você encontrará e renderizará seu fragmento React Native.

```xml
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/reactNativeFragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

### Etapa 4. Adicionar um fragmento React Native ao FrameLayout
Para adicionar seu React Native Fragment ao seu layout, você precisa ter uma Activity. Conforme mencionado em um novo projeto, esta será a `MainActivity`. Nesta Activity adicione um botão e um ouvinte de evento. Ao clicar no botão, você renderizará seu fragmento React Native.

Modifique o layout da sua Activity para adicionar o botão:

```xml
<Button
    android:layout_margin="10dp"
    android:id="@+id/button"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="Show react fragment" />
```

Agora, em sua classe Activity (por exemplo, `MainActivity.java` ou `MainActivity.kt`), você precisa adicionar um `OnClickListener` para o botão, instanciar seu `ReactFragment` e adicioná-lo ao layout do quadro.

Adicione o campo do botão ao topo da sua Activity:

Java
```java
private Button mButton;
```

Kotlin
```kt
private lateinit var button: Button
```

Atualize o método `onCreate` da sua Activity da seguinte forma:

Java
```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main_activity);

    mButton = findViewById(R.id.button);
    mButton.setOnClickListener(new View.OnClickListener() {
        public void onClick(View v) {
            Fragment reactNativeFragment = new ReactFragment.Builder()
                    .setComponentName("HelloWorld")
                    .setLaunchOptions(getLaunchOptions("test message"))
                    .build();

            getSupportFragmentManager()
                    .beginTransaction()
                    .add(R.id.reactNativeFragment, reactNativeFragment)
                    .commit();

        }
    });
}
```

Kotlin
```kt
override fun onCreate(savedInstanceState: Bundle) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.main_activity)
    button = findViewById<Button>(R.id.button)
    button.setOnClickListener {
        val reactNativeFragment = ReactFragment.Builder()
                .setComponentName("HelloWorld")
                .setLaunchOptions(getLaunchOptions("test message"))
                .build()
        getSupportFragmentManager()
                .beginTransaction()
                .add(R.id.reactNativeFragment, reactNativeFragment)
                .commit()
    }
}
```

No código acima, `Fragment reactNativeFragment = new ReactFragment.Builder()` cria o ReactFragment e `getSupportFragmentManager().beginTransaction().add()` adiciona o Fragment ao Frame Layout.`

Se você estiver usando um kit inicial para React Native, substitua a string `"HelloWorld"` pela que está em seu arquivo `index.js` ou `index.android.js` (é o primeiro argumento para o método `AppRegistry.registerComponent()`).

Adicione o método `getLaunchOptions` que permitirá que você passe acessórios para o seu componente. Isso é opcional e você pode remover `setLaunchOptions` se não precisar passar nenhum props.

Java
```java
private Bundle getLaunchOptions(String message) {
    Bundle initialProperties = new Bundle();
    initialProperties.putString("message", message);
    return initialProperties;
}
```

Kotlin
```kt
private fun getLaunchOptions(message: String) = Bundle().apply {
    putString("message", message)
}
```

Adicione todas as importações ausentes na sua classe Activity. Tenha cuidado ao usar o `BuildConfig` do seu pacote e não o do pacote Facebook! Alternativamente, estas são as importações necessárias para incluir manualmente:

Java
```java
import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
```

Kotlin
```kt
import android.app.Application

import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.shell.MainReactPackage
import com.facebook.soloader.SoLoader
```

Execute uma operação "Sync Project files with Gradle".

### Passo 5. Teste sua integração
Certifique-se de executar o yarn para instalar suas dependências react-native e executar o `yarn native` para iniciar o empacotador metro. Execute seu aplicativo Android no Android Studio e ele deverá carregar o código JavaScript do servidor de desenvolvimento e exibi-lo em seu fragmento React Native na Activity.

### Etapa 6. Configuração adicional – Módulos nativos
Pode ser necessário chamar o código Java/Kotlin existente do seu componente react. Os módulos nativos permitem que você chame código nativo e execute métodos em seu aplicativo nativo. Siga a configuração aqui [native-modules-android](/docs/native-modules-android.md)

