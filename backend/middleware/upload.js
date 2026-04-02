const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
cloudinary: cloudinary,
params: {
folder: "placement-portal",
allowed_formats: ["jpg","png","jpeg","pdf"]
}
});

const upload = multer({ storage });

module.exports = upload;