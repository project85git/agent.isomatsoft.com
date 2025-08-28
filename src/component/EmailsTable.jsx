import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchGetRequest } from "../api/api";
import {
  Select,
  Input,
  Button,
  Grid,
  Flex,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const EmailsTable = ({ allEmail }) => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [selectedEmailValue, setSelectedEmailValue] = useState(allEmail[0]);
  const [filters, setFilters] = useState({
    type: "",
    from: "",
    subject: "",
    since: "",
    before: "",
  });
  const [loading, setLoading] = useState(false);
  const { color, border, bg } = useSelector((state) => state.theme);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          email: selectedEmailValue,
          type: filters.type,
          from: filters.from,
          subject: filters.subject,
          since: filters.since,
          before: filters.before,
        }).toString();

        const response = await fetchGetRequest(
          `${
            import.meta.env.VITE_API_URL
          }/api/email/get-all-email?site_auth_key=BitAuthKeyDemo236&${query}`
        );
        if (response.success) {
          setEmails(response.data.emails);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedEmailValue) {
      fetchEmails();
    }
  }, [selectedEmailValue, filters]);

  const openModal = (email) => {
    setSelectedEmail(email);
  };

  const closeModal = () => {
    setSelectedEmail(null);
  };

  const handleReply = () => {
    closeModal();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mt-2">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <h1 className="text-2xl font-bold">Emails</h1>
        <Box w={["100%", "50%", "25%"]} textAlign="left">
          <p className="font-bold text-sm">{t(`Select`)} {t(`Email`)}</p>
          <Select
            onChange={(e) => setSelectedEmailValue(e.target.value)}
            height={"30px"}
            value={selectedEmailValue}
            style={{ border: `1px solid ${border}60` }}
          >
            <option value="">
              {t(`Select`)} {t(`Email`)}
            </option>
            {allEmail?.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </Box>
      </Flex>

      {/* Filters Section */}
      <Box mb={4} py={2} bg="gray.100" rounded="lg">
        <Grid templateColumns={["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={4}>
          <Box>
            <Input
              placeholder="Type"
              name="type"
              style={{ border: `1px solid ${border}60` }}
              value={filters.type}
              onChange={handleFilterChange}
            />
          </Box>
          <Box>
            <Input
              placeholder="From"
              style={{ border: `1px solid ${border}60` }}
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
            />
          </Box>
          <Box>
            <Input
              type="date"
              placeholder="Since"
              style={{ border: `1px solid ${border}60` }}
              name="since"
              value={filters.since}
              onChange={handleFilterChange}
            />
          </Box>
          <Box>
            <Input
              type="date"
              placeholder="Before"
              style={{ border: `1px solid ${border}60` }}
              name="before"
              value={filters.before}
              onChange={handleFilterChange}
            />
          </Box>
        </Grid>
        {/* <Flex justify="flex-end" mt={4}>
          <Button
            onClick={() => setSelectedEmailValue(selectedEmailValue)}
            style={{backgroundColor:color, color:"white"}}
          >
            {t(`Apply Filters`)}
          </Button>
        </Flex> */}
      </Box>

      {loading ? (
        <Flex justify="center" py={4}>
          <Spinner size="lg" />
        </Flex>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr style={{backgroundColor:bg, color:"white"}} className="text-left">
              <th className="py-2 px-4 border">From</th>
              <th className="py-2 px-4 border">Subject</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.length > 0 ? (
              emails.map((email, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{email.from}</td>
                  <td className="py-2 px-4 border">{email.subject}</td>
                  <td className="py-2 px-4 border">{email.date}</td>
                  <td className="py-2 px-4 border">
                    
                    <Button
                      style={{backgroundColor:bg, color:"white"}}
                      onClick={() => openModal(email)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-2 px-4 text-center border">
                  No emails available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {selectedEmail && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Email Details</h2>
            <p>
              <strong>From:</strong> {selectedEmail.from}
            </p>
            <p>
              <strong>Subject:</strong> {selectedEmail.subject}
            </p>
            <p>
              <strong>Date:</strong> {selectedEmail.date}
            </p>
            <hr className="my-4" />
            <div className="flex flex-col gap-4">
            <div className="overflow-y-auto h-40 w-[95%] flex mr-4 justify-start bg-gray-100 p-4 border rounded">
              <div
                contentEditable="true"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
              ></div>
            </div>

            <div className="overflow-y-auto h-40 flex w-[95%] ml-4 bg-gray-100 p-4 border rounded">
              
              <div
                contentEditable="true"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
              ></div>
            </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleReply}
                style={{backgroundColor:bg, color:"white"}}

              >
                Reply
              </Button>
              <Button
                colorScheme="red"
                ml={2}
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailsTable;
