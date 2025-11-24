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

app.set("view engine", "ejs");
app.set("views", "./public/pages/views");

app.get("./pages/students/:id", async (req, res) => {
    const studentID = req.params.id;
    const record = await doc(db, "students", studentID);
    if (record) {
        res.render("studentRecord", { record: record });
    } else {
        res.sendFile(path.join("./", "public", "index.html"));
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});