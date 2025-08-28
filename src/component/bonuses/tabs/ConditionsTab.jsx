import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Textarea,
  FormLabel,
  Box,
} from '@chakra-ui/react';

const ConditionsTab = () => {
  return (
    <Card className="border-gray-200 shadow-md rounded-md">
      <CardHeader>
        <Heading size="md" className="text-lg font-semibold text-gray-800">
          Eligible Games & Providers
        </Heading>
      </CardHeader>
      <CardBody>
        <Text className="text-sm text-gray-500 mb-4">
          Leave empty to allow all games. Add specific games or providers to restrict.
        </Text>
        <Box className="grid grid-cols-2 gap-4">
          <Box className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">
              Eligible Games
            </FormLabel>
            <Textarea
              placeholder="Enter game IDs or names, one per line"
              rows={4}
              className="border-gray-300 rounded-md"
              focusBorderColor="blue.500"
            />
          </Box>
          <Box className="space-y-2">
            <FormLabel className="text-sm font-medium text-gray-700">
              Eligible Providers
            </FormLabel>
            <Textarea
              placeholder="Enter provider names, one per line"
              rows={4}
              className="border-gray-300 rounded-md"
              focusBorderColor="blue.500"
            />
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default ConditionsTab;