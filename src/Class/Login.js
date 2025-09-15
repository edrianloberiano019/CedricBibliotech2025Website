import React, { useState } from "react";
import PeopleBackground from "../Images/logobg.png";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { toast } from "react-toastify";
import stilogo from "../Images/stilogo.png";
import { delay, motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import Lottie from "lottie-react";
import Book from "../animations/Book.json";
import Book2 from "../animations/Book animation.json";
import Book3 from "../animations/Open book.json";

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
          toast.error("Unknown access level! sino ka?");
        }
      } else {
        setLoading(false);
        toast.error(
          "Invalid credentials. Please check your email and password."
        );
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
          className="w-full  h-screen object-contain py-20 absolute top-0 left-0 z-0"
          src={PeopleBackground}
          alt="walking people"
        />
        <div className="bg-gradient-to-r from-[#f5b066]/80 via-[#259048]/80 to-[#f5b066]/80 bg-[length:300%_300%] backdrop-blur-[8px] animate-gradient  flex justify-center items-center content-center bg-opacity-10 absolute top-0 left-0 w-full h-full"></div>
      </div>

      <div className="relative overflow-hidden z-20 h-screen">
        <motion.div
          className="absolute flex flex-row top-0 w-full  h-full justify-center content-center items-center "
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <div className="h-[400px] flex flex-row w-full justify-center content-center items-center">
            <div className="flex h-full">
              <img
                className="rounded-l-xl  hidden xl:block  h-full shadow-xl"
                src={stilogo}
              />
            </div>
            <form
              onSubmit={handleLogin}
              className="flex flex-col w-[500px] rounded-l-xl xl:rounded-l-none h-full shadow-lg bg-white rounded-r-xl p-10"
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
              <button
                disabled={loading}
                className={`" ${
                  loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "hover:bg-[#c0772a] cursor-pointer"
                } bg-[#f5b066] mt-6 rounded-md py-4  transition-all  px-4 text-black hover:text-white font-semibold "`}
              >
                {loading ? (
                  <div className="flex justify-center">
                    <div className=" h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
                  </div>
                ) : (
                  <div className="animate-float">Log In</div>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
      <div className="absolute top-0 justify-start items-center flex content-center z-10 w-full h-full">
        <motion.div
          className="w-48 h-48 ml-24 "
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            y: [0, -20, 0],
            opacity: 1,
          }}
          transition={{
            x: { duration: 1, ease: "easeOut" },
            scale: { duration: 1.5, type: "spring" },
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: { duration: 1 },
          }}
        >
          <div className=" -rotate-12">
            <Lottie animationData={Book} loop={true} autoplay={true}></Lottie>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-0 justify-end overflow-hidden items-center flex content-center z-10 right-0 w-full h-full">
        <motion.div
          className="w-96 h-96"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            y: [0, -20, 0],
            opacity: 1,
          }}
          transition={{
            x: { duration: 1, ease: "easeOut" },
            scale: { duration: 1.5, type: "spring", delay: 0.2 },
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
            opacity: { duration: 1 },
          }}
        >
          <div className=" rotate-12">
            <Lottie animationData={Book3} loop={true} autoplay={true}></Lottie>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
