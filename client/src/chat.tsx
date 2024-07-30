import React, { useEffect, useState } from "react";
// ScrollToBottom is a component from the react-scroll-to-bottom library in
// React, which can be used to create a chat interface or any other UI element
// that needs to automatically scroll to the bottom when new content is added.
// import ScrollToBottom from "react-scroll-to-bottom";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface ChatProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  username: string;
  room: string;
}

interface MessageType {
  room: string;
  author: string;
  message: string;
  time: string;
}

const Chats = ({ socket, username, room }: ChatProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<MessageType[]>([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      //-->02
      await socket.emit("send_message", messageData);
      //the below instruction is for having the message we
      //send to another in room or chatbox
      //inside our chat box
      setMessageList((list) => [...list, messageData]);
      //this will clear the chatbox input
      //after sending the message
      setCurrentMessage("");
    }
  };

  //here we used useEffect cleanup
  //which basically stops
  // when you're building an app with React, you might create some
  // things that need to be "put away" when you're done with them.
  // For example, you might create a timer that updates the app every
  // second. But if you don't stop the timer when you're done, it keeps
  // running in the background and can slow down your app.

  // The cleanup function is also called when the dependencies specified in the
  // useEffect hook change. In this case, the only dependency is the socket
  // variable. If the socket variable changes, the useEffect hook will be called
  // again, and the previous event listener will be removed before a new one is
  // added.
  useEffect(() => {
    const handleReceiveMessage = (data: MessageType) => {
      //data we get here is from server or another person in
      //in the chat room
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      console.log("cleanup");
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>{username}</p>
      </div>
      <div className='chat-body'>
        <div className='message-container'>
          {messageList.map((messageContent, index) => {
            return (
              <div
                className='message'
                id={username === messageContent.author ? "you" : "other"}
                key={index}
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
        </div>
      </div>
      <div className='chat-footer'>
        <input
          type='text'
          value={currentMessage}
          placeholder='Hey...'
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            //this for to send the message after entering
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chats;
