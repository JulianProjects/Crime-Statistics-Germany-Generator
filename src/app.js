import {loadRdfStore, fetchIndicatorData as fetchIndicatorDataModule} from './data.js';
import {initCharts} from './charts.js';

// Application bootstrap: initialize Comunica, load RDF store and start charts.
let sparqlEngine = null;
let rdfStore = null;

export async function start() {
  try {
    if (typeof Comunica === 'undefined' || typeof N3 === 'undefined') {
      console.error('Comunica or N3 not loaded');
      return;
    }
    sparqlEngine = new Comunica.QueryEngine();
    rdfStore = await loadRdfStore();
    const dataRight = await fetchIndicatorDataModule(sparqlEngine, rdfStore, 'straft');
    const crimeSortedCities = dataRight.map((d) => d.city);
    // Pass a bound fetch function and the pre-sorted crime axis to the chart initializer.
    const boundFetch = fetchIndicatorDataModule.bind(null, sparqlEngine, rdfStore);
    initCharts(boundFetch, dataRight, crimeSortedCities);
  } catch (error) {
    console.error('Error starting application:', error);
  }
}
