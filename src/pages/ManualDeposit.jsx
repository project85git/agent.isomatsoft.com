import React, { useEffect, useState } from "react";

import { BsSearch } from "react-icons/bs";

import { RxCross2 } from "react-icons/rx";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdCancel, MdCheckCircle, MdEdit, MdSportsEsports } from "react-icons/md";
import BankDetails from "../component/depositgetway/BankDetails";
import { Button, CircularProgress, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Switch, useToast } from "@chakra-ui/react";
// import {
//   fetchGetRequest,
//   sendDeleteRequest,
//   sendPatchRequest,
//   sendPostRequest,
// } from "@/api/api";
import { FaArrowLeftLong } from "react-icons/fa6";
import logo from "../assets/logo.png";
import UserDetails from "../component/depositgetway/UserDetails";
import { useSelector } from "react-redux";
import { IoSearchOutline } from "react-icons/io5";
// import DepositUpdateModel from "../component/depositgetway/DepositUpdateModel";
import { MdModeEdit } from "react-icons/md";
import { BiSolidBank } from "react-icons/bi";
import {
  fetchGetRequest,
  sendDeleteRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../api/api";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { checkPermission } from "../../utils/utils";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
const initialFormData = {
  gateway: "",
  currency: "",
  processing_time: "",
  image: "",
  max_limit: 0,
  min_limit: 0,
  instruction: "",
  admin_details: [],
  user_details: [],
  bonus: 0,
  type: "deposit",
};
const initialField = {
  name: "",
  type: "",
  required: "",
};

const ManualDeposit = () => {
  const [show, setShowWithdral] = useState(false);
  const [gateways, setGateways] = useState(initialFormData.admin_details);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formFields, setFormFields] = useState(initialFormData.user_details);
  const [paymentData, setPaymentData] = useState([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [updateId, setUpdateId] = useState("");
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const toast = useToast();
  const [loading, setLoading] = useState();
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    borderColor,
    secondaryColor,
    textColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);

  const [addLoading, setAddLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteId, setDeleteId]=useState(null)
  const [isDeleteModalOpen,setIsDeleteModalOpen]=useState(false);
  const [deleteLoading, setDeleteLoading]=useState(false);
  const { t, i18n } = useTranslation();

  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;

  const permissionDetails = user?.user?.permissions;

  let hasPermission = checkPermission(permissionDetails, "manualDepositManage");
  let check = !isOwnerAdmin ? hasPermission : true;
  const handleGetway = () => {
    setFormData(initialFormData);
    setGateways(initialFormData.admin_details)
    setFormFields(initialFormData.user_details)
    setSelectedImage(null);

    setShowWithdral(true);
    setShowUpdateButton(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    handleImageUpload(file);
  };

  const handleFormChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // handle status update here

  const handleUpdateStatus = async (id) => {
    setStatusLoading(true);
    try {
      const response = await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/update_payment_method_status/${id}`
      );
      let updated_data = paymentData.map((ele) => {
        if (ele._id == id) {
          ele = response.data;
          return ele;
        } else {
          return ele;
        }
      });
      setPaymentData(updated_data);
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setStatusLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setStatusLoading(false);
  };

  const deletePaymentGateway = async (id) => {
  setDeleteId(id)
  setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete=async()=>{
    setDeleteLoading(true)
    try {
      const response = await sendDeleteRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/delete-payment-method/${deleteId}`
      );
      let updated_data = paymentData.filter((ele) => ele._id !== deleteId);
      setPaymentData(updated_data);
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setDeleteLoading(false)
      setIsDeleteModalOpen(false)
    } catch (error) {
      setDeleteLoading(false)
      console.error("Error uploading image:", error.message);
      toast({
        title: error?.message||error?.data?.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
    }
  }

  const handleCancelDelete=()=>{
    setDeleteId(null)
    setIsDeleteModalOpen(false);
  }
  const getPaymentGateway = async () => {
    setGetLoading(true);
    try {
      const response = await fetchGetRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/get-payment-method-admin?type=deposit`
      );
      setPaymentData(response.data);
      setGetLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setGetLoading(false);
    }
  };

  // image upload
  const handleImageUpload = async (file) => {
    setLoading(true);
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
        setSelectedImage(response.url);
    setLoading(false);

      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    setLoading(false);

    }
  };

  const handleSubmitGateway = async () => {
    const payload = {
      ...formData,
      admin_details: gateways,
      user_details: formFields,
      image: selectedImage,
      type: "deposit",
      admin_id: adminData.admin_id,
    };
    setAddLoading(true);
    try {
      const response = await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/payment/add-method`,
        payload
      );
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setAddLoading(false);
      setFormData(initialFormData);
      setShowWithdral(false);
      getPaymentGateway()
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      toast({
        title: error?.data?.message,
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      setAddLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    const payload = {
      ...formData,
      admin_details: gateways,
      user_details: formFields,
      image: selectedImage,
      type: "deposit",
      admin_id: adminData.admin_id,
    };
    setUpdateLoading(true);
    try {
      const response = await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/update-payment-method/${updateId}`,
        payload
      );
      toast({
        title: response.message,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setUpdateLoading(false);
      setShowUpdateButton(false);
      setShowWithdral(false);
      getPaymentGateway()
    } catch (error) {
      setUpdateLoading(false);

      toast({
        title: error?.data?.message || error?.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getPaymentGateway();
  }, []);
  const handleUpdateData = (data) => {
    setFormData(data);
    setGateways(data.admin_details);
    setFormFields(data.user_details);
    setUpdateId(data._id);
    setShowWithdral(true);
    setSelectedImage(data.image);
  };




  return (
    <div className=" mt-8">
      {!show && (
        <p
          style={{ color: iconColor }}
          className={`font-bold mt-5 p-2 w-[100%] flex items-center gap-2 rounded-[6px]  text-lg`}
        >
          <BiSolidBank style={{ color: iconColor }} fontSize={"30px"} />
          {t(`Manual`)} {t(`Deposit`)}
        </p>
      )}
      {!show ? (
        <div>
          <div
            className={`flex justify-between mt-2 p-2 m-auto items-center`}
          >
            <div
              style={{ border: `1px solid ${border}60` }}
              className={`border flex  bg-white justify-between rounded-[8px] pl-1  items-center gap-2 w-[100%] lg:w-[30%] `}
            >
              <input
                placeholder={`${t(`Search here`)}...`}
                className={`outline-none rounded-[8px] p-[6px]  text-black text-xs md:text-sm  w-[70%]`}
              />
              <span
                style={{ backgroundColor: bg }}
                className={`p-[6px] rounded-r-[8px] cursor-pointer `}
              >
                <IoSearchOutline fontSize={"22px"} color="white" />
              </span>
            </div>
            <div className={` flex items-end justify-end  w-[100%]   gap-4  `}>
            { check&& <button
                onClick={handleGetway}
                style={{ backgroundColor: bg }}
                className={`  px-2 flex gap-2 text-sm items-center  text-white  font-semibold rounded-md pl-3 py-2 md:py-3`}
              >
                <span>
                  <AiOutlinePlus size="20px" color="white" />
                </span>{" "}
                {t(`Add`)} {t(`New`)} {t(`Gateway`)}
              </button>}
            </div>
          </div>
          <div className="p-4 ml-10">
            {getLoading ? (
             <center style={{ height: '60vh' ,display:"flex", justifyContent:"center", alignItems:"center"}}>
             <LoadingSpinner thickness={3} size={"lg"} />
           </center>
            ) : (
              ""
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 p-2 m-auto">
  {paymentData &&
    paymentData.map((item) => (
      <div
        key={item._id}
        style={{ backgroundColor: bg }}
        className="flex flex-col justify-between h-[250px] rounded-md p-4 transition-transform transform hover:scale-105 hover:shadow-lg shadow-md duration-300 ease-in-out"
      >
        {/* Top Section with Image, Gateway Name, and Bonus */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 items-center">
            <img
              src={item.image}
              className="w-[45px] h-[45px] rounded-full object-cover border-2 border-white"
              alt="logo"
            />
            <div>
              <p className="text-base font-semibold text-white">{item.gateway}</p>
              <p className="text-sm font-semibold text-green-500">+ {item.bonus}</p>
            </div>
          </div>
          {check && (
            <button onClick={() => deletePaymentGateway(item._id)} className="text-white">
              <RxCross2 fontSize="22px" className="hover:text-red-500" />
            </button>
          )}
        </div>

        {/* Status Button with Icon */}
        <div className="flex justify-end mb-4">
          <button
            className={`flex items-center gap-2 text-xs px-2 py-1 rounded-sm font-semibold ${
              item.status ? "bg-green-600 text-white" : "bg-red-500 text-white"
            }`}
          >
            {item.status ? (
              <>
                <MdCheckCircle fontSize="16px" /> Enabled
              </>
            ) : (
              <>
                <MdCancel fontSize="16px" /> Disabled
              </>
            )}
          </button>
        </div>

        {/* Bottom Section with Switch and Edit Button */}
        <div className="flex justify-between items-center">
          {check && (
            <div className="flex items-center gap-2 text-white">
              <Switch
                colorScheme="blue"
                size="md"
                defaultChecked={item.status}
                onChange={() => handleUpdateStatus(item._id)}
              />
              <span className="text-sm">{t("Status")}</span>
            </div>
          )}
          {check && (
            <button
              onClick={() => handleUpdateData(item)}
              className="flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-sm bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
            >
              <MdModeEdit fontSize="18px" className="text-blue-600" />
              {t("Edit")}
            </button>
          )}
        </div>
      </div>
    ))}
          </div>

        </div>
      ) : (
        <div>
          {/* first layer */}
          <FaArrowLeftLong
            onClick={() => {
              setShowWithdral(false);
              setShowUpdateButton(false);
            }}
            style={{ color: iconColor }}
            className={`ml-10 cursor-pointer `}
            fontSize={"20px"}
          />

          <div className=" w-[95%] md:w-[85%] m-auto gap-4 flex flex-col md:flex-row justify-between">
            <div
              style={{ border: `1px solid ${border}60` }}
              className={`w-[55%] sm:w-[35%] bg-white m-auto md:w-[20%] flex flex-col relative items-center justify-center rounded-md h-[190px]`}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  className="w-[110px] rounded-[50%] h-[110px]"
                  alt="Selected"
                />
              ) : (
                <img
                  src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
                  className="w-[140px]"
                />
              )}
               {loading &&
                <LoadingSpinner
                 
                  size={"sm"}
                  color="orange.400"
                  thickness="2px"
                />
               }
              <label htmlFor="file-upload" className="cursor-pointer">
                <span
                  className={`rounded-[30%] p-2 absolute right-[30px] bottom-[50px] bg-[#0075FF] flex items-center justify-center`}
                >
                  <MdEdit color="white" fontSize="20px" />
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
            <div
              style={{ border: `1px solid ${border}60` }}
              className={` w-[95%] md:w-[85%]  bg-white font-semibold flex m-auto justify-between items-center p-4 rounded-md h-[100%] md:h-[190px]`}
            >
              <div className="w-[100%] flex px-2 flex-col md:flex-row   gap-3 justify-between ">
                <div
                  className={`text-xs w-[100%] md:w-[60%]  flex flex-col gap-2`}
                >
                  <label>{t(`Gateway`)} {t(`Name`)}</label>
                  <input
                    name="gateway"
                    value={formData?.gateway}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Getway Name"
                    style={{ border: `1px solid ${border}60` }}
                    className={`w-[100%] text-xs   outline-none rounded-md p-2`}
                  />
                </div>
                <div className="text-xs  w-[100%] md:w-[40%]  flex flex-col gap-2">
                  <label>{t(`Currency`)}</label>
                  <input
                    name="currency"
                    value={formData.currency}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Currency"
                    style={{ border: `1px solid ${border}60` }}
                    className={`w-[100%] text-xs   border outline-none  rounded-md p-2`}
                  />
                </div>
                <div className="text-xs  w-[100%] md:w-[40%]  flex flex-col gap-2">
                  <label>{t(`Processing`)} {t(`Time`)}</label>
                  <input
                    type="number"
                    name="processing_time"
                    value={formData.processing_time}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Processing Time"
                    style={{ border: `1px solid ${border}60` }}
                    className={`w-[100%]  text-xs   border outline-none  rounded-md p-2`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* secondlayer */}
          <BankDetails gateways={gateways} setGateways={setGateways} />

          {/* thirdlayer */}

          <UserDetails formFields={formFields} setFormFields={setFormFields} />

          {/* fourthlayer */}
          <div className=" w-[95%] md:w-[85%] mt-5 m-auto gap-4 flex flex-col md:flex-row justify-between">
            <div
              style={{ border: `1px solid ${border}60` }}
              className={`w-[100%%] md:w-[85%]  bg-white  font-semibold rounded-md h-[280px]`}
            >
              <div className="w-[100%] flex flex-col pl-3 mt-5 px-2   gap-3 justify-between ">
                <p className=" text-sm font-bold ">{t(`Deposit`)} {t(`Instruction`)}</p>
                <textarea
                  value={formData?.instruction}
                  onChange={(e) => handleFormChange(e)}
                  name="instruction"
                  placeholder="Instruction"
                  style={{ border: `1px solid ${border}60` }}
                  className={`min-h-[170px] outline-none p-4  rounded-md  bg-[none] `}
                ></textarea>
              </div>
            </div>

            <div
              style={{ border: `1px solid ${border}60` }}
              className={`w-[100%]  bg-white md:w-[60%] rounded-md h-[280px]`}
            >
              <div className="w-[100%] flex flex-col pl-3 mt-5 px-2   gap-3 justify-between ">
                <p className=" text-sm font-bold ">{t(`Deposit`)} {t(`Range`)}</p>
                <div className="text-xs w-[90%]  flex flex-col gap-2">
                  <label>{t(`Min`)} {t(`Limit`)}</label>
                  <input
                    placeholder="Enter Min"
                    name="min_limit"
                    value={formData.min_limit}
                    onChange={(e) => handleFormChange(e)}
                    style={{ border: `1px solid ${border}60` }}
                    className={`w-[100%] text-xs  outline-none rounded-md p-2`}
                  />
                </div>
                <div className="text-xs w-[90%]  flex flex-col gap-2">
                  <label>{t(`Max`)} {t(`Limit`)}</label>
                  <input
                    name="max_limit"
                    value={formData.max_limit}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Max"
                    style={{ border: `1px solid ${border}60` }}
                    className={`w-[100%] text-xs    outline-none  rounded-md p-2`}
                  />
                </div>
                {/* <div className="text-xs w-[90%]  flex flex-col gap-2">
                  <label>Bonus</label>
                  <input
                    name="bonus"
                    value={formData.bonus}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="Enter Bonus"
                    style={{ border: `1px solid ${border}60` }}
                    className={`w-[100%] text-xs    outline-none  rounded-md p-2`}
                  />
                </div> */}
              </div>
            </div>
          </div>
          {/* button */}
          {showUpdateButton ? (
            <div className="w-[85%]  mt-6 m-auto">
              <button
                onClick={() => handleSubmitGateway()}
                style={{ backgroundColor: bg }}
                className={`p-3 text-white text-xs font-semibold w-[100%] rounded-[5px]  `}
              >
                {!addLoading ? (
                  `${t(`Create`)} ${t(`Gateway`)}`
                ) : (
                  <div className="flex justify-center items-center">
                    <div className="w-5 h-5 border-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          ) : (
            <div className="w-[85%]  mt-6 m-auto">
              <button
                onClick={() => handleUpdate(formData.id)}
                style={{ backgroundColor: bg }}
                className={`p-3 text-white text-xs font-semibold w-[100%] rounded-[5px] `}
              >
                {!updateLoading ? (
                `${t(`Update`)}`
                ) : (
                  <div className="flex justify-center items-center">
                    <div className="w-5 h-5 border-4 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isDeleteModalOpen} onClose={handleCancelDelete}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: secondaryColor }}>
          <ModalHeader style={{ color: textColor }}>{t(`Are You Sure?`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p style={{ color: textColor }}>{`Are you sure you want to delete this`} <span className='font-bold'>{name}</span>.</p>
          </ModalBody>

          <ModalFooter>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                colorScheme="red"
                onClick={handleConfirmDelete}
                className='w-[100px]'
                isLoading={deleteLoading}
              >
                {loading?<LoadingSpinner color="white" size="sm" thickness="2px"/>:`${t(`Delete`)}`}
              </Button>
              <Button
                onClick={handleCancelDelete}
                variant="outline"
                style={{ color: textColor, borderColor: borderColor }}
              >
                {t(`Cancel`)}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
};

export default ManualDeposit;
