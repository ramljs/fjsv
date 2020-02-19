import {ICompileOptions, IValidationError, TypeFactory, ValidateFunction} from "../TypeLibrary";
import {DataType} from "../DataType";

export interface IFunctionData {
    code: string;
    variables?: {
        [index: string]: any;
    };
}

export declare type ErrorLogFunction = (err: IValidationError) => void;
export declare type InternalValidateFunction = (v: any, path: string, error: ErrorLogFunction, ...args: any[]) => any;

export class AnyType implements TypeFactory {
    default?: any;
    enum?: any[];

    assign(dataType: DataType, schema: object);

    compile(dataType: DataType, options?: ICompileOptions, orgOptions?: ICompileOptions): ValidateFunction;

    prepareCompileOptions(options?: ICompileOptions): ICompileOptions;

    protected _generateValidationCode(dataType: DataType, options: ICompileOptions, orgOptions?: ICompileOptions): IFunctionData;
}
