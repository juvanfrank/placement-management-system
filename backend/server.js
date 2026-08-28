const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const hodRoutes = require("./routes/hodRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const cgpaRoutes = require("./routes/cgpaRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();

connectDB();

const app = express();

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());

app.use(express.json());

// ==================================================
// SERVE LOCAL UPLOADS
// ==================================================

app.use(
  "/uploads",
  express.static("uploads")
);

// ==================================================
// API ROUTES
// ==================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/student",
  studentRoutes
);

app.use(
  "/api/certificates",
  certificateRoutes
);

app.use(
  "/api/cgpa",
  cgpaRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/mentor",
  mentorRoutes
);

app.use(
  "/api/hod",
  hodRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

// ==================================================
// CACHE CONTROL
// ==================================================

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store"
  );

  next();
});

// ==================================================
// ROOT
// ==================================================

app.get("/", (req, res) => {
  res.send(
    "Placement Backend Running 🚀"
  );
});

// ==================================================
// SERVER
// ==================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});