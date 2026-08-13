// Labels for CustomerSource.sourceType (see the
// 20260807020000-customer-sources.js migration for the full rationale
// behind the enum-category + free-text-name split). 'online_learning' is
// deliberately not labeled "Student" - a Customer "is a student" only via
// LiveClassAttendee, a separate concept from where their contact record
// originally came from.
export const SOURCE_TYPE_META = {
  website: {label: 'Website', examples: 'e.g. SquareSpace, Shopify, Etsy'},
  software: {label: 'Software', examples: 'e.g. QuickBooks, ConvertKit'},
  online_learning: {label: 'Online Learning', examples: 'e.g. Teachable, Tevello'},
  art_show: {label: 'Art Show', examples: 'e.g. Art in the Park, Sorticulture'},
  conference: {label: 'Conference', examples: 'e.g. SAMA 2026, CMA 2027'},
  retail: {label: 'Retail', examples: 'e.g. Faire, Artful Home, The Giving Tree Gallery'},
}

export function sourceTypeLabel( sourceType )
{
  return SOURCE_TYPE_META[sourceType]?.label || sourceType
}

export function sourceTypeUsesEvent( sourceType )
{
  return 'art_show' === sourceType || 'conference' === sourceType
}
