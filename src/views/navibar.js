import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; 

const Navigation = () => {
  const [user] = useAuthState(auth);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <Navbar variant="light" bg="light">
      <Container style={{
        backgroundColor: "lightblue"
      }}>
        <Navbar.Brand href="/" style={{
          color: "black",
          fontFamily: "garamond",
        }}>aashleygram</Navbar.Brand>
        <Nav>
          <Nav.Link href="/add">New Post</Nav.Link>
          {user && <Nav.Link disabled style={{ color: "blue" }}>{user.email}</Nav.Link>}
          {user && <Nav.Link onClick={handleSignOut}>Sign Out🚪</Nav.Link>}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;