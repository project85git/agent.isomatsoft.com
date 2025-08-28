import React from 'react';
import { Card, CardHeader, CardBody, Heading, Text, Input, Box } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

const BonusesOverview = ({ searchTerm, setSearchTerm }) => {
  return (
    <Card className="border-gray-200 shadow-md rounded-md">
      <CardHeader>
        <Heading size="md" className="text-lg font-semibold text-gray-800">
          Bonus Search & Filters
        </Heading>
        <Text className="text-sm text-gray-500">
          Find and filter bonus campaigns
        </Text>
      </CardHeader>
      <CardBody>
        <Box className="relative">
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bonuses by name, code, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>
      </CardBody>
    </Card>
  );
};

export default BonusesOverview;