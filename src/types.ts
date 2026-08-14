export type ProblemCategory =
  | 'scam'
  | 'repair'
  | 'health'
  | 'government'
  | 'travel'
  | 'bills'
  | 'shopping'
  | 'banking'
  | 'legal'
  | 'education'
  | 'general';

export type ScamSource = 'sms' | 'whatsapp' | 'email' | 'screenshot' | 'upi';

export interface ScamAnalysisResult {
  threatLevel: 'SAFE' | 'SUSPICIOUS' | 'CRITICAL_SCAM';
  riskScore: number; // 0 to 100
  scamType: string;
  redFlags: string[];
  explanation: string;
  safetySteps: string[];
  recommendedAction: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  store: 'Amazon' | 'Flipkart';
  price: string;
  rating: number;
  badge?: string;
  url: string;
  commission: string;
  image?: string;
}

export interface ImageAnalysisResult {
  detectedType: 'appliance' | 'bill' | 'medicine' | 'document' | 'error_code' | 'product' | 'general';
  problemTitle: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCostOrDifficulty: string;
  immediateSteps: string[];
  requiredToolsOrExperts: string[];
  safetyWarning?: string;
  affiliateProducts?: AffiliateProduct[];
}

export interface LocalService {
  id: string;
  name: string;
  category: ProblemCategory | 'plumber' | 'electrician' | 'doctor' | 'tutor' | 'mechanic' | 'restaurant' | 'lawyer' | 'government';
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  hourlyRate: string;
  phone: string;
  address: string;
  verified: boolean;
  availability: 'Available Now' | 'In 1 hour' | 'Next Day' | 'Busy';
  image: string;
  description: string;
  tags: string[];
  lat: number;
  lng: number;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  neighborhood?: string;
  formattedAddress: string;
  isLiveGps: boolean;
  lastUpdated: string;
}

export interface LocalAdvisory {
  activeScams: {
    title: string;
    description: string;
    urgency: 'high' | 'medium';
    commonTargets: string;
    prevention: string;
  }[];
  utilityAndGovt: {
    electricityBoard: string;
    waterAuthority: string;
    cyberCellNumber: string;
    emergencyNumber: string;
    consumerHelpline: string;
  };
  climateAndHomeWarnings: {
    title: string;
    tip: string;
    type: 'rain' | 'heat' | 'water_quality' | 'general';
  }[];
  nearestEmergencyHubs: {
    name: string;
    type: 'Police / Cyber Cell' | '24/7 Hospital' | 'Fire Station';
    distance: string;
    phone: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'premium';
  authProvider: 'google' | 'apple' | 'email' | 'guest';
  location: string;
  familyMembersCount: number;
  joinedDate: string;
  savedCount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'scam' | 'bill' | 'govt' | 'weather' | 'subscription';
  urgency: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
  actionText?: string;
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'family' | 'service' | 'conversation' | 'vehicle_home';
  title: string;
  detail: string;
  lastUpdated: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  activeChatsToday: number;
  scamsBlocked: number;
  verifiedProviders: number;
  monthlyRevenue: number;
  monthlyRevenueInr: number;
  leadCommissionEarned: number;
  affiliateCommissionEarned: number;
  payoutStatus: 'ready' | 'processing' | 'paid';
  payoutUpiOrAccount: string;
  aiQueriesByCategory: { category: string; count: number }[];
  scamThreatLog: { id: string; user: string; type: string; score: number; date: string; status: string }[];
  providerModerationList: { id: string; name: string; category: string; rating: number; status: 'verified' | 'pending' | 'flagged' }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: ProblemCategory;
  image?: string;
  audioUrl?: string;
  isVoiceInput?: boolean;
  scamAnalysis?: ScamAnalysisResult;
  imageAnalysis?: ImageAnalysisResult;
  suggestedServices?: LocalService[];
}

export interface SubscriptionPlan {
  id: 'free' | 'premium' | 'family' | 'society';
  name: string;
  tagline?: string;
  priceMonthlyInr: string;
  priceYearlyInr: string;
  priceMonthlyUsd: string;
  priceYearlyUsd: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}
