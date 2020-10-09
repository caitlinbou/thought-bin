// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
// read json file and parse it
let dbData = fs.readFileSync(path.join(__dirname, "/db/db.json"), "utf8");
let dbNotes = JSON.parse(dbData);
// Sets up the Express app = express();
const app = express()
// sets the port for heroku and local host
let PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// Routes
// =============================================================
// route that sends the user to the notes page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// route to return all saved notes from db.json
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
  let note = req.body;
  dbNotes.push(note);

  dbNotes.map(function(note){
    note.id = uuidv4();
  })

  let writeNotes = JSON.stringify(dbNotes)
  fs.writeFileSync(path.join(__dirname, "/db/db.json"), writeNotes)
  res.json(writeNotes)
});
// route to delete selected note from user view and db.json
app.delete("/api/notes/:id", function(req, res){
    let id = req.params.id;
    let deletedNote;
// loop through notes db to find the note with id matching the note selected for deletion
    for (let i = 0; i < dbNotes.length; i++){
        if (dbNotes[i].id === id) {
            deletedNote = dbNotes[i]
            dbNotes.splice(i, 1);
        } 
    }
// re-write the array to db.json to remove the deleted note
    fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(dbNotes))
    res.send(deletedNote)
})
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});