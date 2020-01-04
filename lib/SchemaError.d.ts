export class SchemaError extends Error {
    constructor(msg: string | Error, schemaStack: string[]);
}
