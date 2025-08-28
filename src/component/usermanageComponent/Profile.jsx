import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
// import logo from "../../assets/logo.png";
import { AiOutlinePlus } from "react-icons/ai";
import { CircularProgress, Progress, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { sendPatchRequest } from "../../api/api";
import { useTranslation } from "react-i18next";





const Profile = ({type, userData }) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    user_id: "",
    email: "",
    state: "",
    phone: "",
    city: "",
    country: "",
    bank_name: "",
    bank_holder: "",
    account_number: "",
    ifsc_code: "",
    joined_at: "",
    updated_at: "",
    status: true,
    bet_supported: true,
    is_blocked: true,
    is_online: true,
    last_seen: "",
    profile_picture: "",
    referral_code: "",
    amount: 0,
    exposure_limit: 0,
    max_limit: 0,
    min_limit: 0,
    sms_verified: true,
    kyc_verified: true,
  });
  const param = useParams();
  const { t, i18n } = useTranslation();

  const toast = useToast();
  const { color,primaryBg,secondaryBg, bg,iconColor,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
  const handleUpdate = async () => {
    setLoading(true);
    let url;
    if(type==="user"){
       url = `${import.meta.env.VITE_API_URL}/api/admin/update-single-user/${param.id}`

    }
    else{
      url = `${import.meta.env.VITE_API_URL}/api/admin/update-single-admin/${param.id}`

    }

    try {
      let response = await sendPatchRequest(url, formData);
      const data = response.data;
      setData(data);
      toast({
        description: `${response?.message}`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);

    } catch (error) {
      toast({
        description: `${error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setFormData(userData);
  }, [userData]);
  return (
    <div className="flex gap-4">
      <div className="flex flex-col w-[100%] gap-2">
      

        <div
        style={{border:`1px solid ${border}60`}}
          className={`w-[100%] flex bg-white text-black flex-col  justify-between m-auto mt-5  p-5 rounded-md `}
        >
          <p className=" text-sm  font-bold ">{t(`Basic`)} {t(`Info`)}</p>

          <div className=" flex w-[100%] mt-4 justify-between">
            <div className="text-xs w-[90%]  flex flex-col gap-1">
            <label className="font-bold">{t(`Username`)}</label>
              <input
                value={formData?.username}
                name="first_name"
                onChange={handleChange}
                style={{border:`1px solid ${border}60`}}
                placeholder="Country"
                className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-md p-2`}
              />
            </div>

            
            <div className="text-xs w-[90%] flex flex-col gap-1">
            <label className="font-bold">{t(`Email`)}</label>
              <input
                name="email"
                value={formData?.email}
                onChange={handleChange}
                readOnly
                style={{border:`1px solid ${border}60`}}
                placeholder="Country"
                className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-md p-2`}
              />
            </div>
          </div>

          <div className=" flex   w-[100%] mt-4  justify-between">
         <div className="text-xs w-[90%]  flex flex-col gap-1">
         <label className="font-bold">{t(`Phone`)}</label>
          <input
             value={formData?.phone}
             name="phone"
             onChange={handleChange}
             readOnly
             style={{border:`1px solid ${border}60`}}
             placeholder="Country"
             className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-md p-2`}
           />
         </div>
         <div className="text-xs w-[90%]  flex flex-col gap-1">
         <label className="font-bold">{t(`City`)}</label>
             <input
             name="city"
             value={formData?.city}
             onChange={handleChange}
             readOnly
             style={{border:`1px solid ${border}60`}}
             placeholder="Country"
             className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-md p-2`}
           />
         </div>
          </div>


          <div className=" flex   w-[100%] mt-4  justify-between">
            <div className="text-xs w-[90%]  flex flex-col gap-1">
              <label className="font-bold">{t(`Country`)}</label>
              <input
                name="country"
                value={formData?.country}
                onChange={handleChange}
                style={{border:`1px solid ${border}60`}}
                placeholder="Country"
                className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-md p-2`}
              />
            </div>

            
            <div className="text-xs w-[90%]  flex flex-col gap-1">
              <label className="font-bold">{t(`Currency`)}</label>
              <input
                name="country"
                value={formData?.currency}
                onChange={handleChange}
                readOnly
                style={{border:`1px solid ${border}60`}}
                placeholder="Country"
                className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-md p-2`}
              />
            </div>
          </div>

          <div className=" flex   w-[100%] mt-4  justify-between">
            <div className="text-xs w-[90%]  flex flex-col gap-1">
              <label className="font-bold">{t(`VIP Level`)}</label>
              <input
                name="vip_level"
                value={formData?.vip_level}
                onChange={handleChange}
                readOnly
                style={{border:`1px solid ${border}60`}}
                placeholder="VIP Level"
                className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-md p-2`}
              />
            </div>

            
            <div className="text-xs w-[90%]  flex flex-col gap-1">
              <label className="font-bold">{t(`Referral Code`)}</label>
              <input
                name="referral_code"
                value={formData?.referral_code}
                onChange={handleChange}
                readOnly
                style={{border:`1px solid ${border}60`}}
                placeholder="Referral Code"
                className={`w-[90%] text-xs border  bg-[#E9ECEF]    outline-none rounded-md p-2`}
              />
            </div>
          </div>
        </div>
        {/* Bank Details */}
        <div
          style={{border:`1px solid ${border}60`}}
          className={`w-[100%] bg-white flex flex-col justify-between m-auto mt-3  p-5 rounded-md `}
        >
          <p className=" text-sm  font-bold ">{t(`Bank`)} {t(`Details`)}</p>

          <div className="w-[100%]  grid grid-cols-2   mt-3  pb-3  gap-3 justify-between ">
            <div className="text-xs w-[90%]  flex flex-col gap-2">
              <label className="font-bold">{t(`Bank`)} {t(`Name`)}</label>
              <input
                name="bank_name"
                value={formData?.bank_name}
                onChange={handleChange}

                placeholder="Bank Name"
                style={{border:`1px solid ${border}60`}}
                className={`w-[100%] text-xs  bg-[#E9ECEF]    outline-none rounded-md p-2`}
              />
            </div>
            <div className="text-xs w-[90%] flex flex-col gap-2">
              <label className="font-bold">{t(`Bank`)} {t(`Holder`)}</label>
              <input
                name="bank_holder"
                value={formData?.bank_holder}
                onChange={handleChange}
                style={{border:`1px solid ${border}60`}}
                placeholder="Bank Holder"
                className={`w-[100%] text-xs    bg-[#E9ECEF]    outline-none  rounded-md p-2`}
              />
            </div>
            <div className="text-xs w-[90%]  flex flex-col gap-2">
              <label className="font-bold">{t(`Account`)} {t(`Number`)}</label>
              <input
                name="account_number"
                value={formData?.account_number}
                onChange={handleChange}
               
                placeholder="Account Number"
                style={{border:`1px solid ${border}60`}}
                className={`w-[100%] text-xs    bg-[#E9ECEF]   outline-none  rounded-md p-2`}
              />
            </div>
            <div className="text-xs w-[90%]  flex flex-col gap-2">
              <label className="font-bold"> {t(`Code`)}</label>
              <input
                value={formData?.ifsc_code}
                onChange={handleChange}
                
                placeholder="IFSC Code"
                style={{border:`1px solid ${border}60`}}
                className={`w-[100%] text-xs    bg-[#E9ECEF]     outline-none  rounded-md p-2`}
              />
            </div>
          </div>
        </div>


        {/* User withdraw Limit */}


        {userData.role_type=="user"&&<div
          style={{border:`1px solid ${border}60`}}
          className={`w-[100%] flex flex-col bg-white justify-between m-auto mt-3  p-5 rounded-md `}
        >
          <p className=" text-sm  font-bold ">{t(`Withdraw`)} {t(`Limit`)}</p>

          <div className="w-[100%]  grid grid-cols-2   mt-3  pb-2  gap-3 justify-between ">
            <div className="text-xs w-[90%]  flex flex-col gap-2">
              <label className="font-bold">{t(`Min`)} {t(`Limit`)}</label>
              <input
                name="min_limit"
                value={formData?.min_limit}
                onChange={handleChange}
               
                placeholder="Bank Name"
                style={{border:`1px solid ${border}60`}}
                className={`w-[100%] text-xs border bg-[#E9ECEF]    outline-none rounded-md p-2`}
              />
            </div>
            <div className="text-xs w-[90%]  flex flex-col gap-2">
              <label className="font-bold">{t(`Max`)} {t(`Limit`)}</label>
              <input
                name="max_limit"
                value={formData?.max_limit}
                onChange={handleChange}
                
                placeholder="Bank Holder"
                style={{border:`1px solid ${border}60`}}
                className={`w-[100%] text-xs   border bg-[#E9ECEF] outline-none rounded-md p-2`}
              />
            </div>
           
          </div>
        </div>}


        {/* button */}
        <div className="w-[100%] mb-10  m-auto">
          <button
            onClick={handleUpdate}
            disabled={loading}
            style={{backgroundColor:bg}}
            className={`p-3 text-white  text-xs font-semibold w-[100%] rounded-[5px]`}
          >
            {loading ? <CircularProgress size={"15px"} /> : `${t(`Save`)} ${t(`Changes`)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;




// const socket = io('${process.env.NEXT_PUBLIC_BASE_URL}');

// const sendNotification = () => {
//   socket.emit('sendNotification', { message: notificationMessage });
//   setNotificationMessage(''); // Clear the input field after sending the notification
// };

// useEffect(() => {
//   // Listen for 'adminNotification' event
//   socket.on('adminNotification', (data) => {
//     // Update notifications in the state when a new notification is received
//     setNotifications([...notifications, data.message]);
//   });

//   // Clean up event listener on component unmount
//   return () => {
//     socket.disconnect();
//   };
// }, []);