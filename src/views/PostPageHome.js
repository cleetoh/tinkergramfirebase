import { useEffect, useState } from "react";
import { Container, Image, Row, Card, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Navigation from "./navibar";

export default function PostPageHome() {
  const [posts, setPosts] = useState([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate(); 

  async function getAllPosts() {
    const query = await getDocs(collection(db, "posts"));
    const posts = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }; 
    });
    setPosts(posts);
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
    }
  }, [user, navigate]);

  const ImagesRow = () => {
    return posts.map((post) => <ImageSquare key={post.id} post={post} />);
  };

  return (
    <>
      <Navigation />
      <Container style={{
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
        padding: "20px",
      }}>
        <Row>
          <ImagesRow />
        </Row>
      </Container>
    </>
  );
}

function ImageSquare({ post }) {
  const { image, id, caption, likes } = post; 
  const numberOfLikes = likes ? likes.length : 0; 

  return (
    <Link
      to={`post/${id}`}
      style={{
        width: "18rem",
        marginLeft: "1rem",
        marginTop: "2rem",
        textDecoration: "none", 
        color: "black", 
      }}
    >
      <Card style={{
        width: "18rem",
        border: "3px solid black",
      }}>
        <Image
          src={image}
          style={{
            objectFit: "cover",
            height: "18rem",
          }}
        />
        <Card.Body>
          <Card.Text>{caption}</Card.Text> 
          <Badge pill bg="primary">{numberOfLikes} Likes</Badge> 
        </Card.Body>
      </Card>
    </Link>
  );
}
