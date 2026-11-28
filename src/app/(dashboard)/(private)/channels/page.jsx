import { readInboundEmails } from '@/db/actions/channelOrder'
import InboundEmailsListTable from './InboundEmailsListTable'

export default async function InboundEmailsPage()
{
  const emails = await readInboundEmails()

  return <InboundEmailsListTable emailData={emails} />
}
