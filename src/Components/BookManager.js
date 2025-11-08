import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AnimatePresence, motion } from "framer-motion";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { deleteDoc } from "firebase/firestore";

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
  const [confirm, setConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [update, setUpdate] = useState(false);
  const [selected, setSelected] = useState("");
  const [updateYear, setUpdateYear] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateAuthor, setUpdateAuthor] = useState("");
  const [currentUpdateDocId, setCurrentUpdateDocId] = useState(null);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [open2, setOpen2] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState("");

  const options = [
    "Adventure",
    "Classic",
    "Contemporary",
    "Dystopian",
    "Fantasy",
    "Historical Fiction",
    "Horror",
    "Literary Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "Young Adult",
    "Magical Realism",
    "Autobiography",
    "Biography",
    "Business",
    "Cookbook",
    "Essay",
    "History",
    "Memoir",
    "Philosophy",
    "Politics",
    "Psychology",
    "Religion",
    "Science",
    "Self-Help",
    "Travel",
    "True Crime",
    "Comics",
    "Poetry",
    "Drama",
    "Children's Literature",
    "Educational",
    "Reference",
    "Satire",
    "Short Stories",
    "Anthology",
    "Others...",
  ];

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

    const borrower = item.currentBorrower
      ? item.currentBorrower.toLowerCase()
      : "";
    const title = item.title ? item.title.toLowerCase() : "";

    return borrower.includes(query) || title.includes(query);
  });

  const generateUniqueId = async () => {
    const maxAttempts = 10;

    for (let i = 0; i < maxAttempts; i++) {
      const randomId = Math.floor(Math.random() * 100000) + 1;
      const docRef = doc(db, "BooksData", randomId.toString());
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return randomId.toString();
      }
    }

    throw new Error("Failed to generate a unique ID after multiple attempts");
  };

  const handleCreateBook = async () => {
    setLoading2(true);
    try {
      if (!title || !year || !category || !author || !quantity) {
        toast.error("Please fill all fields.");
        return;
      }

      const uniqueId = await generateUniqueId();

      await setDoc(doc(db, "BooksData", uniqueId), {
        id: uniqueId,
        author,
        category,
        dateBorrowed: "",
        dateReturn: "",
        status: "Available",
        title,
        quantity,
        year,
        returnEmail: false,
      });

      setStatik(statik === 1 ? 0 : 1);
      toast.success("Successfully created a book!");
      setCreate(false);
      setAuthor("");
      setCategory("");
      setTitle("");
      setYear("");
    } catch (error) {
      toast.error("Failed to create book: " + error.message);
    } finally {
      setLoading2(false);
    }
  };

  const handleDeleteBook = async () => {
    setLoading2(true);
    try {
      await deleteDoc(doc(db, "BooksData", deleteValue));
      toast.success(`Deleted "${deleteValue}" successfully!`, {
        autoClose: 500,
      });

      setConfirm(false);

      setStatik(statik === 1 ? 0 : 1);
    } catch (error) {
      toast.error("Failed to delete book: " + error.message);
    } finally {
      setLoading2(false);
    }
  };

  const handleUpdateBook = async () => {
    if (!updateTitle || !updateAuthor || !selected || !updateYear) {
      toast.error("Please fill all fields");
      return;
    }

    if (updateYear.length < 4) {
      toast.error("The year must be 4 numbers at least.");
      return;
    }

    setLoading2(true);
    try {
      const docRef = doc(db, "BooksData", currentUpdateDocId);
      await updateDoc(docRef, {
        title: updateTitle,
        author: updateAuthor,
        category: selected,
        year: updateYear,
        quantity: updateQuantity,
      });

      toast.success("Book updated successfully!");

      setStatik(statik === 1 ? 0 : 1);
      setUpdateAuthor("");
      setSelected("");
      setUpdateTitle("");
      setUpdateYear("");

      setUpdate(false);
    } catch (error) {
      toast.error("Failed to update book: " + error.message);
    } finally {
      setLoading2(false);
    }
  };

  return (
    <motion.div
      className="p-10 h-screen relative overflow-hidden"
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
              className="px-5 py-2 border border-black rounded-md"
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
              Add
            </div>
          </div>
        </div>

        <motion.div
          className="w-full p-10 rounde rounded-md border border-black relative h-[85%] bg-white shadow-md flex flex-col"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, type: "spring" }}
        >
          <div className="flex">
            <div className="grid w-full grid-cols-6 gap-2 uppercase border-b pb-3 text-base">
              <div className="col-span-2">book title</div>
              <div className="text-center">Quantity</div>
              <div className="">Time Borrowed</div>
              <div className="">Time Returned</div>
            </div>
          </div>
          <div className="overflow-y-auto  flex-1">
            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <SyncLoader size={10} />
              </div>
            ) : (
              <div className="">
                {filteredHistory.map((historyx, index) => (
                  <div key={historyx.id} className="flex border-b py-2 ">
                    <motion.div
                      key={index}
                      className="grid grid-cols-6 items-center w-full gap-2 text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="col-span-2">
                        <div>
                          {historyx.status === "Borrowed" ? (
                            <div
                              className="text-black truncate text-ellipsis"
                              title={historyx.title}
                            >
                              {historyx.title}
                            </div>
                          ) : (
                            <div
                              className="text-black truncate text-ellipsis"
                              title={historyx.title}
                            >
                              {historyx.title}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="truncate text-center">
                        {historyx.quantity ? historyx.quantity : "0"}
                      </div>
                      <div className="truncate">
                        {historyx.dateBorrowed?.toDate
                          ? historyx.dateBorrowed.toDate().toLocaleString()
                          : ""}
                      </div>
                      <div className="truncate">
                        {historyx.dateReturn?.toDate
                          ? historyx.dateReturn.toDate().toLocaleString()
                          : ""}
                      </div>
                      <div className="flex justify-end gap-2">
                        {historyx.currentBorrower ? (
                          <div className="px-5"></div>
                        ) : (
                          <>
                            <div
                              onClick={() => {
                                setUpdate(true);
                                setCurrentUpdateDocId(historyx.id);
                                setUpdateTitle(historyx.title || "");
                                setUpdateAuthor(historyx.author || "");
                                setSelected(historyx.category || "");
                                setUpdateYear(historyx.year || "");
                                setUpdateQuantity(historyx.quantity || "1");
                              }}
                              className="flex bg-blue-700 hover:bg-blue-800 py-2 items-center text-white px-2 rounded-md shadow-md transition-all cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </div>

                            <div
                              className={`" ${
                                historyx.currentBorrower ? "hidden" : ""
                              } bg-red-700 cursor-pointer hover:bg-red-800 transition-all p-2 rounded-md shadow-md "`}
                              onClick={() => {
                                setDeleteValue(historyx.id);
                                setConfirm(true);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-5 text-white"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        {/* <div className="absolute top-0 left-0 flex justify-center rounded-xl overflow-hidden text-white  items-center w-full h-full">
           <div className="bg-[#00000094] backdrop-blur-sm  w-full h-full absolute z-10"></div>
           <div className="z-20 ">dsa</div>
          </div> */}
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
                className="absolute cursor-pointer rounded-xl backdrop-blur-sm top-0 left-0 z-10 bg-[#0007] w-full h-full"
              ></motion.div>
              <motion.div
                className="bg-white relative z-40 p-5 rounded-2xl shadow-xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <div className="bg-[#f5b066] p-4 rounded-md flex flex-col shadow-xl text-black">
                  <div className="uppercase text-2xl font-kanit">
                    add a book
                  </div>
                  <div className="mt-5 gap-2 w-full flex flex-col">
                    <div className="gap-3 uppercase grid grid-cols-2">
                      <div>
                        <div>Title</div>
                        <input
                          className="px-3 py-2 w-full rounded-md shadow-md"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>

                      <div className="">
                        <div>Author</div>
                        <input
                          className="px-3 py-2 w-full rounded-md shadow-md"
                          value={author}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[a-zA-Z\s.,'-]*$/.test(value)) {
                              setAuthor(value);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex w-ful gap-3 uppercase">
                      <div className=" flex w-full flex-col items-start">
                        <div className=" flex w-full">Category</div>
                        <div className="relative z-20 inline-block text-left w-full">
                          <input
                            value={category}
                            className="px-3 py-2 rounded-md shadow-md"
                            onChange={(e) => setCategory(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* <div>
                        <div>Category</div>
                        <input
                          className="px-3 py-2 rounded-md shadow-md"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        />
                      </div> */}

                      <div>
                        <div>Year</div>
                        <input
                          className="px-3 py-2 rounded-md shadow-md"
                          type="number"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          maxLength={4}
                        />
                      </div>

                      <div>
                        <div>Quantity</div>
                        <input
                          className="px-3 py-2 rounded-md shadow-md"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        disabled={loading2}
                        onClick={() => handleCreateBook()}
                        className={`" ${
                          loading2
                            ? " bg-gray-400 hover:bg-gray-500 cursor-not-allowed "
                            : " bg-green-600 hover:bg-green-700 cursor-pointer"
                        }  px-3 py-2   transition-all rounded-md shadow-md font-kanit uppercase "`}
                      >
                        {loading2 ? <div>Adding...</div> : <div>add</div>}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {update && (
            <div>
              <motion.div
                className="absolute top-0 left-0 justify-center flex items-center w-full h-full z-20 "
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setUpdate(false)}
                  className="absolute cursor-pointer rounded-xl backdrop-blur-sm top-0 left-0 z-10 bg-[#0007] w-full h-full"
                ></motion.div>
                <motion.div
                  className="bg-white relative z-40 p-5 rounded-2xl shadow-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <div className="bg-[#f5b066] p-4 rounded-md flex flex-col shadow-xl text-black">
                    <div className="font-kanit text-center px-20 text-2xl uppercase">
                      update
                    </div>
                    <div className="gap-2 flex flex-col">
                      <div>
                        <div>Book title</div>
                        <input
                          value={updateTitle}
                          onChange={(e) => setUpdateTitle(e.target.value)}
                          className="px-2 py-1 rounded-md focus:outline-none shadow-md w-full"
                        />
                      </div>
                      <div>
                        <div>Author</div>
                        <input
                          value={updateAuthor}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[a-zA-Z\s.,'-]*$/.test(value)) {
                              setUpdateAuthor(value);
                            }
                          }}
                          className="px-2 py-1 rounded-md focus:outline-none shadow-md w-full"
                        />
                      </div>

                      <div className=" flex flex-col items-start  mt-3">
                        <div className=" flex">Category</div>
                        <div className="relative z-20 inline-block text-left w-full">
                          <input
                            className="px-2 py-1 focus:outline-none w-full  rounded-md shadow-md "
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <div>Year</div>
                        <input
                          value={updateYear}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,4}$/.test(value)) {
                              setUpdateYear(value);
                            }
                          }}
                          className="px-2 py-1 rounded-md focus:outline-none shadow-md w-full"
                        />
                      </div>

                      <div>
                        <div>Quantity</div>
                        <input
                          value={updateQuantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,4}$/.test(value)) {
                              setUpdateQuantity(value);
                            }
                          }}
                          className="px-2 py-1 rounded-md focus:outline-none shadow-md w-full"
                        />
                      </div>
                    </div>
                    <div className="flex w-full justify-center gap-6 uppercase mt-6 text-white">
                      <div
                        className="bg-red-700 hover:bg-red-800 cursor-pointer px-5 py-2 rounded-md shadow-md"
                        onClick={() => {
                          setUpdate(false);
                        }}
                      >
                        no
                      </div>
                      <button
                        disabled={loading2}
                        onClick={handleUpdateBook}
                        className={`" ${
                          loading2
                            ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800 cursor-pointer "
                        }    px-5 py-2 rounded-md shadow-md "`}
                      >
                        {loading2 ? "Updating" : "YES"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {confirm && (
            <div>
              <motion.div
                className="absolute top-0 left-0 justify-center flex items-center w-full h-full z-20 "
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setConfirm(false)}
                  className="absolute cursor-pointer rounded-xl backdrop-blur-sm top-0 left-0 z-10 bg-[#0007] w-full h-full"
                ></motion.div>
                <motion.div
                  className="bg-white relative z-40 p-5 rounded-2xl shadow-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <div className="bg-[#f5b066] p-4 rounded-md flex flex-col shadow-xl text-black">
                    <div className="font-black text-2xl uppercase">
                      Do you want to delete this book?
                    </div>
                    <div className="flex w-full justify-center gap-6 uppercase mt-3 text-white">
                      <div
                        className="bg-red-700 hover:bg-red-800 cursor-pointer px-5 py-1 rounded-md shadow-md"
                        onClick={() => setConfirm(false)}
                      >
                        no
                      </div>
                      <button
                        disabled={loading2}
                        className={`" ${
                          loading2
                            ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800 cursor-pointer "
                        }    px-5 py-1 rounded-md shadow-md "`}
                        onClick={handleDeleteBook}
                      >
                        {loading2 ? "Deleting..." : "YES"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default BookManager;
