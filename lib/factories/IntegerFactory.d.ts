import {NumberFactory, IntegerFormat, INumberTypeOptions} from './NumberFactory';


export interface IIntegerTypeOptions extends INumberTypeOptions {
    defaultFormat?: IntegerFormat;
}

export class IntegerFactory extends NumberFactory {

    defaultFormat?: IntegerFormat;

    constructor(options?: IIntegerTypeOptions);
}
