import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

interface AddUserProps {
  onUserAdded: (user: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => void;
}

const AddUser: React.FC<AddUserProps> = ({ onUserAdded }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onUserAdded({ username, email, password, role });
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("");
    setError(null);
  };

  return (
    <Container>
      <h2>Add New User</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </Form.Control>
        </Form.Group>
        <Button type="submit">Add User</Button>
      </Form>
    </Container>
  );
};

export default AddUser;
