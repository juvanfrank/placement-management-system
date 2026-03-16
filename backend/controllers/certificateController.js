const Certificate = require("../models/Certificate");


// Add Certificate
exports.addCertificate = async (req, res) => {

  try {

    const userId = req.user.id;

    const certificate = await Certificate.create({
      userId,
      ...req.body
    });

    res.status(201).json(certificate);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};


// Get Certificates
exports.getCertificates = async (req, res) => {

  try {

    const userId = req.user.id;

    const certificates = await Certificate.find({ userId });

    res.json(certificates);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};