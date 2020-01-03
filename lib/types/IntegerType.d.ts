import NumberType, {IntegerFormat} from './NumberType';

export interface IIntegerTypeOptions {
    format?: IntegerFormat;
}

export default class IntegerType extends NumberType {

    format?: IntegerFormat;

    constructor(options?: IIntegerTypeOptions);
}
