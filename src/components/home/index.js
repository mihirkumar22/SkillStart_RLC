import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../contexts/UserContext';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EmployerHome from './EmployerHome';
import NavBar from '../navbar';
import StudentHome from "./StudentHome";
import AdminHome from "./AdminHome";
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import background from '../images/tree-bg.png'

function Home() {
    const [userData, setUserData] = useState(null);

    const { user } = useAuth();
    const { role } = useUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            setUserData(userDocSnap.data());
        }
        fetchUserData();
    }, [user, navigate])

    if (!user || !userData) {
        // Show loading message or placeholder until userData is fetched
        return (
            <div>
                <NavBar role={role} />
                <Card style={{ border: 'none' }} className="w-100 vh-100">
                    <Card.Body style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
                        <Card.Text style={{ color: 'white' }}>Loading user data...</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <NavBar role={role} />
            <Card style={{ flex: 1, border: 'none' }}>
                <Card.Body style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
                    <div>
                        {user ? (
                            <>
                                {role === 'employer' && (
                                    <EmployerHome user={{ userData, uid: user.uid, email: user.email }} />
                                )}
                                {role === 'student' && (
                                    <StudentHome user={{ userData, email: user.email }} />
                                )}
                                {role === 'admin' && (
                                    <AdminHome user={userData} />
                                )}
                            </>
                        ) : (
                            <>
                                <Card.Text>Please login to view the home page.</Card.Text>
                                <Button onClick={() => { navigate('/login') }}>Return</Button>
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Home;