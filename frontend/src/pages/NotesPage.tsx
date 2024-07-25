import { Container } from "react-bootstrap";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import NotesPageLoggedOutPageView from "../components/NotesPageLoggedOutPageView";
import styles from "../styles/NotesPage.module.css";
import { User } from "../models/user";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  return (
    <Container className={styles.notesPage}>
      <>
        {loggedInUser ? (
          <NotesPageLoggedInView />
        ) : (
          <NotesPageLoggedOutPageView />
        )}
      </>
    </Container>
  );
};

export default NotesPage;
