import React, { useEffect, useState } from "react";
import pfp from "../Images/settingspfp.png";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-toastify";

function Settings() {
  const [userData, setUserData] = useState("");
  const [edit, setEdit] = useState(false);
  const [done, setDone] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setEditedData(JSON.parse(storedUser));
    }
  }, []);

  const navigateToSystem = () => {
    navigate("/entrance");
  };

  const handleSaveChanges = async () => {
    if (!userData.email) {
      toast.error("User data not found.");
      return;
    }

    try {
      const q = query(
        collection(db, "StudentAccount"),
        where("email", "==", userData.email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("User not found in database.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "StudentAccount", userDoc.id);

      await updateDoc(userRef, {
        age: editedData.age || userData.age,
        email: editedData.email || userData.email,
      });

      const updatedUser = {
        ...userData,
        firstname: editedData.firstname,
        middlename: editedData.middlename,
        lastname: editedData.lastname,
        age: editedData.age,
        email: editedData.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);

      setEdit(false);
      setDone(false);
      toast.success("Account information updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update account. Try again.");
    }
  };

  return (
    <motion.div
      className="p-10 h-[calc(100vh-1px)] overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full relative p-10 flex flex-col h-full bg-[#c0772a] rounded-xl">
        <div className="text-2xl font-kanit">
          <div className="text-white text-3xl uppercase">
            Account Information
          </div>
        </div>

        <div className="mt-10 h-full">
          <div className="w-full flex p-10 bg-white relative rounded-2xl shadow-md">
            <div>
              <img
                className="rounded-xl p-5 bg-[#366bff]"
                src={pfp}
                alt="Profile"
              />
            </div>

            <div className="flex justify-between w-full">
              <div className="ml-4 grid text-xl font-kanit items-center">
                {edit ? (
                  <div className="grid grid-rows-3 items-center gap-2 grid-flow-row h-full">
                    <div className="flex gap-2 items-center">
                      <div>Name:</div>
                      <input
                        className="outline-none py-2 bg-gray-200 px-5 rounded-md shadow-sm w-full"
                        placeholder="Full Name"
                        disabled
                        value={`${editedData.firstname || ""} ${
                          editedData.middlename || ""
                        } ${editedData.lastname || ""}`}
                        onChange={(e) => {
                          const fullName = e.target.value.trim().split(" ");
                          setEditedData({
                            ...editedData,
                            firstname: fullName[0] || "",
                            middlename: fullName[1] || "",
                            lastname: fullName.slice(2).join(" ") || "",
                          });
                        }}
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <div>Age:</div>
                      <input
                        className="outline-none py-2 bg-gray-200 px-5 rounded-md shadow-sm w-20"
                        placeholder="Age"
                        type="number"
                        value={editedData.age || ""}
                        onChange={(e) =>
                          setEditedData({ ...editedData, age: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex gap-2 items-center">
                      <div>Email:</div>
                      <input
                        className="outline-none py-2 bg-gray-200 px-5 rounded-md shadow-sm w-full"
                        placeholder="Email"
                        type="email"
                        value={editedData.email || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-rows-4 gap-2 grid-flow-row h-full">
                    <div>
                      Name: {userData.firstname} {userData.middlename}{" "}
                      {userData.lastname}
                    </div>
                    <div>Student: {userData.studentnumber}</div>
                    <div>Age: {userData.age}</div>
                    <div>Email: {userData.email}</div>
                  </div>
                )}
              </div>

              <div>
                {!edit ? (
                  <div
                    onClick={() => setEdit(true)}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-1 text-white rounded-md shadow-md uppercase cursor-pointer"
                  >
                    Edit
                  </div>
                ) : (
                  <div
                    onClick={() => setDone(true)}
                    className="bg-green-700 hover:bg-green-800 px-4 py-1 text-white rounded-md shadow-md uppercase cursor-pointer"
                  >
                    Done
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {done && (
            <div className="absolute top-0 left-0 w-full justify-center items-center flex h-full rounded-xl z-20 overflow-hidden shadow-md">
              <motion.div
                onClick={() => setDone(false)}
                className="absolute bg-[#00000070] cursor-pointer backdrop-blur-sm top-0 left-0 w-full z-10 h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
              <motion.div
                className="bg-white rounded-md p-10 z-20 relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <div className="font-black text-xl uppercase">
                  Are you sure you want to save?
                </div>
                <div className="flex w-full text-white justify-center gap-5 mt-5">
                  <div
                    onClick={() => {
                      setEdit(false);
                      setDone(false);
                    }}
                    className="bg-red-700 hover:bg-red-800 hover:scale-105 transition-all px-5 cursor-pointer py-1 rounded-md"
                  >
                    No
                  </div>
                  <div
                    onClick={handleSaveChanges}
                    className="bg-green-700 hover:bg-green-800 px-5 py-1 rounded-md hover:scale-105 transition-all cursor-pointer"
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

export default Settings;
