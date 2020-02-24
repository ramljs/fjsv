import {Valgen, IGenerateOptions, TypeFactory, ValidateFunction} from "./Valgen";

export declare const Failed: unique symbol;

export class DataType {
    readonly library: Valgen;
    readonly typeName: string;
    readonly factory: TypeFactory;
    readonly predecessors?: DataType[];
    id: number;
    name?: string;
    schema: { [index: string]: any };

    constructor(library: Valgen, typeName: string, factory: TypeFactory);

    create(instance: any, schema: any): DataType;

    generate(options?: IGenerateOptions): ValidateFunction;

    get(attr: string): any;

    set(key: string, value: any);

    [index: string]: any;
}
