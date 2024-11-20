import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import NavBar from '../navbar';

function SavedStudents() {
    const [savedStudentsIds, setSavedStudentsIds] = useState([]);
    const [savedStudentsNames, setSavedStudentsNames] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            return <Card.Text>Loading user data...</Card.Text>;
        }

        const fetchSavedStudents = async () => {
            setLoading(true);

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            const savedStudents = docSnap.data().savedStudents || [];

            setSavedStudentsIds(savedStudents);

            const names = await Promise.all(savedStudents.map(async (studentId) => {
                const studentDocRef = doc(db, 'users', studentId);
                const studentDocSnap = await getDoc(studentDocRef);
                return studentDocSnap.data()?.username || "Unknown user";
            }))

            setSavedStudentsNames(names)
            setLoading(false);
        }

        fetchSavedStudents();
    }, [user.uid, user])

    return (
        <Card>
            <Card.Body>
                <Card.Header>
                    <NavBar />
                </Card.Header>
                <Card.Title>Saved students</Card.Title>
                {loading
                    ? <Card.Text>Loading...</Card.Text>
                    : savedStudentsIds.length > 0 ? (
                        savedStudentsIds.map((student, index) => (
                            <Card.Text key={index}>
                                <Link key={index} to={`/view-profile/${student}`}>
                                    {savedStudentsNames[index] || "Unknown user"}
                                </Link>
                            </Card.Text>
                        ))
                    ) : (
                        <Card.Text>No saved students found.</Card.Text>
                    )
                }
            </Card.Body>
        </Card>
    )
}

export default SavedStudents;