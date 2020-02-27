import {NumberFactory} from './NumberFactory';

export namespace IntegerFactory {
    export interface IOptions extends NumberFactory.IOptions {
        defaultFormat?: NumberFactory.IntegerFormatType;
    }
}

export class IntegerFactory extends NumberFactory {

    defaultFormat?: NumberFactory.IntegerFormatType;

    constructor(options?: IntegerFactory.IOptions);
}
