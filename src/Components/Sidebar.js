import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import stilogo from "../Images/stilogo.png";

function Sidebar({ setSelectedPage }) {
  const [activeBar, setActiveBar] = useState("dashboard");
  const [dropdown, setDropDown] = useState("armadillo tralala");
  const navigate = useNavigate();

  const NavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="bg-blue-600 w-full h-screen flex flex-col content-center items-center p-10">
        <div className="flex flex-row text-blue-400">
          <img className="rounded-xl shadow-xl h-[200px] " src={stilogo} />
        </div>
        <div className=" py-10  flex flex-col   w-full">
          <div className="py-3 z-20 bg-blue-600">
            <button
              onClick={() => {
                setSelectedPage("dashboard");
                setActiveBar("dashboard");
              }}
              className={` ${
                activeBar === "dashboard" ? "bg-blue-700 pl-10 shadow-md" : ""
              } z-20 flex overflow-hidden hover:pl-10 w-full hover:bg-blue-700 hover:shadow-md px-8 py-3 rounded-xl transition-all gap-6 text-xl font-kanit text-white text-left `}
            >
              <motion.div
                className=" flex flex-c gap-6"
                initial={{ x: -400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
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
                <div className="text-left ">Dashboard</div>
              </motion.div>
            </button>
          </div>

          <button
            onMouseEnter={() => setDropDown("bookmanager")}
            onMouseLeave={() => setDropDown("Armadilo tralala")}
            className={`'  ${
              activeBar === "bookmanager"
                ? "bg-blue-700 pl-10 shadow-md"
                : "bg-blue-600"
            } flex z-30 relative hover:pl-10 w-full hover:bg-blue-700 hover:shadow-md px-8  py-3 hover:rounded-xl transition-all gap-6 text-xl font-kanit text-white text-left'`}
          >
            <motion.div
              className=" flex flex-c gap-6"
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-9"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clip-rule="evenodd"
                />
              </svg>

              <div className="flex flex-row justify-between items-center content w-full">
                <div className="">
                  <div>Book Manager</div>
                </div>

                <div
                  className={`absolute right-5 transition-all ml-5 ${
                    dropdown === "bookmanager" ? "rotate-90" : ""
                  } `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </button>

          <div
            onMouseEnter={() => setDropDown("bookmanager")}
            onMouseLeave={() => setDropDown("Armadilo tralala")}
            className={`' ${
              dropdown === "bookmanager" ? "-mt-0 duration-500 pt-1 " : "-mt-36"
            }  flex flex-col text-xl transition-all z-10 absolute'`}
          >
            <div
              onClick={() => {
                setSelectedPage("borrowing");
                setActiveBar("bookmanagers");
              }}
              className={`" ${
                activeBar === "bookmanagers"
                  ? "bg-blue-700 pl-10 shadow-md"
                  : ""
              } mt-3 text-white hover:shadow-md rounded-xl hover:bg-blue-700 hover:pl-10 font-kanit cursor-pointer transition-all px-8 py-3 w-full "`}
            >
              Borrowing
            </div>
            <div
              onClick={() => {
                setSelectedPage("bookm");
                setActiveBar("booktr");
              }}
              className={`" ${
                activeBar === "booktr" ? "bg-blue-700 pl-10 shadow-md" : ""
              } } text-white hover:shadow-md mt-1 rounded-xl hover:bg-blue-700 hover:pl-10 font-kanit cursor-pointer transition-all px-8 py-3 w-full "`}
            >
              Book Registration
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedPage("blog");
              setActiveBar("blog");
            }}
            className={` ${
              activeBar === "blog" ? "bg-blue-700 pl-10 shadow-md" : ""
            } mt-8 flex mb-3 hover:pl-10 overflow-hidden w-full hover:bg-blue-700 hover:shadow-md  px-8 py-3 rounded-xl transition-all gap-6 text-xl font-kanit text-white text-left`}
          >
            <motion.div
              className=" flex flex-c gap-6"
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
              </svg>

              <div className="text-left ">Book Logs</div>
            </motion.div>
          </button>

          <div className="bg-blue-600 relative   z-20">
            <button
              onClick={() => {
                setSelectedPage("admin");
                setActiveBar("admin");
              }}
              className={` ${
                activeBar === "admin" ? "bg-blue-700 pl-10 shadow-md" : ""
              } flex mb-3 hover:pl-10 overflow-hidden w-full hover:bg-blue-700 hover:shadow-md  px-8 py-3 rounded-xl transition-all gap-6 text-xl font-kanit text-white text-left`}
            >
              <motion.div
                className=" flex flex-c gap-6"
                initial={{ x: -400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
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
                <div className="text-left ">Account Registration</div>
              </motion.div>
            </button>

            <button
              onClick={() => {
                setSelectedPage("reports");
                setActiveBar("reports");
              }}
              className={` ${
                activeBar === "reports" ? "bg-blue-700 pl-10 shadow-md" : ""
              } flex mb-3 overflow-hidden hover:pl-10 w-full hover:bg-blue-700 hover:shadow-md px-8 py-3 rounded-xl transition-all gap-6 text-xl font-kanit text-white text-left`}
            >
              <motion.div
                className=" flex flex-c gap-6"
                initial={{ x: -400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
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

                <div className="text-left ">Account Manager</div>
              </motion.div>
            </button>
            {/* <button
              onClick={() => {
                setSelectedPage("tablemanager");
                setActiveBar("tablemanager");
              }}
              className={`'  ${
                activeBar === "tablemanager"
                  ? "bg-blue-700 pl-10 shadow-md"
                  : ""
              } flex mb-3 overflow-hidden hover:pl-10 w-full hover:bg-blue-700 hover:shadow-md px-8 py-3 rounded-xl transition-all gap-6 text-xl font-kanit text-white text-left'`}
            >
              <motion.div
                className=" flex flex-c gap-6"
                initial={{ x: -400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path d="M16.5 6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3v-6A4.5 4.5 0 0 1 10.5 6h6Z" />
                  <path d="M18 7.5a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-7.5a3 3 0 0 1-3-3v-7.5a3 3 0 0 1 3-3H18Z" />
                </svg>

                <div className="text-left ">Table Availability</div>
              </motion.div>
            </button>
            <button
              onClick={() => {
                setSelectedPage("computeravailability");
                setActiveBar("computeravailability");
              }}
              className={`'  ${
                activeBar === "computeravailability"
                  ? "bg-blue-700 pl-10 shadow-md"
                  : ""
              } flex mb-3 overflow-hidden hover:pl-10 w-full hover:bg-blue-700 hover:shadow-md px-8 py-3 rounded-xl transition-all gap-6 text-xl font-kanit text-white text-left'`}
            >
              <motion.div
                className=" flex flex-c gap-6"
                initial={{ x: -400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z"
                    clip-rule="evenodd"
                  />
                </svg>

                <div className="text-left ">Computer Availability</div>
              </motion.div>
            </button> */}

            <button
              onMouseEnter={() => setDropDown("accountsettings")}
              onMouseLeave={() => setDropDown("Armadilo tralala")}
              className={`'  ${
                activeBar === "accountsettings"
                  ? "bg-blue-700 pl-10 shadow-md"
                  : "bg-blue-600"
              } flex z-20 relative hover:pl-10 w-full hover:bg-blue-700 hover:shadow-md px-8  py-3 rounded-xl transition-all gap-6 text-xl font-kanit text-white text-left'`}
            >
              <motion.div
                className=" flex flex-c gap-6"
                initial={{ x: -400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
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

                <div className="flex flex-row justify-between items-center content w-full">
                  <div className="">
                    <div>Account Settings</div>
                  </div>

                  <div
                    className={`absolute right-5 transition-all ml-5 ${
                      dropdown === "accountsettings" ? "rotate-90" : ""
                    } `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </button>
          </div>

          <div
            onMouseEnter={() => setDropDown("accountsettings")}
            onMouseLeave={() => setDropDown("Armadilo tralala")}
            className={`' ${
              dropdown === "accountsettings"
                ? "-mt-0 duration-500 pt-1 "
                : "-mt-36"
            }  flex flex-col text-xl transition-all z-10 absolute'`}
          >
            <div
              onClick={() => setSelectedPage("settings")}
              className="text-white hover:shadow-md rounded-md hover:bg-blue-700 hover:pl-10 font-kanit cursor-pointer transition-all px-8 py-3 w-full"
            >
              Settings
            </div>
            <div
              onClick={NavigateToLogin}
              className="text-white hover:shadow-md rounded-md hover:bg-red-600 hover:pl-10 font-kanit cursor-pointer transition-all px-8 py-3 w-full"
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
