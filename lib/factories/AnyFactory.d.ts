import {Valgen} from "../Valgen";
import {DataType} from "../DataType";

export namespace AnyFactory {
    export interface FunctionData {
        code: string;
        variables?: {
            [index: string]: any;
        };
    }
    export interface TypeSchema extends Valgen.ITypeSchema {
        default?: any;
    }
}

export class AnyFactory implements Valgen.ITypeFactory {

    schema: AnyFactory.TypeSchema;
    options: any;

    generate(type: DataType, options?: Valgen.IGenerateOptions): Valgen.ValidateFunction;

    normalizeAttribute: (attr: string, value: any) => any;

    normalizeCompileOptions(options?: Valgen.IGenerateOptions): Valgen.IGenerateOptions;

    protected _generateValidationCode(dataType: DataType, options: Valgen.IGenerateOptions): AnyFactory.FunctionData;
}
