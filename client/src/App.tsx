import React, { useState } from "react";

//The socket.io-client library is a lightweight client-side
// implementation of Socket.IO that enables the browser to
// establish a WebSocket connection to a Socket.IO server.
import { io } from "socket.io-client";
import Chats from "./chat";
const socket = io("http://localhost:3002");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (username !== "" && room !== "") {
      //-->01
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className='App'>
      {!showChat ? (
        <div className='joinChatContainer'>
          <h3 className='w-100'>Join a Chat</h3>
          <input
            type='text'
            placeholder='John...'
            className='w-100'
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='text'
            placeholder='Room ID'
            className='w-100'
            onChange={(e) => setRoom(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && joinRoom(e);
            }}
          />
          <button className='w-100' onClick={joinRoom}>
            Join a Room
          </button>
        </div>
      ) : (
        <Chats socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
