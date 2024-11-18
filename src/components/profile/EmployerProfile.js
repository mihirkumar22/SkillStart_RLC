import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { db } from '../../firebase';

function EmployerProfile(user) {
    const [ edit, setEdit ] = useState(false);
    const [formData, setFormData] = useState({ companyName: "", address: "" })

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleEditChange = () => {
        setEdit(!edit);
    }
    
    return (
        <Card>
            <Form>
                <Form.Group controlId="settings">
                    <Form.Label>Your Company Name</Form.Label>
                    <Form.Control 
                        name="companyName"
                        value={formData.companyName}
                        placeholder="Your Company Name"
                        onChange={handleFormChange}
                        disabled={edit}
                    />
                    
                </Form.Group>
            </Form>
            <Card.Footer>
                <Button onClick={handleEditChange}>{edit ? "Save" : "Edit" }</Button>
            </Card.Footer>
        </Card>
    )
}

export default EmployerProfile