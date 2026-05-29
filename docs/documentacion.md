# Documentación del Proyecto

## 1. Propósito y ventajas de la estructura utilizada

La estructura del proyecto fue organizada siguiendo una separación clara de responsabilidades, distribuyendo los archivos según su función dentro del desarrollo web. Se establecieron carpetas específicas para los distintos tipos de recursos:

- **index.html** como punto de entrada principal del sitio.
- **css/** para los archivos de estilos.
- **js/** para la lógica y el comportamiento del sitio.
- **assets/** para recursos estáticos como imágenes, íconos y tipografías.
- **pages/** para las páginas secundarias.
- **docs/** para la documentación y el diagrama estructural.

El propósito de esta organización es mantener el proyecto ordenado, modular y escalable. Separar los archivos según su función permite:

- Facilitar el mantenimiento y la actualización del código.
- Mejorar la comprensión del proyecto por parte del equipo.
- Reducir errores al trabajar de forma colaborativa.
- Permitir la reutilización de recursos.
- Escalar el proyecto agregando nuevas funcionalidades sin afectar la estructura base.

Esta forma de organización refleja prácticas comunes en proyectos web profesionales.

---

## 2. Importancia de la separación entre cliente y servidor en aplicaciones web

En las aplicaciones web modernas, es fundamental diferenciar entre el **cliente (frontend)** y el **servidor (backend)**.

El cliente corresponde a la parte visible e interactiva para el usuario, desarrollada principalmente con HTML, CSS y JavaScript. Su función es presentar la información, gestionar la interfaz y manejar la interacción del usuario.

El servidor, en cambio, se encarga de procesar datos, gestionar la lógica de negocio, almacenar información en bases de datos y garantizar la seguridad del sistema.

La separación entre cliente y servidor es importante porque:

- Mejora la seguridad, ya que la lógica sensible y los datos no se exponen al usuario.
- Permite una mayor escalabilidad del sistema.
- Facilita el mantenimiento y la actualización independiente de cada parte.
- Optimiza el rendimiento, distribuyendo responsabilidades.
- Favorece el trabajo colaborativo entre equipos de frontend y backend.

En conjunto, esta separación permite desarrollar aplicaciones web más organizadas, seguras y eficientes, siguiendo estándares utilizados en entornos profesionales.
