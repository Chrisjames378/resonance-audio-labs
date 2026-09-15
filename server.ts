import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini AI Synth Patch Generator Endpoint
  app.post("/api/gemini/patch", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "A valid prompt string is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "GEMINI_API_KEY environment variable is not configured.",
          fallbackNeeded: true,
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are an expert audio DSP sound designer. Your task is to design synthesizer sound patch parameters matching the user's description.
Return a structured JSON object with sound parameters for a dual-oscillator subtractive synthesizer.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Create a synth patch for: ${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              patchName: {
                type: Type.STRING,
                description: "Short, impactful sound patch title (e.g., Cyberpunk Bass, Ethereal Pad)",
              },
              osc1Wave: {
                type: Type.STRING,
                description: "Primary oscillator waveform: 'sawtooth', 'square', 'sine', or 'triangle'",
              },
              osc2Wave: {
                type: Type.STRING,
                description: "Secondary oscillator waveform: 'sawtooth', 'square', 'sine', or 'triangle'",
              },
              cutoff: {
                type: Type.NUMBER,
                description: "Lowpass filter cutoff frequency in Hz (between 200 and 8000)",
              },
              resonance: {
                type: Type.NUMBER,
                description: "Filter resonance Q factor (between 0.5 and 10.0)",
              },
              attack: {
                type: Type.NUMBER,
                description: "Envelope attack time in seconds (between 0.005 and 1.5)",
              },
              release: {
                type: Type.NUMBER,
                description: "Envelope release time in seconds (between 0.1 and 3.0)",
              },
              description: {
                type: Type.STRING,
                description: "A concise 1-sentence description of the sonic characteristics",
              },
            },
            required: ["patchName", "osc1Wave", "osc2Wave", "cutoff", "resonance", "attack", "release", "description"],
          },
        },
      });

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error("No response text returned from Gemini API");
      }

      const patchData = JSON.parse(jsonText);
      return res.json({ success: true, patch: patchData });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({
        error: err?.message || "Failed to generate sound patch with Gemini AI",
        fallbackNeeded: true,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Resonance Audio Labs Server running on http://localhost:${PORT}`);
  });
}

startServer();
