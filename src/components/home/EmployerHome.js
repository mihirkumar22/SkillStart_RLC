import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { db } from "../../firebase";
import { collection, addDoc } from 'firebase/firestore';

function EmployerHome({ user }) {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({ uid: user.uid, title: "", companyName: "", address: "", jobDescription: "" })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDescriptionChange = (value) => {
        setFormData((prev) => ({ ...prev, jobDescription: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "postings"), {
                ...formData,
                status: "unapproved"
            })
            handleClose();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Card>
            <Card.Body>
                <Card.Text>Hello, {user.email}! You are an employer.</Card.Text>
                <Button onClick={handleShow}>+ Make a new posting</Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Make a new posting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="jobOverview">
                                <Form.Label>Job Overview</Form.Label>
                                <Form.Control
                                    name="title"
                                    value={formData.title}
                                    type="text"
                                    placeholder="Job Title"
                                    maxLength={50}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control
                                    name="companyName"
                                    value={formData.companyName}
                                    type="text"
                                    placeholder="Company Name"
                                    maxLength={50}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control
                                    name="address"
                                    value={formData.address}
                                    type="text"
                                    placeholder="Address"
                                    maxLength={50}
                                    onChange={handleChange}
                                    required
                                />
                                <Button >Replace with defaults?</Button>
                            </Form.Group>
                            <Form.Group controlId="jobDescription">
                                <Form.Label>Job Description</Form.Label>
                                <div style={{ minHeight: "30vh", maxHeight: "30vh", overflowY: "auto" }}>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.jobDescription}
                                        placeholder="Enter detailed job description"
                                        onChange={handleDescriptionChange}
                                    />
                                </div>
                            </Form.Group>
                            <Button variant="primary" type="submit">Submit Job</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    )
}

export default EmployerHome;