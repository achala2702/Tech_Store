import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [errorPrompt, setErrorPrompt] = useState("");
  const [email, setEmail] = useState("");

  //backend url
  const url = import.meta.env.VITE_SERVER_URL_USER;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearFields = () => {
    setErrorPrompt("");
    setEmail("");
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!emailPattern.test(email)) {
      setErrorPrompt("Please enter a valid email address");
      return;
    }
    try {
      const response = await axios.post(`${url}/forgot-password`, {
        email,
      });

      setErrorPrompt(response.data.message);

      setTimeout(() => {
        clearFields();
      }, 2000);
    } catch (error) {
      setErrorPrompt(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="w-full pt-28 max-[767px]:pt-16 bg-white flex flex-col justify-center h-screen items-center overflow-hidden max-[767px]:pb-6 md:pb-10">
      <div className="rounded-md md:w-1/2 xl:w-1/4 max-[767px]:w-11/12 p-4 flex py-10 flex-col items-center shadow-[0_0_8px_5px_rgba(0,0,0,0.1)]">
        <h1 className="text-2xl font-semibold xl:text-3xl pb-6 md:pb-10">
          Reset Password
        </h1>
        <form className="flex flex-col items-center w-11/12 gap-10">
          <input
            className={`focus:outline-none w-full border-b-2 border-black text-gray-700`}
            type="email"
            id="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <p className={`${errorPrompt === null ? "hidden" : ""}`}>
            {errorPrompt}
          </p>
          <button
            className="text-black max-[767px]:w-24 max-[767px]:p-2 max-[767px]:text-xs bg-white md:text-sm md:w-28 lg:w-32 lg:text-lg hover:bg-black hover:text-white md p-4 border-2 border-black"
            onClick={handleClick}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
