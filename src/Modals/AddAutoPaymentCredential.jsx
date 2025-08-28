import React, { useState } from 'react';
import { 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  ModalOverlay, 
  useToast, 
  Stack, 
  Select,
  Spinner
} from '@chakra-ui/react';
import { sendPostRequest } from '../api/api';
import { useSelector } from 'react-redux';

const AddAutoPaymentCredential = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [addLoading,setAddLoading]=useState(false)
  const [payment_gateway, setGatewayName]=useState('');
  const toast = useToast();
  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme);
  const handleAdd = async () => {
    setAddLoading(true)
    try {
      const url = `${import.meta.env.VITE_API_URL}/auto-payment-credential/add-payment-credential`;
      const response = await sendPostRequest(url, {...newItem,payment_gateway})
      onAdd(response.data);
      toast({
        description: 'Provider added successfully.',
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
      setNewItem({});
      setIsOpen(false);
    } catch (error) {
      toast({
        description: `${error?.data?.message || error.message}`,
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
  
    }
    finally{
      setAddLoading(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} style={{backgroundColor:bg, color:"white"}}  mb={0}>
        Add Payment Credentials
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Payment Credentials</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
        
            <Stack spacing={4}>
              <FormControl id="payment_gateway" isRequired>
                <FormLabel>Getway Name</FormLabel>
                <Select
                required
               name="payment_gateway"
                value={newItem.payment_gateway}
                onChange={(e)=>setGatewayName(e.target.value)}
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
                  value={newItem.api_key || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="api_url" isRequired>
                <FormLabel>API Url</FormLabel>
                <Input
                  name="api_url"
                  value={newItem.api_url || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="api_secret" isRequired>
                <FormLabel>Api Secret </FormLabel>
                <Input
                  name="api_secret"
                  value={newItem.api_secret || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="platform_id" isRequired>
                <FormLabel>Platform Id</FormLabel>
                <Input
                  name="platform_id"
                  value={newItem.platform_id || ''}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="webhook_url" isRequired>
                <FormLabel>Webhook Url</FormLabel>
                <Input
                  name="webhook_url"
                  value={newItem.webhook_url || ''}
                  onChange={handleChange}
                />
              </FormControl>
         
              {/* <FormControl id="status" isRequired>
                <FormLabel>Status</FormLabel>
                <Input
                  name="status"
                  value={newItem.status || ''}
                  onChange={handleChange}
                />
              </FormControl> */}
            
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button disabled={addLoading} bg={bg} color={"white"} mr={3} onClick={handleAdd}>
            {addLoading?<Spinner/>:"Add"}
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddAutoPaymentCredential;
