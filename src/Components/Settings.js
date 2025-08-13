import React, { useEffect, useState } from "react";
import pfp from "../Images/settingspfp.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Settings() {
  const [userData, setUserData] = useState("");
  const [edit, setEdit] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const navigateToSystem = () => {
    navigate("/entrance")
  }
  return (
    <motion.div className="p-10 h-[calc(100vh-1px)] overflow-hidden"
    initial={{x: 100, opacity: 0}}
    animate={{x: 0, opacity: 1}}>
      <div className="w-full relative p-10 flex flex-col h-full bg-[#c0772a]  rounded-xl">
        <div className="text-2xl font-kanit">
          <div className="text-white text-3xl uppercase">
            Account Information
          </div>
        </div>
        <div className="mt-10 h-full">
          <div className="w-full flex p-10 bg-white relative rounded-2xl shadow-md">
            <div>
              <img className="rounded-xl p-5 bg-[#366bff]" src={pfp} />
            </div>
            <div className="flex justify-between w-full">
              <div className="ml-4 grid text-xl font-kanit items-center">
                {edit ? (
                  <div className="grid grid-rows-6 gap-2 grid-flow-row h-full">
                    <div className="flex gap-2 ">
                      <div>Name:</div>
                      <input
                        className="outline-none bg-gray-200 px-5 rounded-md shadow-sm"
                        placeholder={
                          userData.firstname +
                          " " +
                          userData.middlename +
                          " " +
                          userData.lastname
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <div>Student Number:</div>
                      <input
                        className="outline-none bg-gray-200 px-5 rounded-md shadow-sm"
                        placeholder={userData.studentnumber}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div>Grade Level:</div>
                      <input
                        className="outline-none cursor-not-allowed bg-gray-200 px-5 rounded-md shadow-sm"
                        placeholder={userData.gradelevel}
                        readOnly
                      />
                    </div>
                    <div className="flex gap-2">
                      <div>Year Level:</div>
                      <input
                        className="outline-none cursor-not-allowed bg-gray-200 px-5 rounded-md shadow-sm"
                        placeholder={userData.yearlevel}
                        readOnly
                      />
                    </div>
                    <div className="flex gap-2">
                      <div>Age:</div>
                      <input
                        className="outline-none bg-gray-200 px-5  rounded-md shadow-sm"
                        placeholder={userData.age} type="number" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <div>Email:</div>
                      <input
                        className="outline-none bg-gray-200 px-5 rounded-md shadow-sm"
                        placeholder={userData.email} type="Email" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-rows-6 gap-2 grid-flow-row h-full">
                    <div>
                      Name: {userData.firstname} {userData.middlename}{" "}
                      {userData.lastname}
                    </div>
                    <div>Student {userData.studentnumber} </div>
                    <div>Grade Level: {userData.gradelevel} </div>
                    <div>Year Level: {userData.yearlevel} </div>
                    <div>Age: {userData.age} </div>
                    <div>Email: {userData.email} </div>
                  </div>
                )}
              </div>
              <div>
                <div
                  onClick={() => setEdit(true)}
                  className={`" ${
                    edit ? "hidden" : ""
                  } bg-blue-700 hover:bg-blue-800 px-4 py-1 text-white rounded-md shadow-md uppercase cursor-pointer "`}
                >
                  Edit
                </div>

                <div
                  onClick={() => { setDone(true)}}
                  className={`" ${
                    edit ? "" : "hidden"
                  } bg-green-700 hover:bg-green-800 px-4 py-1 text-white rounded-md shadow-md uppercase cursor-pointer "`}
                >
                  Done
                </div>
              </div>
            </div>
          </div>
          <div className=" mt-5 flex">
            <div onClick={navigateToSystem} className="px-5 py-3 rounded-md shadow-md bg-white text-xl cursor-pointer">Entrance System</div>
          </div>
        </div>
        {done ? (
          <div className=" absolute top-0 left-0 w-full justify-center items-center flex h-full rounded-xl z-20 overflow-hidden shadow-md">
            <div className="absolute bg-[#00000070] top-0 left-0 w-full z-10 h-full"></div>
            <div className="bg-white rounded-md p-10 z-20 relative">
              <div className="font-black text-xl uppercase">Are you sure you want to save?</div>
              <div className="flex w-full text-white justify-center gap-5 mt-5">
                <div onClick={() => {setEdit(false); setDone(false)}} className="bg-red-700 hover:bg-red-800 hover:scale-105 transition-all px-5 cursor-pointer  py-1 rounded-md">No</div>
                <div className="bg-green-700 hover:bg-green-800 px-5 py-1 rounded-md hover:scale-105 transition-all cursor-pointer">Yes</div>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </motion.div>
  );
}

export default Settings;
