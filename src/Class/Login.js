import React, { useState } from "react";
import PeopleBackground from "../Images/logobg.png";
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
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (!email || !password) {
        toast.error("Please enter both email and password.");

        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "StudentAccount"),
        where("email", "==", email),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        localStorage.setItem("user", JSON.stringify(userData));

        if (
          userData.accessLevel === "Admin" ||
          userData.accessLevel === "Staff"
        ) {
          navigate("/dashboard");
          setLoading(false);
        } else if (userData.accessLevel === "Student") {
          setLoading(false);
          toast.error("Student account is not allowed to this portal.");
        } else {
          setLoading(false);
          toast.error("Unknown access level! sino ka?")
        }
      } else {
        setLoading(false);
        toast.error("Invalid credentials. Please check your email and password.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);
      toast.error(`Login failed: ${err.message}`);
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
        <div className="bg-[#f5b066] bg-opacity-80 backdrop-blur-sm absolute top-0 left-0 w-full h-full"></div>
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
            <div className="w-full flex justify-end">
              <div className="cursor-pointer">Forgot Password?</div>
            </div>
            <button disabled={loading} className={`" ${loading ? "bg-gray-300 cursor-not-allowed" : "hover:bg-[#c0772a] cursor-pointer"} bg-[#f5b066] mt-6 rounded-md py-4  transition-all  px-4 text-black hover:text-white font-semibold "`}>
              {loading ? (
                <div className="flex justify-center">
                  <div className="border-r-2 border-white h-6 w-6 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div>Log In</div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
