/* ============================================================
   DATA SOURCE LABELING SYSTEM
   Every statistic must display: Source, Publication, Year, Last Updated
   ============================================================ */
export interface DataSource {
  source: string; // e.g., "INEC", "Kano State Ministry of Health"
  publication: string; // e.g., "2023", "2024 Annual Report"
  year: number; // e.g., 2023
  lastUpdated: string; // e.g., "June 2024"
  verificationStatus: 'verified' | 'reported' | 'campaign-claim' | 'proposed' | 'under-review';
  url?: string; // Optional link to original source
}

/* Predefined source categories for consistency */
export const sourceCategories = {
  government: ['INEC', 'Kano State Government', 'Kano State Ministry', 'State House of Assembly'],
  international: ['UNICEF', 'WHO', 'FAO', 'World Bank', 'UN'],
  national: ['NBS', 'NPM', 'FMOH', 'MINISTRY'],
  research: ['Academic', 'Research Institute', 'Policy Think Tank'],
  campaign: ['Campaign Document', 'Press Release', 'Candidate Statement'],
  media: ['Newspaper', 'TV Station', 'Online Portal'],
};

/* Example data sources used throughout the website */
export const exampleDataSources: DataSource[] = [
  {
    source: 'INEC',
    publication: '2023',
    year: 2023,
    lastUpdated: 'March 2024',
    verificationStatus: 'verified',
  },
  {
    source: 'Kano State Ministry of Health',
    publication: '2024',
    year: 2024,
    lastUpdated: 'July 2024',
    verificationStatus: 'verified',
  },
  {
    source: 'Kano State Agricultural Ministry',
    publication: '2023',
    year: 2023,
    lastUpdated: 'August 2024',
    verificationStatus: 'verified',
  },
  {
    source: 'NBS',
    publication: '2023',
    year: 2023,
    lastUpdated: 'June 2024',
    verificationStatus: 'verified',
  },
  {
    source: 'UNICEF',
    publication: '2023',
    year: 2023,
    lastUpdated: 'June 2024',
    verificationStatus: 'verified',
  },
  {
    source: 'Campaign Document',
    publication: '2024',
    year: 2024,
    lastUpdated: 'July 2024',
    verificationStatus: 'campaign-claim',
  },
  {
    source: 'Under Review',
    publication: 'Pending',
    year: 2024,
    lastUpdated: 'July 2024',
    verificationStatus: 'under-review',
  },
];

/* Data source label component */
export function DataSourceLabel({ source }: { source: DataSource }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <EvidenceBadge
        status={source.verificationStatus}
        size="xs"
      />
      <span>
        {source.source} | {source.publication} | Updated {source.lastUpdated}
      </span>
    </div>
  );
}

/* Validation function - checks if data source is complete */
export function validateDataSource(source: Partial<DataSource>): string {
  if (!source.source) return 'Source is required';
  if (!source.publication) return 'Publication year is required';
  if (!source.year) return 'Year is required';
  if (!source.lastUpdated) return 'Last updated date is required';
  return 'Valid';
}