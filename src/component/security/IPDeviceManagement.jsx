import { useState } from 'react';
import { FiShield, FiSmartphone, FiXOctagon, FiPlus, FiTrash2 } from 'react-icons/fi';
import { ChakraProvider, Tabs, TabList, Tab, TabPanels, TabPanel, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input } from '@chakra-ui/react';

const SummaryCard = ({ title, count, icon, description, iconColor }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900 mt-2">{count}</div>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </div>
);

const WhitelistManagement = ({ whitelistedIPs, setWhitelistedIPs }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newIP, setNewIP] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const handleAddIP = () => {
    if (newIP && newDescription) {
      setWhitelistedIPs([
        ...whitelistedIPs,
        {
          id: whitelistedIPs.length + 1,
          ip: newIP,
          description: newDescription,
          addedBy: 'admin@casino.com',
          dateAdded: new Date().toISOString().split('T')[0]
        }
      ]);
      setNewIP('');
      setNewDescription('');
      setIsAddOpen(false);
    }
  };

  const handleDeleteIP = () => {
    setWhitelistedIPs(whitelistedIPs.filter(ip => ip.id !== deleteId));
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-2">
        <div className="flex items-center gap-2 mb-4">
          <FiShield className="h-5 w-5 text-gray-900" />
          <h2 className="text-xl font-semibold text-gray-900">IP Whitelist Management</h2>
        </div>
        <p className="text-gray-600 mb-6">Manage trusted IP addresses with unrestricted access</p>
        <div className="flex gap-4 mb-6">
          <Button colorScheme="blue" onClick={() => setIsAddOpen(true)} leftIcon={<FiPlus className="h-4 w-4" />}>
            Add IP
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Added</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {whitelistedIPs.map((ip) => (
                <tr key={ip.id} className="border-t">
                  <td className="px-6 py-4 font-mono text-gray-900">{ip.ip}</td>
                  <td className="px-6 py-4 text-gray-900">{ip.description}</td>
                  <td className="px-6 py-4 text-gray-900">{ip.addedBy}</td>
                  <td className="px-6 py-4 text-gray-900">{ip.dateAdded}</td>
                  <td className="px-6 py-4">
                    <button
                      className="p-1 text-gray-500 hover:text-red-500"
                      onClick={() => {
                        setDeleteId(ip.id);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add IP to Whitelist</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter IP address or range (e.g., 192.168.1.0/24)"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                className="mb-4"
              />
              <Input
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button colorScheme="blue" onClick={handleAddIP} ml={3}>Add</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this IP from the whitelist?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteIP} ml={3}>Delete</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

const BlacklistManagement = ({ blacklistedIPs, setBlacklistedIPs }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newIP, setNewIP] = useState('');
  const [newReason, setNewReason] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const handleAddIP = () => {
    if (newIP && newReason) {
      setBlacklistedIPs([
        ...blacklistedIPs,
        {
          id: blacklistedIPs.length + 1,
          ip: newIP,
          reason: newReason,
          blockedBy: 'admin@casino.com',
          dateBlocked: new Date().toISOString().split('T')[0]
        }
      ]);
      setNewIP('');
      setNewReason('');
      setIsAddOpen(false);
    }
  };

  const handleDeleteIP = () => {
    setBlacklistedIPs(blacklistedIPs.filter(ip => ip.id !== deleteId));
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiXOctagon className="h-5 w-5 text-gray-900" />
          <h2 className="text-xl font-semibold text-gray-900">IP Blacklist Management</h2>
        </div>
        <p className="text-gray-600 mb-6">Manage blocked IP addresses</p>
        <div className="flex gap-4 mb-6">
          <Button colorScheme="red" onClick={() => setIsAddOpen(true)} leftIcon={<FiXOctagon className="h-4 w-4" />}>
            Block IP
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blocked By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Blocked</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blacklistedIPs.map((ip) => (
                <tr key={ip.id} className="border-t">
                  <td className="px-6 py-4 font-mono text-gray-900">{ip.ip}</td>
                  <td className="px-6 py-4 text-gray-900">{ip.reason}</td>
                  <td className="px-6 py-4 text-gray-900">{ip.blockedBy}</td>
                  <td className="px-6 py-4 text-gray-900">{ip.dateBlocked}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDeleteId(ip.id);
                        setIsDeleteOpen(true);
                      }}
                    >
                      Unblock
                    </Button>
                    <button
                      className="p-1 text-gray-500 hover:text-red-500"
                      onClick={() => {
                        setDeleteId(ip.id);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add IP to Blacklist</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter IP address to block"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                className="mb-4"
              />
              <Input
                placeholder="Reason for blocking"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button colorScheme="red" onClick={handleAddIP} ml={3}>Block</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this IP from the blacklist?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteIP} ml={3}>Delete</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

const DeviceManagement = ({ deviceFingerprints, setDeviceFingerprints }) => {
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isUnblockOpen, setIsUnblockOpen] = useState(false);
  const [blockId, setBlockId] = useState(null);
  const [unblockId, setUnblockId] = useState(null);

  const handleBlockDevice = () => {
    setDeviceFingerprints(
      deviceFingerprints.map(device =>
        device.id === blockId ? { ...device, status: 'blocked' } : device
      )
    );
    setIsBlockOpen(false);
    setBlockId(null);
  };

  const handleUnblockDevice = () => {
    setDeviceFingerprints(
      deviceFingerprints.map(device =>
        device.id === unblockId ? { ...device, status: 'trusted' } : device
      )
    );
    setIsUnblockOpen(false);
    setUnblockId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'trusted': return 'bg-green-100 text-green-800';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiSmartphone className="h-5 w-5 text-gray-900" />
          <h2 className="text-xl font-semibold text-gray-900">Device Fingerprint Management</h2>
        </div>
        <p className="text-gray-600 mb-6">Track and manage device fingerprints for fraud prevention</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fingerprint ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Associated Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Seen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deviceFingerprints.map((device) => (
                <tr key={device.id} className="border-t">
                  <td className="px-6 py-4 font-mono text-gray-900">{device.fingerprint}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{device.player}</td>
                  <td className="px-6 py-4 text-gray-900">{device.lastSeen}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {device.status !== 'blocked' && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setBlockId(device.id);
                          setIsBlockOpen(true);
                        }}
                      >
                        Block
                      </Button>
                    )}
                    {device.status === 'blocked' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setUnblockId(device.id);
                          setIsUnblockOpen(true);
                        }}
                      >
                        Unblock
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isBlockOpen} onClose={() => setIsBlockOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Block</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to block this device?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsBlockOpen(false)}>Cancel</Button>
              <Button colorScheme="red" onClick={handleBlockDevice} ml={3}>Block</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isUnblockOpen} onClose={() => setIsUnblockOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Unblock</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to unblock this device?
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsUnblockOpen(false)}>Cancel</Button>
              <Button colorScheme="blue" onClick={handleUnblockDevice} ml={3}>Unblock</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

const IPDeviceManagement = () => {
  const [whitelistedIPs, setWhitelistedIPs] = useState([
    { id: 1, ip: '192.168.1.100', description: 'Office Network', addedBy: 'admin@casino.com', dateAdded: '2024-11-01' },
    { id: 2, ip: '203.45.67.89', description: 'VIP Customer Access', addedBy: 'manager@casino.com', dateAdded: '2024-11-05' },
    { id: 3, ip: '10.0.0.0/24', description: 'Corporate VPN Range', addedBy: 'admin@casino.com', dateAdded: '2024-11-10' }
  ]);

  const [blacklistedIPs, setBlacklistedIPs] = useState([
    { id: 1, ip: '45.123.45.67', reason: 'Multiple fraud attempts', blockedBy: 'security@casino.com', dateBlocked: '2024-11-12' },
    { id: 2, ip: '89.234.56.78', reason: 'Bot activity detected', blockedBy: 'admin@casino.com', dateBlocked: '2024-11-14' },
    { id: 3, ip: '156.78.90.12', reason: 'Terms violation', blockedBy: 'manager@casino.com', dateBlocked: '2024-11-15' }
  ]);

  const [deviceFingerprints, setDeviceFingerprints] = useState([
    { id: 1, fingerprint: 'fp_1a2b3c4d', status: 'trusted', player: 'player1@email.com', lastSeen: '2024-11-15 14:30' },
    { id: 2, fingerprint: 'fp_5e6f7g8h', status: 'suspicious', player: 'suspicious@email.com', lastSeen: '2024-11-15 13:45' },
    { id: 3, fingerprint: 'fp_9i0j1k2l', status: 'blocked', player: 'blocked@email.com', lastSeen: '2024-11-14 16:20' }
  ]);

  return (
    <ChakraProvider>
      <div className="p-2 mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IP & Device Management</h1>
            <p className="text-gray-600 mt-1">
              Manage IP whitelists, blacklists, and device fingerprinting
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Whitelisted IPs"
            count={whitelistedIPs.length}
            icon={<FiShield className="h-5 w-5 text-green-500" />}
            description="Trusted IP addresses"
          />
          <SummaryCard
            title="Blacklisted IPs"
            count={blacklistedIPs.length}
            icon={<FiXOctagon className="h-5 w-5 text-red-500" />}
            description="Blocked IP addresses"
          />
          <SummaryCard
            title="Device Fingerprints"
            count={deviceFingerprints.length}
            icon={<FiSmartphone className="h-5 w-5 text-blue-500" />}
            description="Tracked devices"
          />
        </div>

        <Tabs colorScheme="blue">
          <TabList className="flex border-b border-gray-200">
            <Tab className="px-4 py-2 text-sm font-medium">
              <div className="flex items-center gap-2">
                <FiShield className="h-4 w-4" />
                IP Whitelist
              </div>
            </Tab>
            <Tab className="px-4 py-2 text-sm font-medium">
              <div className="flex items-center gap-2">
                <FiXOctagon className="h-4 w-4" />
                IP Blacklist
              </div>
            </Tab>
            <Tab className="px-4 py-2 text-sm font-medium">
              <div className="flex items-center gap-2">
                <FiSmartphone className="h-4 w-4" />
                Device Management
              </div>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel className="pt-6">
              <WhitelistManagement
                whitelistedIPs={whitelistedIPs}
                setWhitelistedIPs={setWhitelistedIPs}
              />
            </TabPanel>
            <TabPanel className="pt-6">
              <BlacklistManagement
                blacklistedIPs={blacklistedIPs}
                setBlacklistedIPs={setBlacklistedIPs}
              />
            </TabPanel>
            <TabPanel className="pt-6">
              <DeviceManagement
                deviceFingerprints={deviceFingerprints}
                setDeviceFingerprints={setDeviceFingerprints}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
};

export default IPDeviceManagement;