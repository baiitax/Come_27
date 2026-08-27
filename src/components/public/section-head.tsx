export function SectionHead({
  eyebrow,
  title,
  sub,
  align = 'center',
  dark = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}) {
  return (
    <div data-reveal className={align === 'center' ? 'text-center' : 'text-left'}>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className={`mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl ${dark ? 'text-white' : 'text-[var(--white)]'}`}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-5 text-base leading-relaxed md:text-lg ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'} ${dark ? 'text-[rgba(255,255,255,0.7)]' : 'text-[var(--muted-text)]'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
