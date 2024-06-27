import {useEffect, useState} from 'react'
import axios from "axios";

const Shop = () => {

  const [products, setProducts]= useState([]);
  const url = import.meta.env.VITE_SERVER_URL_PRODUCT;

  const fetchProducts = async ()=>{

    try{

      const response = await axios.get(`${url}/`);

      setProducts(response.data.productsWithImages);

    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchProducts();
  }, []);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4'>{products.map((product)=>(
    <div className='flex flex-col items-center justify-center gap-2' key={product._id}>
      <img src={product.imgUrl} alt={product.productName} />
      <h1 className='font-semibold py-2 text-lg'>{product.productName}</h1>
      <p className='text-md'>{product.description}</p>
      <p className='text-md mb-2'>lkr {product.price}</p>
      <button
            className="text-black w-24 p-2 text-xs bg-white md:text-sm md:w-28 lg:text-sm hover:bg-black hover:text-white md:py-4 rounded-md border-2 border-black"
          >
            add to cart
          </button>
    </div>))}</div>
  )
}

export default Shop