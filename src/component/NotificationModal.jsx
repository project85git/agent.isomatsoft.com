import { IoMdCloseCircle } from "react-icons/io";
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
} from "@chakra-ui/react";
import { AiFillBell } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../api/api";
import nodata from '../assets/emptydata.png';
import SlipModal from "../Modals/SlipModal";
import nodatafound from '../assets/emptydata.png'
function NotificationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading1, setLoading1] = useState(false);
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState();
  const { color, primaryBg, secondaryBg, iconColor, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const [transactionData, setTransactionData] = useState([]);
  const [pendingTransactionCount, setPendingTransactionCount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [isFullTextVisible, setIsFullTextVisible] = useState({});
  const [activeIndex, setActiveIndex]=useState(0);
  const adminAuthDetails = JSON.parse(localStorage.getItem("adminauth"));
  const [limit, setLimit] = useState("20");
  const toast = useToast();

  const getAllTransactionDetails = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/transaction/get-all-transaction?transaction_type=pending&user_type=user&page=${currentPage}&limit=100&filter="all"`;

    try {
      let response = await fetchGetRequest(url);
      setTransactionData(response.data);
      setPendingTransactionCount(response?.transactionCount?.pendingDepositCount + response?.transactionCount?.pendingWithdrawCount);
      setPagination(response.pagination);
      setLoading(false);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message || error?.response?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const getAllNotification = async () => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/notification/get-all-notification-admin?type=received&page=${currentPage}&limit=100`;
    try {
      let response = await fetchGetRequest(url);
      setNotification(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(isOpen||adminAuthDetails?.token){
    Promise.all([getAllNotification(), getAllTransactionDetails()])
      .catch((error) => console.error("Error fetching data:", error));
    }
  }, [adminAuthDetails?.token, isOpen]);
 
  // Toggle visibility of full text on click
  const handleClick = (index) => {
    setActiveIndex(index);
    setIsFullTextVisible((prevState) => {
      const newState = { ...prevState, [index]: !prevState[index] };
      return newState;
    });
    
  };
  

  return (
    <>
      <div onClick={onOpen} style={{
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          border: `1px solid ${border}60`,
          position: "relative",
          display: "inline-block",
          padding: "8px",
          borderRadius: "6px",
        }}
        className="cursor-pointer"
      >
        <AiFillBell cursor="pointer" fontSize="20px" style={{ color: iconColor }} />
        {pendingTransactionCount > 0 && (
          <Box
            position="absolute"
            top="-5px"
            right="-5px"
            backgroundColor="red"
            color="white"
            borderRadius="50%"
            padding="0 6px"
            fontSize="12px"
            fontWeight="bold"
          >
            {pendingTransactionCount}
          </Box>
        )}
      </div>

      <Modal size={{ base: "full", md: "lg" }} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className="h-[100%] sm:h-[640px]">
          <div className="flex justify-between p-4">
            <div className="relative"></div>
            <div onClick={onClose} className="absolute top-3 right-3 cursor-pointer">
              <IoMdCloseCircle fontSize={25} />
            </div>
          </div>

          <ModalHeader textAlign={"center"} className="-mt-[20px] uppercase font-extrabold">
            Notification
          </ModalHeader>
          <ModalBody style={{ padding: "4px" }}>
            <Tabs isFitted variant="enclosed" colorScheme="blue" >
              <TabList className="flex px-4 py-1 gap-2">
                <Tab _selected={{ bg: bg,color: "white", fontWeight: "bold", borderRadius: "md" }}>Transactions</Tab>
                <Tab _selected={{ bg: bg, color: "white", fontWeight: "bold", borderRadius: "md" }}>Others</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="flex flex-col gap-3 overflow-scroll sm:h-[540px]">
                    {transactionData?.filter(notif => notif.status === "pending").map((notif, index) => (
                      <div
                        key={index}
                        className={`flex relative flex-col ${notif.type === "deposit" ? "border border-green-600" : "border border-red-800"} justify-between px-4 py-2 rounded bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg gap-2`}
                      >
                        <div className="flex items-center absolute top-6 left-[50%] justify-center">
                          <SlipModal data={notif} type={notif?.type} transactionDetails={getAllTransactionDetails} />
                        </div>
                        <div className="absolute top-1 right-2 h-[10px] w-[10px] rounded-[50%] bg-yellow-600 animate-pulse"></div>
                        <div className="flex justify-between w-[100%]">
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center text-[20px] justify-center w-9 h-9 rounded-[6px] text-white font-bold ${notif.type === "deposit" ? "bg-green-600" : "bg-red-800"}`}>
                              {notif.type === "deposit" ? "D" : "W"}
                            </div>
                            <div className="text-[12px] font-bold">
                              <div className="text-gray-600">USER ID</div>
                              <div className="font-extrabold">{notif?.user_id}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className={`text-lg font-bold ${notif?.type === "deposit" ? 'text-green-600' : 'text-red-600'}`}>
                              {notif?.type === "deposit" ? `+ ${notif?.deposit_amount} ${notif?.currency}` : `- ${notif.withdraw_amount} ${notif?.currency}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-end justify-between text-[11px]">
                          <div className="font-extrabold text-[9px]">
                            {notif?.initiated_at}
                          </div>
                          <div className="font-semibold">
                            {notif?.method} by UPI Gateway
                          </div>
                        </div>
                      </div>
                    ))}
                    {transactionData.length === 0 && (
                      <div>
                        <img src={nodata} alt="no data found" className="w-[100%]" />
                      </div>
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="flex flex-col gap-3 overflow-scroll sm:h-[490px]">
                  {notification?.length===0?<div className="flex justify-center items-center"><img src={nodatafound} className="w-[300px] rounded-[50%]" alt="No user found" /></div>:<>
                  {notification.map((notif, index) => (
  <div key={index} className="flex justify-between p-4 items-center rounded-md shadow-lg bg-gradient-to-br" style={{ color: bg, border: `1px solid ${border}` }}>
    <div className="transition duration-300 ease-in-out w-72">
      <div className="font-bold text-lg">{notif.title}</div>
      <div>
        <div
          className={`text-sm text-gray-700 mt-2 cursor-pointer ${
            isFullTextVisible[index] ? 'whitespace-normal' : 'overflow-hidden whitespace-nowrap text-ellipsis'
          }`}
          dangerouslySetInnerHTML={{ __html: notif.description }}
        />
        {!isFullTextVisible[index] && (
          <span className="text-blue-500 cursor-pointer" onClick={() => handleClick(index)}>
            Read more
          </span>
        )}
      </div>
      <div classNam="text-xs text-gray-500 mt-1">{notif.timestamp}</div>
    </div>
    <div>
      <Badge>{notif.category}</Badge>
    </div>
  </div>
))}


                    </>}
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NotificationModal;
