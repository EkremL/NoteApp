import express from "express";
//controlleri buraya import ediyoruz
//1. yöntem
import * as NotesController from "../controllers/notes";

const router = express.Router();

//!get all notes route
router.get("/", NotesController.getNotes);
//!create note route
router.post("/", NotesController.createNote);
//!get single note route
router.get("/:noteId", NotesController.getSingleNote);
//!update route
router.patch("/:noteId", NotesController.updateNote);
//!delete route
router.delete("/:noteId", NotesController.deleteNote);

//1. yöntem (eğer sadece 1 fonksiyon varsa kullanılabilir ama karmaşık ve birden fazla olanlarda yukardaki kullanılır)

//2. yöntem (eğer sadece 1 fonksiyon varsa kullanılabilir ama karmaşık ve birden fazla olanlarda yukardaki kullanılır)

// import { getNotes } from "../controllers/notes";
// const router = express.Router();
// router.get("/", getNotes);

export default router;
