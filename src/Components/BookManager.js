import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { SyncLoader } from "react-spinners";

function BookManager() {
  const [tab, setTab] = useState("Use");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "BooksData"));
        const studentData = querySnapshot.docs.map((doc) => doc.data());
        setHistory(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);
  return (
    <motion.div
      className="p-10 h-screen overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full flex-col p-10 relative rounded-xl h-full flex bg-[#c0772a]">
        <div className="mb-10">
          <div className="text-white text-3xl font-kanit uppercase">
            Book Manager
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <div className="flex ">
              <input
                className="px-5 py-2 rounded-l-full"
                type="text"
                placeholder="Search"
              />
              <div className="cursor-pointer pr-4 pl-3 rounded-r-full py-1 flex bg-green-500 overflow-hidden hover:bg-green-600 transition-all  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-8 text-white hover:scale-110 ease-out transition-all"
                >
                  <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                  <path
                    fill-rule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex gap-2 h-f">
              <div className="flex text-xl mr-3 items-center justify-center content-center">
                <div className="bg-green-600 h-full px-5 rounded-md shadow-md flex items-center cursor-pointer hover:bg-green-700 transition-all">
                  Create
                </div>
              </div>
              <div className="flex items-center bg-[#c0772a] border border-[#8f591f] overflow-hidden rounded-full h-10 px-2">
                <motion.div
                  className={`' ${
                    tab === "Use" ? "w-28" : "w-32"
                  } h-10 absolute right-16  bg-[#8f591f] shadow-lg rounded-full  '`}
                  initial={{ x: tab === "Active" ? 0 : -15 }}
                  animate={{ x: tab === "Active" ? -125 : -15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />

                <div className="relative z-20 gap-8 text-xl  text-black flex justify-center text-center font-semibold items-center content-center h-full">
                  <div
                    onClick={() => setTab("Active")}
                    className={`cursor-pointer px-3 ${
                      tab === "Active"
                        ? "text-white transition-all ease-in"
                        : "text-[#8f591f] transition-all duration-500 ease-out"
                    }`}
                  >
                    Returned
                  </div>
                  <div
                    onClick={() => setTab("Use")}
                    className={`cursor-pointer px-3 ${
                      tab === "Active"
                        ? "text-[#8f591f] transition-all duration-500 ease-out"
                        : "text-white transition-all ease-in"
                    } `}
                  >
                    In Use
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-5 p-10 rounded-md bg-white shadow-md">
            <div className="grid grid-cols-5 uppercase border-b pb-3 text-lg">
              <div className="col-span-2">Student Name</div>
              <div>Book Title</div>
              <div className="">Time Borrowed</div>
              <div className="">Time Returned</div>
            </div>
            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <SyncLoader size={10} />
              </div>
            ) : (
              <div className="mt-2">
                {history.map((historyx, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 w-full gap-2  pb-3 text-base"
                  >
                    <div className="col-span-2">Student Name</div>
                    <div>
                      {historyx.status === "Borrowed" ? (
                        <div className="text-red-600 truncate text-ellipsis">
                          {historyx.title}
                        </div>
                      ) : (
                        <div className="text-green-600  truncate text-ellipsis">
                          {historyx.title}
                        </div>
                      )}
                    </div>
                    <div className="">
                      {historyx.dateBorrowed?.toDate
                        ? historyx.dateBorrowed.toDate().toLocaleString()
                        : ""}
                    </div>
                    <div className="">
                      {historyx.dateReturn?.toDate
                        ? historyx.dateReturn.toDate().toLocaleString()
                        : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          {/* <div className="absolute top-0 left-0 flex justify-center rounded-xl overflow-hidden text-white  items-center w-full h-full">
           <div className="bg-[#00000094] backdrop-blur-sm  w-full h-full absolute z-10"></div>
           <div className="z-20 ">dsa</div>
          </div> */}
        </div>
      </div>
    </motion.div>
  );
}

export default BookManager;
