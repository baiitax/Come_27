import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { safeDb } from '@/lib/safe-db';
import { HeroSection } from '@/sections/hero-section';
import { SectionHead } from '@/components/public/section-head';
import { EvidenceBadge } from '@/components/public/evidence-badge';
import { PriorityDashboard } from '@/components/public/priority-dashboard';
import { StatsStrip } from '@/components/public/stats-strip';

export const dynamic = 'force-dynamic';

const WHY_PILLARS = [
  { n: '01', title: 'Experience', desc: 'Decades across classroom, local government, state executive and federal institutions.', evidence: 'official-record', href: '/record' },
  { n: '02', title: 'Grassroots', desc: 'Youth and community leadership built the hard way — among the people.', evidence: 'reported', href: '/about' },
  { n: '03', title: 'Education', desc: 'A career that began in the classroom and returned to federal education governance.', evidence: 'official-record', href: '/vision/education' },
  { n: '04', title: 'Governance', desc: 'State administration and policy implementation across 15 LGAs.', evidence: 'official-record', href: '/record' },
  { n: '05', title: 'Executive Service', desc: 'Deputy Governor of Kano State — development coordinated across all 44 LGAs.', evidence: 'official-record', href: '/record' },
  { n: '06', title: 'Vision', desc: 'A 12-pillar plan for human capital, opportunity and accountable governance.', evidence: 'proposed', href: '/vision' },
];

