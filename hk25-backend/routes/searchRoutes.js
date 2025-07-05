const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");

router.get("/search/organizations", async (req, res) => {
    const { name } = req.query;
    try {
        const results = await Organization.find({
            name: new RegExp(name, "i"),
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Search error" });
    }
});

module.exports = router;
