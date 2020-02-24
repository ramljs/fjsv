import {IGenerateOptions, TypeFactory, TypeSchema, ValidateFunction} from "../Valgen";
import {DataType} from "../DataType";

export interface IFunctionData {
    code: string;
    variables?: {
        [index: string]: any;
    };
}

export interface IAnyTypeSchema extends TypeSchema {
    default?: any;
}

export class AnyFactory implements TypeFactory {

    schema: IAnyTypeSchema;
    options: any;

    generate(type: DataType, options?: IGenerateOptions, orgOptions?: IGenerateOptions): ValidateFunction;

    normalizeAttribute: (attr: string, value: any) => any;

    normalizeCompileOptions(options?: IGenerateOptions): IGenerateOptions;

    protected _generateValidationCode(dataType: DataType, options: IGenerateOptions, orgOptions?: IGenerateOptions): IFunctionData;
}
