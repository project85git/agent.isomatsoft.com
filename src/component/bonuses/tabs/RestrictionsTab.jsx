import React from 'react';
import { Input, FormLabel, Box } from '@chakra-ui/react';

const RestrictionsTab = ({ bonusData, setBonusData }) => {
  return (
    <Box className="space-y-4">
      <Box className="grid grid-cols-2 gap-4">
        <Box className="space-y-2">
          <FormLabel htmlFor="validFrom" className="text-sm font-medium text-gray-700">
            Valid From
          </FormLabel>
          <Input
            id="validFrom"
            type="datetime-local"
            value={bonusData.validFrom}
            onChange={(e) => setBonusData({ ...bonusData, validFrom: e.target.value })}
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>

        <Box className="space-y-2">
          <FormLabel htmlFor="validUntil" className="text-sm font-medium text-gray-700">
            Valid Until
          </FormLabel>
          <Input
            id="validUntil"
            type="datetime-local"
            value={bonusData.validUntil}
            onChange={(e) => setBonusData({ ...bonusData, validUntil: e.target.value })}
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>
      </Box>

      <Box className="grid grid-cols-2 gap-4">
        <Box className="space-y-2">
          <FormLabel htmlFor="usageLimit" className="text-sm font-medium text-gray-700">
            Total Usage Limit
          </FormLabel>
          <Input
            id="usageLimit"
            type="number"
            value={bonusData.usageLimit}
            onChange={(e) => setBonusData({ ...bonusData, usageLimit: e.target.value })}
            placeholder="1000"
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>

        <Box className="space-y-2">
          <FormLabel htmlFor="perUserLimit" className="text-sm font-medium text-gray-700">
            Per User Limit
          </FormLabel>
          <Input
            id="perUserLimit"
            type="number"
            value={bonusData.perUserLimit}
            onChange={(e) => setBonusData({ ...bonusData, perUserLimit: e.target.value })}
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RestrictionsTab;