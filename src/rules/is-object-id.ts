import validatorJS from 'validator';
import {
  Context, Nullish,
  ValidationOptions, validator
} from '../core/index.js';

export declare interface ObjectIdLike {
  id: string | Uint8Array;

  toHexString(): string;
}

/**
 * Validates if value is an "ObjectId".
 * @validator isObjectId
 */
export function isObjectId(options?: ValidationOptions) {
  return validator<string | Uint8Array | ObjectIdLike, unknown>('isObjectId',
      function (input: any, context: Context, _this): Nullish<string | Uint8Array | ObjectIdLike> {
        if (input != null &&
            (_isObjectIdValue(input) ||
                (
                    typeof input === 'object' &&
                    typeof input.toHexString === 'function' &&
                    _isObjectIdValue(input.toHexString())
                )
            )
        ) return input;
        context.fail(_this, `"{{value}}" is not a valid ObjectId`, input);
      }, options
  );
}

function _isObjectIdValue(input: string | Uint8Array): boolean {
  return (input instanceof Uint8Array && input.length === 12) ||
      (typeof input === 'string' && input.length === 24 && validatorJS.isHexadecimal(input))
}
