import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
  Center,
  useToast,
  Badge,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';
import { sendPatchRequest, sendPostRequest } from '../api/api';
import { useSelector } from 'react-redux';
import AgentInfo from '../component/agentInfo/AgentInfo';

const ViewOrEditAgentInfo = ({ apiProviderName, token, agentCode, isOpen, onClose }) => {
  const [agentInfo, setAgentInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [rtp, setRtp] = useState(0);
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

  const fetchAgentInfo = async () => {
    setIsLoading(true);
    try {
      let url = '';
      let data = {};
      switch (apiProviderName) {
        case 'DREAMGATES':
          url = `${import.meta.env.VITE_API_URL}/api/provider-information/get-dreamgates-agent-info`;
          data = { token };
          break;
        case 'EVERGAME':
          url = `${import.meta.env.VITE_API_URL}/api/provider-information/get-evergame-agent-info`;
          data = { token, agentCode };
          break;
        case 'NEXUSGGREU':
          url = `${import.meta.env.VITE_API_URL}/api/provider-information/get-nexus-agent-info`;
          data = { agentCode, token };
          break;
          case 'WORLDSLOT':
          url = `${import.meta.env.VITE_API_URL}/api/provider-information/get-worldslot-agent-info`;
          data = { agentCode, token };
          break;
          case 'DIASLOT':
          url = `${import.meta.env.VITE_API_URL}/api/provider-information/get-diaslot-agent-info`;
          data = { agentCode, token };
          break;
          case 'TIMELESS':
          url = `${import.meta.env.VITE_API_URL}/api/provider-information/get-timeless-agent-info`;
          data = { operatorId:agentCode, secretKey:token };
          break;
        default:
          throw new Error('Unknown API provider');
      }
      const response = await sendPostRequest(url, data);
      setAgentInfo(response?.data || response?.agent || response);
      if (response?.data?.win_ratio) {
        setRtp(response?.data?.win_ratio);
      }
    } catch (error) {
      console.error('Error fetching agent info:', error);
      toast({
        description: 'Internal server error.',
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAgentInfo();
    }
  }, [isOpen, token]);

  const handleInputChange = (e) => {
    setRtp(e.target.value);
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    
    const payload = {
      winRatio: +rtp,
      token
    };
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/provider-information/update-dreamgates-agent-rtp`;
      await sendPatchRequest(url, payload);
      toast({
        description: 'Agent information updated successfully.',
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
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent style={{ minHeight: '280px', maxHeight:"100vh" }}>
        <ModalHeader className='flex justify-center items-center'>Agent Information</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <Center>
              <Spinner size="lg" />
            </Center>
          ) : (
            <>
              <Flex mb="1rem" gap={"1"} fontWeight={"600"} alignItems={"center"}>
              {
            
               <AgentInfo data={{...agentInfo, agent_balance:agentInfo?.balance||agentInfo?.agent_balance||agentInfo?.available_balance
               }}/>}
              </Flex>
              {apiProviderName === "DREAMGATES" && (
                <>
                  <Text as="label" htmlFor="rtp" fontWeight="semibold" mb="1rem" color={text}>
                    RTP
                  </Text>
                  <Input
                    id="rtp"
                    placeholder="Enter Agent RTP"
                    value={rtp}
                    onChange={handleInputChange}
                    mb="1rem"
                    borderColor={border}
                    _hover={{ borderColor: hoverColor }}
                  />
                </>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {apiProviderName === 'DREAMGATES' && (
            <Button
              style={{ backgroundColor: bg, color: 'white' }}
              mr={3}
              onClick={handleUpdate}
              isLoading={updateLoading}
            >
              Update RTP
            </Button>
          )}
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewOrEditAgentInfo;
