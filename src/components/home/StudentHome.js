import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function StudentHome({ user }) {
    const { userData, email } = user;

    const navigate = useNavigate();

    return (
        <div style={{ height: '75vh'}}>
            <Card style={{ background: 'none' }}>
                <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Text className='text-center' style={{ marginTop: '3em', fontSize: '2em', color: 'white' }}>Welcome, <strong>{userData.username ? userData.username : email}!</strong></Card.Text>
                    <Button style={{ minWidth: '200px', width: '40vh', marginTop: '5vh' }} variant="success" onClick={() => {navigate('/student-applications')}}>View my applications</Button>
                </Card.Body>
            </Card>
        </div>
    )
}

export default StudentHome;