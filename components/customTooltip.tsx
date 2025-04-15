import React from "react";

interface CustomTooltipProps {
    active: boolean;
    payload: any[];
  }

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  // `active` means the tooltip is being shown (mouse is hovered over a bar)
  // `payload` is an array of data points (one element for each Bar if you have multiple)
  if (!active || !payload || !payload.length) {
    return null; // Hide if nothing to show
  }

  // For a single <Bar>, we can read from `payload[0]`
  const { name, value } = payload[0];

  // e.g. name = "Sparepart Mobil", value = 391
  return (
    <div
      style={{
        backgroundColor: "#000",    // black background
        color: "#fff",              // white text
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "14px",
      }}
    >
      {`${name}: ${value} juta`}
    </div>
  );
}

export default CustomTooltip;