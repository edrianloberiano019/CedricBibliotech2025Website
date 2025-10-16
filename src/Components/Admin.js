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
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [age, setAge] = useState("");
  const [Patronnumber, setPatronNumber] = useState("02000");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState("Admin");
  const [scanID, setScanID] = useState(false);
  const [permission, setPermission] = useState("Access Granted");
  const [uid, setUid] = useState("1231213212");
  const [showPassword, setShowPassword] = useState(true);
  const [transit, setTransit] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [delets, setDelets] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        const res = await fetch("http://192.168.254.110/uid");
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
          if (age >= 16) {
            if (Patronnumber.length >= 10) {
              setScanID(true);
            } else {
              toast.error("Please input your ID number correctly.");
            }
          } else {
            toast.error("Age must be greater than 15.");
          }
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

    try {
      const q = query(collection(db, "PatronAccount"));
      const querySnapshot = await getDocs(q);

      const existingUser = querySnapshot.docs.find(
        (doc) =>
          doc.data().cardUID === uid ||
          doc.data().email === email ||
          doc.data().Patronnumber === Patronnumber
      );

      if (existingUser) {
        toast.error("This card or user already exists!");
        return;
      }

      await setDoc(doc(db, "PatronAccount", Patronnumber), {
        email: email,
        password: password,
        Patronnumber: Patronnumber,
        firstname: firstname,
        lastname: lastname,
        middlename: middlename,
        age: age,
        yearlevel: year,
        gradelevel: grade,
        setPermission: permission,
        cardUID: uid,
        accessLevel: accessLevel,
      });

      const response = await fetch(
        `http://192.168.254.110/write?accesslevel=${accessLevel}&permission=${permission}`
      );
      const result = await response.json();

      if (!result.status || !result.status.includes("Ready")) {
        toast.error("Card write failed!");
        return;
      }

      toast.success("User successfully registered!");

      setScanID(false);
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
                    <div className="flex gap-2 ">
                      <div>Firstname: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <input
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
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
                      onChange={(e) => setLastname(e.target.value)}
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
                      onChange={(e) => setMiddlename(e.target.value)}
                      className="px-5 py-2 rounded-md text-black w-full outline-none"
                      placeholder="Ex: Sy"
                    />
                  </div>

                  <div className="flex gap-2" >


                  <div className="">
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
                  </div>

                  <div className="">
                    <div className="flex gap-2 ">
                      <div>Age: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <input
                      className="px-5 py-2 rounded-md text-black w-full outline-none"
                      maxLength={3}
                      placeholder="Ex: 21"
                      type="text"
                      inputMode="numeric"
                      value={age}
                      onChange={handleChange2}
                      required
                    />
                  </div>

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
                          <div
                            onClick={() => {
                              setAccessLevel("Patron");
                              setTransit(true);
                            }}
                            className="px-5 py-2 hover:bg-gray-300 transition-all cursor-pointer "
                          >
                            Patron
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

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
                <div>Age:</div>
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
                          initial={{opacity: 0}}
                          animate={{opacity: 1}}
                          transition={{delay: index * 0.1}}
                        >
                          <div className="truncate">{`${acc.firstname || ""} ${
                            acc.middlename || ""
                          } ${acc.lastname || ""}`}</div>
                          <div className="truncate" title={acc.cardUID}>
                            {acc.cardUID}
                          </div>
                          <div className="truncate" title={acc.age}>
                            {acc.age}
                          </div>
                          <div className="truncate" title={acc.email}>
                            {acc.email}
                          </div>
                          <div className="flex justify-end mr-2">
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
                <div>Patron ID: {Patronnumber}</div>
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
                  <div
                    onClick={handleRegister}
                    className="px-5 py-1 bg-green-700 hover:bg-green-800 rounded-md cursor-pointer shadow-md "
                  >
                    Yes
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
                            doc(db, "StudentAccount", selectedAccount.id)
                          );
                          setAccounts((prev) =>
                            prev.filter((acc) => acc.id !== selectedAccount.id)
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
