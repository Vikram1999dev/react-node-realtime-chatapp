import React, { useEffect, useState } from 'react';
// ScrollToBottom is a component from the react-scroll-to-bottom library in
// React, which can be used to create a chat interface or any other UI element
// that needs to automatically scroll to the bottom when new content is added.
import ScrollToBottom from 'react-scroll-to-bottom';

const Chats = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      //-->02
      await socket.emit('send_message', messageData);
      //the below instruction is for having the message we
      //send to another in room or chatbox
      //inside our chat box
      setMessageList((list) => [...list, messageData]);
      //this will clear the chatbox input
      //after sending the message
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      //data we get here is from server or another person in
      //in the chat room
      setMessageList((list) => [...list, data]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      console.log('cleanup');
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket]);

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>{username}</p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return (
              <div
                className='message'
                id={username === messageContent.author ? 'you' : 'other'}
              >
                <div>
                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                  <div className='message-meta'>
                    <p id='time'>{messageContent.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
          type='text'
          value={currentMessage}
          placeholder='Hey...'
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            //this for to send the message after entering
            e.key === 'Enter' && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chats;
