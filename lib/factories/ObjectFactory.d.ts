import {AnyFactory} from './AnyFactory';
import {Valgen} from '../Valgen';
import {DataType} from '../DataType';

export namespace ObjectFactory {
    export interface IPropertySchema extends Valgen.ITypeSchema {
        required?: boolean;
    }
    export interface ITypeSchema extends Valgen.ITypeSchema {
        discriminator?: string;
        discriminatorValue?: any;
        additionalProperties?: boolean;
        minProperties?: number;
        maxProperties?: number;
        isTypeOf: (value: any, t: ObjectFactory) => boolean;
        properties: {
            [index: string]: IPropertySchema;
        };
    }
    export interface IOptions {
        required?: boolean;
        additionalProperties?: boolean;
    }
}

export class ObjectFactory extends AnyFactory {
    schema: ObjectFactory.ITypeSchema;
    options: {
        required?: boolean;
        additionalProperties?: boolean;
    };
    properties: {
        [index: string]: DataType;
    };

    constructor(options?: ObjectFactory.IOptions);

}
