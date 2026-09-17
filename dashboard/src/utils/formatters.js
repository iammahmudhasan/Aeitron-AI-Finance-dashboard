const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  return currencyFormatter.format(amount);
}

export function formatCompactCurrency(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || isNaN(num)) return '$0';
  if (Math.abs(num) < 1000) {
    return `$${num.toLocaleString()}`;
  }
  return (
    '$' +
    new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num)
  );
}

export function formatCompactNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || isNaN(num)) return '0';
  if (Math.abs(num) < 1000) {
    return num.toLocaleString();
  }
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMonth(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}
