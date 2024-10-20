
import { drizzle } from 'drizzle-orm/libsql';
import { sqliteTable, text, integer, blob, real } from "drizzle-orm/sqlite-core";
export const drz = drizzle("file:thalamus.sqlite");

export const artifacts = sqliteTable('artifacts', {
        id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
        self: text('self'),
        url: text('url'),
        name: text('name'),
        binary: blob({ mode: 'buffer' }),
        type: text('type'),
        size: real(),
});


export const exp_data_morphology = sqliteTable('exp_data_morphology', {
        self: text('self').primaryKey(),
        name: text('name'),
        brainRegion: text('brainRegion'),
        mtype: text('mtype'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        subjectAge: text('subjectAge'),
        resource: text({ mode: 'json' }),
});


export const exp_data_electrophysiology = sqliteTable('exp_data_electrophysiology', {
        self: text('self').primaryKey(),
        experiment: text('experiment'),
        etype: text('etype'),
        brainRegion: text('brainRegion'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        subjectAge: text('subjectAge'),
        resource: text({ mode: 'json' }),
});


export const exp_data_layer_anatomy = sqliteTable('exp_data_layer_anatomy', {
        self: text('self').primaryKey(),
        brainRegion: text('brainRegion'),
        layerThickness: text('layerThickness'),
        description: text('description'),
        subjectSpecies: text('subjectSpecies'),
        subjectAge: text('subjectAge'),
        contributor: text('contributor'),
        license: text('license'),
        resource: text({ mode: 'json' }),
});


export const exp_data_neuron_density = sqliteTable('exp_data_neuron_density', {
        self: text('self').primaryKey(),
        brainRegion: text('brainRegion'),
        neuronDensity: text('neuronDensity'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        subjectAge: text('subjectAge'),
        resource: text({ mode: 'json' }),
});


export const exp_data_bouton_density = sqliteTable('exp_data_bouton_density', {
        self: text('self').primaryKey(),
        name: text('name'),
        brainRegion: text('brainRegion'),
        density: text('density'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        subjectAge: text('subjectAge'),
        resource: text({ mode: 'json' }),
});


export const dig_recons_single_cell_model = sqliteTable('dig_recons_single_cell_model', {
        self: text('self').primaryKey(),
        name: text('name'),
        mType: text('mType'),
        eType: text('eType'),
        brainRegion: text('brainRegion'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        morphology: text('morphology'),
        electrophysiology: text('electrophysiology'),
        resource: text({ mode: 'json' }),
});


export const dig_recons_neuron_morphology = sqliteTable('dig_recons_neuron_morphology', {
        self: text('self').primaryKey(),
        name: text('name'),
        mtype: text('mtype'),
        brainRegion: text('brainRegion'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        resource: text({ mode: 'json' }),
});


export const dig_recons_neuron_electrophysiology = sqliteTable('dig_recons_neuron_electrophysiology', {
        self: text('self').primaryKey(),
        name: text('name'),
        mType: text('mType'),
        eType: text('eType'),
        brainRegion: text('brainRegion'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        resource: text({ mode: 'json' }),
});


export const dig_recons_fact_sheet = sqliteTable('dig_recons_fact_sheet', {
        self: text('self').primaryKey(),
        name: text('name'),
        mType: text('mType'),
        eType: text('eType'),
        brainRegion: text('brainRegion'),
        totalAxonLength: text('totalAxonLength'),
        totalDendriteLength: text('totalDendriteLength'),
        restingMembranePotential: text('restingMembranePotential'),
        inputResistance: text('inputResistance'),
        membraneTimeConstant: text('membraneTimeConstant'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        resource: text({ mode: 'json' }),
});


export const dig_recons_microcircuit_reconstruction = sqliteTable('dig_recons_microcircuit_reconstruction', {
        self: text('self').primaryKey(),
        name: text('name'),
        brainRegion: text('brainRegion'),
        contributor: text('contributor'),
        license: text('license'),
        subjectSpecies: text('subjectSpecies'),
        resource: text({ mode: 'json' }),
});

