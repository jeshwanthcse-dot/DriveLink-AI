/**
 * types/trust.ts
 * Trust & Verification Engine — Domain types
 * Sprint 9 — DriveLink AI
 */

export type DocumentType = "license" | "insurance" | "rc" | "puc" | "photo";

export type VerificationStatus = "missing" | "pending" | "verified" | "rejected" | "expires_soon";

export interface DocumentHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface DriverDocument {
  type: DocumentType;
  fileName: string | null;
  status: VerificationStatus;
  expiryDate: string | null;
  confidenceScore: number | null; // Simulated OCR confidence
  imageUrl: string | null;
  history: DocumentHistoryEntry[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export interface TrustProfile {
  driverId: string;
  trustScore: number;
  verificationLevel: "unverified" | "basic" | "vetted" | "elite";
  achievements: Achievement[];
  documents: Record<DocumentType, DriverDocument>;
}

export interface SafetyReview {
  id: string;
  orgName: string;
  rating: number;
  comment: string;
  date: string;
}
