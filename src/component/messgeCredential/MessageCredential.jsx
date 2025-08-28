import { useState, useEffect } from "react";
import { useDisclosure, useToast, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel, Input, Box, ModalCloseButton, FormErrorMessage, Select, Spinner, Switch, FormHelperText, Badge } from "@chakra-ui/react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { EditIcon } from "@chakra-ui/icons";
import nodatafound from "../../assets/emptydata.png"; // Image for no data
import { useSelector } from "react-redux";
import { fetchGetRequest, sendDeleteRequest, sendPostRequest } from "../../api/api";

// Main Component for Credentials
function MessageCredential() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure(); // for delete confirmation modal
  const [credentials, setCredentials] = useState([]);
  const [formData, setFormData] = useState({
    service_credential: {
      credentials: {
        account_sid: "",
        auth_token: "",
        phone_number: "",
        api_key: ""
      },
      service_type: 'twilio',
    },
    description: '',
    status: 'active',
    category: ['sent_otp'],
    site_auth_key: ''
  });
  const [isEditMode, setIsEditMode] = useState(false); // to differentiate add or edit mode
  const [currentCredential, setCurrentCredential] = useState(null); // for editing specific credential
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state for add/update
  const toast = useToast();
  const { color, bg, primaryBg, secondaryBg, iconColor, text, font, border } = useSelector(state => state.theme);

  // Fetch Credentials from API
  const getCredentials = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/message-credential/get-all-message-credential`;
      const response = await fetchGetRequest(url);
      setCredentials(response.data);
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message || error?.response?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true
      });
    }
  };

  useEffect(() => {
    getCredentials();
  }, []);

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "auth_token" || name === "phone_number" || name === "account_sid" || name === "api_key") {
      setFormData((prevData) => ({
        ...prevData,
        service_credential: {
          ...prevData.service_credential,
          credentials: {
            ...prevData.service_credential.credentials,
            [name]: value,
          }
        }
      }));
    } else if (name === "service_type") {
      setFormData((prevData) => ({
        ...prevData,
        service_credential: {
          ...prevData.service_credential,
          [name]: value
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Validate the form data
  const validateForm = () => {
    const errors = {};
   
    if (!formData.service_credential.credentials.api_key) {
      errors.api_key = "API Key is required";
    }
    if (!formData.service_credential.credentials.phone_number) {
      errors.phone_number = "Phone number is required";
    }
    if (!formData.description) {
      errors.description = "Description is required";
    }
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Open modal for Add or Edit
  const openModal = (credential = null) => {
    if (credential) {
      // Editing existing credential
      setFormData({
        ...credential,
        category: credential.category || ['sent_otp'], // Handling default value
      });
      setIsEditMode(true);
      setCurrentCredential(credential);
    } else {
      // Adding new credential
      setFormData({
        service_credential: {
          credentials: {
            account_sid: '',
            auth_token: '',
            phone_number: '',
            api_key: ''
          },
          service_type:'twilio'
        },
        description: '',
        status: 'active',
        category: ['sent_otp'],
        site_auth_key: ''
      });
      setIsEditMode(false);
    }
    setFormErrors({}); // Reset errors when opening the modal
    onOpen();
  };

  // Save or update credential
  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true); // Set loading to true when starting the save operation
    const url = isEditMode
      ? `${import.meta.env.VITE_API_URL}/api/message-credential/update-message-credential/${currentCredential._id}` // Update URL
      : `${import.meta.env.VITE_API_URL}/api/message-credential/add-message-credential`; // Add URL
    try {
      const response = await sendPostRequest(url, formData);
      getCredentials(); // Update the credentials list
      toast({
        description: `${isEditMode ? 'Updated' : 'Added'} successfully.`,
        status: "success",
        duration: 4000,
        position: "top",
        isClosable: true
      });
      onClose();
    } catch (error) {
      toast({
        description: error?.message || error?.data?.message || error?.response?.data?.message,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true
      });
    } finally {
      setLoading(false); // Set loading to false after operation is complete
      setFormErrors(null)
    }
  };

  // Delete credential
  const handleDelete = async () => {
    if (currentCredential) {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/message-credential/delete-message-credential/${currentCredential._id}`;
        const response = await sendDeleteRequest(url);
        getCredentials();
        toast({
          description: 'Deleted successfully.',
          status: "success",
          duration: 4000,
          position: "top",
          isClosable: true
        });
        onCloseDeleteModal(); // Close the delete modal after successful deletion
      } catch (error) {
        toast({
          description: error?.message || error?.data?.message || error?.response?.data?.message,
          status: "error",
          duration: 4000,
          position: "top",
          isClosable: true
        });
      }
    }
  };

  const openDeleteModal = (credential) => {
    setCurrentCredential(credential); // Set the credential to be deleted
    onOpenDeleteModal(); // Open the delete modal
  };

  return (
    <div className="p-4">
      <div className="flex justify-end items-center py-3">
        <Button onClick={() => openModal()} bg={bg} color={"white"}>Add Credential</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-[12px] bg-white">
          <thead>
            <tr style={{ backgroundColor: bg, color: "white" }}>
              <th className="border text-start border-gray-300 px-3 p-2">Service Type</th>
              <th className="border text-start border-gray-300 px-3 p-2">Description</th>
              <th className="border text-start border-gray-300 px-3 p-2">Account SID</th>
              <th className="border text-start border-gray-300 px-3 p-2">Phone Number</th>
              <th className="border text-start border-gray-300 px-3 p-2">Status</th>
              <th className="border text-start border-gray-300 px-3 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {credentials.length > 0 ? (
              credentials.map((cred) => (
                <tr key={cred._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 bg-white px-3 py-2">{cred?.service_credential?.service_type?.toUpperCase()}</td>
                  <td className="border border-gray-300 bg-white px-3 py-2">{cred.description}</td>
                  <td className="border border-gray-300 bg-white px-3 py-2">{cred?.service_credential?.credentials.account_sid || "N/A"}</td>
                  <td className="border border-gray-300 bg-white px-3 py-2">{cred?.service_credential?.credentials.phone_number || "N/A"}</td>
                  <td className="border border-gray-300 bg-white px-3 py-2">
                    <div className="text-start w-[40px]">
                  <Badge
                      style={{
                        backgroundColor: cred.status==="active" ? "green" : "red",
                        color: "white",
                      }}
                    >
                      {" "}
                      {cred.status==="active" ? "Active" : "Inactive"}{" "}
                    </Badge>
                    </div>
                  </td>
                  <td className="border border-gray-300 bg-white px-3 gap-3 flex flex-wrap py-2">
                    <Button
                      onClick={() => openModal(cred)}
                      colorScheme={color}
                      style={{ backgroundColor: bg }}
                      size="sm"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      onClick={() => openDeleteModal(cred)}
                      colorScheme="red"
                      size="sm"
                    >
                      <AiOutlineDelete />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 border-b border-gray-200">
                  <img src={nodatafound} alt="No Data Found" className="w-[300px] h-[200px] mx-auto" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add or Edit */}
      <Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>{isEditMode ? 'Edit Credential' : 'Add Credential'}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <FormControl isInvalid={formErrors?.credentials?.service_type || false}>
        <FormLabel>Service Type</FormLabel>
        <Select
          name="service_type"
          value={formData?.service_credential?.service_type}
          onChange={handleInputChange}
          placeholder="Select service type"
        >
          <option value="twilio">Twilio</option>
          <option value="sendgrid">SendGrid</option>
          {/* Add more options here if needed */}
        </Select>
        {formErrors?.service_type && (
          <FormErrorMessage style={{ fontSize: '12px' }}>
            {formErrors?.service_type}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={formErrors?.auth_token} mt={4}>
        <FormLabel>Account Sid</FormLabel>
        <Input
          type="text"
          name="account_sid"
          value={formData?.service_credential?.credentials?.account_sid}
          onChange={handleInputChange}
        />
        {formErrors?.account_sid && (
          <FormErrorMessage style={{ fontSize: '12px' }}>
            {formErrors?.account_sid}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={formErrors?.auth_token} mt={4}>
        <FormLabel>Auth Token</FormLabel>
        <Input
          type="text"
          name="auth_token"
          value={formData?.service_credential?.credentials?.auth_token}
          onChange={handleInputChange}
        />
        {formErrors?.auth_token && (
          <FormErrorMessage style={{ fontSize: '12px' }}>
            {formErrors?.auth_token}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={formErrors?.phone_number} mt={4}>
        <FormLabel>Phone Number</FormLabel>
        <Input
          type="text"
          name="phone_number"
          value={formData?.service_credential?.credentials?.phone_number}
          onChange={handleInputChange}
        />
        {formErrors?.phone_number && (
          <FormErrorMessage style={{ fontSize: '12px' }}>
            {formErrors?.phone_number}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={formErrors?.api_key} mt={4}>
        <FormLabel>API Key</FormLabel>
        <Input
          type="text"
          name="api_key"
          value={formData?.service_credential?.credentials?.api_key}
          onChange={handleInputChange}
        />
        {formErrors?.api_key && (
          <FormErrorMessage style={{ fontSize: '12px' }}>
            {formErrors?.api_key}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={formErrors?.description} mt={4}>
        <FormLabel>Description</FormLabel>
        <Input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        {formErrors?.description && (
          <FormErrorMessage style={{ fontSize: '12px' }}>
            {formErrors?.description}
          </FormErrorMessage>
        )}
      </FormControl>

      {/* Active/Inactive Switch */}
      <FormControl className="flex justify-between"  mt={4}>
        <FormLabel mb="0">Status</FormLabel>
        <Switch
          isChecked={formData?.status==="active"}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, status: e.target.checked?"active":"inactive" }))
          }
          colorScheme="teal"
        />
        
      </FormControl>
    </ModalBody>

    <ModalFooter className="gap-2">
      <Button
        bg={bg}
        color={'white'}
        onClick={handleSave}
        isLoading={loading}
        loadingText="Saving"
      >
        {isEditMode ? 'Update' : 'Add'}
      </Button>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>


      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure you want to delete this credential?</p>
          </ModalBody>
          <ModalFooter className="gap-2">
            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
            <Button onClick={onCloseDeleteModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default MessageCredential;
