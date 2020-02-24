import {DataType} from './DataType';

export class ObjectType extends DataType {
    properties?: { [key: string]: DataType }
}
