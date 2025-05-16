import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const data = [
    { month: "January", value: 320 },
    { month: "February", value: 90 },
    { month: "March", value: 150 },
    { month: "April", value: 630 },
    { month: "May", value: 713 },
    { month: "June", value: 170 },
    { month: "July", value: 110 },
    { month: "August", value: 180 },
    { month: "September", value: 660 },
    { month: "October", value: 140 },
    { month: "November", value: 100 },
    { month: "December", value: 590 },
  ];

  return (
    <div className="p-10 h-screen overflow-hidden">
      <div className="w-full p-10 flex flex-col h-full bg-blue-700 rounded-xl">
        <div className="text-2xl font-kanit">
          <div className="text-white text-3xl uppercase">Dashboard</div>
        </div>
        <div className="mt-10">
          <div className="w-full p-4 bg-white relative rounded-2xl shadow-md">
            <div className="absolute top-6 right-8">
              <div className="bg-gray-200 px-8 cursor-pointer rounded-md shadow-md py-2">Library Usage by Students </div>
            </div>
            <h2 className="text-2xl font-semibold text-center uppercase font-kanit my-4">
              Library Usage by Students
            </h2>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#A76545" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-5 gap-5 flex h-full">
          <div className="bg-white p-5 flex flex-col rounded-2xl w-1/2 font-serif">
            <div className="text-center font-kanit text-xl uppercase">
              Most Recent Student
            </div>
            <div className="flex max-h-[200px] mt-2  overflow-y-auto gap-5 flex-col overflow-x-auto overflow-auto">
              <motion.div
                className="py-5 flex justify-between shadow-md px-16 bg-blue-500 text-white font-kanit rounded-xl text-lg"
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </motion.div>

              <motion.div
                className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg"
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div>Aries Jordan</div>
                <div>Senior High</div>
              </motion.div>

              <motion.div
                className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg"
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </motion.div>

              <div className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg">
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </div>

              <div className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg">
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </div>

              <div className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg">
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </div>

              <div className="py-5 flex justify-between shadow-md px-16  text-white font-kanit bg-blue-500 rounded-xl text-lg">
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 flex flex-col rounded-2xl w-1/2 font-serif">
            <div className="text-center font-kanit text-xl uppercase">
              Student Who Just Logged Out
            </div>
            <div className="flex max-h-[200px] mt-2  overflow-y-auto gap-5 flex-col overflow-x-auto overflow-auto">
              <motion.div
                className="py-5 flex justify-between shadow-md px-16 bg-blue-500 text-white font-kanit rounded-xl text-lg"
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div>Harvey Pilon</div>
                <div>College</div>
              </motion.div>

              <motion.div
                className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg"
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div>Cedric Vallecer</div>
                <div>Senior High</div>
              </motion.div>

              <motion.div
                className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg"
                initial={{ y: 300 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </motion.div>

              <div className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg">
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </div>

              <div className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg">
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </div>

              <div className="py-5 flex justify-between shadow-md px-16 text-white font-kanit bg-blue-500 rounded-xl text-lg">
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </div>

              <div className="py-5 flex justify-between shadow-md px-16  text-white font-kanit bg-blue-500 rounded-xl text-lg">
                <div>Kim Feil Garnace</div>
                <div>College</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
