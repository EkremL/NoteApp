import { Card, CardFooter } from "react-bootstrap";
import { Note as NoteModel } from "../models/note"; //component ismiyle aynı olduğu için böyle bir kullanım yaptık
import styles from "../styles/Note.module.css";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";
import styleUtils from "../styles/utils.module.css";

interface NoteProps {
  note: NoteModel;
  onNoteClicked: (note: NoteModel) => void;
  className?: string;
  onDeleteNoteClicked: (note: NoteModel) => void;
}

const Note = ({
  note,
  className,
  onDeleteNoteClicked,
  onNoteClicked,
}: NoteProps) => {
  const { title, text, createdAt, updatedAt } = note; //destructuring

  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = `Updated at: ${formatDate(updatedAt)}`;
  } else {
    createdUpdatedText = `Created at: ${formatDate(createdAt)}`;
  }

  return (
    //farklı bir css import şekli ile dosyanın içindeki classa ulaştık
    <Card
      className={`${styles.noteCard} ${className}`}
      onClick={() => onNoteClicked(note)}
    >
      <Card.Body className={styles.cardBody}>
        <Card.Title className={styleUtils.flexCenter}>
          {title}
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e) => {
              onDeleteNoteClicked(note);
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Text className={styles.cardText}>{text}</Card.Text>
      </Card.Body>
      <CardFooter className="text-muted">{createdUpdatedText}</CardFooter>
    </Card>
  );
};

export default Note;
