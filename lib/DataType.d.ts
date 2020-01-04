import {TypeLibrary, ICompileOptions, TypeFactory, ValidateFunction} from "./TypeLibrary";

export declare const Failed: unique symbol;

export class DataType {
    readonly library: TypeLibrary;
    readonly typeName: string;
    readonly factory: TypeFactory;
    name?: string;

    create(instance?: object): DataType;

    clone(): DataType;

    compile(options?: ICompileOptions): ValidateFunction;

    set(attribute: string, value: any);

}
