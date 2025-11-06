export const formatRupee = (value) => {
  if (value == null || isNaN(value)) return "0";
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

export function validateDateFormat(dateStr) {
  // Regular expression to check DD/MM/YYYY
  const ddmmyyyyPattern = /^(\d{2})\-(\d{2})\-(\d{4})$/;

  // If it matches DD/MM/YYYY, show alert
  if (ddmmyyyyPattern.test(dateStr)) {
    return false;
  }

  // Regular expression for correct format YYYY/MM/DD
  const yyyymmddPattern = /^(\d{4})\-(\d{2})\-(\d{2})$/;

  if (!yyyymmddPattern.test(dateStr)) {
    return false;
  }

  // All good!
  return true;
}

export function validateMonth(userDateStr) {
  // Expecting format YYYY/MM/DD
  const [year, month, day] = userDateStr.split('-').map(Number);

  // Get current month (0-based → add 1)
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // If user entered a past month in the same year
  if (year === currentYear && month < currentMonth) {
    return false;
  }

  // Otherwise, it's fine
  return true;
}

export function calculateMonths(startDateStr, totalMonths) {
  // Convert input string to Date object
  const [year, month, day] = startDateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  // Add the months
  date.setMonth(date.getMonth() + totalMonths);

  // Format the result back as DD/MM/YYYY
  const resultDay = String(date.getDate()).padStart(2, "0");
  const resultMonth = String(date.getMonth() + 1).padStart(2, "0");
  const resultYear = date.getFullYear();

  return `${resultYear}-${resultMonth}-${resultDay}`;
}
