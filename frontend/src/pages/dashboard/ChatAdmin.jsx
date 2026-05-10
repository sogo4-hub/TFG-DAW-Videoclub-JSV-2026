import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axiosClient from '../../api/axiosClient';
import './ChatAdmin.css';

// Conexión al servidor Node.js de chat como admin
const socket = io('http://localhost:3000');

const ChatAdmin = () => {
    const [conversaciones, setConversaciones] = useState({});
    const [emailSeleccionado, setEmailSeleccionado] = useState(null);
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(true);
    const mensajesEndRef = useRef(null);

    // Ref para acceder al emailSeleccionado dentro de los eventos de Socket.IO
    // sin que quede "congelado" en el valor inicial
    const emailSeleccionadoRef = useRef(null);
    emailSeleccionadoRef.current = emailSeleccionado;

    // Al montar: cargamos todas las conversaciones y nos identificamos como admin
    useEffect(() => {
        const cargarConversaciones = async () => {
            try {
                const response = await axiosClient.get('/api/chat/conversaciones');
                setConversaciones(response.data);
                // const emails = Object.keys(response.data);
                // if (emails.length > 0) setEmailSeleccionado(emails[0]);
            } catch (err) {
                console.error('Error al cargar conversaciones:', err);
            } finally {
                setLoading(false);
            }
        };

        cargarConversaciones();

        // Nos identificamos como admin en el servidor Node.js
        socket.emit('identificarse', { email: 'admin', esAdmin: true });

        // Escuchamos mensajes nuevos de usuarios en tiempo real
        socket.on('nuevoMensajeUsuario', (mensaje) => {
            const emailUsuario = mensaje.emailUsuario;

            setConversaciones(prev => {
                const mensajesActualizados = [...(prev[emailUsuario] || []), mensaje];

                // Si el admin tiene esa conversación abierta, marcamos el mensaje como leído
                if (emailSeleccionadoRef.current === emailUsuario) {
                    const mensajeLeido = { ...mensaje, leido: true };
                    // Marcamos en BD y notificamos al usuario
                    axiosClient.patch(`/api/chat/leido/${emailUsuario}`).catch(console.error);
                    socket.emit('conversacionLeida', { emailUsuario });
                    return { ...prev, [emailUsuario]: [...(prev[emailUsuario] || []), mensajeLeido] };
                }

                return { ...prev, [emailUsuario]: mensajesActualizados };
            });
        });

        // Confirmación de que nuestra respuesta se guardó
        socket.on('respuestaConfirmada', (mensaje) => {
            const emailUsuario = mensaje.emailUsuario;
            setConversaciones(prev => ({
                ...prev,
                [emailUsuario]: [...(prev[emailUsuario] || []), mensaje]
            }));
        });

        return () => {
            socket.off('nuevoMensajeUsuario');
            socket.off('respuestaConfirmada');
        };
    }, []);

    // Scroll automático al último mensaje
    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [emailSeleccionado, conversaciones]);

    // Al seleccionar una conversación la marcamos como leída en BD y en estado local
    const handleSeleccionarConversacion = async (email) => {
        setEmailSeleccionado(email);
        try {
            await axiosClient.patch(`/api/chat/leido/${email}`);
            // Actualizamos el estado local para que el badge desaparezca
            setConversaciones(prev => ({
                ...prev,
                [email]: prev[email].map(m => ({ ...m, leido: true }))
            }));
            // Notificamos al usuario por Socket.IO para que actualice sus ticks
            socket.emit('conversacionLeida', { emailUsuario: email });
        } catch (err) {
            console.error('Error al marcar como leído:', err);
        }
    };

    const handleResponder = (e) => {
        e.preventDefault();
        if (!texto.trim() || !emailSeleccionado) return;

        // Enviamos la respuesta al servidor Node.js
        socket.emit('respuestaAdmin', {
            emailUsuario: emailSeleccionado,
            texto: texto.trim()
        });

        // Al responder, los mensajes ya están leídos — notificamos al usuario
        socket.emit('conversacionLeida', { emailUsuario: emailSeleccionado });

        setTexto('');
    };

    if (loading) return <div className="chatadmin-loading">Cargando conversaciones...</div>;

    const emails = Object.keys(conversaciones);
    const mensajesActuales = emailSeleccionado ? (conversaciones[emailSeleccionado] || []) : [];

    return (
        <div className="chatadmin-container">
            <h1 className="chatadmin-titulo">Chat de Ayuda</h1>

            <div className="chatadmin-layout">

                {/* LISTA DE CONVERSACIONES */}
                <div className="chatadmin-sidebar">
                    <h2 className="chatadmin-sidebar-titulo">Conversaciones</h2>
                    {emails.length === 0 && (
                        <p className="chatadmin-vacio">No hay conversaciones aún.</p>
                    )}
                    {emails.map(email => {
                        const msgs = conversaciones[email];
                        const ultimoMensaje = msgs[msgs.length - 1];
                        //el numero de notificaciones sin leer del admin
                        const sinLeer = msgs.filter(m => !m.esAdmin && !m.leido).length;

                        return (
                            <div
                                key={email}
                                className={`chatadmin-conv ${emailSeleccionado === email ? 'chatadmin-conv-activa' : ''}`}
                                onClick={() => handleSeleccionarConversacion(email)}
                            >
                                <div className="chatadmin-conv-header">
                                    <span className="chatadmin-conv-nombre">
                                        {ultimoMensaje?.nombreUsuario || email}
                                    </span>
                                    {/*numero notificación solo si hay mensajes sin leer*/}
                                    {sinLeer > 0 && (
                                        <span className="chatadmin-badge">{sinLeer}</span>
                                    )}
                                </div>
                                <p className="chatadmin-conv-preview">
                                    {ultimoMensaje?.texto?.slice(0, 40)}...
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* CONVERSACIÓN ACTIVA */}
                <div className="chatadmin-chat">
                    {!emailSeleccionado ? (
                        <p className="chatadmin-vacio">Selecciona una conversación.</p>
                    ) : (
                        <>
                            <div className="chatadmin-mensajes">
                                {mensajesActuales.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`chatadmin-mensaje ${msg.esAdmin ? 'chatadmin-mensaje-admin' : 'chatadmin-mensaje-usuario'}`}
                                    >
                                        <span className="chatadmin-mensaje-autor">
                                            {msg.esAdmin && (
                                                <i
                                                    className="fa-solid fa-user-tie"
                                                    style={{ marginRight: '5px' }}
                                                ></i>
                                            )}
                                            {msg.esAdmin ? ' StreamFlix (Admin)' : msg.nombreUsuario || emailSeleccionado}
                                        </span>

                                        <p className="chatadmin-mensaje-texto">{msg.texto}</p>

                                        <span className="chatadmin-mensaje-fecha">
                                            {new Date(msg.fechaEnvio).toLocaleString('es-ES', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={mensajesEndRef} />
                            </div>

                            <form className="chatadmin-form" onSubmit={handleResponder}>
                                <input
                                    type="text"
                                    className="chatadmin-input"
                                    placeholder="Escribe tu respuesta..."
                                    value={texto}
                                    onChange={(e) => setTexto(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="chatadmin-btn"
                                    disabled={!texto.trim()}
                                >
                                    Responder
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatAdmin;