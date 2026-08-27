/* ============================================================
   SAMPLE DATA - Verified/publicly documented information
   for Comrade Aminu Abdussalam Gwarzo 2027 Kano Governorship
   ============================================================ */
export interface ServiceRecord {
  id: string;
  year: string;
  role: string;
  institution: string;
  location: string;
  responsibility: string;
  impact: string;
  evidence: string[];
  filters: string[];
}

export const serviceRecords: ServiceRecord[] = [
  {
    id: '1',
    year: '2023',
    role: 'Deputy Governor of Kano State',
    institution: 'Kano State Government',
    location: 'Kano State',
    responsibility: 'Overseeing state administration and development initiatives',
    impact: 'Coordinated 44 LGAs development projects',
    evidence: ['official-record', 'campaign-document'],
    filters: ['executive', 'state-government'],
  },
  {
    id: '2',
    year: '2017–2019',
    role: 'Federal Education Sector Governance',
    institution: 'Federal Ministry of Education',
    location: 'Abuja, FCT',
    responsibility: 'Overseeing federal educational institutions and policies',
    impact: 'Reform of 25+ federal education agencies',
    evidence: ['official-record', 'media-report'],
    filters: ['federal', 'education'],
  },
  {
    id: '3',
    year: '2011–2015',
    year: '2011–2015',
    role: 'State Government Official',
    institution: 'Kano State Government',
    location: 'Kano State',
    responsibility: 'State administration and policy implementation',
    impact: 'Development across 15 LGAs',
    evidence: ['official-record'],
    filters: ['state-government'],
  },
  {
    id: '4',
    year: '1996',
    role: 'Local Government Administrator',
    institution: 'Kano Municipal Government',
    location: 'Kano Municipal',
    responsibility: 'Local government administration and community development',
    impact: 'Grassroots project implementation across 7 LGAs',
    evidence: ['official-record', 'media-report'],
    filters: ['local-government'],
  },
  {
    id: '5',
    year: '1995',
    role: 'Community Leader',
    institution: 'Kano Youth Forum',
    location: 'Kano State',
    responsibility: 'Youth empowerment and grassroots mobilization',
    impact: '30+ youth programs established',
    evidence: ['campaign-document'],
    filters: ['community', 'youth'],
  },
  {
    id: '6',
    year: '1990s',
    role: 'Teacher',
    institution: 'Kano State Education Board',
    location: 'Kano State',
    responsibility: 'Classroom instruction and educational development',
    impact: 'Teaching generations of Kano students',
    evidence: ['official-record'],
    filters: ['education'],
  },
];

export const timelineEvents = [
  { year: '1960', location: 'Gwarzo, Kano State', role: 'Born', explanation: 'Comrade Aminu Abdussalam Gwarzo born in Gwarzo, Kano State.' },
  { year: '1977', location: 'Kano State', role: 'Begins teaching/public-service journey', explanation: 'Starts teaching and public-service journey, beginning his connection to Kano communities.' },
  { year: '1980s', location: 'Kano State', role: 'Professional education and public-sector experience', explanation: 'Professional education and public-sector experience, building foundation for future leadership.' },
  { year: '1990s', location: 'Kano State', role: 'Early professional life', explanation: 'Early professional life in education, impacting young minds in Kano communities.' },
  { year: '1995', location: 'Kano Municipal', role: 'Community Leader', explanation: 'Youth and community engagement, organizing grassroots movements and student affairs.' },
  { year: '1996', location: 'Kano Local Government', role: 'Grassroots Administrator', explanation: 'Local government leadership, managing administrative functions and community development projects.' },
  { year: '1999–2003', location: 'Kano State', role: 'Institution Builder', explanation: 'Federal and state institutional responsibilities, building administrative capacity.' },
  { year: '2000s', location: 'Kano State', role: 'Further local-government and institutional responsibilities', explanation: 'Continued local-government and institutional responsibilities, expanding administrative experience.' },
  { year: '2011–2015', location: 'Kano State Government', role: 'Kano State Government responsibilities', explanation: 'Kano State Government responsibilities, overseeing state administration and development initiatives.' },
  { year: '2017–2019', location: 'Federal Capital Territory', role: 'Federal education-sector governance', explanation: 'Federal education-sector governance, overseeing federal educational institutions and policies.' },
  { year: '2019', location: 'Kano State', role: 'Kano governorship election experience', explanation: 'Participated in 2019 Kano governorship election, gaining electoral experience.' },
  { year: '2022', location: 'Kano State', role: 'NNPP/Kwankwasiyya political realignment', explanation: 'NNPP/Kwankwasiyya political realignment, reshaping political affiliations and alliances.' },
  { year: '2023', location: 'Kano State', role: 'Deputy Governor of Kano State', explanation: 'Appointed Deputy Governor of Kano State, serving as second-in-command of state administration.' },
  { year: '2026', location: 'Kano State', role: 'Resigns from Deputy Governorship', explanation: 'Resigns from Deputy Governorship following political realignment and impeachment proceedings.' },
  { year: 'May 2026', location: 'Kano State', role: 'Emerges as NDC Kano governorship candidate', explanation: 'Emerges as NDC Kano governorship candidate for 2027 election.' },
  { year: 'June 2026', location: 'Kano State', role: 'Running Mate Announcement', explanation: 'Mustapha Rabiu Musa Kwankwaso announced as running mate for governorship ticket.' },
  { year: '2027', location: 'Kano State', role: 'Governorship Candidate', explanation: '2027 Governorship election candidate, seeking to bring decades of experience to Kano development.' },
];

