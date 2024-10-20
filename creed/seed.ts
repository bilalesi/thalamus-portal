import { create_table } from './db-tools';
import { experimental_data_result, digital_reconstruction_result, fetch_resource, downloadArtifacts } from './nexus';
import { $ } from "bun";

const script_name = process.env.DB_FILE_NAME!
let script = `
import { drizzle } from 'drizzle-orm/libsql';
import { sqliteTable, text,integer, blob, real } from "drizzle-orm/sqlite-core";
export const drz = drizzle("${script_name}");

export const artifacts = sqliteTable('artifacts', {
        id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
        self: text('self'),
        url: text('url'),
        name: text('name'),
        binary: blob({ mode: 'buffer' }),
        type: text('type'),
        size: real(),
});

    `;

const seed_db = async () => {
    const [
        morphology,
        electrophysiology,
        layer_anatomy,
        neuron_density,
        bouton_density,
    ] = experimental_data_result;
    const experimental_data = {
        morphology,
        electrophysiology,
        layer_anatomy,
        neuron_density,
        bouton_density,
    }

    const [
        single_cell_model,
        neuron_morphology,
        neuron_electrophysiology,
        fact_sheet,
        microcircuit_reconstruction,
    ] = digital_reconstruction_result;
    const digital_reconstruction = {
        single_cell_model,
        neuron_morphology,
        neuron_electrophysiology,
        fact_sheet,
        microcircuit_reconstruction,
    }
    // construct tables
    for (const o of Object.keys(experimental_data)) {
        const columns = experimental_data[o as keyof typeof experimental_data]["head"]["vars"];
        script = script + create_table(`exp_data_${o}`, columns) + "\n"
        const schema_file = Bun.file("schema.ts");
        const writer = schema_file.writer();
        writer.write(script);
    }

    for (const o of Object.keys(digital_reconstruction)) {
        const columns = digital_reconstruction[o as keyof typeof digital_reconstruction]["head"]["vars"];
        script = script + create_table(`dig_recons_${o}`, columns) + "\n"
        const schema_file = Bun.file("schema.ts");
        const writer = schema_file.writer();
        writer.write(script);
    }
    // push changes to db
    const output = await $`npx drizzle-kit push`.text();
    console.log('[output] \n', output)
    const final_results = [];
    const {
        drz,
        artifacts,
    } = await import('./schema');

    for (const o of Object.keys(experimental_data)) {
        console.log('[experimental_data]', o)
        const {
            exp_data_bouton_density,
            exp_data_electrophysiology,
            exp_data_layer_anatomy,
            exp_data_morphology,
            exp_data_neuron_density
        } = await import('./schema');
        const data = experimental_data[o as keyof typeof experimental_data]
        const results = data["results"]["bindings"].map((o: any) => {
            return Object.entries(o).map(([key, val]) => ({
                [key]: (val as unknown as any).value
            })).reduce((acc, cur) => ({ ...acc, ...cur }))
        });

        for (const item of results) {
            const resource = await fetch_resource(item.self);
            final_results.push({
                ...item,
                resource: JSON.stringify(resource),
            });
        }
        if (`exp_data_${o}` === "exp_data_bouton_density") {
            await drz.insert(exp_data_bouton_density).values(final_results).onConflictDoNothing({ target: exp_data_bouton_density.self });
        }
        if (`exp_data_${o}` === "exp_data_electrophysiology") {
            await drz.insert(exp_data_electrophysiology).values(final_results).onConflictDoNothing({ target: exp_data_electrophysiology.self });
        }
        if (`exp_data_${o}` === "exp_data_layer_anatomy") {
            await drz.insert(exp_data_layer_anatomy).values(final_results).onConflictDoNothing({ target: exp_data_layer_anatomy.self });
        }
        if (`exp_data_${o}` === "exp_data_morphology") {
            await drz.insert(exp_data_morphology).values(final_results).onConflictDoNothing({ target: exp_data_morphology.self });
        }
        if (`exp_data_${o}` === "exp_data_neuron_density") {
            await drz.insert(exp_data_neuron_density).values(final_results).onConflictDoNothing({ target: exp_data_neuron_density.self });
        }
    }

    for (const o of Object.keys(digital_reconstruction)) {
        console.log('[digital_reconstruction]', o)
        const {
            dig_recons_single_cell_model,
            dig_recons_neuron_morphology,
            dig_recons_neuron_electrophysiology,
            dig_recons_fact_sheet,
            dig_recons_microcircuit_reconstruction,
        } = await import('./schema');
        const data = digital_reconstruction[o as keyof typeof digital_reconstruction]
        const results = data["results"]["bindings"].map((o: any) => {
            return Object.entries(o).map(([key, val]) => ({
                [key]: (val as unknown as any).value
            })).reduce((acc, cur) => ({ ...acc, ...cur }))
        })
        for (const item of results) {
            const resource = await fetch_resource(item.self);
            final_results.push({
                ...item,
                resource: JSON.stringify(resource),
            })
        }

        if (`dig_recons_${o}` === "dig_recons_single_cell_model") {
            await drz.insert(dig_recons_single_cell_model).values(final_results).onConflictDoNothing({ target: dig_recons_single_cell_model.self });
        }
        if (`dig_recons_${o}` === "dig_recons_neuron_morphology") {
            await drz.insert(dig_recons_neuron_morphology).values(final_results).onConflictDoNothing({ target: dig_recons_neuron_morphology.self });
        }
        if (`dig_recons_${o}` === "dig_recons_neuron_electrophysiology") {
            await drz.insert(dig_recons_neuron_electrophysiology).values(final_results).onConflictDoNothing({ target: dig_recons_neuron_electrophysiology.self });
        }
        if (`dig_recons_${o}` === "dig_recons_fact_sheet") {
            await drz.insert(dig_recons_fact_sheet).values(final_results).onConflictDoNothing({ target: dig_recons_fact_sheet.self });
        }
        if (`dig_recons_${o}` === "dig_recons_microcircuit_reconstruction") {
            await drz.insert(dig_recons_microcircuit_reconstruction).values(final_results).onConflictDoNothing({ target: dig_recons_microcircuit_reconstruction.self });
        }
    }

    const binaries = await Promise.all(final_results.slice(0, 40).map((item: any) => downloadArtifacts(JSON.parse(item["resource"]))));
    console.log('binaries', binaries)
    const flatted_binaries = binaries.flat();
    console.log('flatted_binaries', flatted_binaries)
    if (flatted_binaries && flatted_binaries.length) await drz.insert(artifacts).values(flatted_binaries as any);
}


seed_db();
