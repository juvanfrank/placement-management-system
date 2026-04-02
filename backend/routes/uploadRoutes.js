const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/profile-photo", upload.single("photo"), async (req, res) => {

try {

const streamUpload = (req) => {
return new Promise((resolve, reject) => {

const stream = cloudinary.uploader.upload_stream(
{ folder: "profile_photos" },
(error, result) => {
if (result) resolve(result);
else reject(error);
}
);

streamifier.createReadStream(req.file.buffer).pipe(stream);

});
};

const result = await streamUpload(req);

res.json({
url: result.secure_url
});

} catch (error) {

  console.error("CLOUDINARY ERROR:", error);

  res.status(500).json({
    error: "Upload failed",
    message: error.message,
    stack: error.stack
  });

}

});

module.exports = router;