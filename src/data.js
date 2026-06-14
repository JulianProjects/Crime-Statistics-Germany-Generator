// Data loading and SPARQL querying
// Load the local N-Triples file and parse it into an N3 store.
export async function loadRdfStore() {
  const response = await fetch(
      'https://cdn.jsdelivr.net/gh/juandmcr/Kriminalitaet-Deutschland@main/daten_indikatoren.nt',
  );
  const ntText = await response.text();
  const parser = new N3.Parser();
  const store = new N3.Store();
  return new Promise((resolve, reject) => {
    parser.parse(ntText, (error, quad) => {
      if (error) reject(error);
      else if (quad) store.addQuad(quad);
      else resolve(store);
    });
  });
}

// Execute a SPARQL query for the given `indicator` and return an array of {city, count}.
export async function fetchIndicatorData(sparqlEngine, rdfStore, indicator) {
  if (!sparqlEngine) throw new Error('SPARQL engine not initialized');
  if (!rdfStore) throw new Error('RDF store not loaded');
  const query = `
    PREFIX ind: <https://gitlab.dit.htwk-leipzig.de/results-sw/2026/stadt_kriminalitaet/indikator/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?kreisname ?value WHERE {
      ?kreis ind:${indicator} ?value .
      ?kreis rdfs:label ?kreisname .
    }
    ORDER BY ASC(?value)
  `;
  const result = await sparqlEngine.query(query, {sources: [rdfStore]});
  const data = [];
  if (result.resultType === 'bindings') {
    const stream = await result.execute();
    for await (const binding of stream) {
      const keys = Array.from(binding.keys());
      // Extract binding values by name; prefer English local variable names.
      const bindingName = binding.get(keys.find((k) => k.value === 'kreisname'));
      const bindingValue = binding.get(keys.find((k) => k.value === 'value'));
      if (!bindingName || !bindingValue) continue;
      const labelStr = bindingName.value || '';
      const valueStr = bindingValue.value || '0';
      const nameMatch = labelStr.match(/^"([^"]+)"/);
      const city = nameMatch ? nameMatch[1] : labelStr;
      const valueNum = parseFloat(valueStr);
      if (isNaN(valueNum)) continue;
      data.push({city, count: valueNum});
    }
  }
  return data;
}
