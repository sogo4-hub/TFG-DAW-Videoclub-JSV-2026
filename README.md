<img width="130" height="auto" alt="logo" align="left" src="https://github.com/user-attachments/assets/91b79a52-9ed4-47c0-872a-79be89afeeff" />

# StreamFlix – Videoclub Online

Desarrollo de una aplicación web full stack para la gestión de un videoclub online.

## Autores

- Julián Francisco García Sogo
- Víctor Yuste González
- Sara Ruiz Núñez

## Año académico

2025-2026

## Ciclo y centro

CFGS Desarrollo de Aplicaciones Web (DAW)  
IES Alonso de Avellaneda

---

## **1) INTRODUCCIÓN Y JUSTIFICACIÓN**

StreamFlix es una aplicación web full stack orientada a la gestión de un videoclub online. La finalidad principal del proyecto es permitir que los usuarios puedan consultar un catálogo de películas, registrarse, iniciar sesión, alquilar películas durante un periodo limitado, añadirlas a favoritos, reproducir contenido multimedia y dejar valoraciones sobre las películas visualizadas.

Además, la aplicación incorpora un panel de administración desde el que los usuarios con rol de administrador pueden gestionar el catálogo, importar películas desde TMDB, subir archivos de vídeo, eliminar películas y consultar información relevante del sistema.

La elección de este proyecto se debe a que permite integrar gran parte de los contenidos trabajados durante el ciclo de Desarrollo de Aplicaciones Web: desarrollo frontend, backend, bases de datos, seguridad, consumo de APIs externas, gestión de archivos multimedia, control de versiones y despliegue local de una aplicación completa.

---

## **2) ANÁLISIS Y DISEÑO DEL PROYECTO**

### **2.1) DESCRIPCIÓN DE LA ARQUITECTURA WEB**

La arquitectura del proyecto sigue un modelo cliente-servidor, con separación clara entre frontend, backend y persistencia de datos.

El frontend está desarrollado con React y Vite, y es el encargado de mostrar la interfaz de usuario, gestionar la navegación y realizar peticiones HTTP al backend mediante Axios.

El backend está desarrollado con Java y Spring Boot. Expone una API REST que centraliza la lógica de negocio, la seguridad, la autenticación, la gestión de usuarios, el catálogo de películas, los alquileres, los favoritos, las valoraciones y la comunicación con servicios externos como TMDB y MongoDB Atlas.

La aplicación utiliza una base de datos relacional H2 para almacenar los datos estructurados del sistema, como usuarios, películas, alquileres, favoritos, mensajes y valoraciones. Para los archivos multimedia de vídeo se utiliza MongoDB Atlas con GridFS, lo que permite almacenar archivos grandes dividiéndolos en fragmentos o chunks.

De forma simplificada, la arquitectura es:

```text
Usuario / Navegador
        |
        v
Frontend React + Vite
        |
        v
Backend Spring Boot REST API
        |
        +------------------------------+
        |                              |
        v                              v
Base de datos relacional H2       MongoDB Atlas + GridFS
(datos de negocio)                (archivos multimedia)
        |
        v
API externa TMDB
(metadatos de películas)
```

---

### **2.2) TECNOLOGÍAS Y HERRAMIENTAS UTILIZADAS**

Para el desarrollo del proyecto se han utilizado distintas tecnologías y herramientas.

En el frontend se ha desarrollado una SPA con React, Vite y JavaScript. React permite crear una interfaz dinámica basada en componentes reutilizables, mientras que Vite facilita un entorno de desarrollo rápido. También se han utilizado CSS, React Router para la navegación entre páginas y Axios para realizar peticiones HTTP al backend.

En el backend se ha utilizado Java con Spring Boot. Spring Boot permite construir una API REST de forma organizada, separando controladores, servicios, repositorios y entidades. Para la seguridad se ha utilizado Spring Security junto con JWT, lo que permite proteger rutas y diferenciar entre usuarios normales y administradores.

También se ha incluido un microservidor en Node.js con Socket.IO para ofrecer un chat en tiempo real entre usuarios y administradores. Esta funcionalidad permite añadir comunicación directa dentro de la aplicación.

En el formulario de registro se ha integrado reCAPTCHA de Google para reducir registros automáticos y mejorar la seguridad frente a bots.

En cuanto al almacenamiento, se utiliza H2 como base de datos relacional durante el desarrollo. Esta base almacena la información de negocio: usuarios, películas, alquileres, favoritos, valoraciones y mensajes del chat. Para los vídeos se utiliza MongoDB Atlas con GridFS, ya que permite almacenar archivos grandes de forma más adecuada que una base de datos relacional.

Además, se ha integrado la API de TMDB para obtener información enriquecida de las películas, como título, sinopsis, cartel, imagen de fondo, año, géneros, director y valoración media.

