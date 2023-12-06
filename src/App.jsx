// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import './App.css'

import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';

function Home() {
	return (
		<div>
			<h1>Home Component</h1>
		</div>
	);
}

function Search() {
	return (
		<div>
			<h1>Search Component</h1>
		</div>
	);
}

function Chat() {
	return (
		<div>
			<h1>Chat Component</h1>
		</div>
	);
}

function Profile() {
	return (
		<div>
			<h1>Profile Component</h1>
		</div>
	);
}

function Login() {
	return (
		<div>
			<h1>Login Component</h1>
		</div>
	);
}

function Signup() {
	return (
		<div>
			<h1>Signup Component</h1>
		</div>
	);
}

function App() {
	const nav_items = [
		{ name: 'Home', route: '/' },
		{ name: 'Search', route: '/search' },
		{ name: 'Chat', route: '/chat' },
		{ name: 'Profile', route: '/profile' },
		{ name: 'Login', route: '/login' },
		{ name: 'Signup', route: '/signup' },
		{ name: 'Logout', route: '/logout', onClick: handleLogout }
	];

	function handleLogout(event) {
		event.preventDefault();
		console.log('Logout');
		alert('Logout triggered');
	}

	return (
		<BrowserRouter>
			<div className="app">
				<nav>
					{nav_items.map((item, index) => {
						return (
							<NavLink
								key={index}
								to={item.route}
								onClick={item.onClick}>
								{item.name}
							</NavLink>
						)
					})}
				</nav>
				<main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/search" element={<Search />} />
						<Route path="/chat" element={<Chat />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
				<footer>
					Footer
				</footer>
			</div>
		</BrowserRouter>
	)
}

export default App
