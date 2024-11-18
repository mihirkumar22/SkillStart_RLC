import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import RoleToggle from './RoleToggle'

function Register() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('student');

    const emailRef = useRef();
    const passwordRef = useRef();

    const { register } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            await register(emailRef.current.value, passwordRef.current.value, role);
            navigate('/home');
        } catch (err) {
            setError('Failed to create an account. Please try again.');
        }

        setLoading(false);
    }

    return (
        <Card>
            <Card.Body>
                <RoleToggle role={role} setRole={setRole}/>
                <Card.Title>{role === 'student' ? 'Student' : 'Employer'} Registration</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" ref={passwordRef} />
                    </Form.Group>   
                    <Button disabled={loading} type="submit">
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                </Form>
                <Card.Text>Already have an account? <Link to="/login">Log in!</Link></Card.Text>
            </Card.Body>
        </Card>
    );
}

export default Register;
