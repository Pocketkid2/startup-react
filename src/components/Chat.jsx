import React from 'react';

import './Chat.css'

const maximum_message_length = 1000;

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ws_url = `${protocol}://${window.location.host}/ws`;

export default function Chat() {

	const [online_users, set_online_users] = React.useState([
		"guy1",
		"guy2"
	]);
	const [messages, set_messages] = React.useState([
		{user: "guy1", text: "hello"},
		{user: "guy2", text: "hi"},
		{user: "guy2", text: "how are you?"},
		{user: "guy1", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque condimentum elit enim, quis porttitor ligula bibendum ut. Quisque eros lectus, varius quis condimentum sit amet, maximus molestie ligula. Duis vestibulum nunc sed lorem pellentesque suscipit vitae at metus. Donec fringilla imperdiet feugiat. In maximus quam sagittis nisl placerat, ut porta ante sodales. Nulla eleifend quam sed turpis tincidunt condimentum. Aliquam purus nibh, condimentum vitae tempus non, rhoncus sit amet arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent mollis augue lacus, quis consequat augue tempus at. Aenean at velit eget ex lobortis commodo sit amet eget arcu. Vivamus quis nibh at nisi sollicitudin malesuada et sit amet augue. Phasellus et urna quis ex venenatis molestie ut vitae nibh. Nullam feugiat, elit vitae blandit tincidunt, sapien nisi dignissim turpis, quis dictum mi tortor a sapien. Quisque nec dignissim orci. Donec sit amet dapibus odio. "},
	]);

	function get_message_components() {
		const elements = [];
		let prev_user = null;
		for (let [index, message] of messages.entries()) {
			if (message.user !== prev_user) {
				elements.push(<dt key={index + '-dt'}>{message.user}</dt>);
			}
			elements.push(<dd key={index + '-dd'}>{message.text}</dd>);
			prev_user = message.user;
		}
		return elements;
	}

	return (
		<div className="chat component-layer-1">
			<div className="chat-section component-layer-2">
				<h1>Online Users ({online_users.length})</h1>
				<ul className="chat-subsection">
					{online_users.map((user, index) => <li key={index}>{user}</li>)}
				</ul>
			</div>
			<div className="chat-section component-layer-2">
				<h1>Chat</h1>
				<dl className="chat-subsection">
					{get_message_components()}
				</dl>
			</div>
			<div className="chat-section component-layer-2">
				<input type="text" />
				<button>Send</button>
			</div>
		</div>
	);
}
