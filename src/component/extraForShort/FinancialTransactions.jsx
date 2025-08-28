import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { fetchGetRequest, sendPostRequest } from "../../api/api";

const FinancialTransactions = () => {
  // State for filters
  const [quickFilter, setQuickFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [filterUser, setFilterUser] = useState("");

  // Transactions data from API
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Build query parameters dynamically
      const queryParams = new URLSearchParams();
      if (fromDate) queryParams.append("startDate", fromDate);
      if (toDate) queryParams.append("endDate", toDate);
      if (quickFilter) queryParams.append("quickFilter", quickFilter);
      if (selectedUser) queryParams.append("selectedUser", selectedUser);
      if (filterUser) queryParams.append("filterUser", filterUser);
  
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/transaction/get-all-transaction-history?${queryParams.toString()}`;
      const res = await fetchGetRequest(apiUrl);
  
      if (res.success) {
        setTransactions(res.data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter submission
  const handleFilter = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  // Handle clear filters
  const handleClear = () => {
    setQuickFilter("");
    setFromDate("");
    setToDate("");
    setSelectedUser("");
    setFilterUser("");
    setTransactions([]);
  };

  // Auto-fetch when quickFilter changes
  useEffect(() => {
    if (quickFilter) {
      fetchTransactions();
    }
  }, [quickFilter]);

  return (
    <div className="n">
      {/* Header */}
      <header className="bg-black text-white mb-2 text-start py-2 font-bold text-lg pl-2 border-gray-800">
        FINANCIAL TRANSACTIONS
      </header>

      {/* Filter Form */}
      <form onSubmit={handleFilter} className="p-0">
        {/* Quick Filter */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Select quick filter</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {["today", "yesterday", "thisweek", "thismonth"].map((filter) => (
              <button
                key={filter}
                type="button"
                className={`border p-2 ${
                  quickFilter === filter ? "bg-red-500 text-white" : "bg-white"
                }`}
                onClick={() => setQuickFilter(filter)}
              >
                {filter === "thisweek"
                  ? "This week"
                  : filter === "thismonth"
                  ? "This month"
                  : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Or choose date:</p>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative w-full md:w-1/2">
              <label className="text-sm font-medium">From:</label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 border"
                />
              </div>
            </div>
            <div className="relative w-full md:w-1/2">
              <label className="text-sm font-medium">To:</label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2 border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Selection */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Then you must select a user:</p>
          <div className="flex flex-col md:flex-row gap-2">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full md:w-3/4 p-2 border"
            >
              <option value="">Select from user</option>
              <option value="User1">User1</option>
              <option value="User2">User2</option>
              <option value="User3">User3</option>
              <option value="User4">User4</option>
              <option value="User5">User5</option>
              <option value="User6">User6</option>
            </select>
            <button
              type="submit"
              className="w-full md:w-1/4 bg-red-500 text-white p-2 border hover:bg-red-600"
            >
              FILTER
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="w-full md:w-1/4 bg-gray-200 p-2 border hover:bg-gray-300"
            >
              CLEAR
            </button>
          </div>
        </div>

        {/* Filter User (Search Input) */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Filter user:</p>
          <input
            type="text"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-full p-2 border"
            placeholder="Filter"
          />
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">From User</th>
                  <th className="border p-2">To User</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={index} className="border">
                      <td className="border p-2">{transaction.from_user}</td>
                      <td className="border p-2">{transaction.to_user}</td>
                      <td className="border p-2">
                        {Number(transaction.amount).toFixed(2)} ({transaction.currency})
                      </td>
                      <td className="border p-2">
                        {new Date(transaction.date).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </form>
    </div>
  );
};

export default FinancialTransactions;