import {useEffect, useState} from 'react'
import axios from "axios";
import { useCookies } from "react-cookie";

const Purchased_items = () => {

  const url = import.meta.env.VITE_SERVER_URL_USER;

  const [products, setProducts] = useState([]);

  const [cookies, _] = useCookies(["access_token"]);
  const token = cookies.access_token;

  const fetchData = async ()=>{
    const response = await axios.get( `${url}/get-products`, {
      headers: {
        Authorization: token,
      }
    });

    console.log(response.data.products)
    setProducts(response.data.products);
  }

  useEffect(()=>{
    fetchData();
  },[]);

  function formatPrice(number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(number);
  }


  return (
    <div>
      {products.map((product) => {
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
            <p className='font-semibold'>Total: {formatPrice(product.price * product.count)}</p>
            <p className='font-semibold'>No. items you purchased: {product.count}</p>
          </div>
        );
      })}
    </div>
  )
}

export default Purchased_items