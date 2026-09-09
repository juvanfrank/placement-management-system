import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import StudentProfileView from "../../components/StudentProfileView";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="space-y-5">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Back to Students
        </button>

        {/* COMMON STUDENT PROFILE */}
        <StudentProfileView
          profileEndpoint={`/admin/student/${id}`}
          readOnly={true}
        />

      </div>
    </AdminLayout>
  );
}

export default StudentDetails;