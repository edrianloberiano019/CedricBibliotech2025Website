import React, { useState } from "react";
import PeopleBackground from "../Images/logobg.png";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { toast } from "react-toastify";
import stilogo from "../Images/stilogo.png";
import { AnimatePresence, motion } from "framer-motion";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import Lottie from "lottie-react";
import Book from "../animations/Book.json";
import Book3 from "../animations/Open book.json";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [resetPassword, setResetPassword] = useState(false);
  const [emails, setEmails] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [targetUserId, setTargetUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
        } else if (userData.accessLevel === "Student") {
          toast.error("Student account is not allowed to this portal.");
        } else {
          toast.error("Unknown access level! sino ka?");
        }
      } else {
        toast.error(
          "Invalid credentials. Please check your email and password."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFindEmail = async (e) => {
    e.preventDefault();

    setLoading2(true);
    if (!resetEmail) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const q = query(
        collection(db, "StudentAccount"),
        where("email", "==", resetEmail)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("No account found with that email.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      setTargetUserId(userDoc.id);
      setEmails(false);
      setResetPassword(true);
      toast.success("Account found! You may now reset your password.");
    } catch (err) {
      console.error("Error finding email:", err);
      toast.error("Error finding account. Try again.");
    } finally {
      setLoading2(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading2(true);
    if (!targetUserId) {
      toast.error("Something went wrong. Please re-enter your email.");
      setLoading2(false);
      return;
    }

    if (!currentPass || !newPass || !confirmPass) {
      toast.error("Please fill in all password fields.");
      setLoading2(false);
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("New passwords do not match.");
      setLoading2(false);
      return;
    }

    try {
      const userRef = doc(db, "StudentAccount", targetUserId);
      const q = query(
        collection(db, "StudentAccount"),
        where("email", "==", resetEmail),
        where("password", "==", currentPass)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Incorrect current password.");
        return;
      }

      await updateDoc(userRef, {
        password: newPass,
      });

      setResetPassword(false);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      setResetEmail("");
      toast.success("Password reset successfully!");
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("Failed to reset password. Try again.");
    } finally {
      setLoading2(false);
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
                className="rounded-l-xl hidden xl:block h-full shadow-xl"
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
              <div className="border mt-3 items-center border-solid py-4 px-4 rounded-md border-gray-400 flex">
                <input
                  className="bg-white text-lg w-full focus:outline-none"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <div className="w-6 h-6 text-gray-600 cursor-pointer">
                    <svg
                      onClick={() => setShowPassword(false)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 text-gray-600 cursor-pointer">
                    <svg
                      onClick={() => setShowPassword(true)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="w-full flex justify-end">
                <div onClick={() => setEmails(true)} className="cursor-pointer">
                  Forgot Password?
                </div>
              </div>
              <button
                disabled={loading}
                className={`${
                  loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "hover:bg-[#c0772a] cursor-pointer"
                } bg-[#f5b066] mt-6 rounded-md py-4  transition-all  px-4 text-black hover:text-white font-semibold`}
              >
                {loading ? (
                  <div className="flex justify-center">
                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
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
            scale: { duration: 1.5, type: "spring" },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="-rotate-12">
            <Lottie animationData={Book} loop autoplay />
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
            scale: { duration: 1.5, type: "spring", delay: 0.2 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          }}
        >
          <div className="rotate-12">
            <Lottie animationData={Book3} loop autoplay />
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {emails && (
          <motion.div className="absolute top-0 z-50 left-0 text-center w-full h-full flex justify-center content-center items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmails(false)}
              className="absolute cursor-pointer top-0 left-0 w-full backdrop-blur-sm h-full z-20 bg-black/40"
            ></motion.div>
            <motion.div
              className="bg-gray-100 z-30 rounded-md overflow-hidden gap-3 flex flex-col shadow-md"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <div className="text-2xl py-6 px-8 bg-gray-300 font-black uppercase">
                Enter your email
              </div>
              <form
                onSubmit={handleFindEmail}
                className="px-4 flex flex-col gap-3 mt-3"
              >
                <div className="px-3 flex py-2 bg-white rounded-md border">
                  <input
                    className="w-full focus:outline-none"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    type="email"
                    required
                  />
                </div>
                <div className="flex mt-3 pb-6 justify-end gap-3">
                  <div
                    onClick={() => setEmails(false)}
                    className="py-2 px-3 bg-red-600 cursor-pointer text-white hover:bg-red-700 rounded-md shadow-sm"
                  >
                    Cancel
                  </div>
                  <button
                    type="submit"
                    className=" text-white  rounded-md shadow-sm"
                    disabled={loading2}
                  >
                    {loading2 ? (
                      <div className=" py-2.5 rounded-md px-7 cursor-not-allowed bg-gray-400 ">
                        <div className="border-t-2 rounded-full animate-spin border-gray-600 w-5 h-5 "></div>
                      </div>
                    ) : (
                      <div className="py-2 px-3 rounded-md bg-green-600 cursor-pointer hover:bg-green-700">
                        Submit
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resetPassword && (
          <motion.div className="absolute top-0 z-50 left-0 text-center w-full h-full flex justify-center content-center items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResetPassword(false)}
              className="absolute cursor-pointer top-0 left-0 w-full backdrop-blur-sm h-full z-20 bg-black/40"
            ></motion.div>
            <motion.div
              className="bg-gray-100 z-30 rounded-md overflow-hidden gap-3 flex flex-col shadow-md"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <div className="text-2xl py-6 px-8 bg-gray-300 font-black uppercase">
                Reset your password
              </div>
              <div className="px-4 flex flex-col gap-3 mt-3">
                <div className="px-3 flex py-2 bg-white rounded-md border">
                  <input
                    className="w-full focus:outline-none"
                    type="password"
                    placeholder="Current Password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />
                </div>

                <div className="px-3 flex py-2 bg-white rounded-md border">
                  <input
                    className="w-full focus:outline-none"
                    type="password"
                    placeholder="New Password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>

                <div className="px-3 flex py-2 bg-white rounded-md border">
                  <input
                    className="w-full focus:outline-none"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>

                <div className="flex mt-3 pb-6 justify-end gap-3">
                  <div
                    onClick={() => setResetPassword(false)}
                    className="py-2 px-3 bg-red-600 cursor-pointer text-white hover:bg-red-700 rounded-md shadow-sm"
                  >
                    Cancel
                  </div>
                  <div
                    onClick={handleResetPassword}
                    className=" text-white  rounded-md shadow-sm"
                  >
                    {loading2 ? (
                      <div className=" py-2.5 rounded-md px-7 cursor-not-allowed bg-gray-400 ">
                        <div className="border-t-2 rounded-full animate-spin border-gray-600 w-5 h-5 "></div>
                      </div>
                    ) : (
                      <div className="py-2 px-3 rounded-md bg-green-600 cursor-pointer hover:bg-green-700">
                        Submit
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
