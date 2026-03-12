import { useState, useEffect } from "react";
import axios from "axios";
import StudentLayout from "../../components/StudentLayout";

function Profile() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const res = await axios.get(
          "http://localhost:5000/api/student/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("PROFILE DATA:", res.data);

        setProfile(res.data);

      } catch (error) {

        console.error("Profile fetch error:", error);

      }

    };

    fetchProfile();

  }, []);

  if (!profile) {
    return (
      <div style={{textAlign:"center", marginTop:"100px"}}>
        Loading profile...
      </div>
    );
  }

  return (

    <StudentLayout>

      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Student Profile
      </h2>

      <div className="bg-white p-8 rounded-xl shadow space-y-4">

        <p><b>Name:</b> {profile.name}</p>

        <p><b>Register Number:</b> {profile.registerNumber}</p>

        <p><b>Email:</b> {profile.email}</p>

        <p><b>Department:</b> {profile.department}</p>

      </div>

    </StudentLayout>

  );

}

export default Profile;