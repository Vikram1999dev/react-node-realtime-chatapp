import React, { useState } from 'react';

//The socket.io-client library is a lightweight client-side
// implementation of Socket.IO that enables the browser to
// establish a WebSocket connection to a Socket.IO server.
import io from 'socket.io-client';
import Chats from './chat';
const socket = io.connect('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = (e) => {
    e.preventDefault();
    if ((username !== '') & (room !== '')) {
      //-->01
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };

  return (
    <div className='App'>
      {!showChat ? (
        <div className='joinChatContainer'>
          <h3>Join a Chat</h3>
          <input
            type='text'
            placeholder='John...'
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='text'
            placeholder='Room ID'
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join a Room</button>
        </div>
      ) : (
        <Chats socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
