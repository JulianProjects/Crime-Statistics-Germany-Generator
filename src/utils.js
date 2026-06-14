// Utility helpers
// Removes duplicate city entries, keeping first occurrence.
export function deduplicateCities(data) {
  const seen = new Set();
  return data.filter((point) => {
    if (seen.has(point.city)) return false;
    seen.add(point.city);
    return true;
  });
}

// Compute regression line for provided data using d3-regression helpers.
// `regressionType` selects the regression algorithm (e.g. 'linear', 'loess').
export function getRegression(regressionType, data) {
  try {
    let regression;
    switch (regressionType) {
      case 'linear':
        regression = window.d3.regressionLinear();
        break;
      case 'exponential':
        regression = window.d3.regressionExp();
        break;
      case 'logarithmic':
        regression = window.d3.regressionLog();
        break;
      case 'quadratic':
        regression = window.d3.regressionQuad();
        break;
      case 'polynomial':
        regression = window.d3.regressionPoly().order(3);
        break;
      case 'powerlaw':
        regression = window.d3.regressionPow();
        break;
      case 'loess':
        regression = window.d3.regressionLoess();
        break;
      default:
        regression = window.d3.regressionLinear();
    }
    // Configure x/y accessor and domain, then compute the regression points.
    regression.x((d) => d[0]).y((d) => d[1]);
    const domainStart =
      regressionType === 'logarithmic' || regressionType === 'powerlaw' ? 1 : 0;
    regression.domain([domainStart, data.length - 1]);
    return regression(data);
  } catch (error) {
    // On failure, fall back to a linear regression.
    console.warn(`Regression ${regressionType} failed, falling back to linear`);
    return window.d3
        .regressionLinear()
        .x((d) => d[0])
        .y((d) => d[1])
        .domain([0, data.length - 1])(data);
  }
}
