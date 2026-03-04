import './Registro.css';
import { useState, useEffect, useRef } from 'react';

import { Link } from "react-router-dom";


function Registro() {

    //datos del state
    const [camposRegistro, setCamposRegistro] = useState({
        nombre: '',
        email: '',
        password: '',
        repetirPassword: '',
        politica: false,
        noticias: false
    });
    console.log('todos los campos: ', camposRegistro);

    const [errores, setErrores] = useState({});

    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef(null); //---guardar id del checkbox del recaptcha


    useEffect(() => {
        const renderRecaptcha = () => {
            const container = document.getElementById('recaptcha-registro');

            //pintar el recaptcha si el div está vacío--para pintarlo solo una vez
            if (container &&
                window.grecaptcha &&
                window.grecaptcha.enterprise &&
                container.innerHTML === ''
            ) {
                //---pintar el recaptcha y guardar el sitekey en el useref
                recaptchaRef.current = window.grecaptcha.enterprise.render(
                    container,
                    {
                        sitekey: '6Lf2XnssAAAAAIDyekNCwc8TG-5zR_1joAtO1JF4',
                        //borrar el error del recaptcha cuando se complete
                        callback: (token) => { //---es cuando el token se genere
                            setErrores(prev => ({ ...prev, recaptcha: '' }));
                            setRecaptchaToken(token);
                        }
                    }
                );
            }
        };

        //renderizar captcha cuando google está cargado
        if (window.grecaptcha && window.grecaptcha.enterprise) {
            window.grecaptcha.enterprise.ready(() => {
                renderRecaptcha();
            });
        }

    }, []);


    //funciones - validaciones
    function onChangeHandler(e) {
        const { name, type, checked, value } = e.target;
        const valorCheckbox = type === 'checkbox' ? checked : value;
        setCamposRegistro(camposRegistro => ({ ...camposRegistro, [name]: valorCheckbox }))

        //------quitar el error del campo que se esté editando
        setErrores(prev => ({ ...prev, [name]: '' }));
    }

    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    function validarPassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
        return regex.test(password);
    }


    async function pulsarBoton(e) {
        //e.preventDefault();

        let hayErrores = false;
        const erroresValidacion = {
            nombre: '',
            email: '',
            password: '',
            repetirPassword: '',
            politica: ''
        };

        //sacar mensaje de error a cada campo al pulsar el botón
        if (!camposRegistro.nombre.trim()) {
            erroresValidacion.nombre = "El nombre es obligatorio.";
            hayErrores = true;
        }

        if (!camposRegistro.email.trim()) {
            erroresValidacion.email = "El email es obligatorio.";
            hayErrores = true;
        } else if (!validarEmail(camposRegistro.email)) {
            erroresValidacion.email = "El formato del email es inválido.";
            hayErrores = true;
        }

        if (!camposRegistro.password.trim()) {
            erroresValidacion.password = "La contraseña es obligatoria.";
            hayErrores = true;
        } else if (!validarPassword(camposRegistro.password)) {
            erroresValidacion.password = "Debe tener mínimo 8 caracteres, 1 mayúscula y 1 símbolo (!@#$%^&*.)";
            hayErrores = true;
        }

        if (!camposRegistro.repetirPassword.trim()) {
            erroresValidacion.repetirPassword = "Debes repetir la contraseña.";
            hayErrores = true;
        } else if (camposRegistro.password !== camposRegistro.repetirPassword) {
            erroresValidacion.password = "Las contraseñas no coinciden";
            erroresValidacion.repetirPassword = "Las contraseñas no coinciden";
            hayErrores = true;
        }

        if (!camposRegistro.politica) {
            erroresValidacion.politica = "Debes aceptar la política de privacidad.";
            hayErrores = true;
        }

        //const token = recaptchaRef.current ? window.grecaptcha.enterprise.getResponse(recaptchaRef.current) : null;
        const token = window.grecaptcha.enterprise.getResponse(recaptchaRef.current);

        if (!token) {
            erroresValidacion.recaptcha = "Debes completar el recaptcha.";
            hayErrores = true;
        } else {
            console.log("el token es: ", token)

        }

        if (hayErrores) {
            setErrores(erroresValidacion);
            return;
        }

        try {
            setRecaptchaToken(token);

            //aqui enviar datos y token al backend---------------
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: camposRegistro.nombre,
                    email: camposRegistro.email,
                    password: camposRegistro.password,
                    noticias: camposRegistro.noticias,
                    recaptchaToken: token
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registro completado, bienvenido a StreamFlix :)');

                // Limpiar el formulario
                setCamposRegistro({
                    nombre: '',
                    email: '',
                    password: '',
                    repetirPassword: '',
                    politica: false,
                    noticias: false
                });

                setErrores({});

                // Resetear el checkbox del recaptcha
                window.grecaptcha.enterprise.reset(recaptchaRef.current);

            } else {
                alert('Error: ' + (data.error || 'El registro ha fallado'));
            }

        } catch (error) {
            alert('Hubo un error al enviar el registro.');
            console.error(error);
        }
    }

    return (
        <div className="registro-page">
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required onChange={onChangeHandler}></input>
                {errores.nombre && <div className="errorMensaje">{errores.nombre}</div>}
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required onChange={onChangeHandler}></input>
                {errores.email && <div className="errorMensaje">{errores.email}</div>}
            </div>
            <div>
                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" name="password" required onChange={onChangeHandler}></input>
                {errores.password && <div className="errorMensaje">{errores.password}</div>}
            </div>
            <div>
                <label htmlFor="repetirPassword">Repetir contraseña:</label>
                <input type="password" id="repetirPassword" name="repetirPassword" required onChange={onChangeHandler}></input>
                {errores.repetirPassword && <div className="errorMensaje">{errores.repetirPassword}</div>}
            </div>

            <br></br>

            {/*recaptcha*/}
            <div>
                {errores.recaptcha && <div className="errorMensaje">{errores.recaptcha}</div>}
                <div id="recaptcha-registro" className="m-4"></div>
            </div>
            <br></br>

            {/*checkboxes y botón*/}
            <div>
                <input type="checkbox" id="politica" name="politica" required onChange={onChangeHandler}></input>
                <label htmlFor="politica">
                    Acepto la política de privacidad
                </label>
                {errores.politica && <div className="errorMensaje">{errores.politica}</div>}
            </div>

            <div>
                <input type="checkbox" id="noticias" name="noticias" onChange={onChangeHandler}></input> {/*-----opcional*/}
                <label htmlFor="noticias">Quiero recibir noticias de SteamFlix</label>
            </div>

            <br></br>

            <div>
                <button type="submit" onClick={pulsarBoton}>Registrarse</button>
            </div>

            {/* <div>
                <p>¿Ya tienes cuenta? <i className="fa-solid fa-hand-point-right"></i>
                    <a href=""><u> Iniciar sesión</u></a></p>
            </div> */}
            <div>
                <p>¿Ya tienes cuenta? <i className="fa-solid fa-hand-point-right "></i>
                    <Link to="/login" className="underline text-blue-500 hover:text-blue-700"> Iniciar sesión</Link>
                </p>
            </div>

        </div>
    )
}

export default Registro;
