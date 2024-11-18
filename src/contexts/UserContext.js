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
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchRole = async () => {
                const userRef = doc(db, 'users', user.uid);
                
                setLoading(true);
                
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setRole(userDoc.data().role);
                } else {
                    setRole(null);
                }

                setLoading(false);
            }

            fetchRole();
        } else {
            setRole(null);
        }
    }, [user])

    const value = {
        role, 
        loading
    }

    return (
        <UserRoleContext.Provider value={value}>
            {children}
        </UserRoleContext.Provider>
    )
}

export default UserRoleProvider;