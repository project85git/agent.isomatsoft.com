import { Input, Select, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { GrCurrency } from "react-icons/gr";
import { sendPostRequest } from "../../api/api";


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
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
          placeholder="Enter amount"
          pl={10}
          size={"lg"}
          rounded={"none"}
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
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setAmount(suggestion.toString())}
            className="px-3 py-2 bg-gray-200 text-red-700 hover:bg-red-200 focus:outline-none w-[70px] focus:ring-2 focus:ring-red-500 text-sm transition-colors duration-200"
            aria-label={`Select ${suggestion}`}
          >
            <div className="flex justify-between items-center text-md text-red gap-1">
              <GrCurrency />
              {suggestion}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const TransferAmount = ({ allMembers }) => {
  // Instead of string, store whole user object
  const [fromUser, setFromUser] = useState(allMembers?.[0] || null);
  const [toUser, setToUser] = useState(allMembers?.[1] || null);
  const [amount, setAmount] = useState("");
  const suggestions = [5, 10, 20, 50, 100, 200, 300, 400, 500];
  const toast = useToast();
  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid transfer amount greater than 0.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    if (!fromUser || !toUser) {
      toast({
        title: "Missing users",
        description: "Please select both sender and receiver.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    if (fromUser.username === toUser.username) {
      toast({
        title: "Invalid transfer",
        description: "Sender and receiver cannot be the same user.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    // ✅ Prepare payload
    const payload = {
      from_user: {
        username: fromUser.username,
        role_type: fromUser.role_type,
      },
      to_user: {
        username: toUser.username,
        role_type: toUser.role_type,
      },
      amount: parseFloat(amount),
    };
  
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/transaction/transfer-amount`, // adjust endpoint
        payload
      );
  
      toast({
        title: "Transfer successful",
        description: response.message || `Transferred ${amount} successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
  
      // Optionally reset fields
      setAmount("");
      setFromUser(null);
      setToUser(null);
    } catch (error) {
      toast({
        title: "Transfer failed",
        description: error?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full bg-white" style={{ maxWidth: "100%" }}>
        <header className="bg-black text-white mb-4 text-start py-3 pl-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Transfer</h2>
        </header>
        <div className="p-4 md:p-6">
          <UserSelector
            label="From User"
            allMembers={allMembers}
            value={fromUser}
            onChange={(e) =>
              setFromUser(allMembers.find((m) => m.username === e.target.value))
            }
          />
          <UserSelector
            label="To User"
            allMembers={allMembers}
            value={toUser}
            onChange={(e) =>
              setToUser(allMembers.find((m) => m.username === e.target.value))
            }
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

// Example of UserSelector dropdown
const UserSelector = ({ label, allMembers, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium">{label}</label>
      <Select
        value={value?.username || ""}
        onChange={onChange}
        rounded={"none"}
        size={"lg"}
        className="w-full border border-gray-300 "
      >
        <option value="">Select {label}</option>
        {allMembers?.map((member) => (
          <option key={member.username} value={member.username}>
            {member.username}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default TransferAmount;
