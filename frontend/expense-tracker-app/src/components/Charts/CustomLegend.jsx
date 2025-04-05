import React from "react";

const CustomLegend = ({ payload = [] }) => {
    console.log("CustomLegend Payload:", payload);
  
    if (!Array.isArray(payload) || payload.length === 0) {
      return <p className="text-gray-500">Legend not available</p>;
    }
  
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => {
          const label = entry?.payload?.name || entry?.value || "N/A"; // Prefer your actual name
  
          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
export default CustomLegend;