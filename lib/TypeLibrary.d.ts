import {DataType} from "./DataType";

declare type TypeDef = string | object;

declare type TypeLookupMethod = (typeName: string) => TypeDef;

export interface ITypeLibraryOptions {
    lookupSchema?: TypeLookupMethod;
    defaults: ILibraryDefaults;
}

export interface ILibraryDefaults {
    propertiesRequired?: boolean;
    additionalProperties?: boolean;
    type?: string;
    throwOnError?: boolean;
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

export type ValidateFunction = (value: any) => IValidationResult;

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
    generate: (dataType: DataType, options?: ICompileOptions, orgOptions?: ICompileOptions) => ValidateFunction;
    prepareCompileOptions?: (options?: ICompileOptions) => ICompileOptions;
    set?: (dataType: DataType, attribute: string, value: any, parentSchema: object) => any;
}

export class TypeLibrary {
    protected _internals: { [name: string]: object };
    protected _cache: { [name: string]: object };
    protected _stacks: string[][];
    protected _unionTypeName: string;
    protected _arrayTypeName: string;
    protected _objectTypeName: string;
    schemas: { [index: string]: TypeDef };
    defaults: ICompileOptions;
    lookupSchema?: TypeLookupMethod;

    constructor(options?: ITypeLibraryOptions);

    add(name: string, schema: object);

    clearCache();

    generate(schema: string | object, options?: ICompileOptions): ValidateFunction;

    define(name: string, factory: TypeFactory): void;

    use(name: string, library: TypeLibrary): void;

    protected _create(schema: string | object): DataType;

    protected _createType(instance: object | DataType, schema: object): DataType;

    protected _normalizeSchema(schema: TypeDef): object;

    protected _parseTypeName(v: string): TypeDef;

}
