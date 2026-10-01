const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  const index = Number(month) - 1;
  if (!/^\d{4}$/.test(year ?? "") || !(index >= 0 && index < 12)) throw new Error(`Bad month: ${yearMonth}`);
  return `${MONTHS[index]} ${year}`;
}

export function formatIssued(date: string): string {
  const parts = date.split("-");
  if (parts.length === 3) return `${Number(parts[2])} ${formatMonth(`${parts[0]}-${parts[1]}`)}`;
  if (parts.length === 2) return formatMonth(date);
  return date;
}
