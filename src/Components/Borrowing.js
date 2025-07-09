import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

function Borrowing() {
  const [modalBorrow, setModalBorrow] = useState(false);
  const [modalView, setModalView] = useState(false);
  return (
    <div className="p-10 h-[calc(100vh-1px)] overflow-hidden">
      <div className="w-full p-10 flex flex-col h-full relative bg-blue-700 overflow-hidden rounded-xl">
        <div className="mb-10">
          <div className="text-white text-3xl font-kanit uppercase">
            Borrowing
          </div>
        </div>
        <div>
          <div className="flex ">
            <input
              className="px-5 py-2 rounded-l-full"
              type="text"
              placeholder="Search"
            />
            <div className="cursor-pointer pr-4 pl-3 rounded-r-full py-1 flex bg-green-500 overflow-hidden hover:bg-green-600 transition-all  ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-8 text-white hover:scale-110 ease-out transition-all"
              >
                <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="w-full mt-5 p-10 rounded-md bg-white shadow-md">
            <div className="flex justify-between uppercase border-b pb-3 text-lg">
              <div className="grid grid-cols-8 w-full grid-flow-col  gap-6 uppercase">
                <div className=" col-span-3">Book Title</div>

                <div>Status</div>
                <div>Author</div>
                <div>Category</div>
                <div>Year</div>
              </div>
            </div>
            <div className="mt-2 grid gap-1">
              <div className="flex justify-between text-lg">
                <div className="grid grid-cols-8 w-full grid-flow-col items-center justify-center gap-6 ">
                  <div className="col-span-3">Noli Me Tangere</div>
                  <div className="text-green-600 font-semibold">Available</div>
                  <div className="text-ellipsis truncate">Jose Rizal</div>
                  <div>Fiction</div>
                  <div>1887</div>
                  <div
                    onClick={() => setModalBorrow(true)}
                    className="py-1 px-3 cursor-pointer uppercase text-sm text-center text-white bg-green-700 hover:bg-green-800 transition-all rounded-md shadow-md"
                  >
                    Borrow
                  </div>
                </div>
              </div>

              <div className="flex justify-between  text-lg">
                <div className="grid grid-cols-8 w-full grid-flow-col items-center justify-center gap-6 ">
                  <div className="col-span-3">El Filibusterismo</div>
                  <div className="text-red-600 font-semibold">Borrowed</div>
                  <div className="text-ellipsis truncate">Jose Rizal</div>
                  <div>Fiction</div>
                  <div>1891</div>
                  <div
                    onClick={() => setModalView(true)}
                    className="py-1 px-3 cursor-pointer uppercase text-sm text-center text-white bg-blue-700 hover:bg-blue-800 transition-all rounded-md shadow-md"
                  >
                    view
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                onClick={() => setModalBorrow(false)}
                className="z-30 bg-[#00000094] cursor-pointer backdrop-blur-sm w-full h-full absolute "
              ></div>
              <div className="bg-white relative z-40 p-5 rounded-2xl shadow-xl">
                <div className="bg-blue-700 p-4 rounded-md shadow-xl text-white">
                  <div className="text-sm">Schedule to Return: </div>
                  <input type="date" className="rounded-lg focus:outline-none text-black px-8 py-1 text-lg" />
                  <div className="mt-4 justify-end text-sm flex">
                    <div
                      onClick={() => setModalView(false)}
                      className="px-6 py-2 cursor-pointer  bg-green-500 rounded-md shadow-lg hover:bg-green-600 transition-all duration-200 uppercase "
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
              <div className="bg-white relative w-full z-40 p-5 rounded-2xl shadow-xl">
                <div className="bg-blue-700 p-4 rounded-md flex flex-col shadow-xl text-white">
                  <div className="grid grid-flow-row grid-cols-7 bg-white text-black px-4 py-2 rounded-t-md border-b  text-sm">
                    <div className="text-">Student Number: </div>
                    <div className="text-">Student Name: </div>
                    <div className="text-l">Borrowed Book: </div>
                    <div className="textxl">D/T Borrowed: </div>
                    <div className="tex-xl">D/T to Return: </div>
                    <div className="tet-xl">Grade Level: </div>
                    <div className="txt-xl">Year Level: </div>
                  </div>

                  <div className="grid grid-flow-row grid-cols-7 bg-white text-black px-4 py-2 rounded-b-md text-sm">
                    <div className="text-">0200257642 </div>
                    <div className="text-">Edrian Loberiano </div>
                    <div className="text-l">Shuckable </div>
                    <div className="textxl">6/19/2025 </div>
                    <div className="tex-xl">6/19/2025 </div>
                    <div className="tet-xl">Tertiary </div>
                    <div className="txt-xl">4th </div>
                  </div>

                  <div className="mt-4 justify-end text-sm flex">
                    <div
                      onClick={() => setModalView(false)}
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
    </div>
  );
}

export default Borrowing;
