import React, { useState, useEffect, useRef } from "react";
import { FaMoon, FaSun, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DigitalClock from "../components/DigitalClock";
import Spinner from "../components/Spinner";
import HistoryList from "../components/HistoryList";
import UserSelect from "../components/UserSelect";
import CameraSection from "../components/CameraSection";
import { USERS, ACTIONS } from "../constants";
import "../App.css";

export default function Home() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });
    const [selectedUser, setSelectedUser] = useState("");
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [history, setHistory] = useState([]);
    const [step, setStep] = useState("identify");
    const [showCamera, setShowCamera] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [counter, setCounter] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        document.body.className = theme === "dark" ? "dark" : "";
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleUserChange = (e) => {
        setSelectedUser(e.target.value);
    };

    const handleConfirmUser = () => {
        if (selectedUser) {
            setStep("clock");
            setIsClockedIn(false);
            setHistory([]);
        }
    };

    const handleBackToIdentify = () => {
        setStep("identify");
        setSelectedUser("");
        setIsClockedIn(false);
        setHistory([]);
        setPhoto(null);
    };

    const handleClockIn = () => {
        setPendingAction("in");
        setShowCamera(true);
        setCounter(null);
        setCameraReady(false);
    };

    const handleClockOut = () => {
        setPendingAction("out");
        setShowCamera(true);
        setCounter(null);
        setCameraReady(false);
    };

    useEffect(() => {
        if (showCamera && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    streamRef.current = stream;
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        setCameraReady(true);
                    };
                    videoRef.current.play();
                })
                .catch(() => {
                    alert("Unable to access camera.");
                    setShowCamera(false);
                });
        }
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [showCamera]);

    useEffect(() => {
        if (showCamera && cameraReady && counter === null) {
            setCounter(3);
        }
    }, [cameraReady, showCamera, counter]);

    useEffect(() => {
        if (showCamera && counter !== null) {
            if (counter === 0) {
                handleTakePhoto();
                return;
            }
            timerRef.current = setTimeout(() => {
                setCounter(counter - 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [counter, showCamera]);

    const handleTakePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");
            setPhoto(dataUrl);
            setShowCamera(false);
            setCounter(null);
            setCameraReady(false);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            const actionType = pendingAction === "in" ? ACTIONS.IN : ACTIONS.OUT;
            setIsClockedIn(pendingAction === "in");
            setHistory([
                ...history,
                {
                    user: selectedUser,
                    type: actionType,
                    time: new Date().toLocaleString(),
                    photo: dataUrl
                },
            ]);
            setPendingAction(null);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <div id="root">
            <div className="sidebar">
                <img className="logo" src="https://img.icons8.com/ios-filled/100/ffffff/clock--v1.png" alt="Logo" />
                <DigitalClock />
                <h1 style={{ marginTop: "0.5rem" }}>Registro de Entrada</h1>
            </div>
            <div className="main-content">
                <div className="theme-toggle">
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--primary)",
                            fontSize: "1.5rem",
                            padding: "0.25rem 0.5rem",
                            cursor: "pointer",
                            boxShadow: "none",
                            transition: "color 0.2s",
                            opacity: 0.7,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        aria-label="Toggle theme"
                        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    >
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </button>
                </div>
                <div className="card">
                    {showHistory ? (
                        <div>
                            <button
                                onClick={() => setShowHistory(false)}
                                style={{
                                    background: '#f8faff',
                                    color: '#2563eb',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    padding: '0.75rem 2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.2s, color 0.2s'
                                }}
                            >
                                <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Volver
                            </button>
                            <div className="history">
                                <h2>Historial</h2>
                                <HistoryList history={history} />
                            </div>
                        </div>
                    ) : step === "identify" ? (
                        <div>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label htmlFor="user-select" style={{ fontWeight: 500, marginRight: "1rem" }}>
                                    Identificate:
                                </label>
                                <UserSelect users={USERS} selectedUser={selectedUser} onChange={handleUserChange} />
                            </div>
                            <button
                                onClick={handleConfirmUser}
                                disabled={!selectedUser}
                                style={{
                                    background: "var(--primary)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "0.75rem",
                                    padding: "0.75rem 2rem",
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    cursor: selectedUser ? "pointer" : "not-allowed",
                                    opacity: selectedUser ? 1 : 0.5,
                                    marginTop: "1rem"
                                }}
                            >
                                Continuar
                            </button>
                        </div>
                    ) : showCamera ? (
                        <CameraSection
                            videoRef={videoRef}
                            canvasRef={canvasRef}
                            cameraReady={cameraReady}
                            counter={counter}
                        />
                    ) : (
                        <div>
                            <button
                                onClick={handleBackToIdentify}
                                style={{
                                    background: '#f8faff',
                                    color: '#2563eb',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    padding: '0.75rem 2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.2s, color 0.2s'
                                }}
                                aria-label="Back to user selection"
                                title="Back to user selection"
                            >
                                <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Cambiar Usuario
                            </button>
                            <div
                                className="status"
                                style={{
                                    color: isClockedIn ? '#22c55e' : '#c0392b',
                                    background: isClockedIn ? '#e6fae6' : '#ffeaea',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    marginBottom: '1rem',
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    display: 'inline-block'
                                }}
                            >
                                {`Hola, ${selectedUser}! Estado: ${isClockedIn ? "En jornada" : "Fuera de jornada"}`}
                            </div>
                            <div className="button-group">
                                <button
                                    onClick={handleClockIn}
                                    disabled={isClockedIn}
                                    style={{
                                        background: isClockedIn ? '#e5e7eb' : '#2563eb',
                                        color: isClockedIn ? '#9ca3af' : '#fff',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        padding: '0.75rem 2rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        cursor: isClockedIn ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                                        marginRight: '1rem',
                                        transition: 'background 0.2s, color 0.2s'
                                    }}
                                >
                                    {ACTIONS.CLOCK_IN}
                                </button>
                                <button
                                    onClick={handleClockOut}
                                    disabled={!isClockedIn}
                                    style={{
                                        background: !isClockedIn ? '#e5e7eb' : '#2563eb',
                                        color: !isClockedIn ? '#9ca3af' : '#fff',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        padding: '0.75rem 2rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        cursor: !isClockedIn ? 'not-allowed' : 'pointer',
                                        boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                                        transition: 'background 0.2s, color 0.2s'
                                    }}
                                >
                                    {ACTIONS.CLOCK_OUT}
                                </button>
                            </div>
                            <button
                                onClick={() => setShowHistory(true)}
                                style={{
                                    background: '#f8faff',
                                    color: '#2563eb',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    padding: '0.75rem 2rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.2s, color 0.2s'
                                }}
                            >
                                Historial <FaArrowRight style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
