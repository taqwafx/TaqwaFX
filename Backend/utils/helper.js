export const addMonthsSafe = (date, months) => {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  // handle month overflow (e.g., Jan 31 -> Feb)
  if (d.getDate() < day) {
    d.setDate(0);
  }
  return d;
};

export function parseDate(ddmmyyyy) {
  // Split by slash
  const [day, month, year] = ddmmyyyy.split('/').map(Number);
  
  // Note: month is 0-indexed in JS (Jan = 0, Dec = 11)
  return new Date(year, month - 1, day);
}
