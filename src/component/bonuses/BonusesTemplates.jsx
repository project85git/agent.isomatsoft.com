import React from 'react';
import { Card, CardHeader, CardBody, Heading, Text } from '@chakra-ui/react';

const BonusesTemplates = () => {
  return (
    <Card className="border-gray-200 shadow-md rounded-md">
      <CardHeader>
        <Heading size="md" className="text-lg font-semibold text-gray-800">
          Bonus Templates
        </Heading>
        <Text className="text-sm text-gray-500">
          Pre-configured bonus templates for quick campaign creation
        </Text>
      </CardHeader>
      <CardBody>
        <Text className="text-gray-500 text-center py-8">
          Bonus templates feature coming soon...
        </Text>
      </CardBody>
    </Card>
  );
};

export default BonusesTemplates;