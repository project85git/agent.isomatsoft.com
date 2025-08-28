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
  Input,
  useDisclosure,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  FormLabel,
  Textarea,
  Box,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { fetchGetRequest, sendPostRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for React Quill

function SendMail({ userData }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [authCredential, setAuthCredential] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // Preview toggle
  const toast = useToast();
  const { t } = useTranslation();

  const {
    bg,
    text,
    border,
    iconColor,
  } = useSelector((state) => state.theme);

  useEffect(() => {
    getAuthCredentialData();
  }, []);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleMessageChange = (value) => setMessage(value); // For React Quill

  const getAuthCredentialData = async () => {
    setDataLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/auth-credential/get-auth-credential-data`;
      const response = await fetchGetRequest(url);
      setAuthCredential(response.data);
      setSelectedUser(response.data[0].user);
      setDataLoading(false);

    } catch (error) {
     setDataLoading(false);
  };
  }

  const sendMessage = async () => {
    const id = userData?.user_id || userData?.admin_id;
    if (message === "" || title === "") {
      toast({
        description: `subject and message can not be empty`,
        status: "warning",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/admin/send-mail/${id}?type=${userData.role_type}`;
      const requestData = {
        subject: title,
        message: message,
        user: selectedUser?.user,
      };
      const response = await sendPostRequest(url, requestData);
      toast({
        description: `message send successfully`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setMessage("");
      setTitle("");
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        description: `${
          error?.message || error?.response?.message || error?.data?.message
        }`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSubmit = () => sendMessage();

  return (
    <>
      <button
        onClick={onOpen}
        style={{ backgroundColor: bg }}
        className={`w-[100%]  font-semibold text-white text-xs rounded-[5px] p-[7px]`}
      >
        {t(`Send`)} {t(`Mail`)}
      </button>
      <Modal size="md" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="white" color="black">
          <ModalHeader color={iconColor} className="text-center">
            {t("Send Message")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {dataLoading ? (
              <LoadingSpinner />
            ) : (
              <FormControl>
                {/* User Selection */}
                <FormLabel>{t("Select a user to send mail")}</FormLabel>
                <RadioGroup onChange={setSelectedUser} value={selectedUser}>
                  <Stack spacing={3}>
                    {authCredential.map((user) => (
                      <Radio key={user.user} value={user.user}>
                        {user.user}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>

                {/* Subject Input */}
                <Input
                  type="text"
                  placeholder="Enter Subject"
                  value={title}
                  onChange={handleTitleChange}
                  mt={4}
                  border={`1px solid ${border}60`}
                  rounded="md"
                  p={2}
                />

                {/* Rich Text Editor for Message */}
                <Box mt={4} border={`1px solid ${border}60`} rounded="sm">
                  <ReactQuill
                    theme="snow"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Write your message..."
                    style={{ minHeight: "150px" }}
                  />
                </Box>

                {/* Email Preview Toggle */}
                <Button
                  mt={4}
                  onClick={() => setShowPreview(!showPreview)}
                  bg={bg}
                  color="white"
                  className="font-bold text-sm py-2 rounded-md"
                  _hover={{backgroundColor:bg}}
                >
                  {showPreview ? t("Hide Preview") : t("Show Preview")}
                </Button>

                {/* Preview Section */}
                {showPreview && (
                  <Box
                    mt={4}
                    p={4}
                    border="1px solid #ccc"
                    rounded="md"
                    bg="#f9f9f9"
                    className="email-preview"
                  >
                    <h3 className="font-bold text-lg">{title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: message }} />
                  </Box>
                )}
              </FormControl>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              loadingText={t("Sending")}
              onClick={handleSubmit}
              bg={bg}
              color="white"
              _hover={{backgroundColor:bg}}
              className="font-bold w-[90px] text-sm py-2 rounded-md"
            >
              {t("Send")}
            </Button>
            <Button ml={3} onClick={onClose} className="bg-gray-300 font-bold w-[90px] text-sm py-2 rounded-md">
              {t("Cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SendMail;
