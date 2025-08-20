import React, { useState } from "react";
import { ACTIONS } from "../constants";

export default function HistoryList({ history }) {
  const [modalImg, setModalImg] = useState(null);

  return (
    <>
      <ul className="history-list">
        {history.map((item, idx) => (
          <li key={idx} className={item.type === ACTIONS.OUT ? "clock-out" : ""}>
            {item.user}: {item.type}: <span className="time">{item.time}</span>
            {item.photo && (
              <div>
                <img
                  src={item.photo}
                  alt="Clock event"
                  style={{
                    marginTop: "0.5rem",
                    maxWidth: "120px",
                    borderRadius: "0.5rem",
                    boxShadow: "0 2px 8px rgba(60,72,88,0.12)",
                    cursor: "pointer"
                  }}
                  onClick={() => setModalImg(item.photo)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {modalImg && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setModalImg(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={modalImg}
              alt="Clock event large"
              style={{
                maxWidth: "80vw",
                maxHeight: "70vh",
                borderRadius: "0.75rem",
                marginBottom: "1rem"
              }}
            />
            <button
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1.5rem",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer"
              }}
              onClick={() => setModalImg(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
