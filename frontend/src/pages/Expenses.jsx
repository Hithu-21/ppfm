import DashboardLayout from "../layouts/DashboardLayout";

function Expenses() {
  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-2">Expenses</h1>
      <p className="text-gray-500">Manage your expenses here.</p>
    </DashboardLayout>
  );
}

export default Expenses;