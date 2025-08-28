import axios from "axios";
// import { getCookie } from "@/app/redux-arch/adminauth/auth.slice";
import { removeFromLocalStorage, retrieveUserDetails } from "../redux/middleware/localstorageconfig";
const getHeaders = () => {
  const adminauthCookie = retrieveUserDetails("adminauth");
  if (adminauthCookie) {
    return {
      token: adminauthCookie.token,
      usernametoken: adminauthCookie.usernametoken,
    };
  }
  return {};
};
// Function to send a POST request
export const sendPostRequest = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      removeFromLocalStorage("adminauth"); // Call the logout function on 401 error
      window.location.href = "/login"; // Redirect to login page on 401 error
      return;
    }
    throw error.response;
  }
};

// Function to fetch a GET request
export const fetchGetRequest = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      removeFromLocalStorage("adminauth"); // Call the logout function on 401 error
      window.location.href = "/login"; // Redirect to login page on 401 error
      return;
    }
    throw error;
  }
};

// Function to send a PUT request
export const sendPatchRequest = async (url, data) => {
  try {
    const response = await axios.patch(url, data, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      removeFromLocalStorage("adminauth"); // Call the logout function on 401 error
      window.location.href = "/login"; // Redirect to login page on 401 error
      return;
    }
    throw error;
  }
};

// Function to send a DELETE request
export const sendDeleteRequest = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      removeFromLocalStorage("adminauth"); // Call the logout function on 401 error
      window.location.href = "/login"; // Redirect to login page on 401 error
      return;
    }
    throw error;
  }
};


