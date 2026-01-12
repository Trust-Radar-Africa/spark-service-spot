// CSV Export utility functions

export function exportToCSV<T>(
  data: T[],
  filename: string,
  columns: { key: keyof T; header: string }[]
): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create header row
  const headers = columns.map((col) => col.header);
  
  // Create data rows
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      // Handle different value types
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      return String(value);
    })
  );

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
