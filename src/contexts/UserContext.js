import React, {createContext, useContext, useState, useEffect} from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const UserRoleContext = createContext();

export function useUserRole() {
    return useContext(UserRoleContext);
}

export function UserRoleProvider({ children }) {
    const [role, setRole] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchRole = async () => {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                } else {
                    setRole(null);
                }
            }

            fetchRole();
        } else {
            setRole(null);
        }
    }, [user])

    const value = {
        role
    }

    return (
        <UserRoleContext.Provider value={value}>
            {children}
        </UserRoleContext.Provider>
    )
}

export default UserRoleProvider;