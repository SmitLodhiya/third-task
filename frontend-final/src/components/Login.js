import axios from "axios";
import React, { useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../Contexts/Usercontext";



const requestOTP = async (email) => {
  // Call backend to send OTP
  console.log(email);
  const res=await axios.post('/send-otp', { email });
  console.log(res);
};
function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info,setInfo]=useState("");
  const [redirect, setRedirect] = useState(false);
  const {login} =useUser();
  async function handleLoginSumbit(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post(
        "/login",
        { email, password },
      );
      console.log(data);
      setInfo(data.info);
      alert("logged in sucessfully");
      setRedirect(true);
      login(email);
    }catch(e){
      if (e.response) {
          // Displaying the error message from backend if it exists
          alert(e.response.data.message);
      } else {
          // A generic message or another error handling logic
          alert("An error occurred while trying to log in.");
      }
    }
  }

  if (redirect) {
    const userAgent=navigator.userAgent;
    console.log(userAgent);
    if(info.browser==="Chrome"){
      requestOTP(email);
      return <Navigate replace to={"/verify-otp"}/>
    }
    else if (info.browser==="Edge") {
      return <Navigate replace to={"/home"} />; // Directly go to home if Edge
    }
    
  }
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Log in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLoginSumbit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value);
                }}
                autoComplete="email"
                required
                className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2.5"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-primary hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(ev) => {
                  setPassword(ev.target.value);
                }}
                autoComplete="current-password"
                required
                className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2.5"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            href="#"
            className="font-semibold leading-6 text-primary hover:text-indigo-500"
          >
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Loginpage;
