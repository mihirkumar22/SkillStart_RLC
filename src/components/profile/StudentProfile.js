import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useMemo } from "react";

function StudentProfile({ user }) {
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: "", phoneNumber: "", location: "", bio: "" });

    const userRef = useMemo(() => doc(db, 'users', user.uid), [user.uid]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
            setLoading(false);
        };

        fetchUserData();
    }, [userRef]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditChange = async () => {
        if (edit) {
            setLoading(true);
            try {
                await updateDoc(userRef, formData);
            } catch (error) {
                console.error("Error updating user data: ", error);
            } finally {
                setLoading(false); // Ensure loading is reset even if there's an error
            }
        }
        setEdit(!edit);
    };


    return (
        <Card style={{ width: '40vw' }}>
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <Card.Text style={{ fontSize: '2em', textAlign: 'center', width: '100%', marginBottom: '0px' }}>
                    Your Profile
                </Card.Text>
                <Form>
                    <Form.Group>
                        <Form.Label style={{ fontSize: '1.3em' }}>Your Name</Form.Label>
                        <Form.Control
                            name="username"
                            value={formData.username || ""}
                            placeholder="Username"
                            onChange={handleFormChange}
                            disabled={!edit}
                            style={{ marginBottom: '1em' }}
                        />
                        <Form.Label style={{ fontSize: '1.3em' }}>Email</Form.Label>
                        <Form.Control
                            plaintext
                            readOnly
                            value={user.email}
                            style={{ marginBottom: '1em' }}
                        />
                        <Form.Label style={{ fontSize: '1.3em' }}>Phone Number</Form.Label>
                        <Form.Control
                            name="phoneNumber"
                            value={formData.phoneNumber || ""}
                            placeholder="Phone Number"
                            onChange={handleFormChange}
                            disabled={!edit}
                        />
                        <Form.Label style={{ fontSize: '1.3em' }}>Location</Form.Label>
                        <Form.Control
                            name="location"
                            value={formData.location || ""}
                            placeholder="Location"
                            onChange={handleFormChange}
                            disabled={!edit}
                        />
                        <Form.Label style={{ fontSize: '1.3em' }}>Tell the world about yourself!</Form.Label>
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
                        <Form.Text>Characters remaining: {50 - (formData.bio?.length || 0)}/50</Form.Text>
                    </Form.Group>
                </Form>
                <Button style={{ marginTop: '6px' }} onClick={handleEditChange}>
                    {loading ? "Loading..." : edit ? "Save" : "Edit"}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default StudentProfile;
