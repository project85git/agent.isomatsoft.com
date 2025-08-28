import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Stack,
  Select,
  Spinner
} from '@chakra-ui/react';
import { sendPatchRequest } from '../api/api';

const EditAutoPaymentCredential = ({ item, onUpdate, onClose }) => {
  const [editedItem, setEditedItem] = useState(item);
  const toast = useToast();
const [updateLoading,setUpdateLoading]=useState(false)
  const handleUpdate = async () => {
    setUpdateLoading(true)
    try {
      const url = `${import.meta.env.VITE_API_URL}/auto-payment-credential/update-single-payment-credential/${editedItem._id}`;
      const response = await sendPatchRequest(url, editedItem);
      onUpdate(response.data);
      toast({
        description: 'Provider updated successfully.',
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        description: `${error?.response?.data?.message || error.message}`,
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
    }
    finally{
      setUpdateLoading(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setEditedItem((prevItem) => ({ ...prevItem, status: e.target.checked }));
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Payment Credentials</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl id="payment_gateway" isRequired>
              <FormLabel>Getway Name</FormLabel>
              <Select
                required
                name="payment_gateway"
                value={editedItem.payment_gateway}
                onChange={(e)=>setEditedItem({...editedItem,payment_gateway:e.target.value})}
              >
                <option value="">Select Provider</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Square">Square</option>
                  <option value="AuthorizeNet">AuthorizeNet</option>
                  <option value="PassimPay">PassimPay</option>
              </Select>
            </FormControl>
            <FormControl id="api_key" isRequired>
              <FormLabel>Api Key</FormLabel>
              <Input
                name="api_key"
                value={editedItem.api_key || ''}
                onChange={handleChange}
              />
            </FormControl>
           
            <FormControl id="api_url" isRequired>
              <FormLabel>API Url</FormLabel>
              <Input
                name="api_url"
                value={editedItem.api_url || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="api_secret" isRequired>
              <FormLabel>Api Secret</FormLabel>
              <Input
                name="api_secret"
                value={editedItem.api_secret || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="platform_id" isRequired>
              <FormLabel>Platform Id</FormLabel>
              <Input
                name="platform_id"
                value={editedItem.platform_id || ''}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="webhook_url" isRequired>
              <FormLabel>Webhook Url</FormLabel>
              <Input
                name="webhook_url"
                value={editedItem.webhook_url || ''}
                onChange={handleChange}
              />
            </FormControl>
         
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button disabled={updateLoading} colorScheme="blue" mr={3} onClick={handleUpdate}>
            {updateLoading?<Spinner/>:'Save'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAutoPaymentCredential;
