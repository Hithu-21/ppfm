import {
  FaChartLine,
  FaMoneyBillWave,
  FaWallet,
  FaTasks,
  FaFire,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-6 hidden md:flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-10 text-blue-400">PPFM</h1>

        <nav className="space-y-3">
          <div className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl cursor-pointer">
            <FaChartLine /> Dashboard
          </div>

          <div className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl cursor-pointer transition">
            <FaMoneyBillWave /> Expenses
          </div>

          <div className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl cursor-pointer transition">
            <FaWallet /> Income
          </div>

          <div className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl cursor-pointer transition">
            <FaTasks /> Tasks
          </div>

          <div className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-xl cursor-pointer transition">
            <FaFire /> Habits
          </div>
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