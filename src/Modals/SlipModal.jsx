import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Badge,
  CircularProgress,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { IoIosCopy } from 'react-icons/io';
import { MdRemoveRedEye } from 'react-icons/md';
import { RxCrossCircled } from 'react-icons/rx';
import { SlScreenDesktop } from 'react-icons/sl';
import { sendPatchRequest } from '../api/api';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { convertToUniversalTime, formatDate, formatDateTime } from '../../utils/utils';

function SlipModal({ data,handleRender,type, transactionDetails }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [depositLoading,setDepositLoading]=useState(false)
  const [loading1,setLoading1]=useState(false)
  const [viewSlip,setViewSlip]=useState(false)
  const toast=useToast()
const { t, i18n } = useTranslation();

  const approvedDeposit = async () => {
    setDepositLoading(true);
    let url;
    if (data.type === "deposit") {
      url = `${import.meta.env.VITE_API_URL}/api/transaction/update-single-deposit/${data._id}?`;
    } else if (data.type ==="withdraw") {
      url = `${import.meta.env.VITE_API_URL}/api/transaction/update-single-withdraw/${data._id}?`;
    } else {
      // Handle invalid type
      setDepositLoading(false);
      return; // Exit the function
    }
    try {
      const updatedata = { status: "approved" };

      let response = await sendPatchRequest(url, updatedata);
      const data = response.data;
      const receivedData = response.data;
        toast({
          description: `Approved Succesfully`,
          status: "success",
          duration: 4000,
          position: "top",
          isClosable: true,
        });
        handleRender()
      onClose()

      setDepositLoading(false);
    } catch (error) {
      toast({
        description: `${error?.response?.data?.message}`,
        status: "error",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      setDepositLoading(false);
    }finally{
      if(transactionDetails){
        transactionDetails()}
    }
  };
  const rejectDeposit = async () => {
    setLoading1(true);
    let url;
    if (data.type === "deposit") {
      url = `${import.meta.env.VITE_API_URL}/api/transaction/update-single-deposit/${data._id}?`;
    } else if (data.type === "withdraw") {
      url = `${import.meta.env.VITE_API_URL}/api/transaction/update-single-withdraw/${data._id}?`;
    } else {
      // Handle invalid type
      setDepositLoading(false);
      return; // Exit the function
    }
    try {
      const updatedata = { status: "reject" };

      let response = await sendPatchRequest(url, updatedata);
      const data = response.data;
      const receivedData= response.data;
     
        toast({
          description: `Reject Succesfully`,
          status: "warning",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        handleRender()

      onClose()

      setLoading1(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading1(false);
    }finally{
      if(transactionDetails){
        transactionDetails()}
    }
  };

  const handleApproved = () => {
    approvedDeposit();
  };

  const handleReject = () => {
    rejectDeposit();
  };
  const [copiedItem, setCopiedItem] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedItem(text);
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
      <SlScreenDesktop
        onClick={onOpen}
        cursor="pointer"
        color="black"
        fontSize="20px"
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">{t(data.type)} {t(`Slip`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <p className='font-bold text-sm text-left'>{t(`Deposit`)} {t(`Details`)} <span className='text-red-600'>*</span></p>

            <div className="grid grid-cols-2 mt-3 text-sm gap-4">
              <div className='font-bold'>{t(`Date`)}/{t(`Time`)}:</div>
              <div className='flex items-center gap-1'>{formatDateTime(data.initiated_at).split(" ")[0]}<span className='text-[10px] font-bold'>({formatDateTime(data.initiated_at).split(" ")[1]})</span></div>
              <div className='font-bold'>{t(`Method`)}:</div>
              <div ><Badge>{data.method}</Badge></div>
              <div className='font-bold'>{data?.type} {t(`Amount`)}:</div>
              <div >{data.type=="deposit"?data.deposit_amount:data.withdraw_amount?.toFixed(2)} {data?.currency}</div>
              {/* {type==="user"&&<div className='font-bold'>{t(`Bonus`)}:</div>}
              {type==="user"&&<div >{data.bonus}%</div>} */}
              <div className='font-bold'>{t(`Wallet`)} {t(`Amount`)}:</div>
              <div>{data?.wallet_amount?.toFixed(2)} {data?.currency}</div>
              <div className='font-bold'>{data.type=="deposit"?`${t(`After`)} ${t(`Deposit`)}`:`${t(`After`)} ${t(`Withdraw`)}`}</div>
              <div>{data.type=="deposit"?data?.after_deposit?.toFixed(2):data?.after_withdraw?.toFixed(2)} {data?.currency}</div>
              {/* <div className='font-bold'>Payable:</div>
              <div>{data.payable}</div> */}
              <div className='font-bold'>{t(`Status`)}:</div>
              <div className={`${data.status==="approved"?"text-green-600":data.status=="pending"?"text-orange-600":"text-red-600"} font-bold`}>{data.status}</div>
            </div>

            <div className='w-[100%] bg-gray-300 mt-5 h-[1px]'></div>
            <div className='mt-5'>
              <p className='font-bold text-sm text-left'>{t(`User`)} {t(`Details`)} <span className='text-red-600'>*</span></p>
              <div className='flex items-center mt-4 justify-between w-[100%]'>
              <div className='font-bold text-sm'>{t(`Date`)}/{t(`Time`)}:</div>
              <div className='flex  font-bold text-sm items-center gap-1'>{formatDateTime(data.initiated_at).split(" ")[0]}<span className='text-[10px] font-bold'>({formatDateTime(data.initiated_at).split(" ")[1]})</span></div>
              </div>
              <div className=' flex flex-col mt-2 gap-3'>
              {data?.user_details?.map((obj, index) => (
  <div key={index} className={`flex w-[100%] justify-between`}>
  <div className='font-bold text-sm'>{obj.name}</div>
  <div className='flex items-center gap-2 text-sm font-semibold'>
    {typeof obj.value === 'string' && obj.value.startsWith('http') ? (
      <div>
        <div className={`font-bold flex justify-end ml-9`}>
          {t(`View`)} {t(`Receipt`)}: 
          <MdRemoveRedEye
            onClick={() => setViewSlip(!viewSlip)}
            fontSize={"20px"}
            cursor={"pointer"}
          />
        </div>
        {viewSlip && (
          <div className='mt-3'>
            <img src={obj.value} alt="Receipt" />
          </div>
        )}
      </div>
    ) : (
      <>
        <span>{obj.value}</span>
        <IoIosCopy cursor="pointer" color='green' onClick={()=>copyToClipboard(obj.value)} />
      </>
    )}
  </div>
</div>
))}


              </div>
             
            
            
           
              {/* <div className='flex justify-between items-center'>

              {type==="user"&&<div className='font-bold'>{t(`View`)} {t(`Receipt`)}:</div>}
              {type==="user"&&<div  className='flex items-center gap-2' >{data.method} <MdRemoveRedEye  onClick={()=>setViewSlip(!viewSlip)} fontSize={"20px"} cursor={"pointer"}  /></div>}
            </div>
               */}
            {/* {viewSlip&&<div className='mt-3 '>
             <img src={data?.deposit_slip}/>
            </div>} */}

              </div>

          </ModalBody>

          {data.status==="pending"?<ModalFooter className='flex justify-between w-[100%]'>
            <Button className='w-[100%]' colorScheme="red" mr={3}                   onClick={handleReject}>
            {loading1 ? (
                    <CircularProgress
                      isIndeterminate
                      color="orange.600"
                      size={"16px"}
                    />
                  ) : (
                    `${t(`Reject`)}`
                  )}
            </Button>
            <Button 
                  onClick={handleApproved}
            
            className='w-[100%]' colorScheme="green" >
             {depositLoading ? (
                    <CircularProgress
                      isIndeterminate
                      size={"16px"}
                      color="orange.600"
                    />
                  ) : (
                    `${t(`Approved`)}`
                  )}
            </Button>

           
          </ModalFooter>
          :<ModalFooter>
                          {data.status=="approved"? <div   className='w-[100%] p-2 text-center flex justify-center gap-2 items-center bg-green-500 text-white font-semibold text-sm rounded-md ' >
              {t(`Payment`)} {t(`Accepted`)} <FaCheckCircle fontSize={"20px"} />
            </div>  :
            <div  className='w-[100%] p-2 text-center flex justify-center gap-2 items-center bg-red-500 text-white font-semibold text-sm rounded-md ' >
              {t(`Payment`)} {t(`Reject`)} <RxCrossCircled fontSize={"20px"}  />

            </div> }
          </ModalFooter>}
        </ModalContent>
      </Modal>
    </>
  );
}

export default SlipModal;
