import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
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
    <motion.div className="p-10 h-[calc(100vh-1px)]"
    initial={{x: 100, opacity: 0}}
    animate={{x: 0, opacity: 1}}>
      <div className="w-full p-10 flex flex-col h-full bg-[#c0772a] rounded-xl">
        <div className="text-white text-3xl font-kanit uppercase">
          Book Logs
        </div>

        <div className="flex relative overflow-y-auto h-full">
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
                  <div key={index} className="flex py-2 justify-between">
                    <div>{book.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BackLog;
