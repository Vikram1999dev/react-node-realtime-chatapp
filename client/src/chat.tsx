import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const handleReceiveMessage = (data: MessageType) => {
      //data we get here is from another person in
      //in the chat room
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
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
                className={`message d-flex flex-column ${
                  username === messageContent.author
                    ? "align-items-end"
                    : "align-items-start"
                }`}
                id={username === messageContent.author ? "you" : "other"}
                key={index}
              >
                <div className='person'>
                  {username === messageContent.author
                    ? "Me"
                    : messageContent.author}
                </div>
                <div className='message-content'>
                  <p>{messageContent.message}</p>
                </div>
                <div className='message-meta'>
                  <p id='time'>{messageContent.time}</p>
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
