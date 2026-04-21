export type SectionId = 'signal' | 'dossiers' | 'reporter' | 'demandes' | 'decider' | 'admin';

export type RecommendationTone = 'dismiss' | 'warn' | 'keep';

export type Official = {
  id: number;
  name: string;
  position: string;
  group: string;
  score: number;
  reports: number;
  lastReport: string;
  avatar: string;
  ministry: string;
  trend: number;
  province: string;
  brief: string;
  sourceUrl: string;
};

export type Report = {
  id: string;
  officialId: number;
  actionDate: string;
  province: string;
  action: string;
  impact: string;
  rating: number;
  category: string;
  status: 'En attente de vérification' | 'Vérifié' | 'Rejeté';
  verifiedBy?: string;
  verifiedAt?: string;
};

export type Recommendation = {
  label: 'À démettre' | 'Sous avertissement' | 'À maintenir' | 'À documenter';
  tone: RecommendationTone;
  rationale: string;
};
