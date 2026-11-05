export interface TicketEvent {
  id: string;
  title: string;
  event_date: string; // YYYY-MM-DD
  venue: string;
  flyer_url: string | null;
  ticket_url: string;
}

const DAYS = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

export function formatEventDate(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return {
    date: String(d.getUTCDate()).padStart(2, '0'),
    month: MONTHS[d.getUTCMonth()],
    day: DAYS[d.getUTCDay()],
  };
}

// Today in Buenos Aires as YYYY-MM-DD, so a show stays listed until its day ends
export function todayInBuenosAires() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date());
}
