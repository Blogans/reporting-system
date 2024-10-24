import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";

interface AddVenueProps {
  onVenueAdded: (venue: { name: string; address: string }) => void;
}

const AddVenue: React.FC<AddVenueProps> = ({ onVenueAdded }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVenueAdded({ name, address });
    setName("");
    setAddress("");
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Add Venue</Button>
      </Form>
    </Container>
  );
};

export default AddVenue;
