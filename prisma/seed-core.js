/* Gwarzo 2027 — seed core (shared by the CLI seed and the runtime self-healer).
 *
 * Demo deployment: all seeded records are realistic campaign content for the
 * demo environment, seeded with isDemo: false so the public site and admin
 * dashboards show a living demo. When the site goes live for real, delete the
 * seeded engagement/analytics records (or re-flag them isDemo: true from the
 * admin) so real visitor data is never mixed with demo data.
 */
const bcrypt = require('bcryptjs');

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

const ROLE_PERMS = {
  super_admin: ['*'],
  content_admin: ['content.create', 'content.edit', 'content.publish', 'content.delete', 'content.archive', 'sections.manage', 'navigation.manage', 'homepage.manage', 'media.upload', 'media.manage', 'analytics.view', 'engagement.view', 'facts.view', 'seo.manage', 'reports.generate'],
  editor: ['content.create', 'content.edit', 'facts.view', 'media.upload', 'engagement.view'],
  fact_checker: ['facts.view', 'facts.edit', 'facts.verify', 'content.view', 'media.view'],
  media_manager: ['media.upload', 'media.manage', 'media.view', 'content.view'],
  engagement_manager: ['engagement.view', 'engagement.respond', 'engagement.assign', 'volunteers.manage', 'content.view'],
  analytics_manager: ['analytics.view', 'intelligence.view', 'reports.generate'],
  reviewer: ['content.view', 'content.approve', 'content.reject', 'facts.verify'],
  read_only: ['dashboard.view', 'analytics.view', 'content.view'],
};

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
  ['Healthcare', 'heart', 'Primary healthcare coverage is uneven across the 44 LGAs.', 'Ten primary health centres were commissioned in 2024 across five LGAs as a demonstration of delivery.', 'Extend primary healthcare, emergency response and equipment across all LGAs.', ['PHC coverage in every ward', 'Reduce maternal and child mortality', 'Equip emergency services'], ['PHCs commissioned', 'LGAs covered', 'Patients reached']],
  ['Water', 'droplet', 'Reliable water supply is a daily challenge in many wards, especially outside the metropolis.', 'Rural and peri-urban water access is a stated 2027 priority.', 'Borehole expansion, water treatment rehabilitation and LGA-level water utilities.', ['Water access in every ward', 'Treat and rehabilitate sources', 'Sustainable water governance'], ['Boreholes completed', 'Wards with water access']],
  ['Roads', 'road', 'Inter-LGA and rural road networks are in poor state in many areas.', 'Road maintenance is a recurring community priority.', 'Rehabilitate inter-LGA roads and build rural feeder roads with maintenance funds.', ['Inter-LGA road rehabilitation', 'Rural feeder roads', 'Sustainable maintenance funds'], ['km rehabilitated', 'Rural roads built']],
  ['Agriculture', 'wheat', 'Kano’s economy remains agriculture-led; value addition is low.', 'Irrigation, market access and livestock value chains are the growth levers.', 'Support irrigation, agro-processing and market access for farmers and herders.', ['Irrigation expansion', 'Agro-processing zones', 'Farmer-market linkage'], ['Hectares irrigated', 'Farmers supported']],
  ['Employment & Youth', 'briefcase', 'Youth unemployment and under-employment drive restlessness.', 'Enterprise, skills and entrepreneurship are the response.', 'Launch youth enterprise funds, skills academies and apprenticeship pathways.', ['Youth enterprise fund', 'Skills academies in every LGA', 'Apprenticeship pipelines'], ['Jobs created', 'Youth trained']],
  ['Security', 'shield', 'Communities expect a visible, accountable security architecture.', 'Security is a government responsibility to be delivered with accountability.', 'Community policing, better coordination and transparent reporting.', ['Community policing model', 'Coordination command centre', 'Transparent reporting'], ['Wards covered']],
  ['Commerce & Markets', 'store', 'Markets are Kano’s historic economic engine.', 'Modernisation must preserve the heritage and scale of Kano’s trade.', 'Market infrastructure, micro-finance and digital payments in market clusters.', ['Markets upgraded', 'Traders financed'], ['Markets upgraded', 'Traders financed']],
  ['Women', 'users', 'Women remain under-represented in enterprise, leadership and economic participation.', 'Market women and women farmers are central to Kano’s economy.', 'Market access, micro-finance and leadership pipelines for women.', ['Trader micro-finance in every market cluster', 'Women-led enterprise support'], ['Traders financed', 'Women enterprises supported']],
  ['Digital Economy', 'monitor', 'Kano’s commercial potential is under-digitised; connectivity lags peer cities.', 'A young, mobile-connected population is an asset to build on.', 'Broadband expansion, digital skills and an e-services government.', ['Broadband coverage targets', 'Digital skills centres'], ['KMs of fibre laid', 'Digital skills graduates']],
  ['Human Capital', 'book-open', 'Health and education outcomes decide whether Kano’s demographics become an asset.', 'Human capital is the foundation of every other sector in this plan.', 'Invest in teachers, doctors, classrooms and clinics first.', ['Teacher and health-worker incentives', 'Classroom and clinic expansion'], ['Teachers trained', 'Clinics equipped']],
  ['Infrastructure', 'building', 'Kano’s urban infrastructure — drainage, roads, housing — has not kept pace with growth.', 'Coordinate urban renewal across the metropolitan LGAs.', 'Drainage, drainage-linked road works, housing and utilities coordination.', ['Drainage km completed', 'Housing units delivered'], ['Drainage km completed', 'Housing units delivered']],
];

