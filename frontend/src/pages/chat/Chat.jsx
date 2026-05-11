import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { getHistorialChat } from '../../api/chatApi';
import { useAuth } from '../../context/AuthContext.jsx';
import './Chat.css';
import { useNavigate } from 'react-router-dom';

// Conexión al servidor Node.js de chat
const socket = io('http://localhost:3000');

const Chat = () => {
    const { nombre } = useAuth();
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(true);
    const mensajesEndRef = useRef(null);
    const navigate = useNavigate();

    // Obtiene el email del token JWT (lo decodificamos)
    const getEmail = () => {
        const auth = sessionStorage.getItem('auth');
        if (!auth) return null;
        try {
            const { token } = JSON.parse(auth);
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub; // Spring Boot guarda el email en 'sub'
        } catch {
            return null;
        }
    };

    const email = getEmail();

    // Redirige a login si no está logueado
    useEffect(() => {
        const auth = sessionStorage.getItem('auth');
        if (!auth) navigate('/login');
    }, []);

    // Al montar: cargamos historial y nos identificamos en Socket.IO
    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                const data = await getHistorialChat();
                setMensajes(data);
            } catch (err) {
                console.error('Error al cargar historial:', err);
            } finally {
                setLoading(false);
            }
        };

        cargarHistorial();

        // Nos identificamos en el servidor Node.js
        socket.emit('identificarse', { email, esAdmin: false });

        // Escuchamos mensajes nuevos del admin en tiempo real
        socket.on('nuevoMensajeAdmin', (mensaje) => {
            setMensajes(prev => [...prev, mensaje]);
        });

        // Confirmación de que nuestro mensaje se guardó — evitamos duplicados
        socket.on('mensajeConfirmado', (mensaje) => {
            setMensajes(prev => {
                if (prev.find(m => m.id === mensaje.id)) return prev;
                return [...prev, mensaje];
            });
        });

        // El admin leyó los mensajes — actualizamos todos los ticks a azul
        socket.on('mensajesLeidos', () => {
            setMensajes(prev => prev.map(m => ({ ...m, leido: true })));
        });

        // Error al enviar mensaje
        socket.on('errorMensaje', ({ error }) => {
            alert(error);
        });

        return () => {
            socket.off('nuevoMensajeAdmin');
            socket.off('mensajeConfirmado');
            socket.off('mensajesLeidos');
            socket.off('errorMensaje');
        };
    }, [email]);

    // Scroll automático al último mensaje
    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    const handleEnviar = (e) => {
        e.preventDefault();
        if (!texto.trim()) return;

        // Enviamos el mensaje al servidor Node.js por Socket.IO
        socket.emit('mensajeUsuario', { email, texto: texto.trim() });
        setTexto('');
    };

    if (loading) return <div className="chat-loading">Cargando chat...</div>;

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1 className="chat-titulo">Ayuda</h1>
                <p className="chat-subtitulo">¿Tienes alguna duda? Escríbenos y un administrador te responderá.</p>
            </div>

            <div className="chat-mensajes">
                {mensajes.length === 0 && (
                    <p className="chat-vacio">Aún no hay mensajes. ¡Escribe tu primera duda!</p>
                )}

                {mensajes.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-mensaje ${msg.esAdmin ? 'chat-mensaje-admin' : 'chat-mensaje-usuario'}`}
                    >
                        <span className="chat-mensaje-autor">
                            {msg.esAdmin && (
                                <i
                                    className="fa-solid fa-user-tie"
                                    style={{ marginRight: '5px' }}
                                ></i>
                            )}

                            {msg.esAdmin ? 'StreamFlix' : nombre || email}
                        </span>
                        
                        <p className="chat-mensaje-texto">{msg.texto}</p>


                        {/* Footer con fecha y ticks — solo en mensajes del usuario */}
                        <div className="chat-mensaje-footer">
                            <span className="chat-mensaje-fecha">
                                {new Date(msg.fechaEnvio).toLocaleString('es-ES', {
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                            {!msg.esAdmin && (
                                <span className={`chat-ticks ${msg.leido ? 'chat-ticks-leido' : 'chat-ticks-noLeido'}`}>
                                    ✓✓
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={mensajesEndRef} />
            </div>

            <form className="chat-form" onSubmit={handleEnviar}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Escribe tu mensaje..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <button type="submit" className="chat-btn-enviar" disabled={!texto.trim()}>
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default Chat;