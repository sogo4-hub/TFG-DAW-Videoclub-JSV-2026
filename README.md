# Para desplegar el proyecto:  

(en la memoria hay imágenes con estos pasos por si acaso)

1. Desplegar la aplicación en la misma ventana del IDE que uséis (sino, tendríais que quitar el ./backend en la url del properties)

2. Tenéis que añadir el .env con las claves que os pasemos en la raíz del proyecto

3. El backend de spring hay q arrancarlo desde la raíz, no desde /backend

4. Para que veáis el chat en tiempo real entre admin y user tenéis que arrancar el servidor node (server.js) de /chat-server  
|-----> npm run dev    o    node server.js  
|-----> en la app, el chat está en el enlace del home

5. Arrancar el frontend (npm run dev)  
   (puede que tengáis que hacer un npm run dev antes)



```text
----------------------------- usuarios de prueba ----------------------------------

       NOMBRE  	                 EMAIL                    CONTRASEÑITAS

   Admin Principal	        nuevo_admin@streamflix.es           admin123
   Víctor Gestión	        segundo_admin@streamflix.es         admin123
   Estudiante TFG	        estudiante_tfg@streamflix.es        password123
   Usuario de Pruebas	    intento_hacker@streamflix.es        password123
```
