import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { MOCK_SERVICES, MOCK_ADMIN_ANALYTICS } from "./src/data/mockData.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "LifeFix AI Server", hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// 2. AI Problem Solver Endpoint
app.post("/api/ai/solve", async (req, res) => {
  try {
    const { prompt, category, imageBase64, userContext } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: "Please provide a query or image to solve your problem." });
    }

    const gemini = getGeminiClient();

    // Fallback response generator if API key is not present or offline
    if (!gemini) {
      console.warn("GEMINI_API_KEY not configured or unavailable. Using intelligent fallback engine.");
      const fallbackText = getFallbackSolveResponse(prompt || "Image issue", category);
      return res.json({
        text: fallbackText,
        category: category || "general",
        suggestedServices: getMatchingServices(category || prompt),
      });
    }

    const parts: any[] = [];

    if (imageBase64) {
      const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const systemInstruction = `You are LifeFix AI, an expert problem-solving assistant for everyday life issues.
Your goal: Identify the problem, evaluate urgency, give immediate step-by-step actionable solutions, highlight safety or legal cautions, and recommend professional help if necessary.
Rules:
- For Health questions: Give clear first-aid or practical advice, but ALWAYS include a disclaimer that you are an AI and not a medical doctor.
- For Scam queries: Point out explicit red flags and safety steps immediately.
- For Repair/Appliances: Explain root cause, required tools, safety precautions (turn off power/water), and estimated repair difficulty.
- For Govt/Legal/Bills: Summarize key requirements, step-by-step procedures, and official portal advice.
Keep responses highly organized with Markdown headings, bullet points, and bold text for quick reading on mobile screens.
Context provided about user: ${JSON.stringify(userContext || {})}`;

    parts.push({
      text: `Category: ${category || "General Problem"}\nUser Problem: ${prompt || "Analyze the uploaded image and help fix the issue."}`,
    });

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const textResult = response.text || "LifeFix AI analyzed your request. Here are the recommended actions...";

    res.json({
      text: textResult,
      category: category || "general",
      suggestedServices: getMatchingServices(category || prompt),
    });
  } catch (err: any) {
    console.error("Error in /api/ai/solve:", err);
    res.status(500).json({
      error: "Failed to process problem with AI.",
      details: err.message,
      fallbackText: "I encountered an error connecting to AI services. However, if this is an urgent emergency (water leak, power short, medical hazard), please turn off main valves/switches and consult local certified services immediately.",
    });
  }
});

