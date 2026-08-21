const express = require("express");
const cors = require("cors");
const path = require("path");

const documentRoutes = require("./routes/documentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "DocuMind API is running",
    });
});

app.use("/api/documents", documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`DocuMind server running on port ${PORT}`);
});