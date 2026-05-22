<img width="130" height="auto" alt="logo" align="left" src="https://github.com/user-attachments/assets/91b79a52-9ed4-47c0-872a-79be89afeeff" />

# StreamFlix – Videoclub Online.

Desarrollo de una aplicación web full stack para un videoclub online.

## Autores

- Julián Francisco García Sogo
- Víctor Yuste González
- Sara Ruiz Núñez

## Año académico

2025-2026

## Ciclo y centro

CFGS Desarrollo de Aplicaciones Web (DAW)  
IES Alonso de Avellaneda

## **1) INTRODUCCIÓN Y JUSTIFICACIÓN**

Nuestro proyecto StreamFlixs es una aplicación web para un videoclub online. La finalidad principal es que los usuarios puedan alquilar películas por un tiempo limitado y dejar valoraciones sobre lo que han visto.

Aparte, la aplicación tiene un dashboard de administración donde solo los administradores podrán gestionar la página desde distintas secciones.

Escogimos hacer este tipo de aplicación porque nos pareció que algo así podría abarcar todo lo aprendido en distintos módulos. Principalmente practicando a usar tecnologías como React junto con Spring Boot en un mismo proyecto.

## **2) ANÁLISIS Y DISEÑO DEL PROYECTO**

### **2.1) DESCRIPCIÓN DE LA ARQUITECTURA WEB**

La arquitectura que tiene es cliente-servidor, usando una API REST para comunicar frontend con backend, y para hacer las peticiones desde React hemos usado Axios. El usuario interactúa con la aplicación con la interfaz que muestra el frontend y, el backend se encarga de la lógica de negocio, seguridad y acceso a los datos.

### **2.2) TECNOLOGÍAS Y HERRAMIENTAS UTILIZADAS**

Cada miembro del grupo hemos usado nuestro IDE preferente: Visual Studio Code e IntelliJ IDEA. Para pruebas de API se ha usasdo Postman.

En el frontend es una SPA programada con React con Vite y JavaScript para crear la interfaz dinámica. También usamos estilos CSS para el diseño visual y React Router para la navegación entre páginas.

En el backend se usa Java con Sping Boot, usando Spring Security con JWT para el control de acceso y proteger la aplicación.

Además hemos incluido un microservidor en Node.js con Socket.IO para crear un chat en tiempo real entre usuario y administrador cuando el usuario tenga alguna duda de la aplicación. También hemos añadido reCAPTCHA de Google en el formulario de registro para prevenir registros automáticos y mejorar la seguridad frente a bots.

En cuanto al almacenamiento, hemos usado distintas bases de datos. MySQL para guardar la información de datos de negocio como los usuarios registrados, las películas, alquileres realizados, etc. Mientras que usamos MongoDB con GridFS para almacenar los archivos multimedia.

También hemos integrado la API de TMDB para completar la información de detalles de las películas que el administrador añade al catálogo.

Finalmente, para organizar y juntar las funcionalidades que cada miembro del grupo hacía se usó GitHub, cada miembro teniendo su propia rama aparte de la rama principal para el trabajo conjunto.

### **2.3) ANÁLISIS DE USUARIOS**

La aplicación tiene dos tipos de usuarios. Uno es el usuario normal que puede registrarse y alquilar la películas; y el otro es el administrador, con privilegios de gestiónes como añadir películas al catálogo y consultar estadísticas entre otras cosas.

### **2.4) DEFINICIÓN DE REQUISITOS FUNCIONALES Y NO FUNCIONALES**

Para los requisitos funcionales, la aplicación debe mostrar un catálogo y permitir a cualquiera registrarse e iniciar sesión de forma segura.

A los usuarios registrados mostrarles un catálogo de películas con opciones para alquilar por tiempo limitado y, permitir añadirlas a sus favoritos, además de permitirles hacer una valoración sobre el contenido que visualicen.

Para los administradores también debe permitir añadir o borrar películas, además de las consultas desde su panel de administración.

Para los requisitos no funcionales, la aplicación debe ser segura y fácil de usar a la vez que adaptable para distintos tamaños de dispositivos.

### **2.5) ESTRUCTURA DE NAVEGACIÓN**

```text
/                     Público      Landing con las películas
|---- /login          Público      Formulario de acceso
|---- /register       Público      Formulario con reCAPTCHA
|
|---- /catalogo       USER/ADMIN   Grid paginado con filtros y buscador
|---- /pelicula/:id   USER/ADMIN   Detalles de peli, valoraciones, alquilar, reproducir
|---- /mis-alquileres USER         Alquileres activos
|---- /favoritos      USER         Lista de películas en favoritos
|
|---- /admin          ADMIN        Dashboard con panel de gestiones
```

Las rutas de usuario autenticado están protegidas mediante el componente ProtectedRoute, que redirige al login si no hay token válido. Las rutas de administración usan además AdminRoute, que verifica que el rol del token sea de administrador.

### **2.6) ORGANIZACIÓN DE LA LÓGICA DE NEGOCIO**

