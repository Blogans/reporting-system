import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Venue } from "../../types/types";

//something broken idk why, need fix soon

interface EditVenueProps {
  venue: Venue;
  onVenueEdited: (updatedVenue: Partial<Venue>) => void;
}

const EditVenue: React.FC<EditVenueProps> = ({ venue, onVenueEdited }) => {
  const [name, setName] = useState(venue.name);
  const [address, setAddress] = useState(venue.address);

  useEffect(() => {
    setName(venue.name);
    setAddress(venue.address);
  }, [venue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVenueEdited({
      _id: venue._id,
      name,
      address,
    });
  };
  return (
    <Container>
      <Form>
        <Form.Group controlId="venueName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter venue name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="venueAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditVenue;
