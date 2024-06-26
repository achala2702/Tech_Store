import {useEffect, useState} from 'react'
import axios from "axios";

const Shop = () => {

  const [products, setProducts]= useState([]);
  const url = import.meta.env.VITE_SERVER_URL_PRODUCT;

  const fetchProducts = async ()=>{

    try{

      const response = await axios.get(`${url}/`);

      setProducts(response.data.purchasedItems);

    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchProducts();
  }, []);

  return (
    <div className=''>Shop</div>
  )
}

export default Shop