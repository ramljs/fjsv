import {DataType} from "./DataType";

declare type TypeSchemaDef = string | TypeSchema;

declare type TypeLookupMethod = (typeName: string) => TypeSchemaDef;

export interface TypeSchema {
    type: string;

    [key: string]: any;
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
    protected _instances: { [name: string]: DataType };
    protected _lookupSchemas: { [name: string]: TypeSchema };
    protected _stacks: string[][];
    private _idSeq: number;
    defaultType: string;
    baseTypes: { [name: string]: DataType };
    schemaLookup?: TypeLookupMethod;
    schemas: { [index: string]: TypeSchemaDef };
    throwOnError?: boolean;

    constructor(options?: IValgenOptions);

    addSchema(name: string, schema: TypeSchemaDef);

    clearCache();

    generate(schema: TypeSchemaDef, options?: IGenerateOptions): ValidateFunction;

    define(name: string, factory: TypeFactory): DataType;

    normalizeSchema(schema: TypeSchemaDef): TypeSchema;

    getType(name: TypeSchemaDef): DataType;

    setOption(key: string, value: any): void;

    protected _lookupForSchema(name: string): TypeSchemaDef;

    protected _getBaseTypeName(schema: TypeSchemaDef): string;

    protected _parseTypeName(v: string): TypeSchemaDef;

    protected get _stack(): string[];

}
