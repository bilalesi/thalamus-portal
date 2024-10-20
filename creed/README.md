# thalamus_studio

To install dependencies

```
# install Bun runtime
curl -fsSL https://bun.sh/install | bash

# install dependencies
bun install

# this command will generate the schema of the database -> write it down in a schema.ts
# export data from nexus and write it down in sqlite database

bun run seed
```


### Start migrate studios from nexus fusion to static portals:

1. provide the sparql view self for the portal in `.env` file. (you can find it in the sparql query in network tab)
2. copy a token from fusion into `.env` file.
3. copy sparql queries per  workspace/dashboard into `nexus.ts`.
    - each object is a workspace
    - each object items are dashboards
    - each object item value is a sparql query.

### Entrypoint (seed.ts file):
The `seed.ts` file will generate the data based on the sparql query, 
which the response format is :

1. head (table columns)
2. results (table results)

the `seed.ts` file will generate the db schema and write it in a file to be managed by drizzle-orm
this is for thalamus studio so the table are generating based on

1. the workspaces (menu in blue)
2. dashboards (per menu item)

for thalamus is missing the videos
the tables should be renamed for different portals
