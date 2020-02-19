import {TypeLibrary, ICompileOptions, TypeFactory, ValidateFunction} from "./TypeLibrary";

export declare const Failed: unique symbol;

export class DataType {
    readonly library: TypeLibrary;
    readonly typeName: string;
    readonly factory: TypeFactory;
    name?: string;

    extend(instance?: object): DataType;

    clone(): DataType;

    generate(options?: ICompileOptions): ValidateFunction;

    get(attr: string): any;

    set(attribute: string, value: any);

}
