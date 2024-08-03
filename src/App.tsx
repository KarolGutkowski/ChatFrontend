import React, { useEffect, useState, useRef } from 'react';
import WebSocketService from './client';
import { ChatMessage } from './ChatMessage';
import { useUser } from './UserProvider';
import { useNavigate } from 'react-router-dom';
import {MessageSentStatus} from './MessageSentStatus'


const App: React.FC = () => {
  const { username, setUsername } = useUser(); 
  const webSocketService = useRef(new WebSocketService()).current;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [failedToSentMessage, setFailedToSentMessage] = useState(false);
  const [showFailedMessage, setShowFailedMessage] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      message,
    ]);
  };

  useEffect(() => {
    webSocketService.connect();
    webSocketService.setOnMessageCallback(handleMessage);

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageInput = document.getElementById("chat-message-input") as HTMLInputElement;

    const message = new ChatMessage(username, messageInput.value);
    const sent = webSocketService.sendMessage(message);

    if(sent === MessageSentStatus.Success) {
      messageInput.value = ''; // Clear input field after sending
      setFailedToSentMessage(false);
      setShowFailedMessage(false);

    }
    else {
      setFailedToSentMessage(true);
      setShowFailedMessage(true);
      setTimeout(() => {
        setShowFailedMessage(false);
        setTimeout(() => setFailedToSentMessage(false), 1000); // Wait for fade-out to complete
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUsername(''); // Clear the username in context
    localStorage.removeItem('username'); // Remove the username from localStorage
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {failedToSentMessage && (
        <div
          className={`absolute top-16 w-full bg-red-500 text-white text-center p-2 transition-opacity ease-in-out duration-1000 ${
            showFailedMessage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Failed to send message.
        </div>
      )}

      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-150"
      >
        Logout
      </button>

      <form onSubmit={sendMessage} className="flex items-center space-x-4 mb-4 w-full max-w-md">
        <input
          required
          type="text"
          placeholder="Type your message here..."
          id="chat-message-input"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-150"
        >
          Send
        </button>
      </form>

      <div className="w-full max-w-md h-64 bg-white border border-gray-300 rounded-md overflow-y-auto p-4">
        <ul className="space-y-2">
          {messages.map((msg, index) => (
              <li 
              key={index} 
            className={`p-2 rounded-md shadow-sm ${msg.username !== username ? 'bg-gray-300 text-gray-700' : 'bg-blue-500 text-white'}`}
              >
                <strong>
                  {msg.username}:
                </strong>
              <p>{msg.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