export default async function HomePage() {
  const [candidate, stats, records, journey, transition, sectors, claims, articles, speeches, events, lgas] =
    await safeDb(
    () => Promise.all([

      prisma.candidate.findFirst(),
      prisma.stat.findMany({ where: { isActive: true }, orderBy: { sort: 'asc' } }),
      prisma.serviceRecord.findMany({ where: { published: true, deletedAt: null }, orderBy: { startDate: 'desc' }, take: 3 }),
      prisma.timelineEntry.findMany({ where: { published: true, deletedAt: null }, orderBy: { sort: 'asc' } }),
      prisma.transitionEvent.findMany({ orderBy: { sort: 'asc' } }),
      prisma.policySector.findMany({ where: { published: true }, orderBy: { name: 'asc' } }),
      prisma.claim.findMany({
        where: { isDemo: false, status: { notIn: ['under-review'] } },
        orderBy: { updatedAt: 'desc' },
        take: 3,
        include: { source: true, evidences: true },
      }),
      prisma.article.findMany({ where: { status: 'published', deletedAt: null }, orderBy: { publishedAt: 'desc' }, take: 3 }),
      prisma.speech.findMany({ where: { status: 'published', deletedAt: null }, orderBy: { eventDate: 'desc' }, take: 3 }),
      prisma.campaignEvent.findMany({ where: { status: 'upcoming', deletedAt: null }, orderBy: { startsAt: 'asc' }, take: 3 }),
      prisma.lga.count(),
    ]),
    [null, [], [], [], [], [], [], [], [], [], 0] as [any, any[], any[], any[], any[], any[], any[], any[], any[], any[], number],
    'home'
  )

  const c = {
    name: candidate?.fullName ?? 'Comrade Aminu Abdussalam Gwarzo',
    displayName: candidate?.displayName ?? 'Comrade Aminu Abdussalam Gwarzo',
    title: candidate?.title ?? 'NDC Candidate for Governor of Kano State 2027',
    tagline: candidate?.tagline ?? 'A lifetime of service. A new responsibility to Kano.',
    shortBio:
      candidate?.shortBio ??
      'A public servant, grassroots leader and former Deputy Governor of Kano State — bringing decades of institutional and community experience to Kano’s next chapter.',
    longBio:
      candidate?.longBio ?? '',
    profileImageUrl: candidate?.profileImageUrl ?? '/images/hero/gwarzo-hero.jpg',
  };

  const statList = stats.length
    ? stats.map((s) => ({ value: s.value, label: s.label, accent: s.accent }))
    : [
        { value: '27+', label: 'Years of public service', accent: 'crimson' },
        { value: '44', label: 'LGAs of Kano', accent: 'gold' },
        { value: '2027', label: 'Governorship', accent: 'crimson' },
        { value: 'NDC', label: 'Candidate', accent: 'crimson' },
      ];

  const bioParas = c.longBio.split('\n').map((p) => p.trim()).filter(Boolean);

  return (
    <>
      {/* 01 — HERO */}
      <HeroSection candidate={c} stats={statList} />

      {/* 02 — MEET GWARZO */}
      <section id="meet" className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            eyebrow="Section 01 · Who is Gwarzo?"
            title={<>A life built around <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">service.</span></>}
          />
          <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div data-reveal="left" className="relative">
              <div aria-hidden className="absolute -inset-3 -translate-x-2 -translate-y-2 rounded-[2rem] border border-[rgba(198,146,50,0.3)]" />
              <div className="portrait-frame">
                <Image
                  src="/images/about/gwarzo-service.jpg"
                  alt={c.name}
                  width={1095}
                  height={1436}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div data-reveal="right" data-delay="150">
              {bioParas.length ? (
                bioParas.map((p, i) => (
                  <p key={i} className="mb-5 text-base leading-relaxed text-[var(--muted-text)] md:text-lg">
                    {p}
                  </p>
                ))
              ) : (
                <p className="mb-5 text-base leading-relaxed text-[var(--muted-text)] md:text-lg">{c.shortBio}</p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link href="/about" className="btn-primary">
                  Read the Full Story <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — THE RECORD */}
      <section className="relative bg-[linear-gradient(180deg,transparent,rgba(240,242,245,0.7),transparent)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            eyebrow="Section 02 · A life of service"
            title="The Record"
            sub="A public-service journey measured by responsibility, experience and documented work — every entry carries its evidence status."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {records.map((r, i) => (
              <Link key={r.id} href="/record" data-reveal="zoom" data-delay={String(i * 100)} className="group">
                <div className="glass-card glass-panel-hover flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-extrabold text-[var(--brand)]">{r.startDate}</span>
                    <EvidenceBadge status={r.evidenceStatus} source={r.institution} verifiedDate={r.verificationDate} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-[var(--white)]">{r.position}</h3>
                  <p className="mt-1 text-sm text-[var(--muted-text)]">{r.institution}</p>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--muted-text)]">
                    {r.responsibilities || r.description}
                  </p>
                  <p className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--brand)] opacity-0 transition-opacity group-hover:opacity-100">
                    View the full record →
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center" data-reveal>
            <Link href="/record" className="btn-secondary">
              Explore the Complete Record
            </Link>
          </div>
        </div>
      </section>

      {/* 04 — THE JOURNEY */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            eyebrow="Section 03 · The journey"
            title={<>From the classroom to the <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">governor&apos;s chamber.</span></>}
          />
          <div className="relative mt-14">
            <div aria-hidden className="absolute left-4 top-0 h-full w-px bg-[linear-gradient(180deg,var(--brand),var(--gold),transparent)] md:left-0 md:top-4 md:h-px md:w-full md:bg-[linear-gradient(90deg,var(--brand),var(--gold),transparent)]" />
            <ol className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-4">
              {journey.map((j, i) => (
                <li key={j.id} data-reveal data-delay={String((i % 4) * 100)} className="relative pl-12 md:pl-0 md:pt-10">
                  <span aria-hidden className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-[var(--brand)] md:left-0 md:top-4 md:translate-x-0" />
                  <p className="font-display text-xl font-extrabold text-[var(--brand)]">{j.year}</p>
                  <p className="mt-1.5 font-display text-base font-bold text-[var(--white)]">{j.title}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted-2)]">{j.location}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">{j.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 05 — THE POLITICAL TRANSITION */}
      <section className="relative bg-[linear-gradient(180deg,transparent,rgba(240,242,245,0.7),transparent)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            eyebrow="Section 04 · Transparency"
            title="The 2026 Political Transition"
            sub="Presented as documented, with explicit attribution. Allegations are never presented as established facts — every event carries its evidence status."
          />
          <div className="mt-14 space-y-3">
            {transition.map((t, i) => (
              <div key={t.id} data-reveal data-delay={String((i % 3) * 80)} className="glass-card glass-panel-hover flex flex-col gap-3 p-5 md:flex-row md:items-center">
                <div className="w-28 shrink-0 font-display text-lg font-extrabold text-[var(--brand)]">{t.date}</div>
                <div className="flex-1">
                  <p className="font-display text-base font-bold text-[var(--white)]">{t.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted-text)]">{t.whatHappened}</p>
                  <p className="mt-1.5 text-[0.68rem] text-[var(--muted-2)]">Attribution: {t.attribution}{t.source && ` · Source: ${t.source}`}</p>
                </div>
                <div className="shrink-0">
                  <EvidenceBadge status={t.evidenceStatus} source={t.source} notes={t.response} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center" data-reveal>
            <Link href="/transition" className="btn-secondary">
              Read the Full Transition Story
            </Link>
          </div>
        </div>
      </section>

      {/* 06 — WHY GWARZO */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            eyebrow="Section 05 · Why Aminu Gwarzo?"
            title="Six reasons. Documented."
            sub="Each pillar is classified by its evidence status — claims are never presented without a label."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_PILLARS.map((p, i) => (
              <Link key={p.n} href={p.href} data-reveal="zoom" data-delay={String((i % 3) * 100)} className="group">
                <div className="glass-card glass-panel-hover flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-3xl font-extrabold text-[rgba(23,32,51,0.12)] transition-colors group-hover:text-[var(--brand)]/25">{p.n}</span>
                    <EvidenceBadge status={p.evidence} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-[var(--white)]">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-text)]">{p.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — THE VISION */}
      <section className="relative bg-[linear-gradient(180deg,transparent,rgba(240,242,245,0.7),transparent)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            eyebrow="Section 06 · The vision"
            title={<>A better Kano, built on <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">human capital.</span></>}
            sub="Twelve policy pillars. Every proposal is clearly marked as a proposal — not a completed program."
          />
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sectors.map((s, i) => (
              <Link
                key={s.id}
                href={`/vision/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                data-reveal="zoom"
                data-delay={String((i % 4) * 80)}
                className="group"
              >
                <div className="glass-card glass-panel-hover flex h-full flex-col p-5">
                  <span className="font-display text-[0.68rem] font-extrabold tracking-[0.2em] text-[var(--gold-ink)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 font-display text-base font-bold leading-snug text-[var(--white)] group-hover:text-[var(--brand)]">{s.name}</p>
                  <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-[var(--muted-text)]">{s.approach}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
                    <EvidenceBadge status="proposed" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center" data-reveal>
            <Link href="/vision" className="btn-primary">
              Explore the Full Vision <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 08 — KANO */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div data-reveal="left">
              <span className="section-eyebrow">Section 07 · Kano</span>
              <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--white)] md:text-5xl">
                Kano. A state of <span className="bg-[linear-gradient(100deg,var(--brand-deep),var(--brand)_60%,var(--gold))] bg-clip-text text-transparent">possibilities.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--muted-text)] md:text-lg">
                Forty-four Local Government Areas. One shared conversation. Explore each LGA&apos;s
                development priorities, events, media and community submissions — aggregate only,
                never individual.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="glass-card !p-4 text-center">
                  <p className="font-display text-3xl font-extrabold text-[var(--brand)]">{lgas}</p>
                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">LGAs</p>
                </div>
                <div className="glass-card !p-4 text-center">
                  <p className="font-display text-3xl font-extrabold text-[var(--white)]">12</p>
                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">Policy Pillars</p>
                </div>
                <div className="glass-card !p-4 text-center">
                  <p className="font-display text-3xl font-extrabold text-[var(--gold-ink)]">1</p>
                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-text)]">Shared Voice</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/kano" className="btn-secondary">
                  Explore the 44 LGAs
                </Link>
              </div>
            </div>
            <div data-reveal="right" data-delay="150">
              <div className="glass-card !p-5">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--brand)]">LGA Explorer</p>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex h-14 items-center justify-center rounded-lg border border-[var(--glass-border)] bg-white/60 text-[0.58rem] font-semibold text-[var(--muted-2)]">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-[var(--muted-text)]">
                  Select an LGA to view priorities, events, media and aggregate community
                  submissions. Where data is insufficient, we say so.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 09 — FACTS & EVIDENCE */}
      <section className="relative bg-[linear-gradient(180deg,transparent,rgba(240,242,245,0.7),transparent)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            eyebrow="Section 08 · Accountability"
            title="Facts. Evidence. Accountability."
            sub="Claim → Verdict → Evidence → Source → Response. You should never have to guess whether something is verified."
          />
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {claims.map((cl, i) => (
              <Link key={cl.id} href="/facts" data-reveal="zoom" data-delay={String(i * 100)} className="group">
                <div className="glass-card glass-panel-hover flex h-full flex-col p-6">
                  <EvidenceBadge status={cl.status} source={cl.source?.title} verifiedDate={cl.verifiedAt} />
                  <p className="mt-4 flex-1 font-display text-base font-bold leading-snug text-[var(--white)]">
                    “{cl.statement.slice(0, 140)}{cl.statement.length > 140 ? '…' : ''}”
                  </p>
                  <p className="mt-4 text-[0.68rem] text-[var(--muted-2)]">
                    {cl.evidences.length} evidence item(s)
                    {cl.source && ` · ${cl.source.publisher || cl.source.title}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center" data-reveal>
            <Link href="/facts" className="btn-secondary">
              Visit the Facts & Transparency Center
            </Link>
          </div>
        </div>
      </section>

      {/* 10 — LATEST FROM GWARZO 2027 */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead eyebrow="Section 09 · Media" title="Latest from Gwarzo 2027" />
          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div data-reveal>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--white)]">News</h3>
                <Link href="/media" className="text-[0.68rem] font-bold text-[var(--brand)] hover:underline">All →</Link>
              </div>
              <div className="space-y-3">
                {articles.map((a) => (
                  <Link key={a.id} href={`/news/${a.slug}`} className="glass-card glass-panel-hover block p-5">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-2)]">
                      {a.publishedAt?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="mt-1.5 font-display text-sm font-bold leading-snug text-[var(--white)]">{a.title}</p>
                  </Link>
                ))}
              </div>
            </div>
            <div data-reveal data-delay="120">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--white)]">Speeches</h3>
                <Link href="/media" className="text-[0.68rem] font-bold text-[var(--brand)] hover:underline">All →</Link>
              </div>
              <div className="space-y-3">
                {speeches.map((s) => (
                  <Link key={s.id} href="/media" className="glass-card glass-panel-hover block p-5">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-2)]">{s.eventDate}</p>
                    <p className="mt-1.5 font-display text-sm font-bold leading-snug text-[var(--white)]">{s.title}</p>
                  </Link>
                ))}
              </div>
            </div>
            <div data-reveal data-delay="240">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--white)]">Events</h3>
                <Link href="/media" className="text-[0.68rem] font-bold text-[var(--brand)] hover:underline">All →</Link>
              </div>
              <div className="space-y-3">
                {events.map((e) => (
                  <Link key={e.id} href="/media" className="glass-card glass-panel-hover block p-5">
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-2)]">
                      {e.startsAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="mt-1.5 font-display text-sm font-bold leading-snug text-[var(--white)]">{e.name}</p>
                    <p className="mt-1 text-xs text-[var(--muted-text)]">{e.venue}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 — YOUR VOICE */}
      <section id="engage" className="relative bg-[linear-gradient(180deg,transparent,rgba(240,242,245,0.7),transparent)] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <div data-reveal="left">
              <SectionHead
                align="left"
                eyebrow="Section 10 · Your voice"
                title="Your voice matters."
                sub="Ask a question. Raise a community priority. Share an idea. Flag a claim for review. Only necessary information is collected — your identity is never displayed publicly."
              />
              <div className="mt-8">
                <Link href="/engage" className="btn-primary">
                  Share Your Voice <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
            <div data-reveal="right" data-delay="150">
              <PriorityDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* 12 — JOIN */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div data-reveal="zoom" className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(150deg,#172033,#2A1518_60%,#172033)] px-8 py-16 text-center shadow-[0_30px_80px_rgba(23,32,51,0.35)] md:px-16">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[rgba(198,146,50,0.18)] blur-[90px]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[rgba(166,27,27,0.25)] blur-[90px]" />
            <div className="relative">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[#D9AE55]">Section 11 · Join the movement</p>
              <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-5xl">
                Kano&apos;s next chapter <span className="bg-[linear-gradient(100deg,#E8CE8F,#D6B25E_55%,#B98F3E)] bg-clip-text text-transparent">starts with you.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[rgba(255,255,255,0.72)]">
                Volunteers, community leaders, fact-checkers, media contributors — the 2027
                movement is built one voice at a time.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/join"
                  className="rounded-full bg-[linear-gradient(135deg,#D9AE55,#C69232)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#172033] shadow-[0_10px_30px_rgba(198,146,50,0.35)] transition-all hover:-translate-y-px"
                >
                  Join the Movement
                </a>
                <a
                  href="/contact"
                  className="rounded-full border border-[rgba(255,255,255,0.25)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-white/10"
                >
                  Contact the Campaign
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
