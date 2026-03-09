import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div>
                <h3>StreamFlix <i className="fa-solid fa-circle-play"></i></h3>
                <p>El mejor videoclub online  </p>
            </div>

            <div>
                <h4>Legal</h4>
                <ul>
                    <li><a href="/">Política de privacidad </a><i className="fa-solid fa-shield-halved"></i></li>
                    <li><a href="/">Términos de uso </a><i className="fa-regular fa-file-lines"></i></li>
                    <li><a href="/">Contacto </a><i className="fa-solid fa-phone"></i></li>
                </ul>
            </div>

            <div>
                <h4>Redes sociales</h4>
                <ul>
                    <li><a href="https://instagram.com/">Instagram </a><i className="fa-brands fa-instagram"></i></li>
                    <li><a href="https://facebook.com/">Facebook </a><i className="fa-brands fa-facebook"></i></li>
                    <li><a href="https://twitter.com/">Twitter </a><i className="fa-brands fa-x-twitter"></i></li>
                </ul>
            </div>

            <div>
                <p>&copy; 2026 StreamFlix - TFG 2º DAW A</p>
                <p>Francisco García Sogo | Víctor Yuste | Sara Ruiz</p>
            </div>
        </footer>
    );
};

export default Footer;
