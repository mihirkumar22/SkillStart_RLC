import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../contexts/UserContext';
import { Card, Button } from 'react-bootstrap';
import EmployerProfile from './EmployerProfile';
import StudentProfile from './StudentProfile';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar';
import background from '../images/tree-bg.png'

function Profile() {

    const { role } = useUserRole();
    const { user } = useAuth();

    const navigate = useNavigate();

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar role={role} />
            <Card style={{ flex: 1, border: 'none' }}>
                <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
                    {user ? (
                        <>
                            {role === "employer" && (
                                <EmployerProfile style={{ flex: 1 }} user={user} />
                            )}
                            {role === "student" && (
                                <StudentProfile user={user} />
                            )}
                        </>
                    ) : (
                        <>
                            <Card.Text>Please login to view the home page.</Card.Text>
                            <Button onClick={() => { navigate('/login') }}>Return</Button>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default Profile;