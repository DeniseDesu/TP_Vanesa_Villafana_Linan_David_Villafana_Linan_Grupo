import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { ContactForm } from "./ContactForm";

export default function Cart() {
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const { cart, clearCart, loading } = useCart();

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    setSubtotal(total);
    setIva(total * 0.21);
  }, [cart]);

  const vaciarCarrito = () => {
    if (confirm("¿Estás seguro que querés vaciar el carrito?")) {
      clearCart();
    }
  };

  const pagar = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      alert("Tenés que estar logueado para pagar.");
      return;
    }

    const historial = JSON.parse(localStorage.getItem("historial")) || [];

    const nuevaCompra = {
      id: Date.now(),
      email: userData.email,
      fecha: new Date().toLocaleString(),
      items: cart
    };

    const actualizado = [...historial, nuevaCompra];
    localStorage.setItem("historial", JSON.stringify(actualizado));

    alert("¡Pago realizado!");
    clearCart();
  };

  const carritoVacio = cart.length === 0;

  if (loading) return null;

  return (
    <>
      {/* Sección de bienvenida */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      {/* Tabla de carrito y resumen */}
      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">Resumen de Compra</h2>
          <div className="row justify-content-center align-items-start">
            {/* Tabla de productos */}
            <div className="col-12 col-md-6 mb-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.nombre}</td>
                      <td>${item.precio}</td>
                      <td>{item.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total a pagar */}
            <div className="col-12 col-md-4">
              <div className="card text-center mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total a Pagar</h5>
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Subtotal</th>
                        <td>${subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <th>IVA (21%)</th>
                        <td>${iva.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <th>Total</th>
                        <td>${(subtotal + iva).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="btn btn-success mb-2"
                    onClick={pagar}
                    disabled={carritoVacio}
                  >
                    Pagar
                  </button>
                  <br />
                  <button
                    className="btn btn-danger"
                    onClick={vaciarCarrito}
                    disabled={carritoVacio}
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <ContactForm />
    </>
  );
}
