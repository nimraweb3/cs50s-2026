import { NavLink, Route, Routes } from "react-router-dom";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import AddApplication from "./pages/AddApplication";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div className="app-shell">
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Applications
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? "active" : "")}>
          Add application
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
          My skills
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Applications />} />
        <Route path="/add" element={<AddApplication />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
