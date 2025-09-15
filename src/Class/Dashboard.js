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
import Example from "../Components/Example";
import EntranceSystem from "./EntanceSystem";


function Dashboard() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  return (
    <div className="flex flex-row bg-gradient-to-r from-[#f5b066] via-[#259048] to-[#f5b066] bg-[length:300%_300%] animate-gradient h-screen">
      <div className="w-1/4 h-full">
        <Sidebar setSelectedPage={setSelectedPage} />
      </div>

      <div className="w-3/4 h-full overflow-hidden">
        {selectedPage === "dashboard" && (
          <Analytics setSelectedPage={setSelectedPage} />
        )}
        {selectedPage === "reports" && <Reports />}
        {selectedPage === "bookmanager" && <BookManager />}
        {selectedPage === "computeravailability" && <ComputerManager />}
        {selectedPage === "tablemanager" && <TableManager />}
        {selectedPage === "admin" && <Admin />}
        {selectedPage === "borrowing" && <Borrowing />}
        {selectedPage === "settings" && <Settings />}
        {selectedPage === "bookm" && <BookManager />}
        {selectedPage === "blog" && <BackLog />}
        {selectedPage === "example" && <Example />}
        {selectedPage === "entrance" && <EntranceSystem  />}
      </div>
    </div>
  );
}


export default Dashboard;