Para la organización del trabajo se ha usado GitHub, con ramas individuales y Pull Requests hacia la rama `develop`. También se ha utilizado GitHub Projects como tablero Kanban para organizar las tareas del equipo.

Herramientas utilizadas:

- Visual Studio Code.
- IntelliJ IDEA.
- Git y GitHub.
- GitHub Projects.
- Postman / peticiones HTTP de prueba.
- H2 Console.
- MongoDB Atlas.
- MongoDB Compass.
- Miro para la planificación visual de pantallas.
- ChatGPT, Claude y Copilot como apoyo durante el desarrollo.

---

### **2.3) ANÁLISIS DE USUARIOS**

La aplicación contempla dos tipos principales de usuario:

#### Usuario registrado

El usuario registrado puede:

- Iniciar sesión.
- Consultar el catálogo de películas.
- Buscar y filtrar películas.
- Ver el detalle de una película.
- Añadir películas a favoritos.
- Alquilar películas.
- Consultar sus alquileres activos.
- Reproducir películas alquiladas.
- Escribir valoraciones.
- Utilizar el chat para comunicarse con administración.

#### Administrador

El administrador tiene permisos ampliados y puede:

- Acceder al panel de administración.
- Buscar películas en TMDB.
- Importar películas al catálogo local.
- Subir archivos de vídeo.
- Eliminar películas.
- Gestionar elementos del catálogo.
- Consultar información del sistema.
- Atender mensajes del chat.

---

### **2.4) DEFINICIÓN DE REQUISITOS FUNCIONALES Y NO FUNCIONALES**

#### Requisitos funcionales

La aplicación debe permitir:

- Visualizar un catálogo de películas.
- Registrar nuevos usuarios.
- Iniciar sesión de forma segura.
- Diferenciar entre usuarios normales y administradores.
- Mostrar detalles de cada película.
- Añadir películas a favoritos.
- Alquilar películas por tiempo limitado.
- Reproducir películas disponibles.
- Permitir valoraciones de películas.
- Importar películas desde la API de TMDB.
- Subir vídeos asociados a películas.
- Eliminar películas del catálogo.
- Mantener comunicación mediante chat en tiempo real.
- Proteger rutas según autenticación y rol.

#### Requisitos no funcionales

La aplicación debe cumplir los siguientes aspectos:

- Seguridad mediante JWT y control de roles.
- Interfaz clara y fácil de usar.
- Separación entre frontend, backend y persistencia.
- Código organizado por capas.
- Uso de variables de entorno para claves y datos sensibles.
- Diseño adaptable a distintos tamaños de pantalla.
- Persistencia de datos relacionales y multimedia.
- Integración con servicios externos.
- Control de errores básico y mensajes comprensibles para el usuario.

---

### **2.5) ESTRUCTURA DE NAVEGACIÓN**

```text
/                     Público      Landing con películas destacadas
|---- /login          Público      Formulario de acceso
|---- /register       Público      Formulario de registro con reCAPTCHA
|
|---- /catalogo       USER/ADMIN   Catálogo paginado con filtros y buscador
|---- /pelicula/:id   USER/ADMIN   Detalle de película, alquiler, valoración y reproducción
|---- /mis-alquileres USER         Alquileres activos del usuario
|---- /favoritos      USER         Lista de películas favoritas
|
|---- /admin          ADMIN        Dashboard con panel de gestión
```

Las rutas de usuario autenticado están protegidas mediante `ProtectedRoute`, que redirige al login si no existe un token válido. Las rutas de administración usan además `AdminRoute`, que comprueba que el usuario autenticado tenga rol de administrador.

---

### **2.6) ORGANIZACIÓN DE LA LÓGICA DE NEGOCIO**

La lógica del backend se organiza por capas:

```text
Controller → Service → Repository → Base de datos
```

Los controladores reciben las peticiones HTTP y devuelven respuestas REST. Cada entidad o bloque funcional dispone de sus propios controladores, por ejemplo autenticación, películas, alquileres, favoritos o multimedia.

Los servicios contienen la lógica de negocio. En esta capa se realizan validaciones, operaciones transaccionales, llamadas a servicios externos y preparación de datos antes de guardarlos o devolverlos al frontend.

Los repositorios se encargan del acceso a datos mediante Spring Data JPA, permitiendo consultar y modificar la información almacenada en la base de datos relacional.

La seguridad se organiza en el paquete `security`. El sistema genera y valida tokens JWT. El filtro `JwtFilter` intercepta las peticiones, valida el token recibido y carga el contexto de seguridad de Spring.

La aplicación también se comunica con servicios externos. `TmdbService` actúa como adaptador hacia la API pública de TMDB. Cuando un administrador busca o importa una película, el backend consulta TMDB y transforma los datos recibidos en entidades propias de la aplicación.

