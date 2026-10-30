export type ScamCategoryType =
  | "banking_upi"
  | "digital_arrest"
  | "investment_trading"
  | "shopping_courier"
  | "social_identity"
  | "job_recruitment"
  | "other";

export type Language = "en" | "hi";

export interface AuthorityInfo {
  id: string;
  name: string;
  nameHi: string;
  category: "cybercrime" | "banking_regulator" | "securities" | "consumer" | "telecom" | "social_platform";
  description: string;
  descriptionHi: string;
  whyContact: string;
  whyContactHi: string;
  officialWebsite: string;
  phoneHelpline?: string;
  operatingHours?: string;
  operatingHoursHi?: string;
  requiredDocuments: string[];
  requiredDocumentsHi: string[];
  stepByStepGuide: string[];
  stepByStepGuideHi: string[];
  importantNotice?: string;
  importantNoticeHi?: string;
  isGovernment: boolean;
}

export interface ScamCategoryDetail {
  id: ScamCategoryType;
  title: string;
  titleHi: string;
  iconName: string;
  badge: string;
  badgeHi: string;
  shortDescription: string;
  shortDescriptionHi: string;
  legalReality: string;
  legalRealityHi: string;
  urgentGoldenHourNote?: string;
  urgentGoldenHourNoteHi?: string;
  primaryAuthorityIds: string[];
  secondaryAuthorityIds: string[];
  immediateSteps: {
    id: string;
    title: string;
    titleHi: string;
    detail: string;
    detailHi: string;
    critical: boolean;
  }[];
  evidenceChecklist: {
    id: string;
    label: string;
    labelHi: string;
    required: boolean;
  }[];
}

export interface EvidenceDraft {
  victimName?: string;
  victimContact?: string;
  incidentDate: string;
  scamCategory: ScamCategoryType;
  amountLost: string;
  bankName: string;
  transactionIds: string;
  utrNumbers: string;
  scammerPhones: string;
  scammerEmails: string;
  scammerUpiHandles: string;
  suspiciousUrls: string;
  platformUsed: string;
  incidentDescription: string;
}

export interface ComplaintRecord {
  id: string;
  acknowledgementNumber: string;
  authorityName: string;
  portalUrl: string;
  category: ScamCategoryType;
  dateFiled: string;
  amountReported: string;
  status: "Draft" | "Filed / Pending" | "Under Investigation" | "Resolved" | "Escalated";
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

