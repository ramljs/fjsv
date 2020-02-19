import {NumberType, IntegerFormat} from './NumberType';

export interface IIntegerTypeOptions {
    format?: IntegerFormat;
}

export class IntegerType extends NumberType {

    format?: IntegerFormat;

    constructor(options?: IIntegerTypeOptions);
}
