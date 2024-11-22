import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import NavBar from '../../navbar';
import { useLocation, Link } from 'react-router-dom';
import { format } from 'date-fns'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import background from '../../images/tree-bg.png'

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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar role="employer" />
            <Card style={{ flex: 1, border: 'none' }}>
                <Card.Body className='d-flex align-items-center flex-column' style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
                    <Card style={{ height: '70vh', width: '40vw', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Card.Text style={{ margin: '.3em',fontSize: '2em', textAlign: 'center', width: '100%', marginBottom: '0px', alignContent: 'left'}}>
                            <strong>Applicants for: {posting.title}</strong>
                        </Card.Text>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                            <p><strong>Location:</strong> {posting.location}</p> <br />
                            <p><strong>Address:</strong> {posting.address}</p> <br />
                            <p><strong>Status:</strong> {posting.location}</p> <br />
                            <p><strong>Date Published:</strong> {handleDate(posting.datePublished)}</p> <br />
                        </div>
                        <Card.Text>
                            <strong>Applicants:</strong> <br />
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
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
                            </div>
                        </Card.Text>
                    </Card>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Applicants;