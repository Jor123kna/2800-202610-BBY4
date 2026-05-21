const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");
const User = require("../models/users");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an emergency preparedness assistant for Metro Vancouver and the Lower Mainland, BC.

Rules:
- Keep responses short and scannable — 3 to 6 lines max for simple questions, a short list for step-by-step ones
- No bold headers, no excessive bullet points, no "Did you know?" or filler phrases
- Plain, direct language — like texting a knowledgeable friend
- Only use a list when steps or items genuinely need one, keep it tight
- Never pad responses or add motivational sign-offs
- If someone is in immediate danger, tell them to call 9-1-1 first
- Reference BC-specific sources (PreparedBC, BC Hydro, HealthLinkBC) only when genuinely useful`;

const POST_AUTOFILL_PROMPT = `${SYSTEM_PROMPT}

You are helping draft a neighbourhood community post. CRITICAL RULES:
- ONLY use information explicitly mentioned by the user
- DO NOT add details, assumptions, or embellishments not mentioned by the user
- DO NOT assume services, hours, locations, or capabilities unless specifically stated
- If key information is missing, ask the user specific questions
- When you have ALL the information needed, format your response as:

POST_READY
Title: [exact title]
Content: [complete post content]
Neighbourhood: [neighbourhood if mentioned, otherwise leave blank]
Role: [helper or in-need based on context]

This will automatically create the post. Do not use this format until you have confirmed all necessary details with the user.`;

const DAILY_LIMIT = 40; // per user per day

//---------------
//Helper function
//---------------
// formatRefreshDelta: Convert a number of seconds into a human-friendly
// string like "1h 20m" or "15m" for UI display of rate-limit refresh time.
const formatRefreshDelta = (seconds) => {
  if (seconds <= 0) return "less than a minute";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

// getUsageInfo: Build an object summarizing the user's daily AI usage,
// including used count, limit, percent used, and refresh timing info.
const getUsageInfo = (user) => {
  if (!user) return null;

  const now = new Date();
  const today = now.toDateString();
  const lastDate = user.aiMessageDate
    ? new Date(user.aiMessageDate).toDateString()
    : null;
  const used = lastDate !== today ? 0 : user.aiMessageCount || 0;

  const refreshAt = new Date(now);
  refreshAt.setHours(24, 0, 0, 0);
  const refreshInSeconds = Math.max(0, Math.floor((refreshAt - now) / 1000));

  return {
    used,
    limit: DAILY_LIMIT,
    percentUsed: Math.min(100, Math.round((used / DAILY_LIMIT) * 100)),
    refreshAt: refreshAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    refreshIn: formatRefreshDelta(refreshInSeconds),
  };
};

// resetUsageIfNewDay: If the stored aiMessageDate is not today, reset the
// user's aiMessageCount to zero and update aiMessageDate to today.
const resetUsageIfNewDay = async (user) => {
  const today = new Date().toDateString();
  const lastDate = user.aiMessageDate
    ? new Date(user.aiMessageDate).toDateString()
    : null;

  if (lastDate !== today) {
    user.aiMessageCount = 0;
    user.aiMessageDate = new Date();
    await user.save();
  }
};

// getLoggedInUser: Retrieve the logged-in user from the session and DB.
// Returns the user object or sends a 401 response and returns null.
const getLoggedInUser = async (req, res) => {
  const userId = req.session?.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Not logged in" });
    return null;
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(401).json({ error: "Not logged in" });
    return null;
  }

  return user;
};

// validateMessages: Ensure messages is a non-empty array; if not,
// send a 400 response and return false.
const validateMessages = (messages, res) => {
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "messages array is required" });
    return false;
  }

  return true;
};

// getSystemPrompt: Return the appropriate system prompt based on mode
// (regular system prompt or post-autofill prompt).
const getSystemPrompt = (mode) => {
  return mode === "post-autofill" ? POST_AUTOFILL_PROMPT : SYSTEM_PROMPT;
};

// checkAndUpdateUsage: Reset usage if a new day, check daily limit,
// increment the user's aiMessageCount if allowed, and return status
// and usage info.
const checkAndUpdateUsage = async (user) => {
  await resetUsageIfNewDay(user);

  if (user.aiMessageCount >= DAILY_LIMIT) {
    return {
      allowed: false,
      usage: getUsageInfo(user),
    };
  }

  user.aiMessageCount += 1;
  user.aiMessageDate = new Date();
  await user.save();

  return {
    allowed: true,
    usage: getUsageInfo(user),
  };
};

// createAiReply: Call the Anthropic API with the given messages and
// system prompt mode, returning the AI's text reply.
const createAiReply = async (messages, mode) => {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    system: getSystemPrompt(mode),
    messages,
  });

  return response.content[0].text;
};

// sendAiError: Log Anthropic API errors and send a 500 response
// including an optional usage object.
const sendAiError = (res, err, usage) => {
  console.error("Anthropic API error:", err?.status, err?.message);

  res.status(500).json({
    error: err?.message || "Failed to get response from AI",
    usage,
  });
};


//-------------
//Route
//-------------
// GET /chat/usage: Return the current user's AI usage info for the day.
// Requires an authenticated session.
router.get("/chat/usage", async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  await resetUsageIfNewDay(user);
  res.json({ usage: getUsageInfo(user) });
});


// POST /chat: Accept an array of messages and an optional mode, enforce
// rate limits, call the AI to generate a reply, and return the reply
// along with updated usage info.
router.post("/chat", async (req, res) => {
  const { messages, mode } = req.body;

  if (!validateMessages(messages, res)) return;

  const user = await getLoggedInUser(req, res);
  if (!user) return;

  const usageCheck = await checkAndUpdateUsage(user);

  if (!usageCheck.allowed) {
    return res.status(429).json({
      error: `Daily limit of ${DAILY_LIMIT} messages reached. Try again tomorrow.`,
      usage: usageCheck.usage,
    });
  }

  try {
    const reply = await createAiReply(messages, mode);

    res.json({
      reply,
      usage: usageCheck.usage,
    });
  } catch (err) {
    sendAiError(res, err, usageCheck.usage);
  }
});

module.exports = router;
