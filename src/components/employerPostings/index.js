import React, { useState, useEffect } from 'react';
import NavBar from '../navbar';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function EmployerPostings() {
    const { user } = useAuth();
    const [ postings, setPostings ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'postings', id));
            setPostings((prev) => prev.filter((posting) => posting.id !== id))
        } catch (err) {
            console.error("error deleting posting", err)
        }
    }
    
    useEffect(() => {
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
    }, [])

    const handleDate = (datePublished) => {
        if (datePublished) {
            const date = new Date(datePublished);
            return format(date, "EEE, MMM dd, yyyy")
        }
        return "Date not available"
    }

    const handleViewApplicants = (posting) => {
        navigate("/employer-postings/applicants", {state : { posting } });
    }

    return (
        <Card>
            <Card.Body>
                <Card.Header>
                    <NavBar role="employer" />
                </Card.Header>
                <Card.Title>Your postings</Card.Title>
                {loading ? (
                    <Card.Text>Loading postings...</Card.Text>
                ) : postings.length > 0 ? (
                        postings.map((posting) => ( 
                            <Card key={posting.id}>
                                <Card.Body>
                                    <Card.Header className="d-flex">
                                        <Card.Title>{posting.title}</Card.Title>
                                        <Button variant="danger" onClick={() => {handleDelete(posting.id)}}>Remove Posting</Button>
                                        <Button onClick={() => handleViewApplicants(posting)}>View Applicants</Button>
                                    </Card.Header>
                                    <Card.Text>
                                        Location: {posting.location} <br />
                                        Address: {posting.address} <br />
                                        Status: {posting.status} <br />
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            <h5>Description:</h5>
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
                        ))
                    ) : (
                        <Card.Text>No postings found</Card.Text>
                    )
                }
            </Card.Body>
        </Card>
    )
}

export default EmployerPostings;