/**
 * store/trust-store.ts
 * Zustand store for Trust & Verification Engine
 * Sprint 9 — DriveLink AI
 */

"use client";

import { create } from "zustand";
import {
  TrustProfile,
  DriverDocument,
  DocumentType,
  VerificationStatus,
  Achievement,
  SafetyReview,
} from "@/types/trust";
import { useAppStore } from "./app-store";

interface TrustState {
  profiles: Record<string, TrustProfile>;
  reviews: Record<string, SafetyReview[]>;

  // ─── Actions ──────────────────────────────────────────────────────────────
  getProfile: (driverId: string) => TrustProfile;
  uploadDocument: (driverId: string, type: DocumentType, fileName: string, imageUrl: string) => void;
  runSimulatedOCR: (driverId: string, type: DocumentType) => Promise<void>;
  verifyDocument: (driverId: string, type: DocumentType, expiryDate?: string) => void;
  rejectDocument: (driverId: string, type: DocumentType, reason: string) => void;
  resetProfile: (driverId: string) => void;
  addReview: (driverId: string, review: SafetyReview) => void;
  getReviews: (driverId: string) => SafetyReview[];

  // Persistence
  loadFromStorage: () => void;
}

const STORAGE_KEY = "drivelink_trust_engine";

// Default achievements mock data
const defaultAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "100 Runs Club",
    description: "Completed more than 100 successful express shipments.",
    unlockedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    icon: "🏆",
  },
  {
    id: "ach-2",
    title: "Safety Champion",
    description: "Maintained a safety rating above 4.85 for 3 consecutive months.",
    unlockedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    icon: "🛡️",
  },
  {
    id: "ach-3",
    title: "Vetted Premium Carrier",
    description: "All registered credentials successfully verified by OCR audit.",
    unlockedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    icon: "💎",
  },
];

// Helper to construct empty/initial profiles
const createInitialProfile = (driverId: string): TrustProfile => {
  const isMiller = driverId === "DRV-001";
  
  // Set deterministic expiries for David Miller
  const licenseExpiry = isMiller ? new Date(Date.now() + 12 * 86400000).toISOString() : null; // Expiration in 12 days
  const insuranceExpiry = isMiller ? new Date(Date.now() + 280 * 86400000).toISOString() : null; // 280 days
  const rcExpiry = isMiller ? new Date(Date.now() + 4 * 86400000).toISOString() : null; // Expiration in 4 days
  const pucExpiry = null;

  return {
    driverId,
    trustScore: isMiller ? 78 : 45, // default starting score
    verificationLevel: isMiller ? "vetted" : "basic",
    achievements: isMiller ? defaultAchievements.slice(0, 2) : [],
    documents: {
      license: {
        type: "license",
        fileName: isMiller ? "driver_license_miller.pdf" : null,
        status: isMiller ? "expires_soon" : "missing",
        expiryDate: licenseExpiry,
        confidenceScore: isMiller ? 0.94 : null,
        imageUrl: isMiller ? "/assets/documents/license-mock.jpg" : null,
        history: isMiller ? [{ id: "h-1", timestamp: new Date(Date.now() - 120 * 86400000).toISOString(), action: "OCR Verified", details: "Document approved with 94% OCR matching confidence." }] : [],
      },
      insurance: {
        type: "insurance",
        fileName: isMiller ? "insurance_commercial_apex.pdf" : null,
        status: isMiller ? "verified" : "missing",
        expiryDate: insuranceExpiry,
        confidenceScore: isMiller ? 0.97 : null,
        imageUrl: isMiller ? "/assets/documents/insurance-mock.jpg" : null,
        history: isMiller ? [{ id: "h-2", timestamp: new Date(Date.now() - 120 * 86400000).toISOString(), action: "OCR Verified", details: "Commercial liability checked." }] : [],
      },
      rc: {
        type: "rc",
        fileName: isMiller ? "vehicle_registration_rc.png" : null,
        status: isMiller ? "expires_soon" : "missing",
        expiryDate: rcExpiry,
        confidenceScore: isMiller ? 0.91 : null,
        imageUrl: isMiller ? "/assets/documents/rc-mock.jpg" : null,
        history: isMiller ? [{ id: "h-3", timestamp: new Date(Date.now() - 120 * 86400000).toISOString(), action: "OCR Verified", details: "Registration plate verified." }] : [],
      },
      puc: {
        type: "puc",
        fileName: null,
        status: "missing",
        expiryDate: pucExpiry,
        confidenceScore: null,
        imageUrl: null,
        history: [],
      },
      photo: {
        type: "photo",
        fileName: isMiller ? "profile_miller_vetted.jpg" : null,
        status: isMiller ? "verified" : "missing",
        expiryDate: null,
        confidenceScore: isMiller ? 0.99 : null,
        imageUrl: isMiller ? "/assets/documents/photo-mock.jpg" : null,
        history: isMiller ? [{ id: "h-4", timestamp: new Date(Date.now() - 120 * 86400000).toISOString(), action: "OCR Verified", details: "Face matching check successful." }] : [],
      },
    },
  };
};

