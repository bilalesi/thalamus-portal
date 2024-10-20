import { ensureArray } from "./db-tools";

const url = process.env.NEXUS_VIEW_URI;
const token = "Bearer xxx";

const experimental_data = {
    morphology: `
PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT DISTINCT ?self ?name ?brainRegion ?mtype (GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license ?subjectSpecies (CONCAT(STR(?ageValue), " ", ?ageUnit, " ", ?agePeriod) AS ?subjectAge  )
WHERE {
?entity nxv:self ?self_wo_rev ;
        a nsg:NeuronMorphology ;
        schema:name ?name ;
        nxv:createdBy ?registered_by ;
        nxv:createdAt ?registeredAt ;
        schema:distribution / schema:encodingFormat "application/swc" ;
        nxv:rev ?rev ;
        nxv:deprecated false .
GRAPH ?g { OPTIONAL {
    ?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion } } .
BIND (STR(?registered_by) AS ?registered_by_str) .
OPTIONAL { ?entity nsg:annotation ?mtypeAnnotation. 
            ?mtypeAnnotation a nsg:MTypeAnnotation ;
                            nsg:hasBody / rdfs:label ?mtype } .
OPTIONAL { ?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies } .
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL { ?agent schema:givenName ?givenName } .
OPTIONAL { ?agent schema:familyName ?familyName } . 
OPTIONAL { ?agent schema:name ?orgName } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:value ?ageValue } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:unitCode ?ageUnit } .
OPTIONAL { ?entity nsg:subject / nsg:age / nsg:period ?agePeriod } . 
OPTIONAL { ?entity schema:license ?license } . 
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
BIND ( IRI( CONCAT(STR(?self_wo_rev), "?rev=", STR(?rev)) ) AS ?self ) .
FILTER NOT EXISTS { ?entity schema:isPartOf ?part } .
        
} 
GROUP BY ?self ?entity ?name ?registered_by ?registeredAt ?registered_by_str ?g ?registeredBy ?brainRegion ?mtype ?ageValue ?ageUnit ?agePeriod ?subjectAge ?subjectSpecies ?license
LIMIT 1000       
`,
    electrophysilogy: `
    PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?self ?experiment ?etype ?brainRegion (GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license ?subjectSpecies (CONCAT(STR(?ageValue), " ", ?ageUnit, " ", ?agePeriod) AS ?subjectAge)

WHERE {
?entity nxv:self ?self_wo_rev ;
    a nsg:Trace ;
    nxv:rev ?rev ;
    nxv:deprecated false ;
    schema:identifier ?experiment ;
    skos:note ?session ;
    schema:distribution / schema:encodingFormat "application/nwb" .
GRAPH ?g {
  ?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion .
OPTIONAL { ?entity nsg:annotation ?etypeAnnotation . 
          ?etypeAnnotation a nsg:ETypeAnnotation ;
                           nsg:hasBody / rdfs:label ?etype } .
} .
OPTIONAL { ?entity schema:dateCreated ?experimentDate } .
OPTIONAL { ?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:value ?ageValue } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:unitCode ?ageUnit } .
OPTIONAL { ?entity nsg:subject / nsg:age / nsg:period ?agePeriod } .  
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL { ?agent schema:givenName ?givenName } .
OPTIONAL { ?agent schema:familyName ?familyName } . 
OPTIONAL { ?agent schema:name ?orgName } .
OPTIONAL { ?entity schema:license ?license } .
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
BIND( IRI(CONCAT( STR(?self_wo_rev), "?rev=", STR(?rev))) AS ?self) .
} 
GROUP BY ?self ?entity ?name ?experiment ?experimentDate ?brainRegion ?etype ?ageValue ?ageUnit ?agePeriod ?subjectAge ?subjectSpecies ?license ?g
LIMIT 2000          
`,
    layer_antaomy: `
    PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?self ?brainRegion (CONCAT(STR(?thicknessValue), " ", ?thicknessUnit) AS ?layerThickness)  
?description  ?subjectSpecies (CONCAT(STR(?ageValue), " ", ?ageUnit, " ", ?agePeriod) AS ?subjectAge) (GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license
WHERE { 
?entity nxv:self ?self_wo_rev ; 
    a nsg:LayerThickness ;
    nxv:deprecated false ;
    nxv:rev ?rev ;
    nsg:series ?meanSeries ;
    nsg:series ?nSeries .
?meanSeries nsg:statistic "mean" .
?meanSeries schema:value ?thicknessValue .
?meanSeries schema:unitCode ?thicknessUnit .
?nSeries nsg:statistic "N" .
?nSeries schema:value ?nValue . 
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL {?agent schema:givenName ?givenName } .
OPTIONAL {?agent schema:familyName ?familyName } . 
OPTIONAL {?agent schema:name ?orgName } .
OPTIONAL {?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies  } .
OPTIONAL {?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion } .
OPTIONAL {?entity schema:description ?description } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:value ?ageValue } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:unitCode ?ageUnit } .
OPTIONAL { ?entity nsg:subject / nsg:age / nsg:period ?agePeriod } .
OPTIONAL { ?entity schema:license ?license } .  
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
BIND( IRI(CONCAT( STR(?self_wo_rev),  "?rev=", STR(?rev))) AS ?self) .
} 
GROUP BY ?self ?entity ?name ?meanSeries ?thicknessValue ?thicknessUnit ?nValue 
?nSeries ?description ?brainRegion ?subjectSpecies ?ageValue ?ageUnit ?agePeriod ?subjectAge ?license

LIMIT 1000                                
`,
    neuron_density: `
PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?self ?brainRegion (CONCAT(STR(?densityValue), " ", ?densityUnit) AS ?neuronDensity)  
(GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license ?subjectSpecies (CONCAT(STR(?ageValue), " ", ?ageUnit, " ", ?agePeriod) AS ?subjectAge)
WHERE {  
?entity nxv:self ?self_wo_rev ; 
    a nsg:NeuronDensity ;
    nxv:rev ?rev ;
    nxv:deprecated false ;
    nsg:series ?meanSeries ;
    nsg:series ?nSeries .
?meanSeries nsg:statistic ?stat .
FILTER ( ?stat = "mean" ||
     ?stat = "data point" ) .
?meanSeries schema:value ?densityValue .
?meanSeries schema:unitCode ?densityUnit .
?nSeries nsg:statistic "N" .
?nSeries schema:value ?nValue .
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL {?agent schema:givenName ?givenName } .
OPTIONAL {?agent schema:familyName ?familyName } . 
OPTIONAL {?agent schema:name ?orgName } .
OPTIONAL {?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies  } .
OPTIONAL {?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion } .
OPTIONAL {?entity schema:description ?description } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:value ?ageValue } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:unitCode ?ageUnit } .
OPTIONAL { ?entity nsg:subject / nsg:age / nsg:period ?agePeriod } .
OPTIONAL {?entity schema:license ?license } .
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
BIND( IRI(CONCAT( STR(?self_wo_rev),  "?rev=", STR(?rev))) AS ?self)
} 
GROUP BY ?self ?entity ?name ?meanSeries ?ageValue ?ageUnit ?agePeriod ?densityValue ?densityUnit ?nValue ?nSeries ?description ?brainRegion ?subjectSpecies ?license

LIMIT 1000                                 
`,
    bouton_density: `
PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT DISTINCT ?self 
?name 
?brainRegion
(CONCAT(STR(?denValue)," ", ?denUnit) AS ?density)  
(GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor)
?license 
?subjectSpecies
(CONCAT(STR(?ageValue), " ", ?ageUnit, " ", ?agePeriod) AS ?subjectAge)

WHERE { 
?entity nxv:self ?self_wo_rev ; 
    rdf:type nsg:BoutonDensity ;
    schema:name ?name ;
    nxv:deprecated false ;
    nxv:rev ?rev ;
    nsg:series ?denMean .
?denMean nsg:statistic "mean" ;
     schema:value ?denValue ;
    schema:unitCode ?denUnit .
OPTIONAL {?entity nsg:mType / rdfs:label ?mType } .
OPTIONAL {?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies  } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:value ?ageValue } .
OPTIONAL { ?entity nsg:subject / nsg:age / schema:unitCode ?ageUnit } .
OPTIONAL { ?entity nsg:subject / nsg:age / nsg:period ?agePeriod } .
GRAPH ?g { OPTIONAL {?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion } } .
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL {?agent schema:givenName ?givenName } .
OPTIONAL {?agent schema:familyName ?familyName } . 
OPTIONAL {?agent schema:name ?orgName } .
OPTIONAL {?entity schema:license ?license } .
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
BIND( IRI(CONCAT( STR(?self_wo_rev),  "?rev=", STR(?rev))) AS ?self) .
    
}
GROUP BY ?self ?entity ?name ?denMean ?denValue ?denUnit  ?mType ?subjectSpecies ?g ?brainRegion ?ageValue ?ageUnit ?agePeriod ?subjectAge ?license  
LIMIT 1000 
`,
};

