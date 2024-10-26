import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";

interface PasswordRequirement {
  message: string;
  isMet: boolean;
}

const validatePassword = (password: string): PasswordRequirement[] => {
  return [
    {
      message: 'At least 8 characters long',
      isMet: password.length >= 8
    },
    {
      message: 'Contains an uppercase letter',
      isMet: /[A-Z]/.test(password)
    },
    {
      message: 'Contains a lowercase letter',
      isMet: /[a-z]/.test(password)
    },
    {
      message: 'Contains a number',
      isMet: /\d/.test(password)
    },
    {
      message: 'Contains a special character',
      isMet: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  ];
};

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [error, setError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([]);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const requirements = validatePassword(password);
    setPasswordRequirements(requirements);
    setIsPasswordValid(requirements.every(req => req.isMet));
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <h2 className="mb-4">Register</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                isValid={password.length > 0 && isPasswordValid}
                isInvalid={password.length > 0 && !isPasswordValid}
              />
              <div className="mt-2">
                {passwordRequirements.map((req, index) => (
                  <div 
                    key={index} 
                    className="small"
                    style={{ 
                      color: req.isMet ? '#198754' : '#dc3545',
                      marginBottom: '0.25rem'
                    }}
                  >
                    {req.isMet ? '✓' : '○'} {req.message}
                  </div>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit"
              disabled={!isPasswordValid || !username || !email}
            >
              Register
            </Button>
          </Form>
          <p className="mt-3">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;