import React, { useState } from "react";
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/AuthContext";

function NavBar() {
    const navigate = useNavigate();
    const { role } = useUserRole();
    const { logout } = useAuth();
    const [ logoutLoading, setLogoutLoading ] = useState(false);

    const handleLogout = async () => {
        setLogoutLoading(true);
        await logout();
        navigate('/login')
        setLogoutLoading(false)
    }
    
    return (
        <>
            <Card>
                <Card.Header>
                    <Button onClick={() => {navigate('/home')}}>Home</Button>
                    { role !== "admin" && 
                        <Button onClick={() => {navigate('/profile')}}>Profile</Button>
                    }
                    <Button onClick={() => {navigate('/postings')}}>Postings</Button>
                    <Button disabled={logoutLoading} onClick={handleLogout}>{logoutLoading ? "Logging Out..." : "Log Out"}</Button>
                </Card.Header>
            </Card>
        </>
    )
}

export default NavBar;