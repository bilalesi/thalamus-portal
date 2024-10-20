
export const experimentalDataList = {
    morphology: "Morphology",
    electrophysiology: "Electrophysiology",
    layer_anatomy: "Layer anatomy",
    neuron_density: "Neuron density",
    bouton_density: "Bouton density",
}


export const digitalReconstructionList = {
    single_cell_model: "Single Cell",
    neuron_morphology: "Neuron Morphology",
    neuron_electrophysiology: "Neuron Electrophysiology",
    fact_sheet: "Fact Sheet",
    microcircuit_reconstruction: "Microcircuit Reconstruction",
}

export const workspacesList = {
    "exp_data": "Experimental Data",
    "dig_recons": "Digital Reconstruction",
}

export type ExperimentalDataListKeys = keyof typeof experimentalDataList;
export type DigitalReconstructionListKeys = keyof typeof digitalReconstructionList;

export const pagesMapping = {
    "exp_data-morphology": "Experimental Data - Morphology",
    "exp_data-electrophysiology": "Experimental Data - Electrophysiology",
    "exp_data-bouton_density": "Experimental Data - Bouton Density",
    "exp_data-layer_anatomy": "Experimental Data - Layer Anatomy",
    "exp_data-neuron_density": "Experimental Data - Neuron Density",
    "dig_recons-fact_sheet": "Digital Reconstruction - Fact Sheet",
    "dig_recons-microcircuit_reconstruction": "Digital Reconstruction - Microcircuit Reconstruction",
    "dig_recons-neuron_morphology": "Digital Reconstruction - Neuron Morphology",
    "dig_recons-neuron_electrophysiology": "Digital Reconstruction - Neuron Electrophysiology",
    "dig_recons-single_cell_model": "Digital Reconstruction - Single Cell Model",
}

export const getPageMapping = (ws: string, type: string) => pagesMapping[`${ws}-${type}` as keyof typeof pagesMapping];

export type Distribution = {
    contentUrl: string
    name: string;
    contentSize: { value: number };
    encodingFormat: string;
}

export type Resource = {
    name: string;
    _self: string;
    distribution: Array<Distribution>
}