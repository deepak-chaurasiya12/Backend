const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all the notes using: GET "/api/notes/getuser". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    // Send notes data along with color information to the client
    const notesWithColor = notes.map((note) => ({
      _id: note._id,
      title: note.title,
      description: note.description,
      tag: note.tag,
      color: note.color,
    }));

    res.json(notesWithColor);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error!!");
  }
});

// ROUTE 2: ADD a new Note using: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a Valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag, color} = req.body;

      // if there is any error occurs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        color,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error!!");
    }
  }
);

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {

  const {title, description, tag,color} = req.body;

  // creating a newNOte object 
  const newNote ={};
  if (title){newNote.title=title};
  if (description){newNote.description = description};
  if (tag){newNote.tag=tag}
 
  // Find the note to be updated and update it 
  let note = await Note.findById(req.params.id);
  if(!note){res.status(404).send("Not Found")}; 

  // /finding a note correspodning to a particular id and validate if it exists to that particular id or not
  if(note.user.toString()!== req.user.id){
    return res.status(401).send("Not Allowed");

  }

  // note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});

  // Update the note with new color data
  note.title = title;
  note.description = description;
  note.tag = tag;
  note.color = color; // Update color
  await note.save();

  res.json({note});

})

// ROUTE 4: Delete an existing Note using: PUT "/api/notes/deletenote". Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {

  const {title, description, tag} = req.body;


 
  // Find the note to be deleted and delete it 
  let note = await Note.findById(req.params.id);
  if(!note){res.status(404).send("Not Found")}; 

  // Allow deletion only if user owns this note
  if(note.user.toString()!== req.user.id){
    return res.status(401).send("Not Allowed");

  }

  note = await Note.findByIdAndDelete(req.params.id);
  res.json({"Success": "Note has been deleted"});

})
module.exports = router;
