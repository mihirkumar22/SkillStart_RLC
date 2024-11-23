import React from "react";
import { Card } from "react-bootstrap";

function AdminHome({ user }) {
    return (
        <div style={{ height: '75vh'}}>
            <Card style={{ background: 'none' }}className="h-100">
                <Card.Body className="d-flex flex-column">
                    <Card.Text className="text-center" style={{ marginTop: '3em', fontSize: '2em', color: 'white' }}>Welcome, <strong>{user.username || user.email}!</strong></Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default AdminHome;