import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import NavBar from '../navbar';
import background from '../images/tree-bg.png';

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
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar />
            <Card style={{ flex: 1, border: 'none' }}>
                <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
                    <Card style={{ width: '40vw' }}>
                        <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                            <Card.Text style={{ fontSize: '2em', textAlign: 'center', width: '100%', marginBottom: '0px' }}>
                                Bookmarked Students:
                            </Card.Text>
                        </Card.Body>
                        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {loading
                                ? <Card.Text>Loading...</Card.Text>
                                : savedStudentsIds.length > 0 ? (
                                    savedStudentsIds.map((student, index) => (
                                        <>
                                            <Card.Text style={{ marginBottom: '8px' }} key={index}>
                                                <Link key={index} to={`/view-profile/${student}`}>
                                                    {savedStudentsNames[index] || "Unknown user"}
                                                </Link>
                                            </Card.Text>
                                        </>
                                    ))
                                ) : (
                                    <Card.Text>No saved students found.</Card.Text>
                                )
                            }
                        </div>
                    </Card>
                </Card.Body>
            </Card>
        </div>
    )
}

export default SavedStudents;