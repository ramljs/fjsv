import {DataType} from "./DataType";

declare type TypeDef = string | object;

declare type TypeLookupMethod = (typeName: string) => TypeDef;

export interface TypeSchema {
    type: string;
}

export interface TypeFactory {
    create?: (instance: DataType) => void;
    generate: (base: DataType, options?: IGenerateOptions, orgOptions?: IGenerateOptions) => ValidateFunction;
    normalizeCompileOptions?: (options?: IGenerateOptions) => IGenerateOptions;
    normalizeAttribute: (attr: string, value: any, schema?: any) => any;
}

export interface IGenerateOptions {
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
    operation?: 'get' | 'create' | 'update' | 'patch' | 'delete';

    [index: string]: any;
}

export type ValidateFunction = (value: any) => IValidationResult;

export interface IValidationResult {
    valid: boolean;
    value?: any;
    errors?: IValidationError[];
}

export interface IValidationError {
    message: string;
    errorType?: string;
    path?: string;

    [index: string]: any;
}

export interface IValgenOptions {
    defaultType?: string;
    throwOnError?: boolean;
    schemaLookup?: TypeLookupMethod;
}

export class Valgen implements IValgenOptions {
    protected _cache: { [name: string]: object };
    protected _lookupSchemas: { [name: string]: object };
    protected _uses: { [name: string]: Valgen };
    protected _stacks: string[][];
    defaultType: string;
    schemaLookup?: TypeLookupMethod;
    baseTypes: { [name: string]: object };
    schemas: { [index: string]: TypeDef };
    throwOnError?: boolean;

    constructor(options?: IValgenOptions);

    add(name: string, schema: object);

    clearCache();

    generate(schema: string | object, options?: IGenerateOptions): ValidateFunction;

    define(name: string, factory: TypeFactory): DataType;

    use(name: string, library: Valgen): void;

    protected getType(schemaOrName: string | object): DataType;

    protected _normalizeSchema(schema: TypeDef): object;

    protected _parseTypeName(v: string): TypeDef;

}
