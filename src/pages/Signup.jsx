import bg from '../assets/2787870.png'
import bg1 from '../assets/6343845.png'
import bg3 from '../assets/bg3.png'

import React, { FormEvent, useEffect, useState } from "react";

import { HStack, PinInput, PinInputField, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
} from "../redux/auth-redux/actions";
import { useDispatch } from "react-redux";
import { saveUserDetails } from "../redux/middleware/localstorageconfig";
import LoadingSpinner from "../component/loading/LoadingSpinner";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";

import { IoInformationCircle } from 'react-icons/io5'
import { Tooltip } from '@chakra-ui/react'
import { InfoIcon, SearchIcon } from '@chakra-ui/icons'

import login9 from '../assets/bg3.png'
import account from '../assets/account.png'



const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showOtp, setShowOtp] = useState(false);

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();
    const naviagte = useNavigate();
    const [admiBlockStatus,setAdminBlockStatus]=useState(false)
  const [email,setEmail]=useState('')
  const [scretCode,setScretCode]=useState('')
  const [admin,checkAdmin]=useState(false)
const [qrCode,setQrcode]=useState("")
const [verfifyLoading,setVerifyLoading]=useState(false)

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      const payload = {
        username: username.trim(),
        password: password.trim(),
      };
      dispatch(loginRequest());
      setAdminBlockStatus(false)
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/admin-login`,
          payload
        );
        if(response?.data?.status==23){

        if (response.data.success) {
          toast({
            title: response.data.message,
            status: "success",
            duration: 2000,
            position: "top",
            isClosable: true,
          });
  
          dispatch(loginSuccess(response.data));
  
          const admindetails = {
            token: response?.data?.token,
            usernametoken: response?.data?.usernameToken,
          };
  
          naviagte("/");
          saveUserDetails("adminauth", admindetails);
          saveUserDetails("adminData",response.data)
        } else if (!response.data.success && response.data.status === "401") {
          toast({
            title: response.payload.message,
            status: "warning",
            duration: 2000,
            position: "top",
            isClosable: true,
          });
        } else {
  
          toast({
            title: `${response?.data?.message}`,
            status: "error",
            duration: 2000,
            position: "top",
            isClosable: true,
          });
  
        }
      }
      else if(response?.data?.status==22){
        toast({
          title: "Please authenticate your self ! ",
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        })
        QrSetup(response?.data?.email)
        setEmail(response?.data?.email)
        checkAdmin(true)


      }
      else {
          toast({
            title: response?.message||response?.data?.message,
            status: "error",
            duration: 2000,
            position: "top",
            isClosable: true,
        })
      }
  
        setLoading(false);
      } catch (error) {
        if(error?.response?.data?.message==="You have been blocked, contact admin." ){
          setAdminBlockStatus(true)
  
        }
        toast({
          title: error?.response?.data?.message || error?.data?.message||error?.message,
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
  
  
        dispatch(loginFailure(error.message));
        setLoading(false);
      }
    };


    const QrSetup=async(email)=>{
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/qr-setup`,
          {
            email:email
          }
        );
        setQrcode(response?.data?.qrCode)
        
      }
      catch(error){
          toast({
            title: error?.response?.data?.message || error?.data?.message,
            status: "error",
            duration: 2000,
            position: "top",
            isClosable: true,
          });
      }
    }

    const handleQrVerify=async()=>{
      setVerifyLoading(true)
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/qr-verify`,
          {
            email:email,
            code:scretCode
          }
        );
        setVerifyLoading(false)
        toast({
          title: response?.data?.message,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        dispatch(loginSuccess(response.data));
  
        const admindetails = {
          token: response?.data?.token,
          usernametoken: response?.data?.usernameToken,
        };

        naviagte("/");
        saveUserDetails("adminauth", admindetails);
        dispatch(loginSuccess(response.data));
        saveUserDetails("adminData",response.data)
      }
      catch(error){
        dispatch(loginFailure(error.message));
          toast({
            title: error?.response?.data?.message || error?.data?.message,
            status: "error",
            duration: 2000,
            position: "top",
            isClosable: true,
          });
        setVerifyLoading(false)

      }
    }


  
  
  return (
    <div className="flex justify-center items-center h-[100vh] w-[100%] bg-blue-100 p-5">
    <div className=" lg:px-6  w-[95%] lg:w-[90%]  m-auto rounded-lg flex flex-col md:flex-row">
      <div className="p-6    shadow-lg bg-white  rounded-xl  md:w-[40%] border border-[#4846ED] ">
      {!admin&&<h2 className="text-2xl flex flex-col-reverse items-center gap-1 font-bold mb-6 text-[#4846ED] text-center p-2">Admin Login
      <img src={account} className='w-[50px] h-[50px]' />
      </h2>}
        {admin&&<h2 className="text-xl text-center font-bold ">Two-Factor Authentication (2FA)</h2>}
        {admin&&<p className="text-[14px] mt-2 px-8 font-normal  text-center mb-2">Enter the verification code from your authenticationr app!</p>}


       { !admin&&<form  onSubmit={handleLogin} className="space-y-6 ">
          <div className=''>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              placeholder="Your username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4846ED] focus:border-[#4846ED] sm:text-sm"
            />
            
          </div>
          <div className='relative'>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              placeholder="Your password"
              type={showPassword?"text":"password"}
              value={password}
              required
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4846ED] focus:border-[#4846ED] sm:text-sm"
            />
              <button
                className="absolute top-8 right-0 mr-4 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? (
                  <IoEyeSharp
                    cursor={"pointer"}
                    fontSize="20px"
                    color={"#4846ED"}
                  />
                ) : (
                  <IoEyeOffSharp
                    cursor={"pointer"}
                    fontSize="20px"
                    color={"#4846ED"}
                  />
                )}
              </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex  items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-300 focus:ring-blue-200 border-gray-300 rounded"
              />
             
              <label htmlFor="remember-me" className="ml-2 text-xs block lg:text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm ">
              <p className="font-medium  text-xs flex items-center gap-1 ">
                Forgot Password ? <Tooltip placement='top' hasArrow label='Contact your upline.' bg='blue.200' color='black'>
           <InfoIcon color={"#4846ED"} className='' fontSize={"19px"}/>
          </Tooltip>
                
               

              </p>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-center text-md  duration-500  ease-in-out text-white font-bold bg-[#4846ED]  hover:bg-[#6E71F2] "
            >
              {loading ? (
                <LoadingSpinner color="white" size="sm" thickness={"3px"} />
              ) : (
                "Login"
              )}
            </button>
<div className="mt-20 text-center flex justify-center">
                <p className="text-gray-700 w-[90%] text-sm font-semibold bg-blue-100 rounded-md p-3">
                  <span className="text-[#4846ED]">
                    Secure your account with Two-Factor Authentication (2FA)
                  </span>
                  . Enable an extra layer of verification for added security.
                </p>
              </div>
          </div>
        </form>}
       { admin&& <div className="space-y-8 ">
          <div className=''>
            <div className='flex flex-col items-center  gap-2'>
           
            <img src={qrCode} alt="" />
            </div>
          

            
          </div>
          <div className='relative'>
            <label className="block text-sm font-medium mb-1 text-gray-700">Verfication code :</label>
            
              <HStack spacing="4" style={{display:"flex",justifyContent:"space-between"}}> {/* Adjust spacing as needed */}
      <PinInput value={scretCode}  onChange={setScretCode}>
        <PinInputField width={"100%"} />
        <PinInputField width={"100%"} />
        <PinInputField  width={"100%"}/> 
        <PinInputField  width={"100%"}/>
        <PinInputField width={"100%"} />
        <PinInputField width={"100%"} />

      </PinInput>
    </HStack>
             
          </div>
         
          <div>
            <button
              onClick={handleQrVerify}
           
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md text-center  duration-500  ease-in-out text-white font-bold bg-[#4846ED] hover:bg-[#6E71F2] "
            >
              {verfifyLoading ? (
                <LoadingSpinner color="white" size="sm" thickness={"3px"} />
              ) : (
                "Verify"
              )}
            </button>
<div className="mt-20 text-center flex justify-center">
                <p className="text-gray-700 w-[90%] text-sm font-semibold bg-blue-100 rounded-md p-3">
                  <span className="text-[#4846ED] ">
                    Secure your account with Two-Factor Authentication (2FA)
                  </span>
                  . Enable an extra layer of verification for added security.
                </p>
              </div>
          </div>
        </div>}
        {admiBlockStatus? <div className="mt-2">
          <p className="block  rounded-[8px] bg-red-600  p-2 text-center mt-6 px-5 font-bold text-[14px] text-white">
          Oops! Blocked by admin. Contact us now.
          </p>
         
        </div>:""}
        
      </div>
      <div className="hidden   md:flex md:w-[75%]  items-center justify-center">
        
        <img src={login9} alt="Placeholder" className="w-[80%]"/>
      </div>
    </div>
  </div>
  )
}

export default Signup