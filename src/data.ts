import type { Official } from './types';

export const officialSourceUrl = 'https://www.primature.gouv.cd/membres-du-gouvernement-suminwa-2/';
const sourceDate = '2026-04-21';

type GovernmentMember = {
  name: string;
  position: string;
  group: string;
  ministry: string;
};

const governmentMembers: GovernmentMember[] = [
  {
    name: 'Jacquemain SHABANI LUKOO',
    position: "Vice-Premier Ministre, Ministre de l'Intérieur, Sécurité, Décentralisation et Affaires coutumières",
    group: 'Vice-premiers ministres',
    ministry: 'Intérieur, Sécurité et Décentralisation',
  },
  {
    name: 'Jean-Pierre BEMBA GOMBO',
    position: 'Vice-premier Ministre, Ministre des Transports et Voies de communication',
    group: 'Vice-premiers ministres',
    ministry: 'Transports et Voies de communication',
  },
  {
    name: 'Guy KABOMBO MUADIAMVITA',
    position: 'Vice-premier Ministre, Ministre de la Défense nationale et Anciens combattants',
    group: 'Vice-premiers ministres',
    ministry: 'Défense nationale et Anciens combattants',
  },
  {
    name: 'Daniel MUKOKO SAMBA',
    position: "Vice-premier ministre, Ministre de l'économie nationale",
    group: 'Vice-premiers ministres',
    ministry: 'Économie nationale',
  },
  {
    name: 'Adolphe Muzito',
    position: 'Vice-premier ministre, Ministre du Budget',
    group: 'Vice-premiers ministres',
    ministry: 'Budget',
  },
  {
    name: 'Jean-Pierre LIHAU EBUA KALOKOLA',
    position: "Vice-premier Ministre, Ministre de la Fonction Publique, Modernisation de l'Administration et Innovation du Service Public",
    group: 'Vice-premiers ministres',
    ministry: 'Fonction publique',
  },
  {
    name: 'Guylain Nyembo',
    position: "Ministre d'État, Ministre du Plan et Coordination de l'aide au développement",
    group: "Ministres d'État",
    ministry: "Plan et Coordination de l'aide au développement",
  },
  {
    name: 'Thérèse KAYIKWAMBA WAGNER',
    position: "Ministre d'État, Ministre des Affaires Étrangères, Coopération internationale et Francophonie",
    group: "Ministres d'État",
    ministry: 'Affaires étrangères',
  },
  {
    name: 'Muhindo Nzangi Butondo',
    position: "Ministre d'État, Ministre de l'Agriculture et Sécurité alimentaire",
    group: "Ministres d'État",
    ministry: 'Agriculture et Sécurité alimentaire',
  },
  {
    name: 'Aimé Boji Sangara',
    position: "Ministre d'État, Ministre de l'Industrie",
    group: "Ministres d'État",
    ministry: 'Industrie',
  },
  {
    name: 'Ève Bazaïba',
    position: "Ministre d'État, Ministre des Affaires sociales, Actions humanitaires et Solidarité nationale",
    group: "Ministres d'État",
    ministry: 'Affaires sociales',
  },
  {
    name: 'Guillaume Ngefa Atondoko Andali',
    position: "Ministre d'État en charge de la Justice et Garde des sceaux",
    group: "Ministres d'État",
    ministry: 'Justice',
  },
  {
    name: 'Acacia BANDUBOLA',
    position: "Ministre d'État, Ministre des Hydrocarbures",
    group: "Ministres d'État",
    ministry: 'Hydrocarbures',
  },
  {
    name: 'Raïssa Malu Dinanga',
    position: "Ministre d'État, Ministre de l'Éducation nationale et Nouvelle citoyenneté",
    group: "Ministres d'État",
    ministry: 'Éducation nationale',
  },
  {
    name: 'Marc Ekila',
    position: "Ministre d'État, Ministre de la Formation professionnelle",
    group: "Ministres d'État",
    ministry: 'Formation professionnelle',
  },
  {
    name: 'Alexis Gisaro',
    position: "Ministre d'État, Ministre de l'Urbanisme et Habitat",
    group: "Ministres d'État",
    ministry: 'Urbanisme et Habitat',
  },
  {
    name: 'Grégoire Mutshail Mutomb',
    position: "Ministre d'État, Ministre du Développement rural",
    group: "Ministres d'État",
    ministry: 'Développement rural',
  },
  {
    name: 'Guy Loando',
    position: "Ministre d'État, Ministre des Relations avec le Parlement / Aménagement du territoire",
    group: "Ministres d'État",
    ministry: 'Relations avec le Parlement',
  },
  {
    name: 'Doudou Roussel FWAMBA LIKUNDE LI-BOTAVI',
    position: 'Ministre des Finances',
    group: 'Ministres',
    ministry: 'Finances',
  },
  {
    name: 'Samuel Roger Kamba',
    position: "Ministre de l'Industrie et Développement des Petites et Moyennes Entreprises",
    group: 'Ministres',
    ministry: 'Industrie et PME',
  },
  {
    name: 'Julien PALUKU KAHONGYA',
    position: 'Ministre du Commerce Extérieur',
    group: 'Ministres',
    ministry: 'Commerce extérieur',
  },
  {
    name: 'Marie Niangé Ndambo',
    position: "Ministre de l'Environnement et Développement durable",
    group: 'Ministres',
    ministry: 'Environnement',
  },
  {
    name: 'John Banza Lunda',
    position: 'Ministre des Infrastructures et Travaux publics',
    group: 'Ministres',
    ministry: 'Infrastructures et Travaux publics',
  },
  {
    name: 'Marie-Thérèse SOMBO AYANE',
    position: "Ministre de l'Enseignement Supérieur et Universitaire",
    group: 'Ministres',
    ministry: 'Enseignement supérieur',
  },
  {
    name: 'Ferdinand Massamba Wa Massamba',
    position: "Ministre de l'Emploi et du Travail",
    group: 'Ministres',
    ministry: 'Emploi et Travail',
  },
  {
    name: 'José Panda',
    position: 'Ministre des Postes et Télécommunications',
    group: 'Ministres',
    ministry: 'Postes et Télécommunications',
  },
  {
    name: 'Augustin Kibassa',
    position: "Ministre de l'Économie numérique",
    group: 'Ministres',
    ministry: 'Économie numérique',
  },
  {
    name: 'Louis Kabamba Watum',
    position: 'Ministre des Mines',
    group: 'Ministres',
    ministry: 'Mines',
  },
  {
    name: 'Aimé Molendo Sakombi',
    position: "Ministre des Ressources hydrauliques et Électricité",
    group: 'Ministres',
    ministry: 'Ressources hydrauliques et Électricité',
  },
  {
    name: 'Patrick MUYAYA',
    position: 'Ministre de la Communication et Médias, Porte-parole du Gouvernement',
    group: 'Ministres',
    ministry: 'Communication et Médias',
  },
  {
    name: 'Justin Kalumba',
    position: "Ministre de l'Entrepreneuriat / Développement des PME",
    group: 'Ministres',
    ministry: 'Entrepreneuriat',
  },
  {
    name: 'Jean-Lucien Bussa',
    position: "Ministre de l'Aménagement du territoire",
    group: 'Ministres',
    ministry: 'Aménagement du territoire',
  },
  {
    name: 'Didier Manzenga MAKANZU',
    position: 'Ministre du Tourisme',
    group: 'Ministres',
    ministry: 'Tourisme',
  },
  {
    name: 'Jean-Pierre TSHIMANGA BWANA',
    position: 'Ministre de Pêche et Elevage',
    group: 'Ministres',
    ministry: 'Pêche et Élevage',
  },
  {
    name: 'Yollande ELEBE',
    position: 'Ministre de la Culture et Arts',
    group: 'Ministres',
    ministry: 'Culture et Arts',
  },
  {
    name: 'Samuel Mbemba',
    position: 'Ministre des Droits humains',
    group: 'Ministres',
    ministry: 'Droits humains',
  },
  {
    name: 'Floribert Anzulini',
    position: "Ministre de l'Intégration régionale",
    group: 'Ministres',
    ministry: 'Intégration régionale',
  },
  {
    name: 'Oneige Nsele Mpimpa',
    position: 'Ministre des Affaires foncières',
    group: 'Ministres',
    ministry: 'Affaires foncières',
  },
  {
    name: 'Didier Budimbu',
    position: 'Ministre des Sports et Loisirs',
    group: 'Ministres',
    ministry: 'Sports et Loisirs',
  },
  {
    name: 'Julie Mbuyi Shiku',
    position: 'Ministre du Portefeuille',
    group: 'Ministres',
    ministry: 'Portefeuille',
  },
  {
    name: 'Micheline Ombaye Kalama',
    position: 'Ministre du Genre et Famille',
    group: 'Ministres',
    ministry: 'Genre et Famille',
  },
  {
    name: 'Grâce Émie Kutino',
    position: "Ministre de la Jeunesse et Éveil Patriotique",
    group: 'Ministres',
    ministry: 'Jeunesse et Éveil Patriotique',
  },
  {
    name: 'Crispin Mbadu',
    position: 'Ministre déléguée près le Ministre des Affaires étrangères (Francophonie et Diaspora)',
    group: 'Ministres délégués',
    ministry: 'Francophonie et Diaspora',
  },
  {
    name: 'Arlette Bahati Tito',
    position: "Ministre délégué près le Ministre de l'Environnement",
    group: 'Ministres délégués',
    ministry: 'Environnement',
  },
  {
    name: 'Angèle Bangasa Yogo',
    position: "Ministre délégué près le Ministre de l'Urbanisme et Habitat",
    group: 'Ministres délégués',
    ministry: 'Urbanisme et Habitat',
  },
  {
    name: 'Irène ESAMBO DIATA',
    position: 'Ministre délégué près le Ministre des Affaires sociales en charge des personnes vivant avec handicap',
    group: 'Ministres délégués',
    ministry: 'Personnes vivant avec handicap',
  },
  {
    name: 'Eliezer Ntambwe',
    position: 'Ministre déléguée près le Ministre de la Défense nationale (Anciens combattants)',
    group: 'Ministres délégués',
    ministry: 'Anciens combattants',
  },
  {
    name: 'Elysée BOKUMWANA',
    position: 'Vice-ministre du Budget',
    group: 'Vice-ministres',
    ministry: 'Budget',
  },
  {
    name: 'Eugénie TSHIELA COMPTON',
    position: "Vice-ministre de l'Intérieur",
    group: 'Vice-ministres',
    ministry: 'Intérieur',
  },
  {
    name: 'Noëlla Ayeganagato',
    position: "Vice-ministre des Affaires étrangères",
    group: 'Vice-ministres',
    ministry: 'Affaires étrangères',
  },
  {
    name: 'Grâce YAMBA KAZADI',
    position: 'Vice-ministre des Finances',
    group: 'Vice-ministres',
    ministry: 'Finances',
  },
  {
    name: 'Théodore Kazadi',
    position: "Vice-ministre de l'Éducation nationale",
    group: 'Vice-ministres',
    ministry: 'Éducation nationale',
  },
  {
    name: 'Mwami Jean-Baptiste NDEZE KATUREBE',
    position: 'Vice-ministre des Affaires Coutumières',
    group: 'Vice-ministres',
    ministry: 'Affaires coutumières',
  },
];

