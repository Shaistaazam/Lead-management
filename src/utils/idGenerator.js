export function nextLeadId(existingLeads) {
  const max = existingLeads.reduce((acc, lead) => {
    const num = parseInt(String(lead.id).replace(/\D/g, ''), 10);
    return Number.isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `L-${String(max + 1).padStart(4, '0')}`;
}

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