La estructura lógica del backend se organiza primero con controladores que reciben las peticiones HTTP. Cada entidad principal tiene su propio controlador. Luego están los servicios donde va lógica de negocio con operaciones, validaciones, gestiones transaccionales y preparan los datos que van a ser guardados.
La capa de persistencia está en los repositorios que solo se ocupan de la interacción con las bases de datos para el acceso a datos.
La seguridad en security genera y valida tokens. JwtFilter intercepta cada petición y carga el contexto de seguridad de Spring.

La aplicación se conecta con servicios externos que enriquecen su funcionalidad. Usamos el servicio TmdbService como adaptador hacia la API pública de TMDB. Entonces, cuando un administrador busque una película, el servicio le consulta a TMDB para autocompletar los detalles de la película.

### **2.7) MODLEO DE DATOS SIMPLIFICADO**

La base de datos relacional MySQL gestiona toda la información estructurada del negocio:  
-usuarios: almacena los datos de cada cuenta registrada.  
-peliculas: catálogo de contenido disponible para alquiler.  
-alquileres: registra cada transacción de alquiler.  
-favoritos: guarda los favoritos del usuario.  
-mensajes_chat: guarda el historial de mensajes de usuarios y administradores.  
-valoraciones: guarda las reseñas de los usuarios sobre las películas.

Las relaciones entre tablas son: un usuario puede tener muchos alquileres y muchas valoraciones; una película puede aparecer en muchos alquileres y recibir muchas valoraciones.

La base de datos MongoDB con GridFS, para dividir los archivos en chunks y almacenar los metadatos en colecciones automáticas, en vez de cargar los archivos completos en memoria.

Se utiliza una colección adicional mediaMetadata con información extendida de cada archivo.

## **3) CONCLUSIONES**

Se han cumplido los objetivos propuestos en el anteproyecto y además se llegaron a añadir funcionalidades extras como el chat, y más seguridad con el añadido del reCAPTCHA en el registro. También se usó la API pública de TMDB que descubrimos más tarde.

Uno de los retos que nos encontramos fue la implementación de dos bases de datos en un mismo proyecto. Lo arreglamos añadiendo un servicio expclusivo para comunicarse con MongoDB para guardar y recuperar los archivos binarios.

Otro reto fue cómo gestionar el estado de autenticación en el frontend. Al final optamos por almacenar el JWT en React Context con AuthContext y con Axios para no almacenarlo en el localStorage.

La coordinación entre nosotros nos dio alguna que otra complicación sobre todo al principio. Esto ocurría al tener conflictos en los archivos a la hora de hacer más de uno los Pull Requests a la rama principal. Se solucionó con el tiempo aprendiendo a manejar GitHub, ya que el problema era la inexperiencia en el uso de esta plataforma.

Como mejoras futuras se podría tener en cuenta un sistema de pagos real integrado (como Stripe que vimos durante el curso).Tambiénel envío de notificaciones por email al alquilar, recibir un mensaje por chat… Y podríamos pensar también en un sistema de caché para reducir las llamadas a la API de TMDB.

El desarrollo se organizó siguiendo un esquema Kanban gestionado desde GitHub Projects. Cada uno trabajaba en su rama individual y se fusionaba a develop mediante Pull Request cuando una funcionalidad estaba terminada y probada. Y el diseño de las pantallas de la app fue planificado en tablero digital en la aplicación Miro.

## **4) BIBLIOGRAFÍA Y FUENTES DE INFORMACIÓN**

**Documentación usada:**  
React: [https://react.dev](https://react.dev)  
Spring Boot: [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)  
MongoDB GridFS: [https://www.mongodb.com/docs/manual/core/gridfs/](https://www.mongodb.com/docs/manual/core/gridfs/)  
Socket.io: [https://socket.io/es/docs/v4/how-it-works/](https://socket.io/es/docs/v4/how-it-works/)  

**IA usadas:**  
Claude: [https://claude.ai/](https://claude.ai/)  
ChatGPT: [https://chatgpt.com/](https://chatgpt.com/)  
Copilot: [https://copilot.microsoft.com/](https://copilot.microsoft.com/)  

## **5) ANEXOS**

### **Guía de instalación y configuración**

Hay que tener el proyecto abierto desde la raíz en una misma ventana del IDE y añadir el .env en la raíz del proyecto.

<img width="300" height="auto" alt="image" src="https://github.com/user-attachments/assets/580a4f1a-b94c-4a57-8670-8152ce0cc666" />


El backend tiene que ser arrancado desde la raíz del proyecto, no desde la carpeta /backend.

<img width="500" height="auto" alt="image" src="https://github.com/user-attachments/assets/73a494ff-e3e2-4603-8568-39d2406688ff" />


Para que el chat en tiempo real funcione hay que arrancar el servidor Node.js, en la carpeta /chat-server (npm run dev   o   node server.js).

<img width="780" height="102" alt="image" src="https://github.com/user-attachments/assets/902a6b68-fbe5-42ba-b190-c03feaae3bed" />


Luego ya hay que arrancar el frontend (npm run dev).  
(Puede que tengáis que hacer un npm install primero)

<img width="600" height="auto" alt="image" src="https://github.com/user-attachments/assets/7cf0f437-20da-4962-9840-0ed7db649b12" />
