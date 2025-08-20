import React from "react";

export default function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          border: "8px solid #fff",
          borderTop: "8px solid #6366f1",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          boxShadow: "0 0 32px #000a",
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
