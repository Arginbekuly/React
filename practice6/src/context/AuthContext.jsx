import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from "firebase/auth";


import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    async function runAuth(action) {
        setError(null);
        setBusy(true);

        try {
            return await action();
        } catch (err) {
            setError(err.code || err.message);
            throw err;
        } finally {
            setBusy(false);
        }
    }

    function signup(email, password) {
        return runAuth(() =>
            createUserWithEmailAndPassword(auth, email, password)
        );
    }

    function login(email, password) {
        return runAuth(() =>
            signInWithEmailAndPassword(auth, email, password)
        );
    }


    function loginWithGoogle() {
        const provider = new GoogleAuthProvider();

        return runAuth(() => signInWithPopup(auth, provider));
    }

    function logout() {
        return runAuth(() => signOut(auth));
    }

    const value = {
        user,
        loading,
        busy,
        error,
        signup,
        login,
        loginWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
