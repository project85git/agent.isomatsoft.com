import React, { useEffect, useState } from 'react';
import { Card, CardBody, Text, Heading, Flex, Box, useToast } from '@chakra-ui/react';
import { FaBullseye, FaDollarSign, FaUsers, FaChartLine } from 'react-icons/fa';
import { fetchGetRequest } from '../../api/api';

const BonusesAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalBonuses: 0,
    activeBonuses: 0,
    totalClaims: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const getBonusAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetchGetRequest(`${import.meta.env.VITE_API_URL}/api/bonus/get-bonus-analytics`);
        const result = await response;
        if (response.data) {
          setAnalytics(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch bonus analytics");
        }
      } catch (error) {
        toast({
          description: error.message,
          status: "error",
          duration: 4000,
          position: "top",
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    getBonusAnalytics();
  }, []);

  const { totalBonuses, activeBonuses, totalClaims, completionRate } = analytics;

  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-gray-200 shadow-md rounded-md">
        <CardBody className="p-4">
          <Flex alignItems="center" justifyContent="space-between">
            <Box>
              <Heading size="lg" className="text-2xl font-bold text-gray-800">
                {loading ? '...' : totalBonuses}
              </Heading>
              <Text className="text-sm text-gray-500">Total Bonuses</Text>
            </Box>
            <FaBullseye className="h-8 w-8 text-blue-500" />
          </Flex>
        </CardBody>
      </Card>

      <Card className="border-gray-200 shadow-md rounded-md">
        <CardBody className="p-4">
          <Flex alignItems="center" justifyContent="space-between">
            <Box>
              <Heading size="lg" className="text-2xl font-bold text-gray-800">
                {loading ? '...' : activeBonuses}
              </Heading>
              <Text className="text-sm text-gray-500">Active Bonuses</Text>
            </Box>
            <FaDollarSign className="h-8 w-8 text-green-500" />
          </Flex>
        </CardBody>
      </Card>

      <Card className="border-gray-200 shadow-md rounded-md">
        <CardBody className="p-4">
          <Flex alignItems="center" justifyContent="space-between">
            <Box>
              <Heading size="lg" className="text-2xl font-bold text-gray-800">
                {loading ? '...' : totalClaims}
              </Heading>
              <Text className="text-sm text-gray-500">Total Claims</Text>
            </Box>
            <FaUsers className="h-8 w-8 text-purple-500" />
          </Flex>
        </CardBody>
      </Card>

      <Card className="border-gray-200 shadow-md rounded-md">
        <CardBody className="p-4">
          <Flex alignItems="center" justifyContent="space-between">
            <Box>
              <Heading size="lg" className="text-2xl font-bold text-gray-800">
                {loading ? '...' : `${completionRate}%`}
              </Heading>
              <Text className="text-sm text-gray-500">Completion Rate</Text>
            </Box>
            <FaChartLine className="h-8 w-8 text-orange-500" />
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default BonusesAnalytics;
