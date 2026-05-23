const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const httpServer = createServer(app);

// URL del backend Spring Boot
const SPRING_BOOT_URL = 'http://localhost:8080';

// Configuración de Socket.IO con CORS para el frontend React
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173', // puerto del frontend
        methods: ['GET', 'POST']
    }
});

// Mapa para guardar qué socket pertenece a qué usuario
// let socketAdmin=null; -----solo había un admin a la vez

// clave: email, valor: socketId
const usuariosConectados = new Map();

// Mapa para guardar todos los admins conectados
// clave: socketId, valor: socket
const adminsConectados = new Map();

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    socket.on('identificarse', (data) => {
        const { email, esAdmin } = data;

        if (esAdmin) {
            // Añadimos el admin a la agenda en lugar de sobreescribir
            adminsConectados.set(socket.id, socket);
            console.log('Admin conectado:', socket.id, '— Total admins:', adminsConectados.size);
        } else {
            // user normal
            usuariosConectados.set(email, socket.id);
            console.log('Usuario conectado:', email, socket.id);
        }
    });

    // --- user manda un mensaje
    socket.on('mensajeUsuario', async (data) => {
        const { email, texto } = data;
        console.log('Mensaje de usuario:', email, texto);

        try {
            // 1. Guardamos el mensaje en H2 a través de Spring Boot
            const response = await axios.post(`${SPRING_BOOT_URL}/api/chat/mensaje`, {
                email,
                texto
            });

            const mensajeGuardado = response.data;

            // 2. Mandamos el mensaje a TODOS los admins conectados
            adminsConectados.forEach(adminSocket => {
                adminSocket.emit('nuevoMensajeUsuario', mensajeGuardado);
            });

            // 3. Confirmamos al usuario que el mensaje se guardó
            socket.emit('mensajeConfirmado', mensajeGuardado);

        } catch (error) {
            console.error('Error al guardar mensaje en Spring Boot:', error.message);
            socket.emit('errorMensaje', { error: 'No se pudo enviar el mensaje' });
        }
    });

    // --- admin responde a un usuario
    socket.on('respuestaAdmin', async (data) => {
        const { emailUsuario, texto } = data;
        console.log('Respuesta del admin a:', emailUsuario, texto);

        try {
            // 1. Guardamos la respuesta en H2 a través de Spring Boot
            const response = await axios.post(`${SPRING_BOOT_URL}/api/chat/respuesta`, {
                emailUsuario,
                texto
            });

            const mensajeGuardado = response.data;

            // 2. Si el usuario está conectado, le mandamos la respuesta en tiempo real
            const socketIdUsuario = usuariosConectados.get(emailUsuario);
            if (socketIdUsuario) {
                io.to(socketIdUsuario).emit('nuevoMensajeAdmin', mensajeGuardado);
            }

            // 3. Confirmamos a TODOS los admins que la respuesta se guardó
            adminsConectados.forEach(adminSocket => {
                adminSocket.emit('respuestaConfirmada', mensajeGuardado);
            });

        } catch (error) {
            console.error('Error al guardar respuesta en Spring Boot:', error.message);
            socket.emit('errorMensaje', { error: 'No se pudo enviar la respuesta' });
        }
    });

    // ---admin abre una conversación y la marca como leída
    // Notificamos al usuario para que actualice sus ticks a azul
    socket.on('conversacionLeida', (data) => {
        const { emailUsuario } = data;
        console.log('Admin leyó conversación de:', emailUsuario);

        const socketIdUsuario = usuariosConectados.get(emailUsuario);
        if (socketIdUsuario) {
            io.to(socketIdUsuario).emit('mensajesLeidos');
        }
    });

        socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);

        // Si era un admin, lo eliminamos de la agenda
        if (adminsConectados.has(socket.id)) {
            adminsConectados.delete(socket.id);
            console.log('Admin desconectado:', socket.id, '— Total admins:', adminsConectados.size);
        }

        // Si era un user, lo eliminamos del mapa
        for (const [email, socketId] of usuariosConectados.entries()) {
            if (socketId === socket.id) {
                usuariosConectados.delete(email);
                console.log('Usuario desconectado:', email);
                break;
            }
        }
    });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor de chat corriendo en http://localhost:${PORT}`);
});