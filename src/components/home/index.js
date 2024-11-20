import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../contexts/UserContext';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EmployerHome from './EmployerHome';
import NavBar from '../navbar';
import StudentHome from "./StudentHome";
import AdminHome from "./AdminHome";

function Home() {
    const [loading, setLoading] = useState(false);

    const { user, logout } = useAuth();
    const { role } = useUserRole();
    const navigate = useNavigate();
    console.log(user);

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
                <Card.Header>
                    <NavBar role={role}/>
                </Card.Header>
                {user ? (
                    <>
                        {role === 'employer' && (
                            <EmployerHome user={user} />
                        )}
                        {role === 'student' && (
                            <StudentHome user={user} />
                        )}
                        {role === 'admin' && (
                            <AdminHome user={user} />
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