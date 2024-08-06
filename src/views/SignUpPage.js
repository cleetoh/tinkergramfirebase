import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {auth} from "../firebase";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  return (
    <Container style={{ 
      backgroundColor: "#f0f8ff",
      minHeight: "100vh", 
      padding: "20px",
  }}>      
  <h1 className="my-3">Sign up for an account</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        <Form.Group className="my-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                </Form.Group>

          <a href="/login">Have an existing account? Login here.</a>

        </Form.Group>
        <Button 
        variant="primary"
        onClick={async (e) => {
            setError("");
            const canSignup = username && password && password === confirmPassword;
            if (canSignup)
                try{
            await createUserWithEmailAndPassword(auth, username, password);
            navigate("/");
        } catch (error) {
            setError(error.message);
        }
        else {
              setError("Passwords do not match.");
            }
        }}
        >Sign Up</Button>
      </Form>
      <p>{error}</p>
    </Container>
  );
}