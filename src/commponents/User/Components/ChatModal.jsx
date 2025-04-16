import React, { useState, useEffect, useRef } from "react";
import { X, Send, Loader, MessageSquare } from "lucide-react";
import axiosInstance from "../../../../axios";
import { formatRelativeTime } from "../../format";
import { useUser } from "../../../context/UserContext"; // Updated to use useUser instead of useAuth

const ChatModal = ({ isOpen, onClose, account, receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { isAuthenticated, name: userName } = useUser(); // Access user data from UserContext

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && account?.id && receiverId) {
      fetchMessages();
    }
  }, [isOpen, account?.id, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!account?.id || !receiverId) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/chats/${account.id}/${receiverId}`,
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !account?.id || !receiverId) return;

    setSending(true);
    try {
      const response = await axiosInstance.post("/chats", {
        sellaccount_id: account.id,
        receiver_id: receiverId,
        message: newMessage.trim(),
      });

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="text-blue-600 font-medium">
                {receiverName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{receiverName}</h3>
              <p className="text-sm text-gray-500">
                {account?.title?.length > 25
                  ? `${account.title.substring(0, 25)}...`
                  : account?.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <p>Belum ada pesan</p>
                  <p className="text-sm">
                    Mulai percakapan dengan mengirim pesan
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  // We need to determine if the current user is the sender
                  const isCurrentUserSender =
                    message.sender_name === userName ||
                    message.sender_id === parseInt(Cookies.get("user_id"));

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isCurrentUserSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-2xl shadow-sm ${
                          isCurrentUserSender
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUserSender
                              ? "text-blue-200"
                              : "text-gray-500"
                          }`}
                        >
                          {formatRelativeTime(new Date(message.created_at))}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="border-t p-4">
          <div className="flex items-center bg-gray-100 rounded-full overflow-hidden pr-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 py-3 px-4 bg-transparent outline-none"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                sending || !newMessage.trim()
                  ? "bg-gray-300 text-gray-500"
                  : "bg-blue-600 text-white"
              }`}
            >
              {sending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
