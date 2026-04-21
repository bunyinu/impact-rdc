import { useDeferredValue, useEffect, useState, useTransition, type FormEvent } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FilePlus2,
  Landmark,
  Megaphone,
  Search,
  ShieldCheck,
  Signature,
  X,
} from 'lucide-react';
import { initialOfficials, officialSourceUrl, provinces, reportCategories } from './data';
import { getAverageScore, getHotspotMinistry, getRecommendation, rankOfficials } from './recommendations';
import type { Official, Report, SectionId } from './types';

const storageKey = 'impact-rdc-state-v3';
const adminSessionKey = 'impact-rdc-admin-session-v1';
const verificationDesk = 'Cellule éditoriale Impact RDC';
const adminUsername = String(import.meta.env.VITE_ADMIN_USERNAME ?? '').trim();
const adminPassword = String(import.meta.env.VITE_ADMIN_PASSWORD ?? import.meta.env.VITE_REVIEWER_CODE ?? '').trim();
const adminConfigured = adminUsername.length > 0 && adminPassword.length > 0;

type StoredState = {
  officials: Official[];
  reports: Report[];
  signatures: number;
};

type AdminLoginFields = {
  username: string;
  password: string;
};

const navItems: Array<{ id: SectionId; label: string }> = [
  { id: 'signal', label: 'Signal national' },
  { id: 'dossiers', label: 'Dossiers publics' },
  { id: 'reporter', label: 'Portail preuves' },
  { id: 'demandes', label: 'Demandes de renvoi' },
  { id: 'decider', label: 'À décider' },
];

function getInitialSection(): SectionId {
  return window.location.hash === '#admin' ? 'admin' : 'signal';
}

function loadAdminSession() {
  return window.sessionStorage.getItem(adminSessionKey) === 'unlocked';
}

