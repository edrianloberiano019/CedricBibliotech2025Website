import React, { useState } from "react";
import PeopleBackground from "../Images/LoginBackgroundSTILOGO.png";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { toast } from "react-toastify";
import stilogo from "../Images/stilogo.png";

import { collection, query, where, getDocs } from "firebase/firestore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const NavigateToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        collection(db, "StudentAccount"),
        where("email", "==", email),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="overflow-hidden h-screen">
      <div className="">
        <img
          className="w-full h-screen object-contain py-20 absolute top-0 left-0 z-0"
          src={PeopleBackground}
          alt="walking people"
        />
        <div className="bg-blue-600 bg-opacity-80 backdrop-blur-sm absolute top-0 left-0 w-full h-full"></div>
      </div>
      <div className="absolute flex flex-row top-0 w-full  h-full justify-center content-center items-center ">
        <div className="h-[400px] flex flex-row w-full justify-center content-center items-center">
          <div className="flex h-full">
            <img className="rounded-l-xl h-full shadow-xl" src={stilogo} />
          </div>
          <form
            onSubmit={handleLogin}
            className="flex flex-col w-[500px] h-full shadow-lg bg-white rounded-r-xl p-10"
          >
            <div className="text-lg font-semibold">Log In</div>
            <input
              className="mt-6 bg-white border border-solid rounded-md text-lg py-4 border-gray-400 px-4"
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="mt-3 bg-white border border-solid rounded-md text-lg py-4 border-gray-400 px-4"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-600 mt-6 rounded-md py-4 hover:bg-blue-700 transition-all  px-4 text-white font-semibold">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
