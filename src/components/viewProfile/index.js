import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import NavBar from '../navbar';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserRole } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import background from '../images/tree-bg.png'

function ViewProfile() {
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [applicant, setApplicant] = useState(null);
    const [savedStudents, setSavedStudents] = useState(null);
    const [saveStudentLoading, setSaveStudentLoading] = useState(false);

    const { user } = useAuth();
    const { role } = useUserRole();

    useEffect(() => {
        const fetchApplicant = async () => {
            setLoading(true);
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setApplicant(docSnap.data())
            } else {
                console.error("No user found with id:", userId);
            }
            setLoading(false);
        }

        fetchApplicant();
    }, [userId])

    useEffect(() => {
        const fetchSavedStudents = async () => {
            if (role === "employer") {
                setSaveStudentLoading(true);

                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                setSavedStudents(docSnap.data().savedStudents);

                setSaveStudentLoading(false);
            }
        }

        fetchSavedStudents();
    }, [user.uid, role])

    const handleSaveStudent = async (studentId) => {
        setSaveStudentLoading(true);

        const employerDocRef = doc(db, 'users', user.uid);
        const employerDocSnap = await getDoc(employerDocRef);

        if (employerDocSnap.data().savedStudents.includes(studentId)) {
            updateDoc(employerDocRef, { savedStudents: arrayRemove(studentId) })
        } else {
            updateDoc(employerDocRef, { savedStudents: arrayUnion(studentId) })
        }
        setSavedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        )

        setSaveStudentLoading(false);
    }


    if (!applicant) {
        return <Card.Text>No user found</Card.Text>
    }

    if (loading) {
        return <Card.Text>Loading...</Card.Text>
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />
            <Card style={{ flex: 1, border: 'none' }}>
                <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
                    <Card style={{ width: '40vw', minWidth: '300px' }}>
                        <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                            <Card.Text style={{ fontSize: '2em', textAlign: 'center', width: '100%', marginBottom: '0px' }}>
                                {applicant.username} Profile
                            </Card.Text>
                            <Card.Text><strong>Email Address:</strong> {applicant.email}</Card.Text>
                            <Card.Text><strong>Location:</strong> {applicant.location}</Card.Text>
                            <Card.Text><strong>Phone Number:</strong> {applicant.phoneNumber}</Card.Text>
                            {role === "employer" && <Button onClick={() => { handleSaveStudent(userId) }}>{saveStudentLoading ? "Loading..." : savedStudents.includes(userId) ? "Remove Bookmark" : "Bookmark"}</Button>}
                        </Card.Body>
                    </Card>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ViewProfile;