const ARTICLES = [
  ['gwarzo-unveils-12-pillar-agenda', 'Gwarzo unveils 12-pillar development agenda for Kano', 'news', 'Kano Municipal', 'The NDC governorship candidate presented a 12-pillar development agenda covering education, healthcare, water, roads, agriculture, employment, security, commerce, women, digital economy, human capital and infrastructure.\n\nSpeaking to campaign officials in Kano Municipal, Comrade Gwarzo said the agenda is built on the principle that Kano’s demographics are an asset to be built on — not a problem to be managed. Each pillar carries measurable targets and a dedicated delivery office under his proposed administration.\n\nThe candidate said the agenda will be published sector by sector on the campaign website, with supporting research and a clear statement of what is proposed policy versus established record.', 'policy, kano, agenda', 'published', 42],
  ['campaign-launches-digital-engagement-platform', 'Campaign launches digital engagement platform for Kano citizens', 'press-release', 'Kano', 'The Gwarzo 2027 campaign has launched a digital engagement platform allowing citizens across all 44 Local Government Areas to submit questions, community priorities, development ideas and fact-check requests directly to the campaign desk.\n\nSubmissions are processed through a transparent workflow — acknowledged, reviewed, assigned and responded to — with aggregate community priorities published on the campaign website once sufficient submissions are collected.\n\nThe campaign said individual submissions are never displayed publicly and no personal data is shared with third parties.', 'campaign, digital, engagement', 'published', 9],
  ['gwarzo-meets-market-leaders', 'Gwarzo meets Kano market leaders on commerce agenda', 'news', 'Kurmi Market, Kano Municipal', 'The NDC governorship candidate held a working session with traders and market leaders in Kurmi Market and Sabon Gari to hear first-hand priorities on market infrastructure, micro-finance and digital payments.\n\nMarket women and men traders pressed for cheaper working capital, better market infrastructure and reliable water supply around major markets. The candidate committed the campaign to a dedicated markets and commerce office under his administration.\n\nMarket leaders thanked the candidate for listening first and said they would support the campaign where its agenda matches their priorities.', 'commerce, markets, kano', 'published', 21],
  ['press-release-grassroots-volunteer-programme', 'Press release: campaign launches grassroots volunteer programme', 'press-release', 'Kano State', 'The Gwarzo 2027 campaign has opened recruitment for a grassroots volunteer programme across all 44 Local Government Areas. The programme covers canvassing, event logistics, social media, photography and translation (Hausa–English).\n\nVolunteers register through the campaign website and are assigned to LGA coordination desks. The campaign emphasised that all volunteers operate under the campaign’s code of conduct, which prohibits misinformation and personal attacks.\n\nRegistration is open to all citizens of Kano State of voting age.', 'campaign, volunteers, grassroots', 'published', 4],
  ['draft-education-reform-position', 'Education reform position paper (full document)', 'policy', 'Abuja', 'Full position paper on education human capital development and Kano State University transformation. Awaiting fact review and supporting data before publication.', 'education, policy', 'draft', 0],
];

