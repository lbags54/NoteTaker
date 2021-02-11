const express = require("express");
const fs = require("fs");
const path = require('path');

const app = express()
const port = process.env.port || 3000;

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up get route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// set up notes route
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// set up api route
app.get("/api/notes/", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    var json = JSON.parse(data);
    return res.json(json);
  })
});
//redirects * to index.html
app.get("*", function(req, res) {
  res.sendFile((__dirname + "/public/index.html"));
});

// post routes
app.post("/api/notes/", function (req, res) {
  newNote = req.body;
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    var json = JSON.parse(data);
    json.push(newNote);
    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(json));
  });
});

// delete routes
app.delete("/api/notes/:id", function (req, res) {
  let response = req.params;
  let id = response.id;
  console.log(`Note id: ${id} marked for deletion`);

  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    var json = JSON.parse(data);

    const filteredJson = json.filter((element) => element.id !== id);
    fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(filteredJson));

  });

});

// starts up express server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Started server`)
}); 