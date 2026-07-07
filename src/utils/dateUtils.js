// Helpers for dates and the derived/auto-calculated fields shown on the Leads list
// (Days Since Activity, Aging Bucket, Follow-up Status)

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(isoDate) {
  if (!isoDate) return '-';
  const d = new Date(isoDate + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '-';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${d.getFullYear()}`;
}

export function daysSince(isoDate) {
  if (!isoDate) return null;
  const then = new Date(isoDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((now - then) / (1000 * 60 * 60 * 24));
  return diff;
}

export function agingBucket(isoDate) {
  const days = daysSince(isoDate);
  if (days === null) return '-';
  if (days <= 15) return '0-15';
  if (days <= 30) return '16-30';
  if (days <= 60) return '31-60';
  return '60+';
}

// Auto-calculated based on Next Follow-up Date, as noted in the mockup
export function followUpStatus(nextFollowUpDateISO) {
  if (!nextFollowUpDateISO) return '-';
  const days = daysSince(nextFollowUpDateISO);
  if (days === null) return '-';
  if (days > 0) return 'Overdue';
  if (days === 0) return 'Due Today';
  return 'Upcoming';
}

export function nowDisplay() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${mm}/${dd}/${d.getFullYear()} ${String(h).padStart(2, '0')}:${min} ${ampm}`;
}
