import {
  FaChartLine,
  FaMoneyBillWave,
  FaWallet,
  FaTasks,
  FaFire,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-6 hidden md:flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-10 text-blue-400">PPFM</h1>

        <nav className="space-y-3">
          <NavLink to="/dashboard" className={linkClass}>
            <FaChartLine /> Dashboard
          </NavLink>

          <NavLink to="/expenses" className={linkClass}>
            <FaMoneyBillWave /> Expenses
          </NavLink>

          <NavLink to="/income" className={linkClass}>
            <FaWallet /> Income
          </NavLink>

          <NavLink to="/tasks" className={linkClass}>
            <FaTasks /> Tasks
          </NavLink>

          <NavLink to="/habits" className={linkClass}>
            <FaFire /> Habits
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <div className="flex items-center gap-3 mb-5">
          <FaUserCircle className="text-3xl text-slate-400" />
          <div>
            <p className="font-semibold">User</p>
            <p className="text-xs text-slate-400">PPFM Account</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;