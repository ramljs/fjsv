import DataType from '../DataType';

export default class ObjectType extends DataType {
    discriminator?: string;
    discriminatorValue?: any;
    additionalProperties?: boolean;
    minProperties?: number;
    maxProperties?: number;
    isTypeOf: (value: any, t: ObjectType) => boolean;
    properties: {
        [index: string]: DataType;
    };

    addProperty(name: string, prop: object | DataType): DataType;

    addProperties(properties: { [index: string]: object | DataType });

}
