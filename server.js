// server.js
import express from "express";
import path from "path";
import fs from "node:fs/promises";
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
    sendFileAsync("public/pages/views/studentRecord.html", res);
});

app.get("/pages/events/:id", (req, res) => {
    sendFileAsync("public/pages/views/eventPage.html", res);
});
app.get("/pages/events/:id/register", (req, res) => {
    sendFileAsync("public/pages/views/eventRegister.html", res);
});

app.get("/pages/query/create", (req, res) => {
    sendFileAsync("public/pages/subpages/queryCreate.html", res);
});

app.get("/pages/query/run", (req, res) => {
    sendFileAsync("public/pages/subpages/queryRun.html", res);
});

app.get("/pages/query/run/:id", (req, res) => {
    sendFileAsync("public/pages/views/queryDoc.html", res);
});

app.get("/pages/accounts/:id", (req, res) => {
    sendFileAsync("public/pages/views/accountDoc.html", res);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

async function sendFileAsync(filePath, res) {
    try {
        const data = await fs.readFile(filePath);
        res.sendFile(filePath, { root: __dirname });
    } catch (error) {
        res.sendFile("public/pages/404.html", { root: __dirname });
    }
}