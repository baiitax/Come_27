/* ============================================================
   FAQ - Section 36
   Frequently asked questions with factual, sourced answers
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const faqs = [
    {
      id: '1',
      question: 'Who is Aminu Abdussalam Gwarzo?',
      answer: 'Comrade Aminu Abdussalam Gwarzo is the Nigeria Democratic Congress (NDC) candidate for Governor of Kano State in the 2027 governorship election. He is an experienced public servant with a lifetime of service spanning education, community leadership, local government, state government, federal institutional responsibilities, and executive government. He previously served as Deputy Governor of Kano State.',
      sourceRequired: true,
    },
    {
      id: '2',
      question: 'What positions has he held?',
      answer: 'Comrade Gwarzo has held various positions including: Deputy Governor of Kano State (2023), Federal Education Sector Governance (2017-2019), Kano State Government official (2011-2015), Local Government Administrator (1996), Community Leader (1995), and Teacher (1990s). His career began in education before moving into grassroots community leadership and local government administration.',
      sourceRequired: true,
    },
    {
      id: '3',
      question: 'What is his educational background?',
      answer: 'Comrade Gwarzo has a professional journey connected to teaching, learning, and higher education. Specific educational details should be verified from official records and certificates. His educational career began in the 1990s as a teacher in Kano State before progressing into administrative roles.',
      sourceRequired: true,
    },
    {
      id: '4',
      question: 'What did he do as Deputy Governor?',
      answer: 'As Deputy Governor of Kano State, Comrade Gwarzo oversaw state administration and development initiatives across Kano\'s 44 Local Government Areas. His responsibilities included coordinating state government functions, supporting executive governance, and engaging with grassroots communities. Specific achievements should be verified from official Kano State Government records.',
      sourceRequired: true,
    },
    {
      id: '5',
      question: 'Why did he resign?',
      answer: 'Comrade Gwarzo resigned from his position as Deputy Governor of Kano State following political developments in 2026. The resignation followed a political realignment and impeachment proceedings by the Kano State House of Assembly. His campaign states this was part of a broader political realignment, and he subsequently emerged as the NDC Kano governorship candidate.',
      sourceRequired: true,
    },
    {
      id: '6',
      question: 'What happened during the 2026 impeachment proceedings?',
      answer: 'The Kano State House of Assembly alleged impeachment proceedings against the Deputy Governor in 2026. Comrade Gwarzo responded to these allegations formally. The proceedings were subsequently withdrawn. This was followed by a political realignment and his emergence as the NDC governorship candidate for the 2027 election. Every allegation must be clearly attributed to the Kano State House of Assembly and not presented as established facts.',
      sourceRequired: true,
    },
    {
      id: '7',
      question: 'Why is he contesting under NDC?',
      answer: 'Comrade Gwarzo decided to contest the 2027 Kano governorship election under the Nigeria Democratic Congress (NDC) platform following a political realignment in 2026. This realignment followed his departure from previous political affiliations after the 2026 impeachment proceedings and constitutional processes. The NDC platform was chosen as the vehicle for his governorship ambition.',
      sourceRequired: true,
    },
    {
      id: '8',
      question: 'What is his relationship with Kwankwasiyya?',
      answer: 'Comrade Gwarzo has political affiliation with the Kwankwasiyya political tradition, having been associated with the movement structure. However, his individual leadership identity is now charting a new responsibility to Kano through the NDC platform. The relationship is described as "movement heritage, individual leadership" - acknowledging his place within the Kwankwasiyya tradition while establishing him as an independent candidate. Do not imply that Rabiu Musa Kwankwaso personally controls every aspect of Gwarzo\'s leadership unless supported by official statement.',
      sourceRequired: true,
    },
    {
      id: '9',
      question: 'Who is his running mate?',
      answer: 'Mustapha Rabiu Musa Kwankwaso is the candidate for Deputy Governor, running alongside Comrade Aminu Abdussalam Gwarzo for the 2027 governorship election. His strengths are presented as complementary to Gwarzo\'s: experience + youth, institution + innovation, grassroots + next generation, executive experience + youth engagement. Verified credentials and public service records should be referenced from official sources.',
      sourceRequired: true,
    },
    {
      id: '10',
      question: 'What is his vision for Kano?',
      answer: 'Comrade Gwarzo\'s vision for Kano is built on ten proposed policy pillars: Security & Community Protection, Education & Human Capital, Healthcare, Agriculture & Food Security, Jobs & Enterprise, Water & Sanitation, Infrastructure & Urban Development, Industrialization, Local Government Reform, and Digital Government. These are proposed information architecture and must be replaced or adapted to the official manifesto once released. The overarching vision is a safer, more educated, productive, and accountable Kano.',
      sourceRequired: true,
    },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            FAQ
          </h2>
          <p className="text-[var(--muted-text)] text-lg">
            Leadership deserves scrutiny.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq) => (
            <GlassCard
              key={faq.id}
              premium={true}
              shadow="soft"
              style={{
                border: '1px solid var(--glass-border)',
                marginBottom: '1rem',
                animation: `fadeSlideUp 0.6s ease-out ${faq.id}-delay var(--transition-medium)`,
              }}
            >
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-xl font-bold text-[var(--white)] mb-2">
                  {faq.question}
                </h3>
                <p className="text-[var(--muted-text)] line-clamp-4">
                  {faq.answer}
                </p>
                <p className="mt-3 text-xs text-[var(--muted-text)]">
                  Source verification required for this claim.
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}