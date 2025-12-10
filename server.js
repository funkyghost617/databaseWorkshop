// server.js
import express from "express";
import path from "path";
const app = express();
const port = process.env.PORT || 3000;
const __dirname = "./";

// serve static files from github pages project
app.use(express.static(path.join(__dirname, "public")));

// define a basic route for the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/pages/students/:id", (req, res) => {
    res.sendFile("public/pages/views/studentRecord.html", { root: __dirname });
});

app.get("/pages/events/:id", (req, res) => {
    res.sendFile("public/pages/views/eventPage.html", { root: __dirname });
});
app.get("/pages/events/:id/register", (req, res) => {
    res.sendFile("public/pages/views/eventRegister.html", { root: __dirname });
});

app.get("/pages/query/create", (req, res) => {
    res.sendFile("public/pages/subpages/queryCreate.html", { root: __dirname });
});

app.get("/pages/query/run", (req, res) => {
    res.sendFile("public/pages/subpages/queryRun.html", { root: __dirname });
});

app.get("/pages/query/run/:id", (req, res) => {
    res.sendFile("public/pages/views/queryDoc.html", { root: __dirname });
});

/*app.set("view engine", "ejs");
app.set("views", "./public/pages/views");

app.get("./pages/students/:id", async (req, res) => {
    const studentID = req.params.id;
    const record = await doc(db, "students", studentID);
    if (record) {
        res.render("studentRecord", { record: record });
    } else {
        res.sendFile(path.join("./", "public", "index.html"));
    }
})*/

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});