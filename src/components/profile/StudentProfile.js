import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";

function StudentProfile({ user }) {
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: "", phoneNumber: "", location: "", bio: "" });

    const userRef = doc(db, 'users', user.uid);

    useEffect(() => {
        setLoading(true);
        setFormData({ username: "Loading...", phoneNumber: "Loading...", location: "Loading...", bio: "Loading..." })
        const fetchUserData = async () => {
            const docSnap = await getDoc(userRef);
            setFormData(docSnap.data());
        }
        setLoading(false)
        setFormData({ username: "", phoneNumber: "", location: "", bio: "" });
        fetchUserData();
    }, [])

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
        <Card>
            <Card.Body>
                <Card.Title>Your Profile</Card.Title>
                <Form>
                    <Form.Group>
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                            name="username"
                            value={formData.username || ""}
                            placeholder="Username"
                            onChange={handleFormChange}
                            disabled={!edit}
                        />
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            plaintext
                            readOnly
                            value={user.email}
                        />
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            name="phoneNumber"
                            value={formData.phoneNumber || ""}
                            placeholder="Phone Number"
                            onChange={handleFormChange}
                            disabled={!edit}
                        />
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            name="location"
                            value={formData.location || ""}
                            placeholder="Location"
                            onChange={handleFormChange}
                            disabled={!edit}
                        />
                        <Form.Label>Tell the world about yourself!</Form.Label>
                        <Form.Control
                            name="bio"
                            value={formData.bio || ""}
                            placeholder="Your bio"
                            onChange={handleFormChange}
                            disabled={!edit}
                            maxLength={50}
                            as="textarea"
                            rows="3"
                        />
                        <Form.Text>Chracters remaining: {50 - formData.bio?.length || 50}/50</Form.Text>
                    </Form.Group>
                </Form>
                <Card.Footer>
                    <Button onClick={handleEditChange}>{loading ? "Loading..." : edit ? "Save" : "Edit"}</Button>
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}

export default StudentProfile