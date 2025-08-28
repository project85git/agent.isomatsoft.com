import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner,
  Tooltip,
  Progress,
  Switch,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Select,
} from "@chakra-ui/react";
import { FiEdit, FiInfo, FiTrash2 } from "react-icons/fi";
import EditDataProvider from "./EditDataProvider";
import AddDataProvider from "./AddDataProvider";
import { fetchGetRequest, sendDeleteRequest, sendPatchRequest } from "../api/api";
import { useSelector } from "react-redux";
import ViewOrEditAgentInfo from "./ViewOrEditAgentInfo";
import { checkPermission } from "../../utils/utils";

const DataProvider = () => {
  const [providerInfo, setProviderInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [viewOrEditAgentInfoOpen, setViewOrEditAgentInfoOpen] = useState(false);
  const [selectedProviderName, setSelectedProviderName] = useState("all");
  const [selectedCurrency, setSelectedCurrency] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
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
  const toast = useToast();

  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
        const url = `${
          import.meta.env.VITE_API_URL
        }/api/provider-information/get-provider-information?`;
        const response = await fetchGetRequest(url);

        if (response.data && response.success) {
          setProviderInfo(response.data);
        } else {
          setError("Failed to retrieve data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderInfo();
  }, []);

  const handleViewOrEditInfoEdit = (provider) => {
    setSelectedProvider(provider);
    setViewOrEditAgentInfoOpen(true);
  };

  const handleUpdate = (updatedProvider) => {
    setProviderInfo((prevInfo) =>
      prevInfo.map((provider) =>
        provider._id === updatedProvider._id ? updatedProvider : provider
      )
    );
    setEditModalOpen(false);
  };

  const handleAdd = (newProvider) => {
    setProviderInfo((prevInfo) => [...prevInfo, newProvider]);
  };

  const handleClose = () => {
    setEditModalOpen(false);
  };

  const truncateText = (text, length = 15) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  const handleStatusChange = async (provider) => {
    setIsStatusLoading(true);
    const updatedStatus = !provider.status;
    try {
      const response = await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/provider-information/update-provider-information-status/${
          provider._id
        }?`,
        {
          id: provider._id,
          status: updatedStatus,
        }
      );

      if (response.data && response.success) {
        setProviderInfo((prevInfo) =>
          prevInfo.map((item) =>
            item._id === provider._id
              ? { ...item, status: updatedStatus }
              : item
          )
        );
      } else {
        toast({
          title: response.data.message,
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        setError("Failed to update status");
      }
      setIsStatusLoading(false);
    } catch (err) {
      toast({
        title: err?.response?.data?.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setError(err.message);
      setIsStatusLoading(false);
    }
  };

  const handleDelete = (provider) => {
    setSelectedProvider(provider);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setSelectedProvider(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = async (provider) => {
    setDeleteLoading(true);
    try {
      const response = await sendDeleteRequest(
        `${
          import.meta.env.VITE_API_URL
        }/api/provider-information/delete-provider-information/${
          provider._id
        }?`
      );
      if (response.data && response.success) {
        setProviderInfo((prevInfo) =>
          prevInfo.filter((item) => item._id !== provider._id)
        );
        setSelectedProvider(null);
      } else {
        toast({
          title: response.message,
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        setError("Failed to update status");
      }
    } catch (err) {
      toast({
        title: err?.response?.data?.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setError(err.message);
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEdit = (provider) => {
    setSelectedProvider(provider);
    setEditModalOpen(true);
  };

  const user = useSelector((state) => state.authReducer);
  const adminData = user.user || {};
  const isOwnerAdmin = adminData?.role_type === import.meta.env.VITE_ROLE_SUPER;
  const permissionDetails = user?.user?.permissions;
  let hasPermission = checkPermission(permissionDetails, "providerInformationManage");
  let check = !isOwnerAdmin ? hasPermission : true;

  // Extract unique provider names, currencies, and types
  const providerNames = ["all", ...new Set(providerInfo.map(p => p.provider_name))];
  const currencies = ["all", ...new Set(providerInfo.map(p => p.currency))];
  const types = ["all", "CASINO", "SPORTBOOK"];

  // Filter providers based on selected provider name, currency, and type
  const filteredProviders = providerInfo.filter(provider => 
    (selectedProviderName === "all" || provider.provider_name === selectedProviderName) &&
    (selectedCurrency === "all" || provider.currency === selectedCurrency) &&
    (selectedType === "all" || provider.api_type === selectedType)
  );

  return (
    <Box
      bg="white"
      minH="100vh"
      p={3}
      borderRadius="lg"
      boxShadow="md"
      m={3}
      mx="1"
    >
      {check && (
        <Flex justify="space-between" align="center" mb={2}>
          <Heading size="md" color="gray.800">Data Providers</Heading>
          <AddDataProvider onAdd={handleAdd} />
        </Flex>
      )}

        {loading && (
          <Progress
            w="full"
            size="xs"
            isIndeterminate
            sx={{
              '& > div': {
                background: bg,
              },
            }}
            borderRadius="md"
            mb={3}
          />
        )}


      {error && (
        <Text color="red.500" textAlign="center" mb={3} fontSize="sm">
          {error}
        </Text>
      )}

      <Flex mb={4} gap={3}>
        <Select 
          value={selectedProviderName} 
          onChange={(e) => setSelectedProviderName(e.target.value)}
          bg="white"
          borderColor="gray.300"
          size="sm"
          w="180px"
        >
          {providerNames.map(name => (
            <option key={name} value={name}>
              {name === "all" ? "All Providers" : name}
            </option>
          ))}
        </Select>
        <Select 
          value={selectedCurrency} 
          onChange={(e) => setSelectedCurrency(e.target.value)}
          bg="white"
          borderColor="gray.300"
          size="sm"
          w="180px"
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>
              {currency === "all" ? "All Currencies" : currency}
            </option>
          ))}
        </Select>
        <Select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          bg="white"
          borderColor="gray.300"
          size="sm"
          w="180px"
        >
          {types.map(type => (
            <option key={type} value={type}>
              {type === "all" ? "All Types" : type}
            </option>
          ))}
        </Select>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, "2xl":6 }}  spacing={3}>
        {filteredProviders.map((provider) => (
          <Card
              key={provider._id}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
              transition="all 0.2s"
              fontSize="sm"
            >

            <CardHeader py={2} px={3}>
              <Flex justify="space-between" align="center">
                <Text fontWeight="semibold" className="flex justify-between gap-2 items-center" color="gray.700" isTruncated>
                 <span >{provider.provider_name}</span> <Badge fontSize={"12px"} rounded={"md"} textAlign={"center"} bg={bg} color={"white"}>{provider.api_type}</Badge>
                </Text>
                <Badge
                  colorScheme={provider.status ? "green" : "red"}
                  px={2}
                  py={0.5}
                  fontSize="0.7em"
                >
                  {provider.status ? "Active" : "Inactive"}
                </Badge>
              </Flex>
            </CardHeader>
            <CardBody py={2} px={3} >
              <SimpleGrid columns={2} spacing={2}>
                <Box>
                  <Text color="gray.500" fontSize="xs">Agent Code</Text>
                  <Tooltip label={provider.agent_code} bg={bg} color="white">
                    <Text fontWeight="medium" isTruncated>
                      {truncateText(provider.agent_code)}
                    </Text>
                  </Tooltip>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">API Token</Text>
                  <Tooltip label={provider.api_token} bg={bg} color="white">
                    <Text fontWeight="medium" isTruncated>
                      {truncateText(provider.api_token)}
                    </Text>
                  </Tooltip>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Callback Token</Text>
                  <Tooltip label={provider.callback_token} bg={bg} color="white">
                    <Text fontWeight="medium" isTruncated>
                      {truncateText(provider.callback_token)}
                    </Text>
                  </Tooltip>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Secret Key</Text>
                  <Tooltip label={provider.secret_key} bg={bg} color="white">
                    <Text fontWeight="medium" isTruncated>
                      {truncateText(provider.secret_key)}
                    </Text>
                  </Tooltip>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Currency</Text>
                  <Text fontWeight="medium">{provider.currency}</Text>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Type</Text>
                  <Text fontWeight="medium">{provider.type}</Text>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Percent</Text>
                  <Text fontWeight="medium">{provider.percent}%</Text>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Max Limit</Text>
                  <Text fontWeight="medium">{provider.max_limit}</Text>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Min Limit</Text>
                  <Text fontWeight="medium">{provider.min_limit}</Text>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Max Per Match</Text>
                  <Text fontWeight="medium">{provider.max_per_match}</Text>
                </Box>
                <Box>
                  <Text color="gray.500" fontSize="xs">Casino Table Limit</Text>
                  <Text fontWeight="medium">{provider.casino_table_limit}</Text>
                </Box>
              </SimpleGrid>
              {check && (
                <Flex align="center" gap={2} mt={3}>
                  <Text color="gray.500" fontSize="xs">Status</Text>
                  <Switch
                    isDisabled={isStatusLoading}
                    isChecked={provider.status}
                    onChange={() => handleStatusChange(provider)}
                    size="sm"
                    colorScheme="teal"
                  />
                </Flex>
              )}
              {check && (
                <Flex gap={2} justify="flex-end" mt={3}>
                  <Tooltip label="Edit Provider" bg={bg} color="white">
                    <Button
                      size="xs"
                      bg={bg}
                      color="white"
                      leftIcon={<FiEdit />}
                      _hover={{ bg: hoverColor }}
                      onClick={() => handleEdit(provider)}
                    >
                      Edit
                    </Button>
                  </Tooltip>
                  {provider?.provider_name !== "SBOORIGINAL" && (
                    <Tooltip label="View Info" bg={bg} color="white">
                      <Button
                        size="xs"
                        bg={bg}
                        color="white"
                        leftIcon={<FiInfo />}
                        _hover={{ bg: hoverColor }}
                        onClick={() => handleViewOrEditInfoEdit(provider)}
                      >
                        Info
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip label="Delete Provider" bg="red.500" color="white">
                    <Button
                      size="xs"
                      bg="red.500"
                      color="white"
                      leftIcon={<FiTrash2 />}
                      _hover={{ bg: "red.600" }}
                      onClick={() => handleDelete(provider)}
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </Flex>
              )}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent borderRadius="lg">
          <ModalHeader fontSize="md">Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="sm">
            Are you sure you want to delete this provider?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              isLoading={deleteLoading}
              size="sm"
              mr={2}
              onClick={() => handleDeleteConfirm(selectedProvider)}
            >
              Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDeleteCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditModalOpen && selectedProvider && (
        <EditDataProvider
          item={selectedProvider}
          onUpdate={handleUpdate}
          onClose={handleClose}
        />
      )}

      {viewOrEditAgentInfoOpen && selectedProvider && (
        <ViewOrEditAgentInfo
          isOpen={viewOrEditAgentInfoOpen}
          onClose={() => setViewOrEditAgentInfoOpen(false)}
          apiProviderName={selectedProvider?.provider_name}
          token={selectedProvider?.api_token}
          agentCode={selectedProvider?.agent_code}
        />
      )}
    </Box>
  );
};

export default DataProvider;