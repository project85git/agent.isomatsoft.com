import { Badge, Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../api/api";
import nodatafound from '../assets/emptydata.png';

function UserNotification({userData}) {
  const [notifications, setNotifications] = useState([]);
  const toast = useToast();
  const { bg, border } = useSelector((state) => state.theme);

  const getAllNotifications = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/notification/get-all-notification-by-admin?role_type=${userData?.role_type}&username=${userData?.username}&type=received&page=1&limit=100`;
      const response = await fetchGetRequest(url);
      setNotifications(response.data);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message || error?.response?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  return (
    <div className="rounded max-[100%] mt-6 overflow-y-auto" style={{ borderColor: border }}>
      {notifications.length === 0 ? (
        <div className="flex justify-center items-center">
          <img src={nodatafound} className="w-[30%] rounded-full" alt="No data found" />
        </div>
      ) : (
        notifications.map((notif, index) => (
          <div
            key={index}
            className="flex flex-col p-4 rounded-md shadow-md mb-3"
            style={{ backgroundColor: "white", border: `1px solid ${border}` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-lg text-gray-800">{notif.title}</div>
              <Badge colorScheme="blue">{notif.category}</Badge>
            </div>
            <div
        className={`text-sm text-gray-700 mt-2 cursor-pointer`}
        dangerouslySetInnerHTML={{ __html: notif.description }} // Inject sanitized HTML
      />
            <div className="mt-2 text-sm text-gray-600">
              <strong>Amount:</strong> ${notif.amount||"N/A"}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              <strong>Send By:</strong> {notif.parent_admin_username} ({notif.parent_admin_role_type})
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <em>{new Date(notif.timestamp).toLocaleString()}</em>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UserNotification;