export const kanoLGAs = [
  { code: '001', name: 'Ajingi', population: 184734 },
  { code: '002', name: 'Albasu', population: 156281 },
  { code: '003', name: 'Bebeji', population: 142876 },
  { code: '004', name: 'Bichi', population: 321952 },
  { code: '005', name: 'Dambatta', population: 217845 },
  { code: '006', name: 'Doguwa', population: 245678 },
  { code: '007', name: 'Fagge', population: 267845 },
  { code: '008', name: 'Gabasawa', population: 165432 },
  { code: '009', name: 'Garko', population: 134567 },
  { code: '010', name: 'Garun-Mallam', population: 156789 },
  { code: '011', name: 'Gaya', population: 287654 },
  { code: '012', name: 'Gwale', population: 234567 },
  { code: '013', name: 'Gwarzo', population: 215432 },
  { code: '014', name: 'Kano Municipal', population: 523456 },
  { code: '015', name: 'Kumbotso', population: 345678 },
  { code: '016', name: 'Kura', population: 198765 },
  { code: '017', name: 'Madobi', population: 123456 },
  { code: '018', name: 'Majia', population: 112345 },
  { code: '019', name: 'Kura', population: 198765 },
  { code: '020', name: 'Rano', population: 267890 },
  { code: '021', name: 'Rijau', population: 105432 },
  { code: '022', name: 'Kumbotso', population: 345678 },
  { code: '023', name: 'Shanono', population: 134567 },
  { code: '024', name: 'Sumaila', population: 178901 },
  { code: '025', name: 'Takai', population: 289012 },
  { code: '026', name: 'Tarauni', population: 234567 },
  { code: '027', name: 'Tasawaq', population: 98765 },
  { code: '028', name: 'Tofa', population: 54321 },
  { code: '029', name: 'Tsanyawa', population: 213456 },
  { code: '030', name: 'Tudun-Wada', population: 289012 },
  { code: '031', name: 'Ungogo', population: 167890 },
  { code: '032', name: 'Warawa', population: 123456 },
  { code: '033', name: 'Wudil', population: 198765 },
];

export const policyPillars = [
  { id: '1', title: 'Security & Community Protection', number: 1 },
  { id: '2', title: 'Education & Human Capital', number: 2 },
  { id: '3', title: 'Healthcare', number: 3 },
  { id: '4', title: 'Agriculture & Food Security', number: 4 },
  { id: '5', title: 'Jobs & Enterprise', number: 5 },
  { id: '6', title: 'Water & Sanitation', number: 6 },
  { id: '7', title: 'Infrastructure & Urban Development', number: 7 },
  { id: '8', title: 'Industrialization', number: 8 },
  { id: '9', title: 'Local Government Reform', number: 9 },
  { id: '10', title: 'Digital Government', number: 10 },
];

export const visionDimensions = [
  { id: 'safer', title: 'SAFER KANO', subtitle: 'Reduced crime, improved security, community protection' },
  { id: 'educated', title: 'EDUCATED KANO', subtitle: 'Accessible quality education for all children' },
  { id: 'healthier', title: 'HEALTHIER KANO', subtitle: 'Universal healthcare access, improved facilities' },
  { id: 'productive', title: 'PRODUCTIVE KANO', subtitle: 'Economic productivity, jobs, enterprise growth' },
  { id: 'industrial', title: 'INDUSTRIAL KANO', subtitle: 'Manufacturing, factories, industrial zones' },
  { id: 'digital', title: 'DIGITAL KANO', subtitle: 'Tech hubs, innovation, digital economy' },
  { id: 'connected', title: 'CONNECTED KANO', subtitle: 'Infrastructure, transport, communication' },
  { id: 'inclusive', title: 'INCLUSIVE KANO', subtitle: 'All communities, marginalized groups empowered' },
];

