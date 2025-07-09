import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Analytics from "../Components/Analytics";
import Reports from "../Components/Reports";
import BookManager from "../Components/BookManager";
import TableManager from "../Trash/TableManager";
import ComputerManager from "../Trash/ComputerManager";
import Admin from "../Components/Admin";
import Borrowing from "../Components/Borrowing";
import Settings from "../Components/Settings";
import BackLog from "../Components/BackLog";

function Dashboard() {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  return (
    <div>
      <div className="flex flex-row h-[calc(100vh-0px)]">
        <div className="w-1/4 h-[calc(100vh-64px)]">
          <Sidebar setSelectedPage={setSelectedPage} />
        </div>
        <div className="w-3/4 ">
          {selectedPage === "dashboard" && (
            <h1 className=" w-full overflow-hidden">
              <Analytics setSelectedPage={setSelectedPage} />
            </h1>
          )}
          {selectedPage === "reports" && (
            <h1 className=" w-full overflow-hidden">
              <Reports />
            </h1>
          )}
          {selectedPage === "bookmanager" && (
            <h1 className=" w-full overflow-hidden">
              <BookManager />
            </h1>
          )}
          {selectedPage === "computeravailability" && (
            <h1 className=" w-full overflow-hidden">
              <ComputerManager />
            </h1>
          )}
          {selectedPage === "tablemanager" && (
            <h1 className=" w-full overflow-hidden">
              <TableManager />
            </h1>
          )}
          {selectedPage === "admin" && (
            <h1 className=" w-full overflow-hidden">
              <Admin />
            </h1>
          )}
          {selectedPage === "borrowing" && (
            <h1 className=" w-full overflow-hidden">
              <Borrowing />
            </h1>
          )}
          {selectedPage === "settings" && (
            <h1 className=" w-full overflow-hidden">
              <Settings />
            </h1>
          )}

          {selectedPage === "bookm" && (
            <h1 className=" w-full overflow-hidden">
              <BookManager />
            </h1>
          )}

          {selectedPage === "blog" && (
            <h1 className=" w-full overflow-hidden">
              <BackLog />
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
