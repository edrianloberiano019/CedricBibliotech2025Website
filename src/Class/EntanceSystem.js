import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AnimatePresence, motion } from "framer-motion";

function EntanceSystem() {
  const [uid, setUid] = useState("");
  const [userData, setUserData] = useState("");
  const [docId, setDocId] = useState("");
  const [timeouts, setTimeouts] = useState("");
  const [id, setID] = useState(false);
  const now = new Date();

  useEffect(() => {
    const fetchUID = async () => {
      try {
        const res = await fetch("http://10.222.56.125/uid");
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

  useEffect(() => {
    const fetchDetails = async () => {
      if (!uid) return;

      try {
        const q = query(
          collection(db, "StudentAccount"),
          where("cardUID", "==", uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const docData = docSnap.data();
          setID(false);
          setUserData(docData);

          setDocId(docSnap.id);
        } else {
          setUserData(null);
          setDocId(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, [uid]);

  useEffect(() => {
    const updateTime = async () => {
      if (!docId || !userData) return;

      const now = new Date();
      let fieldToUpdate = "";

      const customDate = now.toLocaleString();
      const safeId =
        customDate.replace(/[\/\\#?]/g, "_") || `history_${Date.now()}`;

      if (!userData.timein) {
        fieldToUpdate = "timein";
        const docRef = await addDoc(collection(db, "StudentHistory"), {
          status: ` ${userData.firstname} ${userData.lastname} entered the library.`,
          name: `${userData.firstname} ${userData.lastname}`,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          timein: now.toLocaleTimeString(),
          timeout: null,
          ["date/time"]: now.toLocaleString(),
        });

        await updateDoc(doc(db, "StudentAccount", docId), {
          id: docRef.id,
        });
      } else {
        fieldToUpdate = "timeout";

        const id = userData.id;
        console.log(id);
        await updateDoc(doc(db, "StudentHistory", userData.id), {
          timeout: now.toLocaleTimeString(),
        });

        await addDoc(collection(db, "StudentHistoryLeft"), {
          status: ` ${userData.firstname} ${userData.lastname} left the library.`,
          name: `${userData.firstname} ${userData.lastname}`,
          timeouts: now.toLocaleTimeString(),
          date: now.toLocaleDateString()
        });
        setTimeouts(now);
      }

      try {
        await updateDoc(doc(db, "StudentAccount", docId), {
          [fieldToUpdate]: now,
        });
        console.log(`${fieldToUpdate} updated for doc:`, docId);

        if (fieldToUpdate === "timeout") {
          setTimeout(async () => {
            try {
              await updateDoc(doc(db, "StudentAccount", docId), {
                timein: null,
                timeout: null,
              });

              setTimeouts("");
            } catch (error) {
              console.error("Error po", error);
            }
          }, 5000);
        }
      } catch (error) {
        console.error("Error updating time:", error);
      }
    };

    updateTime();
  }, [uid, docId, userData]);

  useEffect(() => {
    if (!userData && !uid) return;

    const timer = setTimeout(() => {
      setUserData(null);
      setUid("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [userData, uid]);

  console.log(userData)

  return (
    <div className=" w-full flex h-[calc(100vh-0px)]">
      <div className="bg-gradient-to-r from-[#f5b066] via-[#259048] to-[#f5b066] bg-[length:300%_300%] backdrop-blur-[8px] animate-gradient w-full h-full flex justify-center items-center content-center">
        <motion.div
          layout
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-[#ffffffa1] backdrop-blur-md rounded-2xl flex justify-center items-center shadow-md p-10"
        >
          {userData ? (
            <motion.div
              layout
              className="text-4xl text-[#3b2f2f] font-Anton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-8xl uppercase">user Information</p>
              <p className="mt-4">
                Name: {userData.firstname} {userData.middlename}{" "}
                {userData.lastname}
              </p>
              <p>Email: {userData.email}</p>
              <p>
                Time In:
                {userData.timein?.toDate
                  ? userData.timein.toDate().toLocaleString()
                  : now.toLocaleString()}
              </p>
              <p>Time Out: {timeouts.toLocaleString()}</p>
            </motion.div>
          ) : (
            <motion.h1
              layout
              className="text-9xl text-[#3b2f2f] font-Anton uppercase"
            >
              Tap your ID
            </motion.h1>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default EntanceSystem;
