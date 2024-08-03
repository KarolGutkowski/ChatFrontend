import React, { useEffect, useState } from 'react';
import WebSocketService from './client';
import { ChatMessage } from './ChatMessage';


const initialMessages: ChatMessage[] = new Array<ChatMessage>();

const App: React.FC = () => {
  const webSocketService = new WebSocketService();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  console.log(initialMessages)

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
  }, [webSocketService]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const messageInput = document.getElementById("chat-message-input") as HTMLInputElement;

    const message = new ChatMessage('Karol', messageInput.value);
    webSocketService.sendMessage(message);
    messageInput.value = ''; // Clear input field after sending
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={sendMessage} className="flex items-center space-x-4 mb-4 w-full max-w-md">
        <input
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
            <li key={index} className="p-2 bg-gray-50 rounded-md shadow-sm">
              <strong className="block text-blue-600">{msg.username}:</strong>
              <p>{msg.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

