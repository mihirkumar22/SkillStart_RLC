import React from "react";
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function NavBar({ role }) {
    const navigate = useNavigate();
    
    return (
        <>
            <Card>
                <Card.Header>
                    <Button onClick={() => {navigate('/profile')}}>Home</Button>
                    <Button onClick={() => {navigate('/profile')}}>Profile</Button>
                    <Button onClick={() => {navigate('/postings')}}>Postings</Button>
                    { role === "employer" && (
                        <>
                            <Button onClick={() => {navigate('/employer-postings')}}>Your postings</Button>
                        </>
                    )}
                </Card.Header>
            </Card>
        </>
    )
}

export default NavBar;