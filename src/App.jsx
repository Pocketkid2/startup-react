import GitHubLogoDark from './assets/github-mark.svg'
import GitHubLogoLight from './assets/github-mark-white.svg'

import CameraRollIcon from './assets/camera-roll-icon.svg'
import FilmMovieIcon from './assets/film-movie-icon.svg'

import './App.css'

import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import React from 'react';

import SimpleForm from './components/SimpleForm';
import Search from './components/Search'
import Home from './components/Home'
import Profile from './components/Profile'
import Chat from './components/Chat'

function App() {
	const [is_logged_in, set_is_logged_in] = React.useState(false);
	const navigate = useNavigate();

	React.useEffect(() => {
		// Check if the user is logged in
		async function check_login_status() {
			const response = await fetch('/auth/login', {
				method: 'POST'
			});
			if (response.ok) {
				set_is_logged_in(true);
			}
		}

		check_login_status();
	}, []);

	// Remove authentication token
	async function handleLogout(event) {
		event.preventDefault();
		const response = await fetch('/auth/logout', {
			method: 'DELETE'
		});
		if (response.ok) {
			set_is_logged_in(false);
		} else {
			const response_body = await response.text();
			console.log('Error: ' + response.status, response_body);
		}
		navigate('/');
	}

	// Submit the username and password to the backend
	async function authenticate(form, create_new_user) {
		console.log(JSON.stringify(form));
		let response;
		if (create_new_user) {
			response = await fetch('/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form),
			});
		} else {
			response = await fetch('/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form),
			});
		}
		if (response.ok) {
			set_is_logged_in(true);
			navigate('/profile');
		} else {
			const response_body = await response.text();
			console.log('Error: ' + response.status, response_body);
		}
	}

	// Return which navigation items should be visible
	function get_nav_items(authenticated) {
		const nav_items = [
			{ name: 'Home', route: '/' },
			{ name: 'Search', route: '/search' },
		];
		if (authenticated) {
			return nav_items.concat([
				{ name: 'Chat', route: '/chat' },
				{ name: 'Profile', route: '/profile' },
				{ name: 'Logout', route: '/logout', onClick: handleLogout }
			]);
		} else {
			return nav_items.concat([
				{ name: 'Login', route: '/login' },
				{ name: 'Signup', route: '/signup' },
			]);
		}
	}

	function GitHubLogo() {
		const [is_dark_mode, set_is_dark_mode] = React.useState(
			window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
		);

		React.useEffect(() => {
			const matcher = window.matchMedia('(prefers-color-scheme: dark)');
			const on_change = () => set_is_dark_mode(matcher.matches);

			matcher.addEventListener('change', on_change);

			return () => {
				matcher.removeEventListener('change', on_change);
			};
		}, []);

		return is_dark_mode ? (
			<a href="https://github.com/Pocketkid2/startup-react">
				<img src={GitHubLogoLight} alt="GitHub Repository" />
			</a>
		) : (
			<a href="https://github.com/Pocketkid2/startup-react">
				<img src={GitHubLogoDark} alt="GitHub Repository" />
			</a>
		);
	}

	return (

		<div className="app">
			<div className="nav-bar">
				<img src={CameraRollIcon} alt="Camera Roll Icon" />
				<nav>
					{get_nav_items(is_logged_in).map((item, index) => {
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
					<Route path="/search" element={<Search is_logged_in={is_logged_in}/>} />
					<Route path="/chat" element={<Chat />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/login" element={<SimpleForm form_name="Login" process_submit={(event) => authenticate(event, false)} />} />
					<Route path="/signup" element={<SimpleForm form_name="Signup" process_submit={(event) => authenticate(event, true)} />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
			<footer className="footer">
				<p>Adam Taylor</p>
				<GitHubLogo />
			</footer>
		</div>
	)
}

export default App
