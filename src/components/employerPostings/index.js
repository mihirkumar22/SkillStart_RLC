import React, { useState, useEffect } from 'react';
import NavBar from '../navbar';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import background from '../images/tree-bg.png';
import { FaTrash } from 'react-icons/fa';


function EmployerPostings() {
    const { user } = useAuth();
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hideApproved, setHideApproved] = useState(false);
    const [hideUnapproved, setHideUnapproved] = useState(false);
    const [tagsEnabled, setTagsEnabled] = useState([]);

    const navigate = useNavigate();

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this posting?");
        if (!confirmDelete) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'postings', id));
            setPostings((prev) => prev.filter((posting) => posting.id !== id))
        } catch (err) {
            console.error("error deleting posting", err)
        }
    }

    useEffect(() => {
        if (!user) {
            return <Card.Text>Loading user data...</Card.Text>;
        }

        const fetchPostings = async () => {
            setLoading(true);
            try {
                const postingsRef = collection(db, 'postings');
                const q = query(postingsRef, where('uid', "==", user.uid));
                const querySnapshot = await getDocs(q);

                const userPostings = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setPostings(userPostings)
            } catch (err) {
                console.error('error fetching postings', err)
            } finally {
                setLoading(false);
            }
        }

        fetchPostings();
    }, [user, user.uid])

    const handleDate = (datePublished) => {
        if (datePublished) {
            const date = new Date(datePublished);
            return format(date, "EEE, MMM dd, yyyy")
        }
        return "Date not available"
    }

    const handleViewApplicants = (posting) => {
        navigate("/employer-postings/applicants", { state: { posting } });
    }

    const toggleVisibility = (type) => {
        if (type === "approved") {
            setHideApproved((prevState) => !prevState);
        }
        if (type === "unapproved") {
            setHideUnapproved((prevState) => !prevState);
        }
    }

    const tags = ["Retail", "Fast Food", "Tech", "Volunteer", "Office Work", "Part-time", "Weekend Work", "Afterschool"]

    const toggleTag = (tag) => {
        if (!tagsEnabled.includes(tag)) {
            setTagsEnabled((prev) => [...prev, tag]);
        } else {
            setTagsEnabled((prev) => prev.filter((t) => t !== tag));
        }
    }

    useEffect(() => {
        setPostings((prev) =>
            prev.map((posting) => ({
                ...posting,
                isVisible: tagsEnabled.length === 0
                    ? true
                    : posting.selectedTags?.some((tag) => tagsEnabled.includes(tag)) || false
            }))
        )
    }, [tagsEnabled]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar role="employer" />
            <Card style={{ flex: 1, border: 'none' }}>
                <Card.Body className='d-flex align-items-center flex-column' style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>  
                    <Card.Title style={{ marginTop: '0.1em', fontSize: '2em', color: 'white' }}>Your postings</Card.Title>
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1em' }}>
                        {tags.map((tag) => (
                            <Button
                                key={tag}
                                variant={tagsEnabled.includes(tag) ? "success" : "secondary"}
                                onClick={() => { toggleTag(tag) }}
                                style={{ marginLeft: '0.5em', marginRight: '0.5em' }}
                            >
                                {tag}
                            </Button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1em' }}>
                        <Button style={{ marginLeft: '0.5em', marginRight: '0.5em' }} onClick={() => toggleVisibility('approved')}>{hideApproved ? "Show Approved Posts" : "Hide Approved Posts"}</Button>
                        <Button style={{ marginLeft: '0.5em', marginRight: '0.5em' }} onClick={() => toggleVisibility('unapproved')}>{hideUnapproved ? "Show Unapproved Posts" : "Hide Unapproved Posts"}</Button>
                    </div>
                    {loading ? (
                        <Card.Text>Loading postings...</Card.Text>
                    ) : postings.length > 0 ? (
                        postings
                            .filter((posting) => posting.isVisible !== false)
                            .map((posting) => (
                                (posting.status === "approved" && !hideApproved) ||
                                    (posting.status === "unapproved" && !hideUnapproved) ? (
                                    <Card style={{ minWidth: '400px', borderWidth: '2px', width: '50vw', marginBottom: '2em' }} key={posting.id}>
                                        <Card.Body>
                                            <Card.Header className="d-flex align-items-center">
                                                <Card.Title style={{ flex: 1 }}><strong>{posting.title}</strong></Card.Title>
                                                <Button style={{ marginRight: 4 }} onClick={() => { handleViewApplicants(posting) }} varaint='success'>View Applicants</Button>
                                                <Button style={{ marginRight: 0 }} onClick={() => { handleDelete(posting.id) }} variant='danger'><FaTrash /></Button>
                                            </Card.Header>
                                            <Card.Text>
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginBottom: '0.5em', marginTop: '1em' }}>
                                                    {posting.selectedTags?.length > 0
                                                        ? posting.selectedTags.map((tag) => (
                                                            <Button style={{ marginRight: '1em' }} key={tag} variant="success" disabled>
                                                                {tag}
                                                            </Button>
                                                        ))
                                                        : "No tags"}{" "}
                                                </div>
                                                <strong>Location:</strong> {posting.location} <br />
                                                <strong>Address:</strong> {posting.address} <br />
                                                <strong>Status:</strong> {posting.status} <br />
                                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                    <Card.Text style={{ marginBottom: '0.5em' }}><strong>Description:</strong></Card.Text>
                                                    <ReactQuill
                                                        value={posting.jobDescription}
                                                        readOnly
                                                        theme="snow"
                                                        modules={{ toolbar: false }}
                                                    />
                                                </div>
                                                Date Published: {handleDate(posting.datePublished)}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ) : null
                            ))
                    ) : (
                        <Card.Text style={{ color: 'white' }}>No postings found</Card.Text>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default EmployerPostings;