import React, { useState, useRef, useEffect } from 'react';

// Main App component
export default function App() {
  // State to hold the chat messages. Each message is an object with 'sender' and 'text'.
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Hello! I am your agile assistant. How can I help you today?' },
  ]);

  // State for the user's input in the message box.
  const [inputMessage, setInputMessage] = useState('');

  // Ref to automatically scroll the chat window to the bottom.
  const messagesEndRef = useRef(null);

  // UseEffect hook to scroll to the bottom whenever a new message is added.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle sending a new message.
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    // Add the user's message to the chat history.
    const userMessage = { sender: 'user', text: inputMessage.trim() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage(''); // Clear the input field.

    // Simulate a loading state while we wait for the agent's response.
    const loadingMessage = { sender: 'agent', text: 'Agent is thinking...' };
    setMessages(prevMessages => [...prevMessages, loadingMessage]);
    
    // Call the backend API
    try {
        const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage.text }),
        });
        const data = await response.json();
        
        // Update the last message (loading message) with the agent's actual response.
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { sender: 'agent', text: data.response };
            return newMessages;
        });
    } catch (error) {
        console.error('API call failed:', error);
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { sender: 'agent', text: 'Sorry, something went wrong. Please make sure the backend server is running.' };
            return newMessages;
        });
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-inter">
      {/* Header */}
      <header className="p-4 bg-gray-800 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Agile AI Assistant
        </h1>
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-400">Status: Online</span>
        </div>
      </header>

      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'agent' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-lg transform transition-transform duration-300 ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none hover:scale-105'
                  : 'bg-gray-700 text-gray-100 rounded-bl-none hover:scale-105'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM8 11a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M15 15.5a5 5 0 00-10 0V16h10v-.5z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
        {/* Empty div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-4 bg-gray-800 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 p-3 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="p-3 rounded-full bg-blue-600 text-white shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 00.149.913A1 1 0 004 18h12a1 1 0 00.894-1.447l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
