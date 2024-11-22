import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useMemo } from "react";

function EmployerProfile({ user }) {
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState({ companyName: "", location: "", address: "" })
    const [loading, setLoading] = useState(false);

    const userRef = useMemo(() => doc(db, 'users', user.uid), [user.uid]);

    useEffect(() => {
        setLoading(true);
        setFormData({ companyName: "Loading...", location: "Loading...", address: "Loading..." })
        const fetchUserData = async () => {
            const docSnap = await getDoc(userRef)
            setFormData(docSnap.data());
        }
        setLoading(false)
        setFormData({ companyName: "", location: "", address: "" })
        fetchUserData();
    }, [userRef])

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleEditChange = async () => {
        if (edit) {
            setLoading(true);
            await updateDoc(userRef, formData)
            setLoading(false);
        }
        setEdit(!edit);
    }

    return (
        <Card style={{ height: '75vh', width: '40vw' }}>
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Card.Text style={{ fontSize: '2em', textAlign: 'center', width: '100%', marginBottom: '0px' }}>
                    Your Profile
                </Card.Text>
                <Form>
                    <Form.Group controlId="settings">
                        <Form.Label style={{ fontSize: '1.3em' }}>Your Company Name</Form.Label>
                        <Form.Control
                            name="companyName"
                            value={formData.companyName}
                            placeholder="Company Name"
                            onChange={handleFormChange}
                            disabled={!edit}
                        />
                        <Form.Label style={{ fontSize: '1.3em' }}>Your Company Location</Form.Label>
                        <Form.Control
                            name="location"
                            value={formData.location}
                            placeholder="Company Location"
                            onChange={handleFormChange}
                            disabled={!edit}
                        />
                        <Form.Label style={{ fontSize: '1.3em' }}>Your Company Address</Form.Label>
                        <Form.Control
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            disabled={!edit}
                            placeholder="Company Address"
                        />
                    </Form.Group>
                </Form>
                <Button style={{ marginTop: '2em' }} onClick={handleEditChange}>
                    {loading ? "Loading..." : edit ? "Save" : "Edit"}
                </Button>
            </Card.Body>
        </Card>
    )
}

export default EmployerProfile