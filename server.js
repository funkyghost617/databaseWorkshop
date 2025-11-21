// server.js
import express from "express";
import path from "path";
const app = express();
const port = process.env.PORT || 3000;
const __dirname = ".";

// serve static files from github pages project
app.use(express.static(path.join(__dirname, "public")));

// define a basic route for the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});