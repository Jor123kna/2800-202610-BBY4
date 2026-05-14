import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { API_URL } from "../config";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

function AiChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPostAutofill = location.state?.source === "post-autofill";
  const draftData = location.state?.draft || {};
  const returnPath = location.state?.returnTo || "/community";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: isPostAutofill
        ? "I'm here to help you write a neighbourhood post. Tell me exactly what you want to communicate - what help you need or what you're offering. I'll ask questions to get all the details, and when I have everything I need, I'll create your post automatically."
        : "Hi! I'm your emergency preparedness assistant for the Lower Mainland. I can help you draft a neighbourhood post, suggest safety steps, or explain what to do during an emergency.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usageInfo, setUsageInfo] = useState(null);

  // Only set when AI has sent a fully-structured POST_READY response
  const [pendingPost, setPendingPost] = useState(null);

  const [postError, setPostError] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { userData, authLoading } = useAuth();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!userData) return;

    const loadUsageInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chat/usage`, {
          credentials: "include",
        });

        if (!response.ok) {
          setUsageInfo(null);
          return;
        }

        const data = await response.json();
        setUsageInfo(data.usage || null);
      } catch (err) {
        console.error("Failed to load AI usage info:", err);
        setUsageInfo(null);
      }
    };

    loadUsageInfo();
  }, [userData]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || !userData) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    // Clear any previous pending post when the user sends a new message
    setPendingPost(null);
    setPostError("");

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: isPostAutofill ? "post-autofill" : undefined,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data.usage) {
        setUsageInfo(data.usage);
      }

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      const reply =
        data.reply || "Sorry, I could not get a response. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      // Only enable the confirm button when AI returns fully structured POST_READY data
      if (isPostAutofill && reply.trim().startsWith("POST_READY")) {
        const postData = parsePostDataFromAi(reply);
        if (postData) {
          setPendingPost(postData);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = isPostAutofill
    ? [
        "I need help with groceries because I'm elderly",
        "We're looking for volunteers to help with cleanup",
        "There's a power outage in my neighbourhood",
        "I lost my cat, can you help me write a notice?",
      ]
    : [
        "What should be in my emergency kit?",
        "What do I do during an earthquake?",
        "How do I prepare for wildfire smoke?",
        "Where are cooling centres in Vancouver?",
      ];

  const handleSuggestion = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const parsePostDataFromAi = (text) => {
    if (!text || !text.trim().startsWith("POST_READY")) return null;

    const lines = text.split("\n");
    const postData = {};

    for (const line of lines) {
      if (line.startsWith("Title: ")) {
        postData.title = line.substring(7).trim();
      } else if (line.startsWith("Content: ")) {
        postData.content = line.substring(9).trim();
      } else if (line.startsWith("Neighbourhood: ")) {
        postData.neighbourhood = line.substring(15).trim();
      } else if (line.startsWith("Role: ")) {
        postData.role = line.substring(6).trim();
      }
    }

    // All three required fields must be present
    if (postData.title && postData.content && postData.role) {
      return postData;
    }
    return null;
  };

  const confirmAndPublishPost = async () => {
    if (!pendingPost) return;

    setPostError("");
    setPostLoading(true);

    try {
      const response = await fetch(`${API_URL}/posts/autofill`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pendingPost.title,
          content: pendingPost.content,
          neighbourhood:
            pendingPost.neighbourhood || draftData.neighbourhood || "",
          role: pendingPost.role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      navigate(returnPath);
    } catch (err) {
      setPostError(err.message || "Could not publish post. Please try again.");
    } finally {
      setPostLoading(false);
    }
  };

  if (!authLoading && !userData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-header">
        <div className="ai-chat-header-icon" aria-hidden="true">
          🤖
        </div>
        <div>
          <h1 className="ai-chat-title">AI Assistant</h1>
          <p className="ai-chat-subtitle">
            {isPostAutofill
              ? "Tell me exactly what you want to post about - I'll collect all details and create your post automatically."
              : "Emergency preparedness for the Lower Mainland"}
          </p>
        </div>
      </div>

      <div
        className="ai-chat-messages"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`ai-chat-bubble-row ${msg.role === "user" ? "user" : "assistant"}`}
          >
            {msg.role === "assistant" && (
              <div className="ai-chat-avatar" aria-hidden="true">
                🤖
              </div>
            )}
            <div className={`ai-chat-bubble ${msg.role}`}>
              {msg.role === "assistant" ? (
                <div className="ai-chat-markdown">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* Confirm button ONLY appears when AI has returned complete POST_READY data */}
        {isPostAutofill && pendingPost && !loading && (
          <div className="ai-chat-bubble-row assistant ai-chat-confirm-row">
            <div className="ai-chat-confirm-box">
              <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                Your post is ready. Confirm to publish it to your neighbourhood.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmAndPublishPost}
                disabled={postLoading}
              >
                {postLoading ? "Publishing..." : "Confirm post"}
              </button>
              {postError && (
                <p
                  className="input-error-message"
                  style={{ marginTop: "0.75rem" }}
                >
                  {postError}
                </p>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="ai-chat-bubble-row assistant">
            <div className="ai-chat-avatar" aria-hidden="true">
              🤖
            </div>
            <div className="ai-chat-bubble assistant ai-chat-bubble--typing">
              <span className="ai-typing-dot" />
              <span className="ai-typing-dot" />
              <span className="ai-typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.filter((m) => m.role === "user").length === 0 && (
        <div className="ai-chat-suggestions">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="ai-chat-suggestion"
              onClick={() => handleSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="ai-chat-input-bar">
        <textarea
          ref={inputRef}
          className="ai-chat-input"
          placeholder={
            userData
              ? isPostAutofill
                ? "Describe the neighbourhood post you want to publish..."
                : "Ask about emergency preparedness..."
              : "Sign in to use the AI assistant"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Message input"
          disabled={!userData}
        />
        <button
          type="button"
          className={`ai-chat-send ${input.trim() && !loading && userData ? "active" : ""}`}
          onClick={sendMessage}
          disabled={!input.trim() || loading || !userData}
          aria-label="Send message"
        >
          ↑
        </button>
      </div>

      <div className="ai-chat-usage-hint">
        {authLoading ? (
          <p>Loading authentication...</p>
        ) : userData ? (
          usageInfo ? (
            <>
              <div className="ai-usage-header">
                <span>AI Daily Usage</span>
                <span>{usageInfo.percentUsed}%</span>
              </div>
              <div className="ai-usage-bar">
                <div
                  className="ai-usage-fill"
                  style={{ width: `${usageInfo.percentUsed}%` }}
                />
              </div>
              <p className="ai-usage-refresh">
                Refreshes tomorrow at {usageInfo.refreshAt}
              </p>
            </>
          ) : (
            <p>Loading AI usage info…</p>
          )
        ) : null}
      </div>
    </div>
  );
}

export default AiChat;
