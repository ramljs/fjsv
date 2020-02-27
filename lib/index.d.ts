import {Valgen} from './Valgen';
export function vg(options?: Valgen.IOptions): Valgen;
export default vg;

export * from './Valgen';
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

declare module "vg";
