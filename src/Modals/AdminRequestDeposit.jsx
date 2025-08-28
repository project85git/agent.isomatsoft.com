import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Box,
  Text,
  Spinner,
  useDisclosure,
  useToast,
  ModalCloseButton,
} from "@chakra-ui/react";
import { HiInformationCircle } from "react-icons/hi2";

import { fetchGetRequest, sendPostRequest } from "../api/api";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FaUserLock } from "react-icons/fa";
import { RiBankFill, RiLuggageDepositFill } from "react-icons/ri";
import { TbCircleArrowLeftFilled } from "react-icons/tb";
import axios from "axios";
const AdminRequestDeposit = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("manual");
  const [inputAmount, setInputAmount] = useState("");
  const [data, setData] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [userInputs, setUserInputs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedImage,setSelectedImage]=useState('')

  const [imgLoader, setImgLoader] = useState(false);
  const [depositLoader, setDepositLoader] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [nextLoader, setNextLoader] = useState(false);
  const [cryptoLoader, setCryptoLoader] = useState(false);
  const [selectedCurrencyId, setSelctedCurrencyId] = useState(null);
  const toast = useToast();
  const { t } = useTranslation();
  const {
    color,
    primaryBg,
    secondaryBg,
    iconColor,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
    secondaryColor,
    textColor,
    borderColor,
  } = useSelector((state) => state.theme);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState("");
  const handleSelectCurrent = (item) => {
    setSelectedCurrency(item);
    setSelctedCurrencyId(item?.id);
  };
  const user = useSelector((state) => state.authReducer);
