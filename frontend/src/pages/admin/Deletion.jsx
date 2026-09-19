import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import api from "../../services/api";

function Deletion() {
  // ==================================================
  // DEPARTMENTS
  // Same departments used in Admin Search
  // ==================================================

  const departments = [
    "AIDS",
    "CSE",
    "ECE",
    "EEE",
    "MECH",
    "CIVIL",
    "IT",
  ];

  // ==================================================
  // YEARS
  // Same values used in Admin Search
  // ==================================================

  const years = [
    {
      value: "1",
      label: "1st Year",
    },
    {
      value: "2",
      label: "2nd Year",
    },
    {
      value: "3",
      label: "3rd Year",
    },
    {
      value: "4",
      label: "4th Year",
    },
  ];

  // ==================================================
  // FILTERS
  // ==================================================

  const [filters, setFilters] = useState({
    department: "",
    year: "",
    section: "",
  });

  // ==================================================
  // SECTIONS
  // ==================================================

  const [sections, setSections] = useState([]);

  // ==================================================
  // STUDENTS
  // ==================================================

  const [students, setStudents] = useState([]);

  // ==================================================
  // SELECTED STUDENTS
  // ==================================================

  const [selectedStudents, setSelectedStudents] = useState([]);

  // ==================================================
  // STATES
  // ==================================================

  const [loadingSections, setLoadingSections] = useState(false);

  const [loading, setLoading] = useState(false);

  const [exporting, setExporting] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [searched, setSearched] = useState(false);

  // ==================================================
  // DEPARTMENT CHANGE
  // ==================================================

  const handleDepartmentChange = (e) => {
    const department = e.target.value;

    setFilters({
      department,
      year: "",
      section: "",
    });

    setSections([]);
    setStudents([]);
    setSelectedStudents([]);
    setSearched(false);
    setError("");
    setSuccess("");
  };

  // ==================================================
  // YEAR CHANGE
  // ==================================================

  const handleYearChange = async (e) => {
    const year = e.target.value;

    setFilters((prev) => ({
      ...prev,
      year,
      section: "",
    }));

    setSections([]);
    setStudents([]);
    setSelectedStudents([]);
    setSearched(false);
    setError("");
    setSuccess("");

    // Nothing selected
    if (!filters.department || !year) {
      return;
    }

    try {
      setLoadingSections(true);

      /*
       * We use the SAME endpoint used by the
       * working Admin Search page.
       *
       * Example:
       *
       * department = AIDS
       * year = 4
       */

      const response = await api.get("/admin/search-students", {
        params: {
          department: filters.department,
          year: year,
        },
      });

      const studentList = response.data.students || [];

      // ==================================================
      // GET UNIQUE SECTIONS
      // ==================================================

      const uniqueSections = [
        ...new Set(
          studentList
            .map((student) => student.section)
            .filter(
              (section) =>
                section !== null &&
                section !== undefined &&
                String(section).trim() !== ""
            )
            .map((section) => String(section).trim())
        ),
      ];

      // ==================================================
      // SORT SECTIONS
      // ==================================================

      uniqueSections.sort((a, b) =>
        a.localeCompare(b, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );

      setSections(uniqueSections);
    } catch (err) {
      console.error(
        "FETCH DELETION SECTIONS ERROR:",
        err.response || err
      );

      setSections([]);

      setError(
        err.response?.data?.message ||
          "Unable to load sections"
      );
    } finally {
      setLoadingSections(false);
    }
  };

  // ==================================================
  // SECTION CHANGE
  // ==================================================

  const handleSectionChange = (e) => {
    const section = e.target.value;

    setFilters((prev) => ({
      ...prev,
      section,
    }));

    setStudents([]);
    setSelectedStudents([]);
    setSearched(false);
    setError("");
    setSuccess("");
  };

  // ==================================================
  // SEARCH STUDENTS
  // ==================================================

  const handleSearch = async () => {
    // Department validation
    if (!filters.department) {
      setError("Please select a department.");
      return;
    }

    // Year validation
    if (!filters.year) {
      setError("Please select a year.");
      return;
    }

    // Section validation
    if (!filters.section) {
      setError("Please select a section.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setSearched(true);
      setStudents([]);
      setSelectedStudents([]);

      console.log(
        "DELETION SEARCH FILTERS:",
        filters
      );

      // ==================================================
      // SEARCH PARAMETERS
      // ==================================================

      const params = {
        department: filters.department,
        year: filters.year,
        section: filters.section,
      };

      console.log(
        "DELETION SEARCH PARAMS:",
        params
      );

      // ==================================================
      // DELETION SEARCH API
      // ==================================================

      const response = await api.get(
        "/admin/deletion/students",
        {
          params,
        }
      );

      console.log(
        "DELETION SEARCH RESULTS:",
        response.data
      );

      const result = response.data.students || [];

      // ==================================================
      // SORT BY ROLL NUMBER
      // ==================================================

      result.sort((a, b) =>
        String(a.rollNumber || "").localeCompare(
          String(b.rollNumber || ""),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          }
        )
      );

      setStudents(result);
    } catch (err) {
      console.error(
        "SEARCH DELETION STUDENTS ERROR:",
        err.response || err
      );

      setStudents([]);
      setSelectedStudents([]);

      setError(
        err.response?.data?.message ||
          "Unable to search students"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const handleClear = () => {
    setFilters({
      department: "",
      year: "",
      section: "",
    });

    setSections([]);
    setStudents([]);
    setSelectedStudents([]);
    setError("");
    setSuccess("");
    setSearched(false);
  };

  // ==================================================
  // GET YEAR LABEL
  // ==================================================

  const getYearLabel = (year) => {
    const foundYear = years.find(
      (item) => item.value === String(year)
    );

    return foundYear ? foundYear.label : year;
  };

  // ==================================================
  // GET SECTION DISPLAY
  // ==================================================

  const getSectionLabel = (section) => {
    if (String(section).toUpperCase() === "ALL") {
      return "All Sections";
    }

    return section;
  };

  // ==================================================
  // GET STUDENT ID
  // ==================================================

  const getStudentId = (student) => {
    return String(student.id || student._id || "");
  };

  // ==================================================
  // CHECK IF STUDENT IS SELECTED
  // ==================================================

  const isStudentSelected = (student) => {
    const studentId = getStudentId(student);

    return selectedStudents.includes(studentId);
  };

  // ==================================================
  // TOGGLE SINGLE STUDENT
  // ==================================================

  const handleStudentSelect = (student) => {
    const studentId = getStudentId(student);

    if (!studentId) {
      return;
    }

    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      }

      return [...prev, studentId];
    });

    setError("");
    setSuccess("");
  };

  // ==================================================
  // SELECT / UNSELECT ALL
  // ==================================================

  const handleSelectAll = () => {
    if (students.length === 0) {
      return;
    }

    const allStudentIds = students
      .map((student) => getStudentId(student))
      .filter(Boolean);

    const allSelected =
      allStudentIds.length > 0 &&
      allStudentIds.every((id) =>
        selectedStudents.includes(id)
      );

    if (allSelected) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(allStudentIds);
    }

    setError("");
    setSuccess("");
  };

  // ==================================================
  // CHECK SELECT ALL STATUS
  // ==================================================

  const allStudentsSelected =
    students.length > 0 &&
    students.every((student) =>
      selectedStudents.includes(getStudentId(student))
    );

  // ==================================================
  // DOWNLOAD BACKUP EXCEL
  // ==================================================

  const handleDownloadExcel = async () => {
    if (selectedStudents.length === 0) {
      setError(
        "Please select at least one student before downloading the Excel backup."
      );
      return;
    }

    try {
      setExporting(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/admin/deletion/students/export-excel",
        {
          studentIds: selectedStudents,
        },
        {
          responseType: "blob",
        }
      );

      // ==================================================
      // CREATE DOWNLOAD URL
      // ==================================================

      const blob = new Blob(
        [response.data],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      const date = new Date()
        .toISOString()
        .slice(0, 10);

      link.download = `student-deletion-backup-${date}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setSuccess(
        "Backup Excel downloaded successfully. You can now proceed with deletion."
      );
    } catch (err) {
      console.error(
        "DOWNLOAD DELETION EXCEL ERROR:",
        err.response || err
      );

      setError(
        "Unable to download backup Excel."
      );
    } finally {
      setExporting(false);
    }
  };

  // ==================================================
  // DELETE SELECTED STUDENTS
  // ==================================================

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) {
      setError(
        "Please select at least one student to delete."
      );
      return;
    }

    // ==================================================
    // FIRST CONFIRMATION
    // ==================================================

    const firstConfirmation = window.confirm(
      `You are about to delete ${selectedStudents.length} student(s).\n\nTheir User account, Student Profile and Certificate records will be permanently deleted.\n\nMake sure you have downloaded the backup Excel before continuing.\n\nDo you want to continue?`
    );

    if (!firstConfirmation) {
      return;
    }

    // ==================================================
    // SECOND CONFIRMATION
    // ==================================================

    const secondConfirmation = window.confirm(
      "FINAL CONFIRMATION\n\nThis action cannot be undone.\n\nAre you absolutely sure you want to delete the selected students?"
    );

    if (!secondConfirmation) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await api.delete(
        "/admin/deletion/students",
        {
          data: {
            studentIds: selectedStudents,
          },
        }
      );

      console.log(
        "DELETE STUDENTS RESPONSE:",
        response.data
      );

      setSuccess(
        response.data?.message ||
          "Students deleted successfully."
      );

      // ==================================================
      // REMOVE DELETED STUDENTS FROM UI
      // ==================================================

      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) =>
            !selectedStudents.includes(
              getStudentId(student)
            )
        )
      );

      setSelectedStudents([]);
    } catch (err) {
      console.error(
        "DELETE STUDENTS ERROR:",
        err.response || err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete selected students."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <AdminLayout>
      <div className="p-6">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <h2 className="text-2xl font-bold text-orange-600">
            Student Deletion Panel
          </h2>

          <p className="text-gray-500 mt-1">
            Select department, year and section to
            find students for archival and deletion.
          </p>

          {/* ==================================================
              FILTER GRID
          ================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

            {/* ==================================================
                DEPARTMENT
            ================================================== */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>

              <select
                value={filters.department}
                onChange={handleDepartmentChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">
                  Select Department
                </option>

                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                ))}
              </select>
            </div>

            {/* ==================================================
                YEAR
            ================================================== */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year
              </label>

              <select
                value={filters.year}
                onChange={handleYearChange}
                disabled={!filters.department}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  Select Year
                </option>

                {years.map((year) => (
                  <option
                    key={year.value}
                    value={year.value}
                  >
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ==================================================
                SECTION
            ================================================== */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Section
              </label>

              <select
                value={filters.section}
                onChange={handleSectionChange}
                disabled={
                  !filters.department ||
                  !filters.year ||
                  loadingSections
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingSections
                    ? "Loading sections..."
                    : "Select Section"}
                </option>

                {/* ==================================================
                    ALL SECTIONS
                ================================================== */}

                {sections.length > 0 && (
                  <option value="ALL">
                    All Sections
                  </option>
                )}

                {/* ==================================================
                    INDIVIDUAL SECTIONS
                ================================================== */}

                {sections.map((section) => (
                  <option
                    key={section}
                    value={section}
                  >
                    Section {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* ==================================================
              SUCCESS
          ================================================== */}

          {success && (
            <div className="mt-5 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="flex justify-end gap-4 mt-8">

            <button
              onClick={handleClear}
              disabled={loading || deleting || exporting}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition font-medium disabled:opacity-50"
            >
              Clear
            </button>

            <button
              onClick={handleSearch}
              disabled={
                loading ||
                deleting ||
                exporting ||
                !filters.department ||
                !filters.year ||
                !filters.section
              }
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Searching..."
                : "🔍 Search Students"}
            </button>
          </div>
        </div>

        {/* ==================================================
            SEARCH RESULTS
        ================================================== */}

        {searched && (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            {/* ==================================================
                RESULTS HEADER
            ================================================== */}

            <div className="p-6 border-b flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

              <div>
                <h3 className="text-xl font-bold text-orange-600">
                  Students Selected for Deletion
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {filters.department}
                  {" • "}
                  {getYearLabel(filters.year)}
                  {" • "}
                  {getSectionLabel(filters.section)}
                </p>
              </div>

              {/* ==================================================
                  STUDENT COUNT
              ================================================== */}

              <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-semibold">
                {students.length} Found
              </div>
            </div>

            {/* ==================================================
                ACTION BAR
            ================================================== */}

            {students.length > 0 && (
              <div className="p-5 bg-gray-50 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* ==================================================
                    SELECT ALL
                ================================================== */}

                <div className="flex items-center gap-3">

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={allStudentsSelected}
                      onChange={handleSelectAll}
                      disabled={
                        deleting || exporting
                      }
                      className="w-5 h-5 accent-orange-500"
                    />

                    Select All
                  </label>

                  <span className="text-sm text-gray-500">
                    {selectedStudents.length} selected
                  </span>
                </div>

                {/* ==================================================
                    ACTION BUTTONS
                ================================================== */}

                <div className="flex flex-col sm:flex-row gap-3">

                  {/* ==================================================
                      DOWNLOAD EXCEL
                  ================================================== */}

                  <button
                    onClick={handleDownloadExcel}
                    disabled={
                      selectedStudents.length === 0 ||
                      exporting ||
                      deleting
                    }
                    className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exporting
                      ? "Downloading..."
                      : "📥 Download Backup Excel"}
                  </button>

                  {/* ==================================================
                      DELETE
                  ================================================== */}

                  <button
                    onClick={handleDeleteSelected}
                    disabled={
                      selectedStudents.length === 0 ||
                      deleting ||
                      exporting
                    }
                    className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting
                      ? "Deleting..."
                      : `🗑️ Delete Selected${
                          selectedStudents.length > 0
                            ? ` (${selectedStudents.length})`
                            : ""
                        }`}
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================
                NO RESULTS
            ================================================== */}

            {students.length === 0 && !loading ? (
              <div className="p-10 text-center">

                <div className="text-5xl mb-4">
                  🔍
                </div>

                <h4 className="text-lg font-semibold text-gray-700">
                  No students found
                </h4>

                <p className="text-gray-500 mt-2">
                  Try changing the department,
                  year or section.
                </p>
              </div>
            ) : (

              /* ==================================================
                 TABLE
              ================================================== */

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-orange-500 text-white">

                    <tr>

                      {/* SELECT */}

                      <th className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={allStudentsSelected}
                          onChange={handleSelectAll}
                          disabled={
                            deleting || exporting
                          }
                          className="w-5 h-5 accent-white cursor-pointer"
                        />
                      </th>

                      <th className="p-4 text-center">
                        S.No
                      </th>

                      <th className="p-4 text-left">
                        Student Name
                      </th>

                      <th className="p-4 text-center">
                        Register Number
                      </th>

                      <th className="p-4 text-center">
                        Department
                      </th>

                      <th className="p-4 text-center">
                        Year
                      </th>

                      <th className="p-4 text-center">
                        Section
                      </th>

                      <th className="p-4 text-center">
                        Roll Number
                      </th>

                      <th className="p-4 text-center">
                        CGPA
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.map((student, index) => {

                      const studentId =
                        getStudentId(student);

                      const selected =
                        selectedStudents.includes(
                          studentId
                        );

                      return (
                        <tr
                          key={
                            studentId || index
                          }
                          className={`border-b hover:bg-orange-50 ${
                            selected
                              ? "bg-orange-50"
                              : ""
                          }`}
                        >

                          {/* SELECT */}

                          <td className="p-4 text-center">

                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                handleStudentSelect(
                                  student
                                )
                              }
                              disabled={
                                deleting ||
                                exporting
                              }
                              className="w-5 h-5 accent-orange-500 cursor-pointer"
                            />

                          </td>

                          {/* S.NO */}

                          <td className="p-4 text-center text-gray-700">
                            {index + 1}
                          </td>

                          {/* NAME */}

                          <td className="p-4 font-medium text-gray-800">
                            {student.name || "-"}
                          </td>

                          {/* REGISTER NUMBER */}

                          <td className="p-4 text-center text-gray-700">
                            {student.registerNumber ||
                              "-"}
                          </td>

                          {/* DEPARTMENT */}

                          <td className="p-4 text-center text-gray-700">
                            {student.department || "-"}
                          </td>

                          {/* YEAR */}

                          <td className="p-4 text-center text-gray-700">
                            {student.year || "-"}
                          </td>

                          {/* SECTION */}

                          <td className="p-4 text-center text-gray-700">
                            {student.section || "-"}
                          </td>

                          {/* ROLL NUMBER */}

                          <td className="p-4 text-center text-gray-700">
                            {student.rollNumber || "-"}
                          </td>

                          {/* CGPA */}

                          <td className="p-4 text-center font-semibold text-gray-700">
                            {student.cgpa || "-"}
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default Deletion;