import { Button } from "react-bootstrap";

interface NavbarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}

const NavbarLoggedOutView = ({
  onSignUpClicked,
  onLoginClicked,
}: NavbarLoggedOutViewProps) => {
  return (
    <>
      <Button onClick={onSignUpClicked}>Sign Up</Button>
      <Button onClick={onLoginClicked}>Login</Button>
    </>
  );
};

export default NavbarLoggedOutView;
