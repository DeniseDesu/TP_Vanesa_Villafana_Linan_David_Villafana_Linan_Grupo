import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "./ContactForm";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.find((u) => u.email === email);
    if (existe) {
      alert("Ya existe un usuario con ese correo.");
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      email,
      password,
      rol: "user", // Rol por defecto
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("¡Registro exitoso! Ahora podés iniciar sesión.");
    navigate("/login");
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

      {/* Formulario de registro */}
      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">Registro de Usuario</h2>
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-6">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrarme</button>
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
