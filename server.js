// server.js
import express from "express";
import path from "path";
const app = express();
const port = process.env.PORT || 3000;

// serve static files from github pages project
app.use(express.static(path.join("./", "public")));

// define a basic route for the root
app.get("/", (req, res) => {
    res.sendFile(path.join("./", "public", "index.html"));
});

app.get("/students/:id", async (req, res) => {
    const studentID = req.params.id;
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});