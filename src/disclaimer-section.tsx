/* ============================================================
   DISCLAIMER - Section 61
   ============================================================ */
export function DisclaimerSection() {
  return (
    <section className="py-24 md:py-32 bg-[var(--obsidian)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--white)] mb-4">
            DISCLAIMER
          </h2>
        </div>

        <div className="prose mx-auto text-[var(--muted-text)] max-w-2xl">
          <p>
            This platform presents information about Comarade Aminu Abdussalam Gwarzo, his
            public-service record, policy positions and campaign activities.
          </p>
          <p>
            Historical claims and statistics should be understood in accordance with the
            sources identified on each page.
          </p>
          <p>
            Policy proposals are subject to final campaign documentation and applicable law.
          </p>
          <p>
            The website does not create: fake endorsements, fake polls, fabricated
            achievements, fabricated statistics, deepfakes, fake quotes, deceptive
            testimonials, impersonation, or targeted political persuasion based on
            sensitive personal characteristics.
          </p>
          <p>
            Private voter information is never exposed. Aggregated public data only is
            used for dashboards and development metrics.
          </p>
        </div>
      </div>
    </section>
  );
}