import './Registro.css';
import { useState } from 'react';

function Registro() {

    //datos del state
    const [camposRegistro, setCamposRegistro] = useState({ nombre: '', email: '', password: '', repetirPassword: '', politica: false, noticias: false });
    console.log('todos los campos: ', camposRegistro);

    const [errores, setErrores] = useState({});

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

    function pulsarBoton(e) {
        let hayErrores = false;
        const erroresValidacion = { nombre: '', email: '', password: '', repetirPassword: '', politica: '' };

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

        setErrores(erroresValidacion); //---añadir los errores al objeto

        if (!hayErrores) {
            console.log("todo correcto: ", camposRegistro)
        }

    }

    return (
        <div>
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

            <div>
                <p>¿Ya tienes cuenta? <i class="fa-solid fa-hand-point-right"></i>
                    <a><u> Iniciar sesión</u></a></p>
            </div>

        </div>
    )
}

export default Registro;
