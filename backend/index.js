//part3c2
require("dotenv").config();

const Note = require("./models/note");

const express = require("express");
const app = express();

app.use(express.json());

app.use(express.static("dist"));

const cors = require("cors");
app.use(cors());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// app.get("/api/notes", (request, response) => {
//   Note.find({}).then((notes) => {
//     response.json(notes);
//   });
// });

app.get("/api/notes", async (request, response, next) => {
  console.log("handling /api/notes");
  try {
    const notes = await Note.find({});
    response.json(notes);
  } catch (error) {
    next(error);
  }
});

app.get("/api/notes/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return response.status(404).end();
    }
    response.json(note);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

app.delete("/api/notes/:id", async (request, response, next) => {
  const id = request.params.id;
  try {
    const result = await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

//add a new note
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.put("/api/notes/:id", async (request, response, next) => {
  const { content, important } = request.body;
  try {
    const note = await Note.findById(request.params.id);
    if (!note) {
      return response.status(404).end();
    }
    note.content = content;
    note.important = important ?? note.important;

    const updatedNote = await note.save();
    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

app.post("/api/notes", async (request, response, next) => {
  console.log("adding a note");
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important ?? false,
  });

  try {
    const savedNote = await note.save();
    response.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.name, error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    const details = Object.fromEntries(
      Object.entries(error.errors).map(([field, err]) => [field, err.message])
    );
    return response.status(400).json({
      error: "validation error",
      details,
    });
  }

  response.status(500).json({ error: "internal server error" });
};

app.use(errorHandler);

// added the environment variable below
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
