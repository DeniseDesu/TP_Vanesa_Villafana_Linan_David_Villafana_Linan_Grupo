import { createContext, useContext, useEffect, useState } from "react";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([]);

  const cargarDesdeLocalStorage = () => {
    const stored = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(stored);
  };

  useEffect(() => {
    cargarDesdeLocalStorage();

    // Escuchar cambios de productos desde otros componentes
    const listener = () => cargarDesdeLocalStorage();
    window.addEventListener("productosActualizados", listener);

    return () => window.removeEventListener("productosActualizados", listener);
  }, []);

  const guardarYActualizar = (nuevos) => {
    localStorage.setItem("productos", JSON.stringify(nuevos));
    setProductos(nuevos);
    window.dispatchEvent(new Event("productosActualizados"));
  };

  const addProduct = (product) => {
    const nuevos = [...productos, { ...product, id: Date.now() }];
    guardarYActualizar(nuevos);
  };

  const deleteProduct = (id) => {
    const actualizados = productos.filter(p => p.id !== id);
    guardarYActualizar(actualizados);
  };

  const refreshProductos = cargarDesdeLocalStorage;

  return (
    <ProductsContext.Provider
      value={{ productos, addProduct, deleteProduct, refreshProductos }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
