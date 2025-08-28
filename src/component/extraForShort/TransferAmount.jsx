import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { GrCurrency } from "react-icons/gr";

const RoleSelector = ({ label, value, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
        aria-label={label}
      >
        <option value="User">User</option>
        <option value="Admin">Admin</option>
      </select>
    </div>
  );
};

const AmountInput = ({ amount, setAmount }) => {
  return (
    <div className="mb-6 relative">
      <label
        className="block text-sm font-medium text-gray-700 mb-2"
        htmlFor="amount"
      >
        Amount
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <GrCurrency className="text-gray-400" />
        </span>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full pl-10 p-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
          placeholder="Enter amount"
          min="0"
          step="0.01"
          aria-describedby="amount-help"
        />
      </div>
      <p id="amount-help" className="mt-2 text-sm text-gray-500">
        Enter the amount to transfer
      </p>
    </div>
  );
};

const SuggestionBox = ({ suggestions, setAmount }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quick Pick
      </label>
      <div className="flex flex-wrap gap-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setAmount(suggestion.toString())}
            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-colors duration-200"
            aria-label={`Select ${suggestion}`}
          >
            <div className="flex justify-between items-center gap-1">
              <GrCurrency />
              {suggestion} TND
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const TransferAmount = () => {
  const [fromRole, setFromRole] = useState("User");
  const [toRole, setToRole] = useState("Admin");
  const [amount, setAmount] = useState("");
  const suggestions = [5, 10, 20, 50];

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Invalid amount");
      return;
    }
    alert(
      `Transfer ${amount} from ${fromRole} to ${toRole}`
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full bg-white" style={{ maxWidth: "100%" }}>
        <header className="bg-black text-white mb-4 text-start py-3 pl-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Transfer</h2>
        </header>
        <div className="p-4 md:p-6">
          <RoleSelector
            label="From Role"
            value={fromRole}
            onChange={(e) => setFromRole(e.target.value)}
          />
          <RoleSelector
            label="To Role"
            value={toRole}
            onChange={(e) => setToRole(e.target.value)}
          />
          <AmountInput amount={amount} setAmount={setAmount} />
          <SuggestionBox suggestions={suggestions} setAmount={setAmount} />
          <button
            onClick={handleConfirm}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-colors duration-200"
            aria-label="Confirm"
          >
            <FaCheckCircle />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferAmount;
