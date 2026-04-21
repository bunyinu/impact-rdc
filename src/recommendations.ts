import type { Official, Recommendation } from './types';

const toneWeight = {
  dismiss: 0,
  warn: 1,
  keep: 2,
};

export function getRecommendation(official: Official): Recommendation {
  if (official.reports === 0) {
    return {
      label: 'À documenter',
      tone: 'keep',
      rationale: 'Aucune preuve vérifiée dans cette instance locale: impossible de recommander un renvoi.',
    };
  }

  const negativeReports = Math.floor(official.reports * 0.62);

  if (official.score <= -5 || (official.reports >= 150 && official.trend <= -1)) {
    return {
      label: 'À démettre',
      tone: 'dismiss',
      rationale: `${negativeReports} griefs lourds estimés, tendance dégradée et coût politique devenu élevé.`,
    };
  }

  if (official.score <= -2 || official.trend < -0.4) {
    return {
      label: 'Sous avertissement',
      tone: 'warn',
      rationale: `${negativeReports} griefs estimés et dynamique de détérioration exigeant une correction rapide.`,
    };
  }

  return {
    label: 'À maintenir',
    tone: 'keep',
    rationale: `${negativeReports} griefs estimés, sans motif public suffisant pour justifier un renvoi immédiat.`,
  };
}

export function rankOfficials(officials: Official[]): Official[] {
  return officials.toSorted((a, b) => {
    const aRecommendation = getRecommendation(a);
    const bRecommendation = getRecommendation(b);
    const decisionDiff = toneWeight[aRecommendation.tone] - toneWeight[bRecommendation.tone];

    if (decisionDiff !== 0) return decisionDiff;
    if (a.score !== b.score) return a.score - b.score;
    return b.reports - a.reports;
  });
}

export function getHotspotMinistry(officials: Official[]): string {
  const totals = new Map<string, number>();

  for (const official of officials) {
    if (official.reports === 0) continue;
    totals.set(official.ministry, (totals.get(official.ministry) ?? 0) + official.reports);
  }

  return [...totals.entries()].toSorted((a, b) => b[1] - a[1])[0]?.[0] ?? 'Aucun signalement';
}

export function getAverageScore(officials: Official[]): number {
  if (!officials.length) return 0;
  return officials.reduce((sum, official) => sum + official.score, 0) / officials.length;
}
