import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "2mb" }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets.");
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "PitchHook" });
});

// Generate Pitch Endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { companyText, offering, angle, customAngleText } = req.body;

    if (!companyText || typeof companyText !== "string" || !companyText.trim()) {
      return res.status(400).json({ error: "Target company text is required." });
    }

    if (!offering || typeof offering !== "string" || !offering.trim()) {
      return res.status(400).json({ error: "Your offering description is required." });
    }

    const ai = getGenAI();

    const prompt = `You are a world-class B2B partnership and cold outreach copywriter.
Analyze the target company's text and craft a bespoke, compelling, high-converting outreach pitch based on the specified offering and outreach angle.

Target Company Text:
"""
${companyText.trim()}
"""

Our Offering / Product / Capability:
"""
${offering.trim()}
"""

Selected Outreach Angle:
${angle}${customAngleText ? ` (Custom angle specifics: ${customAngleText})` : ""}

Instructions:
1. "angle_title": A punchy, 3-6 word value hook summarizing the angle (e.g. "Accelerating Enterprise API Onboarding", "Reducing Churn in Mobile Self-Checkout").
2. "evidence_snippet": An exact or near-exact high-signal quote or factual detail extracted directly from the provided company text demonstrating genuine research.
3. "rationale": Exactly 1 concise sentence articulating why our offering and their stated goal/challenge create clear mutual value.
4. "subject_line": A short, curiosity-inducing, non-spammy cold email subject line (under 9 words, natural sentence case or lowercase).
5. "email_body": A high-converting 3-paragraph pitch email draft:
   - Paragraph 1: Relevant observation referencing the target company's specific context/evidence without generic flattery.
   - Paragraph 2: Direct connection to what we do and how it eliminates their friction or unlocks an opportunity with credible context.
   - Paragraph 3: A polite, frictionless transition into a low-pressure conversation.
   Keep the tone human, concise, professional, and free of sales buzzwords.
6. "call_to_action": A single, low-friction next step (e.g., "Open to seeing a 90-second loom showing how this works?", "Worth a 10-minute chat this Thursday?").

Output strict JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are PitchHook AI, an elite cold outreach strategist. Generate genuine, bespoke, research-backed outreach hooks that avoid clichés, spam tropes, and generic buzzwords.",
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            angle_title: {
              type: Type.STRING,
              description: "Core value angle or hook (3-6 words)",
            },
            evidence_snippet: {
              type: Type.STRING,
              description: "Relevant quote or factual statement extracted from the input text",
            },
            rationale: {
              type: Type.STRING,
              description: "Exactly 1 sentence explaining why this partnership creates mutual value",
            },
            subject_line: {
              type: Type.STRING,
              description: "Compelling, non-spammy outreach email subject line",
            },
            email_body: {
              type: Type.STRING,
              description: "Ready-to-send 3-paragraph pitch email draft",
            },
            call_to_action: {
              type: Type.STRING,
              description: "Low-friction next step CTA",
            },
          },
          required: [
            "angle_title",
            "evidence_snippet",
            "rationale",
            "subject_line",
            "email_body",
            "call_to_action",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(502).json({ error: "Empty response received from Gemini. Please try again." });
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("Invalid JSON from Gemini:", text, parseError);
      return res.status(502).json({
        error: "The AI service returned an unreadable response format. Please try again.",
      });
    }

    // Verify all required fields
    const requiredFields = [
      "angle_title",
      "evidence_snippet",
      "rationale",
      "subject_line",
      "email_body",
      "call_to_action",
    ];
    for (const field of requiredFields) {
      if (!parsed[field] || typeof parsed[field] !== "string" || !(parsed[field] as string).trim()) {
        return res.status(502).json({
          error: "The AI pitch response was missing required fields. Please try again.",
        });
      }
    }

    return res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate pitch";
    console.error("Error in /api/generate:", err);
    return res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PitchHook server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
