import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { SyncLoader } from "react-spinners";
import emailjs from "@emailjs/browser";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [dropDown, setDropDown] = useState(false);
  const [dropDownName, setDropDownName] = useState("D1");
  const [dropDownTitle, setDropDownTitle] = useState(
    "Library Usage by Students"
  );
  const [arrowPOV, setArrowPOV] = useState(true);
  const [login, setLogin] = useState([]);
  const [logout, setLogout] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const checkArchiveTimes = async () => {
      try {
        const studentRef = collection(db, "StudentAccount");
        const snapshot = await getDocs(studentRef);
        const now = new Date();

        for (const studentDoc of snapshot.docs) {
          const data = studentDoc.data();
          const { archivetime, setPermission } = data;

          if (!archivetime || setPermission === "Access Denied") continue;

          const archiveDate = archivetime.toDate();

          const monthsDifference =
            (now.getFullYear() - archiveDate.getFullYear()) * 12 +
            (now.getMonth() - archiveDate.getMonth());

          if (monthsDifference >= 3) {
            const studentDocRef = doc(db, "StudentAccount", studentDoc.id);
            await updateDoc(studentDocRef, {
              setPermission: "Access Denied",
            });
          }
        }
      } catch (error) {
        console.error("Error checking archive times:", error);
      }
    };

    checkArchiveTimes();
  }, []);

  useEffect(() => {
  const checkReservations = async () => {
    try {
      const reservedRef = collection(db, "ReservedBooks");
      const reservedSnap = await getDocs(reservedRef);
      const now = new Date();

      for (const docSnap of reservedSnap.docs) {
        const data = docSnap.data();
        if (!data.datetime || !data.id) continue;

        const reservedDate = new Date(data.datetime);
        const diffHours = (now - reservedDate) / (1000 * 60 * 60);

        if (diffHours >= 24) {
          console.log(`⏰ Auto-returning: ${data.title}`);

          // 1️⃣ Delete the reservation
          await deleteDoc(doc(db, "ReservedBooks", docSnap.id));

          // 2️⃣ Find matching book in BooksData
          const booksRef = collection(db, "BooksData");
          const booksSnap = await getDocs(booksRef);

          const matchingBook = booksSnap.docs.find(
            (b) => b.data().id === data.id // match by field, not doc ID
          );

          if (matchingBook) {
            const bookRef = doc(db, "BooksData", matchingBook.id);
            const currentQty = Number(matchingBook.data().quantity || 0);
            await updateDoc(bookRef, { quantity: currentQty + 1 });

            console.log(`✅ Returned ${data.title}, new quantity: ${currentQty + 1}`);
          } else {
            console.warn(`⚠️ No matching book found in BooksData for ID: ${data.id}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in auto-return process:", error);
    }
  };

  // Run immediately and every 5 minutes
  checkReservations();
  const interval = setInterval(checkReservations, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const checkDueBooks = async () => {
      try {
        const snapshot = await getDocs(collection(db, "BooksData"));
        const now = new Date();

        for (const d of snapshot.docs) {
          const data = d.data();

          if (
            data.status === "Borrowed" &&
            data.dateReturn &&
            data.returnEmail === false
          ) {
            const returnDate = data.dateReturn.toDate();
            const diffDays = Math.ceil(
              (returnDate - now) / (1000 * 60 * 60 * 24)
            );

            if (diffDays <= 3 && diffDays >= 0) {
              const emailParams = {
                email: data.email,
                book: data.title,
                returntime: returnDate.toLocaleDateString(),
                borrower_name: data.currentBorrower,
                status: "Due",
                hatdog: "Due on:",
                names: data.currentBorrower,
                message: `The book named ${
                  data.title
                } is due on ${returnDate.toLocaleDateString()} return it to the Caloocan City E-Library. We truly appreciate your cooperation in helping us keep our collection well-maintained and accessible to all members of the community. By returning your borrowed books on time, you make it possible for other readers to enjoy the same resources and continue their learning journey. Your support plays an important role in promoting the joy of reading and lifelong learning within our city. We look forward to serving you again soon and hope you find more books that inspire, inform, and entertain you.`,
              };

              await emailjs.send(
                "service_xq3itn4",
                "template_m7hwnqb",
                emailParams,
                "5JJ4BU1mfv1J_lZ3I"
              );

              await updateDoc(doc(db, "BooksData", d.id), {
                returnEmail: true,
              });
            }
          }
        }
      } catch (err) {
        console.error("Error checking due books:", err);
      } finally {
      }
    };

    checkDueBooks();
  }, []);

  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        if (dropDownName === "D1") {
          const snapshot = await getDocs(collection(db, "StudentHistory"));
          const monthCounts = Array(12).fill(0);

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (data.date) {
              const [month] = data.date.split("/").map(Number);
              if (month >= 1 && month <= 12) {
                monthCounts[month - 1] += 1;
              }
            }
          });

          const formatted = months.map((m, i) => ({
            month: m,
            value: monthCounts[i],
          }));

          setChartData(formatted);
        } else if (dropDownName === "D2") {
          const snapshot = await getDocs(collection(db, "BooksHistory"));
          const monthCounts = Array(12).fill(0);

          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (data.indicator === "borrowed" && data.date) {
              const [month] = data.date.split("/").map(Number);
              if (month >= 1 && month <= 12) {
                monthCounts[month - 1] += 1;
              }
            }
          });

          const formatted = months.map((m, i) => ({
            month: m,
            value: monthCounts[i],
          }));

          setChartData(formatted);
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [dropDownName]);

  useEffect(() => {
    if (dropDownName === "D1") {
      setDropDownTitle("Library Usage");
    } else if (dropDownName === "D2") {
      setDropDownTitle("Books Borrowed");
    } else if (dropDownName === "D3") {
      setDropDownTitle("Number of Students Borrowers");
    } else {
    }
  }, [dropDownName]);

  useEffect(() => {
    const parseTimeToDate = (timeStr) => {
      if (!timeStr) return new Date(0);
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes, seconds] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return new Date(1970, 0, 1, hours, minutes, seconds || 0);
    };

    const fetchingDetails = async () => {
      try {
        const snapshot = await getDocs(collection(db, "StudentHistory"));
        const filtered = snapshot.docs
          .map((doc) => doc.data())
          .filter((item) => item.status && item.status.includes("entered"))
          .sort((a, b) => parseTimeToDate(b.timein) - parseTimeToDate(a.timein))
          .slice(0, 10);
        setLogin(filtered);
      } catch (error) {
        console.log("error:", error);
      }
    };

    const fetchingDetailsLeft = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const snapshot2 = await getDocs(collection(db, "StudentHistoryLeft"));
        const filtered2 = snapshot2.docs
          .map((doc) => doc.data())
          .filter((item) => item.status && item.status.includes("left"))
          .sort(
            (a, b) => parseTimeToDate(b.timeouts) - parseTimeToDate(a.timeouts)
          )
          .slice(0, 10);
        setLogout(filtered2);
      } catch (error) {
        console.log("error:", error);
      }
    };

    fetchingDetailsLeft();
    fetchingDetails();
  });

  return (
    <motion.div
      className="p-10 h-[calc(100vh-1px)] overflow-hidden"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full p-10 flex flex-col h-full  bg-[#c0772a] rounded-xl">
        <div className="text-2xl font-kanit">
          <div className="text-white text-3xl uppercase">Dashboard</div>
        </div>
        {loading ? (
          <div className="w-full py-10 h-full justify-center items-center content-center flex ">
            <SyncLoader size={10} color="white" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col pb-10">
            <div className="mt-10">
              <motion.div
                className="w-full p-4 bg-white relative rounded-2xl shadow-md"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 1, type: "spring" }}
              >
                <div className="flex justify-between items-center px-10">
                  <h2 className="text-2xl font-semibold text-center uppercase font-kanit my-4">
                    {dropDownTitle}
                  </h2>
                  <div className="flex flex-col absolute right-0 text-white top-7 mr-10">
                    <div
                      onClick={() => setDropDown((prev) => !prev)}
                      className=" bg-[#f5b066] flex text-black font-kanit gap-8 hover:bg-[#c0772a] transition-all text-left px-6 cursor-pointer rounded-md shadow-md py-2"
                    >
                      <div>{dropDownTitle}</div>
                      <div
                        className={`" ${
                          dropDown ? "rotate-90" : ""
                        } flex items-center transition-all duration-200 ease-in-out "`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          class="size-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </div>
                    </div>

                    <AnimatePresence>
                      {dropDown && (
                        <motion.div
                          key="dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2  bg-[#f5b066] text-black font-kanit  shadow-lg z-50 rounded-md overflow-hidden"
                        >
                          <div
                            onClick={() => (
                              setDropDownName("D1"), setDropDown(false)
                            )}
                            className="px-4 py-2 hover:bg-[#c0772a] transition-all cursor-pointer"
                          >
                            Library Usage
                          </div>
                          <div
                            onClick={() => (
                              setDropDownName("D2"), setDropDown(false)
                            )}
                            className="px-4 py-2 hover:bg-[#c0772a] cursor-pointer transition-all"
                          >
                            Books Borrowed
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="w-full h-[calc(100vh-600px)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#f5b066"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
            <div className="mt-5 gap-5 flex flex-grow min-h-0">
              <motion.div
                className="bg-white p-5 flex flex-col rounded-2xl w-1/2 font-kanit min-h-0"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.4, type: "spring" }}
              >
                <div className="text-center font-kanit text-xl uppercase">
                  user who just logged in
                </div>
                <div className="flex-1 mt-2 overflow-y-auto gap-2 flex flex-col">
                  <AnimatePresence>
                    {login.map((enter, index) => (
                      <motion.div
                        key={enter.timein}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: index * 0.2 }}
                        className="flex justify-between px-5 rounded-md py-3 bg-[#f5b066]"
                      >
                        <div className="first-letter:uppercase">
                          {enter.name}
                        </div>
                        <div className="first-letter:uppercase">
                          {enter.timein}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
              <motion.div
                className="bg-white p-5 flex flex-col rounded-2xl w-1/2 font-kanit min-h-0"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6, type: "spring" }}
              >
                <div className="text-center font-kanit text-xl uppercase">
                  User Who Just Logged Out
                </div>
                <div className="flex-1 mt-2 overflow-y-auto gap-2 flex flex-col">
                  <AnimatePresence>
                    {logout.map((left, index) => (
                      <motion.div
                        key={left.timeouts}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, delay: index * 0.2 }}
                        className="flex justify-between px-5 rounded-md py-3 bg-[#f5b066]"
                      >
                        <div className="first-letter:uppercase">
                          {left.name}
                        </div>
                        <div className="first-letter:uppercase">
                          {left.timeouts}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Analytics;
