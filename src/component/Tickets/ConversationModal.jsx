import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
} from "@chakra-ui/react";
import { AiOutlineSend } from "react-icons/ai";

const ConversationModal = ({
  isOpen,
  user,
  onClose,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  loading,
}) => {
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);

  const messagesEndRef = useRef(null);  // Ref to scroll to the bottom of the messages

  // This useEffect will trigger when the modal is opened or when messages change
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();  // Scroll to bottom when modal is opened
    }
  }, [isOpen]); // This runs on modal open

  useEffect(() => {
    scrollToBottom();  // Scroll to bottom every time the messages change
  }, [messages]); // This runs when messages array is updated

  // Scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay className="backdrop-blur-sm" />
      <ModalContent className="mx-4 sm:mx-auto my-4 rounded-xl max-w-2xl bg-white shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Support Conversation
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {messages.length > 0 ? (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.username === user.username ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.username === user.username
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {msg.username === user.username ? (
                        <span className="text-xs opacity-75">{user.username}</span>
                      ) : (
                        <span className="text-xs opacity-75">{msg.username}</span>
                      )}
                    </div>
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex justify-end">
                      <span className="text-xs opacity-75 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* This ref is placed at the bottom */}
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
              />
            </div>
            <Button
              onClick={onSendMessage}
              style={{ backgroundColor: bg, color: "white" }}
              isLoading={loading}
              disabled={!newMessage.trim()}
              className="p-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <span>Send</span>
              <AiOutlineSend size={"16px"} className="ml-1" />
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ConversationModal;