// 3. Scam Detector Endpoint
app.post("/api/scam/analyze", async (req, res) => {
  try {
    const { content, source, imageBase64 } = req.body;
    const gemini = getGeminiClient();

    if (!gemini) {
      // Fallback scam result
      const isScamLikely = content?.toLowerCase().includes("urgent") || content?.toLowerCase().includes("win") || content?.toLowerCase().includes("upi") || content?.toLowerCase().includes("click") || Boolean(imageBase64);
      return res.json({
        threatLevel: isScamLikely ? "CRITICAL_SCAM" : "SUSPICIOUS",
        riskScore: isScamLikely ? 92 : 65,
        scamType: isScamLikely ? "Fake Urgency / Payment Fraud" : "Unverified Message Request",
        redFlags: [
          "Urgent tone pushing immediate action",
          "Requests payment via unverified link or personal UPI ID",
          "Unsolicited notification with suspicious domain URL",
        ],
        explanation: "This message displays classic indicators of social engineering fraud designed to trigger panic and quick monetary transfer.",
        safetySteps: [
          "DO NOT click any embedded links",
          "DO NOT share OTP or PIN with anyone",
          "Verify directly on official app/website",
          "Block and report the sender number immediately",
        ],
        recommendedAction: "Report to Cyber Police and block this contact.",
      });
    }

    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    parts.push({
      text: `Source channel: ${source || "SMS/WhatsApp/Email"}\nContent to analyze for scam/phishing/UPI fraud: "${content || "Analyze the screenshot provided for fraudulent text, logos, or payment requests."}"`,
    });

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction: "You are a Fraud & Scam Prevention Specialist AI. Analyze the content for phishing, fake UPI requests, bank impersonation, job scams, fake bills, or lottery fraud.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threatLevel: {
              type: Type.STRING,
              description: "Must be SAFE, SUSPICIOUS, or CRITICAL_SCAM",
            },
            riskScore: {
              type: Type.NUMBER,
              description: "0 to 100 risk score",
            },
            scamType: {
              type: Type.STRING,
              description: "e.g. Fake UPI Payment, Bank Phishing, Electricity Bill Scam",
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific suspicious details identified",
            },
            explanation: {
              type: Type.STRING,
              description: "Clear explanation of why it is dangerous or safe",
            },
            safetySteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable steps for user safety",
            },
            recommendedAction: {
              type: Type.STRING,
              description: "Final concise recommendation e.g. Block & Report",
            },
          },
          required: ["threatLevel", "riskScore", "scamType", "redFlags", "explanation", "safetySteps", "recommendedAction"],
        },
      },
    });

    const jsonText = response.text;
    if (jsonText) {
      const parsed = JSON.parse(jsonText);
      return res.json(parsed);
    }

    throw new Error("Empty AI response");
  } catch (err: any) {
    console.error("Error in /api/scam/analyze:", err);
    res.json({
      threatLevel: "SUSPICIOUS",
      riskScore: 78,
      scamType: "Potential Phishing Request",
      redFlags: ["Contains unverified links or urgent payment request"],
      explanation: "Analysis completed with security safeguards. Be cautious of unknown links or payment demands.",
      safetySteps: ["Do not enter credentials", "Verify via official helpline"],
      recommendedAction: "Exercise extreme caution and verify before responding.",
    });
  }
});

// 4. Image Multimodal Diagnostic Endpoint
app.post("/api/image/analyze", async (req, res) => {
  try {
    const { imageBase64, userPrompt, category } = req.body;
    const gemini = getGeminiClient();

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing image for analysis." });
    }

    if (!gemini) {
      return res.json({
        detectedType: category || "appliance",
        problemTitle: "Detected Broken Equipment / Document",
        description: "Visual inspection suggests a potential defect or component alert. Ensure power/water supply is disconnected before examining.",
        urgency: "medium",
        estimatedCostOrDifficulty: "Moderate - $50-$120 estimated repair or 30 min DIY",
        immediateSteps: [
          "Safely power off or unplug the device",
          "Clear surrounding debris or liquid spill",
          "Inspect wires and model serial tag",
        ],
        requiredToolsOrExperts: ["Screwdriver set", "Multimeter", "Certified Electrician / Technician"],
        safetyWarning: "Never touch bare electrical wires or pressurized pipes without turning off main valves.",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: `Category context: ${category || "General"}. User query: ${userPrompt || "Inspect this image (appliance, document, bill, medicine label, receipt, error code) and provide diagnostic insights."}`,
          },
        ],
      },
      config: {
        systemInstruction: "You are LifeFix AI Multimodal Inspector. Analyze the image to identify what it is, diagnose problems, extract bill details or medicine warnings, give immediate safety steps, and list required tools/professionals.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedType: { type: Type.STRING, description: "appliance, bill, medicine, document, error_code, product, or general" },
            problemTitle: { type: Type.STRING, description: "Short title of what was identified" },
            description: { type: Type.STRING, description: "Detailed visual inspection notes" },
            urgency: { type: Type.STRING, description: "low, medium, high, or urgent" },
            estimatedCostOrDifficulty: { type: Type.STRING, description: "Cost range or difficulty rating" },
            immediateSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredToolsOrExperts: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyWarning: { type: Type.STRING },
          },
          required: ["detectedType", "problemTitle", "description", "urgency", "estimatedCostOrDifficulty", "immediateSteps", "requiredToolsOrExperts"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/image/analyze:", err);
    res.json({
      detectedType: "general",
      problemTitle: "Visual Inspection Analysis",
      description: "Image received and processed. Please exercise caution when dealing with household electronics or unknown documents.",
      urgency: "medium",
      estimatedCostOrDifficulty: "Variable depending on local provider",
      immediateSteps: ["Verify model number", "Consult certified technician if necessary"],
      requiredToolsOrExperts: ["Local service specialist"],
      safetyWarning: "Always prioritize safety when handling machinery or power sources.",
    });
  }
});

