/// <reference types="node" />
import {IValgenOptions} from './Valgen';
declare function valgen(options?: IValgenOptions);

declare namespace valgen {
    export * from './Valgen';
    export * from './RamlLibrary';
    export * from './factories/AnyFactory';
    export * from './factories/ArrayFactory';
    export * from './factories/BooleanFactory';
    export * from './factories/DateFactory';
    export * from './factories/IntegerFactory';
    export * from './factories/NilFactory';
    export * from './factories/NumberFactory';
    export * from './factories/ObjectFactory';
    export * from './factories/StringFactory';
    export * from './factories/UnionFactory';
    export * from './factories/FunctionFactory';
    export * from './factories/Base64Factory';
}

export = valgen;
