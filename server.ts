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

    const prompt = `Analyze the target company's copy and our offering to produce a strictly grounded cold outreach pitch.
Invent nothing. Extract quotes and factual claims directly from the target company text.

Target Company Text:
"""
${companyText.trim()}
"""

Our Offering / Value Proposition:
"""
${offering.trim()}
"""

Selected Outreach Angle:
${angle}${customAngleText ? ` (Custom angle specifics: ${customAngleText})` : ""}

Generate a JSON object conforming strictly to the response schema:
1. "subjectLine": A compelling, non-spammy outreach email subject line (under 9 words, natural casing).
2. "hookThesis": The core outreach hook or thesis articulating mutual value between their stated focus/challenge and our offering, strictly derived from the text.
3. "emailBody": A ready-to-send 3-paragraph pitch email draft:
   - Paragraph 1: Relevant observation referencing specific facts/quotes from their context without generic flattery.
   - Paragraph 2: Direct connection explaining how our offering supports their stated direction or eliminates friction.
   - Paragraph 3: A low-friction transition into a 10-minute exploration.
4. "keyEvidencePoints": An array of 1 to 3 exact quotes or factual details extracted directly from the target company text.

If the input company text contains no usable information or facts, return an empty string for subjectLine, hookThesis, and emailBody, and an empty array for keyEvidencePoints.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Invent nothing. Extract and pitch based strictly on the provided company copy and offering. If the input contains no usable information, return an empty pitch or appropriate fallback.",
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLine: {
              type: Type.STRING,
              description: "Compelling, non-spammy outreach email subject line",
            },
            hookThesis: {
              type: Type.STRING,
              description:
                "Core outreach hook or thesis articulating mutual value based strictly on target intel and offering",
            },
            emailBody: {
              type: Type.STRING,
              description:
                "Ready-to-send 3-paragraph pitch email draft grounded strictly in the provided company copy and offering",
            },
            keyEvidencePoints: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description:
                "Key quotes or factual evidence points extracted strictly from the target company copy",
            },
          },
          required: [
            "subjectLine",
            "hookThesis",
            "emailBody",
            "keyEvidencePoints",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(502).json({
        error: "Empty response received from Gemini. Please try again.",
      });
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("Invalid JSON from Gemini:", text, parseError);
      return res.status(502).json({
        error:
          "The AI service returned an unreadable response format. Please try again.",
      });
    }

    const subjectLine =
      typeof parsed.subjectLine === "string" ? parsed.subjectLine.trim() : "";
    const hookThesis =
      typeof parsed.hookThesis === "string" ? parsed.hookThesis.trim() : "";
    const emailBody =
      typeof parsed.emailBody === "string" ? parsed.emailBody.trim() : "";
    const keyEvidencePoints = Array.isArray(parsed.keyEvidencePoints)
      ? parsed.keyEvidencePoints.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
      : [];

    // System rule fallback check:
    // "If the input contains no usable information, return an empty pitch or appropriate fallback."
    if (
      !subjectLine ||
      !hookThesis ||
      !emailBody ||
      keyEvidencePoints.length === 0
    ) {
      return res.status(422).json({
        error:
          "The provided company copy did not contain sufficient usable information to construct a verified pitch. Please provide more detailed company text.",
      });
    }

    // Build structured output with legacy aliases for complete backwards-compatibility
    const validatedResult = {
      subjectLine,
      hookThesis,
      emailBody,
      keyEvidencePoints,
      // Compatibility aliases
      angle_title: hookThesis,
      evidence_snippet: keyEvidencePoints.join(" • "),
      rationale: hookThesis,
      subject_line: subjectLine,
      email_body: emailBody,
      call_to_action:
        "Would you be open to a quick 10-minute chat this week to explore this?",
    };

    return res.json(validatedResult);
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
