import DataType from "./DataType";

declare type TypeDef = string | object;

declare type TypeLookupMethod = (typeName: string) => TypeDef;

export interface ITypeLibraryOptions {
    lookupSchema?: TypeLookupMethod;
    defaults: ICompileOptions;
}

export interface ICompileOptions {
    operation?: 'get' | 'create' | 'update' | 'patch' | 'delete';
    resolvePromises?: boolean;
    strictFormat?: boolean;
    coerceTypes?: boolean;
    convertDates?: boolean;
    throwOnError?: boolean
    maxArrayErrors?: number;
    maxObjectErrors?: number;
    removeAdditional?: boolean | 'all';
    removeNull?: boolean;
    fastDateValidation?: boolean;
    fastObjectValidation?: boolean;

    [index: string]: any;
}

export declare type ValidateFunction = (value: any) => IValidationResult;

export interface IValidationError {
    message: string;
    errorType?: string;
    path?: string;

    [index: string]: any;
}

export interface IValidationResult {
    valid: boolean;
    value?: any;
    errors?: IValidationError[];
}

export interface TypeFactory {
    create?: (instance: object) => void;
    compile: (dataType: DataType, options?: ICompileOptions) => ValidateFunction;
    prepareCompileOptions?: (options?: ICompileOptions) => ICompileOptions;
    set?: (dataType: DataType, attribute:string, value: any) => any;
}

export default class TypeLibrary {
    protected _internals: { [name: string]: object };
    protected _cache: { [name: string]: object };
    protected _stacks: string[][];
    protected _unionTypeName: string;
    protected _arrayTypeName: string;
    protected _objectTypeName: string;
    schemas: { [index: string]: TypeDef };
    defaults: ICompileOptions;
    lookupSchema?: TypeLookupMethod;

    constructor(options: ITypeLibraryOptions);

    addDataType(name: string, factory: TypeFactory): void;

    addSchema(name: string, schema: object);

    compile(schema: string | object, options?: ICompileOptions): ValidateFunction;

    get(schema: string | object): DataType;

    reset();

    protected _createType(instance: object | DataType, schema: object): DataType;

    protected _normalizeSchema(schema: TypeDef): object;

    protected _parseTypeName(v: string): TypeDef;

}
