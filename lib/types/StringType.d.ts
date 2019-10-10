import DataType from '../DataType';

export default class StringType extends DataType {
    enum?: string[];
    pattern?: string;
    minLength?: number;
    maxLength?: number;

}
