import type { Metadata } from 'next';
import type { TicketEvent } from '@/lib/tickets';
import { isAdmin } from '@/lib/ticketsServer';
import { isStoreConfigured, readEvents } from '@/lib/ticketsStore';
import AdminLogin from '@/components/tickets/AdminLogin';
import AdminPanel from '@/components/tickets/AdminPanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tickets Admin',
  robots: { index: false, follow: false },
};

export default async function TicketsAdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  let events: TicketEvent[] = [];
  let loadError = !isStoreConfigured();
  if (!loadError) {
    try {
      events = (await readEvents()).sort((a, b) => a.event_date.localeCompare(b.event_date));
    } catch (err) {
      console.error('tickets admin read failed', err);
      loadError = true;
    }
  }

  return <AdminPanel events={events} loadError={loadError} />;
}
