import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    Tooltip,
  } from "@chakra-ui/react";
  import { IoEyeSharp } from "react-icons/io5";
  import { IoEyeOffSharp } from "react-icons/io5";
  import { IoIosPersonAdd } from "react-icons/io";
  
  import adduser from "../assets/addnewuser.png";
  import { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
  import changePassword from '../assets/changePassword.png'
import { useSelector } from "react-redux";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { sendPatchRequest } from "../api/api";
import { useTranslation } from "react-i18next";
  function ChangePassword({type,id}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { color,primaryBg,secondaryBg,iconColor, bg,hoverColor,hover,text, font, border } = useSelector(state => state.theme);
    const [hoveredId,setHoveredId]=useState(false)
  const [password,setPassword]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
const toast=useToast()
  const [loading,setLoading]=useState(false)
  const { t, i18n } = useTranslation();
  
  
    const handleUpdatePassword = async (e) => {
      e.preventDefault()
      if (password === confirmPassword) {
       
        const payload = {
          password: password,
          [type === "user" ? "user_id" : "admin_id"]: id,
        };
        setLoading(true);
       
        try {
          let url;
          if (type === "user") {
            url = `${import.meta.env.VITE_API_URL}/api/admin/user-reset-password`;
          } else if (type === "admin") {
            url = `${import.meta.env.VITE_API_URL}/api/admin/admin-reset-password`;
          }
          
          const response = await sendPatchRequest(url, payload);
          toast({
            title: response.message,
            status: "success",
            duration: 2000,
            position: "top",
            isClosable: true,
          });
          setLoading(false);
          onClose();
        } catch (error) {
          toast({
            title: error?.response?.data?.message,
            status: "error",
            duration: 2000,
            position: "top",
            isClosable: true,
          });

        }
        setLoading(false);
      } else {
        toast({
          title: "Both password are not same",
          status: "warning",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
      }
    };
  
  
    return (
      <>
           <Tooltip label={"Password"} bg={bg} aria-label={`Password`} hasArrow>
          <button onClick={onOpen} style={{border:`1px solid ${border}60`,backgroundColor:primaryBg}} className={`w-[25px] flex items-center border  justify-center rounded-[6px] h-[25px]`}>
            <RiLockPasswordLine style={{color:iconColor}} fontSize={"20px"} />
          </button>
          </Tooltip>
        <Modal size={["full","sm"]} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <div className=" flex flex-col items-center justify-center mt-5">
                <div className="flex items-center flex-col">
                  <img className="w-[60px]" src={changePassword} alt="" />
                  <p className="text-sm mt-4 font-bold">{t(`Please`)} {t(`Enter`)} {t(`Your`)} {t(`Password`)}</p>
                  <p className="text-sm font-medium">{t(`Enter`)} {t(`your`)} {t(`Password`)} {t(`to`)} {t(`make`)} {t(`this`)} {t(`change`)}</p>

                </div>
                <div className="w-[100%] mt-6">
                  <form onSubmit={handleUpdatePassword}>
                   
                  
                   
                    <div className="mb-4 flex flex-col gap-4">
                      <div>
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="password"
                        >
                          {t(`Password`)}:
                        </label>
                        <div className="relative">
                          <input
                            className="w-full px-3 py-1 outline-none border rounded-md"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                          />
                          <button
                            className="absolute top-0 right-0 mr-2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                          >
                            {showPassword ? (
                              <IoEyeSharp
                                cursor={"pointer"}
                                fontSize="20px"
                                color="gray"
                              />
                            ) : (
                              <IoEyeOffSharp
                                cursor={"pointer"}
                                fontSize="20px"
                                color="gray"
                              />
                            )}
                          </button>
                        </div>
                      </div>
  
                      <div>
                        <label
                          className="block mb-1 font-semibold text-sm"
                          htmlFor="confirm_password"
                        >
                          {t(`Confirm Password`)}:
                        </label>
                        <div className="relative">
                          <input
                            className="w-full px-3 py-1 outline-none border rounded-md"
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm_password"
                            name="confirm_password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                          />
                          <button
                            className="absolute top-0 right-0 mr-2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            type="button"
                          >
                            {showConfirmPassword ? (
                              <IoEyeSharp
                                cursor={"pointer"}
                                fontSize="20px"
                                color="gray"
                              />
                            ) : (
                              <IoEyeOffSharp
                                cursor={"pointer"}
                                fontSize="20px"
                                color="gray"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                 
                    <div className="flex flex-col my-5 mt-6 gap-5 justify-between">
                    <button
                    style={{backgroundColor:bg}}
                        className={` w-[100%] text-white px-4 font-semibold py-[6px] rounded-md`}
                        type="submit"
                      >
                        {loading?<LoadingSpinner color="white" size="sm" thickness={"2px"} />:`${t(`Confirm`)}`}
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
  
  export default ChangePassword;
  