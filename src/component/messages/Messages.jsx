import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { fetchGetRequest } from "../../api/api"; // Your custom API request function
import LoadingSpinner from "../loading/LoadingSpinner";
import nodatafound from '../../assets/emptydata.png';
import { messageTemplates } from "../../../utils/utils";
import { useToast, Tabs, TabList, TabPanels, TabPanel, Tab } from "@chakra-ui/react";
import MessageList from "./MessageList";

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false); // To show loader
  const [error, setError] = useState(null); // For error handling
  const toast = useToast();

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

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchGetRequest(`${import.meta.env.VITE_API_URL}/api/admin/get-all-user-name`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  const handleTemplateSelect = (template) => {
    setMessageText(template.content);
  };

  const handleUserSelect = (userId) => {
    // Only update selected users if selectAll is not active
    if (selectAll) {
      setSelectAll(false);
    }

    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id)); // Select all from filtered list
    }
    setSelectAll(!selectAll);
  };

  const handleSendMessage = async () => {
    if (selectedUsers.length === 0 || !messageText.trim()) {
      toast({
        description: "Please select users and enter a message.",
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    const selectedPhoneNumbers = selectedUsers.map((userId) => {
      const user = users.find(user => user._id === userId);
      return user ? user.phone : null;
    }).filter(Boolean);

    try {
      const response = await axios.post("/api/send-message", {
        recipients: selectedPhoneNumbers,
        message: messageText,
      });
      toast({
        description: "Message sent successfully!",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });

      // Reset form
      setSelectedUsers([]);
      setMessageText("");
      setSelectAll(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        description: "Failed to send message. Please try again.",
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <div className="max-w-full mx-auto p-2 bg-white rounded-md shadow-lg">
      <Tabs variant="enclosed" colorScheme={bg} >
      <TabList className="flex gap-2">
          <Tab
          _selected={{
            bg: bg,
            color: "white", // Color for active tab
            fontWeight: "bold",
          }}
          _hover={{
            bg: hoverColor,
            color: "white", // Color for
          }}
          >
            Message List
          </Tab>
          <Tab
            _selected={{
              bg: bg,
              color: "white", // Color for active tab
              fontWeight: "bold",
              
            }}
            _hover={{
              bg: hoverColor,
              color: "white", // Color for
            }}
          >
            Send Message
          </Tab>
        </TabList>

        <TabPanels>
          {/* Tab for Message List */}
          <TabPanel>
            <MessageList />
          </TabPanel>

          {/* Tab for Creating Message */}
          <TabPanel>
            <h2 className="text-2xl font-bold mb-6">Message Section</h2>

            {/* Error Handling */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Loader */}
            {loading ? (
              <div className="flex justify-center h-[70vh] items-center mb-6">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {/* Templates Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Quick Message Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 p-2 lg:grid-cols-3 gap-4 min-h-[200px] max-h-[300px] overflow-y-auto border rounded-md">
                    {messageTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <h4 className="font-medium mb-2">{template.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {template.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-3/4 p-2 border rounded-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      onClick={handleSelectAll}
                      style={{ backgroundColor: bg }}
                      className={`p-2 px-4 rounded-md ${selectAll ? "bg-red-500" : "bg-blue-500"} text-white`}
                    >
                      {selectAll ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="max-h-48 min-h-[200px] overflow-y-auto border rounded-lg mb-4">
                    {filteredUsers.length === 0 ? (
                      <div className="flex justify-center items-center">
                        <img src={nodatafound} className="w-[300px] rounded-[50%]" alt="No user found" />
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          className={`p-2 flex justify-between items-center cursor-pointer ${selectedUsers.includes(user._id) ? "bg-gray-100" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleUserSelect(user._id)}
                            className="mr-2"
                          />
                          <span>{user.username} ({user.phone})</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((userId) => {
                      const user = users.find(u => u._id === userId);
                      return (
                        <div
                          key={userId}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          <span>{user ? user.username : 'User'}</span>
                          <span
                            className="cursor-pointer text-red-500 font-bold"
                            onClick={() => setSelectedUsers(selectedUsers.filter(id => id !== userId))}
                          >
                            ✖️
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Message Input */}
                <textarea
                  className="w-full p-3 border rounded-md h-32 mb-4"
                  placeholder="Enter your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  style={{ backgroundColor: bg }}
                  className="text-white px-4 py-2 rounded-md"
                >
                  Send Message
                </button>
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Messages;
