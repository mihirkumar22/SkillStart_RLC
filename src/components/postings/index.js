import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from "../../firebase";
import NavBar from "../navbar";
import { useUserRole } from '../../contexts/UserContext';
import ReactQuill from "react-quill";
import { format } from "date-fns"
import { useAuth } from '../../contexts/AuthContext';

function Postings() {
    const [loading, setLoading] = useState(false);
    const [postings, setPostings] = useState([]);
    const [applyLoading, setApplyLoading] = useState(false);

    const { role } = useUserRole();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPostings = async () => {
            setLoading(true);
            try {
                const postingsRef = collection(db, 'postings');
                const q = query(postingsRef, where('status', "==", "approved"))
                const querySnapshot = await getDocs(q);

                const postings = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setPostings(postings);
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
            const date = new Date(datePublished)
            return format(date, "EEE, MMM dd, yyyy")
        }
        return "Date not available"
    }

    const handleApply = async (posting) => {
        const postingDoc = doc(db, 'postings', posting.id)
        
        setApplyLoading(true);
        
        if (posting.applicants.includes(user.uid)) {
            await updateDoc(postingDoc, { applicants: arrayRemove(user.uid) });
            
            setPostings((prev) =>
                prev.map((p) =>
                    p.id === posting.id
                        ? { ...p, applicants: p.applicants.filter((id) => id !== user.uid) }
                        : p
                )
            )
        } else {
            await updateDoc(postingDoc, { applicants: arrayUnion(user.uid) });
            
            setPostings((prev) =>
                prev.map((p) =>
                    p.id === posting.id
                        ? { ...p, applicants: [p.applicants, user.uid] }
                        : p
                )
            )
        }

        setApplyLoading(false);
    }

    return (
        <Card>
            <Card.Body>
                <Card.Header>
                    <NavBar role={role} />
                </Card.Header>
                <Card.Title>Job Postings</Card.Title>
                {loading ? (
                    <Card.Text>Loading...</Card.Text>
                ) : postings.length > 0 ? (
                    postings.map((posting) => (
                        <Card key={posting.id}>
                            <Card.Body>
                                <Card.Header className="d-flex">
                                    <Card.Title>{posting.title}</Card.Title>
                                    {role === "student" && (
                                        <Button
                                            disabled={applyLoading}
                                            onClick={() => handleApply(posting)}
                                        >
                                            {applyLoading ? "Loading..." : posting.applicants.includes(user.uid) ? "Unapply" : "Apply"}
                                        </Button>
                                    )}
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

export default Postings;