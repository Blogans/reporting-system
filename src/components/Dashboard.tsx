import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useAuth } from "../context/auth.context.tsx";
import StatCard from "./dashboard/StatCard.tsx";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    totalWarnings: 0,
    totalBans: 0,
    totalVenues: 0,
  });
  const [dbStatus, setDbStatus] = useState<{
    message?: string;
    connectionStatus?: string;
    error?: string;
  }>({});

  useEffect(() => {
    fetchStats();
  }, []);

  const testDatabase = async () => {
    try {
      setLoading(true);
      setError(null);

      fetch('http://localhost:8080/api/venues/db', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => setDbStatus(data))
        .then(() => setLoading(false))
        .catch(err => setError(err instanceof Error ? err.message : 'An error occurred'))
    
      } catch (error) {
      console.error("Error testing database:", error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setDbStatus({ connectionStatus: 'Failed', error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      fetch('http://localhost:8080/api/dashboard/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .then(() => setLoading(false))
        .catch(err => setError(err instanceof Error ? err.message : 'An error occurred'))

    } catch (error) {
      console.error("Error fetching stats:", error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const dbTestSection = (
    <div className="mt-3">
      <button 
        className="btn btn-primary mb-2" 
        onClick={testDatabase}
        disabled={loading}
      >
        Test Database Connection
      </button>
      {dbStatus.connectionStatus && (
        <div className={`alert ${dbStatus.connectionStatus === 'Connected' ? 'alert-success' : 'alert-danger'}`}>
          <strong>DB Status:</strong> {dbStatus.connectionStatus}<br />
          {dbStatus.message && <div><strong>Message:</strong> {dbStatus.message}</div>}
          {dbStatus.error && <div><strong>Error:</strong> {dbStatus.error}</div>}
        </div>
      )}
    </div>
  );

  // Debug section at top of dashboard
  const debugSection = (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Debug Information</Card.Title>
        <div>
          <strong>Loading:</strong> {loading.toString()}<br />
          <strong>Error:</strong> {error || 'None'}<br />
          <strong>Stats:</strong> {JSON.stringify(stats, null, 2)}
        </div>
        {dbTestSection}
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