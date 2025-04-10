import React, { useState, useEffect, useRef } from "react";
import { Send, Phone, Video, MoreVertical } from "lucide-react";

const conversations = [
  {
    id: 1,
    user: {
      name: "Alice Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      status: "online",
    },
    messages: [
      {
        id: 1,
        content: "Hi, I need help with my account",
        timestamp: "10:00 AM",
        sender: "user",
      },
      {
        id: 2,
        content: "Hello! I’d be happy to help. What seems to be the issue?",
        timestamp: "10:02 AM",
        sender: "admin",
      },
      {
        id: 3,
        content: "I can’t access my dashboard",
        timestamp: "10:03 AM",
        sender: "user",
      },
    ],
    unread: 2,
    time: "2m ago",
  },
  {
    id: 2,
    user: {
      name: "Bob Smith",
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      status: "offline",
    },
    messages: [
      {
        id: 1,
        content: "Thanks for your help!",
        timestamp: "1h ago",
        sender: "user",
      },
    ],
    unread: 0,
    time: "1h ago",
  },
];

function Chat() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat.messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedMessages = [
      ...selectedChat.messages,
      {
        id: Date.now(),
        content: newMessage,
        timestamp: "Now",
        sender: "admin",
      },
    ];

    setSelectedChat({ ...selectedChat, messages: updatedMessages });
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-2rem)] -mt-8 -mx-8 flex">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
              selectedChat.id === conversation.id ? "bg-gray-50" : ""
            }`}
            onClick={() => setSelectedChat(conversation)}
          >
            <div className="flex items-center">
              <img
                src={conversation.user.avatar}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium">
                  {conversation.user.name}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {conversation.messages.slice(-1)[0]?.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={selectedChat.user.avatar}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-4">
              <h3 className="font-medium">{selectedChat.user.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedChat.user.status === "online" ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="w-5 h-5 text-gray-500" />
            <Video className="w-5 h-5 text-gray-500" />
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedChat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender === "admin" ? "justify-end" : ""
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "admin"
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs text-gray-500">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
            onClick={sendMessage}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
