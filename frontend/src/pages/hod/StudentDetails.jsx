import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import HodLayout from "../../components/HodLayout";
import StudentProfileView from "../../components/StudentProfileView";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const year = searchParams.get("year");
  const section = searchParams.get("section");

  const handleBack = () => {
    if (year && section) {
      navigate(
        `/hod/students?year=${year}&section=${encodeURIComponent(
          section
        )}`
      );
    } else if (year) {
      navigate(`/hod/students?year=${year}`);
    } else {
      navigate("/hod/students");
    }
  };

  return (
    <HodLayout>
      <div className="space-y-5">

        {/* BACK BUTTON */}

        <button
          onClick={handleBack}
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