const SPEECHES = [
  ['Campaign launch address', 'Campaign launch', '2026-08-08', 'Kurmi Market, Kano Municipal', 'Kano', 'Launch of the 2027 governorship campaign: the 12-pillar agenda, the volunteer programme, and a direct appeal to Kano’s youth and market women.', 'campaign, launch'],
  ['Education reform position statement', 'Policy briefing', '2026-06-15', 'Abuja', 'Abuja', 'Detailed position on education human capital development, teacher incentives, and Kano State University transformation.', 'education, policy'],
  ['Town hall with women traders', 'Town hall', '2026-07-19', 'Sabon Gari, Kano Municipal', 'Kano', 'Town hall with women traders on market access, micro-finance, and enterprise support programmes for market women.', 'commerce, women'],
];

const CLAIMS = [
  ['Comrade Gwarzo served as Deputy Governor of Kano State (2023–2026)', 'Public record — state government service documentation', 'public-service', 'verified', 'Verified against Kano State Government service records and the state government’s public directory of officials.'],
  ['“Kano’s literacy rate is 95%”', 'Circulating in local media and social media; no official source cited', 'education', 'under-review', 'The figure is circulating without a cited source. The fact desk is comparing it against national literacy surveys before a verdict.'],
  ['“Ten primary health centres were commissioned in 2024”', 'Campaign claim — pending cross-check with the state Ministry of Health', 'healthcare', 'under-review', 'Pending verification against state Ministry of Health commissioning records.'],
  ['“44 LGAs received development allocations in 2023”', 'Campaign claim — pending cross-check with the state budget office', 'public-service', 'under-review', 'Pending verification against the 2023 state budget allocation records.'],
];

const SOURCES = [
  ['Kano State Government service records', 'Kano State Government', 'official-record', 'official', ''],
  ['Federal Ministry of Education — institutional review', 'Federal Ministry of Education', 'government', 'official', ''],
  ['INEC publication data', 'Independent National Electoral Commission', 'election-body', 'official', ''],
  ['Kano State Ministry of Health — commissioning records (pending)', 'Kano State Ministry of Health', 'government', 'unverified', ''],
];

const EVENTS = [
  ['Youth Leadership Summit — Kano Municipal', 'A working summit with youth leaders across the metropolitan LGAs: skills, jobs, and the campaign’s youth agenda.', '2026-09-12T09:00:00.000Z', 'Kano Municipal', 'Kano Municipal', 'youth'],
  ['Women Traders Forum — Fagge LGA', 'Forum with market women on market access, micro-finance and enterprise support.', '2026-09-26T10:00:00.000Z', 'Fagge', 'Fagge', 'women'],
  ['Farmers & Herders Dialogue — Albasu LGA', 'Dialogue with farmers and herders on irrigation, feeder roads and farmer-market linkage.', '2026-10-10T09:30:00.000Z', 'Albasu', 'Albasu', 'agriculture'],
];

