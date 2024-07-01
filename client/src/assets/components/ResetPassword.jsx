import {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorPrompt, setErrorPrompt] = useState("");
    const {token} = useParams();

    const navigate = useNavigate();

    //backend url
    const url = import.meta.env.VITE_SERVER_URL_USER;

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,24}$/;

    const resetFileds = ()=>{
        setConfirmPassword("");
        setPassword("");
        setErrorPrompt("");
    }

    const handleClick = async (e)=>{
        e.preventDefault();


        if(!passwordPattern.test(password)){
            setErrorPrompt("Password must be 8-24 characters long, contain at least one number, and one uppercase letter");
            return;
        }
        if(password !== confirmPassword){
            setErrorPrompt("Passwords does not match!");
            return;
        }

        try{

            const response = await axios.put(`${url}/reset-password/${token}`, {password});
           
            setErrorPrompt(response.data.message);

            if(response.status ===200){
                setTimeout(()=>{
                    resetFileds();
                    navigate("/auth")
                }, 2000)
            }

        }catch(error){
            console.log(error)
            setErrorPrompt(error.response.data.message)
            setTimeout(()=>{
                resetFileds();
            }, 2000)
        }

    }

  return (
    <div className="w-full pt-28 max-[767px]:pt-16 bg-white flex flex-col justify-center h-screen items-center overflow-hidden max-[767px]:pb-6 md:pb-10">
    <div className="rounded-md md:w-1/2 xl:w-1/4 max-[767px]:w-11/12 p-4 flex py-10 flex-col items-center shadow-[0_0_8px_5px_rgba(0,0,0,0.1)]">
      <h1 className="text-2xl font-semibold xl:text-3xl pb-6 md:pb-10">
        Reset Password
      </h1>
      <form className="flex flex-col items-center w-11/12 gap-10">

        <input
          className={`focus:outline-none border-b-2 w-full border-black text-gray-700`}
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input
          className={`focus:outline-none border-b-2 w-full border-black text-gray-700`}
          type="password"
          id="retype-password"
          name="retype-password"
          placeholder="Retype Password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
          }}
        />
        <p className={`${errorPrompt === null ? "hidden" : ""}`}>
          {errorPrompt}
        </p>
        <button
          className="text-black max-[767px]:w-24 max-[767px]:p-2 max-[767px]:text-xs bg-white md:text-sm md:w-28 lg:w-32 lg:text-lg hover:bg-black hover:text-white md p-4 border-2 border-black"
          onClick={handleClick}
        >
          Confirm
        </button>
      </form>
    </div>
  </div>
  )
}

export default ResetPassword