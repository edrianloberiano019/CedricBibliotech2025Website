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
import { AnimatePresence, motion } from "framer-motion";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";

function BookManager() {
  const [tab, setTab] = useState("Use");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [history, setHistory] = useState([]);
  const [create, setCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [author, setAuthor] = useState("");
  const [statik, setStatik] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

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
  }, [statik]);

  const filteredHistory = history.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.currentBorrower?.toLowerCase().includes(query) ||
      item.title?.toLowerCase().includes(query)
    );
  });

  const handleCreateBook = async () => {
    setLoading2(true);
    try {
      await setDoc(doc(db, "BooksData", title), {
        author: author,
        category: category,
        currentBorrower: "",
        dateBorrowed: "",
        dateReturn: "",
        status: "Available",
        title: title,
        year: year,
      });

      if (statik === 1) {
        setStatik(0);
      } else {
        setStatik(1);
      }
      toast.success("Successfully created a book!");
      setCreate(false);
      setAuthor("");
      setCategory("");
      setTitle("");
      setYear("");
    } catch (error) {
      toast(error);
    } finally {
      setLoading2(false);
    }
  };
  return (
    <motion.div
      className="p-10 h-screen overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full flex-col p-10 relative rounded-xl h-full flex bg-[#c0772a]">
        <div className=" h-[5%]">
          <div className="text-white text-3xl font-kanit uppercase">
            Book Manager
          </div>
        </div>
        <div className="flex items-center content-center h-[10%] justify-between">
          <div className="flex ">
            <input
              className="px-5 py-2 rounded-md"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 ">
            <div
              className="bg-green-600 px-5 py-2 font-kanit uppercase rounded-md shadow-md flex items-center cursor-pointer hover:bg-green-700 transition-all"
              onClick={() => setCreate(true)}
            >
              Create
            </div>
          </div>
        </div>

        <motion.div
          className="w-full p-10 rounded-md relative h-[85%] bg-white shadow-md flex flex-col"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, type: "spring" }}
        >
          <div className="grid grid-cols-5 uppercase border-b pb-3 text-lg">
            <div className="col-span-2">Name</div>
            <div>Book Title</div>
            <div className="">Time Borrowed</div>
            <div className="">Time Returned</div>
          </div>
          <div className="overflow-y-auto py-2 flex-1">
            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <SyncLoader size={10} />
              </div>
            ) : (
              <div className="">
                {filteredHistory.map((historyx, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-5 w-full gap-2 pb-3 text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                  >
                    <div className="col-span-2">
                      {historyx.currentBorrower ? (
                        <div className="first-letter:uppercase">
                          {historyx.currentBorrower}
                        </div>
                      ) : (
                        <div className="text-green-600 font-bold uppercase">
                          Available
                        </div>
                      )}
                    </div>
                    <div>
                      {historyx.status === "Borrowed" ? (
                        <div className="text-red-600 truncate text-ellipsis">
                          {historyx.title}
                        </div>
                      ) : (
                        <div className="text-green-600 truncate text-ellipsis">
                          {historyx.title}
                        </div>
                      )}
                    </div>
                    <div>
                      {historyx.dateBorrowed?.toDate
                        ? historyx.dateBorrowed.toDate().toLocaleString()
                        : ""}
                    </div>
                    <div>
                      {historyx.dateReturn?.toDate
                        ? historyx.dateReturn.toDate().toLocaleString()
                        : ""}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        {/* <div className="absolute top-0 left-0 flex justify-center rounded-xl overflow-hidden text-white  items-center w-full h-full">
           <div className="bg-[#00000094] backdrop-blur-sm  w-full h-full absolute z-10"></div>
           <div className="z-20 ">dsa</div>
          </div> */}
      </div>

      <AnimatePresence>
        {create && (
          <motion.div
            className="absolute top-0 left-0 justify-center flex items-center w-full h-full z-20 "
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreate(false)}
              className="absolute cursor-pointer rounded-xl top-0 left-0 z-10 bg-[#0007] w-full h-full"
            ></motion.div>
            <motion.div
              className="bg-white relative z-40 p-5 rounded-2xl shadow-xl"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div className="bg-[#f5b066] p-4 rounded-md flex flex-col shadow-xl text-black">
                <div className="uppercase text-2xl font-kanit">
                  Create a book
                </div>
                <div className="mt-5 gap-3 flex flex-col">
                  <div className="flex gap-3 uppercase">
                    <div>
                      <div>Title</div>
                      <input
                        className="px-3 py-2 rounded-md shadow-md"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="">
                      <div>Author</div>
                      <input
                        className="px-3 py-2 rounded-md shadow-md"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 uppercase">
                    <div>
                      <div>Category</div>
                      <input
                        className="px-3 py-2 rounded-md shadow-md"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>

                    <div>
                      <div>Year</div>
                      <input
                        className="px-3 py-2 rounded-md shadow-md"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <div
                      onClick={() => handleCreateBook()}
                      className="bg-green-600 px-3 py-2 cursor-pointer hover:bg-green-700 transition-all rounded-md shadow-md font-kanit uppercase"
                    >
                      {loading2 ? (
                        <div className="flex justify-center px-4">
                          <div className=" h-6 w-6 border-2  border-white border-t-transparent rounded-full animate-spin "></div>
                        </div>
                      ) : (
                        <div>Create</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default BookManager;
