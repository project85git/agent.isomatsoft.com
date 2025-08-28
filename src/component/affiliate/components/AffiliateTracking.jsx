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
import { FaLink, FaEye, FaCopy, FaChartBar, FaSyncAlt } from "react-icons/fa";

const AffiliateTracking = () => {
  const toast = useToast();

  const trackingLinks = [
    {
      id: "1",
      affiliate: "John Smith",
      code: "JOHN2024",
      url: "https://casino.com/?ref=JOHN2024",
      clicks: 1250,
      conversions: 45,
      conversionRate: 3.6,
      status: "active",
    },
    {
      id: "2",
      affiliate: "Sarah Johnson",
      code: "SARAH2024",
      url: "https://casino.com/?ref=SARAH2024",
      clicks: 890,
      conversions: 32,
      conversionRate: 3.6,
      status: "inactive",
    },
  ];

  const handleViewAnalytics = (id) => {
    const link = trackingLinks.find((l) => l.id === id);
    toast({
      title: "Analytics Opened",
      description: `Viewing detailed analytics for ${link?.affiliate}'s tracking link`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Tracking link copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleGenerateLink = () => {
    toast({
      title: "Link Generated",
      description: "New tracking link has been generated successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRefreshStats = () => {
    toast({
      title: "Stats Refreshed",
      description: "Tracking statistics have been updated",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Exported",
      description: "Tracking data has been exported to CSV",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box >
      {/* Summary Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} mb={6}>
        {[
          {
            label: "Total Clicks",
            value: "25,420",
            sub: "+12% from last month",
            icon: FaLink,
          },
          {
            label: "Conversions",
            value: "892",
            sub: "+23% from last month",
            icon: FaChartBar,
          },
          {
            label: "Conversion Rate",
            value: "3.5%",
            sub: "Industry average",
            icon: FaChartBar,
          },
          {
            label: "Active Links",
            value: "127",
            sub: "All tracking links",
            icon: FaLink,
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
              <Icon as={stat.icon} color="gray.400" w={5} h={5} />
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

      {/* Tracking Links Table */}
      <Box bg="white" rounded="lg" shadow="md" borderWidth="1px" borderColor="gray.200">
        <Flex align="center" justify="space-between" p={6}>
          <Box>
            <Heading size="md" color="gray.900">
              Tracking Links
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Monitor affiliate tracking link performance
            </Text>
          </Box>
          <Flex gap={2}>
            <Button
              variant="outline"
              colorScheme="blue"
              leftIcon={<FaSyncAlt />}
              onClick={handleRefreshStats}
            >
              Refresh
            </Button>
            <Button variant="outline" colorScheme="blue" onClick={handleExportData}>
              Export Data
            </Button>
            <Button colorScheme="blue" onClick={handleGenerateLink}>
              Generate Link
            </Button>
          </Flex>
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Affiliate</Th>
                <Th>Tracking Code</Th>
                <Th>URL</Th>
                <Th>Clicks</Th>
                <Th>Conversions</Th>
                <Th>Conversion Rate</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trackingLinks.map((link) => (
                <Tr key={link.id}>
                  <Td fontWeight="medium">{link.affiliate}</Td>
                  <Td>
                    <Text
                      as="code"
                      bg="gray.100"
                      px={2}
                      py={1}
                      rounded="sm"
                      fontSize="xs"
                    >
                      {link.code}
                    </Text>
                  </Td>
                  <Td maxW="xs" isTruncated>
                    {link.url}
                  </Td>
                  <Td>{link.clicks.toLocaleString()}</Td>
                  <Td>{link.conversions}</Td>
                  <Td>{link.conversionRate}%</Td>
                  <Td>
                    <Badge
                      colorScheme={link.status === "active" ? "green" : "gray"}
                      textTransform="capitalize"
                    >
                      {link.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => handleViewAnalytics(link.id)}
                      >
                        <Icon as={FaEye} w={4} h={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => handleCopyLink(link.url)}
                      >
                        <Icon as={FaCopy} w={4} h={4} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => handleViewAnalytics(link.id)}
                      >
                        <Icon as={FaChartBar} w={4} h={4} />
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

export default AffiliateTracking;