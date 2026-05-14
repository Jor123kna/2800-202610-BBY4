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
  const [latestAssistantText, setLatestAssistantText] = useState("");
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

      console.log("Chat response status:", response.status);

      const data = await response.json();
      if (data.usage) {
        setUsageInfo(data.usage);
      }

      if (!response.ok) {
        console.error("Backend error:", data);
        throw new Error(data.error || "Server error");
      }

      const reply =
        data.reply || "Sorry, I could not get a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      if (isPostAutofill) {
        setLatestAssistantText(reply);

        // Check if AI has provided structured post data
        if (reply.trim().startsWith("POST_READY")) {
          const postData = parsePostDataFromAi(reply);
          if (postData) {
            // Automatically create the post
            createPostFromStructuredData(postData);
          }
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

  const looksLikePostDraft = (text) => {
    if (!text) return false;
    const normalized = text.toLowerCase().trim();

    // Don't treat structured post data as a draft
    if (normalized.startsWith("post_ready")) {
      return false;
    }

    const promptPhrases = [
      "please provide",
      "tell me more",
      "what details",
      "what would you like",
      "can you",
      "could you",
      "describe",
      "help me understand",
      "provide more",
      "need more",
      "please share",
      "let me know",
    ];

    if (promptPhrases.some((phrase) => normalized.includes(phrase))) {
      return false;
    }
    if (normalized.endsWith("?")) {
      return false;
    }
    if (/^(i can|i can't|i cannot|i'm not|i am not|i need)/.test(normalized)) {
      return false;
    }

    return normalized.length >= 30;
  };

  const derivePostTitleFromAi = (text) => {
    if (!text) return draftData.title || "Community update";
    const lines = text
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return draftData.title || "Community update";

    const first = lines[0];
    if (/^title\s*:/i.test(first)) {
      return (
        first.replace(/^title\s*:/i, "").trim() ||
        draftData.title ||
        "Community update"
      );
    }

    if (first.length <= 80) {
      return first;
    }

    return draftData.title || "Community update";
  };

  const cleanMarkdownForPost = (text) => {
    if (!text) return "";
    // Remove markdown bold syntax (*text*)
    return text.replace(/\*([^*]+)\*/g, "$1");
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
        postData.neighbourhood = line.substring(14).trim();
      } else if (line.startsWith("Role: ")) {
        postData.role = line.substring(6).trim();
      }
    }

    // Validate that we have the required fields
    if (postData.title && postData.content && postData.role) {
      return postData;
    }
    return null;
  };

  const createPostFromStructuredData = async (postData) => {
    setPostError("");
    setPostLoading(true);

    try {
      const response = await fetch(`${API_URL}/posts/autofill`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          neighbourhood:
            postData.neighbourhood || draftData.neighbourhood || "",
          role: postData.role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post from AI data");
      }

      navigate(returnPath);
    } catch (err) {
      setPostError(err.message || "Could not create post from AI data.");
    } finally {
      setPostLoading(false);
    }
  };

  const createPostFromAiDraft = async () => {
    if (!latestAssistantText) return;

    setPostError("");
    setPostLoading(true);

    try {
      const response = await fetch(`${API_URL}/posts/autofill`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: derivePostTitleFromAi(latestAssistantText),
          content: cleanMarkdownForPost(latestAssistantText),
          neighbourhood: draftData.neighbourhood || "",
          role: draftData.role || "in-need",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post from AI draft");
      }

      navigate(returnPath);
    } catch (err) {
      setPostError(err.message || "Could not create post from AI draft.");
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

        {isPostAutofill &&
          !loading &&
          latestAssistantText &&
          messages.length > 3 && (
            <div className="ai-chat-bubble-row assistant ai-chat-confirm-row">
              <div className="ai-chat-confirm-box">
                {looksLikePostDraft(latestAssistantText) ? (
                  <>
                    <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                      If this looks like your post, confirm it to publish.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={createPostFromAiDraft}
                      disabled={postLoading}
                    >
                      {postLoading ? "Publishing..." : "Confirm post"}
                    </button>
                  </>
                ) : (
                  <p style={{ margin: 0, marginBottom: "0.5rem" }}>
                    I need more details to draft your post. Please describe what
                    you want the post to say.
                  </p>
                )}
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
                  style={{
                    width: `${usageInfo.percentUsed}%`,
                  }}
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
