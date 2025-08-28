import { FaDollarSign, FaBullseye, FaPercent, FaCalendarAlt } from 'react-icons/fa';

export const bonusTypes = [
  { value: 'deposit', label: 'Deposit Bonus', icon: FaDollarSign },
  { value: 'no_deposit', label: 'No Deposit Bonus', icon: FaBullseye },
  { value: 'free_spins', label: 'Free Spins', icon: FaBullseye },
  { value: 'cashback', label: 'Cashback', icon: FaPercent },
  { value: 'reload', label: 'Reload Bonus', icon: FaDollarSign },
  { value: 'referral', label: 'Referral Bonus', icon: FaBullseye },
  { value: 'birthday', label: 'Birthday Bonus', icon: FaCalendarAlt },
  { value: 'loyalty', label: 'Loyalty Bonus', icon: FaBullseye },
  { value: 'weekend', label: 'Weekend Bonus', icon: FaCalendarAlt },
  { value: 'highroller', label: 'High Roller Bonus', icon: FaDollarSign }
];