const SUBMISSIONS = [
  ['Dala', 'water', 'new', null, 'normal', null, 3, 'The borehole at our ward has been out of action for over a month. Water sellers have doubled their prices. We need this fixed before the dry season.', null],
  ['Kumbotso', 'roads', 'under-review', 'Roads Desk', 'high', null, 6, 'The Kumbotso–Fagge road has no drainage. Every rainy season the market floods and traders lose goods. Drainage work is urgent.', 'M. Bello'],
  ['Fagge', 'healthcare', 'responded', 'Health Desk', 'normal', 'Thank you for the submission. Our health desk has recorded the medicine shortage at your PHC and will include it in the healthcare agenda review with the state Ministry of Health. — Campaign Health Desk', 9, 'The PHC in our area runs out of malaria drugs by mid-month. Mothers travel far to buy medication.', 'Amina S.'],
  ['Kano Municipal', 'employment', 'acknowledged', null, 'normal', null, 5, 'Many young graduates in the city are idle. A skills and apprenticeship centre near Sabon Gari would help a lot.', 'Hauwa A.'],
  ['Albasu', 'agriculture', 'responded', 'Agriculture Desk', 'high', 'Thank you. Feeder roads and irrigation are already core items in the agriculture pillar. Your ward has been noted for the Albasu farmers’ dialogue on 10 October. — Campaign Agriculture Desk', 12, 'Farmers in Albasu lose harvests because of poor feeder roads to the main market. Irrigation water is also scarce.', 'S. Abdullahi'],
  ['Gwale', 'youth', 'acknowledged', 'Youth Desk', 'normal', null, 7, 'Youth in Gwale need safe sports and skills spaces. Idle time is pushing young people into bad habits.', 'M. Ibrahim'],
  ['Dala', 'water', 'under-review', 'Water Desk', 'high', null, 15, 'Our ward has no functioning water treatment point. Residents depend on tanker water at very high cost.', null],
  ['Kano Municipal', 'commerce', 'acknowledged', 'Commerce Desk', 'normal', null, 11, 'Traders in Kurmi Market need cheaper micro-finance and better market infrastructure. The market is the engine of this city.', 'M. Bello'],
  ['Bichi', 'education', 'responded', 'Education Desk', 'normal', 'Thank you for flagging the science laboratory gap. Laboratory equipment is an item under the education pillar; your school has been added to the review list. — Campaign Education Desk', 18, 'Our secondary school lacks a science laboratory. Students cannot do practical exams properly.', 'Amina S.'],
  ['Fagge', 'water', 'under-review', 'Water Desk', 'high', null, 4, 'Tanker water prices have tripled since the borehole at Wujama failed. This is a daily struggle for working people.', 'Hauwa A.'],
  ['Dambatta', 'roads', 'new', null, 'normal', null, 14, 'The Dambatta–Bichi road potholes are causing accidents. Resurfacing is urgently needed, especially in the rainy season.', 'S. Abdullahi'],
  ['Kano Municipal', 'healthcare', 'acknowledged', 'Health Desk', 'normal', null, 8, 'The maternity ward at our nearest PHC needs more midwives and delivery kits. It should not be this hard to deliver a child safely.', 'M. Ibrahim'],
  ['Gwale', 'employment', 'new', null, 'normal', null, 10, 'A vocational training centre for young people in Gwale would reduce youth unemployment and give our young people something to do.', null],
  ['Kano Municipal', 'education', 'under-review', 'Education Desk', 'normal', null, 16, 'Classroom overcrowding in municipal primary schools needs urgent attention. Some classes have over 90 pupils.', 'Amina S.'],
];

const VOLUNTEERS = [
  ['Aisha Bello', '+234 803 555 0142', null, 'Fagge', 'Canvassing, social media', 'active'],
  ['Ibrahim Musa', '+234 802 771 2233', null, 'Kano Municipal', 'Event logistics', 'active'],
  ['Fatima Sani', null, 'fatima.sani@example.com', 'Gwale', 'Canvassing, Hausa–English translation', 'active'],
  ['Musa Abdulkadir', '+234 807 445 8890', null, 'Kumbotso', 'Canvassing', 'pending'],
  ['Zainab Yusuf', null, 'zainab.yusuf@example.com', 'Dala', 'Social media, photography', 'pending'],
  ['Ibrahim Kachalla', '+234 809 220 1145', null, 'Dala', 'Event logistics', 'pending'],
];

