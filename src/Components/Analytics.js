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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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
  const data = [
    { month: "Jan", value: 320 },
    { month: "Feb", value: 90 },
    { month: "March", value: 150 },
    { month: "April", value: 630 },
    { month: "May", value: 713 },
    { month: "June", value: 170 },
    { month: "July", value: 110 },
    { month: "Aug", value: 180 },
    { month: "Sept", value: 660 },
    { month: "Oct", value: 140 },
    { month: "Nov", value: 100 },
    { month: "Dec", value: 590 },
  ];

  useEffect(() => {
    if (dropDownName === "D1") {
      setDropDownTitle("Library Usage by Students");
    } else if (dropDownName === "D2") {
      setDropDownTitle("Number of Books Borrowed");
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

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

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
        await new Promise((resolve) => setTimeout(resolve, 1500));
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
    <motion.div className="p-10 h-[calc(100vh-1px)] overflow-hidden"
    initial={{x: 100, opacity: 0}}
    animate={{x: 0, opacity: 1}}
    >
      <div className="w-full p-10 flex flex-col h-full  bg-[#c0772a] rounded-xl">
        <div className="text-2xl font-kanit">
          <div className="text-white text-3xl uppercase">Dashboard</div>
        </div>
        <div className="mt-10">
          <div className="w-full p-4 bg-white relative rounded-2xl shadow-md">
            <div className="flex justify-between items-center px-10">
              <h2 className="text-2xl font-semibold text-center uppercase font-kanit my-4">
                {dropDownTitle}
              </h2>
              <div className="flex flex-col absolute right-0 text-white top-7 mr-10">
                <div
                  onClick={() => setDropDown((prev) => !prev)}
                  className=" bg-[#f5b066] flex gap-8 hover:bg-[#c0772a] transition-all text-left px-6 cursor-pointer rounded-md shadow-md py-2"
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
                      className="mt-2  bg-[#f5b066]  shadow-lg z-50 rounded-md overflow-hidden"
                    >
                      <div
                        onClick={() => (
                          setDropDownName("D1"), setDropDown(false)
                        )}
                        className="px-4 py-2 hover:bg-[#c0772a] transition-all cursor-pointer"
                      >
                        Library Usage by Students
                      </div>
                      <div
                        onClick={() => (
                          setDropDownName("D2"), setDropDown(false)
                        )}
                        className="px-4 py-2 hover:bg-[#c0772a] cursor-pointer transition-all"
                      >
                        Number of Books Borrowed
                      </div>
                      <div
                        onClick={() => (
                          setDropDownName("D3"), setDropDown(false)
                        )}
                        className="px-4 py-2 hover:bg-[#c0772a] cursor-pointer transition-all"
                      >
                        Number of Students Borrowers
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="w-full h-[calc(100vh-600px)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f5b066" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-5 gap-5 flex flex-grow min-h-0">
          <div className="bg-white p-5 flex flex-col rounded-2xl w-1/2 font-kanit min-h-0">
            <div className="text-center font-kanit text-xl uppercase">
              Most Recent Student
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
                    <div className="first-letter:uppercase">{enter.name}</div>
                    <div className="first-letter:uppercase">{enter.timein}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="bg-white p-5 flex flex-col rounded-2xl w-1/2 font-kanit min-h-0">
            <div className="text-center font-kanit text-xl uppercase">
              Student Who Just Logged Out
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
                    <div className="first-letter:uppercase">{left.name}</div>
                    <div className="first-letter:uppercase">
                      {left.timeouts}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Analytics;
