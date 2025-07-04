import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ContactForm } from "./ContactForm";

export default function Profile() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("historial")) || [];
    const filtrados = todos.filter(pedido => pedido.email === user?.email);
    setHistorial(filtrados);
  }, [user]);

  return (
    <>
      {/* Sección bienvenida */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="novedades seccion-clara">
        <div className="container mt-4">
          <h2 className="text-center">Mi Perfil</h2>
          <p className="text-center">
            Bienvenido/a, <strong>{user?.email}</strong> | Rol: <strong>{user?.rol}</strong>
          </p>

          <hr />

          <h4>Historial de Pedidos</h4>

          {historial.length === 0 ? (
            <p>No tenés pedidos registrados.</p>
          ) : (
            historial.map((pedido) => (
              <div key={pedido.id} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Pedido #{pedido.id}</h5>
                  <p><strong>Fecha:</strong> {pedido.fecha}</p>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.nombre}</td>
                          <td>${item.precio}</td>
                          <td>{item.cantidad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Pie de contacto */}
      <ContactForm />
    </>
  );
}
