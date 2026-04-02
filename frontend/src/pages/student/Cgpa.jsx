import { useState, useEffect } from "react";
import axios from "axios";
import StudentLayout from "../../components/StudentLayout";

function Cgpa() {

  const [gpa, setGpa] = useState({
    sem1: "",
    sem2: "",
    sem3: "",
    sem4: "",
    sem5: "",
    sem6: "",
    sem7: "",
    sem8: ""
  });

  // Load CGPA from backend
  useEffect(() => {

    const fetchCgpa = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/cgpa",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.data) {
          setGpa(res.data);
        }

      } catch (error) {
        console.error(error);
      }

    };

    fetchCgpa();

  }, []);

  const handleChange = (e) => {

    setGpa({
      ...gpa,
      [e.target.name]: e.target.value
    });

  };

  const calculateCGPA = () => {

    const values = Object.values(gpa)
      .map(Number)
      .filter((val) => val > 0);

    if (values.length === 0) return "0.00";

    const total = values.reduce((sum, val) => sum + val, 0);

    return (total / values.length).toFixed(2);

  };

  const cgpa = calculateCGPA();

  // Save CGPA to backend
  const handleSave = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/cgpa",
        {
          ...gpa,
          cgpa
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("CGPA saved successfully");

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <StudentLayout>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        CGPA Details
      </h2>

      <div className="bg-white p-8 rounded-xl shadow">

        <h3 className="text-lg font-semibold mb-6 text-gray-700">
          Enter Semester GPA
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {["sem1","sem2","sem3","sem4","sem5","sem6","sem7","sem8"].map((sem, index) => (

            <div key={sem}>

              <label className="block text-gray-600 mb-1">
                Semester {index + 1}
              </label>

              <input
                type="number"
                step="0.01"
                max="10"
                min="0"
                name={sem}
                value={gpa[sem] || ""}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="GPA"
              />

            </div>

          ))}

        </div>

        {/* CGPA Result */}

        <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-lg">

          <h3 className="text-lg font-semibold text-gray-700">
            Overall CGPA
          </h3>

          <p className="text-3xl font-bold text-orange-600 mt-2">
            {cgpa}
          </p>

        </div>

        {/* Save Button */}

        <button
          onClick={handleSave}
          className="mt-6 bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Save CGPA
        </button>

      </div>

    </StudentLayout>

  );

}

export default Cgpa;