import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import firebase from '../utils/firebase';

export const Navbar = () => {
	const { isAuthenticated, handleSignIn } = useAuth();
	const handleSignOut = () => firebase.auth().signOut();

	return (
		<nav className='navbar'>
			<Link to='/'>Tic Tac Toe</Link>
			<div>
				{isAuthenticated ? (
					<button onClick={handleSignOut}>Sign out</button>
				) : (
					<>
						<button
							onClick={handleSignIn}
							style={{ marginRight: 10 }}
						>
							Sign Up
						</button>
						<button className='button-primary' onClick={handleSignIn}>
							Sign In
						</button>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
