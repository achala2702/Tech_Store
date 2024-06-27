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

  function formatPrice(number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
    }).format(number);
  }

  return (
<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-10'>
  {products.map((product) => (
    <div className='flex flex-col items-center justify-between gap-2 h-full' key={product._id}>
      <div className='flex-1 flex flex-col items-center'>
        <img src={product.imgUrl} alt={product.productName} className='h-56 object-cover' />
        <h1 className='font-semibold py-2 text-lg'>{product.productName}</h1>
        <p className='text-md'>{product.description}</p>
      </div>
      <p className='text-md mb-2 font-semibold'>{formatPrice(product.price)}</p>
      <button
        className="text-black w-24 p-2 text-xs bg-white md:text-sm md:w-28 lg:text-sm hover:bg-black hover:text-white md:py-4 rounded-md border-2 border-black"
      >
        Add to cart
      </button>
    </div>
  ))}
</div>

  )
}

export default Shop