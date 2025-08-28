import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Switch, Button, useToast, useDisclosure } from '@chakra-ui/react';
import { BiDollar } from 'react-icons/bi';
import { fetchGetRequest, sendPatchRequest, sendPostRequest } from '../../api/api';
import LoadingSpinner from '../loading/LoadingSpinner';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const AutoPaymentCardsPassimoPay = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [prevRates, setPrevRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [blinkRates, setBlinkRates] = useState({});
  const toast = useToast();
  const sidebarVisible = useSelector(state => state.theme.sidebarVisible);
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
  const fetchPaymentData = async () => {
    try {
      const response = await fetchGetRequest(`${import.meta.env.VITE_API_URL}/api/auto-payment/get-passimo-pay-currencies`);
      const data = response.data;

      const newBlinkRates = {};
      const updatedPrevRates = {};
      data.forEach((item) => {
        const previousRate = prevRates[item.id];
        const currentRate = item.rate_usd;

        if (previousRate !== undefined && previousRate !== currentRate) {
          newBlinkRates[item.id] = true;
          setTimeout(() => {
            setBlinkRates((prevBlinkRates) => ({
              ...prevBlinkRates,
              [item.id]: false,
            }));
          }, 2000);
        }

        updatedPrevRates[item.id] = currentRate;
      });

      setPaymentData(data);
      setPrevRates(updatedPrevRates);
      setBlinkRates(newBlinkRates);
    } catch (error) {
      setError('Failed to fetch auto payment data');
    } finally {
      setLoading(false);
    }
  };

  const updateImg = async (imageURL, providerID) => {
    try {
      await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/auto-payment/update-passimo-pay-currencies-icon/${providerID}`,
        { icon: imageURL }
      );
      fetchPaymentData();
      toast({
        title: "Icon updated successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating icon:", error.message);
      toast({
        title: "Error updating icon",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleImageUpload = async (file, providerID) => {
    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append("post_img", file);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,
        formData
      );
      if (response.url) {
        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        updateImg(response.url, providerID);
        setImageUploadLoading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageUploadLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
    const interval = setInterval(fetchPaymentData, 5000);
    return () => clearInterval(interval);
  }, []);

  const blinkStyle = (shouldBlink) => ({
    animation: shouldBlink ? 'blink 1s ease-in-out infinite alternate' : 'none',
    color: shouldBlink ? 'red' : 'inherit',
    fontWeight: shouldBlink ? 600 : 400,
  });

  const handleStatusToggle = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const confirmStatusToggle = async () => {
    try {
      await sendPatchRequest(`${import.meta.env.VITE_API_URL}/api/auto-payment/toggle-passim-pay-currencies/${selectedItem.id}`);
      fetchPaymentData();
      onClose();
    } catch (error) {
      console.error('Error toggling payment status:', error);
    }
  };

  if (loading) return (
    <center style={{ height: '80vh' ,display:"flex", justifyContent:"center", alignItems:"center"}}>
      <LoadingSpinner thickness={3} size={"lg"} />
    </center>
  );

  if (error) return (
    <center style={{ height: '80vh', color: 'red' }}>
      <Text>{error}</Text>
    </center>
  );

  return (
    <Box pl={2} px={8} pb={8} m={2} pt={6} className='bg-white'>
      <Text className="text-2xl font-bold mb-4">Passimo Pay</Text>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr style={{backgroundColor:bg, color:"white"}} className="bg-white border-b text-[12px] border-gray-200">
            <th className="py-2 text-left px-4 border border-gray-300">Payment Name</th>
            <th className="py-2 px-4 text-left border border-gray-300">Currency</th>
            <th className="py-2 px-4 text-left border border-gray-300">Rate (USD)</th>
            <th className="py-2 px-4 text-left border border-gray-300">Platform</th>
            <th className="py-2 px-4 border border-gray-300">Image</th>
            <th className="py-2 px-4 border border-gray-300">Status</th>
            <th className="py-2 px-4 border border-gray-300">Change Icon</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((item) => (
            <tr key={item.id} className="border-b border-gray-300">
              <td className="py-2 px-4 border border-gray-300">{item.name}</td>
              <td className="py-2 px-4 border border-gray-300">{item.currency}</td>
              <td className="py-2 px-4 border border-gray-300">
                <Flex className="items-center" style={blinkStyle(blinkRates[item.id])}>
                  <BiDollar className="mr-1" /> {item.rate_usd}
                </Flex>
              </td>
              <td className="py-2 px-4 border border-gray-300">{item.platform || 'N/A'}</td>
              <td className="py-2 px-4 text-center border border-gray-300">
                <img src={item.icon} alt={`${item.name} Icon`} className="w-10 h-10 mx-auto" />
              </td>
              <td className="py-2 px-4 text-center border border-gray-300">
                <Switch size="sm" isChecked={item.status === "active"} onChange={() => handleStatusToggle(item)} />
              </td>
              <td className="py-2 px-4 text-center border border-gray-300">
                <div className="relative w-full">
                  <label className="cursor-pointer flex items-center justify-center w-full border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-100 px-2 py-1 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], item.id)}
                      className="hidden"
                    />
                    <span className="text-gray-700">Upload Image</span>
                  </label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Status Change</ModalHeader>
          <ModalBody>
            <Text>
              Are you sure you want to change the status of {selectedItem?.name} to{" "}
              {selectedItem?.status === "active" ? "inactive" : "active"}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" size="sm" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="ghost" size="sm" onClick={confirmStatusToggle}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AutoPaymentCardsPassimoPay;
