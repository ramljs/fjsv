import {NumberFactory} from './NumberFactory';

export namespace IntegerFactory {
    export interface IOptions extends NumberFactory.IOptions {
        format?: NumberFactory.IntegerFormatType;
    }
}

export class IntegerFactory extends NumberFactory {

    format?: NumberFactory.IntegerFormatType;

    constructor(options?: IntegerFactory.IOptions);
}
