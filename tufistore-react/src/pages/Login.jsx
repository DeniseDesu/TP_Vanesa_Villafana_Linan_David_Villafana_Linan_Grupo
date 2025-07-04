import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "./ContactForm";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Crear usuarios de ejemplo
  useEffect(() => {
    if (!localStorage.getItem("usuarios")) {
      const usuarios = [
        { id: 1, email: "admin@tufi.com", password: "admin123", rol: "admin" },
        { id: 2, email: "usuario@tufi.com", password: "usuario123", rol: "user" },
      ];
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find((u) => u.email === email && u.password === password);

    if (user) {
      login({ id: user.id, email: user.email, rol: user.rol }); // pasa el usuario completo
      navigate(user.rol === "admin" ? "/admin" : "/store");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <>
      {/* Sección bienvenida */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      {/* Formulario de login */}
      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">Ingresa con tu cuenta</h2>
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-6">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Dirección de Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary w-100">Ingresar</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <ContactForm />
    </>
  );
}
