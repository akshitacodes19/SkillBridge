import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Send, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000';

function Chat() {
  const { swapId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');

  // Load previous messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/chat/${swapId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMessages(response.data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [swapId, token]);

  // Connect to Socket.IO
  useEffect(() => {
    const socket = io(API_URL);

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to chat server');

      socket.emit('joinSwap', swapId);
    });

    socket.on('newMessage', (newMessage) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [swapId]);

  // Automatically scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/chat/${swapId}`,
        {
          message: message.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const savedMessage = response.data;

      // Show message immediately for sender
      setMessages((previousMessages) => [
        ...previousMessages,
        savedMessage
      ]);

      // Send real-time notification to the other user
      socketRef.current.emit('sendMessage', {
        swapId,
        message: savedMessage.message
      });

      setMessage('');

    } catch (error) {
      console.error('Failed to send message:', error);

      alert(
        error.response?.data?.message ||
        'Failed to send message'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm p-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Skill Swap Chat
            </h1>

            <p className="text-sm text-gray-500">
              Real-time conversation
            </p>
          </div>
        </div>

        {/* Chat messages */}
        <div className="bg-white shadow-sm px-4 py-6 min-h-[500px] max-h-[500px] overflow-y-auto">

          {loading ? (
            <div className="text-center text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm mt-1">
                Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className="mb-4"
              >
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-gray-800">
                    {msg.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {msg.sender?.name || 'User'}
                  </p>
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <form
          onSubmit={sendMessage}
          className="bg-white rounded-b-xl shadow-sm p-4 flex gap-3"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </form>

      </div>
    </div>
  );
}

export default Chat;