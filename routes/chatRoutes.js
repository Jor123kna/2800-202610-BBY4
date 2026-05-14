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

const DAILY_LIMIT = 40; // per user per day

const formatRefreshDelta = (seconds) => {
  if (seconds <= 0) return "less than a minute";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

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

router.post("/chat", async (req, res) => {
  const { messages, mode } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const userId = req.session?.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  let usage = null;

  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      const today = new Date().toDateString();
      const lastDate = user.aiMessageDate
        ? new Date(user.aiMessageDate).toDateString()
        : null;

      if (lastDate !== today) {
        user.aiMessageCount = 0;
        user.aiMessageDate = new Date();
      }

      if (user.aiMessageCount >= DAILY_LIMIT) {
        usage = getUsageInfo(user);
        return res.status(429).json({
          error: `Daily limit of ${DAILY_LIMIT} messages reached. Try again tomorrow.`,
          usage,
        });
      }

      user.aiMessageCount += 1;
      user.aiMessageDate = new Date();
      await user.save();
      usage = getUsageInfo(user);
    }
  }

  try {
    const postAutofillSystemPrompt = `${SYSTEM_PROMPT}\n\nYou are helping draft a neighbourhood community post. CRITICAL RULES:\n- ONLY use information explicitly mentioned by the user\n- DO NOT add details, assumptions, or embellishments not mentioned by the user\n- DO NOT assume services, hours, locations, or capabilities unless specifically stated\n- If key information is missing (what the post is about, who needs help, what help is needed), ask the user specific questions\n- When you have ALL the information needed to create a complete post (title, content, neighbourhood if mentioned, role type), format your response as:\n\nPOST_READY\nTitle: [exact title]\nContent: [complete post content]\nNeighbourhood: [neighbourhood if mentioned, otherwise leave blank]\nRole: [helper or in-need based on context]\n\nThis will automatically create the post. Do not use this format until you have confirmed all necessary details with the user.`;
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system:
        mode === "post-autofill" ? postAutofillSystemPrompt : SYSTEM_PROMPT,
      messages,
    });

    res.json({ reply: response.content[0].text, usage });
  } catch (err) {
    console.error("Anthropic API error:", err?.status, err?.message);
    res
      .status(500)
      .json({ error: err?.message || "Failed to get response from AI", usage });
  }
});

module.exports = router;
