const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const Organization = require("../models/Organization");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/report", async (req, res) => {
    try {
        const {
            severity,
            location,
            details,
            isAnonymous,
            organizationName,
            userEmail,
        } = req.body;

        const organization = await Organization.findOne({
            name: organizationName,
        });

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        let reportedBy = null;
        if (!isAnonymous && userEmail) {
            const user = await User.findOne({ email: userEmail.toLowerCase() });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            reportedBy = user._id;
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
            reportedBy: reportedBy,
        });

        await newReport.save();
        res.status(201).json({ message: "Report submitted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to submit report" });
    }
});

router.get("/user/my-reports", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token)
            return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const reports = await Report.find({ reportedBy: decoded.id }).sort({
            createdAt: -1,
        });

        res.status(200).json(reports);
    } catch (err) {
        console.error("Error fetching user reports:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/reports/organization/:orgId", async (req, res) => {
    const { orgId } = req.params;

    try {
        const reports = await Report.find({ organization: orgId }).sort({
            createdAt: -1,
        });

        res.status(200).json(reports);
    } catch (err) {
        console.error("Error fetching reports for org:", err);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

module.exports = router;
