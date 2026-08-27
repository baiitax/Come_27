/* ============================================================
   SEARCH - Section 43
   Intelligent global search with command K / Ctrl + K
   ============================================================ */
import { GlassCard } from '../components/glass/glass-card';
import { cn } from '@/lib/utils';

export function SearchSection() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = React.useCallback(async (searchQuery: string) => {
    setLoading(true);
    // In real implementation, would search across biography, timeline, policies, news, documents, LGAs, media
    // For now, simulate with mock results
    await new Promise(resolve => setTimeout(resolve, 500));
    setResults([
      { type: 'biography', title: 'Aminu Abdussalam Gwarzo - Biography', highlight: `Aminu Abdussalam Gwarzo has had a ${searchQuery} career in public service` },
      { type: 'policy', title: `Policy: Education & Human Capital`, highlight: `Position on ${searchQuery} for Kano's education sector` },
      { type: 'speech', title: `Speech: ${searchQuery} Address`, highlight: `Full text of ${searchQuery} related remarks` },
    ]);
    setLoading(false);
  }, []);

  const debouncedSearch = React.useCallback((searchQuery: string) => {
    // Simple debounce - in production would use use-debounce or similar
    handleSearch(searchQuery);
  }, [handleSearch]);

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-6">
        <GlassCard premium={true} shadow="soft" style={{ maxWidth: '400px' }}>
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              {/* Search icon */}
              <div className="w-8 h-8 rounded-full bg-[var(--primary-green)] flex items-center justify-center text-[var(--white)] text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="11" y2="11" />
                  <line x1="21" y1="11" x2="11" y2="21" />
                </svg>
              </div>

              {/* Search input */}
              <input
                type="text"
                placeholder="⌘ K or Ctrl + K to search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    debouncedSearch(query.trim());
                  }
                  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    setQuery('');
                  }
                }}
                className="ml-4 w-full bg-transparent border-0 outline-none text-[var(--white)]"
                style={{ flex: 1 }}
              />

              {/* Mic icon for voice search */}
              <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)] text-sm hover:cursor-pointer">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                </svg>
              </div>
            </div>
          </GlassCard>

          {/* Recent searches or suggestions */}
          {loading && (
            <div className="py-8 text-center text-[var(--muted-text)]">
              <p>Searching...</p>
              <div className="mt-4">
                <div className="w-8 h-8 rounded animate-spin" style={{
                  border: '2px solid var(--glass-border)',
                  borderColor: 'var(--primary-green)',
                  borderTopColor: 'var(--primary-green)',
                }} />
              </div>
            </div>
          )}

          {/* Results preview when there's a query */}
          {query.trim().length > 0 && !loading && results.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[var(--glass-border)]">
              <h3 className="text-sm font-bold text-[var(--white)] mb-4">Results for "{query}"</h3>
              <div className="space-y-3 text-sm">
                {results.map((result) => (
                  <div key={result.type} className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-[var(--primary-green)] flex-shrink-0 mt-1"></div>
                    <div>
                      <p className="font-medium text-[var(--white)]">{result.title}</p>
                      <p className="text-[var(--muted-text)]">{result.highlight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}