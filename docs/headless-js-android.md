# Headless JS

Headless JS é uma forma de executar tarefas em JavaScript enquanto seu aplicativo está em segundo plano. Ele pode ser usado, por exemplo, para sincronizar dados recentes, lidar com notificações push ou reproduzir música.

## A API JS

Uma tarefa é uma função assíncrona que você registra no `AppRegistry`, semelhante ao registro de aplicativos React:

```tsx
import {AppRegistry} from 'react-native';
AppRegistry.registerHeadlessTask('SomeTaskName', () =>
  require('SomeTaskName'),
);
```

Então, em `SomeTaskName.js`:

```tsx
module.exports = async taskData => {
  // Fazer coisas
};
```

Você pode fazer qualquer coisa em sua tarefa, como solicitações de rede, temporizadores e assim por diante, desde que não toque na interface do usuário. Assim que sua tarefa for concluída (ou seja, a promessa for resolvida), o React Native entrará no modo "pausado" (a menos que haja outras tarefas em execução ou um aplicativo em primeiro plano).

## A API da plataforma

Sim, isso ainda requer algum código nativo, mas é bastante limitado. Você precisa estender `HeadlessJsTaskService` e substituir `getTaskConfig`, por exemplo:

::: code-group
```java [Java]
package com.your_application_name;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import javax.annotation.Nullable;

public class MyTaskService extends HeadlessJsTaskService {

  @Override
  protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras != null) {
      return new HeadlessJsTaskConfig(
          "SomeTaskName",
          Arguments.fromBundle(extras),
          5000, // timeout in milliseconds for the task
          false // optional: defines whether or not the task is allowed in foreground. Default is false
        );
    }
    return null;
  }
}
```

```kotlin [Kotlin]
package com.your_application_name;

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class MyTaskService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
        return intent.extras?.let {
            HeadlessJsTaskConfig(
                "SomeTaskName",
                Arguments.fromBundle(it),
                5000, // timeout for the task
                false // optional: defines whether or not the task is allowed in foreground.
                // Default is false
            )
        }
    }
}
```
:::

Em seguida, adicione o serviço ao seu arquivo `AndroidManifest.xml` dentro da tag `application`:

```
<service android:name="com.example.MyTaskService" />
```

Agora, sempre que você [iniciar seu serviço][0], por exemplo. como uma tarefa periódica ou em resposta a algum evento/transmissão do sistema, o JS irá acelerar, executar sua tarefa e, em seguida, diminuir a rotação.

Exemplo:

::: code-group
```java [Java]
Intent service = new Intent(getApplicationContext(), MyTaskService.class);
Bundle bundle = new Bundle();

bundle.putString("foo", "bar");
service.putExtras(bundle);

getApplicationContext().startService(service);
```

```kotlin [Kotlin]
val service = Intent(applicationContext, MyTaskService::class.java)
val bundle = Bundle()

bundle.putString("foo", "bar")

service.putExtras(bundle)

applicationContext.startService(service)
```
:::

## Novas tentativas

Por padrão, a tarefa JS headless não executará nenhuma nova tentativa. Para fazer isso, você precisa criar um `HeadlessJsRetryPolicy` e lançar um `Error` específico.

`LinearCountingRetryPolicy` é uma implementação de `HeadlessJsRetryPolicy` que permite especificar um número máximo de novas tentativas com um atraso fixo entre cada tentativa. Se isso não atender às suas necessidades, você pode implementar seu próprio `HeadlessJsRetryPolicy`. Essas políticas podem ser passadas como um argumento extra para o construtor `HeadlessJsTaskConfig`, por exemplo.

::: code-group
```java [Java]
HeadlessJsRetryPolicy retryPolicy = new LinearCountingRetryPolicy(
  3, // Número máximo de novas tentativas
  1000 // Atraso entre cada nova tentativa
);

return new HeadlessJsTaskConfig(
  'SomeTaskName',
  Arguments.fromBundle(extras),
  5000,
  false,
  retryPolicy
);
```

```kotlin [Kotlin]
val retryPolicy: HeadlessJsTaskRetryPolicy =
    LinearCountingRetryPolicy(
        3, // Número máximo de novas tentativas
        1000 // Atraso entre cada nova tentativa
    )

return HeadlessJsTaskConfig("SomeTaskName", Arguments.fromBundle(extras), 5000, false, retryPolicy)
```
:::

Uma nova tentativa só será feita quando um `Error` específico for lançado. Dentro de uma tarefa JS headless, você pode importar o erro e lançá-lo quando uma nova tentativa for necessária.

Exemplo:

```tsx
import {HeadlessJsTaskError} from 'HeadlessJsTask';

module.exports = async taskData => {
  const condition = ...;
  if (!condition) {
    throw new HeadlessJsTaskError();
  }
};
```

Se desejar que todos os erros causem uma nova tentativa, você precisará capturá-los e lançar o erro acima.

## Ressalvas

