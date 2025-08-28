import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Progress,
  Switch,
  Badge,
  useToast,
} from "@chakra-ui/react";

import { fetchGetRequest, sendPatchRequest } from "../../api/api";
import { Provider, useSelector } from "react-redux";
import AddAutoPaymentCredential from "../../Modals/AddAutoPaymentCredential";
import EditAutoPaymentCredential from "../../Modals/EditAutoPaymentCredential";
import { formatDate, formatDateTime } from "../../../utils/utils";

const AutoPaymentCredential = () => {
  const [autoPaymentCredential, setAutoPaymentCredential] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [statusToggleLoading,setStatusToggleLoading]=useState(false)
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
        }/auto-payment-credential/get-all-payment-credential?`;
        const response = await fetchGetRequest(url);
        if (response.data && response.success) {
          setAutoPaymentCredential(response.data);
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
  const [EditAutoPaymentCredentialOpen, setEditAutoPaymentCredentialOpen]=useState(false);
  const handleViewOrEditInfoEdit = (provider) => {
    setSelectedProvider(provider);
    setEditAutoPaymentCredentialOpen(true);
  };

  const handleUpdate = (updatedProvider) => {
    setAutoPaymentCredential((prevInfo) =>
      prevInfo.map((provider) =>
        provider._id === updatedProvider._id ? updatedProvider : provider
      )
    );
    setEditModalOpen(false);
  };

  const handleAdd = (newProvider) => {
    setAutoPaymentCredential((prevInfo) => [...prevInfo, newProvider]);
  };

  const handleClose = () => {
    setEditModalOpen(false);
  };

  const truncateText = (text, length = 20) => {
    if (text?.length <= length) return text;
    return text?.substring(0, length) + "...";
  };

  const handleStatusChange = async (provider) => {
    const updatedStatus = provider.status=="active"?"inactive":"active";
    setStatusToggleLoading(true)
    try {
      const response = await sendPatchRequest(
        `${
          import.meta.env.VITE_API_URL
        }/auto-payment-credential/toggle-single-payment-credential/${provider._id}`,
);
      if (response.data && response.success) {
        setAutoPaymentCredential((prevInfo) =>
          prevInfo.map((item) =>
            item._id === provider._id
              ? { ...item, status: updatedStatus }
              : item
          )
        );
        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
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
    } catch (err) {
      toast({
        title: err?.response?.data?.message,
        status: "error",
        duration: 2000,
        position: "top",
        isClosable: true,
      });
      setError(err.message);
    }
    finally{
    setStatusToggleLoading(false)

    }
  };

  
  const handleEdit = (provider) => {
    setSelectedProvider(provider);
    setEditModalOpen(true);
  };

  return (
    <Box p={6} className="bg-gray-100 min-h-screen">
      <div className="flex justify-start w-full mb-6">
        <AddAutoPaymentCredential  onAdd={handleAdd} />
      </div>

      <Box overflowX="auto">
        {loading && (
          <Progress
            w={"100%"}
            size="xs"
            isIndeterminate
            colorScheme="#e91e63"
          />
        )}
        <Table
          variant="striped"
          colorScheme="gray"
          size="md"
          borderWidth="1px"
          borderColor="gray.300"
          borderRadius="md"
          style={{textWrap:"nowrap"}}
          boxShadow="md"
        >
          <Thead>
            <Tr>
              <Th borderColor="gray.300">Getway Name</Th>
              <Th borderColor="gray.300">Created At</Th>
              <Th borderColor="gray.300">Platform Id</Th>
              <Th borderColor="gray.300">Secret Key</Th>
              <Th borderColor="gray.300">API key</Th>

              <Th borderColor="gray.300">Api URL</Th>
              <Th borderColor="gray.300">Webhook URL</Th>
              <Th borderColor="gray.300">Manage Status</Th>
              <Th borderColor="gray.300">Actions</Th>

             
            </Tr>
          </Thead>
          <Tbody>
            {autoPaymentCredential.map((item) => (
              <Tr key={item._id.$oid}>
                <Td borderColor="gray.300">{item.payment_gateway}</Td>
                <Td borderColor="gray.300">
                  <div  className="flex flex-col text-xs  flex-wrap gap-1">
                    <p>{ formatDateTime(item.created_at).split(" ")[0]}</p>
                    <p>({formatDateTime(item.created_at).split(" ")[1]})</p>

                  </div>
                </Td>

                <Td borderColor="gray.300">
                  <Tooltip
                    label={item.platform_id}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(item.platform_id)}</span>
                  </Tooltip>
                </Td>
                <Td borderColor="gray.300">
                  <Tooltip
                    label={item.api_secret}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(item.api_secret)}</span>
                  </Tooltip>
                </Td>


                <Td borderColor="gray.300">
                  <Tooltip
                    label={item.api_key}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(item.api_key||"N/A")}</span>
                  </Tooltip>
                </Td>
                <Td borderColor="gray.300">
                  <Tooltip
                    label={item.api_url}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(item.api_url)}</span>
                  </Tooltip>
                </Td>

                <Td borderColor="gray.300">
                  <Tooltip
                    label={item.webhook_url}
                    bg="teal.500"
                    color="white"
                  >
                    <span>{truncateText(item.webhook_url)}</span>
                  </Tooltip>
                </Td>
                <Td borderColor="gray.300">
                  <p className="flex items-center gap-2 ">
                    <Badge
                      style={{
                        backgroundColor: item.status=="active" ? "green" : "red",
                        color: "white",
                      }}
                    >
                      {" "}
                      {item.status=="active" ? "active" : "Inactive"}{" "}
                    </Badge>
                    <Switch
                      name="status"
                      disabled={statusToggleLoading}
                      isChecked={item.status=="active"?true:false}
                      onChange={() => handleStatusChange(item)}
                    />
                  </p>
                </Td>

                {/* {check&& */}
                <Td borderColor={border} className="flex  gap-1">
                  <Button
                    style={{ backgroundColor: bg, color: "white" }}
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>

                 
                </Td>
                {/* } */}
         
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {isEditModalOpen && selectedProvider && (
        <EditAutoPaymentCredential
          item={selectedProvider}
          onUpdate={handleUpdate}
          onClose={handleClose}
        />
      )}


    </Box>
  );
};

export default AutoPaymentCredential;
