import { useNavigate, useParams } from "react-router-dom";
import HodLayout from "../../components/HodLayout";
import StudentProfileView from "../../components/StudentProfileView";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <HodLayout>
      <div className="space-y-5">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/hod/students")}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Back to Students
        </button>

        {/* COMMON STUDENT PROFILE */}
        <StudentProfileView
          profileEndpoint={`/hod/student/${id}`}
          readOnly={true}
        />

      </div>
    </HodLayout>
  );
}

export default StudentDetails;