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

function App() {
  const expirationDate = new Date(2025, 7, 20);
  const today = new Date();

  const expired = today > expirationDate;

  if (expired) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-2xl">
        This website is no longer available. Please contact the developer.
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
