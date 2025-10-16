import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { SyncLoader } from "react-spinners";

function BackLog() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // show 50 logs per page

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter by search
  const filteredHistory = history.filter((book) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      book.status?.toLowerCase().includes(searchLower) ||
      book.date?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
          <div className="w-full overflow-hidden mt-5 p-10 relative rounded-md bg-white shadow-md flex flex-col">
            <div className="flex justify-between items-center uppercase text-lg">
              <div>Notification</div>

              {/* 🔍 Search box */}
              <div className="border border-gray-600 rounded-md px-3 py-1">
                <input
                  className="focus:outline-none text-sm"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // reset to first page when searching
                  }}
                />
              </div>
            </div>

            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <SyncLoader size={10} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto border rounded-md overflow-hidden border-gray-400 mt-3">
                {currentItems.length > 0 ? (
                  currentItems.map((book, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between items-center border-gray-400 px-2 border-b"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div>{book.status}</div>
                      <div className="flex py-2 text-sm border-l border-gray-400 pl-10">
                        {book.date}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-5 text-gray-500">
                    No results found.
                  </div>
                )}
              </div>
            )}

            <div className="mt-2 flex justify-center gap-2 items-center select-none">
              <div
                onClick={() => handlePageChange(currentPage - 1)}
                className={`p-1 rounded-md cursor-pointer transition-all shadow-md text-white ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#c0772a] hover:bg-[#91591d]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </div>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <div
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`py-1 px-4 rounded-md cursor-pointer transition-all shadow-md ${
                      currentPage === page
                        ? "bg-[#91591d] text-white"
                        : "bg-[#c0772a] text-white hover:bg-[#91591d]"
                    }`}
                  >
                    {page}
                  </div>
                );
              })}

              <div
                onClick={() => handlePageChange(currentPage + 1)}
                className={`p-1 rounded-md cursor-pointer transition-all shadow-md text-white ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#c0772a] hover:bg-[#91591d]"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default BackLog;
