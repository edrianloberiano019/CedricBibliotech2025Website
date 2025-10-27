import { AnimatePresence, useScroll } from "framer-motion";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  query,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function Admin() {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [dropdown, setDropDown] = useState("tago");
  const [dropdown2, setDropDown2] = useState("tago");
  const [year, setYear] = useState("Select year level");
  const [grade, setGrade] = useState("Select grade level");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("caloocan");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [age, setAge] = useState("");
  const [Patronnumber, setPatronNumber] = useState("02000");
  const [confirmpassword, setConfirmPassword] = useState("caloocan");
  const [accessLevel, setAccessLevel] = useState("Patron");
  const [scanID, setScanID] = useState(false);
  const [permission, setPermission] = useState("Access Granted");
  const [uid, setUid] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [transit, setTransit] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [delets, setDelets] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [once, setOnce] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const storedUser = localStorage.getItem("access");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const q = query(collection(db, "StudentAccount"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(data);
        console.log("Accounts fetched:", data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchUID = async () => {
      try {
        const res = await fetch("http://10.222.56.131/uid");
        const data = await res.json();
        if (data.uid) {
          setUid(data.uid.toUpperCase());
        }
      } catch (err) {
        console.error(err);
        setUid("Error connecting to ESP");
      }
    };
    const interval = setInterval(fetchUID, 100);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const Patronnumber = e.target.value;
    if (/^\d*$/.test(Patronnumber)) {
      setPatronNumber(Patronnumber);
    }
  };

  const handleChange2 = (e) => {
    const age = e.target.value;
    if (/^\d*$/.test(age)) {
      setAge(age);
    }
  };

  // const settingsForAccessLevel = () => {
  //   setAccessLevel["Admin", "Patron"]
  // }

  // useEffect(() => {}, []);

  const confirmationScanning = (e) => {
    e.preventDefault();
    if (
      (accessLevel !== "Admin" && accessLevel !== "Staff") ||
      password === confirmpassword
    ) {
      if (
        (accessLevel !== "Admin" && accessLevel !== "Staff") ||
        password.length > 6
      ) {
        if (!/\d/.test(middlename)) {
          setScanID(true);
        } else {
          toast.error("Middle name should not contain numbers.");
        }
      } else {
        toast.error("Password must be more than 6 characters.");
      }
    } else {
      toast.error("Password is not matched!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading2(true);

    try {
      const q = query(collection(db, "StudentAccount"));
      const querySnapshot = await getDocs(q);

      const existingUser = querySnapshot.docs.find(
        (doc) => doc.data().cardUID === uid
      );

      if (existingUser) {
        toast.error("This card or user already exists!");
        return;
      }

      await setDoc(doc(db, "StudentAccount", uid), {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        middlename: middlename,
        setPermission: permission,
        cardUID: uid,
        accessLevel: accessLevel,
        timein: null,
        timeout: null,
      });

      const response = await fetch(
        `http://10.222.56.131/write?accesslevel=${accessLevel}&permission=${permission}`
      );
      const result = await response.json();

      if (!result.status || !result.status.includes("Ready")) {
        toast.error("Card write failed!");
        return;
      }

      setScanID(false);
      setOnce(true);
      setEmail("");
      setPassword("");
      setAge("");
      setFirstname("");
      setLastname("");
      setPatronNumber("02000");
      setConfirmPassword("");
      setMiddlename("");
      setGrade("Select grade level");
      setYear("Select year level");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to register user.");
    } finally {
      setLoading2(false);
    }
  };

  const successz = () => {
    setOnce(false);
    toast.success("Successfully Created.");
  };

  const handleResetPassword = async () => {
    setLoading2(true);

    if (!newPass || !confirmPass) {
      toast.error("Please fill in all password fields.");
      setLoading2(false);
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("New passwords do not match.");
      setLoading2(false);
      return;
    }

    if (newPass.length <= 6) {
      toast.error("Password must be more than 6 characters.");
      setLoading2(false);
      return;
    }

    try {
      const userRef = doc(db, "StudentAccount", selectedAccount.cardUID);
      await updateDoc(userRef, {
        password: newPass,
      });

      setResetPassword(false);
      setNewPass("");
      setConfirmPass("");
      toast.success("Password reset successfully!");
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("Failed to reset password. Try again.");
    } finally {
      setLoading2(false);
    }
  };

  return (
    <motion.div
      className="p-10 h-screen overflow-hidden"
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full relative p-10 flex flex-col h-full bg-[#c0772a] rounded-xl">
        <div className="text-2xl font-kanit">
          <div className="text-white text-3xl uppercase">
            Account Registration
          </div>
        </div>
        <form
          onSubmit={confirmationScanning}
          className="mt-10 flex h-full  w-full flex-col justify-between text-xl text-white"
        >
          <div className="flex w-full">
            <div className="flex flex-col ">
              <div className="flex gap-3 flex-col text-sm ">
                <motion.div
                  className="flex flex-col min-w-[300px]  bg-gray-200 gap-2 text-black p-3 border border-gray-600 rounded-md shadow-md w-full h-full"
                  layout
                >
                  <div>
                    <div className="flex gap-2">
                      <div>Firstname: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <input
                      value={firstname}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^[^0-9]*$/.test(input)) {
                          setFirstname(input);
                        }
                      }}
                      className="px-5 py-2 rounded-md text-black w-full outline-none"
                      placeholder="Ex: John"
                      required
                    />
                  </div>

                  <div className="shadow-md">
                    <div className="flex gap-2">
                      <div>Lastname: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <input
                      value={lastname}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^[^0-9]*$/.test(input)) {
                          setLastname(input);
                        }
                      }}
                      className="px-5 py-2 rounded-md text-black w-full outline-none"
                      placeholder="Ex: Doe"
                      required
                    />
                  </div>

                  <div className="shadow-md">
                    <div className="flex gap-2">
                      <div>Middlename: </div>
                      <div className="text-red-500"></div>
                    </div>
                    <input
                      value={middlename}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^[^0-9]*$/.test(input)) {
                          setMiddlename(input);
                        }
                      }}
                      className="px-5 py-2 rounded-md text-black w-full outline-none"
                      placeholder="Ex: Sy"
                    />
                  </div>

                  <div className="flex gap-2">
                    {/* <div className="">
                    <div className="flex gap-2">
                      <div>ID Number: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <input
                      value={Patronnumber}
                      className="px-5 py-2 rounded-md text-black w-full outline-none"
                      maxLength={11}
                      minLength={10}
                      placeholder="Ex: 02000123456"
                      type="text"
                      inputMode="numeric"
                      onChange={handleChange}
                      required
                    />
                  </div> */}

                    {/* <div className="w-full">
                      <div className="flex gap-2 ">
                        <div>Age: </div>
                        <div className="text-red-500">*</div>
                      </div>
                      <input
                        className="px-5 py-2 w-full rounded-md text-black outline-none"
                        maxLength={3}
                        placeholder="Ex: 21"
                        type="text"
                        inputMode="numeric"
                        value={age}
                        onChange={handleChange2}
                        required
                      />
                    </div> */}
                  </div>

                  <div className="">
                    <div className="flex gap-2">
                      <div>Email: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-5 py-2 rounded-md text-black w-full outline-none"
                      type="email"
                      required
                      placeholder="Ex: JohnDoe@gmail.com"
                    />
                  </div>

                  <div className="">
                    {showPassword &&
                      (accessLevel === "Admin" || accessLevel === "Staff") && (
                        <motion.div className="flex flex-col text-sm gap-3">
                          <motion.div className="w-full">
                            <div className="flex gap-2">
                              <div>Password: </div>
                              <div className="text-red-500">*</div>
                            </div>
                            <motion.div>
                              <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-5 py-2 rounded-md text-black w-full outline-none"
                                placeholder="Enter your password"
                                type="password"
                                required
                              />
                            </motion.div>
                          </motion.div>

                          <motion.div className="w-full">
                            <div className="flex gap-2">
                              <div>Confirm Password: </div>
                              <div className="text-red-500">*</div>
                            </div>
                            <input
                              value={confirmpassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="px-5 py-2 rounded-md text-black w-full outline-none"
                              placeholder="Confirm your password"
                              type="password"
                              required
                            />
                          </motion.div>
                        </motion.div>
                      )}
                  </div>
                  {storedUser === "Admin" && (
                    <div>
                      <div className="">
                        <div className="overflow-hidden flex flex-col justify-end">
                          <div className="bg-gray-200  relative z-20 ">
                            <div className="flex gap-2 ">
                              <div>Select Access Level: </div>
                              <div className="text-red-500">*</div>
                            </div>
                            <div
                              onMouseEnter={() => setDropDown("show3")}
                              onMouseLeave={() => setDropDown("tago")}
                              className="pb-1 flex"
                            >
                              <div className="px-5 flex cursor-pointer transition-all py-2 rounded-md justify-between items-center text-black bg-white  outline-none">
                                <div
                                  className={`' ${
                                    accessLevel === "Select access level"
                                      ? "text-gray-400"
                                      : ""
                                  } mr-10 transition-all'`}
                                >
                                  {accessLevel}
                                </div>

                                <div
                                  className={` ${
                                    dropdown === "show3" ? "rotate-90" : ""
                                  } transition-all`}
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
                            </div>
                          </div>
                          <motion.div
                            onMouseEnter={() => setDropDown("show3")}
                            onMouseLeave={() => setDropDown("tago")}
                            className=" text-black py relative z-10"
                            initial={{ y: -200 }}
                            animate={{ y: dropdown === "show3" ? 0 : -200 }}
                            transition={{ duration: 1, type: "spring" }}
                          >
                            <div className=" bg-white  rounded-md overflow-hidden flex justify-start flex-col">
                              <div
                                onClick={() => {
                                  setAccessLevel("Patron");
                                  setTransit(true);
                                }}
                                className="px-5 py-2 hover:bg-gray-300 transition-all cursor-pointer "
                              >
                                Patron
                              </div>
                              <div
                                onClick={() => {
                                  setAccessLevel("Admin");
                                  setGrade("Select grade level");
                                  setYear("Select year level");
                                  setTransit(true);
                                }}
                                className="px-5 py-2 transition-all cursor-pointer hover:bg-gray-300 "
                              >
                                Admin
                              </div>
                              <div
                                onClick={() => {
                                  setAccessLevel("Staff");
                                  setGrade("Select grade level");
                                  setYear("Select year level");
                                  setTransit(true);
                                }}
                                className="px-5 py-2 transition-all cursor-pointer hover:bg-gray-300 "
                              >
                                Staff
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="">
                    <div className="flex w-full justify-end items-end">
                      <button
                        type="submit"
                        className="uppercase text-sm px-4 py-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700 transition-all"
                      >
                        submit
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="w-full flex items-end flex-col overflow-auto pl-5 h-full">
              <div className="pb-2 flex">
                <div className="border rounded-md border-gray-600 shadow-sm">
                  <input
                    placeholder="Search..."
                    className="py-2 pl-4 rounded-md text-black px-1 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid bg-gray-300  text-black px-3 gap-3 rounded-t-md py-2 text-sm font-bold uppercase grid-cols-5 w-full">
                <div>Full name:</div>
                <div>ID Number:</div>
                <div>Type:</div>
                <div>Email:</div>
              </div>
              <div className="w-full flex flex-col rounded-b-md overflow-y-auto h-[60vh]">
                {accounts.length === 0 ? (
                  <div className="text-center py-5 text-gray-600">
                    No account found
                  </div>
                ) : (
                  <>
                    {accounts
                      .filter((acc) => {
                        const fullName = `${acc.firstname || ""} ${
                          acc.middlename || ""
                        } ${acc.lastname || ""}`.toLowerCase();
                        return (
                          fullName.includes(searchTerm.toLowerCase()) ||
                          (acc.email &&
                            acc.email
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())) ||
                          (acc.cardUID &&
                            acc.cardUID
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()))
                        );
                      })
                      .map((acc, index) => (
                        <motion.div
                          key={acc.id}
                          className="grid text-black even:bg-gray-100 pl-3 items-center text-sm gap-3 border-b py-2 grid-cols-5 w-full bg-white"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="truncate first-letter:uppercase">{`${
                            acc.firstname || ""
                          } ${acc.middlename || ""} ${
                            acc.lastname || ""
                          }`}</div>
                          <div className="truncate" title={acc.cardUID}>
                            {acc.cardUID}
                          </div>
                          <div className="truncate" title={acc.accessLevel}>
                            {acc.accessLevel}
                          </div>
                          <div className="truncate" title={acc.email}>
                            {acc.email}
                          </div>
                          <div className="flex gap-2 justify-end mr-2">
                            {storedUser === "Admin" && (
                              <div className="flex gap-2">
                                {acc.accessLevel === "Patron" ? (
                                  <div className="px-4"></div>
                                ) : (
                                  <div
                                    onClick={() => {
                                      setSelectedAccount(acc);
                                      setResetPassword(true);
                                    }}
                                    className="bg-blue-600 px-2 rounded-md border-2 border-blue-800 cursor-pointer text-white py-1"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      class="size-5"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                                        clip-rule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}

                                <div
                                  onClick={() => {
                                    setSelectedAccount(acc);
                                    setDelets(true);
                                  }}
                                  className="bg-red-600 px-2 rounded-md border-2 border-red-800 cursor-pointer text-white py-1"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-5"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}

                    {accounts.filter((acc) => {
                      const fullName = `${acc.firstname || ""} ${
                        acc.middlename || ""
                      } ${acc.lastname || ""}`.toLowerCase();
                      return (
                        fullName.includes(searchTerm.toLowerCase()) ||
                        (acc.email &&
                          acc.email
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) ||
                        (acc.cardUID &&
                          acc.cardUID
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
                      );
                    }).length === 0 && (
                      <div className="text-center italic bg-white rounded-b-md py-5 text-gray-400">
                        No account found
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
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
                    <div className=" text-white rounded-md shadow-sm">
                      {loading2 ? (
                        <div className=" py-2.5 rounded-md px-7 cursor-not-allowed bg-gray-400">
                          <div className="border-t-2 rounded-full animate-spin border-gray-600 w-5 h-5 "></div>
                        </div>
                      ) : (
                        <div
                          className="py-2 px-3 rounded-md bg-green-600 cursor-pointer hover:bg-green-700"
                          onClick={handleResetPassword}
                        >
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

        <AnimatePresence>
          {scanID && (
            <div className="absolute top-0 left-0 justify-center flex items-center w-full h-full z-20 ">
              <motion.div
                onClick={() => setScanID(false)}
                className="absolute cursor-pointer rounded-xl top-0 left-0 z-10 bg-[#0007] w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <motion.div
                className="bg-white w-[50%] rounded-xl p-10 z-20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div className="mb-5 w-full justify-center flex flex-col content-center ">
                  <div className="text-4xl font-black uppercase text-center">
                    Tap your id
                  </div>
                  <div className="text-sm mb-5 text-gray-500 text-center">
                    Make sure to tap the correct id.
                  </div>
                </div>
                <div>
                  Name: {firstname} {middlename} {lastname}
                </div>
                {uid === "card" ? (
                  <div className="flex items-center">
                    <div className="mr-2">Card code:</div>{" "}
                    <ClipLoader size={20} />
                  </div>
                ) : (
                  <div>Card code: {uid}</div>
                )}
                <div className="mt-3 w-full flex justify-end gap-3 text-white ">
                  <div
                    onClick={() => setScanID(false)}
                    className="px-5 py-1 bg-red-700 hover:bg-red-800 cursor-pointer rounded-md shadow-md "
                  >
                    No
                  </div>
                  <button
                    disabled={loading2}
                    onClick={handleRegister}
                    className={`" ${loading2 ? " bg-gray-700 text-white hover:bg-gray-800 cursor-not-allowed" : "bg-green-700 hover:bg-green-800 cursor-pointer "} px-5 py-1  rounded-md  shadow-md "`}
                  >
                    {loading2 ? "Creating..." : "Yes"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {once && (
            <div className="absolute top-0 left-0 justify-center flex items-center w-full h-full z-20 ">
              <motion.div
                onClick={() => {
                  setOnce(false);
                }}
                className="absolute cursor-pointer rounded-xl top-0 left-0 z-10 bg-[#0007] w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <motion.div
                className="bg-white w-[50%] rounded-xl p-10 z-20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div className="mb-5 w-full justify-center flex flex-col content-center ">
                  <div className="text-4xl font-black uppercase text-center">
                    Tap your id again
                  </div>
                  <div className="text-sm mb-5 text-gray-500 text-center">
                    Tap your id again to write successfully your information to
                    the card.
                  </div>
                </div>
                <div className="mt-3 w-full flex justify-end gap-3 text-white ">
                  <div
                    onClick={() => setOnce(false)}
                    className="px-5 py-1 bg-red-700 hover:bg-red-800 cursor-pointer rounded-md shadow-md "
                  >
                    Cancel
                  </div>

                  <div
                    onClick={successz}
                    className="px-5 py-1 bg-green-700 hover:bg-green-800 rounded-md cursor-pointer shadow-md "
                  >
                    Done
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {delets && (
            <div className="absolute top-0 left-0 justify-center flex items-center w-full h-full z-20 ">
              <motion.div
                onClick={() => setDelets(false)}
                className="absolute cursor-pointer rounded-xl backdrop-blur-sm top-0 left-0 z-10 bg-[#0007] w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <motion.div
                className="bg-white rounded-xl py-5 px-10 z-20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div>
                  <div className="font-black uppercase text-center text-xl">
                    Are you sure you want to delete
                    <span className="text-red-600 ml-1">
                      {selectedAccount?.firstname} {selectedAccount?.lastname}?
                    </span>
                  </div>
                  <div className="flex gap-6 justify-center mt-7 ">
                    <div
                      className="bg-red-600 hover:bg-red-700 font-black px-4 py-2 rounded-md text-white cursor-pointer uppercase"
                      onClick={() => {
                        setDelets(false);
                        setSelectedAccount(null);
                      }}
                    >
                      no
                    </div>

                    <div
                      className="bg-green-600 hover:bg-green-700 font-black px-4 py-2 rounded-md text-white cursor-pointer uppercase"
                      onClick={async () => {
                        try {
                          await deleteDoc(
                            doc(db, "StudentAccount", selectedAccount.cardUID)
                          );
                          console.log(selectedAccount.cardUID);
                          setAccounts((prev) =>
                            prev.filter(
                              (acc) => acc.cardUID !== selectedAccount.cardUID
                            )
                          );
                          toast.success("Account deleted successfully!");
                        } catch (err) {
                          console.error("Error deleting account:", err);
                          toast.error("Failed to delete account.");
                        } finally {
                          setDelets(false);
                          setSelectedAccount(null);
                        }
                      }}
                    >
                      Yes
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Admin;
