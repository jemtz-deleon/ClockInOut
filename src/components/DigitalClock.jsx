import React, { useState, useEffect } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontSize: "2.2rem",
        fontWeight: 700,
        margin: "1.5rem 0 0.5rem 0",
        letterSpacing: "0.05em",
        color: '#2563eb',
        textShadow: '0 1px 8px rgba(37,99,235,0.10)'
      }}
    >
      {time}
    </div>
  );
}
