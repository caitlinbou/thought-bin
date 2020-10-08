// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const { json } = require("express");

// read json file and parse it
let dbData = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
dbNotes = JSON.parse(dbData);
console.log(dbNotes)
// Sets up the Express Appvar app = express();
const app= express()
// sets the port for heroku and local host
let PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))
// Routes
// =============================================================
// route that sends the user to the notes page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// route to eturn all saved notes from db.json
app.get("/api/notes", function(req, res) {
    res.send(dbNotes)
});
// route that sends user to homepage, in all cases other than /notes or /api/notes
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
// route to receive a new note to save on the request body, 
// add the note to db.json, and return to client on notes.html
app.post("/api/notes", function(req, res) {
  var note = req.body;
  dbNotes.push(note);
  writeNotes = JSON.stringify(dbNotes)
  fs.writeFileSync(path.join(__dirname, "/db/db.json"), writeNotes)
  res.json(writeNotes)
});
// recieve a query parameter containing th id of a note to delete
// TODO: give each note a unique ID WHEN IT IS SAVED
// TODO: read all notes from the db.json file, and remove the note with the given id (splice by index?)
// TODO: rewrite the notes to the db.json file that remain.
app.delete("api/notes/:id", function(req, res){

})

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});