import React from 'react';

const AgentInfo = ({ data }) => {
  const labels = {
    agent_code: "Agent Code",
    agent_balance: "Agent Balance",
    percent: "Percentage",
    agent_type: "Agent Type",
    agent_total_debit: "Total Debit",
    agent_total_credit: "Total Credit",
    agent_target_rtp: "Target RTP",
    agent_real_rtp: "Real RTP",
    currency: "Currency",
  };

  return (
  <> 
   {data.enabled?
      <DynamicDataViewer data={data}/>:
    <div className="w-[100%] mx-auto p-6 bg-white rounded-lg font-sans">
      {Object.entries(labels).map(([key, label]) => {
        if (!(key in data)) return null;

        return (
          <div key={key} className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">{label}</span>
            <span className="text-blue-600">{data[key]}</span>
          </div>
        );
      })}
    </div>
   }
 </>
  );
};
const formatKey = (key) => {
  return key
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};

const DynamicDataViewer = ({ data }) => {
  // Recursive function to render the data
  const renderData = (data) => {
    if (typeof data !== "object" || data === null) {
      // Render primitive values (string, number, boolean, null)
      return <span className="text-blue-600">{String(data)}</span>;
    }

    // Render arrays or objects
    return (
      <div className="pl-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="mb-3">
            <span className="font-bold text-gray-800">{formatKey(key)}:</span>{" "}
            {typeof value === "object" && value !== null ? (
              <div className="pl-4 border-l-2 border-gray-300 mt-1">
                {renderData(value)}
              </div>
            ) : (
              <span className="text-blue-600">{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-2 rounded-lg max-w-3xl">
      <div>{renderData(data)}</div>
    </div>
  );
};

export default AgentInfo;