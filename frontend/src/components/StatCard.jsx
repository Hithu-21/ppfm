function StatCard({ title, value, color, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>

        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
      </div>

      <div className={`text-5xl ${color}`}>{icon}</div>
    </div>
  );
}

export default StatCard;