import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HodLayout from "../../components/HodLayout";
import api from "../../services/api";

function Mentors() {
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [mentors, setMentors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================
  // FETCH HOD MENTORS
  // ============================
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/hod/mentors");

        setDepartment(response.data.department || "");
        setMentors(response.data.mentors || []);
      } catch (err) {
        console.error("Error fetching mentors:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load mentors."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // ============================
  // GROUP MENTORS BY YEAR
  // ============================
  const getMentorsForYear = (year) => {
    return mentors
      .filter(
        (mentor) => Number(mentor.year) === Number(year)
      )
      .sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
  };

  const years = [1, 2, 3, 4];

  // ============================
  // OPEN MENTOR DETAILS
  // ============================
  const handleMentorClick = (mentor) => {
    navigate(`/hod/mentor/${mentor.id}`);
  };

  return (
    <HodLayout>
      <div className="space-y-8">

        {/* ============================
            HEADER
        ============================ */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Mentors
          </h1>

          <p className="mt-2 text-gray-600">
            Department:{" "}
            <span className="font-semibold text-orange-600">
              {department || "Loading..."}
            </span>
          </p>
        </div>

        {/* ============================
            LOADING
        ============================ */}
        {loading && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600">
              Loading mentors...
            </p>
          </div>
        )}

        {/* ============================
            ERROR
        ============================ */}
        {!loading && error && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* ============================
            MENTOR LIST
        ============================ */}
        {!loading && !error && (
          <div className="space-y-8">

            {years.map((year) => {
              const yearMentors = getMentorsForYear(year);

              // Don't show empty years
              if (yearMentors.length === 0) {
                return null;
              }

              return (
                <div
                  key={year}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >

                  {/* YEAR HEADER */}
                  <div className="px-6 py-5 border-b bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {year} Year Mentors
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {yearMentors.length}{" "}
                      {yearMentors.length === 1
                        ? "Mentor"
                        : "Mentors"}
                    </p>
                  </div>

                  {/* MENTORS */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {yearMentors.map((mentor) => (
                      <button
                        key={mentor.id}
                        onClick={() =>
                          handleMentorClick(mentor)
                        }
                        className="text-left border border-gray-200 rounded-xl p-5 bg-white hover:border-orange-400 hover:bg-orange-50 hover:shadow-md transition-all duration-200"
                      >

                        <div className="flex items-center gap-4">

                          {/* PROFILE PHOTO */}
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center flex-shrink-0">

                            {mentor.profilePhoto ? (
                              <img
                                src={mentor.profilePhoto}
                                alt={mentor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-orange-600 font-bold text-xl">
                                {mentor.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "M"}
                              </span>
                            )}

                          </div>

                          {/* MENTOR INFORMATION */}
                          <div className="min-w-0">

                            <h3 className="font-semibold text-gray-800 truncate">
                              {mentor.name || "Unknown Mentor"}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              Department:{" "}
                              {mentor.department || "-"}
                            </p>

                            <p className="text-sm text-gray-500">
                              Section:{" "}
                              {mentor.section || "-"}
                            </p>

                          </div>

                        </div>

                        {/* CONTACT */}
                        <div className="mt-5 pt-4 border-t border-gray-100">

                          <p className="text-sm text-gray-600">
                            Email:{" "}
                            <span className="text-gray-800">
                              {mentor.email || "-"}
                            </span>
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            Phone:{" "}
                            <span className="text-gray-800">
                              {mentor.phone || "-"}
                            </span>
                          </p>

                        </div>

                        {/* VIEW */}
                        <div className="mt-4 text-right">
                          <span className="text-sm font-medium text-orange-600">
                            View Details →
                          </span>
                        </div>

                      </button>
                    ))}

                  </div>
                </div>
              );
            })}

            {/* NO MENTORS */}
            {mentors.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                <p className="text-gray-500">
                  No mentors found in your department.
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </HodLayout>
  );
}

export default Mentors;