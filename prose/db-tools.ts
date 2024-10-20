export const create_table = (title: string, columns: Array<string>) => {
    const db_columns = [
        ...columns.map(clm => {
            if (clm === "self") return `${clm}: text('self').primaryKey(),`

            return `${clm}: text('${clm}'),`
        }),
        `resource: text({ mode: 'json' }),`,
    ]

    return `
export const ${title} = sqliteTable('${title}', { 
    ${db_columns.join("\n")} 
});
    `.toString()
}

export const ensureArray = (obj: any) => {
    if (Array.isArray(obj)) return obj;
    else return [obj];
}