const adminData = user.user || {};

  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await fetchGetRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/get-payment-method-admin?type=deposit`
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const fetchCryptoPaymentMethods = async () => {
    setCryptoLoader(true);
    try {
      const response = await fetchGetRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/auto-payment/get-passimo-pay-currencies`
      );
      setCryptoData(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCryptoLoader(false);
    }
  };
  const handleInputChange = (e, fieldName) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      handleImageUpload(file, fieldName);
    } else {
      setFormData({
        ...formData,
        [fieldName]: e.target.value,
      });
    }
  };
  const handleImageUpload = async (file, fieldName) => {
    setImageUploadLoading(true);
    const formDatas = new FormData();
    formDatas.append("post_img", file);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/image-url`,formDatas);
      toast({
        title: "Image uploaded successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      if (response?.url) {
        // toast({
        //   title: "Image uploaded successfully",
        //   status: "success",
        //   duration: 2000,
        //   isClosable: true,
        // });
        setSelectedImage(response?.url);
        setFormData({
          ...formData,
          [fieldName]: response?.url,
        });
        setImageUploadLoading(false);
      }
      setImageUploadLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error?.message);
      toast({
        title: "Error uploading image" ,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setImageUploadLoading(false);
    }
  };

  const handleCryptoDeposit = async () => {
    if (!inputAmount) {
      toast({
        title: "Validation Error",
        description:
          "Please enter a valid amount and select a payment gateway.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (Object.keys(selectedCurrency).length == 0 && selectedTab !== "manual") {
      toast({
        title: "Currency Selection Required",
        description: "Please select a currency to proceed.",
        status: "warning", // "warning" might be more appropriate for prompting user action
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setNextLoader(true);
    try {
      const payload = {
        amount: Number(inputAmount),
        currencies: selectedCurrency.id,
      };

      const response = await sendPostRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/auto-payment/create-passim-pay-order`,
        payload
      );

      if (response?.data?.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setNextLoader(false);
    }
  };

  const createDeposit= async () => {

  //   if(inputAmount>selectedGateway?.min_limit && inputAmount<selectedGateway?.max_limit){
  //     toast({
  //       title: "Validation Error",
  //       description:
  //         "Amount Must be within transaction range",
  //       status: "warning",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  // }

  if (!inputAmount || !selectedGateway) {
    toast({
      title: "Validation Error",
      description:
        "Please enter a valid amount and select a payment gateway.",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

    const payload = {
      method: selectedGateway.gateway,
      method_url: selectedGateway.image,
      username: adminData?.username,
      method_id:adminData._id,
      admin_id: adminData?.admin_id,
      user_type: "affilate",
      payable:"",
      withdraw_amount: inputAmount,
      bonus: selectedGateway?.bonus,
      after_withdraw: Number(adminData?.amount) + Number(inputAmount),
      wallet_amount: adminData?.amount,
      admin_response: "",
      user_details: formData, // Ensure correct property name
      admin_details: selectedGateway.admin_details,
      utr_no: "",
      currency: adminData?.currency,
      site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY,
      // parent_admin_role_type: adminData?.parent_admin_role_type,
      // parent_admin_username: adminData?.parent_admin_username
  };

  for (let item of selectedGateway?.user_details || []) {
    if (item.required === "true" && !formData[item.name]) {
      toast({
        title: `Please fill out all required fields.`,
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  }

    setDepositLoader(true);
    try {
     
      const response = await sendPostRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/transaction/create-withdraw-request/${adminData?.username}`,
        payload
      );

      if (!response.ok) throw new Error("Failed to create deposit request");
      toast({
        title: "Success",
        description: "withdraw request created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDepositLoader(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
    fetchCryptoPaymentMethods();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: ` ${text} has been copied`,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <>
      <button
        style={{ backgroundColor: bg }}
        onClick={onOpen}
        className={` flex items-center gap-1  duration-500 ease-in-out  text-white rounded-md p-2  text-xs cursor-pointer px-4 font-semibold`}
      >
        <RiBankFill fontSize={"20px"} /> {t(`Deposit`)} {t(`Request`)}
      </button>
      <Modal
        size={{ base: "full", md: "md" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader className="text-center">Deposit Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text className="font-semibold text-sm">Enter Deposit Amount</Text>
            <Input
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.15"
              style={{ outline: "none", border: `1px solid ${border}60` }}
              className="mt-2"
            />
            {selectedGateway&&<div className="mb-2 flex mt-1 justify-between text-xs font-bold">
              <p>Min/Max</p>
              <p>{selectedGateway?.min_limit}/{selectedGateway?.max_limit}</p>
              </div>}
            <div className="w-[100%] flex items-center mt-3 gap-4">
              <Button
                style={{
                  backgroundColor: selectedTab == "manual" ? bg : "",
                  color: selectedTab === "manual" ? "white" : "",
                }}
                onClick={() =>{
                  // setSelectedGateway({})
                  setSelectedTab("manual")}}
                className={`w-[100%] `}
              >
                Manual Deposit
              </Button>
              <Button
                style={{
                  backgroundColor: selectedTab == "crypto" ? bg : "",
                  color: selectedTab === "crypto" ? "white" : "",
                }}
                onClick={() => setSelectedTab("crypto")}
                className="w-[100%]"
              >
                Crypto Deposit
              </Button>
            </div>

            {selectedTab === "manual" && (
              <Box mt={4}>
                <div className="flex items-center gap-2">
                  {/* {selectedGateway && (
                    <TbCircleArrowLeftFilled
                      onClick={() => setSelectedGateway({})}
                      fontSize={"25px"}
                      style={{ color: iconColor, cursor: "pointer" }}
                    />
                  )} */}
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: iconColor }}
                  >
                    Select Payment Gateway
                  </Text>
                </div>

                {!selectedGateway && (
                  <div className="grid grid-cols-4 mt-2 justify-between gap-3">
                    {data?.length>0&&data?.map((gateway) => (
                      <div
                        style={{ border: `1px solid ${border}60` }}
                        key={gateway._id}
                        className="flex flex-col cursor-pointer rounded-md p-1 items-center "
                      >
                        <img
                          src={gateway?.image}
                          className="w-[60px]"
                          onClick={() => setSelectedGateway(gateway)}
                        >
                          {gateway.name}
                        </img>
                        <p className="text-black font-bold text-xs">
                          {gateway?.gateway}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedGateway && (
                  <Box mt={4}>
                    {selectedGateway.admin_details.map((detail, index) => {
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center mb-5"
                        >
                          <div className="flex flex-col">
                            <span className="">{detail?.fieldName}</span>
                          </div>
                          <div
                            onClick={() => copyToClipboard(detail?.fieldValue)}
                            className="flex items-center"
                          >
                            <span
                              style={{ color: iconColor }}
                              className="mr-2 "
                            >
                              {detail?.fieldValue}
                            </span>
                            <button
                              style={{ backgroundColor: bg }}
                              className=" text-white px-4 py-1 text-xs rounded"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {selectedGateway?.user_details?.map((item, index) => {
                      return (
                        <div key={item.id} className="mb-1 mt-1 w-full">
                          <label className="block text-gray-700 mb-2">
                            {item?.name}
                          </label>
                          {item?.type === "file" ? (
                            <input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleInputChange(e, item?.name)}
                              className="w-full p-2  rounded "
                            />
                          ) : (
                            <input
                            style={{border:`1px solid ${border}60`}}
                              type={item?.type}
                              value={formData[item?.name] || ""}
                              onChange={(e) => handleInputChange(e, item?.name)}
                              required={item?.required === "true"}
                              className="w-full p-2  rounded  outline-none"
                            />
                          )}
                          {item.type == "file" && imageUploadLoading ? (
                            <Spinner />
                          ) : (
                            ""
                          )}
                          {item?.required === "true" && (
                            <p className="text-red-500 text-right text-[10px] font-semibold">
                              required
                            </p>
                          )}
                        </div>
                      );
                    })}
                    <div className="bg-purple-200 flex items-start gap-1 justify-start rounded-lg   p-2 mt-2">
                      <span>
                        {" "}
                        <HiInformationCircle fontSize={"20px"} />
                      </span>
                      <p className="flex text-[11px] font-bold leading-[14px]">
                        {selectedGateway?.instruction}
                      </p>
                    </div>
                  </Box>
                )}
              </Box>
            )}
            {selectedTab === "crypto" && (
              <Box mt={4}>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: iconColor }}
                >
                  Select Crypto Gateway
                </Text>
                {cryptoLoader ? (
                  <Spinner />
                ) : (
                  <div className="grid grid-cols-4 mt-3 overflow-scroll h-[60vh] md:h-[300px] gap-2 ">
                    {cryptoData?.map((item) => {
                      return (
                        <div
                          onClick={() => handleSelectCurrent(item)}
                          style={{
                            backgroundColor:
                              selectedCurrencyId == item?.id ? bg : "",
                          }}
                          className="rounded-md cursor-pointer border"
                        >
                          <div
                            className={`flex     pl-1 ${
                              selectedCurrencyId == item?.id ? "text-white" : ""
                            }  h-[40px] border-red-600 items-center gap-2`}
                          >
                            {item?.icon && (
                              <img
                                src={item?.icon}
                                alt="Crypto Image"
                                className="crypto-image w-[30px]"
                              />
                            )}
                            <p className="text-[14px] font-bold">
                              {item?.currency}
                            </p>
                          </div>
                          <p
                            className={`text-[10px] text-center mb-1 ${
                              selectedCurrencyId == item?.id ? "text-white" : ""
                            }`}
                          >
                            {item?.platform || "N/A"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Box>
            )}
          </ModalBody>
          <div className="p-3 mb-3">
            <div className="flex w-[100%] gap-3">
              <Button
                style={{ border: `1px solid ${border}60` }}
                className="w-[100%]"
                ml={3}
                onClick={onClose}
              >
                Close
              </Button>
              {selectedTab === "crypto" ? (
                <Button
                  style={{ backgroundColor: bg, color: "white" }}
                  disabled={nextLoader}
                  className="w-[100%]"
                  onClick={handleCryptoDeposit}
                  isLoading={nextLoader}
                >
                  Proceed
                </Button>
              ) : (
                <Button
                  className="w-[100%]"
                  onClick={createDeposit}
                  isLoading={depositLoader}
                  style={{backgroundColor:bg,color:'white'}}
                >
                Submit
                </Button>
              )}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AdminRequestDeposit;
