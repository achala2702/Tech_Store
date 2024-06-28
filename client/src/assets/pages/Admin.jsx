import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductDetails from "../components/ProductDetails";
import AddEditProducts from "../components/AddEditProducts";

const Admin = () => {
  const [cookies, _,removeCookie] = useCookies(["access_token"]);
  const [decoded, setDecoded] = useState('')
  const navigate = useNavigate();

  const token = cookies.access_token;

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          alert("Your session has expired. Please log in again.");
          removeCookie("access_token");
          navigate("/auth");
          return;
        }

        if (!decodedToken.admin) {
          alert("You do not have access to this page!");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        alert("Invalid token. Please log in again.");
        removeCookie("access_token");
        navigate("/auth");
      }
    } else {
      alert("You do not have access to this page!");
      navigate("/auth");
    }
  }, []);

  return (
    <div className="py-6">
      {decoded.admin ? (
        <div className="gap-4 w-full flex flex-col items-center">
          <AddEditProducts token={token}/>
          <ProductDetails token={token}/>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Admin;
