import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { SyncLoader } from "react-spinners";

function Reports() {
  const [tab, setTab] = useState("Use");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "StudentHistory"));
        const studentData = querySnapshot.docs.map((doc) => doc.data());

        studentData.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.timein}`);
          const dateB = new Date(`${b.date} ${b.timein}`);
          return dateB - dateA;
        });

        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  });

  return (
    <motion.div
      className="p-10 h-[calc(100vh-1px)]"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="w-full p-10 flex flex-col h-full bg-[#c0772a] rounded-xl">
        <div className="text-white text-3xl h-[5%] font-kanit uppercase">
          Account Logs
        </div>

        <div className="flex relative h-[95%]">
          <motion.div
            className="w-full overflow-hidden  mt-5 p-10 relative rounded-md bg-white shadow-md flex flex-col"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1, type: "spring" }}
          >
            <div className="grid grid-cols-6 gap-3 w-full uppercase border-b text-lg">
              <div className="col-span-3">Student name</div>
              {/* <div>Grade Level</div> */}
              <div>Status</div>
              <div>time-in</div>
              <div>time-out</div>
            </div>

            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <SyncLoader size={10} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto  mt-3">
                {students.map((student, index) => (
                  <motion.div
                    key={index}
                    className="grid grid-cols-6 gap-3 first-letter:uppercase py-2 px-5 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="first-letter:uppercase col-span-3 truncate">
                      {student.name}
                    </div>
                    {/* <div className="text-center"></div> */}
                    <div className="flex justify-center">
                      {student.timeout ? (
                        <div className="bg-red-600  w-5 rounded-full h-5"></div>
                      ) : (
                        <div className="relative cursor-pointer">
                          <div className="bg-green-600 absolute animate-ping w-5 rounded-full h-5"></div>
                          <div className="bg-green-600 animate-pulse w-5 rounded-full h-5"></div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">{student.timein}</div>
                    <div className="text-center">{student.timeout}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Reports;
