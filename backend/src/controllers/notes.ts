import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

//! Get Notes
export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    // throw Error("BOOM!");
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

//!Olusturacağımız notun icindeki verilerin tipini belirtmemiz gerek bunun icin interface olusturduk

interface CreateNoteBody {
  title?: string; //zorunlu olmasına rağmen endpointe istek atıldığında verinin gönderileceğinden emin olmak icin question mark koyduk
  text?: string; //modelde zorunlu tutmadığımız icin question mark koyduk
}

//! Create Note
export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  try {
    //title i zorunlu tuttuğumuz icin olmadığı durumda bir hata ekledik
    if (!title) {
      throw createHttpError(400, "Note must have a title!");
    }

    const newNote = await NoteModel.create({
      title: title,
      text: text,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

//! get single note

export const getSingleNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  try {
    //! buraya normalde mongonun kabul ettiği 24 haneli idyi kontrol eden bir hata ekledik
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id!"); //400 bad request hatası veriyoruz
    }

    const note = await NoteModel.findById(noteId).exec();

    //! buraya da note olmadığı zamanki hatayı ekledik
    if (!note) {
      throw createHttpError(404, "Note not found!"); //404 not found hatası veriyoruz
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
