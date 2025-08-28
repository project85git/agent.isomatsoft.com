import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';
import Home from '../pages/Home';
import UserManage from '../pages/UserManage';
import SportManage from '../pages/SportManage';
import AdminManage from '../pages/AdminManage';
import CasinoManage from '../pages/CasinoManage';
import SingleUserManage from '../pages/SingleUserManage';
import DepositManage from '../pages/DepositManage';
import WithDrawlManage from '../pages/WithDrawlManage';
import Transaction from '../pages/AdminTransaction';
import SingleAdminManage from '../pages/SingleAdminManage';
import BetReport from '../pages/BetReport';
import GeneralSettings from '../pages/GeneralSettings';
import ManualDeposit from '../pages/ManualDeposit';
import AutoDeposit from '../pages/AutoDeposit';
import ManualWithdrawal from '../pages/ManualWithdrawal';
import AutoWithdrawal from '../pages/AutoWithdrawal';
import LiveReport from '../pages/LiveReport';
import ProfitLossByUser from '../pages/report/ProfitLossByUser';
import MyProfile from '../pages/MyProfile';
import Signin from '../pages/Signin';
import AdminSetting from '../pages/AdminSetting';
import BlockMarket from '../pages/BlockMarket';
import LayerManage from '../pages/LayerManage';
import ReferralSetting from '../pages/ReferralSetting';
import PromotionManage from '../pages/PromotionManage';
import GenerateAmountReport from '../pages/report/GenerateAmountReport';
import LogoBanner from '../pages/LogoBanner';
import DownlineWithdrawal from '../pages/DownlineWithdrawal';
import DownlineDeposit from '../pages/DownlineDeposit';
import BonusHistory from '../pages/BonusHistory';
import BonusContribution from '../pages/BonusContribution';
import AllUser from '../pages/AllUser';
import AllAdmin from '../pages/AllAdmin';
import UserTransaction from '../pages/UserTransaction';
import UserWithdrawal from '../pages/UserWithdrawal';
import UserDeposit from '../pages/UserDeposit';
import AdminTransaction from '../pages/AdminTransaction';
import ManageGames from '../pages/ManageGames';
import FooterContent from '../pages/FooterContent';
import SeoManage from '../pages/SeoManage';
import ProfitLossByGGR from '../pages/report/ProfitLossByGGR';
import ProfitLossByGame from '../pages/report/ProfitLossReportByGame';
import SiteManage from '../pages/SiteManage';
import { useSelector } from 'react-redux';
import AllStatistics from '../component/AllStatistics';
import PermissionWrapper from './PermissionWrapper';
import ReferAndEarn from '../pages/ReferAndEarn';
import VipLevel from '../pages/VipLevel';
import Signup from '../pages/Signup';
import LoginHistory from '../pages/LoginHistory';
import PlayerLoginHistory from '../pages/PlayerLoginHistory';
import MoreGames from '../pages/MoreGames';
import DataProvider from '../Modals/DataProvider';
import AutoPaymentCardsPassimoPay from '../component/autoPayment/AutoPaymentCardsPassimoPay';
import AutoPaymentCredential from '../component/autoPaymentCredential/AutoPaymentCredential';
import AdminLayerLogoSignup from '../component/AdminLayerLogoSignup';
import AuthCredential from '../pages/AuthCredential';
import VIPLevel from '../component/vipLavel/VipLavel';
import Tickets from '../component/Tickets/Tickets';
import Messages from '../component/messages/Messages';
import MessageCredential from '../component/messgeCredential/MessageCredential';
import AdminPermissionSetting from '../pages/AdminPermissionSetting';
import GamesWithAdvanceFilter from '../pages/GamesWithAdvanceFilter';
import ThemeManager from '../component/themeManager/ThemeManager';
import AffiliateManagement from '../component/affiliate/AffiliateManagement';
import IPDeviceManagement from '../component/security/IPDeviceManagement';
import Bonuses from '../component/bonuses/Bonuses';

const routes = [
  { path: '/login', component: Signup },
  // { path: '/signup', component: Signup },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/', component: Home },
  { path: '/my-profile', component: MyProfile },
];

const AllRoute = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            route.permission
              ? <PermissionWrapper component={route.component} permissionName={route.permission} />
              : <route.component />
          }
        />
      ))}
    </Routes>
  );
};

export default AllRoute;

