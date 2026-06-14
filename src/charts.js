import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {deduplicateCities, getRegression} from './utils.js';
import {renderFullTable, renderExtremesTable} from './renderers.js';
import {FIXED_WIDTH, FIXED_HEIGHT, MARGIN} from './constants.js';

// Draw a scatter plot into the given SVG element.
// Options:
//  - useCrimeAxis: when true, use `crimeSortedCities` as x-domain (pre-sorted axis)
//  - isLeftPlot: whether this is the left-side plot (affects empty-title behavior)
//  - graphTitleLeft: d3 selection of title element (optional)
//  - currentRegressionType: regression algorithm string
//  - crimeSortedCities: optional ordered list of city names for x-axis
export function drawScatter(
    svg,
    data,
    {
      useCrimeAxis = false,
      isLeftPlot = false,
      graphTitleLeft = null,
      currentRegressionType = 'linear',
      crimeSortedCities = [],
    } = {},
) {
  svg.selectAll('circle').remove();
  svg.selectAll('g').remove();
  svg.selectAll('path').remove();

  const uniqueData = deduplicateCities(data);
  if (!uniqueData.length) {
    // If there's no data, show a short 'No selection' label on the left plot.
    if (isLeftPlot && graphTitleLeft) graphTitleLeft.text('No selection');
    return;
  }

  const xDomain =
    useCrimeAxis && crimeSortedCities.length ?
      crimeSortedCities :
      uniqueData.map((d) => d.city);

  const xScale = d3
      .scalePoint()
      .domain(xDomain)
      .range([MARGIN + 30, FIXED_WIDTH - MARGIN - 30]);

  const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(uniqueData, (d) => d.count)])
      .range([FIXED_HEIGHT - MARGIN, MARGIN + 30]);

  const isMobile = window.innerWidth <= 768;
  const axisFontSize = isMobile ? '10px' : '12px';

  svg
      .append('g')
      .attr('transform', `translate(0,${FIXED_HEIGHT - MARGIN})`)
      .style('font-size', axisFontSize)
      .call(d3.axisBottom(xScale).tickFormat(''))
      .selectAll('text')
      .style('display', 'none');

  svg
      .append('g')
      .attr('transform', `translate(${MARGIN},0)`)
      .style('font-size', isMobile ? '10px' : '14px')
      .call(d3.axisLeft(yScale));

  svg
      .selectAll('circle')
      .data(uniqueData)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.city))
      .attr('cy', (d) => yScale(d.count))
      .attr('r', isMobile ? 1.5 : 2)
      .attr('fill', 'black');

  const regressionData = uniqueData.map((d, i) => {
    const xVal =
      currentRegressionType === 'logarithmic' || currentRegressionType === 'powerlaw' ?
        i + 1 :
        i;
    return [xVal, d.count];
  });
  const regressionLine = getRegression(currentRegressionType, regressionData);
  const lineGen = d3
      .line()
      .x((d) => {
        let idx = d[0];
        if (currentRegressionType === 'logarithmic' || currentRegressionType === 'powerlaw') {
          idx = Math.max(0, idx - 1);
        }
        return xScale(xDomain[Math.round(idx)]);
      })
      .y((d) => yScale(d[1]));

  svg
      .append('path')
      .datum(regressionLine)
      .attr('d', lineGen)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
}

// Initialize charts and wire UI controls.
// `fetchIndicatorDataFunc` should be a function that returns indicator data.
export function initCharts(fetchIndicatorDataFunc, dataRight = [], crimeSortedCities = []) {
  const isMobile = window.innerWidth <= 768;
  const container = d3.select('body').select('#chartsContainer');
  if (container.empty()) return;

  const svgLeft = container
      .append('svg')
      .attr('viewBox', `0 0 ${FIXED_WIDTH} ${FIXED_HEIGHT}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('border', '2px solid black')
      .style('width', '100%')
      .style('height', 'auto');

  const svgRight = container
      .append('svg')
      .attr('viewBox', `0 0 ${FIXED_WIDTH} ${FIXED_HEIGHT}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('border', '2px solid black')
      .style('width', '100%')
      .style('height', 'auto');

  const graphTitleLeft = svgLeft
      .append('text')
      .attr('x', FIXED_WIDTH / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', isMobile ? '14px' : '16px')
      .style('font-weight', 'bold')
      .text('No selection');

  svgRight
      .append('text')
      .attr('x', FIXED_WIDTH / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', isMobile ? '14px' : '16px')
      .style('font-weight', 'bold')
      .text('Crimes per 100,000 inhabitants (2022)');

  svgRight
      .append('text')
      .attr('x', FIXED_WIDTH / 2)
      .attr('y', FIXED_HEIGHT - MARGIN + 35)
      .attr('text-anchor', 'middle')
      .style('font-size', isMobile ? '10px' : '12px')
      .style('fill', '#333')
      .text('400 districts (ascending)');

  svgLeft
      .append('text')
      .attr('x', FIXED_WIDTH / 2)
      .attr('y', FIXED_HEIGHT - MARGIN + 35)
      .attr('text-anchor', 'middle')
      .style('font-size', isMobile ? '10px' : '12px')
      .style('fill', '#333')
      .text('400 districts (ascending)');

  let dataLeft = [];
  let currentRegressionType = 'linear';

  const leftOptions = {
    useCrimeAxis: true,
    isLeftPlot: true,
    graphTitleLeft,
    currentRegressionType,
    crimeSortedCities,
  };
  const rightOptions = {
    useCrimeAxis: false,
    isLeftPlot: false,
    currentRegressionType,
    crimeSortedCities,
  };

  drawScatter(svgLeft, dataLeft, leftOptions);
  drawScatter(svgRight, dataRight, rightOptions);

  renderExtremesTable('indicatorTable', []);
  // Populate the right-hand full table with the crime indicator values.
  renderFullTable('straftTable', dataRight);

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', (e) => {
      if (e.target.checked) {
        checkboxes.forEach((other) => {
          if (other !== e.target) other.checked = false;
        });
      }
    });
  });

  document.getElementById('regressionType').addEventListener('change', (e) => {
    currentRegressionType = e.target.value;
    leftOptions.currentRegressionType = currentRegressionType;
    rightOptions.currentRegressionType = currentRegressionType;
    drawScatter(svgLeft, dataLeft, leftOptions);
    drawScatter(svgRight, dataRight, rightOptions);
  });

  // Wire the confirm button (id changed to 'confirm').
  document.getElementById('confirm').addEventListener('click', async () => {
    const checked = document.querySelector('input[type="checkbox"]:checked');
    if (!checked) {
      graphTitleLeft.text('No selection');
      dataLeft = [];
      drawScatter(svgLeft, dataLeft, leftOptions);
      renderExtremesTable('indicatorTable', []);
      return;
    }
    const indicator = checked.value;
    const categoryName = checked.name;
    const label = checked.parentElement.textContent.trim();
    try {
      // Fetch data for the selected indicator and update left chart.
      dataLeft = await fetchIndicatorDataFunc(indicator);
    } catch (error) {
      console.error('Error fetching indicator data:', error);
      dataLeft = [];
    }
    graphTitleLeft.text(`${categoryName}: ${label}`);
    drawScatter(svgLeft, dataLeft, leftOptions);
    renderExtremesTable('indicatorTable', dataLeft);
  });
}
