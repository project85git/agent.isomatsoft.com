import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  useToast,
  IconButton,
  HStack,
  VStack,
  Icon
} from '@chakra-ui/react';
import { FaShieldAlt, FaStar, FaGem, FaCrown, FaHeart, FaRegThumbsUp, FaRocket, FaGift, FaLeaf, FaFire, FaThumbsUp } from 'react-icons/fa';
import { sendPatchRequest, sendPostRequest } from '../../api/api';
import { useSelector } from 'react-redux';

const AddLevelModal = ({ isOpen, onClose, levelData, onSave, adminData,type }) => {
  const levelOptions = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby", "Emerald", "Sapphire"];
  const { user } = useSelector((state) => state.authReducer);

  const gradientOptions = [
    "linear-gradient(to right, #C34A36, #8A2C2A)", // Dark red to dark brown (Bronze)
    "linear-gradient(to right, #4A90E2, #1C3D6D)", // Dark blue to dark blue (Silver)
    "linear-gradient(to right, #DAA520, #8B5A2B)", // Dark gold to dark brown (Gold)
    "linear-gradient(to right, #8E44AD, #6C3483)", // Dark purple to darker purple (Platinum)
    "linear-gradient(to right, #1ABC9C, #16A085)", // Dark teal to darker teal (Diamond)
    "linear-gradient(to right, #F44336, #B71C1C)", // Dark red to dark burgundy (Ruby)
    "linear-gradient(to right, #27AE60, #1B5E20)", // Dark green to dark forest green (Emerald)
    // Additional Gradients
    "linear-gradient(to right, #3E2723, #6D4C41)", // Dark brown to coffee brown
    "linear-gradient(to right, #9C27B0, #4A148C)", // Purple to dark purple
    "linear-gradient(to right, #2196F3, #1976D2)", // Blue to darker blue
    "linear-gradient(to right, #F57C00, #EF6C00)", // Orange to darker orange
    "linear-gradient(to right, #D32F2F, #B71C1C)", // Red to dark red
    "linear-gradient(to right, #0288D1, #01579B)", // Bright blue to dark blue
    "linear-gradient(to right, #388E3C, #2C6B2F)", // Green to darker green
    "linear-gradient(to right, #FF5722, #D32F2F)", // Deep orange to red
    "linear-gradient(to right, #8BC34A, #689F38)", // Light green to dark green
    "linear-gradient(to right, #FF9800, #F57C00)", // Amber to orange
    "linear-gradient(to right, #9E9D24, #827717)" // Olive green to darker green
  ];


  const iconOptions = [
    { value: 'FaShieldAlt', label: 'Shield', icon: <FaShieldAlt /> }, // Filled version should be FaShieldAlt
    { value: 'FaStar', label: 'Star', icon: <FaStar /> }, // Filled version should be FaStar
    { value: 'FaGem', label: 'Gem', icon: <FaGem /> }, // Filled version should be FaGem
    { value: 'FaCrown', label: 'Crown', icon: <FaCrown /> }, // Filled version should be FaCrown
    { value: 'FaHeart', label: 'Heart', icon: <FaHeart /> }, // Filled version should be FaHeart
    { value: 'FaThumbsUp', label: 'Thumbs Up', icon: <FaThumbsUp /> }, // Filled version should be FaThumbsUp
    { value: 'FaRocket', label: 'Rocket', icon: <FaRocket /> }, // Filled version should be FaRocket
    { value: 'FaGift', label: 'Gift', icon: <FaGift /> }, // Filled version should be FaGift
    { value: 'FaLeaf', label: 'Leaf', icon: <FaLeaf /> }, // Filled version should be FaLeaf
    { value: 'FaFire', label: 'Fire', icon: <FaFire /> } // Filled version should be FaFire
  ];

  const [levelName, setLevelName] = useState(levelData ? levelData.level_name : '');
  const [wagerPoints, setWagerPoints] = useState(levelData ? levelData.wager_points : '');
  const [depositPoints, setDepositPoints] = useState(levelData ? levelData.deposit_points : '');
  const [bonusReward, setBonusReward] = useState(levelData ? levelData.total_bonus_reward : '');
  const [cashbackPercent, setCashbackPercent] = useState(levelData ? levelData.cashback_percent : '');
  const [withdrawLimit, setWithdrawLimit] = useState(levelData ? levelData.withdraw_limit : '');
  const [withdrawProcessTime, setWithdrawProcessTime] = useState(levelData ? levelData.withdraw_process_time : '');
  const [icon, setIcon] = useState(levelData ? levelData.icon : 'FaShieldAlt');
  const [selectedGradient, setSelectedGradient] = useState(levelData ? levelData.gradient : gradientOptions[0]);

  const [dedicatedSupport, setDedicatedSupport] = useState(levelData ? levelData.dedicated_support_24_7 : false);
  const [priorityQueue, setPriorityQueue] = useState(levelData ? levelData.priority_withdrawal_queue : false);
  const [increasedLimits, setIncreasedLimits] = useState(levelData ? levelData.increased_withdrawal_limits : false);
  const [vipManager, setVipManager] = useState(levelData ? levelData.vip_manager : false);
  const [bonusMultiplier, setBonusMultiplier] = useState(levelData ? levelData.bonus_wager_multiplier : '');
  const [loading, setLoading] = useState(false)
  const toast = useToast();


  const {
    color,
    primaryBg,
    iconColor,
    secondaryBg,
    bg,
    hoverColor,
    hover,
    text,
    font,
    border,
  } = useSelector((state) => state.theme); 


  useEffect(() => {
    if (levelData) {
      setLevelName(levelData.level_name);
      setWagerPoints(levelData.wager_points);
      setDepositPoints(levelData.deposit_points);
      setBonusReward(levelData.total_bonus_reward);
      setCashbackPercent(levelData.cashback_percent);
      setWithdrawLimit(levelData.withdraw_limit);
      setWithdrawProcessTime(levelData.withdraw_process_time);
      setIcon(levelData.icon);
      setSelectedGradient(levelData.gradient || gradientOptions[0]);
      setDedicatedSupport(levelData.dedicated_support_24_7);
      setPriorityQueue(levelData.priority_withdrawal_queue);
      setIncreasedLimits(levelData.increased_withdrawal_limits);
      setVipManager(levelData.vip_manager);
      setBonusMultiplier(levelData.bonus_wager_multiplier);
    }
  }, [levelData]);

  const handleSave = async () => {
    setLoading(true)
    if (levelName && wagerPoints && depositPoints && bonusReward && cashbackPercent && withdrawLimit && withdrawProcessTime) {
      const updatedLevel = {
        level_name: levelName,
        wager_points: +wagerPoints,
        deposit_points: +depositPoints,
        total_bonus_reward: bonusReward,
        cashback_percent: cashbackPercent,
        withdraw_limit: +withdrawLimit,
        withdraw_process_time: withdrawProcessTime,
        icon,
        bg_gradient: selectedGradient,
        dedicated_support_24_7: dedicatedSupport,
        priority_withdrawal_queue: priorityQueue,
        increased_withdrawal_limits: increasedLimits,
        vip_manager: vipManager,
        bonus_wager_multiplier: bonusMultiplier,
        parent_admin_id: user.admin_id,
        parent_admin_username: user.username,
        parent_admin_role_type: user.role_type
      };
      

      try {
        const response = await type==="add"?sendPostRequest(`${import.meta.env.VITE_API_URL}/api/vip-level/add-vip-level`, updatedLevel): await sendPatchRequest(`${import.meta.env.VITE_API_URL}/api/vip-level/update-vip-level/${levelData?.level_name}`,updatedLevel)
        if (response.success||response.success) {
          onSave(updatedLevel);
          toast({
            title: response.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        } else {
          toast({
            title: "Error",
            description: response.message || "An error occurred while saving the VIP level.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
    setLoading(true)
        
      } catch (error) {
        toast({
          title: error?.message || error?.data?.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Form Error",
        description: "Please fill in all the required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(true)
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="white" color="gray.800">
        <ModalHeader>{levelData ? 'Edit VIP Level' : 'Add New VIP Level'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            <FormControl id="level_name" isRequired>
              <FormLabel>Level Name</FormLabel>
              <Select 
              placeholder='--select Value --'
              variant={'filled'}
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                size="lg"
              >
                
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            </FormControl>

            <HStack spacing={4}>
              <FormControl id="wager_points" isRequired>
                <FormLabel>Wager Points</FormLabel>
                <Input
                  type="number"
                  value={wagerPoints}
                  onChange={(e) => setWagerPoints(e.target.value)}
                  placeholder="Enter Wager Points"
                  siz e="lg"
                />
              </FormControl>

              <FormControl id="deposit_points" isRequired>
                <FormLabel>Deposit Points</FormLabel>
                <Input
                  type="number"
                  value={depositPoints}
                  onChange={(e) => setDepositPoints(e.target.value)}
                  placeholder="Enter Deposit Points"
                  size="lg"
                />
              </FormControl>
            </HStack>

            <FormControl id="bonus_reward" isRequired>
              <FormLabel>Bonus Reward</FormLabel>
              <Input
                value={bonusReward}
                onChange={(e) => setBonusReward(e.target.value)}
                placeholder="Enter Bonus Reward"
                size="lg"
              />
            </FormControl>

            <FormControl id="cashback_percent" isRequired>
              <FormLabel>Cashback Percent</FormLabel>
              <Select
                value={cashbackPercent}
                onChange={(e) => setCashbackPercent(e.target.value)}
                size="lg"
              >
                <option value="1%">1%</option>
                <option value="2%">2%</option>
                <option value="3%">3%</option>
                <option value="5%">5%</option>
                <option value="10%">10%</option>
              </Select>
            </FormControl>

            <HStack spacing={4}>
            <FormControl id="withdraw_limit" isRequired>
                <FormLabel>Withdraw Limit</FormLabel>
                <Input
                  type="number"
                  value={withdrawLimit}
                  onChange={(e) => setWithdrawLimit(e.target.value)}
                  placeholder="Enter Withdraw Limit"
                  size="lg"
                />
              </FormControl>

              <FormControl id="withdraw_process_time" isRequired>
                <FormLabel>Withdraw Process Time</FormLabel>
                <Select
                  value={withdrawProcessTime}
                  onChange={(e) => setWithdrawProcessTime(e.target.value)}
                  size="lg"
                >
                    <option value="5 minutes">5 minutes</option>
                  <option value="10 minutes">10 minutes</option>
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="6 hours">6 hours</option>
                  <option value="12 hours">12 hours</option>
                  <option value="24 hours">24 hours</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Standard">Standard</option>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>

              
            </HStack>

            <FormControl id="icon">
              <FormLabel>Icon</FormLabel>
              <Select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                size="lg"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="bg_gradient">
              <FormLabel>Background Gradient</FormLabel>
              <Select
                value={selectedGradient}
                onChange={(e) => setSelectedGradient(e.target.value)}
                size="lg"
                sx={{
                  background: selectedGradient,
                  color: 'black',
                  border: 'none',
                  borderRadius: 'md',
                  '&:focus': {
                    outline: 'none',
                  }
                }}
                
              >
                 {gradientOptions.map((gradient, index) => (
                  <option key={index} value={gradient} >
                    <div >
                      <span>Gradient {index+1}</span>
                    </div>
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="dedicated_support">
              <FormLabel>Dedicated Support 24/7</FormLabel>
              <Switch
                isChecked={dedicatedSupport}
                onChange={() => setDedicatedSupport(!dedicatedSupport)}
                size="lg"
              />
            </FormControl>

            <FormControl id="priority_withdrawal_queue">
              <FormLabel>Priority Withdrawal Queue</FormLabel>
              <Switch
                isChecked={priorityQueue}
                onChange={() => setPriorityQueue(!priorityQueue)}
                size="lg"
              />
            </FormControl>

            <FormControl id="increased_withdrawal_limits">
              <FormLabel>Increased Withdrawal Limits</FormLabel>
              <Switch
                isChecked={increasedLimits}
                onChange={() => setIncreasedLimits(!increasedLimits)}
                size="lg"
              />
            </FormControl>

            <FormControl id="vip_manager">
              <FormLabel>VIP Manager</FormLabel>
              <Switch
                isChecked={vipManager}
                onChange={() => setVipManager(!vipManager)}
                size="lg"
              />
            </FormControl>

            <FormControl id="bonus_wager_multiplier">
              <FormLabel>Bonus Wager Multiplier</FormLabel>
              <Input
                type="number"
                value={bonusMultiplier}
                onChange={(e) => setBonusMultiplier(e.target.value)}
                placeholder="Enter Bonus Multiplier"
                size="lg"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button bg={bg} color={"white"} mr={3} isLoading={loading} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddLevelModal;
