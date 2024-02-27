import React from "react";

const SpinnerComponent = () => {
  return (
    <div
      style={{
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "50%",
        borderTop: "4px solid #3498db",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
        margin: "20px auto",
      }}
    ></div>
  );
};

export default SpinnerComponent;