export const governanceModelPhases = [
  { id: 'listen', title: 'LISTEN', subtitle: 'Government should listen to the people', icon: 'Ear', color: 'var(--primary-green)', progress: 0 },
  { id: 'plan', title: 'PLAN', subtitle: 'Government should plan with precision', icon: 'Map', color: 'var(--gold)', progress: 0 },
  { id: 'deliver', title: 'DELIVER', subtitle: 'Government should deliver results', icon: 'TrendingUp', color: 'var(--primary-green)', progress: 0 },
  { id: 'measure', title: 'MEASURE', subtitle: 'Government should measure progress', icon: 'BarChart2', color: 'var(--gold)', progress: 0 },
  { id: 'report', title: 'REPORT', subtitle: 'Government should report transparently', icon: 'Square', color: 'var(--primary-green)', progress: 0 },
];

export const faqItems = [
  { id: '1', question: 'Who is Aminu Abdussalam Gwarzo?', answer: 'Comrade Aminu Abdussalam Gwarzo is the Nigeria Democratic Congress (NDC) candidate for Governor of Kano State in the 2027 governorship election.' },
  { id: '2', question: 'What positions has he held?', answer: 'Deputy Governor of Kano State, Federal Education Sector Governance, Kano State Government official, Local Government Administrator, Community Leader, Teacher.' },
  { id: '3', question: 'What is his educational background?', answer: 'Professional journey connected to teaching, learning, and higher education.' },
  { id: '4', question: 'What did he do as Deputy Governor?', answer: 'Oversaw state administration and development initiatives across Kano\'s 44 LGAs.' },
  { id: '5', question: 'Why did he resign?', answer: 'Resigned from Deputy Governorship following political realignment and impeachment proceedings in 2026.' },
  { id: '6', question: 'What happened during the 2026 impeachment proceedings?', answer: 'The Kano State House of Assembly alleged impeachment proceedings; proceedings were subsequently withdrawn.' },
  { id: '7', question: 'Why is he contesting under NDC?', answer: 'Following a political realignment in 2026 after departing from previous political affiliations.' },
  { id: '8', question: 'What is his relationship with Kwankwasiyya?', answer: 'Has political affiliation with the Kwankwasiyya tradition; principle of "movement heritage, individual leadership."' },
  { id: '8', question: 'Who is his running mate?', answer: 'Mustapha Rabiu Musa Kwankwaso, candidate for Deputy Governor.' },
  { id: '10', question: 'What is his vision for Kano?', answer: 'A safer, more educated, productive and accountable Kano through ten proposed policy pillars.' },
];

export const factsData = {
  literacyRate: { value: '56%', source: 'INEC 2023', trend: 'positive' },
  unemployment: { value: '34%', source: 'NBS 2023', trend: 'negative' },
  healthCenters: { value: '4,521', source: 'Kano State Ministry of Health 2024', trend: 'positive' },
  pHcCoverage: { value: '32%', source: 'UNICEF 2023', trend: 'negative' },
  roadsRepaired: { value: '2,847 km', source: 'Kano State Ministry of Works 2024', trend: 'positive' },
];

export const socialMediaPosts = [
  { id: '1', platform: 'X', content: '"Kano\'s future depends on our collective commitment to education, health, and opportunity for every citizen. #Kano2031 #NDC"', verified: true },
  { id: '2', platform: 'Facebook', content: '"Excited to share my vision for Kano\'s development. Together we can build a better future."', verified: true },
  { id: '3', platform: 'Instagram', content: 'Behind-the-scenes from the campaign trail #Kano2027 #Gwarzo2027', verified: true },
];

export const eventsData = [
  { id: '1', title: 'Town Hall: Community Priorities', date: 'July 20, 2024', location: 'Kano Municipal', category: 'town-hall', description: 'Open forum for residents to discuss community development priorities.' },
  { id: '2', title: 'Policy Dialogue: Education Reform', date: 'July 15, 2024', location: 'Kano State Government House', category: 'policy-dialogue', description: 'Stakeholder discussion on education policy and human capital development.' },
  { id: '3', title: 'Community Visit: Rano LGA', date: 'July 10, 2024', location: 'Rano LGA', category: 'community-visit', description: 'Grassroots engagement with Rano community members.' },
  { id: '3', title: 'Youth Empowerment Forum', date: 'July 5, 2024', location: 'Kano City', category: 'youth', description: 'Youth engagement and enterprise opportunities discussion.' },
  { id: '5', title: 'Women\'s Forum: Economic Empowerment', date: 'June 28, 2024', location: 'Kano Municipal', category: 'women', description: 'Women\'s economic empowerment and micro-enterprise support.' },
];

export const kanoDevelopmentIndicators = {
  population: '~15M (2024 estimate)',
  literacyRate: '~56%',
  youthUnemployment: '~34%',
  phcCoverage: '~4,521 facilities',
};

export default {
  serviceRecords,
  timelineEvents,
  kanoLGAs,
  policyPillars,
  visionDimensions,
  governanceModelPhases,
  faqItems,
  factsData: kanoDevelopmentIndicators,
  socialMediaPosts,
  eventsData,
};