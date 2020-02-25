import {AnyFactory} from './AnyFactory';
import {TypeSchema} from '../Valgen';
import {DataType} from '../DataType';

export interface IObjectPropertySchema extends TypeSchema {
    required?: boolean;
}

export interface IObjectTypeSchema extends TypeSchema {
    discriminator?: string;
    discriminatorValue?: any;
    additionalProperties?: boolean;
    minProperties?: number;
    maxProperties?: number;
    isTypeOf: (value: any, t: ObjectFactory) => boolean;
    properties: {
        [index: string]: IObjectPropertySchema;
    };
}

export interface IObjectTypeOptions {
    required?: boolean;
    additionalProperties?: boolean;
}

export class ObjectFactory extends AnyFactory {
    schema: IObjectTypeSchema;
    options: {
        required?: boolean;
        additionalProperties?: boolean;
    };
    properties: {
        [index: string]: DataType;
    };

    constructor(options?: IObjectTypeOptions);

}
