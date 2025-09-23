import { AnimatePresence, useScroll } from "framer-motion";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
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
  const [uid, setUid] = useState("card");
  const [showPassword, setShowPassword] = useState(true);
  const [transit, setTransit] = useState(false);

  useEffect(() => {
    const fetchUID = async () => {
      try {
        const res = await fetch("http://192.168.254.103/uid");
        const data = await res.json();
        if (data.uid) {
          setUid(data.uid.toUpperCase());
        }
      } catch (err) {
        console.error(err);
        setUid("Error connecting to ESP");
      }
    };

    const interval = setInterval(fetchUID, 1000);
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
    if (accessLevel !== "Admin" && accessLevel !== "Staff" || password === confirmpassword) {
      if (accessLevel !== "Admin" && accessLevel !== "Staff" || password.length > 6) {
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
        `http://192.168.254.103/write?accesslevel=${accessLevel}&permission=${permission}`
      );
      const result = await response.json();
      if (result.status && result.status.includes("Ready")) {
      } else {
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
      initial={{ x: 100, opacity: 0 }}
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
          className="mt-10 flex h-full flex-col justify-between text-xl text-white"
        >
          <div className="flex flex-col">
            <div className="flex gap-10">
              <motion.div
                className="w-full"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{}}
              >
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
              </motion.div>

              <motion.div
                className="w-full"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
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
              </motion.div>

              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>
            </div>

            <div className="flex gap-10 mt-5">
              <motion.div
                className="w-full"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
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
              </motion.div>

              <motion.div
                className="w-full"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
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
              </motion.div>

              <motion.div
                className="w-full"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
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
              </motion.div>
            </div>
            <AnimatePresence>
              {showPassword &&
                (accessLevel === "Admin" || accessLevel === "Staff") && (
                  <motion.div className="flex gap-10 mt-5">
                    <motion.div
                      className="w-full"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{
                        delay: transit ? 0.1 : 0.7,
                      }}
                    >
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

                    <motion.div
                      className="w-full"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{
                        delay: transit ? 0.2 : 0.8,
                      }}
                    >
                      <div className="flex gap-2">
                        <div>Confirm Password: </div>
                        <div className="text-red-500">*</div>
                      </div>
                      <input
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="px-5 py-2 rounded-md text-black w-full outline-none"
                        placeholder="Confirm your password"
                        type="password"
                        required
                      />
                    </motion.div>
                  </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-10 justify-between mt-5">
              <div className=""></div>

              <motion.div
                className="flex gap-10"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{
                  delay: transit ? 0.2 : 0.9,
                }}
                layout
              >
                <div className="overflow-hidden pb-5">
                  <div className="bg-[#c0772a]  relative z-20 ">
                    <div className="flex gap-2 ">
                      <div>Select Access Level: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <div
                      onMouseEnter={() => setDropDown("show3")}
                      onMouseLeave={() => setDropDown("tago")}
                      className="pb-1 flex"
                    >
                      <div className="px-5 flex cursor-pointer transition-all py-2 rounded-md justify-between items-center text-black bg-white w-full outline-none">
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
                    className=" text-black w-[300px] relative z-10"
                    initial={{ y: -200 }}
                    animate={{ y: dropdown === "show3" ? 0 : -200 }}
                    transition={{ duration: 1, type: "spring" }}
                  >
                    <div className=" bg-white w-full rounded-md overflow-hidden flex justify-start flex-col">
                      <div
                        onClick={() => {
                          setAccessLevel("Admin");
                          setGrade("Select grade level");
                          setYear("Select year level");
                          setTransit(true);
                        }}
                        className="px-5 py-2 transition-all cursor-pointer hover:bg-gray-200 "
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
                        className="px-5 py-2 transition-all cursor-pointer hover:bg-gray-200 "
                      >
                        Staff
                      </div>
                      <div
                        onClick={() => {
                          setAccessLevel("Patron");
                          setTransit(true);
                        }}
                        className="px-5 py-2 hover:bg-gray-200 transition-all cursor-pointer "
                      >
                        Patron
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* <div className={`" ${accessLevel === "Admin" || accessLevel === "Staff" || accessLevel === "Select access level" ? "hidden" : ""} overflow-hidden pb-5 "`}>
                  <div className="bg-[#c0772a]  relative z-20 ">
                    <div className="flex gap-2 ">
                      <div>Select Grade Level: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <div
                      onMouseEnter={() => setDropDown("show")}
                      onMouseLeave={() => setDropDown("tago")}
                      className="pb-1 flex"
                    >
                      <div className="px-5 flex cursor-pointer transition-all py-2 rounded-md justify-between items-center text-black bg-white w-full outline-none">
                        <div
                          className={`' ${
                            grade === "Select grade level"
                              ? "text-gray-400"
                              : ""
                          } mr-10 transition-all'`}
                        >
                          {grade}
                        </div>

                        <div
                          className={` ${
                            dropdown === "show" ? "rotate-90" : ""
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
                    onMouseEnter={() => setDropDown("show")}
                    onMouseLeave={() => setDropDown("tago")}
                    className=" text-black w-[300px] relative z-10"
                    initial={{ y: -200 }}
                    animate={{ y: dropdown === "show" ? 0 : -200 }}
                    transition={{ duration: 1, type: "spring" }}
                  >
                    <div className=" bg-white w-full rounded-md overflow-hidden flex justify-start flex-col">
                      <div
                        onClick={() => {
                          setGrade("College");
                          setYear("Select year level");
                        }}
                        className={`" ${
                          accessLevel === "Admin" || accessLevel === "Staff" || accessLevel === "Select access level"
                            ? "hidden"
                            : ""
                        } px-5 py-2 transition-all cursor-pointer hover:bg-gray-200 "`}
                      >
                        College
                      </div>
                      <div
                        onClick={() => {
                          setGrade("Senior High");
                          setYear("Select year level");
                        }}
                        className={`" ${
                          accessLevel === "Admin" || accessLevel === "Staff" || accessLevel === "Select access level"
                            ? "hidden"
                            : ""
                        }  px-5 py-2 hover:bg-gray-200 transition-all cursor-pointer "`}
                      >
                        Senior High
                      </div>
                    </div>
                  </motion.div>
                </div> */}

                {/* <div className={`" ${accessLevel === "Admin" || accessLevel === "Staff" || accessLevel === "Select access level" ? "hidden" : ""} overflow-hidden pb-5 "`}>
                  <div className="bg-[#c0772a]  relative z-20 ">
                    <div className="flex gap-2 ">
                      <div>Select Year Level: </div>
                      <div className="text-red-500">*</div>
                    </div>
                    <div
                      onMouseEnter={() => setDropDown2("show2")}
                      onMouseLeave={() => setDropDown2("tago")}
                      className="pb-1 flex"
                    >
                      <div className="px-5 flex cursor-pointer transition-all py-2 rounded-md justify-between items-center text-black bg-white w-full outline-none">
                        <div
                          className={`' ${
                            year === "Select year level" ? "text-gray-400" : ""
                          } mr-10  transition-all'`}
                        >
                          {year}
                        </div>

                        <div
                          className={` ${
                            dropdown2 === "show2" ? "rotate-90" : ""
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
                    onMouseEnter={() => setDropDown2("show2")}
                    onMouseLeave={() => setDropDown2("tago")}
                    className=" text-black w-[250px] relative z-10"
                    initial={{
                      y: -300,
                      opacity: grade === "Select grade level" ? 0 : 1,
                    }}
                    animate={{
                      y: dropdown2 === "show2" ? 0 : -300,
                      opacity: grade === "Select grade level" ? 0 : 1,
                    }}
                    transition={{ duration: 1, type: "spring" }}
                  >
                    <div className=" bg-white rounded-md overflow-hidden w-full flex justify-start flex-col">
                      <div
                        onClick={() => setYear("G11")}
                        className={`'  ${
                          grade === "College" ? "hidden" : ""
                        } px-5 py-2 transition-all cursor-pointer hover:bg-gray-200 '`}
                      >
                        G11
                      </div>
                      <div
                        onClick={() => setYear("G12")}
                        className={`' ${
                          grade === "College" ? "hidden" : ""
                        } px-5 py-2 hover:bg-gray-200 transition-all cursor-pointer '`}
                      >
                        G12
                      </div>
                      <div
                        onClick={() => setYear("1st Year")}
                        className={`' ${
                          grade === "Senior High" ? "hidden" : ""
                        } px-5 py-2 hover:bg-gray-200 transition-all cursor-pointer '`}
                      >
                        1st Year
                      </div>
                      <div
                        onClick={() => setYear("2nd Year")}
                        className={`' ${
                          grade === "Senior High" ? "hidden" : ""
                        } px-5 py-2 hover:bg-gray-200 transition-all cursor-pointer '`}
                      >
                        2nd Year
                      </div>
                      <div
                        onClick={() => setYear("3rd Year")}
                        className={`' ${
                          grade === "Senior High" ? "hidden" : ""
                        } px-5 py-2 hover:bg-gray-200 transition-all cursor-pointer '`}
                      >
                        3rd Year
                      </div>
                      <div
                        onClick={() => setYear("4th Year")}
                        className={`' ${
                          grade === "Senior High" ? "hidden" : ""
                        } px-5 py-2 hover:bg-gray-200 transition-all cursor-pointer '`}
                      >
                        4th Year
                      </div>
                    </div>
                  </motion.div>
                </div> */}
              </motion.div>
            </div>
          </div>

          <div className="flex w-full justify-end items-end">
            <button
              type="submit"
              className="uppercase px-10 py-2 bg-green-600 rounded-md shadow-lg hover:bg-green-700 transition-all"
            >
              submit
            </button>
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
      </div>
    </motion.div>
  );
}

export default Admin;
