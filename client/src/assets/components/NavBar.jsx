import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookies, _, removeCookie] = useCookies(["access_token"]);
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setToken(cookies.access_token);
  }, [cookies]);

  const setMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLoginClick = ()=>{

    if(token){
      removeCookie("access_token");
      setToken("")
      localStorage.clear();
    }else{
      navigate('/auth');
    }
  }

  return (
    <div className="w-screen min-h-20 flex justify-between items-center bg-black text-white p-4 md:px-6">
      <div>
        <h1 className="text-4xl font-bold">Tech Store</h1>
      </div>

      <div onClick={setMenu} className="absolute right-8 z-[1] md:hidden">
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </div>

      <ul
        className={`flex bg-black md:static justify-center items-center w-full md:w-auto pb-4 md:py-0 md:flex-row top-20 left-0 md:top-0 md:gap-4 text-xl absolute flex-col ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <li className="hover:opacity-70 flex items-center justify-center w-full md:border-none border-t-2 border-b-2 border-gray-600">
          <NavLink
            className="w-full p-2 flex items-center justify-center h-full"
            to="/"
          >
            Shop
          </NavLink>
        </li>
        <li className="hover:opacity-70 flex items-center justify-center w-full md:border-none border-b-2 border-gray-600">
          <NavLink
            className="w-full p-2 flex items-center justify-center h-full"
            to="/purchased-items"
          >
            Purchases
          </NavLink>
        </li>
        <li className="hover:opacity-70 w-full md:w-auto">
          <NavLink
            className="w-full p-2 flex items-center justify-center h-full"
            to="/checkout"
          >
            <ShoppingCartIcon />
          </NavLink>
        </li>
        <motion.li
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.1 }}
          className="hover:opacity-70 flex items-center justify-center w-full md:border-none border-b-2 border-gray-600 cursor-pointer font-semibold bg-blue-800 rounded-md p-2 text-center"
          onClick={()=>{handleLoginClick()}}
        >
          {token ? "Logged Out" : "Log In"}
        </motion.li>
      </ul>
    </div>
  );
};

export default NavBar;
