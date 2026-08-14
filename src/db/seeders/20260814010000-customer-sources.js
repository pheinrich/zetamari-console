'use strict'

// Companion to 20260814000000-customers.js - seeds CustomerSource rows
// from the same "Zetamari Customer Master List" export's "Tags" column
// (SquareSpace/QBO/Teachable/Etsy/Faire/Sorticulture/BAM/NWFGS/etc.),
// which is a space-separated list of every channel a given customer
// record has been attributed to. Must run after the Customers seeder -
// customerId here matches that seeder's row order 1:1 (both are built
// from the same source CSV in the same order).
//
// Tag -> sourceType/sourceName mapping (see the TOKEN_MAP this was
// generated from for the exact list):
//   QBO                -> software / "QuickBooks Online"
//   SquareSpace         -> website / "SquareSpace" (also covers the sheet's
//                          "Squarespac"/"SquareSapce" typos, normalized)
//   Teachable           -> online_learning / "Teachable"
//   Etsy                -> website / "Etsy"
//   Faire               -> retail / "Faire"
//   Sorticulture        -> art_show / "Sorticulture"
//   BAM, NWFGS          -> art_show / kept verbatim as sourceName - almost
//                          certainly "Bellevue Art Museum Show" and
//                          "Northwest Flower & Garden Show/Festival"
//                          respectively (BAM is literally the example
//                          given for art_show in sourceTypeMeta.js), but
//                          left as the sheet's abbreviation rather than
//                          guessing at the full name - easy to rename
//                          once confirmed with Angie.
//   Sweetheart Gallery   -> retail / "Sweetheart Gallery" (the one
//                          multi-word tag in the column, handled as a
//                          single token rather than splitting on the
//                          space)
//   Form                 -> website / "Website Contact Form" (a single
//                          occurrence paired with a product-availability
//                          question in Notes - read as a site contact-form
//                          lead)
//
// A customer's multiple tags become multiple CustomerSource rows (e.g. a
// customer tagged "Teachable SquareSpace QBO" gets three rows) - visually
// duplicate (sourceType, sourceName) pairs from typo variants of the same
// tag are collapsed to one row per customer, not seeded twice.
//
// firstSeenOn is set to the row's Created On date from the same sheet
// (the best available proxy - the sheet doesn't record a separate
// first-seen date per tag) and omitted, like the Customers seeder, where
// that date was blank.
//
// eventId is deliberately left null throughout - Sorticulture/BAM/NWFGS
// would need real Event records (address, dates, etc.) to link to, and
// this pass doesn't fabricate those; once Events exist for these shows,
// eventId can be backfilled.
module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert( 'CustomerSources', [
  {
    "id": 1,
    "customerId": 1,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-03-28"
  },
  {
    "id": 2,
    "customerId": 2,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-18"
  },
  {
    "id": 3,
    "customerId": 3,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-30"
  },
  {
    "id": 4,
    "customerId": 4,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-22"
  },
  {
    "id": 5,
    "customerId": 5,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-19"
  },
  {
    "id": 6,
    "customerId": 6,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-16"
  },
  {
    "id": 7,
    "customerId": 7,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-12"
  },
  {
    "id": 8,
    "customerId": 8,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-18"
  },
  {
    "id": 9,
    "customerId": 9,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-12"
  },
  {
    "id": 10,
    "customerId": 10,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-07"
  },
  {
    "id": 11,
    "customerId": 11,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-10-26"
  },
  {
    "id": 12,
    "customerId": 12,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-18"
  },
  {
    "id": 13,
    "customerId": 13,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-20"
  },
  {
    "id": 14,
    "customerId": 14,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-04-13"
  },
  {
    "id": 15,
    "customerId": 15,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-20"
  },
  {
    "id": 16,
    "customerId": 16,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-14"
  },
  {
    "id": 17,
    "customerId": 17,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-09-23"
  },
  {
    "id": 18,
    "customerId": 18,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-11"
  },
  {
    "id": 19,
    "customerId": 19,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-01"
  },
  {
    "id": 20,
    "customerId": 20,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-15"
  },
  {
    "id": 21,
    "customerId": 21,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-08-21"
  },
  {
    "id": 22,
    "customerId": 22,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-23"
  },
  {
    "id": 23,
    "customerId": 23,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-02"
  },
  {
    "id": 24,
    "customerId": 24,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-19"
  },
  {
    "id": 25,
    "customerId": 25,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-14"
  },
  {
    "id": 26,
    "customerId": 26,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-13"
  },
  {
    "id": 27,
    "customerId": 27,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-21"
  },
  {
    "id": 28,
    "customerId": 28,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-19"
  },
  {
    "id": 29,
    "customerId": 29,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-03-06"
  },
  {
    "id": 30,
    "customerId": 30,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-19"
  },
  {
    "id": 31,
    "customerId": 31,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-22"
  },
  {
    "id": 32,
    "customerId": 32,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-17"
  },
  {
    "id": 33,
    "customerId": 33,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-15"
  },
  {
    "id": 34,
    "customerId": 34,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-15"
  },
  {
    "id": 35,
    "customerId": 35,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-07"
  },
  {
    "id": 36,
    "customerId": 36,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-05"
  },
  {
    "id": 37,
    "customerId": 37,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-30"
  },
  {
    "id": 38,
    "customerId": 38,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-25"
  },
  {
    "id": 39,
    "customerId": 39,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-16"
  },
  {
    "id": 40,
    "customerId": 40,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-07"
  },
  {
    "id": 41,
    "customerId": 41,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-09-22"
  },
  {
    "id": 42,
    "customerId": 42,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-19"
  },
  {
    "id": 43,
    "customerId": 43,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-18"
  },
  {
    "id": 44,
    "customerId": 44,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-28"
  },
  {
    "id": 45,
    "customerId": 45,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-03-04"
  },
  {
    "id": 46,
    "customerId": 46,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-23"
  },
  {
    "id": 47,
    "customerId": 47,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-20"
  },
  {
    "id": 48,
    "customerId": 48,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-18"
  },
  {
    "id": 49,
    "customerId": 49,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-23"
  },
  {
    "id": 50,
    "customerId": 50,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-03"
  },
  {
    "id": 51,
    "customerId": 51,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-27"
  },
  {
    "id": 52,
    "customerId": 52,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-12-16"
  },
  {
    "id": 53,
    "customerId": 53,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-18"
  },
  {
    "id": 54,
    "customerId": 54,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2011-01-25"
  },
  {
    "id": 55,
    "customerId": 54,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-01-25"
  },
  {
    "id": 56,
    "customerId": 55,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-15"
  },
  {
    "id": 57,
    "customerId": 56,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-28"
  },
  {
    "id": 58,
    "customerId": 57,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-12-04"
  },
  {
    "id": 59,
    "customerId": 57,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-04"
  },
  {
    "id": 60,
    "customerId": 58,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-13"
  },
  {
    "id": 61,
    "customerId": 59,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-02"
  },
  {
    "id": 62,
    "customerId": 60,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-28"
  },
  {
    "id": 63,
    "customerId": 60,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-28"
  },
  {
    "id": 64,
    "customerId": 61,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-03-15"
  },
  {
    "id": 65,
    "customerId": 62,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-17"
  },
  {
    "id": 66,
    "customerId": 63,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-27"
  },
  {
    "id": 67,
    "customerId": 64,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-25"
  },
  {
    "id": 68,
    "customerId": 65,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 69,
    "customerId": 66,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-22"
  },
  {
    "id": 70,
    "customerId": 66,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-22"
  },
  {
    "id": 71,
    "customerId": 68,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-01-19"
  },
  {
    "id": 72,
    "customerId": 69,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-20"
  },
  {
    "id": 73,
    "customerId": 70,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-04"
  },
  {
    "id": 74,
    "customerId": 71,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-13"
  },
  {
    "id": 75,
    "customerId": 72,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-12-01"
  },
  {
    "id": 76,
    "customerId": 72,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-01"
  },
  {
    "id": 77,
    "customerId": 74,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-12-15"
  },
  {
    "id": 78,
    "customerId": 74,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-15"
  },
  {
    "id": 79,
    "customerId": 74,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-15"
  },
  {
    "id": 80,
    "customerId": 75,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-24"
  },
  {
    "id": 81,
    "customerId": 76,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-21"
  },
  {
    "id": 82,
    "customerId": 76,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-21"
  },
  {
    "id": 83,
    "customerId": 77,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-01-23"
  },
  {
    "id": 84,
    "customerId": 77,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-23"
  },
  {
    "id": 85,
    "customerId": 77,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-23"
  },
  {
    "id": 86,
    "customerId": 78,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-02-05"
  },
  {
    "id": 87,
    "customerId": 79,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-02"
  },
  {
    "id": 88,
    "customerId": 79,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-02"
  },
  {
    "id": 89,
    "customerId": 80,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-05-22"
  },
  {
    "id": 90,
    "customerId": 80,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-22"
  },
  {
    "id": 91,
    "customerId": 81,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-29"
  },
  {
    "id": 92,
    "customerId": 82,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 93,
    "customerId": 83,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-15"
  },
  {
    "id": 94,
    "customerId": 83,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-15"
  },
  {
    "id": 95,
    "customerId": 84,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2025-09-20"
  },
  {
    "id": 96,
    "customerId": 84,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-20"
  },
  {
    "id": 97,
    "customerId": 84,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-20"
  },
  {
    "id": 98,
    "customerId": 85,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2009-04-08"
  },
  {
    "id": 99,
    "customerId": 86,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-18"
  },
  {
    "id": 100,
    "customerId": 86,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-18"
  },
  {
    "id": 101,
    "customerId": 87,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-07"
  },
  {
    "id": 102,
    "customerId": 87,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-07"
  },
  {
    "id": 103,
    "customerId": 88,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-27"
  },
  {
    "id": 104,
    "customerId": 88,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-27"
  },
  {
    "id": 105,
    "customerId": 89,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-26"
  },
  {
    "id": 106,
    "customerId": 89,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-26"
  },
  {
    "id": 107,
    "customerId": 91,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 108,
    "customerId": 92,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-03-01"
  },
  {
    "id": 109,
    "customerId": 93,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-08-20"
  },
  {
    "id": 110,
    "customerId": 94,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-25"
  },
  {
    "id": 111,
    "customerId": 94,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-01-25"
  },
  {
    "id": 112,
    "customerId": 95,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-03-15"
  },
  {
    "id": 113,
    "customerId": 95,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-15"
  },
  {
    "id": 114,
    "customerId": 96,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-09-22"
  },
  {
    "id": 115,
    "customerId": 96,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-22"
  },
  {
    "id": 116,
    "customerId": 98,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 117,
    "customerId": 99,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-09-10"
  },
  {
    "id": 118,
    "customerId": 100,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-08-16"
  },
  {
    "id": 119,
    "customerId": 100,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-16"
  },
  {
    "id": 120,
    "customerId": 101,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-21"
  },
  {
    "id": 121,
    "customerId": 102,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-01-15"
  },
  {
    "id": 122,
    "customerId": 102,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-15"
  },
  {
    "id": 123,
    "customerId": 103,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-10"
  },
  {
    "id": 124,
    "customerId": 104,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-29"
  },
  {
    "id": 125,
    "customerId": 105,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-22"
  },
  {
    "id": 126,
    "customerId": 106,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 127,
    "customerId": 107,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-18"
  },
  {
    "id": 128,
    "customerId": 108,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-22"
  },
  {
    "id": 129,
    "customerId": 109,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 130,
    "customerId": 109,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 131,
    "customerId": 109,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 132,
    "customerId": 110,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 133,
    "customerId": 111,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 134,
    "customerId": 112,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-10-30"
  },
  {
    "id": 135,
    "customerId": 112,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-30"
  },
  {
    "id": 136,
    "customerId": 113,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-30"
  },
  {
    "id": 137,
    "customerId": 113,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-30"
  },
  {
    "id": 138,
    "customerId": 114,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-07-09"
  },
  {
    "id": 139,
    "customerId": 114,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-07-09"
  },
  {
    "id": 140,
    "customerId": 115,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-13"
  },
  {
    "id": 141,
    "customerId": 115,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-13"
  },
  {
    "id": 142,
    "customerId": 116,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-16"
  },
  {
    "id": 143,
    "customerId": 117,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-04"
  },
  {
    "id": 144,
    "customerId": 117,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-04"
  },
  {
    "id": 145,
    "customerId": 118,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-01"
  },
  {
    "id": 146,
    "customerId": 118,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-01"
  },
  {
    "id": 147,
    "customerId": 119,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 148,
    "customerId": 120,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-13"
  },
  {
    "id": 149,
    "customerId": 120,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-13"
  },
  {
    "id": 150,
    "customerId": 121,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-08-01"
  },
  {
    "id": 151,
    "customerId": 121,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-08-01"
  },
  {
    "id": 152,
    "customerId": 121,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-01"
  },
  {
    "id": 153,
    "customerId": 122,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-11-05"
  },
  {
    "id": 154,
    "customerId": 124,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 155,
    "customerId": 125,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-04"
  },
  {
    "id": 156,
    "customerId": 125,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-04"
  },
  {
    "id": 157,
    "customerId": 126,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-27"
  },
  {
    "id": 158,
    "customerId": 126,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-27"
  },
  {
    "id": 159,
    "customerId": 127,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 160,
    "customerId": 127,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 161,
    "customerId": 127,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 162,
    "customerId": 128,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-08-16"
  },
  {
    "id": 163,
    "customerId": 129,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-06-18"
  },
  {
    "id": 164,
    "customerId": 130,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-08-24"
  },
  {
    "id": 165,
    "customerId": 130,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-24"
  },
  {
    "id": 166,
    "customerId": 131,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 167,
    "customerId": 131,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 168,
    "customerId": 131,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 169,
    "customerId": 132,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-06-26"
  },
  {
    "id": 170,
    "customerId": 132,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-06-26"
  },
  {
    "id": 171,
    "customerId": 133,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-21"
  },
  {
    "id": 172,
    "customerId": 134,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-15"
  },
  {
    "id": 173,
    "customerId": 135,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-22"
  },
  {
    "id": 174,
    "customerId": 137,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-12-24"
  },
  {
    "id": 175,
    "customerId": 137,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-24"
  },
  {
    "id": 176,
    "customerId": 138,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-27"
  },
  {
    "id": 177,
    "customerId": 140,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-10-28"
  },
  {
    "id": 178,
    "customerId": 141,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-05"
  },
  {
    "id": 179,
    "customerId": 141,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-05"
  },
  {
    "id": 180,
    "customerId": 142,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-24"
  },
  {
    "id": 181,
    "customerId": 142,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-24"
  },
  {
    "id": 182,
    "customerId": 142,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-24"
  },
  {
    "id": 183,
    "customerId": 143,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-02-13"
  },
  {
    "id": 184,
    "customerId": 143,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-13"
  },
  {
    "id": 185,
    "customerId": 144,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-30"
  },
  {
    "id": 186,
    "customerId": 144,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-30"
  },
  {
    "id": 187,
    "customerId": 145,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-02-01"
  },
  {
    "id": 188,
    "customerId": 145,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-01"
  },
  {
    "id": 189,
    "customerId": 146,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 190,
    "customerId": 147,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-07-06"
  },
  {
    "id": 191,
    "customerId": 148,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-08-07"
  },
  {
    "id": 192,
    "customerId": 149,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 193,
    "customerId": 150,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-19"
  },
  {
    "id": 194,
    "customerId": 151,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-10-26"
  },
  {
    "id": 195,
    "customerId": 151,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-26"
  },
  {
    "id": 196,
    "customerId": 152,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-03"
  },
  {
    "id": 197,
    "customerId": 152,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-03"
  },
  {
    "id": 198,
    "customerId": 153,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-11-29"
  },
  {
    "id": 199,
    "customerId": 153,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-29"
  },
  {
    "id": 200,
    "customerId": 153,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-29"
  },
  {
    "id": 201,
    "customerId": 154,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-12-01"
  },
  {
    "id": 202,
    "customerId": 154,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-01"
  },
  {
    "id": 203,
    "customerId": 155,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-07-30"
  },
  {
    "id": 204,
    "customerId": 156,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 205,
    "customerId": 156,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 206,
    "customerId": 158,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-11-07"
  },
  {
    "id": 207,
    "customerId": 159,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-05-03"
  },
  {
    "id": 208,
    "customerId": 159,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-03"
  },
  {
    "id": 209,
    "customerId": 160,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-25"
  },
  {
    "id": 210,
    "customerId": 160,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-25"
  },
  {
    "id": 211,
    "customerId": 161,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-02-21"
  },
  {
    "id": 212,
    "customerId": 164,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 213,
    "customerId": 165,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-03"
  },
  {
    "id": 214,
    "customerId": 165,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-03"
  },
  {
    "id": 215,
    "customerId": 166,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-08-07"
  },
  {
    "id": 216,
    "customerId": 166,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-08-07"
  },
  {
    "id": 217,
    "customerId": 167,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 218,
    "customerId": 168,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 219,
    "customerId": 169,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 220,
    "customerId": 169,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 221,
    "customerId": 169,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 222,
    "customerId": 170,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-12-27"
  },
  {
    "id": 223,
    "customerId": 170,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-27"
  },
  {
    "id": 224,
    "customerId": 171,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-05-23"
  },
  {
    "id": 225,
    "customerId": 171,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-23"
  },
  {
    "id": 226,
    "customerId": 173,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-18"
  },
  {
    "id": 227,
    "customerId": 173,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-18"
  },
  {
    "id": 228,
    "customerId": 175,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-14"
  },
  {
    "id": 229,
    "customerId": 175,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-14"
  },
  {
    "id": 230,
    "customerId": 176,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-05"
  },
  {
    "id": 231,
    "customerId": 176,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-05"
  },
  {
    "id": 232,
    "customerId": 177,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-26"
  },
  {
    "id": 233,
    "customerId": 178,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-16"
  },
  {
    "id": 234,
    "customerId": 178,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-16"
  },
  {
    "id": 235,
    "customerId": 179,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-03"
  },
  {
    "id": 236,
    "customerId": 179,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-03"
  },
  {
    "id": 237,
    "customerId": 181,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-08-08"
  },
  {
    "id": 238,
    "customerId": 182,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-08"
  },
  {
    "id": 239,
    "customerId": 182,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-08"
  },
  {
    "id": 240,
    "customerId": 183,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2017-01-13"
  },
  {
    "id": 241,
    "customerId": 183,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-01-13"
  },
  {
    "id": 242,
    "customerId": 183,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-01-13"
  },
  {
    "id": 243,
    "customerId": 184,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-20"
  },
  {
    "id": 244,
    "customerId": 184,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-20"
  },
  {
    "id": 245,
    "customerId": 185,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-01-10"
  },
  {
    "id": 246,
    "customerId": 185,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-10"
  },
  {
    "id": 247,
    "customerId": 186,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-18"
  },
  {
    "id": 248,
    "customerId": 186,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-18"
  },
  {
    "id": 249,
    "customerId": 187,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-31"
  },
  {
    "id": 250,
    "customerId": 187,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-31"
  },
  {
    "id": 251,
    "customerId": 189,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 252,
    "customerId": 189,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 253,
    "customerId": 189,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 254,
    "customerId": 190,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-13"
  },
  {
    "id": 255,
    "customerId": 191,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-30"
  },
  {
    "id": 256,
    "customerId": 191,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-30"
  },
  {
    "id": 257,
    "customerId": 193,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-11-14"
  },
  {
    "id": 258,
    "customerId": 194,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-10"
  },
  {
    "id": 259,
    "customerId": 194,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-10"
  },
  {
    "id": 260,
    "customerId": 194,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-10"
  },
  {
    "id": 261,
    "customerId": 195,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-11"
  },
  {
    "id": 262,
    "customerId": 196,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-30"
  },
  {
    "id": 263,
    "customerId": 197,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-10"
  },
  {
    "id": 264,
    "customerId": 198,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-24"
  },
  {
    "id": 265,
    "customerId": 199,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-15"
  },
  {
    "id": 266,
    "customerId": 199,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-15"
  },
  {
    "id": 267,
    "customerId": 200,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-05-04"
  },
  {
    "id": 268,
    "customerId": 200,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-04"
  },
  {
    "id": 269,
    "customerId": 201,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-09-01"
  },
  {
    "id": 270,
    "customerId": 201,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-09-01"
  },
  {
    "id": 271,
    "customerId": 202,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-18"
  },
  {
    "id": 272,
    "customerId": 202,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-11-18"
  },
  {
    "id": 273,
    "customerId": 202,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-18"
  },
  {
    "id": 274,
    "customerId": 203,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-24"
  },
  {
    "id": 275,
    "customerId": 204,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-03"
  },
  {
    "id": 276,
    "customerId": 205,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-17"
  },
  {
    "id": 277,
    "customerId": 206,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-11-04"
  },
  {
    "id": 278,
    "customerId": 207,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-09-17"
  },
  {
    "id": 279,
    "customerId": 208,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-07-30"
  },
  {
    "id": 280,
    "customerId": 209,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 281,
    "customerId": 210,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-01-25"
  },
  {
    "id": 282,
    "customerId": 211,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-02-28"
  },
  {
    "id": 283,
    "customerId": 212,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-23"
  },
  {
    "id": 284,
    "customerId": 213,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-08-14"
  },
  {
    "id": 285,
    "customerId": 214,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 286,
    "customerId": 215,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 287,
    "customerId": 216,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 288,
    "customerId": 217,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 289,
    "customerId": 218,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-23"
  },
  {
    "id": 290,
    "customerId": 219,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 291,
    "customerId": 220,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-05-10"
  },
  {
    "id": 292,
    "customerId": 223,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-15"
  },
  {
    "id": 293,
    "customerId": 224,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-03-08"
  },
  {
    "id": 294,
    "customerId": 224,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-03-08"
  },
  {
    "id": 295,
    "customerId": 225,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-09-20"
  },
  {
    "id": 296,
    "customerId": 225,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-09-20"
  },
  {
    "id": 297,
    "customerId": 226,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-20"
  },
  {
    "id": 298,
    "customerId": 226,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-20"
  },
  {
    "id": 299,
    "customerId": 227,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-11-03"
  },
  {
    "id": 300,
    "customerId": 228,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-09-23"
  },
  {
    "id": 301,
    "customerId": 229,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-28"
  },
  {
    "id": 302,
    "customerId": 230,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-14"
  },
  {
    "id": 303,
    "customerId": 230,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-14"
  },
  {
    "id": 304,
    "customerId": 231,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-01"
  },
  {
    "id": 305,
    "customerId": 231,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-01"
  },
  {
    "id": 306,
    "customerId": 233,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-05-22"
  },
  {
    "id": 307,
    "customerId": 234,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 308,
    "customerId": 234,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 309,
    "customerId": 235,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 310,
    "customerId": 236,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-24"
  },
  {
    "id": 311,
    "customerId": 236,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-24"
  },
  {
    "id": 312,
    "customerId": 237,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-05"
  },
  {
    "id": 313,
    "customerId": 237,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-05"
  },
  {
    "id": 314,
    "customerId": 238,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-03-25"
  },
  {
    "id": 315,
    "customerId": 238,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-25"
  },
  {
    "id": 316,
    "customerId": 238,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-25"
  },
  {
    "id": 317,
    "customerId": 240,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-05-26"
  },
  {
    "id": 318,
    "customerId": 240,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-26"
  },
  {
    "id": 319,
    "customerId": 241,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-03"
  },
  {
    "id": 320,
    "customerId": 241,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-03"
  },
  {
    "id": 321,
    "customerId": 242,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 322,
    "customerId": 243,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-11"
  },
  {
    "id": 323,
    "customerId": 244,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-10"
  },
  {
    "id": 324,
    "customerId": 244,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-10"
  },
  {
    "id": 325,
    "customerId": 245,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-06"
  },
  {
    "id": 326,
    "customerId": 245,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-06"
  },
  {
    "id": 327,
    "customerId": 246,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-24"
  },
  {
    "id": 328,
    "customerId": 246,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-24"
  },
  {
    "id": 329,
    "customerId": 247,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-30"
  },
  {
    "id": 330,
    "customerId": 249,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-04"
  },
  {
    "id": 331,
    "customerId": 249,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-04"
  },
  {
    "id": 332,
    "customerId": 250,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 333,
    "customerId": 251,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-20"
  },
  {
    "id": 334,
    "customerId": 252,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-12"
  },
  {
    "id": 335,
    "customerId": 252,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-12"
  },
  {
    "id": 336,
    "customerId": 253,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-12-19"
  },
  {
    "id": 337,
    "customerId": 255,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-30"
  },
  {
    "id": 338,
    "customerId": 256,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-06"
  },
  {
    "id": 339,
    "customerId": 256,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-06"
  },
  {
    "id": 340,
    "customerId": 257,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-27"
  },
  {
    "id": 341,
    "customerId": 258,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-23"
  },
  {
    "id": 342,
    "customerId": 258,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-23"
  },
  {
    "id": 343,
    "customerId": 259,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 344,
    "customerId": 260,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 345,
    "customerId": 261,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-26"
  },
  {
    "id": 346,
    "customerId": 263,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-08-14"
  },
  {
    "id": 347,
    "customerId": 263,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-08-14"
  },
  {
    "id": 348,
    "customerId": 263,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-14"
  },
  {
    "id": 349,
    "customerId": 264,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-02-18"
  },
  {
    "id": 350,
    "customerId": 264,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-02-18"
  },
  {
    "id": 351,
    "customerId": 266,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 352,
    "customerId": 267,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-04-10"
  },
  {
    "id": 353,
    "customerId": 268,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-12"
  },
  {
    "id": 354,
    "customerId": 269,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-09"
  },
  {
    "id": 355,
    "customerId": 269,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-09"
  },
  {
    "id": 356,
    "customerId": 270,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-05-18"
  },
  {
    "id": 357,
    "customerId": 270,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-18"
  },
  {
    "id": 358,
    "customerId": 271,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-08-21"
  },
  {
    "id": 359,
    "customerId": 271,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-21"
  },
  {
    "id": 360,
    "customerId": 272,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-12-14"
  },
  {
    "id": 361,
    "customerId": 273,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-02"
  },
  {
    "id": 362,
    "customerId": 274,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-10-21"
  },
  {
    "id": 363,
    "customerId": 274,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-21"
  },
  {
    "id": 364,
    "customerId": 275,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-16"
  },
  {
    "id": 365,
    "customerId": 275,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-16"
  },
  {
    "id": 366,
    "customerId": 276,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-28"
  },
  {
    "id": 367,
    "customerId": 276,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-28"
  },
  {
    "id": 368,
    "customerId": 277,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 369,
    "customerId": 278,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-07"
  },
  {
    "id": 370,
    "customerId": 278,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-07"
  },
  {
    "id": 371,
    "customerId": 279,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-15"
  },
  {
    "id": 372,
    "customerId": 280,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-12-04"
  },
  {
    "id": 373,
    "customerId": 281,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-14"
  },
  {
    "id": 374,
    "customerId": 281,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-14"
  },
  {
    "id": 375,
    "customerId": 283,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-02-18"
  },
  {
    "id": 376,
    "customerId": 283,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-18"
  },
  {
    "id": 377,
    "customerId": 284,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-20"
  },
  {
    "id": 378,
    "customerId": 284,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-20"
  },
  {
    "id": 379,
    "customerId": 286,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-07-13"
  },
  {
    "id": 380,
    "customerId": 286,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-13"
  },
  {
    "id": 381,
    "customerId": 287,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-08-17"
  },
  {
    "id": 382,
    "customerId": 287,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-08-17"
  },
  {
    "id": 383,
    "customerId": 288,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-10"
  },
  {
    "id": 384,
    "customerId": 288,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-10"
  },
  {
    "id": 385,
    "customerId": 289,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-27"
  },
  {
    "id": 386,
    "customerId": 289,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-27"
  },
  {
    "id": 387,
    "customerId": 290,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-17"
  },
  {
    "id": 388,
    "customerId": 291,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-04-23"
  },
  {
    "id": 389,
    "customerId": 292,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-03-14"
  },
  {
    "id": 390,
    "customerId": 293,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 391,
    "customerId": 294,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 392,
    "customerId": 295,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-10-03"
  },
  {
    "id": 393,
    "customerId": 296,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-10-14"
  },
  {
    "id": 394,
    "customerId": 297,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-10"
  },
  {
    "id": 395,
    "customerId": 298,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-12-16"
  },
  {
    "id": 396,
    "customerId": 298,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-16"
  },
  {
    "id": 397,
    "customerId": 299,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-27"
  },
  {
    "id": 398,
    "customerId": 299,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-27"
  },
  {
    "id": 399,
    "customerId": 299,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-27"
  },
  {
    "id": 400,
    "customerId": 300,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2025-01-06"
  },
  {
    "id": 401,
    "customerId": 300,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-06"
  },
  {
    "id": 402,
    "customerId": 301,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-28"
  },
  {
    "id": 403,
    "customerId": 302,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 404,
    "customerId": 302,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 405,
    "customerId": 303,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-04-22"
  },
  {
    "id": 406,
    "customerId": 303,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-04-22"
  },
  {
    "id": 407,
    "customerId": 304,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-30"
  },
  {
    "id": 408,
    "customerId": 304,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-30"
  },
  {
    "id": 409,
    "customerId": 305,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-02"
  },
  {
    "id": 410,
    "customerId": 305,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-02"
  },
  {
    "id": 411,
    "customerId": 306,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-01"
  },
  {
    "id": 412,
    "customerId": 307,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-29"
  },
  {
    "id": 413,
    "customerId": 307,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-29"
  },
  {
    "id": 414,
    "customerId": 308,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-05-14"
  },
  {
    "id": 415,
    "customerId": 308,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-14"
  },
  {
    "id": 416,
    "customerId": 309,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-14"
  },
  {
    "id": 417,
    "customerId": 310,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-04"
  },
  {
    "id": 418,
    "customerId": 310,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-04"
  },
  {
    "id": 419,
    "customerId": 311,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-23"
  },
  {
    "id": 420,
    "customerId": 311,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-23"
  },
  {
    "id": 421,
    "customerId": 312,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-28"
  },
  {
    "id": 422,
    "customerId": 312,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-28"
  },
  {
    "id": 423,
    "customerId": 314,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-06"
  },
  {
    "id": 424,
    "customerId": 314,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-06"
  },
  {
    "id": 425,
    "customerId": 315,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-07-14"
  },
  {
    "id": 426,
    "customerId": 316,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 427,
    "customerId": 317,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-26"
  },
  {
    "id": 428,
    "customerId": 318,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-20"
  },
  {
    "id": 429,
    "customerId": 318,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-20"
  },
  {
    "id": 430,
    "customerId": 319,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-30"
  },
  {
    "id": 431,
    "customerId": 319,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-30"
  },
  {
    "id": 432,
    "customerId": 320,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-30"
  },
  {
    "id": 433,
    "customerId": 320,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-30"
  },
  {
    "id": 434,
    "customerId": 321,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-23"
  },
  {
    "id": 435,
    "customerId": 322,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-06-03"
  },
  {
    "id": 436,
    "customerId": 322,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-03"
  },
  {
    "id": 437,
    "customerId": 323,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-14"
  },
  {
    "id": 438,
    "customerId": 324,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-01"
  },
  {
    "id": 439,
    "customerId": 325,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 440,
    "customerId": 326,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-02-02"
  },
  {
    "id": 441,
    "customerId": 327,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 442,
    "customerId": 328,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-25"
  },
  {
    "id": 443,
    "customerId": 329,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-06-01"
  },
  {
    "id": 444,
    "customerId": 329,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-06-01"
  },
  {
    "id": 445,
    "customerId": 330,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-02-20"
  },
  {
    "id": 446,
    "customerId": 330,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-20"
  },
  {
    "id": 447,
    "customerId": 331,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-19"
  },
  {
    "id": 448,
    "customerId": 332,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-19"
  },
  {
    "id": 449,
    "customerId": 333,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-12"
  },
  {
    "id": 450,
    "customerId": 334,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-26"
  },
  {
    "id": 451,
    "customerId": 335,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 452,
    "customerId": 336,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-03"
  },
  {
    "id": 453,
    "customerId": 336,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-03"
  },
  {
    "id": 454,
    "customerId": 337,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-06-17"
  },
  {
    "id": 455,
    "customerId": 337,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-17"
  },
  {
    "id": 456,
    "customerId": 337,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-17"
  },
  {
    "id": 457,
    "customerId": 338,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-17"
  },
  {
    "id": 458,
    "customerId": 339,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 459,
    "customerId": 340,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 460,
    "customerId": 341,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-25"
  },
  {
    "id": 461,
    "customerId": 341,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-25"
  },
  {
    "id": 462,
    "customerId": 342,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-31"
  },
  {
    "id": 463,
    "customerId": 342,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-31"
  },
  {
    "id": 464,
    "customerId": 344,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-09-10"
  },
  {
    "id": 465,
    "customerId": 344,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-10"
  },
  {
    "id": 466,
    "customerId": 345,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-31"
  },
  {
    "id": 467,
    "customerId": 345,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-31"
  },
  {
    "id": 468,
    "customerId": 346,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-23"
  },
  {
    "id": 469,
    "customerId": 348,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-05-25"
  },
  {
    "id": 470,
    "customerId": 349,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-22"
  },
  {
    "id": 471,
    "customerId": 349,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-22"
  },
  {
    "id": 472,
    "customerId": 350,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-28"
  },
  {
    "id": 473,
    "customerId": 350,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-28"
  },
  {
    "id": 474,
    "customerId": 351,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-02"
  },
  {
    "id": 475,
    "customerId": 351,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-02"
  },
  {
    "id": 476,
    "customerId": 352,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-03-08"
  },
  {
    "id": 477,
    "customerId": 353,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-02"
  },
  {
    "id": 478,
    "customerId": 354,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-11-12"
  },
  {
    "id": 479,
    "customerId": 354,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-11-12"
  },
  {
    "id": 480,
    "customerId": 355,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-16"
  },
  {
    "id": 481,
    "customerId": 356,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-03"
  },
  {
    "id": 482,
    "customerId": 357,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-03-28"
  },
  {
    "id": 483,
    "customerId": 357,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-03-28"
  },
  {
    "id": 484,
    "customerId": 358,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-12-01"
  },
  {
    "id": 485,
    "customerId": 358,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-01"
  },
  {
    "id": 486,
    "customerId": 359,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-24"
  },
  {
    "id": 487,
    "customerId": 359,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-24"
  },
  {
    "id": 488,
    "customerId": 360,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-29"
  },
  {
    "id": 489,
    "customerId": 360,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-29"
  },
  {
    "id": 490,
    "customerId": 361,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-04"
  },
  {
    "id": 491,
    "customerId": 361,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-04"
  },
  {
    "id": 492,
    "customerId": 362,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-12-27"
  },
  {
    "id": 493,
    "customerId": 362,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-27"
  },
  {
    "id": 494,
    "customerId": 363,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-19"
  },
  {
    "id": 495,
    "customerId": 363,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-19"
  },
  {
    "id": 496,
    "customerId": 364,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 497,
    "customerId": 365,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 498,
    "customerId": 366,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-26"
  },
  {
    "id": 499,
    "customerId": 366,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-26"
  },
  {
    "id": 500,
    "customerId": 367,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-30"
  },
  {
    "id": 501,
    "customerId": 367,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-30"
  },
  {
    "id": 502,
    "customerId": 368,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-10"
  },
  {
    "id": 503,
    "customerId": 368,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-10"
  },
  {
    "id": 504,
    "customerId": 369,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-20"
  },
  {
    "id": 505,
    "customerId": 370,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-16"
  },
  {
    "id": 506,
    "customerId": 371,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-03-16"
  },
  {
    "id": 507,
    "customerId": 371,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-16"
  },
  {
    "id": 508,
    "customerId": 371,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-16"
  },
  {
    "id": 509,
    "customerId": 372,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-09-27"
  },
  {
    "id": 510,
    "customerId": 374,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-16"
  },
  {
    "id": 511,
    "customerId": 375,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-28"
  },
  {
    "id": 512,
    "customerId": 375,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-28"
  },
  {
    "id": 513,
    "customerId": 376,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-12"
  },
  {
    "id": 514,
    "customerId": 376,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-12"
  },
  {
    "id": 515,
    "customerId": 377,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 516,
    "customerId": 378,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-04"
  },
  {
    "id": 517,
    "customerId": 378,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-04"
  },
  {
    "id": 518,
    "customerId": 379,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-19"
  },
  {
    "id": 519,
    "customerId": 380,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-03-16"
  },
  {
    "id": 520,
    "customerId": 380,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-16"
  },
  {
    "id": 521,
    "customerId": 381,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-26"
  },
  {
    "id": 522,
    "customerId": 381,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-26"
  },
  {
    "id": 523,
    "customerId": 382,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-26"
  },
  {
    "id": 524,
    "customerId": 382,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-26"
  },
  {
    "id": 525,
    "customerId": 383,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-19"
  },
  {
    "id": 526,
    "customerId": 383,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-19"
  },
  {
    "id": 527,
    "customerId": 384,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 528,
    "customerId": 385,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-30"
  },
  {
    "id": 529,
    "customerId": 385,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-30"
  },
  {
    "id": 530,
    "customerId": 385,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-30"
  },
  {
    "id": 531,
    "customerId": 387,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-09-26"
  },
  {
    "id": 532,
    "customerId": 388,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-07-04"
  },
  {
    "id": 533,
    "customerId": 388,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-07-04"
  },
  {
    "id": 534,
    "customerId": 389,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 535,
    "customerId": 390,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-03-22"
  },
  {
    "id": 536,
    "customerId": 391,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-21"
  },
  {
    "id": 537,
    "customerId": 391,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-21"
  },
  {
    "id": 538,
    "customerId": 392,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-09"
  },
  {
    "id": 539,
    "customerId": 393,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-29"
  },
  {
    "id": 540,
    "customerId": 393,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-29"
  },
  {
    "id": 541,
    "customerId": 394,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-17"
  },
  {
    "id": 542,
    "customerId": 394,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-17"
  },
  {
    "id": 543,
    "customerId": 395,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-12-10"
  },
  {
    "id": 544,
    "customerId": 395,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-10"
  },
  {
    "id": 545,
    "customerId": 395,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-10"
  },
  {
    "id": 546,
    "customerId": 396,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-27"
  },
  {
    "id": 547,
    "customerId": 396,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-27"
  },
  {
    "id": 548,
    "customerId": 397,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 549,
    "customerId": 397,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 550,
    "customerId": 397,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 551,
    "customerId": 398,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-10-21"
  },
  {
    "id": 552,
    "customerId": 399,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-07"
  },
  {
    "id": 553,
    "customerId": 399,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-07"
  },
  {
    "id": 554,
    "customerId": 400,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-02"
  },
  {
    "id": 555,
    "customerId": 401,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-05"
  },
  {
    "id": 556,
    "customerId": 403,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-03-13"
  },
  {
    "id": 557,
    "customerId": 404,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-06"
  },
  {
    "id": 558,
    "customerId": 404,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-06"
  },
  {
    "id": 559,
    "customerId": 404,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-10-06"
  },
  {
    "id": 560,
    "customerId": 405,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 561,
    "customerId": 405,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 562,
    "customerId": 406,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-09-05"
  },
  {
    "id": 563,
    "customerId": 407,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-24"
  },
  {
    "id": 564,
    "customerId": 408,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-03"
  },
  {
    "id": 565,
    "customerId": 408,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-03"
  },
  {
    "id": 566,
    "customerId": 410,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-20"
  },
  {
    "id": 567,
    "customerId": 411,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 568,
    "customerId": 411,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 569,
    "customerId": 412,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-10-31"
  },
  {
    "id": 570,
    "customerId": 412,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-10-31"
  },
  {
    "id": 571,
    "customerId": 413,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-08-13"
  },
  {
    "id": 572,
    "customerId": 413,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-08-13"
  },
  {
    "id": 573,
    "customerId": 414,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-10"
  },
  {
    "id": 574,
    "customerId": 415,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-05"
  },
  {
    "id": 575,
    "customerId": 415,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-05"
  },
  {
    "id": 576,
    "customerId": 416,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-09-14"
  },
  {
    "id": 577,
    "customerId": 417,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-21"
  },
  {
    "id": 578,
    "customerId": 417,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-21"
  },
  {
    "id": 579,
    "customerId": 418,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-10-06"
  },
  {
    "id": 580,
    "customerId": 418,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-06"
  },
  {
    "id": 581,
    "customerId": 418,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-06"
  },
  {
    "id": 582,
    "customerId": 419,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-29"
  },
  {
    "id": 583,
    "customerId": 419,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-29"
  },
  {
    "id": 584,
    "customerId": 420,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-23"
  },
  {
    "id": 585,
    "customerId": 420,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-23"
  },
  {
    "id": 586,
    "customerId": 421,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-10"
  },
  {
    "id": 587,
    "customerId": 422,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-16"
  },
  {
    "id": 588,
    "customerId": 422,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-16"
  },
  {
    "id": 589,
    "customerId": 423,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-09-17"
  },
  {
    "id": 590,
    "customerId": 423,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-17"
  },
  {
    "id": 591,
    "customerId": 424,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-11"
  },
  {
    "id": 592,
    "customerId": 424,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-11"
  },
  {
    "id": 593,
    "customerId": 425,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-11-21"
  },
  {
    "id": 594,
    "customerId": 425,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-21"
  },
  {
    "id": 595,
    "customerId": 426,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-08-15"
  },
  {
    "id": 596,
    "customerId": 428,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 597,
    "customerId": 428,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 598,
    "customerId": 429,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-02"
  },
  {
    "id": 599,
    "customerId": 430,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-04"
  },
  {
    "id": 600,
    "customerId": 430,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-04"
  },
  {
    "id": 601,
    "customerId": 431,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-10-21"
  },
  {
    "id": 602,
    "customerId": 432,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-05-22"
  },
  {
    "id": 603,
    "customerId": 432,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-22"
  },
  {
    "id": 604,
    "customerId": 433,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-05-26"
  },
  {
    "id": 605,
    "customerId": 433,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-26"
  },
  {
    "id": 606,
    "customerId": 434,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-02"
  },
  {
    "id": 607,
    "customerId": 435,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-03"
  },
  {
    "id": 608,
    "customerId": 436,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 609,
    "customerId": 438,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-19"
  },
  {
    "id": 610,
    "customerId": 438,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-19"
  },
  {
    "id": 611,
    "customerId": 439,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-08-02"
  },
  {
    "id": 612,
    "customerId": 439,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-08-02"
  },
  {
    "id": 613,
    "customerId": 440,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 614,
    "customerId": 442,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 615,
    "customerId": 443,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-15"
  },
  {
    "id": 616,
    "customerId": 445,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-01-13"
  },
  {
    "id": 617,
    "customerId": 445,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-01-13"
  },
  {
    "id": 618,
    "customerId": 446,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-08-15"
  },
  {
    "id": 619,
    "customerId": 446,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-08-15"
  },
  {
    "id": 620,
    "customerId": 447,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-31"
  },
  {
    "id": 621,
    "customerId": 447,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-31"
  },
  {
    "id": 622,
    "customerId": 448,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-18"
  },
  {
    "id": 623,
    "customerId": 448,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-18"
  },
  {
    "id": 624,
    "customerId": 449,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-27"
  },
  {
    "id": 625,
    "customerId": 449,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-27"
  },
  {
    "id": 626,
    "customerId": 450,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-02-25"
  },
  {
    "id": 627,
    "customerId": 450,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-25"
  },
  {
    "id": 628,
    "customerId": 450,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-25"
  },
  {
    "id": 629,
    "customerId": 453,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-27"
  },
  {
    "id": 630,
    "customerId": 454,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-01"
  },
  {
    "id": 631,
    "customerId": 454,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-01"
  },
  {
    "id": 632,
    "customerId": 455,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-08"
  },
  {
    "id": 633,
    "customerId": 456,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-14"
  },
  {
    "id": 634,
    "customerId": 457,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 635,
    "customerId": 457,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 636,
    "customerId": 458,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-01-06"
  },
  {
    "id": 637,
    "customerId": 458,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-01-06"
  },
  {
    "id": 638,
    "customerId": 459,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-10-25"
  },
  {
    "id": 639,
    "customerId": 459,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-25"
  },
  {
    "id": 640,
    "customerId": 459,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-25"
  },
  {
    "id": 641,
    "customerId": 461,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-03-04"
  },
  {
    "id": 642,
    "customerId": 461,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-04"
  },
  {
    "id": 643,
    "customerId": 461,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-04"
  },
  {
    "id": 644,
    "customerId": 462,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-31"
  },
  {
    "id": 645,
    "customerId": 462,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-31"
  },
  {
    "id": 646,
    "customerId": 463,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-09-15"
  },
  {
    "id": 647,
    "customerId": 464,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 648,
    "customerId": 465,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-28"
  },
  {
    "id": 649,
    "customerId": 466,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-11"
  },
  {
    "id": 650,
    "customerId": 467,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-14"
  },
  {
    "id": 651,
    "customerId": 468,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 652,
    "customerId": 469,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-30"
  },
  {
    "id": 653,
    "customerId": 470,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 654,
    "customerId": 471,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-13"
  },
  {
    "id": 655,
    "customerId": 472,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 656,
    "customerId": 472,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 657,
    "customerId": 473,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-15"
  },
  {
    "id": 658,
    "customerId": 474,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-07-14"
  },
  {
    "id": 659,
    "customerId": 474,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-14"
  },
  {
    "id": 660,
    "customerId": 474,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-14"
  },
  {
    "id": 661,
    "customerId": 475,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-28"
  },
  {
    "id": 662,
    "customerId": 476,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-18"
  },
  {
    "id": 663,
    "customerId": 476,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-18"
  },
  {
    "id": 664,
    "customerId": 477,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 665,
    "customerId": 479,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-03"
  },
  {
    "id": 666,
    "customerId": 479,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-03"
  },
  {
    "id": 667,
    "customerId": 480,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 668,
    "customerId": 480,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 669,
    "customerId": 481,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-06"
  },
  {
    "id": 670,
    "customerId": 482,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-05-11"
  },
  {
    "id": 671,
    "customerId": 482,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-05-11"
  },
  {
    "id": 672,
    "customerId": 483,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-13"
  },
  {
    "id": 673,
    "customerId": 483,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-13"
  },
  {
    "id": 674,
    "customerId": 485,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-07-19"
  },
  {
    "id": 675,
    "customerId": 486,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 676,
    "customerId": 487,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-22"
  },
  {
    "id": 677,
    "customerId": 488,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 678,
    "customerId": 489,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-08-09"
  },
  {
    "id": 679,
    "customerId": 490,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-09-18"
  },
  {
    "id": 680,
    "customerId": 490,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-18"
  },
  {
    "id": 681,
    "customerId": 491,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-07-30"
  },
  {
    "id": 682,
    "customerId": 492,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-20"
  },
  {
    "id": 683,
    "customerId": 492,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-20"
  },
  {
    "id": 684,
    "customerId": 493,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 685,
    "customerId": 494,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-16"
  },
  {
    "id": 686,
    "customerId": 495,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-10"
  },
  {
    "id": 687,
    "customerId": 496,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-11"
  },
  {
    "id": 688,
    "customerId": 497,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-09"
  },
  {
    "id": 689,
    "customerId": 497,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-09"
  },
  {
    "id": 690,
    "customerId": 498,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-04"
  },
  {
    "id": 691,
    "customerId": 498,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-04"
  },
  {
    "id": 692,
    "customerId": 500,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-09"
  },
  {
    "id": 693,
    "customerId": 502,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 694,
    "customerId": 502,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 695,
    "customerId": 502,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 696,
    "customerId": 503,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 697,
    "customerId": 504,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-22"
  },
  {
    "id": 698,
    "customerId": 504,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-22"
  },
  {
    "id": 699,
    "customerId": 505,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-10"
  },
  {
    "id": 700,
    "customerId": 507,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 701,
    "customerId": 508,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-24"
  },
  {
    "id": 702,
    "customerId": 509,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-08-15"
  },
  {
    "id": 703,
    "customerId": 510,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-06-11"
  },
  {
    "id": 704,
    "customerId": 511,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-16"
  },
  {
    "id": 705,
    "customerId": 511,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-01-16"
  },
  {
    "id": 706,
    "customerId": 512,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-09-12"
  },
  {
    "id": 707,
    "customerId": 513,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-14"
  },
  {
    "id": 708,
    "customerId": 514,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-11-16"
  },
  {
    "id": 709,
    "customerId": 514,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-16"
  },
  {
    "id": 710,
    "customerId": 515,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-02-19"
  },
  {
    "id": 711,
    "customerId": 515,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-19"
  },
  {
    "id": 712,
    "customerId": 516,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-04-04"
  },
  {
    "id": 713,
    "customerId": 517,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-01-27"
  },
  {
    "id": 714,
    "customerId": 518,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-16"
  },
  {
    "id": 715,
    "customerId": 519,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-06"
  },
  {
    "id": 716,
    "customerId": 520,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 717,
    "customerId": 521,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-10-10"
  },
  {
    "id": 718,
    "customerId": 521,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-10-10"
  },
  {
    "id": 719,
    "customerId": 522,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-04-07"
  },
  {
    "id": 720,
    "customerId": 523,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-25"
  },
  {
    "id": 721,
    "customerId": 525,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-04"
  },
  {
    "id": 722,
    "customerId": 525,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-04"
  },
  {
    "id": 723,
    "customerId": 526,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-01"
  },
  {
    "id": 724,
    "customerId": 526,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-01"
  },
  {
    "id": 725,
    "customerId": 527,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-29"
  },
  {
    "id": 726,
    "customerId": 527,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-29"
  },
  {
    "id": 727,
    "customerId": 528,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 728,
    "customerId": 528,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 729,
    "customerId": 529,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-17"
  },
  {
    "id": 730,
    "customerId": 530,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-06-22"
  },
  {
    "id": 731,
    "customerId": 531,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-05"
  },
  {
    "id": 732,
    "customerId": 532,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-11"
  },
  {
    "id": 733,
    "customerId": 532,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-11"
  },
  {
    "id": 734,
    "customerId": 533,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-08-07"
  },
  {
    "id": 735,
    "customerId": 534,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-27"
  },
  {
    "id": 736,
    "customerId": 534,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-27"
  },
  {
    "id": 737,
    "customerId": 535,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-12-16"
  },
  {
    "id": 738,
    "customerId": 535,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-16"
  },
  {
    "id": 739,
    "customerId": 536,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 740,
    "customerId": 537,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-03-29"
  },
  {
    "id": 741,
    "customerId": 537,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-03-29"
  },
  {
    "id": 742,
    "customerId": 537,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-29"
  },
  {
    "id": 743,
    "customerId": 538,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 744,
    "customerId": 539,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-23"
  },
  {
    "id": 745,
    "customerId": 539,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-23"
  },
  {
    "id": 746,
    "customerId": 540,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-10"
  },
  {
    "id": 747,
    "customerId": 540,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-10"
  },
  {
    "id": 748,
    "customerId": 541,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-20"
  },
  {
    "id": 749,
    "customerId": 541,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-20"
  },
  {
    "id": 750,
    "customerId": 543,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-12-19"
  },
  {
    "id": 751,
    "customerId": 544,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 752,
    "customerId": 545,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-08"
  },
  {
    "id": 753,
    "customerId": 546,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 754,
    "customerId": 548,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-22"
  },
  {
    "id": 755,
    "customerId": 548,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-22"
  },
  {
    "id": 756,
    "customerId": 549,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-18"
  },
  {
    "id": 757,
    "customerId": 549,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-18"
  },
  {
    "id": 758,
    "customerId": 550,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-08-13"
  },
  {
    "id": 759,
    "customerId": 550,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-08-13"
  },
  {
    "id": 760,
    "customerId": 551,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-30"
  },
  {
    "id": 761,
    "customerId": 551,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-30"
  },
  {
    "id": 762,
    "customerId": 552,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-22"
  },
  {
    "id": 763,
    "customerId": 552,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-22"
  },
  {
    "id": 764,
    "customerId": 554,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-01-14"
  },
  {
    "id": 765,
    "customerId": 554,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-14"
  },
  {
    "id": 766,
    "customerId": 555,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-02-19"
  },
  {
    "id": 767,
    "customerId": 555,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-19"
  },
  {
    "id": 768,
    "customerId": 556,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-14"
  },
  {
    "id": 769,
    "customerId": 557,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-11"
  },
  {
    "id": 770,
    "customerId": 557,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-11"
  },
  {
    "id": 771,
    "customerId": 558,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-15"
  },
  {
    "id": 772,
    "customerId": 559,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-01-01"
  },
  {
    "id": 773,
    "customerId": 559,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-01"
  },
  {
    "id": 774,
    "customerId": 560,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-07"
  },
  {
    "id": 775,
    "customerId": 561,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-22"
  },
  {
    "id": 776,
    "customerId": 561,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-22"
  },
  {
    "id": 777,
    "customerId": 563,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-25"
  },
  {
    "id": 778,
    "customerId": 563,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-25"
  },
  {
    "id": 779,
    "customerId": 564,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-11"
  },
  {
    "id": 780,
    "customerId": 564,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-11"
  },
  {
    "id": 781,
    "customerId": 565,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-27"
  },
  {
    "id": 782,
    "customerId": 565,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-27"
  },
  {
    "id": 783,
    "customerId": 566,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-06"
  },
  {
    "id": 784,
    "customerId": 567,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-04-13"
  },
  {
    "id": 785,
    "customerId": 567,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-04-13"
  },
  {
    "id": 786,
    "customerId": 568,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-24"
  },
  {
    "id": 787,
    "customerId": 569,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-07"
  },
  {
    "id": 788,
    "customerId": 570,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 789,
    "customerId": 571,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-17"
  },
  {
    "id": 790,
    "customerId": 572,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-09"
  },
  {
    "id": 791,
    "customerId": 572,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-09"
  },
  {
    "id": 792,
    "customerId": 573,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-05-08"
  },
  {
    "id": 793,
    "customerId": 574,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-10"
  },
  {
    "id": 794,
    "customerId": 575,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-22"
  },
  {
    "id": 795,
    "customerId": 576,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-12-15"
  },
  {
    "id": 796,
    "customerId": 576,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-12-15"
  },
  {
    "id": 797,
    "customerId": 576,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-15"
  },
  {
    "id": 798,
    "customerId": 578,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-05-29"
  },
  {
    "id": 799,
    "customerId": 578,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-29"
  },
  {
    "id": 800,
    "customerId": 579,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-27"
  },
  {
    "id": 801,
    "customerId": 579,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-27"
  },
  {
    "id": 802,
    "customerId": 581,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-16"
  },
  {
    "id": 803,
    "customerId": 582,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 804,
    "customerId": 583,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-13"
  },
  {
    "id": 805,
    "customerId": 583,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-13"
  },
  {
    "id": 806,
    "customerId": 584,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-22"
  },
  {
    "id": 807,
    "customerId": 584,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-22"
  },
  {
    "id": 808,
    "customerId": 585,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-23"
  },
  {
    "id": 809,
    "customerId": 585,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-23"
  },
  {
    "id": 810,
    "customerId": 586,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-02"
  },
  {
    "id": 811,
    "customerId": 586,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-02"
  },
  {
    "id": 812,
    "customerId": 587,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-09-18"
  },
  {
    "id": 813,
    "customerId": 587,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-09-18"
  },
  {
    "id": 814,
    "customerId": 588,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 815,
    "customerId": 589,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 816,
    "customerId": 590,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-29"
  },
  {
    "id": 817,
    "customerId": 591,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-21"
  },
  {
    "id": 818,
    "customerId": 591,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-21"
  },
  {
    "id": 819,
    "customerId": 592,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-06-16"
  },
  {
    "id": 820,
    "customerId": 593,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 821,
    "customerId": 594,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-10"
  },
  {
    "id": 822,
    "customerId": 594,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-10"
  },
  {
    "id": 823,
    "customerId": 595,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-15"
  },
  {
    "id": 824,
    "customerId": 595,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-15"
  },
  {
    "id": 825,
    "customerId": 596,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-22"
  },
  {
    "id": 826,
    "customerId": 596,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-22"
  },
  {
    "id": 827,
    "customerId": 598,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-05-29"
  },
  {
    "id": 828,
    "customerId": 598,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-29"
  },
  {
    "id": 829,
    "customerId": 599,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-08"
  },
  {
    "id": 830,
    "customerId": 600,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-11"
  },
  {
    "id": 831,
    "customerId": 601,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-02-24"
  },
  {
    "id": 832,
    "customerId": 602,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 833,
    "customerId": 603,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-02-25"
  },
  {
    "id": 834,
    "customerId": 603,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-25"
  },
  {
    "id": 835,
    "customerId": 605,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-17"
  },
  {
    "id": 836,
    "customerId": 606,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-30"
  },
  {
    "id": 837,
    "customerId": 607,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-11-23"
  },
  {
    "id": 838,
    "customerId": 607,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-23"
  },
  {
    "id": 839,
    "customerId": 607,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-23"
  },
  {
    "id": 840,
    "customerId": 608,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-07"
  },
  {
    "id": 841,
    "customerId": 610,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-31"
  },
  {
    "id": 842,
    "customerId": 610,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-31"
  },
  {
    "id": 843,
    "customerId": 612,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-11"
  },
  {
    "id": 844,
    "customerId": 613,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-06"
  },
  {
    "id": 845,
    "customerId": 613,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-06"
  },
  {
    "id": 846,
    "customerId": 614,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-28"
  },
  {
    "id": 847,
    "customerId": 614,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-28"
  },
  {
    "id": 848,
    "customerId": 615,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-12"
  },
  {
    "id": 849,
    "customerId": 615,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-01-12"
  },
  {
    "id": 850,
    "customerId": 616,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-28"
  },
  {
    "id": 851,
    "customerId": 616,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-28"
  },
  {
    "id": 852,
    "customerId": 617,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-03-01"
  },
  {
    "id": 853,
    "customerId": 618,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-12"
  },
  {
    "id": 854,
    "customerId": 618,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-12"
  },
  {
    "id": 855,
    "customerId": 619,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 856,
    "customerId": 619,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 857,
    "customerId": 620,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 858,
    "customerId": 620,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 859,
    "customerId": 621,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-08-01"
  },
  {
    "id": 860,
    "customerId": 621,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-08-01"
  },
  {
    "id": 861,
    "customerId": 622,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-28"
  },
  {
    "id": 862,
    "customerId": 622,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-28"
  },
  {
    "id": 863,
    "customerId": 623,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-16"
  },
  {
    "id": 864,
    "customerId": 623,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-16"
  },
  {
    "id": 865,
    "customerId": 624,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-23"
  },
  {
    "id": 866,
    "customerId": 624,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-23"
  },
  {
    "id": 867,
    "customerId": 625,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-16"
  },
  {
    "id": 868,
    "customerId": 625,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-16"
  },
  {
    "id": 869,
    "customerId": 628,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-09-22"
  },
  {
    "id": 870,
    "customerId": 628,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-09-22"
  },
  {
    "id": 871,
    "customerId": 629,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-18"
  },
  {
    "id": 872,
    "customerId": 630,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-07-29"
  },
  {
    "id": 873,
    "customerId": 630,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-07-29"
  },
  {
    "id": 874,
    "customerId": 631,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-29"
  },
  {
    "id": 875,
    "customerId": 631,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-29"
  },
  {
    "id": 876,
    "customerId": 632,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-03-06"
  },
  {
    "id": 877,
    "customerId": 632,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-06"
  },
  {
    "id": 878,
    "customerId": 633,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-12-25"
  },
  {
    "id": 879,
    "customerId": 633,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-25"
  },
  {
    "id": 880,
    "customerId": 634,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 881,
    "customerId": 634,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 882,
    "customerId": 634,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 883,
    "customerId": 635,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-19"
  },
  {
    "id": 884,
    "customerId": 635,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-19"
  },
  {
    "id": 885,
    "customerId": 636,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-12"
  },
  {
    "id": 886,
    "customerId": 636,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-12"
  },
  {
    "id": 887,
    "customerId": 637,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-05"
  },
  {
    "id": 888,
    "customerId": 638,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-29"
  },
  {
    "id": 889,
    "customerId": 638,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-29"
  },
  {
    "id": 890,
    "customerId": 638,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-29"
  },
  {
    "id": 891,
    "customerId": 639,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-17"
  },
  {
    "id": 892,
    "customerId": 640,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-03-13"
  },
  {
    "id": 893,
    "customerId": 640,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-13"
  },
  {
    "id": 894,
    "customerId": 640,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-13"
  },
  {
    "id": 895,
    "customerId": 641,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-02-06"
  },
  {
    "id": 896,
    "customerId": 641,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-06"
  },
  {
    "id": 897,
    "customerId": 641,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-06"
  },
  {
    "id": 898,
    "customerId": 644,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-11-23"
  },
  {
    "id": 899,
    "customerId": 645,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 900,
    "customerId": 646,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 901,
    "customerId": 646,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 902,
    "customerId": 646,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 903,
    "customerId": 647,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 904,
    "customerId": 647,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 905,
    "customerId": 647,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 906,
    "customerId": 648,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 907,
    "customerId": 649,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 908,
    "customerId": 649,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 909,
    "customerId": 650,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 910,
    "customerId": 651,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-15"
  },
  {
    "id": 911,
    "customerId": 653,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 912,
    "customerId": 654,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-18"
  },
  {
    "id": 913,
    "customerId": 654,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-18"
  },
  {
    "id": 914,
    "customerId": 655,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-06-17"
  },
  {
    "id": 915,
    "customerId": 656,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 916,
    "customerId": 657,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-07-02"
  },
  {
    "id": 917,
    "customerId": 657,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-02"
  },
  {
    "id": 918,
    "customerId": 658,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-02"
  },
  {
    "id": 919,
    "customerId": 658,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-02"
  },
  {
    "id": 920,
    "customerId": 659,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-30"
  },
  {
    "id": 921,
    "customerId": 659,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-30"
  },
  {
    "id": 922,
    "customerId": 660,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-10-28"
  },
  {
    "id": 923,
    "customerId": 660,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-28"
  },
  {
    "id": 924,
    "customerId": 660,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-28"
  },
  {
    "id": 925,
    "customerId": 661,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-02"
  },
  {
    "id": 926,
    "customerId": 661,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-02"
  },
  {
    "id": 927,
    "customerId": 662,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-11-17"
  },
  {
    "id": 928,
    "customerId": 662,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-17"
  },
  {
    "id": 929,
    "customerId": 663,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-20"
  },
  {
    "id": 930,
    "customerId": 665,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-12"
  },
  {
    "id": 931,
    "customerId": 665,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-12"
  },
  {
    "id": 932,
    "customerId": 667,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-12-30"
  },
  {
    "id": 933,
    "customerId": 667,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-30"
  },
  {
    "id": 934,
    "customerId": 668,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-02-26"
  },
  {
    "id": 935,
    "customerId": 668,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-26"
  },
  {
    "id": 936,
    "customerId": 669,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-15"
  },
  {
    "id": 937,
    "customerId": 669,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-15"
  },
  {
    "id": 938,
    "customerId": 670,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-05"
  },
  {
    "id": 939,
    "customerId": 670,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-05"
  },
  {
    "id": 940,
    "customerId": 671,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-06-29"
  },
  {
    "id": 941,
    "customerId": 672,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-17"
  },
  {
    "id": 942,
    "customerId": 672,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-17"
  },
  {
    "id": 943,
    "customerId": 674,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-16"
  },
  {
    "id": 944,
    "customerId": 676,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-29"
  },
  {
    "id": 945,
    "customerId": 676,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-29"
  },
  {
    "id": 946,
    "customerId": 678,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 947,
    "customerId": 678,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 948,
    "customerId": 678,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 949,
    "customerId": 680,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-22"
  },
  {
    "id": 950,
    "customerId": 680,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-22"
  },
  {
    "id": 951,
    "customerId": 681,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-14"
  },
  {
    "id": 952,
    "customerId": 682,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-06-09"
  },
  {
    "id": 953,
    "customerId": 682,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-06-09"
  },
  {
    "id": 954,
    "customerId": 683,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-01-28"
  },
  {
    "id": 955,
    "customerId": 684,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-07-09"
  },
  {
    "id": 956,
    "customerId": 684,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-07-09"
  },
  {
    "id": 957,
    "customerId": 685,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-22"
  },
  {
    "id": 958,
    "customerId": 686,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-27"
  },
  {
    "id": 959,
    "customerId": 686,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-27"
  },
  {
    "id": 960,
    "customerId": 687,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-22"
  },
  {
    "id": 961,
    "customerId": 688,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-02-02"
  },
  {
    "id": 962,
    "customerId": 689,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-07"
  },
  {
    "id": 963,
    "customerId": 690,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 964,
    "customerId": 691,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-07-24"
  },
  {
    "id": 965,
    "customerId": 692,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-02"
  },
  {
    "id": 966,
    "customerId": 692,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-02"
  },
  {
    "id": 967,
    "customerId": 693,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-03"
  },
  {
    "id": 968,
    "customerId": 694,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-05-18"
  },
  {
    "id": 969,
    "customerId": 694,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-18"
  },
  {
    "id": 970,
    "customerId": 695,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-01-22"
  },
  {
    "id": 971,
    "customerId": 695,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-22"
  },
  {
    "id": 972,
    "customerId": 696,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-09-17"
  },
  {
    "id": 973,
    "customerId": 697,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-12"
  },
  {
    "id": 974,
    "customerId": 697,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-12"
  },
  {
    "id": 975,
    "customerId": 698,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-08-14"
  },
  {
    "id": 976,
    "customerId": 698,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-14"
  },
  {
    "id": 977,
    "customerId": 699,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-08"
  },
  {
    "id": 978,
    "customerId": 700,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 979,
    "customerId": 700,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 980,
    "customerId": 701,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-13"
  },
  {
    "id": 981,
    "customerId": 702,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-08-02"
  },
  {
    "id": 982,
    "customerId": 702,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-02"
  },
  {
    "id": 983,
    "customerId": 703,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-12-10"
  },
  {
    "id": 984,
    "customerId": 703,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-10"
  },
  {
    "id": 985,
    "customerId": 703,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-10"
  },
  {
    "id": 986,
    "customerId": 705,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-12-07"
  },
  {
    "id": 987,
    "customerId": 705,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-07"
  },
  {
    "id": 988,
    "customerId": 706,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-08-08"
  },
  {
    "id": 989,
    "customerId": 708,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-15"
  },
  {
    "id": 990,
    "customerId": 709,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-02"
  },
  {
    "id": 991,
    "customerId": 710,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-02-26"
  },
  {
    "id": 992,
    "customerId": 710,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-02-26"
  },
  {
    "id": 993,
    "customerId": 712,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-26"
  },
  {
    "id": 994,
    "customerId": 712,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-26"
  },
  {
    "id": 995,
    "customerId": 713,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-02"
  },
  {
    "id": 996,
    "customerId": 713,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-02"
  },
  {
    "id": 997,
    "customerId": 714,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-03"
  },
  {
    "id": 998,
    "customerId": 714,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-03"
  },
  {
    "id": 999,
    "customerId": 715,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-30"
  },
  {
    "id": 1000,
    "customerId": 716,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-23"
  },
  {
    "id": 1001,
    "customerId": 717,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-19"
  },
  {
    "id": 1002,
    "customerId": 717,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-19"
  },
  {
    "id": 1003,
    "customerId": 718,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 1004,
    "customerId": 719,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-19"
  },
  {
    "id": 1005,
    "customerId": 720,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-03"
  },
  {
    "id": 1006,
    "customerId": 721,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-28"
  },
  {
    "id": 1007,
    "customerId": 723,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-13"
  },
  {
    "id": 1008,
    "customerId": 723,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-13"
  },
  {
    "id": 1009,
    "customerId": 724,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-06-11"
  },
  {
    "id": 1010,
    "customerId": 725,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-03-16"
  },
  {
    "id": 1011,
    "customerId": 725,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-03-16"
  },
  {
    "id": 1012,
    "customerId": 726,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-01-29"
  },
  {
    "id": 1013,
    "customerId": 727,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1014,
    "customerId": 728,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-26"
  },
  {
    "id": 1015,
    "customerId": 729,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-03"
  },
  {
    "id": 1016,
    "customerId": 730,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-05-25"
  },
  {
    "id": 1017,
    "customerId": 731,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-02-25"
  },
  {
    "id": 1018,
    "customerId": 732,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-04"
  },
  {
    "id": 1019,
    "customerId": 733,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-07-15"
  },
  {
    "id": 1020,
    "customerId": 734,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-11-09"
  },
  {
    "id": 1021,
    "customerId": 735,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-23"
  },
  {
    "id": 1022,
    "customerId": 736,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-22"
  },
  {
    "id": 1023,
    "customerId": 736,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-22"
  },
  {
    "id": 1024,
    "customerId": 738,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 1025,
    "customerId": 738,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 1026,
    "customerId": 739,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-26"
  },
  {
    "id": 1027,
    "customerId": 739,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-26"
  },
  {
    "id": 1028,
    "customerId": 740,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-10-28"
  },
  {
    "id": 1029,
    "customerId": 741,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-09"
  },
  {
    "id": 1030,
    "customerId": 741,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-09"
  },
  {
    "id": 1031,
    "customerId": 743,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-08-30"
  },
  {
    "id": 1032,
    "customerId": 743,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-08-30"
  },
  {
    "id": 1033,
    "customerId": 744,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-05-01"
  },
  {
    "id": 1034,
    "customerId": 744,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-01"
  },
  {
    "id": 1035,
    "customerId": 745,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-03-02"
  },
  {
    "id": 1036,
    "customerId": 745,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-02"
  },
  {
    "id": 1037,
    "customerId": 746,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-24"
  },
  {
    "id": 1038,
    "customerId": 746,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-24"
  },
  {
    "id": 1039,
    "customerId": 747,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-27"
  },
  {
    "id": 1040,
    "customerId": 748,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-22"
  },
  {
    "id": 1041,
    "customerId": 749,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-03-17"
  },
  {
    "id": 1042,
    "customerId": 750,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-02"
  },
  {
    "id": 1043,
    "customerId": 750,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-02"
  },
  {
    "id": 1044,
    "customerId": 751,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-21"
  },
  {
    "id": 1045,
    "customerId": 752,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 1046,
    "customerId": 752,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 1047,
    "customerId": 752,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 1048,
    "customerId": 753,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 1049,
    "customerId": 753,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 1050,
    "customerId": 754,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-12-12"
  },
  {
    "id": 1051,
    "customerId": 755,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-29"
  },
  {
    "id": 1052,
    "customerId": 755,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-29"
  },
  {
    "id": 1053,
    "customerId": 756,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 1054,
    "customerId": 756,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 1055,
    "customerId": 757,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-07"
  },
  {
    "id": 1056,
    "customerId": 757,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-07"
  },
  {
    "id": 1057,
    "customerId": 758,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-12-02"
  },
  {
    "id": 1058,
    "customerId": 758,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-02"
  },
  {
    "id": 1059,
    "customerId": 759,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-05"
  },
  {
    "id": 1060,
    "customerId": 760,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 1061,
    "customerId": 760,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 1062,
    "customerId": 761,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-09"
  },
  {
    "id": 1063,
    "customerId": 761,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-09"
  },
  {
    "id": 1064,
    "customerId": 763,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-19"
  },
  {
    "id": 1065,
    "customerId": 763,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-19"
  },
  {
    "id": 1066,
    "customerId": 763,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-19"
  },
  {
    "id": 1067,
    "customerId": 764,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-23"
  },
  {
    "id": 1068,
    "customerId": 765,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-19"
  },
  {
    "id": 1069,
    "customerId": 765,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-19"
  },
  {
    "id": 1070,
    "customerId": 766,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1071,
    "customerId": 768,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-03"
  },
  {
    "id": 1072,
    "customerId": 768,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-03"
  },
  {
    "id": 1073,
    "customerId": 769,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-06-19"
  },
  {
    "id": 1074,
    "customerId": 769,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-19"
  },
  {
    "id": 1075,
    "customerId": 770,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-08"
  },
  {
    "id": 1076,
    "customerId": 770,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-08"
  },
  {
    "id": 1077,
    "customerId": 771,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-19"
  },
  {
    "id": 1078,
    "customerId": 771,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-19"
  },
  {
    "id": 1079,
    "customerId": 772,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-11-28"
  },
  {
    "id": 1080,
    "customerId": 772,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-28"
  },
  {
    "id": 1081,
    "customerId": 773,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-09"
  },
  {
    "id": 1082,
    "customerId": 773,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-09"
  },
  {
    "id": 1083,
    "customerId": 774,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-13"
  },
  {
    "id": 1084,
    "customerId": 775,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-05-08"
  },
  {
    "id": 1085,
    "customerId": 775,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-08"
  },
  {
    "id": 1086,
    "customerId": 776,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 1087,
    "customerId": 776,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 1088,
    "customerId": 777,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-20"
  },
  {
    "id": 1089,
    "customerId": 779,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-10-09"
  },
  {
    "id": 1090,
    "customerId": 780,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-06"
  },
  {
    "id": 1091,
    "customerId": 781,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-06"
  },
  {
    "id": 1092,
    "customerId": 781,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-06"
  },
  {
    "id": 1093,
    "customerId": 782,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-23"
  },
  {
    "id": 1094,
    "customerId": 782,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-23"
  },
  {
    "id": 1095,
    "customerId": 783,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-18"
  },
  {
    "id": 1096,
    "customerId": 784,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1097,
    "customerId": 785,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-19"
  },
  {
    "id": 1098,
    "customerId": 786,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1099,
    "customerId": 787,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1100,
    "customerId": 789,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-03-04"
  },
  {
    "id": 1101,
    "customerId": 789,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-04"
  },
  {
    "id": 1102,
    "customerId": 792,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-30"
  },
  {
    "id": 1103,
    "customerId": 792,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-30"
  },
  {
    "id": 1104,
    "customerId": 793,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-08-01"
  },
  {
    "id": 1105,
    "customerId": 794,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-11-20"
  },
  {
    "id": 1106,
    "customerId": 795,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-09-11"
  },
  {
    "id": 1107,
    "customerId": 796,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-05-21"
  },
  {
    "id": 1108,
    "customerId": 797,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-09-18"
  },
  {
    "id": 1109,
    "customerId": 797,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-09-18"
  },
  {
    "id": 1110,
    "customerId": 798,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-24"
  },
  {
    "id": 1111,
    "customerId": 798,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-24"
  },
  {
    "id": 1112,
    "customerId": 799,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-06"
  },
  {
    "id": 1113,
    "customerId": 799,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-06"
  },
  {
    "id": 1114,
    "customerId": 800,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-25"
  },
  {
    "id": 1115,
    "customerId": 800,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-25"
  },
  {
    "id": 1116,
    "customerId": 801,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-02-08"
  },
  {
    "id": 1117,
    "customerId": 801,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-08"
  },
  {
    "id": 1118,
    "customerId": 802,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-11"
  },
  {
    "id": 1119,
    "customerId": 802,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-11"
  },
  {
    "id": 1120,
    "customerId": 804,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-23"
  },
  {
    "id": 1121,
    "customerId": 804,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-23"
  },
  {
    "id": 1122,
    "customerId": 805,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-06-30"
  },
  {
    "id": 1123,
    "customerId": 805,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-30"
  },
  {
    "id": 1124,
    "customerId": 806,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-01-07"
  },
  {
    "id": 1125,
    "customerId": 806,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-01-07"
  },
  {
    "id": 1126,
    "customerId": 807,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-10-10"
  },
  {
    "id": 1127,
    "customerId": 807,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-10"
  },
  {
    "id": 1128,
    "customerId": 808,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-01-27"
  },
  {
    "id": 1129,
    "customerId": 809,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-08"
  },
  {
    "id": 1130,
    "customerId": 809,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-08"
  },
  {
    "id": 1131,
    "customerId": 810,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-03"
  },
  {
    "id": 1132,
    "customerId": 811,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-08-16"
  },
  {
    "id": 1133,
    "customerId": 811,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-08-16"
  },
  {
    "id": 1134,
    "customerId": 812,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-03-21"
  },
  {
    "id": 1135,
    "customerId": 813,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-09-18"
  },
  {
    "id": 1136,
    "customerId": 814,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-11-23"
  },
  {
    "id": 1137,
    "customerId": 814,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-23"
  },
  {
    "id": 1138,
    "customerId": 815,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-02-19"
  },
  {
    "id": 1139,
    "customerId": 815,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-19"
  },
  {
    "id": 1140,
    "customerId": 816,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-02-22"
  },
  {
    "id": 1141,
    "customerId": 816,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-22"
  },
  {
    "id": 1142,
    "customerId": 817,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-30"
  },
  {
    "id": 1143,
    "customerId": 818,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 1144,
    "customerId": 818,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 1145,
    "customerId": 818,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 1146,
    "customerId": 819,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-29"
  },
  {
    "id": 1147,
    "customerId": 820,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1148,
    "customerId": 821,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-07-07"
  },
  {
    "id": 1149,
    "customerId": 822,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-25"
  },
  {
    "id": 1150,
    "customerId": 823,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-05-10"
  },
  {
    "id": 1151,
    "customerId": 824,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-11-16"
  },
  {
    "id": 1152,
    "customerId": 824,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-16"
  },
  {
    "id": 1153,
    "customerId": 824,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-16"
  },
  {
    "id": 1154,
    "customerId": 825,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 1155,
    "customerId": 826,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-08-14"
  },
  {
    "id": 1156,
    "customerId": 827,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-04"
  },
  {
    "id": 1157,
    "customerId": 828,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1158,
    "customerId": 829,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-04-17"
  },
  {
    "id": 1159,
    "customerId": 830,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1160,
    "customerId": 831,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-12"
  },
  {
    "id": 1161,
    "customerId": 831,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-01-12"
  },
  {
    "id": 1162,
    "customerId": 832,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1163,
    "customerId": 833,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1164,
    "customerId": 834,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1165,
    "customerId": 835,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-01-25"
  },
  {
    "id": 1166,
    "customerId": 836,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-07-07"
  },
  {
    "id": 1167,
    "customerId": 837,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-23"
  },
  {
    "id": 1168,
    "customerId": 837,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-23"
  },
  {
    "id": 1169,
    "customerId": 838,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-30"
  },
  {
    "id": 1170,
    "customerId": 839,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1171,
    "customerId": 840,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-03-13"
  },
  {
    "id": 1172,
    "customerId": 841,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-04-01"
  },
  {
    "id": 1173,
    "customerId": 842,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-14"
  },
  {
    "id": 1174,
    "customerId": 844,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-20"
  },
  {
    "id": 1175,
    "customerId": 844,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-20"
  },
  {
    "id": 1176,
    "customerId": 845,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-02"
  },
  {
    "id": 1177,
    "customerId": 845,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-02"
  },
  {
    "id": 1178,
    "customerId": 846,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-15"
  },
  {
    "id": 1179,
    "customerId": 846,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-15"
  },
  {
    "id": 1180,
    "customerId": 848,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-15"
  },
  {
    "id": 1181,
    "customerId": 849,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-06"
  },
  {
    "id": 1182,
    "customerId": 850,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-11-29"
  },
  {
    "id": 1183,
    "customerId": 851,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-17"
  },
  {
    "id": 1184,
    "customerId": 851,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-17"
  },
  {
    "id": 1185,
    "customerId": 852,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-17"
  },
  {
    "id": 1186,
    "customerId": 853,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-08-16"
  },
  {
    "id": 1187,
    "customerId": 854,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-30"
  },
  {
    "id": 1188,
    "customerId": 855,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1189,
    "customerId": 856,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-26"
  },
  {
    "id": 1190,
    "customerId": 857,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-07"
  },
  {
    "id": 1191,
    "customerId": 857,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-07"
  },
  {
    "id": 1192,
    "customerId": 858,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1193,
    "customerId": 859,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-15"
  },
  {
    "id": 1194,
    "customerId": 860,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-22"
  },
  {
    "id": 1195,
    "customerId": 861,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 1196,
    "customerId": 862,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-11-18"
  },
  {
    "id": 1197,
    "customerId": 863,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-04"
  },
  {
    "id": 1198,
    "customerId": 863,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-04"
  },
  {
    "id": 1199,
    "customerId": 863,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-04"
  },
  {
    "id": 1200,
    "customerId": 864,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-08-30"
  },
  {
    "id": 1201,
    "customerId": 864,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-08-30"
  },
  {
    "id": 1202,
    "customerId": 865,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-16"
  },
  {
    "id": 1203,
    "customerId": 865,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-16"
  },
  {
    "id": 1204,
    "customerId": 866,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-06"
  },
  {
    "id": 1205,
    "customerId": 867,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-11-16"
  },
  {
    "id": 1206,
    "customerId": 868,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-28"
  },
  {
    "id": 1207,
    "customerId": 869,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 1208,
    "customerId": 870,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1209,
    "customerId": 871,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-05-13"
  },
  {
    "id": 1210,
    "customerId": 871,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-13"
  },
  {
    "id": 1211,
    "customerId": 872,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-02-20"
  },
  {
    "id": 1212,
    "customerId": 872,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-20"
  },
  {
    "id": 1213,
    "customerId": 873,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-06-22"
  },
  {
    "id": 1214,
    "customerId": 873,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-22"
  },
  {
    "id": 1215,
    "customerId": 874,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-06-11"
  },
  {
    "id": 1216,
    "customerId": 875,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-04"
  },
  {
    "id": 1217,
    "customerId": 876,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1218,
    "customerId": 877,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-17"
  },
  {
    "id": 1219,
    "customerId": 878,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-18"
  },
  {
    "id": 1220,
    "customerId": 879,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1221,
    "customerId": 880,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-04-28"
  },
  {
    "id": 1222,
    "customerId": 881,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-23"
  },
  {
    "id": 1223,
    "customerId": 881,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-23"
  },
  {
    "id": 1224,
    "customerId": 882,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-08"
  },
  {
    "id": 1225,
    "customerId": 882,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-08"
  },
  {
    "id": 1226,
    "customerId": 883,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-07"
  },
  {
    "id": 1227,
    "customerId": 883,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-07"
  },
  {
    "id": 1228,
    "customerId": 884,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-23"
  },
  {
    "id": 1229,
    "customerId": 884,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-23"
  },
  {
    "id": 1230,
    "customerId": 885,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-24"
  },
  {
    "id": 1231,
    "customerId": 887,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-21"
  },
  {
    "id": 1232,
    "customerId": 888,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-11-12"
  },
  {
    "id": 1233,
    "customerId": 889,
    "sourceType": "retail",
    "sourceName": "Faire",
    "firstSeenOn": "2026-05-20"
  },
  {
    "id": 1234,
    "customerId": 889,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-20"
  },
  {
    "id": 1235,
    "customerId": 890,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1236,
    "customerId": 891,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-14"
  },
  {
    "id": 1237,
    "customerId": 892,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-02-01"
  },
  {
    "id": 1238,
    "customerId": 893,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-06"
  },
  {
    "id": 1239,
    "customerId": 893,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-06"
  },
  {
    "id": 1240,
    "customerId": 894,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-24"
  },
  {
    "id": 1241,
    "customerId": 894,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-24"
  },
  {
    "id": 1242,
    "customerId": 895,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-31"
  },
  {
    "id": 1243,
    "customerId": 895,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-31"
  },
  {
    "id": 1244,
    "customerId": 896,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 1245,
    "customerId": 896,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 1246,
    "customerId": 897,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-28"
  },
  {
    "id": 1247,
    "customerId": 897,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-28"
  },
  {
    "id": 1248,
    "customerId": 898,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-01"
  },
  {
    "id": 1249,
    "customerId": 898,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-01"
  },
  {
    "id": 1250,
    "customerId": 900,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-15"
  },
  {
    "id": 1251,
    "customerId": 901,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-10-21"
  },
  {
    "id": 1252,
    "customerId": 902,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1253,
    "customerId": 903,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-04-04"
  },
  {
    "id": 1254,
    "customerId": 904,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-01-10"
  },
  {
    "id": 1255,
    "customerId": 905,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-03-01"
  },
  {
    "id": 1256,
    "customerId": 906,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-08-12"
  },
  {
    "id": 1257,
    "customerId": 906,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-08-12"
  },
  {
    "id": 1258,
    "customerId": 907,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-25"
  },
  {
    "id": 1259,
    "customerId": 908,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-09-14"
  },
  {
    "id": 1260,
    "customerId": 909,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-04-11"
  },
  {
    "id": 1261,
    "customerId": 910,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-07-18"
  },
  {
    "id": 1262,
    "customerId": 910,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-18"
  },
  {
    "id": 1263,
    "customerId": 911,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-07"
  },
  {
    "id": 1264,
    "customerId": 912,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-23"
  },
  {
    "id": 1265,
    "customerId": 912,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-23"
  },
  {
    "id": 1266,
    "customerId": 913,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-03"
  },
  {
    "id": 1267,
    "customerId": 914,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-30"
  },
  {
    "id": 1268,
    "customerId": 914,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-30"
  },
  {
    "id": 1269,
    "customerId": 915,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-17"
  },
  {
    "id": 1270,
    "customerId": 915,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-01-17"
  },
  {
    "id": 1271,
    "customerId": 916,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-11"
  },
  {
    "id": 1272,
    "customerId": 918,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-01-02"
  },
  {
    "id": 1273,
    "customerId": 919,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-11"
  },
  {
    "id": 1274,
    "customerId": 919,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-11"
  },
  {
    "id": 1275,
    "customerId": 920,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-05"
  },
  {
    "id": 1276,
    "customerId": 921,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-17"
  },
  {
    "id": 1277,
    "customerId": 921,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-17"
  },
  {
    "id": 1278,
    "customerId": 922,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-04-22"
  },
  {
    "id": 1279,
    "customerId": 923,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-02"
  },
  {
    "id": 1280,
    "customerId": 923,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-02"
  },
  {
    "id": 1281,
    "customerId": 924,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-02-21"
  },
  {
    "id": 1282,
    "customerId": 925,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-15"
  },
  {
    "id": 1283,
    "customerId": 926,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-11-19"
  },
  {
    "id": 1284,
    "customerId": 926,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-19"
  },
  {
    "id": 1285,
    "customerId": 927,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-22"
  },
  {
    "id": 1286,
    "customerId": 928,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-26"
  },
  {
    "id": 1287,
    "customerId": 929,
    "sourceType": "website",
    "sourceName": "Website Contact Form",
    "firstSeenOn": "2026-02-22"
  },
  {
    "id": 1288,
    "customerId": 930,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-14"
  },
  {
    "id": 1289,
    "customerId": 930,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-14"
  },
  {
    "id": 1290,
    "customerId": 931,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1291,
    "customerId": 932,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-05"
  },
  {
    "id": 1292,
    "customerId": 933,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 1293,
    "customerId": 934,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-03-18"
  },
  {
    "id": 1294,
    "customerId": 935,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-09"
  },
  {
    "id": 1295,
    "customerId": 936,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-04-28"
  },
  {
    "id": 1296,
    "customerId": 937,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-30"
  },
  {
    "id": 1297,
    "customerId": 938,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1298,
    "customerId": 940,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-07-21"
  },
  {
    "id": 1299,
    "customerId": 940,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-07-21"
  },
  {
    "id": 1300,
    "customerId": 942,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-12-02"
  },
  {
    "id": 1301,
    "customerId": 942,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-02"
  },
  {
    "id": 1302,
    "customerId": 943,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-28"
  },
  {
    "id": 1303,
    "customerId": 944,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1304,
    "customerId": 945,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1305,
    "customerId": 946,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 1306,
    "customerId": 947,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-08-19"
  },
  {
    "id": 1307,
    "customerId": 948,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1308,
    "customerId": 949,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-18"
  },
  {
    "id": 1309,
    "customerId": 950,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-26"
  },
  {
    "id": 1310,
    "customerId": 950,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-26"
  },
  {
    "id": 1311,
    "customerId": 952,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2018-04-02"
  },
  {
    "id": 1312,
    "customerId": 952,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-02"
  },
  {
    "id": 1313,
    "customerId": 953,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1314,
    "customerId": 954,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-09-25"
  },
  {
    "id": 1315,
    "customerId": 956,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-11-07"
  },
  {
    "id": 1316,
    "customerId": 957,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-06-29"
  },
  {
    "id": 1317,
    "customerId": 957,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-06-29"
  },
  {
    "id": 1318,
    "customerId": 958,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-22"
  },
  {
    "id": 1319,
    "customerId": 959,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-08"
  },
  {
    "id": 1320,
    "customerId": 959,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-08"
  },
  {
    "id": 1321,
    "customerId": 960,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-29"
  },
  {
    "id": 1322,
    "customerId": 962,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-12"
  },
  {
    "id": 1323,
    "customerId": 962,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-12"
  },
  {
    "id": 1324,
    "customerId": 963,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-10"
  },
  {
    "id": 1325,
    "customerId": 964,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-15"
  },
  {
    "id": 1326,
    "customerId": 964,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-15"
  },
  {
    "id": 1327,
    "customerId": 965,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-09"
  },
  {
    "id": 1328,
    "customerId": 965,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-09"
  },
  {
    "id": 1329,
    "customerId": 966,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-25"
  },
  {
    "id": 1330,
    "customerId": 971,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-13"
  },
  {
    "id": 1331,
    "customerId": 971,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-13"
  },
  {
    "id": 1332,
    "customerId": 972,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-14"
  },
  {
    "id": 1333,
    "customerId": 973,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-08-17"
  },
  {
    "id": 1334,
    "customerId": 973,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-17"
  },
  {
    "id": 1335,
    "customerId": 973,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-17"
  },
  {
    "id": 1336,
    "customerId": 975,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-24"
  },
  {
    "id": 1337,
    "customerId": 976,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-01"
  },
  {
    "id": 1338,
    "customerId": 976,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-01"
  },
  {
    "id": 1339,
    "customerId": 977,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-11"
  },
  {
    "id": 1340,
    "customerId": 978,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-08-10"
  },
  {
    "id": 1341,
    "customerId": 978,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-10"
  },
  {
    "id": 1342,
    "customerId": 979,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1343,
    "customerId": 980,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-26"
  },
  {
    "id": 1344,
    "customerId": 981,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1345,
    "customerId": 982,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-06-01"
  },
  {
    "id": 1346,
    "customerId": 982,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-06-01"
  },
  {
    "id": 1347,
    "customerId": 983,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-09"
  },
  {
    "id": 1348,
    "customerId": 983,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-09"
  },
  {
    "id": 1349,
    "customerId": 984,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-15"
  },
  {
    "id": 1350,
    "customerId": 984,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-15"
  },
  {
    "id": 1351,
    "customerId": 985,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-09-25"
  },
  {
    "id": 1352,
    "customerId": 985,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-25"
  },
  {
    "id": 1353,
    "customerId": 986,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-03-02"
  },
  {
    "id": 1354,
    "customerId": 986,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-02"
  },
  {
    "id": 1355,
    "customerId": 988,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-11"
  },
  {
    "id": 1356,
    "customerId": 988,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-11"
  },
  {
    "id": 1357,
    "customerId": 989,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-11"
  },
  {
    "id": 1358,
    "customerId": 990,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-09-19"
  },
  {
    "id": 1359,
    "customerId": 990,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-19"
  },
  {
    "id": 1360,
    "customerId": 991,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-01"
  },
  {
    "id": 1361,
    "customerId": 991,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-01"
  },
  {
    "id": 1362,
    "customerId": 992,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1363,
    "customerId": 993,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-21"
  },
  {
    "id": 1364,
    "customerId": 994,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-28"
  },
  {
    "id": 1365,
    "customerId": 994,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-28"
  },
  {
    "id": 1366,
    "customerId": 995,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-03-19"
  },
  {
    "id": 1367,
    "customerId": 995,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-19"
  },
  {
    "id": 1368,
    "customerId": 995,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-19"
  },
  {
    "id": 1369,
    "customerId": 996,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 1370,
    "customerId": 997,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-02-28"
  },
  {
    "id": 1371,
    "customerId": 997,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-28"
  },
  {
    "id": 1372,
    "customerId": 998,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-02"
  },
  {
    "id": 1373,
    "customerId": 999,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 1374,
    "customerId": 999,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 1375,
    "customerId": 999,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 1376,
    "customerId": 999,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 1377,
    "customerId": 1000,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 1378,
    "customerId": 1000,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 1379,
    "customerId": 1000,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 1380,
    "customerId": 1001,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2024-05-04"
  },
  {
    "id": 1381,
    "customerId": 1001,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-04"
  },
  {
    "id": 1382,
    "customerId": 1003,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-09-11"
  },
  {
    "id": 1383,
    "customerId": 1003,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-09-11"
  },
  {
    "id": 1384,
    "customerId": 1004,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-08-01"
  },
  {
    "id": 1385,
    "customerId": 1005,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-05"
  },
  {
    "id": 1386,
    "customerId": 1005,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-05"
  },
  {
    "id": 1387,
    "customerId": 1006,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-11"
  },
  {
    "id": 1388,
    "customerId": 1007,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1389,
    "customerId": 1009,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-03-20"
  },
  {
    "id": 1390,
    "customerId": 1009,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-20"
  },
  {
    "id": 1391,
    "customerId": 1010,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-22"
  },
  {
    "id": 1392,
    "customerId": 1010,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-22"
  },
  {
    "id": 1393,
    "customerId": 1012,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-14"
  },
  {
    "id": 1394,
    "customerId": 1013,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 1395,
    "customerId": 1014,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-25"
  },
  {
    "id": 1396,
    "customerId": 1014,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-25"
  },
  {
    "id": 1397,
    "customerId": 1015,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-05-09"
  },
  {
    "id": 1398,
    "customerId": 1015,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-09"
  },
  {
    "id": 1399,
    "customerId": 1016,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-08-06"
  },
  {
    "id": 1400,
    "customerId": 1018,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1401,
    "customerId": 1019,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-23"
  },
  {
    "id": 1402,
    "customerId": 1020,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-03-04"
  },
  {
    "id": 1403,
    "customerId": 1020,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-04"
  },
  {
    "id": 1404,
    "customerId": 1022,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-22"
  },
  {
    "id": 1405,
    "customerId": 1022,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-22"
  },
  {
    "id": 1406,
    "customerId": 1023,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-26"
  },
  {
    "id": 1407,
    "customerId": 1023,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-26"
  },
  {
    "id": 1408,
    "customerId": 1023,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-26"
  },
  {
    "id": 1409,
    "customerId": 1024,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-14"
  },
  {
    "id": 1410,
    "customerId": 1024,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-14"
  },
  {
    "id": 1411,
    "customerId": 1025,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 1412,
    "customerId": 1025,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 1413,
    "customerId": 1026,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-08"
  },
  {
    "id": 1414,
    "customerId": 1027,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-11-13"
  },
  {
    "id": 1415,
    "customerId": 1027,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-11-13"
  },
  {
    "id": 1416,
    "customerId": 1028,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-28"
  },
  {
    "id": 1417,
    "customerId": 1028,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-28"
  },
  {
    "id": 1418,
    "customerId": 1029,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 1419,
    "customerId": 1029,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 1420,
    "customerId": 1030,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1421,
    "customerId": 1031,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-06-19"
  },
  {
    "id": 1422,
    "customerId": 1031,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-06-19"
  },
  {
    "id": 1423,
    "customerId": 1032,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-05-02"
  },
  {
    "id": 1424,
    "customerId": 1032,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-02"
  },
  {
    "id": 1425,
    "customerId": 1033,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-08"
  },
  {
    "id": 1426,
    "customerId": 1033,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-08"
  },
  {
    "id": 1427,
    "customerId": 1034,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-02-05"
  },
  {
    "id": 1428,
    "customerId": 1034,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-02-05"
  },
  {
    "id": 1429,
    "customerId": 1034,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-02-05"
  },
  {
    "id": 1430,
    "customerId": 1035,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-21"
  },
  {
    "id": 1431,
    "customerId": 1035,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-21"
  },
  {
    "id": 1432,
    "customerId": 1039,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-08-01"
  },
  {
    "id": 1433,
    "customerId": 1040,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-12-02"
  },
  {
    "id": 1434,
    "customerId": 1041,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-13"
  },
  {
    "id": 1435,
    "customerId": 1041,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-13"
  },
  {
    "id": 1436,
    "customerId": 1042,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-08"
  },
  {
    "id": 1437,
    "customerId": 1042,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-08"
  },
  {
    "id": 1438,
    "customerId": 1043,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-09"
  },
  {
    "id": 1439,
    "customerId": 1044,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 1440,
    "customerId": 1045,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-02-29"
  },
  {
    "id": 1441,
    "customerId": 1045,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-29"
  },
  {
    "id": 1442,
    "customerId": 1045,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-29"
  },
  {
    "id": 1443,
    "customerId": 1046,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-16"
  },
  {
    "id": 1444,
    "customerId": 1046,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-16"
  },
  {
    "id": 1445,
    "customerId": 1047,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2017-06-16"
  },
  {
    "id": 1446,
    "customerId": 1047,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-06-16"
  },
  {
    "id": 1447,
    "customerId": 1047,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-06-16"
  },
  {
    "id": 1448,
    "customerId": 1048,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-03-12"
  },
  {
    "id": 1449,
    "customerId": 1048,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-12"
  },
  {
    "id": 1450,
    "customerId": 1049,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-10-29"
  },
  {
    "id": 1451,
    "customerId": 1050,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-29"
  },
  {
    "id": 1452,
    "customerId": 1050,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-29"
  },
  {
    "id": 1453,
    "customerId": 1051,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-26"
  },
  {
    "id": 1454,
    "customerId": 1051,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-26"
  },
  {
    "id": 1455,
    "customerId": 1052,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-07-03"
  },
  {
    "id": 1456,
    "customerId": 1052,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-03"
  },
  {
    "id": 1457,
    "customerId": 1053,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-02"
  },
  {
    "id": 1458,
    "customerId": 1053,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-02"
  },
  {
    "id": 1459,
    "customerId": 1054,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-01-02"
  },
  {
    "id": 1460,
    "customerId": 1054,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-02"
  },
  {
    "id": 1461,
    "customerId": 1055,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-29"
  },
  {
    "id": 1462,
    "customerId": 1056,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-01"
  },
  {
    "id": 1463,
    "customerId": 1056,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-01"
  },
  {
    "id": 1464,
    "customerId": 1057,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-04-17"
  },
  {
    "id": 1465,
    "customerId": 1058,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-28"
  },
  {
    "id": 1466,
    "customerId": 1059,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-06-07"
  },
  {
    "id": 1467,
    "customerId": 1059,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-06-07"
  },
  {
    "id": 1468,
    "customerId": 1060,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-01"
  },
  {
    "id": 1469,
    "customerId": 1060,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-01"
  },
  {
    "id": 1470,
    "customerId": 1061,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1471,
    "customerId": 1062,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-01"
  },
  {
    "id": 1472,
    "customerId": 1062,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-01"
  },
  {
    "id": 1473,
    "customerId": 1063,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 1474,
    "customerId": 1063,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 1475,
    "customerId": 1063,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 1476,
    "customerId": 1064,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-10"
  },
  {
    "id": 1477,
    "customerId": 1064,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-10"
  },
  {
    "id": 1478,
    "customerId": 1065,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-05-11"
  },
  {
    "id": 1479,
    "customerId": 1065,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-05-11"
  },
  {
    "id": 1480,
    "customerId": 1065,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-11"
  },
  {
    "id": 1481,
    "customerId": 1067,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 1482,
    "customerId": 1067,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 1483,
    "customerId": 1069,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-06"
  },
  {
    "id": 1484,
    "customerId": 1070,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-06"
  },
  {
    "id": 1485,
    "customerId": 1070,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-06"
  },
  {
    "id": 1486,
    "customerId": 1071,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-26"
  },
  {
    "id": 1487,
    "customerId": 1071,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-26"
  },
  {
    "id": 1488,
    "customerId": 1072,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-06-05"
  },
  {
    "id": 1489,
    "customerId": 1072,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-05"
  },
  {
    "id": 1490,
    "customerId": 1073,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-09-24"
  },
  {
    "id": 1491,
    "customerId": 1073,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-09-24"
  },
  {
    "id": 1492,
    "customerId": 1074,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-02-19"
  },
  {
    "id": 1493,
    "customerId": 1074,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-02-19"
  },
  {
    "id": 1494,
    "customerId": 1075,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-05-12"
  },
  {
    "id": 1495,
    "customerId": 1075,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-12"
  },
  {
    "id": 1496,
    "customerId": 1075,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-12"
  },
  {
    "id": 1497,
    "customerId": 1076,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-09"
  },
  {
    "id": 1498,
    "customerId": 1078,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 1499,
    "customerId": 1080,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-08-11"
  },
  {
    "id": 1500,
    "customerId": 1080,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-08-11"
  },
  {
    "id": 1501,
    "customerId": 1081,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-27"
  },
  {
    "id": 1502,
    "customerId": 1081,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-27"
  },
  {
    "id": 1503,
    "customerId": 1081,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-27"
  },
  {
    "id": 1504,
    "customerId": 1082,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-12"
  },
  {
    "id": 1505,
    "customerId": 1082,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-12"
  },
  {
    "id": 1506,
    "customerId": 1083,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-09-25"
  },
  {
    "id": 1507,
    "customerId": 1083,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-25"
  },
  {
    "id": 1508,
    "customerId": 1084,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1509,
    "customerId": 1085,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 1510,
    "customerId": 1086,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 1511,
    "customerId": 1088,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-12-13"
  },
  {
    "id": 1512,
    "customerId": 1088,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-13"
  },
  {
    "id": 1513,
    "customerId": 1089,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1514,
    "customerId": 1090,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-09"
  },
  {
    "id": 1515,
    "customerId": 1090,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-09"
  },
  {
    "id": 1516,
    "customerId": 1091,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-08-16"
  },
  {
    "id": 1517,
    "customerId": 1091,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-08-16"
  },
  {
    "id": 1518,
    "customerId": 1091,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-16"
  },
  {
    "id": 1519,
    "customerId": 1092,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-08-12"
  },
  {
    "id": 1520,
    "customerId": 1092,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-08-12"
  },
  {
    "id": 1521,
    "customerId": 1093,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-01-05"
  },
  {
    "id": 1522,
    "customerId": 1093,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-01-05"
  },
  {
    "id": 1523,
    "customerId": 1094,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-02"
  },
  {
    "id": 1524,
    "customerId": 1094,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-02"
  },
  {
    "id": 1525,
    "customerId": 1095,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-09"
  },
  {
    "id": 1526,
    "customerId": 1096,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-28"
  },
  {
    "id": 1527,
    "customerId": 1097,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-25"
  },
  {
    "id": 1528,
    "customerId": 1097,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-25"
  },
  {
    "id": 1529,
    "customerId": 1098,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-09-30"
  },
  {
    "id": 1530,
    "customerId": 1098,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-30"
  },
  {
    "id": 1531,
    "customerId": 1099,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-16"
  },
  {
    "id": 1532,
    "customerId": 1100,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-07-23"
  },
  {
    "id": 1533,
    "customerId": 1101,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-12-12"
  },
  {
    "id": 1534,
    "customerId": 1101,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-12"
  },
  {
    "id": 1535,
    "customerId": 1102,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-16"
  },
  {
    "id": 1536,
    "customerId": 1102,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-16"
  },
  {
    "id": 1537,
    "customerId": 1103,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-15"
  },
  {
    "id": 1538,
    "customerId": 1103,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-15"
  },
  {
    "id": 1539,
    "customerId": 1104,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-28"
  },
  {
    "id": 1540,
    "customerId": 1104,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-28"
  },
  {
    "id": 1541,
    "customerId": 1105,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-11-12"
  },
  {
    "id": 1542,
    "customerId": 1106,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-04"
  },
  {
    "id": 1543,
    "customerId": 1107,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-04-27"
  },
  {
    "id": 1544,
    "customerId": 1108,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-04-17"
  },
  {
    "id": 1545,
    "customerId": 1109,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-19"
  },
  {
    "id": 1546,
    "customerId": 1110,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-01"
  },
  {
    "id": 1547,
    "customerId": 1112,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-28"
  },
  {
    "id": 1548,
    "customerId": 1112,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-28"
  },
  {
    "id": 1549,
    "customerId": 1113,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1550,
    "customerId": 1114,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-17"
  },
  {
    "id": 1551,
    "customerId": 1114,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-17"
  },
  {
    "id": 1552,
    "customerId": 1115,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-10-17"
  },
  {
    "id": 1553,
    "customerId": 1115,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-17"
  },
  {
    "id": 1554,
    "customerId": 1116,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1555,
    "customerId": 1117,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-13"
  },
  {
    "id": 1556,
    "customerId": 1117,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-13"
  },
  {
    "id": 1557,
    "customerId": 1118,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-25"
  },
  {
    "id": 1558,
    "customerId": 1118,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-02-25"
  },
  {
    "id": 1559,
    "customerId": 1118,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-25"
  },
  {
    "id": 1560,
    "customerId": 1119,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1561,
    "customerId": 1120,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 1562,
    "customerId": 1120,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 1563,
    "customerId": 1121,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-08-31"
  },
  {
    "id": 1564,
    "customerId": 1122,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-14"
  },
  {
    "id": 1565,
    "customerId": 1123,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-14"
  },
  {
    "id": 1566,
    "customerId": 1124,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-24"
  },
  {
    "id": 1567,
    "customerId": 1125,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-10"
  },
  {
    "id": 1568,
    "customerId": 1126,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-05-09"
  },
  {
    "id": 1569,
    "customerId": 1126,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-09"
  },
  {
    "id": 1570,
    "customerId": 1127,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-30"
  },
  {
    "id": 1571,
    "customerId": 1127,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-30"
  },
  {
    "id": 1572,
    "customerId": 1128,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-08-12"
  },
  {
    "id": 1573,
    "customerId": 1128,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-08-12"
  },
  {
    "id": 1574,
    "customerId": 1128,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-12"
  },
  {
    "id": 1575,
    "customerId": 1129,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-05"
  },
  {
    "id": 1576,
    "customerId": 1129,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-05"
  },
  {
    "id": 1577,
    "customerId": 1130,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-13"
  },
  {
    "id": 1578,
    "customerId": 1130,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-13"
  },
  {
    "id": 1579,
    "customerId": 1131,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-09-18"
  },
  {
    "id": 1580,
    "customerId": 1132,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-06-10"
  },
  {
    "id": 1581,
    "customerId": 1132,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-10"
  },
  {
    "id": 1582,
    "customerId": 1134,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-07"
  },
  {
    "id": 1583,
    "customerId": 1134,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-07"
  },
  {
    "id": 1584,
    "customerId": 1135,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 1585,
    "customerId": 1135,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 1586,
    "customerId": 1136,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-23"
  },
  {
    "id": 1587,
    "customerId": 1136,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-23"
  },
  {
    "id": 1588,
    "customerId": 1137,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-18"
  },
  {
    "id": 1589,
    "customerId": 1137,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-18"
  },
  {
    "id": 1590,
    "customerId": 1138,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-07"
  },
  {
    "id": 1591,
    "customerId": 1139,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-29"
  },
  {
    "id": 1592,
    "customerId": 1139,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-29"
  },
  {
    "id": 1593,
    "customerId": 1141,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-06-17"
  },
  {
    "id": 1594,
    "customerId": 1143,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-08-19"
  },
  {
    "id": 1595,
    "customerId": 1144,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-01-06"
  },
  {
    "id": 1596,
    "customerId": 1145,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-11-25"
  },
  {
    "id": 1597,
    "customerId": 1146,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-16"
  },
  {
    "id": 1598,
    "customerId": 1146,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-16"
  },
  {
    "id": 1599,
    "customerId": 1147,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-13"
  },
  {
    "id": 1600,
    "customerId": 1147,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-13"
  },
  {
    "id": 1601,
    "customerId": 1148,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-06"
  },
  {
    "id": 1602,
    "customerId": 1149,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-06"
  },
  {
    "id": 1603,
    "customerId": 1149,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-06"
  },
  {
    "id": 1604,
    "customerId": 1150,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-20"
  },
  {
    "id": 1605,
    "customerId": 1150,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-20"
  },
  {
    "id": 1606,
    "customerId": 1151,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-12-19"
  },
  {
    "id": 1607,
    "customerId": 1152,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-12-05"
  },
  {
    "id": 1608,
    "customerId": 1153,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-19"
  },
  {
    "id": 1609,
    "customerId": 1153,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-19"
  },
  {
    "id": 1610,
    "customerId": 1154,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-07-02"
  },
  {
    "id": 1611,
    "customerId": 1154,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-02"
  },
  {
    "id": 1612,
    "customerId": 1155,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-04-25"
  },
  {
    "id": 1613,
    "customerId": 1156,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-07-25"
  },
  {
    "id": 1614,
    "customerId": 1157,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-09-15"
  },
  {
    "id": 1615,
    "customerId": 1158,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-18"
  },
  {
    "id": 1616,
    "customerId": 1159,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-03-21"
  },
  {
    "id": 1617,
    "customerId": 1160,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-04-09"
  },
  {
    "id": 1618,
    "customerId": 1161,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-11-29"
  },
  {
    "id": 1619,
    "customerId": 1161,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-29"
  },
  {
    "id": 1620,
    "customerId": 1162,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-02-20"
  },
  {
    "id": 1621,
    "customerId": 1162,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-20"
  },
  {
    "id": 1622,
    "customerId": 1163,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2024-12-09"
  },
  {
    "id": 1623,
    "customerId": 1164,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-06-11"
  },
  {
    "id": 1624,
    "customerId": 1165,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-30"
  },
  {
    "id": 1625,
    "customerId": 1166,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-13"
  },
  {
    "id": 1626,
    "customerId": 1166,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-13"
  },
  {
    "id": 1627,
    "customerId": 1167,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-11-18"
  },
  {
    "id": 1628,
    "customerId": 1167,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-11-18"
  },
  {
    "id": 1629,
    "customerId": 1168,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-06"
  },
  {
    "id": 1630,
    "customerId": 1168,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-06"
  },
  {
    "id": 1631,
    "customerId": 1169,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-06-02"
  },
  {
    "id": 1632,
    "customerId": 1169,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-06-02"
  },
  {
    "id": 1633,
    "customerId": 1170,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-11"
  },
  {
    "id": 1634,
    "customerId": 1171,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-15"
  },
  {
    "id": 1635,
    "customerId": 1171,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-15"
  },
  {
    "id": 1636,
    "customerId": 1172,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-07-06"
  },
  {
    "id": 1637,
    "customerId": 1172,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-06"
  },
  {
    "id": 1638,
    "customerId": 1173,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-01"
  },
  {
    "id": 1639,
    "customerId": 1173,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-01"
  },
  {
    "id": 1640,
    "customerId": 1175,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-19"
  },
  {
    "id": 1641,
    "customerId": 1175,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-19"
  },
  {
    "id": 1642,
    "customerId": 1176,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1643,
    "customerId": 1177,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-27"
  },
  {
    "id": 1644,
    "customerId": 1177,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-27"
  },
  {
    "id": 1645,
    "customerId": 1178,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-01-28"
  },
  {
    "id": 1646,
    "customerId": 1178,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-28"
  },
  {
    "id": 1647,
    "customerId": 1179,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-10-09"
  },
  {
    "id": 1648,
    "customerId": 1179,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-09"
  },
  {
    "id": 1649,
    "customerId": 1180,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-09"
  },
  {
    "id": 1650,
    "customerId": 1181,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 1651,
    "customerId": 1182,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-05"
  },
  {
    "id": 1652,
    "customerId": 1182,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-05"
  },
  {
    "id": 1653,
    "customerId": 1184,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-14"
  },
  {
    "id": 1654,
    "customerId": 1184,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-14"
  },
  {
    "id": 1655,
    "customerId": 1185,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-06-18"
  },
  {
    "id": 1656,
    "customerId": 1185,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-06-18"
  },
  {
    "id": 1657,
    "customerId": 1186,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-01"
  },
  {
    "id": 1658,
    "customerId": 1188,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-07-07"
  },
  {
    "id": 1659,
    "customerId": 1189,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-25"
  },
  {
    "id": 1660,
    "customerId": 1189,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-25"
  },
  {
    "id": 1661,
    "customerId": 1190,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-08-03"
  },
  {
    "id": 1662,
    "customerId": 1190,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-08-03"
  },
  {
    "id": 1663,
    "customerId": 1191,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-03"
  },
  {
    "id": 1664,
    "customerId": 1191,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-03"
  },
  {
    "id": 1665,
    "customerId": 1192,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-25"
  },
  {
    "id": 1666,
    "customerId": 1192,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-25"
  },
  {
    "id": 1667,
    "customerId": 1194,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-16"
  },
  {
    "id": 1668,
    "customerId": 1194,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-16"
  },
  {
    "id": 1669,
    "customerId": 1195,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-02-28"
  },
  {
    "id": 1670,
    "customerId": 1195,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-28"
  },
  {
    "id": 1671,
    "customerId": 1196,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-22"
  },
  {
    "id": 1672,
    "customerId": 1196,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-22"
  },
  {
    "id": 1673,
    "customerId": 1197,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-11"
  },
  {
    "id": 1674,
    "customerId": 1197,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-11"
  },
  {
    "id": 1675,
    "customerId": 1198,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-24"
  },
  {
    "id": 1676,
    "customerId": 1198,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-24"
  },
  {
    "id": 1677,
    "customerId": 1199,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-08-09"
  },
  {
    "id": 1678,
    "customerId": 1199,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-08-09"
  },
  {
    "id": 1679,
    "customerId": 1200,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-11"
  },
  {
    "id": 1680,
    "customerId": 1200,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-11"
  },
  {
    "id": 1681,
    "customerId": 1201,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1682,
    "customerId": 1202,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-16"
  },
  {
    "id": 1683,
    "customerId": 1202,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-16"
  },
  {
    "id": 1684,
    "customerId": 1203,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-28"
  },
  {
    "id": 1685,
    "customerId": 1203,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-28"
  },
  {
    "id": 1686,
    "customerId": 1204,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-16"
  },
  {
    "id": 1687,
    "customerId": 1204,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-16"
  },
  {
    "id": 1688,
    "customerId": 1205,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-05"
  },
  {
    "id": 1689,
    "customerId": 1205,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-05"
  },
  {
    "id": 1690,
    "customerId": 1207,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2015-02-11"
  },
  {
    "id": 1691,
    "customerId": 1207,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-02-11"
  },
  {
    "id": 1692,
    "customerId": 1209,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-11-27"
  },
  {
    "id": 1693,
    "customerId": 1209,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-27"
  },
  {
    "id": 1694,
    "customerId": 1209,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-27"
  },
  {
    "id": 1695,
    "customerId": 1210,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-31"
  },
  {
    "id": 1696,
    "customerId": 1210,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-31"
  },
  {
    "id": 1697,
    "customerId": 1212,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 1698,
    "customerId": 1213,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-10-19"
  },
  {
    "id": 1699,
    "customerId": 1213,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-19"
  },
  {
    "id": 1700,
    "customerId": 1214,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-07-15"
  },
  {
    "id": 1701,
    "customerId": 1215,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-04-06"
  },
  {
    "id": 1702,
    "customerId": 1215,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-04-06"
  },
  {
    "id": 1703,
    "customerId": 1216,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-27"
  },
  {
    "id": 1704,
    "customerId": 1216,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-27"
  },
  {
    "id": 1705,
    "customerId": 1217,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-10"
  },
  {
    "id": 1706,
    "customerId": 1217,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-10"
  },
  {
    "id": 1707,
    "customerId": 1218,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-12-01"
  },
  {
    "id": 1708,
    "customerId": 1218,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-01"
  },
  {
    "id": 1709,
    "customerId": 1219,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-08"
  },
  {
    "id": 1710,
    "customerId": 1220,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1711,
    "customerId": 1221,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-28"
  },
  {
    "id": 1712,
    "customerId": 1221,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-28"
  },
  {
    "id": 1713,
    "customerId": 1222,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-24"
  },
  {
    "id": 1714,
    "customerId": 1223,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-10"
  },
  {
    "id": 1715,
    "customerId": 1224,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-03-10"
  },
  {
    "id": 1716,
    "customerId": 1225,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-04"
  },
  {
    "id": 1717,
    "customerId": 1226,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1718,
    "customerId": 1227,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-04-19"
  },
  {
    "id": 1719,
    "customerId": 1228,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-09-01"
  },
  {
    "id": 1720,
    "customerId": 1228,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-01"
  },
  {
    "id": 1721,
    "customerId": 1229,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-06-10"
  },
  {
    "id": 1722,
    "customerId": 1229,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-06-10"
  },
  {
    "id": 1723,
    "customerId": 1230,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-06"
  },
  {
    "id": 1724,
    "customerId": 1230,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-06"
  },
  {
    "id": 1725,
    "customerId": 1230,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-06"
  },
  {
    "id": 1726,
    "customerId": 1231,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-12-11"
  },
  {
    "id": 1727,
    "customerId": 1233,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-06"
  },
  {
    "id": 1728,
    "customerId": 1235,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-04-01"
  },
  {
    "id": 1729,
    "customerId": 1236,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-10"
  },
  {
    "id": 1730,
    "customerId": 1237,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-14"
  },
  {
    "id": 1731,
    "customerId": 1238,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-21"
  },
  {
    "id": 1732,
    "customerId": 1238,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-21"
  },
  {
    "id": 1733,
    "customerId": 1239,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-23"
  },
  {
    "id": 1734,
    "customerId": 1239,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-23"
  },
  {
    "id": 1735,
    "customerId": 1240,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-11"
  },
  {
    "id": 1736,
    "customerId": 1241,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-06-07"
  },
  {
    "id": 1737,
    "customerId": 1241,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-07"
  },
  {
    "id": 1738,
    "customerId": 1242,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-12-05"
  },
  {
    "id": 1739,
    "customerId": 1242,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-05"
  },
  {
    "id": 1740,
    "customerId": 1242,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-05"
  },
  {
    "id": 1741,
    "customerId": 1243,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-02"
  },
  {
    "id": 1742,
    "customerId": 1243,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-02"
  },
  {
    "id": 1743,
    "customerId": 1244,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-05-09"
  },
  {
    "id": 1744,
    "customerId": 1244,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-09"
  },
  {
    "id": 1745,
    "customerId": 1246,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-11"
  },
  {
    "id": 1746,
    "customerId": 1247,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-02-11"
  },
  {
    "id": 1747,
    "customerId": 1247,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-11"
  },
  {
    "id": 1748,
    "customerId": 1248,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 1749,
    "customerId": 1248,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 1750,
    "customerId": 1249,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-26"
  },
  {
    "id": 1751,
    "customerId": 1249,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-26"
  },
  {
    "id": 1752,
    "customerId": 1252,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 1753,
    "customerId": 1252,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 1754,
    "customerId": 1253,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-09-01"
  },
  {
    "id": 1755,
    "customerId": 1253,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-09-01"
  },
  {
    "id": 1756,
    "customerId": 1256,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-17"
  },
  {
    "id": 1757,
    "customerId": 1257,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-27"
  },
  {
    "id": 1758,
    "customerId": 1257,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-27"
  },
  {
    "id": 1759,
    "customerId": 1258,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-26"
  },
  {
    "id": 1760,
    "customerId": 1258,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-26"
  },
  {
    "id": 1761,
    "customerId": 1259,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-12"
  },
  {
    "id": 1762,
    "customerId": 1259,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-12"
  },
  {
    "id": 1763,
    "customerId": 1260,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-10-27"
  },
  {
    "id": 1764,
    "customerId": 1260,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-10-27"
  },
  {
    "id": 1765,
    "customerId": 1261,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-09"
  },
  {
    "id": 1766,
    "customerId": 1261,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-09"
  },
  {
    "id": 1767,
    "customerId": 1262,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-12"
  },
  {
    "id": 1768,
    "customerId": 1262,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-12"
  },
  {
    "id": 1769,
    "customerId": 1263,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-19"
  },
  {
    "id": 1770,
    "customerId": 1264,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2025-07-29"
  },
  {
    "id": 1771,
    "customerId": 1264,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-29"
  },
  {
    "id": 1772,
    "customerId": 1265,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-05"
  },
  {
    "id": 1773,
    "customerId": 1265,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-05"
  },
  {
    "id": 1774,
    "customerId": 1267,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-09-24"
  },
  {
    "id": 1775,
    "customerId": 1268,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-27"
  },
  {
    "id": 1776,
    "customerId": 1268,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-27"
  },
  {
    "id": 1777,
    "customerId": 1269,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-15"
  },
  {
    "id": 1778,
    "customerId": 1270,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-05-06"
  },
  {
    "id": 1779,
    "customerId": 1270,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-06"
  },
  {
    "id": 1780,
    "customerId": 1271,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-03"
  },
  {
    "id": 1781,
    "customerId": 1272,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-31"
  },
  {
    "id": 1782,
    "customerId": 1272,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-31"
  },
  {
    "id": 1783,
    "customerId": 1273,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-04"
  },
  {
    "id": 1784,
    "customerId": 1273,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-04"
  },
  {
    "id": 1785,
    "customerId": 1274,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-06"
  },
  {
    "id": 1786,
    "customerId": 1274,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-06"
  },
  {
    "id": 1787,
    "customerId": 1275,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-24"
  },
  {
    "id": 1788,
    "customerId": 1276,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-23"
  },
  {
    "id": 1789,
    "customerId": 1277,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-19"
  },
  {
    "id": 1790,
    "customerId": 1277,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-19"
  },
  {
    "id": 1791,
    "customerId": 1280,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-10-01"
  },
  {
    "id": 1792,
    "customerId": 1281,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-02"
  },
  {
    "id": 1793,
    "customerId": 1281,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-02"
  },
  {
    "id": 1794,
    "customerId": 1282,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-04-10"
  },
  {
    "id": 1795,
    "customerId": 1283,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-08"
  },
  {
    "id": 1796,
    "customerId": 1284,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1797,
    "customerId": 1285,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-01"
  },
  {
    "id": 1798,
    "customerId": 1285,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-01"
  },
  {
    "id": 1799,
    "customerId": 1286,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-05-12"
  },
  {
    "id": 1800,
    "customerId": 1286,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-12"
  },
  {
    "id": 1801,
    "customerId": 1287,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-28"
  },
  {
    "id": 1802,
    "customerId": 1287,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-28"
  },
  {
    "id": 1803,
    "customerId": 1288,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-25"
  },
  {
    "id": 1804,
    "customerId": 1288,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-25"
  },
  {
    "id": 1805,
    "customerId": 1289,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 1806,
    "customerId": 1290,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-02-01"
  },
  {
    "id": 1807,
    "customerId": 1290,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-01"
  },
  {
    "id": 1808,
    "customerId": 1292,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-10-31"
  },
  {
    "id": 1809,
    "customerId": 1293,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1810,
    "customerId": 1294,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-15"
  },
  {
    "id": 1811,
    "customerId": 1295,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-12-03"
  },
  {
    "id": 1812,
    "customerId": 1295,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-03"
  },
  {
    "id": 1813,
    "customerId": 1295,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-03"
  },
  {
    "id": 1814,
    "customerId": 1296,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-06-18"
  },
  {
    "id": 1815,
    "customerId": 1296,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-18"
  },
  {
    "id": 1816,
    "customerId": 1297,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-28"
  },
  {
    "id": 1817,
    "customerId": 1297,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-28"
  },
  {
    "id": 1818,
    "customerId": 1298,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-04"
  },
  {
    "id": 1819,
    "customerId": 1298,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-04"
  },
  {
    "id": 1820,
    "customerId": 1300,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-10-31"
  },
  {
    "id": 1821,
    "customerId": 1300,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-10-31"
  },
  {
    "id": 1822,
    "customerId": 1301,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-24"
  },
  {
    "id": 1823,
    "customerId": 1302,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-29"
  },
  {
    "id": 1824,
    "customerId": 1302,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-29"
  },
  {
    "id": 1825,
    "customerId": 1304,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-26"
  },
  {
    "id": 1826,
    "customerId": 1304,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-11-26"
  },
  {
    "id": 1827,
    "customerId": 1304,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-26"
  },
  {
    "id": 1828,
    "customerId": 1305,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-12-06"
  },
  {
    "id": 1829,
    "customerId": 1305,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-06"
  },
  {
    "id": 1830,
    "customerId": 1305,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-06"
  },
  {
    "id": 1831,
    "customerId": 1306,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-18"
  },
  {
    "id": 1832,
    "customerId": 1306,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-18"
  },
  {
    "id": 1833,
    "customerId": 1307,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-10"
  },
  {
    "id": 1834,
    "customerId": 1307,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-10"
  },
  {
    "id": 1835,
    "customerId": 1308,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-20"
  },
  {
    "id": 1836,
    "customerId": 1308,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-20"
  },
  {
    "id": 1837,
    "customerId": 1310,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-11"
  },
  {
    "id": 1838,
    "customerId": 1311,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-12"
  },
  {
    "id": 1839,
    "customerId": 1311,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-12"
  },
  {
    "id": 1840,
    "customerId": 1312,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 1841,
    "customerId": 1313,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-28"
  },
  {
    "id": 1842,
    "customerId": 1314,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-03"
  },
  {
    "id": 1843,
    "customerId": 1315,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-21"
  },
  {
    "id": 1844,
    "customerId": 1315,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-21"
  },
  {
    "id": 1845,
    "customerId": 1316,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-08"
  },
  {
    "id": 1846,
    "customerId": 1316,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-08"
  },
  {
    "id": 1847,
    "customerId": 1317,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-30"
  },
  {
    "id": 1848,
    "customerId": 1318,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-11-14"
  },
  {
    "id": 1849,
    "customerId": 1318,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-14"
  },
  {
    "id": 1850,
    "customerId": 1318,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-14"
  },
  {
    "id": 1851,
    "customerId": 1319,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-25"
  },
  {
    "id": 1852,
    "customerId": 1320,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-29"
  },
  {
    "id": 1853,
    "customerId": 1321,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-11"
  },
  {
    "id": 1854,
    "customerId": 1321,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-11"
  },
  {
    "id": 1855,
    "customerId": 1324,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-23"
  },
  {
    "id": 1856,
    "customerId": 1325,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-05"
  },
  {
    "id": 1857,
    "customerId": 1325,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-05"
  },
  {
    "id": 1858,
    "customerId": 1326,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-07-09"
  },
  {
    "id": 1859,
    "customerId": 1327,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-19"
  },
  {
    "id": 1860,
    "customerId": 1327,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-19"
  },
  {
    "id": 1861,
    "customerId": 1329,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-08-08"
  },
  {
    "id": 1862,
    "customerId": 1329,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-08"
  },
  {
    "id": 1863,
    "customerId": 1330,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1864,
    "customerId": 1331,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-16"
  },
  {
    "id": 1865,
    "customerId": 1331,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-16"
  },
  {
    "id": 1866,
    "customerId": 1332,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-12"
  },
  {
    "id": 1867,
    "customerId": 1333,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-04-09"
  },
  {
    "id": 1868,
    "customerId": 1333,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-09"
  },
  {
    "id": 1869,
    "customerId": 1333,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-09"
  },
  {
    "id": 1870,
    "customerId": 1334,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-03-04"
  },
  {
    "id": 1871,
    "customerId": 1334,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-04"
  },
  {
    "id": 1872,
    "customerId": 1335,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-21"
  },
  {
    "id": 1873,
    "customerId": 1336,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-19"
  },
  {
    "id": 1874,
    "customerId": 1337,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-31"
  },
  {
    "id": 1875,
    "customerId": 1337,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-31"
  },
  {
    "id": 1876,
    "customerId": 1338,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-28"
  },
  {
    "id": 1877,
    "customerId": 1338,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-28"
  },
  {
    "id": 1878,
    "customerId": 1339,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-01"
  },
  {
    "id": 1879,
    "customerId": 1340,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-10-09"
  },
  {
    "id": 1880,
    "customerId": 1342,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-15"
  },
  {
    "id": 1881,
    "customerId": 1343,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-03-22"
  },
  {
    "id": 1882,
    "customerId": 1343,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-03-22"
  },
  {
    "id": 1883,
    "customerId": 1344,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-15"
  },
  {
    "id": 1884,
    "customerId": 1344,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-15"
  },
  {
    "id": 1885,
    "customerId": 1345,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 1886,
    "customerId": 1345,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 1887,
    "customerId": 1345,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 1888,
    "customerId": 1346,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-13"
  },
  {
    "id": 1889,
    "customerId": 1346,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-13"
  },
  {
    "id": 1890,
    "customerId": 1347,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1891,
    "customerId": 1348,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-23"
  },
  {
    "id": 1892,
    "customerId": 1349,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-08"
  },
  {
    "id": 1893,
    "customerId": 1349,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-08"
  },
  {
    "id": 1894,
    "customerId": 1350,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-17"
  },
  {
    "id": 1895,
    "customerId": 1350,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-17"
  },
  {
    "id": 1896,
    "customerId": 1351,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-27"
  },
  {
    "id": 1897,
    "customerId": 1352,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-01"
  },
  {
    "id": 1898,
    "customerId": 1352,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-01"
  },
  {
    "id": 1899,
    "customerId": 1353,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-28"
  },
  {
    "id": 1900,
    "customerId": 1353,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-28"
  },
  {
    "id": 1901,
    "customerId": 1354,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-16"
  },
  {
    "id": 1902,
    "customerId": 1355,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-08-13"
  },
  {
    "id": 1903,
    "customerId": 1355,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-08-13"
  },
  {
    "id": 1904,
    "customerId": 1357,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-12-02"
  },
  {
    "id": 1905,
    "customerId": 1358,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-09"
  },
  {
    "id": 1906,
    "customerId": 1358,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-09"
  },
  {
    "id": 1907,
    "customerId": 1359,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1908,
    "customerId": 1360,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-05-10"
  },
  {
    "id": 1909,
    "customerId": 1361,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-06-18"
  },
  {
    "id": 1910,
    "customerId": 1361,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-18"
  },
  {
    "id": 1911,
    "customerId": 1362,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-01"
  },
  {
    "id": 1912,
    "customerId": 1362,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-01"
  },
  {
    "id": 1913,
    "customerId": 1363,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-08-16"
  },
  {
    "id": 1914,
    "customerId": 1363,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-16"
  },
  {
    "id": 1915,
    "customerId": 1364,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-06-01"
  },
  {
    "id": 1916,
    "customerId": 1364,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-01"
  },
  {
    "id": 1917,
    "customerId": 1365,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-10"
  },
  {
    "id": 1918,
    "customerId": 1365,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-10"
  },
  {
    "id": 1919,
    "customerId": 1367,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1920,
    "customerId": 1368,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-29"
  },
  {
    "id": 1921,
    "customerId": 1368,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-29"
  },
  {
    "id": 1922,
    "customerId": 1369,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-03-04"
  },
  {
    "id": 1923,
    "customerId": 1369,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-04"
  },
  {
    "id": 1924,
    "customerId": 1369,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-04"
  },
  {
    "id": 1925,
    "customerId": 1370,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 1926,
    "customerId": 1371,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-29"
  },
  {
    "id": 1927,
    "customerId": 1371,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-29"
  },
  {
    "id": 1928,
    "customerId": 1372,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-04-04"
  },
  {
    "id": 1929,
    "customerId": 1373,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-04-09"
  },
  {
    "id": 1930,
    "customerId": 1373,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-04-09"
  },
  {
    "id": 1931,
    "customerId": 1375,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-27"
  },
  {
    "id": 1932,
    "customerId": 1375,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-27"
  },
  {
    "id": 1933,
    "customerId": 1376,
    "sourceType": "art_show",
    "sourceName": "NWFGS",
    "firstSeenOn": "2026-02-18"
  },
  {
    "id": 1934,
    "customerId": 1377,
    "sourceType": "art_show",
    "sourceName": "Sorticulture",
    "firstSeenOn": "2026-06-15"
  },
  {
    "id": 1935,
    "customerId": 1377,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-06-15"
  },
  {
    "id": 1936,
    "customerId": 1378,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-04-12"
  },
  {
    "id": 1937,
    "customerId": 1378,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-12"
  },
  {
    "id": 1938,
    "customerId": 1379,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1939,
    "customerId": 1380,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 1940,
    "customerId": 1381,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1941,
    "customerId": 1382,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 1942,
    "customerId": 1384,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1943,
    "customerId": 1385,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-13"
  },
  {
    "id": 1944,
    "customerId": 1386,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1945,
    "customerId": 1387,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-05-03"
  },
  {
    "id": 1946,
    "customerId": 1387,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-03"
  },
  {
    "id": 1947,
    "customerId": 1388,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-22"
  },
  {
    "id": 1948,
    "customerId": 1388,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-22"
  },
  {
    "id": 1949,
    "customerId": 1389,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-03"
  },
  {
    "id": 1950,
    "customerId": 1389,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-03"
  },
  {
    "id": 1951,
    "customerId": 1391,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 1952,
    "customerId": 1391,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 1953,
    "customerId": 1391,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 1954,
    "customerId": 1392,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-09"
  },
  {
    "id": 1955,
    "customerId": 1392,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-09"
  },
  {
    "id": 1956,
    "customerId": 1393,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-15"
  },
  {
    "id": 1957,
    "customerId": 1393,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-15"
  },
  {
    "id": 1958,
    "customerId": 1394,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-08-31"
  },
  {
    "id": 1959,
    "customerId": 1395,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-11"
  },
  {
    "id": 1960,
    "customerId": 1396,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-31"
  },
  {
    "id": 1961,
    "customerId": 1396,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-31"
  },
  {
    "id": 1962,
    "customerId": 1397,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-12-11"
  },
  {
    "id": 1963,
    "customerId": 1398,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-22"
  },
  {
    "id": 1964,
    "customerId": 1399,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-13"
  },
  {
    "id": 1965,
    "customerId": 1399,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-13"
  },
  {
    "id": 1966,
    "customerId": 1400,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-06"
  },
  {
    "id": 1967,
    "customerId": 1401,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-19"
  },
  {
    "id": 1968,
    "customerId": 1401,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-19"
  },
  {
    "id": 1969,
    "customerId": 1402,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-15"
  },
  {
    "id": 1970,
    "customerId": 1403,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-02-26"
  },
  {
    "id": 1971,
    "customerId": 1404,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-04"
  },
  {
    "id": 1972,
    "customerId": 1404,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-04"
  },
  {
    "id": 1973,
    "customerId": 1406,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-17"
  },
  {
    "id": 1974,
    "customerId": 1406,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-17"
  },
  {
    "id": 1975,
    "customerId": 1407,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 1976,
    "customerId": 1409,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-26"
  },
  {
    "id": 1977,
    "customerId": 1409,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-26"
  },
  {
    "id": 1978,
    "customerId": 1410,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-03"
  },
  {
    "id": 1979,
    "customerId": 1411,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-09"
  },
  {
    "id": 1980,
    "customerId": 1411,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-09"
  },
  {
    "id": 1981,
    "customerId": 1412,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-01"
  },
  {
    "id": 1982,
    "customerId": 1412,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-01"
  },
  {
    "id": 1983,
    "customerId": 1414,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-06-03"
  },
  {
    "id": 1984,
    "customerId": 1414,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-03"
  },
  {
    "id": 1985,
    "customerId": 1415,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-29"
  },
  {
    "id": 1986,
    "customerId": 1415,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-29"
  },
  {
    "id": 1987,
    "customerId": 1416,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 1988,
    "customerId": 1416,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 1989,
    "customerId": 1416,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-04"
  },
  {
    "id": 1990,
    "customerId": 1417,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-09-09"
  },
  {
    "id": 1991,
    "customerId": 1417,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-09"
  },
  {
    "id": 1992,
    "customerId": 1418,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-06-19"
  },
  {
    "id": 1993,
    "customerId": 1418,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-06-19"
  },
  {
    "id": 1994,
    "customerId": 1419,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-23"
  },
  {
    "id": 1995,
    "customerId": 1419,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-23"
  },
  {
    "id": 1996,
    "customerId": 1420,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-21"
  },
  {
    "id": 1997,
    "customerId": 1420,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-21"
  },
  {
    "id": 1998,
    "customerId": 1422,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-11"
  },
  {
    "id": 1999,
    "customerId": 1422,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-11"
  },
  {
    "id": 2000,
    "customerId": 1423,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-19"
  },
  {
    "id": 2001,
    "customerId": 1424,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-19"
  },
  {
    "id": 2002,
    "customerId": 1424,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-19"
  },
  {
    "id": 2003,
    "customerId": 1425,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2025-02-02"
  },
  {
    "id": 2004,
    "customerId": 1425,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-02-02"
  },
  {
    "id": 2005,
    "customerId": 1425,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-02"
  },
  {
    "id": 2006,
    "customerId": 1427,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-27"
  },
  {
    "id": 2007,
    "customerId": 1427,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-27"
  },
  {
    "id": 2008,
    "customerId": 1428,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-12"
  },
  {
    "id": 2009,
    "customerId": 1429,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-13"
  },
  {
    "id": 2010,
    "customerId": 1430,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-12-01"
  },
  {
    "id": 2011,
    "customerId": 1433,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-07-17"
  },
  {
    "id": 2012,
    "customerId": 1434,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-11"
  },
  {
    "id": 2013,
    "customerId": 1434,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-11"
  },
  {
    "id": 2014,
    "customerId": 1436,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-20"
  },
  {
    "id": 2015,
    "customerId": 1437,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-30"
  },
  {
    "id": 2016,
    "customerId": 1438,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-19"
  },
  {
    "id": 2017,
    "customerId": 1439,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-12-02"
  },
  {
    "id": 2018,
    "customerId": 1439,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-02"
  },
  {
    "id": 2019,
    "customerId": 1440,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2020,
    "customerId": 1441,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-05"
  },
  {
    "id": 2021,
    "customerId": 1441,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-05"
  },
  {
    "id": 2022,
    "customerId": 1442,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-14"
  },
  {
    "id": 2023,
    "customerId": 1442,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-14"
  },
  {
    "id": 2024,
    "customerId": 1443,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-16"
  },
  {
    "id": 2025,
    "customerId": 1443,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-16"
  },
  {
    "id": 2026,
    "customerId": 1444,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-01"
  },
  {
    "id": 2027,
    "customerId": 1446,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-10"
  },
  {
    "id": 2028,
    "customerId": 1447,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-03-29"
  },
  {
    "id": 2029,
    "customerId": 1449,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-01-14"
  },
  {
    "id": 2030,
    "customerId": 1449,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-01-14"
  },
  {
    "id": 2031,
    "customerId": 1450,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-05-27"
  },
  {
    "id": 2032,
    "customerId": 1450,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-27"
  },
  {
    "id": 2033,
    "customerId": 1451,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-08-06"
  },
  {
    "id": 2034,
    "customerId": 1452,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-22"
  },
  {
    "id": 2035,
    "customerId": 1453,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-27"
  },
  {
    "id": 2036,
    "customerId": 1454,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-01-04"
  },
  {
    "id": 2037,
    "customerId": 1454,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-04"
  },
  {
    "id": 2038,
    "customerId": 1455,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-02-15"
  },
  {
    "id": 2039,
    "customerId": 1455,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-15"
  },
  {
    "id": 2040,
    "customerId": 1455,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-15"
  },
  {
    "id": 2041,
    "customerId": 1456,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-01"
  },
  {
    "id": 2042,
    "customerId": 1456,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-01"
  },
  {
    "id": 2043,
    "customerId": 1458,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-07-08"
  },
  {
    "id": 2044,
    "customerId": 1458,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-08"
  },
  {
    "id": 2045,
    "customerId": 1459,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-17"
  },
  {
    "id": 2046,
    "customerId": 1459,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-17"
  },
  {
    "id": 2047,
    "customerId": 1461,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 2048,
    "customerId": 1461,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 2049,
    "customerId": 1462,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-25"
  },
  {
    "id": 2050,
    "customerId": 1462,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-25"
  },
  {
    "id": 2051,
    "customerId": 1463,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-06-03"
  },
  {
    "id": 2052,
    "customerId": 1463,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-03"
  },
  {
    "id": 2053,
    "customerId": 1464,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-30"
  },
  {
    "id": 2054,
    "customerId": 1464,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-30"
  },
  {
    "id": 2055,
    "customerId": 1464,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-30"
  },
  {
    "id": 2056,
    "customerId": 1467,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-03"
  },
  {
    "id": 2057,
    "customerId": 1467,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-03"
  },
  {
    "id": 2058,
    "customerId": 1468,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-20"
  },
  {
    "id": 2059,
    "customerId": 1468,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-20"
  },
  {
    "id": 2060,
    "customerId": 1469,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-30"
  },
  {
    "id": 2061,
    "customerId": 1470,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-19"
  },
  {
    "id": 2062,
    "customerId": 1470,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-19"
  },
  {
    "id": 2063,
    "customerId": 1471,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-06-19"
  },
  {
    "id": 2064,
    "customerId": 1471,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-19"
  },
  {
    "id": 2065,
    "customerId": 1472,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-03-08"
  },
  {
    "id": 2066,
    "customerId": 1473,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-28"
  },
  {
    "id": 2067,
    "customerId": 1473,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-28"
  },
  {
    "id": 2068,
    "customerId": 1474,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2069,
    "customerId": 1475,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-07-25"
  },
  {
    "id": 2070,
    "customerId": 1475,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-25"
  },
  {
    "id": 2071,
    "customerId": 1476,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-18"
  },
  {
    "id": 2072,
    "customerId": 1477,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-06-08"
  },
  {
    "id": 2073,
    "customerId": 1477,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-06-08"
  },
  {
    "id": 2074,
    "customerId": 1478,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-06"
  },
  {
    "id": 2075,
    "customerId": 1479,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-08-05"
  },
  {
    "id": 2076,
    "customerId": 1480,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-09"
  },
  {
    "id": 2077,
    "customerId": 1481,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-05-26"
  },
  {
    "id": 2078,
    "customerId": 1482,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-04"
  },
  {
    "id": 2079,
    "customerId": 1482,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-04"
  },
  {
    "id": 2080,
    "customerId": 1483,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-29"
  },
  {
    "id": 2081,
    "customerId": 1483,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-29"
  },
  {
    "id": 2082,
    "customerId": 1484,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2083,
    "customerId": 1485,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2084,
    "customerId": 1486,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2085,
    "customerId": 1488,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-01-12"
  },
  {
    "id": 2086,
    "customerId": 1488,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-12"
  },
  {
    "id": 2087,
    "customerId": 1488,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-12"
  },
  {
    "id": 2088,
    "customerId": 1489,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-04"
  },
  {
    "id": 2089,
    "customerId": 1489,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-04"
  },
  {
    "id": 2090,
    "customerId": 1490,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 2091,
    "customerId": 1492,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-29"
  },
  {
    "id": 2092,
    "customerId": 1492,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-29"
  },
  {
    "id": 2093,
    "customerId": 1493,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-06"
  },
  {
    "id": 2094,
    "customerId": 1494,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-02-03"
  },
  {
    "id": 2095,
    "customerId": 1495,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-22"
  },
  {
    "id": 2096,
    "customerId": 1495,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-22"
  },
  {
    "id": 2097,
    "customerId": 1496,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2098,
    "customerId": 1497,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-14"
  },
  {
    "id": 2099,
    "customerId": 1497,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-14"
  },
  {
    "id": 2100,
    "customerId": 1498,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-05-18"
  },
  {
    "id": 2101,
    "customerId": 1498,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-18"
  },
  {
    "id": 2102,
    "customerId": 1500,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 2103,
    "customerId": 1500,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 2104,
    "customerId": 1502,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-19"
  },
  {
    "id": 2105,
    "customerId": 1502,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-19"
  },
  {
    "id": 2106,
    "customerId": 1503,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2107,
    "customerId": 1504,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-09-01"
  },
  {
    "id": 2108,
    "customerId": 1504,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-01"
  },
  {
    "id": 2109,
    "customerId": 1506,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-05-30"
  },
  {
    "id": 2110,
    "customerId": 1506,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-05-30"
  },
  {
    "id": 2111,
    "customerId": 1507,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-05-30"
  },
  {
    "id": 2112,
    "customerId": 1507,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-30"
  },
  {
    "id": 2113,
    "customerId": 1508,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-04-26"
  },
  {
    "id": 2114,
    "customerId": 1508,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-26"
  },
  {
    "id": 2115,
    "customerId": 1509,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2116,
    "customerId": 1510,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-04-19"
  },
  {
    "id": 2117,
    "customerId": 1511,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-11-30"
  },
  {
    "id": 2118,
    "customerId": 1511,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-30"
  },
  {
    "id": 2119,
    "customerId": 1512,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-12"
  },
  {
    "id": 2120,
    "customerId": 1513,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-04"
  },
  {
    "id": 2121,
    "customerId": 1514,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2122,
    "customerId": 1515,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-10"
  },
  {
    "id": 2123,
    "customerId": 1517,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-18"
  },
  {
    "id": 2124,
    "customerId": 1517,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-18"
  },
  {
    "id": 2125,
    "customerId": 1518,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-07-12"
  },
  {
    "id": 2126,
    "customerId": 1519,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-12-11"
  },
  {
    "id": 2127,
    "customerId": 1519,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-11"
  },
  {
    "id": 2128,
    "customerId": 1520,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-07-05"
  },
  {
    "id": 2129,
    "customerId": 1520,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-05"
  },
  {
    "id": 2130,
    "customerId": 1521,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2131,
    "customerId": 1522,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 2132,
    "customerId": 1522,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 2133,
    "customerId": 1522,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 2134,
    "customerId": 1523,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-30"
  },
  {
    "id": 2135,
    "customerId": 1524,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-03-08"
  },
  {
    "id": 2136,
    "customerId": 1524,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-08"
  },
  {
    "id": 2137,
    "customerId": 1524,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-08"
  },
  {
    "id": 2138,
    "customerId": 1525,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-19"
  },
  {
    "id": 2139,
    "customerId": 1525,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-19"
  },
  {
    "id": 2140,
    "customerId": 1526,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-11-13"
  },
  {
    "id": 2141,
    "customerId": 1526,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-13"
  },
  {
    "id": 2142,
    "customerId": 1527,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-01"
  },
  {
    "id": 2143,
    "customerId": 1527,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-01"
  },
  {
    "id": 2144,
    "customerId": 1529,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-21"
  },
  {
    "id": 2145,
    "customerId": 1531,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-27"
  },
  {
    "id": 2146,
    "customerId": 1531,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-27"
  },
  {
    "id": 2147,
    "customerId": 1532,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-05-25"
  },
  {
    "id": 2148,
    "customerId": 1532,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-25"
  },
  {
    "id": 2149,
    "customerId": 1533,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-03-04"
  },
  {
    "id": 2150,
    "customerId": 1533,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-04"
  },
  {
    "id": 2151,
    "customerId": 1534,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-09-20"
  },
  {
    "id": 2152,
    "customerId": 1534,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-09-20"
  },
  {
    "id": 2153,
    "customerId": 1534,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-09-20"
  },
  {
    "id": 2154,
    "customerId": 1534,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-09-20"
  },
  {
    "id": 2155,
    "customerId": 1535,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-24"
  },
  {
    "id": 2156,
    "customerId": 1535,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-24"
  },
  {
    "id": 2157,
    "customerId": 1536,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2158,
    "customerId": 1536,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2159,
    "customerId": 1536,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2160,
    "customerId": 1537,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 2161,
    "customerId": 1537,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 2162,
    "customerId": 1538,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-12-22"
  },
  {
    "id": 2163,
    "customerId": 1539,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-20"
  },
  {
    "id": 2164,
    "customerId": 1539,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-20"
  },
  {
    "id": 2165,
    "customerId": 1540,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-04-18"
  },
  {
    "id": 2166,
    "customerId": 1540,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-18"
  },
  {
    "id": 2167,
    "customerId": 1540,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-18"
  },
  {
    "id": 2168,
    "customerId": 1541,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-28"
  },
  {
    "id": 2169,
    "customerId": 1541,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-28"
  },
  {
    "id": 2170,
    "customerId": 1542,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-06"
  },
  {
    "id": 2171,
    "customerId": 1542,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-06"
  },
  {
    "id": 2172,
    "customerId": 1543,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-24"
  },
  {
    "id": 2173,
    "customerId": 1543,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-24"
  },
  {
    "id": 2174,
    "customerId": 1545,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-29"
  },
  {
    "id": 2175,
    "customerId": 1546,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-25"
  },
  {
    "id": 2176,
    "customerId": 1547,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-13"
  },
  {
    "id": 2177,
    "customerId": 1547,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-13"
  },
  {
    "id": 2178,
    "customerId": 1549,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-04-17"
  },
  {
    "id": 2179,
    "customerId": 1551,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-03"
  },
  {
    "id": 2180,
    "customerId": 1551,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-03"
  },
  {
    "id": 2181,
    "customerId": 1552,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-26"
  },
  {
    "id": 2182,
    "customerId": 1552,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-26"
  },
  {
    "id": 2183,
    "customerId": 1552,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-26"
  },
  {
    "id": 2184,
    "customerId": 1553,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 2185,
    "customerId": 1554,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-24"
  },
  {
    "id": 2186,
    "customerId": 1554,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-24"
  },
  {
    "id": 2187,
    "customerId": 1556,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2188,
    "customerId": 1557,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-17"
  },
  {
    "id": 2189,
    "customerId": 1558,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-30"
  },
  {
    "id": 2190,
    "customerId": 1558,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-30"
  },
  {
    "id": 2191,
    "customerId": 1559,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-25"
  },
  {
    "id": 2192,
    "customerId": 1559,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-25"
  },
  {
    "id": 2193,
    "customerId": 1560,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-28"
  },
  {
    "id": 2194,
    "customerId": 1561,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2195,
    "customerId": 1563,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-02"
  },
  {
    "id": 2196,
    "customerId": 1563,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-02"
  },
  {
    "id": 2197,
    "customerId": 1564,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-10"
  },
  {
    "id": 2198,
    "customerId": 1565,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-23"
  },
  {
    "id": 2199,
    "customerId": 1565,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-23"
  },
  {
    "id": 2200,
    "customerId": 1566,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 2201,
    "customerId": 1566,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 2202,
    "customerId": 1567,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-26"
  },
  {
    "id": 2203,
    "customerId": 1567,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-26"
  },
  {
    "id": 2204,
    "customerId": 1568,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-24"
  },
  {
    "id": 2205,
    "customerId": 1568,
    "sourceType": "art_show",
    "sourceName": "BAM",
    "firstSeenOn": "2026-07-24"
  },
  {
    "id": 2206,
    "customerId": 1569,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 2207,
    "customerId": 1570,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-13"
  },
  {
    "id": 2208,
    "customerId": 1570,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-13"
  },
  {
    "id": 2209,
    "customerId": 1571,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-18"
  },
  {
    "id": 2210,
    "customerId": 1572,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2211,
    "customerId": 1573,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-10-25"
  },
  {
    "id": 2212,
    "customerId": 1573,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-25"
  },
  {
    "id": 2213,
    "customerId": 1574,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-04"
  },
  {
    "id": 2214,
    "customerId": 1575,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2215,
    "customerId": 1576,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-03"
  },
  {
    "id": 2216,
    "customerId": 1577,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-28"
  },
  {
    "id": 2217,
    "customerId": 1578,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-19"
  },
  {
    "id": 2218,
    "customerId": 1581,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-10"
  },
  {
    "id": 2219,
    "customerId": 1581,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-10"
  },
  {
    "id": 2220,
    "customerId": 1582,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-02-07"
  },
  {
    "id": 2221,
    "customerId": 1582,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-07"
  },
  {
    "id": 2222,
    "customerId": 1583,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-10"
  },
  {
    "id": 2223,
    "customerId": 1583,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-10"
  },
  {
    "id": 2224,
    "customerId": 1585,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-19"
  },
  {
    "id": 2225,
    "customerId": 1585,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-19"
  },
  {
    "id": 2226,
    "customerId": 1586,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-03"
  },
  {
    "id": 2227,
    "customerId": 1587,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-08"
  },
  {
    "id": 2228,
    "customerId": 1587,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-08"
  },
  {
    "id": 2229,
    "customerId": 1589,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-08"
  },
  {
    "id": 2230,
    "customerId": 1589,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-08"
  },
  {
    "id": 2231,
    "customerId": 1590,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-09-18"
  },
  {
    "id": 2232,
    "customerId": 1592,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-05"
  },
  {
    "id": 2233,
    "customerId": 1593,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-16"
  },
  {
    "id": 2234,
    "customerId": 1594,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-06-26"
  },
  {
    "id": 2235,
    "customerId": 1594,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-26"
  },
  {
    "id": 2236,
    "customerId": 1595,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-02"
  },
  {
    "id": 2237,
    "customerId": 1595,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-02"
  },
  {
    "id": 2238,
    "customerId": 1596,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2239,
    "customerId": 1597,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-20"
  },
  {
    "id": 2240,
    "customerId": 1597,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-20"
  },
  {
    "id": 2241,
    "customerId": 1598,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-02-02"
  },
  {
    "id": 2242,
    "customerId": 1599,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-26"
  },
  {
    "id": 2243,
    "customerId": 1599,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-26"
  },
  {
    "id": 2244,
    "customerId": 1601,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-01"
  },
  {
    "id": 2245,
    "customerId": 1601,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-01"
  },
  {
    "id": 2246,
    "customerId": 1602,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-31"
  },
  {
    "id": 2247,
    "customerId": 1602,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-31"
  },
  {
    "id": 2248,
    "customerId": 1603,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-11-27"
  },
  {
    "id": 2249,
    "customerId": 1603,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-27"
  },
  {
    "id": 2250,
    "customerId": 1603,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-27"
  },
  {
    "id": 2251,
    "customerId": 1604,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-03"
  },
  {
    "id": 2252,
    "customerId": 1604,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-03"
  },
  {
    "id": 2253,
    "customerId": 1606,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2254,
    "customerId": 1607,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-06"
  },
  {
    "id": 2255,
    "customerId": 1608,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-11"
  },
  {
    "id": 2256,
    "customerId": 1608,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-11"
  },
  {
    "id": 2257,
    "customerId": 1609,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-12"
  },
  {
    "id": 2258,
    "customerId": 1609,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-12"
  },
  {
    "id": 2259,
    "customerId": 1610,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-19"
  },
  {
    "id": 2260,
    "customerId": 1611,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-02-08"
  },
  {
    "id": 2261,
    "customerId": 1611,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-02-08"
  },
  {
    "id": 2262,
    "customerId": 1613,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-06-12"
  },
  {
    "id": 2263,
    "customerId": 1613,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-12"
  },
  {
    "id": 2264,
    "customerId": 1615,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-28"
  },
  {
    "id": 2265,
    "customerId": 1615,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-28"
  },
  {
    "id": 2266,
    "customerId": 1616,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-26"
  },
  {
    "id": 2267,
    "customerId": 1616,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-26"
  },
  {
    "id": 2268,
    "customerId": 1617,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-20"
  },
  {
    "id": 2269,
    "customerId": 1617,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-20"
  },
  {
    "id": 2270,
    "customerId": 1618,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-06-12"
  },
  {
    "id": 2271,
    "customerId": 1618,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-12"
  },
  {
    "id": 2272,
    "customerId": 1619,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-14"
  },
  {
    "id": 2273,
    "customerId": 1619,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-14"
  },
  {
    "id": 2274,
    "customerId": 1620,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-08-06"
  },
  {
    "id": 2275,
    "customerId": 1620,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-08-06"
  },
  {
    "id": 2276,
    "customerId": 1621,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-07-09"
  },
  {
    "id": 2277,
    "customerId": 1622,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-02-08"
  },
  {
    "id": 2278,
    "customerId": 1622,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-08"
  },
  {
    "id": 2279,
    "customerId": 1623,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-09"
  },
  {
    "id": 2280,
    "customerId": 1623,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-09"
  },
  {
    "id": 2281,
    "customerId": 1624,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-23"
  },
  {
    "id": 2282,
    "customerId": 1625,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2283,
    "customerId": 1626,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-24"
  },
  {
    "id": 2284,
    "customerId": 1627,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-05-18"
  },
  {
    "id": 2285,
    "customerId": 1627,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-18"
  },
  {
    "id": 2286,
    "customerId": 1628,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-28"
  },
  {
    "id": 2287,
    "customerId": 1628,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-28"
  },
  {
    "id": 2288,
    "customerId": 1629,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-09-14"
  },
  {
    "id": 2289,
    "customerId": 1629,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-14"
  },
  {
    "id": 2290,
    "customerId": 1629,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-14"
  },
  {
    "id": 2291,
    "customerId": 1630,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-28"
  },
  {
    "id": 2292,
    "customerId": 1630,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-28"
  },
  {
    "id": 2293,
    "customerId": 1631,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-20"
  },
  {
    "id": 2294,
    "customerId": 1631,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-20"
  },
  {
    "id": 2295,
    "customerId": 1632,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-09-06"
  },
  {
    "id": 2296,
    "customerId": 1633,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-27"
  },
  {
    "id": 2297,
    "customerId": 1633,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-27"
  },
  {
    "id": 2298,
    "customerId": 1634,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-27"
  },
  {
    "id": 2299,
    "customerId": 1635,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 2300,
    "customerId": 1636,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-01-26"
  },
  {
    "id": 2301,
    "customerId": 1636,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-26"
  },
  {
    "id": 2302,
    "customerId": 1637,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-16"
  },
  {
    "id": 2303,
    "customerId": 1638,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-17"
  },
  {
    "id": 2304,
    "customerId": 1639,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-26"
  },
  {
    "id": 2305,
    "customerId": 1640,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-11-27"
  },
  {
    "id": 2306,
    "customerId": 1641,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-07-10"
  },
  {
    "id": 2307,
    "customerId": 1641,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-10"
  },
  {
    "id": 2308,
    "customerId": 1641,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-10"
  },
  {
    "id": 2309,
    "customerId": 1642,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-23"
  },
  {
    "id": 2310,
    "customerId": 1643,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-01-03"
  },
  {
    "id": 2311,
    "customerId": 1643,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-03"
  },
  {
    "id": 2312,
    "customerId": 1644,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 2313,
    "customerId": 1645,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-27"
  },
  {
    "id": 2314,
    "customerId": 1645,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-27"
  },
  {
    "id": 2315,
    "customerId": 1646,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-09-03"
  },
  {
    "id": 2316,
    "customerId": 1647,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-08-24"
  },
  {
    "id": 2317,
    "customerId": 1649,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-19"
  },
  {
    "id": 2318,
    "customerId": 1649,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-19"
  },
  {
    "id": 2319,
    "customerId": 1650,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 2320,
    "customerId": 1652,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-09-30"
  },
  {
    "id": 2321,
    "customerId": 1652,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-30"
  },
  {
    "id": 2322,
    "customerId": 1653,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 2323,
    "customerId": 1654,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-08-19"
  },
  {
    "id": 2324,
    "customerId": 1655,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2325,
    "customerId": 1656,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-16"
  },
  {
    "id": 2326,
    "customerId": 1657,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-12-02"
  },
  {
    "id": 2327,
    "customerId": 1657,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-02"
  },
  {
    "id": 2328,
    "customerId": 1657,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-02"
  },
  {
    "id": 2329,
    "customerId": 1658,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-16"
  },
  {
    "id": 2330,
    "customerId": 1658,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-16"
  },
  {
    "id": 2331,
    "customerId": 1659,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-13"
  },
  {
    "id": 2332,
    "customerId": 1659,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-13"
  },
  {
    "id": 2333,
    "customerId": 1660,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-20"
  },
  {
    "id": 2334,
    "customerId": 1661,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-14"
  },
  {
    "id": 2335,
    "customerId": 1661,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-14"
  },
  {
    "id": 2336,
    "customerId": 1662,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2337,
    "customerId": 1663,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-08-14"
  },
  {
    "id": 2338,
    "customerId": 1664,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2025-11-01"
  },
  {
    "id": 2339,
    "customerId": 1664,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-01"
  },
  {
    "id": 2340,
    "customerId": 1665,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 2341,
    "customerId": 1666,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-02"
  },
  {
    "id": 2342,
    "customerId": 1667,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-06-10"
  },
  {
    "id": 2343,
    "customerId": 1668,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-15"
  },
  {
    "id": 2344,
    "customerId": 1669,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-06-05"
  },
  {
    "id": 2345,
    "customerId": 1669,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-05"
  },
  {
    "id": 2346,
    "customerId": 1670,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2347,
    "customerId": 1671,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-02-08"
  },
  {
    "id": 2348,
    "customerId": 1672,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2349,
    "customerId": 1674,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-12"
  },
  {
    "id": 2350,
    "customerId": 1675,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 2351,
    "customerId": 1676,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-07-22"
  },
  {
    "id": 2352,
    "customerId": 1677,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-11"
  },
  {
    "id": 2353,
    "customerId": 1678,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-04-10"
  },
  {
    "id": 2354,
    "customerId": 1680,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-03-14"
  },
  {
    "id": 2355,
    "customerId": 1680,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-03-14"
  },
  {
    "id": 2356,
    "customerId": 1681,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-01"
  },
  {
    "id": 2357,
    "customerId": 1681,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-08-01"
  },
  {
    "id": 2358,
    "customerId": 1681,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-01"
  },
  {
    "id": 2359,
    "customerId": 1682,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-10"
  },
  {
    "id": 2360,
    "customerId": 1682,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-10"
  },
  {
    "id": 2361,
    "customerId": 1683,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2362,
    "customerId": 1685,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-02"
  },
  {
    "id": 2363,
    "customerId": 1685,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-02"
  },
  {
    "id": 2364,
    "customerId": 1686,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-18"
  },
  {
    "id": 2365,
    "customerId": 1687,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-06-20"
  },
  {
    "id": 2366,
    "customerId": 1687,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-06-20"
  },
  {
    "id": 2367,
    "customerId": 1688,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-07"
  },
  {
    "id": 2368,
    "customerId": 1688,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-07"
  },
  {
    "id": 2369,
    "customerId": 1689,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-12"
  },
  {
    "id": 2370,
    "customerId": 1689,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-12"
  },
  {
    "id": 2371,
    "customerId": 1690,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-01"
  },
  {
    "id": 2372,
    "customerId": 1690,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-01"
  },
  {
    "id": 2373,
    "customerId": 1691,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-05-22"
  },
  {
    "id": 2374,
    "customerId": 1691,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-22"
  },
  {
    "id": 2375,
    "customerId": 1692,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-07-27"
  },
  {
    "id": 2376,
    "customerId": 1692,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-27"
  },
  {
    "id": 2377,
    "customerId": 1693,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-16"
  },
  {
    "id": 2378,
    "customerId": 1693,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-16"
  },
  {
    "id": 2379,
    "customerId": 1694,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2380,
    "customerId": 1695,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 2381,
    "customerId": 1697,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-12-27"
  },
  {
    "id": 2382,
    "customerId": 1697,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-27"
  },
  {
    "id": 2383,
    "customerId": 1698,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-22"
  },
  {
    "id": 2384,
    "customerId": 1698,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-22"
  },
  {
    "id": 2385,
    "customerId": 1699,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-06"
  },
  {
    "id": 2386,
    "customerId": 1700,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-16"
  },
  {
    "id": 2387,
    "customerId": 1700,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-16"
  },
  {
    "id": 2388,
    "customerId": 1701,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-23"
  },
  {
    "id": 2389,
    "customerId": 1701,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-23"
  },
  {
    "id": 2390,
    "customerId": 1702,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-08-16"
  },
  {
    "id": 2391,
    "customerId": 1703,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-24"
  },
  {
    "id": 2392,
    "customerId": 1703,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-24"
  },
  {
    "id": 2393,
    "customerId": 1704,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-04-27"
  },
  {
    "id": 2394,
    "customerId": 1704,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-27"
  },
  {
    "id": 2395,
    "customerId": 1704,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-27"
  },
  {
    "id": 2396,
    "customerId": 1705,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-18"
  },
  {
    "id": 2397,
    "customerId": 1705,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-18"
  },
  {
    "id": 2398,
    "customerId": 1706,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-23"
  },
  {
    "id": 2399,
    "customerId": 1706,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-23"
  },
  {
    "id": 2400,
    "customerId": 1707,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2401,
    "customerId": 1708,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-14"
  },
  {
    "id": 2402,
    "customerId": 1708,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-14"
  },
  {
    "id": 2403,
    "customerId": 1709,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-04-17"
  },
  {
    "id": 2404,
    "customerId": 1710,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-28"
  },
  {
    "id": 2405,
    "customerId": 1710,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-28"
  },
  {
    "id": 2406,
    "customerId": 1711,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-09-26"
  },
  {
    "id": 2407,
    "customerId": 1711,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-09-26"
  },
  {
    "id": 2408,
    "customerId": 1711,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-09-26"
  },
  {
    "id": 2409,
    "customerId": 1712,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-25"
  },
  {
    "id": 2410,
    "customerId": 1712,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-25"
  },
  {
    "id": 2411,
    "customerId": 1713,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-08-01"
  },
  {
    "id": 2412,
    "customerId": 1713,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-01"
  },
  {
    "id": 2413,
    "customerId": 1714,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2414,
    "customerId": 1715,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2415,
    "customerId": 1717,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-09"
  },
  {
    "id": 2416,
    "customerId": 1717,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-09"
  },
  {
    "id": 2417,
    "customerId": 1718,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-31"
  },
  {
    "id": 2418,
    "customerId": 1718,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-31"
  },
  {
    "id": 2419,
    "customerId": 1719,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-04"
  },
  {
    "id": 2420,
    "customerId": 1720,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-08-10"
  },
  {
    "id": 2421,
    "customerId": 1720,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-10"
  },
  {
    "id": 2422,
    "customerId": 1721,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-08"
  },
  {
    "id": 2423,
    "customerId": 1722,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-09-09"
  },
  {
    "id": 2424,
    "customerId": 1722,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-09"
  },
  {
    "id": 2425,
    "customerId": 1723,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-30"
  },
  {
    "id": 2426,
    "customerId": 1723,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-30"
  },
  {
    "id": 2427,
    "customerId": 1724,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-30"
  },
  {
    "id": 2428,
    "customerId": 1724,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-30"
  },
  {
    "id": 2429,
    "customerId": 1725,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-23"
  },
  {
    "id": 2430,
    "customerId": 1725,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-23"
  },
  {
    "id": 2431,
    "customerId": 1726,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-26"
  },
  {
    "id": 2432,
    "customerId": 1726,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-26"
  },
  {
    "id": 2433,
    "customerId": 1727,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2434,
    "customerId": 1728,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-11"
  },
  {
    "id": 2435,
    "customerId": 1728,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-11"
  },
  {
    "id": 2436,
    "customerId": 1728,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-11"
  },
  {
    "id": 2437,
    "customerId": 1729,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-06"
  },
  {
    "id": 2438,
    "customerId": 1729,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-06"
  },
  {
    "id": 2439,
    "customerId": 1730,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-10-01"
  },
  {
    "id": 2440,
    "customerId": 1730,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-01"
  },
  {
    "id": 2441,
    "customerId": 1731,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-15"
  },
  {
    "id": 2442,
    "customerId": 1732,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-10"
  },
  {
    "id": 2443,
    "customerId": 1733,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2444,
    "customerId": 1734,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-08-20"
  },
  {
    "id": 2445,
    "customerId": 1735,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-24"
  },
  {
    "id": 2446,
    "customerId": 1735,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-24"
  },
  {
    "id": 2447,
    "customerId": 1736,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2448,
    "customerId": 1737,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-18"
  },
  {
    "id": 2449,
    "customerId": 1738,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 2450,
    "customerId": 1739,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-09"
  },
  {
    "id": 2451,
    "customerId": 1740,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-26"
  },
  {
    "id": 2452,
    "customerId": 1741,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2014-10-26"
  },
  {
    "id": 2453,
    "customerId": 1741,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2014-10-26"
  },
  {
    "id": 2454,
    "customerId": 1741,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-10-26"
  },
  {
    "id": 2455,
    "customerId": 1743,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-04-17"
  },
  {
    "id": 2456,
    "customerId": 1744,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-17"
  },
  {
    "id": 2457,
    "customerId": 1744,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-17"
  },
  {
    "id": 2458,
    "customerId": 1745,
    "sourceType": "art_show",
    "sourceName": "NWFGS",
    "firstSeenOn": "2026-02-26"
  },
  {
    "id": 2459,
    "customerId": 1745,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-02-26"
  },
  {
    "id": 2460,
    "customerId": 1746,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-02"
  },
  {
    "id": 2461,
    "customerId": 1746,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-02"
  },
  {
    "id": 2462,
    "customerId": 1748,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-28"
  },
  {
    "id": 2463,
    "customerId": 1749,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-06-03"
  },
  {
    "id": 2464,
    "customerId": 1749,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-06-03"
  },
  {
    "id": 2465,
    "customerId": 1750,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-06-17"
  },
  {
    "id": 2466,
    "customerId": 1750,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-06-17"
  },
  {
    "id": 2467,
    "customerId": 1751,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-10-06"
  },
  {
    "id": 2468,
    "customerId": 1751,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-06"
  },
  {
    "id": 2469,
    "customerId": 1751,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-06"
  },
  {
    "id": 2470,
    "customerId": 1752,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2471,
    "customerId": 1753,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-01-13"
  },
  {
    "id": 2472,
    "customerId": 1753,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-13"
  },
  {
    "id": 2473,
    "customerId": 1754,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-03-13"
  },
  {
    "id": 2474,
    "customerId": 1755,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2475,
    "customerId": 1756,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-19"
  },
  {
    "id": 2476,
    "customerId": 1756,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-19"
  },
  {
    "id": 2477,
    "customerId": 1757,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-06"
  },
  {
    "id": 2478,
    "customerId": 1757,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-06"
  },
  {
    "id": 2479,
    "customerId": 1759,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-05"
  },
  {
    "id": 2480,
    "customerId": 1759,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-05"
  },
  {
    "id": 2481,
    "customerId": 1760,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-12-29"
  },
  {
    "id": 2482,
    "customerId": 1762,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-30"
  },
  {
    "id": 2483,
    "customerId": 1763,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-01-13"
  },
  {
    "id": 2484,
    "customerId": 1763,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-13"
  },
  {
    "id": 2485,
    "customerId": 1763,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-13"
  },
  {
    "id": 2486,
    "customerId": 1764,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-14"
  },
  {
    "id": 2487,
    "customerId": 1764,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-14"
  },
  {
    "id": 2488,
    "customerId": 1766,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-05-17"
  },
  {
    "id": 2489,
    "customerId": 1766,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-17"
  },
  {
    "id": 2490,
    "customerId": 1768,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-10-31"
  },
  {
    "id": 2491,
    "customerId": 1768,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-10-31"
  },
  {
    "id": 2492,
    "customerId": 1769,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 2493,
    "customerId": 1770,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2494,
    "customerId": 1771,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2017-03-21"
  },
  {
    "id": 2495,
    "customerId": 1771,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-21"
  },
  {
    "id": 2496,
    "customerId": 1771,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-21"
  },
  {
    "id": 2497,
    "customerId": 1772,
    "sourceType": "retail",
    "sourceName": "Sweetheart Gallery",
    "firstSeenOn": "2026-06-29"
  },
  {
    "id": 2498,
    "customerId": 1773,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2499,
    "customerId": 1774,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-06-20"
  },
  {
    "id": 2500,
    "customerId": 1776,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-17"
  },
  {
    "id": 2501,
    "customerId": 1777,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 2502,
    "customerId": 1778,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-16"
  },
  {
    "id": 2503,
    "customerId": 1778,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-16"
  },
  {
    "id": 2504,
    "customerId": 1779,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-11"
  },
  {
    "id": 2505,
    "customerId": 1779,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-11"
  },
  {
    "id": 2506,
    "customerId": 1781,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-01"
  },
  {
    "id": 2507,
    "customerId": 1781,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-01"
  },
  {
    "id": 2508,
    "customerId": 1783,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-28"
  },
  {
    "id": 2509,
    "customerId": 1783,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-28"
  },
  {
    "id": 2510,
    "customerId": 1784,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2511,
    "customerId": 1785,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-16"
  },
  {
    "id": 2512,
    "customerId": 1785,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-16"
  },
  {
    "id": 2513,
    "customerId": 1786,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-11"
  },
  {
    "id": 2514,
    "customerId": 1787,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-10-16"
  },
  {
    "id": 2515,
    "customerId": 1788,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-04"
  },
  {
    "id": 2516,
    "customerId": 1788,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-04"
  },
  {
    "id": 2517,
    "customerId": 1789,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-09-13"
  },
  {
    "id": 2518,
    "customerId": 1789,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-09-13"
  },
  {
    "id": 2519,
    "customerId": 1790,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-11"
  },
  {
    "id": 2520,
    "customerId": 1790,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-11"
  },
  {
    "id": 2521,
    "customerId": 1791,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-26"
  },
  {
    "id": 2522,
    "customerId": 1792,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-11-01"
  },
  {
    "id": 2523,
    "customerId": 1792,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-01"
  },
  {
    "id": 2524,
    "customerId": 1793,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-02-10"
  },
  {
    "id": 2525,
    "customerId": 1794,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-04"
  },
  {
    "id": 2526,
    "customerId": 1794,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-04"
  },
  {
    "id": 2527,
    "customerId": 1795,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-28"
  },
  {
    "id": 2528,
    "customerId": 1795,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-28"
  },
  {
    "id": 2529,
    "customerId": 1796,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-08"
  },
  {
    "id": 2530,
    "customerId": 1796,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-08"
  },
  {
    "id": 2531,
    "customerId": 1797,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-05-17"
  },
  {
    "id": 2532,
    "customerId": 1797,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-05-17"
  },
  {
    "id": 2533,
    "customerId": 1797,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-17"
  },
  {
    "id": 2534,
    "customerId": 1798,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-09-19"
  },
  {
    "id": 2535,
    "customerId": 1799,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-29"
  },
  {
    "id": 2536,
    "customerId": 1800,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-08"
  },
  {
    "id": 2537,
    "customerId": 1801,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-31"
  },
  {
    "id": 2538,
    "customerId": 1801,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-31"
  },
  {
    "id": 2539,
    "customerId": 1802,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-02-01"
  },
  {
    "id": 2540,
    "customerId": 1802,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-01"
  },
  {
    "id": 2541,
    "customerId": 1803,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 2542,
    "customerId": 1803,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 2543,
    "customerId": 1804,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 2544,
    "customerId": 1805,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-01"
  },
  {
    "id": 2545,
    "customerId": 1805,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-01"
  },
  {
    "id": 2546,
    "customerId": 1806,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 2547,
    "customerId": 1806,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 2548,
    "customerId": 1806,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 2549,
    "customerId": 1807,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-01-18"
  },
  {
    "id": 2550,
    "customerId": 1807,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-01-18"
  },
  {
    "id": 2551,
    "customerId": 1808,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-17"
  },
  {
    "id": 2552,
    "customerId": 1808,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-17"
  },
  {
    "id": 2553,
    "customerId": 1809,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-18"
  },
  {
    "id": 2554,
    "customerId": 1809,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-18"
  },
  {
    "id": 2555,
    "customerId": 1810,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-10-09"
  },
  {
    "id": 2556,
    "customerId": 1811,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-27"
  },
  {
    "id": 2557,
    "customerId": 1811,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-27"
  },
  {
    "id": 2558,
    "customerId": 1814,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 2559,
    "customerId": 1814,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 2560,
    "customerId": 1814,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-07"
  },
  {
    "id": 2561,
    "customerId": 1815,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-10-26"
  },
  {
    "id": 2562,
    "customerId": 1816,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-07"
  },
  {
    "id": 2563,
    "customerId": 1816,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-07"
  },
  {
    "id": 2564,
    "customerId": 1817,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-10-22"
  },
  {
    "id": 2565,
    "customerId": 1818,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-18"
  },
  {
    "id": 2566,
    "customerId": 1818,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-18"
  },
  {
    "id": 2567,
    "customerId": 1819,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-07"
  },
  {
    "id": 2568,
    "customerId": 1820,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2569,
    "customerId": 1821,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-18"
  },
  {
    "id": 2570,
    "customerId": 1822,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2571,
    "customerId": 1823,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-07"
  },
  {
    "id": 2572,
    "customerId": 1823,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-07"
  },
  {
    "id": 2573,
    "customerId": 1824,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-02"
  },
  {
    "id": 2574,
    "customerId": 1824,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-02"
  },
  {
    "id": 2575,
    "customerId": 1825,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-13"
  },
  {
    "id": 2576,
    "customerId": 1826,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-12-01"
  },
  {
    "id": 2577,
    "customerId": 1826,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-01"
  },
  {
    "id": 2578,
    "customerId": 1827,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-22"
  },
  {
    "id": 2579,
    "customerId": 1827,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-22"
  },
  {
    "id": 2580,
    "customerId": 1828,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-04-04"
  },
  {
    "id": 2581,
    "customerId": 1828,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-04"
  },
  {
    "id": 2582,
    "customerId": 1828,
    "sourceType": "art_show",
    "sourceName": "NWFGS",
    "firstSeenOn": "2023-04-04"
  },
  {
    "id": 2583,
    "customerId": 1829,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-12"
  },
  {
    "id": 2584,
    "customerId": 1830,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-25"
  },
  {
    "id": 2585,
    "customerId": 1830,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-25"
  },
  {
    "id": 2586,
    "customerId": 1831,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-10-16"
  },
  {
    "id": 2587,
    "customerId": 1831,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-16"
  },
  {
    "id": 2588,
    "customerId": 1832,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-01-07"
  },
  {
    "id": 2589,
    "customerId": 1832,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-07"
  },
  {
    "id": 2590,
    "customerId": 1833,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-21"
  },
  {
    "id": 2591,
    "customerId": 1833,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-21"
  },
  {
    "id": 2592,
    "customerId": 1835,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2593,
    "customerId": 1836,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-08"
  },
  {
    "id": 2594,
    "customerId": 1836,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-08"
  },
  {
    "id": 2595,
    "customerId": 1837,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-30"
  },
  {
    "id": 2596,
    "customerId": 1837,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-30"
  },
  {
    "id": 2597,
    "customerId": 1838,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-10"
  },
  {
    "id": 2598,
    "customerId": 1838,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-10"
  },
  {
    "id": 2599,
    "customerId": 1839,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-10"
  },
  {
    "id": 2600,
    "customerId": 1839,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-10"
  },
  {
    "id": 2601,
    "customerId": 1840,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-16"
  },
  {
    "id": 2602,
    "customerId": 1840,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-16"
  },
  {
    "id": 2603,
    "customerId": 1841,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-06-20"
  },
  {
    "id": 2604,
    "customerId": 1841,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-06-20"
  },
  {
    "id": 2605,
    "customerId": 1843,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-04"
  },
  {
    "id": 2606,
    "customerId": 1844,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-03-28"
  },
  {
    "id": 2607,
    "customerId": 1844,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-28"
  },
  {
    "id": 2608,
    "customerId": 1845,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-10-08"
  },
  {
    "id": 2609,
    "customerId": 1846,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-20"
  },
  {
    "id": 2610,
    "customerId": 1847,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-27"
  },
  {
    "id": 2611,
    "customerId": 1848,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-08-16"
  },
  {
    "id": 2612,
    "customerId": 1849,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-25"
  },
  {
    "id": 2613,
    "customerId": 1850,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-05-08"
  },
  {
    "id": 2614,
    "customerId": 1850,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-08"
  },
  {
    "id": 2615,
    "customerId": 1852,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-11"
  },
  {
    "id": 2616,
    "customerId": 1853,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-02-24"
  },
  {
    "id": 2617,
    "customerId": 1854,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-26"
  },
  {
    "id": 2618,
    "customerId": 1855,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-15"
  },
  {
    "id": 2619,
    "customerId": 1855,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-15"
  },
  {
    "id": 2620,
    "customerId": 1856,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2621,
    "customerId": 1857,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-11"
  },
  {
    "id": 2622,
    "customerId": 1857,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-11"
  },
  {
    "id": 2623,
    "customerId": 1858,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-13"
  },
  {
    "id": 2624,
    "customerId": 1858,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-13"
  },
  {
    "id": 2625,
    "customerId": 1859,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-06"
  },
  {
    "id": 2626,
    "customerId": 1859,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-06"
  },
  {
    "id": 2627,
    "customerId": 1860,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-22"
  },
  {
    "id": 2628,
    "customerId": 1861,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 2629,
    "customerId": 1861,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 2630,
    "customerId": 1861,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-07"
  },
  {
    "id": 2631,
    "customerId": 1862,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2632,
    "customerId": 1863,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 2633,
    "customerId": 1863,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 2634,
    "customerId": 1863,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 2635,
    "customerId": 1864,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-05"
  },
  {
    "id": 2636,
    "customerId": 1864,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-05"
  },
  {
    "id": 2637,
    "customerId": 1865,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-08-29"
  },
  {
    "id": 2638,
    "customerId": 1866,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-01"
  },
  {
    "id": 2639,
    "customerId": 1866,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-01"
  },
  {
    "id": 2640,
    "customerId": 1867,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-09"
  },
  {
    "id": 2641,
    "customerId": 1867,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-09"
  },
  {
    "id": 2642,
    "customerId": 1868,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 2643,
    "customerId": 1869,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-04-10"
  },
  {
    "id": 2644,
    "customerId": 1869,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-04-10"
  },
  {
    "id": 2645,
    "customerId": 1870,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-11"
  },
  {
    "id": 2646,
    "customerId": 1871,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-27"
  },
  {
    "id": 2647,
    "customerId": 1872,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 2648,
    "customerId": 1873,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-10"
  },
  {
    "id": 2649,
    "customerId": 1874,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-09"
  },
  {
    "id": 2650,
    "customerId": 1874,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-09"
  },
  {
    "id": 2651,
    "customerId": 1875,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-08"
  },
  {
    "id": 2652,
    "customerId": 1875,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-08"
  },
  {
    "id": 2653,
    "customerId": 1876,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-27"
  },
  {
    "id": 2654,
    "customerId": 1876,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-27"
  },
  {
    "id": 2655,
    "customerId": 1879,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-11"
  },
  {
    "id": 2656,
    "customerId": 1880,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-07-18"
  },
  {
    "id": 2657,
    "customerId": 1880,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-18"
  },
  {
    "id": 2658,
    "customerId": 1881,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-20"
  },
  {
    "id": 2659,
    "customerId": 1883,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-03-17"
  },
  {
    "id": 2660,
    "customerId": 1883,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-17"
  },
  {
    "id": 2661,
    "customerId": 1884,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-01-22"
  },
  {
    "id": 2662,
    "customerId": 1884,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-22"
  },
  {
    "id": 2663,
    "customerId": 1884,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-22"
  },
  {
    "id": 2664,
    "customerId": 1885,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-01-01"
  },
  {
    "id": 2665,
    "customerId": 1885,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-01-01"
  },
  {
    "id": 2666,
    "customerId": 1886,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-19"
  },
  {
    "id": 2667,
    "customerId": 1886,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-19"
  },
  {
    "id": 2668,
    "customerId": 1888,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2669,
    "customerId": 1889,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2670,
    "customerId": 1890,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2671,
    "customerId": 1891,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-08-08"
  },
  {
    "id": 2672,
    "customerId": 1892,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2024-01-01"
  },
  {
    "id": 2673,
    "customerId": 1893,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-24"
  },
  {
    "id": 2674,
    "customerId": 1893,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-24"
  },
  {
    "id": 2675,
    "customerId": 1894,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-29"
  },
  {
    "id": 2676,
    "customerId": 1894,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-29"
  },
  {
    "id": 2677,
    "customerId": 1895,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-07"
  },
  {
    "id": 2678,
    "customerId": 1896,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-11-25"
  },
  {
    "id": 2679,
    "customerId": 1897,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-02-01"
  },
  {
    "id": 2680,
    "customerId": 1898,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-03"
  },
  {
    "id": 2681,
    "customerId": 1900,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-03-17"
  },
  {
    "id": 2682,
    "customerId": 1901,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-31"
  },
  {
    "id": 2683,
    "customerId": 1901,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-31"
  },
  {
    "id": 2684,
    "customerId": 1902,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 2685,
    "customerId": 1902,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 2686,
    "customerId": 1904,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2014-03-02"
  },
  {
    "id": 2687,
    "customerId": 1904,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-02"
  },
  {
    "id": 2688,
    "customerId": 1905,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-30"
  },
  {
    "id": 2689,
    "customerId": 1905,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-30"
  },
  {
    "id": 2690,
    "customerId": 1906,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-02"
  },
  {
    "id": 2691,
    "customerId": 1907,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-23"
  },
  {
    "id": 2692,
    "customerId": 1907,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-23"
  },
  {
    "id": 2693,
    "customerId": 1908,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-01-25"
  },
  {
    "id": 2694,
    "customerId": 1909,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-06-15"
  },
  {
    "id": 2695,
    "customerId": 1910,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-10-28"
  },
  {
    "id": 2696,
    "customerId": 1910,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-10-28"
  },
  {
    "id": 2697,
    "customerId": 1911,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-29"
  },
  {
    "id": 2698,
    "customerId": 1912,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-04-01"
  },
  {
    "id": 2699,
    "customerId": 1913,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-05"
  },
  {
    "id": 2700,
    "customerId": 1913,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-05"
  },
  {
    "id": 2701,
    "customerId": 1914,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-05"
  },
  {
    "id": 2702,
    "customerId": 1914,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-05"
  },
  {
    "id": 2703,
    "customerId": 1915,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-03-28"
  },
  {
    "id": 2704,
    "customerId": 1917,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-07-15"
  },
  {
    "id": 2705,
    "customerId": 1918,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-03-28"
  },
  {
    "id": 2706,
    "customerId": 1919,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-13"
  },
  {
    "id": 2707,
    "customerId": 1919,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-13"
  },
  {
    "id": 2708,
    "customerId": 1920,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-30"
  },
  {
    "id": 2709,
    "customerId": 1921,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-06"
  },
  {
    "id": 2710,
    "customerId": 1921,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-06"
  },
  {
    "id": 2711,
    "customerId": 1923,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-28"
  },
  {
    "id": 2712,
    "customerId": 1923,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-28"
  },
  {
    "id": 2713,
    "customerId": 1925,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-08-21"
  },
  {
    "id": 2714,
    "customerId": 1925,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-08-21"
  },
  {
    "id": 2715,
    "customerId": 1925,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-21"
  },
  {
    "id": 2716,
    "customerId": 1926,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-30"
  },
  {
    "id": 2717,
    "customerId": 1926,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-30"
  },
  {
    "id": 2718,
    "customerId": 1927,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-05-24"
  },
  {
    "id": 2719,
    "customerId": 1927,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-05-24"
  },
  {
    "id": 2720,
    "customerId": 1928,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-18"
  },
  {
    "id": 2721,
    "customerId": 1928,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-18"
  },
  {
    "id": 2722,
    "customerId": 1929,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-03-09"
  },
  {
    "id": 2723,
    "customerId": 1929,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-09"
  },
  {
    "id": 2724,
    "customerId": 1930,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-09-26"
  },
  {
    "id": 2725,
    "customerId": 1930,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-26"
  },
  {
    "id": 2726,
    "customerId": 1930,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-26"
  },
  {
    "id": 2727,
    "customerId": 1931,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-25"
  },
  {
    "id": 2728,
    "customerId": 1932,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-03"
  },
  {
    "id": 2729,
    "customerId": 1932,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-03"
  },
  {
    "id": 2730,
    "customerId": 1933,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2731,
    "customerId": 1934,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-11-29"
  },
  {
    "id": 2732,
    "customerId": 1935,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2014-04-02"
  },
  {
    "id": 2733,
    "customerId": 1935,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-04-02"
  },
  {
    "id": 2734,
    "customerId": 1936,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-15"
  },
  {
    "id": 2735,
    "customerId": 1936,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-15"
  },
  {
    "id": 2736,
    "customerId": 1937,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-04"
  },
  {
    "id": 2737,
    "customerId": 1937,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-04"
  },
  {
    "id": 2738,
    "customerId": 1938,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-02-29"
  },
  {
    "id": 2739,
    "customerId": 1938,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-29"
  },
  {
    "id": 2740,
    "customerId": 1939,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-11"
  },
  {
    "id": 2741,
    "customerId": 1939,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-11"
  },
  {
    "id": 2742,
    "customerId": 1940,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-06"
  },
  {
    "id": 2743,
    "customerId": 1940,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-06"
  },
  {
    "id": 2744,
    "customerId": 1941,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-11"
  },
  {
    "id": 2745,
    "customerId": 1942,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-04-11"
  },
  {
    "id": 2746,
    "customerId": 1943,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-19"
  },
  {
    "id": 2747,
    "customerId": 1944,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2748,
    "customerId": 1945,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-19"
  },
  {
    "id": 2749,
    "customerId": 1945,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-19"
  },
  {
    "id": 2750,
    "customerId": 1946,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-08-04"
  },
  {
    "id": 2751,
    "customerId": 1946,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-08-04"
  },
  {
    "id": 2752,
    "customerId": 1947,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-25"
  },
  {
    "id": 2753,
    "customerId": 1948,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-28"
  },
  {
    "id": 2754,
    "customerId": 1948,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-28"
  },
  {
    "id": 2755,
    "customerId": 1949,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-01-02"
  },
  {
    "id": 2756,
    "customerId": 1949,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-01-02"
  },
  {
    "id": 2757,
    "customerId": 1950,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-03-13"
  },
  {
    "id": 2758,
    "customerId": 1951,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-31"
  },
  {
    "id": 2759,
    "customerId": 1952,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-10"
  },
  {
    "id": 2760,
    "customerId": 1953,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-25"
  },
  {
    "id": 2761,
    "customerId": 1954,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2009-02-07"
  },
  {
    "id": 2762,
    "customerId": 1955,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-25"
  },
  {
    "id": 2763,
    "customerId": 1956,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-04-02"
  },
  {
    "id": 2764,
    "customerId": 1957,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-04-10"
  },
  {
    "id": 2765,
    "customerId": 1958,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-17"
  },
  {
    "id": 2766,
    "customerId": 1959,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-16"
  },
  {
    "id": 2767,
    "customerId": 1959,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-16"
  },
  {
    "id": 2768,
    "customerId": 1961,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-07-17"
  },
  {
    "id": 2769,
    "customerId": 1961,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-07-17"
  },
  {
    "id": 2770,
    "customerId": 1962,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-06-20"
  },
  {
    "id": 2771,
    "customerId": 1962,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-20"
  },
  {
    "id": 2772,
    "customerId": 1963,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-02-11"
  },
  {
    "id": 2773,
    "customerId": 1963,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-02-11"
  },
  {
    "id": 2774,
    "customerId": 1964,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-20"
  },
  {
    "id": 2775,
    "customerId": 1964,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-20"
  },
  {
    "id": 2776,
    "customerId": 1967,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2777,
    "customerId": 1968,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-13"
  },
  {
    "id": 2778,
    "customerId": 1968,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-13"
  },
  {
    "id": 2779,
    "customerId": 1969,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-05-16"
  },
  {
    "id": 2780,
    "customerId": 1969,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-16"
  },
  {
    "id": 2781,
    "customerId": 1970,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-13"
  },
  {
    "id": 2782,
    "customerId": 1970,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-13"
  },
  {
    "id": 2783,
    "customerId": 1971,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-08-10"
  },
  {
    "id": 2784,
    "customerId": 1972,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-10-28"
  },
  {
    "id": 2785,
    "customerId": 1973,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-04-30"
  },
  {
    "id": 2786,
    "customerId": 1973,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-04-30"
  },
  {
    "id": 2787,
    "customerId": 1975,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2788,
    "customerId": 1976,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-03-03"
  },
  {
    "id": 2789,
    "customerId": 1976,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-03"
  },
  {
    "id": 2790,
    "customerId": 1977,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-01-29"
  },
  {
    "id": 2791,
    "customerId": 1978,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-09-03"
  },
  {
    "id": 2792,
    "customerId": 1979,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-04"
  },
  {
    "id": 2793,
    "customerId": 1979,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-04"
  },
  {
    "id": 2794,
    "customerId": 1980,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2795,
    "customerId": 1981,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-03-04"
  },
  {
    "id": 2796,
    "customerId": 1981,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-04"
  },
  {
    "id": 2797,
    "customerId": 1982,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-07-15"
  },
  {
    "id": 2798,
    "customerId": 1983,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-26"
  },
  {
    "id": 2799,
    "customerId": 1984,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-27"
  },
  {
    "id": 2800,
    "customerId": 1985,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-26"
  },
  {
    "id": 2801,
    "customerId": 1985,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-26"
  },
  {
    "id": 2802,
    "customerId": 1986,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-16"
  },
  {
    "id": 2803,
    "customerId": 1987,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-07-11"
  },
  {
    "id": 2804,
    "customerId": 1988,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-04-25"
  },
  {
    "id": 2805,
    "customerId": 1988,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-25"
  },
  {
    "id": 2806,
    "customerId": 1988,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-25"
  },
  {
    "id": 2807,
    "customerId": 1989,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-27"
  },
  {
    "id": 2808,
    "customerId": 1989,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-27"
  },
  {
    "id": 2809,
    "customerId": 1990,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-18"
  },
  {
    "id": 2810,
    "customerId": 1993,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-16"
  },
  {
    "id": 2811,
    "customerId": 1994,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2812,
    "customerId": 1995,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-16"
  },
  {
    "id": 2813,
    "customerId": 1995,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-16"
  },
  {
    "id": 2814,
    "customerId": 1996,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-06-24"
  },
  {
    "id": 2815,
    "customerId": 1996,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-24"
  },
  {
    "id": 2816,
    "customerId": 1997,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 2817,
    "customerId": 1998,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-11"
  },
  {
    "id": 2818,
    "customerId": 1998,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-11"
  },
  {
    "id": 2819,
    "customerId": 1999,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-16"
  },
  {
    "id": 2820,
    "customerId": 2000,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-14"
  },
  {
    "id": 2821,
    "customerId": 2000,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-14"
  },
  {
    "id": 2822,
    "customerId": 2001,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 2823,
    "customerId": 2001,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-03"
  },
  {
    "id": 2824,
    "customerId": 2002,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-15"
  },
  {
    "id": 2825,
    "customerId": 2003,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-06"
  },
  {
    "id": 2826,
    "customerId": 2004,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-03-30"
  },
  {
    "id": 2827,
    "customerId": 2004,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-30"
  },
  {
    "id": 2828,
    "customerId": 2005,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-22"
  },
  {
    "id": 2829,
    "customerId": 2005,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-22"
  },
  {
    "id": 2830,
    "customerId": 2006,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-11-15"
  },
  {
    "id": 2831,
    "customerId": 2006,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-11-15"
  },
  {
    "id": 2832,
    "customerId": 2007,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-28"
  },
  {
    "id": 2833,
    "customerId": 2008,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-03"
  },
  {
    "id": 2834,
    "customerId": 2009,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-29"
  },
  {
    "id": 2835,
    "customerId": 2009,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-29"
  },
  {
    "id": 2836,
    "customerId": 2010,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-04-01"
  },
  {
    "id": 2837,
    "customerId": 2011,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2838,
    "customerId": 2012,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-05-20"
  },
  {
    "id": 2839,
    "customerId": 2014,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-20"
  },
  {
    "id": 2840,
    "customerId": 2015,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-19"
  },
  {
    "id": 2841,
    "customerId": 2015,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-19"
  },
  {
    "id": 2842,
    "customerId": 2016,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-07"
  },
  {
    "id": 2843,
    "customerId": 2016,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-07"
  },
  {
    "id": 2844,
    "customerId": 2017,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-15"
  },
  {
    "id": 2845,
    "customerId": 2018,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-18"
  },
  {
    "id": 2846,
    "customerId": 2019,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-03"
  },
  {
    "id": 2847,
    "customerId": 2020,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-27"
  },
  {
    "id": 2848,
    "customerId": 2020,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-27"
  },
  {
    "id": 2849,
    "customerId": 2021,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-21"
  },
  {
    "id": 2850,
    "customerId": 2021,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-21"
  },
  {
    "id": 2851,
    "customerId": 2022,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-05"
  },
  {
    "id": 2852,
    "customerId": 2022,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-05"
  },
  {
    "id": 2853,
    "customerId": 2023,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-05"
  },
  {
    "id": 2854,
    "customerId": 2023,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-05"
  },
  {
    "id": 2855,
    "customerId": 2025,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-21"
  },
  {
    "id": 2856,
    "customerId": 2025,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-21"
  },
  {
    "id": 2857,
    "customerId": 2026,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-09-30"
  },
  {
    "id": 2858,
    "customerId": 2027,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-08"
  },
  {
    "id": 2859,
    "customerId": 2027,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-08"
  },
  {
    "id": 2860,
    "customerId": 2029,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-11"
  },
  {
    "id": 2861,
    "customerId": 2029,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-11"
  },
  {
    "id": 2862,
    "customerId": 2030,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 2863,
    "customerId": 2030,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 2864,
    "customerId": 2031,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-26"
  },
  {
    "id": 2865,
    "customerId": 2032,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-21"
  },
  {
    "id": 2866,
    "customerId": 2032,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-21"
  },
  {
    "id": 2867,
    "customerId": 2033,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 2868,
    "customerId": 2033,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 2869,
    "customerId": 2033,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 2870,
    "customerId": 2034,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-26"
  },
  {
    "id": 2871,
    "customerId": 2034,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-26"
  },
  {
    "id": 2872,
    "customerId": 2035,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-08-15"
  },
  {
    "id": 2873,
    "customerId": 2035,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-15"
  },
  {
    "id": 2874,
    "customerId": 2036,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-05-06"
  },
  {
    "id": 2875,
    "customerId": 2036,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-06"
  },
  {
    "id": 2876,
    "customerId": 2037,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-16"
  },
  {
    "id": 2877,
    "customerId": 2038,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2878,
    "customerId": 2039,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-05-11"
  },
  {
    "id": 2879,
    "customerId": 2039,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-11"
  },
  {
    "id": 2880,
    "customerId": 2040,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-27"
  },
  {
    "id": 2881,
    "customerId": 2041,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-29"
  },
  {
    "id": 2882,
    "customerId": 2041,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-29"
  },
  {
    "id": 2883,
    "customerId": 2042,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-10-02"
  },
  {
    "id": 2884,
    "customerId": 2044,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2885,
    "customerId": 2045,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-12"
  },
  {
    "id": 2886,
    "customerId": 2045,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-12"
  },
  {
    "id": 2887,
    "customerId": 2046,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-25"
  },
  {
    "id": 2888,
    "customerId": 2046,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-25"
  },
  {
    "id": 2889,
    "customerId": 2047,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-21"
  },
  {
    "id": 2890,
    "customerId": 2048,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-08"
  },
  {
    "id": 2891,
    "customerId": 2049,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-08-06"
  },
  {
    "id": 2892,
    "customerId": 2049,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-08-06"
  },
  {
    "id": 2893,
    "customerId": 2050,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-02"
  },
  {
    "id": 2894,
    "customerId": 2050,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-02"
  },
  {
    "id": 2895,
    "customerId": 2051,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-08"
  },
  {
    "id": 2896,
    "customerId": 2052,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-12-22"
  },
  {
    "id": 2897,
    "customerId": 2053,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-09-26"
  },
  {
    "id": 2898,
    "customerId": 2053,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-26"
  },
  {
    "id": 2899,
    "customerId": 2054,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-21"
  },
  {
    "id": 2900,
    "customerId": 2054,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-21"
  },
  {
    "id": 2901,
    "customerId": 2055,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2902,
    "customerId": 2056,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-06-29"
  },
  {
    "id": 2903,
    "customerId": 2056,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-29"
  },
  {
    "id": 2904,
    "customerId": 2058,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-15"
  },
  {
    "id": 2905,
    "customerId": 2059,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-07-30"
  },
  {
    "id": 2906,
    "customerId": 2061,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-08-30"
  },
  {
    "id": 2907,
    "customerId": 2061,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-08-30"
  },
  {
    "id": 2908,
    "customerId": 2061,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-30"
  },
  {
    "id": 2909,
    "customerId": 2062,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-04"
  },
  {
    "id": 2910,
    "customerId": 2063,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-14"
  },
  {
    "id": 2911,
    "customerId": 2063,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-14"
  },
  {
    "id": 2912,
    "customerId": 2064,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-02-21"
  },
  {
    "id": 2913,
    "customerId": 2064,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-21"
  },
  {
    "id": 2914,
    "customerId": 2064,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-21"
  },
  {
    "id": 2915,
    "customerId": 2065,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-04-11"
  },
  {
    "id": 2916,
    "customerId": 2066,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-09-23"
  },
  {
    "id": 2917,
    "customerId": 2067,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2018-07-13"
  },
  {
    "id": 2918,
    "customerId": 2067,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-13"
  },
  {
    "id": 2919,
    "customerId": 2068,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-24"
  },
  {
    "id": 2920,
    "customerId": 2068,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-24"
  },
  {
    "id": 2921,
    "customerId": 2069,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-01-09"
  },
  {
    "id": 2922,
    "customerId": 2069,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-01-09"
  },
  {
    "id": 2923,
    "customerId": 2070,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-06-15"
  },
  {
    "id": 2924,
    "customerId": 2070,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-06-15"
  },
  {
    "id": 2925,
    "customerId": 2071,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 2926,
    "customerId": 2072,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-16"
  },
  {
    "id": 2927,
    "customerId": 2072,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-16"
  },
  {
    "id": 2928,
    "customerId": 2073,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-07"
  },
  {
    "id": 2929,
    "customerId": 2073,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-07"
  },
  {
    "id": 2930,
    "customerId": 2074,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-08-22"
  },
  {
    "id": 2931,
    "customerId": 2074,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-22"
  },
  {
    "id": 2932,
    "customerId": 2075,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-01-19"
  },
  {
    "id": 2933,
    "customerId": 2075,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-19"
  },
  {
    "id": 2934,
    "customerId": 2075,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-19"
  },
  {
    "id": 2935,
    "customerId": 2076,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-18"
  },
  {
    "id": 2936,
    "customerId": 2076,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-18"
  },
  {
    "id": 2937,
    "customerId": 2077,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-01-18"
  },
  {
    "id": 2938,
    "customerId": 2077,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-01-18"
  },
  {
    "id": 2939,
    "customerId": 2078,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2940,
    "customerId": 2079,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-17"
  },
  {
    "id": 2941,
    "customerId": 2080,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-09-06"
  },
  {
    "id": 2942,
    "customerId": 2081,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-26"
  },
  {
    "id": 2943,
    "customerId": 2081,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-26"
  },
  {
    "id": 2944,
    "customerId": 2082,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-12-01"
  },
  {
    "id": 2945,
    "customerId": 2082,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-01"
  },
  {
    "id": 2946,
    "customerId": 2082,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-01"
  },
  {
    "id": 2947,
    "customerId": 2083,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-05"
  },
  {
    "id": 2948,
    "customerId": 2084,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-09-04"
  },
  {
    "id": 2949,
    "customerId": 2085,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-10-26"
  },
  {
    "id": 2950,
    "customerId": 2086,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2951,
    "customerId": 2088,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 2952,
    "customerId": 2088,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 2953,
    "customerId": 2089,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-25"
  },
  {
    "id": 2954,
    "customerId": 2089,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-25"
  },
  {
    "id": 2955,
    "customerId": 2090,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-09-14"
  },
  {
    "id": 2956,
    "customerId": 2090,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-09-14"
  },
  {
    "id": 2957,
    "customerId": 2091,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-15"
  },
  {
    "id": 2958,
    "customerId": 2091,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-15"
  },
  {
    "id": 2959,
    "customerId": 2092,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 2960,
    "customerId": 2093,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-28"
  },
  {
    "id": 2961,
    "customerId": 2095,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2962,
    "customerId": 2096,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2963,
    "customerId": 2097,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-18"
  },
  {
    "id": 2964,
    "customerId": 2098,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-04"
  },
  {
    "id": 2965,
    "customerId": 2099,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-08-15"
  },
  {
    "id": 2966,
    "customerId": 2099,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-08-15"
  },
  {
    "id": 2967,
    "customerId": 2100,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-27"
  },
  {
    "id": 2968,
    "customerId": 2101,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-02-27"
  },
  {
    "id": 2969,
    "customerId": 2102,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-11"
  },
  {
    "id": 2970,
    "customerId": 2103,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-22"
  },
  {
    "id": 2971,
    "customerId": 2104,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2972,
    "customerId": 2105,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-07"
  },
  {
    "id": 2973,
    "customerId": 2106,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2974,
    "customerId": 2108,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-08-10"
  },
  {
    "id": 2975,
    "customerId": 2109,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-14"
  },
  {
    "id": 2976,
    "customerId": 2110,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2977,
    "customerId": 2111,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-10-14"
  },
  {
    "id": 2978,
    "customerId": 2112,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-22"
  },
  {
    "id": 2979,
    "customerId": 2112,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-22"
  },
  {
    "id": 2980,
    "customerId": 2113,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-04-28"
  },
  {
    "id": 2981,
    "customerId": 2114,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-25"
  },
  {
    "id": 2982,
    "customerId": 2115,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-22"
  },
  {
    "id": 2983,
    "customerId": 2116,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-08-03"
  },
  {
    "id": 2984,
    "customerId": 2118,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 2985,
    "customerId": 2119,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2014-04-29"
  },
  {
    "id": 2986,
    "customerId": 2119,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-04-29"
  },
  {
    "id": 2987,
    "customerId": 2120,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 2988,
    "customerId": 2121,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-06"
  },
  {
    "id": 2989,
    "customerId": 2121,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-06"
  },
  {
    "id": 2990,
    "customerId": 2122,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-28"
  },
  {
    "id": 2991,
    "customerId": 2122,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-28"
  },
  {
    "id": 2992,
    "customerId": 2123,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-17"
  },
  {
    "id": 2993,
    "customerId": 2123,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-17"
  },
  {
    "id": 2994,
    "customerId": 2124,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-07-30"
  },
  {
    "id": 2995,
    "customerId": 2125,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-02-18"
  },
  {
    "id": 2996,
    "customerId": 2125,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-18"
  },
  {
    "id": 2997,
    "customerId": 2126,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-04-28"
  },
  {
    "id": 2998,
    "customerId": 2126,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-28"
  },
  {
    "id": 2999,
    "customerId": 2127,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-18"
  },
  {
    "id": 3000,
    "customerId": 2128,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 3001,
    "customerId": 2130,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-07-23"
  },
  {
    "id": 3002,
    "customerId": 2130,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-23"
  },
  {
    "id": 3003,
    "customerId": 2132,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-11-28"
  },
  {
    "id": 3004,
    "customerId": 2133,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-06"
  },
  {
    "id": 3005,
    "customerId": 2134,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-12"
  },
  {
    "id": 3006,
    "customerId": 2135,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-10-15"
  },
  {
    "id": 3007,
    "customerId": 2136,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-09-25"
  },
  {
    "id": 3008,
    "customerId": 2137,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-02-24"
  },
  {
    "id": 3009,
    "customerId": 2137,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-24"
  },
  {
    "id": 3010,
    "customerId": 2138,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-04"
  },
  {
    "id": 3011,
    "customerId": 2139,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-05"
  },
  {
    "id": 3012,
    "customerId": 2140,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-11-03"
  },
  {
    "id": 3013,
    "customerId": 2141,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-03-31"
  },
  {
    "id": 3014,
    "customerId": 2141,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-03-31"
  },
  {
    "id": 3015,
    "customerId": 2141,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-31"
  },
  {
    "id": 3016,
    "customerId": 2142,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 3017,
    "customerId": 2142,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-28"
  },
  {
    "id": 3018,
    "customerId": 2143,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-20"
  },
  {
    "id": 3019,
    "customerId": 2143,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-20"
  },
  {
    "id": 3020,
    "customerId": 2144,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-12-18"
  },
  {
    "id": 3021,
    "customerId": 2144,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-18"
  },
  {
    "id": 3022,
    "customerId": 2145,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 3023,
    "customerId": 2145,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 3024,
    "customerId": 2145,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-19"
  },
  {
    "id": 3025,
    "customerId": 2146,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-17"
  },
  {
    "id": 3026,
    "customerId": 2146,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-17"
  },
  {
    "id": 3027,
    "customerId": 2147,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-06"
  },
  {
    "id": 3028,
    "customerId": 2148,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-30"
  },
  {
    "id": 3029,
    "customerId": 2148,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-30"
  },
  {
    "id": 3030,
    "customerId": 2148,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-30"
  },
  {
    "id": 3031,
    "customerId": 2149,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2009-02-07"
  },
  {
    "id": 3032,
    "customerId": 2150,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-06"
  },
  {
    "id": 3033,
    "customerId": 2151,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-11-27"
  },
  {
    "id": 3034,
    "customerId": 2152,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-03-23"
  },
  {
    "id": 3035,
    "customerId": 2153,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-20"
  },
  {
    "id": 3036,
    "customerId": 2153,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-20"
  },
  {
    "id": 3037,
    "customerId": 2154,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-08"
  },
  {
    "id": 3038,
    "customerId": 2155,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3039,
    "customerId": 2157,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-02-01"
  },
  {
    "id": 3040,
    "customerId": 2157,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-01"
  },
  {
    "id": 3041,
    "customerId": 2160,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-08-16"
  },
  {
    "id": 3042,
    "customerId": 2161,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-08-19"
  },
  {
    "id": 3043,
    "customerId": 2161,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-08-19"
  },
  {
    "id": 3044,
    "customerId": 2162,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-10-05"
  },
  {
    "id": 3045,
    "customerId": 2162,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-05"
  },
  {
    "id": 3046,
    "customerId": 2163,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-13"
  },
  {
    "id": 3047,
    "customerId": 2163,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-13"
  },
  {
    "id": 3048,
    "customerId": 2164,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-05"
  },
  {
    "id": 3049,
    "customerId": 2164,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-05"
  },
  {
    "id": 3050,
    "customerId": 2166,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-01-27"
  },
  {
    "id": 3051,
    "customerId": 2167,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-01"
  },
  {
    "id": 3052,
    "customerId": 2167,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-01"
  },
  {
    "id": 3053,
    "customerId": 2168,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-05-13"
  },
  {
    "id": 3054,
    "customerId": 2169,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-12-10"
  },
  {
    "id": 3055,
    "customerId": 2169,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-10"
  },
  {
    "id": 3056,
    "customerId": 2170,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-03"
  },
  {
    "id": 3057,
    "customerId": 2171,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-07"
  },
  {
    "id": 3058,
    "customerId": 2171,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-07"
  },
  {
    "id": 3059,
    "customerId": 2172,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-09-06"
  },
  {
    "id": 3060,
    "customerId": 2173,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-02"
  },
  {
    "id": 3061,
    "customerId": 2173,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-02"
  },
  {
    "id": 3062,
    "customerId": 2174,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2025-08-28"
  },
  {
    "id": 3063,
    "customerId": 2174,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-08-28"
  },
  {
    "id": 3064,
    "customerId": 2174,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-08-28"
  },
  {
    "id": 3065,
    "customerId": 2175,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3066,
    "customerId": 2177,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 3067,
    "customerId": 2177,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 3068,
    "customerId": 2177,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 3069,
    "customerId": 2178,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-04"
  },
  {
    "id": 3070,
    "customerId": 2178,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-04"
  },
  {
    "id": 3071,
    "customerId": 2179,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-07"
  },
  {
    "id": 3072,
    "customerId": 2179,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-07"
  },
  {
    "id": 3073,
    "customerId": 2180,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-12-01"
  },
  {
    "id": 3074,
    "customerId": 2180,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-01"
  },
  {
    "id": 3075,
    "customerId": 2180,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-01"
  },
  {
    "id": 3076,
    "customerId": 2181,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-04-11"
  },
  {
    "id": 3077,
    "customerId": 2181,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-11"
  },
  {
    "id": 3078,
    "customerId": 2182,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-10"
  },
  {
    "id": 3079,
    "customerId": 2183,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-27"
  },
  {
    "id": 3080,
    "customerId": 2185,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-09-25"
  },
  {
    "id": 3081,
    "customerId": 2185,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-25"
  },
  {
    "id": 3082,
    "customerId": 2186,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-24"
  },
  {
    "id": 3083,
    "customerId": 2186,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-24"
  },
  {
    "id": 3084,
    "customerId": 2187,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2025-05-27"
  },
  {
    "id": 3085,
    "customerId": 2187,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-27"
  },
  {
    "id": 3086,
    "customerId": 2188,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3087,
    "customerId": 2189,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-21"
  },
  {
    "id": 3088,
    "customerId": 2190,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-10-31"
  },
  {
    "id": 3089,
    "customerId": 2190,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-10-31"
  },
  {
    "id": 3090,
    "customerId": 2191,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-09-10"
  },
  {
    "id": 3091,
    "customerId": 2191,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-10"
  },
  {
    "id": 3092,
    "customerId": 2193,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-01"
  },
  {
    "id": 3093,
    "customerId": 2194,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-17"
  },
  {
    "id": 3094,
    "customerId": 2194,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-17"
  },
  {
    "id": 3095,
    "customerId": 2195,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-14"
  },
  {
    "id": 3096,
    "customerId": 2196,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-31"
  },
  {
    "id": 3097,
    "customerId": 2196,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-31"
  },
  {
    "id": 3098,
    "customerId": 2198,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-03"
  },
  {
    "id": 3099,
    "customerId": 2199,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-11-20"
  },
  {
    "id": 3100,
    "customerId": 2201,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-10-22"
  },
  {
    "id": 3101,
    "customerId": 2202,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-17"
  },
  {
    "id": 3102,
    "customerId": 2204,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-24"
  },
  {
    "id": 3103,
    "customerId": 2205,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-03-24"
  },
  {
    "id": 3104,
    "customerId": 2205,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-24"
  },
  {
    "id": 3105,
    "customerId": 2206,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-14"
  },
  {
    "id": 3106,
    "customerId": 2206,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-14"
  },
  {
    "id": 3107,
    "customerId": 2207,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-27"
  },
  {
    "id": 3108,
    "customerId": 2208,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-19"
  },
  {
    "id": 3109,
    "customerId": 2208,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-19"
  },
  {
    "id": 3110,
    "customerId": 2210,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-16"
  },
  {
    "id": 3111,
    "customerId": 2211,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-02-27"
  },
  {
    "id": 3112,
    "customerId": 2211,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-27"
  },
  {
    "id": 3113,
    "customerId": 2212,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3114,
    "customerId": 2213,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-06-27"
  },
  {
    "id": 3115,
    "customerId": 2213,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-27"
  },
  {
    "id": 3116,
    "customerId": 2214,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-05-05"
  },
  {
    "id": 3117,
    "customerId": 2214,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-05-05"
  },
  {
    "id": 3118,
    "customerId": 2215,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 3119,
    "customerId": 2215,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 3120,
    "customerId": 2218,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2023-02-24"
  },
  {
    "id": 3121,
    "customerId": 2218,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-02-24"
  },
  {
    "id": 3122,
    "customerId": 2218,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-24"
  },
  {
    "id": 3123,
    "customerId": 2219,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-28"
  },
  {
    "id": 3124,
    "customerId": 2220,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-27"
  },
  {
    "id": 3125,
    "customerId": 2221,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-22"
  },
  {
    "id": 3126,
    "customerId": 2222,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-14"
  },
  {
    "id": 3127,
    "customerId": 2223,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-07-08"
  },
  {
    "id": 3128,
    "customerId": 2223,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-08"
  },
  {
    "id": 3129,
    "customerId": 2224,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-23"
  },
  {
    "id": 3130,
    "customerId": 2225,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-28"
  },
  {
    "id": 3131,
    "customerId": 2226,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-07-11"
  },
  {
    "id": 3132,
    "customerId": 2227,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-09-11"
  },
  {
    "id": 3133,
    "customerId": 2228,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-25"
  },
  {
    "id": 3134,
    "customerId": 2229,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-12-02"
  },
  {
    "id": 3135,
    "customerId": 2230,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-25"
  },
  {
    "id": 3136,
    "customerId": 2231,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-28"
  },
  {
    "id": 3137,
    "customerId": 2231,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-28"
  },
  {
    "id": 3138,
    "customerId": 2232,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-05"
  },
  {
    "id": 3139,
    "customerId": 2232,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-05"
  },
  {
    "id": 3140,
    "customerId": 2233,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-06"
  },
  {
    "id": 3141,
    "customerId": 2234,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-11"
  },
  {
    "id": 3142,
    "customerId": 2234,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-11"
  },
  {
    "id": 3143,
    "customerId": 2235,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-04-01"
  },
  {
    "id": 3144,
    "customerId": 2236,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 3145,
    "customerId": 2237,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-27"
  },
  {
    "id": 3146,
    "customerId": 2238,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 3147,
    "customerId": 2238,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 3148,
    "customerId": 2239,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-04-05"
  },
  {
    "id": 3149,
    "customerId": 2240,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-12-18"
  },
  {
    "id": 3150,
    "customerId": 2240,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-18"
  },
  {
    "id": 3151,
    "customerId": 2241,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-03-27"
  },
  {
    "id": 3152,
    "customerId": 2243,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-11"
  },
  {
    "id": 3153,
    "customerId": 2243,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-11"
  },
  {
    "id": 3154,
    "customerId": 2244,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-01"
  },
  {
    "id": 3155,
    "customerId": 2245,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-09-25"
  },
  {
    "id": 3156,
    "customerId": 2245,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-09-25"
  },
  {
    "id": 3157,
    "customerId": 2245,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-09-25"
  },
  {
    "id": 3158,
    "customerId": 2246,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-08"
  },
  {
    "id": 3159,
    "customerId": 2246,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-08"
  },
  {
    "id": 3160,
    "customerId": 2248,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-08-25"
  },
  {
    "id": 3161,
    "customerId": 2248,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-25"
  },
  {
    "id": 3162,
    "customerId": 2249,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-04-11"
  },
  {
    "id": 3163,
    "customerId": 2250,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-03-27"
  },
  {
    "id": 3164,
    "customerId": 2250,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-27"
  },
  {
    "id": 3165,
    "customerId": 2251,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-09-22"
  },
  {
    "id": 3166,
    "customerId": 2251,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-22"
  },
  {
    "id": 3167,
    "customerId": 2252,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-03-20"
  },
  {
    "id": 3168,
    "customerId": 2252,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-20"
  },
  {
    "id": 3169,
    "customerId": 2253,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-10-01"
  },
  {
    "id": 3170,
    "customerId": 2255,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-15"
  },
  {
    "id": 3171,
    "customerId": 2256,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-03-11"
  },
  {
    "id": 3172,
    "customerId": 2257,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-04"
  },
  {
    "id": 3173,
    "customerId": 2258,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-06-02"
  },
  {
    "id": 3174,
    "customerId": 2258,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-02"
  },
  {
    "id": 3175,
    "customerId": 2259,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-31"
  },
  {
    "id": 3176,
    "customerId": 2259,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-31"
  },
  {
    "id": 3177,
    "customerId": 2260,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-12"
  },
  {
    "id": 3178,
    "customerId": 2260,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-12"
  },
  {
    "id": 3179,
    "customerId": 2261,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-10-20"
  },
  {
    "id": 3180,
    "customerId": 2261,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-20"
  },
  {
    "id": 3181,
    "customerId": 2262,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-15"
  },
  {
    "id": 3182,
    "customerId": 2262,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-15"
  },
  {
    "id": 3183,
    "customerId": 2263,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-02-12"
  },
  {
    "id": 3184,
    "customerId": 2263,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-02-12"
  },
  {
    "id": 3185,
    "customerId": 2264,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-03-20"
  },
  {
    "id": 3186,
    "customerId": 2264,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-20"
  },
  {
    "id": 3187,
    "customerId": 2265,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-22"
  },
  {
    "id": 3188,
    "customerId": 2265,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-22"
  },
  {
    "id": 3189,
    "customerId": 2266,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-19"
  },
  {
    "id": 3190,
    "customerId": 2268,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-01-13"
  },
  {
    "id": 3191,
    "customerId": 2268,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-13"
  },
  {
    "id": 3192,
    "customerId": 2269,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-04-24"
  },
  {
    "id": 3193,
    "customerId": 2269,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-04-24"
  },
  {
    "id": 3194,
    "customerId": 2269,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-24"
  },
  {
    "id": 3195,
    "customerId": 2270,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-16"
  },
  {
    "id": 3196,
    "customerId": 2270,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-16"
  },
  {
    "id": 3197,
    "customerId": 2271,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-06-03"
  },
  {
    "id": 3198,
    "customerId": 2271,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-06-03"
  },
  {
    "id": 3199,
    "customerId": 2272,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-20"
  },
  {
    "id": 3200,
    "customerId": 2273,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2011-06-11"
  },
  {
    "id": 3201,
    "customerId": 2273,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-06-11"
  },
  {
    "id": 3202,
    "customerId": 2275,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-26"
  },
  {
    "id": 3203,
    "customerId": 2276,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3204,
    "customerId": 2277,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-19"
  },
  {
    "id": 3205,
    "customerId": 2278,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-07-02"
  },
  {
    "id": 3206,
    "customerId": 2279,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-02"
  },
  {
    "id": 3207,
    "customerId": 2280,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-26"
  },
  {
    "id": 3208,
    "customerId": 2281,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-06"
  },
  {
    "id": 3209,
    "customerId": 2282,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3210,
    "customerId": 2283,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-04"
  },
  {
    "id": 3211,
    "customerId": 2284,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-24"
  },
  {
    "id": 3212,
    "customerId": 2285,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-11-19"
  },
  {
    "id": 3213,
    "customerId": 2286,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-06"
  },
  {
    "id": 3214,
    "customerId": 2287,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3215,
    "customerId": 2288,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-22"
  },
  {
    "id": 3216,
    "customerId": 2289,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-09-08"
  },
  {
    "id": 3217,
    "customerId": 2290,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-04"
  },
  {
    "id": 3218,
    "customerId": 2291,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-12-28"
  },
  {
    "id": 3219,
    "customerId": 2291,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-28"
  },
  {
    "id": 3220,
    "customerId": 2292,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-04"
  },
  {
    "id": 3221,
    "customerId": 2293,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3222,
    "customerId": 2294,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-17"
  },
  {
    "id": 3223,
    "customerId": 2295,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-30"
  },
  {
    "id": 3224,
    "customerId": 2296,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-23"
  },
  {
    "id": 3225,
    "customerId": 2296,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-23"
  },
  {
    "id": 3226,
    "customerId": 2298,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-20"
  },
  {
    "id": 3227,
    "customerId": 2298,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-20"
  },
  {
    "id": 3228,
    "customerId": 2299,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-02-22"
  },
  {
    "id": 3229,
    "customerId": 2299,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-02-22"
  },
  {
    "id": 3230,
    "customerId": 2300,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 3231,
    "customerId": 2300,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 3232,
    "customerId": 2300,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-16"
  },
  {
    "id": 3233,
    "customerId": 2301,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-02-01"
  },
  {
    "id": 3234,
    "customerId": 2302,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-05-05"
  },
  {
    "id": 3235,
    "customerId": 2302,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-05-05"
  },
  {
    "id": 3236,
    "customerId": 2303,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-10-02"
  },
  {
    "id": 3237,
    "customerId": 2303,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-02"
  },
  {
    "id": 3238,
    "customerId": 2304,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-01-11"
  },
  {
    "id": 3239,
    "customerId": 2305,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3240,
    "customerId": 2306,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-21"
  },
  {
    "id": 3241,
    "customerId": 2307,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 3242,
    "customerId": 2307,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-16"
  },
  {
    "id": 3243,
    "customerId": 2308,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-08-28"
  },
  {
    "id": 3244,
    "customerId": 2309,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-09"
  },
  {
    "id": 3245,
    "customerId": 2312,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2012-11-30"
  },
  {
    "id": 3246,
    "customerId": 2312,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2012-11-30"
  },
  {
    "id": 3247,
    "customerId": 2312,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-11-30"
  },
  {
    "id": 3248,
    "customerId": 2313,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-11"
  },
  {
    "id": 3249,
    "customerId": 2313,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2017-03-11"
  },
  {
    "id": 3250,
    "customerId": 2313,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-11"
  },
  {
    "id": 3251,
    "customerId": 2314,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 3252,
    "customerId": 2314,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 3253,
    "customerId": 2314,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-08"
  },
  {
    "id": 3254,
    "customerId": 2315,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-08-27"
  },
  {
    "id": 3255,
    "customerId": 2315,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-08-27"
  },
  {
    "id": 3256,
    "customerId": 2316,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-11"
  },
  {
    "id": 3257,
    "customerId": 2317,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-25"
  },
  {
    "id": 3258,
    "customerId": 2317,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-25"
  },
  {
    "id": 3259,
    "customerId": 2318,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3260,
    "customerId": 2319,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-07-07"
  },
  {
    "id": 3261,
    "customerId": 2319,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-07"
  },
  {
    "id": 3262,
    "customerId": 2320,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-03-12"
  },
  {
    "id": 3263,
    "customerId": 2320,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-12"
  },
  {
    "id": 3264,
    "customerId": 2321,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-12-08"
  },
  {
    "id": 3265,
    "customerId": 2321,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-08"
  },
  {
    "id": 3266,
    "customerId": 2322,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-05-01"
  },
  {
    "id": 3267,
    "customerId": 2322,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-05-01"
  },
  {
    "id": 3268,
    "customerId": 2323,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-03"
  },
  {
    "id": 3269,
    "customerId": 2324,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-06"
  },
  {
    "id": 3270,
    "customerId": 2325,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-25"
  },
  {
    "id": 3271,
    "customerId": 2326,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-07-15"
  },
  {
    "id": 3272,
    "customerId": 2327,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3273,
    "customerId": 2328,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-01-08"
  },
  {
    "id": 3274,
    "customerId": 2328,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-08"
  },
  {
    "id": 3275,
    "customerId": 2328,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-08"
  },
  {
    "id": 3276,
    "customerId": 2329,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-01-21"
  },
  {
    "id": 3277,
    "customerId": 2330,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 3278,
    "customerId": 2331,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-18"
  },
  {
    "id": 3279,
    "customerId": 2331,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-18"
  },
  {
    "id": 3280,
    "customerId": 2332,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-02"
  },
  {
    "id": 3281,
    "customerId": 2333,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-17"
  },
  {
    "id": 3282,
    "customerId": 2334,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-17"
  },
  {
    "id": 3283,
    "customerId": 2335,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-06"
  },
  {
    "id": 3284,
    "customerId": 2335,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-06"
  },
  {
    "id": 3285,
    "customerId": 2336,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3286,
    "customerId": 2337,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-06-14"
  },
  {
    "id": 3287,
    "customerId": 2337,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-06-14"
  },
  {
    "id": 3288,
    "customerId": 2338,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3289,
    "customerId": 2339,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-23"
  },
  {
    "id": 3290,
    "customerId": 2339,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-23"
  },
  {
    "id": 3291,
    "customerId": 2340,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-09-16"
  },
  {
    "id": 3292,
    "customerId": 2340,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-09-16"
  },
  {
    "id": 3293,
    "customerId": 2340,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-09-16"
  },
  {
    "id": 3294,
    "customerId": 2341,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-04-25"
  },
  {
    "id": 3295,
    "customerId": 2342,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-24"
  },
  {
    "id": 3296,
    "customerId": 2342,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-24"
  },
  {
    "id": 3297,
    "customerId": 2343,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-27"
  },
  {
    "id": 3298,
    "customerId": 2344,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-29"
  },
  {
    "id": 3299,
    "customerId": 2344,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-29"
  },
  {
    "id": 3300,
    "customerId": 2345,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3301,
    "customerId": 2346,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-07-12"
  },
  {
    "id": 3302,
    "customerId": 2346,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-12"
  },
  {
    "id": 3303,
    "customerId": 2348,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-27"
  },
  {
    "id": 3304,
    "customerId": 2348,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-27"
  },
  {
    "id": 3305,
    "customerId": 2349,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3306,
    "customerId": 2350,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-12"
  },
  {
    "id": 3307,
    "customerId": 2350,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-12"
  },
  {
    "id": 3308,
    "customerId": 2351,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-24"
  },
  {
    "id": 3309,
    "customerId": 2351,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-24"
  },
  {
    "id": 3310,
    "customerId": 2352,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-02-23"
  },
  {
    "id": 3311,
    "customerId": 2352,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-02-23"
  },
  {
    "id": 3312,
    "customerId": 2353,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 3313,
    "customerId": 2354,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-02-26"
  },
  {
    "id": 3314,
    "customerId": 2354,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-26"
  },
  {
    "id": 3315,
    "customerId": 2355,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-05-16"
  },
  {
    "id": 3316,
    "customerId": 2355,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-16"
  },
  {
    "id": 3317,
    "customerId": 2356,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-01-19"
  },
  {
    "id": 3318,
    "customerId": 2356,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-19"
  },
  {
    "id": 3319,
    "customerId": 2357,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-26"
  },
  {
    "id": 3320,
    "customerId": 2359,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 3321,
    "customerId": 2360,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-04-27"
  },
  {
    "id": 3322,
    "customerId": 2361,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-29"
  },
  {
    "id": 3323,
    "customerId": 2361,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-29"
  },
  {
    "id": 3324,
    "customerId": 2362,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-04-26"
  },
  {
    "id": 3325,
    "customerId": 2363,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-07"
  },
  {
    "id": 3326,
    "customerId": 2364,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-29"
  },
  {
    "id": 3327,
    "customerId": 2365,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-15"
  },
  {
    "id": 3328,
    "customerId": 2365,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-15"
  },
  {
    "id": 3329,
    "customerId": 2366,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-04-10"
  },
  {
    "id": 3330,
    "customerId": 2367,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-04"
  },
  {
    "id": 3331,
    "customerId": 2368,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-05-24"
  },
  {
    "id": 3332,
    "customerId": 2369,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-10-16"
  },
  {
    "id": 3333,
    "customerId": 2369,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-10-16"
  },
  {
    "id": 3334,
    "customerId": 2371,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-30"
  },
  {
    "id": 3335,
    "customerId": 2372,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-01-30"
  },
  {
    "id": 3336,
    "customerId": 2372,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-30"
  },
  {
    "id": 3337,
    "customerId": 2373,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-29"
  },
  {
    "id": 3338,
    "customerId": 2374,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-02-08"
  },
  {
    "id": 3339,
    "customerId": 2375,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-06-03"
  },
  {
    "id": 3340,
    "customerId": 2375,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-06-03"
  },
  {
    "id": 3341,
    "customerId": 2376,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-09"
  },
  {
    "id": 3342,
    "customerId": 2377,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-09-23"
  },
  {
    "id": 3343,
    "customerId": 2378,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3344,
    "customerId": 2379,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-03-19"
  },
  {
    "id": 3345,
    "customerId": 2379,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-19"
  },
  {
    "id": 3346,
    "customerId": 2380,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-30"
  },
  {
    "id": 3347,
    "customerId": 2382,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-04-07"
  },
  {
    "id": 3348,
    "customerId": 2383,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-07-15"
  },
  {
    "id": 3349,
    "customerId": 2384,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-25"
  },
  {
    "id": 3350,
    "customerId": 2385,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-02-25"
  },
  {
    "id": 3351,
    "customerId": 2386,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-03"
  },
  {
    "id": 3352,
    "customerId": 2387,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-04-10"
  },
  {
    "id": 3353,
    "customerId": 2388,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 3354,
    "customerId": 2389,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-27"
  },
  {
    "id": 3355,
    "customerId": 2389,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-27"
  },
  {
    "id": 3356,
    "customerId": 2390,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 3357,
    "customerId": 2390,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-30"
  },
  {
    "id": 3358,
    "customerId": 2391,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 3359,
    "customerId": 2391,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 3360,
    "customerId": 2391,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-24"
  },
  {
    "id": 3361,
    "customerId": 2392,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-09-01"
  },
  {
    "id": 3362,
    "customerId": 2392,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-09-01"
  },
  {
    "id": 3363,
    "customerId": 2393,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3364,
    "customerId": 2394,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-03-30"
  },
  {
    "id": 3365,
    "customerId": 2396,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-04-15"
  },
  {
    "id": 3366,
    "customerId": 2397,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-06-18"
  },
  {
    "id": 3367,
    "customerId": 2397,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-18"
  },
  {
    "id": 3368,
    "customerId": 2398,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-05"
  },
  {
    "id": 3369,
    "customerId": 2398,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-05"
  },
  {
    "id": 3370,
    "customerId": 2399,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-15"
  },
  {
    "id": 3371,
    "customerId": 2399,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-15"
  },
  {
    "id": 3372,
    "customerId": 2399,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-15"
  },
  {
    "id": 3373,
    "customerId": 2400,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-15"
  },
  {
    "id": 3374,
    "customerId": 2400,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-15"
  },
  {
    "id": 3375,
    "customerId": 2401,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-03-11"
  },
  {
    "id": 3376,
    "customerId": 2401,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-11"
  },
  {
    "id": 3377,
    "customerId": 2402,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-09-15"
  },
  {
    "id": 3378,
    "customerId": 2403,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3379,
    "customerId": 2404,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-15"
  },
  {
    "id": 3380,
    "customerId": 2405,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-23"
  },
  {
    "id": 3381,
    "customerId": 2405,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-23"
  },
  {
    "id": 3382,
    "customerId": 2406,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-13"
  },
  {
    "id": 3383,
    "customerId": 2406,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-13"
  },
  {
    "id": 3384,
    "customerId": 2407,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-12-20"
  },
  {
    "id": 3385,
    "customerId": 2407,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-20"
  },
  {
    "id": 3386,
    "customerId": 2408,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-17"
  },
  {
    "id": 3387,
    "customerId": 2409,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-03-27"
  },
  {
    "id": 3388,
    "customerId": 2410,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-10-25"
  },
  {
    "id": 3389,
    "customerId": 2411,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-11-29"
  },
  {
    "id": 3390,
    "customerId": 2412,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3391,
    "customerId": 2413,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-15"
  },
  {
    "id": 3392,
    "customerId": 2414,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-01"
  },
  {
    "id": 3393,
    "customerId": 2415,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-09"
  },
  {
    "id": 3394,
    "customerId": 2416,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3395,
    "customerId": 2417,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-11"
  },
  {
    "id": 3396,
    "customerId": 2418,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-06-22"
  },
  {
    "id": 3397,
    "customerId": 2418,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-22"
  },
  {
    "id": 3398,
    "customerId": 2419,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3399,
    "customerId": 2420,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-10"
  },
  {
    "id": 3400,
    "customerId": 2420,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-10"
  },
  {
    "id": 3401,
    "customerId": 2421,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-04-08"
  },
  {
    "id": 3402,
    "customerId": 2421,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-04-08"
  },
  {
    "id": 3403,
    "customerId": 2422,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3404,
    "customerId": 2424,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-06"
  },
  {
    "id": 3405,
    "customerId": 2424,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-06"
  },
  {
    "id": 3406,
    "customerId": 2425,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3407,
    "customerId": 2426,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-02-08"
  },
  {
    "id": 3408,
    "customerId": 2426,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-02-08"
  },
  {
    "id": 3409,
    "customerId": 2427,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 3410,
    "customerId": 2427,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 3411,
    "customerId": 2427,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 3412,
    "customerId": 2428,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-04-17"
  },
  {
    "id": 3413,
    "customerId": 2429,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-10"
  },
  {
    "id": 3414,
    "customerId": 2430,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-07-23"
  },
  {
    "id": 3415,
    "customerId": 2430,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-07-23"
  },
  {
    "id": 3416,
    "customerId": 2431,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-01-25"
  },
  {
    "id": 3417,
    "customerId": 2431,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-01-25"
  },
  {
    "id": 3418,
    "customerId": 2433,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 3419,
    "customerId": 2433,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-19"
  },
  {
    "id": 3420,
    "customerId": 2434,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-09-17"
  },
  {
    "id": 3421,
    "customerId": 2435,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-14"
  },
  {
    "id": 3422,
    "customerId": 2435,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-14"
  },
  {
    "id": 3423,
    "customerId": 2436,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-11"
  },
  {
    "id": 3424,
    "customerId": 2436,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-11"
  },
  {
    "id": 3425,
    "customerId": 2437,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-03"
  },
  {
    "id": 3426,
    "customerId": 2437,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-03"
  },
  {
    "id": 3427,
    "customerId": 2438,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-12-23"
  },
  {
    "id": 3428,
    "customerId": 2438,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-12-23"
  },
  {
    "id": 3429,
    "customerId": 2438,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-12-23"
  },
  {
    "id": 3430,
    "customerId": 2439,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-05-13"
  },
  {
    "id": 3431,
    "customerId": 2439,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-05-13"
  },
  {
    "id": 3432,
    "customerId": 2440,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-11-07"
  },
  {
    "id": 3433,
    "customerId": 2440,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-11-07"
  },
  {
    "id": 3434,
    "customerId": 2441,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 3435,
    "customerId": 2441,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 3436,
    "customerId": 2441,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-25"
  },
  {
    "id": 3437,
    "customerId": 2442,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-02"
  },
  {
    "id": 3438,
    "customerId": 2442,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-02"
  },
  {
    "id": 3439,
    "customerId": 2443,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-08-25"
  },
  {
    "id": 3440,
    "customerId": 2443,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-08-25"
  },
  {
    "id": 3441,
    "customerId": 2444,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-11-12"
  },
  {
    "id": 3442,
    "customerId": 2444,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-12"
  },
  {
    "id": 3443,
    "customerId": 2445,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-17"
  },
  {
    "id": 3444,
    "customerId": 2445,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-17"
  },
  {
    "id": 3445,
    "customerId": 2447,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-08"
  },
  {
    "id": 3446,
    "customerId": 2447,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-08"
  },
  {
    "id": 3447,
    "customerId": 2449,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-02-02"
  },
  {
    "id": 3448,
    "customerId": 2449,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-02-02"
  },
  {
    "id": 3449,
    "customerId": 2450,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-10-27"
  },
  {
    "id": 3450,
    "customerId": 2450,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-10-27"
  },
  {
    "id": 3451,
    "customerId": 2452,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-10-01"
  },
  {
    "id": 3452,
    "customerId": 2452,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-10-01"
  },
  {
    "id": 3453,
    "customerId": 2452,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-01"
  },
  {
    "id": 3454,
    "customerId": 2453,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-09-17"
  },
  {
    "id": 3455,
    "customerId": 2453,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-09-17"
  },
  {
    "id": 3456,
    "customerId": 2454,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-02"
  },
  {
    "id": 3457,
    "customerId": 2454,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-02"
  },
  {
    "id": 3458,
    "customerId": 2455,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-24"
  },
  {
    "id": 3459,
    "customerId": 2455,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-24"
  },
  {
    "id": 3460,
    "customerId": 2456,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-20"
  },
  {
    "id": 3461,
    "customerId": 2456,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-20"
  },
  {
    "id": 3462,
    "customerId": 2457,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-01"
  },
  {
    "id": 3463,
    "customerId": 2458,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-06-05"
  },
  {
    "id": 3464,
    "customerId": 2458,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-05"
  },
  {
    "id": 3465,
    "customerId": 2459,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-04-22"
  },
  {
    "id": 3466,
    "customerId": 2459,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-04-22"
  },
  {
    "id": 3467,
    "customerId": 2460,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-02"
  },
  {
    "id": 3468,
    "customerId": 2460,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-02"
  },
  {
    "id": 3469,
    "customerId": 2461,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-12-28"
  },
  {
    "id": 3470,
    "customerId": 2461,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-28"
  },
  {
    "id": 3471,
    "customerId": 2462,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-10-28"
  },
  {
    "id": 3472,
    "customerId": 2463,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-06-09"
  },
  {
    "id": 3473,
    "customerId": 2463,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-06-09"
  },
  {
    "id": 3474,
    "customerId": 2464,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-07-26"
  },
  {
    "id": 3475,
    "customerId": 2464,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-07-26"
  },
  {
    "id": 3476,
    "customerId": 2466,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-22"
  },
  {
    "id": 3477,
    "customerId": 2466,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-22"
  },
  {
    "id": 3478,
    "customerId": 2467,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-12"
  },
  {
    "id": 3479,
    "customerId": 2467,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-12"
  },
  {
    "id": 3480,
    "customerId": 2468,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-16"
  },
  {
    "id": 3481,
    "customerId": 2468,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-16"
  },
  {
    "id": 3482,
    "customerId": 2469,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-12-30"
  },
  {
    "id": 3483,
    "customerId": 2469,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-30"
  },
  {
    "id": 3484,
    "customerId": 2469,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-30"
  },
  {
    "id": 3485,
    "customerId": 2470,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-20"
  },
  {
    "id": 3486,
    "customerId": 2470,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-20"
  },
  {
    "id": 3487,
    "customerId": 2471,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-07-01"
  },
  {
    "id": 3488,
    "customerId": 2471,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-07-01"
  },
  {
    "id": 3489,
    "customerId": 2472,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-15"
  },
  {
    "id": 3490,
    "customerId": 2472,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-11-15"
  },
  {
    "id": 3491,
    "customerId": 2473,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-15"
  },
  {
    "id": 3492,
    "customerId": 2474,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-03-18"
  },
  {
    "id": 3493,
    "customerId": 2474,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-18"
  },
  {
    "id": 3494,
    "customerId": 2476,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-04-16"
  },
  {
    "id": 3495,
    "customerId": 2476,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-16"
  },
  {
    "id": 3496,
    "customerId": 2477,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-14"
  },
  {
    "id": 3497,
    "customerId": 2477,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-14"
  },
  {
    "id": 3498,
    "customerId": 2479,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-17"
  },
  {
    "id": 3499,
    "customerId": 2480,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-01-17"
  },
  {
    "id": 3500,
    "customerId": 2480,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-01-17"
  },
  {
    "id": 3501,
    "customerId": 2481,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-07-14"
  },
  {
    "id": 3502,
    "customerId": 2481,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-07-14"
  },
  {
    "id": 3503,
    "customerId": 2482,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-22"
  },
  {
    "id": 3504,
    "customerId": 2483,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-09-11"
  },
  {
    "id": 3505,
    "customerId": 2483,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-11"
  },
  {
    "id": 3506,
    "customerId": 2484,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-07"
  },
  {
    "id": 3507,
    "customerId": 2485,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 3508,
    "customerId": 2485,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-15"
  },
  {
    "id": 3509,
    "customerId": 2487,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-02-20"
  },
  {
    "id": 3510,
    "customerId": 2487,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-20"
  },
  {
    "id": 3511,
    "customerId": 2488,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-06-07"
  },
  {
    "id": 3512,
    "customerId": 2488,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-07"
  },
  {
    "id": 3513,
    "customerId": 2489,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-08-05"
  },
  {
    "id": 3514,
    "customerId": 2489,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-08-05"
  },
  {
    "id": 3515,
    "customerId": 2490,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-30"
  },
  {
    "id": 3516,
    "customerId": 2490,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-30"
  },
  {
    "id": 3517,
    "customerId": 2491,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-08-01"
  },
  {
    "id": 3518,
    "customerId": 2491,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-08-01"
  },
  {
    "id": 3519,
    "customerId": 2492,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-06-21"
  },
  {
    "id": 3520,
    "customerId": 2492,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-06-21"
  },
  {
    "id": 3521,
    "customerId": 2493,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-04-17"
  },
  {
    "id": 3522,
    "customerId": 2493,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-17"
  },
  {
    "id": 3523,
    "customerId": 2494,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-09-10"
  },
  {
    "id": 3524,
    "customerId": 2494,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-09-10"
  },
  {
    "id": 3525,
    "customerId": 2495,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2024-12-12"
  },
  {
    "id": 3526,
    "customerId": 2495,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-12"
  },
  {
    "id": 3527,
    "customerId": 2496,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-10-02"
  },
  {
    "id": 3528,
    "customerId": 2497,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-11-11"
  },
  {
    "id": 3529,
    "customerId": 2498,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-27"
  },
  {
    "id": 3530,
    "customerId": 2499,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-11-30"
  },
  {
    "id": 3531,
    "customerId": 2499,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-11-30"
  },
  {
    "id": 3532,
    "customerId": 2502,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-11-01"
  },
  {
    "id": 3533,
    "customerId": 2502,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-01"
  },
  {
    "id": 3534,
    "customerId": 2502,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-01"
  },
  {
    "id": 3535,
    "customerId": 2503,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-08-10"
  },
  {
    "id": 3536,
    "customerId": 2504,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2022-12-17"
  },
  {
    "id": 3537,
    "customerId": 2504,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-12-17"
  },
  {
    "id": 3538,
    "customerId": 2504,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-12-17"
  },
  {
    "id": 3539,
    "customerId": 2505,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3540,
    "customerId": 2507,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-02-24"
  },
  {
    "id": 3541,
    "customerId": 2507,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-02-24"
  },
  {
    "id": 3542,
    "customerId": 2508,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-05-18"
  },
  {
    "id": 3543,
    "customerId": 2508,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-05-18"
  },
  {
    "id": 3544,
    "customerId": 2509,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-03-13"
  },
  {
    "id": 3545,
    "customerId": 2510,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-16"
  },
  {
    "id": 3546,
    "customerId": 2511,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-18"
  },
  {
    "id": 3547,
    "customerId": 2511,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-18"
  },
  {
    "id": 3548,
    "customerId": 2512,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-16"
  },
  {
    "id": 3549,
    "customerId": 2513,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3550,
    "customerId": 2514,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-04-11"
  },
  {
    "id": 3551,
    "customerId": 2514,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-11"
  },
  {
    "id": 3552,
    "customerId": 2515,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-05-27"
  },
  {
    "id": 3553,
    "customerId": 2515,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-27"
  },
  {
    "id": 3554,
    "customerId": 2516,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-10"
  },
  {
    "id": 3555,
    "customerId": 2516,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-10"
  },
  {
    "id": 3556,
    "customerId": 2517,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-03-07"
  },
  {
    "id": 3557,
    "customerId": 2518,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-11-27"
  },
  {
    "id": 3558,
    "customerId": 2518,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-27"
  },
  {
    "id": 3559,
    "customerId": 2519,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-23"
  },
  {
    "id": 3560,
    "customerId": 2519,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-23"
  },
  {
    "id": 3561,
    "customerId": 2520,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-07-30"
  },
  {
    "id": 3562,
    "customerId": 2521,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-05-07"
  },
  {
    "id": 3563,
    "customerId": 2522,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-23"
  },
  {
    "id": 3564,
    "customerId": 2523,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-09-03"
  },
  {
    "id": 3565,
    "customerId": 2523,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-09-03"
  },
  {
    "id": 3566,
    "customerId": 2524,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-14"
  },
  {
    "id": 3567,
    "customerId": 2525,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-14"
  },
  {
    "id": 3568,
    "customerId": 2526,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-05-21"
  },
  {
    "id": 3569,
    "customerId": 2527,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-02"
  },
  {
    "id": 3570,
    "customerId": 2527,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-02"
  },
  {
    "id": 3571,
    "customerId": 2528,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-15"
  },
  {
    "id": 3572,
    "customerId": 2529,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-10-15"
  },
  {
    "id": 3573,
    "customerId": 2530,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2012-04-27"
  },
  {
    "id": 3574,
    "customerId": 2531,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-02-25"
  },
  {
    "id": 3575,
    "customerId": 2532,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-18"
  },
  {
    "id": 3576,
    "customerId": 2533,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-13"
  },
  {
    "id": 3577,
    "customerId": 2534,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-11-25"
  },
  {
    "id": 3578,
    "customerId": 2534,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-11-25"
  },
  {
    "id": 3579,
    "customerId": 2535,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 3580,
    "customerId": 2535,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-31"
  },
  {
    "id": 3581,
    "customerId": 2536,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-08-28"
  },
  {
    "id": 3582,
    "customerId": 2537,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 3583,
    "customerId": 2537,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 3584,
    "customerId": 2537,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-17"
  },
  {
    "id": 3585,
    "customerId": 2538,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-03-14"
  },
  {
    "id": 3586,
    "customerId": 2538,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-14"
  },
  {
    "id": 3587,
    "customerId": 2539,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-07-28"
  },
  {
    "id": 3588,
    "customerId": 2539,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-07-28"
  },
  {
    "id": 3589,
    "customerId": 2540,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-10-12"
  },
  {
    "id": 3590,
    "customerId": 2540,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-10-12"
  },
  {
    "id": 3591,
    "customerId": 2541,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-04-02"
  },
  {
    "id": 3592,
    "customerId": 2542,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-03-02"
  },
  {
    "id": 3593,
    "customerId": 2542,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-02"
  },
  {
    "id": 3594,
    "customerId": 2543,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-07-06"
  },
  {
    "id": 3595,
    "customerId": 2543,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-07-06"
  },
  {
    "id": 3596,
    "customerId": 2544,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-10-07"
  },
  {
    "id": 3597,
    "customerId": 2544,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-10-07"
  },
  {
    "id": 3598,
    "customerId": 2545,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-11-27"
  },
  {
    "id": 3599,
    "customerId": 2546,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3600,
    "customerId": 2548,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3601,
    "customerId": 2549,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 3602,
    "customerId": 2549,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-01"
  },
  {
    "id": 3603,
    "customerId": 2550,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2025-04-07"
  },
  {
    "id": 3604,
    "customerId": 2550,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-04-07"
  },
  {
    "id": 3605,
    "customerId": 2552,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-29"
  },
  {
    "id": 3606,
    "customerId": 2553,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-04-26"
  },
  {
    "id": 3607,
    "customerId": 2554,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-29"
  },
  {
    "id": 3608,
    "customerId": 2555,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-03"
  },
  {
    "id": 3609,
    "customerId": 2556,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-29"
  },
  {
    "id": 3610,
    "customerId": 2557,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-12-21"
  },
  {
    "id": 3611,
    "customerId": 2558,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-04"
  },
  {
    "id": 3612,
    "customerId": 2559,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-12"
  },
  {
    "id": 3613,
    "customerId": 2560,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-17"
  },
  {
    "id": 3614,
    "customerId": 2560,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-17"
  },
  {
    "id": 3615,
    "customerId": 2561,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-06-05"
  },
  {
    "id": 3616,
    "customerId": 2561,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-05"
  },
  {
    "id": 3617,
    "customerId": 2562,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-02-14"
  },
  {
    "id": 3618,
    "customerId": 2562,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-14"
  },
  {
    "id": 3619,
    "customerId": 2562,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-14"
  },
  {
    "id": 3620,
    "customerId": 2564,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-05-10"
  },
  {
    "id": 3621,
    "customerId": 2564,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-10"
  },
  {
    "id": 3622,
    "customerId": 2565,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-14"
  },
  {
    "id": 3623,
    "customerId": 2565,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-14"
  },
  {
    "id": 3624,
    "customerId": 2566,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2023-12-14"
  },
  {
    "id": 3625,
    "customerId": 2566,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-14"
  },
  {
    "id": 3626,
    "customerId": 2567,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-25"
  },
  {
    "id": 3627,
    "customerId": 2567,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-25"
  },
  {
    "id": 3628,
    "customerId": 2568,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-02-19"
  },
  {
    "id": 3629,
    "customerId": 2569,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-06-04"
  },
  {
    "id": 3630,
    "customerId": 2569,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-06-04"
  },
  {
    "id": 3631,
    "customerId": 2570,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-06-15"
  },
  {
    "id": 3632,
    "customerId": 2571,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-01-16"
  },
  {
    "id": 3633,
    "customerId": 2571,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-16"
  },
  {
    "id": 3634,
    "customerId": 2572,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-19"
  },
  {
    "id": 3635,
    "customerId": 2572,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-01-19"
  },
  {
    "id": 3636,
    "customerId": 2573,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-11-30"
  },
  {
    "id": 3637,
    "customerId": 2573,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-30"
  },
  {
    "id": 3638,
    "customerId": 2574,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-05-23"
  },
  {
    "id": 3639,
    "customerId": 2574,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-05-23"
  },
  {
    "id": 3640,
    "customerId": 2575,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-03-01"
  },
  {
    "id": 3641,
    "customerId": 2575,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-03-01"
  },
  {
    "id": 3642,
    "customerId": 2576,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-20"
  },
  {
    "id": 3643,
    "customerId": 2576,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-20"
  },
  {
    "id": 3644,
    "customerId": 2577,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-12-01"
  },
  {
    "id": 3645,
    "customerId": 2578,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3646,
    "customerId": 2579,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-15"
  },
  {
    "id": 3647,
    "customerId": 2580,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3648,
    "customerId": 2582,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-06-15"
  },
  {
    "id": 3649,
    "customerId": 2583,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-07-26"
  },
  {
    "id": 3650,
    "customerId": 2584,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-05-30"
  },
  {
    "id": 3651,
    "customerId": 2585,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-14"
  },
  {
    "id": 3652,
    "customerId": 2585,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-14"
  },
  {
    "id": 3653,
    "customerId": 2586,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-12-24"
  },
  {
    "id": 3654,
    "customerId": 2586,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-24"
  },
  {
    "id": 3655,
    "customerId": 2587,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-09-21"
  },
  {
    "id": 3656,
    "customerId": 2587,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-09-21"
  },
  {
    "id": 3657,
    "customerId": 2588,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-10-19"
  },
  {
    "id": 3658,
    "customerId": 2588,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-19"
  },
  {
    "id": 3659,
    "customerId": 2589,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3660,
    "customerId": 2590,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-03-12"
  },
  {
    "id": 3661,
    "customerId": 2594,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 3662,
    "customerId": 2594,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-22"
  },
  {
    "id": 3663,
    "customerId": 2595,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3664,
    "customerId": 2596,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3665,
    "customerId": 2598,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-01-18"
  },
  {
    "id": 3666,
    "customerId": 2598,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-01-18"
  },
  {
    "id": 3667,
    "customerId": 2598,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-18"
  },
  {
    "id": 3668,
    "customerId": 2599,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2026-06-07"
  },
  {
    "id": 3669,
    "customerId": 2599,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-06-07"
  },
  {
    "id": 3670,
    "customerId": 2600,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-11"
  },
  {
    "id": 3671,
    "customerId": 2600,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-11"
  },
  {
    "id": 3672,
    "customerId": 2600,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-11"
  },
  {
    "id": 3673,
    "customerId": 2601,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-29"
  },
  {
    "id": 3674,
    "customerId": 2603,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-07-31"
  },
  {
    "id": 3675,
    "customerId": 2603,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-07-31"
  },
  {
    "id": 3676,
    "customerId": 2604,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-04-30"
  },
  {
    "id": 3677,
    "customerId": 2605,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3678,
    "customerId": 2606,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-09-17"
  },
  {
    "id": 3679,
    "customerId": 2607,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-06-14"
  },
  {
    "id": 3680,
    "customerId": 2608,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3681,
    "customerId": 2609,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2013-02-25"
  },
  {
    "id": 3682,
    "customerId": 2610,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3683,
    "customerId": 2611,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-04-10"
  },
  {
    "id": 3684,
    "customerId": 2612,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-11-30"
  },
  {
    "id": 3685,
    "customerId": 2613,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3686,
    "customerId": 2615,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3687,
    "customerId": 2616,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-07-14"
  },
  {
    "id": 3688,
    "customerId": 2616,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-07-14"
  },
  {
    "id": 3689,
    "customerId": 2617,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-04-02"
  },
  {
    "id": 3690,
    "customerId": 2617,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-02"
  },
  {
    "id": 3691,
    "customerId": 2617,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-02"
  },
  {
    "id": 3692,
    "customerId": 2618,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-08-14"
  },
  {
    "id": 3693,
    "customerId": 2619,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-04-04"
  },
  {
    "id": 3694,
    "customerId": 2620,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3695,
    "customerId": 2621,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-06-07"
  },
  {
    "id": 3696,
    "customerId": 2622,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-03-07"
  },
  {
    "id": 3697,
    "customerId": 2622,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-03-07"
  },
  {
    "id": 3698,
    "customerId": 2623,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-12-08"
  },
  {
    "id": 3699,
    "customerId": 2624,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-07-01"
  },
  {
    "id": 3700,
    "customerId": 2624,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-07-01"
  },
  {
    "id": 3701,
    "customerId": 2625,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-04-14"
  },
  {
    "id": 3702,
    "customerId": 2626,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-03-30"
  },
  {
    "id": 3703,
    "customerId": 2626,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-03-30"
  },
  {
    "id": 3704,
    "customerId": 2627,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2022-01-27"
  },
  {
    "id": 3705,
    "customerId": 2627,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-27"
  },
  {
    "id": 3706,
    "customerId": 2628,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-02-23"
  },
  {
    "id": 3707,
    "customerId": 2628,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-02-23"
  },
  {
    "id": 3708,
    "customerId": 2629,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-11"
  },
  {
    "id": 3709,
    "customerId": 2630,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-10-20"
  },
  {
    "id": 3710,
    "customerId": 2630,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-10-20"
  },
  {
    "id": 3711,
    "customerId": 2631,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-11-30"
  },
  {
    "id": 3712,
    "customerId": 2632,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-11-07"
  },
  {
    "id": 3713,
    "customerId": 2632,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-11-07"
  },
  {
    "id": 3714,
    "customerId": 2633,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2021-08-19"
  },
  {
    "id": 3715,
    "customerId": 2633,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-08-19"
  },
  {
    "id": 3716,
    "customerId": 2633,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-08-19"
  },
  {
    "id": 3717,
    "customerId": 2634,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-01-16"
  },
  {
    "id": 3718,
    "customerId": 2634,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-16"
  },
  {
    "id": 3719,
    "customerId": 2636,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-08-03"
  },
  {
    "id": 3720,
    "customerId": 2636,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-08-03"
  },
  {
    "id": 3721,
    "customerId": 2637,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3722,
    "customerId": 2638,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2023-09-19"
  },
  {
    "id": 3723,
    "customerId": 2638,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-09-19"
  },
  {
    "id": 3724,
    "customerId": 2639,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-02-26"
  },
  {
    "id": 3725,
    "customerId": 2640,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-01-25"
  },
  {
    "id": 3726,
    "customerId": 2640,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-01-25"
  },
  {
    "id": 3727,
    "customerId": 2641,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-09"
  },
  {
    "id": 3728,
    "customerId": 2642,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-01-03"
  },
  {
    "id": 3729,
    "customerId": 2643,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3730,
    "customerId": 2644,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-12-06"
  },
  {
    "id": 3731,
    "customerId": 2644,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-06"
  },
  {
    "id": 3732,
    "customerId": 2645,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-11-29"
  },
  {
    "id": 3733,
    "customerId": 2645,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-11-29"
  },
  {
    "id": 3734,
    "customerId": 2646,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-03-04"
  },
  {
    "id": 3735,
    "customerId": 2646,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-03-04"
  },
  {
    "id": 3736,
    "customerId": 2647,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2022-01-01"
  },
  {
    "id": 3737,
    "customerId": 2647,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2022-01-01"
  },
  {
    "id": 3738,
    "customerId": 2648,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2021-10-15"
  },
  {
    "id": 3739,
    "customerId": 2648,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-10-15"
  },
  {
    "id": 3740,
    "customerId": 2650,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-02-19"
  },
  {
    "id": 3741,
    "customerId": 2651,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-07-16"
  },
  {
    "id": 3742,
    "customerId": 2652,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-16"
  },
  {
    "id": 3743,
    "customerId": 2652,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-16"
  },
  {
    "id": 3744,
    "customerId": 2653,
    "sourceType": "retail",
    "sourceName": "Faire",
    "firstSeenOn": "2026-04-16"
  },
  {
    "id": 3745,
    "customerId": 2653,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-04-16"
  },
  {
    "id": 3746,
    "customerId": 2654,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-12-25"
  },
  {
    "id": 3747,
    "customerId": 2654,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-12-25"
  },
  {
    "id": 3748,
    "customerId": 2655,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3749,
    "customerId": 2656,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-12-27"
  },
  {
    "id": 3750,
    "customerId": 2656,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-12-27"
  },
  {
    "id": 3751,
    "customerId": 2657,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3752,
    "customerId": 2658,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-06-07"
  },
  {
    "id": 3753,
    "customerId": 2659,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3754,
    "customerId": 2660,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-04-19"
  },
  {
    "id": 3755,
    "customerId": 2661,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-01-06"
  },
  {
    "id": 3756,
    "customerId": 2662,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-03-30"
  },
  {
    "id": 3757,
    "customerId": 2662,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-03-30"
  },
  {
    "id": 3758,
    "customerId": 2663,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2021-06-25"
  },
  {
    "id": 3759,
    "customerId": 2664,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2018-12-10"
  },
  {
    "id": 3760,
    "customerId": 2664,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-10"
  },
  {
    "id": 3761,
    "customerId": 2664,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-10"
  },
  {
    "id": 3762,
    "customerId": 2665,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2019-11-15"
  },
  {
    "id": 3763,
    "customerId": 2665,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2019-11-15"
  },
  {
    "id": 3764,
    "customerId": 2665,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-11-15"
  },
  {
    "id": 3765,
    "customerId": 2666,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2024-10-26"
  },
  {
    "id": 3766,
    "customerId": 2666,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2024-10-26"
  },
  {
    "id": 3767,
    "customerId": 2667,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-04-21"
  },
  {
    "id": 3768,
    "customerId": 2667,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-04-21"
  },
  {
    "id": 3769,
    "customerId": 2668,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3770,
    "customerId": 2669,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-03-26"
  },
  {
    "id": 3771,
    "customerId": 2669,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-03-26"
  },
  {
    "id": 3772,
    "customerId": 2670,
    "sourceType": "online_learning",
    "sourceName": "Teachable",
    "firstSeenOn": "2020-08-22"
  },
  {
    "id": 3773,
    "customerId": 2670,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-22"
  },
  {
    "id": 3774,
    "customerId": 2670,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-22"
  },
  {
    "id": 3775,
    "customerId": 2671,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-12-26"
  },
  {
    "id": 3776,
    "customerId": 2671,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-12-26"
  },
  {
    "id": 3777,
    "customerId": 2672,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-08-14"
  },
  {
    "id": 3778,
    "customerId": 2673,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-09-06"
  },
  {
    "id": 3779,
    "customerId": 2674,
    "sourceType": "website",
    "sourceName": "Etsy",
    "firstSeenOn": "2026-05-17"
  },
  {
    "id": 3780,
    "customerId": 2674,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-05-17"
  },
  {
    "id": 3781,
    "customerId": 2675,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3782,
    "customerId": 2676,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2025-03-10"
  },
  {
    "id": 3783,
    "customerId": 2677,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2025-11-17"
  },
  {
    "id": 3784,
    "customerId": 2678,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2020-08-27"
  },
  {
    "id": 3785,
    "customerId": 2678,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-08-27"
  },
  {
    "id": 3786,
    "customerId": 2679,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3787,
    "customerId": 2680,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-05"
  },
  {
    "id": 3788,
    "customerId": 2681,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2014-04-29"
  },
  {
    "id": 3789,
    "customerId": 2682,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-12-22"
  },
  {
    "id": 3790,
    "customerId": 2683,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2018-11-03"
  },
  {
    "id": 3791,
    "customerId": 2683,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2018-11-03"
  },
  {
    "id": 3792,
    "customerId": 2684,
    "sourceType": "website",
    "sourceName": "SquareSpace",
    "firstSeenOn": "2017-11-12"
  },
  {
    "id": 3793,
    "customerId": 2684,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2017-11-12"
  },
  {
    "id": 3794,
    "customerId": 2685,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2019-08-20"
  },
  {
    "id": 3795,
    "customerId": 2686,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  },
  {
    "id": 3796,
    "customerId": 2687,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2011-02-24"
  },
  {
    "id": 3797,
    "customerId": 2688,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-27"
  },
  {
    "id": 3798,
    "customerId": 2689,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2023-03-15"
  },
  {
    "id": 3799,
    "customerId": 2690,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2026-01-11"
  },
  {
    "id": 3800,
    "customerId": 2691,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2020-01-30"
  },
  {
    "id": 3801,
    "customerId": 2692,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2015-08-19"
  },
  {
    "id": 3802,
    "customerId": 2693,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2016-03-22"
  },
  {
    "id": 3803,
    "customerId": 2694,
    "sourceType": "software",
    "sourceName": "QuickBooks Online",
    "firstSeenOn": "2010-05-27"
  }
] )
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'CustomerSources', null, {} )
  }
}
