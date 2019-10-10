import TypeLibrary from "./TypeLibrary";

export declare type IAttributes = { [index: string]: any };

export interface IValidationError {
    message: string;
    errorType?: string;
    path?: string;

    [index: string]: any;
}

export interface IValidatorOptions {
    maxObjectErrors?: number;
    maxArrayErrors?: number;
    throwOnError?: boolean;
    strictTypes?: boolean;
    coerceTypes?: boolean;
    convertDates?: boolean;
    removeAdditional?: boolean | 'all';
    fastDateValidation?: boolean;
    fastObjectValidation?: boolean;
    ignoreRequire?: boolean | string[];
}

export interface IValidatorGenerateOptions extends IValidatorOptions {
    isUnion?: boolean;
}

export interface IValidateResult {
    valid: boolean;
    value?: any;
    errors?: IValidationError[];
}

export interface IFunctionData {
    code: string;
    variables?: {
        [index: string]: any;
    };
}

export declare type ValidateFunction = (value: any) => IValidateResult;
export declare type LogFunction = (err: IValidationError) => void;
export declare type InternalValidateFunction = (v: any, path: string, error: LogFunction, ...args: any[]) => any;

export default class DataType {
    library: TypeLibrary;
    type: DataType[];
    attributes: IAttributes;
    readonly baseName: string;
    name: string;
    required?: boolean;
    default?: any;
    readonly?: boolean;
    writeonly?: boolean;

    constructor(library?: TypeLibrary);

    assign(values: IAttributes, overwrite?: boolean);

    createNew(library: TypeLibrary, def?: IAttributes);

    clone(): DataType;

    bake();

    flatten(): DataType[];

    validator(options?: IValidatorOptions): ValidateFunction;

    protected _getRequired(): boolean;

    protected _getDefault(): any;

    protected _assignAttributes(keys: string[], values: { [index: string]: any },
                                overwrite?: boolean);

    protected _generateValidateFunction(options: IValidatorOptions): InternalValidateFunction;

    protected _generateValidationCode(options: IValidatorGenerateOptions): IFunctionData;
}
