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

function Home() {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    const { user, logout } = useAuth();
    const { role } = useUserRole();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            setUserData(userDocSnap.data());
        }
        fetchUserData();
    }, [user])


    async function handleLogout(e) {
        e.preventDefault();

        setLoading(true);

        await logout();
        navigate('/login')

        setLoading(false);
    }

    if (!user || !userData) {
        // Show loading message or placeholder until userData is fetched
        return (
            <Card className="w-100 vh-100">
                <Card.Header>
                    <NavBar role={role} />
                </Card.Header>
                <Card.Body>
                    <Card.Text>Loading user data...</Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="w-100 vh-100">
            <Card.Body>
                <Card.Header>
                    <NavBar role={role} />
                </Card.Header>
                <div>
                    {user ? (
                        <>
                            {role === 'employer' && (
                                <EmployerHome user={{ userData, uid: user.uid }} />
                            )}
                            {role === 'student' && (
                                <StudentHome user={userData} />
                            )}
                            {role === 'admin' && (
                                <AdminHome user={userData} />
                            )}
                            <Button disabled={loading} onClick={handleLogout}>{loading ? "Logging Out..." : "Log Out"}</Button>
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
    )
}

export default Home;