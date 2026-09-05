import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HodLayout from "../../components/HodLayout";
import api from "../../services/api";

function Students() {
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [students, setStudents] = useState([]);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================
  // FETCH HOD STUDENTS
  // ============================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/hod/students");

        setDepartment(response.data.department || "");
        setStudents(response.data.students || []);
      } catch (err) {
        console.error("Error fetching HOD students:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load students."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // ============================
  // GET YEARS FROM STUDENTS
  // ============================
  const getStudentsForYear = (year) => {
    return students.filter(
      (student) => Number(student.year) === Number(year)
    );
  };

  // ============================
  // GET SECTIONS FOR YEAR
  // ============================
  const getSectionsForYear = (year) => {
    const yearStudents = getStudentsForYear(year);

    const sections = [
      ...new Set(
        yearStudents
          .map((student) => student.section)
          .filter((section) => section)
      ),
    ];

    return sections.sort();
  };

  // ============================
  // GET STUDENTS FOR SECTION
  // ============================
  const getStudentsForSection = (year, section) => {
    return students
      .filter(
        (student) =>
          Number(student.year) === Number(year) &&
          student.section === section
      )
      .sort((a, b) =>
        String(a.rollNumber || "").localeCompare(
          String(b.rollNumber || ""),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        )
      );
  };

  // ============================
  // YEAR CLICK
  // ============================
  const handleYearClick = (year) => {
    setSelectedYear(year);
    setSelectedSection(null);
  };

  // ============================
  // SECTION CLICK
  // ============================
  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  // ============================
  // STUDENT CLICK
  // ============================
  const handleStudentClick = (student) => {
    navigate(`/hod/student/${student.id}`);
  };

  const years = [1, 2, 3, 4];

  return (
    <HodLayout>
      <div className="space-y-8">

        {/* ============================
            HEADER
        ============================ */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Students
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
              Loading students...
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

        {!loading && !error && (
          <>
            {/* ============================
                YEAR CARDS
            ============================ */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-5">
                Select Year
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {years.map((year) => {
                  const yearStudents =
                    getStudentsForYear(year);

                  const isSelected =
                    selectedYear === year;

                  return (
                    <button
                      key={year}
                      onClick={() => handleYearClick(year)}
                      className={`h-32 rounded-2xl border-2 transition-all duration-200 shadow-sm
                        ${
                          isSelected
                            ? "border-orange-600 bg-orange-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-orange-400 hover:shadow-md"
                        }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">

                        <span
                          className={`text-2xl font-bold ${
                            isSelected
                              ? "text-orange-600"
                              : "text-gray-800"
                          }`}
                        >
                          {year} Year
                        </span>

                        <span className="mt-2 text-sm text-gray-500">
                          {yearStudents.length}{" "}
                          {yearStudents.length === 1
                            ? "Student"
                            : "Students"}
                        </span>

                      </div>
                    </button>
                  );
                })}

              </div>
            </div>

            {/* ============================
                SECTION CARDS
            ============================ */}
            {selectedYear && (
              <div className="bg-white rounded-2xl shadow-sm p-6">

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {selectedYear} Year
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Select a section
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedYear(null);
                      setSelectedSection(null);
                    }}
                    className="text-sm text-gray-500 hover:text-orange-600"
                  >
                    Change Year
                  </button>
                </div>

                {getSectionsForYear(selectedYear).length ===
                0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No sections available for this year.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {getSectionsForYear(selectedYear).map(
                      (section) => {
                        const sectionStudents =
                          getStudentsForSection(
                            selectedYear,
                            section
                          );

                        const isSelected =
                          selectedSection === section;

                        return (
                          <button
                            key={section}
                            onClick={() =>
                              handleSectionClick(section)
                            }
                            className={`p-6 rounded-xl border-2 transition-all duration-200
                              ${
                                isSelected
                                  ? "border-orange-600 bg-orange-50"
                                  : "border-gray-200 bg-gray-50 hover:border-orange-400 hover:bg-orange-50"
                              }`}
                          >
                            <div className="text-center">

                              <div
                                className={`text-xl font-bold ${
                                  isSelected
                                    ? "text-orange-600"
                                    : "text-gray-800"
                                }`}
                              >
                                Section {section}
                              </div>

                              <div className="text-sm text-gray-500 mt-2">
                                {sectionStudents.length}{" "}
                                {sectionStudents.length === 1
                                  ? "Student"
                                  : "Students"}
                              </div>

                            </div>
                          </button>
                        );
                      }
                    )}

                  </div>
                )}
              </div>
            )}

            {/* ============================
                STUDENT LIST
            ============================ */}
            {selectedYear && selectedSection && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">

                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Section {selectedSection}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Select a student to view their profile
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setSelectedSection(null)
                      }
                      className="text-sm text-gray-500 hover:text-orange-600"
                    >
                      Change Section
                    </button>

                  </div>
                </div>

                <div className="p-6">

                  {getStudentsForSection(
                    selectedYear,
                    selectedSection
                  ).length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      No students found.
                    </div>
                  ) : (
                    <div className="space-y-3">

                      {getStudentsForSection(
                        selectedYear,
                        selectedSection
                      ).map((student) => (
                        <button
                          key={student.id}
                          onClick={() =>
                            handleStudentClick(student)
                          }
                          className="w-full text-left p-4 rounded-xl border border-gray-200 bg-gray-50 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                              {/* PROFILE PHOTO */}
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">

                                {student.profilePhoto ? (
                                  <img
                                    src={student.profilePhoto}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-orange-600 font-bold text-lg">
                                    {student.name
                                      ?.charAt(0)
                                      ?.toUpperCase() || "S"}
                                  </span>
                                )}

                              </div>

                              <div>
                                <p className="font-semibold text-gray-800">
                                  {student.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                  Roll No:{" "}
                                  {student.rollNumber || "-"}
                                </p>

                                <p className="text-sm text-gray-500">
                                  Register No:{" "}
                                  {student.registerNumber || "-"}
                                </p>
                              </div>

                            </div>

                            <div className="flex items-center gap-4">

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  student.placementStatus ===
                                  "Placed"
                                    ? "bg-green-100 text-green-700"
                                    : student.placementStatus ===
                                      "Internship"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {student.placementStatus ||
                                  "Not Placed"}
                              </span>

                              <span className="text-gray-400 text-xl">
                                →
                              </span>

                            </div>

                          </div>
                        </button>
                      ))}

                    </div>
                  )}

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </HodLayout>
  );
}

export default Students;