import { createContext, useContext, useEffect, useState } from "react";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(stored);
  }, []);

  const addProduct = (product) => {
    const nuevos = [...productos, { ...product, id: Date.now() }];
    setProductos(nuevos);
    localStorage.setItem("productos", JSON.stringify(nuevos));
  };

  const deleteProduct = (id) => {
    const actualizados = productos.filter(p => p.id !== id);
    setProductos(actualizados);
    localStorage.setItem("productos", JSON.stringify(actualizados));
  };

  return (
    <ProductsContext.Provider value={{ productos, addProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