const portraitByName: Record<string, string> = {
  'Jacquemain SHABANI LUKOO': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Jacquemain-Shabani-Lukoo-copie.jpg',
  'Jean-Pierre BEMBA GOMBO': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Jean-Pierre-Bemba-copie.jpg',
  'Guy KABOMBO MUADIAMVITA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Guy-Kabombo-Muadiavita-1-865x1024.jpg',
  'Daniel MUKOKO SAMBA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Daniel-Muakoko-Samba-copie.jpg',
  'Adolphe Muzito': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Adolphe-Muzito-copie.jpg',
  'Jean-Pierre LIHAU EBUA KALOKOLA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Jean-Pierre-Lihau-copie.jpg',
  'Guylain Nyembo': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Guylain-Nyembo-Mbwizya-copie.jpg',
  'Thérèse KAYIKWAMBA WAGNER': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Therese-Kanyikwamba-Wagner-copie.jpg',
  'Muhindo Nzangi Butondo': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Mohindo-Nzangi-copie.jpg',
  'Aimé Boji Sangara': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Aime-Boji-copie.jpg',
  'Ève Bazaïba': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Eve-Bazaiba-Masudi-copie.jpg',
  'Guillaume Ngefa Atondoko Andali': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Guillaume-Ngefa-Atongoko-copie.jpg',
  'Acacia BANDUBOLA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Acacia-copie.jpg',
  'Raïssa Malu Dinanga': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Raissa-Malu-copie.jpg',
  'Marc Ekila': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Marc-Ekila-2-865x1024.jpg',
  'Alexis Gisaro': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Alexis-Gisaro-8.jpg',
  'Grégoire Mutshail Mutomb': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Gregoire-Mutshail-4-865x1024.jpg',
  'Guy Loando': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Guy-Loando-Mboyo-copie.jpg',
  'Doudou Roussel FWAMBA LIKUNDE LI-BOTAVI': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Doudou-Fwamba-copie.jpg',
  'Samuel Roger Kamba': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Samuel-Roger-Kamba-copie.jpg',
  'Julien PALUKU KAHONGYA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Julien-Paluku-Kahongya-copie.jpg',
  'Marie Niangé Ndambo': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Marie-Nyange-Ndambo-copie.jpg',
  'John Banza Lunda': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/John-Banza-Lunda-ok-copie.jpg',
  'Marie-Thérèse SOMBO AYANE': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/G2-copie.jpg',
  'Ferdinand Massamba Wa Massamba': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Ferdinand-Massamba-wa-Massamba-copie.jpg',
  'José Panda': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Jose-Mpanda-Kabangu-copie.jpg',
  'Augustin Kibassa': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/IMG_4590.jpg',
  'Louis Kabamba Watum': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Louis-Kabamba-Watum-copie-1.jpg',
  'Aimé Molendo Sakombi': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Aime-Sakombi-Molendo-copie.jpg',
  'Patrick MUYAYA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Patrick-Muyaya-copie.jpg',
  'Justin Kalumba': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Justin-Kalumba-Mwana-Ngongo-copie.jpg',
  'Jean-Lucien Bussa': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Jean-Lucien-Bussa-3-865x1024.jpg',
  'Didier Manzenga MAKANZU': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/G10-copie-1.jpg',
  'Jean-Pierre TSHIMANGA BWANA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/G1-copie.jpg',
  'Yollande ELEBE': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Yollande-Elebe-Ma-Ndembo-copie-865x1024.jpg',
  'Samuel Mbemba': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Samuel-Mbemba-6-865x1024.jpg',
  'Floribert Anzulini': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Floribert-Anzuluni-copie.jpg',
  'Oneige Nsele Mpimpa': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/G12-copie.jpg',
  'Didier Budimbu': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Didier-Bidimbu-5-865x1024.jpg',
  'Julie Mbuyi Shiku': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Julie-Mbuyi-Shiku-copie.jpg',
  'Micheline Ombaye Kalama': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Micheline-Ombae-Kalama-copie.jpg',
  'Grâce Émie Kutino': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Grace-Emie-Kutino-copie.jpg',
  'Crispin Mbadu': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Crispin-Mbadu-copie.jpg',
  'Arlette Bahati Tito': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Arlette-Bahati-Tito-9.jpg',
  'Angèle Bangasa Yogo': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Angele-Bangasa-Yogo-copie.jpg',
  'Irène ESAMBO DIATA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Irene-ESAMBO-DIATA-copie.jpg',
  'Eliezer Ntambwe': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Eliezer-Tambwe-Kasongo-copie.jpg',
  'Elysée BOKUMWANA': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/G13-copie.jpg',
  'Eugénie TSHIELA COMPTON': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Eugenie-Tshiela-7-865x1024.jpg',
  'Noëlla Ayeganagato': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Noella-Ayeganagato-Nakwipone-copie.jpg',
  'Grâce YAMBA KAZADI': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/G9-copie.jpg',
  'Théodore Kazadi': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/Theodore-Kazadi-Muayila-copie.jpg',
  'Mwami Jean-Baptiste NDEZE KATUREBE': 'https://www.primature.gouv.cd/wp-content/uploads/2025/09/G5-copie.jpg',
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function avatarFor(name: string, id: number): string {
  const palette = ['0b7fbc', 'd3223f', '071521', 'f6c945', '14532d'];
  const bg = palette[id % palette.length];
  const fg = bg === 'f6c945' ? '071521' : 'ffffff';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" rx="38" fill="#${bg}"/><path d="M0 128 180 52v128H0z" fill="rgba(255,255,255,.16)"/><text x="90" y="104" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="800" fill="#${fg}">${initials(name)}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const initialOfficials: Official[] = governmentMembers.map((member, index) => ({
  id: index + 1,
  name: member.name,
  position: member.position,
  group: member.group,
  score: 0,
  reports: 0,
  lastReport: sourceDate,
  avatar: portraitByName[member.name] ?? avatarFor(member.name, index + 1),
  ministry: member.ministry,
  trend: 0,
  province: 'National',
  brief: `Fonction reprise de la liste officielle du Gouvernement Suminwa 2. Aucun grief vérifié n'est enregistré dans cette instance locale.`,
  sourceUrl: officialSourceUrl,
}));

export const provinces = [
  'Bas-Uele',
  'Équateur',
  'Haut-Katanga',
  'Haut-Lomami',
  'Haut-Uele',
  'Ituri',
  'Kasaï',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Kinshasa',
  'Kongo-Central',
  'Kwango',
  'Kwilu',
  'Lomami',
  'Lualaba',
  'Mai-Ndombe',
  'Maniema',
  'Mongala',
  'Nord-Kivu',
  'Nord-Ubangi',
  'Sankuru',
  'Sud-Kivu',
  'Sud-Ubangi',
  'Tanganyika',
  'Tshopo',
  'Tshuapa',
];

export const reportCategories = [
  'Corruption',
  'Mauvaise gestion',
  'Impact négatif sur les communautés',
  'Manque de transparence',
  'Abus de pouvoir',
  'Amélioration positive',
];
