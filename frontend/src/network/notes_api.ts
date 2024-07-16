import { Note } from "../models/note";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  //buradaki parametreleri fetch içindeki typelara bakıp yazdık
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
}

//?GET ALL NOTES FETCH
//!async functionlar daima promise döner
export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData("http://localhost:5000/api/notes", {
    method: "GET",
  });
  return await response.json();
}
//?CREATE A NEW NOTE FETCH
export interface NoteInput {
  title: string;
  text?: string;
}
export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData(`http://localhost:5000/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}

//?DELETE NOTE FETCH

export async function deleteNote(noteId: string): Promise<void> {
  await fetchData(`http://localhost:5000/api/notes/${noteId}`, {
    method: "DELETE",
  });
}

//?UPDATE NOTE FETCH

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await fetchData(
    `http://localhost:5000/api/notes/${noteId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    }
  );
  return response.json();
}