const digital_reconstruction = {
    single_cell_model: `
    PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX bmo: <http://www.w3.org/2004/02/skos/core#>
SELECT DISTINCT ?self ?name ?mType ?eType ?brainRegion (GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license ?subjectSpecies ?morphology
?electrophysiology

WHERE {
?entity nxv:self ?self_wo_rev ;
    nxv:rev ?rev ;
    a nsg:MEModel ; 
    schema:name ?name ;
    nxv:deprecated false .
GRAPH ?g { OPTIONAL {
  ?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion } .
?entity nsg:annotation ?mtype_annotation .
?mtype_annotation a nsg:MTypeAnnotation ;
          nsg:hasBody / rdfs:label ?mType .
?entity nsg:annotation ?etype_annotation .
?etype_annotation a nsg:ETypeAnnotation ;
          nsg:hasBody / rdfs:label ?eType } .
?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies .
?entity nsg:contribution / prov:agent ?agent .
?entity ^schema:isPartOf ?morph .
?morph a nsg:NeuronMorphology ;
       schema:name ?morphology .
?entity ^schema:isPartOf ?trace .
?trace a nsg:Trace ;
       nxv:deprecated false ;
       schema:name ?electrophysiology .
OPTIONAL { ?agent schema:givenName ?givenName } .
OPTIONAL { ?agent schema:familyName ?familyName } . 
OPTIONAL { ?agent schema:name ?orgName } . 
OPTIONAL { ?entity schema:license ?license } . 
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
BIND ( IRI( CONCAT(STR(?self_wo_rev), "?rev=", STR(?rev)) ) AS ?self ) .
    
} 
GROUP BY ?self ?entity ?name ?g ?brainRegion ?mType ?eType ?ageValue ?ageUnit ?agePeriod ?subjectAge ?subjectSpecies ?license ?morphology ?electrophysiology
LIMIT 1000`,
    neuron_morphology: `
PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT DISTINCT ?self ?name ?mtype ?brainRegion (GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license ?subjectSpecies

WHERE {
?entity nxv:self ?self_wo_rev ;
    nxv:rev ?rev ;
    a nsg:NeuronMorphology ;
    schema:name ?name ;
    schema:distribution / schema:encodingFormat "application/swc" ;
    nxv:deprecated false ;
    schema:isPartOf ?dataset .
GRAPH ?g { OPTIONAL {
  ?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion } } .
OPTIONAL { ?entity nsg:annotation / nsg:hasBody / rdfs:label ?mtype } .
OPTIONAL { ?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies } .
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL { ?agent schema:givenName ?givenName } .
OPTIONAL { ?agent schema:familyName ?familyName } . 
OPTIONAL { ?agent schema:name ?orgName } .
OPTIONAL { ?entity schema:license ?license } . 
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
BIND ( IRI( CONCAT(STR(?self_wo_rev), "?rev=", STR(?rev)) ) AS ?self ) .
    
} 
GROUP BY ?self ?entity ?name ?g ?brainRegion ?mtype ?ageValue ?ageUnit ?agePeriod ?subjectAge ?subjectSpecies ?license ?dataset
LIMIT 1000
`,
    neuron_electrophysiology: `
PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?self ?name ?mType ?eType ?brainRegion (GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license ?subjectSpecies

WHERE {
?entity nxv:self ?self_wo_rev ;
    nxv:rev ?rev ;
    a nsg:SingleCellSimulationTrace ;
    nxv:deprecated false ;
    schema:name ?name ;
    nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion ;
    schema:distribution / schema:encodingFormat "application/nwb" .
GRAPH ?g { ?entity nsg:annotation ?mtype_annotation .
?mtype_annotation a nsg:MTypeAnnotation ;
          nsg:hasBody / rdfs:label ?mType .
?entity nsg:annotation ?etype_annotation .
?etype_annotation a nsg:ETypeAnnotation ;
          nsg:hasBody / rdfs:label ?eType } .
OPTIONAL { ?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies } .
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL { ?agent schema:givenName ?givenName } .
OPTIONAL { ?agent schema:familyName ?familyName } . 
OPTIONAL { ?agent schema:name ?orgName } .
OPTIONAL { ?entity schema:license ?license } .
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
BIND ( IRI( CONCAT(STR(?self_wo_rev), "?rev=", STR(?rev)) ) AS ?self ) .
} 
GROUP BY ?self ?entity ?name ?brainRegion ?mType ?eType ?mtype_annotation ?etype_annotation ?subjectSpecies ?license ?g
LIMIT 2000`,
    fact_sheet: `
PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX bmo: <http://www.w3.org/2004/02/skos/core#>
PREFIX vocab: <https://bbp.epfl.ch/nexus/v1/resources/public/thalamus/_/>
SELECT DISTINCT ?self ?name ?mType ?eType ?brainRegion 
(CONCAT(STR(?fact1_value), " ", ?fact1_unitCode) AS ?totalAxonLength )
(CONCAT(STR(?fact2_value), " ", ?fact2_unitCode) AS ?totalDendriteLength )
(CONCAT(STR(?fact3_value), " ", ?fact3_unitCode) AS ?restingMembranePotential )
(CONCAT(STR(?fact4_value), " ", ?fact4_unitCode) AS ?inputResistance )
(CONCAT(STR(?fact5_value), " ", ?fact5_unitCode) AS ?membraneTimeConstant )
(GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license ?subjectSpecies


WHERE {
?entity nxv:self ?self ;
    a nsg:METypeFactSheet ;
    schema:name ?name ;
    nxv:deprecated false .
GRAPH ?g { OPTIONAL {
  ?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion } .
?entity nsg:annotation ?mtype_annotation .
?mtype_annotation a nsg:MTypeAnnotation ;
          nsg:hasBody / rdfs:label ?mType .
?entity nsg:annotation ?etype_annotation .
?etype_annotation a nsg:ETypeAnnotation ;
          nsg:hasBody / rdfs:label ?eType } .
?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies .
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL { ?agent schema:givenName ?givenName } .
OPTIONAL { ?agent schema:familyName ?familyName } . 
OPTIONAL { ?agent schema:name ?orgName } . 
OPTIONAL { ?entity schema:license ?license } . 
OPTIONAL { ?entity vocab:fact ?fact1 .
            ?fact1 schema:name "total axon length" ;
                   schema:unitCode ?fact1_unitCode ;
                   schema:value ?fact1_value } .
OPTIONAL { ?entity vocab:fact ?fact2 .
            ?fact2 schema:name "total dendrite length" ;
                   schema:unitCode ?fact2_unitCode ;
                   schema:value ?fact2_value } .
OPTIONAL { ?entity vocab:fact ?fact3 .
            ?fact3 schema:name "resting membrane potential" ;
                   schema:unitCode ?fact3_unitCode ;
                   schema:value ?fact3_value } .
OPTIONAL { ?entity vocab:fact ?fact4 .
            ?fact4 schema:name "input resistance" ;
                   schema:unitCode ?fact4_unitCode ;
                   schema:value ?fact4_value } . 
OPTIONAL { ?entity vocab:fact ?fact5 .
            ?fact5 schema:name "membrane time constant" ;
                   schema:unitCode ?fact5_unitCode ;
                   schema:value ?fact5_value } .
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .
    
} 
GROUP BY ?self ?entity ?name ?g ?brainRegion ?mType ?eType ?subjectSpecies ?license ?fact1 ?fact1_unitCode ?fact1_value
?fact2 ?fact2_unitCode ?fact2_value ?fact3 ?fact3_unitCode ?fact3_value ?fact4 ?fact4_unitCode ?fact4_value ?fact5 ?fact5_unitCode ?fact5_value
LIMIT 1000`,
    microcircuit_reconstruction: `
PREFIX nxv: <https://bluebrain.github.io/nexus/vocabulary/>
PREFIX nsg: <https://neuroshapes.org/>
PREFIX schema: <http://schema.org/>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX bmo: <http://www.w3.org/2004/02/skos/core#>
PREFIX vocab: <https://bbp.epfl.ch/nexus/v1/resources/public/thalamus/_/>
SELECT DISTINCT ?self ?name ?brainRegion 
(GROUP_CONCAT(DISTINCT ?cont; SEPARATOR=", ") AS ?contributor) ?license ?subjectSpecies


WHERE {
?entity nxv:self ?self_wo_rev ;
    a nsg:Circuit ;
    nxv:rev ?rev ;
    schema:name ?name ;
    nxv:deprecated false .
GRAPH ?g { OPTIONAL {
?entity nsg:brainLocation / nsg:brainRegion / rdfs:label ?brainRegion } .
?entity nsg:subject / nsg:species / rdfs:label ?subjectSpecies } .
?entity nsg:contribution / prov:agent ?agent .
OPTIONAL { ?agent schema:givenName ?givenName } .
OPTIONAL { ?agent schema:familyName ?familyName } . 
OPTIONAL { ?agent schema:name ?orgName } . 
OPTIONAL { ?entity schema:license ?license } .
BIND(COALESCE(?orgName, CONCAT(?givenName, " ", ?familyName)) AS ?cont ) .  
BIND ( IRI( CONCAT(STR(?self_wo_rev), "?rev=", STR(?rev)) ) AS ?self ) .
} 
GROUP BY ?self ?entity ?name ?g ?brainRegion ?subjectSpecies ?license
LIMIT 1000`,

}

