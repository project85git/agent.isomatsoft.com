import React, { useState, useEffect, useRef } from "react";
import nodatafound from '../../assets/emptydata.png'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { MdDeleteForever, MdOutlineLocalSee, MdUpdate } from "react-icons/md";
import { GiFireSpellCast } from "react-icons/gi";
import { BsEyeglasses } from "react-icons/bs";
import { fetchGetRequest, sendDeleteRequest, sendPatchRequest, sendPostRequest } from "../../api/api";
import LoadingSpinner from "../loading/LoadingSpinner";
import { AiOutlineSend } from "react-icons/ai";
import { formatBonusText } from "../../../utils/utils";
import DescriptionModal from "./DescriptionModal";
import ConversationModal from "./ConversationModal";

export default function Tickets() {
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
  const { user } = useSelector((state) => state.authReducer);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const handleOpenModal = (description) => {
    setSelectedDescription(description);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDescription("");
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tickets, setTickets] = useState([]);
  const [isConvoModalOpen, setConvoModalOpen] = useState(false);
  const [convoMessages, setConvoMessages] = useState([]);
  const [convoNewMessage, setConvoNewMessage] = useState("");
  const ref = useRef();
  const [msgLoading, setMsgLoading] = useState(false);
  const [category, setCategory]=useState("self");
  const [isDeleteModalOpen, setIsDeleteModalOpen]=useState(false);
  const [deleteId, setDeleteId]=useState(null)
  const [deleteLoading, setDeleteLoading]=useState(false)
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    title: "",
    description: "",
    category: "",
    priority: "" || "medium",
    parent_admin_id: user.parent_admin_id,
    parent_admin_role_type: user.parent_admin_role_type,
    role_type: user.role_type,
    parent_admin_username: user.parent_admin_username,
  });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetchGetRequest(
        `${import.meta.env.VITE_API_URL}/api/ticket/get-specific-parent-ticket?category=${category}`
      );
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [category]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPostRequest(
        `${import.meta.env.VITE_API_URL}/api/ticket/create-ticket`,
        formData
      ); // Update with your API endpoint
      fetchTickets();
      onClose();
      setLoading(false);
    } catch (error) {
      console.error("Error creating ticket", error);
      setLoading(false);
    }
  };
  const [filter, setFilter] = useState("");
  const filteredTickets = tickets.filter((ticket) =>
    filter === "" ? true : ticket.category === filter
  );
  const handleMarkAsSeen = async (ticketId) => {
    // Set loading state for the specific ticket
    setLoading((prev) => ({ ...prev, [ticketId]: true }));

    try {
      // Mark the ticket as seen
      const data_check = await sendPatchRequest(
        `${import.meta.env.VITE_API_URL}/api/ticket/mark-as-seen/${ticketId}`
      );
      const updateData = tickets.map((elm) =>
        elm.id === data_check.data.id
          ? { ...elm, is_seen_by_admin: data_check.data.is_seen_by_admin }
          : elm
      );
      setTickets(updateData);
      // Reset loading state for this operation
      setLoading(false);
    } catch (error) {
      setLoading((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleRespond = (ticketId, message) => {
    setConvoModalOpen(true);
    setConvoMessages(message.messages);
    ref.current = message._id;
  };

  const handleDeleteModalOpen = (ticketId) => {
    setDeleteId(ticketId);
    setIsDeleteModalOpen(true);
  };
  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const res = await sendDeleteRequest(
        `${import.meta.env.VITE_API_URL}/api/ticket/delete-ticket/${deleteId}`
      );

      const { success } = res;
      if (success) {
        const filterData = tickets.filter((elm) => elm._id !== deleteId);

        setTickets(filterData);
        setDeleteLoading(false);
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting ticket", error);
      setDeleteLoading(false)
    }
  }
  const handleSendConvoMessage = async () => {
    // Check if there is a message to send
    if (convoNewMessage.trim()) {
      setMsgLoading(true); // Set loading state before sending the message
  
      // Create payload for the message
      const payload = {
        content: convoNewMessage.trim(),
        sender: user.role_type,
        username: user.username
      };
  
      try {
        // Send the PATCH request to update the conversation in the ticket
        const res = await sendPatchRequest(
          `${import.meta.env.VITE_API_URL}/api/ticket/conversation/${ref.current}`,
          payload
        );
  
        // Check if the response contains the updated messages
        if (res && res.data.messages) {
          // Update the tickets state with the new message for the corresponding ticket
          const updatedTickets = tickets.map((ticket) =>
            ticket._id === ref.current ? { ...ticket, messages: res?.data?.messages } : ticket
          );
  
        setTickets(updatedTickets); // Set the updated tickets
        // Update the conversation messages state
        setConvoMessages(res?.data?.messages);
        }
        // Reset the message input field and stop loading
        setConvoNewMessage("");
        setMsgLoading(false);
      } catch (error) {
        console.error("Error sending message:", error);
        setMsgLoading(false); // Stop loading on error
  
        // Show an error toast if something goes wrong
        toast({
          title: "Error Sending Message",
          description: "There was an issue while sending your message. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "No Message",
        description: "Please type a message before sending.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  // Modal handlers

  const closeConvoModal = () => {
    setConvoModalOpen(false);
  };
  const handleConvoModel = (messages) => {
    setConvoModalOpen(true);
    setConvoMessages(messages.messages);
    ref.current = messages._id;
  };

  return (
    <div className=" flex flex-col gap-4 p-2">
      <ConversationModal
        isOpen={isConvoModalOpen}
        onClose={closeConvoModal}
        messages={convoMessages}
        newMessage={convoNewMessage}
        setNewMessage={setConvoNewMessage}
        onSendMessage={handleSendConvoMessage}
        loading={msgLoading}
        user={user}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              
              <FormControl id="title" mb={4} isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ticket Title"
                />
              </FormControl>

              <FormControl id="description" mb={4} isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  required
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description of the issue"
                />
              </FormControl>

              <FormControl id="category" mb={4} isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  id="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Select category"
                >
                  <option value="account_issue">Account Issue</option>
                  <option value="payment_issue">Payment Issue</option>
                  <option value="game_issue">Game Issue</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl id="priority" mb={4}>
                <FormLabel>Priority</FormLabel>
                <Select
                  id="priority"
                  value={formData.priority}
                  required
                  onChange={handleChange}
                  placeholder="Select priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>

            <ModalFooter style={{paddingRight:2, paddingLeft:2}}  className="flex gap-2 m-0">
              <Button isLoading={loading} bg={bg} color={"white"} type="submit">
                Add
              </Button> 
              <Button  onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
            </form>
          </ModalBody>

        </ModalContent>
      </Modal>

      {/* Delete modal */}

      <Modal isOpen={isDeleteModalOpen} onClose={()=>setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this provider?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" isLoading={deleteLoading} mr={3} onClick={()=>handleDelete()}>Delete</Button>
            <Button variant="ghost" onClick={()=>setIsDeleteModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*description model*/}

      <DescriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        description={selectedDescription}
      />

      {/* Table Section */}

      <div className=" overflow-x-auto">
        {/* Filter Section */}
        <div className="flex flex-row-reverse  items-center justify-between ">
          <div>
            <Button
              style={{backgroundColor:bg, color:"white"}}
              onClick={onOpen}
              className="font-bold py-2 px-4 rounded shadow-lg"
            >
              Create Ticket
            </Button>
          </div>
          <div className="flex gap-4">
          <div>
            <label
              htmlFor="categoryFilter"
              className="block text-gray-700 font-medium mb-2"
            >
              Filter by Category:
            </label>
            <select
              id="categoryFilter"
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
            >
              <option value="">All Categories</option>
              <option value="account_issue">Account Issue</option>
              <option value="payment_issue">Payment Issue</option>
              <option value="game_issue">Game Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
           <div>
            <label
              htmlFor="assignFilter"
              className="block text-gray-700 font-medium mb-2"
            >
              Assign:
            </label>
            <select
             value={category}
              id="assignFilter"
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
            >
              <option value="self">Created by Me</option>
              <option value="other">Assign to Me</option>
            </select>
           </div>
          </div>
        </div>



        {/* Ticket Table */}
      </div>
      {tickets.length !== 0 ? (
        <div className="w-full overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="w-full text-sm border-collapse">
            <thead
              style={{ backgroundColor: bg, color:"white" }}
              className="bg-gray-100 text-gray-600"
            >
              <tr>
                <th className="p-2 border text-start border-gray-300">Title</th>
                <th className="p-2 border text-start border-gray-300 max-w-[200px]">
                  Description
                </th>
                <th className="p-2 border text-start border-gray-300">Category</th>
                <th className="p-2 border  border-gray-300">Priority</th>
                <th className="p-2 border border-gray-300">Status</th>
                <th className="p-2 border text-start border-gray-300">Response</th>
                <th className="p-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr
                  key={ticket._id}
                  className={`
                ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} 
                hover:bg-gray-100 transition-colors text-md duration-200
            `}
                >
                  <td className="px-2 py-3 border border-gray-300 font-medium">
                    {ticket.title}
                  </td>
                  <td
                    onClick={() => handleOpenModal(ticket.description)}
                    className="px-2 py-3 border border-gray-300 max-w-[200px] truncate cursor-pointer 
                hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    {ticket.description.length > 50
                      ? `${ticket.description.substring(0, 40)}...`
                      : ticket.description}
                  </td>
                  <td className="px-2 py-3 border border-gray-300">
                    {formatBonusText(ticket.category)}
                  </td>
                  <td className="text-center border">
                    <div>
                  <Badge
                    px={3}
                    py={1}
                    colorScheme={
                        ticket.priority === "high"
                        ? "red"
                        : ticket.priority === "medium"
                        ? "yellow"
                        : "green"
                    }
                    fontWeight="bold"
                    borderRadius="full"
                   
               >
          {ticket.priority}
            </Badge>
            </div>
            </td>
                  <td
                    className={`
            border border-gray-300 font-bold text-center
            ${
              ticket.status === "pending"
                ? "text-yellow-500"
                : ticket.status === "progress"
                ? "text-blue-500"
                : ticket.status === "resolved"
                ? "text-green-500"
                : "text-gray-500"
            }
          `}
                  >
                    {ticket.status}
                  </td>
                  <td
                    onClick={() => handleConvoModel(ticket)}
                    className=" cursor-pointer py-3 border text-start font-semibold border-gray-300"
                  >
                    {ticket.messages.length > 0 ? (
                      <div>
                        {ticket.messages[ticket.messages.length - 1].sender ===
                        "user" ? (
                          <div className="p-2">
                            {
                              ticket.messages[ticket.messages.length - 1]
                                .content
                            }
                          </div>
                        ) : (
                          <div className="p-2 ">
                            {
                              ticket.messages[ticket.messages.length - 1]
                                .content
                            }
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-yellow-600 italic">Pending</div>
                    )}
                  </td>

                  <td className="px-4 py-3 border border-gray-300">
                    <div className="flex justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      {user.username !== ticket.username && (
                        <button
                          onClick={() => handleMarkAsSeen(ticket._id)}
                          className="p-2 rounded-full hover:bg-blue-100 transition-colors group"
                          title="Mark as seen"
                        >
                          {" "}
                          {loading[ticket._id] ? (
                            <LoadingSpinner />
                          ) : ticket?.is_seen_by_admin ? (
                            <MdOutlineLocalSee
                              style={{color:bg}}    
                              className="group-hover:scale-110"
                              size={24}
                            />
                          ) : (
                            <BsEyeglasses
                              style={{color:bg}}
                              className=" group-hover:scale-110"
                              size={24}
                            />
                          )}{" "}
                        </button>
                      )}
                      {/* {user.username !== ticket.username && (
                        <button
                          onClick={() => handleUpdateStatus(ticket._id)}
                          className="p-2 rounded-full hover:bg-green-100 transition-colors group"
                          title="Update Status"
                        >
                          <MdUpdate
                            style={{color:bg}}
                            className=" group-hover:scale-110"
                            size={24}
                          />
                        </button>
                      )} */}
                      <button
                        onClick={() => handleRespond(ticket._id, ticket)}
                        className="p-2 rounded-full hover:bg-purple-100 transition-colors group"
                        title="Respond"
                      >
                        <GiFireSpellCast
                          style={{color:bg}}
                          className=" group-hover:scale-110"
                          size={24}
                        />
                      </button>
                      <button
                        
                        onClick={() => handleDeleteModalOpen(ticket._id)}
                        className="p-2 rounded-full hover:bg-red-100 transition-colors group"
                        title="Delete"
                      >
                        <MdDeleteForever
                          style={{color:bg}}
                          className=" group-hover:scale-110"
                          size={24}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : loading&&tickets.length==0?<div className="flex justify-center h-[70vh] items-center mb-6">
          <LoadingSpinner />
        </div>:(
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
            <img
              src={nodatafound}
              className="w-[300px] rounded-[50%]"
              alt="No user found"
            />
          </div>
        </div>
      )}
    </div>
  );
}