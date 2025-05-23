import React from "react";
import pfp from '../Images/settingspfp.png'

function Settings() {
  return (
    <div className="p-10 h-[calc(100vh-1px)] overflow-hidden">
      <div className="w-full p-10 flex flex-col h-full bg-blue-700 rounded-xl">
        <div className="text-2xl font-kanit">
          <div className="text-white text-3xl uppercase">
            Account Information
          </div>
        </div>
        <div className="mt-10 h-full">
          <div className="w-full flex p-10 bg-white relative rounded-2xl shadow-md">
            <div>
              <img className="rounded-xl p-5 bg-[#366bff]" src={pfp} />
            </div>
            <div className="ml-4 grid text-3xl font-kanit items-center grid-rows-6">
              <div>Name: Cedric Vallecer</div>
              <div>Student Number: 02000250123 </div>
              <div>Grade Level: Tertiary </div>
              <div>Year Level: 4th Year </div>
              <div>Age: 19   </div>
              <div>Email: cdrcvllcr@gmail.com </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
