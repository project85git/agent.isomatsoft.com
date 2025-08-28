
  import React, { useState } from 'react';
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
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { MdDeleteOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../component/loading/LoadingSpinner';
import { sendDeleteRequest } from '../api/api';
import { useTranslation } from 'react-i18next';

function DeleteUserAdmin({type,name,id,onDeleteSuccess}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { primaryColor, bg, secondaryColor, textColor, borderColor,iconColor,primaryBg,border } = useSelector(state => state.theme);
const [loading,setLoading]=useState(false)
const toast=useToast()
const { t, i18n } = useTranslation();

  const handleDelete = async() => {
setLoading(true)
    // const url = `${import.meta.env.VITE_API_URL}/api/admin/delete-user/${id}`;
    try {
      let url;
      if (type === "user") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/delete-user/${id}`;
      } else if (type === "admin") {
        url = `${import.meta.env.VITE_API_URL}/api/admin/delete-admin/${id}`;
      }
      let response = await sendDeleteRequest(url);
      toast({
        description: response.message,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
     setLoading(false)
     onDeleteSuccess()
      onClose();
    } catch (error) {
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    onClose();

    }

    

  };

  return (
    <>
      <Tooltip label={"Delete"} bg={bg} aria-label={`Delete`} hasArrow>
      <button onClick={onOpen} style={{border:`1px solid ${border}60`,backgroundColor:primaryBg}} className={`w-[25px] flex items-center border  justify-center rounded-[6px] h-[25px]`}>
        <MdDeleteOutline onClick={onOpen} fontSize={"20px"} cursor={"pointer"} color={iconColor} />
      </button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
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
                onClick={handleDelete}
                className='w-[100px]'
              >
                {loading?<LoadingSpinner color="white" size="sm" thickness="2px"/>:`${t(`Delete`)}`}
              </Button>
              <Button
                onClick={onClose}
                style={{ color: textColor, borderColor: borderColor }}
              >
                {t(`Cancel`)}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteUserAdmin;
