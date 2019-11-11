export default class TypeDefError extends Error {
    constructor(msg: string | Error, schemaStack: string[]);
}
