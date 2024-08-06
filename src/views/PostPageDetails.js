import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row, Form, Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

export default function PostPageDetails() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const params = useParams();
  const id = params.id;
  const [user, loading] =  useAuthState(auth);
  const navigate = useNavigate();

  async function getComments(postId) {
    const commentsQuery = query(collection(db, "comments"), where("postId", "==", postId));
    const querySnapshot = await getDocs(commentsQuery);
    const commentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(commentsData);
  }

  async function addComment() {
    if (!newComment) return; 
    await addDoc(collection(db, "comments"), {
      postId: id,
      userId: user.uid,
      text: newComment,
      createdAt: new Date(),
    });
    setNewComment(""); 
    getComments(id); 
  }

  async function updateComment(commentId) {
    if (!editingCommentText) return;
    await updateDoc(doc(db, "comments", commentId), {
      text: editingCommentText,
    });
    setEditingCommentId(null);
    setEditingCommentText("");
    getComments(id);
  }

  async function deleteComment(commentId) {
    await deleteDoc(doc(db, "comments", commentId));
    getComments(id);
  }

  async function deletePost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    const desertRef = ref(storage, `images/${post.imageName}`);
    deleteObject(desertRef).then(() => {
        console.log("deleted from firebase storage");
    }).catch((error) => {
        console.error(error.message);
    });

    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setCaption(post.caption);
    setImage(post.image);
    getComments(id);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getPost(id);
  }, [id, navigate, user, loading]);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container style={{ backgroundColor: "lightblue" }}>
          <Navbar.Brand href="/" style={{ color: "black", fontFamily: "garamond" }}>
            aashleygram
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">New Post</Nav.Link>
            {user && <Nav.Link disabled style={{ color: "blue" }}>{user.email}</Nav.Link>} 
            <Nav.Link onClick={() => signOut(auth)}>Sign Out🚪</Nav.Link>
          </Nav>
        </Container>
      </Navbar>      
      <Container style={{ 
          backgroundColor: "#f0f8ff", 
          minHeight: "100vh", 
          padding: "20px" 
      }}>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%", border: "3px solid black"}} />
          </Col>
          <Col>
            <Card>
              <Card.Body style={{ backgroundColor: "ivory", border: "3px solid khaki" }}>
                <Card.Text>{caption}</Card.Text>
                <Card.Link href={`/update/${id}`}>Edit</Card.Link>
                <Card.Link onClick={() => deletePost(id)} style={{ cursor: "pointer" }}> Delete </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: "2rem" }}>
          <Col>
            <h3 className="my-3">Comments</h3>
            {comments.map((comment) => (
              <Card key={comment.id} style={{ marginBottom: "1rem" }}>
                <Card.Body>
                  {editingCommentId === comment.id ? (
                    <Form onSubmit={(e) => { e.preventDefault(); updateComment(comment.id); }}>
                      <Form.Group controlId={`editingComment-${comment.id}`}>
                        <Form.Control
                          type="text"
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit">Update</Button>
                      <Button variant="danger" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                    </Form>
                  ) : (
                    <>
                      <Card.Text>{comment.text}</Card.Text>
                      <Button variant="secondary" onClick={() => { 
                        setEditingCommentId(comment.id); 
                        setEditingCommentText(comment.text); 
                      }}>Edit</Button>
                      <Button variant="danger" onClick={() => deleteComment(comment.id)}>Delete</Button>
                    </>
                  )}
                </Card.Body>
              </Card>
            ))}
            {user ? (
              <Form onSubmit={(e) => { e.preventDefault(); addComment(); }}>
                <Form.Group controlId="newComment">
                  <Form.Control
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="my-3">Submit</Button>
              </Form>
            ) : (
              <p>Please log in to comment.</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}