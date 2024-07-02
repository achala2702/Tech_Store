import { motion } from "framer-motion";
import axios from "axios";
import { useCookies } from "react-cookie";

const Checkout = ({
  cartProducts,
  clearCart,
  incrementCount,
  decrementCount,
}) => {

  const url = import.meta.env.VITE_SERVER_URL_PRODUCT;
  const [cookies, _] = useCookies(["access_token"]);
  const token = cookies.access_token;

  function formatPrice(number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(number);
  }

  //sending the product details to the server to make the purchase
  const checkOutProducts = async ()=>{

    try{
      const response = await axios.post(`${url}/checkout`, {cart_items: cartProducts}, {headers: {
        Authorization: token,
      }});

      if(response.data.url){
        window.location.href = response.data.url;
      }

    }catch(err){
      alert(err.response.data.message);
    }

  }

  return (
    <div className="flex flex-col min-h-screen items-center w-full py-6 px-4">
      <motion.button
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.1 }}
        className="text-black p-2 text-xs bg-white md:text-sm w-1/2 lg:text-sm hover:bg-black hover:text-white md:py-4 rounded-md border-2 border-black"
        onClick={() => clearCart()}
      >
        Clear Cart
      </motion.button>
      {cartProducts.map((product) => {
        return (
          <div
            className="border-2 rounded-md shadow-[0_0_8px_5px_rgba(0,0,0,0.1)] p-6 my-4 flex flex-col items-center gap-2 w-full"
            key={product._id}
          >
            <img
              className="w-20"
              src={product.imgUrl}
              alt={product.productName}
            />
            <h1 className="font-semibold">{product.productName}</h1>
            <p>{product.description}</p>
            <p className="font-semibold">{formatPrice(product.price)}</p>
            <p className="font-semibold">
              No. items in Cart:{" "}
              <span
                className="bg-gray-400 mx-2 px-1 border-2 border-black font-semibold text-2xl rounded-md cursor-pointer"
                onClick={() => incrementCount(product._id)}
              >
                +
              </span>
              {product.count}
              <span
                className="bg-gray-400 mx-2 px-2 border-2 border-black font-semibold text-2xl rounded-md cursor-pointer"
                onClick={() => decrementCount(product._id)}
              >
                -
              </span>
            </p>
          </div>
        );
      })}
      <motion.button
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.1 }}
        className="text-black p-2 text-xs bg-white md:text-sm w-1/2 lg:text-sm hover:bg-black hover:text-white md:py-4 rounded-md border-2 border-black"
        onClick={() => checkOutProducts()}
      >
        Checkout
      </motion.button>
    </div>
  );
};

export default Checkout;
