'use strict'

// Seeds LiveClass from the "Zetamari Students - Attendance" spreadsheet's
// Attendance tab (1,636 usable rows spanning 2009-2026). One LiveClass per
// distinct Class Date in the sheet, per Angie's instruction to group by
// date - note this still means a multi-day event logged under more than
// one Class Date becomes that many separate LiveClass rows rather than
// one row with a startDate/endDate span, EXCEPT for the two specific
// date-typo cases called out below, which really were meant to be a
// single date.
//
// name: the sheet's "Class Type" text for that date, taking the single
// most common value when a date has more than one (ties broken by
// whichever appeared first in the source rows) - copied directly rather
// than reformatted, aside from one straightforward capitalization typo
// ("MIrror" -> "Mirror", ids 218-220).
//
// locationName/locationAddress: resolved from keywords in the class
// name(s) on that date, per Angie's original mapping, then further
// refined with venue-specific display names once she reviewed the
// result:
//   IMA Berkeley             -> Institute of Mosaic Art (Berkeley), 805 Allston Way, Berkeley, CA 94710
//   SMA Santa Barbara        -> SB School of Mosaic Art (Santa Barbara), 4223 State St, Santa Barbara, CA 93105
//   SMA Austin               -> The Commune Annex (Austin), 5212 Avenue F, Austin, TX 78751
//   Orlando / LMA            -> Luna Mosaic Arts (Orlando), 813 Virginia Dr, Orlando, FL 32803
//   Deer Island / Portland Mandala / Mandala Retreat
//                            -> Marvelous Mosaic Fine Art (Portland), 64535 Columbia River Hwy, Deer Island, OR 97054
//   Spokane (2025)           -> 2nd Sight Workspace, 823 N Crestline St, Spokane, WA 99202
//   Oakland                  -> Studio 9, 2020 Dennison Street, Oakland, CA
//   Nancy's Class            -> Nancy Callanan's Home, 785 Quintana Rd #442, Morro Bay, CA 93442
//   everything else          -> 503 N 62nd St, Seattle, WA 98103 (the studio)
//
// locationType/locationName: every class with a startDate from
// 2020-04-05 through 2021-09-25 (inclusive) is switched to
// locationType 'online', locationName "Angie's Studio (Zoom)" - the
// pandemic-era window when Angie's classes moved to Zoom - EXCEPT the
// "Private Mirror" class starting 2021-08-16, which stayed in person
// despite falling inside that window.
//
// endDate: startDate + 2 days for any class whose name mentions
// "mandala" or "birdhouse" (multi-day workshops) or is explicitly
// labeled "3-day" (the Orlando 3-day class); startDate + 1 day for
// everything else, including the Orlando "2-day" class.
//
// Two date-typo corrections (the sheet logged what was really one
// multi-day event as several different Class Dates a day apart, when a
// single-day-later or later-day header stuck): id 88 (IMA Berkeley,
// 2016-03-18) was eliminated in favor of id 89 (2016-03-19, the same
// class); ids 205-207 (Mandala Retreat, 2024-10-26 through 10-28) were
// eliminated in favor of id 204 (2024-10-25), which now carries the
// retreat's full multi-day endDate instead. Any LiveClassAttendee rows
// that pointed at the eliminated ids were repointed to the surviving one
// - see 20260814030000-live-class-attendees.js.
//
// cost is deliberately left unset on every row, per instruction - Angie
// will fill in class pricing herself later.
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
    "startDate": "2009-11-07",
    "endDate": "2009-11-08"
  },
  {
    "id": 2,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2009-12-26",
    "endDate": "2009-12-27"
  },
  {
    "id": 3,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-01-16",
    "endDate": "2010-01-17"
  },
  {
    "id": 4,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-02-06",
    "endDate": "2010-02-07"
  },
  {
    "id": 5,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-03-13",
    "endDate": "2010-03-14"
  },
  {
    "id": 6,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-03-27",
    "endDate": "2010-03-28"
  },
  {
    "id": 7,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-04-10",
    "endDate": "2010-04-11"
  },
  {
    "id": 8,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-05-01",
    "endDate": "2010-05-02"
  },
  {
    "id": 9,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-05-22",
    "endDate": "2010-05-23"
  },
  {
    "id": 10,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-06-26",
    "endDate": "2010-06-27"
  },
  {
    "id": 11,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-08-28",
    "endDate": "2010-08-29"
  },
  {
    "id": 12,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-09-25",
    "endDate": "2010-09-26"
  },
  {
    "id": 13,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-10-09",
    "endDate": "2010-10-10"
  },
  {
    "id": 14,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-10-23",
    "endDate": "2010-10-24"
  },
  {
    "id": 15,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-11-20",
    "endDate": "2010-11-21"
  },
  {
    "id": 16,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2010-12-11",
    "endDate": "2010-12-12"
  },
  {
    "id": 17,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-01-29",
    "endDate": "2011-01-30"
  },
  {
    "id": 18,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-02-05",
    "endDate": "2011-02-06"
  },
  {
    "id": 19,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-02-26",
    "endDate": "2011-02-27"
  },
  {
    "id": 20,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-03-12",
    "endDate": "2011-03-13"
  },
  {
    "id": 21,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-03-26",
    "endDate": "2011-03-27"
  },
  {
    "id": 22,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-04-09",
    "endDate": "2011-04-10"
  },
  {
    "id": 23,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-04-30",
    "endDate": "2011-05-01"
  },
  {
    "id": 24,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-05-14",
    "endDate": "2011-05-15"
  },
  {
    "id": 25,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-06-11",
    "endDate": "2011-06-12"
  },
  {
    "id": 26,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-08-27",
    "endDate": "2011-08-28"
  },
  {
    "id": 27,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-09-17",
    "endDate": "2011-09-18"
  },
  {
    "id": 28,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-10-01",
    "endDate": "2011-10-02"
  },
  {
    "id": 29,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-10-15",
    "endDate": "2011-10-16"
  },
  {
    "id": 30,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-11-11",
    "endDate": "2011-11-12"
  },
  {
    "id": 31,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2011-11-12",
    "endDate": "2011-11-13"
  },
  {
    "id": 32,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-02-11",
    "endDate": "2012-02-12"
  },
  {
    "id": 33,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-03-03",
    "endDate": "2012-03-04"
  },
  {
    "id": 34,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-03-24",
    "endDate": "2012-03-25"
  },
  {
    "id": 35,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-04-14",
    "endDate": "2012-04-15"
  },
  {
    "id": 36,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-05-19",
    "endDate": "2012-05-20"
  },
  {
    "id": 37,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-09-22",
    "endDate": "2012-09-23"
  },
  {
    "id": 38,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-10-13",
    "endDate": "2012-10-14"
  },
  {
    "id": 39,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-10-27",
    "endDate": "2012-10-28"
  },
  {
    "id": 40,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-11-10",
    "endDate": "2012-11-11"
  },
  {
    "id": 41,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-11-17",
    "endDate": "2012-11-18"
  },
  {
    "id": 42,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2012-12-08",
    "endDate": "2012-12-09"
  },
  {
    "id": 43,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-01-26",
    "endDate": "2013-01-27"
  },
  {
    "id": 44,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-02-23",
    "endDate": "2013-02-24"
  },
  {
    "id": 45,
    "name": "Open Studio",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-03-09",
    "endDate": "2013-03-10"
  },
  {
    "id": 46,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-04-27",
    "endDate": "2013-04-28"
  },
  {
    "id": 47,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-05-18",
    "endDate": "2013-05-19"
  },
  {
    "id": 48,
    "name": "Open Studio",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-06-29",
    "endDate": "2013-06-30"
  },
  {
    "id": 49,
    "name": "SMA Mirror 17\"",
    "locationType": "in_person",
    "locationName": "Seattle Mosaic Arts",
    "locationAddress": "1325 N 46th St, Seattle, WA 98103",
    "startDate": "2013-09-14",
    "endDate": "2013-09-15"
  },
  {
    "id": 50,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-10-05",
    "endDate": "2013-10-06"
  },
  {
    "id": 51,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-10-26",
    "endDate": "2013-10-27"
  },
  {
    "id": 52,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-11-02",
    "endDate": "2013-11-03"
  },
  {
    "id": 53,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-11-16",
    "endDate": "2013-11-17"
  },
  {
    "id": 54,
    "name": "Mirror 13\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2013-12-14",
    "endDate": "2013-12-15"
  },
  {
    "id": 55,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-02-08",
    "endDate": "2014-02-09"
  },
  {
    "id": 56,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-03-01",
    "endDate": "2014-03-02"
  },
  {
    "id": 57,
    "name": "IMA Berkeley",
    "locationType": "in_person",
    "locationName": "Institute of Mosaic Art (Berkeley)",
    "locationAddress": "805 Allston Way, Berkeley, CA 94710",
    "startDate": "2014-03-22",
    "endDate": "2014-03-23"
  },
  {
    "id": 58,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-04-12",
    "endDate": "2014-04-13"
  },
  {
    "id": 59,
    "name": "Mirror 17\"",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-04-26",
    "endDate": "2014-04-27"
  },
  {
    "id": 60,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-06-07",
    "endDate": "2014-06-08"
  },
  {
    "id": 61,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-08-23",
    "endDate": "2014-08-24"
  },
  {
    "id": 62,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-09-13",
    "endDate": "2014-09-14"
  },
  {
    "id": 63,
    "name": "Lucy's Class",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-09-20",
    "endDate": "2014-09-21"
  },
  {
    "id": 64,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-10-11",
    "endDate": "2014-10-12"
  },
  {
    "id": 65,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-10-25",
    "endDate": "2014-10-26"
  },
  {
    "id": 66,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-11-08",
    "endDate": "2014-11-09"
  },
  {
    "id": 67,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-11-22",
    "endDate": "2014-11-23"
  },
  {
    "id": 68,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-12-06",
    "endDate": "2014-12-07"
  },
  {
    "id": 69,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2014-12-29",
    "endDate": "2014-12-30"
  },
  {
    "id": 70,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-01-03",
    "endDate": "2015-01-04"
  },
  {
    "id": 71,
    "name": "Special",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-02-07",
    "endDate": "2015-02-08"
  },
  {
    "id": 72,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-02-28",
    "endDate": "2015-03-01"
  },
  {
    "id": 73,
    "name": "IMA Berkeley",
    "locationType": "in_person",
    "locationName": "Institute of Mosaic Art (Berkeley)",
    "locationAddress": "805 Allston Way, Berkeley, CA 94710",
    "startDate": "2015-03-07",
    "endDate": "2015-03-08"
  },
  {
    "id": 74,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-03-21",
    "endDate": "2015-03-22"
  },
  {
    "id": 75,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-04-11",
    "endDate": "2015-04-12"
  },
  {
    "id": 76,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-06-27",
    "endDate": "2015-06-28"
  },
  {
    "id": 77,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-08-22",
    "endDate": "2015-08-23"
  },
  {
    "id": 78,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-09-19",
    "endDate": "2015-09-20"
  },
  {
    "id": 79,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-09-26",
    "endDate": "2015-09-27"
  },
  {
    "id": 80,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-10-17",
    "endDate": "2015-10-18"
  },
  {
    "id": 81,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-11-07",
    "endDate": "2015-11-08"
  },
  {
    "id": 82,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-11-21",
    "endDate": "2015-11-22"
  },
  {
    "id": 83,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2015-12-12",
    "endDate": "2015-12-13"
  },
  {
    "id": 84,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-01-02",
    "endDate": "2016-01-03"
  },
  {
    "id": 85,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-01-16",
    "endDate": "2016-01-17"
  },
  {
    "id": 86,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-01-23",
    "endDate": "2016-01-24"
  },
  {
    "id": 87,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-03-05",
    "endDate": "2016-03-06"
  },
  {
    "id": 89,
    "name": "IMA Berkeley",
    "locationType": "in_person",
    "locationName": "Institute of Mosaic Art (Berkeley)",
    "locationAddress": "805 Allston Way, Berkeley, CA 94710",
    "startDate": "2016-03-19",
    "endDate": "2016-03-20"
  },
  {
    "id": 90,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-04-02",
    "endDate": "2016-04-03"
  },
  {
    "id": 91,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-04-30",
    "endDate": "2016-05-01"
  },
  {
    "id": 92,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-05-14",
    "endDate": "2016-05-16"
  },
  {
    "id": 93,
    "name": "Private",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-05-28",
    "endDate": "2016-05-29"
  },
  {
    "id": 94,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-06-04",
    "endDate": "2016-06-06"
  },
  {
    "id": 95,
    "name": "Birdhouse (Harriet's Class)",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-06-11",
    "endDate": "2016-06-13"
  },
  {
    "id": 96,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-08-20",
    "endDate": "2016-08-21"
  },
  {
    "id": 97,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-09-17",
    "endDate": "2016-09-18"
  },
  {
    "id": 98,
    "name": "Private",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-10-08",
    "endDate": "2016-10-09"
  },
  {
    "id": 99,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-10-29",
    "endDate": "2016-10-30"
  },
  {
    "id": 100,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-11-19",
    "endDate": "2016-11-20"
  },
  {
    "id": 101,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-12-01",
    "endDate": "2016-12-02"
  },
  {
    "id": 102,
    "name": "Private Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-12-04",
    "endDate": "2016-12-05"
  },
  {
    "id": 103,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2016-12-10",
    "endDate": "2016-12-11"
  },
  {
    "id": 104,
    "name": "Private Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-01-14",
    "endDate": "2017-01-15"
  },
  {
    "id": 105,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-02-11",
    "endDate": "2017-02-12"
  },
  {
    "id": 106,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-03-11",
    "endDate": "2017-03-12"
  },
  {
    "id": 107,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-04-01",
    "endDate": "2017-04-02"
  },
  {
    "id": 108,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-06-03",
    "endDate": "2017-06-04"
  },
  {
    "id": 109,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-08-12",
    "endDate": "2017-08-13"
  },
  {
    "id": 110,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-09-09",
    "endDate": "2017-09-10"
  },
  {
    "id": 111,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-09-30",
    "endDate": "2017-10-01"
  },
  {
    "id": 112,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-10-14",
    "endDate": "2017-10-15"
  },
  {
    "id": 113,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-10-28",
    "endDate": "2017-10-29"
  },
  {
    "id": 114,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-11-18",
    "endDate": "2017-11-19"
  },
  {
    "id": 115,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-12-09",
    "endDate": "2017-12-10"
  },
  {
    "id": 116,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2017-12-16",
    "endDate": "2017-12-17"
  },
  {
    "id": 117,
    "name": "Mirror (Maureen's Class)",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-01-13",
    "endDate": "2018-01-14"
  },
  {
    "id": 118,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-02-03",
    "endDate": "2018-02-04"
  },
  {
    "id": 119,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-03-03",
    "endDate": "2018-03-05"
  },
  {
    "id": 120,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-03-10",
    "endDate": "2018-03-11"
  },
  {
    "id": 121,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-04-21",
    "endDate": "2018-04-22"
  },
  {
    "id": 122,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-05-26",
    "endDate": "2018-05-27"
  },
  {
    "id": 123,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-07-14",
    "endDate": "2018-07-15"
  },
  {
    "id": 124,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-07-21",
    "endDate": "2018-07-22"
  },
  {
    "id": 125,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-08-04",
    "endDate": "2018-08-05"
  },
  {
    "id": 126,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-08-11",
    "endDate": "2018-08-12"
  },
  {
    "id": 127,
    "name": "SMA Santa Barbara",
    "locationType": "in_person",
    "locationName": "SB School of Mosaic Art (Santa Barbara)",
    "locationAddress": "4223 State St, Santa Barbara, CA 93105",
    "startDate": "2018-09-07",
    "endDate": "2018-09-08"
  },
  {
    "id": 128,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-09-22",
    "endDate": "2018-09-23"
  },
  {
    "id": 129,
    "name": "Private Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-09-29",
    "endDate": "2018-09-30"
  },
  {
    "id": 130,
    "name": "Karen Wickstrom",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-10-23",
    "endDate": "2018-10-24"
  },
  {
    "id": 131,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-10-27",
    "endDate": "2018-10-28"
  },
  {
    "id": 132,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-11-17",
    "endDate": "2018-11-18"
  },
  {
    "id": 133,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-12-01",
    "endDate": "2018-12-02"
  },
  {
    "id": 134,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2018-12-08",
    "endDate": "2018-12-09"
  },
  {
    "id": 135,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-01-12",
    "endDate": "2019-01-13"
  },
  {
    "id": 136,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-01-19",
    "endDate": "2019-01-20"
  },
  {
    "id": 137,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-02-25",
    "endDate": "2019-02-26"
  },
  {
    "id": 138,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-03-02",
    "endDate": "2019-03-03"
  },
  {
    "id": 139,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-03-23",
    "endDate": "2019-03-24"
  },
  {
    "id": 140,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-04-01",
    "endDate": "2019-04-02"
  },
  {
    "id": 141,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-05-02",
    "endDate": "2019-05-04"
  },
  {
    "id": 142,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-05-18",
    "endDate": "2019-05-19"
  },
  {
    "id": 143,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-05-25",
    "endDate": "2019-05-26"
  },
  {
    "id": 144,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-07-13",
    "endDate": "2019-07-14"
  },
  {
    "id": 145,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-07-27",
    "endDate": "2019-07-28"
  },
  {
    "id": 146,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-08-03",
    "endDate": "2019-08-04"
  },
  {
    "id": 147,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-08-05",
    "endDate": "2019-08-06"
  },
  {
    "id": 148,
    "name": "SMA Austin",
    "locationType": "in_person",
    "locationName": "The Commune Annex (Austin)",
    "locationAddress": "The Commune Annex, 5212 Avenue F, Austin, TX 78751",
    "startDate": "2019-09-14",
    "endDate": "2019-09-15"
  },
  {
    "id": 149,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-09-28",
    "endDate": "2019-09-29"
  },
  {
    "id": 150,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-10-03",
    "endDate": "2019-10-04"
  },
  {
    "id": 151,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-10-15",
    "endDate": "2019-10-16"
  },
  {
    "id": 152,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-11-02",
    "endDate": "2019-11-03"
  },
  {
    "id": 153,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-11-23",
    "endDate": "2019-11-24"
  },
  {
    "id": 154,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-12-02",
    "endDate": "2019-12-03"
  },
  {
    "id": 155,
    "name": "Nancy's Class",
    "locationType": "in_person",
    "locationName": "Nancy Callanan's Home",
    "locationAddress": "785 Quintana Rd #442, Morro Bay, CA 93442",
    "startDate": "2019-12-07",
    "endDate": "2019-12-08"
  },
  {
    "id": 156,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2019-12-14",
    "endDate": "2019-12-15"
  },
  {
    "id": 157,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-01-18",
    "endDate": "2020-01-19"
  },
  {
    "id": 158,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2020-02-21",
    "endDate": "2020-02-22"
  },
  {
    "id": 159,
    "name": "Votive",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-04-05",
    "endDate": "2020-04-06"
  },
  {
    "id": 160,
    "name": "Votive",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-04-07",
    "endDate": "2020-04-08"
  },
  {
    "id": 161,
    "name": "Votive",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-04-09",
    "endDate": "2020-04-10"
  },
  {
    "id": 162,
    "name": "Votive",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-04-11",
    "endDate": "2020-04-12"
  },
  {
    "id": 163,
    "name": "Mandala",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-05-02",
    "endDate": "2020-05-04"
  },
  {
    "id": 164,
    "name": "Mandala",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-08-01",
    "endDate": "2020-08-03"
  },
  {
    "id": 165,
    "name": "Mandala",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-09-19",
    "endDate": "2020-09-21"
  },
  {
    "id": 166,
    "name": "Mandala",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-10-04",
    "endDate": "2020-10-06"
  },
  {
    "id": 167,
    "name": "Votive",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-11-06",
    "endDate": "2020-11-07"
  },
  {
    "id": 168,
    "name": "Mandala",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-11-14",
    "endDate": "2020-11-16"
  },
  {
    "id": 169,
    "name": "Votive",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-11-20",
    "endDate": "2020-11-21"
  },
  {
    "id": 170,
    "name": "Votive",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2020-12-05",
    "endDate": "2020-12-06"
  },
  {
    "id": 171,
    "name": "Mandala",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2021-01-02",
    "endDate": "2021-01-04"
  },
  {
    "id": 172,
    "name": "Mandala",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2021-02-27",
    "endDate": "2021-03-01"
  },
  {
    "id": 173,
    "name": "Private Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2021-08-16",
    "endDate": "2021-08-17"
  },
  {
    "id": 174,
    "name": "Mandala",
    "locationType": "online",
    "locationName": "Angie's Studio (Zoom)",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2021-09-25",
    "endDate": "2021-09-27"
  },
  {
    "id": 175,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2022-02-25",
    "endDate": "2022-02-26"
  },
  {
    "id": 176,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2022-02-26",
    "endDate": "2022-02-27"
  },
  {
    "id": 177,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2022-05-14",
    "endDate": "2022-05-15"
  },
  {
    "id": 178,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-02-04",
    "endDate": "2023-02-05"
  },
  {
    "id": 179,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2023-02-24",
    "endDate": "2023-02-25"
  },
  {
    "id": 180,
    "name": "LMA Orlando",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2023-02-25",
    "endDate": "2023-02-26"
  },
  {
    "id": 181,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-03-11",
    "endDate": "2023-03-12"
  },
  {
    "id": 182,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-04-22",
    "endDate": "2023-04-23"
  },
  {
    "id": 183,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-05-06",
    "endDate": "2023-05-07"
  },
  {
    "id": 184,
    "name": "SMA Santa Barbara",
    "locationType": "in_person",
    "locationName": "SB School of Mosaic Art (Santa Barbara)",
    "locationAddress": "4223 State St, Santa Barbara, CA 93105",
    "startDate": "2023-05-20",
    "endDate": "2023-05-21"
  },
  {
    "id": 185,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-07-14",
    "endDate": "2023-07-16"
  },
  {
    "id": 186,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-08-05",
    "endDate": "2023-08-06"
  },
  {
    "id": 187,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-09-16",
    "endDate": "2023-09-17"
  },
  {
    "id": 188,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-10-06",
    "endDate": "2023-10-08"
  },
  {
    "id": 189,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-11-11",
    "endDate": "2023-11-12"
  },
  {
    "id": 190,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-11-18",
    "endDate": "2023-11-19"
  },
  {
    "id": 191,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2023-12-02",
    "endDate": "2023-12-03"
  },
  {
    "id": 192,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-01-06",
    "endDate": "2024-01-07"
  },
  {
    "id": 193,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-01-20",
    "endDate": "2024-01-21"
  },
  {
    "id": 194,
    "name": "Orlando, Birdhouse Mandala",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2024-02-16",
    "endDate": "2024-02-18"
  },
  {
    "id": 195,
    "name": "Orlando, Mirror",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2024-02-24",
    "endDate": "2024-02-25"
  },
  {
    "id": 196,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-03-09",
    "endDate": "2024-03-10"
  },
  {
    "id": 197,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-04-06",
    "endDate": "2024-04-07"
  },
  {
    "id": 198,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-04-27",
    "endDate": "2024-04-28"
  },
  {
    "id": 199,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-04-29",
    "endDate": "2024-04-30"
  },
  {
    "id": 200,
    "name": "Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-05-17",
    "endDate": "2024-05-19"
  },
  {
    "id": 201,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-07-13",
    "endDate": "2024-07-14"
  },
  {
    "id": 202,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-09-14",
    "endDate": "2024-09-15"
  },
  {
    "id": 203,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-10-05",
    "endDate": "2024-10-06"
  },
  {
    "id": 204,
    "name": "Mandala Retreat",
    "locationType": "in_person",
    "locationName": "Marvelous Mosaic Fine Art (Portland)",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2024-10-25",
    "endDate": "2024-10-27"
  },
  {
    "id": 208,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-11-09",
    "endDate": "2024-11-10"
  },
  {
    "id": 209,
    "name": "Gift",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2024-11-23",
    "endDate": "2024-11-24"
  },
  {
    "id": 210,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-01-18",
    "endDate": "2025-01-19"
  },
  {
    "id": 211,
    "name": "Orlando 3-day",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2025-01-24",
    "endDate": "2025-01-26"
  },
  {
    "id": 212,
    "name": "Orlando 2-day",
    "locationType": "in_person",
    "locationName": "Luna Mosaic Arts (Orlando)",
    "locationAddress": "813 Virginia Dr, Orlando, FL 32803",
    "startDate": "2025-01-25",
    "endDate": "2025-01-26"
  },
  {
    "id": 213,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-02-08",
    "endDate": "2025-02-09"
  },
  {
    "id": 214,
    "name": "Spokane Mandala",
    "locationType": "in_person",
    "locationName": "2nd Sight Workspace",
    "locationAddress": "823 N Crestline St, Spokane, WA 99202",
    "startDate": "2025-02-15",
    "endDate": "2025-02-17"
  },
  {
    "id": 215,
    "name": "Mandala/Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-04-25",
    "endDate": "2025-04-27"
  },
  {
    "id": 216,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-06-21",
    "endDate": "2025-06-22"
  },
  {
    "id": 217,
    "name": "Kit Day",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-07-05",
    "endDate": "2025-07-06"
  },
  {
    "id": 218,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-08-23",
    "endDate": "2025-08-24"
  },
  {
    "id": 219,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-09-13",
    "endDate": "2025-09-14"
  },
  {
    "id": 220,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-09-14",
    "endDate": "2025-09-15"
  },
  {
    "id": 221,
    "name": "Oakland Birdhouse",
    "locationType": "in_person",
    "locationName": "Studio 9",
    "locationAddress": "2020 Dennison Street, Oakland, CA",
    "startDate": "2025-09-26",
    "endDate": "2025-09-28"
  },
  {
    "id": 222,
    "name": "Portland Mandala",
    "locationType": "in_person",
    "locationName": "Marvelous Mosaic Fine Art (Portland)",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2025-10-24",
    "endDate": "2025-10-26"
  },
  {
    "id": 223,
    "name": "Portland Mandala",
    "locationType": "in_person",
    "locationName": "Marvelous Mosaic Fine Art (Portland)",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2025-10-25",
    "endDate": "2025-10-27"
  },
  {
    "id": 224,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-11-15",
    "endDate": "2025-11-16"
  },
  {
    "id": 225,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2025-12-06",
    "endDate": "2025-12-07"
  },
  {
    "id": 226,
    "name": "Kit Day",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-01-03",
    "endDate": "2026-01-04"
  },
  {
    "id": 227,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-01-17",
    "endDate": "2026-01-18"
  },
  {
    "id": 228,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-02-07",
    "endDate": "2026-02-08"
  },
  {
    "id": 229,
    "name": "Mandala/Birdhouse",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-02-28",
    "endDate": "2026-03-02"
  },
  {
    "id": 230,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-04-11",
    "endDate": "2026-04-12"
  },
  {
    "id": 231,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-04-12",
    "endDate": "2026-04-13"
  },
  {
    "id": 232,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-06-13",
    "endDate": "2026-06-14"
  },
  {
    "id": 233,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-07-11",
    "endDate": "2026-07-12"
  },
  {
    "id": 234,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-09-19",
    "endDate": "2026-09-20"
  },
  {
    "id": 235,
    "name": "Mandala",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-10-09",
    "endDate": "2026-10-11"
  },
  {
    "id": 236,
    "name": "Deer Island",
    "locationType": "in_person",
    "locationName": "Marvelous Mosaic Fine Art (Portland)",
    "locationAddress": "64535 Columbia River Hwy, Deer Island, OR 97054",
    "startDate": "2026-10-23",
    "endDate": "2026-10-24"
  },
  {
    "id": 237,
    "name": "Mirror",
    "locationType": "in_person",
    "locationName": "Angie’s Studio",
    "locationAddress": "503 N 62nd St, Seattle, WA 98103",
    "startDate": "2026-11-14",
    "endDate": "2026-11-15"
  }
] )
  },

  async down( queryInterface, Sequelize )
  {
    return queryInterface.bulkDelete( 'LiveClasses', null, {} )
  }
}
