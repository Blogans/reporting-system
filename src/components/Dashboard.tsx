import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useAuth } from "../context/auth.context.tsx";
import StatCard from "./dashboard/StatCard.tsx";

const Dashboard: React.FC = () => {
  const [message, setMessage] = useState('')
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    totalWarnings: 0,
    totalBans: 0,
    totalVenues: 0,
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/test')
    .then(res => res.json())
    .then(data => setMessage(data.message))
    .catch(err => setError(err.message))
    
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/dashboard/stats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data); // Debug log
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Debug section at top of dashboard
  const debugSection = (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Debug Information</Card.Title>

        <>
      <h1>React + Express Test</h1>
      {message && <p>Server says: {message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </>
    
        <div>
          <strong>Loading:</strong> {loading.toString()}<br />
          <strong>Error:</strong> {error || 'None'}<br />
          <strong>Stats:</strong> {JSON.stringify(stats, null, 2)}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="mt-4">
      <h1>Welcome to the Dashboard</h1>
      {user && (
        <>
          <p>You are logged in as: {user.email}</p>
          <p>Your role is: {user.role}</p>
        </>
      )}

    <>
      <h1>React + Express Test</h1>
      {message && <p>Server says: {message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </>
      {debugSection}

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mt-4">
        <Col md={3}>
          <StatCard 
            title="Total Incidents" 
            value={stats.totalIncidents} 
          />
        </Col>
        {/* ... other StatCards ... */}
      </Row>

      {/* ... rest of your components ... */}
    </Container>
  );
};

export default Dashboard;