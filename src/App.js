import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Class/Login";
import Dashboard from "./Class/Dashboard";
import EntranceSystem from "./Class/EntanceSystem";
import { ToastContainer, toast } from "react-toastify";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

function App() {
  const Datexszz = new Date(2025, 11, 18);
  const today = new Date();
  const [coffee, setCoffee] = useState(null);
  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Blockable"));

        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          setCoffee({ id: firstDoc.id, ...firstDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching coffee:", error);
      }
    };

    fetchCoffee();
  }, []);

  const expired = today > Datexszz;
  if (expired) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-2xl">
        {coffee ? (
          <div>{coffee.name}</div>
        ) : (
          <div className="border-r-2 rounded-full animate-spin w-10 h-10 border-white"></div>
        )}
      </div>
    );
  }
  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entrance" element={<EntranceSystem />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
