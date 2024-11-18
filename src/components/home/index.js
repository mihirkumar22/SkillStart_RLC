import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../contexts/UserContext';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EmployerHome from './EmployerHome';

function Home() {
    const [loading, setLoading] = useState(false);

    const { user, logout } = useAuth();
    const { role } = useUserRole();
    const navigate = useNavigate();


    async function handleLogout(e) {
        e.preventDefault();

        setLoading(true);

        await logout();
        navigate('/login')

        setLoading(false);
    }

    return (
        <Card>
            <Card.Body>
                <Card.Header className="d-flex">
                    <Card.Title>Home Page</Card.Title>
                    <Button onClick={() => navigate('/profile')}>Profile</Button>
                </Card.Header>
                {user ? (
                    <>
                        {role === 'employer' && (
                            <EmployerHome user={user} />
                        )}
                        <Button disabled={loading} onClick={handleLogout}>{loading ? "Logging Out..." : "Log Out"}</Button>
                    </>
                ) : (
                    <>
                        <Card.Text>Please login to view the home page.</Card.Text>
                        <Button onClick={() => { navigate('/login') }}>Return</Button>
                    </>
                )}
            </Card.Body>
        </Card>
    )
}

export default Home;