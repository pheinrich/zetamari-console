'use strict'

// Seeds LiveClass from the "Zetamari Students - Attendance" spreadsheet's
// Attendance tab (1,636 usable rows spanning 2009-2026). One LiveClass per
// distinct Class Date in the sheet, per Angie's instruction to group by
// date - note this means a multi-day event logged under more than one
// Class Date (e.g. the October 2024 Mandala Retreat, spread across four
// consecutive days) becomes that many separate LiveClass rows rather than
// one row with a startDate/endDate span; merge them by hand if a single
// multi-day record is preferred.
//
// name: the sheet's "Class Type" text for that date, taking the single
// most common value when a date has more than one (ties broken by
// whichever appeared first in the source rows) - per instruction, copied
// directly rather than reformatted.
//
// locationName/locationAddress: resolved from keywords in the class
// name(s) on that date, per Angie's mapping:
//   Orlando / LMA          -> Luna Mosaic Arts, 813 Virginia Dr, Orlando, FL 32803
//   Deer Island / Portland  -> 64535 Columbia River Hwy, Deer Island, OR 97054
//   (also October 2024 retreats specifically, regardless of name)
//   Oakland / Berkeley      -> 2020 Dennison Street, Oakland, CA (2025+)
//                              805 Allston Way, Berkeley, CA 94710 (earlier)
//   Spokane                 -> 823 N Crestline St, Spokane, WA 99202
//   Santa Barbara           -> 4223 State St, Santa Barbara, CA 93105
//   Austin (2019)           -> The Commune Annex, 5212 Avenue F, Austin, TX 78751
//   SMA (not Santa Barbara) -> Seattle Mosaic Arts, 1325 N 46th St, Seattle, WA 98103
//   everything else         -> 503 N 62nd St, Seattle, WA 98103 (the studio)
// Every date resolved to exactly one consistent address across all of
// that date's class-name variants - none needed the ambiguous-match
// fallback (which would otherwise default to the studio address with a
// review note).
//
// locationType is 'in_person' throughout - no class name in this sheet
// indicated an online/Zoom session.
//
// cost is deliberately left unset on every row, per instruction - Angie
// will fill in class pricing herself later. endDate is also left unset
// (the sheet has no distinct end date per class).
module.exports =
{
  async up( queryInterface, Sequelize )
  {
    return queryInterface.bulkInsert( 'LiveClasses', [
  {
    "id": 1,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2009-11-07"
  },
  {
    "id": 2,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2009-12-26"
  },
  {
    "id": 3,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-01-16"
  },
  {
    "id": 4,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-02-06"
  },
  {
    "id": 5,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-03-13"
  },
  {
    "id": 6,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-03-27"
  },
  {
    "id": 7,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-04-10"
  },
  {
    "id": 8,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-05-01"
  },
  {
    "id": 9,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-05-22"
  },
  {
    "id": 10,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-06-26"
  },
  {
    "id": 11,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-08-28"
  },
  {
    "id": 12,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-09-25"
  },
  {
    "id": 13,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-10-09"
  },
  {
    "id": 14,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-10-23"
  },
  {
    "id": 15,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-11-20"
  },
  {
    "id": 16,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-12-11"
  },
  {
    "id": 17,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-01-29"
  },
  {
    "id": 18,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-02-05"
  },
  {
    "id": 19,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-02-26"
  },
  {
    "id": 20,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-03-12"
  },
  {
    "id": 21,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-03-26"
  },
  {
    "id": 22,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-04-09"
  },
  {
    "id": 23,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-04-30"
  },
  {
    "id": 24,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-05-14"
  },
  {
    "id": 25,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-06-11"
  },
  {
    "id": 26,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-08-27"
  },
  {
    "id": 27,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-09-17"
  },
  {
    "id": 28,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-10-01"
  },
  {
    "id": 29,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-10-15"
  },
  {
    "id": 30,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-11-11"
  },
  {
    "id": 31,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-11-12"
  },
  {
    "id": 32,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-02-11"
  },
  {
    "id": 33,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-03-03"
  },
  {
    "id": 34,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-03-24"
  },
  {
    "id": 35,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-04-14"
  },
  {
    "id": 36,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-05-19"
  },
  {
    "id": 37,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-09-22"
  },
  {
    "id": 38,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-10-13"
  },
  {
    "id": 39,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-10-27"
  },
  {
    "id": 40,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-11-10"
  },
  {
    "id": 41,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-11-17"
  },
  {
    "id": 42,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-12-08"
  },
  {
    "id": 43,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-01-26"
  },
  {
    "id": 44,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-02-23"
  },
  {
    "id": 45,
    "name": "Open Studio",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-03-09"
  },
  {
    "id": 46,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-04-27"
  },
  {
    "id": 47,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-05-18"
  },
  {
    "id": 48,
    "name": "Open Studio",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-06-29"
  },
  {
    "id": 49,
    "name": "SMA Mirror 17\"",
    "locationType": "in_person",
    "locationName": "Seattle Mosaic Arts",
    "locationAddress": "1325 N 46th St, Seattle, WA 98103",
    "startDate": "2013-09-14"
  },
  {
    "id": 50,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-10-05"
  },
  {
    "id": 51,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-10-26"
  },
  {
    "id": 52,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-11-02"
  },
  {
    "id": 53,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-11-16"
  },
  {
    "id": 54,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-12-14"
  },
  {
    "id": 55,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-02-08"
  },
  {
    "id": 56,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-03-01"
  },
  {
    "id": 57,
    "name": "IMA Berkeley",
    "locationType": "in_person",
    "locationName": "Berkeley Studio",
    "locationAddress": "805 Allston Way, Berkeley, CA 94710",
    "startDate": "2014-03-22"
  },
  {
    "id": 58,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-04-12"
  },
  {
    "id": 59,
    "name": "Mirror 17\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-04-26"
  },
  {
    "id": 60,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-06-07"
  },
  {
    "id": 61,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-08-23"
  },
  {
    "id": 62,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-09-13"
  },
  {
    "id": 63,
    "name": "Lucy's Class",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-09-20"
  },
  {
    "id": 64,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-10-11"
  },
  {
    "id": 65,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-10-25"
  },
  {
    "id": 66,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-11-08"
  },
  {
    "id": 67,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-11-22"
  },
  {
    "id": 68,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-12-06"
  },
  {
    "id": 69,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-12-29"
  },
  {
    "id": 70,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-01-03"
  },
  {
    "id": 71,
    "name": "Special",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-02-07"
  },
  {
    "id": 72,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-02-28"
  },
  {
    "id": 73,
    "name": "IMA Berkeley",
    "locationType": "in_person",
    "locationName": "Berkeley Studio",
    "locationAddress": "805 Allston Way, Berkeley, CA 94710",
    "startDate": "2015-03-07"
  },
  {
    "id": 74,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-03-21"
  },
  {
    "id": 75,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-04-11"
  },
  {
    "id": 76,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-06-27"
  },
  {
    "id": 77,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-08-22"
  },
  {
    "id": 78,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-09-19"
  },
  {
    "id": 79,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-09-26"
  },
  {
    "id": 80,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-10-17"
  },
  {
    "id": 81,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-11-07"
  },
  {
    "id": 82,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-11-21"
  },
  {
    "id": 83,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-12-12"
  },
  {
    "id": 84,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-01-02"
  },
  {
    "id": 85,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-01-16"
  },
  {
    "id": 86,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-01-23"
  },
  {
    "id": 87,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-03-05"
  },
  {
    "id": 88,
    "name": "IMA Berkeley",
    "locationType": "in_person",
    "locationName": "Berkeley Studio",
    "locationAddress": "805 Allston Way, Berkeley, CA 94710",
    "startDate": "2016-03-18"
  },
  {
    "id": 89,
    "name": "IMA Berkeley",
    "locationType": "in_person",
    "locationName": "Berkeley Studio",
    "locationAddress": "805 Allston Way, Berkeley, CA 94710",
    "startDate": "2016-03-19"
  },
  {
    "id": 90,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-04-02"
  },
  {
    "id": 91,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-04-30"
  },
  {
    "id": 92,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-05-14"
  },
  {
    "id": 93,
    "name": "Private",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-05-28"
  },
  {
    "id": 94,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-06-04"
  },
  {
    "id": 95,
    "name": "Birdhouse (Harriet's Class)",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-06-11"
  },
  {
    "id": 96,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-08-20"
  },
  {
    "id": 97,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-09-17"
  },
  {
    "id": 98,
    "name": "Private",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-10-08"
  },
  {
    "id": 99,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-10-29"
  },
  {
    "id": 100,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-11-19"
  },
  {
    "id": 101,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-12-01"
  },
  {
    "id": 102,
    "name": "Private Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-12-04"
  },
  {
    "id": 103,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-12-10"
  },
  {
    "id": 104,
    "name": "Private Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-01-14"
  },
  {
    "id": 105,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-02-11"
  },
  {
    "id": 106,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-03-11"
  },
  {
    "id": 107,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-04-01"
  },
  {
    "id": 108,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-06-03"
  },
  {
    "id": 109,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-08-12"
  },
  {
    "id": 110,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-09-09"
  },
  {
    "id": 111,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-09-30"
  },
  {
    "id": 112,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-10-14"
  },
  {
    "id": 113,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-10-28"
  },
  {
    "id": 114,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-11-18"
  },
  {
    "id": 115,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-12-09"
  },
  {
    "id": 116,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-12-16"
  },
  {
    "id": 117,
    "name": "Mirror (Maureen's Class)",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-01-13"
  },
  {
    "id": 118,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-02-03"
  },
  {
    "id": 119,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-03-03"
  },
  {
    "id": 120,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-03-10"
  },
  {
    "id": 121,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-04-21"
  },
  {
    "id": 122,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-05-26"
  },
  {
    "id": 123,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-07-14"
  },
  {
    "id": 124,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-07-21"
  },
  {
    "id": 125,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-08-04"
  },
  {
    "id": 126,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-08-11"
  },
  {
    "id": 127,
    "name": "SMA Santa Barbara",
    "locationType": "in_person",
    "locationName": "Santa Barbara Studio",
    "locationAddress": "4223 State St, Santa Barbara, CA 93105",
    "startDate": "2018-09-07"
  },
  {
    "id": 128,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-09-22"
  },
  {
    "id": 129,
    "name": "Private Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-09-29"
  },
  {
    "id": 130,
    "name": "Karen Wickstrom",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-10-23"
  },
  {
    "id": 131,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-10-27"
  },
  {
    "id": 132,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-11-17"
  },
  {
    "id": 133,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-12-01"
  },
  {
    "id": 134,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-12-08"
  },
  {
    "id": 135,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-01-12"
  },
  {
    "id": 136,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-01-19"
  },
  {
    "id": 137,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-02-25"
  },
  {
    "id": 138,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-03-02"
  },
  {
    "id": 139,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-03-23"
  },
  {
    "id": 140,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-04-01"
  },
  {
    "id": 141,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-05-02"
  },
  {
    "id": 142,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-05-18"
  },
  {
    "id": 143,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-05-25"
  },
  {
    "id": 144,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-07-13"
  },
  {
    "id": 145,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-07-27"
  },
  {
    "id": 146,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-08-03"
  },
  {
    "id": 147,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-08-05"
  },
  {
    "id": 148,
    "name": "SMA Austin",
    "locationType": "in_person",
    "locationName": "The Commune Annex (Austin, TX)",
    "locationAddress": "The Commune Annex, 5212 Avenue F, Austin, TX 78751",
    "startDate": "2019-09-14"
  },
  {
    "id": 149,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-09-28"
  },
  {
    "id": 150,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-10-03"
  },
  {
    "id": 151,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-10-15"
  },
  {
    "id": 152,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-11-02"
  },
  {
    "id": 153,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-11-23"
  },
  {
    "id": 154,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-12-02"
  },
  {
    "id": 155,
    "name": "Nancy's Class",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-12-07"
  },
  {
    "id": 156,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-12-14"
  },
  {
    "id": 157,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-01-18"
  },
  {
    "id": 158,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2020-02-21"
  },
  {
    "id": 159,
    "name": "Votive",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-04-05"
  },
  {
    "id": 160,
    "name": "Votive",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-04-07"
  },
  {
    "id": 161,
    "name": "Votive",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-04-09"
  },
  {
    "id": 162,
    "name": "Votive",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-04-11"
  },
  {
    "id": 163,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-05-02"
  },
  {
    "id": 164,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-08-01"
  },
  {
    "id": 165,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-09-19"
  },
  {
    "id": 166,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-10-04"
  },
  {
    "id": 167,
    "name": "Votive",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-11-06"
  },
  {
    "id": 168,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-11-14"
  },
  {
    "id": 169,
    "name": "Votive",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-11-20"
  },
  {
    "id": 170,
    "name": "Votive",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-12-05"
  },
  {
    "id": 171,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2021-01-02"
  },
  {
    "id": 172,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2021-02-27"
  },
  {
    "id": 173,
    "name": "Private Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2021-08-16"
  },
  {
    "id": 174,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2021-09-25"
  },
  {
    "id": 175,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2022-02-25"
  },
  {
    "id": 176,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2022-02-26"
  },
  {
    "id": 177,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2022-05-14"
  },
  {
    "id": 178,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-02-04"
  },
  {
    "id": 179,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2023-02-24"
  },
  {
    "id": 180,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2023-02-25"
  },
  {
    "id": 181,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-03-11"
  },
  {
    "id": 182,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-04-22"
  },
  {
    "id": 183,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-05-06"
  },
  {
    "id": 184,
    "name": "SMA Santa Barbara",
    "locationType": "in_person",
    "locationName": "Santa Barbara Studio",
    "locationAddress": "4223 State St, Santa Barbara, CA 93105",
    "startDate": "2023-05-20"
  },
  {
    "id": 185,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-07-14"
  },
  {
    "id": 186,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-08-05"
  },
  {
    "id": 187,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-09-16"
  },
  {
    "id": 188,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-10-06"
  },
  {
    "id": 189,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-11-11"
  },
  {
    "id": 190,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-11-18"
  },
  {
    "id": 191,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-12-02"
  },
  {
    "id": 192,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-01-06"
  },
  {
    "id": 193,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-01-20"
  },
  {
    "id": 194,
    "name": "Orlando, Birdhouse Mandala",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2024-02-16"
  },
  {
    "id": 195,
    "name": "Orlando, Mirror",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2024-02-24"
  },
  {
    "id": 196,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-03-09"
  },
  {
    "id": 197,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-04-06"
  },
  {
    "id": 198,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-04-27"
  },
  {
    "id": 199,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-04-29"
  },
  {
    "id": 200,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-05-17"
  },
  {
    "id": 201,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-07-13"
  },
  {
    "id": 202,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-09-14"
  },
  {
    "id": 203,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-10-05"
  },
  {
    "id": 204,
    "name": "Mandala Retreat",
    "locationType": "in_person",
    "locationName": "Deer Island Retreat",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2024-10-25"
  },
  {
    "id": 205,
    "name": "Mandala Retreat",
    "locationType": "in_person",
    "locationName": "Deer Island Retreat",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2024-10-26"
  },
  {
    "id": 206,
    "name": "Mandala Retreat",
    "locationType": "in_person",
    "locationName": "Deer Island Retreat",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2024-10-27"
  },
  {
    "id": 207,
    "name": "Mandala Retreat",
    "locationType": "in_person",
    "locationName": "Deer Island Retreat",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2024-10-28"
  },
  {
    "id": 208,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-11-09"
  },
  {
    "id": 209,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-11-23"
  },
  {
    "id": 210,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-01-18"
  },
  {
    "id": 211,
    "name": "Orlando 3-day",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2025-01-24"
  },
  {
    "id": 212,
    "name": "Orlando 2-day",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando, FL)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2025-01-25"
  },
  {
    "id": 213,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-02-08"
  },
  {
    "id": 214,
    "name": "Spokane Mandala",
    "locationType": "in_person",
    "locationName": "Spokane Studio",
    "locationAddress": "823 N Crestline St, Spokane, WA 99202",
    "startDate": "2025-02-15"
  },
  {
    "id": 215,
    "name": "Mandala/Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-04-25"
  },
  {
    "id": 216,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-06-21"
  },
  {
    "id": 217,
    "name": "Kit Day",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-07-05"
  },
  {
    "id": 218,
    "name": "MIrror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-08-23"
  },
  {
    "id": 219,
    "name": "MIrror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-09-13"
  },
  {
    "id": 220,
    "name": "MIrror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-09-14"
  },
  {
    "id": 221,
    "name": "Oakland Birdhouse",
    "locationType": "in_person",
    "locationName": "Oakland Studio",
    "locationAddress": "2020 Dennison Street, Oakland, CA",
    "startDate": "2025-09-26"
  },
  {
    "id": 222,
    "name": "Portland Mandala",
    "locationType": "in_person",
    "locationName": "Deer Island Retreat",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2025-10-24"
  },
  {
    "id": 223,
    "name": "Portland Mandala",
    "locationType": "in_person",
    "locationName": "Deer Island Retreat",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2025-10-25"
  },
  {
    "id": 224,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-11-15"
  },
  {
    "id": 225,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-12-06"
  },
  {
    "id": 226,
    "name": "Kit Day",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-01-03"
  },
  {
    "id": 227,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-01-17"
  },
  {
    "id": 228,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-02-07"
  },
  {
    "id": 229,
    "name": "Mandala/Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-02-28"
  },
  {
    "id": 230,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-04-11"
  },
  {
    "id": 231,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-04-12"
  },
  {
    "id": 232,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-06-13"
  },
  {
    "id": 233,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-07-11"
  },
  {
    "id": 234,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-09-19"
  },
  {
    "id": 235,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-10-09"
  },
  {
    "id": 236,
    "name": "Deer Island",
    "locationType": "in_person",
    "locationName": "Deer Island Retreat",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2026-10-23"
  },
  {
    "id": 237,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-11-14"
  }
] )
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'LiveClasses', null, {} )
  }
}
