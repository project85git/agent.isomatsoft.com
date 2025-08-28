import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Input,
  FormLabel,
  Text,
  Box,
} from '@chakra-ui/react';

const WageringTab = ({ bonusData, setBonusData }) => {
  return (
    <Card className="border-gray-200 shadow-md rounded-md">
      <CardHeader>
        <Heading size="md" className="text-lg font-semibold text-gray-800">
          Wagering Requirements
        </Heading>
      </CardHeader>
      <CardBody className="space-y-4">
        <Box className="grid grid-cols-2 gap-4">
          <Box className="space-y-2">
            <FormLabel htmlFor="wageringRequirement" className="text-sm font-medium text-gray-700">
              Wagering Multiplier *
            </FormLabel>
            <Input
              id="wageringRequirement"
              type="number"
              value={bonusData.wageringRequirement}
              onChange={(e) => setBonusData({ ...bonusData, wageringRequirement: e.target.value })}
              placeholder="35"
              className="border-gray-300 rounded-md"
              focusBorderColor="blue.500"
            />
            <Text className="text-sm text-gray-500">
              Times the bonus amount that must be wagered
            </Text>
          </Box>

          <Box className="space-y-2">
            <FormLabel htmlFor="maxCashout" className="text-sm font-medium text-gray-700">
              Max Cashout ($)
            </FormLabel>
            <Input
              id="maxCashout"
              type="number"
              value={bonusData.maxCashout}
              onChange={(e) => setBonusData({ ...bonusData, maxCashout: e.target.value })}
              placeholder="1000"
              className="border-gray-300 rounded-md"
              focusBorderColor="blue.500"
            />
          </Box>
        </Box>

        <Box className="space-y-3">
          <FormLabel className="text-sm font-medium text-gray-700">
            Game Contribution to Wagering
          </FormLabel>
          <Box className="grid grid-cols-2 gap-4">
            <Box className="space-y-2">
              <FormLabel htmlFor="slots" className="text-sm font-medium text-gray-700">
                Slots (%)
              </FormLabel>
              <Input
                id="slots"
                type="number"
                value={bonusData.wageringContribution.slots}
                onChange={(e) =>
                  setBonusData({
                    ...bonusData,
                    wageringContribution: {
                      ...bonusData.wageringContribution,
                      slots: e.target.value,
                    },
                  })
                }
                className="border-gray-300 rounded-md"
                focusBorderColor="blue.500"
              />
            </Box>

            <Box className="space-y-2">
              <FormLabel htmlFor="tableGames" className="text-sm font-medium text-gray-700">
                Table Games (%)
              </FormLabel>
              <Input
                id="tableGames"
                type="number"
                value={bonusData.wageringContribution.tableGames}
                onChange={(e) =>
                  setBonusData({
                    ...bonusData,
                    wageringContribution: {
                      ...bonusData.wageringContribution,
                      tableGames: e.target.value,
                    },
                  })
                }
                className="border-gray-300 rounded-md"
                focusBorderColor="blue.500"
              />
            </Box>

            <Box className="space-y-2">
              <FormLabel htmlFor="videoPoker" className="text-sm font-medium text-gray-700">
                Video Poker (%)
              </FormLabel>
              <Input
                id="videoPoker"
                type="number"
                value={bonusData.wageringContribution.videoPoker}
                onChange={(e) =>
                  setBonusData({
                    ...bonusData,
                    wageringContribution: {
                      ...bonusData.wageringContribution,
                      videoPoker: e.target.value,
                    },
                  })
                }
                className="border-gray-300 rounded-md"
                focusBorderColor="blue.500"
              />
            </Box>

            <Box className="space-y-2">
              <FormLabel htmlFor="liveCasino" className="text-sm font-medium text-gray-700">
                Live Casino (%)
              </FormLabel>
              <Input
                id="liveCasino"
                type="number"
                value={bonusData.wageringContribution.liveCasino}
                onChange={(e) =>
                  setBonusData({
                    ...bonusData,
                    wageringContribution: {
                      ...bonusData.wageringContribution,
                      liveCasino: e.target.value,
                    },
                  })
                }
                className="border-gray-300 rounded-md"
                focusBorderColor="blue.500"
              />
            </Box>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default WageringTab;