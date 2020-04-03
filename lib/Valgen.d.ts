import {DataType} from "./DataType";

export namespace Valgen {
    export type TypeSchemaDef = string | ITypeSchema;
    export type TypeLookupMethod = (typeName: string) => TypeSchemaDef;

    export interface ITypeSchema {
        type: string;

        [key: string]: any;
    }

    export interface ITypeFactory {
        generate: (base: DataType, options?: IGenerateOptions) => ValidateFunction;
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
        // 'get' | 'create' | 'update' | 'patch' | 'delete'
        operation?: string;
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

    export interface IOptions {
        defaultType?: string;
        throwOnError?: boolean;
        schemaLookup?: TypeLookupMethod;
    }
}

export class Valgen implements Valgen.IOptions {
    protected _instances: { [name: string]: DataType };
    protected _lookupSchemas: { [name: string]: Valgen.ITypeSchema };
    protected _stacks: string[][];
    private _idSeq: number;
    defaultType: string;
    baseTypes: { [name: string]: DataType };
    schemaLookup?: Valgen.TypeLookupMethod;
    schemas: { [index: string]: Valgen.TypeSchemaDef };
    throwOnError?: boolean;

    constructor(options?: Valgen.IOptions);

    addSchema(name: string, schema: Valgen.TypeSchemaDef);

    clearCache();

    generate(schema: Valgen.TypeSchemaDef, options?: Valgen.IGenerateOptions): Valgen.ValidateFunction;

    define(name: string, factory: Valgen.ITypeFactory): DataType;

    normalizeSchema(schema: Valgen.TypeSchemaDef): Valgen.ITypeSchema;

    getType(name: Valgen.TypeSchemaDef): DataType;

    setOption(key: string, value: any): void;

    protected _lookupForSchema(name: string): Valgen.TypeSchemaDef;

    protected _getBaseTypeName(schema: Valgen.TypeSchemaDef): string;

    protected _parseTypeName(v: string): Valgen.TypeSchemaDef;

    protected get _stack(): string[];

}
