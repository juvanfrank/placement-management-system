import StudentLayout from "../../components/StudentLayout";

function Resume() {
  return (
    <StudentLayout>
      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Resume Upload 📄
      </h2>

      <div className="bg-white p-6 rounded-xl shadow">

        <input
          type="file"
          className="mb-4 border p-2 rounded w-full"
        />

        <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
          Upload Resume
        </button>

        <div className="mt-6">
          <p className="font-semibold">Current Resume Status:</p>
          <p className="text-green-600 font-medium mt-1">
            Uploaded ✅
          </p>
        </div>

      </div>
    </StudentLayout>
  );
}

export default Resume;