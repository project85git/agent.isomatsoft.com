import { useState, useEffect } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import axios from "axios";
import { fetchGetRequest, sendPostRequest } from "../../api/api";

const initialState = {
  username: "",
  password: "",
  confirm_password: "",
  role_type: "",
  share_percentage: "",
};

const AddNewUserAdmin = () => {
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [valid, setValid] = useState(false);
  const [assignedRoles, setAssignedRoles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkUsername = (username) => {
    const hasAlpha = /[a-zA-Z]/.test(username);
    const hasNum = /[0-9]/.test(username);
    return hasAlpha && hasNum;
  };

  const checkUsernameExistence = async () => {
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/admin/exist-or-not`,
        { username: formData.username, type: "admin" }
      );
      setUserExist(response.data.exists || false);
    } catch (error) {
      setUserExist(error.data?.exists || false);
    }
  };

  useEffect(() => {
    let timer;
    if (formData.username.length > 3) {
      timer = setTimeout(() => {
        setValid(!checkUsername(formData.username));
        checkUsernameExistence();
      }, 300);
    } else {
      setValid(false);
    }
    return () => clearTimeout(timer);
  }, [formData.username]);

  const getAdminLevel = async () => {
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/level/get-admin-level`
      );
      setAssignedRoles(response.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAdminLevel();
  }, []);

  const createAdmin = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    if (userExist) {
      alert("Username should be unique");
      return;
    }
    if (valid) {
      alert("Not a valid username");
      return;
    }

    const payload = {
      password: formData.password,
      role_type: formData.role_type,
      username: formData.username,
      parent_admin_id: "admin_id_placeholder",
      share_percentage: formData.share_percentage,
      site_auth_key: "site_auth_key_placeholder",
    };

    setLoading(true);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/admin/create-admin-user`,
        payload
      );
      alert(response.data.message);
      setFormData(initialState);
    } catch (error) {
      alert(error.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" ">
      <header className="bg-black text-white mb-2 text-start py-2 font-bold text-lg pl-2 border-gray-800">
        ADD USER
      </header>
      <div className="w-full  bg-white p-6 md:p-0">
        <form onSubmit={createAdmin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 w-full px-3 py-2 border ${
                valid ? "border-red-500" : "border-gray-300"
              }  focus:outline-none focus:ring-2 focus:ring-[#D0011C] text-sm`}
              required
            />
            {userExist ? (
              <p className="text-xs text-red-500 mt-1">Username already exists</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Username must contain letters and numbers, e.g., xyz123
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#D0011C] text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showPassword ? <IoEyeSharp size={18} /> : <IoEyeOffSharp size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#D0011C] text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <IoEyeSharp size={18} /> : <IoEyeOffSharp size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="role_type" className="block text-sm font-medium text-gray-700">
              Select Layer:
            </label>
            <select
              id="role_type"
              name="role_type"
              value={formData.role_type}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#D0011C] text-sm"
              required
            >
              <option value="">Select Layer</option>
              {assignedRoles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.label || role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="share_percentage" className="block text-sm font-medium text-gray-700">
              Share %:
            </label>
            <input
              type="number"
              id="share_percentage"
              name="share_percentage"
              min="0"
              max="100"
              value={formData.share_percentage}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#D0011C] text-sm"
              required
            />
          </div>
          <div className="flex justify-center sm:flex-row gap-3 mt-6">
            
            <button
              type="submit"
              className="w-[300px] md:w-full bg-gray-400 text-black font-semibold py-2  hover:bg-red-600 transition-colors text-sm"
              disabled={loading}
            >
              {loading ? "Creating..." : "ADD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUserAdmin;