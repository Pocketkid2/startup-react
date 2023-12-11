import React from 'react';

import './Search.css'

import api_keys from '../api_keys.json';

export default function Search() {
	const [search_results, set_search_results] = React.useState([]);
	const [search_term, set_search_term] = React.useState('');

	const [runtime_min, set_runtime_min] = React.useState('');
	const [runtime_max, set_runtime_max] = React.useState('');

	const [rating_G, set_rating_G] = React.useState(true);
	const [rating_PG, set_rating_PG] = React.useState(true);
	const [rating_PG13, set_rating_PG13] = React.useState(true);
	const [rating_R, set_rating_R] = React.useState(true);

	const [year_min, set_year_min] = React.useState('');
	const [year_max, set_year_max] = React.useState('');

	const [sort_field, set_sort_field] = React.useState('title');
	const [sort_order, set_sort_order] = React.useState('asc');

	function load_search_results(id_list) {
		id_list.map(async (id) => {
			const response = await fetch(`https://www.omdbapi.com/?apikey=${api_keys.OMDB}&i=${id}`);

			if (response.ok) {
				const data = await response.json();

				set_search_results(search_results => [...search_results, {
					title: data.Title,
					year: data.Year,
					runtime: data.Runtime,
					rating: data.Rated,
					director: data.Director
				}]);
			} else {
				console.log('Error: ' + response.status, response.statusText);
			}
		});
	}

	async function handleSubmit(event) {
		event.preventDefault();
		set_search_results([]);
		const query = encodeURIComponent(search_term);
		const response = await fetch(`https://www.omdbapi.com/?apikey=${api_keys.OMDB}&type=movie&s=${query}`);
		if (response.ok) {
			const data = await response.json();
			if (data.Response === 'False') {
				return;
			}
			const id_list = data.Search.map(result => result.imdbID);
			load_search_results(id_list);
		} else {
			console.log('Error: ' + response.status, response.statusText);
		}
	}

	function handleNumericInputChange(event, set_state) {
		const value = event.target.value;
		if (!isNaN(value)) {
			set_state(value);
		}
	}

	return (
		<div className="search-tool">
			<div className="search-bar">
				<form onSubmit={handleSubmit}>
					<input type="text" placeholder="film title" value={search_term} onChange={(event) => set_search_term(event.target.value)} />
					<button type="submit">Search</button>
				</form>
			</div>
			<div className="search-filter">
				<h2>Filter</h2>
				<form>
					<div className="search-filter-numerical-inputs">
						<fieldset>
							<legend>Runtime</legend>
							<div>
								<label htmlFor="runtime-min">min</label>
								<input type="text" id="runtime-min" placeholder="" value={runtime_min} onChange={(event) => handleNumericInputChange(event, set_runtime_min)} />
							</div>
							<div>
								<label htmlFor="runtime-max">max</label>
								<input type="text" id="runtime-max" placeholder="" value={runtime_max} onChange={(event) => handleNumericInputChange(event, set_runtime_max)} />
							</div>
						</fieldset>
						<fieldset>
							<legend>Year</legend>
							<div>
								<label htmlFor="year-min">min</label>
								<input type="text" id="year-min" placeholder="" value={year_min} onChange={(event) => handleNumericInputChange(event, set_year_min)} />
							</div>
							<div>
								<label htmlFor="year-max">max</label>
								<input type="text" id="year-max" placeholder="" value={year_max} onChange={(event) => handleNumericInputChange(event, set_year_max)} />
							</div>
						</fieldset>
					</div>
					<fieldset>
						<legend>Rating</legend>
						{
							[{ name: 'G', value: rating_G, change: () => set_rating_G(!rating_G) },
							{ name: 'PG', value: rating_PG, change: () => set_rating_PG(!rating_PG) },
							{ name: 'PG-13', value: rating_PG13, change: () => set_rating_PG13(!rating_PG13) },
							{ name: 'R', value: rating_R, change: () => set_rating_R(!rating_R) }]
								.map((rating) => {
									return (
										<React.Fragment key={rating.name}>
											<input type="checkbox" id={rating.name} name={rating.name} value={rating.name} checked={rating.value} onChange={rating.change} />
											<label htmlFor={rating.name}>{rating.name}</label>
										</React.Fragment>
									);
								})
						}
					</fieldset>
				</form>
			</div>
			<div className="search-results">
				<h2>Results</h2>
				<table>
					<thead>
						<tr>
							{
								[{ field: 'title', label: 'Title' },
								{ field: 'year', label: 'Year' },
								{ field: 'runtime', label: 'Runtime' },
								{ field: 'rating', label: 'Rating' },
								{ field: 'director', label: 'Director' }].map((column) => {
									return (
										<th key={column.field}>
											<button onClick={() => {
												if (sort_field === column.field) {
													if (sort_order === 'asc') {
														set_sort_order('desc');
													} else {
														set_sort_order('asc');
													}
												} else {
													set_sort_field(column.field);
												}
											}}>
												{column.label}
												{' '}
												{
													sort_field === column.field &&
													(sort_order === 'asc' ? '▲' : '▼')
												}
											</button>
										</th>
									);
								})
							}
						</tr>
					</thead>
					<tbody>
						{
							search_results.filter((result) => {
								const runtime = parseInt(result.runtime.split(' ')[0]);
								const rating = result.rating;
								const year = parseInt(result.year);
								return (
									(runtime_min === 0 || runtime_min === '' || runtime >= runtime_min) &&
									(runtime_max === 0 || runtime_max === '' || runtime <= runtime_max) &&
									(rating_G || rating_PG || rating_PG13 || rating_R) &&
									(rating_G && rating === 'G' ||
										rating_PG && rating === 'PG' ||
										rating_PG13 && rating === 'PG-13' ||
										rating_R && rating === 'R') &&
									(year_min === 0 || year_min === '' || year >= year_min) &&
									(year_max === 0 || year_max === '' || year <= year_max)
								);
							}).sort((a, b) => {
								if (sort_order === 'asc') {
									return b[sort_field].localeCompare(a[sort_field])
								} else if (sort_order === 'desc') {
									return a[sort_field].localeCompare(b[sort_field])
								} else {
									return 0;
								}
							}).map((result, index) => {
								return (
									<tr key={index}>
										<td>{result.title}</td>
										<td>{result.year}</td>
										<td>{result.runtime}</td>
										<td>{result.rating}</td>
										<td>{result.director}</td>
									</tr>
								);
							})
						}
					</tbody>
				</table>
			</div>
		</div>
	);
}
