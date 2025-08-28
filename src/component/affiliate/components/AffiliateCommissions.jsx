import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Badge,
  VStack,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiX,
  FiDownload,
  FiEye,
  FiCalendar,
} from 'react-icons/fi';

const AffiliateCommissions = () => {
  const toast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const commissions = [
    {
      id: '1',
      affiliate: 'John Smith',
      email: 'john@affiliate.com',
      period: 'January 2024',
      referrals: 45,
      revenue: 12500.0,
      commissionRate: 15,
      commissionAmount: 1875.0,
      status: 'paid',
      paidDate: '2024-02-01',
      paymentMethod: 'Bank Transfer',
    },
    {
      id: '2',
      affiliate: 'Sarah Johnson',
      email: 'sarah@marketing.com',
      period: 'January 2024',
      referrals: 32,
      revenue: 8900.0,
      commissionRate: 12,
      commissionAmount: 1068.0,
      status: 'pending',
      paidDate: null,
      paymentMethod: 'PayPal',
    },
    {
      id: '3',
      affiliate: 'Mike Wilson',
      email: 'mike@promo.com',
      period: 'December 2023',
      referrals: 58,
      revenue: 15200.0,
      commissionRate: 18,
      commissionAmount: 2736.0,
      status: 'approved',
      paidDate: null,
      paymentMethod: 'Cryptocurrency',
    },
  ];

  const handleToast = (title, description, status = 'info') => {
    toast({ title, description, status, duration: 3000, isClosable: true });
  };

  const filteredCommissions = commissions.filter((c) => {
    if (paymentFilter === 'all') return true;
    return c.status === paymentFilter;
  });

  const getStatusBadge = (status) => {
    const colorMap = {
      paid: 'green',
      approved: 'blue',
      pending: 'yellow',
      rejected: 'red',
    };
    return <Badge colorScheme={colorMap[status]}>{status}</Badge>;
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Heading size="lg">Affiliate Commissions</Heading>

      <Flex gap={4} wrap="wrap">
        <Select value={selectedPeriod}  bg={"white"} onChange={(e) => setSelectedPeriod(e.target.value)} w="200px">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </Select>

        <Select value={paymentFilter}  bg={"white"} onChange={(e) => setPaymentFilter(e.target.value)} w="200px">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </Select>

        <Spacer />

        <Button   bg={"white"} onClick={() => handleToast('Bulk Payment Initiated', 'Processing all approved commissions')}>
          Bulk Pay
        </Button>
        <Button  bg={"white"} leftIcon={<FiDownload />} onClick={() => handleToast('Export', 'Exporting commission data')}>
          Export
        </Button>
        <Button  bg={"white"} leftIcon={<FiCalendar />} onClick={() => handleToast('Report Generated', 'Report has been generated')}>
          Generate Report
        </Button>
      </Flex>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Affiliate</Th>
            <Th>Period</Th>
            <Th>Referrals</Th>
            <Th>Revenue</Th>
            <Th>Rate</Th>
            <Th>Commission</Th>
            <Th>Status</Th>
            <Th>Payment Method</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCommissions.map((c) => (
            <Tr key={c.id}>
              <Td>
                <Text fontWeight="bold">{c.affiliate}</Text>
                <Text fontSize="sm" color="gray.500">{c.email}</Text>
              </Td>
              <Td>{c.period}</Td>
              <Td>{c.referrals}</Td>
              <Td>{c.revenue.toLocaleString()}</Td>
              <Td>{c.commissionRate}%</Td>
              <Td fontWeight="bold">{c.commissionAmount.toFixed(2)}</Td>
              <Td>{getStatusBadge(c.status)}</Td>
              <Td>{c.paymentMethod}</Td>
              <Td>
                <HStack spacing={1}>
                  <IconButton icon={<FiEye />} size="sm" onClick={() => handleToast('View Details', `Viewing ${c.affiliate}`)} />
                  {c.status === 'pending' && (
                    <>
                      <IconButton icon={<FiCheckCircle />} size="sm" colorScheme="green" onClick={() => handleToast('Approved', `${c.affiliate} approved`)} />
                      <IconButton icon={<FiX />} size="sm" colorScheme="red" onClick={() => handleToast('Rejected', `${c.affiliate} rejected`, 'error')} />
                    </>
                  )}
                  {c.status === 'approved' && (
                    <Button size="sm" colorScheme="blue" onClick={() => handleToast('Payment Initiated', `Paying ${c.affiliate}`)}>
                      Pay
                    </Button>
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default AffiliateCommissions;
