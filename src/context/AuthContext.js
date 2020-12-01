import { useEffect, useState, createContext, useContext } from 'react';
import firebase from '../utils/firebase';
import Loading from '../components/Loading';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const isAuthenticated = !!user;

	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false);
		});
	}, []);

	const handleSignIn = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase
			.auth()
			.signInWithPopup(provider)
			.then((res) => setUser(res.user))
			.catch((error) => console.log(error.message));
	};

	if (loading) return <Loading />;

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, handleSignIn }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;