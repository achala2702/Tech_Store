import { Routes, Route } from "react-router-dom";
import NavBar from "./assets/components/NavBar";
import Purchased_items from "./assets/pages/Purchased_items";
import Auth from "./assets/pages/Auth";
import Shop from "./assets/pages/Shop";
import Checkout from "./assets/pages/Checkout";
import ForgotPassword from "./assets/components/ForgotPassword"
import ResetPassword from "./assets/components/ResetPassword"
import Admin from "./assets/pages/Admin";

function App() {

  return (
    <>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Shop/>}></Route>
      <Route path="/auth" element={<Auth/>}></Route>
      <Route path="/purchased-items" element={<Purchased_items/>}></Route>
      <Route path="/checkout" element={<Checkout/>}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
      <Route path="/admin" element={<Admin/>}></Route>
    </Routes>
    </>
  )
}

export default App
