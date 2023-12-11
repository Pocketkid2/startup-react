import React from 'react';

import './Search.css'

import api_keys from '../api_keys.json';

export default function Search() {
	const [search_results, set_search_results] = React.useState([]);
	const [search_term, set_search_term] = React.useState('');

	function load_search_results(id_list) {
		id_list.map(async (id) => {
			const response = await fetch(`https://www.omdbapi.com/?apikey=${api_keys.OMDB}&i=${id}`);

			if (response.ok) {
				const data = await response.json();

				console.log(data);

				set_search_results(search_results => [...search_results, {
					title: data.Title,
					year: data.Year,
					runtime: data.Runtime,
					rating: data.Rated
				}]);
			} else {
				console.log('Error: ' + response.status, response.statusText);
			}
		});
	}

	async function handleSubmit(event) {
		event.preventDefault();

		const query = encodeURIComponent(search_term);

		const response = await fetch(`https://www.omdbapi.com/?apikey=${api_keys.OMDB}&type=movie&s=${query}`);

		if (response.ok) {
			const data = await response.json();

			console.log(data);

			const id_list = data.Search.map(result => result.imdbID);

			console.log(JSON.stringify(id_list));

			load_search_results(id_list);
		} else {
			console.log('Error: ' + response.status, response.statusText);
		}


	}

	function handleSearchBarChange(event) {
		set_search_term(event.target.value);
	}

	return (
		<div className="search-tool">
			<div className="search-bar">
				<form onSubmit={handleSubmit}>
					<input type="text" placeholder="Search" value={search_term} onChange={handleSearchBarChange} />
					<button type="submit">Search</button>
				</form>
			</div>
			<div className="search-filter">
				<form>
					<label>Runtime</label>
					<input type="text" placeholder="min" />
					<input type="text" placeholder="max" />

					<label>Rating</label>
					<input type="checkbox" id="G" name="G" value="G" />
					<input type="checkbox" id="PG" name="PG" value="PG" />
					<input type="checkbox" id="PG-13" name="PG-13" value="PG-13" />
					<input type="checkbox" id="R" name="R" value="R" />

					<label>Year</label>
					<input type="year" placeholder="min" />
					<input type="year" placeholder="max" />
				</form>
			</div>
			<div className="search-results">
				<table>
					{
						search_results.map((result, index) => {
							return (
								<tr key={index}>
									<td>{result.title}</td>
									<td>{result.year}</td>
									<td>{result.runtime}</td>
									<td>{result.rating}</td>
								</tr>
							);
						})
					}
				</table>
			</div>
		</div>
	);
}
