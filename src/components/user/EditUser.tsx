import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { User } from "../../types/types";

interface EditUserProps {
  user: User;
  onUserEdited: (updatedUser: Partial<User>) => void;
}

const EditUser: React.FC<EditUserProps> = ({ user, onUserEdited }) => {
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role);

  useEffect(() => {
    setUsername(user.username);
    setRole(user.role);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserEdited({
      _id: user._id,
      username,
      role,
    });
  };

  return (
    <Container>
      <h2>Edit User</h2>
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
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "admin" | "manager" | "staff")
            }
            required
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </Form.Control>
        </Form.Group>

        <Button type="submit">Update User</Button>
      </Form>
    </Container>
  );
};

export default EditUser;
