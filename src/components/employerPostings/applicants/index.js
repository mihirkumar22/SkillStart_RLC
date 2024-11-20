import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import NavBar from '../../navbar';
import { useLocation, Link } from 'react-router-dom';
import { format } from 'date-fns'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

function Applicants() {
    const location = useLocation();
    const posting = location.state?.posting;

    const [applicantsData, setApplicantsData] = useState([]);

    const handleDate = (datePublished) => {
        if (datePublished) {
            const date = new Date(datePublished);
            return format(date, "EEE, MMM dd, yyyy")
        }
        return "Date not available"
    }

    useEffect(() => {
        const fetchApplicants = async () => {
            if (!posting.applicants || posting.applicants.length === 0) {
                return;
            }
            try {
                const applicants = await Promise.all(
                    posting.applicants.map(async (uid) => {
                        const userDoc = doc(db, 'users', uid);
                        const userSnapshot = await getDoc(userDoc);
                        if (userSnapshot.exists()) {
                            return { id: uid, ...userSnapshot.data() }
                        }
                    })
                )
                setApplicantsData(applicants);
            } catch (error) {
                console.error("error fetching applicants data:", error)
            }
        }

        fetchApplicants()
    }, [posting])

    return (
        <Card>
            <Card.Body>
                <Card.Header>
                    <NavBar role="employer" />
                </Card.Header>
                <Card.Title>Applicants for: {posting.title}</Card.Title>
                <Card.Text>Location: {posting.location}</Card.Text>
                <Card.Text>Address: {posting.address}</Card.Text>
                <Card.Text>Status: {posting.location}</Card.Text>
                <Card.Text>Date Published: {handleDate(posting.datePublished)}</Card.Text>
                <Card.Text>
                    Applicants: <br />
                    {applicantsData.length > 0 ? (
                        applicantsData.map((applicant, index) => 
                        <Card.Text key={index}>
                            <Link
                                to={`/view-profile/${applicant.id}`}
                            >
                                {applicant.username}
                            </Link>
                        </Card.Text>)
                    ) : (
                        <Card.Text>No applicants found</Card.Text>
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Applicants;