// Table renderers — convert data arrays into simple HTML tables.
export function renderFullTable(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!data || data.length === 0) {
    container.innerHTML = '<p>No data</p>';
    return;
  }
  let html = '<table border="1" cellpadding="4" cellspacing="0" ' +
    'style="border-collapse: collapse; width: 100%; font-size: 12px;">' +
    '<thead><tr><th>Region</th><th>Value</th></tr></thead><tbody>';
  data.forEach((d) => {
    html += `<tr><td>${d.city}</td><td>${d.count.toFixed(2)}</td></tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

export function renderExtremesTable(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!data || data.length === 0) {
    container.innerHTML = '<p>No data</p>';
    return;
  }
  const topLow = data.slice(0, 10);
  const topHigh = data.slice(-10).reverse();
  let html = '<table border="1" cellpadding="4" cellspacing="0" ' +
    'style="border-collapse: collapse; width: 100%; font-size: 12px;">';
  html += '<thead><tr><th>Region</th><th>Value</th></tr></thead><tbody>';
  html += `<tr><td colspan="2"><strong>Lowest 10</strong></td></tr>`;
  topLow.forEach((d) => {
    html += `<tr><td>${d.city}</td><td>${d.count.toFixed(2)}</td></tr>`;
  });
  html += `<tr><td colspan="2"><strong>Highest 10</strong></td></tr>`;
  topHigh.forEach((d) => {
    html += `<tr><td>${d.city}</td><td>${d.count.toFixed(2)}</td></tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}
