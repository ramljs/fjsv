import {AnyType} from './AnyType';

export class ObjectType extends AnyType {
    discriminator?: string;
    discriminatorValue?: any;
    additionalProperties?: boolean;
    minProperties?: number;
    maxProperties?: number;
    isTypeOf: (value: any, t: ObjectType) => boolean;
    properties: {
        [index: string]: Property;
    };

    addProperty(name: string, prop: object | AnyType): Property;

    addProperties(properties: { [index: string]: object | AnyType }): this;

}

declare class Property {
    owner: ObjectType;
    name: string;
    type: AnyType;
    required?: boolean | string[];
}
