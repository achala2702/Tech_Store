import {useState} from 'react'

const Auth = () => {

    const [heading, setHeading] = useState("Log In");
    const [errorPrompt, setErrorPrompt] = useState(""); 
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleLoginClick = ()=>{}

    const handleForgotPassword = ()=>{}

    const resetFields = ()=>{
        setUserName("")
        setName("")
        setPassword("")
        setConfirmPassword("")
        setErrorPrompt("")
      }
    
      const handleClickTags = (name) => {
        setHeading(name);
        resetFields();
      };

  return (
    <div className='w-screen flex flex-col items-center justify-center'>
        <div className='shadow-[0_0_8px_5px_rgba(0,0,0,0.1)] rounded-md flex md:w-1/2 xl:w-1/4 mb-4 flex-col items-center mt-10 py-4'>
            <h1 className='text-xl md:text-2xl xl:text-2xl font-semibold'>{heading}</h1>
            <form className="flex flex-col items-center w-11/12 gap-10">
          <input
            className="focus:outline-none w-full border-b-2 border-black text-gray-700"
            type="email"
            id="email"
            name="email"
            placeholder="email"
            required
            value={userName}
            onChange={(event)=>{setUserName(event.target.value)}}
          />
          <input
            className={`focus:outline-none border-b-2 w-full border-black text-gray-700 ${
              heading === "Log In" ? "hidden" : ""
            }`}
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(event)=>{setName(event.target.value)}}
          />
          <input
            className="focus:outline-none border-b-2 w-full border-black text-gray-700"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(event)=>{setPassword(event.target.value)}}
          />
          <input
            className={`focus:outline-none border-b-2 w-full border-black text-gray-700 ${
              heading === "Log In" ? "hidden" : ""
            }`}
            type="password"
            id="retype-password"
            name="retype-password"
            placeholder="Retype Password"
            value={confirmPassword}
            onChange={(event)=>{setConfirmPassword(event.target.value)}}
          />
          <p className={`${errorPrompt=== "" ? "hidden" : ""}`}>{errorPrompt}</p>
          <p className="...">Forgot your password? <span className="text-blue-500 cursor-pointer" onClick={handleForgotPassword}>Reset it here</span>.</p>
          <button
            className="text-black w-24 p-2 text-xs bg-white md:text-sm md:w-28 lg:w-32 lg:text-lg hover:bg-black hover:text-white md:p-4 border-2 border-black"
            onClick={handleLoginClick}
          >
            {heading}
          </button>
        </form>
        <div className="flex md:text-xl text-sm justify-between w-11/12 px-4 py-4">
          <p
            className={`cursor-pointer  ${
              heading === "Log In" ? "underline" : ""
            }`}
            onClick={() => handleClickTags("Log In")}
          >
            Login
          </p>
          <p
            className={`cursor-pointer  ${
              heading === "Sign Up" ? "underline" : ""
            }`}
            onClick={() => handleClickTags("Sign Up")}
          >
            Sign Up
          </p>
        </div>
        </div>
    </div>
  )
}

export default Auth