Para la gestión multimedia, `MediaService` se encarga de comunicarse con MongoDB Atlas mediante GridFS. Este servicio permite subir, recuperar y eliminar archivos binarios asociados a las películas.

Frontend React + Vite
    |
    |  Peticiones HTTP mediante Axios
    |  - Login / registro
    |  - Catálogo
    |  - Favoritos
    |  - Alquileres
    |  - Administración
    |  - Subida de vídeos
    v
Backend Spring Boot REST API
    |
    +------------------------------------------------------+
    |                                                      |
    v                                                      v
Security                                            Controllers
Spring Security + JWT                              Capa de entrada REST
    |                                                      |
    |                                                      |
    |  JwtFilter intercepta cada petición                  |
    |  Valida token JWT                                    |
    |  Comprueba usuario y rol                             |
    |  Carga el contexto de seguridad                      |
    |                                                      |
    +--------------------------->--------------------------+
                               |
                               v
                         Controllers
                         Reciben peticiones HTTP
                         y devuelven respuestas JSON
                               |
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
 AuthController          PeliculaController      Otros controladores
 Login / registro        Catálogo / TMDB         Favoritos, alquileres,
 JWT / reCAPTCHA         vídeos / borrado        chat, usuarios, etc.
        |                      |                      |
        +----------------------+----------------------+
                               |
                               v
                           Services
                     Capa de lógica de negocio
                               |
        +----------------------+-----------------------------+
        |                      |                             |
        v                      v                             v
 AuthService             PeliculaService              MediaService
 Registro/login          Gestión catálogo             Gestión multimedia
 Validaciones            Importar desde TMDB          MongoDB + GridFS
 JWT                     Borrar películas             Subir vídeos
 reCAPTCHA               Subir vídeo asociado         Recuperar archivos
                         Control de duplicados        Eliminar archivos
        |                      |                             |
        |                      v                             v
        |                 TmdbService                 MongoDB Atlas
        |                 Adaptador API externa       GridFS
        |                      |                      fs.files / fs.chunks
        |                      v
        |                 API externa TMDB
        |                 Metadatos películas
        |
        v
   Repositories
   Spring Data JPA
        |
        v
Base de datos relacional H2
Datos estructurados de negocio
    |
    +------------------------------------------------------+
    |                                                      |
    v                                                      v
USUARIOS                                             PELICULAS
Credenciales, roles                                 Catálogo local
datos de cuenta                                     datos TMDB
                                                    urlVideo
    |
    +------------------------------------------------------+
    |                                                      |
    v                                                      v
ALQUILERES                                          FAVORITOS
Películas alquiladas                                Relación usuario-película
por cada usuario

MENSAJES_CHAT
Historial de mensajes
entre usuario y administrador

---

### **2.7) MODELO DE DATOS SIMPLIFICADO**

La base de datos relacional H2 gestiona la información estructurada del negocio:

- `usuarios`: almacena los datos de las cuentas registradas.
- `peliculas`: contiene el catálogo de películas disponible.
- `alquileres`: registra los alquileres realizados por los usuarios.
- `favoritos`: almacena las películas favoritas de cada usuario.
- `mensajes_chat`: guarda mensajes intercambiados entre usuarios y administradores.
- `valoraciones`: almacena reseñas o puntuaciones de usuarios sobre películas, si está disponible en la versión final.

Relaciones principales:

- Un usuario puede tener muchos alquileres.
- Un usuario puede tener muchas películas favoritas.
- Una película puede aparecer en muchos alquileres.
- Una película puede estar en favoritos de muchos usuarios.
- Un usuario puede enviar varios mensajes de chat.
- Una película puede recibir varias valoraciones.

MongoDB Atlas con GridFS se utiliza para guardar los archivos multimedia. GridFS divide los vídeos en fragmentos y almacena los metadatos y los chunks en colecciones internas, evitando cargar archivos grandes directamente en memoria.

Colecciones principales de GridFS:

```text
fs.files
fs.chunks
```

El campo `urlVideo` de cada película guarda la ruta interna de streaming generada por el backend, por ejemplo:

```text
/api/media/stream/{idMongo}
```

---

## **3) CONCLUSIONES**

El desarrollo de StreamFlix ha permitido crear una aplicación web completa integrando frontend, backend, base de datos relacional, almacenamiento multimedia y servicios externos. Durante el proyecto se han aplicado muchos de los conocimientos trabajados durante el ciclo de Desarrollo de Aplicaciones Web, especialmente en el desarrollo de una aplicación full stack con React, Spring Boot, seguridad, bases de datos, consumo de APIs externas y control de versiones.

Se han cumplido los objetivos principales planteados en el anteproyecto: creación de un catálogo de películas, autenticación de usuarios, gestión de roles, alquiler de películas, favoritos, reproducción de contenido multimedia y administración del catálogo desde un panel específico para usuarios administradores.

