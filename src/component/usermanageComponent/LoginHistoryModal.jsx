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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { convertToUniversalTime, formatDateTime } from "../../../utils/utils";
import { FaLocationDot } from "react-icons/fa6";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { sendPostRequest } from "../../api/api";
function LoginHistoryModal({data }) {
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
  } = useSelector((state) => state.theme);
  const { t, i18n } = useTranslation();
const [loading,setLoading]=useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure();
const [ipDetails,setIpDetails]=useState({})
const toast=useToast()

  const getAllLoginHistory2 = async (login_ip) => {
    setLoading(true);
    let url = `${
      import.meta.env.VITE_API_URL
    }/api/ip-service/get-ip-details`;
  
    try {
      const payload={
        ip:login_ip
      }
      let response = await sendPostRequest(url,payload);
      const data = response.data;
      setLoading(false);
      setIpDetails(response.data);
    
    } catch (error) {
      setLoading(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

 
  return (
    <>
      <button
        style={{ border: `1px solid ${border}60` }}
        className="p-1 px-2 rounded-[6px]  text-sm font-bold"
        onClick={onOpen}
      >
        {t(`history`)}
      </button>

      <Modal size={{ base: 'full', md: '3xl' }} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">{t(`Login`)} {t(`History`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="overflow-auto h-[90vh]  md:h-[80vh] rounded-lg p-2  bg-white border border-gray-200 ">
              <table className="min-w-full  ">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-nowrap border-b">{t(`ID`)}</th>
                    <th className="py-2 px-4 text-nowrap border-b">{t(`IP`)}</th>
                    <th className="py-2 px-4 text-nowrap border-b">{t(`Time`)}</th>
                    <th className="py-2 px-4 text-nowrap border-b">{t(`Get IP`)}</th>
                   

                  </tr>
                </thead>
                <tbody >
                  {data?.map((entry, index) => (
                    <tr key={entry?._id} className="text-center">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b">{entry?.login_ip}</td>
                      <td className="py-2 px-4 border-b">
                        <p className="flex flex-col"> 
                          {formatDateTime(entry?.login_time).split(" ")[0]}
                          <span className="text-xs ml-1 font-semibold"> ({formatDateTime(entry?.login_time).split(" ")[1]})</span></p>
                      </td>
                      <td className="py-2 px-4 border-b"> 
                      
                      
                         <Menu>
  <MenuButton  onClick={()=>getAllLoginHistory2(entry?.login_ip)} >
   <Text style={{display:"flex",alignItems:"center",textDecoration:"underline",gap:"2px"}}> Ip <FaLocationDot /></Text>
  </MenuButton>
  <MenuList style={{width:"300px",height:"220px",display:"flex",justifyContent:"center",alignItems:"center"}}>
    {loading?<Spinner/>:<div className="flex flex-col justify-between w-[100%]">
  <MenuItem style={{display:"flex",justifyContent:"space-between",gap:"8px",width:"100%"}}>
    <Text>Country Code</Text>
    <Text style={{fontWeight:"800",fontSize:"14px"}}>{ipDetails?.country_code}</Text>

    </MenuItem>
    <MenuItem style={{display:"flex",justifyContent:"space-between",gap:"8px",width:"100%"}}>
    <Text>Country</Text>
    <Text style={{fontWeight:"800",fontSize:"14px"}}>{ipDetails?.country_name}</Text>

    </MenuItem>
    <MenuItem style={{display:"flex",justifyContent:"space-between",gap:"8px",width:"100%"}}>
    <Text>City</Text>
    <Text style={{fontWeight:"800",fontSize:"14px"}}>{ipDetails?.city}</Text>

    </MenuItem>
    <MenuItem style={{display:"flex",justifyContent:"space-between",gap:"8px",width:"100%"}}>
    <Text>Region</Text>
    <Text style={{fontWeight:"800",fontSize:"14px"}}>{ipDetails?.region_name}</Text>

    </MenuItem>
   
    <MenuItem style={{display:"flex",justifyContent:"space-between",gap:"8px",width:"100%"}}>
    <Text>Time Zone</Text>
    <Text style={{fontWeight:"800",fontSize:"14px"}}>{ipDetails?.time_zone}</Text>

    </MenuItem>
    </div>}
    
  </MenuList>
  
</Menu>
                       </td>
                       

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LoginHistoryModal;
