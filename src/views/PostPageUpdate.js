import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image, Nav, Navbar } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "./navibar";
import { useAuthState } from "react-firebase-hooks/auth";
import {auth, db, storage} from "../firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PostPageUpdate() {
  const params = useParams();
  const id = params.id;
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("https://cdn-icons-png.flaticon.com/128/2496/2496846.png");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  async function updatePost() {
    const imageReference = ref(storage, `images/${image.name}`);
    const response = await uploadBytes(imageReference, image);
    const imageUrl = await getDownloadURL(response.ref);
    await updateDoc(doc(db, "posts", id), {caption, image:imageUrl});
    navigate("/");
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setCaption(post.caption);
    setImage(post.image);
    setPreviewImage(post.image)
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate ("/login")
    getPost(id);
  }, [id, navigate, user, loading]);

  return (
    <div>
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
            <Nav.Link onClick={(e) => signOut(auth)}>Sign Out🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container style={{ 
          backgroundColor: "#f0f8ff", 
          minHeight: "100vh", 
          padding: "20px",
      }}>        
      <h1 style={{ marginBlock: "1rem", fontFamily: "ubuntu" }}>Update Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label style={{fontFamily: "-moz-initial"}}>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Update caption"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>

          <Image 
          src = {previewImage}
          style={{
            objectFit: "cover",
            width: "10rem",
            height: "10rem",
          }} />

          <Form.Group className="my-3" controlId="image">
            <Form.Label style={{fontFamily: "-moz-initial"}}>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => {
                const imageFile = e.target.files[0];
                const previewImage = URL.createObjectURL(imageFile);
                setImage(imageFile);
                setPreviewImage(previewImage);
            }}
            />
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={(e) => updatePost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}