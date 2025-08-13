import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

function Example() {
  const [uid, setUid] = useState("Waiting for card...");
  const [scanid, setScanID] = useState(false);
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [tapLoading, setTapLoading] = useState(true);

  useEffect(() => {
    const fetchUID = async () => {
      try {
        const res = await fetch("http://192.168.254.100/uid");
        const data = await res.json();
        if (data.uid) {
          setUid(data.uid.toUpperCase());
        }
      } catch (err) {
        console.error(err);
        setUid("Error connecting to ESP");
      }
    };

    const interval = setInterval(fetchUID, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "StudentAccount", uid), {
        name: name,
        section: section,
        uid: uid,
      });

      const response = await fetch(
        `http://192.168.254.100/write?name=${name}&section=${section}`
      );
      const result = await response.json();
      if (result.status && result.status.includes("Ready")) {
        toast.success("Registered and written to card!");
      } else {
        toast.error("Card write failed!");
        return;
      }

      toast.success("Registered and written to card!");
      setScanID(false);
      setName("");
      setSection("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const onSubmitChecker = (e) => {
    e.preventDefault();
    setScanID(true);
  };

  const cancelpo = () => {
    setUid("");
  };

  return (
    <div className="p-10 h-screen overflow-hidden">
      <div className="w-full relative p-10 flex flex-col h-full bg-blue-700 rounded-xl">
        <form onSubmit={onSubmitChecker}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name:"
            required
          />
          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="section"
            required
          />
          <button className="cursor-pointer" type="submit">
            next
          </button>
        </form>
        {scanid ? (
          <>
            <div className="absolute top-0 left-0 justify-center flex items-center w-full h-full z-30">
              <div
                onClick={() => {
                  setScanID(false);
                  setUid("");
                }}
                className="absolute top-0 left-0 w-full h-full cursor-pointer bg-[#00000079]"
              ></div>
              <div className="relative z-40 bg-white rounded-xl shadow-md p-10">
                {uid === "Waiting for card..." ? (
                  <div className="text-2xl mb-6 uppercase">
                    Scan your ID to continue
                  </div>
                ) : (
                  <div className="text-2xl mb-6 uppercase">
                    Are you sure with this card?
                  </div>
                )}
                <div>Name: {name}</div>
                <div>Section: {section}</div>
                <div className="flex items-center ">
                  <div className="mr-2">Scan your ID:</div>
                  {uid === "Waiting for card..." ? (
                    <ClipLoader size={20} />
                  ) : (
                    <div>{uid}</div>
                  )}
                </div>
                <div className="w-full justify-end flex gap-3 mt-3">
                  <div
                    onClick={() => setUid("Waiting for card...")}
                    className="bg-red-700 hover:bg-red-800 cursor-pointer px-3 py-1 rounded-md shadow-md text-white"
                  >
                    No
                  </div>
                  <div
                    onClick={handleRegister}
                    className="bg-green-700 hover:bg-green-800 cursor-pointer px-5 py-1 rounded-md shadow-md text-white"
                  >
                    Yes
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Example;
