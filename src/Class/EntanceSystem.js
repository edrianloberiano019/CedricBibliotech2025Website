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
  getDoc,
  deleteDoc
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
        const res = await fetch("http://10.251.21.125/uid");
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
      if (!uid) return;

      try {
        const now = new Date();
        let fieldToUpdate = "";

        const studentRef = doc(db, "StudentAccount", uid);
        let studentSnap = await getDoc(studentRef);

        let studentData = null;
        let sourceCollection = "StudentAccount";

        if (!studentSnap.exists()) {
          const archiveRef = doc(db, "ArchiveAccount", uid);
          const archiveSnap = await getDoc(archiveRef);

          if (!archiveSnap.exists()) {
            
            return;
          }

          studentData = archiveSnap.data();
          sourceCollection = "StudentAccount";

          console.log(
            `Found student in ArchiveAccount (${uid}) → transferring back...`
          );

          await setDoc(doc(db, "StudentAccount", uid), {
            ...studentData,
            setPermission: "Access Granted"
          });

          await deleteDoc(archiveRef);

          
          studentSnap = await getDoc(doc(db, "StudentAccount", uid));
        } else {
          studentData = studentSnap.data();
          console.log(`Found student in StudentAccount (${uid})`);
        }
        const customDate = now.toLocaleString();
        const safeId =
          customDate.replace(/[\/\\#?]/g, "_") || `history_${Date.now()}`;

        if (!studentData.timein) {
          fieldToUpdate = "timein";

          const docRef = await addDoc(collection(db, "StudentHistory"), {
            status: ` ${studentData.firstname} ${studentData.lastname} entered the library.`,
            name: `${studentData.firstname} ${studentData.lastname}`,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            timein: now.toLocaleTimeString(),
            timeout: null,
            ["date/time"]: now.toLocaleString(),
          });

          await updateDoc(doc(db, "StudentAccount", uid), {
            id: docRef.id,
          });
        } else {
          fieldToUpdate = "timeout";

          const id = studentData.id;
          await updateDoc(doc(db, "StudentHistory", id), {
            timeout: now.toLocaleTimeString(),
            archivetime: now.toLocaleTimeString(),
          });

          await addDoc(collection(db, "StudentHistoryLeft"), {
            status: ` ${studentData.firstname} ${studentData.lastname} left the library.`,
            name: `${studentData.firstname} ${studentData.lastname}`,
            timeouts: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
          });

          setTimeouts(now);
        }

        await updateDoc(doc(db, "StudentAccount", uid), {
          [fieldToUpdate]: now,
        });

        if (fieldToUpdate === "timeout") {
          setTimeout(async () => {
            try {
              await updateDoc(doc(db, "StudentAccount", uid), {
                timein: null,
                timeout: null,
                archivetime: now
              });
              setTimeouts("");
            } catch (error) {
              console.error("Error resetting time fields:", error);
            }
          }, 5000);
        }
      } catch (error) {
        console.error("Error in updateTime:", error);
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
