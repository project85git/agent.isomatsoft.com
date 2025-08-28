import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { sendPostRequest } from '../../api/api';
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  Box,
  Grid,
  GridItem,
  Text,
  Flex,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { BiWallet } from 'react-icons/bi';

const WalletModal = ({ id }) => {
  const { primaryBg, secondaryBg, bg, iconColor, border } = useSelector(state => state.theme);
  const { t } = useTranslation();
  const toast = useToast();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const getUserData = async () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_API_URL}/api/admin/get-user-overview-details`;
    try {
      const payload = { username: id, type: 'user' };
      const response = await sendPostRequest(url, payload);
      setLoading(false);
      if (response.success) {
        setUserData(response.data);
      } else {
        toast({
          description: response.message,
          status: 'error',
          duration: 4000,
          position: 'top',
          isClosable: true,
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        description: `${error?.data?.message || error?.message}`,
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if(isModalOpen){
    getUserData()}
  }, [isModalOpen]);

  const wallets = [
    { type: 'Wallet Amount', icon: '💵', amount: userData.walletAmount || '0.00' },
    { type: 'Total Deposit', icon: '🏦', amount: userData.totalDeposit || '0.00' },
    { type: 'Total Withdraw', icon: '💸', amount: userData.totalWithdraw || '0.00' },
    { type: 'Total Bonus', icon: '🎉', amount: userData.totalBonus || '0.00' },
    { type: 'Wager Left', icon: '⚖️', amount: userData.wagerLeft || '0.00' },
    { type: 'Total Wager', icon: '🎲', amount: userData.totalWager || '0.00' },
    { type: 'Referral Count', icon: '👥', amount: userData.referralCount || '0' },
    { type: 'Total Referral Bonus', icon: '🏆', amount: userData.totalReferralBonus || '0.00' },
  ];

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        style={{ border: `1px solid ${border}60`, backgroundColor: primaryBg }}
        className="flex w-[25px] items-center justify-center rounded-[6px] h-[25px]"
      >
        <Tooltip label={"Wallet"} bg={bg} aria-label={`Wallet`} hasArrow>
          <div>
        <BiWallet cursor="pointer" fontSize="20px" color={iconColor} />
        </div>
        </Tooltip>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent className='pb-3'>
          <ModalHeader>{t('Wallet Details')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Flex justify="center" align="center" height="100px">
                <Spinner size="lg" />
              </Flex>
            ) : (
              <Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {wallets.map((wallet, index) => (
                    <GridItem
                      key={index}
                      borderWidth="1px"
                      borderRadius="lg"
                      p={4}
                      bg={secondaryBg}
                      borderColor={`${border}60`}
                      boxShadow="md"
                      transition="all 0.2s"
                      _hover={{ boxShadow: 'lg', transform: 'scale(1.05)' }}
                    >
                      <Text fontSize="md" fontWeight="bold">
                        {t(wallet.type)}
                      </Text>
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" fontWeight="bold">
                          {wallet.amount}
                        </Text>
                        <Text fontSize="xl" role="img">
                          {wallet.icon}
                        </Text>
                      </Flex>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default WalletModal;
