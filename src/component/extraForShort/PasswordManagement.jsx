import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import PasswordReset from "./PasswordReset"; // 👈 Import your modal

const PasswordManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // 👈 store user info
  const [isModalOpen, setIsModalOpen] = useState(false); // 👈 modal toggle

  // Dummy data
  const dummyUsers = [
    { id: 1, name: "Bossboss1" },
    { id: 2, name: "player1" },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = dummyUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open reset password modal
  const handleResetPassword = (user) => {
    setSelectedUser(user); 
    setIsModalOpen(true); 
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black text-white mb-2 text-start py-2 font-bold text-lg pl-2 border-gray-800">
        PASSWORD MANAGEMENT
      </header>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Recherche..."
            className="w-full p-2 border border-gray-300 focus:outline-none"
          />
          <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 ">Name</th>
              <th className="border p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2 text-right">
                  <button
                    onClick={() => handleResetPassword(user)}
                    className="bg-red-500 text-white p-2 border hover:bg-red-600"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      {isModalOpen && selectedUser && (
        <PasswordReset
          type="admin"          // or any type you want
          id={selectedUser.id}  // pass user id
          isOpen={isModalOpen} onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PasswordManagement;
