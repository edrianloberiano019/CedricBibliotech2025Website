import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { SyncLoader } from "react-spinners";

function BackLog() {
  const [tab, setTab] = useState("use");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "BooksHistory"));
        const studentData = querySnapshot.docs.map((doc) => doc.data());
        studentData.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });

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
      className="p-10 h-[calc(100vh-1px)]"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full p-10 flex flex-col h-full bg-[#c0772a] rounded-xl">
        <div className="text-white text-3xl font-kanit uppercase">
          Book Logs
        </div>

        <motion.div
          className="flex relative overflow-y-auto h-full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1, type: "spring" }}
        >
          <div className="w-full overflow-hidden  mt-5 p-10 relative rounded-md bg-white shadow-md flex flex-col">
            <div className="flex justify-between uppercase border-b text-lg">
              <div>Notification</div>
            </div>

            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <SyncLoader size={10} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto  mt-3">
                {history.map((book, index) => (
                  <motion.div
                    key={index}
                    className="flex py-2 justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>{book.status}</div>
                    <div className="text-gray-500 text-sm">{book.date}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default BackLog;
