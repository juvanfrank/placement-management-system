import HodLayout from "../../components/HodLayout";

function HodDashboard() {
  return (
    <HodLayout>

      <div className="space-y-6">

        <div className="bg-white rounded-2xl shadow p-8">

          <h2 className="text-3xl font-bold text-orange-600">
            HOD Dashboard
          </h2>

          <p className="text-gray-600 mt-3">
            View and manage department academic information.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-orange-600">
              Students
            </h3>

            <p className="text-gray-500 mt-2">
              View students year-wise and access their profiles.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-semibold text-orange-600">
              Mentors
            </h3>

            <p className="text-gray-500 mt-2">
              View mentors assigned to your department.
            </p>
          </div>

        </div>

      </div>

    </HodLayout>
  );
}

export default HodDashboard;