const defaultReviews: Record<string, SafetyReview[]> = {
  "DRV-001": [
    {
      id: "rev_1",
      orgName: "Apex Global Logistics",
      rating: 5,
      comment: "Excellent delivery speed. Cargo loaded and verified. Highly professional carrier.",
      date: "June 15, 2026",
    },
    {
      id: "rev_2",
      orgName: "Fresh Foods Distribution",
      rating: 5,
      comment: "Vetted temperature-controlled compliance checklist was fully handled. Great communication.",
      date: "June 14, 2026",
    },
    {
      id: "rev_3",
      orgName: "BioPharma Express",
      rating: 4,
      comment: "Reliable trip routing. Slight delay due to city rush hour gridlock.",
      date: "June 10, 2026",
    },
  ],
};

const recalculateTrustProfile = (profile: TrustProfile, driverRating = 4.9, completedDeliveries = 118): TrustProfile => {
  // Score formula:
  // - 40% rating: (rating / 5) * 40
  // - 10% completed runs: clamp(completed / 120, 0, 1) * 10
  // - 50% documents: 10 points per verified doc, 8 points per expires_soon doc, 4 points per pending doc.
  const ratingScore = (driverRating / 5) * 40;
  const completedScore = Math.min(1, completedDeliveries / 120) * 10;
  
  let docScore = 0;
  let verifiedCount = 0;

  Object.values(profile.documents).forEach((doc) => {
    if (doc.status === "verified") {
      docScore += 10;
      verifiedCount++;
    } else if (doc.status === "expires_soon") {
      docScore += 8;
      verifiedCount++;
    } else if (doc.status === "pending") {
      docScore += 4;
    }
  });

  const trustScore = Math.round(ratingScore + completedScore + docScore);

  // Determine verification tier level
  let verificationLevel: TrustProfile["verificationLevel"] = "unverified";
  if (verifiedCount === 5) {
    verificationLevel = "elite";
  } else if (verifiedCount >= 3) {
    verificationLevel = "vetted";
  } else if (verifiedCount >= 1) {
    verificationLevel = "basic";
  }

  // Update achievements
  const achievements = [...profile.achievements];
  if (verificationLevel === "elite" && !achievements.some((a) => a.id === "ach-3")) {
    achievements.push(defaultAchievements[2]);
  }

  return {
    ...profile,
    trustScore,
    verificationLevel,
    achievements,
  };
};

const saveToLocalStorage = (profiles: Record<string, TrustProfile>, reviews: Record<string, SafetyReview[]>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles, reviews }));
  } catch (e) {
    console.error("Failed to save trust data to localStorage", e);
  }
};

// Initial profiles map
const initialProfiles: Record<string, TrustProfile> = {};
["DRV-001", "DRV-002", "DRV-003", "DRV-004", "DRV-005", "DRV-006", "DRV-007", "DRV-008", "DRV-009", "DRV-010"].forEach((id) => {
  initialProfiles[id] = recalculateTrustProfile(createInitialProfile(id));
});

