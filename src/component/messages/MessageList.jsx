import React, { useEffect, useState } from "react";
import { fetchGetRequest } from "../../api/api";
import { useSelector } from "react-redux";
import nodatafound from '../../assets/emptydata.png'
import LoadingSpinner from "../loading/LoadingSpinner";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    username: "",
    phone: "",
    role: "",
    page: 1,
    limit: 10,
  });
  const [token] = useState(localStorage.getItem("token")); // Assuming token is stored in localStorage
  const [usernametoken] = useState(localStorage.getItem("usernametoken"));
  const [expandedMessages, setExpandedMessages] = useState({}); // Track expanded messages

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

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const { search, category, username, phone, role, page, limit } = filters;

      // Construct query string conditionally
      let queryString = `${import.meta.env.VITE_API_URL}/api/message/get-all-message?page=${page}&limit=${limit}`;

      if (search) queryString += `&search=${search}`;
      if (category) queryString += `&category=${category}`;
      if (username) queryString += `&username=${username}`;
      if (phone) queryString += `&phone=${phone}`;
      if (role) queryString += `&role=${role}`;

      const response = await fetchGetRequest(queryString);

      if (response.success) {
        setMessages(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching messages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);  // Fetch messages whenever filters change

  // Handle input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  // Toggle expanded message
  const toggleMessageExpansion = (id) => {
    setExpandedMessages((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle expanded state for the clicked message
    }));
  };

  return (
    <div className="">
      <h1 className="text-3xl font-semibold mb-4">Message List</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by username or phone"
          className="border p-2 rounded"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="bonus">Bonus</option>
          <option value="payment">Payment</option>
          <option value="transaction">Transaction</option>
          <option value="security">Security</option>
          <option value="system_update">System Update</option>
        </select>
        <input
          type="text"
          name="username"
          value={filters.username}
          onChange={handleFilterChange}
          placeholder="Username"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          value={filters.phone}
          onChange={handleFilterChange}
          placeholder="Phone"
          className="border p-2 rounded"
        />
        {/* Limit Dropdown */}
        <select
          name="limit"
          value={filters.limit}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Message List */}
      {loading ? (
        <div className="flex justify-center h-[70vh] items-center mb-6">
          <LoadingSpinner />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex justify-center items-center h-[70vh]"><img src={nodatafound} className="w-[300px] rounded-md" alt="No user found" /></div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border ">
          <table className="min-w-full  ">
        <thead className="">
          <tr style={{ backgroundColor: bg, color: "white" }}>
            <th className="px-2 py-3 text-left text-xs font-medium border border-gray-300">Username</th>
            <th className="px-2 py-3 text-left text-xs font-medium border border-gray-300">Phone</th>
            <th className="px-2 py-3 text-left text-xs font-medium border border-gray-300">Category</th>
            <th className="px-2 py-3 text-left text-xs font-medium border border-gray-300">Message</th>
            <th className="px-2 py-3 text-left text-xs font-medium border border-gray-300">Sent At</th>
            <th className="px-2 py-3 text-left text-xs font-medium border border-gray-300">Send By</th> {/* New column */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y ">
          {messages.map((msg) => (
            <tr key={msg._id}>
              <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{msg.username}</td>
              <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{msg.phone}</td>
              <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{msg.category}</td>
              <td className="px-2 py-4 whitespace-normal max-w-[300px] break-words border border-gray-300">
                {/* Toggle full message on click */}
                <div>
                  {expandedMessages[msg._id] ? (
                    <div>{msg.message}</div>
                  ) : (
                    <div className="truncate">{msg.message}</div>
                  )}
                  <button
                    onClick={() => toggleMessageExpansion(msg._id)}
                    className="text-blue-500 mt-2"
                  >
                    {expandedMessages[msg._id] ? "Show Less" : "Read More"}
                  </button>
                </div>
              </td>
              <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{msg.sent_at}</td>
              <td className="px-2 py-4 whitespace-nowrap border border-gray-300">{msg.parent_admin_username}</td> {/* New column for parent_admin_username */}
            </tr>
          ))}
        </tbody>
      </table>

          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Prev
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageList;
