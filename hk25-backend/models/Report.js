const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["Health", "Safety", "Security", "Environment", "Other"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "In Review", "Resolved", "Dismissed"],
            default: "Pending",
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        location: {
            lat: Number,
            lng: Number,
        },
        attachments: [
            {
                type: String,
            },
        ],
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        feedback: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