export const useTrustStore = create<TrustState>((set, get) => ({
  profiles: initialProfiles,
  reviews: defaultReviews,

  getProfile: (driverId) => {
    const state = get();
    if (!state.profiles[driverId]) {
      return recalculateTrustProfile(createInitialProfile(driverId));
    }
    return state.profiles[driverId];
  },

  uploadDocument: (driverId, type, fileName, imageUrl) => {
    set((state) => {
      const profile = state.profiles[driverId] || createInitialProfile(driverId);
      const existingDoc = profile.documents[type];

      const newHistory = [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "Document Uploaded",
          details: `Uploaded file: "${fileName}". Triggering automated verification.`,
        },
        ...existingDoc.history,
      ];

      const updatedDoc: DriverDocument = {
        ...existingDoc,
        fileName,
        imageUrl,
        status: "pending",
        confidenceScore: null,
        history: newHistory,
      };

      const nextProfile = {
        ...profile,
        documents: {
          ...profile.documents,
          [type]: updatedDoc,
        },
      };

      // Recalculate trust stats
      const recalculated = recalculateTrustProfile(nextProfile);

      const nextProfiles = { ...state.profiles, [driverId]: recalculated };
      saveToLocalStorage(nextProfiles, state.reviews);
      return { profiles: nextProfiles };
    });

    // Notify uploaded in appStore
    setTimeout(() => {
      useAppStore.getState().addNotification(
        "Document Center",
        `New document "${fileName}" uploaded. OCR scan started.`,
        "driver",
        "info"
      );
    }, 100);
  },

  runSimulatedOCR: async (driverId, type) => {
    // 1.5s simulated OCR delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const state = get();
    const profile = state.profiles[driverId];
    if (!profile) return;

    const doc = profile.documents[type];
    if (doc.status !== "pending") return;

    // Simulate OCR results
    const randomConfidence = parseFloat((0.88 + Math.random() * 0.11).toFixed(2));
    const isApproved = randomConfidence >= 0.90;
    
    set((prev) => {
      const activeProf = prev.profiles[driverId];
      const activeDoc = activeProf.documents[type];
      
      const status: VerificationStatus = isApproved ? "verified" : "rejected";
      const ocrAction = isApproved ? "OCR Verified" : "OCR Rejected";
      const ocrDetails = isApproved
        ? `OCR metadata matching successful. Confidence score: ${Math.round(randomConfidence * 100)}%.`
        : `OCR check failed. Text mapping illegible or mismatching credentials.`;

      // Set expiry date to 1 year from now if verified
      const newExpiry = isApproved ? new Date(Date.now() + 365 * 86400000).toISOString() : null;

      const newHistory = [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: ocrAction,
          details: ocrDetails,
        },
        ...activeDoc.history,
      ];

      const updatedDoc: DriverDocument = {
        ...activeDoc,
        status,
        confidenceScore: randomConfidence,
        expiryDate: newExpiry,
        history: newHistory,
      };

      const nextProfile = {
        ...activeProf,
        documents: {
          ...activeProf.documents,
          [type]: updatedDoc,
        },
      };

      const recalculated = recalculateTrustProfile(nextProfile);
      const nextProfiles = { ...prev.profiles, [driverId]: recalculated };
      saveToLocalStorage(nextProfiles, prev.reviews);
      return { profiles: nextProfiles };
    });

    // Notify ocr result
    setTimeout(() => {
      useAppStore.getState().addNotification(
        isApproved ? "Verification Success" : "Verification Failed",
        isApproved
          ? `OCR Scan verified your document "${doc.fileName}" successfully (Confidence: ${Math.round(randomConfidence * 100)}%).`
          : `OCR Scan rejected your document "${doc.fileName}" due to poor visibility. Please retry.`,
        "driver",
        isApproved ? "success" : "warning"
      );
    }, 100);
  },

  verifyDocument: (driverId, type, expiryDate) => {
    set((state) => {
      const profile = state.profiles[driverId] || createInitialProfile(driverId);
      const doc = profile.documents[type];

      const newHistory = [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "OCR Verified",
          details: `Manual admin trigger: marked as verified.`,
        },
        ...doc.history,
      ];

      const updatedDoc: DriverDocument = {
        ...doc,
        status: "verified",
        confidenceScore: 0.95,
        expiryDate: expiryDate || new Date(Date.now() + 365 * 86400000).toISOString(),
        history: newHistory,
      };

      const nextProfile = {
        ...profile,
        documents: {
          ...profile.documents,
          [type]: updatedDoc,
        },
      };

      const recalculated = recalculateTrustProfile(nextProfile);
      const nextProfiles = { ...state.profiles, [driverId]: recalculated };
      saveToLocalStorage(nextProfiles, state.reviews);
      return { profiles: nextProfiles };
    });
  },

  rejectDocument: (driverId, type, reason) => {
    set((state) => {
      const profile = state.profiles[driverId] || createInitialProfile(driverId);
      const doc = profile.documents[type];

      const newHistory = [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: "OCR Rejected",
          details: `Rejected due to: ${reason}`,
        },
        ...doc.history,
      ];

      const updatedDoc: DriverDocument = {
        ...doc,
        status: "rejected",
        confidenceScore: 0.72,
        history: newHistory,
      };

      const nextProfile = {
        ...profile,
        documents: {
          ...profile.documents,
          [type]: updatedDoc,
        },
      };

      const recalculated = recalculateTrustProfile(nextProfile);
      const nextProfiles = { ...state.profiles, [driverId]: recalculated };
      saveToLocalStorage(nextProfiles, state.reviews);
      return { profiles: nextProfiles };
    });
  },

  resetProfile: (driverId) => {
    set((state) => {
      const initial = createInitialProfile(driverId);
      const recalculated = recalculateTrustProfile(initial);
      const nextProfiles = { ...state.profiles, [driverId]: recalculated };
      saveToLocalStorage(nextProfiles, state.reviews);
      return { profiles: nextProfiles };
    });
  },

  addReview: (driverId, review) => {
    set((state) => {
      const driverReviews = state.reviews[driverId] || [];
      const updatedReviews = [review, ...driverReviews];
      const nextReviews = { ...state.reviews, [driverId]: updatedReviews };

      // Recalculate profile trust score based on new review
      const profile = state.profiles[driverId];
      if (profile) {
        // Average rating calculation
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRating / updatedReviews.length;
        
        const recalculated = recalculateTrustProfile(profile, avgRating, 118 + updatedReviews.length - 3);
        const nextProfiles = { ...state.profiles, [driverId]: recalculated };
        saveToLocalStorage(nextProfiles, nextReviews);
        return { profiles: nextProfiles, reviews: nextReviews };
      }

      saveToLocalStorage(state.profiles, nextReviews);
      return { reviews: nextReviews };
    });
  },

  getReviews: (driverId) => {
    return get().reviews[driverId] || [];
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.profiles) {
          // Merge loaded profiles with default initial profiles
          const mergedProfiles = { ...initialProfiles };
          Object.entries(parsed.profiles).forEach(([driverId, p]: [string, any]) => {
            if (p && typeof p === "object") {
              mergedProfiles[driverId] = {
                ...mergedProfiles[driverId],
                ...p,
                achievements: p.achievements || mergedProfiles[driverId]?.achievements || [],
                documents: p.documents 
                  ? { ...mergedProfiles[driverId]?.documents, ...p.documents } 
                  : mergedProfiles[driverId]?.documents,
              } as TrustProfile;
            }
          });

          set({
            profiles: mergedProfiles,
            reviews: parsed.reviews || defaultReviews,
          });

          // Scan for expiring documents
          Object.entries(parsed.profiles).forEach(([driverId, p]: [string, any]) => {
            Object.values(p.documents).forEach((d: any) => {
              if (d.status === "expires_soon" && d.expiryDate) {
                const days = Math.ceil((new Date(d.expiryDate).getTime() - Date.now()) / 86400000);
                const docLabel = d.type === "license" ? "Driving License" : d.type === "rc" ? "Vehicle RC" : d.type.toUpperCase();
                const msg = `Your ${docLabel} expires in ${days} days. Please renew it soon!`;
                const exists = useAppStore.getState().notifications.some((n) => n.message === msg);
                if (!exists) {
                  useAppStore.getState().addNotification("Expires Soon", msg, "driver", "warning");
                }
              }
            });
          });
        }
      }
    } catch (e) {
      console.error("Failed to load trust data from localStorage", e);
    }
  },
}));
