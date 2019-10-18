import DataType from "./DataType";

export interface ITypeLibraryOptions {
    onTypeLookup?: (t: string | object) => string | object;
    defaults?: {
        type: string;
        required?: boolean;
        additionalProperties?: boolean
    }
}

export default class TypeLibrary {

    readonly types: { [index: string]: DataType; };

    constructor(options: ITypeLibraryOptions);

    register(name: string, Clazz: { new(): DataType }): void;

    get(nameOrDef: any, silent?: boolean): any;

    static TYPESET: {
        RAML_1_0: 'RAML_1_0'
    }
}
