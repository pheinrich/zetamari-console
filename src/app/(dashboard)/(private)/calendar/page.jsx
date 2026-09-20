import { readBasicEvents } from '@/db/actions/basicEvent'
import { readPeople } from '@/db/actions/person'
import EventCalendar from './EventCalendar'

// The simplified calendar that replaced the Capacity Calendar - see
// docs/adr/0008. Shows every standalone Basic Event plus every Event/
// LiveClass occurrence in one place; occurrences that belong to a show
// or class are still fully manageable here too (not just from that
// parent's own Occurrences editor), since staff may just want "what's
// on the calendar this week" without navigating to a specific class.
export default async function CalendarPage()
{
  const [basicEvents, people] = await Promise.all( [readBasicEvents(), readPeople()] )

  return <EventCalendar basicEvents={basicEvents} personOptions={people} />
}
