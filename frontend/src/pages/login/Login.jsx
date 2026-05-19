import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {

    const auth = useAuth()
    const login = auth.login
    const navigate = useNavigate()

    const [camposLogin, setCamposLogin] = useState({
        email: '',
        password: ''
    })

    const [errores, setErrores] = useState({})
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setCamposLogin({
            ...camposLogin,
            [e.target.name]: e.target.value
        })
        if (errores[e.target.name]) {
            setErrores({ ...errores, [e.target.name]: '' })
        }
    }

    async function pulsarBoton(e) {
        e.preventDefault()
        setLoading(true)
        setErrores({})

        if (!camposLogin.email.trim() || !camposLogin.password.trim()) {
            setErrores({
                email: !camposLogin.email.trim() ? 'Nombre o email requerido' : '',
                password: !camposLogin.password.trim() ? 'Contraseña requerida' : ''
            })
            setLoading(false)
            return
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(camposLogin)
            })

            if (!response.ok) {
                const errorCredenciales = await response.json()
                setErrores({ general: errorCredenciales.message || 'Las credenciales son incorrectas' })
            } else {
                const credenciales = await response.json()
                login({
                    token: credenciales.token,
                    rol: credenciales.rol,
                    nombre: credenciales.nombre
                })
                navigate('/', { replace: true })
            }
        } catch (error) {
            setErrores({ general: 'Error de conexión: ' + error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            {/* <h1 className="login-titulo">Inicio de sesión</h1> */}
            <div className="login-card">
                {errores.general && (
                    <div className="login-error-general">
                        {errores.general}
                    </div>
                )}

                <form onSubmit={pulsarBoton}>
                    <div>
                        <label>Nombre o email:</label>
                        <input
                            name="email"
                            type="text"
                            placeholder="Introduce tu nombre o email"
                            value={camposLogin.email}
                            onChange={handleChange}
                            required
                        />
                        {errores.email && <div className="errorMensaje">{errores.email}</div>}
                    </div>

                    <div>
                        <label>Contraseña:</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Introduce tu contraseña"
                            value={camposLogin.password}
                            onChange={handleChange}
                            required
                        />
                        {errores.password && <div className="errorMensaje">{errores.password}</div>}
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Enviando...' : 'Iniciar sesión'}
                    </button>
                    
                    <p>
                        ¿Aún no tienes cuenta? <i className="fa-solid fa-hand-point-right"></i>
                        <Link to="/registro"> Regístrate</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Login