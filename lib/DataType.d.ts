import {Valgen} from "./Valgen";

export declare const Failed: unique symbol;

export class DataType {
    readonly library: Valgen;
    readonly typeName: string;
    readonly factory: Valgen.ITypeFactory;
    readonly predecessors?: DataType[];
    id: number;
    name?: string;
    schema: { [index: string]: any };

    constructor(library: Valgen, typeName: string, factory: Valgen.ITypeFactory);

    create(instance: any, schema: any): DataType;

    generate(options?: Valgen.IGenerateOptions): Valgen.ValidateFunction;

    get(attr: string): any;

    set(key: string, value: any);

    [index: string]: any;
}
