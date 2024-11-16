import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            await logout();
            navigate('/login')
        } catch (err) {
            setError('Error logging out.')
        }

        setLoading(false);
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Home Page</Card.Title>
                {user ? (
                    <>
                        <Card.Text>Hello, {user.email}!</Card.Text>
                        {error && <Alert>{error}</Alert>}
                        <Button disabled={loading} onClick={handleLogout}>{loading ? "Logging Out..." : "Log Out"}</Button>
                    </>
                ) : (
                    <>
                        <Card.Text>Please login to view the home page.</Card.Text>
                        <Button onClick={() => {navigate('/login')}}>Return</Button>
                    </>
                )}
            </Card.Body>
        </Card>
    )
}

export default Home;