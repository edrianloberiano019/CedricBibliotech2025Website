import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  setDoc,
  documentId,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { ClipLoader } from "react-spinners";
import emailjs from "@emailjs/browser";

function Borrowing() {
  const [modalBorrow, setModalBorrow] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [modalTap, setModalTap] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [document, setDocumentID] = useState("");
  const [choseDate, setChoseDate] = useState("");
  const [choseTime, setChoseTime] = useState("");
  const [update, setUpdate] = useState(false);
  const [uid, setUid] = useState("");
  const [id, setID] = useState("");
  const [userData, setUserData] = useState(null);
  const [docId, setDocId] = useState("");
  const globaldatetime = new Date(`${choseDate}T${choseTime}`);
  const [name, setName] = useState("");
  const [details, setDetails] = useState([]);
  const [email, setEmail] = useState("");
  const [loading2, setLoading2 ] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "BooksData"));
        const studentData = querySnapshot.docs.map((doc) => doc.data());
        setBooks(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    setUpdate(false);
  }, [update]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!uid) return;

      try {
        const q = query(
          collection(db, "StudentAccount"),
          where("cardUID", "==", uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const docData = docSnap.data();
          setID(false);
          setUserData(docData);
          console.log("docData:", docData);
          console.log("docData:", docData.email);
          const fullName = `${docData.firstname || ""} ${
            docData.middlename || ""
          } ${docData.lastname || ""}`.trim();

          setEmail(docData.email);
          setName(fullName);
          setDocId(docSnap.id);
        } else {
          setUserData(null);
          setDocId(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, [uid]);

  useEffect(() => {
    const fetchUID = async () => {
      try {
        const res = await fetch("http://192.168.254.100/uid");
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

  const updateReturn = async () => {
    const userRef = doc(db, "BooksData", document);

    try {
      await updateDoc(userRef, {
        status: "Available",
        dateReturn: "",
        dateBorrowed: "",
        currentBorrower: "",
      });
      updateHistoryReturn();
      toast.success("Successfully returned!");
    } catch (error) {
      toast.error("Error updating document: ", error);
    }
  };

  const searchDetails = async (title) => {
    try {
      const q = query(collection(db, "BooksData"), where("title", "==", title));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No matching books found.");
        setDetails(null);
        return;
      }

      const doc = querySnapshot.docs[0];
      const bookData = { id: doc.id, ...doc.data() };

      console.log("📚 Found book:", bookData);
      setDetails(bookData);
    } catch (error) {
      toast.error("Error fetching books: " + error.message);
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query)
    );
  });

  const updateNext = async (borrowName) => {
    setLoading2(true)
    const dateObj = new Date(`${choseDate}T${choseTime}`);
    const userRef = doc(db, "BooksData", document);
    const userRef2 = collection(db, "BooksHistory");
    const now = new Date();

    if (choseDate && choseTime) {
      try {
        console.log("executed");
        await updateDoc(userRef, {
          status: "Borrowed",
          dateReturn: dateObj,
          dateBorrowed: now,
          currentBorrower: borrowName,
        });

        await addDoc(userRef2, {
          status: name + " " + `borrowed the book named "${document}"`,
          date: now.toLocaleString(),
        });
        setModalTap(false);
        toast.success("Successfully borrowed!");
        setModalTap(false);
        setChoseDate("");
        setChoseTime("");
        setUid("0");
        setEmail("");
        setUpdate(true);
      } catch (error) {
        toast.error("Error! No user found!", error);
      } finally {
        setLoading2(false)
      }
    } else {
      toast("wala laman");
    }
  };

  const updateHistoryReturn = async () => {
    const userRef2 = collection(db, "BooksHistory");
    const now = new Date();

    try {
      await addDoc(userRef2, {
        status: `Returned the book named "${document}"`,
        date: now.toLocaleString(),
      });
      setModalTap(false);
    } catch (error) {
      toast.error("Error updating document: ", error);
    }
  };

  const next = () => {
    if (choseDate && choseTime) {
      setModalTap(true);
      setModalBorrow(false);
    } else {
      toast.error("Please select date and time to proceed.");
    }
  };

  const sendEmail = () => {
    const now = new Date();

    return;
    emailjs
      .send(
        "service_xq3itn4",
        "template_m7hwnqb",
        {
          name: "Caloocan City E-Library",
          book: document,
          email: email,
          from_name: "React User",
          message: "Hello from Caloocan City E-Library + EmailJS!",
          time: now.toLocaleDateString() + " " + now.toLocaleTimeString(),
        },
        "5JJ4BU1mfv1J_lZ3I"
      )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch((err) => {
        console.error("FAILED...", err);
        alert("Email failed: " + err.text);
      });
  };

  return (
    <motion.div
      className="p-10 h-[calc(100vh-1px)] overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full p-10 flex flex-col h-full relative bg-[#c0772a] overflow-hidden rounded-xl">
        <div className=" h-[5%]">
          <div className="text-white text-3xl font-kanit uppercase">
            Borrowing
          </div>
        </div>

        <div className="h-[10%] flex justify-start items-center">
          <div className="flex ">
            <input
              className="px-5 py-2 rounded-md"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <motion.div
          className="h-[85%] w-full  p-10 rounded-md bg-white  shadow-md flex flex-col"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, type: "spring" }}
        >
          <div className="flex justify-between uppercase border-b pb-3 text-lg">
            <div className="grid grid-cols-8 w-full grid-flow-col  gap-6 uppercase">
              <div className=" col-span-2">Book Title</div>

              <div>Status</div>
              <div>Author</div>
              <div className="col-span-2">Category</div>
              <div>Year</div>
            </div>
          </div>
          <div className="py-2 overflow-y-auto h-full gap-1">
            {loading ? (
              <div className="w-full py-10 justify-center h-full items-center content-center flex ">
                <SyncLoader size={10} />
              </div>
            ) : (
              <div className="flex flex-col gap-y-2 justify-between text-lg  flex-1">
                {filteredBooks.map((book, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-8 w-full grid-flow-col items-center justify-center gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="col-span-2">{book.title}</div>
                    <div>
                      {book.status === "Borrowed" ? (
                        <div className="text-red-600 font-bold uppercase">
                          Borrowed
                        </div>
                      ) : (
                        <div className="text-green-600 font-bold uppercase">
                          Available
                        </div>
                      )}
                    </div>
                    <div className="text-ellipsis truncate">{book.author}</div>
                    <div className="text-ellipsis truncate col-span-2">
                      {book.category}
                    </div>
                    <div>{book.year}</div>
                    <div>
                      {book.status === "Available" ? (
                        <div
                          onClick={() => {
                            setModalBorrow(true);
                            setDocumentID(book.title);
                          }}
                          className="py-1 px-3 cursor-pointer uppercase text-sm text-center text-white bg-green-700 hover:bg-green-800 transition-all rounded-md shadow-md"
                        >
                          borrow
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setModalView(true);
                            searchDetails(book.title);
                            setDocumentID(book.title);
                          }}
                          className="py-1 px-3 cursor-pointer uppercase text-sm text-center text-white bg-blue-700 hover:bg-blue-800 transition-all rounded-md shadow-md"
                        >
                          view
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
        <AnimatePresence>
          {modalBorrow && (
            <motion.div
              className="absolute  flex justify-center items-center left-0 top-0 text-2xl z-50 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onClick={() => {
                  setModalBorrow(false);
                  setChoseDate("");
                  setChoseTime("");
                }}
                className="z-30 bg-[#00000094] cursor-pointer backdrop-blur-sm w-full h-full absolute "
              ></div>
              <div className="bg-white relative z-40 p-5 rounded-2xl shadow-xl">
                <div className="bg-[#f5b066] p-4 rounded-md shadow-xl text-black">
                  <div className="text-sm">Schedule to Return: </div>
                  <input
                    type="date"
                    className="rounded-lg focus:outline-none text-black px-8 py-1 text-lg"
                    value={choseDate}
                    onChange={(e) => setChoseDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="rounded-lg ml-4 focus:outline-none text-black px-8 py-1 text-lg"
                    value={choseTime}
                    onChange={(e) => setChoseTime(e.target.value)}
                  />
                  <div className="mt-4 justify-end text-sm flex">
                    <div
                      onClick={() => {
                        next();
                      }}
                      className="px-6 py-2 cursor-pointer text-white  bg-green-700 rounded-md shadow-lg hover:bg-green-800 transition-all duration-200 uppercase "
                    >
                      Next
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalTap && (
            <motion.div
              className="absolute  flex justify-center items-center left-0 top-0 text-2xl z-50 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onClick={() => {
                  setModalTap(false);
                  setChoseDate("");
                  setChoseTime("");
                }}
                className="z-30 bg-[#00000094] cursor-pointer backdrop-blur-sm w-full h-full absolute "
              ></div>
              <div className="bg-white relative z-40 p-5 rounded-2xl shadow-xl">
                <div className="bg-[#f5b066] p-4 rounded-md shadow-xl text-black">
                  {userData ? (
                    <div className="flex w-full flex-col">
                      <div className=" uppercase justify-center i flex w-full text-black font-black text-3xl px-5">
                        Tap the id
                      </div>
                      <div className="p-4 rounded-md flex flex-col text-white">
                        <div className="grid grid-flow-row gap-6 grid-cols-4 bg-white text-black px-4 py-2 rounded-t-md border-b  text-sm">
                          <div className="text- ">Name: </div>
                          <div className="text-l">Borrowed Book: </div>
                          <div className="textxl">D/T Borrowed: </div>
                          <div className="tex-xl">D/T to Return: </div>
                        </div>

                        <div className="grid grid-flow-row gap-6 grid-cols-4 bg-white text-black px-4 py-2 rounded-b-md text-sm">
                          <div className="text- first-letter:uppercase">
                            {" "}
                            {name}
                          </div>
                          <div className="text-l">{document}</div>
                          <div className="textxl">
                            {globaldatetime.toLocaleDateString()}{" "}
                          </div>
                          <div className="tex-xl">
                            {globaldatetime.toLocaleTimeString()}{" "}
                          </div>
                        </div>
                      </div>
                      <div className="w-full mt-3 justify-end flex text-base">
                        <div
                          onClick={() => {
                            setModalBorrow(true);
                            setModalTap(false);
                          }}
                          className="text-red-600 cursor-pointer px-6 py-2  "
                        >
                          Back
                        </div>
                        <div
                          onClick={() => {
                            updateNext(
                              userData.firstname +
                                " " +
                                userData.middlename +
                                " " +
                                userData.lastname
                            );

                            sendEmail();
                          }}
                          className="bg-green-700 hover:bg-green-800 cursor-pointer text-white px-6 py-2 rounded-md shadow-md "
                        >
                          Borrow
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <div className=" uppercase text-black flex justify-center font-black text-3xl px-5">
                          Tap the id
                        </div>
                        <div className="p-4 rounded-md flex flex-col text-white">
                          <div className="grid grid-flow-row gap-6 grid-cols-4 bg-white text-black px-4 py-2 rounded-t-md border-b  text-sm">
                            <div className="text-">Name: </div>
                            <div className="text-l">Borrowed Book: </div>
                            <div className="textxl">D/T Borrowed: </div>
                            <div className="tex-xl">D/T to Return: </div>
                          </div>

                          <div className="grid grid-flow-row gap-6 grid-cols-4 bg-white text-black px-4 py-2 rounded-b-md text-sm">
                            <div className="text-">
                              <ClipLoader size={10} />{" "}
                            </div>
                            <div className="text-l">Shuckable </div>
                            <div className="textxl">
                              {globaldatetime.toLocaleDateString()}{" "}
                            </div>
                            <div className="tex-xl">
                              {globaldatetime.toLocaleTimeString()}{" "}
                            </div>
                          </div>
                        </div>
                        <div className="w-full mt-3 justify-end flex text-base">
                          <div
                            onClick={() => {
                              setModalBorrow(true);
                              setModalTap(false);
                            }}
                            className="text-red-600 cursor-pointer px-6 py-2  "
                          >
                            Back
                          </div>
                          <div
                            onClick={() => {
                              updateNext();
                            }}
                            className="bg-green-700 hover:bg-green-800 cursor-pointer text-white px-6 py-2 rounded-md shadow-md "
                          >
                            {loading2 ? (
                              <div className="flex justify-center">
                                <div className=" h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
                              </div>
                            ) : (
                              <div>Borrow</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalView && (
            <motion.div
              className="absolute  flex justify-center items-center px-10 left-0 top-0 text-2xl z-50 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onClick={() => setModalView(false)}
                className="z-30 bg-[#00000094] cursor-pointer  backdrop-blur-sm w-full h-full absolute "
              ></div>
              <div className="bg-white relative z-40 p-5 rounded-2xl shadow-xl">
                <div className="bg-[#f5b066] p-4 rounded-md flex flex-col shadow-xl text-white">
                  <div className="grid grid-flow-row gap-6 grid-cols-4 bg-white text-black px-4 py-2 rounded-t-md border-b  text-sm">
                    <div className="text-">Name: </div>
                    <div className="text-l">Borrowed Book: </div>
                    <div className="textxl">D/T Borrowed: </div>
                    <div className="tex-xl">D/T to Return: </div>
                  </div>
                  {details && (
                    <div className="grid grid-flow-row gap-6 grid-cols-4 bg-white text-black px-4 py-2 rounded-b-md text-sm">
                      <div className="text-">{details.currentBorrower} </div>
                      <div className="text-l">{details.title}</div>
                      <div className="textxl">
                        {details.dateBorrowed?.toDate().toLocaleString()}
                      </div>
                      <div className="tex-xl">
                        {details.dateReturn?.toDate().toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 justify-end text-sm flex">
                    <div
                      onClick={() => {
                        setModalView(false);
                        updateReturn();
                        setUpdate(true);
                      }}
                      className="px-6 py-2 cursor-pointer  bg-orange-500 rounded-md shadow-lg hover:bg-orange-600 transition-all duration-200 uppercase "
                    >
                      return
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Borrowing;