function createReportId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return `report-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function applyVerifiedReports(reports: Report[]) {
  const officialsById = new Map(initialOfficials.map((official) => [official.id, { ...official }]));
  const verifiedReports = reports
    .filter((report) => report.status === 'Vérifié')
    .toSorted((left, right) => new Date(left.actionDate).getTime() - new Date(right.actionDate).getTime());

  for (const report of verifiedReports) {
    const official = officialsById.get(report.officialId);
    if (!official) continue;

    officialsById.set(report.officialId, {
      ...official,
      score: Number(((official.score * 0.82) + (report.rating * 0.18)).toFixed(1)),
      trend: Number(((official.trend * 0.6) + (report.rating / 8)).toFixed(1)),
      reports: official.reports + 1,
      province: report.province,
      lastReport: report.actionDate,
    });
  }

  return initialOfficials.map((official) => officialsById.get(official.id) ?? official);
}

function loadStoredState(): StoredState {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) throw new Error('no saved state');
    const parsed = JSON.parse(raw) as StoredState;
    const reports = Array.isArray(parsed.reports) ? parsed.reports : [];
    return {
      officials: applyVerifiedReports(reports),
      reports,
      signatures: Number.isFinite(parsed.signatures) ? parsed.signatures : 87439,
    };
  } catch {
    return { officials: initialOfficials, reports: [], signatures: 87439 };
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

function toneClass(tone: ReturnType<typeof getRecommendation>['tone']) {
  if (tone === 'dismiss') return 'tone-dismiss';
  if (tone === 'warn') return 'tone-warn';
  return 'tone-keep';
}

function statusClass(status: Report['status']) {
  if (status === 'Vérifié') return 'verified';
  if (status === 'Rejeté') return 'rejected';
  return '';
}

export function App() {
  const [storedState, setStoredState] = useState(loadStoredState);
  const [section, setSection] = useState<SectionId>(getInitialSection);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [ministry, setMinistry] = useState('Tous');
  const [reportOpen, setReportOpen] = useState(false);
  const [adminLogin, setAdminLogin] = useState<AdminLoginFields>({ username: '', password: '' });
  const [reviewerUnlocked, setReviewerUnlocked] = useState(loadAdminSession);
  const [toast, setToast] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const rankedOfficials = rankOfficials(storedState.officials);
  const topOfficial = rankedOfficials[0];
  const topRecommendation = getRecommendation(topOfficial);
  const ministries = ['Tous', ...new Set(storedState.officials.map((official) => official.ministry))];
  const visibleOfficials = rankOfficials(
    storedState.officials.filter((official) => {
      const matchesMinistry = ministry === 'Tous' || official.ministry === ministry;
      const text = `${official.name} ${official.position} ${official.ministry} ${official.group} ${official.province}`.toLowerCase();
      return matchesMinistry && text.includes(deferredQuery.trim().toLowerCase());
    }),
  );
  const dismissCount = storedState.officials.filter((official) => getRecommendation(official).tone === 'dismiss').length;
  const warnCount = storedState.officials.filter((official) => getRecommendation(official).tone === 'warn').length;
  const hotspot = getHotspotMinistry(storedState.officials);
  const demandPercent = Math.min(100, Math.round((storedState.signatures / 100000) * 100));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(storedState));
  }, [storedState]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function syncAdminHash() {
      if (window.location.hash === '#admin') {
        setSection('admin');
      }
    }

    window.addEventListener('hashchange', syncAdminHash);
    return () => window.removeEventListener('hashchange', syncAdminHash);
  }, []);

  function changeSection(nextSection: SectionId) {
    startTransition(() => {
      setSection(nextSection);
      if (nextSection !== 'admin' && window.location.hash === '#admin') {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
      setMobileOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function submitReport(report: Omit<Report, 'id' | 'status'>) {
    setStoredState((current) => {
      const official = initialOfficials.find((entry) => entry.id === report.officialId);
      if (!official) return current;
      const reports = [{ ...report, id: createReportId(), status: 'En attente de vérification' as const }, ...current.reports];

      return {
        ...current,
        officials: applyVerifiedReports(reports),
        reports,
      };
    });

    setToast('Preuve ajoutée au dossier. Elle reste en attente de vérification.');
    setReportOpen(false);
  }

  function supportDemand() {
    const increase = Math.floor(Math.random() * 900) + 250;
    setStoredState((current) => ({ ...current, signatures: current.signatures + increase }));
    setToast('Votre soutien a été enregistré sur la demande de renvoi.');
  }

  function reviewReport(reportId: string, status: Report['status']) {
    if (!reviewerUnlocked) {
      setToast('Accès vérificateur requis.');
      return;
    }

    setStoredState((current) => {
      const reports = current.reports.map((report) => {
        if (report.id !== reportId) return report;
        if (status === 'En attente de vérification') {
          const { verifiedAt, verifiedBy, ...pendingReport } = report;
          return { ...pendingReport, status };
        }
        return {
          ...report,
          status,
          verifiedBy: verificationDesk,
          verifiedAt: new Date().toISOString(),
        };
      });

      return {
        ...current,
        officials: applyVerifiedReports(reports),
        reports,
      };
    });
    const reviewMessage =
      status === 'Vérifié'
        ? 'Signalement marqué vérifié.'
        : status === 'Rejeté'
          ? 'Signalement rejeté par la file locale.'
          : 'Signalement remis en attente de vérification.';
    setToast(reviewMessage);
  }

  function unlockReviewer(event: FormEvent) {
    event.preventDefault();
    if (!adminConfigured) {
      setToast('Identifiants admin non configurés côté serveur.');
      return;
    }
    if (adminLogin.username.trim() !== adminUsername || adminLogin.password !== adminPassword) {
      setToast('Identifiants admin incorrects.');
      return;
    }
    setAdminLogin({ username: '', password: '' });
    window.sessionStorage.setItem(adminSessionKey, 'unlocked');
    setReviewerUnlocked(true);
    setToast('Session admin ouverte.');
  }

  function lockReviewer() {
    window.sessionStorage.removeItem(adminSessionKey);
    setReviewerUnlocked(false);
    setToast('Session admin verrouillée.');
  }

  return (
    <div className="app-shell">
      <Header
        section={section}
        mobileOpen={mobileOpen}
        onAddProof={() => changeSection('reporter')}
        onChangeSection={changeSection}
        onToggleMobile={() => setMobileOpen((value) => !value)}
      />

      <main>
        {section === 'signal' && (
          <SignalSection
            officials={rankedOfficials}
            topOfficial={topOfficial}
            topRecommendation={topRecommendation}
            dismissCount={dismissCount}
            hotspot={hotspot}
            averageScore={getAverageScore(storedState.officials)}
            onAddProof={() => changeSection('reporter')}
            onViewDecision={() => changeSection('decider')}
          />
        )}

        {section === 'dossiers' && (
          <DossiersSection
            officials={visibleOfficials}
            ministries={ministries}
            ministry={ministry}
            query={query}
            pending={isPending}
            onQuery={setQuery}
            onMinistry={setMinistry}
            onSelect={changeSection}
          />
        )}

        {section === 'reporter' && (
          <ReportPortalSection
            officials={storedState.officials}
            reports={storedState.reports}
            onSubmit={submitReport}
          />
        )}

        {section === 'admin' && (
          <AdminPortalSection
            officials={storedState.officials}
            adminConfigured={adminConfigured}
            adminLogin={adminLogin}
            onAdminLoginChange={setAdminLogin}
            onReviewerLock={lockReviewer}
            onReviewerLogin={unlockReviewer}
            onReview={reviewReport}
            reports={storedState.reports}
            reviewerUnlocked={reviewerUnlocked}
          />
        )}

        {section === 'demandes' && (
          <DemandesSection
            topOfficial={topOfficial}
            demandPercent={demandPercent}
            signatures={storedState.signatures}
            onSupport={supportDemand}
          />
        )}

        {section === 'decider' && (
          <DecisionSection
            rankedOfficials={rankedOfficials}
            dismissCount={dismissCount}
            warnCount={warnCount}
            hotspot={hotspot}
            latestDate={storedState.reports[0]?.actionDate ?? topOfficial.lastReport}
            onAddProof={() => setReportOpen(true)}
          />
        )}
      </main>

      {reportOpen && (
        <ReportModal officials={storedState.officials} onClose={() => setReportOpen(false)} onSubmit={submitReport} />
      )}

      <div className={`toast ${toast ? 'toast-visible' : ''}`}>
        <CheckCircle2 size={18} />
        <span>{toast}</span>
      </div>
    </div>
  );
}

function Header({
  section,
  mobileOpen,
  onAddProof,
  onChangeSection,
  onToggleMobile,
}: {
  section: SectionId;
  mobileOpen: boolean;
  onAddProof: () => void;
  onChangeSection: (section: SectionId) => void;
  onToggleMobile: () => void;
}) {
  const buttons = navItems.map((item) => (
    <button
      className={`nav-link ${section === item.id ? 'active' : ''}`}
      key={item.id}
      onClick={() => onChangeSection(item.id)}
      type="button"
    >
      {item.label}
    </button>
  ));

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={() => onChangeSection('signal')} type="button">
          <span className="brand-mark">IR</span>
          <span>
            <strong>Impact RDC</strong>
            <small>Dossiers publics</small>
          </span>
        </button>

        <nav className="desktop-nav">{buttons}</nav>

        <button className="nav-proof" onClick={onAddProof} type="button">
          <FilePlus2 size={18} />
          Ajouter une preuve
        </button>

        <button className="mobile-toggle" onClick={onToggleMobile} type="button">
          Menu
        </button>
      </div>

      {mobileOpen && <nav className="mobile-nav">{buttons}</nav>}
    </header>
  );
}

function SignalSection({
  officials,
  topOfficial,
  topRecommendation,
  dismissCount,
  hotspot,
  averageScore,
  onAddProof,
  onViewDecision,
}: {
  officials: Official[];
  topOfficial: Official;
  topRecommendation: ReturnType<typeof getRecommendation>;
  dismissCount: number;
  hotspot: string;
  averageScore: number;
  onAddProof: () => void;
  onViewDecision: () => void;
}) {
  return (
    <section className="screen signal-screen">
      <div className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <ShieldCheck size={16} />
            Liste officielle + preuves citoyennes
          </div>
          <h1>
            La liste officielle. La preuve décide <span>qui doit partir</span>.
          </h1>
          <p>
            Les membres du Gouvernement Suminwa 2 sont chargés depuis la Primature. Le public peut ajouter
            des preuves; la vue présidentielle ne recommande rien sans dossier vérifiable.
          </p>
          <div className="hero-actions">
            <button className="primary-action" onClick={onViewDecision} type="button">
              Ouvrir la vue présidentielle
            </button>
            <button className="secondary-action" onClick={onAddProof} type="button">
              Ajouter une preuve
            </button>
          </div>
        </div>

        <PriorityDiaporama officials={officials.slice(0, 7)} />
      </div>

      <div className="ticker">
        <span>Nommer</span>
        <span>Prouver</span>
        <span>Motiver</span>
        <span>Reddition des comptes en RDC</span>
        <span>Nommer</span>
        <span>Prouver</span>
        <span>Motiver</span>
      </div>

      <div className="metrics-grid">
        <Metric label="Membres suivis" value={String(initialOfficials.length)} />
        <Metric label="Portefeuille exposé" value={hotspot} />
        <Metric label="Risque moyen" value={averageScore.toFixed(1)} />
        <Metric label="Source" value="Primature" />
      </div>
    </section>
  );
}

function PriorityDiaporama({ officials }: { officials: Official[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOfficial = officials[activeIndex] ?? officials[0];
  const activeRecommendation = getRecommendation(activeOfficial);

  useEffect(() => {
    if (officials.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % officials.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [officials.length]);

  function changeSlide(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + officials.length) % officials.length);
  }

  return (
    <article className="poster-card diaporama-card">
      <img src={activeOfficial.avatar} alt={activeOfficial.name} />
      <div className="poster-overlay">
        <div className="stamp">{activeRecommendation.label}</div>
        <small className="slide-count">{String(activeIndex + 1).padStart(2, '0')} / {String(officials.length).padStart(2, '0')}</small>
        <h2>{activeOfficial.name}</h2>
        <p>{activeOfficial.position}</p>
        <strong>{activeOfficial.score.toFixed(1)}</strong>
        <small>{activeOfficial.brief}</small>
        <div className="diaporama-controls">
          <button onClick={() => changeSlide(-1)} type="button">Précédent</button>
          <div className="slide-dots">
            {officials.map((official, index) => (
              <button
                aria-label={`Afficher ${official.name}`}
                className={index === activeIndex ? 'active' : ''}
                key={official.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
          <button onClick={() => changeSlide(1)} type="button">Suivant</button>
        </div>
      </div>
    </article>
  );
}

function DossiersSection({
  officials,
  ministries,
  ministry,
  query,
  pending,
  onQuery,
  onMinistry,
}: {
  officials: Official[];
  ministries: string[];
  ministry: string;
  query: string;
  pending: boolean;
  onQuery: (value: string) => void;
  onMinistry: (value: string) => void;
  onSelect: (section: SectionId) => void;
}) {
  const top = officials[0];

  return (
    <section className="screen">
      <SectionHeader
        eyebrow="Registre national"
        title="Liste officielle des membres du Gouvernement Suminwa 2"
        text="Chaque membre part d'un dossier neutre. Les recommandations changent seulement quand une preuve est ajoutée et classée."
      />

      <div className="control-row">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Rechercher un nom, poste ou ministère" />
        </label>
        <select value={ministry} onChange={(event) => onMinistry(event.target.value)}>
          {ministries.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      {top && (
        <div className="memo">
          <div>
            <small>{top.reports > 0 ? 'Dossier le plus lourd' : 'Premier membre listé'}</small>
            <h3>{top.name}</h3>
            <p>{top.position}</p>
            <span>{top.brief}</span>
          </div>
          <div className="memo-question">
            <small>Source officielle</small>
            <strong>Primature RDC</strong>
            <a href={officialSourceUrl} rel="noreferrer" target="_blank">Vérifier la liste</a>
          </div>
        </div>
      )}

      <div className={`ledger ${pending ? 'pending' : ''}`}>
        {officials.map((official, index) => (
          <OfficialRow official={official} index={index} key={official.id} />
        ))}
      </div>
    </section>
  );
}

function DemandesSection({
  topOfficial,
  demandPercent,
  signatures,
  onSupport,
}: {
  topOfficial: Official;
  demandPercent: number;
  signatures: number;
  onSupport: () => void;
}) {
  return (
    <section className="screen">
      <SectionHeader
        eyebrow="Demande de renvoi"
        title="Transformer une preuve publique en demande officielle"
        text="Aucune demande de renvoi ne devrait partir sans faits, source, impact citoyen et seuil de soutien traçable."
      />

      <div className="demand-stage">
        <div className="demand-main">
          <small>{topOfficial.reports > 0 ? 'Demande n°2026-017' : 'Demande non ouverte'}</small>
          <h2>{topOfficial.reports > 0 ? `Renvoi demandé: ${topOfficial.position}` : 'Sélectionner un dossier après preuve'}</h2>
          <p>{topOfficial.name} • {topOfficial.brief}</p>
          <div className="evidence-chips">
            <span>Faits sourcés</span>
            <span>Impact citoyen</span>
            <span>Vérification requise</span>
          </div>
        </div>
        <div className="signature-box">
          <small>Signatures collectées</small>
          <strong>{signatures.toLocaleString('en-US')}</strong>
          <div className="progress">
            <span style={{ width: `${demandPercent}%` }} />
          </div>
          <p>{demandPercent}% de l’objectif de 100 000</p>
          <button className="primary-action" onClick={onSupport} type="button">
            <Signature size={18} />
            Soutenir cette demande
          </button>
        </div>
      </div>

      <div className="proof-grid">
        <ProofCard title="Motifs consolidés" text="Résumé des preuves, catégories et niveau de gravité du dossier public." />
        <ProofCard title="Vérification éditoriale" text="Contrôle manuel avant exposition comme recommandation de renvoi." />
        <ProofCard title="Seuil de pression publique" text="La demande reste ouverte jusqu’au seuil de transmission." />
      </div>
    </section>
  );
}

function DecisionSection({
  rankedOfficials,
  dismissCount,
  warnCount,
  hotspot,
  latestDate,
  onAddProof,
}: {
  rankedOfficials: Official[];
  dismissCount: number;
  warnCount: number;
  hotspot: string;
  latestDate: string;
  onAddProof: () => void;
}) {
  const top = rankedOfficials[0];

  return (
    <section className="screen">
      <div className="decision-header">
        <SectionHeader
          eyebrow="À décider"
          title="Vue présidentielle: qui décider, pourquoi, avec quelle preuve"
          text="La priorité monte avec les preuves et le score citoyen. Sans signalement vérifié, la décision attendue reste: documenter."
        />
        <button className="primary-action" onClick={onAddProof} type="button">
          <FilePlus2 size={18} />
          Ajouter une preuve
        </button>
      </div>

      <div className="metrics-grid">
          <Metric label="À démettre" value={dismissCount.toString()} />
        <Metric label="Sous avertissement" value={warnCount.toString()} />
        <Metric label="Point chaud" value={hotspot} />
        <Metric label="Dernière preuve" value={formatDate(latestDate)} />
      </div>

      <div className="decision-board">
        <div className="board-topline">
          <div>
            <small>Premier dossier</small>
            <h3>{top.name}</h3>
          </div>
          <p>{top.brief}</p>
          <strong>{top.reports > 0 ? 'Décider vite' : 'Documenter'}</strong>
        </div>
        <div className="ledger">
          {rankedOfficials.map((official, index) => (
            <OfficialRow official={official} index={index} key={official.id} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfficialRow({ official, index, priority = false }: { official: Official; index: number; priority?: boolean }) {
  const recommendation = getRecommendation(official);

  return (
    <article className={`official-row ${priority ? 'priority-row' : ''}`}>
      <div className={`rank ${recommendation.tone === 'dismiss' ? 'danger' : ''}`}>{String(index + 1).padStart(2, '0')}</div>
      <img src={official.avatar} alt={official.name} />
      <div className="official-main">
        <div className="row-title">
          <div>
            <h3>{official.name}</h3>
            <p>{official.position}</p>
            <small>{official.group} • {official.ministry}</small>
          </div>
          <span className={`pill ${toneClass(recommendation.tone)}`}>{recommendation.label}</span>
        </div>
      <p className="case-note">{official.brief}</p>
      <a className="source-link" href={official.sourceUrl} rel="noreferrer" target="_blank">Source Primature</a>
      </div>
      <div className="row-stats">
        <Metric label="Score" value={official.score.toFixed(1)} compact />
        <Metric label="Rapports" value={official.reports.toString()} compact />
        <Metric label="Tendance" value={official.trend.toFixed(1)} compact />
      </div>
      <p className="row-reason">{recommendation.rationale}</p>
    </article>
  );
}

function ReportPortalSection({
  officials,
  reports,
  onSubmit,
}: {
  officials: Official[];
  reports: Report[];
  onSubmit: (report: Omit<Report, 'id' | 'status'>) => void;
}) {
  const officialById = new Map(officials.map((official) => [official.id, official]));
  const pendingCount = reports.filter((report) => report.status === 'En attente de vérification').length;

  return (
    <section className="screen">
      <SectionHeader
        eyebrow="Portail preuves"
        title="Nommer un officiel, déposer un fait, documenter l'impact"
        text="Le portail est visible, mobile-compatible, et alimente directement les scores de la vue présidentielle."
      />

      <div className="portal-layout">
        <div className="portal-manifest">
          <div className="eyebrow">
            <FilePlus2 size={16} />
            Signalement public
          </div>
          <h2>Un dossier sans preuve reste neutre.</h2>
          <p>
            Ajoute un fait daté, une province, une catégorie et l'impact citoyen. Le dossier passe ensuite en
            attente de vérification avant toute décision publique.
          </p>
          <div className="proof-grid compact-proof">
            <ProofCard title="1. Nom" text="Choisir le membre exact du Gouvernement Suminwa 2." dark />
            <ProofCard title="2. Fait" text="Décrire une action vérifiable, pas une rumeur." dark />
            <ProofCard title="3. Impact" text="Relier le fait à un coût public concret." dark />
          </div>
        </div>

        <ReportForm officials={officials} onSubmit={onSubmit} submitLabel="Envoyer au portail" />
      </div>

      <div className="recent-reports">
        <div className="section-header mini">
          <small>Journal local</small>
          <h2>Derniers signalements</h2>
        </div>
        <div className="verification-strip">
          <div>
            <small>Qui vérifie ?</small>
            <strong>{verificationDesk}</strong>
            <p>Validation séparée dans le portail admin. Le public ne peut pas approuver un dossier.</p>
          </div>
          <div>
            <small>Où ?</small>
            <strong>Portail preuves</strong>
            <p>{pendingCount} signalement{pendingCount > 1 ? 's' : ''} en attente dans cette session.</p>
          </div>
        </div>
        {reports.length === 0 ? (
          <p className="empty-state">Aucun signalement soumis dans cette session.</p>
        ) : (
          <div className="ledger">
            {reports.slice(0, 5).map((report) => {
              const official = officialById.get(report.officialId);
              return (
                <article className="report-item" key={report.id}>
                  <strong>{official?.name ?? 'Officiel inconnu'}</strong>
                  <span>{report.category} • {report.province} • {formatDate(report.actionDate)}</span>
                  <p>{report.action}</p>
                  <div className="report-status-line">
                    <small className={`status-badge ${statusClass(report.status)}`}>
                      {report.status}
                    </small>
                    {report.verifiedBy && report.verifiedAt && (
                      <span>Par {report.verifiedBy} • {formatDate(report.verifiedAt)}</span>
                    )}
                  </div>
                  <p className="locked-review-note">Décision réservée au portail admin.</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function AdminPortalSection({
  adminConfigured,
  adminLogin,
  officials,
  onAdminLoginChange,
  onReviewerLock,
  onReviewerLogin,
  onReview,
  reports,
  reviewerUnlocked,
}: {
  adminConfigured: boolean;
  adminLogin: AdminLoginFields;
  officials: Official[];
  onAdminLoginChange: (fields: AdminLoginFields) => void;
  onReviewerLock: () => void;
  onReviewerLogin: (event: FormEvent) => void;
  onReview: (reportId: string, status: Report['status']) => void;
  reports: Report[];
  reviewerUnlocked: boolean;
}) {
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const officialById = new Map(officials.map((official) => [official.id, official]));
  const statusPriority: Record<Report['status'], number> = {
    'En attente de vérification': 0,
    Vérifié: 1,
    Rejeté: 2,
  };
  const orderedReports = reports.toSorted((left, right) => {
    const priorityDelta = statusPriority[left.status] - statusPriority[right.status];
    if (priorityDelta !== 0) return priorityDelta;
    return new Date(right.actionDate).getTime() - new Date(left.actionDate).getTime();
  });
  const activeReport = orderedReports.find((report) => report.id === activeReportId) ?? orderedReports[0];
  const activeOfficial = activeReport ? officialById.get(activeReport.officialId) : null;
  const pendingCount = reports.filter((report) => report.status === 'En attente de vérification').length;
  const approvedCount = reports.filter((report) => report.status === 'Vérifié').length;
  const rejectedCount = reports.filter((report) => report.status === 'Rejeté').length;

  return (
    <section className="screen admin-screen">
      <SectionHeader
        eyebrow="Admin approbation"
        title="Approuver les preuves avant score présidentiel"
        text="Les signalements publics restent neutres. Seuls les dossiers approuvés ici alimentent les scores, les tendances et la vue présidentielle."
      />

      {!reviewerUnlocked ? (
        <div className="admin-lock-panel">
          <div>
            <div className="eyebrow">
              <AlertTriangle size={16} />
              Accès restreint
            </div>
            <h3>File d'approbation verrouillée</h3>
            <p>
              Le public peut déposer un fait, mais ne peut pas le valider. Connecte-toi avec un compte admin
              pour ouvrir la file de vérification.
            </p>
          </div>
          <form className="admin-login" onSubmit={onReviewerLogin}>
            <label>
              Identifiant admin
              <input
                autoComplete="username"
                disabled={!adminConfigured}
                onChange={(event) => onAdminLoginChange({ ...adminLogin, username: event.target.value })}
                placeholder={adminConfigured ? 'admin@impact-rdc' : 'VITE_ADMIN_USERNAME manquant'}
                type="text"
                value={adminLogin.username}
              />
            </label>
            <label>
              Mot de passe
              <input
                autoComplete="current-password"
                disabled={!adminConfigured}
                onChange={(event) => onAdminLoginChange({ ...adminLogin, password: event.target.value })}
                placeholder={adminConfigured ? 'Mot de passe admin' : 'VITE_ADMIN_PASSWORD manquant'}
                type="password"
                value={adminLogin.password}
              />
            </label>
            <button className="primary-action" disabled={!adminConfigured} type="submit">
              Se connecter
            </button>
            <small>
              {adminConfigured
                ? 'Session locale active jusqu’au verrouillage ou la fermeture de l’onglet.'
                : 'Ajoute VITE_ADMIN_USERNAME et VITE_ADMIN_PASSWORD, puis redéploie.'}
            </small>
          </form>
        </div>
      ) : (
        <>
          <div className="admin-toolbar">
            <div className="admin-kpis">
              <Metric label="À approuver" value={pendingCount.toString()} />
              <Metric label="Approuvés" value={approvedCount.toString()} />
              <Metric label="Rejetés" value={rejectedCount.toString()} />
            </div>
            <button className="secondary-action" onClick={onReviewerLock} type="button">
              Verrouiller l'admin
            </button>
          </div>

          {orderedReports.length === 0 ? (
            <p className="empty-state">Aucun signalement dans la file admin.</p>
          ) : (
            <div className="admin-workspace">
              <div className="approval-queue">
                <small>File de décision</small>
                {orderedReports.map((report) => {
                  const official = officialById.get(report.officialId);
                  return (
                    <button
                      className={`queue-item ${activeReport?.id === report.id ? 'active' : ''}`}
                      key={report.id}
                      onClick={() => setActiveReportId(report.id)}
                      type="button"
                    >
                      <span className={`status-badge ${statusClass(report.status)}`}>{report.status}</span>
                      <strong>{official?.name ?? 'Officiel inconnu'}</strong>
                      <small>{report.category} • {report.province}</small>
                    </button>
                  );
                })}
              </div>

              {activeReport && (
                <article className="approval-detail">
                  <div className="approval-official">
                    {activeOfficial && <img src={activeOfficial.avatar} alt={activeOfficial.name} />}
                    <div>
                      <small>Officiel concerné</small>
                      <h3>{activeOfficial?.name ?? 'Officiel inconnu'}</h3>
                      <p>{activeOfficial?.position ?? 'Poste non trouvé'}</p>
                      <span>{activeReport.province} • {formatDate(activeReport.actionDate)}</span>
                    </div>
                  </div>

                  <div className="approval-body">
                    <div>
                      <small>Fait soumis</small>
                      <p>{activeReport.action}</p>
                    </div>
                    <div>
                      <small>Impact citoyen</small>
                      <p>{activeReport.impact}</p>
                    </div>
                    <div className="approval-meta">
                      <Metric label="Catégorie" value={activeReport.category} compact />
                      <Metric label="Score si approuvé" value={activeReport.rating > 0 ? `+${activeReport.rating}` : activeReport.rating.toString()} compact />
                      <Metric label="Statut" value={activeReport.status} compact />
                    </div>
                  </div>

                  <div className="approval-actions">
                    <button className="primary-action" onClick={() => onReview(activeReport.id, 'Vérifié')} type="button">
                      Approuver
                    </button>
                    <button className="danger-action" onClick={() => onReview(activeReport.id, 'Rejeté')} type="button">
                      Rejeter
                    </button>
                    <button className="secondary-action" onClick={() => onReview(activeReport.id, 'En attente de vérification')} type="button">
                      Renvoyer en attente
                    </button>
                  </div>
                </article>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ReportForm({
  officials,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  officials: Official[];
  onCancel?: () => void;
  onSubmit: (report: Omit<Report, 'id' | 'status'>) => void;
  submitLabel: string;
}) {
  const [officialId, setOfficialId] = useState(officials[0]?.id ?? 1);
  const [actionDate, setActionDate] = useState(new Date().toISOString().slice(0, 10));
  const [province, setProvince] = useState(provinces[0]);
  const [action, setAction] = useState('');
  const [impact, setImpact] = useState('');
  const [rating, setRating] = useState(-7);
  const [category, setCategory] = useState(reportCategories[0]);
  const selectedOfficial = officials.find((official) => official.id === officialId) ?? officials[0];
  const selectedRecommendation = selectedOfficial ? getRecommendation(selectedOfficial) : null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({ officialId, actionDate, province, action, impact, rating, category });
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      {selectedOfficial && selectedRecommendation && (
        <div className="selected-official-card">
          <img src={selectedOfficial.avatar} alt={selectedOfficial.name} />
          <div>
            <small>Officiel sélectionné</small>
            <h3>{selectedOfficial.name}</h3>
            <p>{selectedOfficial.position}</p>
            <span>{selectedOfficial.group} • {selectedOfficial.ministry}</span>
            <div className="selected-meta">
              <strong className={`pill ${toneClass(selectedRecommendation.tone)}`}>{selectedRecommendation.label}</strong>
              <a href={selectedOfficial.sourceUrl} rel="noreferrer" target="_blank">Source Primature</a>
            </div>
          </div>
        </div>
      )}
      <div className="form-grid">
        <label>
          Officiel concerné
          <select value={officialId} onChange={(event) => setOfficialId(Number(event.target.value))}>
            {officials.map((official) => (
              <option key={official.id} value={official.id}>{official.name} - {official.position}</option>
            ))}
          </select>
        </label>
        <label>
          Date de l'action
          <input type="date" value={actionDate} onChange={(event) => setActionDate(event.target.value)} />
        </label>
        <label>
          Province
          <select value={province} onChange={(event) => setProvince(event.target.value)}>
            {provinces.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Catégorie
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {reportCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="wide">
          Description de l'action
          <textarea value={action} onChange={(event) => setAction(event.target.value)} placeholder="Ex: marché public non publié, service bloqué, abus documenté..." required />
        </label>
        <label className="wide">
          Impact citoyen
          <textarea value={impact} onChange={(event) => setImpact(event.target.value)} placeholder="Ex: communautés affectées, argent public perdu, délai critique..." required />
        </label>
        <label className="wide rating-field">
          Note d'impact: <strong>{rating > 0 ? `+${rating}` : rating}</strong>
          <input type="range" min="-10" max="10" value={rating} onChange={(event) => setRating(Number(event.target.value))} />
        </label>
      </div>
      <div className="modal-actions">
        {onCancel && <button className="secondary-action" onClick={onCancel} type="button">Annuler</button>}
        <button className="primary-action" type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}

function ReportModal({
  officials,
  onClose,
  onSubmit,
}: {
  officials: Official[];
  onClose: () => void;
  onSubmit: (report: Omit<Report, 'id' | 'status'>) => void;
}) {
  return (
    <div className="modal-backdrop">
      <div className="report-modal">
        <div className="modal-head">
          <div>
            <small>Dossier public</small>
            <h2>Ajouter une preuve</h2>
            <p>Le signalement doit renforcer un cas lisible et vérifiable.</p>
          </div>
          <button onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>
        <div className="guidance-grid">
          <ProofCard title="Nommer" text="Quel officiel, où, et dans quel portefeuille." dark />
          <ProofCard title="Prouver" text="Quel fait observable permet au public d'y croire." dark />
          <ProofCard title="Motiver" text="Pourquoi ce fait peut justifier un avertissement ou un renvoi." dark />
        </div>
        <ReportForm officials={officials} onCancel={onClose} onSubmit={onSubmit} submitLabel="Soumettre la preuve" />
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="section-header">
      <small>{eyebrow}</small>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={`metric ${compact ? 'compact' : ''}`}>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function ProofCard({ title, text, dark = false }: { title: string; text: string; dark?: boolean }) {
  return (
    <div className={`proof-card ${dark ? 'dark' : ''}`}>
      <small>{title}</small>
      <p>{text}</p>
    </div>
  );
}
