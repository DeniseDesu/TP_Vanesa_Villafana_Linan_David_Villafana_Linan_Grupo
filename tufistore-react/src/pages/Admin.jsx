import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "./ContactForm";
import { useProducts } from "../context/ProductsContext";

export default function Admin() {
  const navigate = useNavigate();
  const { productos, addProduct, deleteProduct, refreshProductos } = useProducts();
  const [usuarios, setUsuarios] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenNombre, setImagenNombre] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || userData.rol !== "admin") {
      alert("Acceso denegado. Solo para administradores.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem("usuarios")) {
      const usuariosInit = [
        { id: 1, email: "admin@tufi.com", password: "admin123", rol: "admin" },
        { id: 2, email: "usuario@tufi.com", password: "usuario123", rol: "user" }
      ];
      localStorage.setItem("usuarios", JSON.stringify(usuariosInit));
    }
    setUsuarios(JSON.parse(localStorage.getItem("usuarios")));
  }, []);

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    const nuevo = {
      nombre: e.target.nuevoNombre.value,
      precio: parseFloat(e.target.nuevoPrecio.value),
      stock: parseInt(e.target.nuevoStock.value),
      imagen: `/img/${imagenNombre}`
    };
    addProduct(nuevo);
    e.target.reset();
    setImagenPreview(null);
    setImagenNombre("");
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenNombre(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const eliminarProducto = (id) => {
    deleteProduct(id);
  };

  const editarProducto = (id) => {
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevoPrecio = prompt("Nuevo precio:");
    const nuevoStock = prompt("Nuevo stock:");

    const copia = [...productos];
    const index = copia.findIndex(p => p.id === id);
    if (index !== -1) {
      copia[index].nombre = nuevoNombre;
      copia[index].precio = parseFloat(nuevoPrecio);
      copia[index].stock = parseInt(nuevoStock);
      localStorage.setItem("productos", JSON.stringify(copia));
      refreshProductos();
    }
  };

  const handleAgregarUsuario = (e) => {
    e.preventDefault();
    const email = e.target.nuevoEmail.value;
    const password = e.target.nuevoPassword.value;
    const rol = e.target.nuevoRol.value;

    if (usuarios.find(u => u.email === email)) {
      alert("Ya existe un usuario con ese correo");
      return;
    }

    const nuevo = { id: Date.now(), email, password, rol };
    const actualizados = [...usuarios, nuevo];
    setUsuarios(actualizados);
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    e.target.reset();
  };

  const eliminarUsuario = (id) => {
    const actualizados = usuarios.filter(u => u.id !== id);
    setUsuarios(actualizados);
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
  };

  const editarUsuario = (id) => {
    const copia = [...usuarios];
    const index = copia.findIndex(u => u.id === id);
    if (index !== -1) {
      const nuevoEmail = prompt("Nuevo email:", copia[index].email);
      const nuevoRol = prompt("Nuevo rol (admin/user):", copia[index].rol);
      if (nuevoEmail && (nuevoRol === "admin" || nuevoRol === "user")) {
        copia[index].email = nuevoEmail;
        copia[index].rol = nuevoRol;
        setUsuarios(copia);
        localStorage.setItem("usuarios", JSON.stringify(copia));
      } else {
        alert("Datos inválidos");
      }
    }
  };

  return (
    <>
      {/* Encabezado */}
      <section className="sobre-tufistore seccion-oscura">
        <div className="contenedor">
          <h2 className="seccion-titulo">TUFI Store</h2>
          <p className="seccion-texto">Tu tienda online de figuritas sueltas</p>
        </div>
      </section>

      {/* ABM Productos */}
      <section className="novedades seccion-clara">
        <div className="container text-center">
          <h2 className="seccion-titulo">ABM de Productos</h2>
          <hr />
          <h4 className="mb-3">Alta de Productos</h4>

          <form id="formNuevoProducto" onSubmit={handleAgregarProducto} className="mb-4">
            <input className="form-control mb-2" type="text" name="nuevoNombre" placeholder="Nombre" required />
            <input className="form-control mb-2" type="number" name="nuevoPrecio" placeholder="Precio" required />
            <input className="form-control mb-2" type="number" name="nuevoStock" placeholder="Stock" required />
            <input className="form-control mb-2" type="file" name="nuevaImagen" onChange={handleImagenChange} accept="image/*" required />
            {imagenPreview && (
              <div className="mb-3">
                <p>Vista previa:</p>
                <img src={imagenPreview} alt="Vista previa" className="img-abm" />
              </div>
            )}
            <button className="btn btn-success">Agregar</button>
          </form>

          {/* Tabla de productos */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Modificar</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td><img className="img-abm" src={p.imagen} alt={p.nombre} /></td>
                    <td>{p.nombre}</td>
                    <td>{p.precio}</td>
                    <td>{p.stock}</td>
                    <td>
                      <i className="bi bi-pencil text-success me-2" onClick={() => editarProducto(p.id)}></i>
                      <i className="bi bi-trash text-danger" onClick={() => eliminarProducto(p.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ABM Usuarios */}
          <h2 className="seccion-titulo mt-4">Gestión de Usuarios</h2>

          <form id="formNuevoUsuario" onSubmit={handleAgregarUsuario} className="mb-4">
            <input className="form-control mb-2" type="email" name="nuevoEmail" placeholder="Email" required />
            <input className="form-control mb-2" type="password" name="nuevoPassword" placeholder="Contraseña" required />
            <select className="form-select mb-2" name="nuevoRol" required>
              <option value="">Seleccioná rol</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
            <button className="btn btn-success">Agregar usuario</button>
          </form>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => editarUsuario(u.id)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <ContactForm />
    </>
  );
}