- Por padrão, seu aplicativo travará se você tentar executar uma tarefa enquanto o aplicativo estiver em primeiro plano. Isso evita que os desenvolvedores dêem um tiro no próprio pé ao trabalhar muito em uma tarefa e tornar a interface do usuário lenta. Você pode passar um quarto argumento `booleano` para controlar este comportamento.
- Se você iniciar seu serviço a partir de um `BroadcastReceiver`, certifique-se de chamar `HeadlessJsTaskService.acquireWakeLockNow()` antes de retornar de `onReceive()`.

## Exemplo de uso

O serviço pode ser iniciado a partir da API Java. Primeiro você precisa decidir quando o serviço deve ser iniciado e implementar sua solução de acordo. Aqui está um exemplo que reage à mudança na conexão de rede.

As linhas a seguir mostram parte do arquivo de manifesto do Android para registrar o receptor de transmissão.

```xml
<receiver android:name=".NetworkChangeReceiver" >
  <intent-filter>
    <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
  </intent-filter>
</receiver>
```

O receptor de transmissão então lida com a intenção que foi transmitida na função onReceive. Este é um ótimo lugar para verificar se seu aplicativo está em primeiro plano ou não. Se o aplicativo não estiver em primeiro plano, podemos preparar nossa intenção para ser iniciado, sem informações ou informações adicionais agrupadas usando `putExtra` (lembre-se de que o pacote pode lidar apenas com valores parcelados). No final o serviço é iniciado e o wakelock é adquirido.

::: code-group

```java [Java]
import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;

import com.facebook.react.HeadlessJsTaskService;

public class NetworkChangeReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(final Context context, final Intent intent) {
        /**
          Esta parte será chamada sempre que a conexão de rede for alterada
          por exemplo. Conectado -> Não conectado
         **/
        if (!isAppOnForeground((context))) {
            /**
             Iniciaremos nosso serviço e enviaremos informações extras sobre
             conexões de rede
             **/
            boolean hasInternet = isNetworkAvailable(context);
            Intent serviceIntent = new Intent(context, MyTaskService.class);
            serviceIntent.putExtra("hasInternet", hasInternet);
            context.startService(serviceIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
        }
    }

    private boolean isAppOnForeground(Context context) {
        /**
          Precisamos verificar se o aplicativo está em primeiro plano, caso contrário ele irá travar.
          https://stackoverflow.com/questions/8489993/check-android-application-is-in-foreground-or-not
         **/
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses =
                activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance ==
                    ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                    appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager cm = (ConnectivityManager)
                context.getSystemService(Context.CONNECTIVITY_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Network networkCapabilities = cm.getActiveNetwork();

            if(networkCapabilities == null) {
                return false;
            }

            NetworkCapabilities actNw = cm.getNetworkCapabilities(networkCapabilities);

            if(actNw == null) {
                return false;
            }

            if(actNw.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) || actNw.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) || actNw.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
                return true;
            }

            return false;
        }

        // obsoleto na API nível 29
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return (netInfo != null && netInfo.isConnected());
    }
}
```

```kotlin [Kotlin]
import android.app.ActivityManager
import android.app.ActivityManager.RunningAppProcessInfo
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import com.facebook.react.HeadlessJsTaskService

class NetworkChangeReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        /**
         * Esta parte será chamada sempre que a conexão de rede for alterada, por exemplo. Conectado -> Não Conectado
         */
        if (!isAppOnForeground(context)) {
            /** Iniciaremos nosso serviço e enviaremos informações extras sobre conexões de rede */
            val hasInternet = isNetworkAvailable(context)
            val serviceIntent = Intent(context, MyTaskService::class.java)
            serviceIntent.putExtra("hasInternet", hasInternet)
            context.startService(serviceIntent)
            HeadlessJsTaskService.acquireWakeLockNow(context)
        }
    }

    private fun isAppOnForeground(context: Context): Boolean {
        /**
         * Precisamos verificar se o aplicativo está em primeiro plano, caso contrário ele irá travar.
         * https://stackoverflow.com/questions/8489993/check-android-application-is-in-foreground-or-not
         */
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val appProcesses = activityManager.runningAppProcesses ?: return false
        val packageName: String = context.getPackageName()
        for (appProcess in appProcesses) {
            if (appProcess.importance == RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                    appProcess.processName == packageName
            ) {
                return true
            }
        }
        return false
    }

    companion object {
        fun isNetworkAvailable(context: Context): Boolean {
            val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            var result = false

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val networkCapabilities = cm.activeNetwork ?: return false

                val actNw = cm.getNetworkCapabilities(networkCapabilities) ?: return false

                result =
                    when {
                        actNw.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
                        actNw.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
                        actNw.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> true
                        else -> false
                    }

                return result
            } else {
                cm.run {
                    // obsoleto na API nível 29
                    cm.activeNetworkInfo?.run {
                        result =
                            when (type) {
                                ConnectivityManager.TYPE_WIFI -> true
                                ConnectivityManager.TYPE_MOBILE -> true
                                ConnectivityManager.TYPE_ETHERNET -> true
                                else -> false
                            }
                    }
                }
            }
            return result
        }
    }
}

```
:::

[0]: https://developer.android.com/reference/android/content/Context.html#startService(android.content.Intent)
