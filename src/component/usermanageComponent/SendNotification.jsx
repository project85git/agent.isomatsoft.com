import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import axios from "axios";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { sendPostRequest } from "../../api/api";

const SendNotification = ({ userData, isMultiple=false }) => {
  const [recipients, setRecipients] = useState([{ username: "", role_type: "" }]);
  const [currentAmount, setCurrentAmount] = useState(userData?.amount);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const roleTypes = [
    { value: "owneradmin", label: "Owner Admin" },
    { value: "admin", label: "Admin" },
    { value: "subadmin", label: "Sub Admin" },
    { value: "manager", label: "Manager" },
    { value: "affiliate", label: "Affiliate" },
    { value: "agent", label: "Agent" },
    { value: "subagent", label: "Sub Agent" },
    { value: "support", label: "Support" },
    { value: "billing", label: "Billing" },
    { value: "user", label: "User" },
  ];
  
  const categories = [
    { value: "withdraw", label: "Withdraw" },
    { value: "deposit", label: "Deposit" },
    { value: "newuser", label: "New User" },
    { value: "promotion", label: "Promotion" },
    { value: "vip", label: "VIP" },
    { value: "other", label: "Other" },
  ];
  
  const {
    bg,
    text,
    border,
    iconColor,
  } = useSelector((state) => state.theme);

  useEffect(() => {
    setRecipients([{ username:userData?.username || "", role_type: userData?.role_type || ""  }]);
  },[userData])
   
  const addRecipient = () => {
    setRecipients([...recipients, { username: "", role_type: "" }]);
  };

  const handleRecipientChange = (index, field, value) => {
    const newRecipients = [...recipients];
    newRecipients[index][field] = value;
    setRecipients(newRecipients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/api/notification/send-notification`;
    const payload = {
        recipients,
        amount: currentAmount,
        description,
        type,
        category,
        title,
        parent_admin_id: userData?.parent_admin_id,
        parent_admin_username: userData?.parent_admin_username,
        parent_admin_role_type: userData?.parent_admin_role_type,
        site_auth_key: userData?.site_auth_key,
      }
    try {
      const response = await sendPostRequest(url,payload);
      toast({
        title: "Notification Sent",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
     <button
        onClick={onOpen}
        style={{ backgroundColor: bg }}
        className={`w-[100%]  font-semibold text-white text-xs rounded-[5px] p-[7px]`}
      >
        {t(`Send`)} {t(`Notification`)}
      </button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Notification</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              {recipients.map((recipient, index) => (
                <Box key={index} mb={4} p={3} bg="gray.100" rounded="md">
                  <FormControl id={`username-${index}`} isRequired mb={2}>
                    <FormLabel>Recipient Username</FormLabel>
                    <Input
                      type="text"
                      value={recipient.username}
                      onChange={(e) => handleRecipientChange(index, "username", e.target.value)}
                      placeholder="Enter recipient's username"
                      bg="white"
                      isDisabled
                      _disabled={{color:bg, fontWeight:600}}
                    />
                  </FormControl>
                  <FormControl id={`role_type-${index}`} isRequired>
                    <FormLabel>Recipient Role</FormLabel>
                    <Select
                      value={recipient.role_type}
                      _disabled={{color:bg, fontWeight:600,opacity:10}}
                      isDisabled
                      onChange={(e) => handleRecipientChange(index, "role_type", e.target.value)}
                      placeholder="Select role type"
                      bg="white"
                    >
                        {roleTypes.map((item)=>
                            <option value={item.value}>{item.label}</option>
                         )}
                    </Select>
                  </FormControl>
                </Box>
              ))}
             {isMultiple&& <Button onClick={addRecipient} mb={4} colorScheme="blue">
                Add Another Recipient
              </Button>}

              <FormControl id="title" isRequired mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification Title"
                  bg="white"
                />
              </FormControl>

              <FormControl id="amount" isRequired mb={4}>
                <FormLabel>Amount</FormLabel>
                <Input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="Enter amount"
                  bg="white"
                />
              </FormControl>

              <FormControl id="type" isRequired mb={4}>
                <FormLabel>Type</FormLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Select type"
                  bg="white"
                >
                  <option value="user">Player</option>
                  <option value="admin">Others</option>
                </Select>
              </FormControl>

              <FormControl id="category" isRequired mb={4}>
                <FormLabel>Category</FormLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Select category"
                  bg="white"
                >
                {categories.map((item)=>
                            <option value={item.value}>{item.label}</option>
                         )}
                </Select>
              </FormControl>

              <FormControl id="description" isRequired mb={4}>
                <FormLabel>Description</FormLabel>
                <ReactQuill value={description} onChange={setDescription} theme="snow" />
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Send Notification
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendNotification;
