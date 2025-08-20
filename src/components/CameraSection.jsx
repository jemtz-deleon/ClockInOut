import React, { useRef } from "react";
import Spinner from "./Spinner";

export default function CameraSection({ videoRef, canvasRef, cameraReady, counter }) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      minHeight: "320px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 0",
      boxSizing: "border-box",
      maxWidth: "400px",
      margin: "0 auto"
    }}>
      <video
        ref={videoRef}
        style={{
          width: cameraReady ? "100%" : "320px",
          height: cameraReady ? "auto" : "240px",
          maxWidth: "100%",
          borderRadius: "1rem",
          display: "block",
          background: "#000",
          transition: "width 0.3s, height 0.3s",
          margin: "0 auto"
        }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {!cameraReady && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.7)",
            borderRadius: "1rem",
            zIndex: 1,
          }}
        >
          <Spinner />
        </div>
      )}
      {cameraReady && counter !== null && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: "7rem",
              fontWeight: 900,
              textShadow: "0 0 30px #000, 0 0 10px #6366f1",
              letterSpacing: "0.1em",
              userSelect: "none",
            }}
          >
            {counter}
          </span>
        </div>
      )}
    </div>
  );
}
