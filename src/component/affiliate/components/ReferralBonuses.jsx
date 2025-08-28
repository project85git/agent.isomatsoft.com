import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Grid,
  Icon,
} from "@chakra-ui/react";
import { FaGift, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

const ReferralBonuses = () => {
  const toast = useToast();

  const bonuses = [
    {
      id: "1",
      name: "Welcome Bonus",
      type: "fixed",
      amount: 50,
      currency: "USD",
      description: "New player welcome bonus",
      isActive: true,
      uses: 245,
    },
    {
      id: "2",
      name: "High Roller Bonus",
      type: "percentage",
      amount: 25,
      currency: "%",
      description: "For deposits over 1000",
      isActive: true,
      uses: 12,
    },
  ];

  const handleCreateBonus = () => {
    toast({
      title: "Create Bonus",
      description: "Opening bonus creation form",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEditBonus = (id) => {
    const bonus = bonuses.find((b) => b.id === id);
    toast({
      title: "Edit Bonus",
      description: `Editing {bonus?.name} bonus configuration`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteBonus = (id) => {
    const bonus = bonuses.find((b) => b.id === id);
    toast({
      title: "Bonus Deleted",
      description: `{bonus?.name} has been removed from the system`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleViewDetails = (id) => {
    const bonus = bonuses.find((b) => b.id === id);
    toast({
      title: "Bonus Details",
      description: `Viewing detailed statistics for {bonus?.name}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleToggleStatus = (id) => {
    const bonus = bonuses.find((b) => b.id === id);
    const newStatus = bonus?.isActive ? "deactivated" : "activated";
    toast({
      title: "Status Updated",
      description: `{bonus?.name} has been {newStatus}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box mx="auto" >
      {/* Summary Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} mb={6}>
        {[
          {
            label: "Active Bonuses",
            value: 8,
            sub: "Currently available",
          },
          {
            label: "Total Redeemed",
            value: "1,247",
            sub: "This month",
          },
          {
            label: "Bonus Value",
            value: "12,450",
            sub: "Total distributed",
          },
          {
            label: "Conversion Rate",
            value: "68%",
            sub: "Bonus to deposit rate",
          },
        ].map((stat, index) => (
          <Box
            key={index}
            bg="white"
            rounded="lg"
            shadow="md"
            p={4}
            borderWidth="1px"
            borderColor="gray.200"
          >
            <Flex align="center" justify="space-between" mb={2}>
              <Heading size="sm" color="gray.600">
                {stat.label}
              </Heading>
              <Icon as={FaGift} color="gray.400" w={4} h={4} />
            </Flex>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              {stat.value}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {stat.sub}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Bonuses Table */}
      <Box bg="white" rounded="lg" shadow="md" borderWidth="1px" borderColor="gray.200">
        <Flex align="center" justify="space-between" p={6}>
          <Box>
            <Heading size="md" color="gray.900">
              Referral Bonuses
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Manage bonus offers for referred players
            </Text>
          </Box>
          <Button
            colorScheme="blue"
            leftIcon={<FaPlus />}
            onClick={handleCreateBonus}
            size="md"
          >
            Create Bonus
          </Button>
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Bonus Name</Th>
                <Th>Type</Th>
                <Th>Amount</Th>
                <Th>Description</Th>
                <Th>Uses</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bonuses.map((bonus) => (
                <Tr key={bonus.id}>
                  <Td fontWeight="medium">{bonus.name}</Td>
                  <Td>
                    <Badge variant="outline" colorScheme="gray">
                      {bonus.type}
                    </Badge>
                  </Td>
                  <Td>
                    {bonus.amount}
                    {bonus.currency}
                  </Td>
                  <Td>{bonus.description}</Td>
                  <Td>{bonus.uses}</Td>
                  <Td>
                    <Badge
                      colorScheme={bonus.isActive ? "green" : "gray"}
                      cursor="pointer"
                      onClick={() => handleToggleStatus(bonus.id)}
                    >
                      {bonus.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => handleViewDetails(bonus.id)}
                      >
                        <Icon as={FaEye} w={4} h={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => handleEditBonus(bonus.id)}
                      >
                        <Icon as={FaEdit} w={4} h={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        onClick={() => handleDeleteBonus(bonus.id)}
                      >
                        <Icon as={FaTrash} w={4} h={4} />
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default ReferralBonuses;