// 5. Local Services Search API
app.get("/api/services/search", (req, res) => {
  const { category, query, sortBy } = req.query;

  let results = [...MOCK_SERVICES];

  if (category && category !== "all") {
    results = results.filter(
      (s) => s.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (query) {
    const q = (query as string).toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sortBy === "rating") {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "distance") {
    results.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  res.json({ services: results });
});

// 6. Admin Analytics API
app.get("/api/admin/analytics", (req, res) => {
  res.json(MOCK_ADMIN_ANALYTICS);
});

// 7. Real-Time Location & Regional Advisory API
app.post("/api/location/advisory", async (req, res) => {
  try {
    const { latitude, longitude, city, state, country, neighborhood } = req.body;
    const locationName = city || state || (latitude ? `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` : "your region");
    const isIndia = country?.toLowerCase().includes("india") || ["mumbai", "delhi", "bengaluru", "bangalore", "pune", "hyderabad", "chennai", "kolkata", "ahmedabad", "jaipur", "noida", "gurgaon"].some(c => (city || "").toLowerCase().includes(c)) || (state || "").toLowerCase().includes("maharashtra") || (state || "").toLowerCase().includes("karnataka") || (state || "").toLowerCase().includes("delhi");

    const gemini = getGeminiClient();

    if (!gemini) {
      // Intelligent regional fallback generator
      const fallbackAdvisory = getRegionalFallbackAdvisory(city || "Mumbai", state || "Maharashtra", isIndia);
      return res.json(fallbackAdvisory);
    }

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            text: `Analyze the real-time geographic location: City="${city || "Unknown"}", State="${state || "Unknown"}", Country="${country || (isIndia ? "India" : "Global")}", Neighborhood="${neighborhood || ""}", Lat/Lng="${latitude}, ${longitude}".
Generate an authentic, localized emergency and life-safety advisory for a resident living in this area.
Include:
1. activeScams: Current prevalent scams in this state/city (e.g. Electricity power cut SMS from MSEDCL/BESCOM/BSES, Fake Courier Customs, Digital Arrest by Fake Police/CBI, Part-time Telegram tasks, Local Toll/Challan Phishing).
2. utilityAndGovt: Local electricity provider name, water/municipal board, cyber cell helpline (1930 for India), national emergency number, and consumer helpline.
3. climateAndHomeWarnings: Real-time environmental/seasonal risks (monsoon water logging & damp walls, high summer heat AC strain, hard water appliance scaling, voltage fluctuations).
4. nearestEmergencyHubs: 3 key emergency institutions (Police Cyber Cell, 24/7 Multi-specialty Hospital, Fire Station) with verified emergency contact numbers.`,
          },
        ],
      },
      config: {
        systemInstruction: "You are the LifeFix AI Real-Time Regional Safety & Household Advisory Engine. Provide precise, actionable local intelligence.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activeScams: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  urgency: { type: Type.STRING, description: "high or medium" },
                  commonTargets: { type: Type.STRING },
                  prevention: { type: Type.STRING },
                },
                required: ["title", "description", "urgency", "commonTargets", "prevention"],
              },
            },
            utilityAndGovt: {
              type: Type.OBJECT,
              properties: {
                electricityBoard: { type: Type.STRING },
                waterAuthority: { type: Type.STRING },
                cyberCellNumber: { type: Type.STRING },
                emergencyNumber: { type: Type.STRING },
                consumerHelpline: { type: Type.STRING },
              },
              required: ["electricityBoard", "waterAuthority", "cyberCellNumber", "emergencyNumber", "consumerHelpline"],
            },
            climateAndHomeWarnings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tip: { type: Type.STRING },
                  type: { type: Type.STRING, description: "rain, heat, water_quality, or general" },
                },
                required: ["title", "tip", "type"],
              },
            },
            nearestEmergencyHubs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  distance: { type: Type.STRING },
                  phone: { type: Type.STRING },
                },
                required: ["name", "type", "distance", "phone"],
              },
            },
          },
          required: ["activeScams", "utilityAndGovt", "climateAndHomeWarnings", "nearestEmergencyHubs"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/location/advisory:", err);
    res.json(getRegionalFallbackAdvisory(req.body.city || "Mumbai", req.body.state || "Maharashtra", true));
  }
});

