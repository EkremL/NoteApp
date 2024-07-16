import { useEffect, useState } from "react";
import { Note as NoteModel } from "./models/note";
import Note from "./components/Note";
import { Button, Col, Container, Row } from "react-bootstrap";
import * as NotesApi from "./network/notes_api";
import AddEditNoteDialog from "./components/AddEditNoteDialog";
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import { FaPlus } from "react-icons/fa";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await NotesApi.fetchNotes(); //network içerisindeki notes api içerisindeki fetchi buradan çağırdık, her zamankinden farklı bir yöntem
        setNotes(notes); //!state updating
      } catch (error) {
        console.error("Error fetching notes:", error);
        alert(error);
      }
    }
    loadNotes();
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
      <Container>
        <Button
          className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
          onClick={() => setShowAddNoteDialog(true)}
        >
          <FaPlus />
          Add New Note
        </Button>
        <Row xs={1} md={2} xl={3} className="g-4">
          {notes.map((note) => (
            <Col key={note._id}>
              <Note
                note={note}
                className={styles.note}
                onDeleteNoteClicked={deleteNote}
                onNoteClicked={setNoteToEdit}
              />
              {/* <Note> içerisindeki classname, Note.tsx de oluşturduğumuz classname, böylece componente dışarıdan bir css dosyası ekleyebildik */}
            </Col>
          ))}
        </Row>
        {showAddNoteDialog && (
          <AddEditNoteDialog
            onDismiss={() => setShowAddNoteDialog(false)}
            onNoteSaved={(newNote) => {
              setNotes([...notes, newNote]);
              setShowAddNoteDialog(false);
            }}
          />
        )}
        {noteToEdit && (
          <AddEditNoteDialog
            noteToEdit={noteToEdit}
            onDismiss={() => setNoteToEdit(null)}
            onNoteSaved={(updatedNote) => {
              setNotes(
                notes.map((existingNote) =>
                  existingNote._id === updatedNote._id
                    ? updatedNote
                    : existingNote
                )
              );
              setNoteToEdit(null);
            }}
          />
        )}
      </Container>
    </>
  );
}

export default App;
