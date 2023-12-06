// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import GitHubLogoDark from './assets/github-mark.svg'
import GitHubLogoLight from './assets/github-mark-white.svg'

import CameraRollIcon from './assets/camera-roll-icon.svg'
import FilmMovieIcon from './assets/film-movie-icon.svg'

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
				<div className="nav-bar">
					<img src={CameraRollIcon} alt="Camera Roll Icon" />
					<nav>
						{nav_items.map((item, index) => {
							return (
								<NavLink
									key={index}
									to={item.route}
									onClick={item.onClick}
									className="nav-button">
									{item.name}
								</NavLink>
							)
						})}
					</nav>
					<img src={FilmMovieIcon} alt="Film Movie Icon" />
				</div>

				<main className="main-content">
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
				<footer className="footer">
					<p>Adam Taylor</p>
					<a href="https://github.com/Pocketkid2/startup-react">
						<img src={GitHubLogoDark} alt="GitHub Repository" />
					</a>
				</footer>
			</div>
		</BrowserRouter>
	)
}

export default App
