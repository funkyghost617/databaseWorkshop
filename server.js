// server.js
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// serve static files from github pages project
app.use(express.static(path.join(__dirname, "public")));

// define a basic route for the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});