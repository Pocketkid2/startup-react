import React from 'react';

import './SimpleForm.css'

export default function SimpleForm({ form_name, process_submit }) {
	const [form, setForm] = React.useState({});

	function handleChange(event) {
		setForm({ ...form, [event.target.name]: event.target.value });
	}

	function handleSubmit(event) {
		event.preventDefault();
		process_submit(form);
	}

	return (
		<div className="simple-form">
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					value={form.username || ''}
					onChange={handleChange} />
				<label htmlFor="password">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					value={form.password || ''}
					onChange={handleChange} />
				<button type="submit">{form_name}</button>
			</form>
		</div>

	);
}
