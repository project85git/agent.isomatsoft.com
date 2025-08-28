import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { sendPostRequest } from '../../api/api';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import { useToast } from '@chakra-ui/react';

const Wallet = ({id}) => {
  const { color, primaryBg, secondaryBg, iconColor, bg, hoverColor, hover, text, font, border } = useSelector(state => state.theme);
  const { t, i18n } = useTranslation();
  const toast = useToast()
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/admin/get-user-overview-details`; // Endpoint without user id in URL
    try {
      // Prepare payload with username and type
      const payload = {
        username:id,
        type: "user"
      };
      let response = await sendPostRequest(url, payload); // Pass payload in the request
      setLoading(false);
      const receivedData = response.data;
      if (response.success) {
        setUserData(receivedData);
      } else {
        toast({
          description: response.message,
          status: "error",
          duration: 4000,
          position: "top",
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
    getUserData();
  }, []);

  const wallets = [
    { type: 'Wallet Amount', icon: '💵', amount: userData.walletAmount || "0.00" },  // Money Bag
    { type: 'Total Deposit', icon: '🏦', amount: userData.totalDeposit || "0.00" }, // Bank
    { type: 'Total Withdraw', icon: '💸', amount: userData.totalWithdraw || "0.00" }, // Flying Money
    { type: 'Total Bonus', icon: '🎉', amount: userData.totalBonus || "0.00" }, // Party Popper
    { type: 'Wager Left', icon: '⚖️', amount: userData.wagerLeft || "0.00" }, // Balance Scale
    { type: 'Total Wager', icon: '🎲', amount: userData.totalWager || "0.00" }, // Game Die
    { type: 'Referral Count', icon: '👥', amount: userData.referralCount || "0" }, // Two People
    { type: 'Total Referral Bonus', icon: '🏆', amount: userData.totalReferralBonus || "0.00" }, // Trophy
];

// Note: Removed the duplicate 'Total Bonus' entry from the original array.

  return (
    <div className="container mx-auto py-8">
      <h1 style={{ color: iconColor }} className="text-2xl font-bold mb-4">{t(`Wallet`)}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wallets.map((wallet, index) => (
          <div key={index} style={{ border: `1px solid ${border}60` }} className="bg-white p-4 rounded-lg shadow-lg flex justify-center flex-col">
            <p className='text-sm font-semibold'>{t(wallet.type)}</p>
            <div className='flex justify-between items-center gap-3 w-[100%]'>
              <h2 className="text-xl font-bold">{wallet.amount}</h2>
              <span className="text-4xl mb-2">{wallet.icon}</span>
            </div>
          </div>
        ))}
      </div>
      {loading && <p className="text-center">Loading...</p>} {/* Show loading state */}
    </div>
  );
};

export default Wallet;
