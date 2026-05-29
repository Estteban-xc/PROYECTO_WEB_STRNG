# STRNG — Entrenamiento y Salud

Sitio web completo sobre entrenamiento, nutrición y salud. Desarrollado como proyecto final del curso de Desarrollo Web, integrando todos los temas vistos durante el módulo.

---

## URL de Despliegue

**[Ver sitio en vivo](https://estteban-xc.github.io/mi-proyecto-web/)**

---

## Descripción del Proyecto

STRNG es una plataforma web informativa orientada al mundo del gimnasio y la salud física. Ofrece contenido sobre rutinas de entrenamiento, alimentación, suplementación, implementos de gym y una calculadora de IMC. Además, cuenta con un formulario de contacto funcional conectado a un servicio externo.

El proyecto fue desarrollado íntegramente con HTML5, CSS3 y JavaScript vanilla, sin frameworks externos, aplicando todos los temas del curso de forma integrada y justificada.

---

## Estructura del Proyecto

```
/
├── index.html                  # Página principal
├── README.md                   # Documentación del proyecto
├── assets/
│   ├── images/                 # Imágenes del sitio (logo, favicon, fotos)
│   ├── videos/                 # Video de técnica de ejercicio
│   └── sounds/                 # Audio de fondo
├── css/
│   └── styles.css              # Hoja de estilos global
├── js/
│   └── script.js               # Lógica e interactividad
└── pages/
    ├── rutinas.html            # Página de rutinas de entrenamiento
    ├── alimentacion.html       # Página de nutrición y dieta
    ├── suplementacion.html     # Página de suplementos
    ├── implementos.html        # Página de equipamiento
    ├── IMC.html                # Calculadora de IMC
    └── contacto.html           # Formulario de contacto
```

---

## Páginas del Sitio

| Página | Descripción |
|--------|-------------|
| `index.html` | Inicio con hero, estadísticas, preview de secciones y recursos externos |
| `rutinas.html` | Planes de fuerza, hipertrofia y resistencia con guías paso a paso |
| `alimentacion.html` | Macronutrientes, alimentos esenciales y planes calóricos |
| `suplementacion.html` | Guía de suplementos, cuándo usarlos y recomendaciones |
| `implementos.html` | Accesorios, ropa técnica y equipamiento para home gym |
| `IMC.html` | Calculadora interactiva de Índice de Masa Corporal |
| `contacto.html` | Formulario de asesoría personalizada conectado a Formspree |

---

## Temas del Curso Aplicados

A continuación se detalla cómo y dónde se implementó cada tema del curso.

---

### Tema 1 — Estructura Semántica de HTML5
Se utilizaron etiquetas semánticas en todas las páginas: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` y `<canvas>`. Esto mejora la accesibilidad, el SEO y la legibilidad del código.

---

### Tema 2 — Etiquetas Básicas
Se aplicaron etiquetas fundamentales como `<h1>`–`<h4>`, `<p>`, `<span>`, `<div>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>` y `<button>` a lo largo de todo el sitio para estructurar el contenido correctamente.

---

### Tema 3 — Imágenes, Listas y Enlaces
Todas las páginas incluyen imágenes con atributo `alt` para accesibilidad. Se usan listas ordenadas (`<ol>`) en los pasos de ejercicios y listas no ordenadas (`<ul>`) en el footer y secciones informativas. Los enlaces (`<a>`) conectan todas las páginas del sitio y recursos externos.

---

### Tema 4 — Introducción a CSS
Todo el diseño visual está centralizado en `css/styles.css`. Se usó una arquitectura de variables CSS (`--red`, `--bg`, `--text`, etc.) para mantener coherencia visual y facilitar el cambio de tema claro/oscuro.

---

### Tema 5 — Propiedades CSS más Utilizadas
Se aplicaron extensivamente propiedades como `color`, `background`, `font-size`, `font-family`, `margin`, `padding`, `width`, `height`, `display`, `border`, `opacity`, `cursor` y `overflow` en todos los componentes del sitio.

---

### Tema 6 — Creación de un Favicon
Se creó y configuró un favicon personalizado con el símbolo de STRNG:
```html
<link rel="icon" href="../assets/images/simbolo.png" type="image/png">
```
Aparece en la pestaña del navegador en todas las páginas del sitio.

---

### Tema 7 — Bordes Redondeados
Se utilizó `border-radius` en cards, imágenes, botones, inputs y cajas de información para dar un estilo moderno y consistente a todos los elementos interactivos y decorativos del sitio.

---

### Tema 8 — Sombras
Se aplicaron `box-shadow` en cards, botones al hacer hover y el header al hacer scroll. También se usó `text-shadow` en el texto de fondo del hero para generar efecto de profundidad.

---

### Tema 9 — Imágenes de Fondo
Se usan gradientes CSS en secciones hero y bloques decorativos:
```css
background: linear-gradient(180deg, rgba(214,48,49,0.08) 0%, transparent 100%);
```
Se aplica `background-size: cover` y `background-position: center` en elementos con imagen de fondo.

---

### Tema 10 — Tipografías
Se importaron fuentes de Google Fonts:
- **Bebas Neue** — para títulos y elementos de impacto visual
- **Barlow Condensed** — para subtítulos, etiquetas y texto técnico
- **Inter** — para el cuerpo del texto y lectura cómoda

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Inter:wght@300;400;500&display=swap');
```

---

### Tema 11 — Cajas Flotantes (float)
Implementado en `contacto.html` con la imagen del entrenador flotando a la izquierda del texto introductorio:
```css
.contact-float-img {
  float: left;
  margin: 0 24px 16px 0;
}
```
Se usa `clear: both` al final del contenedor para evitar desbordamiento del layout.

---

### Tema 12 — Centrar el Contenido
El layout principal usa un contenedor `.container` con `max-width` y `margin: 0 auto` para centrar horizontalmente el contenido. El hero y varias secciones usan `text-align: center` para centrar el contenido dentro de sus bloques.

---

### Tema 13 — Flex (Flexbox)
Flexbox es la base del sistema de layout del sitio. Se usa en el header, las grillas de cards (`.grid-2`, `.grid-3`), el footer, los botones del header y las pills de metadatos de ejercicios.

---

### Tema 14 — Posición de los Elementos (position)
Se usa `position: fixed` en el header para que permanezca visible al hacer scroll. `position: absolute` en el texto de fondo del hero. `position: relative` en cards y elementos que contienen hijos posicionados.

---

### Tema 15 — Transformaciones (transform)
Se aplican transformaciones en hover de cards y botones:
```css
.card:hover { transform: translateY(-4px); }
.btn:hover  { transform: translateY(-2px); }
```
También se usa `transform: rotate()` en el ícono del menú hamburger al abrirse en móvil.

---

### Tema 16 — Formularios
Implementado en `contacto.html` con un formulario completo que incluye inputs de texto, email y número, select desplegable, radio buttons, checkboxes, textarea y validación en tiempo real con JavaScript. Conectado a Formspree para envío real al correo del administrador.

---

### Tema 17 — iframe
Implementado en `contacto.html` con un video de YouTube embebido usando `youtube-nocookie.com` para mayor privacidad del usuario:
```html
<iframe src="https://www.youtube-nocookie.com/embed/pZE3a4Lwq1Q" allowfullscreen></iframe>
```

---

### Tema 18 — Transiciones (transition)
Se aplican transiciones suaves en todos los elementos interactivos:
```css
transition: all 0.3s ease;
```
Visible en hover de cards, botones, links de navegación, inputs del formulario y el cambio de tema claro/oscuro.

---

### Tema 19 — Columnas de Texto
Implementado en la sección FAQ de `contacto.html` usando la propiedad CSS `columns`:
```css
.faq-columns {
  columns: 2;
  column-gap: 40px;
}
```
Divide el contenido de preguntas frecuentes en dos columnas para mejor legibilidad.

---

### Tema 20 — Video
Implementado en `rutinas.html` con un elemento `<video>` nativo de HTML5 para mostrar la técnica correcta del press de banca:
```html
<video controls preload="metadata" poster="...">
  <source src="../assets/videos/press_banca_video.mp4" type="video/mp4">
</video>
```

---

### Tema 21 — Audio
Implementado en `rutinas.html` con un botón flotante que activa y desactiva música de fondo:
```html
<audio id="bgAudio" loop preload="none">
  <source src="../assets/sounds/audio_fondo.mp3" type="audio/mpeg">
</audio>
<button id="audioBtn">Activar/desactivar música</button>
```

---

### Tema 22 — Transparencias y Degradados
Se usan en múltiples secciones con `linear-gradient()` para fondos degradados y `rgba()` para transparencias en overlays, bordes y fondos de cards. El modo oscuro usa colores con canal alpha para suavizar los contrastes.

---

### Tema 23 — Animaciones (animation)
Se implementaron animaciones con `@keyframes`:
- Ticker animado con desplazamiento horizontal infinito
- Fade-in de secciones al hacer scroll con Intersection Observer
- Contador animado de estadísticas en la franja de stats

---

### Tema 24 — SVG (Gráficos Vectoriales)
Implementado en `index.html` con un ícono decorativo de barra de pesas dibujado en SVG inline:
```html
<svg class="hero-svg-dumbbell" viewBox="0 0 120 32" aria-label="Barra de pesas">
  <rect x="30" y="14" width="60" height="4" rx="2" fill="currentColor"/>
  <!-- discos y mangos -->
</svg>
```
Usa `currentColor` para adaptarse automáticamente al tema claro u oscuro activo.

---

### Tema 25 — Canvas
Implementado en todas las páginas con un canvas de partículas animadas en el fondo:
```html
<canvas id="particles-canvas"></canvas>
```
Controlado desde `js/script.js` con la API Canvas 2D, generando partículas que se mueven y conectan entre sí creando un efecto visual dinámico.

---

### Tema 26 — Adaptación a Móviles (Media Queries)
Todo el sitio es completamente responsive. Se utilizan media queries para el menú hamburger, las grillas que pasan de 3 columnas a 1, tipografías con `clamp()` que escalan según el viewport, y el formulario de contacto que apila sus columnas en pantallas pequeñas.

---

### Tema 27 — Contenido Editable
Implementado en `rutinas.html` con un bloque de notas de entrenamiento editable directamente en el navegador:
```html
<div id="misNotas" contenteditable="true" spellcheck="true">
  Semana 1 — Press banca: 60 kg x 5 reps...
</div>
```
Incluye un botón para limpiar las notas y una barra de herramientas visual.

---

### Tema 28 — Storage
Implementado con `localStorage` en `js/script.js` para persistir la preferencia de tema (claro/oscuro) y las notas de entrenamiento entre sesiones:
```javascript
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');
```

---

## Tecnologías y Servicios Utilizados

| Tecnología | Justificación |
|------------|--------------|
| HTML5 | Estructura semántica y accesible del contenido |
| CSS3 | Diseño visual completo sin frameworks externos |
| JavaScript Vanilla | Interactividad sin dependencias adicionales |
| Google Fonts | Tipografías de calidad profesional |
| GitHub Pages | Despliegue gratuito e integrado directamente con el repositorio |
| Formspree | Procesamiento del formulario alojado fuera de la página, permitiendo recibir los datos por correo sin necesidad de un servidor propio |

---

## Formulario de Contacto

El formulario de `contacto.html` está conectado a Formspree, un servicio externo que recibe los datos del formulario, los envía al correo del administrador y los almacena en un dashboard propio. Esto cumple el requisito de alojar el procesamiento del formulario fuera de la página.

Endpoint utilizado: `https://formspree.io/f/xwvwprjb`

---

## Instrucciones de Uso

1. Ingresar al sitio a través de la URL de despliegue.
2. Usar el menú superior para navegar entre secciones.
3. El botón de tema en el header permite alternar entre modo claro y oscuro.
4. En la sección de Rutinas se puede consultar cada plan y tomar notas directamente en el navegador.
5. La calculadora de IMC permite ingresar peso y altura para obtener el resultado con su clasificación.
6. El formulario de Contacto permite enviar una consulta que llega directamente al correo del administrador.
7. El botón flotante en la página de Rutinas activa y desactiva la música de fondo.

---

## Lógica de activación: “Agente Secreto del DOM”

En la página se implementó un script que añade una interacción oculta basada en las acciones del usuario. Esta lógica funciona como una pequeña “misión” que se activa únicamente cuando se cumplen tres condiciones específicas relacionadas con el cálculo del IMC.

---

### Propósito

El objetivo de este script es monitorear la interacción del usuario y reaccionar automáticamente cuando:

1. Se ingresa el peso
2. Se ingresa la altura
3. Se realiza el cálculo del IMC (envío del formulario)

No importa el orden en que ocurran estas acciones. Una vez las tres han sucedido, se activa un cambio visual en la página.

---

### Manejo del estado

Para controlar el flujo de la lógica, se utilizan variables booleanas que representan el estado de cada condición:

```js
let condicion1_cumplida = false;
let condicion2_cumplida = false;
let condicion3_cumplida = false;
let agente_activado = false;
```

* Cada variable pasa de `false` a `true` cuando el usuario cumple una condición.
* La variable `agente_activado` se usa para evitar que la acción final se ejecute más de una vez.

---

### Detección de acciones del usuario

El script escucha eventos específicos en los elementos del formulario:

* En los campos de entrada (`input`), se detecta cuando el usuario escribe.
* En el formulario (`submit`), se detecta cuando el usuario realiza el cálculo del IMC.

Ejemplo simplificado:

```js
campoPeso.addEventListener('input', function () {
  if (this.value.trim() !== '') {
    condicion1_cumplida = true;
    verificarMision();
  }
});
```

Cada vez que ocurre una interacción válida, se actualiza el estado correspondiente y se llama a la función de verificación.

---

### Verificación de la misión

La función `verificarMision` se encarga de comprobar si todas las condiciones se han cumplido:

```js
function verificarMision() {
  if (condicion1_cumplida && condicion2_cumplida && condicion3_cumplida && !agente_activado) {
    agente_activado = true;

    // Se ejecutan los cambios en la página
  }
}
```

Esta función se ejecuta múltiples veces, pero solo realiza cambios cuando:

* Las tres condiciones son verdaderas
* La misión no ha sido activada previamente

---

### Cambios en la interfaz

Cuando la misión se cumple, el script modifica el contenido de la página de forma dinámica.

#### 1. Actualización del título principal

Se selecciona el elemento `<h1>` y se modifican sus estilos:

* Se aplica un fondo dorado (`#FFD700`)
* Se cambia el color del texto a negro (`#000000`)

Esto sirve como indicador visual inmediato de que la misión fue completada.

---

#### 2. Creación de un mensaje dinámico

Se genera un nuevo elemento `<p>` con el siguiente contenido:

```
Misión Cumplida: Agente DOM activado.
```

A este elemento se le aplican estilos para destacarlo:

* Texto en negrita
* Color verde oscuro (`#15803d`)
* Margen superior para separación visual

---

#### 3. Inserción en el DOM

El nuevo mensaje no reemplaza contenido existente, sino que se inserta justo después del título principal:

```js
titulo.parentNode.insertBefore(mensaje, titulo.nextSibling);
```

Esto asegura que el mensaje aparezca en una posición visible y coherente dentro de la estructura de la página.

---

### Resultado final

Cuando el usuario completa las tres acciones:

* El título principal cambia su apariencia
* Aparece un mensaje indicando que la misión ha sido completada
* Todo ocurre automáticamente
* La acción solo se ejecuta una vez, incluso si el usuario sigue interactuando

---

### Conceptos clave demostrados

Este script pone en práctica varios conceptos fundamentales de JavaScript y manipulación del DOM:

* Gestión de estado con variables booleanas
* Uso de eventos (`input` y `submit`)
* Manipulación de estilos desde JavaScript
* Creación dinámica de elementos HTML
* Inserción de nodos en el DOM
* Control de ejecución única mediante condiciones

---

Este tipo de lógica es común en interfaces modernas donde se requiere responder a múltiples acciones del usuario antes de ejecutar un cambio en la aplicación.

---

## Autor

-Esteban Varela
-Julian Martinez
-Sebastian torres Agudelo
2026 — STRNG. Hecho para los que no se rinden.
