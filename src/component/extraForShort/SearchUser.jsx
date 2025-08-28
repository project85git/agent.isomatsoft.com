





import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaChevronRight, FaSearch } from "react-icons/fa";
import { fetchGetRequest } from "../../api/api";


// Step 1: Build hierarchy tree
const buildHierarchy = (data) => {
  const map = {};
  const roots = [];

  // Initialize all admins
  data.forEach((admin) => {
    map[admin.username] = { ...admin, children: [] };
  });

  // Link children to parents
  data.forEach((admin) => {
    if (map[admin.parent_admin_username]) {
      map[admin.parent_admin_username].children.push(map[admin.username]);
    } else {
      roots.push(map[admin.username]); // top-level admins
    }
  });

  return roots;
};

// Step 2: Transform hierarchy into GroupRow format
const transformData = (nodes) => {
  return nodes.map((node) => ({
    group: `${node.username} (${(node.children?.length || 0) + (node.users?.length || 0)})`,
    role: node.role_type,
    amount: node.amount?.toFixed(2),
    sub: [
      ...transformData(node.children || []), // recursive admins
      ...(node.users || []).map((user) => ({
        group: `${user.username}`,
        role: user.role_type,
        amount: user.amount?.toFixed(2),
        sub: [],
      })),
    ],
  }));
};

// GroupRow Component
const GroupRow = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSub = item.sub && item.sub.length > 0;

  return (
    <>
      <div
        className="flex items-center py-2 border px-2 border-gray-300"
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mr-2 focus:outline-none"
          aria-expanded={isOpen}
          aria-label={`Toggle ${item.group}`}
        >
          {hasSub ? (
            isOpen ? (
              <FaChevronDown className="text-gray-500 ml-2" />
            ) : (
              <FaChevronRight className="text-gray-500 ml-2" />
            )
          ) : (
            <span className="w-4" /> // no children
          )}
        </button>
        <div className="flex-1 text-left text-sm">{item.group}</div>
        <div className="w-24 text-right text-sm">{item.role}</div>
        <div className="w-24 text-right text-sm">{(Number(item.amount) || 0).toFixed(2)}</div>
      </div>
      {isOpen && hasSub && (
        <div>
          {item.sub.map((subItem, index) => (
            <GroupRow key={index} item={subItem} level={level + 1} />
          ))}
        </div>
      )}
    </>
  );
};

// Search Component
const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const filterData = (data, term) => {
    if (!term) return data;
    const lowerTerm = term.toLowerCase();
    return data
      .map((group) => {
        const matchesGroup =
          group.group.toLowerCase().includes(lowerTerm) ||
          group.role.toLowerCase().includes(lowerTerm);
        const filteredSub = filterData(group.sub || [], term);
        if (matchesGroup || filteredSub.length > 0) {
          return { ...group, sub: filteredSub };
        }
        return null;
      })
      .filter(Boolean);
  };

  const getHierarchyData = async (e) => {

      try {
        const url = `${import.meta.env.VITE_API_URL}/api/admin/get-hierarchy-data`;
        const response = await fetchGetRequest(url);
        toast({
          title: response.message,
          status: "success",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        
        setLoading(false);
        setRawData(response.data)
      } catch (error) {
        toast({
          title: error?.response?.data?.message || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "top",
          isClosable: true,
        });
        setLoading(false);
      
    }
  };

useEffect(()=>{
  getHierarchyData()
},[])

  const getDummyData = useCallback(() => {
    return transformData(buildHierarchy(rawData));
  }, [rawData]);

  const dummyData = useMemo(() => getDummyData(), [getDummyData]);

  // Memoize filterData
  const getFilteredData = useCallback(() => {
    return filterData(dummyData, searchTerm);
  }, [dummyData, searchTerm]);

  const filteredData = useMemo(() => getFilteredData(), [getFilteredData]);

  return (
    <div className="font-sans">
      <header className="bg-black text-white mb-2 text-start py-2 font-bold text-lg pl-2 border-gray-800">
        SEARCH USER
      </header>
      <div className="">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Recherche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            style={{ height: "40px" }}
            aria-label="Search users"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="bg-white rounded-none">
          <div className="flex bg-gray-200 py-2 px-4 font-medium text-gray-700 border-b border-gray-300">
            <div className="flex-1 text-left text-sm">Group</div>
            <div className="w-24 text-right text-sm">Role</div>
            <div className="w-24 text-right text-sm">Amount</div>
          </div>
          {filteredData.map((item, index) => (
            <GroupRow key={index} item={item} />
          ))}
          {filteredData.length === 0 && (
            <div className="py-2 px-4 text-center text-gray-500 text-sm">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
