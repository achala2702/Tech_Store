import { useContext, createContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevCartItems => {
      const existingProductIndex = prevCartItems.findIndex(item => item._id === product._id);
  
      console.log("Product ID:", product._id);
      console.log("Current Cart Items:", prevCartItems);
  
      if (existingProductIndex !== -1) {
        // Product already exists in cart, update its count
        const updatedCartItems = prevCartItems.map((item, index) =>
          index === existingProductIndex ? { ...item, count: item.count + 1 } : item
        );
        return updatedCartItems;
      } else {
        // Product is new to cart, add it with count 1
        return [...prevCartItems, { ...product, count: 1 }];
      }
    });
  };
  

  const clearCart = () => {
    setCartItems([]);
  };

  const sendCartItems = ()=>{
    return cartItems;
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart, sendCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
