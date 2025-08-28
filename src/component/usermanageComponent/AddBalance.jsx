import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { PiBankFill, PiHandDepositBold } from "react-icons/pi";
import { sendPostRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useTranslation } from "react-i18next";



function AddBalance({userData,getData,title, type="profile"}) {

const { color,primaryBg,secondaryBg, bg,iconColor,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
const { t, i18n } = useTranslation();
  
const { isOpen, onOpen, onClose } = useDisclosure();
const [amount, setAmount] = useState(0);
const [totalBalance, setTotalBalance] = useState();
const [loading, setLoading] = useState(false);
const toast = useToast();
const [depsoitResponse,setDepositResponse]=useState("")
const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
const addBalance = async () => {
  if(amount<=0)return;
  setLoading(true)
  try {
    let url;
    let userKey;
    if (title === "user") {
      url = `${import.meta.env.VITE_API_URL}/api/admin/deposit-amount-user`;
      userKey = "user_id";
    } else if (title === "admin") {
      url = `${import.meta.env.VITE_API_URL}/api/admin/deposit-amount`;
      userKey = "admin_id";
    } else {
      throw new Error("Invalid title provided");
    }
    
    const requestData = {
      username: userData.username,
      deposit_amount: Number(amount),
      admin_response: depsoitResponse,
      parent_admin_id: adminData.admin_id,
      [userKey]: userData[userKey], 
      user_type: title,
      currency:userData?.currency 
    };

    const response = await sendPostRequest(url, requestData);
    setTotalBalance(response.data.amount);
    setLoading(false)
      toast({
        description: `${amount} deposit successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      getData()
    setLoading(false);

    setAmount(0);
    setDepositResponse("")
    onClose();
  } catch (error) {
    setLoading(false)
    toast({
      description: `${error?.data?.message}`,
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
  }
};
const handleAddBalance = (e) => {
  e.preventDefault()
  addBalance();
};


  return (
    <>
      {type=="profile"?<button
        onClick={onOpen}
       style={{backgroundColor:bg}}
        className={`w-[100%] font-semibold text-white text-xs rounded-[5px] p-[7px]`}
      >
        {t(`Deposit`)} {t(`Balance`)}
      </button>:<Tooltip label={"Deposit"} bg={bg} aria-label={`Deposit`} hasArrow>
      <button onClick={onOpen} style={{border:`1px solid ${border}60`,backgroundColor:primaryBg}} className={`w-[25px] flex items-center border  justify-center rounded-[6px] h-[25px]`}>
        <PiHandDepositBold onClick={onOpen} fontSize={"20px"} cursor={"pointer"} color={iconColor} />
      </button>
      </Tooltip>}
      <Modal size={["full", "md"]} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{ backgroundColor: "white", color: "black" }}>
          <ModalCloseButton />
          <ModalBody>
          <div className=" flex flex-col items-center justify-center mt-5">
                <div className="flex items-center flex-col">
                <PiBankFill style={{color:iconColor}} fontSize={"40px"}  />
                  <p className="text-sm mt-4 font-bold">{t(`Please`)} {t(`Enter`)} {t(`Your`)} {t(`Amount`)}</p>
                  {/* <p className="text-sm font-medium">Enter your Password to make this change</p> */}

                </div>
                <div className="w-[100%] mt-6">
                  <form onSubmit={handleAddBalance}>
                   
                  
                   
                    <div className="mb-4 flex flex-col gap-4">
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="password"
                        >
                          {t(`Available`)} {t(`Balance`)}:  {userData?.amount?.toFixed(2)}
                        </label>
                       
                      <div>
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="confirm_password"
                        >
                          {t(`Enter`)} {t(`Amount`)}:
                        </label>
                        <div className="relative">
                        <input
                        style={{ border: `1px solid ${border}60` }}
                        className="w-full px-3 py-1 outline-none rounded-md"
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow only positive integers
                          if (/^\d*$/.test(value)) {
                            setAmount(value);
                          }
                        }}
                        required
                      />
                         
                        </div>
                      </div>
                      <div>
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="confirm_password"
                        >
                          {t(`Remarks`)}:
                        </label>
                        <div className="relative">
                          <textarea
                          style={{border:`1px solid ${border}60`}}
                                value={depsoitResponse}
                                onChange={(e)=>setDepositResponse(e.target.value)}
                            className="w-full px-3 py-1 outline-none  rounded-md"
                            type="number"  
                            
                          />
                         
                        </div>
                      </div>
                    </div>
                 
                    <div className="flex flex-col my-5 mt-6 gap-5 justify-between">
                    <button
                        disabled={amount<=0}
                        style={{backgroundColor:bg}}
                        className={` w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                        type="submit"
                      >
                        {loading?<LoadingSpinner color="white" size="sm"  thickness={"2px"}/>:`${t(`Deposit`)}`}
                      </button>
                      <button
                      onClick={onClose}
                        className="bg-gray-300 font-semibold  w-[100%] py-[6px] rounded-md mr-2"
                        type="button"
                      >
                        {t(`Cancel`)}
                      </button>
                     
                    </div>
                  </form>
                </div>
              </div>
              </ModalBody>
        
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddBalance;
