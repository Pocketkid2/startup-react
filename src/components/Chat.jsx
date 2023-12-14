import React from 'react';

import './Chat.css'

const maximum_message_length = 1000;

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ws_url = `${protocol}://${window.location.host}/ws`;

const system_username = "system";

export default function Chat() {

	const [online_users, set_online_users] = React.useState([
		"guy1",
		"guy2"
	]);
	const [messages, set_messages] = React.useState([
		{ user: "guy1", text: "hello" },
		{ user: "system", text: "guy2 has joined the chat" },
		{ user: "guy2", text: "hi" },
		{ user: "guy2", text: "how are you?" },
		{ user: "guy1", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque condimentum elit enim, quis porttitor ligula bibendum ut. Quisque eros lectus, varius quis condimentum sit amet, maximus molestie ligula. Duis vestibulum nunc sed lorem pellentesque suscipit vitae at metus. Donec fringilla imperdiet feugiat. In maximus quam sagittis nisl placerat, ut porta ante sodales. Nulla eleifend quam sed turpis tincidunt condimentum. Aliquam purus nibh, condimentum vitae tempus non, rhoncus sit amet arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Praesent mollis augue lacus, quis consequat augue tempus at. Aenean at velit eget ex lobortis commodo sit amet eget arcu. Vivamus quis nibh at nisi sollicitudin malesuada et sit amet augue. Phasellus et urna quis ex venenatis molestie ut vitae nibh. Nullam feugiat, elit vitae blandit tincidunt, sapien nisi dignissim turpis, quis dictum mi tortor a sapien. Quisque nec dignissim orci. Donec sit amet dapibus odio. " },
	]);

	const socket = React.useRef(null);

	const chat_view_ref = React.useRef(null);

	React.useEffect(() => {
		socket.current = new WebSocket(ws_url);

		socket.current.onopen = (event) => {
			console.log("socket opened");
		};

		socket.current.onmessage = (event) => {
			console.log("socket message received");
			console.log(event.data);
			const data = JSON.parse(event.data);
			switch (data.type) {
				case "user_list":
					console.log('Received user list message');
					console.log(data.user_list);
					set_online_users(data.user_list);
					break;
				case "new_user":
					console.log('Received new user message');
					set_online_users(previous_online_users => [...previous_online_users, data.username]);
					set_messages(previous_messages => [...previous_messages, {
						user: system_username,
						text: `${data.username} has joined the chat`
					}]);
					break;
				case "user_left":
					console.log('Received user left message');
					set_online_users(previous_online_users => previous_online_users.filter(user => user !== data.username));
					set_messages(previous_messages => [...previous_messages, {
						user: system_username,
						text: `${data.username} has left the chat`
					}]);
					break;
				case "message":
					console.log('Received text message');
					set_messages(previous_messages => [...previous_messages, {
						user: data.username,
						text: data.message
					}]);
					break;
				default:
					console.log('Received unknown message');
					console.log(data);
					break;
			}
		};

		socket.current.onclose = (event) => {
			console.log("socket closed");
		};
		
		return () => {
			console.log("socket closing");
			socket.current.close();
		};
	}, []);

	React.useEffect(() => {
		const chat_view = chat_view_ref.current;
		chat_view.scrollTop = chat_view.scrollHeight;
	}, [messages]);

	function get_message_components() {
		const elements = [];
		let prev_user = null;
		for (let [index, message] of messages.entries()) {
			if (message.user === system_username) {
				elements.push(<p key={index + '-p'}>{message.text}</p>);
			} else {
				if (message.user !== prev_user) {
					elements.push(<dt key={index + '-dt'}>{message.user}</dt>);
				}
				elements.push(<dd key={index + '-dd'}>{message.text}</dd>);
			}
			prev_user = message.user;
		}
		return elements;
	}

	function handleSubmit(event) {
		event.preventDefault();
		let message = event.target.elements[0].value;
		event.target.elements[0].value = "";
		if (message.length > maximum_message_length) {
			message = message.substring(0, maximum_message_length);
		}
		socket.current.send(JSON.stringify({
			type: "message",
			message: message
		}));
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
				<dl className="chat-subsection" ref={chat_view_ref}>
					{get_message_components()}
				</dl>
			</div>
			<form className="chat-section component-layer-2" onSubmit={handleSubmit}>
				<input type="text" />
				<button>Send</button>
			</form>
		</div>
	);
}