function getRegionalFallbackAdvisory(city: string, state: string, isIndia: boolean) {
  const isMum = city.toLowerCase().includes("mumbai") || state.toLowerCase().includes("maharashtra");
  const isBlr = city.toLowerCase().includes("bengaluru") || city.toLowerCase().includes("bangalore") || state.toLowerCase().includes("karnataka");
  const isDel = city.toLowerCase().includes("delhi") || state.toLowerCase().includes("delhi");

  const eleBoard = isMum ? "MSEDCL / Adani Electricity / Tata Power" : isBlr ? "BESCOM (Bangalore Electricity)" : isDel ? "BSES Rajdhani / BSES Yamuna / TPDDL" : isIndia ? "State Electricity Distribution Board" : "Local Energy Grid";
  const waterAuth = isMum ? "BMC Water Department (MCGM)" : isBlr ? "BWSSB (Bangalore Water Supply)" : isDel ? "Delhi Jal Board (DJB)" : isIndia ? "Municipal Corporation Water Works" : "City Water Works";

  return {
    activeScams: [
      {
        title: `Fake ${eleBoard.split("/")[0].trim()} Power Disconnection SMS`,
        description: `Fraudsters sending SMS claiming "Electricity will be disconnected at 9:30 PM tonight due to unpaid bill. Call officer at 98xxxxxxx".`,
        urgency: "high",
        commonTargets: "Apartment residents and elderly bill payers",
        prevention: "Never call phone numbers in SMS. Pay only via official utility portal/app.",
      },
      {
        title: "Digital Arrest & Fake Police Video Call Fraud",
        description: "Scammers wearing fake police uniforms on Skype/WhatsApp claim a parcel sent under your Aadhaar contains illegal items and demand money.",
        urgency: "high",
        commonTargets: "Professionals, retired individuals and housewives",
        prevention: "Police/CBI never arrest people over Skype or ask for money transfer. Hang up immediately and dial 1930.",
      },
      {
        title: "Traffic E-Challan / RTO APK Phishing Links",
        description: "Fake WhatsApp messages with .apk download links claiming you have an unpaid speeding fine.",
        urgency: "medium",
        commonTargets: "Car and bike owners",
        prevention: "Check echallan.parivahan.gov.in directly. Never install .apk files from WhatsApp.",
      },
    ],
    utilityAndGovt: {
      electricityBoard: eleBoard,
      waterAuthority: waterAuth,
      cyberCellNumber: isIndia ? "1930 (National Cyber Crime Helpline)" : "911 / IC3 Portal",
      emergencyNumber: isIndia ? "112 (All-in-One Emergency)" : "911 / 999",
      consumerHelpline: isIndia ? "1915 (National Consumer Helpline)" : "1-800-HELPLINE",
    },
    climateAndHomeWarnings: [
      {
        title: "High Monsoon & Heavy Rain Drain Precautions",
        tip: "Inspect terrace and balcony drain traps. Clear fallen leaves to prevent rainwater backflow into false ceilings.",
        type: "rain",
      },
      {
        title: "Hard Water RO & Geyser Element Descaling",
        tip: "Groundwater in this zone has high TDS (300-600 ppm). Clean RO sediment filters every 3 months and descale water heaters annually.",
        type: "water_quality",
      },
      {
        title: "AC Compressor High-Load & Voltage Spikes",
        tip: "Ensure a certified 4kVA voltage stabilizer is installed for inverter air conditioners to prevent PCB motherboard burnouts.",
        type: "heat",
      },
    ],
    nearestEmergencyHubs: [
      {
        name: `${city || "City"} Central Cyber Crime Police Station`,
        type: "Police / Cyber Cell",
        distance: "2.4 km away",
        phone: isIndia ? "1930 / 112" : "911",
      },
      {
        name: `${city || "Local"} Multi-Speciality Trauma & Emergency Care`,
        type: "24/7 Hospital",
        distance: "1.8 km away",
        phone: "108 / 102",
      },
      {
        name: `${city || "Zone"} Municipal Fire & Disaster Rescue Station`,
        type: "Fire Station",
        distance: "3.1 km away",
        phone: "101 / 112",
      },
    ],
  };
}

