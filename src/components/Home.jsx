import React from 'react';

import './Home.css';

import api_keys from '../api_keys.json';

const curated_data = [
	{
		header: 'Upcoming films',
		ids: [
			'tt14998742',	// Rebel Moon
			'tt9663764',	// Aquaman and the Lost Kingdom
			'tt6495056',	// Migration
			'tt15239678',	// Dune Part Two
			'tt11389872',	// Kingdom of the Planet of the Apes
		],
		links: [
			'https://youtu.be/fhr3MzT6exg?si=FDxSCaSXxZVzFQEp',
			'https://youtu.be/FV3bqvOHRQo?si=KSnglk1rpXg-yYMY',
			'https://youtu.be/cQfo0HJhCnE?si=GKHT10wY6cjfmGCj',
			'https://youtu.be/Way9Dexny3w?si=6JUTJ_byMyQocPYJ',
			'https://youtu.be/NQ_HvTBaFoo?si=oPPFtbJDjaXLzkp5',
		],
		descriptor: 'Released'
	},
	{
		header: 'Recent Reviews',
		ids: [
			'tt5537002',	// Killers of the Flower Moon
			'tt13238346',	// Past Lives
			'tt16968450',	// The Wonderful Story of Henry Sugar
			'tt9603212',	// Mission Impoossible Dead Reckoning Part One
			'tt9362722',	// Across the Spider-verse
		],
		links: [
			'https://www.rottentomatoes.com/m/killers_of_the_flower_moon',
			'https://www.rottentomatoes.com/m/past_lives',
			'https://www.rottentomatoes.com/m/the_wonderful_story_of_henry_sugar',
			'https://www.rottentomatoes.com/m/mission_impossible_dead_reckoning_part_one',
			'https://www.rottentomatoes.com/m/spider_man_across_the_spider_verse',
		],
		descriptor: 'imdbRating'
	},
	{
		header: 'Box Office Hits',
		ids: [
			'tt1517268',	// Barbie
			'tt6718170',	// The Super Mario Bros. Movie
			'tt15398776',	// Oppenheimer
			'tt6791350',	// Guardians of the Galaxy Vol. 3
			'tt5433140',	// Fast X
		],
		links: [
			'https://en.wikipedia.org/wiki/Barbie_(film)',
			'https://en.wikipedia.org/wiki/The_Super_Mario_Bros._Movie',
			'https://en.wikipedia.org/wiki/Oppenheimer_(film)',
			'https://en.wikipedia.org/wiki/Guardians_of_the_Galaxy_Vol._3',
			'https://en.wikipedia.org/wiki/Fast_X',
		],
		descriptor: 'BoxOffice'
	}
];

export default function Home() {

	async function get_film_data(id) {
		const response = await fetch(`https://www.omdbapi.com/?apikey=${api_keys.OMDB}&i=${id}`);
		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			console.log('Error: ' + response.status, response.statusText);
		}
	}

	function List({ids, links, descriptor}) {
		const [img_links, set_img_links] = React.useState(new Array(ids.length).fill(''));
		const [img_alts, set_img_alts] = React.useState(new Array(ids.length).fill(''));
		const [img_desc, set_img_desc] = React.useState(new Array(ids.length).fill(''));

		React.useEffect(() => {
			Promise.all(ids.map(id => get_film_data(id)))
				.then(dataArray => {
					set_img_links(dataArray.map(data => data.Poster));
					set_img_alts(dataArray.map(data => data.Plot));
					set_img_desc(dataArray.map(data => data[descriptor]));
				});
		}, [ids]);

		return (
			<ol>
				{
					ids.map((id, index) => (
						<li key={id}>
							<a href={links[index]}>
								<img src={img_links[index]} title={img_alts[index]} />
							</a>
							<h2>{img_desc[index]}</h2>
						</li>
					))
				}
			</ol>
		)
	}

	return (
		<div className="home-component component-layer-1">
			{
				curated_data.map((section, index) => {
					return (
						<div key={index} className="home-section component-layer-2">
							<h1>{section.header}</h1>
							<List ids={section.ids} links={section.links} descriptor={section.descriptor}/>
						</div>
					);
				})
			}
		</div>
	);
}
