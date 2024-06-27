import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductDetails from "../components/ProductDetails";

const Admin = () => {
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [errorPrompt, setErrorPrompt] = useState("");
  const [category, setCategory] = useState(null);

  const token = cookies.access_token;
  const url = import.meta.env.VITE_SERVER_URL_PRODUCT;

  const decoded = jwtDecode(token);

  useEffect(() => {
    if (!decoded.admin) {
      alert("You do not have access to this page!");

      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    }
  }, []);

  //clearing fields
  const cleanFields = () => {
    setErrorPrompt("");
    setProductImage(null);
    setStockQuantity("");
    setDescription("");
    setPrice("");
    setProductName("");
    setCategory("");
  };

  //submititng add products
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stockQuantity", stockQuantity);
    formData.append("productImage", productImage);
    formData.append("category", category);

    try {
      const response = await axios.post(`${url}/add-products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });

      setErrorPrompt(response.data.message);
      setTimeout(() => {
        cleanFields();
      }, 3000);
    } catch (err) {
      console.log(err);
      setErrorPrompt(err.response.data.message);

      setTimeout(() => {
        cleanFields();
      }, 3000);
    }
  };

  return (
    <div className="py-6">
      {decoded.admin ? (
        <div className="gap-4 w-full flex flex-col items-center">
          <section className="flex flex-col items-center gap-4 border-2 rounded-md px-4 py-6 pb-10 shadow-[0_0_8px_5px_rgba(0,0,0,0.1)] md: w-3/4 xl:w-1/2">
            <h1 className="text-xl font-semibold md:text-2xl">Add Products</h1>
            <form
              className="flex flex-col lg:px-4 md:text-lg gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <label htmlFor="productName">Product's Name:</label>
              <input
                className={`focus:outline-none border-b-2 w-full border-black text-gray-700`}
                type="text"
                id="productName"
                name="productName"
                placeholder="Enter the product Name"
                value={productName}
                onChange={(event) => {
                  setProductName(event.target.value);
                }}
              />
              <label htmlFor="description">Product's Description:</label>
              <textarea
                className={`focus:outline-none border-b-2 w-full border-black text-gray-700`}
                type="text"
                id="description"
                name="description"
                placeholder="Enter the product's description"
                value={description}
                rows={2}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
              <label htmlFor="price">Product's Price:</label>
              <input
                className={`focus:outline-none border-b-2 w-full border-black text-gray-700`}
                type="number"
                id="price"
                name="product-price"
                placeholder="Enter the price for the product"
                value={price}
                onChange={(event) => {
                  setPrice(
                    event.target.value === "" ? "" : Number(event.target.value)
                  );
                }}
              />
              <label htmlFor="stockQuantity">Quantity:</label>
              <input
                className={`focus:outline-none border-b-2 w-full border-black text-gray-700`}
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                placeholder="Number of products"
                value={stockQuantity}
                onChange={(event) => {
                  setStockQuantity(
                    event.target.value === "" ? "" : Number(event.target.value)
                  );
                }}
              />
              <label htmlFor="productImage">Upload product image:</label>
              <input
                type="file"
                id="productImage"
                name="productImage"
                accept="image/*"
                onChange={(event) => {
                  setProductImage(event.target.files[0]);
                }}
              />
            <label htmlFor="category">Choose a Category:</label>
              <select
                id="category"
                name="category"
                className="text-gray-700"
                value={category !== null ? category : ""}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
              >
                <option value="" disabled>Select a Category</option>
                <option value="mobilePhones">Mobile Phones</option>
                <option value="tv">Televison</option>
                <option value="camera">Camera</option>
                <option value="laptops">Laptops</option>
                <option value="smartWatches">Smart Watches</option>
              </select>
              <p className={`${errorPrompt === "" ? "hidden" : ""}`}>
                {errorPrompt}
              </p>
              <button className="text-black w-24 p-2 text-xs bg-white md:text-sm md:w-28 lg:w-32 lg:text-lg hover:bg-black hover:text-white md:p-4 border-2 mx-auto border-black">
                ADD
              </button>
            </form>
          </section>
          <ProductDetails/>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Admin;
