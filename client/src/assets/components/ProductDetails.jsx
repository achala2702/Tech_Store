import { useEffect, useState } from "react";
import axios from "axios";
import AddEditProducts from "./AddEditProducts";
import { motion } from "framer-motion";

const ProductDetails = ({ token }) => {
  const url = import.meta.env.VITE_SERVER_URL_PRODUCT;
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowEditForm(!showEditForm);
  };

  const handleDeleteClick = async (_id) => {
    try {
      const response = await axios.delete(`${url}/delete-product/${_id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      alert(response.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/`);
        setProducts(response.data.products);
      } catch (err) {
        console.log(err.response.data.message);
      }
    };

    fetchData();
  }, [handleEditClick, handleDeleteClick]);

  function formatPrice(number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(number);
  }

  return (
    <div className="mx-4">
      {products.map((product) => (
        <div
          className="border-2 rounded-md shadow-[0_0_8px_5px_rgba(0,0,0,0.1)] p-6 my-4 flex flex-col items-center gap-2"
          key={product._id}
        >
          <img
            className="w-20"
            src={product.imgUrl}
            alt={product.productName}
          />
          <h1 className="font-semibold">{product.productName}</h1>
          <p>{product.description}</p>
          <p className="font-semibold">Items left: {product.stockQuantity}</p>
          <p className="font-semibold">{formatPrice(product.price)}</p>
          <div className="w-full md:w-3/4 flex flex-col md:flex-row md:justify-between items-center gap-2">
            <motion.button
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
              className="text-black w-24 p-2 text-xs bg-white md:text-sm md:w-28 lg:w-32 lg:text-lg lg:py-4 md:py-2 hover:bg-black hover:text-white xl:p-4 border-2 border-black"
              onClick={() => handleEditClick(product)}
            >
              Edit
            </motion.button>
            <motion.button
              initial={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.1 }}
              className="text-black w-24 p-2 text-xs bg-white md:text-sm md:w-28 lg:w-32 lg:text-lg lg:py-4 md:py-2 hover:bg-red-800 hover:text-white xl:p-4 border-2 border-black"
              onClick={() => handleDeleteClick(product._id)}
            >
              Delete
            </motion.button>
          </div>
          {editProduct._id === product._id && showEditForm ? (
            <AddEditProducts token={token} product={editProduct} />
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductDetails;
