import DataType from "./DataType";
import TypeLibrary from "./TypeLibrary";

export default class GeneratorContext {

    constructor(library: TypeLibrary);

    wrap(org: DataType): DataType;

    getFn(wrapped: DataType, options: any): Function;

    setFn(wrapped: DataType, options: any, fn: Function)

}
