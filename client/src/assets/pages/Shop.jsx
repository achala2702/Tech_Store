import { useEffect, useState } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Shop = ({ addToCart, cartItems, products, setSearch, search }) => {
  const [cookies, _, removeCookie] = useCookies(["access_token"]);
  const [decoded, setDecoded] = useState("");

  const token = cookies.access_token;

  const navigate = useNavigate();

  const isProductDisabled = (cartItems, product) => {
    const item = cartItems.find((item) => item._id === product._id);
    if (item && item.count >= product.stockQuantity) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    try{
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
    }catch(err){
      console.log("invalid token")
    }

  }, []);

  const handleAddToCartClick = (product) => {
    if (token) {
      try {
        const currentTime = Date.now() / 1000;
        if (decoded && decoded.exp < currentTime) {
          alert("Your session has expired. Please log in again.");
          removeCookie("access_token");
          navigate("/auth");
          return;
        }

        if (decoded && decoded.admin) {
          alert("Admin can not buy products!");
          return;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        alert("Invalid token. Please log in again.");
        removeCookie("access_token");
        navigate("/auth");
      }
    } else {
      alert("Please log In to add Items to Cart");
      return;
    }
    if (isProductDisabled(cartItems, product)) {
      alert(
        "You cannot add more of this item. It has reached its stock limit."
      );
    } else {
      addToCart(product);
    }
  };

  function formatPrice(number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(number);
  }

  return (
    <>
      <div className="bg-black px-2 flex justify-between pb-2">
        {decoded.admin ? (
          <motion.section
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
            onClick={()=>{navigate("/admin")}}
            className="text-white text-sm md:text-base lg:p-4 cursor-pointer rounded-md text-center p-2 bg-red-800"
          >
            Admin Panel
          </motion.section>
        ) : (
          ""
        )}
        <section className={`md:w-60 lg:w-72 px-4 justify-center items-center flex gap-2 ${!decoded.admin? "ml-auto":''}`}>
          <input
            className={`focus:outline-none border-b-2 p-2 w-full border-black text-gray-700 rounded-md`}
            type="text"
            id="search"
            name="search"
            placeholder="Search..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
          <SearchIcon
            className="hover:cursor-pointer"
            sx={{ color: "white" }}
          />
        </section>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-10">
        {products.map((product) => (
          <div
            className="flex flex-col items-center justify-between gap-2 h-full"
            key={product._id}
          >
            <div className="flex-1 flex flex-col items-center">
              <img
                src={product.imgUrl}
                alt={product.productName}
                className="h-56 object-cover"
              />
              <h1 className="font-semibold py-2 text-lg">
                {product.productName}
              </h1>
              <p className="text-md">{product.description}</p>
            </div>
            <p className="text-md mb-2 font-semibold">
              {formatPrice(product.price)}
            </p>
            <p className="text-md mb-2 font-semibold">
              {product.stockQuantity === 0 ? "Out of Stock" : "In Stock"}
            </p>
            <motion.button
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
              className="text-black w-24 p-2 text-xs bg-white md:text-sm md:w-28 lg:text-sm hover:bg-black hover:text-white md:py-4 rounded-md border-2 border-black"
              disabled={product.stockQuantity === 0}
              onClick={() => handleAddToCartClick(product)}
            >
              Add to cart
            </motion.button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Shop;
