import React, { useEffect, useState } from "react";
import { Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../../contexts/UserContext";
import styles from "./nav.module.css";
import BGlogo from '../images/SkillStartLogoBG.png.png';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function NavBar() {
    const navigate = useNavigate();
    const { role } = useUserRole();
    const [userData, setUserData] = useState(null);
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        if (user) {
            fetchUserData();
        }
    }, [user]); // Add user as a dependency to avoid unnecessary re-fetches

    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.logocontainer}>
                    <img src={BGlogo} className={styles.logo} alt="Example" />
                </div>

                <div className={styles.navdiv}>
                    <Button className={styles.navOption} onClick={() => navigate('/home')}>Home</Button>
                </div>

                <Button className={styles.navOption} onClick={() => navigate('/postings')}>Postings</Button>
                {role === "employer" && (
                    <>
                        <div className={styles.navdiv}>
                            <Button className={styles.navOption} onClick={() => navigate('/employer-postings')}>Your postings</Button>
                        </div>
                        <div className={styles.navdiv}>
                            <Button className={styles.navOption} onClick={() => navigate('/saved-students')}>Bookmarked Students</Button>
                        </div>
                    </>
                )}

                    <Dropdown>
                        <Dropdown.Toggle className={styles.navOption} id="dropdown-basic">
                            {userData?.companyName || user?.email || "Guest"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {role !== 'admin' && <Dropdown.Item onClick={() => navigate('/profile')}>Profile</Dropdown.Item> }
                            <Dropdown.Item onClick={() => {logout(); navigate('/login')}}>Log Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
            </div>
        </>
    );
}

export default NavBar;
