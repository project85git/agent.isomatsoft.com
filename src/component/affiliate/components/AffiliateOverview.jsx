import {
  Box,
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from '@chakra-ui/react';
import {
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUpload,
} from 'react-icons/fa';

const AffiliateOverview = () => {
  const toast = useToast();

  const affiliates = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@affiliate.com',
      referrals: 45,
      commission: 2850.0,
      status: 'active',
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@marketing.com',
      referrals: 32,
      commission: 1920.0,
      status: 'active',
      joinDate: '2024-02-20',
    },
  ];

  const handleToast = (title, description) => {
    toast({ title, description, status: 'info', duration: 3000, isClosable: true });
  };

  return (
    <VStack spacing={2} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <Box p={4} borderWidth="1px" borderRadius="lg" bg={"white"}>
          <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="medium">Total Affiliates</Text>
            <FaUsers />
          </Flex>
          <Text fontSize="2xl" fontWeight="bold">127</Text>
          <Text fontSize="xs" color="gray.500">+12% from last month</Text>
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="lg" bg={"white"}>
          <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="medium">Total Referrals</Text>
            <FaChartLine />
          </Flex>
          <Text fontSize="2xl" fontWeight="bold">1,234</Text>
          <Text fontSize="xs" color="gray.500">+23% from last month</Text>
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="lg" bg={"white"}>
          <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="medium">Total Commissions</Text>
            <FaDollarSign />
          </Flex>
          <Text fontSize="2xl" fontWeight="bold">45,230</Text>
          <Text fontSize="xs" color="gray.500">+18% from last month</Text>
        </Box>
        <Box p={4} borderWidth="1px" borderRadius="lg" bg={"white"}>
          <Flex justify="space-between">
            <Text fontSize="sm" fontWeight="medium">Avg Commission Rate</Text>
            <FaChartLine />
          </Flex>
          <Text fontSize="2xl" fontWeight="bold">15%</Text>
          <Text fontSize="xs" color="gray.500">Industry standard</Text>
        </Box>
      </SimpleGrid>
      

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Flex  bg={"white"} p={4} justify="space-between" align="center">
          <Box>
            <Heading size="md">Active Affiliates</Heading>
            <Text fontSize="sm" color="gray.500">Manage your affiliate partners</Text>
          </Box>
          <HStack spacing={2}>
            <Button leftIcon={<FaUpload />} variant="outline" onClick={() => handleToast('Data Exported', 'Affiliate data has been exported to CSV')}>
              Export Data
            </Button>
            <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={() => handleToast('Add New Affiliate', 'Opening affiliate registration form')}>
              Add Affiliate
            </Button>
          </HStack>
        </Flex>

        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Referrals</Th>
              <Th>Commission</Th>
              <Th>Status</Th>
              <Th>Join Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {affiliates.map((affiliate) => (
              <Tr key={affiliate.id}>
                <Td fontWeight="medium">{affiliate.name}</Td>
                <Td>{affiliate.email}</Td>
                <Td>{affiliate.referrals}</Td>
                <Td>{affiliate.commission.toFixed(2)}</Td>
                <Td>
                  <Badge colorScheme="green">{affiliate.status}</Badge>
                </Td>
                <Td>{affiliate.joinDate}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<FaEye />}
                      size="sm"
                      variant="outline"
                      onClick={() => handleToast('View Affiliate', `Viewing ${affiliate.name}`)}
                      aria-label="View"
                    />
                    <IconButton
                      icon={<FaEdit />}
                      size="sm"
                      variant="outline"
                      onClick={() => handleToast('Edit Affiliate', `Editing ${affiliate.name}`)}
                      aria-label="Edit"
                    />
                    <IconButton
                      icon={<FaTrash />}
                      size="sm"
                      variant="outline"
                      onClick={() => handleToast('Delete Affiliate', `${affiliate.name} has been removed`)}
                      aria-label="Delete"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default AffiliateOverview;
