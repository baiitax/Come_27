/* Gwarzo 2027 — database seed.
 * Real content: migrated from the existing public website (sections are the
 * source of truth and remain in sync with the CMS).
 * Demo content: analytics & engagement samples are flagged isDemo=true and are
 * ALWAYS excluded from public-facing statistics.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ------------------------------------------------------------------ LGAs
const LGAS = [
  ['Ajingi', 'Central'], ['Albasu', 'Central'], ['Bagwai', 'Central'], ['Bebeji', 'East'],
  ['Bichi', 'East'], ['Bunkure', 'East'], ['Dala', 'Metropolitan'], ['Dambatta', 'Central'],
  ['Dawakin Kudu', 'East'], ['Dawakin Tofa', 'East'], ['Doguwa', 'Central'], ['Fagge', 'Metropolitan'],
  ['Gabasawa', 'West'], ['Garko', 'West'], ['Garum Mallam', 'East'], ['Gaya', 'Central'],
  ['Gezawa', 'Central'], ['Gwale', 'Metropolitan'], ['Gwarzo', 'West'], ['Kabo', 'Central'],
  ['Kano Municipal', 'Metropolitan'], ['Karaye', 'Central'], ['Kibiya', 'West'], ['Kiru', 'East'],
  ['Kumbotso', 'Metropolitan'], ['Kunchi', 'West'], ['Kura', 'Central'], ['Madobi', 'West'],
  ['Makoda', 'Central'], ['Minjibir', 'Central'], ['Nasarawa', 'Metropolitan'], ['Rano', 'Central'],
  ['Rimin Gado', 'West'], ['Rogo', 'West'], ['Shanono', 'West'], ['Sumaila', 'West'],
  ['Takai', 'Central'], ['Tarauni', 'Metropolitan'], ['Tofa', 'West'], ['Tsanyawa', 'Central'],
  ['Tudun Wada', 'Metropolitan'], ['Ungogo', 'Metropolitan'], ['Warawa', 'West'], ['Wudil', 'West'],
];

const ISSUE_CATEGORIES = ['education', 'water', 'roads', 'healthcare', 'agriculture', 'employment', 'security', 'youth', 'women', 'commerce'];

const ROLES = [
  ['super_admin', 'Super Administrator', 'Full access to every module, user and setting.'],
  ['content_admin', 'Content Administrator', 'Manages pages, sections, news, media and publishing.'],
  ['editor', 'Editor', 'Creates and edits content; cannot publish without approval.'],
  ['fact_checker', 'Fact Checker', 'Manages claims, evidence trails and sources.'],
  ['media_manager', 'Media Manager', 'Manages images, videos, audio and documents.'],
  ['engagement_manager', 'Engagement Manager', 'Manages community submissions, priorities and volunteers.'],
  ['analytics_manager', 'Analytics Manager', 'Views analytics, intelligence and generates reports.'],
  ['reviewer', 'Reviewer', 'Approves or rejects content and fact verdicts.'],
  ['read_only', 'Read Only', 'Dashboard and reporting access without modification.'],
];

const TIMELINE = [
  ['1990s', '', 'Teacher — early professional life', 'education', 'Kano State schools', 'Kano State', 'Classroom teaching across Kano communities, shaping young minds and building a reputation for discipline and service.', ''],
  ['1995', '', 'Community & youth leadership', 'grassroots', 'Kano Municipal', 'Kano Municipal', 'Youth and community engagement — grassroots organising, student affairs and neighbourhood development.', ''],
  ['1996', '', 'Local government administrator', 'grassroots', 'Kano Local Government', 'Kano State', 'Local government leadership managing administrative functions and community development projects.', ''],
  ['1999–2003', '', 'Institution building', 'public-service', 'Federal & State institutions', 'Kano State', 'Federal and state institutional responsibilities building administrative capacity.', ''],
  ['2011–2015', '', 'State executive', 'state-government', 'Kano State Government', 'Kano State', 'Kano State Government responsibilities overseeing state administration and development initiatives.', ''],
  ['2017–2019', '', 'Federal education governance', 'federal', 'Federal Ministry of Education', 'Abuja, FCT', 'Overseeing federal educational institutions and policies; restructured 25+ federal education agencies.', ''],
  ['2023', '', 'Deputy Governor of Kano State', 'state-government', 'Kano State Government', 'Kano State', 'Coordinated development projects across all 44 Local Government Areas of Kano State.', ''],
  ['2026', '', 'NDC candidate for Governor of Kano State', 'candidacy', 'NDC Kano State', 'Kano State', 'Nominated NDC candidate for the 2027 Kano Governorship — Amintace 2027.', ''],
];

const RECORDS = [
  ['Deputy Governor of Kano State', 'Kano State Government', '2023', 'present', 'Kano State', 'Overseeing state administration and development initiatives', 'Coordinated development projects across 44 LGAs as deputy to the executive.', '44 LGAs', 'official-record'],
  ['Federal Education Sector Governance', 'Federal Ministry of Education', '2017', '2019', 'Abuja, FCT', 'Overseeing federal educational institutions and policies', 'National-level education governance reform.', 'Reform of 25+ federal education agencies', 'official-record'],
  ['State Government Official', 'Kano State Government', '2011', '2015', 'Kano State', 'State administration and policy implementation', 'State-level executive responsibilities.', 'Development across 15 LGAs', 'official-record'],
  ['Local Government Administrator', 'Kano Municipal Government', '1996', '1999', 'Kano Municipal', 'Local government administration and community development', 'Grassroots administration at local government level.', 'Grassroots projects across 7 LGAs', 'official-record'],
  ['Community Leader', 'Kano Youth Forum', '1995', '1996', 'Kano State', 'Youth empowerment and grassroots mobilisation', 'Community organising before formal public office.', '30+ youth programmes established', 'reported'],
  ['Teacher', 'Kano State Education Board', '1990s', '1995', 'Kano State', 'Classroom instruction and educational development', 'The beginning of a public life in service of education.', 'Generations of Kano students taught', 'reported'],
];

const SECTORS = [
  ['Education', 'book', 'Kano’s classroom and university outcomes trail the national ambition for the state.', 'Kano State University transformation and human capital development are central to the 2027 agenda.', 'Invest in teachers, classrooms, laboratories and state university governance.', ['Improve literacy and retention', 'Transform Kano State University', 'Expand technical and vocational training'], ['Classrooms built', 'Teachers trained', 'Enrolment growth']],
  ['Healthcare', 'heart', 'Primary healthcare coverage is uneven across the 44 LGAs.', 'Ten primary health centres were commissioned in 2024 across five LGAs as a demonstration of delivery.', 'Extend primary healthcare, emergency response and equipment across all LGAs.', ['PHC coverage in every LGA', 'Reduce maternal and child mortality', 'Equip emergency services'], ['PHCs commissioned', 'LGAs covered', 'Patients reached']],
  ['Water', 'droplet', 'Reliable water supply is a daily challenge in many wards, especially outside the metropolis.', 'Rural and peri-urban water access is a stated 2027 priority.', 'Borehole expansion, water treatment rehabilitation and LGAs-level water utilities.', ['Water access in every ward', 'Treat and rehabilitate sources', 'Sustainable water governance'], ['Boreholes completed', 'Wards with water access']],
  ['Roads', 'road', 'Inter-LGA and rural road networks are in poor state in many areas.', 'Road maintenance is a recurring community priority.', 'Rehabilitate inter-LGA roads and build rural feeder roads with maintenance funds.', ['Inter-LGA road rehabilitation', 'Rural feeder roads', 'Sustainable maintenance funds'], ['km rehabilitated', 'Rural roads built']],
  ['Agriculture', 'wheat', 'Kano’s economy remains agriculture-led; value addition is low.', 'Irrigation, market access and livestock value chains are the growth levers.', 'Support irrigation, agro-processing and market access for farmers and herders.', ['Irrigation expansion', 'Agro-processing zones', 'Farmer-market linkage'], ['Hectares irrigated', 'Farmers supported']],
  ['Employment & Youth', 'briefcase', 'Youth unemployment and under-employment drive restlessness.', 'Enterprise, skills and entrepreneurship are the response.', 'Launch youth enterprise funds, skills academies and apprenticeship pathways.', ['Youth enterprise fund', 'Skills academies in every LGA', 'Apprenticeship pipelines'], ['Jobs created', 'Youth trained']],
  ['Security', 'shield', 'Communities expect a visible, accountable security architecture.', 'Security is a government responsibility to be delivered with accountability.', 'Community policing, better coordination and transparent reporting.', ['Community policing model', 'Coordination command centre', 'Transparent reporting'], ['Wards covered']],
  ['Commerce & Markets', 'store', 'Markets are Kano’s historic economic engine.', 'Modernisation must preserve the heritage and scale of Kano’s trade.', 'Market infrastructure, micro-finance and digital payments in market clusters.', ['Market infrastructure upgrades', 'Micro-finance for traders', 'Digital payments'], ['Markets upgraded', 'Traders financed']],
];

const SPEECHES = [
  ['Education reform position statement', 'Policy briefing', '05 Jul 2024', 'Abuja', 'Abuja', 'Detailed position on education human capital development and Kano State University transformation.', 'education, policy', 'published'],
  ['Campaign launch address', 'Campaign launch', '01 Jul 2024', 'Kano', 'Kano City', 'Launch of the 2027 governorship campaign and the digital outreach programme.', 'campaign', 'published'],
  ['Arewa Consultative Forum address', 'ACF session', '25 Jun 2024', 'Kano', 'Kano City', 'Deliberations on northern Nigeria development and security.', 'development, security', 'published'],
];

const ARTICLES = [
  ['gwarzo-commissions-10-health-centres', 'Gwarzo commissions 10 health centres across Kano', 'news', 'Kano State', 'The NDC governorship candidate commissioned 10 primary health centres across 5 LGAs, expanding healthcare access.', 'healthcare, kano', 'published', 0],
  ['town-hall-women-traders', 'Town hall with women traders in Kano Municipal', 'event', 'Kano Municipal', 'Engagement with women traders on market access, micro-finance, and enterprise support programmes.', 'community, commerce', 'published', 0],
  ['press-release-digital-outreach', 'Press release: campaign launches digital outreach', 'press-release', 'Kano', 'New digital platforms for constituent engagement and campaign communication.', 'campaign, media', 'published', 0],
  ['draft-education-reform-position', 'Education reform position (full document)', 'policy', 'Abuja', 'Full position paper on education human capital development and Kano State University transformation. Awaiting fact review before publication.', 'education, policy', 'draft', 0],
];

const CLAIMS = [
  ['Kano’s literacy rate is 95%', 'Circulating in local media', 'education', 'under-review', ''],
  ['44 LGAs received development allocations in 2023', 'Campaign claim pending official budget cross-check', 'public-service', 'under-review', ''],
  ['Comrade Gwarzo served as Deputy Governor of Kano State', 'Public record — state government service documentation', 'public-service', 'verified', 'Verified against state government service records.'],
];

const SOURCES = [
  ['Kano State Government service records', 'Kano State Government', 'official-record', 'official'],
  ['Federal Ministry of Education — institutional review', 'Federal Ministry of Education', 'government', 'official'],
  ['INEC 2023 publication data', 'Independent National Electoral Commission', 'election-body', 'official'],
];

// ------------------------------------------------------------------ demo
function iso(daysAgo) {
  return new Date(Date.now() - daysAgo * 86400000);
}

async function main() {
  // Idempotency guard: only seed an empty database (safe in build pipelines).
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('SEED SKIPPED — database already contains data (idempotent guard).');
    return;
  }
  // wipe (dev database only)
  await prisma.alert.deleteMany();
  await prisma.report.deleteMany();
  await prisma.contentVersion.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.communitySubmission.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.source.deleteMany();
  await prisma.document.deleteMany();
  await prisma.policyInitiative.deleteMany();
  await prisma.policySector.deleteMany();
  await prisma.mediaAlbum.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.campaignEvent.deleteMany();
  await prisma.speech.deleteMany();
  await prisma.article.deleteMany();
  await prisma.serviceRecord.deleteMany();
  await prisma.timelineEntry.deleteMany();
  await prisma.navigationItem.deleteMany();
  await prisma.pageSection.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.issueCategory.deleteMany();
  await prisma.lga.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  // users
  const adminHash = await bcrypt.hash('Gwarzo@2027!', 12);
  const editorHash = await bcrypt.hash('Editor@2027!', 12);
  await prisma.user.create({ data: { name: 'Campaign Director', email: 'admin@gwarzo2027.ng', role: 'super_admin', passwordHash: adminHash } });
  await prisma.user.create({ data: { name: 'Content Editor', email: 'editor@gwarzo2027.ng', role: 'editor', passwordHash: editorHash } });

  // roles
  for (const [name, label, desc] of ROLES) {
    const ROLE_PERMS = {
    super_admin: ['*'],
    content_admin: ['content.create','content.edit','content.publish','content.delete','content.archive','sections.manage','navigation.manage','homepage.manage','media.upload','media.manage','analytics.view','engagement.view','facts.view','seo.manage','reports.generate'],
    editor: ['content.create','content.edit','facts.view','media.upload','engagement.view'],
    fact_checker: ['facts.view','facts.edit','facts.verify','content.view','media.view'],
    media_manager: ['media.upload','media.manage','media.view','content.view'],
    engagement_manager: ['engagement.view','engagement.respond','engagement.assign','volunteers.manage','content.view'],
    analytics_manager: ['analytics.view','intelligence.view','reports.generate'],
    reviewer: ['content.view','content.approve','content.reject','facts.verify'],
    read_only: ['dashboard.view','analytics.view','content.view'],
  };
  await prisma.role.create({ data: { name, description: label + ' — ' + desc, permissions: JSON.stringify(ROLE_PERMS[name] ?? []) } });
  }

  // settings
  const settings = [
    ['brand.campaignName', 'Gwarzo 2027'],
    ['brand.tagline', 'For a Better Kano'],
    ['brand.primaryColor', '#00795B'],
    ['brand.accentColor', '#A31621'],
    ['contact.email', 'hello@gwarzo2027.ng'],
    ['contact.phone', '+234 800 GWARZO 1'],
    ['contact.address', 'Gwarzo House, Kano City, Kano State'],
    ['contact.x', ''],
    ['contact.facebook', ''],
    ['contact.instagram', ''],
    ['site.title', 'Comrade Aminu Abdussalam Gwarzo | 2027 Kano Governorship'],
    ['site.description', 'Official digital portfolio — NDC candidate for Governor of Kano State 2027.'],
    ['site.analyticsId', ''],
    ['footer.copyright', '© Gwarzo 2027 Campaign. All rights reserved.'],
    ['footer.disclaimer', 'Community priority statistics are published only once sufficient submissions are collected.'],
  ];
  for (const [k, v] of settings) await prisma.siteSetting.create({ data: { key: k, value: v } });

  // candidate
  await prisma.candidate.create({
    data: {
      displayName: 'Comrade Aminu Abdussalam Gwarzo',
      fullName: 'Comrade Aminu Abdussalam Gwarzo',
      title: 'NDC Candidate for Governor of Kano State 2027',
      tagline: 'A lifetime of service. A new responsibility to Kano.',
      shortBio: 'A public servant, grassroots leader and former Deputy Governor of Kano State seeking to bring decades of institutional and community experience to Kano’s next chapter.',
      longBio: 'Comrade Aminu AbdullSalam Gwarzo is a public servant and grassroots leader who has spent his life in the service of Kano State. From the classroom to the federal ministry to the governor’s chamber, his career has been defined by one constant: responsibility delivered quietly, one institution at a time.\n\nAs former Deputy Governor of Kano State he coordinated development across all 44 Local Government Areas. As a federal education official he restructured institutions that shape millions of Nigerians. And long before either, he built his name the hard way — among the people.\n\nIn 2027, he brings that lifetime of service to a new responsibility: the leadership of Kano State.',
      philosophy: 'Service before self. Accountability before applause.',
      profileImageUrl: '/images/hero/gwarzo-hero.jpg',
      socialJson: JSON.stringify({ twitterGuild: 'Kwankwasiya Twitter Guild' }),
    },
  });

  // stats
  const stats = [
    ['27+', 'Years in public service', 'green', 1],
    ['44', 'LGAs to empower', 'gold', 2],
    ['2027', 'Governorship', 'crimson', 3],
  ];
  for (const [value, label, accent, sort] of stats) await prisma.stat.create({ data: { value, label, accent, sort } });

  // sections (homepage builder)
  const sections = [
    ['hero', 'Hero', 1], ['stats', 'Statistics', 2], ['why-gwarzo', 'Why Gwarzo', 3], ['journey', 'Journey', 4],
    ['record', 'Record', 5], ['transition', 'The 2026 Transition', 6], ['kwankwasiyya', 'Kwankwasiya', 7],
    ['facts', 'Facts & Transparency', 8], ['moments', 'Moments of Service', 9], ['engagement', 'Community Engagement', 10],
    ['media', 'Media Center', 11], ['cta', 'Call to Action', 12],
  ];
  for (const [key, title, sort] of sections) await prisma.pageSection.create({ data: { key, title, sort } });

  // navigation
  const nav = [
    ['Home', '/', 1], ['About', '/about', 2], ['Record', '/#record', 3], ['Kano', '/kano', 4],
    ['Vision', '/#vision', 5], ['Media', '/#media', 6], ['Facts', '/facts', 7], ['Engage', '/#engage', 8],
  ];
  for (const [label, href, sort] of nav) await prisma.navigationItem.create({ data: { label, href, sort } });

  // timeline
  for (let i = 0; i < TIMELINE.length; i++) {
    const [year, date, title, category, institution, location, description, impact] = TIMELINE[i];
    await prisma.timelineEntry.create({
      data: {
        year, date: date || null, title, category, institution, location, description, impact,
        evidenceLevel: category === 'candidacy' ? 'campaign-claim' : 'official-record',
        source: category === 'candidacy' ? 'NDC Kano State nomination' : null,
        sort: i,
      },
    });
  }

  // records
  for (const [position, institution, startDate, endDate, location, responsibilities, description, impact, evidenceStatus] of RECORDS) {
    await prisma.serviceRecord.create({
      data: { position, institution, startDate, endDate, location, responsibilities, description, impact, evidenceStatus },
    });
  }

  // sectors
  for (const [name, icon, problem, context, approach, objectives, metrics] of SECTORS) {
    const sector = await prisma.policySector.create({
      data: { name, icon, problemStatement: problem, currentContext: context, approach, objectivesJson: JSON.stringify(objectives), metricsJson: JSON.stringify(metrics) },
    });
    for (let i = 0; i < 2; i++) {
      await prisma.policyInitiative.create({ data: { sectorId: sector.id, title: `${name}: initiative ${i + 1} (draft — to be detailed with the policy team)`, sort: i } });
    }
  }

  // LGAs
  const lgaIds = [];
  for (const [name, district] of LGAS) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const l = await prisma.lga.create({ data: { name, slug, senatorialDistrict: district } });
    lgaIds.push(l.id);
  }

  // issue categories
  const topicIds = {};
  for (const name of ISSUE_CATEGORIES) {
    const c = await prisma.issueCategory.create({ data: { name } });
    topicIds[name] = c.id;
  }

  // speeches
  for (const [title, eventName, eventDate, venue, location, summary, themes, status] of SPEECHES) {
    await prisma.speech.create({
      data: { title, eventName, eventDate, venue, location, summary, themesJson: JSON.stringify(themes.split(', ')), status, publishedAt: status === 'published' ? iso(400) : null, isDemo: false },
    });
  }

  // articles
  for (const [slug, title, category, location, body, tags, status, isDemo] of ARTICLES) {
    await prisma.article.create({
      data: {
        slug, title, category, location, body, tagsJson: JSON.stringify(tags.split(', ')),
        status, isDemo: !!isDemo,
        publishedAt: status === 'published' ? iso(420) : null,
        seoTitle: status === 'published' ? title : null,
        seoDescription: status === 'published' ? body.slice(0, 150) : null,
      },
    });
  }

  // sources & claims & evidence
  const srcs = [];
  for (const [title, publisher, type, reliability] of SOURCES) {
    srcs.push(await prisma.source.create({ data: { title, publisher, type, reliability, verifiedAt: new Date() } }));
  }
  for (let i = 0; i < CLAIMS.length; i++) {
    const [statement, context, category, status, notes] = CLAIMS[i];
    const claim = await prisma.claim.create({
      data: { statement, context, category, status, verdictNotes: notes, verifiedBy: status === 'verified' ? 'Fact Desk' : null, verifiedAt: status === 'verified' ? new Date() : null },
    });
    if (i === 0) {
      await prisma.evidence.create({ data: { claimId: claim.id, type: 'url', title: 'INEC 2023 data reference (to be attached by fact desk)', notes: 'Cited in the public fact-check card — pending verification.' , sourceId: srcs[2].id } });
    }
    if (i === 2) {
      await prisma.evidence.create({ data: { claimId: claim.id, type: 'official-record', title: 'Kano State Government service records', sourceId: srcs[0].id } });
    }
  }

  // ---- 2026 political transition (migrated from existing site, with attribution) ----
  const TRANSITION = [
    ['2026', 'Political Realignment', 'Officially documented political realignment within Kano state politics.', 'The Kano State Government', 'State government documentation', '', '', 'official-record'],
    ['2026', 'Differences in Political Direction', 'Reported differences in political direction and approach between state leadership.', 'Various political stakeholders', 'Political reporting', '', '', 'reported'],
    ['2026', 'Impeachment Proceedings', 'The Kano State House of Assembly alleged impeachment proceedings.', 'Kano State House of Assembly', 'Assembly statements', '', 'The candidate has formally responded to the allegations; the proceedings were subsequently withdrawn.', 'reported'],
    ['2026', "Candidate's Response", "Comrade Gwarzo issued a formal response to the allegations.", 'Comrade Aminu Abdussalam Gwarzo campaign', 'Campaign statement', '', '', 'campaign-claim'],
    ['2026', 'Resignation', 'Official resignation from the Deputy Governorship position.', 'Comrade Aminu Abdussalam Gwarzo', 'Resignation letter', '', '', 'official-record'],
    ['2026', 'Withdrawal of Proceedings', 'Withdrawal of the impeachment proceedings.', 'Kano State House of Assembly', 'Assembly records', '', '', 'reported'],
    ['2026', 'NDC Candidacy', 'Emergence as the NDC Kano governorship candidate for 2027.', 'Nigeria Democratic Congress (NDC)', 'NDC Kano State', '', '', 'official-record'],
  ];
  for (let i = 0; i < TRANSITION.length; i++) {
    const [date, title, whatHappened, attribution, source, document, response, evidenceStatus] = TRANSITION[i];
    await prisma.transitionEvent.create({ data: { date, title, whatHappened, attribution, source, document, response, evidenceStatus, sort: i } });
  }

  // ---- additional vision sectors (12-pillar architecture) ----
  const EXTRA_SECTORS = [
    ['Youth', 'sprout', 'Youth unemployment and under-employment drive restlessness in Kano.', 'Kano is one of the youngest states in Nigeria; opportunity is the core demand.', 'Skills, enterprise and apprenticeship pathways in every LGA.', 'Youth enterprise fund in all 44 LGAs', 'Skills academies; apprenticeship pipelines'],
    ['Women', 'users', 'Women remain under-represented in enterprise, leadership and economic participation.', 'Market women and women farmers are central to Kano’s economy.', 'Market access, micro-finance and leadership pipelines for women.', 'Trader micro-finance in every market cluster', 'Women-led enterprise support'],
    ['Digital Economy', 'monitor', 'Kano’s commercial potential is under-digitised; connectivity lags peer cities.', 'A young, mobile-connected population is an asset to build on.', 'Broadband expansion, digital skills and an e-services government.', 'Broadband coverage targets', 'Digital skills centres'],
    ['Human Capital', 'book-open', 'Health and education outcomes decide whether Kano’s demographics become an asset.', 'Human capital is the foundation of every other sector in this plan.', 'Invest in teachers, doctors, classrooms and clinics first.', 'Teacher and health-worker incentives', 'Classroom and clinic expansion'],
  ];
  for (const [name, icon, problem, context, approach, ...rest] of EXTRA_SECTORS) {
    if (await prisma.policySector.findUnique({ where: { name } })) continue;
    const objectives = rest[0] ? [rest[0]] : [];
    const initiatives = rest[1] ? [rest[1]] : [];
    const sector = await prisma.policySector.create({
      data: { name, icon, problemStatement: problem, currentContext: context, approach, objectivesJson: JSON.stringify(objectives), researchJson: JSON.stringify([]), published: true },
    });
    const inits = initiatives.map((title, i) => ({ sectorId: sector.id, title, sort: i }));
    if (inits.length) await prisma.policyInitiative.createMany({ data: inits });
  }

  // ---- fourth hero stat ----
  if (!(await prisma.stat.findFirst({ where: { value: 'NDC' } }))) {
    await prisma.stat.create({ data: { value: 'NDC', label: 'Candidate', accent: 'crimson', sort: 4 } });
  }

  // ---------------- DEMO engagement (flagged, excluded from public stats) ----------------
  const demoTopics = ['water', 'roads', 'education', 'healthcare', 'employment'];
  for (let i = 0; i < 14; i++) {
    await prisma.communitySubmission.create({
      data: {
        lgaId: lgaIds[i % 12],
        topicId: topicIds[demoTopics[i % demoTopics.length]],
        topicName: demoTopics[i % demoTopics.length],
        message: `[DEMO DATA] Sample community submission #${i + 1} — ${demoTopics[i % demoTopics.length]} priority submitted through the public form for workflow testing.`,
        consent: true,
        status: ['new', 'acknowledged', 'under-review', 'responded'][i % 4],
        isDemo: true,
        createdAt: iso(i),
      },
    });
  }

  // demo volunteers
  for (let i = 0; i < 6; i++) {
    await prisma.volunteer.create({ data: { name: `[DEMO] Volunteer ${i + 1}`, phone: '+234 800 000 0000', lgaId: lgaIds[i % 10], status: i < 3 ? 'active' : 'pending', skills: 'Canvassing, social media' } });
  }

  // demo events
  await prisma.campaignEvent.create({
    data: { name: '[DEMO] Town hall — Gwale LGA', description: 'Demo event for workflow testing.', startsAt: new Date(Date.now() + 6 * 86400000), venue: 'Gwale', lgaId: lgaIds[LGAS.findIndex((l) => l[0] === 'Gwale')], category: 'townhall', status: 'upcoming', isDemo: true },
  });

  // demo analytics (excluded everywhere public)
  const paths = ['/', '/about', '/facts', '/kano', '/news'];
  for (let d = 29; d >= 0; d--) {
    const n = 2 + Math.floor(Math.sin(d / 4) * 2 + 3) + (d % 5);
    for (let i = 0; i < n; i++) {
      const p = paths[(d + i) % paths.length];
      await prisma.analyticsEvent.create({
        data: { type: 'page_view', path: p, sessionId: `demo-${d}-${i}`, referrer: i % 3 === 0 ? 'x.com' : null, isDemo: true, createdAt: iso(d) },
      });
    }
  }

  // demo alert
  await prisma.alert.create({ data: { severity: 'medium', title: 'Demo: submissions volume sample loaded', reason: 'DEMO DATA — seed loaded sample engagement for workflow preview.', action: 'Review the engagement queue (demo records are flagged).' } });

  console.log('SEED COMPLETE');
  console.log('  LGAs:', LGAS.length, '| roles:', ROLES.length, '| users: 2 (admin@gwarzo2027.ng / Gwarzo@2027!)');
  console.log('  DEMO records are flagged isDemo=true and excluded from public statistics.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
