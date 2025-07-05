const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const Organization = require("../models/Organization");
const User = require("../models/User");

router.post("/report", async (req, res) => {
    try {
        const {
            severity,
            location,
            details,
            isAnonymous,
            organizationName,
            userId,
        } = req.body;

        const organization = await Organization.findOne({
            name: organizationName,
        });
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        const newReport = new Report({
            title: `${severity} Report`,
            description: details,
            category: "Safety",
            severity,
            location: location
                ? { lat: location[0], lng: location[1] }
                : undefined,
            isAnonymous,
            organization: organization._id,
            reportedBy: isAnonymous ? null : userId || null,
        });

        await newReport.save();
        res.status(201).json({ message: "Report submitted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to submit report" });
    }
});

module.exports = router;
