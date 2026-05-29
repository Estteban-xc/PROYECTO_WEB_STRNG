# STRNG — Entrenamiento, Salud y Tienda

Plataforma web fullstack sobre entrenamiento, nutrición y suplementación, con tienda online, sistema de rastreo de pedidos en tiempo real y panel de administración. Desarrollada como proyecto final del curso de Desarrollo Web.

---

## URL de Despliegue

**[Ver sitio en vivo](https://estteban-xc.github.io/PROYECTO_WEB_STRNG/)**

---

## Descripción General

STRNG es una plataforma web que combina contenido informativo sobre fitness con una tienda online funcional. Incluye rutinas de entrenamiento, guías de alimentación y suplementación, una calculadora de IMC, un sistema de rastreo de pedidos con historial cronológico y un panel de administración protegido por autenticación JWT.

El proyecto está construido con una arquitectura fullstack compuesta por:

- Frontend estático en HTML, CSS y JavaScript puro para las páginas informativas.
- Frontend dinámico en React 18 con Vite y React Router para la tienda, el rastreo de pedidos y el panel de administración.
- Backend REST en Node.js con Express.
- Base de datos NoSQL en MongoDB gestionada con Mongoose.

---

## Estructura del Proyecto

```
/
├── index.html                    # Página principal (HTML estático)
├── README.md
│
├── assets/
│   ├── images/                   # Imágenes del sitio: logo, favicon, fotos
│   ├── videos/                   # Video de técnica de ejercicio
│   └── sounds/                   # Audio de fondo
│
├── css/
│   └── styles.css                # Hoja de estilos global del sitio estático
│
├── js/
│   └── script.js                 # Lógica e interactividad del sitio estático
│
├── pages/                        # Páginas HTML estáticas
│   ├── rutinas.html
│   ├── alimentacion.html
│   ├── suplementacion.html
│   ├── implementos.html
│   ├── IMC.html
│   ├── contacto.html
│   ├── tienda.html
│   ├── rastreo.html
│   └── admin.html
│
├── docs/
│   ├── diagrama-estructura.png
│   └── documentacion.md
│
├── client/                       # Frontend React — Single Page Application
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx               # Definición de rutas con React Router
│       ├── index.css
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── Ticker.jsx
│       │   ├── admin/
│       │   │   └── ProductForm.jsx
│       │   └── store/
│       │       └── ProductCard.jsx
│       ├── hooks/
│       │   └── useProductos.js   # Hook personalizado para carga de productos
│       └── pages/
│           ├── HomePage.jsx
│           ├── TiendaPage.jsx
│           ├── RastreoPage.jsx
│           ├── AdminPage.jsx
│           ├── LoginPage.jsx
│           ├── RutinasPage.jsx
│           ├── AlimentacionPage.jsx
│           ├── SuplementsPage.jsx
│           ├── ImplementosPage.jsx
│           ├── IMCPage.jsx
│           └── ContactoPage.jsx
│
└── server/                       # Backend Node.js — API REST
    ├── index.js                  # Punto de entrada del servidor
    ├── package.json
    ├── seed.js                   # Script para poblar la base de datos
    ├── seedProductos.js          # Script de seed específico para productos
    ├── .env                      # Variables de entorno (no subir al repositorio)
    ├── middleware/
    │   └── auth.js               # Middleware de autenticación JWT
    ├── models/
    │   ├── index.js
    │   ├── User.js               # Modelo de usuario administrador
    │   ├── Producto.js           # Modelo de producto de la tienda
    │   └── Paquete.js            # Modelo de pedido y rastreo
    ├── controllers/
    │   ├── productosController.js
    │   ├── paquetesController.js
    │   └── repartidoresController.js
    └── routes/
        ├── auth.js
        ├── products.js
        ├── paquetes.js
        └── repartidores.js
```

---

## Arquitectura del Sistema

### Capas del Frontend

El proyecto mantiene dos capas de frontend que conviven dentro del mismo servidor.

**Frontend estático:** Las páginas informativas (`rutinas.html`, `alimentacion.html`, `IMC.html`, etc.) son archivos HTML servidos directamente por Express como contenido estático desde la raíz del proyecto. No requieren compilación ni herramientas de build.

**Frontend React (SPA):** La tienda, el rastreo de pedidos, el panel de administración y el login son componentes React compilados con Vite. En desarrollo corren en el servidor de Vite con proxy al backend. En producción se compilan y los archivos resultantes se sirven también como estáticos desde Express.

### Flujo de Solicitudes

Express maneja todas las solicitudes entrantes bajo una única instancia del servidor:

```
Solicitud del cliente
  |
  |-- GET /pages/rutinas.html      → Express sirve archivo HTML estático
  |-- GET /assets/images/logo.png  → Express sirve archivo de imagen
  |-- GET /api/productos           → Controlador → MongoDB → JSON
  |-- GET /api/paquetes/:guia      → Controlador → MongoDB → JSON
  |-- GET /tienda                  → catch-all → index.html (React Router toma el control)
  |-- GET /admin                   → catch-all → index.html (React Router toma el control)
```

Cuando la ruta no corresponde a un archivo estático ni a un endpoint de la API, el servidor devuelve el `index.html` raíz para que React Router maneje la navegación del lado del cliente.

---

## Base de Datos

La base de datos está en MongoDB y se gestiona con Mongoose. El proyecto define tres modelos principales.

### Modelo User

Almacena los administradores del sistema. Campos relevantes:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nombre del usuario |
| email | String | Correo único, usado para login |
| password | String | Contraseña encriptada con bcryptjs |
| role | String | Valor fijo `'admin'` |
| activo | Boolean | Permite deshabilitar accesos sin eliminar el registro |

Las contraseñas nunca se almacenan en texto plano. Se encriptan con bcryptjs antes de guardarse y nunca se devuelven en las respuestas de la API.

### Modelo Producto

Representa un artículo disponible en la tienda.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nombre del producto |
| marca | String | Marca del fabricante |
| descripcion | String | Descripción del producto |
| precio | Number | Precio de venta actual |
| precioAntes | Number | Precio anterior para mostrar descuento (opcional) |
| categoria | String (enum) | Una de: proteina, fuerza, energia, salud, recuperacion |
| sabores | Array de String | Lista de sabores disponibles |
| imagen | String | URL de la imagen del producto |
| stock | Number | Unidades disponibles |
| disponible | Boolean | Controla si aparece en la tienda |
| destacado | Boolean | Marca el producto como destacado en la página principal |

Mongoose añade automáticamente `createdAt` y `updatedAt`.

### Modelo Paquete

Representa un pedido o envío. Es el modelo más complejo del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| guia | String | Código único generado automáticamente con formato `STRNG-XXXXXX` |
| remitente | Object | Nombre, teléfono y dirección del remitente |
| destinatario | Object | Nombre, teléfono, dirección y ciudad del destinatario |
| dimensiones | Object | Peso (kg), largo, ancho y alto (cm) |
| descripcion | String | Descripción del contenido del paquete |
| productos | Array | Lista de productos incluidos con nombre, sabor, cantidad y precio |
| total | Number | Valor total del pedido |
| estado | String (enum) | Estado actual: Procesando, Empacado, En tránsito, En ruta, Entregado |
| historialEstados | Array | Historial cronológico de cambios de estado con descripción, ubicación y hora |
| repartidor | ObjectId | Referencia al repartidor asignado (modelo Repartidor) |
| fechaEntrega | Date | Fecha real de entrega |

Al crearse un nuevo paquete, un hook `pre-save` de Mongoose registra automáticamente el primer evento en `historialEstados` con el estado inicial `"Procesando"`. El código de guía se genera combinando un fragmento del timestamp en base 36 con caracteres aleatorios.

---

## API REST

Todos los endpoints se encuentran bajo el prefijo `/api/`. Las rutas marcadas como "Admin" requieren un token JWT válido en el header `Authorization: Bearer <token>` y que el usuario tenga `role: 'admin'`.

### Autenticación — `/api/auth`

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/auth/login` | Público | Inicia sesión. Recibe `email` y `password`, devuelve un token JWT con expiración de 8 horas. |
| POST | `/api/auth/register` | Público | Registro de nuevo administrador. Destinado a uso en scripts de seed. |

### Productos — `/api/productos`

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/productos` | Público | Devuelve todos los productos disponibles. |
| GET | `/api/productos/:id` | Público | Devuelve un producto específico por su ID. |
| POST | `/api/productos` | Admin | Crea un nuevo producto con los datos del body. |
| PUT | `/api/productos/:id` | Admin | Actualiza los campos del producto indicado. |
| DELETE | `/api/productos/:id` | Admin | Elimina el producto de la base de datos. |

### Paquetes y Rastreo — `/api/paquetes`

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/paquetes/estadisticas` | Público | Devuelve totales agrupados por estado. |
| GET | `/api/paquetes/:guia` | Público | Consulta un paquete por código de guía. Endpoint principal del sistema de rastreo. |
| GET | `/api/paquetes` | Admin | Lista todos los paquetes registrados. |
| POST | `/api/paquetes` | Admin | Crea un nuevo paquete. Genera la guía y el primer evento de historial automáticamente. |
| PUT | `/api/paquetes/:id` | Admin | Actualiza el estado u otros datos del paquete. Añade el nuevo evento al historial. |
| DELETE | `/api/paquetes/:id` | Admin | Elimina un paquete de la base de datos. |

### Repartidores — `/api/repartidores`

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/repartidores` | Admin | Lista todos los repartidores. |
| POST | `/api/repartidores` | Admin | Registra un nuevo repartidor. |
| PUT | `/api/repartidores/:id` | Admin | Actualiza los datos del repartidor. |
| DELETE | `/api/repartidores/:id` | Admin | Elimina el repartidor. |

---

## Autenticación y Autorización

El sistema utiliza JSON Web Tokens (JWT) para proteger los recursos de administración. El flujo completo es el siguiente:

1. El administrador ingresa sus credenciales (email y contraseña) en la página de login.
2. El servidor busca al usuario en MongoDB, compara la contraseña ingresada contra el hash almacenado usando bcryptjs y, si coinciden, firma un token JWT con la clave secreta definida en `.env` y una expiración de 8 horas.
3. El token se devuelve al cliente, que lo almacena para incluirlo en las solicitudes posteriores.
4. En cada petición a una ruta protegida, el middleware `verificarToken` extrae el token del header `Authorization`, lo verifica con la clave secreta y carga los datos del usuario desde la base de datos. Si el token es inválido o expiró, responde con HTTP 401.
5. El middleware `soloAdmin` verifica adicionalmente que el usuario tenga `role: 'admin'`. Si no cumple la condición, responde con HTTP 403.
6. Los middlewares se pueden encadenar de forma individual o como combinación `authAdmin` (token + verificación de rol) para aplicarlos a rutas específicas.

---

## Sistema de Rastreo de Pedidos

El rastreo es una funcionalidad pública que permite a cualquier persona consultar el estado de un pedido ingresando su código de guía. El flujo completo es:

1. El administrador crea un paquete desde el panel admin completando los datos del remitente, destinatario, productos y dimensiones.
2. Al guardarse en MongoDB, el modelo genera automáticamente el código de guía (`STRNG-XXXXXX`) y el hook `pre-save` registra el primer evento en `historialEstados`: estado `"Procesando"`, descripción `"Pedido recibido y registrado en el sistema STRNG."`, ubicación `"Centro de distribución STRNG, Bogotá"`.
3. El cliente ingresa su código de guía en la página de rastreo.
4. El frontend hace una petición GET a `/api/paquetes/:guia`.
5. El servidor devuelve el documento completo: estado actual, historial cronológico de eventos con fecha y ubicación, datos del destinatario, lista de productos incluidos, total y datos del repartidor asignado.
6. El frontend renderiza una barra de progreso visual con las cinco etapas del pedido (Procesando, Empacado, En tránsito, En ruta, Entregado), resaltando la etapa actual y mostrando el porcentaje de avance. Debajo se lista el historial de eventos en orden cronológico.
7. Cuando el administrador actualiza el estado de un paquete desde el panel, puede añadir una descripción y ubicación al nuevo evento. Este queda registrado en el array `historialEstados` con su timestamp, acumulando el historial completo del pedido.

Las cinco etapas del flujo están definidas en orden fijo:

```
Procesando → Empacado → En tránsito → En ruta → Entregado
```

---

## Panel de Administración

El panel de administración está disponible en la ruta `/admin` (React) y en `/pages/admin.html` (HTML estático). Requiere autenticación con credenciales de administrador.

### Gestión de Productos

El administrador puede ver el catálogo completo de productos con sus estadísticas de stock y disponibilidad. Desde un formulario modal puede crear nuevos productos indicando nombre, marca, descripción, precio, precio anterior (para mostrar descuentos), categoría, lista de sabores disponibles, URL de imagen y estado de disponibilidad. También puede editar cualquier campo de un producto existente o eliminarlo con un diálogo de confirmación.

### Gestión de Paquetes

El administrador puede ver todos los pedidos registrados con sus estados actuales, fechas y datos del destinatario. Puede cambiar el estado de cualquier paquete a lo largo de las cinco etapas del flujo, añadiendo en cada cambio una nota descriptiva y la ubicación actual. También puede asignar un repartidor al pedido y registrar la fecha de entrega cuando el estado llega a "Entregado".

### Gestión de Repartidores

El administrador puede registrar repartidores con su nombre, teléfono, tipo de vehículo y placa. Los repartidores registrados aparecen como opciones al asignar un paquete, y sus datos se muestran en la página de rastreo cuando el pedido está "En ruta".

### Estadísticas del Dashboard

La vista principal del panel muestra tarjetas con métricas del sistema: total de productos registrados, total de paquetes, desglose de paquetes por estado y otros indicadores relevantes. Los datos se cargan desde la API al montar el componente y se actualizan automáticamente después de cada operación.

---

## Instrucciones de Uso y Configuración

### Requisitos

- Node.js versión 18 o superior
- Cuenta en MongoDB Atlas o instancia local de MongoDB

### Variables de Entorno

Crear el archivo `server/.env` con el siguiente contenido:

```
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/strng
JWT_SECRET=clave_secreta_segura
PORT=3001
```

### Instalación y Arranque

```bash
# Instalar dependencias del backend y arrancar
cd server
npm install
npm run dev

# Instalar dependencias del frontend React y arrancar en desarrollo
cd client
npm install
npm run dev
```

En desarrollo, Vite corre en el puerto 5173 con proxy configurado hacia el backend en el puerto 3001. En producción, compilar el frontend con `npm run build` dentro de la carpeta `client` y el servidor Express servirá los archivos generados automáticamente.

### Poblar la Base de Datos

```bash
cd server
node seed.js           # Crea el usuario administrador y datos de prueba
node seedProductos.js  # Crea los productos de ejemplo en la tienda
```

---

## Páginas del Sitio

| Página | Tecnología | Descripción |
|--------|------------|-------------|
| `index.html` | HTML estático | Inicio con hero, estadísticas animadas y preview de secciones |
| `pages/rutinas.html` | HTML estático | Planes de fuerza, hipertrofia y resistencia con video y notas editables |
| `pages/alimentacion.html` | HTML estático | Macronutrientes, alimentos esenciales y planes calóricos |
| `pages/suplementacion.html` | HTML estático | Guía de suplementos, cuándo usarlos y recomendaciones |
| `pages/implementos.html` | HTML estático | Accesorios, ropa técnica y equipamiento para home gym |
| `pages/IMC.html` | HTML estático | Calculadora interactiva de Índice de Masa Corporal |
| `pages/contacto.html` | HTML estático | Formulario de asesoría conectado a Formspree, video embebido y FAQ |
| `pages/tienda.html` | HTML / React | Tienda de suplementos con productos cargados desde la base de datos |
| `pages/rastreo.html` | HTML / React | Consulta de estado de pedidos por código de guía |
| `pages/admin.html` | HTML / React | Panel de administración con gestión de productos, paquetes y repartidores |

---

## Temas del Curso Aplicados

| Tema | Implementación |
|------|----------------|
| Estructura semántica HTML5 | Etiquetas `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` y `<canvas>` en todas las páginas |
| Etiquetas básicas | Uso de `<h1>`–`<h4>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<button>` en todo el sitio |
| Imágenes, listas y enlaces | Imágenes con atributo `alt`, listas ordenadas en pasos de ejercicios, enlaces de navegación entre páginas |
| Introducción a CSS | Archivo `css/styles.css` centralizado con variables CSS (`--red`, `--bg`, `--text`) para coherencia visual y soporte de modo claro/oscuro |
| Propiedades CSS | `color`, `background`, `font-size`, `font-family`, `margin`, `padding`, `width`, `height`, `border`, `opacity`, `overflow` en todos los componentes |
| Favicon | Configurado con `<link rel="icon" href="../assets/images/simbolo.png">` en todas las páginas |
| Bordes redondeados | `border-radius` aplicado en cards, imágenes, botones e inputs |
| Sombras | `box-shadow` en cards y botones al hacer hover; `text-shadow` en texto del hero |
| Imágenes de fondo | `linear-gradient()` en secciones hero y bloques decorativos con `background-size: cover` |
| Tipografías | Google Fonts: Bebas Neue para títulos, Barlow Condensed para subtítulos e Inter para cuerpo de texto |
| Cajas flotantes | `float: left` en imagen de `contacto.html` con `clear: both` al cierre del contenedor |
| Centrar contenido | Contenedor `.container` con `max-width` y `margin: 0 auto`; `text-align: center` en secciones hero |
| Flexbox | Base del layout en header, grillas de cards (`.grid-2`, `.grid-3`), footer y pills de metadatos |
| Posición de elementos | `position: fixed` en el header; `position: absolute` en texto del hero; `position: relative` en cards con hijos posicionados |
| Transformaciones | `translateY` en hover de cards y botones; `rotate` en el ícono del menú hamburger al abrirse en móvil |
| Formularios | Formulario completo en `contacto.html` con inputs, select, radio buttons, checkboxes, textarea y validación en tiempo real con JavaScript |
| iframe | Video de YouTube embebido en `contacto.html` usando `youtube-nocookie.com` para mayor privacidad |
| Transiciones | `transition: all 0.3s ease` en todos los elementos interactivos: cards, botones, links e inputs |
| Columnas de texto | `columns: 2; column-gap: 40px` en la sección FAQ de `contacto.html` |
| Video | Elemento `<video>` nativo de HTML5 en `rutinas.html` con técnica de press de banca |
| Audio | Botón flotante en `rutinas.html` que activa y desactiva música de fondo con el elemento `<audio>` |
| Transparencias y degradados | `linear-gradient()` y `rgba()` en overlays, bordes de cards y fondos del modo oscuro |
| Animaciones | Ticker animado con desplazamiento horizontal infinito; fade-in de secciones con Intersection Observer; contadores animados en la franja de estadísticas |
| SVG | Ícono de barra de pesas dibujado con SVG inline en `index.html`, usando `currentColor` para adaptarse al tema activo |
| Canvas | Partículas animadas en el fondo de todas las páginas mediante la API Canvas 2D desde `js/script.js` |
| Media Queries | Menú hamburger, grillas que pasan de 3 columnas a 1, tipografías con `clamp()` y formulario de contacto que apila columnas en pantallas pequeñas |
| Contenido editable | Bloque de notas de entrenamiento en `rutinas.html` con `contenteditable="true"` y botón para limpiar |
| Storage | `localStorage` para persistir la preferencia de tema claro/oscuro y las notas de entrenamiento entre sesiones |

---

## Easter Egg — Agente Secreto del DOM

En la página `pages/IMC.html` existe una lógica oculta implementada en JavaScript que monitorea las interacciones del usuario. Se activa únicamente cuando se cumplen tres condiciones en cualquier orden: ingresar el peso, ingresar la altura y ejecutar el cálculo del IMC.

Al completarse las tres condiciones, el script modifica el título principal de la página aplicándole un fondo dorado y texto negro, e inserta dinámicamente un párrafo con el mensaje "Misión Cumplida: Agente DOM activado." La acción se ejecuta una sola vez por sesión gracias a una variable booleana de control. El ejercicio demuestra manejo de estado con variables, escucha de eventos, manipulación de estilos desde JavaScript, creación dinámica de nodos e inserción en el DOM.

---

## Tecnologías y Servicios

| Tecnología | Descripción |
|------------|-------------|
| HTML5 | Estructura semántica del frontend estático |
| CSS3 | Diseño visual sin frameworks externos |
| JavaScript Vanilla | Interactividad del frontend estático |
| React 18 | Componentes de interfaz para la SPA (tienda, rastreo, admin) |
| React Router 6 | Navegación del lado del cliente en la SPA |
| Vite | Bundler y servidor de desarrollo para el frontend React |
| Node.js | Entorno de ejecución del servidor |
| Express | Framework HTTP y API REST |
| MongoDB | Base de datos NoSQL |
| Mongoose | ODM para modelado y validación de datos en MongoDB |
| JSON Web Tokens | Autenticación y autorización de administradores |
| bcryptjs | Encriptación de contraseñas |
| dotenv | Gestión de variables de entorno |
| nodemon | Recarga automática del servidor en desarrollo |
| Google Fonts | Tipografías: Bebas Neue, Barlow Condensed, Inter |
| GitHub Pages | Despliegue del frontend estático |
| Formspree | Procesamiento externo del formulario de contacto |

---

## Autores

- Esteban Varela
- Julian Martinez
- Sebastian Torres Agudelo

2026 — STRNG. Hecho para los que no se rinden.
