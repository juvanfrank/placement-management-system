import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HodLayout from "../../components/HodLayout";
import api from "../../services/api";

function MentorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH MENTOR DETAILS
  // ==================================================

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/hod/mentor/${id}`
        );

        console.log(
          "HOD MENTOR DETAILS:",
          response.data
        );

        setMentor(
          response.data?.mentor || null
        );

        setStudents(
          response.data?.students || []
        );

      } catch (error) {
        console.error(
          "FETCH HOD MENTOR DETAILS ERROR:",
          error.response || error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load mentor details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentorDetails();
    }
  }, [id]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <HodLayout>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-gray-500">
            Loading mentor details...
          </p>
        </div>
      </HodLayout>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <HodLayout>
        <div className="space-y-5">

          <button
            onClick={() =>
              navigate("/hod/mentors")
            }
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Mentors
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8">
            <p className="text-red-600 text-center">
              {error}
            </p>
          </div>

        </div>
      </HodLayout>
    );
  }

  // ==================================================
  // MENTOR NOT FOUND
  // ==================================================

  if (!mentor) {
    return (
      <HodLayout>
        <div className="space-y-5">

          <button
            onClick={() =>
              navigate("/hod/mentors")
            }
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Mentors
          </button>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <p className="text-gray-500 text-center">
              Mentor not found.
            </p>
          </div>

        </div>
      </HodLayout>
    );
  }

  // ==================================================
  // DISPLAY
  // ==================================================

  return (
    <HodLayout>
      <div className="space-y-6">

        {/* BACK BUTTON */}

        <button
          onClick={() =>
            navigate("/hod/mentors")
          }
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Back to Mentors
        </button>

        {/* MENTOR HEADER */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

            {/* PROFILE PHOTO */}

            <div className="flex-shrink-0">

              {mentor.profilePhoto ? (
                <img
                  src={mentor.profilePhoto}
                  alt={mentor.name || "Mentor"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">

                  <span className="text-gray-400 text-4xl">
                    {mentor.name
                      ? mentor.name
                          .charAt(0)
                          .toUpperCase()
                      : "M"}
                  </span>

                </div>
              )}

            </div>

            {/* BASIC INFORMATION */}

            <div className="flex-1 text-center md:text-left">

              <h1 className="text-3xl font-bold text-gray-800">
                {mentor.name || "Not provided"}
              </h1>

              <p className="text-gray-500 mt-1">
                {mentor.email || "Not provided"}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">

                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                  {mentor.department ||
                    "Department not provided"}
                </span>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                  Year{" "}
                  {mentor.year || "Not provided"}
                </span>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  Section{" "}
                  {mentor.section ||
                    "Not provided"}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* PERSONAL INFORMATION */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Mentor Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InfoItem
              label="Name"
              value={mentor.name}
            />

            <InfoItem
              label="Email"
              value={mentor.email}
            />

            <InfoItem
              label="Age"
              value={mentor.age}
            />

            <InfoItem
              label="Department"
              value={mentor.department}
            />

            <InfoItem
              label="Year"
              value={mentor.year}
            />

            <InfoItem
              label="Section"
              value={mentor.section}
            />

            <InfoItem
              label="Phone"
              value={mentor.phone}
            />

            <InfoItem
              label="Address"
              value={mentor.address}
              fullWidth
            />

          </div>

        </div>

        {/* ASSIGNED STUDENTS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <div className="flex items-center justify-between mb-5">

            <h2 className="text-xl font-semibold text-gray-800">
              Assigned Students
            </h2>

            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
              {students.length} Students
            </span>

          </div>

          {students.length === 0 ? (
            <div className="py-8 text-center">

              <p className="text-gray-500">
                No students are currently assigned
                to this mentor.
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {students.map((student) => (
                <div
                  key={student.id}
                  className="border border-gray-200 rounded-xl p-4"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {student.name ||
                          "Not provided"}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Register Number:{" "}
                        {student.registerNumber ||
                          "Not provided"}
                      </p>

                    </div>

                    <div className="text-sm text-gray-500">

                      <p>
                        {student.department ||
                          "Department"}
                      </p>

                      <p>
                        Year{" "}
                        {student.year ||
                          "Not provided"}
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* READ ONLY NOTICE */}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

          <p className="text-blue-700 text-sm text-center">
            HOD can view mentor information but
            cannot edit this mentor profile.
          </p>

        </div>

      </div>
    </HodLayout>
  );
}

// ==================================================
// INFO ITEM
// ==================================================

function InfoItem({
  label,
  value,
  fullWidth = false,
}) {
  return (
    <div
      className={
        fullWidth
          ? "md:col-span-2"
          : ""
      }
    >

      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-gray-800 font-medium break-words">
        {value === null ||
        value === undefined ||
        value === ""
          ? "Not provided"
          : value}
      </p>

    </div>
  );
}

export default MentorDetails;