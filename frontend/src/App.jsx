import Note from "./components/Note.jsx";
import { useState, useEffect } from "react";
import noteService from "./services/notes";
import Footer from "./components/Footer.jsx";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const hook = () => {
    console.log("effect");
    noteService.getAll().then((initialNotes) => {
      console.log("promise fulfilled");
      setNotes(initialNotes);
    });
  };

  useEffect(hook, []);

  const addNote = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);
    if (!newNote.trim()) return;
    const newNoteObject = {
      //id: notes.length + 1,
      content: newNote,
      important: Math.random() > 0.5,
    };

    // setNotes(notes.concat(newNoteObject));
    // setNewNote("");
    noteService.create(newNoteObject).then((returnedNote) => {
      console.log(returnedNote);
      setNotes(notes.concat(returnedNote));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const handleToggleImportance = (id) => {
    console.log(`need to toggle importance of id ${id}`);
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    // persist the change,
    // then rebuild our notes list from the old list
    // but use the newly modified note.
    noteService
      .update(id, changedNote)
      .then((updatedNote) => {
        setNotes(
          notes.map((note) =>
            note.id === id ? updatedNote : note
          )
        );
      })
      .catch((error) => {
        setErrorMessage(
          `the note '${note.content}' was already deleted from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((item) => (
          <Note
            key={item.id}
            note={item}
            toggleImportance={() =>
              handleToggleImportance(item.id)
            }
          />
        ))}
      </ul>
      <form id="newNote" onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit" disabled={!newNote.trim()}>
          save
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
