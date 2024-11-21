import React from "react";
import { Card } from "react-bootstrap";

function StudentHome({ user }) {
    return (
        <div style={{ height: '75vh'}}>
            <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="text-center">Home Page</Card.Title>
                    <Card.Text className="text-center" style={{ marginTop: '4em', fontSize: '2em' }}>Welcome, {user.username || user.email}!</Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default StudentHome;