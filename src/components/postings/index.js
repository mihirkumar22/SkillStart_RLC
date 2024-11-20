import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
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
    const [hideApproved, setHideApproved] = useState(false);
    const [hideUnapproved, setHideUnapproved] = useState(false);
    const [tagsEnabled, setTagsEnabled] = useState([]);

    const { role } = useUserRole();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPostings = async () => {
            setLoading(true);
            try {
                const postingsRef = collection(db, 'postings');
                let q = null;
                if (role === "admin") {
                    q = postingsRef;
                } else {
                    q = query(postingsRef, where('status', "==", "approved"))
                }

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
    }, [role])

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
                        ? { ...p, applicants: [...p.applicants, user.uid] }
                        : p
                )
            )
        }

        setApplyLoading(false);
    }

    const handleApprove = async (posting) => {
        const newStatus = posting.status === "approved" ? "unapproved" : "approved";
        const postingDoc = doc(db, 'postings', posting.id);

        await updateDoc(postingDoc, { status: newStatus });

        setPostings((prev) =>
            prev.map((p) =>
                p.id === posting.id ? { ...p, status: newStatus } : p)
        )
    }

    const handleDelete = async (postingId) => {
        const postingDoc = doc(db, 'postings', postingId);

        await deleteDoc(postingDoc);

        setPostings((prev) =>
            prev.filter((posting) => posting.id !== postingId)
        )
    }

    const toggleVisibility = (type) => {
        if (type === "approved") {
            setHideApproved((prevState) => !prevState);
        }
        if (type === "unapproved") {
            setHideUnapproved((prevState) => !prevState);
        }
    }

    const tags = ["tag 1", "tag 2", "tag 3", "tag 4", "tag 5"]

    const toggleTag = (tag) => {
        if (!tagsEnabled.includes(tag)) {
            setTagsEnabled((prev) => [...prev, tag]);
        } else {
            setTagsEnabled((prev) => prev.filter((t) => t !== tag));
        }
    }

    useEffect(() => {
        console.log(tagsEnabled);
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
        <Card>
            <Card.Body>
                <Card.Header>
                    <NavBar role={role} />
                </Card.Header>
                <Card.Title>Job Postings</Card.Title>
                {tags.map((tag) => (
                    <Button
                        key={tag}
                        variant={tagsEnabled.includes(tag) ? "primary" : "secondary"}
                        onClick={() => { toggleTag(tag) }}
                    >
                        {tag}
                    </Button>
                ))}
                {role === "admin" && (
                    <>
                        <Button onClick={() => toggleVisibility('approved')}>{hideApproved ? "Show Approved Posts" : "Hide Approved Posts"}</Button>
                        <Button onClick={() => toggleVisibility('unapproved')}>{hideUnapproved ? "Show Unapproved Posts" : "Hide Unapproved Posts"}</Button>
                    </>
                )}
                {loading ? (
                    <Card.Text>Loading...</Card.Text>
                ) : postings.length > 0 ? (
                    postings
                        .filter((posting) => posting.isVisible !== false) // Only show visible postings
                        .map((posting) => (
                            (posting.status === "approved" && !hideApproved) ||
                                (posting.status === "unapproved" && !hideUnapproved) ? (
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
                                            {role === "admin" && (
                                                <>
                                                    <Button onClick={() => handleApprove(posting)}>{posting.status === "approved" ? "unapprove" : "approve"}</Button>
                                                    <Button onClick={() => handleDelete(posting.id)} variant="danger">Delete Posting</Button>
                                                </>
                                            )}
                                        </Card.Header>
                                        <Card.Text>
                                            {posting.selectedTags?.length > 0
                                                ? posting.selectedTags.map((tag) => (
                                                    <Button key={tag} variant="info" disabled>
                                                        {tag}
                                                    </Button>
                                                ))
                                                : "No tags"}{" "}
                                            <br />
                                            Location: {posting.location} <br />
                                            Address: {posting.address} <br />
                                            {role === "admin" && <>Status: {posting.status} <br /></>}
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
                            ) : null
                        ))
                ) : (
                    <Card.Text>No postings found</Card.Text>
                )}

            </Card.Body>
        </Card>
    )
}

export default Postings;