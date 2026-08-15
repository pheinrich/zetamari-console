import { rankItem, rankings } from '@tanstack/match-sorter-utils'

// Ranks a list of separate field values against a search query and
// returns the best (highest) rank found across them, with `passed` true
// once that best rank meets `rankings.CONTAINS` (a real substring match
// in at least one field, not merely all the query's characters appearing
// somewhere in order).
//
// This exists because concatenating several fields into one big string
// and fuzzy-ranking THAT (the original approach in CustomersListTable.jsx
// and LiveClassesListTable.jsx) let @tanstack/match-sorter-utils's
// default MATCHES threshold pass on any row where the query's letters
// merely appeared in order ANYWHERE across the whole blob - e.g.
// searching "Katrak" matched 88 unrelated customers, since K-A-T-R-A-K
// could be found spread across a combination of that row's name + email +
// phone + address once concatenated. Ranking each field on its own (each
// one much shorter) and requiring a real substring in at least one of
// them fixes that false-positive explosion while still finding "Sue" in
// a first name, "8749" in a phone number or zip code, or "Portland" in a
// city - see CustomersListTable.jsx/LiveClassesListTable.jsx for the
// exact field lists used per table.
export function multiFieldFuzzyFilter( fields, query )
{
  let best = rankings.NO_MATCH

  for( const field of fields )
  {
    if( !field )
      continue

    const { rank } = rankItem( field, query )

    if( rank > best )
      best = rank
  }

  return {rank: best, passed: best >= rankings.CONTAINS}
}
