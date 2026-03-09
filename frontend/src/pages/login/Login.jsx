import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'


function Login() {

    //leer el contexto para usar la función login
    const auth = useAuth()
    const login = auth.login

    const navigate = useNavigate() //funcion para cambiar de pag tras loguearse

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

        //quitar error cuando el user escriba
        if (errores[e.target.name]) {
            setErrores({ ...errores, [e.target.name]: '' })
        }
    }

    async function pulsarBoton(e) {
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

        console.log('login enviado al backend: ', camposLogin)

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
                console.log('token jwt: ', credenciales.token)

                //guardar en authcontext
                login({
                    token: credenciales.token,
                    rol: credenciales.rol,
                    nombre: credenciales.nombre
                })

                //---redirigir a home tras login----(es el landing)
                navigate('/', { replace: true })
            }
        } catch (error) {
            setErrores({ general: 'Error de conexión' })
        } finally {
            setLoading(false)
        }
    }


    return (
        <div>
            {errores.general && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                    {errores.general}
                </div>
            )}
            <div>
                <label>Nombre o email: </label>
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
                <label>Contraseña: </label>
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

            <br />

            <button type="submit" disabled={loading} onClick={pulsarBoton}>
                {loading ? 'Enviando...' : 'Iniciar sesión'}
            </button>

            <br />

            <div>
                <p>
                    ¿Aún no tienes cuenta? <i className="fa-solid fa-hand-point-right"></i>
                    <Link to="/registro"> Regístrate</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
