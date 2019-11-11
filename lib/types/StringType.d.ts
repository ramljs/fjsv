import AnyType from './AnyType';

export default class StringType extends AnyType {
    default?: string;
    enum?: string[];
    minLength?: number;
    maxLength?: number;
}
