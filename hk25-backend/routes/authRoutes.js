const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user =
            (await User.findOne({ email })) ||
            (await Organization.findOne({ email }));
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/signup/user", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "user",
        });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ message: "Signup error" });
    }
});

router.post("/signup/organization", async (req, res) => {
    const { orgName, orgType, orgLoc, orgDesc, email, password } = req.body;
    try {
        const existing = await Organization.findOne({ email });
        if (existing)
            return res.status(409).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newOrg = new Organization({
            name: orgName,
            type: orgType,
            location: orgLoc,
            description: orgDesc,
            email,
            password: hashedPassword,
            role: "organization",
        });
        await newOrg.save();
        res.status(201).json({ message: "Organization created" });
    } catch (err) {
        res.status(500).json({ message: "Signup error" });
    }
});

module.exports = router;
