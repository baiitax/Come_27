import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-20">
      <div className="text-center">
        <p className="font-display text-[6rem] font-extrabold leading-none tracking-tight text-[rgba(23,32,51,0.12)] md:text-[9rem]">
          404
        </p>
        <h1 className="-mt-8 font-display text-3xl font-extrabold tracking-tight text-[var(--white)] md:-mt-12 md:text-4xl">
          This page has moved.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[var(--muted-text)]">
          Let&apos;s get you back to the story.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">Return Home</Link>
          <Link href="/record" className="btn-secondary">Explore the Record</Link>
        </div>
      </div>
    </div>
  );
}
