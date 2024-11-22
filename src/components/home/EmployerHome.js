import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { db } from "../../firebase";
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function EmployerHome({ user }) {
    const { userData, uid, email } = user;
    
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        uid: uid,
        title: "",
        companyName: "",
        location: "",
        address: "",
        jobDescription: "",
        selectedTags: []
    });

    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAutoFill = async () => {
        setFormData((prev) => ({
            ...prev,
            companyName: userData.companyName || "",
            location: userData.location || "",
            address: userData.address || ""
        }))
    }

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
                status: "unapproved",
                datePublished: new Date().toISOString(),
                applicants: []
            })

            setFormData({
                uid: uid,
                title: "",
                companyName: "",
                location: "",
                address: "",
                jobDescription: "",
                selectedTags: []
            });

            handleClose();
        } catch (err) {
            console.error(err);
        }
    }

    const tags = ["tag 1", "tag 2", "tag 3", "tag 4", "tag 5"]

    const handleTagChange = async (tag) => {
        const prevSelectedTags = formData.selectedTags;
        setFormData((prev) => {
            if (prevSelectedTags.includes(tag)) {
                return { ...prev, selectedTags: prevSelectedTags.filter(t => t !== tag) };
            } else {
                return { ...prev, selectedTags: [...prevSelectedTags, tag] };
            }
        })
    }

    return (
        <div style={{ height: '75vh' }}>
            <Card style={{ background: 'none' }}>
                <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Text className='text-center' style={{ marginTop: '3em', fontSize: '2em', color: 'white' }}>Welcome, {userData.companyName ? userData.companyName : email}!</Card.Text>
                    <Button style={{ minWidth: '200px', width: '40vh', marginTop: '5vh' }} variant="success" onClick={handleShow}>+ Make a new posting</Button>
                    <Button style={{ minWidth: '200px', width: '40vh', marginTop: '5vh' }} variant="success" onClick={() => {navigate('/employer-postings')}}>View your postings</Button>
                    <Button style={{ minWidth: '200px', width: '40vh', marginTop: '5vh' }} variant="success" onClick={() => {navigate('/saved-students')}}>View bookmarked students</Button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Make a new posting</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="jobOverview">
                                    <Form.Label className="w-100 text-center" style={{ fontSize: '1.3em' }}>Job Overview</Form.Label>
                                    <Form.Control
                                        name="title"
                                        value={formData.title}
                                        type="text"
                                        placeholder="Job Title"
                                        maxLength={50}
                                        onChange={handleChange}
                                        style={{ marginBottom: '1em' }}
                                        required
                                    />
                                    <Form.Control
                                        name="companyName"
                                        value={formData.companyName}
                                        type="text"
                                        placeholder="Company Name"
                                        maxLength={50}
                                        onChange={handleChange}
                                        style={{ marginBottom: '1em' }}
                                        required
                                    />
                                    <Form.Control
                                        name="location"
                                        value={formData.location}
                                        type="text"
                                        placeholder="Location"
                                        maxLength={50}
                                        onChange={handleChange}
                                        style={{ marginBottom: '1em' }}
                                        required
                                    />
                                    <Form.Control
                                        name="address"
                                        value={formData.address}
                                        type="text"
                                        placeholder="Address"
                                        maxLength={50}
                                        onChange={handleChange}
                                        style={{ marginBottom: '1em' }}
                                        required
                                    />
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'left', marginBottom: '0.5em' }}>
                                        <Button variant="success" onClick={() => handleAutoFill()}>Autofill</Button>
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="jobDescription">
                                    <Form.Label className="w-100 text-center" style={{ fontSize: '1.3em', marginBottom: '1em' }}>Job Description</Form.Label>
                                    <div style={{ minHeight: "30vh", maxHeight: "30vh", overflowY: "auto", marginBottom: '1em' }}>
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.jobDescription}
                                            placeholder="Enter detailed job description"
                                            onChange={handleDescriptionChange}
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group className='d-flex flex-wrap mb-2' style={{ justifyContent: 'space-around'}} controlId="tags">
                                    <Form.Label className='w-100 text-center' style={{ fontSize: '1.2rem'}}>Select tags</Form.Label>
                                    {tags.map((tag) => (
                                        <Button
                                            key={tag}
                                            type="button"
                                            variant={formData.selectedTags.includes(tag) ? "success" : "secondary"}
                                            onClick={() => handleTagChange(tag)}
                                        >
                                            {tag}
                                        </Button>
                                    ))}
                                </Form.Group>
                                <Button variant="success" type="submit">Submit Job</Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Card.Body>
            </Card>
        </div>
    )
}

export default EmployerHome;