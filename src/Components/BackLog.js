import React, { useState } from "react";
import { motion } from "framer-motion";

function BackLog() {
  const [tab, setTab] = useState("use");

  return (
    <div className="p-10 h-[calc(100vh-1px)] overflow-hidden">
      <div className="w-full p-10 flex flex-col h-full bg-blue-700 rounded-xl">
        <div className="mb-10">
          <div className="text-white text-3xl font-kanit uppercase">
            Book Logs
          </div>
        </div>
        <div>
          <div className="w-full mt-5 p-10  rounded-md bg-white shadow-md">
            <div className="flex justify-between uppercase border-b pb-3 text-lg">
              <div>Notification</div>
            </div>
            <div className="flex py-2 justify-between">
              <div>Cedric Vallecer has returned the book Noli Me Tangere.</div>
              <div className="gap-5 flex">
                <div>5/21/2025</div>
                <div>5:59 PM</div>
              </div>
            </div>

            <div className="flex py-2 justify-between">
              <div>Cedric Vallecer has borrowed the book Noli Me Tangere.</div>
              <div className="gap-5 flex">
                <div>5/21/2025</div>
                <div>1:59 PM</div>
              </div>
            </div>

            <div className="flex py-2 justify-between">
              <div>Reminder: Cedric Vallecer needs to return the book Noli Me Tangere by May 23, 2025.</div>
              <div className="gap-5 flex">
                <div>5/21/2025</div>
                <div>1:59 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackLog;