const fetch_query = async (query: string) => {
    const response = await fetch(url, {
        "credentials": "include",
        "headers": {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "text/plain",
            "Authorization": token,
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Priority": "u=4",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://bbp.epfl.ch/nexus/v1/views/public/thalamus/https%3A%2F%2Fbluebrain.github.io%2Fnexus%2Fvocabulary%2F20240305SparqlIndex/sparql",
        "body": query,
        "method": "POST",
        "mode": "cors"
    })
    return await response.json()
}

export const fetch_resource = async (url: string, type: "blob" | "json" = "json") => {
    const resp = await fetch(url, {
        "credentials": "include",
        "headers": {
            "Accept": type === "json" ? "application/json" : "*/*",
            "Content-Type": "application/json",
            "Authorization": token,
        },
        "method": "get",
        "mode": "cors"
    });
    if (type === "json") return await resp.json();
    else if (type === "blob") {
        console.log('@@@blob')
        return await (await resp.blob()).arrayBuffer()
    };

}

function isObject(value: any) {
    return value !== null && typeof value === 'object';
}

export const downloadArtifacts = async (resource: any) => {
    try {
        if (isObject(resource) && "distribution" in resource) {
            const distributions = ensureArray(resource.distribution);
            const artifacts = [];
            for (const distr of distributions) {
                if ("contentUrl" in distr) {
                    const self = resource["_self"];
                    const binary = await fetch_resource(distr.contentUrl, "blob");
                    const type = distr["encodingFormat"];
                    const name = distr["name"];
                    const size = distr["contentSize"]["value"];
                    const url = distr.contentUrl;
                    artifacts.push({
                        self, url, binary, name, size, type,
                    });
                }
            }
            return artifacts;
        }
    } catch (error) {
        console.log('@@error', error)
    }
}


export const experimental_data_result = await Promise.all(Object.values(experimental_data).map((query) => {
    return fetch_query(query);
}))

export const digital_reconstruction_result = await Promise.all(Object.values(digital_reconstruction).map((query) => {
    return fetch_query(query);
}))

