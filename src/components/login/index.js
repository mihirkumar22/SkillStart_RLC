import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Form, Card, Alert, Button, CardHeader } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import styles from "./login.module.css";
import background from "../images/regbg.jpg";


function Login() {
    // Define states for loading, error messages
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Use React.js useRef hooks
    const emailRef = useRef();
    const passwordRef = useRef();

    // Import login page from auth provider
    const { login } = useAuth();

    // Define navigate to use navigate from react-router-dom
    const navigate = useNavigate();
    
    // Handle submit function
    async function handleSubmit(e) {
        // Prevnets default HTML submit process
        e.preventDefault();
        // Set states
        setLoading(true);
        setError('');
        // Use a try {} catch to catch any potential errors
        try {
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/home');
        } catch (err) {
            setError('Failed to log in.');
        }
    
        setLoading(false);
    }

    return (
        <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
            <div className={styles.centerContainer}>
                <Card className={styles.nest}>
                    <CardHeader className={styles.pookie}>
                        <Card.Title> Login </Card.Title>
                    </CardHeader>
                    <Card.Body>
                        
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label> <b> Email address </b> </Form.Label>
                                <Form.Control ref={emailRef} type="email" placeholder="Enter email" />
                            </Form.Group>
                            <br></br>
                            <Form.Group>
                                <Form.Label> <b> Password </b></Form.Label>
                                <Form.Control ref={passwordRef} type="password" placeholder="Enter password" />
                            </Form.Group>
                            <br></br>
                            <Button className={styles.hi} disabled={loading} type="submit">{loading ? "Logging In..." : "Log In"}</Button>
                        </Form>
                        <br></br>
                        <Card.Text>Don't have an account? <Link to="/register">Sign Up!</Link></Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default Login;