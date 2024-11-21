import React from "react";
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../../contexts/UserContext";

function NavBar() {
    const navigate = useNavigate();
    const { role } = useUserRole();

    return (
        <>
            <Card>
                <Card.Header>
                    <Button onClick={() => {navigate('/home')}}>Home</Button>
                    { role !== "admin" && 
                        <Button onClick={() => {navigate('/profile')}}>Profile</Button>
                    }
                    <Button onClick={() => {navigate('/postings')}}>Postings</Button>
                    { role === "employer" && (
                        <>
                            <Button onClick={() => {navigate('/employer-postings')}}>Your postings</Button>
                            <Button onClick={() => {navigate('/saved-students')}}>Saved Students</Button>
                        </>
                    )}
                </Card.Header>
            </Card>
        </>
    )
}

export default NavBar;