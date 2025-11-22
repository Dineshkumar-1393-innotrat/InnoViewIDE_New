import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DyteMeeting } from "@dytesdk/react-ui-kit";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";

const JoinMeeting = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meeting, initMeeting] = useDyteClient();
  const initTokenRef = useRef(null);
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);

  // Load participant name from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUserIdentity");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setParticipantName(parsed.name);
        }
      }
    } catch (err) {
      console.warn("Failed to load user identity:", err);
    }
  }, []);

  // Initialize meeting when token is available
  useEffect(() => {
    if (!token || initTokenRef.current === token) return;

    const initialize = async () => {
      try {
        console.log("🎥 Initializing Dyte meeting...");
        initTokenRef.current = token;
        
        await initMeeting({
          authToken: token,
          defaults: { 
            audio: true, 
            video: true,
            screenShare: true,
          },
        });

        console.log("✅ Meeting initialized successfully");
      } catch (err) {
        console.error("❌ Failed to initialize meeting:", err);
        setError(err.message || "Failed to initialize meeting");
      }
    };

    initialize();
  }, [token, initMeeting]);

  // Listen for screen share events from other participants (host)
  useEffect(() => {
    if (!meeting || !meeting.participants || !meeting.participants.joined) return;

    const handleScreenShareUpdate = () => {
      // Check if any participant is sharing screen
      const isAnyoneSharing = (
        Array.isArray(meeting.participants.joined) && 
        meeting.participants.joined.some(participant => participant.screenShareEnabled)
      ) || (meeting.self && meeting.self.screenShareEnabled);
      
      setIsScreenShareActive(isAnyoneSharing);
      console.log('📺 Participant view - Screen share status:', isAnyoneSharing ? 'Active' : 'Inactive');
      
      if (isAnyoneSharing) {
        console.log('📺 Screen share detected - should be visible in main view');
        // Force a small delay to ensure UI updates
        setTimeout(() => {
          console.log('📺 Screen share UI should now be updated');
        }, 1000);
      }
    };

    // Listen for participant screen share changes
    if (meeting.participants.joined.addListener) {
      meeting.participants.joined.addListener('screenShareUpdate', handleScreenShareUpdate);
    }
    if (meeting.self && meeting.self.addListener) {
      meeting.self.addListener('screenShareUpdate', handleScreenShareUpdate);
    }

    // Initial check
    handleScreenShareUpdate();

    return () => {
      if (meeting.participants.joined && meeting.participants.joined.removeListener) {
        meeting.participants.joined.removeListener('screenShareUpdate', handleScreenShareUpdate);
      }
      if (meeting.self && meeting.self.removeListener) {
        meeting.self.removeListener('screenShareUpdate', handleScreenShareUpdate);
      }
    };
  }, [meeting]);

  // Fetch token and join meeting
  const handleJoinMeeting = async () => {
    if (!participantName.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!meetingId) {
      setError("Invalid meeting ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🎫 Fetching participant token for:", meetingId);

      const res = await fetch("https://eureka.innotrat.in/api/v1/get-participant-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId: meetingId,
          name: participantName.trim(),
          preset_name: "group_call_participant",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to get participant token");
      }

      if (data?.data?.token) {
        console.log("✅ Token received successfully");
        setToken(data.data.token);
        setHasJoined(true);
      } else {
        throw new Error("Token not found in response");
      }
    } catch (err) {
      console.error("❌ Error fetching token:", err);
      setError(err.message || "Failed to join meeting");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveMeeting = () => {
    try {
      if (meeting) {
        meeting.leaveRoom();
      }
    } catch (err) {
      console.warn("Leave error:", err);
    }
    navigate("/");
  };

  // Show meeting UI if joined and meeting is ready
  if (hasJoined && meeting) {
    return (
      <DyteProvider value={meeting}>
        <div style={{ height: "100vh", width: "100vw", position: "relative", background: "#000" }}>
          {/* Header with Leave Button */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.8)",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#fff", display: "flex", alignItems: "center", gap: "16px" }}>
              <div>
                <strong>Meeting:</strong> {meetingId?.slice(0, 10)}... | <strong>You:</strong> {participantName}
              </div>
              {isScreenShareActive && (
                <div style={{ 
                  background: "#48bb78", 
                  color: "#fff", 
                  padding: "4px 8px", 
                  borderRadius: "4px", 
                  fontSize: "12px",
                  fontWeight: "500"
                }}>
                  📺 Screen Share Active
                </div>
              )}
            </div>
            <button
              onClick={handleLeaveMeeting}
              style={{
                background: "#e53e3e",
                color: "#fff",
                border: "none",
                padding: "8px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Leave Meeting
            </button>
          </div>

          {/* Dyte Meeting Component */}
          <DyteMeeting
            meeting={meeting}
            mode="fill"
            showSetupScreen={true}
            style={{ 
              width: "100%", 
              height: "100%",
              backgroundColor: '#000'
            }}
            config={{
              controlBar: {
                elements: {
                  fullscreen: true,
                  share: false,
                  screenShare: false,
                  camera: true,
                  mic: true,
                  participants: true,
                  plugins: false,
                  settings: true,
                  chat: true,
                  polls: true,
                  leave: true,
                },
              },
              header: {
                elements: {
                  logo: false,
                  title: true,
                  participantCount: true,
                  clock: true,
                },
              },
            }}
          />
        </div>
      </DyteProvider>
    );
  }

  // Show join form
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#667eea",
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: "24px", color: "#2d3748" }}>Join Meeting</h2>
          <p style={{ margin: "8px 0 0 0", color: "#718096", fontSize: "14px" }}>
            Meeting ID: <strong>{meetingId?.slice(0, 10)}...</strong>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#fed7d7",
              border: "1px solid #fc8181",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px",
              color: "#c53030",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Join Form */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "500",
              color: "#2d3748",
              fontSize: "14px",
            }}
          >
            Your Name *
          </label>
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleJoinMeeting();
              }
            }}
            placeholder="Enter your name"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              transition: "border 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#667eea")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        {/* Join Button */}
        <button
          onClick={handleJoinMeeting}
          disabled={isLoading || !participantName.trim()}
          style={{
            width: "100%",
            padding: "14px",
            background: isLoading || !participantName.trim() ? "#cbd5e0" : "#667eea",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: isLoading || !participantName.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && participantName.trim()) {
              e.target.style.background = "#5568d3";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && participantName.trim()) {
              e.target.style.background = "#667eea";
            }
          }}
        >
          {isLoading ? "Joining..." : "Join Meeting"}
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            padding: "12px",
            background: "transparent",
            color: "#718096",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            marginTop: "12px",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default JoinMeeting;
