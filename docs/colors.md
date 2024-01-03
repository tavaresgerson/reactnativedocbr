# Referência de Cores
Os componentes do React Native são [estilizados usando JavaScript](/docs/style.md). As propriedades de cores geralmente correspondem ao modo como o [CSS funciona na web](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Guias gerais sobre o uso de cores em cada plataforma podem ser encontrados abaixo:

* [Android](https://material.io/design/color/color-usage.html)
* [iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/)

## APIs de cores
React Native possui diversas APIs de cores projetadas para permitir que você aproveite ao máximo o design da sua plataforma e as preferências do usuário.

* [PlatformColor](/docs/platformcolor.md) permite fazer referência ao sistema de cores da plataforma.
* [DynamicColorIOS](/docs/dynamiccolorios.md) é específico para iOS e permite especificar quais cores devem ser usadas no modo claro ou escuro.

## Representações de cores

### Vermelho Verde Azul (RGB)
React Native suporta `rgb()` e `rgba()` em notação hexadecimal e funcional:

* `'#f0f'` (#rgb)
* `'#ff00ff'` (#rrggbb)
* `'#f0ff'` (#rgba)
* `'#ff00ff00'` (#rrggbbaa)
* `'rgb(255, 0, 255)'`
* `'rgb(255 0 255)'`
* `'rgb(255, 0, 255, 1,0)'`
* `'rgba(255 0 255/1,0)'`

### Tonalidade Saturação Iluminação (HSL)
React Native suporta `hsl()` e `hsla()` em notação funcional:

* `'hsl(360, 100%, 100%)'`
* `'hsl(360 100% 100%)'`
* `'hsla(360, 100%, 100%, 1,0)'`
* `'hsla(360 100% 100% / 1,0)'`

### Matiz Brancura Escuridão (HWB)
React Native suporta `hwb()` em notação funcional:

* `'hwb(0, 0%, 100%)'`
* `'hwb(360, 100%, 100%)'`
* `'hwb(0 0% 0%)'`
* `'hwb(70 50% 0%)'`

### Informações de cor
React Native também suporta cores como valores `int` (no modo de cores RGB):

* `0xff00ff00` (0xrrggbbaa)

> **CUIDADO**
> Isso pode parecer semelhante à representação de cores do [Android](https://developer.android.com/reference/android/graphics/Color), mas no Android os valores são armazenados no modo de cores SRGB (0xaarrggbb).

### Cores nomeadas
No React Native você também pode usar strings de nomes de cores como valores.

> **INFORMAÇÕES**
> React Native suporta apenas nomes de cores em minúsculas. Nomes de cores em letras maiúsculas não são suportados.

#### `transparent`
Este é um atalho para `rgba(0,0,0,0)`, [igual ao CSS3](https://www.w3.org/TR/css-color-3/#transparent).

#### Palavras-chave das cores
A implementação de cores nomeadas segue a especificação [CSS3/SVG](https://www.w3.org/TR/css-color-3/#svg-color)

* aliceblue (#f0f8ff)
* antiquewhite (#faebd7)
* aqua (#00ffff)
* aquamarine (#7fffd4)
* azure (#f0ffff)
* beige (#f5f5dc)
* bisque (#ffe4c4)
* black (#000000)
* blanchedalmond (#ffebcd)
* blue (#0000ff)
* blueviolet (#8a2be2)
* brown (#a52a2a)
* burlywood (#deb887)
* cadetblue (#5f9ea0)
* chartreuse (#7fff00)
* chocolate (#d2691e)
* coral (#ff7f50)
* cornflowerblue (#6495ed)
* cornsilk (#fff8dc)
* crimson (#dc143c)
* cyan (#00ffff)
* darkblue (#00008b)
* darkcyan (#008b8b)
* darkgoldenrod (#b8860b)
* darkgray (#a9a9a9)
* darkgreen (#006400)
* darkgrey (#a9a9a9)
* darkkhaki (#bdb76b)
* darkmagenta (#8b008b)
* darkolivegreen (#556b2f)
* darkorange (#ff8c00)
* darkorchid (#9932cc)
* darkred (#8b0000)
* darksalmon (#e9967a)
* darkseagreen (#8fbc8f)
* darkslateblue (#483d8b)
* darkslategrey (#2f4f4f)
* darkturquoise (#00ced1)
* darkviolet (#9400d3)
* deeppink (#ff1493)
* deepskyblue (#00bfff)
* dimgray (#696969)
* dimgrey (#696969)
* dodgerblue (#1e90ff)
* firebrick (#b22222)
* floralwhite (#fffaf0)
* forestgreen (#228b22)
* fuchsia (#ff00ff)
* gainsboro (#dcdcdc)
* ghostwhite (#f8f8ff)
* gold (#ffd700)
* goldenrod (#daa520)
* gray (#808080)
* green (#008000)
* greenyellow (#adff2f)
* grey (#808080)
* honeydew (#f0fff0)
* hotpink (#ff69b4)
* indianred (#cd5c5c)
* indigo (#4b0082)
* ivory (#fffff0)
* khaki (#f0e68c)
* lavender (#e6e6fa)
* lavenderblush (#fff0f5)
* lawngreen (#7cfc00)
* lemonchiffon (#fffacd)
* lightblue (#add8e6)
* lightcoral (#f08080)
* lightcyan (#e0ffff)
* lightgoldenrodyellow (#fafad2)
* lightgray (#d3d3d3)
* lightgreen (#90ee90)
* lightgrey (#d3d3d3)
* lightpink (#ffb6c1)
* lightsalmon (#ffa07a)
* lightseagreen (#20b2aa)
* lightskyblue (#87cefa)
* lightslategrey (#778899)
* lightsteelblue (#b0c4de)
* lightyellow (#ffffe0)
* lime (#00ff00)
* limegreen (#32cd32)
* linen (#faf0e6)
* magenta (#ff00ff)
* maroon (#800000)
* mediumaquamarine (#66cdaa)
* mediumblue (#0000cd)
* mediumorchid (#ba55d3)
* mediumpurple (#9370db)
* mediumseagreen (#3cb371)
* mediumslateblue (#7b68ee)
* mediumspringgreen (#00fa9a)
* mediumturquoise (#48d1cc)
* mediumvioletred (#c71585)
* midnightblue (#191970)
* mintcream (#f5fffa)
* mistyrose (#ffe4e1)
* moccasin (#ffe4b5)
* navajowhite (#ffdead)
* navy (#000080)
* oldlace (#fdf5e6)
* olive (#808000)
* olivedrab (#6b8e23)
* orange (#ffa500)
* orangered (#ff4500)
* orchid (#da70d6)
* palegoldenrod (#eee8aa)
* palegreen (#98fb98)
* paleturquoise (#afeeee)
* palevioletred (#db7093)
* papayawhip (#ffefd5)
* peachpuff (#ffdab9)
* peru (#cd853f)
* pink (#ffc0cb)
* plum (#dda0dd)
* powderblue (#b0e0e6)
* purple (#800080)
* rebeccapurple (#663399)
* red (#ff0000)
* rosybrown (#bc8f8f)
* royalblue (#4169e1)
* saddlebrown (#8b4513)
* salmon (#fa8072)
* sandybrown (#f4a460)
* seagreen (#2e8b57)
* seashell (#fff5ee)
* sienna (#a0522d)
* silver (#c0c0c0)
* skyblue (#87ceeb)
* slateblue (#6a5acd)
* slategray (#708090)
* snow (#fffafa)
* springgreen (#00ff7f)
* steelblue (#4682b4)
* tan (#d2b48c)
* teal (#008080)
* thistle (#d8bfd8)
* tomato (#ff6347)
* turquoise (#40e0d0)
* violet (#ee82ee)
* wheat (#f5deb3)
* white (#ffffff)
* whitesmoke (#f5f5f5)
* yellow (#ffff00)
* yellowgreen (#9acd32)
