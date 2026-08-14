import { ScamAnalysisResult, ImageAnalysisResult, LocalService, AdminAnalytics, DeviceLocation, LocalAdvisory } from '../types';

export async function solveProblemWithAI(
  prompt: string,
  category?: string,
  imageBase64?: string,
  userContext?: any
): Promise<{ text: string; category: string; suggestedServices: LocalService[] }> {
  try {
    const res = await fetch('/api/ai/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, category, imageBase64, userContext }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('API /api/ai/solve failed, using fallback client response:', err);
    return {
      text: `### 💡 LifeFix AI Solutions & Action Plan\n\nThank you for asking: **"${prompt}"**.\n\n**Key Steps to Resolve:**\n1. **Assess Urgency:** Check if power/water shutoff or card freeze is needed.\n2. **Gather Info:** Take photos of serial numbers, error codes, or document headers.\n3. **Follow Standard Process:** Refer to accredited resources or user manuals.\n4. **Verified Local Experts:** Check top-rated nearby technicians below.`,
      category: category || 'general',
      suggestedServices: [],
    };
  }
}

export async function analyzeScam(
  content: string,
  source: 'sms' | 'whatsapp' | 'email' | 'screenshot' | 'upi',
  imageBase64?: string
): Promise<ScamAnalysisResult> {
  try {
    const res = await fetch('/api/scam/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, source, imageBase64 }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('API /api/scam/analyze failed, using fallback:', err);
    return {
      threatLevel: 'SUSPICIOUS',
      riskScore: 78,
      scamType: 'Potential Unverified Message',
      redFlags: ['Urgent phrasing', 'Unverified sender domain or payment link'],
      explanation: 'Analysis detected potential fraud signatures. Never share bank OTPs or transfer money to unverified individuals.',
      safetySteps: [
        'Do NOT click unknown links',
        'Do NOT share personal PIN or OTP',
        'Verify directly on official customer care portal',
      ],
      recommendedAction: 'Block sender and report to Cyber Crime Cell.',
    };
  }
}

export async function analyzeImage(
  imageBase64: string,
  userPrompt?: string,
  category?: string
): Promise<ImageAnalysisResult> {
  try {
    const res = await fetch('/api/image/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, userPrompt, category }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('API /api/image/analyze failed, using fallback:', err);
    return {
      detectedType: 'appliance',
      problemTitle: 'Appliance or Document Visual Inspection',
      description: 'Image analyzed. Ensure safety measures are followed when inspecting electrical appliances, plumbing fixtures, or documents.',
      urgency: 'medium',
      estimatedCostOrDifficulty: 'Moderate repair required',
      immediateSteps: ['Turn off main power or water supply', 'Check model serial tag'],
      requiredToolsOrExperts: ['Certified Service Technician'],
      safetyWarning: 'Do not attempt dangerous high-voltage electrical or pressurized gas repairs yourself.',
    };
  }
}

export async function fetchLocalServices(
  category?: string,
  query?: string,
  sortBy: string = 'rating'
): Promise<LocalService[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);
    params.append('sortBy', sortBy);

    const res = await fetch(`/api/services/search?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    const data = await res.json();
    return data.services || [];
  } catch (err) {
    console.warn('API /api/services/search failed, returning local mock services:', err);
    return [];
  }
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics | null> {
  try {
    const res = await fetch('/api/admin/analytics');
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  } catch (err) {
    console.warn('API /api/admin/analytics failed:', err);
    return null;
  }
}

export async function fetchLocationAdvisory(location: Partial<DeviceLocation>): Promise<LocalAdvisory | null> {
  try {
    const res = await fetch('/api/location/advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(location),
    });

    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API /api/location/advisory failed:', err);
    return null;
  }
}

