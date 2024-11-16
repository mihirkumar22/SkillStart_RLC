import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Form, Card, Alert, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/home');
        } catch (err) {
            setError('Failed to log in.');
        }

        setLoading(false);
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Login</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control ref={emailRef} type="email" placeholder="Enter email"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={passwordRef} type="password" placeholder="Enter password"/>
                    </Form.Group>
                    <Button disabled={loading} type="submit">{loading ? "Logging In..." : "Log In"}</Button>
                </Form>
                <Card.Text>Don't have an account? <Link to="/register">Sign Up!</Link></Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Login;