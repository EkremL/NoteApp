import { ConflictError, UnAuthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

async function fetchData(input: RequestInfo, init?: RequestInit) {
  //buradaki parametreleri fetch içindeki typelara bakıp yazdık
  const response = await fetch(input, {
    ...init,
    credentials: "include", // Oturum kimlik doğrulaması için çerezleri ekler
  });
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    //! kendi yazdigimiz custom hata status kodlari
    if (response.status === 401) {
      throw new UnAuthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    }
    //!burası da normal Error classındaki error
    else {
      throw Error(
        "Request failed with status " +
          response.status +
          "message: " +
          errorMessage
      );
    }
  }
}

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData(`${apiUrl}/api/users`, {
    method: "GET",
  });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData(`${apiUrl}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchData(`${apiUrl}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  await fetchData(`${apiUrl}/api/users/logout`, {
    method: "POST",
  });
}

//?GET ALL NOTES FETCH
//!async functionlar daima promise döner
export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData(`${apiUrl}/api/notes`, {
    method: "GET",
  });
  return response.json();
}

//?CREATE A NEW NOTE FETCH
export interface NoteInput {
  title: string;
  text?: string;
}
export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData(`${apiUrl}/api/notes`, {
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
  await fetchData(`${apiUrl}/api/notes/` + noteId, {
    method: "DELETE",
  });
}

//?UPDATE NOTE FETCH

export async function updateNote(
  noteId: string,
  note: NoteInput
): Promise<Note> {
  const response = await fetchData(`${apiUrl}/api/notes/` + noteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return response.json();
}
