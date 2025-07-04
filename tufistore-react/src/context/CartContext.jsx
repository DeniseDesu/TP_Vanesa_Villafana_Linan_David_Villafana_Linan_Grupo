import { createContext, useContext, useEffect, useState, useRef } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true); // nuevo estado
  const toastTimeout = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("carrito")) || [];
    setCart(stored);
    setLoading(false); // marcar como cargado
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("carrito", JSON.stringify(cart));
    }
  }, [cart, loading]);

  const addToCart = (product) => {
    const updated = [...cart];
    const item = updated.find(p => p.id === product.id);
    if (item) item.cantidad += 1;
    else updated.push({ ...product, cantidad: 1 });
    setCart(updated);

    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(product.id);
    toastTimeout.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, toast, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
