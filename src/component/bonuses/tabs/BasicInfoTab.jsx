import React from 'react';
import {
  Input,
  FormLabel,
  Textarea,
  Select,
  Switch,
  Flex,
  Box,
} from '@chakra-ui/react';
import { bonusTypes } from '../data/bonusTypes';

const BasicInfoTab = ({ bonusData, setBonusData }) => {
  return (
    <Box className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Box className="space-y-2">
          <FormLabel m={0} htmlFor="name" className="text-sm font-medium text-gray-700">
            Bonus Name *
          </FormLabel>
          <Input
            id="name"
            m={0}
            value={bonusData.name}
            onChange={(e) => setBonusData({ ...bonusData, name: e.target.value })}
            placeholder="e.g., Welcome Bonus"
            // className="border-gray-300 rounded-md m-0"
            focusBorderColor="blue.500"
          />
        </Box>

        <Box className="space-y-2">
          <FormLabel htmlFor="type" className="text-sm font-medium text-gray-700">
            Bonus Type *
          </FormLabel>
          <Select
            value={bonusData.type}
            onChange={(e) => setBonusData({ ...bonusData, type: e.target.value })}
            placeholder="Select bonus type"
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          >
            {bonusTypes.map((type) => {
              const Icon = type.icon;
              return (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              );
            })}
          </Select>
        </Box>
      </div>

      <Box className="space-y-2">
        <FormLabel htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </FormLabel>
        <Textarea
          id="description"
          value={bonusData.description}
          onChange={(e) => setBonusData({ ...bonusData, description: e.target.value })}
          placeholder="Describe the bonus terms and conditions"
          rows={3}
          className="border-gray-300 rounded-md"
          focusBorderColor="blue.500"
        />
      </Box>

      <div className="grid grid-cols-3 gap-4">
        <Box className="space-y-2">
          <FormLabel htmlFor="code" className="text-sm font-medium text-gray-700">
            Bonus Code
          </FormLabel>
          <Input
            id="code"
            value={bonusData.code}
            onChange={(e) => setBonusData({ ...bonusData, code: e.target.value.toUpperCase() })}
            placeholder="WELCOME100"
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>

        <Box className="space-y-2">
          <FormLabel htmlFor="amount" className="text-sm font-medium text-gray-700">
            Fixed Amount ($)
          </FormLabel>
          <Input
            id="amount"
            type="number"
            value={bonusData.amount}
            onChange={(e) => setBonusData({ ...bonusData, amount: e.target.value })}
            placeholder="100"
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>

        <Box className="space-y-2">
          <FormLabel htmlFor="percentage" className="text-sm font-medium text-gray-700">
            Percentage (%)
          </FormLabel>
          <Input
            id="percentage"
            type="number"
            value={bonusData.percentage}
            onChange={(e) => setBonusData({ ...bonusData, percentage: e.target.value })}
            placeholder="100"
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Box className="space-y-2">
          <FormLabel htmlFor="maxAmount" className="text-sm font-medium text-gray-700">
            Max Bonus Amount ($)
          </FormLabel>
          <Input
            id="maxAmount"
            type="number"
            value={bonusData.maxAmount}
            onChange={(e) => setBonusData({ ...bonusData, maxAmount: e.target.value })}
            placeholder="500"
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>

        <Box className="space-y-2">
          <FormLabel htmlFor="minDeposit" className="text-sm font-medium text-gray-700">
            Min Deposit ($)
          </FormLabel>
          <Input
            id="minDeposit"
            type="number"
            value={bonusData.minDeposit}
            onChange={(e) => setBonusData({ ...bonusData, minDeposit: e.target.value })}
            placeholder="20"
            className="border-gray-300 rounded-md"
            focusBorderColor="blue.500"
          />
        </Box>
      </div>

      <Flex alignItems="center" gap="2">
        <Switch
          id="isActive"
          isChecked={bonusData.isActive}
          onChange={(e) => setBonusData({ ...bonusData, isActive: e.target.checked })}
          colorScheme="blue"
        />
        <FormLabel m={0} htmlFor="isActive" className="text-sm font-medium text-gray-700 mb-0">
          Activate bonus immediately
        </FormLabel>
      </Flex>
    </Box>
  );
};

export default BasicInfoTab;