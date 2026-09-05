import { useEffect, useState } from "react";
import MentorLayout from "../../components/MentorLayout";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [mentor, setMentor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  // ==================================================
  // FETCH CERTIFICATES
  // ==================================================

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/certificates/mentor",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "MENTOR CERTIFICATES RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load certificates"
        );
      }

      setCertificates(
        data.certificates || []
      );

      setMentor(
        data.mentor || null
      );
    } catch (error) {
      console.error(
        "FETCH MENTOR CERTIFICATES ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to load certificates"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // UPDATE STATUS
  // ==================================================

  const updateStatus = async (
    certificateId,
    newStatus
  ) => {
    try {
      setUpdatingId(certificateId);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/certificates/mentor/${certificateId}/status`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update certificate"
        );
      }

      // Update UI immediately
      setCertificates((previous) =>
        previous.map((certificate) =>
          certificate.id ===
          certificateId
            ? {
                ...certificate,
                status: newStatus,
              }
            : certificate
        )
      );
    } catch (error) {
      console.error(
        "UPDATE CERTIFICATE STATUS ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to update certificate"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <MentorLayout>
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-600">
            Loading certificates...
          </p>
        </div>
      </MentorLayout>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <MentorLayout>
      <div className="space-y-6">

        {/* HEADER */}

        <div>
          <h2 className="text-2xl font-bold text-orange-600">
            Certificate Verification
          </h2>

          {mentor && (
            <p className="text-gray-600 mt-2">
              {mentor.department} | Year{" "}
              {mentor.year} | Section{" "}
              {mentor.section}
            </p>
          )}
        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* NO CERTIFICATES */}

        {!error &&
          certificates.length === 0 && (
            <div className="bg-white shadow rounded-xl p-8 text-center">
              <p className="text-gray-600 text-lg">
                No certificates found.
              </p>

              {mentor && (
                <p className="text-gray-500 mt-2">
                  Certificates submitted by
                  students in{" "}
                  <strong>
                    {mentor.department}
                  </strong>{" "}
                  - Year{" "}
                  <strong>
                    {mentor.year}
                  </strong>{" "}
                  - Section{" "}
                  <strong>
                    {mentor.section}
                  </strong>{" "}
                  will appear here.
                </p>
              )}
            </div>
          )}

        {/* CERTIFICATES */}

        {certificates.length > 0 && (
          <div className="space-y-5">

            {certificates.map(
              (certificate) => {

                const student =
                  certificate.student;

                const isUpdating =
                  updatingId ===
                  certificate.id;

                return (
                  <div
                    key={certificate.id}
                    className="bg-white p-6 rounded-xl shadow"
                  >

                    {/* STUDENT */}

                    <div className="flex justify-between items-start gap-4">

                      <div>
                        <h3 className="font-bold text-lg">
                          {student?.name ||
                            "Unknown Student"}
                        </h3>

                        <p className="text-gray-600 mt-1">
                          Roll No:{" "}
                          {student?.rollNumber ||
                            "-"}
                        </p>

                        <p className="text-gray-600">
                          Register No:{" "}
                          {student?.registerNumber ||
                            "-"}
                        </p>

                        <p className="text-gray-600">
                          {student?.department ||
                            "-"}{" "}
                          | Year{" "}
                          {student?.year ||
                            "-"}{" "}
                          | Section{" "}
                          {student?.section ||
                            "-"}
                        </p>
                      </div>

                      {/* STATUS */}

                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            certificate.status ===
                            "Approved"
                              ? "bg-green-100 text-green-700"
                              : certificate.status ===
                                "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {certificate.status ||
                            "Pending"}
                        </span>
                      </div>

                    </div>

                    {/* CERTIFICATE */}

                    <div className="mt-5 border-t pt-4">

                      <p className="font-semibold text-gray-800">
                        Certificate
                      </p>

                      <p className="text-gray-700 mt-1">
                        {certificate.name}
                      </p>

                      <a
                        href={
                          certificate.link
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-blue-600 underline"
                      >
                        View Certificate
                      </a>

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-5 flex gap-3">

                      <button
                        type="button"
                        disabled={
                          isUpdating ||
                          certificate.status ===
                            "Approved"
                        }
                        onClick={() =>
                          updateStatus(
                            certificate.id,
                            "Approved"
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
                      >
                        {isUpdating
                          ? "Updating..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          isUpdating ||
                          certificate.status ===
                            "Rejected"
                        }
                        onClick={() =>
                          updateStatus(
                            certificate.id,
                            "Rejected"
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded"
                      >
                        {isUpdating
                          ? "Updating..."
                          : "Reject"}
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </MentorLayout>
  );
}

export default Certificates;