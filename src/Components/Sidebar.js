import React, { act, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import stilogo from "../Images/logobg.png";
import { getAuth, signOut } from "firebase/auth";

function Sidebar({ setSelectedPage }) {
  const [activeBar, setActiveBar] = useState("dashboard");
  const [dropdown, setDropDown] = useState("armadillo tralala");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const NavigateToLogin = () => {
    navigate("/login");
  };

  function handleLogout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  }

  const navigateToSystem = () => {
    navigate("/entrance");
  };

  return (
    <div>
      <div className="w-full h-screen flex flex-col content-center items-center p-10">
        <motion.div
          className="flex flex-row animate-float text-blue-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            y: [15, -15, 15],
            rotate: [-15, 15, -15],
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
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
          }}
        >
          <img className="rounded-xl h-[200px] " src={stilogo} />
        </motion.div>
        <div className=" py-10  flex flex-col gap-2 text-xl  font-kanit w-full">
          <div
            onClick={() => {
              setSelectedPage("dashboard");
              setActiveBar("dashboard");
              setOpen(false);
              setOpen2(false);
            }}
            className={`" ${
              activeBar === "dashboard"
                ? "bg-[#c0772a] text-white shadow-md pl-10"
                : "hover:bg-[#c0772a] hover:shadow-md hover:text-white hover:pl-10 "
            } transition-all gap-3 rounded-md w-full px-5  py-3 cursor-pointer flex "`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
                clip-rule="evenodd"
              />
            </svg>
            Dashboard
          </div>

          <div className="w-full">
            <button
              onClick={() => {
                setActiveBar("bookmanager");
                setOpen(!open);
                setOpen2(false);
              }}
              className={`" ${
                activeBar === "bookmanager" ||
                activeBar === "borrowing" ||
                activeBar === "bookr" ||
                activeBar === "blog"
                  ? "bg-[#c0772a] text-white pl-10"
                  : "hover:pl-10"
              } w-full transition-all items-center hover:text-white gap-3 flex px-5 py-3 rounded-md hover:bg-[#c0772a] "`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clip-rule="evenodd"
                />
              </svg>
              Book Manager
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  key="dropdown"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-[#c0772a] shadow-md rounded-lg mt-2"
                >
                  <ul className="flex flex-col">
                    <li
                      onClick={() => {
                        setSelectedPage("borrowing");
                        setActiveBar("borrowing");
                      }}
                      className={`" ${
                        activeBar === "borrowing" ? "pl-10" : ""
                      }  px-4 py-2 hover:bg-[#ac7132] hover:pl-10 transition-all text-white cursor-pointer "`}
                    >
                      Borrowing
                    </li>
                    <li
                      onClick={() => {
                        setSelectedPage("bookm");
                        setActiveBar("bookr");
                      }}
                      className={`" ${
                        activeBar === "bookr" ? "pl-10" : ""
                      } px-4 py-2 hover:bg-[#ac7132] hover:pl-10 transition-all text-white cursor-pointer "`}
                    >
                      Book Registration
                    </li>
                    <li
                      onClick={() => {
                        setSelectedPage("blog");
                        setActiveBar("blog");
                      }}
                      className={`" ${
                        activeBar === "blog" ? "pl-10" : ""
                      } px-4 py-2 hover:bg-[#ac7132] hover:pl-10 transition-all text-white cursor-pointer "`}
                    >
                      Book Logs
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            onClick={() => {
              setSelectedPage("admin");
              setActiveBar("admin");
              setOpen(false);
              setOpen2(false);
            }}
            className={`" ${
              activeBar === "admin"
                ? "bg-[#c0772a] text-white shadow-md pl-10"
                : "hover:bg-[#c0772a] hover:shadow-md hover:text-white hover:pl-10 "
            } transition-all gap-3 rounded-md w-full px-5  py-3 cursor-pointer flex "`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
                clip-rule="evenodd"
              />
            </svg>
            Account Registration
          </div>
          <div
            onClick={() => {
              setSelectedPage("reports");
              setActiveBar("bookm");
              setOpen(false);
              setOpen2(false);
            }}
            className={`" ${
              activeBar === "bookm"
                ? "bg-[#c0772a] text-white shadow-md pl-10"
                : "hover:bg-[#c0772a] hover:shadow-md hover:text-white hover:pl-10 "
            } transition-all gap-3 rounded-md w-full px-5  py-3 cursor-pointer flex "`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
                clip-rule="evenodd"
              />
            </svg>
            Account Manager
          </div>

          <div
            className={`" ${
              activeBar === "entrance" || activeBar === "entrance2"
                ? "bg-[#c0772a] text-white pl-10"
                : "hover:pl-10"
            } w-full transition-all cursor-pointer items-center hover:text-white gap-3 flex px-5 py-3 rounded-md hover:bg-[#c0772a] "`}
            onClick={navigateToSystem}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z"
                clip-rule="evenodd"
              />
            </svg>

            <div>Entrance System</div>
          </div>

          <div className="w-full">
            <button
              onClick={() => {
                setActiveBar("settings");
                setOpen2(!open2);
                setOpen(false);
              }}
              className={`" ${
                activeBar === "settings" || activeBar === "settings2"
                  ? "bg-[#c0772a] text-white pl-10"
                  : "hover:pl-10"
              } w-full transition-all items-center hover:text-white gap-3 flex px-5 py-3 rounded-md hover:bg-[#c0772a] "`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clip-rule="evenodd"
                />
              </svg>
              Account Settings
            </button>
            <AnimatePresence>
              {open2 && (
                <motion.div
                  key="dropdown"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-[#c0772a] text-white shadow-md rounded-lg mt-2"
                >
                  <ul className="flex flex-col">
                    <li
                      onClick={() => {
                        setSelectedPage("settings");
                        setActiveBar("settings2");
                      }}
                      className={`" ${
                        activeBar === "settings2" ? "pl-10" : ""
                      } hover:pl-10 px-4 py-2 hover:bg-[#ac7132] transition-all cursor-pointer "`}
                    >
                      Settings
                    </li>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-[#ac7132] transition-all cursor-pointer"
                    >
                      Logout
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