Además, se han incorporado funcionalidades adicionales que aportan más valor a la aplicación, como el chat en tiempo real entre usuarios y administradores, el uso de reCAPTCHA en el formulario de registro para mejorar la seguridad frente a bots y la integración con la API pública de TMDB, que permite enriquecer automáticamente la información de las películas con datos como título, sinopsis, cartel, imagen de fondo, año, géneros, director y valoración media.

Uno de los principales retos técnicos fue trabajar con dos sistemas de almacenamiento distintos dentro de un mismo proyecto. Por un lado, se utiliza H2 como base de datos relacional para almacenar los datos estructurados de negocio, como usuarios, películas, alquileres y favoritos. Por otro lado, se utiliza MongoDB con GridFS para almacenar los archivos multimedia, especialmente los vídeos. Para resolver esta integración, se desarrolló un servicio específico encargado de comunicarse con MongoDB, permitiendo guardar, recuperar y eliminar archivos binarios de forma separada a los datos relacionales.

Otro reto importante fue mantener la coherencia entre H2 y MongoDB. Por ejemplo, al eliminar una película del catálogo, no bastaba con borrar el registro de la base de datos relacional, ya que también era necesario eliminar el vídeo asociado en GridFS para evitar que quedaran archivos huérfanos en MongoDB. Esta situación se resolvió actualizando la lógica de borrado para eliminar tanto el registro relacional como los recursos multimedia asociados.

También supuso un reto la gestión del estado de autenticación en el frontend. Finalmente, se optó por centralizar el estado del usuario mediante `AuthContext` y utilizar Axios para enviar el token JWT en las peticiones protegidas. De esta forma, el frontend puede controlar qué partes de la aplicación debe mostrar según el usuario autenticado y su rol.

La coordinación del equipo también fue un aprendizaje relevante. Al principio surgieron algunas complicaciones, sobre todo por conflictos al trabajar con ramas y Pull Requests hacia la rama común del proyecto. Estos problemas se fueron solucionando a medida que el equipo ganó experiencia con GitHub, aprendiendo a organizar mejor el trabajo, revisar cambios y fusionar funcionalidades de forma más controlada.

El desarrollo se organizó siguiendo un esquema Kanban gestionado desde GitHub Projects. Cada miembro trabajaba en su propia rama individual y, cuando una funcionalidad estaba terminada y probada, se fusionaba a la rama `develop` mediante Pull Request. Además, el diseño y planificación de algunas pantallas de la aplicación se apoyó en un tablero digital en Miro.

Como mejoras futuras se podrían incorporar:

- Pasarela de pago real, por ejemplo Stripe.
- Notificaciones por email.
- Sistema avanzado de recomendaciones.
- Caché para reducir llamadas a TMDB.
- Migración de H2 a MySQL o MariaDB para un entorno más cercano a producción.
- Documentación Swagger/OpenAPI.
- Más pruebas automatizadas.
- Despliegue con Docker Compose.
- Mejora del panel de administración.

En conclusión, StreamFlix ha sido un proyecto útil para consolidar conocimientos técnicos y organizativos, ya que ha permitido desarrollar una aplicación web completa, trabajar en equipo, resolver problemas reales de integración y aplicar una arquitectura cercana a la de una aplicación profesional.

## **4) BIBLIOGRAFÍA Y FUENTES DE INFORMACIÓN**

**Documentación usada:**

- React: [https://react.dev](https://react.dev)
- Vite: [https://vite.dev](https://vite.dev)
- Spring Boot: [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
- Spring Security: [https://spring.io/projects/spring-security](https://spring.io/projects/spring-security)
- MongoDB GridFS: [https://www.mongodb.com/docs/manual/core/gridfs/](https://www.mongodb.com/docs/manual/core/gridfs/)
- Socket.IO: [https://socket.io/es/docs/v4/how-it-works/](https://socket.io/es/docs/v4/how-it-works/)
- TMDB API: [https://developer.themoviedb.org/docs](https://developer.themoviedb.org/docs)

**IA usadas como apoyo:**

- Claude: [https://claude.ai/](https://claude.ai/)
- ChatGPT: [https://chatgpt.com/](https://chatgpt.com/)
- Gemini: [https://gemini.google.com/](https://gemini.google.com/)
- GitHub Copilot: [https://github.com/features/copilot](https://github.com/features/copilot)
- Microsoft Copilot: [https://copilot.microsoft.com/](https://copilot.microsoft.com/)

---

## **5) ANEXOS**

Para ejecutar el proyecto en local es necesario tener instalados:

- Java 21.
- Node.js y npm.
- Git.
- Acceso a MongoDB Atlas.
- Archivo `.env` con las variables de entorno necesarias.

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
