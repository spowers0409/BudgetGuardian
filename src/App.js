import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const location = useLocation(); // Get current URL path
  console.log("Current Path:", location.pathname); // Debugging log
  const hideSidebar = location.pathname.toLowerCase() === "/login" || location.pathname.toLowerCase() === "/register"; 
  console.log("Hide Sidebar:", hideSidebar); // Debugging log

  return (
    <div className="app-container">
      {!hideSidebar && <Sidebar />} {/* Only show sidebar if NOT on login page */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
