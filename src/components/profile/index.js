import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../contexts/UserContext';
import { Card, Button } from 'react-bootstrap';
import EmployerProfile from './EmployerProfile';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [editProfile, setEditProfile] = useState(false);
    const [ logoutLoading , setLogoutLoading ] = useState(false);

    const { role } = useUserRole();
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        setLogoutLoading(true);
        await logout();
        navigate('/login')
        setLogoutLoading(false)
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Your Profile</Card.Title>
                {user ? (
                    <>
                        {role === "employer" && (
                            <EmployerProfile />
                        )}
                    <Button disabled={logoutLoading} onClick={handleLogout}>{logoutLoading ? "Logging Out..." : "Log Out"}</Button>
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

export default Profile;