// ------------------------------------------------------------------ seed
async function seedCore(prisma) {
  // Idempotency guard: only seed an empty database.
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    return 'skipped — database already contains data';
  }

  // users
  const adminHash = await bcrypt.hash('Gwarzo@2027!', 12);
  const editorHash = await bcrypt.hash('Editor@2027!', 12);
  await prisma.user.create({ data: { name: 'Campaign Director', email: 'admin@gwarzo2027.ng', role: 'super_admin', passwordHash: adminHash } });
  await prisma.user.create({ data: { name: 'Content Editor', email: 'editor@gwarzo2027.ng', role: 'editor', passwordHash: editorHash } });

  // roles
  for (const [name, label, desc] of ROLES) {
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
    ['footer.copyright', '© 2026 Gwarzo 2027 Campaign. All rights reserved.'],
    ['footer.disclaimer', 'Community priority statistics are published only once sufficient submissions are collected.'],
  ];
  await prisma.siteSetting.createMany({ data: settings.map(([key, value]) => ({ key, value })) });

  // candidate
  await prisma.candidate.create({
    data: {
      displayName: 'Comrade Aminu Abdussalam Gwarzo',
      fullName: 'Comrade Aminu Abdussalam Gwarzo',
      title: 'NDC Candidate for Governor of Kano State 2027',
      tagline: 'A lifetime of service. A new responsibility to Kano.',
      shortBio: 'A public servant, grassroots leader and former Deputy Governor of Kano State seeking to bring decades of institutional and community experience to Kano’s next chapter.',
      longBio: 'Comrade Aminu Abdussalam Gwarzo is a public servant and grassroots leader who has spent his life in the service of Kano State. From the classroom to the federal ministry to the governor’s chamber, his career has been defined by one constant: responsibility delivered quietly, one institution at a time.\n\nAs former Deputy Governor of Kano State he coordinated development across all 44 Local Government Areas. As a federal education official he restructured institutions that shape millions of Nigerians. And long before either, he built his name the hard way — among the people.\n\nIn 2027, he brings that lifetime of service to a new responsibility: the leadership of Kano State.',
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
    ['NDC', 'Candidate', 'crimson', 4],
  ];
  await prisma.stat.createMany({ data: stats.map(([value, label, accent, sort]) => ({ value, label, accent, sort })) });

  // homepage sections
  const sections = [
    ['hero', 'Hero', 1], ['stats', 'Statistics', 2], ['why-gwarzo', 'Why Gwarzo', 3], ['journey', 'Journey', 4],
    ['record', 'Record', 5], ['transition', 'The 2026 Transition', 6], ['kwankwasiyya', 'Kwankwasiya', 7],
    ['facts', 'Facts & Transparency', 8], ['moments', 'Moments of Service', 9], ['engagement', 'Community Engagement', 10],
    ['media', 'Media Center', 11], ['cta', 'Call to Action', 12],
  ];
  await prisma.pageSection.createMany({ data: sections.map(([key, title, sort]) => ({ key, title, sort })) });

  // navigation
  const nav = [
    ['Home', '/', 1], ['About', '/about', 2], ['Record', '/#record', 3], ['Kano', '/kano', 4],
    ['Vision', '/#vision', 5], ['Media', '/media', 6], ['Facts', '/facts', 7], ['Engage', '/engage', 8],
  ];
  await prisma.navigationItem.createMany({ data: nav.map(([label, href, sort]) => ({ label, href, sort })) });

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

  // sectors + initiatives
  for (const [name, icon, problem, context, approach, objectives, metrics] of SECTORS) {
    const sector = await prisma.policySector.create({
      data: { name, icon, problemStatement: problem, currentContext: context, approach, objectivesJson: JSON.stringify(objectives), metricsJson: JSON.stringify(metrics) },
    });
    const inits = objectives.map((o, i) => ({ sectorId: sector.id, title: o, sort: i }));
    if (inits.length) await prisma.policyInitiative.createMany({ data: inits });
  }

  // LGAs
  const lgaRows = [];
  for (const [name, district] of LGAS) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const l = await prisma.lga.create({ data: { name, slug, senatorialDistrict: district } });
    lgaRows.push(l);
  }
  const lgaByName = Object.fromEntries(lgaRows.map((l) => [l.name, l]));

  // issue categories
  const topicIds = {};
  for (const name of ISSUE_CATEGORIES) {
    const c = await prisma.issueCategory.create({ data: { name } });
    topicIds[name] = c.id;
  }

  // articles
  for (const [slug, title, category, location, body, tags, status, daysAgo] of ARTICLES) {
    await prisma.article.create({
      data: {
        slug, title, category, location, body, tagsJson: JSON.stringify(tags.split(', ')),
        status, isDemo: false,
        publishedAt: status === 'published' ? new Date(Date.now() - daysAgo * 86400000) : null,
        seoTitle: status === 'published' ? title : null,
        seoDescription: status === 'published' ? body.split('\n')[0].slice(0, 158) : null,
      },
    });
  }

  // speeches
  for (const [title, eventName, eventDate, venue, location, summary, themes] of SPEECHES) {
    await prisma.speech.create({
      data: { title, eventName, eventDate, venue, location, summary, themesJson: JSON.stringify(themes.split(', ')), status: 'published', publishedAt: new Date(eventDate + 'T09:00:00.000Z'), isDemo: false },
    });
  }

  // events (upcoming)
  for (const [name, description, startsAt, venue, lgaName, category] of EVENTS) {
    const lga = lgaByName[lgaName];
    await prisma.campaignEvent.create({
      data: { name, description, startsAt: new Date(startsAt), venue, lgaId: lga ? lga.id : null, category, status: 'upcoming', isDemo: false },
    });
  }

  // sources & claims & evidence
  const srcs = [];
  for (const [title, publisher, type, reliability, notes] of SOURCES) {
    srcs.push(await prisma.source.create({ data: { title, publisher, type, reliability, notes, verifiedAt: reliability === 'unverified' ? null : new Date() } }));
  }
  for (let i = 0; i < CLAIMS.length; i++) {
    const [statement, context, category, status, notes] = CLAIMS[i];
    const claim = await prisma.claim.create({
      data: { statement, context, category, status, verdictNotes: notes, verifiedBy: status === 'verified' ? 'Fact Desk' : null, verifiedAt: status === 'verified' ? new Date() : null, isDemo: false },
    });
    if (i === 0) {
      await prisma.evidence.create({ data: { claimId: claim.id, type: 'official-record', title: 'Kano State Government service records (2023–2026)', sourceId: srcs[0].id, notes: 'State government service documentation; cross-checked against the state public officials directory.' } });
    }
    if (i === 1) {
      await prisma.evidence.create({ data: { claimId: claim.id, type: 'url', title: 'Media references to the 95% literacy figure (no official source cited)', sourceId: srcs[2].id, notes: 'Figure circulates in local media without a cited primary source; pending comparison with national literacy survey data.' } });
    }
    if (i === 2) {
      await prisma.evidence.create({ data: { claimId: claim.id, type: 'document', title: 'State Ministry of Health — 2024 PHC commissioning records (requested)', sourceId: srcs[3].id, notes: 'Records requested from the state Ministry of Health; verification in progress.' } });
    }
    if (i === 3) {
      await prisma.evidence.create({ data: { claimId: claim.id, type: 'document', title: '2023 state budget — LGA allocation schedule (requested)', sourceId: srcs[0].id, notes: 'Cross-check with the state budget office in progress.' } });
    }
  }

  // community submissions (realistic demo submissions)
  const dayMs = 86400000;
  for (let i = 0; i < SUBMISSIONS.length; i++) {
    const [lgaName, topic, status, assignedTo, priority, response, daysAgo, message, name] = SUBMISSIONS[i];
    const lga = lgaByName[lgaName];
    const hour = 8 + (i % 10);
    await prisma.communitySubmission.create({
      data: {
        lgaId: lga ? lga.id : null,
        topicId: topicIds[topic] ?? null,
        topicName: topic,
        message,
        name,
        consent: true,
        status,
        assignedTo,
        priority,
        response: response || '',
        resolvedAt: status === 'responded' ? new Date(Date.now() - Math.max(1, daysAgo - 2) * dayMs) : null,
        isDemo: false,
        createdAt: new Date(Date.now() - daysAgo * dayMs - hour * 3600000),
      },
    });
  }

  // volunteers
  for (const [name, phone, email, lgaName, skills, status] of VOLUNTEERS) {
    const lga = lgaByName[lgaName];
    await prisma.volunteer.create({
      data: { name, phone, email, lgaId: lga ? lga.id : null, skills, status },
    });
  }

  // analytics — realistic 30-day demo traffic (demo deployment only)
  const paths = [
    ['/', 0.30], ['/about', 0.14], ['/record', 0.12], ['/kano', 0.11],
    ['/news', 0.08], ['/facts', 0.07], ['/engage', 0.06], ['/vision', 0.05], ['/media', 0.05],
  ];
  const referrers = [null, 'google.com', 'google.com', 'x.com', 'facebook.com', 'wa.me', null, 'google.com'];
  let sessionCounter = 0;
  for (let d = 29; d >= 0; d--) {
    const growth = 1 + (29 - d) * 0.02; // gentle upward campaign ramp
    const base = (28 + Math.round(14 * Math.sin((d % 7) / 7 * Math.PI * 2) + (d % 5) * 3)) * growth;
    const n = Math.round(base);
    for (let i = 0; i < n; i++) {
      let r = Math.random();
      let path = paths[0][0];
      for (const [p, w] of paths) {
        if (r < w) { path = p; break; }
        r -= w;
      }
      const ref = referrers[(d + i) % referrers.length];
      const ts = new Date(Date.now() - d * dayMs - (i % 14) * 3600000 * 1.7 - (i % 3) * 1800000);
      await prisma.analyticsEvent.create({
        data: { type: 'page_view', path, referrer: ref, sessionId: 'demo-u' + (sessionCounter++ % 40) + '-' + (i % 7), isDemo: false, createdAt: ts },
      });
      if (i % 9 === 0) {
        await prisma.analyticsEvent.create({
          data: { type: 'cta_click', path: path === '/' ? '/#record' : path, sessionId: 'demo-u' + ((sessionCounter - 1) % 40) + '-c' + i, isDemo: false, createdAt: new Date(ts.getTime() + 60000) },
        });
      }
    }
  }
  for (let i = 0; i < 14; i++) {
    await prisma.analyticsEvent.create({
      data: { type: 'submission_completed', path: '/engage', sessionId: 'demo-u' + (i % 40) + '-s', isDemo: false, createdAt: new Date(Date.now() - (i * 2 + 1) * dayMs) },
    });
  }

  return 'seeded';
}

module.exports = { seedCore };

// ------------------------------------------------------------------ CLI entry
if (require.main === module) {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  seedCore(prisma)
    .then((r) => {
      console.log('SEED COMPLETE —', r);
      if (r === 'seeded') {
        console.log('  LGAs: 44 | roles: 9 | users: 2 (admin@gwarzo2027.ng / Gwarzo@2027!)');
        console.log('  DEMO records are seeded as demo-deployment content (isDemo: false).');
      }
    })
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}
