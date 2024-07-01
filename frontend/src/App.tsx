import { useEffect, useState } from "react";
import "./App.css";
import { Note } from "./models/note";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch("http://localhost:5000/api/notes", {
          method: "GET",
        });
        const notes = await response.json();
        setNotes(notes); //!state updating
      } catch (error) {
        console.error("Error fetching notes:", error);
        alert(error);
      }
    }
    loadNotes();
  }, []);

  return (
    <>
      <div>
        {notes.length > 0 &&
          notes.map((note) => <div key={note._id}>{JSON.stringify(note)}</div>)}
      </div>
    </>
  );
}

export default App;
