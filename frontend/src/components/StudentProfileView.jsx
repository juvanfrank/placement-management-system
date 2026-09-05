import { useEffect, useState } from "react";
import api from "../services/api";

function StudentProfileView({
  profileEndpoint,
  readOnly = true,
}) {
  const [student, setStudent] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(profileEndpoint);

        console.log("=================================");
        console.log("HOD STUDENT RESPONSE:", response.data);
        console.log("=================================");

        const data = response.data;

        setStudent(data.student || null);
        setMentor(data.mentor || null);
        setCertificates(data.certificates || []);

        console.log("STUDENT:", data.student);
        console.log("MENTOR:", data.mentor);
        console.log("CERTIFICATES:", data.certificates);
      } catch (err) {
        console.error("Error loading student profile:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load student profile."
        );
      } finally {
        setLoading(false);
      }
    };

    if (profileEndpoint) {
      fetchStudentProfile();
    }
  }, [profileEndpoint]);

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not provided";
    }

    return value;
  };

  const displayArray = (value) => {
    if (!Array.isArray(value) || value.length === 0) {
      return "Not provided";
    }

    return value.join(", ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 text-lg">
          Loading student profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Unable to load student profile
        </h2>

        <p className="text-red-600 mt-2">
          {error}
        </p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <p className="text-yellow-700">
          Student profile not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* READ ONLY MESSAGE */}
      {readOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-700 text-sm">
            This student profile is available in
            <strong> read-only mode</strong>.
          </p>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

          {/* PROFILE PHOTO */}
          <div className="flex-shrink-0">

            {student.profilePhoto ? (
              <img
                src={student.profilePhoto}
                alt={student.name || "Student"}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                <span className="text-gray-400 text-4xl">
                  {student.name
                    ? student.name.charAt(0).toUpperCase()
                    : "S"}
                </span>
              </div>
            )}

          </div>

          {/* BASIC INFO */}
          <div className="flex-1 text-center md:text-left">

            <h1 className="text-3xl font-bold text-gray-800">
              {displayValue(student.name)}
            </h1>

            <p className="text-gray-500 mt-1">
              Register Number:{" "}
              <span className="font-medium text-gray-700">
                {displayValue(student.registerNumber)}
              </span>
            </p>

            <p className="text-gray-500 mt-1">
              Roll Number:{" "}
              <span className="font-medium text-gray-700">
                {displayValue(student.rollNumber)}
              </span>
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">

              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                {displayValue(student.department)}
              </span>

              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                Year {displayValue(student.year)}
              </span>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                Section {displayValue(student.section)}
              </span>

            </div>

          </div>

        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <ProfileSection title="Personal Information">

        <InfoItem
          label="Full Name"
          value={student.name}
        />

        <InfoItem
          label="Date of Birth"
          value={student.dob}
        />

        <InfoItem
          label="Gender"
          value={student.gender}
        />

        <InfoItem
          label="Religion"
          value={student.religion}
        />

        <InfoItem
          label="Caste"
          value={student.caste}
        />

        <InfoItem
          label="Community"
          value={student.community}
        />

      </ProfileSection>

      {/* ACADEMIC INFORMATION */}
      <ProfileSection title="Academic Information">

        <InfoItem
          label="Register Number"
          value={student.registerNumber}
        />

        <InfoItem
          label="Roll Number"
          value={student.rollNumber}
        />

        <InfoItem
          label="Department"
          value={student.department}
        />

        <InfoItem
          label="Year"
          value={student.year}
        />

        <InfoItem
          label="Section"
          value={student.section}
        />

        <InfoItem
          label="Batch"
          value={student.batch}
        />

        <InfoItem
          label="10th Percentage"
          value={student.tenthPercentage}
        />

        <InfoItem
          label="12th Percentage"
          value={student.twelthPercentage}
        />

        <InfoItem
          label="Diploma Percentage"
          value={student.diplomaPercentage}
        />

        <InfoItem
          label="Current Arrears"
          value={student.currentArrears}
        />

        <InfoItem
          label="History of Arrears"
          value={student.historyOfArrears}
        />

        <InfoItem
          label="Current CGPA"
          value={student.cgpa}
        />

      </ProfileSection>

      {/* CONTACT INFORMATION */}
      <ProfileSection title="Contact Information">

        <InfoItem
          label="Email"
          value={student.email}
        />

        <InfoItem
          label="Phone Number"
          value={student.studentPhone}
        />

        <InfoItem
          label="Address"
          value={student.address}
          fullWidth
        />

      </ProfileSection>

      {/* PARENT INFORMATION */}
      <ProfileSection title="Parent / Guardian Information">

        <InfoItem
          label="Father's Name"
          value={student.fatherName}
        />

        <InfoItem
          label="Father's Phone"
          value={student.fatherPhone}
        />

        <InfoItem
          label="Mother's Name"
          value={student.motherName}
        />

        <InfoItem
          label="Mother's Phone"
          value={student.motherPhone}
        />

      </ProfileSection>

      {/* PROFESSIONAL INFORMATION */}
      <ProfileSection title="Professional Information">

        <InfoItem
          label="Skills"
          value={displayArray(student.skills)}
          fullWidth
        />

        <InfoItem
          label="Internship"
          value={displayArray(student.internship)}
          fullWidth
        />

        <InfoItem
          label="Placement Status"
          value={student.placementStatus}
        />

      </ProfileSection>

      {/* SOCIAL / DOCUMENTS */}
      <ProfileSection title="Resume & Social Links">

        <LinkItem
          label="Resume"
          value={student.resumeLink}
        />

        <LinkItem
          label="LinkedIn"
          value={student.linkedinLink}
        />

        <LinkItem
          label="GitHub"
          value={student.githubLink}
        />

        <LinkItem
          label="Portfolio"
          value={student.portfolioLink}
        />

      </ProfileSection>

      {/* CONCERNED MENTOR */}
      <ProfileSection title="Concerned Mentor">

        {mentor ? (
          <>
            <InfoItem
              label="Mentor Name"
              value={mentor.name}
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
              label="Email"
              value={mentor.email}
            />

            <InfoItem
              label="Phone"
              value={mentor.phone}
            />
          </>
        ) : (
          <div className="col-span-full">
            <p className="text-gray-500">
              No concerned mentor assigned.
            </p>
          </div>
        )}

      </ProfileSection>

      {/* CERTIFICATES */}
      <ProfileSection title="Approved Certificates">

        {certificates.length === 0 ? (
          <div className="col-span-full">
            <p className="text-gray-500">
              No approved certificates available.
            </p>
          </div>
        ) : (
          <div className="col-span-full space-y-3">

            {certificates.map((certificate) => (
              <div
                key={certificate._id || certificate.id}
                className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {displayValue(certificate.name)}
                  </h3>

                  <p className="text-sm text-green-600 mt-1">
                    Approved
                  </p>
                </div>

                {certificate.link && (
                  <a
                    href={certificate.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                  >
                    View Certificate
                  </a>
                )}

              </div>
            ))}

          </div>
        )}

      </ProfileSection>

      {/* HOD READ ONLY FOOTER */}
      {readOnly && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500 text-center">
            HOD can view this student profile but cannot
            edit or delete student information.
          </p>
        </div>
      )}

    </div>
  );
}

/* -------------------------------- */
/* PROFILE SECTION */
/* -------------------------------- */

function ProfileSection({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>

    </div>
  );
}

/* -------------------------------- */
/* INFO ITEM */
/* -------------------------------- */

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

/* -------------------------------- */
/* LINK ITEM */
/* -------------------------------- */

function LinkItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-600 hover:text-orange-700 font-medium break-all"
        >
          Open {label}
        </a>
      ) : (
        <p className="text-gray-800 font-medium">
          Not provided
        </p>
      )}
    </div>
  );
}

export default StudentProfileView;