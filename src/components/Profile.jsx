import React from 'react';

import './Profile.css'

export default function Profile() {
	const [favorites, set_favorites] = React.useState([]);
	const [watchlist, set_watchlist] = React.useState([]);

	async function get_list(list_name) {
		const response = await fetch(`/api/list/${list_name}`, {
			method: 'GET',
		});
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			const error_msg = await response.text();
			console.log('Error: ' + response.status, error_msg);
		}
	}

	async function remove_list_item(list_name, movie) {
		const response = await fetch(`/api/remove/${list_name}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ film: movie }),
		});
		if (!response.ok) {
			const error_msg = await response.text();
			console.log('Error: ' + response.status, error_msg);
		}
	}

	React.useEffect(() => {
		get_list('favorites').then((data) => set_favorites(data));
		get_list('watchlist').then((data) => set_watchlist(data));
	}, []);

	function List({ title, data, set_data }) {
		return (
			<div className="profile-section component-layer-2">
				<h2>{title} ({data.length})</h2>
				<ul>
					{
						data.map((movie) => {
							return (
								<li key={movie}>
									{movie}
									<button
										onClick={() => {
											set_data(data.filter((m) => m !== movie));
											remove_list_item(title.toLowerCase(), movie);
										}}
									>
										X
									</button>
								</li>
							);
						})
					}
				</ul>
			</div>
		)
	}

	return (
		<div className="profile component-layer-1">
			<h1>Profile</h1>
			<List title="Favorites" data={favorites} set_data={set_favorites} />
			<List title="Watchlist" data={watchlist} set_data={set_watchlist} />
		</div>
	);
}
