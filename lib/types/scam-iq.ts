export type ScamIqMode = "home" | "quiz" | "drill" | "redflag" | "results";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  attackVector: string;
  educationalTip: string;
}

export interface QuizScenario {
  id: string;
  title: string;
  category: "crypto_fraud" | "courier_phishing" | "digital_arrest" | "utility_urgency" | "job_task_scam";
  badge: string;
  sender: string;
  timestamp: string;
  artifactType: "sms" | "chat" | "email" | "notice";
  artifactContent: string;
  artifactUrl?: string;
  warningSignals: string[];
  questions: QuizQuestion[];
}

export interface DrillItem {
  id: string;
  type: "scam" | "legit";
  title: string;
  sender: string;
  content: string;
  url?: string;
  category: string;
  explanation: string;
  keyIndicators: string[];
}

export interface RedFlagElement {
  id: string;
  label: string;
  section: "sender" | "greeting" | "body" | "link" | "action" | "attachment" | "footer";
  displayText: string;
  isRedFlag: boolean;
  threatType?: string;
  rationale: string;
}

export interface RedFlagArtifact {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  artifactType: "sms" | "email" | "portal";
  description: string;
  elements: RedFlagElement[];
  totalRedFlags: number;
}

export interface ScamIqScoreCard {
  quizScore: number;       // Max 100
  drillScore: number;      // Max 100
  redFlagScore: number;    // Max 100
  totalScore: number;      // Max 300
  tier: "Grandmaster" | "Vigilant" | "Cautious" | "Vulnerable";
  timestamp: number;
}

