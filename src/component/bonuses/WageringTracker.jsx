import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Box,
  Flex,
  Progress,
  useToast,
  Select,
  Input,
  Collapse,
} from '@chakra-ui/react';
import { FaBullseye, FaChartLine, FaClock, FaCheckCircle, FaExclamationCircle, FaEye, FaCog, FaDownload, FaChevronDown } from 'react-icons/fa';
import { BiRefresh } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { fetchGetRequest } from '../../api/api';

const WageringTracker = () => {
  const toast = useToast();
  const { bg } = useSelector((state) => state.theme);
  const [userBonuses, setUserBonuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('status');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState({});

  const calculateWageringProgress = (wagered, required) => {
    return Math.min((wagered / required) * 100, 100);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'blue',
      completed: 'green',
      expired: 'red',
      forfeited: 'gray',
      pending: 'yellow',
      cancelled: 'orange'
    };
    return colors[status] || 'gray';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: <FaCheckCircle className="h-4 w-4" />,
      expired: <FaExclamationCircle className="h-4 w-4" />,
      cancelled: <FaExclamationCircle className="h-4 w-4" />,
      default: <FaClock className="h-4 w-4" />
    };
    return icons[status] || icons.default;
  };

  const formatTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const fetchUserBonuses = async () => {
    try {
      setLoading(true);
      const response = await fetchGetRequest(`${import.meta.env.VITE_API_URL}/api/user-bonus/user-bonuses`);
      const formatted = response.bonuses.map((b) => ({
        id: b._id,
        user_id: b?.user_id || 'N/A',
        // bonus: b?.code || 'Bonus',
        code: b?.code || 'N/A',
        amount: b.awarded_amount,
        wagering_requirement: b.wagering_requirement,
        current_wagered_amount: b.current_wagered_amount,
        status: b.status,
        expiry: b.expires_at,
        claimed_at: b.claimed_at,
        game_contributions: b.game_contributions || [],
        updated_at: b.updated_at,
      }));
      setUserBonuses(formatted);
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to fetch bonuses',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredAndSortedBonuses = useMemo(() => {
    let result = [...userBonuses];

    if (statusFilter !== 'all') {
      result = result.filter(bonus => bonus.status === statusFilter);
    }

    if (searchTerm) {
      result = result.filter(bonus => 
        bonus.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bonus.bonus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bonus.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [userBonuses, sortField, sortOrder, statusFilter, searchTerm]);

  useEffect(() => {
    fetchUserBonuses();
  }, []);

  return (
    <Box className=" space-y-6  mx-auto" minH="100vh">
      <Card bg="white" shadow="lg" rounded="lg">
        <CardHeader p={6}>
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Heading size="lg" color="gray.800">Wagering Progress Tracker</Heading>
            <Flex gap={3} flexWrap="wrap">
              <Input 
                placeholder="Search by player, bonus, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width={{ base: '100%', md: '200px' }}
                bg="gray.50"
              />
              <Select 
                width={{ base: '100%', md: '200px' }} 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                bg="gray.50"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </Select>
              <Button 
                colorScheme="blue" 
                onClick={fetchUserBonuses} 
                isLoading={loading}
                leftIcon={<BiRefresh />}
              >
                Refresh
              </Button>
              <Button 
                colorScheme="green" 
                onClick={() => toast({ title: 'Exporting report...', status: 'info', duration: 3000 })}
                leftIcon={<FaDownload />}
              >
                Export
              </Button>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody p={6}>
          <Flex mb={6} gap={4} flexWrap="wrap">
            <Card flex={{ base: '1', md: '1' }} minW={{ base: '100%', md: '200px' }} shadow="md" rounded="lg">
              <CardBody>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Heading size="md" color="gray.800">{userBonuses.filter(b => b.status === 'active').length}</Heading>
                    <Text fontSize="sm" color="gray.500">Active Bonuses</Text>
                  </Box>
                  <FaBullseye className="h-8 w-8 text-blue-500" />
                </Flex>
              </CardBody>
            </Card>
            <Card flex={{ base: '1', md: '1' }} minW={{ base: '100%', md: '200px' }} shadow="md" rounded="lg">
              <CardBody>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Heading size="md" color="gray.800">{userBonuses.reduce((sum, b) => sum + (b.amount || 0), 0).toFixed(2)}</Heading>
                    <Text fontSize="sm" color="gray.500">Total Bonus Value</Text>
                  </Box>
                  <FaChartLine className="h-8 w-8 text-green-500" />
                </Flex>
              </CardBody>
            </Card>
            <Card flex={{ base: '1', md: '1' }} minW={{ base: '100%', md: '200px' }} shadow="md" rounded="lg">
              <CardBody>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Heading size="md" color="gray.800">{userBonuses.filter(b => b.status === 'completed').length}</Heading>
                    <Text fontSize="sm" color="gray.500">Completed Bonuses</Text>
                  </Box>
                  <FaCheckCircle className="h-8 w-8 text-green-500" />
                </Flex>
              </CardBody>
            </Card>
          </Flex>

          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th onClick={() => handleSort('username')} cursor="pointer" _hover={{ bg: 'gray.100' }}>Player</Th>
                  <Th onClick={() => handleSort('bonus')} cursor="pointer" _hover={{ bg: 'gray.100' }}>Code</Th>
                  <Th onClick={() => handleSort('amount')} cursor="pointer" _hover={{ bg: 'gray.100' }}>Amount</Th>
                  <Th onClick={() => handleSort('current_wagered_amount')} cursor="pointer" _hover={{ bg: 'gray.100' }}>Progress</Th>
                  <Th onClick={() => handleSort('current_wagered_amount')} cursor="pointer" _hover={{ bg: 'gray.100' }}>Wagered</Th>
                  <Th>Wagering Req.</Th>
                  <Th>Remaining</Th>
                  <Th onClick={() => handleSort('expiry')} cursor="pointer" _hover={{ bg: 'gray.100' }}>Time Left</Th>
                  <Th onClick={() => handleSort('status')} cursor="pointer" _hover={{ bg: 'gray.100' }}>Status</Th>
                  <Th onClick={() => handleSort('claimed_at')} cursor="pointer" _hover={{ bg: 'gray.100' }}>Claimed</Th>
                  <Th>Games</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAndSortedBonuses.map((bonus) => {
                  const wageringRequired = (bonus.amount || 0) * (bonus.wagering_requirement || 1);
                  const progress = calculateWageringProgress(bonus.current_wagered_amount || 0, wageringRequired);
                  const remaining = Math.max(wageringRequired - (bonus.current_wagered_amount || 0), 0);
                  const isExpanded = expandedRows[bonus.id];

                  return (
                    <React.Fragment key={bonus.id}>
                      <Tr _hover={{ bg: 'gray.50' }}>
                        <Td>{bonus.user_id}</Td>
                        <Td>
                          <Box>
                            <Text fontWeight="medium">{bonus.bonus}</Text>
                            {bonus.code && <Badge colorScheme="gray" mt={1}>{bonus.code}</Badge>}
                          </Box>
                        </Td>
                        <Td>{(bonus.amount || 0).toFixed(2)}</Td>
                        <Td>
                          <Progress value={progress} size="md" colorScheme="blue" borderRadius="md" />
                          <Text fontSize="xs" color="gray.500" mt={1}>{progress.toFixed(1)}%</Text>
                        </Td>
                        <Td>{(bonus.current_wagered_amount || 0).toFixed(2)}</Td>
                        <Td>{wageringRequired.toFixed(2)}</Td>
                        <Td>{remaining.toFixed(2)}</Td>
                        <Td>{bonus.expiry ? formatTimeRemaining(bonus.expiry) : 'No limit'}</Td>
                        <Td>
                          <Badge 
                            colorScheme={getStatusColor(bonus.status)} 
                            display="flex" 
                            alignItems="center" 
                            gap={1}
                            px={2}
                            py={1}
                            rounded="md"
                          >
                            {getStatusIcon(bonus.status)}
                            {bonus.status}
                          </Badge>
                        </Td>
                        <Td>{formatDate(bonus.claimed_at)}</Td>
                        <Td>
                          <Flex align="center" gap={2}>
                            <Text fontSize="sm">{bonus.game_contributions.length} games</Text>
                            {bonus.game_contributions.length > 0 && (
                              <Button 
                                size="xs" 
                                variant="ghost" 
                                onClick={() => toggleRowExpansion(bonus.id)}
                              >
                                <FaChevronDown className={isExpanded ? 'rotate-180' : ''} />
                              </Button>
                            )}
                          </Flex>
                        </Td>
                        <Td>
                          <Flex gap={2}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => toast({ 
                                title: `Viewing bonus ${bonus.id}`, 
                                status: 'info',
                                duration: 3000 
                              })}
                            >
                              <FaEye />
                            </Button>
                            {bonus.status === 'active' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => toast({ 
                                  title: `Adjusting bonus ${bonus.id}`, 
                                  status: 'info',
                                  duration: 3000 
                                })}
                              >
                                <FaCog />
                              </Button>
                            )}
                          </Flex>
                        </Td>
                      </Tr>
                      {bonus.game_contributions.length > 0 && (
                        <Tr>
                          <Td colSpan={12}>
                            <Collapse in={isExpanded}>
                              <Box p={4} bg="gray.50" rounded="md">
                                <Heading size="sm" mb={2}>Game Contributions</Heading>
                                <Table size="sm" variant="simple">
                                  <Thead>
                                    <Tr>
                                      <Th>Game ID</Th>
                                      <Th>Wagered Amount</Th>
                                      <Th>Contribution %</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {bonus.game_contributions.map((game, index) => (
                                      <Tr key={index}>
                                        <Td>{game.game_id}</Td>
                                        <Td>${(game.wagered_amount || 0).toFixed(2)}</Td>
                                        <Td>{(game.contribution_percentage || 0)}%</Td>
                                      </Tr>
                                    ))}
                                  </Tbody>
                                </Table>
                              </Box>
                            </Collapse>
                          </Td>
                        </Tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </Tbody>
            </Table>
          </Box>

          {filteredAndSortedBonuses.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="gray.500" fontSize="lg">No bonus wagering data found</Text>
              <Button 
                mt={4} 
                colorScheme="blue" 
                onClick={fetchUserBonuses} 
                isLoading={loading}
              >
                Refresh Data
              </Button>
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default WageringTracker;