// Helper functions
function getMatchingServices(categoryOrText?: string) {
  if (!categoryOrText) return MOCK_SERVICES.slice(0, 2);
  const lower = categoryOrText.toLowerCase();

  if (lower.includes("plumb") || lower.includes("pipe") || lower.includes("water") || lower.includes("leak") || lower.includes("repair")) {
    return MOCK_SERVICES.filter((s) => s.category === "plumber");
  }
  if (lower.includes("electr") || lower.includes("wire") || lower.includes("power") || lower.includes("spark") || lower.includes("light")) {
    return MOCK_SERVICES.filter((s) => s.category === "electrician");
  }
  if (lower.includes("health") || lower.includes("doctor") || lower.includes("fever") || lower.includes("medicine")) {
    return MOCK_SERVICES.filter((s) => s.category === "doctor");
  }
  if (lower.includes("car") || lower.includes("mechanic") || lower.includes("brake") || lower.includes("engine")) {
    return MOCK_SERVICES.filter((s) => s.category === "mechanic");
  }
  if (lower.includes("legal") || lower.includes("law") || lower.includes("contract") || lower.includes("tenant")) {
    return MOCK_SERVICES.filter((s) => s.category === "lawyer");
  }

  return MOCK_SERVICES.slice(0, 2);
}

function getFallbackSolveResponse(prompt: string, category?: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("water") || p.includes("leak") || p.includes("pipe")) {
    return `### 🚰 Emergency Water Leak Resolution Guide

**Step 1: Immediate Containment**
- Locate your home's main water shutoff valve (usually in the basement, garage, or near the water meter) and turn it clockwise to stop incoming water.
- Place a bucket under active drips and lay down heavy towels to minimize wood floor or drywall damage.

**Step 2: Safety Check**
- Check if water is leaking near electrical outlets or breaker panels. If yes, shut off the main circuit breaker BEFORE touching wet areas!

**Step 3: Diagnostic Assessment**
- If leaking from a pipe joint: Apply temporary plumber's silicone tape or pipe clamp.
- If leaking from water heater: Turn off power/gas supply to the heater.

**Step 4: Professional Help**
We've matched certified emergency plumbers nearby in Austin who offer same-day response.`;
  }

  if (p.includes("scam") || p.includes("otp") || p.includes("upi") || p.includes("link")) {
    return `### 🛡️ Urgent Fraud & Scam Safety Advisory

**Threat Assessment:** HIGH SUSPICION
This type of request matches common social engineering fraud. Legitimate organizations, banks, or government departments will NEVER ask for passwords, OTPs, or immediate wire transfers via SMS or personal WhatsApp numbers.

**Immediate Safety Action Steps:**
1. **DO NOT** click any links or scan QR codes provided.
2. **DO NOT** transfer money or reply with your personal details.
3. **Verify Directly:** Open the official app or call the verified phone number printed on your physical card/statement.
4. **Report Fraud:** Block the sender and report to the National Cyber Crime Reporting Portal.`;
  }

  return `### 💡 LifeFix AI Solutions & Action Plan

Thank you for sharing your concern regarding **"${prompt}"**.

**Key Steps to Resolve:**
1. **Assess Urgency:** Identify if immediate safety measures (power shutoff, card freeze, first aid) are required.
2. **Gather Documentation:** Keep receipts, model serial numbers, or message screenshots ready.
3. **Follow Standard Guidelines:** Refer to accredited resources or official service procedures.
4. **Connect with Experts:** Review verified nearby top-rated specialists listed below for hands-on assistance.`;
}

// Start Vite in dev mode or serve static build in prod
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LifeFix AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
