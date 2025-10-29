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
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { ClipLoader } from "react-spinners";
import emailjs from "@emailjs/browser";

function Borrowing() {
  const [bookTitle, setBookTitle] = useState("");
  const [modalBorrow, setModalBorrow] = useState(false);
  const [modalFinal, setModalFinal] = useState(false);
  const [modalView, setModalView] = useState(false);
  const [modalTap, setModalTap] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [document, setDocumentID] = useState("");
  const [choseDate, setChoseDate] = useState("");
  const [choseTime, setChoseTime] = useState("");
  const [choseDate2, setChoseDate2] = useState("");
  const [choseTime2, setChoseTime2] = useState("");
  const [update, setUpdate] = useState(false);
  const [uid, setUid] = useState("169A7DAA");
  const [id, setID] = useState("");
  const [userData, setUserData] = useState(null);
  const [modalReserve, setModalReserve] = useState(false);
  const [docId, setDocId] = useState("");
  const [scheduleBorrow, setScheduleBorrow] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const globaldatetime =
    choseDate && choseTime
      ? (() => {
          const dt = new Date(`${choseDate}T${choseTime}`);
          return isNaN(dt.getTime()) ? null : dt;
        })()
      : null;
  const [name, setName] = useState("");
  const [details, setDetails] = useState([]);
  const [email, setEmail] = useState("");
  const [loading2, setLoading2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [namesecond, setNameSecond] = useState("");
  const [run, setRun] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [reservedBooks, setReservedBooks] = useState([]);
  const [borrowFinal, setBorrowFinal] = useState(false);

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

          const fullName = `${docData.firstname || ""} ${
            docData.middlename || ""
          } ${docData.lastname || ""}`.trim();

          setEmail(docData.email);
          setName(fullName);
          setDocId(docSnap.id);
          setLoading2(false);
        } else {
          setUserData(null);
          setDocId(null);
        }
      } catch (error) {
      } finally {
        setUid("");
      }
    };
    if (run) {
      fetchDetails();
    }
  }, [uid]);

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
        returnEmail: false,
        email: "",
      });
      updateHistoryReturn();
      toast.success("Successfully returned!");

      const dateObj = new Date(`${choseDate}T${choseTime}`);
      const now = new Date();

      console.log(email, "gaga");

      emailjs.send(
        "service_xq3itn4",
        "template_m7hwnqb",
        {
          name: "Caloocan City E-Library",
          book: bookTitle,
          status: "returned",
          email: email,
          from_name: "React User",
          message: `Thank you for returning ${bookTitle} to the Caloocan City E-Library. We truly appreciate your cooperation in helping us keep our collection well-maintained and accessible to all members of the community. By returning your borrowed books on time, you make it possible for other readers to enjoy the same resources and continue their learning journey. Your support plays an important role in promoting the joy of reading and lifelong learning within our city. We look forward to serving you again soon and hope you find more books that inspire, inform, and entertain you.`,
          time: now.toLocaleDateString() + " " + now.toLocaleTimeString(),
          names: namesecond,
        },
        "5JJ4BU1mfv1J_lZ3I"
      );
    } catch (error) {
      toast.error("Error updating document: ", error);
    }
  };

  const searchDetails = async (title) => {
    try {
      const q = query(collection(db, "BooksData"), where("title", "==", title));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setDetails(null);
        return;
      }

      const doc = querySnapshot.docs[0];
      const bookData = { id: doc.id, ...doc.data() };

      setDetails(bookData);
      setEmail(bookData.email);
      setNameSecond(bookData.currentBorrower);
    } catch (error) {
      toast.error("Error fetching books: " + error.message);
    } finally {
    }
  };
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.category?.toLowerCase().includes(query) ||
      String(book.year)?.toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === "All" ? true : book.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const updateNext = async (borrowName) => {
    setLoading2(true);
    setLoading3(true);

    const dateObj = new Date(`${choseDate}T${choseTime}`);
    const userRef = doc(db, "BooksData", document);
    const userRef2 = collection(db, "BooksHistory");
    const now = new Date();

    try {
      const bookSnap = await getDoc(userRef);
      if (!bookSnap.exists()) {
        toast.error("Error! Book not found.");
        setLoading2(false);
        setLoading3(false);
        return;
      }

      const bookData = bookSnap.data();
      if (bookData.quantity === 0) {
        toast.error("Cannot borrow — no copies available!");
        setLoading2(false);
        setLoading3(false);
        return;
      }

      if (choseDate && choseTime) {
        await updateDoc(userRef, {
          status: "Borrowed",
          dateReturn: dateObj,
          dateBorrowed: now,
          currentBorrower: borrowName,
          email: email,
          quantity: bookData.quantity - 1,
        });

        await addDoc(userRef2, {
          status: `${name} borrowed the book named "${bookTitle}"`,
          date: now.toLocaleString(),
          indicator: "borrowed",
        });

        toast.success("Successfully borrowed!");
        setModalTap(false);
        setModalFinal(false);
        setChoseDate("");
        setChoseTime("");
        setUid("0");
        setEmail("");
        setUpdate(true);
      } else {
        toast.warning("Please select both date and time!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error! Something went wrong.");
    } finally {
      setLoading2(false);
      setLoading3(false);
    }
  };

  const updateHistoryReturn = async () => {
    const userRef2 = collection(db, "BooksHistory");
    const now = new Date();

    try {
      await addDoc(userRef2, {
        status: `Returned the book named "${bookTitle}"`,
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

    if (!choseDate || !choseTime) {
      alert("Please select both date and time");
      return;
    }

    const dateTimeString = `${choseDate}T${choseTime}`;
    const datetime = new Date(dateTimeString);

    if (isNaN(datetime.getTime())) {
      alert("Invalid date or time format");
      return;
    }

    emailjs
      .send(
        "service_xq3itn4",
        "template_m7hwnqb",
        {
          names: namesecond,
          name: "Caloocan City E-Library",
          book: document,
          email: email,
          from_name: "React User",
          hatdog: "Due date: ",
          status: "borrowed",
          returntime:
            datetime.toLocaleDateString() + " " + datetime.toLocaleTimeString(),
          message: `Thank you for borrowing ${bookTitle} from the Caloocan City E-Library. We hope you enjoy reading this book and find it informative, entertaining, or inspiring. Please take good care of this book and return it by the due date so others can also enjoy it. Your support helps us provide a wide variety of resources for the community. Happy reading and we look forward to welcoming you back soon!`,
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

  useEffect(() => {
    const fetchReservedBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ReservedBooks"));
        const booksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservedBooks(booksData);
      } catch (error) {
        console.error("Error fetching reserved books:", error);
      }
    };

    if (modalReserve) {
      fetchReservedBooks();
    }
  }, [modalReserve]);

  const ClaimBorrow = async (book) => {
    try {
      const bookRef = doc(db, "ReservedBooks", book.docId || book.id);
      await updateDoc(bookRef, {
        status: "Claimed",
        dateBorrowed: new Date().toLocaleString(),
        dateReturn: `${choseDate2} ${choseTime2}`,
      });

      toast.success(`"${book.title}" has been successfully claimed.`);

      const snapshot = await getDocs(collection(db, "ReservedBooks"));
      const updatedList = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setReservedBooks(updatedList);
    } catch (error) {
      console.error("Error updating claim:", error);
      toast.error("Failed to claim book.");
    }
  };

  const next2 = () => {
    if (choseDate2 && choseTime2) {
      setScheduleBorrow(false);
      setBorrowFinal(true);
    } else {
      toast.error("Please select date and time to proceed.");
    }
  };

  useEffect(() => {
    const verifyCard = async () => {
      if (!uid || !selectedBook) return;

      try {
        const q = query(
          collection(db, "StudentAccount"),
          where("cardUID", "==", uid)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          toast.error("No account found for this card.");
          setUserData(null);
          return;
        }

        const student = snapshot.docs[0].data();
        const fullName = `${student.firstname} ${student.lastname}`.trim();

        if (fullName !== selectedBook.currentBorrower.trim()) {
          toast.error("This card does not belong to the borrower.");
          setUserData(null);
          return;
        }

        setUserData(student);
      } catch (error) {
        console.error("Error verifying card:", error);
      }
    };

    verifyCard();
  }, [uid]);

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

        <div className="h-[10%] flex justify-between items-center">
          <div className="flex ">
            <input
              className="px-5 py-2 rounded-md"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2">
            <div
              onClick={() => setModalReserve(true)}
              className={`bg-yellow-600 border-2 border-yellow-900 rounded-md px-2 shadow-md font-bold uppercase p-1 cursor-pointer `}
            >
              Reserved Books
            </div>
            <div
              onClick={() => setFilterStatus("All")}
              className={`bg-yellow-600 border-2 border-yellow-900 rounded-md px-2 shadow-md font-bold uppercase p-1 cursor-pointer ${
                filterStatus === "All" ? "ring-2 ring-white" : ""
              }`}
            >
              ALL
            </div>
            <div
              onClick={() => setFilterStatus("Borrowed")}
              className={`bg-yellow-600 border-2 border-yellow-900 rounded-md px-2 shadow-md font-bold uppercase p-1 cursor-pointer ${
                filterStatus === "Borrowed" ? "ring-2 ring-white" : ""
              }`}
            >
              Borrowed
            </div>
            <div
              onClick={() => setFilterStatus("Available")}
              className={`bg-yellow-600 border-2 border-yellow-900 rounded-md px-2 shadow-md font-bold uppercase p-1 cursor-pointer ${
                filterStatus === "Available" ? "ring-2 ring-white" : ""
              }`}
            >
              Available
            </div>
          </div>
        </div>
        <motion.div
          className="h-[85%] w-full  p-10 rounded-md bg-white  shadow-md flex flex-col"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, type: "spring" }}
        >
          <div className="flex justify-between uppercase border-b pb-3 text-lg">
            <div className="grid grid-cols-8 w-full grid-flow-col  gap-3 uppercase">
              <div className=" col-span-2">Book Title</div>

              <div>Status</div>
              <div>Author</div>
              <div className="">Category</div>
              <div className="">Quantity</div>
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
                    <div className="text-ellipsis truncate">
                      {book.category}
                    </div>
                    <div className="text-center">{book.quantity}</div>

                    <div>{book.year}</div>
                    <div>
                      {book.status === "Available" ? (
                        <div
                          onClick={() => {
                            if (book.quantity > 0) {
                              setModalBorrow(true);
                              setDocumentID(book.id);
                              setBookTitle(book.title);
                            }
                          }}
                          className={`" ${
                            book.quantity > 0
                              ? "cursor-pointer bg-green-700 hover:bg-green-800 text-white"
                              : "cursor-not-allowed bg-gray-300 text-gray-600"
                          } py-1 px-3  uppercase text-sm text-center   transition-all rounded-md shadow-md "`}
                        >
                          borrow
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setModalView(true);
                            searchDetails(book.title);
                            setDocumentID(book.id);
                            setBookTitle(book.title);
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
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setChoseDate(e.target.value)}
                  />
                  <input
                    type="time"
                    className="rounded-lg ml-4 focus:outline-none text-black px-8 py-1 text-lg"
                    value={choseTime}
                    min={
                      choseDate === new Date().toISOString().split("T")[0]
                        ? new Date().toISOString().split("T")[1].slice(0, 5)
                        : undefined
                    }
                    onChange={(e) => setChoseTime(e.target.value)}
                  />
                  <div className="mt-4 justify-end text-sm flex">
                    <div
                      onClick={() => {
                        if (!choseDate || !choseTime) {
                          toast.info("Please select both date and time.");
                          return;
                        }

                        const now = new Date();
                        const todayString = now.toISOString().split("T")[0];
                        const currentTime = now.toTimeString().slice(0, 5);

                        if (choseDate < todayString) {
                          toast.info("You cannot select a past date.");
                          return;
                        }

                        if (
                          choseDate === todayString &&
                          choseTime < currentTime
                        ) {
                          toast.info("You cannot select a past time today.");
                          return;
                        }

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
                  <div>
                    <div>
                      <div className=" uppercase text-black flex justify-center font-black text-3xl px-5">
                        INFORMATION
                      </div>
                      <div className="p-4 rounded-md flex flex-col text-white">
                        <div className="grid grid-flow-row gap-6 grid-cols-3 bg-white text-black px-4 py-2 rounded-t-md border-b  text-sm">
                          <div className="text-l">Borrowed Book: </div>
                          <div className="textxl">D/T Borrowed: </div>
                          <div className="tex-xl">D/T to Return: </div>
                        </div>

                        <div className="grid grid-flow-row gap-6 grid-cols-3 bg-white text-black px-4 py-2 rounded-b-md text-sm">
                          <div className="text-l text-ellipsis truncate">
                            {bookTitle}{" "}
                          </div>
                          <div className="textxl">
                            {globaldatetime
                              ? globaldatetime.toLocaleDateString()
                              : ""}
                          </div>
                          <div className="tex-xl">
                            {globaldatetime
                              ? globaldatetime.toLocaleTimeString()
                              : ""}
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
                            setModalFinal(true);
                            setModalTap(false);
                            setLoading2(true);
                            setRun(true);
                          }}
                          className="bg-green-700 cursor-pointer hover:bg-green-800 text-white px-6 py-2 rounded-md shadow-md "
                        >
                          <div>NEXT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalReserve && (
            <motion.div
              className="absolute flex justify-center items-center left-0 top-0 text-2xl z-50 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onClick={() => setModalReserve(false)}
                className="z-30 bg-[#00000094] cursor-pointer backdrop-blur-sm w-full h-full absolute"
              ></div>

              <div className="bg-white relative z-40 p-5 rounded-2xl shadow-xl max-h-[80vh] overflow-y-auto w-[90%] md:w-[70%]">
                <div className="bg-[#f5b066] p-4 rounded-md shadow-xl text-black">
                  <div className="uppercase text-black flex justify-center font-black text-3xl px-5">
                    FOR BOOK RESERVATION
                  </div>

                  <div className="p-4 rounded-md flex flex-col text-white">
                    <div className="grid grid-flow-row gap-6 grid-cols-4 bg-white text-black px-4 py-2 rounded-t-md border-b text-sm font-bold">
                      <div>Name</div>
                      <div>Book</div>
                      <div>Date/Time Reserved</div>
                      <div className="text-right">Action</div>
                    </div>
                    {reservedBooks.length > 0 ? (
                      reservedBooks.map((book) => (
                        <div
                          key={`${book.docId || ""}-${book.id || ""}-${
                            book.title || ""
                          }`}
                          className="grid grid-flow-row gap-6 grid-cols-4 bg-white text-black px-4 py-2 border-b text-sm hover:bg-[#f5f5f5] transition"
                        >
                          <div className="truncate">{book.currentBorrower}</div>
                          <div className="truncate">{book.title}</div>
                          <div className="truncate">
                            {book.datetime ? book.datetime : "No date set"}
                          </div>

                          <div className="flex justify-end">
                            {book.status === "Reserved" ? (
                              <button
                                className="px-4 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                                onClick={() => {
                                  setSelectedBook(book);
                                  setScheduleBorrow(true);
                                }}
                              >
                                Claim
                              </button>
                            ) : (
                              <button
                                className="px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                                onClick={async () => {
                                  try {
                                    await deleteDoc(
                                      doc(db, "ReservedBooks", book.title)
                                    );

                                    const bookRef = doc(
                                      db,
                                      "BooksData",
                                      book.id
                                    );
                                    const bookSnap = await getDoc(bookRef);

                                    if (bookSnap.exists()) {
                                      const currentQty =
                                        parseInt(bookSnap.data().quantity) || 0;

                                      await updateDoc(bookRef, {
                                        quantity: (currentQty + 1).toString(),
                                      });

                                      toast.success(
                                        `"${book.title}" returned successfully. Quantity updated.`
                                      );
                                    } else {
                                      toast.error(
                                        "Book not found in BooksData."
                                      );
                                    }

                                    const snapshot = await getDocs(
                                      collection(db, "ReservedBooks")
                                    );
                                    const updatedList = snapshot.docs.map(
                                      (doc) => ({
                                        docId: doc.id,
                                        ...doc.data(),
                                      })
                                    );
                                    setReservedBooks(updatedList);
                                  } catch (error) {
                                    console.error(
                                      "Error returning book:",
                                      error
                                    );
                                    toast.error("Failed to process return.");
                                  }
                                }}
                              >
                                Return
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white text-black px-4 py-2 text-center text-sm">
                        No reserved books found.
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-3 justify-end flex text-base">
                    <div
                      onClick={() => setModalReserve(false)}
                      className="text-white rounded-md border-2 border-red-800 hover:bg-red-700 transition-all bg-red-600 cursor-pointer px-6 py-2"
                    >
                      Back
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scheduleBorrow && (
            <motion.div
              className="absolute  flex justify-center items-center left-0 top-0 text-2xl z-50 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onClick={() => {
                  setScheduleBorrow(false);
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
                    value={choseDate2}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setChoseDate2(e.target.value)}
                  />
                  <input
                    type="time"
                    className="rounded-lg ml-4 focus:outline-none text-black px-8 py-1 text-lg"
                    value={choseTime2}
                    min={
                      choseDate2 === new Date().toISOString().split("T")[0]
                        ? new Date().toISOString().split("T")[1].slice(0, 5)
                        : undefined
                    }
                    onChange={(e) => setChoseTime2(e.target.value)}
                  />
                  <div className="mt-4 justify-end text-sm flex">
                    <div
                      onClick={() => {
                        if (!choseDate2 || !choseTime2) {
                          toast.info("Please select both date and time.");
                          return;
                        }

                        const now = new Date();
                        const todayString = now.toISOString().split("T")[0];
                        const currentTime = now.toTimeString().slice(0, 5);

                        if (choseDate2 < todayString) {
                          toast.info("You cannot select a past date.");
                          return;
                        }

                        if (
                          choseDate2 === todayString &&
                          choseTime2 < currentTime
                        ) {
                          toast.info("You cannot select a past time today.");
                          return;
                        }

                        next2();
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
          {borrowFinal && (
            <motion.div
              className="absolute  flex justify-center items-center px-10 left-0 top-0 text-2xl z-50 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onClick={() => setBorrowFinal(false)}
                className="z-30 bg-[#00000094] cursor-pointer  backdrop-blur-sm w-full h-full absolute "
              ></div>
              <div className="bg-white relative z-40 p-5 rounded-2xl shadow-xl">
                <div className="bg-[#f5b066] p-4 rounded-md flex flex-col shadow-xl text-white">
                  <div className=" text-black font-black px-4 py-2 rounded-t-md  text-4xl">
                    TAP THE ID
                  </div>
                  {details && (
                    <div className=" bg-white flex flex-col text-black px-4 py-4 rounded-md text-sm">
                      <div className="flex items-center ">
                        Name:{" "}
                        {loading2 ? (
                          <div className="ml-2 flex items-center">
                            <ClipLoader size={20} />
                          </div>
                        ) : (
                          <div className="ml-2"></div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="w-full mt-3 justify-end flex text-base">
                    <div
                      onClick={() => {
                        setScheduleBorrow(true);
                        setBorrowFinal(false);
                      }}
                      className="text-red-600 cursor-pointer px-6 py-2  "
                    >
                      Back
                    </div>

                    {userData ? (
                      <>
                        {loading3 ? (
                          <div className="flex justify-center px-8 rounded-md py-2 bg-gray-400 cursor-not-allowed">
                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              ClaimBorrow(selectedBook);
                              sendEmail();
                              setBorrowFinal(false);
                              setScheduleBorrow(false);
                              setUserData(null);
                              setUid("");
                            }}
                            className="bg-green-700 hover:bg-green-800 cursor-pointer text-white px-6 py-2 rounded-md shadow-md"
                          >
                            BORROW
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-gray-400 cursor-not-allowed text-white px-6 py-2 rounded-md">
                        BORROW
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {modalFinal && (
            <motion.div
              className="absolute  flex justify-center items-center px-10 left-0 top-0 text-2xl z-50 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onClick={() => setModalFinal(false)}
                className="z-30 bg-[#00000094] cursor-pointer  backdrop-blur-sm w-full h-full absolute "
              ></div>
              <div className="bg-white relative z-40 p-5 rounded-2xl shadow-xl">
                <div className="bg-[#f5b066] p-4 rounded-md flex flex-col shadow-xl text-white">
                  <div className=" text-black font-black px-4 py-2 rounded-t-md  text-4xl">
                    TAP THE ID
                  </div>
                  {details && (
                    <div className=" bg-white flex flex-col text-black px-4 py-4 rounded-md text-sm">
                      <div className="flex items-center ">
                        Name:{" "}
                        {loading2 ? (
                          <div className="ml-2 flex items-center">
                            <ClipLoader size={20} />
                          </div>
                        ) : (
                          <div className="ml-2">{name}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="w-full mt-3 justify-end flex text-base">
                    <div
                      onClick={() => {
                        setModalTap(true);
                        setModalFinal(false);
                      }}
                      className="text-red-600 cursor-pointer px-6 py-2  "
                    >
                      Back
                    </div>

                    {userData ? (
                      <>
                        {loading3 ? (
                          <div className="flex justify-center px-8 rounded-md py-2 bg-gray-400 cursor-not-allowed">
                            <div className=" h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
                          </div>
                        ) : (
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
                            BORROW
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-gray-400 cursor-not-allowed text-white px-6 py-2 rounded-md ">
                        BORROW
                      </div>
                    )}
                  </div>
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
