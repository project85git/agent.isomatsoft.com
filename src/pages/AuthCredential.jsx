import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Input,
  Stack,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  fetchGetRequest,
  sendDeleteRequest,
  sendPatchRequest,
  sendPostRequest,
} from "../api/api";
import { formatBonusText } from "../../utils/utils";
import { useSelector } from "react-redux";
import EmailsTable from "../component/EmailsTable";

function AuthCredential() {
  const { color, iconColor, text, font, border,bg } = useSelector((state) => state.theme);
  const [credentials, setCredentials] = useState([]);
  const [newCredential, setNewCredential] = useState({
    user: "",
    password: "",
    secret_key: "",
    site_auth_key: "",
    usage: "send_mail",
    host: "", // New field
    port: "", // New field
    site_name: "", // New field
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  useEffect(() => {
    fetchAllCredentials();
  }, []);

  // Fetch all credentials
  const fetchAllCredentials = async () => {
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/auth-credential/get-all-auth-credential`
      );
      setCredentials(response.data);
    } catch (error) {
      console.error("Error fetching credentials", error);
    }
  };

  // Add or Update credential
  const handleAddOrUpdateCredential = async () => {
    try {
      setIsLoading(true);
      if (editingId) {
        await sendPatchRequest(
          `${import.meta.env.VITE_API_URL}/api/auth-credential/update-single-auth-credential/${editingId}`,
          newCredential
        );
        toast({
          title: "Credential updated successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await sendPostRequest(
          `${import.meta.env.VITE_API_URL}/api/auth-credential/add-single-auth-credential`,
          newCredential
        );
        toast({
          title: "Credential added successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      fetchAllCredentials();
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: `${error?.data?.message}.`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete credential
  const handleDeleteCredential = async (id) => {
    try {
      await sendDeleteRequest(
        `${import.meta.env.VITE_API_URL}/api/auth-credential/delete-single-auth-credential/${id}`
      );
      toast({
        title: "Credential deleted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchAllCredentials();
    } catch (error) {

      toast({
        title: "Error deleting credential.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCredential({ ...newCredential, [name]: value });
  };

  const resetForm = () => {
    setNewCredential({
      user: "",
      password: "",
      secret_key: "",
      site_auth_key: "",
      usage: "send_mail",
      host: "", // Reset new field
      port: "", // Reset new field
      site_name: "", // Reset new field
    });
    setEditingId(null);
  };

  return (
    <div className="px-3">
      <h1 className="text-2xl font-bold mb-2">Email Manage</h1>

      <Button onClick={onOpen} style={{backgroundColor: color, color:"white"}} mb={4}>
        Add New Credential
      </Button>

      {/* Modal for Add/Edit Credential */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingId ? "Edit Credential" : "Add New Credential"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Input
                placeholder="User"
                name="user"
                type={"email"}
                value={newCredential.user}
                onChange={handleInputChange}
              />

              {/* Password Input with Toggle Visibility */}
              <InputGroup>
                <Input
                  placeholder="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={newCredential.password}
                  onChange={handleInputChange}
                />
                <InputRightElement>
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={"16px"}/> : <AiOutlineEye size={"16px"}/>}
                  </div>
                </InputRightElement>
              </InputGroup>

              <Input
                placeholder="Secret Key"
                name="secret_key"
                value={newCredential.secret_key}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Site Auth Key"
                name="site_auth_key"
                value={newCredential.site_auth_key}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Host"
                name="host"
                value={newCredential.host}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Port"
                name="port"
                type="text"
                value={newCredential.port}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Site Name"
                name="site_name"
                value={newCredential.site_name}
                onChange={handleInputChange}
              />
              <Select
                name="usage"
                value={newCredential.usage}
                onChange={handleInputChange}
              >
                <option value="send_mail">Send Mail</option>
                <option value="send_otp">Send Otp</option>
                <option value="promotion_mail">Promotion Mail</option>
                <option value="transactional_mail">Transactional Mail</option>
              </Select>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleAddOrUpdateCredential}
              isLoading={isLoading}
              style={{backgroundColor:bg, color:"white"}}
            >
              {editingId ? "Update" : "Add"}
            </Button>
            <Button variant="ghost" onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Credentials Table */}
      <div className="overflow-auto max-h-96">
  <table className="table-auto w-full border-collapse border border-gray-300 bg-white">
    <thead>
      <tr style={{backgroundColor:bg, color:"white"}}
          className="text-left p-2   border border-gray-300 text-[12px] font-bold"
      >
        <th className="border text-start border-gray-300 px-4 py-2">User</th>
        <th className="border text-start border-gray-300 px-4 py-2">Password</th>
        <th className="border text-start border-gray-300 px-4 py-2">Secret Key</th>
        <th className="border text-start border-gray-300 px-4 py-2">Site Auth Key</th>
        <th className="border text-start border-gray-300 px-4 py-2">Host</th>
        <th className="border text-start border-gray-300 px-4 py-2">Port</th>
        <th className="border text-start border-gray-300 px-4 py-2">Site Name</th>
        <th className="border text-start border-gray-300 px-4 py-2">Usage</th>
        <th className="border border-gray-300 px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {credentials.map((credential) => (
        <tr key={credential._id} className="hover:bg-gray-50">
          <td className="border border-gray-300 bg-white px-3 py-2">{credential.user}</td>
          <td className="border px-3 py-2">{credential.password}</td>
          <td className="border border-gray-300 bg-white px-3 py-2">{credential?.secret_key?.slice(0, 20)}</td>
          <td className="border border-gray-300 bg-white px-3 py-2">{credential.site_auth_key}</td>
          <td className="border border-gray-300 bg-white px-3 py-2">{credential.host}</td>
          <td className="border border-gray-300 bg-white px-3 py-2">{credential.port}</td>
          <td className="border border-gray-300 bg-white px-3 py-2">{credential.site_name}</td>
          <td className="border border-gray-300 bg-white px-3 py-2">{credential.usage}</td>
          <td className="border border-gray-300 bg-white px-3 gap-2 flex flex-wrap py-2">
            <Button
              onClick={() => {
                setNewCredential(credential);
                setEditingId(credential._id);
                onOpen();
              }}
              colorScheme={color}
              style={{ backgroundColor: color }}
              size="sm"
            >
              <AiOutlineEdit />
            </Button>
            <Button
              onClick={() => handleDeleteCredential(credential._id)}
              colorScheme="red"
              size="sm"
          
            >
              <AiOutlineDelete />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    {credentials.length > 0 &&
      <EmailsTable allEmail={credentials.map((ele)=>ele.user)}/>
    }
    </div>
  );
}

export default AuthCredential;
