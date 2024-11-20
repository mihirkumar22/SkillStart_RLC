import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Button, Alert, CardHeader } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import RoleToggle from './RoleToggle'
import styles from "./register.module.css";
import background from "../images/regbg.jpg";


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
        <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}> 
            <div className={styles.centerContainer}>
                <Card className={styles.nest}>
                    <CardHeader className={styles.pookie}>
                        <Card.Title> <b> <u>{role === 'student' ? 'Student' : 'Employer'}</u> Registration </b></Card.Title>
                        <RoleToggle className={styles.bear} role={role} setRole={setRole} />
                        <br></br>
                    </CardHeader>
                    <br></br>
                    <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="email">
                                <Form.Label> <b> Email address </b></Form.Label>
                                <Form.Control type="email" placeholder="Enter email" ref={emailRef} />
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="password">
                                <Form.Label> <b> Password </b> </Form.Label>
                                <Form.Control type="password" placeholder="Enter password" ref={passwordRef} />
                            </Form.Group>
                            <Button disabled={loading} type="submit" className={styles.submitButton}>
                                {loading ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </Form>
                        <br></br>
                        <Card.Text>Already have an account? <Link to="/login">Log in!</Link></Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default Register;
