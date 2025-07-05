const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: ["http://localhost:5173", "http://192.168.1.24:5173"],
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));

mongoose
    .connect(MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

const authRoutes = require("./routes/authRoutes");
const searchRoutes = require("./routes/searchRoutes");

app.use("/", authRoutes);
app.use("/", searchRoutes);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`SafeguardGY server listening on port ${PORT}`);
});
