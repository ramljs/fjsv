import DataType from '../DataType';

export default class FileType extends DataType {
    fileTypes?: string[];
    minLength?: number;
    maxLength?: number;
}
