import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

interface AddContactProps {
  onContactAdded: (contact: any) => void;
}

const AddContact: React.FC<AddContactProps> = ({ onContactAdded }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, phone }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add contact");
      }

      const newContact = await response.json();
      onContactAdded(newContact);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setError("Error adding contact");
      console.error("Error in handleSubmit:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Add New Contact</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </Form.Group>
      <Button type="submit">Add Contact</Button>
    </Form>
  );
};

export default AddContact;
