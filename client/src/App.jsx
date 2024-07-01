import {useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./assets/components/NavBar";
import Purchased_items from "./assets/pages/Purchased_items";
import Auth from "./assets/pages/Auth";
import Shop from "./assets/pages/Shop";
import Checkout from "./assets/pages/Checkout";
import ForgotPassword from "./assets/components/ForgotPassword"
import ResetPassword from "./assets/components/ResetPassword"
import Admin from "./assets/pages/Admin";
import axios from "axios";
import Footer from "./assets/components/Footer";

function App() {

  const [cartItems, setCartItems] = useState(() => {
    // Load cartItems from localStorage if available
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async (search) => {
    try {
      const response = await axios.get(`${url}/?q=${search}`);
      setProducts(response.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  const cartProducts = cartItems.map((cartItem) => {
    const product = products.find((product) => product._id === cartItem._id);
    return product ? { ...product, count: cartItem.count } : null;
  }).filter(product => product !== null);

  useEffect(() => {

    localStorage.clear();
    // Save cartItems to localStorage whenever they change
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    fetchProducts(search);
  }, [search]);

  useEffect(() => {
    console.log(cartProducts);
  }, [cartItems]);

  const url = import.meta.env.VITE_SERVER_URL_PRODUCT;

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, count: item.count + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, count: 1 }];
      }
    });
  };
  const clearCart = () => {
    setCartItems([]);
    localStorage.clear();
  };

  // add or minus producrt count
  const incrementCount = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const product = products.find((product) => product._id === item._id);
        if (item._id === productId && item.count < product.stockQuantity) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      })
    );
  };

  const decrementCount = (productId) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item._id === productId && item.count > 0
            ? { ...item, count: item.count - 1 }
            : item
        )
        .filter((item) => item.count > 0)
    );
  };

  return (
    <div className="overflow-hidden">
    <NavBar/>
    <Routes>
      <Route path="/" element={<Shop addToCart={addToCart} cartItems={cartItems} products={products} setSearch={setSearch} search={search} />}></Route>
      <Route path="/auth" element={<Auth/>}></Route>
      <Route path="/purchased-items" element={<Purchased_items/>}></Route>
      <Route path="/checkout" element={<Checkout cartProducts={cartProducts} clearCart={clearCart} incrementCount={incrementCount} decrementCount={decrementCount} />}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
      <Route path="/admin" element={<Admin/>}></Route>
    </Routes>
    <Footer/>
    </div>
  )
}

export default App
